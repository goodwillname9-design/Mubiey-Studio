'use strict';
const pixelClamp=(v,a=0,b=255)=>Math.max(a,Math.min(b,v));
function gradePixels(input,settings){
 const {width:w,height:h}=input;const result=new ImageData(new Uint8ClampedArray(input.data),w,h),d=result.data;
 const exposure=2**settings.exposure,contrast=1+settings.contrast/100,saturation=1+settings.saturation/100;
 const lut=new Float32Array(256);for(let n=0;n<256;n++)lut[n]=((n/255*exposure-.5)*contrast+.5)*255;
 const red=settings.warmth*.58+settings.tint*.16,green=-settings.tint*.34,blue=-settings.warmth*.58+settings.tint*.16;
 const fade=pixelClamp(settings.fade,0,50)*.006,shadow=settings.shadows*.95,highlight=settings.highlights*.95;
 const vig=settings.vignette/100,grain=settings.grain*.17;let seed=173;
 for(let y=0;y<h;y++){const ny=(2*y/h-1)**2;for(let x=0;x<w;x++){
  const i=(y*w+x)*4;let r=lut[d[i]],g=lut[d[i+1]],b=lut[d[i+2]];const l=pixelClamp((.2126*r+.7152*g+.0722*b)/255,0,1);
  const lift=shadow*(1-l)**2+highlight*l*l;
  r+=red+lift;g+=green+lift;b+=blue+lift;const lum=.2126*r+.7152*g+.0722*b;
  r=lum+(r-lum)*saturation;g=lum+(g-lum)*saturation;b=lum+(b-lum)*saturation;
  const edge=pixelClamp(((2*x/w-1)**2+ny-.22)/1.78,0,1),shade=1-vig*edge;
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=grain?((seed>>>16)/65535-.5)*grain*3:0;
  d[i]=(r*(1-fade)+255*fade*.5)*shade+noise;d[i+1]=(g*(1-fade)+255*fade*.5)*shade+noise;d[i+2]=(b*(1-fade)+255*fade*.5)*shade+noise;
 }}return typeof proGrade==='function'?proGrade(result,settings):result;
}

function proGrade(image,s){
 const d=image.data,w=image.width,h=image.height;
 const curves=s.curves||{},hsl=s.hsl||{};
 const lut=points=>{const p=points||[0,64,128,192,255],out=new Float32Array(256);for(let n=0;n<256;n++){let k=Math.min(3,Math.floor(n/64)),left=k*64,right=k===3?255:(k+1)*64;out[n]=p[k]+(p[k+1]-p[k])*(n-left)/(right-left)}return out};
 const master=lut(curves.rgb),rCurve=lut(curves.r),gCurve=lut(curves.g),bCurve=lut(curves.b);
 const activeHSL=Object.values(hsl).some(v=>v.some(n=>n));
 for(let i=0;i<d.length;i+=4){let r=d[i]/255,g=d[i+1]/255,b=d[i+2]/255,l=.2126*r+.7152*g+.0722*b;
 const lift=(s.whites||0)/180*l**4+(s.blacks||0)/180*(1-l)**4;r+=lift;g+=lift;b+=lift;
 const chroma=Math.max(r,g,b)-Math.min(r,g,b),v=1+(s.vibrance||0)/100*(1-chroma);r=l+(r-l)*v;g=l+(g-l)*v;b=l+(b-l)*v;
 const haze=(s.dehaze||0)/150;r=(r-.5)*(1+haze)+.5;g=(g-.5)*(1+haze)+.5;b=(b-.5)*(1+haze)+.5;
 if(activeHSL){const max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min;let hue=delta===0?0:max===r?((g-b)/delta)%6:max===g?(b-r)/delta+2:(r-g)/delta+4;hue=(hue*60+360)%360;const light=(max+min)/2;let sat=delta===0?0:delta/(1-Math.abs(2*light-1)||1),hh=0,ss=0,ll=0;
 for(const [key,values]of Object.entries(hsl)){const distance=Math.min(Math.abs(hue-Number(key)),360-Math.abs(hue-Number(key))),weight=Math.max(0,1-distance/50);hh+=values[0]*weight*.5;ss+=values[1]*weight/100;ll+=values[2]*weight/200}hue=(hue+hh+360)%360;sat=pixelClamp(sat*(1+ss),0,1);const L=pixelClamp(light+ll,0,1),c=(1-Math.abs(2*L-1))*sat,x=c*(1-Math.abs(hue/60%2-1)),m=L-c/2;[r,g,b]=hue<60?[c,x,0]:hue<120?[x,c,0]:hue<180?[0,c,x]:hue<240?[0,x,c]:hue<300?[x,0,c]:[c,0,x];r+=m;g+=m;b+=m;}
 const toning=(s.shadowTint||0)/350*(1-l)**2,highlight=(s.highlightTint||0)/350*l*l;r+=toning+highlight;b-=toning+highlight;
 d[i]=rCurve[Math.round(pixelClamp(master[Math.round(pixelClamp(r*255))]))];d[i+1]=gCurve[Math.round(pixelClamp(master[Math.round(pixelClamp(g*255))]))];d[i+2]=bCurve[Math.round(pixelClamp(master[Math.round(pixelClamp(b*255))]))];
 }
 if(s.sharpness||s.clarity||s.denoise){const original=new Uint8ClampedArray(d);const sharp=(s.sharpness||0)/100,clarity=(s.clarity||0)/100,soft=(s.denoise||0)/100;
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=(y*w+x)*4;for(let c=0;c<3;c++){const near=(original[i-4+c]+original[i+4+c]+original[i-w*4+c]+original[i+w*4+c])/4;const v=original[i+c];d[i+c]=v+(v-near)*sharp*1.8+(v-128)*clarity*.12+(near-v)*soft*.6}}}
 return image;
}

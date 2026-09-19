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
 }}return result;
}

/* Original colour recipes, not proprietary Adobe or third-party preset packs. */
const FAMILY_DATA = [
 ['Timeless','Balanced colour, luminous whites and gentle contrast.','#b6ac92','#666956',{exposure:.06,contrast:7,saturation:-3,warmth:2,tint:0,fade:2,shadows:6,highlights:-8,vignette:3,grain:0}],
 ['Golden','Honey highlights and warm, sunlit skin tones.','#d9b271','#716143',{exposure:.09,contrast:3,saturation:5,warmth:20,tint:1,fade:3,shadows:5,highlights:-12,vignette:5,grain:0}],
 ['Airy','Soft contrast, lifted shadows and delicate colour.','#d9d4bd','#999884',{exposure:.24,contrast:-12,saturation:-10,warmth:5,tint:3,fade:7,shadows:18,highlights:-16,vignette:0,grain:0}],
 ['Editorial','Crisp contrast and restrained magazine-inspired colour.','#aaa69c','#414d4b',{exposure:-.04,contrast:19,saturation:-15,warmth:-3,tint:1,fade:1,shadows:-5,highlights:-8,vignette:8,grain:0}],
 ['Moody','Deep shadows, muted greens and intimate warmth.','#94836d','#353e36',{exposure:-.2,contrast:13,saturation:-22,warmth:8,tint:0,fade:5,shadows:-12,highlights:-18,vignette:18,grain:2}],
 ['Rose','Blush highlights with a soft, romantic pink cast.','#c5a0a0','#786166',{exposure:.12,contrast:-5,saturation:-9,warmth:4,tint:16,fade:5,shadows:10,highlights:-12,vignette:4,grain:0}],
 ['Film','Lifted blacks, restrained colour and fine film grain.','#bca98a','#5b665d',{exposure:.04,contrast:8,saturation:-18,warmth:9,tint:-3,fade:14,shadows:4,highlights:-13,vignette:10,grain:12}],
 ['Monochrome','Black-and-white tonal treatments for timeless portraits.','#d2d0c9','#454848',{exposure:.06,contrast:13,saturation:-100,warmth:0,tint:0,fade:2,shadows:3,highlights:-10,vignette:8,grain:2}],
 ['Ceremony','Rich fabric colour and balanced, warm indoor light.','#c4a46c','#684a37',{exposure:.08,contrast:10,saturation:13,warmth:7,tint:3,fade:1,shadows:8,highlights:-20,vignette:5,grain:0}],
 ['Garden','Fresh greens, soft highlights and open-air colour.','#b3bd8e','#53694f',{exposure:.13,contrast:2,saturation:6,warmth:-3,tint:-8,fade:3,shadows:12,highlights:-12,vignette:4,grain:0}],
 ['Coastal','Cool whites, blue shadows and a light ocean feel.','#b1c4c2','#627883',{exposure:.17,contrast:-4,saturation:-7,warmth:-15,tint:-3,fade:4,shadows:11,highlights:-10,vignette:3,grain:0}],
 ['Evening','Warm highlights and deeper tones for evening celebrations.','#b5a08c','#514852',{exposure:-.05,contrast:12,saturation:-8,warmth:13,tint:7,fade:4,shadows:10,highlights:-25,vignette:14,grain:3}]
];
const VARIANT_NAMES = [
 ['Vows','Heirloom','Pearl','Promise','Pure','Keepsake','Grace','Together','Evermore','Forever'],
 ['Golden Hour','Honey','Sunlit','Champagne','Amber','Sundown','Marigold','Warm Embrace','Afterglow','Golden Vows'],
 ['Daydream','Silk','Whisper','Cloud Nine','Soft Light','Ivory','Feather','First Light','Luminous','Breeze'],
 ['Cover Story','Modern Muse','Gallery','Runway','Portrait','Atelier','Clean Lines','Signature','Fine Art','No. Ten'],
 ['Velvet','Quiet Hours','Cedar','Deep Olive','Twilight','Earthbound','Secret Garden','Stillness','Nocturne','Dark Romance'],
 ['Blush','Petal','Rosé','Tender','Peony','Rosewater','Soft Romance','Magnolia','Dusty Rose','Love Letter'],
 ['Frame 01','Nostalgia','Sunday','Analog Warm','Soft Grain','Archive','Memory Lane','Matte Print','Cinema','Old Letters'],
 ['Silver','Classic B&W','Charcoal','Soft Mono','High Contrast','Silhouette','Grain & Light','Pure Mono','Noir','Silver Print'],
 ['Festive','Saffron','Heritage','Sacred Light','Crimson','Celebration','Lamps & Silk','Jewels','Rich Colour','Mandap'],
 ['Meadow','Botanical','Wildflower','Greenhouse','Olive','Morning Dew','Orchard','Eucalyptus','Spring Vows','Fern'],
 ['Sea Glass','Salt Air','Blue Hour','Driftwood','White Sands','Shoreline','Azure','Tidal','Sea Breeze','Horizon'],
 ['Candlelight','Reception','Last Dance','City Lights','Sparkler','Moonlit','Ballroom','Warm Night','Lantern','Midnight']
];
const VARIATIONS = [
 [0,0,0,0,0,0,0],[.08,-5,-4,2,1,2,0],[.03,4,-8,-4,2,1,1],[.12,-8,-2,4,-1,5,-2],[-.06,10,6,0,0,0,3],[-.1,7,-12,7,2,4,5],[.02,-2,10,-5,-3,3,-1],[-.03,5,-5,3,4,8,2],[.07,-3,-10,-2,6,6,0],[-.07,9,3,6,-2,2,4]
];
const PRESETS = FAMILY_DATA.flatMap((f,fi)=>VARIATIONS.map((v,vi)=>{
 const s={...f[4]};s.exposure+=v[0];s.contrast+=v[1];s.saturation=fi===7?-100:s.saturation+v[2];s.warmth+=fi===7?0:v[3];s.tint+=fi===7?0:v[4];s.fade+=v[5];s.vignette=Math.max(0,s.vignette+v[6]);
 if(fi===7){s.contrast+=[-5,0,9,-15,20,14,-2,3,22,-8][vi];s.grain=[0,2,5,1,0,3,20,0,9,14][vi];s.fade+=[0,1,3,8,0,2,10,0,1,6][vi];}
 return {id:`${fi+1}-${vi+1}`,family:f[0],name:VARIANT_NAMES[fi][vi],description:f[1],colours:[f[2],f[3]],index:fi*10+vi+1,settings:s};
}));
if(typeof module!=='undefined')module.exports={PRESETS,FAMILY_DATA};

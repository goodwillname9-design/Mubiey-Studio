'use strict';
const LIVE_LAYOUTS=['Lavender wreath','Ivory editorial','Royal palace arch','Dark botanical','Porcelain garden','Watercolor meadow','European baroque','Indian marigold','Glasshouse garden','Lotus romance','Boho dried flowers','Muslim geometric','Hindu mandap','Christian chapel','Neutral letterpress','Gold medallion','Floral doorway','Garden journal','Moonlit ceremony','Fine-art stems','Silk ribbon','Ornate courtyard','Minimal monogram','Heritage columns','Celestial vows','Saffron canopy','Arabesque night'];
const LIVE_PALETTES=[['emerald','Emerald'],['ivory','Ivory'],['rose','Rose'],['midnight','Midnight'],['saffron','Saffron'],['sage','Sage']];
const LIVE_VARIANTS=[['wreath','Wreath'],['editorial','Editorial'],['arch','Arch'],['garden','Garden']];
const LIVE_PRESETS=LIVE_LAYOUTS.flatMap((name,layout)=>LIVE_VARIANTS.map(([variant,label],index)=>({id:`premium-${layout}-${index}`,theme:LIVE_PALETTES[layout%LIVE_PALETTES.length][0],layout,variant,name:`${name} · ${label}`,premium:true})));
function livePresetCSS(layout=0){const css=[
 '.hero{min-height:95vh}.hero h1{font-size:clamp(48px,9vw,100px)}',
 '.hero{align-items:flex-start;text-align:left;padding:100px 10%}.hero h1{font-style:italic}.amp{margin-left:20px}.frame{border-width:0 0 1px}.section h2{font-style:italic}',
 '.hero.has-photo{padding-top:420px;min-height:100vh}.hero .cover{height:380px}.hero .shade{height:380px;background:linear-gradient(transparent,#0005)}.hero.has-photo{color:inherit;text-shadow:none}.hero.has-photo .overline{color:inherit}.frame{inset:15px}',
 '.hero{margin:20px;border-radius:45% 45% 0 0;min-height:860px}.frame{border-radius:45% 45% 0 0}.hero h1{font-style:italic}.section{padding-top:75px;padding-bottom:75px}',
 '.hero h1{font-size:clamp(37px,7vw,70px);text-transform:uppercase;letter-spacing:4px}.amp{border:1px solid currentColor;border-radius:50%;width:75px;height:75px;line-height:75px;margin:12px}.frame{border:3px double currentColor}.overline{letter-spacing:4px}',
 '.hero{min-height:700px}.frame{inset:32px;border-radius:180px 180px 0 0}.section h2{font-style:italic}.couple img{border-radius:50% 50% 0 0}.gallery{gap:25px}',
 '.hero h1{font-family:Arial,sans-serif;font-weight:700;letter-spacing:-3px}.amp{font-family:Arial,sans-serif}.frame{border:0;border-bottom:8px solid currentColor;inset:35px}.section h2{font-family:Arial,sans-serif;font-size:30px}.overline{font-size:12px}',
 '.hero{min-height:760px}.hero h1{font-style:italic;font-weight:400}.hero .date{border-top:1px solid currentColor;padding-top:22px}.frame{border-style:dashed}.message{font-size:21px}.gallery img{border:9px solid white;box-shadow:0 4px 18px #0002}',
 '.frame{border:5px double currentColor;inset:24px}.hero{min-height:920px}.overline{letter-spacing:5px}.amp{font-size:54px}.section h2{font-size:40px}.event{border-top-style:double}',
 '.hero{min-height:640px;padding:65px 30px}.hero h1{font:400 52px Arial,sans-serif;letter-spacing:-2px}.frame{display:none}.amp{font-size:25px}.section{padding:45px 30px}.overline{font-size:10px;letter-spacing:2px}',
 '.hero{min-height:850px}.gallery{grid-template-columns:1fr}.gallery img{height:480px!important}.couple{gap:12px}.couple img{border-radius:0}.frame{inset:12px}.hero h1{font-style:italic}',
 '.hero .shade{background:linear-gradient(#5b330b44,#362113bb)}.hero h1{font-size:clamp(50px,9vw,90px);font-style:italic}.frame{border-width:0 0 1px}.countdown{border-top:1px solid currentColor;padding-top:25px}',
 '.hero h1{font-size:clamp(40px,7vw,70px);letter-spacing:2px}.frame{inset:22px;border:3px double currentColor;border-radius:180px 180px 0 0}.event{padding:30px}.section .overline{letter-spacing:4px}',
 '.hero .shade{background:linear-gradient(#0b102444,#05091de6)}.hero{min-height:950px}.hero h1{font-family:Arial,sans-serif;font-weight:300}.amp{font-size:50px}.frame{inset:35px;border-width:0 1px}.gallery{gap:5px}',
 '.hero{min-height:760px}.hero h1{font-size:clamp(45px,8vw,90px);font-style:italic}.frame{inset:14px;border:1px solid currentColor;outline:1px solid currentColor;outline-offset:8px}.couple img{filter:grayscale(1)}.message{font-size:22px}',
 '.hero{min-height:780px}.hero h1{font-size:clamp(48px,8vw,82px)}.amp{font-size:65px;line-height:1.1}.frame{border-radius:250px;inset:20px}.couple img{border-radius:50%}.gallery img{border-radius:120px 120px 0 0}',
 '.hero{min-height:700px}.hero .overline{font-size:12px}.hero h1{text-transform:uppercase;font-size:clamp(34px,6vw,60px);letter-spacing:6px}.frame{border-width:12px 1px;inset:20px}.section h2{font-family:Arial,sans-serif;font-size:27px}.gallery img{height:240px}',
 '.hero{min-height:720px}.hero h1{font-size:clamp(40px,7vw,72px)}.frame{inset:55px;border-width:1px 0}.overline{font-size:9px;letter-spacing:4px}.section{padding:85px 30px}.couple img{border-radius:0}.countdown b{font-size:30px}'
];return css[Number(layout)]||css[0]}

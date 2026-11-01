/* Mubiey Studio · "Your invitation card" for EVERY live invitation.
   If the owner uploaded a card (PDF or PNG/JPG/WebP), guests who scroll to the bottom see
   "Your invitation card · please take" and can view it full screen and download it.
   It wraps invitationDocument() last, so it works with every template (including the ones that scroll
   inside their own container) and in the editor preview. Owner-only text comes from the form:
   cardTitle, cardNote, cardButton, cardDownload. Must be loaded AFTER all template scripts. */
'use strict';
(()=>{
if(typeof invitationDocument!=='function')return;
const base=invitationDocument,esc=v=>Studio.escape(v);
const REF=/^\/media\/[a-f0-9-]{36}\/[a-f0-9-]{36}$/i,DATA=/^data:(image\/(png|jpeg|webp)|application\/pdf);base64,[A-Za-z0-9+/=]+$/;
const str=(v,max,def)=>(typeof v==='string'&&v.trim()?v.trim().slice(0,max):def);
function cardOf(data){
 const c=window.__mbCardPreview||(data&&data.card);
 if(!c||typeof c.ref!=='string')return null;
 if(!REF.test(c.ref)&&!DATA.test(c.ref))return null;
 const pdf=c.type==='application/pdf'||/^data:application\/pdf/.test(c.ref);
 const name=String(c.name||'Invitation card').replace(/[^\w .()\-]/g,'_').slice(0,100)||'Invitation card';
 return {ref:c.ref,pdf,name,local:c.ref.startsWith('data:')};
}
const CSS=`
#mb-card-end{position:relative;padding:54px 22px 60px;text-align:center;font-family:Georgia,'Times New Roman',serif}
#mb-card-end .mbc-box,.mbc-pill{--g1:#f3dca1;--g2:#c9a050}
.mbc-box{max-width:420px;margin:0 auto;padding:28px 22px 26px;border:1px solid #c9a05099;border-radius:18px;background:linear-gradient(180deg,#ffffff14,#00000012);box-shadow:0 10px 30px #0002}
.mbc-box h2{margin:0 0 6px;font:400 30px/1.2 Georgia,serif}
.mbc-box p{margin:0 0 18px;font:italic 17px/1.6 Georgia,serif;opacity:.85}
.mbc-btn,.mbc-pill{all:unset;box-sizing:border-box;cursor:pointer;display:inline-flex;align-items:center;gap:10px;padding:14px 26px;border-radius:40px;border:1px solid #fff3c9;background:linear-gradient(135deg,var(--g1),var(--g2));color:#3b0711;font:700 12px Arial,sans-serif;letter-spacing:2.4px;text-transform:uppercase;box-shadow:0 8px 22px #0004}
.mbc-btn:focus-visible,.mbc-pill:focus-visible{outline:3px solid #fff;outline-offset:3px}
.mbc-pill{position:fixed;left:50%;bottom:16px;z-index:2147483000;transform:translate(-50%,160%);transition:transform .8s cubic-bezier(.2,.8,.2,1);max-width:calc(100vw - 28px)}
.mbc-pill.on{transform:translate(-50%,0)}
.mbc-pill span{min-width:0;text-align:left}
.mbc-pill small{display:block;font:600 9px Arial,sans-serif;letter-spacing:1.2px;opacity:.75;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:240px}
.mbc-pill b{display:block;font:700 12px Arial,sans-serif;letter-spacing:1.6px;white-space:nowrap}
.mbc-pill:before,.mbc-btn:before{content:'\\1F381';font-size:18px;letter-spacing:0}
.mbc-pill.on{animation:mbc-pop 2.8s ease-in-out 1s infinite}
@keyframes mbc-pop{0%,100%{box-shadow:0 8px 22px #0004,0 0 0 0 #f3dca166}50%{box-shadow:0 8px 22px #0004,0 0 0 12px #f3dca100}}
#mbc-view{position:fixed;inset:0;z-index:2147483600;display:none;flex-direction:column;background:#0b0306;color:#f8ecd6;font-family:Arial,sans-serif}
#mbc-view.on{display:flex}
.mbc-top{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border-bottom:1px solid #ffffff22}
.mbc-top strong{font:600 14px/1.3 Georgia,serif;letter-spacing:.5px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mbc-top button{all:unset;cursor:pointer;width:44px;height:44px;display:grid;place-items:center;font-size:28px;line-height:1;border-radius:50%}
.mbc-top button:focus-visible{outline:2px solid #fff}
.mbc-body{flex:1;min-height:0;overflow:auto;display:flex;align-items:center;justify-content:center;padding:14px;-webkit-overflow-scrolling:touch}
.mbc-body img{max-width:100%;max-height:100%;object-fit:contain;border-radius:6px;box-shadow:0 10px 40px #000;cursor:zoom-in}
.mbc-body.zoom{display:block;text-align:center}.mbc-body.zoom img{max-width:none;max-height:none;width:200%;cursor:zoom-out}
.mbc-pdf{text-align:center;max-width:340px}
.mbc-pdf .ic{width:96px;height:124px;margin:0 auto 18px;border-radius:8px;background:linear-gradient(135deg,#fff,#f1e6d2);color:#8b1424;display:grid;place-items:center;font:700 22px Arial,sans-serif;letter-spacing:2px;box-shadow:0 10px 30px #000a}
.mbc-pdf p{margin:0 0 6px;font:italic 17px/1.5 Georgia,serif}
.mbc-bar{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;padding:12px 14px calc(14px + env(safe-area-inset-bottom,0px));border-top:1px solid #ffffff22}
.mbc-bar a{all:unset;cursor:pointer;box-sizing:border-box;padding:14px 24px;border-radius:40px;font:700 12px Arial,sans-serif;letter-spacing:2.2px;text-transform:uppercase;text-align:center}
.mbc-bar a.p{background:linear-gradient(135deg,#f3dca1,#c9a050);color:#3b0711}
.mbc-bar a.s{border:1px solid #f3dca1aa;color:#f3dca1}
.mbc-bar a:focus-visible{outline:3px solid #fff;outline-offset:3px}
@media(prefers-reduced-motion:reduce){.mbc-pill{transition:none}.mbc-pill.on{animation:none}}
@media print{.mbc-pill,#mbc-view{display:none!important}}`;
function markup(c,t){
 const open=`<button type="button" class="mbc-btn" data-mbc-open>${esc(t.button)}</button>`;
 const dl=c.local?'':`?download=1`;
 const view=`<div id="mbc-view" role="dialog" aria-modal="true" aria-label="${esc(t.title)}"><div class="mbc-top"><strong>${esc(t.title)}</strong><button type="button" data-mbc-close aria-label="Close">×</button></div><div class="mbc-body" id="mbc-body">${c.pdf?`<div class="mbc-pdf"><div class="ic">PDF</div><p>${esc(c.name)}</p></div>`:`<img src="${esc(c.ref)}" alt="${esc(t.title)}">`}</div><div class="mbc-bar"><a class="p" href="${esc(c.ref)}${dl}" ${c.local?`download="${esc(c.name)}"`:''} target="_blank" rel="noopener noreferrer" data-mbc-download>${esc(t.download)}</a><a class="s" href="${esc(c.ref)}" target="_blank" rel="noopener noreferrer">${c.pdf?'Open PDF':'Open full screen'}</a></div></div>`;
 return {
  end:`<section id="mb-card-end" aria-label="${esc(t.title)}"><div class="mbc-box"><h2>${esc(t.title)}</h2><p>${esc(t.note)}</p>${open}</div></section>`,
  pill:`<button type="button" class="mbc-pill" id="mbc-pill" data-mbc-open><span><b>${esc(t.title)}</b><small>${esc(t.note)}</small></span></button>`,
  view
 };
}
const SCRIPT=`(()=>{
const pill=document.getElementById('mbc-pill'),view=document.getElementById('mbc-view'),body=document.getElementById('mbc-body');
if(!view)return;
const open=()=>{view.classList.add('on');const x=view.querySelector('[data-mbc-close]');x&&x.focus()};
const close=()=>{view.classList.remove('on');body&&body.classList.remove('zoom')};
document.addEventListener('click',e=>{if(e.target.closest('[data-mbc-open]')){e.preventDefault();open()}else if(e.target.closest('[data-mbc-close]'))close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
const img=body&&body.querySelector('img');if(img)img.onclick=()=>body.classList.toggle('zoom');
if(pill){
 const end=el=>{const s=(el===document||el===window||el===document.body||el===document.documentElement)?(document.scrollingElement||document.documentElement):el;if(!s||s.scrollHeight===undefined)return false;return s.scrollHeight-s.clientHeight>40&&s.scrollTop+s.clientHeight>=s.scrollHeight-70};
 const show=()=>pill.classList.add('on');
 addEventListener('scroll',e=>{if(end(e.target))show()},true);
 if(window.__MBC_PREVIEW)show();
 else setTimeout(()=>{const s=document.scrollingElement||document.documentElement;if(s.scrollHeight-s.clientHeight<=40)show()},12000);
}
})();`;
invitationDocument=function(data){
 let html=base.apply(this,arguments);
 const c=cardOf(data);
 if(!c||typeof html!=='string')return html;
 const t={title:str(data.cardTitle,80,'Your invitation card'),note:str(data.cardNote,200,'Please take it with our love'),button:str(data.cardButton,40,'View your card'),download:str(data.cardDownload,40,'Download')};
 const m=markup(c,t),flow=/<div class="end">|<\/main>/.test(html)&&!html.includes('class="rs-js"')&&!/id="rs-gate"|class="gate"/.test(html)&&!html.includes('window.RS=');
 let out=html;
 const preview=!!data._editorPreview;
 // normal-flow documents get a section at the end of the page; every other template gets the pill
 if(flow&&/<div class="end">/.test(out))out=out.replace('<div class="end">',m.end+'<div class="end">');
 else if(flow)out=out.replace('</main>',m.end+'</main>');
 const usePill=!(flow);
 out=out.replace('</head>',`<style>${CSS}</style></head>`);
 const pre=preview?'<script>window.__MBC_PREVIEW=1<\/script>':'';
 return out.replace('</body>',`${usePill?m.pill:''}${m.view}${flow?'':''}${pre}<script>${SCRIPT.replace(/<\/script/gi,'<\\/script')}<\/script></body>`);
};
})();

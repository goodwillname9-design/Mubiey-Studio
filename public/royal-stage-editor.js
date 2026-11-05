/* Owner-only editor additions for the "Royal Stage" template (curtains -> chandelier stage -> scroll story).
   Adds a panel with every editable text, an events list, a one-tap "Use Royal Stage" button, and lets the owner
   tap any text in the preview to edit it. New fields are pushed into invitations.js's `fields` list, so the
   existing save / load / preview code stores them with the invitation. Nothing existing is replaced. */
'use strict';
(()=>{
const $=s=>document.querySelector(s);
const ID='royal-stage',IDS=[ID,'2000','2001','2002','2003','2004'];
const preset=$('#live-preset');
if(!preset||typeof fields==='undefined'||typeof markDirty!=='function')return;
const ensure=()=>{for(const id of IDS){const t=INVITATION_TEMPLATES.find(x=>x.id===id);if(t&&![...preset.options].some(o=>o.value===id)){const o=new Option(t.name,id);o.dataset.layout='0';preset.add(o)}}};
ensure();new MutationObserver(ensure).observe(preset,{childList:true});

const host=$('#save')?.closest('.panel');
if(!host)return;
const panel=document.createElement('section');
panel.className='panel';panel.id='rs-panel';panel.hidden=true;
panel.innerHTML='<h2>Royal Stage · your wording</h2><p class="help">Every line of this template is editable. Leave a box empty to use the default wording. You can also tap any text in the preview to edit it.</p><div class="field-grid" id="rs-grid"></div>';
host.before(panel);
const grid=panel.querySelector('#rs-grid');

function add(id,label,hint,opts={}){
 if($('#'+id))return;
 const el=document.createElement(opts.area?'textarea':'input');
 el.id=id;el.maxLength=opts.max||200;if(opts.area)el.rows=opts.rows||3;if(hint)el.placeholder=hint;
 if(opts.rtl){el.dir='rtl';el.lang='ar'}
 const l=document.createElement('label');l.textContent=label;if(opts.wide)l.className='wide';l.append(el);grid.append(l);
 el.addEventListener('input',markDirty);fields.push(id);
}
function head(text){const h=document.createElement('h3');h.textContent=text;h.style.cssText='grid-column:1/-1;margin:14px 0 0;font-size:15px';grid.append(h)}

head('Opening & names page');
add('rsOpen','“Tap to open” wording','Tap to open',{max:40});
add('rsBismillah','Arabic line at the top (Bismillah)','Leave empty for the default Bismillah',{wide:true,rtl:true,max:200});
add('rsIntro','Invitation line above the names','With the blessings of Allah and our families, you are warmly invited to the Nikah of',{wide:true,area:true,rows:2,max:160});
add('rsLabel1','Label above name 1','Daughter of',{max:40});
add('rsLabel2','Label above name 2','Son of',{max:40});
add('rsScroll','Scroll hint','Scroll',{max:30});
head('Scratch-to-reveal date');
add('rsDateKicker','Small heading','Save the date',{max:60});
add('rsDateTitle','Title','Scratch to reveal the date',{max:60});
head('Photo slider');
add('rsStoryKicker','Small heading','Our journey',{max:60});
add('rsStoryTitle','Title','A few moments we cherish',{max:80});
head('Schedule of the day');
add('rsDayKicker','Small heading','The day ahead',{max:60});
add('rsDayTitle','Title','Schedule of the day',{max:80});
head('Event cards (with Google Maps buttons)');
add('rsEventsTitle','Title','Where to find us',{max:80});
add('eventsText','Events — one per line: Title | Date & time | Place | Google Maps link','Nikah | 10 December · 4:00 PM | Bride’s home, City | https://maps.google.com/…\nReception | 11 December · 8:00 PM | Groom’s home, City | https://maps.google.com/…',{wide:true,area:true,rows:5,max:1800});
const evHelp=document.createElement('p');evHelp.className='help';evHelp.style.gridColumn='1/-1';evHelp.textContent='Up to 6 events. Leave this empty to use your Venue / Groom venue details above. The “Moments of the day” list (section 05) becomes the schedule timeline.';grid.append(evHelp);
head('Closing');
add('rsClosing','Closing message','Your presence and duas will make our day complete.',{wide:true,area:true,rows:2,max:300});

// visibility: only show while this template is selected
let last='';
setInterval(()=>{if(preset.value!==last){last=preset.value;panel.hidden=!IDS.includes(last)}},500);
preset.addEventListener('change',()=>{
 if(IDS.includes(preset.value)){const f=$('#font');if(f&&f.value==='serif')f.value='allura';const a=$('#animation');if(a)a.checked=true}
});

// one-tap button (next to the template picker)
const btn=document.createElement('button');
btn.type='button';btn.className='primary';btn.textContent='Use Royal Stage';
btn.onclick=()=>{ensure();preset.value=ID;preset.dispatchEvent(new Event('change'));if($('#font'))$('#font').value='allura';if($('#animation'))$('#animation').checked=true;if($('#music-autoplay'))$('#music-autoplay').checked=true;markDirty();panel.hidden=false;panel.scrollIntoView({behavior:'smooth',block:'start'})};
(preset.closest('label')||preset.parentElement).append(btn);

// tap-to-edit from the preview
const dialog=document.createElement('dialog');dialog.className='direct-dialog';
dialog.innerHTML='<form method="dialog"><header><strong>Edit text</strong><button value="cancel" aria-label="Close editor">×</button></header></form><div class="direct-body"></div>';
document.body.append(dialog);
const dbody=dialog.querySelector('.direct-body');
window.addEventListener('message',event=>{
 const frame=$('#preview');
 if(!frame||event.source!==frame.contentWindow)return;
 const d=event.data;
 if(!d||d.type!=='mubiey-rs-edit'||typeof d.field!=='string')return;
 const input=document.getElementById(d.field);
 if(!input||input.type==='file'||input.type==='checkbox')return;
 const title=(input.closest('label')?.firstChild?.textContent||d.field).trim();
 dbody.replaceChildren();
 const label=document.createElement('label');label.textContent=title;
 const edit=document.createElement('textarea');edit.rows=4;edit.maxLength=input.maxLength>0?input.maxLength:3000;edit.value=input.value;edit.style.width='100%';
 if(input.dir==='rtl'){edit.dir='rtl';edit.lang='ar'}
 label.append(edit);dbody.append(label);
 const ok=document.createElement('button');ok.type='button';ok.textContent='Apply changes';
 ok.onclick=()=>{input.value=edit.value;markDirty();dialog.close()};
 dbody.append(ok);dialog.showModal();edit.focus();
});
})();

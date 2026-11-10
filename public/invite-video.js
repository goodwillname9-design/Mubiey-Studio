/* Owner-only "Video for client" tool. Works for ANY live invitation template.
   Opens the invitation in a phone-shaped stage, taps it open, scrolls through it at a calm speed and records the
   stage with the browser's own tab recorder (MediaRecorder + getDisplayMedia). Then: Download, or Share (WhatsApp etc.).
   Needs a desktop Chrome / Edge (phones cannot record a tab; use the phone's screen recorder there). Nothing is uploaded. */
'use strict';
(()=>{
const $=s=>document.querySelector(s);
if(typeof invitationDocument!=='function'||typeof collect!=='function'||typeof photos==='undefined')return;
const host=$('#save')?.closest('.panel');if(!host)return;
const btn=document.createElement('button');btn.type='button';btn.id='make-video';btn.textContent='🎬 Make video for client';
(host.querySelector('.actions')||host).append(btn);
const dlg=document.createElement('dialog');dlg.id='iv-dialog';
dlg.style.cssText='border:0;padding:0;background:#120308;color:#fbefe3;max-width:96vw;max-height:96vh;border-radius:14px;overflow:hidden';
dlg.innerHTML=`<div style="display:flex;gap:18px;padding:16px;align-items:flex-start;flex-wrap:wrap;justify-content:center">
<div id="iv-stage" style="position:relative;width:min(360px,70vw);aspect-ratio:9/16;max-height:80vh;background:#000;overflow:hidden;border-radius:10px;outline:1px solid #6a4a2a"><iframe id="iv-frame" style="position:absolute;inset:0;width:100%;height:100%;border:0;background:#000"></iframe></div>
<div style="width:260px;max-width:90vw;font:14px/1.5 Arial,sans-serif"><h3 style="margin:0 0 6px;font-size:17px">Video for client</h3>
<p style="margin:0 0 10px;opacity:.85">Records this invitation exactly as the guest sees it: tap-to-open, animation, then a smooth scroll to the end.</p>
<label style="display:block;margin-bottom:8px">Length <select id="iv-len"><option value="30">30 seconds</option><option value="45" selected>45 seconds</option><option value="60">60 seconds</option><option value="90">90 seconds</option></select></label>
<label style="display:block;margin-bottom:10px"><input type="checkbox" id="iv-audio" checked> Include music (tick “share tab audio”)</label>
<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" id="iv-rec" class="primary">Start recording</button><button type="button" id="iv-close">Close</button></div>
<p id="iv-status" style="margin:10px 0;opacity:.9"></p>
<div id="iv-out" hidden style="display:none;gap:8px;flex-wrap:wrap"><a id="iv-dl" class="button" style="padding:8px 12px;background:#d9b46a;color:#2a0610;border-radius:6px;text-decoration:none;font-weight:700">Download video</a><button type="button" id="iv-share">Send to client…</button></div>
<p style="margin:10px 0 0;font-size:12px;opacity:.7">Chrome will ask to share this tab: choose “This tab”. Keep the tab open until it finishes.</p></div></div>`;
document.body.append(dlg);
const q=s=>dlg.querySelector(s),status=t=>q('#iv-status').textContent=t;
let blob=null,rec=null,stream=null,running=false;
function load(){
 const d=collect();d.photos=photos.map(p=>p.preview||p.value);d.music=(typeof music!=='undefined'&&music)?(music.preview||music.value):null;d._editorPreview=false;d.animation=true;
 q('#iv-frame').srcdoc=invitationDocument(d);
}
btn.onclick=()=>{blob=null;q('#iv-out').style.display='none';status('');load();dlg.showModal()};
q('#iv-close').onclick=()=>{if(running)stop();dlg.close();q('#iv-frame').srcdoc=''};
const supported=()=>!!(navigator.mediaDevices&&navigator.mediaDevices.getDisplayMedia&&window.MediaRecorder);
const pickMime=()=>['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(t=>MediaRecorder.isTypeSupported(t))||'';
function stop(){try{rec&&rec.state!=='inactive'&&rec.stop()}catch{}try{stream&&stream.getTracks().forEach(t=>t.stop())}catch{}}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function autoplay(fr,seconds){
 const w=fr.contentWindow,doc=fr.contentDocument;
 await wait(1200);
 const open=doc.querySelector('#rl-open,#rs-open,.g-hit,[data-open]');
 if(open){open.click()}else{const el=doc.elementFromPoint(w.innerWidth/2,w.innerHeight/2);el&&el.click&&el.click()}
 await wait(6500);                      /* opening animation */
 const root=doc.scrollingElement||doc.documentElement,max=Math.max(0,root.scrollHeight-w.innerHeight);
 const dur=Math.max(8,seconds-6.5-3)*1000,t0=performance.now();
 await new Promise(res=>{const step=now=>{const p=Math.min(1,(now-t0)/dur),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;root.scrollTop=max*(.5*p+.5*e);if(p<1&&running)requestAnimationFrame(step);else res()};requestAnimationFrame(step)});
 await wait(2500);
}
q('#iv-rec').onclick=async()=>{
 if(running)return;
 if(!supported()){status('Video recording needs desktop Chrome or Edge. On a phone, use the phone’s screen recorder.');return}
 const seconds=+q('#iv-len').value,wantAudio=q('#iv-audio').checked,fr=q('#iv-frame');
 try{
  load();await wait(900);
  const opts={video:{frameRate:30},audio:wantAudio,preferCurrentTab:true,selfBrowserSurface:'include',systemAudio:'include'};
  stream=await navigator.mediaDevices.getDisplayMedia(opts);
  const vt=stream.getVideoTracks()[0];
  try{if(window.CropTarget&&vt.cropTo){const ct=await CropTarget.fromElement(q('#iv-stage'));await vt.cropTo(ct)}}catch{}
  const mime=pickMime(),chunks=[];
  rec=new MediaRecorder(stream,mime?{mimeType:mime,videoBitsPerSecond:8e6}:{videoBitsPerSecond:8e6});
  rec.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
  const finished=new Promise(r=>rec.onstop=r);
  vt.onended=()=>{running=false};
  running=true;rec.start(500);status('Recording… please wait');q('#iv-rec').disabled=true;
  await autoplay(fr,seconds);
  running=false;stop();await finished;
  blob=new Blob(chunks,{type:(rec.mimeType||mime||'video/webm').split(';')[0]});
  const ext=blob.type.includes('mp4')?'mp4':'webm',name=((collect().name1||'invitation')+'-'+(collect().name2||'')).replace(/[^\w\-]+/g,'_')+'.'+ext;
  const url=URL.createObjectURL(blob);const a=q('#iv-dl');a.href=url;a.download=name;q('#iv-out').style.display='flex';
  status(ext==='mp4'?'Done. The video is ready.':'Done. This browser saved WebM; WhatsApp may need MP4, so open Chrome latest or convert it.');
  q('#iv-share').onclick=async()=>{try{const f=new File([blob],name,{type:blob.type});if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],title:'Wedding invitation'});else status('Sharing files is not supported here. Use Download, then send it on WhatsApp.')}catch(e){if(e.name!=='AbortError')status(e.message)}};
 }catch(e){status(e&&e.name==='NotAllowedError'?'Recording was cancelled.':'Could not record: '+(e&&e.message||e))}
 finally{running=false;stop();q('#iv-rec').disabled=false}
};
})();

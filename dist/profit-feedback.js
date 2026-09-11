export function profitState({profit,hasPosition,stale}){
 if(!hasPosition||stale||!Number.isFinite(profit))return 'neutral';
 return profit<=-.005?'loss':profit>=.005?'gain':'neutral';
}
export function mountProfitFeedback(panel,badge,button){
 let enabled=true,unlocked=false,context=null,state='neutral',lastState='neutral',lastSound=-Infinity;
 const oscillators=new Set();let speech=null;
 try{enabled=localStorage.getItem('axis-profit-sound')!=='off'}catch{}
 function refreshButton(){button.textContent=!enabled?'🔇 音效关':unlocked?'🔊 音效开':'🔊 开启音效';button.setAttribute('aria-pressed',String(enabled&&unlocked));button.title=enabled&&unlocked?'关闭盈亏提示音':'开启盈亏提示音'}
 function stop(){for(const o of oscillators){try{o.stop()}catch{}}oscillators.clear();if(speech){window.speechSynthesis?.cancel();speech=null}}
 async function unlock(){try{const Audio=window.AudioContext||window.webkitAudioContext;if(Audio){context??=new Audio();if(context.state==='suspended')await context.resume()}unlocked=!!context||'speechSynthesis' in window;refreshButton();return unlocked}catch{return false}}
 function tone(frequency,start,duration,endFrequency){if(!context||context.state!=='running')return;const o=context.createOscillator(),g=context.createGain();o.type='sine';o.frequency.setValueAtTime(frequency,start);if(endFrequency)o.frequency.exponentialRampToValueAtTime(endFrequency,start+duration);g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(.11,start+.035);g.gain.exponentialRampToValueAtTime(.001,start+duration);o.connect(g);g.connect(context.destination);oscillators.add(o);o.onended=()=>{oscillators.delete(o);o.disconnect();g.disconnect()};o.start(start);o.stop(start+duration+.02)}
 function play(){if(!enabled||!unlocked||panel.hidden||document.hidden||state==='neutral'||performance.now()-lastSound<6000)return;lastSound=performance.now();stop();if(state==='loss'){if(context){const t=context.currentTime;tone(580,t,.3,950);tone(950,t+.37,.3,580)}}else if('speechSynthesis' in window&&typeof window.SpeechSynthesisUtterance==='function'){speech=new window.SpeechSynthesisUtterance('Good');speech.lang='en-US';speech.rate=.95;speech.pitch=1.12;speech.volume=.65;const voice=window.speechSynthesis.getVoices().find(v=>v.lang.startsWith('en'));if(voice)speech.voice=voice;speech.onend=()=>{speech=null};window.speechSynthesis.speak(speech)}else if(context){tone(660,context.currentTime,.16);tone(880,context.currentTime+.17,.25)}}
 function update(data){state=profitState(data);panel.dataset.profitState=state;badge.hidden=state==='neutral';badge.setAttribute('aria-label',state==='loss'?'当前亏损：警报':'当前盈利：金元宝');if(panel.hidden||document.hidden){stop();lastState='neutral';return}if(state!==lastState){lastState=state;if(state==='neutral')stop();else play()}}
 button.onclick=async()=>{if(enabled&&unlocked){enabled=false;stop()}else{enabled=true;await unlock();lastSound=-Infinity;play()}try{localStorage.setItem('axis-profit-sound',enabled?'on':'off')}catch{}refreshButton()};
 document.addEventListener('pointerdown',()=>{if(enabled&&!unlocked)unlock()},{capture:true});
 document.addEventListener('keydown',e=>{if(enabled&&!unlocked&&(e.key==='Enter'||e.key===' '))unlock()},{capture:true});
 new MutationObserver(()=>{if(panel.hidden){stop();lastState='neutral'}else if(state!=='neutral'){lastState=state;play()}}).observe(panel,{attributes:true,attributeFilter:['hidden']});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});refreshButton();return {update};
}

// Fullscreen API with an in-page fallback for restricted browsers.
export function mountFullscreen(root,button,profit){
 let expanded=false,transitioning=false,previousFocus=null,scrollY=0,hiddenSiblings=[];
 function setExpanded(value){
  if(value===expanded)return;
  expanded=value;
  if(value){
   previousFocus=document.activeElement;scrollY=window.scrollY;
   // Keep keyboard focus within the maximized chart in fallback mode too.
   let node=root;
   while(node.parentElement&&node!==document.body){
    for(const sibling of node.parentElement.children){if(sibling!==node){hiddenSiblings.push([sibling,sibling.inert]);sibling.inert=true}}
    node=node.parentElement;
   }
  }else{for(const [node,wasInert] of hiddenSiblings)node.inert=wasInert;hiddenSiblings=[]}
  root.classList.toggle('is-maximized',value);document.body.classList.toggle('chart-expanded',value);
  profit.hidden=!value;button.textContent=value?'↙ 还原':'⛶ 全屏';
  button.setAttribute('aria-pressed',String(value));button.setAttribute('aria-label',value?'还原交易盘面尺寸':'全屏显示交易盘面');
  if(value)button.focus({preventScroll:true});else{window.scrollTo({top:scrollY,behavior:'instant'});(previousFocus?.isConnected?previousFocus:button).focus({preventScroll:true})}
 }
 async function enter(){if(transitioning||expanded)return;transitioning=true;setExpanded(true);try{if(root.requestFullscreen&&document.fullscreenEnabled)await root.requestFullscreen()}catch{/* The fixed-layout fallback is already active. */}finally{transitioning=false}}
 async function leave(){if(transitioning||!expanded)return;transitioning=true;try{if(document.fullscreenElement===root)await document.exitFullscreen();setExpanded(false)}catch{if(document.fullscreenElement!==root)setExpanded(false)}finally{transitioning=false}}
 button.onclick=()=>expanded?leave():enter();
 document.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement===root)setExpanded(true);else if(expanded)setExpanded(false)});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&expanded&&!document.fullscreenElement){event.preventDefault();leave()}});
 return {enter,leave,isExpanded:()=>expanded};
}

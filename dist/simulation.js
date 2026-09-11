// Local practice ledger. No wallet, signature, or exchange calls.
export const initialSimulation=()=>({balance:1000,realized:0,position:null,lastMark:0,trades:[]});
export function simulationEquity(s,mark){return s.balance+(s.position?s.position.size*(mark-s.position.entry):0)}
export function openSimulation(s,{coin,buy,notional,leverage,mark}){
 if(![notional,leverage,mark].every(Number.isFinite)||notional<10||leverage<1||leverage>20||mark<=0)throw Error('请输入有效金额（至少 10 USDC）和 1–20× 杠杆');
 const p=s.position,sign=buy?1:-1;
 if(p&&(p.coin!==coin||Math.sign(p.size)!==sign))throw Error('请先平掉已有持仓');
 if(p&&p.leverage!==leverage)throw Error('加仓时请保持原持仓杠杆');
 const margin=notional/leverage;
 if(margin>s.balance-(p?.margin||0)+1e-8)throw Error('模拟可用资金不足，请降低金额或先平仓');
 const size=sign*notional/mark,total=(p?.size||0)+size;
 const entry=p?(Math.abs(p.size)*p.entry+Math.abs(size)*mark)/Math.abs(total):mark;
 return {...s,lastMark:mark,position:{coin,size:total,entry,leverage,margin:margin+(p?.margin||0)}};
}
export function closeSimulation(s,mark,liquidated=false){
 const p=s.position;if(!p)throw Error('当前没有模拟持仓');
 if(!Number.isFinite(mark)||mark<=0)throw Error('价格无效');
 const pnl=liquidated?-p.margin:Math.max(-p.margin,p.size*(mark-p.entry));
 return {...s,balance:Math.max(0,s.balance+pnl),realized:s.realized+pnl,position:null,lastMark:mark,trades:[{coin:p.coin,side:p.size>0?'多':'空',entry:p.entry,exit:mark,pnl,liquidated,time:Date.now()},...s.trades].slice(0,20)};
}
export function liquidationPrice(p){return p?p.entry-p.margin/p.size:null}
export function validSimulation(s){return !!s&&Number.isFinite(s.balance)&&s.balance>=0&&Number.isFinite(s.realized)&&Array.isArray(s.trades)&&s.trades.length<=20&&Number.isFinite(s.lastMark)&&s.lastMark>=0&&(!s.position||(['BTC','ETH','SOL','HYPE'].includes(s.position.coin)&&['size','entry','leverage','margin'].every(k=>Number.isFinite(s.position[k]))&&s.position.size!==0&&s.position.entry>0&&s.position.margin>0&&s.position.margin<=s.balance+1e-8&&s.position.leverage>=1&&s.position.leverage<=20))}

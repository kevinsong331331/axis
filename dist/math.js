export function sizeForOrder(amount,price,decimals){if(!(amount>0&&price>0))return 0;const factor=10**decimals;return Math.floor(amount/price*factor)/factor}
export function priceForOrder(price,buy,szDecimals){const raw=price*(buy?1.005:.995);const digits=Math.max(0,Math.floor(Math.log10(raw))+1);const decimals=Math.max(0,Math.min(6-szDecimals,5-digits));const scale=10**decimals;return String((buy?Math.floor(raw*scale):Math.ceil(raw*scale))/scale)}
export function pnlFor(signedSize,entry,mark){return signedSize*(mark-entry)}
export function tickStep(price,ratio){const raw=Math.max(.01,price*ratio),power=10**Math.floor(Math.log10(raw)),m=raw/power;return Math.max(.01,(m<=1?1:m<=2?2:m<=5?5:10)*power)}

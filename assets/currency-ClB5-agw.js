function c(r,n="en-IN",t="INR"){return new Intl.NumberFormat(n,{style:"currency",currency:t,minimumFractionDigits:2,maximumFractionDigits:2}).format(r)}export{c};

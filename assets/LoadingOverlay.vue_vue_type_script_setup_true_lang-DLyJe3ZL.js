import{N as b,O as f,ai as v,R as m,aj as h,c as s,E as n,ak as y,X as S,al as _,d as C,o as k,b as w}from"./index-DDOmnakA.js";const p=b({name:"QInnerLoading",props:{...f,...v,showing:Boolean,color:String,size:{type:[String,Number],default:"42px"},label:String,labelClass:String,labelStyle:[String,Array,Object]},setup(a,{slots:l}){const e=S(),o=m(a,e.proxy.$q),{transitionProps:i,transitionStyle:t}=h(a),r=s((()=>"q-inner-loading q--avoid-card-border absolute-full column flex-center"+(!0===o.value?" q-inner-loading--dark":""))),u=s((()=>"q-inner-loading__label"+(void 0!==a.labelClass?` ${a.labelClass}`:"")));function d(){return!0===a.showing?n("div",{class:r.value,style:t.value},void 0!==l.default?l.default():function(){const l=[n(_,{size:a.size,color:a.color})];return void 0!==a.label&&l.push(n("div",{class:u.value,style:a.labelStyle},[a.label])),l}()):null}return()=>n(y,i.value,d)}}),B=C({__name:"LoadingOverlay",props:{label:{default:"Loading Data..."},showing:{type:Boolean,default:!0}},setup:a=>(a,l)=>(k(),w(p,{label:a.label,showing:a.showing},null,8,["label","showing"]))});export{B as _};
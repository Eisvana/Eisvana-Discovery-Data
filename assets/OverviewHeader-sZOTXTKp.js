import{r as p,J as I,c as T,w as P,H as V,X as q,a1 as S,o as E,n as O,ae as L,m as _,d as A,q as g,f as B,h as b,g as R,p as F,a7 as H,x as G}from"./index-DT6Ptzjx.js";import{t as C,b as D,i as U,n as x,c as Q,d as W,e as Y}from"./index-BzjY1Fhq.js";function w(e){var t;const a=D(e);return null!=(t=null==a?void 0:a.$el)?t:a}const M=U?window:void 0;function $(...e){let t,a,n,i;if("string"==typeof e[0]||Array.isArray(e[0])?([a,n,i]=e,t=M):[t,a,n,i]=e,!t)return x;Array.isArray(a)||(a=[a]),Array.isArray(n)||(n=[n]);const s=[],r=()=>{s.forEach((e=>e())),s.length=0},o=I((()=>[w(t),D(i)]),(([e,t])=>{if(r(),!e)return;const i=Q(t)?{...t}:t;s.push(...a.flatMap((t=>n.map((a=>((e,t,a,n)=>(e.addEventListener(t,a,n),()=>e.removeEventListener(t,a,n)))(e,t,a,i))))))}),{immediate:!0,flush:"post"}),l=()=>{o(),r()};return W(l),l}function j(){const e=p(!1),t=q();return t&&V((()=>{e.value=!0}),t),e}function k(e){const t=j();return T((()=>(t.value,!!e())))}function J(e,t,a={}){const{window:n=M,...i}=a;let s;const r=k((()=>n&&"MutationObserver"in n)),o=()=>{s&&(s.disconnect(),s=void 0)},l=T((()=>{const t=D(e),a=(Array.isArray(t)?t:[t]).map(w).filter(Y);return new Set(a)})),u=I((()=>l.value),(e=>{o(),r.value&&e.size&&(s=new MutationObserver(t),e.forEach((e=>s.observe(e,i))))}),{immediate:!0,flush:"post"}),c=()=>{u(),o()};return W(c),{isSupported:r,stop:c,takeRecords:()=>null==s?void 0:s.takeRecords()}}function X(e,t={}){const{window:a=M}=t,n=k((()=>a&&"matchMedia"in a&&"function"==typeof a.matchMedia));let i;const s=p(!1),r=e=>{s.value=e.matches},o=()=>{i&&("removeEventListener"in i?i.removeEventListener("change",r):i.removeListener(r))},l=P((()=>{n.value&&(o(),i=a.matchMedia(D(e)),"addEventListener"in i?i.addEventListener("change",r):i.addListener(r),s.value=i.matches)}));return W((()=>{l(),o(),i=void 0})),s}function K(e,t,a={}){const{window:n=M,...i}=a;let s;const r=k((()=>n&&"ResizeObserver"in n)),o=()=>{s&&(s.disconnect(),s=void 0)},l=T((()=>{const t=D(e);return Array.isArray(t)?t.map((e=>w(e))):[w(t)]})),u=I(l,(e=>{if(o(),r.value&&n){s=new ResizeObserver(t);for(const t of e)t&&s.observe(t,i)}}),{immediate:!0,flush:"post"}),c=()=>{o(),u()};return W(c),{isSupported:r,stop:c}}function Z(e,t={}){const{reset:a=!0,windowResize:n=!0,windowScroll:i=!0,immediate:s=!0,updateTiming:r="sync"}=t,o=p(0),l=p(0),u=p(0),c=p(0),d=p(0),m=p(0),v=p(0),h=p(0);function f(){const t=w(e);if(!t)return void(a&&(o.value=0,l.value=0,u.value=0,c.value=0,d.value=0,m.value=0,v.value=0,h.value=0));const n=t.getBoundingClientRect();o.value=n.height,l.value=n.bottom,u.value=n.left,c.value=n.right,d.value=n.top,m.value=n.width,v.value=n.x,h.value=n.y}function g(){"sync"===r?f():"next-frame"===r&&requestAnimationFrame((()=>f()))}return K(e,g),I((()=>w(e)),(e=>!e&&g())),J(e,g,{attributeFilter:["style","class"]}),i&&$("scroll",g,{capture:!0,passive:!0}),n&&$("resize",g,{passive:!0}),C((()=>{s&&g()})),{height:o,bottom:l,left:u,right:c,top:d,width:m,x:v,y:h,update:g}}function ee(e={}){const{window:t=M,initialWidth:a=Number.POSITIVE_INFINITY,initialHeight:n=Number.POSITIVE_INFINITY,listenOrientation:i=!0,includeScrollbar:s=!0,type:r="inner"}=e,o=p(a),l=p(n),u=()=>{t&&("outer"===r?(o.value=t.outerWidth,l.value=t.outerHeight):s?(o.value=t.innerWidth,l.value=t.innerHeight):(o.value=t.document.documentElement.clientWidth,l.value=t.document.documentElement.clientHeight))};if(u(),C(u),$("resize",u,{passive:!0}),i){const e=X("(orientation: portrait)");I(e,(()=>u()))}return{width:o,height:l}}const he=(e,t,a)=>{const n=e[t];return n?"function"==typeof n?n():Promise.resolve(n):new Promise(((e,n)=>{("function"==typeof queueMicrotask?queueMicrotask:setTimeout)(n.bind(null,new Error("Unknown variable dynamic import: "+t+(t.split("/").length!==a?". Note that variables only represent file names one level deep.":""))))}))},te={},ne={class:"text-caption q-mb-sm discovery-note"};function se(e,t){return E(),O("div",ne,t[0]||(t[0]=[L(" Note: The numbers on this page represent the amount of "),_("span",{class:"text-italic"},"discovered",-1),L(" items. This number may be less than what is actually present. ")]))}const _e=S(te,[["render",se],["__scopeId","data-v-e4dada22"]]),oe={class:"text-h4"},we=A({__name:"UndiscoveredNote",props:{type:{}},setup:e=>(e,t)=>(E(),O("p",oe,"This "+g(e.type)+" has not been discovered yet!",1))}),ae=["alt","src","title"],re=A({__name:"GameIcon",props:{src:{},alt:{},title:{},noTheming:{type:Boolean}},setup:e=>(e,t)=>(E(),O("img",{alt:e.alt,src:e.src,title:e.title},null,8,ae))}),ie=S(re,[["__scopeId","data-v-68291f1f"]]),ce={class:"discoverer-name-platform"},ue=A({__name:"DiscovererTag",props:{name:{},platform:{}},setup:e=>(e,t)=>(E(),O("div",ce,[_("span",null,g(e.name),1),B(ie,{alt:`${b(R)(e.platform)} Icon`,"no-theming":"PS"===e.platform,src:b(F)[e.platform].icon,title:b(R)(e.platform),class:"platform-icon"},null,8,["alt","no-theming","src","title"])]))}),le=S(ue,[["__scopeId","data-v-24e43086"]]),de={class:"discovery-header"},me={class:"glyphs"},pe=A({__name:"OverviewHeader",props:{itemData:{}},setup(e){const t=p(null),{right:a,left:n}=Z(t),{width:i}=ee(),s=T((()=>i.value-a.value));return(e,a)=>(E(),O("div",de,[_("div",null,[_("h2",{class:H([e.itemData.Name?"text-bold":"text-italic","no-margin"])},g(e.itemData.Name||"Unknown"),3),_("div",me,g(e.itemData.Glyphs),1)]),_("div",{class:H({"text-right":s.value<b(n)}),ref_key:"rightItem",ref:t},[B(le,{name:e.itemData.Discoverer,platform:e.itemData.Platform},null,8,["name","platform"]),_("div",null,g(b(G)(e.itemData.Timestamp)),1)],2)]))}}),ye=S(pe,[["__scopeId","data-v-cdf4a4da"]]);export{_e as D,ie as G,ye as O,he as _,we as a,le as b};

function y(){}const ft=t=>t;function _t(t,n){for(const e in n)t[e]=n[e];return t}function X(t){return t()}function J(){return Object.create(null)}function b(t){t.forEach(X)}function L(t){return typeof t=="function"}function Ft(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}let T;function Gt(t,n){return T||(T=document.createElement("a")),T.href=n,t===T.href}function dt(t){return Object.keys(t).length===0}function ht(t,...n){if(t==null)return y;const e=t.subscribe(...n);return e.unsubscribe?()=>e.unsubscribe():e}function It(t,n,e){t.$$.on_destroy.push(ht(n,e))}function Wt(t,n,e,i){if(t){const s=Y(t,n,e,i);return t[0](s)}}function Y(t,n,e,i){return t[1]&&i?_t(e.ctx.slice(),t[1](i(n))):e.ctx}function Jt(t,n,e,i){if(t[2]&&i){const s=t[2](i(e));if(n.dirty===void 0)return s;if(typeof s=="object"){const o=[],r=Math.max(n.dirty.length,s.length);for(let l=0;l<r;l+=1)o[l]=n.dirty[l]|s[l];return o}return n.dirty|s}return n.dirty}function Kt(t,n,e,i,s,o){if(s){const r=Y(n,e,i,o);t.p(r,s)}}function Qt(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let i=0;i<e;i++)n[i]=-1;return n}return-1}function Ut(t){const n={};for(const e in t)e[0]!=="$"&&(n[e]=t[e]);return n}function Vt(t){return t==null?"":t}function Xt(t){return t&&L(t.destroy)?t.destroy:y}const Z=typeof window<"u";let mt=Z?()=>window.performance.now():()=>Date.now(),G=Z?t=>requestAnimationFrame(t):y;const x=new Set;function tt(t){x.forEach(n=>{n.c(t)||(x.delete(n),n.f())}),x.size!==0&&G(tt)}function pt(t){let n;return x.size===0&&G(tt),{promise:new Promise(e=>{x.add(n={c:t,f:e})}),abort(){x.delete(n)}}}let P=!1;function yt(){P=!0}function gt(){P=!1}function $t(t,n,e,i){for(;t<n;){const s=t+(n-t>>1);e(s)<=i?t=s+1:n=s}return t}function xt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let n=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let u=0;u<n.length;u++){const _=n[u];_.claim_order!==void 0&&c.push(_)}n=c}const e=new Int32Array(n.length+1),i=new Int32Array(n.length);e[0]=-1;let s=0;for(let c=0;c<n.length;c++){const u=n[c].claim_order,_=(s>0&&n[e[s]].claim_order<=u?s+1:$t(1,s,a=>n[e[a]].claim_order,u))-1;i[c]=e[_]+1;const f=_+1;e[f]=c,s=Math.max(f,s)}const o=[],r=[];let l=n.length-1;for(let c=e[s]+1;c!=0;c=i[c-1]){for(o.push(n[c-1]);l>=c;l--)r.push(n[l]);l--}for(;l>=0;l--)r.push(n[l]);o.reverse(),r.sort((c,u)=>c.claim_order-u.claim_order);for(let c=0,u=0;c<r.length;c++){for(;u<o.length&&r[c].claim_order>=o[u].claim_order;)u++;const _=u<o.length?o[u]:null;t.insertBefore(r[c],_)}}function bt(t,n){t.appendChild(n)}function nt(t){if(!t)return document;const n=t.getRootNode?t.getRootNode():t.ownerDocument;return n&&n.host?n:t.ownerDocument}function wt(t){const n=I("style");return vt(nt(t),n),n.sheet}function vt(t,n){return bt(t.head||t,n),n.sheet}function Et(t,n){if(P){for(xt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;n!==t.actual_end_child?(n.claim_order!==void 0||n.parentNode!==t)&&t.insertBefore(n,t.actual_end_child):t.actual_end_child=n.nextSibling}else(n.parentNode!==t||n.nextSibling!==null)&&t.appendChild(n)}function Nt(t,n,e){t.insertBefore(n,e||null)}function kt(t,n,e){P&&!e?Et(t,n):(n.parentNode!==t||n.nextSibling!=e)&&t.insertBefore(n,e||null)}function N(t){t.parentNode.removeChild(t)}function Yt(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}function I(t){return document.createElement(t)}function et(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function W(t){return document.createTextNode(t)}function Zt(){return W(" ")}function tn(){return W("")}function nn(t,n,e,i){return t.addEventListener(n,e,i),()=>t.removeEventListener(n,e,i)}function At(t,n,e){e==null?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function en(t,n){for(const e in n)At(t,e,n[e])}function sn(t,n,e){t.setAttributeNS("http://www.w3.org/1999/xlink",n,e)}function rn(t){return t===""?null:+t}function Tt(t){return Array.from(t.childNodes)}function it(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function st(t,n,e,i,s=!1){it(t);const o=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const l=t[r];if(n(l)){const c=e(l);return c===void 0?t.splice(r,1):t[r]=c,s||(t.claim_info.last_index=r),l}}for(let r=t.claim_info.last_index-1;r>=0;r--){const l=t[r];if(n(l)){const c=e(l);return c===void 0?t.splice(r,1):t[r]=c,s?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,l}}return i()})();return o.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,o}function rt(t,n,e,i){return st(t,s=>s.nodeName===n,s=>{const o=[];for(let r=0;r<s.attributes.length;r++){const l=s.attributes[r];e[l.name]||o.push(l.name)}o.forEach(r=>s.removeAttribute(r))},()=>i(n))}function on(t,n,e){return rt(t,n,e,I)}function cn(t,n,e){return rt(t,n,e,et)}function St(t,n){return st(t,e=>e.nodeType===3,e=>{const i=""+n;if(e.data.startsWith(i)){if(e.data.length!==i.length)return e.splitText(i.length)}else e.data=i},()=>W(n),!0)}function ln(t){return St(t," ")}function K(t,n,e){for(let i=e;i<t.length;i+=1){const s=t[i];if(s.nodeType===8&&s.textContent.trim()===n)return i}return t.length}function un(t,n){const e=K(t,"HTML_TAG_START",0),i=K(t,"HTML_TAG_END",e);if(e===i)return new Q(void 0,n);it(t);const s=t.splice(e,i-e+1);N(s[0]),N(s[s.length-1]);const o=s.slice(1,s.length-1);for(const r of o)r.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new Q(o,n)}function an(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}function fn(t,n){t.value=n==null?"":n}function _n(t,n,e,i){e===null?t.style.removeProperty(n):t.style.setProperty(n,e,i?"important":"")}function dn(t,n){for(let e=0;e<t.options.length;e+=1){const i=t.options[e];if(i.__value===n){i.selected=!0;return}}t.selectedIndex=-1}function hn(t){const n=t.querySelector(":checked")||t.options[0];return n&&n.__value}function mn(t,n,e){t.classList[e?"add":"remove"](n)}function ot(t,n,{bubbles:e=!1,cancelable:i=!1}={}){const s=document.createEvent("CustomEvent");return s.initCustomEvent(t,e,i,n),s}function pn(t,n){const e=[];let i=0;for(const s of n.childNodes)if(s.nodeType===8){const o=s.textContent.trim();o===`HEAD_${t}_END`?(i-=1,e.push(s)):o===`HEAD_${t}_START`&&(i+=1,e.push(s))}else i>0&&e.push(s);return e}class Ct{constructor(n=!1){this.is_svg=!1,this.is_svg=n,this.e=this.n=null}c(n){this.h(n)}m(n,e,i=null){this.e||(this.is_svg?this.e=et(e.nodeName):this.e=I(e.nodeName),this.t=e,this.c(n)),this.i(i)}h(n){this.e.innerHTML=n,this.n=Array.from(this.e.childNodes)}i(n){for(let e=0;e<this.n.length;e+=1)Nt(this.t,this.n[e],n)}p(n){this.d(),this.h(n),this.i(this.a)}d(){this.n.forEach(N)}}class Q extends Ct{constructor(n,e=!1){super(e),this.e=this.n=null,this.l=n}c(n){this.l?this.n=this.l:super.c(n)}i(n){for(let e=0;e<this.n.length;e+=1)kt(this.t,this.n[e],n)}}function yn(t,n){return new t(n)}const D=new Map;let M=0;function jt(t){let n=5381,e=t.length;for(;e--;)n=(n<<5)-n^t.charCodeAt(e);return n>>>0}function Dt(t,n){const e={stylesheet:wt(n),rules:{}};return D.set(t,e),e}function U(t,n,e,i,s,o,r,l=0){const c=16.666/i;let u=`{
`;for(let p=0;p<=1;p+=c){const $=n+(e-n)*o(p);u+=p*100+`%{${r($,1-$)}}
`}const _=u+`100% {${r(e,1-e)}}
}`,f=`__svelte_${jt(_)}_${l}`,a=nt(t),{stylesheet:d,rules:h}=D.get(a)||Dt(a,t);h[f]||(h[f]=!0,d.insertRule(`@keyframes ${f} ${_}`,d.cssRules.length));const g=t.style.animation||"";return t.style.animation=`${g?`${g}, `:""}${f} ${i}ms linear ${s}ms 1 both`,M+=1,f}function Mt(t,n){const e=(t.style.animation||"").split(", "),i=e.filter(n?o=>o.indexOf(n)<0:o=>o.indexOf("__svelte")===-1),s=e.length-i.length;s&&(t.style.animation=i.join(", "),M-=s,M||Ht())}function Ht(){G(()=>{M||(D.forEach(t=>{const{ownerNode:n}=t.stylesheet;n&&N(n)}),D.clear())})}let k;function E(t){k=t}function R(){if(!k)throw new Error("Function called outside component initialization");return k}function gn(t){R().$$.on_mount.push(t)}function $n(t){R().$$.after_update.push(t)}function xn(t){R().$$.on_destroy.push(t)}function bn(){const t=R();return(n,e,{cancelable:i=!1}={})=>{const s=t.$$.callbacks[n];if(s){const o=ot(n,e,{cancelable:i});return s.slice().forEach(r=>{r.call(t,o)}),!o.defaultPrevented}return!0}}const v=[],V=[],C=[],z=[],ct=Promise.resolve();let F=!1;function lt(){F||(F=!0,ct.then(ut))}function wn(){return lt(),ct}function H(t){C.push(t)}function vn(t){z.push(t)}const O=new Set;let S=0;function ut(){const t=k;do{for(;S<v.length;){const n=v[S];S++,E(n),Lt(n.$$)}for(E(null),v.length=0,S=0;V.length;)V.pop()();for(let n=0;n<C.length;n+=1){const e=C[n];O.has(e)||(O.add(e),e())}C.length=0}while(v.length);for(;z.length;)z.pop()();F=!1,O.clear(),E(t)}function Lt(t){if(t.fragment!==null){t.update(),b(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(H)}}let w;function Pt(){return w||(w=Promise.resolve(),w.then(()=>{w=null})),w}function B(t,n,e){t.dispatchEvent(ot(`${n?"intro":"outro"}${e}`))}const j=new Set;let m;function En(){m={r:0,c:[],p:m}}function Nn(){m.r||b(m.c),m=m.p}function Rt(t,n){t&&t.i&&(j.delete(t),t.i(n))}function kn(t,n,e,i){if(t&&t.o){if(j.has(t))return;j.add(t),m.c.push(()=>{j.delete(t),i&&(e&&t.d(1),i())}),t.o(n)}else i&&i()}const qt={duration:0};function An(t,n,e,i){let s=n(t,e),o=i?0:1,r=null,l=null,c=null;function u(){c&&Mt(t,c)}function _(a,d){const h=a.b-o;return d*=Math.abs(h),{a:o,b:a.b,d:h,duration:d,start:a.start,end:a.start+d,group:a.group}}function f(a){const{delay:d=0,duration:h=300,easing:g=ft,tick:p=y,css:$}=s||qt,q={start:mt()+d,b:a};a||(q.group=m,m.r+=1),r||l?l=q:($&&(u(),c=U(t,o,a,h,d,g,$)),a&&p(0,1),r=_(q,h),H(()=>B(t,a,"start")),pt(A=>{if(l&&A>l.start&&(r=_(l,h),l=null,B(t,r.b,"start"),$&&(u(),c=U(t,o,r.b,r.duration,0,g,s.css))),r){if(A>=r.end)p(o=r.b,1-o),B(t,r.b,"end"),l||(r.b?u():--r.group.r||b(r.group.c)),r=null;else if(A>=r.start){const at=A-r.start;o=r.a+r.d*g(at/r.duration),p(o,1-o)}}return!!(r||l)}))}return{run(a){L(s)?Pt().then(()=>{s=s(),f(a)}):f(a)},end(){u(),r=l=null}}}function Tn(t,n){const e={},i={},s={$$scope:1};let o=t.length;for(;o--;){const r=t[o],l=n[o];if(l){for(const c in r)c in l||(i[c]=1);for(const c in l)s[c]||(e[c]=l[c],s[c]=1);t[o]=l}else for(const c in r)s[c]=1}for(const r in i)r in e||(e[r]=void 0);return e}function Sn(t){return typeof t=="object"&&t!==null?t:{}}function Cn(t,n,e){const i=t.$$.props[n];i!==void 0&&(t.$$.bound[i]=e,e(t.$$.ctx[i]))}function jn(t){t&&t.c()}function Dn(t,n){t&&t.l(n)}function Ot(t,n,e,i){const{fragment:s,after_update:o}=t.$$;s&&s.m(n,e),i||H(()=>{const r=t.$$.on_mount.map(X).filter(L);t.$$.on_destroy?t.$$.on_destroy.push(...r):b(r),t.$$.on_mount=[]}),o.forEach(H)}function Bt(t,n){const e=t.$$;e.fragment!==null&&(b(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function zt(t,n){t.$$.dirty[0]===-1&&(v.push(t),lt(),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function Mn(t,n,e,i,s,o,r,l=[-1]){const c=k;E(t);const u=t.$$={fragment:null,ctx:[],props:o,update:y,not_equal:s,bound:J(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(c?c.$$.context:[])),callbacks:J(),dirty:l,skip_bound:!1,root:n.target||c.$$.root};r&&r(u.root);let _=!1;if(u.ctx=e?e(t,n.props||{},(f,a,...d)=>{const h=d.length?d[0]:a;return u.ctx&&s(u.ctx[f],u.ctx[f]=h)&&(!u.skip_bound&&u.bound[f]&&u.bound[f](h),_&&zt(t,f)),a}):[],u.update(),_=!0,b(u.before_update),u.fragment=i?i(u.ctx):!1,n.target){if(n.hydrate){yt();const f=Tt(n.target);u.fragment&&u.fragment.l(f),f.forEach(N)}else u.fragment&&u.fragment.c();n.intro&&Rt(t.$$.fragment),Ot(t,n.target,n.anchor,n.customElement),gt(),ut()}E(c)}class Hn{$destroy(){Bt(this,1),this.$destroy=y}$on(n,e){if(!L(e))return y;const i=this.$$.callbacks[n]||(this.$$.callbacks[n]=[]);return i.push(e),()=>{const s=i.indexOf(e);s!==-1&&i.splice(s,1)}}$set(n){this.$$set&&!dt(n)&&(this.$$.skip_bound=!0,this.$$set(n),this.$$.skip_bound=!1)}}export{bn as $,wn as A,y as B,Wt as C,mn as D,Kt as E,Qt as F,Jt as G,It as H,V as I,Cn as J,Et as K,vn as L,Yt as M,_t as N,et as O,cn as P,en as Q,Tn as R,Hn as S,Ut as T,sn as U,Vt as V,Gt as W,nn as X,b as Y,pn as Z,Sn as _,Zt as a,xn as a0,Xt as a1,H as a2,An as a3,Q as a4,un as a5,fn as a6,dn as a7,rn as a8,hn as a9,kt as b,ln as c,Nn as d,tn as e,Rt as f,En as g,N as h,Mn as i,$n as j,I as k,on as l,Tt as m,At as n,gn as o,_n as p,W as q,St as r,Ft as s,kn as t,an as u,yn as v,jn as w,Dn as x,Ot as y,Bt as z};
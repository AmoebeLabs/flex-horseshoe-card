/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),i=new WeakMap;let s=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const r=this.t;if(e&&void 0===t){const e=void 0!==r&&1===r.length;e&&(t=i.get(r)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(r,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,r,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[i+1]),t[0]);return new s(i,t,r)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,r))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:n,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,m=globalThis,p=m.trustedTypes,f=p?p.emptyScript:"",g=m.reactiveElementPolyfillSupport,_=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=null!==t;break;case Number:r=null===t?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch(t){r=null}}return r}},b=(t,e)=>!n(t,e),v={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(t,r,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,r){const{get:i,set:s}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const o=i?.call(this);s?.call(this,e),this.requestUpdate(t,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...d(t),...h(t)];for(const r of e)this.createProperty(r,t[r])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const t=this._$Eu(e,r);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const t of r)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const r=e.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((r,i)=>{if(e)r.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of i){const i=document.createElement("style"),s=t.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}})(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){const r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(void 0!==i&&!0===r.reflect){const s=(void 0!==r.converter?.toAttribute?r.converter:y).toAttribute(e,r.type);this._$Em=t,null==s?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(t,e){const r=this.constructor,i=r._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=r.getPropertyOptions(i),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const o=s.fromAttribute(e,t.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,r,i=!1,s){if(void 0!==t){const o=this.constructor;if(!1===i&&(s=this[t]),r??=o.getPropertyOptions(t),!((r.hasChanged??b)(s,e)||r.useDefault&&r.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,r))))return;this.C(t,e,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:i,wrapped:s},o){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==s||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,r]of t){const{wrapped:t}=r,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,r,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[_("elementProperties")]=new Map,w[_("finalized")]=new Map,g?.({ReactiveElement:w}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,x=$.trustedTypes,S=x?x.createPolicy("flex-horseshoe-card-lit-html",{createHTML:t=>t}):void 0,k="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+A,C=`<${E}>`,T=document,O=()=>T.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,P="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,z=/>/g,R=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),F=/'/g,V=/"/g,H=/^(?:script|style|textarea|title)$/i,j=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),U=j(1),J=j(2),L=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),G=new WeakMap,W=T.createTreeWalker(T,129);function q(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const K=(t,e)=>{const r=t.length-1,i=[];let s,o=2===e?"<svg>":3===e?"<math>":"",a=D;for(let n=0;n<r;n++){const e=t[n];let r,c,l=-1,d=0;for(;d<e.length&&(a.lastIndex=d,c=a.exec(e),null!==c);)d=a.lastIndex,a===D?"!--"===c[1]?a=I:void 0!==c[1]?a=z:void 0!==c[2]?(H.test(c[2])&&(s=RegExp("</"+c[2],"g")),a=R):void 0!==c[3]&&(a=R):a===R?">"===c[0]?(a=s??D,l=-1):void 0===c[1]?l=-2:(l=a.lastIndex-c[2].length,r=c[1],a=void 0===c[3]?R:'"'===c[3]?V:F):a===V||a===F?a=R:a===I||a===z?a=D:(a=R,s=void 0);const h=a===R&&t[n+1].startsWith("/>")?" ":"";o+=a===D?e+C:l>=0?(i.push(r),e.slice(0,l)+k+e.slice(l)+A+h):e+A+(-2===l?n:h)}return[q(t,o+(t[r]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Y{constructor({strings:t,_$litType$:e},r){let i;this.parts=[];let s=0,o=0;const a=t.length-1,n=this.parts,[c,l]=K(t,e);if(this.el=Y.createElement(c,r),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=W.nextNode())&&n.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(k)){const e=l[o++],r=i.getAttribute(t).split(A),a=/([.?@])?(.*)/.exec(e);n.push({type:1,index:s,name:a[2],strings:r,ctor:"."===a[1]?et:"?"===a[1]?rt:"@"===a[1]?it:tt}),i.removeAttribute(t)}else t.startsWith(A)&&(n.push({type:6,index:s}),i.removeAttribute(t));if(H.test(i.tagName)){const t=i.textContent.split(A),e=t.length-1;if(e>0){i.textContent=x?x.emptyScript:"";for(let r=0;r<e;r++)i.append(t[r],O()),W.nextNode(),n.push({type:2,index:++s});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===E)n.push({type:2,index:s});else{let t=-1;for(;-1!==(t=i.data.indexOf(A,t+1));)n.push({type:7,index:s}),t+=A.length-1}s++}}static createElement(t,e){const r=T.createElement("template");return r.innerHTML=t,r}}function X(t,e,r=t,i){if(e===L)return e;let s=void 0!==i?r._$Co?.[i]:r._$Cl;const o=M(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),void 0===o?s=void 0:(s=new o(t),s._$AT(t,r,i)),void 0!==i?(r._$Co??=[])[i]=s:r._$Cl=s),void 0!==s&&(e=X(t,s._$AS(t,e.values),s,i)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,i=(t?.creationScope??T).importNode(e,!0);W.currentNode=i;let s=W.nextNode(),o=0,a=0,n=r[0];for(;void 0!==n;){if(o===n.index){let e;2===n.type?e=new Q(s,s.nextSibling,this,t):1===n.type?e=new n.ctor(s,n.name,n.strings,this,t):6===n.type&&(e=new st(s,this,t)),this._$AV.push(e),n=r[++a]}o!==n?.index&&(s=W.nextNode(),o++)}return W.currentNode=T,i}p(t){let e=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,i){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),M(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==L&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:r}=t,i="number"==typeof r?this._$AC(t):(void 0===r.el&&(r.el=Y.createElement(q(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Z(i,this),r=t.u(this.options);t.p(e),this.T(r),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new Y(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,i=0;for(const s of t)i===e.length?e.push(r=new Q(this.O(O()),this.O(O()),this,this.options)):r=e[i],r._$AI(s),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,i,s){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=s,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=B}_$AI(t,e=this,r,i){const s=this.strings;let o=!1;if(void 0===s)t=X(this,t,e,0),o=!M(t)||t!==this._$AH&&t!==L,o&&(this._$AH=t);else{const i=t;let a,n;for(t=s[0],a=0;a<s.length-1;a++)n=X(this,i[r+a],e,a),n===L&&(n=this._$AH[a]),o||=!M(n)||n!==this._$AH[a],n===B?t=B:t!==B&&(t+=(n??"")+s[a+1]),this._$AH[a]=n}o&&!i&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class rt extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class it extends tt{constructor(t,e,r,i,s){super(t,e,r,i,s),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??B)===L)return;const r=this._$AH,i=t===B&&r!==B||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,s=t!==B&&(r===B||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const ot=$.litHtmlPolyfillSupport;ot?.(Y,Q),($.litHtmlVersions??=[]).push("3.3.2");const at=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let nt=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,r)=>{const i=r?.renderBefore??e;let s=i._$litPart$;if(void 0===s){const t=r?.renderBefore??null;i._$litPart$=s=new Q(e.insertBefore(O(),t),t,void 0,r??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}};nt._$litElement$=!0,nt.finalized=!0,at.litElementHydrateSupport?.({LitElement:nt});const ct=at.litElementPolyfillSupport;ct?.({LitElement:nt}),(at.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt=1;let dt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ht="important",ut=" !"+ht,mt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends dt{constructor(t){if(super(t),t.type!==lt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,r)=>{const i=t[r];return null==i?e:e+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`}),"")}update(t,[e]){const{style:r}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const i of this.ft)null==e[i]&&(this.ft.delete(i),i.includes("-")?r.removeProperty(i):r[i]=null);for(const i in e){const t=e[i];if(null!=t){this.ft.add(i);const e="string"==typeof t&&t.endsWith(ut);i.includes("-")||e?r.setProperty(i,e?t.slice(0,-11):t,e?ht:""):r[i]=t}}return L}});var pt=function(){return pt=Object.assign||function(t){for(var e,r=1,i=arguments.length;r<i;r++)for(var s in e=arguments[r])Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t},pt.apply(this,arguments)};function ft(t,e,r){void 0===e&&(e=Date.now()),void 0===r&&(r={});var i=pt(pt({},gt),r||{}),s=(+t-+e)/1e3;if(Math.abs(s)<i.second)return{value:Math.round(s),unit:"second"};var o=s/60;if(Math.abs(o)<i.minute)return{value:Math.round(o),unit:"minute"};var a=s/3600;if(Math.abs(a)<i.hour)return{value:Math.round(a),unit:"hour"};var n=s/86400;if(Math.abs(n)<i.day)return{value:Math.round(n),unit:"day"};var c=new Date(t),l=new Date(e),d=c.getFullYear()-l.getFullYear();if(Math.round(Math.abs(d))>0)return{value:Math.round(d),unit:"year"};var h=12*d+c.getMonth()-l.getMonth();if(Math.round(Math.abs(h))>0)return{value:Math.round(h),unit:"month"};var u=s/604800;return{value:Math.round(u),unit:"week"}}var gt={second:45,minute:45,hour:22,day:5};class _t{static toStyleDict(t){return _t.toDict(t,{stringToDict:_t.cssStringToDict,mapValue:_t.toStyleValue})}static toClassDict(t){return _t.toDict(t,{stringToDict:_t.classStringToDict,mapValue:Boolean})}static toIconDict(t){return _t.toDict(t,{stringToDict:_t.stringToDefaultDict("default"),mapValue:String})}static toDict(t,e={}){const{stringToDict:r=_t.stringToDefaultDict("default"),mapValue:i=(t=>t),skipNull:s=!0,skipFalse:o=!0}=e,a=t=>null==t&&s||!1===t&&o?{}:Array.isArray(t)?t.reduce(((t,e)=>({...t,...a(e)})),{}):_t.isPlainObject(t)?Object.fromEntries(Object.entries(t).filter((([,t])=>(null!=t||!s)&&(!1!==t||!o))).map((([t,e])=>[t,i(e,t)]))):"string"==typeof t?r(t):{};return a(t)}static toStyleValue(t){return null==t?t:String(t).trim().replace(/;+$/,"")}static cssStringToDict(t){return String(t).split(";").map((t=>t.trim())).filter(Boolean).reduce(((t,e)=>{const r=e.indexOf(":");if(r<=0)return t;const i=e.slice(0,r).trim(),s=e.slice(r+1).trim();return i&&s?{...t,[i]:s}:t}),{})}static toColorStopDict(t){return _t.toDict(t,{stringToDict:_t.keyValueStringToDict,mapValue:String})}static keyValueStringToDict(t){const e=String(t).trim(),r=e.indexOf(":");if(r<=0)return{};const i=e.slice(0,r).trim(),s=e.slice(r+1).trim();return i&&s?{[i]:s}:{}}static classStringToDict(t){return String(t).trim().split(/\s+/).filter(Boolean).reduce(((t,e)=>({...t,[e]:!0})),{})}static stringToDefaultDict(t="default"){return e=>({[t]:String(e)})}static requireArray(t,e="value"){if(null==t)return[];if(!Array.isArray(t))throw new Error(`[config-helper] "${e}" must be an array.`);return t}static ensureArray(t){return null==t?[]:Array.isArray(t)?t:[t]}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}}class yt{static context={};static setContext(t={}){yt.context=t}static getJsTemplateOrValue(t,e,r={}){return yt._getJsTemplateOrValue(t,e,r,0)}static _getJsTemplateOrValue(t,e,r={},i=0){const{resolveKeys:s=!0,maxDepth:o=10}=r;if(i>=o)return e;if(null==e)return e;if(["number","boolean","bigint","symbol"].includes(typeof e))return e;if(Array.isArray(e))return e.map((e=>yt._getJsTemplateOrValue(t,e,r,i)));if(yt.isPlainObject(e))return Object.fromEntries(Object.entries(e).map((([e,o])=>{const a=s?yt._getJsTemplateOrValue(t,e,r,i):e,n=yt._getJsTemplateOrValue(t,o,r,i);return[String(a),n]})));if("string"!=typeof e)return e;const a=e.trim();if(!yt.isJsTemplate(a))return e;const n=yt.evaluateJsTemplate(t,yt.extractJsTemplateCode(a));return yt._getJsTemplateOrValue(t,n,r,i+1)}static getJsTemplateOrValueV1(t,e,r={}){const{resolveKeys:i=!0}=r;if(null==e)return e;if(["number","boolean","bigint","symbol"].includes(typeof e))return e;if(Array.isArray(e))return e.map((e=>yt.getJsTemplateOrValue(t,e,r)));if(yt.isPlainObject(e))return Object.fromEntries(Object.entries(e).map((([e,s])=>{const o=i?yt.getJsTemplateOrValue(t,e,r):e,a=yt.getJsTemplateOrValue(t,s,r);return[String(o),a]})));if("string"!=typeof e)return e;const s=e.trim();if(yt.isJsTemplate(s)){const e=yt.evaluateJsTemplate(t,yt.extractJsTemplateCode(s));return yt.getJsTemplateOrValue(t,e,r)}return e}static isJsTemplate(t){return"string"==typeof t&&t.trim().startsWith("[[[")&&t.trim().endsWith("]]]")}static extractJsTemplateCode(t){return String(t).trim().slice(3,-3).trim()}static evaluateJsTemplate(t,e){const{hass:r,config:i,entities:s=[]}=yt.context,o=yt._getItemEntityIndex(t),a=yt._getTemplateState(t),n=s?.[o],c=r?.states,l=i?.variables??{},d=r?.user;i?.dev?.debug&&console.log("Evaluating JavaScript template with context:",{hass:r,config:i,entity:n,entities:s,states:c,state:a,variables:l,item:t,user:d});try{return new Function("hass","config","entity","entities","states","state","variables","item","user",`\n          "use strict";\n          ${e}\n        `)(r,i,n,s,c,a,l,t,d)}catch(h){return void(i?.dev?.debug&&console.error("[templates] JavaScript template error:",{error:h,item:t,javascript:e}))}}static _getTemplateState(t={}){const e=yt._getItemEntityIndex(t),r=yt.context.entities?.[e],i=yt.context.config?.entities?.[e]||{};if(!r)return;const s=i.attribute;return s&&r.attributes&&void 0!==r.attributes[s]?r.attributes[s]:r.state}static _getItemEntityIndex(t={}){const e=Number(t.entity_index);return Number.isFinite(e)?e:0}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}}class bt{static normalize(t){return t?Array.isArray(t)?{scales:{},colors:bt.normalizeColors(t)}:!bt.isPlainObject(t)||t.colors||t.scales?bt.isPlainObject(t)?{scales:bt.normalizeScales(t.scales),colors:bt.normalizeColors(t.colors)}:{scales:{},colors:[]}:{scales:{},colors:bt.normalizeColors(t)}:{scales:{},colors:[]}}static normalizeScales(t){return bt.isPlainObject(t)?Object.fromEntries(Object.entries(t).map((([t,e])=>[t,bt.isPlainObject(e)?{...e}:e]))):{}}static normalizeColors(t){return t?Array.isArray(t)?t.flatMap((t=>bt.normalizeColorArrayEntry(t))).filter(Boolean).sort(((t,e)=>t.value-e.value)):bt.isPlainObject(t)?Object.entries(t).map((([t,e])=>bt.normalizeColorPair(t,e))).filter(Boolean).sort(((t,e)=>t.value-e.value)):[]:[]}static normalizeColorArrayEntry(t){if(bt.isPlainObject(t)&&Object.prototype.hasOwnProperty.call(t,"value")&&Object.prototype.hasOwnProperty.call(t,"color")){const e=bt.normalizeColorEntry(t);return e?[e]:[]}return bt.isPlainObject(t)?Object.entries(t).map((([t,e])=>bt.normalizeColorPair(t,e))).filter(Boolean):[]}static normalizeColorPair(t,e){const r=Number(t);return Number.isFinite(r)?null==e?null:{value:r,color:String(e)}:null}static normalizeColorEntry(t){if(!bt.isPlainObject(t))return null;const e=Number(t.value);return Number.isFinite(e)?void 0===t.color||null===t.color?null:{...t,value:e,color:String(t.color)}:null}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}static _testColorStopsNormalizer(){const t={entity_index:0},e=[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}];[{name:"FHC dict",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC dict with quoted keys",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC list of dicts",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC list of dicts with quoted keys",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC dict with template values",raw:{0:"[[[\n          return 'red';\n        ]]]",10:"[[[\n          return 'green';\n        ]]]",20:"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template values",raw:[{0:"[[[\n            return 'red';\n          ]]]"},{10:"[[[\n            return 'green';\n          ]]]"},{20:"[[[\n            return 'blue';\n          ]]]"}]},{name:"FHC dict with template keys",raw:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}},{name:"FHC dict with template keys and values",raw:{"[[[ return 0; ]]]":"[[[\n          return 'red';\n        ]]]","[[[ return 10; ]]]":"[[[\n          return 'green';\n        ]]]","[[[ return 20; ]]]":"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template keys and values",raw:[{"[[[ return 0; ]]]":"[[[\n            return 'red';\n          ]]]"},{"[[[ return 10; ]]]":"[[[\n            return 'green';\n          ]]]"},{"[[[ return 20; ]]]":"[[[\n            return 'blue';\n          ]]]"}]},{name:"Whole FHC color_stops as template returning dict",raw:"[[[\n        return {\n          0: 'red',\n          10: 'green',\n          20: 'blue',\n        };\n      ]]]"},{name:"Whole FHC color_stops as template returning list",raw:"[[[\n        return [\n          { 0: 'red' },\n          { 10: 'green' },\n          { 20: 'blue' },\n        ];\n      ]]]"},{name:"SAK v1 colorstops.colors dict",raw:{colors:{0:"red",10:"green",20:"blue"}}},{name:"SAK v1 colorstops.colors dict with template keys",raw:{colors:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}}},{name:"SAK v1 colorstops.colors dict with template values",raw:{colors:{0:"[[[\n            return 'red';\n          ]]]",10:"[[[\n            return 'green';\n          ]]]",20:"[[[\n            return 'blue';\n          ]]]"}}},{name:"SAK v2 colors list",raw:{scales:{default:{min:0,max:20}},colors:[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}]}},{name:"SAK v2 colors list unsorted",raw:{scales:{default:{min:0,max:20}},colors:[{value:20,color:"blue",rank:2},{value:0,color:"red",rank:1},{value:10,color:"green",rank:1}]}},{name:"SAK v2 colors list with template values",raw:{scales:{default:{min:"[[[\n              return 0;\n            ]]]",max:"[[[\n              return 20;\n            ]]]"}},colors:[{value:"[[[\n              return 0;\n            ]]]",color:"[[[\n              return 'red';\n            ]]]"},{value:"[[[\n              return 10;\n            ]]]",color:"[[[\n              return 'green';\n            ]]]"},{value:"[[[\n              return 20;\n            ]]]",color:"[[[\n              return 'blue';\n            ]]]"}]}},{name:"SAK v2 whole colors list as template",raw:{scales:{default:{min:0,max:20}},colors:"[[[\n          return [\n            { value: 0, color: 'red' },\n            { value: 10, color: 'green' },\n            { value: 20, color: 'blue' },\n          ];\n        ]]]"}}].forEach((r=>{const i=yt.getJsTemplateOrValue(t,r.raw,{resolveKeys:!0}),s=bt.normalize(i),o=s.colors.map((t=>({value:t.value,color:t.color}))),a=JSON.stringify(o)===JSON.stringify(e);console.log(`[colorstops test] ${a?"PASS":"FAIL"} - ${r.name}`,{raw:r.raw,resolved:i,normalized:s,simpleColors:o,expectedColors:e})}))}}const vt="mdi:bookmark",wt={air_quality:"mdi:air-filter",alert:"mdi:alert",calendar:"mdi:calendar",climate:"mdi:thermostat",configurator:"mdi:cog",conversation:"mdi:microphone-message",counter:"mdi:counter",datetime:"mdi:calendar-clock",date:"mdi:calendar",demo:"mdi:home-assistant",google_assistant:"mdi:google-assistant",group:"mdi:google-circles-communities",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_button:"mdi:gesture-tap-button",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",number:"mdi:ray-vertex",persistent_notification:"mdi:bell",plant:"mdi:Flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:palette",schedule:"mdi:calendar-clock",script:"mdi:script-text",select:"mdi:format-list-bulleted",sensor:"mdi:eye",simple_alarm:"mdi:bell",siren:"mdi:bullhorn",stt:"mdi:microphone-message",text:"mdi:form-textbox",time:"mdi:clock",timer:"mdi:timer-outline",tts:"mdi:speaker-message",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",zone:"mdi:map-marker-radius"},$t={apparent_power:"mdi:flash",aqi:"mdi:air-filter",atmospheric_pressure:"mdi:thermometer-lines",carbon_dioxide:"mdi:molecule-co2",carbon_monoxide:"mdi:molecule-co",current:"mdi:current-ac",data_rate:"mdi:transmission-tower",data_size:"mdi:database",date:"mdi:calendar",distance:"mdi:arrow-left-right",duration:"mdi:progress-clock",energy:"mdi:lightning-bolt",frequency:"mdi:sine-wave",gas:"mdi:meter-gas",humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",irradiance:"mdi:sun-wireless",moisture:"mdi:water-percent",monetary:"mdi:cash",nitrogen_dioxide:"mdi:molecule",nitrogen_monoxide:"mdi:molecule",nitrous_oxide:"mdi:molecule",ozone:"mdi:molecule",pm1:"mdi:molecule",pm10:"mdi:molecule",pm25:"mdi:molecule",power:"mdi:flash",power_factor:"mdi:angle-acute",precipitation:"mdi:weather-rainy",precipitation_intensity:"mdi:weather-pouring",pressure:"mdi:gauge",reactive_power:"mdi:flash",signal_strength:"mdi:wifi",sound_pressure:"mdi:ear-hearing",speed:"mdi:speedometer",sulphur_dioxide:"mdi:molecule",temperature:"mdi:thermometer",timestamp:"mdi:clock",volatile_organic_compounds:"mdi:molecule",volatile_organic_compounds_parts:"mdi:molecule",voltage:"mdi:sine-wave",volume:"mdi:car-coolant-level",water:"mdi:water",weight:"mdi:weight",wind_speed:"mdi:weather-windy"},xt={10:"mdi:battery-10",20:"mdi:battery-20",30:"mdi:battery-30",40:"mdi:battery-40",50:"mdi:battery-50",60:"mdi:battery-60",70:"mdi:battery-70",80:"mdi:battery-80",90:"mdi:battery-90",100:"mdi:battery"},St=(t,e)=>{const r=Number(t);if(isNaN(r))return"off"===t?"mdi:battery":"on"===t?"mdi:battery-alert":"mdi:battery-unknown";const i=10*Math.round(r/10);return r<=5?"mdi:battery-alert-variant-outline":xt[i]},kt=t=>{const e=t?.attributes.device_class;if(e&&e in $t)return $t[e];if("battery"===e)return t?((t,e)=>{const r=t.state;return St(r)})(t):"mdi:battery";const r=t?.attributes.unit_of_measurement;return"°C"===r||"°F"===r?"mdi-thermometer":void 0},At=(t,e,r)=>{const i=e?.state;switch(t){case"alarm_control_panel":return(t=>{switch(t){case"armed_away":return"mdi:shield-lock";case"armed_vacation":return"mdi:shield-airplane";case"armed_home":return"mdi:shield-home";case"armed_night":return"mdi:shield-moon";case"armed_custom_bypass":return"mdi:security";case"pending":return"mdi:shield-outline";case"triggered":return"mdi:bell-ring";case"disarmed":return"mdi:shield-off";default:return"mdi:shield"}})(i);case"automation":return"off"===i?"mdi:robot-off":"mdi:robot";case"binary_sensor":return((t,e)=>{const r="off"===t;switch(e?.attributes.device_class){case"battery":return r?"mdi:battery":"mdi:battery-outline";case"battery_charging":return r?"mdi:battery":"mdi:battery-charging";case"carbon_monoxide":return r?"mdi:smoke-detector":"mdi:smoke-detector-alert";case"cold":return r?"mdi:thermometer":"mdi:Snowflake";case"connectivity":return r?"mdi:close-network-outline":"mdi:check-network-outline";case"door":return r?"mdi:door-closed":"mdi:door-open";case"garage_door":return r?"mdi:garage":"mdi:garage-open";case"power":case"plug":return r?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return r?"mdi:check-circle":"mdi:alert-circle";case"smoke":return r?"mdi:smoke-detector-variant":"mdi:smoke-detector-variant-alert";case"heat":return r?"mdi:thermometer":"mdi:fire";case"light":return r?"mdi:brightness-5":"mdi:brightness-7";case"lock":return r?"mdi:lock":"mdi:lock-open";case"moisture":return r?"mdi:water-off":"mdi:water";case"motion":return r?"mdi:motion-sensor-off":"mdi:motion-sensor";case"occupancy":return r?"mdi:home-outline":"mdi:Home";case"opening":return r?"mdi:square":"mdi:square-outline";case"presence":return r?"mdi:home-outline":"mdi:home";case"running":return r?"mdi:stop":"mdi:play";case"sound":return r?"mdi:music-note-off":"mdi:music-note";case"update":return r?"mdi:package":"mdi:package-up";case"vibration":return r?"mdi:crop-portrait":"mdi:vibrate";case"window":return r?"mdi:window-closed":"mdi:window-open";default:return r?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}})(i,e);case"button":switch(e?.attributes.device_class){case"restart":return"mdi:restart";case"update":return"mdi:package-up";default:return"mdi:gesture-tap-button"}case"camera":return"off"===i?"mdi:video-off":"mdi:video";case"cover":return((t,e)=>{const r="closed"!==t;switch(e?.attributes.device_class){case"garage":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdigarage";default:return"mdi:Garage-open"}case"gate":switch(t){case"opening":case"closing":return"mdi:gate-arrow-right";case"closed":return"mdi:gate";default:return"mdi:gate-open"}case"door":return r?"mdi:door-open":"mdi:door-closed";case"damper":return r?"mdi:circle":"mdi:circle-slice-8";case"shutter":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window-shutter";default:return"mdi:window-shutter-open"}case"curtain":switch(t){case"opening":return"mdi:arrow-split-vertical";case"closing":return"mdi:arrow-collapse-horizontal";case"closed":return"mdi:curtains-closed";default:return"mdi:curtains"}case"blind":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:blinds-horizontal-closed";default:return"mdi:blinds-horizontal"}case"shade":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:roller-shade-closed";default:return"mdi:roller-shade"}case"window":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}}switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}})(i,e);case"device_tracker":return"router"===e?.attributes.source_type?"home"===i?"mdi:lan-connect":"mdi:lan-cisconnect":["bluetooth","bluetooth_le"].includes(e?.attributes.source_type)?"home"===i?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===i?"mdi:account-arrow-right":"mdi:account";case"fan":return"off"===i?"mdi:fan-off":"mdi:fan";case"humidifier":return"off"===i?"mdi:air-humidifier-off":"mdi:air-humidifier";case"input_boolean":return"on"===i?"mdi:check-circle-outline":"mdi:close-circle-outline";case"input_datetime":if(!e?.attributes.has_date)return"mdi:clock";if(!e.attributes.has_time)return"mdi:calendar";break;case"lock":switch(i){case"unlocked":return"mdi:lock-open";case"jammed":return"mdi:lock-alert";case"locking":case"unlocking":return"mdi:lock-clock";default:return"mdi:lock"}case"media_player":switch(e?.attributes.device_class){case"speaker":switch(i){case"playing":return"mdi:speaker-play";case"paused":return"mdi:speaker-pause";case"off":return"mdi:speaker-off";default:return"mdi:speaker"}case"tv":switch(i){case"playing":return"mdi:television-play";case"paused":return"mdi:television-pause";case"off":return"mdi:television-off";default:return"mdi:television"}case"receiver":return"off"===i?"mdi:audio-video-off":"mdi:audio-video";default:switch(i){case"playing":case"paused":return"mdi:cast-connected";case"off":return"mdi:cast-off";default:return"mdi:cast"}}case"number":{const t=(t=>{const e=t?.attributes.device_class;if(e&&e in $t)return $t[e]})(e);if(t)return t;break}case"person":return"not_home"===i?"mdi:account-arrow-right":"mdi:account";case"switch":switch(e?.attributes.device_class){case"outlet":return"on"===i?"mdi:power-plug":"mdi:power-plug-off";case"switch":return"on"===i?"mdi:toggle-switch-variant":"mdi:toggle-switch-variant-off";default:return"mdi:toggle-switch-variant"}case"sensor":{const t=kt(e);if(t)return t;break}case"sun":return"above_horizon"===e?.state?"mdi:white-balance-sunny":"mdi:weather-night";case"switch_as_x":return"mdi:swap-horizontal";case"threshold":return"mdi:chart-sankey";case"water_heater":return"off"===i?"mdi:water-boiler-off":"mdi:water-boiler"}if(t in wt)return wt[t]},Et=t=>{return t?(r=t.entity_id,e=r.substr(0,r.indexOf(".")),At(e,t)||(console.warn(`Unable to find icon for domain ${e}`),vt)):vt;var e,r};var Ct;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(Ct=Ct||(Ct={}));const Tt=(t,e,r)=>{const i=e?(t=>{switch(t.number_format){case Ct.comma_decimal:return["en-US","en"];case Ct.decimal_comma:return["de","es","it"];case Ct.space_comma:return["fr","sv","cs"];case Ct.system:return;default:return t.language}})(e):void 0;if(Number.isNaN=Number.isNaN||function t(e){return"number"==typeof e&&t(e)},e?.number_format!==Ct.none&&!Number.isNaN(Number(t))&&Intl)try{return new Intl.NumberFormat(i,Ot(t,r)).format(Number(t))}catch(s){return console.error(s),new Intl.NumberFormat(void 0,Ot(t,r)).format(Number(t))}return!Number.isNaN(Number(t))&&""!==t&&e?.number_format===Ct.none&&Intl?new Intl.NumberFormat("en-US",Ot(t,{...r,useGrouping:!1})).format(Number(t)):"string"==typeof t?t:`${((t,e=2)=>Math.round(t*10**e)/10**e)(t,r?.maximumFractionDigits).toString()}${"currency"===r?.style?` ${r.currency}`:""}`},Ot=(t,e)=>{const r={maximumFractionDigits:2,...e};if("string"!=typeof t)return r;if(!e||void 0===e.minimumFractionDigits&&void 0===e.maximumFractionDigits){const e=t.indexOf(".")>-1?t.split(".")[1].length:0;r.minimumFractionDigits=e,r.maximumFractionDigits=e}return r};var Mt=Number.isNaN||function(t){return"number"==typeof t&&t!=t};function Nt(t,e){if(t.length!==e.length)return!1;for(var r=0;r<t.length;r++)if(i=t[r],s=e[r],!(i===s||Mt(i)&&Mt(s)))return!1;var i,s;return!0}function Pt(t,e){void 0===e&&(e=Nt);var r=null;function i(){for(var i=[],s=0;s<arguments.length;s++)i[s]=arguments[s];if(r&&r.lastThis===this&&e(i,r.lastArgs))return r.lastResult;var o=t.apply(this,i);return r={lastResult:o,lastArgs:i,lastThis:this},o}return i.clear=function(){r=null},i}const Dt=Pt((t=>new Intl.DateTimeFormat(t.language,{weekday:"long",month:"long",day:"numeric"}))),It=Pt((t=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric"}))),zt=Pt((t=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"numeric",day:"numeric"}))),Rt=(t,e)=>Ft(e).format(t),Ft=Pt((t=>new Intl.DateTimeFormat(t.language,{day:"numeric",month:"short"}))),Vt=Pt((t=>new Intl.DateTimeFormat(t.language,{month:"long",year:"numeric"}))),Ht=Pt((t=>new Intl.DateTimeFormat(t.language,{month:"long"})));Pt((t=>new Intl.DateTimeFormat(t.language,{year:"numeric"})));const jt=Pt((t=>new Intl.DateTimeFormat(t.language,{weekday:"long"}))),Ut=Pt((t=>new Intl.DateTimeFormat(t.language,{weekday:"short"})));var Jt;!function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(Jt=Jt||(Jt={}));const Lt=Pt((t=>{if(t.time_format===Jt.language||t.time_format===Jt.system){const e=t.time_format===Jt.language?t.language:void 0,r=(new Date).toLocaleString(e);return r.includes("AM")||r.includes("PM")}return t.time_format===Jt.am_pm})),Bt=Pt((t=>new Intl.DateTimeFormat("en"!==t.language||Lt(t)?t.language:"en-u-hc-h23",{hour:"numeric",minute:"2-digit",hour12:Lt(t)}))),Gt=Pt((t=>new Intl.DateTimeFormat("en"!==t.language||Lt(t)?t.language:"en-u-hc-h23",{hour:Lt(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:Lt(t)}))),Wt=Pt((t=>new Intl.DateTimeFormat("en"!==t.language||Lt(t)?t.language:"en-u-hc-h23",{weekday:"long",hour:Lt(t)?"numeric":"2-digit",minute:"2-digit",hour12:Lt(t)}))),qt=t=>Kt().format(t),Kt=Pt((()=>new Intl.DateTimeFormat("en-GB",{hour:"numeric",minute:"2-digit",hour12:!1}))),Yt=Pt((t=>new Intl.DateTimeFormat("en"!==t.language||Lt(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"long",day:"numeric",hour:Lt(t)?"numeric":"2-digit",minute:"2-digit",hour12:Lt(t)}))),Xt=Pt((t=>new Intl.DateTimeFormat("en"!==t.language||Lt(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"short",day:"numeric",hour:Lt(t)?"numeric":"2-digit",minute:"2-digit",hour12:Lt(t)}))),Zt=Pt((t=>new Intl.DateTimeFormat("en"!==t.language||Lt(t)?t.language:"en-u-hc-h23",{month:"short",day:"numeric",hour:Lt(t)?"numeric":"2-digit",minute:"2-digit",hour12:Lt(t)}))),Qt=Pt((t=>new Intl.DateTimeFormat("en"!==t.language||Lt(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"long",day:"numeric",hour:Lt(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:Lt(t)}))),te=Pt((t=>new Intl.DateTimeFormat("en"!==t.language||Lt(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit",hour12:Lt(t)}))),ee=(t,e=2)=>{let r=`${t}`;for(let i=1;i<e;i++)r=parseInt(r)<10**i?`0${r}`:r;return r};const re={ms:1,s:1e3,min:6e4,h:36e5,d:864e5},ie=(t,e)=>function(t){const e=Math.floor(t/1e3/3600),r=Math.floor(t/1e3%3600/60),i=Math.floor(t/1e3%3600%60),s=Math.floor(t%1e3);return e>0?`${e}:${ee(r)}:${ee(i)}`:r>0?`${r}:${ee(i)}`:i>0||s>0?`${i}${s>0?`.${ee(s,3)}`:""}`:null}(parseFloat(t)*re[e])||"0",se=t=>t.substring(0,t.indexOf(".")),oe=t=>{const e=Math.round(Math.min(Math.max(t,0),255)).toString(16);return 1===e.length?`0${e}`:e},ae=t=>`#${oe(t[0])}${oe(t[1])}${oe(t[2])}`,ne=t=>{const[e,r,i]=t,s=Math.max(e,r,i),o=s-Math.min(e,r,i),a=o&&(s===e?(r-i)/o:s===r?2+(i-e)/o:4+(e-r)/o);return[60*(a<0?a+6:a),s&&o/s,s]},ce=t=>{const[e,r,i]=t,s=t=>{const s=(t+e/60)%6;return i-i*r*Math.max(Math.min(s,4-s,1),0)};return[s(5),s(3),s(1)]},le=t=>ce([t[0],t[1],255]),de=(t,e,r)=>Math.min(Math.max(t,e),r),he=t=>{if(t<=66)return 255;return de(329.698727446*(t-60)**-.1332047592,0,255)},ue=t=>{let e;return e=t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*(t-60)**-.0755148492,de(e,0,255)},me=t=>{if(t>=66)return 255;if(t<=19)return 0;const e=138.5177312231*Math.log(t-10)-305.0447927307;return de(e,0,255)},pe=t=>{const e=t/100;return[he(e),ue(e),me(e)]},fe=(t,e)=>{const r=Math.max(...t),i=Math.max(...e);let s;return s=0===i?0:r/i,e.map((t=>Math.round(t*s)))},ge=t=>Math.floor(1e6/t),_e=(t,e,r)=>{const[i,s,o,a,n]=t,c=ge(e??2700),l=ge(r??6500),d=c-l;let h;try{h=n/(a+n)}catch(b){h=.5}const u=l+h*d,m=u?(p=u,Math.floor(1e6/p)):0;var p;const[f,g,_]=pe(m),y=Math.max(a,n)/255;return fe([i,s,o,a,n],[i+f*y,s+g*y,o+_*y])},ye="unavailable",be=(ve=[ye,"unknown"],(t,e)=>ve.includes(t,e));var ve;function we(t,e){const r=se(t.entity_id),i=void 0!==e?e:t?.state;if(["button","event","infrared","input_button","radio_frequency","scene"].includes(r))return i!==ye;if(be(i))return!1;if("off"===i&&"alert"!==r)return!1;switch(r){case"alarm_control_panel":return"disarmed"!==i;case"alert":return"idle"!==i;case"cover":case"valve":return"closed"!==i;case"device_tracker":case"person":return"not_home"!==i;case"lawn_mower":return!["docked","paused"].includes(i);case"lock":return"locked"!==i;case"media_player":return"standby"!==i;case"vacuum":return!["idle","docked","paused"].includes(i);case"plant":return"problem"===i;case"group":return["on","home","open","locked","problem"].includes(i);case"timer":return"active"===i;case"camera":return"streaming"===i}return!0}const $e=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater","weather"]),xe=(t,e)=>{if((void 0!==e?e:t?.state)===ye)return"var(--state-unavailable-color)";const r=Ae(t,e);return r?(i=r,Array.isArray(i)?i.reverse().reduce(((t,e)=>`var(${e}${t?`, ${t}`:""})`),void 0):`var(${i})`):void 0;var i},Se=(t,e,r)=>{const i=void 0!==r?r:e.state,s=we(e,r);return ke(t,e.attributes.device_class,i,s)},ke=(t,e,r,i)=>{const s=[],o=((t,e="_")=>{const r="àáâäæãåāăąабçćčđďдèéêëēėęěеёэфğǵгḧхîïíīįìıİийкłлḿмñńǹňнôöòóœøōõőоṕпŕřрßśšşșсťțтûüùúūǘůűųувẃẍÿýыžźżз·",i=`aaaaaaaaaaabcccdddeeeeeeeeeeefggghhiiiiiiiiijkllmmnnnnnoooooooooopprrrsssssstttuuuuuuuuuuvwxyyyzzzz${e}`,s=new RegExp(r.split("").join("|"),"g"),o={"ж":"zh","х":"kh","ц":"ts","ч":"ch","ш":"sh","щ":"shch","ю":"iu","я":"ia"};let a;return""===t?a="":(a=t.toString().toLowerCase().replace(s,(t=>i.charAt(r.indexOf(t)))).replace(/[а-я]/g,(t=>o[t]||"")).replace(/(\d),(?=\d)/g,"$1").replace(/[^a-z0-9]+/g,e).replace(new RegExp(`(${e})\\1+`,"g"),"$1").replace(new RegExp(`^${e}+`),"").replace(new RegExp(`${e}+$`),""),""===a&&(a="unknown")),a})(r,"_"),a=i?"active":"inactive";return e&&s.push(`--state-${t}-${e}-${o}-color`),s.push(`--state-${t}-${o}-color`,`--state-${t}-${a}-color`,`--state-${a}-color`),s},Ae=(t,e)=>{const r=void 0!==e?e:t?.state,i=se(t.entity_id),s=t.attributes.device_class;if("sensor"===i&&"battery"===s){const t=(t=>{const e=Number(t);if(!isNaN(e))return e>=70?"--state-sensor-battery-high-color":e>=30?"--state-sensor-battery-medium-color":"--state-sensor-battery-low-color"})(r);if(t)return[t]}if("group"===i){const r=(t=>{const e=t.attributes.entity_id||[],r=[...new Set(e.map((t=>se(t))))];return 1===r.length?r[0]:void 0})(t);if(r&&$e.has(r))return Se(r,t,e)}if($e.has(i))return Se(i,t,e)},Ee=t=>{if(t.attributes.brightness&&"plant"!==se(t.entity_id)){return`brightness(${(t.attributes.brightness+245)/5}%)`}return""};var Ce;!function(t){t[t.TARGET_TEMPERATURE=1]="TARGET_TEMPERATURE",t[t.TARGET_TEMPERATURE_RANGE=2]="TARGET_TEMPERATURE_RANGE",t[t.TARGET_HUMIDITY=4]="TARGET_HUMIDITY",t[t.FAN_MODE=8]="FAN_MODE",t[t.PRESET_MODE=16]="PRESET_MODE",t[t.SWING_MODE=32]="SWING_MODE",t[t.AUX_HEAT=64]="AUX_HEAT",t[t.TURN_OFF=128]="TURN_OFF",t[t.TURN_ON=256]="TURN_ON",t[t.SWING_HORIZONTAL_MODE=512]="SWING_HORIZONTAL_MODE"}(Ce||(Ce={})),["auto","heat_cool","heat","cool","dry","fan_only","off"].reduce(((t,e,r)=>(t[e]=r,t)),{});const Te={cooling:"cool",defrosting:"heat",drying:"dry",fan:"fan_only",heating:"heat",idle:"off",off:"off",preheating:"heat"};class Oe{static{Oe.colorCache={},Oe.element=void 0}static _prefixKeys(t){let e={};return Object.keys(t).forEach((r=>{const i=`--${r}`,s=String(t[r]);e[i]=`${s}`})),e}static processTheme(t){let e={},r={},i={},s={};const{modes:o,...a}=t;return o&&(r={...a,...o.dark},e={...a,...o.light}),i=Oe._prefixKeys(e),s=Oe._prefixKeys(r),{themeLight:i,themeDark:s}}static processPalette(t){let e={},r={},i={},s={},o={};return Object.values(t).forEach((t=>{const{modes:s,...o}=t;e={...e,...o},s&&(i={...i,...o,...s.dark},r={...r,...o,...s.light})})),s=Oe._prefixKeys(r),o=Oe._prefixKeys(i),{paletteLight:s,paletteDark:o}}static setElement(t){Oe.element=t}static calculateColor(t,e,r){const i=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let s,o,a;const n=i.length;if(t<=i[0])return e[i[0]];if(t>=i[n-1])return e[i[n-1]];for(let c=0;c<n-1;c++){const n=i[c],l=i[c+1];if(t>=n&&t<l){if([s,o]=[e[n],e[l]],!r)return s;a=Oe.calculateValueBetween(n,l,t);break}}return Oe.getGradientValue(s,o,a)}static calculateColor2(t,e,r,i,s){const o=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let a,n,c;const l=o.length;if(t<=o[0])return e[o[0]];if(t>=o[l-1])return e[o[l-1]];for(let d=0;d<l-1;d++){const l=o[d],h=o[d+1];if(t>=l&&t<h){if([a,n]=[e[l].styles[r][i],e[h].styles[r][i]],!s)return a;c=Oe.calculateValueBetween(l,h,t);break}}return Oe.getGradientValue(a,n,c)}static calculateValueBetween(t,e,r){return(Math.min(Math.max(r,t),e)-t)/(e-t)}static getColorVariable(t){const e=t.substr(4,t.length-5);return window.getComputedStyle(Oe.element).getPropertyValue(e)}static getGradientValue(t,e,r){const i=Oe.colorToRGBA(t),s=Oe.colorToRGBA(e),o=1-r,a=r,n=Math.floor(i[0]*o+s[0]*a),c=Math.floor(i[1]*o+s[1]*a),l=Math.floor(i[2]*o+s[2]*a),d=Math.floor(i[3]*o+s[3]*a);return`#${Oe.padZero(n.toString(16))}${Oe.padZero(c.toString(16))}${Oe.padZero(l.toString(16))}${Oe.padZero(d.toString(16))}`}static padZero(t){return t.length<2&&(t=`0${t}`),t.substr(0,2)}static colorToRGBA(t){if(null==t)return[0,0,0,0];const e=Oe.colorCache[t];if(e)return e;let r=t;"var"===t.substr(0,3).valueOf()&&(r=Oe.getColorVariable(t));const i=window.document.createElement("canvas");i.width=i.height=1;const s=i.getContext("2d");s.clearRect(0,0,1,1),s.fillStyle=r,s.fillRect(0,0,1,1);const o=[...s.getImageData(0,0,1,1).data];return Oe.colorCache[t]=o,o}static hslToRgb(t){const e=t.h/360,r=t.s/100,i=t.l/100;let s,o,a;if(0===r)s=o=a=i;else{function n(t,e,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?t+6*(e-t)*r:r<.5?e:r<2/3?t+(e-t)*(2/3-r)*6:t}const c=i<.5?i*(1+r):i+r-i*r,l=2*i-c;s=n(l,c,e+1/3),o=n(l,c,e),a=n(l,c,e-1/3)}return s*=255,o*=255,a*=255,{r:s,g:o,b:a}}static getHaEntityIconStyle(t,e=!0){const r=se(t.entity_id);let i;if(e){if(t.attributes?.hvac_action){const e=Te[t.attributes.hvac_action];e&&(i=xe(t,e))}void 0===i&&"light"===r&&we(t)&&t.attributes?.rgb_color&&(i=`rgb(${t.attributes.rgb_color.join(",")})`),void 0===i&&(i=xe(t))}const s=e?Ee(t):"";return{color:i??"var(--state-icon-color)",fill:"currentColor",...s?{filter:s}:{}}}static getHaEntityIconStyleV1(t){const e=t.entity_id.split(".")[0];let r;if(t.attributes?.hvac_action){const e=Te[t.attributes.hvac_action];e&&(r=xe(t,e))}return void 0===r&&"light"===e&&we(t)&&t.attributes?.rgb_color&&(r=`rgb(${t.attributes.rgb_color.join(",")})`),void 0===r&&(r=xe(t)),{color:r??"var(--state-icon-color)",fill:r??"currentColor",filter:Ee(t)}}}console.info("%c FLEX-HORSESHOE-CARD %c Version 5.4.4-dev.4 ","color: white; font-weight: bold; background: darkgreen","color: darkgreen; font-weight: bold; background: white");const Me=200,Ne={xpos:50,ypos:50,horseshoe_radius:90,tickmarks_radius:86},Pe={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed"},De={min:0,max:100,width:6,color:"var(--primary-background-color)"},Ie={width:12,color:"var(--primary-color)"},ze={action:"more-info"};class Re extends nt{constructor(){if(super(),Oe.setElement(this),this.cardId=Math.random().toString(36).substr(2,9),this._hass=void 0,this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.viewBoxSize=Me,this.colorStops={},this.animations={},this.animations.vlines={},this.animations.hlines={},this.animations.circles={},this.animations.icons={},this.animations.iconsIcon={},this.animations.names={},this.animations.areas={},this.animations.states={},this.resolvedEntityConfigs=[],this.colorCache={},this.isAndroid=!1,this.isSafari=!1,this.iOS=!1,this.resolvedVariables={},this.iconCache={},this.iconsSvg=[],this.pendingIconPath=[],this.iconsId=[],this.bar_mode="normal",this.dev={debug:!1},this.isAndroid=!!window.navigator.userAgent.match(/Android/),!this.isAndroid){const t=window.navigator.userAgent||"",e=t.toLowerCase(),r=window.navigator.platform||"",i=(/iPad|iPhone|iPod/.test(t)||"MacIntel"===r&&window.navigator.maxTouchPoints>1)&&!window.MSStream,s=t.match(/Version\/(\d+)(?:\.[\d.]+)?.*Safari/i),o=s?Number(s[1]):void 0,a=e.match(/\bos\s+(\d+)(?:[._]\d+)*.*like safari/),n=e.match(/\bios\s+(\d+)(?:[._]\d+)*/),c=n?Number(n[1]):a?Number(a[1]):void 0,l=Number.isFinite(o),d=Number.isFinite(c)&&e.includes("like safari"),h=l?o:d?c:void 0;this.iOS=i,this.isSafari=Number.isFinite(h),this.safariMajorVersion=h,this.isHomeAssistantLikeSafari=d,this.isRealSafari=l,this.isSafari14=this.isSafari&&14===h,this.isSafari15=this.isSafari&&15===h,this.isSafari16=this.isSafari&&16===h,this.isSafari17=this.isSafari&&17===h,this.isSafari18=this.isSafari&&18===h,this.isSafari26=this.isSafari&&26===h,this.isSafari27=this.isSafari&&27===h,this.isSafari28=this.isSafari&&28===h,this.isSafari29=this.isSafari&&29===h,this.isSafari30=this.isSafari&&30===h,this.isSafariGte16=this.isSafari&&h>=16,this.dev?.debug&&console.log("browser detection",{ua:t,isAndroid:this.isAndroid,isIOS:this.iOS,isSafari:this.isSafari,isRealSafari:this.isRealSafari,isHomeAssistantLikeSafari:this.isHomeAssistantLikeSafari,safariMajorVersion:this.safariMajorVersion,isSafariGte16:this.isSafariGte16}),this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config)}}static get styles(){return o`
      :host {
        cursor: pointer;
      }

      @media (print), (prefers-reduced-motion: reduce) {
        .animated {
          animation-duration: 1ms !important;
          transition-duration: 1ms !important;
          animation-iteration-count: 1 !important;
        }
      }

      @keyframes zoomOut {
        from {
          opacity: 1;
        }

        50% {
          opacity: 0;
          transform: scale3d(0.3, 0.3, 0.3);
        }

        to {
          opacity: 0;
        }
      }

      @keyframes bounce {
        from,
        20%,
        53%,
        80%,
        to {
          animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
          transform: translate3d(0, 0, 0);
        }

        40%,
        43% {
          animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
          transform: translate3d(0, -30px, 0);
        }

        70% {
          animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
          transform: translate3d(0, -15px, 0);
        }

        90% {
          transform: translate3d(0, -4px, 0);
        }
      }

      @keyframes flash {
        from,
        50%,
        to {
          opacity: 1;
        }

        25%,
        75% {
          opacity: 0;
        }
      }

      @keyframes headShake {
        0% {
          transform: translateX(0);
        }

        6.5% {
          transform: translateX(-6px) rotateY(-9deg);
        }

        18.5% {
          transform: translateX(5px) rotateY(7deg);
        }

        31.5% {
          transform: translateX(-3px) rotateY(-5deg);
        }

        43.5% {
          transform: translateX(2px) rotateY(3deg);
        }

        50% {
          transform: translateX(0);
        }
      }

      @keyframes heartBeat {
        0% {
          transform: scale(1);
        }

        14% {
          transform: scale(1.3);
        }

        28% {
          transform: scale(1);
        }

        42% {
          transform: scale(1.3);
        }

        70% {
          transform: scale(1);
        }
      }

      @keyframes jello {
        from,
        11.1%,
        to {
          transform: translate3d(0, 0, 0);
        }

        22.2% {
          transform: skewX(-12.5deg) skewY(-12.5deg);
        }

        33.3% {
          transform: skewX(6.25deg) skewY(6.25deg);
        }

        44.4% {
          transform: skewX(-3.125deg) skewY(-3.125deg);
        }

        55.5% {
          transform: skewX(1.5625deg) skewY(1.5625deg);
        }

        66.6% {
          transform: skewX(-0.78125deg) skewY(-0.78125deg);
        }

        77.7% {
          transform: skewX(0.390625deg) skewY(0.390625deg);
        }

        88.8% {
          transform: skewX(-0.1953125deg) skewY(-0.1953125deg);
        }
      }

      @keyframes pulse {
        from {
          transform: scale3d(1, 1, 1);
        }

        50% {
          transform: scale3d(1.05, 1.05, 1.05);
        }

        to {
          transform: scale3d(1, 1, 1);
        }
      }

      @keyframes rubberBand {
        from {
          transform: scale3d(1, 1, 1);
        }

        30% {
          transform: scale3d(1.25, 0.75, 1);
        }

        40% {
          transform: scale3d(0.75, 1.25, 1);
        }

        50% {
          transform: scale3d(1.15, 0.85, 1);
        }

        65% {
          transform: scale3d(0.95, 1.05, 1);
        }

        75% {
          transform: scale3d(1.05, 0.95, 1);
        }

        to {
          transform: scale3d(1, 1, 1);
        }
      }

      @keyframes shake {
        from,
        to {
          transform: translate3d(0, 0, 0);
        }

        10%,
        30%,
        50%,
        70%,
        90% {
          transform: translate3d(-10px, 0, 0);
        }

        20%,
        40%,
        60%,
        80% {
          transform: translate3d(10px, 0, 0);
        }
      }

      @keyframes swing {
        20% {
          transform: rotate3d(0, 0, 1, 15deg);
        }

        40% {
          transform: rotate3d(0, 0, 1, -10deg);
        }

        60% {
          transform: rotate3d(0, 0, 1, 5deg);
        }

        80% {
          transform: rotate3d(0, 0, 1, -5deg);
        }

        to {
          transform: rotate3d(0, 0, 1, 0deg);
        }
      }

      @keyframes tada {
        from {
          transform: scale3d(1, 1, 1);
        }
        10%,
        20% {
          transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
        }
        30%,
        50%,
        70%,
        90% {
          transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
        }
        40%,
        60%,
        80% {
          transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
        }
        to {
          transform: scale3d(1, 1, 1);
        }
      }

      @keyframes wobble {
        from {
          transform: translate3d(0, 0, 0);
        }
        15% {
          transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);
        }
        30% {
          transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);
        }
        45% {
          transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);
        }
        60% {
          transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);
        }
        75% {
          transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);
        }
        to {
          transform: translate3d(0, 0, 0);
        }
      }

      @media screen and (min-width: 467px) {
        :host {
          font-size: 12px;
        }
      }
      @media screen and (max-width: 466px) {
        :host {
          font-size: 12px;
        }
      }

      :host ha-card {
        padding: 10px 10px 0px 10px;
      }

      .container {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .labelContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 65%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
      }

      .ellipsis {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .state {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        max-width: 100%;
        min-width: 0px;
      }

      #label {
        display: flex;
        line-height: 1;
      }

      #label.bold {
        font-weight: bold;
      }

      #label,
      #name {
        margin: 3% 0;
      }

      .text {
        font-size: 100%;
      }

      #name {
        font-size: 80%;
        font-weight: 300;
      }

      .unit {
        font-size: 65%;
        font-weight: normal;
        opacity: 0.6;
        line-height: 2em;
        vertical-align: bottom;
        margin-left: 0.25rem;
      }

      .entity__area {
        position: absolute;
        top: 70%;
        font-size: 120%;
        opacity: 0.6;
        display: flex;
        line-height: 1;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 20%;
        flex-direction: column;
      }

      .nam {
        alignment-baseline: central;
        fill: var(--primary-text-color);
      }

      .state__uom {
        font-size: 20px;
        opacity: 0.7;
        margin: 0;
        fill: var(--primary-text-color);
      }

      .state__value {
        font-size: 3em;
        opacity: 1;
        fill: var(--primary-text-color);
        text-anchor: middle;
      }
      .entity__name {
        text-anchor: middle;
        overflow: hidden;
        opacity: 0.8;
        fill: var(--primary-text-color);
        font-size: 1.5em;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }

      .entity__area {
        font-size: 12px;
        opacity: 0.7;
        overflow: hidden;
        fill: var(--primary-text-color);
        text-anchor: middle;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }

      .shadow {
        font-size: 30px;
        font-weight: 700;
        text-anchor: middle;
      }

      .card--dropshadow-5 {
        filter: drop-shadow(0 1px 0 #ccc) drop-shadow(0 2px 0 #c9c9c9) drop-shadow(0 3px 0 #bbb) drop-shadow(0 4px 0 #b9b9b9) drop-shadow(0 5px 0 #aaa) drop-shadow(0 6px 1px rgba(0, 0, 0, 0.1))
          drop-shadow(0 0 5px rgba(0, 0, 0, 0.1)) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3)) drop-shadow(0 3px 5px rgba(0, 0, 0, 0.2)) drop-shadow(0 5px 10px rgba(0, 0, 0, 0.25))
          drop-shadow(0 10px 10px rgba(0, 0, 0, 0.2)) drop-shadow(0 20px 20px rgba(0, 0, 0, 0.15));
      }
      .card--dropshadow-medium--opaque--sepia90 {
        filter: drop-shadow(0em 0.05em 0px #b2a98f22) drop-shadow(0em 0.07em 0px #b2a98f55) drop-shadow(0em 0.1em 0px #b2a98f88) drop-shadow(0px 0.6em 0.9em rgba(0, 0, 0, 0.15))
          drop-shadow(0px 1.2em 0.15em rgba(0, 0, 0, 0.1)) drop-shadow(0px 2.4em 2.5em rgba(0, 0, 0, 0.1)) sepia(90%);
      }

      .card--dropshadow-heavy--sepia90 {
        filter: drop-shadow(0em 0.05em 0px #b2a98f22) drop-shadow(0em 0.07em 0px #b2a98f55) drop-shadow(0em 0.1em 0px #b2a98f88) drop-shadow(0px 0.3em 0.45em rgba(0, 0, 0, 0.5))
          drop-shadow(0px 0.6em 0.07em rgba(0, 0, 0, 0.3)) drop-shadow(0px 1.2em 1.25em rgba(0, 0, 0, 1)) drop-shadow(0px 1.8em 1.6em rgba(0, 0, 0, 0.1)) drop-shadow(0px 2.4em 2em rgba(0, 0, 0, 0.1))
          drop-shadow(0px 3em 2.5em rgba(0, 0, 0, 0.1)) sepia(90%);
      }

      .card--dropshadow-heavy {
        filter: drop-shadow(0em 0.05em 0px #b2a98f22) drop-shadow(0em 0.07em 0px #b2a98f55) drop-shadow(0em 0.1em 0px #b2a98f88) drop-shadow(0px 0.3em 0.45em rgba(0, 0, 0, 0.5))
          drop-shadow(0px 0.6em 0.07em rgba(0, 0, 0, 0.3)) drop-shadow(0px 1.2em 1.25em rgba(0, 0, 0, 1)) drop-shadow(0px 1.8em 1.6em rgba(0, 0, 0, 0.1)) drop-shadow(0px 2.4em 2em rgba(0, 0, 0, 0.1))
          drop-shadow(0px 3em 2.5em rgba(0, 0, 0, 0.1));
      }

      .card--dropshadow-medium--sepia90 {
        filter: drop-shadow(0em 0.05em 0px #b2a98f) drop-shadow(0em 0.15em 0px #b2a98f) drop-shadow(0em 0.15em 0px #b2a98f) drop-shadow(0px 0.6em 0.9em rgba(0, 0, 0, 0.15))
          drop-shadow(0px 1.2em 0.15em rgba(0, 0, 0, 0.1)) drop-shadow(0px 2.4em 2.5em rgba(0, 0, 0, 0.1)) sepia(90%);
      }

      .card--dropshadow-medium {
        filter: drop-shadow(0em 0.05em 0px #b2a98f) drop-shadow(0em 0.15em 0px #b2a98f) drop-shadow(0em 0.15em 0px #b2a98f) drop-shadow(0px 0.6em 0.9em rgba(0, 0, 0, 0.15))
          drop-shadow(0px 1.2em 0.15em rgba(0, 0, 0, 0.1)) drop-shadow(0px 2.4em 2.5em rgba(0, 0, 0, 0.1));
      }

      .card--dropshadow-light--sepia90 {
        filter: drop-shadow(0px 0.1em 0px #b2a98f) drop-shadow(0.1em 0.5em 0.2em rgba(0, 0, 0, 0.5)) sepia(90%);
      }

      .card--dropshadow-light {
        filter: drop-shadow(0px 0.1em 0px #b2a98f) drop-shadow(0.1em 0.5em 0.2em rgba(0, 0, 0, 0.5));
      }

      .card--dropshadow-down-and-distant {
        filter: drop-shadow(0px 0.05em 0px #b2a98f) drop-shadow(0px 14px 10px rgba(0, 0, 0, 0.15)) drop-shadow(0px 24px 2px rgba(0, 0, 0, 0.1)) drop-shadow(0px 34px 30px rgba(0, 0, 0, 0.1));
      }
      .card--filter-none {
      }

      .horseshoe__svg__group {
        /*
          * Was transform: translateY(15%).
          * After fixing SVG viewBox/namespace parsing, this offset became visible
          * and moved the horseshoe down.
          * A nice 6 year old bug ;-)
          */
      }

      .line__horizontal {
        stroke: var(--primary-text-color);
        opacity: 0.3;
        stroke-width: 2;
      }

      .line__vertical {
        stroke: var(--primary-text-color);
        opacity: 0.3;
        stroke-width: 2;
      }

      .svg__dot {
        fill: var(--primary-text-color);
        opacity: 0.5;
        align-self: center;
        transform-origin: 50% 50%;
      }

      .icon {
        align: center;
      }
    `}_resolveEntityConfigs(t){return t?.dev?.debug&&console.log("resolving entity config for",t?.entities),t?.entities?.map(((t,e)=>{const r={entity_index:e};return yt.getJsTemplateOrValue(r,t)}))??[]}set hass(t){this._hass=t,yt.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes});let e=!1;if(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.resolvedEntityConfigs.forEach(((r,i)=>{const s=t.states[r.entity];if(!s)return;this.entities[i]=s;const o=this._buildState(s.state,r);if(o!==this.entitiesStr[i]&&(this.entitiesStr[i]=o,e=!0),r.attribute&&Object.prototype.hasOwnProperty.call(s.attributes,r.attribute)){const t=this._buildState(s.attributes[r.attribute],r);t!==this.attributesStr[i]&&(this.attributesStr[i]=t,e=!0)}})),!e)return;this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.horseshoes=this.horseshoes.map((t=>{const e=t.entity_index??0,r=this.resolvedEntityConfigs[e],i=this.entities[e];if(!i||!r)return t;let s=i.state;r.attribute&&void 0!==i.attributes[r.attribute]&&(s=i.attributes[r.attribute]);const o=yt.getJsTemplateOrValue({entity_index:e},t.horseshoe_scale),a=o?.min??0,n=o?.max??100;let c,l,d=!1;if("bidirectional"===(t.bar_mode||"normal")){const e=t.horseshoePathLength,r=Number(s);if(r>=0){const i=Math.min(Oe.calculateValueBetween(0,n,r),1)*(e/2);c=`${i} ${t.circlePathLength-i}`,l=void 0,d=!1}else{const i=(1-Math.min(Oe.calculateValueBetween(a,0,r),1))*(e/2);c=`${i} ${t.circlePathLength-i}`,l=""+-(t.circlePathLength-i),d=!0}}else{c=`${Math.min(Oe.calculateValueBetween(a,n,s),1)*t.horseshoePathLength} ${10*t.radiusSize}`,l=void 0,d=!1}const h=Math.min(Oe.calculateValueBetween(a,n,s),1),u=t.show.horseshoe_style;let m=t.color0,p=t.color1,f=t.color1_offset,g=t.angleCoords,_=t.stroke_color;if("fixed"===u)_=t.horseshoe_state.color,m=t.horseshoe_state.color,p=t.horseshoe_state.color,f="0%";else if("autominmax"===u){const e=this._calculateStrokeColor(s,t.colorStopsMinMax,!0);m=e,p=e,f="0%"}else if("colorstop"===u||"colorstopgradient"===u){const e=this._calculateStrokeColor(s,t.colorStops,"colorstopgradient"===u);m=e,p=e,f="0%"}else"lineargradient"===u&&(g={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},f=`${Math.round(100*(1-h))}%`);return{...t,horseshoe_scale:{...t.horseshoe_scale,...o},dashArray:c,dashOffset:l,bidirectional_negative:d,stroke_color:_,color0:m,color1:p,color1_offset:f,angleCoords:g}}));const r=this.horseshoes[0];this.dashArray=r.dashArray,this.dashOffset=r.dashOffset,this._bidirectional_negative=r.bidirectional_negative,this.stroke_color=r.stroke_color,this.color0=r.color0,this.color1=r.color1,this.color1_offset=r.color1_offset,this.angleCoords=r.angleCoords,this.config.animations&&Object.keys(this.config.animations).map((t=>{const e=t.substr(Number(t.indexOf(".")+1));return this.config.animations[t].map((t=>this.entities[e].state.toLowerCase()===t.state.toLowerCase()&&(t.vlines&&t.vlines.forEach((t=>this._updateAnimationStyles("vlines",t))),t.hlines&&t.hlines.forEach((t=>this._updateAnimationStyles("hlines",t))),t.circles&&t.circles.forEach((t=>this._updateAnimationStyles("circles",t))),t.icons&&t.icons.forEach((t=>{const e=t.animation_id;this.animations.icons[e]&&t.reuse||(this.animations.icons[e]={},this.animations.iconsIcon[e]={});const r=yt.getJsTemplateOrValue(t,t.styles),i=_t.toStyleDict(r);this.animations.icons[e]={...this.animations.icons[e],...i},this.animations.iconsIcon[e]=yt.getJsTemplateOrValue(t,t.icon)})),t.states&&t.states.forEach((t=>this._updateAnimationStyles("states",t))),!0))),!0})),yt.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),this.requestUpdate()}_updateAnimationStyles(t,e){const r=e.animation_id;if(null==r)return;const i=yt.getJsTemplateOrValue(e,e.styles),s=_t.toStyleDict(i);this.animations[t][r]={...e.reuse?this.animations[t][r]??{}:{},...s}}_prepareItemColorStops(t){["states","names","areas","circles","hlines","vlines","icons","horseshoes"].forEach((e=>{const r=t.layout?.[e];Array.isArray(r)&&r.forEach((t=>{if(!t.color_stops)return;const e=yt.getJsTemplateOrValue(t,t.color_stops,{resolveKeys:!0});t._colorStops=bt.normalize(e)}))}))}setConfig(t){try{if(!(t=JSON.parse(JSON.stringify(t))).entities)throw Error("No entities defined");if(!t.layout)throw Error("No layout defined");yt.setContext({hass:this._hass,config:t,entities:this.entities,horseshoes:this.horseshoes});const e=this._resolveEntityConfigs(t);if(e){if("sensor"!==se(e[0].entity)&&e[0].attribute&&!isNaN(e[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}e.forEach((t=>{t.tap_action||(t.tap_action={...ze})}));const r={texts:[],card_filter:"card--filter-none",bar_mode:t.bar_mode||"normal",...t,show:{...Pe,...t.show},horseshoe_position:{...Ne,...t?.horseshoe_position},horseshoe_scale:{...De,...t.horseshoe_scale},horseshoe_state:{...Ie,...t.horseshoe_state}},i=Array.isArray(r.layout.horseshoes)?r.layout.horseshoes.map(((t,e)=>({...r,...t,entity_index:t.entity_index??e}))):[{...r,entity_index:0}];if(this.horseshoes=i.map(((t,e)=>{const r=t.entity_index??e,i={...Pe,...t.show??{}},s={...De,...t.horseshoe_scale??{}},o={...Ie,...t.horseshoe_state??{}},a=t.xpos??t.horseshoe_position?.xpos??t.horseshoe_position?.cx??Ne.xpos??Ne.cx??50,n=t.ypos??t.horseshoe_position?.ypos??t.horseshoe_position?.cy??Ne.ypos??Ne.cy??50;if(!s.min&&0!==s.min||!s.max&&0!==s.max)throw Error(`No horseshoe min/max for scale defined for horseshoe ${e}`);const c=t.color_stops;if(!c)throw console.warn(`No color_stops defined for horseshoe ${e}`),Error(`No color_stops defined for horseshoe ${e}`);const l=yt.getJsTemplateOrValue({entity_index:r},c,{resolveKeys:!0}),d=bt.normalize(l),h=d.colors;if(!h||h.length<2)throw Error(`No color_stops defined or not at least two colorstops for horseshoe ${e}`);const u=h[0],m=h[h.length-1];let p,f,g=bt.normalize({});u&&m&&(g=bt.normalize({[s.min]:u.color,[s.max]:m.color}),p=u.color,f=m.color);const _=t.radius??45,y=t.tickmarks_radius??43,b=t.arc_degrees??260,v=_/100*Me,w=y/100*Me,$=2*b/360*Math.PI*v,x=2*Math.PI*v;return{...t,entity_index:r,show:i,fill:t.fill??"rgba(0, 0, 0, 0)",xpos:a,ypos:n,bar_mode:t.bar_mode??"normal",horseshoe_scale:s,horseshoe_state:o,radius:_,tickmarks_radius:y,arc_degrees:b,radiusSize:v,tickmarksRadiusSize:w,horseshoePathLength:$,circlePathLength:x,color_stops:c,colorStops:d,colorStopsMinMax:g,color0:p,color1:f,angleCoords:{x1:"0%",y1:"0%",x2:"100%",y2:"0%"},color1_offset:"0%",dashArray:this.dashArray,dashOffset:this.dashOffset,bidirectional_negative:this._bidirectional_negative}})),!this.horseshoes.length)throw Error("No horseshoes defined");const s=this.horseshoes[0];this.colorStops=s.colorStops,this.colorStopsMinMax=s.colorStopsMinMax,this.color0=s.color0,this.color1=s.color1,this.angleCoords=s.angleCoords,this.color1_offset=s.color1_offset,this._prepareItemColorStops(r),this.config=r,this.bar_mode=r.bar_mode||"normal",this.config.layout?.icons&&this.config.layout.icons.forEach(((t,e)=>{this.iconsId[e]=Math.random().toString(36).substr(2,9)})),yt.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes})}catch(e){throw console.error("[FHC setConfig] CONFIG ERROR",{error:e,message:e?.message,stack:e?.stack,config:t}),e}}_getItemStateValue(t={}){const e=t.entity_index??0,r=this.entities?.[e],i=this.config?.entities?.[e];if(!r)return;const s=i?.attribute;return s&&r.attributes&&void 0!==r.attributes[s]?r.attributes[s]:r.state}_getItemColorFromStops(t={}){if(!t._colorStops)return;const e=this._getItemStateValue(t),r=Number(e);return Number.isFinite(r)?this._calculateStrokeColor(r,t._colorStops,!0===t.colorstop_gradient):void 0}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback()}render({config:t}=this){const e=yt.getJsTemplateOrValue({entity_index:0},t?.styles),r=_t.toStyleDict(e);return U`
      <ha-card @click=${t=>this.handlePopup(t,this.entities[0])} style=${mt(r)}>
        <div class="container" id="container">${this._renderSvg()}</div>

        <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
          ${this.horseshoes?.map(((t,e)=>J`
              <linearGradient
                gradientTransform="rotate(0)"
                id="horseshoe__gradient-${this.cardId}-${e}"
                x1="${t.angleCoords.x1}"
                y1="${t.angleCoords.y1}"
                x2="${t.angleCoords.x2}"
                y2="${t.angleCoords.y2}"
              >
                <stop offset="${t.color1_offset}" stop-color="${t.color1}" style="transition: stop-color 1s ease;"></stop>
                <stop offset="100%" stop-color="${t.color0}" style="transition: stop-color 1s ease;"></stop>
              </linearGradient>
            `))??""}
        </svg>
      </ha-card>
    `}_renderTickMarks(t){if(!1===t.show?.scale_tickmarks)return J``;const e=t.horseshoe_scale,r=Number(e.min),i=Number(e.max),s=i-r;if(!s)return J``;const o={entity_index:t.entity_index},a=yt.getJsTemplateOrValue(o,t?.horseshoe_tickmarks?.styles),n=_t.toStyleDict(a),c=2*(t.xpos??50),l=2*(t.ypos??50),d={transformOrigin:`${c}px ${l}px`};void 0!==t?.horseshoe_tickmarks?.fill&&(d.fill=t.horseshoe_tickmarks.fill);const h=e.color||"var(--primary-background-color)";d.fill=h;const u={...n,...d},m=e.ticksize||s/10,p=t.arc_degrees||260,f=e.width?e.width/2:3,g=r%m,_=r+(0===g?0:m-g);if(_>i)return J``;const y=Math.floor((i-_)/m)+1,b=Array.from({length:y},((e,i)=>{const o=(p/2-(_+i*m-r)/s*p)*Math.PI/180;return J`
      <circle
        cx="${c-Math.sin(o)*t.tickmarksRadiusSize}"
        cy="${l-Math.cos(o)*t.tickmarksRadiusSize}"
        r="${f}"
        style=${mt(u)}>
      </circle>
    `}));return J`${b}`}_renderTickMarksV2(t){if(!t?.show?.scale_tickmarks)return J``;const e=t.xpos??50,r=t.ypos??50,i=2*e,s=2*r,o=t.horseshoe_scale,a=o.color||"var(--primary-background-color)",n=o.ticksize||(o.max-o.min)/10,c=t.arc_degrees||260,l=o.min%n,d=o.min+(0===l?0:n-l),h=(d-o.min)/(o.max-o.min)*c,u=(o.max-d)/n,m=(c-h)/u;let p=Math.floor(u);Math.floor(p*n+d)<=o.max&&(p+=1);const f=o.width?o.width/2:3,g=Array.from({length:p},((e,r)=>{const o=h+(360-r*m-230)*Math.PI/180;return J`
      <circle
        cx="${i-Math.sin(o)*t.tickmarksRadiusSize}"
        cy="${s-Math.cos(o)*t.tickmarksRadiusSize}"
        r="${f}"
        fill="${a}">
      </circle>
    `}));return J`${g}`}_renderSvg(){const t=this.config.card_filter?this.config.card_filter:"card--filter-none";return J`
        <svg xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
            class="${t}" 
          viewBox='0 0 200 200'>
            ${this._renderHorseShoes()}
            <g id="datagroup" class="datagroup">
              ${this._renderCircles()}
              ${this._renderHorizontalLines()}
              ${this._renderVerticalLines()}
              ${this._renderIcons()}
              ${this._renderEntityAreas()}
              ${this._renderEntityNames()}
              ${this._renderStates()}
            </g>
        </svg>
      `}_renderHorseShoes(){return J`
    ${this.horseshoes?.map(((t,e)=>this._renderHorseShoe(t,e)))??J``}
  `}_renderHorseShoe(t,e){if(!1===t.show?.horseshoe)return J``;const r=t.xpos??50,i=t.ypos??50,s=`${r}%`,o=`${i}%`,a=2*r,n=2*i,c=t.bar_mode||"normal",l=`${t.radius}%`,d=t.horseshoe_scale.color||"#000000",h=t.horseshoe_scale.width||6,u=t.horseshoe_state.width||12,m=-90-(t.arc_degrees??260)/2,p=`${t.horseshoePathLength},${t.circlePathLength}`,f=`horseshoe__gradient-${this.cardId}-${e}`,g={entity_index:t.entity_index},_=yt.getJsTemplateOrValue(g,t.horseshoe_scale?.styles),y=_t.toStyleDict(_),b={stroke:d,strokeWidth:h,strokeDasharray:p,strokeLinecap:"round"};void 0!==t.horseshoe_scale?.fill&&(b.fill=t.horseshoe_scale.fill);const v={fill:"none","stroke-linecap":"round",...y,...b},w=yt.getJsTemplateOrValue(g,t.horseshoe_state?.styles),$=_t.toStyleDict(w),x={stroke:`url('#${f}')`,strokeDasharray:t.dashArray,strokeDashoffset:t.dashOffset,strokeWidth:u};void 0!==t.horseshoe_state?.fill&&(x.fill=t.horseshoe_state.fill);const S={fill:"none",transition:"all 2.5s ease-out",strokeLinecap:"round",...$,...x};return"bidirectional"===c?t.bidirectional_negative?J`
        <g id="horseshoe__svg__group-${e}" class="horseshoe__svg__group">
          <circle id="horseshoe__scale-${e}" class="horseshoe__scale" cx="${s}" cy="${o}" r="${l}"
            style=${mt(v)}  
            transform="rotate(${m} ${a} ${n})"/>
          <circle id="horseshoe__state__value-${e}" class="horseshoe__state__value" cx="${s}" cy="${o}" r="${l}"
            transform="rotate(-90 ${a} ${n})"
            style=${mt(S)} />
          ${this._renderTickMarks(t)}
        </g>
      `:J`
      <g id="horseshoe__svg__group-${e}" class="horseshoe__svg__group">
        <circle id="horseshoe__scale-${e}" class="horseshoe__scale" cx="${s}" cy="${o}" r="${l}"
            style=${mt(v)}  
          transform="rotate(${m} ${a} ${n})"/>
        <circle id="horseshoe__state__value-${e}" class="horseshoe__state__value" cx="${s}" cy="${o}" r="${l}"
          transform="rotate(-90 ${a} ${n})"
            style=${mt(S)} />
        ${this._renderTickMarks(t)}
      </g>
    `:J`
    <g id="horseshoe__svg__group-${e}" class="horseshoe__svg__group">
      <circle id="horseshoe__scale-${e}" class="horseshoe__scale" cx="${s}" cy="${o}" r="${l}"
        style=${mt(v)}
        transform="rotate(${m} ${a} ${n})"/>
      <circle id="horseshoe__state__value-${e}" class="horseshoe__state__value" cx="${s}" cy="${o}" r="${l}"
        transform="rotate(${m} ${a} ${n})"
        style=${mt(S)} />
      ${this._renderTickMarks(t)}
    </g>
  `}_renderEntityNames(){const{layout:t}=this.config;if(!t?.names)return J``;const e={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"},r=t.names.map((t=>{const r=t.entity_index??0,i=yt.getJsTemplateOrValue(t,t.styles),s=_t.toStyleDict(i),o={...e,...s},a={...this.animations?.names?.[t.animation_id]??{}},n=this._getItemColorFromStops(t);n&&(a.stroke=n);const c={...o,...a},l=this.textEllipsis(this._buildName(this.entities[t.entity_index],this.resolvedEntityConfigs[t.entity_index]),t?.max_characters??t?.ellipsis);return J`
        <text
          @click=${t=>this.handlePopup(t,this.entities[r])}
          class="entity__name">
            <tspan
              class="entity__name"
              x="${t.xpos}%"
              y="${t.ypos}%"
              style=${mt(c)}>
              ${l}</tspan>
        </text>
      `}));return J`${r}`}_renderEntityAreas(){const{layout:t}=this.config;if(!t?.areas)return J``;const e={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"},r=t.areas.map((t=>{const r=t.entity_index??0,i=yt.getJsTemplateOrValue(t,t.styles),s=_t.toStyleDict(i),o={...e,...s},a={..._t.toStyleDict(this.animations?.areas?.[t.animation_id]??{})},n=this._getItemColorFromStops(t);n&&(a.stroke=n);const c={...o,...a},l=this.textEllipsis(this._buildArea(this.entities[t.entity_index],this.resolvedEntityConfigs[t.entity_index]),t?.max_characters??t?.ellipsis);return J`
        <text
          @click=${t=>this.handlePopup(t,this.entities[r])}
          class="entity__area">
            <tspan
              class="entity__area"
              x="${t.xpos}%"
              y="${t.ypos}%"
              style=${mt(c)}>
              ${l}</tspan>
        </text>
      `}));return J`${r}`}_renderState(t){if(!t)return J``;const e=t.entity_index??0,r=t.xpos?t.xpos:"",i=t.ypos?t.ypos:"",s=t.dx?t.dx:"0",o=t.dy?t.dy:"0",a=yt.getJsTemplateOrValue(t,t.styles),n=_t.toStyleDict(a),c=t.uom??{},l=yt.getJsTemplateOrValue(t,c.styles),d=_t.toStyleDict(l),h=c.dx??"0",u=c.dy??"-0.45";let m={};this.animations?.states?.[t.animation_id]&&(m={...this.animations.states[t.animation_id]});const p=this._getItemColorFromStops(t);p&&(m.fill=p);const f={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...n,...m},g=f["font-size"];let _=.5,y="em";const b=String(g).match(/\D+|\d*\.?\d+/g);2===b?.length?(_=.6*Number(b[0]),y=b[1]):console.error("Cannot determine font-size for state",g);const v={"font-size":`${_}${y}`},w={...f,opacity:"0.7",...v,...d},$=this.entities[e],x=this.resolvedEntityConfigs[e]??{},S=this._buildStateText($,x),k=this._buildUom($,x);return J`
      <text @click=${t=>this.handlePopup(t,this.entities[e])}>
        <tspan
          class="state__value"
          x="${r}%"
          y="${i}%"
          dx="${s}em"
          dy="${o}em"
          style=${mt(f)}
        >${S}</tspan><tspan
          class="state__uom"
          dx="${h}em"
          dy="${u}em"
          style=${mt(w)}
        >${k}</tspan>
      </text>
    `}formatStateString(t,e){const r=this._hass.selectedLanguage||this._hass.language;let i={};if(i.language=r,["relative","total","datetime","datetime-short","datetime-short_with-year","datetime_seconds","datetime-numeric","date","date_month","date_month_year","date-short","date-numeric","date_weekday","date_weekday_day","date_weekday-short","time","time-24h","time-24h_date-short","time_weekday","time_seconds"].includes(e.format)){const s=new Date(t);if(!(s instanceof Date)||isNaN(s.getTime()))return t;let o;switch(e.format){case"relative":const t=ft(s,new Date);o=new Intl.RelativeTimeFormat(r,{numeric:"auto"}).format(t.value,t.unit);break;case"total":case"precision":o="Not Yet Supported";break;case"datetime":o=((t,e)=>Yt(e).format(t))(s,i);break;case"datetime-short":o=((t,e)=>Zt(e).format(t))(s,i);break;case"datetime-short_with-year":o=((t,e)=>Xt(e).format(t))(s,i);break;case"datetime_seconds":o=((t,e)=>Qt(e).format(t))(s,i);break;case"datetime-numeric":o=((t,e)=>te(e).format(t))(s,i);break;case"date":o=((t,e)=>It(e).format(t))(s,i);break;case"date_month":o=((t,e)=>Ht(e).format(t))(s,i);break;case"date_month_year":o=((t,e)=>Vt(e).format(t))(s,i);break;case"date-short":o=Rt(s,i);break;case"date-numeric":o=((t,e)=>zt(e).format(t))(s,i);break;case"date_weekday":o=((t,e)=>jt(e).format(t))(s,i);break;case"date_weekday-short":o=((t,e)=>Ut(e).format(t))(s,i);break;case"date_weekday_day":o=((t,e)=>Dt(e).format(t))(s,i);break;case"time":o=((t,e)=>Bt(e).format(t))(s,i);break;case"time-24h":o=qt(s);break;case"time-24h_date-short":const e=ft(s,new Date);o=["second","minute","hour"].includes(e.unit)?qt(s):Rt(s,i);break;case"time_weekday":o=((t,e)=>Wt(e).format(t))(s,i);break;case"time_seconds":o=((t,e)=>Gt(e).format(t))(s,i)}return o}return isNaN(parseFloat(t))||!isFinite(t)?t:"brightness"===e.format||"brightness_pct"===e.format?`${Math.round(t/255*100)} %`:"duration"===e.format?ie(t,"s"):void 0}_buildStateText(t,e={}){if(!t)return"";const r=t.entity_id,i=this._hass.entities?.[r],s=this._hass.states?.[r],o=se(r);let a=e.attribute?t.attributes?.[e.attribute]:t.state;if(a=this._buildState(a,e),[void 0,"undefined"].includes(a))return"";void 0!==e.format&&void 0!==a&&(a=this.formatStateString(a,e));const n=e.locale_tag?`${e.locale_tag}${String(a).toLowerCase()}`:void 0;if(a&&isNaN(a)&&(!e.secondary_info||e.attribute)&&(a=n&&this._hass.localize(n)||i?.translation_key&&this._hass.localize(`component.${i.platform}.entity.${o}.${i.translation_key}.state.${a}`)||s?.attributes?.device_class&&this._hass.localize(`component.${o}.entity_component.${s.attributes.device_class}.state.${a}`)||this._hass.localize(`component.${o}.entity_component._.state.${a}`)||a,a=this.textEllipsis?.(a,this.config?.show?.ellipsis)??a),["undefined","unknown","unavailable","-ua-"].includes(a)&&(a=this._hass.localize(`state.default.${a}`)),!isNaN(a)){let t={};t=Ot(a,t),void 0!==e.decimals&&(t.maximumFractionDigits=e.decimals,t.minimumFractionDigits=t.maximumFractionDigits),a=Tt(a,this._hass.locale,t)}return a}_renderStates(){const{layout:t}=this.config;if(!t)return;if(!t.states)return;const e=t.states.map((t=>J`
            ${this._renderState(t)}
          `));return J`${e}`}computeEntityColor(t){if(!t||"off"===t.state||"unavailable"===t.state||"unknown"===t.state)return"var(--state-icon-color)";const e=t.state;if(!isNaN(e)||e.endsWith("W")||e.endsWith("kWh")||e.endsWith("V"))return"var(--state-icon-color)";const r=t.entity_id.split(".")[0],i=t.attributes.device_class;if("sensor"===r)return"var(--state-icon-color)";if("light"===r&&t.attributes.rgb_color&&"on"===e){const[e,r,i]=t.attributes.rgb_color;return`rgb(${e}, ${r}, ${i})`}return"binary_sensor"===r&&i&&"on"===e?`var(--state-binary_sensor-${i}-on-color, var(--state-icon-active-color))`:"climate"===r?`var(--state-climate-${e}-color, var(--state-icon-active-color))`:"on"===e?`var(--state-${r}-active-color, var(--state-${r}-color, var(--state-icon-active-color)))`:"var(--state-icon-color)"}_renderIcon(t,e){if(!t)return;t.entity=t.entity?t.entity:0,this.iconCache||={},this.iconsSvg||=[],this.pendingIconPath||=[];const r=12*(t.icon_size?t.icon_size:2),i=t.xpos?t.xpos/100:.5,s=t.ypos?t.ypos/100:.5,o=i*Me,a=s*Me,n=t.align?t.align:"center",c="center"===n?.5:"start"===n?-1:1;let l=o-r*c,d=a-r*c,h=r;const u=t.entity_index??0,m=this.entities[u],p=Oe.getHaEntityIconStyle(m),f={};f.fill=p.fill,f.color=p.color,f.filter=p.filter;const g=yt.getJsTemplateOrValue(t,t.styles);let _=_t.toStyleDict(g);const y=this.animations?.icons?.[t.animation_id]??{},b=this._getItemColorFromStops(t);b&&(_.fill=b),_={...f,..._,...y};const v=this._buildIcon(this.entities[u],this.resolvedEntityConfigs[u],this.animations?.iconsIcon?.[t.animation_id]);if(this.iconCache[v])this.iconsSvg[e]=this.iconCache[v];else if(this.iconsSvg[e]=void 0,this.pendingIconPath[e]!==v){this.pendingIconPath[e]=v;let t=0;const r=40,i=50,s=()=>{if(this.pendingIconPath[e]!==v)return;const o=this._getRenderedHaIconPath(e);if(o)return this.iconsSvg[e]=o,this.iconCache[v]=o,this.pendingIconPath[e]=void 0,void this.requestUpdate();t+=1,t>=r?this.pendingIconPath[e]=void 0:window.setTimeout(s,i)};(this?.updateComplete&&"function"==typeof this.updateComplete.then||this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((t=>window.requestAnimationFrame(t)))).then((()=>{window.setTimeout(s,0)}))}const w=this.iconsSvg[e];if(w){const i=o-r*c,s=a-.5*r-.25*r,n=r/24;return J`
      <g
        id="icon-rendered-${this.iconsId[e]}"
        style="${mt(_)}"
        x="${i}px"
        y="${s}px"
        transform-origin="${o} ${a}"
        @click=${e=>this.handlePopup(e,this.entities[t.entity_index])}
      >
        <rect
          x="${i}"
          y="${s}"
          height="${r}px"
          width="${r}px"
          stroke-width="0px"
          fill="rgba(0,0,0,0)"
        ></rect>

        <path
          d="${w}"
          transform="translate(${i},${s}) scale(${n})"
        ></path>
      </g>
    `}return J`
    <foreignObject
      width="0px"
      height="0px"
      x="${l}"
      y="${d}"
      overflow="hidden"
    >
      <body>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          class="div__icon hover"
          style="
            line-height: ${h}px;
            position: relative;
            border-style: solid;
            border-width: 0px;
            border-color: rgba(0,0,0,0);
            fill: rgba(0,0,0,0);
            color: rgba(0,0,0,0);
          "
        >
          <ha-icon
            .icon=${v}
            id="icon-${this.iconsId[e]}"
          ></ha-icon>
        </div>
      </body>
    </foreignObject>
  `}_getRenderedHaIconPath(t){const e=this.shadowRoot.getElementById(`icon-${this.iconsId[t]}`);return e?.shadowRoot?.querySelector("*")?.path}_scheduleIconPathRead(t,e){if(!t)return;if(this.iconCache[t])return void(this.iconsSvg[e]=this.iconCache[t]);if(this.pendingIconPath[e]===t)return;this.pendingIconPath[e]=t;let r=0;const i=()=>{if(this.pendingIconPath[e]!==t)return;if(this.iconCache[t])return this.iconsSvg[e]=this.iconCache[t],this.pendingIconPath[e]=void 0,void this.requestUpdate();const s=this._getRenderedHaIconPath();if(s)return this.iconsSvg[e]=s,this.iconCache[t]=s,this.pendingIconPath[e]=void 0,void this.requestUpdate();r+=1,r>=40?this.pendingIconPath[e]=void 0:this._iconPathTimer=window.setTimeout(i,50)};(this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((t=>{window.requestAnimationFrame(t)}))).then((()=>{this._iconPathTimer=window.setTimeout(i,0)}))}_renderIcons(){const{layout:t}=this.config;if(!t)return;if(!t.icons)return;const e=t.icons.map(((t,e)=>J`
            ${this._renderIcon(t,e)}
          `));return J`${e}`}_renderHorizontalLines(){const{layout:t}=this.config;if(!t?.hlines)return J``;const e={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2"},r=t.hlines.map((t=>{const r=t.entity_index??0,i=yt.getJsTemplateOrValue(t,t.styles),s=_t.toStyleDict(i),o={...e,...s},a={..._t.toStyleDict(this.animations?.hlines?.[t.animation_id]??{})},n=this._getItemColorFromStops(t);n&&(a.stroke=n);const c={...o,...a};return J`
      <line
        @click=${t=>this.handlePopup(t,this.entities[r])}
        class="line__horizontal"
        x1="${t.xpos-t.length/2}%"
        y1="${t.ypos}%"
        x2="${t.xpos+t.length/2}%"
        y2="${t.ypos}%" 
        style=${mt(c)}
      ></line>
    `}));return J`${r}`}_renderVerticalLines(){const{layout:t}=this.config;if(!t?.vlines)return J``;const e={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2"},r=t.vlines.map((t=>{const r=t.entity_index??0,i=yt.getJsTemplateOrValue(t,t.styles),s=_t.toStyleDict(i),o={...e,...s},a={..._t.toStyleDict(this.animations?.vlines?.[t.animation_id]??{})},n=this._getItemColorFromStops(t);n&&(a.stroke=n);const c={...o,...a};return J`
      <line
        @click=${t=>this.handlePopup(t,this.entities[r])}
        class="line__vertical"
        x1="${t.xpos}%"
        y1="${t.ypos-t.length/2}%"
        x2="${t.xpos}%"
        y2="${t.ypos+t.length/2}%"
        style=${mt(c)}
      ></line>
    `}));return J`${r}`}_renderCircles(){const{layout:t}=this.config;if(!t?.circles)return J``;const e={},r=t.circles.map((t=>{const r=t.entity_index??0,i=yt.getJsTemplateOrValue(t,t.styles),s=_t.toStyleDict(i),o={...e,...s},a={..._t.toStyleDict(this.animations?.circles?.[t.animation_id]??{})},n=this._getItemColorFromStops(t);n&&(a.stroke=n);const c={...o,...a};return J`
      <circle
        @click=${t=>this.handlePopup(t,this.entities[r])}
        class="svg__dot"
        cx="${t.xpos}%"
        cy="${t.ypos}%"
        r="${t.radius}"
        style=${mt(c)}
      ></circle>
    `}));return J`${r}`}_handleClick(t,e,r,i,s){let o;switch(i.action){case"more-info":o=new Event("hass-more-info",{composed:!0}),o.detail={entityId:s},t.dispatchEvent(o);break;case"navigate":if(!i.navigation_path)return;window.history.pushState(null,"",i.navigation_path),o=new Event("location-changed",{composed:!0}),o.detail={replace:!1},window.dispatchEvent(o);break;case"call-service":{if(!i.service)return;const[t,r]=i.service.split(".",2),s={...i.service_data};e.callService(t,r,s)}}}handlePopup(t,e){t.stopPropagation();const r=this.resolvedEntityConfigs.find((t=>t.entity===e.entity_id)),i=r?.tap_action??this.config?.tap_action??{action:"more-info"};this._handleClick(this,this._hass,this.config,i,e.entity_id)}textEllipsis(t,e){return e&&e<t.length?t.slice(0,e-1).concat("..."):t}_buildArea(t,e){if(e.area)return e.area;if(!this._hass||!this._hass.areas)return"";const r=this._hass.entities&&this._hass.entities[e.entity];let i=r?r.area_id:null;if(!i&&r&&r.device_id&&this._hass.devices){const t=this._hass.devices[r.device_id];i=t?t.area_id:null}if(i){const t=this._hass.areas[i];return t?t.name:""}return"?"}_buildName(t,e){return e.name??t.attributes.friendly_name??t?.entity_id??"?"}_buildIcon(t,e,r){return r||e?.icon||t?.attributes?.icon||Et(t)}_buildUom(t,e){return e.unit||t.attributes.unit_of_measurement||""}_buildState(t,e){if(void 0===t)return t;if(null===t)return t;if(e.convert){let r,i,s=e.convert.match(/(^\w+)\((\d+)\)/);switch(null===s?r=e.convert:3===s.length&&(r=s[1],i=Number(s[2])),r){case"brightness_pct":t="undefined"===t?"undefined":`${Math.round(t/255*100)}`;break;case"multiply":t=`${Math.round(t*i)}`;break;case"divide":t=`${Math.round(t/i)}`;break;case"rgb_csv":case"rgb_hex":if(e.attribute){let i=this._hass.states[e.entity];switch(i.attributes.color_mode){case"unknown":case"onoff":case"brightness":case"white":break;case"color_temp":if(i.attributes.color_temp_kelvin){let e=pe(i.attributes.color_temp_kelvin);const s=ne(e);s[1]<.4&&(s[1]<.1?s[2]=225:s[1]=.4),e=ce(s),e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===r?`${e[0]},${e[1]},${e[2]}`:ae(e)}else t="rgb_csv"===r?"255,255,255":"#ffffff00";break;case"hs":{let e=le([i.attributes.hs_color[0],i.attributes.hs_color[1]/100]);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===r?`${e[0]},${e[1]},${e[2]}`:ae(e)}break;case"rgb":{const e=ne(this.stateObj.attributes.rgb_color);e[1]<.4&&(e[1]<.1?e[2]=225:e[1]=.4);const i=ce(e);t="rgb_csv"===r?i.toString():ae(i)}break;case"rgbw":{let e=(t=>{const[e,r,i,s]=t;return fe([e,r,i,s],[e+s,r+s,i+s])})(i.attributes.rgbw_color);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===r?`${e[0]},${e[1]},${e[2]}`:ae(e)}break;case"rgbww":{let e=_e(i.attributes.rgbww_color,i.attributes?.min_color_temp_kelvin,i.attributes?.max_color_temp_kelvin);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===r?`${e[0]},${e[1]},${e[2]}`:ae(e)}break;case"xy":if(i.attributes.hs_color){let e=le([i.attributes.hs_color[0],i.attributes.hs_color[1]/100]);const s=ne(e);s[1]<.4&&(s[1]<.1?s[2]=225:s[1]=.4),e=ce(s),e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===r?`${e[0]},${e[1]},${e[2]}`:ae(e)}else if(i.attributes.color){let e={};e.l=i.attributes.brightness,e.h=i.attributes.color.h||i.attributes.color.hue,e.s=i.attributes.color.s||i.attributes.color.saturation;let{r:s,g:o,b:a}=Oe.hslToRgb(e);if("rgb_csv"===r)t=`${s},${o},${a}`;else{t=`#${Oe.padZero(s.toString(16))}${Oe.padZero(o.toString(16))}${Oe.padZero(a.toString(16))}`}}else i.attributes.xy_color}}break;default:console.error(`Unknown converter [${r}] specified for entity [${e.entity}]!`)}}return void 0!==t?Number.isNaN(t)?t:t.toString():void 0}_calculateStrokeColor(t,e,r){const i=e?.colors??[];if(!i.length)return;const s=Number(t);if(!Number.isFinite(s))return i[0].color;if(s<=i[0].value)return i[0].color;const o=i[i.length-1];if(s>=o.value)return o.color;for(let a=0;a<i.length-1;a+=1){const t=i[a],e=i[a+1];if(s>=t.value&&s<e.value){if(!r)return t.color;const i=Oe.calculateValueBetween(t.value,e.value,s);return Oe.getGradientValue(t.color,e.color,i)}}return o.color}_computeEntity(t){return t.substr(t.indexOf(".")+1)}getCardSize(){return 4}}customElements.get("flex-horseshoe-card")||customElements.define("flex-horseshoe-card",Re);

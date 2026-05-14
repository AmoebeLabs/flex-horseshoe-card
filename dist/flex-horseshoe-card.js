/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let i=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=r.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&r.set(s,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const r=1===t.length?t[0]:e.reduce(((e,s,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[r+1]),t[0]);return new i(r,t,s)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new i("string"==typeof t?t:t+"",void 0,s))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:u}=Object,m=globalThis,p=m.trustedTypes,f=p?p.emptyScript:"",g=m.reactiveElementPolyfillSupport,_=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},b=(t,e)=>!n(t,e),w={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);void 0!==r&&l(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:i}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:r,set(e){const o=r?.call(this);i?.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const t=this._$Eu(e,s);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,r)=>{if(e)s.adoptedStyleSheets=r.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of r){const r=document.createElement("style"),i=t.litNonce;void 0!==i&&r.setAttribute("nonce",i),r.textContent=e.cssText,s.appendChild(r)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(void 0!==r&&!0===s.reflect){const i=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==i?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(t,e){const s=this.constructor,r=s._$Eh.get(t);if(void 0!==r&&this._$Em!==r){const t=s.getPropertyOptions(r),i="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=r;const o=i.fromAttribute(e,t.type);this[r]=o??this._$Ej?.get(r)??o,this._$Em=null}}requestUpdate(t,e,s,r=!1,i){if(void 0!==t){const o=this.constructor;if(!1===r&&(i=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??b)(i,e)||s.useDefault&&s.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:i},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==i||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===r&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,r=this[e];!0!==t||this._$AL.has(e)||void 0===r||this.C(e,void 0,s,r)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[_("elementProperties")]=new Map,$[_("finalized")]=new Map,g?.({ReactiveElement:$}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const v=globalThis,x=v.trustedTypes,S=x?x.createPolicy("flex-horseshoe-card-lit-html",{createHTML:t=>t}):void 0,k="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+A,E=`<${C}>`,M=document,O=()=>M.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,P="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,z=/>/g,V=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),F=/'/g,j=/"/g,H=/^(?:script|style|textarea|title)$/i,R=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),U=R(1),J=R(2),L=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),q=new WeakMap,G=M.createTreeWalker(M,129);function K(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const W=(t,e)=>{const s=t.length-1,r=[];let i,o=2===e?"<svg>":3===e?"<math>":"",a=D;for(let n=0;n<s;n++){const e=t[n];let s,l,c=-1,h=0;for(;h<e.length&&(a.lastIndex=h,l=a.exec(e),null!==l);)h=a.lastIndex,a===D?"!--"===l[1]?a=I:void 0!==l[1]?a=z:void 0!==l[2]?(H.test(l[2])&&(i=RegExp("</"+l[2],"g")),a=V):void 0!==l[3]&&(a=V):a===V?">"===l[0]?(a=i??D,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,s=l[1],a=void 0===l[3]?V:'"'===l[3]?j:F):a===j||a===F?a=V:a===I||a===z?a=D:(a=V,i=void 0);const d=a===V&&t[n+1].startsWith("/>")?" ":"";o+=a===D?e+E:c>=0?(r.push(s),e.slice(0,c)+k+e.slice(c)+A+d):e+A+(-2===c?n:d)}return[K(t,o+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),r]};class Z{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let i=0,o=0;const a=t.length-1,n=this.parts,[l,c]=W(t,e);if(this.el=Z.createElement(l,s),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(r=G.nextNode())&&n.length<a;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(k)){const e=c[o++],s=r.getAttribute(t).split(A),a=/([.?@])?(.*)/.exec(e);n.push({type:1,index:i,name:a[2],strings:s,ctor:"."===a[1]?et:"?"===a[1]?st:"@"===a[1]?rt:tt}),r.removeAttribute(t)}else t.startsWith(A)&&(n.push({type:6,index:i}),r.removeAttribute(t));if(H.test(r.tagName)){const t=r.textContent.split(A),e=t.length-1;if(e>0){r.textContent=x?x.emptyScript:"";for(let s=0;s<e;s++)r.append(t[s],O()),G.nextNode(),n.push({type:2,index:++i});r.append(t[e],O())}}}else if(8===r.nodeType)if(r.data===C)n.push({type:2,index:i});else{let t=-1;for(;-1!==(t=r.data.indexOf(A,t+1));)n.push({type:7,index:i}),t+=A.length-1}i++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}}function Y(t,e,s=t,r){if(e===L)return e;let i=void 0!==r?s._$Co?.[r]:s._$Cl;const o=T(e)?void 0:e._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),void 0===o?i=void 0:(i=new o(t),i._$AT(t,s,r)),void 0!==r?(s._$Co??=[])[r]=i:s._$Cl=i),void 0!==i&&(e=Y(t,i._$AS(t,e.values),i,r)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=(t?.creationScope??M).importNode(e,!0);G.currentNode=r;let i=G.nextNode(),o=0,a=0,n=s[0];for(;void 0!==n;){if(o===n.index){let e;2===n.type?e=new Q(i,i.nextSibling,this,t):1===n.type?e=new n.ctor(i,n.name,n.strings,this,t):6===n.type&&(e=new it(i,this,t)),this._$AV.push(e),n=s[++a]}o!==n?.index&&(i=G.nextNode(),o++)}return G.currentNode=M,r}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),T(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==L&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,r="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Z.createElement(K(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===r)this._$AH.p(e);else{const t=new X(r,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new Z(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const i of t)r===e.length?e.push(s=new Q(this.O(O()),this.O(O()),this,this.options)):s=e[r],s._$AI(i),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,i){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=i,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=B}_$AI(t,e=this,s,r){const i=this.strings;let o=!1;if(void 0===i)t=Y(this,t,e,0),o=!T(t)||t!==this._$AH&&t!==L,o&&(this._$AH=t);else{const r=t;let a,n;for(t=i[0],a=0;a<i.length-1;a++)n=Y(this,r[s+a],e,a),n===L&&(n=this._$AH[a]),o||=!T(n)||n!==this._$AH[a],n===B?t=B:t!==B&&(t+=(n??"")+i[a+1]),this._$AH[a]=n}o&&!r&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class st extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class rt extends tt{constructor(t,e,s,r,i){super(t,e,s,r,i),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??B)===L)return;const s=this._$AH,r=t===B&&s!==B||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==B&&(s===B||r);r&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const ot=v.litHtmlPolyfillSupport;ot?.(Z,Q),(v.litHtmlVersions??=[]).push("3.3.2");const at=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let nt=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const r=s?.renderBefore??e;let i=r._$litPart$;if(void 0===i){const t=s?.renderBefore??null;r._$litPart$=i=new Q(e.insertBefore(O(),t),t,void 0,s??{})}return i._$AI(t),i})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}};nt._$litElement$=!0,nt.finalized=!0,at.litElementHydrateSupport?.({LitElement:nt});const lt=at.litElementPolyfillSupport;lt?.({LitElement:nt}),(at.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ct=1;let ht=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dt="important",ut=" !"+dt,mt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends ht{constructor(t){if(super(t),t.type!==ct||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,s)=>{const r=t[s];return null==r?e:e+`${s=s.includes("-")?s:s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${r};`}),"")}update(t,[e]){const{style:s}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const r of this.ft)null==e[r]&&(this.ft.delete(r),r.includes("-")?s.removeProperty(r):s[r]=null);for(const r in e){const t=e[r];if(null!=t){this.ft.add(r);const e="string"==typeof t&&t.endsWith(ut);r.includes("-")||e?s.setProperty(r,e?t.slice(0,-11):t,e?dt:""):s[r]=t}}return L}});var pt=function(){return pt=Object.assign||function(t){for(var e,s=1,r=arguments.length;s<r;s++)for(var i in e=arguments[s])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t},pt.apply(this,arguments)};function ft(t,e,s){void 0===e&&(e=Date.now()),void 0===s&&(s={});var r=pt(pt({},gt),s||{}),i=(+t-+e)/1e3;if(Math.abs(i)<r.second)return{value:Math.round(i),unit:"second"};var o=i/60;if(Math.abs(o)<r.minute)return{value:Math.round(o),unit:"minute"};var a=i/3600;if(Math.abs(a)<r.hour)return{value:Math.round(a),unit:"hour"};var n=i/86400;if(Math.abs(n)<r.day)return{value:Math.round(n),unit:"day"};var l=new Date(t),c=new Date(e),h=l.getFullYear()-c.getFullYear();if(Math.round(Math.abs(h))>0)return{value:Math.round(h),unit:"year"};var d=12*h+l.getMonth()-c.getMonth();if(Math.round(Math.abs(d))>0)return{value:Math.round(d),unit:"month"};var u=i/604800;return{value:Math.round(u),unit:"week"}}var gt={second:45,minute:45,hour:22,day:5};class _t{static toStyleDict(t){return _t.toDict(t,{stringToDict:_t.cssStringToDict,mapValue:_t.toStyleValue})}static toClassDict(t){return _t.toDict(t,{stringToDict:_t.classStringToDict,mapValue:Boolean})}static toIconDict(t){return _t.toDict(t,{stringToDict:_t.stringToDefaultDict("default"),mapValue:String})}static toDict(t,e={}){const{stringToDict:s=_t.stringToDefaultDict("default"),mapValue:r=(t=>t),skipNull:i=!0,skipFalse:o=!0}=e,a=t=>null==t&&i||!1===t&&o?{}:Array.isArray(t)?t.reduce(((t,e)=>({...t,...a(e)})),{}):_t.isPlainObject(t)?Object.fromEntries(Object.entries(t).filter((([,t])=>(null!=t||!i)&&(!1!==t||!o))).map((([t,e])=>[t,r(e,t)]))):"string"==typeof t?s(t):{};return a(t)}static toStyleValue(t){return null==t?t:String(t).trim().replace(/;+$/,"")}static cssStringToDict(t){return String(t).split(";").map((t=>t.trim())).filter(Boolean).reduce(((t,e)=>{const s=e.indexOf(":");if(s<=0)return t;const r=e.slice(0,s).trim(),i=e.slice(s+1).trim();return r&&i?{...t,[r]:i}:t}),{})}static toColorStopDict(t){return _t.toDict(t,{stringToDict:_t.keyValueStringToDict,mapValue:String})}static keyValueStringToDict(t){const e=String(t).trim(),s=e.indexOf(":");if(s<=0)return{};const r=e.slice(0,s).trim(),i=e.slice(s+1).trim();return r&&i?{[r]:i}:{}}static classStringToDict(t){return String(t).trim().split(/\s+/).filter(Boolean).reduce(((t,e)=>({...t,[e]:!0})),{})}static stringToDefaultDict(t="default"){return e=>({[t]:String(e)})}static requireArray(t,e="value"){if(null==t)return[];if(!Array.isArray(t))throw new Error(`[config-helper] "${e}" must be an array.`);return t}static ensureArray(t){return null==t?[]:Array.isArray(t)?t:[t]}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}}class yt{static context={};static setContext(t={}){yt.context=t}static getJsTemplateOrValue(t,e,s={}){const{resolveKeys:r=!0}=s;if(null==e)return e;if(["number","boolean","bigint","symbol"].includes(typeof e))return e;if(Array.isArray(e))return e.map((e=>yt.getJsTemplateOrValue(t,e,s)));if(yt.isPlainObject(e))return Object.fromEntries(Object.entries(e).map((([e,i])=>{const o=r?yt.getJsTemplateOrValue(t,e,s):e,a=yt.getJsTemplateOrValue(t,i,s);return[String(o),a]})));if("string"!=typeof e)return e;const i=e.trim();if(yt.isJsTemplate(i)){const e=yt.evaluateJsTemplate(t,yt.extractJsTemplateCode(i));return yt.getJsTemplateOrValue(t,e,s)}return e}static getJsTemplateOrValueV1(t,e){if(null==e)return e;if(["number","boolean","bigint","symbol"].includes(typeof e))return e;if(Array.isArray(e))return e.map((e=>yt.getJsTemplateOrValue(t,e)));if(yt.isPlainObject(e))return Object.fromEntries(Object.entries(e).map((([e,s])=>[e,yt.getJsTemplateOrValue(t,s)])));if("string"!=typeof e)return e;const s=e.trim();if(yt.isJsTemplate(s)){const e=yt.extractJsTemplateCode(s),r=yt.evaluateJsTemplate(t,e);return yt.getJsTemplateOrValue(t,r)}return e}static isJsTemplate(t){return"string"==typeof t&&t.trim().startsWith("[[[")&&t.trim().endsWith("]]]")}static extractJsTemplateCode(t){return String(t).trim().slice(3,-3).trim()}static evaluateJsTemplate(t,e){const{hass:s,config:r,entities:i=[]}=yt.context,o=yt._getItemEntityIndex(t),a=yt._getTemplateState(t),n=i?.[o],l=s?.states,c=s?.user;r?.dev?.debug&&console.log("Evaluating JavaScript template with context:",{hass:s,config:r,entity:n,entities:i,states:l,state:a,item:t,user:c});try{return new Function("hass","config","entity","entities","states","state","item","user",`\n          "use strict";\n          ${e}\n        `)(s,r,n,i,l,a,t,c)}catch(h){return void(r?.dev?.debug&&console.error("[templates] JavaScript template error:",{error:h,item:t,javascript:e}))}}static _getTemplateState(t={}){const e=yt._getItemEntityIndex(t),s=yt.context.entities?.[e],r=yt.context.config?.entities?.[e]||{};if(!s)return;const i=r.attribute;return i&&s.attributes&&void 0!==s.attributes[i]?s.attributes[i]:s.state}static _getItemEntityIndex(t={}){const e=Number(t.entity_index);return Number.isFinite(e)?e:0}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}}class bt{static normalize(t){return t?Array.isArray(t)?{scales:{},colors:bt.normalizeColors(t)}:!bt.isPlainObject(t)||t.colors||t.scales?bt.isPlainObject(t)?{scales:bt.normalizeScales(t.scales),colors:bt.normalizeColors(t.colors)}:{scales:{},colors:[]}:{scales:{},colors:bt.normalizeColors(t)}:{scales:{},colors:[]}}static normalizeScales(t){return bt.isPlainObject(t)?Object.fromEntries(Object.entries(t).map((([t,e])=>[t,bt.isPlainObject(e)?{...e}:e]))):{}}static normalizeColors(t){return t?Array.isArray(t)?t.flatMap((t=>bt.normalizeColorArrayEntry(t))).filter(Boolean).sort(((t,e)=>t.value-e.value)):bt.isPlainObject(t)?Object.entries(t).map((([t,e])=>bt.normalizeColorPair(t,e))).filter(Boolean).sort(((t,e)=>t.value-e.value)):[]:[]}static normalizeColorArrayEntry(t){if(bt.isPlainObject(t)&&Object.prototype.hasOwnProperty.call(t,"value")&&Object.prototype.hasOwnProperty.call(t,"color")){const e=bt.normalizeColorEntry(t);return e?[e]:[]}return bt.isPlainObject(t)?Object.entries(t).map((([t,e])=>bt.normalizeColorPair(t,e))).filter(Boolean):[]}static normalizeColorPair(t,e){const s=Number(t);return Number.isFinite(s)?null==e?null:{value:s,color:String(e)}:null}static normalizeColorEntry(t){if(!bt.isPlainObject(t))return null;const e=Number(t.value);return Number.isFinite(e)?void 0===t.color||null===t.color?null:{...t,value:e,color:String(t.color)}:null}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}static _testColorStopsNormalizer(){const t={entity_index:0},e=[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}];[{name:"FHC dict",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC dict with quoted keys",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC list of dicts",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC list of dicts with quoted keys",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC dict with template values",raw:{0:"[[[\n          return 'red';\n        ]]]",10:"[[[\n          return 'green';\n        ]]]",20:"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template values",raw:[{0:"[[[\n            return 'red';\n          ]]]"},{10:"[[[\n            return 'green';\n          ]]]"},{20:"[[[\n            return 'blue';\n          ]]]"}]},{name:"FHC dict with template keys",raw:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}},{name:"FHC dict with template keys and values",raw:{"[[[ return 0; ]]]":"[[[\n          return 'red';\n        ]]]","[[[ return 10; ]]]":"[[[\n          return 'green';\n        ]]]","[[[ return 20; ]]]":"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template keys and values",raw:[{"[[[ return 0; ]]]":"[[[\n            return 'red';\n          ]]]"},{"[[[ return 10; ]]]":"[[[\n            return 'green';\n          ]]]"},{"[[[ return 20; ]]]":"[[[\n            return 'blue';\n          ]]]"}]},{name:"Whole FHC color_stops as template returning dict",raw:"[[[\n        return {\n          0: 'red',\n          10: 'green',\n          20: 'blue',\n        };\n      ]]]"},{name:"Whole FHC color_stops as template returning list",raw:"[[[\n        return [\n          { 0: 'red' },\n          { 10: 'green' },\n          { 20: 'blue' },\n        ];\n      ]]]"},{name:"SAK v1 colorstops.colors dict",raw:{colors:{0:"red",10:"green",20:"blue"}}},{name:"SAK v1 colorstops.colors dict with template keys",raw:{colors:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}}},{name:"SAK v1 colorstops.colors dict with template values",raw:{colors:{0:"[[[\n            return 'red';\n          ]]]",10:"[[[\n            return 'green';\n          ]]]",20:"[[[\n            return 'blue';\n          ]]]"}}},{name:"SAK v2 colors list",raw:{scales:{default:{min:0,max:20}},colors:[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}]}},{name:"SAK v2 colors list unsorted",raw:{scales:{default:{min:0,max:20}},colors:[{value:20,color:"blue",rank:2},{value:0,color:"red",rank:1},{value:10,color:"green",rank:1}]}},{name:"SAK v2 colors list with template values",raw:{scales:{default:{min:"[[[\n              return 0;\n            ]]]",max:"[[[\n              return 20;\n            ]]]"}},colors:[{value:"[[[\n              return 0;\n            ]]]",color:"[[[\n              return 'red';\n            ]]]"},{value:"[[[\n              return 10;\n            ]]]",color:"[[[\n              return 'green';\n            ]]]"},{value:"[[[\n              return 20;\n            ]]]",color:"[[[\n              return 'blue';\n            ]]]"}]}},{name:"SAK v2 whole colors list as template",raw:{scales:{default:{min:0,max:20}},colors:"[[[\n          return [\n            { value: 0, color: 'red' },\n            { value: 10, color: 'green' },\n            { value: 20, color: 'blue' },\n          ];\n        ]]]"}}].forEach((s=>{const r=yt.getJsTemplateOrValue(t,s.raw,{resolveKeys:!0}),i=bt.normalize(r),o=i.colors.map((t=>({value:t.value,color:t.color}))),a=JSON.stringify(o)===JSON.stringify(e);console.log(`[colorstops test] ${a?"PASS":"FAIL"} - ${s.name}`,{raw:s.raw,resolved:r,normalized:i,simpleColors:o,expectedColors:e})}))}}const wt="mdi:bookmark",$t={air_quality:"mdi:air-filter",alert:"mdi:alert",calendar:"mdi:calendar",climate:"mdi:thermostat",configurator:"mdi:cog",conversation:"mdi:microphone-message",counter:"mdi:counter",datetime:"mdi:calendar-clock",date:"mdi:calendar",demo:"mdi:home-assistant",google_assistant:"mdi:google-assistant",group:"mdi:google-circles-communities",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_button:"mdi:gesture-tap-button",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",number:"mdi:ray-vertex",persistent_notification:"mdi:bell",plant:"mdi:Flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:palette",schedule:"mdi:calendar-clock",script:"mdi:script-text",select:"mdi:format-list-bulleted",sensor:"mdi:eye",simple_alarm:"mdi:bell",siren:"mdi:bullhorn",stt:"mdi:microphone-message",text:"mdi:form-textbox",time:"mdi:clock",timer:"mdi:timer-outline",tts:"mdi:speaker-message",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",zone:"mdi:map-marker-radius"},vt={apparent_power:"mdi:flash",aqi:"mdi:air-filter",atmospheric_pressure:"mdi:thermometer-lines",carbon_dioxide:"mdi:molecule-co2",carbon_monoxide:"mdi:molecule-co",current:"mdi:current-ac",data_rate:"mdi:transmission-tower",data_size:"mdi:database",date:"mdi:calendar",distance:"mdi:arrow-left-right",duration:"mdi:progress-clock",energy:"mdi:lightning-bolt",frequency:"mdi:sine-wave",gas:"mdi:meter-gas",humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",irradiance:"mdi:sun-wireless",moisture:"mdi:water-percent",monetary:"mdi:cash",nitrogen_dioxide:"mdi:molecule",nitrogen_monoxide:"mdi:molecule",nitrous_oxide:"mdi:molecule",ozone:"mdi:molecule",pm1:"mdi:molecule",pm10:"mdi:molecule",pm25:"mdi:molecule",power:"mdi:flash",power_factor:"mdi:angle-acute",precipitation:"mdi:weather-rainy",precipitation_intensity:"mdi:weather-pouring",pressure:"mdi:gauge",reactive_power:"mdi:flash",signal_strength:"mdi:wifi",sound_pressure:"mdi:ear-hearing",speed:"mdi:speedometer",sulphur_dioxide:"mdi:molecule",temperature:"mdi:thermometer",timestamp:"mdi:clock",volatile_organic_compounds:"mdi:molecule",volatile_organic_compounds_parts:"mdi:molecule",voltage:"mdi:sine-wave",volume:"mdi:car-coolant-level",water:"mdi:water",weight:"mdi:weight",wind_speed:"mdi:weather-windy"},xt=t=>t.substr(0,t.indexOf(".")),St={10:"mdi:battery-10",20:"mdi:battery-20",30:"mdi:battery-30",40:"mdi:battery-40",50:"mdi:battery-50",60:"mdi:battery-60",70:"mdi:battery-70",80:"mdi:battery-80",90:"mdi:battery-90",100:"mdi:battery"},kt=(t,e)=>{const s=Number(t);if(isNaN(s))return"off"===t?"mdi:battery":"on"===t?"mdi:battery-alert":"mdi:battery-unknown";const r=10*Math.round(s/10);return s<=5?"mdi:battery-alert-variant-outline":St[r]},At=t=>{const e=t?.attributes.device_class;if(e&&e in vt)return vt[e];if("battery"===e)return t?((t,e)=>{const s=t.state;return kt(s)})(t):"mdi:battery";const s=t?.attributes.unit_of_measurement;return"°C"===s||"°F"===s?"mdi-thermometer":void 0},Ct=(t,e,s)=>{const r=e?.state;switch(t){case"alarm_control_panel":return(t=>{switch(t){case"armed_away":return"mdi:shield-lock";case"armed_vacation":return"mdi:shield-airplane";case"armed_home":return"mdi:shield-home";case"armed_night":return"mdi:shield-moon";case"armed_custom_bypass":return"mdi:security";case"pending":return"mdi:shield-outline";case"triggered":return"mdi:bell-ring";case"disarmed":return"mdi:shield-off";default:return"mdi:shield"}})(r);case"automation":return"off"===r?"mdi:robot-off":"mdi:robot";case"binary_sensor":return((t,e)=>{const s="off"===t;switch(e?.attributes.device_class){case"battery":return s?"mdi:battery":"mdi:battery-outline";case"battery_charging":return s?"mdi:battery":"mdi:battery-charging";case"carbon_monoxide":return s?"mdi:smoke-detector":"mdi:smoke-detector-alert";case"cold":return s?"mdi:thermometer":"mdi:Snowflake";case"connectivity":return s?"mdi:close-network-outline":"mdi:check-network-outline";case"door":return s?"mdi:door-closed":"mdi:door-open";case"garage_door":return s?"mdi:garage":"mdi:garage-open";case"power":case"plug":return s?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return s?"mdi:check-circle":"mdi:alert-circle";case"smoke":return s?"mdi:smoke-detector-variant":"mdi:smoke-detector-variant-alert";case"heat":return s?"mdi:thermometer":"mdi:fire";case"light":return s?"mdi:brightness-5":"mdi:brightness-7";case"lock":return s?"mdi:lock":"mdi:lock-open";case"moisture":return s?"mdi:water-off":"mdi:water";case"motion":return s?"mdi:motion-sensor-off":"mdi:motion-sensor";case"occupancy":return s?"mdi:home-outline":"mdi:Home";case"opening":return s?"mdi:square":"mdi:square-outline";case"presence":return s?"mdi:home-outline":"mdi:home";case"running":return s?"mdi:stop":"mdi:play";case"sound":return s?"mdi:music-note-off":"mdi:music-note";case"update":return s?"mdi:package":"mdi:package-up";case"vibration":return s?"mdi:crop-portrait":"mdi:vibrate";case"window":return s?"mdi:window-closed":"mdi:window-open";default:return s?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}})(r,e);case"button":switch(e?.attributes.device_class){case"restart":return"mdi:restart";case"update":return"mdi:package-up";default:return"mdi:gesture-tap-button"}case"camera":return"off"===r?"mdi:video-off":"mdi:video";case"cover":return((t,e)=>{const s="closed"!==t;switch(e?.attributes.device_class){case"garage":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdigarage";default:return"mdi:Garage-open"}case"gate":switch(t){case"opening":case"closing":return"mdi:gate-arrow-right";case"closed":return"mdi:gate";default:return"mdi:gate-open"}case"door":return s?"mdi:door-open":"mdi:door-closed";case"damper":return s?"mdi:circle":"mdi:circle-slice-8";case"shutter":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window-shutter";default:return"mdi:window-shutter-open"}case"curtain":switch(t){case"opening":return"mdi:arrow-split-vertical";case"closing":return"mdi:arrow-collapse-horizontal";case"closed":return"mdi:curtains-closed";default:return"mdi:curtains"}case"blind":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:blinds-horizontal-closed";default:return"mdi:blinds-horizontal"}case"shade":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:roller-shade-closed";default:return"mdi:roller-shade"}case"window":switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}}switch(t){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}})(r,e);case"device_tracker":return"router"===e?.attributes.source_type?"home"===r?"mdi:lan-connect":"mdi:lan-cisconnect":["bluetooth","bluetooth_le"].includes(e?.attributes.source_type)?"home"===r?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===r?"mdi:account-arrow-right":"mdi:account";case"fan":return"off"===r?"mdi:fan-off":"mdi:fan";case"humidifier":return"off"===r?"mdi:air-humidifier-off":"mdi:air-humidifier";case"input_boolean":return"on"===r?"mdi:check-circle-outline":"mdi:close-circle-outline";case"input_datetime":if(!e?.attributes.has_date)return"mdi:clock";if(!e.attributes.has_time)return"mdi:calendar";break;case"lock":switch(r){case"unlocked":return"mdi:lock-open";case"jammed":return"mdi:lock-alert";case"locking":case"unlocking":return"mdi:lock-clock";default:return"mdi:lock"}case"media_player":switch(e?.attributes.device_class){case"speaker":switch(r){case"playing":return"mdi:speaker-play";case"paused":return"mdi:speaker-pause";case"off":return"mdi:speaker-off";default:return"mdi:speaker"}case"tv":switch(r){case"playing":return"mdi:television-play";case"paused":return"mdi:television-pause";case"off":return"mdi:television-off";default:return"mdi:television"}case"receiver":return"off"===r?"mdi:audio-video-off":"mdi:audio-video";default:switch(r){case"playing":case"paused":return"mdi:cast-connected";case"off":return"mdi:cast-off";default:return"mdi:cast"}}case"number":{const t=(t=>{const e=t?.attributes.device_class;if(e&&e in vt)return vt[e]})(e);if(t)return t;break}case"person":return"not_home"===r?"mdi:account-arrow-right":"mdi:account";case"switch":switch(e?.attributes.device_class){case"outlet":return"on"===r?"mdi:power-plug":"mdi:power-plug-off";case"switch":return"on"===r?"mdi:toggle-switch-variant":"mdi:toggle-switch-variant-off";default:return"mdi:toggle-switch-variant"}case"sensor":{const t=At(e);if(t)return t;break}case"sun":return"above_horizon"===e?.state?"mdi:white-balance-sunny":"mdi:weather-night";case"switch_as_x":return"mdi:swap-horizontal";case"threshold":return"mdi:chart-sankey";case"water_heater":return"off"===r?"mdi:water-boiler-off":"mdi:water-boiler"}if(t in $t)return $t[t]},Et=t=>{return t?(e=xt(t.entity_id),Ct(e,t)||(console.warn(`Unable to find icon for domain ${e}`),wt)):wt;var e};var Mt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(Mt=Mt||(Mt={}));const Ot=(t,e,s)=>{const r=e?(t=>{switch(t.number_format){case Mt.comma_decimal:return["en-US","en"];case Mt.decimal_comma:return["de","es","it"];case Mt.space_comma:return["fr","sv","cs"];case Mt.system:return;default:return t.language}})(e):void 0;if(Number.isNaN=Number.isNaN||function t(e){return"number"==typeof e&&t(e)},e?.number_format!==Mt.none&&!Number.isNaN(Number(t))&&Intl)try{return new Intl.NumberFormat(r,Tt(t,s)).format(Number(t))}catch(i){return console.error(i),new Intl.NumberFormat(void 0,Tt(t,s)).format(Number(t))}return!Number.isNaN(Number(t))&&""!==t&&e?.number_format===Mt.none&&Intl?new Intl.NumberFormat("en-US",Tt(t,{...s,useGrouping:!1})).format(Number(t)):"string"==typeof t?t:`${((t,e=2)=>Math.round(t*10**e)/10**e)(t,s?.maximumFractionDigits).toString()}${"currency"===s?.style?` ${s.currency}`:""}`},Tt=(t,e)=>{const s={maximumFractionDigits:2,...e};if("string"!=typeof t)return s;if(!e||void 0===e.minimumFractionDigits&&void 0===e.maximumFractionDigits){const e=t.indexOf(".")>-1?t.split(".")[1].length:0;s.minimumFractionDigits=e,s.maximumFractionDigits=e}return s};var Nt=Number.isNaN||function(t){return"number"==typeof t&&t!=t};function Pt(t,e){if(t.length!==e.length)return!1;for(var s=0;s<t.length;s++)if(r=t[s],i=e[s],!(r===i||Nt(r)&&Nt(i)))return!1;var r,i;return!0}function Dt(t,e){void 0===e&&(e=Pt);var s=null;function r(){for(var r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];if(s&&s.lastThis===this&&e(r,s.lastArgs))return s.lastResult;var o=t.apply(this,r);return s={lastResult:o,lastArgs:r,lastThis:this},o}return r.clear=function(){s=null},r}const It=Dt((t=>new Intl.DateTimeFormat(t.language,{weekday:"long",month:"long",day:"numeric"}))),zt=Dt((t=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric"}))),Vt=Dt((t=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"numeric",day:"numeric"}))),Ft=(t,e)=>jt(e).format(t),jt=Dt((t=>new Intl.DateTimeFormat(t.language,{day:"numeric",month:"short"}))),Ht=Dt((t=>new Intl.DateTimeFormat(t.language,{month:"long",year:"numeric"}))),Rt=Dt((t=>new Intl.DateTimeFormat(t.language,{month:"long"})));Dt((t=>new Intl.DateTimeFormat(t.language,{year:"numeric"})));const Ut=Dt((t=>new Intl.DateTimeFormat(t.language,{weekday:"long"}))),Jt=Dt((t=>new Intl.DateTimeFormat(t.language,{weekday:"short"})));var Lt;!function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(Lt=Lt||(Lt={}));const Bt=Dt((t=>{if(t.time_format===Lt.language||t.time_format===Lt.system){const e=t.time_format===Lt.language?t.language:void 0,s=(new Date).toLocaleString(e);return s.includes("AM")||s.includes("PM")}return t.time_format===Lt.am_pm})),qt=Dt((t=>new Intl.DateTimeFormat("en"!==t.language||Bt(t)?t.language:"en-u-hc-h23",{hour:"numeric",minute:"2-digit",hour12:Bt(t)}))),Gt=Dt((t=>new Intl.DateTimeFormat("en"!==t.language||Bt(t)?t.language:"en-u-hc-h23",{hour:Bt(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:Bt(t)}))),Kt=Dt((t=>new Intl.DateTimeFormat("en"!==t.language||Bt(t)?t.language:"en-u-hc-h23",{weekday:"long",hour:Bt(t)?"numeric":"2-digit",minute:"2-digit",hour12:Bt(t)}))),Wt=t=>Zt().format(t),Zt=Dt((()=>new Intl.DateTimeFormat("en-GB",{hour:"numeric",minute:"2-digit",hour12:!1}))),Yt=Dt((t=>new Intl.DateTimeFormat("en"!==t.language||Bt(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"long",day:"numeric",hour:Bt(t)?"numeric":"2-digit",minute:"2-digit",hour12:Bt(t)}))),Xt=Dt((t=>new Intl.DateTimeFormat("en"!==t.language||Bt(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"short",day:"numeric",hour:Bt(t)?"numeric":"2-digit",minute:"2-digit",hour12:Bt(t)}))),Qt=Dt((t=>new Intl.DateTimeFormat("en"!==t.language||Bt(t)?t.language:"en-u-hc-h23",{month:"short",day:"numeric",hour:Bt(t)?"numeric":"2-digit",minute:"2-digit",hour12:Bt(t)}))),te=Dt((t=>new Intl.DateTimeFormat("en"!==t.language||Bt(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"long",day:"numeric",hour:Bt(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:Bt(t)}))),ee=Dt((t=>new Intl.DateTimeFormat("en"!==t.language||Bt(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit",hour12:Bt(t)}))),se=(t,e=2)=>{let s=`${t}`;for(let r=1;r<e;r++)s=parseInt(s)<10**r?`0${s}`:s;return s};const re={ms:1,s:1e3,min:6e4,h:36e5,d:864e5},ie=(t,e)=>function(t){const e=Math.floor(t/1e3/3600),s=Math.floor(t/1e3%3600/60),r=Math.floor(t/1e3%3600%60),i=Math.floor(t%1e3);return e>0?`${e}:${se(s)}:${se(r)}`:s>0?`${s}:${se(r)}`:r>0||i>0?`${r}${i>0?`.${se(i,3)}`:""}`:null}(parseFloat(t)*re[e])||"0",oe=t=>{const e=Math.round(Math.min(Math.max(t,0),255)).toString(16);return 1===e.length?`0${e}`:e},ae=t=>`#${oe(t[0])}${oe(t[1])}${oe(t[2])}`,ne=t=>{const[e,s,r]=t,i=Math.max(e,s,r),o=i-Math.min(e,s,r),a=o&&(i===e?(s-r)/o:i===s?2+(r-e)/o:4+(e-s)/o);return[60*(a<0?a+6:a),i&&o/i,i]},le=t=>{const[e,s,r]=t,i=t=>{const i=(t+e/60)%6;return r-r*s*Math.max(Math.min(i,4-i,1),0)};return[i(5),i(3),i(1)]},ce=t=>le([t[0],t[1],255]),he=(t,e,s)=>Math.min(Math.max(t,e),s),de=t=>{if(t<=66)return 255;return he(329.698727446*(t-60)**-.1332047592,0,255)},ue=t=>{let e;return e=t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*(t-60)**-.0755148492,he(e,0,255)},me=t=>{if(t>=66)return 255;if(t<=19)return 0;const e=138.5177312231*Math.log(t-10)-305.0447927307;return he(e,0,255)},pe=t=>{const e=t/100;return[de(e),ue(e),me(e)]},fe=(t,e)=>{const s=Math.max(...t),r=Math.max(...e);let i;return i=0===r?0:s/r,e.map((t=>Math.round(t*i)))},ge=t=>Math.floor(1e6/t),_e=(t,e,s)=>{const[r,i,o,a,n]=t,l=ge(e??2700),c=ge(s??6500),h=l-c;let d;try{d=n/(a+n)}catch(b){d=.5}const u=c+d*h,m=u?(p=u,Math.floor(1e6/p)):0;var p;const[f,g,_]=pe(m),y=Math.max(a,n)/255;return fe([r,i,o,a,n],[r+f*y,i+g*y,o+_*y])};class ye{static{ye.colorCache={},ye.element=void 0}static _prefixKeys(t){let e={};return Object.keys(t).forEach((s=>{const r=`--${s}`,i=String(t[s]);e[r]=`${i}`})),e}static processTheme(t){let e={},s={},r={},i={};const{modes:o,...a}=t;return o&&(s={...a,...o.dark},e={...a,...o.light}),r=ye._prefixKeys(e),i=ye._prefixKeys(s),{themeLight:r,themeDark:i}}static processPalette(t){let e={},s={},r={},i={},o={};return Object.values(t).forEach((t=>{const{modes:i,...o}=t;e={...e,...o},i&&(r={...r,...o,...i.dark},s={...s,...o,...i.light})})),i=ye._prefixKeys(s),o=ye._prefixKeys(r),{paletteLight:i,paletteDark:o}}static setElement(t){ye.element=t}static calculateColor(t,e,s){const r=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let i,o,a;const n=r.length;if(t<=r[0])return e[r[0]];if(t>=r[n-1])return e[r[n-1]];for(let l=0;l<n-1;l++){const n=r[l],c=r[l+1];if(t>=n&&t<c){if([i,o]=[e[n],e[c]],!s)return i;a=ye.calculateValueBetween(n,c,t);break}}return ye.getGradientValue(i,o,a)}static calculateColor2(t,e,s,r,i){const o=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let a,n,l;const c=o.length;if(t<=o[0])return e[o[0]];if(t>=o[c-1])return e[o[c-1]];for(let h=0;h<c-1;h++){const c=o[h],d=o[h+1];if(t>=c&&t<d){if([a,n]=[e[c].styles[s][r],e[d].styles[s][r]],!i)return a;l=ye.calculateValueBetween(c,d,t);break}}return ye.getGradientValue(a,n,l)}static calculateValueBetween(t,e,s){return(Math.min(Math.max(s,t),e)-t)/(e-t)}static getColorVariable(t){const e=t.substr(4,t.length-5);return window.getComputedStyle(ye.element).getPropertyValue(e)}static getGradientValue(t,e,s){const r=ye.colorToRGBA(t),i=ye.colorToRGBA(e),o=1-s,a=s,n=Math.floor(r[0]*o+i[0]*a),l=Math.floor(r[1]*o+i[1]*a),c=Math.floor(r[2]*o+i[2]*a),h=Math.floor(r[3]*o+i[3]*a);return`#${ye.padZero(n.toString(16))}${ye.padZero(l.toString(16))}${ye.padZero(c.toString(16))}${ye.padZero(h.toString(16))}`}static padZero(t){return t.length<2&&(t=`0${t}`),t.substr(0,2)}static colorToRGBA(t){if(null==t)return[0,0,0,0];const e=ye.colorCache[t];if(e)return e;let s=t;"var"===t.substr(0,3).valueOf()&&(s=ye.getColorVariable(t));const r=window.document.createElement("canvas");r.width=r.height=1;const i=r.getContext("2d");i.clearRect(0,0,1,1),i.fillStyle=s,i.fillRect(0,0,1,1);const o=[...i.getImageData(0,0,1,1).data];return ye.colorCache[t]=o,o}static hslToRgb(t){const e=t.h/360,s=t.s/100,r=t.l/100;let i,o,a;if(0===s)i=o=a=r;else{function n(t,e,s){return s<0&&(s+=1),s>1&&(s-=1),s<1/6?t+6*(e-t)*s:s<.5?e:s<2/3?t+(e-t)*(2/3-s)*6:t}const l=r<.5?r*(1+s):r+s-r*s,c=2*r-l;i=n(c,l,e+1/3),o=n(c,l,e),a=n(c,l,e-1/3)}return i*=255,o*=255,a*=255,{r:i,g:o,b:a}}}console.info("%c FLEX-HORSESHOE-CARD %c Version 5.4.4-dev.3 ","color: white; font-weight: bold; background: darkgreen","color: darkgreen; font-weight: bold; background: white");const be=200,we=520/360*Math.PI*90,$e=2*Math.PI*90,ve={xpos:50,ypos:50,horseshoe_radius:90,tickmarks_radius:86},xe={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed"},Se={min:0,max:100,width:6,color:"var(--primary-background-color)"},ke={width:12,color:"var(--primary-color)"},Ae={action:"more-info"};class Ce extends nt{constructor(){if(super(),this.cardId=Math.random().toString(36).substr(2,9),this._hass=void 0,this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.viewBoxSize=be,this.colorStops={},this.animations={},this.animations.vlines={},this.animations.hlines={},this.animations.circles={},this.animations.icons={},this.animations.iconsIcon={},this.animations.names={},this.animations.areas={},this.animations.states={},this.resolvedEntityConfigs=[],this.colorCache={},this.isAndroid=!1,this.isSafari=!1,this.iOS=!1,this.iconCache={},this.iconsSvg=[],this.pendingIconPath=[],this.iconsId=[],this.bar_mode="normal",this.dev={debug:!1},this.isAndroid=!!window.navigator.userAgent.match(/Android/),!this.isAndroid){const t=window.navigator.userAgent||"",e=t.toLowerCase(),s=window.navigator.platform||"",r=(/iPad|iPhone|iPod/.test(t)||"MacIntel"===s&&window.navigator.maxTouchPoints>1)&&!window.MSStream,i=t.match(/Version\/(\d+)(?:\.[\d.]+)?.*Safari/i),o=i?Number(i[1]):void 0,a=e.match(/\bos\s+(\d+)(?:[._]\d+)*.*like safari/),n=e.match(/\bios\s+(\d+)(?:[._]\d+)*/),l=n?Number(n[1]):a?Number(a[1]):void 0,c=Number.isFinite(o),h=Number.isFinite(l)&&e.includes("like safari"),d=c?o:h?l:void 0;this.iOS=r,this.isSafari=Number.isFinite(d),this.safariMajorVersion=d,this.isHomeAssistantLikeSafari=h,this.isRealSafari=c,this.isSafari14=this.isSafari&&14===d,this.isSafari15=this.isSafari&&15===d,this.isSafari16=this.isSafari&&16===d,this.isSafari17=this.isSafari&&17===d,this.isSafari18=this.isSafari&&18===d,this.isSafari26=this.isSafari&&26===d,this.isSafari27=this.isSafari&&27===d,this.isSafari28=this.isSafari&&28===d,this.isSafari29=this.isSafari&&29===d,this.isSafari30=this.isSafari&&30===d,this.isSafariGte16=this.isSafari&&d>=16,this.dev?.debug&&console.log("browser detection",{ua:t,isAndroid:this.isAndroid,isIOS:this.iOS,isSafari:this.isSafari,isRealSafari:this.isRealSafari,isHomeAssistantLikeSafari:this.isHomeAssistantLikeSafari,safariMajorVersion:this.safariMajorVersion,isSafariGte16:this.isSafariGte16}),console.log("style test 1",_t.toStyleDict([{"font-size":"2.8em;"},{"text-anchor":"start;"},{opacity:"0.7;"}])),console.log("style test 2",_t.toStyleDict(["font-size: 2.8em;","text-anchor: start;","opacity: 0.7;"])),console.log("style test 3",_t.toStyleDict(["font-size: 2.8em","text-anchor: start","opacity: 0.7"])),console.log("style test 4",_t.toStyleDict({"font-size":"2.8em;","text-anchor":"start;",opacity:"0.7;"})),console.log("style test 5",_t.toStyleDict({"font-size":"2.8em","text-anchor":"start",opacity:.7})),console.log("style test 6",_t.toStyleDict("font-size: 2.8em; text-anchor: start; opacity: 0.7;")),console.log("style test 7",_t.toStyleDict(["[[[\n          return { 'font-size': '2.8em' };\n        ]]]","text-anchor: start;","opacity: 0.7;"]));const u=["[[[\n        return { 'font-size': '2.8em' };\n      ]]]","text-anchor: start;","opacity: 0.7;"],m={entity_index:0},p=yt.getJsTemplateOrValue(m,u),f=_t.toStyleDict(p);console.log("style test 8 - resolvedStyles",p),console.log("style test 8 - itemStyleDict",f),this.config?.dev?.debug&&bt._testColorStopsNormalizer(),this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config)}}static get styles(){return o`
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
    `}_resolveEntityConfigs(t){return t?.dev?.debug&&console.log("resolving entity config for",t?.entities),t?.entities?.map(((t,e)=>{const s={entity_index:e};return yt.getJsTemplateOrValue(s,t)}))??[]}set hass(t){this._hass=t,yt.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes});let e=!1;if(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.resolvedEntityConfigs.forEach(((s,r)=>{const i=t.states[s.entity];if(!i)return;this.entities[r]=i;const o=this._buildState(i.state,s);if(o!==this.entitiesStr[r]&&(this.entitiesStr[r]=o,e=!0),s.attribute&&Object.prototype.hasOwnProperty.call(i.attributes,s.attribute)){const t=this._buildState(i.attributes[s.attribute],s);t!==this.attributesStr[r]&&(this.attributesStr[r]=t,e=!0)}})),!e)return;this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.horseshoes=this.horseshoes.map((t=>{const e=t.entity_index??0,s=this.resolvedEntityConfigs[e],r=this.entities[e];if(!r||!s)return t;let i=r.state;s.attribute&&void 0!==r.attributes[s.attribute]&&(i=r.attributes[s.attribute]);const o=yt.getJsTemplateOrValue({entity_index:e},t.horseshoe_scale),a=o?.min??0,n=o?.max??100;let l,c,h=!1;if("bidirectional"===(t.bar_mode||"normal")){const e=t.horseshoePathLength,s=Number(i);if(s>=0){const r=Math.min(this._calculateValueBetween(0,n,s),1)*(e/2);l=`${r} ${t.circlePathLength-r}`,c=void 0,h=!1}else{const r=(1-Math.min(this._calculateValueBetween(a,0,s),1))*(e/2);l=`${r} ${t.circlePathLength-r}`,c=""+-(t.circlePathLength-r),h=!0}}else{l=`${Math.min(this._calculateValueBetween(a,n,i),1)*t.horseshoePathLength} ${10*t.radiusSize}`,c=void 0,h=!1}const d=Math.min(this._calculateValueBetween(a,n,i),1),u=t.show.horseshoe_style;let m=t.color0,p=t.color1,f=t.color1_offset,g=t.angleCoords,_=t.stroke_color;if("fixed"===u)_=t.horseshoe_state.color,m=t.horseshoe_state.color,p=t.horseshoe_state.color,f="0%";else if("autominmax"===u){const e=this._calculateStrokeColor(i,t.colorStopsMinMax,!0);m=e,p=e,f="0%"}else if("colorstop"===u||"colorstopgradient"===u){const e=this._calculateStrokeColor(i,t.colorStops,"colorstopgradient"===u);m=e,p=e,f="0%"}else"lineargradient"===u&&(g={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},f=`${Math.round(100*(1-d))}%`);return{...t,horseshoe_scale:{...t.horseshoe_scale,...o},dashArray:l,dashOffset:c,bidirectional_negative:h,stroke_color:_,color0:m,color1:p,color1_offset:f,angleCoords:g}}));const s=this.horseshoes[0];this.dashArray=s.dashArray,this.dashOffset=s.dashOffset,this._bidirectional_negative=s.bidirectional_negative,this.stroke_color=s.stroke_color,this.color0=s.color0,this.color1=s.color1,this.color1_offset=s.color1_offset,this.angleCoords=s.angleCoords,this.config.animations&&Object.keys(this.config.animations).map((t=>{const e=t.substr(Number(t.indexOf(".")+1));return this.config.animations[t].map((t=>this.entities[e].state.toLowerCase()===t.state.toLowerCase()&&(t.vlines&&t.vlines.forEach((t=>this._updateAnimationStyles("vlines",t))),t.hlines&&t.hlines.forEach((t=>this._updateAnimationStyles("hlines",t))),t.circles&&t.circles.forEach((t=>this._updateAnimationStyles("circles",t))),t.icons&&t.icons.forEach((t=>{const e=t.animation_id;this.animations.icons[e]&&t.reuse||(this.animations.icons[e]={},this.animations.iconsIcon[e]={});const s=yt.getJsTemplateOrValue(t,t.styles),r=_t.toStyleDict(s);this.animations.icons[e]={...this.animations.icons[e],...r},this.animations.iconsIcon[e]=yt.getJsTemplateOrValue(t,t.icon)})),t.states&&t.states.forEach((t=>this._updateAnimationStyles("states",t))),!0))),!0})),yt.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),this.requestUpdate()}set hassV1(t){this._hass=t,yt.setContext({hass:this._hass,config:this.config,entities:this.entities});var e,s,r,i=!1,o=0;for(e of(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.resolvedEntityConfigs)){const e=this.resolvedEntityConfigs[o],a=t.states[e.entity];a?(this.entities[o]=a,(s=this._buildState(a.state,e))!==this.entitiesStr[o]&&(this.entitiesStr[o]=s,i=!0),e.attribute&&Object.prototype.hasOwnProperty.call(a.attributes,e.attribute)&&(r=this._buildState(a.attributes[e.attribute],e))!==this.attributesStr[o]&&(this.attributesStr[o]=r,i=!0),o++):o++}if(!i)return;var a=this.entities[0].state;this.resolvedEntityConfigs[0].attribute&&this.entities[0].attributes[this.resolvedEntityConfigs[0].attribute]&&(a=this.entities[0].attributes[this.resolvedEntityConfigs[0].attribute]),this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config);const n=yt.getJsTemplateOrValue({entity_index:0},this.config.horseshoe_scale),l=n?.min??0,c=n?.max??100;if("bidirectional"===(this.config.bar_mode||"normal")){const t=we;let e=Number(a),s=0,r=0;e>=0?(s=Math.min(this._calculateValueBetween(0,c,e),1)*(t/2),this.dashArray=`${s} ${$e-s}`,this._bidirectional_negative=!1):(r=(1-Math.min(this._calculateValueBetween(l,0,e),1))*(t/2),this.dashArray=`${r} ${$e-r}`,this.dashOffset=-(""+($e-r)),this._bidirectional_negative=!0)}else{const t=Math.min(this._calculateValueBetween(l,c,a),1)*we,e=900;this.dashArray=`${t} ${e}`,this._bidirectional_negative=!1}const h=Math.min(this._calculateValueBetween(l,c,a),1),d=this.config.show.horseshoe_style;if("fixed"===d)this.stroke_color=this.config.horseshoe_state.color,this.color0=this.config.horseshoe_state.color,this.color1=this.config.horseshoe_state.color,this.color1_offset="0%";else if("autominmax"===d){const t=this._calculateStrokeColor(a,this.colorStopsMinMax,!0);this.color0=t,this.color1=t,this.color1_offset="0%"}else if("colorstop"===d||"colorstopgradient"===d){const t=this._calculateStrokeColor(a,this.colorStops,"colorstopgradient"===d);this.color0=t,this.color1=t,this.color1_offset="0%"}else if("lineargradient"===d){const t={x1:"0%",y1:"0%",x2:"100%",y2:"0%"};this.color1_offset=`${Math.round(100*(1-h))}%`,this.angleCoords=t}this.config.animations&&Object.keys(this.config.animations).map((t=>{const e=t.substr(Number(t.indexOf(".")+1));return this.config.animations[t].map((t=>{if(this.entities[e].state.toLowerCase()===t.state.toLowerCase())return t.vlines&&t.vlines.forEach((t=>this._updateAnimationStyles("vlines",t))),t.hlines&&t.hlines.forEach((t=>this._updateAnimationStyles("hlines",t))),t.circles&&t.circles.forEach((t=>this._updateAnimationStyles("circles",t))),t.icons&&t.icons.forEach((t=>{const e=t.animation_id;this.animations.icons[e]&&t.reuse||(this.animations.icons[e]={},this.animations.iconsIcon[e]={});const s=yt.getJsTemplateOrValue(t,t.styles),r=_t.toStyleDict(s);this.animations.icons[e]={...this.animations.icons[e],...r},this.animations.iconsIcon[e]=yt.getJsTemplateOrValue(t,t.icon)})),t.states&&t.states.forEach((t=>this._updateAnimationStyles("states",t))),!0})),!0})),this.requestUpdate()}_updateAnimationStyles(t,e){const s=e.animation_id;if(null==s)return;const r=yt.getJsTemplateOrValue(e,e.styles),i=_t.toStyleDict(r);this.animations[t][s]={...e.reuse?this.animations[t][s]??{}:{},...i}}_prepareItemColorStops(t){["states","names","areas","circles","hlines","vlines","icons"].forEach((e=>{const s=t.layout?.[e];Array.isArray(s)&&s.forEach((t=>{if(!t.color_stops)return;const e=yt.getJsTemplateOrValue(t,t.color_stops,{resolveKeys:!0});t._colorStops=bt.normalize(e)}))}))}setConfig(t){if(!(t=JSON.parse(JSON.stringify(t))).entities)throw Error("No entities defined");if(!t.layout)throw Error("No layout defined");const e=this._resolveEntityConfigs(t);if(e){if("sensor"!==this._computeDomain(e[0].entity)&&e[0].attribute&&!isNaN(e[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}e.forEach((t=>{t.tap_action||(t.tap_action={...Ae})}));const s={texts:[],card_filter:"card--filter-none",bar_mode:t.bar_mode||"normal",...t,show:{...xe,...t.show},horseshoe_position:{...ve,...t?.horseshoe_position},horseshoe_scale:{...Se,...t.horseshoe_scale},horseshoe_state:{...ke,...t.horseshoe_state}},r=Array.isArray(s.horseshoes)?s.horseshoes.map(((t,e)=>({...s,...t,entity_index:t.entity_index??e}))):[{...s,entity_index:0}];if(this.horseshoes=r.map(((t,e)=>{const s=t.entity_index??e,r={...xe,...t.show??{}},i={...Se,...t.horseshoe_scale??{}},o={...ke,...t.horseshoe_state??{}},a=t.xpos??t.horseshoe_position?.xpos??t.horseshoe_position?.cx??ve.xpos??ve.cx??50,n=t.ypos??t.horseshoe_position?.ypos??t.horseshoe_position?.cy??ve.ypos??ve.cy??50;if(!i.min&&0!==i.min||!i.max&&0!==i.max)throw Error(`No horseshoe min/max for scale defined for horseshoe ${e}`);const l=t.color_stops;if(!l)throw Error(`No color_stops defined for horseshoe ${e}`);const c=yt.getJsTemplateOrValue({entity_index:s},l,{resolveKeys:!0}),h=bt.normalize(c),d=h.colors;if(!d||d.length<2)throw Error(`No color_stops defined or not at least two colorstops for horseshoe ${e}`);const u=d[0],m=d[d.length-1];let p,f,g=bt.normalize({});u&&m&&(g=bt.normalize({[i.min]:u.color,[i.max]:m.color}),p=u.color,f=m.color);const _=t.radius??45,y=t.tickmarks_radius??43,b=t.arc_degrees??260,w=_/100*be,$=y/100*be,v=2*b/360*Math.PI*w,x=2*Math.PI*w;return{...t,entity_index:s,show:r,fill:t.fill??"rgba(0, 0, 0, 0)",xpos:a,ypos:n,bar_mode:t.bar_mode??"normal",horseshoe_scale:i,horseshoe_state:o,radius:_,tickmarks_radius:y,arc_degrees:b,radiusSize:w,tickmarksRadiusSize:$,horseshoePathLength:v,circlePathLength:x,color_stops:l,colorStops:h,colorStopsMinMax:g,color0:p,color1:f,angleCoords:{x1:"0%",y1:"0%",x2:"100%",y2:"0%"},color1_offset:"0%",dashArray:this.dashArray,dashOffset:this.dashOffset,bidirectional_negative:this._bidirectional_negative}})),!this.horseshoes.length)throw Error("No horseshoes defined");const i=this.horseshoes[0];this.colorStops=i.colorStops,this.colorStopsMinMax=i.colorStopsMinMax,this.color0=i.color0,this.color1=i.color1,this.angleCoords=i.angleCoords,this.color1_offset=i.color1_offset,this._prepareItemColorStops(s),this.config=s,this.bar_mode=s.bar_mode||"normal",this.config.layout?.icons&&this.config.layout.icons.forEach(((t,e)=>{this.iconsId[e]=Math.random().toString(36).substr(2,9)})),yt.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes})}setConfigV1(t){if(!(t=JSON.parse(JSON.stringify(t))).entities)throw Error("No entities defined");if(!t.layout)throw Error("No layout defined");if(!t.horseshoe_scale)throw Error("No horseshoe scale defined");if(!t.horseshoe_scale.min&&0===!t.horseshoe_scale.min||!t.horseshoe_scale.max)throw Error("No horseshoe min/max for scale defined");if(!t.color_stops||t.color_stops.length<2)throw Error("No color_stops defined or not at least two colorstops");const e=this._resolveEntityConfigs(t);if(e){if("sensor"!==this._computeDomain(e[0].entity)&&e[0].attribute&&!isNaN(e[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}const s={texts:[],card_filter:"card--filter-none",bar_mode:t.bar_mode||"normal",...t,show:{...xe,...t.show},horseshoe_position:{...ve,...t?.horseshoe_position},horseshoe_scale:{...Se,...t.horseshoe_scale},horseshoe_state:{...ke,...t.horseshoe_state}};for(var r of e)r.tap_action||(r.tap_action={...Ae});const i=yt.getJsTemplateOrValue({entity_index:0},s.color_stops,{resolveKeys:!0});this.colorStops=bt.normalize(i);const o=this.colorStops.colors,a=o[0],n=o[o.length-1];this.colorStopsMinMax=bt.normalize({}),a&&n&&(this.colorStopsMinMax=bt.normalize({[s.horseshoe_scale.min]:a.color,[s.horseshoe_scale.max]:n.color}),this.color0=a.color,this.color1=n.color);this.angleCoords={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},this.color1_offset="0%",this._prepareItemColorStops(s),this.config=s,this.bar_mode=s.bar_mode||"normal",this.config.layout?.icons&&this.config.layout.icons.forEach(((t,e)=>{this.iconsId[e]=Math.random().toString(36).substr(2,9)})),yt.setContext({hass:this._hass,config:this.config,entities:this.entities})}_getItemStateValue(t={}){const e=t.entity_index??0,s=this.entities?.[e],r=this.config?.entities?.[e];if(!s)return;const i=r?.attribute;return i&&s.attributes&&void 0!==s.attributes[i]?s.attributes[i]:s.state}_getItemColorFromStops(t={}){if(!t._colorStops)return;const e=this._getItemStateValue(t),s=Number(e);return Number.isFinite(s)?this._calculateStrokeColor(s,t._colorStops,!0===t.colorstop_gradient):void 0}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback()}render({config:t}=this){const e=yt.getJsTemplateOrValue({entity_index:0},t?.styles),s=_t.toStyleDict(e);return U`
      <ha-card @click=${t=>this.handlePopup(t,this.entities[0])} style=${mt(s)}>
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
                <stop offset="${t.color1_offset}" stop-color="${t.color1}"></stop>
                <stop offset="100%" stop-color="${t.color0}"></stop>
              </linearGradient>
            `))??""}
        </svg>
      </ha-card>
    `}renderV1({config:t}=this){const e=yt.getJsTemplateOrValue({entity_index:0},t?.styles),s=_t.toStyleDict(e);return U`
      <ha-card @click=${t=>this.handlePopup(t,this.entities[0])} style=${mt(s)}>
        <div class="container" id="container">${this._renderSvg()}</div>

        <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
          <linearGradient gradientTransform="rotate(0)" id="horseshoe__gradient-${this.cardId}" x1="${this.angleCoords.x1}" y1="${this.angleCoords.y1}" x2="${this.angleCoords.x2}" y2="${this.angleCoords.y2}">
            <stop offset="${this.color1_offset}" stop-color="${this.color1}"></stop>
            <stop offset="100%" stop-color="${this.color0}"></stop>
          </linearGradient>
        </svg>
      </ha-card>
    `}_renderTickMarks(t){if(!1===t.show?.scale_tickmarks)return J``;const e=t.horseshoe_scale,s=Number(e.min),r=Number(e.max),i=r-s;if(!i)return J``;const o={entity_index:t.entity_index},a=yt.getJsTemplateOrValue(o,t?.horseshoe_tickmarks?.styles),n=_t.toStyleDict(a),l=2*(t.xpos??50),c=2*(t.ypos??50),h={transformOrigin:`${l}px ${c}px`};void 0!==t?.horseshoe_tickmarks?.fill&&(h.fill=t.horseshoe_tickmarks.fill);const d=e.color||"var(--primary-background-color)";h.fill=d;const u={...n,...h},m=e.ticksize||i/10,p=t.arc_degrees||260,f=e.width?e.width/2:3,g=s%m,_=s+(0===g?0:m-g);if(_>r)return J``;const y=Math.floor((r-_)/m)+1,b=Array.from({length:y},((e,r)=>{const o=(p/2-(_+r*m-s)/i*p)*Math.PI/180;return J`
      <circle
        cx="${l-Math.sin(o)*t.tickmarksRadiusSize}"
        cy="${c-Math.cos(o)*t.tickmarksRadiusSize}"
        r="${f}"
        style=${mt(u)}>
      </circle>
    `}));return J`${b}`}_renderTickMarksV2(t){if(!t?.show?.scale_tickmarks)return J``;const e=t.xpos??50,s=t.ypos??50,r=2*e,i=2*s,o=t.horseshoe_scale,a=o.color||"var(--primary-background-color)",n=o.ticksize||(o.max-o.min)/10,l=t.arc_degrees||260,c=o.min%n,h=o.min+(0===c?0:n-c),d=(h-o.min)/(o.max-o.min)*l,u=(o.max-h)/n,m=(l-d)/u;let p=Math.floor(u);Math.floor(p*n+h)<=o.max&&(p+=1);const f=o.width?o.width/2:3,g=Array.from({length:p},((e,s)=>{const o=d+(360-s*m-230)*Math.PI/180;return J`
      <circle
        cx="${r-Math.sin(o)*t.tickmarksRadiusSize}"
        cy="${i-Math.cos(o)*t.tickmarksRadiusSize}"
        r="${f}"
        fill="${a}">
      </circle>
    `}));return J`${g}`}_renderTickMarksV1(){const{config:t}=this;if(!t)return;if(!t.show)return;if(!t.show.scale_tickmarks)return;const e=t.horseshoe_scale.color?t.horseshoe_scale.color:"var(--primary-background-color)",s=t.horseshoe_scale.ticksize?t.horseshoe_scale.ticksize:(t.horseshoe_scale.max-t.horseshoe_scale.min)/10,r=t.horseshoe_scale.min%s,i=t.horseshoe_scale.min+(0===r?0:s-r),o=(i-t.horseshoe_scale.min)/(t.horseshoe_scale.max-t.horseshoe_scale.min)*260;var a=(t.horseshoe_scale.max-i)/s,n=Math.floor(a);const l=(260-o)/a;Math.floor(n*s+i)<=t.horseshoe_scale.max&&n++;const c=t.horseshoe_scale.width?t.horseshoe_scale.width/2:3;var h,d,u=[];for(d=0;d<n;d++)h=o+(360-d*l-230)*Math.PI/180,u[d]=J`
          <circle cx="${100-86*Math.sin(h)}"
                  cy="${100-86*Math.cos(h)}" r="${c}"
                  fill="${e}">
        `;return J`${u}`}_renderSvg(){const t=this.config.card_filter?this.config.card_filter:"card--filter-none";return J`
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
  `}_renderHorseShoesV1(){return J`${this._renderHorseShoeV1()}`}_renderHorseShoe(t,e){if(!1===t.show?.horseshoe)return J``;const s=t.xpos??50,r=t.ypos??50,i=`${s}%`,o=`${r}%`,a=2*s,n=2*r,l=t.bar_mode||"normal",c=`${t.radius}%`,h=t.horseshoe_scale.color||"#000000",d=t.horseshoe_scale.width||6,u=t.horseshoe_state.width||12,m=-90-(t.arc_degrees??260)/2,p=`${t.horseshoePathLength},${t.circlePathLength}`,f=`horseshoe__gradient-${this.cardId}-${e}`,g={entity_index:t.entity_index},_=yt.getJsTemplateOrValue(g,t.horseshoe_scale?.styles),y=_t.toStyleDict(_),b={stroke:h,strokeWidth:d,strokeDasharray:p,strokeLinecap:"round"};void 0!==t.horseshoe_scale?.fill&&(b.fill=t.horseshoe_scale.fill);const w={fill:"none","stroke-linecap":"round",...y,...b},$=yt.getJsTemplateOrValue(g,t.horseshoe_state?.styles),v=_t.toStyleDict($),x={stroke:`url('#${f}')`,strokeDasharray:t.dashArray,strokeDashoffset:t.dashOffset,strokeWidth:u};void 0!==t.horseshoe_state?.fill&&(x.fill=t.horseshoe_state.fill);const S={fill:"none",transition:"all 2.5s ease-out",strokeLinecap:"round",...v,...x};return"bidirectional"===l?t.bidirectional_negative?J`
        <g id="horseshoe__svg__group-${e}" class="horseshoe__svg__group">
          <circle id="horseshoe__scale-${e}" class="horseshoe__scale" cx="${i}" cy="${o}" r="${c}"
            style=${mt(w)}  
            transform="rotate(${m} ${a} ${n})"/>
          <circle id="horseshoe__state__value-${e}" class="horseshoe__state__value" cx="${i}" cy="${o}" r="${c}"
            transform="rotate(-90 ${a} ${n})"
            style=${mt(S)} />
          ${this._renderTickMarks(t)}
        </g>
      `:J`
      <g id="horseshoe__svg__group-${e}" class="horseshoe__svg__group">
        <circle id="horseshoe__scale-${e}" class="horseshoe__scale" cx="${i}" cy="${o}" r="${c}"
            style=${mt(w)}  
          transform="rotate(${m} ${a} ${n})"/>
        <circle id="horseshoe__state__value-${e}" class="horseshoe__state__value" cx="${i}" cy="${o}" r="${c}"
          transform="rotate(-90 ${a} ${n})"
            style=${mt(S)} />
        ${this._renderTickMarks(t)}
      </g>
    `:J`
    <g id="horseshoe__svg__group-${e}" class="horseshoe__svg__group">
      <circle id="horseshoe__scale-${e}" class="horseshoe__scale" cx="${i}" cy="${o}" r="${c}"
        style=${mt(w)}
        transform="rotate(${m} ${a} ${n})"/>
      <circle id="horseshoe__state__value-${e}" class="horseshoe__state__value" cx="${i}" cy="${o}" r="${c}"
        transform="rotate(${m} ${a} ${n})"
        style=${mt(S)} />
      ${this._renderTickMarks(t)}
    </g>
  `}_renderHorseShoeV1(){if(!this.config.show.horseshoe)return;return"bidirectional"===(this.config.bar_mode||"normal")?this._bidirectional_negative?J`
          <g id="horseshoe__svg__group" class="horseshoe__svg__group">
            <circle id="horseshoe__scale" class="horseshoe__scale" cx="50%" cy="50%" r="45%"
              fill="${this.config.fill||"rgba(0, 0, 0, 0)"}"
              stroke="${this.config.horseshoe_scale.color||"#000000"}"
              stroke-dasharray="408.40704496667314,180"
              stroke-width="${this.config.horseshoe_scale.width||6}" 
              stroke-linecap="round"
              transform="rotate(-220 100 100)"/>
            <circle id="horseshoe__state__value" class="horseshoe__state__value" cx="50%" cy="50%" r="45%"
              fill="${this.config.fill||"rgba(0, 0, 0, 0)"}"
              stroke="url('#horseshoe__gradient-${this.cardId}')"
              stroke-dasharray="${this.dashArray}"
              stroke-dashoffset="${this.dashOffset}"
              stroke-width="${this.config.horseshoe_state.width||12}" 
              stroke-linecap="round"
              transform="rotate(-90 100 100)"
              style="transition: all 2.5s ease-out;"/>
            ${this._renderTickMarks()}
          </g>
        `:J`
          <g id="horseshoe__svg__group" class="horseshoe__svg__group">
            <circle id="horseshoe__scale" class="horseshoe__scale" cx="50%" cy="50%" r="45%"
              fill="${this.config.fill||"rgba(0, 0, 0, 0)"}"
              stroke="${this.config.horseshoe_scale.color||"#000000"}"
              stroke-dasharray="408.40704496667314,180"
              stroke-width="${this.config.horseshoe_scale.width||6}" 
              stroke-linecap="round"
              transform="rotate(-220 100 100)"/>
            <circle id="horseshoe__state__value" class="horseshoe__state__value" cx="50%" cy="50%" r="45%"
              fill="${this.config.fill||"rgba(0, 0, 0, 0)"}"
              stroke="url('#horseshoe__gradient-${this.cardId}')"
              stroke-dasharray="${this.dashArray}"
              stroke-width="${this.config.horseshoe_state.width||12}" 
              stroke-linecap="round"
              transform="rotate(-90 100 100)"
              style="transition: all 2.5s ease-out;"/>
            ${this._renderTickMarks()}
          </g>
        `:J`
      <g id="horseshoe__svg__group" class="horseshoe__svg__group">
        <circle id="horseshoe__scale" class="horseshoe__scale" cx="50%" cy="50%" r="45%"
          fill="${this.config.fill||"rgba(0, 0, 0, 0)"}"
          stroke="${this.config.horseshoe_scale.color||"#000000"}"
          stroke-dasharray="408.40704496667314,180"
          stroke-width="${this.config.horseshoe_scale.width||6}" 
          stroke-linecap="round"
          transform="rotate(-220 100 100)"/>
        <circle id="horseshoe__state__value" class="horseshoe__state__value" cx="50%" cy="50%" r="45%"
          fill="${this.config.fill||"rgba(0, 0, 0, 0)"}"
          stroke="url('#horseshoe__gradient-${this.cardId}')"
          stroke-dasharray="${this.dashArray}"
          stroke-width="${this.config.horseshoe_state.width||12}" 
          stroke-linecap="round"
          transform="rotate(-220 100 100)"
          style="transition: all 2.5s ease-out;"/>
        ${this._renderTickMarks()}
      </g>
    `}_renderEntityNames(){const{layout:t}=this.config;if(!t?.names)return J``;const e={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"},s=t.names.map((t=>{const s=t.entity_index??0,r=yt.getJsTemplateOrValue(t,t.styles),i=_t.toStyleDict(r),o={...e,...i},a={...this.animations?.names?.[t.animation_id]??{}},n=this._getItemColorFromStops(t);n&&(a.stroke=n);const l={...o,...a},c=this.textEllipsis(this._buildName(this.entities[t.entity_index],this.resolvedEntityConfigs[t.entity_index]),t?.max_characters??t?.ellipsis);return J`
        <text
          @click=${t=>this.handlePopup(t,this.entities[s])}
          class="entity__name">
            <tspan
              class="entity__name"
              x="${t.xpos}%"
              y="${t.ypos}%"
              style=${mt(l)}>
              ${c}</tspan>
        </text>
      `}));return J`${s}`}_renderEntityAreas(){const{layout:t}=this.config;if(!t?.areas)return J``;const e={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"},s=t.areas.map((t=>{const s=t.entity_index??0,r=yt.getJsTemplateOrValue(t,t.styles),i=_t.toStyleDict(r),o={...e,...i},a={..._t.toStyleDict(this.animations?.areas?.[t.animation_id]??{})},n=this._getItemColorFromStops(t);n&&(a.stroke=n);const l={...o,...a},c=this.textEllipsis(this._buildArea(this.entities[t.entity_index],this.resolvedEntityConfigs[t.entity_index]),t?.max_characters??t?.ellipsis);return J`
        <text
          @click=${t=>this.handlePopup(t,this.entities[s])}
          class="entity__area">
            <tspan
              class="entity__area"
              x="${t.xpos}%"
              y="${t.ypos}%"
              style=${mt(l)}>
              ${c}</tspan>
        </text>
      `}));return J`${s}`}_renderState(t){if(!t)return J``;const e=t.entity_index??0,s=t.xpos?t.xpos:"",r=t.ypos?t.ypos:"",i=t.dx?t.dx:"0",o=t.dy?t.dy:"0",a=yt.getJsTemplateOrValue(t,t.styles),n=_t.toStyleDict(a),l=t.uom??{},c=yt.getJsTemplateOrValue(t,l.styles),h=_t.toStyleDict(c),d=l.dx??"0",u=l.dy??"-0.45";let m={};this.animations?.states?.[t.animation_id]&&(m={...this.animations.states[t.animation_id]});const p=this._getItemColorFromStops(t);p&&(m.fill=p);const f={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...n,...m},g=f["font-size"];let _=.5,y="em";const b=String(g).match(/\D+|\d*\.?\d+/g);2===b?.length?(_=.6*Number(b[0]),y=b[1]):console.error("Cannot determine font-size for state",g);const w={"font-size":`${_}${y}`},$={...f,opacity:"0.7",...w,...h},v=this.entities[e],x=this.resolvedEntityConfigs[e]??{},S=this._buildStateText(v,x),k=this._buildUom(v,x);return J`
      <text @click=${t=>this.handlePopup(t,this.entities[e])}>
        <tspan
          class="state__value"
          x="${s}%"
          y="${r}%"
          dx="${i}em"
          dy="${o}em"
          style=${mt(f)}
        >${S}</tspan><tspan
          class="state__uom"
          dx="${d}em"
          dy="${u}em"
          style=${mt($)}
        >${k}</tspan>
      </text>
    `}formatStateString(t,e){const s=this._hass.selectedLanguage||this._hass.language;let r={};if(r.language=s,["relative","total","datetime","datetime-short","datetime-short_with-year","datetime_seconds","datetime-numeric","date","date_month","date_month_year","date-short","date-numeric","date_weekday","date_weekday_day","date_weekday-short","time","time-24h","time-24h_date-short","time_weekday","time_seconds"].includes(e.format)){const i=new Date(t);if(!(i instanceof Date)||isNaN(i.getTime()))return t;let o;switch(e.format){case"relative":const t=ft(i,new Date);o=new Intl.RelativeTimeFormat(s,{numeric:"auto"}).format(t.value,t.unit);break;case"total":case"precision":o="Not Yet Supported";break;case"datetime":o=((t,e)=>Yt(e).format(t))(i,r);break;case"datetime-short":o=((t,e)=>Qt(e).format(t))(i,r);break;case"datetime-short_with-year":o=((t,e)=>Xt(e).format(t))(i,r);break;case"datetime_seconds":o=((t,e)=>te(e).format(t))(i,r);break;case"datetime-numeric":o=((t,e)=>ee(e).format(t))(i,r);break;case"date":o=((t,e)=>zt(e).format(t))(i,r);break;case"date_month":o=((t,e)=>Rt(e).format(t))(i,r);break;case"date_month_year":o=((t,e)=>Ht(e).format(t))(i,r);break;case"date-short":o=Ft(i,r);break;case"date-numeric":o=((t,e)=>Vt(e).format(t))(i,r);break;case"date_weekday":o=((t,e)=>Ut(e).format(t))(i,r);break;case"date_weekday-short":o=((t,e)=>Jt(e).format(t))(i,r);break;case"date_weekday_day":o=((t,e)=>It(e).format(t))(i,r);break;case"time":o=((t,e)=>qt(e).format(t))(i,r);break;case"time-24h":o=Wt(i);break;case"time-24h_date-short":const e=ft(i,new Date);o=["second","minute","hour"].includes(e.unit)?Wt(i):Ft(i,r);break;case"time_weekday":o=((t,e)=>Kt(e).format(t))(i,r);break;case"time_seconds":o=((t,e)=>Gt(e).format(t))(i,r)}return o}return isNaN(parseFloat(t))||!isFinite(t)?t:"brightness"===e.format||"brightness_pct"===e.format?`${Math.round(t/255*100)} %`:"duration"===e.format?ie(t,"s"):void 0}_buildStateText(t,e={}){if(!t)return"";const s=t.entity_id,r=this._hass.entities?.[s],i=this._hass.states?.[s],o=xt(s);let a=e.attribute?t.attributes?.[e.attribute]:t.state;if(a=this._buildState(a,e),[void 0,"undefined"].includes(a))return"";void 0!==e.format&&void 0!==a&&(a=this.formatStateString(a,e));const n=e.locale_tag?`${e.locale_tag}${String(a).toLowerCase()}`:void 0;if(a&&isNaN(a)&&(!e.secondary_info||e.attribute)&&(a=n&&this._hass.localize(n)||r?.translation_key&&this._hass.localize(`component.${r.platform}.entity.${o}.${r.translation_key}.state.${a}`)||i?.attributes?.device_class&&this._hass.localize(`component.${o}.entity_component.${i.attributes.device_class}.state.${a}`)||this._hass.localize(`component.${o}.entity_component._.state.${a}`)||a,a=this.textEllipsis?.(a,this.config?.show?.ellipsis)??a),["undefined","unknown","unavailable","-ua-"].includes(a)&&(a=this._hass.localize(`state.default.${a}`)),!isNaN(a)){let t={};t=Tt(a,t),void 0!==e.decimals&&(t.maximumFractionDigits=e.decimals,t.minimumFractionDigits=t.maximumFractionDigits),a=Ot(a,this._hass.locale,t)}return a}_renderStates(){const{layout:t}=this.config;if(!t)return;if(!t.states)return;const e=t.states.map((t=>J`
            ${this._renderState(t)}
          `));return J`${e}`}_renderIcon(t,e){if(!t)return;t.entity=t.entity?t.entity:0,this.iconCache||={},this.iconsSvg||=[],this.pendingIconPath||=[];const s=12*(t.icon_size?t.icon_size:2),r=t.xpos?t.xpos/100:.5,i=t.ypos?t.ypos/100:.5,o=r*be,a=i*be,n=t.align?t.align:"center",l="center"===n?.5:"start"===n?-1:1;let c=o-s*l,h=a-s*l,d=s;const u=t.entity_index??0,m=yt.getJsTemplateOrValue(t,t.styles);let p=_t.toStyleDict(m);const f=this.animations?.icons?.[t.animation_id]??{},g=this._getItemColorFromStops(t);g&&(p.fill=g),p={...p,...f};const _=this._buildIcon(this.entities[u],this.resolvedEntityConfigs[u],this.animations?.iconsIcon?.[t.animation_id]);if(this.iconCache[_])this.iconsSvg[e]=this.iconCache[_];else if(this.iconsSvg[e]=void 0,this.pendingIconPath[e]!==_){this.pendingIconPath[e]=_;let t=0;const s=40,r=50,i=()=>{if(this.pendingIconPath[e]!==_)return;const o=this._getRenderedHaIconPath(e);if(o)return this.iconsSvg[e]=o,this.iconCache[_]=o,this.pendingIconPath[e]=void 0,void this.requestUpdate();t+=1,t>=s?this.pendingIconPath[e]=void 0:window.setTimeout(i,r)};(this._card?.updateComplete&&"function"==typeof this.updateComplete.then||this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((t=>window.requestAnimationFrame(t)))).then((()=>{window.setTimeout(i,0)}))}const y=this.iconsSvg[e];if(y){const r=o-s*l,i=a-.5*s-.25*s,n=s/24;return J`
      <g
        id="icon-rendered-${this.iconsId[e]}"
        style="${mt(p)}"
        x="${r}px"
        y="${i}px"
        transform-origin="${o} ${a}"
        @click=${e=>this.handlePopup(e,this.entities[t.entity_index])}
      >
        <rect
          x="${r}"
          y="${i}"
          height="${s}px"
          width="${s}px"
          stroke-width="0px"
          fill="rgba(0,0,0,0)"
        ></rect>

        <path
          d="${y}"
          transform="translate(${r},${i}) scale(${n})"
        ></path>
      </g>
    `}return J`
    <foreignObject
      width="0px"
      height="0px"
      x="${c}"
      y="${h}"
      overflow="hidden"
    >
      <body>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          class="div__icon hover"
          style="
            line-height: ${d}px;
            position: relative;
            border-style: solid;
            border-width: 0px;
            border-color: rgba(0,0,0,0);
            fill: rgba(0,0,0,0);
            color: rgba(0,0,0,0);
          "
        >
          <ha-icon
            .icon=${_}
            id="icon-${this.iconsId[e]}"
          ></ha-icon>
        </div>
      </body>
    </foreignObject>
  `}_getRenderedHaIconPath(t){const e=this.shadowRoot.getElementById(`icon-${this.iconsId[t]}`);return e?.shadowRoot?.querySelector("*")?.path}_scheduleIconPathRead(t,e){if(!t)return;if(this.iconCache[t])return void(this.iconsSvg[e]=this.iconCache[t]);if(this.pendingIconPath[e]===t)return;this.pendingIconPath[e]=t;let s=0;const r=()=>{if(this.pendingIconPath[e]!==t)return;if(this.iconCache[t])return this.iconsSvg[e]=this.iconCache[t],this.pendingIconPath[e]=void 0,void this.requestUpdate();const i=this._getRenderedHaIconPath();if(i)return this.iconsSvg[e]=i,this.iconCache[t]=i,this.pendingIconPath[e]=void 0,void this.requestUpdate();s+=1,s>=40?this.pendingIconPath[e]=void 0:this._iconPathTimer=window.setTimeout(r,50)};(this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((t=>{window.requestAnimationFrame(t)}))).then((()=>{this._iconPathTimer=window.setTimeout(r,0)}))}_renderIcons(){const{layout:t}=this.config;if(!t)return;if(!t.icons)return;const e=t.icons.map(((t,e)=>J`
            ${this._renderIcon(t,e)}
          `));return J`${e}`}_renderHorizontalLines(){const{layout:t}=this.config;if(!t?.hlines)return J``;const e={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2"},s=t.hlines.map((t=>{const s=t.entity_index??0,r=yt.getJsTemplateOrValue(t,t.styles),i=_t.toStyleDict(r),o={...e,...i},a={..._t.toStyleDict(this.animations?.hlines?.[t.animation_id]??{})},n=this._getItemColorFromStops(t);n&&(a.stroke=n);const l={...o,...a};return J`
      <line
        @click=${t=>this.handlePopup(t,this.entities[s])}
        class="line__horizontal"
        x1="${t.xpos-t.length/2}%"
        y1="${t.ypos}%"
        x2="${t.xpos+t.length/2}%"
        y2="${t.ypos}%" 
        style=${mt(l)}
      ></line>
    `}));return J`${s}`}_renderVerticalLines(){const{layout:t}=this.config;if(!t?.vlines)return J``;const e={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2"},s=t.vlines.map((t=>{const s=t.entity_index??0,r=yt.getJsTemplateOrValue(t,t.styles),i=_t.toStyleDict(r),o={...e,...i},a={..._t.toStyleDict(this.animations?.vlines?.[t.animation_id]??{})},n=this._getItemColorFromStops(t);n&&(a.stroke=n);const l={...o,...a};return J`
      <line
        @click=${t=>this.handlePopup(t,this.entities[s])}
        class="line__vertical"
        x1="${t.xpos}%"
        y1="${t.ypos-t.length/2}%"
        x2="${t.xpos}%"
        y2="${t.ypos+t.length/2}%"
        style=${mt(l)}
      ></line>
    `}));return J`${s}`}_renderCircles(){const{layout:t}=this.config;if(!t?.circles)return J``;const e={},s=t.circles.map((t=>{const s=t.entity_index??0,r=yt.getJsTemplateOrValue(t,t.styles),i=_t.toStyleDict(r),o={...e,...i},a={..._t.toStyleDict(this.animations?.circles?.[t.animation_id]??{})},n=this._getItemColorFromStops(t);n&&(a.stroke=n);const l={...o,...a};return J`
      <circle
        @click=${t=>this.handlePopup(t,this.entities[s])}
        class="svg__dot"
        cx="${t.xpos}%"
        cy="${t.ypos}%"
        r="${t.radius}"
        style=${mt(l)}
      ></circle>
    `}));return J`${s}`}_handleClick(t,e,s,r,i){let o;switch(r.action){case"more-info":o=new Event("hass-more-info",{composed:!0}),o.detail={entityId:i},t.dispatchEvent(o);break;case"navigate":if(!r.navigation_path)return;window.history.pushState(null,"",r.navigation_path),o=new Event("location-changed",{composed:!0}),o.detail={replace:!1},window.dispatchEvent(o);break;case"call-service":{if(!r.service)return;const[t,s]=r.service.split(".",2),i={...r.service_data};e.callService(t,s,i)}}}handlePopup(t,e){t.stopPropagation();const s=this.resolvedEntityConfigs.find((t=>t.entity===e.entity_id)),r=s?.tap_action??this.config?.tap_action??{action:"more-info"};this._handleClick(this,this._hass,this.config,r,e.entity_id)}handlePopupV1(t,e){t.stopPropagation(),this._handleClick(this,this._hass,this.config,this.resolvedEntityConfigs[this.resolvedEntityConfigs.findIndex(((t,s,r)=>t.entity===e.entity_id))].tap_action,e.entity_id)}textEllipsis(t,e){return e&&e<t.length?t.slice(0,e-1).concat("..."):t}_buildArea(t,e){return e.area||"?"}_buildName(t,e){return e.name??t.attributes.friendly_name??t?.entity_id??"?"}_buildIcon(t,e,s){return s||e?.icon||t?.attributes?.icon||Et(t)}_buildUom(t,e){return e.unit||t.attributes.unit_of_measurement||""}_buildStateV1(t,e){if(isNaN(t))return t;const s=Number(t);if(void 0===e.decimals||Number.isNaN(e.decimals)||Number.isNaN(s))return Math.round(100*s)/100;const r=10**e.decimals;return(Math.round(s*r)/r).toFixed(e.decimals)}_buildState(t,e){if(void 0===t)return t;if(null===t)return t;if(e.convert){let s,r,i=e.convert.match(/(^\w+)\((\d+)\)/);switch(null===i?s=e.convert:3===i.length&&(s=i[1],r=Number(i[2])),s){case"brightness_pct":t="undefined"===t?"undefined":`${Math.round(t/255*100)}`;break;case"multiply":t=`${Math.round(t*r)}`;break;case"divide":t=`${Math.round(t/r)}`,console.log("divide converter",{inState:t,parameter:r});break;case"rgb_csv":case"rgb_hex":if(e.attribute){let r=this._hass.states[e.entity];switch(r.attributes.color_mode){case"unknown":case"onoff":case"brightness":case"white":break;case"color_temp":if(r.attributes.color_temp_kelvin){let e=pe(r.attributes.color_temp_kelvin);const i=ne(e);i[1]<.4&&(i[1]<.1?i[2]=225:i[1]=.4),e=le(i),e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===s?`${e[0]},${e[1]},${e[2]}`:ae(e)}else t="rgb_csv"===s?"255,255,255":"#ffffff00";break;case"hs":{let e=ce([r.attributes.hs_color[0],r.attributes.hs_color[1]/100]);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===s?`${e[0]},${e[1]},${e[2]}`:ae(e)}break;case"rgb":{const e=ne(this.stateObj.attributes.rgb_color);e[1]<.4&&(e[1]<.1?e[2]=225:e[1]=.4);const r=le(e);t="rgb_csv"===s?r.toString():ae(r)}break;case"rgbw":{let e=(t=>{const[e,s,r,i]=t;return fe([e,s,r,i],[e+i,s+i,r+i])})(r.attributes.rgbw_color);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===s?`${e[0]},${e[1]},${e[2]}`:ae(e)}break;case"rgbww":{let e=_e(r.attributes.rgbww_color,r.attributes?.min_color_temp_kelvin,r.attributes?.max_color_temp_kelvin);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===s?`${e[0]},${e[1]},${e[2]}`:ae(e)}break;case"xy":if(r.attributes.hs_color){let e=ce([r.attributes.hs_color[0],r.attributes.hs_color[1]/100]);const i=ne(e);i[1]<.4&&(i[1]<.1?i[2]=225:i[1]=.4),e=le(i),e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===s?`${e[0]},${e[1]},${e[2]}`:ae(e)}else if(r.attributes.color){let e={};e.l=r.attributes.brightness,e.h=r.attributes.color.h||r.attributes.color.hue,e.s=r.attributes.color.s||r.attributes.color.saturation;let{r:i,g:o,b:a}=ye.hslToRgb(e);if("rgb_csv"===s)t=`${i},${o},${a}`;else{t=`#${ye.padZero(i.toString(16))}${ye.padZero(o.toString(16))}${ye.padZero(a.toString(16))}`}}else r.attributes.xy_color}}break;default:console.error(`Unknown converter [${s}] specified for entity [${e.entity}]!`)}}return void 0!==t?Number.isNaN(t)?t:t.toString():void 0}_computeState(t,e){if(isNaN(t))return t;const s=Number(t);if(void 0===e||Number.isNaN(e)||Number.isNaN(s))return Math.round(100*s)/100;const r=10**e;return(Math.round(s*r)/r).toFixed(e)}_calculateStrokeColor(t,e,s){const r=e?.colors??[];if(!r.length)return;const i=Number(t);if(!Number.isFinite(i))return r[0].color;if(i<=r[0].value)return r[0].color;const o=r[r.length-1];if(i>=o.value)return o.color;for(let a=0;a<r.length-1;a+=1){const t=r[a],e=r[a+1];if(i>=t.value&&i<e.value){if(!s)return t.color;const r=this._calculateValueBetween(t.value,e.value,i);return this._getGradientValue(t.color,e.color,r)}}return o.color}_calculateValueBetween(t,e,s){return(Math.min(Math.max(s,t),e)-t)/(e-t)}_getLovelacePanel(){var t=window.document.querySelector("home-assistant");return(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))||null}_getColorVariable(t){const e=t.substr(4,t.length-5);this.lovelace||(this.lovelace=this._getLovelacePanel());return window.getComputedStyle(this.lovelace).getPropertyValue(e)}_getGradientValue(t,e,s){const r=this._colorToRGBA(t),i=this._colorToRGBA(e),o=1-s,a=s,n=Math.floor(r[0]*o+i[0]*a),l=Math.floor(r[1]*o+i[1]*a),c=Math.floor(r[2]*o+i[2]*a),h=Math.floor(r[3]*o+i[3]*a);return`#${this._padZero(n.toString(16))}${this._padZero(l.toString(16))}${this._padZero(c.toString(16))}${this._padZero(h.toString(16))}`}_padZero(t){return t.length<2&&(t=`0${t}`),t.substr(0,2)}_computeDomain(t){return t.substr(0,t.indexOf("."))}_computeEntity(t){return t.substr(t.indexOf(".")+1)}_colorToRGBA(t){if(t in this.colorCache)return this.colorCache[t];var e=t;"var"===t.substr(0,3).valueOf()&&(e=this._getColorVariable(t));var s=window.document.createElement("canvas");s.width=s.height=1;var r=s.getContext("2d");r.clearRect(0,0,1,1),r.fillStyle=e,r.fillRect(0,0,1,1);const i=[...r.getImageData(0,0,1,1).data];return this.colorCache[t]=i,i}getCardSize(){return 4}}customElements.get("flex-horseshoe-card")||customElements.define("flex-horseshoe-card",Ce);

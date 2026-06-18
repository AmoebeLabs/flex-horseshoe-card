/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),i=new WeakMap;let s=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const r=this.t;if(t&&void 0===e){const t=void 0!==r&&1===r.length;t&&(e=i.get(r)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&i.set(r,e))}return e}toString(){return this.cssText}};const o=(e,...t)=>{const i=1===e.length?e[0]:t.reduce(((t,r,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[i+1]),e[0]);return new s(i,e,r)},a=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return(e=>new s("string"==typeof e?e:e+"",void 0,r))(t)})(e):e
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:d}=Object,m=globalThis,p=m.trustedTypes,g=p?p.emptyScript:"",f=m.reactiveElementPolyfillSupport,y=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},v=(e,t)=>!n(e,t),_={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(e,r,t);void 0!==i&&l(this.prototype,e,i)}}static getPropertyDescriptor(e,t,r){const{get:i,set:s}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const o=i?.call(this);s?.call(this,t),this.requestUpdate(e,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const e=d(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const e=this.properties,t=[...h(e),...u(e)];for(const r of t)this.createProperty(r,e[r])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,r]of t)this.elementProperties.set(e,r)}this._$Eh=new Map;for(const[t,r]of this.elementProperties){const e=this._$Eu(t,r);void 0!==e&&this._$Eh.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((r,i)=>{if(t)r.adoptedStyleSheets=i.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const t of i){const i=document.createElement("style"),s=e.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=t.cssText,r.appendChild(i)}})(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){const r=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,r);if(void 0!==i&&!0===r.reflect){const s=(void 0!==r.converter?.toAttribute?r.converter:b).toAttribute(t,r.type);this._$Em=e,null==s?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(e,t){const r=this.constructor,i=r._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=r.getPropertyOptions(i),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=i;const o=s.fromAttribute(t,e.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(e,t,r,i=!1,s){if(void 0!==e){const o=this.constructor;if(!1===i&&(s=this[e]),r??=o.getPropertyOptions(e),!((r.hasChanged??v)(s,t)||r.useDefault&&r.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,r))))return;this.C(e,t,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:i,wrapped:s},o){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==s||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,r]of e){const{wrapped:e}=r,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,r,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[y("elementProperties")]=new Map,w[y("finalized")]=new Map,f?.({ReactiveElement:w}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,$=x.trustedTypes,k=$?$.createPolicy("flex-horseshoe-card-lit-html",{createHTML:e=>e}):void 0,S="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,A="?"+M,C=`<${A}>`,E=document,N=()=>E.createComment(""),T=e=>null===e||"object"!=typeof e&&"function"!=typeof e,I=Array.isArray,z="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,j=/>/g,R=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,V=/"/g,G=/^(?:script|style|textarea|title)$/i,L=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),U=L(1),q=L(2),H=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),B=new WeakMap,W=E.createTreeWalker(E,129);function J(e,t){if(!I(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(t):t}const K=(e,t)=>{const r=e.length-1,i=[];let s,o=2===t?"<svg>":3===t?"<math>":"",a=P;for(let n=0;n<r;n++){const t=e[n];let r,l,c=-1,h=0;for(;h<t.length&&(a.lastIndex=h,l=a.exec(t),null!==l);)h=a.lastIndex,a===P?"!--"===l[1]?a=O:void 0!==l[1]?a=j:void 0!==l[2]?(G.test(l[2])&&(s=RegExp("</"+l[2],"g")),a=R):void 0!==l[3]&&(a=R):a===R?">"===l[0]?(a=s??P,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,r=l[1],a=void 0===l[3]?R:'"'===l[3]?V:D):a===V||a===D?a=R:a===O||a===j?a=P:(a=R,s=void 0);const u=a===R&&e[n+1].startsWith("/>")?" ":"";o+=a===P?t+C:c>=0?(i.push(r),t.slice(0,c)+S+t.slice(c)+M+u):t+M+(-2===c?n:u)}return[J(e,o+(e[r]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class X{constructor({strings:e,_$litType$:t},r){let i;this.parts=[];let s=0,o=0;const a=e.length-1,n=this.parts,[l,c]=K(e,t);if(this.el=X.createElement(l,r),W.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=W.nextNode())&&n.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(S)){const t=c[o++],r=i.getAttribute(e).split(M),a=/([.?@])?(.*)/.exec(t);n.push({type:1,index:s,name:a[2],strings:r,ctor:"."===a[1]?te:"?"===a[1]?re:"@"===a[1]?ie:ee}),i.removeAttribute(e)}else e.startsWith(M)&&(n.push({type:6,index:s}),i.removeAttribute(e));if(G.test(i.tagName)){const e=i.textContent.split(M),t=e.length-1;if(t>0){i.textContent=$?$.emptyScript:"";for(let r=0;r<t;r++)i.append(e[r],N()),W.nextNode(),n.push({type:2,index:++s});i.append(e[t],N())}}}else if(8===i.nodeType)if(i.data===A)n.push({type:2,index:s});else{let e=-1;for(;-1!==(e=i.data.indexOf(M,e+1));)n.push({type:7,index:s}),e+=M.length-1}s++}}static createElement(e,t){const r=E.createElement("template");return r.innerHTML=e,r}}function Y(e,t,r=e,i){if(t===H)return t;let s=void 0!==i?r._$Co?.[i]:r._$Cl;const o=T(t)?void 0:t._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),void 0===o?s=void 0:(s=new o(e),s._$AT(e,r,i)),void 0!==i?(r._$Co??=[])[i]=s:r._$Cl=s),void 0!==s&&(t=Y(e,s._$AS(e,t.values),s,i)),t}class Z{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,i=(e?.creationScope??E).importNode(t,!0);W.currentNode=i;let s=W.nextNode(),o=0,a=0,n=r[0];for(;void 0!==n;){if(o===n.index){let t;2===n.type?t=new Q(s,s.nextSibling,this,e):1===n.type?t=new n.ctor(s,n.name,n.strings,this,e):6===n.type&&(t=new se(s,this,e)),this._$AV.push(t),n=r[++a]}o!==n?.index&&(s=W.nextNode(),o++)}return W.currentNode=E,i}p(e){let t=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}let Q=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,i){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),T(e)?e===F||null==e||""===e?(this._$AH!==F&&this._$AR(),this._$AH=F):e!==this._$AH&&e!==H&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>I(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==F&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:r}=e,i="number"==typeof r?this._$AC(e):(void 0===r.el&&(r.el=X.createElement(J(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new Z(i,this),r=e.u(this.options);e.p(t),this.T(r),this._$AH=e}}_$AC(e){let t=B.get(e.strings);return void 0===t&&B.set(e.strings,t=new X(e)),t}k(t){I(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let i,s=0;for(const o of t)s===r.length?r.push(i=new e(this.O(N()),this.O(N()),this,this.options)):i=r[s],i._$AI(o),s++;s<r.length&&(this._$AR(i&&i._$AB.nextSibling,s),r.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}};class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,i,s){this.type=1,this._$AH=F,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=s,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=F}_$AI(e,t=this,r,i){const s=this.strings;let o=!1;if(void 0===s)e=Y(this,e,t,0),o=!T(e)||e!==this._$AH&&e!==H,o&&(this._$AH=e);else{const i=e;let a,n;for(e=s[0],a=0;a<s.length-1;a++)n=Y(this,i[r+a],t,a),n===H&&(n=this._$AH[a]),o||=!T(n)||n!==this._$AH[a],n===F?e=F:e!==F&&(e+=(n??"")+s[a+1]),this._$AH[a]=n}o&&!i&&this.j(e)}j(e){e===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===F?void 0:e}}class re extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==F)}}class ie extends ee{constructor(e,t,r,i,s){super(e,t,r,i,s),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??F)===H)return;const r=this._$AH,i=e===F&&r!==F||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,s=e!==F&&(r===F||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class se{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const oe=x.litHtmlPolyfillSupport;oe?.(X,Q),(x.litHtmlVersions??=[]).push("3.3.2");const ae=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ne=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,r)=>{const i=r?.renderBefore??t;let s=i._$litPart$;if(void 0===s){const e=r?.renderBefore??null;i._$litPart$=s=new Q(t.insertBefore(N(),e),e,void 0,r??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return H}};ne._$litElement$=!0,ne.finalized=!0,ae.litElementHydrateSupport?.({LitElement:ne});const le=ae.litElementPolyfillSupport;le?.({LitElement:ne}),(ae.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce=1;let he=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,r){this._$Ct=e,this._$AM=t,this._$Ci=r}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ue="important",de=" !"+ue,me=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends he{constructor(e){if(super(e),e.type!==ce||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce(((t,r)=>{const i=e[r];return null==i?t:t+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`}),"")}update(e,[t]){const{style:r}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const i of this.ft)null==t[i]&&(this.ft.delete(i),i.includes("-")?r.removeProperty(i):r[i]=null);for(const i in t){const e=t[i];if(null!=e){this.ft.add(i);const t="string"==typeof e&&e.endsWith(de);i.includes("-")||t?r.setProperty(i,t?e.slice(0,-11):e,t?ue:""):r[i]=e}}return H}});function pe(e,t,r){if(r||2===arguments.length)for(var i,s=0,o=t.length;s<o;s++)!i&&s in t||(i||(i=Array.prototype.slice.call(t,0,s)),i[s]=t[s]);return e.concat(i||Array.prototype.slice.call(t))}"function"==typeof SuppressedError&&SuppressedError;var ge,fe={};
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */var ye=function(){if(ge)return fe;ge=1;var e=/; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g,t=/^[\u000b\u0020-\u007e\u0080-\u00ff]+$/,r=/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/,i=/\\([\u000b\u0020-\u00ff])/g,s=/([\\"])/g,o=/^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;function a(e){var i=String(e);if(r.test(i))return i;if(i.length>0&&!t.test(i))throw new TypeError("invalid parameter value");return'"'+i.replace(s,"\\$1")+'"'}function n(e){this.parameters=Object.create(null),this.type=e}return fe.format=function(e){if(!e||"object"!=typeof e)throw new TypeError("argument obj is required");var t=e.parameters,i=e.type;if(!i||!o.test(i))throw new TypeError("invalid type");var s=i;if(t&&"object"==typeof t)for(var n,l=Object.keys(t).sort(),c=0;c<l.length;c++){if(n=l[c],!r.test(n))throw new TypeError("invalid parameter name");s+="; "+n+"="+a(t[n])}return s},fe.parse=function(t){if(!t)throw new TypeError("argument string is required");var r="object"==typeof t?function(e){var t;"function"==typeof e.getHeader?t=e.getHeader("content-type"):"object"==typeof e.headers&&(t=e.headers&&e.headers["content-type"]);if("string"!=typeof t)throw new TypeError("content-type header is missing from object");return t}(t):t;if("string"!=typeof r)throw new TypeError("argument string is required to be a string");var s=r.indexOf(";"),a=-1!==s?r.slice(0,s).trim():r.trim();if(!o.test(a))throw new TypeError("invalid media type");var l=new n(a.toLowerCase());if(-1!==s){var c,h,u;for(e.lastIndex=s;h=e.exec(r);){if(h.index!==s)throw new TypeError("invalid parameter format");s+=h[0].length,c=h[1].toLowerCase(),34===(u=h[2]).charCodeAt(0)&&-1!==(u=u.slice(1,-1)).indexOf("\\")&&(u=u.replace(i,"$1")),l.parameters[c]=u}if(s!==r.length)throw new TypeError("invalid parameter format")}return l},fe}(),be=new Map,ve=function(e){return e.cloneNode(!0)},_e=function(){return"file:"===window.location.protocol},we=function(e,t,r){var i=new XMLHttpRequest;i.onreadystatechange=function(){try{if(!/\.svg/i.test(e)&&2===i.readyState){var t=i.getResponseHeader("Content-Type");if(!t)throw new Error("Content type not found");var s=ye.parse(t).type;if("image/svg+xml"!==s&&"text/plain"!==s)throw new Error("Invalid content type: ".concat(s))}if(4===i.readyState){if(404===i.status||null===i.responseXML)throw new Error(_e()?"Note: SVG injection ajax calls do not work locally without adjusting security settings in your browser. Or consider using a local webserver.":"Unable to load SVG file: "+e);if(!(200===i.status||_e()&&0===i.status))throw new Error("There was a problem injecting the SVG: "+i.status+" "+i.statusText);r(null,i)}}catch(o){if(i.abort(),!(o instanceof Error))throw o;r(o,i)}},i.open("GET",e),i.withCredentials=t,i.overrideMimeType&&i.overrideMimeType("image/svg+xml"),i.send()},xe={},$e=function(e,t){var r;null!==(r=xe[e])&&void 0!==r||(xe[e]=[]),xe[e].push(t)},ke=function(e,t,r){if(be.has(e)){var i=be.get(e);if(void 0===i)return void $e(e,r);if(i instanceof SVGSVGElement)return void r(null,ve(i))}be.set(e,void 0),$e(e,r),we(e,t,(function(t,r){var i;t?be.set(e,t):(null===(i=r.responseXML)||void 0===i?void 0:i.documentElement)instanceof SVGSVGElement&&be.set(e,r.responseXML.documentElement),function(e){var t=xe[e];if(t)for(var r=function(r,i){setTimeout((function(){if(Array.isArray(xe[e])){var i=be.get(e),s=t[r];if(!s)return;i instanceof SVGSVGElement&&s(null,ve(i)),i instanceof Error&&s(i),r===t.length-1&&delete xe[e]}}),0)},i=0,s=t.length;i<s;i++)r(i)}(e)}))},Se=function(e,t,r){we(e,t,(function(e,t){var i;e?r(e):(null===(i=t.responseXML)||void 0===i?void 0:i.documentElement)instanceof SVGSVGElement&&r(null,t.responseXML.documentElement)}))},Me="data:image/svg+xml",Ae=0,Ce=[],Ee={},Ne="http://www.w3.org/1999/xlink",Te=function(e,t,r,i,s,o,a){var n,l=null!==(n=e.getAttribute("data-src"))&&void 0!==n?n:e.getAttribute("src");if(l){if(-1!==Ce.indexOf(e))return Ce.splice(Ce.indexOf(e),1),void(e=null);Ce.push(e),e.setAttribute("src","");var c=l.indexOf("#"),h=-1!==c?l.slice(0,c):l,u=-1!==c?l.slice(c+1):null,d=function(e){if(!e.startsWith(Me))return null;var t,r=e.slice(18);if(r.startsWith(";base64,"))try{t=atob(r.slice(8))}catch(n){return new Error("Invalid base64 in data URL")}else if(r.startsWith(","))try{t=decodeURIComponent(r.slice(1))}catch(o){return new Error("Invalid encoding in data URL")}else{if(!r.startsWith(";charset=utf-8,"))return new Error("Unsupported data URL format");try{t=decodeURIComponent(r.slice(15))}catch(a){return new Error("Invalid encoding in data URL")}}var i=(new DOMParser).parseFromString(t,"image/svg+xml"),s=i.querySelector("parsererror");return s?new Error("Data URL SVG parse error: "+s.textContent.trim()):i.documentElement instanceof SVGSVGElement?i.documentElement:new Error("Data URL did not contain a valid SVG element")}(h);if(d instanceof Error)return Ce.splice(Ce.indexOf(e),1),e=null,void a(d);var m=function(i,s){var n,c;if(!s)return Ce.splice(Ce.indexOf(e),1),e=null,void a(i);var d=s;if(u){var m=function(e,t){var r=e.querySelector("#"+CSS.escape(t));if("symbol"!==(null==r?void 0:r.tagName.toLowerCase()))return null;for(var i=document.createElementNS("http://www.w3.org/2000/svg","svg"),s=r.attributes,o=0,a=s.length;o<a;o++){var n=s[o];"id"!==n.name&&i.setAttribute(n.name,n.value)}var l=r.childNodes;for(o=0,a=l.length;o<a;o++)i.appendChild(l[o].cloneNode(!0));return i}(s,u);if(!m)return Ce.splice(Ce.indexOf(e),1),e=null,void a(new Error('Symbol "'.concat(u,'" not found in ').concat(h)));d=m}var p=e.getAttribute("id");p&&d.setAttribute("id",p);var g=e.getAttribute("title");g&&d.setAttribute("title",g);var f=e.getAttribute("width");f&&d.setAttribute("width",f);var y=e.getAttribute("height");y&&d.setAttribute("height",y);var b=Array.from(new Set(pe(pe(pe([],(null!==(n=d.getAttribute("class"))&&void 0!==n?n:"").split(" "),!0),["injected-svg"],!1),(null!==(c=e.getAttribute("class"))&&void 0!==c?c:"").split(" "),!0))).join(" ").trim();d.setAttribute("class",b);var v=e.getAttribute("style");v&&d.setAttribute("style",v),d.setAttribute("data-src",l);var _=[].filter.call(e.attributes,(function(e){return/^data-\w[\w-]*$/.test(e.name)}));if(Array.prototype.forEach.call(_,(function(e){e.name&&e.value&&d.setAttribute(e.name,e.value)})),r){var w,x,$,k,S,M={clipPath:["clip-path"],"color-profile":["color-profile"],cursor:["cursor"],filter:["filter"],linearGradient:["fill","stroke"],marker:["marker","marker-start","marker-mid","marker-end"],mask:["mask"],path:[],pattern:["fill","stroke"],radialGradient:["fill","stroke"]},A=function(e,t){return e.replace(/url\((['"]?)\s*#([^\s'"\)]+)\s*\1\)/g,(function(e,r,i){var s=t[i];return s?"url(#".concat(s,")"):e}))},C=function(e,t){if(!e.startsWith("#"))return e;var r=t[e.slice(1)];return r?"#"+r:e},E=[],N={};Object.keys(M).forEach((function(e){w=e;for(var t=0,r=(x=d.querySelectorAll(w+"[id]")).length;t<r;t++){var i=x[t];k=i.id,S=k+"-"+ ++Ae,N[k]=S,E.push({element:i,currentId:k,newId:S})}})),Object.keys(M).forEach((function(e){var t;$=M[e],Array.prototype.forEach.call($,(function(e){for(var r=0,i=(t=d.querySelectorAll("["+e+"]")).length;r<i;r++){var s=t[r],o=s.getAttribute(e);if(o){var a=A(o,N);a!==o&&s.setAttribute(e,a)}}}))}));for(var T=d.querySelectorAll("*"),I=0,z=T.length;I<z;I++){var P=T[I],O=P.getAttribute("href");if(O){var j=C(O,N);j!==O&&P.setAttribute("href",j)}var R=P.getAttributeNS(Ne,"href");if(R){var D=C(R,N);D!==R&&P.setAttributeNS(Ne,"href",D)}}for(var V=d.querySelectorAll("[style]"),G=0,L=V.length;G<L;G++){var U=V[G],q=U.getAttribute("style");if(q){var H=A(q,N);H!==q&&U.setAttribute("style",H)}}for(var F=d.querySelectorAll("style"),B=0,W=F.length;B<W;B++){var J=F[B],K=J.textContent;if(K){var X=A(K,N);X!==K&&(J.textContent=X)}}for(var Y=0,Z=E.length;Y<Z;Y++)E[Y].element.id=E[Y].newId}d.removeAttribute("xmlns:a");for(var Q,ee,te=d.querySelectorAll("script"),re=[],ie=0,se=te.length;ie<se;ie++){var oe=te[ie];(ee=oe.getAttribute("type"))&&"application/ecmascript"!==ee&&"application/javascript"!==ee&&"text/javascript"!==ee||((Q=oe.innerText||oe.textContent)&&re.push(Q),d.removeChild(oe))}if(re.length>0&&("always"===t||"once"===t&&!Ee[l])){for(var ae=0,ne=re.length;ae<ne;ae++)new Function(re[ae])(window);Ee[l]=!0}var le=d.querySelectorAll("style");if(Array.prototype.forEach.call(le,(function(e){e.textContent+=""})),d.setAttribute("xmlns","http://www.w3.org/2000/svg"),d.setAttribute("xmlns:xlink",Ne),o(d),!e.parentNode)return Ce.splice(Ce.indexOf(e),1),e=null,void a(new Error("Parent node is null"));e.parentNode.replaceChild(d,e),Ce.splice(Ce.indexOf(e),1),e=null,a(null,d)};if(d)setTimeout((function(){m(null,d)}),0);else(i?ke:Se)(h,s,m)}else a(new Error("Invalid data-src or src attribute"))};class Ie{static toStyleDict(e){return Ie.toDict(e,{stringToDict:Ie.cssStringToDict,mapValue:Ie.toStyleValue})}static toClassDict(e){return Ie.toDict(e,{stringToDict:Ie.classStringToDict,mapValue:Boolean})}static toIconDict(e){return Ie.toDict(e,{stringToDict:Ie.stringToDefaultDict("default"),mapValue:String})}static toDict(e,t={}){const{stringToDict:r=Ie.stringToDefaultDict("default"),mapValue:i=(e=>e),skipNull:s=!0,skipFalse:o=!0}=t,a=e=>null==e&&s||!1===e&&o?{}:Array.isArray(e)?e.reduce(((e,t)=>({...e,...a(t)})),{}):Ie.isPlainObject(e)?Object.fromEntries(Object.entries(e).filter((([,e])=>(null!=e||!s)&&(!1!==e||!o))).map((([e,t])=>[e,i(t,e)]))):"string"==typeof e?r(e):{};return a(e)}static toStyleValue(e){return null==e?e:String(e).trim().replace(/;+$/,"")}static cssStringToDict(e){return String(e).split(";").map((e=>e.trim())).filter(Boolean).reduce(((e,t)=>{const r=t.indexOf(":");if(r<=0)return e;const i=t.slice(0,r).trim(),s=t.slice(r+1).trim();return i&&s?{...e,[i]:s}:e}),{})}static toColorStopDict(e){return Ie.toDict(e,{stringToDict:Ie.keyValueStringToDict,mapValue:String})}static keyValueStringToDict(e){const t=String(e).trim(),r=t.indexOf(":");if(r<=0)return{};const i=t.slice(0,r).trim(),s=t.slice(r+1).trim();return i&&s?{[i]:s}:{}}static classStringToDict(e){return String(e).trim().split(/\s+/).filter(Boolean).reduce(((e,t)=>({...e,[t]:!0})),{})}static stringToDefaultDict(e="default"){return t=>({[e]:String(t)})}static requireArray(e,t="value"){if(null==e)return[];if(!Array.isArray(e))throw new Error(`[config-helper] "${t}" must be an array.`);return e}static ensureArray(e){return null==e?[]:Array.isArray(e)?e:[e]}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}}class ze{static context={};static setContext(e={}){ze.context=e}static getJsTemplateOrValue(e,t,r={}){return ze._getJsTemplateOrValue(e,t,r,0)}static _getJsTemplateOrValue(e,t,r={},i=0){const{resolveKeys:s=!0,maxDepth:o=10}=r;if(i>=o)return t;if(null==t)return t;if(["number","boolean","bigint","symbol"].includes(typeof t))return t;if(Array.isArray(t))return t.map((t=>ze._getJsTemplateOrValue(e,t,r,i)));if(ze.isPlainObject(t))return Object.fromEntries(Object.entries(t).map((([t,o])=>{const a=s?ze._getJsTemplateOrValue(e,t,r,i):t,n=ze._getJsTemplateOrValue(e,o,r,i);return[String(a),n]})));if("string"!=typeof t)return t;const a=t.trim();if(!ze.isJsTemplate(a))return t;const n=ze.evaluateJsTemplate(e,ze.extractJsTemplateCode(a));return ze._getJsTemplateOrValue(e,n,r,i+1)}static isJsTemplate(e){return"string"==typeof e&&e.trim().startsWith("[[[")&&e.trim().endsWith("]]]")}static extractJsTemplateCode(e){return String(e).trim().slice(3,-3).trim()}static evaluateJsTemplate(e,t){const{hass:r,config:i,entities:s=[]}=ze.context,o=ze._getItemEntityIndex(e),a=ze._getTemplateState(e),n=s?.[o],l=r?.states,c=i?.variables??{},h=r?.user;i?.dev?.debug&&console.log("Evaluating JavaScript template with context:",{hass:r,config:i,entity:n,entities:s,states:l,state:a,variables:c,item:e,user:h});try{return new Function("hass","config","entity","entities","states","state","variables","item","user",`\n          "use strict";\n          ${t}\n        `)(r,i,n,s,l,a,c,e,h)}catch(u){return void(i?.dev?.debug&&console.error("[templates] JavaScript template error:",{error:u,item:e,javascript:t}))}}static _getTemplateState(e={}){const t=ze._getItemEntityIndex(e),r=ze.context.entities?.[t],i=ze.context.config?.entities?.[t]||{};if(!r)return;const s=i.attribute;return s&&r.attributes&&void 0!==r.attributes[s]?r.attributes[s]:r.state}static _getItemEntityIndex(e={}){const t=Number(e.entity_index);return Number.isFinite(t)?t:0}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}}class Pe{static normalize(e){return e?Array.isArray(e)?{scales:{},colors:Pe.normalizeColors(e)}:!Pe.isPlainObject(e)||e.colors||e.scales?Pe.isPlainObject(e)?{...e,scales:Pe.normalizeScales(e.scales),colors:Pe.normalizeColors(e.colors)}:{scales:{},colors:[]}:{scales:{},colors:Pe.normalizeColors(e)}:{scales:{},colors:[]}}static normalizeScales(e){return Pe.isPlainObject(e)?Object.fromEntries(Object.entries(e).map((([e,t])=>[e,Pe.isPlainObject(t)?{...t}:t]))):{}}static normalizeColors(e){return e?Array.isArray(e)?e.flatMap((e=>Pe.normalizeColorArrayEntry(e))).filter(Boolean).sort(((e,t)=>e.value-t.value)):Pe.isPlainObject(e)?Object.entries(e).map((([e,t])=>Pe.normalizeColorPair(e,t))).filter(Boolean).sort(((e,t)=>e.value-t.value)):[]:[]}static normalizeColorArrayEntry(e){if(Pe.isPlainObject(e)&&Object.prototype.hasOwnProperty.call(e,"value")&&Object.prototype.hasOwnProperty.call(e,"color")){const t=Pe.normalizeColorEntry(e);return t?[t]:[]}return Pe.isPlainObject(e)?Object.entries(e).map((([e,t])=>Pe.normalizeColorPair(e,t))).filter(Boolean):[]}static normalizeColorPair(e,t){const r=Number(e);return Number.isFinite(r)?null==t?null:{value:r,color:String(t)}:null}static normalizeColorEntry(e){if(!Pe.isPlainObject(e))return null;const t=Number(e.value);return Number.isFinite(t)?void 0===e.color||null===e.color?null:{...e,value:t,color:String(e.color)}:null}static ensureMinimumStops(e,t){return e?.colors&&1===e.colors.length?{...e,colors:[e.colors[0],{value:t,color:e.colors[0].color}]}:e}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}static _testColorStopsNormalizer(){const e={entity_index:0},t=[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}];[{name:"FHC dict",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC dict with quoted keys",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC list of dicts",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC list of dicts with quoted keys",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC dict with template values",raw:{0:"[[[\n          return 'red';\n        ]]]",10:"[[[\n          return 'green';\n        ]]]",20:"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template values",raw:[{0:"[[[\n            return 'red';\n          ]]]"},{10:"[[[\n            return 'green';\n          ]]]"},{20:"[[[\n            return 'blue';\n          ]]]"}]},{name:"FHC dict with template keys",raw:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}},{name:"FHC dict with template keys and values",raw:{"[[[ return 0; ]]]":"[[[\n          return 'red';\n        ]]]","[[[ return 10; ]]]":"[[[\n          return 'green';\n        ]]]","[[[ return 20; ]]]":"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template keys and values",raw:[{"[[[ return 0; ]]]":"[[[\n            return 'red';\n          ]]]"},{"[[[ return 10; ]]]":"[[[\n            return 'green';\n          ]]]"},{"[[[ return 20; ]]]":"[[[\n            return 'blue';\n          ]]]"}]},{name:"Whole FHC color_stops as template returning dict",raw:"[[[\n        return {\n          0: 'red',\n          10: 'green',\n          20: 'blue',\n        };\n      ]]]"},{name:"Whole FHC color_stops as template returning list",raw:"[[[\n        return [\n          { 0: 'red' },\n          { 10: 'green' },\n          { 20: 'blue' },\n        ];\n      ]]]"},{name:"SAK v1 colorstops.colors dict",raw:{colors:{0:"red",10:"green",20:"blue"}}},{name:"SAK v1 colorstops.colors dict with template keys",raw:{colors:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}}},{name:"SAK v1 colorstops.colors dict with template values",raw:{colors:{0:"[[[\n            return 'red';\n          ]]]",10:"[[[\n            return 'green';\n          ]]]",20:"[[[\n            return 'blue';\n          ]]]"}}},{name:"SAK v2 colors list",raw:{scales:{default:{min:0,max:20}},colors:[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}]}},{name:"SAK v2 colors list unsorted",raw:{scales:{default:{min:0,max:20}},colors:[{value:20,color:"blue",rank:2},{value:0,color:"red",rank:1},{value:10,color:"green",rank:1}]}},{name:"SAK v2 colors list with template values",raw:{scales:{default:{min:"[[[\n              return 0;\n            ]]]",max:"[[[\n              return 20;\n            ]]]"}},colors:[{value:"[[[\n              return 0;\n            ]]]",color:"[[[\n              return 'red';\n            ]]]"},{value:"[[[\n              return 10;\n            ]]]",color:"[[[\n              return 'green';\n            ]]]"},{value:"[[[\n              return 20;\n            ]]]",color:"[[[\n              return 'blue';\n            ]]]"}]}},{name:"SAK v2 whole colors list as template",raw:{scales:{default:{min:0,max:20}},colors:"[[[\n          return [\n            { value: 0, color: 'red' },\n            { value: 10, color: 'green' },\n            { value: 20, color: 'blue' },\n          ];\n        ]]]"}}].forEach((r=>{const i=ze.getJsTemplateOrValue(e,r.raw,{resolveKeys:!0}),s=Pe.normalize(i),o=s.colors.map((e=>({value:e.value,color:e.color}))),a=JSON.stringify(o)===JSON.stringify(t);console.log(`[colorstops test] ${a?"PASS":"FAIL"} - ${r.name}`,{raw:r.raw,resolved:i,normalized:s,simpleColors:o,expectedColors:t})}))}}const Oe="mdi:bookmark",je={air_quality:"mdi:air-filter",alert:"mdi:alert",calendar:"mdi:calendar",climate:"mdi:thermostat",configurator:"mdi:cog",conversation:"mdi:microphone-message",counter:"mdi:counter",datetime:"mdi:calendar-clock",date:"mdi:calendar",demo:"mdi:home-assistant",google_assistant:"mdi:google-assistant",group:"mdi:google-circles-communities",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_button:"mdi:gesture-tap-button",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",number:"mdi:ray-vertex",persistent_notification:"mdi:bell",plant:"mdi:Flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:palette",schedule:"mdi:calendar-clock",script:"mdi:script-text",select:"mdi:format-list-bulleted",sensor:"mdi:eye",simple_alarm:"mdi:bell",siren:"mdi:bullhorn",stt:"mdi:microphone-message",text:"mdi:form-textbox",time:"mdi:clock",timer:"mdi:timer-outline",tts:"mdi:speaker-message",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",zone:"mdi:map-marker-radius"},Re={apparent_power:"mdi:flash",aqi:"mdi:air-filter",atmospheric_pressure:"mdi:thermometer-lines",carbon_dioxide:"mdi:molecule-co2",carbon_monoxide:"mdi:molecule-co",current:"mdi:current-ac",data_rate:"mdi:transmission-tower",data_size:"mdi:database",date:"mdi:calendar",distance:"mdi:arrow-left-right",duration:"mdi:progress-clock",energy:"mdi:lightning-bolt",frequency:"mdi:sine-wave",gas:"mdi:meter-gas",humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",irradiance:"mdi:sun-wireless",moisture:"mdi:water-percent",monetary:"mdi:cash",nitrogen_dioxide:"mdi:molecule",nitrogen_monoxide:"mdi:molecule",nitrous_oxide:"mdi:molecule",ozone:"mdi:molecule",pm1:"mdi:molecule",pm10:"mdi:molecule",pm25:"mdi:molecule",power:"mdi:flash",power_factor:"mdi:angle-acute",precipitation:"mdi:weather-rainy",precipitation_intensity:"mdi:weather-pouring",pressure:"mdi:gauge",reactive_power:"mdi:flash",signal_strength:"mdi:wifi",sound_pressure:"mdi:ear-hearing",speed:"mdi:speedometer",sulphur_dioxide:"mdi:molecule",temperature:"mdi:thermometer",timestamp:"mdi:clock",volatile_organic_compounds:"mdi:molecule",volatile_organic_compounds_parts:"mdi:molecule",voltage:"mdi:sine-wave",volume:"mdi:car-coolant-level",water:"mdi:water",weight:"mdi:weight",wind_speed:"mdi:weather-windy"},De=e=>e.substring(0,e.indexOf(".")),Ve={10:"mdi:battery-10",20:"mdi:battery-20",30:"mdi:battery-30",40:"mdi:battery-40",50:"mdi:battery-50",60:"mdi:battery-60",70:"mdi:battery-70",80:"mdi:battery-80",90:"mdi:battery-90",100:"mdi:battery"},Ge=(e,t)=>{const r=Number(e);if(isNaN(r))return"off"===e?"mdi:battery":"on"===e?"mdi:battery-alert":"mdi:battery-unknown";const i=10*Math.round(r/10);return r<=5?"mdi:battery-alert-variant-outline":Ve[i]},Le=e=>{const t=e?.attributes.device_class;if(t&&t in Re)return Re[t];if("battery"===t)return e?((e,t)=>{const r=e.state;return Ge(r)})(e):"mdi:battery";const r=e?.attributes.unit_of_measurement;return"°C"===r||"°F"===r?"mdi-thermometer":void 0},Ue=(e,t,r)=>{const i=t?.state;switch(e){case"alarm_control_panel":return(e=>{switch(e){case"armed_away":return"mdi:shield-lock";case"armed_vacation":return"mdi:shield-airplane";case"armed_home":return"mdi:shield-home";case"armed_night":return"mdi:shield-moon";case"armed_custom_bypass":return"mdi:security";case"pending":return"mdi:shield-outline";case"triggered":return"mdi:bell-ring";case"disarmed":return"mdi:shield-off";default:return"mdi:shield"}})(i);case"automation":return"off"===i?"mdi:robot-off":"mdi:robot";case"binary_sensor":return((e,t)=>{const r="off"===e;switch(t?.attributes.device_class){case"battery":return r?"mdi:battery":"mdi:battery-outline";case"battery_charging":return r?"mdi:battery":"mdi:battery-charging";case"carbon_monoxide":return r?"mdi:smoke-detector":"mdi:smoke-detector-alert";case"cold":return r?"mdi:thermometer":"mdi:Snowflake";case"connectivity":return r?"mdi:close-network-outline":"mdi:check-network-outline";case"door":return r?"mdi:door-closed":"mdi:door-open";case"garage_door":return r?"mdi:garage":"mdi:garage-open";case"power":case"plug":return r?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return r?"mdi:check-circle":"mdi:alert-circle";case"smoke":return r?"mdi:smoke-detector-variant":"mdi:smoke-detector-variant-alert";case"heat":return r?"mdi:thermometer":"mdi:fire";case"light":return r?"mdi:brightness-5":"mdi:brightness-7";case"lock":return r?"mdi:lock":"mdi:lock-open";case"moisture":return r?"mdi:water-off":"mdi:water";case"motion":return r?"mdi:motion-sensor-off":"mdi:motion-sensor";case"occupancy":return r?"mdi:home-outline":"mdi:Home";case"opening":return r?"mdi:square":"mdi:square-outline";case"presence":return r?"mdi:home-outline":"mdi:home";case"running":return r?"mdi:stop":"mdi:play";case"sound":return r?"mdi:music-note-off":"mdi:music-note";case"update":return r?"mdi:package":"mdi:package-up";case"vibration":return r?"mdi:crop-portrait":"mdi:vibrate";case"window":return r?"mdi:window-closed":"mdi:window-open";default:return r?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}})(i,t);case"button":switch(t?.attributes.device_class){case"restart":return"mdi:restart";case"update":return"mdi:package-up";default:return"mdi:gesture-tap-button"}case"camera":return"off"===i?"mdi:video-off":"mdi:video";case"cover":return((e,t)=>{const r="closed"!==e;switch(t?.attributes.device_class){case"garage":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdigarage";default:return"mdi:Garage-open"}case"gate":switch(e){case"opening":case"closing":return"mdi:gate-arrow-right";case"closed":return"mdi:gate";default:return"mdi:gate-open"}case"door":return r?"mdi:door-open":"mdi:door-closed";case"damper":return r?"mdi:circle":"mdi:circle-slice-8";case"shutter":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window-shutter";default:return"mdi:window-shutter-open"}case"curtain":switch(e){case"opening":return"mdi:arrow-split-vertical";case"closing":return"mdi:arrow-collapse-horizontal";case"closed":return"mdi:curtains-closed";default:return"mdi:curtains"}case"blind":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:blinds-horizontal-closed";default:return"mdi:blinds-horizontal"}case"shade":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:roller-shade-closed";default:return"mdi:roller-shade"}case"window":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}}switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}})(i,t);case"device_tracker":return"router"===t?.attributes.source_type?"home"===i?"mdi:lan-connect":"mdi:lan-cisconnect":["bluetooth","bluetooth_le"].includes(t?.attributes.source_type)?"home"===i?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===i?"mdi:account-arrow-right":"mdi:account";case"fan":return"off"===i?"mdi:fan-off":"mdi:fan";case"humidifier":return"off"===i?"mdi:air-humidifier-off":"mdi:air-humidifier";case"input_boolean":return"on"===i?"mdi:check-circle-outline":"mdi:close-circle-outline";case"input_datetime":if(!t?.attributes.has_date)return"mdi:clock";if(!t.attributes.has_time)return"mdi:calendar";break;case"lock":switch(i){case"unlocked":return"mdi:lock-open";case"jammed":return"mdi:lock-alert";case"locking":case"unlocking":return"mdi:lock-clock";default:return"mdi:lock"}case"media_player":switch(t?.attributes.device_class){case"speaker":switch(i){case"playing":return"mdi:speaker-play";case"paused":return"mdi:speaker-pause";case"off":return"mdi:speaker-off";default:return"mdi:speaker"}case"tv":switch(i){case"playing":return"mdi:television-play";case"paused":return"mdi:television-pause";case"off":return"mdi:television-off";default:return"mdi:television"}case"receiver":return"off"===i?"mdi:audio-video-off":"mdi:audio-video";default:switch(i){case"playing":case"paused":return"mdi:cast-connected";case"off":return"mdi:cast-off";default:return"mdi:cast"}}case"number":{const e=(e=>{const t=e?.attributes.device_class;if(t&&t in Re)return Re[t]})(t);if(e)return e;break}case"person":return"not_home"===i?"mdi:account-arrow-right":"mdi:account";case"switch":switch(t?.attributes.device_class){case"outlet":return"on"===i?"mdi:power-plug":"mdi:power-plug-off";case"switch":return"on"===i?"mdi:toggle-switch-variant":"mdi:toggle-switch-variant-off";default:return"mdi:toggle-switch-variant"}case"sensor":{const e=Le(t);if(e)return e;break}case"sun":return"above_horizon"===t?.state?"mdi:white-balance-sunny":"mdi:weather-night";case"switch_as_x":return"mdi:swap-horizontal";case"threshold":return"mdi:chart-sankey";case"water_heater":return"off"===i?"mdi:water-boiler-off":"mdi:water-boiler"}if(e in je)return je[e]},qe=e=>{return e?(t=De(e.entity_id),Ue(t,e)||(console.warn(`Unable to find icon for domain ${t}`),Oe)):Oe;var t};var He,Fe,Be,We,Je;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.quote_decimal="quote_decimal",e.space_comma="space_comma",e.none="none"}(He||(He={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Fe||(Fe={})),function(e){e.local="local",e.server="server"}(Be||(Be={})),function(e){e.language="language",e.system="system",e.DMY="DMY",e.MDY="MDY",e.YMD="YMD"}(We||(We={})),function(e){e.language="language",e.monday="monday",e.tuesday="tuesday",e.wednesday="wednesday",e.thursday="thursday",e.friday="friday",e.saturday="saturday",e.sunday="sunday"}(Je||(Je={})),Intl.DateTimeFormat?.().resolvedOptions?.().timeZone;const Ke="unavailable",Xe=(Ye=[Ke,"unknown"],(e,t)=>Ye.includes(e,t));var Ye;const Ze=(e,t)=>e&&e.components.includes(t),Qe=e=>De(e.entity_id),et={entity:{},entity_component:{}},tt=async(e,t,r)=>((e,t)=>e.sendMessagePromise(t))(e,{type:"frontend/get_icons",category:t,integration:r}),rt=async(e,t,r,i=!1)=>{if(!i&&r in et.entity)return et.entity[r];if(!Ze(e,r)||!((e,t,r,i)=>{const[s,o,a]=e.split(".",3);return Number(s)>t||Number(s)===t&&(void 0===i?Number(o)>=r:Number(o)>r)||void 0!==i&&Number(s)===t&&Number(o)===r&&Number(a)>=i})(t.haVersion,2024,2))return;const s=tt(t,"entity",r).then((e=>e?.resources[r]));return et.entity[r]=s,et.entity[r]},it=async(e,t,r,i=!1)=>!i&&et.entity_component.resources&&et.entity_component.domains?.includes(r)?et.entity_component.resources.then((e=>e[r])):Ze(t,r)?(et.entity_component.domains=[...t.components],et.entity_component.resources=tt(e,"entity_component").then((e=>e.resources)),et.entity_component.resources.then((e=>e[r]))):void 0,st=new WeakMap,ot=(e,t)=>{if(t)return e&&t.state?.[e]?t.state[e]:void 0!==e&&t.range&&!isNaN(Number(e))?((e,t)=>{let r=st.get(t);if(r||(r=Object.keys(t).map(Number).filter((e=>!isNaN(e))).sort(((e,t)=>e-t)),st.set(t,r)),0===r.length)return;if(e<r[0])return;let i=r[0];for(const s of r){if(!(e>=s))break;i=s}return t[i.toString()]})(Number(e),t.range)??t.default:t.default},at=async(e,t,r,i,s,o)=>{const a=o?.platform,n=o?.translation_key,l=i?.attributes.device_class,c=i?.state;let h;if(n&&a){const i=await rt(e,t,a);if(i){const e=i[r]?.[n];h=ot(c,e)}}if(!h&&i&&(h=((e,t)=>{const r=Qe(e),i=t??e.state;switch(r){case"device_tracker":return((e,t)=>{const r=t??e.state;return"router"===e?.attributes.source_type?"home"===r?"mdi:lan-connect":"mdi:lan-disconnect":["bluetooth","bluetooth_le"].includes(e?.attributes.source_type)?"home"===r?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===r?"mdi:account-arrow-right":"mdi:account"})(e,i);case"sun":return"above_horizon"===i?"mdi:white-balance-sunny":"mdi:weather-night";case"input_datetime":if(!e.attributes.has_date)return"mdi:clock";if(!e.attributes.has_time)return"mdi:calendar"}})(i,c)),!h){const i=await it(t,e,r);if(i){const e=l&&i[l]||i._;h=ot(c,e)}}return h},nt=(e,t)=>{if("number"==typeof e)return 3===t?{mode:"rgb",r:(e>>8&15|e>>4&240)/255,g:(e>>4&15|240&e)/255,b:(15&e|e<<4&240)/255}:4===t?{mode:"rgb",r:(e>>12&15|e>>8&240)/255,g:(e>>8&15|e>>4&240)/255,b:(e>>4&15|240&e)/255,alpha:(15&e|e<<4&240)/255}:6===t?{mode:"rgb",r:(e>>16&255)/255,g:(e>>8&255)/255,b:(255&e)/255}:8===t?{mode:"rgb",r:(e>>24&255)/255,g:(e>>16&255)/255,b:(e>>8&255)/255,alpha:(255&e)/255}:void 0},lt={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ct=/^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i,ht="([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)",ut=`${ht}%`,dt=`(?:${ht}%|${ht})`,mt=`(?:${ht}(deg|grad|rad|turn)|${ht})`,pt="\\s*,\\s*",gt=new RegExp(`^rgba?\\(\\s*${ht}${pt}${ht}${pt}${ht}\\s*(?:,\\s*${dt}\\s*)?\\)$`),ft=new RegExp(`^rgba?\\(\\s*${ut}${pt}${ut}${pt}${ut}\\s*(?:,\\s*${dt}\\s*)?\\)$`),yt=(e="rgb")=>t=>void 0!==(t=((e,t)=>void 0===e?void 0:"object"!=typeof e?Dt(e):void 0!==e.mode?e:t?{...e,mode:t}:void 0)(t,e))?t.mode===e?t:bt[t.mode][e]?bt[t.mode][e](t):"rgb"===e?bt[t.mode].rgb(t):bt.rgb[e](bt[t.mode].rgb(t)):void 0,bt={},vt={},_t=[],wt={},xt=e=>e,$t=e=>(bt[e.mode]={...bt[e.mode],...e.toMode},Object.keys(e.fromMode||{}).forEach((t=>{bt[t]||(bt[t]={}),bt[t][e.mode]=e.fromMode[t]})),e.ranges||(e.ranges={}),e.difference||(e.difference={}),e.channels.forEach((t=>{if(void 0===e.ranges[t]&&(e.ranges[t]=[0,1]),!e.interpolate[t])throw new Error(`Missing interpolator for: ${t}`);"function"==typeof e.interpolate[t]&&(e.interpolate[t]={use:e.interpolate[t]}),e.interpolate[t].fixup||(e.interpolate[t].fixup=xt)})),vt[e.mode]=e,(e.parse||[]).forEach((t=>{kt(t,e.mode)})),yt(e.mode)),kt=(e,t)=>{if("string"==typeof e){if(!t)throw new Error("'mode' required when 'parser' is a string");wt[e]=t}else"function"==typeof e&&_t.indexOf(e)<0&&_t.push(e)},St=/[^\x00-\x7F]|[a-zA-Z_]/,Mt=/[^\x00-\x7F]|[-\w]/,At={Function:"function",Ident:"ident",Number:"number",Percentage:"percentage",ParenClose:")",None:"none",Hue:"hue",Alpha:"alpha"};let Ct=0;function Et(e){let t=e[Ct],r=e[Ct+1];return"-"===t||"+"===t?/\d/.test(r)||"."===r&&/\d/.test(e[Ct+2]):/\d/.test("."===t?r:t)}function Nt(e){if(Ct>=e.length)return!1;let t=e[Ct];if(St.test(t))return!0;if("-"===t){if(e.length-Ct<2)return!1;let t=e[Ct+1];return!("-"!==t&&!St.test(t))}return!1}const Tt={deg:1,rad:180/Math.PI,grad:.9,turn:360};function It(e){let t="";if("-"!==e[Ct]&&"+"!==e[Ct]||(t+=e[Ct++]),t+=zt(e),"."===e[Ct]&&/\d/.test(e[Ct+1])&&(t+=e[Ct++]+zt(e)),"e"!==e[Ct]&&"E"!==e[Ct]||("-"!==e[Ct+1]&&"+"!==e[Ct+1]||!/\d/.test(e[Ct+2])?/\d/.test(e[Ct+1])&&(t+=e[Ct++]+zt(e)):t+=e[Ct++]+e[Ct++]+zt(e)),Nt(e)){let r=Pt(e);return"deg"===r||"rad"===r||"turn"===r||"grad"===r?{type:At.Hue,value:t*Tt[r]}:void 0}return"%"===e[Ct]?(Ct++,{type:At.Percentage,value:+t}):{type:At.Number,value:+t}}function zt(e){let t="";for(;/\d/.test(e[Ct]);)t+=e[Ct++];return t}function Pt(e){let t="";for(;Ct<e.length&&Mt.test(e[Ct]);)t+=e[Ct++];return t}function Ot(e){let t=Pt(e);return"("===e[Ct]?(Ct++,{type:At.Function,value:t}):"none"===t?{type:At.None,value:void 0}:{type:At.Ident,value:t}}function jt(e){e._i=0;let t=e[e._i++];if(!t||t.type!==At.Function||"color"!==t.value)return;if(t=e[e._i++],t.type!==At.Ident)return;const r=wt[t.value];if(!r)return;const i={mode:r},s=Rt(e,!1);if(!s)return;const o=(e=>vt[e])(r).channels;for(let a,n,l=0;l<o.length;l++)a=s[l],n=o[l],a.type!==At.None&&(i[n]=a.type===At.Number?a.value:a.value/100,"alpha"===n&&(i[n]=Math.max(0,Math.min(1,i[n]))));return i}function Rt(e,t){const r=[];let i;for(;e._i<e.length;)if(i=e[e._i++],i.type===At.None||i.type===At.Number||i.type===At.Alpha||i.type===At.Percentage||t&&i.type===At.Hue)r.push(i);else{if(i.type!==At.ParenClose)return;if(e._i<e.length)return}if(!(r.length<3||r.length>4)){if(4===r.length){if(r[3].type!==At.Alpha)return;r[3]=r[3].value}return 3===r.length&&r.push({type:At.None,value:void 0}),r.every((e=>e.type!==At.Alpha))?r:void 0}}const Dt=e=>{if("string"!=typeof e)return;const t=function(e=""){let t,r=e.trim(),i=[];for(Ct=0;Ct<r.length;)if(t=r[Ct++],"\n"!==t&&"\t"!==t&&" "!==t){if(","===t)return;if(")"!==t){if("+"===t){if(Ct--,Et(r)){i.push(It(r));continue}return}if("-"===t){if(Ct--,Et(r)){i.push(It(r));continue}if(Nt(r)){i.push({type:At.Ident,value:Pt(r)});continue}return}if("."===t){if(Ct--,Et(r)){i.push(It(r));continue}return}if("/"===t){for(;Ct<r.length&&("\n"===r[Ct]||"\t"===r[Ct]||" "===r[Ct]);)Ct++;let e;if(Et(r)&&(e=It(r),e.type!==At.Hue)){i.push({type:At.Alpha,value:e});continue}if(Nt(r)&&"none"===Pt(r)){i.push({type:At.Alpha,value:{type:At.None,value:void 0}});continue}return}if(/\d/.test(t))Ct--,i.push(It(r));else{if(!St.test(t))return;Ct--,i.push(Ot(r))}}else i.push({type:At.ParenClose})}else for(;Ct<r.length&&("\n"===r[Ct]||"\t"===r[Ct]||" "===r[Ct]);)Ct++;return i}(e),r=t?function(e,t){e._i=0;let r=e[e._i++];if(!r||r.type!==At.Function)return;let i=Rt(e,t);return i?(i.unshift(r.value),i):void 0}(t,!0):void 0;let i,s=0,o=_t.length;for(;s<o;)if(void 0!==(i=_t[s++](e,r)))return i;return t?jt(t):void 0};const Vt=(Gt=(e,t,r)=>e+r*(t-e),e=>{let t=(e=>{let t=[];for(let r=0;r<e.length-1;r++){let i=e[r],s=e[r+1];void 0===i&&void 0===s?t.push(void 0):void 0!==i&&void 0!==s?t.push([i,s]):t.push(void 0!==i?[i,i]:[s,s])}return t})(e);return e=>{let r=e*t.length,i=e>=1?t.length-1:Math.max(Math.floor(r),0),s=t[i];return void 0===s?void 0:Gt(s[0],s[1],r-i)}});var Gt;const Lt=e=>{let t=!1,r=e.map((e=>void 0!==e?(t=!0,e):1));return t?r:e},Ut={mode:"rgb",channels:["r","g","b","alpha"],parse:[function(e,t){if(!t||"rgb"!==t[0]&&"rgba"!==t[0])return;const r={mode:"rgb"},[,i,s,o,a]=t;return i.type!==At.Hue&&s.type!==At.Hue&&o.type!==At.Hue?(i.type!==At.None&&(r.r=i.type===At.Number?i.value/255:i.value/100),s.type!==At.None&&(r.g=s.type===At.Number?s.value/255:s.value/100),o.type!==At.None&&(r.b=o.type===At.Number?o.value/255:o.value/100),a.type!==At.None&&(r.alpha=Math.min(1,Math.max(0,a.type===At.Number?a.value:a.value/100))),r):void 0},e=>{let t;return(t=e.match(ct))?nt(parseInt(t[1],16),t[1].length):void 0},e=>{let t,r={mode:"rgb"};if(t=e.match(gt))void 0!==t[1]&&(r.r=t[1]/255),void 0!==t[2]&&(r.g=t[2]/255),void 0!==t[3]&&(r.b=t[3]/255);else{if(!(t=e.match(ft)))return;void 0!==t[1]&&(r.r=t[1]/100),void 0!==t[2]&&(r.g=t[2]/100),void 0!==t[3]&&(r.b=t[3]/100)}return void 0!==t[4]?r.alpha=Math.max(0,Math.min(1,t[4]/100)):void 0!==t[5]&&(r.alpha=Math.max(0,Math.min(1,+t[5]))),r},e=>nt(lt[e.toLowerCase()],6),e=>"transparent"===e?{mode:"rgb",r:0,g:0,b:0,alpha:0}:void 0,"srgb"],serialize:"srgb",interpolate:{r:Vt,g:Vt,b:Vt,alpha:{use:Vt,fixup:Lt}},gamut:!0,white:{r:1,g:1,b:1},black:{r:0,g:0,b:0}},qt=(e=0)=>Math.pow(Math.abs(e),563/256)*Math.sign(e),Ht=e=>{let t=qt(e.r),r=qt(e.g),i=qt(e.b),s={mode:"xyz65",x:.5766690429101305*t+.1855582379065463*r+.1882286462349947*i,y:.297344975250536*t+.6273635662554661*r+.0752914584939979*i,z:.0270313613864123*t+.0706888525358272*r+.9913375368376386*i};return void 0!==e.alpha&&(s.alpha=e.alpha),s},Ft=e=>Math.pow(Math.abs(e),256/563)*Math.sign(e),Bt=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s={mode:"a98",r:Ft(2.0415879038107465*e-.5650069742788597*t-.3447313507783297*r),g:Ft(-.9692436362808798*e+1.8759675015077206*t+.0415550574071756*r),b:Ft(.0134442806320312*e-.1183623922310184*t+1.0151749943912058*r)};return void 0!==i&&(s.alpha=i),s},Wt=(e=0)=>{const t=Math.abs(e);return t<=.04045?e/12.92:(Math.sign(e)||1)*Math.pow((t+.055)/1.055,2.4)},Jt=({r:e,g:t,b:r,alpha:i})=>{let s={mode:"lrgb",r:Wt(e),g:Wt(t),b:Wt(r)};return void 0!==i&&(s.alpha=i),s},Kt=e=>{let{r:t,g:r,b:i,alpha:s}=Jt(e),o={mode:"xyz65",x:.4123907992659593*t+.357584339383878*r+.1804807884018343*i,y:.2126390058715102*t+.715168678767756*r+.0721923153607337*i,z:.0193308187155918*t+.119194779794626*r+.9505321522496607*i};return void 0!==s&&(o.alpha=s),o},Xt=(e=0)=>{const t=Math.abs(e);return t>.0031308?(Math.sign(e)||1)*(1.055*Math.pow(t,1/2.4)-.055):12.92*e},Yt=({r:e,g:t,b:r,alpha:i},s="rgb")=>{let o={mode:s,r:Xt(e),g:Xt(t),b:Xt(r)};return void 0!==i&&(o.alpha=i),o},Zt=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s=Yt({r:3.2409699419045226*e-1.537383177570094*t-.4986107602930034*r,g:-.9692436362808796*e+1.8759675015077204*t+.0415550574071756*r,b:.0556300796969936*e-.2039769588889765*t+1.0569715142428784*r});return void 0!==i&&(s.alpha=i),s},Qt={...Ut,mode:"a98",parse:["a98-rgb"],serialize:"a98-rgb",fromMode:{rgb:e=>Bt(Kt(e)),xyz65:Bt},toMode:{rgb:e=>Zt(Ht(e)),xyz65:Ht}},er=e=>(e%=360)<0?e+360:e,tr=e=>((e,t)=>e.map(((r,i,s)=>{if(void 0===r)return r;let o=er(r);return 0===i||void 0===e[i-1]?o:t(o-er(s[i-1]))})).reduce(((e,t)=>e.length&&void 0!==t&&void 0!==e[e.length-1]?(e.push(t+e[e.length-1]),e):(e.push(t),e)),[]))(e,(e=>Math.abs(e)<=180?e:e-360*Math.sign(e))),rr=[-.14861,1.78277,-.29227,-.90649,1.97294,0],ir=Math.PI/180,sr=180/Math.PI;let or=rr[3]*rr[4],ar=rr[1]*rr[4],nr=rr[1]*rr[2]-rr[0]*rr[3];const lr=(e,t)=>{if(void 0===e.h||void 0===t.h||!e.s||!t.s)return 0;let r=er(e.h),i=er(t.h),s=Math.sin((i-r+360)/2*Math.PI/180);return 2*Math.sqrt(e.s*t.s)*s},cr=(e,t)=>{if(void 0===e.h||void 0===t.h||!e.c||!t.c)return 0;let r=er(e.h),i=er(t.h),s=Math.sin((i-r+360)/2*Math.PI/180);return 2*Math.sqrt(e.c*t.c)*s},hr=e=>{let t=e.reduce(((e,t)=>{if(void 0!==t){let r=t*Math.PI/180;e.sin+=Math.sin(r),e.cos+=Math.cos(r)}return e}),{sin:0,cos:0}),r=180*Math.atan2(t.sin,t.cos)/Math.PI;return r<0?360+r:r},ur={mode:"cubehelix",channels:["h","s","l","alpha"],parse:["--cubehelix"],serialize:"--cubehelix",ranges:{h:[0,360],s:[0,4.614],l:[0,1]},fromMode:{rgb:({r:e,g:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s=(nr*r+e*or-t*ar)/(nr+or-ar),o=r-s,a=(rr[4]*(t-s)-rr[2]*o)/rr[3],n={mode:"cubehelix",l:s,s:0===s||1===s?void 0:Math.sqrt(o*o+a*a)/(rr[4]*s*(1-s))};return n.s&&(n.h=Math.atan2(a,o)*sr-120),void 0!==i&&(n.alpha=i),n}},toMode:{rgb:({h:e,s:t,l:r,alpha:i})=>{let s={mode:"rgb"};e=(void 0===e?0:e+120)*ir,void 0===r&&(r=0);let o=void 0===t?0:t*r*(1-r),a=Math.cos(e),n=Math.sin(e);return s.r=r+o*(rr[0]*a+rr[1]*n),s.g=r+o*(rr[2]*a+rr[3]*n),s.b=r+o*(rr[4]*a+rr[5]*n),void 0!==i&&(s.alpha=i),s}},interpolate:{h:{use:Vt,fixup:tr},s:Vt,l:Vt,alpha:{use:Vt,fixup:Lt}},difference:{h:lr},average:{h:hr}},dr=({l:e,a:t,b:r,alpha:i},s="lch")=>{void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.sqrt(t*t+r*r),a={mode:s,l:e,c:o};return o&&(a.h=er(180*Math.atan2(r,t)/Math.PI)),void 0!==i&&(a.alpha=i),a},mr=({l:e,c:t,h:r,alpha:i},s="lab")=>{void 0===r&&(r=0);let o={mode:s,l:e,a:t?t*Math.cos(r/180*Math.PI):0,b:t?t*Math.sin(r/180*Math.PI):0};return void 0!==i&&(o.alpha=i),o},pr=Math.pow(29,3)/Math.pow(3,3),gr=Math.pow(6,3)/Math.pow(29,3),fr=.3457/.3585,yr=1,br=.2958/.3585,vr=.3127/.329,_r=1,wr=.3583/.329;let xr=e=>Math.pow(e,3)>gr?Math.pow(e,3):(116*e-16)/pr;const $r=({l:e,a:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s=(e+16)/116,o=s-r/200,a={mode:"xyz65",x:xr(t/500+s)*vr,y:xr(s)*_r,z:xr(o)*wr};return void 0!==i&&(a.alpha=i),a},kr=e=>Zt($r(e)),Sr=e=>e>gr?Math.cbrt(e):(pr*e+16)/116,Mr=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s=Sr(e/vr),o=Sr(t/_r),a={mode:"lab65",l:116*o-16,a:500*(s-o),b:200*(o-Sr(r/wr))};return void 0!==i&&(a.alpha=i),a},Ar=e=>{let t=Mr(Kt(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},Cr=26/180*Math.PI,Er=Math.cos(Cr),Nr=Math.sin(Cr),Tr=100/Math.log(1.39),Ir=({l:e,c:t,h:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s={mode:"lab65",l:(Math.exp(1*e/Tr)-1)/.0039},o=(Math.exp(.0435*t*1*1)-1)/.075,a=o*Math.cos(r/180*Math.PI-Cr),n=o*Math.sin(r/180*Math.PI-Cr);return s.a=a*Er-n/.83*Nr,s.b=a*Nr+n/.83*Er,void 0!==i&&(s.alpha=i),s},zr=({l:e,a:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s=t*Er+r*Nr,o=.83*(r*Er-t*Nr),a=Math.sqrt(s*s+o*o),n={mode:"dlch",l:Tr/1*Math.log(1+.0039*e),c:Math.log(1+.075*a)/.0435};return n.c&&(n.h=er((Math.atan2(o,s)+Cr)/Math.PI*180)),void 0!==i&&(n.alpha=i),n},Pr=e=>Ir(dr(e,"dlch")),Or=e=>mr(zr(e),"dlab"),jr={mode:"dlab",parse:["--din99o-lab"],serialize:"--din99o-lab",toMode:{lab65:Pr,rgb:e=>kr(Pr(e))},fromMode:{lab65:Or,rgb:e=>Or(Ar(e))},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-40.09,45.501],b:[-40.469,44.344]},interpolate:{l:Vt,a:Vt,b:Vt,alpha:{use:Vt,fixup:Lt}}},Rr={mode:"dlch",parse:["--din99o-lch"],serialize:"--din99o-lch",toMode:{lab65:Ir,dlab:e=>mr(e,"dlab"),rgb:e=>kr(Ir(e))},fromMode:{lab65:zr,dlab:e=>dr(e,"dlch"),rgb:e=>zr(Ar(e))},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,51.484],h:[0,360]},interpolate:{l:Vt,c:Vt,h:{use:Vt,fixup:tr},alpha:{use:Vt,fixup:Lt}},difference:{h:cr},average:{h:hr}};const Dr={mode:"hsi",toMode:{rgb:function({h:e,s:t,i:r,alpha:i}){e=er(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let s,o=Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:s={r:r*(1+t*(3/(2-o)-1)),g:r*(1+t*(3*(1-o)/(2-o)-1)),b:r*(1-t)};break;case 1:s={r:r*(1+t*(3*(1-o)/(2-o)-1)),g:r*(1+t*(3/(2-o)-1)),b:r*(1-t)};break;case 2:s={r:r*(1-t),g:r*(1+t*(3/(2-o)-1)),b:r*(1+t*(3*(1-o)/(2-o)-1))};break;case 3:s={r:r*(1-t),g:r*(1+t*(3*(1-o)/(2-o)-1)),b:r*(1+t*(3/(2-o)-1))};break;case 4:s={r:r*(1+t*(3*(1-o)/(2-o)-1)),g:r*(1-t),b:r*(1+t*(3/(2-o)-1))};break;case 5:s={r:r*(1+t*(3/(2-o)-1)),g:r*(1-t),b:r*(1+t*(3*(1-o)/(2-o)-1))};break;default:s={r:r*(1-t),g:r*(1-t),b:r*(1-t)}}return s.mode="rgb",void 0!==i&&(s.alpha=i),s}},parse:["--hsi"],serialize:"--hsi",fromMode:{rgb:function({r:e,g:t,b:r,alpha:i}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s=Math.max(e,t,r),o=Math.min(e,t,r),a={mode:"hsi",s:e+t+r===0?0:1-3*o/(e+t+r),i:(e+t+r)/3};return s-o!=0&&(a.h=60*(s===e?(t-r)/(s-o)+6*(t<r):s===t?(r-e)/(s-o)+2:(e-t)/(s-o)+4)),void 0!==i&&(a.alpha=i),a}},channels:["h","s","i","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:Vt,fixup:tr},s:Vt,i:Vt,alpha:{use:Vt,fixup:Lt}},difference:{h:lr},average:{h:hr}};const Vr=new RegExp(`^hsla?\\(\\s*${mt}${pt}${ut}${pt}${ut}\\s*(?:,\\s*${dt}\\s*)?\\)$`);const Gr={mode:"hsl",toMode:{rgb:function({h:e,s:t,l:r,alpha:i}){e=er(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let s,o=r+t*(r<.5?r:1-r),a=o-2*(o-r)*Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:s={r:o,g:a,b:2*r-o};break;case 1:s={r:a,g:o,b:2*r-o};break;case 2:s={r:2*r-o,g:o,b:a};break;case 3:s={r:2*r-o,g:a,b:o};break;case 4:s={r:a,g:2*r-o,b:o};break;case 5:s={r:o,g:2*r-o,b:a};break;default:s={r:2*r-o,g:2*r-o,b:2*r-o}}return s.mode="rgb",void 0!==i&&(s.alpha=i),s}},fromMode:{rgb:function({r:e,g:t,b:r,alpha:i}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s=Math.max(e,t,r),o=Math.min(e,t,r),a={mode:"hsl",s:s===o?0:(s-o)/(1-Math.abs(s+o-1)),l:.5*(s+o)};return s-o!=0&&(a.h=60*(s===e?(t-r)/(s-o)+6*(t<r):s===t?(r-e)/(s-o)+2:(e-t)/(s-o)+4)),void 0!==i&&(a.alpha=i),a}},channels:["h","s","l","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(e,t){if(!t||"hsl"!==t[0]&&"hsla"!==t[0])return;const r={mode:"hsl"},[,i,s,o,a]=t;if(i.type!==At.None){if(i.type===At.Percentage)return;r.h=i.value}if(s.type!==At.None){if(s.type===At.Hue)return;r.s=s.value/100}if(o.type!==At.None){if(o.type===At.Hue)return;r.l=o.value/100}return a.type!==At.None&&(r.alpha=Math.min(1,Math.max(0,a.type===At.Number?a.value:a.value/100))),r},e=>{let t=e.match(Vr);if(!t)return;let r={mode:"hsl"};return void 0!==t[3]?r.h=+t[3]:void 0!==t[1]&&void 0!==t[2]&&(r.h=((e,t)=>{switch(t){case"deg":return+e;case"rad":return e/Math.PI*180;case"grad":return e/10*9;case"turn":return 360*e}})(t[1],t[2])),void 0!==t[4]&&(r.s=Math.min(Math.max(0,t[4]/100),1)),void 0!==t[5]&&(r.l=Math.min(Math.max(0,t[5]/100),1)),void 0!==t[6]?r.alpha=Math.max(0,Math.min(1,t[6]/100)):void 0!==t[7]&&(r.alpha=Math.max(0,Math.min(1,+t[7]))),r}],serialize:e=>`hsl(${void 0!==e.h?e.h:"none"} ${void 0!==e.s?100*e.s+"%":"none"} ${void 0!==e.l?100*e.l+"%":"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:Vt,fixup:tr},s:Vt,l:Vt,alpha:{use:Vt,fixup:Lt}},difference:{h:lr},average:{h:hr}};function Lr({h:e,s:t,v:r,alpha:i}){e=er(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let s,o=Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:s={r:r,g:r*(1-t*o),b:r*(1-t)};break;case 1:s={r:r*(1-t*o),g:r,b:r*(1-t)};break;case 2:s={r:r*(1-t),g:r,b:r*(1-t*o)};break;case 3:s={r:r*(1-t),g:r*(1-t*o),b:r};break;case 4:s={r:r*(1-t*o),g:r*(1-t),b:r};break;case 5:s={r:r,g:r*(1-t),b:r*(1-t*o)};break;default:s={r:r*(1-t),g:r*(1-t),b:r*(1-t)}}return s.mode="rgb",void 0!==i&&(s.alpha=i),s}function Ur({r:e,g:t,b:r,alpha:i}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s=Math.max(e,t,r),o=Math.min(e,t,r),a={mode:"hsv",s:0===s?0:1-o/s,v:s};return s-o!=0&&(a.h=60*(s===e?(t-r)/(s-o)+6*(t<r):s===t?(r-e)/(s-o)+2:(e-t)/(s-o)+4)),void 0!==i&&(a.alpha=i),a}const qr={mode:"hsv",toMode:{rgb:Lr},parse:["--hsv"],serialize:"--hsv",fromMode:{rgb:Ur},channels:["h","s","v","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:Vt,fixup:tr},s:Vt,v:Vt,alpha:{use:Vt,fixup:Lt}},difference:{h:lr},average:{h:hr}};const Hr={mode:"hwb",toMode:{rgb:function({h:e,w:t,b:r,alpha:i}){if(void 0===t&&(t=0),void 0===r&&(r=0),t+r>1){let e=t+r;t/=e,r/=e}return Lr({h:e,s:1===r?1:1-t/(1-r),v:1-r,alpha:i})}},fromMode:{rgb:function(e){let t=Ur(e);if(void 0===t)return;let r=void 0!==t.s?t.s:0,i=void 0!==t.v?t.v:0,s={mode:"hwb",w:(1-r)*i,b:1-i};return void 0!==t.h&&(s.h=t.h),void 0!==t.alpha&&(s.alpha=t.alpha),s}},channels:["h","w","b","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(e,t){if(!t||"hwb"!==t[0])return;const r={mode:"hwb"},[,i,s,o,a]=t;if(i.type!==At.None){if(i.type===At.Percentage)return;r.h=i.value}if(s.type!==At.None){if(s.type===At.Hue)return;r.w=s.value/100}if(o.type!==At.None){if(o.type===At.Hue)return;r.b=o.value/100}return a.type!==At.None&&(r.alpha=Math.min(1,Math.max(0,a.type===At.Number?a.value:a.value/100))),r}],serialize:e=>`hwb(${void 0!==e.h?e.h:"none"} ${void 0!==e.w?100*e.w+"%":"none"} ${void 0!==e.b?100*e.b+"%":"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:Vt,fixup:tr},w:Vt,b:Vt,alpha:{use:Vt,fixup:Lt}},difference:{h:(e,t)=>{if(void 0===e.h||void 0===t.h)return 0;let r=er(e.h),i=er(t.h);return Math.abs(i-r)>180?r-(i-360*Math.sign(i-r)):i-r}},average:{h:hr}},Fr=.1593017578125,Br=78.84375,Wr=.8359375,Jr=18.8515625,Kr=18.6875;function Xr(e){if(e<0)return 0;const t=Math.pow(e,1/Br);return 1e4*Math.pow(Math.max(0,t-Wr)/(Jr-Kr*t),1/Fr)}function Yr(e){if(e<0)return 0;const t=Math.pow(e/1e4,Fr);return Math.pow((Wr+Jr*t)/(1+Kr*t),Br)}const Zr=e=>Math.max(e/203,0),Qr=({i:e,t:t,p:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const s=Xr(e+.008609037037932761*t+.11102962500302593*r),o=Xr(e-.00860903703793275*t-.11102962500302599*r),a=Xr(e+.5600313357106791*t-.32062717498731885*r),n={mode:"xyz65",x:Zr(2.070152218389422*s-1.3263473389671556*o+.2066510476294051*a),y:Zr(.3647385209748074*s+.680566024947227*o-.0453045459220346*a),z:Zr(-.049747207535812*s-.0492609666966138*o+1.1880659249923042*a)};return void 0!==i&&(n.alpha=i),n},ei=(e=0)=>Math.max(203*e,0),ti=({x:e,y:t,z:r,alpha:i})=>{const s=ei(e),o=ei(t),a=ei(r),n=Yr(.3592832590121217*s+.6976051147779502*o-.0358915932320289*a),l=Yr(-.1920808463704995*s+1.1004767970374323*o+.0753748658519118*a),c=Yr(.0070797844607477*s+.0748396662186366*o+.8433265453898765*a),h={mode:"itp",i:.5*n+.5*l,t:1.61376953125*n-3.323486328125*l+1.709716796875*c,p:4.378173828125*n-4.24560546875*l-.132568359375*c};return void 0!==i&&(h.alpha=i),h},ri={mode:"itp",channels:["i","t","p","alpha"],parse:["--ictcp"],serialize:"--ictcp",toMode:{xyz65:Qr,rgb:e=>Zt(Qr(e))},fromMode:{xyz65:ti,rgb:e=>ti(Kt(e))},ranges:{i:[0,.581],t:[-.369,.272],p:[-.164,.331]},interpolate:{i:Vt,t:Vt,p:Vt,alpha:{use:Vt,fixup:Lt}}},ii=e=>{if(e<0)return 0;let t=Math.pow(e/1e4,Fr);return Math.pow((Wr+Jr*t)/(1+Kr*t),134.03437499999998)},si=(e=0)=>Math.max(203*e,0),oi=({x:e,y:t,z:r,alpha:i})=>{e=si(e),t=si(t);let s=1.15*e-.15*(r=si(r)),o=.66*t+.34*e,a=ii(.41478972*s+.579999*o+.014648*r),n=ii(-.20151*s+1.120649*o+.0531008*r),l=ii(-.0166008*s+.2648*o+.6684799*r),c=(a+n)/2,h={mode:"jab",j:.44*c/(1-.56*c)-16295499532821565e-27,a:3.524*a-4.066708*n+.542708*l,b:.199076*a+1.096799*n-1.295875*l};return void 0!==i&&(h.alpha=i),h},ai=16295499532821565e-27,ni=e=>{if(e<0)return 0;let t=Math.pow(e,.007460772656268216);return 1e4*Math.pow((Wr-t)/(Kr*t-Jr),1/Fr)},li=e=>e/203,ci=({j:e,a:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s=(e+ai)/(.44+.56*(e+ai)),o=ni(s+.13860504*t+.058047316*r),a=ni(s-.13860504*t-.058047316*r),n=ni(s-.096019242*t-.8118919*r),l={mode:"xyz65",x:li(1.661373024652174*o-.914523081304348*a+.23136208173913045*n),y:li(-.3250758611844533*o+1.571847026732543*a-.21825383453227928*n),z:li(-.090982811*o-.31272829*a+1.5227666*n)};return void 0!==i&&(l.alpha=i),l},hi=e=>{let t=oi(Kt(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},ui=e=>Zt(ci(e)),di={mode:"jab",channels:["j","a","b","alpha"],parse:["--jzazbz"],serialize:"--jzazbz",fromMode:{rgb:hi,xyz65:oi},toMode:{rgb:ui,xyz65:ci},ranges:{j:[0,.222],a:[-.109,.129],b:[-.185,.134]},interpolate:{j:Vt,a:Vt,b:Vt,alpha:{use:Vt,fixup:Lt}}},mi=({j:e,a:t,b:r,alpha:i})=>{void 0===t&&(t=0),void 0===r&&(r=0);let s=Math.sqrt(t*t+r*r),o={mode:"jch",j:e,c:s};return s&&(o.h=er(180*Math.atan2(r,t)/Math.PI)),void 0!==i&&(o.alpha=i),o},pi=({j:e,c:t,h:r,alpha:i})=>{void 0===r&&(r=0);let s={mode:"jab",j:e,a:t?t*Math.cos(r/180*Math.PI):0,b:t?t*Math.sin(r/180*Math.PI):0};return void 0!==i&&(s.alpha=i),s},gi={mode:"jch",parse:["--jzczhz"],serialize:"--jzczhz",toMode:{jab:pi,rgb:e=>ui(pi(e))},fromMode:{rgb:e=>mi(hi(e)),jab:mi},channels:["j","c","h","alpha"],ranges:{j:[0,.221],c:[0,.19],h:[0,360]},interpolate:{h:{use:Vt,fixup:tr},c:Vt,j:Vt,alpha:{use:Vt,fixup:Lt}},difference:{h:cr},average:{h:hr}},fi=Math.pow(29,3)/Math.pow(3,3),yi=Math.pow(6,3)/Math.pow(29,3);let bi=e=>Math.pow(e,3)>yi?Math.pow(e,3):(116*e-16)/fi;const vi=({l:e,a:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s=(e+16)/116,o=s-r/200,a={mode:"xyz50",x:bi(t/500+s)*fr,y:bi(s)*yr,z:bi(o)*br};return void 0!==i&&(a.alpha=i),a},_i=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s=Yt({r:3.1341359569958707*e-1.6173863321612538*t-.4906619460083532*r,g:-.978795502912089*e+1.916254567259524*t+.03344273116131949*r,b:.07195537988411677*e-.2289768264158322*t+1.405386058324125*r});return void 0!==i&&(s.alpha=i),s},wi=e=>_i(vi(e)),xi=e=>{let{r:t,g:r,b:i,alpha:s}=Jt(e),o={mode:"xyz50",x:.436065742824811*t+.3851514688337912*r+.14307845442264197*i,y:.22249319175623702*t+.7168870538238823*r+.06061979053616537*i,z:.013923904500943465*t+.09708128566574634*r+.7140993584005155*i};return void 0!==s&&(o.alpha=s),o},$i=e=>e>yi?Math.cbrt(e):(fi*e+16)/116,ki=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s=$i(e/fr),o=$i(t/yr),a={mode:"lab",l:116*o-16,a:500*(s-o),b:200*(o-$i(r/br))};return void 0!==i&&(a.alpha=i),a},Si=e=>{let t=ki(xi(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t};const Mi={mode:"lab",toMode:{xyz50:vi,rgb:wi},fromMode:{xyz50:ki,rgb:Si},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-125,125],b:[-125,125]},parse:[function(e,t){if(!t||"lab"!==t[0])return;const r={mode:"lab"},[,i,s,o,a]=t;return i.type!==At.Hue&&s.type!==At.Hue&&o.type!==At.Hue?(i.type!==At.None&&(r.l=Math.min(Math.max(0,i.value),100)),s.type!==At.None&&(r.a=s.type===At.Number?s.value:125*s.value/100),o.type!==At.None&&(r.b=o.type===At.Number?o.value:125*o.value/100),a.type!==At.None&&(r.alpha=Math.min(1,Math.max(0,a.type===At.Number?a.value:a.value/100))),r):void 0}],serialize:e=>`lab(${void 0!==e.l?e.l:"none"} ${void 0!==e.a?e.a:"none"} ${void 0!==e.b?e.b:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{l:Vt,a:Vt,b:Vt,alpha:{use:Vt,fixup:Lt}}},Ai={...Mi,mode:"lab65",parse:["--lab-d65"],serialize:"--lab-d65",toMode:{xyz65:$r,rgb:kr},fromMode:{xyz65:Mr,rgb:Ar},ranges:{l:[0,100],a:[-125,125],b:[-125,125]}};const Ci={mode:"lch",toMode:{lab:mr,rgb:e=>wi(mr(e))},fromMode:{rgb:e=>dr(Si(e)),lab:dr},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,150],h:[0,360]},parse:[function(e,t){if(!t||"lch"!==t[0])return;const r={mode:"lch"},[,i,s,o,a]=t;if(i.type!==At.None){if(i.type===At.Hue)return;r.l=Math.min(Math.max(0,i.value),100)}if(s.type!==At.None&&(r.c=Math.max(0,s.type===At.Number?s.value:150*s.value/100)),o.type!==At.None){if(o.type===At.Percentage)return;r.h=o.value}return a.type!==At.None&&(r.alpha=Math.min(1,Math.max(0,a.type===At.Number?a.value:a.value/100))),r}],serialize:e=>`lch(${void 0!==e.l?e.l:"none"} ${void 0!==e.c?e.c:"none"} ${void 0!==e.h?e.h:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:Vt,fixup:tr},c:Vt,l:Vt,alpha:{use:Vt,fixup:Lt}},difference:{h:cr},average:{h:hr}},Ei={...Ci,mode:"lch65",parse:["--lch-d65"],serialize:"--lch-d65",toMode:{lab65:e=>mr(e,"lab65"),rgb:e=>kr(mr(e,"lab65"))},fromMode:{rgb:e=>dr(Ar(e),"lch65"),lab65:e=>dr(e,"lch65")},ranges:{l:[0,100],c:[0,150],h:[0,360]}},Ni=({l:e,u:t,v:r,alpha:i})=>{void 0===t&&(t=0),void 0===r&&(r=0);let s=Math.sqrt(t*t+r*r),o={mode:"lchuv",l:e,c:s};return s&&(o.h=er(180*Math.atan2(r,t)/Math.PI)),void 0!==i&&(o.alpha=i),o},Ti=({l:e,c:t,h:r,alpha:i})=>{void 0===r&&(r=0);let s={mode:"luv",l:e,u:t?t*Math.cos(r/180*Math.PI):0,v:t?t*Math.sin(r/180*Math.PI):0};return void 0!==i&&(s.alpha=i),s},Ii=(e,t,r)=>4*e/(e+15*t+3*r),zi=(e,t,r)=>9*t/(e+15*t+3*r),Pi=Ii(fr,yr,br),Oi=zi(fr,yr,br),ji=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s=(o=t/yr)<=yi?fi*o:116*Math.cbrt(o)-16;var o;let a=Ii(e,t,r),n=zi(e,t,r);isFinite(a)&&isFinite(n)?(a=13*s*(a-Pi),n=13*s*(n-Oi)):s=a=n=0;let l={mode:"luv",l:s,u:a,v:n};return void 0!==i&&(l.alpha=i),l},Ri=((e,t,r)=>4*e/(e+15*t+3*r))(fr,yr,br),Di=((e,t,r)=>9*t/(e+15*t+3*r))(fr,yr,br),Vi=({l:e,u:t,v:r,alpha:i})=>{if(void 0===e&&(e=0),0===e)return{mode:"xyz50",x:0,y:0,z:0};void 0===t&&(t=0),void 0===r&&(r=0);let s=t/(13*e)+Ri,o=r/(13*e)+Di,a=yr*(e<=8?e/fi:Math.pow((e+16)/116,3)),n={mode:"xyz50",x:a*(9*s)/(4*o),y:a,z:a*(12-3*s-20*o)/(4*o)};return void 0!==i&&(n.alpha=i),n},Gi={mode:"lchuv",toMode:{luv:Ti,rgb:e=>_i(Vi(Ti(e)))},fromMode:{rgb:e=>Ni(ji(xi(e))),luv:Ni},channels:["l","c","h","alpha"],parse:["--lchuv"],serialize:"--lchuv",ranges:{l:[0,100],c:[0,176.956],h:[0,360]},interpolate:{h:{use:Vt,fixup:tr},c:Vt,l:Vt,alpha:{use:Vt,fixup:Lt}},difference:{h:cr},average:{h:hr}},Li={...Ut,mode:"lrgb",toMode:{rgb:Yt},fromMode:{rgb:Jt},parse:["srgb-linear"],serialize:"srgb-linear"},Ui={mode:"luv",toMode:{xyz50:Vi,rgb:e=>_i(Vi(e))},fromMode:{xyz50:ji,rgb:e=>ji(xi(e))},channels:["l","u","v","alpha"],parse:["--luv"],serialize:"--luv",ranges:{l:[0,100],u:[-84.936,175.042],v:[-125.882,87.243]},interpolate:{l:Vt,u:Vt,v:Vt,alpha:{use:Vt,fixup:Lt}}},qi=({r:e,g:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s=Math.cbrt(.412221469470763*e+.5363325372617348*t+.0514459932675022*r),o=Math.cbrt(.2119034958178252*e+.6806995506452344*t+.1073969535369406*r),a=Math.cbrt(.0883024591900564*e+.2817188391361215*t+.6299787016738222*r),n={mode:"oklab",l:.210454268309314*s+.7936177747023054*o-.0040720430116193*a,a:1.9779985324311684*s-2.42859224204858*o+.450593709617411*a,b:.0259040424655478*s+.7827717124575296*o-.8086757549230774*a};return void 0!==i&&(n.alpha=i),n},Hi=e=>{let t=qi(Jt(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},Fi=({l:e,a:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s=Math.pow(e+.3963377773761749*t+.2158037573099136*r,3),o=Math.pow(e-.1055613458156586*t-.0638541728258133*r,3),a=Math.pow(e-.0894841775298119*t-1.2914855480194092*r,3),n={mode:"lrgb",r:4.076741636075957*s-3.3077115392580616*o+.2309699031821044*a,g:-1.2684379732850317*s+2.6097573492876887*o-.3413193760026573*a,b:-.0041960761386756*s-.7034186179359362*o+1.7076146940746117*a};return void 0!==i&&(n.alpha=i),n},Bi=e=>Yt(Fi(e));function Wi(e){const t=.206,r=1.206/1.03;return.5*(r*e-t+Math.sqrt((r*e-t)*(r*e-t)+.12*r*e))}function Ji(e){return(e*e+.206*e)/(1.206/1.03*(e+.03))}function Ki(e,t){let r=function(e,t){let r,i,s,o,a,n,l,c;-1.88170328*e-.80936493*t>1?(r=1.19086277,i=1.76576728,s=.59662641,o=.75515197,a=.56771245,n=4.0767416621,l=-3.3077115913,c=.2309699292):1.81444104*e-1.19445276*t>1?(r=.73956515,i=-.45954404,s=.08285427,o=.1254107,a=.14503204,n=-1.2684380046,l=2.6097574011,c=-.3413193965):(r=1.35733652,i=-.00915799,s=-1.1513021,o=-.50559606,a=.00692167,n=-.0041960863,l=-.7034186147,c=1.707614701);let h=r+i*e+s*t+o*e*e+a*e*t,u=.3963377774*e+.2158037573*t,d=-.1055613458*e-.0638541728*t,m=-.0894841775*e-1.291485548*t;{let e=1+h*u,t=1+h*d,r=1+h*m,i=n*(e*e*e)+l*(t*t*t)+c*(r*r*r),s=n*(3*u*e*e)+l*(3*d*t*t)+c*(3*m*r*r);h-=i*s/(s*s-.5*i*(n*(6*u*u*e)+l*(6*d*d*t)+c*(6*m*m*r)))}return h}(e,t),i=Fi({l:1,a:r*e,b:r*t}),s=Math.cbrt(1/Math.max(i.r,i.g,i.b));return[s,s*r]}function Xi(e,t,r=null){r||(r=Ki(e,t));let i=r[0],s=r[1];return[s/i,s/(1-i)]}function Yi(e,t,r){let i=Ki(t,r),s=function(e,t,r,i,s,o=null){let a;if(o||(o=Ki(e,t)),(r-s)*o[1]-(o[0]-s)*i<=0)a=o[1]*s/(i*o[0]+o[1]*(s-r));else{a=o[1]*(s-1)/(i*(o[0]-1)+o[1]*(s-r));{let o=r-s,n=.3963377774*e+.2158037573*t,l=-.1055613458*e-.0638541728*t,c=-.0894841775*e-1.291485548*t,h=o+i*n,u=o+i*l,d=o+i*c;{let e=s*(1-a)+a*r,t=a*i,o=e+t*n,m=e+t*l,p=e+t*c,g=o*o*o,f=m*m*m,y=p*p*p,b=3*h*o*o,v=3*u*m*m,_=3*d*p*p,w=6*h*h*o,x=6*u*u*m,$=6*d*d*p,k=4.0767416621*g-3.3077115913*f+.2309699292*y-1,S=4.0767416621*b-3.3077115913*v+.2309699292*_,M=S/(S*S-.5*k*(4.0767416621*w-3.3077115913*x+.2309699292*$)),A=-k*M,C=-1.2684380046*g+2.6097574011*f-.3413193965*y-1,E=-1.2684380046*b+2.6097574011*v-.3413193965*_,N=E/(E*E-.5*C*(-1.2684380046*w+2.6097574011*x-.3413193965*$)),T=-C*N,I=-.0041960863*g-.7034186147*f+1.707614701*y-1,z=-.0041960863*b-.7034186147*v+1.707614701*_,P=z/(z*z-.5*I*(-.0041960863*w-.7034186147*x+1.707614701*$)),O=-I*P;A=M>=0?A:1e6,T=N>=0?T:1e6,O=P>=0?O:1e6,a+=Math.min(A,Math.min(T,O))}}}return a}(t,r,e,1,e,i),o=Xi(t,r,i),a=e*(.11516993+1/(7.4477897+4.1590124*r+t*(1.75198401*r-2.19557347+t*(-2.13704948-10.02301043*r+t*(5.38770819*r-4.24894561+4.69891013*t))))),n=(1-e)*(.11239642+1/(1.6132032-.68124379*r+t*(.40370612+.90148123*r+t*(.6122399*r-.27087943+t*(.00299215-.45399568*r-.14661872*t))))),l=.9*(s/Math.min(e*o[0],(1-e)*o[1]))*Math.sqrt(Math.sqrt(1/(1/(a*a*a*a)+1/(n*n*n*n))));return a=.4*e,n=.8*(1-e),[Math.sqrt(1/(1/(a*a)+1/(n*n))),l,s]}function Zi(e){const t=void 0!==e.l?e.l:0,r=void 0!==e.a?e.a:0,i=void 0!==e.b?e.b:0,s={mode:"okhsl",l:Wi(t)};void 0!==e.alpha&&(s.alpha=e.alpha);let o=Math.sqrt(r*r+i*i);if(!o)return s.s=0,s;let a,[n,l,c]=Yi(t,r/o,i/o);if(o<l){let e=0,t=.8*n;a=.8*((o-e)/(t+(1-t/l)*(o-e)))}else{let e=.2*l*l*1.25*1.25/n;a=.8+.2*((o-l)/(e+(1-e/(c-l))*(o-l)))}return a&&(s.s=a,s.h=er(180*Math.atan2(i,r)/Math.PI)),s}function Qi(e){let t=void 0!==e.h?e.h:0,r=void 0!==e.s?e.s:0,i=void 0!==e.l?e.l:0;const s={mode:"oklab",l:Ji(i)};if(void 0!==e.alpha&&(s.alpha=e.alpha),!r||1===i)return s.a=s.b=0,s;let o,a,n,l,c=Math.cos(t/180*Math.PI),h=Math.sin(t/180*Math.PI),[u,d,m]=Yi(s.l,c,h);r<.8?(o=1.25*r,a=0,n=.8*u,l=1-n/d):(o=5*(r-.8),a=d,n=.2*d*d*1.25*1.25/u,l=1-n/(m-d));let p=a+o*n/(1-l*o);return s.a=p*c,s.b=p*h,s}const es={...Gr,mode:"okhsl",channels:["h","s","l","alpha"],parse:["--okhsl"],serialize:"--okhsl",fromMode:{oklab:Zi,rgb:e=>Zi(Hi(e))},toMode:{oklab:Qi,rgb:e=>Bi(Qi(e))}};function ts(e){let t=void 0!==e.l?e.l:0,r=void 0!==e.a?e.a:0,i=void 0!==e.b?e.b:0,s=Math.sqrt(r*r+i*i),o=s?r/s:1,a=s?i/s:1,[n,l]=Xi(o,a),c=1-.5/n,h=l/(s+t*l),u=h*t,d=h*s,m=Ji(u),p=d*m/u,g=Fi({l:m,a:o*p,b:a*p}),f=Math.cbrt(1/Math.max(g.r,g.g,g.b,0));t/=f,s=s/f*Wi(t)/t,t=Wi(t);const y={mode:"okhsv",s:s?(.5+l)*d/(.5*l+l*c*d):0,v:t?t/u:0};return y.s&&(y.h=er(180*Math.atan2(i,r)/Math.PI)),void 0!==e.alpha&&(y.alpha=e.alpha),y}function rs(e){const t={mode:"oklab"};void 0!==e.alpha&&(t.alpha=e.alpha);const r=void 0!==e.h?e.h:0,i=void 0!==e.s?e.s:0,s=void 0!==e.v?e.v:0,o=Math.cos(r/180*Math.PI),a=Math.sin(r/180*Math.PI),[n,l]=Xi(o,a),c=.5,h=1-c/n,u=1-i*c/(c+l-l*h*i),d=i*l*c/(c+l-l*h*i),m=Ji(u),p=d*m/u,g=Fi({l:m,a:o*p,b:a*p}),f=Math.cbrt(1/Math.max(g.r,g.g,g.b,0)),y=Ji(s*u),b=d*y/u;return t.l=y*f,t.a=b*o*f,t.b=b*a*f,t}const is={...qr,mode:"okhsv",channels:["h","s","v","alpha"],parse:["--okhsv"],serialize:"--okhsv",fromMode:{oklab:ts,rgb:e=>ts(Hi(e))},toMode:{oklab:rs,rgb:e=>Bi(rs(e))}};const ss={...Mi,mode:"oklab",toMode:{lrgb:Fi,rgb:Bi},fromMode:{lrgb:qi,rgb:Hi},ranges:{l:[0,1],a:[-.4,.4],b:[-.4,.4]},parse:[function(e,t){if(!t||"oklab"!==t[0])return;const r={mode:"oklab"},[,i,s,o,a]=t;return i.type!==At.Hue&&s.type!==At.Hue&&o.type!==At.Hue?(i.type!==At.None&&(r.l=Math.min(Math.max(0,i.type===At.Number?i.value:i.value/100),1)),s.type!==At.None&&(r.a=s.type===At.Number?s.value:.4*s.value/100),o.type!==At.None&&(r.b=o.type===At.Number?o.value:.4*o.value/100),a.type!==At.None&&(r.alpha=Math.min(1,Math.max(0,a.type===At.Number?a.value:a.value/100))),r):void 0}],serialize:e=>`oklab(${void 0!==e.l?e.l:"none"} ${void 0!==e.a?e.a:"none"} ${void 0!==e.b?e.b:"none"}${e.alpha<1?` / ${e.alpha}`:""})`};const os={...Ci,mode:"oklch",toMode:{oklab:e=>mr(e,"oklab"),rgb:e=>Bi(mr(e,"oklab"))},fromMode:{rgb:e=>dr(Hi(e),"oklch"),oklab:e=>dr(e,"oklch")},parse:[function(e,t){if(!t||"oklch"!==t[0])return;const r={mode:"oklch"},[,i,s,o,a]=t;if(i.type!==At.None){if(i.type===At.Hue)return;r.l=Math.min(Math.max(0,i.type===At.Number?i.value:i.value/100),1)}if(s.type!==At.None&&(r.c=Math.max(0,s.type===At.Number?s.value:.4*s.value/100)),o.type!==At.None){if(o.type===At.Percentage)return;r.h=o.value}return a.type!==At.None&&(r.alpha=Math.min(1,Math.max(0,a.type===At.Number?a.value:a.value/100))),r}],serialize:e=>`oklch(${void 0!==e.l?e.l:"none"} ${void 0!==e.c?e.c:"none"} ${void 0!==e.h?e.h:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,ranges:{l:[0,1],c:[0,.4],h:[0,360]}},as=e=>{let{r:t,g:r,b:i,alpha:s}=Jt(e),o={mode:"xyz65",x:.486570948648216*t+.265667693169093*r+.1982172852343625*i,y:.2289745640697487*t+.6917385218365062*r+.079286914093745*i,z:0*t+.0451133818589026*r+1.043944368900976*i};return void 0!==s&&(o.alpha=s),o},ns=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s=Yt({r:2.4934969119414263*e-.9313836179191242*t-.402710784450717*r,g:-.8294889695615749*e+1.7626640603183465*t+.0236246858419436*r,b:.0358458302437845*e-.0761723892680418*t+.9568845240076871*r},"p3");return void 0!==i&&(s.alpha=i),s},ls={...Ut,mode:"p3",parse:["display-p3"],serialize:"display-p3",fromMode:{rgb:e=>ns(Kt(e)),xyz65:ns},toMode:{rgb:e=>Zt(as(e)),xyz65:as}},cs=e=>{let t=Math.abs(e);return t>=1/512?Math.sign(e)*Math.pow(t,1/1.8):16*e},hs=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s={mode:"prophoto",r:cs(1.3457868816471585*e-.2555720873797946*t-.0511018649755453*r),g:cs(-.5446307051249019*e+1.5082477428451466*t+.0205274474364214*r),b:cs(0*e+0*t+1.2119675456389452*r)};return void 0!==i&&(s.alpha=i),s},us=(e=0)=>{let t=Math.abs(e);return t>=16/512?Math.sign(e)*Math.pow(t,1.8):e/16},ds=e=>{let t=us(e.r),r=us(e.g),i=us(e.b),s={mode:"xyz50",x:.7977666449006423*t+.1351812974005331*r+.0313477341283922*i,y:.2880748288194013*t+.7118352342418731*r+899369387256e-16*i,z:0*t+0*r+.8251046025104602*i};return void 0!==e.alpha&&(s.alpha=e.alpha),s},ms={...Ut,mode:"prophoto",parse:["prophoto-rgb"],serialize:"prophoto-rgb",fromMode:{xyz50:hs,rgb:e=>hs(xi(e))},toMode:{xyz50:ds,rgb:e=>_i(ds(e))}},ps=1.09929682680944,gs=e=>{const t=Math.abs(e);return t>.018053968510807?(Math.sign(e)||1)*(ps*Math.pow(t,.45)-(ps-1)):4.5*e},fs=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let s={mode:"rec2020",r:gs(1.7166511879712683*e-.3556707837763925*t-.2533662813736599*r),g:gs(-.6666843518324893*e+1.6164812366349395*t+.0157685458139111*r),b:gs(.0176398574453108*e-.0427706132578085*t+.9421031212354739*r)};return void 0!==i&&(s.alpha=i),s},ys=1.09929682680944,bs=(e=0)=>{let t=Math.abs(e);return t<.08124285829863151?e/4.5:(Math.sign(e)||1)*Math.pow((t+ys-1)/ys,1/.45)},vs=e=>{let t=bs(e.r),r=bs(e.g),i=bs(e.b),s={mode:"xyz65",x:.6369580483012911*t+.1446169035862083*r+.1688809751641721*i,y:.262700212011267*t+.6779980715188708*r+.059301716469862*i,z:0*t+.0280726930490874*r+1.0609850577107909*i};return void 0!==e.alpha&&(s.alpha=e.alpha),s},_s={...Ut,mode:"rec2020",fromMode:{xyz65:fs,rgb:e=>fs(Kt(e))},toMode:{xyz65:vs,rgb:e=>Zt(vs(e))},parse:["rec2020"],serialize:"rec2020"},ws=.0037930732552754493,xs=Math.cbrt(ws),$s=e=>Math.cbrt(e)-xs,ks=e=>Math.pow(e+xs,3),Ss={mode:"xyb",channels:["x","y","b","alpha"],parse:["--xyb"],serialize:"--xyb",toMode:{rgb:({x:e,y:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const s=ks(e+t)-ws,o=ks(t-e)-ws,a=ks(r+t)-ws,n=Yt({r:11.031566904639861*s-9.866943908131562*o-.16462299650829934*a,g:-3.2541473810744237*s+4.418770377582723*o-.16462299650829934*a,b:-3.6588512867136815*s+2.7129230459360922*o+1.9459282407775895*a});return void 0!==i&&(n.alpha=i),n}},fromMode:{rgb:e=>{const{r:t,g:r,b:i,alpha:s}=Jt(e),o=$s(.3*t+.622*r+.078*i+ws),a=$s(.23*t+.692*r+.078*i+ws),n={mode:"xyb",x:(o-a)/2,y:(o+a)/2,b:$s(.2434226892454782*t+.2047674442449682*r+.5518098665095535*i+ws)-(o+a)/2};return void 0!==s&&(n.alpha=s),n}},ranges:{x:[-.0154,.0281],y:[0,.8453],b:[-.2778,.388]},interpolate:{x:Vt,y:Vt,b:Vt,alpha:{use:Vt,fixup:Lt}}},Ms={mode:"xyz50",parse:["xyz-d50"],serialize:"xyz-d50",toMode:{rgb:_i,lab:ki},fromMode:{rgb:xi,lab:vi},channels:["x","y","z","alpha"],ranges:{x:[0,.964],y:[0,.999],z:[0,.825]},interpolate:{x:Vt,y:Vt,z:Vt,alpha:{use:Vt,fixup:Lt}}},As={mode:"xyz65",toMode:{rgb:Zt,xyz50:e=>{let{x:t,y:r,z:i,alpha:s}=e;void 0===t&&(t=0),void 0===r&&(r=0),void 0===i&&(i=0);let o={mode:"xyz50",x:1.0479298208405488*t+.0229467933410191*r-.0501922295431356*i,y:.0296278156881593*t+.990434484573249*r-.0170738250293851*i,z:-.0092430581525912*t+.0150551448965779*r+.7518742899580008*i};return void 0!==s&&(o.alpha=s),o}},fromMode:{rgb:Kt,xyz50:e=>{let{x:t,y:r,z:i,alpha:s}=e;void 0===t&&(t=0),void 0===r&&(r=0),void 0===i&&(i=0);let o={mode:"xyz65",x:.9554734527042182*t-.0230985368742614*r+.0632593086610217*i,y:-.0283697069632081*t+1.0099954580058226*r+.021041398966943*i,z:.0123140016883199*t-.0205076964334779*r+1.3303659366080753*i};return void 0!==s&&(o.alpha=s),o}},ranges:{x:[0,.95],y:[0,1],z:[0,1.088]},channels:["x","y","z","alpha"],parse:["xyz","xyz-d65"],serialize:"xyz-d65",interpolate:{x:Vt,y:Vt,z:Vt,alpha:{use:Vt,fixup:Lt}}},Cs={mode:"yiq",toMode:{rgb:({y:e,i:t,q:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const s={mode:"rgb",r:e+.95608445*t+.6208885*r,g:e-.27137664*t-.6486059*r,b:e-1.10561724*t+1.70250126*r};return void 0!==i&&(s.alpha=i),s}},fromMode:{rgb:({r:e,g:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const s={mode:"yiq",y:.29889531*e+.58662247*t+.11448223*r,i:.59597799*e-.2741761*t-.32180189*r,q:.21147017*e-.52261711*t+.31114694*r};return void 0!==i&&(s.alpha=i),s}},channels:["y","i","q","alpha"],parse:["--yiq"],serialize:"--yiq",ranges:{i:[-.595,.595],q:[-.522,.522]},interpolate:{y:Vt,i:Vt,q:Vt,alpha:{use:Vt,fixup:Lt}}};$t(Qt),$t(ur),$t(jr),$t(Rr),$t(Dr),$t(Gr),$t(qr),$t(Hr),$t(ri),$t(di),$t(gi),$t(Mi),$t(Ai),$t(Ci),$t(Ei),$t(Gi),$t(Li),$t(Ui),$t(es),$t(is),$t(ss),$t(os),$t(ls),$t(ms),$t(_s),$t(Ut),$t(Ss),$t(Ms),$t(As),$t(Cs);const Es=e=>{const t=Math.round(Math.min(Math.max(e,0),255)).toString(16);return 1===t.length?`0${t}`:t},Ns=e=>`#${Es(e[0])}${Es(e[1])}${Es(e[2])}`,Ts=e=>{const[t,r,i]=e,s=Math.max(t,r,i),o=s-Math.min(t,r,i),a=o&&(s===t?(r-i)/o:s===r?2+(i-t)/o:4+(t-r)/o);return[60*(a<0?a+6:a),s&&o/s,s]},Is=e=>{const[t,r,i]=e,s=e=>{const s=(e+t/60)%6;return i-i*r*Math.max(Math.min(s,4-s,1),0)};return[s(5),s(3),s(1)]},zs=e=>Is([e[0],e[1],255]),Ps=(e,t,r)=>Math.min(Math.max(e,t),r),Os=e=>{const t=e/100;return[Math.round(js(t)),Math.round(Rs(t)),Math.round(Ds(t))]},js=e=>{if(e<=66)return 255;return Ps(329.698727446*(e-60)**-.1332047592,0,255)},Rs=e=>{let t;return t=e<=66?99.4708025861*Math.log(e)-161.1195681661:288.1221695283*(e-60)**-.0755148492,Ps(t,0,255)},Ds=e=>{if(e>=66)return 255;if(e<=19)return 0;const t=138.5177312231*Math.log(e-10)-305.0447927307;return Ps(t,0,255)},Vs=(e,t)=>{const r=Math.max(...e),i=Math.max(...t);let s;return s=0===i?0:r/i,t.map((e=>Math.round(e*s)))},Gs=e=>0===e?1e6:Math.floor(1e6/e),Ls=(e,t,r)=>{const[i,s,o,a,n]=e,l=Gs(t??2700),c=Gs(r??6500),h=l-c;let u;try{u=n/(a+n)}catch(v){u=.5}const d=c+u*h,m=d?0===(p=d)?1e6:Math.floor(1e6/p):0;var p;const[g,f,y]=Os(m),b=Math.max(a,n)/255;return Vs([i,s,o,a,n],[i+g*b,s+f*b,o+y*b])};const Us=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater","weather"]),qs=(e,t)=>{if((void 0!==t?t:e?.state)===Ke)return"var(--state-unavailable-color)";const r=Bs(e,t);return r?(i=r,Array.isArray(i)?i.reverse().reduce(((e,t)=>`var(${t}${e?`, ${e}`:""})`),void 0):`var(${i})`):void 0;var i},Hs=(e,t,r)=>{const i=void 0!==r?r:t.state,s=function(e,t){const r=De(e.entity_id),i=void 0!==t?t:e?.state;if(["button","event","infrared","input_button","radio_frequency","scene"].includes(r))return i!==Ke;if(Xe(i))return!1;if("off"===i&&"alert"!==r)return!1;switch(r){case"alarm_control_panel":return"disarmed"!==i;case"alert":return"idle"!==i;case"cover":case"valve":return"closed"!==i;case"device_tracker":case"person":return"not_home"!==i;case"lawn_mower":return!["docked","paused"].includes(i);case"lock":return"locked"!==i;case"media_player":return"standby"!==i;case"vacuum":return!["idle","docked","paused"].includes(i);case"plant":return"problem"===i;case"group":return["on","home","open","locked","problem"].includes(i);case"timer":return"active"===i;case"camera":return"streaming"===i}return!0}(t,r);return Fs(e,t.attributes.device_class,i,s)},Fs=(e,t,r,i)=>{const s=[],o=((e,t="_")=>{const r="àáâäæãåāăąабçćčđďдèéêëēėęěеёэфğǵгḧхîïíīįìıİийкłлḿмñńǹňнôöòóœøōõőоṕпŕřрßśšşșсťțтûüùúūǘůűųувẃẍÿýыžźżз·",i=`aaaaaaaaaaabcccdddeeeeeeeeeeefggghhiiiiiiiiijkllmmnnnnnoooooooooopprrrsssssstttuuuuuuuuuuvwxyyyzzzz${t}`,s=new RegExp(r.split("").join("|"),"g"),o={"ж":"zh","х":"kh","ц":"ts","ч":"ch","ш":"sh","щ":"shch","ю":"iu","я":"ia"};let a;return""===e?a="":(a=e.toString().toLowerCase().replace(s,(e=>i.charAt(r.indexOf(e)))).replace(/[а-я]/g,(e=>o[e]||"")).replace(/(\d),(?=\d)/g,"$1").replace(/[^a-z0-9]+/g,t).replace(new RegExp(`(${t})\\1+`,"g"),"$1").replace(new RegExp(`^${t}+`),"").replace(new RegExp(`${t}+$`),""),""===a&&(a="unknown")),a})(r,"_"),a=i?"active":"inactive";return t&&s.push(`--state-${e}-${t}-${o}-color`),s.push(`--state-${e}-${o}-color`,`--state-${e}-${a}-color`,`--state-${a}-color`),s},Bs=(e,t)=>{const r=void 0!==t?t:e?.state,i=De(e.entity_id),s=e.attributes.device_class;if("sensor"===i&&"battery"===s){const e=(e=>{const t=Number(e);if(!isNaN(t))return t>=70?"--state-sensor-battery-high-color":t>=30?"--state-sensor-battery-medium-color":"--state-sensor-battery-low-color"})(r);if(e)return[e]}if("group"===i){const r=(e=>{const t=e.attributes.entity_id||[],r=[...new Set(t.map((e=>De(e))))];return 1===r.length?r[0]:void 0})(e);if(r&&Us.has(r))return Hs(r,e,t)}if(Us.has(i))return Hs(i,e,t)};var Ws;!function(e){e[e.TARGET_TEMPERATURE=1]="TARGET_TEMPERATURE",e[e.TARGET_TEMPERATURE_RANGE=2]="TARGET_TEMPERATURE_RANGE",e[e.TARGET_HUMIDITY=4]="TARGET_HUMIDITY",e[e.FAN_MODE=8]="FAN_MODE",e[e.PRESET_MODE=16]="PRESET_MODE",e[e.SWING_MODE=32]="SWING_MODE",e[e.AUX_HEAT=64]="AUX_HEAT",e[e.TURN_OFF=128]="TURN_OFF",e[e.TURN_ON=256]="TURN_ON",e[e.SWING_HORIZONTAL_MODE=512]="SWING_HORIZONTAL_MODE"}(Ws||(Ws={})),["auto","heat_cool","heat","cool","dry","fan_only","off"].reduce(((e,t,r)=>(e[t]=r,e)),{});const Js={cooling:"cool",defrosting:"heat",drying:"dry",fan:"fan_only",heating:"heat",idle:"off",off:"off",preheating:"heat"};class Ks{static{Ks.colorCache={},Ks.element=void 0,Ks.unresolvedColor=!1}static _prefixKeys(e){let t={};return Object.keys(e).forEach((r=>{const i=`--${r}`,s=String(e[r]);t[i]=`${s}`})),t}static processTheme(e){let t={},r={},i={},s={};const{modes:o,...a}=e;return o&&(r={...a,...o.dark},t={...a,...o.light}),i=Ks._prefixKeys(t),s=Ks._prefixKeys(r),{themeLight:i,themeDark:s}}static processPalette(e){let t={},r={},i={},s={},o={};return Object.values(e).forEach((e=>{const{modes:s,...o}=e;t={...t,...o},s&&(i={...i,...o,...s.dark},r={...r,...o,...s.light})})),s=Ks._prefixKeys(r),o=Ks._prefixKeys(i),{paletteLight:s,paletteDark:o}}static setElement(e){Ks.element=e}static calculateColor(e,t,r){const i=Object.keys(t).map((e=>Number(e))).sort(((e,t)=>e-t));let s,o,a;const n=i.length;if(e<=i[0])return t[i[0]];if(e>=i[n-1])return t[i[n-1]];for(let l=0;l<n-1;l++){const n=i[l],c=i[l+1];if(e>=n&&e<c){if([s,o]=[t[n],t[c]],!r)return s;a=Ks.calculateValueBetween(n,c,e);break}}return Ks.getGradientValue(s,o,a)}static calculateColor2(e,t,r,i,s){const o=Object.keys(t).map((e=>Number(e))).sort(((e,t)=>e-t));let a,n,l;const c=o.length;if(e<=o[0])return t[o[0]];if(e>=o[c-1])return t[o[c-1]];for(let h=0;h<c-1;h++){const c=o[h],u=o[h+1];if(e>=c&&e<u){if([a,n]=[t[c].styles[r][i],t[u].styles[r][i]],!s)return a;l=Ks.calculateValueBetween(c,u,e);break}}return Ks.getGradientValue(a,n,l)}static calculateValueBetween(e,t,r){return(Math.min(Math.max(r,e),t)-e)/(t-e)}static getLovelacePanel(){var e=window.document.querySelector("home-assistant");return(e=(e=(e=(e=(e=(e=e&&e.shadowRoot)&&e.querySelector("home-assistant-main"))&&e.shadowRoot)&&e.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"))&&e.shadowRoot||e)&&e.querySelector("ha-panel-lovelace"))||null}static calculateStrokeColor(e,t,r){const i=t?.colors??[];if(!i.length)return;const s=Number(e);if(!Number.isFinite(s))return i[0].color;if(s<=i[0].value)return i[0].color;const o=i[i.length-1];if(s>=o.value)return o.color;for(let a=0;a<i.length-1;a+=1){const e=i[a],t=i[a+1];if(s>=e.value&&s<t.value){if(!r)return e.color;const i=Ks.calculateValueBetween(e.value,t.value,s);return Ks.getGradientValue(e.color,t.color,i)}}return o.color}static resolveColorVariable(e){const t=this.element.style.getPropertyValue(e).trim();let r=t;if(t.startsWith("var(")){const e=t.replace(/^var\((--.*?)\)$/,"$1").trim();r=window.getComputedStyle(document.body).getPropertyValue(e).trim()}return r}static getColorVariable(e){const t=e.slice(4,-1).trim();let r=t,i="",s=0;for(let n=0;n<t.length;n+=1){const e=t[n];if("("===e)s+=1;else if(")"===e)s-=1;else if(","===e&&0===s){r=t.slice(0,n).trim(),i=t.slice(n+1).trim();break}}const o=getComputedStyle(Ks.element).getPropertyValue(r).trim();if(o)return o;this.lovelace||(this.lovelace=Ks.getLovelacePanel());const a=getComputedStyle(this.lovelace).getPropertyValue(r).trim();return a||i}static getLovelaceColorVariable(e){const t=e.substr(4,e.length-5);this.lovelace||(this.lovelace=Ks.getLovelacePanel());return window.getComputedStyle(this.lovelace).getPropertyValue(t)}static getGradientValue(e,t,r){const i=Ks.colorToRGBA(e),s=Ks.colorToRGBA(t);if(!i||!s)return void(Ks.unresolvedColor=!0);const o=1-r,a=r,n=Math.floor(i[0]*o+s[0]*a),l=Math.floor(i[1]*o+s[1]*a),c=Math.floor(i[2]*o+s[2]*a),h=Math.floor(i[3]*o+s[3]*a);return`#${Ks.padZero(n.toString(16))}${Ks.padZero(l.toString(16))}${Ks.padZero(c.toString(16))}${Ks.padZero(h.toString(16))}`}static padZero(e){return e.length<2&&(e=`0${e}`),e.substr(0,2)}static resolveColorVariableV0(e){let t=e;for(;"string"==typeof t&&t.trim().startsWith("var(");)t=Ks.getColorVariable(t).trim(),console.log("resolving color variable ",e,", to: ",t,"...");return t}static colorToRGBAChat(e){if(null==e)return[0,0,0,0];const t=Ks.colorCache[e];if(t)return t;let r=e;"string"==typeof r&&r.trim().startsWith("var(")&&(r=Ks.resolveColorVariable(r));const i=window.document.createElement("canvas");i.width=i.height=1;const s=i.getContext("2d");s.clearRect(0,0,1,1),s.fillStyle=r,s.fillRect(0,0,1,1);const o=[...s.getImageData(0,0,1,1).data];return Ks.colorCache[e]=o,o}static colorToRGBA(e){if(null==e)return[0,0,0,0];const t=Ks.colorCache[e];if(t)return t;let r=e;if("var"===e.substr(0,3).valueOf()){r=e;for(let t=0;t<10&&r.trim().startsWith("var(");t+=1)if(r=Ks.getColorVariable(r.trim()),!r)return Ks.unresolvedColor=!0,void(Ks.element?.dev?.debug_colors&&console.log("[horseshoe-colors] unresolved css var",{argColor:e}))}let i=Dt(r);if(!i){const t=window.document.createElement("span"),s="rgb(1, 2, 3)";t.style.color=s,t.style.color=r,Ks.element.appendChild(t);const o=window.getComputedStyle(t).color;if(t.remove(),o!==s&&(i=Dt(o)),!i)return Ks.unresolvedColor=!0,void(Ks.element?.dev?.debug_colors&&console.log("[horseshoe-colors] unparseable color",{argColor:e,resolvedColor:r,computedColor:o}))}const s=yt("rgb")(i),o=[Math.round(255*Math.min(Math.max(s.r,0),1)),Math.round(255*Math.min(Math.max(s.g,0),1)),Math.round(255*Math.min(Math.max(s.b,0),1)),Math.round(255*(s.alpha??1))];return Ks.colorCache[e]=o,o}static hslToRgb(e){const t=e.h/360,r=e.s/100,i=e.l/100;let s,o,a;if(0===r)s=o=a=i;else{function n(e,t,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?e+6*(t-e)*r:r<.5?t:r<2/3?e+(t-e)*(2/3-r)*6:e}const l=i<.5?i*(1+r):i+r-i*r,c=2*i-l;s=n(c,l,t+1/3),o=n(c,l,t),a=n(c,l,t-1/3)}return s*=255,o*=255,a*=255,{r:s,g:o,b:a}}static computeColor(e){if(e.attributes?.hvac_action){const t=e.attributes.hvac_action;return t in Js?qs(e,Js[t]):void 0}if(e.attributes?.rgb_color)return`rgb(${e.attributes.rgb_color.join(",")})`;const t=qs(e);return t||void 0}static getHaEntityIconStyle(e){const t=Ks.computeColor(e),r=(e=>{if(e.attributes.brightness&&"plant"!==De(e.entity_id))return`brightness(${(e.attributes.brightness+245)/5}%)`;return""})(e);return{color:t??"var(--state-icon-color)",fill:"currentColor",...r?{filter:r}:{}}}}const Xs=200,Ys=100,Zs=Xs;class Qs{static calculateValueBetween(e,t,r){return isNaN(r)?0:r?(Math.min(Math.max(r,e),t)-e)/(t-e):0}static calculateSvgCoordinate(e,t){return e/100*Xs+(t-Ys)}static calculateSvgDimension(e){return e/100*Xs}static getLovelace(){let e=window.document.querySelector("home-assistant");if(e=e&&e.shadowRoot,e=e&&e.querySelector("home-assistant-main"),e=e&&e.shadowRoot,e=e&&e.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"),e=e&&e.shadowRoot||e,e=e&&e.querySelector("ha-panel-lovelace"),e=e&&e.shadowRoot,e=e&&e.querySelector("hui-root"),e){console.log("getLoveLace, root",e,e.lovelace);const t=e.lovelace;return t.current_view=e.___curView,t}return null}}class eo{static mergeDeep(...e){const t=e=>e&&"object"==typeof e;return e.reduce(((e,r)=>(Object.keys(r).forEach((i=>{const s=e[i],o=r[i];Array.isArray(s)&&Array.isArray(o)?e[i]=s.concat(...o):t(s)&&t(o)?e[i]=this.mergeDeep(s,o):e[i]=o})),e)),{})}}const to={apparent_temperature:"mdi:thermometer",cloud_coverage:"mdi:weather-cloudy",dew_point:"mdi:thermometer-water",humidity:"mdi:water-percent",pressure:"mdi:gauge",temperature:"mdi:thermometer",uv_index:"mdi:sun-wireless",visibility:"mdi:weather-fog",wind_bearing:"mdi:weather-windy",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",precipitation_probability:"mdi:weather-pouring",condition_clear_night:"mdi:weather-night",condition_cloudy:"mdi:weather-cloudy",condition_fog:"mdi:weather-fog",condition_hail:"mdi:weather-hail",condition_lightning:"mdi:weather-lightning",condition_lightning_rainy:"mdi:weather-lightning-rainy",condition_partlycloudy:"mdi:weather-partly-cloudy",condition_pouring:"mdi:weather-pouring",condition_rainy:"mdi:weather-rainy",condition_snowy:"mdi:weather-snowy",condition_snowy_rainy:"mdi:weather-snowy-rainy",condition_sunny:"mdi:weather-sunny",condition_windy:"mdi:weather-windy",condition_windy_variant:"mdi:weather-windy-variant",condition_exceptional:"mdi:alert-circle-outline"},ro={enabled:!0,duration:2500,easing:"ease-out",debug:!1};function io(e,t,r,i={}){const s=Number(r.fromValue),o=Number(r.toValue),a=i.onUpdate,n=i.onComplete;if(!1===t.enabled)return a&&a(o),void(n&&n(o));!function(e){e.frame&&cancelAnimationFrame(e.frame),e.frame=void 0,e.startTime=void 0,e.animating=!1}(e),e.fromValue=s,e.toValue=o,e.startTime=void 0,e.animating=!0,t.debug&&console.log("[horseshoe animation] start",{fromValue:e.fromValue,toValue:e.toValue});const l=r=>{e.startTime||(e.startTime=r);const i=Number(t.duration??ro.duration),s=r-e.startTime,o=i<=0?1:Ps(s/i,0,1),c=function(e,t){return"linear"===t?e:"ease-in"===t?e**3:"ease-in-out"===t?e<.5?4*e**3:1-(-2*e+2)**3/2:1-(1-e)**3}(o,t.easing),h=e.fromValue+(e.toValue-e.fromValue)*c;a&&a(h),o<1?e.frame=requestAnimationFrame((e=>l(e))):(e.frame=void 0,e.startTime=void 0,e.animating=!1,n&&n(e.toValue),t.debug&&console.log("[horseshoe animation] end",{value:e.toValue}))};e.frame=requestAnimationFrame((e=>l(e)))}const so=Math.PI/180;class oo{constructor(e,t){this.x=e,this.y=t;const r=e.length;this.n=r;const i=new Array(r-1),s=new Array(r-1);for(let o=0;o<r-1;o+=1)i[o]=e[o+1]-e[o],s[o]=(t[o+1]-t[o])/i[o];this.c1s=new Array(r).fill(0),this.c1s[0]=s[0];for(let o=1;o<r-1;o+=1)this.c1s[o]=(s[o-1]+s[o])/2;this.c1s[r-1]=s[r-2];for(let o=0;o<r-1;o+=1)if(0===s[o])this.c1s[o]=0,this.c1s[o+1]=0;else{const e=this.c1s[o]/s[o],t=this.c1s[o+1]/s[o],r=Math.hypot(e,t);if(r>3){const i=3/r;this.c1s[o]=i*e*s[o],this.c1s[o+1]=i*t*s[o]}}this.c2s=new Array(r-1),this.c3s=new Array(r-1);for(let o=0;o<r-1;o+=1){const e=s[o],t=this.c1s[o+1],r=this.c1s[o];this.c2s[o]=(3*e-2*r-t)/i[o],this.c3s[o]=(r+t-2*e)/(i[o]*i[o])}}get(e){if(e<=this.x[0])return this.y[0];if(e>=this.x[this.n-1])return this.y[this.n-1];let t=0;for(let i=0;i<this.n-1;i+=1)if(e>=this.x[i]&&e<=this.x[i+1]){t=i;break}const r=e-this.x[t];return this.y[t]+this.c1s[t]*r+this.c2s[t]*r*r+this.c3s[t]*r*r*r}}class ao{constructor(e,t){this.x=e,this.y=t,this.n=e.length,this.m=new Array(this.n-1),this.t=new Array(this.n);const r=new Array(this.n-1),i=new Array(this.n-1);for(let s=0;s<this.n-1;s+=1)r[s]=e[s+1]-e[s],i[s]=t[s+1]-t[s],this.m[s]=i[s]/r[s];this.t[0]=.25*this.m[0],this.t[this.n-1]=.25*this.m[this.n-2];for(let s=1;s<this.n-1;s+=1)if(0===this.m[s-1]||0===this.m[s]||this.m[s-1]*this.m[s]<0)this.t[s]=0;else{const e=2*r[s]+r[s-1],t=r[s]+2*r[s-1];this.t[s]=(e+t)/(e/this.m[s-1]+t/this.m[s])}for(let s=0;s<this.n-1;s+=1)if(0===this.m[s])this.t[s]=0,this.t[s+1]=0;else{const e=this.t[s]/this.m[s],t=this.t[s+1]/this.m[s],r=e*e+t*t;if(r>9){const i=3/Math.sqrt(r);this.t[s]=i*e*this.m[s],this.t[s+1]=i*t*this.m[s]}}}get(e){if(e<=this.x[0])return this.y[0];if(e>=this.x[this.n-1])return this.y[this.n-1];let t=0;for(let c=0;c<this.n-1;c+=1)if(e>=this.x[c]&&e<=this.x[c+1]){t=c;break}const r=this.x[t+1]-this.x[t],i=(e-this.x[t])/r,s=i*i,o=s*i,a=o-2*s+i,n=-2*o+3*s,l=o-s;return(2*o-3*s+1)*this.y[t]+a*r*this.t[t]+n*this.y[t+1]+l*r*this.t[t+1]}}class no{constructor(e){if(this.type=e.type,this.min=Number(e.min),this.max=Number(e.max),this.points=no.buildPoints(e),"splineorg"!==this.type)if("spline"!==this.type){if("linear"!==this.type)throw new Error(`[V2 GaugeScale] Unsupported scale type: ${this.type}`)}else this.spline=new ao(this.points.map((e=>e.value)),this.points.map((e=>e.position)));else this.splineorg=new oo(this.points.map((e=>e.value)),this.points.map((e=>e.position)))}static buildPoints(e){if("splineorg"!==e.type&&"spline"!==e.type)return[{value:Number(e.min),position:0},{value:Number(e.max),position:1}];if(!e.spline?.anchors)throw new Error("[V2 GaugeScale] Missing horseshoe_scale.spline.anchors");const t=e.spline.anchors.map((e=>({value:Number(e.value),position:Number(e.position)}))).filter((e=>Number.isFinite(e.value)&&Number.isFinite(e.position))).sort(((e,t)=>e.value-t.value));if("spline"===e.type){const r=Number(e.min),i=Number(e.max),s=t.filter((e=>e.value>r&&e.value<i));return[{value:r,position:0},...s,{value:i,position:1}].filter((e=>Number.isFinite(e.value)&&Number.isFinite(e.position))).sort(((e,t)=>e.value-t.value))}return t}toRatio(e){const t=Number(e);return"splineorg"===this.type?Ps(this.splineorg.get(t),0,1):"spline"===this.type?Ps(this.spline.get(t),0,1):Ps((t-this.min)/(this.max-this.min),0,1)}}class lo{constructor(e,t){this.cx=e.svg.xpos,this.cy=e.svg.ypos,this.radius=e.svg.radius,this.tickmarksRadius=e.svg.tickmarks_radius,this.arcDegrees=e.arc_degrees,this.startAngle=e.start_angle,this.endAngle=this.startAngle+this.arcDegrees,this.rotation=Number(e.rotate??0),this.flip=e.flip??"none",this.groupConfig=e.group_config,this.barMode=e.bar_mode,this.zeroRatio=e.zero_ratio,this.zeroAngle=this.ratioToAngle(this.zeroRatio),this.scale=t}getTransformContext(){return{rotation:this.rotation,flipX:"x"===this.flip||"both"===this.flip,flipY:"y"===this.flip||"both"===this.flip}}getRotateTransform(){return this.rotation?`rotate(${this.rotation} ${this.cx} ${this.cy})`:""}getScaleTransform(){const e=this.getTransformContext();if(!e.flipX&&!e.flipY)return"";const t=e.flipX?-1:1,r=e.flipY?-1:1;return`translate(${this.cx} ${this.cy}) scale(${t} ${r}) translate(${-this.cx} ${-this.cy})`}getGroupRotateTransform(){const e=Number(this.groupConfig?.rotate??this.groupConfig?.rotation??0);return e?`rotate(${e} ${this.groupConfig.svg.xpos} ${this.groupConfig.svg.ypos})`:""}getGroupScaleTransform(){if(!this.groupConfig?.scale)return"";const e=this.groupConfig.scale.x??this.groupConfig.scale,t=this.groupConfig.scale.y??this.groupConfig.scale;return`translate(${this.groupConfig.svg.xpos} ${this.groupConfig.svg.ypos}) scale(${e} ${t}) translate(${-this.groupConfig.svg.xpos} ${-this.groupConfig.svg.ypos})`}getGroupTransform(){return[this.getGroupRotateTransform(),this.getGroupScaleTransform(),this.getRotateTransform(),this.getScaleTransform()].filter(Boolean).join(" ")}getInverseGroupTransform(){const e=this.getTransformContext(),t=[];if(e.flipX||e.flipY){const r=e.flipX?-1:1,i=e.flipY?-1:1;t.push(`translate(${this.cx} ${this.cy})`),t.push(`scale(${r} ${i})`),t.push(`translate(${-this.cx} ${-this.cy})`)}return this.rotation&&t.push(`rotate(${-this.rotation} ${this.cx} ${this.cy})`),t.join(" ")}ratioToAngle(e){return this.startAngle+e*this.arcDegrees}scaleValueToRatio(e){return this.scale.toRatio(e)}scaleValueToAngle(e){return this.ratioToAngle(this.scaleValueToRatio(e))}valueToRatio(e){const t=Number(e);if(!("bidirectional"===this.barMode||"bidirectional_symmetrical"===this.barMode)||this.scale.min>=0||this.scale.max<=0)return this.scaleValueToRatio(t);const r=this.scaleValueToRatio(0);if(t<0){const e=this.scaleValueToRatio(t);return.5*Ps(r>0?e/r:0,0,1)}const i=this.scaleValueToRatio(t),s=1-r;return.5+.5*Ps(s>0?(i-r)/s:0,0,1)}valueToAngle(e){return this.ratioToAngle(this.valueToRatio(e))}pointAt(e,t){const r=e*so;return{x:this.cx+Math.cos(r)*t,y:this.cy+Math.sin(r)*t}}}class co{static renderLabel(e){return"horizontal"===(e.orientation??"arc")?co.renderHorizontalLabel(e):co.renderArcLabel(e)}static renderHorizontalLabel(e){const t=co.pointAt({cx:e.cx,cy:e.cy,radius:e.radius,angle:e.angle}),r=e.transformContext??{},i=r.rotation??0,s=r.flipX??!1?-1:1,o=r.flipY??!1?-1:1;return q`
      <text
        x="${t.x}"
        y="${t.y}"
        text-anchor="middle"
        style="dominant-baseline:central;fill:var(--primary-text-color)"
        class="horseshoe-label"
        transform="
          translate(${t.x} ${t.y})
          scale(${s} ${o})
          rotate(${-i})
          translate(${-t.x} ${-t.y})
        "
      >
        ${e.label}
      </text>
    `}static renderArcLabel(e){const t=String(e.label??""),r=co.getLabelGeometry({angle:e.angle,transformContext:e.transformContext}).visualAngle,i=r>=180&&r<=360,s=r-12,o=r+12,a=i?s:o,n=i?o:s,l=i?1:0,c=co.pointAt({cx:e.cx,cy:e.cy,radius:e.radius,angle:a}),h=co.pointAt({cx:e.cx,cy:e.cy,radius:e.radius,angle:n}),u=`${e.cardId}-horseshoe-label-${e.horseshoeIndex}-${e.index}`,d=e.inverseTransform??"";return q`
      <g transform="${d}">
        <path
          id="${u}"
          d="M ${c.x} ${c.y} A ${e.radius} ${e.radius} 0 0 ${l} ${h.x} ${h.y}"
          fill="none"
          stroke="none"
        />

        <text
          class="horseshoe-label"
          style="fill:currentColor"
          dy="0em"
        >
          <textPath
            href="#${u}"
            style="dominant-baseline:central"
            startOffset="50%"
            text-anchor="middle"
          >
            ${t}
          </textPath>
        </text>
      </g>
    `}static renderLabelBadge(e){return"horizontal"===(e.orientation??"arc")?co.renderHorizontalBadge(e):co.renderArcBadge(e)}static renderArcSegment(e){const t=co.pointAt({cx:e.cx,cy:e.cy,radius:e.radius,angle:e.startAngle}),r=co.pointAt({cx:e.cx,cy:e.cy,radius:e.radius,angle:e.endAngle}),i=Math.abs(e.endAngle-e.startAngle)>180?1:0,s=e.endAngle>e.startAngle?1:0;return q`
      <path
        class="${e.className??""}"
        d="M ${t.x} ${t.y} A ${e.radius} ${e.radius} 0 ${i} ${s} ${r.x} ${r.y}"
        fill="none"
        stroke="${e.color??"currentColor"}"
        stroke-width="${e.width}"
        stroke-linecap="${e.lineCap??"round"}"
      />
    `}static renderArcBadge(e){const t=String(e.label??""),r=e.badge??{},i=Number(r.padding??2),s=Number(r.char_width??4),o=Number(r.width??t.length*s+2*i),a=Number(r.height??8),n=Math.max(0,o-a),l=co.arcLengthToDegrees(n,e.radius),c=co.buildArcCapsulePath({cx:e.cx,cy:e.cy,radius:e.radius,angle:e.angle,arcSize:l,width:a});return q`
      <path
        class="horseshoe-label-badge"
        d="${c}"
        fill="${r.color??"var(--card-background-color)"}"
        stroke="${r.border_color??"none"}"
      />
    `}static renderHorizontalBadge(e){const t=e.badge??{},r=co.pointAt({cx:e.cx,cy:e.cy,radius:e.radius,angle:e.angle}),i=String(e.label??""),s=Number(t.padding??4),o=Number(t.radius??Math.max(7,3*i.length+s));return q`
      <circle
        class="horseshoe-label-badge"
        cx="${r.x}"
        cy="${r.y}"
        r="${o}"
        fill="${t.color??"var(--card-background-color)"}"
        stroke="${t.border_color??"none"}"
      />
    `}static pointAt(e){const t=co.degToRad(e.angle);return{x:e.cx+Math.cos(t)*e.radius,y:e.cy+Math.sin(t)*e.radius}}static normalizeAngle(e){return(e%360+360)%360}static degToRad(e){return e*Math.PI/180}static radToDeg(e){return 180*e/Math.PI}static arcLengthToDegrees(e,t){return Number(e)/(2*Math.PI*t)*360}static getLabelGeometry(e){const t=e.angle??0,r=e.transformContext??{},i=r.rotation??0,s=r.flipX??!1,o=r.flipY??!1;return{positionAngle:t,visualAngle:co.getVisualAngleFromParentTransform({angle:t,rotation:i,flipX:s,flipY:o}),mirrored:s!==o}}static getVisualAngleFromParentTransform(e){const t=e.angle??0,r=e.rotation??0,i=e.flipX??!1?-1:1,s=e.flipY??!1?-1:1,o=co.degToRad(t),a=co.degToRad(r),n=Math.cos(o),l=Math.sin(o),c=(n*Math.cos(a)-l*Math.sin(a))*i,h=(n*Math.sin(a)+l*Math.cos(a))*s;return co.normalizeAngle(co.radToDeg(Math.atan2(h,c)))}static buildArcCapsulePath(e){const t=e.width/2,r=e.radius+t,i=e.radius-t,s=e.angle-e.arcSize/2,o=e.angle+e.arcSize/2,a=co.pointAt({cx:e.cx,cy:e.cy,radius:r,angle:s}),n=co.pointAt({cx:e.cx,cy:e.cy,radius:r,angle:o}),l=co.pointAt({cx:e.cx,cy:e.cy,radius:i,angle:o}),c=co.pointAt({cx:e.cx,cy:e.cy,radius:i,angle:s}),h=e.arcSize>180?1:0;return`\n      M ${a.x} ${a.y}\n      A ${r} ${r} 0 ${h} 1 ${n.x} ${n.y}\n      A ${t} ${t} 0 0 1 ${l.x} ${l.y}\n      A ${i} ${i} 0 ${h} 0 ${c.x} ${c.y}\n      A ${t} ${t} 0 0 1 ${a.x} ${a.y}\n      Z\n    `}}function ho(e,t,r){return`horseshoe-state-${e}-${t}-${r}`}function uo(e,t){return`horseshoe-state-gradient-${e}-${t}`}function mo(e,t,r,i,s){const o={...e.horseshoe_state.styles},a={...e.horseshoe_scale.styles},n=uo(i,s);return q`
    <g class="horseshoe__state-layer">
      ${function(e,t,r,i,s){if("lineargradient"!==e.show?.horseshoe_style)return"";const o=e.colorStops.colors,a=o[0].color,n=o[o.length-1].color,l=r.find((e=>e.arc.gradientOffset))?.arc.gradientOffset??"0%",c=uo(i,s),h=t.pointAt(t.startAngle,t.radius),u=t.pointAt(t.endAngle,t.radius);return q`
    <defs>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        gradientTransform="rotate(0)"
        id="${c}"
        x1="${h.x}"
        y1="${h.y}"
        x2="${u.x}"
        y2="${u.y}"
      >
        <stop id="${c}-color1" offset="${l}" stop-color="${n}" style="transition: stop-color 1s ease;"></stop>
        <stop offset="100%" stop-color="${a}" style="transition: stop-color 1s ease;"></stop>
      </linearGradient>
    </defs>
  `}(e,t,r,i,s)}
      ${r.map((t=>{const r=!1===t.arc.active?a:o,l="lineargradient"===e.show?.horseshoe_style&&!1!==t.arc.active?`url('#${n}')`:t.arc.color??r.fill??e.horseshoe_state.color??"none",c={...r,fill:l};t.path||(c.opacity="0");const h=ho(i,s,t.key);return q`
          <path
            id="${h}"
            data-horseshoe-state-path="${h}"
            class="horseshoe__state"
            d="${t.path}"
            style=${me(c)}
          ></path>
        `}))}
    </g>
  `}function po(e,t,r={}){if(!t.length)return q``;const{layerClass:i,itemClass:s,styles:o={}}=r,{filter:a,...n}=o;return q`
    <g class=${i} style=${me(a?{filter:a}:{})}>
      ${t.map((e=>{const t={"stroke-width":0,...n,fill:e.color??n.fill??n.stroke??"currentColor"};return e.path?q`
              <path
                class=${s}
                d=${e.path}
                style=${me(t)}
              ></path>
            `:q``}))}
    </g>
  `}function go(e,t,r,i,s,o){const a={...e.horseshoe_state.styles},n={...e.horseshoe_scale.styles},l=uo(s,o),c=i.renderRoot?.querySelector(`#${l}-color1`);if("lineargradient"===e.show?.horseshoe_style&&c){const e=t.find((e=>e.arc.gradientOffset))?.arc.gradientOffset;e&&c.setAttribute("offset",e)}t.forEach((t=>{const c=function(e,t,r,i,s){if(!s?.key)return;if(e.has(s.key)){const t=e.get(s.key);if(t?.isConnected)return t;e.delete(s.key)}const o=t?.renderRoot??t?.shadowRoot;if(!o)return;const a=ho(r,i,s.key),n=o.getElementById?.(a)??o.querySelector?.(`[data-horseshoe-state-path="${a}"]`);return n&&e.set(s.key,n),n}(r,i,s,o,t);if(!c)return;const h=!1===t.arc.active?n:a,u="lineargradient"===e.show?.horseshoe_style&&!1!==t.arc.active?`url('#${l}')`:t.arc.color??h.fill??e.horseshoe_state.color??"none",d={...h,fill:u};t.path||(d.opacity="0"),c.setAttribute("d",t.path||""),c.setAttribute("style",Object.entries(d).map((([e,t])=>`${e}: ${t}`)).join("; "))}))}const fo=e=>Array.isArray(e)?e:[];class yo{static buildBandPath(e={}){const{geometry:t,arc:r={},band:i={}}=e;if(!t||!1===r.visible)return"";const s={startAngle:0,endAngle:0,startCap:"butt",endCap:"butt",...r},o={radius:t.radius,width:1,...i},a=Number(s.startAngle),n=Number(s.endAngle),l=Number(o.radius),c=Number(o.width);if(!(Number.isFinite(a)&&Number.isFinite(n)&&Number.isFinite(l)&&Number.isFinite(c)))return"";if(n===a||c<=0)return"";const h=l-c/2,u=l+c/2;if(h<=0||u<=0)return"";const d=t.pointAt(a,u),m=t.pointAt(n,u),p=t.pointAt(n,h),g=t.pointAt(a,h),f=Math.abs(n-a)>180?1:0,y=n>a?1:0,b=y?0:1,v=c/2,_=[];return _.push(`M ${d.x} ${d.y}`),_.push(`A ${u} ${u} 0 ${f} ${y} ${m.x} ${m.y}`),"round"===s.endCap?_.push(`A ${v} ${v} 0 0 ${y} ${p.x} ${p.y}`):_.push(`L ${p.x} ${p.y}`),_.push(`A ${h} ${h} 0 ${f} ${b} ${g.x} ${g.y}`),"round"===s.startCap?_.push(`A ${v} ${v} 0 0 ${y} ${d.x} ${d.y}`):_.push(`L ${d.x} ${d.y}`),_.push("Z"),_.join(" ")}}function bo(e,t){const r=e.show?.scale_style??"fixed";return"none"===r?[]:"colorstop"===r?function(e,t){const r=fo(e.colorStops?.colors),i=Number(e.colorStops?.gap??0),s=[];if(!r.length)return[{key:"scale",startAngle:t.startAngle,endAngle:t.endAngle,startCap:e.horseshoe_scale.linecap.start,endCap:e.horseshoe_scale.linecap.end,color:e.horseshoe_scale.color}];const o=[{value:Number(e.horseshoe_scale.min),color:r[0].color},...r.map((e=>({value:Number(e.value),color:e.color}))),{value:Number(e.horseshoe_scale.max),color:r[r.length-1].color}];for(let n=0;n<o.length-1;n+=1){const e=o[n],r=o[n+1],a=t.valueToAngle(e.value),l=t.valueToAngle(r.value),c=0===n?a:a+i/2,h=n===o.length-2?l:l-i/2,u=h>c;s.push({key:`scale-colorstop-${n}`,startAngle:u?c:0,endAngle:u?h:0,startCap:"butt",endCap:"butt",color:e.color,value:e.value,visible:u})}const a=s.filter((e=>!1!==e.visible));return a.length&&(a[0].startCap=e.horseshoe_scale.linecap.start,a[a.length-1].endCap=e.horseshoe_scale.linecap.end),s}(e,t):[{key:"scale",startAngle:t.startAngle,endAngle:t.endAngle,startCap:e.horseshoe_scale.linecap.start,endCap:e.horseshoe_scale.linecap.end,color:e.horseshoe_scale.color}]}function vo(e,t,r={}){const{mode:i="none",config:s={},radius:o=t.radius,width:a=6,gap:n=0,keyPrefix:l="background"}=r;if("none"===i)return[];if("colorstop"===i){const r=fo(e.colorStops?.colors);if(!r.length)return[];const i=[],c=Number(e.horseshoe_scale.min),h=Number(e.horseshoe_scale.max),u=r.map((e=>({value:Number(e.value),color:e.color}))),d=[...u[0]?.value===c?[]:[{value:c,color:r[0].color}],...u,...u[u.length-1]?.value===h?[]:[{value:h,color:r[r.length-1].color}]];for(let e=0;e<d.length-1;e+=1){const r=d[e],c=d[e+1],h=t.valueToAngle(r.value),u=t.valueToAngle(c.value),m=0===e,p=e===d.length-2,g=m?h:h+n/2,f=p?u:u-n/2;if(f>g){const n=s.linecap??"round",c={key:`${l}-colorstop-${e}`,startAngle:g,endAngle:f,startCap:m?n:"butt",endCap:p?n:"butt"};i.push({key:c.key,arc:c,path:yo.buildBandPath({geometry:t,arc:c,band:{radius:o,width:a}}),startAngle:g,endAngle:f,radius:o,width:a,color:r.color,lineCap:n})}}return i}if("fixed"===i){const e=s.linecap??"round",r={key:`${l}-fixed`,startAngle:t.startAngle,endAngle:t.endAngle,startCap:e,endCap:e};return[{key:r.key,arc:r,path:yo.buildBandPath({geometry:t,arc:r,band:{radius:o,width:a}}),startAngle:t.startAngle,endAngle:t.endAngle,radius:o,width:a,color:s.color,lineCap:e}]}return[]}function _o(e,t,r,i){const s=e.show?.horseshoe_style,o=Number(i.fromAngle??t.startAngle),a=Number(i.toAngle??t.startAngle);return"colorstopsegments"===s?function(e,t,r,i){const s=fo(e.colorStops?.colors),o=Number(e.colorStops?.gap??0),a=[];if(s.length<2)return[{key:"state-value",startAngle:r,endAngle:i,startCap:e.horseshoe_state.linecap.start,endCap:e.horseshoe_state.linecap.end}];for(let l=0;l<s.length-1;l+=1){const e=s[l],n=s[l+1],c=t.valueToAngle(e.value),h=t.valueToAngle(n.value),u=Math.max(c,r)+o/2,d=Math.min(h,i)-o/2,m=d>u;a.push({key:`colorstop-${l}`,startAngle:m?u:0,endAngle:m?d:0,startCap:"butt",endCap:"butt",color:e.color,value:e.value,label:e.label,visible:m})}const n=a.filter((e=>!1!==e.visible));return n.length&&(n[0].startCap=e.horseshoe_state.linecap.start,n[n.length-1].endCap=e.horseshoe_state.linecap.end),a}(e,t,o,a):"autominmax"===s?[{key:"state-value",startAngle:o,endAngle:a,startCap:e.horseshoe_state.linecap.start,endCap:e.horseshoe_state.linecap.end,color:Ks.calculateStrokeColor(r,e.colorStopsMinMax,!0)}]:"lineargradient"===s?[{key:"state-value",startAngle:o,endAngle:a,startCap:e.horseshoe_state.linecap.start,endCap:e.horseshoe_state.linecap.end,gradientOffset:"0%"}]:"colorstop"===s||"colorstopgradient"===s?[{key:"state-value",startAngle:o,endAngle:a,startCap:e.horseshoe_state.linecap.start,endCap:e.horseshoe_state.linecap.end,color:Ks.calculateStrokeColor(r,e.colorStops,"colorstopgradient"===s)}]:[{key:"state-value",startAngle:o,endAngle:a,startCap:e.horseshoe_state.linecap.start,endCap:e.horseshoe_state.linecap.end}]}function wo(e,t,r){return"segment"===e.horseshoe_state.mode?function(e,t,r){const i=e.state_map.map,s=e.horseshoe_state.segment_gap,o=i.length;if(!o)return[];const a=t.arcDegrees/o;return i.map(((i,n)=>{const l=Number(i.value)===Number(r);return{key:`mapped-state-${n}`,startAngle:t.startAngle+n*a+s/2,endAngle:t.startAngle+(n+1)*a-s/2,startCap:0===n?e.horseshoe_state.linecap.start:"butt",endCap:n===o-1?e.horseshoe_state.linecap.end:"butt",active:l,value:i.value,label:i.label??String(i.state)}}))}(e,t,r):"bidirectional"===e.bar_mode||"bidirectional_symmetrical"===e.bar_mode||"bidirectional_linear"===e.bar_mode?function(e,t,r){const i=t.valueToAngle(r),s=t.zeroAngle;return _o(e,t,r,{fromAngle:Math.min(s,i),toAngle:Math.max(s,i)})}(e,t,r):function(e,t,r){return _o(e,t,r,{fromAngle:t.startAngle,toAngle:t.valueToAngle(r)})}(e,t,r)}function xo(e,t,r){const i=wo(e,t,r),s={radius:t.radius,width:e.horseshoe_state.width};return i.map(((e,r)=>({key:e.key??`state-arc-${r}`,arc:e,path:yo.buildBandPath({geometry:t,arc:e,band:s})})))}function $o(e,t,r){const i=[];for(let s=e;s<=t+1e-9;s+=r)i.push(Number(s.toFixed(10)));return i}function ko(e,t){return function(e){const t=e.show.labels_at??"none",r=Number(e.horseshoe_scale.min),i=Number(e.horseshoe_scale.max),s=fo(e.colorStops?.colors);let o=[];if("minmax"===t&&(o=[{value:r,text:String(r),role:"min"},{value:i,text:String(i),role:"max"}]),"minmax0"===t&&(o=[{value:r,text:String(r),role:"min"},{value:0,text:"0",role:"zero"},{value:i,text:String(i),role:"max"}]),"colorstop"!==t&&"colorstops"!==t||(o=[{value:r,text:String(r),role:"min"},...s.map((e=>({value:e.value,text:e.label??String(e.value),role:"colorstop",color:e.color}))),{value:i,text:String(i),role:"max"}]),"ticks_major"===t){const t=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);Number.isFinite(t)&&t>0&&(o=$o(r,i,t).map(((e,t,r)=>({value:e,text:String(e),role:0===t?"min":t===r.length-1?"max":"tick-major"}))))}if("both"===t){const t=s.length?[{value:r,text:String(r),role:"min"},...s.map((e=>({value:e.value,text:e.label??String(e.value),role:"colorstop",color:e.color}))),{value:i,text:String(i),role:"max"}]:[],a=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);o=[...t,...Number.isFinite(a)&&a>0?$o(r,i,a).map((e=>({value:e,text:String(e),role:"tick-major"}))):[]]}const a=o.filter((e=>{const t=Number(e.value);return Number.isFinite(t)&&t>=r&&t<=i})).sort(((e,t)=>Number(e.value)-Number(t.value))).filter(((e,t,r)=>{const i=Number(e.value);return r.findIndex((e=>Number(e.value)===i))===t})),n=Number(e.horseshoe_labels.distance_min??0),l=[];return a.forEach((e=>{const t=Number(e.value);if(n<=0)return void l.push(e);const r=l[l.length-1];(!r||Math.abs(t-Number(r.value))>=n)&&l.push(e)})),l.length&&(l[0].role="min",l[l.length-1].role="max"),l}(e).map((r=>function(e,t,r={}){const i=Number(r.value),s=t.valueToAngle(i),o=t.radius+Number(e.horseshoe_labels.offset??e.horseshoe_state.width+2),a=t.pointAt(s,o);return{...r,value:i,text:r.text??String(i),role:r.role??"label",angle:s,radius:o,x:a.x,y:a.y}}(e,t,r)))}const So={enabled:!0,duration:2500,easing:"ease-out",debug:!1};function Mo(e){return"string"==typeof e?{start:e,end:e}:e&&"object"==typeof e?{start:e.start??"butt",end:e.end??"butt"}:{start:"butt",end:"butt"}}function Ao(e){const t=Number(e.min),r=Number(e.max);return t>=0||r<=0?0:Ps((0-t)/(r-t),0,1)}function Co(e,t,r,i,s){const o={entity_index:r},a=function(e){const t={horseshoe:!0,horseshoe_style:"fixed",labels_at:"none",...e.show??{}};if(!e.horseshoe_scale)throw new Error("[V2] Missing horseshoe_scale");const r={min:0,max:100,width:6,color:"var(--primary-background-color)",linecap:"round",type:"linear",...e.horseshoe_scale??{}};if(void 0===r.min)throw new Error("[V2] Missing horseshoe_scale.min");if(void 0===r.max)throw new Error("[V2] Missing horseshoe_scale.max");if(!r.type)throw new Error("[V2] Missing horseshoe_scale.type");if(("splineorg"===r.type||"spline"===r.type)&&!r.spline)throw new Error("[V2] Missing horseshoe_scale.spline");const i={width:12,color:"var(--primary-color)",linecap:"round",mode:"value",segment_gap:2,animation:So,...e.horseshoe_state??{}},s={...e.horseshoe_background??{}},o={offset:12,...e.horseshoe_labels??{}},a={...e.horseshoe_tickmarks??{}},n=e.state_map??i.state_map,l=e.color_stops??e.colorstops,c=Pe.ensureMinimumStops(Pe.normalize(l),r.max),h=c.colors[0],u=c.colors[c.colors.length-1],d=Pe.normalize({[r.min]:h.color,[r.max]:u.color}),m=e.radius??45,p=e.tickmarks_radius??43,g=e.arc_degrees??260,f=e.bar_mode??"normal",y="bidirectional"===f||"bidirectional_symmetrical"===f,b=e.group_config,v=e.xpos??e.horseshoe_position?.xpos??e.horseshoe_position?.cx??50,_=e.yposc||(e.ypos??e.horseshoe_position?.ypos??e.horseshoe_position?.cy??50),w=b?b.xpos+v-50:v,x=b?b.ypos+_-50:_,$=b?{xpos:b.xpos/100*Zs,ypos:b.ypos/100*Zs}:void 0;return{...e,show:t,group_config:b?{...b,svg:$}:b,xpos:w,ypos:x,radius:m,tickmarks_radius:p,arc_degrees:g,svg:{xpos:w/100*Zs,ypos:x/100*Zs,radius:m/100*Zs,tickmarks_radius:p/100*Zs},start_angle:e.start_angle??90+(360-g)/2,bar_mode:f,zero_ratio:e.zero_ratio??(y?.5:Ao(r)),state_map:n,color_stops:l,colorstops:l,colorStops:c,colorStopsMinMax:d,horseshoe_background:{...s,styles:{...Ie.toStyleDict(s.styles)}},horseshoe_scale:{...r,linecap:Mo(r.linecap),styles:{fill:r.color,...Ie.toStyleDict(r.styles)}},horseshoe_state:{...i,animation:{...So,...i.animation??{}},linecap:Mo(i.linecap),styles:{fill:i.color,...Ie.toStyleDict(i.styles)}},horseshoe_labels:{...o,background:{...o.background??{},styles:{...Ie.toStyleDict(o.background?.styles)}},badges:{...o.badges??{},styles:{...Ie.toStyleDict(o.badges?.styles)}},styles:{fill:"var(--primary-text-color)","font-size":"6px",...Ie.toStyleDict(o.styles)}},horseshoe_tickmarks:{...a,background:{...a.background??{},styles:{...Ie.toStyleDict(a.background?.styles)}},ticks_major:a.ticks_major?{...a.ticks_major,styles:{...Ie.toStyleDict(a.ticks_major?.styles)}}:a.ticks_major,ticks_minor:a.ticks_minor?{...a.ticks_minor,styles:{...Ie.toStyleDict(a.ticks_minor?.styles)}}:a.ticks_minor}}}(t.getJsTemplateOrValue(o,e,{resolveKeys:!0}));let n=i.state;s?.attribute&&void 0!==i.attributes?.[s.attribute]&&(n=i.attributes[s.attribute]);const l=a.state_map?function(e,t,r){return e.find((e=>void 0!==e.state?String(e.state)===String(t):void 0!==e.value&&String(e.value)===String(r)))}(a.state_map.map,i.state,n):void 0,c=Number(l?.value??n);return{runtimeConfig:a,rawState:i.state,mappedState:l,value:c}}function Eo(e,t,r){const i=[];for(let s=e;s<=t+1e-9;s+=r)i.push(Number(s.toFixed(10)));return i}function No(e){return e?.show?.tickmarks??e?.show?.ticks}function To(e,t,r,i,s,o){if(!r||!i.length)return[];const a=Ie.toStyleDict(r.styles),n={...a,"stroke-width":a["stroke-width"]??0},l=t.radius+Number(r.offset??0),c=Number(r.width);if(!Number.isFinite(c)||c<=0)throw new Error(`[horseshoe-tickmarks] Missing or invalid ${s} tick width`);const h=Number(r.thickness);return i.map(((i,u)=>{const d=t.valueToAngle(i),m="minor"===s&&o?.has(i)?Math.min(h,o.get(i)):h;"minor"===s&&(e.debug_ticks||e.dev?.debug_ticks)&&console.log("[horseshoe-tickmarks] minor thickness",{value:i,configuredThickness:h,maxThickness:o?.get(i),finalThickness:m,limited:o?.has(i)&&m!==h});const p=function(e,t,r,i){const s=e?.color_mode;return"colorstop"===s?Ks.calculateStrokeColor(r,i.colorStops,!1):"colorstopgradient"===s?Ks.calculateStrokeColor(r,i.colorStops,!0):e?.color??t.fill}(r,a,i,e),g={...n,fill:p??a.fill};if(void 0===p&&e.dev?.debug_colors&&console.log("[horseshoe-tickmarks] unresolved tick fill",{layerName:s,value:i,colorMode:r.color_mode,colorStops:e.colorStops}),"circle"===r.shape){const e=t.pointAt(d,l);return{key:`${s}-${u}`,shape:"circle",x:e.x,y:e.y,radius:Number(r.radius??c/2),value:i,thickness:m,startAngle:d,endAngle:d,styles:g,className:"major"===s?"horseshoe__tick-major":"horseshoe__tick-minor"}}const f=c,y=function(e,t){return Number(e)/(2*Math.PI*t)*360}(m,l),b=d-y/2,v=d+y/2,_=function(e,t,r){return yo.buildBandPath({geometry:e,arc:t,band:r})}(t,{key:`${s}-${u}`,startAngle:b,endAngle:v,startCap:"butt",endCap:"butt"},{radius:l,width:f});return{key:`${s}-${u}`,path:_,value:i,thickness:m,startAngle:b,endAngle:v,styles:g,className:"major"===s?"horseshoe__tick-major":"horseshoe__tick-minor"}})).filter((e=>e.path||"circle"===e.shape))}function Io(e,t){if(!No(e))return[];const r=e.horseshoe_tickmarks;if(!r?.ticks_major&&!r?.ticks_minor)return[];const i=Number(e.horseshoe_scale.min),s=Number(e.horseshoe_scale.max),o=r.ticks_major,a=r.ticks_minor,n=Number(o?.ticksize),l=Number(a?.ticksize),c=Number.isFinite(n)&&n>0?Eo(i,s,n):[],h=Number.isFinite(l)&&l>0?Eo(i,s,l).filter((e=>!(Number.isFinite(n)&&n>0)||!function(e,t,r){const i=(e-t)/r;return Math.abs(i-Math.round(i))<1e-9}(e,i,n))):[],u=new Map;if(("splineorg"===e.horseshoe_scale.type||"spline"===e.horseshoe_scale.type)&&c.length>1&&h.length){const r=t.radius+Number(a.offset??0),i=Number(o.thickness),s=c.slice(0,-1).map(((e,r)=>Math.abs(t.valueToAngle(c[r+1])-t.valueToAngle(e)))),n=s[1]??s[0];for(let o=0;o<c.length-1;o+=1){const s=c[o],m=c[o+1],p=h.filter((e=>e>s&&e<m));if(p.length){const o=Math.abs(t.valueToAngle(m)-t.valueToAngle(s)),c=(d=r,Number(o)/360*(2*Math.PI*d)),h=Math.max(0,c-i),g=Math.abs(m-s)/l,f=Math.min(1,o/n),y=Math.min(h/g,Number(a.thickness)*f);(e.debug_ticks||e.dev?.debug_ticks)&&console.log("[horseshoe-tickmarks] spline minor interval",{scaleType:e.horseshoe_scale.type,majorStartValue:s,majorEndValue:m,minorValues:p,majorGapDegrees:o,referenceMajorGapDegrees:n,intervalRatio:f,minorRadius:r,majorGapArcLength:c,majorThickness:i,availableMinorArcLength:h,minorTickSize:l,minorSlotsBetweenMajorTicks:g,configuredMinorThickness:Number(a.thickness),maxMinorThickness:y}),p.forEach((e=>{u.set(e,y)}))}}}var d;return[...To(e,t,a,h,"minor",u),...To(e,t,o,c,"major")]}class zo{static setConfig(e,t,r,i){const s=zo.getLegacyRootConfig(e);return[...s?[s]:[],...[...Array.isArray(e.layout?.horseshoes_v2)?e.layout.horseshoes_v2:[],...Array.isArray(e.layout?.horseshoes)?e.layout.horseshoes:[]]].filter(Boolean).map(((e,t)=>zo.applyLegacyTickmarkCompat(e))).map(((s,o)=>new zo(function(e,t,r){const i=e.entity_index??0,s=e.group?r?.[e.group]:void 0;return{entity_index:i,...e,group_config:s,index:t,show:{horseshoe:!0,horseshoe_style:"fixed",labels_at:"none",...e.show??{}}}}(s,o,e.layout?.groups),o,t,r,i))).filter((e=>!1!==e.show?.horseshoe))}static getLegacyRootConfig(e){const t=["entity_index","show","horseshoe_position","horseshoe_scale","horseshoe_state","horseshoe_background","horseshoe_labels","horseshoe_tickmarks","color_stops","colorstops","styles","bar_mode","radius","tickmarks_radius","arc_degrees","start_angle","rotate","flip","xpos","ypos","yposc"];if(!t.filter((e=>"show"!==e&&"styles"!==e&&"entity_index"!==e)).some((t=>void 0!==e[t])))return;const r={};return t.forEach((t=>{void 0!==e[t]&&(r[t]=e[t])})),Object.keys(r).length?r:void 0}static applyLegacyTickmarkCompat(e){if(!0!==e.show?.scale_tickmarks)return e;const t=e.horseshoe_tickmarks??{};if(t.ticks_major||t.ticks_minor)return{...e,show:{...e.show,tickmarks:e.show.tickmarks??e.show.ticks??!0}};const r=e.horseshoe_scale??{},i=Number(r.min??0),s=Number(r.max??100)-i,o=r.ticksize??(s?s/10:void 0),a=Number(e.radius??45),n=Number(e.tickmarks_radius??43),l=Number(r.width??6);return{...e,show:{...e.show,tickmarks:!0},horseshoe_tickmarks:{...t,ticks_major:{ticksize:o,shape:"circle",radius:l/2,width:l,thickness:l,offset:n-a,styles:[...Array.isArray(t.styles)?t.styles:t.styles?[t.styles]:[],{fill:r.color??"var(--primary-background-color)"}]}}}}constructor(e,t,r,i,s){this.config=e,this.index=t,this.templates=r,this.cardId=i,this.card=s,this.entity_index=e.entity_index??0,this.show=e.show,this.entity=void 0,this.entityConfig=void 0,this.rawState=void 0,this.value=void 0,this.displayValue=void 0,this.mappedState=void 0,this.runtimeConfig=void 0,this.scale=void 0,this.geometry=void 0,this.valueAnimator={frame:void 0,startTime:void 0,fromValue:void 0,toValue:void 0,animating:!1},this.statePathElements=new Map,this.pathItemCache=new Map,this.pathItemCacheKey=void 0}setState(e,t){this.entity=e,this.entityConfig=t;const r=Co(this.config,this.templates,this.entity_index,e,t),i=r.value,s=Number.isFinite(this.displayValue)?this.displayValue:i;this.runtimeConfig=r.runtimeConfig,this.rawState=r.rawState,this.mappedState=r.mappedState,this.value=i,this.scale=new no(this.runtimeConfig.horseshoe_scale),this.geometry=new lo(this.runtimeConfig,this.scale),this.refreshPathItemCacheKey(),Number.isFinite(this.displayValue)?this.displayValue!==this.value&&this.startValueAnimation({fromValue:s,toValue:this.value}):this.displayValue=this.value}render(){if(!(Number.isFinite(this.value)&&this.runtimeConfig&&this.scale&&this.geometry))return q``;if(this.card?.config?.palettes&&!this.card.palettesLoaded)return q``;const e=this.geometry.getGroupTransform();return q`
      <g
        id="horseshoe-${this.index}"
        class="horseshoe"
        transform="${e}"
      >
        ${this.renderHorseshoeBackground()}
        ${this.renderScale()}
        ${this.renderLabelBackground()}
        ${this.renderTickmarkBackground()}
        ${this.renderState()}
        ${this.renderTickmarks()}
        ${this.renderLabelBadges()}
        ${this.renderLabels()}
      </g>
    `}getPathItemCacheKey(){return JSON.stringify({show:this.runtimeConfig.show,svg:this.runtimeConfig.svg,arc_degrees:this.runtimeConfig.arc_degrees,start_angle:this.runtimeConfig.start_angle,rotate:this.runtimeConfig.rotate,flip:this.runtimeConfig.flip,group_config:this.runtimeConfig.group_config,bar_mode:this.runtimeConfig.bar_mode,zero_ratio:this.runtimeConfig.zero_ratio,colorStops:this.runtimeConfig.colorStops,colorStopsMinMax:this.runtimeConfig.colorStopsMinMax,horseshoe_background:this.runtimeConfig.horseshoe_background,horseshoe_scale:this.runtimeConfig.horseshoe_scale,horseshoe_state:{width:this.runtimeConfig.horseshoe_state.width,linecap:this.runtimeConfig.horseshoe_state.linecap,mode:this.runtimeConfig.horseshoe_state.mode,segment_gap:this.runtimeConfig.horseshoe_state.segment_gap,color:this.runtimeConfig.horseshoe_state.color,styles:this.runtimeConfig.horseshoe_state.styles},state_map:this.runtimeConfig.state_map,horseshoe_labels:this.runtimeConfig.horseshoe_labels,horseshoe_tickmarks:this.runtimeConfig.horseshoe_tickmarks})}refreshPathItemCacheKey(){const e=this.getPathItemCacheKey();e!==this.pathItemCacheKey&&(this.pathItemCache.clear(),this.pathItemCacheKey=e)}clearPathItemCache(){this.pathItemCache.clear(),this.pathItemCacheKey=void 0}getCachedPathItems(e,t){if(!this.pathItemCache.has(e)){Ks.unresolvedColor=!1;const r=t();if(Ks.unresolvedColor)return r;this.pathItemCache.set(e,r)}return this.pathItemCache.get(e)}renderHorseshoeBackground(){const e=this.getCachedPathItems("horseshoeBackgroundItems",(()=>function(e,t){const r=e.show.horseshoe_background??"none",i=e.horseshoe_background??{};return vo(e,t,{mode:r,config:i,radius:t.radius+Number(i.offset??0),width:Number(i.width??e.horseshoe_scale.width??e.horseshoe_state.width??6),gap:Number(i.gap??e.colorStops?.gap??0),keyPrefix:"horseshoe-background"})}(this.runtimeConfig,this.geometry)));return function(e,t,r){return po(0,r,{layerClass:"horseshoe__background-layer",itemClass:"horseshoe__background",styles:e.horseshoe_background.styles})}(this.runtimeConfig,this.geometry,e)}renderScale(){const e=this.getCachedPathItems("scalePathItems",(()=>function(e,t){const r=bo(e,t),i={radius:t.radius,width:e.horseshoe_scale.width};return r.map(((e,r)=>({key:e.key??`scale-arc-${r}`,arc:e,path:yo.buildBandPath({geometry:t,arc:e,band:i})})))}(this.runtimeConfig,this.geometry)));return function(e,t,r){const i={...e.horseshoe_scale.styles};return q`
    <g class="horseshoe__scale-layer" style=${me(i)}>
      ${r.map((t=>{const r=t.arc.color??e.horseshoe_scale.color??i.fill??"none";return t.path?q`
              <path
                class="horseshoe__scale"
                d=${t.path}
                fill="${r}"
              ></path>
            `:q``}))}
    </g>
  `}(this.runtimeConfig,this.geometry,e)}renderState(){const e=xo(this.runtimeConfig,this.geometry,this.displayValue??this.value);return mo(this.runtimeConfig,this.geometry,e,this.cardId,this.index)}renderTickmarks(){return function(e){return e.length?q`
    <g class="horseshoe__ticks-layer">
      ${e.map((e=>"circle"===e.shape?q`
            <circle
              class="${e.className}"
              cx="${e.x}"
              cy="${e.y}"
              r="${e.radius}"
              data-value="${e.value??""}"
              data-thickness="${e.thickness??""}"
              data-start-angle="${e.startAngle??""}"
              data-end-angle="${e.endAngle??""}"
              style=${me(e.styles??{})}
            ></circle>
          `:q`
            <path
              class="${e.className}"
              d="${e.path}"
              data-value="${e.value??""}"
              data-thickness="${e.thickness??""}"
              data-start-angle="${e.startAngle??""}"
              data-end-angle="${e.endAngle??""}"
              style=${me(e.styles??{})}
            ></path>
          `))}
    </g>
  `:q``}(this.getCachedPathItems("tickPathItems",(()=>Io(this.runtimeConfig,this.geometry))))}renderTickmarkBackground(){const e=this.getCachedPathItems("tickmarkBackgroundItems",(()=>function(e,t){if(!No(e))return[];const r=e.show.tick_background??"none",i=e.horseshoe_tickmarks??{},s=i.background??{},o=i.ticks_major??{},a=i.ticks_minor??{};return vo(e,t,{mode:r,config:s,radius:t.radius+Number(s.offset??o.offset??a.offset??0),width:Number(s.width??o.width??a.width??4),gap:Number(s.gap??0),keyPrefix:"tick-background"})}(this.runtimeConfig,this.geometry)));return function(e,t,r){return po(0,r,{layerClass:"horseshoe__tick-background-layer",itemClass:"horseshoe__tick-background",styles:e.horseshoe_tickmarks.background.styles})}(this.runtimeConfig,this.geometry,e)}renderLabels(){const e=this.getCachedPathItems("labelItems",(()=>ko(this.runtimeConfig,this.geometry)));return function(e,t,r,i,s){const o={...e.horseshoe_labels.styles};return q`
    <g class="horseshoe__labels-layer" style=${me(o)}>
      ${s.map(((s,o)=>co.renderLabel({horseshoeIndex:i,index:o,label:s.text,angle:s.angle,cx:t.cx,cy:t.cy,radius:s.radius,cardId:r,orientation:e.horseshoe_labels.orientation??"arc",isMin:"min"===s.role,isMax:"max"===s.role,transformContext:t.getTransformContext(),inverseTransform:t.getInverseGroupTransform()})))}
    </g>
  `}(this.runtimeConfig,this.geometry,this.cardId,this.index,e)}renderLabelBackground(){const e=this.getCachedPathItems("labelBackgroundItems",(()=>function(e,t){const r=e.show.label_background??"none",i=e.horseshoe_labels.background??{};return vo(e,t,{mode:r,config:i,radius:t.radius+Number(e.horseshoe_labels.offset??e.horseshoe_state.width+2),width:Number(i.width??6),gap:Number(i.gap??0),keyPrefix:"label-background"})}(this.runtimeConfig,this.geometry)));return function(e,t,r){return po(0,r,{layerClass:"horseshoe__label-background-layer",itemClass:"horseshoe__label-background",styles:e.horseshoe_labels.background.styles})}(this.runtimeConfig,this.geometry,e)}renderLabelBadges(){const e=this.getCachedPathItems("labelItems",(()=>ko(this.runtimeConfig,this.geometry)));return function(e,t,r,i,s){if(!s.length||!e.show.label_badges)return q``;const o={...e.horseshoe_labels.badges.styles};return q`
    <g class="horseshoe__label-badges-layer" style=${me(o)}>
      ${s.map(((s,o)=>co.renderLabelBadge({horseshoeIndex:i,index:o,label:s.text,angle:s.angle,cx:t.cx,cy:t.cy,radius:s.radius,cardId:r,orientation:e.horseshoe_labels.orientation??"arc",badge:e.horseshoe_labels.badges??{}})))}
    </g>
  `}(this.runtimeConfig,this.geometry,this.cardId,this.index,e)}getStateAnimationConfig(){return e=this.runtimeConfig,{...ro,...e?.horseshoe_state?.animation??{}};var e}startValueAnimation(e={}){const t=this.getStateAnimationConfig();io(this.valueAnimator,t,e,{onUpdate:e=>{this.displayValue=e,this.updateStatePathDom({value:this.displayValue})},onComplete:e=>{this.displayValue=e,this.updateStatePathDom({value:this.displayValue})}})}updateStatePathDom(e={}){if(!this.runtimeConfig||!this.geometry||!this.scale)return;const t=Number(e.value??this.displayValue??this.value),r=xo(this.runtimeConfig,this.geometry,t);go(this.runtimeConfig,r,this.statePathElements,this.card,this.cardId,this.index)}}class Po{constructor(e,t,r,i,s,o){this.config=e,this.index=t,this.templates=r,this.cardId=i,this.card=s,this.animationSection=o,this.entity_index=e.entity_index??0,this.entity=void 0,this.entityConfig=void 0,this.runtimeConfig=e}setState(e,t){this.entity=e,this.entityConfig=t,this.runtimeConfig=ze.getJsTemplateOrValue(this.config,this.config,{resolveKeys:!0})}getStyles(e){return{...e,...Ie.toStyleDict(this.runtimeConfig.styles),...Ie.toStyleDict(this.card.animations?.[this.animationSection]?.[this.runtimeConfig.animation_id]??{})}}applyColorStops(e,t){const r=this.card._getItemColorFromStops(this.runtimeConfig);r&&(e[t]=r)}getGroupScaleTransform(){return this.card._getGroupScaleTransform(this.runtimeConfig)}getGroupScaleStyle(){return this.card._getGroupScaleStyle(this.runtimeConfig)}handlePopup(e){this.card.handlePopup(e,this.card.entities[this.entity_index])}}class Oo extends Po{static setConfig(e,t,r,i){return(e.layout?.rectangles??[]).map(((e,s)=>new Oo(e,s,t,r,i)))}constructor(e,t,r,i,s){super({radius:0,...e},t,r,i,s,"rectangles"),this.config.svg=this.calculateSvgDimensions(),this.runtimeConfig=this.config}setState(e,t){super.setState(e,t),this.runtimeConfig.svg=this.calculateSvgDimensions(this.runtimeConfig)}calculateSvgDimensions(e=this.config){const t=this.card._calculateSvgCoordinatesInGroup(e),r=Qs.calculateSvgDimension(e.width),i=Qs.calculateSvgDimension(e.height),s="object"==typeof e.radius?e.radius:{all:e.radius},o=Math.min(i,r)/2,a=e=>Math.min(o,Math.max(0,Qs.calculateSvgDimension(e)));return t.width=r,t.height=i,t.x=t.xpos-r/2,t.y=t.ypos-i/2,t.radiusTopLeft=a(s.top_left??s.left??s.top??s.all),t.radiusTopRight=a(s.top_right??s.right??s.top??s.all),t.radiusBottomLeft=a(s.bottom_left??s.left??s.bottom??s.all),t.radiusBottomRight=a(s.bottom_right??s.right??s.bottom??s.all),t}buildRoundedRectanglePath(){const e=this.runtimeConfig.svg;return`\n      M ${e.x+e.radiusTopLeft} ${e.y}\n      h ${e.width-e.radiusTopLeft-e.radiusTopRight}\n      q ${e.radiusTopRight} 0 ${e.radiusTopRight} ${e.radiusTopRight}\n      v ${e.height-e.radiusTopRight-e.radiusBottomRight}\n      q 0 ${e.radiusBottomRight} -${e.radiusBottomRight} ${e.radiusBottomRight}\n      h -${e.width-e.radiusBottomRight-e.radiusBottomLeft}\n      q -${e.radiusBottomLeft} 0 -${e.radiusBottomLeft} -${e.radiusBottomLeft}\n      v -${e.height-e.radiusBottomLeft-e.radiusTopLeft}\n      q 0 -${e.radiusTopLeft} ${e.radiusTopLeft} -${e.radiusTopLeft}\n      Z\n    `}render(){const e=this.getStyles({fill:"var(--primary-background-color)",stroke:"none","stroke-width":0});return this.applyColorStops(e,"fill"),q`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <path
          @click=${e=>this.handlePopup(e)}
          class="rectangle-tool"
          d="${this.buildRoundedRectanglePath()}"
          style=${me(e)}
        ></path>
      </g>
    `}}class jo extends Po{static setConfig(e,t,r,i){return[...(e.layout?.lines??[]).map((e=>jo.normalizeLineConfig(e,"lines"))),...(e.layout?.hlines??[]).map((e=>jo.normalizeLineConfig(e,"hlines"))),...(e.layout?.vlines??[]).map((e=>jo.normalizeLineConfig(e,"vlines")))].map(((e,s)=>new jo(e,s,t,r,i)))}static normalizeLineConfig(e,t){let r=e.orientation??"horizontal";return"hlines"===t&&(r="horizontal"),"vlines"===t&&(r="vertical"),{...e,orientation:r,animation_section:t}}constructor(e,t,r,i,s){const o={orientation:"horizontal",length:10,xpos:50,ypos:50,...e};super(o,t,r,i,s,o.animation_section),this.validateOrientation(this.config.orientation),this.config.svg=this.calculateSvgDimensions(),this.runtimeConfig=this.config}setState(e,t){super.setState(e,t),this.validateOrientation(this.runtimeConfig.orientation),this.runtimeConfig.svg=this.calculateSvgDimensions(this.runtimeConfig)}validateOrientation(e){if(!["horizontal","vertical","fromto"].includes(e))throw Error(`LineTool::validateOrientation - invalid orientation '${e}' [horizontal, vertical, fromto]`)}calculateSvgDimensions(e=this.config){if("fromto"===e.orientation){const t=e.start??{xpos:e.x1,ypos:e.y1},r=e.end??{xpos:e.x2,ypos:e.y2},i=this.card._calculateSvgCoordinatesInGroup({...e,xpos:t.xpos??t.x,ypos:t.ypos??t.y}),s=this.card._calculateSvgCoordinatesInGroup({...e,xpos:r.xpos??r.x,ypos:r.ypos??r.y});return{xpos:(i.xpos+s.xpos)/2,ypos:(i.ypos+s.ypos)/2,x1:i.xpos,y1:i.ypos,x2:s.xpos,y2:s.ypos}}const t=this.card._calculateSvgCoordinatesInGroup(e),r=Qs.calculateSvgDimension(e.length);return"vertical"===e.orientation?{...t,length:r,x1:t.xpos,y1:t.ypos-r/2,x2:t.xpos,y2:t.ypos+r/2}:{...t,length:r,x1:t.xpos-r/2,y1:t.ypos,x2:t.xpos+r/2,y2:t.ypos}}render(){const e=this.getStyles({"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2"});return this.applyColorStops(e,"stroke"),q`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <line
          @click=${e=>this.handlePopup(e)}
          class="line-tool"
          x1="${this.runtimeConfig.svg.x1}"
          y1="${this.runtimeConfig.svg.y1}"
          x2="${this.runtimeConfig.svg.x2}"
          y2="${this.runtimeConfig.svg.y2}"
          style=${me(e)}
        ></line>
      </g>
    `}}class Ro{static cache=new Map;static load(e){if(this.cache.has(e))return this.cache.get(e);const t=fetch(e).then((async t=>{if(!t.ok)throw new Error(`Could not load palette: ${e}`);return t.json()}));return this.cache.set(e,t),t}static async loadAll(e={}){const t=await Promise.all(Object.entries(e||{}).map((async([e,t])=>[e,await this.load(t)])));return Object.fromEntries(t)}static apply(e,t,r){Object.entries(t.ref).forEach((([t,r])=>{e.style.setProperty(`--${t}`,r)})),Object.entries(t.modes[r]).forEach((([t,r])=>{e.style.setProperty(`--${t}`,r)}))}static applyAll(e,t,r){Object.entries(t).forEach((([,t])=>{this.apply(e,t,r)}))}}console.info("%c FLEX-HORSESHOE-CARD %c Version 5.4.7-dev.10 ","color: white; font-weight: bold; background: darkgreen","color: darkgreen; font-weight: bold; background: white");const Do={action:"more-info"},Vo={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed",scale_style:"fixed"};class Go extends ne{constructor(){if(super(),Ks.setElement(this),this.palettesLoaded=!1,this.cardId=Math.random().toString(36).substr(2,9),this._hass=void 0,this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.viewBoxSize=Zs,this.viewBox={width:Zs,height:Zs},this.colorStops={},this.animations={},this.animations.lines={},this.animations.vlines={},this.animations.hlines={},this.animations.circles={},this.animations.rectangles={},this.animations.icons={},this.animations.iconsIcon={},this.animations.names={},this.animations.areas={},this.animations.states={},this.rectangleTools=[],this.lineTools=[],this.resolvedEntityConfigs=[],this.colorCache={},this.isAndroid=!1,this.isSafari=!1,this.iOS=!1,this.resolvedVariables={},this.iconCache={},this.iconsSvg=[],this.pendingIconPath=[],this.iconsId=[],this.svgUrlCache||={},this.theme={},this.theme.checked=!1,this.theme.isLoaded=!1,this.theme.modeChanged=!1,this.theme.darkMode=!1,this.theme.light={},this.theme.dark={},this.palettes={},this.bar_mode="normal",this.dev={debug:!1},this.isAndroid=!!window.navigator.userAgent.match(/Android/),!this.isAndroid){const e=window.navigator.userAgent||"",t=e.toLowerCase(),r=window.navigator.platform||"",i=(/iPad|iPhone|iPod/.test(e)||"MacIntel"===r&&window.navigator.maxTouchPoints>1)&&!window.MSStream,s=e.match(/Version\/(\d+)(?:\.[\d.]+)?.*Safari/i),o=s?Number(s[1]):void 0,a=t.match(/\bos\s+(\d+)(?:[._]\d+)*.*like safari/),n=t.match(/\bios\s+(\d+)(?:[._]\d+)*/),l=n?Number(n[1]):a?Number(a[1]):void 0,c=Number.isFinite(o),h=Number.isFinite(l)&&t.includes("like safari"),u=c?o:h?l:void 0;this.iOS=i,this.isSafari=Number.isFinite(u),this.safariMajorVersion=u,this.isHomeAssistantLikeSafari=h,this.isRealSafari=c,this.isSafari14=this.isSafari&&14===u,this.isSafari15=this.isSafari&&15===u,this.isSafari16=this.isSafari&&16===u,this.isSafari17=this.isSafari&&17===u,this.isSafari18=this.isSafari&&18===u,this.isSafari26=this.isSafari&&26===u,this.isSafari27=this.isSafari&&27===u,this.isSafari28=this.isSafari&&28===u,this.isSafari29=this.isSafari&&29===u,this.isSafari30=this.isSafari&&30===u,this.isSafariGte16=this.isSafari&&u>=16,this.dev?.debug&&console.log("browser detection",{ua:e,isAndroid:this.isAndroid,isIOS:this.iOS,isSafari:this.isSafari,isRealSafari:this.isRealSafari,isHomeAssistantLikeSafari:this.isHomeAssistantLikeSafari,safariMajorVersion:this.safariMajorVersion,isSafariGte16:this.isSafariGte16}),this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config)}}static get styles(){return o`
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
        padding: 5px 5px 5px 5px;
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
    `}_resolveEntityConfigs(e){return e?.dev?.debug&&console.log("resolving entity config for",e?.entities),e?.entities?.map(((e,t)=>{const r={entity_index:t};return ze.getJsTemplateOrValue(r,e)}))??[]}_buildMyIcon(e,t,r,i){if(!e||!t)return;if(i)return i;if(r?.icon)return r.icon;if(t.icon)return t.icon;const s=t.entity,o=t.attribute,a=o?e.attributes?.[o]:void 0,n=e.entity_id?.split(".")[0];if(e.attributes?.icon&&!o)return e.attributes.icon;if(o&&"weather"===n){const e=to[o];if(e)return e}this.entitiesIcon??={},this.entitiesIconKey??={},this.entitiesIconPending??={};const l=o?`${s}|attribute:${o}`:`${s}|state`,c=o?[s,"attribute",o,a??"",n??"",e.attributes?.device_class??"",e.attributes?.icon??""].join("|"):[s,"state",e.state??"",n??"",e.attributes?.device_class??"",e.attributes?.icon??""].join("|");if(this.entitiesIconKey[l]===c)return this.entitiesIcon[l];if(this.entitiesIconKey[l]=c,!this.entitiesIconPending[l]){this.entitiesIconPending[l]=!0;const t=o?(async(e,t,r,i)=>{let s;const o=Qe(t),a=t.attributes.device_class,n=e.entities?.[t.entity_id],l=n?.platform,c=n?.translation_key,h=i??t.attributes[r];if(c&&l){const t=await rt(e.config,e.connection,l);t&&(s=ot(h,t[o]?.[c]?.state_attributes?.[r]))}if(!s){const t=await it(e.connection,e.config,o);if(t){const e=a&&t[a]?.state_attributes?.[r]||t._?.state_attributes?.[r];s=ot(h,e)}}return s})(this._hass,e,o,void 0!==a?String(a):void 0):(async(e,t,r,i,s)=>{const o=e?.[i.entity_id];if(o?.icon)return o.icon;const a=Qe(i);return at(t,r,a,i,s,o)})(this._hass.entities,this._hass.config,this._hass.connection,e);t.then((e=>{this.entitiesIconKey[l]===c&&e&&this.entitiesIcon[l]!==e&&(this.entitiesIcon[l]=e,this.requestUpdate())})).catch((e=>{console.error(o?"_buildMyIcon attributeIcon failed":"_buildMyIcon entityIcon failed",s,o??"",e)})).finally((()=>{this.entitiesIconPending[l]=!1}))}return this.entitiesIcon[l]}_formatEntityStateParts(e,t){const r=void 0!==t.attribute,i=t.format||{};let s=r?e.attributes[t.attribute]:e.state;if(!0===i.raw_state_keep)return!0===i.raw_state_clean&&"string"==typeof s&&(s=s.replace(/_/g," ")),[{type:"value",value:s}];const o=r?this._hass.formatEntityAttributeValueToParts(e,t.attribute):this._hass.formatEntityStateToParts(e,this._buildState(e.state,t));let a;if(!Number.isNaN(Number(s))&&null!==s&&""!==s){const e=i.locale||this._hass.locale?.language||this._hass.language||"en-US",r=o.find((e=>"value"===e.type));let l;if(r&&void 0!==r.value&&null!==r.value){const e=String(r.value),t=Math.max(e.lastIndexOf("."),e.lastIndexOf(","));l=-1!==t?e.length-t-1:0}const c=i.decimals_max??(void 0!==l?l:void 0!==t.decimals?Number(t.decimals):2);let h=i.decimals_min??(void 0!==l?l:void 0!==t.decimals?Number(t.decimals):0);h>c&&(h=c);const u={useGrouping:!1!==i.separator,minimumFractionDigits:h,maximumFractionDigits:c};try{a=new Intl.NumberFormat(e,u).format(Number(s))}catch(n){console.error("Error formatting numeric state inside parts:",n)}}return o.map((e=>"value"===e.type&&void 0!==a?{...e,value:a}:"unit"===e.type&&void 0!==t.unit?{...e,value:t.unit}:e))}themeIsDarkMode(){return!0===this.theme.darkMode}themeIsLightMode(){return!1===this.theme.darkMode}set hass(e){this.setHass(e)}setHass(e,t=!1){this._hass=e,ze.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes});let r=t;const i=e.selectedTheme||e.themes.theme||"",s=!0===e.themes.darkMode;if(this.theme.nameChanged=this.theme.name!==i,this.theme.modeChanged=this.theme.darkMode!==s,this.theme.nameChanged||this.theme.modeChanged){this.theme.name=i,this.theme.darkMode=s,Ks.colorCache={};const e=this.hass?.themes?.darkMode?"dark":"light";Ro.applyAll(this,this.palettes,e),this.horseshoeGauges?.forEach((e=>e.clearPathItemCache()))}this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.resolvedEntityConfigs.forEach(((t,i)=>{const s=e.states[t.entity];if(!s)return;this.entities[i]=s;const o=this._buildState(s.state,t);if(Qe(s),o!==this.entitiesStr[i]&&(this.entitiesStr[i]=o,r=!0),t.attribute&&Object.prototype.hasOwnProperty.call(s.attributes,t.attribute)){const e=this._buildState(s.attributes[t.attribute],t);e!==this.attributesStr[i]&&(this.attributesStr[i]=e,r=!0)}})),r&&(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.horseshoeGauges=this.horseshoeGauges.map((e=>{const t=e.entity_index??0,r=this.resolvedEntityConfigs[t],i=this.entities[t];return i&&r?(e.setState(i,r),e):e})),this.rectangleTools=(this.rectangleTools??[]).map((e=>{const t=e.entity_index??0,r=this.resolvedEntityConfigs[t],i=this.entities[t];return i&&r?(e.setState(i,r),e):e})),this.lineTools=(this.lineTools??[]).map((e=>{const t=e.entity_index??0,r=this.resolvedEntityConfigs[t],i=this.entities[t];return i&&r?(e.setState(i,r),e):e})),this.config.animations&&Object.keys(this.config.animations).map((e=>{const t=e.substr(Number(e.indexOf(".")+1));return this.config.animations[e].map((e=>this.entities[t].state.toLowerCase()===e.state.toLowerCase()&&(e.lines&&e.lines.forEach((e=>this._updateAnimationStyles("lines",e))),e.vlines&&e.vlines.forEach((e=>this._updateAnimationStyles("vlines",e))),e.hlines&&e.hlines.forEach((e=>this._updateAnimationStyles("hlines",e))),e.circles&&e.circles.forEach((e=>this._updateAnimationStyles("circles",e))),e.rectangles&&e.rectangles.forEach((e=>this._updateAnimationStyles("rectangles",e))),e.icons&&e.icons.forEach((e=>{const t=e.animation_id;this.animations.icons[t]&&e.reuse||(this.animations.icons[t]={},this.animations.iconsIcon[t]={});const r=ze.getJsTemplateOrValue(e,e.styles),i=Ie.toStyleDict(r);this.animations.icons[t]={...this.animations.icons[t],...i},this.animations.iconsIcon[t]=ze.getJsTemplateOrValue(e,e.icon)})),e.states&&e.states.forEach((e=>this._updateAnimationStyles("states",e))),!0))),!0})),ze.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),this.theme.modeChanged=!1,this.requestUpdate())}_updateAnimationStyles(e,t){const r=t.animation_id;if(null==r)return;const i=ze.getJsTemplateOrValue(t,t.styles),s=Ie.toStyleDict(i);this.animations[e][r]={...t.reuse?this.animations[e][r]??{}:{},...s}}_prepareItemColorStops(e){["states","names","areas","circles","rectangles","lines","hlines","vlines","icons","horseshoes","horseshoes_v2"].forEach((t=>{const r=e.layout?.[t];Array.isArray(r)&&r.forEach((e=>{if(!e.color_stops)return;const t=ze.getJsTemplateOrValue(e,e.color_stops,{resolveKeys:!0});e._colorStops=Pe.normalize(t)}))}))}_calculateSvgCoordinatesInGroup(e){const t={xpos:Qs.calculateSvgDimension(e.xpos),ypos:Qs.calculateSvgDimension(e.yposc||e.ypos)},r=this.config.layout?.groups?.[e.group];if(!e.group||!r)return t;return{xpos:Qs.calculateSvgDimension(r.xpos+e.xpos-50),ypos:Qs.calculateSvgDimension(r.ypos+(e.yposc||e.ypos)-50)}}_computeGroupDimensions(e){const t=e.layout?.groups;t&&Object.entries(t).forEach((([e,t])=>{t.svg={xpos:Qs.calculateSvgDimension(t.xpos),ypos:Qs.calculateSvgDimension(t.ypos)}}))}_computeSvgDimensions(e){const t=e.layout;t?.names&&t.names.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.states&&t.states.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.areas&&t.areas.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.icons&&t.icons.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.circles&&t.circles.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.radius=e.radius})),this?.horseshoes&&this.horseshoes.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.radius=Qs.calculateSvgDimension(e.radius),e.svg.tickmarksRadius=Qs.calculateSvgDimension(e.tickmarks_radius),e.svg.rotateX=e.svg.xpos,e.svg.rotateY=e.svg.ypos}))}_isStaticCalc(e){return"string"==typeof e&&e.startsWith("calc(")&&e.endsWith(")")}_evaluateStaticCalc(e,t={}){const r=e.slice(5,-1).trim();if(!/^[0-9+\-*/().,\sA-Za-z_]+$/.test(r))throw new Error(`Invalid static calc expression '${e}'`);const i={...t,sin:Math.sin,cos:Math.cos,tan:Math.tan,abs:Math.abs,round:Math.round,floor:Math.floor,ceil:Math.ceil,min:Math.min,max:Math.max,sqrt:Math.sqrt,PI:Math.PI},s=Function(...Object.keys(i),`"use strict"; return (${r});`)(...Object.values(i));if(!this._isStaticNumber(s))throw new Error(`Static calc expression '${e}' did not return a finite number`);return s}_isStaticNumber(e){return"number"==typeof e&&Number.isFinite(e)}_getStateMapItem(e,t){const r=e?.state_map?.map;if(!r)return;const i=t?.state;return r.find((e=>e.state===i))??r.find((e=>"default"===e.state))}_applySameAsDeltas(e,t,r){return Object.entries(e).forEach((([e,i])=>{if(!e.startsWith("same_as_d"))return;const s=e.substring(9);if(!s)throw new Error(`Invalid same_as delta field '${e}' for item ${r}`);if(void 0===t[s])throw new Error(`same_as delta '${e}' requires '${s}' for item ${r}`);if(!this._isStaticNumber(t[s]))throw new Error(`same_as delta '${e}' requires numeric '${s}' for item ${r}`);if(!this._isStaticNumber(i))throw new Error(`same_as delta '${e}' must be numeric for item ${r}`);t[s]+=i})),t}_mergeSameAsItem(e,t,r="merge",i){const s=eo.mergeDeep(e,t);return Object.entries(t).forEach((([t,o])=>{const a=o?.same_as_merge??r,n=o?.same_as_key??i;if("replace"!==a){if("keyed"===a){if(!n)throw new Error(`same_as_key is required when same_as_merge is keyed for field '${t}'`);const{same_as_merge:r,same_as_key:i,...a}=o;s[t]=eo.mergeDeep(e[t]??{},a),Object.entries(a).forEach((([r,i])=>{Array.isArray(e[t]?.[r])&&Array.isArray(i)&&(s[t][r]=this._mergeListByKey(e[t][r],i,n))}))}}else{const{same_as_merge:e,same_as_key:r,...i}=o;s[t]=i}})),s}_mergeSameAsKeyed(e,t,r){const i=eo.mergeDeep(e,t);if(!r)throw new Error("same_as_key is required when same_as_merge is keyed");return Object.keys(t).forEach((s=>{Array.isArray(e[s])&&Array.isArray(t[s])&&(i[s]=this._mergeListByKey(e[s],t[s],r))})),i}_mergeListByKey(e,t,r){const i=new Map;return e.forEach((e=>{i.set(String(e[r]),e)})),t.forEach((e=>{const t=String(e[r]);i.has(t)?i.set(t,eo.mergeDeep(i.get(t),e)):i.set(t,e)})),[...i.values()]}_resolveSameAsItems(e){const t=new Map;return e.map(((e,r)=>{let i;if(void 0===e.same_as)i=e;else{const s=t.get(String(e.same_as));if(!s)throw new Error(`same_as '${e.same_as}' not found for item ${r}`);const{same_as:o,same_as_replace:a=[],...n}=e,l={...s};a.forEach((e=>{delete l[e]})),i=eo.mergeDeep(l,n),i=this._applySameAsDeltas(e,i),delete i.same_as,delete i.same_as_replace,Object.keys(i).filter((e=>e.startsWith("same_as_d"))).forEach((e=>delete i[e]))}return t.set(String(i.id),i),i}))}_resolveSectionSameAs(e){["horseshoes","horseshoes_v2","states","names","areas","circles","rectangles","lines","hlines","vlines","icons"].forEach((t=>{const r=e.layout?.[t];Array.isArray(r)&&(e.layout[t]=this._resolveSameAsItems(r))}))}_assignIdItems(e){return e.map(((e,t)=>({...e,id:String(e.id??t)})))}_assignSectionIds(e){["horseshoes","horseshoes_v2","states","names","areas","circles","rectangles","lines","hlines","vlines","icons"].forEach((t=>{const r=e.layout?.[t];Array.isArray(r)&&(e.layout[t]=this._assignIdItems(r))}))}_isStaticRef(e){return"string"==typeof e&&e.startsWith("ref(")&&e.endsWith(")")}_cloneStaticValue(e){return e&&"object"==typeof e?eo.mergeDeep(Array.isArray(e)?[]:{},e):e}_evaluateConstants(e){const t=e.constants;if(!t||"object"!=typeof t)return{};const r={};return Object.entries(t).forEach((([e,i])=>{t[e]=this._evaluateStaticConfig(i,r),this._isStaticNumber(t[e])&&(r[e]=t[e])})),r}_resolveStaticRef(e,t){if(!this._isStaticRef(e))return e;const r=e.slice(4,-1).trim();if(!(r in t))throw new Error(`Static ref '${r}' not found`);return this._cloneStaticValue(t[r])}_resolveStaticRefs(e,t={}){return this._isStaticRef(e)?this._resolveStaticRef(e,t):Array.isArray(e)?e.map((e=>this._resolveStaticRefs(e,t))):e&&"object"==typeof e?(Object.entries(e).forEach((([r,i])=>{e[r]=this._resolveStaticRefs(i,t)})),e):e}_evaluateStaticConfig(e,t={}){return this._isStaticCalc(e)?this._evaluateStaticCalc(e,t):Array.isArray(e)?e.map((e=>this._evaluateStaticConfig(e,t))):e&&"object"==typeof e?(Object.entries(e).forEach((([r,i])=>{e[r]=this._evaluateStaticConfig(i,t)})),e):e}setConfig(e){try{if(e=JSON.parse(JSON.stringify(e)),this.dev={...e.dev},!e.entities)throw Error("No entities defined");if(!e.layout)throw Error("No layout defined");e?.palettes&&(this.palettesLoaded=!1,Ro.loadAll(e?.palettes).then((e=>{this.palettes=e;const t=this.hass?.themes?.darkMode?"dark":"light";Ks.setElement(this),Ro.applyAll(this,e,t),Ks.colorCache={},this.palettesLoaded=!0,this.horseshoeGauges?.forEach((e=>e.clearPathItemCache())),this.setHass(this._hass,!0),this.requestUpdate()}))),this._assignSectionIds(e);const t=this._evaluateConstants(e);this._resolveStaticRefs(e,e.constants),this._evaluateStaticConfig(e,t),this._resolveSectionSameAs(e),ze.setContext({hass:this._hass,config:e,entities:this.entities,horseshoes:this.horseshoes});const r=this._resolveEntityConfigs(e);if(r){if("sensor"!==De(r[0].entity)&&r[0].attribute&&!isNaN(r[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}r.forEach((e=>{e.tap_action||(e.tap_action={...Do})}));const i={texts:[],card_filter:"card--filter-none",bar_mode:e.bar_mode||"normal",...e,show:{...Vo,...e.show}};this.horseshoeGauges=zo.setConfig(e,ze,this.cardId,this),this._prepareItemColorStops(i),this.config=i,this.bar_mode=i.bar_mode||"normal",this.config.layout?.icons&&this.config.layout.icons.forEach(((e,t)=>{this.iconsId[t]=Math.random().toString(36).substr(2,9)})),this.aspectratio=(this.config.layout.aspectratio||this.config.aspectratio||"1/1").trim();const s=this.aspectratio.split("/");this.viewBox||(this.viewBox={}),this.viewBox.width=s[0]*Xs,this.viewBox.height=s[1]*Xs,this._computeGroupDimensions(this.config),this._computeSvgDimensions(this.config),this.rectangleTools=Oo.setConfig(this.config,ze,this.cardId,this),this.lineTools=jo.setConfig(this.config,ze,this.cardId,this),ze.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes})}catch(t){throw console.error("[FHC setConfig] CONFIG ERROR",{error:t,message:t?.message,stack:t?.stack,rawConfig:e,horseshoes:this.horseshoes}),t}}_getItemStateValue(e={}){const t=e.entity_index??0,r=this.entities?.[t],i=this.config?.entities?.[t];if(!r)return;const s=i?.attribute;return s&&r.attributes&&void 0!==r.attributes[s]?r.attributes[s]:r.state}_getItemColorFromStops(e={}){if(!e._colorStops)return;const t=this._getItemStateValue(e),r=Number(t);return Number.isFinite(r)?Ks.calculateStrokeColor(r,e._colorStops,!0===e.colorstop_gradient):void 0}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback()}render({config:e}=this){const t=ze.getJsTemplateOrValue({entity_index:0},e?.styles),r=Ie.toStyleDict(t);return U`
      <ha-card @click=${e=>this.handlePopup(e,this.entities[0])} style=${me(r)}>
        <div class="container" id="container">${this._renderSvg()}</div>

      </ha-card>
    `}_renderSvgDefs(){return q`
      <defs>
        <filter id="fhs-inset-1" x="-50%" y="-50%" width="400%" height="400%">
          <feComponentTransfer in="SourceAlpha">
            <feFuncA type="table" tableValues="1 0"></feFuncA>
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="1"></feGaussianBlur>
          <feOffset dx="0" dy="1" result="offsetblur"></feOffset>
          <feFlood flood-color="rgba(0, 0, 0, 0.3)" result="color"></feFlood>
          <feComposite in2="offsetblur" operator="in"></feComposite>
          <feComposite in2="SourceAlpha" operator="in"></feComposite>
          <feMerge>
            <feMergeNode in="SourceGraphic"></feMergeNode>
            <feMergeNode></feMergeNode>
          </feMerge>
        </filter>

        <filter id="fhs-inset-2">
          <feOffset dx="1" dy="1"></feOffset>
          <feGaussianBlur stdDeviation="0.5" result="offset-blur"></feGaussianBlur>
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"></feComposite>
          <feFlood flood-color="black" flood-opacity="0.4" result="color"></feFlood>
          <feComposite operator="in" in="color" in2="inverse" result="shadow"></feComposite>
          <feComposite operator="over" in="shadow" in2="SourceGraphic"></feComposite>
        </filter>
      </defs>
    `}_renderSvg(){const e=this.config.card_filter?this.config.card_filter:"card--filter-none";return q`
        <svg xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
            class="${e}"
          viewBox='0 0 ${this.viewBox.width} ${this.viewBox.height}'>
            ${this._renderSvgDefs()}
            <g id="rectangles" class="rectangles">
              ${this._renderRectangles()}
            </g>
            <g id="circles" class="circles">
              ${this._renderCircles()}
            </g>
          ${this._renderHorseshoeGauges()}
            <g id="datagroup" class="datagroup">
              ${this._renderLines()}
              ${this._renderIcons()}
              ${this._renderEntityAreas()}
              ${this._renderEntityNames()}
              ${this._renderEntityStates()}
            </g>
        </svg>
      `}_renderHorseshoeGauges(){return q`
    ${this.horseshoeGauges?.map((e=>e.render()))??q``}
  `}_renderEntityName(e){const t=e.entity_index??0,r=ze.getJsTemplateOrValue(e,e.styles),i={"font-size":"1.5em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...Ie.toStyleDict(r)},s={...this.animations?.names?.[e.animation_id]??{}},o=this._getItemColorFromStops(e);o&&(s.stroke=o);const a={...i,...s},n=this.textEllipsis(this._buildName(this.entities[e.entity_index],this.resolvedEntityConfigs[e.entity_index]),e?.max_characters??e?.ellipsis);return q`
      <g
          transform="${this._getGroupScaleTransform(e)}"
          style="${this._getGroupScaleStyle(e)}"
          >
          <text
            @click=${e=>this.handlePopup(e,this.entities[t])}
            >
              <tspan
                class="entity__name"
                x="${e.svg.xpos}"
                y="${e.svg.ypos}"
                style=${me(a)}>
                ${n}</tspan>
          </text>
          </g>
        `}_renderEntityNames(){const{layout:e}=this.config;if(!e?.names)return q``;const t=e.names.map((e=>this._renderEntityName(e)));return q`${t}`}_renderEntityArea(e){const t=e.entity_index??0,r=ze.getJsTemplateOrValue(e,e.styles),i={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...Ie.toStyleDict(r)},s={...Ie.toStyleDict(this.animations?.areas?.[e.animation_id]??{})},o=this._getItemColorFromStops(e);o&&(s.stroke=o);const a={...i,...s},n=this.textEllipsis(this._buildArea(this.entities[e.entity_index],this.resolvedEntityConfigs[e.entity_index]),e?.max_characters??e?.ellipsis);return q`
      <g
        transform="${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
        <text
          @click=${e=>this.handlePopup(e,this.entities[t])}
          >
            <tspan
              class="entity__area"
              x="${e.svg.xpos}"
              y="${e.svg.ypos}"
              style=${me(a)}>
              ${n}</tspan>
        </text>
      </g>
      `}_renderEntityAreas(){const{layout:e}=this.config;if(!e?.areas)return q``;const t=e.areas.map((e=>this._renderEntityArea(e)));return q`${t}`}_getGroupScaleTransform(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;if(!t?.scale&&!e?.flip)return"";const r=t?.scale?.x??t?.scale??1,i=t?.scale?.y??t?.scale??1;return`scale(${r*("x"===e?.flip||"both"===e?.flip?-1:1)}, ${i*("y"===e?.flip||"both"===e?.flip?-1:1)})`}_getGroupScaleStyle(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;return t?.scale&&t.svg?`transform-origin:${t.svg.xpos}px ${t.svg.ypos}px; transform-box:view-box;`:`transform-origin:${e.svg.xpos}px ${e.svg.ypos}px; transform-box:view-box;`}_renderEntityState(e){if(!e)return q``;const t=e.entity_index??0,r=e.svg.xpos??Ys,i=e.svg.ypos??Ys,s=e.dx?e.dx:"0",o=e.dy?e.dy:"0",a=ze.getJsTemplateOrValue(e,e.styles),n=Ie.toStyleDict(a),l=e.uom??{},c=ze.getJsTemplateOrValue(e,l.styles),h=Ie.toStyleDict(c),u=l.dx??"0.1",d=l.dy??"-0.45";let m={};this.animations?.states?.[e.animation_id]&&(m={...this.animations.states[e.animation_id]});const p=this._getItemColorFromStops(e);p&&(m.fill=p);const g={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...n,...m},f=g["font-size"];let y=.5,b="em";const v=String(f).trim().match(/^(\d*\.?\d+)([a-z%]+)$/i);v?(y=.6*Number(v[1]),b=v[2]):console.error("Cannot determine font-size for state",f);const _={"font-size":`${y}${b}`},w={...g,opacity:"0.7",..._,...h},x=this.entities[t],$=this.resolvedEntityConfigs[t]??{},k=this._formatEntityStateParts(x,$);let S="",M="";k.forEach((e=>{"unit"===e.type?M+=e.value:"value"===e.type&&(S+=e.value)})),S=S.trim(),M=M.trim();const A=this._buildUom(x,$,M);return q`
      <g
        transform="${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
        <text @click=${e=>this.handlePopup(e,this.entities[t])}>
          <tspan
            class="state__value"
            x="${r}"
            y="${i}"
            dx="${s}em"
            dy="${o}em"
            style=${me(g)}
          >${S}</tspan><tspan
            class="state__uom"
            dx="${u}em"
            dy="${d}em"
            style=${me(w)}
          >${A}</tspan>
        </text>
      </g>
    `}_renderEntityStates(){const{layout:e}=this.config;if(!e)return;if(!e.states)return;const t=e.states.map((e=>q`
            ${this._renderEntityState(e)}
          `));return q`${t}`}updated(e){super.updated?.(e),this._injectSvgUrlIcons()}_isSvgUrl(e){return e.endsWith(".svg")}_isUrlIcon(e){return"string"==typeof e&&/^url\(['"]?.+['"]?\)$/i.test(e.trim())}_renderCachedSvgUrlIcon(e,t,r,i,s,o,a,n){const l=this.svgUrlCache[r].cloneNode(!0),c=e.rotate??0,h=s/24,u=o-s*n+12*h,d=a-.5*s-(e.yposc?0:.25*s)+12*h;return l.classList.remove("hidden"),q`
    <g
      transform="${this._getGroupScaleTransform(e)}"
      style="${this._getGroupScaleStyle(e)}"
    >
      <g
        class="icon-position"
        transform="translate(${u} ${d})"
        @click=${t=>this.handlePopup(t,this.entities[e.entity_index])}
      >
        <rect
          x="${-s/2}"
          y="${-s/2}"
          height="${s}px"
          width="${s}px"
          stroke-width="0px"
          fill="rgba(0,0,0,0)"
        ></rect>

        <g class="icon-style-animation" style="${me(i)}">
          <g class="icon-rotate" transform="rotate(${c})">
            <svg
              x="${-s/2}"
              y="${-s/2}"
              width="${s}"
              height="${s}"
              viewBox="0 0 24 24"
              overflow="visible"
            >
              ${l}
            </svg>
          </g>
        </g>
      </g>
    </g>
  `}_getUrlFromCssUrl(e){return e.trim().replace(/^url\(['"]?/i,"").replace(/['"]?\)$/,"")}_renderSvgUrlPlaceholder(e,t,r,i,s,o){const a=e.rotate??0,n=r/24,l=i-r*o+12*n,c=s-.5*r-(e.yposc?0:.25*r)+12*n;return q`
    <g
      transform="${this._getGroupScaleTransform(e)}"
      style="${this._getGroupScaleStyle(e)}"
    >
      <g class="icon-position" transform="translate(${l} ${c})">
        <g class="icon-rotate" transform="rotate(${a})">
          <g class="icon-scale" transform="scale(${n})">
            <g class="icon-center" transform="translate(-12 -12)">
              <svg
                class="icon-svg-url hidden"
                data-src="${t}"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <image
                  href="${t}"
                  width="24"
                  height="24"
                />
              </svg>
            </g>
          </g>
        </g>
      </g>
    </g>
  `}_injectSvgUrlIcons(){const e=this.shadowRoot.querySelectorAll("svg.icon-svg-url[data-src]:not(.injected-svg)");e.length&&function(e,t){var r=void 0===t?{}:t,i=r.afterAll,s=void 0===i?function(){}:i,o=r.afterEach,a=void 0===o?function(){}:o,n=r.beforeEach,l=void 0===n?function(){}:n,c=r.cacheRequests,h=void 0===c||c,u=r.evalScripts,d=void 0===u?"never":u,m=r.httpRequestWithCredentials,p=void 0!==m&&m,g=r.renumerateIRIElements,f=void 0===g||g;if(e&&"length"in e)for(var y=0,b=0,v=e.length;b<v;b++){var _=e[b];_&&Te(_,d,f,h,p,l,(function(t,r){a(t,r),e&&"length"in e&&e.length===++y&&s(y)}))}else e?Te(e,d,f,h,p,l,(function(t,r){a(t,r),s(1),e=null})):s(0)}(e,{beforeEach(e){e.removeAttribute("height"),e.removeAttribute("width")},afterEach:(e,t)=>{if(e||!t)return;const r=t.dataset.src;r&&(this.svgUrlCache[r]=t.cloneNode(!0))},afterAll:()=>{this.requestUpdate()},cacheRequests:!1,evalScripts:"once",httpRequestWithCredentials:!1,renumerateIRIElements:!1})}_renderSvgUrlIcon(e,t,r,i,s,o,a,n){return this.svgUrlCache[r]?this._renderCachedSvgUrlIcon(e,t,r,i,s,o,a,n):this._renderSvgUrlPlaceholder(e,r,s,o,a,n)}_renderImageUrlIcon(e,t,r,i,s,o,a,n){const l=e.rotate??0,c=s/24,h=o-s*n+12*c,u=a-.5*s-(e.yposc?0:.25*s)+12*c;return q`
    <g
      transform="${this._getGroupScaleTransform(e)}"
      style="${this._getGroupScaleStyle(e)}"
    >
      <g
        class="icon-position"
        transform="translate(${h} ${u})"
        @click=${t=>this.handlePopup(t,this.entities[e.entity_index])}
      >
        <rect
          x="${-s/2}"
          y="${-s/2}"
          height="${s}px"
          width="${s}px"
          stroke-width="0px"
          fill="rgba(0,0,0,0)"
        ></rect>

        <g class="icon-style-animation" style="${me(i)}">
          <g class="icon-rotate" transform="rotate(${l})">
            <g class="icon-scale" transform="scale(${c})">
              <g class="icon-center" transform="translate(-12 -12)">
                <image
                  href="${r}"
                  width="24"
                  height="24"
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  `}computeEntityColor(e){if(!e||"off"===e.state||"unavailable"===e.state||"unknown"===e.state)return"var(--state-icon-color)";const t=e.state;if(!isNaN(t)||t.endsWith("W")||t.endsWith("kWh")||t.endsWith("V"))return"var(--state-icon-color)";const r=e.entity_id.split(".")[0],i=e.attributes.device_class;if("sensor"===r)return"var(--state-icon-color)";if("light"===r&&e.attributes.rgb_color&&"on"===t){const[t,r,i]=e.attributes.rgb_color;return`rgb(${t}, ${r}, ${i})`}return"binary_sensor"===r&&i&&"on"===t?`var(--state-binary_sensor-${i}-on-color, var(--state-icon-active-color))`:"climate"===r?`var(--state-climate-${t}-color, var(--state-icon-active-color))`:"on"===t?`var(--state-${r}-active-color, var(--state-${r}-color, var(--state-icon-active-color)))`:"var(--state-icon-color)"}_renderIcon(e,t){if(!e)return;e.entity=e.entity?e.entity:0,this.iconCache||={},this.iconsSvg||=[],this.pendingIconPath||=[];const r=12*(e.icon_size?e.icon_size:e.size?e.size:2),i=e.svg.xpos,s=e.svg.ypos,o=e.align?e.align:"center",a="center"===o?.5:"start"===o?-1:1;let n=i-r*a,l=s-r*a,c=r;const h=e.entity_index??0,u=this.entities[h],d=this._getStateMapItem(e,u);d&&(e=eo.mergeDeep(e,d));const m=Ks.getHaEntityIconStyle(u),p={};p.fill=m.fill,p.color=m.color,p.filter=m.filter;const g=ze.getJsTemplateOrValue(e,e.styles);let f=Ie.toStyleDict(g);const y=this.animations?.icons?.[e.animation_id]??{},b=this._getItemColorFromStops(e);b&&(f.fill=b,f.color=b),f={...p,...f,...y};const v=this._buildMyIcon(this.entities[h],this.resolvedEntityConfigs[h],d,this.animations?.iconsIcon?.[e.animation_id]);if(this._isUrlIcon(v)){const t=this._getUrlFromCssUrl(v);return this._isSvgUrl(t)?this._renderSvgUrlIcon(e,h,t,f,r,i,s,a):this._renderImageUrlIcon(e,h,t,f,r,i,s,a)}if(this.iconCache[v])this.iconsSvg[t]=this.iconCache[v];else if(this.iconsSvg[t]=void 0,this.pendingIconPath[t]!==v){this.pendingIconPath[t]=v;let e=0;const r=40,i=50,s=()=>{if(this.pendingIconPath[t]!==v)return;const o=this._getRenderedHaIconPath(t);if(o)return this.iconsSvg[t]=o,this.iconCache[v]=o,this.pendingIconPath[t]=void 0,void this.requestUpdate();e+=1,e>=r?this.pendingIconPath[t]=void 0:window.setTimeout(s,i)};(this?.updateComplete&&"function"==typeof this.updateComplete.then||this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((e=>window.requestAnimationFrame(e)))).then((()=>{window.setTimeout(s,0)}))}const _=this.iconsSvg[t];if(_){const o=i-r*a,n=s-.5*r-(e.yposc?0:.25*r),l=r/24,c=e.rotate??0,h=o+12*l,u=n+12*l;return f["transform-origin"]??="0 0",q`
      <g
        transform="${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
        <g
          id="icon-rendered-${this.iconsId[t]}"
          class="icon-position"
          transform="translate(${h} ${u})"
          @click=${t=>this.handlePopup(t,this.entities[e.entity_index])}
        >
          <rect
            x="${-r/2}"
            y="${-r/2}"
            height="${r}px"
            width="${r}px"
            stroke-width="0px"
            fill="rgba(0,0,0,0)"
          ></rect>

          <g class="icon-style-animation" style="${me(f)}">
            <g class="icon-rotate" transform="rotate(${c})">
              <g class="icon-scale" transform="scale(${l})">
                <g class="icon-center" transform="translate(-12 -12)">
                  <path d="${_}"></path>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      `}return q`
    <foreignObject
      width="0px"
      height="0px"
      x="${n}"
      y="${l}"
      overflow="hidden"
    >
      <body>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          class="div__icon hover"
          style="
            line-height: ${c}px;
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
            id="icon-${this.iconsId[t]}"
          ></ha-icon>
        </div>
      </body>
    </foreignObject>
  `}_getRenderedHaIconPath(e){const t=this.shadowRoot.getElementById(`icon-${this.iconsId[e]}`);return t?.shadowRoot?.querySelector("*")?.path}_scheduleIconPathRead(e,t){if(!e)return;if(this.iconCache[e])return void(this.iconsSvg[t]=this.iconCache[e]);if(this.pendingIconPath[t]===e)return;this.pendingIconPath[t]=e;let r=0;const i=()=>{if(this.pendingIconPath[t]!==e)return;if(this.iconCache[e])return this.iconsSvg[t]=this.iconCache[e],this.pendingIconPath[t]=void 0,void this.requestUpdate();const s=this._getRenderedHaIconPath();if(s)return this.iconsSvg[t]=s,this.iconCache[e]=s,this.pendingIconPath[t]=void 0,void this.requestUpdate();r+=1,r>=40?this.pendingIconPath[t]=void 0:this._iconPathTimer=window.setTimeout(i,50)};(this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((e=>{window.requestAnimationFrame(e)}))).then((()=>{this._iconPathTimer=window.setTimeout(i,0)}))}_renderIcons(){const{layout:e}=this.config;if(!e)return;if(!e.icons)return;const t=e.icons.map(((e,t)=>q`
            ${this._renderIcon(e,t)}
          `));return q`${t}`}_renderLines(){return q`
      ${this.lineTools?.map((e=>e.render()))??q``}
    `}_renderCircle(e){const t=e.entity_index??0,r=ze.getJsTemplateOrValue(e,e.styles),i={...Ie.toStyleDict(r)},s={...Ie.toStyleDict(this.animations?.circles?.[e.animation_id]??{})},o=this._getItemColorFromStops(e);o&&(s.stroke=o);const a={...i,...s};return q`
      <g
        transform="${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
        <circle
          @click=${e=>this.handlePopup(e,this.entities[t])}
          class="svg__dot"
          cx="${e.svg.xpos}"
          cy="${e.svg.ypos}"
          r="${e.svg.radius}"
          style=${me(a)}
        ></circle>
      </g>
    `}_renderCircles(){const{layout:e}=this.config;if(!e?.circles)return q``;const t=e.circles.map((e=>this._renderCircle(e)));return q`${t}`}_renderRectangles(){return q`
      ${this.rectangleTools?.map((e=>e.render()))??q``}
    `}_handleClick(e,t,r,i,s){let o;switch(i.action){case"more-info":o=new Event("hass-more-info",{composed:!0}),o.detail={entityId:s},e.dispatchEvent(o);break;case"navigate":if(!i.navigation_path)return;window.history.pushState(null,"",i.navigation_path),o=new Event("location-changed",{composed:!0}),o.detail={replace:!1},window.dispatchEvent(o);break;case"call-service":{if(!i.service)return;const[e,r]=i.service.split(".",2),s={...i.service_data};t.callService(e,r,s);break}case"fire-dom-event":o=new Event("ll-custom",{composed:!0,bubbles:!0}),o.detail=i,e.dispatchEvent(o)}}handlePopup(e,t){e.stopPropagation();const r=this.resolvedEntityConfigs.find((e=>e.entity===t.entity_id)),i=r?.tap_action??this.config?.tap_action??{action:"more-info"};this._handleClick(this,this._hass,this.config,i,t.entity_id)}textEllipsis(e,t){return t&&t<e.length?e.slice(0,t-1).concat("..."):e}_buildArea(e,t){if(t.area)return t.area;if(!this._hass||!this._hass.areas)return"";const r=this._hass.entities&&this._hass.entities[t.entity];let i=r?r.area_id:null;if(!i&&r&&r.device_id&&this._hass.devices){const e=this._hass.devices[r.device_id];i=e?e.area_id:null}if(i){const e=this._hass.areas[i];return e?e.name:""}return"?"}_buildName(e,t){return t.name??e.attributes.friendly_name??e?.entity_id??"?"}_buildIcon(e,t,r){return r||t?.icon||e?.attributes?.icon||qe(e)}_buildUom(e,t,r){return t.unit||r||""}_buildState(e,t){if(void 0===e)return e;if(null===e)return e;if(t.convert){let r,i,s=t.convert.match(/(^\w+)\((\d+)\)/);switch(null===s?r=t.convert:3===s.length&&(r=s[1],i=Number(s[2])),r){case"brightness_pct":e="undefined"===e?"undefined":`${Math.round(e/255*100)}`;break;case"multiply":e=`${Math.round(e*i)}`;break;case"divide":e=`${Math.round(e/i)}`;break;case"rgb_csv":case"rgb_hex":if(t.attribute){let i=this._hass.states[t.entity];switch(i.attributes.color_mode){case"unknown":case"onoff":case"brightness":case"white":break;case"color_temp":if(i.attributes.color_temp_kelvin){let t=Os(i.attributes.color_temp_kelvin);const s=Ts(t);s[1]<.4&&(s[1]<.1?s[2]=225:s[1]=.4),t=Is(s),t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:Ns(t)}else e="rgb_csv"===r?"255,255,255":"#ffffff00";break;case"hs":{let t=zs([i.attributes.hs_color[0],i.attributes.hs_color[1]/100]);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:Ns(t)}break;case"rgb":{const t=Ts(this.stateObj.attributes.rgb_color);t[1]<.4&&(t[1]<.1?t[2]=225:t[1]=.4);const i=Is(t);e="rgb_csv"===r?i.toString():Ns(i)}break;case"rgbw":{let t=(e=>{const[t,r,i,s]=e;return Vs([t,r,i,s],[t+s,r+s,i+s])})(i.attributes.rgbw_color);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:Ns(t)}break;case"rgbww":{let t=Ls(i.attributes.rgbww_color,i.attributes?.min_color_temp_kelvin,i.attributes?.max_color_temp_kelvin);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:Ns(t)}break;case"xy":if(i.attributes.hs_color){let t=zs([i.attributes.hs_color[0],i.attributes.hs_color[1]/100]);const s=Ts(t);s[1]<.4&&(s[1]<.1?s[2]=225:s[1]=.4),t=Is(s),t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:Ns(t)}else if(i.attributes.color){let t={};t.l=i.attributes.brightness,t.h=i.attributes.color.h||i.attributes.color.hue,t.s=i.attributes.color.s||i.attributes.color.saturation;let{r:s,g:o,b:a}=Ks.hslToRgb(t);if("rgb_csv"===r)e=`${s},${o},${a}`;else{e=`#${Ks.padZero(s.toString(16))}${Ks.padZero(o.toString(16))}${Ks.padZero(a.toString(16))}`}}else i.attributes.xy_color}}break;default:console.error(`Unknown converter [${r}] specified for entity [${t.entity}]!`)}}return void 0!==e?Number.isNaN(e)?e:e.toString():void 0}_computeEntity(e){return e.substr(e.indexOf(".")+1)}getCardSize(){return 4}}customElements.get("flex-horseshoe-card")||customElements.define("flex-horseshoe-card",Go);

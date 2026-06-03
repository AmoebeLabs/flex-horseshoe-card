/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),a=new WeakMap;let o=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const r=this.t;if(t&&void 0===e){const t=void 0!==r&&1===r.length;t&&(e=a.get(r)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&a.set(r,e))}return e}toString(){return this.cssText}};const s=(e,...t)=>{const a=1===e.length?e[0]:t.reduce(((t,r,a)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[a+1]),e[0]);return new o(a,e,r)},i=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,r))(t)})(e):e
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,m=globalThis,p=m.trustedTypes,g=p?p.emptyScript:"",f=m.reactiveElementPolyfillSupport,b=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},y=(e,t)=>!n(e,t),_={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),a=this.getPropertyDescriptor(e,r,t);void 0!==a&&l(this.prototype,e,a)}}static getPropertyDescriptor(e,t,r){const{get:a,set:o}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:a,set(t){const s=a?.call(this);o?.call(this,t),this.requestUpdate(e,s,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...d(e),...h(e)];for(const r of t)this.createProperty(r,e[r])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,r]of t)this.elementProperties.set(e,r)}this._$Eh=new Map;for(const[t,r]of this.elementProperties){const e=this._$Eu(t,r);void 0!==e&&this._$Eh.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(i(e))}else void 0!==e&&t.push(i(e));return t}static _$Eu(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((r,a)=>{if(t)r.adoptedStyleSheets=a.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const t of a){const a=document.createElement("style"),o=e.litNonce;void 0!==o&&a.setAttribute("nonce",o),a.textContent=t.cssText,r.appendChild(a)}})(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){const r=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,r);if(void 0!==a&&!0===r.reflect){const o=(void 0!==r.converter?.toAttribute?r.converter:v).toAttribute(t,r.type);this._$Em=e,null==o?this.removeAttribute(a):this.setAttribute(a,o),this._$Em=null}}_$AK(e,t){const r=this.constructor,a=r._$Eh.get(e);if(void 0!==a&&this._$Em!==a){const e=r.getPropertyOptions(a),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=a;const s=o.fromAttribute(t,e.type);this[a]=s??this._$Ej?.get(a)??s,this._$Em=null}}requestUpdate(e,t,r,a=!1,o){if(void 0!==e){const s=this.constructor;if(!1===a&&(o=this[e]),r??=s.getPropertyOptions(e),!((r.hasChanged??y)(o,t)||r.useDefault&&r.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,r))))return;this.C(e,t,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:a,wrapped:o},s){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),!0!==o||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),!0===a&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,r]of e){const{wrapped:e}=r,a=this[t];!0!==e||this._$AL.has(t)||void 0===a||this.C(t,void 0,r,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[b("elementProperties")]=new Map,w[b("finalized")]=new Map,f?.({ReactiveElement:w}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,$=x.trustedTypes,S=$?$.createPolicy("flex-horseshoe-card-lit-html",{createHTML:e=>e}):void 0,M="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,A="?"+k,C=`<${A}>`,N=document,E=()=>N.createComment(""),z=e=>null===e||"object"!=typeof e&&"function"!=typeof e,T=Array.isArray,I="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,j=/>/g,D=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),V=/'/g,R=/"/g,H=/^(?:script|style|textarea|title)$/i,L=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),U=L(1),q=L(2),F=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),B=new WeakMap,W=N.createTreeWalker(N,129);function J(e,t){if(!T(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const X=(e,t)=>{const r=e.length-1,a=[];let o,s=2===t?"<svg>":3===t?"<math>":"",i=P;for(let n=0;n<r;n++){const t=e[n];let r,l,c=-1,d=0;for(;d<t.length&&(i.lastIndex=d,l=i.exec(t),null!==l);)d=i.lastIndex,i===P?"!--"===l[1]?i=O:void 0!==l[1]?i=j:void 0!==l[2]?(H.test(l[2])&&(o=RegExp("</"+l[2],"g")),i=D):void 0!==l[3]&&(i=D):i===D?">"===l[0]?(i=o??P,c=-1):void 0===l[1]?c=-2:(c=i.lastIndex-l[2].length,r=l[1],i=void 0===l[3]?D:'"'===l[3]?R:V):i===R||i===V?i=D:i===O||i===j?i=P:(i=D,o=void 0);const h=i===D&&e[n+1].startsWith("/>")?" ":"";s+=i===P?t+C:c>=0?(a.push(r),t.slice(0,c)+M+t.slice(c)+k+h):t+k+(-2===c?n:h)}return[J(e,s+(e[r]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),a]};class Y{constructor({strings:e,_$litType$:t},r){let a;this.parts=[];let o=0,s=0;const i=e.length-1,n=this.parts,[l,c]=X(e,t);if(this.el=Y.createElement(l,r),W.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(a=W.nextNode())&&n.length<i;){if(1===a.nodeType){if(a.hasAttributes())for(const e of a.getAttributeNames())if(e.endsWith(M)){const t=c[s++],r=a.getAttribute(e).split(k),i=/([.?@])?(.*)/.exec(t);n.push({type:1,index:o,name:i[2],strings:r,ctor:"."===i[1]?te:"?"===i[1]?re:"@"===i[1]?ae:ee}),a.removeAttribute(e)}else e.startsWith(k)&&(n.push({type:6,index:o}),a.removeAttribute(e));if(H.test(a.tagName)){const e=a.textContent.split(k),t=e.length-1;if(t>0){a.textContent=$?$.emptyScript:"";for(let r=0;r<t;r++)a.append(e[r],E()),W.nextNode(),n.push({type:2,index:++o});a.append(e[t],E())}}}else if(8===a.nodeType)if(a.data===A)n.push({type:2,index:o});else{let e=-1;for(;-1!==(e=a.data.indexOf(k,e+1));)n.push({type:7,index:o}),e+=k.length-1}o++}}static createElement(e,t){const r=N.createElement("template");return r.innerHTML=e,r}}function Z(e,t,r=e,a){if(t===F)return t;let o=void 0!==a?r._$Co?.[a]:r._$Cl;const s=z(t)?void 0:t._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),void 0===s?o=void 0:(o=new s(e),o._$AT(e,r,a)),void 0!==a?(r._$Co??=[])[a]=o:r._$Cl=o),void 0!==o&&(t=Z(e,o._$AS(e,t.values),o,a)),t}class K{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,a=(e?.creationScope??N).importNode(t,!0);W.currentNode=a;let o=W.nextNode(),s=0,i=0,n=r[0];for(;void 0!==n;){if(s===n.index){let t;2===n.type?t=new Q(o,o.nextSibling,this,e):1===n.type?t=new n.ctor(o,n.name,n.strings,this,e):6===n.type&&(t=new oe(o,this,e)),this._$AV.push(t),n=r[++i]}s!==n?.index&&(o=W.nextNode(),s++)}return W.currentNode=N,a}p(e){let t=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}let Q=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,a){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Z(this,e,t),z(e)?e===G||null==e||""===e?(this._$AH!==G&&this._$AR(),this._$AH=G):e!==this._$AH&&e!==F&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>T(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==G&&z(this._$AH)?this._$AA.nextSibling.data=e:this.T(N.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:r}=e,a="number"==typeof r?this._$AC(e):(void 0===r.el&&(r.el=Y.createElement(J(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===a)this._$AH.p(t);else{const e=new K(a,this),r=e.u(this.options);e.p(t),this.T(r),this._$AH=e}}_$AC(e){let t=B.get(e.strings);return void 0===t&&B.set(e.strings,t=new Y(e)),t}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let a,o=0;for(const s of t)o===r.length?r.push(a=new e(this.O(E()),this.O(E()),this,this.options)):a=r[o],a._$AI(s),o++;o<r.length&&(this._$AR(a&&a._$AB.nextSibling,o),r.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}};class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,a,o){this.type=1,this._$AH=G,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=o,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=G}_$AI(e,t=this,r,a){const o=this.strings;let s=!1;if(void 0===o)e=Z(this,e,t,0),s=!z(e)||e!==this._$AH&&e!==F,s&&(this._$AH=e);else{const a=e;let i,n;for(e=o[0],i=0;i<o.length-1;i++)n=Z(this,a[r+i],t,i),n===F&&(n=this._$AH[i]),s||=!z(n)||n!==this._$AH[i],n===G?e=G:e!==G&&(e+=(n??"")+o[i+1]),this._$AH[i]=n}s&&!a&&this.j(e)}j(e){e===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===G?void 0:e}}class re extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==G)}}class ae extends ee{constructor(e,t,r,a,o){super(e,t,r,a,o),this.type=5}_$AI(e,t=this){if((e=Z(this,e,t,0)??G)===F)return;const r=this._$AH,a=e===G&&r!==G||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==G&&(r===G||a);a&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){Z(this,e)}}const se=x.litHtmlPolyfillSupport;se?.(Y,Q),(x.litHtmlVersions??=[]).push("3.3.2");const ie=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ne=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,r)=>{const a=r?.renderBefore??t;let o=a._$litPart$;if(void 0===o){const e=r?.renderBefore??null;a._$litPart$=o=new Q(t.insertBefore(E(),e),e,void 0,r??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}};ne._$litElement$=!0,ne.finalized=!0,ie.litElementHydrateSupport?.({LitElement:ne});const le=ie.litElementPolyfillSupport;le?.({LitElement:ne}),(ie.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce=1;let de=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,r){this._$Ct=e,this._$AM=t,this._$Ci=r}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const he="important",ue=" !"+he,me=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends de{constructor(e){if(super(e),e.type!==ce||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce(((t,r)=>{const a=e[r];return null==a?t:t+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${a};`}),"")}update(e,[t]){const{style:r}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const a of this.ft)null==t[a]&&(this.ft.delete(a),a.includes("-")?r.removeProperty(a):r[a]=null);for(const a in t){const e=t[a];if(null!=e){this.ft.add(a);const t="string"==typeof e&&e.endsWith(ue);a.includes("-")||t?r.setProperty(a,t?e.slice(0,-11):e,t?he:""):r[a]=e}}return F}});function pe(e,t,r){if(r||2===arguments.length)for(var a,o=0,s=t.length;o<s;o++)!a&&o in t||(a||(a=Array.prototype.slice.call(t,0,o)),a[o]=t[o]);return e.concat(a||Array.prototype.slice.call(t))}"function"==typeof SuppressedError&&SuppressedError;var ge,fe={};
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */var be=function(){if(ge)return fe;ge=1;var e=/; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g,t=/^[\u000b\u0020-\u007e\u0080-\u00ff]+$/,r=/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/,a=/\\([\u000b\u0020-\u00ff])/g,o=/([\\"])/g,s=/^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;function i(e){var a=String(e);if(r.test(a))return a;if(a.length>0&&!t.test(a))throw new TypeError("invalid parameter value");return'"'+a.replace(o,"\\$1")+'"'}function n(e){this.parameters=Object.create(null),this.type=e}return fe.format=function(e){if(!e||"object"!=typeof e)throw new TypeError("argument obj is required");var t=e.parameters,a=e.type;if(!a||!s.test(a))throw new TypeError("invalid type");var o=a;if(t&&"object"==typeof t)for(var n,l=Object.keys(t).sort(),c=0;c<l.length;c++){if(n=l[c],!r.test(n))throw new TypeError("invalid parameter name");o+="; "+n+"="+i(t[n])}return o},fe.parse=function(t){if(!t)throw new TypeError("argument string is required");var r="object"==typeof t?function(e){var t;"function"==typeof e.getHeader?t=e.getHeader("content-type"):"object"==typeof e.headers&&(t=e.headers&&e.headers["content-type"]);if("string"!=typeof t)throw new TypeError("content-type header is missing from object");return t}(t):t;if("string"!=typeof r)throw new TypeError("argument string is required to be a string");var o=r.indexOf(";"),i=-1!==o?r.slice(0,o).trim():r.trim();if(!s.test(i))throw new TypeError("invalid media type");var l=new n(i.toLowerCase());if(-1!==o){var c,d,h;for(e.lastIndex=o;d=e.exec(r);){if(d.index!==o)throw new TypeError("invalid parameter format");o+=d[0].length,c=d[1].toLowerCase(),34===(h=d[2]).charCodeAt(0)&&-1!==(h=h.slice(1,-1)).indexOf("\\")&&(h=h.replace(a,"$1")),l.parameters[c]=h}if(o!==r.length)throw new TypeError("invalid parameter format")}return l},fe}(),ve=new Map,ye=function(e){return e.cloneNode(!0)},_e=function(){return"file:"===window.location.protocol},we=function(e,t,r){var a=new XMLHttpRequest;a.onreadystatechange=function(){try{if(!/\.svg/i.test(e)&&2===a.readyState){var t=a.getResponseHeader("Content-Type");if(!t)throw new Error("Content type not found");var o=be.parse(t).type;if("image/svg+xml"!==o&&"text/plain"!==o)throw new Error("Invalid content type: ".concat(o))}if(4===a.readyState){if(404===a.status||null===a.responseXML)throw new Error(_e()?"Note: SVG injection ajax calls do not work locally without adjusting security settings in your browser. Or consider using a local webserver.":"Unable to load SVG file: "+e);if(!(200===a.status||_e()&&0===a.status))throw new Error("There was a problem injecting the SVG: "+a.status+" "+a.statusText);r(null,a)}}catch(s){if(a.abort(),!(s instanceof Error))throw s;r(s,a)}},a.open("GET",e),a.withCredentials=t,a.overrideMimeType&&a.overrideMimeType("image/svg+xml"),a.send()},xe={},$e=function(e,t){var r;null!==(r=xe[e])&&void 0!==r||(xe[e]=[]),xe[e].push(t)},Se=function(e,t,r){if(ve.has(e)){var a=ve.get(e);if(void 0===a)return void $e(e,r);if(a instanceof SVGSVGElement)return void r(null,ye(a))}ve.set(e,void 0),$e(e,r),we(e,t,(function(t,r){var a;t?ve.set(e,t):(null===(a=r.responseXML)||void 0===a?void 0:a.documentElement)instanceof SVGSVGElement&&ve.set(e,r.responseXML.documentElement),function(e){var t=xe[e];if(t)for(var r=function(r,a){setTimeout((function(){if(Array.isArray(xe[e])){var a=ve.get(e),o=t[r];if(!o)return;a instanceof SVGSVGElement&&o(null,ye(a)),a instanceof Error&&o(a),r===t.length-1&&delete xe[e]}}),0)},a=0,o=t.length;a<o;a++)r(a)}(e)}))},Me=function(e,t,r){we(e,t,(function(e,t){var a;e?r(e):(null===(a=t.responseXML)||void 0===a?void 0:a.documentElement)instanceof SVGSVGElement&&r(null,t.responseXML.documentElement)}))},ke="data:image/svg+xml",Ae=0,Ce=[],Ne={},Ee="http://www.w3.org/1999/xlink",ze=function(e,t,r,a,o,s,i){var n,l=null!==(n=e.getAttribute("data-src"))&&void 0!==n?n:e.getAttribute("src");if(l){if(-1!==Ce.indexOf(e))return Ce.splice(Ce.indexOf(e),1),void(e=null);Ce.push(e),e.setAttribute("src","");var c=l.indexOf("#"),d=-1!==c?l.slice(0,c):l,h=-1!==c?l.slice(c+1):null,u=function(e){if(!e.startsWith(ke))return null;var t,r=e.slice(18);if(r.startsWith(";base64,"))try{t=atob(r.slice(8))}catch(n){return new Error("Invalid base64 in data URL")}else if(r.startsWith(","))try{t=decodeURIComponent(r.slice(1))}catch(s){return new Error("Invalid encoding in data URL")}else{if(!r.startsWith(";charset=utf-8,"))return new Error("Unsupported data URL format");try{t=decodeURIComponent(r.slice(15))}catch(i){return new Error("Invalid encoding in data URL")}}var a=(new DOMParser).parseFromString(t,"image/svg+xml"),o=a.querySelector("parsererror");return o?new Error("Data URL SVG parse error: "+o.textContent.trim()):a.documentElement instanceof SVGSVGElement?a.documentElement:new Error("Data URL did not contain a valid SVG element")}(d);if(u instanceof Error)return Ce.splice(Ce.indexOf(e),1),e=null,void i(u);var m=function(a,o){var n,c;if(!o)return Ce.splice(Ce.indexOf(e),1),e=null,void i(a);var u=o;if(h){var m=function(e,t){var r=e.querySelector("#"+CSS.escape(t));if("symbol"!==(null==r?void 0:r.tagName.toLowerCase()))return null;for(var a=document.createElementNS("http://www.w3.org/2000/svg","svg"),o=r.attributes,s=0,i=o.length;s<i;s++){var n=o[s];"id"!==n.name&&a.setAttribute(n.name,n.value)}var l=r.childNodes;for(s=0,i=l.length;s<i;s++)a.appendChild(l[s].cloneNode(!0));return a}(o,h);if(!m)return Ce.splice(Ce.indexOf(e),1),e=null,void i(new Error('Symbol "'.concat(h,'" not found in ').concat(d)));u=m}var p=e.getAttribute("id");p&&u.setAttribute("id",p);var g=e.getAttribute("title");g&&u.setAttribute("title",g);var f=e.getAttribute("width");f&&u.setAttribute("width",f);var b=e.getAttribute("height");b&&u.setAttribute("height",b);var v=Array.from(new Set(pe(pe(pe([],(null!==(n=u.getAttribute("class"))&&void 0!==n?n:"").split(" "),!0),["injected-svg"],!1),(null!==(c=e.getAttribute("class"))&&void 0!==c?c:"").split(" "),!0))).join(" ").trim();u.setAttribute("class",v);var y=e.getAttribute("style");y&&u.setAttribute("style",y),u.setAttribute("data-src",l);var _=[].filter.call(e.attributes,(function(e){return/^data-\w[\w-]*$/.test(e.name)}));if(Array.prototype.forEach.call(_,(function(e){e.name&&e.value&&u.setAttribute(e.name,e.value)})),r){var w,x,$,S,M,k={clipPath:["clip-path"],"color-profile":["color-profile"],cursor:["cursor"],filter:["filter"],linearGradient:["fill","stroke"],marker:["marker","marker-start","marker-mid","marker-end"],mask:["mask"],path:[],pattern:["fill","stroke"],radialGradient:["fill","stroke"]},A=function(e,t){return e.replace(/url\((['"]?)\s*#([^\s'"\)]+)\s*\1\)/g,(function(e,r,a){var o=t[a];return o?"url(#".concat(o,")"):e}))},C=function(e,t){if(!e.startsWith("#"))return e;var r=t[e.slice(1)];return r?"#"+r:e},N=[],E={};Object.keys(k).forEach((function(e){w=e;for(var t=0,r=(x=u.querySelectorAll(w+"[id]")).length;t<r;t++){var a=x[t];S=a.id,M=S+"-"+ ++Ae,E[S]=M,N.push({element:a,currentId:S,newId:M})}})),Object.keys(k).forEach((function(e){var t;$=k[e],Array.prototype.forEach.call($,(function(e){for(var r=0,a=(t=u.querySelectorAll("["+e+"]")).length;r<a;r++){var o=t[r],s=o.getAttribute(e);if(s){var i=A(s,E);i!==s&&o.setAttribute(e,i)}}}))}));for(var z=u.querySelectorAll("*"),T=0,I=z.length;T<I;T++){var P=z[T],O=P.getAttribute("href");if(O){var j=C(O,E);j!==O&&P.setAttribute("href",j)}var D=P.getAttributeNS(Ee,"href");if(D){var V=C(D,E);V!==D&&P.setAttributeNS(Ee,"href",V)}}for(var R=u.querySelectorAll("[style]"),H=0,L=R.length;H<L;H++){var U=R[H],q=U.getAttribute("style");if(q){var F=A(q,E);F!==q&&U.setAttribute("style",F)}}for(var G=u.querySelectorAll("style"),B=0,W=G.length;B<W;B++){var J=G[B],X=J.textContent;if(X){var Y=A(X,E);Y!==X&&(J.textContent=Y)}}for(var Z=0,K=N.length;Z<K;Z++)N[Z].element.id=N[Z].newId}u.removeAttribute("xmlns:a");for(var Q,ee,te=u.querySelectorAll("script"),re=[],ae=0,oe=te.length;ae<oe;ae++){var se=te[ae];(ee=se.getAttribute("type"))&&"application/ecmascript"!==ee&&"application/javascript"!==ee&&"text/javascript"!==ee||((Q=se.innerText||se.textContent)&&re.push(Q),u.removeChild(se))}if(re.length>0&&("always"===t||"once"===t&&!Ne[l])){for(var ie=0,ne=re.length;ie<ne;ie++)new Function(re[ie])(window);Ne[l]=!0}var le=u.querySelectorAll("style");if(Array.prototype.forEach.call(le,(function(e){e.textContent+=""})),u.setAttribute("xmlns","http://www.w3.org/2000/svg"),u.setAttribute("xmlns:xlink",Ee),s(u),!e.parentNode)return Ce.splice(Ce.indexOf(e),1),e=null,void i(new Error("Parent node is null"));e.parentNode.replaceChild(u,e),Ce.splice(Ce.indexOf(e),1),e=null,i(null,u)};if(u)setTimeout((function(){m(null,u)}),0);else(a?Se:Me)(d,o,m)}else i(new Error("Invalid data-src or src attribute"))};class Te{static toStyleDict(e){return Te.toDict(e,{stringToDict:Te.cssStringToDict,mapValue:Te.toStyleValue})}static toClassDict(e){return Te.toDict(e,{stringToDict:Te.classStringToDict,mapValue:Boolean})}static toIconDict(e){return Te.toDict(e,{stringToDict:Te.stringToDefaultDict("default"),mapValue:String})}static toDict(e,t={}){const{stringToDict:r=Te.stringToDefaultDict("default"),mapValue:a=(e=>e),skipNull:o=!0,skipFalse:s=!0}=t,i=e=>null==e&&o||!1===e&&s?{}:Array.isArray(e)?e.reduce(((e,t)=>({...e,...i(t)})),{}):Te.isPlainObject(e)?Object.fromEntries(Object.entries(e).filter((([,e])=>(null!=e||!o)&&(!1!==e||!s))).map((([e,t])=>[e,a(t,e)]))):"string"==typeof e?r(e):{};return i(e)}static toStyleValue(e){return null==e?e:String(e).trim().replace(/;+$/,"")}static cssStringToDict(e){return String(e).split(";").map((e=>e.trim())).filter(Boolean).reduce(((e,t)=>{const r=t.indexOf(":");if(r<=0)return e;const a=t.slice(0,r).trim(),o=t.slice(r+1).trim();return a&&o?{...e,[a]:o}:e}),{})}static toColorStopDict(e){return Te.toDict(e,{stringToDict:Te.keyValueStringToDict,mapValue:String})}static keyValueStringToDict(e){const t=String(e).trim(),r=t.indexOf(":");if(r<=0)return{};const a=t.slice(0,r).trim(),o=t.slice(r+1).trim();return a&&o?{[a]:o}:{}}static classStringToDict(e){return String(e).trim().split(/\s+/).filter(Boolean).reduce(((e,t)=>({...e,[t]:!0})),{})}static stringToDefaultDict(e="default"){return t=>({[e]:String(t)})}static requireArray(e,t="value"){if(null==e)return[];if(!Array.isArray(e))throw new Error(`[config-helper] "${t}" must be an array.`);return e}static ensureArray(e){return null==e?[]:Array.isArray(e)?e:[e]}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}}class Ie{static context={};static setContext(e={}){Ie.context=e}static getJsTemplateOrValue(e,t,r={}){return Ie._getJsTemplateOrValue(e,t,r,0)}static _getJsTemplateOrValue(e,t,r={},a=0){const{resolveKeys:o=!0,maxDepth:s=10}=r;if(a>=s)return t;if(null==t)return t;if(["number","boolean","bigint","symbol"].includes(typeof t))return t;if(Array.isArray(t))return t.map((t=>Ie._getJsTemplateOrValue(e,t,r,a)));if(Ie.isPlainObject(t))return Object.fromEntries(Object.entries(t).map((([t,s])=>{const i=o?Ie._getJsTemplateOrValue(e,t,r,a):t,n=Ie._getJsTemplateOrValue(e,s,r,a);return[String(i),n]})));if("string"!=typeof t)return t;const i=t.trim();if(!Ie.isJsTemplate(i))return t;const n=Ie.evaluateJsTemplate(e,Ie.extractJsTemplateCode(i));return Ie._getJsTemplateOrValue(e,n,r,a+1)}static isJsTemplate(e){return"string"==typeof e&&e.trim().startsWith("[[[")&&e.trim().endsWith("]]]")}static extractJsTemplateCode(e){return String(e).trim().slice(3,-3).trim()}static evaluateJsTemplate(e,t){const{hass:r,config:a,entities:o=[]}=Ie.context,s=Ie._getItemEntityIndex(e),i=Ie._getTemplateState(e),n=o?.[s],l=r?.states,c=a?.variables??{},d=r?.user;a?.dev?.debug&&console.log("Evaluating JavaScript template with context:",{hass:r,config:a,entity:n,entities:o,states:l,state:i,variables:c,item:e,user:d});try{return new Function("hass","config","entity","entities","states","state","variables","item","user",`\n          "use strict";\n          ${t}\n        `)(r,a,n,o,l,i,c,e,d)}catch(h){return void(a?.dev?.debug&&console.error("[templates] JavaScript template error:",{error:h,item:e,javascript:t}))}}static _getTemplateState(e={}){const t=Ie._getItemEntityIndex(e),r=Ie.context.entities?.[t],a=Ie.context.config?.entities?.[t]||{};if(!r)return;const o=a.attribute;return o&&r.attributes&&void 0!==r.attributes[o]?r.attributes[o]:r.state}static _getItemEntityIndex(e={}){const t=Number(e.entity_index);return Number.isFinite(t)?t:0}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}}class Pe{static normalize(e){return e?Array.isArray(e)?{scales:{},colors:Pe.normalizeColors(e)}:!Pe.isPlainObject(e)||e.colors||e.scales?Pe.isPlainObject(e)?{...e,scales:Pe.normalizeScales(e.scales),colors:Pe.normalizeColors(e.colors)}:{scales:{},colors:[]}:{scales:{},colors:Pe.normalizeColors(e)}:{scales:{},colors:[]}}static normalizeScales(e){return Pe.isPlainObject(e)?Object.fromEntries(Object.entries(e).map((([e,t])=>[e,Pe.isPlainObject(t)?{...t}:t]))):{}}static normalizeColors(e){return e?Array.isArray(e)?e.flatMap((e=>Pe.normalizeColorArrayEntry(e))).filter(Boolean).sort(((e,t)=>e.value-t.value)):Pe.isPlainObject(e)?Object.entries(e).map((([e,t])=>Pe.normalizeColorPair(e,t))).filter(Boolean).sort(((e,t)=>e.value-t.value)):[]:[]}static normalizeColorArrayEntry(e){if(Pe.isPlainObject(e)&&Object.prototype.hasOwnProperty.call(e,"value")&&Object.prototype.hasOwnProperty.call(e,"color")){const t=Pe.normalizeColorEntry(e);return t?[t]:[]}return Pe.isPlainObject(e)?Object.entries(e).map((([e,t])=>Pe.normalizeColorPair(e,t))).filter(Boolean):[]}static normalizeColorPair(e,t){const r=Number(e);return Number.isFinite(r)?null==t?null:{value:r,color:String(t)}:null}static normalizeColorEntry(e){if(!Pe.isPlainObject(e))return null;const t=Number(e.value);return Number.isFinite(t)?void 0===e.color||null===e.color?null:{...e,value:t,color:String(e.color)}:null}static ensureMinimumStops(e,t){return e?.colors&&1===e.colors.length?{...e,colors:[e.colors[0],{value:t,color:e.colors[0].color}]}:e}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}static _testColorStopsNormalizer(){const e={entity_index:0},t=[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}];[{name:"FHC dict",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC dict with quoted keys",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC list of dicts",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC list of dicts with quoted keys",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC dict with template values",raw:{0:"[[[\n          return 'red';\n        ]]]",10:"[[[\n          return 'green';\n        ]]]",20:"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template values",raw:[{0:"[[[\n            return 'red';\n          ]]]"},{10:"[[[\n            return 'green';\n          ]]]"},{20:"[[[\n            return 'blue';\n          ]]]"}]},{name:"FHC dict with template keys",raw:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}},{name:"FHC dict with template keys and values",raw:{"[[[ return 0; ]]]":"[[[\n          return 'red';\n        ]]]","[[[ return 10; ]]]":"[[[\n          return 'green';\n        ]]]","[[[ return 20; ]]]":"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template keys and values",raw:[{"[[[ return 0; ]]]":"[[[\n            return 'red';\n          ]]]"},{"[[[ return 10; ]]]":"[[[\n            return 'green';\n          ]]]"},{"[[[ return 20; ]]]":"[[[\n            return 'blue';\n          ]]]"}]},{name:"Whole FHC color_stops as template returning dict",raw:"[[[\n        return {\n          0: 'red',\n          10: 'green',\n          20: 'blue',\n        };\n      ]]]"},{name:"Whole FHC color_stops as template returning list",raw:"[[[\n        return [\n          { 0: 'red' },\n          { 10: 'green' },\n          { 20: 'blue' },\n        ];\n      ]]]"},{name:"SAK v1 colorstops.colors dict",raw:{colors:{0:"red",10:"green",20:"blue"}}},{name:"SAK v1 colorstops.colors dict with template keys",raw:{colors:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}}},{name:"SAK v1 colorstops.colors dict with template values",raw:{colors:{0:"[[[\n            return 'red';\n          ]]]",10:"[[[\n            return 'green';\n          ]]]",20:"[[[\n            return 'blue';\n          ]]]"}}},{name:"SAK v2 colors list",raw:{scales:{default:{min:0,max:20}},colors:[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}]}},{name:"SAK v2 colors list unsorted",raw:{scales:{default:{min:0,max:20}},colors:[{value:20,color:"blue",rank:2},{value:0,color:"red",rank:1},{value:10,color:"green",rank:1}]}},{name:"SAK v2 colors list with template values",raw:{scales:{default:{min:"[[[\n              return 0;\n            ]]]",max:"[[[\n              return 20;\n            ]]]"}},colors:[{value:"[[[\n              return 0;\n            ]]]",color:"[[[\n              return 'red';\n            ]]]"},{value:"[[[\n              return 10;\n            ]]]",color:"[[[\n              return 'green';\n            ]]]"},{value:"[[[\n              return 20;\n            ]]]",color:"[[[\n              return 'blue';\n            ]]]"}]}},{name:"SAK v2 whole colors list as template",raw:{scales:{default:{min:0,max:20}},colors:"[[[\n          return [\n            { value: 0, color: 'red' },\n            { value: 10, color: 'green' },\n            { value: 20, color: 'blue' },\n          ];\n        ]]]"}}].forEach((r=>{const a=Ie.getJsTemplateOrValue(e,r.raw,{resolveKeys:!0}),o=Pe.normalize(a),s=o.colors.map((e=>({value:e.value,color:e.color}))),i=JSON.stringify(s)===JSON.stringify(t);console.log(`[colorstops test] ${i?"PASS":"FAIL"} - ${r.name}`,{raw:r.raw,resolved:a,normalized:o,simpleColors:s,expectedColors:t})}))}}const Oe="mdi:bookmark",je={air_quality:"mdi:air-filter",alert:"mdi:alert",calendar:"mdi:calendar",climate:"mdi:thermostat",configurator:"mdi:cog",conversation:"mdi:microphone-message",counter:"mdi:counter",datetime:"mdi:calendar-clock",date:"mdi:calendar",demo:"mdi:home-assistant",google_assistant:"mdi:google-assistant",group:"mdi:google-circles-communities",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_button:"mdi:gesture-tap-button",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",number:"mdi:ray-vertex",persistent_notification:"mdi:bell",plant:"mdi:Flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:palette",schedule:"mdi:calendar-clock",script:"mdi:script-text",select:"mdi:format-list-bulleted",sensor:"mdi:eye",simple_alarm:"mdi:bell",siren:"mdi:bullhorn",stt:"mdi:microphone-message",text:"mdi:form-textbox",time:"mdi:clock",timer:"mdi:timer-outline",tts:"mdi:speaker-message",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",zone:"mdi:map-marker-radius"},De={apparent_power:"mdi:flash",aqi:"mdi:air-filter",atmospheric_pressure:"mdi:thermometer-lines",carbon_dioxide:"mdi:molecule-co2",carbon_monoxide:"mdi:molecule-co",current:"mdi:current-ac",data_rate:"mdi:transmission-tower",data_size:"mdi:database",date:"mdi:calendar",distance:"mdi:arrow-left-right",duration:"mdi:progress-clock",energy:"mdi:lightning-bolt",frequency:"mdi:sine-wave",gas:"mdi:meter-gas",humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",irradiance:"mdi:sun-wireless",moisture:"mdi:water-percent",monetary:"mdi:cash",nitrogen_dioxide:"mdi:molecule",nitrogen_monoxide:"mdi:molecule",nitrous_oxide:"mdi:molecule",ozone:"mdi:molecule",pm1:"mdi:molecule",pm10:"mdi:molecule",pm25:"mdi:molecule",power:"mdi:flash",power_factor:"mdi:angle-acute",precipitation:"mdi:weather-rainy",precipitation_intensity:"mdi:weather-pouring",pressure:"mdi:gauge",reactive_power:"mdi:flash",signal_strength:"mdi:wifi",sound_pressure:"mdi:ear-hearing",speed:"mdi:speedometer",sulphur_dioxide:"mdi:molecule",temperature:"mdi:thermometer",timestamp:"mdi:clock",volatile_organic_compounds:"mdi:molecule",volatile_organic_compounds_parts:"mdi:molecule",voltage:"mdi:sine-wave",volume:"mdi:car-coolant-level",water:"mdi:water",weight:"mdi:weight",wind_speed:"mdi:weather-windy"},Ve=e=>e.substring(0,e.indexOf(".")),Re={10:"mdi:battery-10",20:"mdi:battery-20",30:"mdi:battery-30",40:"mdi:battery-40",50:"mdi:battery-50",60:"mdi:battery-60",70:"mdi:battery-70",80:"mdi:battery-80",90:"mdi:battery-90",100:"mdi:battery"},He=(e,t)=>{const r=Number(e);if(isNaN(r))return"off"===e?"mdi:battery":"on"===e?"mdi:battery-alert":"mdi:battery-unknown";const a=10*Math.round(r/10);return r<=5?"mdi:battery-alert-variant-outline":Re[a]},Le=e=>{const t=e?.attributes.device_class;if(t&&t in De)return De[t];if("battery"===t)return e?((e,t)=>{const r=e.state;return He(r)})(e):"mdi:battery";const r=e?.attributes.unit_of_measurement;return"°C"===r||"°F"===r?"mdi-thermometer":void 0},Ue=(e,t,r)=>{const a=t?.state;switch(e){case"alarm_control_panel":return(e=>{switch(e){case"armed_away":return"mdi:shield-lock";case"armed_vacation":return"mdi:shield-airplane";case"armed_home":return"mdi:shield-home";case"armed_night":return"mdi:shield-moon";case"armed_custom_bypass":return"mdi:security";case"pending":return"mdi:shield-outline";case"triggered":return"mdi:bell-ring";case"disarmed":return"mdi:shield-off";default:return"mdi:shield"}})(a);case"automation":return"off"===a?"mdi:robot-off":"mdi:robot";case"binary_sensor":return((e,t)=>{const r="off"===e;switch(t?.attributes.device_class){case"battery":return r?"mdi:battery":"mdi:battery-outline";case"battery_charging":return r?"mdi:battery":"mdi:battery-charging";case"carbon_monoxide":return r?"mdi:smoke-detector":"mdi:smoke-detector-alert";case"cold":return r?"mdi:thermometer":"mdi:Snowflake";case"connectivity":return r?"mdi:close-network-outline":"mdi:check-network-outline";case"door":return r?"mdi:door-closed":"mdi:door-open";case"garage_door":return r?"mdi:garage":"mdi:garage-open";case"power":case"plug":return r?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return r?"mdi:check-circle":"mdi:alert-circle";case"smoke":return r?"mdi:smoke-detector-variant":"mdi:smoke-detector-variant-alert";case"heat":return r?"mdi:thermometer":"mdi:fire";case"light":return r?"mdi:brightness-5":"mdi:brightness-7";case"lock":return r?"mdi:lock":"mdi:lock-open";case"moisture":return r?"mdi:water-off":"mdi:water";case"motion":return r?"mdi:motion-sensor-off":"mdi:motion-sensor";case"occupancy":return r?"mdi:home-outline":"mdi:Home";case"opening":return r?"mdi:square":"mdi:square-outline";case"presence":return r?"mdi:home-outline":"mdi:home";case"running":return r?"mdi:stop":"mdi:play";case"sound":return r?"mdi:music-note-off":"mdi:music-note";case"update":return r?"mdi:package":"mdi:package-up";case"vibration":return r?"mdi:crop-portrait":"mdi:vibrate";case"window":return r?"mdi:window-closed":"mdi:window-open";default:return r?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}})(a,t);case"button":switch(t?.attributes.device_class){case"restart":return"mdi:restart";case"update":return"mdi:package-up";default:return"mdi:gesture-tap-button"}case"camera":return"off"===a?"mdi:video-off":"mdi:video";case"cover":return((e,t)=>{const r="closed"!==e;switch(t?.attributes.device_class){case"garage":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdigarage";default:return"mdi:Garage-open"}case"gate":switch(e){case"opening":case"closing":return"mdi:gate-arrow-right";case"closed":return"mdi:gate";default:return"mdi:gate-open"}case"door":return r?"mdi:door-open":"mdi:door-closed";case"damper":return r?"mdi:circle":"mdi:circle-slice-8";case"shutter":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window-shutter";default:return"mdi:window-shutter-open"}case"curtain":switch(e){case"opening":return"mdi:arrow-split-vertical";case"closing":return"mdi:arrow-collapse-horizontal";case"closed":return"mdi:curtains-closed";default:return"mdi:curtains"}case"blind":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:blinds-horizontal-closed";default:return"mdi:blinds-horizontal"}case"shade":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:roller-shade-closed";default:return"mdi:roller-shade"}case"window":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}}switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}})(a,t);case"device_tracker":return"router"===t?.attributes.source_type?"home"===a?"mdi:lan-connect":"mdi:lan-cisconnect":["bluetooth","bluetooth_le"].includes(t?.attributes.source_type)?"home"===a?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===a?"mdi:account-arrow-right":"mdi:account";case"fan":return"off"===a?"mdi:fan-off":"mdi:fan";case"humidifier":return"off"===a?"mdi:air-humidifier-off":"mdi:air-humidifier";case"input_boolean":return"on"===a?"mdi:check-circle-outline":"mdi:close-circle-outline";case"input_datetime":if(!t?.attributes.has_date)return"mdi:clock";if(!t.attributes.has_time)return"mdi:calendar";break;case"lock":switch(a){case"unlocked":return"mdi:lock-open";case"jammed":return"mdi:lock-alert";case"locking":case"unlocking":return"mdi:lock-clock";default:return"mdi:lock"}case"media_player":switch(t?.attributes.device_class){case"speaker":switch(a){case"playing":return"mdi:speaker-play";case"paused":return"mdi:speaker-pause";case"off":return"mdi:speaker-off";default:return"mdi:speaker"}case"tv":switch(a){case"playing":return"mdi:television-play";case"paused":return"mdi:television-pause";case"off":return"mdi:television-off";default:return"mdi:television"}case"receiver":return"off"===a?"mdi:audio-video-off":"mdi:audio-video";default:switch(a){case"playing":case"paused":return"mdi:cast-connected";case"off":return"mdi:cast-off";default:return"mdi:cast"}}case"number":{const e=(e=>{const t=e?.attributes.device_class;if(t&&t in De)return De[t]})(t);if(e)return e;break}case"person":return"not_home"===a?"mdi:account-arrow-right":"mdi:account";case"switch":switch(t?.attributes.device_class){case"outlet":return"on"===a?"mdi:power-plug":"mdi:power-plug-off";case"switch":return"on"===a?"mdi:toggle-switch-variant":"mdi:toggle-switch-variant-off";default:return"mdi:toggle-switch-variant"}case"sensor":{const e=Le(t);if(e)return e;break}case"sun":return"above_horizon"===t?.state?"mdi:white-balance-sunny":"mdi:weather-night";case"switch_as_x":return"mdi:swap-horizontal";case"threshold":return"mdi:chart-sankey";case"water_heater":return"off"===a?"mdi:water-boiler-off":"mdi:water-boiler"}if(e in je)return je[e]},qe=e=>{return e?(t=Ve(e.entity_id),Ue(t,e)||(console.warn(`Unable to find icon for domain ${t}`),Oe)):Oe;var t};var Fe,Ge,Be,We,Je;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.quote_decimal="quote_decimal",e.space_comma="space_comma",e.none="none"}(Fe||(Fe={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Ge||(Ge={})),function(e){e.local="local",e.server="server"}(Be||(Be={})),function(e){e.language="language",e.system="system",e.DMY="DMY",e.MDY="MDY",e.YMD="YMD"}(We||(We={})),function(e){e.language="language",e.monday="monday",e.tuesday="tuesday",e.wednesday="wednesday",e.thursday="thursday",e.friday="friday",e.saturday="saturday",e.sunday="sunday"}(Je||(Je={}));const Xe=(e,t,r)=>{const a=t?(e=>{switch(e.number_format){case Fe.comma_decimal:return["en-US","en"];case Fe.decimal_comma:return["de","es","it"];case Fe.space_comma:return["fr","sv","cs"];case Fe.quote_decimal:return["de-CH"];case Fe.system:return;default:return e.language}})(t):void 0;return t?.number_format===Fe.none||Number.isNaN(Number(e))?Number.isNaN(Number(e))||""===e||t?.number_format!==Fe.none?[{type:"literal",value:e}]:new Intl.NumberFormat("en-US",Ye(e,{...r,useGrouping:!1})).formatToParts(Number(e)):new Intl.NumberFormat(a,Ye(e,r)).formatToParts(Number(e))},Ye=(e,t)=>{const r={maximumFractionDigits:2,...t};if("string"!=typeof e)return r;if(!t||void 0===t.minimumFractionDigits&&void 0===t.maximumFractionDigits){const t=e.indexOf(".")>-1?e.split(".")[1].length:0;r.minimumFractionDigits=t,r.maximumFractionDigits=t}return r};Intl.DateTimeFormat?.().resolvedOptions?.().timeZone;const Ze="unavailable",Ke=(Qe=[Ze,"unknown"],(e,t)=>Qe.includes(e,t));var Qe;const et=(e,t)=>e&&e.components.includes(t),tt=e=>Ve(e.entity_id),rt={entity:{},entity_component:{}},at=async(e,t,r)=>((e,t)=>e.sendMessagePromise(t))(e,{type:"frontend/get_icons",category:t,integration:r}),ot=async(e,t,r,a=!1)=>{if(!a&&r in rt.entity)return rt.entity[r];if(!et(e,r)||!((e,t,r,a)=>{const[o,s,i]=e.split(".",3);return Number(o)>t||Number(o)===t&&(void 0===a?Number(s)>=r:Number(s)>r)||void 0!==a&&Number(o)===t&&Number(s)===r&&Number(i)>=a})(t.haVersion,2024,2))return;const o=at(t,"entity",r).then((e=>e?.resources[r]));return rt.entity[r]=o,rt.entity[r]},st=async(e,t,r,a=!1)=>!a&&rt.entity_component.resources&&rt.entity_component.domains?.includes(r)?rt.entity_component.resources.then((e=>e[r])):et(t,r)?(rt.entity_component.domains=[...t.components],rt.entity_component.resources=at(e,"entity_component").then((e=>e.resources)),rt.entity_component.resources.then((e=>e[r]))):void 0,it=new WeakMap,nt=(e,t)=>{if(t)return e&&t.state?.[e]?t.state[e]:void 0!==e&&t.range&&!isNaN(Number(e))?((e,t)=>{let r=it.get(t);if(r||(r=Object.keys(t).map(Number).filter((e=>!isNaN(e))).sort(((e,t)=>e-t)),it.set(t,r)),0===r.length)return;if(e<r[0])return;let a=r[0];for(const o of r){if(!(e>=o))break;a=o}return t[a.toString()]})(Number(e),t.range)??t.default:t.default},lt=async(e,t,r,a,o,s)=>{const i=s?.platform,n=s?.translation_key,l=a?.attributes.device_class,c=a?.state;let d;if(n&&i){const a=await ot(e,t,i);if(a){const e=a[r]?.[n];d=nt(c,e)}}if(!d&&a&&(d=((e,t)=>{const r=tt(e),a=t??e.state;switch(r){case"device_tracker":return((e,t)=>{const r=t??e.state;return"router"===e?.attributes.source_type?"home"===r?"mdi:lan-connect":"mdi:lan-disconnect":["bluetooth","bluetooth_le"].includes(e?.attributes.source_type)?"home"===r?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===r?"mdi:account-arrow-right":"mdi:account"})(e,a);case"sun":return"above_horizon"===a?"mdi:white-balance-sunny":"mdi:weather-night";case"input_datetime":if(!e.attributes.has_date)return"mdi:clock";if(!e.attributes.has_time)return"mdi:calendar"}})(a,c)),!d){const a=await st(t,e,r);if(a){const e=l&&a[l]||a._;d=nt(c,e)}}return d},ct=(e,t)=>{if("number"==typeof e)return 3===t?{mode:"rgb",r:(e>>8&15|e>>4&240)/255,g:(e>>4&15|240&e)/255,b:(15&e|e<<4&240)/255}:4===t?{mode:"rgb",r:(e>>12&15|e>>8&240)/255,g:(e>>8&15|e>>4&240)/255,b:(e>>4&15|240&e)/255,alpha:(15&e|e<<4&240)/255}:6===t?{mode:"rgb",r:(e>>16&255)/255,g:(e>>8&255)/255,b:(255&e)/255}:8===t?{mode:"rgb",r:(e>>24&255)/255,g:(e>>16&255)/255,b:(e>>8&255)/255,alpha:(255&e)/255}:void 0},dt={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ht=/^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i,ut="([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)",mt=`${ut}%`,pt=`(?:${ut}%|${ut})`,gt=`(?:${ut}(deg|grad|rad|turn)|${ut})`,ft="\\s*,\\s*",bt=new RegExp(`^rgba?\\(\\s*${ut}${ft}${ut}${ft}${ut}\\s*(?:,\\s*${pt}\\s*)?\\)$`),vt=new RegExp(`^rgba?\\(\\s*${mt}${ft}${mt}${ft}${mt}\\s*(?:,\\s*${pt}\\s*)?\\)$`),yt=(e="rgb")=>t=>void 0!==(t=((e,t)=>void 0===e?void 0:"object"!=typeof e?Ht(e):void 0!==e.mode?e:t?{...e,mode:t}:void 0)(t,e))?t.mode===e?t:_t[t.mode][e]?_t[t.mode][e](t):"rgb"===e?_t[t.mode].rgb(t):_t.rgb[e](_t[t.mode].rgb(t)):void 0,_t={},wt={},xt=[],$t={},St=e=>e,Mt=e=>(_t[e.mode]={..._t[e.mode],...e.toMode},Object.keys(e.fromMode||{}).forEach((t=>{_t[t]||(_t[t]={}),_t[t][e.mode]=e.fromMode[t]})),e.ranges||(e.ranges={}),e.difference||(e.difference={}),e.channels.forEach((t=>{if(void 0===e.ranges[t]&&(e.ranges[t]=[0,1]),!e.interpolate[t])throw new Error(`Missing interpolator for: ${t}`);"function"==typeof e.interpolate[t]&&(e.interpolate[t]={use:e.interpolate[t]}),e.interpolate[t].fixup||(e.interpolate[t].fixup=St)})),wt[e.mode]=e,(e.parse||[]).forEach((t=>{kt(t,e.mode)})),yt(e.mode)),kt=(e,t)=>{if("string"==typeof e){if(!t)throw new Error("'mode' required when 'parser' is a string");$t[e]=t}else"function"==typeof e&&xt.indexOf(e)<0&&xt.push(e)},At=/[^\x00-\x7F]|[a-zA-Z_]/,Ct=/[^\x00-\x7F]|[-\w]/,Nt={Function:"function",Ident:"ident",Number:"number",Percentage:"percentage",ParenClose:")",None:"none",Hue:"hue",Alpha:"alpha"};let Et=0;function zt(e){let t=e[Et],r=e[Et+1];return"-"===t||"+"===t?/\d/.test(r)||"."===r&&/\d/.test(e[Et+2]):/\d/.test("."===t?r:t)}function Tt(e){if(Et>=e.length)return!1;let t=e[Et];if(At.test(t))return!0;if("-"===t){if(e.length-Et<2)return!1;let t=e[Et+1];return!("-"!==t&&!At.test(t))}return!1}const It={deg:1,rad:180/Math.PI,grad:.9,turn:360};function Pt(e){let t="";if("-"!==e[Et]&&"+"!==e[Et]||(t+=e[Et++]),t+=Ot(e),"."===e[Et]&&/\d/.test(e[Et+1])&&(t+=e[Et++]+Ot(e)),"e"!==e[Et]&&"E"!==e[Et]||("-"!==e[Et+1]&&"+"!==e[Et+1]||!/\d/.test(e[Et+2])?/\d/.test(e[Et+1])&&(t+=e[Et++]+Ot(e)):t+=e[Et++]+e[Et++]+Ot(e)),Tt(e)){let r=jt(e);return"deg"===r||"rad"===r||"turn"===r||"grad"===r?{type:Nt.Hue,value:t*It[r]}:void 0}return"%"===e[Et]?(Et++,{type:Nt.Percentage,value:+t}):{type:Nt.Number,value:+t}}function Ot(e){let t="";for(;/\d/.test(e[Et]);)t+=e[Et++];return t}function jt(e){let t="";for(;Et<e.length&&Ct.test(e[Et]);)t+=e[Et++];return t}function Dt(e){let t=jt(e);return"("===e[Et]?(Et++,{type:Nt.Function,value:t}):"none"===t?{type:Nt.None,value:void 0}:{type:Nt.Ident,value:t}}function Vt(e){e._i=0;let t=e[e._i++];if(!t||t.type!==Nt.Function||"color"!==t.value)return;if(t=e[e._i++],t.type!==Nt.Ident)return;const r=$t[t.value];if(!r)return;const a={mode:r},o=Rt(e,!1);if(!o)return;const s=(e=>wt[e])(r).channels;for(let i,n,l=0;l<s.length;l++)i=o[l],n=s[l],i.type!==Nt.None&&(a[n]=i.type===Nt.Number?i.value:i.value/100,"alpha"===n&&(a[n]=Math.max(0,Math.min(1,a[n]))));return a}function Rt(e,t){const r=[];let a;for(;e._i<e.length;)if(a=e[e._i++],a.type===Nt.None||a.type===Nt.Number||a.type===Nt.Alpha||a.type===Nt.Percentage||t&&a.type===Nt.Hue)r.push(a);else{if(a.type!==Nt.ParenClose)return;if(e._i<e.length)return}if(!(r.length<3||r.length>4)){if(4===r.length){if(r[3].type!==Nt.Alpha)return;r[3]=r[3].value}return 3===r.length&&r.push({type:Nt.None,value:void 0}),r.every((e=>e.type!==Nt.Alpha))?r:void 0}}const Ht=e=>{if("string"!=typeof e)return;const t=function(e=""){let t,r=e.trim(),a=[];for(Et=0;Et<r.length;)if(t=r[Et++],"\n"!==t&&"\t"!==t&&" "!==t){if(","===t)return;if(")"!==t){if("+"===t){if(Et--,zt(r)){a.push(Pt(r));continue}return}if("-"===t){if(Et--,zt(r)){a.push(Pt(r));continue}if(Tt(r)){a.push({type:Nt.Ident,value:jt(r)});continue}return}if("."===t){if(Et--,zt(r)){a.push(Pt(r));continue}return}if("/"===t){for(;Et<r.length&&("\n"===r[Et]||"\t"===r[Et]||" "===r[Et]);)Et++;let e;if(zt(r)&&(e=Pt(r),e.type!==Nt.Hue)){a.push({type:Nt.Alpha,value:e});continue}if(Tt(r)&&"none"===jt(r)){a.push({type:Nt.Alpha,value:{type:Nt.None,value:void 0}});continue}return}if(/\d/.test(t))Et--,a.push(Pt(r));else{if(!At.test(t))return;Et--,a.push(Dt(r))}}else a.push({type:Nt.ParenClose})}else for(;Et<r.length&&("\n"===r[Et]||"\t"===r[Et]||" "===r[Et]);)Et++;return a}(e),r=t?function(e,t){e._i=0;let r=e[e._i++];if(!r||r.type!==Nt.Function)return;let a=Rt(e,t);return a?(a.unshift(r.value),a):void 0}(t,!0):void 0;let a,o=0,s=xt.length;for(;o<s;)if(void 0!==(a=xt[o++](e,r)))return a;return t?Vt(t):void 0};const Lt=(Ut=(e,t,r)=>e+r*(t-e),e=>{let t=(e=>{let t=[];for(let r=0;r<e.length-1;r++){let a=e[r],o=e[r+1];void 0===a&&void 0===o?t.push(void 0):void 0!==a&&void 0!==o?t.push([a,o]):t.push(void 0!==a?[a,a]:[o,o])}return t})(e);return e=>{let r=e*t.length,a=e>=1?t.length-1:Math.max(Math.floor(r),0),o=t[a];return void 0===o?void 0:Ut(o[0],o[1],r-a)}});var Ut;const qt=e=>{let t=!1,r=e.map((e=>void 0!==e?(t=!0,e):1));return t?r:e},Ft={mode:"rgb",channels:["r","g","b","alpha"],parse:[function(e,t){if(!t||"rgb"!==t[0]&&"rgba"!==t[0])return;const r={mode:"rgb"},[,a,o,s,i]=t;return a.type!==Nt.Hue&&o.type!==Nt.Hue&&s.type!==Nt.Hue?(a.type!==Nt.None&&(r.r=a.type===Nt.Number?a.value/255:a.value/100),o.type!==Nt.None&&(r.g=o.type===Nt.Number?o.value/255:o.value/100),s.type!==Nt.None&&(r.b=s.type===Nt.Number?s.value/255:s.value/100),i.type!==Nt.None&&(r.alpha=Math.min(1,Math.max(0,i.type===Nt.Number?i.value:i.value/100))),r):void 0},e=>{let t;return(t=e.match(ht))?ct(parseInt(t[1],16),t[1].length):void 0},e=>{let t,r={mode:"rgb"};if(t=e.match(bt))void 0!==t[1]&&(r.r=t[1]/255),void 0!==t[2]&&(r.g=t[2]/255),void 0!==t[3]&&(r.b=t[3]/255);else{if(!(t=e.match(vt)))return;void 0!==t[1]&&(r.r=t[1]/100),void 0!==t[2]&&(r.g=t[2]/100),void 0!==t[3]&&(r.b=t[3]/100)}return void 0!==t[4]?r.alpha=Math.max(0,Math.min(1,t[4]/100)):void 0!==t[5]&&(r.alpha=Math.max(0,Math.min(1,+t[5]))),r},e=>ct(dt[e.toLowerCase()],6),e=>"transparent"===e?{mode:"rgb",r:0,g:0,b:0,alpha:0}:void 0,"srgb"],serialize:"srgb",interpolate:{r:Lt,g:Lt,b:Lt,alpha:{use:Lt,fixup:qt}},gamut:!0,white:{r:1,g:1,b:1},black:{r:0,g:0,b:0}},Gt=(e=0)=>Math.pow(Math.abs(e),563/256)*Math.sign(e),Bt=e=>{let t=Gt(e.r),r=Gt(e.g),a=Gt(e.b),o={mode:"xyz65",x:.5766690429101305*t+.1855582379065463*r+.1882286462349947*a,y:.297344975250536*t+.6273635662554661*r+.0752914584939979*a,z:.0270313613864123*t+.0706888525358272*r+.9913375368376386*a};return void 0!==e.alpha&&(o.alpha=e.alpha),o},Wt=e=>Math.pow(Math.abs(e),256/563)*Math.sign(e),Jt=({x:e,y:t,z:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o={mode:"a98",r:Wt(2.0415879038107465*e-.5650069742788597*t-.3447313507783297*r),g:Wt(-.9692436362808798*e+1.8759675015077206*t+.0415550574071756*r),b:Wt(.0134442806320312*e-.1183623922310184*t+1.0151749943912058*r)};return void 0!==a&&(o.alpha=a),o},Xt=(e=0)=>{const t=Math.abs(e);return t<=.04045?e/12.92:(Math.sign(e)||1)*Math.pow((t+.055)/1.055,2.4)},Yt=({r:e,g:t,b:r,alpha:a})=>{let o={mode:"lrgb",r:Xt(e),g:Xt(t),b:Xt(r)};return void 0!==a&&(o.alpha=a),o},Zt=e=>{let{r:t,g:r,b:a,alpha:o}=Yt(e),s={mode:"xyz65",x:.4123907992659593*t+.357584339383878*r+.1804807884018343*a,y:.2126390058715102*t+.715168678767756*r+.0721923153607337*a,z:.0193308187155918*t+.119194779794626*r+.9505321522496607*a};return void 0!==o&&(s.alpha=o),s},Kt=(e=0)=>{const t=Math.abs(e);return t>.0031308?(Math.sign(e)||1)*(1.055*Math.pow(t,1/2.4)-.055):12.92*e},Qt=({r:e,g:t,b:r,alpha:a},o="rgb")=>{let s={mode:o,r:Kt(e),g:Kt(t),b:Kt(r)};return void 0!==a&&(s.alpha=a),s},er=({x:e,y:t,z:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Qt({r:3.2409699419045226*e-1.537383177570094*t-.4986107602930034*r,g:-.9692436362808796*e+1.8759675015077204*t+.0415550574071756*r,b:.0556300796969936*e-.2039769588889765*t+1.0569715142428784*r});return void 0!==a&&(o.alpha=a),o},tr={...Ft,mode:"a98",parse:["a98-rgb"],serialize:"a98-rgb",fromMode:{rgb:e=>Jt(Zt(e)),xyz65:Jt},toMode:{rgb:e=>er(Bt(e)),xyz65:Bt}},rr=e=>(e%=360)<0?e+360:e,ar=e=>((e,t)=>e.map(((r,a,o)=>{if(void 0===r)return r;let s=rr(r);return 0===a||void 0===e[a-1]?s:t(s-rr(o[a-1]))})).reduce(((e,t)=>e.length&&void 0!==t&&void 0!==e[e.length-1]?(e.push(t+e[e.length-1]),e):(e.push(t),e)),[]))(e,(e=>Math.abs(e)<=180?e:e-360*Math.sign(e))),or=[-.14861,1.78277,-.29227,-.90649,1.97294,0],sr=Math.PI/180,ir=180/Math.PI;let nr=or[3]*or[4],lr=or[1]*or[4],cr=or[1]*or[2]-or[0]*or[3];const dr=(e,t)=>{if(void 0===e.h||void 0===t.h||!e.s||!t.s)return 0;let r=rr(e.h),a=rr(t.h),o=Math.sin((a-r+360)/2*Math.PI/180);return 2*Math.sqrt(e.s*t.s)*o},hr=(e,t)=>{if(void 0===e.h||void 0===t.h||!e.c||!t.c)return 0;let r=rr(e.h),a=rr(t.h),o=Math.sin((a-r+360)/2*Math.PI/180);return 2*Math.sqrt(e.c*t.c)*o},ur=e=>{let t=e.reduce(((e,t)=>{if(void 0!==t){let r=t*Math.PI/180;e.sin+=Math.sin(r),e.cos+=Math.cos(r)}return e}),{sin:0,cos:0}),r=180*Math.atan2(t.sin,t.cos)/Math.PI;return r<0?360+r:r},mr={mode:"cubehelix",channels:["h","s","l","alpha"],parse:["--cubehelix"],serialize:"--cubehelix",ranges:{h:[0,360],s:[0,4.614],l:[0,1]},fromMode:{rgb:({r:e,g:t,b:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=(cr*r+e*nr-t*lr)/(cr+nr-lr),s=r-o,i=(or[4]*(t-o)-or[2]*s)/or[3],n={mode:"cubehelix",l:o,s:0===o||1===o?void 0:Math.sqrt(s*s+i*i)/(or[4]*o*(1-o))};return n.s&&(n.h=Math.atan2(i,s)*ir-120),void 0!==a&&(n.alpha=a),n}},toMode:{rgb:({h:e,s:t,l:r,alpha:a})=>{let o={mode:"rgb"};e=(void 0===e?0:e+120)*sr,void 0===r&&(r=0);let s=void 0===t?0:t*r*(1-r),i=Math.cos(e),n=Math.sin(e);return o.r=r+s*(or[0]*i+or[1]*n),o.g=r+s*(or[2]*i+or[3]*n),o.b=r+s*(or[4]*i+or[5]*n),void 0!==a&&(o.alpha=a),o}},interpolate:{h:{use:Lt,fixup:ar},s:Lt,l:Lt,alpha:{use:Lt,fixup:qt}},difference:{h:dr},average:{h:ur}},pr=({l:e,a:t,b:r,alpha:a},o="lch")=>{void 0===t&&(t=0),void 0===r&&(r=0);let s=Math.sqrt(t*t+r*r),i={mode:o,l:e,c:s};return s&&(i.h=rr(180*Math.atan2(r,t)/Math.PI)),void 0!==a&&(i.alpha=a),i},gr=({l:e,c:t,h:r,alpha:a},o="lab")=>{void 0===r&&(r=0);let s={mode:o,l:e,a:t?t*Math.cos(r/180*Math.PI):0,b:t?t*Math.sin(r/180*Math.PI):0};return void 0!==a&&(s.alpha=a),s},fr=Math.pow(29,3)/Math.pow(3,3),br=Math.pow(6,3)/Math.pow(29,3),vr=.3457/.3585,yr=1,_r=.2958/.3585,wr=.3127/.329,xr=1,$r=.3583/.329;let Sr=e=>Math.pow(e,3)>br?Math.pow(e,3):(116*e-16)/fr;const Mr=({l:e,a:t,b:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=(e+16)/116,s=o-r/200,i={mode:"xyz65",x:Sr(t/500+o)*wr,y:Sr(o)*xr,z:Sr(s)*$r};return void 0!==a&&(i.alpha=a),i},kr=e=>er(Mr(e)),Ar=e=>e>br?Math.cbrt(e):(fr*e+16)/116,Cr=({x:e,y:t,z:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Ar(e/wr),s=Ar(t/xr),i={mode:"lab65",l:116*s-16,a:500*(o-s),b:200*(s-Ar(r/$r))};return void 0!==a&&(i.alpha=a),i},Nr=e=>{let t=Cr(Zt(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},Er=26/180*Math.PI,zr=Math.cos(Er),Tr=Math.sin(Er),Ir=100/Math.log(1.39),Pr=({l:e,c:t,h:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o={mode:"lab65",l:(Math.exp(1*e/Ir)-1)/.0039},s=(Math.exp(.0435*t*1*1)-1)/.075,i=s*Math.cos(r/180*Math.PI-Er),n=s*Math.sin(r/180*Math.PI-Er);return o.a=i*zr-n/.83*Tr,o.b=i*Tr+n/.83*zr,void 0!==a&&(o.alpha=a),o},Or=({l:e,a:t,b:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=t*zr+r*Tr,s=.83*(r*zr-t*Tr),i=Math.sqrt(o*o+s*s),n={mode:"dlch",l:Ir/1*Math.log(1+.0039*e),c:Math.log(1+.075*i)/.0435};return n.c&&(n.h=rr((Math.atan2(s,o)+Er)/Math.PI*180)),void 0!==a&&(n.alpha=a),n},jr=e=>Pr(pr(e,"dlch")),Dr=e=>gr(Or(e),"dlab"),Vr={mode:"dlab",parse:["--din99o-lab"],serialize:"--din99o-lab",toMode:{lab65:jr,rgb:e=>kr(jr(e))},fromMode:{lab65:Dr,rgb:e=>Dr(Nr(e))},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-40.09,45.501],b:[-40.469,44.344]},interpolate:{l:Lt,a:Lt,b:Lt,alpha:{use:Lt,fixup:qt}}},Rr={mode:"dlch",parse:["--din99o-lch"],serialize:"--din99o-lch",toMode:{lab65:Pr,dlab:e=>gr(e,"dlab"),rgb:e=>kr(Pr(e))},fromMode:{lab65:Or,dlab:e=>pr(e,"dlch"),rgb:e=>Or(Nr(e))},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,51.484],h:[0,360]},interpolate:{l:Lt,c:Lt,h:{use:Lt,fixup:ar},alpha:{use:Lt,fixup:qt}},difference:{h:hr},average:{h:ur}};const Hr={mode:"hsi",toMode:{rgb:function({h:e,s:t,i:r,alpha:a}){e=rr(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let o,s=Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:o={r:r*(1+t*(3/(2-s)-1)),g:r*(1+t*(3*(1-s)/(2-s)-1)),b:r*(1-t)};break;case 1:o={r:r*(1+t*(3*(1-s)/(2-s)-1)),g:r*(1+t*(3/(2-s)-1)),b:r*(1-t)};break;case 2:o={r:r*(1-t),g:r*(1+t*(3/(2-s)-1)),b:r*(1+t*(3*(1-s)/(2-s)-1))};break;case 3:o={r:r*(1-t),g:r*(1+t*(3*(1-s)/(2-s)-1)),b:r*(1+t*(3/(2-s)-1))};break;case 4:o={r:r*(1+t*(3*(1-s)/(2-s)-1)),g:r*(1-t),b:r*(1+t*(3/(2-s)-1))};break;case 5:o={r:r*(1+t*(3/(2-s)-1)),g:r*(1-t),b:r*(1+t*(3*(1-s)/(2-s)-1))};break;default:o={r:r*(1-t),g:r*(1-t),b:r*(1-t)}}return o.mode="rgb",void 0!==a&&(o.alpha=a),o}},parse:["--hsi"],serialize:"--hsi",fromMode:{rgb:function({r:e,g:t,b:r,alpha:a}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.max(e,t,r),s=Math.min(e,t,r),i={mode:"hsi",s:e+t+r===0?0:1-3*s/(e+t+r),i:(e+t+r)/3};return o-s!=0&&(i.h=60*(o===e?(t-r)/(o-s)+6*(t<r):o===t?(r-e)/(o-s)+2:(e-t)/(o-s)+4)),void 0!==a&&(i.alpha=a),i}},channels:["h","s","i","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:Lt,fixup:ar},s:Lt,i:Lt,alpha:{use:Lt,fixup:qt}},difference:{h:dr},average:{h:ur}};const Lr=new RegExp(`^hsla?\\(\\s*${gt}${ft}${mt}${ft}${mt}\\s*(?:,\\s*${pt}\\s*)?\\)$`);const Ur={mode:"hsl",toMode:{rgb:function({h:e,s:t,l:r,alpha:a}){e=rr(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let o,s=r+t*(r<.5?r:1-r),i=s-2*(s-r)*Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:o={r:s,g:i,b:2*r-s};break;case 1:o={r:i,g:s,b:2*r-s};break;case 2:o={r:2*r-s,g:s,b:i};break;case 3:o={r:2*r-s,g:i,b:s};break;case 4:o={r:i,g:2*r-s,b:s};break;case 5:o={r:s,g:2*r-s,b:i};break;default:o={r:2*r-s,g:2*r-s,b:2*r-s}}return o.mode="rgb",void 0!==a&&(o.alpha=a),o}},fromMode:{rgb:function({r:e,g:t,b:r,alpha:a}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.max(e,t,r),s=Math.min(e,t,r),i={mode:"hsl",s:o===s?0:(o-s)/(1-Math.abs(o+s-1)),l:.5*(o+s)};return o-s!=0&&(i.h=60*(o===e?(t-r)/(o-s)+6*(t<r):o===t?(r-e)/(o-s)+2:(e-t)/(o-s)+4)),void 0!==a&&(i.alpha=a),i}},channels:["h","s","l","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(e,t){if(!t||"hsl"!==t[0]&&"hsla"!==t[0])return;const r={mode:"hsl"},[,a,o,s,i]=t;if(a.type!==Nt.None){if(a.type===Nt.Percentage)return;r.h=a.value}if(o.type!==Nt.None){if(o.type===Nt.Hue)return;r.s=o.value/100}if(s.type!==Nt.None){if(s.type===Nt.Hue)return;r.l=s.value/100}return i.type!==Nt.None&&(r.alpha=Math.min(1,Math.max(0,i.type===Nt.Number?i.value:i.value/100))),r},e=>{let t=e.match(Lr);if(!t)return;let r={mode:"hsl"};return void 0!==t[3]?r.h=+t[3]:void 0!==t[1]&&void 0!==t[2]&&(r.h=((e,t)=>{switch(t){case"deg":return+e;case"rad":return e/Math.PI*180;case"grad":return e/10*9;case"turn":return 360*e}})(t[1],t[2])),void 0!==t[4]&&(r.s=Math.min(Math.max(0,t[4]/100),1)),void 0!==t[5]&&(r.l=Math.min(Math.max(0,t[5]/100),1)),void 0!==t[6]?r.alpha=Math.max(0,Math.min(1,t[6]/100)):void 0!==t[7]&&(r.alpha=Math.max(0,Math.min(1,+t[7]))),r}],serialize:e=>`hsl(${void 0!==e.h?e.h:"none"} ${void 0!==e.s?100*e.s+"%":"none"} ${void 0!==e.l?100*e.l+"%":"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:Lt,fixup:ar},s:Lt,l:Lt,alpha:{use:Lt,fixup:qt}},difference:{h:dr},average:{h:ur}};function qr({h:e,s:t,v:r,alpha:a}){e=rr(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let o,s=Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:o={r:r,g:r*(1-t*s),b:r*(1-t)};break;case 1:o={r:r*(1-t*s),g:r,b:r*(1-t)};break;case 2:o={r:r*(1-t),g:r,b:r*(1-t*s)};break;case 3:o={r:r*(1-t),g:r*(1-t*s),b:r};break;case 4:o={r:r*(1-t*s),g:r*(1-t),b:r};break;case 5:o={r:r,g:r*(1-t),b:r*(1-t*s)};break;default:o={r:r*(1-t),g:r*(1-t),b:r*(1-t)}}return o.mode="rgb",void 0!==a&&(o.alpha=a),o}function Fr({r:e,g:t,b:r,alpha:a}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.max(e,t,r),s=Math.min(e,t,r),i={mode:"hsv",s:0===o?0:1-s/o,v:o};return o-s!=0&&(i.h=60*(o===e?(t-r)/(o-s)+6*(t<r):o===t?(r-e)/(o-s)+2:(e-t)/(o-s)+4)),void 0!==a&&(i.alpha=a),i}const Gr={mode:"hsv",toMode:{rgb:qr},parse:["--hsv"],serialize:"--hsv",fromMode:{rgb:Fr},channels:["h","s","v","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:Lt,fixup:ar},s:Lt,v:Lt,alpha:{use:Lt,fixup:qt}},difference:{h:dr},average:{h:ur}};const Br={mode:"hwb",toMode:{rgb:function({h:e,w:t,b:r,alpha:a}){if(void 0===t&&(t=0),void 0===r&&(r=0),t+r>1){let e=t+r;t/=e,r/=e}return qr({h:e,s:1===r?1:1-t/(1-r),v:1-r,alpha:a})}},fromMode:{rgb:function(e){let t=Fr(e);if(void 0===t)return;let r=void 0!==t.s?t.s:0,a=void 0!==t.v?t.v:0,o={mode:"hwb",w:(1-r)*a,b:1-a};return void 0!==t.h&&(o.h=t.h),void 0!==t.alpha&&(o.alpha=t.alpha),o}},channels:["h","w","b","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(e,t){if(!t||"hwb"!==t[0])return;const r={mode:"hwb"},[,a,o,s,i]=t;if(a.type!==Nt.None){if(a.type===Nt.Percentage)return;r.h=a.value}if(o.type!==Nt.None){if(o.type===Nt.Hue)return;r.w=o.value/100}if(s.type!==Nt.None){if(s.type===Nt.Hue)return;r.b=s.value/100}return i.type!==Nt.None&&(r.alpha=Math.min(1,Math.max(0,i.type===Nt.Number?i.value:i.value/100))),r}],serialize:e=>`hwb(${void 0!==e.h?e.h:"none"} ${void 0!==e.w?100*e.w+"%":"none"} ${void 0!==e.b?100*e.b+"%":"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:Lt,fixup:ar},w:Lt,b:Lt,alpha:{use:Lt,fixup:qt}},difference:{h:(e,t)=>{if(void 0===e.h||void 0===t.h)return 0;let r=rr(e.h),a=rr(t.h);return Math.abs(a-r)>180?r-(a-360*Math.sign(a-r)):a-r}},average:{h:ur}},Wr=.1593017578125,Jr=78.84375,Xr=.8359375,Yr=18.8515625,Zr=18.6875;function Kr(e){if(e<0)return 0;const t=Math.pow(e,1/Jr);return 1e4*Math.pow(Math.max(0,t-Xr)/(Yr-Zr*t),1/Wr)}function Qr(e){if(e<0)return 0;const t=Math.pow(e/1e4,Wr);return Math.pow((Xr+Yr*t)/(1+Zr*t),Jr)}const ea=e=>Math.max(e/203,0),ta=({i:e,t:t,p:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const o=Kr(e+.008609037037932761*t+.11102962500302593*r),s=Kr(e-.00860903703793275*t-.11102962500302599*r),i=Kr(e+.5600313357106791*t-.32062717498731885*r),n={mode:"xyz65",x:ea(2.070152218389422*o-1.3263473389671556*s+.2066510476294051*i),y:ea(.3647385209748074*o+.680566024947227*s-.0453045459220346*i),z:ea(-.049747207535812*o-.0492609666966138*s+1.1880659249923042*i)};return void 0!==a&&(n.alpha=a),n},ra=(e=0)=>Math.max(203*e,0),aa=({x:e,y:t,z:r,alpha:a})=>{const o=ra(e),s=ra(t),i=ra(r),n=Qr(.3592832590121217*o+.6976051147779502*s-.0358915932320289*i),l=Qr(-.1920808463704995*o+1.1004767970374323*s+.0753748658519118*i),c=Qr(.0070797844607477*o+.0748396662186366*s+.8433265453898765*i),d={mode:"itp",i:.5*n+.5*l,t:1.61376953125*n-3.323486328125*l+1.709716796875*c,p:4.378173828125*n-4.24560546875*l-.132568359375*c};return void 0!==a&&(d.alpha=a),d},oa={mode:"itp",channels:["i","t","p","alpha"],parse:["--ictcp"],serialize:"--ictcp",toMode:{xyz65:ta,rgb:e=>er(ta(e))},fromMode:{xyz65:aa,rgb:e=>aa(Zt(e))},ranges:{i:[0,.581],t:[-.369,.272],p:[-.164,.331]},interpolate:{i:Lt,t:Lt,p:Lt,alpha:{use:Lt,fixup:qt}}},sa=e=>{if(e<0)return 0;let t=Math.pow(e/1e4,Wr);return Math.pow((Xr+Yr*t)/(1+Zr*t),134.03437499999998)},ia=(e=0)=>Math.max(203*e,0),na=({x:e,y:t,z:r,alpha:a})=>{e=ia(e),t=ia(t);let o=1.15*e-.15*(r=ia(r)),s=.66*t+.34*e,i=sa(.41478972*o+.579999*s+.014648*r),n=sa(-.20151*o+1.120649*s+.0531008*r),l=sa(-.0166008*o+.2648*s+.6684799*r),c=(i+n)/2,d={mode:"jab",j:.44*c/(1-.56*c)-16295499532821565e-27,a:3.524*i-4.066708*n+.542708*l,b:.199076*i+1.096799*n-1.295875*l};return void 0!==a&&(d.alpha=a),d},la=16295499532821565e-27,ca=e=>{if(e<0)return 0;let t=Math.pow(e,.007460772656268216);return 1e4*Math.pow((Xr-t)/(Zr*t-Yr),1/Wr)},da=e=>e/203,ha=({j:e,a:t,b:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=(e+la)/(.44+.56*(e+la)),s=ca(o+.13860504*t+.058047316*r),i=ca(o-.13860504*t-.058047316*r),n=ca(o-.096019242*t-.8118919*r),l={mode:"xyz65",x:da(1.661373024652174*s-.914523081304348*i+.23136208173913045*n),y:da(-.3250758611844533*s+1.571847026732543*i-.21825383453227928*n),z:da(-.090982811*s-.31272829*i+1.5227666*n)};return void 0!==a&&(l.alpha=a),l},ua=e=>{let t=na(Zt(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},ma=e=>er(ha(e)),pa={mode:"jab",channels:["j","a","b","alpha"],parse:["--jzazbz"],serialize:"--jzazbz",fromMode:{rgb:ua,xyz65:na},toMode:{rgb:ma,xyz65:ha},ranges:{j:[0,.222],a:[-.109,.129],b:[-.185,.134]},interpolate:{j:Lt,a:Lt,b:Lt,alpha:{use:Lt,fixup:qt}}},ga=({j:e,a:t,b:r,alpha:a})=>{void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.sqrt(t*t+r*r),s={mode:"jch",j:e,c:o};return o&&(s.h=rr(180*Math.atan2(r,t)/Math.PI)),void 0!==a&&(s.alpha=a),s},fa=({j:e,c:t,h:r,alpha:a})=>{void 0===r&&(r=0);let o={mode:"jab",j:e,a:t?t*Math.cos(r/180*Math.PI):0,b:t?t*Math.sin(r/180*Math.PI):0};return void 0!==a&&(o.alpha=a),o},ba={mode:"jch",parse:["--jzczhz"],serialize:"--jzczhz",toMode:{jab:fa,rgb:e=>ma(fa(e))},fromMode:{rgb:e=>ga(ua(e)),jab:ga},channels:["j","c","h","alpha"],ranges:{j:[0,.221],c:[0,.19],h:[0,360]},interpolate:{h:{use:Lt,fixup:ar},c:Lt,j:Lt,alpha:{use:Lt,fixup:qt}},difference:{h:hr},average:{h:ur}},va=Math.pow(29,3)/Math.pow(3,3),ya=Math.pow(6,3)/Math.pow(29,3);let _a=e=>Math.pow(e,3)>ya?Math.pow(e,3):(116*e-16)/va;const wa=({l:e,a:t,b:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=(e+16)/116,s=o-r/200,i={mode:"xyz50",x:_a(t/500+o)*vr,y:_a(o)*yr,z:_a(s)*_r};return void 0!==a&&(i.alpha=a),i},xa=({x:e,y:t,z:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Qt({r:3.1341359569958707*e-1.6173863321612538*t-.4906619460083532*r,g:-.978795502912089*e+1.916254567259524*t+.03344273116131949*r,b:.07195537988411677*e-.2289768264158322*t+1.405386058324125*r});return void 0!==a&&(o.alpha=a),o},$a=e=>xa(wa(e)),Sa=e=>{let{r:t,g:r,b:a,alpha:o}=Yt(e),s={mode:"xyz50",x:.436065742824811*t+.3851514688337912*r+.14307845442264197*a,y:.22249319175623702*t+.7168870538238823*r+.06061979053616537*a,z:.013923904500943465*t+.09708128566574634*r+.7140993584005155*a};return void 0!==o&&(s.alpha=o),s},Ma=e=>e>ya?Math.cbrt(e):(va*e+16)/116,ka=({x:e,y:t,z:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Ma(e/vr),s=Ma(t/yr),i={mode:"lab",l:116*s-16,a:500*(o-s),b:200*(s-Ma(r/_r))};return void 0!==a&&(i.alpha=a),i},Aa=e=>{let t=ka(Sa(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t};const Ca={mode:"lab",toMode:{xyz50:wa,rgb:$a},fromMode:{xyz50:ka,rgb:Aa},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-125,125],b:[-125,125]},parse:[function(e,t){if(!t||"lab"!==t[0])return;const r={mode:"lab"},[,a,o,s,i]=t;return a.type!==Nt.Hue&&o.type!==Nt.Hue&&s.type!==Nt.Hue?(a.type!==Nt.None&&(r.l=Math.min(Math.max(0,a.value),100)),o.type!==Nt.None&&(r.a=o.type===Nt.Number?o.value:125*o.value/100),s.type!==Nt.None&&(r.b=s.type===Nt.Number?s.value:125*s.value/100),i.type!==Nt.None&&(r.alpha=Math.min(1,Math.max(0,i.type===Nt.Number?i.value:i.value/100))),r):void 0}],serialize:e=>`lab(${void 0!==e.l?e.l:"none"} ${void 0!==e.a?e.a:"none"} ${void 0!==e.b?e.b:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{l:Lt,a:Lt,b:Lt,alpha:{use:Lt,fixup:qt}}},Na={...Ca,mode:"lab65",parse:["--lab-d65"],serialize:"--lab-d65",toMode:{xyz65:Mr,rgb:kr},fromMode:{xyz65:Cr,rgb:Nr},ranges:{l:[0,100],a:[-125,125],b:[-125,125]}};const Ea={mode:"lch",toMode:{lab:gr,rgb:e=>$a(gr(e))},fromMode:{rgb:e=>pr(Aa(e)),lab:pr},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,150],h:[0,360]},parse:[function(e,t){if(!t||"lch"!==t[0])return;const r={mode:"lch"},[,a,o,s,i]=t;if(a.type!==Nt.None){if(a.type===Nt.Hue)return;r.l=Math.min(Math.max(0,a.value),100)}if(o.type!==Nt.None&&(r.c=Math.max(0,o.type===Nt.Number?o.value:150*o.value/100)),s.type!==Nt.None){if(s.type===Nt.Percentage)return;r.h=s.value}return i.type!==Nt.None&&(r.alpha=Math.min(1,Math.max(0,i.type===Nt.Number?i.value:i.value/100))),r}],serialize:e=>`lch(${void 0!==e.l?e.l:"none"} ${void 0!==e.c?e.c:"none"} ${void 0!==e.h?e.h:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:Lt,fixup:ar},c:Lt,l:Lt,alpha:{use:Lt,fixup:qt}},difference:{h:hr},average:{h:ur}},za={...Ea,mode:"lch65",parse:["--lch-d65"],serialize:"--lch-d65",toMode:{lab65:e=>gr(e,"lab65"),rgb:e=>kr(gr(e,"lab65"))},fromMode:{rgb:e=>pr(Nr(e),"lch65"),lab65:e=>pr(e,"lch65")},ranges:{l:[0,100],c:[0,150],h:[0,360]}},Ta=({l:e,u:t,v:r,alpha:a})=>{void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.sqrt(t*t+r*r),s={mode:"lchuv",l:e,c:o};return o&&(s.h=rr(180*Math.atan2(r,t)/Math.PI)),void 0!==a&&(s.alpha=a),s},Ia=({l:e,c:t,h:r,alpha:a})=>{void 0===r&&(r=0);let o={mode:"luv",l:e,u:t?t*Math.cos(r/180*Math.PI):0,v:t?t*Math.sin(r/180*Math.PI):0};return void 0!==a&&(o.alpha=a),o},Pa=(e,t,r)=>4*e/(e+15*t+3*r),Oa=(e,t,r)=>9*t/(e+15*t+3*r),ja=Pa(vr,yr,_r),Da=Oa(vr,yr,_r),Va=({x:e,y:t,z:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=(s=t/yr)<=ya?va*s:116*Math.cbrt(s)-16;var s;let i=Pa(e,t,r),n=Oa(e,t,r);isFinite(i)&&isFinite(n)?(i=13*o*(i-ja),n=13*o*(n-Da)):o=i=n=0;let l={mode:"luv",l:o,u:i,v:n};return void 0!==a&&(l.alpha=a),l},Ra=((e,t,r)=>4*e/(e+15*t+3*r))(vr,yr,_r),Ha=((e,t,r)=>9*t/(e+15*t+3*r))(vr,yr,_r),La=({l:e,u:t,v:r,alpha:a})=>{if(void 0===e&&(e=0),0===e)return{mode:"xyz50",x:0,y:0,z:0};void 0===t&&(t=0),void 0===r&&(r=0);let o=t/(13*e)+Ra,s=r/(13*e)+Ha,i=yr*(e<=8?e/va:Math.pow((e+16)/116,3)),n={mode:"xyz50",x:i*(9*o)/(4*s),y:i,z:i*(12-3*o-20*s)/(4*s)};return void 0!==a&&(n.alpha=a),n},Ua={mode:"lchuv",toMode:{luv:Ia,rgb:e=>xa(La(Ia(e)))},fromMode:{rgb:e=>Ta(Va(Sa(e))),luv:Ta},channels:["l","c","h","alpha"],parse:["--lchuv"],serialize:"--lchuv",ranges:{l:[0,100],c:[0,176.956],h:[0,360]},interpolate:{h:{use:Lt,fixup:ar},c:Lt,l:Lt,alpha:{use:Lt,fixup:qt}},difference:{h:hr},average:{h:ur}},qa={...Ft,mode:"lrgb",toMode:{rgb:Qt},fromMode:{rgb:Yt},parse:["srgb-linear"],serialize:"srgb-linear"},Fa={mode:"luv",toMode:{xyz50:La,rgb:e=>xa(La(e))},fromMode:{xyz50:Va,rgb:e=>Va(Sa(e))},channels:["l","u","v","alpha"],parse:["--luv"],serialize:"--luv",ranges:{l:[0,100],u:[-84.936,175.042],v:[-125.882,87.243]},interpolate:{l:Lt,u:Lt,v:Lt,alpha:{use:Lt,fixup:qt}}},Ga=({r:e,g:t,b:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.cbrt(.412221469470763*e+.5363325372617348*t+.0514459932675022*r),s=Math.cbrt(.2119034958178252*e+.6806995506452344*t+.1073969535369406*r),i=Math.cbrt(.0883024591900564*e+.2817188391361215*t+.6299787016738222*r),n={mode:"oklab",l:.210454268309314*o+.7936177747023054*s-.0040720430116193*i,a:1.9779985324311684*o-2.42859224204858*s+.450593709617411*i,b:.0259040424655478*o+.7827717124575296*s-.8086757549230774*i};return void 0!==a&&(n.alpha=a),n},Ba=e=>{let t=Ga(Yt(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},Wa=({l:e,a:t,b:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.pow(e+.3963377773761749*t+.2158037573099136*r,3),s=Math.pow(e-.1055613458156586*t-.0638541728258133*r,3),i=Math.pow(e-.0894841775298119*t-1.2914855480194092*r,3),n={mode:"lrgb",r:4.076741636075957*o-3.3077115392580616*s+.2309699031821044*i,g:-1.2684379732850317*o+2.6097573492876887*s-.3413193760026573*i,b:-.0041960761386756*o-.7034186179359362*s+1.7076146940746117*i};return void 0!==a&&(n.alpha=a),n},Ja=e=>Qt(Wa(e));function Xa(e){const t=.206,r=1.206/1.03;return.5*(r*e-t+Math.sqrt((r*e-t)*(r*e-t)+.12*r*e))}function Ya(e){return(e*e+.206*e)/(1.206/1.03*(e+.03))}function Za(e,t){let r=function(e,t){let r,a,o,s,i,n,l,c;-1.88170328*e-.80936493*t>1?(r=1.19086277,a=1.76576728,o=.59662641,s=.75515197,i=.56771245,n=4.0767416621,l=-3.3077115913,c=.2309699292):1.81444104*e-1.19445276*t>1?(r=.73956515,a=-.45954404,o=.08285427,s=.1254107,i=.14503204,n=-1.2684380046,l=2.6097574011,c=-.3413193965):(r=1.35733652,a=-.00915799,o=-1.1513021,s=-.50559606,i=.00692167,n=-.0041960863,l=-.7034186147,c=1.707614701);let d=r+a*e+o*t+s*e*e+i*e*t,h=.3963377774*e+.2158037573*t,u=-.1055613458*e-.0638541728*t,m=-.0894841775*e-1.291485548*t;{let e=1+d*h,t=1+d*u,r=1+d*m,a=n*(e*e*e)+l*(t*t*t)+c*(r*r*r),o=n*(3*h*e*e)+l*(3*u*t*t)+c*(3*m*r*r);d-=a*o/(o*o-.5*a*(n*(6*h*h*e)+l*(6*u*u*t)+c*(6*m*m*r)))}return d}(e,t),a=Wa({l:1,a:r*e,b:r*t}),o=Math.cbrt(1/Math.max(a.r,a.g,a.b));return[o,o*r]}function Ka(e,t,r=null){r||(r=Za(e,t));let a=r[0],o=r[1];return[o/a,o/(1-a)]}function Qa(e,t,r){let a=Za(t,r),o=function(e,t,r,a,o,s=null){let i;if(s||(s=Za(e,t)),(r-o)*s[1]-(s[0]-o)*a<=0)i=s[1]*o/(a*s[0]+s[1]*(o-r));else{i=s[1]*(o-1)/(a*(s[0]-1)+s[1]*(o-r));{let s=r-o,n=.3963377774*e+.2158037573*t,l=-.1055613458*e-.0638541728*t,c=-.0894841775*e-1.291485548*t,d=s+a*n,h=s+a*l,u=s+a*c;{let e=o*(1-i)+i*r,t=i*a,s=e+t*n,m=e+t*l,p=e+t*c,g=s*s*s,f=m*m*m,b=p*p*p,v=3*d*s*s,y=3*h*m*m,_=3*u*p*p,w=6*d*d*s,x=6*h*h*m,$=6*u*u*p,S=4.0767416621*g-3.3077115913*f+.2309699292*b-1,M=4.0767416621*v-3.3077115913*y+.2309699292*_,k=M/(M*M-.5*S*(4.0767416621*w-3.3077115913*x+.2309699292*$)),A=-S*k,C=-1.2684380046*g+2.6097574011*f-.3413193965*b-1,N=-1.2684380046*v+2.6097574011*y-.3413193965*_,E=N/(N*N-.5*C*(-1.2684380046*w+2.6097574011*x-.3413193965*$)),z=-C*E,T=-.0041960863*g-.7034186147*f+1.707614701*b-1,I=-.0041960863*v-.7034186147*y+1.707614701*_,P=I/(I*I-.5*T*(-.0041960863*w-.7034186147*x+1.707614701*$)),O=-T*P;A=k>=0?A:1e6,z=E>=0?z:1e6,O=P>=0?O:1e6,i+=Math.min(A,Math.min(z,O))}}}return i}(t,r,e,1,e,a),s=Ka(t,r,a),i=e*(.11516993+1/(7.4477897+4.1590124*r+t*(1.75198401*r-2.19557347+t*(-2.13704948-10.02301043*r+t*(5.38770819*r-4.24894561+4.69891013*t))))),n=(1-e)*(.11239642+1/(1.6132032-.68124379*r+t*(.40370612+.90148123*r+t*(.6122399*r-.27087943+t*(.00299215-.45399568*r-.14661872*t))))),l=.9*(o/Math.min(e*s[0],(1-e)*s[1]))*Math.sqrt(Math.sqrt(1/(1/(i*i*i*i)+1/(n*n*n*n))));return i=.4*e,n=.8*(1-e),[Math.sqrt(1/(1/(i*i)+1/(n*n))),l,o]}function eo(e){const t=void 0!==e.l?e.l:0,r=void 0!==e.a?e.a:0,a=void 0!==e.b?e.b:0,o={mode:"okhsl",l:Xa(t)};void 0!==e.alpha&&(o.alpha=e.alpha);let s=Math.sqrt(r*r+a*a);if(!s)return o.s=0,o;let i,[n,l,c]=Qa(t,r/s,a/s);if(s<l){let e=0,t=.8*n;i=.8*((s-e)/(t+(1-t/l)*(s-e)))}else{let e=.2*l*l*1.25*1.25/n;i=.8+.2*((s-l)/(e+(1-e/(c-l))*(s-l)))}return i&&(o.s=i,o.h=rr(180*Math.atan2(a,r)/Math.PI)),o}function to(e){let t=void 0!==e.h?e.h:0,r=void 0!==e.s?e.s:0,a=void 0!==e.l?e.l:0;const o={mode:"oklab",l:Ya(a)};if(void 0!==e.alpha&&(o.alpha=e.alpha),!r||1===a)return o.a=o.b=0,o;let s,i,n,l,c=Math.cos(t/180*Math.PI),d=Math.sin(t/180*Math.PI),[h,u,m]=Qa(o.l,c,d);r<.8?(s=1.25*r,i=0,n=.8*h,l=1-n/u):(s=5*(r-.8),i=u,n=.2*u*u*1.25*1.25/h,l=1-n/(m-u));let p=i+s*n/(1-l*s);return o.a=p*c,o.b=p*d,o}const ro={...Ur,mode:"okhsl",channels:["h","s","l","alpha"],parse:["--okhsl"],serialize:"--okhsl",fromMode:{oklab:eo,rgb:e=>eo(Ba(e))},toMode:{oklab:to,rgb:e=>Ja(to(e))}};function ao(e){let t=void 0!==e.l?e.l:0,r=void 0!==e.a?e.a:0,a=void 0!==e.b?e.b:0,o=Math.sqrt(r*r+a*a),s=o?r/o:1,i=o?a/o:1,[n,l]=Ka(s,i),c=1-.5/n,d=l/(o+t*l),h=d*t,u=d*o,m=Ya(h),p=u*m/h,g=Wa({l:m,a:s*p,b:i*p}),f=Math.cbrt(1/Math.max(g.r,g.g,g.b,0));t/=f,o=o/f*Xa(t)/t,t=Xa(t);const b={mode:"okhsv",s:o?(.5+l)*u/(.5*l+l*c*u):0,v:t?t/h:0};return b.s&&(b.h=rr(180*Math.atan2(a,r)/Math.PI)),void 0!==e.alpha&&(b.alpha=e.alpha),b}function oo(e){const t={mode:"oklab"};void 0!==e.alpha&&(t.alpha=e.alpha);const r=void 0!==e.h?e.h:0,a=void 0!==e.s?e.s:0,o=void 0!==e.v?e.v:0,s=Math.cos(r/180*Math.PI),i=Math.sin(r/180*Math.PI),[n,l]=Ka(s,i),c=.5,d=1-c/n,h=1-a*c/(c+l-l*d*a),u=a*l*c/(c+l-l*d*a),m=Ya(h),p=u*m/h,g=Wa({l:m,a:s*p,b:i*p}),f=Math.cbrt(1/Math.max(g.r,g.g,g.b,0)),b=Ya(o*h),v=u*b/h;return t.l=b*f,t.a=v*s*f,t.b=v*i*f,t}const so={...Gr,mode:"okhsv",channels:["h","s","v","alpha"],parse:["--okhsv"],serialize:"--okhsv",fromMode:{oklab:ao,rgb:e=>ao(Ba(e))},toMode:{oklab:oo,rgb:e=>Ja(oo(e))}};const io={...Ca,mode:"oklab",toMode:{lrgb:Wa,rgb:Ja},fromMode:{lrgb:Ga,rgb:Ba},ranges:{l:[0,1],a:[-.4,.4],b:[-.4,.4]},parse:[function(e,t){if(!t||"oklab"!==t[0])return;const r={mode:"oklab"},[,a,o,s,i]=t;return a.type!==Nt.Hue&&o.type!==Nt.Hue&&s.type!==Nt.Hue?(a.type!==Nt.None&&(r.l=Math.min(Math.max(0,a.type===Nt.Number?a.value:a.value/100),1)),o.type!==Nt.None&&(r.a=o.type===Nt.Number?o.value:.4*o.value/100),s.type!==Nt.None&&(r.b=s.type===Nt.Number?s.value:.4*s.value/100),i.type!==Nt.None&&(r.alpha=Math.min(1,Math.max(0,i.type===Nt.Number?i.value:i.value/100))),r):void 0}],serialize:e=>`oklab(${void 0!==e.l?e.l:"none"} ${void 0!==e.a?e.a:"none"} ${void 0!==e.b?e.b:"none"}${e.alpha<1?` / ${e.alpha}`:""})`};const no={...Ea,mode:"oklch",toMode:{oklab:e=>gr(e,"oklab"),rgb:e=>Ja(gr(e,"oklab"))},fromMode:{rgb:e=>pr(Ba(e),"oklch"),oklab:e=>pr(e,"oklch")},parse:[function(e,t){if(!t||"oklch"!==t[0])return;const r={mode:"oklch"},[,a,o,s,i]=t;if(a.type!==Nt.None){if(a.type===Nt.Hue)return;r.l=Math.min(Math.max(0,a.type===Nt.Number?a.value:a.value/100),1)}if(o.type!==Nt.None&&(r.c=Math.max(0,o.type===Nt.Number?o.value:.4*o.value/100)),s.type!==Nt.None){if(s.type===Nt.Percentage)return;r.h=s.value}return i.type!==Nt.None&&(r.alpha=Math.min(1,Math.max(0,i.type===Nt.Number?i.value:i.value/100))),r}],serialize:e=>`oklch(${void 0!==e.l?e.l:"none"} ${void 0!==e.c?e.c:"none"} ${void 0!==e.h?e.h:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,ranges:{l:[0,1],c:[0,.4],h:[0,360]}},lo=e=>{let{r:t,g:r,b:a,alpha:o}=Yt(e),s={mode:"xyz65",x:.486570948648216*t+.265667693169093*r+.1982172852343625*a,y:.2289745640697487*t+.6917385218365062*r+.079286914093745*a,z:0*t+.0451133818589026*r+1.043944368900976*a};return void 0!==o&&(s.alpha=o),s},co=({x:e,y:t,z:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Qt({r:2.4934969119414263*e-.9313836179191242*t-.402710784450717*r,g:-.8294889695615749*e+1.7626640603183465*t+.0236246858419436*r,b:.0358458302437845*e-.0761723892680418*t+.9568845240076871*r},"p3");return void 0!==a&&(o.alpha=a),o},ho={...Ft,mode:"p3",parse:["display-p3"],serialize:"display-p3",fromMode:{rgb:e=>co(Zt(e)),xyz65:co},toMode:{rgb:e=>er(lo(e)),xyz65:lo}},uo=e=>{let t=Math.abs(e);return t>=1/512?Math.sign(e)*Math.pow(t,1/1.8):16*e},mo=({x:e,y:t,z:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o={mode:"prophoto",r:uo(1.3457868816471585*e-.2555720873797946*t-.0511018649755453*r),g:uo(-.5446307051249019*e+1.5082477428451466*t+.0205274474364214*r),b:uo(0*e+0*t+1.2119675456389452*r)};return void 0!==a&&(o.alpha=a),o},po=(e=0)=>{let t=Math.abs(e);return t>=16/512?Math.sign(e)*Math.pow(t,1.8):e/16},go=e=>{let t=po(e.r),r=po(e.g),a=po(e.b),o={mode:"xyz50",x:.7977666449006423*t+.1351812974005331*r+.0313477341283922*a,y:.2880748288194013*t+.7118352342418731*r+899369387256e-16*a,z:0*t+0*r+.8251046025104602*a};return void 0!==e.alpha&&(o.alpha=e.alpha),o},fo={...Ft,mode:"prophoto",parse:["prophoto-rgb"],serialize:"prophoto-rgb",fromMode:{xyz50:mo,rgb:e=>mo(Sa(e))},toMode:{xyz50:go,rgb:e=>xa(go(e))}},bo=1.09929682680944,vo=e=>{const t=Math.abs(e);return t>.018053968510807?(Math.sign(e)||1)*(bo*Math.pow(t,.45)-(bo-1)):4.5*e},yo=({x:e,y:t,z:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o={mode:"rec2020",r:vo(1.7166511879712683*e-.3556707837763925*t-.2533662813736599*r),g:vo(-.6666843518324893*e+1.6164812366349395*t+.0157685458139111*r),b:vo(.0176398574453108*e-.0427706132578085*t+.9421031212354739*r)};return void 0!==a&&(o.alpha=a),o},_o=1.09929682680944,wo=(e=0)=>{let t=Math.abs(e);return t<.08124285829863151?e/4.5:(Math.sign(e)||1)*Math.pow((t+_o-1)/_o,1/.45)},xo=e=>{let t=wo(e.r),r=wo(e.g),a=wo(e.b),o={mode:"xyz65",x:.6369580483012911*t+.1446169035862083*r+.1688809751641721*a,y:.262700212011267*t+.6779980715188708*r+.059301716469862*a,z:0*t+.0280726930490874*r+1.0609850577107909*a};return void 0!==e.alpha&&(o.alpha=e.alpha),o},$o={...Ft,mode:"rec2020",fromMode:{xyz65:yo,rgb:e=>yo(Zt(e))},toMode:{xyz65:xo,rgb:e=>er(xo(e))},parse:["rec2020"],serialize:"rec2020"},So=.0037930732552754493,Mo=Math.cbrt(So),ko=e=>Math.cbrt(e)-Mo,Ao=e=>Math.pow(e+Mo,3),Co={mode:"xyb",channels:["x","y","b","alpha"],parse:["--xyb"],serialize:"--xyb",toMode:{rgb:({x:e,y:t,b:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const o=Ao(e+t)-So,s=Ao(t-e)-So,i=Ao(r+t)-So,n=Qt({r:11.031566904639861*o-9.866943908131562*s-.16462299650829934*i,g:-3.2541473810744237*o+4.418770377582723*s-.16462299650829934*i,b:-3.6588512867136815*o+2.7129230459360922*s+1.9459282407775895*i});return void 0!==a&&(n.alpha=a),n}},fromMode:{rgb:e=>{const{r:t,g:r,b:a,alpha:o}=Yt(e),s=ko(.3*t+.622*r+.078*a+So),i=ko(.23*t+.692*r+.078*a+So),n={mode:"xyb",x:(s-i)/2,y:(s+i)/2,b:ko(.2434226892454782*t+.2047674442449682*r+.5518098665095535*a+So)-(s+i)/2};return void 0!==o&&(n.alpha=o),n}},ranges:{x:[-.0154,.0281],y:[0,.8453],b:[-.2778,.388]},interpolate:{x:Lt,y:Lt,b:Lt,alpha:{use:Lt,fixup:qt}}},No={mode:"xyz50",parse:["xyz-d50"],serialize:"xyz-d50",toMode:{rgb:xa,lab:ka},fromMode:{rgb:Sa,lab:wa},channels:["x","y","z","alpha"],ranges:{x:[0,.964],y:[0,.999],z:[0,.825]},interpolate:{x:Lt,y:Lt,z:Lt,alpha:{use:Lt,fixup:qt}}},Eo={mode:"xyz65",toMode:{rgb:er,xyz50:e=>{let{x:t,y:r,z:a,alpha:o}=e;void 0===t&&(t=0),void 0===r&&(r=0),void 0===a&&(a=0);let s={mode:"xyz50",x:1.0479298208405488*t+.0229467933410191*r-.0501922295431356*a,y:.0296278156881593*t+.990434484573249*r-.0170738250293851*a,z:-.0092430581525912*t+.0150551448965779*r+.7518742899580008*a};return void 0!==o&&(s.alpha=o),s}},fromMode:{rgb:Zt,xyz50:e=>{let{x:t,y:r,z:a,alpha:o}=e;void 0===t&&(t=0),void 0===r&&(r=0),void 0===a&&(a=0);let s={mode:"xyz65",x:.9554734527042182*t-.0230985368742614*r+.0632593086610217*a,y:-.0283697069632081*t+1.0099954580058226*r+.021041398966943*a,z:.0123140016883199*t-.0205076964334779*r+1.3303659366080753*a};return void 0!==o&&(s.alpha=o),s}},ranges:{x:[0,.95],y:[0,1],z:[0,1.088]},channels:["x","y","z","alpha"],parse:["xyz","xyz-d65"],serialize:"xyz-d65",interpolate:{x:Lt,y:Lt,z:Lt,alpha:{use:Lt,fixup:qt}}},zo={mode:"yiq",toMode:{rgb:({y:e,i:t,q:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const o={mode:"rgb",r:e+.95608445*t+.6208885*r,g:e-.27137664*t-.6486059*r,b:e-1.10561724*t+1.70250126*r};return void 0!==a&&(o.alpha=a),o}},fromMode:{rgb:({r:e,g:t,b:r,alpha:a})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const o={mode:"yiq",y:.29889531*e+.58662247*t+.11448223*r,i:.59597799*e-.2741761*t-.32180189*r,q:.21147017*e-.52261711*t+.31114694*r};return void 0!==a&&(o.alpha=a),o}},channels:["y","i","q","alpha"],parse:["--yiq"],serialize:"--yiq",ranges:{i:[-.595,.595],q:[-.522,.522]},interpolate:{y:Lt,i:Lt,q:Lt,alpha:{use:Lt,fixup:qt}}};Mt(tr),Mt(mr),Mt(Vr),Mt(Rr),Mt(Hr),Mt(Ur),Mt(Gr),Mt(Br),Mt(oa),Mt(pa),Mt(ba),Mt(Ca),Mt(Na),Mt(Ea),Mt(za),Mt(Ua),Mt(qa),Mt(Fa),Mt(ro),Mt(so),Mt(io),Mt(no),Mt(ho),Mt(fo),Mt($o),Mt(Ft),Mt(Co),Mt(No),Mt(Eo),Mt(zo);const To=e=>{const t=Math.round(Math.min(Math.max(e,0),255)).toString(16);return 1===t.length?`0${t}`:t},Io=e=>`#${To(e[0])}${To(e[1])}${To(e[2])}`,Po=e=>{const[t,r,a]=e,o=Math.max(t,r,a),s=o-Math.min(t,r,a),i=s&&(o===t?(r-a)/s:o===r?2+(a-t)/s:4+(t-r)/s);return[60*(i<0?i+6:i),o&&s/o,o]},Oo=e=>{const[t,r,a]=e,o=e=>{const o=(e+t/60)%6;return a-a*r*Math.max(Math.min(o,4-o,1),0)};return[o(5),o(3),o(1)]},jo=e=>Oo([e[0],e[1],255]),Do=(e,t,r)=>Math.min(Math.max(e,t),r),Vo=e=>{const t=e/100;return[Math.round(Ro(t)),Math.round(Ho(t)),Math.round(Lo(t))]},Ro=e=>{if(e<=66)return 255;return Do(329.698727446*(e-60)**-.1332047592,0,255)},Ho=e=>{let t;return t=e<=66?99.4708025861*Math.log(e)-161.1195681661:288.1221695283*(e-60)**-.0755148492,Do(t,0,255)},Lo=e=>{if(e>=66)return 255;if(e<=19)return 0;const t=138.5177312231*Math.log(e-10)-305.0447927307;return Do(t,0,255)},Uo=(e,t)=>{const r=Math.max(...e),a=Math.max(...t);let o;return o=0===a?0:r/a,t.map((e=>Math.round(e*o)))},qo=e=>0===e?1e6:Math.floor(1e6/e),Fo=(e,t,r)=>{const[a,o,s,i,n]=e,l=qo(t??2700),c=qo(r??6500),d=l-c;let h;try{h=n/(i+n)}catch(y){h=.5}const u=c+h*d,m=u?0===(p=u)?1e6:Math.floor(1e6/p):0;var p;const[g,f,b]=Vo(m),v=Math.max(i,n)/255;return Uo([a,o,s,i,n],[a+g*v,o+f*v,s+b*v])};const Go=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater","weather"]),Bo=(e,t)=>{if((void 0!==t?t:e?.state)===Ze)return"var(--state-unavailable-color)";const r=Xo(e,t);return r?(a=r,Array.isArray(a)?a.reverse().reduce(((e,t)=>`var(${t}${e?`, ${e}`:""})`),void 0):`var(${a})`):void 0;var a},Wo=(e,t,r)=>{const a=void 0!==r?r:t.state,o=function(e,t){const r=Ve(e.entity_id),a=void 0!==t?t:e?.state;if(["button","event","infrared","input_button","radio_frequency","scene"].includes(r))return a!==Ze;if(Ke(a))return!1;if("off"===a&&"alert"!==r)return!1;switch(r){case"alarm_control_panel":return"disarmed"!==a;case"alert":return"idle"!==a;case"cover":case"valve":return"closed"!==a;case"device_tracker":case"person":return"not_home"!==a;case"lawn_mower":return!["docked","paused"].includes(a);case"lock":return"locked"!==a;case"media_player":return"standby"!==a;case"vacuum":return!["idle","docked","paused"].includes(a);case"plant":return"problem"===a;case"group":return["on","home","open","locked","problem"].includes(a);case"timer":return"active"===a;case"camera":return"streaming"===a}return!0}(t,r);return Jo(e,t.attributes.device_class,a,o)},Jo=(e,t,r,a)=>{const o=[],s=((e,t="_")=>{const r="àáâäæãåāăąабçćčđďдèéêëēėęěеёэфğǵгḧхîïíīįìıİийкłлḿмñńǹňнôöòóœøōõőоṕпŕřрßśšşșсťțтûüùúūǘůűųувẃẍÿýыžźżз·",a=`aaaaaaaaaaabcccdddeeeeeeeeeeefggghhiiiiiiiiijkllmmnnnnnoooooooooopprrrsssssstttuuuuuuuuuuvwxyyyzzzz${t}`,o=new RegExp(r.split("").join("|"),"g"),s={"ж":"zh","х":"kh","ц":"ts","ч":"ch","ш":"sh","щ":"shch","ю":"iu","я":"ia"};let i;return""===e?i="":(i=e.toString().toLowerCase().replace(o,(e=>a.charAt(r.indexOf(e)))).replace(/[а-я]/g,(e=>s[e]||"")).replace(/(\d),(?=\d)/g,"$1").replace(/[^a-z0-9]+/g,t).replace(new RegExp(`(${t})\\1+`,"g"),"$1").replace(new RegExp(`^${t}+`),"").replace(new RegExp(`${t}+$`),""),""===i&&(i="unknown")),i})(r,"_"),i=a?"active":"inactive";return t&&o.push(`--state-${e}-${t}-${s}-color`),o.push(`--state-${e}-${s}-color`,`--state-${e}-${i}-color`,`--state-${i}-color`),o},Xo=(e,t)=>{const r=void 0!==t?t:e?.state,a=Ve(e.entity_id),o=e.attributes.device_class;if("sensor"===a&&"battery"===o){const e=(e=>{const t=Number(e);if(!isNaN(t))return t>=70?"--state-sensor-battery-high-color":t>=30?"--state-sensor-battery-medium-color":"--state-sensor-battery-low-color"})(r);if(e)return[e]}if("group"===a){const r=(e=>{const t=e.attributes.entity_id||[],r=[...new Set(t.map((e=>Ve(e))))];return 1===r.length?r[0]:void 0})(e);if(r&&Go.has(r))return Wo(r,e,t)}if(Go.has(a))return Wo(a,e,t)};var Yo;!function(e){e[e.TARGET_TEMPERATURE=1]="TARGET_TEMPERATURE",e[e.TARGET_TEMPERATURE_RANGE=2]="TARGET_TEMPERATURE_RANGE",e[e.TARGET_HUMIDITY=4]="TARGET_HUMIDITY",e[e.FAN_MODE=8]="FAN_MODE",e[e.PRESET_MODE=16]="PRESET_MODE",e[e.SWING_MODE=32]="SWING_MODE",e[e.AUX_HEAT=64]="AUX_HEAT",e[e.TURN_OFF=128]="TURN_OFF",e[e.TURN_ON=256]="TURN_ON",e[e.SWING_HORIZONTAL_MODE=512]="SWING_HORIZONTAL_MODE"}(Yo||(Yo={})),["auto","heat_cool","heat","cool","dry","fan_only","off"].reduce(((e,t,r)=>(e[t]=r,e)),{});const Zo={cooling:"cool",defrosting:"heat",drying:"dry",fan:"fan_only",heating:"heat",idle:"off",off:"off",preheating:"heat"};class Ko{static{Ko.colorCache={},Ko.element=void 0}static _prefixKeys(e){let t={};return Object.keys(e).forEach((r=>{const a=`--${r}`,o=String(e[r]);t[a]=`${o}`})),t}static processTheme(e){let t={},r={},a={},o={};const{modes:s,...i}=e;return s&&(r={...i,...s.dark},t={...i,...s.light}),a=Ko._prefixKeys(t),o=Ko._prefixKeys(r),{themeLight:a,themeDark:o}}static processPalette(e){let t={},r={},a={},o={},s={};return Object.values(e).forEach((e=>{const{modes:o,...s}=e;t={...t,...s},o&&(a={...a,...s,...o.dark},r={...r,...s,...o.light})})),o=Ko._prefixKeys(r),s=Ko._prefixKeys(a),{paletteLight:o,paletteDark:s}}static setElement(e){Ko.element=e}static calculateColor(e,t,r){const a=Object.keys(t).map((e=>Number(e))).sort(((e,t)=>e-t));let o,s,i;const n=a.length;if(e<=a[0])return t[a[0]];if(e>=a[n-1])return t[a[n-1]];for(let l=0;l<n-1;l++){const n=a[l],c=a[l+1];if(e>=n&&e<c){if([o,s]=[t[n],t[c]],!r)return o;i=Ko.calculateValueBetween(n,c,e);break}}return Ko.getGradientValue(o,s,i)}static calculateColor2(e,t,r,a,o){const s=Object.keys(t).map((e=>Number(e))).sort(((e,t)=>e-t));let i,n,l;const c=s.length;if(e<=s[0])return t[s[0]];if(e>=s[c-1])return t[s[c-1]];for(let d=0;d<c-1;d++){const c=s[d],h=s[d+1];if(e>=c&&e<h){if([i,n]=[t[c].styles[r][a],t[h].styles[r][a]],!o)return i;l=Ko.calculateValueBetween(c,h,e);break}}return Ko.getGradientValue(i,n,l)}static calculateValueBetween(e,t,r){return(Math.min(Math.max(r,e),t)-e)/(t-e)}static getLovelacePanel(){var e=window.document.querySelector("home-assistant");return(e=(e=(e=(e=(e=(e=e&&e.shadowRoot)&&e.querySelector("home-assistant-main"))&&e.shadowRoot)&&e.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"))&&e.shadowRoot||e)&&e.querySelector("ha-panel-lovelace"))||null}static calculateStrokeColor(e,t,r){const a=t?.colors??[];if(!a.length)return;const o=Number(e);if(!Number.isFinite(o))return a[0].color;if(o<=a[0].value)return a[0].color;const s=a[a.length-1];if(o>=s.value)return s.color;for(let i=0;i<a.length-1;i+=1){const e=a[i],t=a[i+1];if(o>=e.value&&o<t.value){if(!r)return e.color;const a=Ko.calculateValueBetween(e.value,t.value,o);return Ko.getGradientValue(e.color,t.color,a)}}return s.color}static resolveColorVariable(e){const t=this.element.style.getPropertyValue(e).trim();let r=t;if(t.startsWith("var(")){const e=t.replace(/^var\((--.*?)\)$/,"$1").trim();r=window.getComputedStyle(document.body).getPropertyValue(e).trim()}return r}static getColorVariable(e){const t=e.slice(4,-1).trim(),r=getComputedStyle(Ko.element).getPropertyValue(t).trim();if(r)return r;this.lovelace||(this.lovelace=Ko.getLovelacePanel());return getComputedStyle(this.lovelace).getPropertyValue(t).trim()}static getLovelaceColorVariable(e){const t=e.substr(4,e.length-5);this.lovelace||(this.lovelace=Ko.getLovelacePanel());return window.getComputedStyle(this.lovelace).getPropertyValue(t)}static getGradientValue(e,t,r){const a=Ko.colorToRGBA(e),o=Ko.colorToRGBA(t),s=1-r,i=r,n=Math.floor(a[0]*s+o[0]*i),l=Math.floor(a[1]*s+o[1]*i),c=Math.floor(a[2]*s+o[2]*i),d=Math.floor(a[3]*s+o[3]*i);return`#${Ko.padZero(n.toString(16))}${Ko.padZero(l.toString(16))}${Ko.padZero(c.toString(16))}${Ko.padZero(d.toString(16))}`}static padZero(e){return e.length<2&&(e=`0${e}`),e.substr(0,2)}static resolveColorVariableV0(e){let t=e;for(;"string"==typeof t&&t.trim().startsWith("var(");)t=Ko.getColorVariable(t).trim(),console.log("resolving color variable ",e,", to: ",t,"...");return t}static colorToRGBAChat(e){if(null==e)return[0,0,0,0];const t=Ko.colorCache[e];if(t)return t;let r=e;"string"==typeof r&&r.trim().startsWith("var(")&&(r=Ko.resolveColorVariable(r));const a=window.document.createElement("canvas");a.width=a.height=1;const o=a.getContext("2d");o.clearRect(0,0,1,1),o.fillStyle=r,o.fillRect(0,0,1,1);const s=[...o.getImageData(0,0,1,1).data];return Ko.colorCache[e]=s,s}static colorToRGBA(e){if(null==e)return[0,0,0,0];const t=Ko.colorCache[e];if(t)return t;let r=e;"var"===e.substr(0,3).valueOf()&&(r=Ko.getColorVariable(e));const a=window.document.createElement("canvas");a.width=a.height=1;const o=a.getContext("2d");o.clearRect(0,0,1,1),o.fillStyle=r,o.fillRect(0,0,1,1);const s=[...o.getImageData(0,0,1,1).data];return Ko.colorCache[e]=s,s}static hslToRgb(e){const t=e.h/360,r=e.s/100,a=e.l/100;let o,s,i;if(0===r)o=s=i=a;else{function n(e,t,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?e+6*(t-e)*r:r<.5?t:r<2/3?e+(t-e)*(2/3-r)*6:e}const l=a<.5?a*(1+r):a+r-a*r,c=2*a-l;o=n(c,l,t+1/3),s=n(c,l,t),i=n(c,l,t-1/3)}return o*=255,s*=255,i*=255,{r:o,g:s,b:i}}static computeColor(e){if(e.attributes?.hvac_action){const t=e.attributes.hvac_action;return t in Zo?Bo(e,Zo[t]):void 0}if(e.attributes?.rgb_color)return`rgb(${e.attributes.rgb_color.join(",")})`;const t=Bo(e);return t||void 0}static getHaEntityIconStyle(e){const t=Ko.computeColor(e),r=(e=>{if(e.attributes.brightness&&"plant"!==Ve(e.entity_id))return`brightness(${(e.attributes.brightness+245)/5}%)`;return""})(e);return{color:t??"var(--state-icon-color)",fill:"currentColor",...r?{filter:r}:{}}}}const Qo=200,es=100,ts=Qo;class rs{static calculateValueBetween(e,t,r){return isNaN(r)?0:r?(Math.min(Math.max(r,e),t)-e)/(t-e):0}static calculateSvgCoordinate(e,t){return e/100*Qo+(t-es)}static calculateSvgDimension(e){return e/100*Qo}static getLovelace(){let e=window.document.querySelector("home-assistant");if(e=e&&e.shadowRoot,e=e&&e.querySelector("home-assistant-main"),e=e&&e.shadowRoot,e=e&&e.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"),e=e&&e.shadowRoot||e,e=e&&e.querySelector("ha-panel-lovelace"),e=e&&e.shadowRoot,e=e&&e.querySelector("hui-root"),e){console.log("getLoveLace, root",e,e.lovelace);const t=e.lovelace;return t.current_view=e.___curView,t}return null}}class as{static mergeDeep(...e){const t=e=>e&&"object"==typeof e;return e.reduce(((e,r)=>(Object.keys(r).forEach((a=>{const o=e[a],s=r[a];Array.isArray(o)&&Array.isArray(s)?e[a]=o.concat(...s):t(o)&&t(s)?e[a]=this.mergeDeep(o,s):e[a]=s})),e)),{})}}const os={apparent_temperature:"mdi:thermometer",cloud_coverage:"mdi:weather-cloudy",dew_point:"mdi:thermometer-water",humidity:"mdi:water-percent",pressure:"mdi:gauge",temperature:"mdi:thermometer",uv_index:"mdi:sun-wireless",visibility:"mdi:weather-fog",wind_bearing:"mdi:weather-windy",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",precipitation_probability:"mdi:weather-pouring",condition_clear_night:"mdi:weather-night",condition_cloudy:"mdi:weather-cloudy",condition_fog:"mdi:weather-fog",condition_hail:"mdi:weather-hail",condition_lightning:"mdi:weather-lightning",condition_lightning_rainy:"mdi:weather-lightning-rainy",condition_partlycloudy:"mdi:weather-partly-cloudy",condition_pouring:"mdi:weather-pouring",condition_rainy:"mdi:weather-rainy",condition_snowy:"mdi:weather-snowy",condition_snowy_rainy:"mdi:weather-snowy-rainy",condition_sunny:"mdi:weather-sunny",condition_windy:"mdi:weather-windy",condition_windy_variant:"mdi:weather-windy-variant",condition_exceptional:"mdi:alert-circle-outline"},ss={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed",scale_style:"fixed"},is={xpos:50,ypos:50},ns={min:0,max:100,width:6,color:"var(--primary-background-color)"},ls={width:12,color:"var(--primary-color)"};class cs{static setConfig(e,t){return cs.getConfig(e).map(((e,r)=>{try{return cs.normalizeConfig(e,r,t)}catch(a){throw console.error("[HorseshoesLayout normalize error]",{index:r,horseshoeConfig:e,error:a,message:a?.message,stack:a?.stack}),a}}))}static getConfig(e){const t=cs.getLegacyConfig(e);return[...t?[t]:[],...Array.isArray(e.layout?.horseshoes)?e.layout.horseshoes:[]].map((e=>as.mergeDeep({},{show:ss,horseshoe_scale:ns,horseshoe_state:ls,entity_index:0},e))).filter((e=>!1!==e.show?.horseshoe))}static getLegacyConfig(e){const t={};return["show","horseshoe_scale","horseshoe_state","color_stops","styles"].forEach((r=>{void 0!==e[r]&&(t[r]=e[r])})),Object.keys(t).length>0?t:void 0}static normalize(e){return e?Pe.isPlainObject(e)&&Array.isArray(e.colors)?{...e,colors:e.colors.map((e=>Pe.normalizeColorEntry(e))).filter(Boolean).sort(((e,t)=>e.value-t.value))}:Pe.isPlainObject(e)?{colors:Object.entries(e).map((([e,t])=>Pe.normalizeColorPair(e,t))).filter(Boolean).sort(((e,t)=>e.value-t.value))}:Array.isArray(e)?{colors:e.flatMap((e=>Pe.normalizeColorArrayEntry(e))).filter(Boolean).sort(((e,t)=>e.value-t.value))}:{colors:[]}:{colors:[]}}static normalizeConfig(e,t,r){const a=e.entity_index??0,o=e.show,s=e.horseshoe_scale,i=e.horseshoe_state,n=e.xpos??e.horseshoe_position?.xpos??e.horseshoe_position?.cx??is.xpos??is.cx??50,l=e.ypos??e.horseshoe_position?.ypos??e.horseshoe_position?.cy??is.ypos??is.cy??50;if(null==s.min||null==s.max)throw Error(`No horseshoe min/max for scale defined for horseshoe ${t}`);const c=e.color_stops;let d,h,u,m;if(null!=c){const e=r.getJsTemplateOrValue({entity_index:a},c,{resolveKeys:!0});d=Pe.ensureMinimumStops(Pe.normalize(e),s.max);const t=d.colors;if(Array.isArray(t)&&t.length>=2){const e=t[0],r=t[t.length-1];null!=e?.color&&null!=r?.color&&(null==i.color&&(i.color=e.color),h=Pe.normalize({[s.min]:e.color,[s.max]:r.color}),u=e.color,m=r.color)}}const p=e.radius??45,g=e.tickmarks_radius??43,f=e.arc_degrees??260,b=p/100*ts,v=g/100*ts,y=2*f/360*Math.PI*b,_=2*Math.PI*b;return{...e,entity_index:a,show:o,fill:e.fill??"rgba(0, 0, 0, 0)",xpos:n,ypos:l,bar_mode:e.bar_mode??"normal",horseshoe_scale:s,horseshoe_state:i,radius:p,tickmarks_radius:g,arc_degrees:f,radiusSize:b,tickmarksRadiusSize:v,horseshoePathLength:y,circlePathLength:_,color_stops:c,colorStops:d,colorStopsMinMax:h,color0:u,color1:m,angleCoords:{x1:"0%",y1:"0%",x2:"100%",y2:"0%"},color1_offset:"0%"}}}class ds{static renderColorStopLabel(e){const t=String(e.label);return t.length>0?ds.renderColorStopTextPathLabel({...e,label:t}):ds.renderColorStopRotatedLabel({...e,label:t})}static renderColorStopTextPathLabel({horseshoeIndex:e,index:t,label:r,angle:a,cx:o,cy:s,radius:i,cardId:n,isMin:l=!1,isMax:c=!1,transformContext:d={}}){const h=String(r),{visualAngle:u,mirrored:m}=ds.resolveLabelGeometry({angle:a,...d}),p=m?ds.normalizeAngle(u+180):u;let g=p-12,f=p+12;l&&(g=p,f=p+24),c&&(g=p-24,f=p);const b=p>=270||p<=90,v=b?g:f,y=b?f:g,_=b?1:0;let w="50%",x="middle";l&&(w=b?"0%":"100%",x=b?"start":"end"),c&&(w=b?"100%":"0%",x=b?"end":"start");const $=ds.polarToCartesian(o,s,i,v),S=ds.polarToCartesian(o,s,i,y),M=`${n}-colorstop-label-${e}-${t}`,k=b?"0.0em":"0em",{rotation:A=0,flipX:C=!1,flipY:N=!1}=d;return q`
    <g transform="${`\n    translate(${o} ${s})\n    scale(${C?-1:1} ${N?-1:1})\n    rotate(${-A})\n    translate(${-o} ${-s})\n  `}">
      <path
        id="${M}"
        d="M ${$.x} ${$.y} A ${i} ${i} 0 0 ${_} ${S.x} ${S.y}"
        fill="none"
        stroke="none"
      />

      <text
        class="horseshoe-colorstop-label"
        style="fill:currentColor"
        dy="${k}"
      >
        <textPath
          href="#${M}"
          style="dominant-baseline:central"
          startOffset="${w}"
          text-anchor="${x}"
        >
          ${h}
        </textPath>
      </text>
    </g>
  `}static renderColorStopRotatedLabel({label:e,angle:t,cx:r,cy:a,radius:o}){const s=ds.polarToCartesian(r,a,o,t);let i=t;return i>90&&(i-=180),i<-90&&(i+=180),q`
      <text
        x="${s.x}"
        y="${s.y}"
        text-anchor="middle"
        style="dominant-baseline:central"
        transform="rotate(${i} ${s.x} ${s.y})"
        class="horseshoe-colorstop-label"
        style="fill:var(--primary-text-color)"
      >
        ${e}
      </text>
    `}static valueToAngle(e,t,r,a,o){if("bidirectional"!==o){return-a/2+(e-t)/(r-t)*a}const s=a/2;if(e<0){return-(e/t)*s}if(e>0){return e/r*s}return 0}static polarToCartesian(e,t,r,a){const o=(a-90)*Math.PI/180;return{x:e+r*Math.cos(o),y:t+r*Math.sin(o)}}static renderArcSegment({cx:e,cy:t,radius:r,startAngle:a,endAngle:o,width:s,color:i,className:n="",lineCap:l="round"}){const c=ds.polarToCartesian(e,t,r,a),d=ds.polarToCartesian(e,t,r,o),h=Math.abs(o-a)>180?1:0,u=o>a?1:0;return q`
    <path
      class="${n}"
      d="M ${c.x} ${c.y}
         A ${r} ${r} 0 ${h} ${u} ${d.x} ${d.y}"
      fill="none"
      stroke="${i}"
      stroke-width="${s}"
      stroke-linecap="${l}"
    />
  `}static buildColorStopSegments(e,t,r){const a=e.map((e=>({value:Number(e.value),color:e.color,label:e.label??e.value}))).filter((e=>Number.isFinite(e.value)&&e.value>=t&&e.value<=r)).sort(((e,t)=>e.value-t.value));if(!a.length)return[];const o=[{value:t,color:a[0].color},...a,{value:r,color:a[a.length-1].color}];return o.slice(0,-1).map(((e,t)=>{const r=o[t+1];return{startValue:e.value,endValue:r.value,color:e.color}})).filter((e=>e.startValue!==e.endValue))}static renderColorStopScaleSegments({cx:e,cy:t,radius:r,startAngle:a,endAngle:o,width:s,colorStops:i,min:n,max:l,arcDegrees:c,barMode:d,gap:h=0,opacity:u=1,className:m="",lineCap:p="butt"}){const g=ds.buildColorStopSegments(i.colors,n,l),f="round"===p;return q`
    ${g.map(((a,o)=>{const i=0===o,p=o===g.length-1,b=ds.valueToAngle(a.startValue,n,l,c,d)+h/2,v=ds.valueToAngle(a.endValue,n,l,c,d)-h/2;if(v<=b)return q``;const y=v>b?1:0;return q`
        ${ds.renderArcSegment({cx:e,cy:t,radius:r,startAngle:b,endAngle:v,width:s,color:a.color,opacity:u,className:m,lineCap:"butt"})}

        ${i&&f?ds.renderArcHalfCap({cx:e,cy:t,radius:r,angle:b,width:s,color:a.color,opacity:u,className:m,sweepFlag:y,side:"start"}):q``}

        ${p&&f?ds.renderArcHalfCap({cx:e,cy:t,radius:r,angle:v,width:s,color:a.color,opacity:u,className:m,sweepFlag:y,side:"end"}):q``}
      `}))}
  `}static renderArcHalfCap({cx:e,cy:t,radius:r,angle:a,width:o,color:s,opacity:i=1,className:n="",side:l="end"}){const c=ds.polarToCartesian(e,t,r,a),d=o/2,h=(c.x-e)/r,u=(c.y-t)/r,m=c.x-h*d,p=c.y-u*d,g=c.x+h*d,f=c.y+u*d;return q`
    <path
      class="${n}"
      d="
        M ${m} ${p}
        A ${d} ${d} 0 0 ${"start"===l?1:0} ${g} ${f}
        Z
      "
      fill="${s}"
    />
  `}static buildFixedScaleSegments({min:e,max:t,segmentSize:r,color:a}){if(!r||r<=0)return[{startValue:e,endValue:t,color:a}];const o=[];for(let s=e;s<t;s+=r)o.push({startValue:s,endValue:Math.min(s+r,t),color:a});return o}static renderFixedScaleSegments({cx:e,cy:t,radius:r,width:a,color:o,min:s,max:i,arcDegrees:n,barMode:l,segmentSize:c,gap:d=0,className:h="",lineCap:u="round"}){const m=ds.buildFixedScaleSegments({min:s,max:i,segmentSize:c,color:o});return ds.renderScaleSegments({cx:e,cy:t,radius:r,width:a,segments:m,min:s,max:i,arcDegrees:n,barMode:l,gap:d,className:h,lineCap:u})}static renderScaleSegments({cx:e,cy:t,radius:r,width:a,segments:o,min:s,max:i,arcDegrees:n,barMode:l,gap:c=2,className:d="",lineCap:h="butt"}){const u="round"===h;return q`
    ${o.map(((h,m)=>{const p=0===m,g=m===o.length-1,f=ds.valueToAngle(h.startValue,s,i,n,l)+c/2,b=ds.valueToAngle(h.endValue,s,i,n,l)-c/2;return b<=f?q``:q`
        ${ds.renderArcSegment({cx:e,cy:t,radius:r,startAngle:f,endAngle:b,width:a,color:h.color,className:d,lineCap:"butt"})}

        ${p&&u?ds.renderArcHalfCap({cx:e,cy:t,radius:r,angle:f,width:a,color:h.color,className:d,side:"start"}):q``}

        ${g&&u?ds.renderArcHalfCap({cx:e,cy:t,radius:r,angle:b,width:a,color:h.color,className:d,side:"end"}):q``}
      `}))}
  `}static renderScaleTicks({cx:e,cy:t,radius:r,min:a,max:o,arcDegrees:s,barMode:i,colorStops:n,ticksMajor:l,ticksMinor:c,tickType:d}){const h=r+Number(c?.offset??0),u=h+Number(l?.offset??0),m=l?ds.buildTickValues(a,o,Number(l.ticksize)):[];let p=c?ds.buildTickValues(a,o,Number(c.ticksize)).filter((e=>!l||!ds.isMajorTick(e,a,Number(l.ticksize)))):[];if("ticks_minor"===d){const e=Number(l?.ticksize);p=p.filter((t=>!ds.isMajorTick(t,a,e)))}return q`
    ${"ticks_minor"===d&&c?ds.renderTicks({cx:e,cy:t,radius:h,values:p,min:a,max:o,arcDegrees:s,barMode:i,width:Number(c.width??1),thickness:Number(c.thickness??2),color:c.color,colorMode:c.color_mode,colorStops:n,className:"horseshoe-scale-tick-minor"}):q``}

    ${l?ds.renderTicks({cx:e,cy:t,radius:u,values:m,min:a,max:o,arcDegrees:s,barMode:i,width:Number(l.width??4),thickness:Number(l.thickness??10),color:l.color,colorMode:l.color_mode,colorStops:n,className:"horseshoe-scale-tick-major"}):q``}
  `}static renderTicks({cx:e,cy:t,radius:r,values:a,min:o,max:s,arcDegrees:i,barMode:n,width:l,thickness:c,color:d,colorMode:h,colorStops:u,className:m=""}){return q`
    ${a.map((a=>{const p=ds.valueToAngle(a,o,s,i,n),g=ds.arcLengthToDegrees(c,r);let f=d;return"colorstop"===h&&(f=Ko.calculateStrokeColor(a,u,!1)),"colorstopgradient"===h&&(f=Ko.calculateStrokeColor(a,u,!0)),ds.renderArcSegment({cx:e,cy:t,radius:r,startAngle:p-g/2,endAngle:p+g/2,width:l,color:f,className:m,lineCap:"butt"})}))}
  `}static getVisualAngleFromParentTransform({angle:e,rotation:t=0,flipX:r=!1,flipY:a=!1}){const o=r?-1:1,s=a?-1:1,i=ds.degToRad(e),n=ds.degToRad(t),l=Math.cos(i),c=Math.sin(i),d=(l*Math.cos(n)-c*Math.sin(n))*o,h=(l*Math.sin(n)+c*Math.cos(n))*s;return ds.normalizeAngle(ds.radToDeg(Math.atan2(h,d)))}static resolveLabelGeometry({angle:e,rotation:t=0,flipX:r=!1,flipY:a=!1}){return{positionAngle:e,visualAngle:ds.getVisualAngleFromParentTransform({angle:e,rotation:t,flipX:r,flipY:a}),mirrored:r!==a}}static renderLabel(e){return"horizontal"===e.orientation?ds.renderHorizontalLabel(e):ds.renderColorStopLabel(e)}static renderHorizontalLabel({label:e,angle:t,cx:r,cy:a,radius:o,transformContext:s={}}){const i=ds.polarToCartesian(r,a,o,t),{rotation:n=0,flipX:l=!1,flipY:c=!1}=s,d=l?-1:1,h=c?-1:1;return q`
    <text
      x="${i.x}"
      y="${i.y}"
      text-anchor="middle"
      style="dominant-baseline:central;fill:var(--primary-text-color)"
      class="horseshoe-label"
      transform="
        translate(${i.x} ${i.y})
        scale(${d} ${h})
        rotate(${-n})
        translate(${-i.x} ${-i.y})
      "
    >
      ${e}
    </text>
  `}static buildTickValues(e,t,r){const a=[];for(let o=e;o<=t+1e-9;o+=r)a.push(Number(o.toFixed(10)));return a}static isMajorTick(e,t,r){const a=(e-t)/r;return Math.abs(a-Math.round(a))<1e-9}static renderLabelBadge(e){return"horizontal"===e.orientation?ds.renderHorizontalBadge(e):ds.renderArcBadge(e)}static renderArcLabelBadge({label:e,angle:t,cx:r,cy:a,radius:o,badge:s}){const i=String(e),n=Number(s.padding??2),l=Number(s.char_width??4),c=Number(s.width??i.length*l+2*n),d=Number(s.height??8),h=Math.max(0,c-d/2),u=ds.arcLengthToDegrees(h,o),m=ds.buildArcCapsulePath({cx:r,cy:a,radius:o,angle:t,arcSize:u,width:d});return q`
    <path
      class="horseshoe-colorstop-label-badge"
      d="${m}"
    />
  `}static renderArcBadge({label:e,angle:t,cx:r,cy:a,radius:o,badge:s}){const i=String(e),n=Number(s.padding??2),l=Number(s.char_width??4),c=Number(s.width??i.length*l+2*n),d=ds.arcLengthToDegrees(c,o);return ds.renderArcSegment({cx:r,cy:a,radius:o,startAngle:t-d/2,endAngle:t+d/2,width:Number(s.height??8),color:s.color??"var(--card-background-color)",className:"horseshoe-label-badge",lineCap:"round"})}static renderHorizontalBadge({label:e,angle:t,cx:r,cy:a,radius:o,badge:s}){const i=ds.polarToCartesian(r,a,o,t),n=String(e),l=Number(s.padding??4),c=Number(s.radius??Math.max(7,3*n.length+l));return q`
    <circle
      cx="${i.x}"
      cy="${i.y}"
      r="${c}"
      fill="${s.color??"var(--card-background-color)"}"
      stroke="${s.border_color??"none"}"
    />
  `}static getLabelBackgroundExtend({minLabel:e,maxLabel:t,charWidth:r,padding:a,radius:o}){const s=Math.max(String(e).length,String(t).length)*Number(r)+2*Number(a);return ds.arcLengthToDegrees(s/2,o)}static arcLengthToDegrees(e,t){return Number(e)/(2*Math.PI*t)*360}static textLengthToArcDegrees(e,t,r=6){return e/(2*Math.PI*t)*360+r}static resolveLabelAngles({angle:e,objectRotation:t=0,flipX:r=!1,flipY:a=!1}){const o=r?-1:1,s=a?-1:1,i=ds.degToRad(e),n=o*Math.cos(i),l=s*Math.sin(i),c=ds.normalizeAngle(ds.radToDeg(Math.atan2(l,n)));return{positionAngle:c,visualAngle:ds.normalizeAngle(c+t)}}static normalizeAngle(e){return(e%360+360)%360}static degToRad(e){return e*Math.PI/180}static radToDeg(e){return 180*e/Math.PI}static buildArcCapsulePath({cx:e,cy:t,radius:r,angle:a,arcSize:o,width:s}){const i=s/2,n=r+i,l=r-i,c=a-o/2,d=a+o/2,h=ds.polarToCartesian(e,t,n,c),u=ds.polarToCartesian(e,t,n,d),m=ds.polarToCartesian(e,t,l,d),p=ds.polarToCartesian(e,t,l,c),g=o>180?1:0;return`\n    M ${h.x} ${h.y}\n    A ${n} ${n} 0 ${g} 1 ${u.x} ${u.y}\n    A ${i} ${i} 0 0 1 ${m.x} ${m.y}\n    A ${l} ${l} 0 ${g} 0 ${p.x} ${p.y}\n    A ${i} ${i} 0 0 1 ${h.x} ${h.y}\n    Z\n  `}}class hs{static cache=new Map;static load(e){if(this.cache.has(e))return this.cache.get(e);const t=fetch(e).then((async t=>{if(!t.ok)throw new Error(`Could not load palette: ${e}`);return t.json()}));return this.cache.set(e,t),t}static async loadAll(e={}){const t=await Promise.all(Object.entries(e||{}).map((async([e,t])=>[e,await this.load(t)])));return Object.fromEntries(t)}static apply(e,t,r){Object.entries(t.ref).forEach((([t,r])=>{e.style.setProperty(`--${t}`,r)})),Object.entries(t.modes[r]).forEach((([t,r])=>{e.style.setProperty(`--${t}`,r)}))}static applyAll(e,t,r){Object.entries(t).forEach((([,t])=>{this.apply(e,t,r)}))}}console.info("%c FLEX-HORSESHOE-CARD %c Version 5.4.7-dev.5 ","color: white; font-weight: bold; background: darkgreen","color: darkgreen; font-weight: bold; background: white");const us={action:"more-info"},ms={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed",scale_style:"fixed"};class ps extends ne{constructor(){if(super(),Ko.setElement(this),this.palettesLoaded=!1,this.cardId=Math.random().toString(36).substr(2,9),this._hass=void 0,this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.viewBoxSize=ts,this.viewBox={width:ts,height:ts},this.colorStops={},this.animations={},this.animations.vlines={},this.animations.hlines={},this.animations.circles={},this.animations.icons={},this.animations.iconsIcon={},this.animations.names={},this.animations.areas={},this.animations.states={},this.resolvedEntityConfigs=[],this.colorCache={},this.isAndroid=!1,this.isSafari=!1,this.iOS=!1,this.resolvedVariables={},this.iconCache={},this.iconsSvg=[],this.pendingIconPath=[],this.iconsId=[],this.svgUrlCache||={},this.theme={},this.theme.checked=!1,this.theme.isLoaded=!1,this.theme.modeChanged=!1,this.theme.darkMode=!1,this.theme.light={},this.theme.dark={},this.palettes={},this.bar_mode="normal",this.dev={debug:!1},this.isAndroid=!!window.navigator.userAgent.match(/Android/),!this.isAndroid){const e=window.navigator.userAgent||"",t=e.toLowerCase(),r=window.navigator.platform||"",a=(/iPad|iPhone|iPod/.test(e)||"MacIntel"===r&&window.navigator.maxTouchPoints>1)&&!window.MSStream,o=e.match(/Version\/(\d+)(?:\.[\d.]+)?.*Safari/i),s=o?Number(o[1]):void 0,i=t.match(/\bos\s+(\d+)(?:[._]\d+)*.*like safari/),n=t.match(/\bios\s+(\d+)(?:[._]\d+)*/),l=n?Number(n[1]):i?Number(i[1]):void 0,c=Number.isFinite(s),d=Number.isFinite(l)&&t.includes("like safari"),h=c?s:d?l:void 0;this.iOS=a,this.isSafari=Number.isFinite(h),this.safariMajorVersion=h,this.isHomeAssistantLikeSafari=d,this.isRealSafari=c,this.isSafari14=this.isSafari&&14===h,this.isSafari15=this.isSafari&&15===h,this.isSafari16=this.isSafari&&16===h,this.isSafari17=this.isSafari&&17===h,this.isSafari18=this.isSafari&&18===h,this.isSafari26=this.isSafari&&26===h,this.isSafari27=this.isSafari&&27===h,this.isSafari28=this.isSafari&&28===h,this.isSafari29=this.isSafari&&29===h,this.isSafari30=this.isSafari&&30===h,this.isSafariGte16=this.isSafari&&h>=16,this.dev?.debug&&console.log("browser detection",{ua:e,isAndroid:this.isAndroid,isIOS:this.iOS,isSafari:this.isSafari,isRealSafari:this.isRealSafari,isHomeAssistantLikeSafari:this.isHomeAssistantLikeSafari,safariMajorVersion:this.safariMajorVersion,isSafariGte16:this.isSafariGte16}),this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config)}}static get styles(){return s`
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
    `}_resolveEntityConfigs(e){return e?.dev?.debug&&console.log("resolving entity config for",e?.entities),e?.entities?.map(((e,t)=>{const r={entity_index:t};return Ie.getJsTemplateOrValue(r,e)}))??[]}_buildMyIcon(e,t,r){if(!e||!t)return;if(r)return r;if(t.icon)return t.icon;const a=t.entity,o=t.attribute,s=o?e.attributes?.[o]:void 0,i=e.entity_id?.split(".")[0];if(e.attributes?.icon&&!o)return e.attributes.icon;if(o&&"weather"===i){const e=os[o];if(e)return e}this.entitiesIcon??={},this.entitiesIconKey??={},this.entitiesIconPending??={};const n=o?`${a}|attribute:${o}`:`${a}|state`,l=o?[a,"attribute",o,s??"",i??"",e.attributes?.device_class??"",e.attributes?.icon??""].join("|"):[a,"state",e.state??"",i??"",e.attributes?.device_class??"",e.attributes?.icon??""].join("|");if(this.entitiesIconKey[n]===l)return this.entitiesIcon[n];if(this.entitiesIconKey[n]=l,!this.entitiesIconPending[n]){this.entitiesIconPending[n]=!0;const t=o?(async(e,t,r,a)=>{let o;const s=tt(t),i=t.attributes.device_class,n=e.entities?.[t.entity_id],l=n?.platform,c=n?.translation_key,d=a??t.attributes[r];if(c&&l){const t=await ot(e.config,e.connection,l);t&&(o=nt(d,t[s]?.[c]?.state_attributes?.[r]))}if(!o){const t=await st(e.connection,e.config,s);if(t){const e=i&&t[i]?.state_attributes?.[r]||t._?.state_attributes?.[r];o=nt(d,e)}}return o})(this._hass,e,o,void 0!==s?String(s):void 0):(async(e,t,r,a,o)=>{const s=e?.[a.entity_id];if(s?.icon)return s.icon;const i=tt(a);return lt(t,r,i,a,o,s)})(this._hass.entities,this._hass.config,this._hass.connection,e);t.then((e=>{this.entitiesIconKey[n]===l&&e&&this.entitiesIcon[n]!==e&&(this.entitiesIcon[n]=e,this.requestUpdate())})).catch((e=>{console.error(o?"_buildMyIcon attributeIcon failed":"_buildMyIcon entityIcon failed",a,o??"",e)})).finally((()=>{this.entitiesIconPending[n]=!1}))}return this.entitiesIcon[n]}_formatEntityStateParts(e,t){const r=void 0!==t.attribute,a=r?this._hass.formatEntityAttributeValueToParts(e,t.attribute):this._hass.formatEntityStateToParts(e,this._buildState(e.state,t)),o=r?e.attributes[t.attribute]:e.state,s=void 0===t.decimals||Number.isNaN(Number(o))?void 0:((e,t,r)=>Xe(e,t,r).map((e=>e.value)).join(""))(Number(o),this._hass.locale,{minimumFractionDigits:Number(t.decimals),maximumFractionDigits:Number(t.decimals)});return a.map((e=>"value"===e.type&&void 0!==s?{...e,value:s}:"unit"===e.type&&void 0!==t.unit?{...e,value:t.unit}:e))}themeIsDarkMode(){return!0===this.theme.darkMode}themeIsLightMode(){return!1===this.theme.darkMode}set hass(e){this.setHass(e)}setHass(e,t=!1){this._hass=e,Ie.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes});let r=t;const a=e.selectedTheme||e.themes.theme||"",o=!0===e.themes.darkMode;if(this.theme.nameChanged=this.theme.name!==a,this.theme.modeChanged=this.theme.darkMode!==o,this.theme.nameChanged||this.theme.modeChanged){this.theme.name=a,this.theme.darkMode=o,Ko.colorCache={};const e=this.hass?.themes?.darkMode?"dark":"light";hs.applyAll(this,this.palettes,e)}if(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.resolvedEntityConfigs.forEach(((t,a)=>{const o=e.states[t.entity];if(!o)return;this.entities[a]=o;const s=this._buildState(o.state,t);if(tt(o),s!==this.entitiesStr[a]&&(this.entitiesStr[a]=s,r=!0),t.attribute&&Object.prototype.hasOwnProperty.call(o.attributes,t.attribute)){const e=this._buildState(o.attributes[t.attribute],t);e!==this.attributesStr[a]&&(this.attributesStr[a]=e,r=!0)}})),r){if(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.horseshoes=this.horseshoes.map(((e,t)=>{const r=e.entity_index??0,a=this.resolvedEntityConfigs[r],o=this.entities[r];if(!o||!a)return e;let s=o.state;a.attribute&&void 0!==o.attributes[a.attribute]&&(s=o.attributes[a.attribute]);const i=Ie.getJsTemplateOrValue({entity_index:r},e.horseshoe_scale),n=i?.min??0,l=i?.max??100;let c,d,h=!1;if("bidirectional"===(e.bar_mode||"normal")){this?.dev?.debug_bidirectional&&console.log("<debug_bidirectional> Set hass: Card ",this.cardId,"bidirectional aset as barmode");const t=e.horseshoePathLength;let r=Number(s);if(this?.dev?.debug_invert_state&&(r=-Number(s)),r>=0){this?.dev?.debug_bidirectional&&console.log("<debug_bidirectional> Set hass: Card ",this.cardId,"Postive state: ",r);const a=Math.min(Ko.calculateValueBetween(0,l,r),1)*(t/2);c=`${a} ${e.circlePathLength-a}`,d=void 0,h=!1}else{this?.dev?.debug_bidirectional&&console.log("<debug_bidirectional> Set hass: Card ",this.cardId,"Negative state: ",r);const a=(1-Math.min(Ko.calculateValueBetween(n,0,r),1))*(t/2);c=`${a} ${e.circlePathLength-a}`,d=""+-(e.circlePathLength-a),h=!0}}else{c=`${Math.min(Ko.calculateValueBetween(n,l,s),1)*e.horseshoePathLength} ${10*e.radiusSize}`,d=void 0,h=!1}const u=Math.min(Ko.calculateValueBetween(n,l,s),1),m=e.show.horseshoe_style;let p=e.color0,g=e.color1,f=e.color1_offset,b=e.angleCoords,v=e.stroke_color;if("fixed"===m)v=e.horseshoe_state.color,p=e.horseshoe_state.color,g=e.horseshoe_state.color,f="0%";else if("autominmax"===m){const t=Ko.calculateStrokeColor(s,e.colorStopsMinMax,!0);p=t,g=t,f="0%"}else if("colorstop"===m||"colorstopgradient"===m){const t=Ko.calculateStrokeColor(s,e.colorStops,"colorstopgradient"===m);p=t,g=t,f="0%"}else"lineargradient"===m&&(b={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},f=`${Math.round(100*(1-u))}%`);return{...e,horseshoe_scale:{...e.horseshoe_scale,...i},dashArray:c,dashOffset:d,bidirectional_negative:h,stroke_color:v,color0:p,color1:g,color1_offset:f,angleCoords:b}})),this.horseshoes.length>0){const e=this.horseshoes[0];this.dashArray=e.dashArray,this.dashOffset=e.dashOffset,this.bidirectional_negative=e.bidirectional_negative,this.stroke_color=e.stroke_color,this.color0=e.color0,this.color1=e.color1,this.color1_offset=e.color1_offset,this.angleCoords=e.angleCoords}this.config.animations&&Object.keys(this.config.animations).map((e=>{const t=e.substr(Number(e.indexOf(".")+1));return this.config.animations[e].map((e=>this.entities[t].state.toLowerCase()===e.state.toLowerCase()&&(e.vlines&&e.vlines.forEach((e=>this._updateAnimationStyles("vlines",e))),e.hlines&&e.hlines.forEach((e=>this._updateAnimationStyles("hlines",e))),e.circles&&e.circles.forEach((e=>this._updateAnimationStyles("circles",e))),e.icons&&e.icons.forEach((e=>{const t=e.animation_id;this.animations.icons[t]&&e.reuse||(this.animations.icons[t]={},this.animations.iconsIcon[t]={});const r=Ie.getJsTemplateOrValue(e,e.styles),a=Te.toStyleDict(r);this.animations.icons[t]={...this.animations.icons[t],...a},this.animations.iconsIcon[t]=Ie.getJsTemplateOrValue(e,e.icon)})),e.states&&e.states.forEach((e=>this._updateAnimationStyles("states",e))),!0))),!0})),Ie.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),this.theme.modeChanged=!1,this.requestUpdate()}}_updateAnimationStyles(e,t){const r=t.animation_id;if(null==r)return;const a=Ie.getJsTemplateOrValue(t,t.styles),o=Te.toStyleDict(a);this.animations[e][r]={...t.reuse?this.animations[e][r]??{}:{},...o}}_prepareItemColorStops(e){["states","names","areas","circles","hlines","vlines","icons","horseshoes"].forEach((t=>{const r=e.layout?.[t];Array.isArray(r)&&r.forEach((e=>{if(!e.color_stops)return;const t=Ie.getJsTemplateOrValue(e,e.color_stops,{resolveKeys:!0});e._colorStops=Pe.normalize(t)}))}))}_calculateSvgCoordinatesInGroup(e){const t={xpos:rs.calculateSvgDimension(e.xpos),ypos:rs.calculateSvgDimension(e.yposc||e.ypos)},r=this.config.layout?.groups?.[e.group];if(!e.group||!r)return t;return{xpos:rs.calculateSvgDimension(r.xpos+e.xpos-50),ypos:rs.calculateSvgDimension(r.ypos+(e.yposc||e.ypos)-50)}}_computeGroupDimensions(e){const t=e.layout?.groups;t&&Object.entries(t).forEach((([e,t])=>{t.svg={xpos:rs.calculateSvgDimension(t.xpos),ypos:rs.calculateSvgDimension(t.ypos)}}))}_computeSvgDimensions(e){const t=e.layout;t?.names&&t.names.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.states&&t.states.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.areas&&t.areas.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.icons&&t.icons.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.hlines&&t.hlines.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.length=rs.calculateSvgDimension(e.length)})),t?.vlines&&t.vlines.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.length=rs.calculateSvgDimension(e.length)})),t?.circles&&t.circles.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.radius=e.radius})),this?.horseshoes&&this.horseshoes.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.radius=rs.calculateSvgDimension(e.radius),e.svg.tickmarksRadius=rs.calculateSvgDimension(e.tickmarks_radius),e.svg.rotateX=e.svg.xpos,e.svg.rotateY=e.svg.ypos}))}_isStaticCalc(e){return"string"==typeof e&&e.startsWith("calc(")&&e.endsWith(")")}_evaluateStaticCalc(e,t={}){const r=e.slice(5,-1).trim();if(!/^[0-9+\-*/().,\sA-Za-z_]+$/.test(r))throw new Error(`Invalid static calc expression '${e}'`);const a={...t,sin:Math.sin,cos:Math.cos,tan:Math.tan,abs:Math.abs,round:Math.round,floor:Math.floor,ceil:Math.ceil,min:Math.min,max:Math.max,sqrt:Math.sqrt,PI:Math.PI},o=Function(...Object.keys(a),`"use strict"; return (${r});`)(...Object.values(a));if(!this._isStaticNumber(o))throw new Error(`Static calc expression '${e}' did not return a finite number`);return o}_evaluateStaticCalcV2(e){const t=e.slice(5,-1).trim();if(!/^[0-9+\-*/().,\sA-Za-z_]+$/.test(t))throw new Error(`Invalid static calc expression '${e}'`);const r={sin:Math.sin,cos:Math.cos,tan:Math.tan,abs:Math.abs,round:Math.round,floor:Math.floor,ceil:Math.ceil,min:Math.min,max:Math.max,sqrt:Math.sqrt,PI:Math.PI},a=Function(...Object.keys(r),`"use strict"; return (${t});`)(...Object.values(r));if("number"!=typeof a||!Number.isFinite(a))throw new Error(`Static calc expression '${e}' did not return a finite number`);return a}_evaluateStaticCalcV1(e){const t=e.slice(5,-1).trim();if(!/^[0-9+\-*/().\s]+$/.test(t))throw new Error(`Invalid static calc expression '${e}'`);const r=Function(`"use strict"; return (${t});`)();if("number"!=typeof r||!Number.isFinite(r))throw new Error(`Static calc expression '${e}' did not return a number`);return r}_evaluateStaticConfigV1(e){return this._isStaticCalc(e)?this._evaluateStaticCalc(e):Array.isArray(e)?e.map((e=>this._evaluateStaticConfig(e))):e&&"object"==typeof e?(Object.entries(e).forEach((([t,r])=>{e[t]=this._evaluateStaticConfig(r)})),e):e}_isStaticNumber(e){return"number"==typeof e&&Number.isFinite(e)}_applySameAsDeltas(e,t,r){return Object.entries(e).forEach((([e,a])=>{if(!e.startsWith("same_as_d"))return;const o=e.substring(9);if(!o)throw new Error(`Invalid same_as delta field '${e}' for item ${r}`);if(void 0===t[o])throw new Error(`same_as delta '${e}' requires '${o}' for item ${r}`);if(!this._isStaticNumber(t[o]))throw new Error(`same_as delta '${e}' requires numeric '${o}' for item ${r}`);if(!this._isStaticNumber(a))throw new Error(`same_as delta '${e}' must be numeric for item ${r}`);t[o]+=a})),t}_applySameAsDeltasV1(e,t){return Object.entries(e).forEach((([e,r])=>{if(!e.startsWith("same_as_d"))return;const a=e.substring(9);if(void 0===t[a])throw new Error(`same_as delta '${e}' requires '${a}'`);t[a]=Number(t[a])+Number(r)})),t}_resolveSameAsItems(e){const t=new Map;return e.map(((e,r)=>{let a;if(void 0===e.same_as)a=e;else{const o=t.get(String(e.same_as));if(!o)throw new Error(`same_as '${e.same_as}' not found for item ${r}`);const{same_as:s,...i}=e;a=as.mergeDeep(o,i),a=this._applySameAsDeltas(e,a),delete a.same_as,Object.keys(a).filter((e=>e.startsWith("same_as_d"))).forEach((e=>delete a[e]))}return t.set(String(a.id),a),a}))}_resolveSameAsItemsV4(e){const t=new Map;return e.map(((e,r)=>{let a;if(void 0===e.same_as)a=e;else{const o=t.get(String(e.same_as));if(!o)throw new Error(`same_as '${e.same_as}' not found for item ${r}`);const{same_as:s,same_as_dxpos:i,same_as_dypos:n,same_as_dlength:l,same_as_dradius:c,...d}=e;a=as.mergeDeep(o,d),void 0!==i&&(a.xpos=Number(a.xpos)+Number(i)),void 0!==n&&(a.ypos=Number(a.ypos)+Number(n)),void 0!==l&&(a.length=Number(a.length)+Number(l)),void 0!==c&&(a.radius=Number(a.radius)+Number(c))}return t.set(String(a.id),a),a}))}_resolveSameAsItemsV3(e){const t=new Map(e.map((e=>[String(e.id),e])));return e.map(((e,r)=>{if(void 0===e.same_as)return e;const a=t.get(String(e.same_as));if(!a)throw new Error(`same_as '${e.same_as}' not found for item ${r}`);const{same_as:o,same_as_dxpos:s,same_as_dypos:i,...n}=e,l=as.mergeDeep(a,n);if(void 0!==s){if(void 0===l.xpos)throw new Error(`same_as_dxpos requires xpos for item ${r}`);l.xpos+=s}if(void 0!==i){if(void 0===l.ypos)throw new Error(`same_as_dypos requires ypos for item ${r}`);l.ypos+=i}return l}))}_resolveSameAsItemsV2(e){const t=new Map(e.map((e=>[String(e.id),e])));return e.map(((e,r)=>{if(void 0===e.same_as)return e;const a=t.get(String(e.same_as));if(!a)throw new Error(`same_as '${e.same_as}' not found for item ${r}`);const{same_as:o,...s}=e;return as.mergeDeep(a,s)}))}_resolveSameAsItemsV1(e){return e.map(((e,t,r)=>{if(void 0===e.same_as)return e;const a=r[e.same_as];if(!a)throw new Error(`same_as '${e.same_as}' not found for item ${t}`);const{same_as:o,...s}=e;return as.mergeDeep(a,s)}))}_resolveSectionSameAs(e){["horseshoes","states","names","areas","circles","hlines","vlines","icons"].forEach((t=>{const r=e.layout?.[t];Array.isArray(r)&&(e.layout[t]=this._resolveSameAsItems(r))}))}_assignIdItems(e){return e.map(((e,t)=>({...e,id:String(e.id??t)})))}_assignSectionIds(e){["horseshoes","states","names","areas","circles","hlines","vlines","icons"].forEach((t=>{const r=e.layout?.[t];Array.isArray(r)&&(e.layout[t]=this._assignIdItems(r))}))}_isStaticRef(e){return"string"==typeof e&&e.startsWith("ref(")&&e.endsWith(")")}_cloneStaticValue(e){return e&&"object"==typeof e?as.mergeDeep(Array.isArray(e)?[]:{},e):e}_evaluateConstants(e){const t=e.constants;if(!t||"object"!=typeof t)return{};const r={};return Object.entries(t).forEach((([e,a])=>{t[e]=this._evaluateStaticConfig(a,r),this._isStaticNumber(t[e])&&(r[e]=t[e])})),r}_resolveStaticRef(e,t){if(!this._isStaticRef(e))return e;const r=e.slice(4,-1).trim();if(!(r in t))throw new Error(`Static ref '${r}' not found`);return this._cloneStaticValue(t[r])}_resolveStaticRefs(e,t={}){return this._isStaticRef(e)?this._resolveStaticRef(e,t):Array.isArray(e)?e.map((e=>this._resolveStaticRefs(e,t))):e&&"object"==typeof e?(Object.entries(e).forEach((([r,a])=>{e[r]=this._resolveStaticRefs(a,t)})),e):e}_evaluateStaticConfig(e,t={}){return this._isStaticCalc(e)?this._evaluateStaticCalc(e,t):Array.isArray(e)?e.map((e=>this._evaluateStaticConfig(e,t))):e&&"object"==typeof e?(Object.entries(e).forEach((([r,a])=>{e[r]=this._evaluateStaticConfig(a,t)})),e):e}setConfig(e){try{if(e=JSON.parse(JSON.stringify(e)),this.dev={...e.dev},!e.entities)throw Error("No entities defined");if(!e.layout)throw Error("No layout defined");e?.palettes&&hs.loadAll(e?.palettes).then((e=>{this.palettes=e;const t=this.hass?.themes?.darkMode?"dark":"light";Ko.setElement(this),hs.applyAll(this,e,t),this.palettesLoaded||(Ko.colorCache={},Object.keys(Ko.colorCache).filter((e=>e.startsWith("var("))).forEach((e=>delete Ko.colorCache[e])),this.palettesLoaded=!0,this.setHass(this._hass,!0)),this.requestUpdate()})),this._assignSectionIds(e);const t=this._evaluateConstants(e);this._resolveStaticRefs(e,e.constants),this._evaluateStaticConfig(e,t),this._resolveSectionSameAs(e),Ie.setContext({hass:this._hass,config:e,entities:this.entities,horseshoes:this.horseshoes});const r=this._resolveEntityConfigs(e);if(r){if("sensor"!==Ve(r[0].entity)&&r[0].attribute&&!isNaN(r[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}r.forEach((e=>{e.tap_action||(e.tap_action={...us})}));const a={texts:[],card_filter:"card--filter-none",bar_mode:e.bar_mode||"normal",...e,show:{...ms,...e.show}};this.horseshoes=cs.setConfig(e,Ie);const o=this.horseshoes?.[0];o&&(this.colorStops=o.colorStops,this.colorStopsMinMax=o.colorStopsMinMax,this.color0=o.color0,this.color1=o.color1,this.angleCoords=o.angleCoords,this.color1_offset=o.color1_offset),this._prepareItemColorStops(a),this.config=a,this.bar_mode=a.bar_mode||"normal",this.config.layout?.icons&&this.config.layout.icons.forEach(((e,t)=>{this.iconsId[t]=Math.random().toString(36).substr(2,9)})),this.aspectratio=(this.config.layout.aspectratio||this.config.aspectratio||"1/1").trim();const s=this.aspectratio.split("/");this.viewBox||(this.viewBox={}),this.viewBox.width=s[0]*Qo,this.viewBox.height=s[1]*Qo,this._computeGroupDimensions(this.config),this._computeSvgDimensions(this.config),Ie.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes})}catch(t){throw console.error("[FHC setConfig] CONFIG ERROR",{error:t,message:t?.message,stack:t?.stack,rawConfig:e,horseshoes:this.horseshoes}),t}}_getItemStateValue(e={}){const t=e.entity_index??0,r=this.entities?.[t],a=this.config?.entities?.[t];if(!r)return;const o=a?.attribute;return o&&r.attributes&&void 0!==r.attributes[o]?r.attributes[o]:r.state}_getItemColorFromStops(e={}){if(!e._colorStops)return;const t=this._getItemStateValue(e),r=Number(t);return Number.isFinite(r)?Ko.calculateStrokeColor(r,e._colorStops,!0===e.colorstop_gradient):void 0}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback()}render({config:e}=this){const t=Ie.getJsTemplateOrValue({entity_index:0},e?.styles),r=Te.toStyleDict(t);return U`
      <ha-card @click=${e=>this.handlePopup(e,this.entities[0])} style=${me(r)}>
        <div class="container" id="container">${this._renderSvg()}</div>

        <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
          ${this.horseshoes?.map(((e,t)=>q`
              <linearGradient
                gradientTransform="rotate(0)"
                id="horseshoe__gradient-${this.cardId}-${t}"
                x1="${e.angleCoords.x1}"
                y1="${e.angleCoords.y1}"
                x2="${e.angleCoords.x2}"
                y2="${e.angleCoords.y2}"
              >
                <stop offset="${e.color1_offset}" stop-color="${e.color1}" style="transition: stop-color 1s ease;"></stop>
                <stop offset="100%" stop-color="${e.color0}" style="transition: stop-color 1s ease;"></stop>
              </linearGradient>
            `))??""}
        </svg>
      </ha-card>
    `}_renderOriginalTickMarks(e,t){if(!1===e.show?.scale_tickmarks)return q``;const r=e.horseshoe_scale,a=Number(r.min),o=Number(r.max),s=o-a;if(!s)return q``;const i={entity_index:e.entity_index},n=Ie.getJsTemplateOrValue(i,e?.horseshoe_tickmarks?.styles),l=Te.toStyleDict(n),c=e.svg.xpos,d=e.svg.ypos,h={transformOrigin:`${c}px ${d}px`};void 0!==e?.horseshoe_tickmarks?.fill&&(h.fill=e.horseshoe_tickmarks.fill);const u=r.color||"var(--primary-background-color)";h.fill=u;const m={...l,...h},p=r.ticksize||s/10,g=e.arc_degrees||260,f=r.width?r.width/2:3,b=a%p,v=a+(0===b?0:p-b);if(v>o)return q``;const y=Math.floor((o-v)/p)+1,_=Array.from({length:y},((t,r)=>{const o=(g/2-(v+r*p-a)/s*g)*Math.PI/180;return q`
      <circle
        cx="${c-Math.sin(o)*e.tickmarksRadiusSize}"
        cy="${d-Math.cos(o)*e.tickmarksRadiusSize}"
        r="${f}"
        style=${me(m)}>
      </circle>
    `}));return q`${_}`}_renderSvg(){const e=this.config.card_filter?this.config.card_filter:"card--filter-none";return q`
        <svg xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
            class="${e}"
          viewBox='0 0 ${this.viewBox.width} ${this.viewBox.height}'>
            <g id="circles" class="circles">
              ${this._renderCircles()}
            </g>
          ${this._renderHorseShoes()}
            <g id="datagroup" class="datagroup">
              ${this._renderHorizontalLines()}
              ${this._renderVerticalLines()}
              ${this._renderIcons()}
              ${this._renderEntityAreas()}
              ${this._renderEntityNames()}
              ${this._renderEntityStates()}
            </g>
        </svg>
      `}_renderHorseShoes(){return q`
    ${this.horseshoes?.map(((e,t)=>this._renderHorseShoe(e,t)))??q``}
  `}_renderHorseShoe(e,t){if(!1===e.show?.horseshoe)return q``;const r=e.svg.xpos,a=e.svg.ypos,o=e.svg.rotateX,s=e.svg.rotateY,i=e.bar_mode||"normal",n=`${e.svg.radius}px`,l=e.horseshoe_scale.color||"#000000",c=e.horseshoe_scale.width||6,d=e.horseshoe_state.width||12,h=-90-(e.arc_degrees??260)/2,u=`${e.horseshoePathLength},${e.circlePathLength}`,m=`horseshoe__gradient-${this.cardId}-${t}`,p={entity_index:e.entity_index},g=Ie.getJsTemplateOrValue(p,e.horseshoe_scale?.styles),f=Te.toStyleDict(g),b={stroke:l,strokeWidth:c,strokeDasharray:u,strokeLinecap:"round"};void 0!==e.horseshoe_scale?.fill&&(b.fill=e.horseshoe_scale.fill);const v={fill:"none","stroke-linecap":"round",...f,...b},y=Ie.getJsTemplateOrValue(p,e.horseshoe_state?.styles),_=Te.toStyleDict(y),w={stroke:`url('#${m}')`,strokeDasharray:e.dashArray,strokeDashoffset:e.dashOffset,strokeWidth:d};void 0!==e.horseshoe_state?.fill&&(w.fill=e.horseshoe_state.fill);const x={fill:"none",transition:"all 2.5s ease-out",strokeLinecap:"round",..._,...w},$=e.rotate?`rotate(${e.rotate})`:"",S={};void 0!==v.opacity&&(S.opacity=v.opacity),void 0!==v.animation&&(S.animation=v.animation);const M=Ie.getJsTemplateOrValue(p,e.horseshoe_labels?.background?.styles),k={...Te.toStyleDict(M)},A=Ie.getJsTemplateOrValue(p,e.horseshoe_labels?.badges?.styles),C={...Te.toStyleDict(A)},N=Ie.getJsTemplateOrValue(p,e.horseshoe_labels?.styles),E={...Te.toStyleDict(N)},z=Ie.getJsTemplateOrValue(p,e.horseshoe_tickmarks?.ticks_major?.styles),T={...Te.toStyleDict(z)},I=Ie.getJsTemplateOrValue(p,e.horseshoe_tickmarks?.ticks_minor?.styles),P={...Te.toStyleDict(I)},O="bidirectional"===i?-90:h;return this?.dev?.debug_bidirectional&&console.log("<debug_bidirectional> Render Horseshoe: Card ",this.cardId,"barMode: ",i),q`
      <g id="horseshoe__svg__group-${t}" class="horseshoe__svg__group"
        transform="${$} ${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
      >
        <g style=${me(S)}>
          ${this._renderHorseshoeScale(e,t)}
        </g>

        <g style=${me(k)}>
          ${this._renderHorseshoeLabelBackground(e,t)}
        </g>

        <g>
          <circle id="horseshoe__state__value-${t}" class="horseshoe__state__value"
            cx="${r}px" cy="${a}px" r="${n}"
            transform="rotate(${O} ${o} ${s})"
            style=${me(x)} />
          ${this._renderOriginalTickMarks(e,t)}
        </g>

        <g style=${me(P)}>
          ${this._renderHorseshoeTicks(e,t,"ticks_minor")}
        </g>

        <g style=${me(T)}>
          ${this._renderHorseshoeTicks(e,t,"ticks_major")}
        </g>

        <g style=${me(C)}>
          ${this._renderHorseshoeLabelBadges(e,t)}
        </g>

        <g style=${me(E)}>
          ${this._renderHorseshoeLabels(e,t,$)}
        </g>
      </g>
    `}_renderEntityName(e){const t=e.entity_index??0,r=Ie.getJsTemplateOrValue(e,e.styles),a={"font-size":"1.5em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...Te.toStyleDict(r)},o={...this.animations?.names?.[e.animation_id]??{}},s=this._getItemColorFromStops(e);s&&(o.stroke=s);const i={...a,...o},n=this.textEllipsis(this._buildName(this.entities[e.entity_index],this.resolvedEntityConfigs[e.entity_index]),e?.max_characters??e?.ellipsis);return q`
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
                style=${me(i)}>
                ${n}</tspan>
          </text>
          </g>
        `}_renderEntityNames(){const{layout:e}=this.config;if(!e?.names)return q``;const t=e.names.map((e=>this._renderEntityName(e)));return q`${t}`}_renderEntityArea(e){const t=e.entity_index??0,r=Ie.getJsTemplateOrValue(e,e.styles),a={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...Te.toStyleDict(r)},o={...Te.toStyleDict(this.animations?.areas?.[e.animation_id]??{})},s=this._getItemColorFromStops(e);s&&(o.stroke=s);const i={...a,...o},n=this.textEllipsis(this._buildArea(this.entities[e.entity_index],this.resolvedEntityConfigs[e.entity_index]),e?.max_characters??e?.ellipsis);return q`
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
              style=${me(i)}>
              ${n}</tspan>
        </text>
      </g>
      `}_renderEntityAreas(){const{layout:e}=this.config;if(!e?.areas)return q``;const t=e.areas.map((e=>this._renderEntityArea(e)));return q`${t}`}_getGroupScaleTransform(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;if(!t?.scale&&!e?.flip)return"";const r=t?.scale?.x??t?.scale??1,a=t?.scale?.y??t?.scale??1;return`scale(${r*("x"===e?.flip||"both"===e?.flip?-1:1)}, ${a*("y"===e?.flip||"both"===e?.flip?-1:1)})`}_getGroupScaleStyle(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;return t?.scale&&t.svg?`transform-origin:${t.svg.xpos}px ${t.svg.ypos}px; transform-box:view-box;`:`transform-origin:${e.svg.xpos}px ${e.svg.ypos}px; transform-box:view-box;`}_renderEntityState(e){if(!e)return q``;const t=e.entity_index??0,r=e.svg.xpos??es,a=e.svg.ypos??es,o=e.dx?e.dx:"0",s=e.dy?e.dy:"0",i=Ie.getJsTemplateOrValue(e,e.styles),n=Te.toStyleDict(i),l=e.uom??{},c=Ie.getJsTemplateOrValue(e,l.styles),d=Te.toStyleDict(c),h=l.dx??"0.1",u=l.dy??"-0.45";let m={};this.animations?.states?.[e.animation_id]&&(m={...this.animations.states[e.animation_id]});const p=this._getItemColorFromStops(e);p&&(m.fill=p);const g={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...n,...m},f=g["font-size"];let b=.5,v="em";const y=String(f).trim().match(/^(\d*\.?\d+)([a-z%]+)$/i);y?(b=.6*Number(y[1]),v=y[2]):console.error("Cannot determine font-size for state",f);const _={"font-size":`${b}${v}`},w={...g,opacity:"0.7",..._,...d},x=this.entities[t],$=this.resolvedEntityConfigs[t]??{},S=this._formatEntityStateParts(x,$);let M="",k="";S.forEach((e=>{"unit"===e.type?k+=e.value:"value"===e.type&&(M+=e.value)})),M=M.trim(),k=k.trim();const A=this._buildUom(x,$,k);return q`
      <g
        transform="${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
        <text @click=${e=>this.handlePopup(e,this.entities[t])}>
          <tspan
            class="state__value"
            x="${r}"
            y="${a}"
            dx="${o}em"
            dy="${s}em"
            style=${me(g)}
          >${M}</tspan><tspan
            class="state__uom"
            dx="${h}em"
            dy="${u}em"
            style=${me(w)}
          >${A}</tspan>
        </text>
      </g>
    `}_renderEntityStates(){const{layout:e}=this.config;if(!e)return;if(!e.states)return;const t=e.states.map((e=>q`
            ${this._renderEntityState(e)}
          `));return q`${t}`}updated(e){super.updated?.(e),this._injectSvgUrlIcons()}_isSvgUrl(e){return console.log("svg test",e),e.endsWith(".svg")}_isSvgUrlV1(e){return/\.svg(?:[?#].*)?$/i.test(e)}_isUrlIcon(e){return"string"==typeof e&&/^url\(['"]?.+['"]?\)$/i.test(e.trim())}_renderCachedSvgUrlIcon(e,t,r,a,o,s,i,n){const l=this.svgUrlCache[r].cloneNode(!0),c=e.rotate??0,d=o/24,h=s-o*n+12*d,u=i-.5*o-(e.yposc?0:.25*o)+12*d;return l.classList.remove("hidden"),q`
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
          x="${-o/2}"
          y="${-o/2}"
          height="${o}px"
          width="${o}px"
          stroke-width="0px"
          fill="rgba(0,0,0,0)"
        ></rect>

        <g class="icon-style-animation" style="${me(a)}">
          <g class="icon-rotate" transform="rotate(${c})">
            <svg
              x="${-o/2}"
              y="${-o/2}"
              width="${o}"
              height="${o}"
              viewBox="0 0 24 24"
              overflow="visible"
            >
              ${l}
            </svg>
          </g>
        </g>
      </g>
    </g>
  `}_renderCachedSvgUrlIconV1(e,t,r,a,o,s,i,n){const l=e.rotate??0,c=o/24,d=s-o*n+12*c,h=i-.5*o-(e.yposc?0:.25*o)+12*c,u=this.svgUrlCache[r].cloneNode(!0);return u.classList.remove("hidden"),q`
    <g
      transform="${this._getGroupScaleTransform(e)}"
      style="${this._getGroupScaleStyle(e)}"
    >
      <g class="icon-position" transform="translate(${d} ${h})">
        <g class="icon-style-animation" style="${me(a)}">
          <g class="icon-rotate" transform="rotate(${l})">
            <g class="icon-scale" transform="scale(${c})">
              <g class="icon-center" transform="translate(-12 -12)">
                ${u}
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  `}_getUrlFromCssUrl(e){return e.trim().replace(/^url\(['"]?/i,"").replace(/['"]?\)$/,"")}_renderSvgUrlPlaceholder(e,t,r,a,o,s){const i=e.rotate??0,n=r/24,l=a-r*s+12*n,c=o-.5*r-(e.yposc?0:.25*r)+12*n;return q`
    <g
      transform="${this._getGroupScaleTransform(e)}"
      style="${this._getGroupScaleStyle(e)}"
    >
      <g class="icon-position" transform="translate(${l} ${c})">
        <g class="icon-rotate" transform="rotate(${i})">
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
  `}_injectSvgUrlIcons(){const e=this.shadowRoot.querySelectorAll("svg.icon-svg-url[data-src]:not(.injected-svg)");e.length&&function(e,t){var r=void 0===t?{}:t,a=r.afterAll,o=void 0===a?function(){}:a,s=r.afterEach,i=void 0===s?function(){}:s,n=r.beforeEach,l=void 0===n?function(){}:n,c=r.cacheRequests,d=void 0===c||c,h=r.evalScripts,u=void 0===h?"never":h,m=r.httpRequestWithCredentials,p=void 0!==m&&m,g=r.renumerateIRIElements,f=void 0===g||g;if(e&&"length"in e)for(var b=0,v=0,y=e.length;v<y;v++){var _=e[v];_&&ze(_,u,f,d,p,l,(function(t,r){i(t,r),e&&"length"in e&&e.length===++b&&o(b)}))}else e?ze(e,u,f,d,p,l,(function(t,r){i(t,r),o(1),e=null})):o(0)}(e,{beforeEach(e){e.removeAttribute("height"),e.removeAttribute("width")},afterEach:(e,t)=>{if(e||!t)return;const r=t.dataset.src;r&&(this.svgUrlCache[r]=t.cloneNode(!0))},afterAll:()=>{this.requestUpdate()},cacheRequests:!1,evalScripts:"once",httpRequestWithCredentials:!1,renumerateIRIElements:!1})}_renderSvgUrlIcon(e,t,r,a,o,s,i,n){return this.svgUrlCache[r]?this._renderCachedSvgUrlIcon(e,t,r,a,o,s,i,n):this._renderSvgUrlPlaceholder(e,r,o,s,i,n)}_renderImageUrlIcon(e,t,r,a,o,s,i,n){const l=e.rotate??0,c=o/24,d=s-o*n+12*c,h=i-.5*o-(e.yposc?0:.25*o)+12*c;return q`
    <g
      transform="${this._getGroupScaleTransform(e)}"
      style="${this._getGroupScaleStyle(e)}"
    >
      <g
        class="icon-position"
        transform="translate(${d} ${h})"
        @click=${t=>this.handlePopup(t,this.entities[e.entity_index])}
      >
        <rect
          x="${-o/2}"
          y="${-o/2}"
          height="${o}px"
          width="${o}px"
          stroke-width="0px"
          fill="rgba(0,0,0,0)"
        ></rect>

        <g class="icon-style-animation" style="${me(a)}">
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
  `}computeEntityColor(e){if(!e||"off"===e.state||"unavailable"===e.state||"unknown"===e.state)return"var(--state-icon-color)";const t=e.state;if(!isNaN(t)||t.endsWith("W")||t.endsWith("kWh")||t.endsWith("V"))return"var(--state-icon-color)";const r=e.entity_id.split(".")[0],a=e.attributes.device_class;if("sensor"===r)return"var(--state-icon-color)";if("light"===r&&e.attributes.rgb_color&&"on"===t){const[t,r,a]=e.attributes.rgb_color;return`rgb(${t}, ${r}, ${a})`}return"binary_sensor"===r&&a&&"on"===t?`var(--state-binary_sensor-${a}-on-color, var(--state-icon-active-color))`:"climate"===r?`var(--state-climate-${t}-color, var(--state-icon-active-color))`:"on"===t?`var(--state-${r}-active-color, var(--state-${r}-color, var(--state-icon-active-color)))`:"var(--state-icon-color)"}_renderIcon(e,t){if(!e)return;e.entity=e.entity?e.entity:0,this.iconCache||={},this.iconsSvg||=[],this.pendingIconPath||=[];const r=12*(e.icon_size?e.icon_size:e.size?e.size:2),a=e.svg.xpos,o=e.svg.ypos,s=e.align?e.align:"center",i="center"===s?.5:"start"===s?-1:1;let n=a-r*i,l=o-r*i,c=r;const d=e.entity_index??0,h=this.entities[d],u=Ko.getHaEntityIconStyle(h),m={};m.fill=u.fill,m.color=u.color,m.filter=u.filter;const p=Ie.getJsTemplateOrValue(e,e.styles);let g=Te.toStyleDict(p);const f=this.animations?.icons?.[e.animation_id]??{},b=this._getItemColorFromStops(e);b&&(g.fill=b,g.color=b),g={...m,...g,...f};const v=this._buildMyIcon(this.entities[d],this.resolvedEntityConfigs[d],this.animations?.iconsIcon?.[e.animation_id]);if(this._isUrlIcon(v)){const t=this._getUrlFromCssUrl(v);return this._isSvgUrl(t)?this._renderSvgUrlIcon(e,d,t,g,r,a,o,i):this._renderImageUrlIcon(e,d,t,g,r,a,o,i)}if(this.iconCache[v])this.iconsSvg[t]=this.iconCache[v];else if(this.iconsSvg[t]=void 0,this.pendingIconPath[t]!==v){this.pendingIconPath[t]=v;let e=0;const r=40,a=50,o=()=>{if(this.pendingIconPath[t]!==v)return;const s=this._getRenderedHaIconPath(t);if(s)return this.iconsSvg[t]=s,this.iconCache[v]=s,this.pendingIconPath[t]=void 0,void this.requestUpdate();e+=1,e>=r?this.pendingIconPath[t]=void 0:window.setTimeout(o,a)};(this?.updateComplete&&"function"==typeof this.updateComplete.then||this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((e=>window.requestAnimationFrame(e)))).then((()=>{window.setTimeout(o,0)}))}const y=this.iconsSvg[t];if(y){const s=a-r*i,n=o-.5*r-(e.yposc?0:.25*r),l=r/24,c=e.rotate??0,d=s+12*l,h=n+12*l;return g["transform-origin"]??="0 0",q`
      <g
        transform="${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
        <g
          id="icon-rendered-${this.iconsId[t]}"
          class="icon-position"
          transform="translate(${d} ${h})"
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

          <g class="icon-style-animation" style="${me(g)}">
            <g class="icon-rotate" transform="rotate(${c})">
              <g class="icon-scale" transform="scale(${l})">
                <g class="icon-center" transform="translate(-12 -12)">
                  <path d="${y}"></path>
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
  `}_getRenderedHaIconPath(e){const t=this.shadowRoot.getElementById(`icon-${this.iconsId[e]}`);return t?.shadowRoot?.querySelector("*")?.path}_scheduleIconPathRead(e,t){if(!e)return;if(this.iconCache[e])return void(this.iconsSvg[t]=this.iconCache[e]);if(this.pendingIconPath[t]===e)return;this.pendingIconPath[t]=e;let r=0;const a=()=>{if(this.pendingIconPath[t]!==e)return;if(this.iconCache[e])return this.iconsSvg[t]=this.iconCache[e],this.pendingIconPath[t]=void 0,void this.requestUpdate();const o=this._getRenderedHaIconPath();if(o)return this.iconsSvg[t]=o,this.iconCache[e]=o,this.pendingIconPath[t]=void 0,void this.requestUpdate();r+=1,r>=40?this.pendingIconPath[t]=void 0:this._iconPathTimer=window.setTimeout(a,50)};(this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((e=>{window.requestAnimationFrame(e)}))).then((()=>{this._iconPathTimer=window.setTimeout(a,0)}))}_renderIcons(){const{layout:e}=this.config;if(!e)return;if(!e.icons)return;const t=e.icons.map(((e,t)=>q`
            ${this._renderIcon(e,t)}
          `));return q`${t}`}_renderHorizontalLine(e){const t=e.entity_index??0,r=Ie.getJsTemplateOrValue(e,e.styles),a={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2",...Te.toStyleDict(r)},o={...Te.toStyleDict(this.animations?.hlines?.[e.animation_id]??{})},s=this._getItemColorFromStops(e);s&&(o.stroke=s);const i={...a,...o};return q`
      <g
        transform="${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
        <line
          @click=${e=>this.handlePopup(e,this.entities[t])}
          class="line__horizontal"
          x1="${e.svg.xpos-e.svg.length/2}"
          y1="${e.svg.ypos}"
          x2="${e.svg.xpos+e.svg.length/2}"
          y2="${e.svg.ypos}"
          style=${me(i)}
        ></line>
      </g>
  `}_renderHorizontalLines(){const{layout:e}=this.config;if(!e?.hlines)return q``;const t=e.hlines.map((e=>this._renderHorizontalLine(e)));return q`${t}`}_renderVerticalLine(e){const t=e.entity_index??0,r=Ie.getJsTemplateOrValue(e,e.styles),a={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2",...Te.toStyleDict(r)},o={...Te.toStyleDict(this.animations?.vlines?.[e.animation_id]??{})},s=this._getItemColorFromStops(e);s&&(o.stroke=s);const i={...a,...o};return q`
      <g
        transform="${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
        <line
          @click=${e=>this.handlePopup(e,this.entities[t])}
          class="line__vertical"
          x1="${e.svg.xpos}"
          y1="${e.svg.ypos-e.svg.length/2}"
          x2="${e.svg.xpos}"
          y2="${e.svg.ypos+e.svg.length/2}"
          style=${me(i)}
        ></line>
      </g>
    `}_renderVerticalLines(){const{layout:e}=this.config;if(!e?.vlines)return q``;const t=e.vlines.map((e=>this._renderVerticalLine(e)));return q`${t}`}_renderCircle(e){const t=e.entity_index??0,r=Ie.getJsTemplateOrValue(e,e.styles),a={...Te.toStyleDict(r)},o={...Te.toStyleDict(this.animations?.circles?.[e.animation_id]??{})},s=this._getItemColorFromStops(e);s&&(o.stroke=s);const i={...a,...o};return q`
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
          style=${me(i)}
        ></circle>
      </g>
    `}_renderCircles(){const{layout:e}=this.config;if(!e?.circles)return q``;const t=e.circles.map((e=>this._renderCircle(e)));return q`${t}`}_handleClick(e,t,r,a,o){let s;switch(a.action){case"more-info":s=new Event("hass-more-info",{composed:!0}),s.detail={entityId:o},e.dispatchEvent(s);break;case"navigate":if(!a.navigation_path)return;window.history.pushState(null,"",a.navigation_path),s=new Event("location-changed",{composed:!0}),s.detail={replace:!1},window.dispatchEvent(s);break;case"call-service":{if(!a.service)return;const[e,r]=a.service.split(".",2),o={...a.service_data};t.callService(e,r,o);break}case"fire-dom-event":s=new Event("ll-custom",{composed:!0,bubbles:!0}),s.detail=a,e.dispatchEvent(s)}}handlePopup(e,t){e.stopPropagation();const r=this.resolvedEntityConfigs.find((e=>e.entity===t.entity_id)),a=r?.tap_action??this.config?.tap_action??{action:"more-info"};this._handleClick(this,this._hass,this.config,a,t.entity_id)}textEllipsis(e,t){return t&&t<e.length?e.slice(0,t-1).concat("..."):e}_buildArea(e,t){if(t.area)return t.area;if(!this._hass||!this._hass.areas)return"";const r=this._hass.entities&&this._hass.entities[t.entity];let a=r?r.area_id:null;if(!a&&r&&r.device_id&&this._hass.devices){const e=this._hass.devices[r.device_id];a=e?e.area_id:null}if(a){const e=this._hass.areas[a];return e?e.name:""}return"?"}_buildName(e,t){return t.name??e.attributes.friendly_name??e?.entity_id??"?"}_buildIcon(e,t,r){return r||t?.icon||e?.attributes?.icon||qe(e)}_buildUom(e,t,r){return t.unit||r||""}_buildState(e,t){if(void 0===e)return e;if(null===e)return e;if(t.convert){let r,a,o=t.convert.match(/(^\w+)\((\d+)\)/);switch(null===o?r=t.convert:3===o.length&&(r=o[1],a=Number(o[2])),r){case"brightness_pct":e="undefined"===e?"undefined":`${Math.round(e/255*100)}`;break;case"multiply":e=`${Math.round(e*a)}`;break;case"divide":e=`${Math.round(e/a)}`;break;case"rgb_csv":case"rgb_hex":if(t.attribute){let a=this._hass.states[t.entity];switch(a.attributes.color_mode){case"unknown":case"onoff":case"brightness":case"white":break;case"color_temp":if(a.attributes.color_temp_kelvin){let t=Vo(a.attributes.color_temp_kelvin);const o=Po(t);o[1]<.4&&(o[1]<.1?o[2]=225:o[1]=.4),t=Oo(o),t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:Io(t)}else e="rgb_csv"===r?"255,255,255":"#ffffff00";break;case"hs":{let t=jo([a.attributes.hs_color[0],a.attributes.hs_color[1]/100]);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:Io(t)}break;case"rgb":{const t=Po(this.stateObj.attributes.rgb_color);t[1]<.4&&(t[1]<.1?t[2]=225:t[1]=.4);const a=Oo(t);e="rgb_csv"===r?a.toString():Io(a)}break;case"rgbw":{let t=(e=>{const[t,r,a,o]=e;return Uo([t,r,a,o],[t+o,r+o,a+o])})(a.attributes.rgbw_color);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:Io(t)}break;case"rgbww":{let t=Fo(a.attributes.rgbww_color,a.attributes?.min_color_temp_kelvin,a.attributes?.max_color_temp_kelvin);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:Io(t)}break;case"xy":if(a.attributes.hs_color){let t=jo([a.attributes.hs_color[0],a.attributes.hs_color[1]/100]);const o=Po(t);o[1]<.4&&(o[1]<.1?o[2]=225:o[1]=.4),t=Oo(o),t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:Io(t)}else if(a.attributes.color){let t={};t.l=a.attributes.brightness,t.h=a.attributes.color.h||a.attributes.color.hue,t.s=a.attributes.color.s||a.attributes.color.saturation;let{r:o,g:s,b:i}=Ko.hslToRgb(t);if("rgb_csv"===r)e=`${o},${s},${i}`;else{e=`#${Ko.padZero(o.toString(16))}${Ko.padZero(s.toString(16))}${Ko.padZero(i.toString(16))}`}}else a.attributes.xy_color}}break;default:console.error(`Unknown converter [${r}] specified for entity [${t.entity}]!`)}}return void 0!==e?Number.isNaN(e)?e:e.toString():void 0}_computeEntity(e){return e.substr(e.indexOf(".")+1)}_renderHorseshoeTicks(e,t,r){if(!e?.show?.ticks)return q``;const a=e.horseshoe_tickmarks;if(!a?.ticks_major&&!a?.ticks_minor)return q``;const o=Number(e.horseshoe_scale.min),s=Number(e.horseshoe_scale.max),i=e.svg.xpos,n=e.svg.ypos,l=e.svg.radius,c=e.bar_mode,d=e.arc_degrees;return ds.renderScaleTicks({cx:i,cy:n,radius:l,min:o,max:s,arcDegrees:d,barMode:c,colorStops:e.colorStops,ticksMajor:a.ticks_major,ticksMinor:a.ticks_minor,tickType:r})}_renderHorseshoeScale(e,t){const r=e?.show?.scale_style??"fixed";if("none"===r)return q``;const a=Number(e.horseshoe_scale.min),o=Number(e.horseshoe_scale.max),s=e.svg.xpos,i=e.svg.ypos,n=e.svg.radius,l=e.bar_mode,c=e.arc_degrees,d=e.horseshoe_scale.width,h=e.horseshoe_scale.color,u=e.colorStops;return"colorstop"===r?u?.colors?.length?ds.renderColorStopScaleSegments({cx:s,cy:i,radius:n,startAngle:-c/2,endAngle:c/2,width:d,colorStops:u,min:a,max:o,arcDegrees:c,barMode:l,gap:u.gap??0,className:"horseshoe-colorstop-scale-segment",lineCap:"round"}):q``:"fixed"===r?ds.renderFixedScaleSegments({cx:s,cy:i,radius:n,startAngle:-c/2,endAngle:c/2,width:d,color:h,min:a,max:o,arcDegrees:c,barMode:l,segmentSize:0,gap:0,className:"horseshoe-fixed-scale-segment",lineCap:"round"}):q``}_testRenderColorStopScale(e,t){const r=t?.show?.scale_style;if(!r)return q``;const a=Number(t.horseshoe_scale.min),o=Number(t.horseshoe_scale.max),s=t.svg.xpos,i=t.svg.ypos,n=t.svg.radius,l=t.bar_mode,c=t.arc_degrees,d=t.horseshoe_scale.width,h=t.horseshoe_scale.color,u=t.colorStops;return"colorstop"===r?u?.colors?.length?ds.renderColorStopScaleSegments({cx:s,cy:i,radius:n,startAngle:-c/2,endAngle:c/2,width:d,colorStops:u,min:a,max:o,arcDegrees:c,barMode:l,gap:u.gap??0,className:"horseshoe-colorstop-scale-segment",lineCap:"round"}):q``:"fixed_tickmarks"===r?ds.renderScaleTicks({cx:s,cy:i,radius:n,min:a,max:o,arcDegrees:c,barMode:l,color:h,ticksMajor:t.horseshoe_scale.ticks_major,ticksMinor:t.horseshoe_scale.ticks_minor}):"fixed"===r?ds.renderFixedScaleSegments({cx:s,cy:i,radius:n,startAngle:-c/2,endAngle:c/2,width:d,color:h,min:a,max:o,arcDegrees:c,barMode:l,segmentSize:0,gap:0,className:"horseshoe-fixed-scale-segment",lineCap:"round"}):q``}_renderHorseshoeLabelBackground(e,t){const r=e?.show?.label_background??"none";if("none"===r)return q``;const a=e?.horseshoe_labels?.background??{},o=Number(e.horseshoe_scale.min),s=Number(e.horseshoe_scale.max),i=e.svg.xpos,n=e.svg.ypos,l=e.svg.radius+Number(e?.horseshoe_labels?.offset??e.horseshoe_state.width+2),c=e.bar_mode,d=e.arc_degrees,h=Number(a.width??6),u=a.color,m=Number(a.gap??0),p=e.colorStops;return ds.getLabelBackgroundExtend({minLabel:o,maxLabel:s,charWidth:Number(e?.horseshoe_labels?.badges?.char_width??4),padding:Number(e?.horseshoe_labels?.badges?.padding??3),radius:l}),"colorstop"===r?p?.colors?.length?ds.renderColorStopScaleSegments({cx:i,cy:n,radius:l,startAngle:-d/2,endAngle:d/2,width:h,colorStops:p,min:o,max:s,arcDegrees:d,barMode:c,gap:m,className:"horseshoe-label-background-colorstop",lineCap:"round"}):q``:"fixed"===r?ds.renderFixedScaleSegments({cx:i,cy:n,radius:l,startAngle:-d/2-20,endAngle:d/2+20,width:h,color:u,min:o,max:s,arcDegrees:d,barMode:c,segmentSize:0,gap:0,className:"horseshoe-label-background-fixed",lineCap:"round"}):q``}_renderHorseshoeLabelBadges(e,t){const r=e?.show?.labels_at??"none";if("none"===r||!e?.show?.label_badges)return q``;const a=Number(e.horseshoe_scale.min),o=Number(e.horseshoe_scale.max),s=e.svg.xpos,i=e.svg.ypos,n=e.svg.radius+Number(e?.horseshoe_labels?.offset??e.horseshoe_state.width+2),l=e.bar_mode,c=e.arc_degrees,d=e.colorStops,h=e?.horseshoe_labels?.orientation??"arc",u=e?.horseshoe_labels?.badges??{};let m=[];if("minmax"===r&&(m=[{value:a,label:a},{value:o,label:o}]),"colorstop"===r){if(!d?.colors?.length)return q``;m=[{value:a,label:a},...d.colors,{value:o,label:o}]}if("ticks_major"===r){const t=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);if(!Number.isFinite(t)||t<=0)return q``;m=ds.buildTickValues(a,o,t).map((e=>({value:e,label:e})))}if("both"===r){const t=d?.colors?.length?[{value:a,label:a},...d.colors,{value:o,label:o}]:[],r=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);m=[...t,...Number.isFinite(r)&&r>0?ds.buildTickValues(a,o,r).map((e=>({value:e,label:e}))):[]]}m=m.filter((e=>{const t=Number(e.value);return Number.isFinite(t)&&t>=a&&t<=o})).sort(((e,t)=>Number(e.value)-Number(t.value))).filter(((e,t,r)=>{const a=Number(e.value);return r.findIndex((e=>Number(e.value)===a))===t}));const p=Number(e?.horseshoe_labels?.distance_min??0),g=[];return m.forEach((e=>{const t=Number(e.value);if(p<=0)return void g.push(e);const r=g[g.length-1];(!r||Math.abs(t-Number(r.value))>=p)&&g.push(e)})),q`
    ${g.map(((e,r)=>{const d=Number(e.value),m=ds.valueToAngle(d,a,o,c,l);return ds.renderLabelBadge({horseshoeIndex:t,index:r,label:e.label??e.value,angle:m,cx:s,cy:i,radius:n,cardId:this.cardId,orientation:h,badge:u})}))}
  `}_renderHorseshoeLabels(e,t,r){const a=e?.show?.labels_at??"none";if("none"===a)return q``;const o=Number(e.horseshoe_scale.min),s=Number(e.horseshoe_scale.max),i=e.svg.xpos,n=e.svg.ypos,l=e.svg.radius+Number(e?.horseshoe_labels?.offset??e.horseshoe_state.width+2),c=e.bar_mode,d=e.arc_degrees,h=e.colorStops,u=e?.horseshoe_labels?.orientation??"arc",m=e?.flip,p={rotation:e?.rotate??0,flipX:"x"===m||"both"===m,flipY:"y"===m||"both"===m};let g=[];if("minmax"===a&&(g=[{value:o,label:o},{value:s,label:s}]),"colorstop"===a){if(!h?.colors?.length)return q``;g=[{value:o,label:o},...h.colors,{value:s,label:s}].filter(((e,t,r)=>{const a=Number(e.value);return Number.isFinite(a)&&a>=o&&a<=s&&r.findIndex((e=>Number(e.value)===a))===t}))}if("ticks_major"===a){const t=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);if(!Number.isFinite(t)||t<=0)return q``;g=ds.buildTickValues(o,s,t).map((e=>({value:e,label:e})))}if("both"===a){const t=h?.colors?.length?[{value:o,label:o},...h.colors,{value:s,label:s}]:[],r=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);g=[...t,...Number.isFinite(r)&&r>0?ds.buildTickValues(o,s,r).map((e=>({value:e,label:e}))):[]].filter((e=>{const t=Number(e.value);return Number.isFinite(t)&&t>=o&&t<=s})).sort(((e,t)=>Number(e.value)-Number(t.value))).filter(((e,t,r)=>{const a=Number(e.value);return r.findIndex((e=>Number(e.value)===a))===t}))}const f=Number(e?.horseshoe_labels?.distance_min??0),b=[];return g.forEach((e=>{const t=Number(e.value);if(f<=0)return void b.push(e);const r=b[b.length-1];(!r||Math.abs(t-Number(r.value))>=f)&&b.push(e)})),q`
      ${b.map(((e,r)=>{const a=Number(e.value),h=ds.valueToAngle(a,o,s,d,c);return ds.renderLabel({horseshoeIndex:t,index:r,label:e.label??e.value,angle:h,cx:i,cy:n,radius:l,cardId:this.cardId,orientation:u,isMin:!1,isMax:!1,transformContext:p})}))}
    `}_renderColorStopLabels(e,t,r,a,o){if("colorstop"!==t?.show?.labels_at)return console.log("_renderColorStopLabels, NO labels_at",t?.show),q``;if(!a?.colors?.length)return console.log("renderColorStopLabels, no colorstops",t),q``;const s=Number(r.min),i=Number(r.max),n=t.svg.xpos,l=t.svg.ypos,c=t.svg.radius+Number(t?.horseshoe_labels?.offset??t.horseshoe_state.width+2),d=t.bar_mode;let h=[];"colorstop"===t?.show?.labels_at&&(h=[{value:s,label:s},...a.colors,{value:i,label:i}].filter(((e,t,r)=>{const a=Number(e.value);return Number.isFinite(a)&&a>=s&&a<=i&&r.findIndex((e=>Number(e.value)===a))===t})));const u=Number(t?.horseshoe_labels?.distance_min??0),m=[];return h.forEach(((e,t)=>{const r=Number(e.value);if(0===t||t===h.length-1||u<=0)return void m.push(e);const a=m[m.length-1];(!a||Math.abs(r-Number(a.value))>=u)&&m.push(e)})),q`
      ${m.map(((t,r)=>{const a=Number(t.value),h=ds.valueToAngle(a,s,i,o,d);return ds.renderColorStopLabel({horseshoeIndex:e,index:r,label:t.label??t.value,angle:h,cx:n,cy:l,radius:c,cardId:this.cardId,isMin:!1,isMax:!1})}))}
  `}getCardSize(){return 4}}customElements.get("flex-horseshoe-card")||customElements.define("flex-horseshoe-card",ps);

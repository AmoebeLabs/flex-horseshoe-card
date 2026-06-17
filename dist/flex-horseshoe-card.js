/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),s=new WeakMap;let o=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const r=this.t;if(t&&void 0===e){const t=void 0!==r&&1===r.length;t&&(e=s.get(r)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&s.set(r,e))}return e}toString(){return this.cssText}};const a=(e,...t)=>{const s=1===e.length?e[0]:t.reduce(((t,r,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[s+1]),e[0]);return new o(s,e,r)},i=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,r))(t)})(e):e
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:u}=Object,m=globalThis,p=m.trustedTypes,g=p?p.emptyScript:"",f=m.reactiveElementPolyfillSupport,b=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},v=(e,t)=>!n(e,t),_={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(e,r,t);void 0!==s&&l(this.prototype,e,s)}}static getPropertyDescriptor(e,t,r){const{get:s,set:o}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const a=s?.call(this);o?.call(this,t),this.requestUpdate(e,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...h(e),...d(e)];for(const r of t)this.createProperty(r,e[r])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,r]of t)this.elementProperties.set(e,r)}this._$Eh=new Map;for(const[t,r]of this.elementProperties){const e=this._$Eu(t,r);void 0!==e&&this._$Eh.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(i(e))}else void 0!==e&&t.push(i(e));return t}static _$Eu(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((r,s)=>{if(t)r.adoptedStyleSheets=s.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const t of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=t.cssText,r.appendChild(s)}})(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){const r=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,r);if(void 0!==s&&!0===r.reflect){const o=(void 0!==r.converter?.toAttribute?r.converter:y).toAttribute(t,r.type);this._$Em=e,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){const r=this.constructor,s=r._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=r.getPropertyOptions(s),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=s;const a=o.fromAttribute(t,e.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(e,t,r,s=!1,o){if(void 0!==e){const a=this.constructor;if(!1===s&&(o=this[e]),r??=a.getPropertyOptions(e),!((r.hasChanged??v)(o,t)||r.useDefault&&r.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,r))))return;this.C(e,t,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:s,wrapped:o},a){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==o||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,r]of e){const{wrapped:e}=r,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,r,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,f?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,$=w.trustedTypes,k=$?$.createPolicy("flex-horseshoe-card-lit-html",{createHTML:e=>e}):void 0,S="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,A="?"+M,C=`<${A}>`,N=document,E=()=>N.createComment(""),T=e=>null===e||"object"!=typeof e&&"function"!=typeof e,z=Array.isArray,I="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,j=/>/g,V=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,R=/"/g,L=/^(?:script|style|textarea|title)$/i,H=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),G=H(1),F=H(2),U=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),B=new WeakMap,J=N.createTreeWalker(N,129);function W(e,t){if(!z(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(t):t}const X=(e,t)=>{const r=e.length-1,s=[];let o,a=2===t?"<svg>":3===t?"<math>":"",i=P;for(let n=0;n<r;n++){const t=e[n];let r,l,c=-1,h=0;for(;h<t.length&&(i.lastIndex=h,l=i.exec(t),null!==l);)h=i.lastIndex,i===P?"!--"===l[1]?i=O:void 0!==l[1]?i=j:void 0!==l[2]?(L.test(l[2])&&(o=RegExp("</"+l[2],"g")),i=V):void 0!==l[3]&&(i=V):i===V?">"===l[0]?(i=o??P,c=-1):void 0===l[1]?c=-2:(c=i.lastIndex-l[2].length,r=l[1],i=void 0===l[3]?V:'"'===l[3]?R:D):i===R||i===D?i=V:i===O||i===j?i=P:(i=V,o=void 0);const d=i===V&&e[n+1].startsWith("/>")?" ":"";a+=i===P?t+C:c>=0?(s.push(r),t.slice(0,c)+S+t.slice(c)+M+d):t+M+(-2===c?n:d)}return[W(e,a+(e[r]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class Y{constructor({strings:e,_$litType$:t},r){let s;this.parts=[];let o=0,a=0;const i=e.length-1,n=this.parts,[l,c]=X(e,t);if(this.el=Y.createElement(l,r),J.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=J.nextNode())&&n.length<i;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(S)){const t=c[a++],r=s.getAttribute(e).split(M),i=/([.?@])?(.*)/.exec(t);n.push({type:1,index:o,name:i[2],strings:r,ctor:"."===i[1]?te:"?"===i[1]?re:"@"===i[1]?se:ee}),s.removeAttribute(e)}else e.startsWith(M)&&(n.push({type:6,index:o}),s.removeAttribute(e));if(L.test(s.tagName)){const e=s.textContent.split(M),t=e.length-1;if(t>0){s.textContent=$?$.emptyScript:"";for(let r=0;r<t;r++)s.append(e[r],E()),J.nextNode(),n.push({type:2,index:++o});s.append(e[t],E())}}}else if(8===s.nodeType)if(s.data===A)n.push({type:2,index:o});else{let e=-1;for(;-1!==(e=s.data.indexOf(M,e+1));)n.push({type:7,index:o}),e+=M.length-1}o++}}static createElement(e,t){const r=N.createElement("template");return r.innerHTML=e,r}}function K(e,t,r=e,s){if(t===U)return t;let o=void 0!==s?r._$Co?.[s]:r._$Cl;const a=T(t)?void 0:t._$litDirective$;return o?.constructor!==a&&(o?._$AO?.(!1),void 0===a?o=void 0:(o=new a(e),o._$AT(e,r,s)),void 0!==s?(r._$Co??=[])[s]=o:r._$Cl=o),void 0!==o&&(t=K(e,o._$AS(e,t.values),o,s)),t}class Z{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,s=(e?.creationScope??N).importNode(t,!0);J.currentNode=s;let o=J.nextNode(),a=0,i=0,n=r[0];for(;void 0!==n;){if(a===n.index){let t;2===n.type?t=new Q(o,o.nextSibling,this,e):1===n.type?t=new n.ctor(o,n.name,n.strings,this,e):6===n.type&&(t=new oe(o,this,e)),this._$AV.push(t),n=r[++i]}a!==n?.index&&(o=J.nextNode(),a++)}return J.currentNode=N,s}p(e){let t=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}let Q=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=K(this,e,t),T(e)?e===q||null==e||""===e?(this._$AH!==q&&this._$AR(),this._$AH=q):e!==this._$AH&&e!==U&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>z(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==q&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(N.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:r}=e,s="number"==typeof r?this._$AC(e):(void 0===r.el&&(r.el=Y.createElement(W(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new Z(s,this),r=e.u(this.options);e.p(t),this.T(r),this._$AH=e}}_$AC(e){let t=B.get(e.strings);return void 0===t&&B.set(e.strings,t=new Y(e)),t}k(t){z(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let s,o=0;for(const a of t)o===r.length?r.push(s=new e(this.O(E()),this.O(E()),this,this.options)):s=r[o],s._$AI(a),o++;o<r.length&&(this._$AR(s&&s._$AB.nextSibling,o),r.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}};class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,s,o){this.type=1,this._$AH=q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=q}_$AI(e,t=this,r,s){const o=this.strings;let a=!1;if(void 0===o)e=K(this,e,t,0),a=!T(e)||e!==this._$AH&&e!==U,a&&(this._$AH=e);else{const s=e;let i,n;for(e=o[0],i=0;i<o.length-1;i++)n=K(this,s[r+i],t,i),n===U&&(n=this._$AH[i]),a||=!T(n)||n!==this._$AH[i],n===q?e=q:e!==q&&(e+=(n??"")+o[i+1]),this._$AH[i]=n}a&&!s&&this.j(e)}j(e){e===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===q?void 0:e}}class re extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==q)}}class se extends ee{constructor(e,t,r,s,o){super(e,t,r,s,o),this.type=5}_$AI(e,t=this){if((e=K(this,e,t,0)??q)===U)return;const r=this._$AH,s=e===q&&r!==q||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==q&&(r===q||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){K(this,e)}}const ae=w.litHtmlPolyfillSupport;ae?.(Y,Q),(w.litHtmlVersions??=[]).push("3.3.2");const ie=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ne=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,r)=>{const s=r?.renderBefore??t;let o=s._$litPart$;if(void 0===o){const e=r?.renderBefore??null;s._$litPart$=o=new Q(t.insertBefore(E(),e),e,void 0,r??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return U}};ne._$litElement$=!0,ne.finalized=!0,ie.litElementHydrateSupport?.({LitElement:ne});const le=ie.litElementPolyfillSupport;le?.({LitElement:ne}),(ie.litElementVersions??=[]).push("4.2.2");
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
 */const de="important",ue=" !"+de,me=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends he{constructor(e){if(super(e),e.type!==ce||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce(((t,r)=>{const s=e[r];return null==s?t:t+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`}),"")}update(e,[t]){const{style:r}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const s of this.ft)null==t[s]&&(this.ft.delete(s),s.includes("-")?r.removeProperty(s):r[s]=null);for(const s in t){const e=t[s];if(null!=e){this.ft.add(s);const t="string"==typeof e&&e.endsWith(ue);s.includes("-")||t?r.setProperty(s,t?e.slice(0,-11):e,t?de:""):r[s]=e}}return U}});function pe(e,t,r){if(r||2===arguments.length)for(var s,o=0,a=t.length;o<a;o++)!s&&o in t||(s||(s=Array.prototype.slice.call(t,0,o)),s[o]=t[o]);return e.concat(s||Array.prototype.slice.call(t))}"function"==typeof SuppressedError&&SuppressedError;var ge,fe={};
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */var be=function(){if(ge)return fe;ge=1;var e=/; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g,t=/^[\u000b\u0020-\u007e\u0080-\u00ff]+$/,r=/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/,s=/\\([\u000b\u0020-\u00ff])/g,o=/([\\"])/g,a=/^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;function i(e){var s=String(e);if(r.test(s))return s;if(s.length>0&&!t.test(s))throw new TypeError("invalid parameter value");return'"'+s.replace(o,"\\$1")+'"'}function n(e){this.parameters=Object.create(null),this.type=e}return fe.format=function(e){if(!e||"object"!=typeof e)throw new TypeError("argument obj is required");var t=e.parameters,s=e.type;if(!s||!a.test(s))throw new TypeError("invalid type");var o=s;if(t&&"object"==typeof t)for(var n,l=Object.keys(t).sort(),c=0;c<l.length;c++){if(n=l[c],!r.test(n))throw new TypeError("invalid parameter name");o+="; "+n+"="+i(t[n])}return o},fe.parse=function(t){if(!t)throw new TypeError("argument string is required");var r="object"==typeof t?function(e){var t;"function"==typeof e.getHeader?t=e.getHeader("content-type"):"object"==typeof e.headers&&(t=e.headers&&e.headers["content-type"]);if("string"!=typeof t)throw new TypeError("content-type header is missing from object");return t}(t):t;if("string"!=typeof r)throw new TypeError("argument string is required to be a string");var o=r.indexOf(";"),i=-1!==o?r.slice(0,o).trim():r.trim();if(!a.test(i))throw new TypeError("invalid media type");var l=new n(i.toLowerCase());if(-1!==o){var c,h,d;for(e.lastIndex=o;h=e.exec(r);){if(h.index!==o)throw new TypeError("invalid parameter format");o+=h[0].length,c=h[1].toLowerCase(),34===(d=h[2]).charCodeAt(0)&&-1!==(d=d.slice(1,-1)).indexOf("\\")&&(d=d.replace(s,"$1")),l.parameters[c]=d}if(o!==r.length)throw new TypeError("invalid parameter format")}return l},fe}(),ye=new Map,ve=function(e){return e.cloneNode(!0)},_e=function(){return"file:"===window.location.protocol},xe=function(e,t,r){var s=new XMLHttpRequest;s.onreadystatechange=function(){try{if(!/\.svg/i.test(e)&&2===s.readyState){var t=s.getResponseHeader("Content-Type");if(!t)throw new Error("Content type not found");var o=be.parse(t).type;if("image/svg+xml"!==o&&"text/plain"!==o)throw new Error("Invalid content type: ".concat(o))}if(4===s.readyState){if(404===s.status||null===s.responseXML)throw new Error(_e()?"Note: SVG injection ajax calls do not work locally without adjusting security settings in your browser. Or consider using a local webserver.":"Unable to load SVG file: "+e);if(!(200===s.status||_e()&&0===s.status))throw new Error("There was a problem injecting the SVG: "+s.status+" "+s.statusText);r(null,s)}}catch(a){if(s.abort(),!(a instanceof Error))throw a;r(a,s)}},s.open("GET",e),s.withCredentials=t,s.overrideMimeType&&s.overrideMimeType("image/svg+xml"),s.send()},we={},$e=function(e,t){var r;null!==(r=we[e])&&void 0!==r||(we[e]=[]),we[e].push(t)},ke=function(e,t,r){if(ye.has(e)){var s=ye.get(e);if(void 0===s)return void $e(e,r);if(s instanceof SVGSVGElement)return void r(null,ve(s))}ye.set(e,void 0),$e(e,r),xe(e,t,(function(t,r){var s;t?ye.set(e,t):(null===(s=r.responseXML)||void 0===s?void 0:s.documentElement)instanceof SVGSVGElement&&ye.set(e,r.responseXML.documentElement),function(e){var t=we[e];if(t)for(var r=function(r,s){setTimeout((function(){if(Array.isArray(we[e])){var s=ye.get(e),o=t[r];if(!o)return;s instanceof SVGSVGElement&&o(null,ve(s)),s instanceof Error&&o(s),r===t.length-1&&delete we[e]}}),0)},s=0,o=t.length;s<o;s++)r(s)}(e)}))},Se=function(e,t,r){xe(e,t,(function(e,t){var s;e?r(e):(null===(s=t.responseXML)||void 0===s?void 0:s.documentElement)instanceof SVGSVGElement&&r(null,t.responseXML.documentElement)}))},Me="data:image/svg+xml",Ae=0,Ce=[],Ne={},Ee="http://www.w3.org/1999/xlink",Te=function(e,t,r,s,o,a,i){var n,l=null!==(n=e.getAttribute("data-src"))&&void 0!==n?n:e.getAttribute("src");if(l){if(-1!==Ce.indexOf(e))return Ce.splice(Ce.indexOf(e),1),void(e=null);Ce.push(e),e.setAttribute("src","");var c=l.indexOf("#"),h=-1!==c?l.slice(0,c):l,d=-1!==c?l.slice(c+1):null,u=function(e){if(!e.startsWith(Me))return null;var t,r=e.slice(18);if(r.startsWith(";base64,"))try{t=atob(r.slice(8))}catch(n){return new Error("Invalid base64 in data URL")}else if(r.startsWith(","))try{t=decodeURIComponent(r.slice(1))}catch(a){return new Error("Invalid encoding in data URL")}else{if(!r.startsWith(";charset=utf-8,"))return new Error("Unsupported data URL format");try{t=decodeURIComponent(r.slice(15))}catch(i){return new Error("Invalid encoding in data URL")}}var s=(new DOMParser).parseFromString(t,"image/svg+xml"),o=s.querySelector("parsererror");return o?new Error("Data URL SVG parse error: "+o.textContent.trim()):s.documentElement instanceof SVGSVGElement?s.documentElement:new Error("Data URL did not contain a valid SVG element")}(h);if(u instanceof Error)return Ce.splice(Ce.indexOf(e),1),e=null,void i(u);var m=function(s,o){var n,c;if(!o)return Ce.splice(Ce.indexOf(e),1),e=null,void i(s);var u=o;if(d){var m=function(e,t){var r=e.querySelector("#"+CSS.escape(t));if("symbol"!==(null==r?void 0:r.tagName.toLowerCase()))return null;for(var s=document.createElementNS("http://www.w3.org/2000/svg","svg"),o=r.attributes,a=0,i=o.length;a<i;a++){var n=o[a];"id"!==n.name&&s.setAttribute(n.name,n.value)}var l=r.childNodes;for(a=0,i=l.length;a<i;a++)s.appendChild(l[a].cloneNode(!0));return s}(o,d);if(!m)return Ce.splice(Ce.indexOf(e),1),e=null,void i(new Error('Symbol "'.concat(d,'" not found in ').concat(h)));u=m}var p=e.getAttribute("id");p&&u.setAttribute("id",p);var g=e.getAttribute("title");g&&u.setAttribute("title",g);var f=e.getAttribute("width");f&&u.setAttribute("width",f);var b=e.getAttribute("height");b&&u.setAttribute("height",b);var y=Array.from(new Set(pe(pe(pe([],(null!==(n=u.getAttribute("class"))&&void 0!==n?n:"").split(" "),!0),["injected-svg"],!1),(null!==(c=e.getAttribute("class"))&&void 0!==c?c:"").split(" "),!0))).join(" ").trim();u.setAttribute("class",y);var v=e.getAttribute("style");v&&u.setAttribute("style",v),u.setAttribute("data-src",l);var _=[].filter.call(e.attributes,(function(e){return/^data-\w[\w-]*$/.test(e.name)}));if(Array.prototype.forEach.call(_,(function(e){e.name&&e.value&&u.setAttribute(e.name,e.value)})),r){var x,w,$,k,S,M={clipPath:["clip-path"],"color-profile":["color-profile"],cursor:["cursor"],filter:["filter"],linearGradient:["fill","stroke"],marker:["marker","marker-start","marker-mid","marker-end"],mask:["mask"],path:[],pattern:["fill","stroke"],radialGradient:["fill","stroke"]},A=function(e,t){return e.replace(/url\((['"]?)\s*#([^\s'"\)]+)\s*\1\)/g,(function(e,r,s){var o=t[s];return o?"url(#".concat(o,")"):e}))},C=function(e,t){if(!e.startsWith("#"))return e;var r=t[e.slice(1)];return r?"#"+r:e},N=[],E={};Object.keys(M).forEach((function(e){x=e;for(var t=0,r=(w=u.querySelectorAll(x+"[id]")).length;t<r;t++){var s=w[t];k=s.id,S=k+"-"+ ++Ae,E[k]=S,N.push({element:s,currentId:k,newId:S})}})),Object.keys(M).forEach((function(e){var t;$=M[e],Array.prototype.forEach.call($,(function(e){for(var r=0,s=(t=u.querySelectorAll("["+e+"]")).length;r<s;r++){var o=t[r],a=o.getAttribute(e);if(a){var i=A(a,E);i!==a&&o.setAttribute(e,i)}}}))}));for(var T=u.querySelectorAll("*"),z=0,I=T.length;z<I;z++){var P=T[z],O=P.getAttribute("href");if(O){var j=C(O,E);j!==O&&P.setAttribute("href",j)}var V=P.getAttributeNS(Ee,"href");if(V){var D=C(V,E);D!==V&&P.setAttributeNS(Ee,"href",D)}}for(var R=u.querySelectorAll("[style]"),L=0,H=R.length;L<H;L++){var G=R[L],F=G.getAttribute("style");if(F){var U=A(F,E);U!==F&&G.setAttribute("style",U)}}for(var q=u.querySelectorAll("style"),B=0,J=q.length;B<J;B++){var W=q[B],X=W.textContent;if(X){var Y=A(X,E);Y!==X&&(W.textContent=Y)}}for(var K=0,Z=N.length;K<Z;K++)N[K].element.id=N[K].newId}u.removeAttribute("xmlns:a");for(var Q,ee,te=u.querySelectorAll("script"),re=[],se=0,oe=te.length;se<oe;se++){var ae=te[se];(ee=ae.getAttribute("type"))&&"application/ecmascript"!==ee&&"application/javascript"!==ee&&"text/javascript"!==ee||((Q=ae.innerText||ae.textContent)&&re.push(Q),u.removeChild(ae))}if(re.length>0&&("always"===t||"once"===t&&!Ne[l])){for(var ie=0,ne=re.length;ie<ne;ie++)new Function(re[ie])(window);Ne[l]=!0}var le=u.querySelectorAll("style");if(Array.prototype.forEach.call(le,(function(e){e.textContent+=""})),u.setAttribute("xmlns","http://www.w3.org/2000/svg"),u.setAttribute("xmlns:xlink",Ee),a(u),!e.parentNode)return Ce.splice(Ce.indexOf(e),1),e=null,void i(new Error("Parent node is null"));e.parentNode.replaceChild(u,e),Ce.splice(Ce.indexOf(e),1),e=null,i(null,u)};if(u)setTimeout((function(){m(null,u)}),0);else(s?ke:Se)(h,o,m)}else i(new Error("Invalid data-src or src attribute"))};class ze{static toStyleDict(e){return ze.toDict(e,{stringToDict:ze.cssStringToDict,mapValue:ze.toStyleValue})}static toClassDict(e){return ze.toDict(e,{stringToDict:ze.classStringToDict,mapValue:Boolean})}static toIconDict(e){return ze.toDict(e,{stringToDict:ze.stringToDefaultDict("default"),mapValue:String})}static toDict(e,t={}){const{stringToDict:r=ze.stringToDefaultDict("default"),mapValue:s=(e=>e),skipNull:o=!0,skipFalse:a=!0}=t,i=e=>null==e&&o||!1===e&&a?{}:Array.isArray(e)?e.reduce(((e,t)=>({...e,...i(t)})),{}):ze.isPlainObject(e)?Object.fromEntries(Object.entries(e).filter((([,e])=>(null!=e||!o)&&(!1!==e||!a))).map((([e,t])=>[e,s(t,e)]))):"string"==typeof e?r(e):{};return i(e)}static toStyleValue(e){return null==e?e:String(e).trim().replace(/;+$/,"")}static cssStringToDict(e){return String(e).split(";").map((e=>e.trim())).filter(Boolean).reduce(((e,t)=>{const r=t.indexOf(":");if(r<=0)return e;const s=t.slice(0,r).trim(),o=t.slice(r+1).trim();return s&&o?{...e,[s]:o}:e}),{})}static toColorStopDict(e){return ze.toDict(e,{stringToDict:ze.keyValueStringToDict,mapValue:String})}static keyValueStringToDict(e){const t=String(e).trim(),r=t.indexOf(":");if(r<=0)return{};const s=t.slice(0,r).trim(),o=t.slice(r+1).trim();return s&&o?{[s]:o}:{}}static classStringToDict(e){return String(e).trim().split(/\s+/).filter(Boolean).reduce(((e,t)=>({...e,[t]:!0})),{})}static stringToDefaultDict(e="default"){return t=>({[e]:String(t)})}static requireArray(e,t="value"){if(null==e)return[];if(!Array.isArray(e))throw new Error(`[config-helper] "${t}" must be an array.`);return e}static ensureArray(e){return null==e?[]:Array.isArray(e)?e:[e]}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}}class Ie{static context={};static setContext(e={}){Ie.context=e}static getJsTemplateOrValue(e,t,r={}){return Ie._getJsTemplateOrValue(e,t,r,0)}static _getJsTemplateOrValue(e,t,r={},s=0){const{resolveKeys:o=!0,maxDepth:a=10}=r;if(s>=a)return t;if(null==t)return t;if(["number","boolean","bigint","symbol"].includes(typeof t))return t;if(Array.isArray(t))return t.map((t=>Ie._getJsTemplateOrValue(e,t,r,s)));if(Ie.isPlainObject(t))return Object.fromEntries(Object.entries(t).map((([t,a])=>{const i=o?Ie._getJsTemplateOrValue(e,t,r,s):t,n=Ie._getJsTemplateOrValue(e,a,r,s);return[String(i),n]})));if("string"!=typeof t)return t;const i=t.trim();if(!Ie.isJsTemplate(i))return t;const n=Ie.evaluateJsTemplate(e,Ie.extractJsTemplateCode(i));return Ie._getJsTemplateOrValue(e,n,r,s+1)}static isJsTemplate(e){return"string"==typeof e&&e.trim().startsWith("[[[")&&e.trim().endsWith("]]]")}static extractJsTemplateCode(e){return String(e).trim().slice(3,-3).trim()}static evaluateJsTemplate(e,t){const{hass:r,config:s,entities:o=[]}=Ie.context,a=Ie._getItemEntityIndex(e),i=Ie._getTemplateState(e),n=o?.[a],l=r?.states,c=s?.variables??{},h=r?.user;s?.dev?.debug&&console.log("Evaluating JavaScript template with context:",{hass:r,config:s,entity:n,entities:o,states:l,state:i,variables:c,item:e,user:h});try{return new Function("hass","config","entity","entities","states","state","variables","item","user",`\n          "use strict";\n          ${t}\n        `)(r,s,n,o,l,i,c,e,h)}catch(d){return void(s?.dev?.debug&&console.error("[templates] JavaScript template error:",{error:d,item:e,javascript:t}))}}static _getTemplateState(e={}){const t=Ie._getItemEntityIndex(e),r=Ie.context.entities?.[t],s=Ie.context.config?.entities?.[t]||{};if(!r)return;const o=s.attribute;return o&&r.attributes&&void 0!==r.attributes[o]?r.attributes[o]:r.state}static _getItemEntityIndex(e={}){const t=Number(e.entity_index);return Number.isFinite(t)?t:0}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}}class Pe{static normalize(e){return e?Array.isArray(e)?{scales:{},colors:Pe.normalizeColors(e)}:!Pe.isPlainObject(e)||e.colors||e.scales?Pe.isPlainObject(e)?{...e,scales:Pe.normalizeScales(e.scales),colors:Pe.normalizeColors(e.colors)}:{scales:{},colors:[]}:{scales:{},colors:Pe.normalizeColors(e)}:{scales:{},colors:[]}}static normalizeScales(e){return Pe.isPlainObject(e)?Object.fromEntries(Object.entries(e).map((([e,t])=>[e,Pe.isPlainObject(t)?{...t}:t]))):{}}static normalizeColors(e){return e?Array.isArray(e)?e.flatMap((e=>Pe.normalizeColorArrayEntry(e))).filter(Boolean).sort(((e,t)=>e.value-t.value)):Pe.isPlainObject(e)?Object.entries(e).map((([e,t])=>Pe.normalizeColorPair(e,t))).filter(Boolean).sort(((e,t)=>e.value-t.value)):[]:[]}static normalizeColorArrayEntry(e){if(Pe.isPlainObject(e)&&Object.prototype.hasOwnProperty.call(e,"value")&&Object.prototype.hasOwnProperty.call(e,"color")){const t=Pe.normalizeColorEntry(e);return t?[t]:[]}return Pe.isPlainObject(e)?Object.entries(e).map((([e,t])=>Pe.normalizeColorPair(e,t))).filter(Boolean):[]}static normalizeColorPair(e,t){const r=Number(e);return Number.isFinite(r)?null==t?null:{value:r,color:String(t)}:null}static normalizeColorEntry(e){if(!Pe.isPlainObject(e))return null;const t=Number(e.value);return Number.isFinite(t)?void 0===e.color||null===e.color?null:{...e,value:t,color:String(e.color)}:null}static ensureMinimumStops(e,t){return e?.colors&&1===e.colors.length?{...e,colors:[e.colors[0],{value:t,color:e.colors[0].color}]}:e}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}static _testColorStopsNormalizer(){const e={entity_index:0},t=[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}];[{name:"FHC dict",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC dict with quoted keys",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC list of dicts",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC list of dicts with quoted keys",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC dict with template values",raw:{0:"[[[\n          return 'red';\n        ]]]",10:"[[[\n          return 'green';\n        ]]]",20:"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template values",raw:[{0:"[[[\n            return 'red';\n          ]]]"},{10:"[[[\n            return 'green';\n          ]]]"},{20:"[[[\n            return 'blue';\n          ]]]"}]},{name:"FHC dict with template keys",raw:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}},{name:"FHC dict with template keys and values",raw:{"[[[ return 0; ]]]":"[[[\n          return 'red';\n        ]]]","[[[ return 10; ]]]":"[[[\n          return 'green';\n        ]]]","[[[ return 20; ]]]":"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template keys and values",raw:[{"[[[ return 0; ]]]":"[[[\n            return 'red';\n          ]]]"},{"[[[ return 10; ]]]":"[[[\n            return 'green';\n          ]]]"},{"[[[ return 20; ]]]":"[[[\n            return 'blue';\n          ]]]"}]},{name:"Whole FHC color_stops as template returning dict",raw:"[[[\n        return {\n          0: 'red',\n          10: 'green',\n          20: 'blue',\n        };\n      ]]]"},{name:"Whole FHC color_stops as template returning list",raw:"[[[\n        return [\n          { 0: 'red' },\n          { 10: 'green' },\n          { 20: 'blue' },\n        ];\n      ]]]"},{name:"SAK v1 colorstops.colors dict",raw:{colors:{0:"red",10:"green",20:"blue"}}},{name:"SAK v1 colorstops.colors dict with template keys",raw:{colors:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}}},{name:"SAK v1 colorstops.colors dict with template values",raw:{colors:{0:"[[[\n            return 'red';\n          ]]]",10:"[[[\n            return 'green';\n          ]]]",20:"[[[\n            return 'blue';\n          ]]]"}}},{name:"SAK v2 colors list",raw:{scales:{default:{min:0,max:20}},colors:[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}]}},{name:"SAK v2 colors list unsorted",raw:{scales:{default:{min:0,max:20}},colors:[{value:20,color:"blue",rank:2},{value:0,color:"red",rank:1},{value:10,color:"green",rank:1}]}},{name:"SAK v2 colors list with template values",raw:{scales:{default:{min:"[[[\n              return 0;\n            ]]]",max:"[[[\n              return 20;\n            ]]]"}},colors:[{value:"[[[\n              return 0;\n            ]]]",color:"[[[\n              return 'red';\n            ]]]"},{value:"[[[\n              return 10;\n            ]]]",color:"[[[\n              return 'green';\n            ]]]"},{value:"[[[\n              return 20;\n            ]]]",color:"[[[\n              return 'blue';\n            ]]]"}]}},{name:"SAK v2 whole colors list as template",raw:{scales:{default:{min:0,max:20}},colors:"[[[\n          return [\n            { value: 0, color: 'red' },\n            { value: 10, color: 'green' },\n            { value: 20, color: 'blue' },\n          ];\n        ]]]"}}].forEach((r=>{const s=Ie.getJsTemplateOrValue(e,r.raw,{resolveKeys:!0}),o=Pe.normalize(s),a=o.colors.map((e=>({value:e.value,color:e.color}))),i=JSON.stringify(a)===JSON.stringify(t);console.log(`[colorstops test] ${i?"PASS":"FAIL"} - ${r.name}`,{raw:r.raw,resolved:s,normalized:o,simpleColors:a,expectedColors:t})}))}}const Oe="mdi:bookmark",je={air_quality:"mdi:air-filter",alert:"mdi:alert",calendar:"mdi:calendar",climate:"mdi:thermostat",configurator:"mdi:cog",conversation:"mdi:microphone-message",counter:"mdi:counter",datetime:"mdi:calendar-clock",date:"mdi:calendar",demo:"mdi:home-assistant",google_assistant:"mdi:google-assistant",group:"mdi:google-circles-communities",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_button:"mdi:gesture-tap-button",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",number:"mdi:ray-vertex",persistent_notification:"mdi:bell",plant:"mdi:Flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:palette",schedule:"mdi:calendar-clock",script:"mdi:script-text",select:"mdi:format-list-bulleted",sensor:"mdi:eye",simple_alarm:"mdi:bell",siren:"mdi:bullhorn",stt:"mdi:microphone-message",text:"mdi:form-textbox",time:"mdi:clock",timer:"mdi:timer-outline",tts:"mdi:speaker-message",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",zone:"mdi:map-marker-radius"},Ve={apparent_power:"mdi:flash",aqi:"mdi:air-filter",atmospheric_pressure:"mdi:thermometer-lines",carbon_dioxide:"mdi:molecule-co2",carbon_monoxide:"mdi:molecule-co",current:"mdi:current-ac",data_rate:"mdi:transmission-tower",data_size:"mdi:database",date:"mdi:calendar",distance:"mdi:arrow-left-right",duration:"mdi:progress-clock",energy:"mdi:lightning-bolt",frequency:"mdi:sine-wave",gas:"mdi:meter-gas",humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",irradiance:"mdi:sun-wireless",moisture:"mdi:water-percent",monetary:"mdi:cash",nitrogen_dioxide:"mdi:molecule",nitrogen_monoxide:"mdi:molecule",nitrous_oxide:"mdi:molecule",ozone:"mdi:molecule",pm1:"mdi:molecule",pm10:"mdi:molecule",pm25:"mdi:molecule",power:"mdi:flash",power_factor:"mdi:angle-acute",precipitation:"mdi:weather-rainy",precipitation_intensity:"mdi:weather-pouring",pressure:"mdi:gauge",reactive_power:"mdi:flash",signal_strength:"mdi:wifi",sound_pressure:"mdi:ear-hearing",speed:"mdi:speedometer",sulphur_dioxide:"mdi:molecule",temperature:"mdi:thermometer",timestamp:"mdi:clock",volatile_organic_compounds:"mdi:molecule",volatile_organic_compounds_parts:"mdi:molecule",voltage:"mdi:sine-wave",volume:"mdi:car-coolant-level",water:"mdi:water",weight:"mdi:weight",wind_speed:"mdi:weather-windy"},De=e=>e.substring(0,e.indexOf(".")),Re={10:"mdi:battery-10",20:"mdi:battery-20",30:"mdi:battery-30",40:"mdi:battery-40",50:"mdi:battery-50",60:"mdi:battery-60",70:"mdi:battery-70",80:"mdi:battery-80",90:"mdi:battery-90",100:"mdi:battery"},Le=(e,t)=>{const r=Number(e);if(isNaN(r))return"off"===e?"mdi:battery":"on"===e?"mdi:battery-alert":"mdi:battery-unknown";const s=10*Math.round(r/10);return r<=5?"mdi:battery-alert-variant-outline":Re[s]},He=e=>{const t=e?.attributes.device_class;if(t&&t in Ve)return Ve[t];if("battery"===t)return e?((e,t)=>{const r=e.state;return Le(r)})(e):"mdi:battery";const r=e?.attributes.unit_of_measurement;return"°C"===r||"°F"===r?"mdi-thermometer":void 0},Ge=(e,t,r)=>{const s=t?.state;switch(e){case"alarm_control_panel":return(e=>{switch(e){case"armed_away":return"mdi:shield-lock";case"armed_vacation":return"mdi:shield-airplane";case"armed_home":return"mdi:shield-home";case"armed_night":return"mdi:shield-moon";case"armed_custom_bypass":return"mdi:security";case"pending":return"mdi:shield-outline";case"triggered":return"mdi:bell-ring";case"disarmed":return"mdi:shield-off";default:return"mdi:shield"}})(s);case"automation":return"off"===s?"mdi:robot-off":"mdi:robot";case"binary_sensor":return((e,t)=>{const r="off"===e;switch(t?.attributes.device_class){case"battery":return r?"mdi:battery":"mdi:battery-outline";case"battery_charging":return r?"mdi:battery":"mdi:battery-charging";case"carbon_monoxide":return r?"mdi:smoke-detector":"mdi:smoke-detector-alert";case"cold":return r?"mdi:thermometer":"mdi:Snowflake";case"connectivity":return r?"mdi:close-network-outline":"mdi:check-network-outline";case"door":return r?"mdi:door-closed":"mdi:door-open";case"garage_door":return r?"mdi:garage":"mdi:garage-open";case"power":case"plug":return r?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return r?"mdi:check-circle":"mdi:alert-circle";case"smoke":return r?"mdi:smoke-detector-variant":"mdi:smoke-detector-variant-alert";case"heat":return r?"mdi:thermometer":"mdi:fire";case"light":return r?"mdi:brightness-5":"mdi:brightness-7";case"lock":return r?"mdi:lock":"mdi:lock-open";case"moisture":return r?"mdi:water-off":"mdi:water";case"motion":return r?"mdi:motion-sensor-off":"mdi:motion-sensor";case"occupancy":return r?"mdi:home-outline":"mdi:Home";case"opening":return r?"mdi:square":"mdi:square-outline";case"presence":return r?"mdi:home-outline":"mdi:home";case"running":return r?"mdi:stop":"mdi:play";case"sound":return r?"mdi:music-note-off":"mdi:music-note";case"update":return r?"mdi:package":"mdi:package-up";case"vibration":return r?"mdi:crop-portrait":"mdi:vibrate";case"window":return r?"mdi:window-closed":"mdi:window-open";default:return r?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}})(s,t);case"button":switch(t?.attributes.device_class){case"restart":return"mdi:restart";case"update":return"mdi:package-up";default:return"mdi:gesture-tap-button"}case"camera":return"off"===s?"mdi:video-off":"mdi:video";case"cover":return((e,t)=>{const r="closed"!==e;switch(t?.attributes.device_class){case"garage":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdigarage";default:return"mdi:Garage-open"}case"gate":switch(e){case"opening":case"closing":return"mdi:gate-arrow-right";case"closed":return"mdi:gate";default:return"mdi:gate-open"}case"door":return r?"mdi:door-open":"mdi:door-closed";case"damper":return r?"mdi:circle":"mdi:circle-slice-8";case"shutter":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window-shutter";default:return"mdi:window-shutter-open"}case"curtain":switch(e){case"opening":return"mdi:arrow-split-vertical";case"closing":return"mdi:arrow-collapse-horizontal";case"closed":return"mdi:curtains-closed";default:return"mdi:curtains"}case"blind":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:blinds-horizontal-closed";default:return"mdi:blinds-horizontal"}case"shade":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:roller-shade-closed";default:return"mdi:roller-shade"}case"window":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}}switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}})(s,t);case"device_tracker":return"router"===t?.attributes.source_type?"home"===s?"mdi:lan-connect":"mdi:lan-cisconnect":["bluetooth","bluetooth_le"].includes(t?.attributes.source_type)?"home"===s?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===s?"mdi:account-arrow-right":"mdi:account";case"fan":return"off"===s?"mdi:fan-off":"mdi:fan";case"humidifier":return"off"===s?"mdi:air-humidifier-off":"mdi:air-humidifier";case"input_boolean":return"on"===s?"mdi:check-circle-outline":"mdi:close-circle-outline";case"input_datetime":if(!t?.attributes.has_date)return"mdi:clock";if(!t.attributes.has_time)return"mdi:calendar";break;case"lock":switch(s){case"unlocked":return"mdi:lock-open";case"jammed":return"mdi:lock-alert";case"locking":case"unlocking":return"mdi:lock-clock";default:return"mdi:lock"}case"media_player":switch(t?.attributes.device_class){case"speaker":switch(s){case"playing":return"mdi:speaker-play";case"paused":return"mdi:speaker-pause";case"off":return"mdi:speaker-off";default:return"mdi:speaker"}case"tv":switch(s){case"playing":return"mdi:television-play";case"paused":return"mdi:television-pause";case"off":return"mdi:television-off";default:return"mdi:television"}case"receiver":return"off"===s?"mdi:audio-video-off":"mdi:audio-video";default:switch(s){case"playing":case"paused":return"mdi:cast-connected";case"off":return"mdi:cast-off";default:return"mdi:cast"}}case"number":{const e=(e=>{const t=e?.attributes.device_class;if(t&&t in Ve)return Ve[t]})(t);if(e)return e;break}case"person":return"not_home"===s?"mdi:account-arrow-right":"mdi:account";case"switch":switch(t?.attributes.device_class){case"outlet":return"on"===s?"mdi:power-plug":"mdi:power-plug-off";case"switch":return"on"===s?"mdi:toggle-switch-variant":"mdi:toggle-switch-variant-off";default:return"mdi:toggle-switch-variant"}case"sensor":{const e=He(t);if(e)return e;break}case"sun":return"above_horizon"===t?.state?"mdi:white-balance-sunny":"mdi:weather-night";case"switch_as_x":return"mdi:swap-horizontal";case"threshold":return"mdi:chart-sankey";case"water_heater":return"off"===s?"mdi:water-boiler-off":"mdi:water-boiler"}if(e in je)return je[e]},Fe=e=>{return e?(t=De(e.entity_id),Ge(t,e)||(console.warn(`Unable to find icon for domain ${t}`),Oe)):Oe;var t};var Ue,qe,Be,Je,We;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.quote_decimal="quote_decimal",e.space_comma="space_comma",e.none="none"}(Ue||(Ue={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(qe||(qe={})),function(e){e.local="local",e.server="server"}(Be||(Be={})),function(e){e.language="language",e.system="system",e.DMY="DMY",e.MDY="MDY",e.YMD="YMD"}(Je||(Je={})),function(e){e.language="language",e.monday="monday",e.tuesday="tuesday",e.wednesday="wednesday",e.thursday="thursday",e.friday="friday",e.saturday="saturday",e.sunday="sunday"}(We||(We={})),Intl.DateTimeFormat?.().resolvedOptions?.().timeZone;const Xe="unavailable",Ye=(Ke=[Xe,"unknown"],(e,t)=>Ke.includes(e,t));var Ke;const Ze=(e,t)=>e&&e.components.includes(t),Qe=e=>De(e.entity_id),et={entity:{},entity_component:{}},tt=async(e,t,r)=>((e,t)=>e.sendMessagePromise(t))(e,{type:"frontend/get_icons",category:t,integration:r}),rt=async(e,t,r,s=!1)=>{if(!s&&r in et.entity)return et.entity[r];if(!Ze(e,r)||!((e,t,r,s)=>{const[o,a,i]=e.split(".",3);return Number(o)>t||Number(o)===t&&(void 0===s?Number(a)>=r:Number(a)>r)||void 0!==s&&Number(o)===t&&Number(a)===r&&Number(i)>=s})(t.haVersion,2024,2))return;const o=tt(t,"entity",r).then((e=>e?.resources[r]));return et.entity[r]=o,et.entity[r]},st=async(e,t,r,s=!1)=>!s&&et.entity_component.resources&&et.entity_component.domains?.includes(r)?et.entity_component.resources.then((e=>e[r])):Ze(t,r)?(et.entity_component.domains=[...t.components],et.entity_component.resources=tt(e,"entity_component").then((e=>e.resources)),et.entity_component.resources.then((e=>e[r]))):void 0,ot=new WeakMap,at=(e,t)=>{if(t)return e&&t.state?.[e]?t.state[e]:void 0!==e&&t.range&&!isNaN(Number(e))?((e,t)=>{let r=ot.get(t);if(r||(r=Object.keys(t).map(Number).filter((e=>!isNaN(e))).sort(((e,t)=>e-t)),ot.set(t,r)),0===r.length)return;if(e<r[0])return;let s=r[0];for(const o of r){if(!(e>=o))break;s=o}return t[s.toString()]})(Number(e),t.range)??t.default:t.default},it=async(e,t,r,s,o,a)=>{const i=a?.platform,n=a?.translation_key,l=s?.attributes.device_class,c=s?.state;let h;if(n&&i){const s=await rt(e,t,i);if(s){const e=s[r]?.[n];h=at(c,e)}}if(!h&&s&&(h=((e,t)=>{const r=Qe(e),s=t??e.state;switch(r){case"device_tracker":return((e,t)=>{const r=t??e.state;return"router"===e?.attributes.source_type?"home"===r?"mdi:lan-connect":"mdi:lan-disconnect":["bluetooth","bluetooth_le"].includes(e?.attributes.source_type)?"home"===r?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===r?"mdi:account-arrow-right":"mdi:account"})(e,s);case"sun":return"above_horizon"===s?"mdi:white-balance-sunny":"mdi:weather-night";case"input_datetime":if(!e.attributes.has_date)return"mdi:clock";if(!e.attributes.has_time)return"mdi:calendar"}})(s,c)),!h){const s=await st(t,e,r);if(s){const e=l&&s[l]||s._;h=at(c,e)}}return h},nt=(e,t)=>{if("number"==typeof e)return 3===t?{mode:"rgb",r:(e>>8&15|e>>4&240)/255,g:(e>>4&15|240&e)/255,b:(15&e|e<<4&240)/255}:4===t?{mode:"rgb",r:(e>>12&15|e>>8&240)/255,g:(e>>8&15|e>>4&240)/255,b:(e>>4&15|240&e)/255,alpha:(15&e|e<<4&240)/255}:6===t?{mode:"rgb",r:(e>>16&255)/255,g:(e>>8&255)/255,b:(255&e)/255}:8===t?{mode:"rgb",r:(e>>24&255)/255,g:(e>>16&255)/255,b:(e>>8&255)/255,alpha:(255&e)/255}:void 0},lt={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ct=/^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i,ht="([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)",dt=`${ht}%`,ut=`(?:${ht}%|${ht})`,mt=`(?:${ht}(deg|grad|rad|turn)|${ht})`,pt="\\s*,\\s*",gt=new RegExp(`^rgba?\\(\\s*${ht}${pt}${ht}${pt}${ht}\\s*(?:,\\s*${ut}\\s*)?\\)$`),ft=new RegExp(`^rgba?\\(\\s*${dt}${pt}${dt}${pt}${dt}\\s*(?:,\\s*${ut}\\s*)?\\)$`),bt=(e="rgb")=>t=>void 0!==(t=((e,t)=>void 0===e?void 0:"object"!=typeof e?Dt(e):void 0!==e.mode?e:t?{...e,mode:t}:void 0)(t,e))?t.mode===e?t:yt[t.mode][e]?yt[t.mode][e](t):"rgb"===e?yt[t.mode].rgb(t):yt.rgb[e](yt[t.mode].rgb(t)):void 0,yt={},vt={},_t=[],xt={},wt=e=>e,$t=e=>(yt[e.mode]={...yt[e.mode],...e.toMode},Object.keys(e.fromMode||{}).forEach((t=>{yt[t]||(yt[t]={}),yt[t][e.mode]=e.fromMode[t]})),e.ranges||(e.ranges={}),e.difference||(e.difference={}),e.channels.forEach((t=>{if(void 0===e.ranges[t]&&(e.ranges[t]=[0,1]),!e.interpolate[t])throw new Error(`Missing interpolator for: ${t}`);"function"==typeof e.interpolate[t]&&(e.interpolate[t]={use:e.interpolate[t]}),e.interpolate[t].fixup||(e.interpolate[t].fixup=wt)})),vt[e.mode]=e,(e.parse||[]).forEach((t=>{kt(t,e.mode)})),bt(e.mode)),kt=(e,t)=>{if("string"==typeof e){if(!t)throw new Error("'mode' required when 'parser' is a string");xt[e]=t}else"function"==typeof e&&_t.indexOf(e)<0&&_t.push(e)},St=/[^\x00-\x7F]|[a-zA-Z_]/,Mt=/[^\x00-\x7F]|[-\w]/,At={Function:"function",Ident:"ident",Number:"number",Percentage:"percentage",ParenClose:")",None:"none",Hue:"hue",Alpha:"alpha"};let Ct=0;function Nt(e){let t=e[Ct],r=e[Ct+1];return"-"===t||"+"===t?/\d/.test(r)||"."===r&&/\d/.test(e[Ct+2]):/\d/.test("."===t?r:t)}function Et(e){if(Ct>=e.length)return!1;let t=e[Ct];if(St.test(t))return!0;if("-"===t){if(e.length-Ct<2)return!1;let t=e[Ct+1];return!("-"!==t&&!St.test(t))}return!1}const Tt={deg:1,rad:180/Math.PI,grad:.9,turn:360};function zt(e){let t="";if("-"!==e[Ct]&&"+"!==e[Ct]||(t+=e[Ct++]),t+=It(e),"."===e[Ct]&&/\d/.test(e[Ct+1])&&(t+=e[Ct++]+It(e)),"e"!==e[Ct]&&"E"!==e[Ct]||("-"!==e[Ct+1]&&"+"!==e[Ct+1]||!/\d/.test(e[Ct+2])?/\d/.test(e[Ct+1])&&(t+=e[Ct++]+It(e)):t+=e[Ct++]+e[Ct++]+It(e)),Et(e)){let r=Pt(e);return"deg"===r||"rad"===r||"turn"===r||"grad"===r?{type:At.Hue,value:t*Tt[r]}:void 0}return"%"===e[Ct]?(Ct++,{type:At.Percentage,value:+t}):{type:At.Number,value:+t}}function It(e){let t="";for(;/\d/.test(e[Ct]);)t+=e[Ct++];return t}function Pt(e){let t="";for(;Ct<e.length&&Mt.test(e[Ct]);)t+=e[Ct++];return t}function Ot(e){let t=Pt(e);return"("===e[Ct]?(Ct++,{type:At.Function,value:t}):"none"===t?{type:At.None,value:void 0}:{type:At.Ident,value:t}}function jt(e){e._i=0;let t=e[e._i++];if(!t||t.type!==At.Function||"color"!==t.value)return;if(t=e[e._i++],t.type!==At.Ident)return;const r=xt[t.value];if(!r)return;const s={mode:r},o=Vt(e,!1);if(!o)return;const a=(e=>vt[e])(r).channels;for(let i,n,l=0;l<a.length;l++)i=o[l],n=a[l],i.type!==At.None&&(s[n]=i.type===At.Number?i.value:i.value/100,"alpha"===n&&(s[n]=Math.max(0,Math.min(1,s[n]))));return s}function Vt(e,t){const r=[];let s;for(;e._i<e.length;)if(s=e[e._i++],s.type===At.None||s.type===At.Number||s.type===At.Alpha||s.type===At.Percentage||t&&s.type===At.Hue)r.push(s);else{if(s.type!==At.ParenClose)return;if(e._i<e.length)return}if(!(r.length<3||r.length>4)){if(4===r.length){if(r[3].type!==At.Alpha)return;r[3]=r[3].value}return 3===r.length&&r.push({type:At.None,value:void 0}),r.every((e=>e.type!==At.Alpha))?r:void 0}}const Dt=e=>{if("string"!=typeof e)return;const t=function(e=""){let t,r=e.trim(),s=[];for(Ct=0;Ct<r.length;)if(t=r[Ct++],"\n"!==t&&"\t"!==t&&" "!==t){if(","===t)return;if(")"!==t){if("+"===t){if(Ct--,Nt(r)){s.push(zt(r));continue}return}if("-"===t){if(Ct--,Nt(r)){s.push(zt(r));continue}if(Et(r)){s.push({type:At.Ident,value:Pt(r)});continue}return}if("."===t){if(Ct--,Nt(r)){s.push(zt(r));continue}return}if("/"===t){for(;Ct<r.length&&("\n"===r[Ct]||"\t"===r[Ct]||" "===r[Ct]);)Ct++;let e;if(Nt(r)&&(e=zt(r),e.type!==At.Hue)){s.push({type:At.Alpha,value:e});continue}if(Et(r)&&"none"===Pt(r)){s.push({type:At.Alpha,value:{type:At.None,value:void 0}});continue}return}if(/\d/.test(t))Ct--,s.push(zt(r));else{if(!St.test(t))return;Ct--,s.push(Ot(r))}}else s.push({type:At.ParenClose})}else for(;Ct<r.length&&("\n"===r[Ct]||"\t"===r[Ct]||" "===r[Ct]);)Ct++;return s}(e),r=t?function(e,t){e._i=0;let r=e[e._i++];if(!r||r.type!==At.Function)return;let s=Vt(e,t);return s?(s.unshift(r.value),s):void 0}(t,!0):void 0;let s,o=0,a=_t.length;for(;o<a;)if(void 0!==(s=_t[o++](e,r)))return s;return t?jt(t):void 0};const Rt=(Lt=(e,t,r)=>e+r*(t-e),e=>{let t=(e=>{let t=[];for(let r=0;r<e.length-1;r++){let s=e[r],o=e[r+1];void 0===s&&void 0===o?t.push(void 0):void 0!==s&&void 0!==o?t.push([s,o]):t.push(void 0!==s?[s,s]:[o,o])}return t})(e);return e=>{let r=e*t.length,s=e>=1?t.length-1:Math.max(Math.floor(r),0),o=t[s];return void 0===o?void 0:Lt(o[0],o[1],r-s)}});var Lt;const Ht=e=>{let t=!1,r=e.map((e=>void 0!==e?(t=!0,e):1));return t?r:e},Gt={mode:"rgb",channels:["r","g","b","alpha"],parse:[function(e,t){if(!t||"rgb"!==t[0]&&"rgba"!==t[0])return;const r={mode:"rgb"},[,s,o,a,i]=t;return s.type!==At.Hue&&o.type!==At.Hue&&a.type!==At.Hue?(s.type!==At.None&&(r.r=s.type===At.Number?s.value/255:s.value/100),o.type!==At.None&&(r.g=o.type===At.Number?o.value/255:o.value/100),a.type!==At.None&&(r.b=a.type===At.Number?a.value/255:a.value/100),i.type!==At.None&&(r.alpha=Math.min(1,Math.max(0,i.type===At.Number?i.value:i.value/100))),r):void 0},e=>{let t;return(t=e.match(ct))?nt(parseInt(t[1],16),t[1].length):void 0},e=>{let t,r={mode:"rgb"};if(t=e.match(gt))void 0!==t[1]&&(r.r=t[1]/255),void 0!==t[2]&&(r.g=t[2]/255),void 0!==t[3]&&(r.b=t[3]/255);else{if(!(t=e.match(ft)))return;void 0!==t[1]&&(r.r=t[1]/100),void 0!==t[2]&&(r.g=t[2]/100),void 0!==t[3]&&(r.b=t[3]/100)}return void 0!==t[4]?r.alpha=Math.max(0,Math.min(1,t[4]/100)):void 0!==t[5]&&(r.alpha=Math.max(0,Math.min(1,+t[5]))),r},e=>nt(lt[e.toLowerCase()],6),e=>"transparent"===e?{mode:"rgb",r:0,g:0,b:0,alpha:0}:void 0,"srgb"],serialize:"srgb",interpolate:{r:Rt,g:Rt,b:Rt,alpha:{use:Rt,fixup:Ht}},gamut:!0,white:{r:1,g:1,b:1},black:{r:0,g:0,b:0}},Ft=(e=0)=>Math.pow(Math.abs(e),563/256)*Math.sign(e),Ut=e=>{let t=Ft(e.r),r=Ft(e.g),s=Ft(e.b),o={mode:"xyz65",x:.5766690429101305*t+.1855582379065463*r+.1882286462349947*s,y:.297344975250536*t+.6273635662554661*r+.0752914584939979*s,z:.0270313613864123*t+.0706888525358272*r+.9913375368376386*s};return void 0!==e.alpha&&(o.alpha=e.alpha),o},qt=e=>Math.pow(Math.abs(e),256/563)*Math.sign(e),Bt=({x:e,y:t,z:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o={mode:"a98",r:qt(2.0415879038107465*e-.5650069742788597*t-.3447313507783297*r),g:qt(-.9692436362808798*e+1.8759675015077206*t+.0415550574071756*r),b:qt(.0134442806320312*e-.1183623922310184*t+1.0151749943912058*r)};return void 0!==s&&(o.alpha=s),o},Jt=(e=0)=>{const t=Math.abs(e);return t<=.04045?e/12.92:(Math.sign(e)||1)*Math.pow((t+.055)/1.055,2.4)},Wt=({r:e,g:t,b:r,alpha:s})=>{let o={mode:"lrgb",r:Jt(e),g:Jt(t),b:Jt(r)};return void 0!==s&&(o.alpha=s),o},Xt=e=>{let{r:t,g:r,b:s,alpha:o}=Wt(e),a={mode:"xyz65",x:.4123907992659593*t+.357584339383878*r+.1804807884018343*s,y:.2126390058715102*t+.715168678767756*r+.0721923153607337*s,z:.0193308187155918*t+.119194779794626*r+.9505321522496607*s};return void 0!==o&&(a.alpha=o),a},Yt=(e=0)=>{const t=Math.abs(e);return t>.0031308?(Math.sign(e)||1)*(1.055*Math.pow(t,1/2.4)-.055):12.92*e},Kt=({r:e,g:t,b:r,alpha:s},o="rgb")=>{let a={mode:o,r:Yt(e),g:Yt(t),b:Yt(r)};return void 0!==s&&(a.alpha=s),a},Zt=({x:e,y:t,z:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Kt({r:3.2409699419045226*e-1.537383177570094*t-.4986107602930034*r,g:-.9692436362808796*e+1.8759675015077204*t+.0415550574071756*r,b:.0556300796969936*e-.2039769588889765*t+1.0569715142428784*r});return void 0!==s&&(o.alpha=s),o},Qt={...Gt,mode:"a98",parse:["a98-rgb"],serialize:"a98-rgb",fromMode:{rgb:e=>Bt(Xt(e)),xyz65:Bt},toMode:{rgb:e=>Zt(Ut(e)),xyz65:Ut}},er=e=>(e%=360)<0?e+360:e,tr=e=>((e,t)=>e.map(((r,s,o)=>{if(void 0===r)return r;let a=er(r);return 0===s||void 0===e[s-1]?a:t(a-er(o[s-1]))})).reduce(((e,t)=>e.length&&void 0!==t&&void 0!==e[e.length-1]?(e.push(t+e[e.length-1]),e):(e.push(t),e)),[]))(e,(e=>Math.abs(e)<=180?e:e-360*Math.sign(e))),rr=[-.14861,1.78277,-.29227,-.90649,1.97294,0],sr=Math.PI/180,or=180/Math.PI;let ar=rr[3]*rr[4],ir=rr[1]*rr[4],nr=rr[1]*rr[2]-rr[0]*rr[3];const lr=(e,t)=>{if(void 0===e.h||void 0===t.h||!e.s||!t.s)return 0;let r=er(e.h),s=er(t.h),o=Math.sin((s-r+360)/2*Math.PI/180);return 2*Math.sqrt(e.s*t.s)*o},cr=(e,t)=>{if(void 0===e.h||void 0===t.h||!e.c||!t.c)return 0;let r=er(e.h),s=er(t.h),o=Math.sin((s-r+360)/2*Math.PI/180);return 2*Math.sqrt(e.c*t.c)*o},hr=e=>{let t=e.reduce(((e,t)=>{if(void 0!==t){let r=t*Math.PI/180;e.sin+=Math.sin(r),e.cos+=Math.cos(r)}return e}),{sin:0,cos:0}),r=180*Math.atan2(t.sin,t.cos)/Math.PI;return r<0?360+r:r},dr={mode:"cubehelix",channels:["h","s","l","alpha"],parse:["--cubehelix"],serialize:"--cubehelix",ranges:{h:[0,360],s:[0,4.614],l:[0,1]},fromMode:{rgb:({r:e,g:t,b:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=(nr*r+e*ar-t*ir)/(nr+ar-ir),a=r-o,i=(rr[4]*(t-o)-rr[2]*a)/rr[3],n={mode:"cubehelix",l:o,s:0===o||1===o?void 0:Math.sqrt(a*a+i*i)/(rr[4]*o*(1-o))};return n.s&&(n.h=Math.atan2(i,a)*or-120),void 0!==s&&(n.alpha=s),n}},toMode:{rgb:({h:e,s:t,l:r,alpha:s})=>{let o={mode:"rgb"};e=(void 0===e?0:e+120)*sr,void 0===r&&(r=0);let a=void 0===t?0:t*r*(1-r),i=Math.cos(e),n=Math.sin(e);return o.r=r+a*(rr[0]*i+rr[1]*n),o.g=r+a*(rr[2]*i+rr[3]*n),o.b=r+a*(rr[4]*i+rr[5]*n),void 0!==s&&(o.alpha=s),o}},interpolate:{h:{use:Rt,fixup:tr},s:Rt,l:Rt,alpha:{use:Rt,fixup:Ht}},difference:{h:lr},average:{h:hr}},ur=({l:e,a:t,b:r,alpha:s},o="lch")=>{void 0===t&&(t=0),void 0===r&&(r=0);let a=Math.sqrt(t*t+r*r),i={mode:o,l:e,c:a};return a&&(i.h=er(180*Math.atan2(r,t)/Math.PI)),void 0!==s&&(i.alpha=s),i},mr=({l:e,c:t,h:r,alpha:s},o="lab")=>{void 0===r&&(r=0);let a={mode:o,l:e,a:t?t*Math.cos(r/180*Math.PI):0,b:t?t*Math.sin(r/180*Math.PI):0};return void 0!==s&&(a.alpha=s),a},pr=Math.pow(29,3)/Math.pow(3,3),gr=Math.pow(6,3)/Math.pow(29,3),fr=.3457/.3585,br=1,yr=.2958/.3585,vr=.3127/.329,_r=1,xr=.3583/.329;let wr=e=>Math.pow(e,3)>gr?Math.pow(e,3):(116*e-16)/pr;const $r=({l:e,a:t,b:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=(e+16)/116,a=o-r/200,i={mode:"xyz65",x:wr(t/500+o)*vr,y:wr(o)*_r,z:wr(a)*xr};return void 0!==s&&(i.alpha=s),i},kr=e=>Zt($r(e)),Sr=e=>e>gr?Math.cbrt(e):(pr*e+16)/116,Mr=({x:e,y:t,z:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Sr(e/vr),a=Sr(t/_r),i={mode:"lab65",l:116*a-16,a:500*(o-a),b:200*(a-Sr(r/xr))};return void 0!==s&&(i.alpha=s),i},Ar=e=>{let t=Mr(Xt(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},Cr=26/180*Math.PI,Nr=Math.cos(Cr),Er=Math.sin(Cr),Tr=100/Math.log(1.39),zr=({l:e,c:t,h:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o={mode:"lab65",l:(Math.exp(1*e/Tr)-1)/.0039},a=(Math.exp(.0435*t*1*1)-1)/.075,i=a*Math.cos(r/180*Math.PI-Cr),n=a*Math.sin(r/180*Math.PI-Cr);return o.a=i*Nr-n/.83*Er,o.b=i*Er+n/.83*Nr,void 0!==s&&(o.alpha=s),o},Ir=({l:e,a:t,b:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=t*Nr+r*Er,a=.83*(r*Nr-t*Er),i=Math.sqrt(o*o+a*a),n={mode:"dlch",l:Tr/1*Math.log(1+.0039*e),c:Math.log(1+.075*i)/.0435};return n.c&&(n.h=er((Math.atan2(a,o)+Cr)/Math.PI*180)),void 0!==s&&(n.alpha=s),n},Pr=e=>zr(ur(e,"dlch")),Or=e=>mr(Ir(e),"dlab"),jr={mode:"dlab",parse:["--din99o-lab"],serialize:"--din99o-lab",toMode:{lab65:Pr,rgb:e=>kr(Pr(e))},fromMode:{lab65:Or,rgb:e=>Or(Ar(e))},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-40.09,45.501],b:[-40.469,44.344]},interpolate:{l:Rt,a:Rt,b:Rt,alpha:{use:Rt,fixup:Ht}}},Vr={mode:"dlch",parse:["--din99o-lch"],serialize:"--din99o-lch",toMode:{lab65:zr,dlab:e=>mr(e,"dlab"),rgb:e=>kr(zr(e))},fromMode:{lab65:Ir,dlab:e=>ur(e,"dlch"),rgb:e=>Ir(Ar(e))},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,51.484],h:[0,360]},interpolate:{l:Rt,c:Rt,h:{use:Rt,fixup:tr},alpha:{use:Rt,fixup:Ht}},difference:{h:cr},average:{h:hr}};const Dr={mode:"hsi",toMode:{rgb:function({h:e,s:t,i:r,alpha:s}){e=er(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let o,a=Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:o={r:r*(1+t*(3/(2-a)-1)),g:r*(1+t*(3*(1-a)/(2-a)-1)),b:r*(1-t)};break;case 1:o={r:r*(1+t*(3*(1-a)/(2-a)-1)),g:r*(1+t*(3/(2-a)-1)),b:r*(1-t)};break;case 2:o={r:r*(1-t),g:r*(1+t*(3/(2-a)-1)),b:r*(1+t*(3*(1-a)/(2-a)-1))};break;case 3:o={r:r*(1-t),g:r*(1+t*(3*(1-a)/(2-a)-1)),b:r*(1+t*(3/(2-a)-1))};break;case 4:o={r:r*(1+t*(3*(1-a)/(2-a)-1)),g:r*(1-t),b:r*(1+t*(3/(2-a)-1))};break;case 5:o={r:r*(1+t*(3/(2-a)-1)),g:r*(1-t),b:r*(1+t*(3*(1-a)/(2-a)-1))};break;default:o={r:r*(1-t),g:r*(1-t),b:r*(1-t)}}return o.mode="rgb",void 0!==s&&(o.alpha=s),o}},parse:["--hsi"],serialize:"--hsi",fromMode:{rgb:function({r:e,g:t,b:r,alpha:s}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.max(e,t,r),a=Math.min(e,t,r),i={mode:"hsi",s:e+t+r===0?0:1-3*a/(e+t+r),i:(e+t+r)/3};return o-a!=0&&(i.h=60*(o===e?(t-r)/(o-a)+6*(t<r):o===t?(r-e)/(o-a)+2:(e-t)/(o-a)+4)),void 0!==s&&(i.alpha=s),i}},channels:["h","s","i","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:Rt,fixup:tr},s:Rt,i:Rt,alpha:{use:Rt,fixup:Ht}},difference:{h:lr},average:{h:hr}};const Rr=new RegExp(`^hsla?\\(\\s*${mt}${pt}${dt}${pt}${dt}\\s*(?:,\\s*${ut}\\s*)?\\)$`);const Lr={mode:"hsl",toMode:{rgb:function({h:e,s:t,l:r,alpha:s}){e=er(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let o,a=r+t*(r<.5?r:1-r),i=a-2*(a-r)*Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:o={r:a,g:i,b:2*r-a};break;case 1:o={r:i,g:a,b:2*r-a};break;case 2:o={r:2*r-a,g:a,b:i};break;case 3:o={r:2*r-a,g:i,b:a};break;case 4:o={r:i,g:2*r-a,b:a};break;case 5:o={r:a,g:2*r-a,b:i};break;default:o={r:2*r-a,g:2*r-a,b:2*r-a}}return o.mode="rgb",void 0!==s&&(o.alpha=s),o}},fromMode:{rgb:function({r:e,g:t,b:r,alpha:s}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.max(e,t,r),a=Math.min(e,t,r),i={mode:"hsl",s:o===a?0:(o-a)/(1-Math.abs(o+a-1)),l:.5*(o+a)};return o-a!=0&&(i.h=60*(o===e?(t-r)/(o-a)+6*(t<r):o===t?(r-e)/(o-a)+2:(e-t)/(o-a)+4)),void 0!==s&&(i.alpha=s),i}},channels:["h","s","l","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(e,t){if(!t||"hsl"!==t[0]&&"hsla"!==t[0])return;const r={mode:"hsl"},[,s,o,a,i]=t;if(s.type!==At.None){if(s.type===At.Percentage)return;r.h=s.value}if(o.type!==At.None){if(o.type===At.Hue)return;r.s=o.value/100}if(a.type!==At.None){if(a.type===At.Hue)return;r.l=a.value/100}return i.type!==At.None&&(r.alpha=Math.min(1,Math.max(0,i.type===At.Number?i.value:i.value/100))),r},e=>{let t=e.match(Rr);if(!t)return;let r={mode:"hsl"};return void 0!==t[3]?r.h=+t[3]:void 0!==t[1]&&void 0!==t[2]&&(r.h=((e,t)=>{switch(t){case"deg":return+e;case"rad":return e/Math.PI*180;case"grad":return e/10*9;case"turn":return 360*e}})(t[1],t[2])),void 0!==t[4]&&(r.s=Math.min(Math.max(0,t[4]/100),1)),void 0!==t[5]&&(r.l=Math.min(Math.max(0,t[5]/100),1)),void 0!==t[6]?r.alpha=Math.max(0,Math.min(1,t[6]/100)):void 0!==t[7]&&(r.alpha=Math.max(0,Math.min(1,+t[7]))),r}],serialize:e=>`hsl(${void 0!==e.h?e.h:"none"} ${void 0!==e.s?100*e.s+"%":"none"} ${void 0!==e.l?100*e.l+"%":"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:Rt,fixup:tr},s:Rt,l:Rt,alpha:{use:Rt,fixup:Ht}},difference:{h:lr},average:{h:hr}};function Hr({h:e,s:t,v:r,alpha:s}){e=er(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let o,a=Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:o={r:r,g:r*(1-t*a),b:r*(1-t)};break;case 1:o={r:r*(1-t*a),g:r,b:r*(1-t)};break;case 2:o={r:r*(1-t),g:r,b:r*(1-t*a)};break;case 3:o={r:r*(1-t),g:r*(1-t*a),b:r};break;case 4:o={r:r*(1-t*a),g:r*(1-t),b:r};break;case 5:o={r:r,g:r*(1-t),b:r*(1-t*a)};break;default:o={r:r*(1-t),g:r*(1-t),b:r*(1-t)}}return o.mode="rgb",void 0!==s&&(o.alpha=s),o}function Gr({r:e,g:t,b:r,alpha:s}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.max(e,t,r),a=Math.min(e,t,r),i={mode:"hsv",s:0===o?0:1-a/o,v:o};return o-a!=0&&(i.h=60*(o===e?(t-r)/(o-a)+6*(t<r):o===t?(r-e)/(o-a)+2:(e-t)/(o-a)+4)),void 0!==s&&(i.alpha=s),i}const Fr={mode:"hsv",toMode:{rgb:Hr},parse:["--hsv"],serialize:"--hsv",fromMode:{rgb:Gr},channels:["h","s","v","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:Rt,fixup:tr},s:Rt,v:Rt,alpha:{use:Rt,fixup:Ht}},difference:{h:lr},average:{h:hr}};const Ur={mode:"hwb",toMode:{rgb:function({h:e,w:t,b:r,alpha:s}){if(void 0===t&&(t=0),void 0===r&&(r=0),t+r>1){let e=t+r;t/=e,r/=e}return Hr({h:e,s:1===r?1:1-t/(1-r),v:1-r,alpha:s})}},fromMode:{rgb:function(e){let t=Gr(e);if(void 0===t)return;let r=void 0!==t.s?t.s:0,s=void 0!==t.v?t.v:0,o={mode:"hwb",w:(1-r)*s,b:1-s};return void 0!==t.h&&(o.h=t.h),void 0!==t.alpha&&(o.alpha=t.alpha),o}},channels:["h","w","b","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(e,t){if(!t||"hwb"!==t[0])return;const r={mode:"hwb"},[,s,o,a,i]=t;if(s.type!==At.None){if(s.type===At.Percentage)return;r.h=s.value}if(o.type!==At.None){if(o.type===At.Hue)return;r.w=o.value/100}if(a.type!==At.None){if(a.type===At.Hue)return;r.b=a.value/100}return i.type!==At.None&&(r.alpha=Math.min(1,Math.max(0,i.type===At.Number?i.value:i.value/100))),r}],serialize:e=>`hwb(${void 0!==e.h?e.h:"none"} ${void 0!==e.w?100*e.w+"%":"none"} ${void 0!==e.b?100*e.b+"%":"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:Rt,fixup:tr},w:Rt,b:Rt,alpha:{use:Rt,fixup:Ht}},difference:{h:(e,t)=>{if(void 0===e.h||void 0===t.h)return 0;let r=er(e.h),s=er(t.h);return Math.abs(s-r)>180?r-(s-360*Math.sign(s-r)):s-r}},average:{h:hr}},qr=.1593017578125,Br=78.84375,Jr=.8359375,Wr=18.8515625,Xr=18.6875;function Yr(e){if(e<0)return 0;const t=Math.pow(e,1/Br);return 1e4*Math.pow(Math.max(0,t-Jr)/(Wr-Xr*t),1/qr)}function Kr(e){if(e<0)return 0;const t=Math.pow(e/1e4,qr);return Math.pow((Jr+Wr*t)/(1+Xr*t),Br)}const Zr=e=>Math.max(e/203,0),Qr=({i:e,t:t,p:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const o=Yr(e+.008609037037932761*t+.11102962500302593*r),a=Yr(e-.00860903703793275*t-.11102962500302599*r),i=Yr(e+.5600313357106791*t-.32062717498731885*r),n={mode:"xyz65",x:Zr(2.070152218389422*o-1.3263473389671556*a+.2066510476294051*i),y:Zr(.3647385209748074*o+.680566024947227*a-.0453045459220346*i),z:Zr(-.049747207535812*o-.0492609666966138*a+1.1880659249923042*i)};return void 0!==s&&(n.alpha=s),n},es=(e=0)=>Math.max(203*e,0),ts=({x:e,y:t,z:r,alpha:s})=>{const o=es(e),a=es(t),i=es(r),n=Kr(.3592832590121217*o+.6976051147779502*a-.0358915932320289*i),l=Kr(-.1920808463704995*o+1.1004767970374323*a+.0753748658519118*i),c=Kr(.0070797844607477*o+.0748396662186366*a+.8433265453898765*i),h={mode:"itp",i:.5*n+.5*l,t:1.61376953125*n-3.323486328125*l+1.709716796875*c,p:4.378173828125*n-4.24560546875*l-.132568359375*c};return void 0!==s&&(h.alpha=s),h},rs={mode:"itp",channels:["i","t","p","alpha"],parse:["--ictcp"],serialize:"--ictcp",toMode:{xyz65:Qr,rgb:e=>Zt(Qr(e))},fromMode:{xyz65:ts,rgb:e=>ts(Xt(e))},ranges:{i:[0,.581],t:[-.369,.272],p:[-.164,.331]},interpolate:{i:Rt,t:Rt,p:Rt,alpha:{use:Rt,fixup:Ht}}},ss=e=>{if(e<0)return 0;let t=Math.pow(e/1e4,qr);return Math.pow((Jr+Wr*t)/(1+Xr*t),134.03437499999998)},os=(e=0)=>Math.max(203*e,0),as=({x:e,y:t,z:r,alpha:s})=>{e=os(e),t=os(t);let o=1.15*e-.15*(r=os(r)),a=.66*t+.34*e,i=ss(.41478972*o+.579999*a+.014648*r),n=ss(-.20151*o+1.120649*a+.0531008*r),l=ss(-.0166008*o+.2648*a+.6684799*r),c=(i+n)/2,h={mode:"jab",j:.44*c/(1-.56*c)-16295499532821565e-27,a:3.524*i-4.066708*n+.542708*l,b:.199076*i+1.096799*n-1.295875*l};return void 0!==s&&(h.alpha=s),h},is=16295499532821565e-27,ns=e=>{if(e<0)return 0;let t=Math.pow(e,.007460772656268216);return 1e4*Math.pow((Jr-t)/(Xr*t-Wr),1/qr)},ls=e=>e/203,cs=({j:e,a:t,b:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=(e+is)/(.44+.56*(e+is)),a=ns(o+.13860504*t+.058047316*r),i=ns(o-.13860504*t-.058047316*r),n=ns(o-.096019242*t-.8118919*r),l={mode:"xyz65",x:ls(1.661373024652174*a-.914523081304348*i+.23136208173913045*n),y:ls(-.3250758611844533*a+1.571847026732543*i-.21825383453227928*n),z:ls(-.090982811*a-.31272829*i+1.5227666*n)};return void 0!==s&&(l.alpha=s),l},hs=e=>{let t=as(Xt(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},ds=e=>Zt(cs(e)),us={mode:"jab",channels:["j","a","b","alpha"],parse:["--jzazbz"],serialize:"--jzazbz",fromMode:{rgb:hs,xyz65:as},toMode:{rgb:ds,xyz65:cs},ranges:{j:[0,.222],a:[-.109,.129],b:[-.185,.134]},interpolate:{j:Rt,a:Rt,b:Rt,alpha:{use:Rt,fixup:Ht}}},ms=({j:e,a:t,b:r,alpha:s})=>{void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.sqrt(t*t+r*r),a={mode:"jch",j:e,c:o};return o&&(a.h=er(180*Math.atan2(r,t)/Math.PI)),void 0!==s&&(a.alpha=s),a},ps=({j:e,c:t,h:r,alpha:s})=>{void 0===r&&(r=0);let o={mode:"jab",j:e,a:t?t*Math.cos(r/180*Math.PI):0,b:t?t*Math.sin(r/180*Math.PI):0};return void 0!==s&&(o.alpha=s),o},gs={mode:"jch",parse:["--jzczhz"],serialize:"--jzczhz",toMode:{jab:ps,rgb:e=>ds(ps(e))},fromMode:{rgb:e=>ms(hs(e)),jab:ms},channels:["j","c","h","alpha"],ranges:{j:[0,.221],c:[0,.19],h:[0,360]},interpolate:{h:{use:Rt,fixup:tr},c:Rt,j:Rt,alpha:{use:Rt,fixup:Ht}},difference:{h:cr},average:{h:hr}},fs=Math.pow(29,3)/Math.pow(3,3),bs=Math.pow(6,3)/Math.pow(29,3);let ys=e=>Math.pow(e,3)>bs?Math.pow(e,3):(116*e-16)/fs;const vs=({l:e,a:t,b:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=(e+16)/116,a=o-r/200,i={mode:"xyz50",x:ys(t/500+o)*fr,y:ys(o)*br,z:ys(a)*yr};return void 0!==s&&(i.alpha=s),i},_s=({x:e,y:t,z:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Kt({r:3.1341359569958707*e-1.6173863321612538*t-.4906619460083532*r,g:-.978795502912089*e+1.916254567259524*t+.03344273116131949*r,b:.07195537988411677*e-.2289768264158322*t+1.405386058324125*r});return void 0!==s&&(o.alpha=s),o},xs=e=>_s(vs(e)),ws=e=>{let{r:t,g:r,b:s,alpha:o}=Wt(e),a={mode:"xyz50",x:.436065742824811*t+.3851514688337912*r+.14307845442264197*s,y:.22249319175623702*t+.7168870538238823*r+.06061979053616537*s,z:.013923904500943465*t+.09708128566574634*r+.7140993584005155*s};return void 0!==o&&(a.alpha=o),a},$s=e=>e>bs?Math.cbrt(e):(fs*e+16)/116,ks=({x:e,y:t,z:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=$s(e/fr),a=$s(t/br),i={mode:"lab",l:116*a-16,a:500*(o-a),b:200*(a-$s(r/yr))};return void 0!==s&&(i.alpha=s),i},Ss=e=>{let t=ks(ws(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t};const Ms={mode:"lab",toMode:{xyz50:vs,rgb:xs},fromMode:{xyz50:ks,rgb:Ss},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-125,125],b:[-125,125]},parse:[function(e,t){if(!t||"lab"!==t[0])return;const r={mode:"lab"},[,s,o,a,i]=t;return s.type!==At.Hue&&o.type!==At.Hue&&a.type!==At.Hue?(s.type!==At.None&&(r.l=Math.min(Math.max(0,s.value),100)),o.type!==At.None&&(r.a=o.type===At.Number?o.value:125*o.value/100),a.type!==At.None&&(r.b=a.type===At.Number?a.value:125*a.value/100),i.type!==At.None&&(r.alpha=Math.min(1,Math.max(0,i.type===At.Number?i.value:i.value/100))),r):void 0}],serialize:e=>`lab(${void 0!==e.l?e.l:"none"} ${void 0!==e.a?e.a:"none"} ${void 0!==e.b?e.b:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{l:Rt,a:Rt,b:Rt,alpha:{use:Rt,fixup:Ht}}},As={...Ms,mode:"lab65",parse:["--lab-d65"],serialize:"--lab-d65",toMode:{xyz65:$r,rgb:kr},fromMode:{xyz65:Mr,rgb:Ar},ranges:{l:[0,100],a:[-125,125],b:[-125,125]}};const Cs={mode:"lch",toMode:{lab:mr,rgb:e=>xs(mr(e))},fromMode:{rgb:e=>ur(Ss(e)),lab:ur},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,150],h:[0,360]},parse:[function(e,t){if(!t||"lch"!==t[0])return;const r={mode:"lch"},[,s,o,a,i]=t;if(s.type!==At.None){if(s.type===At.Hue)return;r.l=Math.min(Math.max(0,s.value),100)}if(o.type!==At.None&&(r.c=Math.max(0,o.type===At.Number?o.value:150*o.value/100)),a.type!==At.None){if(a.type===At.Percentage)return;r.h=a.value}return i.type!==At.None&&(r.alpha=Math.min(1,Math.max(0,i.type===At.Number?i.value:i.value/100))),r}],serialize:e=>`lch(${void 0!==e.l?e.l:"none"} ${void 0!==e.c?e.c:"none"} ${void 0!==e.h?e.h:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:Rt,fixup:tr},c:Rt,l:Rt,alpha:{use:Rt,fixup:Ht}},difference:{h:cr},average:{h:hr}},Ns={...Cs,mode:"lch65",parse:["--lch-d65"],serialize:"--lch-d65",toMode:{lab65:e=>mr(e,"lab65"),rgb:e=>kr(mr(e,"lab65"))},fromMode:{rgb:e=>ur(Ar(e),"lch65"),lab65:e=>ur(e,"lch65")},ranges:{l:[0,100],c:[0,150],h:[0,360]}},Es=({l:e,u:t,v:r,alpha:s})=>{void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.sqrt(t*t+r*r),a={mode:"lchuv",l:e,c:o};return o&&(a.h=er(180*Math.atan2(r,t)/Math.PI)),void 0!==s&&(a.alpha=s),a},Ts=({l:e,c:t,h:r,alpha:s})=>{void 0===r&&(r=0);let o={mode:"luv",l:e,u:t?t*Math.cos(r/180*Math.PI):0,v:t?t*Math.sin(r/180*Math.PI):0};return void 0!==s&&(o.alpha=s),o},zs=(e,t,r)=>4*e/(e+15*t+3*r),Is=(e,t,r)=>9*t/(e+15*t+3*r),Ps=zs(fr,br,yr),Os=Is(fr,br,yr),js=({x:e,y:t,z:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=(a=t/br)<=bs?fs*a:116*Math.cbrt(a)-16;var a;let i=zs(e,t,r),n=Is(e,t,r);isFinite(i)&&isFinite(n)?(i=13*o*(i-Ps),n=13*o*(n-Os)):o=i=n=0;let l={mode:"luv",l:o,u:i,v:n};return void 0!==s&&(l.alpha=s),l},Vs=((e,t,r)=>4*e/(e+15*t+3*r))(fr,br,yr),Ds=((e,t,r)=>9*t/(e+15*t+3*r))(fr,br,yr),Rs=({l:e,u:t,v:r,alpha:s})=>{if(void 0===e&&(e=0),0===e)return{mode:"xyz50",x:0,y:0,z:0};void 0===t&&(t=0),void 0===r&&(r=0);let o=t/(13*e)+Vs,a=r/(13*e)+Ds,i=br*(e<=8?e/fs:Math.pow((e+16)/116,3)),n={mode:"xyz50",x:i*(9*o)/(4*a),y:i,z:i*(12-3*o-20*a)/(4*a)};return void 0!==s&&(n.alpha=s),n},Ls={mode:"lchuv",toMode:{luv:Ts,rgb:e=>_s(Rs(Ts(e)))},fromMode:{rgb:e=>Es(js(ws(e))),luv:Es},channels:["l","c","h","alpha"],parse:["--lchuv"],serialize:"--lchuv",ranges:{l:[0,100],c:[0,176.956],h:[0,360]},interpolate:{h:{use:Rt,fixup:tr},c:Rt,l:Rt,alpha:{use:Rt,fixup:Ht}},difference:{h:cr},average:{h:hr}},Hs={...Gt,mode:"lrgb",toMode:{rgb:Kt},fromMode:{rgb:Wt},parse:["srgb-linear"],serialize:"srgb-linear"},Gs={mode:"luv",toMode:{xyz50:Rs,rgb:e=>_s(Rs(e))},fromMode:{xyz50:js,rgb:e=>js(ws(e))},channels:["l","u","v","alpha"],parse:["--luv"],serialize:"--luv",ranges:{l:[0,100],u:[-84.936,175.042],v:[-125.882,87.243]},interpolate:{l:Rt,u:Rt,v:Rt,alpha:{use:Rt,fixup:Ht}}},Fs=({r:e,g:t,b:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.cbrt(.412221469470763*e+.5363325372617348*t+.0514459932675022*r),a=Math.cbrt(.2119034958178252*e+.6806995506452344*t+.1073969535369406*r),i=Math.cbrt(.0883024591900564*e+.2817188391361215*t+.6299787016738222*r),n={mode:"oklab",l:.210454268309314*o+.7936177747023054*a-.0040720430116193*i,a:1.9779985324311684*o-2.42859224204858*a+.450593709617411*i,b:.0259040424655478*o+.7827717124575296*a-.8086757549230774*i};return void 0!==s&&(n.alpha=s),n},Us=e=>{let t=Fs(Wt(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},qs=({l:e,a:t,b:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.pow(e+.3963377773761749*t+.2158037573099136*r,3),a=Math.pow(e-.1055613458156586*t-.0638541728258133*r,3),i=Math.pow(e-.0894841775298119*t-1.2914855480194092*r,3),n={mode:"lrgb",r:4.076741636075957*o-3.3077115392580616*a+.2309699031821044*i,g:-1.2684379732850317*o+2.6097573492876887*a-.3413193760026573*i,b:-.0041960761386756*o-.7034186179359362*a+1.7076146940746117*i};return void 0!==s&&(n.alpha=s),n},Bs=e=>Kt(qs(e));function Js(e){const t=.206,r=1.206/1.03;return.5*(r*e-t+Math.sqrt((r*e-t)*(r*e-t)+.12*r*e))}function Ws(e){return(e*e+.206*e)/(1.206/1.03*(e+.03))}function Xs(e,t){let r=function(e,t){let r,s,o,a,i,n,l,c;-1.88170328*e-.80936493*t>1?(r=1.19086277,s=1.76576728,o=.59662641,a=.75515197,i=.56771245,n=4.0767416621,l=-3.3077115913,c=.2309699292):1.81444104*e-1.19445276*t>1?(r=.73956515,s=-.45954404,o=.08285427,a=.1254107,i=.14503204,n=-1.2684380046,l=2.6097574011,c=-.3413193965):(r=1.35733652,s=-.00915799,o=-1.1513021,a=-.50559606,i=.00692167,n=-.0041960863,l=-.7034186147,c=1.707614701);let h=r+s*e+o*t+a*e*e+i*e*t,d=.3963377774*e+.2158037573*t,u=-.1055613458*e-.0638541728*t,m=-.0894841775*e-1.291485548*t;{let e=1+h*d,t=1+h*u,r=1+h*m,s=n*(e*e*e)+l*(t*t*t)+c*(r*r*r),o=n*(3*d*e*e)+l*(3*u*t*t)+c*(3*m*r*r);h-=s*o/(o*o-.5*s*(n*(6*d*d*e)+l*(6*u*u*t)+c*(6*m*m*r)))}return h}(e,t),s=qs({l:1,a:r*e,b:r*t}),o=Math.cbrt(1/Math.max(s.r,s.g,s.b));return[o,o*r]}function Ys(e,t,r=null){r||(r=Xs(e,t));let s=r[0],o=r[1];return[o/s,o/(1-s)]}function Ks(e,t,r){let s=Xs(t,r),o=function(e,t,r,s,o,a=null){let i;if(a||(a=Xs(e,t)),(r-o)*a[1]-(a[0]-o)*s<=0)i=a[1]*o/(s*a[0]+a[1]*(o-r));else{i=a[1]*(o-1)/(s*(a[0]-1)+a[1]*(o-r));{let a=r-o,n=.3963377774*e+.2158037573*t,l=-.1055613458*e-.0638541728*t,c=-.0894841775*e-1.291485548*t,h=a+s*n,d=a+s*l,u=a+s*c;{let e=o*(1-i)+i*r,t=i*s,a=e+t*n,m=e+t*l,p=e+t*c,g=a*a*a,f=m*m*m,b=p*p*p,y=3*h*a*a,v=3*d*m*m,_=3*u*p*p,x=6*h*h*a,w=6*d*d*m,$=6*u*u*p,k=4.0767416621*g-3.3077115913*f+.2309699292*b-1,S=4.0767416621*y-3.3077115913*v+.2309699292*_,M=S/(S*S-.5*k*(4.0767416621*x-3.3077115913*w+.2309699292*$)),A=-k*M,C=-1.2684380046*g+2.6097574011*f-.3413193965*b-1,N=-1.2684380046*y+2.6097574011*v-.3413193965*_,E=N/(N*N-.5*C*(-1.2684380046*x+2.6097574011*w-.3413193965*$)),T=-C*E,z=-.0041960863*g-.7034186147*f+1.707614701*b-1,I=-.0041960863*y-.7034186147*v+1.707614701*_,P=I/(I*I-.5*z*(-.0041960863*x-.7034186147*w+1.707614701*$)),O=-z*P;A=M>=0?A:1e6,T=E>=0?T:1e6,O=P>=0?O:1e6,i+=Math.min(A,Math.min(T,O))}}}return i}(t,r,e,1,e,s),a=Ys(t,r,s),i=e*(.11516993+1/(7.4477897+4.1590124*r+t*(1.75198401*r-2.19557347+t*(-2.13704948-10.02301043*r+t*(5.38770819*r-4.24894561+4.69891013*t))))),n=(1-e)*(.11239642+1/(1.6132032-.68124379*r+t*(.40370612+.90148123*r+t*(.6122399*r-.27087943+t*(.00299215-.45399568*r-.14661872*t))))),l=.9*(o/Math.min(e*a[0],(1-e)*a[1]))*Math.sqrt(Math.sqrt(1/(1/(i*i*i*i)+1/(n*n*n*n))));return i=.4*e,n=.8*(1-e),[Math.sqrt(1/(1/(i*i)+1/(n*n))),l,o]}function Zs(e){const t=void 0!==e.l?e.l:0,r=void 0!==e.a?e.a:0,s=void 0!==e.b?e.b:0,o={mode:"okhsl",l:Js(t)};void 0!==e.alpha&&(o.alpha=e.alpha);let a=Math.sqrt(r*r+s*s);if(!a)return o.s=0,o;let i,[n,l,c]=Ks(t,r/a,s/a);if(a<l){let e=0,t=.8*n;i=.8*((a-e)/(t+(1-t/l)*(a-e)))}else{let e=.2*l*l*1.25*1.25/n;i=.8+.2*((a-l)/(e+(1-e/(c-l))*(a-l)))}return i&&(o.s=i,o.h=er(180*Math.atan2(s,r)/Math.PI)),o}function Qs(e){let t=void 0!==e.h?e.h:0,r=void 0!==e.s?e.s:0,s=void 0!==e.l?e.l:0;const o={mode:"oklab",l:Ws(s)};if(void 0!==e.alpha&&(o.alpha=e.alpha),!r||1===s)return o.a=o.b=0,o;let a,i,n,l,c=Math.cos(t/180*Math.PI),h=Math.sin(t/180*Math.PI),[d,u,m]=Ks(o.l,c,h);r<.8?(a=1.25*r,i=0,n=.8*d,l=1-n/u):(a=5*(r-.8),i=u,n=.2*u*u*1.25*1.25/d,l=1-n/(m-u));let p=i+a*n/(1-l*a);return o.a=p*c,o.b=p*h,o}const eo={...Lr,mode:"okhsl",channels:["h","s","l","alpha"],parse:["--okhsl"],serialize:"--okhsl",fromMode:{oklab:Zs,rgb:e=>Zs(Us(e))},toMode:{oklab:Qs,rgb:e=>Bs(Qs(e))}};function to(e){let t=void 0!==e.l?e.l:0,r=void 0!==e.a?e.a:0,s=void 0!==e.b?e.b:0,o=Math.sqrt(r*r+s*s),a=o?r/o:1,i=o?s/o:1,[n,l]=Ys(a,i),c=1-.5/n,h=l/(o+t*l),d=h*t,u=h*o,m=Ws(d),p=u*m/d,g=qs({l:m,a:a*p,b:i*p}),f=Math.cbrt(1/Math.max(g.r,g.g,g.b,0));t/=f,o=o/f*Js(t)/t,t=Js(t);const b={mode:"okhsv",s:o?(.5+l)*u/(.5*l+l*c*u):0,v:t?t/d:0};return b.s&&(b.h=er(180*Math.atan2(s,r)/Math.PI)),void 0!==e.alpha&&(b.alpha=e.alpha),b}function ro(e){const t={mode:"oklab"};void 0!==e.alpha&&(t.alpha=e.alpha);const r=void 0!==e.h?e.h:0,s=void 0!==e.s?e.s:0,o=void 0!==e.v?e.v:0,a=Math.cos(r/180*Math.PI),i=Math.sin(r/180*Math.PI),[n,l]=Ys(a,i),c=.5,h=1-c/n,d=1-s*c/(c+l-l*h*s),u=s*l*c/(c+l-l*h*s),m=Ws(d),p=u*m/d,g=qs({l:m,a:a*p,b:i*p}),f=Math.cbrt(1/Math.max(g.r,g.g,g.b,0)),b=Ws(o*d),y=u*b/d;return t.l=b*f,t.a=y*a*f,t.b=y*i*f,t}const so={...Fr,mode:"okhsv",channels:["h","s","v","alpha"],parse:["--okhsv"],serialize:"--okhsv",fromMode:{oklab:to,rgb:e=>to(Us(e))},toMode:{oklab:ro,rgb:e=>Bs(ro(e))}};const oo={...Ms,mode:"oklab",toMode:{lrgb:qs,rgb:Bs},fromMode:{lrgb:Fs,rgb:Us},ranges:{l:[0,1],a:[-.4,.4],b:[-.4,.4]},parse:[function(e,t){if(!t||"oklab"!==t[0])return;const r={mode:"oklab"},[,s,o,a,i]=t;return s.type!==At.Hue&&o.type!==At.Hue&&a.type!==At.Hue?(s.type!==At.None&&(r.l=Math.min(Math.max(0,s.type===At.Number?s.value:s.value/100),1)),o.type!==At.None&&(r.a=o.type===At.Number?o.value:.4*o.value/100),a.type!==At.None&&(r.b=a.type===At.Number?a.value:.4*a.value/100),i.type!==At.None&&(r.alpha=Math.min(1,Math.max(0,i.type===At.Number?i.value:i.value/100))),r):void 0}],serialize:e=>`oklab(${void 0!==e.l?e.l:"none"} ${void 0!==e.a?e.a:"none"} ${void 0!==e.b?e.b:"none"}${e.alpha<1?` / ${e.alpha}`:""})`};const ao={...Cs,mode:"oklch",toMode:{oklab:e=>mr(e,"oklab"),rgb:e=>Bs(mr(e,"oklab"))},fromMode:{rgb:e=>ur(Us(e),"oklch"),oklab:e=>ur(e,"oklch")},parse:[function(e,t){if(!t||"oklch"!==t[0])return;const r={mode:"oklch"},[,s,o,a,i]=t;if(s.type!==At.None){if(s.type===At.Hue)return;r.l=Math.min(Math.max(0,s.type===At.Number?s.value:s.value/100),1)}if(o.type!==At.None&&(r.c=Math.max(0,o.type===At.Number?o.value:.4*o.value/100)),a.type!==At.None){if(a.type===At.Percentage)return;r.h=a.value}return i.type!==At.None&&(r.alpha=Math.min(1,Math.max(0,i.type===At.Number?i.value:i.value/100))),r}],serialize:e=>`oklch(${void 0!==e.l?e.l:"none"} ${void 0!==e.c?e.c:"none"} ${void 0!==e.h?e.h:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,ranges:{l:[0,1],c:[0,.4],h:[0,360]}},io=e=>{let{r:t,g:r,b:s,alpha:o}=Wt(e),a={mode:"xyz65",x:.486570948648216*t+.265667693169093*r+.1982172852343625*s,y:.2289745640697487*t+.6917385218365062*r+.079286914093745*s,z:0*t+.0451133818589026*r+1.043944368900976*s};return void 0!==o&&(a.alpha=o),a},no=({x:e,y:t,z:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Kt({r:2.4934969119414263*e-.9313836179191242*t-.402710784450717*r,g:-.8294889695615749*e+1.7626640603183465*t+.0236246858419436*r,b:.0358458302437845*e-.0761723892680418*t+.9568845240076871*r},"p3");return void 0!==s&&(o.alpha=s),o},lo={...Gt,mode:"p3",parse:["display-p3"],serialize:"display-p3",fromMode:{rgb:e=>no(Xt(e)),xyz65:no},toMode:{rgb:e=>Zt(io(e)),xyz65:io}},co=e=>{let t=Math.abs(e);return t>=1/512?Math.sign(e)*Math.pow(t,1/1.8):16*e},ho=({x:e,y:t,z:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o={mode:"prophoto",r:co(1.3457868816471585*e-.2555720873797946*t-.0511018649755453*r),g:co(-.5446307051249019*e+1.5082477428451466*t+.0205274474364214*r),b:co(0*e+0*t+1.2119675456389452*r)};return void 0!==s&&(o.alpha=s),o},uo=(e=0)=>{let t=Math.abs(e);return t>=16/512?Math.sign(e)*Math.pow(t,1.8):e/16},mo=e=>{let t=uo(e.r),r=uo(e.g),s=uo(e.b),o={mode:"xyz50",x:.7977666449006423*t+.1351812974005331*r+.0313477341283922*s,y:.2880748288194013*t+.7118352342418731*r+899369387256e-16*s,z:0*t+0*r+.8251046025104602*s};return void 0!==e.alpha&&(o.alpha=e.alpha),o},po={...Gt,mode:"prophoto",parse:["prophoto-rgb"],serialize:"prophoto-rgb",fromMode:{xyz50:ho,rgb:e=>ho(ws(e))},toMode:{xyz50:mo,rgb:e=>_s(mo(e))}},go=1.09929682680944,fo=e=>{const t=Math.abs(e);return t>.018053968510807?(Math.sign(e)||1)*(go*Math.pow(t,.45)-(go-1)):4.5*e},bo=({x:e,y:t,z:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o={mode:"rec2020",r:fo(1.7166511879712683*e-.3556707837763925*t-.2533662813736599*r),g:fo(-.6666843518324893*e+1.6164812366349395*t+.0157685458139111*r),b:fo(.0176398574453108*e-.0427706132578085*t+.9421031212354739*r)};return void 0!==s&&(o.alpha=s),o},yo=1.09929682680944,vo=(e=0)=>{let t=Math.abs(e);return t<.08124285829863151?e/4.5:(Math.sign(e)||1)*Math.pow((t+yo-1)/yo,1/.45)},_o=e=>{let t=vo(e.r),r=vo(e.g),s=vo(e.b),o={mode:"xyz65",x:.6369580483012911*t+.1446169035862083*r+.1688809751641721*s,y:.262700212011267*t+.6779980715188708*r+.059301716469862*s,z:0*t+.0280726930490874*r+1.0609850577107909*s};return void 0!==e.alpha&&(o.alpha=e.alpha),o},xo={...Gt,mode:"rec2020",fromMode:{xyz65:bo,rgb:e=>bo(Xt(e))},toMode:{xyz65:_o,rgb:e=>Zt(_o(e))},parse:["rec2020"],serialize:"rec2020"},wo=.0037930732552754493,$o=Math.cbrt(wo),ko=e=>Math.cbrt(e)-$o,So=e=>Math.pow(e+$o,3),Mo={mode:"xyb",channels:["x","y","b","alpha"],parse:["--xyb"],serialize:"--xyb",toMode:{rgb:({x:e,y:t,b:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const o=So(e+t)-wo,a=So(t-e)-wo,i=So(r+t)-wo,n=Kt({r:11.031566904639861*o-9.866943908131562*a-.16462299650829934*i,g:-3.2541473810744237*o+4.418770377582723*a-.16462299650829934*i,b:-3.6588512867136815*o+2.7129230459360922*a+1.9459282407775895*i});return void 0!==s&&(n.alpha=s),n}},fromMode:{rgb:e=>{const{r:t,g:r,b:s,alpha:o}=Wt(e),a=ko(.3*t+.622*r+.078*s+wo),i=ko(.23*t+.692*r+.078*s+wo),n={mode:"xyb",x:(a-i)/2,y:(a+i)/2,b:ko(.2434226892454782*t+.2047674442449682*r+.5518098665095535*s+wo)-(a+i)/2};return void 0!==o&&(n.alpha=o),n}},ranges:{x:[-.0154,.0281],y:[0,.8453],b:[-.2778,.388]},interpolate:{x:Rt,y:Rt,b:Rt,alpha:{use:Rt,fixup:Ht}}},Ao={mode:"xyz50",parse:["xyz-d50"],serialize:"xyz-d50",toMode:{rgb:_s,lab:ks},fromMode:{rgb:ws,lab:vs},channels:["x","y","z","alpha"],ranges:{x:[0,.964],y:[0,.999],z:[0,.825]},interpolate:{x:Rt,y:Rt,z:Rt,alpha:{use:Rt,fixup:Ht}}},Co={mode:"xyz65",toMode:{rgb:Zt,xyz50:e=>{let{x:t,y:r,z:s,alpha:o}=e;void 0===t&&(t=0),void 0===r&&(r=0),void 0===s&&(s=0);let a={mode:"xyz50",x:1.0479298208405488*t+.0229467933410191*r-.0501922295431356*s,y:.0296278156881593*t+.990434484573249*r-.0170738250293851*s,z:-.0092430581525912*t+.0150551448965779*r+.7518742899580008*s};return void 0!==o&&(a.alpha=o),a}},fromMode:{rgb:Xt,xyz50:e=>{let{x:t,y:r,z:s,alpha:o}=e;void 0===t&&(t=0),void 0===r&&(r=0),void 0===s&&(s=0);let a={mode:"xyz65",x:.9554734527042182*t-.0230985368742614*r+.0632593086610217*s,y:-.0283697069632081*t+1.0099954580058226*r+.021041398966943*s,z:.0123140016883199*t-.0205076964334779*r+1.3303659366080753*s};return void 0!==o&&(a.alpha=o),a}},ranges:{x:[0,.95],y:[0,1],z:[0,1.088]},channels:["x","y","z","alpha"],parse:["xyz","xyz-d65"],serialize:"xyz-d65",interpolate:{x:Rt,y:Rt,z:Rt,alpha:{use:Rt,fixup:Ht}}},No={mode:"yiq",toMode:{rgb:({y:e,i:t,q:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const o={mode:"rgb",r:e+.95608445*t+.6208885*r,g:e-.27137664*t-.6486059*r,b:e-1.10561724*t+1.70250126*r};return void 0!==s&&(o.alpha=s),o}},fromMode:{rgb:({r:e,g:t,b:r,alpha:s})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const o={mode:"yiq",y:.29889531*e+.58662247*t+.11448223*r,i:.59597799*e-.2741761*t-.32180189*r,q:.21147017*e-.52261711*t+.31114694*r};return void 0!==s&&(o.alpha=s),o}},channels:["y","i","q","alpha"],parse:["--yiq"],serialize:"--yiq",ranges:{i:[-.595,.595],q:[-.522,.522]},interpolate:{y:Rt,i:Rt,q:Rt,alpha:{use:Rt,fixup:Ht}}};$t(Qt),$t(dr),$t(jr),$t(Vr),$t(Dr),$t(Lr),$t(Fr),$t(Ur),$t(rs),$t(us),$t(gs),$t(Ms),$t(As),$t(Cs),$t(Ns),$t(Ls),$t(Hs),$t(Gs),$t(eo),$t(so),$t(oo),$t(ao),$t(lo),$t(po),$t(xo),$t(Gt),$t(Mo),$t(Ao),$t(Co),$t(No);const Eo=e=>{const t=Math.round(Math.min(Math.max(e,0),255)).toString(16);return 1===t.length?`0${t}`:t},To=e=>`#${Eo(e[0])}${Eo(e[1])}${Eo(e[2])}`,zo=e=>{const[t,r,s]=e,o=Math.max(t,r,s),a=o-Math.min(t,r,s),i=a&&(o===t?(r-s)/a:o===r?2+(s-t)/a:4+(t-r)/a);return[60*(i<0?i+6:i),o&&a/o,o]},Io=e=>{const[t,r,s]=e,o=e=>{const o=(e+t/60)%6;return s-s*r*Math.max(Math.min(o,4-o,1),0)};return[o(5),o(3),o(1)]},Po=e=>Io([e[0],e[1],255]),Oo=(e,t,r)=>Math.min(Math.max(e,t),r),jo=e=>{const t=e/100;return[Math.round(Vo(t)),Math.round(Do(t)),Math.round(Ro(t))]},Vo=e=>{if(e<=66)return 255;return Oo(329.698727446*(e-60)**-.1332047592,0,255)},Do=e=>{let t;return t=e<=66?99.4708025861*Math.log(e)-161.1195681661:288.1221695283*(e-60)**-.0755148492,Oo(t,0,255)},Ro=e=>{if(e>=66)return 255;if(e<=19)return 0;const t=138.5177312231*Math.log(e-10)-305.0447927307;return Oo(t,0,255)},Lo=(e,t)=>{const r=Math.max(...e),s=Math.max(...t);let o;return o=0===s?0:r/s,t.map((e=>Math.round(e*o)))},Ho=e=>0===e?1e6:Math.floor(1e6/e),Go=(e,t,r)=>{const[s,o,a,i,n]=e,l=Ho(t??2700),c=Ho(r??6500),h=l-c;let d;try{d=n/(i+n)}catch(v){d=.5}const u=c+d*h,m=u?0===(p=u)?1e6:Math.floor(1e6/p):0;var p;const[g,f,b]=jo(m),y=Math.max(i,n)/255;return Lo([s,o,a,i,n],[s+g*y,o+f*y,a+b*y])};const Fo=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater","weather"]),Uo=(e,t)=>{if((void 0!==t?t:e?.state)===Xe)return"var(--state-unavailable-color)";const r=Jo(e,t);return r?(s=r,Array.isArray(s)?s.reverse().reduce(((e,t)=>`var(${t}${e?`, ${e}`:""})`),void 0):`var(${s})`):void 0;var s},qo=(e,t,r)=>{const s=void 0!==r?r:t.state,o=function(e,t){const r=De(e.entity_id),s=void 0!==t?t:e?.state;if(["button","event","infrared","input_button","radio_frequency","scene"].includes(r))return s!==Xe;if(Ye(s))return!1;if("off"===s&&"alert"!==r)return!1;switch(r){case"alarm_control_panel":return"disarmed"!==s;case"alert":return"idle"!==s;case"cover":case"valve":return"closed"!==s;case"device_tracker":case"person":return"not_home"!==s;case"lawn_mower":return!["docked","paused"].includes(s);case"lock":return"locked"!==s;case"media_player":return"standby"!==s;case"vacuum":return!["idle","docked","paused"].includes(s);case"plant":return"problem"===s;case"group":return["on","home","open","locked","problem"].includes(s);case"timer":return"active"===s;case"camera":return"streaming"===s}return!0}(t,r);return Bo(e,t.attributes.device_class,s,o)},Bo=(e,t,r,s)=>{const o=[],a=((e,t="_")=>{const r="àáâäæãåāăąабçćčđďдèéêëēėęěеёэфğǵгḧхîïíīįìıİийкłлḿмñńǹňнôöòóœøōõőоṕпŕřрßśšşșсťțтûüùúūǘůűųувẃẍÿýыžźżз·",s=`aaaaaaaaaaabcccdddeeeeeeeeeeefggghhiiiiiiiiijkllmmnnnnnoooooooooopprrrsssssstttuuuuuuuuuuvwxyyyzzzz${t}`,o=new RegExp(r.split("").join("|"),"g"),a={"ж":"zh","х":"kh","ц":"ts","ч":"ch","ш":"sh","щ":"shch","ю":"iu","я":"ia"};let i;return""===e?i="":(i=e.toString().toLowerCase().replace(o,(e=>s.charAt(r.indexOf(e)))).replace(/[а-я]/g,(e=>a[e]||"")).replace(/(\d),(?=\d)/g,"$1").replace(/[^a-z0-9]+/g,t).replace(new RegExp(`(${t})\\1+`,"g"),"$1").replace(new RegExp(`^${t}+`),"").replace(new RegExp(`${t}+$`),""),""===i&&(i="unknown")),i})(r,"_"),i=s?"active":"inactive";return t&&o.push(`--state-${e}-${t}-${a}-color`),o.push(`--state-${e}-${a}-color`,`--state-${e}-${i}-color`,`--state-${i}-color`),o},Jo=(e,t)=>{const r=void 0!==t?t:e?.state,s=De(e.entity_id),o=e.attributes.device_class;if("sensor"===s&&"battery"===o){const e=(e=>{const t=Number(e);if(!isNaN(t))return t>=70?"--state-sensor-battery-high-color":t>=30?"--state-sensor-battery-medium-color":"--state-sensor-battery-low-color"})(r);if(e)return[e]}if("group"===s){const r=(e=>{const t=e.attributes.entity_id||[],r=[...new Set(t.map((e=>De(e))))];return 1===r.length?r[0]:void 0})(e);if(r&&Fo.has(r))return qo(r,e,t)}if(Fo.has(s))return qo(s,e,t)};var Wo;!function(e){e[e.TARGET_TEMPERATURE=1]="TARGET_TEMPERATURE",e[e.TARGET_TEMPERATURE_RANGE=2]="TARGET_TEMPERATURE_RANGE",e[e.TARGET_HUMIDITY=4]="TARGET_HUMIDITY",e[e.FAN_MODE=8]="FAN_MODE",e[e.PRESET_MODE=16]="PRESET_MODE",e[e.SWING_MODE=32]="SWING_MODE",e[e.AUX_HEAT=64]="AUX_HEAT",e[e.TURN_OFF=128]="TURN_OFF",e[e.TURN_ON=256]="TURN_ON",e[e.SWING_HORIZONTAL_MODE=512]="SWING_HORIZONTAL_MODE"}(Wo||(Wo={})),["auto","heat_cool","heat","cool","dry","fan_only","off"].reduce(((e,t,r)=>(e[t]=r,e)),{});const Xo={cooling:"cool",defrosting:"heat",drying:"dry",fan:"fan_only",heating:"heat",idle:"off",off:"off",preheating:"heat"};class Yo{static{Yo.colorCache={},Yo.element=void 0,Yo.unresolvedColor=!1}static _prefixKeys(e){let t={};return Object.keys(e).forEach((r=>{const s=`--${r}`,o=String(e[r]);t[s]=`${o}`})),t}static processTheme(e){let t={},r={},s={},o={};const{modes:a,...i}=e;return a&&(r={...i,...a.dark},t={...i,...a.light}),s=Yo._prefixKeys(t),o=Yo._prefixKeys(r),{themeLight:s,themeDark:o}}static processPalette(e){let t={},r={},s={},o={},a={};return Object.values(e).forEach((e=>{const{modes:o,...a}=e;t={...t,...a},o&&(s={...s,...a,...o.dark},r={...r,...a,...o.light})})),o=Yo._prefixKeys(r),a=Yo._prefixKeys(s),{paletteLight:o,paletteDark:a}}static setElement(e){Yo.element=e}static calculateColor(e,t,r){const s=Object.keys(t).map((e=>Number(e))).sort(((e,t)=>e-t));let o,a,i;const n=s.length;if(e<=s[0])return t[s[0]];if(e>=s[n-1])return t[s[n-1]];for(let l=0;l<n-1;l++){const n=s[l],c=s[l+1];if(e>=n&&e<c){if([o,a]=[t[n],t[c]],!r)return o;i=Yo.calculateValueBetween(n,c,e);break}}return Yo.getGradientValue(o,a,i)}static calculateColor2(e,t,r,s,o){const a=Object.keys(t).map((e=>Number(e))).sort(((e,t)=>e-t));let i,n,l;const c=a.length;if(e<=a[0])return t[a[0]];if(e>=a[c-1])return t[a[c-1]];for(let h=0;h<c-1;h++){const c=a[h],d=a[h+1];if(e>=c&&e<d){if([i,n]=[t[c].styles[r][s],t[d].styles[r][s]],!o)return i;l=Yo.calculateValueBetween(c,d,e);break}}return Yo.getGradientValue(i,n,l)}static calculateValueBetween(e,t,r){return(Math.min(Math.max(r,e),t)-e)/(t-e)}static getLovelacePanel(){var e=window.document.querySelector("home-assistant");return(e=(e=(e=(e=(e=(e=e&&e.shadowRoot)&&e.querySelector("home-assistant-main"))&&e.shadowRoot)&&e.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"))&&e.shadowRoot||e)&&e.querySelector("ha-panel-lovelace"))||null}static calculateStrokeColor(e,t,r){const s=t?.colors??[];if(!s.length)return;const o=Number(e);if(!Number.isFinite(o))return s[0].color;if(o<=s[0].value)return s[0].color;const a=s[s.length-1];if(o>=a.value)return a.color;for(let i=0;i<s.length-1;i+=1){const e=s[i],t=s[i+1];if(o>=e.value&&o<t.value){if(!r)return e.color;const s=Yo.calculateValueBetween(e.value,t.value,o);return Yo.getGradientValue(e.color,t.color,s)}}return a.color}static resolveColorVariable(e){const t=this.element.style.getPropertyValue(e).trim();let r=t;if(t.startsWith("var(")){const e=t.replace(/^var\((--.*?)\)$/,"$1").trim();r=window.getComputedStyle(document.body).getPropertyValue(e).trim()}return r}static getColorVariable(e){const t=e.slice(4,-1).trim();let r=t,s="",o=0;for(let n=0;n<t.length;n+=1){const e=t[n];if("("===e)o+=1;else if(")"===e)o-=1;else if(","===e&&0===o){r=t.slice(0,n).trim(),s=t.slice(n+1).trim();break}}const a=getComputedStyle(Yo.element).getPropertyValue(r).trim();if(a)return a;this.lovelace||(this.lovelace=Yo.getLovelacePanel());const i=getComputedStyle(this.lovelace).getPropertyValue(r).trim();return i||s}static getLovelaceColorVariable(e){const t=e.substr(4,e.length-5);this.lovelace||(this.lovelace=Yo.getLovelacePanel());return window.getComputedStyle(this.lovelace).getPropertyValue(t)}static getGradientValue(e,t,r){const s=Yo.colorToRGBA(e),o=Yo.colorToRGBA(t);if(!s||!o)return void(Yo.unresolvedColor=!0);const a=1-r,i=r,n=Math.floor(s[0]*a+o[0]*i),l=Math.floor(s[1]*a+o[1]*i),c=Math.floor(s[2]*a+o[2]*i),h=Math.floor(s[3]*a+o[3]*i);return`#${Yo.padZero(n.toString(16))}${Yo.padZero(l.toString(16))}${Yo.padZero(c.toString(16))}${Yo.padZero(h.toString(16))}`}static padZero(e){return e.length<2&&(e=`0${e}`),e.substr(0,2)}static resolveColorVariableV0(e){let t=e;for(;"string"==typeof t&&t.trim().startsWith("var(");)t=Yo.getColorVariable(t).trim(),console.log("resolving color variable ",e,", to: ",t,"...");return t}static colorToRGBAChat(e){if(null==e)return[0,0,0,0];const t=Yo.colorCache[e];if(t)return t;let r=e;"string"==typeof r&&r.trim().startsWith("var(")&&(r=Yo.resolveColorVariable(r));const s=window.document.createElement("canvas");s.width=s.height=1;const o=s.getContext("2d");o.clearRect(0,0,1,1),o.fillStyle=r,o.fillRect(0,0,1,1);const a=[...o.getImageData(0,0,1,1).data];return Yo.colorCache[e]=a,a}static colorToRGBA(e){if(null==e)return[0,0,0,0];const t=Yo.colorCache[e];if(t)return t;let r=e;if("var"===e.substr(0,3).valueOf()){r=e;for(let t=0;t<10&&r.trim().startsWith("var(");t+=1)if(r=Yo.getColorVariable(r.trim()),!r)return Yo.unresolvedColor=!0,void(Yo.element?.dev?.debug_colors&&console.log("[horseshoe-colors] unresolved css var",{argColor:e}))}let s=Dt(r);if(!s){const t=window.document.createElement("span"),o="rgb(1, 2, 3)";t.style.color=o,t.style.color=r,Yo.element.appendChild(t);const a=window.getComputedStyle(t).color;if(t.remove(),a!==o&&(s=Dt(a)),!s)return Yo.unresolvedColor=!0,void(Yo.element?.dev?.debug_colors&&console.log("[horseshoe-colors] unparseable color",{argColor:e,resolvedColor:r,computedColor:a}))}const o=bt("rgb")(s),a=[Math.round(255*Math.min(Math.max(o.r,0),1)),Math.round(255*Math.min(Math.max(o.g,0),1)),Math.round(255*Math.min(Math.max(o.b,0),1)),Math.round(255*(o.alpha??1))];return Yo.colorCache[e]=a,a}static hslToRgb(e){const t=e.h/360,r=e.s/100,s=e.l/100;let o,a,i;if(0===r)o=a=i=s;else{function n(e,t,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?e+6*(t-e)*r:r<.5?t:r<2/3?e+(t-e)*(2/3-r)*6:e}const l=s<.5?s*(1+r):s+r-s*r,c=2*s-l;o=n(c,l,t+1/3),a=n(c,l,t),i=n(c,l,t-1/3)}return o*=255,a*=255,i*=255,{r:o,g:a,b:i}}static computeColor(e){if(e.attributes?.hvac_action){const t=e.attributes.hvac_action;return t in Xo?Uo(e,Xo[t]):void 0}if(e.attributes?.rgb_color)return`rgb(${e.attributes.rgb_color.join(",")})`;const t=Uo(e);return t||void 0}static getHaEntityIconStyle(e){const t=Yo.computeColor(e),r=(e=>{if(e.attributes.brightness&&"plant"!==De(e.entity_id))return`brightness(${(e.attributes.brightness+245)/5}%)`;return""})(e);return{color:t??"var(--state-icon-color)",fill:"currentColor",...r?{filter:r}:{}}}}const Ko=200,Zo=100,Qo=Ko;class ea{static calculateValueBetween(e,t,r){return isNaN(r)?0:r?(Math.min(Math.max(r,e),t)-e)/(t-e):0}static calculateSvgCoordinate(e,t){return e/100*Ko+(t-Zo)}static calculateSvgDimension(e){return e/100*Ko}static getLovelace(){let e=window.document.querySelector("home-assistant");if(e=e&&e.shadowRoot,e=e&&e.querySelector("home-assistant-main"),e=e&&e.shadowRoot,e=e&&e.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"),e=e&&e.shadowRoot||e,e=e&&e.querySelector("ha-panel-lovelace"),e=e&&e.shadowRoot,e=e&&e.querySelector("hui-root"),e){console.log("getLoveLace, root",e,e.lovelace);const t=e.lovelace;return t.current_view=e.___curView,t}return null}}class ta{static mergeDeep(...e){const t=e=>e&&"object"==typeof e;return e.reduce(((e,r)=>(Object.keys(r).forEach((s=>{const o=e[s],a=r[s];Array.isArray(o)&&Array.isArray(a)?e[s]=o.concat(...a):t(o)&&t(a)?e[s]=this.mergeDeep(o,a):e[s]=a})),e)),{})}}const ra={apparent_temperature:"mdi:thermometer",cloud_coverage:"mdi:weather-cloudy",dew_point:"mdi:thermometer-water",humidity:"mdi:water-percent",pressure:"mdi:gauge",temperature:"mdi:thermometer",uv_index:"mdi:sun-wireless",visibility:"mdi:weather-fog",wind_bearing:"mdi:weather-windy",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",precipitation_probability:"mdi:weather-pouring",condition_clear_night:"mdi:weather-night",condition_cloudy:"mdi:weather-cloudy",condition_fog:"mdi:weather-fog",condition_hail:"mdi:weather-hail",condition_lightning:"mdi:weather-lightning",condition_lightning_rainy:"mdi:weather-lightning-rainy",condition_partlycloudy:"mdi:weather-partly-cloudy",condition_pouring:"mdi:weather-pouring",condition_rainy:"mdi:weather-rainy",condition_snowy:"mdi:weather-snowy",condition_snowy_rainy:"mdi:weather-snowy-rainy",condition_sunny:"mdi:weather-sunny",condition_windy:"mdi:weather-windy",condition_windy_variant:"mdi:weather-windy-variant",condition_exceptional:"mdi:alert-circle-outline"},sa={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed",scale_style:"fixed"},oa={xpos:50,ypos:50},aa={min:0,max:100,width:6,color:"var(--primary-background-color)"},ia={width:12,color:"var(--primary-color)"};class na{static setConfig(e,t){return na.getConfig(e).map(((e,r)=>{try{return na.normalizeConfig(e,r,t)}catch(s){throw console.error("[HorseshoesLayout normalize error]",{index:r,horseshoeConfig:e,error:s,message:s?.message,stack:s?.stack}),s}}))}static getConfig(e){const t=na.getLegacyConfig(e);return[...t?[t]:[],...Array.isArray(e.layout?.horseshoes)?e.layout.horseshoes:[]].map((e=>ta.mergeDeep({},{show:sa,horseshoe_scale:aa,horseshoe_state:ia,entity_index:0},e))).filter((e=>!1!==e.show?.horseshoe))}static getLegacyConfig(e){const t={};return["show","horseshoe_scale","horseshoe_state","color_stops","styles"].forEach((r=>{void 0!==e[r]&&(t[r]=e[r])})),Object.keys(t).length>0?t:void 0}static normalize(e){return e?Pe.isPlainObject(e)&&Array.isArray(e.colors)?{...e,colors:e.colors.map((e=>Pe.normalizeColorEntry(e))).filter(Boolean).sort(((e,t)=>e.value-t.value))}:Pe.isPlainObject(e)?{colors:Object.entries(e).map((([e,t])=>Pe.normalizeColorPair(e,t))).filter(Boolean).sort(((e,t)=>e.value-t.value))}:Array.isArray(e)?{colors:e.flatMap((e=>Pe.normalizeColorArrayEntry(e))).filter(Boolean).sort(((e,t)=>e.value-t.value))}:{colors:[]}:{colors:[]}}static normalizeConfig(e,t,r){const s=e.entity_index??0,o=e.show,a=e.horseshoe_scale,i=e.horseshoe_state,n=e.xpos??e.horseshoe_position?.xpos??e.horseshoe_position?.cx??oa.xpos??oa.cx??50,l=e.ypos??e.horseshoe_position?.ypos??e.horseshoe_position?.cy??oa.ypos??oa.cy??50;if(null==a.min||null==a.max)throw Error(`No horseshoe min/max for scale defined for horseshoe ${t}`);const c=e.color_stops;let h,d,u,m;if(null!=c){const e=r.getJsTemplateOrValue({entity_index:s},c,{resolveKeys:!0});h=Pe.ensureMinimumStops(Pe.normalize(e),a.max);const t=h.colors;if(Array.isArray(t)&&t.length>=2){const e=t[0],r=t[t.length-1];null!=e?.color&&null!=r?.color&&(null==i.color&&(i.color=e.color),d=Pe.normalize({[a.min]:e.color,[a.max]:r.color}),u=e.color,m=r.color)}}const p=e.radius??45,g=e.tickmarks_radius??43,f=e.arc_degrees??260,b=p/100*Qo,y=g/100*Qo,v=2*f/360*Math.PI*b,_=2*Math.PI*b;return{...e,entity_index:s,show:o,fill:e.fill??"rgba(0, 0, 0, 0)",xpos:n,ypos:l,bar_mode:e.bar_mode??"normal",horseshoe_scale:a,horseshoe_state:i,radius:p,tickmarks_radius:g,arc_degrees:f,radiusSize:b,tickmarksRadiusSize:y,horseshoePathLength:v,circlePathLength:_,color_stops:c,colorStops:h,colorStopsMinMax:d,color0:u,color1:m,angleCoords:{x1:"0%",y1:"0%",x2:"100%",y2:"0%"},color1_offset:"0%"}}}const la={enabled:!0,duration:2500,easing:"ease-out",debug:!1};function ca(e,t,r,s={}){const o=Number(r.fromValue),a=Number(r.toValue),i=s.onUpdate,n=s.onComplete;if(!1===t.enabled)return i&&i(a),void(n&&n(a));!function(e){e.frame&&cancelAnimationFrame(e.frame),e.frame=void 0,e.startTime=void 0,e.animating=!1}(e),e.fromValue=o,e.toValue=a,e.startTime=void 0,e.animating=!0,t.debug&&console.log("[horseshoe animation] start",{fromValue:e.fromValue,toValue:e.toValue});const l=r=>{e.startTime||(e.startTime=r);const s=Number(t.duration??la.duration),o=r-e.startTime,a=s<=0?1:Oo(o/s,0,1),c=function(e,t){return"linear"===t?e:"ease-in"===t?e**3:"ease-in-out"===t?e<.5?4*e**3:1-(-2*e+2)**3/2:1-(1-e)**3}(a,t.easing),h=e.fromValue+(e.toValue-e.fromValue)*c;i&&i(h),a<1?e.frame=requestAnimationFrame((e=>l(e))):(e.frame=void 0,e.startTime=void 0,e.animating=!1,n&&n(e.toValue),t.debug&&console.log("[horseshoe animation] end",{value:e.toValue}))};e.frame=requestAnimationFrame((e=>l(e)))}const ha=Math.PI/180;class da{constructor(e,t){this.x=e,this.y=t;const r=e.length;this.n=r;const s=new Array(r-1),o=new Array(r-1);for(let a=0;a<r-1;a+=1)s[a]=e[a+1]-e[a],o[a]=(t[a+1]-t[a])/s[a];this.c1s=new Array(r).fill(0),this.c1s[0]=o[0];for(let a=1;a<r-1;a+=1)this.c1s[a]=(o[a-1]+o[a])/2;this.c1s[r-1]=o[r-2];for(let a=0;a<r-1;a+=1)if(0===o[a])this.c1s[a]=0,this.c1s[a+1]=0;else{const e=this.c1s[a]/o[a],t=this.c1s[a+1]/o[a],r=Math.hypot(e,t);if(r>3){const s=3/r;this.c1s[a]=s*e*o[a],this.c1s[a+1]=s*t*o[a]}}this.c2s=new Array(r-1),this.c3s=new Array(r-1);for(let a=0;a<r-1;a+=1){const e=o[a],t=this.c1s[a+1],r=this.c1s[a];this.c2s[a]=(3*e-2*r-t)/s[a],this.c3s[a]=(r+t-2*e)/(s[a]*s[a])}}get(e){if(e<=this.x[0])return this.y[0];if(e>=this.x[this.n-1])return this.y[this.n-1];let t=0;for(let s=0;s<this.n-1;s+=1)if(e>=this.x[s]&&e<=this.x[s+1]){t=s;break}const r=e-this.x[t];return this.y[t]+this.c1s[t]*r+this.c2s[t]*r*r+this.c3s[t]*r*r*r}}class ua{constructor(e,t){this.x=e,this.y=t,this.n=e.length,this.m=new Array(this.n-1),this.t=new Array(this.n);const r=new Array(this.n-1),s=new Array(this.n-1);for(let o=0;o<this.n-1;o+=1)r[o]=e[o+1]-e[o],s[o]=t[o+1]-t[o],this.m[o]=s[o]/r[o];this.t[0]=.25*this.m[0],this.t[this.n-1]=.25*this.m[this.n-2];for(let o=1;o<this.n-1;o+=1)if(0===this.m[o-1]||0===this.m[o]||this.m[o-1]*this.m[o]<0)this.t[o]=0;else{const e=2*r[o]+r[o-1],t=r[o]+2*r[o-1];this.t[o]=(e+t)/(e/this.m[o-1]+t/this.m[o])}for(let o=0;o<this.n-1;o+=1)if(0===this.m[o])this.t[o]=0,this.t[o+1]=0;else{const e=this.t[o]/this.m[o],t=this.t[o+1]/this.m[o],r=e*e+t*t;if(r>9){const s=3/Math.sqrt(r);this.t[o]=s*e*this.m[o],this.t[o+1]=s*t*this.m[o]}}}get(e){if(e<=this.x[0])return this.y[0];if(e>=this.x[this.n-1])return this.y[this.n-1];let t=0;for(let c=0;c<this.n-1;c+=1)if(e>=this.x[c]&&e<=this.x[c+1]){t=c;break}const r=this.x[t+1]-this.x[t],s=(e-this.x[t])/r,o=s*s,a=o*s,i=a-2*o+s,n=-2*a+3*o,l=a-o;return(2*a-3*o+1)*this.y[t]+i*r*this.t[t]+n*this.y[t+1]+l*r*this.t[t+1]}}class ma{constructor(e){if(this.type=e.type,this.min=Number(e.min),this.max=Number(e.max),this.points=ma.buildPoints(e),"spline"!==this.type)if("spline2"!==this.type){if("linear"!==this.type)throw new Error(`[V2 GaugeScale] Unsupported scale type: ${this.type}`)}else this.spline2=new ua(this.points.map((e=>e.value)),this.points.map((e=>e.position)));else this.spline=new da(this.points.map((e=>e.value)),this.points.map((e=>e.position)))}static buildPoints(e){if("spline"!==e.type&&"spline2"!==e.type)return[{value:Number(e.min),position:0},{value:Number(e.max),position:1}];if(!e.spline?.anchors)throw new Error("[V2 GaugeScale] Missing horseshoe_scale.spline.anchors");const t=e.spline.anchors.map((e=>({value:Number(e.value),position:Number(e.position)}))).filter((e=>Number.isFinite(e.value)&&Number.isFinite(e.position))).sort(((e,t)=>e.value-t.value));if("spline2"===e.type){const r=[{value:Number(e.min),position:0},...t,{value:Number(e.max),position:1}].filter((e=>Number.isFinite(e.value)&&Number.isFinite(e.position))).sort(((e,t)=>e.value-t.value)),s=new Map;return r.forEach((e=>{s.set(e.value,e)})),[...s.values()].sort(((e,t)=>e.value-t.value))}return t}toRatio(e){const t=Number(e);return"spline"===this.type?Oo(this.spline.get(t),0,1):"spline2"===this.type?Oo(this.spline2.get(t),0,1):Oo((t-this.min)/(this.max-this.min),0,1)}}class pa{constructor(e,t){this.cx=e.svg.xpos,this.cy=e.svg.ypos,this.radius=e.svg.radius,this.tickmarksRadius=e.svg.tickmarks_radius,this.arcDegrees=e.arc_degrees,this.startAngle=e.start_angle,this.endAngle=this.startAngle+this.arcDegrees,this.rotation=Number(e.rotate??0),this.flip=e.flip??"none",this.groupConfig=e.group_config,this.barMode=e.bar_mode,this.zeroRatio=e.zero_ratio,this.zeroAngle=this.ratioToAngle(this.zeroRatio),this.scale=t}getTransformContext(){return{rotation:this.rotation,flipX:"x"===this.flip||"both"===this.flip,flipY:"y"===this.flip||"both"===this.flip}}getRotateTransform(){return this.rotation?`rotate(${this.rotation} ${this.cx} ${this.cy})`:""}getScaleTransform(){const e=this.getTransformContext();if(!e.flipX&&!e.flipY)return"";const t=e.flipX?-1:1,r=e.flipY?-1:1;return`translate(${this.cx} ${this.cy}) scale(${t} ${r}) translate(${-this.cx} ${-this.cy})`}getGroupRotateTransform(){const e=Number(this.groupConfig?.rotate??this.groupConfig?.rotation??0);return e?`rotate(${e} ${this.groupConfig.svg.xpos} ${this.groupConfig.svg.ypos})`:""}getGroupScaleTransform(){if(!this.groupConfig?.scale)return"";const e=this.groupConfig.scale.x??this.groupConfig.scale,t=this.groupConfig.scale.y??this.groupConfig.scale;return`translate(${this.groupConfig.svg.xpos} ${this.groupConfig.svg.ypos}) scale(${e} ${t}) translate(${-this.groupConfig.svg.xpos} ${-this.groupConfig.svg.ypos})`}getGroupTransform(){return[this.getGroupRotateTransform(),this.getGroupScaleTransform(),this.getRotateTransform(),this.getScaleTransform()].filter(Boolean).join(" ")}getInverseGroupTransform(){const e=this.getTransformContext(),t=[];if(e.flipX||e.flipY){const r=e.flipX?-1:1,s=e.flipY?-1:1;t.push(`translate(${this.cx} ${this.cy})`),t.push(`scale(${r} ${s})`),t.push(`translate(${-this.cx} ${-this.cy})`)}return this.rotation&&t.push(`rotate(${-this.rotation} ${this.cx} ${this.cy})`),t.join(" ")}ratioToAngle(e){return this.startAngle+e*this.arcDegrees}scaleValueToRatio(e){return this.scale.toRatio(e)}scaleValueToAngle(e){return this.ratioToAngle(this.scaleValueToRatio(e))}valueToRatio(e){const t=Number(e);if(!("bidirectional"===this.barMode||"bidirectional_symmetrical"===this.barMode)||this.scale.min>=0||this.scale.max<=0)return this.scaleValueToRatio(t);const r=this.scaleValueToRatio(0);if(t<0){const e=this.scaleValueToRatio(t);return.5*Oo(r>0?e/r:0,0,1)}const s=this.scaleValueToRatio(t),o=1-r;return.5+.5*Oo(o>0?(s-r)/o:0,0,1)}valueToAngle(e){return this.ratioToAngle(this.valueToRatio(e))}pointAt(e,t){const r=e*ha;return{x:this.cx+Math.cos(r)*t,y:this.cy+Math.sin(r)*t}}}class ga{static renderLabel(e){return"horizontal"===(e.orientation??"arc")?ga.renderHorizontalLabel(e):ga.renderArcLabel(e)}static renderHorizontalLabel(e){const t=ga.pointAt({cx:e.cx,cy:e.cy,radius:e.radius,angle:e.angle}),r=e.transformContext??{},s=r.rotation??0,o=r.flipX??!1?-1:1,a=r.flipY??!1?-1:1;return F`
      <text
        x="${t.x}"
        y="${t.y}"
        text-anchor="middle"
        style="dominant-baseline:central;fill:var(--primary-text-color)"
        class="horseshoe-label"
        transform="
          translate(${t.x} ${t.y})
          scale(${o} ${a})
          rotate(${-s})
          translate(${-t.x} ${-t.y})
        "
      >
        ${e.label}
      </text>
    `}static renderArcLabel(e){const t=String(e.label??""),r=ga.getLabelGeometry({angle:e.angle,transformContext:e.transformContext}).visualAngle,s=r>=180&&r<=360,o=r-12,a=r+12,i=s?o:a,n=s?a:o,l=s?1:0,c=ga.pointAt({cx:e.cx,cy:e.cy,radius:e.radius,angle:i}),h=ga.pointAt({cx:e.cx,cy:e.cy,radius:e.radius,angle:n}),d=`${e.cardId}-horseshoe-label-${e.horseshoeIndex}-${e.index}`,u=e.inverseTransform??"";return F`
      <g transform="${u}">
        <path
          id="${d}"
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
            href="#${d}"
            style="dominant-baseline:central"
            startOffset="50%"
            text-anchor="middle"
          >
            ${t}
          </textPath>
        </text>
      </g>
    `}static renderLabelBadge(e){return"horizontal"===(e.orientation??"arc")?ga.renderHorizontalBadge(e):ga.renderArcBadge(e)}static renderArcSegment(e){const t=ga.pointAt({cx:e.cx,cy:e.cy,radius:e.radius,angle:e.startAngle}),r=ga.pointAt({cx:e.cx,cy:e.cy,radius:e.radius,angle:e.endAngle}),s=Math.abs(e.endAngle-e.startAngle)>180?1:0,o=e.endAngle>e.startAngle?1:0;return F`
      <path
        class="${e.className??""}"
        d="M ${t.x} ${t.y} A ${e.radius} ${e.radius} 0 ${s} ${o} ${r.x} ${r.y}"
        fill="none"
        stroke="${e.color??"currentColor"}"
        stroke-width="${e.width}"
        stroke-linecap="${e.lineCap??"round"}"
      />
    `}static renderArcBadge(e){const t=String(e.label??""),r=e.badge??{},s=Number(r.padding??2),o=Number(r.char_width??4),a=Number(r.width??t.length*o+2*s),i=Number(r.height??8),n=Math.max(0,a-i),l=ga.arcLengthToDegrees(n,e.radius),c=ga.buildArcCapsulePath({cx:e.cx,cy:e.cy,radius:e.radius,angle:e.angle,arcSize:l,width:i});return F`
      <path
        class="horseshoe-label-badge"
        d="${c}"
        fill="${r.color??"var(--card-background-color)"}"
        stroke="${r.border_color??"none"}"
      />
    `}static renderHorizontalBadge(e){const t=e.badge??{},r=ga.pointAt({cx:e.cx,cy:e.cy,radius:e.radius,angle:e.angle}),s=String(e.label??""),o=Number(t.padding??4),a=Number(t.radius??Math.max(7,3*s.length+o));return F`
      <circle
        class="horseshoe-label-badge"
        cx="${r.x}"
        cy="${r.y}"
        r="${a}"
        fill="${t.color??"var(--card-background-color)"}"
        stroke="${t.border_color??"none"}"
      />
    `}static pointAt(e){const t=ga.degToRad(e.angle);return{x:e.cx+Math.cos(t)*e.radius,y:e.cy+Math.sin(t)*e.radius}}static normalizeAngle(e){return(e%360+360)%360}static degToRad(e){return e*Math.PI/180}static radToDeg(e){return 180*e/Math.PI}static arcLengthToDegrees(e,t){return Number(e)/(2*Math.PI*t)*360}static getLabelGeometry(e){const t=e.angle??0,r=e.transformContext??{},s=r.rotation??0,o=r.flipX??!1,a=r.flipY??!1;return{positionAngle:t,visualAngle:ga.getVisualAngleFromParentTransform({angle:t,rotation:s,flipX:o,flipY:a}),mirrored:o!==a}}static getVisualAngleFromParentTransform(e){const t=e.angle??0,r=e.rotation??0,s=e.flipX??!1?-1:1,o=e.flipY??!1?-1:1,a=ga.degToRad(t),i=ga.degToRad(r),n=Math.cos(a),l=Math.sin(a),c=(n*Math.cos(i)-l*Math.sin(i))*s,h=(n*Math.sin(i)+l*Math.cos(i))*o;return ga.normalizeAngle(ga.radToDeg(Math.atan2(h,c)))}static buildArcCapsulePath(e){const t=e.width/2,r=e.radius+t,s=e.radius-t,o=e.angle-e.arcSize/2,a=e.angle+e.arcSize/2,i=ga.pointAt({cx:e.cx,cy:e.cy,radius:r,angle:o}),n=ga.pointAt({cx:e.cx,cy:e.cy,radius:r,angle:a}),l=ga.pointAt({cx:e.cx,cy:e.cy,radius:s,angle:a}),c=ga.pointAt({cx:e.cx,cy:e.cy,radius:s,angle:o}),h=e.arcSize>180?1:0;return`\n      M ${i.x} ${i.y}\n      A ${r} ${r} 0 ${h} 1 ${n.x} ${n.y}\n      A ${t} ${t} 0 0 1 ${l.x} ${l.y}\n      A ${s} ${s} 0 ${h} 0 ${c.x} ${c.y}\n      A ${t} ${t} 0 0 1 ${i.x} ${i.y}\n      Z\n    `}}function fa(e,t,r){return`horseshoe-state-${e}-${t}-${r}`}function ba(e,t){return`horseshoe-state-gradient-${e}-${t}`}function ya(e,t,r,s,o){const a={...e.horseshoe_state.styles},i={...e.horseshoe_scale.styles},n=ba(s,o);return F`
    <g class="horseshoe__state-layer">
      ${function(e,t,r,s,o){if("lineargradient"!==e.show?.horseshoe_style)return"";const a=e.colorStops.colors,i=a[0].color,n=a[a.length-1].color,l=r.find((e=>e.arc.gradientOffset))?.arc.gradientOffset??"0%",c=ba(s,o),h=t.pointAt(t.startAngle,t.radius),d=t.pointAt(t.endAngle,t.radius);return F`
    <defs>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        gradientTransform="rotate(0)"
        id="${c}"
        x1="${h.x}"
        y1="${h.y}"
        x2="${d.x}"
        y2="${d.y}"
      >
        <stop id="${c}-color1" offset="${l}" stop-color="${n}" style="transition: stop-color 1s ease;"></stop>
        <stop offset="100%" stop-color="${i}" style="transition: stop-color 1s ease;"></stop>
      </linearGradient>
    </defs>
  `}(e,t,r,s,o)}
      ${r.map((t=>{const r=!1===t.arc.active?i:a,l="lineargradient"===e.show?.horseshoe_style&&!1!==t.arc.active?`url('#${n}')`:t.arc.color??r.fill??e.horseshoe_state.color??"none",c={...r,fill:l};t.path||(c.opacity="0");const h=fa(s,o,t.key);return F`
          <path
            id="${h}"
            data-horseshoe-state-path="${h}"
            class="horseshoe__state"
            d="${t.path}"
            style=${me(c)}
          ></path>
        `}))}
    </g>
  `}function va(e,t,r,s,o,a){const i={...e.horseshoe_state.styles},n={...e.horseshoe_scale.styles},l=ba(o,a),c=s.renderRoot?.querySelector(`#${l}-color1`);if("lineargradient"===e.show?.horseshoe_style&&c){const e=t.find((e=>e.arc.gradientOffset))?.arc.gradientOffset;e&&c.setAttribute("offset",e)}t.forEach((t=>{const c=function(e,t,r,s,o){if(!o?.key)return;if(e.has(o.key)){const t=e.get(o.key);if(t?.isConnected)return t;e.delete(o.key)}const a=t?.renderRoot??t?.shadowRoot;if(!a)return;const i=fa(r,s,o.key),n=a.getElementById?.(i)??a.querySelector?.(`[data-horseshoe-state-path="${i}"]`);return n&&e.set(o.key,n),n}(r,s,o,a,t);if(!c)return;const h=!1===t.arc.active?n:i,d="lineargradient"===e.show?.horseshoe_style&&!1!==t.arc.active?`url('#${l}')`:t.arc.color??h.fill??e.horseshoe_state.color??"none",u={...h,fill:d};t.path||(u.opacity="0"),c.setAttribute("d",t.path||""),c.setAttribute("style",Object.entries(u).map((([e,t])=>`${e}: ${t}`)).join("; "))}))}const _a=e=>Array.isArray(e)?e:[];class xa{static buildBandPath(e={}){const{geometry:t,arc:r={},band:s={}}=e;if(!t||!1===r.visible)return"";const o={startAngle:0,endAngle:0,startCap:"butt",endCap:"butt",...r},a={radius:t.radius,width:1,...s},i=Number(o.startAngle),n=Number(o.endAngle),l=Number(a.radius),c=Number(a.width);if(!(Number.isFinite(i)&&Number.isFinite(n)&&Number.isFinite(l)&&Number.isFinite(c)))return"";if(n===i||c<=0)return"";const h=l-c/2,d=l+c/2;if(h<=0||d<=0)return"";const u=t.pointAt(i,d),m=t.pointAt(n,d),p=t.pointAt(n,h),g=t.pointAt(i,h),f=Math.abs(n-i)>180?1:0,b=n>i?1:0,y=b?0:1,v=c/2,_=[];return _.push(`M ${u.x} ${u.y}`),_.push(`A ${d} ${d} 0 ${f} ${b} ${m.x} ${m.y}`),"round"===o.endCap?_.push(`A ${v} ${v} 0 0 ${b} ${p.x} ${p.y}`):_.push(`L ${p.x} ${p.y}`),_.push(`A ${h} ${h} 0 ${f} ${y} ${g.x} ${g.y}`),"round"===o.startCap?_.push(`A ${v} ${v} 0 0 ${b} ${u.x} ${u.y}`):_.push(`L ${u.x} ${u.y}`),_.push("Z"),_.join(" ")}}function wa(e,t){const r=e.show?.scale_style??"fixed";return"none"===r?[]:"colorstop"===r?function(e,t){const r=_a(e.colorStops?.colors),s=Number(e.colorStops?.gap??0),o=[];if(!r.length)return[{key:"scale",startAngle:t.startAngle,endAngle:t.endAngle,startCap:e.horseshoe_scale.linecap.start,endCap:e.horseshoe_scale.linecap.end,color:e.horseshoe_scale.color}];const a=[{value:Number(e.horseshoe_scale.min),color:r[0].color},...r.map((e=>({value:Number(e.value),color:e.color}))),{value:Number(e.horseshoe_scale.max),color:r[r.length-1].color}];for(let n=0;n<a.length-1;n+=1){const e=a[n],r=a[n+1],i=t.valueToAngle(e.value),l=t.valueToAngle(r.value),c=0===n?i:i+s/2,h=n===a.length-2?l:l-s/2,d=h>c;o.push({key:`scale-colorstop-${n}`,startAngle:d?c:0,endAngle:d?h:0,startCap:"butt",endCap:"butt",color:e.color,value:e.value,visible:d})}const i=o.filter((e=>!1!==e.visible));return i.length&&(i[0].startCap=e.horseshoe_scale.linecap.start,i[i.length-1].endCap=e.horseshoe_scale.linecap.end),o}(e,t):[{key:"scale",startAngle:t.startAngle,endAngle:t.endAngle,startCap:e.horseshoe_scale.linecap.start,endCap:e.horseshoe_scale.linecap.end,color:e.horseshoe_scale.color}]}function $a(e,t,r,s){const o=e.show?.horseshoe_style,a=Number(s.fromAngle??t.startAngle),i=Number(s.toAngle??t.startAngle);return"colorstopsegments"===o?function(e,t,r,s){const o=_a(e.colorStops?.colors),a=Number(e.colorStops?.gap??0),i=[];if(o.length<2)return[{key:"state-value",startAngle:r,endAngle:s,startCap:e.horseshoe_state.linecap.start,endCap:e.horseshoe_state.linecap.end}];for(let l=0;l<o.length-1;l+=1){const e=o[l],n=o[l+1],c=t.valueToAngle(e.value),h=t.valueToAngle(n.value),d=Math.max(c,r)+a/2,u=Math.min(h,s)-a/2,m=u>d;i.push({key:`colorstop-${l}`,startAngle:m?d:0,endAngle:m?u:0,startCap:"butt",endCap:"butt",color:e.color,value:e.value,label:e.label,visible:m})}const n=i.filter((e=>!1!==e.visible));return n.length&&(n[0].startCap=e.horseshoe_state.linecap.start,n[n.length-1].endCap=e.horseshoe_state.linecap.end),i}(e,t,a,i):"autominmax"===o?[{key:"state-value",startAngle:a,endAngle:i,startCap:e.horseshoe_state.linecap.start,endCap:e.horseshoe_state.linecap.end,color:Yo.calculateStrokeColor(r,e.colorStopsMinMax,!0)}]:"lineargradient"===o?[{key:"state-value",startAngle:a,endAngle:i,startCap:e.horseshoe_state.linecap.start,endCap:e.horseshoe_state.linecap.end,gradientOffset:"0%"}]:"colorstop"===o||"colorstopgradient"===o?[{key:"state-value",startAngle:a,endAngle:i,startCap:e.horseshoe_state.linecap.start,endCap:e.horseshoe_state.linecap.end,color:Yo.calculateStrokeColor(r,e.colorStops,"colorstopgradient"===o)}]:[{key:"state-value",startAngle:a,endAngle:i,startCap:e.horseshoe_state.linecap.start,endCap:e.horseshoe_state.linecap.end}]}function ka(e,t,r){return"segment"===e.horseshoe_state.mode?function(e,t,r){const s=e.state_map.map,o=e.horseshoe_state.segment_gap,a=s.length;if(!a)return[];const i=t.arcDegrees/a;return s.map(((s,n)=>{const l=Number(s.value)===Number(r);return{key:`mapped-state-${n}`,startAngle:t.startAngle+n*i+o/2,endAngle:t.startAngle+(n+1)*i-o/2,startCap:0===n?e.horseshoe_state.linecap.start:"butt",endCap:n===a-1?e.horseshoe_state.linecap.end:"butt",active:l,value:s.value,label:s.label??String(s.state)}}))}(e,t,r):"bidirectional"===e.bar_mode||"bidirectional_symmetrical"===e.bar_mode||"bidirectional_linear"===e.bar_mode?function(e,t,r){const s=t.valueToAngle(r),o=t.zeroAngle;return $a(e,t,r,{fromAngle:Math.min(o,s),toAngle:Math.max(o,s)})}(e,t,r):function(e,t,r){return $a(e,t,r,{fromAngle:t.startAngle,toAngle:t.valueToAngle(r)})}(e,t,r)}function Sa(e,t,r){const s=ka(e,t,r),o={radius:t.radius,width:e.horseshoe_state.width};return s.map(((e,r)=>({key:e.key??`state-arc-${r}`,arc:e,path:xa.buildBandPath({geometry:t,arc:e,band:o})})))}function Ma(e,t,r){const s=[];for(let o=e;o<=t+1e-9;o+=r)s.push(Number(o.toFixed(10)));return s}function Aa(e,t){return function(e){const t=e.show.labels_at??"none",r=Number(e.horseshoe_scale.min),s=Number(e.horseshoe_scale.max),o=_a(e.colorStops?.colors);let a=[];if("minmax"===t&&(a=[{value:r,text:String(r),role:"min"},{value:s,text:String(s),role:"max"}]),"minmax0"===t&&(a=[{value:r,text:String(r),role:"min"},{value:0,text:"0",role:"zero"},{value:s,text:String(s),role:"max"}]),"colorstop"!==t&&"colorstops"!==t||(a=[{value:r,text:String(r),role:"min"},...o.map((e=>({value:e.value,text:e.label??String(e.value),role:"colorstop",color:e.color}))),{value:s,text:String(s),role:"max"}]),"ticks_major"===t){const t=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);Number.isFinite(t)&&t>0&&(a=Ma(r,s,t).map(((e,t,r)=>({value:e,text:String(e),role:0===t?"min":t===r.length-1?"max":"tick-major"}))))}if("both"===t){const t=o.length?[{value:r,text:String(r),role:"min"},...o.map((e=>({value:e.value,text:e.label??String(e.value),role:"colorstop",color:e.color}))),{value:s,text:String(s),role:"max"}]:[],i=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);a=[...t,...Number.isFinite(i)&&i>0?Ma(r,s,i).map((e=>({value:e,text:String(e),role:"tick-major"}))):[]]}const i=a.filter((e=>{const t=Number(e.value);return Number.isFinite(t)&&t>=r&&t<=s})).sort(((e,t)=>Number(e.value)-Number(t.value))).filter(((e,t,r)=>{const s=Number(e.value);return r.findIndex((e=>Number(e.value)===s))===t})),n=Number(e.horseshoe_labels.distance_min??0),l=[];return i.forEach((e=>{const t=Number(e.value);if(n<=0)return void l.push(e);const r=l[l.length-1];(!r||Math.abs(t-Number(r.value))>=n)&&l.push(e)})),l.length&&(l[0].role="min",l[l.length-1].role="max"),l}(e).map((r=>function(e,t,r={}){const s=Number(r.value),o=t.valueToAngle(s),a=t.radius+Number(e.horseshoe_labels.offset??e.horseshoe_state.width+2),i=t.pointAt(o,a);return{...r,value:s,text:r.text??String(s),role:r.role??"label",angle:o,radius:a,x:i.x,y:i.y}}(e,t,r)))}const Ca={enabled:!0,duration:2500,easing:"ease-out",debug:!1};function Na(e){return"string"==typeof e?{start:e,end:e}:e&&"object"==typeof e?{start:e.start??"butt",end:e.end??"butt"}:{start:"butt",end:"butt"}}function Ea(e){const t=Number(e.min),r=Number(e.max);return t>=0||r<=0?0:Oo((0-t)/(r-t),0,1)}function Ta(e,t,r,s,o){const a={entity_index:r},i=function(e){const t={horseshoe:!0,horseshoe_style:"fixed",labels_at:"none",...e.show??{}};if(!e.horseshoe_scale)throw new Error("[V2] Missing horseshoe_scale");const r={min:0,max:100,width:6,color:"var(--primary-background-color)",linecap:"round",type:"linear",...e.horseshoe_scale??{}};if(void 0===r.min)throw new Error("[V2] Missing horseshoe_scale.min");if(void 0===r.max)throw new Error("[V2] Missing horseshoe_scale.max");if(!r.type)throw new Error("[V2] Missing horseshoe_scale.type");if(("spline"===r.type||"spline2"===r.type)&&!r.spline)throw new Error("[V2] Missing horseshoe_scale.spline");const s={width:12,color:"var(--primary-color)",linecap:"round",mode:"value",segment_gap:2,animation:Ca,...e.horseshoe_state??{}},o={offset:12,...e.horseshoe_labels??{}},a={...e.horseshoe_tickmarks??{}},i=e.state_map??s.state_map,n=e.color_stops??e.colorstops,l=Pe.ensureMinimumStops(Pe.normalize(n),r.max),c=l.colors[0],h=l.colors[l.colors.length-1],d=Pe.normalize({[r.min]:c.color,[r.max]:h.color}),u=e.radius??45,m=e.tickmarks_radius??43,p=e.arc_degrees??260,g=e.bar_mode??"normal",f="bidirectional"===g||"bidirectional_symmetrical"===g,b=e.group_config,y=e.xpos??e.horseshoe_position?.xpos??e.horseshoe_position?.cx??50,v=e.yposc||(e.ypos??e.horseshoe_position?.ypos??e.horseshoe_position?.cy??50),_=b?b.xpos+y-50:y,x=b?b.ypos+v-50:v,w=b?{xpos:b.xpos/100*Qo,ypos:b.ypos/100*Qo}:void 0;return{...e,show:t,group_config:b?{...b,svg:w}:b,xpos:_,ypos:x,radius:u,tickmarks_radius:m,arc_degrees:p,svg:{xpos:_/100*Qo,ypos:x/100*Qo,radius:u/100*Qo,tickmarks_radius:m/100*Qo},start_angle:e.start_angle??90+(360-p)/2,bar_mode:g,zero_ratio:e.zero_ratio??(f?.5:Ea(r)),state_map:i,color_stops:n,colorstops:n,colorStops:l,colorStopsMinMax:d,horseshoe_scale:{...r,linecap:Na(r.linecap),styles:{fill:r.color,...ze.toStyleDict(r.styles)}},horseshoe_state:{...s,animation:{...Ca,...s.animation??{}},linecap:Na(s.linecap),styles:{fill:s.color,...ze.toStyleDict(s.styles)}},horseshoe_labels:{...o,background:{...o.background??{},styles:{...ze.toStyleDict(o.background?.styles)}},badges:{...o.badges??{},styles:{...ze.toStyleDict(o.badges?.styles)}},styles:{fill:"var(--primary-text-color)","font-size":"6px",...ze.toStyleDict(o.styles)}},horseshoe_tickmarks:{...a,background:{...a.background??{},styles:{...ze.toStyleDict(a.background?.styles)}},ticks_major:a.ticks_major?{...a.ticks_major,styles:{...ze.toStyleDict(a.ticks_major?.styles)}}:a.ticks_major,ticks_minor:a.ticks_minor?{...a.ticks_minor,styles:{...ze.toStyleDict(a.ticks_minor?.styles)}}:a.ticks_minor}}}(t.getJsTemplateOrValue(a,e,{resolveKeys:!0}));let n=s.state;o?.attribute&&void 0!==s.attributes?.[o.attribute]&&(n=s.attributes[o.attribute]);const l=i.state_map?function(e,t,r){return e.find((e=>void 0!==e.state?String(e.state)===String(t):void 0!==e.value&&String(e.value)===String(r)))}(i.state_map.map,s.state,n):void 0,c=Number(l?.value??n);return{runtimeConfig:i,rawState:s.state,mappedState:l,value:c}}function za(e,t,r){const s=[];for(let o=e;o<=t+1e-9;o+=r)s.push(Number(o.toFixed(10)));return s}function Ia(e,t){if(!e?.show?.ticks)return[];const r=e.show.tick_background??"none";if("none"===r)return[];const s=e.horseshoe_tickmarks??{},o=s.background??{},a=s.ticks_major??{},i=s.ticks_minor??{},n=t.radius+Number(o.offset??a.offset??i.offset??0),l=Number(o.width??a.width??i.width??4),c=Number(o.gap??0);return"colorstop"===r?function(e,t,r,s,o,a){const i=Array.isArray(e.colorStops?.colors)?e.colorStops.colors:[];if(!i.length)return[];const n=[{value:e.horseshoe_scale.min,color:i[0].color},...i.map((e=>({value:Number(e.value),color:e.color}))),{value:e.horseshoe_scale.max,color:i[i.length-1].color}],l=[];for(let c=0;c<n.length-1;c+=1){const e=n[c],r=n[c+1],i=0===c,h=c===n.length-2,d=t.valueToAngle(e.value),u=t.valueToAngle(r.value),m=i?d:d+a/2,p=h?u:u-a/2;p>m&&l.push({key:`tick-background-colorstop-${c}`,radius:s,width:o,color:e.color,startAngle:m,endAngle:p,lineCap:"butt"})}return l}(e,t,0,n,l,c):"fixed"===r?[{key:"tick-background-fixed",radius:n,width:l,color:o.color,startAngle:t.startAngle,endAngle:t.endAngle,lineCap:"round"}]:[]}function Pa(e,t,r,s,o,a){if(!r||!s.length)return[];const i=ze.toStyleDict(r.styles),n={...i,"stroke-width":i["stroke-width"]??0},l=t.radius+Number(r.offset??0),c=Number(r.width);if(!Number.isFinite(c)||c<=0)throw new Error(`[horseshoe-tickmarks] Missing or invalid ${o} tick width`);const h=Number(r.thickness);return s.map(((s,d)=>{const u=t.valueToAngle(s),m="minor"===o&&a?.has(s)?Math.min(h,a.get(s)):h;"minor"===o&&(e.debug_ticks||e.dev?.debug_ticks)&&console.log("[horseshoe-tickmarks] minor thickness",{value:s,configuredThickness:h,maxThickness:a?.get(s),finalThickness:m,limited:a?.has(s)&&m!==h});const p=c,g=function(e,t){return Number(e)/(2*Math.PI*t)*360}(m,l),f=u-g/2,b=u+g/2,y=function(e,t,r){return xa.buildBandPath({geometry:e,arc:t,band:r})}(t,{key:`${o}-${d}`,startAngle:f,endAngle:b,startCap:"butt",endCap:"butt"},{radius:l,width:p}),v=function(e,t,r,s){const o=e?.color_mode;return"colorstop"===o?Yo.calculateStrokeColor(r,s.colorStops,!1):"colorstopgradient"===o?Yo.calculateStrokeColor(r,s.colorStops,!0):e?.color??t.fill}(r,i,s,e),_={...n,fill:v??i.fill};return void 0===v&&e.dev?.debug_colors&&console.log("[horseshoe-tickmarks] unresolved tick fill",{layerName:o,value:s,colorMode:r.color_mode,colorStops:e.colorStops}),{key:`${o}-${d}`,path:y,value:s,thickness:m,startAngle:f,endAngle:b,styles:_,className:"major"===o?"horseshoe__tick-major":"horseshoe__tick-minor"}})).filter((e=>e.path))}function Oa(e,t){if(!e?.show?.ticks)return[];const r=e.horseshoe_tickmarks;if(!r?.ticks_major&&!r?.ticks_minor)return[];const s=Number(e.horseshoe_scale.min),o=Number(e.horseshoe_scale.max),a=r.ticks_major,i=r.ticks_minor,n=Number(a?.ticksize),l=Number(i?.ticksize),c=Number.isFinite(n)&&n>0?za(s,o,n):[],h=Number.isFinite(l)&&l>0?za(s,o,l).filter((e=>!(Number.isFinite(n)&&n>0)||!function(e,t,r){const s=(e-t)/r;return Math.abs(s-Math.round(s))<1e-9}(e,s,n))):[],d=new Map;if(("spline"===e.horseshoe_scale.type||"spline2"===e.horseshoe_scale.type)&&c.length>1&&h.length){const r=t.radius+Number(i.offset??0),s=Number(a.thickness),o=c.slice(0,-1).map(((e,r)=>Math.abs(t.valueToAngle(c[r+1])-t.valueToAngle(e)))),n=o[1]??o[0];for(let a=0;a<c.length-1;a+=1){const o=c[a],m=c[a+1],p=h.filter((e=>e>o&&e<m));if(p.length){const a=Math.abs(t.valueToAngle(m)-t.valueToAngle(o)),c=(u=r,Number(a)/360*(2*Math.PI*u)),h=Math.max(0,c-s),g=Math.abs(m-o)/l,f=Math.min(1,a/n),b=Math.min(h/g,Number(i.thickness)*f);(e.debug_ticks||e.dev?.debug_ticks)&&console.log("[horseshoe-tickmarks] spline minor interval",{scaleType:e.horseshoe_scale.type,majorStartValue:o,majorEndValue:m,minorValues:p,majorGapDegrees:a,referenceMajorGapDegrees:n,intervalRatio:f,minorRadius:r,majorGapArcLength:c,majorThickness:s,availableMinorArcLength:h,minorTickSize:l,minorSlotsBetweenMajorTicks:g,configuredMinorThickness:Number(i.thickness),maxMinorThickness:b}),p.forEach((e=>{d.set(e,b)}))}}}var u;return[...Pa(e,t,i,h,"minor",d),...Pa(e,t,a,c,"major")]}class ja{static setConfig(e,t,r,s){e.layout&&!e.layout.horseshoes_v2&&(e.layout.horseshoes_v2="legacy");return("legacy"===e.layout?.horseshoes_v2?[ja.getLegacyRootConfig(e)]:Array.isArray(e.layout?.horseshoes_v2)?e.layout.horseshoes_v2:[]).filter(Boolean).map(((o,a)=>new ja(function(e,t,r){const s=e.entity_index??0,o=e.group?r?.[e.group]:void 0;return{entity_index:s,...e,group_config:o,index:t,show:{horseshoe:!0,horseshoe_style:"fixed",labels_at:"none",...e.show??{}}}}(o,a,e.layout?.groups),a,t,r,s))).filter((e=>!1!==e.show?.horseshoe))}static getLegacyRootConfig(e){const t={};return["entity_index","show","horseshoe_position","horseshoe_scale","horseshoe_state","horseshoe_labels","horseshoe_tickmarks","color_stops","colorstops","styles","bar_mode","radius","tickmarks_radius","arc_degrees","start_angle","rotate","flip","xpos","ypos","yposc"].forEach((r=>{void 0!==e[r]&&(t[r]=e[r])})),Object.keys(t).length?t:void 0}constructor(e,t,r,s,o){this.config=e,this.index=t,this.templates=r,this.cardId=s,this.card=o,this.entity_index=e.entity_index??0,this.show=e.show,this.entity=void 0,this.entityConfig=void 0,this.rawState=void 0,this.value=void 0,this.displayValue=void 0,this.mappedState=void 0,this.runtimeConfig=void 0,this.scale=void 0,this.geometry=void 0,this.valueAnimator={frame:void 0,startTime:void 0,fromValue:void 0,toValue:void 0,animating:!1},this.statePathElements=new Map,this.pathItemCache=new Map,this.pathItemCacheKey=void 0}setState(e,t){this.entity=e,this.entityConfig=t;const r=Ta(this.config,this.templates,this.entity_index,e,t),s=r.value,o=Number.isFinite(this.displayValue)?this.displayValue:s;this.runtimeConfig=r.runtimeConfig,this.rawState=r.rawState,this.mappedState=r.mappedState,this.value=s,this.scale=new ma(this.runtimeConfig.horseshoe_scale),this.geometry=new pa(this.runtimeConfig,this.scale),this.refreshPathItemCacheKey(),Number.isFinite(this.displayValue)?this.displayValue!==this.value&&this.startValueAnimation({fromValue:o,toValue:this.value}):this.displayValue=this.value}render(){if(!(Number.isFinite(this.value)&&this.runtimeConfig&&this.scale&&this.geometry))return F``;if(this.card?.config?.palettes&&!this.card.palettesLoaded)return F``;const e=this.geometry.getGroupTransform();return F`
      <g
        id="horseshoe-${this.index}"
        class="horseshoe"
        transform="${e}"
      >
        ${this.renderScale()}
        ${this.renderLabelBackground()}
        ${this.renderTickmarkBackground()}
        ${this.renderTickmarks()}
        ${this.renderState()}
        ${this.renderLabelBadges()}
        ${this.renderLabels()}
      </g>
    `}getPathItemCacheKey(){return JSON.stringify({show:this.runtimeConfig.show,svg:this.runtimeConfig.svg,arc_degrees:this.runtimeConfig.arc_degrees,start_angle:this.runtimeConfig.start_angle,rotate:this.runtimeConfig.rotate,flip:this.runtimeConfig.flip,group_config:this.runtimeConfig.group_config,bar_mode:this.runtimeConfig.bar_mode,zero_ratio:this.runtimeConfig.zero_ratio,colorStops:this.runtimeConfig.colorStops,colorStopsMinMax:this.runtimeConfig.colorStopsMinMax,horseshoe_scale:this.runtimeConfig.horseshoe_scale,horseshoe_state:{width:this.runtimeConfig.horseshoe_state.width,linecap:this.runtimeConfig.horseshoe_state.linecap,mode:this.runtimeConfig.horseshoe_state.mode,segment_gap:this.runtimeConfig.horseshoe_state.segment_gap,color:this.runtimeConfig.horseshoe_state.color,styles:this.runtimeConfig.horseshoe_state.styles},state_map:this.runtimeConfig.state_map,horseshoe_labels:this.runtimeConfig.horseshoe_labels,horseshoe_tickmarks:this.runtimeConfig.horseshoe_tickmarks})}refreshPathItemCacheKey(){const e=this.getPathItemCacheKey();e!==this.pathItemCacheKey&&(this.pathItemCache.clear(),this.pathItemCacheKey=e)}clearPathItemCache(){this.pathItemCache.clear(),this.pathItemCacheKey=void 0}getCachedPathItems(e,t){if(!this.pathItemCache.has(e)){Yo.unresolvedColor=!1;const r=t();if(Yo.unresolvedColor)return r;this.pathItemCache.set(e,r)}return this.pathItemCache.get(e)}renderScale(){const e=this.getCachedPathItems("scalePathItems",(()=>function(e,t){const r=wa(e,t),s={radius:t.radius,width:e.horseshoe_scale.width};return r.map(((e,r)=>({key:e.key??`scale-arc-${r}`,arc:e,path:xa.buildBandPath({geometry:t,arc:e,band:s})})))}(this.runtimeConfig,this.geometry)));return function(e,t,r){const s={...e.horseshoe_scale.styles};return F`
    <g class="horseshoe__scale-layer" style=${me(s)}>
      ${r.map((t=>{const r=t.arc.color??e.horseshoe_scale.color??s.fill??"none";return t.path?F`
              <path
                class="horseshoe__scale"
                d=${t.path}
                fill="${r}"
              ></path>
            `:F``}))}
    </g>
  `}(this.runtimeConfig,this.geometry,e)}renderState(){const e=Sa(this.runtimeConfig,this.geometry,this.displayValue??this.value);return ya(this.runtimeConfig,this.geometry,e,this.cardId,this.index)}renderTickmarks(){return function(e){return e.length?F`
    <g class="horseshoe__ticks-layer">
      ${e.map((e=>F`
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
  `:F``}(this.getCachedPathItems("tickPathItems",(()=>Oa(this.runtimeConfig,this.geometry))))}renderTickmarkBackground(){const e=this.getCachedPathItems("tickmarkBackgroundItems",(()=>Ia(this.runtimeConfig,this.geometry)));return function(e,t,r){if(!r.length)return F``;const s={...e.horseshoe_tickmarks.background.styles};return F`
    <g class="horseshoe__tick-background-layer" style=${me(s)}>
      ${r.map((e=>ga.renderArcSegment({cx:t.cx,cy:t.cy,radius:e.radius,startAngle:e.startAngle,endAngle:e.endAngle,width:e.width,color:e.color??s.stroke??"currentColor",className:"horseshoe__tick-background",lineCap:e.lineCap??"round"})))}
    </g>
  `}(this.runtimeConfig,this.geometry,e)}renderLabels(){const e=this.getCachedPathItems("labelItems",(()=>Aa(this.runtimeConfig,this.geometry)));return function(e,t,r,s,o){const a={...e.horseshoe_labels.styles};return F`
    <g class="horseshoe__labels-layer" style=${me(a)}>
      ${o.map(((o,a)=>ga.renderLabel({horseshoeIndex:s,index:a,label:o.text,angle:o.angle,cx:t.cx,cy:t.cy,radius:o.radius,cardId:r,orientation:e.horseshoe_labels.orientation??"arc",isMin:"min"===o.role,isMax:"max"===o.role,transformContext:t.getTransformContext(),inverseTransform:t.getInverseGroupTransform()})))}
    </g>
  `}(this.runtimeConfig,this.geometry,this.cardId,this.index,e)}renderLabelBackground(){const e=this.getCachedPathItems("labelBackgroundItems",(()=>function(e,t){const r=e.show.label_background??"none";if("none"===r)return[];const s=e.horseshoe_labels.background??{},o=t.radius+Number(e.horseshoe_labels.offset??e.horseshoe_state.width+2),a=Number(s.width??6),i=Number(s.gap??0);if("colorstop"===r){const r=_a(e.colorStops?.colors);if(r.length<1)return[];const s=[],n=[{value:e.horseshoe_scale.min,color:r[0].color},...r.map((e=>({value:Number(e.value),color:e.color}))),{value:e.horseshoe_scale.max,color:r[r.length-1].color}];for(let e=0;e<n.length-1;e+=1){const r=n[e],l=n[e+1],c=t.valueToAngle(r.value),h=t.valueToAngle(l.value),d=0===e?c:c+i/2,u=e===n.length-2?h:h-i/2;u>d&&s.push({key:`label-background-colorstop-${e}`,startAngle:d,endAngle:u,radius:o,width:a,color:r.color,lineCap:"butt"})}return s}return"fixed"===r?[{key:"label-background-fixed",startAngle:t.startAngle,endAngle:t.endAngle,radius:o,width:a,color:s.color,lineCap:"round"}]:[]}(this.runtimeConfig,this.geometry)));return function(e,t,r){if(!r.length)return F``;const s={...e.horseshoe_labels.background.styles};return F`
    <g class="horseshoe__label-background-layer" style=${me(s)}>
      ${r.map((e=>ga.renderArcSegment({cx:t.cx,cy:t.cy,radius:e.radius,startAngle:e.startAngle,endAngle:e.endAngle,width:e.width,color:e.color??s.stroke??"currentColor",className:"horseshoe__label-background",lineCap:e.lineCap??"round"})))}
    </g>
  `}(this.runtimeConfig,this.geometry,e)}renderLabelBadges(){const e=this.getCachedPathItems("labelItems",(()=>Aa(this.runtimeConfig,this.geometry)));return function(e,t,r,s,o){if(!o.length||!e.show.label_badges)return F``;const a={...e.horseshoe_labels.badges.styles};return F`
    <g class="horseshoe__label-badges-layer" style=${me(a)}>
      ${o.map(((o,a)=>ga.renderLabelBadge({horseshoeIndex:s,index:a,label:o.text,angle:o.angle,cx:t.cx,cy:t.cy,radius:o.radius,cardId:r,orientation:e.horseshoe_labels.orientation??"arc",badge:e.horseshoe_labels.badges??{}})))}
    </g>
  `}(this.runtimeConfig,this.geometry,this.cardId,this.index,e)}getStateAnimationConfig(){return e=this.runtimeConfig,{...la,...e?.horseshoe_state?.animation??{}};var e}startValueAnimation(e={}){const t=this.getStateAnimationConfig();ca(this.valueAnimator,t,e,{onUpdate:e=>{this.displayValue=e,this.updateStatePathDom({value:this.displayValue})},onComplete:e=>{this.displayValue=e,this.updateStatePathDom({value:this.displayValue})}})}updateStatePathDom(e={}){if(!this.runtimeConfig||!this.geometry||!this.scale)return;const t=Number(e.value??this.displayValue??this.value),r=Sa(this.runtimeConfig,this.geometry,t);va(this.runtimeConfig,r,this.statePathElements,this.card,this.cardId,this.index)}}class Va{static renderColorStopLabel(e){const t=String(e.label);return t.length>0?Va.renderColorStopTextPathLabel({...e,label:t}):Va.renderColorStopRotatedLabel({...e,label:t})}static renderColorStopTextPathLabel({horseshoeIndex:e,index:t,label:r,angle:s,cx:o,cy:a,radius:i,cardId:n,isMin:l=!1,isMax:c=!1,transformContext:h={}}){const d=String(r),{visualAngle:u,mirrored:m}=Va.resolveLabelGeometry({angle:s,...h}),p=m?Va.normalizeAngle(u+180):u;let g=p-12,f=p+12;l&&(g=p,f=p+24),c&&(g=p-24,f=p);const b=p>=270||p<=90,y=b?g:f,v=b?f:g,_=b?1:0;let x="50%",w="middle";l&&(x=b?"0%":"100%",w=b?"start":"end"),c&&(x=b?"100%":"0%",w=b?"end":"start");const $=Va.polarToCartesian(o,a,i,y),k=Va.polarToCartesian(o,a,i,v),S=`${n}-colorstop-label-${e}-${t}`,M=b?"0.0em":"0em",{rotation:A=0,flipX:C=!1,flipY:N=!1}=h;return F`
    <g transform="${`\n    translate(${o} ${a})\n    scale(${C?-1:1} ${N?-1:1})\n    rotate(${-A})\n    translate(${-o} ${-a})\n  `}">
      <path
        id="${S}"
        d="M ${$.x} ${$.y} A ${i} ${i} 0 0 ${_} ${k.x} ${k.y}"
        fill="none"
        stroke="none"
      />

      <text
        class="horseshoe-colorstop-label"
        style="fill:currentColor"
        dy="${M}"
      >
        <textPath
          href="#${S}"
          style="dominant-baseline:central"
          startOffset="${x}"
          text-anchor="${w}"
        >
          ${d}
        </textPath>
      </text>
    </g>
  `}static renderColorStopRotatedLabel({label:e,angle:t,cx:r,cy:s,radius:o}){const a=Va.polarToCartesian(r,s,o,t);let i=t;return i>90&&(i-=180),i<-90&&(i+=180),F`
      <text
        x="${a.x}"
        y="${a.y}"
        text-anchor="middle"
        style="dominant-baseline:central"
        transform="rotate(${i} ${a.x} ${a.y})"
        class="horseshoe-colorstop-label"
        style="fill:var(--primary-text-color)"
      >
        ${e}
      </text>
    `}static valueToAngle(e,t,r,s,o){if("bidirectional"!==o){return-s/2+(e-t)/(r-t)*s}const a=s/2;if(e<0){return-(e/t)*a}if(e>0){return e/r*a}return 0}static polarToCartesian(e,t,r,s){const o=(s-90)*Math.PI/180;return{x:e+r*Math.cos(o),y:t+r*Math.sin(o)}}static renderArcSegment({cx:e,cy:t,radius:r,startAngle:s,endAngle:o,width:a,color:i,className:n="",lineCap:l="round"}){const c=Va.polarToCartesian(e,t,r,s),h=Va.polarToCartesian(e,t,r,o),d=Math.abs(o-s)>180?1:0,u=o>s?1:0;return F`
    <path
      class="${n}"
      d="M ${c.x} ${c.y}
         A ${r} ${r} 0 ${d} ${u} ${h.x} ${h.y}"
      fill="none"
      stroke="${i}"
      stroke-width="${a}"
      stroke-linecap="${l}"
    />
  `}static buildColorStopSegments(e,t,r){const s=e.map((e=>({value:Number(e.value),color:e.color,label:e.label??e.value}))).filter((e=>Number.isFinite(e.value)&&e.value>=t&&e.value<=r)).sort(((e,t)=>e.value-t.value));if(!s.length)return[];const o=[{value:t,color:s[0].color},...s,{value:r,color:s[s.length-1].color}];return o.slice(0,-1).map(((e,t)=>{const r=o[t+1];return{startValue:e.value,endValue:r.value,color:e.color}})).filter((e=>e.startValue!==e.endValue))}static renderColorStopScaleSegments({cx:e,cy:t,radius:r,startAngle:s,endAngle:o,width:a,colorStops:i,min:n,max:l,arcDegrees:c,barMode:h,gap:d=0,opacity:u=1,className:m="",lineCap:p="butt"}){const g=Va.buildColorStopSegments(i.colors,n,l),f="round"===p;return F`
    ${g.map(((s,o)=>{const i=0===o,p=o===g.length-1,b=Va.valueToAngle(s.startValue,n,l,c,h)+d/2,y=Va.valueToAngle(s.endValue,n,l,c,h)-d/2;if(y<=b)return F``;const v=y>b?1:0;return F`
        ${Va.renderArcSegment({cx:e,cy:t,radius:r,startAngle:b,endAngle:y,width:a,color:s.color,opacity:u,className:m,lineCap:"butt"})}

        ${i&&f?Va.renderArcHalfCap({cx:e,cy:t,radius:r,angle:b,width:a,color:s.color,opacity:u,className:m,sweepFlag:v,side:"start"}):F``}

        ${p&&f?Va.renderArcHalfCap({cx:e,cy:t,radius:r,angle:y,width:a,color:s.color,opacity:u,className:m,sweepFlag:v,side:"end"}):F``}
      `}))}
  `}static renderArcHalfCap({cx:e,cy:t,radius:r,angle:s,width:o,color:a,opacity:i=1,className:n="",side:l="end"}){const c=Va.polarToCartesian(e,t,r,s),h=o/2,d=(c.x-e)/r,u=(c.y-t)/r,m=c.x-d*h,p=c.y-u*h,g=c.x+d*h,f=c.y+u*h;return F`
    <path
      class="${n}"
      d="
        M ${m} ${p}
        A ${h} ${h} 0 0 ${"start"===l?1:0} ${g} ${f}
        Z
      "
      fill="${a}"
    />
  `}static buildFixedScaleSegments({min:e,max:t,segmentSize:r,color:s}){if(!r||r<=0)return[{startValue:e,endValue:t,color:s}];const o=[];for(let a=e;a<t;a+=r)o.push({startValue:a,endValue:Math.min(a+r,t),color:s});return o}static renderFixedScaleSegments({cx:e,cy:t,radius:r,width:s,color:o,min:a,max:i,arcDegrees:n,barMode:l,segmentSize:c,gap:h=0,className:d="",lineCap:u="round"}){const m=Va.buildFixedScaleSegments({min:a,max:i,segmentSize:c,color:o});return Va.renderScaleSegments({cx:e,cy:t,radius:r,width:s,segments:m,min:a,max:i,arcDegrees:n,barMode:l,gap:h,className:d,lineCap:u})}static renderScaleSegments({cx:e,cy:t,radius:r,width:s,segments:o,min:a,max:i,arcDegrees:n,barMode:l,gap:c=2,className:h="",lineCap:d="butt"}){const u="round"===d;return F`
    ${o.map(((d,m)=>{const p=0===m,g=m===o.length-1,f=Va.valueToAngle(d.startValue,a,i,n,l)+c/2,b=Va.valueToAngle(d.endValue,a,i,n,l)-c/2;return b<=f?F``:F`
        ${Va.renderArcSegment({cx:e,cy:t,radius:r,startAngle:f,endAngle:b,width:s,color:d.color,className:h,lineCap:"butt"})}

        ${p&&u?Va.renderArcHalfCap({cx:e,cy:t,radius:r,angle:f,width:s,color:d.color,className:h,side:"start"}):F``}

        ${g&&u?Va.renderArcHalfCap({cx:e,cy:t,radius:r,angle:b,width:s,color:d.color,className:h,side:"end"}):F``}
      `}))}
  `}static renderScaleTicks({cx:e,cy:t,radius:r,min:s,max:o,arcDegrees:a,barMode:i,colorStops:n,ticksMajor:l,ticksMinor:c,tickType:h}){const d=r+Number(c?.offset??0),u=d+Number(l?.offset??0),m=l?Va.buildTickValues(s,o,Number(l.ticksize)):[];let p=c?Va.buildTickValues(s,o,Number(c.ticksize)).filter((e=>!l||!Va.isMajorTick(e,s,Number(l.ticksize)))):[];if("ticks_minor"===h){const e=Number(l?.ticksize);p=p.filter((t=>!Va.isMajorTick(t,s,e)))}return F`
    ${"ticks_minor"===h&&c?Va.renderTicks({cx:e,cy:t,radius:d,values:p,min:s,max:o,arcDegrees:a,barMode:i,width:Number(c.width??1),thickness:Number(c.thickness??2),color:c.color,colorMode:c.color_mode,colorStops:n,className:"horseshoe-scale-tick-minor"}):F``}

    ${l?Va.renderTicks({cx:e,cy:t,radius:u,values:m,min:s,max:o,arcDegrees:a,barMode:i,width:Number(l.width??4),thickness:Number(l.thickness??10),color:l.color,colorMode:l.color_mode,colorStops:n,className:"horseshoe-scale-tick-major"}):F``}
  `}static renderTicks({cx:e,cy:t,radius:r,values:s,min:o,max:a,arcDegrees:i,barMode:n,width:l,thickness:c,color:h,colorMode:d,colorStops:u,className:m=""}){return F`
    ${s.map((s=>{const p=Va.valueToAngle(s,o,a,i,n),g=Va.arcLengthToDegrees(c,r);let f=h;return"colorstop"===d&&(f=Yo.calculateStrokeColor(s,u,!1)),"colorstopgradient"===d&&(f=Yo.calculateStrokeColor(s,u,!0)),Va.renderArcSegment({cx:e,cy:t,radius:r,startAngle:p-g/2,endAngle:p+g/2,width:l,color:f,className:m,lineCap:"butt"})}))}
  `}static getVisualAngleFromParentTransform({angle:e,rotation:t=0,flipX:r=!1,flipY:s=!1}){const o=r?-1:1,a=s?-1:1,i=Va.degToRad(e),n=Va.degToRad(t),l=Math.cos(i),c=Math.sin(i),h=(l*Math.cos(n)-c*Math.sin(n))*o,d=(l*Math.sin(n)+c*Math.cos(n))*a;return Va.normalizeAngle(Va.radToDeg(Math.atan2(d,h)))}static resolveLabelGeometry({angle:e,rotation:t=0,flipX:r=!1,flipY:s=!1}){return{positionAngle:e,visualAngle:Va.getVisualAngleFromParentTransform({angle:e,rotation:t,flipX:r,flipY:s}),mirrored:r!==s}}static renderLabel(e){return"horizontal"===e.orientation?Va.renderHorizontalLabel(e):Va.renderColorStopLabel(e)}static renderHorizontalLabel({label:e,angle:t,cx:r,cy:s,radius:o,transformContext:a={}}){const i=Va.polarToCartesian(r,s,o,t),{rotation:n=0,flipX:l=!1,flipY:c=!1}=a,h=l?-1:1,d=c?-1:1;return F`
    <text
      x="${i.x}"
      y="${i.y}"
      text-anchor="middle"
      style="dominant-baseline:central;fill:var(--primary-text-color)"
      class="horseshoe-label"
      transform="
        translate(${i.x} ${i.y})
        scale(${h} ${d})
        rotate(${-n})
        translate(${-i.x} ${-i.y})
      "
    >
      ${e}
    </text>
  `}static buildTickValues(e,t,r){const s=[];for(let o=e;o<=t+1e-9;o+=r)s.push(Number(o.toFixed(10)));return s}static isMajorTick(e,t,r){const s=(e-t)/r;return Math.abs(s-Math.round(s))<1e-9}static renderLabelBadge(e){return"horizontal"===e.orientation?Va.renderHorizontalBadge(e):Va.renderArcBadge(e)}static renderArcLabelBadge({label:e,angle:t,cx:r,cy:s,radius:o,badge:a}){const i=String(e),n=Number(a.padding??2),l=Number(a.char_width??4),c=Number(a.width??i.length*l+2*n),h=Number(a.height??8),d=Math.max(0,c-h/2),u=Va.arcLengthToDegrees(d,o),m=Va.buildArcCapsulePath({cx:r,cy:s,radius:o,angle:t,arcSize:u,width:h});return F`
    <path
      class="horseshoe-colorstop-label-badge"
      d="${m}"
    />
  `}static renderArcBadge({label:e,angle:t,cx:r,cy:s,radius:o,badge:a}){const i=String(e),n=Number(a.padding??2),l=Number(a.char_width??4),c=Number(a.width??i.length*l+2*n),h=Va.arcLengthToDegrees(c,o);return Va.renderArcSegment({cx:r,cy:s,radius:o,startAngle:t-h/2,endAngle:t+h/2,width:Number(a.height??8),color:a.color??"var(--card-background-color)",className:"horseshoe-label-badge",lineCap:"round"})}static renderHorizontalBadge({label:e,angle:t,cx:r,cy:s,radius:o,badge:a}){const i=Va.polarToCartesian(r,s,o,t),n=String(e),l=Number(a.padding??4),c=Number(a.radius??Math.max(7,3*n.length+l));return F`
    <circle
      cx="${i.x}"
      cy="${i.y}"
      r="${c}"
      fill="${a.color??"var(--card-background-color)"}"
      stroke="${a.border_color??"none"}"
    />
  `}static getLabelBackgroundExtend({minLabel:e,maxLabel:t,charWidth:r,padding:s,radius:o}){const a=Math.max(String(e).length,String(t).length)*Number(r)+2*Number(s);return Va.arcLengthToDegrees(a/2,o)}static arcLengthToDegrees(e,t){return Number(e)/(2*Math.PI*t)*360}static textLengthToArcDegrees(e,t,r=6){return e/(2*Math.PI*t)*360+r}static resolveLabelAngles({angle:e,objectRotation:t=0,flipX:r=!1,flipY:s=!1}){const o=r?-1:1,a=s?-1:1,i=Va.degToRad(e),n=o*Math.cos(i),l=a*Math.sin(i),c=Va.normalizeAngle(Va.radToDeg(Math.atan2(l,n)));return{positionAngle:c,visualAngle:Va.normalizeAngle(c+t)}}static normalizeAngle(e){return(e%360+360)%360}static degToRad(e){return e*Math.PI/180}static radToDeg(e){return 180*e/Math.PI}static buildArcCapsulePath({cx:e,cy:t,radius:r,angle:s,arcSize:o,width:a}){const i=a/2,n=r+i,l=r-i,c=s-o/2,h=s+o/2,d=Va.polarToCartesian(e,t,n,c),u=Va.polarToCartesian(e,t,n,h),m=Va.polarToCartesian(e,t,l,h),p=Va.polarToCartesian(e,t,l,c),g=o>180?1:0;return`\n    M ${d.x} ${d.y}\n    A ${n} ${n} 0 ${g} 1 ${u.x} ${u.y}\n    A ${i} ${i} 0 0 1 ${m.x} ${m.y}\n    A ${l} ${l} 0 ${g} 0 ${p.x} ${p.y}\n    A ${i} ${i} 0 0 1 ${d.x} ${d.y}\n    Z\n  `}}class Da{static cache=new Map;static load(e){if(this.cache.has(e))return this.cache.get(e);const t=fetch(e).then((async t=>{if(!t.ok)throw new Error(`Could not load palette: ${e}`);return t.json()}));return this.cache.set(e,t),t}static async loadAll(e={}){const t=await Promise.all(Object.entries(e||{}).map((async([e,t])=>[e,await this.load(t)])));return Object.fromEntries(t)}static apply(e,t,r){Object.entries(t.ref).forEach((([t,r])=>{e.style.setProperty(`--${t}`,r)})),Object.entries(t.modes[r]).forEach((([t,r])=>{e.style.setProperty(`--${t}`,r)}))}static applyAll(e,t,r){Object.entries(t).forEach((([,t])=>{this.apply(e,t,r)}))}}console.info("%c FLEX-HORSESHOE-CARD %c Version 5.4.7-dev.8 ","color: white; font-weight: bold; background: darkgreen","color: darkgreen; font-weight: bold; background: white");const Ra={action:"more-info"},La={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed",scale_style:"fixed"};class Ha extends ne{constructor(){if(super(),Yo.setElement(this),this.palettesLoaded=!1,this.cardId=Math.random().toString(36).substr(2,9),this._hass=void 0,this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.viewBoxSize=Qo,this.viewBox={width:Qo,height:Qo},this.colorStops={},this.animations={},this.animations.vlines={},this.animations.hlines={},this.animations.circles={},this.animations.icons={},this.animations.iconsIcon={},this.animations.names={},this.animations.areas={},this.animations.states={},this.resolvedEntityConfigs=[],this.colorCache={},this.isAndroid=!1,this.isSafari=!1,this.iOS=!1,this.resolvedVariables={},this.iconCache={},this.iconsSvg=[],this.pendingIconPath=[],this.iconsId=[],this.svgUrlCache||={},this.theme={},this.theme.checked=!1,this.theme.isLoaded=!1,this.theme.modeChanged=!1,this.theme.darkMode=!1,this.theme.light={},this.theme.dark={},this.palettes={},this.bar_mode="normal",this.dev={debug:!1},this.isAndroid=!!window.navigator.userAgent.match(/Android/),!this.isAndroid){const e=window.navigator.userAgent||"",t=e.toLowerCase(),r=window.navigator.platform||"",s=(/iPad|iPhone|iPod/.test(e)||"MacIntel"===r&&window.navigator.maxTouchPoints>1)&&!window.MSStream,o=e.match(/Version\/(\d+)(?:\.[\d.]+)?.*Safari/i),a=o?Number(o[1]):void 0,i=t.match(/\bos\s+(\d+)(?:[._]\d+)*.*like safari/),n=t.match(/\bios\s+(\d+)(?:[._]\d+)*/),l=n?Number(n[1]):i?Number(i[1]):void 0,c=Number.isFinite(a),h=Number.isFinite(l)&&t.includes("like safari"),d=c?a:h?l:void 0;this.iOS=s,this.isSafari=Number.isFinite(d),this.safariMajorVersion=d,this.isHomeAssistantLikeSafari=h,this.isRealSafari=c,this.isSafari14=this.isSafari&&14===d,this.isSafari15=this.isSafari&&15===d,this.isSafari16=this.isSafari&&16===d,this.isSafari17=this.isSafari&&17===d,this.isSafari18=this.isSafari&&18===d,this.isSafari26=this.isSafari&&26===d,this.isSafari27=this.isSafari&&27===d,this.isSafari28=this.isSafari&&28===d,this.isSafari29=this.isSafari&&29===d,this.isSafari30=this.isSafari&&30===d,this.isSafariGte16=this.isSafari&&d>=16,this.dev?.debug&&console.log("browser detection",{ua:e,isAndroid:this.isAndroid,isIOS:this.iOS,isSafari:this.isSafari,isRealSafari:this.isRealSafari,isHomeAssistantLikeSafari:this.isHomeAssistantLikeSafari,safariMajorVersion:this.safariMajorVersion,isSafariGte16:this.isSafariGte16}),this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config)}}static get styles(){return a`
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
    `}_resolveEntityConfigs(e){return e?.dev?.debug&&console.log("resolving entity config for",e?.entities),e?.entities?.map(((e,t)=>{const r={entity_index:t};return Ie.getJsTemplateOrValue(r,e)}))??[]}_buildMyIcon(e,t,r,s){if(!e||!t)return;if(s)return s;if(r?.icon)return r.icon;if(t.icon)return t.icon;const o=t.entity,a=t.attribute,i=a?e.attributes?.[a]:void 0,n=e.entity_id?.split(".")[0];if(e.attributes?.icon&&!a)return e.attributes.icon;if(a&&"weather"===n){const e=ra[a];if(e)return e}this.entitiesIcon??={},this.entitiesIconKey??={},this.entitiesIconPending??={};const l=a?`${o}|attribute:${a}`:`${o}|state`,c=a?[o,"attribute",a,i??"",n??"",e.attributes?.device_class??"",e.attributes?.icon??""].join("|"):[o,"state",e.state??"",n??"",e.attributes?.device_class??"",e.attributes?.icon??""].join("|");if(this.entitiesIconKey[l]===c)return this.entitiesIcon[l];if(this.entitiesIconKey[l]=c,!this.entitiesIconPending[l]){this.entitiesIconPending[l]=!0;const t=a?(async(e,t,r,s)=>{let o;const a=Qe(t),i=t.attributes.device_class,n=e.entities?.[t.entity_id],l=n?.platform,c=n?.translation_key,h=s??t.attributes[r];if(c&&l){const t=await rt(e.config,e.connection,l);t&&(o=at(h,t[a]?.[c]?.state_attributes?.[r]))}if(!o){const t=await st(e.connection,e.config,a);if(t){const e=i&&t[i]?.state_attributes?.[r]||t._?.state_attributes?.[r];o=at(h,e)}}return o})(this._hass,e,a,void 0!==i?String(i):void 0):(async(e,t,r,s,o)=>{const a=e?.[s.entity_id];if(a?.icon)return a.icon;const i=Qe(s);return it(t,r,i,s,o,a)})(this._hass.entities,this._hass.config,this._hass.connection,e);t.then((e=>{this.entitiesIconKey[l]===c&&e&&this.entitiesIcon[l]!==e&&(this.entitiesIcon[l]=e,this.requestUpdate())})).catch((e=>{console.error(a?"_buildMyIcon attributeIcon failed":"_buildMyIcon entityIcon failed",o,a??"",e)})).finally((()=>{this.entitiesIconPending[l]=!1}))}return this.entitiesIcon[l]}_formatEntityStateParts(e,t){const r=void 0!==t.attribute,s=t.format||{};let o=r?e.attributes[t.attribute]:e.state;if(!0===s.raw_state_keep)return!0===s.raw_state_clean&&"string"==typeof o&&(o=o.replace(/_/g," ")),[{type:"value",value:o}];const a=r?this._hass.formatEntityAttributeValueToParts(e,t.attribute):this._hass.formatEntityStateToParts(e,this._buildState(e.state,t));let i;if(!Number.isNaN(Number(o))&&null!==o&&""!==o){const e=s.locale||this._hass.locale?.language||this._hass.language||"en-US",r=a.find((e=>"value"===e.type));let l;if(r&&void 0!==r.value&&null!==r.value){const e=String(r.value),t=Math.max(e.lastIndexOf("."),e.lastIndexOf(","));l=-1!==t?e.length-t-1:0}const c=s.decimals_max??(void 0!==l?l:void 0!==t.decimals?Number(t.decimals):2);let h=s.decimals_min??(void 0!==l?l:void 0!==t.decimals?Number(t.decimals):0);h>c&&(h=c);const d={useGrouping:!1!==s.separator,minimumFractionDigits:h,maximumFractionDigits:c};try{i=new Intl.NumberFormat(e,d).format(Number(o))}catch(n){console.error("Error formatting numeric state inside parts:",n)}}return a.map((e=>"value"===e.type&&void 0!==i?{...e,value:i}:"unit"===e.type&&void 0!==t.unit?{...e,value:t.unit}:e))}themeIsDarkMode(){return!0===this.theme.darkMode}themeIsLightMode(){return!1===this.theme.darkMode}set hass(e){this.setHass(e)}setHass(e,t=!1){this._hass=e,Ie.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes});let r=t;const s=e.selectedTheme||e.themes.theme||"",o=!0===e.themes.darkMode;if(this.theme.nameChanged=this.theme.name!==s,this.theme.modeChanged=this.theme.darkMode!==o,this.theme.nameChanged||this.theme.modeChanged){this.theme.name=s,this.theme.darkMode=o,Yo.colorCache={};const e=this.hass?.themes?.darkMode?"dark":"light";Da.applyAll(this,this.palettes,e),this.horseshoeGauges?.forEach((e=>e.clearPathItemCache()))}if(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.resolvedEntityConfigs.forEach(((t,s)=>{const o=e.states[t.entity];if(!o)return;this.entities[s]=o;const a=this._buildState(o.state,t);if(Qe(o),a!==this.entitiesStr[s]&&(this.entitiesStr[s]=a,r=!0),t.attribute&&Object.prototype.hasOwnProperty.call(o.attributes,t.attribute)){const e=this._buildState(o.attributes[t.attribute],t);e!==this.attributesStr[s]&&(this.attributesStr[s]=e,r=!0)}})),r){if(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.horseshoeGauges=this.horseshoeGauges.map((e=>{const t=e.entity_index??0,r=this.resolvedEntityConfigs[t],s=this.entities[t];return s&&r?(e.setState(s,r),e):e})),this.horseshoes=this.horseshoes.map(((e,t)=>{const r=e.entity_index??0,s=this.resolvedEntityConfigs[r],o=this.entities[r];if(!o||!s)return e;let a=o.state;s.attribute&&void 0!==o.attributes[s.attribute]&&(a=o.attributes[s.attribute]);const i=this._getStateMapItem(e.horseshoe_state,o);i&&(a=i.value);const n=Ie.getJsTemplateOrValue({entity_index:r},e.horseshoe_scale),l=n?.min??0,c=n?.max??100;let h,d,u=!1;if("bidirectional"===(e.bar_mode||"normal")){this?.dev?.debug_bidirectional&&console.log("<debug_bidirectional> Set hass: Card ",this.cardId,"bidirectional aset as barmode");const t=e.horseshoePathLength;let r=Number(a);if(this?.dev?.debug_invert_state&&(r=-Number(a)),r>=0){this?.dev?.debug_bidirectional&&console.log("<debug_bidirectional> Set hass: Card ",this.cardId,"Postive state: ",r);const s=Math.min(Yo.calculateValueBetween(0,c,r),1)*(t/2);h=`${s} ${e.circlePathLength-s}`,d=void 0,u=!1}else{this?.dev?.debug_bidirectional&&console.log("<debug_bidirectional> Set hass: Card ",this.cardId,"Negative state: ",r);const s=(1-Math.min(Yo.calculateValueBetween(l,0,r),1))*(t/2);h=`${s} ${e.circlePathLength-s}`,d=""+-(e.circlePathLength-s),u=!0}}else{h=`${Math.min(Yo.calculateValueBetween(l,c,a),1)*e.horseshoePathLength} ${10*e.radiusSize}`,d=void 0,u=!1}const m=Math.min(Yo.calculateValueBetween(l,c,a),1),p=e.show.horseshoe_style;let g=e.color0,f=e.color1,b=e.color1_offset,y=e.angleCoords,v=e.stroke_color;if("fixed"===p)v=e.horseshoe_state.color,g=e.horseshoe_state.color,f=e.horseshoe_state.color,b="0%";else if("autominmax"===p){const t=Yo.calculateStrokeColor(a,e.colorStopsMinMax,!0);g=t,f=t,b="0%"}else if("colorstop"===p||"colorstopgradient"===p){const t=Yo.calculateStrokeColor(a,e.colorStops,"colorstopgradient"===p);g=t,f=t,b="0%"}else"lineargradient"===p&&(y={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},b=`${Math.round(100*(1-m))}%`);return{...e,horseshoe_scale:{...e.horseshoe_scale,...n},dashArray:h,dashOffset:d,bidirectional_negative:u,stroke_color:v,color0:g,color1:f,color1_offset:b,angleCoords:y}})),this.horseshoes.length>0){const e=this.horseshoes[0];this.dashArray=e.dashArray,this.dashOffset=e.dashOffset,this.bidirectional_negative=e.bidirectional_negative,this.stroke_color=e.stroke_color,this.color0=e.color0,this.color1=e.color1,this.color1_offset=e.color1_offset,this.angleCoords=e.angleCoords}this.config.animations&&Object.keys(this.config.animations).map((e=>{const t=e.substr(Number(e.indexOf(".")+1));return this.config.animations[e].map((e=>this.entities[t].state.toLowerCase()===e.state.toLowerCase()&&(e.vlines&&e.vlines.forEach((e=>this._updateAnimationStyles("vlines",e))),e.hlines&&e.hlines.forEach((e=>this._updateAnimationStyles("hlines",e))),e.circles&&e.circles.forEach((e=>this._updateAnimationStyles("circles",e))),e.icons&&e.icons.forEach((e=>{const t=e.animation_id;this.animations.icons[t]&&e.reuse||(this.animations.icons[t]={},this.animations.iconsIcon[t]={});const r=Ie.getJsTemplateOrValue(e,e.styles),s=ze.toStyleDict(r);this.animations.icons[t]={...this.animations.icons[t],...s},this.animations.iconsIcon[t]=Ie.getJsTemplateOrValue(e,e.icon)})),e.states&&e.states.forEach((e=>this._updateAnimationStyles("states",e))),!0))),!0})),Ie.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),this.theme.modeChanged=!1,this.requestUpdate()}}_updateAnimationStyles(e,t){const r=t.animation_id;if(null==r)return;const s=Ie.getJsTemplateOrValue(t,t.styles),o=ze.toStyleDict(s);this.animations[e][r]={...t.reuse?this.animations[e][r]??{}:{},...o}}_prepareItemColorStops(e){["states","names","areas","circles","hlines","vlines","icons","horseshoes","horseshoes_v2"].forEach((t=>{const r=e.layout?.[t];Array.isArray(r)&&r.forEach((e=>{if(!e.color_stops)return;const t=Ie.getJsTemplateOrValue(e,e.color_stops,{resolveKeys:!0});e._colorStops=Pe.normalize(t)}))}))}_calculateSvgCoordinatesInGroup(e){const t={xpos:ea.calculateSvgDimension(e.xpos),ypos:ea.calculateSvgDimension(e.yposc||e.ypos)},r=this.config.layout?.groups?.[e.group];if(!e.group||!r)return t;return{xpos:ea.calculateSvgDimension(r.xpos+e.xpos-50),ypos:ea.calculateSvgDimension(r.ypos+(e.yposc||e.ypos)-50)}}_computeGroupDimensions(e){const t=e.layout?.groups;t&&Object.entries(t).forEach((([e,t])=>{t.svg={xpos:ea.calculateSvgDimension(t.xpos),ypos:ea.calculateSvgDimension(t.ypos)}}))}_computeSvgDimensions(e){const t=e.layout;t?.names&&t.names.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.states&&t.states.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.areas&&t.areas.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.icons&&t.icons.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.hlines&&t.hlines.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.length=ea.calculateSvgDimension(e.length)})),t?.vlines&&t.vlines.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.length=ea.calculateSvgDimension(e.length)})),t?.circles&&t.circles.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.radius=e.radius})),this?.horseshoes&&this.horseshoes.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.radius=ea.calculateSvgDimension(e.radius),e.svg.tickmarksRadius=ea.calculateSvgDimension(e.tickmarks_radius),e.svg.rotateX=e.svg.xpos,e.svg.rotateY=e.svg.ypos}))}_isStaticCalc(e){return"string"==typeof e&&e.startsWith("calc(")&&e.endsWith(")")}_evaluateStaticCalc(e,t={}){const r=e.slice(5,-1).trim();if(!/^[0-9+\-*/().,\sA-Za-z_]+$/.test(r))throw new Error(`Invalid static calc expression '${e}'`);const s={...t,sin:Math.sin,cos:Math.cos,tan:Math.tan,abs:Math.abs,round:Math.round,floor:Math.floor,ceil:Math.ceil,min:Math.min,max:Math.max,sqrt:Math.sqrt,PI:Math.PI},o=Function(...Object.keys(s),`"use strict"; return (${r});`)(...Object.values(s));if(!this._isStaticNumber(o))throw new Error(`Static calc expression '${e}' did not return a finite number`);return o}_isStaticNumber(e){return"number"==typeof e&&Number.isFinite(e)}_getStateMapItem(e,t){const r=e?.state_map?.map;if(!r)return;const s=t?.state;return r.find((e=>e.state===s))??r.find((e=>"default"===e.state))}_applySameAsDeltas(e,t,r){return Object.entries(e).forEach((([e,s])=>{if(!e.startsWith("same_as_d"))return;const o=e.substring(9);if(!o)throw new Error(`Invalid same_as delta field '${e}' for item ${r}`);if(void 0===t[o])throw new Error(`same_as delta '${e}' requires '${o}' for item ${r}`);if(!this._isStaticNumber(t[o]))throw new Error(`same_as delta '${e}' requires numeric '${o}' for item ${r}`);if(!this._isStaticNumber(s))throw new Error(`same_as delta '${e}' must be numeric for item ${r}`);t[o]+=s})),t}_mergeSameAsItem(e,t,r="merge",s){const o=ta.mergeDeep(e,t);return Object.entries(t).forEach((([t,a])=>{const i=a?.same_as_merge??r,n=a?.same_as_key??s;if("replace"!==i){if("keyed"===i){if(!n)throw new Error(`same_as_key is required when same_as_merge is keyed for field '${t}'`);const{same_as_merge:r,same_as_key:s,...i}=a;o[t]=ta.mergeDeep(e[t]??{},i),Object.entries(i).forEach((([r,s])=>{Array.isArray(e[t]?.[r])&&Array.isArray(s)&&(o[t][r]=this._mergeListByKey(e[t][r],s,n))}))}}else{const{same_as_merge:e,same_as_key:r,...s}=a;o[t]=s}})),o}_mergeSameAsKeyed(e,t,r){const s=ta.mergeDeep(e,t);if(!r)throw new Error("same_as_key is required when same_as_merge is keyed");return Object.keys(t).forEach((o=>{Array.isArray(e[o])&&Array.isArray(t[o])&&(s[o]=this._mergeListByKey(e[o],t[o],r))})),s}_mergeListByKey(e,t,r){const s=new Map;return e.forEach((e=>{s.set(String(e[r]),e)})),t.forEach((e=>{const t=String(e[r]);s.has(t)?s.set(t,ta.mergeDeep(s.get(t),e)):s.set(t,e)})),[...s.values()]}_resolveSameAsItems(e){const t=new Map;return e.map(((e,r)=>{let s;if(void 0===e.same_as)s=e;else{const o=t.get(String(e.same_as));if(!o)throw new Error(`same_as '${e.same_as}' not found for item ${r}`);const{same_as:a,same_as_replace:i=[],...n}=e,l={...o};i.forEach((e=>{delete l[e]})),s=ta.mergeDeep(l,n),s=this._applySameAsDeltas(e,s),delete s.same_as,delete s.same_as_replace,Object.keys(s).filter((e=>e.startsWith("same_as_d"))).forEach((e=>delete s[e]))}return t.set(String(s.id),s),s}))}_resolveSectionSameAs(e){["horseshoes","horseshoes_v2","states","names","areas","circles","hlines","vlines","icons"].forEach((t=>{const r=e.layout?.[t];Array.isArray(r)&&(e.layout[t]=this._resolveSameAsItems(r))}))}_assignIdItems(e){return e.map(((e,t)=>({...e,id:String(e.id??t)})))}_assignSectionIds(e){["horseshoes","horseshoes_v2","states","names","areas","circles","hlines","vlines","icons"].forEach((t=>{const r=e.layout?.[t];Array.isArray(r)&&(e.layout[t]=this._assignIdItems(r))}))}_isStaticRef(e){return"string"==typeof e&&e.startsWith("ref(")&&e.endsWith(")")}_cloneStaticValue(e){return e&&"object"==typeof e?ta.mergeDeep(Array.isArray(e)?[]:{},e):e}_evaluateConstants(e){const t=e.constants;if(!t||"object"!=typeof t)return{};const r={};return Object.entries(t).forEach((([e,s])=>{t[e]=this._evaluateStaticConfig(s,r),this._isStaticNumber(t[e])&&(r[e]=t[e])})),r}_resolveStaticRef(e,t){if(!this._isStaticRef(e))return e;const r=e.slice(4,-1).trim();if(!(r in t))throw new Error(`Static ref '${r}' not found`);return this._cloneStaticValue(t[r])}_resolveStaticRefs(e,t={}){return this._isStaticRef(e)?this._resolveStaticRef(e,t):Array.isArray(e)?e.map((e=>this._resolveStaticRefs(e,t))):e&&"object"==typeof e?(Object.entries(e).forEach((([r,s])=>{e[r]=this._resolveStaticRefs(s,t)})),e):e}_evaluateStaticConfig(e,t={}){return this._isStaticCalc(e)?this._evaluateStaticCalc(e,t):Array.isArray(e)?e.map((e=>this._evaluateStaticConfig(e,t))):e&&"object"==typeof e?(Object.entries(e).forEach((([r,s])=>{e[r]=this._evaluateStaticConfig(s,t)})),e):e}setConfig(e){try{if(e=JSON.parse(JSON.stringify(e)),this.dev={...e.dev},!e.entities)throw Error("No entities defined");if(!e.layout)throw Error("No layout defined");e?.palettes&&(this.palettesLoaded=!1,Da.loadAll(e?.palettes).then((e=>{this.palettes=e;const t=this.hass?.themes?.darkMode?"dark":"light";Yo.setElement(this),Da.applyAll(this,e,t),Yo.colorCache={},this.palettesLoaded=!0,this.horseshoeGauges?.forEach((e=>e.clearPathItemCache())),this.setHass(this._hass,!0),this.requestUpdate()}))),this._assignSectionIds(e);const t=this._evaluateConstants(e);this._resolveStaticRefs(e,e.constants),this._evaluateStaticConfig(e,t),this._resolveSectionSameAs(e),Ie.setContext({hass:this._hass,config:e,entities:this.entities,horseshoes:this.horseshoes});const r=this._resolveEntityConfigs(e);if(r){if("sensor"!==De(r[0].entity)&&r[0].attribute&&!isNaN(r[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}r.forEach((e=>{e.tap_action||(e.tap_action={...Ra})}));const s={texts:[],card_filter:"card--filter-none",bar_mode:e.bar_mode||"normal",...e,show:{...La,...e.show}};this.horseshoes=na.setConfig(e,Ie),this.horseshoeGauges=ja.setConfig(e,Ie,this.cardId,this);const o=this.horseshoes?.[0];o&&(this.colorStops=o.colorStops,this.colorStopsMinMax=o.colorStopsMinMax,this.color0=o.color0,this.color1=o.color1,this.angleCoords=o.angleCoords,this.color1_offset=o.color1_offset),this._prepareItemColorStops(s),this.config=s,this.bar_mode=s.bar_mode||"normal",this.config.layout?.icons&&this.config.layout.icons.forEach(((e,t)=>{this.iconsId[t]=Math.random().toString(36).substr(2,9)})),this.aspectratio=(this.config.layout.aspectratio||this.config.aspectratio||"1/1").trim();const a=this.aspectratio.split("/");this.viewBox||(this.viewBox={}),this.viewBox.width=a[0]*Ko,this.viewBox.height=a[1]*Ko,this._computeGroupDimensions(this.config),this._computeSvgDimensions(this.config),Ie.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes})}catch(t){throw console.error("[FHC setConfig] CONFIG ERROR",{error:t,message:t?.message,stack:t?.stack,rawConfig:e,horseshoes:this.horseshoes}),t}}_getItemStateValue(e={}){const t=e.entity_index??0,r=this.entities?.[t],s=this.config?.entities?.[t];if(!r)return;const o=s?.attribute;return o&&r.attributes&&void 0!==r.attributes[o]?r.attributes[o]:r.state}_getItemColorFromStops(e={}){if(!e._colorStops)return;const t=this._getItemStateValue(e),r=Number(t);return Number.isFinite(r)?Yo.calculateStrokeColor(r,e._colorStops,!0===e.colorstop_gradient):void 0}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback()}render({config:e}=this){const t=Ie.getJsTemplateOrValue({entity_index:0},e?.styles),r=ze.toStyleDict(t);return G`
      <ha-card @click=${e=>this.handlePopup(e,this.entities[0])} style=${me(r)}>
        <div class="container" id="container">${this._renderSvg()}</div>

        <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
          ${this.horseshoes?.map(((e,t)=>F`
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
    `}_renderOriginalTickMarks(e,t){if(!1===e.show?.scale_tickmarks)return F``;const r=e.horseshoe_scale,s=Number(r.min),o=Number(r.max),a=o-s;if(!a)return F``;const i={entity_index:e.entity_index},n=Ie.getJsTemplateOrValue(i,e?.horseshoe_tickmarks?.styles),l=ze.toStyleDict(n),c=e.svg.xpos,h=e.svg.ypos,d={transformOrigin:`${c}px ${h}px`};void 0!==e?.horseshoe_tickmarks?.fill&&(d.fill=e.horseshoe_tickmarks.fill);const u=r.color||"var(--primary-background-color)";d.fill=u;const m={...l,...d},p=r.ticksize||a/10,g=e.arc_degrees||260,f=r.width?r.width/2:3,b=s%p,y=s+(0===b?0:p-b);if(y>o)return F``;const v=Math.floor((o-y)/p)+1,_=Array.from({length:v},((t,r)=>{const o=(g/2-(y+r*p-s)/a*g)*Math.PI/180;return F`
      <circle
        cx="${c-Math.sin(o)*e.tickmarksRadiusSize}"
        cy="${h-Math.cos(o)*e.tickmarksRadiusSize}"
        r="${f}"
        style=${me(m)}>
      </circle>
    `}));return F`${_}`}_renderSvg(){const e=this.config.card_filter?this.config.card_filter:"card--filter-none";return F`
        <svg xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
            class="${e}"
          viewBox='0 0 ${this.viewBox.width} ${this.viewBox.height}'>
            <g id="circles" class="circles">
              ${this._renderCircles()}
            </g>
          ${this._renderHorseShoes()}
${this._renderHorseshoeGauges()}          
            <g id="datagroup" class="datagroup">
              ${this._renderHorizontalLines()}
              ${this._renderVerticalLines()}
              ${this._renderIcons()}
              ${this._renderEntityAreas()}
              ${this._renderEntityNames()}
              ${this._renderEntityStates()}
            </g>
        </svg>
      `}_renderHorseshoeGauges(){return F`
    ${this.horseshoeGauges?.map((e=>e.render()))??F``}
  `}_renderHorseShoes(){return"legacy"===this.config?.layout?.horseshoes_v2?F``:F`
    ${this.horseshoes?.map(((e,t)=>this._renderHorseShoe(e,t)))??F``}
  `}_renderHorseShoe(e,t){if(!1===e.show?.horseshoe)return F``;const r=e.svg.xpos,s=e.svg.ypos,o=e.svg.rotateX,a=e.svg.rotateY,i=e.bar_mode||"normal",n=`${e.svg.radius}px`,l=e.horseshoe_scale.color||"#000000",c=e.horseshoe_scale.width||6,h=e.horseshoe_state.width||12,d=-90-(e.arc_degrees??260)/2,u=`${e.horseshoePathLength},${e.circlePathLength}`,m=`horseshoe__gradient-${this.cardId}-${t}`,p={entity_index:e.entity_index},g=Ie.getJsTemplateOrValue(p,e.horseshoe_scale?.styles),f=ze.toStyleDict(g),b={stroke:l,strokeWidth:c,strokeDasharray:u,strokeLinecap:"round"};void 0!==e.horseshoe_scale?.fill&&(b.fill=e.horseshoe_scale.fill);const y={fill:"none","stroke-linecap":"round",...f,...b},v=Ie.getJsTemplateOrValue(p,e.horseshoe_state?.styles),_=ze.toStyleDict(v),x={stroke:`url('#${m}')`,strokeDasharray:e.dashArray,strokeDashoffset:e.dashOffset,strokeWidth:h};void 0!==e.horseshoe_state?.fill&&(x.fill=e.horseshoe_state.fill);const w={fill:"none",transition:"all 2.5s ease-out",strokeLinecap:"round",..._,...x},$=e.rotate?`rotate(${e.rotate})`:"",k={};void 0!==y.opacity&&(k.opacity=y.opacity),void 0!==y.animation&&(k.animation=y.animation);const S=Ie.getJsTemplateOrValue(p,e.horseshoe_labels?.background?.styles),M={...ze.toStyleDict(S)},A=Ie.getJsTemplateOrValue(p,e.horseshoe_labels?.badges?.styles),C={...ze.toStyleDict(A)},N=Ie.getJsTemplateOrValue(p,e.horseshoe_labels?.styles),E={...ze.toStyleDict(N)},T=Ie.getJsTemplateOrValue(p,e.horseshoe_tickmarks?.ticks_major?.styles),z={...ze.toStyleDict(T)},I=Ie.getJsTemplateOrValue(p,e.horseshoe_tickmarks?.ticks_minor?.styles),P={...ze.toStyleDict(I)},O="bidirectional"===i?-90:d;return this?.dev?.debug_bidirectional&&console.log("<debug_bidirectional> Render Horseshoe: Card ",this.cardId,"barMode: ",i),F`
      <g id="horseshoe__svg__group-${t}" class="horseshoe__svg__group"
        transform="${$} ${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
      >
        <g style=${me(k)}>
          ${this._renderHorseshoeScale(e,t)}
        </g>

        <g style=${me(M)}>
          ${this._renderHorseshoeLabelBackground(e,t)}
        </g>

        <g>
          <circle id="horseshoe__state__value-${t}" class="horseshoe__state__value"
            cx="${r}px" cy="${s}px" r="${n}"
            transform="rotate(${O} ${o} ${a})"
            style=${me(w)} />
          ${this._renderOriginalTickMarks(e,t)}
        </g>

        <g style=${me(P)}>
          ${this._renderHorseshoeTicks(e,t,"ticks_minor")}
        </g>

        <g style=${me(z)}>
          ${this._renderHorseshoeTicks(e,t,"ticks_major")}
        </g>

        <g style=${me(C)}>
          ${this._renderHorseshoeLabelBadges(e,t)}
        </g>

        <g style=${me(E)}>
          ${this._renderHorseshoeLabels(e,t,$)}
        </g>
      </g>
    `}_renderEntityName(e){const t=e.entity_index??0,r=Ie.getJsTemplateOrValue(e,e.styles),s={"font-size":"1.5em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...ze.toStyleDict(r)},o={...this.animations?.names?.[e.animation_id]??{}},a=this._getItemColorFromStops(e);a&&(o.stroke=a);const i={...s,...o},n=this.textEllipsis(this._buildName(this.entities[e.entity_index],this.resolvedEntityConfigs[e.entity_index]),e?.max_characters??e?.ellipsis);return F`
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
        `}_renderEntityNames(){const{layout:e}=this.config;if(!e?.names)return F``;const t=e.names.map((e=>this._renderEntityName(e)));return F`${t}`}_renderEntityArea(e){const t=e.entity_index??0,r=Ie.getJsTemplateOrValue(e,e.styles),s={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...ze.toStyleDict(r)},o={...ze.toStyleDict(this.animations?.areas?.[e.animation_id]??{})},a=this._getItemColorFromStops(e);a&&(o.stroke=a);const i={...s,...o},n=this.textEllipsis(this._buildArea(this.entities[e.entity_index],this.resolvedEntityConfigs[e.entity_index]),e?.max_characters??e?.ellipsis);return F`
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
      `}_renderEntityAreas(){const{layout:e}=this.config;if(!e?.areas)return F``;const t=e.areas.map((e=>this._renderEntityArea(e)));return F`${t}`}_getGroupScaleTransform(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;if(!t?.scale&&!e?.flip)return"";const r=t?.scale?.x??t?.scale??1,s=t?.scale?.y??t?.scale??1;return`scale(${r*("x"===e?.flip||"both"===e?.flip?-1:1)}, ${s*("y"===e?.flip||"both"===e?.flip?-1:1)})`}_getGroupScaleStyle(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;return t?.scale&&t.svg?`transform-origin:${t.svg.xpos}px ${t.svg.ypos}px; transform-box:view-box;`:`transform-origin:${e.svg.xpos}px ${e.svg.ypos}px; transform-box:view-box;`}_renderEntityState(e){if(!e)return F``;const t=e.entity_index??0,r=e.svg.xpos??Zo,s=e.svg.ypos??Zo,o=e.dx?e.dx:"0",a=e.dy?e.dy:"0",i=Ie.getJsTemplateOrValue(e,e.styles),n=ze.toStyleDict(i),l=e.uom??{},c=Ie.getJsTemplateOrValue(e,l.styles),h=ze.toStyleDict(c),d=l.dx??"0.1",u=l.dy??"-0.45";let m={};this.animations?.states?.[e.animation_id]&&(m={...this.animations.states[e.animation_id]});const p=this._getItemColorFromStops(e);p&&(m.fill=p);const g={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...n,...m},f=g["font-size"];let b=.5,y="em";const v=String(f).trim().match(/^(\d*\.?\d+)([a-z%]+)$/i);v?(b=.6*Number(v[1]),y=v[2]):console.error("Cannot determine font-size for state",f);const _={"font-size":`${b}${y}`},x={...g,opacity:"0.7",..._,...h},w=this.entities[t],$=this.resolvedEntityConfigs[t]??{},k=this._formatEntityStateParts(w,$);let S="",M="";k.forEach((e=>{"unit"===e.type?M+=e.value:"value"===e.type&&(S+=e.value)})),S=S.trim(),M=M.trim();const A=this._buildUom(w,$,M);return F`
      <g
        transform="${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
        <text @click=${e=>this.handlePopup(e,this.entities[t])}>
          <tspan
            class="state__value"
            x="${r}"
            y="${s}"
            dx="${o}em"
            dy="${a}em"
            style=${me(g)}
          >${S}</tspan><tspan
            class="state__uom"
            dx="${d}em"
            dy="${u}em"
            style=${me(x)}
          >${A}</tspan>
        </text>
      </g>
    `}_renderEntityStates(){const{layout:e}=this.config;if(!e)return;if(!e.states)return;const t=e.states.map((e=>F`
            ${this._renderEntityState(e)}
          `));return F`${t}`}updated(e){super.updated?.(e),this._injectSvgUrlIcons()}_isSvgUrl(e){return e.endsWith(".svg")}_isUrlIcon(e){return"string"==typeof e&&/^url\(['"]?.+['"]?\)$/i.test(e.trim())}_renderCachedSvgUrlIcon(e,t,r,s,o,a,i,n){const l=this.svgUrlCache[r].cloneNode(!0),c=e.rotate??0,h=o/24,d=a-o*n+12*h,u=i-.5*o-(e.yposc?0:.25*o)+12*h;return l.classList.remove("hidden"),F`
    <g
      transform="${this._getGroupScaleTransform(e)}"
      style="${this._getGroupScaleStyle(e)}"
    >
      <g
        class="icon-position"
        transform="translate(${d} ${u})"
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

        <g class="icon-style-animation" style="${me(s)}">
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
  `}_getUrlFromCssUrl(e){return e.trim().replace(/^url\(['"]?/i,"").replace(/['"]?\)$/,"")}_renderSvgUrlPlaceholder(e,t,r,s,o,a){const i=e.rotate??0,n=r/24,l=s-r*a+12*n,c=o-.5*r-(e.yposc?0:.25*r)+12*n;return F`
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
  `}_injectSvgUrlIcons(){const e=this.shadowRoot.querySelectorAll("svg.icon-svg-url[data-src]:not(.injected-svg)");e.length&&function(e,t){var r=void 0===t?{}:t,s=r.afterAll,o=void 0===s?function(){}:s,a=r.afterEach,i=void 0===a?function(){}:a,n=r.beforeEach,l=void 0===n?function(){}:n,c=r.cacheRequests,h=void 0===c||c,d=r.evalScripts,u=void 0===d?"never":d,m=r.httpRequestWithCredentials,p=void 0!==m&&m,g=r.renumerateIRIElements,f=void 0===g||g;if(e&&"length"in e)for(var b=0,y=0,v=e.length;y<v;y++){var _=e[y];_&&Te(_,u,f,h,p,l,(function(t,r){i(t,r),e&&"length"in e&&e.length===++b&&o(b)}))}else e?Te(e,u,f,h,p,l,(function(t,r){i(t,r),o(1),e=null})):o(0)}(e,{beforeEach(e){e.removeAttribute("height"),e.removeAttribute("width")},afterEach:(e,t)=>{if(e||!t)return;const r=t.dataset.src;r&&(this.svgUrlCache[r]=t.cloneNode(!0))},afterAll:()=>{this.requestUpdate()},cacheRequests:!1,evalScripts:"once",httpRequestWithCredentials:!1,renumerateIRIElements:!1})}_renderSvgUrlIcon(e,t,r,s,o,a,i,n){return this.svgUrlCache[r]?this._renderCachedSvgUrlIcon(e,t,r,s,o,a,i,n):this._renderSvgUrlPlaceholder(e,r,o,a,i,n)}_renderImageUrlIcon(e,t,r,s,o,a,i,n){const l=e.rotate??0,c=o/24,h=a-o*n+12*c,d=i-.5*o-(e.yposc?0:.25*o)+12*c;return F`
    <g
      transform="${this._getGroupScaleTransform(e)}"
      style="${this._getGroupScaleStyle(e)}"
    >
      <g
        class="icon-position"
        transform="translate(${h} ${d})"
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

        <g class="icon-style-animation" style="${me(s)}">
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
  `}computeEntityColor(e){if(!e||"off"===e.state||"unavailable"===e.state||"unknown"===e.state)return"var(--state-icon-color)";const t=e.state;if(!isNaN(t)||t.endsWith("W")||t.endsWith("kWh")||t.endsWith("V"))return"var(--state-icon-color)";const r=e.entity_id.split(".")[0],s=e.attributes.device_class;if("sensor"===r)return"var(--state-icon-color)";if("light"===r&&e.attributes.rgb_color&&"on"===t){const[t,r,s]=e.attributes.rgb_color;return`rgb(${t}, ${r}, ${s})`}return"binary_sensor"===r&&s&&"on"===t?`var(--state-binary_sensor-${s}-on-color, var(--state-icon-active-color))`:"climate"===r?`var(--state-climate-${t}-color, var(--state-icon-active-color))`:"on"===t?`var(--state-${r}-active-color, var(--state-${r}-color, var(--state-icon-active-color)))`:"var(--state-icon-color)"}_renderIcon(e,t){if(!e)return;e.entity=e.entity?e.entity:0,this.iconCache||={},this.iconsSvg||=[],this.pendingIconPath||=[];const r=12*(e.icon_size?e.icon_size:e.size?e.size:2),s=e.svg.xpos,o=e.svg.ypos,a=e.align?e.align:"center",i="center"===a?.5:"start"===a?-1:1;let n=s-r*i,l=o-r*i,c=r;const h=e.entity_index??0,d=this.entities[h],u=this._getStateMapItem(e,d);u&&(e=ta.mergeDeep(e,u));const m=Yo.getHaEntityIconStyle(d),p={};p.fill=m.fill,p.color=m.color,p.filter=m.filter;const g=Ie.getJsTemplateOrValue(e,e.styles);let f=ze.toStyleDict(g);const b=this.animations?.icons?.[e.animation_id]??{},y=this._getItemColorFromStops(e);y&&(f.fill=y,f.color=y),f={...p,...f,...b};const v=this._buildMyIcon(this.entities[h],this.resolvedEntityConfigs[h],u,this.animations?.iconsIcon?.[e.animation_id]);if(this._isUrlIcon(v)){const t=this._getUrlFromCssUrl(v);return this._isSvgUrl(t)?this._renderSvgUrlIcon(e,h,t,f,r,s,o,i):this._renderImageUrlIcon(e,h,t,f,r,s,o,i)}if(this.iconCache[v])this.iconsSvg[t]=this.iconCache[v];else if(this.iconsSvg[t]=void 0,this.pendingIconPath[t]!==v){this.pendingIconPath[t]=v;let e=0;const r=40,s=50,o=()=>{if(this.pendingIconPath[t]!==v)return;const a=this._getRenderedHaIconPath(t);if(a)return this.iconsSvg[t]=a,this.iconCache[v]=a,this.pendingIconPath[t]=void 0,void this.requestUpdate();e+=1,e>=r?this.pendingIconPath[t]=void 0:window.setTimeout(o,s)};(this?.updateComplete&&"function"==typeof this.updateComplete.then||this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((e=>window.requestAnimationFrame(e)))).then((()=>{window.setTimeout(o,0)}))}const _=this.iconsSvg[t];if(_){const a=s-r*i,n=o-.5*r-(e.yposc?0:.25*r),l=r/24,c=e.rotate??0,h=a+12*l,d=n+12*l;return f["transform-origin"]??="0 0",F`
      <g
        transform="${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
        <g
          id="icon-rendered-${this.iconsId[t]}"
          class="icon-position"
          transform="translate(${h} ${d})"
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
      `}return F`
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
  `}_getRenderedHaIconPath(e){const t=this.shadowRoot.getElementById(`icon-${this.iconsId[e]}`);return t?.shadowRoot?.querySelector("*")?.path}_scheduleIconPathRead(e,t){if(!e)return;if(this.iconCache[e])return void(this.iconsSvg[t]=this.iconCache[e]);if(this.pendingIconPath[t]===e)return;this.pendingIconPath[t]=e;let r=0;const s=()=>{if(this.pendingIconPath[t]!==e)return;if(this.iconCache[e])return this.iconsSvg[t]=this.iconCache[e],this.pendingIconPath[t]=void 0,void this.requestUpdate();const o=this._getRenderedHaIconPath();if(o)return this.iconsSvg[t]=o,this.iconCache[e]=o,this.pendingIconPath[t]=void 0,void this.requestUpdate();r+=1,r>=40?this.pendingIconPath[t]=void 0:this._iconPathTimer=window.setTimeout(s,50)};(this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((e=>{window.requestAnimationFrame(e)}))).then((()=>{this._iconPathTimer=window.setTimeout(s,0)}))}_renderIcons(){const{layout:e}=this.config;if(!e)return;if(!e.icons)return;const t=e.icons.map(((e,t)=>F`
            ${this._renderIcon(e,t)}
          `));return F`${t}`}_renderHorizontalLine(e){const t=e.entity_index??0,r=Ie.getJsTemplateOrValue(e,e.styles),s={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2",...ze.toStyleDict(r)},o={...ze.toStyleDict(this.animations?.hlines?.[e.animation_id]??{})},a=this._getItemColorFromStops(e);a&&(o.stroke=a);const i={...s,...o};return F`
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
  `}_renderHorizontalLines(){const{layout:e}=this.config;if(!e?.hlines)return F``;const t=e.hlines.map((e=>this._renderHorizontalLine(e)));return F`${t}`}_renderVerticalLine(e){const t=e.entity_index??0,r=Ie.getJsTemplateOrValue(e,e.styles),s={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2",...ze.toStyleDict(r)},o={...ze.toStyleDict(this.animations?.vlines?.[e.animation_id]??{})},a=this._getItemColorFromStops(e);a&&(o.stroke=a);const i={...s,...o};return F`
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
    `}_renderVerticalLines(){const{layout:e}=this.config;if(!e?.vlines)return F``;const t=e.vlines.map((e=>this._renderVerticalLine(e)));return F`${t}`}_renderCircle(e){const t=e.entity_index??0,r=Ie.getJsTemplateOrValue(e,e.styles),s={...ze.toStyleDict(r)},o={...ze.toStyleDict(this.animations?.circles?.[e.animation_id]??{})},a=this._getItemColorFromStops(e);a&&(o.stroke=a);const i={...s,...o};return F`
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
    `}_renderCircles(){const{layout:e}=this.config;if(!e?.circles)return F``;const t=e.circles.map((e=>this._renderCircle(e)));return F`${t}`}_handleClick(e,t,r,s,o){let a;switch(s.action){case"more-info":a=new Event("hass-more-info",{composed:!0}),a.detail={entityId:o},e.dispatchEvent(a);break;case"navigate":if(!s.navigation_path)return;window.history.pushState(null,"",s.navigation_path),a=new Event("location-changed",{composed:!0}),a.detail={replace:!1},window.dispatchEvent(a);break;case"call-service":{if(!s.service)return;const[e,r]=s.service.split(".",2),o={...s.service_data};t.callService(e,r,o);break}case"fire-dom-event":a=new Event("ll-custom",{composed:!0,bubbles:!0}),a.detail=s,e.dispatchEvent(a)}}handlePopup(e,t){e.stopPropagation();const r=this.resolvedEntityConfigs.find((e=>e.entity===t.entity_id)),s=r?.tap_action??this.config?.tap_action??{action:"more-info"};this._handleClick(this,this._hass,this.config,s,t.entity_id)}textEllipsis(e,t){return t&&t<e.length?e.slice(0,t-1).concat("..."):e}_buildArea(e,t){if(t.area)return t.area;if(!this._hass||!this._hass.areas)return"";const r=this._hass.entities&&this._hass.entities[t.entity];let s=r?r.area_id:null;if(!s&&r&&r.device_id&&this._hass.devices){const e=this._hass.devices[r.device_id];s=e?e.area_id:null}if(s){const e=this._hass.areas[s];return e?e.name:""}return"?"}_buildName(e,t){return t.name??e.attributes.friendly_name??e?.entity_id??"?"}_buildIcon(e,t,r){return r||t?.icon||e?.attributes?.icon||Fe(e)}_buildUom(e,t,r){return t.unit||r||""}_buildState(e,t){if(void 0===e)return e;if(null===e)return e;if(t.convert){let r,s,o=t.convert.match(/(^\w+)\((\d+)\)/);switch(null===o?r=t.convert:3===o.length&&(r=o[1],s=Number(o[2])),r){case"brightness_pct":e="undefined"===e?"undefined":`${Math.round(e/255*100)}`;break;case"multiply":e=`${Math.round(e*s)}`;break;case"divide":e=`${Math.round(e/s)}`;break;case"rgb_csv":case"rgb_hex":if(t.attribute){let s=this._hass.states[t.entity];switch(s.attributes.color_mode){case"unknown":case"onoff":case"brightness":case"white":break;case"color_temp":if(s.attributes.color_temp_kelvin){let t=jo(s.attributes.color_temp_kelvin);const o=zo(t);o[1]<.4&&(o[1]<.1?o[2]=225:o[1]=.4),t=Io(o),t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:To(t)}else e="rgb_csv"===r?"255,255,255":"#ffffff00";break;case"hs":{let t=Po([s.attributes.hs_color[0],s.attributes.hs_color[1]/100]);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:To(t)}break;case"rgb":{const t=zo(this.stateObj.attributes.rgb_color);t[1]<.4&&(t[1]<.1?t[2]=225:t[1]=.4);const s=Io(t);e="rgb_csv"===r?s.toString():To(s)}break;case"rgbw":{let t=(e=>{const[t,r,s,o]=e;return Lo([t,r,s,o],[t+o,r+o,s+o])})(s.attributes.rgbw_color);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:To(t)}break;case"rgbww":{let t=Go(s.attributes.rgbww_color,s.attributes?.min_color_temp_kelvin,s.attributes?.max_color_temp_kelvin);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:To(t)}break;case"xy":if(s.attributes.hs_color){let t=Po([s.attributes.hs_color[0],s.attributes.hs_color[1]/100]);const o=zo(t);o[1]<.4&&(o[1]<.1?o[2]=225:o[1]=.4),t=Io(o),t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:To(t)}else if(s.attributes.color){let t={};t.l=s.attributes.brightness,t.h=s.attributes.color.h||s.attributes.color.hue,t.s=s.attributes.color.s||s.attributes.color.saturation;let{r:o,g:a,b:i}=Yo.hslToRgb(t);if("rgb_csv"===r)e=`${o},${a},${i}`;else{e=`#${Yo.padZero(o.toString(16))}${Yo.padZero(a.toString(16))}${Yo.padZero(i.toString(16))}`}}else s.attributes.xy_color}}break;default:console.error(`Unknown converter [${r}] specified for entity [${t.entity}]!`)}}return void 0!==e?Number.isNaN(e)?e:e.toString():void 0}_computeEntity(e){return e.substr(e.indexOf(".")+1)}_renderHorseshoeTicks(e,t,r){if(!e?.show?.ticks)return F``;const s=e.horseshoe_tickmarks;if(!s?.ticks_major&&!s?.ticks_minor)return F``;const o=Number(e.horseshoe_scale.min),a=Number(e.horseshoe_scale.max),i=e.svg.xpos,n=e.svg.ypos,l=e.svg.radius,c=e.bar_mode,h=e.arc_degrees;return Va.renderScaleTicks({cx:i,cy:n,radius:l,min:o,max:a,arcDegrees:h,barMode:c,colorStops:e.colorStops,ticksMajor:s.ticks_major,ticksMinor:s.ticks_minor,tickType:r})}_renderHorseshoeScale(e,t){const r=e?.show?.scale_style??"fixed";if("none"===r)return F``;const s=Number(e.horseshoe_scale.min),o=Number(e.horseshoe_scale.max),a=e.svg.xpos,i=e.svg.ypos,n=e.svg.radius,l=e.bar_mode,c=e.arc_degrees,h=e.horseshoe_scale.width,d=e.horseshoe_scale.color,u=e.colorStops;return"colorstop"===r?u?.colors?.length?Va.renderColorStopScaleSegments({cx:a,cy:i,radius:n,startAngle:-c/2,endAngle:c/2,width:h,colorStops:u,min:s,max:o,arcDegrees:c,barMode:l,gap:u.gap??0,className:"horseshoe-colorstop-scale-segment",lineCap:"round"}):F``:"fixed"===r?Va.renderFixedScaleSegments({cx:a,cy:i,radius:n,startAngle:-c/2,endAngle:c/2,width:h,color:d,min:s,max:o,arcDegrees:c,barMode:l,segmentSize:0,gap:0,className:"horseshoe-fixed-scale-segment",lineCap:"round"}):F``}_testRenderColorStopScale(e,t){const r=t?.show?.scale_style;if(!r)return F``;const s=Number(t.horseshoe_scale.min),o=Number(t.horseshoe_scale.max),a=t.svg.xpos,i=t.svg.ypos,n=t.svg.radius,l=t.bar_mode,c=t.arc_degrees,h=t.horseshoe_scale.width,d=t.horseshoe_scale.color,u=t.colorStops;return"colorstop"===r?u?.colors?.length?Va.renderColorStopScaleSegments({cx:a,cy:i,radius:n,startAngle:-c/2,endAngle:c/2,width:h,colorStops:u,min:s,max:o,arcDegrees:c,barMode:l,gap:u.gap??0,className:"horseshoe-colorstop-scale-segment",lineCap:"round"}):F``:"fixed_tickmarks"===r?Va.renderScaleTicks({cx:a,cy:i,radius:n,min:s,max:o,arcDegrees:c,barMode:l,color:d,ticksMajor:t.horseshoe_scale.ticks_major,ticksMinor:t.horseshoe_scale.ticks_minor}):"fixed"===r?Va.renderFixedScaleSegments({cx:a,cy:i,radius:n,startAngle:-c/2,endAngle:c/2,width:h,color:d,min:s,max:o,arcDegrees:c,barMode:l,segmentSize:0,gap:0,className:"horseshoe-fixed-scale-segment",lineCap:"round"}):F``}_renderHorseshoeLabelBackground(e,t){const r=e?.show?.label_background??"none";if("none"===r)return F``;const s=e?.horseshoe_labels?.background??{},o=Number(e.horseshoe_scale.min),a=Number(e.horseshoe_scale.max),i=e.svg.xpos,n=e.svg.ypos,l=e.svg.radius+Number(e?.horseshoe_labels?.offset??e.horseshoe_state.width+2),c=e.bar_mode,h=e.arc_degrees,d=Number(s.width??6),u=s.color,m=Number(s.gap??0),p=e.colorStops;return Va.getLabelBackgroundExtend({minLabel:o,maxLabel:a,charWidth:Number(e?.horseshoe_labels?.badges?.char_width??4),padding:Number(e?.horseshoe_labels?.badges?.padding??3),radius:l}),"colorstop"===r?p?.colors?.length?Va.renderColorStopScaleSegments({cx:i,cy:n,radius:l,startAngle:-h/2,endAngle:h/2,width:d,colorStops:p,min:o,max:a,arcDegrees:h,barMode:c,gap:m,className:"horseshoe-label-background-colorstop",lineCap:"round"}):F``:"fixed"===r?Va.renderFixedScaleSegments({cx:i,cy:n,radius:l,startAngle:-h/2-20,endAngle:h/2+20,width:d,color:u,min:o,max:a,arcDegrees:h,barMode:c,segmentSize:0,gap:0,className:"horseshoe-label-background-fixed",lineCap:"round"}):F``}_renderHorseshoeLabelBadges(e,t){const r=e?.show?.labels_at??"none";if("none"===r||!e?.show?.label_badges)return F``;const s=Number(e.horseshoe_scale.min),o=Number(e.horseshoe_scale.max),a=e.svg.xpos,i=e.svg.ypos,n=e.svg.radius+Number(e?.horseshoe_labels?.offset??e.horseshoe_state.width+2),l=e.bar_mode,c=e.arc_degrees,h=e.colorStops,d=e?.horseshoe_labels?.orientation??"arc",u=e?.horseshoe_labels?.badges??{};let m=[];if("minmax"===r&&(m=[{value:s,label:s},{value:o,label:o}]),"colorstop"===r){if(!h?.colors?.length)return F``;m=[{value:s,label:s},...h.colors,{value:o,label:o}]}if("ticks_major"===r){const t=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);if(!Number.isFinite(t)||t<=0)return F``;m=Va.buildTickValues(s,o,t).map((e=>({value:e,label:e})))}if("both"===r){const t=h?.colors?.length?[{value:s,label:s},...h.colors,{value:o,label:o}]:[],r=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);m=[...t,...Number.isFinite(r)&&r>0?Va.buildTickValues(s,o,r).map((e=>({value:e,label:e}))):[]]}m=m.filter((e=>{const t=Number(e.value);return Number.isFinite(t)&&t>=s&&t<=o})).sort(((e,t)=>Number(e.value)-Number(t.value))).filter(((e,t,r)=>{const s=Number(e.value);return r.findIndex((e=>Number(e.value)===s))===t}));const p=Number(e?.horseshoe_labels?.distance_min??0),g=[];return m.forEach((e=>{const t=Number(e.value);if(p<=0)return void g.push(e);const r=g[g.length-1];(!r||Math.abs(t-Number(r.value))>=p)&&g.push(e)})),F`
    ${g.map(((e,r)=>{const h=Number(e.value),m=Va.valueToAngle(h,s,o,c,l);return Va.renderLabelBadge({horseshoeIndex:t,index:r,label:e.label??e.value,angle:m,cx:a,cy:i,radius:n,cardId:this.cardId,orientation:d,badge:u})}))}
  `}_renderHorseshoeLabels(e,t,r){const s=e?.show?.labels_at??"none";if("none"===s)return F``;const o=Number(e.horseshoe_scale.min),a=Number(e.horseshoe_scale.max),i=e.svg.xpos,n=e.svg.ypos,l=e.svg.radius+Number(e?.horseshoe_labels?.offset??e.horseshoe_state.width+2),c=e.bar_mode,h=e.arc_degrees,d=e.colorStops,u=e?.horseshoe_labels?.orientation??"arc",m=e?.flip,p={rotation:e?.rotate??0,flipX:"x"===m||"both"===m,flipY:"y"===m||"both"===m};let g=[];if("minmax"===s&&(g=[{value:o,label:o},{value:a,label:a}]),"colorstop"===s){if(!d?.colors?.length)return F``;g=[{value:o,label:o},...d.colors,{value:a,label:a}].filter(((e,t,r)=>{const s=Number(e.value);return Number.isFinite(s)&&s>=o&&s<=a&&r.findIndex((e=>Number(e.value)===s))===t}))}if("ticks_major"===s){const t=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);if(!Number.isFinite(t)||t<=0)return F``;g=Va.buildTickValues(o,a,t).map((e=>({value:e,label:e})))}if("both"===s){const t=d?.colors?.length?[{value:o,label:o},...d.colors,{value:a,label:a}]:[],r=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);g=[...t,...Number.isFinite(r)&&r>0?Va.buildTickValues(o,a,r).map((e=>({value:e,label:e}))):[]].filter((e=>{const t=Number(e.value);return Number.isFinite(t)&&t>=o&&t<=a})).sort(((e,t)=>Number(e.value)-Number(t.value))).filter(((e,t,r)=>{const s=Number(e.value);return r.findIndex((e=>Number(e.value)===s))===t}))}const f=Number(e?.horseshoe_labels?.distance_min??0),b=[];return g.forEach((e=>{const t=Number(e.value);if(f<=0)return void b.push(e);const r=b[b.length-1];(!r||Math.abs(t-Number(r.value))>=f)&&b.push(e)})),F`
      ${b.map(((e,r)=>{const s=Number(e.value),d=Va.valueToAngle(s,o,a,h,c);return Va.renderLabel({horseshoeIndex:t,index:r,label:e.label??e.value,angle:d,cx:i,cy:n,radius:l,cardId:this.cardId,orientation:u,isMin:!1,isMax:!1,transformContext:p})}))}
    `}_renderColorStopLabels(e,t,r,s,o){if("colorstop"!==t?.show?.labels_at)return console.log("_renderColorStopLabels, NO labels_at",t?.show),F``;if(!s?.colors?.length)return console.log("renderColorStopLabels, no colorstops",t),F``;const a=Number(r.min),i=Number(r.max),n=t.svg.xpos,l=t.svg.ypos,c=t.svg.radius+Number(t?.horseshoe_labels?.offset??t.horseshoe_state.width+2),h=t.bar_mode;let d=[];"colorstop"===t?.show?.labels_at&&(d=[{value:a,label:a},...s.colors,{value:i,label:i}].filter(((e,t,r)=>{const s=Number(e.value);return Number.isFinite(s)&&s>=a&&s<=i&&r.findIndex((e=>Number(e.value)===s))===t})));const u=Number(t?.horseshoe_labels?.distance_min??0),m=[];return d.forEach(((e,t)=>{const r=Number(e.value);if(0===t||t===d.length-1||u<=0)return void m.push(e);const s=m[m.length-1];(!s||Math.abs(r-Number(s.value))>=u)&&m.push(e)})),F`
      ${m.map(((t,r)=>{const s=Number(t.value),d=Va.valueToAngle(s,a,i,o,h);return Va.renderColorStopLabel({horseshoeIndex:e,index:r,label:t.label??t.value,angle:d,cx:n,cy:l,radius:c,cardId:this.cardId,isMin:!1,isMax:!1})}))}
  `}getCardSize(){return 4}}customElements.get("flex-horseshoe-card")||customElements.define("flex-horseshoe-card",Ha);

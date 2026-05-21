/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),i=new WeakMap;let o=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const r=this.t;if(t&&void 0===e){const t=void 0!==r&&1===r.length;t&&(e=i.get(r)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&i.set(r,e))}return e}toString(){return this.cssText}};const a=(e,...t)=>{const i=1===e.length?e[0]:t.reduce(((t,r,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[i+1]),e[0]);return new o(i,e,r)},s=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,r))(t)})(e):e
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:u}=Object,m=globalThis,p=m.trustedTypes,f=p?p.emptyScript:"",g=m.reactiveElementPolyfillSupport,b=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},v=(e,t)=>!n(e,t),_={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(e,r,t);void 0!==i&&l(this.prototype,e,i)}}static getPropertyDescriptor(e,t,r){const{get:i,set:o}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const a=i?.call(this);o?.call(this,t),this.requestUpdate(e,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...h(e),...d(e)];for(const r of t)this.createProperty(r,e[r])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,r]of t)this.elementProperties.set(e,r)}this._$Eh=new Map;for(const[t,r]of this.elementProperties){const e=this._$Eu(t,r);void 0!==e&&this._$Eh.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(s(e))}else void 0!==e&&t.push(s(e));return t}static _$Eu(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((r,i)=>{if(t)r.adoptedStyleSheets=i.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const t of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=t.cssText,r.appendChild(i)}})(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){const r=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,r);if(void 0!==i&&!0===r.reflect){const o=(void 0!==r.converter?.toAttribute?r.converter:y).toAttribute(t,r.type);this._$Em=e,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){const r=this.constructor,i=r._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=r.getPropertyOptions(i),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=i;const a=o.fromAttribute(t,e.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(e,t,r,i=!1,o){if(void 0!==e){const a=this.constructor;if(!1===i&&(o=this[e]),r??=a.getPropertyOptions(e),!((r.hasChanged??v)(o,t)||r.useDefault&&r.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,r))))return;this.C(e,t,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:i,wrapped:o},a){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==o||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,r]of e){const{wrapped:e}=r,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,r,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[b("elementProperties")]=new Map,w[b("finalized")]=new Map,g?.({ReactiveElement:w}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,$=x.trustedTypes,M=$?$.createPolicy("flex-horseshoe-card-lit-html",{createHTML:e=>e}):void 0,k="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,A="?"+S,E=`<${A}>`,z=document,C=()=>z.createComment(""),N=e=>null===e||"object"!=typeof e&&"function"!=typeof e,P=Array.isArray,I="[ \t\n\f\r]",O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,j=/>/g,D=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,R=/"/g,V=/^(?:script|style|textarea|title)$/i,U=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),F=U(1),q=U(2),J=Symbol.for("lit-noChange"),L=Symbol.for("lit-nothing"),B=new WeakMap,G=z.createTreeWalker(z,129);function K(e,t){if(!P(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==M?M.createHTML(t):t}const W=(e,t)=>{const r=e.length-1,i=[];let o,a=2===t?"<svg>":3===t?"<math>":"",s=O;for(let n=0;n<r;n++){const t=e[n];let r,l,c=-1,h=0;for(;h<t.length&&(s.lastIndex=h,l=s.exec(t),null!==l);)h=s.lastIndex,s===O?"!--"===l[1]?s=T:void 0!==l[1]?s=j:void 0!==l[2]?(V.test(l[2])&&(o=RegExp("</"+l[2],"g")),s=D):void 0!==l[3]&&(s=D):s===D?">"===l[0]?(s=o??O,c=-1):void 0===l[1]?c=-2:(c=s.lastIndex-l[2].length,r=l[1],s=void 0===l[3]?D:'"'===l[3]?R:H):s===R||s===H?s=D:s===T||s===j?s=O:(s=D,o=void 0);const d=s===D&&e[n+1].startsWith("/>")?" ":"";a+=s===O?t+E:c>=0?(i.push(r),t.slice(0,c)+k+t.slice(c)+S+d):t+S+(-2===c?n:d)}return[K(e,a+(e[r]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class Y{constructor({strings:e,_$litType$:t},r){let i;this.parts=[];let o=0,a=0;const s=e.length-1,n=this.parts,[l,c]=W(e,t);if(this.el=Y.createElement(l,r),G.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=G.nextNode())&&n.length<s;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(k)){const t=c[a++],r=i.getAttribute(e).split(S),s=/([.?@])?(.*)/.exec(t);n.push({type:1,index:o,name:s[2],strings:r,ctor:"."===s[1]?te:"?"===s[1]?re:"@"===s[1]?ie:ee}),i.removeAttribute(e)}else e.startsWith(S)&&(n.push({type:6,index:o}),i.removeAttribute(e));if(V.test(i.tagName)){const e=i.textContent.split(S),t=e.length-1;if(t>0){i.textContent=$?$.emptyScript:"";for(let r=0;r<t;r++)i.append(e[r],C()),G.nextNode(),n.push({type:2,index:++o});i.append(e[t],C())}}}else if(8===i.nodeType)if(i.data===A)n.push({type:2,index:o});else{let e=-1;for(;-1!==(e=i.data.indexOf(S,e+1));)n.push({type:7,index:o}),e+=S.length-1}o++}}static createElement(e,t){const r=z.createElement("template");return r.innerHTML=e,r}}function X(e,t,r=e,i){if(t===J)return t;let o=void 0!==i?r._$Co?.[i]:r._$Cl;const a=N(t)?void 0:t._$litDirective$;return o?.constructor!==a&&(o?._$AO?.(!1),void 0===a?o=void 0:(o=new a(e),o._$AT(e,r,i)),void 0!==i?(r._$Co??=[])[i]=o:r._$Cl=o),void 0!==o&&(t=X(e,o._$AS(e,t.values),o,i)),t}class Z{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,i=(e?.creationScope??z).importNode(t,!0);G.currentNode=i;let o=G.nextNode(),a=0,s=0,n=r[0];for(;void 0!==n;){if(a===n.index){let t;2===n.type?t=new Q(o,o.nextSibling,this,e):1===n.type?t=new n.ctor(o,n.name,n.strings,this,e):6===n.type&&(t=new oe(o,this,e)),this._$AV.push(t),n=r[++s]}a!==n?.index&&(o=G.nextNode(),a++)}return G.currentNode=z,i}p(e){let t=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}let Q=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,i){this.type=2,this._$AH=L,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),N(e)?e===L||null==e||""===e?(this._$AH!==L&&this._$AR(),this._$AH=L):e!==this._$AH&&e!==J&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>P(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==L&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(z.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:r}=e,i="number"==typeof r?this._$AC(e):(void 0===r.el&&(r.el=Y.createElement(K(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new Z(i,this),r=e.u(this.options);e.p(t),this.T(r),this._$AH=e}}_$AC(e){let t=B.get(e.strings);return void 0===t&&B.set(e.strings,t=new Y(e)),t}k(t){P(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let i,o=0;for(const a of t)o===r.length?r.push(i=new e(this.O(C()),this.O(C()),this,this.options)):i=r[o],i._$AI(a),o++;o<r.length&&(this._$AR(i&&i._$AB.nextSibling,o),r.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}};class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,i,o){this.type=1,this._$AH=L,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=L}_$AI(e,t=this,r,i){const o=this.strings;let a=!1;if(void 0===o)e=X(this,e,t,0),a=!N(e)||e!==this._$AH&&e!==J,a&&(this._$AH=e);else{const i=e;let s,n;for(e=o[0],s=0;s<o.length-1;s++)n=X(this,i[r+s],t,s),n===J&&(n=this._$AH[s]),a||=!N(n)||n!==this._$AH[s],n===L?e=L:e!==L&&(e+=(n??"")+o[s+1]),this._$AH[s]=n}a&&!i&&this.j(e)}j(e){e===L?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===L?void 0:e}}class re extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==L)}}class ie extends ee{constructor(e,t,r,i,o){super(e,t,r,i,o),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??L)===J)return;const r=this._$AH,i=e===L&&r!==L||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==L&&(r===L||i);i&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const ae=x.litHtmlPolyfillSupport;ae?.(Y,Q),(x.litHtmlVersions??=[]).push("3.3.2");const se=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ne=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,r)=>{const i=r?.renderBefore??t;let o=i._$litPart$;if(void 0===o){const e=r?.renderBefore??null;i._$litPart$=o=new Q(t.insertBefore(C(),e),e,void 0,r??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return J}};ne._$litElement$=!0,ne.finalized=!0,se.litElementHydrateSupport?.({LitElement:ne});const le=se.litElementPolyfillSupport;le?.({LitElement:ne}),(se.litElementVersions??=[]).push("4.2.2");
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
 */const de="important",ue=" !"+de,me=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends he{constructor(e){if(super(e),e.type!==ce||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce(((t,r)=>{const i=e[r];return null==i?t:t+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`}),"")}update(e,[t]){const{style:r}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const i of this.ft)null==t[i]&&(this.ft.delete(i),i.includes("-")?r.removeProperty(i):r[i]=null);for(const i in t){const e=t[i];if(null!=e){this.ft.add(i);const t="string"==typeof e&&e.endsWith(ue);i.includes("-")||t?r.setProperty(i,t?e.slice(0,-11):e,t?de:""):r[i]=e}}return J}});class pe{static toStyleDict(e){return pe.toDict(e,{stringToDict:pe.cssStringToDict,mapValue:pe.toStyleValue})}static toClassDict(e){return pe.toDict(e,{stringToDict:pe.classStringToDict,mapValue:Boolean})}static toIconDict(e){return pe.toDict(e,{stringToDict:pe.stringToDefaultDict("default"),mapValue:String})}static toDict(e,t={}){const{stringToDict:r=pe.stringToDefaultDict("default"),mapValue:i=(e=>e),skipNull:o=!0,skipFalse:a=!0}=t,s=e=>null==e&&o||!1===e&&a?{}:Array.isArray(e)?e.reduce(((e,t)=>({...e,...s(t)})),{}):pe.isPlainObject(e)?Object.fromEntries(Object.entries(e).filter((([,e])=>(null!=e||!o)&&(!1!==e||!a))).map((([e,t])=>[e,i(t,e)]))):"string"==typeof e?r(e):{};return s(e)}static toStyleValue(e){return null==e?e:String(e).trim().replace(/;+$/,"")}static cssStringToDict(e){return String(e).split(";").map((e=>e.trim())).filter(Boolean).reduce(((e,t)=>{const r=t.indexOf(":");if(r<=0)return e;const i=t.slice(0,r).trim(),o=t.slice(r+1).trim();return i&&o?{...e,[i]:o}:e}),{})}static toColorStopDict(e){return pe.toDict(e,{stringToDict:pe.keyValueStringToDict,mapValue:String})}static keyValueStringToDict(e){const t=String(e).trim(),r=t.indexOf(":");if(r<=0)return{};const i=t.slice(0,r).trim(),o=t.slice(r+1).trim();return i&&o?{[i]:o}:{}}static classStringToDict(e){return String(e).trim().split(/\s+/).filter(Boolean).reduce(((e,t)=>({...e,[t]:!0})),{})}static stringToDefaultDict(e="default"){return t=>({[e]:String(t)})}static requireArray(e,t="value"){if(null==e)return[];if(!Array.isArray(e))throw new Error(`[config-helper] "${t}" must be an array.`);return e}static ensureArray(e){return null==e?[]:Array.isArray(e)?e:[e]}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}}class fe{static context={};static setContext(e={}){fe.context=e}static getJsTemplateOrValue(e,t,r={}){return fe._getJsTemplateOrValue(e,t,r,0)}static _getJsTemplateOrValue(e,t,r={},i=0){const{resolveKeys:o=!0,maxDepth:a=10}=r;if(i>=a)return t;if(null==t)return t;if(["number","boolean","bigint","symbol"].includes(typeof t))return t;if(Array.isArray(t))return t.map((t=>fe._getJsTemplateOrValue(e,t,r,i)));if(fe.isPlainObject(t))return Object.fromEntries(Object.entries(t).map((([t,a])=>{const s=o?fe._getJsTemplateOrValue(e,t,r,i):t,n=fe._getJsTemplateOrValue(e,a,r,i);return[String(s),n]})));if("string"!=typeof t)return t;const s=t.trim();if(!fe.isJsTemplate(s))return t;const n=fe.evaluateJsTemplate(e,fe.extractJsTemplateCode(s));return fe._getJsTemplateOrValue(e,n,r,i+1)}static getJsTemplateOrValueV1(e,t,r={}){const{resolveKeys:i=!0}=r;if(null==t)return t;if(["number","boolean","bigint","symbol"].includes(typeof t))return t;if(Array.isArray(t))return t.map((t=>fe.getJsTemplateOrValue(e,t,r)));if(fe.isPlainObject(t))return Object.fromEntries(Object.entries(t).map((([t,o])=>{const a=i?fe.getJsTemplateOrValue(e,t,r):t,s=fe.getJsTemplateOrValue(e,o,r);return[String(a),s]})));if("string"!=typeof t)return t;const o=t.trim();if(fe.isJsTemplate(o)){const t=fe.evaluateJsTemplate(e,fe.extractJsTemplateCode(o));return fe.getJsTemplateOrValue(e,t,r)}return t}static isJsTemplate(e){return"string"==typeof e&&e.trim().startsWith("[[[")&&e.trim().endsWith("]]]")}static extractJsTemplateCode(e){return String(e).trim().slice(3,-3).trim()}static evaluateJsTemplate(e,t){const{hass:r,config:i,entities:o=[]}=fe.context,a=fe._getItemEntityIndex(e),s=fe._getTemplateState(e),n=o?.[a],l=r?.states,c=i?.variables??{},h=r?.user;i?.dev?.debug&&console.log("Evaluating JavaScript template with context:",{hass:r,config:i,entity:n,entities:o,states:l,state:s,variables:c,item:e,user:h});try{return new Function("hass","config","entity","entities","states","state","variables","item","user",`\n          "use strict";\n          ${t}\n        `)(r,i,n,o,l,s,c,e,h)}catch(d){return void(i?.dev?.debug&&console.error("[templates] JavaScript template error:",{error:d,item:e,javascript:t}))}}static _getTemplateState(e={}){const t=fe._getItemEntityIndex(e),r=fe.context.entities?.[t],i=fe.context.config?.entities?.[t]||{};if(!r)return;const o=i.attribute;return o&&r.attributes&&void 0!==r.attributes[o]?r.attributes[o]:r.state}static _getItemEntityIndex(e={}){const t=Number(e.entity_index);return Number.isFinite(t)?t:0}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}}class ge{static normalize(e){return e?Array.isArray(e)?{scales:{},colors:ge.normalizeColors(e)}:!ge.isPlainObject(e)||e.colors||e.scales?ge.isPlainObject(e)?{scales:ge.normalizeScales(e.scales),colors:ge.normalizeColors(e.colors)}:{scales:{},colors:[]}:{scales:{},colors:ge.normalizeColors(e)}:{scales:{},colors:[]}}static normalizeScales(e){return ge.isPlainObject(e)?Object.fromEntries(Object.entries(e).map((([e,t])=>[e,ge.isPlainObject(t)?{...t}:t]))):{}}static normalizeColors(e){return e?Array.isArray(e)?e.flatMap((e=>ge.normalizeColorArrayEntry(e))).filter(Boolean).sort(((e,t)=>e.value-t.value)):ge.isPlainObject(e)?Object.entries(e).map((([e,t])=>ge.normalizeColorPair(e,t))).filter(Boolean).sort(((e,t)=>e.value-t.value)):[]:[]}static normalizeColorArrayEntry(e){if(ge.isPlainObject(e)&&Object.prototype.hasOwnProperty.call(e,"value")&&Object.prototype.hasOwnProperty.call(e,"color")){const t=ge.normalizeColorEntry(e);return t?[t]:[]}return ge.isPlainObject(e)?Object.entries(e).map((([e,t])=>ge.normalizeColorPair(e,t))).filter(Boolean):[]}static normalizeColorPair(e,t){const r=Number(e);return Number.isFinite(r)?null==t?null:{value:r,color:String(t)}:null}static normalizeColorEntry(e){if(!ge.isPlainObject(e))return null;const t=Number(e.value);return Number.isFinite(t)?void 0===e.color||null===e.color?null:{...e,value:t,color:String(e.color)}:null}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}static _testColorStopsNormalizer(){const e={entity_index:0},t=[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}];[{name:"FHC dict",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC dict with quoted keys",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC list of dicts",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC list of dicts with quoted keys",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC dict with template values",raw:{0:"[[[\n          return 'red';\n        ]]]",10:"[[[\n          return 'green';\n        ]]]",20:"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template values",raw:[{0:"[[[\n            return 'red';\n          ]]]"},{10:"[[[\n            return 'green';\n          ]]]"},{20:"[[[\n            return 'blue';\n          ]]]"}]},{name:"FHC dict with template keys",raw:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}},{name:"FHC dict with template keys and values",raw:{"[[[ return 0; ]]]":"[[[\n          return 'red';\n        ]]]","[[[ return 10; ]]]":"[[[\n          return 'green';\n        ]]]","[[[ return 20; ]]]":"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template keys and values",raw:[{"[[[ return 0; ]]]":"[[[\n            return 'red';\n          ]]]"},{"[[[ return 10; ]]]":"[[[\n            return 'green';\n          ]]]"},{"[[[ return 20; ]]]":"[[[\n            return 'blue';\n          ]]]"}]},{name:"Whole FHC color_stops as template returning dict",raw:"[[[\n        return {\n          0: 'red',\n          10: 'green',\n          20: 'blue',\n        };\n      ]]]"},{name:"Whole FHC color_stops as template returning list",raw:"[[[\n        return [\n          { 0: 'red' },\n          { 10: 'green' },\n          { 20: 'blue' },\n        ];\n      ]]]"},{name:"SAK v1 colorstops.colors dict",raw:{colors:{0:"red",10:"green",20:"blue"}}},{name:"SAK v1 colorstops.colors dict with template keys",raw:{colors:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}}},{name:"SAK v1 colorstops.colors dict with template values",raw:{colors:{0:"[[[\n            return 'red';\n          ]]]",10:"[[[\n            return 'green';\n          ]]]",20:"[[[\n            return 'blue';\n          ]]]"}}},{name:"SAK v2 colors list",raw:{scales:{default:{min:0,max:20}},colors:[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}]}},{name:"SAK v2 colors list unsorted",raw:{scales:{default:{min:0,max:20}},colors:[{value:20,color:"blue",rank:2},{value:0,color:"red",rank:1},{value:10,color:"green",rank:1}]}},{name:"SAK v2 colors list with template values",raw:{scales:{default:{min:"[[[\n              return 0;\n            ]]]",max:"[[[\n              return 20;\n            ]]]"}},colors:[{value:"[[[\n              return 0;\n            ]]]",color:"[[[\n              return 'red';\n            ]]]"},{value:"[[[\n              return 10;\n            ]]]",color:"[[[\n              return 'green';\n            ]]]"},{value:"[[[\n              return 20;\n            ]]]",color:"[[[\n              return 'blue';\n            ]]]"}]}},{name:"SAK v2 whole colors list as template",raw:{scales:{default:{min:0,max:20}},colors:"[[[\n          return [\n            { value: 0, color: 'red' },\n            { value: 10, color: 'green' },\n            { value: 20, color: 'blue' },\n          ];\n        ]]]"}}].forEach((r=>{const i=fe.getJsTemplateOrValue(e,r.raw,{resolveKeys:!0}),o=ge.normalize(i),a=o.colors.map((e=>({value:e.value,color:e.color}))),s=JSON.stringify(a)===JSON.stringify(t);console.log(`[colorstops test] ${s?"PASS":"FAIL"} - ${r.name}`,{raw:r.raw,resolved:i,normalized:o,simpleColors:a,expectedColors:t})}))}}const be="mdi:bookmark",ye={air_quality:"mdi:air-filter",alert:"mdi:alert",calendar:"mdi:calendar",climate:"mdi:thermostat",configurator:"mdi:cog",conversation:"mdi:microphone-message",counter:"mdi:counter",datetime:"mdi:calendar-clock",date:"mdi:calendar",demo:"mdi:home-assistant",google_assistant:"mdi:google-assistant",group:"mdi:google-circles-communities",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_button:"mdi:gesture-tap-button",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",number:"mdi:ray-vertex",persistent_notification:"mdi:bell",plant:"mdi:Flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:palette",schedule:"mdi:calendar-clock",script:"mdi:script-text",select:"mdi:format-list-bulleted",sensor:"mdi:eye",simple_alarm:"mdi:bell",siren:"mdi:bullhorn",stt:"mdi:microphone-message",text:"mdi:form-textbox",time:"mdi:clock",timer:"mdi:timer-outline",tts:"mdi:speaker-message",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",zone:"mdi:map-marker-radius"},ve={apparent_power:"mdi:flash",aqi:"mdi:air-filter",atmospheric_pressure:"mdi:thermometer-lines",carbon_dioxide:"mdi:molecule-co2",carbon_monoxide:"mdi:molecule-co",current:"mdi:current-ac",data_rate:"mdi:transmission-tower",data_size:"mdi:database",date:"mdi:calendar",distance:"mdi:arrow-left-right",duration:"mdi:progress-clock",energy:"mdi:lightning-bolt",frequency:"mdi:sine-wave",gas:"mdi:meter-gas",humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",irradiance:"mdi:sun-wireless",moisture:"mdi:water-percent",monetary:"mdi:cash",nitrogen_dioxide:"mdi:molecule",nitrogen_monoxide:"mdi:molecule",nitrous_oxide:"mdi:molecule",ozone:"mdi:molecule",pm1:"mdi:molecule",pm10:"mdi:molecule",pm25:"mdi:molecule",power:"mdi:flash",power_factor:"mdi:angle-acute",precipitation:"mdi:weather-rainy",precipitation_intensity:"mdi:weather-pouring",pressure:"mdi:gauge",reactive_power:"mdi:flash",signal_strength:"mdi:wifi",sound_pressure:"mdi:ear-hearing",speed:"mdi:speedometer",sulphur_dioxide:"mdi:molecule",temperature:"mdi:thermometer",timestamp:"mdi:clock",volatile_organic_compounds:"mdi:molecule",volatile_organic_compounds_parts:"mdi:molecule",voltage:"mdi:sine-wave",volume:"mdi:car-coolant-level",water:"mdi:water",weight:"mdi:weight",wind_speed:"mdi:weather-windy"},_e=e=>e.substring(0,e.indexOf(".")),we={10:"mdi:battery-10",20:"mdi:battery-20",30:"mdi:battery-30",40:"mdi:battery-40",50:"mdi:battery-50",60:"mdi:battery-60",70:"mdi:battery-70",80:"mdi:battery-80",90:"mdi:battery-90",100:"mdi:battery"},xe=(e,t)=>{const r=Number(e);if(isNaN(r))return"off"===e?"mdi:battery":"on"===e?"mdi:battery-alert":"mdi:battery-unknown";const i=10*Math.round(r/10);return r<=5?"mdi:battery-alert-variant-outline":we[i]},$e=e=>{const t=e?.attributes.device_class;if(t&&t in ve)return ve[t];if("battery"===t)return e?((e,t)=>{const r=e.state;return xe(r)})(e):"mdi:battery";const r=e?.attributes.unit_of_measurement;return"°C"===r||"°F"===r?"mdi-thermometer":void 0},Me=(e,t,r)=>{const i=t?.state;switch(e){case"alarm_control_panel":return(e=>{switch(e){case"armed_away":return"mdi:shield-lock";case"armed_vacation":return"mdi:shield-airplane";case"armed_home":return"mdi:shield-home";case"armed_night":return"mdi:shield-moon";case"armed_custom_bypass":return"mdi:security";case"pending":return"mdi:shield-outline";case"triggered":return"mdi:bell-ring";case"disarmed":return"mdi:shield-off";default:return"mdi:shield"}})(i);case"automation":return"off"===i?"mdi:robot-off":"mdi:robot";case"binary_sensor":return((e,t)=>{const r="off"===e;switch(t?.attributes.device_class){case"battery":return r?"mdi:battery":"mdi:battery-outline";case"battery_charging":return r?"mdi:battery":"mdi:battery-charging";case"carbon_monoxide":return r?"mdi:smoke-detector":"mdi:smoke-detector-alert";case"cold":return r?"mdi:thermometer":"mdi:Snowflake";case"connectivity":return r?"mdi:close-network-outline":"mdi:check-network-outline";case"door":return r?"mdi:door-closed":"mdi:door-open";case"garage_door":return r?"mdi:garage":"mdi:garage-open";case"power":case"plug":return r?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return r?"mdi:check-circle":"mdi:alert-circle";case"smoke":return r?"mdi:smoke-detector-variant":"mdi:smoke-detector-variant-alert";case"heat":return r?"mdi:thermometer":"mdi:fire";case"light":return r?"mdi:brightness-5":"mdi:brightness-7";case"lock":return r?"mdi:lock":"mdi:lock-open";case"moisture":return r?"mdi:water-off":"mdi:water";case"motion":return r?"mdi:motion-sensor-off":"mdi:motion-sensor";case"occupancy":return r?"mdi:home-outline":"mdi:Home";case"opening":return r?"mdi:square":"mdi:square-outline";case"presence":return r?"mdi:home-outline":"mdi:home";case"running":return r?"mdi:stop":"mdi:play";case"sound":return r?"mdi:music-note-off":"mdi:music-note";case"update":return r?"mdi:package":"mdi:package-up";case"vibration":return r?"mdi:crop-portrait":"mdi:vibrate";case"window":return r?"mdi:window-closed":"mdi:window-open";default:return r?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}})(i,t);case"button":switch(t?.attributes.device_class){case"restart":return"mdi:restart";case"update":return"mdi:package-up";default:return"mdi:gesture-tap-button"}case"camera":return"off"===i?"mdi:video-off":"mdi:video";case"cover":return((e,t)=>{const r="closed"!==e;switch(t?.attributes.device_class){case"garage":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdigarage";default:return"mdi:Garage-open"}case"gate":switch(e){case"opening":case"closing":return"mdi:gate-arrow-right";case"closed":return"mdi:gate";default:return"mdi:gate-open"}case"door":return r?"mdi:door-open":"mdi:door-closed";case"damper":return r?"mdi:circle":"mdi:circle-slice-8";case"shutter":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window-shutter";default:return"mdi:window-shutter-open"}case"curtain":switch(e){case"opening":return"mdi:arrow-split-vertical";case"closing":return"mdi:arrow-collapse-horizontal";case"closed":return"mdi:curtains-closed";default:return"mdi:curtains"}case"blind":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:blinds-horizontal-closed";default:return"mdi:blinds-horizontal"}case"shade":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:roller-shade-closed";default:return"mdi:roller-shade"}case"window":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}}switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}})(i,t);case"device_tracker":return"router"===t?.attributes.source_type?"home"===i?"mdi:lan-connect":"mdi:lan-cisconnect":["bluetooth","bluetooth_le"].includes(t?.attributes.source_type)?"home"===i?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===i?"mdi:account-arrow-right":"mdi:account";case"fan":return"off"===i?"mdi:fan-off":"mdi:fan";case"humidifier":return"off"===i?"mdi:air-humidifier-off":"mdi:air-humidifier";case"input_boolean":return"on"===i?"mdi:check-circle-outline":"mdi:close-circle-outline";case"input_datetime":if(!t?.attributes.has_date)return"mdi:clock";if(!t.attributes.has_time)return"mdi:calendar";break;case"lock":switch(i){case"unlocked":return"mdi:lock-open";case"jammed":return"mdi:lock-alert";case"locking":case"unlocking":return"mdi:lock-clock";default:return"mdi:lock"}case"media_player":switch(t?.attributes.device_class){case"speaker":switch(i){case"playing":return"mdi:speaker-play";case"paused":return"mdi:speaker-pause";case"off":return"mdi:speaker-off";default:return"mdi:speaker"}case"tv":switch(i){case"playing":return"mdi:television-play";case"paused":return"mdi:television-pause";case"off":return"mdi:television-off";default:return"mdi:television"}case"receiver":return"off"===i?"mdi:audio-video-off":"mdi:audio-video";default:switch(i){case"playing":case"paused":return"mdi:cast-connected";case"off":return"mdi:cast-off";default:return"mdi:cast"}}case"number":{const e=(e=>{const t=e?.attributes.device_class;if(t&&t in ve)return ve[t]})(t);if(e)return e;break}case"person":return"not_home"===i?"mdi:account-arrow-right":"mdi:account";case"switch":switch(t?.attributes.device_class){case"outlet":return"on"===i?"mdi:power-plug":"mdi:power-plug-off";case"switch":return"on"===i?"mdi:toggle-switch-variant":"mdi:toggle-switch-variant-off";default:return"mdi:toggle-switch-variant"}case"sensor":{const e=$e(t);if(e)return e;break}case"sun":return"above_horizon"===t?.state?"mdi:white-balance-sunny":"mdi:weather-night";case"switch_as_x":return"mdi:swap-horizontal";case"threshold":return"mdi:chart-sankey";case"water_heater":return"off"===i?"mdi:water-boiler-off":"mdi:water-boiler"}if(e in ye)return ye[e]},ke=e=>{return e?(t=_e(e.entity_id),Me(t,e)||(console.warn(`Unable to find icon for domain ${t}`),be)):be;var t};var Se,Ae,Ee,ze,Ce;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.quote_decimal="quote_decimal",e.space_comma="space_comma",e.none="none"}(Se||(Se={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Ae||(Ae={})),function(e){e.local="local",e.server="server"}(Ee||(Ee={})),function(e){e.language="language",e.system="system",e.DMY="DMY",e.MDY="MDY",e.YMD="YMD"}(ze||(ze={})),function(e){e.language="language",e.monday="monday",e.tuesday="tuesday",e.wednesday="wednesday",e.thursday="thursday",e.friday="friday",e.saturday="saturday",e.sunday="sunday"}(Ce||(Ce={}));const Ne=(e,t,r)=>{const i=t?(e=>{switch(e.number_format){case Se.comma_decimal:return["en-US","en"];case Se.decimal_comma:return["de","es","it"];case Se.space_comma:return["fr","sv","cs"];case Se.quote_decimal:return["de-CH"];case Se.system:return;default:return e.language}})(t):void 0;return t?.number_format===Se.none||Number.isNaN(Number(e))?Number.isNaN(Number(e))||""===e||t?.number_format!==Se.none?[{type:"literal",value:e}]:new Intl.NumberFormat("en-US",Pe(e,{...r,useGrouping:!1})).formatToParts(Number(e)):new Intl.NumberFormat(i,Pe(e,r)).formatToParts(Number(e))},Pe=(e,t)=>{const r={maximumFractionDigits:2,...t};if("string"!=typeof e)return r;if(!t||void 0===t.minimumFractionDigits&&void 0===t.maximumFractionDigits){const t=e.indexOf(".")>-1?e.split(".")[1].length:0;r.minimumFractionDigits=t,r.maximumFractionDigits=t}return r};Intl.DateTimeFormat?.().resolvedOptions?.().timeZone;const Ie="unavailable",Oe=(Te=[Ie,"unknown"],(e,t)=>Te.includes(e,t));var Te;const je=(e,t)=>e&&e.components.includes(t),De=e=>_e(e.entity_id),He={entity:{},entity_component:{}},Re=async(e,t,r)=>((e,t)=>e.sendMessagePromise(t))(e,{type:"frontend/get_icons",category:t,integration:r}),Ve=async(e,t,r,i=!1)=>{if(!i&&r in He.entity)return He.entity[r];if(!je(e,r)||!((e,t,r,i)=>{const[o,a,s]=e.split(".",3);return Number(o)>t||Number(o)===t&&(void 0===i?Number(a)>=r:Number(a)>r)||void 0!==i&&Number(o)===t&&Number(a)===r&&Number(s)>=i})(t.haVersion,2024,2))return;const o=Re(t,"entity",r).then((e=>e?.resources[r]));return He.entity[r]=o,He.entity[r]},Ue=async(e,t,r,i=!1)=>!i&&He.entity_component.resources&&He.entity_component.domains?.includes(r)?He.entity_component.resources.then((e=>e[r])):je(t,r)?(He.entity_component.domains=[...t.components],He.entity_component.resources=Re(e,"entity_component").then((e=>e.resources)),He.entity_component.resources.then((e=>e[r]))):void 0,Fe=new WeakMap,qe=(e,t)=>{if(t)return e&&t.state?.[e]?t.state[e]:void 0!==e&&t.range&&!isNaN(Number(e))?((e,t)=>{let r=Fe.get(t);if(r||(r=Object.keys(t).map(Number).filter((e=>!isNaN(e))).sort(((e,t)=>e-t)),Fe.set(t,r)),0===r.length)return;if(e<r[0])return;let i=r[0];for(const o of r){if(!(e>=o))break;i=o}return t[i.toString()]})(Number(e),t.range)??t.default:t.default},Je=async(e,t,r,i,o)=>{const a=e?.[i.entity_id];if(a?.icon)return a.icon;const s=De(i);return Le(t,r,s,i,o,a)},Le=async(e,t,r,i,o,a)=>{const s=a?.platform,n=a?.translation_key,l=i?.attributes.device_class,c=i?.state;let h;if(n&&s){const i=await Ve(e,t,s);if(i){const e=i[r]?.[n];h=qe(c,e)}}if(!h&&i&&(h=((e,t)=>{const r=De(e),i=t??e.state;switch(r){case"device_tracker":return((e,t)=>{const r=t??e.state;return"router"===e?.attributes.source_type?"home"===r?"mdi:lan-connect":"mdi:lan-disconnect":["bluetooth","bluetooth_le"].includes(e?.attributes.source_type)?"home"===r?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===r?"mdi:account-arrow-right":"mdi:account"})(e,i);case"sun":return"above_horizon"===i?"mdi:white-balance-sunny":"mdi:weather-night";case"input_datetime":if(!e.attributes.has_date)return"mdi:clock";if(!e.attributes.has_time)return"mdi:calendar"}})(i,c)),!h){const i=await Ue(t,e,r);if(i){const e=l&&i[l]||i._;h=qe(c,e)}}return h},Be=async(e,t,r,i)=>{let o;const a=De(t),s=t.attributes.device_class,n=e.entities?.[t.entity_id],l=n?.platform,c=n?.translation_key,h=i??t.attributes[r];if(c&&l){const t=await Ve(e.config,e.connection,l);t&&(o=qe(h,t[a]?.[c]?.state_attributes?.[r]))}if(!o){const t=await Ue(e.connection,e.config,a);if(t){const e=s&&t[s]?.state_attributes?.[r]||t._?.state_attributes?.[r];o=qe(h,e)}}return o},Ge=(e,t)=>{if("number"==typeof e)return 3===t?{mode:"rgb",r:(e>>8&15|e>>4&240)/255,g:(e>>4&15|240&e)/255,b:(15&e|e<<4&240)/255}:4===t?{mode:"rgb",r:(e>>12&15|e>>8&240)/255,g:(e>>8&15|e>>4&240)/255,b:(e>>4&15|240&e)/255,alpha:(15&e|e<<4&240)/255}:6===t?{mode:"rgb",r:(e>>16&255)/255,g:(e>>8&255)/255,b:(255&e)/255}:8===t?{mode:"rgb",r:(e>>24&255)/255,g:(e>>16&255)/255,b:(e>>8&255)/255,alpha:(255&e)/255}:void 0},Ke={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},We=/^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i,Ye="([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)",Xe=`${Ye}%`,Ze=`(?:${Ye}%|${Ye})`,Qe=`(?:${Ye}(deg|grad|rad|turn)|${Ye})`,et="\\s*,\\s*",tt=new RegExp(`^rgba?\\(\\s*${Ye}${et}${Ye}${et}${Ye}\\s*(?:,\\s*${Ze}\\s*)?\\)$`),rt=new RegExp(`^rgba?\\(\\s*${Xe}${et}${Xe}${et}${Xe}\\s*(?:,\\s*${Ze}\\s*)?\\)$`),it=(e="rgb")=>t=>void 0!==(t=((e,t)=>void 0===e?void 0:"object"!=typeof e?Mt(e):void 0!==e.mode?e:t?{...e,mode:t}:void 0)(t,e))?t.mode===e?t:ot[t.mode][e]?ot[t.mode][e](t):"rgb"===e?ot[t.mode].rgb(t):ot.rgb[e](ot[t.mode].rgb(t)):void 0,ot={},at={},st=[],nt={},lt=e=>e,ct=e=>(ot[e.mode]={...ot[e.mode],...e.toMode},Object.keys(e.fromMode||{}).forEach((t=>{ot[t]||(ot[t]={}),ot[t][e.mode]=e.fromMode[t]})),e.ranges||(e.ranges={}),e.difference||(e.difference={}),e.channels.forEach((t=>{if(void 0===e.ranges[t]&&(e.ranges[t]=[0,1]),!e.interpolate[t])throw new Error(`Missing interpolator for: ${t}`);"function"==typeof e.interpolate[t]&&(e.interpolate[t]={use:e.interpolate[t]}),e.interpolate[t].fixup||(e.interpolate[t].fixup=lt)})),at[e.mode]=e,(e.parse||[]).forEach((t=>{ht(t,e.mode)})),it(e.mode)),ht=(e,t)=>{if("string"==typeof e){if(!t)throw new Error("'mode' required when 'parser' is a string");nt[e]=t}else"function"==typeof e&&st.indexOf(e)<0&&st.push(e)},dt=/[^\x00-\x7F]|[a-zA-Z_]/,ut=/[^\x00-\x7F]|[-\w]/,mt={Function:"function",Ident:"ident",Number:"number",Percentage:"percentage",ParenClose:")",None:"none",Hue:"hue",Alpha:"alpha"};let pt=0;function ft(e){let t=e[pt],r=e[pt+1];return"-"===t||"+"===t?/\d/.test(r)||"."===r&&/\d/.test(e[pt+2]):/\d/.test("."===t?r:t)}function gt(e){if(pt>=e.length)return!1;let t=e[pt];if(dt.test(t))return!0;if("-"===t){if(e.length-pt<2)return!1;let t=e[pt+1];return!("-"!==t&&!dt.test(t))}return!1}const bt={deg:1,rad:180/Math.PI,grad:.9,turn:360};function yt(e){let t="";if("-"!==e[pt]&&"+"!==e[pt]||(t+=e[pt++]),t+=vt(e),"."===e[pt]&&/\d/.test(e[pt+1])&&(t+=e[pt++]+vt(e)),"e"!==e[pt]&&"E"!==e[pt]||("-"!==e[pt+1]&&"+"!==e[pt+1]||!/\d/.test(e[pt+2])?/\d/.test(e[pt+1])&&(t+=e[pt++]+vt(e)):t+=e[pt++]+e[pt++]+vt(e)),gt(e)){let r=_t(e);return"deg"===r||"rad"===r||"turn"===r||"grad"===r?{type:mt.Hue,value:t*bt[r]}:void 0}return"%"===e[pt]?(pt++,{type:mt.Percentage,value:+t}):{type:mt.Number,value:+t}}function vt(e){let t="";for(;/\d/.test(e[pt]);)t+=e[pt++];return t}function _t(e){let t="";for(;pt<e.length&&ut.test(e[pt]);)t+=e[pt++];return t}function wt(e){let t=_t(e);return"("===e[pt]?(pt++,{type:mt.Function,value:t}):"none"===t?{type:mt.None,value:void 0}:{type:mt.Ident,value:t}}function xt(e){e._i=0;let t=e[e._i++];if(!t||t.type!==mt.Function||"color"!==t.value)return;if(t=e[e._i++],t.type!==mt.Ident)return;const r=nt[t.value];if(!r)return;const i={mode:r},o=$t(e,!1);if(!o)return;const a=(e=>at[e])(r).channels;for(let s,n,l=0;l<a.length;l++)s=o[l],n=a[l],s.type!==mt.None&&(i[n]=s.type===mt.Number?s.value:s.value/100,"alpha"===n&&(i[n]=Math.max(0,Math.min(1,i[n]))));return i}function $t(e,t){const r=[];let i;for(;e._i<e.length;)if(i=e[e._i++],i.type===mt.None||i.type===mt.Number||i.type===mt.Alpha||i.type===mt.Percentage||t&&i.type===mt.Hue)r.push(i);else{if(i.type!==mt.ParenClose)return;if(e._i<e.length)return}if(!(r.length<3||r.length>4)){if(4===r.length){if(r[3].type!==mt.Alpha)return;r[3]=r[3].value}return 3===r.length&&r.push({type:mt.None,value:void 0}),r.every((e=>e.type!==mt.Alpha))?r:void 0}}const Mt=e=>{if("string"!=typeof e)return;const t=function(e=""){let t,r=e.trim(),i=[];for(pt=0;pt<r.length;)if(t=r[pt++],"\n"!==t&&"\t"!==t&&" "!==t){if(","===t)return;if(")"!==t){if("+"===t){if(pt--,ft(r)){i.push(yt(r));continue}return}if("-"===t){if(pt--,ft(r)){i.push(yt(r));continue}if(gt(r)){i.push({type:mt.Ident,value:_t(r)});continue}return}if("."===t){if(pt--,ft(r)){i.push(yt(r));continue}return}if("/"===t){for(;pt<r.length&&("\n"===r[pt]||"\t"===r[pt]||" "===r[pt]);)pt++;let e;if(ft(r)&&(e=yt(r),e.type!==mt.Hue)){i.push({type:mt.Alpha,value:e});continue}if(gt(r)&&"none"===_t(r)){i.push({type:mt.Alpha,value:{type:mt.None,value:void 0}});continue}return}if(/\d/.test(t))pt--,i.push(yt(r));else{if(!dt.test(t))return;pt--,i.push(wt(r))}}else i.push({type:mt.ParenClose})}else for(;pt<r.length&&("\n"===r[pt]||"\t"===r[pt]||" "===r[pt]);)pt++;return i}(e),r=t?function(e,t){e._i=0;let r=e[e._i++];if(!r||r.type!==mt.Function)return;let i=$t(e,t);return i?(i.unshift(r.value),i):void 0}(t,!0):void 0;let i,o=0,a=st.length;for(;o<a;)if(void 0!==(i=st[o++](e,r)))return i;return t?xt(t):void 0};const kt=(St=(e,t,r)=>e+r*(t-e),e=>{let t=(e=>{let t=[];for(let r=0;r<e.length-1;r++){let i=e[r],o=e[r+1];void 0===i&&void 0===o?t.push(void 0):void 0!==i&&void 0!==o?t.push([i,o]):t.push(void 0!==i?[i,i]:[o,o])}return t})(e);return e=>{let r=e*t.length,i=e>=1?t.length-1:Math.max(Math.floor(r),0),o=t[i];return void 0===o?void 0:St(o[0],o[1],r-i)}});var St;const At=e=>{let t=!1,r=e.map((e=>void 0!==e?(t=!0,e):1));return t?r:e},Et={mode:"rgb",channels:["r","g","b","alpha"],parse:[function(e,t){if(!t||"rgb"!==t[0]&&"rgba"!==t[0])return;const r={mode:"rgb"},[,i,o,a,s]=t;return i.type!==mt.Hue&&o.type!==mt.Hue&&a.type!==mt.Hue?(i.type!==mt.None&&(r.r=i.type===mt.Number?i.value/255:i.value/100),o.type!==mt.None&&(r.g=o.type===mt.Number?o.value/255:o.value/100),a.type!==mt.None&&(r.b=a.type===mt.Number?a.value/255:a.value/100),s.type!==mt.None&&(r.alpha=Math.min(1,Math.max(0,s.type===mt.Number?s.value:s.value/100))),r):void 0},e=>{let t;return(t=e.match(We))?Ge(parseInt(t[1],16),t[1].length):void 0},e=>{let t,r={mode:"rgb"};if(t=e.match(tt))void 0!==t[1]&&(r.r=t[1]/255),void 0!==t[2]&&(r.g=t[2]/255),void 0!==t[3]&&(r.b=t[3]/255);else{if(!(t=e.match(rt)))return;void 0!==t[1]&&(r.r=t[1]/100),void 0!==t[2]&&(r.g=t[2]/100),void 0!==t[3]&&(r.b=t[3]/100)}return void 0!==t[4]?r.alpha=Math.max(0,Math.min(1,t[4]/100)):void 0!==t[5]&&(r.alpha=Math.max(0,Math.min(1,+t[5]))),r},e=>Ge(Ke[e.toLowerCase()],6),e=>"transparent"===e?{mode:"rgb",r:0,g:0,b:0,alpha:0}:void 0,"srgb"],serialize:"srgb",interpolate:{r:kt,g:kt,b:kt,alpha:{use:kt,fixup:At}},gamut:!0,white:{r:1,g:1,b:1},black:{r:0,g:0,b:0}},zt=(e=0)=>Math.pow(Math.abs(e),563/256)*Math.sign(e),Ct=e=>{let t=zt(e.r),r=zt(e.g),i=zt(e.b),o={mode:"xyz65",x:.5766690429101305*t+.1855582379065463*r+.1882286462349947*i,y:.297344975250536*t+.6273635662554661*r+.0752914584939979*i,z:.0270313613864123*t+.0706888525358272*r+.9913375368376386*i};return void 0!==e.alpha&&(o.alpha=e.alpha),o},Nt=e=>Math.pow(Math.abs(e),256/563)*Math.sign(e),Pt=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o={mode:"a98",r:Nt(2.0415879038107465*e-.5650069742788597*t-.3447313507783297*r),g:Nt(-.9692436362808798*e+1.8759675015077206*t+.0415550574071756*r),b:Nt(.0134442806320312*e-.1183623922310184*t+1.0151749943912058*r)};return void 0!==i&&(o.alpha=i),o},It=(e=0)=>{const t=Math.abs(e);return t<=.04045?e/12.92:(Math.sign(e)||1)*Math.pow((t+.055)/1.055,2.4)},Ot=({r:e,g:t,b:r,alpha:i})=>{let o={mode:"lrgb",r:It(e),g:It(t),b:It(r)};return void 0!==i&&(o.alpha=i),o},Tt=e=>{let{r:t,g:r,b:i,alpha:o}=Ot(e),a={mode:"xyz65",x:.4123907992659593*t+.357584339383878*r+.1804807884018343*i,y:.2126390058715102*t+.715168678767756*r+.0721923153607337*i,z:.0193308187155918*t+.119194779794626*r+.9505321522496607*i};return void 0!==o&&(a.alpha=o),a},jt=(e=0)=>{const t=Math.abs(e);return t>.0031308?(Math.sign(e)||1)*(1.055*Math.pow(t,1/2.4)-.055):12.92*e},Dt=({r:e,g:t,b:r,alpha:i},o="rgb")=>{let a={mode:o,r:jt(e),g:jt(t),b:jt(r)};return void 0!==i&&(a.alpha=i),a},Ht=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Dt({r:3.2409699419045226*e-1.537383177570094*t-.4986107602930034*r,g:-.9692436362808796*e+1.8759675015077204*t+.0415550574071756*r,b:.0556300796969936*e-.2039769588889765*t+1.0569715142428784*r});return void 0!==i&&(o.alpha=i),o},Rt={...Et,mode:"a98",parse:["a98-rgb"],serialize:"a98-rgb",fromMode:{rgb:e=>Pt(Tt(e)),xyz65:Pt},toMode:{rgb:e=>Ht(Ct(e)),xyz65:Ct}},Vt=e=>(e%=360)<0?e+360:e,Ut=e=>((e,t)=>e.map(((r,i,o)=>{if(void 0===r)return r;let a=Vt(r);return 0===i||void 0===e[i-1]?a:t(a-Vt(o[i-1]))})).reduce(((e,t)=>e.length&&void 0!==t&&void 0!==e[e.length-1]?(e.push(t+e[e.length-1]),e):(e.push(t),e)),[]))(e,(e=>Math.abs(e)<=180?e:e-360*Math.sign(e))),Ft=[-.14861,1.78277,-.29227,-.90649,1.97294,0],qt=Math.PI/180,Jt=180/Math.PI;let Lt=Ft[3]*Ft[4],Bt=Ft[1]*Ft[4],Gt=Ft[1]*Ft[2]-Ft[0]*Ft[3];const Kt=(e,t)=>{if(void 0===e.h||void 0===t.h||!e.s||!t.s)return 0;let r=Vt(e.h),i=Vt(t.h),o=Math.sin((i-r+360)/2*Math.PI/180);return 2*Math.sqrt(e.s*t.s)*o},Wt=(e,t)=>{if(void 0===e.h||void 0===t.h||!e.c||!t.c)return 0;let r=Vt(e.h),i=Vt(t.h),o=Math.sin((i-r+360)/2*Math.PI/180);return 2*Math.sqrt(e.c*t.c)*o},Yt=e=>{let t=e.reduce(((e,t)=>{if(void 0!==t){let r=t*Math.PI/180;e.sin+=Math.sin(r),e.cos+=Math.cos(r)}return e}),{sin:0,cos:0}),r=180*Math.atan2(t.sin,t.cos)/Math.PI;return r<0?360+r:r},Xt={mode:"cubehelix",channels:["h","s","l","alpha"],parse:["--cubehelix"],serialize:"--cubehelix",ranges:{h:[0,360],s:[0,4.614],l:[0,1]},fromMode:{rgb:({r:e,g:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=(Gt*r+e*Lt-t*Bt)/(Gt+Lt-Bt),a=r-o,s=(Ft[4]*(t-o)-Ft[2]*a)/Ft[3],n={mode:"cubehelix",l:o,s:0===o||1===o?void 0:Math.sqrt(a*a+s*s)/(Ft[4]*o*(1-o))};return n.s&&(n.h=Math.atan2(s,a)*Jt-120),void 0!==i&&(n.alpha=i),n}},toMode:{rgb:({h:e,s:t,l:r,alpha:i})=>{let o={mode:"rgb"};e=(void 0===e?0:e+120)*qt,void 0===r&&(r=0);let a=void 0===t?0:t*r*(1-r),s=Math.cos(e),n=Math.sin(e);return o.r=r+a*(Ft[0]*s+Ft[1]*n),o.g=r+a*(Ft[2]*s+Ft[3]*n),o.b=r+a*(Ft[4]*s+Ft[5]*n),void 0!==i&&(o.alpha=i),o}},interpolate:{h:{use:kt,fixup:Ut},s:kt,l:kt,alpha:{use:kt,fixup:At}},difference:{h:Kt},average:{h:Yt}},Zt=({l:e,a:t,b:r,alpha:i},o="lch")=>{void 0===t&&(t=0),void 0===r&&(r=0);let a=Math.sqrt(t*t+r*r),s={mode:o,l:e,c:a};return a&&(s.h=Vt(180*Math.atan2(r,t)/Math.PI)),void 0!==i&&(s.alpha=i),s},Qt=({l:e,c:t,h:r,alpha:i},o="lab")=>{void 0===r&&(r=0);let a={mode:o,l:e,a:t?t*Math.cos(r/180*Math.PI):0,b:t?t*Math.sin(r/180*Math.PI):0};return void 0!==i&&(a.alpha=i),a},er=Math.pow(29,3)/Math.pow(3,3),tr=Math.pow(6,3)/Math.pow(29,3),rr=.3457/.3585,ir=1,or=.2958/.3585,ar=.3127/.329,sr=1,nr=.3583/.329;let lr=e=>Math.pow(e,3)>tr?Math.pow(e,3):(116*e-16)/er;const cr=({l:e,a:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=(e+16)/116,a=o-r/200,s={mode:"xyz65",x:lr(t/500+o)*ar,y:lr(o)*sr,z:lr(a)*nr};return void 0!==i&&(s.alpha=i),s},hr=e=>Ht(cr(e)),dr=e=>e>tr?Math.cbrt(e):(er*e+16)/116,ur=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=dr(e/ar),a=dr(t/sr),s={mode:"lab65",l:116*a-16,a:500*(o-a),b:200*(a-dr(r/nr))};return void 0!==i&&(s.alpha=i),s},mr=e=>{let t=ur(Tt(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},pr=26/180*Math.PI,fr=Math.cos(pr),gr=Math.sin(pr),br=100/Math.log(1.39),yr=({l:e,c:t,h:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o={mode:"lab65",l:(Math.exp(1*e/br)-1)/.0039},a=(Math.exp(.0435*t*1*1)-1)/.075,s=a*Math.cos(r/180*Math.PI-pr),n=a*Math.sin(r/180*Math.PI-pr);return o.a=s*fr-n/.83*gr,o.b=s*gr+n/.83*fr,void 0!==i&&(o.alpha=i),o},vr=({l:e,a:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=t*fr+r*gr,a=.83*(r*fr-t*gr),s=Math.sqrt(o*o+a*a),n={mode:"dlch",l:br/1*Math.log(1+.0039*e),c:Math.log(1+.075*s)/.0435};return n.c&&(n.h=Vt((Math.atan2(a,o)+pr)/Math.PI*180)),void 0!==i&&(n.alpha=i),n},_r=e=>yr(Zt(e,"dlch")),wr=e=>Qt(vr(e),"dlab"),xr={mode:"dlab",parse:["--din99o-lab"],serialize:"--din99o-lab",toMode:{lab65:_r,rgb:e=>hr(_r(e))},fromMode:{lab65:wr,rgb:e=>wr(mr(e))},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-40.09,45.501],b:[-40.469,44.344]},interpolate:{l:kt,a:kt,b:kt,alpha:{use:kt,fixup:At}}},$r={mode:"dlch",parse:["--din99o-lch"],serialize:"--din99o-lch",toMode:{lab65:yr,dlab:e=>Qt(e,"dlab"),rgb:e=>hr(yr(e))},fromMode:{lab65:vr,dlab:e=>Zt(e,"dlch"),rgb:e=>vr(mr(e))},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,51.484],h:[0,360]},interpolate:{l:kt,c:kt,h:{use:kt,fixup:Ut},alpha:{use:kt,fixup:At}},difference:{h:Wt},average:{h:Yt}};const Mr={mode:"hsi",toMode:{rgb:function({h:e,s:t,i:r,alpha:i}){e=Vt(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let o,a=Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:o={r:r*(1+t*(3/(2-a)-1)),g:r*(1+t*(3*(1-a)/(2-a)-1)),b:r*(1-t)};break;case 1:o={r:r*(1+t*(3*(1-a)/(2-a)-1)),g:r*(1+t*(3/(2-a)-1)),b:r*(1-t)};break;case 2:o={r:r*(1-t),g:r*(1+t*(3/(2-a)-1)),b:r*(1+t*(3*(1-a)/(2-a)-1))};break;case 3:o={r:r*(1-t),g:r*(1+t*(3*(1-a)/(2-a)-1)),b:r*(1+t*(3/(2-a)-1))};break;case 4:o={r:r*(1+t*(3*(1-a)/(2-a)-1)),g:r*(1-t),b:r*(1+t*(3/(2-a)-1))};break;case 5:o={r:r*(1+t*(3/(2-a)-1)),g:r*(1-t),b:r*(1+t*(3*(1-a)/(2-a)-1))};break;default:o={r:r*(1-t),g:r*(1-t),b:r*(1-t)}}return o.mode="rgb",void 0!==i&&(o.alpha=i),o}},parse:["--hsi"],serialize:"--hsi",fromMode:{rgb:function({r:e,g:t,b:r,alpha:i}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.max(e,t,r),a=Math.min(e,t,r),s={mode:"hsi",s:e+t+r===0?0:1-3*a/(e+t+r),i:(e+t+r)/3};return o-a!=0&&(s.h=60*(o===e?(t-r)/(o-a)+6*(t<r):o===t?(r-e)/(o-a)+2:(e-t)/(o-a)+4)),void 0!==i&&(s.alpha=i),s}},channels:["h","s","i","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:kt,fixup:Ut},s:kt,i:kt,alpha:{use:kt,fixup:At}},difference:{h:Kt},average:{h:Yt}};const kr=new RegExp(`^hsla?\\(\\s*${Qe}${et}${Xe}${et}${Xe}\\s*(?:,\\s*${Ze}\\s*)?\\)$`);const Sr={mode:"hsl",toMode:{rgb:function({h:e,s:t,l:r,alpha:i}){e=Vt(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let o,a=r+t*(r<.5?r:1-r),s=a-2*(a-r)*Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:o={r:a,g:s,b:2*r-a};break;case 1:o={r:s,g:a,b:2*r-a};break;case 2:o={r:2*r-a,g:a,b:s};break;case 3:o={r:2*r-a,g:s,b:a};break;case 4:o={r:s,g:2*r-a,b:a};break;case 5:o={r:a,g:2*r-a,b:s};break;default:o={r:2*r-a,g:2*r-a,b:2*r-a}}return o.mode="rgb",void 0!==i&&(o.alpha=i),o}},fromMode:{rgb:function({r:e,g:t,b:r,alpha:i}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.max(e,t,r),a=Math.min(e,t,r),s={mode:"hsl",s:o===a?0:(o-a)/(1-Math.abs(o+a-1)),l:.5*(o+a)};return o-a!=0&&(s.h=60*(o===e?(t-r)/(o-a)+6*(t<r):o===t?(r-e)/(o-a)+2:(e-t)/(o-a)+4)),void 0!==i&&(s.alpha=i),s}},channels:["h","s","l","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(e,t){if(!t||"hsl"!==t[0]&&"hsla"!==t[0])return;const r={mode:"hsl"},[,i,o,a,s]=t;if(i.type!==mt.None){if(i.type===mt.Percentage)return;r.h=i.value}if(o.type!==mt.None){if(o.type===mt.Hue)return;r.s=o.value/100}if(a.type!==mt.None){if(a.type===mt.Hue)return;r.l=a.value/100}return s.type!==mt.None&&(r.alpha=Math.min(1,Math.max(0,s.type===mt.Number?s.value:s.value/100))),r},e=>{let t=e.match(kr);if(!t)return;let r={mode:"hsl"};return void 0!==t[3]?r.h=+t[3]:void 0!==t[1]&&void 0!==t[2]&&(r.h=((e,t)=>{switch(t){case"deg":return+e;case"rad":return e/Math.PI*180;case"grad":return e/10*9;case"turn":return 360*e}})(t[1],t[2])),void 0!==t[4]&&(r.s=Math.min(Math.max(0,t[4]/100),1)),void 0!==t[5]&&(r.l=Math.min(Math.max(0,t[5]/100),1)),void 0!==t[6]?r.alpha=Math.max(0,Math.min(1,t[6]/100)):void 0!==t[7]&&(r.alpha=Math.max(0,Math.min(1,+t[7]))),r}],serialize:e=>`hsl(${void 0!==e.h?e.h:"none"} ${void 0!==e.s?100*e.s+"%":"none"} ${void 0!==e.l?100*e.l+"%":"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:kt,fixup:Ut},s:kt,l:kt,alpha:{use:kt,fixup:At}},difference:{h:Kt},average:{h:Yt}};function Ar({h:e,s:t,v:r,alpha:i}){e=Vt(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let o,a=Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:o={r:r,g:r*(1-t*a),b:r*(1-t)};break;case 1:o={r:r*(1-t*a),g:r,b:r*(1-t)};break;case 2:o={r:r*(1-t),g:r,b:r*(1-t*a)};break;case 3:o={r:r*(1-t),g:r*(1-t*a),b:r};break;case 4:o={r:r*(1-t*a),g:r*(1-t),b:r};break;case 5:o={r:r,g:r*(1-t),b:r*(1-t*a)};break;default:o={r:r*(1-t),g:r*(1-t),b:r*(1-t)}}return o.mode="rgb",void 0!==i&&(o.alpha=i),o}function Er({r:e,g:t,b:r,alpha:i}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.max(e,t,r),a=Math.min(e,t,r),s={mode:"hsv",s:0===o?0:1-a/o,v:o};return o-a!=0&&(s.h=60*(o===e?(t-r)/(o-a)+6*(t<r):o===t?(r-e)/(o-a)+2:(e-t)/(o-a)+4)),void 0!==i&&(s.alpha=i),s}const zr={mode:"hsv",toMode:{rgb:Ar},parse:["--hsv"],serialize:"--hsv",fromMode:{rgb:Er},channels:["h","s","v","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:kt,fixup:Ut},s:kt,v:kt,alpha:{use:kt,fixup:At}},difference:{h:Kt},average:{h:Yt}};const Cr={mode:"hwb",toMode:{rgb:function({h:e,w:t,b:r,alpha:i}){if(void 0===t&&(t=0),void 0===r&&(r=0),t+r>1){let e=t+r;t/=e,r/=e}return Ar({h:e,s:1===r?1:1-t/(1-r),v:1-r,alpha:i})}},fromMode:{rgb:function(e){let t=Er(e);if(void 0===t)return;let r=void 0!==t.s?t.s:0,i=void 0!==t.v?t.v:0,o={mode:"hwb",w:(1-r)*i,b:1-i};return void 0!==t.h&&(o.h=t.h),void 0!==t.alpha&&(o.alpha=t.alpha),o}},channels:["h","w","b","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(e,t){if(!t||"hwb"!==t[0])return;const r={mode:"hwb"},[,i,o,a,s]=t;if(i.type!==mt.None){if(i.type===mt.Percentage)return;r.h=i.value}if(o.type!==mt.None){if(o.type===mt.Hue)return;r.w=o.value/100}if(a.type!==mt.None){if(a.type===mt.Hue)return;r.b=a.value/100}return s.type!==mt.None&&(r.alpha=Math.min(1,Math.max(0,s.type===mt.Number?s.value:s.value/100))),r}],serialize:e=>`hwb(${void 0!==e.h?e.h:"none"} ${void 0!==e.w?100*e.w+"%":"none"} ${void 0!==e.b?100*e.b+"%":"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:kt,fixup:Ut},w:kt,b:kt,alpha:{use:kt,fixup:At}},difference:{h:(e,t)=>{if(void 0===e.h||void 0===t.h)return 0;let r=Vt(e.h),i=Vt(t.h);return Math.abs(i-r)>180?r-(i-360*Math.sign(i-r)):i-r}},average:{h:Yt}},Nr=.1593017578125,Pr=78.84375,Ir=.8359375,Or=18.8515625,Tr=18.6875;function jr(e){if(e<0)return 0;const t=Math.pow(e,1/Pr);return 1e4*Math.pow(Math.max(0,t-Ir)/(Or-Tr*t),1/Nr)}function Dr(e){if(e<0)return 0;const t=Math.pow(e/1e4,Nr);return Math.pow((Ir+Or*t)/(1+Tr*t),Pr)}const Hr=e=>Math.max(e/203,0),Rr=({i:e,t:t,p:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const o=jr(e+.008609037037932761*t+.11102962500302593*r),a=jr(e-.00860903703793275*t-.11102962500302599*r),s=jr(e+.5600313357106791*t-.32062717498731885*r),n={mode:"xyz65",x:Hr(2.070152218389422*o-1.3263473389671556*a+.2066510476294051*s),y:Hr(.3647385209748074*o+.680566024947227*a-.0453045459220346*s),z:Hr(-.049747207535812*o-.0492609666966138*a+1.1880659249923042*s)};return void 0!==i&&(n.alpha=i),n},Vr=(e=0)=>Math.max(203*e,0),Ur=({x:e,y:t,z:r,alpha:i})=>{const o=Vr(e),a=Vr(t),s=Vr(r),n=Dr(.3592832590121217*o+.6976051147779502*a-.0358915932320289*s),l=Dr(-.1920808463704995*o+1.1004767970374323*a+.0753748658519118*s),c=Dr(.0070797844607477*o+.0748396662186366*a+.8433265453898765*s),h={mode:"itp",i:.5*n+.5*l,t:1.61376953125*n-3.323486328125*l+1.709716796875*c,p:4.378173828125*n-4.24560546875*l-.132568359375*c};return void 0!==i&&(h.alpha=i),h},Fr={mode:"itp",channels:["i","t","p","alpha"],parse:["--ictcp"],serialize:"--ictcp",toMode:{xyz65:Rr,rgb:e=>Ht(Rr(e))},fromMode:{xyz65:Ur,rgb:e=>Ur(Tt(e))},ranges:{i:[0,.581],t:[-.369,.272],p:[-.164,.331]},interpolate:{i:kt,t:kt,p:kt,alpha:{use:kt,fixup:At}}},qr=e=>{if(e<0)return 0;let t=Math.pow(e/1e4,Nr);return Math.pow((Ir+Or*t)/(1+Tr*t),134.03437499999998)},Jr=(e=0)=>Math.max(203*e,0),Lr=({x:e,y:t,z:r,alpha:i})=>{e=Jr(e),t=Jr(t);let o=1.15*e-.15*(r=Jr(r)),a=.66*t+.34*e,s=qr(.41478972*o+.579999*a+.014648*r),n=qr(-.20151*o+1.120649*a+.0531008*r),l=qr(-.0166008*o+.2648*a+.6684799*r),c=(s+n)/2,h={mode:"jab",j:.44*c/(1-.56*c)-16295499532821565e-27,a:3.524*s-4.066708*n+.542708*l,b:.199076*s+1.096799*n-1.295875*l};return void 0!==i&&(h.alpha=i),h},Br=16295499532821565e-27,Gr=e=>{if(e<0)return 0;let t=Math.pow(e,.007460772656268216);return 1e4*Math.pow((Ir-t)/(Tr*t-Or),1/Nr)},Kr=e=>e/203,Wr=({j:e,a:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=(e+Br)/(.44+.56*(e+Br)),a=Gr(o+.13860504*t+.058047316*r),s=Gr(o-.13860504*t-.058047316*r),n=Gr(o-.096019242*t-.8118919*r),l={mode:"xyz65",x:Kr(1.661373024652174*a-.914523081304348*s+.23136208173913045*n),y:Kr(-.3250758611844533*a+1.571847026732543*s-.21825383453227928*n),z:Kr(-.090982811*a-.31272829*s+1.5227666*n)};return void 0!==i&&(l.alpha=i),l},Yr=e=>{let t=Lr(Tt(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},Xr=e=>Ht(Wr(e)),Zr={mode:"jab",channels:["j","a","b","alpha"],parse:["--jzazbz"],serialize:"--jzazbz",fromMode:{rgb:Yr,xyz65:Lr},toMode:{rgb:Xr,xyz65:Wr},ranges:{j:[0,.222],a:[-.109,.129],b:[-.185,.134]},interpolate:{j:kt,a:kt,b:kt,alpha:{use:kt,fixup:At}}},Qr=({j:e,a:t,b:r,alpha:i})=>{void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.sqrt(t*t+r*r),a={mode:"jch",j:e,c:o};return o&&(a.h=Vt(180*Math.atan2(r,t)/Math.PI)),void 0!==i&&(a.alpha=i),a},ei=({j:e,c:t,h:r,alpha:i})=>{void 0===r&&(r=0);let o={mode:"jab",j:e,a:t?t*Math.cos(r/180*Math.PI):0,b:t?t*Math.sin(r/180*Math.PI):0};return void 0!==i&&(o.alpha=i),o},ti={mode:"jch",parse:["--jzczhz"],serialize:"--jzczhz",toMode:{jab:ei,rgb:e=>Xr(ei(e))},fromMode:{rgb:e=>Qr(Yr(e)),jab:Qr},channels:["j","c","h","alpha"],ranges:{j:[0,.221],c:[0,.19],h:[0,360]},interpolate:{h:{use:kt,fixup:Ut},c:kt,j:kt,alpha:{use:kt,fixup:At}},difference:{h:Wt},average:{h:Yt}},ri=Math.pow(29,3)/Math.pow(3,3),ii=Math.pow(6,3)/Math.pow(29,3);let oi=e=>Math.pow(e,3)>ii?Math.pow(e,3):(116*e-16)/ri;const ai=({l:e,a:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=(e+16)/116,a=o-r/200,s={mode:"xyz50",x:oi(t/500+o)*rr,y:oi(o)*ir,z:oi(a)*or};return void 0!==i&&(s.alpha=i),s},si=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Dt({r:3.1341359569958707*e-1.6173863321612538*t-.4906619460083532*r,g:-.978795502912089*e+1.916254567259524*t+.03344273116131949*r,b:.07195537988411677*e-.2289768264158322*t+1.405386058324125*r});return void 0!==i&&(o.alpha=i),o},ni=e=>si(ai(e)),li=e=>{let{r:t,g:r,b:i,alpha:o}=Ot(e),a={mode:"xyz50",x:.436065742824811*t+.3851514688337912*r+.14307845442264197*i,y:.22249319175623702*t+.7168870538238823*r+.06061979053616537*i,z:.013923904500943465*t+.09708128566574634*r+.7140993584005155*i};return void 0!==o&&(a.alpha=o),a},ci=e=>e>ii?Math.cbrt(e):(ri*e+16)/116,hi=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=ci(e/rr),a=ci(t/ir),s={mode:"lab",l:116*a-16,a:500*(o-a),b:200*(a-ci(r/or))};return void 0!==i&&(s.alpha=i),s},di=e=>{let t=hi(li(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t};const ui={mode:"lab",toMode:{xyz50:ai,rgb:ni},fromMode:{xyz50:hi,rgb:di},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-125,125],b:[-125,125]},parse:[function(e,t){if(!t||"lab"!==t[0])return;const r={mode:"lab"},[,i,o,a,s]=t;return i.type!==mt.Hue&&o.type!==mt.Hue&&a.type!==mt.Hue?(i.type!==mt.None&&(r.l=Math.min(Math.max(0,i.value),100)),o.type!==mt.None&&(r.a=o.type===mt.Number?o.value:125*o.value/100),a.type!==mt.None&&(r.b=a.type===mt.Number?a.value:125*a.value/100),s.type!==mt.None&&(r.alpha=Math.min(1,Math.max(0,s.type===mt.Number?s.value:s.value/100))),r):void 0}],serialize:e=>`lab(${void 0!==e.l?e.l:"none"} ${void 0!==e.a?e.a:"none"} ${void 0!==e.b?e.b:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{l:kt,a:kt,b:kt,alpha:{use:kt,fixup:At}}},mi={...ui,mode:"lab65",parse:["--lab-d65"],serialize:"--lab-d65",toMode:{xyz65:cr,rgb:hr},fromMode:{xyz65:ur,rgb:mr},ranges:{l:[0,100],a:[-125,125],b:[-125,125]}};const pi={mode:"lch",toMode:{lab:Qt,rgb:e=>ni(Qt(e))},fromMode:{rgb:e=>Zt(di(e)),lab:Zt},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,150],h:[0,360]},parse:[function(e,t){if(!t||"lch"!==t[0])return;const r={mode:"lch"},[,i,o,a,s]=t;if(i.type!==mt.None){if(i.type===mt.Hue)return;r.l=Math.min(Math.max(0,i.value),100)}if(o.type!==mt.None&&(r.c=Math.max(0,o.type===mt.Number?o.value:150*o.value/100)),a.type!==mt.None){if(a.type===mt.Percentage)return;r.h=a.value}return s.type!==mt.None&&(r.alpha=Math.min(1,Math.max(0,s.type===mt.Number?s.value:s.value/100))),r}],serialize:e=>`lch(${void 0!==e.l?e.l:"none"} ${void 0!==e.c?e.c:"none"} ${void 0!==e.h?e.h:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:kt,fixup:Ut},c:kt,l:kt,alpha:{use:kt,fixup:At}},difference:{h:Wt},average:{h:Yt}},fi={...pi,mode:"lch65",parse:["--lch-d65"],serialize:"--lch-d65",toMode:{lab65:e=>Qt(e,"lab65"),rgb:e=>hr(Qt(e,"lab65"))},fromMode:{rgb:e=>Zt(mr(e),"lch65"),lab65:e=>Zt(e,"lch65")},ranges:{l:[0,100],c:[0,150],h:[0,360]}},gi=({l:e,u:t,v:r,alpha:i})=>{void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.sqrt(t*t+r*r),a={mode:"lchuv",l:e,c:o};return o&&(a.h=Vt(180*Math.atan2(r,t)/Math.PI)),void 0!==i&&(a.alpha=i),a},bi=({l:e,c:t,h:r,alpha:i})=>{void 0===r&&(r=0);let o={mode:"luv",l:e,u:t?t*Math.cos(r/180*Math.PI):0,v:t?t*Math.sin(r/180*Math.PI):0};return void 0!==i&&(o.alpha=i),o},yi=(e,t,r)=>4*e/(e+15*t+3*r),vi=(e,t,r)=>9*t/(e+15*t+3*r),_i=yi(rr,ir,or),wi=vi(rr,ir,or),xi=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=(a=t/ir)<=ii?ri*a:116*Math.cbrt(a)-16;var a;let s=yi(e,t,r),n=vi(e,t,r);isFinite(s)&&isFinite(n)?(s=13*o*(s-_i),n=13*o*(n-wi)):o=s=n=0;let l={mode:"luv",l:o,u:s,v:n};return void 0!==i&&(l.alpha=i),l},$i=((e,t,r)=>4*e/(e+15*t+3*r))(rr,ir,or),Mi=((e,t,r)=>9*t/(e+15*t+3*r))(rr,ir,or),ki=({l:e,u:t,v:r,alpha:i})=>{if(void 0===e&&(e=0),0===e)return{mode:"xyz50",x:0,y:0,z:0};void 0===t&&(t=0),void 0===r&&(r=0);let o=t/(13*e)+$i,a=r/(13*e)+Mi,s=ir*(e<=8?e/ri:Math.pow((e+16)/116,3)),n={mode:"xyz50",x:s*(9*o)/(4*a),y:s,z:s*(12-3*o-20*a)/(4*a)};return void 0!==i&&(n.alpha=i),n},Si={mode:"lchuv",toMode:{luv:bi,rgb:e=>si(ki(bi(e)))},fromMode:{rgb:e=>gi(xi(li(e))),luv:gi},channels:["l","c","h","alpha"],parse:["--lchuv"],serialize:"--lchuv",ranges:{l:[0,100],c:[0,176.956],h:[0,360]},interpolate:{h:{use:kt,fixup:Ut},c:kt,l:kt,alpha:{use:kt,fixup:At}},difference:{h:Wt},average:{h:Yt}},Ai={...Et,mode:"lrgb",toMode:{rgb:Dt},fromMode:{rgb:Ot},parse:["srgb-linear"],serialize:"srgb-linear"},Ei={mode:"luv",toMode:{xyz50:ki,rgb:e=>si(ki(e))},fromMode:{xyz50:xi,rgb:e=>xi(li(e))},channels:["l","u","v","alpha"],parse:["--luv"],serialize:"--luv",ranges:{l:[0,100],u:[-84.936,175.042],v:[-125.882,87.243]},interpolate:{l:kt,u:kt,v:kt,alpha:{use:kt,fixup:At}}},zi=({r:e,g:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.cbrt(.412221469470763*e+.5363325372617348*t+.0514459932675022*r),a=Math.cbrt(.2119034958178252*e+.6806995506452344*t+.1073969535369406*r),s=Math.cbrt(.0883024591900564*e+.2817188391361215*t+.6299787016738222*r),n={mode:"oklab",l:.210454268309314*o+.7936177747023054*a-.0040720430116193*s,a:1.9779985324311684*o-2.42859224204858*a+.450593709617411*s,b:.0259040424655478*o+.7827717124575296*a-.8086757549230774*s};return void 0!==i&&(n.alpha=i),n},Ci=e=>{let t=zi(Ot(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},Ni=({l:e,a:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Math.pow(e+.3963377773761749*t+.2158037573099136*r,3),a=Math.pow(e-.1055613458156586*t-.0638541728258133*r,3),s=Math.pow(e-.0894841775298119*t-1.2914855480194092*r,3),n={mode:"lrgb",r:4.076741636075957*o-3.3077115392580616*a+.2309699031821044*s,g:-1.2684379732850317*o+2.6097573492876887*a-.3413193760026573*s,b:-.0041960761386756*o-.7034186179359362*a+1.7076146940746117*s};return void 0!==i&&(n.alpha=i),n},Pi=e=>Dt(Ni(e));function Ii(e){const t=.206,r=1.206/1.03;return.5*(r*e-t+Math.sqrt((r*e-t)*(r*e-t)+.12*r*e))}function Oi(e){return(e*e+.206*e)/(1.206/1.03*(e+.03))}function Ti(e,t){let r=function(e,t){let r,i,o,a,s,n,l,c;-1.88170328*e-.80936493*t>1?(r=1.19086277,i=1.76576728,o=.59662641,a=.75515197,s=.56771245,n=4.0767416621,l=-3.3077115913,c=.2309699292):1.81444104*e-1.19445276*t>1?(r=.73956515,i=-.45954404,o=.08285427,a=.1254107,s=.14503204,n=-1.2684380046,l=2.6097574011,c=-.3413193965):(r=1.35733652,i=-.00915799,o=-1.1513021,a=-.50559606,s=.00692167,n=-.0041960863,l=-.7034186147,c=1.707614701);let h=r+i*e+o*t+a*e*e+s*e*t,d=.3963377774*e+.2158037573*t,u=-.1055613458*e-.0638541728*t,m=-.0894841775*e-1.291485548*t;{let e=1+h*d,t=1+h*u,r=1+h*m,i=n*(e*e*e)+l*(t*t*t)+c*(r*r*r),o=n*(3*d*e*e)+l*(3*u*t*t)+c*(3*m*r*r);h-=i*o/(o*o-.5*i*(n*(6*d*d*e)+l*(6*u*u*t)+c*(6*m*m*r)))}return h}(e,t),i=Ni({l:1,a:r*e,b:r*t}),o=Math.cbrt(1/Math.max(i.r,i.g,i.b));return[o,o*r]}function ji(e,t,r=null){r||(r=Ti(e,t));let i=r[0],o=r[1];return[o/i,o/(1-i)]}function Di(e,t,r){let i=Ti(t,r),o=function(e,t,r,i,o,a=null){let s;if(a||(a=Ti(e,t)),(r-o)*a[1]-(a[0]-o)*i<=0)s=a[1]*o/(i*a[0]+a[1]*(o-r));else{s=a[1]*(o-1)/(i*(a[0]-1)+a[1]*(o-r));{let a=r-o,n=.3963377774*e+.2158037573*t,l=-.1055613458*e-.0638541728*t,c=-.0894841775*e-1.291485548*t,h=a+i*n,d=a+i*l,u=a+i*c;{let e=o*(1-s)+s*r,t=s*i,a=e+t*n,m=e+t*l,p=e+t*c,f=a*a*a,g=m*m*m,b=p*p*p,y=3*h*a*a,v=3*d*m*m,_=3*u*p*p,w=6*h*h*a,x=6*d*d*m,$=6*u*u*p,M=4.0767416621*f-3.3077115913*g+.2309699292*b-1,k=4.0767416621*y-3.3077115913*v+.2309699292*_,S=k/(k*k-.5*M*(4.0767416621*w-3.3077115913*x+.2309699292*$)),A=-M*S,E=-1.2684380046*f+2.6097574011*g-.3413193965*b-1,z=-1.2684380046*y+2.6097574011*v-.3413193965*_,C=z/(z*z-.5*E*(-1.2684380046*w+2.6097574011*x-.3413193965*$)),N=-E*C,P=-.0041960863*f-.7034186147*g+1.707614701*b-1,I=-.0041960863*y-.7034186147*v+1.707614701*_,O=I/(I*I-.5*P*(-.0041960863*w-.7034186147*x+1.707614701*$)),T=-P*O;A=S>=0?A:1e6,N=C>=0?N:1e6,T=O>=0?T:1e6,s+=Math.min(A,Math.min(N,T))}}}return s}(t,r,e,1,e,i),a=ji(t,r,i),s=e*(.11516993+1/(7.4477897+4.1590124*r+t*(1.75198401*r-2.19557347+t*(-2.13704948-10.02301043*r+t*(5.38770819*r-4.24894561+4.69891013*t))))),n=(1-e)*(.11239642+1/(1.6132032-.68124379*r+t*(.40370612+.90148123*r+t*(.6122399*r-.27087943+t*(.00299215-.45399568*r-.14661872*t))))),l=.9*(o/Math.min(e*a[0],(1-e)*a[1]))*Math.sqrt(Math.sqrt(1/(1/(s*s*s*s)+1/(n*n*n*n))));return s=.4*e,n=.8*(1-e),[Math.sqrt(1/(1/(s*s)+1/(n*n))),l,o]}function Hi(e){const t=void 0!==e.l?e.l:0,r=void 0!==e.a?e.a:0,i=void 0!==e.b?e.b:0,o={mode:"okhsl",l:Ii(t)};void 0!==e.alpha&&(o.alpha=e.alpha);let a=Math.sqrt(r*r+i*i);if(!a)return o.s=0,o;let s,[n,l,c]=Di(t,r/a,i/a);if(a<l){let e=0,t=.8*n;s=.8*((a-e)/(t+(1-t/l)*(a-e)))}else{let e=.2*l*l*1.25*1.25/n;s=.8+.2*((a-l)/(e+(1-e/(c-l))*(a-l)))}return s&&(o.s=s,o.h=Vt(180*Math.atan2(i,r)/Math.PI)),o}function Ri(e){let t=void 0!==e.h?e.h:0,r=void 0!==e.s?e.s:0,i=void 0!==e.l?e.l:0;const o={mode:"oklab",l:Oi(i)};if(void 0!==e.alpha&&(o.alpha=e.alpha),!r||1===i)return o.a=o.b=0,o;let a,s,n,l,c=Math.cos(t/180*Math.PI),h=Math.sin(t/180*Math.PI),[d,u,m]=Di(o.l,c,h);r<.8?(a=1.25*r,s=0,n=.8*d,l=1-n/u):(a=5*(r-.8),s=u,n=.2*u*u*1.25*1.25/d,l=1-n/(m-u));let p=s+a*n/(1-l*a);return o.a=p*c,o.b=p*h,o}const Vi={...Sr,mode:"okhsl",channels:["h","s","l","alpha"],parse:["--okhsl"],serialize:"--okhsl",fromMode:{oklab:Hi,rgb:e=>Hi(Ci(e))},toMode:{oklab:Ri,rgb:e=>Pi(Ri(e))}};function Ui(e){let t=void 0!==e.l?e.l:0,r=void 0!==e.a?e.a:0,i=void 0!==e.b?e.b:0,o=Math.sqrt(r*r+i*i),a=o?r/o:1,s=o?i/o:1,[n,l]=ji(a,s),c=1-.5/n,h=l/(o+t*l),d=h*t,u=h*o,m=Oi(d),p=u*m/d,f=Ni({l:m,a:a*p,b:s*p}),g=Math.cbrt(1/Math.max(f.r,f.g,f.b,0));t/=g,o=o/g*Ii(t)/t,t=Ii(t);const b={mode:"okhsv",s:o?(.5+l)*u/(.5*l+l*c*u):0,v:t?t/d:0};return b.s&&(b.h=Vt(180*Math.atan2(i,r)/Math.PI)),void 0!==e.alpha&&(b.alpha=e.alpha),b}function Fi(e){const t={mode:"oklab"};void 0!==e.alpha&&(t.alpha=e.alpha);const r=void 0!==e.h?e.h:0,i=void 0!==e.s?e.s:0,o=void 0!==e.v?e.v:0,a=Math.cos(r/180*Math.PI),s=Math.sin(r/180*Math.PI),[n,l]=ji(a,s),c=.5,h=1-c/n,d=1-i*c/(c+l-l*h*i),u=i*l*c/(c+l-l*h*i),m=Oi(d),p=u*m/d,f=Ni({l:m,a:a*p,b:s*p}),g=Math.cbrt(1/Math.max(f.r,f.g,f.b,0)),b=Oi(o*d),y=u*b/d;return t.l=b*g,t.a=y*a*g,t.b=y*s*g,t}const qi={...zr,mode:"okhsv",channels:["h","s","v","alpha"],parse:["--okhsv"],serialize:"--okhsv",fromMode:{oklab:Ui,rgb:e=>Ui(Ci(e))},toMode:{oklab:Fi,rgb:e=>Pi(Fi(e))}};const Ji={...ui,mode:"oklab",toMode:{lrgb:Ni,rgb:Pi},fromMode:{lrgb:zi,rgb:Ci},ranges:{l:[0,1],a:[-.4,.4],b:[-.4,.4]},parse:[function(e,t){if(!t||"oklab"!==t[0])return;const r={mode:"oklab"},[,i,o,a,s]=t;return i.type!==mt.Hue&&o.type!==mt.Hue&&a.type!==mt.Hue?(i.type!==mt.None&&(r.l=Math.min(Math.max(0,i.type===mt.Number?i.value:i.value/100),1)),o.type!==mt.None&&(r.a=o.type===mt.Number?o.value:.4*o.value/100),a.type!==mt.None&&(r.b=a.type===mt.Number?a.value:.4*a.value/100),s.type!==mt.None&&(r.alpha=Math.min(1,Math.max(0,s.type===mt.Number?s.value:s.value/100))),r):void 0}],serialize:e=>`oklab(${void 0!==e.l?e.l:"none"} ${void 0!==e.a?e.a:"none"} ${void 0!==e.b?e.b:"none"}${e.alpha<1?` / ${e.alpha}`:""})`};const Li={...pi,mode:"oklch",toMode:{oklab:e=>Qt(e,"oklab"),rgb:e=>Pi(Qt(e,"oklab"))},fromMode:{rgb:e=>Zt(Ci(e),"oklch"),oklab:e=>Zt(e,"oklch")},parse:[function(e,t){if(!t||"oklch"!==t[0])return;const r={mode:"oklch"},[,i,o,a,s]=t;if(i.type!==mt.None){if(i.type===mt.Hue)return;r.l=Math.min(Math.max(0,i.type===mt.Number?i.value:i.value/100),1)}if(o.type!==mt.None&&(r.c=Math.max(0,o.type===mt.Number?o.value:.4*o.value/100)),a.type!==mt.None){if(a.type===mt.Percentage)return;r.h=a.value}return s.type!==mt.None&&(r.alpha=Math.min(1,Math.max(0,s.type===mt.Number?s.value:s.value/100))),r}],serialize:e=>`oklch(${void 0!==e.l?e.l:"none"} ${void 0!==e.c?e.c:"none"} ${void 0!==e.h?e.h:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,ranges:{l:[0,1],c:[0,.4],h:[0,360]}},Bi=e=>{let{r:t,g:r,b:i,alpha:o}=Ot(e),a={mode:"xyz65",x:.486570948648216*t+.265667693169093*r+.1982172852343625*i,y:.2289745640697487*t+.6917385218365062*r+.079286914093745*i,z:0*t+.0451133818589026*r+1.043944368900976*i};return void 0!==o&&(a.alpha=o),a},Gi=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o=Dt({r:2.4934969119414263*e-.9313836179191242*t-.402710784450717*r,g:-.8294889695615749*e+1.7626640603183465*t+.0236246858419436*r,b:.0358458302437845*e-.0761723892680418*t+.9568845240076871*r},"p3");return void 0!==i&&(o.alpha=i),o},Ki={...Et,mode:"p3",parse:["display-p3"],serialize:"display-p3",fromMode:{rgb:e=>Gi(Tt(e)),xyz65:Gi},toMode:{rgb:e=>Ht(Bi(e)),xyz65:Bi}},Wi=e=>{let t=Math.abs(e);return t>=1/512?Math.sign(e)*Math.pow(t,1/1.8):16*e},Yi=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o={mode:"prophoto",r:Wi(1.3457868816471585*e-.2555720873797946*t-.0511018649755453*r),g:Wi(-.5446307051249019*e+1.5082477428451466*t+.0205274474364214*r),b:Wi(0*e+0*t+1.2119675456389452*r)};return void 0!==i&&(o.alpha=i),o},Xi=(e=0)=>{let t=Math.abs(e);return t>=16/512?Math.sign(e)*Math.pow(t,1.8):e/16},Zi=e=>{let t=Xi(e.r),r=Xi(e.g),i=Xi(e.b),o={mode:"xyz50",x:.7977666449006423*t+.1351812974005331*r+.0313477341283922*i,y:.2880748288194013*t+.7118352342418731*r+899369387256e-16*i,z:0*t+0*r+.8251046025104602*i};return void 0!==e.alpha&&(o.alpha=e.alpha),o},Qi={...Et,mode:"prophoto",parse:["prophoto-rgb"],serialize:"prophoto-rgb",fromMode:{xyz50:Yi,rgb:e=>Yi(li(e))},toMode:{xyz50:Zi,rgb:e=>si(Zi(e))}},eo=1.09929682680944,to=e=>{const t=Math.abs(e);return t>.018053968510807?(Math.sign(e)||1)*(eo*Math.pow(t,.45)-(eo-1)):4.5*e},ro=({x:e,y:t,z:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let o={mode:"rec2020",r:to(1.7166511879712683*e-.3556707837763925*t-.2533662813736599*r),g:to(-.6666843518324893*e+1.6164812366349395*t+.0157685458139111*r),b:to(.0176398574453108*e-.0427706132578085*t+.9421031212354739*r)};return void 0!==i&&(o.alpha=i),o},io=1.09929682680944,oo=(e=0)=>{let t=Math.abs(e);return t<.08124285829863151?e/4.5:(Math.sign(e)||1)*Math.pow((t+io-1)/io,1/.45)},ao=e=>{let t=oo(e.r),r=oo(e.g),i=oo(e.b),o={mode:"xyz65",x:.6369580483012911*t+.1446169035862083*r+.1688809751641721*i,y:.262700212011267*t+.6779980715188708*r+.059301716469862*i,z:0*t+.0280726930490874*r+1.0609850577107909*i};return void 0!==e.alpha&&(o.alpha=e.alpha),o},so={...Et,mode:"rec2020",fromMode:{xyz65:ro,rgb:e=>ro(Tt(e))},toMode:{xyz65:ao,rgb:e=>Ht(ao(e))},parse:["rec2020"],serialize:"rec2020"},no=.0037930732552754493,lo=Math.cbrt(no),co=e=>Math.cbrt(e)-lo,ho=e=>Math.pow(e+lo,3),uo={mode:"xyb",channels:["x","y","b","alpha"],parse:["--xyb"],serialize:"--xyb",toMode:{rgb:({x:e,y:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const o=ho(e+t)-no,a=ho(t-e)-no,s=ho(r+t)-no,n=Dt({r:11.031566904639861*o-9.866943908131562*a-.16462299650829934*s,g:-3.2541473810744237*o+4.418770377582723*a-.16462299650829934*s,b:-3.6588512867136815*o+2.7129230459360922*a+1.9459282407775895*s});return void 0!==i&&(n.alpha=i),n}},fromMode:{rgb:e=>{const{r:t,g:r,b:i,alpha:o}=Ot(e),a=co(.3*t+.622*r+.078*i+no),s=co(.23*t+.692*r+.078*i+no),n={mode:"xyb",x:(a-s)/2,y:(a+s)/2,b:co(.2434226892454782*t+.2047674442449682*r+.5518098665095535*i+no)-(a+s)/2};return void 0!==o&&(n.alpha=o),n}},ranges:{x:[-.0154,.0281],y:[0,.8453],b:[-.2778,.388]},interpolate:{x:kt,y:kt,b:kt,alpha:{use:kt,fixup:At}}},mo={mode:"xyz50",parse:["xyz-d50"],serialize:"xyz-d50",toMode:{rgb:si,lab:hi},fromMode:{rgb:li,lab:ai},channels:["x","y","z","alpha"],ranges:{x:[0,.964],y:[0,.999],z:[0,.825]},interpolate:{x:kt,y:kt,z:kt,alpha:{use:kt,fixup:At}}},po={mode:"xyz65",toMode:{rgb:Ht,xyz50:e=>{let{x:t,y:r,z:i,alpha:o}=e;void 0===t&&(t=0),void 0===r&&(r=0),void 0===i&&(i=0);let a={mode:"xyz50",x:1.0479298208405488*t+.0229467933410191*r-.0501922295431356*i,y:.0296278156881593*t+.990434484573249*r-.0170738250293851*i,z:-.0092430581525912*t+.0150551448965779*r+.7518742899580008*i};return void 0!==o&&(a.alpha=o),a}},fromMode:{rgb:Tt,xyz50:e=>{let{x:t,y:r,z:i,alpha:o}=e;void 0===t&&(t=0),void 0===r&&(r=0),void 0===i&&(i=0);let a={mode:"xyz65",x:.9554734527042182*t-.0230985368742614*r+.0632593086610217*i,y:-.0283697069632081*t+1.0099954580058226*r+.021041398966943*i,z:.0123140016883199*t-.0205076964334779*r+1.3303659366080753*i};return void 0!==o&&(a.alpha=o),a}},ranges:{x:[0,.95],y:[0,1],z:[0,1.088]},channels:["x","y","z","alpha"],parse:["xyz","xyz-d65"],serialize:"xyz-d65",interpolate:{x:kt,y:kt,z:kt,alpha:{use:kt,fixup:At}}},fo={mode:"yiq",toMode:{rgb:({y:e,i:t,q:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const o={mode:"rgb",r:e+.95608445*t+.6208885*r,g:e-.27137664*t-.6486059*r,b:e-1.10561724*t+1.70250126*r};return void 0!==i&&(o.alpha=i),o}},fromMode:{rgb:({r:e,g:t,b:r,alpha:i})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const o={mode:"yiq",y:.29889531*e+.58662247*t+.11448223*r,i:.59597799*e-.2741761*t-.32180189*r,q:.21147017*e-.52261711*t+.31114694*r};return void 0!==i&&(o.alpha=i),o}},channels:["y","i","q","alpha"],parse:["--yiq"],serialize:"--yiq",ranges:{i:[-.595,.595],q:[-.522,.522]},interpolate:{y:kt,i:kt,q:kt,alpha:{use:kt,fixup:At}}};ct(Rt),ct(Xt),ct(xr),ct($r),ct(Mr),ct(Sr),ct(zr),ct(Cr),ct(Fr),ct(Zr),ct(ti),ct(ui),ct(mi),ct(pi),ct(fi),ct(Si),ct(Ai),ct(Ei),ct(Vi),ct(qi),ct(Ji),ct(Li),ct(Ki),ct(Qi),ct(so),ct(Et),ct(uo),ct(mo),ct(po),ct(fo);const go=e=>{const t=Math.round(Math.min(Math.max(e,0),255)).toString(16);return 1===t.length?`0${t}`:t},bo=e=>`#${go(e[0])}${go(e[1])}${go(e[2])}`,yo=e=>{const[t,r,i]=e,o=Math.max(t,r,i),a=o-Math.min(t,r,i),s=a&&(o===t?(r-i)/a:o===r?2+(i-t)/a:4+(t-r)/a);return[60*(s<0?s+6:s),o&&a/o,o]},vo=e=>{const[t,r,i]=e,o=e=>{const o=(e+t/60)%6;return i-i*r*Math.max(Math.min(o,4-o,1),0)};return[o(5),o(3),o(1)]},_o=e=>vo([e[0],e[1],255]),wo=(e,t,r)=>Math.min(Math.max(e,t),r),xo=e=>{const t=e/100;return[Math.round($o(t)),Math.round(Mo(t)),Math.round(ko(t))]},$o=e=>{if(e<=66)return 255;return wo(329.698727446*(e-60)**-.1332047592,0,255)},Mo=e=>{let t;return t=e<=66?99.4708025861*Math.log(e)-161.1195681661:288.1221695283*(e-60)**-.0755148492,wo(t,0,255)},ko=e=>{if(e>=66)return 255;if(e<=19)return 0;const t=138.5177312231*Math.log(e-10)-305.0447927307;return wo(t,0,255)},So=(e,t)=>{const r=Math.max(...e),i=Math.max(...t);let o;return o=0===i?0:r/i,t.map((e=>Math.round(e*o)))},Ao=e=>0===e?1e6:Math.floor(1e6/e),Eo=(e,t,r)=>{const[i,o,a,s,n]=e,l=Ao(t??2700),c=Ao(r??6500),h=l-c;let d;try{d=n/(s+n)}catch(v){d=.5}const u=c+d*h,m=u?0===(p=u)?1e6:Math.floor(1e6/p):0;var p;const[f,g,b]=xo(m),y=Math.max(s,n)/255;return So([i,o,a,s,n],[i+f*y,o+g*y,a+b*y])};const zo=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater","weather"]),Co=(e,t)=>{if((void 0!==t?t:e?.state)===Ie)return"var(--state-unavailable-color)";const r=Io(e,t);return r?(i=r,Array.isArray(i)?i.reverse().reduce(((e,t)=>`var(${t}${e?`, ${e}`:""})`),void 0):`var(${i})`):void 0;var i},No=(e,t,r)=>{const i=void 0!==r?r:t.state,o=function(e,t){const r=_e(e.entity_id),i=void 0!==t?t:e?.state;if(["button","event","infrared","input_button","radio_frequency","scene"].includes(r))return i!==Ie;if(Oe(i))return!1;if("off"===i&&"alert"!==r)return!1;switch(r){case"alarm_control_panel":return"disarmed"!==i;case"alert":return"idle"!==i;case"cover":case"valve":return"closed"!==i;case"device_tracker":case"person":return"not_home"!==i;case"lawn_mower":return!["docked","paused"].includes(i);case"lock":return"locked"!==i;case"media_player":return"standby"!==i;case"vacuum":return!["idle","docked","paused"].includes(i);case"plant":return"problem"===i;case"group":return["on","home","open","locked","problem"].includes(i);case"timer":return"active"===i;case"camera":return"streaming"===i}return!0}(t,r);return Po(e,t.attributes.device_class,i,o)},Po=(e,t,r,i)=>{const o=[],a=((e,t="_")=>{const r="àáâäæãåāăąабçćčđďдèéêëēėęěеёэфğǵгḧхîïíīįìıİийкłлḿмñńǹňнôöòóœøōõőоṕпŕřрßśšşșсťțтûüùúūǘůűųувẃẍÿýыžźżз·",i=`aaaaaaaaaaabcccdddeeeeeeeeeeefggghhiiiiiiiiijkllmmnnnnnoooooooooopprrrsssssstttuuuuuuuuuuvwxyyyzzzz${t}`,o=new RegExp(r.split("").join("|"),"g"),a={"ж":"zh","х":"kh","ц":"ts","ч":"ch","ш":"sh","щ":"shch","ю":"iu","я":"ia"};let s;return""===e?s="":(s=e.toString().toLowerCase().replace(o,(e=>i.charAt(r.indexOf(e)))).replace(/[а-я]/g,(e=>a[e]||"")).replace(/(\d),(?=\d)/g,"$1").replace(/[^a-z0-9]+/g,t).replace(new RegExp(`(${t})\\1+`,"g"),"$1").replace(new RegExp(`^${t}+`),"").replace(new RegExp(`${t}+$`),""),""===s&&(s="unknown")),s})(r,"_"),s=i?"active":"inactive";return t&&o.push(`--state-${e}-${t}-${a}-color`),o.push(`--state-${e}-${a}-color`,`--state-${e}-${s}-color`,`--state-${s}-color`),o},Io=(e,t)=>{const r=void 0!==t?t:e?.state,i=_e(e.entity_id),o=e.attributes.device_class;if("sensor"===i&&"battery"===o){const e=(e=>{const t=Number(e);if(!isNaN(t))return t>=70?"--state-sensor-battery-high-color":t>=30?"--state-sensor-battery-medium-color":"--state-sensor-battery-low-color"})(r);if(e)return[e]}if("group"===i){const r=(e=>{const t=e.attributes.entity_id||[],r=[...new Set(t.map((e=>_e(e))))];return 1===r.length?r[0]:void 0})(e);if(r&&zo.has(r))return No(r,e,t)}if(zo.has(i))return No(i,e,t)};var Oo;!function(e){e[e.TARGET_TEMPERATURE=1]="TARGET_TEMPERATURE",e[e.TARGET_TEMPERATURE_RANGE=2]="TARGET_TEMPERATURE_RANGE",e[e.TARGET_HUMIDITY=4]="TARGET_HUMIDITY",e[e.FAN_MODE=8]="FAN_MODE",e[e.PRESET_MODE=16]="PRESET_MODE",e[e.SWING_MODE=32]="SWING_MODE",e[e.AUX_HEAT=64]="AUX_HEAT",e[e.TURN_OFF=128]="TURN_OFF",e[e.TURN_ON=256]="TURN_ON",e[e.SWING_HORIZONTAL_MODE=512]="SWING_HORIZONTAL_MODE"}(Oo||(Oo={})),["auto","heat_cool","heat","cool","dry","fan_only","off"].reduce(((e,t,r)=>(e[t]=r,e)),{});const To={cooling:"cool",defrosting:"heat",drying:"dry",fan:"fan_only",heating:"heat",idle:"off",off:"off",preheating:"heat"};class jo{static{jo.colorCache={},jo.element=void 0}static _prefixKeys(e){let t={};return Object.keys(e).forEach((r=>{const i=`--${r}`,o=String(e[r]);t[i]=`${o}`})),t}static processTheme(e){let t={},r={},i={},o={};const{modes:a,...s}=e;return a&&(r={...s,...a.dark},t={...s,...a.light}),i=jo._prefixKeys(t),o=jo._prefixKeys(r),{themeLight:i,themeDark:o}}static processPalette(e){let t={},r={},i={},o={},a={};return Object.values(e).forEach((e=>{const{modes:o,...a}=e;t={...t,...a},o&&(i={...i,...a,...o.dark},r={...r,...a,...o.light})})),o=jo._prefixKeys(r),a=jo._prefixKeys(i),{paletteLight:o,paletteDark:a}}static setElement(e){jo.element=e}static calculateColor(e,t,r){const i=Object.keys(t).map((e=>Number(e))).sort(((e,t)=>e-t));let o,a,s;const n=i.length;if(e<=i[0])return t[i[0]];if(e>=i[n-1])return t[i[n-1]];for(let l=0;l<n-1;l++){const n=i[l],c=i[l+1];if(e>=n&&e<c){if([o,a]=[t[n],t[c]],!r)return o;s=jo.calculateValueBetween(n,c,e);break}}return jo.getGradientValue(o,a,s)}static calculateColor2(e,t,r,i,o){const a=Object.keys(t).map((e=>Number(e))).sort(((e,t)=>e-t));let s,n,l;const c=a.length;if(e<=a[0])return t[a[0]];if(e>=a[c-1])return t[a[c-1]];for(let h=0;h<c-1;h++){const c=a[h],d=a[h+1];if(e>=c&&e<d){if([s,n]=[t[c].styles[r][i],t[d].styles[r][i]],!o)return s;l=jo.calculateValueBetween(c,d,e);break}}return jo.getGradientValue(s,n,l)}static calculateValueBetween(e,t,r){return(Math.min(Math.max(r,e),t)-e)/(t-e)}static getColorVariable(e){const t=e.substr(4,e.length-5);return window.getComputedStyle(jo.element).getPropertyValue(t)}static getGradientValue(e,t,r){const i=jo.colorToRGBA(e),o=jo.colorToRGBA(t),a=1-r,s=r,n=Math.floor(i[0]*a+o[0]*s),l=Math.floor(i[1]*a+o[1]*s),c=Math.floor(i[2]*a+o[2]*s),h=Math.floor(i[3]*a+o[3]*s);return`#${jo.padZero(n.toString(16))}${jo.padZero(l.toString(16))}${jo.padZero(c.toString(16))}${jo.padZero(h.toString(16))}`}static padZero(e){return e.length<2&&(e=`0${e}`),e.substr(0,2)}static colorToRGBA(e){if(null==e)return[0,0,0,0];const t=jo.colorCache[e];if(t)return t;let r=e;"var"===e.substr(0,3).valueOf()&&(r=jo.getColorVariable(e));const i=window.document.createElement("canvas");i.width=i.height=1;const o=i.getContext("2d");o.clearRect(0,0,1,1),o.fillStyle=r,o.fillRect(0,0,1,1);const a=[...o.getImageData(0,0,1,1).data];return jo.colorCache[e]=a,a}static hslToRgb(e){const t=e.h/360,r=e.s/100,i=e.l/100;let o,a,s;if(0===r)o=a=s=i;else{function n(e,t,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?e+6*(t-e)*r:r<.5?t:r<2/3?e+(t-e)*(2/3-r)*6:e}const l=i<.5?i*(1+r):i+r-i*r,c=2*i-l;o=n(c,l,t+1/3),a=n(c,l,t),s=n(c,l,t-1/3)}return o*=255,a*=255,s*=255,{r:o,g:a,b:s}}static computeColor(e){if(e.attributes?.hvac_action){const t=e.attributes.hvac_action;return t in To?Co(e,To[t]):void 0}if(e.attributes?.rgb_color)return`rgb(${e.attributes.rgb_color.join(",")})`;const t=Co(e);return t||void 0}static getHaEntityIconStyle(e){const t=jo.computeColor(e),r=(e=>{if(e.attributes.brightness&&"plant"!==_e(e.entity_id))return`brightness(${(e.attributes.brightness+245)/5}%)`;return""})(e);return{color:t??"var(--state-icon-color)",fill:"currentColor",...r?{filter:r}:{}}}}const Do={apparent_temperature:"mdi:thermometer",cloud_coverage:"mdi:weather-cloudy",dew_point:"mdi:thermometer-water",humidity:"mdi:water-percent",pressure:"mdi:gauge",temperature:"mdi:thermometer",uv_index:"mdi:sun-wireless",visibility:"mdi:weather-fog",wind_bearing:"mdi:weather-windy",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",precipitation_probability:"mdi:weather-pouring",condition_clear_night:"mdi:weather-night",condition_cloudy:"mdi:weather-cloudy",condition_fog:"mdi:weather-fog",condition_hail:"mdi:weather-hail",condition_lightning:"mdi:weather-lightning",condition_lightning_rainy:"mdi:weather-lightning-rainy",condition_partlycloudy:"mdi:weather-partly-cloudy",condition_pouring:"mdi:weather-pouring",condition_rainy:"mdi:weather-rainy",condition_snowy:"mdi:weather-snowy",condition_snowy_rainy:"mdi:weather-snowy-rainy",condition_sunny:"mdi:weather-sunny",condition_windy:"mdi:weather-windy",condition_windy_variant:"mdi:weather-windy-variant",condition_exceptional:"mdi:alert-circle-outline"};console.info("%c FLEX-HORSESHOE-CARD %c Version 5.4.5-dev.3 ","color: white; font-weight: bold; background: darkgreen","color: darkgreen; font-weight: bold; background: white");const Ho=200,Ro={xpos:50,ypos:50,horseshoe_radius:90,tickmarks_radius:86},Vo={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed"},Uo={min:0,max:100,width:6,color:"var(--primary-background-color)"},Fo={width:12,color:"var(--primary-color)"},qo={action:"more-info"};class Jo extends ne{constructor(){if(super(),jo.setElement(this),this.cardId=Math.random().toString(36).substr(2,9),this._hass=void 0,this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.viewBoxSize=Ho,this.colorStops={},this.animations={},this.animations.vlines={},this.animations.hlines={},this.animations.circles={},this.animations.icons={},this.animations.iconsIcon={},this.animations.names={},this.animations.areas={},this.animations.states={},this.resolvedEntityConfigs=[],this.colorCache={},this.isAndroid=!1,this.isSafari=!1,this.iOS=!1,this.resolvedVariables={},this.iconCache={},this.iconsSvg=[],this.pendingIconPath=[],this.iconsId=[],this.bar_mode="normal",this.dev={debug:!1},this.isAndroid=!!window.navigator.userAgent.match(/Android/),!this.isAndroid){const e=window.navigator.userAgent||"",t=e.toLowerCase(),r=window.navigator.platform||"",i=(/iPad|iPhone|iPod/.test(e)||"MacIntel"===r&&window.navigator.maxTouchPoints>1)&&!window.MSStream,o=e.match(/Version\/(\d+)(?:\.[\d.]+)?.*Safari/i),a=o?Number(o[1]):void 0,s=t.match(/\bos\s+(\d+)(?:[._]\d+)*.*like safari/),n=t.match(/\bios\s+(\d+)(?:[._]\d+)*/),l=n?Number(n[1]):s?Number(s[1]):void 0,c=Number.isFinite(a),h=Number.isFinite(l)&&t.includes("like safari"),d=c?a:h?l:void 0;this.iOS=i,this.isSafari=Number.isFinite(d),this.safariMajorVersion=d,this.isHomeAssistantLikeSafari=h,this.isRealSafari=c,this.isSafari14=this.isSafari&&14===d,this.isSafari15=this.isSafari&&15===d,this.isSafari16=this.isSafari&&16===d,this.isSafari17=this.isSafari&&17===d,this.isSafari18=this.isSafari&&18===d,this.isSafari26=this.isSafari&&26===d,this.isSafari27=this.isSafari&&27===d,this.isSafari28=this.isSafari&&28===d,this.isSafari29=this.isSafari&&29===d,this.isSafari30=this.isSafari&&30===d,this.isSafariGte16=this.isSafari&&d>=16,this.dev?.debug&&console.log("browser detection",{ua:e,isAndroid:this.isAndroid,isIOS:this.iOS,isSafari:this.isSafari,isRealSafari:this.isRealSafari,isHomeAssistantLikeSafari:this.isHomeAssistantLikeSafari,safariMajorVersion:this.safariMajorVersion,isSafariGte16:this.isSafariGte16}),this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config)}}static get styles(){return a`
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
    `}_resolveEntityConfigs(e){return e?.dev?.debug&&console.log("resolving entity config for",e?.entities),e?.entities?.map(((e,t)=>{const r={entity_index:t};return fe.getJsTemplateOrValue(r,e)}))??[]}_buildMyIcon(e,t,r){if(!e||!t)return;if(r)return r;if(t.icon)return t.icon;const i=t.entity,o=t.attribute,a=o?e.attributes?.[o]:void 0,s=e.entity_id?.split(".")[0];if(e.attributes?.icon&&!o)return e.attributes.icon;if(o&&"weather"===s){const e=Do[o];if(e)return e}this.entitiesIcon??={},this.entitiesIconKey??={},this.entitiesIconPending??={};const n=o?`${i}|attribute:${o}`:`${i}|state`,l=o?[i,"attribute",o,a??"",s??"",e.attributes?.device_class??"",e.attributes?.icon??""].join("|"):[i,"state",e.state??"",s??"",e.attributes?.device_class??"",e.attributes?.icon??""].join("|");if(this.entitiesIconKey[n]===l)return this.entitiesIcon[n];if(this.entitiesIconKey[n]=l,!this.entitiesIconPending[n]){this.entitiesIconPending[n]=!0;(o?Be(this._hass,e,o,void 0!==a?String(a):void 0):Je(this._hass.entities,this._hass.config,this._hass.connection,e)).then((e=>{this.entitiesIconKey[n]===l&&e&&this.entitiesIcon[n]!==e&&(this.entitiesIcon[n]=e,this.requestUpdate())})).catch((e=>{console.error(o?"_buildMyIcon attributeIcon failed":"_buildMyIcon entityIcon failed",i,o??"",e)})).finally((()=>{this.entitiesIconPending[n]=!1}))}return this.entitiesIcon[n]}_buildMyIconV1(e,t,r){if(!e||!t)return;if(r)return r;if(t.icon)return t.icon;const i=t.entity,o=t.attribute,a=o?e.attributes?.[o]:void 0,s=e.entity_id?.split(".")[0];if(e.attributes?.icon&&!o)return e.attributes.icon;if(o&&"weather"===s){const e=Do[o];if(e)return e}this.entitiesIcon??={},this.entitiesIconKey??={},this.entitiesIconPending??={};const n=o?`${i}|attribute:${o}`:`${i}|state`,l=o?[i,"attribute",o,a??"",s??"",e.attributes?.device_class??"",e.attributes?.icon??""].join("|"):[i,"state",e.state??"",s??"",e.attributes?.device_class??"",e.attributes?.icon??""].join("|");if(this.entitiesIconKey[n]===l)return this.entitiesIcon[n];if(this.entitiesIconKey[n]=l,!this.entitiesIconPending[n]){let t;if(this.entitiesIconPending[n]=!0,o&&"weather"===s){const r=Do[o];t=r?Promise.resolve(r):Be(this._hass,e,o,void 0!==a?String(a):void 0)}else t=o?Be(this._hass,e,o,void 0!==a?String(a):void 0):Je(this._hass.entities,this._hass.config,this._hass.connection,e);t.then((e=>{this.entitiesIconKey[n]===l&&e&&this.entitiesIcon[n]!==e&&(this.entitiesIcon[n]=e,this.requestUpdate())})).catch((e=>{console.error(o?"_buildMyIcon attribute icon failed":"_buildMyIcon entityIcon failed",i,o??"",e)})).finally((()=>{this.entitiesIconPending[n]=!1}))}return this.entitiesIcon[n]}_formatEntityStateParts(e,t){const r=void 0!==t.attribute,i=r?this._hass.formatEntityAttributeValueToParts(e,t.attribute):this._hass.formatEntityStateToParts(e),o=r?e.attributes[t.attribute]:e.state,a=void 0===t.decimals||Number.isNaN(Number(o))?void 0:((e,t,r)=>Ne(e,t,r).map((e=>e.value)).join(""))(Number(o),this._hass.locale,{minimumFractionDigits:0,maximumFractionDigits:Number(t.decimals)});return i.map((e=>"value"===e.type&&void 0!==a?{...e,value:a}:"unit"===e.type&&void 0!==t.unit?{...e,value:t.unit}:e))}set hass(e){this._hass=e,fe.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes});let t=!1;if(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.resolvedEntityConfigs.forEach(((r,i)=>{const o=e.states[r.entity];if(!o)return;this.entities[i]=o;const a=this._buildState(o.state,r);if(De(o),a!==this.entitiesStr[i]&&(this.entitiesStr[i]=a,t=!0),r.attribute&&Object.prototype.hasOwnProperty.call(o.attributes,r.attribute)){const e=this._buildState(o.attributes[r.attribute],r);e!==this.attributesStr[i]&&(this.attributesStr[i]=e,t=!0)}})),!t)return;this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.horseshoes=this.horseshoes.map((e=>{const t=e.entity_index??0,r=this.resolvedEntityConfigs[t],i=this.entities[t];if(!i||!r)return e;let o=i.state;r.attribute&&void 0!==i.attributes[r.attribute]&&(o=i.attributes[r.attribute]);const a=fe.getJsTemplateOrValue({entity_index:t},e.horseshoe_scale),s=a?.min??0,n=a?.max??100;let l,c,h=!1;if("bidirectional"===(e.bar_mode||"normal")){const t=e.horseshoePathLength,r=Number(o);if(r>=0){const i=Math.min(jo.calculateValueBetween(0,n,r),1)*(t/2);l=`${i} ${e.circlePathLength-i}`,c=void 0,h=!1}else{const i=(1-Math.min(jo.calculateValueBetween(s,0,r),1))*(t/2);l=`${i} ${e.circlePathLength-i}`,c=""+-(e.circlePathLength-i),h=!0}}else{l=`${Math.min(jo.calculateValueBetween(s,n,o),1)*e.horseshoePathLength} ${10*e.radiusSize}`,c=void 0,h=!1}const d=Math.min(jo.calculateValueBetween(s,n,o),1),u=e.show.horseshoe_style;let m=e.color0,p=e.color1,f=e.color1_offset,g=e.angleCoords,b=e.stroke_color;if("fixed"===u)b=e.horseshoe_state.color,m=e.horseshoe_state.color,p=e.horseshoe_state.color,f="0%";else if("autominmax"===u){const t=this._calculateStrokeColor(o,e.colorStopsMinMax,!0);m=t,p=t,f="0%"}else if("colorstop"===u||"colorstopgradient"===u){const t=this._calculateStrokeColor(o,e.colorStops,"colorstopgradient"===u);m=t,p=t,f="0%"}else"lineargradient"===u&&(g={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},f=`${Math.round(100*(1-d))}%`);return{...e,horseshoe_scale:{...e.horseshoe_scale,...a},dashArray:l,dashOffset:c,bidirectional_negative:h,stroke_color:b,color0:m,color1:p,color1_offset:f,angleCoords:g}}));const r=this.horseshoes[0];this.dashArray=r.dashArray,this.dashOffset=r.dashOffset,this._bidirectional_negative=r.bidirectional_negative,this.stroke_color=r.stroke_color,this.color0=r.color0,this.color1=r.color1,this.color1_offset=r.color1_offset,this.angleCoords=r.angleCoords,this.config.animations&&Object.keys(this.config.animations).map((e=>{const t=e.substr(Number(e.indexOf(".")+1));return this.config.animations[e].map((e=>this.entities[t].state.toLowerCase()===e.state.toLowerCase()&&(e.vlines&&e.vlines.forEach((e=>this._updateAnimationStyles("vlines",e))),e.hlines&&e.hlines.forEach((e=>this._updateAnimationStyles("hlines",e))),e.circles&&e.circles.forEach((e=>this._updateAnimationStyles("circles",e))),e.icons&&e.icons.forEach((e=>{const t=e.animation_id;this.animations.icons[t]&&e.reuse||(this.animations.icons[t]={},this.animations.iconsIcon[t]={});const r=fe.getJsTemplateOrValue(e,e.styles),i=pe.toStyleDict(r);this.animations.icons[t]={...this.animations.icons[t],...i},this.animations.iconsIcon[t]=fe.getJsTemplateOrValue(e,e.icon)})),e.states&&e.states.forEach((e=>this._updateAnimationStyles("states",e))),!0))),!0})),fe.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),this.requestUpdate()}_updateAnimationStyles(e,t){const r=t.animation_id;if(null==r)return;const i=fe.getJsTemplateOrValue(t,t.styles),o=pe.toStyleDict(i);this.animations[e][r]={...t.reuse?this.animations[e][r]??{}:{},...o}}_prepareItemColorStops(e){["states","names","areas","circles","hlines","vlines","icons","horseshoes"].forEach((t=>{const r=e.layout?.[t];Array.isArray(r)&&r.forEach((e=>{if(!e.color_stops)return;const t=fe.getJsTemplateOrValue(e,e.color_stops,{resolveKeys:!0});e._colorStops=ge.normalize(t)}))}))}setConfig(e){try{if(!(e=JSON.parse(JSON.stringify(e))).entities)throw Error("No entities defined");if(!e.layout)throw Error("No layout defined");fe.setContext({hass:this._hass,config:e,entities:this.entities,horseshoes:this.horseshoes});const t=this._resolveEntityConfigs(e);if(t){if("sensor"!==_e(t[0].entity)&&t[0].attribute&&!isNaN(t[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}t.forEach((e=>{e.tap_action||(e.tap_action={...qo})}));const r={texts:[],card_filter:"card--filter-none",bar_mode:e.bar_mode||"normal",...e,show:{...Vo,...e.show},horseshoe_position:{...Ro,...e?.horseshoe_position},horseshoe_scale:{...Uo,...e.horseshoe_scale},horseshoe_state:{...Fo,...e.horseshoe_state}},i=Array.isArray(r.layout.horseshoes)?r.layout.horseshoes.map(((e,t)=>({...r,...e,entity_index:e.entity_index??t}))):[{...r,entity_index:0}];if(this.horseshoes=i.map(((e,t)=>{const i=e.entity_index??t,o={...Vo,...e.show??{}},a={...Uo,...e.horseshoe_scale??{}},s={...Fo,...e.horseshoe_state??{}},n=e.xpos??e.horseshoe_position?.xpos??e.horseshoe_position?.cx??Ro.xpos??Ro.cx??50,l=e.ypos??e.horseshoe_position?.ypos??e.horseshoe_position?.cy??Ro.ypos??Ro.cy??50;if(!a.min&&0!==a.min||!a.max&&0!==a.max)throw Error(`No horseshoe min/max for scale defined for horseshoe ${t}`);const c=e.color_stops;if(!c&&!1!==r?.show?.horseshoe)throw console.warn(`No color_stops defined for horseshoe ${t}`),Error(`No color_stops defined for horseshoe ${t}`);const h=fe.getJsTemplateOrValue({entity_index:i},c,{resolveKeys:!0}),d=ge.normalize(h),u=d.colors,m=u[0],p=u[u.length-1];let f,g,b=ge.normalize({});m&&p&&(b=ge.normalize({[a.min]:m.color,[a.max]:p.color}),f=m.color,g=p.color);const y=e.radius??45,v=e.tickmarks_radius??43,_=e.arc_degrees??260,w=y/100*Ho,x=v/100*Ho,$=2*_/360*Math.PI*w,M=2*Math.PI*w;return{...e,entity_index:i,show:o,fill:e.fill??"rgba(0, 0, 0, 0)",xpos:n,ypos:l,bar_mode:e.bar_mode??"normal",horseshoe_scale:a,horseshoe_state:s,radius:y,tickmarks_radius:v,arc_degrees:_,radiusSize:w,tickmarksRadiusSize:x,horseshoePathLength:$,circlePathLength:M,color_stops:c,colorStops:d,colorStopsMinMax:b,color0:f,color1:g,angleCoords:{x1:"0%",y1:"0%",x2:"100%",y2:"0%"},color1_offset:"0%",dashArray:this.dashArray,dashOffset:this.dashOffset,bidirectional_negative:this._bidirectional_negative}})),!this.horseshoes.length)throw Error("No horseshoes defined");const o=this.horseshoes[0];this.colorStops=o.colorStops,this.colorStopsMinMax=o.colorStopsMinMax,this.color0=o.color0,this.color1=o.color1,this.angleCoords=o.angleCoords,this.color1_offset=o.color1_offset,this._prepareItemColorStops(r),this.config=r,this.bar_mode=r.bar_mode||"normal",this.config.layout?.icons&&this.config.layout.icons.forEach(((e,t)=>{this.iconsId[t]=Math.random().toString(36).substr(2,9)})),fe.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes})}catch(t){throw console.error("[FHC setConfig] CONFIG ERROR",{error:t,message:t?.message,stack:t?.stack,config:e}),t}}_getItemStateValue(e={}){const t=e.entity_index??0,r=this.entities?.[t],i=this.config?.entities?.[t];if(!r)return;const o=i?.attribute;return o&&r.attributes&&void 0!==r.attributes[o]?r.attributes[o]:r.state}_getItemColorFromStops(e={}){if(!e._colorStops)return;const t=this._getItemStateValue(e),r=Number(t);return Number.isFinite(r)?this._calculateStrokeColor(r,e._colorStops,!0===e.colorstop_gradient):void 0}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback()}render({config:e}=this){const t=fe.getJsTemplateOrValue({entity_index:0},e?.styles),r=pe.toStyleDict(t);return F`
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
    `}_renderTickMarks(e){if(!1===e.show?.scale_tickmarks)return q``;const t=e.horseshoe_scale,r=Number(t.min),i=Number(t.max),o=i-r;if(!o)return q``;const a={entity_index:e.entity_index},s=fe.getJsTemplateOrValue(a,e?.horseshoe_tickmarks?.styles),n=pe.toStyleDict(s),l=2*(e.xpos??50),c=2*(e.ypos??50),h={transformOrigin:`${l}px ${c}px`};void 0!==e?.horseshoe_tickmarks?.fill&&(h.fill=e.horseshoe_tickmarks.fill);const d=t.color||"var(--primary-background-color)";h.fill=d;const u={...n,...h},m=t.ticksize||o/10,p=e.arc_degrees||260,f=t.width?t.width/2:3,g=r%m,b=r+(0===g?0:m-g);if(b>i)return q``;const y=Math.floor((i-b)/m)+1,v=Array.from({length:y},((t,i)=>{const a=(p/2-(b+i*m-r)/o*p)*Math.PI/180;return q`
      <circle
        cx="${l-Math.sin(a)*e.tickmarksRadiusSize}"
        cy="${c-Math.cos(a)*e.tickmarksRadiusSize}"
        r="${f}"
        style=${me(u)}>
      </circle>
    `}));return q`${v}`}_renderSvg(){const e=this.config.card_filter?this.config.card_filter:"card--filter-none";return q`
        <svg xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
            class="${e}" 
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
      `}_renderHorseShoes(){return q`
    ${this.horseshoes?.map(((e,t)=>this._renderHorseShoe(e,t)))??q``}
  `}_renderHorseShoe(e,t){if(!1===e.show?.horseshoe)return q``;const r=e.xpos??50,i=e.ypos??50,o=`${r}%`,a=`${i}%`,s=2*r,n=2*i,l=e.bar_mode||"normal",c=`${e.radius}%`,h=e.horseshoe_scale.color||"#000000",d=e.horseshoe_scale.width||6,u=e.horseshoe_state.width||12,m=-90-(e.arc_degrees??260)/2,p=`${e.horseshoePathLength},${e.circlePathLength}`,f=`horseshoe__gradient-${this.cardId}-${t}`,g={entity_index:e.entity_index},b=fe.getJsTemplateOrValue(g,e.horseshoe_scale?.styles),y=pe.toStyleDict(b),v={stroke:h,strokeWidth:d,strokeDasharray:p,strokeLinecap:"round"};void 0!==e.horseshoe_scale?.fill&&(v.fill=e.horseshoe_scale.fill);const _={fill:"none","stroke-linecap":"round",...y,...v},w=fe.getJsTemplateOrValue(g,e.horseshoe_state?.styles),x=pe.toStyleDict(w),$={stroke:`url('#${f}')`,strokeDasharray:e.dashArray,strokeDashoffset:e.dashOffset,strokeWidth:u};void 0!==e.horseshoe_state?.fill&&($.fill=e.horseshoe_state.fill);const M={fill:"none",transition:"all 2.5s ease-out",strokeLinecap:"round",...x,...$};return"bidirectional"===l?e.bidirectional_negative?q`
        <g id="horseshoe__svg__group-${t}" class="horseshoe__svg__group">
          <circle id="horseshoe__scale-${t}" class="horseshoe__scale" cx="${o}" cy="${a}" r="${c}"
            style=${me(_)}  
            transform="rotate(${m} ${s} ${n})"/>
          <circle id="horseshoe__state__value-${t}" class="horseshoe__state__value" cx="${o}" cy="${a}" r="${c}"
            transform="rotate(-90 ${s} ${n})"
            style=${me(M)} />
          ${this._renderTickMarks(e)}
        </g>
      `:q`
      <g id="horseshoe__svg__group-${t}" class="horseshoe__svg__group">
        <circle id="horseshoe__scale-${t}" class="horseshoe__scale" cx="${o}" cy="${a}" r="${c}"
            style=${me(_)}  
          transform="rotate(${m} ${s} ${n})"/>
        <circle id="horseshoe__state__value-${t}" class="horseshoe__state__value" cx="${o}" cy="${a}" r="${c}"
          transform="rotate(-90 ${s} ${n})"
            style=${me(M)} />
        ${this._renderTickMarks(e)}
      </g>
    `:q`
    <g id="horseshoe__svg__group-${t}" class="horseshoe__svg__group">
      <circle id="horseshoe__scale-${t}" class="horseshoe__scale" cx="${o}" cy="${a}" r="${c}"
        style=${me(_)}
        transform="rotate(${m} ${s} ${n})"/>
      <circle id="horseshoe__state__value-${t}" class="horseshoe__state__value" cx="${o}" cy="${a}" r="${c}"
        transform="rotate(${m} ${s} ${n})"
        style=${me(M)} />
      ${this._renderTickMarks(e)}
    </g>
  `}_renderEntityNames(){const{layout:e}=this.config;if(!e?.names)return q``;const t={"font-size":"1.5em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"},r=e.names.map((e=>{const r=e.entity_index??0,i=fe.getJsTemplateOrValue(e,e.styles),o=pe.toStyleDict(i),a={...t,...o},s={...this.animations?.names?.[e.animation_id]??{}},n=this._getItemColorFromStops(e);n&&(s.stroke=n);const l={...a,...s},c=this.textEllipsis(this._buildName(this.entities[e.entity_index],this.resolvedEntityConfigs[e.entity_index]),e?.max_characters??e?.ellipsis);return q`
        <text
          @click=${e=>this.handlePopup(e,this.entities[r])}
          >
            <tspan
              class="entity__name"
              x="${e.xpos}%"
              y="${e.ypos}%"
              style=${me(l)}>
              ${c}</tspan>
        </text>
      `}));return q`${r}`}_renderEntityAreas(){const{layout:e}=this.config;if(!e?.areas)return q``;const t={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"},r=e.areas.map((e=>{const r=e.entity_index??0,i=fe.getJsTemplateOrValue(e,e.styles),o=pe.toStyleDict(i),a={...t,...o},s={...pe.toStyleDict(this.animations?.areas?.[e.animation_id]??{})},n=this._getItemColorFromStops(e);n&&(s.stroke=n);const l={...a,...s},c=this.textEllipsis(this._buildArea(this.entities[e.entity_index],this.resolvedEntityConfigs[e.entity_index]),e?.max_characters??e?.ellipsis);return q`
        <text
          @click=${e=>this.handlePopup(e,this.entities[r])}
          >
            <tspan
              class="entity__area"
              x="${e.xpos}%"
              y="${e.ypos}%"
              style=${me(l)}>
              ${c}</tspan>
        </text>
      `}));return q`${r}`}_renderState(e){if(!e)return q``;const t=e.entity_index??0,r=e.xpos??50,i=e.ypos??50,o=e.dx??0,a=e.dy??0,s=fe.getJsTemplateOrValue(e,e.styles),n=pe.toStyleDict(s),l=e.uom??{},c=fe.getJsTemplateOrValue(e,l.styles),h=pe.toStyleDict(c),d=l.dx??"0.1",u=l.dy??"-0.45";let m={};this.animations?.states?.[e.animation_id]&&(m={...this.animations.states[e.animation_id]});const p=this._getItemColorFromStops(e);p&&(m.fill=p);const f={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...n,...m},g=f["font-size"];let b=.5,y="em";const v=String(g).trim().match(/^(\d*\.?\d+)([a-z%]+)$/i);v?(b=.6*Number(v[1]),y=v[2]):console.error("Cannot determine font-size for state",g);const _={"font-size":`${b}${y}`},w={...f,opacity:"0.7",..._,...h},x=this.entities[t],$=this.resolvedEntityConfigs[t]??{},M=this._formatEntityStateParts(x,$);let k="",S="";M.forEach((e=>{"unit"===e.type?S+=e.value:"value"===e.type&&(k+=e.value)})),k=k.trim(),S=S.trim();const A=this._buildUom(x,$,S);return q`
      <text @click=${e=>this.handlePopup(e,this.entities[t])}>
        <tspan
          class="state__value"
          x="${r}%"
          y="${i}%"
          dx="${o}em"
          dy="${a}em"
          style=${me(f)}
        >${k}</tspan><tspan
          class="state__uom"
          dx="${d}em"
          dy="${u}em"
          style=${me(w)}
        >${A}</tspan>
      </text>
    `}_renderStates(){const{layout:e}=this.config;if(!e)return;if(!e.states)return;const t=e.states.map((e=>q`
            ${this._renderState(e)}
          `));return q`${t}`}computeEntityColor(e){if(!e||"off"===e.state||"unavailable"===e.state||"unknown"===e.state)return"var(--state-icon-color)";const t=e.state;if(!isNaN(t)||t.endsWith("W")||t.endsWith("kWh")||t.endsWith("V"))return"var(--state-icon-color)";const r=e.entity_id.split(".")[0],i=e.attributes.device_class;if("sensor"===r)return"var(--state-icon-color)";if("light"===r&&e.attributes.rgb_color&&"on"===t){const[t,r,i]=e.attributes.rgb_color;return`rgb(${t}, ${r}, ${i})`}return"binary_sensor"===r&&i&&"on"===t?`var(--state-binary_sensor-${i}-on-color, var(--state-icon-active-color))`:"climate"===r?`var(--state-climate-${t}-color, var(--state-icon-active-color))`:"on"===t?`var(--state-${r}-active-color, var(--state-${r}-color, var(--state-icon-active-color)))`:"var(--state-icon-color)"}_renderIcon(e,t){if(!e)return;e.entity=e.entity?e.entity:0,this.iconCache||={},this.iconsSvg||=[],this.pendingIconPath||=[];const r=12*(e.icon_size?e.icon_size:2),i=(e.xpos??50)/100,o=(e.ypos??50)/100,a=i*Ho,s=o*Ho,n=e.align?e.align:"center",l="center"===n?.5:"start"===n?-1:1;let c=a-r*l,h=s-r*l,d=r;const u=e.entity_index??0,m=this.entities[u],p=jo.getHaEntityIconStyle(m),f={};f.fill=p.fill,f.color=p.color,f.filter=p.filter;const g=fe.getJsTemplateOrValue(e,e.styles);let b=pe.toStyleDict(g);const y=this.animations?.icons?.[e.animation_id]??{},v=this._getItemColorFromStops(e);v&&(b.fill=v),b={...f,...b,...y};const _=this._buildMyIcon(this.entities[u],this.resolvedEntityConfigs[u],this.animations?.iconsIcon?.[e.animation_id]);if(this.iconCache[_])this.iconsSvg[t]=this.iconCache[_];else if(this.iconsSvg[t]=void 0,this.pendingIconPath[t]!==_){this.pendingIconPath[t]=_;let e=0;const r=40,i=50,o=()=>{if(this.pendingIconPath[t]!==_)return;const a=this._getRenderedHaIconPath(t);if(a)return this.iconsSvg[t]=a,this.iconCache[_]=a,this.pendingIconPath[t]=void 0,void this.requestUpdate();e+=1,e>=r?this.pendingIconPath[t]=void 0:window.setTimeout(o,i)};(this?.updateComplete&&"function"==typeof this.updateComplete.then||this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((e=>window.requestAnimationFrame(e)))).then((()=>{window.setTimeout(o,0)}))}const w=this.iconsSvg[t];if(w){const i=a-r*l,o=s-.5*r-.25*r,n=r/24;return q`
      <g
        id="icon-rendered-${this.iconsId[t]}"
        style="${me(b)}"
        x="${i}px"
        y="${o}px"
        transform-origin="${a} ${s}"
        @click=${t=>this.handlePopup(t,this.entities[e.entity_index])}
      >
        <rect
          x="${i}"
          y="${o}"
          height="${r}px"
          width="${r}px"
          stroke-width="0px"
          fill="rgba(0,0,0,0)"
        ></rect>

        <path
          d="${w}"
          transform="translate(${i},${o}) scale(${n})"
        ></path>
      </g>
    `}return q`
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
            id="icon-${this.iconsId[t]}"
          ></ha-icon>
        </div>
      </body>
    </foreignObject>
  `}_getRenderedHaIconPath(e){const t=this.shadowRoot.getElementById(`icon-${this.iconsId[e]}`);return t?.shadowRoot?.querySelector("*")?.path}_scheduleIconPathRead(e,t){if(!e)return;if(this.iconCache[e])return void(this.iconsSvg[t]=this.iconCache[e]);if(this.pendingIconPath[t]===e)return;this.pendingIconPath[t]=e;let r=0;const i=()=>{if(this.pendingIconPath[t]!==e)return;if(this.iconCache[e])return this.iconsSvg[t]=this.iconCache[e],this.pendingIconPath[t]=void 0,void this.requestUpdate();const o=this._getRenderedHaIconPath();if(o)return this.iconsSvg[t]=o,this.iconCache[e]=o,this.pendingIconPath[t]=void 0,void this.requestUpdate();r+=1,r>=40?this.pendingIconPath[t]=void 0:this._iconPathTimer=window.setTimeout(i,50)};(this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((e=>{window.requestAnimationFrame(e)}))).then((()=>{this._iconPathTimer=window.setTimeout(i,0)}))}_renderIcons(){const{layout:e}=this.config;if(!e)return;if(!e.icons)return;const t=e.icons.map(((e,t)=>q`
            ${this._renderIcon(e,t)}
          `));return q`${t}`}_renderHorizontalLines(){const{layout:e}=this.config;if(!e?.hlines)return q``;const t={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2"},r=e.hlines.map((e=>{const r=e.entity_index??0,i=fe.getJsTemplateOrValue(e,e.styles),o=pe.toStyleDict(i),a={...t,...o},s={...pe.toStyleDict(this.animations?.hlines?.[e.animation_id]??{})},n=this._getItemColorFromStops(e);n&&(s.stroke=n);const l={...a,...s};return q`
      <line
        @click=${e=>this.handlePopup(e,this.entities[r])}
        class="line__horizontal"
        x1="${e.xpos-e.length/2}%"
        y1="${e.ypos}%"
        x2="${e.xpos+e.length/2}%"
        y2="${e.ypos}%" 
        style=${me(l)}
      ></line>
    `}));return q`${r}`}_renderVerticalLines(){const{layout:e}=this.config;if(!e?.vlines)return q``;const t={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2"},r=e.vlines.map((e=>{const r=e.entity_index??0,i=fe.getJsTemplateOrValue(e,e.styles),o=pe.toStyleDict(i),a={...t,...o},s={...pe.toStyleDict(this.animations?.vlines?.[e.animation_id]??{})},n=this._getItemColorFromStops(e);n&&(s.stroke=n);const l={...a,...s};return q`
      <line
        @click=${e=>this.handlePopup(e,this.entities[r])}
        class="line__vertical"
        x1="${e.xpos}%"
        y1="${e.ypos-e.length/2}%"
        x2="${e.xpos}%"
        y2="${e.ypos+e.length/2}%"
        style=${me(l)}
      ></line>
    `}));return q`${r}`}_renderCircles(){const{layout:e}=this.config;if(!e?.circles)return q``;const t={},r=e.circles.map((e=>{const r=e.entity_index??0,i=fe.getJsTemplateOrValue(e,e.styles),o=pe.toStyleDict(i),a={...t,...o},s={...pe.toStyleDict(this.animations?.circles?.[e.animation_id]??{})},n=this._getItemColorFromStops(e);n&&(s.stroke=n);const l={...a,...s};return q`
      <circle
        @click=${e=>this.handlePopup(e,this.entities[r])}
        class="svg__dot"
        cx="${e.xpos}%"
        cy="${e.ypos}%"
        r="${e.radius}"
        style=${me(l)}
      ></circle>
    `}));return q`${r}`}_handleClick(e,t,r,i,o){let a;switch(i.action){case"more-info":a=new Event("hass-more-info",{composed:!0}),a.detail={entityId:o},e.dispatchEvent(a);break;case"navigate":if(!i.navigation_path)return;window.history.pushState(null,"",i.navigation_path),a=new Event("location-changed",{composed:!0}),a.detail={replace:!1},window.dispatchEvent(a);break;case"call-service":{if(!i.service)return;const[e,r]=i.service.split(".",2),o={...i.service_data};t.callService(e,r,o);break}case"fire-dom-event":a=new Event("ll-custom",{composed:!0,bubbles:!0}),a.detail=i,e.dispatchEvent(a)}}handlePopup(e,t){e.stopPropagation();const r=this.resolvedEntityConfigs.find((e=>e.entity===t.entity_id)),i=r?.tap_action??this.config?.tap_action??{action:"more-info"};this._handleClick(this,this._hass,this.config,i,t.entity_id)}textEllipsis(e,t){return t&&t<e.length?e.slice(0,t-1).concat("..."):e}_buildArea(e,t){if(t.area)return t.area;if(!this._hass||!this._hass.areas)return"";const r=this._hass.entities&&this._hass.entities[t.entity];let i=r?r.area_id:null;if(!i&&r&&r.device_id&&this._hass.devices){const e=this._hass.devices[r.device_id];i=e?e.area_id:null}if(i){const e=this._hass.areas[i];return e?e.name:""}return"?"}_buildName(e,t){return t.name??e.attributes.friendly_name??e?.entity_id??"?"}_buildIcon(e,t,r){return r||t?.icon||e?.attributes?.icon||ke(e)}_buildUom(e,t,r){return t.unit||r||""}_buildState(e,t){if(void 0===e)return e;if(null===e)return e;if(t.convert){let r,i,o=t.convert.match(/(^\w+)\((\d+)\)/);switch(null===o?r=t.convert:3===o.length&&(r=o[1],i=Number(o[2])),r){case"brightness_pct":e="undefined"===e?"undefined":`${Math.round(e/255*100)}`;break;case"multiply":e=`${Math.round(e*i)}`;break;case"divide":e=`${Math.round(e/i)}`;break;case"rgb_csv":case"rgb_hex":if(t.attribute){let i=this._hass.states[t.entity];switch(i.attributes.color_mode){case"unknown":case"onoff":case"brightness":case"white":break;case"color_temp":if(i.attributes.color_temp_kelvin){let t=xo(i.attributes.color_temp_kelvin);const o=yo(t);o[1]<.4&&(o[1]<.1?o[2]=225:o[1]=.4),t=vo(o),t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:bo(t)}else e="rgb_csv"===r?"255,255,255":"#ffffff00";break;case"hs":{let t=_o([i.attributes.hs_color[0],i.attributes.hs_color[1]/100]);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:bo(t)}break;case"rgb":{const t=yo(this.stateObj.attributes.rgb_color);t[1]<.4&&(t[1]<.1?t[2]=225:t[1]=.4);const i=vo(t);e="rgb_csv"===r?i.toString():bo(i)}break;case"rgbw":{let t=(e=>{const[t,r,i,o]=e;return So([t,r,i,o],[t+o,r+o,i+o])})(i.attributes.rgbw_color);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:bo(t)}break;case"rgbww":{let t=Eo(i.attributes.rgbww_color,i.attributes?.min_color_temp_kelvin,i.attributes?.max_color_temp_kelvin);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:bo(t)}break;case"xy":if(i.attributes.hs_color){let t=_o([i.attributes.hs_color[0],i.attributes.hs_color[1]/100]);const o=yo(t);o[1]<.4&&(o[1]<.1?o[2]=225:o[1]=.4),t=vo(o),t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:bo(t)}else if(i.attributes.color){let t={};t.l=i.attributes.brightness,t.h=i.attributes.color.h||i.attributes.color.hue,t.s=i.attributes.color.s||i.attributes.color.saturation;let{r:o,g:a,b:s}=jo.hslToRgb(t);if("rgb_csv"===r)e=`${o},${a},${s}`;else{e=`#${jo.padZero(o.toString(16))}${jo.padZero(a.toString(16))}${jo.padZero(s.toString(16))}`}}else i.attributes.xy_color}}break;default:console.error(`Unknown converter [${r}] specified for entity [${t.entity}]!`)}}return void 0!==e?Number.isNaN(e)?e:e.toString():void 0}_calculateStrokeColor(e,t,r){const i=t?.colors??[];if(!i.length)return;const o=Number(e);if(!Number.isFinite(o))return i[0].color;if(o<=i[0].value)return i[0].color;const a=i[i.length-1];if(o>=a.value)return a.color;for(let s=0;s<i.length-1;s+=1){const e=i[s],t=i[s+1];if(o>=e.value&&o<t.value){if(!r)return e.color;const i=jo.calculateValueBetween(e.value,t.value,o);return jo.getGradientValue(e.color,t.color,i)}}return a.color}_computeEntity(e){return e.substr(e.indexOf(".")+1)}getCardSize(){return 4}}customElements.get("flex-horseshoe-card")||customElements.define("flex-horseshoe-card",Jo);

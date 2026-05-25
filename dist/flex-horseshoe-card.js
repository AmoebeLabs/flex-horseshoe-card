/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),o=new WeakMap;let a=class{constructor(e,t,o){if(this._$cssResult$=!0,o!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const r=this.t;if(t&&void 0===e){const t=void 0!==r&&1===r.length;t&&(e=o.get(r)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&o.set(r,e))}return e}toString(){return this.cssText}};const i=(e,...t)=>{const o=1===e.length?e[0]:t.reduce(((t,r,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[o+1]),e[0]);return new a(o,e,r)},s=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return(e=>new a("string"==typeof e?e:e+"",void 0,r))(t)})(e):e
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,m=globalThis,p=m.trustedTypes,g=p?p.emptyScript:"",f=m.reactiveElementPolyfillSupport,b=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},v=(e,t)=>!n(e,t),_={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),o=this.getPropertyDescriptor(e,r,t);void 0!==o&&l(this.prototype,e,o)}}static getPropertyDescriptor(e,t,r){const{get:o,set:a}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:o,set(t){const i=o?.call(this);a?.call(this,t),this.requestUpdate(e,i,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...d(e),...h(e)];for(const r of t)this.createProperty(r,e[r])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,r]of t)this.elementProperties.set(e,r)}this._$Eh=new Map;for(const[t,r]of this.elementProperties){const e=this._$Eu(t,r);void 0!==e&&this._$Eh.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(s(e))}else void 0!==e&&t.push(s(e));return t}static _$Eu(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((r,o)=>{if(t)r.adoptedStyleSheets=o.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const t of o){const o=document.createElement("style"),a=e.litNonce;void 0!==a&&o.setAttribute("nonce",a),o.textContent=t.cssText,r.appendChild(o)}})(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){const r=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,r);if(void 0!==o&&!0===r.reflect){const a=(void 0!==r.converter?.toAttribute?r.converter:y).toAttribute(t,r.type);this._$Em=e,null==a?this.removeAttribute(o):this.setAttribute(o,a),this._$Em=null}}_$AK(e,t){const r=this.constructor,o=r._$Eh.get(e);if(void 0!==o&&this._$Em!==o){const e=r.getPropertyOptions(o),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=o;const i=a.fromAttribute(t,e.type);this[o]=i??this._$Ej?.get(o)??i,this._$Em=null}}requestUpdate(e,t,r,o=!1,a){if(void 0!==e){const i=this.constructor;if(!1===o&&(a=this[e]),r??=i.getPropertyOptions(e),!((r.hasChanged??v)(a,t)||r.useDefault&&r.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(i._$Eu(e,r))))return;this.C(e,t,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:o,wrapped:a},i){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,i??t??this[e]),!0!==a||void 0!==i)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),!0===o&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,r]of e){const{wrapped:e}=r,o=this[t];!0!==e||this._$AL.has(t)||void 0===o||this.C(t,void 0,r,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,f?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,w=$.trustedTypes,M=w?w.createPolicy("flex-horseshoe-card-lit-html",{createHTML:e=>e}):void 0,S="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,A="?"+k,C=`<${A}>`,E=document,N=()=>E.createComment(""),z=e=>null===e||"object"!=typeof e&&"function"!=typeof e,P=Array.isArray,T="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,D=/>/g,V=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,H=/"/g,R=/^(?:script|style|textarea|title)$/i,L=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),F=L(1),q=L(2),U=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),J=new WeakMap,B=E.createTreeWalker(E,129);function W(e,t){if(!P(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==M?M.createHTML(t):t}const K=(e,t)=>{const r=e.length-1,o=[];let a,i=2===t?"<svg>":3===t?"<math>":"",s=I;for(let n=0;n<r;n++){const t=e[n];let r,l,c=-1,d=0;for(;d<t.length&&(s.lastIndex=d,l=s.exec(t),null!==l);)d=s.lastIndex,s===I?"!--"===l[1]?s=O:void 0!==l[1]?s=D:void 0!==l[2]?(R.test(l[2])&&(a=RegExp("</"+l[2],"g")),s=V):void 0!==l[3]&&(s=V):s===V?">"===l[0]?(s=a??I,c=-1):void 0===l[1]?c=-2:(c=s.lastIndex-l[2].length,r=l[1],s=void 0===l[3]?V:'"'===l[3]?H:j):s===H||s===j?s=V:s===O||s===D?s=I:(s=V,a=void 0);const h=s===V&&e[n+1].startsWith("/>")?" ":"";i+=s===I?t+C:c>=0?(o.push(r),t.slice(0,c)+S+t.slice(c)+k+h):t+k+(-2===c?n:h)}return[W(e,i+(e[r]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),o]};class Y{constructor({strings:e,_$litType$:t},r){let o;this.parts=[];let a=0,i=0;const s=e.length-1,n=this.parts,[l,c]=K(e,t);if(this.el=Y.createElement(l,r),B.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(o=B.nextNode())&&n.length<s;){if(1===o.nodeType){if(o.hasAttributes())for(const e of o.getAttributeNames())if(e.endsWith(S)){const t=c[i++],r=o.getAttribute(e).split(k),s=/([.?@])?(.*)/.exec(t);n.push({type:1,index:a,name:s[2],strings:r,ctor:"."===s[1]?te:"?"===s[1]?re:"@"===s[1]?oe:ee}),o.removeAttribute(e)}else e.startsWith(k)&&(n.push({type:6,index:a}),o.removeAttribute(e));if(R.test(o.tagName)){const e=o.textContent.split(k),t=e.length-1;if(t>0){o.textContent=w?w.emptyScript:"";for(let r=0;r<t;r++)o.append(e[r],N()),B.nextNode(),n.push({type:2,index:++a});o.append(e[t],N())}}}else if(8===o.nodeType)if(o.data===A)n.push({type:2,index:a});else{let e=-1;for(;-1!==(e=o.data.indexOf(k,e+1));)n.push({type:7,index:a}),e+=k.length-1}a++}}static createElement(e,t){const r=E.createElement("template");return r.innerHTML=e,r}}function X(e,t,r=e,o){if(t===U)return t;let a=void 0!==o?r._$Co?.[o]:r._$Cl;const i=z(t)?void 0:t._$litDirective$;return a?.constructor!==i&&(a?._$AO?.(!1),void 0===i?a=void 0:(a=new i(e),a._$AT(e,r,o)),void 0!==o?(r._$Co??=[])[o]=a:r._$Cl=a),void 0!==a&&(t=X(e,a._$AS(e,t.values),a,o)),t}class Z{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,o=(e?.creationScope??E).importNode(t,!0);B.currentNode=o;let a=B.nextNode(),i=0,s=0,n=r[0];for(;void 0!==n;){if(i===n.index){let t;2===n.type?t=new Q(a,a.nextSibling,this,e):1===n.type?t=new n.ctor(a,n.name,n.strings,this,e):6===n.type&&(t=new ae(a,this,e)),this._$AV.push(t),n=r[++s]}i!==n?.index&&(a=B.nextNode(),i++)}return B.currentNode=E,o}p(e){let t=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}let Q=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,o){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),z(e)?e===G||null==e||""===e?(this._$AH!==G&&this._$AR(),this._$AH=G):e!==this._$AH&&e!==U&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>P(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==G&&z(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:r}=e,o="number"==typeof r?this._$AC(e):(void 0===r.el&&(r.el=Y.createElement(W(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===o)this._$AH.p(t);else{const e=new Z(o,this),r=e.u(this.options);e.p(t),this.T(r),this._$AH=e}}_$AC(e){let t=J.get(e.strings);return void 0===t&&J.set(e.strings,t=new Y(e)),t}k(t){P(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,a=0;for(const i of t)a===r.length?r.push(o=new e(this.O(N()),this.O(N()),this,this.options)):o=r[a],o._$AI(i),a++;a<r.length&&(this._$AR(o&&o._$AB.nextSibling,a),r.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}};class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,o,a){this.type=1,this._$AH=G,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=a,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=G}_$AI(e,t=this,r,o){const a=this.strings;let i=!1;if(void 0===a)e=X(this,e,t,0),i=!z(e)||e!==this._$AH&&e!==U,i&&(this._$AH=e);else{const o=e;let s,n;for(e=a[0],s=0;s<a.length-1;s++)n=X(this,o[r+s],t,s),n===U&&(n=this._$AH[s]),i||=!z(n)||n!==this._$AH[s],n===G?e=G:e!==G&&(e+=(n??"")+a[s+1]),this._$AH[s]=n}i&&!o&&this.j(e)}j(e){e===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===G?void 0:e}}class re extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==G)}}class oe extends ee{constructor(e,t,r,o,a){super(e,t,r,o,a),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??G)===U)return;const r=this._$AH,o=e===G&&r!==G||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,a=e!==G&&(r===G||o);o&&this.element.removeEventListener(this.name,this,r),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ae{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const ie=$.litHtmlPolyfillSupport;ie?.(Y,Q),($.litHtmlVersions??=[]).push("3.3.2");const se=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ne=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,r)=>{const o=r?.renderBefore??t;let a=o._$litPart$;if(void 0===a){const e=r?.renderBefore??null;o._$litPart$=a=new Q(t.insertBefore(N(),e),e,void 0,r??{})}return a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return U}};ne._$litElement$=!0,ne.finalized=!0,se.litElementHydrateSupport?.({LitElement:ne});const le=se.litElementPolyfillSupport;le?.({LitElement:ne}),(se.litElementVersions??=[]).push("4.2.2");
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
 */const he="important",ue=" !"+he,me=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends de{constructor(e){if(super(e),e.type!==ce||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce(((t,r)=>{const o=e[r];return null==o?t:t+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`}),"")}update(e,[t]){const{style:r}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const o of this.ft)null==t[o]&&(this.ft.delete(o),o.includes("-")?r.removeProperty(o):r[o]=null);for(const o in t){const e=t[o];if(null!=e){this.ft.add(o);const t="string"==typeof e&&e.endsWith(ue);o.includes("-")||t?r.setProperty(o,t?e.slice(0,-11):e,t?he:""):r[o]=e}}return U}});class pe{static toStyleDict(e){return pe.toDict(e,{stringToDict:pe.cssStringToDict,mapValue:pe.toStyleValue})}static toClassDict(e){return pe.toDict(e,{stringToDict:pe.classStringToDict,mapValue:Boolean})}static toIconDict(e){return pe.toDict(e,{stringToDict:pe.stringToDefaultDict("default"),mapValue:String})}static toDict(e,t={}){const{stringToDict:r=pe.stringToDefaultDict("default"),mapValue:o=(e=>e),skipNull:a=!0,skipFalse:i=!0}=t,s=e=>null==e&&a||!1===e&&i?{}:Array.isArray(e)?e.reduce(((e,t)=>({...e,...s(t)})),{}):pe.isPlainObject(e)?Object.fromEntries(Object.entries(e).filter((([,e])=>(null!=e||!a)&&(!1!==e||!i))).map((([e,t])=>[e,o(t,e)]))):"string"==typeof e?r(e):{};return s(e)}static toStyleValue(e){return null==e?e:String(e).trim().replace(/;+$/,"")}static cssStringToDict(e){return String(e).split(";").map((e=>e.trim())).filter(Boolean).reduce(((e,t)=>{const r=t.indexOf(":");if(r<=0)return e;const o=t.slice(0,r).trim(),a=t.slice(r+1).trim();return o&&a?{...e,[o]:a}:e}),{})}static toColorStopDict(e){return pe.toDict(e,{stringToDict:pe.keyValueStringToDict,mapValue:String})}static keyValueStringToDict(e){const t=String(e).trim(),r=t.indexOf(":");if(r<=0)return{};const o=t.slice(0,r).trim(),a=t.slice(r+1).trim();return o&&a?{[o]:a}:{}}static classStringToDict(e){return String(e).trim().split(/\s+/).filter(Boolean).reduce(((e,t)=>({...e,[t]:!0})),{})}static stringToDefaultDict(e="default"){return t=>({[e]:String(t)})}static requireArray(e,t="value"){if(null==e)return[];if(!Array.isArray(e))throw new Error(`[config-helper] "${t}" must be an array.`);return e}static ensureArray(e){return null==e?[]:Array.isArray(e)?e:[e]}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}}class ge{static context={};static setContext(e={}){ge.context=e}static getJsTemplateOrValue(e,t,r={}){return ge._getJsTemplateOrValue(e,t,r,0)}static _getJsTemplateOrValue(e,t,r={},o=0){const{resolveKeys:a=!0,maxDepth:i=10}=r;if(o>=i)return t;if(null==t)return t;if(["number","boolean","bigint","symbol"].includes(typeof t))return t;if(Array.isArray(t))return t.map((t=>ge._getJsTemplateOrValue(e,t,r,o)));if(ge.isPlainObject(t))return Object.fromEntries(Object.entries(t).map((([t,i])=>{const s=a?ge._getJsTemplateOrValue(e,t,r,o):t,n=ge._getJsTemplateOrValue(e,i,r,o);return[String(s),n]})));if("string"!=typeof t)return t;const s=t.trim();if(!ge.isJsTemplate(s))return t;const n=ge.evaluateJsTemplate(e,ge.extractJsTemplateCode(s));return ge._getJsTemplateOrValue(e,n,r,o+1)}static getJsTemplateOrValueV1(e,t,r={}){const{resolveKeys:o=!0}=r;if(null==t)return t;if(["number","boolean","bigint","symbol"].includes(typeof t))return t;if(Array.isArray(t))return t.map((t=>ge.getJsTemplateOrValue(e,t,r)));if(ge.isPlainObject(t))return Object.fromEntries(Object.entries(t).map((([t,a])=>{const i=o?ge.getJsTemplateOrValue(e,t,r):t,s=ge.getJsTemplateOrValue(e,a,r);return[String(i),s]})));if("string"!=typeof t)return t;const a=t.trim();if(ge.isJsTemplate(a)){const t=ge.evaluateJsTemplate(e,ge.extractJsTemplateCode(a));return ge.getJsTemplateOrValue(e,t,r)}return t}static isJsTemplate(e){return"string"==typeof e&&e.trim().startsWith("[[[")&&e.trim().endsWith("]]]")}static extractJsTemplateCode(e){return String(e).trim().slice(3,-3).trim()}static evaluateJsTemplate(e,t){const{hass:r,config:o,entities:a=[]}=ge.context,i=ge._getItemEntityIndex(e),s=ge._getTemplateState(e),n=a?.[i],l=r?.states,c=o?.variables??{},d=r?.user;o?.dev?.debug&&console.log("Evaluating JavaScript template with context:",{hass:r,config:o,entity:n,entities:a,states:l,state:s,variables:c,item:e,user:d});try{return new Function("hass","config","entity","entities","states","state","variables","item","user",`\n          "use strict";\n          ${t}\n        `)(r,o,n,a,l,s,c,e,d)}catch(h){return void(o?.dev?.debug&&console.error("[templates] JavaScript template error:",{error:h,item:e,javascript:t}))}}static _getTemplateState(e={}){const t=ge._getItemEntityIndex(e),r=ge.context.entities?.[t],o=ge.context.config?.entities?.[t]||{};if(!r)return;const a=o.attribute;return a&&r.attributes&&void 0!==r.attributes[a]?r.attributes[a]:r.state}static _getItemEntityIndex(e={}){const t=Number(e.entity_index);return Number.isFinite(t)?t:0}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}}class fe{static normalize(e){return e?Array.isArray(e)?{scales:{},colors:fe.normalizeColors(e)}:!fe.isPlainObject(e)||e.colors||e.scales?fe.isPlainObject(e)?{scales:fe.normalizeScales(e.scales),colors:fe.normalizeColors(e.colors)}:{scales:{},colors:[]}:{scales:{},colors:fe.normalizeColors(e)}:{scales:{},colors:[]}}static normalizeScales(e){return fe.isPlainObject(e)?Object.fromEntries(Object.entries(e).map((([e,t])=>[e,fe.isPlainObject(t)?{...t}:t]))):{}}static normalizeColors(e){return e?Array.isArray(e)?e.flatMap((e=>fe.normalizeColorArrayEntry(e))).filter(Boolean).sort(((e,t)=>e.value-t.value)):fe.isPlainObject(e)?Object.entries(e).map((([e,t])=>fe.normalizeColorPair(e,t))).filter(Boolean).sort(((e,t)=>e.value-t.value)):[]:[]}static normalizeColorArrayEntry(e){if(fe.isPlainObject(e)&&Object.prototype.hasOwnProperty.call(e,"value")&&Object.prototype.hasOwnProperty.call(e,"color")){const t=fe.normalizeColorEntry(e);return t?[t]:[]}return fe.isPlainObject(e)?Object.entries(e).map((([e,t])=>fe.normalizeColorPair(e,t))).filter(Boolean):[]}static normalizeColorPair(e,t){const r=Number(e);return Number.isFinite(r)?null==t?null:{value:r,color:String(t)}:null}static normalizeColorEntry(e){if(!fe.isPlainObject(e))return null;const t=Number(e.value);return Number.isFinite(t)?void 0===e.color||null===e.color?null:{...e,value:t,color:String(e.color)}:null}static ensureMinimumStops(e,t){return e?.colors&&1===e.colors.length?{...e,colors:[e.colors[0],{value:t,color:e.colors[0].color}]}:e}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}static _testColorStopsNormalizer(){const e={entity_index:0},t=[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}];[{name:"FHC dict",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC dict with quoted keys",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC list of dicts",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC list of dicts with quoted keys",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC dict with template values",raw:{0:"[[[\n          return 'red';\n        ]]]",10:"[[[\n          return 'green';\n        ]]]",20:"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template values",raw:[{0:"[[[\n            return 'red';\n          ]]]"},{10:"[[[\n            return 'green';\n          ]]]"},{20:"[[[\n            return 'blue';\n          ]]]"}]},{name:"FHC dict with template keys",raw:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}},{name:"FHC dict with template keys and values",raw:{"[[[ return 0; ]]]":"[[[\n          return 'red';\n        ]]]","[[[ return 10; ]]]":"[[[\n          return 'green';\n        ]]]","[[[ return 20; ]]]":"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template keys and values",raw:[{"[[[ return 0; ]]]":"[[[\n            return 'red';\n          ]]]"},{"[[[ return 10; ]]]":"[[[\n            return 'green';\n          ]]]"},{"[[[ return 20; ]]]":"[[[\n            return 'blue';\n          ]]]"}]},{name:"Whole FHC color_stops as template returning dict",raw:"[[[\n        return {\n          0: 'red',\n          10: 'green',\n          20: 'blue',\n        };\n      ]]]"},{name:"Whole FHC color_stops as template returning list",raw:"[[[\n        return [\n          { 0: 'red' },\n          { 10: 'green' },\n          { 20: 'blue' },\n        ];\n      ]]]"},{name:"SAK v1 colorstops.colors dict",raw:{colors:{0:"red",10:"green",20:"blue"}}},{name:"SAK v1 colorstops.colors dict with template keys",raw:{colors:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}}},{name:"SAK v1 colorstops.colors dict with template values",raw:{colors:{0:"[[[\n            return 'red';\n          ]]]",10:"[[[\n            return 'green';\n          ]]]",20:"[[[\n            return 'blue';\n          ]]]"}}},{name:"SAK v2 colors list",raw:{scales:{default:{min:0,max:20}},colors:[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}]}},{name:"SAK v2 colors list unsorted",raw:{scales:{default:{min:0,max:20}},colors:[{value:20,color:"blue",rank:2},{value:0,color:"red",rank:1},{value:10,color:"green",rank:1}]}},{name:"SAK v2 colors list with template values",raw:{scales:{default:{min:"[[[\n              return 0;\n            ]]]",max:"[[[\n              return 20;\n            ]]]"}},colors:[{value:"[[[\n              return 0;\n            ]]]",color:"[[[\n              return 'red';\n            ]]]"},{value:"[[[\n              return 10;\n            ]]]",color:"[[[\n              return 'green';\n            ]]]"},{value:"[[[\n              return 20;\n            ]]]",color:"[[[\n              return 'blue';\n            ]]]"}]}},{name:"SAK v2 whole colors list as template",raw:{scales:{default:{min:0,max:20}},colors:"[[[\n          return [\n            { value: 0, color: 'red' },\n            { value: 10, color: 'green' },\n            { value: 20, color: 'blue' },\n          ];\n        ]]]"}}].forEach((r=>{const o=ge.getJsTemplateOrValue(e,r.raw,{resolveKeys:!0}),a=fe.normalize(o),i=a.colors.map((e=>({value:e.value,color:e.color}))),s=JSON.stringify(i)===JSON.stringify(t);console.log(`[colorstops test] ${s?"PASS":"FAIL"} - ${r.name}`,{raw:r.raw,resolved:o,normalized:a,simpleColors:i,expectedColors:t})}))}}const be="mdi:bookmark",ye={air_quality:"mdi:air-filter",alert:"mdi:alert",calendar:"mdi:calendar",climate:"mdi:thermostat",configurator:"mdi:cog",conversation:"mdi:microphone-message",counter:"mdi:counter",datetime:"mdi:calendar-clock",date:"mdi:calendar",demo:"mdi:home-assistant",google_assistant:"mdi:google-assistant",group:"mdi:google-circles-communities",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_button:"mdi:gesture-tap-button",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",number:"mdi:ray-vertex",persistent_notification:"mdi:bell",plant:"mdi:Flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:palette",schedule:"mdi:calendar-clock",script:"mdi:script-text",select:"mdi:format-list-bulleted",sensor:"mdi:eye",simple_alarm:"mdi:bell",siren:"mdi:bullhorn",stt:"mdi:microphone-message",text:"mdi:form-textbox",time:"mdi:clock",timer:"mdi:timer-outline",tts:"mdi:speaker-message",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",zone:"mdi:map-marker-radius"},ve={apparent_power:"mdi:flash",aqi:"mdi:air-filter",atmospheric_pressure:"mdi:thermometer-lines",carbon_dioxide:"mdi:molecule-co2",carbon_monoxide:"mdi:molecule-co",current:"mdi:current-ac",data_rate:"mdi:transmission-tower",data_size:"mdi:database",date:"mdi:calendar",distance:"mdi:arrow-left-right",duration:"mdi:progress-clock",energy:"mdi:lightning-bolt",frequency:"mdi:sine-wave",gas:"mdi:meter-gas",humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",irradiance:"mdi:sun-wireless",moisture:"mdi:water-percent",monetary:"mdi:cash",nitrogen_dioxide:"mdi:molecule",nitrogen_monoxide:"mdi:molecule",nitrous_oxide:"mdi:molecule",ozone:"mdi:molecule",pm1:"mdi:molecule",pm10:"mdi:molecule",pm25:"mdi:molecule",power:"mdi:flash",power_factor:"mdi:angle-acute",precipitation:"mdi:weather-rainy",precipitation_intensity:"mdi:weather-pouring",pressure:"mdi:gauge",reactive_power:"mdi:flash",signal_strength:"mdi:wifi",sound_pressure:"mdi:ear-hearing",speed:"mdi:speedometer",sulphur_dioxide:"mdi:molecule",temperature:"mdi:thermometer",timestamp:"mdi:clock",volatile_organic_compounds:"mdi:molecule",volatile_organic_compounds_parts:"mdi:molecule",voltage:"mdi:sine-wave",volume:"mdi:car-coolant-level",water:"mdi:water",weight:"mdi:weight",wind_speed:"mdi:weather-windy"},_e=e=>e.substring(0,e.indexOf(".")),xe={10:"mdi:battery-10",20:"mdi:battery-20",30:"mdi:battery-30",40:"mdi:battery-40",50:"mdi:battery-50",60:"mdi:battery-60",70:"mdi:battery-70",80:"mdi:battery-80",90:"mdi:battery-90",100:"mdi:battery"},$e=(e,t)=>{const r=Number(e);if(isNaN(r))return"off"===e?"mdi:battery":"on"===e?"mdi:battery-alert":"mdi:battery-unknown";const o=10*Math.round(r/10);return r<=5?"mdi:battery-alert-variant-outline":xe[o]},we=e=>{const t=e?.attributes.device_class;if(t&&t in ve)return ve[t];if("battery"===t)return e?((e,t)=>{const r=e.state;return $e(r)})(e):"mdi:battery";const r=e?.attributes.unit_of_measurement;return"°C"===r||"°F"===r?"mdi-thermometer":void 0},Me=(e,t,r)=>{const o=t?.state;switch(e){case"alarm_control_panel":return(e=>{switch(e){case"armed_away":return"mdi:shield-lock";case"armed_vacation":return"mdi:shield-airplane";case"armed_home":return"mdi:shield-home";case"armed_night":return"mdi:shield-moon";case"armed_custom_bypass":return"mdi:security";case"pending":return"mdi:shield-outline";case"triggered":return"mdi:bell-ring";case"disarmed":return"mdi:shield-off";default:return"mdi:shield"}})(o);case"automation":return"off"===o?"mdi:robot-off":"mdi:robot";case"binary_sensor":return((e,t)=>{const r="off"===e;switch(t?.attributes.device_class){case"battery":return r?"mdi:battery":"mdi:battery-outline";case"battery_charging":return r?"mdi:battery":"mdi:battery-charging";case"carbon_monoxide":return r?"mdi:smoke-detector":"mdi:smoke-detector-alert";case"cold":return r?"mdi:thermometer":"mdi:Snowflake";case"connectivity":return r?"mdi:close-network-outline":"mdi:check-network-outline";case"door":return r?"mdi:door-closed":"mdi:door-open";case"garage_door":return r?"mdi:garage":"mdi:garage-open";case"power":case"plug":return r?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return r?"mdi:check-circle":"mdi:alert-circle";case"smoke":return r?"mdi:smoke-detector-variant":"mdi:smoke-detector-variant-alert";case"heat":return r?"mdi:thermometer":"mdi:fire";case"light":return r?"mdi:brightness-5":"mdi:brightness-7";case"lock":return r?"mdi:lock":"mdi:lock-open";case"moisture":return r?"mdi:water-off":"mdi:water";case"motion":return r?"mdi:motion-sensor-off":"mdi:motion-sensor";case"occupancy":return r?"mdi:home-outline":"mdi:Home";case"opening":return r?"mdi:square":"mdi:square-outline";case"presence":return r?"mdi:home-outline":"mdi:home";case"running":return r?"mdi:stop":"mdi:play";case"sound":return r?"mdi:music-note-off":"mdi:music-note";case"update":return r?"mdi:package":"mdi:package-up";case"vibration":return r?"mdi:crop-portrait":"mdi:vibrate";case"window":return r?"mdi:window-closed":"mdi:window-open";default:return r?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}})(o,t);case"button":switch(t?.attributes.device_class){case"restart":return"mdi:restart";case"update":return"mdi:package-up";default:return"mdi:gesture-tap-button"}case"camera":return"off"===o?"mdi:video-off":"mdi:video";case"cover":return((e,t)=>{const r="closed"!==e;switch(t?.attributes.device_class){case"garage":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdigarage";default:return"mdi:Garage-open"}case"gate":switch(e){case"opening":case"closing":return"mdi:gate-arrow-right";case"closed":return"mdi:gate";default:return"mdi:gate-open"}case"door":return r?"mdi:door-open":"mdi:door-closed";case"damper":return r?"mdi:circle":"mdi:circle-slice-8";case"shutter":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window-shutter";default:return"mdi:window-shutter-open"}case"curtain":switch(e){case"opening":return"mdi:arrow-split-vertical";case"closing":return"mdi:arrow-collapse-horizontal";case"closed":return"mdi:curtains-closed";default:return"mdi:curtains"}case"blind":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:blinds-horizontal-closed";default:return"mdi:blinds-horizontal"}case"shade":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:roller-shade-closed";default:return"mdi:roller-shade"}case"window":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}}switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}})(o,t);case"device_tracker":return"router"===t?.attributes.source_type?"home"===o?"mdi:lan-connect":"mdi:lan-cisconnect":["bluetooth","bluetooth_le"].includes(t?.attributes.source_type)?"home"===o?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===o?"mdi:account-arrow-right":"mdi:account";case"fan":return"off"===o?"mdi:fan-off":"mdi:fan";case"humidifier":return"off"===o?"mdi:air-humidifier-off":"mdi:air-humidifier";case"input_boolean":return"on"===o?"mdi:check-circle-outline":"mdi:close-circle-outline";case"input_datetime":if(!t?.attributes.has_date)return"mdi:clock";if(!t.attributes.has_time)return"mdi:calendar";break;case"lock":switch(o){case"unlocked":return"mdi:lock-open";case"jammed":return"mdi:lock-alert";case"locking":case"unlocking":return"mdi:lock-clock";default:return"mdi:lock"}case"media_player":switch(t?.attributes.device_class){case"speaker":switch(o){case"playing":return"mdi:speaker-play";case"paused":return"mdi:speaker-pause";case"off":return"mdi:speaker-off";default:return"mdi:speaker"}case"tv":switch(o){case"playing":return"mdi:television-play";case"paused":return"mdi:television-pause";case"off":return"mdi:television-off";default:return"mdi:television"}case"receiver":return"off"===o?"mdi:audio-video-off":"mdi:audio-video";default:switch(o){case"playing":case"paused":return"mdi:cast-connected";case"off":return"mdi:cast-off";default:return"mdi:cast"}}case"number":{const e=(e=>{const t=e?.attributes.device_class;if(t&&t in ve)return ve[t]})(t);if(e)return e;break}case"person":return"not_home"===o?"mdi:account-arrow-right":"mdi:account";case"switch":switch(t?.attributes.device_class){case"outlet":return"on"===o?"mdi:power-plug":"mdi:power-plug-off";case"switch":return"on"===o?"mdi:toggle-switch-variant":"mdi:toggle-switch-variant-off";default:return"mdi:toggle-switch-variant"}case"sensor":{const e=we(t);if(e)return e;break}case"sun":return"above_horizon"===t?.state?"mdi:white-balance-sunny":"mdi:weather-night";case"switch_as_x":return"mdi:swap-horizontal";case"threshold":return"mdi:chart-sankey";case"water_heater":return"off"===o?"mdi:water-boiler-off":"mdi:water-boiler"}if(e in ye)return ye[e]},Se=e=>{return e?(t=_e(e.entity_id),Me(t,e)||(console.warn(`Unable to find icon for domain ${t}`),be)):be;var t};var ke,Ae,Ce,Ee,Ne;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.quote_decimal="quote_decimal",e.space_comma="space_comma",e.none="none"}(ke||(ke={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Ae||(Ae={})),function(e){e.local="local",e.server="server"}(Ce||(Ce={})),function(e){e.language="language",e.system="system",e.DMY="DMY",e.MDY="MDY",e.YMD="YMD"}(Ee||(Ee={})),function(e){e.language="language",e.monday="monday",e.tuesday="tuesday",e.wednesday="wednesday",e.thursday="thursday",e.friday="friday",e.saturday="saturday",e.sunday="sunday"}(Ne||(Ne={}));const ze=(e,t,r)=>{const o=t?(e=>{switch(e.number_format){case ke.comma_decimal:return["en-US","en"];case ke.decimal_comma:return["de","es","it"];case ke.space_comma:return["fr","sv","cs"];case ke.quote_decimal:return["de-CH"];case ke.system:return;default:return e.language}})(t):void 0;return t?.number_format===ke.none||Number.isNaN(Number(e))?Number.isNaN(Number(e))||""===e||t?.number_format!==ke.none?[{type:"literal",value:e}]:new Intl.NumberFormat("en-US",Pe(e,{...r,useGrouping:!1})).formatToParts(Number(e)):new Intl.NumberFormat(o,Pe(e,r)).formatToParts(Number(e))},Pe=(e,t)=>{const r={maximumFractionDigits:2,...t};if("string"!=typeof e)return r;if(!t||void 0===t.minimumFractionDigits&&void 0===t.maximumFractionDigits){const t=e.indexOf(".")>-1?e.split(".")[1].length:0;r.minimumFractionDigits=t,r.maximumFractionDigits=t}return r};Intl.DateTimeFormat?.().resolvedOptions?.().timeZone;const Te="unavailable",Ie=(Oe=[Te,"unknown"],(e,t)=>Oe.includes(e,t));var Oe;const De=(e,t)=>e&&e.components.includes(t),Ve=e=>_e(e.entity_id),je={entity:{},entity_component:{}},He=async(e,t,r)=>((e,t)=>e.sendMessagePromise(t))(e,{type:"frontend/get_icons",category:t,integration:r}),Re=async(e,t,r,o=!1)=>{if(!o&&r in je.entity)return je.entity[r];if(!De(e,r)||!((e,t,r,o)=>{const[a,i,s]=e.split(".",3);return Number(a)>t||Number(a)===t&&(void 0===o?Number(i)>=r:Number(i)>r)||void 0!==o&&Number(a)===t&&Number(i)===r&&Number(s)>=o})(t.haVersion,2024,2))return;const a=He(t,"entity",r).then((e=>e?.resources[r]));return je.entity[r]=a,je.entity[r]},Le=async(e,t,r,o=!1)=>!o&&je.entity_component.resources&&je.entity_component.domains?.includes(r)?je.entity_component.resources.then((e=>e[r])):De(t,r)?(je.entity_component.domains=[...t.components],je.entity_component.resources=He(e,"entity_component").then((e=>e.resources)),je.entity_component.resources.then((e=>e[r]))):void 0,Fe=new WeakMap,qe=(e,t)=>{if(t)return e&&t.state?.[e]?t.state[e]:void 0!==e&&t.range&&!isNaN(Number(e))?((e,t)=>{let r=Fe.get(t);if(r||(r=Object.keys(t).map(Number).filter((e=>!isNaN(e))).sort(((e,t)=>e-t)),Fe.set(t,r)),0===r.length)return;if(e<r[0])return;let o=r[0];for(const a of r){if(!(e>=a))break;o=a}return t[o.toString()]})(Number(e),t.range)??t.default:t.default},Ue=async(e,t,r,o,a,i)=>{const s=i?.platform,n=i?.translation_key,l=o?.attributes.device_class,c=o?.state;let d;if(n&&s){const o=await Re(e,t,s);if(o){const e=o[r]?.[n];d=qe(c,e)}}if(!d&&o&&(d=((e,t)=>{const r=Ve(e),o=t??e.state;switch(r){case"device_tracker":return((e,t)=>{const r=t??e.state;return"router"===e?.attributes.source_type?"home"===r?"mdi:lan-connect":"mdi:lan-disconnect":["bluetooth","bluetooth_le"].includes(e?.attributes.source_type)?"home"===r?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===r?"mdi:account-arrow-right":"mdi:account"})(e,o);case"sun":return"above_horizon"===o?"mdi:white-balance-sunny":"mdi:weather-night";case"input_datetime":if(!e.attributes.has_date)return"mdi:clock";if(!e.attributes.has_time)return"mdi:calendar"}})(o,c)),!d){const o=await Le(t,e,r);if(o){const e=l&&o[l]||o._;d=qe(c,e)}}return d},Ge=(e,t)=>{if("number"==typeof e)return 3===t?{mode:"rgb",r:(e>>8&15|e>>4&240)/255,g:(e>>4&15|240&e)/255,b:(15&e|e<<4&240)/255}:4===t?{mode:"rgb",r:(e>>12&15|e>>8&240)/255,g:(e>>8&15|e>>4&240)/255,b:(e>>4&15|240&e)/255,alpha:(15&e|e<<4&240)/255}:6===t?{mode:"rgb",r:(e>>16&255)/255,g:(e>>8&255)/255,b:(255&e)/255}:8===t?{mode:"rgb",r:(e>>24&255)/255,g:(e>>16&255)/255,b:(e>>8&255)/255,alpha:(255&e)/255}:void 0},Je={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Be=/^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i,We="([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)",Ke=`${We}%`,Ye=`(?:${We}%|${We})`,Xe=`(?:${We}(deg|grad|rad|turn)|${We})`,Ze="\\s*,\\s*",Qe=new RegExp(`^rgba?\\(\\s*${We}${Ze}${We}${Ze}${We}\\s*(?:,\\s*${Ye}\\s*)?\\)$`),et=new RegExp(`^rgba?\\(\\s*${Ke}${Ze}${Ke}${Ze}${Ke}\\s*(?:,\\s*${Ye}\\s*)?\\)$`),tt=(e="rgb")=>t=>void 0!==(t=((e,t)=>void 0===e?void 0:"object"!=typeof e?$t(e):void 0!==e.mode?e:t?{...e,mode:t}:void 0)(t,e))?t.mode===e?t:rt[t.mode][e]?rt[t.mode][e](t):"rgb"===e?rt[t.mode].rgb(t):rt.rgb[e](rt[t.mode].rgb(t)):void 0,rt={},ot={},at=[],it={},st=e=>e,nt=e=>(rt[e.mode]={...rt[e.mode],...e.toMode},Object.keys(e.fromMode||{}).forEach((t=>{rt[t]||(rt[t]={}),rt[t][e.mode]=e.fromMode[t]})),e.ranges||(e.ranges={}),e.difference||(e.difference={}),e.channels.forEach((t=>{if(void 0===e.ranges[t]&&(e.ranges[t]=[0,1]),!e.interpolate[t])throw new Error(`Missing interpolator for: ${t}`);"function"==typeof e.interpolate[t]&&(e.interpolate[t]={use:e.interpolate[t]}),e.interpolate[t].fixup||(e.interpolate[t].fixup=st)})),ot[e.mode]=e,(e.parse||[]).forEach((t=>{lt(t,e.mode)})),tt(e.mode)),lt=(e,t)=>{if("string"==typeof e){if(!t)throw new Error("'mode' required when 'parser' is a string");it[e]=t}else"function"==typeof e&&at.indexOf(e)<0&&at.push(e)},ct=/[^\x00-\x7F]|[a-zA-Z_]/,dt=/[^\x00-\x7F]|[-\w]/,ht={Function:"function",Ident:"ident",Number:"number",Percentage:"percentage",ParenClose:")",None:"none",Hue:"hue",Alpha:"alpha"};let ut=0;function mt(e){let t=e[ut],r=e[ut+1];return"-"===t||"+"===t?/\d/.test(r)||"."===r&&/\d/.test(e[ut+2]):/\d/.test("."===t?r:t)}function pt(e){if(ut>=e.length)return!1;let t=e[ut];if(ct.test(t))return!0;if("-"===t){if(e.length-ut<2)return!1;let t=e[ut+1];return!("-"!==t&&!ct.test(t))}return!1}const gt={deg:1,rad:180/Math.PI,grad:.9,turn:360};function ft(e){let t="";if("-"!==e[ut]&&"+"!==e[ut]||(t+=e[ut++]),t+=bt(e),"."===e[ut]&&/\d/.test(e[ut+1])&&(t+=e[ut++]+bt(e)),"e"!==e[ut]&&"E"!==e[ut]||("-"!==e[ut+1]&&"+"!==e[ut+1]||!/\d/.test(e[ut+2])?/\d/.test(e[ut+1])&&(t+=e[ut++]+bt(e)):t+=e[ut++]+e[ut++]+bt(e)),pt(e)){let r=yt(e);return"deg"===r||"rad"===r||"turn"===r||"grad"===r?{type:ht.Hue,value:t*gt[r]}:void 0}return"%"===e[ut]?(ut++,{type:ht.Percentage,value:+t}):{type:ht.Number,value:+t}}function bt(e){let t="";for(;/\d/.test(e[ut]);)t+=e[ut++];return t}function yt(e){let t="";for(;ut<e.length&&dt.test(e[ut]);)t+=e[ut++];return t}function vt(e){let t=yt(e);return"("===e[ut]?(ut++,{type:ht.Function,value:t}):"none"===t?{type:ht.None,value:void 0}:{type:ht.Ident,value:t}}function _t(e){e._i=0;let t=e[e._i++];if(!t||t.type!==ht.Function||"color"!==t.value)return;if(t=e[e._i++],t.type!==ht.Ident)return;const r=it[t.value];if(!r)return;const o={mode:r},a=xt(e,!1);if(!a)return;const i=(e=>ot[e])(r).channels;for(let s,n,l=0;l<i.length;l++)s=a[l],n=i[l],s.type!==ht.None&&(o[n]=s.type===ht.Number?s.value:s.value/100,"alpha"===n&&(o[n]=Math.max(0,Math.min(1,o[n]))));return o}function xt(e,t){const r=[];let o;for(;e._i<e.length;)if(o=e[e._i++],o.type===ht.None||o.type===ht.Number||o.type===ht.Alpha||o.type===ht.Percentage||t&&o.type===ht.Hue)r.push(o);else{if(o.type!==ht.ParenClose)return;if(e._i<e.length)return}if(!(r.length<3||r.length>4)){if(4===r.length){if(r[3].type!==ht.Alpha)return;r[3]=r[3].value}return 3===r.length&&r.push({type:ht.None,value:void 0}),r.every((e=>e.type!==ht.Alpha))?r:void 0}}const $t=e=>{if("string"!=typeof e)return;const t=function(e=""){let t,r=e.trim(),o=[];for(ut=0;ut<r.length;)if(t=r[ut++],"\n"!==t&&"\t"!==t&&" "!==t){if(","===t)return;if(")"!==t){if("+"===t){if(ut--,mt(r)){o.push(ft(r));continue}return}if("-"===t){if(ut--,mt(r)){o.push(ft(r));continue}if(pt(r)){o.push({type:ht.Ident,value:yt(r)});continue}return}if("."===t){if(ut--,mt(r)){o.push(ft(r));continue}return}if("/"===t){for(;ut<r.length&&("\n"===r[ut]||"\t"===r[ut]||" "===r[ut]);)ut++;let e;if(mt(r)&&(e=ft(r),e.type!==ht.Hue)){o.push({type:ht.Alpha,value:e});continue}if(pt(r)&&"none"===yt(r)){o.push({type:ht.Alpha,value:{type:ht.None,value:void 0}});continue}return}if(/\d/.test(t))ut--,o.push(ft(r));else{if(!ct.test(t))return;ut--,o.push(vt(r))}}else o.push({type:ht.ParenClose})}else for(;ut<r.length&&("\n"===r[ut]||"\t"===r[ut]||" "===r[ut]);)ut++;return o}(e),r=t?function(e,t){e._i=0;let r=e[e._i++];if(!r||r.type!==ht.Function)return;let o=xt(e,t);return o?(o.unshift(r.value),o):void 0}(t,!0):void 0;let o,a=0,i=at.length;for(;a<i;)if(void 0!==(o=at[a++](e,r)))return o;return t?_t(t):void 0};const wt=(Mt=(e,t,r)=>e+r*(t-e),e=>{let t=(e=>{let t=[];for(let r=0;r<e.length-1;r++){let o=e[r],a=e[r+1];void 0===o&&void 0===a?t.push(void 0):void 0!==o&&void 0!==a?t.push([o,a]):t.push(void 0!==o?[o,o]:[a,a])}return t})(e);return e=>{let r=e*t.length,o=e>=1?t.length-1:Math.max(Math.floor(r),0),a=t[o];return void 0===a?void 0:Mt(a[0],a[1],r-o)}});var Mt;const St=e=>{let t=!1,r=e.map((e=>void 0!==e?(t=!0,e):1));return t?r:e},kt={mode:"rgb",channels:["r","g","b","alpha"],parse:[function(e,t){if(!t||"rgb"!==t[0]&&"rgba"!==t[0])return;const r={mode:"rgb"},[,o,a,i,s]=t;return o.type!==ht.Hue&&a.type!==ht.Hue&&i.type!==ht.Hue?(o.type!==ht.None&&(r.r=o.type===ht.Number?o.value/255:o.value/100),a.type!==ht.None&&(r.g=a.type===ht.Number?a.value/255:a.value/100),i.type!==ht.None&&(r.b=i.type===ht.Number?i.value/255:i.value/100),s.type!==ht.None&&(r.alpha=Math.min(1,Math.max(0,s.type===ht.Number?s.value:s.value/100))),r):void 0},e=>{let t;return(t=e.match(Be))?Ge(parseInt(t[1],16),t[1].length):void 0},e=>{let t,r={mode:"rgb"};if(t=e.match(Qe))void 0!==t[1]&&(r.r=t[1]/255),void 0!==t[2]&&(r.g=t[2]/255),void 0!==t[3]&&(r.b=t[3]/255);else{if(!(t=e.match(et)))return;void 0!==t[1]&&(r.r=t[1]/100),void 0!==t[2]&&(r.g=t[2]/100),void 0!==t[3]&&(r.b=t[3]/100)}return void 0!==t[4]?r.alpha=Math.max(0,Math.min(1,t[4]/100)):void 0!==t[5]&&(r.alpha=Math.max(0,Math.min(1,+t[5]))),r},e=>Ge(Je[e.toLowerCase()],6),e=>"transparent"===e?{mode:"rgb",r:0,g:0,b:0,alpha:0}:void 0,"srgb"],serialize:"srgb",interpolate:{r:wt,g:wt,b:wt,alpha:{use:wt,fixup:St}},gamut:!0,white:{r:1,g:1,b:1},black:{r:0,g:0,b:0}},At=(e=0)=>Math.pow(Math.abs(e),563/256)*Math.sign(e),Ct=e=>{let t=At(e.r),r=At(e.g),o=At(e.b),a={mode:"xyz65",x:.5766690429101305*t+.1855582379065463*r+.1882286462349947*o,y:.297344975250536*t+.6273635662554661*r+.0752914584939979*o,z:.0270313613864123*t+.0706888525358272*r+.9913375368376386*o};return void 0!==e.alpha&&(a.alpha=e.alpha),a},Et=e=>Math.pow(Math.abs(e),256/563)*Math.sign(e),Nt=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a={mode:"a98",r:Et(2.0415879038107465*e-.5650069742788597*t-.3447313507783297*r),g:Et(-.9692436362808798*e+1.8759675015077206*t+.0415550574071756*r),b:Et(.0134442806320312*e-.1183623922310184*t+1.0151749943912058*r)};return void 0!==o&&(a.alpha=o),a},zt=(e=0)=>{const t=Math.abs(e);return t<=.04045?e/12.92:(Math.sign(e)||1)*Math.pow((t+.055)/1.055,2.4)},Pt=({r:e,g:t,b:r,alpha:o})=>{let a={mode:"lrgb",r:zt(e),g:zt(t),b:zt(r)};return void 0!==o&&(a.alpha=o),a},Tt=e=>{let{r:t,g:r,b:o,alpha:a}=Pt(e),i={mode:"xyz65",x:.4123907992659593*t+.357584339383878*r+.1804807884018343*o,y:.2126390058715102*t+.715168678767756*r+.0721923153607337*o,z:.0193308187155918*t+.119194779794626*r+.9505321522496607*o};return void 0!==a&&(i.alpha=a),i},It=(e=0)=>{const t=Math.abs(e);return t>.0031308?(Math.sign(e)||1)*(1.055*Math.pow(t,1/2.4)-.055):12.92*e},Ot=({r:e,g:t,b:r,alpha:o},a="rgb")=>{let i={mode:a,r:It(e),g:It(t),b:It(r)};return void 0!==o&&(i.alpha=o),i},Dt=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=Ot({r:3.2409699419045226*e-1.537383177570094*t-.4986107602930034*r,g:-.9692436362808796*e+1.8759675015077204*t+.0415550574071756*r,b:.0556300796969936*e-.2039769588889765*t+1.0569715142428784*r});return void 0!==o&&(a.alpha=o),a},Vt={...kt,mode:"a98",parse:["a98-rgb"],serialize:"a98-rgb",fromMode:{rgb:e=>Nt(Tt(e)),xyz65:Nt},toMode:{rgb:e=>Dt(Ct(e)),xyz65:Ct}},jt=e=>(e%=360)<0?e+360:e,Ht=e=>((e,t)=>e.map(((r,o,a)=>{if(void 0===r)return r;let i=jt(r);return 0===o||void 0===e[o-1]?i:t(i-jt(a[o-1]))})).reduce(((e,t)=>e.length&&void 0!==t&&void 0!==e[e.length-1]?(e.push(t+e[e.length-1]),e):(e.push(t),e)),[]))(e,(e=>Math.abs(e)<=180?e:e-360*Math.sign(e))),Rt=[-.14861,1.78277,-.29227,-.90649,1.97294,0],Lt=Math.PI/180,Ft=180/Math.PI;let qt=Rt[3]*Rt[4],Ut=Rt[1]*Rt[4],Gt=Rt[1]*Rt[2]-Rt[0]*Rt[3];const Jt=(e,t)=>{if(void 0===e.h||void 0===t.h||!e.s||!t.s)return 0;let r=jt(e.h),o=jt(t.h),a=Math.sin((o-r+360)/2*Math.PI/180);return 2*Math.sqrt(e.s*t.s)*a},Bt=(e,t)=>{if(void 0===e.h||void 0===t.h||!e.c||!t.c)return 0;let r=jt(e.h),o=jt(t.h),a=Math.sin((o-r+360)/2*Math.PI/180);return 2*Math.sqrt(e.c*t.c)*a},Wt=e=>{let t=e.reduce(((e,t)=>{if(void 0!==t){let r=t*Math.PI/180;e.sin+=Math.sin(r),e.cos+=Math.cos(r)}return e}),{sin:0,cos:0}),r=180*Math.atan2(t.sin,t.cos)/Math.PI;return r<0?360+r:r},Kt={mode:"cubehelix",channels:["h","s","l","alpha"],parse:["--cubehelix"],serialize:"--cubehelix",ranges:{h:[0,360],s:[0,4.614],l:[0,1]},fromMode:{rgb:({r:e,g:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=(Gt*r+e*qt-t*Ut)/(Gt+qt-Ut),i=r-a,s=(Rt[4]*(t-a)-Rt[2]*i)/Rt[3],n={mode:"cubehelix",l:a,s:0===a||1===a?void 0:Math.sqrt(i*i+s*s)/(Rt[4]*a*(1-a))};return n.s&&(n.h=Math.atan2(s,i)*Ft-120),void 0!==o&&(n.alpha=o),n}},toMode:{rgb:({h:e,s:t,l:r,alpha:o})=>{let a={mode:"rgb"};e=(void 0===e?0:e+120)*Lt,void 0===r&&(r=0);let i=void 0===t?0:t*r*(1-r),s=Math.cos(e),n=Math.sin(e);return a.r=r+i*(Rt[0]*s+Rt[1]*n),a.g=r+i*(Rt[2]*s+Rt[3]*n),a.b=r+i*(Rt[4]*s+Rt[5]*n),void 0!==o&&(a.alpha=o),a}},interpolate:{h:{use:wt,fixup:Ht},s:wt,l:wt,alpha:{use:wt,fixup:St}},difference:{h:Jt},average:{h:Wt}},Yt=({l:e,a:t,b:r,alpha:o},a="lch")=>{void 0===t&&(t=0),void 0===r&&(r=0);let i=Math.sqrt(t*t+r*r),s={mode:a,l:e,c:i};return i&&(s.h=jt(180*Math.atan2(r,t)/Math.PI)),void 0!==o&&(s.alpha=o),s},Xt=({l:e,c:t,h:r,alpha:o},a="lab")=>{void 0===r&&(r=0);let i={mode:a,l:e,a:t?t*Math.cos(r/180*Math.PI):0,b:t?t*Math.sin(r/180*Math.PI):0};return void 0!==o&&(i.alpha=o),i},Zt=Math.pow(29,3)/Math.pow(3,3),Qt=Math.pow(6,3)/Math.pow(29,3),er=.3457/.3585,tr=1,rr=.2958/.3585,or=.3127/.329,ar=1,ir=.3583/.329;let sr=e=>Math.pow(e,3)>Qt?Math.pow(e,3):(116*e-16)/Zt;const nr=({l:e,a:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=(e+16)/116,i=a-r/200,s={mode:"xyz65",x:sr(t/500+a)*or,y:sr(a)*ar,z:sr(i)*ir};return void 0!==o&&(s.alpha=o),s},lr=e=>Dt(nr(e)),cr=e=>e>Qt?Math.cbrt(e):(Zt*e+16)/116,dr=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=cr(e/or),i=cr(t/ar),s={mode:"lab65",l:116*i-16,a:500*(a-i),b:200*(i-cr(r/ir))};return void 0!==o&&(s.alpha=o),s},hr=e=>{let t=dr(Tt(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},ur=26/180*Math.PI,mr=Math.cos(ur),pr=Math.sin(ur),gr=100/Math.log(1.39),fr=({l:e,c:t,h:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a={mode:"lab65",l:(Math.exp(1*e/gr)-1)/.0039},i=(Math.exp(.0435*t*1*1)-1)/.075,s=i*Math.cos(r/180*Math.PI-ur),n=i*Math.sin(r/180*Math.PI-ur);return a.a=s*mr-n/.83*pr,a.b=s*pr+n/.83*mr,void 0!==o&&(a.alpha=o),a},br=({l:e,a:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=t*mr+r*pr,i=.83*(r*mr-t*pr),s=Math.sqrt(a*a+i*i),n={mode:"dlch",l:gr/1*Math.log(1+.0039*e),c:Math.log(1+.075*s)/.0435};return n.c&&(n.h=jt((Math.atan2(i,a)+ur)/Math.PI*180)),void 0!==o&&(n.alpha=o),n},yr=e=>fr(Yt(e,"dlch")),vr=e=>Xt(br(e),"dlab"),_r={mode:"dlab",parse:["--din99o-lab"],serialize:"--din99o-lab",toMode:{lab65:yr,rgb:e=>lr(yr(e))},fromMode:{lab65:vr,rgb:e=>vr(hr(e))},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-40.09,45.501],b:[-40.469,44.344]},interpolate:{l:wt,a:wt,b:wt,alpha:{use:wt,fixup:St}}},xr={mode:"dlch",parse:["--din99o-lch"],serialize:"--din99o-lch",toMode:{lab65:fr,dlab:e=>Xt(e,"dlab"),rgb:e=>lr(fr(e))},fromMode:{lab65:br,dlab:e=>Yt(e,"dlch"),rgb:e=>br(hr(e))},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,51.484],h:[0,360]},interpolate:{l:wt,c:wt,h:{use:wt,fixup:Ht},alpha:{use:wt,fixup:St}},difference:{h:Bt},average:{h:Wt}};const $r={mode:"hsi",toMode:{rgb:function({h:e,s:t,i:r,alpha:o}){e=jt(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let a,i=Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:a={r:r*(1+t*(3/(2-i)-1)),g:r*(1+t*(3*(1-i)/(2-i)-1)),b:r*(1-t)};break;case 1:a={r:r*(1+t*(3*(1-i)/(2-i)-1)),g:r*(1+t*(3/(2-i)-1)),b:r*(1-t)};break;case 2:a={r:r*(1-t),g:r*(1+t*(3/(2-i)-1)),b:r*(1+t*(3*(1-i)/(2-i)-1))};break;case 3:a={r:r*(1-t),g:r*(1+t*(3*(1-i)/(2-i)-1)),b:r*(1+t*(3/(2-i)-1))};break;case 4:a={r:r*(1+t*(3*(1-i)/(2-i)-1)),g:r*(1-t),b:r*(1+t*(3/(2-i)-1))};break;case 5:a={r:r*(1+t*(3/(2-i)-1)),g:r*(1-t),b:r*(1+t*(3*(1-i)/(2-i)-1))};break;default:a={r:r*(1-t),g:r*(1-t),b:r*(1-t)}}return a.mode="rgb",void 0!==o&&(a.alpha=o),a}},parse:["--hsi"],serialize:"--hsi",fromMode:{rgb:function({r:e,g:t,b:r,alpha:o}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=Math.max(e,t,r),i=Math.min(e,t,r),s={mode:"hsi",s:e+t+r===0?0:1-3*i/(e+t+r),i:(e+t+r)/3};return a-i!=0&&(s.h=60*(a===e?(t-r)/(a-i)+6*(t<r):a===t?(r-e)/(a-i)+2:(e-t)/(a-i)+4)),void 0!==o&&(s.alpha=o),s}},channels:["h","s","i","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:wt,fixup:Ht},s:wt,i:wt,alpha:{use:wt,fixup:St}},difference:{h:Jt},average:{h:Wt}};const wr=new RegExp(`^hsla?\\(\\s*${Xe}${Ze}${Ke}${Ze}${Ke}\\s*(?:,\\s*${Ye}\\s*)?\\)$`);const Mr={mode:"hsl",toMode:{rgb:function({h:e,s:t,l:r,alpha:o}){e=jt(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let a,i=r+t*(r<.5?r:1-r),s=i-2*(i-r)*Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:a={r:i,g:s,b:2*r-i};break;case 1:a={r:s,g:i,b:2*r-i};break;case 2:a={r:2*r-i,g:i,b:s};break;case 3:a={r:2*r-i,g:s,b:i};break;case 4:a={r:s,g:2*r-i,b:i};break;case 5:a={r:i,g:2*r-i,b:s};break;default:a={r:2*r-i,g:2*r-i,b:2*r-i}}return a.mode="rgb",void 0!==o&&(a.alpha=o),a}},fromMode:{rgb:function({r:e,g:t,b:r,alpha:o}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=Math.max(e,t,r),i=Math.min(e,t,r),s={mode:"hsl",s:a===i?0:(a-i)/(1-Math.abs(a+i-1)),l:.5*(a+i)};return a-i!=0&&(s.h=60*(a===e?(t-r)/(a-i)+6*(t<r):a===t?(r-e)/(a-i)+2:(e-t)/(a-i)+4)),void 0!==o&&(s.alpha=o),s}},channels:["h","s","l","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(e,t){if(!t||"hsl"!==t[0]&&"hsla"!==t[0])return;const r={mode:"hsl"},[,o,a,i,s]=t;if(o.type!==ht.None){if(o.type===ht.Percentage)return;r.h=o.value}if(a.type!==ht.None){if(a.type===ht.Hue)return;r.s=a.value/100}if(i.type!==ht.None){if(i.type===ht.Hue)return;r.l=i.value/100}return s.type!==ht.None&&(r.alpha=Math.min(1,Math.max(0,s.type===ht.Number?s.value:s.value/100))),r},e=>{let t=e.match(wr);if(!t)return;let r={mode:"hsl"};return void 0!==t[3]?r.h=+t[3]:void 0!==t[1]&&void 0!==t[2]&&(r.h=((e,t)=>{switch(t){case"deg":return+e;case"rad":return e/Math.PI*180;case"grad":return e/10*9;case"turn":return 360*e}})(t[1],t[2])),void 0!==t[4]&&(r.s=Math.min(Math.max(0,t[4]/100),1)),void 0!==t[5]&&(r.l=Math.min(Math.max(0,t[5]/100),1)),void 0!==t[6]?r.alpha=Math.max(0,Math.min(1,t[6]/100)):void 0!==t[7]&&(r.alpha=Math.max(0,Math.min(1,+t[7]))),r}],serialize:e=>`hsl(${void 0!==e.h?e.h:"none"} ${void 0!==e.s?100*e.s+"%":"none"} ${void 0!==e.l?100*e.l+"%":"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:wt,fixup:Ht},s:wt,l:wt,alpha:{use:wt,fixup:St}},difference:{h:Jt},average:{h:Wt}};function Sr({h:e,s:t,v:r,alpha:o}){e=jt(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let a,i=Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:a={r:r,g:r*(1-t*i),b:r*(1-t)};break;case 1:a={r:r*(1-t*i),g:r,b:r*(1-t)};break;case 2:a={r:r*(1-t),g:r,b:r*(1-t*i)};break;case 3:a={r:r*(1-t),g:r*(1-t*i),b:r};break;case 4:a={r:r*(1-t*i),g:r*(1-t),b:r};break;case 5:a={r:r,g:r*(1-t),b:r*(1-t*i)};break;default:a={r:r*(1-t),g:r*(1-t),b:r*(1-t)}}return a.mode="rgb",void 0!==o&&(a.alpha=o),a}function kr({r:e,g:t,b:r,alpha:o}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=Math.max(e,t,r),i=Math.min(e,t,r),s={mode:"hsv",s:0===a?0:1-i/a,v:a};return a-i!=0&&(s.h=60*(a===e?(t-r)/(a-i)+6*(t<r):a===t?(r-e)/(a-i)+2:(e-t)/(a-i)+4)),void 0!==o&&(s.alpha=o),s}const Ar={mode:"hsv",toMode:{rgb:Sr},parse:["--hsv"],serialize:"--hsv",fromMode:{rgb:kr},channels:["h","s","v","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:wt,fixup:Ht},s:wt,v:wt,alpha:{use:wt,fixup:St}},difference:{h:Jt},average:{h:Wt}};const Cr={mode:"hwb",toMode:{rgb:function({h:e,w:t,b:r,alpha:o}){if(void 0===t&&(t=0),void 0===r&&(r=0),t+r>1){let e=t+r;t/=e,r/=e}return Sr({h:e,s:1===r?1:1-t/(1-r),v:1-r,alpha:o})}},fromMode:{rgb:function(e){let t=kr(e);if(void 0===t)return;let r=void 0!==t.s?t.s:0,o=void 0!==t.v?t.v:0,a={mode:"hwb",w:(1-r)*o,b:1-o};return void 0!==t.h&&(a.h=t.h),void 0!==t.alpha&&(a.alpha=t.alpha),a}},channels:["h","w","b","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(e,t){if(!t||"hwb"!==t[0])return;const r={mode:"hwb"},[,o,a,i,s]=t;if(o.type!==ht.None){if(o.type===ht.Percentage)return;r.h=o.value}if(a.type!==ht.None){if(a.type===ht.Hue)return;r.w=a.value/100}if(i.type!==ht.None){if(i.type===ht.Hue)return;r.b=i.value/100}return s.type!==ht.None&&(r.alpha=Math.min(1,Math.max(0,s.type===ht.Number?s.value:s.value/100))),r}],serialize:e=>`hwb(${void 0!==e.h?e.h:"none"} ${void 0!==e.w?100*e.w+"%":"none"} ${void 0!==e.b?100*e.b+"%":"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:wt,fixup:Ht},w:wt,b:wt,alpha:{use:wt,fixup:St}},difference:{h:(e,t)=>{if(void 0===e.h||void 0===t.h)return 0;let r=jt(e.h),o=jt(t.h);return Math.abs(o-r)>180?r-(o-360*Math.sign(o-r)):o-r}},average:{h:Wt}},Er=.1593017578125,Nr=78.84375,zr=.8359375,Pr=18.8515625,Tr=18.6875;function Ir(e){if(e<0)return 0;const t=Math.pow(e,1/Nr);return 1e4*Math.pow(Math.max(0,t-zr)/(Pr-Tr*t),1/Er)}function Or(e){if(e<0)return 0;const t=Math.pow(e/1e4,Er);return Math.pow((zr+Pr*t)/(1+Tr*t),Nr)}const Dr=e=>Math.max(e/203,0),Vr=({i:e,t:t,p:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const a=Ir(e+.008609037037932761*t+.11102962500302593*r),i=Ir(e-.00860903703793275*t-.11102962500302599*r),s=Ir(e+.5600313357106791*t-.32062717498731885*r),n={mode:"xyz65",x:Dr(2.070152218389422*a-1.3263473389671556*i+.2066510476294051*s),y:Dr(.3647385209748074*a+.680566024947227*i-.0453045459220346*s),z:Dr(-.049747207535812*a-.0492609666966138*i+1.1880659249923042*s)};return void 0!==o&&(n.alpha=o),n},jr=(e=0)=>Math.max(203*e,0),Hr=({x:e,y:t,z:r,alpha:o})=>{const a=jr(e),i=jr(t),s=jr(r),n=Or(.3592832590121217*a+.6976051147779502*i-.0358915932320289*s),l=Or(-.1920808463704995*a+1.1004767970374323*i+.0753748658519118*s),c=Or(.0070797844607477*a+.0748396662186366*i+.8433265453898765*s),d={mode:"itp",i:.5*n+.5*l,t:1.61376953125*n-3.323486328125*l+1.709716796875*c,p:4.378173828125*n-4.24560546875*l-.132568359375*c};return void 0!==o&&(d.alpha=o),d},Rr={mode:"itp",channels:["i","t","p","alpha"],parse:["--ictcp"],serialize:"--ictcp",toMode:{xyz65:Vr,rgb:e=>Dt(Vr(e))},fromMode:{xyz65:Hr,rgb:e=>Hr(Tt(e))},ranges:{i:[0,.581],t:[-.369,.272],p:[-.164,.331]},interpolate:{i:wt,t:wt,p:wt,alpha:{use:wt,fixup:St}}},Lr=e=>{if(e<0)return 0;let t=Math.pow(e/1e4,Er);return Math.pow((zr+Pr*t)/(1+Tr*t),134.03437499999998)},Fr=(e=0)=>Math.max(203*e,0),qr=({x:e,y:t,z:r,alpha:o})=>{e=Fr(e),t=Fr(t);let a=1.15*e-.15*(r=Fr(r)),i=.66*t+.34*e,s=Lr(.41478972*a+.579999*i+.014648*r),n=Lr(-.20151*a+1.120649*i+.0531008*r),l=Lr(-.0166008*a+.2648*i+.6684799*r),c=(s+n)/2,d={mode:"jab",j:.44*c/(1-.56*c)-16295499532821565e-27,a:3.524*s-4.066708*n+.542708*l,b:.199076*s+1.096799*n-1.295875*l};return void 0!==o&&(d.alpha=o),d},Ur=16295499532821565e-27,Gr=e=>{if(e<0)return 0;let t=Math.pow(e,.007460772656268216);return 1e4*Math.pow((zr-t)/(Tr*t-Pr),1/Er)},Jr=e=>e/203,Br=({j:e,a:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=(e+Ur)/(.44+.56*(e+Ur)),i=Gr(a+.13860504*t+.058047316*r),s=Gr(a-.13860504*t-.058047316*r),n=Gr(a-.096019242*t-.8118919*r),l={mode:"xyz65",x:Jr(1.661373024652174*i-.914523081304348*s+.23136208173913045*n),y:Jr(-.3250758611844533*i+1.571847026732543*s-.21825383453227928*n),z:Jr(-.090982811*i-.31272829*s+1.5227666*n)};return void 0!==o&&(l.alpha=o),l},Wr=e=>{let t=qr(Tt(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},Kr=e=>Dt(Br(e)),Yr={mode:"jab",channels:["j","a","b","alpha"],parse:["--jzazbz"],serialize:"--jzazbz",fromMode:{rgb:Wr,xyz65:qr},toMode:{rgb:Kr,xyz65:Br},ranges:{j:[0,.222],a:[-.109,.129],b:[-.185,.134]},interpolate:{j:wt,a:wt,b:wt,alpha:{use:wt,fixup:St}}},Xr=({j:e,a:t,b:r,alpha:o})=>{void 0===t&&(t=0),void 0===r&&(r=0);let a=Math.sqrt(t*t+r*r),i={mode:"jch",j:e,c:a};return a&&(i.h=jt(180*Math.atan2(r,t)/Math.PI)),void 0!==o&&(i.alpha=o),i},Zr=({j:e,c:t,h:r,alpha:o})=>{void 0===r&&(r=0);let a={mode:"jab",j:e,a:t?t*Math.cos(r/180*Math.PI):0,b:t?t*Math.sin(r/180*Math.PI):0};return void 0!==o&&(a.alpha=o),a},Qr={mode:"jch",parse:["--jzczhz"],serialize:"--jzczhz",toMode:{jab:Zr,rgb:e=>Kr(Zr(e))},fromMode:{rgb:e=>Xr(Wr(e)),jab:Xr},channels:["j","c","h","alpha"],ranges:{j:[0,.221],c:[0,.19],h:[0,360]},interpolate:{h:{use:wt,fixup:Ht},c:wt,j:wt,alpha:{use:wt,fixup:St}},difference:{h:Bt},average:{h:Wt}},eo=Math.pow(29,3)/Math.pow(3,3),to=Math.pow(6,3)/Math.pow(29,3);let ro=e=>Math.pow(e,3)>to?Math.pow(e,3):(116*e-16)/eo;const oo=({l:e,a:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=(e+16)/116,i=a-r/200,s={mode:"xyz50",x:ro(t/500+a)*er,y:ro(a)*tr,z:ro(i)*rr};return void 0!==o&&(s.alpha=o),s},ao=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=Ot({r:3.1341359569958707*e-1.6173863321612538*t-.4906619460083532*r,g:-.978795502912089*e+1.916254567259524*t+.03344273116131949*r,b:.07195537988411677*e-.2289768264158322*t+1.405386058324125*r});return void 0!==o&&(a.alpha=o),a},io=e=>ao(oo(e)),so=e=>{let{r:t,g:r,b:o,alpha:a}=Pt(e),i={mode:"xyz50",x:.436065742824811*t+.3851514688337912*r+.14307845442264197*o,y:.22249319175623702*t+.7168870538238823*r+.06061979053616537*o,z:.013923904500943465*t+.09708128566574634*r+.7140993584005155*o};return void 0!==a&&(i.alpha=a),i},no=e=>e>to?Math.cbrt(e):(eo*e+16)/116,lo=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=no(e/er),i=no(t/tr),s={mode:"lab",l:116*i-16,a:500*(a-i),b:200*(i-no(r/rr))};return void 0!==o&&(s.alpha=o),s},co=e=>{let t=lo(so(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t};const ho={mode:"lab",toMode:{xyz50:oo,rgb:io},fromMode:{xyz50:lo,rgb:co},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-125,125],b:[-125,125]},parse:[function(e,t){if(!t||"lab"!==t[0])return;const r={mode:"lab"},[,o,a,i,s]=t;return o.type!==ht.Hue&&a.type!==ht.Hue&&i.type!==ht.Hue?(o.type!==ht.None&&(r.l=Math.min(Math.max(0,o.value),100)),a.type!==ht.None&&(r.a=a.type===ht.Number?a.value:125*a.value/100),i.type!==ht.None&&(r.b=i.type===ht.Number?i.value:125*i.value/100),s.type!==ht.None&&(r.alpha=Math.min(1,Math.max(0,s.type===ht.Number?s.value:s.value/100))),r):void 0}],serialize:e=>`lab(${void 0!==e.l?e.l:"none"} ${void 0!==e.a?e.a:"none"} ${void 0!==e.b?e.b:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{l:wt,a:wt,b:wt,alpha:{use:wt,fixup:St}}},uo={...ho,mode:"lab65",parse:["--lab-d65"],serialize:"--lab-d65",toMode:{xyz65:nr,rgb:lr},fromMode:{xyz65:dr,rgb:hr},ranges:{l:[0,100],a:[-125,125],b:[-125,125]}};const mo={mode:"lch",toMode:{lab:Xt,rgb:e=>io(Xt(e))},fromMode:{rgb:e=>Yt(co(e)),lab:Yt},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,150],h:[0,360]},parse:[function(e,t){if(!t||"lch"!==t[0])return;const r={mode:"lch"},[,o,a,i,s]=t;if(o.type!==ht.None){if(o.type===ht.Hue)return;r.l=Math.min(Math.max(0,o.value),100)}if(a.type!==ht.None&&(r.c=Math.max(0,a.type===ht.Number?a.value:150*a.value/100)),i.type!==ht.None){if(i.type===ht.Percentage)return;r.h=i.value}return s.type!==ht.None&&(r.alpha=Math.min(1,Math.max(0,s.type===ht.Number?s.value:s.value/100))),r}],serialize:e=>`lch(${void 0!==e.l?e.l:"none"} ${void 0!==e.c?e.c:"none"} ${void 0!==e.h?e.h:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:wt,fixup:Ht},c:wt,l:wt,alpha:{use:wt,fixup:St}},difference:{h:Bt},average:{h:Wt}},po={...mo,mode:"lch65",parse:["--lch-d65"],serialize:"--lch-d65",toMode:{lab65:e=>Xt(e,"lab65"),rgb:e=>lr(Xt(e,"lab65"))},fromMode:{rgb:e=>Yt(hr(e),"lch65"),lab65:e=>Yt(e,"lch65")},ranges:{l:[0,100],c:[0,150],h:[0,360]}},go=({l:e,u:t,v:r,alpha:o})=>{void 0===t&&(t=0),void 0===r&&(r=0);let a=Math.sqrt(t*t+r*r),i={mode:"lchuv",l:e,c:a};return a&&(i.h=jt(180*Math.atan2(r,t)/Math.PI)),void 0!==o&&(i.alpha=o),i},fo=({l:e,c:t,h:r,alpha:o})=>{void 0===r&&(r=0);let a={mode:"luv",l:e,u:t?t*Math.cos(r/180*Math.PI):0,v:t?t*Math.sin(r/180*Math.PI):0};return void 0!==o&&(a.alpha=o),a},bo=(e,t,r)=>4*e/(e+15*t+3*r),yo=(e,t,r)=>9*t/(e+15*t+3*r),vo=bo(er,tr,rr),_o=yo(er,tr,rr),xo=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=(i=t/tr)<=to?eo*i:116*Math.cbrt(i)-16;var i;let s=bo(e,t,r),n=yo(e,t,r);isFinite(s)&&isFinite(n)?(s=13*a*(s-vo),n=13*a*(n-_o)):a=s=n=0;let l={mode:"luv",l:a,u:s,v:n};return void 0!==o&&(l.alpha=o),l},$o=((e,t,r)=>4*e/(e+15*t+3*r))(er,tr,rr),wo=((e,t,r)=>9*t/(e+15*t+3*r))(er,tr,rr),Mo=({l:e,u:t,v:r,alpha:o})=>{if(void 0===e&&(e=0),0===e)return{mode:"xyz50",x:0,y:0,z:0};void 0===t&&(t=0),void 0===r&&(r=0);let a=t/(13*e)+$o,i=r/(13*e)+wo,s=tr*(e<=8?e/eo:Math.pow((e+16)/116,3)),n={mode:"xyz50",x:s*(9*a)/(4*i),y:s,z:s*(12-3*a-20*i)/(4*i)};return void 0!==o&&(n.alpha=o),n},So={mode:"lchuv",toMode:{luv:fo,rgb:e=>ao(Mo(fo(e)))},fromMode:{rgb:e=>go(xo(so(e))),luv:go},channels:["l","c","h","alpha"],parse:["--lchuv"],serialize:"--lchuv",ranges:{l:[0,100],c:[0,176.956],h:[0,360]},interpolate:{h:{use:wt,fixup:Ht},c:wt,l:wt,alpha:{use:wt,fixup:St}},difference:{h:Bt},average:{h:Wt}},ko={...kt,mode:"lrgb",toMode:{rgb:Ot},fromMode:{rgb:Pt},parse:["srgb-linear"],serialize:"srgb-linear"},Ao={mode:"luv",toMode:{xyz50:Mo,rgb:e=>ao(Mo(e))},fromMode:{xyz50:xo,rgb:e=>xo(so(e))},channels:["l","u","v","alpha"],parse:["--luv"],serialize:"--luv",ranges:{l:[0,100],u:[-84.936,175.042],v:[-125.882,87.243]},interpolate:{l:wt,u:wt,v:wt,alpha:{use:wt,fixup:St}}},Co=({r:e,g:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=Math.cbrt(.412221469470763*e+.5363325372617348*t+.0514459932675022*r),i=Math.cbrt(.2119034958178252*e+.6806995506452344*t+.1073969535369406*r),s=Math.cbrt(.0883024591900564*e+.2817188391361215*t+.6299787016738222*r),n={mode:"oklab",l:.210454268309314*a+.7936177747023054*i-.0040720430116193*s,a:1.9779985324311684*a-2.42859224204858*i+.450593709617411*s,b:.0259040424655478*a+.7827717124575296*i-.8086757549230774*s};return void 0!==o&&(n.alpha=o),n},Eo=e=>{let t=Co(Pt(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},No=({l:e,a:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=Math.pow(e+.3963377773761749*t+.2158037573099136*r,3),i=Math.pow(e-.1055613458156586*t-.0638541728258133*r,3),s=Math.pow(e-.0894841775298119*t-1.2914855480194092*r,3),n={mode:"lrgb",r:4.076741636075957*a-3.3077115392580616*i+.2309699031821044*s,g:-1.2684379732850317*a+2.6097573492876887*i-.3413193760026573*s,b:-.0041960761386756*a-.7034186179359362*i+1.7076146940746117*s};return void 0!==o&&(n.alpha=o),n},zo=e=>Ot(No(e));function Po(e){const t=.206,r=1.206/1.03;return.5*(r*e-t+Math.sqrt((r*e-t)*(r*e-t)+.12*r*e))}function To(e){return(e*e+.206*e)/(1.206/1.03*(e+.03))}function Io(e,t){let r=function(e,t){let r,o,a,i,s,n,l,c;-1.88170328*e-.80936493*t>1?(r=1.19086277,o=1.76576728,a=.59662641,i=.75515197,s=.56771245,n=4.0767416621,l=-3.3077115913,c=.2309699292):1.81444104*e-1.19445276*t>1?(r=.73956515,o=-.45954404,a=.08285427,i=.1254107,s=.14503204,n=-1.2684380046,l=2.6097574011,c=-.3413193965):(r=1.35733652,o=-.00915799,a=-1.1513021,i=-.50559606,s=.00692167,n=-.0041960863,l=-.7034186147,c=1.707614701);let d=r+o*e+a*t+i*e*e+s*e*t,h=.3963377774*e+.2158037573*t,u=-.1055613458*e-.0638541728*t,m=-.0894841775*e-1.291485548*t;{let e=1+d*h,t=1+d*u,r=1+d*m,o=n*(e*e*e)+l*(t*t*t)+c*(r*r*r),a=n*(3*h*e*e)+l*(3*u*t*t)+c*(3*m*r*r);d-=o*a/(a*a-.5*o*(n*(6*h*h*e)+l*(6*u*u*t)+c*(6*m*m*r)))}return d}(e,t),o=No({l:1,a:r*e,b:r*t}),a=Math.cbrt(1/Math.max(o.r,o.g,o.b));return[a,a*r]}function Oo(e,t,r=null){r||(r=Io(e,t));let o=r[0],a=r[1];return[a/o,a/(1-o)]}function Do(e,t,r){let o=Io(t,r),a=function(e,t,r,o,a,i=null){let s;if(i||(i=Io(e,t)),(r-a)*i[1]-(i[0]-a)*o<=0)s=i[1]*a/(o*i[0]+i[1]*(a-r));else{s=i[1]*(a-1)/(o*(i[0]-1)+i[1]*(a-r));{let i=r-a,n=.3963377774*e+.2158037573*t,l=-.1055613458*e-.0638541728*t,c=-.0894841775*e-1.291485548*t,d=i+o*n,h=i+o*l,u=i+o*c;{let e=a*(1-s)+s*r,t=s*o,i=e+t*n,m=e+t*l,p=e+t*c,g=i*i*i,f=m*m*m,b=p*p*p,y=3*d*i*i,v=3*h*m*m,_=3*u*p*p,x=6*d*d*i,$=6*h*h*m,w=6*u*u*p,M=4.0767416621*g-3.3077115913*f+.2309699292*b-1,S=4.0767416621*y-3.3077115913*v+.2309699292*_,k=S/(S*S-.5*M*(4.0767416621*x-3.3077115913*$+.2309699292*w)),A=-M*k,C=-1.2684380046*g+2.6097574011*f-.3413193965*b-1,E=-1.2684380046*y+2.6097574011*v-.3413193965*_,N=E/(E*E-.5*C*(-1.2684380046*x+2.6097574011*$-.3413193965*w)),z=-C*N,P=-.0041960863*g-.7034186147*f+1.707614701*b-1,T=-.0041960863*y-.7034186147*v+1.707614701*_,I=T/(T*T-.5*P*(-.0041960863*x-.7034186147*$+1.707614701*w)),O=-P*I;A=k>=0?A:1e6,z=N>=0?z:1e6,O=I>=0?O:1e6,s+=Math.min(A,Math.min(z,O))}}}return s}(t,r,e,1,e,o),i=Oo(t,r,o),s=e*(.11516993+1/(7.4477897+4.1590124*r+t*(1.75198401*r-2.19557347+t*(-2.13704948-10.02301043*r+t*(5.38770819*r-4.24894561+4.69891013*t))))),n=(1-e)*(.11239642+1/(1.6132032-.68124379*r+t*(.40370612+.90148123*r+t*(.6122399*r-.27087943+t*(.00299215-.45399568*r-.14661872*t))))),l=.9*(a/Math.min(e*i[0],(1-e)*i[1]))*Math.sqrt(Math.sqrt(1/(1/(s*s*s*s)+1/(n*n*n*n))));return s=.4*e,n=.8*(1-e),[Math.sqrt(1/(1/(s*s)+1/(n*n))),l,a]}function Vo(e){const t=void 0!==e.l?e.l:0,r=void 0!==e.a?e.a:0,o=void 0!==e.b?e.b:0,a={mode:"okhsl",l:Po(t)};void 0!==e.alpha&&(a.alpha=e.alpha);let i=Math.sqrt(r*r+o*o);if(!i)return a.s=0,a;let s,[n,l,c]=Do(t,r/i,o/i);if(i<l){let e=0,t=.8*n;s=.8*((i-e)/(t+(1-t/l)*(i-e)))}else{let e=.2*l*l*1.25*1.25/n;s=.8+.2*((i-l)/(e+(1-e/(c-l))*(i-l)))}return s&&(a.s=s,a.h=jt(180*Math.atan2(o,r)/Math.PI)),a}function jo(e){let t=void 0!==e.h?e.h:0,r=void 0!==e.s?e.s:0,o=void 0!==e.l?e.l:0;const a={mode:"oklab",l:To(o)};if(void 0!==e.alpha&&(a.alpha=e.alpha),!r||1===o)return a.a=a.b=0,a;let i,s,n,l,c=Math.cos(t/180*Math.PI),d=Math.sin(t/180*Math.PI),[h,u,m]=Do(a.l,c,d);r<.8?(i=1.25*r,s=0,n=.8*h,l=1-n/u):(i=5*(r-.8),s=u,n=.2*u*u*1.25*1.25/h,l=1-n/(m-u));let p=s+i*n/(1-l*i);return a.a=p*c,a.b=p*d,a}const Ho={...Mr,mode:"okhsl",channels:["h","s","l","alpha"],parse:["--okhsl"],serialize:"--okhsl",fromMode:{oklab:Vo,rgb:e=>Vo(Eo(e))},toMode:{oklab:jo,rgb:e=>zo(jo(e))}};function Ro(e){let t=void 0!==e.l?e.l:0,r=void 0!==e.a?e.a:0,o=void 0!==e.b?e.b:0,a=Math.sqrt(r*r+o*o),i=a?r/a:1,s=a?o/a:1,[n,l]=Oo(i,s),c=1-.5/n,d=l/(a+t*l),h=d*t,u=d*a,m=To(h),p=u*m/h,g=No({l:m,a:i*p,b:s*p}),f=Math.cbrt(1/Math.max(g.r,g.g,g.b,0));t/=f,a=a/f*Po(t)/t,t=Po(t);const b={mode:"okhsv",s:a?(.5+l)*u/(.5*l+l*c*u):0,v:t?t/h:0};return b.s&&(b.h=jt(180*Math.atan2(o,r)/Math.PI)),void 0!==e.alpha&&(b.alpha=e.alpha),b}function Lo(e){const t={mode:"oklab"};void 0!==e.alpha&&(t.alpha=e.alpha);const r=void 0!==e.h?e.h:0,o=void 0!==e.s?e.s:0,a=void 0!==e.v?e.v:0,i=Math.cos(r/180*Math.PI),s=Math.sin(r/180*Math.PI),[n,l]=Oo(i,s),c=.5,d=1-c/n,h=1-o*c/(c+l-l*d*o),u=o*l*c/(c+l-l*d*o),m=To(h),p=u*m/h,g=No({l:m,a:i*p,b:s*p}),f=Math.cbrt(1/Math.max(g.r,g.g,g.b,0)),b=To(a*h),y=u*b/h;return t.l=b*f,t.a=y*i*f,t.b=y*s*f,t}const Fo={...Ar,mode:"okhsv",channels:["h","s","v","alpha"],parse:["--okhsv"],serialize:"--okhsv",fromMode:{oklab:Ro,rgb:e=>Ro(Eo(e))},toMode:{oklab:Lo,rgb:e=>zo(Lo(e))}};const qo={...ho,mode:"oklab",toMode:{lrgb:No,rgb:zo},fromMode:{lrgb:Co,rgb:Eo},ranges:{l:[0,1],a:[-.4,.4],b:[-.4,.4]},parse:[function(e,t){if(!t||"oklab"!==t[0])return;const r={mode:"oklab"},[,o,a,i,s]=t;return o.type!==ht.Hue&&a.type!==ht.Hue&&i.type!==ht.Hue?(o.type!==ht.None&&(r.l=Math.min(Math.max(0,o.type===ht.Number?o.value:o.value/100),1)),a.type!==ht.None&&(r.a=a.type===ht.Number?a.value:.4*a.value/100),i.type!==ht.None&&(r.b=i.type===ht.Number?i.value:.4*i.value/100),s.type!==ht.None&&(r.alpha=Math.min(1,Math.max(0,s.type===ht.Number?s.value:s.value/100))),r):void 0}],serialize:e=>`oklab(${void 0!==e.l?e.l:"none"} ${void 0!==e.a?e.a:"none"} ${void 0!==e.b?e.b:"none"}${e.alpha<1?` / ${e.alpha}`:""})`};const Uo={...mo,mode:"oklch",toMode:{oklab:e=>Xt(e,"oklab"),rgb:e=>zo(Xt(e,"oklab"))},fromMode:{rgb:e=>Yt(Eo(e),"oklch"),oklab:e=>Yt(e,"oklch")},parse:[function(e,t){if(!t||"oklch"!==t[0])return;const r={mode:"oklch"},[,o,a,i,s]=t;if(o.type!==ht.None){if(o.type===ht.Hue)return;r.l=Math.min(Math.max(0,o.type===ht.Number?o.value:o.value/100),1)}if(a.type!==ht.None&&(r.c=Math.max(0,a.type===ht.Number?a.value:.4*a.value/100)),i.type!==ht.None){if(i.type===ht.Percentage)return;r.h=i.value}return s.type!==ht.None&&(r.alpha=Math.min(1,Math.max(0,s.type===ht.Number?s.value:s.value/100))),r}],serialize:e=>`oklch(${void 0!==e.l?e.l:"none"} ${void 0!==e.c?e.c:"none"} ${void 0!==e.h?e.h:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,ranges:{l:[0,1],c:[0,.4],h:[0,360]}},Go=e=>{let{r:t,g:r,b:o,alpha:a}=Pt(e),i={mode:"xyz65",x:.486570948648216*t+.265667693169093*r+.1982172852343625*o,y:.2289745640697487*t+.6917385218365062*r+.079286914093745*o,z:0*t+.0451133818589026*r+1.043944368900976*o};return void 0!==a&&(i.alpha=a),i},Jo=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=Ot({r:2.4934969119414263*e-.9313836179191242*t-.402710784450717*r,g:-.8294889695615749*e+1.7626640603183465*t+.0236246858419436*r,b:.0358458302437845*e-.0761723892680418*t+.9568845240076871*r},"p3");return void 0!==o&&(a.alpha=o),a},Bo={...kt,mode:"p3",parse:["display-p3"],serialize:"display-p3",fromMode:{rgb:e=>Jo(Tt(e)),xyz65:Jo},toMode:{rgb:e=>Dt(Go(e)),xyz65:Go}},Wo=e=>{let t=Math.abs(e);return t>=1/512?Math.sign(e)*Math.pow(t,1/1.8):16*e},Ko=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a={mode:"prophoto",r:Wo(1.3457868816471585*e-.2555720873797946*t-.0511018649755453*r),g:Wo(-.5446307051249019*e+1.5082477428451466*t+.0205274474364214*r),b:Wo(0*e+0*t+1.2119675456389452*r)};return void 0!==o&&(a.alpha=o),a},Yo=(e=0)=>{let t=Math.abs(e);return t>=16/512?Math.sign(e)*Math.pow(t,1.8):e/16},Xo=e=>{let t=Yo(e.r),r=Yo(e.g),o=Yo(e.b),a={mode:"xyz50",x:.7977666449006423*t+.1351812974005331*r+.0313477341283922*o,y:.2880748288194013*t+.7118352342418731*r+899369387256e-16*o,z:0*t+0*r+.8251046025104602*o};return void 0!==e.alpha&&(a.alpha=e.alpha),a},Zo={...kt,mode:"prophoto",parse:["prophoto-rgb"],serialize:"prophoto-rgb",fromMode:{xyz50:Ko,rgb:e=>Ko(so(e))},toMode:{xyz50:Xo,rgb:e=>ao(Xo(e))}},Qo=1.09929682680944,ea=e=>{const t=Math.abs(e);return t>.018053968510807?(Math.sign(e)||1)*(Qo*Math.pow(t,.45)-(Qo-1)):4.5*e},ta=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a={mode:"rec2020",r:ea(1.7166511879712683*e-.3556707837763925*t-.2533662813736599*r),g:ea(-.6666843518324893*e+1.6164812366349395*t+.0157685458139111*r),b:ea(.0176398574453108*e-.0427706132578085*t+.9421031212354739*r)};return void 0!==o&&(a.alpha=o),a},ra=1.09929682680944,oa=(e=0)=>{let t=Math.abs(e);return t<.08124285829863151?e/4.5:(Math.sign(e)||1)*Math.pow((t+ra-1)/ra,1/.45)},aa=e=>{let t=oa(e.r),r=oa(e.g),o=oa(e.b),a={mode:"xyz65",x:.6369580483012911*t+.1446169035862083*r+.1688809751641721*o,y:.262700212011267*t+.6779980715188708*r+.059301716469862*o,z:0*t+.0280726930490874*r+1.0609850577107909*o};return void 0!==e.alpha&&(a.alpha=e.alpha),a},ia={...kt,mode:"rec2020",fromMode:{xyz65:ta,rgb:e=>ta(Tt(e))},toMode:{xyz65:aa,rgb:e=>Dt(aa(e))},parse:["rec2020"],serialize:"rec2020"},sa=.0037930732552754493,na=Math.cbrt(sa),la=e=>Math.cbrt(e)-na,ca=e=>Math.pow(e+na,3),da={mode:"xyb",channels:["x","y","b","alpha"],parse:["--xyb"],serialize:"--xyb",toMode:{rgb:({x:e,y:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const a=ca(e+t)-sa,i=ca(t-e)-sa,s=ca(r+t)-sa,n=Ot({r:11.031566904639861*a-9.866943908131562*i-.16462299650829934*s,g:-3.2541473810744237*a+4.418770377582723*i-.16462299650829934*s,b:-3.6588512867136815*a+2.7129230459360922*i+1.9459282407775895*s});return void 0!==o&&(n.alpha=o),n}},fromMode:{rgb:e=>{const{r:t,g:r,b:o,alpha:a}=Pt(e),i=la(.3*t+.622*r+.078*o+sa),s=la(.23*t+.692*r+.078*o+sa),n={mode:"xyb",x:(i-s)/2,y:(i+s)/2,b:la(.2434226892454782*t+.2047674442449682*r+.5518098665095535*o+sa)-(i+s)/2};return void 0!==a&&(n.alpha=a),n}},ranges:{x:[-.0154,.0281],y:[0,.8453],b:[-.2778,.388]},interpolate:{x:wt,y:wt,b:wt,alpha:{use:wt,fixup:St}}},ha={mode:"xyz50",parse:["xyz-d50"],serialize:"xyz-d50",toMode:{rgb:ao,lab:lo},fromMode:{rgb:so,lab:oo},channels:["x","y","z","alpha"],ranges:{x:[0,.964],y:[0,.999],z:[0,.825]},interpolate:{x:wt,y:wt,z:wt,alpha:{use:wt,fixup:St}}},ua={mode:"xyz65",toMode:{rgb:Dt,xyz50:e=>{let{x:t,y:r,z:o,alpha:a}=e;void 0===t&&(t=0),void 0===r&&(r=0),void 0===o&&(o=0);let i={mode:"xyz50",x:1.0479298208405488*t+.0229467933410191*r-.0501922295431356*o,y:.0296278156881593*t+.990434484573249*r-.0170738250293851*o,z:-.0092430581525912*t+.0150551448965779*r+.7518742899580008*o};return void 0!==a&&(i.alpha=a),i}},fromMode:{rgb:Tt,xyz50:e=>{let{x:t,y:r,z:o,alpha:a}=e;void 0===t&&(t=0),void 0===r&&(r=0),void 0===o&&(o=0);let i={mode:"xyz65",x:.9554734527042182*t-.0230985368742614*r+.0632593086610217*o,y:-.0283697069632081*t+1.0099954580058226*r+.021041398966943*o,z:.0123140016883199*t-.0205076964334779*r+1.3303659366080753*o};return void 0!==a&&(i.alpha=a),i}},ranges:{x:[0,.95],y:[0,1],z:[0,1.088]},channels:["x","y","z","alpha"],parse:["xyz","xyz-d65"],serialize:"xyz-d65",interpolate:{x:wt,y:wt,z:wt,alpha:{use:wt,fixup:St}}},ma={mode:"yiq",toMode:{rgb:({y:e,i:t,q:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const a={mode:"rgb",r:e+.95608445*t+.6208885*r,g:e-.27137664*t-.6486059*r,b:e-1.10561724*t+1.70250126*r};return void 0!==o&&(a.alpha=o),a}},fromMode:{rgb:({r:e,g:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const a={mode:"yiq",y:.29889531*e+.58662247*t+.11448223*r,i:.59597799*e-.2741761*t-.32180189*r,q:.21147017*e-.52261711*t+.31114694*r};return void 0!==o&&(a.alpha=o),a}},channels:["y","i","q","alpha"],parse:["--yiq"],serialize:"--yiq",ranges:{i:[-.595,.595],q:[-.522,.522]},interpolate:{y:wt,i:wt,q:wt,alpha:{use:wt,fixup:St}}};nt(Vt),nt(Kt),nt(_r),nt(xr),nt($r),nt(Mr),nt(Ar),nt(Cr),nt(Rr),nt(Yr),nt(Qr),nt(ho),nt(uo),nt(mo),nt(po),nt(So),nt(ko),nt(Ao),nt(Ho),nt(Fo),nt(qo),nt(Uo),nt(Bo),nt(Zo),nt(ia),nt(kt),nt(da),nt(ha),nt(ua),nt(ma);const pa=e=>{const t=Math.round(Math.min(Math.max(e,0),255)).toString(16);return 1===t.length?`0${t}`:t},ga=e=>`#${pa(e[0])}${pa(e[1])}${pa(e[2])}`,fa=e=>{const[t,r,o]=e,a=Math.max(t,r,o),i=a-Math.min(t,r,o),s=i&&(a===t?(r-o)/i:a===r?2+(o-t)/i:4+(t-r)/i);return[60*(s<0?s+6:s),a&&i/a,a]},ba=e=>{const[t,r,o]=e,a=e=>{const a=(e+t/60)%6;return o-o*r*Math.max(Math.min(a,4-a,1),0)};return[a(5),a(3),a(1)]},ya=e=>ba([e[0],e[1],255]),va=(e,t,r)=>Math.min(Math.max(e,t),r),_a=e=>{const t=e/100;return[Math.round(xa(t)),Math.round($a(t)),Math.round(wa(t))]},xa=e=>{if(e<=66)return 255;return va(329.698727446*(e-60)**-.1332047592,0,255)},$a=e=>{let t;return t=e<=66?99.4708025861*Math.log(e)-161.1195681661:288.1221695283*(e-60)**-.0755148492,va(t,0,255)},wa=e=>{if(e>=66)return 255;if(e<=19)return 0;const t=138.5177312231*Math.log(e-10)-305.0447927307;return va(t,0,255)},Ma=(e,t)=>{const r=Math.max(...e),o=Math.max(...t);let a;return a=0===o?0:r/o,t.map((e=>Math.round(e*a)))},Sa=e=>0===e?1e6:Math.floor(1e6/e),ka=(e,t,r)=>{const[o,a,i,s,n]=e,l=Sa(t??2700),c=Sa(r??6500),d=l-c;let h;try{h=n/(s+n)}catch(v){h=.5}const u=c+h*d,m=u?0===(p=u)?1e6:Math.floor(1e6/p):0;var p;const[g,f,b]=_a(m),y=Math.max(s,n)/255;return Ma([o,a,i,s,n],[o+g*y,a+f*y,i+b*y])};const Aa=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater","weather"]),Ca=(e,t)=>{if((void 0!==t?t:e?.state)===Te)return"var(--state-unavailable-color)";const r=za(e,t);return r?(o=r,Array.isArray(o)?o.reverse().reduce(((e,t)=>`var(${t}${e?`, ${e}`:""})`),void 0):`var(${o})`):void 0;var o},Ea=(e,t,r)=>{const o=void 0!==r?r:t.state,a=function(e,t){const r=_e(e.entity_id),o=void 0!==t?t:e?.state;if(["button","event","infrared","input_button","radio_frequency","scene"].includes(r))return o!==Te;if(Ie(o))return!1;if("off"===o&&"alert"!==r)return!1;switch(r){case"alarm_control_panel":return"disarmed"!==o;case"alert":return"idle"!==o;case"cover":case"valve":return"closed"!==o;case"device_tracker":case"person":return"not_home"!==o;case"lawn_mower":return!["docked","paused"].includes(o);case"lock":return"locked"!==o;case"media_player":return"standby"!==o;case"vacuum":return!["idle","docked","paused"].includes(o);case"plant":return"problem"===o;case"group":return["on","home","open","locked","problem"].includes(o);case"timer":return"active"===o;case"camera":return"streaming"===o}return!0}(t,r);return Na(e,t.attributes.device_class,o,a)},Na=(e,t,r,o)=>{const a=[],i=((e,t="_")=>{const r="àáâäæãåāăąабçćčđďдèéêëēėęěеёэфğǵгḧхîïíīįìıİийкłлḿмñńǹňнôöòóœøōõőоṕпŕřрßśšşșсťțтûüùúūǘůűųувẃẍÿýыžźżз·",o=`aaaaaaaaaaabcccdddeeeeeeeeeeefggghhiiiiiiiiijkllmmnnnnnoooooooooopprrrsssssstttuuuuuuuuuuvwxyyyzzzz${t}`,a=new RegExp(r.split("").join("|"),"g"),i={"ж":"zh","х":"kh","ц":"ts","ч":"ch","ш":"sh","щ":"shch","ю":"iu","я":"ia"};let s;return""===e?s="":(s=e.toString().toLowerCase().replace(a,(e=>o.charAt(r.indexOf(e)))).replace(/[а-я]/g,(e=>i[e]||"")).replace(/(\d),(?=\d)/g,"$1").replace(/[^a-z0-9]+/g,t).replace(new RegExp(`(${t})\\1+`,"g"),"$1").replace(new RegExp(`^${t}+`),"").replace(new RegExp(`${t}+$`),""),""===s&&(s="unknown")),s})(r,"_"),s=o?"active":"inactive";return t&&a.push(`--state-${e}-${t}-${i}-color`),a.push(`--state-${e}-${i}-color`,`--state-${e}-${s}-color`,`--state-${s}-color`),a},za=(e,t)=>{const r=void 0!==t?t:e?.state,o=_e(e.entity_id),a=e.attributes.device_class;if("sensor"===o&&"battery"===a){const e=(e=>{const t=Number(e);if(!isNaN(t))return t>=70?"--state-sensor-battery-high-color":t>=30?"--state-sensor-battery-medium-color":"--state-sensor-battery-low-color"})(r);if(e)return[e]}if("group"===o){const r=(e=>{const t=e.attributes.entity_id||[],r=[...new Set(t.map((e=>_e(e))))];return 1===r.length?r[0]:void 0})(e);if(r&&Aa.has(r))return Ea(r,e,t)}if(Aa.has(o))return Ea(o,e,t)};var Pa;!function(e){e[e.TARGET_TEMPERATURE=1]="TARGET_TEMPERATURE",e[e.TARGET_TEMPERATURE_RANGE=2]="TARGET_TEMPERATURE_RANGE",e[e.TARGET_HUMIDITY=4]="TARGET_HUMIDITY",e[e.FAN_MODE=8]="FAN_MODE",e[e.PRESET_MODE=16]="PRESET_MODE",e[e.SWING_MODE=32]="SWING_MODE",e[e.AUX_HEAT=64]="AUX_HEAT",e[e.TURN_OFF=128]="TURN_OFF",e[e.TURN_ON=256]="TURN_ON",e[e.SWING_HORIZONTAL_MODE=512]="SWING_HORIZONTAL_MODE"}(Pa||(Pa={})),["auto","heat_cool","heat","cool","dry","fan_only","off"].reduce(((e,t,r)=>(e[t]=r,e)),{});const Ta={cooling:"cool",defrosting:"heat",drying:"dry",fan:"fan_only",heating:"heat",idle:"off",off:"off",preheating:"heat"};class Ia{static{Ia.colorCache={},Ia.element=void 0}static _prefixKeys(e){let t={};return Object.keys(e).forEach((r=>{const o=`--${r}`,a=String(e[r]);t[o]=`${a}`})),t}static processTheme(e){let t={},r={},o={},a={};const{modes:i,...s}=e;return i&&(r={...s,...i.dark},t={...s,...i.light}),o=Ia._prefixKeys(t),a=Ia._prefixKeys(r),{themeLight:o,themeDark:a}}static processPalette(e){let t={},r={},o={},a={},i={};return Object.values(e).forEach((e=>{const{modes:a,...i}=e;t={...t,...i},a&&(o={...o,...i,...a.dark},r={...r,...i,...a.light})})),a=Ia._prefixKeys(r),i=Ia._prefixKeys(o),{paletteLight:a,paletteDark:i}}static setElement(e){Ia.element=e}static calculateColor(e,t,r){const o=Object.keys(t).map((e=>Number(e))).sort(((e,t)=>e-t));let a,i,s;const n=o.length;if(e<=o[0])return t[o[0]];if(e>=o[n-1])return t[o[n-1]];for(let l=0;l<n-1;l++){const n=o[l],c=o[l+1];if(e>=n&&e<c){if([a,i]=[t[n],t[c]],!r)return a;s=Ia.calculateValueBetween(n,c,e);break}}return Ia.getGradientValue(a,i,s)}static calculateColor2(e,t,r,o,a){const i=Object.keys(t).map((e=>Number(e))).sort(((e,t)=>e-t));let s,n,l;const c=i.length;if(e<=i[0])return t[i[0]];if(e>=i[c-1])return t[i[c-1]];for(let d=0;d<c-1;d++){const c=i[d],h=i[d+1];if(e>=c&&e<h){if([s,n]=[t[c].styles[r][o],t[h].styles[r][o]],!a)return s;l=Ia.calculateValueBetween(c,h,e);break}}return Ia.getGradientValue(s,n,l)}static calculateValueBetween(e,t,r){return(Math.min(Math.max(r,e),t)-e)/(t-e)}static getLovelacePanel(){var e=window.document.querySelector("home-assistant");return(e=(e=(e=(e=(e=(e=e&&e.shadowRoot)&&e.querySelector("home-assistant-main"))&&e.shadowRoot)&&e.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"))&&e.shadowRoot||e)&&e.querySelector("ha-panel-lovelace"))||null}static getColorVariable(e){const t=e.substr(4,e.length-5);this.lovelace||(this.lovelace=Ia.getLovelacePanel());return window.getComputedStyle(this.lovelace).getPropertyValue(t)}static getColorVariableV1(e){const t=e.substr(4,e.length-5);return window.getComputedStyle(Ia.element).getPropertyValue(t)}static getGradientValue(e,t,r){const o=Ia.colorToRGBA(e),a=Ia.colorToRGBA(t),i=1-r,s=r,n=Math.floor(o[0]*i+a[0]*s),l=Math.floor(o[1]*i+a[1]*s),c=Math.floor(o[2]*i+a[2]*s),d=Math.floor(o[3]*i+a[3]*s);return`#${Ia.padZero(n.toString(16))}${Ia.padZero(l.toString(16))}${Ia.padZero(c.toString(16))}${Ia.padZero(d.toString(16))}`}static padZero(e){return e.length<2&&(e=`0${e}`),e.substr(0,2)}static colorToRGBA(e){if(null==e)return[0,0,0,0];const t=Ia.colorCache[e];if(t)return t;let r=e;"var"===e.substr(0,3).valueOf()&&(r=Ia.getColorVariable(e));const o=window.document.createElement("canvas");o.width=o.height=1;const a=o.getContext("2d");a.clearRect(0,0,1,1),a.fillStyle=r,a.fillRect(0,0,1,1);const i=[...a.getImageData(0,0,1,1).data];return Ia.colorCache[e]=i,i}static hslToRgb(e){const t=e.h/360,r=e.s/100,o=e.l/100;let a,i,s;if(0===r)a=i=s=o;else{function n(e,t,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?e+6*(t-e)*r:r<.5?t:r<2/3?e+(t-e)*(2/3-r)*6:e}const l=o<.5?o*(1+r):o+r-o*r,c=2*o-l;a=n(c,l,t+1/3),i=n(c,l,t),s=n(c,l,t-1/3)}return a*=255,i*=255,s*=255,{r:a,g:i,b:s}}static computeColor(e){if(e.attributes?.hvac_action){const t=e.attributes.hvac_action;return t in Ta?Ca(e,Ta[t]):void 0}if(e.attributes?.rgb_color)return`rgb(${e.attributes.rgb_color.join(",")})`;const t=Ca(e);return t||void 0}static getHaEntityIconStyle(e){const t=Ia.computeColor(e),r=(e=>{if(e.attributes.brightness&&"plant"!==_e(e.entity_id))return`brightness(${(e.attributes.brightness+245)/5}%)`;return""})(e);return{color:t??"var(--state-icon-color)",fill:"currentColor",...r?{filter:r}:{}}}}const Oa=200,Da=100,Va=Oa;class ja{static calculateValueBetween(e,t,r){return isNaN(r)?0:r?(Math.min(Math.max(r,e),t)-e)/(t-e):0}static calculateSvgCoordinate(e,t){return e/100*Oa+(t-Da)}static calculateSvgDimension(e){return e/100*Oa}static getLovelace(){let e=window.document.querySelector("home-assistant");if(e=e&&e.shadowRoot,e=e&&e.querySelector("home-assistant-main"),e=e&&e.shadowRoot,e=e&&e.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"),e=e&&e.shadowRoot||e,e=e&&e.querySelector("ha-panel-lovelace"),e=e&&e.shadowRoot,e=e&&e.querySelector("hui-root"),e){console.log("getLoveLace, root",e,e.lovelace);const t=e.lovelace;return t.current_view=e.___curView,t}return null}}class Ha{static mergeDeep(...e){const t=e=>e&&"object"==typeof e;return e.reduce(((e,r)=>(Object.keys(r).forEach((o=>{const a=e[o],i=r[o];Array.isArray(a)&&Array.isArray(i)?e[o]=a.concat(...i):t(a)&&t(i)?e[o]=this.mergeDeep(a,i):e[o]=i})),e)),{})}}const Ra={apparent_temperature:"mdi:thermometer",cloud_coverage:"mdi:weather-cloudy",dew_point:"mdi:thermometer-water",humidity:"mdi:water-percent",pressure:"mdi:gauge",temperature:"mdi:thermometer",uv_index:"mdi:sun-wireless",visibility:"mdi:weather-fog",wind_bearing:"mdi:weather-windy",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",precipitation_probability:"mdi:weather-pouring",condition_clear_night:"mdi:weather-night",condition_cloudy:"mdi:weather-cloudy",condition_fog:"mdi:weather-fog",condition_hail:"mdi:weather-hail",condition_lightning:"mdi:weather-lightning",condition_lightning_rainy:"mdi:weather-lightning-rainy",condition_partlycloudy:"mdi:weather-partly-cloudy",condition_pouring:"mdi:weather-pouring",condition_rainy:"mdi:weather-rainy",condition_snowy:"mdi:weather-snowy",condition_snowy_rainy:"mdi:weather-snowy-rainy",condition_sunny:"mdi:weather-sunny",condition_windy:"mdi:weather-windy",condition_windy_variant:"mdi:weather-windy-variant",condition_exceptional:"mdi:alert-circle-outline"},La={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed"},Fa={xpos:50,ypos:50},qa={min:0,max:100,width:6,color:"var(--primary-background-color)"},Ua={width:12,color:"var(--primary-color)"};class Ga{static setConfig(e,t){return Ga.getConfig(e).map(((e,r)=>{try{return Ga.normalizeConfig(e,r,t)}catch(o){throw console.error("[HorseshoesLayout normalize error]",{index:r,horseshoeConfig:e,error:o,message:o?.message,stack:o?.stack}),o}}))}static getConfig(e){const t=Ga.getLegacyConfig(e);return[...t?[t]:[],...Array.isArray(e.layout?.horseshoes)?e.layout.horseshoes:[]].map((e=>Ha.mergeDeep({},{show:La,horseshoe_scale:qa,horseshoe_state:Ua,entity_index:0},e))).filter((e=>!1!==e.show?.horseshoe))}static getLegacyConfig(e){const t={};return["show","horseshoe_scale","horseshoe_state","color_stops","styles"].forEach((r=>{void 0!==e[r]&&(t[r]=e[r])})),Object.keys(t).length>0?t:void 0}static normalize(e){return e?fe.isPlainObject(e)&&Array.isArray(e.colors)?{...e,colors:e.colors.map((e=>fe.normalizeColorEntry(e))).filter(Boolean).sort(((e,t)=>e.value-t.value))}:fe.isPlainObject(e)?{colors:Object.entries(e).map((([e,t])=>fe.normalizeColorPair(e,t))).filter(Boolean).sort(((e,t)=>e.value-t.value))}:Array.isArray(e)?{colors:e.flatMap((e=>fe.normalizeColorArrayEntry(e))).filter(Boolean).sort(((e,t)=>e.value-t.value))}:{colors:[]}:{colors:[]}}static normalizeConfig(e,t,r){const o=e.entity_index??0,a=e.show,i=e.horseshoe_scale,s=e.horseshoe_state,n=e.xpos??e.horseshoe_position?.xpos??e.horseshoe_position?.cx??Fa.xpos??Fa.cx??50,l=e.ypos??e.horseshoe_position?.ypos??e.horseshoe_position?.cy??Fa.ypos??Fa.cy??50;if(null==i.min||null==i.max)throw Error(`No horseshoe min/max for scale defined for horseshoe ${t}`);const c=e.color_stops;let d,h,u,m;if(null!=c){const e=r.getJsTemplateOrValue({entity_index:o},c,{resolveKeys:!0});d=fe.ensureMinimumStops(fe.normalize(e),i.max);const t=d.colors;if(Array.isArray(t)&&t.length>=2){const e=t[0],r=t[t.length-1];null!=e?.color&&null!=r?.color&&(null==s.color&&(s.color=e.color),h=fe.normalize({[i.min]:e.color,[i.max]:r.color}),u=e.color,m=r.color)}}const p=e.radius??45,g=e.tickmarks_radius??43,f=e.arc_degrees??260,b=p/100*Va,y=g/100*Va,v=2*f/360*Math.PI*b,_=2*Math.PI*b;return{...e,entity_index:o,show:a,fill:e.fill??"rgba(0, 0, 0, 0)",xpos:n,ypos:l,bar_mode:e.bar_mode??"normal",horseshoe_scale:i,horseshoe_state:s,radius:p,tickmarks_radius:g,arc_degrees:f,radiusSize:b,tickmarksRadiusSize:y,horseshoePathLength:v,circlePathLength:_,color_stops:c,colorStops:d,colorStopsMinMax:h,color0:u,color1:m,angleCoords:{x1:"0%",y1:"0%",x2:"100%",y2:"0%"},color1_offset:"0%"}}}class Ja{static renderColorStopLabel(e){const t=String(e.label);return t.length>0?Ja.renderColorStopTextPathLabel({...e,label:t}):Ja.renderColorStopRotatedLabel({...e,label:t})}static renderColorStopLabelV1(e){const t=String(e.label);return t.length>3?Ja.renderColorStopTextPathLabel({...e,label:t}):Ja.renderColorStopRotatedLabel({...e,label:t})}static renderColorStopTextPathLabel({horseshoeIndex:e,index:t,label:r,angle:o,cx:a,cy:i,radius:s,cardId:n,isMin:l=!1,isMax:c=!1}){const d=String(r);let h=o-12,u=o+12;l&&(h=o,u=o+24),c&&(h=o-24,u=o);const m=o>-90&&o<90,p=m?h:u,g=m?u:h,f=m?1:0;let b="50%",y="middle";l&&(b=m?"0%":"100%",y=m?"start":"end"),c&&(b=m?"100%":"0%",y=m?"end":"start");const v=Ja.polarToCartesian(a,i,s,p),_=Ja.polarToCartesian(a,i,s,g),x=`${n}-colorstop-label-${e}-${t}`;return q`
    <path
      id="${x}"
      d="M ${v.x} ${v.y} A ${s} ${s} 0 0 ${f} ${_.x} ${_.y}"
      fill="none"
      stroke="none"
    />

    <text
    <text
      class="horseshoe-colorstop-label"
      style="fill:var(--primary-text-color)"
      dy="0.30em"
    >
      <textPath
        href="#${x}"
        startOffset="${b}"
        text-anchor="${y}"
      >
        ${d}
      </textPath>
    </text>
  `}static renderColorStopTextPathLabelV4({index:e,label:t,angle:r,cx:o,cy:a,radius:i,cardId:s,isMin:n,isMax:l}){const c=String(t);let d=r-12,h=r+12;n&&(d=r,h=r+24),l&&(d=r-24,h=r);const u=r>-90&&r<90,m=u?d:h,p=u?h:d,g=u?1:0;let f="50%",b="middle";n&&(f=u?"0%":"100%",b=u?"start":"end"),l&&(f=u?"100%":"0%",b=u?"end":"start");const y=Ja.polarToCartesian(o,a,i,m),v=Ja.polarToCartesian(o,a,i,p),_=`${s}-colorstop-label-${e}`;return q`
    <path
      id="${_}"
      d="M ${y.x} ${y.y} A ${i} ${i} 0 0 ${g} ${v.x} ${v.y}"
      fill="none"
      stroke="none"
    />

    <text class="horseshoe-colorstop-label" style="fill:var(--primary-text-color)">
      <textPath
        href="#${_}"
        startOffset="${f}"
        text-anchor="${b}"
      >
        ${c}
      </textPath>
    </text>
  `}static renderColorStopTextPathLabelV2({index:e,label:t,angle:r,cx:o,cy:a,radius:i,cardId:s,isMin:n=!1,isMax:l=!1}){const c=String(t),d=Math.max(18,5*c.length);let h=r-d/2,u=r+d/2;n&&(h=r,u=r+d),l&&(h=r-d,u=r);const m=r>-90&&r<90,p=m?h:u,g=m?u:h,f=m?1:0,b=Ja.polarToCartesian(o,a,i,p),y=Ja.polarToCartesian(o,a,i,g),v=`${s}-colorstop-label-${e}`;return q`
    <path
      id="${v}"
      d="M ${b.x} ${b.y} A ${i} ${i} 0 0 ${f} ${y.x} ${y.y}"
      fill="none"
      stroke="none"
    />

    <text class="horseshoe-colorstop-label" style="fill:var(--primary-text-color)">
      <textPath
        href="#${v}"
        startOffset="50%"
        text-anchor="middle"
      >
        ${c}
      </textPath>
    </text>
  `}static renderColorStopTextPathLabelV1({index:e,label:t,angle:r,cx:o,cy:a,radius:i,cardId:s}){const n=String(t),l=Math.max(18,5*n.length),c=r-l/2,d=r+l/2,h=r>-90&&r<90,u=h?c:d,m=h?d:c,p=h?1:0,g=Ja.polarToCartesian(o,a,i,u),f=Ja.polarToCartesian(o,a,i,m),b=`${s}-colorstop-label-${e}`,y=`\n    M ${g.x} ${g.y}\n    A ${i} ${i} 0 0 ${p} ${f.x} ${f.y}\n  `;return q`
    <path
      id="${b}"
      d="${y}"
      fill="none"
      stroke="none"
    />

    <text class="horseshoe-colorstop-label">
      <textPath
        href="#${b}"
        startOffset="50%"
        text-anchor="middle"
      >
        ${n}
      </textPath>
    </text>
  `}static renderColorStopRotatedLabel({label:e,angle:t,cx:r,cy:o,radius:a}){const i=Ja.polarToCartesian(r,o,a,t);let s=t;return s>90&&(s-=180),s<-90&&(s+=180),q`
      <text
        x="${i.x}"
        y="${i.y}"
        text-anchor="middle"
        dominant-baseline="middle"
        transform="rotate(${s} ${i.x} ${i.y})"
        class="horseshoe-colorstop-label"
        style="fill:var(--primary-text-color)"
      >
        ${e}
      </text>
    `}static renderColorStopTextPathLabelV3({index:e,label:t,angle:r,cx:o,cy:a,radius:i,cardId:s}){const n=Math.max(18,5*String(t).length),l=r-n/2,c=r+n/2,d=Ja.polarToCartesian(o,a,i,c),h=Ja.polarToCartesian(o,a,i,l),u=`${s}-colorstop-label-${e}`,m=`\n      M ${d.x} ${d.y}\n      A ${i} ${i} 0 0 0 ${h.x} ${h.y}\n    `;return q`
      <path
        id="${u}"
        d="${m}"
        fill="none"
        stroke="none"
      />

      <text class="horseshoe-colorstop-label">
        <textPath
          href="#${u}"
          startOffset="50%"
          text-anchor="middle"
          style="fill:var(--primary-text-color)"
        >
          ${t}
        </textPath>
      </text>
    `}static valueToAngle(e,t,r,o,a){if("bidirectional"!==a){return-o/2+(e-t)/(r-t)*o}const i=o/2;if(e<0){return-(e/t)*i}if(e>0){return e/r*i}return 0}static valueToAngleV1(e,t,r,o,a){if("bidirectional"!==a){return-o/2+(e-t)/(r-t)*o}if(e<0){return o/2*-(e/t)}if(e>0){return e/r*(o/2)}return 0}static polarToCartesian(e,t,r,o){const a=(o-90)*Math.PI/180;return{x:e+r*Math.cos(a),y:t+r*Math.sin(a)}}static renderArcSegment({cx:e,cy:t,radius:r,startAngle:o,endAngle:a,width:i,color:s,className:n="",lineCap:l="round"}){const c=Ja.polarToCartesian(e,t,r,o),d=Ja.polarToCartesian(e,t,r,a),h=Math.abs(a-o)>180?1:0,u=a>o?1:0;return q`
    <path
      class="${n}"
      d="M ${c.x} ${c.y}
         A ${r} ${r} 0 ${h} ${u} ${d.x} ${d.y}"
      fill="none"
      stroke="${s}"
      stroke-width="${i}"
      stroke-linecap="${l}"
      opacity="0.1"
    />
  `}static buildColorStopSegments(e,t,r){const o=e.map((e=>({value:Number(e.value),color:e.color,label:e.label??e.value}))).filter((e=>Number.isFinite(e.value)&&e.value>=t&&e.value<=r)).sort(((e,t)=>e.value-t.value));if(!o.length)return[];const a=[{value:t,color:o[0].color},...o,{value:r,color:o[o.length-1].color}];return a.slice(0,-1).map(((e,t)=>{const r=a[t+1];return{startValue:e.value,endValue:r.value,color:e.color}})).filter((e=>e.startValue!==e.endValue))}static buildColorStopSegmentsV1(e,t,r){const o=e.map((e=>({value:Number(e.value),color:e.color,label:e.label??e.value}))).filter((e=>Number.isFinite(e.value)&&e.value>=t&&e.value<=r)).sort(((e,t)=>e.value-t.value)),a=[{value:t,color:o[0]?.color},...o,{value:r,color:o.at(-1)?.color}];return a.slice(0,-1).map(((e,t)=>{const r=a[t+1];return{startValue:e.value,endValue:r.value,color:r.color??e.color}})).filter((e=>e.startValue!==e.endValue))}static renderColorStopScaleSegments({cx:e,cy:t,radius:r,startAngle:o,endAngle:a,width:i,colorStops:s,min:n,max:l,arcDegrees:c,barMode:d,gap:h=0,opacity:u=1,className:m="",lineCap:p="butt"}){const g=Ja.buildColorStopSegments(s.colors,n,l),f="round"===p;return q`
    ${g.map(((o,a)=>{const s=0===a,p=a===g.length-1,b=Ja.valueToAngle(o.startValue,n,l,c,d)+h/2,y=Ja.valueToAngle(o.endValue,n,l,c,d)-h/2;if(y<=b)return q``;const v=y>b?1:0;return q`
        ${Ja.renderArcSegment({cx:e,cy:t,radius:r,startAngle:b,endAngle:y,width:i,color:o.color,opacity:u,className:m,lineCap:"butt"})}

        ${s&&f?Ja.renderArcHalfCap({cx:e,cy:t,radius:r,angle:b,width:i,color:o.color,opacity:u,className:m,sweepFlag:v,side:"start"}):q``}

        ${p&&f?Ja.renderArcHalfCap({cx:e,cy:t,radius:r,angle:y,width:i,color:o.color,opacity:u,className:m,sweepFlag:v,side:"end"}):q``}
      `}))}
  `}static renderColorStopScaleSegmentsV2({cx:e,cy:t,radius:r,width:o,colorStops:a,min:i,max:s,arcDegrees:n,barMode:l,gap:c=0,opacity:d=1,className:h=""}){const u=Ja.buildColorStopSegments(a,i,s);return q`
    ${u.map(((a,m)=>{const p=0===m,g=m===u.length-1,f=Ja.valueToAngle(a.startValue,i,s,n,l)+c/2,b=Ja.valueToAngle(a.endValue,i,s,n,l)-c/2;if(b<=f)return q``;const y=b>f?1:0;return q`
        ${Ja.renderArcSegment({cx:e,cy:t,radius:r,startAngle:f,endAngle:b,width:o,color:a.color,opacity:d,className:h,lineCap:"butt"})}

        ${p?Ja.renderArcHalfCap({cx:e,cy:t,radius:r,angle:f,width:o,color:a.color,opacity:d,className:h,sweepFlag:y,side:"start"}):q``}

        ${g?Ja.renderArcHalfCap({cx:e,cy:t,radius:r,angle:b,width:o,color:a.color,opacity:d,className:h,sweepFlag:y,side:"end"}):q``}
      `}))}
  `}static renderColorStopScaleSegmentsV1({cx:e,cy:t,radius:r,startAngle:o,endAngle:a,width:i,colorStops:s,min:n,max:l,arcDegrees:c,barMode:d,className:h="",lineCap:u="butt"}){const m=Ja.buildColorStopSegments(s,n,l);return q`
    ${m.map((o=>{const a=Ja.valueToAngle(o.startValue,n,l,c,d),s=Ja.valueToAngle(o.endValue,n,l,c,d);return Ja.renderArcSegment({cx:e,cy:t,radius:r,startAngle:a,endAngle:s,width:i,color:o.color,className:h,lineCap:u})}))}
  `}static renderArcHalfCap({cx:e,cy:t,radius:r,angle:o,width:a,color:i,opacity:s=1,className:n="",side:l="end"}){const c=Ja.polarToCartesian(e,t,r,o),d=a/2,h=(c.x-e)/r,u=(c.y-t)/r,m=c.x-h*d,p=c.y-u*d,g=c.x+h*d,f=c.y+u*d;return q`
    <path
      class="${n}"
      d="
        M ${m} ${p}
        A ${d} ${d} 0 0 ${"start"===l?1:0} ${g} ${f}
        Z
      "
      fill="${i}"
      opacity="${s}"
    />
  `}static renderArcHalfCapV1({cx:e,cy:t,radius:r,angle:o,width:a,color:i,sweepFlag:s,side:n}){const l=Ja.polarToCartesian(e,t,r,o),c=a/2,d=((s?o+90:o-90)-90)*Math.PI/180,h=Math.cos(d)*c,u=Math.sin(d)*c,m=l.x-h,p=l.y-u,g=l.x+h,f=l.y+u;return q`
      <path
        d="
          M ${m} ${p}
          A ${c} ${c} 0 0 ${"start"===n?0:1} ${g} ${f}
          L ${l.x} ${l.y}
          Z
        "
        fill="${i}"
      />
    `}static textLengthToArcDegrees(e,t,r=6){return e/(2*Math.PI*t)*360+r}}console.info("%c FLEX-HORSESHOE-CARD %c Version 5.4.6-dev.2 ","color: white; font-weight: bold; background: darkgreen","color: darkgreen; font-weight: bold; background: white");const Ba={action:"more-info"},Wa={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed"};class Ka extends ne{constructor(){if(super(),Ia.setElement(this),this.cardId=Math.random().toString(36).substr(2,9),this._hass=void 0,this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.viewBoxSize=Va,this.viewBox={width:Va,height:Va},this.colorStops={},this.animations={},this.animations.vlines={},this.animations.hlines={},this.animations.circles={},this.animations.icons={},this.animations.iconsIcon={},this.animations.names={},this.animations.areas={},this.animations.states={},this.resolvedEntityConfigs=[],this.colorCache={},this.isAndroid=!1,this.isSafari=!1,this.iOS=!1,this.resolvedVariables={},this.iconCache={},this.iconsSvg=[],this.pendingIconPath=[],this.iconsId=[],this.bar_mode="normal",this.dev={debug:!1},this.isAndroid=!!window.navigator.userAgent.match(/Android/),!this.isAndroid){const e=window.navigator.userAgent||"",t=e.toLowerCase(),r=window.navigator.platform||"",o=(/iPad|iPhone|iPod/.test(e)||"MacIntel"===r&&window.navigator.maxTouchPoints>1)&&!window.MSStream,a=e.match(/Version\/(\d+)(?:\.[\d.]+)?.*Safari/i),i=a?Number(a[1]):void 0,s=t.match(/\bos\s+(\d+)(?:[._]\d+)*.*like safari/),n=t.match(/\bios\s+(\d+)(?:[._]\d+)*/),l=n?Number(n[1]):s?Number(s[1]):void 0,c=Number.isFinite(i),d=Number.isFinite(l)&&t.includes("like safari"),h=c?i:d?l:void 0;this.iOS=o,this.isSafari=Number.isFinite(h),this.safariMajorVersion=h,this.isHomeAssistantLikeSafari=d,this.isRealSafari=c,this.isSafari14=this.isSafari&&14===h,this.isSafari15=this.isSafari&&15===h,this.isSafari16=this.isSafari&&16===h,this.isSafari17=this.isSafari&&17===h,this.isSafari18=this.isSafari&&18===h,this.isSafari26=this.isSafari&&26===h,this.isSafari27=this.isSafari&&27===h,this.isSafari28=this.isSafari&&28===h,this.isSafari29=this.isSafari&&29===h,this.isSafari30=this.isSafari&&30===h,this.isSafariGte16=this.isSafari&&h>=16,this.dev?.debug&&console.log("browser detection",{ua:e,isAndroid:this.isAndroid,isIOS:this.iOS,isSafari:this.isSafari,isRealSafari:this.isRealSafari,isHomeAssistantLikeSafari:this.isHomeAssistantLikeSafari,safariMajorVersion:this.safariMajorVersion,isSafariGte16:this.isSafariGte16}),this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config)}}static get styles(){return i`
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
    `}_resolveEntityConfigs(e){return e?.dev?.debug&&console.log("resolving entity config for",e?.entities),e?.entities?.map(((e,t)=>{const r={entity_index:t};return ge.getJsTemplateOrValue(r,e)}))??[]}_buildMyIcon(e,t,r){if(!e||!t)return;if(r)return r;if(t.icon)return t.icon;const o=t.entity,a=t.attribute,i=a?e.attributes?.[a]:void 0,s=e.entity_id?.split(".")[0];if(e.attributes?.icon&&!a)return e.attributes.icon;if(a&&"weather"===s){const e=Ra[a];if(e)return e}this.entitiesIcon??={},this.entitiesIconKey??={},this.entitiesIconPending??={};const n=a?`${o}|attribute:${a}`:`${o}|state`,l=a?[o,"attribute",a,i??"",s??"",e.attributes?.device_class??"",e.attributes?.icon??""].join("|"):[o,"state",e.state??"",s??"",e.attributes?.device_class??"",e.attributes?.icon??""].join("|");if(this.entitiesIconKey[n]===l)return this.entitiesIcon[n];if(this.entitiesIconKey[n]=l,!this.entitiesIconPending[n]){this.entitiesIconPending[n]=!0;const t=a?(async(e,t,r,o)=>{let a;const i=Ve(t),s=t.attributes.device_class,n=e.entities?.[t.entity_id],l=n?.platform,c=n?.translation_key,d=o??t.attributes[r];if(c&&l){const t=await Re(e.config,e.connection,l);t&&(a=qe(d,t[i]?.[c]?.state_attributes?.[r]))}if(!a){const t=await Le(e.connection,e.config,i);if(t){const e=s&&t[s]?.state_attributes?.[r]||t._?.state_attributes?.[r];a=qe(d,e)}}return a})(this._hass,e,a,void 0!==i?String(i):void 0):(async(e,t,r,o,a)=>{const i=e?.[o.entity_id];if(i?.icon)return i.icon;const s=Ve(o);return Ue(t,r,s,o,a,i)})(this._hass.entities,this._hass.config,this._hass.connection,e);t.then((e=>{this.entitiesIconKey[n]===l&&e&&this.entitiesIcon[n]!==e&&(this.entitiesIcon[n]=e,this.requestUpdate())})).catch((e=>{console.error(a?"_buildMyIcon attributeIcon failed":"_buildMyIcon entityIcon failed",o,a??"",e)})).finally((()=>{this.entitiesIconPending[n]=!1}))}return this.entitiesIcon[n]}_formatEntityStateParts(e,t){const r=void 0!==t.attribute,o=r?this._hass.formatEntityAttributeValueToParts(e,t.attribute):this._hass.formatEntityStateToParts(e,this._buildState(e.state,t)),a=r?e.attributes[t.attribute]:e.state,i=void 0===t.decimals||Number.isNaN(Number(a))?void 0:((e,t,r)=>ze(e,t,r).map((e=>e.value)).join(""))(Number(a),this._hass.locale,{minimumFractionDigits:Number(t.decimals),maximumFractionDigits:Number(t.decimals)});return o.map((e=>"value"===e.type&&void 0!==i?{...e,value:i}:"unit"===e.type&&void 0!==t.unit?{...e,value:t.unit}:e))}set hass(e){this._hass=e,ge.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes});let t=!1;if(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.resolvedEntityConfigs.forEach(((r,o)=>{const a=e.states[r.entity];if(!a)return;this.entities[o]=a;const i=this._buildState(a.state,r);if(Ve(a),i!==this.entitiesStr[o]&&(this.entitiesStr[o]=i,t=!0),r.attribute&&Object.prototype.hasOwnProperty.call(a.attributes,r.attribute)){const e=this._buildState(a.attributes[r.attribute],r);e!==this.attributesStr[o]&&(this.attributesStr[o]=e,t=!0)}})),t){if(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.horseshoes=this.horseshoes.map(((e,t)=>{const r=e.entity_index??0,o=this.resolvedEntityConfigs[r],a=this.entities[r];if(!a||!o)return e;let i=a.state;o.attribute&&void 0!==a.attributes[o.attribute]&&(i=a.attributes[o.attribute]);const s=ge.getJsTemplateOrValue({entity_index:r},e.horseshoe_scale),n=s?.min??0,l=s?.max??100;let c,d,h=!1;if("bidirectional"===(e.bar_mode||"normal")){const t=e.horseshoePathLength,r=Number(i);if(r>=0){const o=Math.min(Ia.calculateValueBetween(0,l,r),1)*(t/2);c=`${o} ${e.circlePathLength-o}`,d=void 0,h=!1}else{const o=(1-Math.min(Ia.calculateValueBetween(n,0,r),1))*(t/2);c=`${o} ${e.circlePathLength-o}`,d=""+-(e.circlePathLength-o),h=!0}}else{c=`${Math.min(Ia.calculateValueBetween(n,l,i),1)*e.horseshoePathLength} ${10*e.radiusSize}`,d=void 0,h=!1}const u=Math.min(Ia.calculateValueBetween(n,l,i),1),m=e.show.horseshoe_style;let p=e.color0,g=e.color1,f=e.color1_offset,b=e.angleCoords,y=e.stroke_color;if("fixed"===m)y=e.horseshoe_state.color,p=e.horseshoe_state.color,g=e.horseshoe_state.color,f="0%";else if("autominmax"===m){const t=this._calculateStrokeColor(i,e.colorStopsMinMax,!0);p=t,g=t,f="0%"}else if("colorstop"===m||"colorstopgradient"===m){const t=this._calculateStrokeColor(i,e.colorStops,"colorstopgradient"===m);p=t,g=t,f="0%"}else"lineargradient"===m&&(b={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},f=`${Math.round(100*(1-u))}%`);return{...e,horseshoe_scale:{...e.horseshoe_scale,...s},dashArray:c,dashOffset:d,bidirectional_negative:h,stroke_color:y,color0:p,color1:g,color1_offset:f,angleCoords:b}})),this.horseshoes.length>0){const e=this.horseshoes[0];this.dashArray=e.dashArray,this.dashOffset=e.dashOffset,this._bidirectional_negative=e.bidirectional_negative,this.stroke_color=e.stroke_color,this.color0=e.color0,this.color1=e.color1,this.color1_offset=e.color1_offset,this.angleCoords=e.angleCoords}this.config.animations&&Object.keys(this.config.animations).map((e=>{const t=e.substr(Number(e.indexOf(".")+1));return this.config.animations[e].map((e=>this.entities[t].state.toLowerCase()===e.state.toLowerCase()&&(e.vlines&&e.vlines.forEach((e=>this._updateAnimationStyles("vlines",e))),e.hlines&&e.hlines.forEach((e=>this._updateAnimationStyles("hlines",e))),e.circles&&e.circles.forEach((e=>this._updateAnimationStyles("circles",e))),e.icons&&e.icons.forEach((e=>{const t=e.animation_id;this.animations.icons[t]&&e.reuse||(this.animations.icons[t]={},this.animations.iconsIcon[t]={});const r=ge.getJsTemplateOrValue(e,e.styles),o=pe.toStyleDict(r);this.animations.icons[t]={...this.animations.icons[t],...o},this.animations.iconsIcon[t]=ge.getJsTemplateOrValue(e,e.icon)})),e.states&&e.states.forEach((e=>this._updateAnimationStyles("states",e))),!0))),!0})),ge.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),this.requestUpdate()}}_updateAnimationStyles(e,t){const r=t.animation_id;if(null==r)return;const o=ge.getJsTemplateOrValue(t,t.styles),a=pe.toStyleDict(o);this.animations[e][r]={...t.reuse?this.animations[e][r]??{}:{},...a}}_prepareItemColorStops(e){["states","names","areas","circles","hlines","vlines","icons","horseshoes"].forEach((t=>{const r=e.layout?.[t];Array.isArray(r)&&r.forEach((e=>{if(!e.color_stops)return;const t=ge.getJsTemplateOrValue(e,e.color_stops,{resolveKeys:!0});e._colorStops=fe.normalize(t)}))}))}_calculateSvgCoordinatesInGroup(e){const t={xpos:ja.calculateSvgDimension(e.xpos),ypos:ja.calculateSvgDimension(e.ypos)},r=this.config.layout?.groups?.[e.group];if(!e.group||!r)return t;return{xpos:ja.calculateSvgDimension(r.xpos+e.xpos-50),ypos:ja.calculateSvgDimension(r.ypos+e.ypos-50)}}_computeGroupDimensions(e){const t=e.layout?.groups;t&&Object.entries(t).forEach((([e,t])=>{t.svg={xpos:ja.calculateSvgDimension(t.xpos),ypos:ja.calculateSvgDimension(t.ypos)}}))}_computeSvgDimensions(e){const t=e.layout;t?.names&&t.names.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.states&&t.states.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.areas&&t.areas.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.icons&&t.icons.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.hlines&&t.hlines.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.length=ja.calculateSvgDimension(e.length)})),t?.vlines&&t.vlines.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.length=ja.calculateSvgDimension(e.length)})),t?.circles&&t.circles.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.radius=e.radius})),this?.horseshoes&&this.horseshoes.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.radius=ja.calculateSvgDimension(e.radius),e.svg.tickmarksRadius=ja.calculateSvgDimension(e.tickmarks_radius),e.svg.rotateX=e.svg.xpos,e.svg.rotateY=e.svg.ypos}))}_resolveSameAsItems(e){return e.map(((e,t,r)=>{if(void 0===e.same_as)return e;const o=r[e.same_as];if(!o)throw new Error(`same_as '${e.same_as}' not found for item ${t}`);const{same_as:a,...i}=e;return Ha.mergeDeep(o,i)}))}_resolveSectionSameAs(e){["horseshoes","states","names","areas","circles","hlines","vlines","icons"].forEach((t=>{const r=e.layout?.[t];Array.isArray(r)&&(e.layout[t]=this._resolveSameAsItems(r))}))}setConfig(e){try{if(!(e=JSON.parse(JSON.stringify(e))).entities)throw Error("No entities defined");if(!e.layout)throw Error("No layout defined");this._resolveSectionSameAs(e),ge.setContext({hass:this._hass,config:e,entities:this.entities,horseshoes:this.horseshoes});const t=this._resolveEntityConfigs(e);if(t){if("sensor"!==_e(t[0].entity)&&t[0].attribute&&!isNaN(t[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}t.forEach((e=>{e.tap_action||(e.tap_action={...Ba})}));const r={texts:[],card_filter:"card--filter-none",bar_mode:e.bar_mode||"normal",...e,show:{...Wa,...e.show}};this.horseshoes=Ga.setConfig(e,ge);const o=this.horseshoes?.[0];o&&(this.colorStops=o.colorStops,this.colorStopsMinMax=o.colorStopsMinMax,this.color0=o.color0,this.color1=o.color1,this.angleCoords=o.angleCoords,this.color1_offset=o.color1_offset),this._prepareItemColorStops(r),this.config=r,this.bar_mode=r.bar_mode||"normal",this.config.layout?.icons&&this.config.layout.icons.forEach(((e,t)=>{this.iconsId[t]=Math.random().toString(36).substr(2,9)})),this.aspectratio=(this.config.layout.aspectratio||this.config.aspectratio||"1/1").trim();const a=this.aspectratio.split("/");this.viewBox||(this.viewBox={}),this.viewBox.width=a[0]*Oa,this.viewBox.height=a[1]*Oa,this._computeGroupDimensions(this.config),this._computeSvgDimensions(this.config),ge.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes})}catch(t){throw console.error("[FHC setConfig] CONFIG ERROR",{error:t,message:t?.message,stack:t?.stack,rawConfig:e,horseshoes:this.horseshoes}),t}}_getItemStateValue(e={}){const t=e.entity_index??0,r=this.entities?.[t],o=this.config?.entities?.[t];if(!r)return;const a=o?.attribute;return a&&r.attributes&&void 0!==r.attributes[a]?r.attributes[a]:r.state}_getItemColorFromStops(e={}){if(!e._colorStops)return;const t=this._getItemStateValue(e),r=Number(t);return Number.isFinite(r)?this._calculateStrokeColor(r,e._colorStops,!0===e.colorstop_gradient):void 0}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback()}render({config:e}=this){const t=ge.getJsTemplateOrValue({entity_index:0},e?.styles),r=pe.toStyleDict(t);return F`
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
    `}_renderTickMarks(e,t){if(!1===e.show?.scale_tickmarks)return q``;const r=e.horseshoe_scale,o=Number(r.min),a=Number(r.max),i=a-o;if(!i)return q``;const s={entity_index:e.entity_index},n=ge.getJsTemplateOrValue(s,e?.horseshoe_tickmarks?.styles),l=pe.toStyleDict(n),c=e.svg.xpos,d=e.svg.ypos,h={transformOrigin:`${c}px ${d}px`};void 0!==e?.horseshoe_tickmarks?.fill&&(h.fill=e.horseshoe_tickmarks.fill);const u=r.color||"var(--primary-background-color)";h.fill=u;const m={...l,...h},p=r.ticksize||i/10,g=e.arc_degrees||260,f=r.width?r.width/2:3,b=o%p,y=o+(0===b?0:p-b);if(y>a)return q``;const v=Math.floor((a-y)/p)+1,_=Array.from({length:v},((a,s)=>{const n=(g/2-(y+s*p-o)/i*g)*Math.PI/180;return q`
      <circle
        cx="${c-Math.sin(n)*e.tickmarksRadiusSize}"
        cy="${d-Math.cos(n)*e.tickmarksRadiusSize}"
        r="${f}"
        style=${me(m)}>
      </circle>
      ${this._renderColorStopLabels(t,e,r,e.colorStops,g)}
    `}));return q`${_}`}_renderSvg(){const e=this.config.card_filter?this.config.card_filter:"card--filter-none";return q`
        <svg xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
            class="${e}" 
          viewBox='0 0 ${this.viewBox.width} ${this.viewBox.height}'>
            ${this._renderHorseShoes()}
            <g id="datagroup" class="datagroup">
              ${this._renderCircles()}
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
  `}_renderHorseShoe(e,t){if(!1===e.show?.horseshoe)return q``;const r=e.svg.xpos,o=e.svg.ypos,a=e.svg.rotateX,i=e.svg.rotateY,s=e.bar_mode||"normal",n=`${e.svg.radius}px`,l=e.horseshoe_scale.color||"#000000",c=e.horseshoe_scale.width||6,d=e.horseshoe_state.width||12,h=-90-(e.arc_degrees??260)/2,u=`${e.horseshoePathLength},${e.circlePathLength}`,m=`horseshoe__gradient-${this.cardId}-${t}`,p={entity_index:e.entity_index},g=ge.getJsTemplateOrValue(p,e.horseshoe_scale?.styles),f=pe.toStyleDict(g),b={stroke:l,strokeWidth:c,strokeDasharray:u,strokeLinecap:"round"};void 0!==e.horseshoe_scale?.fill&&(b.fill=e.horseshoe_scale.fill);const y={fill:"none","stroke-linecap":"round",...f,...b},v=ge.getJsTemplateOrValue(p,e.horseshoe_state?.styles),_=pe.toStyleDict(v),x={stroke:`url('#${m}')`,strokeDasharray:e.dashArray,strokeDashoffset:e.dashOffset,strokeWidth:d};void 0!==e.horseshoe_state?.fill&&(x.fill=e.horseshoe_state.fill);const $={fill:"none",transition:"all 2.5s ease-out",strokeLinecap:"round",..._,...x},w=e.rotate?`rotate(${e.rotate})`:"";return"bidirectional"===s?e.bidirectional_negative?q`
      <g id="horseshoe__svg__group-${t}" class="horseshoe__svg__group"
        transform="${w} ${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
          <circle id="horseshoe__scale-${t}" class="horseshoe__scale" cx="${r}px" cy="${o}px" r="${n}"
            style=${me(y)}  
            transform="rotate(${h} ${a} ${i})"/>
          <circle id="horseshoe__state__value-${t}" class="horseshoe__state__value" cx="${r}px" cy="${o}px" r="${n}"
            transform="rotate(-90 ${a} ${i})"
            style=${me($)} />
          ${this._renderTickMarks(e,t)}
        </g>
      `:q`
      <g id="horseshoe__svg__group-${t}" class="horseshoe__svg__group"
        transform="${w} ${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
        <circle id="horseshoe__scale-${t}" class="horseshoe__scale" cx="${r}px" cy="${o}px" r="${n}"
            style=${me(y)}  
          transform="rotate(${h} ${a} ${i})"/>
        <circle id="horseshoe__state__value-${t}" class="horseshoe__state__value" cx="${r}px" cy="${o}px" r="${n}"
          transform="rotate(-90 ${a} ${i})"
            style=${me($)} />
        ${this._renderTickMarks(e,t)}
      </g>
    `:q`
      <g id="horseshoe__svg__group-${t}" class="horseshoe__svg__group"
        transform="${w} ${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
      <circle id="horseshoe__scale-${t}" class="horseshoe__scale" cx="${r}px" cy="${o}px" r="${n}"
        style=${me(y)}
        transform="rotate(${h} ${a} ${i})"/>
      <circle id="horseshoe__state__value-${t}" class="horseshoe__state__value" cx="${r}px" cy="${o}px" r="${n}"
        transform="rotate(${h} ${a} ${i})"
        style=${me($)} />
      ${this._renderTickMarks(e,t)}
    </g>
  `}_renderEntityName(e){const t=e.entity_index??0,r=ge.getJsTemplateOrValue(e,e.styles),o={"font-size":"1.5em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...pe.toStyleDict(r)},a={...this.animations?.names?.[e.animation_id]??{}},i=this._getItemColorFromStops(e);i&&(a.stroke=i);const s={...o,...a},n=this.textEllipsis(this._buildName(this.entities[e.entity_index],this.resolvedEntityConfigs[e.entity_index]),e?.max_characters??e?.ellipsis);return q`
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
                style=${me(s)}>
                ${n}</tspan>
          </text>
          </g>
        `}_renderEntityNames(){const{layout:e}=this.config;if(!e?.names)return q``;const t=e.names.map((e=>this._renderEntityName(e)));return q`${t}`}_renderEntityArea(e){const t=e.entity_index??0,r=ge.getJsTemplateOrValue(e,e.styles),o={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...pe.toStyleDict(r)},a={...pe.toStyleDict(this.animations?.areas?.[e.animation_id]??{})},i=this._getItemColorFromStops(e);i&&(a.stroke=i);const s={...o,...a},n=this.textEllipsis(this._buildArea(this.entities[e.entity_index],this.resolvedEntityConfigs[e.entity_index]),e?.max_characters??e?.ellipsis);return q`
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
              style=${me(s)}>
              ${n}</tspan>
        </text>
      </g>
      `}_renderEntityAreas(){const{layout:e}=this.config;if(!e?.areas)return q``;const t=e.areas.map((e=>this._renderEntityArea(e)));return q`${t}`}_getGroupScaleTransform(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;if(!t?.scale&&!e?.flip_x&&!e?.flip_y)return"";const r=t?.scale?.x??t?.scale??1,o=t?.scale?.y??t?.scale??1;return`scale(${r*("x"===e?.flip||"both"===e?.flip?-1:1)}, ${o*("y"===e?.flip||"both"===e?.flip?-1:1)})`}_getGroupScaleTransformV1(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;if(!t?.scale)return"";return`scale(${t.scale?.x??t.scale}, ${t.scale?.y??t.scale})`}_getGroupScaleStyle(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;return t?.scale&&t.svg?`transform-origin:${t.svg.xpos}px ${t.svg.ypos}px; transform-box:view-box;`:""}_renderEntityState(e){if(!e)return q``;const t=e.entity_index??0,r=e.svg.xpos??Da,o=e.svg.ypos??Da,a=e.dx?e.dx:"0",i=e.dy?e.dy:"0",s=ge.getJsTemplateOrValue(e,e.styles),n=pe.toStyleDict(s),l=e.uom??{},c=ge.getJsTemplateOrValue(e,l.styles),d=pe.toStyleDict(c),h=l.dx??"0.1",u=l.dy??"-0.45";let m={};this.animations?.states?.[e.animation_id]&&(m={...this.animations.states[e.animation_id]});const p=this._getItemColorFromStops(e);p&&(m.fill=p);const g={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...n,...m},f=g["font-size"];let b=.5,y="em";const v=String(f).trim().match(/^(\d*\.?\d+)([a-z%]+)$/i);v?(b=.6*Number(v[1]),y=v[2]):console.error("Cannot determine font-size for state",f);const _={"font-size":`${b}${y}`},x={...g,opacity:"0.7",..._,...d},$=this.entities[t],w=this.resolvedEntityConfigs[t]??{},M=this._formatEntityStateParts($,w);let S="",k="";M.forEach((e=>{"unit"===e.type?k+=e.value:"value"===e.type&&(S+=e.value)})),S=S.trim(),k=k.trim();const A=this._buildUom($,w,k);return q`
      <g 
        transform="${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
        <text @click=${e=>this.handlePopup(e,this.entities[t])}>
          <tspan
            class="state__value"
            x="${r}"
            y="${o}"
            dx="${a}em"
            dy="${i}em"
            style=${me(g)}
          >${S}</tspan><tspan
            class="state__uom"
            dx="${h}em"
            dy="${u}em"
            style=${me(x)}
          >${A}</tspan>
        </text>
      </g>
    `}_renderEntityStates(){const{layout:e}=this.config;if(!e)return;if(!e.states)return;const t=e.states.map((e=>q`
            ${this._renderEntityState(e)}
          `));return q`${t}`}computeEntityColor(e){if(!e||"off"===e.state||"unavailable"===e.state||"unknown"===e.state)return"var(--state-icon-color)";const t=e.state;if(!isNaN(t)||t.endsWith("W")||t.endsWith("kWh")||t.endsWith("V"))return"var(--state-icon-color)";const r=e.entity_id.split(".")[0],o=e.attributes.device_class;if("sensor"===r)return"var(--state-icon-color)";if("light"===r&&e.attributes.rgb_color&&"on"===t){const[t,r,o]=e.attributes.rgb_color;return`rgb(${t}, ${r}, ${o})`}return"binary_sensor"===r&&o&&"on"===t?`var(--state-binary_sensor-${o}-on-color, var(--state-icon-active-color))`:"climate"===r?`var(--state-climate-${t}-color, var(--state-icon-active-color))`:"on"===t?`var(--state-${r}-active-color, var(--state-${r}-color, var(--state-icon-active-color)))`:"var(--state-icon-color)"}_renderIcon(e,t){if(!e)return;e.entity=e.entity?e.entity:0,this.iconCache||={},this.iconsSvg||=[],this.pendingIconPath||=[];const r=12*(e.icon_size?e.icon_size:e.size?e.size:2),o=e.svg.xpos,a=e.svg.ypos,i=e.align?e.align:"center",s="center"===i?.5:"start"===i?-1:1;let n=o-r*s,l=a-r*s,c=r;const d=e.entity_index??0,h=this.entities[d],u=Ia.getHaEntityIconStyle(h),m={};m.fill=u.fill,m.color=u.color,m.filter=u.filter;const p=ge.getJsTemplateOrValue(e,e.styles);let g=pe.toStyleDict(p);const f=this.animations?.icons?.[e.animation_id]??{},b=this._getItemColorFromStops(e);b&&(g.fill=b),g={...m,...g,...f};const y=this._buildMyIcon(this.entities[d],this.resolvedEntityConfigs[d],this.animations?.iconsIcon?.[e.animation_id]);if(this.iconCache[y])this.iconsSvg[t]=this.iconCache[y];else if(this.iconsSvg[t]=void 0,this.pendingIconPath[t]!==y){this.pendingIconPath[t]=y;let e=0;const r=40,o=50,a=()=>{if(this.pendingIconPath[t]!==y)return;const i=this._getRenderedHaIconPath(t);if(i)return this.iconsSvg[t]=i,this.iconCache[y]=i,this.pendingIconPath[t]=void 0,void this.requestUpdate();e+=1,e>=r?this.pendingIconPath[t]=void 0:window.setTimeout(a,o)};(this?.updateComplete&&"function"==typeof this.updateComplete.then||this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((e=>window.requestAnimationFrame(e)))).then((()=>{window.setTimeout(a,0)}))}const v=this.iconsSvg[t];if(v){const i=o-r*s,n=a-.5*r-.25*r,l=r/24,c=e.rotate??0,d=i+12*l,h=n+12*l;return g["transform-origin"]??="0 0",q`
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
                  <path d="${v}"></path>
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
            .icon=${y}
            id="icon-${this.iconsId[t]}"
          ></ha-icon>
        </div>
      </body>
    </foreignObject>
  `}_getRenderedHaIconPath(e){const t=this.shadowRoot.getElementById(`icon-${this.iconsId[e]}`);return t?.shadowRoot?.querySelector("*")?.path}_scheduleIconPathRead(e,t){if(!e)return;if(this.iconCache[e])return void(this.iconsSvg[t]=this.iconCache[e]);if(this.pendingIconPath[t]===e)return;this.pendingIconPath[t]=e;let r=0;const o=()=>{if(this.pendingIconPath[t]!==e)return;if(this.iconCache[e])return this.iconsSvg[t]=this.iconCache[e],this.pendingIconPath[t]=void 0,void this.requestUpdate();const a=this._getRenderedHaIconPath();if(a)return this.iconsSvg[t]=a,this.iconCache[e]=a,this.pendingIconPath[t]=void 0,void this.requestUpdate();r+=1,r>=40?this.pendingIconPath[t]=void 0:this._iconPathTimer=window.setTimeout(o,50)};(this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((e=>{window.requestAnimationFrame(e)}))).then((()=>{this._iconPathTimer=window.setTimeout(o,0)}))}_renderIcons(){const{layout:e}=this.config;if(!e)return;if(!e.icons)return;const t=e.icons.map(((e,t)=>q`
            ${this._renderIcon(e,t)}
          `));return q`${t}`}_renderHorizontalLine(e){const t=e.entity_index??0,r=ge.getJsTemplateOrValue(e,e.styles),o={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2",...pe.toStyleDict(r)},a={...pe.toStyleDict(this.animations?.hlines?.[e.animation_id]??{})},i=this._getItemColorFromStops(e);i&&(a.stroke=i);const s={...o,...a};return q`
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
          style=${me(s)}
        ></line>
      </g> 
  `}_renderHorizontalLines(){const{layout:e}=this.config;if(!e?.hlines)return q``;const t=e.hlines.map((e=>this._renderHorizontalLine(e)));return q`${t}`}_renderVerticalLine(e){const t=e.entity_index??0,r=ge.getJsTemplateOrValue(e,e.styles),o={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2",...pe.toStyleDict(r)},a={...pe.toStyleDict(this.animations?.vlines?.[e.animation_id]??{})},i=this._getItemColorFromStops(e);i&&(a.stroke=i);const s={...o,...a};return q`
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
          style=${me(s)}
        ></line>
      </g> 
    `}_renderVerticalLines(){const{layout:e}=this.config;if(!e?.vlines)return q``;const t=e.vlines.map((e=>this._renderVerticalLine(e)));return q`${t}`}_renderCircle(e){const t=e.entity_index??0,r=ge.getJsTemplateOrValue(e,e.styles),o={...pe.toStyleDict(r)},a={...pe.toStyleDict(this.animations?.circles?.[e.animation_id]??{})},i=this._getItemColorFromStops(e);i&&(a.stroke=i);const s={...o,...a};return q`
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
          style=${me(s)}
        ></circle>
      </g>
    `}_renderCircles(){const{layout:e}=this.config;if(!e?.circles)return q``;const t=e.circles.map((e=>this._renderCircle(e)));return q`${t}`}_handleClick(e,t,r,o,a){let i;switch(o.action){case"more-info":i=new Event("hass-more-info",{composed:!0}),i.detail={entityId:a},e.dispatchEvent(i);break;case"navigate":if(!o.navigation_path)return;window.history.pushState(null,"",o.navigation_path),i=new Event("location-changed",{composed:!0}),i.detail={replace:!1},window.dispatchEvent(i);break;case"call-service":{if(!o.service)return;const[e,r]=o.service.split(".",2),a={...o.service_data};t.callService(e,r,a);break}case"fire-dom-event":i=new Event("ll-custom",{composed:!0,bubbles:!0}),i.detail=o,e.dispatchEvent(i)}}handlePopup(e,t){e.stopPropagation();const r=this.resolvedEntityConfigs.find((e=>e.entity===t.entity_id)),o=r?.tap_action??this.config?.tap_action??{action:"more-info"};this._handleClick(this,this._hass,this.config,o,t.entity_id)}textEllipsis(e,t){return t&&t<e.length?e.slice(0,t-1).concat("..."):e}_buildArea(e,t){if(t.area)return t.area;if(!this._hass||!this._hass.areas)return"";const r=this._hass.entities&&this._hass.entities[t.entity];let o=r?r.area_id:null;if(!o&&r&&r.device_id&&this._hass.devices){const e=this._hass.devices[r.device_id];o=e?e.area_id:null}if(o){const e=this._hass.areas[o];return e?e.name:""}return"?"}_buildName(e,t){return t.name??e.attributes.friendly_name??e?.entity_id??"?"}_buildIcon(e,t,r){return r||t?.icon||e?.attributes?.icon||Se(e)}_buildUom(e,t,r){return t.unit||r||""}_buildState(e,t){if(void 0===e)return e;if(null===e)return e;if(t.convert){let r,o,a=t.convert.match(/(^\w+)\((\d+)\)/);switch(null===a?r=t.convert:3===a.length&&(r=a[1],o=Number(a[2])),r){case"brightness_pct":e="undefined"===e?"undefined":`${Math.round(e/255*100)}`;break;case"multiply":e=`${Math.round(e*o)}`;break;case"divide":e=`${Math.round(e/o)}`;break;case"rgb_csv":case"rgb_hex":if(t.attribute){let o=this._hass.states[t.entity];switch(o.attributes.color_mode){case"unknown":case"onoff":case"brightness":case"white":break;case"color_temp":if(o.attributes.color_temp_kelvin){let t=_a(o.attributes.color_temp_kelvin);const a=fa(t);a[1]<.4&&(a[1]<.1?a[2]=225:a[1]=.4),t=ba(a),t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:ga(t)}else e="rgb_csv"===r?"255,255,255":"#ffffff00";break;case"hs":{let t=ya([o.attributes.hs_color[0],o.attributes.hs_color[1]/100]);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:ga(t)}break;case"rgb":{const t=fa(this.stateObj.attributes.rgb_color);t[1]<.4&&(t[1]<.1?t[2]=225:t[1]=.4);const o=ba(t);e="rgb_csv"===r?o.toString():ga(o)}break;case"rgbw":{let t=(e=>{const[t,r,o,a]=e;return Ma([t,r,o,a],[t+a,r+a,o+a])})(o.attributes.rgbw_color);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:ga(t)}break;case"rgbww":{let t=ka(o.attributes.rgbww_color,o.attributes?.min_color_temp_kelvin,o.attributes?.max_color_temp_kelvin);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:ga(t)}break;case"xy":if(o.attributes.hs_color){let t=ya([o.attributes.hs_color[0],o.attributes.hs_color[1]/100]);const a=fa(t);a[1]<.4&&(a[1]<.1?a[2]=225:a[1]=.4),t=ba(a),t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:ga(t)}else if(o.attributes.color){let t={};t.l=o.attributes.brightness,t.h=o.attributes.color.h||o.attributes.color.hue,t.s=o.attributes.color.s||o.attributes.color.saturation;let{r:a,g:i,b:s}=Ia.hslToRgb(t);if("rgb_csv"===r)e=`${a},${i},${s}`;else{e=`#${Ia.padZero(a.toString(16))}${Ia.padZero(i.toString(16))}${Ia.padZero(s.toString(16))}`}}else o.attributes.xy_color}}break;default:console.error(`Unknown converter [${r}] specified for entity [${t.entity}]!`)}}return void 0!==e?Number.isNaN(e)?e:e.toString():void 0}_calculateStrokeColor(e,t,r){const o=t?.colors??[];if(!o.length)return;const a=Number(e);if(!Number.isFinite(a))return o[0].color;if(a<=o[0].value)return o[0].color;const i=o[o.length-1];if(a>=i.value)return i.color;for(let s=0;s<o.length-1;s+=1){const e=o[s],t=o[s+1];if(a>=e.value&&a<t.value){if(!r)return e.color;const o=Ia.calculateValueBetween(e.value,t.value,a);return Ia.getGradientValue(e.color,t.color,o)}}return i.color}_computeEntity(e){return e.substr(e.indexOf(".")+1)}_renderColorStopLabels(e,t,r,o,a){const i=Number(r.min),s=Number(r.max),n=t.svg.xpos,l=t.svg.ypos,c=t.svg.radius+t.horseshoe_state.width+2,d=t.bar_mode,h=[{value:i,label:i},...o.colors,{value:s,label:s}].filter(((e,t,r)=>{const o=Number(e.value);return Number.isFinite(o)&&o>=i&&o<=s&&r.findIndex((e=>Number(e.value)===o))===t}));return q`
      ${Ja.renderArcSegment({cx:n,cy:l,radius:c,startAngle:-a/2,endAngle:a/2,width:14,color:"rgba(255, 255, 255, 0.02)",className:"horseshoe-scale-background"})};
      ${t?.colorStops.colors.length?Ja.renderColorStopScaleSegments({cx:n,cy:l,radius:c,startAngle:-a/2,endAngle:a/2,width:14,colorStops:o,min:i,max:s,arcDegrees:a,barMode:d,gap:o.gap??2,className:"horseshoe-colorstop-scale-segment",lineCap:"round"}):q``}
      ${h.map(((t,r)=>{const o=Number(t.value),h=Ja.valueToAngle(o,i,s,a,d);return Ja.renderColorStopLabel({horseshoeIndex:e,index:r,label:t.label??t.value,angle:h,cx:n,cy:l,radius:c,cardId:this.cardId,isMin:o===i,isMax:o===s})}))}
  `}_renderColorStopLabelsV2(e,t,r,o){const a=Number(t.min),i=Number(t.max),s=e.svg.xpos,n=e.svg.ypos,l=e.svg.radius+e.horseshoe_state.width,c=e.bar_mode;return q`
    ${r.filter((e=>{const t=Number(e.value);return Number.isFinite(t)&&t>=a&&t<=i})).map(((e,t)=>{const r=Number(e.value),d=Ja.valueToAngle(r,a,i,o,c);return Ja.renderColorStopLabel({index:t,label:e.label??e.value,angle:d,cx:s,cy:n,radius:l,cardId:this.cardId})}))}
  `}_renderColorStopLabelsV1(e,t,r,o){const a=Number(t.min),i=Number(t.max),s=e.svg.xpos,n=e.svg.ypos,l=e.svg.radius+e.horseshoe_state.width;return q`
    ${r.filter((e=>{const t=Number(e.value);return Number.isFinite(t)&&t>=a&&t<=i})).map(((e,t)=>{const r=Number(e.value),c=-o/2+(r-a)/(i-a)*o;return Ja.renderColorStopLabel({index:t,label:e.label??e.value,angle:c,cx:s,cy:n,radius:l,cardId:this.cardId})}))}
  `}getCardSize(){return 4}}customElements.get("flex-horseshoe-card")||customElements.define("flex-horseshoe-card",Ka);

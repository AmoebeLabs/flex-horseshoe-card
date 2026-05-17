/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),s=new WeakMap;let i=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const r=this.t;if(t&&void 0===e){const t=void 0!==r&&1===r.length;t&&(e=s.get(r)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&s.set(r,e))}return e}toString(){return this.cssText}};const o=(e,...t)=>{const s=1===e.length?e[0]:t.reduce(((t,r,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[s+1]),e[0]);return new i(s,e,r)},a=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return(e=>new i("string"==typeof e?e:e+"",void 0,r))(t)})(e):e
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:n,defineProperty:c,getOwnPropertyDescriptor:l,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,m=globalThis,p=m.trustedTypes,g=p?p.emptyScript:"",f=m.reactiveElementPolyfillSupport,_=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},b=(e,t)=>!n(e,t),v={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=v){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(e,r,t);void 0!==s&&c(this.prototype,e,s)}}static getPropertyDescriptor(e,t,r){const{get:s,set:i}=l(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const o=s?.call(this);i?.call(this,t),this.requestUpdate(e,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??v}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const e=this.properties,t=[...d(e),...h(e)];for(const r of t)this.createProperty(r,e[r])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,r]of t)this.elementProperties.set(e,r)}this._$Eh=new Map;for(const[t,r]of this.elementProperties){const e=this._$Eu(t,r);void 0!==e&&this._$Eh.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((r,s)=>{if(t)r.adoptedStyleSheets=s.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const t of s){const s=document.createElement("style"),i=e.litNonce;void 0!==i&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}})(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){const r=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,r);if(void 0!==s&&!0===r.reflect){const i=(void 0!==r.converter?.toAttribute?r.converter:y).toAttribute(t,r.type);this._$Em=e,null==i?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(e,t){const r=this.constructor,s=r._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=r.getPropertyOptions(s),i="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=s;const o=i.fromAttribute(t,e.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(e,t,r,s=!1,i){if(void 0!==e){const o=this.constructor;if(!1===s&&(i=this[e]),r??=o.getPropertyOptions(e),!((r.hasChanged??b)(i,t)||r.useDefault&&r.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,r))))return;this.C(e,t,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:s,wrapped:i},o){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==i||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,r]of e){const{wrapped:e}=r,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,r,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[_("elementProperties")]=new Map,w[_("finalized")]=new Map,f?.({ReactiveElement:w}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,x=$.trustedTypes,S=x?x.createPolicy("flex-horseshoe-card-lit-html",{createHTML:e=>e}):void 0,k="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+A,C=`<${E}>`,T=document,O=()=>T.createComment(""),M=e=>null===e||"object"!=typeof e&&"function"!=typeof e,N=Array.isArray,D="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,z=/>/g,R=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),V=/'/g,F=/"/g,H=/^(?:script|style|textarea|title)$/i,j=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),U=j(1),G=j(2),L=Symbol.for("lit-noChange"),J=Symbol.for("lit-nothing"),B=new WeakMap,q=T.createTreeWalker(T,129);function W(e,t){if(!N(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const K=(e,t)=>{const r=e.length-1,s=[];let i,o=2===t?"<svg>":3===t?"<math>":"",a=P;for(let n=0;n<r;n++){const t=e[n];let r,c,l=-1,d=0;for(;d<t.length&&(a.lastIndex=d,c=a.exec(t),null!==c);)d=a.lastIndex,a===P?"!--"===c[1]?a=I:void 0!==c[1]?a=z:void 0!==c[2]?(H.test(c[2])&&(i=RegExp("</"+c[2],"g")),a=R):void 0!==c[3]&&(a=R):a===R?">"===c[0]?(a=i??P,l=-1):void 0===c[1]?l=-2:(l=a.lastIndex-c[2].length,r=c[1],a=void 0===c[3]?R:'"'===c[3]?F:V):a===F||a===V?a=R:a===I||a===z?a=P:(a=R,i=void 0);const h=a===R&&e[n+1].startsWith("/>")?" ":"";o+=a===P?t+C:l>=0?(s.push(r),t.slice(0,l)+k+t.slice(l)+A+h):t+A+(-2===l?n:h)}return[W(e,o+(e[r]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class Y{constructor({strings:e,_$litType$:t},r){let s;this.parts=[];let i=0,o=0;const a=e.length-1,n=this.parts,[c,l]=K(e,t);if(this.el=Y.createElement(c,r),q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=q.nextNode())&&n.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(k)){const t=l[o++],r=s.getAttribute(e).split(A),a=/([.?@])?(.*)/.exec(t);n.push({type:1,index:i,name:a[2],strings:r,ctor:"."===a[1]?te:"?"===a[1]?re:"@"===a[1]?se:ee}),s.removeAttribute(e)}else e.startsWith(A)&&(n.push({type:6,index:i}),s.removeAttribute(e));if(H.test(s.tagName)){const e=s.textContent.split(A),t=e.length-1;if(t>0){s.textContent=x?x.emptyScript:"";for(let r=0;r<t;r++)s.append(e[r],O()),q.nextNode(),n.push({type:2,index:++i});s.append(e[t],O())}}}else if(8===s.nodeType)if(s.data===E)n.push({type:2,index:i});else{let e=-1;for(;-1!==(e=s.data.indexOf(A,e+1));)n.push({type:7,index:i}),e+=A.length-1}i++}}static createElement(e,t){const r=T.createElement("template");return r.innerHTML=e,r}}function X(e,t,r=e,s){if(t===L)return t;let i=void 0!==s?r._$Co?.[s]:r._$Cl;const o=M(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),void 0===o?i=void 0:(i=new o(e),i._$AT(e,r,s)),void 0!==s?(r._$Co??=[])[s]=i:r._$Cl=i),void 0!==i&&(t=X(e,i._$AS(e,t.values),i,s)),t}class Z{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,s=(e?.creationScope??T).importNode(t,!0);q.currentNode=s;let i=q.nextNode(),o=0,a=0,n=r[0];for(;void 0!==n;){if(o===n.index){let t;2===n.type?t=new Q(i,i.nextSibling,this,e):1===n.type?t=new n.ctor(i,n.name,n.strings,this,e):6===n.type&&(t=new ie(i,this,e)),this._$AV.push(t),n=r[++a]}o!==n?.index&&(i=q.nextNode(),o++)}return q.currentNode=T,s}p(e){let t=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,s){this.type=2,this._$AH=J,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),M(e)?e===J||null==e||""===e?(this._$AH!==J&&this._$AR(),this._$AH=J):e!==this._$AH&&e!==L&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>N(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==J&&M(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:r}=e,s="number"==typeof r?this._$AC(e):(void 0===r.el&&(r.el=Y.createElement(W(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new Z(s,this),r=e.u(this.options);e.p(t),this.T(r),this._$AH=e}}_$AC(e){let t=B.get(e.strings);return void 0===t&&B.set(e.strings,t=new Y(e)),t}k(e){N(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,s=0;for(const i of e)s===t.length?t.push(r=new Q(this.O(O()),this.O(O()),this,this.options)):r=t[s],r._$AI(i),s++;s<t.length&&(this._$AR(r&&r._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,s,i){this.type=1,this._$AH=J,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=i,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=J}_$AI(e,t=this,r,s){const i=this.strings;let o=!1;if(void 0===i)e=X(this,e,t,0),o=!M(e)||e!==this._$AH&&e!==L,o&&(this._$AH=e);else{const s=e;let a,n;for(e=i[0],a=0;a<i.length-1;a++)n=X(this,s[r+a],t,a),n===L&&(n=this._$AH[a]),o||=!M(n)||n!==this._$AH[a],n===J?e=J:e!==J&&(e+=(n??"")+i[a+1]),this._$AH[a]=n}o&&!s&&this.j(e)}j(e){e===J?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===J?void 0:e}}class re extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==J)}}class se extends ee{constructor(e,t,r,s,i){super(e,t,r,s,i),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??J)===L)return;const r=this._$AH,s=e===J&&r!==J||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,i=e!==J&&(r===J||s);s&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ie{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const oe=$.litHtmlPolyfillSupport;oe?.(Y,Q),($.litHtmlVersions??=[]).push("3.3.2");const ae=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ne=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,r)=>{const s=r?.renderBefore??t;let i=s._$litPart$;if(void 0===i){const e=r?.renderBefore??null;s._$litPart$=i=new Q(t.insertBefore(O(),e),e,void 0,r??{})}return i._$AI(e),i})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}};ne._$litElement$=!0,ne.finalized=!0,ae.litElementHydrateSupport?.({LitElement:ne});const ce=ae.litElementPolyfillSupport;ce?.({LitElement:ne}),(ae.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const le=1;let de=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,r){this._$Ct=e,this._$AM=t,this._$Ci=r}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const he="important",ue=" !"+he,me=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends de{constructor(e){if(super(e),e.type!==le||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce(((t,r)=>{const s=e[r];return null==s?t:t+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`}),"")}update(e,[t]){const{style:r}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const s of this.ft)null==t[s]&&(this.ft.delete(s),s.includes("-")?r.removeProperty(s):r[s]=null);for(const s in t){const e=t[s];if(null!=e){this.ft.add(s);const t="string"==typeof e&&e.endsWith(ue);s.includes("-")||t?r.setProperty(s,t?e.slice(0,-11):e,t?he:""):r[s]=e}}return L}});var pe=function(){return pe=Object.assign||function(e){for(var t,r=1,s=arguments.length;r<s;r++)for(var i in t=arguments[r])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e},pe.apply(this,arguments)};function ge(e,t,r){void 0===t&&(t=Date.now()),void 0===r&&(r={});var s=pe(pe({},fe),r||{}),i=(+e-+t)/1e3;if(Math.abs(i)<s.second)return{value:Math.round(i),unit:"second"};var o=i/60;if(Math.abs(o)<s.minute)return{value:Math.round(o),unit:"minute"};var a=i/3600;if(Math.abs(a)<s.hour)return{value:Math.round(a),unit:"hour"};var n=i/86400;if(Math.abs(n)<s.day)return{value:Math.round(n),unit:"day"};var c=new Date(e),l=new Date(t),d=c.getFullYear()-l.getFullYear();if(Math.round(Math.abs(d))>0)return{value:Math.round(d),unit:"year"};var h=12*d+c.getMonth()-l.getMonth();if(Math.round(Math.abs(h))>0)return{value:Math.round(h),unit:"month"};var u=i/604800;return{value:Math.round(u),unit:"week"}}var fe={second:45,minute:45,hour:22,day:5};class _e{static toStyleDict(e){return _e.toDict(e,{stringToDict:_e.cssStringToDict,mapValue:_e.toStyleValue})}static toClassDict(e){return _e.toDict(e,{stringToDict:_e.classStringToDict,mapValue:Boolean})}static toIconDict(e){return _e.toDict(e,{stringToDict:_e.stringToDefaultDict("default"),mapValue:String})}static toDict(e,t={}){const{stringToDict:r=_e.stringToDefaultDict("default"),mapValue:s=(e=>e),skipNull:i=!0,skipFalse:o=!0}=t,a=e=>null==e&&i||!1===e&&o?{}:Array.isArray(e)?e.reduce(((e,t)=>({...e,...a(t)})),{}):_e.isPlainObject(e)?Object.fromEntries(Object.entries(e).filter((([,e])=>(null!=e||!i)&&(!1!==e||!o))).map((([e,t])=>[e,s(t,e)]))):"string"==typeof e?r(e):{};return a(e)}static toStyleValue(e){return null==e?e:String(e).trim().replace(/;+$/,"")}static cssStringToDict(e){return String(e).split(";").map((e=>e.trim())).filter(Boolean).reduce(((e,t)=>{const r=t.indexOf(":");if(r<=0)return e;const s=t.slice(0,r).trim(),i=t.slice(r+1).trim();return s&&i?{...e,[s]:i}:e}),{})}static toColorStopDict(e){return _e.toDict(e,{stringToDict:_e.keyValueStringToDict,mapValue:String})}static keyValueStringToDict(e){const t=String(e).trim(),r=t.indexOf(":");if(r<=0)return{};const s=t.slice(0,r).trim(),i=t.slice(r+1).trim();return s&&i?{[s]:i}:{}}static classStringToDict(e){return String(e).trim().split(/\s+/).filter(Boolean).reduce(((e,t)=>({...e,[t]:!0})),{})}static stringToDefaultDict(e="default"){return t=>({[e]:String(t)})}static requireArray(e,t="value"){if(null==e)return[];if(!Array.isArray(e))throw new Error(`[config-helper] "${t}" must be an array.`);return e}static ensureArray(e){return null==e?[]:Array.isArray(e)?e:[e]}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}}class ye{static context={};static setContext(e={}){ye.context=e}static getJsTemplateOrValue(e,t,r={}){return ye._getJsTemplateOrValue(e,t,r,0)}static _getJsTemplateOrValue(e,t,r={},s=0){const{resolveKeys:i=!0,maxDepth:o=10}=r;if(s>=o)return t;if(null==t)return t;if(["number","boolean","bigint","symbol"].includes(typeof t))return t;if(Array.isArray(t))return t.map((t=>ye._getJsTemplateOrValue(e,t,r,s)));if(ye.isPlainObject(t))return Object.fromEntries(Object.entries(t).map((([t,o])=>{const a=i?ye._getJsTemplateOrValue(e,t,r,s):t,n=ye._getJsTemplateOrValue(e,o,r,s);return[String(a),n]})));if("string"!=typeof t)return t;const a=t.trim();if(!ye.isJsTemplate(a))return t;const n=ye.evaluateJsTemplate(e,ye.extractJsTemplateCode(a));return ye._getJsTemplateOrValue(e,n,r,s+1)}static getJsTemplateOrValueV1(e,t,r={}){const{resolveKeys:s=!0}=r;if(null==t)return t;if(["number","boolean","bigint","symbol"].includes(typeof t))return t;if(Array.isArray(t))return t.map((t=>ye.getJsTemplateOrValue(e,t,r)));if(ye.isPlainObject(t))return Object.fromEntries(Object.entries(t).map((([t,i])=>{const o=s?ye.getJsTemplateOrValue(e,t,r):t,a=ye.getJsTemplateOrValue(e,i,r);return[String(o),a]})));if("string"!=typeof t)return t;const i=t.trim();if(ye.isJsTemplate(i)){const t=ye.evaluateJsTemplate(e,ye.extractJsTemplateCode(i));return ye.getJsTemplateOrValue(e,t,r)}return t}static isJsTemplate(e){return"string"==typeof e&&e.trim().startsWith("[[[")&&e.trim().endsWith("]]]")}static extractJsTemplateCode(e){return String(e).trim().slice(3,-3).trim()}static evaluateJsTemplate(e,t){const{hass:r,config:s,entities:i=[]}=ye.context,o=ye._getItemEntityIndex(e),a=ye._getTemplateState(e),n=i?.[o],c=r?.states,l=s?.variables??{},d=r?.user;s?.dev?.debug&&console.log("Evaluating JavaScript template with context:",{hass:r,config:s,entity:n,entities:i,states:c,state:a,variables:l,item:e,user:d});try{return new Function("hass","config","entity","entities","states","state","variables","item","user",`\n          "use strict";\n          ${t}\n        `)(r,s,n,i,c,a,l,e,d)}catch(h){return void(s?.dev?.debug&&console.error("[templates] JavaScript template error:",{error:h,item:e,javascript:t}))}}static _getTemplateState(e={}){const t=ye._getItemEntityIndex(e),r=ye.context.entities?.[t],s=ye.context.config?.entities?.[t]||{};if(!r)return;const i=s.attribute;return i&&r.attributes&&void 0!==r.attributes[i]?r.attributes[i]:r.state}static _getItemEntityIndex(e={}){const t=Number(e.entity_index);return Number.isFinite(t)?t:0}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}}class be{static normalize(e){return e?Array.isArray(e)?{scales:{},colors:be.normalizeColors(e)}:!be.isPlainObject(e)||e.colors||e.scales?be.isPlainObject(e)?{scales:be.normalizeScales(e.scales),colors:be.normalizeColors(e.colors)}:{scales:{},colors:[]}:{scales:{},colors:be.normalizeColors(e)}:{scales:{},colors:[]}}static normalizeScales(e){return be.isPlainObject(e)?Object.fromEntries(Object.entries(e).map((([e,t])=>[e,be.isPlainObject(t)?{...t}:t]))):{}}static normalizeColors(e){return e?Array.isArray(e)?e.flatMap((e=>be.normalizeColorArrayEntry(e))).filter(Boolean).sort(((e,t)=>e.value-t.value)):be.isPlainObject(e)?Object.entries(e).map((([e,t])=>be.normalizeColorPair(e,t))).filter(Boolean).sort(((e,t)=>e.value-t.value)):[]:[]}static normalizeColorArrayEntry(e){if(be.isPlainObject(e)&&Object.prototype.hasOwnProperty.call(e,"value")&&Object.prototype.hasOwnProperty.call(e,"color")){const t=be.normalizeColorEntry(e);return t?[t]:[]}return be.isPlainObject(e)?Object.entries(e).map((([e,t])=>be.normalizeColorPair(e,t))).filter(Boolean):[]}static normalizeColorPair(e,t){const r=Number(e);return Number.isFinite(r)?null==t?null:{value:r,color:String(t)}:null}static normalizeColorEntry(e){if(!be.isPlainObject(e))return null;const t=Number(e.value);return Number.isFinite(t)?void 0===e.color||null===e.color?null:{...e,value:t,color:String(e.color)}:null}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}static _testColorStopsNormalizer(){const e={entity_index:0},t=[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}];[{name:"FHC dict",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC dict with quoted keys",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC list of dicts",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC list of dicts with quoted keys",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC dict with template values",raw:{0:"[[[\n          return 'red';\n        ]]]",10:"[[[\n          return 'green';\n        ]]]",20:"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template values",raw:[{0:"[[[\n            return 'red';\n          ]]]"},{10:"[[[\n            return 'green';\n          ]]]"},{20:"[[[\n            return 'blue';\n          ]]]"}]},{name:"FHC dict with template keys",raw:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}},{name:"FHC dict with template keys and values",raw:{"[[[ return 0; ]]]":"[[[\n          return 'red';\n        ]]]","[[[ return 10; ]]]":"[[[\n          return 'green';\n        ]]]","[[[ return 20; ]]]":"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template keys and values",raw:[{"[[[ return 0; ]]]":"[[[\n            return 'red';\n          ]]]"},{"[[[ return 10; ]]]":"[[[\n            return 'green';\n          ]]]"},{"[[[ return 20; ]]]":"[[[\n            return 'blue';\n          ]]]"}]},{name:"Whole FHC color_stops as template returning dict",raw:"[[[\n        return {\n          0: 'red',\n          10: 'green',\n          20: 'blue',\n        };\n      ]]]"},{name:"Whole FHC color_stops as template returning list",raw:"[[[\n        return [\n          { 0: 'red' },\n          { 10: 'green' },\n          { 20: 'blue' },\n        ];\n      ]]]"},{name:"SAK v1 colorstops.colors dict",raw:{colors:{0:"red",10:"green",20:"blue"}}},{name:"SAK v1 colorstops.colors dict with template keys",raw:{colors:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}}},{name:"SAK v1 colorstops.colors dict with template values",raw:{colors:{0:"[[[\n            return 'red';\n          ]]]",10:"[[[\n            return 'green';\n          ]]]",20:"[[[\n            return 'blue';\n          ]]]"}}},{name:"SAK v2 colors list",raw:{scales:{default:{min:0,max:20}},colors:[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}]}},{name:"SAK v2 colors list unsorted",raw:{scales:{default:{min:0,max:20}},colors:[{value:20,color:"blue",rank:2},{value:0,color:"red",rank:1},{value:10,color:"green",rank:1}]}},{name:"SAK v2 colors list with template values",raw:{scales:{default:{min:"[[[\n              return 0;\n            ]]]",max:"[[[\n              return 20;\n            ]]]"}},colors:[{value:"[[[\n              return 0;\n            ]]]",color:"[[[\n              return 'red';\n            ]]]"},{value:"[[[\n              return 10;\n            ]]]",color:"[[[\n              return 'green';\n            ]]]"},{value:"[[[\n              return 20;\n            ]]]",color:"[[[\n              return 'blue';\n            ]]]"}]}},{name:"SAK v2 whole colors list as template",raw:{scales:{default:{min:0,max:20}},colors:"[[[\n          return [\n            { value: 0, color: 'red' },\n            { value: 10, color: 'green' },\n            { value: 20, color: 'blue' },\n          ];\n        ]]]"}}].forEach((r=>{const s=ye.getJsTemplateOrValue(e,r.raw,{resolveKeys:!0}),i=be.normalize(s),o=i.colors.map((e=>({value:e.value,color:e.color}))),a=JSON.stringify(o)===JSON.stringify(t);console.log(`[colorstops test] ${a?"PASS":"FAIL"} - ${r.name}`,{raw:r.raw,resolved:s,normalized:i,simpleColors:o,expectedColors:t})}))}}const ve="mdi:bookmark",we={air_quality:"mdi:air-filter",alert:"mdi:alert",calendar:"mdi:calendar",climate:"mdi:thermostat",configurator:"mdi:cog",conversation:"mdi:microphone-message",counter:"mdi:counter",datetime:"mdi:calendar-clock",date:"mdi:calendar",demo:"mdi:home-assistant",google_assistant:"mdi:google-assistant",group:"mdi:google-circles-communities",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_button:"mdi:gesture-tap-button",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",number:"mdi:ray-vertex",persistent_notification:"mdi:bell",plant:"mdi:Flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:palette",schedule:"mdi:calendar-clock",script:"mdi:script-text",select:"mdi:format-list-bulleted",sensor:"mdi:eye",simple_alarm:"mdi:bell",siren:"mdi:bullhorn",stt:"mdi:microphone-message",text:"mdi:form-textbox",time:"mdi:clock",timer:"mdi:timer-outline",tts:"mdi:speaker-message",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",zone:"mdi:map-marker-radius"},$e={apparent_power:"mdi:flash",aqi:"mdi:air-filter",atmospheric_pressure:"mdi:thermometer-lines",carbon_dioxide:"mdi:molecule-co2",carbon_monoxide:"mdi:molecule-co",current:"mdi:current-ac",data_rate:"mdi:transmission-tower",data_size:"mdi:database",date:"mdi:calendar",distance:"mdi:arrow-left-right",duration:"mdi:progress-clock",energy:"mdi:lightning-bolt",frequency:"mdi:sine-wave",gas:"mdi:meter-gas",humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",irradiance:"mdi:sun-wireless",moisture:"mdi:water-percent",monetary:"mdi:cash",nitrogen_dioxide:"mdi:molecule",nitrogen_monoxide:"mdi:molecule",nitrous_oxide:"mdi:molecule",ozone:"mdi:molecule",pm1:"mdi:molecule",pm10:"mdi:molecule",pm25:"mdi:molecule",power:"mdi:flash",power_factor:"mdi:angle-acute",precipitation:"mdi:weather-rainy",precipitation_intensity:"mdi:weather-pouring",pressure:"mdi:gauge",reactive_power:"mdi:flash",signal_strength:"mdi:wifi",sound_pressure:"mdi:ear-hearing",speed:"mdi:speedometer",sulphur_dioxide:"mdi:molecule",temperature:"mdi:thermometer",timestamp:"mdi:clock",volatile_organic_compounds:"mdi:molecule",volatile_organic_compounds_parts:"mdi:molecule",voltage:"mdi:sine-wave",volume:"mdi:car-coolant-level",water:"mdi:water",weight:"mdi:weight",wind_speed:"mdi:weather-windy"},xe={10:"mdi:battery-10",20:"mdi:battery-20",30:"mdi:battery-30",40:"mdi:battery-40",50:"mdi:battery-50",60:"mdi:battery-60",70:"mdi:battery-70",80:"mdi:battery-80",90:"mdi:battery-90",100:"mdi:battery"},Se=(e,t)=>{const r=Number(e);if(isNaN(r))return"off"===e?"mdi:battery":"on"===e?"mdi:battery-alert":"mdi:battery-unknown";const s=10*Math.round(r/10);return r<=5?"mdi:battery-alert-variant-outline":xe[s]},ke=e=>{const t=e?.attributes.device_class;if(t&&t in $e)return $e[t];if("battery"===t)return e?((e,t)=>{const r=e.state;return Se(r)})(e):"mdi:battery";const r=e?.attributes.unit_of_measurement;return"°C"===r||"°F"===r?"mdi-thermometer":void 0},Ae=(e,t,r)=>{const s=t?.state;switch(e){case"alarm_control_panel":return(e=>{switch(e){case"armed_away":return"mdi:shield-lock";case"armed_vacation":return"mdi:shield-airplane";case"armed_home":return"mdi:shield-home";case"armed_night":return"mdi:shield-moon";case"armed_custom_bypass":return"mdi:security";case"pending":return"mdi:shield-outline";case"triggered":return"mdi:bell-ring";case"disarmed":return"mdi:shield-off";default:return"mdi:shield"}})(s);case"automation":return"off"===s?"mdi:robot-off":"mdi:robot";case"binary_sensor":return((e,t)=>{const r="off"===e;switch(t?.attributes.device_class){case"battery":return r?"mdi:battery":"mdi:battery-outline";case"battery_charging":return r?"mdi:battery":"mdi:battery-charging";case"carbon_monoxide":return r?"mdi:smoke-detector":"mdi:smoke-detector-alert";case"cold":return r?"mdi:thermometer":"mdi:Snowflake";case"connectivity":return r?"mdi:close-network-outline":"mdi:check-network-outline";case"door":return r?"mdi:door-closed":"mdi:door-open";case"garage_door":return r?"mdi:garage":"mdi:garage-open";case"power":case"plug":return r?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return r?"mdi:check-circle":"mdi:alert-circle";case"smoke":return r?"mdi:smoke-detector-variant":"mdi:smoke-detector-variant-alert";case"heat":return r?"mdi:thermometer":"mdi:fire";case"light":return r?"mdi:brightness-5":"mdi:brightness-7";case"lock":return r?"mdi:lock":"mdi:lock-open";case"moisture":return r?"mdi:water-off":"mdi:water";case"motion":return r?"mdi:motion-sensor-off":"mdi:motion-sensor";case"occupancy":return r?"mdi:home-outline":"mdi:Home";case"opening":return r?"mdi:square":"mdi:square-outline";case"presence":return r?"mdi:home-outline":"mdi:home";case"running":return r?"mdi:stop":"mdi:play";case"sound":return r?"mdi:music-note-off":"mdi:music-note";case"update":return r?"mdi:package":"mdi:package-up";case"vibration":return r?"mdi:crop-portrait":"mdi:vibrate";case"window":return r?"mdi:window-closed":"mdi:window-open";default:return r?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}})(s,t);case"button":switch(t?.attributes.device_class){case"restart":return"mdi:restart";case"update":return"mdi:package-up";default:return"mdi:gesture-tap-button"}case"camera":return"off"===s?"mdi:video-off":"mdi:video";case"cover":return((e,t)=>{const r="closed"!==e;switch(t?.attributes.device_class){case"garage":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdigarage";default:return"mdi:Garage-open"}case"gate":switch(e){case"opening":case"closing":return"mdi:gate-arrow-right";case"closed":return"mdi:gate";default:return"mdi:gate-open"}case"door":return r?"mdi:door-open":"mdi:door-closed";case"damper":return r?"mdi:circle":"mdi:circle-slice-8";case"shutter":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window-shutter";default:return"mdi:window-shutter-open"}case"curtain":switch(e){case"opening":return"mdi:arrow-split-vertical";case"closing":return"mdi:arrow-collapse-horizontal";case"closed":return"mdi:curtains-closed";default:return"mdi:curtains"}case"blind":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:blinds-horizontal-closed";default:return"mdi:blinds-horizontal"}case"shade":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:roller-shade-closed";default:return"mdi:roller-shade"}case"window":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}}switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}})(s,t);case"device_tracker":return"router"===t?.attributes.source_type?"home"===s?"mdi:lan-connect":"mdi:lan-cisconnect":["bluetooth","bluetooth_le"].includes(t?.attributes.source_type)?"home"===s?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===s?"mdi:account-arrow-right":"mdi:account";case"fan":return"off"===s?"mdi:fan-off":"mdi:fan";case"humidifier":return"off"===s?"mdi:air-humidifier-off":"mdi:air-humidifier";case"input_boolean":return"on"===s?"mdi:check-circle-outline":"mdi:close-circle-outline";case"input_datetime":if(!t?.attributes.has_date)return"mdi:clock";if(!t.attributes.has_time)return"mdi:calendar";break;case"lock":switch(s){case"unlocked":return"mdi:lock-open";case"jammed":return"mdi:lock-alert";case"locking":case"unlocking":return"mdi:lock-clock";default:return"mdi:lock"}case"media_player":switch(t?.attributes.device_class){case"speaker":switch(s){case"playing":return"mdi:speaker-play";case"paused":return"mdi:speaker-pause";case"off":return"mdi:speaker-off";default:return"mdi:speaker"}case"tv":switch(s){case"playing":return"mdi:television-play";case"paused":return"mdi:television-pause";case"off":return"mdi:television-off";default:return"mdi:television"}case"receiver":return"off"===s?"mdi:audio-video-off":"mdi:audio-video";default:switch(s){case"playing":case"paused":return"mdi:cast-connected";case"off":return"mdi:cast-off";default:return"mdi:cast"}}case"number":{const e=(e=>{const t=e?.attributes.device_class;if(t&&t in $e)return $e[t]})(t);if(e)return e;break}case"person":return"not_home"===s?"mdi:account-arrow-right":"mdi:account";case"switch":switch(t?.attributes.device_class){case"outlet":return"on"===s?"mdi:power-plug":"mdi:power-plug-off";case"switch":return"on"===s?"mdi:toggle-switch-variant":"mdi:toggle-switch-variant-off";default:return"mdi:toggle-switch-variant"}case"sensor":{const e=ke(t);if(e)return e;break}case"sun":return"above_horizon"===t?.state?"mdi:white-balance-sunny":"mdi:weather-night";case"switch_as_x":return"mdi:swap-horizontal";case"threshold":return"mdi:chart-sankey";case"water_heater":return"off"===s?"mdi:water-boiler-off":"mdi:water-boiler"}if(e in we)return we[e]},Ee=e=>{return e?(r=e.entity_id,t=r.substr(0,r.indexOf(".")),Ae(t,e)||(console.warn(`Unable to find icon for domain ${t}`),ve)):ve;var t,r};var Ce;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(Ce=Ce||(Ce={}));const Te=(e,t,r)=>{const s=t?(e=>{switch(e.number_format){case Ce.comma_decimal:return["en-US","en"];case Ce.decimal_comma:return["de","es","it"];case Ce.space_comma:return["fr","sv","cs"];case Ce.system:return;default:return e.language}})(t):void 0;if(Number.isNaN=Number.isNaN||function e(t){return"number"==typeof t&&e(t)},t?.number_format!==Ce.none&&!Number.isNaN(Number(e))&&Intl)try{return new Intl.NumberFormat(s,Oe(e,r)).format(Number(e))}catch(i){return console.error(i),new Intl.NumberFormat(void 0,Oe(e,r)).format(Number(e))}return!Number.isNaN(Number(e))&&""!==e&&t?.number_format===Ce.none&&Intl?new Intl.NumberFormat("en-US",Oe(e,{...r,useGrouping:!1})).format(Number(e)):"string"==typeof e?e:`${((e,t=2)=>Math.round(e*10**t)/10**t)(e,r?.maximumFractionDigits).toString()}${"currency"===r?.style?` ${r.currency}`:""}`},Oe=(e,t)=>{const r={maximumFractionDigits:2,...t};if("string"!=typeof e)return r;if(!t||void 0===t.minimumFractionDigits&&void 0===t.maximumFractionDigits){const t=e.indexOf(".")>-1?e.split(".")[1].length:0;r.minimumFractionDigits=t,r.maximumFractionDigits=t}return r};var Me=Number.isNaN||function(e){return"number"==typeof e&&e!=e};function Ne(e,t){if(e.length!==t.length)return!1;for(var r=0;r<e.length;r++)if(s=e[r],i=t[r],!(s===i||Me(s)&&Me(i)))return!1;var s,i;return!0}function De(e,t){void 0===t&&(t=Ne);var r=null;function s(){for(var s=[],i=0;i<arguments.length;i++)s[i]=arguments[i];if(r&&r.lastThis===this&&t(s,r.lastArgs))return r.lastResult;var o=e.apply(this,s);return r={lastResult:o,lastArgs:s,lastThis:this},o}return s.clear=function(){r=null},s}const Pe=De((e=>new Intl.DateTimeFormat(e.language,{weekday:"long",month:"long",day:"numeric"}))),Ie=De((e=>new Intl.DateTimeFormat(e.language,{year:"numeric",month:"long",day:"numeric"}))),ze=De((e=>new Intl.DateTimeFormat(e.language,{year:"numeric",month:"numeric",day:"numeric"}))),Re=(e,t)=>Ve(t).format(e),Ve=De((e=>new Intl.DateTimeFormat(e.language,{day:"numeric",month:"short"}))),Fe=De((e=>new Intl.DateTimeFormat(e.language,{month:"long",year:"numeric"}))),He=De((e=>new Intl.DateTimeFormat(e.language,{month:"long"})));De((e=>new Intl.DateTimeFormat(e.language,{year:"numeric"})));const je=De((e=>new Intl.DateTimeFormat(e.language,{weekday:"long"}))),Ue=De((e=>new Intl.DateTimeFormat(e.language,{weekday:"short"})));var Ge;!function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Ge=Ge||(Ge={}));const Le=De((e=>{if(e.time_format===Ge.language||e.time_format===Ge.system){const t=e.time_format===Ge.language?e.language:void 0,r=(new Date).toLocaleString(t);return r.includes("AM")||r.includes("PM")}return e.time_format===Ge.am_pm})),Je=De((e=>new Intl.DateTimeFormat("en"!==e.language||Le(e)?e.language:"en-u-hc-h23",{hour:"numeric",minute:"2-digit",hour12:Le(e)}))),Be=De((e=>new Intl.DateTimeFormat("en"!==e.language||Le(e)?e.language:"en-u-hc-h23",{hour:Le(e)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:Le(e)}))),qe=De((e=>new Intl.DateTimeFormat("en"!==e.language||Le(e)?e.language:"en-u-hc-h23",{weekday:"long",hour:Le(e)?"numeric":"2-digit",minute:"2-digit",hour12:Le(e)}))),We=e=>Ke().format(e),Ke=De((()=>new Intl.DateTimeFormat("en-GB",{hour:"numeric",minute:"2-digit",hour12:!1}))),Ye=De((e=>new Intl.DateTimeFormat("en"!==e.language||Le(e)?e.language:"en-u-hc-h23",{year:"numeric",month:"long",day:"numeric",hour:Le(e)?"numeric":"2-digit",minute:"2-digit",hour12:Le(e)}))),Xe=De((e=>new Intl.DateTimeFormat("en"!==e.language||Le(e)?e.language:"en-u-hc-h23",{year:"numeric",month:"short",day:"numeric",hour:Le(e)?"numeric":"2-digit",minute:"2-digit",hour12:Le(e)}))),Ze=De((e=>new Intl.DateTimeFormat("en"!==e.language||Le(e)?e.language:"en-u-hc-h23",{month:"short",day:"numeric",hour:Le(e)?"numeric":"2-digit",minute:"2-digit",hour12:Le(e)}))),Qe=De((e=>new Intl.DateTimeFormat("en"!==e.language||Le(e)?e.language:"en-u-hc-h23",{year:"numeric",month:"long",day:"numeric",hour:Le(e)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:Le(e)}))),et=De((e=>new Intl.DateTimeFormat("en"!==e.language||Le(e)?e.language:"en-u-hc-h23",{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit",hour12:Le(e)}))),tt=(e,t=2)=>{let r=`${e}`;for(let s=1;s<t;s++)r=parseInt(r)<10**s?`0${r}`:r;return r};const rt={ms:1,s:1e3,min:6e4,h:36e5,d:864e5},st=(e,t)=>function(e){const t=Math.floor(e/1e3/3600),r=Math.floor(e/1e3%3600/60),s=Math.floor(e/1e3%3600%60),i=Math.floor(e%1e3);return t>0?`${t}:${tt(r)}:${tt(s)}`:r>0?`${r}:${tt(s)}`:s>0||i>0?`${s}${i>0?`.${tt(i,3)}`:""}`:null}(parseFloat(e)*rt[t])||"0",it=e=>e.substring(0,e.indexOf(".")),ot=e=>{const t=Math.round(Math.min(Math.max(e,0),255)).toString(16);return 1===t.length?`0${t}`:t},at=e=>`#${ot(e[0])}${ot(e[1])}${ot(e[2])}`,nt=e=>{const[t,r,s]=e,i=Math.max(t,r,s),o=i-Math.min(t,r,s),a=o&&(i===t?(r-s)/o:i===r?2+(s-t)/o:4+(t-r)/o);return[60*(a<0?a+6:a),i&&o/i,i]},ct=e=>{const[t,r,s]=e,i=e=>{const i=(e+t/60)%6;return s-s*r*Math.max(Math.min(i,4-i,1),0)};return[i(5),i(3),i(1)]},lt=e=>ct([e[0],e[1],255]),dt=(e,t,r)=>Math.min(Math.max(e,t),r),ht=e=>{if(e<=66)return 255;return dt(329.698727446*(e-60)**-.1332047592,0,255)},ut=e=>{let t;return t=e<=66?99.4708025861*Math.log(e)-161.1195681661:288.1221695283*(e-60)**-.0755148492,dt(t,0,255)},mt=e=>{if(e>=66)return 255;if(e<=19)return 0;const t=138.5177312231*Math.log(e-10)-305.0447927307;return dt(t,0,255)},pt=e=>{const t=e/100;return[ht(t),ut(t),mt(t)]},gt=(e,t)=>{const r=Math.max(...e),s=Math.max(...t);let i;return i=0===s?0:r/s,t.map((e=>Math.round(e*i)))},ft=e=>Math.floor(1e6/e),_t=(e,t,r)=>{const[s,i,o,a,n]=e,c=ft(t??2700),l=ft(r??6500),d=c-l;let h;try{h=n/(a+n)}catch(b){h=.5}const u=l+h*d,m=u?(p=u,Math.floor(1e6/p)):0;var p;const[g,f,_]=pt(m),y=Math.max(a,n)/255;return gt([s,i,o,a,n],[s+g*y,i+f*y,o+_*y])},yt="unavailable",bt=(vt=[yt,"unknown"],(e,t)=>vt.includes(e,t));var vt;const wt=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater","weather"]),$t=(e,t)=>{if((void 0!==t?t:e?.state)===yt)return"var(--state-unavailable-color)";const r=kt(e,t);return r?(s=r,Array.isArray(s)?s.reverse().reduce(((e,t)=>`var(${t}${e?`, ${e}`:""})`),void 0):`var(${s})`):void 0;var s},xt=(e,t,r)=>{const s=void 0!==r?r:t.state,i=function(e,t){const r=it(e.entity_id),s=void 0!==t?t:e?.state;if(["button","event","infrared","input_button","radio_frequency","scene"].includes(r))return s!==yt;if(bt(s))return!1;if("off"===s&&"alert"!==r)return!1;switch(r){case"alarm_control_panel":return"disarmed"!==s;case"alert":return"idle"!==s;case"cover":case"valve":return"closed"!==s;case"device_tracker":case"person":return"not_home"!==s;case"lawn_mower":return!["docked","paused"].includes(s);case"lock":return"locked"!==s;case"media_player":return"standby"!==s;case"vacuum":return!["idle","docked","paused"].includes(s);case"plant":return"problem"===s;case"group":return["on","home","open","locked","problem"].includes(s);case"timer":return"active"===s;case"camera":return"streaming"===s}return!0}(t,r);return St(e,t.attributes.device_class,s,i)},St=(e,t,r,s)=>{const i=[],o=((e,t="_")=>{const r="àáâäæãåāăąабçćčđďдèéêëēėęěеёэфğǵгḧхîïíīįìıİийкłлḿмñńǹňнôöòóœøōõőоṕпŕřрßśšşșсťțтûüùúūǘůűųувẃẍÿýыžźżз·",s=`aaaaaaaaaaabcccdddeeeeeeeeeeefggghhiiiiiiiiijkllmmnnnnnoooooooooopprrrsssssstttuuuuuuuuuuvwxyyyzzzz${t}`,i=new RegExp(r.split("").join("|"),"g"),o={"ж":"zh","х":"kh","ц":"ts","ч":"ch","ш":"sh","щ":"shch","ю":"iu","я":"ia"};let a;return""===e?a="":(a=e.toString().toLowerCase().replace(i,(e=>s.charAt(r.indexOf(e)))).replace(/[а-я]/g,(e=>o[e]||"")).replace(/(\d),(?=\d)/g,"$1").replace(/[^a-z0-9]+/g,t).replace(new RegExp(`(${t})\\1+`,"g"),"$1").replace(new RegExp(`^${t}+`),"").replace(new RegExp(`${t}+$`),""),""===a&&(a="unknown")),a})(r,"_"),a=s?"active":"inactive";return t&&i.push(`--state-${e}-${t}-${o}-color`),i.push(`--state-${e}-${o}-color`,`--state-${e}-${a}-color`,`--state-${a}-color`),i},kt=(e,t)=>{const r=void 0!==t?t:e?.state,s=it(e.entity_id),i=e.attributes.device_class;if("sensor"===s&&"battery"===i){const e=(e=>{const t=Number(e);if(!isNaN(t))return t>=70?"--state-sensor-battery-high-color":t>=30?"--state-sensor-battery-medium-color":"--state-sensor-battery-low-color"})(r);if(e)return[e]}if("group"===s){const r=(e=>{const t=e.attributes.entity_id||[],r=[...new Set(t.map((e=>it(e))))];return 1===r.length?r[0]:void 0})(e);if(r&&wt.has(r))return xt(r,e,t)}if(wt.has(s))return xt(s,e,t)};var At;!function(e){e[e.TARGET_TEMPERATURE=1]="TARGET_TEMPERATURE",e[e.TARGET_TEMPERATURE_RANGE=2]="TARGET_TEMPERATURE_RANGE",e[e.TARGET_HUMIDITY=4]="TARGET_HUMIDITY",e[e.FAN_MODE=8]="FAN_MODE",e[e.PRESET_MODE=16]="PRESET_MODE",e[e.SWING_MODE=32]="SWING_MODE",e[e.AUX_HEAT=64]="AUX_HEAT",e[e.TURN_OFF=128]="TURN_OFF",e[e.TURN_ON=256]="TURN_ON",e[e.SWING_HORIZONTAL_MODE=512]="SWING_HORIZONTAL_MODE"}(At||(At={})),["auto","heat_cool","heat","cool","dry","fan_only","off"].reduce(((e,t,r)=>(e[t]=r,e)),{});const Et={cooling:"cool",defrosting:"heat",drying:"dry",fan:"fan_only",heating:"heat",idle:"off",off:"off",preheating:"heat"};class Ct{static{Ct.colorCache={},Ct.element=void 0}static _prefixKeys(e){let t={};return Object.keys(e).forEach((r=>{const s=`--${r}`,i=String(e[r]);t[s]=`${i}`})),t}static processTheme(e){let t={},r={},s={},i={};const{modes:o,...a}=e;return o&&(r={...a,...o.dark},t={...a,...o.light}),s=Ct._prefixKeys(t),i=Ct._prefixKeys(r),{themeLight:s,themeDark:i}}static processPalette(e){let t={},r={},s={},i={},o={};return Object.values(e).forEach((e=>{const{modes:i,...o}=e;t={...t,...o},i&&(s={...s,...o,...i.dark},r={...r,...o,...i.light})})),i=Ct._prefixKeys(r),o=Ct._prefixKeys(s),{paletteLight:i,paletteDark:o}}static setElement(e){Ct.element=e}static calculateColor(e,t,r){const s=Object.keys(t).map((e=>Number(e))).sort(((e,t)=>e-t));let i,o,a;const n=s.length;if(e<=s[0])return t[s[0]];if(e>=s[n-1])return t[s[n-1]];for(let c=0;c<n-1;c++){const n=s[c],l=s[c+1];if(e>=n&&e<l){if([i,o]=[t[n],t[l]],!r)return i;a=Ct.calculateValueBetween(n,l,e);break}}return Ct.getGradientValue(i,o,a)}static calculateColor2(e,t,r,s,i){const o=Object.keys(t).map((e=>Number(e))).sort(((e,t)=>e-t));let a,n,c;const l=o.length;if(e<=o[0])return t[o[0]];if(e>=o[l-1])return t[o[l-1]];for(let d=0;d<l-1;d++){const l=o[d],h=o[d+1];if(e>=l&&e<h){if([a,n]=[t[l].styles[r][s],t[h].styles[r][s]],!i)return a;c=Ct.calculateValueBetween(l,h,e);break}}return Ct.getGradientValue(a,n,c)}static calculateValueBetween(e,t,r){return(Math.min(Math.max(r,e),t)-e)/(t-e)}static getColorVariable(e){const t=e.substr(4,e.length-5);return window.getComputedStyle(Ct.element).getPropertyValue(t)}static getGradientValue(e,t,r){const s=Ct.colorToRGBA(e),i=Ct.colorToRGBA(t),o=1-r,a=r,n=Math.floor(s[0]*o+i[0]*a),c=Math.floor(s[1]*o+i[1]*a),l=Math.floor(s[2]*o+i[2]*a),d=Math.floor(s[3]*o+i[3]*a);return`#${Ct.padZero(n.toString(16))}${Ct.padZero(c.toString(16))}${Ct.padZero(l.toString(16))}${Ct.padZero(d.toString(16))}`}static padZero(e){return e.length<2&&(e=`0${e}`),e.substr(0,2)}static colorToRGBA(e){if(null==e)return[0,0,0,0];const t=Ct.colorCache[e];if(t)return t;let r=e;"var"===e.substr(0,3).valueOf()&&(r=Ct.getColorVariable(e));const s=window.document.createElement("canvas");s.width=s.height=1;const i=s.getContext("2d");i.clearRect(0,0,1,1),i.fillStyle=r,i.fillRect(0,0,1,1);const o=[...i.getImageData(0,0,1,1).data];return Ct.colorCache[e]=o,o}static hslToRgb(e){const t=e.h/360,r=e.s/100,s=e.l/100;let i,o,a;if(0===r)i=o=a=s;else{function n(e,t,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?e+6*(t-e)*r:r<.5?t:r<2/3?e+(t-e)*(2/3-r)*6:e}const c=s<.5?s*(1+r):s+r-s*r,l=2*s-c;i=n(l,c,t+1/3),o=n(l,c,t),a=n(l,c,t-1/3)}return i*=255,o*=255,a*=255,{r:i,g:o,b:a}}static computeColor(e){if(e.attributes?.hvac_action){const t=e.attributes.hvac_action;return t in Et?$t(e,Et[t]):void 0}if(e.attributes?.rgb_color)return`rgb(${e.attributes.rgb_color.join(",")})`;const t=$t(e);return t||void 0}static getHaEntityIconStyle(e){const t=Ct.computeColor(e),r=(e=>{if(e.attributes.brightness&&"plant"!==it(e.entity_id))return`brightness(${(e.attributes.brightness+245)/5}%)`;return""})(e);return{color:t??"var(--state-icon-color)",fill:"currentColor",...r?{filter:r}:{}}}}const Tt=200;class Ot{static calculateValueBetween(e,t,r){return isNaN(r)?0:r?(Math.min(Math.max(r,e),t)-e)/(t-e):0}static calculateSvgCoordinate(e,t){return e/100*Tt+(t-100)}static calculateSvgDimension(e){return e/100*Tt}static getLovelace(){let e=window.document.querySelector("home-assistant");if(e=e&&e.shadowRoot,e=e&&e.querySelector("home-assistant-main"),e=e&&e.shadowRoot,e=e&&e.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"),e=e&&e.shadowRoot||e,e=e&&e.querySelector("ha-panel-lovelace"),e=e&&e.shadowRoot,e=e&&e.querySelector("hui-root"),e){console.log("getLoveLace, root",e,e.lovelace);const t=e.lovelace;return t.current_view=e.___curView,t}return null}}class Mt{static mergeDeep(...e){const t=e=>e&&"object"==typeof e;return e.reduce(((e,r)=>(Object.keys(r).forEach((s=>{const i=e[s],o=r[s];Array.isArray(i)&&Array.isArray(o)?e[s]=i.concat(...o):t(i)&&t(o)?e[s]=this.mergeDeep(i,o):e[s]=o})),e)),{})}}console.info("%c FLEX-HORSESHOE-CARD %c Version 5.4.5-dev.1 ","color: white; font-weight: bold; background: darkgreen","color: darkgreen; font-weight: bold; background: white");const Nt=200,Dt={xpos:50,ypos:50,horseshoe_radius:90,tickmarks_radius:86},Pt={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed"},It={min:0,max:100,width:6,color:"var(--primary-background-color)"},zt={width:12,color:"var(--primary-color)"},Rt={action:"more-info"};class Vt extends ne{constructor(){if(super(),Ct.setElement(this),this.cardId=Math.random().toString(36).substr(2,9),this._hass=void 0,this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.viewBoxSize=Nt,this.viewBox={width:Nt,height:Nt},this.colorStops={},this.animations={},this.animations.vlines={},this.animations.hlines={},this.animations.circles={},this.animations.icons={},this.animations.iconsIcon={},this.animations.names={},this.animations.areas={},this.animations.states={},this.resolvedEntityConfigs=[],this.colorCache={},this.isAndroid=!1,this.isSafari=!1,this.iOS=!1,this.resolvedVariables={},this.iconCache={},this.iconsSvg=[],this.pendingIconPath=[],this.iconsId=[],this.bar_mode="normal",this.dev={debug:!1},this.isAndroid=!!window.navigator.userAgent.match(/Android/),!this.isAndroid){const e=window.navigator.userAgent||"",t=e.toLowerCase(),r=window.navigator.platform||"",s=(/iPad|iPhone|iPod/.test(e)||"MacIntel"===r&&window.navigator.maxTouchPoints>1)&&!window.MSStream,i=e.match(/Version\/(\d+)(?:\.[\d.]+)?.*Safari/i),o=i?Number(i[1]):void 0,a=t.match(/\bos\s+(\d+)(?:[._]\d+)*.*like safari/),n=t.match(/\bios\s+(\d+)(?:[._]\d+)*/),c=n?Number(n[1]):a?Number(a[1]):void 0,l=Number.isFinite(o),d=Number.isFinite(c)&&t.includes("like safari"),h=l?o:d?c:void 0;this.iOS=s,this.isSafari=Number.isFinite(h),this.safariMajorVersion=h,this.isHomeAssistantLikeSafari=d,this.isRealSafari=l,this.isSafari14=this.isSafari&&14===h,this.isSafari15=this.isSafari&&15===h,this.isSafari16=this.isSafari&&16===h,this.isSafari17=this.isSafari&&17===h,this.isSafari18=this.isSafari&&18===h,this.isSafari26=this.isSafari&&26===h,this.isSafari27=this.isSafari&&27===h,this.isSafari28=this.isSafari&&28===h,this.isSafari29=this.isSafari&&29===h,this.isSafari30=this.isSafari&&30===h,this.isSafariGte16=this.isSafari&&h>=16,this.dev?.debug&&console.log("browser detection",{ua:e,isAndroid:this.isAndroid,isIOS:this.iOS,isSafari:this.isSafari,isRealSafari:this.isRealSafari,isHomeAssistantLikeSafari:this.isHomeAssistantLikeSafari,safariMajorVersion:this.safariMajorVersion,isSafariGte16:this.isSafariGte16}),this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config)}}static get styles(){return o`
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
    `}_resolveEntityConfigs(e){return e?.dev?.debug&&console.log("resolving entity config for",e?.entities),e?.entities?.map(((e,t)=>{const r={entity_index:t};return ye.getJsTemplateOrValue(r,e)}))??[]}set hass(e){this._hass=e,ye.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes});let t=!1;if(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.resolvedEntityConfigs.forEach(((r,s)=>{const i=e.states[r.entity];if(!i)return;this.entities[s]=i;const o=this._buildState(i.state,r);if(o!==this.entitiesStr[s]&&(this.entitiesStr[s]=o,t=!0),r.attribute&&Object.prototype.hasOwnProperty.call(i.attributes,r.attribute)){const e=this._buildState(i.attributes[r.attribute],r);e!==this.attributesStr[s]&&(this.attributesStr[s]=e,t=!0)}})),!t)return;this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.horseshoes=this.horseshoes.map((e=>{const t=e.entity_index??0,r=this.resolvedEntityConfigs[t],s=this.entities[t];if(!s||!r)return e;let i=s.state;r.attribute&&void 0!==s.attributes[r.attribute]&&(i=s.attributes[r.attribute]),e.xpos=e?.xpos??50,e.ypos=e?.ypos??50,e.radius=e?.radius??45,e.tickmarks_radius=e?.tickmarks_radius??43;const o=ye.getJsTemplateOrValue({entity_index:t},e.horseshoe_scale),a=o?.min??0,n=o?.max??100;let c,l,d=!1;if("bidirectional"===(e.bar_mode||"normal")){const t=e.horseshoePathLength,r=Number(i);if(r>=0){const s=Math.min(Ct.calculateValueBetween(0,n,r),1)*(t/2);c=`${s} ${e.circlePathLength-s}`,l=void 0,d=!1}else{const s=(1-Math.min(Ct.calculateValueBetween(a,0,r),1))*(t/2);c=`${s} ${e.circlePathLength-s}`,l=""+-(e.circlePathLength-s),d=!0}}else{c=`${Math.min(Ct.calculateValueBetween(a,n,i),1)*e.horseshoePathLength} ${10*e.radiusSize}`,l=void 0,d=!1}const h=Math.min(Ct.calculateValueBetween(a,n,i),1),u=e.show.horseshoe_style;let m=e.color0,p=e.color1,g=e.color1_offset,f=e.angleCoords,_=e.stroke_color;if("fixed"===u)_=e.horseshoe_state.color,m=e.horseshoe_state.color,p=e.horseshoe_state.color,g="0%";else if("autominmax"===u){const t=this._calculateStrokeColor(i,e.colorStopsMinMax,!0);m=t,p=t,g="0%"}else if("colorstop"===u||"colorstopgradient"===u){const t=this._calculateStrokeColor(i,e.colorStops,"colorstopgradient"===u);m=t,p=t,g="0%"}else"lineargradient"===u&&(f={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},g=`${Math.round(100*(1-h))}%`);return{...e,horseshoe_scale:{...e.horseshoe_scale,...o},dashArray:c,dashOffset:l,bidirectional_negative:d,stroke_color:_,color0:m,color1:p,color1_offset:g,angleCoords:f}}));const r=this.horseshoes[0];this.dashArray=r.dashArray,this.dashOffset=r.dashOffset,this._bidirectional_negative=r.bidirectional_negative,this.stroke_color=r.stroke_color,this.color0=r.color0,this.color1=r.color1,this.color1_offset=r.color1_offset,this.angleCoords=r.angleCoords,this.config.animations&&Object.keys(this.config.animations).map((e=>{const t=e.substr(Number(e.indexOf(".")+1));return this.config.animations[e].map((e=>this.entities[t].state.toLowerCase()===e.state.toLowerCase()&&(e.vlines&&e.vlines.forEach((e=>this._updateAnimationStyles("vlines",e))),e.hlines&&e.hlines.forEach((e=>this._updateAnimationStyles("hlines",e))),e.circles&&e.circles.forEach((e=>this._updateAnimationStyles("circles",e))),e.icons&&e.icons.forEach((e=>{const t=e.animation_id;this.animations.icons[t]&&e.reuse||(this.animations.icons[t]={},this.animations.iconsIcon[t]={});const r=ye.getJsTemplateOrValue(e,e.styles),s=_e.toStyleDict(r);this.animations.icons[t]={...this.animations.icons[t],...s},this.animations.iconsIcon[t]=ye.getJsTemplateOrValue(e,e.icon)})),e.states&&e.states.forEach((e=>this._updateAnimationStyles("states",e))),!0))),!0})),ye.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),this.requestUpdate()}_updateAnimationStyles(e,t){const r=t.animation_id;if(null==r)return;const s=ye.getJsTemplateOrValue(t,t.styles),i=_e.toStyleDict(s);this.animations[e][r]={...t.reuse?this.animations[e][r]??{}:{},...i}}_prepareItemColorStops(e){["states","names","areas","circles","hlines","vlines","icons","horseshoes"].forEach((t=>{const r=e.layout?.[t];Array.isArray(r)&&r.forEach((e=>{if(!e.color_stops)return;const t=ye.getJsTemplateOrValue(e,e.color_stops,{resolveKeys:!0});e._colorStops=be.normalize(t)}))}))}_calculateSvgCoordinatesInGroup(e){const t={xpos:Ot.calculateSvgDimension(e.xpos),ypos:Ot.calculateSvgDimension(e.ypos)},r=this.config.layout?.groups?.[e.group];if(!e.group||!r)return t;return{xpos:Ot.calculateSvgDimension(r.xpos+e.xpos-50),ypos:Ot.calculateSvgDimension(r.ypos+e.ypos-50)}}_computeGroupDimensions(e){const t=e.layout?.groups;t&&Object.entries(t).forEach((([e,t])=>{t.svg={xpos:Ot.calculateSvgDimension(t.xpos),ypos:Ot.calculateSvgDimension(t.ypos)}}))}_computeSvgDimensions(e){const t=e.layout;t?.names&&t.names.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.states&&t.states.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.areas&&t.areas.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.icons&&t.icons.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.hlines&&t.hlines.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.length=Ot.calculateSvgDimension(e.length)})),t?.vlines&&t.vlines.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.length=Ot.calculateSvgDimension(e.length)})),t?.circles&&t.circles.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.radius=Ot.calculateSvgDimension(e.radius)})),this?.horseshoes&&this.horseshoes.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.radius=Ot.calculateSvgDimension(e.radius),e.svg.tickmarksRadius=Ot.calculateSvgDimension(e.tickmarks_radius),e.svg.rotateX=e.svg.xpos,e.svg.rotateY=e.svg.ypos}))}_resolveSameAsItems(e){return e.map(((e,t,r)=>{if(void 0===e.same_as)return e;const s=r[e.same_as];if(!s)throw new Error(`same_as '${e.same_as}' not found for item ${t}`);const{same_as:i,...o}=e;return Mt.mergeDeep(s,o)}))}_resolveSectionSameAs(e){["horseshoes","states","names","areas","circles","hlines","vlines","icons"].forEach((t=>{const r=e.layout?.[t];Array.isArray(r)&&(e.layout[t]=this._resolveSameAsItems(r))}))}setConfig(e){try{if(!(e=JSON.parse(JSON.stringify(e))).entities)throw Error("No entities defined");if(!e.layout)throw Error("No layout defined");this._resolveSectionSameAs(e),ye.setContext({hass:this._hass,config:e,entities:this.entities,horseshoes:this.horseshoes});const t=this._resolveEntityConfigs(e);if(t){if("sensor"!==it(t[0].entity)&&t[0].attribute&&!isNaN(t[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}t.forEach((e=>{e.tap_action||(e.tap_action={...Rt})}));const r={texts:[],card_filter:"card--filter-none",bar_mode:e.bar_mode||"normal",...e,show:{...Pt,...e.show},horseshoe_position:{...Dt,...e?.horseshoe_position},horseshoe_scale:{...It,...e.horseshoe_scale},horseshoe_state:{...zt,...e.horseshoe_state}},s=Array.isArray(r.layout.horseshoes)?r.layout.horseshoes.map(((e,t)=>({...r,...e,entity_index:e.entity_index??t}))):[{...r,entity_index:0}];if(this.horseshoes=s.map(((e,t)=>{const r=e.entity_index??t,s={...Pt,...e.show??{}},i={...It,...e.horseshoe_scale??{}},o={...zt,...e.horseshoe_state??{}},a=e.xpos??e.horseshoe_position?.xpos??e.horseshoe_position?.cx??Dt.xpos??Dt.cx??50,n=e.ypos??e.horseshoe_position?.ypos??e.horseshoe_position?.cy??Dt.ypos??Dt.cy??50;if(!i.min&&0!==i.min||!i.max&&0!==i.max)throw Error(`No horseshoe min/max for scale defined for horseshoe ${t}`);const c=e.color_stops;if(!c)throw console.warn(`No color_stops defined for horseshoe ${t}`),Error(`No color_stops defined for horseshoe ${t}`);const l=ye.getJsTemplateOrValue({entity_index:r},c,{resolveKeys:!0}),d=be.normalize(l),h=d.colors;if(!h||h.length<2)throw Error(`No color_stops defined or not at least two colorstops for horseshoe ${t}`);const u=h[0],m=h[h.length-1];let p,g,f=be.normalize({});u&&m&&(f=be.normalize({[i.min]:u.color,[i.max]:m.color}),p=u.color,g=m.color);const _=e.radius??45,y=e.tickmarks_radius??43,b=e.arc_degrees??260,v=Ot.calculateSvgDimension(_),w=Ot.calculateSvgDimension(y),$=2*b/360*Math.PI*v,x=2*Math.PI*v;return{...e,entity_index:r,show:s,fill:e.fill??"rgba(0, 0, 0, 0)",xpos:a,ypos:n,bar_mode:e.bar_mode??"normal",horseshoe_scale:i,horseshoe_state:o,radius:_,tickmarks_radius:y,arc_degrees:b,radiusSize:v,tickmarksRadiusSize:w,horseshoePathLength:$,circlePathLength:x,color_stops:c,colorStops:d,colorStopsMinMax:f,color0:p,color1:g,angleCoords:{x1:"0%",y1:"0%",x2:"100%",y2:"0%"},color1_offset:"0%",dashArray:this.dashArray,dashOffset:this.dashOffset,bidirectional_negative:this._bidirectional_negative}})),!this.horseshoes.length)throw Error("No horseshoes defined");const i=this.horseshoes[0];this.colorStops=i.colorStops,this.colorStopsMinMax=i.colorStopsMinMax,this.color0=i.color0,this.color1=i.color1,this.angleCoords=i.angleCoords,this.color1_offset=i.color1_offset,this._prepareItemColorStops(r),this.config=r,this.bar_mode=r.bar_mode||"normal",this.config.layout?.icons&&this.config.layout.icons.forEach(((e,t)=>{this.iconsId[t]=Math.random().toString(36).substr(2,9)})),this.aspectratio=(this.config.layout.aspectratio||this.config.aspectratio||"1/1").trim();const o=this.aspectratio.split("/");this.viewBox||(this.viewBox={}),this.viewBox.width=o[0]*Tt,this.viewBox.height=o[1]*Tt,this._computeGroupDimensions(this.config),this._computeSvgDimensions(this.config),ye.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes})}catch(t){throw console.error("[FHC setConfig] CONFIG ERROR",{error:t,message:t?.message,stack:t?.stack,config:e}),t}}_getItemStateValue(e={}){const t=e.entity_index??0,r=this.entities?.[t],s=this.config?.entities?.[t];if(!r)return;const i=s?.attribute;return i&&r.attributes&&void 0!==r.attributes[i]?r.attributes[i]:r.state}_getItemColorFromStops(e={}){if(!e._colorStops)return;const t=this._getItemStateValue(e),r=Number(t);return Number.isFinite(r)?this._calculateStrokeColor(r,e._colorStops,!0===e.colorstop_gradient):void 0}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback()}render({config:e}=this){const t=ye.getJsTemplateOrValue({entity_index:0},e?.styles),r=_e.toStyleDict(t);return U`
      <ha-card @click=${e=>this.handlePopup(e,this.entities[0])} style=${me(r)}>
        <div class="container" id="container">${this._renderSvg()}</div>

        <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
          ${this.horseshoes?.map(((e,t)=>G`
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
    `}_renderTickMarks(e){if(!1===e.show?.scale_tickmarks)return G``;const t=e.horseshoe_scale,r=Number(t.min),s=Number(t.max),i=s-r;if(!i)return G``;const o={entity_index:e.entity_index},a=ye.getJsTemplateOrValue(o,e?.horseshoe_tickmarks?.styles),n=_e.toStyleDict(a),c=e.svg.xpos,l=e.svg.ypos,d={transformOrigin:`${c}px ${l}px`};void 0!==e?.horseshoe_tickmarks?.fill&&(d.fill=e.horseshoe_tickmarks.fill);const h=t.color||"var(--primary-background-color)";d.fill=h;const u={...n,...d},m=t.ticksize||i/10,p=e.arc_degrees||260,g=t.width?t.width/2:3,f=r%m,_=r+(0===f?0:m-f);if(_>s)return G``;const y=Math.floor((s-_)/m)+1,b=Array.from({length:y},((t,s)=>{const o=(p/2-(_+s*m-r)/i*p)*Math.PI/180;return G`
      <circle
        cx="${c-Math.sin(o)*e.tickmarksRadiusSize}"
        cy="${l-Math.cos(o)*e.tickmarksRadiusSize}"
        r="${g}"
        style=${me(u)}>
      </circle>
    `}));return G`${b}`}_renderTickMarksV2(e){if(!e?.show?.scale_tickmarks)return G``;const t=e.xpos??50,r=e.ypos??50,s=2*t,i=2*r,o=e.horseshoe_scale,a=o.color||"var(--primary-background-color)",n=o.ticksize||(o.max-o.min)/10,c=e.arc_degrees||260,l=o.min%n,d=o.min+(0===l?0:n-l),h=(d-o.min)/(o.max-o.min)*c,u=(o.max-d)/n,m=(c-h)/u;let p=Math.floor(u);Math.floor(p*n+d)<=o.max&&(p+=1);const g=o.width?o.width/2:3,f=Array.from({length:p},((t,r)=>{const o=h+(360-r*m-230)*Math.PI/180;return G`
      <circle
        cx="${s-Math.sin(o)*e.tickmarksRadiusSize}"
        cy="${i-Math.cos(o)*e.tickmarksRadiusSize}"
        r="${g}"
        fill="${a}">
      </circle>
    `}));return G`${f}`}_renderSvg(){const e=this.config.card_filter?this.config.card_filter:"card--filter-none";return G`
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
      `}_renderHorseShoes(){return G`
    ${this.horseshoes?.map(((e,t)=>this._renderHorseShoe(e,t)))??G``}
  `}_renderHorseShoe(e,t){if(!1===e.show?.horseshoe)return G``;const r=e.svg.xpos,s=e.svg.ypos,i=e.svg.rotateX,o=e.svg.rotateY,a=e.bar_mode||"normal",n=`${e.svg.radius}px`,c=e.horseshoe_scale.color||"#000000",l=e.horseshoe_scale.width||6,d=e.horseshoe_state.width||12,h=-90-(e.arc_degrees??260)/2,u=`${e.horseshoePathLength},${e.circlePathLength}`,m=`horseshoe__gradient-${this.cardId}-${t}`,p={entity_index:e.entity_index},g=ye.getJsTemplateOrValue(p,e.horseshoe_scale?.styles),f=_e.toStyleDict(g),_={stroke:c,strokeWidth:l,strokeDasharray:u,strokeLinecap:"round"};void 0!==e.horseshoe_scale?.fill&&(_.fill=e.horseshoe_scale.fill);const y={fill:"none","stroke-linecap":"round",...f,..._},b=ye.getJsTemplateOrValue(p,e.horseshoe_state?.styles),v=_e.toStyleDict(b),w={stroke:`url('#${m}')`,strokeDasharray:e.dashArray,strokeDashoffset:e.dashOffset,strokeWidth:d};void 0!==e.horseshoe_state?.fill&&(w.fill=e.horseshoe_state.fill);const $={fill:"none",transition:"all 2.5s ease-out",strokeLinecap:"round",...v,...w},x=e.rotate?`rotate(${e.rotate})`:"";return"bidirectional"===a?e.bidirectional_negative?G`
      <g id="horseshoe__svg__group-${t}" class="horseshoe__svg__group"
        transform="${x} ${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
          <circle id="horseshoe__scale-${t}" class="horseshoe__scale" cx="${r}px" cy="${s}px" r="${n}"
            style=${me(y)}  
            transform="rotate(${h} ${i} ${o})"/>
          <circle id="horseshoe__state__value-${t}" class="horseshoe__state__value" cx="${r}px" cy="${s}px" r="${n}"
            transform="rotate(-90 ${i} ${o})"
            style=${me($)} />
          ${this._renderTickMarks(e)}
        </g>
      `:G`
      <g id="horseshoe__svg__group-${t}" class="horseshoe__svg__group"
        transform="${x} ${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
        <circle id="horseshoe__scale-${t}" class="horseshoe__scale" cx="${r}px" cy="${s}px" r="${n}"
            style=${me(y)}  
          transform="rotate(${h} ${i} ${o})"/>
        <circle id="horseshoe__state__value-${t}" class="horseshoe__state__value" cx="${r}px" cy="${s}px" r="${n}"
          transform="rotate(-90 ${i} ${o})"
            style=${me($)} />
        ${this._renderTickMarks(e)}
      </g>
    `:G`
      <g id="horseshoe__svg__group-${t}" class="horseshoe__svg__group"
        transform="${x} ${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
      <circle id="horseshoe__scale-${t}" class="horseshoe__scale" cx="${r}px" cy="${s}px" r="${n}"
        style=${me(y)}
        transform="rotate(${h} ${i} ${o})"/>
      <circle id="horseshoe__state__value-${t}" class="horseshoe__state__value" cx="${r}px" cy="${s}px" r="${n}"
        transform="rotate(${h} ${i} ${o})"
        style=${me($)} />
      ${this._renderTickMarks(e)}
    </g>
  `}_renderEntityName(e){const t=e.entity_index??0,r=ye.getJsTemplateOrValue(e,e.styles),s={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",..._e.toStyleDict(r)},i={...this.animations?.names?.[e.animation_id]??{}},o=this._getItemColorFromStops(e);o&&(i.stroke=o);const a={...s,...i},n=this.textEllipsis(this._buildName(this.entities[e.entity_index],this.resolvedEntityConfigs[e.entity_index]),e?.max_characters??e?.ellipsis);return G`
    <g
            transform="${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
        <text
          @click=${e=>this.handlePopup(e,this.entities[t])}
          class="entity__name">
            <tspan
              class="entity__name"
              x="${e.svg.xpos}"
              y="${e.svg.ypos}"
              style=${me(a)}>
              ${n}</tspan>
        </text>
        </g>
      `}_renderEntityNames(){const{layout:e}=this.config;if(!e?.names)return G``;const t=e.names.map((e=>this._renderEntityName(e)));return G`${t}`}_renderEntityArea(e){const t=e.entity_index??0,r=ye.getJsTemplateOrValue(e,e.styles),s={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",..._e.toStyleDict(r)},i={..._e.toStyleDict(this.animations?.areas?.[e.animation_id]??{})},o=this._getItemColorFromStops(e);o&&(i.stroke=o);const a={...s,...i},n=this.textEllipsis(this._buildArea(this.entities[e.entity_index],this.resolvedEntityConfigs[e.entity_index]),e?.max_characters??e?.ellipsis);return G`
    <g
            transform="${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
        >
    <text
          @click=${e=>this.handlePopup(e,this.entities[t])}
          class="entity__area">
            <tspan
              class="entity__area"
              x="${e.svg.xpos}"
              y="${e.svg.ypos}"
              style=${me(a)}>
              ${n}</tspan>
        </text>
        </g>
      `}_renderEntityAreas(){const{layout:e}=this.config;if(!e?.areas)return G``;const t=e.areas.map((e=>this._renderEntityArea(e)));return G`${t}`}_getGroupScaleTransform(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;if(!t?.scale&&!e?.flip_x&&!e?.flip_y)return"";const r=t?.scale?.x??t?.scale??1,s=t?.scale?.y??t?.scale??1;return`scale(${r*("x"===e?.flip||"both"===e?.flip?-1:1)}, ${s*("y"===e?.flip||"both"===e?.flip?-1:1)})`}_getGroupScaleTransformV1(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;if(!t?.scale)return"";return`scale(${t.scale?.x??t.scale}, ${t.scale?.y??t.scale})`}_getGroupScaleStyle(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;return t?.scale&&t.svg?`transform-origin:${t.svg.xpos}px ${t.svg.ypos}px; transform-box:view-box;`:""}_renderEntityState(e){if(!e)return G``;const t=e.entity_index??0,r=e.svg.xpos?e.svg.xpos:"",s=e.svg.ypos?e.svg.ypos:"",i=e.dx?e.dx:"0",o=e.dy?e.dy:"0",a=ye.getJsTemplateOrValue(e,e.styles),n=_e.toStyleDict(a),c=e.uom??{},l=ye.getJsTemplateOrValue(e,c.styles),d=_e.toStyleDict(l),h=c.dx??"0",u=c.dy??"-0.45";let m={};this.animations?.states?.[e.animation_id]&&(m={...this.animations.states[e.animation_id]});const p=this._getItemColorFromStops(e);p&&(m.fill=p);const g={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...n,...m},f=g["font-size"];let _=.5,y="em";const b=String(f).match(/\D+|\d*\.?\d+/g);2===b?.length?(_=.6*Number(b[0]),y=b[1]):console.error("Cannot determine font-size for state",f);const v={"font-size":`${_}${y}`},w={...g,opacity:"0.7",...v,...d},$=this.entities[t],x=this.resolvedEntityConfigs[t]??{},S=this._buildStateText($,x),k=this._buildUom($,x);return G`
      <g 
    transform="${this._getGroupScaleTransform(e)}"
    style="${this._getGroupScaleStyle(e)}"
          >
    <text @click=${e=>this.handlePopup(e,this.entities[t])}>
        <tspan
          class="state__value"
          x="${r}"
          y="${s}"
          dx="${i}em"
          dy="${o}em"
          style=${me(g)}
        >${S}</tspan><tspan
          class="state__uom"
          dx="${h}em"
          dy="${u}em"
          style=${me(w)}
        >${k}</tspan>
      </text>
      </g>
    `}formatStateString(e,t){const r=this._hass.selectedLanguage||this._hass.language;let s={};if(s.language=r,["relative","total","datetime","datetime-short","datetime-short_with-year","datetime_seconds","datetime-numeric","date","date_month","date_month_year","date-short","date-numeric","date_weekday","date_weekday_day","date_weekday-short","time","time-24h","time-24h_date-short","time_weekday","time_seconds"].includes(t.format)){const i=new Date(e);if(!(i instanceof Date)||isNaN(i.getTime()))return e;let o;switch(t.format){case"relative":const e=ge(i,new Date);o=new Intl.RelativeTimeFormat(r,{numeric:"auto"}).format(e.value,e.unit);break;case"total":case"precision":o="Not Yet Supported";break;case"datetime":o=((e,t)=>Ye(t).format(e))(i,s);break;case"datetime-short":o=((e,t)=>Ze(t).format(e))(i,s);break;case"datetime-short_with-year":o=((e,t)=>Xe(t).format(e))(i,s);break;case"datetime_seconds":o=((e,t)=>Qe(t).format(e))(i,s);break;case"datetime-numeric":o=((e,t)=>et(t).format(e))(i,s);break;case"date":o=((e,t)=>Ie(t).format(e))(i,s);break;case"date_month":o=((e,t)=>He(t).format(e))(i,s);break;case"date_month_year":o=((e,t)=>Fe(t).format(e))(i,s);break;case"date-short":o=Re(i,s);break;case"date-numeric":o=((e,t)=>ze(t).format(e))(i,s);break;case"date_weekday":o=((e,t)=>je(t).format(e))(i,s);break;case"date_weekday-short":o=((e,t)=>Ue(t).format(e))(i,s);break;case"date_weekday_day":o=((e,t)=>Pe(t).format(e))(i,s);break;case"time":o=((e,t)=>Je(t).format(e))(i,s);break;case"time-24h":o=We(i);break;case"time-24h_date-short":const t=ge(i,new Date);o=["second","minute","hour"].includes(t.unit)?We(i):Re(i,s);break;case"time_weekday":o=((e,t)=>qe(t).format(e))(i,s);break;case"time_seconds":o=((e,t)=>Be(t).format(e))(i,s)}return o}return isNaN(parseFloat(e))||!isFinite(e)?e:"brightness"===t.format||"brightness_pct"===t.format?`${Math.round(e/255*100)} %`:"duration"===t.format?st(e,"s"):void 0}_buildStateText(e,t={}){if(!e)return"";const r=e.entity_id,s=this._hass.entities?.[r],i=this._hass.states?.[r],o=it(r);let a=t.attribute?e.attributes?.[t.attribute]:e.state;if(a=this._buildState(a,t),[void 0,"undefined"].includes(a))return"";void 0!==t.format&&void 0!==a&&(a=this.formatStateString(a,t));const n=t.locale_tag?`${t.locale_tag}${String(a).toLowerCase()}`:void 0;if(a&&isNaN(a)&&(!t.secondary_info||t.attribute)&&(a=n&&this._hass.localize(n)||s?.translation_key&&this._hass.localize(`component.${s.platform}.entity.${o}.${s.translation_key}.state.${a}`)||i?.attributes?.device_class&&this._hass.localize(`component.${o}.entity_component.${i.attributes.device_class}.state.${a}`)||this._hass.localize(`component.${o}.entity_component._.state.${a}`)||a,a=this.textEllipsis?.(a,this.config?.show?.ellipsis)??a),["undefined","unknown","unavailable","-ua-"].includes(a)&&(a=this._hass.localize(`state.default.${a}`)),!isNaN(a)){let e={};e=Oe(a,e),void 0!==t.decimals&&(e.maximumFractionDigits=t.decimals,e.minimumFractionDigits=e.maximumFractionDigits),a=Te(a,this._hass.locale,e)}return a}_renderEntityStates(){const{layout:e}=this.config;if(!e)return;if(!e.states)return;const t=e.states.map((e=>G`
            ${this._renderEntityState(e)}
          `));return G`${t}`}computeEntityColor(e){if(!e||"off"===e.state||"unavailable"===e.state||"unknown"===e.state)return"var(--state-icon-color)";const t=e.state;if(!isNaN(t)||t.endsWith("W")||t.endsWith("kWh")||t.endsWith("V"))return"var(--state-icon-color)";const r=e.entity_id.split(".")[0],s=e.attributes.device_class;if("sensor"===r)return"var(--state-icon-color)";if("light"===r&&e.attributes.rgb_color&&"on"===t){const[t,r,s]=e.attributes.rgb_color;return`rgb(${t}, ${r}, ${s})`}return"binary_sensor"===r&&s&&"on"===t?`var(--state-binary_sensor-${s}-on-color, var(--state-icon-active-color))`:"climate"===r?`var(--state-climate-${t}-color, var(--state-icon-active-color))`:"on"===t?`var(--state-${r}-active-color, var(--state-${r}-color, var(--state-icon-active-color)))`:"var(--state-icon-color)"}_renderIcon(e,t){if(!e)return;e.entity=e.entity?e.entity:0,this.iconCache||={},this.iconsSvg||=[],this.pendingIconPath||=[];const r=12*(e.icon_size?e.icon_size:e.size?e.size:2),s=e.svg.xpos,i=e.svg.ypos,o=e.align?e.align:"center",a="center"===o?.5:"start"===o?-1:1;let n=s-r*a,c=i-r*a,l=r;const d=e.entity_index??0,h=this.entities[d],u=Ct.getHaEntityIconStyle(h),m={};m.fill=u.fill,m.color=u.color,m.filter=u.filter;const p=ye.getJsTemplateOrValue(e,e.styles);let g=_e.toStyleDict(p);const f=this.animations?.icons?.[e.animation_id]??{},_=this._getItemColorFromStops(e);_&&(g.fill=_),g={...m,...g,...f};const y=this._buildIcon(this.entities[d],this.resolvedEntityConfigs[d],this.animations?.iconsIcon?.[e.animation_id]);if(this.iconCache[y])this.iconsSvg[t]=this.iconCache[y];else if(this.iconsSvg[t]=void 0,this.pendingIconPath[t]!==y){this.pendingIconPath[t]=y;let e=0;const r=40,s=50,i=()=>{if(this.pendingIconPath[t]!==y)return;const o=this._getRenderedHaIconPath(t);if(o)return this.iconsSvg[t]=o,this.iconCache[y]=o,this.pendingIconPath[t]=void 0,void this.requestUpdate();e+=1,e>=r?this.pendingIconPath[t]=void 0:window.setTimeout(i,s)};(this?.updateComplete&&"function"==typeof this.updateComplete.then||this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((e=>window.requestAnimationFrame(e)))).then((()=>{window.setTimeout(i,0)}))}const b=this.iconsSvg[t];if(b){const o=s-r*a,n=i-.5*r-.25*r,c=r/24;return G`
      <g 
    transform="${this._getGroupScaleTransform(e)}"
    style="${this._getGroupScaleStyle(e)}"
          >
      <g
        id="icon-rendered-${this.iconsId[t]}"
        style="${me(g)}"
        x="${o}px"
        y="${n}px"
        transform-origin="${s} ${i}"
        @click=${t=>this.handlePopup(t,this.entities[e.entity_index])}
      >
        <rect
          x="${o}px"
          y="${n}px"
          height="${r}px"
          width="${r}px"
          stroke-width="0px"
          fill="rgba(0,0,0,0)"
        ></rect>

        <path
          d="${b}"
          transform="translate(${o},${n}) scale(${c})"
        ></path>
      </g>
      </g>
    `}return G`
    <foreignObject
      width="0px"
      height="0px"
      x="${n}"
      y="${c}"
      overflow="hidden"
    >
      <body>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          class="div__icon hover"
          style="
            line-height: ${l}px;
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
  `}_getRenderedHaIconPath(e){const t=this.shadowRoot.getElementById(`icon-${this.iconsId[e]}`);return t?.shadowRoot?.querySelector("*")?.path}_scheduleIconPathRead(e,t){if(!e)return;if(this.iconCache[e])return void(this.iconsSvg[t]=this.iconCache[e]);if(this.pendingIconPath[t]===e)return;this.pendingIconPath[t]=e;let r=0;const s=()=>{if(this.pendingIconPath[t]!==e)return;if(this.iconCache[e])return this.iconsSvg[t]=this.iconCache[e],this.pendingIconPath[t]=void 0,void this.requestUpdate();const i=this._getRenderedHaIconPath();if(i)return this.iconsSvg[t]=i,this.iconCache[e]=i,this.pendingIconPath[t]=void 0,void this.requestUpdate();r+=1,r>=40?this.pendingIconPath[t]=void 0:this._iconPathTimer=window.setTimeout(s,50)};(this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((e=>{window.requestAnimationFrame(e)}))).then((()=>{this._iconPathTimer=window.setTimeout(s,0)}))}_renderIcons(){const{layout:e}=this.config;if(!e)return;if(!e.icons)return;const t=e.icons.map(((e,t)=>G`
            ${this._renderIcon(e,t)}
          `));return G`${t}`}_renderHorizontalLine(e){const t=e.entity_index??0,r=ye.getJsTemplateOrValue(e,e.styles),s={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2",..._e.toStyleDict(r)},i={..._e.toStyleDict(this.animations?.hlines?.[e.animation_id]??{})},o=this._getItemColorFromStops(e);o&&(i.stroke=o);const a={...s,...i};return G`
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
          style=${me(a)}
        ></line>
      </g> 
    `}_renderHorizontalLines(){const{layout:e}=this.config;if(!e?.hlines)return G``;const t=e.hlines.map((e=>this._renderHorizontalLine(e)));return G`${t}`}_renderVerticalLine(e){const t=e.entity_index??0,r=ye.getJsTemplateOrValue(e,e.styles),s={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2",..._e.toStyleDict(r)},i={..._e.toStyleDict(this.animations?.vlines?.[e.animation_id]??{})},o=this._getItemColorFromStops(e);o&&(i.stroke=o);const a={...s,...i};return G`
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
          style=${me(a)}
        ></line>
      </g> 
    `}_renderVerticalLines(){const{layout:e}=this.config;if(!e?.vlines)return G``;const t=e.vlines.map((e=>this._renderVerticalLine(e)));return G`${t}`}_renderCircle(e){const t=e.entity_index??0,r=ye.getJsTemplateOrValue(e,e.styles),s={..._e.toStyleDict(r)},i={..._e.toStyleDict(this.animations?.circles?.[e.animation_id]??{})},o=this._getItemColorFromStops(e);o&&(i.stroke=o);const a={...s,...i};return G`
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
    `}_renderCircles(){const{layout:e}=this.config;if(!e?.circles)return G``;const t=e.circles.map((e=>this._renderCircle(e)));return G`${t}`}_handleClick(e,t,r,s,i){let o;switch(s.action){case"more-info":o=new Event("hass-more-info",{composed:!0}),o.detail={entityId:i},e.dispatchEvent(o);break;case"navigate":if(!s.navigation_path)return;window.history.pushState(null,"",s.navigation_path),o=new Event("location-changed",{composed:!0}),o.detail={replace:!1},window.dispatchEvent(o);break;case"call-service":{if(!s.service)return;const[e,r]=s.service.split(".",2),i={...s.service_data};t.callService(e,r,i);break}case"fire-dom-event":o=new Event("ll-custom",{composed:!0,bubbles:!0}),o.detail=s,e.dispatchEvent(o)}}handlePopup(e,t){e.stopPropagation();const r=this.resolvedEntityConfigs.find((e=>e.entity===t.entity_id)),s=r?.tap_action??this.config?.tap_action??{action:"more-info"};this._handleClick(this,this._hass,this.config,s,t.entity_id)}textEllipsis(e,t){return t&&t<e.length?e.slice(0,t-1).concat("..."):e}_buildArea(e,t){if(t.area)return t.area;if(!this._hass||!this._hass.areas)return"";const r=this._hass.entities&&this._hass.entities[t.entity];let s=r?r.area_id:null;if(!s&&r&&r.device_id&&this._hass.devices){const e=this._hass.devices[r.device_id];s=e?e.area_id:null}if(s){const e=this._hass.areas[s];return e?e.name:""}return"?"}_buildName(e,t){return t.name??e.attributes.friendly_name??e?.entity_id??"?"}_buildIcon(e,t,r){return r||t?.icon||e?.attributes?.icon||Ee(e)}_buildUom(e,t){return t.unit||e.attributes.unit_of_measurement||""}_buildState(e,t){if(void 0===e)return e;if(null===e)return e;if(t.convert){let r,s,i=t.convert.match(/(^\w+)\((\d+)\)/);switch(null===i?r=t.convert:3===i.length&&(r=i[1],s=Number(i[2])),r){case"brightness_pct":e="undefined"===e?"undefined":`${Math.round(e/255*100)}`;break;case"multiply":e=`${Math.round(e*s)}`;break;case"divide":e=`${Math.round(e/s)}`;break;case"rgb_csv":case"rgb_hex":if(t.attribute){let s=this._hass.states[t.entity];switch(s.attributes.color_mode){case"unknown":case"onoff":case"brightness":case"white":break;case"color_temp":if(s.attributes.color_temp_kelvin){let t=pt(s.attributes.color_temp_kelvin);const i=nt(t);i[1]<.4&&(i[1]<.1?i[2]=225:i[1]=.4),t=ct(i),t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:at(t)}else e="rgb_csv"===r?"255,255,255":"#ffffff00";break;case"hs":{let t=lt([s.attributes.hs_color[0],s.attributes.hs_color[1]/100]);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:at(t)}break;case"rgb":{const t=nt(this.stateObj.attributes.rgb_color);t[1]<.4&&(t[1]<.1?t[2]=225:t[1]=.4);const s=ct(t);e="rgb_csv"===r?s.toString():at(s)}break;case"rgbw":{let t=(e=>{const[t,r,s,i]=e;return gt([t,r,s,i],[t+i,r+i,s+i])})(s.attributes.rgbw_color);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:at(t)}break;case"rgbww":{let t=_t(s.attributes.rgbww_color,s.attributes?.min_color_temp_kelvin,s.attributes?.max_color_temp_kelvin);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:at(t)}break;case"xy":if(s.attributes.hs_color){let t=lt([s.attributes.hs_color[0],s.attributes.hs_color[1]/100]);const i=nt(t);i[1]<.4&&(i[1]<.1?i[2]=225:i[1]=.4),t=ct(i),t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:at(t)}else if(s.attributes.color){let t={};t.l=s.attributes.brightness,t.h=s.attributes.color.h||s.attributes.color.hue,t.s=s.attributes.color.s||s.attributes.color.saturation;let{r:i,g:o,b:a}=Ct.hslToRgb(t);if("rgb_csv"===r)e=`${i},${o},${a}`;else{e=`#${Ct.padZero(i.toString(16))}${Ct.padZero(o.toString(16))}${Ct.padZero(a.toString(16))}`}}else s.attributes.xy_color}}break;default:console.error(`Unknown converter [${r}] specified for entity [${t.entity}]!`)}}return void 0!==e?Number.isNaN(e)?e:e.toString():void 0}_calculateStrokeColor(e,t,r){const s=t?.colors??[];if(!s.length)return;const i=Number(e);if(!Number.isFinite(i))return s[0].color;if(i<=s[0].value)return s[0].color;const o=s[s.length-1];if(i>=o.value)return o.color;for(let a=0;a<s.length-1;a+=1){const e=s[a],t=s[a+1];if(i>=e.value&&i<t.value){if(!r)return e.color;const s=Ct.calculateValueBetween(e.value,t.value,i);return Ct.getGradientValue(e.color,t.color,s)}}return o.color}_computeEntity(e){return e.substr(e.indexOf(".")+1)}getCardSize(){return 4}}customElements.get("flex-horseshoe-card")||customElements.define("flex-horseshoe-card",Vt);

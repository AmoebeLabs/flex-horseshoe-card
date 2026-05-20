/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),r=new WeakMap;let o=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=r.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&r.set(i,e))}return e}toString(){return this.cssText}};const s=(e,...t)=>{const r=1===e.length?e[0]:t.reduce(((t,i,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[r+1]),e[0]);return new o(r,e,i)},a=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,i))(t)})(e):e
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:m,getPrototypeOf:u}=Object,h=globalThis,f=h.trustedTypes,p=f?f.emptyScript:"",g=h.reactiveElementPolyfillSupport,_=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?p:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},b=(e,t)=>!n(e,t),w={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),h.litPropertyMetadata??=new WeakMap;let v=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(e,i,t);void 0!==r&&l(this.prototype,e,r)}}static getPropertyDescriptor(e,t,i){const{get:r,set:o}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){const s=r?.call(this);o?.call(this,t),this.requestUpdate(e,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const e=this.properties,t=[...d(e),...m(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[t,i]of this.elementProperties){const e=this._$Eu(t,i);void 0!==e&&this._$Eh.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,r)=>{if(t)i.adoptedStyleSheets=r.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const t of r){const r=document.createElement("style"),o=e.litNonce;void 0!==o&&r.setAttribute("nonce",o),r.textContent=t.cssText,i.appendChild(r)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(void 0!==r&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,r=i._$Eh.get(e);if(void 0!==r&&this._$Em!==r){const e=i.getPropertyOptions(r),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=r;const s=o.fromAttribute(t,e.type);this[r]=s??this._$Ej?.get(r)??s,this._$Em=null}}requestUpdate(e,t,i,r=!1,o){if(void 0!==e){const s=this.constructor;if(!1===r&&(o=this[e]),i??=s.getPropertyOptions(e),!((i.hasChanged??b)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:r,wrapped:o},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),!0!==o||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,r=this[t];!0!==e||this._$AL.has(t)||void 0===r||this.C(t,void 0,i,r)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[_("elementProperties")]=new Map,v[_("finalized")]=new Map,g?.({ReactiveElement:v}),(h.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,x=$.trustedTypes,k=x?x.createPolicy("flex-horseshoe-card-lit-html",{createHTML:e=>e}):void 0,S="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+A,C=`<${E}>`,T=document,O=()=>T.createComment(""),M=e=>null===e||"object"!=typeof e&&"function"!=typeof e,N=Array.isArray,P="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,z=/>/g,R=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),F=/'/g,V=/"/g,j=/^(?:script|style|textarea|title)$/i,H=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),U=H(1),J=H(2),L=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),q=new WeakMap,G=T.createTreeWalker(T,129);function W(e,t){if(!N(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(t):t}const Y=(e,t)=>{const i=e.length-1,r=[];let o,s=2===t?"<svg>":3===t?"<math>":"",a=I;for(let n=0;n<i;n++){const t=e[n];let i,l,c=-1,d=0;for(;d<t.length&&(a.lastIndex=d,l=a.exec(t),null!==l);)d=a.lastIndex,a===I?"!--"===l[1]?a=D:void 0!==l[1]?a=z:void 0!==l[2]?(j.test(l[2])&&(o=RegExp("</"+l[2],"g")),a=R):void 0!==l[3]&&(a=R):a===R?">"===l[0]?(a=o??I,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,i=l[1],a=void 0===l[3]?R:'"'===l[3]?V:F):a===V||a===F?a=R:a===D||a===z?a=I:(a=R,o=void 0);const m=a===R&&e[n+1].startsWith("/>")?" ":"";s+=a===I?t+C:c>=0?(r.push(i),t.slice(0,c)+S+t.slice(c)+A+m):t+A+(-2===c?n:m)}return[W(e,s+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),r]};class K{constructor({strings:e,_$litType$:t},i){let r;this.parts=[];let o=0,s=0;const a=e.length-1,n=this.parts,[l,c]=Y(e,t);if(this.el=K.createElement(l,i),G.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(r=G.nextNode())&&n.length<a;){if(1===r.nodeType){if(r.hasAttributes())for(const e of r.getAttributeNames())if(e.endsWith(S)){const t=c[s++],i=r.getAttribute(e).split(A),a=/([.?@])?(.*)/.exec(t);n.push({type:1,index:o,name:a[2],strings:i,ctor:"."===a[1]?te:"?"===a[1]?ie:"@"===a[1]?re:ee}),r.removeAttribute(e)}else e.startsWith(A)&&(n.push({type:6,index:o}),r.removeAttribute(e));if(j.test(r.tagName)){const e=r.textContent.split(A),t=e.length-1;if(t>0){r.textContent=x?x.emptyScript:"";for(let i=0;i<t;i++)r.append(e[i],O()),G.nextNode(),n.push({type:2,index:++o});r.append(e[t],O())}}}else if(8===r.nodeType)if(r.data===E)n.push({type:2,index:o});else{let e=-1;for(;-1!==(e=r.data.indexOf(A,e+1));)n.push({type:7,index:o}),e+=A.length-1}o++}}static createElement(e,t){const i=T.createElement("template");return i.innerHTML=e,i}}function X(e,t,i=e,r){if(t===L)return t;let o=void 0!==r?i._$Co?.[r]:i._$Cl;const s=M(t)?void 0:t._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),void 0===s?o=void 0:(o=new s(e),o._$AT(e,i,r)),void 0!==r?(i._$Co??=[])[r]=o:i._$Cl=o),void 0!==o&&(t=X(e,o._$AS(e,t.values),o,r)),t}class Z{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,r=(e?.creationScope??T).importNode(t,!0);G.currentNode=r;let o=G.nextNode(),s=0,a=0,n=i[0];for(;void 0!==n;){if(s===n.index){let t;2===n.type?t=new Q(o,o.nextSibling,this,e):1===n.type?t=new n.ctor(o,n.name,n.strings,this,e):6===n.type&&(t=new oe(o,this,e)),this._$AV.push(t),n=i[++a]}s!==n?.index&&(o=G.nextNode(),s++)}return G.currentNode=T,r}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,r){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),M(e)?e===B||null==e||""===e?(this._$AH!==B&&this._$AR(),this._$AH=B):e!==this._$AH&&e!==L&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>N(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==B&&M(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,r="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=K.createElement(W(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(t);else{const e=new Z(r,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=q.get(e.strings);return void 0===t&&q.set(e.strings,t=new K(e)),t}k(e){N(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,r=0;for(const o of e)r===t.length?t.push(i=new Q(this.O(O()),this.O(O()),this,this.options)):i=t[r],i._$AI(o),r++;r<t.length&&(this._$AR(i&&i._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,r,o){this.type=1,this._$AH=B,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(e,t=this,i,r){const o=this.strings;let s=!1;if(void 0===o)e=X(this,e,t,0),s=!M(e)||e!==this._$AH&&e!==L,s&&(this._$AH=e);else{const r=e;let a,n;for(e=o[0],a=0;a<o.length-1;a++)n=X(this,r[i+a],t,a),n===L&&(n=this._$AH[a]),s||=!M(n)||n!==this._$AH[a],n===B?e=B:e!==B&&(e+=(n??"")+o[a+1]),this._$AH[a]=n}s&&!r&&this.j(e)}j(e){e===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===B?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==B)}}class re extends ee{constructor(e,t,i,r,o){super(e,t,i,r,o),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??B)===L)return;const i=this._$AH,r=e===B&&i!==B||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==B&&(i===B||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const se=$.litHtmlPolyfillSupport;se?.(K,Q),($.litHtmlVersions??=[]).push("3.3.2");const ae=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ne=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const r=i?.renderBefore??t;let o=r._$litPart$;if(void 0===o){const e=i?.renderBefore??null;r._$litPart$=o=new Q(t.insertBefore(O(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}};ne._$litElement$=!0,ne.finalized=!0,ae.litElementHydrateSupport?.({LitElement:ne});const le=ae.litElementPolyfillSupport;le?.({LitElement:ne}),(ae.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce=1;let de=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const me="important",ue=" !"+me,he=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends de{constructor(e){if(super(e),e.type!==ce||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce(((t,i)=>{const r=e[i];return null==r?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${r};`}),"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const r of this.ft)null==t[r]&&(this.ft.delete(r),r.includes("-")?i.removeProperty(r):i[r]=null);for(const r in t){const e=t[r];if(null!=e){this.ft.add(r);const t="string"==typeof e&&e.endsWith(ue);r.includes("-")||t?i.setProperty(r,t?e.slice(0,-11):e,t?me:""):i[r]=e}}return L}});var fe=function(){return fe=Object.assign||function(e){for(var t,i=1,r=arguments.length;i<r;i++)for(var o in t=arguments[i])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e},fe.apply(this,arguments)};function pe(e,t,i){void 0===t&&(t=Date.now()),void 0===i&&(i={});var r=fe(fe({},ge),i||{}),o=(+e-+t)/1e3;if(Math.abs(o)<r.second)return{value:Math.round(o),unit:"second"};var s=o/60;if(Math.abs(s)<r.minute)return{value:Math.round(s),unit:"minute"};var a=o/3600;if(Math.abs(a)<r.hour)return{value:Math.round(a),unit:"hour"};var n=o/86400;if(Math.abs(n)<r.day)return{value:Math.round(n),unit:"day"};var l=new Date(e),c=new Date(t),d=l.getFullYear()-c.getFullYear();if(Math.round(Math.abs(d))>0)return{value:Math.round(d),unit:"year"};var m=12*d+l.getMonth()-c.getMonth();if(Math.round(Math.abs(m))>0)return{value:Math.round(m),unit:"month"};var u=o/604800;return{value:Math.round(u),unit:"week"}}var ge={second:45,minute:45,hour:22,day:5};class _e{static toStyleDict(e){return _e.toDict(e,{stringToDict:_e.cssStringToDict,mapValue:_e.toStyleValue})}static toClassDict(e){return _e.toDict(e,{stringToDict:_e.classStringToDict,mapValue:Boolean})}static toIconDict(e){return _e.toDict(e,{stringToDict:_e.stringToDefaultDict("default"),mapValue:String})}static toDict(e,t={}){const{stringToDict:i=_e.stringToDefaultDict("default"),mapValue:r=(e=>e),skipNull:o=!0,skipFalse:s=!0}=t,a=e=>null==e&&o||!1===e&&s?{}:Array.isArray(e)?e.reduce(((e,t)=>({...e,...a(t)})),{}):_e.isPlainObject(e)?Object.fromEntries(Object.entries(e).filter((([,e])=>(null!=e||!o)&&(!1!==e||!s))).map((([e,t])=>[e,r(t,e)]))):"string"==typeof e?i(e):{};return a(e)}static toStyleValue(e){return null==e?e:String(e).trim().replace(/;+$/,"")}static cssStringToDict(e){return String(e).split(";").map((e=>e.trim())).filter(Boolean).reduce(((e,t)=>{const i=t.indexOf(":");if(i<=0)return e;const r=t.slice(0,i).trim(),o=t.slice(i+1).trim();return r&&o?{...e,[r]:o}:e}),{})}static toColorStopDict(e){return _e.toDict(e,{stringToDict:_e.keyValueStringToDict,mapValue:String})}static keyValueStringToDict(e){const t=String(e).trim(),i=t.indexOf(":");if(i<=0)return{};const r=t.slice(0,i).trim(),o=t.slice(i+1).trim();return r&&o?{[r]:o}:{}}static classStringToDict(e){return String(e).trim().split(/\s+/).filter(Boolean).reduce(((e,t)=>({...e,[t]:!0})),{})}static stringToDefaultDict(e="default"){return t=>({[e]:String(t)})}static requireArray(e,t="value"){if(null==e)return[];if(!Array.isArray(e))throw new Error(`[config-helper] "${t}" must be an array.`);return e}static ensureArray(e){return null==e?[]:Array.isArray(e)?e:[e]}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}}class ye{static context={};static setContext(e={}){ye.context=e}static getJsTemplateOrValue(e,t,i={}){return ye._getJsTemplateOrValue(e,t,i,0)}static _getJsTemplateOrValue(e,t,i={},r=0){const{resolveKeys:o=!0,maxDepth:s=10}=i;if(r>=s)return t;if(null==t)return t;if(["number","boolean","bigint","symbol"].includes(typeof t))return t;if(Array.isArray(t))return t.map((t=>ye._getJsTemplateOrValue(e,t,i,r)));if(ye.isPlainObject(t))return Object.fromEntries(Object.entries(t).map((([t,s])=>{const a=o?ye._getJsTemplateOrValue(e,t,i,r):t,n=ye._getJsTemplateOrValue(e,s,i,r);return[String(a),n]})));if("string"!=typeof t)return t;const a=t.trim();if(!ye.isJsTemplate(a))return t;const n=ye.evaluateJsTemplate(e,ye.extractJsTemplateCode(a));return ye._getJsTemplateOrValue(e,n,i,r+1)}static getJsTemplateOrValueV1(e,t,i={}){const{resolveKeys:r=!0}=i;if(null==t)return t;if(["number","boolean","bigint","symbol"].includes(typeof t))return t;if(Array.isArray(t))return t.map((t=>ye.getJsTemplateOrValue(e,t,i)));if(ye.isPlainObject(t))return Object.fromEntries(Object.entries(t).map((([t,o])=>{const s=r?ye.getJsTemplateOrValue(e,t,i):t,a=ye.getJsTemplateOrValue(e,o,i);return[String(s),a]})));if("string"!=typeof t)return t;const o=t.trim();if(ye.isJsTemplate(o)){const t=ye.evaluateJsTemplate(e,ye.extractJsTemplateCode(o));return ye.getJsTemplateOrValue(e,t,i)}return t}static isJsTemplate(e){return"string"==typeof e&&e.trim().startsWith("[[[")&&e.trim().endsWith("]]]")}static extractJsTemplateCode(e){return String(e).trim().slice(3,-3).trim()}static evaluateJsTemplate(e,t){const{hass:i,config:r,entities:o=[]}=ye.context,s=ye._getItemEntityIndex(e),a=ye._getTemplateState(e),n=o?.[s],l=i?.states,c=r?.variables??{},d=i?.user;r?.dev?.debug&&console.log("Evaluating JavaScript template with context:",{hass:i,config:r,entity:n,entities:o,states:l,state:a,variables:c,item:e,user:d});try{return new Function("hass","config","entity","entities","states","state","variables","item","user",`\n          "use strict";\n          ${t}\n        `)(i,r,n,o,l,a,c,e,d)}catch(m){return void(r?.dev?.debug&&console.error("[templates] JavaScript template error:",{error:m,item:e,javascript:t}))}}static _getTemplateState(e={}){const t=ye._getItemEntityIndex(e),i=ye.context.entities?.[t],r=ye.context.config?.entities?.[t]||{};if(!i)return;const o=r.attribute;return o&&i.attributes&&void 0!==i.attributes[o]?i.attributes[o]:i.state}static _getItemEntityIndex(e={}){const t=Number(e.entity_index);return Number.isFinite(t)?t:0}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}}class be{static normalize(e){return e?Array.isArray(e)?{scales:{},colors:be.normalizeColors(e)}:!be.isPlainObject(e)||e.colors||e.scales?be.isPlainObject(e)?{scales:be.normalizeScales(e.scales),colors:be.normalizeColors(e.colors)}:{scales:{},colors:[]}:{scales:{},colors:be.normalizeColors(e)}:{scales:{},colors:[]}}static normalizeScales(e){return be.isPlainObject(e)?Object.fromEntries(Object.entries(e).map((([e,t])=>[e,be.isPlainObject(t)?{...t}:t]))):{}}static normalizeColors(e){return e?Array.isArray(e)?e.flatMap((e=>be.normalizeColorArrayEntry(e))).filter(Boolean).sort(((e,t)=>e.value-t.value)):be.isPlainObject(e)?Object.entries(e).map((([e,t])=>be.normalizeColorPair(e,t))).filter(Boolean).sort(((e,t)=>e.value-t.value)):[]:[]}static normalizeColorArrayEntry(e){if(be.isPlainObject(e)&&Object.prototype.hasOwnProperty.call(e,"value")&&Object.prototype.hasOwnProperty.call(e,"color")){const t=be.normalizeColorEntry(e);return t?[t]:[]}return be.isPlainObject(e)?Object.entries(e).map((([e,t])=>be.normalizeColorPair(e,t))).filter(Boolean):[]}static normalizeColorPair(e,t){const i=Number(e);return Number.isFinite(i)?null==t?null:{value:i,color:String(t)}:null}static normalizeColorEntry(e){if(!be.isPlainObject(e))return null;const t=Number(e.value);return Number.isFinite(t)?void 0===e.color||null===e.color?null:{...e,value:t,color:String(e.color)}:null}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}static _testColorStopsNormalizer(){const e={entity_index:0},t=[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}];[{name:"FHC dict",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC dict with quoted keys",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC list of dicts",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC list of dicts with quoted keys",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC dict with template values",raw:{0:"[[[\n          return 'red';\n        ]]]",10:"[[[\n          return 'green';\n        ]]]",20:"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template values",raw:[{0:"[[[\n            return 'red';\n          ]]]"},{10:"[[[\n            return 'green';\n          ]]]"},{20:"[[[\n            return 'blue';\n          ]]]"}]},{name:"FHC dict with template keys",raw:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}},{name:"FHC dict with template keys and values",raw:{"[[[ return 0; ]]]":"[[[\n          return 'red';\n        ]]]","[[[ return 10; ]]]":"[[[\n          return 'green';\n        ]]]","[[[ return 20; ]]]":"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template keys and values",raw:[{"[[[ return 0; ]]]":"[[[\n            return 'red';\n          ]]]"},{"[[[ return 10; ]]]":"[[[\n            return 'green';\n          ]]]"},{"[[[ return 20; ]]]":"[[[\n            return 'blue';\n          ]]]"}]},{name:"Whole FHC color_stops as template returning dict",raw:"[[[\n        return {\n          0: 'red',\n          10: 'green',\n          20: 'blue',\n        };\n      ]]]"},{name:"Whole FHC color_stops as template returning list",raw:"[[[\n        return [\n          { 0: 'red' },\n          { 10: 'green' },\n          { 20: 'blue' },\n        ];\n      ]]]"},{name:"SAK v1 colorstops.colors dict",raw:{colors:{0:"red",10:"green",20:"blue"}}},{name:"SAK v1 colorstops.colors dict with template keys",raw:{colors:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}}},{name:"SAK v1 colorstops.colors dict with template values",raw:{colors:{0:"[[[\n            return 'red';\n          ]]]",10:"[[[\n            return 'green';\n          ]]]",20:"[[[\n            return 'blue';\n          ]]]"}}},{name:"SAK v2 colors list",raw:{scales:{default:{min:0,max:20}},colors:[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}]}},{name:"SAK v2 colors list unsorted",raw:{scales:{default:{min:0,max:20}},colors:[{value:20,color:"blue",rank:2},{value:0,color:"red",rank:1},{value:10,color:"green",rank:1}]}},{name:"SAK v2 colors list with template values",raw:{scales:{default:{min:"[[[\n              return 0;\n            ]]]",max:"[[[\n              return 20;\n            ]]]"}},colors:[{value:"[[[\n              return 0;\n            ]]]",color:"[[[\n              return 'red';\n            ]]]"},{value:"[[[\n              return 10;\n            ]]]",color:"[[[\n              return 'green';\n            ]]]"},{value:"[[[\n              return 20;\n            ]]]",color:"[[[\n              return 'blue';\n            ]]]"}]}},{name:"SAK v2 whole colors list as template",raw:{scales:{default:{min:0,max:20}},colors:"[[[\n          return [\n            { value: 0, color: 'red' },\n            { value: 10, color: 'green' },\n            { value: 20, color: 'blue' },\n          ];\n        ]]]"}}].forEach((i=>{const r=ye.getJsTemplateOrValue(e,i.raw,{resolveKeys:!0}),o=be.normalize(r),s=o.colors.map((e=>({value:e.value,color:e.color}))),a=JSON.stringify(s)===JSON.stringify(t);console.log(`[colorstops test] ${a?"PASS":"FAIL"} - ${i.name}`,{raw:i.raw,resolved:r,normalized:o,simpleColors:s,expectedColors:t})}))}}const we="mdi:bookmark",ve={air_quality:"mdi:air-filter",alert:"mdi:alert",calendar:"mdi:calendar",climate:"mdi:thermostat",configurator:"mdi:cog",conversation:"mdi:microphone-message",counter:"mdi:counter",datetime:"mdi:calendar-clock",date:"mdi:calendar",demo:"mdi:home-assistant",google_assistant:"mdi:google-assistant",group:"mdi:google-circles-communities",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_button:"mdi:gesture-tap-button",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",number:"mdi:ray-vertex",persistent_notification:"mdi:bell",plant:"mdi:Flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:palette",schedule:"mdi:calendar-clock",script:"mdi:script-text",select:"mdi:format-list-bulleted",sensor:"mdi:eye",simple_alarm:"mdi:bell",siren:"mdi:bullhorn",stt:"mdi:microphone-message",text:"mdi:form-textbox",time:"mdi:clock",timer:"mdi:timer-outline",tts:"mdi:speaker-message",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",zone:"mdi:map-marker-radius"},$e={apparent_power:"mdi:flash",aqi:"mdi:air-filter",atmospheric_pressure:"mdi:thermometer-lines",carbon_dioxide:"mdi:molecule-co2",carbon_monoxide:"mdi:molecule-co",current:"mdi:current-ac",data_rate:"mdi:transmission-tower",data_size:"mdi:database",date:"mdi:calendar",distance:"mdi:arrow-left-right",duration:"mdi:progress-clock",energy:"mdi:lightning-bolt",frequency:"mdi:sine-wave",gas:"mdi:meter-gas",humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",irradiance:"mdi:sun-wireless",moisture:"mdi:water-percent",monetary:"mdi:cash",nitrogen_dioxide:"mdi:molecule",nitrogen_monoxide:"mdi:molecule",nitrous_oxide:"mdi:molecule",ozone:"mdi:molecule",pm1:"mdi:molecule",pm10:"mdi:molecule",pm25:"mdi:molecule",power:"mdi:flash",power_factor:"mdi:angle-acute",precipitation:"mdi:weather-rainy",precipitation_intensity:"mdi:weather-pouring",pressure:"mdi:gauge",reactive_power:"mdi:flash",signal_strength:"mdi:wifi",sound_pressure:"mdi:ear-hearing",speed:"mdi:speedometer",sulphur_dioxide:"mdi:molecule",temperature:"mdi:thermometer",timestamp:"mdi:clock",volatile_organic_compounds:"mdi:molecule",volatile_organic_compounds_parts:"mdi:molecule",voltage:"mdi:sine-wave",volume:"mdi:car-coolant-level",water:"mdi:water",weight:"mdi:weight",wind_speed:"mdi:weather-windy"},xe=e=>e.substring(0,e.indexOf(".")),ke={10:"mdi:battery-10",20:"mdi:battery-20",30:"mdi:battery-30",40:"mdi:battery-40",50:"mdi:battery-50",60:"mdi:battery-60",70:"mdi:battery-70",80:"mdi:battery-80",90:"mdi:battery-90",100:"mdi:battery"},Se=(e,t)=>{const i=Number(e);if(isNaN(i))return"off"===e?"mdi:battery":"on"===e?"mdi:battery-alert":"mdi:battery-unknown";const r=10*Math.round(i/10);return i<=5?"mdi:battery-alert-variant-outline":ke[r]},Ae=e=>{const t=e?.attributes.device_class;if(t&&t in $e)return $e[t];if("battery"===t)return e?((e,t)=>{const i=e.state;return Se(i)})(e):"mdi:battery";const i=e?.attributes.unit_of_measurement;return"°C"===i||"°F"===i?"mdi-thermometer":void 0},Ee=(e,t,i)=>{const r=t?.state;switch(e){case"alarm_control_panel":return(e=>{switch(e){case"armed_away":return"mdi:shield-lock";case"armed_vacation":return"mdi:shield-airplane";case"armed_home":return"mdi:shield-home";case"armed_night":return"mdi:shield-moon";case"armed_custom_bypass":return"mdi:security";case"pending":return"mdi:shield-outline";case"triggered":return"mdi:bell-ring";case"disarmed":return"mdi:shield-off";default:return"mdi:shield"}})(r);case"automation":return"off"===r?"mdi:robot-off":"mdi:robot";case"binary_sensor":return((e,t)=>{const i="off"===e;switch(t?.attributes.device_class){case"battery":return i?"mdi:battery":"mdi:battery-outline";case"battery_charging":return i?"mdi:battery":"mdi:battery-charging";case"carbon_monoxide":return i?"mdi:smoke-detector":"mdi:smoke-detector-alert";case"cold":return i?"mdi:thermometer":"mdi:Snowflake";case"connectivity":return i?"mdi:close-network-outline":"mdi:check-network-outline";case"door":return i?"mdi:door-closed":"mdi:door-open";case"garage_door":return i?"mdi:garage":"mdi:garage-open";case"power":case"plug":return i?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return i?"mdi:check-circle":"mdi:alert-circle";case"smoke":return i?"mdi:smoke-detector-variant":"mdi:smoke-detector-variant-alert";case"heat":return i?"mdi:thermometer":"mdi:fire";case"light":return i?"mdi:brightness-5":"mdi:brightness-7";case"lock":return i?"mdi:lock":"mdi:lock-open";case"moisture":return i?"mdi:water-off":"mdi:water";case"motion":return i?"mdi:motion-sensor-off":"mdi:motion-sensor";case"occupancy":return i?"mdi:home-outline":"mdi:Home";case"opening":return i?"mdi:square":"mdi:square-outline";case"presence":return i?"mdi:home-outline":"mdi:home";case"running":return i?"mdi:stop":"mdi:play";case"sound":return i?"mdi:music-note-off":"mdi:music-note";case"update":return i?"mdi:package":"mdi:package-up";case"vibration":return i?"mdi:crop-portrait":"mdi:vibrate";case"window":return i?"mdi:window-closed":"mdi:window-open";default:return i?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}})(r,t);case"button":switch(t?.attributes.device_class){case"restart":return"mdi:restart";case"update":return"mdi:package-up";default:return"mdi:gesture-tap-button"}case"camera":return"off"===r?"mdi:video-off":"mdi:video";case"cover":return((e,t)=>{const i="closed"!==e;switch(t?.attributes.device_class){case"garage":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdigarage";default:return"mdi:Garage-open"}case"gate":switch(e){case"opening":case"closing":return"mdi:gate-arrow-right";case"closed":return"mdi:gate";default:return"mdi:gate-open"}case"door":return i?"mdi:door-open":"mdi:door-closed";case"damper":return i?"mdi:circle":"mdi:circle-slice-8";case"shutter":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window-shutter";default:return"mdi:window-shutter-open"}case"curtain":switch(e){case"opening":return"mdi:arrow-split-vertical";case"closing":return"mdi:arrow-collapse-horizontal";case"closed":return"mdi:curtains-closed";default:return"mdi:curtains"}case"blind":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:blinds-horizontal-closed";default:return"mdi:blinds-horizontal"}case"shade":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:roller-shade-closed";default:return"mdi:roller-shade"}case"window":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}}switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}})(r,t);case"device_tracker":return"router"===t?.attributes.source_type?"home"===r?"mdi:lan-connect":"mdi:lan-cisconnect":["bluetooth","bluetooth_le"].includes(t?.attributes.source_type)?"home"===r?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===r?"mdi:account-arrow-right":"mdi:account";case"fan":return"off"===r?"mdi:fan-off":"mdi:fan";case"humidifier":return"off"===r?"mdi:air-humidifier-off":"mdi:air-humidifier";case"input_boolean":return"on"===r?"mdi:check-circle-outline":"mdi:close-circle-outline";case"input_datetime":if(!t?.attributes.has_date)return"mdi:clock";if(!t.attributes.has_time)return"mdi:calendar";break;case"lock":switch(r){case"unlocked":return"mdi:lock-open";case"jammed":return"mdi:lock-alert";case"locking":case"unlocking":return"mdi:lock-clock";default:return"mdi:lock"}case"media_player":switch(t?.attributes.device_class){case"speaker":switch(r){case"playing":return"mdi:speaker-play";case"paused":return"mdi:speaker-pause";case"off":return"mdi:speaker-off";default:return"mdi:speaker"}case"tv":switch(r){case"playing":return"mdi:television-play";case"paused":return"mdi:television-pause";case"off":return"mdi:television-off";default:return"mdi:television"}case"receiver":return"off"===r?"mdi:audio-video-off":"mdi:audio-video";default:switch(r){case"playing":case"paused":return"mdi:cast-connected";case"off":return"mdi:cast-off";default:return"mdi:cast"}}case"number":{const e=(e=>{const t=e?.attributes.device_class;if(t&&t in $e)return $e[t]})(t);if(e)return e;break}case"person":return"not_home"===r?"mdi:account-arrow-right":"mdi:account";case"switch":switch(t?.attributes.device_class){case"outlet":return"on"===r?"mdi:power-plug":"mdi:power-plug-off";case"switch":return"on"===r?"mdi:toggle-switch-variant":"mdi:toggle-switch-variant-off";default:return"mdi:toggle-switch-variant"}case"sensor":{const e=Ae(t);if(e)return e;break}case"sun":return"above_horizon"===t?.state?"mdi:white-balance-sunny":"mdi:weather-night";case"switch_as_x":return"mdi:swap-horizontal";case"threshold":return"mdi:chart-sankey";case"water_heater":return"off"===r?"mdi:water-boiler-off":"mdi:water-boiler"}if(e in ve)return ve[e]},Ce=e=>{return e?(t=xe(e.entity_id),Ee(t,e)||(console.warn(`Unable to find icon for domain ${t}`),we)):we;var t};var Te,Oe,Me,Ne,Pe;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.quote_decimal="quote_decimal",e.space_comma="space_comma",e.none="none"}(Te||(Te={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Oe||(Oe={})),function(e){e.local="local",e.server="server"}(Me||(Me={})),function(e){e.language="language",e.system="system",e.DMY="DMY",e.MDY="MDY",e.YMD="YMD"}(Ne||(Ne={})),function(e){e.language="language",e.monday="monday",e.tuesday="tuesday",e.wednesday="wednesday",e.thursday="thursday",e.friday="friday",e.saturday="saturday",e.sunday="sunday"}(Pe||(Pe={}));const Ie=(e,t,i)=>De(e,t,i).map((e=>e.value)).join(""),De=(e,t,i)=>{const r=t?(e=>{switch(e.number_format){case Te.comma_decimal:return["en-US","en"];case Te.decimal_comma:return["de","es","it"];case Te.space_comma:return["fr","sv","cs"];case Te.quote_decimal:return["de-CH"];case Te.system:return;default:return e.language}})(t):void 0;return t?.number_format===Te.none||Number.isNaN(Number(e))?Number.isNaN(Number(e))||""===e||t?.number_format!==Te.none?[{type:"literal",value:e}]:new Intl.NumberFormat("en-US",ze(e,{...i,useGrouping:!1})).formatToParts(Number(e)):new Intl.NumberFormat(r,ze(e,i)).formatToParts(Number(e))},ze=(e,t)=>{const i={maximumFractionDigits:2,...t};if("string"!=typeof e)return i;if(!t||void 0===t.minimumFractionDigits&&void 0===t.maximumFractionDigits){const t=e.indexOf(".")>-1?e.split(".")[1].length:0;i.minimumFractionDigits=t,i.maximumFractionDigits=t}return i};var Re=Number.isNaN||function(e){return"number"==typeof e&&e!=e};function Fe(e,t){if(e.length!==t.length)return!1;for(var i=0;i<e.length;i++)if(r=e[i],o=t[i],!(r===o||Re(r)&&Re(o)))return!1;var r,o;return!0}function Ve(e,t){void 0===t&&(t=Fe);var i=null;function r(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];if(i&&i.lastThis===this&&t(r,i.lastArgs))return i.lastResult;var s=e.apply(this,r);return i={lastResult:s,lastArgs:r,lastThis:this},s}return r.clear=function(){i=null},r}const je=Ve((e=>new Intl.DateTimeFormat(e.language,{weekday:"long",month:"long",day:"numeric"}))),He=Ve((e=>new Intl.DateTimeFormat(e.language,{year:"numeric",month:"long",day:"numeric"}))),Ue=Ve((e=>new Intl.DateTimeFormat(e.language,{year:"numeric",month:"numeric",day:"numeric"}))),Je=(e,t)=>Le(t).format(e),Le=Ve((e=>new Intl.DateTimeFormat(e.language,{day:"numeric",month:"short"}))),Be=Ve((e=>new Intl.DateTimeFormat(e.language,{month:"long",year:"numeric"}))),qe=Ve((e=>new Intl.DateTimeFormat(e.language,{month:"long"})));Ve((e=>new Intl.DateTimeFormat(e.language,{year:"numeric"})));const Ge=Ve((e=>new Intl.DateTimeFormat(e.language,{weekday:"long"}))),We=Ve((e=>new Intl.DateTimeFormat(e.language,{weekday:"short"})));var Ye;!function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Ye=Ye||(Ye={}));const Ke=Ve((e=>{if(e.time_format===Ye.language||e.time_format===Ye.system){const t=e.time_format===Ye.language?e.language:void 0,i=(new Date).toLocaleString(t);return i.includes("AM")||i.includes("PM")}return e.time_format===Ye.am_pm})),Xe=Ve((e=>new Intl.DateTimeFormat("en"!==e.language||Ke(e)?e.language:"en-u-hc-h23",{hour:"numeric",minute:"2-digit",hour12:Ke(e)}))),Ze=Ve((e=>new Intl.DateTimeFormat("en"!==e.language||Ke(e)?e.language:"en-u-hc-h23",{hour:Ke(e)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:Ke(e)}))),Qe=Ve((e=>new Intl.DateTimeFormat("en"!==e.language||Ke(e)?e.language:"en-u-hc-h23",{weekday:"long",hour:Ke(e)?"numeric":"2-digit",minute:"2-digit",hour12:Ke(e)}))),et=e=>tt().format(e),tt=Ve((()=>new Intl.DateTimeFormat("en-GB",{hour:"numeric",minute:"2-digit",hour12:!1}))),it=Ve((e=>new Intl.DateTimeFormat("en"!==e.language||Ke(e)?e.language:"en-u-hc-h23",{year:"numeric",month:"long",day:"numeric",hour:Ke(e)?"numeric":"2-digit",minute:"2-digit",hour12:Ke(e)}))),rt=Ve((e=>new Intl.DateTimeFormat("en"!==e.language||Ke(e)?e.language:"en-u-hc-h23",{year:"numeric",month:"short",day:"numeric",hour:Ke(e)?"numeric":"2-digit",minute:"2-digit",hour12:Ke(e)}))),ot=Ve((e=>new Intl.DateTimeFormat("en"!==e.language||Ke(e)?e.language:"en-u-hc-h23",{month:"short",day:"numeric",hour:Ke(e)?"numeric":"2-digit",minute:"2-digit",hour12:Ke(e)}))),st=Ve((e=>new Intl.DateTimeFormat("en"!==e.language||Ke(e)?e.language:"en-u-hc-h23",{year:"numeric",month:"long",day:"numeric",hour:Ke(e)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:Ke(e)}))),at=Ve((e=>new Intl.DateTimeFormat("en"!==e.language||Ke(e)?e.language:"en-u-hc-h23",{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit",hour12:Ke(e)}))),nt=(e,t=2)=>{let i=`${e}`;for(let r=1;r<t;r++)i=parseInt(i)<10**r?`0${i}`:i;return i};const lt={ms:1,s:1e3,min:6e4,h:36e5,d:864e5},ct=(e,t)=>function(e){const t=Math.floor(e/1e3/3600),i=Math.floor(e/1e3%3600/60),r=Math.floor(e/1e3%3600%60),o=Math.floor(e%1e3);return t>0?`${t}:${nt(i)}:${nt(r)}`:i>0?`${i}:${nt(r)}`:r>0||o>0?`${r}${o>0?`.${nt(o,3)}`:""}`:null}(parseFloat(e)*lt[t])||"0",dt="unavailable",mt=(ut=[dt,"unknown"],(e,t)=>ut.includes(e,t));var ut;const ht=(e,t)=>e&&e.components.includes(t),ft=(e,t,i,r)=>{const[o,s,a]=e.split(".",3);return Number(o)>t||Number(o)===t&&(void 0===r?Number(s)>=i:Number(s)>i)||void 0!==r&&Number(o)===t&&Number(s)===i&&Number(a)>=r},pt=e=>xe(e.entity_id),gt={entity:{},entity_component:{}},_t=async(e,t,i)=>((e,t)=>e.sendMessagePromise(t))(e,{type:"frontend/get_icons",category:t,integration:i}),yt=new WeakMap,bt=(e,t)=>{if(t)return e&&t.state?.[e]?t.state[e]:void 0!==e&&t.range&&!isNaN(Number(e))?((e,t)=>{let i=yt.get(t);if(i||(i=Object.keys(t).map(Number).filter((e=>!isNaN(e))).sort(((e,t)=>e-t)),yt.set(t,i)),0===i.length)return;if(e<i[0])return;let r=i[0];for(const o of i){if(!(e>=o))break;r=o}return t[r.toString()]})(Number(e),t.range)??t.default:t.default},wt=async(e,t,i,r,o,s)=>{const a=s?.platform,n=s?.translation_key,l=r?.attributes.device_class,c=r?.state;let d;if(n&&a){const r=await(async(e,t,i,r=!1)=>{if(!r&&i in gt.entity)return gt.entity[i];if(!ht(e,i)||!ft(t.haVersion,2024,2))return;const o=_t(t,"entity",i).then((e=>e?.resources[i]));return gt.entity[i]=o,gt.entity[i]})(e,t,a);if(r){const e=r[i]?.[n];d=bt(c,e)}}if(!d&&r&&(d=((e,t)=>{const i=pt(e),r=t??e.state;switch(i){case"device_tracker":return((e,t)=>{const i=t??e.state;return"router"===e?.attributes.source_type?"home"===i?"mdi:lan-connect":"mdi:lan-disconnect":["bluetooth","bluetooth_le"].includes(e?.attributes.source_type)?"home"===i?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===i?"mdi:account-arrow-right":"mdi:account"})(e,r);case"sun":return"above_horizon"===r?"mdi:white-balance-sunny":"mdi:weather-night";case"input_datetime":if(!e.attributes.has_date)return"mdi:clock";if(!e.attributes.has_time)return"mdi:calendar"}})(r,c)),!d){const r=await(async(e,t,i,r=!1)=>__BACKWARDS_COMPAT__&&!ft(e.haVersion,2024,2)?Promise.resolve().then((function(){return Yt})).then((e=>e.ENTITY_COMPONENT_ICONS)).then((e=>e[i])):!r&&gt.entity_component.resources&&gt.entity_component.domains?.includes(i)?gt.entity_component.resources.then((e=>e[i])):ht(t,i)?(gt.entity_component.domains=[...t.components],gt.entity_component.resources=_t(e,"entity_component").then((e=>e.resources)),gt.entity_component.resources.then((e=>e[i]))):void 0)(t,e,i);if(r){const e=l&&r[l]||r._;d=bt(c,e)}}return d},vt=e=>{const t=Math.round(Math.min(Math.max(e,0),255)).toString(16);return 1===t.length?`0${t}`:t},$t=e=>`#${vt(e[0])}${vt(e[1])}${vt(e[2])}`,xt=e=>{const[t,i,r]=e,o=Math.max(t,i,r),s=o-Math.min(t,i,r),a=s&&(o===t?(i-r)/s:o===i?2+(r-t)/s:4+(t-i)/s);return[60*(a<0?a+6:a),o&&s/o,o]},kt=e=>{const[t,i,r]=e,o=e=>{const o=(e+t/60)%6;return r-r*i*Math.max(Math.min(o,4-o,1),0)};return[o(5),o(3),o(1)]},St=e=>kt([e[0],e[1],255]),At=(e,t,i)=>Math.min(Math.max(e,t),i),Et=e=>{if(e<=66)return 255;return At(329.698727446*(e-60)**-.1332047592,0,255)},Ct=e=>{let t;return t=e<=66?99.4708025861*Math.log(e)-161.1195681661:288.1221695283*(e-60)**-.0755148492,At(t,0,255)},Tt=e=>{if(e>=66)return 255;if(e<=19)return 0;const t=138.5177312231*Math.log(e-10)-305.0447927307;return At(t,0,255)},Ot=e=>{const t=e/100;return[Et(t),Ct(t),Tt(t)]},Mt=(e,t)=>{const i=Math.max(...e),r=Math.max(...t);let o;return o=0===r?0:i/r,t.map((e=>Math.round(e*o)))},Nt=e=>Math.floor(1e6/e),Pt=(e,t,i)=>{const[r,o,s,a,n]=e,l=Nt(t??2700),c=Nt(i??6500),d=l-c;let m;try{m=n/(a+n)}catch(b){m=.5}const u=c+m*d,h=u?(f=u,Math.floor(1e6/f)):0;var f;const[p,g,_]=Ot(h),y=Math.max(a,n)/255;return Mt([r,o,s,a,n],[r+p*y,o+g*y,s+_*y])};const It=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater","weather"]),Dt=(e,t)=>{if((void 0!==t?t:e?.state)===dt)return"var(--state-unavailable-color)";const i=Ft(e,t);return i?(r=i,Array.isArray(r)?r.reverse().reduce(((e,t)=>`var(${t}${e?`, ${e}`:""})`),void 0):`var(${r})`):void 0;var r},zt=(e,t,i)=>{const r=void 0!==i?i:t.state,o=function(e,t){const i=xe(e.entity_id),r=void 0!==t?t:e?.state;if(["button","event","infrared","input_button","radio_frequency","scene"].includes(i))return r!==dt;if(mt(r))return!1;if("off"===r&&"alert"!==i)return!1;switch(i){case"alarm_control_panel":return"disarmed"!==r;case"alert":return"idle"!==r;case"cover":case"valve":return"closed"!==r;case"device_tracker":case"person":return"not_home"!==r;case"lawn_mower":return!["docked","paused"].includes(r);case"lock":return"locked"!==r;case"media_player":return"standby"!==r;case"vacuum":return!["idle","docked","paused"].includes(r);case"plant":return"problem"===r;case"group":return["on","home","open","locked","problem"].includes(r);case"timer":return"active"===r;case"camera":return"streaming"===r}return!0}(t,i);return Rt(e,t.attributes.device_class,r,o)},Rt=(e,t,i,r)=>{const o=[],s=((e,t="_")=>{const i="àáâäæãåāăąабçćčđďдèéêëēėęěеёэфğǵгḧхîïíīįìıİийкłлḿмñńǹňнôöòóœøōõőоṕпŕřрßśšşșсťțтûüùúūǘůűųувẃẍÿýыžźżз·",r=`aaaaaaaaaaabcccdddeeeeeeeeeeefggghhiiiiiiiiijkllmmnnnnnoooooooooopprrrsssssstttuuuuuuuuuuvwxyyyzzzz${t}`,o=new RegExp(i.split("").join("|"),"g"),s={"ж":"zh","х":"kh","ц":"ts","ч":"ch","ш":"sh","щ":"shch","ю":"iu","я":"ia"};let a;return""===e?a="":(a=e.toString().toLowerCase().replace(o,(e=>r.charAt(i.indexOf(e)))).replace(/[а-я]/g,(e=>s[e]||"")).replace(/(\d),(?=\d)/g,"$1").replace(/[^a-z0-9]+/g,t).replace(new RegExp(`(${t})\\1+`,"g"),"$1").replace(new RegExp(`^${t}+`),"").replace(new RegExp(`${t}+$`),""),""===a&&(a="unknown")),a})(i,"_"),a=r?"active":"inactive";return t&&o.push(`--state-${e}-${t}-${s}-color`),o.push(`--state-${e}-${s}-color`,`--state-${e}-${a}-color`,`--state-${a}-color`),o},Ft=(e,t)=>{const i=void 0!==t?t:e?.state,r=xe(e.entity_id),o=e.attributes.device_class;if("sensor"===r&&"battery"===o){const e=(e=>{const t=Number(e);if(!isNaN(t))return t>=70?"--state-sensor-battery-high-color":t>=30?"--state-sensor-battery-medium-color":"--state-sensor-battery-low-color"})(i);if(e)return[e]}if("group"===r){const i=(e=>{const t=e.attributes.entity_id||[],i=[...new Set(t.map((e=>xe(e))))];return 1===i.length?i[0]:void 0})(e);if(i&&It.has(i))return zt(i,e,t)}if(It.has(r))return zt(r,e,t)};var Vt;!function(e){e[e.TARGET_TEMPERATURE=1]="TARGET_TEMPERATURE",e[e.TARGET_TEMPERATURE_RANGE=2]="TARGET_TEMPERATURE_RANGE",e[e.TARGET_HUMIDITY=4]="TARGET_HUMIDITY",e[e.FAN_MODE=8]="FAN_MODE",e[e.PRESET_MODE=16]="PRESET_MODE",e[e.SWING_MODE=32]="SWING_MODE",e[e.AUX_HEAT=64]="AUX_HEAT",e[e.TURN_OFF=128]="TURN_OFF",e[e.TURN_ON=256]="TURN_ON",e[e.SWING_HORIZONTAL_MODE=512]="SWING_HORIZONTAL_MODE"}(Vt||(Vt={})),["auto","heat_cool","heat","cool","dry","fan_only","off"].reduce(((e,t,i)=>(e[t]=i,e)),{});const jt={cooling:"cool",defrosting:"heat",drying:"dry",fan:"fan_only",heating:"heat",idle:"off",off:"off",preheating:"heat"};class Ht{static{Ht.colorCache={},Ht.element=void 0}static _prefixKeys(e){let t={};return Object.keys(e).forEach((i=>{const r=`--${i}`,o=String(e[i]);t[r]=`${o}`})),t}static processTheme(e){let t={},i={},r={},o={};const{modes:s,...a}=e;return s&&(i={...a,...s.dark},t={...a,...s.light}),r=Ht._prefixKeys(t),o=Ht._prefixKeys(i),{themeLight:r,themeDark:o}}static processPalette(e){let t={},i={},r={},o={},s={};return Object.values(e).forEach((e=>{const{modes:o,...s}=e;t={...t,...s},o&&(r={...r,...s,...o.dark},i={...i,...s,...o.light})})),o=Ht._prefixKeys(i),s=Ht._prefixKeys(r),{paletteLight:o,paletteDark:s}}static setElement(e){Ht.element=e}static calculateColor(e,t,i){const r=Object.keys(t).map((e=>Number(e))).sort(((e,t)=>e-t));let o,s,a;const n=r.length;if(e<=r[0])return t[r[0]];if(e>=r[n-1])return t[r[n-1]];for(let l=0;l<n-1;l++){const n=r[l],c=r[l+1];if(e>=n&&e<c){if([o,s]=[t[n],t[c]],!i)return o;a=Ht.calculateValueBetween(n,c,e);break}}return Ht.getGradientValue(o,s,a)}static calculateColor2(e,t,i,r,o){const s=Object.keys(t).map((e=>Number(e))).sort(((e,t)=>e-t));let a,n,l;const c=s.length;if(e<=s[0])return t[s[0]];if(e>=s[c-1])return t[s[c-1]];for(let d=0;d<c-1;d++){const c=s[d],m=s[d+1];if(e>=c&&e<m){if([a,n]=[t[c].styles[i][r],t[m].styles[i][r]],!o)return a;l=Ht.calculateValueBetween(c,m,e);break}}return Ht.getGradientValue(a,n,l)}static calculateValueBetween(e,t,i){return(Math.min(Math.max(i,e),t)-e)/(t-e)}static getColorVariable(e){const t=e.substr(4,e.length-5);return window.getComputedStyle(Ht.element).getPropertyValue(t)}static getGradientValue(e,t,i){const r=Ht.colorToRGBA(e),o=Ht.colorToRGBA(t),s=1-i,a=i,n=Math.floor(r[0]*s+o[0]*a),l=Math.floor(r[1]*s+o[1]*a),c=Math.floor(r[2]*s+o[2]*a),d=Math.floor(r[3]*s+o[3]*a);return`#${Ht.padZero(n.toString(16))}${Ht.padZero(l.toString(16))}${Ht.padZero(c.toString(16))}${Ht.padZero(d.toString(16))}`}static padZero(e){return e.length<2&&(e=`0${e}`),e.substr(0,2)}static colorToRGBA(e){if(null==e)return[0,0,0,0];const t=Ht.colorCache[e];if(t)return t;let i=e;"var"===e.substr(0,3).valueOf()&&(i=Ht.getColorVariable(e));const r=window.document.createElement("canvas");r.width=r.height=1;const o=r.getContext("2d");o.clearRect(0,0,1,1),o.fillStyle=i,o.fillRect(0,0,1,1);const s=[...o.getImageData(0,0,1,1).data];return Ht.colorCache[e]=s,s}static hslToRgb(e){const t=e.h/360,i=e.s/100,r=e.l/100;let o,s,a;if(0===i)o=s=a=r;else{function n(e,t,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?e+6*(t-e)*i:i<.5?t:i<2/3?e+(t-e)*(2/3-i)*6:e}const l=r<.5?r*(1+i):r+i-r*i,c=2*r-l;o=n(c,l,t+1/3),s=n(c,l,t),a=n(c,l,t-1/3)}return o*=255,s*=255,a*=255,{r:o,g:s,b:a}}static computeColor(e){if(e.attributes?.hvac_action){const t=e.attributes.hvac_action;return t in jt?Dt(e,jt[t]):void 0}if(e.attributes?.rgb_color)return`rgb(${e.attributes.rgb_color.join(",")})`;const t=Dt(e);return t||void 0}static getHaEntityIconStyle(e){const t=Ht.computeColor(e),i=(e=>{if(e.attributes.brightness&&"plant"!==xe(e.entity_id))return`brightness(${(e.attributes.brightness+245)/5}%)`;return""})(e);return{color:t??"var(--state-icon-color)",fill:"currentColor",...i?{filter:i}:{}}}}console.info("%c FLEX-HORSESHOE-CARD %c Version 5.4.5-dev.3 ","color: white; font-weight: bold; background: darkgreen","color: darkgreen; font-weight: bold; background: white");const Ut=200,Jt={xpos:50,ypos:50,horseshoe_radius:90,tickmarks_radius:86},Lt={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed"},Bt={min:0,max:100,width:6,color:"var(--primary-background-color)"},qt={width:12,color:"var(--primary-color)"},Gt={action:"more-info"};class Wt extends ne{constructor(){if(super(),Ht.setElement(this),this.cardId=Math.random().toString(36).substr(2,9),this._hass=void 0,this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.viewBoxSize=Ut,this.colorStops={},this.animations={},this.animations.vlines={},this.animations.hlines={},this.animations.circles={},this.animations.icons={},this.animations.iconsIcon={},this.animations.names={},this.animations.areas={},this.animations.states={},this.resolvedEntityConfigs=[],this.colorCache={},this.isAndroid=!1,this.isSafari=!1,this.iOS=!1,this.resolvedVariables={},this.iconCache={},this.iconsSvg=[],this.pendingIconPath=[],this.iconsId=[],this.bar_mode="normal",this.dev={debug:!0},this.isAndroid=!!window.navigator.userAgent.match(/Android/),!this.isAndroid){const e=window.navigator.userAgent||"",t=e.toLowerCase(),i=window.navigator.platform||"",r=(/iPad|iPhone|iPod/.test(e)||"MacIntel"===i&&window.navigator.maxTouchPoints>1)&&!window.MSStream,o=e.match(/Version\/(\d+)(?:\.[\d.]+)?.*Safari/i),s=o?Number(o[1]):void 0,a=t.match(/\bos\s+(\d+)(?:[._]\d+)*.*like safari/),n=t.match(/\bios\s+(\d+)(?:[._]\d+)*/),l=n?Number(n[1]):a?Number(a[1]):void 0,c=Number.isFinite(s),d=Number.isFinite(l)&&t.includes("like safari"),m=c?s:d?l:void 0;this.iOS=r,this.isSafari=Number.isFinite(m),this.safariMajorVersion=m,this.isHomeAssistantLikeSafari=d,this.isRealSafari=c,this.isSafari14=this.isSafari&&14===m,this.isSafari15=this.isSafari&&15===m,this.isSafari16=this.isSafari&&16===m,this.isSafari17=this.isSafari&&17===m,this.isSafari18=this.isSafari&&18===m,this.isSafari26=this.isSafari&&26===m,this.isSafari27=this.isSafari&&27===m,this.isSafari28=this.isSafari&&28===m,this.isSafari29=this.isSafari&&29===m,this.isSafari30=this.isSafari&&30===m,this.isSafariGte16=this.isSafari&&m>=16,this.dev?.debug&&console.log("browser detection",{ua:e,isAndroid:this.isAndroid,isIOS:this.iOS,isSafari:this.isSafari,isRealSafari:this.isRealSafari,isHomeAssistantLikeSafari:this.isHomeAssistantLikeSafari,safariMajorVersion:this.safariMajorVersion,isSafariGte16:this.isSafariGte16}),this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config)}}static get styles(){return s`
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
    `}_resolveEntityConfigs(e){return e?.dev?.debug&&console.log("resolving entity config for",e?.entities),e?.entities?.map(((e,t)=>{const i={entity_index:t};return ye.getJsTemplateOrValue(i,e)}))??[]}_buildMyIcon(e,t,i){if(!e||!t)return;if(i)return i;if(t.icon)return t.icon;if(e.attributes?.icon)return e.attributes.icon;const r=[t.entity,e.state??"",e.attributes?.device_class??"",e.attributes?.icon??""].join("|");return this.entitiesIcon??={},this.entitiesIconKey??={},this.entitiesIconPending??={},this.entitiesIconKey[t.entity]===r||(this.entitiesIconKey[t.entity]=r,this.entitiesIconPending[t.entity]||(this.entitiesIconPending[t.entity]=!0,(async(e,t,i,r,o)=>{const s=e?.[r.entity_id];if(s?.icon)return s.icon;const a=pt(r);return wt(t,i,a,r,o,s)})(this._hass.entities,this._hass.config,this._hass.connection,e).then((e=>{console.log("async entityIcon resolved",t.entity,e),this.entitiesIconKey[t.entity]===r?this.entitiesIcon[t.entity]!==e&&(this.entitiesIcon[t.entity]=e,this.requestUpdate()):console.log("stale icon ignored",t.entity)})).catch((e=>{console.error("entityIcon failed",t.entity,e)})).finally((()=>{this.entitiesIconPending[t.entity]=!1})))),this.entitiesIcon[t.entity]}_buildEntityStateParts(e,t){const i=void 0!==t.attribute,r=i?this._hass.formatEntityAttributeValueToParts(e,t.attribute):this._hass.formatEntityStateToParts(e),o=i?e.attributes[t.attribute]:e.state,s=void 0===t.decimals||Number.isNaN(Number(o))?void 0:Ie(Number(o),this._hass.locale,{minimumFractionDigits:0,maximumFractionDigits:Number(t.decimals)});return r.map((e=>"value"===e.type&&void 0!==s?{...e,value:s}:"unit"===e.type&&void 0!==t.unit?{...e,value:t.unit}:e))}set hass(e){this._hass=e,ye.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),console.table(Object.keys(this._hass).filter((e=>"function"==typeof this._hass[e])).sort().map((e=>({key:e,value:this._hass[e].toString().slice(0,80)}))));let t=!1;if(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.resolvedEntityConfigs.forEach(((i,r)=>{const o=e.states[i.entity];if(!o)return;this.entities[r]=o;const s=this._buildState(o.state,i),a=o,n=pt(a),l=this._hass.formatEntityStateToParts(a,s,6),c=this._hass.formatEntityStateToParts(a,6.12345),d=this._hass.formatEntityStateToParts(a,6),m=this._hass.formatEntityState(a,s),u=this._hass.formatEntityName(a,i.name);console.log("from set hass, entity, name",i.entity,n,u,l,c,d,m,s);const h=this._buildEntityStateParts(a,i);if(console.log("from set hass, own buildEntityStateParts",i,u,n,h),s!==this.entitiesStr[r]&&(this.entitiesStr[r]=s,t=!0),i.attribute&&Object.prototype.hasOwnProperty.call(o.attributes,i.attribute)){const e=this._buildState(o.attributes[i.attribute],i);e!==this.attributesStr[r]&&(this.attributesStr[r]=e,t=!0)}})),!t)return;this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.horseshoes=this.horseshoes.map((e=>{const t=e.entity_index??0,i=this.resolvedEntityConfigs[t],r=this.entities[t];if(!r||!i)return e;let o=r.state;i.attribute&&void 0!==r.attributes[i.attribute]&&(o=r.attributes[i.attribute]);const s=ye.getJsTemplateOrValue({entity_index:t},e.horseshoe_scale),a=s?.min??0,n=s?.max??100;let l,c,d=!1;if("bidirectional"===(e.bar_mode||"normal")){const t=e.horseshoePathLength,i=Number(o);if(i>=0){const r=Math.min(Ht.calculateValueBetween(0,n,i),1)*(t/2);l=`${r} ${e.circlePathLength-r}`,c=void 0,d=!1}else{const r=(1-Math.min(Ht.calculateValueBetween(a,0,i),1))*(t/2);l=`${r} ${e.circlePathLength-r}`,c=""+-(e.circlePathLength-r),d=!0}}else{l=`${Math.min(Ht.calculateValueBetween(a,n,o),1)*e.horseshoePathLength} ${10*e.radiusSize}`,c=void 0,d=!1}const m=Math.min(Ht.calculateValueBetween(a,n,o),1),u=e.show.horseshoe_style;let h=e.color0,f=e.color1,p=e.color1_offset,g=e.angleCoords,_=e.stroke_color;if("fixed"===u)_=e.horseshoe_state.color,h=e.horseshoe_state.color,f=e.horseshoe_state.color,p="0%";else if("autominmax"===u){const t=this._calculateStrokeColor(o,e.colorStopsMinMax,!0);h=t,f=t,p="0%"}else if("colorstop"===u||"colorstopgradient"===u){const t=this._calculateStrokeColor(o,e.colorStops,"colorstopgradient"===u);h=t,f=t,p="0%"}else"lineargradient"===u&&(g={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},p=`${Math.round(100*(1-m))}%`);return{...e,horseshoe_scale:{...e.horseshoe_scale,...s},dashArray:l,dashOffset:c,bidirectional_negative:d,stroke_color:_,color0:h,color1:f,color1_offset:p,angleCoords:g}}));const i=this.horseshoes[0];this.dashArray=i.dashArray,this.dashOffset=i.dashOffset,this._bidirectional_negative=i.bidirectional_negative,this.stroke_color=i.stroke_color,this.color0=i.color0,this.color1=i.color1,this.color1_offset=i.color1_offset,this.angleCoords=i.angleCoords,this.config.animations&&Object.keys(this.config.animations).map((e=>{const t=e.substr(Number(e.indexOf(".")+1));return this.config.animations[e].map((e=>this.entities[t].state.toLowerCase()===e.state.toLowerCase()&&(e.vlines&&e.vlines.forEach((e=>this._updateAnimationStyles("vlines",e))),e.hlines&&e.hlines.forEach((e=>this._updateAnimationStyles("hlines",e))),e.circles&&e.circles.forEach((e=>this._updateAnimationStyles("circles",e))),e.icons&&e.icons.forEach((e=>{const t=e.animation_id;this.animations.icons[t]&&e.reuse||(this.animations.icons[t]={},this.animations.iconsIcon[t]={});const i=ye.getJsTemplateOrValue(e,e.styles),r=_e.toStyleDict(i);this.animations.icons[t]={...this.animations.icons[t],...r},this.animations.iconsIcon[t]=ye.getJsTemplateOrValue(e,e.icon)})),e.states&&e.states.forEach((e=>this._updateAnimationStyles("states",e))),!0))),!0})),ye.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),this.requestUpdate()}_updateAnimationStyles(e,t){const i=t.animation_id;if(null==i)return;const r=ye.getJsTemplateOrValue(t,t.styles),o=_e.toStyleDict(r);this.animations[e][i]={...t.reuse?this.animations[e][i]??{}:{},...o}}_prepareItemColorStops(e){["states","names","areas","circles","hlines","vlines","icons","horseshoes"].forEach((t=>{const i=e.layout?.[t];Array.isArray(i)&&i.forEach((e=>{if(!e.color_stops)return;const t=ye.getJsTemplateOrValue(e,e.color_stops,{resolveKeys:!0});e._colorStops=be.normalize(t)}))}))}setConfig(e){try{if(!(e=JSON.parse(JSON.stringify(e))).entities)throw Error("No entities defined");if(!e.layout)throw Error("No layout defined");ye.setContext({hass:this._hass,config:e,entities:this.entities,horseshoes:this.horseshoes});const t=this._resolveEntityConfigs(e);if(t){if("sensor"!==xe(t[0].entity)&&t[0].attribute&&!isNaN(t[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}t.forEach((e=>{e.tap_action||(e.tap_action={...Gt})}));const i={texts:[],card_filter:"card--filter-none",bar_mode:e.bar_mode||"normal",...e,show:{...Lt,...e.show},horseshoe_position:{...Jt,...e?.horseshoe_position},horseshoe_scale:{...Bt,...e.horseshoe_scale},horseshoe_state:{...qt,...e.horseshoe_state}},r=Array.isArray(i.layout.horseshoes)?i.layout.horseshoes.map(((e,t)=>({...i,...e,entity_index:e.entity_index??t}))):[{...i,entity_index:0}];if(this.horseshoes=r.map(((e,t)=>{const i=e.entity_index??t,r={...Lt,...e.show??{}},o={...Bt,...e.horseshoe_scale??{}},s={...qt,...e.horseshoe_state??{}},a=e.xpos??e.horseshoe_position?.xpos??e.horseshoe_position?.cx??Jt.xpos??Jt.cx??50,n=e.ypos??e.horseshoe_position?.ypos??e.horseshoe_position?.cy??Jt.ypos??Jt.cy??50;if(!o.min&&0!==o.min||!o.max&&0!==o.max)throw Error(`No horseshoe min/max for scale defined for horseshoe ${t}`);const l=e.color_stops;if(!l)throw console.warn(`No color_stops defined for horseshoe ${t}`),Error(`No color_stops defined for horseshoe ${t}`);const c=ye.getJsTemplateOrValue({entity_index:i},l,{resolveKeys:!0}),d=be.normalize(c),m=d.colors,u=m[0],h=m[m.length-1];let f,p,g=be.normalize({});u&&h&&(g=be.normalize({[o.min]:u.color,[o.max]:h.color}),f=u.color,p=h.color);const _=e.radius??45,y=e.tickmarks_radius??43,b=e.arc_degrees??260,w=_/100*Ut,v=y/100*Ut,$=2*b/360*Math.PI*w,x=2*Math.PI*w;return{...e,entity_index:i,show:r,fill:e.fill??"rgba(0, 0, 0, 0)",xpos:a,ypos:n,bar_mode:e.bar_mode??"normal",horseshoe_scale:o,horseshoe_state:s,radius:_,tickmarks_radius:y,arc_degrees:b,radiusSize:w,tickmarksRadiusSize:v,horseshoePathLength:$,circlePathLength:x,color_stops:l,colorStops:d,colorStopsMinMax:g,color0:f,color1:p,angleCoords:{x1:"0%",y1:"0%",x2:"100%",y2:"0%"},color1_offset:"0%",dashArray:this.dashArray,dashOffset:this.dashOffset,bidirectional_negative:this._bidirectional_negative}})),!this.horseshoes.length)throw Error("No horseshoes defined");const o=this.horseshoes[0];this.colorStops=o.colorStops,this.colorStopsMinMax=o.colorStopsMinMax,this.color0=o.color0,this.color1=o.color1,this.angleCoords=o.angleCoords,this.color1_offset=o.color1_offset,this._prepareItemColorStops(i),this.config=i,this.bar_mode=i.bar_mode||"normal",this.config.layout?.icons&&this.config.layout.icons.forEach(((e,t)=>{this.iconsId[t]=Math.random().toString(36).substr(2,9)})),ye.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes})}catch(t){throw console.error("[FHC setConfig] CONFIG ERROR",{error:t,message:t?.message,stack:t?.stack,config:e}),t}}_getItemStateValue(e={}){const t=e.entity_index??0,i=this.entities?.[t],r=this.config?.entities?.[t];if(!i)return;const o=r?.attribute;return o&&i.attributes&&void 0!==i.attributes[o]?i.attributes[o]:i.state}_getItemColorFromStops(e={}){if(!e._colorStops)return;const t=this._getItemStateValue(e),i=Number(t);return Number.isFinite(i)?this._calculateStrokeColor(i,e._colorStops,!0===e.colorstop_gradient):void 0}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback()}render({config:e}=this){const t=ye.getJsTemplateOrValue({entity_index:0},e?.styles),i=_e.toStyleDict(t);return U`
      <ha-card @click=${e=>this.handlePopup(e,this.entities[0])} style=${he(i)}>
        <div class="container" id="container">${this._renderSvg()}</div>

        <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
          ${this.horseshoes?.map(((e,t)=>J`
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
    `}_renderTickMarks(e){if(!1===e.show?.scale_tickmarks)return J``;const t=e.horseshoe_scale,i=Number(t.min),r=Number(t.max),o=r-i;if(!o)return J``;const s={entity_index:e.entity_index},a=ye.getJsTemplateOrValue(s,e?.horseshoe_tickmarks?.styles),n=_e.toStyleDict(a),l=2*(e.xpos??50),c=2*(e.ypos??50),d={transformOrigin:`${l}px ${c}px`};void 0!==e?.horseshoe_tickmarks?.fill&&(d.fill=e.horseshoe_tickmarks.fill);const m=t.color||"var(--primary-background-color)";d.fill=m;const u={...n,...d},h=t.ticksize||o/10,f=e.arc_degrees||260,p=t.width?t.width/2:3,g=i%h,_=i+(0===g?0:h-g);if(_>r)return J``;const y=Math.floor((r-_)/h)+1,b=Array.from({length:y},((t,r)=>{const s=(f/2-(_+r*h-i)/o*f)*Math.PI/180;return J`
      <circle
        cx="${l-Math.sin(s)*e.tickmarksRadiusSize}"
        cy="${c-Math.cos(s)*e.tickmarksRadiusSize}"
        r="${p}"
        style=${he(u)}>
      </circle>
    `}));return J`${b}`}_renderTickMarksV2(e){if(!e?.show?.scale_tickmarks)return J``;const t=e.xpos??50,i=e.ypos??50,r=2*t,o=2*i,s=e.horseshoe_scale,a=s.color||"var(--primary-background-color)",n=s.ticksize||(s.max-s.min)/10,l=e.arc_degrees||260,c=s.min%n,d=s.min+(0===c?0:n-c),m=(d-s.min)/(s.max-s.min)*l,u=(s.max-d)/n,h=(l-m)/u;let f=Math.floor(u);Math.floor(f*n+d)<=s.max&&(f+=1);const p=s.width?s.width/2:3,g=Array.from({length:f},((t,i)=>{const s=m+(360-i*h-230)*Math.PI/180;return J`
      <circle
        cx="${r-Math.sin(s)*e.tickmarksRadiusSize}"
        cy="${o-Math.cos(s)*e.tickmarksRadiusSize}"
        r="${p}"
        fill="${a}">
      </circle>
    `}));return J`${g}`}_renderSvg(){const e=this.config.card_filter?this.config.card_filter:"card--filter-none";return J`
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
      `}_renderHorseShoes(){return J`
    ${this.horseshoes?.map(((e,t)=>this._renderHorseShoe(e,t)))??J``}
  `}_renderHorseShoe(e,t){if(!1===e.show?.horseshoe)return J``;const i=e.xpos??50,r=e.ypos??50,o=`${i}%`,s=`${r}%`,a=2*i,n=2*r,l=e.bar_mode||"normal",c=`${e.radius}%`,d=e.horseshoe_scale.color||"#000000",m=e.horseshoe_scale.width||6,u=e.horseshoe_state.width||12,h=-90-(e.arc_degrees??260)/2,f=`${e.horseshoePathLength},${e.circlePathLength}`,p=`horseshoe__gradient-${this.cardId}-${t}`,g={entity_index:e.entity_index},_=ye.getJsTemplateOrValue(g,e.horseshoe_scale?.styles),y=_e.toStyleDict(_),b={stroke:d,strokeWidth:m,strokeDasharray:f,strokeLinecap:"round"};void 0!==e.horseshoe_scale?.fill&&(b.fill=e.horseshoe_scale.fill);const w={fill:"none","stroke-linecap":"round",...y,...b},v=ye.getJsTemplateOrValue(g,e.horseshoe_state?.styles),$=_e.toStyleDict(v),x={stroke:`url('#${p}')`,strokeDasharray:e.dashArray,strokeDashoffset:e.dashOffset,strokeWidth:u};void 0!==e.horseshoe_state?.fill&&(x.fill=e.horseshoe_state.fill);const k={fill:"none",transition:"all 2.5s ease-out",strokeLinecap:"round",...$,...x};return"bidirectional"===l?e.bidirectional_negative?J`
        <g id="horseshoe__svg__group-${t}" class="horseshoe__svg__group">
          <circle id="horseshoe__scale-${t}" class="horseshoe__scale" cx="${o}" cy="${s}" r="${c}"
            style=${he(w)}  
            transform="rotate(${h} ${a} ${n})"/>
          <circle id="horseshoe__state__value-${t}" class="horseshoe__state__value" cx="${o}" cy="${s}" r="${c}"
            transform="rotate(-90 ${a} ${n})"
            style=${he(k)} />
          ${this._renderTickMarks(e)}
        </g>
      `:J`
      <g id="horseshoe__svg__group-${t}" class="horseshoe__svg__group">
        <circle id="horseshoe__scale-${t}" class="horseshoe__scale" cx="${o}" cy="${s}" r="${c}"
            style=${he(w)}  
          transform="rotate(${h} ${a} ${n})"/>
        <circle id="horseshoe__state__value-${t}" class="horseshoe__state__value" cx="${o}" cy="${s}" r="${c}"
          transform="rotate(-90 ${a} ${n})"
            style=${he(k)} />
        ${this._renderTickMarks(e)}
      </g>
    `:J`
    <g id="horseshoe__svg__group-${t}" class="horseshoe__svg__group">
      <circle id="horseshoe__scale-${t}" class="horseshoe__scale" cx="${o}" cy="${s}" r="${c}"
        style=${he(w)}
        transform="rotate(${h} ${a} ${n})"/>
      <circle id="horseshoe__state__value-${t}" class="horseshoe__state__value" cx="${o}" cy="${s}" r="${c}"
        transform="rotate(${h} ${a} ${n})"
        style=${he(k)} />
      ${this._renderTickMarks(e)}
    </g>
  `}_renderEntityNames(){const{layout:e}=this.config;if(!e?.names)return J``;const t={"font-size":"1.5em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"},i=e.names.map((e=>{const i=e.entity_index??0,r=ye.getJsTemplateOrValue(e,e.styles),o=_e.toStyleDict(r),s={...t,...o},a={...this.animations?.names?.[e.animation_id]??{}},n=this._getItemColorFromStops(e);n&&(a.stroke=n);const l={...s,...a},c=this.textEllipsis(this._buildName(this.entities[e.entity_index],this.resolvedEntityConfigs[e.entity_index]),e?.max_characters??e?.ellipsis);return J`
        <text
          @click=${e=>this.handlePopup(e,this.entities[i])}
          >
            <tspan
              class="entity__name"
              x="${e.xpos}%"
              y="${e.ypos}%"
              style=${he(l)}>
              ${c}</tspan>
        </text>
      `}));return J`${i}`}_renderEntityAreas(){const{layout:e}=this.config;if(!e?.areas)return J``;const t={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"},i=e.areas.map((e=>{const i=e.entity_index??0,r=ye.getJsTemplateOrValue(e,e.styles),o=_e.toStyleDict(r),s={...t,...o},a={..._e.toStyleDict(this.animations?.areas?.[e.animation_id]??{})},n=this._getItemColorFromStops(e);n&&(a.stroke=n);const l={...s,...a},c=this.textEllipsis(this._buildArea(this.entities[e.entity_index],this.resolvedEntityConfigs[e.entity_index]),e?.max_characters??e?.ellipsis);return J`
        <text
          @click=${e=>this.handlePopup(e,this.entities[i])}
          >
            <tspan
              class="entity__area"
              x="${e.xpos}%"
              y="${e.ypos}%"
              style=${he(l)}>
              ${c}</tspan>
        </text>
      `}));return J`${i}`}_renderState(e){if(!e)return J``;const t=e.entity_index??0,i=e.xpos??50,r=e.ypos??50,o=e.dx??0,s=e.dy??0,a=ye.getJsTemplateOrValue(e,e.styles),n=_e.toStyleDict(a),l=e.uom??{},c=ye.getJsTemplateOrValue(e,l.styles),d=_e.toStyleDict(c),m=l.dx??"0.1",u=l.dy??"-0.45";let h={};this.animations?.states?.[e.animation_id]&&(h={...this.animations.states[e.animation_id]});const f=this._getItemColorFromStops(e);f&&(h.fill=f);const p={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...n,...h},g=p["font-size"];let _=.5,y="em";const b=String(g).trim().match(/^(\d*\.?\d+)([a-z%]+)$/i);b?(_=.6*Number(b[1]),y=b[2]):console.error("Cannot determine font-size for state",g);const w={"font-size":`${_}${y}`},v={...p,opacity:"0.7",...w,...d},$=this.entities[t],x=this.resolvedEntityConfigs[t]??{},k=this._buildStateText($,x),S=this._buildUom($,x);return J`
      <text @click=${e=>this.handlePopup(e,this.entities[t])}>
        <tspan
          class="state__value"
          x="${i}%"
          y="${r}%"
          dx="${o}em"
          dy="${s}em"
          style=${he(p)}
        >${k}</tspan><tspan
          class="state__uom"
          dx="${m}em"
          dy="${u}em"
          style=${he(v)}
        >${S}</tspan>
      </text>
    `}formatStateString(e,t){const i=this._hass.selectedLanguage||this._hass.language;let r={};if(r.language=i,["relative","total","datetime","datetime-short","datetime-short_with-year","datetime_seconds","datetime-numeric","date","date_month","date_month_year","date-short","date-numeric","date_weekday","date_weekday_day","date_weekday-short","time","time-24h","time-24h_date-short","time_weekday","time_seconds"].includes(t.format)){const o=new Date(e);if(!(o instanceof Date)||isNaN(o.getTime()))return e;let s;switch(t.format){case"relative":const e=pe(o,new Date);s=new Intl.RelativeTimeFormat(i,{numeric:"auto"}).format(e.value,e.unit);break;case"total":case"precision":s="Not Yet Supported";break;case"datetime":s=((e,t)=>it(t).format(e))(o,r);break;case"datetime-short":s=((e,t)=>ot(t).format(e))(o,r);break;case"datetime-short_with-year":s=((e,t)=>rt(t).format(e))(o,r);break;case"datetime_seconds":s=((e,t)=>st(t).format(e))(o,r);break;case"datetime-numeric":s=((e,t)=>at(t).format(e))(o,r);break;case"date":s=((e,t)=>He(t).format(e))(o,r);break;case"date_month":s=((e,t)=>qe(t).format(e))(o,r);break;case"date_month_year":s=((e,t)=>Be(t).format(e))(o,r);break;case"date-short":s=Je(o,r);break;case"date-numeric":s=((e,t)=>Ue(t).format(e))(o,r);break;case"date_weekday":s=((e,t)=>Ge(t).format(e))(o,r);break;case"date_weekday-short":s=((e,t)=>We(t).format(e))(o,r);break;case"date_weekday_day":s=((e,t)=>je(t).format(e))(o,r);break;case"time":s=((e,t)=>Xe(t).format(e))(o,r);break;case"time-24h":s=et(o);break;case"time-24h_date-short":const t=pe(o,new Date);s=["second","minute","hour"].includes(t.unit)?et(o):Je(o,r);break;case"time_weekday":s=((e,t)=>Qe(t).format(e))(o,r);break;case"time_seconds":s=((e,t)=>Ze(t).format(e))(o,r)}return s}return isNaN(parseFloat(e))||!isFinite(e)?e:"brightness"===t.format||"brightness_pct"===t.format?`${Math.round(e/255*100)} %`:"duration"===t.format?ct(e,"s"):void 0}_buildStateText(e,t={}){if(!e)return"";const i=e.entity_id,r=this._hass.entities?.[i],o=this._hass.states?.[i],s=xe(i);let a=t.attribute?e.attributes?.[t.attribute]:e.state;if(a=this._buildState(a,t),this.dev.debug&&console.log("In _buildStateText, entityId, buildState",i,a),[void 0,"undefined"].includes(a))return"";void 0!==t.format&&void 0!==a&&(a=this.formatStateString(a,t));const n=t.locale_tag?`${t.locale_tag}${String(a).toLowerCase()}`:void 0;if(a&&isNaN(a)&&(!t.secondary_info||t.attribute)&&(a=n&&this._hass.localize(n)||r?.translation_key&&this._hass.localize(`component.${r.platform}.entity.${s}.${r.translation_key}.state.${a}`)||o?.attributes?.device_class&&this._hass.localize(`component.${s}.entity_component.${o.attributes.device_class}.state.${a}`)||this._hass.localize(`component.${s}.entity_component._.state.${a}`)||a,a=this.textEllipsis?.(a,this.config?.show?.ellipsis)??a),["undefined","unknown","unavailable","-ua-"].includes(a)&&(a=this._hass.localize(`state.default.${a}`)),!isNaN(a)){let e={};e=ze(a,e),void 0!==t.decimals&&(e.maximumFractionDigits=0===e.maximumFractionDigits?0:Number(t.decimals),e.minimumFractionDigits=0),a=Ie(a,this._hass.locale,e),this.dev.debug&&console.log("In _buildStateText, entityId, formatNumber",i,a)}return a}_renderStates(){const{layout:e}=this.config;if(!e)return;if(!e.states)return;const t=e.states.map((e=>J`
            ${this._renderState(e)}
          `));return J`${t}`}computeEntityColor(e){if(!e||"off"===e.state||"unavailable"===e.state||"unknown"===e.state)return"var(--state-icon-color)";const t=e.state;if(!isNaN(t)||t.endsWith("W")||t.endsWith("kWh")||t.endsWith("V"))return"var(--state-icon-color)";const i=e.entity_id.split(".")[0],r=e.attributes.device_class;if("sensor"===i)return"var(--state-icon-color)";if("light"===i&&e.attributes.rgb_color&&"on"===t){const[t,i,r]=e.attributes.rgb_color;return`rgb(${t}, ${i}, ${r})`}return"binary_sensor"===i&&r&&"on"===t?`var(--state-binary_sensor-${r}-on-color, var(--state-icon-active-color))`:"climate"===i?`var(--state-climate-${t}-color, var(--state-icon-active-color))`:"on"===t?`var(--state-${i}-active-color, var(--state-${i}-color, var(--state-icon-active-color)))`:"var(--state-icon-color)"}_renderIcon(e,t){if(!e)return;e.entity=e.entity?e.entity:0,this.iconCache||={},this.iconsSvg||=[],this.pendingIconPath||=[];const i=12*(e.icon_size?e.icon_size:2),r=(e.xpos??50)/100,o=(e.ypos??50)/100,s=r*Ut,a=o*Ut,n=e.align?e.align:"center",l="center"===n?.5:"start"===n?-1:1;let c=s-i*l,d=a-i*l,m=i;const u=e.entity_index??0,h=this.entities[u],f=Ht.getHaEntityIconStyle(h),p={};p.fill=f.fill,p.color=f.color,p.filter=f.filter;const g=ye.getJsTemplateOrValue(e,e.styles);let _=_e.toStyleDict(g);const y=this.animations?.icons?.[e.animation_id]??{},b=this._getItemColorFromStops(e);b&&(_.fill=b),_={...p,..._,...y};const w=this._buildMyIcon(this.entities[u],this.resolvedEntityConfigs[u],this.animations?.iconsIcon?.[e.animation_id]);console.log("resolved HA icon",this.entities[u],w);const v=this._buildIcon(this.entities[u],this.resolvedEntityConfigs[u],this.animations?.iconsIcon?.[e.animation_id]);if(this.iconCache[v])this.iconsSvg[t]=this.iconCache[v];else if(this.iconsSvg[t]=void 0,this.pendingIconPath[t]!==v){this.pendingIconPath[t]=v;let e=0;const i=40,r=50,o=()=>{if(this.pendingIconPath[t]!==v)return;const s=this._getRenderedHaIconPath(t);if(s)return this.iconsSvg[t]=s,this.iconCache[v]=s,this.pendingIconPath[t]=void 0,void this.requestUpdate();e+=1,e>=i?this.pendingIconPath[t]=void 0:window.setTimeout(o,r)};(this?.updateComplete&&"function"==typeof this.updateComplete.then||this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((e=>window.requestAnimationFrame(e)))).then((()=>{window.setTimeout(o,0)}))}const $=this.iconsSvg[t];if($){const r=s-i*l,o=a-.5*i-.25*i,n=i/24;return J`
      <g
        id="icon-rendered-${this.iconsId[t]}"
        style="${he(_)}"
        x="${r}px"
        y="${o}px"
        transform-origin="${s} ${a}"
        @click=${t=>this.handlePopup(t,this.entities[e.entity_index])}
      >
        <rect
          x="${r}"
          y="${o}"
          height="${i}px"
          width="${i}px"
          stroke-width="0px"
          fill="rgba(0,0,0,0)"
        ></rect>

        <path
          d="${$}"
          transform="translate(${r},${o}) scale(${n})"
        ></path>
      </g>
    `}return J`
    <foreignObject
      width="0px"
      height="0px"
      x="${c}"
      y="${d}"
      overflow="hidden"
    >
      <body>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          class="div__icon hover"
          style="
            line-height: ${m}px;
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
  `}_getRenderedHaIconPath(e){const t=this.shadowRoot.getElementById(`icon-${this.iconsId[e]}`);return t?.shadowRoot?.querySelector("*")?.path}_scheduleIconPathRead(e,t){if(!e)return;if(this.iconCache[e])return void(this.iconsSvg[t]=this.iconCache[e]);if(this.pendingIconPath[t]===e)return;this.pendingIconPath[t]=e;let i=0;const r=()=>{if(this.pendingIconPath[t]!==e)return;if(this.iconCache[e])return this.iconsSvg[t]=this.iconCache[e],this.pendingIconPath[t]=void 0,void this.requestUpdate();const o=this._getRenderedHaIconPath();if(o)return this.iconsSvg[t]=o,this.iconCache[e]=o,this.pendingIconPath[t]=void 0,void this.requestUpdate();i+=1,i>=40?this.pendingIconPath[t]=void 0:this._iconPathTimer=window.setTimeout(r,50)};(this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((e=>{window.requestAnimationFrame(e)}))).then((()=>{this._iconPathTimer=window.setTimeout(r,0)}))}_renderIcons(){const{layout:e}=this.config;if(!e)return;if(!e.icons)return;const t=e.icons.map(((e,t)=>J`
            ${this._renderIcon(e,t)}
          `));return J`${t}`}_renderHorizontalLines(){const{layout:e}=this.config;if(!e?.hlines)return J``;const t={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2"},i=e.hlines.map((e=>{const i=e.entity_index??0,r=ye.getJsTemplateOrValue(e,e.styles),o=_e.toStyleDict(r),s={...t,...o},a={..._e.toStyleDict(this.animations?.hlines?.[e.animation_id]??{})},n=this._getItemColorFromStops(e);n&&(a.stroke=n);const l={...s,...a};return J`
      <line
        @click=${e=>this.handlePopup(e,this.entities[i])}
        class="line__horizontal"
        x1="${e.xpos-e.length/2}%"
        y1="${e.ypos}%"
        x2="${e.xpos+e.length/2}%"
        y2="${e.ypos}%" 
        style=${he(l)}
      ></line>
    `}));return J`${i}`}_renderVerticalLines(){const{layout:e}=this.config;if(!e?.vlines)return J``;const t={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2"},i=e.vlines.map((e=>{const i=e.entity_index??0,r=ye.getJsTemplateOrValue(e,e.styles),o=_e.toStyleDict(r),s={...t,...o},a={..._e.toStyleDict(this.animations?.vlines?.[e.animation_id]??{})},n=this._getItemColorFromStops(e);n&&(a.stroke=n);const l={...s,...a};return J`
      <line
        @click=${e=>this.handlePopup(e,this.entities[i])}
        class="line__vertical"
        x1="${e.xpos}%"
        y1="${e.ypos-e.length/2}%"
        x2="${e.xpos}%"
        y2="${e.ypos+e.length/2}%"
        style=${he(l)}
      ></line>
    `}));return J`${i}`}_renderCircles(){const{layout:e}=this.config;if(!e?.circles)return J``;const t={},i=e.circles.map((e=>{const i=e.entity_index??0,r=ye.getJsTemplateOrValue(e,e.styles),o=_e.toStyleDict(r),s={...t,...o},a={..._e.toStyleDict(this.animations?.circles?.[e.animation_id]??{})},n=this._getItemColorFromStops(e);n&&(a.stroke=n);const l={...s,...a};return J`
      <circle
        @click=${e=>this.handlePopup(e,this.entities[i])}
        class="svg__dot"
        cx="${e.xpos}%"
        cy="${e.ypos}%"
        r="${e.radius}"
        style=${he(l)}
      ></circle>
    `}));return J`${i}`}_handleClick(e,t,i,r,o){let s;switch(r.action){case"more-info":s=new Event("hass-more-info",{composed:!0}),s.detail={entityId:o},e.dispatchEvent(s);break;case"navigate":if(!r.navigation_path)return;window.history.pushState(null,"",r.navigation_path),s=new Event("location-changed",{composed:!0}),s.detail={replace:!1},window.dispatchEvent(s);break;case"call-service":{if(!r.service)return;const[e,i]=r.service.split(".",2),o={...r.service_data};t.callService(e,i,o);break}case"fire-dom-event":s=new Event("ll-custom",{composed:!0,bubbles:!0}),s.detail=r,e.dispatchEvent(s)}}handlePopup(e,t){e.stopPropagation();const i=this.resolvedEntityConfigs.find((e=>e.entity===t.entity_id)),r=i?.tap_action??this.config?.tap_action??{action:"more-info"};this._handleClick(this,this._hass,this.config,r,t.entity_id)}textEllipsis(e,t){return t&&t<e.length?e.slice(0,t-1).concat("..."):e}_buildArea(e,t){if(t.area)return t.area;if(!this._hass||!this._hass.areas)return"";const i=this._hass.entities&&this._hass.entities[t.entity];let r=i?i.area_id:null;if(!r&&i&&i.device_id&&this._hass.devices){const e=this._hass.devices[i.device_id];r=e?e.area_id:null}if(r){const e=this._hass.areas[r];return e?e.name:""}return"?"}_buildName(e,t){return t.name??e.attributes.friendly_name??e?.entity_id??"?"}_buildIcon(e,t,i){return i||t?.icon||e?.attributes?.icon||Ce(e)}_buildUom(e,t){return t.unit||e.attributes.unit_of_measurement||""}_buildState(e,t){if(void 0===e)return e;if(null===e)return e;if(t.convert){let i,r,o=t.convert.match(/(^\w+)\((\d+)\)/);switch(null===o?i=t.convert:3===o.length&&(i=o[1],r=Number(o[2])),i){case"brightness_pct":e="undefined"===e?"undefined":`${Math.round(e/255*100)}`;break;case"multiply":e=`${Math.round(e*r)}`;break;case"divide":e=`${Math.round(e/r)}`;break;case"rgb_csv":case"rgb_hex":if(t.attribute){let r=this._hass.states[t.entity];switch(r.attributes.color_mode){case"unknown":case"onoff":case"brightness":case"white":break;case"color_temp":if(r.attributes.color_temp_kelvin){let t=Ot(r.attributes.color_temp_kelvin);const o=xt(t);o[1]<.4&&(o[1]<.1?o[2]=225:o[1]=.4),t=kt(o),t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===i?`${t[0]},${t[1]},${t[2]}`:$t(t)}else e="rgb_csv"===i?"255,255,255":"#ffffff00";break;case"hs":{let t=St([r.attributes.hs_color[0],r.attributes.hs_color[1]/100]);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===i?`${t[0]},${t[1]},${t[2]}`:$t(t)}break;case"rgb":{const t=xt(this.stateObj.attributes.rgb_color);t[1]<.4&&(t[1]<.1?t[2]=225:t[1]=.4);const r=kt(t);e="rgb_csv"===i?r.toString():$t(r)}break;case"rgbw":{let t=(e=>{const[t,i,r,o]=e;return Mt([t,i,r,o],[t+o,i+o,r+o])})(r.attributes.rgbw_color);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===i?`${t[0]},${t[1]},${t[2]}`:$t(t)}break;case"rgbww":{let t=Pt(r.attributes.rgbww_color,r.attributes?.min_color_temp_kelvin,r.attributes?.max_color_temp_kelvin);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===i?`${t[0]},${t[1]},${t[2]}`:$t(t)}break;case"xy":if(r.attributes.hs_color){let t=St([r.attributes.hs_color[0],r.attributes.hs_color[1]/100]);const o=xt(t);o[1]<.4&&(o[1]<.1?o[2]=225:o[1]=.4),t=kt(o),t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===i?`${t[0]},${t[1]},${t[2]}`:$t(t)}else if(r.attributes.color){let t={};t.l=r.attributes.brightness,t.h=r.attributes.color.h||r.attributes.color.hue,t.s=r.attributes.color.s||r.attributes.color.saturation;let{r:o,g:s,b:a}=Ht.hslToRgb(t);if("rgb_csv"===i)e=`${o},${s},${a}`;else{e=`#${Ht.padZero(o.toString(16))}${Ht.padZero(s.toString(16))}${Ht.padZero(a.toString(16))}`}}else r.attributes.xy_color}}break;default:console.error(`Unknown converter [${i}] specified for entity [${t.entity}]!`)}}return void 0!==e?Number.isNaN(e)?e:e.toString():void 0}_calculateStrokeColor(e,t,i){const r=t?.colors??[];if(!r.length)return;const o=Number(e);if(!Number.isFinite(o))return r[0].color;if(o<=r[0].value)return r[0].color;const s=r[r.length-1];if(o>=s.value)return s.color;for(let a=0;a<r.length-1;a+=1){const e=r[a],t=r[a+1];if(o>=e.value&&o<t.value){if(!i)return e.color;const r=Ht.calculateValueBetween(e.value,t.value,o);return Ht.getGradientValue(e.color,t.color,r)}}return s.color}_computeEntity(e){return e.substr(e.indexOf(".")+1)}getCardSize(){return 4}}customElements.get("flex-horseshoe-card")||customElements.define("flex-horseshoe-card",Wt);var Yt=Object.freeze({__proto__:null,ENTITY_COMPONENT_ICONS:{person:{_:{default:"mdi:account",state:{not_home:"mdi:account-arrow-right"}}},number:{_:{default:"mdi:ray-vertex"},apparent_power:{default:"mdi:flash"},aqi:{default:"mdi:air-filter"},atmospheric_pressure:{default:"mdi:thermometer-lines"},battery:{default:"mdi:battery"},carbon_dioxide:{default:"mdi:molecule-co2"},carbon_monoxide:{default:"mdi:molecule-co"},current:{default:"mdi:current-ac"},data_rate:{default:"mdi:transmission-tower"},data_size:{default:"mdi:database"},distance:{default:"mdi:arrow-left-right"},duration:{default:"mdi:progress-clock"},energy:{default:"mdi:lightning-bolt"},energy_storage:{default:"mdi:car-battery"},frequency:{default:"mdi:sine-wave"},gas:{default:"mdi:meter-gas"},humidity:{default:"mdi:water-percent"},illuminance:{default:"mdi:brightness-5"},irradiance:{default:"mdi:sun-wireless"},moisture:{default:"mdi:water-percent"},monetary:{default:"mdi:cash"},nitrogen_dioxide:{default:"mdi:molecule"},nitrogen_monoxide:{default:"mdi:molecule"},nitrous_oxide:{default:"mdi:molecule"},ozone:{default:"mdi:molecule"},ph:{default:"mdi:ph"},pm1:{default:"mdi:molecule"},pm10:{default:"mdi:molecule"},pm25:{default:"mdi:molecule"},pm4:{default:"mdi:molecule"},power:{default:"mdi:flash"},power_factor:{default:"mdi:angle-acute"},precipitation:{default:"mdi:weather-rainy"},precipitation_intensity:{default:"mdi:weather-pouring"},pressure:{default:"mdi:gauge"},reactive_power:{default:"mdi:flash"},signal_strength:{default:"mdi:wifi"},sound_pressure:{default:"mdi:ear-hearing"},speed:{default:"mdi:speedometer"},sulfur_dioxide:{default:"mdi:molecule"},temperature:{default:"mdi:thermometer"},volatile_organic_compounds:{default:"mdi:molecule"},volatile_organic_compounds_parts:{default:"mdi:molecule"},voltage:{default:"mdi:sine-wave"},volume:{default:"mdi:car-coolant-level"},volume_storage:{default:"mdi:storage-tank"},water:{default:"mdi:water"},weight:{default:"mdi:weight"},wind_speed:{default:"mdi:weather-windy"}},select:{_:{default:"mdi:format-list-bulleted"}},tts:{_:{default:"mdi:speaker-message"}},datetime:{_:{default:"mdi:calendar-clock"}},vacuum:{_:{default:"mdi:robot-vacuum"}},wake_word:{_:{default:"mdi:chat-sleep"}},light:{_:{default:"mdi:lightbulb"}},alarm_control_panel:{_:{default:"mdi:shield",state:{armed_away:"mdi:shield-lock",armed_custom_bypass:"mdi:security",armed_home:"mdi:shield-home",armed_night:"mdi:shield-moon",armed_vacation:"mdi:shield-airplane",disarmed:"mdi:shield-off",pending:"mdi:shield-outline",triggered:"mdi:bell-ring"}}},text:{_:{default:"mdi:form-textbox"}},lawn_mower:{_:{default:"mdi:robot-mower"}},siren:{_:{default:"mdi:bullhorn"}},input_boolean:{_:{default:"mdi:check-circle-outline",state:{off:"mdi:close-circle-outline"}}},lock:{_:{default:"mdi:lock",state:{jammed:"mdi:lock-alert",locking:"mdi:lock-clock",unlocked:"mdi:lock-open",unlocking:"mdi:lock-clock",opening:"mdi:lock-clock",open:"mdi:lock-open-variant"}}},calendar:{_:{default:"mdi:calendar",state:{on:"mdi:calendar-check",off:"mdi:calendar-blank"}}},image:{_:{default:"mdi:image"}},device_tracker:{_:{default:"mdi:account",state:{not_home:"mdi:account-arrow-right"}}},scene:{_:{default:"mdi:palette"}},script:{_:{default:"mdi:script-text",state:{on:"mdi:script-text-play"}}},todo:{_:{default:"mdi:clipboard-list"}},cover:{_:{default:"mdi:window-open",state:{closed:"mdi:window-closed",closing:"mdi:arrow-down-box",opening:"mdi:arrow-up-box"}},blind:{default:"mdi:blinds-horizontal",state:{closed:"mdi:blinds-horizontal-closed",closing:"mdi:arrow-down-box",opening:"mdi:arrow-up-box"}},curtain:{default:"mdi:curtains",state:{closed:"mdi:curtains-closed",closing:"mdi:arrow-collapse-horizontal",opening:"mdi:arrow-split-vertical"}},damper:{default:"mdi:circle",state:{closed:"mdi:circle-slice-8"}},door:{default:"mdi:door-open",state:{closed:"mdi:door-closed"}},garage:{default:"mdi:garage-open",state:{closed:"mdi:garage",closing:"mdi:arrow-down-box",opening:"mdi:arrow-up-box"}},gate:{default:"mdi:gate-open",state:{closed:"mdi:gate",closing:"mdi:arrow-right",opening:"mdi:arrow-right"}},shade:{default:"mdi:roller-shade",state:{closed:"mdi:roller-shade-closed",closing:"mdi:arrow-down-box",opening:"mdi:arrow-up-box"}},shutter:{default:"mdi:window-shutter-open",state:{closed:"mdi:window-shutter",closing:"mdi:arrow-down-box",opening:"mdi:arrow-up-box"}},window:{default:"mdi:window-open",state:{closed:"mdi:window-closed",closing:"mdi:arrow-down-box",opening:"mdi:arrow-up-box"}}},switch:{_:{default:"mdi:toggle-switch-variant"},switch:{default:"mdi:toggle-switch-variant",state:{off:"mdi:toggle-switch-variant-off"}},outlet:{default:"mdi:power-plug",state:{off:"mdi:power-plug-off"}}},button:{_:{default:"mdi:button-pointer"},restart:{default:"mdi:restart"},identify:{default:"mdi:crosshairs-question"},update:{default:"mdi:package-up"}},water_heater:{_:{default:"mdi:water-boiler",state:{off:"mdi:water-boiler-off"},state_attributes:{operation_mode:{default:"mdi:circle-medium",state:{eco:"mdi:leaf",electric:"mdi:lightning-bolt",gas:"mdi:fire-circle",heat_pump:"mdi:heat-wave",high_demand:"mdi:finance",off:"mdi:power",performance:"mdi:rocket-launch"}}}}},binary_sensor:{_:{default:"mdi:radiobox-blank",state:{on:"mdi:checkbox-marked-circle"}},battery:{default:"mdi:battery",state:{on:"mdi:battery-outline"}},battery_charging:{default:"mdi:battery",state:{on:"mdi:battery-charging"}},carbon_monoxide:{default:"mdi:smoke-detector",state:{on:"mdi:smoke-detector-alert"}},cold:{default:"mdi:thermometer",state:{on:"mdi:snowflake"}},connectivity:{default:"mdi:close-network-outline",state:{on:"mdi:check-network-outline"}},door:{default:"mdi:door-closed",state:{on:"mdi:door-open"}},garage_door:{default:"mdi:garage",state:{on:"mdi:garage-open"}},gas:{default:"mdi:check-circle",state:{on:"mdi:alert-circle"}},heat:{default:"mdi:thermometer",state:{on:"mdi:fire"}},light:{default:"mdi:brightness-5",state:{on:"mdi:brightness-7"}},lock:{default:"mdi:lock",state:{on:"mdi:lock-open"}},moisture:{default:"mdi:water-off",state:{on:"mdi:water"}},motion:{default:"mdi:motion-sensor-off",state:{on:"mdi:motion-sensor"}},moving:{default:"mdi:arrow-right",state:{on:"mdi:octagon"}},occupancy:{default:"mdi:home-outline",state:{on:"mdi:home"}},opening:{default:"mdi:square",state:{on:"mdi:square-outline"}},plug:{default:"mdi:power-plug-off",state:{on:"mdi:power-plug"}},power:{default:"mdi:power-plug-off",state:{on:"mdi:power-plug"}},presence:{default:"mdi:home-outline",state:{on:"mdi:home"}},problem:{default:"mdi:check-circle",state:{on:"mdi:alert-circle"}},running:{default:"mdi:stop",state:{on:"mdi:play"}},safety:{default:"mdi:check-circle",state:{on:"mdi:alert-circle"}},smoke:{default:"mdi:smoke-detector-variant",state:{on:"mdi:smoke-detector-variant-alert"}},sound:{default:"mdi:music-note-off",state:{on:"mdi:music-note"}},tamper:{default:"mdi:check-circle",state:{on:"mdi:alert-circle"}},update:{default:"mdi:package",state:{on:"mdi:package-up"}},vibration:{default:"mdi:crop-portrait",state:{on:"mdi:vibrate"}},window:{default:"mdi:window-closed",state:{on:"mdi:window-open"}}},sensor:{_:{default:"mdi:eye"},apparent_power:{default:"mdi:flash"},aqi:{default:"mdi:air-filter"},atmospheric_pressure:{default:"mdi:thermometer-lines"},carbon_dioxide:{default:"mdi:molecule-co2"},carbon_monoxide:{default:"mdi:molecule-co"},current:{default:"mdi:current-ac"},data_rate:{default:"mdi:transmission-tower"},data_size:{default:"mdi:database"},date:{default:"mdi:calendar"},distance:{default:"mdi:arrow-left-right"},duration:{default:"mdi:progress-clock"},energy:{default:"mdi:lightning-bolt"},energy_storage:{default:"mdi:car-battery"},enum:{default:"mdi:eye"},frequency:{default:"mdi:sine-wave"},gas:{default:"mdi:meter-gas"},humidity:{default:"mdi:water-percent"},illuminance:{default:"mdi:brightness-5"},irradiance:{default:"mdi:sun-wireless"},moisture:{default:"mdi:water-percent"},monetary:{default:"mdi:cash"},nitrogen_dioxide:{default:"mdi:molecule"},nitrogen_monoxide:{default:"mdi:molecule"},nitrous_oxide:{default:"mdi:molecule"},ozone:{default:"mdi:molecule"},ph:{default:"mdi:ph"},pm1:{default:"mdi:molecule"},pm10:{default:"mdi:molecule"},pm25:{default:"mdi:molecule"},pm4:{default:"mdi:molecule"},power:{default:"mdi:flash"},power_factor:{default:"mdi:angle-acute"},precipitation:{default:"mdi:weather-rainy"},precipitation_intensity:{default:"mdi:weather-pouring"},pressure:{default:"mdi:gauge"},reactive_power:{default:"mdi:flash"},signal_strength:{default:"mdi:wifi"},sound_pressure:{default:"mdi:ear-hearing"},speed:{default:"mdi:speedometer"},sulfur_dioxide:{default:"mdi:molecule"},temperature:{default:"mdi:thermometer"},timestamp:{default:"mdi:clock"},uptime:{default:"mdi:clock-start"},volatile_organic_compounds:{default:"mdi:molecule"},volatile_organic_compounds_parts:{default:"mdi:molecule"},voltage:{default:"mdi:sine-wave"},volume:{default:"mdi:car-coolant-level"},volume_storage:{default:"mdi:storage-tank"},water:{default:"mdi:water"},weight:{default:"mdi:weight"},wind_speed:{default:"mdi:weather-windy"}},humidifier:{_:{default:"mdi:air-humidifier",state:{off:"mdi:air-humidifier-off"},state_attributes:{action:{default:"mdi:circle-medium",state:{drying:"mdi:arrow-down-bold",humidifying:"mdi:arrow-up-bold",idle:"mdi:clock-outline",off:"mdi:power"}},mode:{default:"mdi:circle-medium",state:{auto:"mdi:refresh-auto",away:"mdi:account-arrow-right",baby:"mdi:baby-carriage",boost:"mdi:rocket-launch",comfort:"mdi:sofa",eco:"mdi:leaf",home:"mdi:home",normal:"mdi:water-percent",sleep:"mdi:power-sleep"}}}}},valve:{_:{default:"mdi:pipe-valve"},gas:{default:"mdi:meter-gas"},water:{default:"mdi:pipe-valve"}},time:{_:{default:"mdi:clock"}},media_player:{_:{default:"mdi:cast",state:{off:"mdi:cast-off",paused:"mdi:cast-connected",playing:"mdi:cast-connected"}},receiver:{default:"mdi:audio-video",state:{off:"mdi:audio-video-off"}},speaker:{default:"mdi:speaker",state:{off:"mdi:speaker-off",paused:"mdi:speaker-pause",playing:"mdi:speaker-play"}},tv:{default:"mdi:television",state:{off:"mdi:television-off",paused:"mdi:television-pause",playing:"mdi:television-play"}}},air_quality:{_:{default:"mdi:air-filter"}},camera:{_:{default:"mdi:video",state:{off:"mdi:video-off"}}},date:{_:{default:"mdi:calendar"}},fan:{_:{default:"mdi:fan",state:{off:"mdi:fan-off"},state_attributes:{direction:{default:"mdi:rotate-right",state:{reverse:"mdi:rotate-left"}}}}},automation:{_:{default:"mdi:robot",state:{off:"mdi:robot-off",unavailable:"mdi:robot-confused"}}},weather:{_:{default:"mdi:weather-partly-cloudy",state:{"clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",exceptional:"mdi:alert-circle-outline",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",sunny:"mdi:weather-sunny",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant"}}},climate:{_:{default:"mdi:thermostat",state_attributes:{fan_mode:{default:"mdi:circle-medium",state:{diffuse:"mdi:weather-windy",focus:"mdi:target",high:"mdi:speedometer",low:"mdi:speedometer-slow",medium:"mdi:speedometer-medium",middle:"mdi:speedometer-medium",off:"mdi:fan-off",on:"mdi:fan"}},hvac_action:{default:"mdi:circle-medium",state:{cooling:"mdi:snowflake",drying:"mdi:water-percent",fan:"mdi:fan",heating:"mdi:fire",idle:"mdi:clock-outline",off:"mdi:power",preheating:"mdi:heat-wave",defrosting:"mdi:snowflake-melt"}},preset_mode:{default:"mdi:circle-medium",state:{activity:"mdi:motion-sensor",away:"mdi:account-arrow-right",boost:"mdi:rocket-launch",comfort:"mdi:sofa",eco:"mdi:leaf",home:"mdi:home",sleep:"mdi:bed"}},swing_mode:{default:"mdi:circle-medium",state:{both:"mdi:arrow-all",horizontal:"mdi:arrow-left-right",off:"mdi:arrow-oscillating-off",on:"mdi:arrow-oscillating",vertical:"mdi:arrow-up-down"}}}}},stt:{_:{default:"mdi:microphone-message"}},update:{_:{default:"mdi:package-up",state:{off:"mdi:package"}}},event:{_:{default:"mdi:eye-check"},button:{default:"mdi:gesture-tap-button"},doorbell:{default:"mdi:doorbell"},motion:{default:"mdi:motion-sensor"}}}});

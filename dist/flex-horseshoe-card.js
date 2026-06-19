/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),s=new WeakMap;let i=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const r=this.t;if(e&&void 0===t){const e=void 0!==r&&1===r.length;e&&(t=s.get(r)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(r,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const s=1===t.length?t[0]:e.reduce(((e,r,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[s+1]),t[0]);return new i(s,t,r)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return(t=>new i("string"==typeof t?t:t+"",void 0,r))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:n,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:c,getOwnPropertySymbols:u,getPrototypeOf:d}=Object,p=globalThis,m=p.trustedTypes,g=m?m.emptyScript:"",f=p.reactiveElementPolyfillSupport,y=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=null!==t;break;case Number:r=null===t?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch(t){r=null}}return r}},b=(t,e)=>!n(t,e),_={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:i}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);i?.call(this,e),this.requestUpdate(t,o,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=d(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...c(t),...u(t)];for(const r of e)this.createProperty(r,t[r])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(const[e,r]of this.elementProperties){const t=this._$Eu(e,r);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const t of r)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const r=e.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((r,s)=>{if(e)r.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of s){const s=document.createElement("style"),i=t.litNonce;void 0!==i&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}})(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(void 0!==s&&!0===r.reflect){const i=(void 0!==r.converter?.toAttribute?r.converter:v).toAttribute(e,r.type);this._$Em=t,null==i?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(t,e){const r=this.constructor,s=r._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=r.getPropertyOptions(s),i="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const o=i.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,r,s=!1,i){if(void 0!==t){const o=this.constructor;if(!1===s&&(i=this[t]),r??=o.getPropertyOptions(t),!((r.hasChanged??b)(i,e)||r.useDefault&&r.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,r))))return;this.C(t,e,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:i},o){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==i||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,r]of t){const{wrapped:t}=r,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,r,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[y("elementProperties")]=new Map,x[y("finalized")]=new Map,f?.({ReactiveElement:x}),(p.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,$=w.trustedTypes,S=$?$.createPolicy("flex-horseshoe-card-lit-html",{createHTML:t=>t}):void 0,k="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,A="?"+C,M=`<${A}>`,E=document,N=()=>E.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,z=Array.isArray,I="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,O=/-->/g,j=/>/g,R=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,V=/"/g,G=/^(?:script|style|textarea|title)$/i,L=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),U=L(1),H=L(2),q=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),F=new WeakMap,W=E.createTreeWalker(E,129);function K(t,e){if(!z(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const J=(t,e)=>{const r=t.length-1,s=[];let i,o=2===e?"<svg>":3===e?"<math>":"",a=P;for(let n=0;n<r;n++){const e=t[n];let r,l,h=-1,c=0;for(;c<e.length&&(a.lastIndex=c,l=a.exec(e),null!==l);)c=a.lastIndex,a===P?"!--"===l[1]?a=O:void 0!==l[1]?a=j:void 0!==l[2]?(G.test(l[2])&&(i=RegExp("</"+l[2],"g")),a=R):void 0!==l[3]&&(a=R):a===R?">"===l[0]?(a=i??P,h=-1):void 0===l[1]?h=-2:(h=a.lastIndex-l[2].length,r=l[1],a=void 0===l[3]?R:'"'===l[3]?V:D):a===V||a===D?a=R:a===O||a===j?a=P:(a=R,i=void 0);const u=a===R&&t[n+1].startsWith("/>")?" ":"";o+=a===P?e+M:h>=0?(s.push(r),e.slice(0,h)+k+e.slice(h)+C+u):e+C+(-2===h?n:u)}return[K(t,o+(t[r]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class X{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let i=0,o=0;const a=t.length-1,n=this.parts,[l,h]=J(t,e);if(this.el=X.createElement(l,r),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=W.nextNode())&&n.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(k)){const e=h[o++],r=s.getAttribute(t).split(C),a=/([.?@])?(.*)/.exec(e);n.push({type:1,index:i,name:a[2],strings:r,ctor:"."===a[1]?et:"?"===a[1]?rt:"@"===a[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(C)&&(n.push({type:6,index:i}),s.removeAttribute(t));if(G.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=$?$.emptyScript:"";for(let r=0;r<e;r++)s.append(t[r],N()),W.nextNode(),n.push({type:2,index:++i});s.append(t[e],N())}}}else if(8===s.nodeType)if(s.data===A)n.push({type:2,index:i});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)n.push({type:7,index:i}),t+=C.length-1}i++}}static createElement(t,e){const r=E.createElement("template");return r.innerHTML=t,r}}function Z(t,e,r=t,s){if(e===q)return e;let i=void 0!==s?r._$Co?.[s]:r._$Cl;const o=T(e)?void 0:e._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),void 0===o?i=void 0:(i=new o(t),i._$AT(t,r,s)),void 0!==s?(r._$Co??=[])[s]=i:r._$Cl=i),void 0!==i&&(e=Z(t,i._$AS(t,e.values),i,s)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??E).importNode(e,!0);W.currentNode=s;let i=W.nextNode(),o=0,a=0,n=r[0];for(;void 0!==n;){if(o===n.index){let e;2===n.type?e=new Q(i,i.nextSibling,this,t):1===n.type?e=new n.ctor(i,n.name,n.strings,this,t):6===n.type&&(e=new it(i,this,t)),this._$AV.push(e),n=r[++a]}o!==n?.index&&(i=W.nextNode(),o++)}return W.currentNode=E,s}p(t){let e=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}let Q=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),T(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>z(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:r}=t,s="number"==typeof r?this._$AC(t):(void 0===r.el&&(r.el=X.createElement(K(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Y(s,this),r=t.u(this.options);t.p(e),this.T(r),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new X(t)),e}k(e){z(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let s,i=0;for(const o of e)i===r.length?r.push(s=new t(this.O(N()),this.O(N()),this,this.options)):s=r[i],s._$AI(o),i++;i<r.length&&(this._$AR(s&&s._$AB.nextSibling,i),r.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}};class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,i){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=i,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=B}_$AI(t,e=this,r,s){const i=this.strings;let o=!1;if(void 0===i)t=Z(this,t,e,0),o=!T(t)||t!==this._$AH&&t!==q,o&&(this._$AH=t);else{const s=t;let a,n;for(t=i[0],a=0;a<i.length-1;a++)n=Z(this,s[r+a],e,a),n===q&&(n=this._$AH[a]),o||=!T(n)||n!==this._$AH[a],n===B?t=B:t!==B&&(t+=(n??"")+i[a+1]),this._$AH[a]=n}o&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class rt extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class st extends tt{constructor(t,e,r,s,i){super(t,e,r,s,i),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??B)===q)return;const r=this._$AH,s=t===B&&r!==B||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,i=t!==B&&(r===B||s);s&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const ot=w.litHtmlPolyfillSupport;ot?.(X,Q),(w.litHtmlVersions??=[]).push("3.3.2");const at=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let nt=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,r)=>{const s=r?.renderBefore??e;let i=s._$litPart$;if(void 0===i){const t=r?.renderBefore??null;s._$litPart$=i=new Q(e.insertBefore(N(),t),t,void 0,r??{})}return i._$AI(t),i})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};nt._$litElement$=!0,nt.finalized=!0,at.litElementHydrateSupport?.({LitElement:nt});const lt=at.litElementPolyfillSupport;lt?.({LitElement:nt}),(at.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ht=1;let ct=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ut="important",dt=" !"+ut,pt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends ct{constructor(t){if(super(t),t.type!==ht||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,r)=>{const s=t[r];return null==s?e:e+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`}),"")}update(t,[e]){const{style:r}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const s of this.ft)null==e[s]&&(this.ft.delete(s),s.includes("-")?r.removeProperty(s):r[s]=null);for(const s in e){const t=e[s];if(null!=t){this.ft.add(s);const e="string"==typeof t&&t.endsWith(dt);s.includes("-")||e?r.setProperty(s,e?t.slice(0,-11):t,e?ut:""):r[s]=t}}return q}});class mt{static toStyleDict(t){return mt.toDict(t,{stringToDict:mt.cssStringToDict,mapValue:mt.toStyleValue})}static toClassDict(t){return mt.toDict(t,{stringToDict:mt.classStringToDict,mapValue:Boolean})}static toIconDict(t){return mt.toDict(t,{stringToDict:mt.stringToDefaultDict("default"),mapValue:String})}static toDict(t,e={}){const{stringToDict:r=mt.stringToDefaultDict("default"),mapValue:s=(t=>t),skipNull:i=!0,skipFalse:o=!0}=e,a=t=>null==t&&i||!1===t&&o?{}:Array.isArray(t)?t.reduce(((t,e)=>({...t,...a(e)})),{}):mt.isPlainObject(t)?Object.fromEntries(Object.entries(t).filter((([,t])=>(null!=t||!i)&&(!1!==t||!o))).map((([t,e])=>[t,s(e,t)]))):"string"==typeof t?r(t):{};return a(t)}static toStyleValue(t){return null==t?t:String(t).trim().replace(/;+$/,"")}static cssStringToDict(t){return String(t).split(";").map((t=>t.trim())).filter(Boolean).reduce(((t,e)=>{const r=e.indexOf(":");if(r<=0)return t;const s=e.slice(0,r).trim(),i=e.slice(r+1).trim();return s&&i?{...t,[s]:i}:t}),{})}static toColorStopDict(t){return mt.toDict(t,{stringToDict:mt.keyValueStringToDict,mapValue:String})}static keyValueStringToDict(t){const e=String(t).trim(),r=e.indexOf(":");if(r<=0)return{};const s=e.slice(0,r).trim(),i=e.slice(r+1).trim();return s&&i?{[s]:i}:{}}static classStringToDict(t){return String(t).trim().split(/\s+/).filter(Boolean).reduce(((t,e)=>({...t,[e]:!0})),{})}static stringToDefaultDict(t="default"){return e=>({[t]:String(e)})}static requireArray(t,e="value"){if(null==t)return[];if(!Array.isArray(t))throw new Error(`[config-helper] "${e}" must be an array.`);return t}static ensureArray(t){return null==t?[]:Array.isArray(t)?t:[t]}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}}class gt{static context={};static setContext(t={}){gt.context=t}static getJsTemplateOrValue(t,e,r={}){return gt._getJsTemplateOrValue(t,e,r,0)}static _getJsTemplateOrValue(t,e,r={},s=0){const{resolveKeys:i=!0,maxDepth:o=10}=r;if(s>=o)return e;if(null==e)return e;if(["number","boolean","bigint","symbol"].includes(typeof e))return e;if(Array.isArray(e))return e.map((e=>gt._getJsTemplateOrValue(t,e,r,s)));if(gt.isPlainObject(e))return Object.fromEntries(Object.entries(e).map((([e,o])=>{const a=i?gt._getJsTemplateOrValue(t,e,r,s):e,n=gt._getJsTemplateOrValue(t,o,r,s);return[String(a),n]})));if("string"!=typeof e)return e;const a=e.trim();if(!gt.isJsTemplate(a))return e;const n=gt.evaluateJsTemplate(t,gt.extractJsTemplateCode(a));return gt._getJsTemplateOrValue(t,n,r,s+1)}static isJsTemplate(t){return"string"==typeof t&&t.trim().startsWith("[[[")&&t.trim().endsWith("]]]")}static extractJsTemplateCode(t){return String(t).trim().slice(3,-3).trim()}static evaluateJsTemplate(t,e){const{hass:r,config:s,entities:i=[]}=gt.context,o=gt._getItemEntityIndex(t),a=gt._getTemplateState(t),n=i?.[o],l=r?.states,h=s?.variables??{},c=r?.user;s?.dev?.debug&&console.log("Evaluating JavaScript template with context:",{hass:r,config:s,entity:n,entities:i,states:l,state:a,variables:h,item:t,user:c});try{return new Function("hass","config","entity","entities","states","state","variables","item","user",`\n          "use strict";\n          ${e}\n        `)(r,s,n,i,l,a,h,t,c)}catch(u){return void(s?.dev?.debug&&console.error("[templates] JavaScript template error:",{error:u,item:t,javascript:e}))}}static _getTemplateState(t={}){const e=gt._getItemEntityIndex(t),r=gt.context.entities?.[e],s=gt.context.config?.entities?.[e]||{};if(!r)return;const i=s.attribute;return i&&r.attributes&&void 0!==r.attributes[i]?r.attributes[i]:r.state}static _getItemEntityIndex(t={}){if(void 0===t.entity_index||null===t.entity_index)return;const e=Number(t.entity_index);return Number.isFinite(e)?e:void 0}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}}class ft{static normalize(t){return t?Array.isArray(t)?{scales:{},colors:ft.normalizeColors(t)}:!ft.isPlainObject(t)||t.colors||t.scales?ft.isPlainObject(t)?{...t,scales:ft.normalizeScales(t.scales),colors:ft.normalizeColors(t.colors)}:{scales:{},colors:[]}:{scales:{},colors:ft.normalizeColors(t)}:{scales:{},colors:[]}}static normalizeScales(t){return ft.isPlainObject(t)?Object.fromEntries(Object.entries(t).map((([t,e])=>[t,ft.isPlainObject(e)?{...e}:e]))):{}}static normalizeColors(t){return t?Array.isArray(t)?t.flatMap((t=>ft.normalizeColorArrayEntry(t))).filter(Boolean).sort(((t,e)=>t.value-e.value)):ft.isPlainObject(t)?Object.entries(t).map((([t,e])=>ft.normalizeColorPair(t,e))).filter(Boolean).sort(((t,e)=>t.value-e.value)):[]:[]}static normalizeColorArrayEntry(t){if(ft.isPlainObject(t)&&Object.prototype.hasOwnProperty.call(t,"value")&&Object.prototype.hasOwnProperty.call(t,"color")){const e=ft.normalizeColorEntry(t);return e?[e]:[]}return ft.isPlainObject(t)?Object.entries(t).map((([t,e])=>ft.normalizeColorPair(t,e))).filter(Boolean):[]}static normalizeColorPair(t,e){const r=Number(t);return Number.isFinite(r)?null==e?null:{value:r,color:String(e)}:null}static normalizeColorEntry(t){if(!ft.isPlainObject(t))return null;const e=Number(t.value);return Number.isFinite(e)?void 0===t.color||null===t.color?null:{...t,value:e,color:String(t.color)}:null}static ensureMinimumStops(t,e){return t?.colors&&1===t.colors.length?{...t,colors:[t.colors[0],{value:e,color:t.colors[0].color}]}:t}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}static _testColorStopsNormalizer(){const t={entity_index:0},e=[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}];[{name:"FHC dict",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC dict with quoted keys",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC list of dicts",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC list of dicts with quoted keys",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC dict with template values",raw:{0:"[[[\n          return 'red';\n        ]]]",10:"[[[\n          return 'green';\n        ]]]",20:"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template values",raw:[{0:"[[[\n            return 'red';\n          ]]]"},{10:"[[[\n            return 'green';\n          ]]]"},{20:"[[[\n            return 'blue';\n          ]]]"}]},{name:"FHC dict with template keys",raw:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}},{name:"FHC dict with template keys and values",raw:{"[[[ return 0; ]]]":"[[[\n          return 'red';\n        ]]]","[[[ return 10; ]]]":"[[[\n          return 'green';\n        ]]]","[[[ return 20; ]]]":"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template keys and values",raw:[{"[[[ return 0; ]]]":"[[[\n            return 'red';\n          ]]]"},{"[[[ return 10; ]]]":"[[[\n            return 'green';\n          ]]]"},{"[[[ return 20; ]]]":"[[[\n            return 'blue';\n          ]]]"}]},{name:"Whole FHC color_stops as template returning dict",raw:"[[[\n        return {\n          0: 'red',\n          10: 'green',\n          20: 'blue',\n        };\n      ]]]"},{name:"Whole FHC color_stops as template returning list",raw:"[[[\n        return [\n          { 0: 'red' },\n          { 10: 'green' },\n          { 20: 'blue' },\n        ];\n      ]]]"},{name:"SAK v1 colorstops.colors dict",raw:{colors:{0:"red",10:"green",20:"blue"}}},{name:"SAK v1 colorstops.colors dict with template keys",raw:{colors:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}}},{name:"SAK v1 colorstops.colors dict with template values",raw:{colors:{0:"[[[\n            return 'red';\n          ]]]",10:"[[[\n            return 'green';\n          ]]]",20:"[[[\n            return 'blue';\n          ]]]"}}},{name:"SAK v2 colors list",raw:{scales:{default:{min:0,max:20}},colors:[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}]}},{name:"SAK v2 colors list unsorted",raw:{scales:{default:{min:0,max:20}},colors:[{value:20,color:"blue",rank:2},{value:0,color:"red",rank:1},{value:10,color:"green",rank:1}]}},{name:"SAK v2 colors list with template values",raw:{scales:{default:{min:"[[[\n              return 0;\n            ]]]",max:"[[[\n              return 20;\n            ]]]"}},colors:[{value:"[[[\n              return 0;\n            ]]]",color:"[[[\n              return 'red';\n            ]]]"},{value:"[[[\n              return 10;\n            ]]]",color:"[[[\n              return 'green';\n            ]]]"},{value:"[[[\n              return 20;\n            ]]]",color:"[[[\n              return 'blue';\n            ]]]"}]}},{name:"SAK v2 whole colors list as template",raw:{scales:{default:{min:0,max:20}},colors:"[[[\n          return [\n            { value: 0, color: 'red' },\n            { value: 10, color: 'green' },\n            { value: 20, color: 'blue' },\n          ];\n        ]]]"}}].forEach((r=>{const s=gt.getJsTemplateOrValue(t,r.raw,{resolveKeys:!0}),i=ft.normalize(s),o=i.colors.map((t=>({value:t.value,color:t.color}))),a=JSON.stringify(o)===JSON.stringify(e);console.log(`[colorstops test] ${a?"PASS":"FAIL"} - ${r.name}`,{raw:r.raw,resolved:s,normalized:i,simpleColors:o,expectedColors:e})}))}}const yt=t=>t.substring(0,t.indexOf(".")),vt=(t,e)=>{if("number"==typeof t)return 3===e?{mode:"rgb",r:(t>>8&15|t>>4&240)/255,g:(t>>4&15|240&t)/255,b:(15&t|t<<4&240)/255}:4===e?{mode:"rgb",r:(t>>12&15|t>>8&240)/255,g:(t>>8&15|t>>4&240)/255,b:(t>>4&15|240&t)/255,alpha:(15&t|t<<4&240)/255}:6===e?{mode:"rgb",r:(t>>16&255)/255,g:(t>>8&255)/255,b:(255&t)/255}:8===e?{mode:"rgb",r:(t>>24&255)/255,g:(t>>16&255)/255,b:(t>>8&255)/255,alpha:(255&t)/255}:void 0},bt={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_t=/^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i,xt="([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)",wt=`${xt}%`,$t=`(?:${xt}%|${xt})`,St=`(?:${xt}(deg|grad|rad|turn)|${xt})`,kt="\\s*,\\s*",Ct=new RegExp(`^rgba?\\(\\s*${xt}${kt}${xt}${kt}${xt}\\s*(?:,\\s*${$t}\\s*)?\\)$`),At=new RegExp(`^rgba?\\(\\s*${wt}${kt}${wt}${kt}${wt}\\s*(?:,\\s*${$t}\\s*)?\\)$`),Mt=(t="rgb")=>e=>void 0!==(e=((t,e)=>void 0===t?void 0:"object"!=typeof t?Jt(t):void 0!==t.mode?t:e?{...t,mode:e}:void 0)(e,t))?e.mode===t?e:Et[e.mode][t]?Et[e.mode][t](e):"rgb"===t?Et[e.mode].rgb(e):Et.rgb[t](Et[e.mode].rgb(e)):void 0,Et={},Nt={},Tt=[],zt={},It=t=>t,Pt=t=>(Et[t.mode]={...Et[t.mode],...t.toMode},Object.keys(t.fromMode||{}).forEach((e=>{Et[e]||(Et[e]={}),Et[e][t.mode]=t.fromMode[e]})),t.ranges||(t.ranges={}),t.difference||(t.difference={}),t.channels.forEach((e=>{if(void 0===t.ranges[e]&&(t.ranges[e]=[0,1]),!t.interpolate[e])throw new Error(`Missing interpolator for: ${e}`);"function"==typeof t.interpolate[e]&&(t.interpolate[e]={use:t.interpolate[e]}),t.interpolate[e].fixup||(t.interpolate[e].fixup=It)})),Nt[t.mode]=t,(t.parse||[]).forEach((e=>{Ot(e,t.mode)})),Mt(t.mode)),Ot=(t,e)=>{if("string"==typeof t){if(!e)throw new Error("'mode' required when 'parser' is a string");zt[t]=e}else"function"==typeof t&&Tt.indexOf(t)<0&&Tt.push(t)},jt=/[^\x00-\x7F]|[a-zA-Z_]/,Rt=/[^\x00-\x7F]|[-\w]/,Dt={Function:"function",Ident:"ident",Number:"number",Percentage:"percentage",ParenClose:")",None:"none",Hue:"hue",Alpha:"alpha"};let Vt=0;function Gt(t){let e=t[Vt],r=t[Vt+1];return"-"===e||"+"===e?/\d/.test(r)||"."===r&&/\d/.test(t[Vt+2]):/\d/.test("."===e?r:e)}function Lt(t){if(Vt>=t.length)return!1;let e=t[Vt];if(jt.test(e))return!0;if("-"===e){if(t.length-Vt<2)return!1;let e=t[Vt+1];return!("-"!==e&&!jt.test(e))}return!1}const Ut={deg:1,rad:180/Math.PI,grad:.9,turn:360};function Ht(t){let e="";if("-"!==t[Vt]&&"+"!==t[Vt]||(e+=t[Vt++]),e+=qt(t),"."===t[Vt]&&/\d/.test(t[Vt+1])&&(e+=t[Vt++]+qt(t)),"e"!==t[Vt]&&"E"!==t[Vt]||("-"!==t[Vt+1]&&"+"!==t[Vt+1]||!/\d/.test(t[Vt+2])?/\d/.test(t[Vt+1])&&(e+=t[Vt++]+qt(t)):e+=t[Vt++]+t[Vt++]+qt(t)),Lt(t)){let r=Bt(t);return"deg"===r||"rad"===r||"turn"===r||"grad"===r?{type:Dt.Hue,value:e*Ut[r]}:void 0}return"%"===t[Vt]?(Vt++,{type:Dt.Percentage,value:+e}):{type:Dt.Number,value:+e}}function qt(t){let e="";for(;/\d/.test(t[Vt]);)e+=t[Vt++];return e}function Bt(t){let e="";for(;Vt<t.length&&Rt.test(t[Vt]);)e+=t[Vt++];return e}function Ft(t){let e=Bt(t);return"("===t[Vt]?(Vt++,{type:Dt.Function,value:e}):"none"===e?{type:Dt.None,value:void 0}:{type:Dt.Ident,value:e}}function Wt(t){t._i=0;let e=t[t._i++];if(!e||e.type!==Dt.Function||"color"!==e.value)return;if(e=t[t._i++],e.type!==Dt.Ident)return;const r=zt[e.value];if(!r)return;const s={mode:r},i=Kt(t,!1);if(!i)return;const o=(t=>Nt[t])(r).channels;for(let a,n,l=0;l<o.length;l++)a=i[l],n=o[l],a.type!==Dt.None&&(s[n]=a.type===Dt.Number?a.value:a.value/100,"alpha"===n&&(s[n]=Math.max(0,Math.min(1,s[n]))));return s}function Kt(t,e){const r=[];let s;for(;t._i<t.length;)if(s=t[t._i++],s.type===Dt.None||s.type===Dt.Number||s.type===Dt.Alpha||s.type===Dt.Percentage||e&&s.type===Dt.Hue)r.push(s);else{if(s.type!==Dt.ParenClose)return;if(t._i<t.length)return}if(!(r.length<3||r.length>4)){if(4===r.length){if(r[3].type!==Dt.Alpha)return;r[3]=r[3].value}return 3===r.length&&r.push({type:Dt.None,value:void 0}),r.every((t=>t.type!==Dt.Alpha))?r:void 0}}const Jt=t=>{if("string"!=typeof t)return;const e=function(t=""){let e,r=t.trim(),s=[];for(Vt=0;Vt<r.length;)if(e=r[Vt++],"\n"!==e&&"\t"!==e&&" "!==e){if(","===e)return;if(")"!==e){if("+"===e){if(Vt--,Gt(r)){s.push(Ht(r));continue}return}if("-"===e){if(Vt--,Gt(r)){s.push(Ht(r));continue}if(Lt(r)){s.push({type:Dt.Ident,value:Bt(r)});continue}return}if("."===e){if(Vt--,Gt(r)){s.push(Ht(r));continue}return}if("/"===e){for(;Vt<r.length&&("\n"===r[Vt]||"\t"===r[Vt]||" "===r[Vt]);)Vt++;let t;if(Gt(r)&&(t=Ht(r),t.type!==Dt.Hue)){s.push({type:Dt.Alpha,value:t});continue}if(Lt(r)&&"none"===Bt(r)){s.push({type:Dt.Alpha,value:{type:Dt.None,value:void 0}});continue}return}if(/\d/.test(e))Vt--,s.push(Ht(r));else{if(!jt.test(e))return;Vt--,s.push(Ft(r))}}else s.push({type:Dt.ParenClose})}else for(;Vt<r.length&&("\n"===r[Vt]||"\t"===r[Vt]||" "===r[Vt]);)Vt++;return s}(t),r=e?function(t,e){t._i=0;let r=t[t._i++];if(!r||r.type!==Dt.Function)return;let s=Kt(t,e);return s?(s.unshift(r.value),s):void 0}(e,!0):void 0;let s,i=0,o=Tt.length;for(;i<o;)if(void 0!==(s=Tt[i++](t,r)))return s;return e?Wt(e):void 0};const Xt=(Zt=(t,e,r)=>t+r*(e-t),t=>{let e=(t=>{let e=[];for(let r=0;r<t.length-1;r++){let s=t[r],i=t[r+1];void 0===s&&void 0===i?e.push(void 0):void 0!==s&&void 0!==i?e.push([s,i]):e.push(void 0!==s?[s,s]:[i,i])}return e})(t);return t=>{let r=t*e.length,s=t>=1?e.length-1:Math.max(Math.floor(r),0),i=e[s];return void 0===i?void 0:Zt(i[0],i[1],r-s)}});var Zt;const Yt=t=>{let e=!1,r=t.map((t=>void 0!==t?(e=!0,t):1));return e?r:t},Qt={mode:"rgb",channels:["r","g","b","alpha"],parse:[function(t,e){if(!e||"rgb"!==e[0]&&"rgba"!==e[0])return;const r={mode:"rgb"},[,s,i,o,a]=e;return s.type!==Dt.Hue&&i.type!==Dt.Hue&&o.type!==Dt.Hue?(s.type!==Dt.None&&(r.r=s.type===Dt.Number?s.value/255:s.value/100),i.type!==Dt.None&&(r.g=i.type===Dt.Number?i.value/255:i.value/100),o.type!==Dt.None&&(r.b=o.type===Dt.Number?o.value/255:o.value/100),a.type!==Dt.None&&(r.alpha=Math.min(1,Math.max(0,a.type===Dt.Number?a.value:a.value/100))),r):void 0},t=>{let e;return(e=t.match(_t))?vt(parseInt(e[1],16),e[1].length):void 0},t=>{let e,r={mode:"rgb"};if(e=t.match(Ct))void 0!==e[1]&&(r.r=e[1]/255),void 0!==e[2]&&(r.g=e[2]/255),void 0!==e[3]&&(r.b=e[3]/255);else{if(!(e=t.match(At)))return;void 0!==e[1]&&(r.r=e[1]/100),void 0!==e[2]&&(r.g=e[2]/100),void 0!==e[3]&&(r.b=e[3]/100)}return void 0!==e[4]?r.alpha=Math.max(0,Math.min(1,e[4]/100)):void 0!==e[5]&&(r.alpha=Math.max(0,Math.min(1,+e[5]))),r},t=>vt(bt[t.toLowerCase()],6),t=>"transparent"===t?{mode:"rgb",r:0,g:0,b:0,alpha:0}:void 0,"srgb"],serialize:"srgb",interpolate:{r:Xt,g:Xt,b:Xt,alpha:{use:Xt,fixup:Yt}},gamut:!0,white:{r:1,g:1,b:1},black:{r:0,g:0,b:0}},te=(t=0)=>Math.pow(Math.abs(t),563/256)*Math.sign(t),ee=t=>{let e=te(t.r),r=te(t.g),s=te(t.b),i={mode:"xyz65",x:.5766690429101305*e+.1855582379065463*r+.1882286462349947*s,y:.297344975250536*e+.6273635662554661*r+.0752914584939979*s,z:.0270313613864123*e+.0706888525358272*r+.9913375368376386*s};return void 0!==t.alpha&&(i.alpha=t.alpha),i},re=t=>Math.pow(Math.abs(t),256/563)*Math.sign(t),se=({x:t,y:e,z:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i={mode:"a98",r:re(2.0415879038107465*t-.5650069742788597*e-.3447313507783297*r),g:re(-.9692436362808798*t+1.8759675015077206*e+.0415550574071756*r),b:re(.0134442806320312*t-.1183623922310184*e+1.0151749943912058*r)};return void 0!==s&&(i.alpha=s),i},ie=(t=0)=>{const e=Math.abs(t);return e<=.04045?t/12.92:(Math.sign(t)||1)*Math.pow((e+.055)/1.055,2.4)},oe=({r:t,g:e,b:r,alpha:s})=>{let i={mode:"lrgb",r:ie(t),g:ie(e),b:ie(r)};return void 0!==s&&(i.alpha=s),i},ae=t=>{let{r:e,g:r,b:s,alpha:i}=oe(t),o={mode:"xyz65",x:.4123907992659593*e+.357584339383878*r+.1804807884018343*s,y:.2126390058715102*e+.715168678767756*r+.0721923153607337*s,z:.0193308187155918*e+.119194779794626*r+.9505321522496607*s};return void 0!==i&&(o.alpha=i),o},ne=(t=0)=>{const e=Math.abs(t);return e>.0031308?(Math.sign(t)||1)*(1.055*Math.pow(e,1/2.4)-.055):12.92*t},le=({r:t,g:e,b:r,alpha:s},i="rgb")=>{let o={mode:i,r:ne(t),g:ne(e),b:ne(r)};return void 0!==s&&(o.alpha=s),o},he=({x:t,y:e,z:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i=le({r:3.2409699419045226*t-1.537383177570094*e-.4986107602930034*r,g:-.9692436362808796*t+1.8759675015077204*e+.0415550574071756*r,b:.0556300796969936*t-.2039769588889765*e+1.0569715142428784*r});return void 0!==s&&(i.alpha=s),i},ce={...Qt,mode:"a98",parse:["a98-rgb"],serialize:"a98-rgb",fromMode:{rgb:t=>se(ae(t)),xyz65:se},toMode:{rgb:t=>he(ee(t)),xyz65:ee}},ue=t=>(t%=360)<0?t+360:t,de=t=>((t,e)=>t.map(((r,s,i)=>{if(void 0===r)return r;let o=ue(r);return 0===s||void 0===t[s-1]?o:e(o-ue(i[s-1]))})).reduce(((t,e)=>t.length&&void 0!==e&&void 0!==t[t.length-1]?(t.push(e+t[t.length-1]),t):(t.push(e),t)),[]))(t,(t=>Math.abs(t)<=180?t:t-360*Math.sign(t))),pe=[-.14861,1.78277,-.29227,-.90649,1.97294,0],me=Math.PI/180,ge=180/Math.PI;let fe=pe[3]*pe[4],ye=pe[1]*pe[4],ve=pe[1]*pe[2]-pe[0]*pe[3];const be=(t,e)=>{if(void 0===t.h||void 0===e.h||!t.s||!e.s)return 0;let r=ue(t.h),s=ue(e.h),i=Math.sin((s-r+360)/2*Math.PI/180);return 2*Math.sqrt(t.s*e.s)*i},_e=(t,e)=>{if(void 0===t.h||void 0===e.h||!t.c||!e.c)return 0;let r=ue(t.h),s=ue(e.h),i=Math.sin((s-r+360)/2*Math.PI/180);return 2*Math.sqrt(t.c*e.c)*i},xe=t=>{let e=t.reduce(((t,e)=>{if(void 0!==e){let r=e*Math.PI/180;t.sin+=Math.sin(r),t.cos+=Math.cos(r)}return t}),{sin:0,cos:0}),r=180*Math.atan2(e.sin,e.cos)/Math.PI;return r<0?360+r:r},we={mode:"cubehelix",channels:["h","s","l","alpha"],parse:["--cubehelix"],serialize:"--cubehelix",ranges:{h:[0,360],s:[0,4.614],l:[0,1]},fromMode:{rgb:({r:t,g:e,b:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i=(ve*r+t*fe-e*ye)/(ve+fe-ye),o=r-i,a=(pe[4]*(e-i)-pe[2]*o)/pe[3],n={mode:"cubehelix",l:i,s:0===i||1===i?void 0:Math.sqrt(o*o+a*a)/(pe[4]*i*(1-i))};return n.s&&(n.h=Math.atan2(a,o)*ge-120),void 0!==s&&(n.alpha=s),n}},toMode:{rgb:({h:t,s:e,l:r,alpha:s})=>{let i={mode:"rgb"};t=(void 0===t?0:t+120)*me,void 0===r&&(r=0);let o=void 0===e?0:e*r*(1-r),a=Math.cos(t),n=Math.sin(t);return i.r=r+o*(pe[0]*a+pe[1]*n),i.g=r+o*(pe[2]*a+pe[3]*n),i.b=r+o*(pe[4]*a+pe[5]*n),void 0!==s&&(i.alpha=s),i}},interpolate:{h:{use:Xt,fixup:de},s:Xt,l:Xt,alpha:{use:Xt,fixup:Yt}},difference:{h:be},average:{h:xe}},$e=({l:t,a:e,b:r,alpha:s},i="lch")=>{void 0===e&&(e=0),void 0===r&&(r=0);let o=Math.sqrt(e*e+r*r),a={mode:i,l:t,c:o};return o&&(a.h=ue(180*Math.atan2(r,e)/Math.PI)),void 0!==s&&(a.alpha=s),a},Se=({l:t,c:e,h:r,alpha:s},i="lab")=>{void 0===r&&(r=0);let o={mode:i,l:t,a:e?e*Math.cos(r/180*Math.PI):0,b:e?e*Math.sin(r/180*Math.PI):0};return void 0!==s&&(o.alpha=s),o},ke=Math.pow(29,3)/Math.pow(3,3),Ce=Math.pow(6,3)/Math.pow(29,3),Ae=.3457/.3585,Me=1,Ee=.2958/.3585,Ne=.3127/.329,Te=1,ze=.3583/.329;let Ie=t=>Math.pow(t,3)>Ce?Math.pow(t,3):(116*t-16)/ke;const Pe=({l:t,a:e,b:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i=(t+16)/116,o=i-r/200,a={mode:"xyz65",x:Ie(e/500+i)*Ne,y:Ie(i)*Te,z:Ie(o)*ze};return void 0!==s&&(a.alpha=s),a},Oe=t=>he(Pe(t)),je=t=>t>Ce?Math.cbrt(t):(ke*t+16)/116,Re=({x:t,y:e,z:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i=je(t/Ne),o=je(e/Te),a={mode:"lab65",l:116*o-16,a:500*(i-o),b:200*(o-je(r/ze))};return void 0!==s&&(a.alpha=s),a},De=t=>{let e=Re(ae(t));return t.r===t.b&&t.b===t.g&&(e.a=e.b=0),e},Ve=26/180*Math.PI,Ge=Math.cos(Ve),Le=Math.sin(Ve),Ue=100/Math.log(1.39),He=({l:t,c:e,h:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i={mode:"lab65",l:(Math.exp(1*t/Ue)-1)/.0039},o=(Math.exp(.0435*e*1*1)-1)/.075,a=o*Math.cos(r/180*Math.PI-Ve),n=o*Math.sin(r/180*Math.PI-Ve);return i.a=a*Ge-n/.83*Le,i.b=a*Le+n/.83*Ge,void 0!==s&&(i.alpha=s),i},qe=({l:t,a:e,b:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i=e*Ge+r*Le,o=.83*(r*Ge-e*Le),a=Math.sqrt(i*i+o*o),n={mode:"dlch",l:Ue/1*Math.log(1+.0039*t),c:Math.log(1+.075*a)/.0435};return n.c&&(n.h=ue((Math.atan2(o,i)+Ve)/Math.PI*180)),void 0!==s&&(n.alpha=s),n},Be=t=>He($e(t,"dlch")),Fe=t=>Se(qe(t),"dlab"),We={mode:"dlab",parse:["--din99o-lab"],serialize:"--din99o-lab",toMode:{lab65:Be,rgb:t=>Oe(Be(t))},fromMode:{lab65:Fe,rgb:t=>Fe(De(t))},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-40.09,45.501],b:[-40.469,44.344]},interpolate:{l:Xt,a:Xt,b:Xt,alpha:{use:Xt,fixup:Yt}}},Ke={mode:"dlch",parse:["--din99o-lch"],serialize:"--din99o-lch",toMode:{lab65:He,dlab:t=>Se(t,"dlab"),rgb:t=>Oe(He(t))},fromMode:{lab65:qe,dlab:t=>$e(t,"dlch"),rgb:t=>qe(De(t))},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,51.484],h:[0,360]},interpolate:{l:Xt,c:Xt,h:{use:Xt,fixup:de},alpha:{use:Xt,fixup:Yt}},difference:{h:_e},average:{h:xe}};const Je={mode:"hsi",toMode:{rgb:function({h:t,s:e,i:r,alpha:s}){t=ue(void 0!==t?t:0),void 0===e&&(e=0),void 0===r&&(r=0);let i,o=Math.abs(t/60%2-1);switch(Math.floor(t/60)){case 0:i={r:r*(1+e*(3/(2-o)-1)),g:r*(1+e*(3*(1-o)/(2-o)-1)),b:r*(1-e)};break;case 1:i={r:r*(1+e*(3*(1-o)/(2-o)-1)),g:r*(1+e*(3/(2-o)-1)),b:r*(1-e)};break;case 2:i={r:r*(1-e),g:r*(1+e*(3/(2-o)-1)),b:r*(1+e*(3*(1-o)/(2-o)-1))};break;case 3:i={r:r*(1-e),g:r*(1+e*(3*(1-o)/(2-o)-1)),b:r*(1+e*(3/(2-o)-1))};break;case 4:i={r:r*(1+e*(3*(1-o)/(2-o)-1)),g:r*(1-e),b:r*(1+e*(3/(2-o)-1))};break;case 5:i={r:r*(1+e*(3/(2-o)-1)),g:r*(1-e),b:r*(1+e*(3*(1-o)/(2-o)-1))};break;default:i={r:r*(1-e),g:r*(1-e),b:r*(1-e)}}return i.mode="rgb",void 0!==s&&(i.alpha=s),i}},parse:["--hsi"],serialize:"--hsi",fromMode:{rgb:function({r:t,g:e,b:r,alpha:s}){void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i=Math.max(t,e,r),o=Math.min(t,e,r),a={mode:"hsi",s:t+e+r===0?0:1-3*o/(t+e+r),i:(t+e+r)/3};return i-o!=0&&(a.h=60*(i===t?(e-r)/(i-o)+6*(e<r):i===e?(r-t)/(i-o)+2:(t-e)/(i-o)+4)),void 0!==s&&(a.alpha=s),a}},channels:["h","s","i","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:Xt,fixup:de},s:Xt,i:Xt,alpha:{use:Xt,fixup:Yt}},difference:{h:be},average:{h:xe}};const Xe=new RegExp(`^hsla?\\(\\s*${St}${kt}${wt}${kt}${wt}\\s*(?:,\\s*${$t}\\s*)?\\)$`);const Ze={mode:"hsl",toMode:{rgb:function({h:t,s:e,l:r,alpha:s}){t=ue(void 0!==t?t:0),void 0===e&&(e=0),void 0===r&&(r=0);let i,o=r+e*(r<.5?r:1-r),a=o-2*(o-r)*Math.abs(t/60%2-1);switch(Math.floor(t/60)){case 0:i={r:o,g:a,b:2*r-o};break;case 1:i={r:a,g:o,b:2*r-o};break;case 2:i={r:2*r-o,g:o,b:a};break;case 3:i={r:2*r-o,g:a,b:o};break;case 4:i={r:a,g:2*r-o,b:o};break;case 5:i={r:o,g:2*r-o,b:a};break;default:i={r:2*r-o,g:2*r-o,b:2*r-o}}return i.mode="rgb",void 0!==s&&(i.alpha=s),i}},fromMode:{rgb:function({r:t,g:e,b:r,alpha:s}){void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i=Math.max(t,e,r),o=Math.min(t,e,r),a={mode:"hsl",s:i===o?0:(i-o)/(1-Math.abs(i+o-1)),l:.5*(i+o)};return i-o!=0&&(a.h=60*(i===t?(e-r)/(i-o)+6*(e<r):i===e?(r-t)/(i-o)+2:(t-e)/(i-o)+4)),void 0!==s&&(a.alpha=s),a}},channels:["h","s","l","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(t,e){if(!e||"hsl"!==e[0]&&"hsla"!==e[0])return;const r={mode:"hsl"},[,s,i,o,a]=e;if(s.type!==Dt.None){if(s.type===Dt.Percentage)return;r.h=s.value}if(i.type!==Dt.None){if(i.type===Dt.Hue)return;r.s=i.value/100}if(o.type!==Dt.None){if(o.type===Dt.Hue)return;r.l=o.value/100}return a.type!==Dt.None&&(r.alpha=Math.min(1,Math.max(0,a.type===Dt.Number?a.value:a.value/100))),r},t=>{let e=t.match(Xe);if(!e)return;let r={mode:"hsl"};return void 0!==e[3]?r.h=+e[3]:void 0!==e[1]&&void 0!==e[2]&&(r.h=((t,e)=>{switch(e){case"deg":return+t;case"rad":return t/Math.PI*180;case"grad":return t/10*9;case"turn":return 360*t}})(e[1],e[2])),void 0!==e[4]&&(r.s=Math.min(Math.max(0,e[4]/100),1)),void 0!==e[5]&&(r.l=Math.min(Math.max(0,e[5]/100),1)),void 0!==e[6]?r.alpha=Math.max(0,Math.min(1,e[6]/100)):void 0!==e[7]&&(r.alpha=Math.max(0,Math.min(1,+e[7]))),r}],serialize:t=>`hsl(${void 0!==t.h?t.h:"none"} ${void 0!==t.s?100*t.s+"%":"none"} ${void 0!==t.l?100*t.l+"%":"none"}${t.alpha<1?` / ${t.alpha}`:""})`,interpolate:{h:{use:Xt,fixup:de},s:Xt,l:Xt,alpha:{use:Xt,fixup:Yt}},difference:{h:be},average:{h:xe}};function Ye({h:t,s:e,v:r,alpha:s}){t=ue(void 0!==t?t:0),void 0===e&&(e=0),void 0===r&&(r=0);let i,o=Math.abs(t/60%2-1);switch(Math.floor(t/60)){case 0:i={r:r,g:r*(1-e*o),b:r*(1-e)};break;case 1:i={r:r*(1-e*o),g:r,b:r*(1-e)};break;case 2:i={r:r*(1-e),g:r,b:r*(1-e*o)};break;case 3:i={r:r*(1-e),g:r*(1-e*o),b:r};break;case 4:i={r:r*(1-e*o),g:r*(1-e),b:r};break;case 5:i={r:r,g:r*(1-e),b:r*(1-e*o)};break;default:i={r:r*(1-e),g:r*(1-e),b:r*(1-e)}}return i.mode="rgb",void 0!==s&&(i.alpha=s),i}function Qe({r:t,g:e,b:r,alpha:s}){void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i=Math.max(t,e,r),o=Math.min(t,e,r),a={mode:"hsv",s:0===i?0:1-o/i,v:i};return i-o!=0&&(a.h=60*(i===t?(e-r)/(i-o)+6*(e<r):i===e?(r-t)/(i-o)+2:(t-e)/(i-o)+4)),void 0!==s&&(a.alpha=s),a}const tr={mode:"hsv",toMode:{rgb:Ye},parse:["--hsv"],serialize:"--hsv",fromMode:{rgb:Qe},channels:["h","s","v","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:Xt,fixup:de},s:Xt,v:Xt,alpha:{use:Xt,fixup:Yt}},difference:{h:be},average:{h:xe}};const er={mode:"hwb",toMode:{rgb:function({h:t,w:e,b:r,alpha:s}){if(void 0===e&&(e=0),void 0===r&&(r=0),e+r>1){let t=e+r;e/=t,r/=t}return Ye({h:t,s:1===r?1:1-e/(1-r),v:1-r,alpha:s})}},fromMode:{rgb:function(t){let e=Qe(t);if(void 0===e)return;let r=void 0!==e.s?e.s:0,s=void 0!==e.v?e.v:0,i={mode:"hwb",w:(1-r)*s,b:1-s};return void 0!==e.h&&(i.h=e.h),void 0!==e.alpha&&(i.alpha=e.alpha),i}},channels:["h","w","b","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(t,e){if(!e||"hwb"!==e[0])return;const r={mode:"hwb"},[,s,i,o,a]=e;if(s.type!==Dt.None){if(s.type===Dt.Percentage)return;r.h=s.value}if(i.type!==Dt.None){if(i.type===Dt.Hue)return;r.w=i.value/100}if(o.type!==Dt.None){if(o.type===Dt.Hue)return;r.b=o.value/100}return a.type!==Dt.None&&(r.alpha=Math.min(1,Math.max(0,a.type===Dt.Number?a.value:a.value/100))),r}],serialize:t=>`hwb(${void 0!==t.h?t.h:"none"} ${void 0!==t.w?100*t.w+"%":"none"} ${void 0!==t.b?100*t.b+"%":"none"}${t.alpha<1?` / ${t.alpha}`:""})`,interpolate:{h:{use:Xt,fixup:de},w:Xt,b:Xt,alpha:{use:Xt,fixup:Yt}},difference:{h:(t,e)=>{if(void 0===t.h||void 0===e.h)return 0;let r=ue(t.h),s=ue(e.h);return Math.abs(s-r)>180?r-(s-360*Math.sign(s-r)):s-r}},average:{h:xe}},rr=.1593017578125,sr=78.84375,ir=.8359375,or=18.8515625,ar=18.6875;function nr(t){if(t<0)return 0;const e=Math.pow(t,1/sr);return 1e4*Math.pow(Math.max(0,e-ir)/(or-ar*e),1/rr)}function lr(t){if(t<0)return 0;const e=Math.pow(t/1e4,rr);return Math.pow((ir+or*e)/(1+ar*e),sr)}const hr=t=>Math.max(t/203,0),cr=({i:t,t:e,p:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);const i=nr(t+.008609037037932761*e+.11102962500302593*r),o=nr(t-.00860903703793275*e-.11102962500302599*r),a=nr(t+.5600313357106791*e-.32062717498731885*r),n={mode:"xyz65",x:hr(2.070152218389422*i-1.3263473389671556*o+.2066510476294051*a),y:hr(.3647385209748074*i+.680566024947227*o-.0453045459220346*a),z:hr(-.049747207535812*i-.0492609666966138*o+1.1880659249923042*a)};return void 0!==s&&(n.alpha=s),n},ur=(t=0)=>Math.max(203*t,0),dr=({x:t,y:e,z:r,alpha:s})=>{const i=ur(t),o=ur(e),a=ur(r),n=lr(.3592832590121217*i+.6976051147779502*o-.0358915932320289*a),l=lr(-.1920808463704995*i+1.1004767970374323*o+.0753748658519118*a),h=lr(.0070797844607477*i+.0748396662186366*o+.8433265453898765*a),c={mode:"itp",i:.5*n+.5*l,t:1.61376953125*n-3.323486328125*l+1.709716796875*h,p:4.378173828125*n-4.24560546875*l-.132568359375*h};return void 0!==s&&(c.alpha=s),c},pr={mode:"itp",channels:["i","t","p","alpha"],parse:["--ictcp"],serialize:"--ictcp",toMode:{xyz65:cr,rgb:t=>he(cr(t))},fromMode:{xyz65:dr,rgb:t=>dr(ae(t))},ranges:{i:[0,.581],t:[-.369,.272],p:[-.164,.331]},interpolate:{i:Xt,t:Xt,p:Xt,alpha:{use:Xt,fixup:Yt}}},mr=t=>{if(t<0)return 0;let e=Math.pow(t/1e4,rr);return Math.pow((ir+or*e)/(1+ar*e),134.03437499999998)},gr=(t=0)=>Math.max(203*t,0),fr=({x:t,y:e,z:r,alpha:s})=>{t=gr(t),e=gr(e);let i=1.15*t-.15*(r=gr(r)),o=.66*e+.34*t,a=mr(.41478972*i+.579999*o+.014648*r),n=mr(-.20151*i+1.120649*o+.0531008*r),l=mr(-.0166008*i+.2648*o+.6684799*r),h=(a+n)/2,c={mode:"jab",j:.44*h/(1-.56*h)-16295499532821565e-27,a:3.524*a-4.066708*n+.542708*l,b:.199076*a+1.096799*n-1.295875*l};return void 0!==s&&(c.alpha=s),c},yr=16295499532821565e-27,vr=t=>{if(t<0)return 0;let e=Math.pow(t,.007460772656268216);return 1e4*Math.pow((ir-e)/(ar*e-or),1/rr)},br=t=>t/203,_r=({j:t,a:e,b:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i=(t+yr)/(.44+.56*(t+yr)),o=vr(i+.13860504*e+.058047316*r),a=vr(i-.13860504*e-.058047316*r),n=vr(i-.096019242*e-.8118919*r),l={mode:"xyz65",x:br(1.661373024652174*o-.914523081304348*a+.23136208173913045*n),y:br(-.3250758611844533*o+1.571847026732543*a-.21825383453227928*n),z:br(-.090982811*o-.31272829*a+1.5227666*n)};return void 0!==s&&(l.alpha=s),l},xr=t=>{let e=fr(ae(t));return t.r===t.b&&t.b===t.g&&(e.a=e.b=0),e},wr=t=>he(_r(t)),$r={mode:"jab",channels:["j","a","b","alpha"],parse:["--jzazbz"],serialize:"--jzazbz",fromMode:{rgb:xr,xyz65:fr},toMode:{rgb:wr,xyz65:_r},ranges:{j:[0,.222],a:[-.109,.129],b:[-.185,.134]},interpolate:{j:Xt,a:Xt,b:Xt,alpha:{use:Xt,fixup:Yt}}},Sr=({j:t,a:e,b:r,alpha:s})=>{void 0===e&&(e=0),void 0===r&&(r=0);let i=Math.sqrt(e*e+r*r),o={mode:"jch",j:t,c:i};return i&&(o.h=ue(180*Math.atan2(r,e)/Math.PI)),void 0!==s&&(o.alpha=s),o},kr=({j:t,c:e,h:r,alpha:s})=>{void 0===r&&(r=0);let i={mode:"jab",j:t,a:e?e*Math.cos(r/180*Math.PI):0,b:e?e*Math.sin(r/180*Math.PI):0};return void 0!==s&&(i.alpha=s),i},Cr={mode:"jch",parse:["--jzczhz"],serialize:"--jzczhz",toMode:{jab:kr,rgb:t=>wr(kr(t))},fromMode:{rgb:t=>Sr(xr(t)),jab:Sr},channels:["j","c","h","alpha"],ranges:{j:[0,.221],c:[0,.19],h:[0,360]},interpolate:{h:{use:Xt,fixup:de},c:Xt,j:Xt,alpha:{use:Xt,fixup:Yt}},difference:{h:_e},average:{h:xe}},Ar=Math.pow(29,3)/Math.pow(3,3),Mr=Math.pow(6,3)/Math.pow(29,3);let Er=t=>Math.pow(t,3)>Mr?Math.pow(t,3):(116*t-16)/Ar;const Nr=({l:t,a:e,b:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i=(t+16)/116,o=i-r/200,a={mode:"xyz50",x:Er(e/500+i)*Ae,y:Er(i)*Me,z:Er(o)*Ee};return void 0!==s&&(a.alpha=s),a},Tr=({x:t,y:e,z:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i=le({r:3.1341359569958707*t-1.6173863321612538*e-.4906619460083532*r,g:-.978795502912089*t+1.916254567259524*e+.03344273116131949*r,b:.07195537988411677*t-.2289768264158322*e+1.405386058324125*r});return void 0!==s&&(i.alpha=s),i},zr=t=>Tr(Nr(t)),Ir=t=>{let{r:e,g:r,b:s,alpha:i}=oe(t),o={mode:"xyz50",x:.436065742824811*e+.3851514688337912*r+.14307845442264197*s,y:.22249319175623702*e+.7168870538238823*r+.06061979053616537*s,z:.013923904500943465*e+.09708128566574634*r+.7140993584005155*s};return void 0!==i&&(o.alpha=i),o},Pr=t=>t>Mr?Math.cbrt(t):(Ar*t+16)/116,Or=({x:t,y:e,z:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i=Pr(t/Ae),o=Pr(e/Me),a={mode:"lab",l:116*o-16,a:500*(i-o),b:200*(o-Pr(r/Ee))};return void 0!==s&&(a.alpha=s),a},jr=t=>{let e=Or(Ir(t));return t.r===t.b&&t.b===t.g&&(e.a=e.b=0),e};const Rr={mode:"lab",toMode:{xyz50:Nr,rgb:zr},fromMode:{xyz50:Or,rgb:jr},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-125,125],b:[-125,125]},parse:[function(t,e){if(!e||"lab"!==e[0])return;const r={mode:"lab"},[,s,i,o,a]=e;return s.type!==Dt.Hue&&i.type!==Dt.Hue&&o.type!==Dt.Hue?(s.type!==Dt.None&&(r.l=Math.min(Math.max(0,s.value),100)),i.type!==Dt.None&&(r.a=i.type===Dt.Number?i.value:125*i.value/100),o.type!==Dt.None&&(r.b=o.type===Dt.Number?o.value:125*o.value/100),a.type!==Dt.None&&(r.alpha=Math.min(1,Math.max(0,a.type===Dt.Number?a.value:a.value/100))),r):void 0}],serialize:t=>`lab(${void 0!==t.l?t.l:"none"} ${void 0!==t.a?t.a:"none"} ${void 0!==t.b?t.b:"none"}${t.alpha<1?` / ${t.alpha}`:""})`,interpolate:{l:Xt,a:Xt,b:Xt,alpha:{use:Xt,fixup:Yt}}},Dr={...Rr,mode:"lab65",parse:["--lab-d65"],serialize:"--lab-d65",toMode:{xyz65:Pe,rgb:Oe},fromMode:{xyz65:Re,rgb:De},ranges:{l:[0,100],a:[-125,125],b:[-125,125]}};const Vr={mode:"lch",toMode:{lab:Se,rgb:t=>zr(Se(t))},fromMode:{rgb:t=>$e(jr(t)),lab:$e},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,150],h:[0,360]},parse:[function(t,e){if(!e||"lch"!==e[0])return;const r={mode:"lch"},[,s,i,o,a]=e;if(s.type!==Dt.None){if(s.type===Dt.Hue)return;r.l=Math.min(Math.max(0,s.value),100)}if(i.type!==Dt.None&&(r.c=Math.max(0,i.type===Dt.Number?i.value:150*i.value/100)),o.type!==Dt.None){if(o.type===Dt.Percentage)return;r.h=o.value}return a.type!==Dt.None&&(r.alpha=Math.min(1,Math.max(0,a.type===Dt.Number?a.value:a.value/100))),r}],serialize:t=>`lch(${void 0!==t.l?t.l:"none"} ${void 0!==t.c?t.c:"none"} ${void 0!==t.h?t.h:"none"}${t.alpha<1?` / ${t.alpha}`:""})`,interpolate:{h:{use:Xt,fixup:de},c:Xt,l:Xt,alpha:{use:Xt,fixup:Yt}},difference:{h:_e},average:{h:xe}},Gr={...Vr,mode:"lch65",parse:["--lch-d65"],serialize:"--lch-d65",toMode:{lab65:t=>Se(t,"lab65"),rgb:t=>Oe(Se(t,"lab65"))},fromMode:{rgb:t=>$e(De(t),"lch65"),lab65:t=>$e(t,"lch65")},ranges:{l:[0,100],c:[0,150],h:[0,360]}},Lr=({l:t,u:e,v:r,alpha:s})=>{void 0===e&&(e=0),void 0===r&&(r=0);let i=Math.sqrt(e*e+r*r),o={mode:"lchuv",l:t,c:i};return i&&(o.h=ue(180*Math.atan2(r,e)/Math.PI)),void 0!==s&&(o.alpha=s),o},Ur=({l:t,c:e,h:r,alpha:s})=>{void 0===r&&(r=0);let i={mode:"luv",l:t,u:e?e*Math.cos(r/180*Math.PI):0,v:e?e*Math.sin(r/180*Math.PI):0};return void 0!==s&&(i.alpha=s),i},Hr=(t,e,r)=>4*t/(t+15*e+3*r),qr=(t,e,r)=>9*e/(t+15*e+3*r),Br=Hr(Ae,Me,Ee),Fr=qr(Ae,Me,Ee),Wr=({x:t,y:e,z:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i=(o=e/Me)<=Mr?Ar*o:116*Math.cbrt(o)-16;var o;let a=Hr(t,e,r),n=qr(t,e,r);isFinite(a)&&isFinite(n)?(a=13*i*(a-Br),n=13*i*(n-Fr)):i=a=n=0;let l={mode:"luv",l:i,u:a,v:n};return void 0!==s&&(l.alpha=s),l},Kr=((t,e,r)=>4*t/(t+15*e+3*r))(Ae,Me,Ee),Jr=((t,e,r)=>9*e/(t+15*e+3*r))(Ae,Me,Ee),Xr=({l:t,u:e,v:r,alpha:s})=>{if(void 0===t&&(t=0),0===t)return{mode:"xyz50",x:0,y:0,z:0};void 0===e&&(e=0),void 0===r&&(r=0);let i=e/(13*t)+Kr,o=r/(13*t)+Jr,a=Me*(t<=8?t/Ar:Math.pow((t+16)/116,3)),n={mode:"xyz50",x:a*(9*i)/(4*o),y:a,z:a*(12-3*i-20*o)/(4*o)};return void 0!==s&&(n.alpha=s),n},Zr={mode:"lchuv",toMode:{luv:Ur,rgb:t=>Tr(Xr(Ur(t)))},fromMode:{rgb:t=>Lr(Wr(Ir(t))),luv:Lr},channels:["l","c","h","alpha"],parse:["--lchuv"],serialize:"--lchuv",ranges:{l:[0,100],c:[0,176.956],h:[0,360]},interpolate:{h:{use:Xt,fixup:de},c:Xt,l:Xt,alpha:{use:Xt,fixup:Yt}},difference:{h:_e},average:{h:xe}},Yr={...Qt,mode:"lrgb",toMode:{rgb:le},fromMode:{rgb:oe},parse:["srgb-linear"],serialize:"srgb-linear"},Qr={mode:"luv",toMode:{xyz50:Xr,rgb:t=>Tr(Xr(t))},fromMode:{xyz50:Wr,rgb:t=>Wr(Ir(t))},channels:["l","u","v","alpha"],parse:["--luv"],serialize:"--luv",ranges:{l:[0,100],u:[-84.936,175.042],v:[-125.882,87.243]},interpolate:{l:Xt,u:Xt,v:Xt,alpha:{use:Xt,fixup:Yt}}},ts=({r:t,g:e,b:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i=Math.cbrt(.412221469470763*t+.5363325372617348*e+.0514459932675022*r),o=Math.cbrt(.2119034958178252*t+.6806995506452344*e+.1073969535369406*r),a=Math.cbrt(.0883024591900564*t+.2817188391361215*e+.6299787016738222*r),n={mode:"oklab",l:.210454268309314*i+.7936177747023054*o-.0040720430116193*a,a:1.9779985324311684*i-2.42859224204858*o+.450593709617411*a,b:.0259040424655478*i+.7827717124575296*o-.8086757549230774*a};return void 0!==s&&(n.alpha=s),n},es=t=>{let e=ts(oe(t));return t.r===t.b&&t.b===t.g&&(e.a=e.b=0),e},rs=({l:t,a:e,b:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i=Math.pow(t+.3963377773761749*e+.2158037573099136*r,3),o=Math.pow(t-.1055613458156586*e-.0638541728258133*r,3),a=Math.pow(t-.0894841775298119*e-1.2914855480194092*r,3),n={mode:"lrgb",r:4.076741636075957*i-3.3077115392580616*o+.2309699031821044*a,g:-1.2684379732850317*i+2.6097573492876887*o-.3413193760026573*a,b:-.0041960761386756*i-.7034186179359362*o+1.7076146940746117*a};return void 0!==s&&(n.alpha=s),n},ss=t=>le(rs(t));function is(t){const e=.206,r=1.206/1.03;return.5*(r*t-e+Math.sqrt((r*t-e)*(r*t-e)+.12*r*t))}function os(t){return(t*t+.206*t)/(1.206/1.03*(t+.03))}function as(t,e){let r=function(t,e){let r,s,i,o,a,n,l,h;-1.88170328*t-.80936493*e>1?(r=1.19086277,s=1.76576728,i=.59662641,o=.75515197,a=.56771245,n=4.0767416621,l=-3.3077115913,h=.2309699292):1.81444104*t-1.19445276*e>1?(r=.73956515,s=-.45954404,i=.08285427,o=.1254107,a=.14503204,n=-1.2684380046,l=2.6097574011,h=-.3413193965):(r=1.35733652,s=-.00915799,i=-1.1513021,o=-.50559606,a=.00692167,n=-.0041960863,l=-.7034186147,h=1.707614701);let c=r+s*t+i*e+o*t*t+a*t*e,u=.3963377774*t+.2158037573*e,d=-.1055613458*t-.0638541728*e,p=-.0894841775*t-1.291485548*e;{let t=1+c*u,e=1+c*d,r=1+c*p,s=n*(t*t*t)+l*(e*e*e)+h*(r*r*r),i=n*(3*u*t*t)+l*(3*d*e*e)+h*(3*p*r*r);c-=s*i/(i*i-.5*s*(n*(6*u*u*t)+l*(6*d*d*e)+h*(6*p*p*r)))}return c}(t,e),s=rs({l:1,a:r*t,b:r*e}),i=Math.cbrt(1/Math.max(s.r,s.g,s.b));return[i,i*r]}function ns(t,e,r=null){r||(r=as(t,e));let s=r[0],i=r[1];return[i/s,i/(1-s)]}function ls(t,e,r){let s=as(e,r),i=function(t,e,r,s,i,o=null){let a;if(o||(o=as(t,e)),(r-i)*o[1]-(o[0]-i)*s<=0)a=o[1]*i/(s*o[0]+o[1]*(i-r));else{a=o[1]*(i-1)/(s*(o[0]-1)+o[1]*(i-r));{let o=r-i,n=.3963377774*t+.2158037573*e,l=-.1055613458*t-.0638541728*e,h=-.0894841775*t-1.291485548*e,c=o+s*n,u=o+s*l,d=o+s*h;{let t=i*(1-a)+a*r,e=a*s,o=t+e*n,p=t+e*l,m=t+e*h,g=o*o*o,f=p*p*p,y=m*m*m,v=3*c*o*o,b=3*u*p*p,_=3*d*m*m,x=6*c*c*o,w=6*u*u*p,$=6*d*d*m,S=4.0767416621*g-3.3077115913*f+.2309699292*y-1,k=4.0767416621*v-3.3077115913*b+.2309699292*_,C=k/(k*k-.5*S*(4.0767416621*x-3.3077115913*w+.2309699292*$)),A=-S*C,M=-1.2684380046*g+2.6097574011*f-.3413193965*y-1,E=-1.2684380046*v+2.6097574011*b-.3413193965*_,N=E/(E*E-.5*M*(-1.2684380046*x+2.6097574011*w-.3413193965*$)),T=-M*N,z=-.0041960863*g-.7034186147*f+1.707614701*y-1,I=-.0041960863*v-.7034186147*b+1.707614701*_,P=I/(I*I-.5*z*(-.0041960863*x-.7034186147*w+1.707614701*$)),O=-z*P;A=C>=0?A:1e6,T=N>=0?T:1e6,O=P>=0?O:1e6,a+=Math.min(A,Math.min(T,O))}}}return a}(e,r,t,1,t,s),o=ns(e,r,s),a=t*(.11516993+1/(7.4477897+4.1590124*r+e*(1.75198401*r-2.19557347+e*(-2.13704948-10.02301043*r+e*(5.38770819*r-4.24894561+4.69891013*e))))),n=(1-t)*(.11239642+1/(1.6132032-.68124379*r+e*(.40370612+.90148123*r+e*(.6122399*r-.27087943+e*(.00299215-.45399568*r-.14661872*e))))),l=.9*(i/Math.min(t*o[0],(1-t)*o[1]))*Math.sqrt(Math.sqrt(1/(1/(a*a*a*a)+1/(n*n*n*n))));return a=.4*t,n=.8*(1-t),[Math.sqrt(1/(1/(a*a)+1/(n*n))),l,i]}function hs(t){const e=void 0!==t.l?t.l:0,r=void 0!==t.a?t.a:0,s=void 0!==t.b?t.b:0,i={mode:"okhsl",l:is(e)};void 0!==t.alpha&&(i.alpha=t.alpha);let o=Math.sqrt(r*r+s*s);if(!o)return i.s=0,i;let a,[n,l,h]=ls(e,r/o,s/o);if(o<l){let t=0,e=.8*n;a=.8*((o-t)/(e+(1-e/l)*(o-t)))}else{let t=.2*l*l*1.25*1.25/n;a=.8+.2*((o-l)/(t+(1-t/(h-l))*(o-l)))}return a&&(i.s=a,i.h=ue(180*Math.atan2(s,r)/Math.PI)),i}function cs(t){let e=void 0!==t.h?t.h:0,r=void 0!==t.s?t.s:0,s=void 0!==t.l?t.l:0;const i={mode:"oklab",l:os(s)};if(void 0!==t.alpha&&(i.alpha=t.alpha),!r||1===s)return i.a=i.b=0,i;let o,a,n,l,h=Math.cos(e/180*Math.PI),c=Math.sin(e/180*Math.PI),[u,d,p]=ls(i.l,h,c);r<.8?(o=1.25*r,a=0,n=.8*u,l=1-n/d):(o=5*(r-.8),a=d,n=.2*d*d*1.25*1.25/u,l=1-n/(p-d));let m=a+o*n/(1-l*o);return i.a=m*h,i.b=m*c,i}const us={...Ze,mode:"okhsl",channels:["h","s","l","alpha"],parse:["--okhsl"],serialize:"--okhsl",fromMode:{oklab:hs,rgb:t=>hs(es(t))},toMode:{oklab:cs,rgb:t=>ss(cs(t))}};function ds(t){let e=void 0!==t.l?t.l:0,r=void 0!==t.a?t.a:0,s=void 0!==t.b?t.b:0,i=Math.sqrt(r*r+s*s),o=i?r/i:1,a=i?s/i:1,[n,l]=ns(o,a),h=1-.5/n,c=l/(i+e*l),u=c*e,d=c*i,p=os(u),m=d*p/u,g=rs({l:p,a:o*m,b:a*m}),f=Math.cbrt(1/Math.max(g.r,g.g,g.b,0));e/=f,i=i/f*is(e)/e,e=is(e);const y={mode:"okhsv",s:i?(.5+l)*d/(.5*l+l*h*d):0,v:e?e/u:0};return y.s&&(y.h=ue(180*Math.atan2(s,r)/Math.PI)),void 0!==t.alpha&&(y.alpha=t.alpha),y}function ps(t){const e={mode:"oklab"};void 0!==t.alpha&&(e.alpha=t.alpha);const r=void 0!==t.h?t.h:0,s=void 0!==t.s?t.s:0,i=void 0!==t.v?t.v:0,o=Math.cos(r/180*Math.PI),a=Math.sin(r/180*Math.PI),[n,l]=ns(o,a),h=.5,c=1-h/n,u=1-s*h/(h+l-l*c*s),d=s*l*h/(h+l-l*c*s),p=os(u),m=d*p/u,g=rs({l:p,a:o*m,b:a*m}),f=Math.cbrt(1/Math.max(g.r,g.g,g.b,0)),y=os(i*u),v=d*y/u;return e.l=y*f,e.a=v*o*f,e.b=v*a*f,e}const ms={...tr,mode:"okhsv",channels:["h","s","v","alpha"],parse:["--okhsv"],serialize:"--okhsv",fromMode:{oklab:ds,rgb:t=>ds(es(t))},toMode:{oklab:ps,rgb:t=>ss(ps(t))}};const gs={...Rr,mode:"oklab",toMode:{lrgb:rs,rgb:ss},fromMode:{lrgb:ts,rgb:es},ranges:{l:[0,1],a:[-.4,.4],b:[-.4,.4]},parse:[function(t,e){if(!e||"oklab"!==e[0])return;const r={mode:"oklab"},[,s,i,o,a]=e;return s.type!==Dt.Hue&&i.type!==Dt.Hue&&o.type!==Dt.Hue?(s.type!==Dt.None&&(r.l=Math.min(Math.max(0,s.type===Dt.Number?s.value:s.value/100),1)),i.type!==Dt.None&&(r.a=i.type===Dt.Number?i.value:.4*i.value/100),o.type!==Dt.None&&(r.b=o.type===Dt.Number?o.value:.4*o.value/100),a.type!==Dt.None&&(r.alpha=Math.min(1,Math.max(0,a.type===Dt.Number?a.value:a.value/100))),r):void 0}],serialize:t=>`oklab(${void 0!==t.l?t.l:"none"} ${void 0!==t.a?t.a:"none"} ${void 0!==t.b?t.b:"none"}${t.alpha<1?` / ${t.alpha}`:""})`};const fs={...Vr,mode:"oklch",toMode:{oklab:t=>Se(t,"oklab"),rgb:t=>ss(Se(t,"oklab"))},fromMode:{rgb:t=>$e(es(t),"oklch"),oklab:t=>$e(t,"oklch")},parse:[function(t,e){if(!e||"oklch"!==e[0])return;const r={mode:"oklch"},[,s,i,o,a]=e;if(s.type!==Dt.None){if(s.type===Dt.Hue)return;r.l=Math.min(Math.max(0,s.type===Dt.Number?s.value:s.value/100),1)}if(i.type!==Dt.None&&(r.c=Math.max(0,i.type===Dt.Number?i.value:.4*i.value/100)),o.type!==Dt.None){if(o.type===Dt.Percentage)return;r.h=o.value}return a.type!==Dt.None&&(r.alpha=Math.min(1,Math.max(0,a.type===Dt.Number?a.value:a.value/100))),r}],serialize:t=>`oklch(${void 0!==t.l?t.l:"none"} ${void 0!==t.c?t.c:"none"} ${void 0!==t.h?t.h:"none"}${t.alpha<1?` / ${t.alpha}`:""})`,ranges:{l:[0,1],c:[0,.4],h:[0,360]}},ys=t=>{let{r:e,g:r,b:s,alpha:i}=oe(t),o={mode:"xyz65",x:.486570948648216*e+.265667693169093*r+.1982172852343625*s,y:.2289745640697487*e+.6917385218365062*r+.079286914093745*s,z:0*e+.0451133818589026*r+1.043944368900976*s};return void 0!==i&&(o.alpha=i),o},vs=({x:t,y:e,z:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i=le({r:2.4934969119414263*t-.9313836179191242*e-.402710784450717*r,g:-.8294889695615749*t+1.7626640603183465*e+.0236246858419436*r,b:.0358458302437845*t-.0761723892680418*e+.9568845240076871*r},"p3");return void 0!==s&&(i.alpha=s),i},bs={...Qt,mode:"p3",parse:["display-p3"],serialize:"display-p3",fromMode:{rgb:t=>vs(ae(t)),xyz65:vs},toMode:{rgb:t=>he(ys(t)),xyz65:ys}},_s=t=>{let e=Math.abs(t);return e>=1/512?Math.sign(t)*Math.pow(e,1/1.8):16*t},xs=({x:t,y:e,z:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i={mode:"prophoto",r:_s(1.3457868816471585*t-.2555720873797946*e-.0511018649755453*r),g:_s(-.5446307051249019*t+1.5082477428451466*e+.0205274474364214*r),b:_s(0*t+0*e+1.2119675456389452*r)};return void 0!==s&&(i.alpha=s),i},ws=(t=0)=>{let e=Math.abs(t);return e>=16/512?Math.sign(t)*Math.pow(e,1.8):t/16},$s=t=>{let e=ws(t.r),r=ws(t.g),s=ws(t.b),i={mode:"xyz50",x:.7977666449006423*e+.1351812974005331*r+.0313477341283922*s,y:.2880748288194013*e+.7118352342418731*r+899369387256e-16*s,z:0*e+0*r+.8251046025104602*s};return void 0!==t.alpha&&(i.alpha=t.alpha),i},Ss={...Qt,mode:"prophoto",parse:["prophoto-rgb"],serialize:"prophoto-rgb",fromMode:{xyz50:xs,rgb:t=>xs(Ir(t))},toMode:{xyz50:$s,rgb:t=>Tr($s(t))}},ks=1.09929682680944,Cs=t=>{const e=Math.abs(t);return e>.018053968510807?(Math.sign(t)||1)*(ks*Math.pow(e,.45)-(ks-1)):4.5*t},As=({x:t,y:e,z:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);let i={mode:"rec2020",r:Cs(1.7166511879712683*t-.3556707837763925*e-.2533662813736599*r),g:Cs(-.6666843518324893*t+1.6164812366349395*e+.0157685458139111*r),b:Cs(.0176398574453108*t-.0427706132578085*e+.9421031212354739*r)};return void 0!==s&&(i.alpha=s),i},Ms=1.09929682680944,Es=(t=0)=>{let e=Math.abs(t);return e<.08124285829863151?t/4.5:(Math.sign(t)||1)*Math.pow((e+Ms-1)/Ms,1/.45)},Ns=t=>{let e=Es(t.r),r=Es(t.g),s=Es(t.b),i={mode:"xyz65",x:.6369580483012911*e+.1446169035862083*r+.1688809751641721*s,y:.262700212011267*e+.6779980715188708*r+.059301716469862*s,z:0*e+.0280726930490874*r+1.0609850577107909*s};return void 0!==t.alpha&&(i.alpha=t.alpha),i},Ts={...Qt,mode:"rec2020",fromMode:{xyz65:As,rgb:t=>As(ae(t))},toMode:{xyz65:Ns,rgb:t=>he(Ns(t))},parse:["rec2020"],serialize:"rec2020"},zs=.0037930732552754493,Is=Math.cbrt(zs),Ps=t=>Math.cbrt(t)-Is,Os=t=>Math.pow(t+Is,3),js={mode:"xyb",channels:["x","y","b","alpha"],parse:["--xyb"],serialize:"--xyb",toMode:{rgb:({x:t,y:e,b:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);const i=Os(t+e)-zs,o=Os(e-t)-zs,a=Os(r+e)-zs,n=le({r:11.031566904639861*i-9.866943908131562*o-.16462299650829934*a,g:-3.2541473810744237*i+4.418770377582723*o-.16462299650829934*a,b:-3.6588512867136815*i+2.7129230459360922*o+1.9459282407775895*a});return void 0!==s&&(n.alpha=s),n}},fromMode:{rgb:t=>{const{r:e,g:r,b:s,alpha:i}=oe(t),o=Ps(.3*e+.622*r+.078*s+zs),a=Ps(.23*e+.692*r+.078*s+zs),n={mode:"xyb",x:(o-a)/2,y:(o+a)/2,b:Ps(.2434226892454782*e+.2047674442449682*r+.5518098665095535*s+zs)-(o+a)/2};return void 0!==i&&(n.alpha=i),n}},ranges:{x:[-.0154,.0281],y:[0,.8453],b:[-.2778,.388]},interpolate:{x:Xt,y:Xt,b:Xt,alpha:{use:Xt,fixup:Yt}}},Rs={mode:"xyz50",parse:["xyz-d50"],serialize:"xyz-d50",toMode:{rgb:Tr,lab:Or},fromMode:{rgb:Ir,lab:Nr},channels:["x","y","z","alpha"],ranges:{x:[0,.964],y:[0,.999],z:[0,.825]},interpolate:{x:Xt,y:Xt,z:Xt,alpha:{use:Xt,fixup:Yt}}},Ds={mode:"xyz65",toMode:{rgb:he,xyz50:t=>{let{x:e,y:r,z:s,alpha:i}=t;void 0===e&&(e=0),void 0===r&&(r=0),void 0===s&&(s=0);let o={mode:"xyz50",x:1.0479298208405488*e+.0229467933410191*r-.0501922295431356*s,y:.0296278156881593*e+.990434484573249*r-.0170738250293851*s,z:-.0092430581525912*e+.0150551448965779*r+.7518742899580008*s};return void 0!==i&&(o.alpha=i),o}},fromMode:{rgb:ae,xyz50:t=>{let{x:e,y:r,z:s,alpha:i}=t;void 0===e&&(e=0),void 0===r&&(r=0),void 0===s&&(s=0);let o={mode:"xyz65",x:.9554734527042182*e-.0230985368742614*r+.0632593086610217*s,y:-.0283697069632081*e+1.0099954580058226*r+.021041398966943*s,z:.0123140016883199*e-.0205076964334779*r+1.3303659366080753*s};return void 0!==i&&(o.alpha=i),o}},ranges:{x:[0,.95],y:[0,1],z:[0,1.088]},channels:["x","y","z","alpha"],parse:["xyz","xyz-d65"],serialize:"xyz-d65",interpolate:{x:Xt,y:Xt,z:Xt,alpha:{use:Xt,fixup:Yt}}},Vs={mode:"yiq",toMode:{rgb:({y:t,i:e,q:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);const i={mode:"rgb",r:t+.95608445*e+.6208885*r,g:t-.27137664*e-.6486059*r,b:t-1.10561724*e+1.70250126*r};return void 0!==s&&(i.alpha=s),i}},fromMode:{rgb:({r:t,g:e,b:r,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0);const i={mode:"yiq",y:.29889531*t+.58662247*e+.11448223*r,i:.59597799*t-.2741761*e-.32180189*r,q:.21147017*t-.52261711*e+.31114694*r};return void 0!==s&&(i.alpha=s),i}},channels:["y","i","q","alpha"],parse:["--yiq"],serialize:"--yiq",ranges:{i:[-.595,.595],q:[-.522,.522]},interpolate:{y:Xt,i:Xt,q:Xt,alpha:{use:Xt,fixup:Yt}}};Pt(ce),Pt(we),Pt(We),Pt(Ke),Pt(Je),Pt(Ze),Pt(tr),Pt(er),Pt(pr),Pt($r),Pt(Cr),Pt(Rr),Pt(Dr),Pt(Vr),Pt(Gr),Pt(Zr),Pt(Yr),Pt(Qr),Pt(us),Pt(ms),Pt(gs),Pt(fs),Pt(bs),Pt(Ss),Pt(Ts),Pt(Qt),Pt(js),Pt(Rs),Pt(Ds),Pt(Vs);const Gs=t=>{const e=Math.round(Math.min(Math.max(t,0),255)).toString(16);return 1===e.length?`0${e}`:e},Ls=t=>`#${Gs(t[0])}${Gs(t[1])}${Gs(t[2])}`,Us=t=>{const[e,r,s]=t,i=Math.max(e,r,s),o=i-Math.min(e,r,s),a=o&&(i===e?(r-s)/o:i===r?2+(s-e)/o:4+(e-r)/o);return[60*(a<0?a+6:a),i&&o/i,i]},Hs=t=>{const[e,r,s]=t,i=t=>{const i=(t+e/60)%6;return s-s*r*Math.max(Math.min(i,4-i,1),0)};return[i(5),i(3),i(1)]},qs=t=>Hs([t[0],t[1],255]),Bs=(t,e,r)=>Math.min(Math.max(t,e),r),Fs=t=>{const e=t/100;return[Math.round(Ws(e)),Math.round(Ks(e)),Math.round(Js(e))]},Ws=t=>{if(t<=66)return 255;return Bs(329.698727446*(t-60)**-.1332047592,0,255)},Ks=t=>{let e;return e=t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*(t-60)**-.0755148492,Bs(e,0,255)},Js=t=>{if(t>=66)return 255;if(t<=19)return 0;const e=138.5177312231*Math.log(t-10)-305.0447927307;return Bs(e,0,255)},Xs=(t,e)=>{const r=Math.max(...t),s=Math.max(...e);let i;return i=0===s?0:r/s,e.map((t=>Math.round(t*i)))},Zs=t=>0===t?1e6:Math.floor(1e6/t),Ys=(t,e,r)=>{const[s,i,o,a,n]=t,l=Zs(e??2700),h=Zs(r??6500),c=l-h;let u;try{u=n/(a+n)}catch(b){u=.5}const d=h+u*c,p=d?0===(m=d)?1e6:Math.floor(1e6/m):0;var m;const[g,f,y]=Fs(p),v=Math.max(a,n)/255;return Xs([s,i,o,a,n],[s+g*v,i+f*v,o+y*v])},Qs=t=>yt(t.entity_id),ti="unavailable",ei=(ri=[ti,"unknown"],(t,e)=>ri.includes(t,e));var ri;const si=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater","weather"]),ii=(t,e)=>{if((void 0!==e?e:t?.state)===ti)return"var(--state-unavailable-color)";const r=ni(t,e);return r?(s=r,Array.isArray(s)?s.reverse().reduce(((t,e)=>`var(${e}${t?`, ${t}`:""})`),void 0):`var(${s})`):void 0;var s},oi=(t,e,r)=>{const s=void 0!==r?r:e.state,i=function(t,e){const r=yt(t.entity_id),s=void 0!==e?e:t?.state;if(["button","event","infrared","input_button","radio_frequency","scene"].includes(r))return s!==ti;if(ei(s))return!1;if("off"===s&&"alert"!==r)return!1;switch(r){case"alarm_control_panel":return"disarmed"!==s;case"alert":return"idle"!==s;case"cover":case"valve":return"closed"!==s;case"device_tracker":case"person":return"not_home"!==s;case"lawn_mower":return!["docked","paused"].includes(s);case"lock":return"locked"!==s;case"media_player":return"standby"!==s;case"vacuum":return!["idle","docked","paused"].includes(s);case"plant":return"problem"===s;case"group":return["on","home","open","locked","problem"].includes(s);case"timer":return"active"===s;case"camera":return"streaming"===s}return!0}(e,r);return ai(t,e.attributes.device_class,s,i)},ai=(t,e,r,s)=>{const i=[],o=((t,e="_")=>{const r="àáâäæãåāăąабçćčđďдèéêëēėęěеёэфğǵгḧхîïíīįìıİийкłлḿмñńǹňнôöòóœøōõőоṕпŕřрßśšşșсťțтûüùúūǘůűųувẃẍÿýыžźżз·",s=`aaaaaaaaaaabcccdddeeeeeeeeeeefggghhiiiiiiiiijkllmmnnnnnoooooooooopprrrsssssstttuuuuuuuuuuvwxyyyzzzz${e}`,i=new RegExp(r.split("").join("|"),"g"),o={"ж":"zh","х":"kh","ц":"ts","ч":"ch","ш":"sh","щ":"shch","ю":"iu","я":"ia"};let a;return""===t?a="":(a=t.toString().toLowerCase().replace(i,(t=>s.charAt(r.indexOf(t)))).replace(/[а-я]/g,(t=>o[t]||"")).replace(/(\d),(?=\d)/g,"$1").replace(/[^a-z0-9]+/g,e).replace(new RegExp(`(${e})\\1+`,"g"),"$1").replace(new RegExp(`^${e}+`),"").replace(new RegExp(`${e}+$`),""),""===a&&(a="unknown")),a})(r,"_"),a=s?"active":"inactive";return e&&i.push(`--state-${t}-${e}-${o}-color`),i.push(`--state-${t}-${o}-color`,`--state-${t}-${a}-color`,`--state-${a}-color`),i},ni=(t,e)=>{const r=void 0!==e?e:t?.state,s=yt(t.entity_id),i=t.attributes.device_class;if("sensor"===s&&"battery"===i){const t=(t=>{const e=Number(t);if(!isNaN(e))return e>=70?"--state-sensor-battery-high-color":e>=30?"--state-sensor-battery-medium-color":"--state-sensor-battery-low-color"})(r);if(t)return[t]}if("group"===s){const r=(t=>{const e=t.attributes.entity_id||[],r=[...new Set(e.map((t=>yt(t))))];return 1===r.length?r[0]:void 0})(t);if(r&&si.has(r))return oi(r,t,e)}if(si.has(s))return oi(s,t,e)};var li;!function(t){t[t.TARGET_TEMPERATURE=1]="TARGET_TEMPERATURE",t[t.TARGET_TEMPERATURE_RANGE=2]="TARGET_TEMPERATURE_RANGE",t[t.TARGET_HUMIDITY=4]="TARGET_HUMIDITY",t[t.FAN_MODE=8]="FAN_MODE",t[t.PRESET_MODE=16]="PRESET_MODE",t[t.SWING_MODE=32]="SWING_MODE",t[t.AUX_HEAT=64]="AUX_HEAT",t[t.TURN_OFF=128]="TURN_OFF",t[t.TURN_ON=256]="TURN_ON",t[t.SWING_HORIZONTAL_MODE=512]="SWING_HORIZONTAL_MODE"}(li||(li={})),["auto","heat_cool","heat","cool","dry","fan_only","off"].reduce(((t,e,r)=>(t[e]=r,t)),{});const hi={cooling:"cool",defrosting:"heat",drying:"dry",fan:"fan_only",heating:"heat",idle:"off",off:"off",preheating:"heat"};class ci{static{ci.colorCache={},ci.element=void 0,ci.unresolvedColor=!1}static _prefixKeys(t){let e={};return Object.keys(t).forEach((r=>{const s=`--${r}`,i=String(t[r]);e[s]=`${i}`})),e}static processTheme(t){let e={},r={},s={},i={};const{modes:o,...a}=t;return o&&(r={...a,...o.dark},e={...a,...o.light}),s=ci._prefixKeys(e),i=ci._prefixKeys(r),{themeLight:s,themeDark:i}}static processPalette(t){let e={},r={},s={},i={},o={};return Object.values(t).forEach((t=>{const{modes:i,...o}=t;e={...e,...o},i&&(s={...s,...o,...i.dark},r={...r,...o,...i.light})})),i=ci._prefixKeys(r),o=ci._prefixKeys(s),{paletteLight:i,paletteDark:o}}static setElement(t){ci.element=t}static calculateColor(t,e,r){const s=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let i,o,a;const n=s.length;if(t<=s[0])return e[s[0]];if(t>=s[n-1])return e[s[n-1]];for(let l=0;l<n-1;l++){const n=s[l],h=s[l+1];if(t>=n&&t<h){if([i,o]=[e[n],e[h]],!r)return i;a=ci.calculateValueBetween(n,h,t);break}}return ci.getGradientValue(i,o,a)}static calculateColor2(t,e,r,s,i){const o=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let a,n,l;const h=o.length;if(t<=o[0])return e[o[0]];if(t>=o[h-1])return e[o[h-1]];for(let c=0;c<h-1;c++){const h=o[c],u=o[c+1];if(t>=h&&t<u){if([a,n]=[e[h].styles[r][s],e[u].styles[r][s]],!i)return a;l=ci.calculateValueBetween(h,u,t);break}}return ci.getGradientValue(a,n,l)}static calculateValueBetween(t,e,r){return(Math.min(Math.max(r,t),e)-t)/(e-t)}static getLovelacePanel(){var t=window.document.querySelector("home-assistant");return(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))||null}static calculateStrokeColor(t,e,r){const s=e?.colors??[];if(!s.length)return;const i=Number(t);if(!Number.isFinite(i))return s[0].color;if(i<=s[0].value)return s[0].color;const o=s[s.length-1];if(i>=o.value)return o.color;for(let a=0;a<s.length-1;a+=1){const t=s[a],e=s[a+1];if(i>=t.value&&i<e.value){if(!r)return t.color;const s=ci.calculateValueBetween(t.value,e.value,i);return ci.getGradientValue(t.color,e.color,s)}}return o.color}static resolveColorVariable(t){const e=this.element.style.getPropertyValue(t).trim();let r=e;if(e.startsWith("var(")){const t=e.replace(/^var\((--.*?)\)$/,"$1").trim();r=window.getComputedStyle(document.body).getPropertyValue(t).trim()}return r}static getColorVariable(t){const e=t.slice(4,-1).trim();let r=e,s="",i=0;for(let n=0;n<e.length;n+=1){const t=e[n];if("("===t)i+=1;else if(")"===t)i-=1;else if(","===t&&0===i){r=e.slice(0,n).trim(),s=e.slice(n+1).trim();break}}const o=getComputedStyle(ci.element).getPropertyValue(r).trim();if(o)return o;this.lovelace||(this.lovelace=ci.getLovelacePanel());const a=getComputedStyle(this.lovelace).getPropertyValue(r).trim();return a||s}static getLovelaceColorVariable(t){const e=t.substr(4,t.length-5);this.lovelace||(this.lovelace=ci.getLovelacePanel());return window.getComputedStyle(this.lovelace).getPropertyValue(e)}static getGradientValue(t,e,r){const s=ci.colorToRGBA(t),i=ci.colorToRGBA(e);if(!s||!i)return void(ci.unresolvedColor=!0);const o=1-r,a=r,n=Math.floor(s[0]*o+i[0]*a),l=Math.floor(s[1]*o+i[1]*a),h=Math.floor(s[2]*o+i[2]*a),c=Math.floor(s[3]*o+i[3]*a);return`#${ci.padZero(n.toString(16))}${ci.padZero(l.toString(16))}${ci.padZero(h.toString(16))}${ci.padZero(c.toString(16))}`}static padZero(t){return t.length<2&&(t=`0${t}`),t.substr(0,2)}static resolveColorVariableV0(t){let e=t;for(;"string"==typeof e&&e.trim().startsWith("var(");)e=ci.getColorVariable(e).trim(),console.log("resolving color variable ",t,", to: ",e,"...");return e}static colorToRGBAChat(t){if(null==t)return[0,0,0,0];const e=ci.colorCache[t];if(e)return e;let r=t;"string"==typeof r&&r.trim().startsWith("var(")&&(r=ci.resolveColorVariable(r));const s=window.document.createElement("canvas");s.width=s.height=1;const i=s.getContext("2d");i.clearRect(0,0,1,1),i.fillStyle=r,i.fillRect(0,0,1,1);const o=[...i.getImageData(0,0,1,1).data];return ci.colorCache[t]=o,o}static colorToRGBA(t){if(null==t)return[0,0,0,0];const e=ci.colorCache[t];if(e)return e;let r=t;if("var"===t.substr(0,3).valueOf()){r=t;for(let e=0;e<10&&r.trim().startsWith("var(");e+=1)if(r=ci.getColorVariable(r.trim()),!r)return ci.unresolvedColor=!0,void(ci.element?.dev?.debug_colors&&console.log("[horseshoe-colors] unresolved css var",{argColor:t}))}let s=Jt(r);if(!s){const e=window.document.createElement("span"),i="rgb(1, 2, 3)";e.style.color=i,e.style.color=r,ci.element.appendChild(e);const o=window.getComputedStyle(e).color;if(e.remove(),o!==i&&(s=Jt(o)),!s)return ci.unresolvedColor=!0,void(ci.element?.dev?.debug_colors&&console.log("[horseshoe-colors] unparseable color",{argColor:t,resolvedColor:r,computedColor:o}))}const i=Mt("rgb")(s),o=[Math.round(255*Math.min(Math.max(i.r,0),1)),Math.round(255*Math.min(Math.max(i.g,0),1)),Math.round(255*Math.min(Math.max(i.b,0),1)),Math.round(255*(i.alpha??1))];return ci.colorCache[t]=o,o}static hslToRgb(t){const e=t.h/360,r=t.s/100,s=t.l/100;let i,o,a;if(0===r)i=o=a=s;else{function n(t,e,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?t+6*(e-t)*r:r<.5?e:r<2/3?t+(e-t)*(2/3-r)*6:t}const l=s<.5?s*(1+r):s+r-s*r,h=2*s-l;i=n(h,l,e+1/3),o=n(h,l,e),a=n(h,l,e-1/3)}return i*=255,o*=255,a*=255,{r:i,g:o,b:a}}static computeColor(t){if(t.attributes?.hvac_action){const e=t.attributes.hvac_action;return e in hi?ii(t,hi[e]):void 0}if(t.attributes?.rgb_color)return`rgb(${t.attributes.rgb_color.join(",")})`;const e=ii(t);return e||void 0}static getHaEntityIconStyle(t){const e=ci.computeColor(t),r=(t=>{if(t.attributes.brightness&&"plant"!==yt(t.entity_id))return`brightness(${(t.attributes.brightness+245)/5}%)`;return""})(t);return{color:e??"var(--state-icon-color)",fill:"currentColor",...r?{filter:r}:{}}}}const ui=200,di=ui,pi={rectangles:100,circles:200,horseshoes:300,horseshoes_v2:300,lines:400,hlines:400,vlines:400,icons:500,areas:600,names:700,states:800},mi={rectangles:1e5,circles:2e5,horseshoes:3e5,horseshoes_v2:3e5,lines:4e5,hlines:4e5,vlines:4e5,icons:5e5,areas:6e5,names:7e5,states:8e5};class gi{static calculateValueBetween(t,e,r){return isNaN(r)?0:r?(Math.min(Math.max(r,t),e)-t)/(e-t):0}static calculateSvgCoordinate(t,e){return t/100*ui+(e-100)}static calculateSvgDimension(t){return t/100*ui}static getLovelace(){let t=window.document.querySelector("home-assistant");if(t=t&&t.shadowRoot,t=t&&t.querySelector("home-assistant-main"),t=t&&t.shadowRoot,t=t&&t.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"),t=t&&t.shadowRoot||t,t=t&&t.querySelector("ha-panel-lovelace"),t=t&&t.shadowRoot,t=t&&t.querySelector("hui-root"),t){console.log("getLoveLace, root",t,t.lovelace);const e=t.lovelace;return e.current_view=t.___curView,e}return null}}class fi{static mergeDeep(...t){const e=t=>t&&"object"==typeof t;return t.reduce(((t,r)=>(Object.keys(r).forEach((s=>{const i=t[s],o=r[s];Array.isArray(i)&&Array.isArray(o)?t[s]=i.concat(...o):e(i)&&e(o)?t[s]=this.mergeDeep(i,o):t[s]=o})),t)),{})}}const yi={enabled:!0,duration:2500,easing:"ease-out",debug:!1};function vi(t,e,r,s={}){const i=Number(r.fromValue),o=Number(r.toValue),a=s.onUpdate,n=s.onComplete;if(!1===e.enabled)return a&&a(o),void(n&&n(o));!function(t){t.frame&&cancelAnimationFrame(t.frame),t.frame=void 0,t.startTime=void 0,t.animating=!1}(t),t.fromValue=i,t.toValue=o,t.startTime=void 0,t.animating=!0,e.debug&&console.log("[horseshoe animation] start",{fromValue:t.fromValue,toValue:t.toValue});const l=r=>{t.startTime||(t.startTime=r);const s=Number(e.duration??yi.duration),i=r-t.startTime,o=s<=0?1:Bs(i/s,0,1),h=function(t,e){return"linear"===e?t:"ease-in"===e?t**3:"ease-in-out"===e?t<.5?4*t**3:1-(-2*t+2)**3/2:1-(1-t)**3}(o,e.easing),c=t.fromValue+(t.toValue-t.fromValue)*h;a&&a(c),o<1?t.frame=requestAnimationFrame((t=>l(t))):(t.frame=void 0,t.startTime=void 0,t.animating=!1,n&&n(t.toValue),e.debug&&console.log("[horseshoe animation] end",{value:t.toValue}))};t.frame=requestAnimationFrame((t=>l(t)))}const bi=Math.PI/180;class _i{constructor(t,e){this.x=t,this.y=e;const r=t.length;this.n=r;const s=new Array(r-1),i=new Array(r-1);for(let o=0;o<r-1;o+=1)s[o]=t[o+1]-t[o],i[o]=(e[o+1]-e[o])/s[o];this.c1s=new Array(r).fill(0),this.c1s[0]=i[0];for(let o=1;o<r-1;o+=1)this.c1s[o]=(i[o-1]+i[o])/2;this.c1s[r-1]=i[r-2];for(let o=0;o<r-1;o+=1)if(0===i[o])this.c1s[o]=0,this.c1s[o+1]=0;else{const t=this.c1s[o]/i[o],e=this.c1s[o+1]/i[o],r=Math.hypot(t,e);if(r>3){const s=3/r;this.c1s[o]=s*t*i[o],this.c1s[o+1]=s*e*i[o]}}this.c2s=new Array(r-1),this.c3s=new Array(r-1);for(let o=0;o<r-1;o+=1){const t=i[o],e=this.c1s[o+1],r=this.c1s[o];this.c2s[o]=(3*t-2*r-e)/s[o],this.c3s[o]=(r+e-2*t)/(s[o]*s[o])}}get(t){if(t<=this.x[0])return this.y[0];if(t>=this.x[this.n-1])return this.y[this.n-1];let e=0;for(let s=0;s<this.n-1;s+=1)if(t>=this.x[s]&&t<=this.x[s+1]){e=s;break}const r=t-this.x[e];return this.y[e]+this.c1s[e]*r+this.c2s[e]*r*r+this.c3s[e]*r*r*r}}class xi{constructor(t,e){this.x=t,this.y=e,this.n=t.length,this.m=new Array(this.n-1),this.t=new Array(this.n);const r=new Array(this.n-1),s=new Array(this.n-1);for(let i=0;i<this.n-1;i+=1)r[i]=t[i+1]-t[i],s[i]=e[i+1]-e[i],this.m[i]=s[i]/r[i];this.t[0]=.25*this.m[0],this.t[this.n-1]=.25*this.m[this.n-2];for(let i=1;i<this.n-1;i+=1)if(0===this.m[i-1]||0===this.m[i]||this.m[i-1]*this.m[i]<0)this.t[i]=0;else{const t=2*r[i]+r[i-1],e=r[i]+2*r[i-1];this.t[i]=(t+e)/(t/this.m[i-1]+e/this.m[i])}for(let i=0;i<this.n-1;i+=1)if(0===this.m[i])this.t[i]=0,this.t[i+1]=0;else{const t=this.t[i]/this.m[i],e=this.t[i+1]/this.m[i],r=t*t+e*e;if(r>9){const s=3/Math.sqrt(r);this.t[i]=s*t*this.m[i],this.t[i+1]=s*e*this.m[i]}}}get(t){if(t<=this.x[0])return this.y[0];if(t>=this.x[this.n-1])return this.y[this.n-1];let e=0;for(let h=0;h<this.n-1;h+=1)if(t>=this.x[h]&&t<=this.x[h+1]){e=h;break}const r=this.x[e+1]-this.x[e],s=(t-this.x[e])/r,i=s*s,o=i*s,a=o-2*i+s,n=-2*o+3*i,l=o-i;return(2*o-3*i+1)*this.y[e]+a*r*this.t[e]+n*this.y[e+1]+l*r*this.t[e+1]}}class wi{constructor(t){if(this.type=t.type,this.min=Number(t.min),this.max=Number(t.max),this.points=wi.buildPoints(t),"splineorg"!==this.type)if("spline"!==this.type){if("linear"!==this.type)throw new Error(`[V2 GaugeScale] Unsupported scale type: ${this.type}`)}else this.spline=new xi(this.points.map((t=>t.value)),this.points.map((t=>t.position)));else this.splineorg=new _i(this.points.map((t=>t.value)),this.points.map((t=>t.position)))}static buildPoints(t){if("splineorg"!==t.type&&"spline"!==t.type)return[{value:Number(t.min),position:0},{value:Number(t.max),position:1}];if(!t.spline?.anchors)throw new Error("[V2 GaugeScale] Missing horseshoe_scale.spline.anchors");const e=t.spline.anchors.map((t=>({value:Number(t.value),position:Number(t.position)}))).filter((t=>Number.isFinite(t.value)&&Number.isFinite(t.position))).sort(((t,e)=>t.value-e.value));if("spline"===t.type){const r=Number(t.min),s=Number(t.max),i=e.filter((t=>t.value>r&&t.value<s));return[{value:r,position:0},...i,{value:s,position:1}].filter((t=>Number.isFinite(t.value)&&Number.isFinite(t.position))).sort(((t,e)=>t.value-e.value))}return e}toRatio(t){const e=Number(t);return"splineorg"===this.type?Bs(this.splineorg.get(e),0,1):"spline"===this.type?Bs(this.spline.get(e),0,1):Bs((e-this.min)/(this.max-this.min),0,1)}}class $i{constructor(t,e){this.cx=t.svg.xpos,this.cy=t.svg.ypos,this.radius=t.svg.radius,this.tickmarksRadius=t.svg.tickmarks_radius,this.arcDegrees=t.arc_degrees,this.startAngle=t.start_angle,this.endAngle=this.startAngle+this.arcDegrees,this.rotation=Number(t.rotate??0),this.flip=t.flip??"none",this.groupConfig=t.group_config,this.barMode=t.bar_mode,this.zeroRatio=t.zero_ratio,this.zeroAngle=this.ratioToAngle(this.zeroRatio),this.scale=e}getTransformContext(){return{rotation:this.rotation,flipX:"x"===this.flip||"both"===this.flip,flipY:"y"===this.flip||"both"===this.flip}}getRotateTransform(){return this.rotation?`rotate(${this.rotation} ${this.cx} ${this.cy})`:""}getScaleTransform(){const t=this.getTransformContext();if(!t.flipX&&!t.flipY)return"";const e=t.flipX?-1:1,r=t.flipY?-1:1;return`translate(${this.cx} ${this.cy}) scale(${e} ${r}) translate(${-this.cx} ${-this.cy})`}getGroupRotateTransform(){const t=Number(this.groupConfig?.rotate??this.groupConfig?.rotation??0);return t?`rotate(${t} ${this.groupConfig.svg.xpos} ${this.groupConfig.svg.ypos})`:""}getGroupScaleTransform(){if(!this.groupConfig?.scale)return"";const t=this.groupConfig.scale.x??this.groupConfig.scale,e=this.groupConfig.scale.y??this.groupConfig.scale;return`translate(${this.groupConfig.svg.xpos} ${this.groupConfig.svg.ypos}) scale(${t} ${e}) translate(${-this.groupConfig.svg.xpos} ${-this.groupConfig.svg.ypos})`}getGroupTransform(){return[this.getGroupRotateTransform(),this.getGroupScaleTransform(),this.getRotateTransform(),this.getScaleTransform()].filter(Boolean).join(" ")}getInverseGroupTransform(){const t=this.getTransformContext(),e=[];if(t.flipX||t.flipY){const r=t.flipX?-1:1,s=t.flipY?-1:1;e.push(`translate(${this.cx} ${this.cy})`),e.push(`scale(${r} ${s})`),e.push(`translate(${-this.cx} ${-this.cy})`)}return this.rotation&&e.push(`rotate(${-this.rotation} ${this.cx} ${this.cy})`),e.join(" ")}ratioToAngle(t){return this.startAngle+t*this.arcDegrees}scaleValueToRatio(t){return this.scale.toRatio(t)}scaleValueToAngle(t){return this.ratioToAngle(this.scaleValueToRatio(t))}valueToRatio(t){const e=Number(t);if(!("bidirectional"===this.barMode||"bidirectional_symmetrical"===this.barMode)||this.scale.min>=0||this.scale.max<=0)return this.scaleValueToRatio(e);const r=this.scaleValueToRatio(0);if(e<0){const t=this.scaleValueToRatio(e);return.5*Bs(r>0?t/r:0,0,1)}const s=this.scaleValueToRatio(e),i=1-r;return.5+.5*Bs(i>0?(s-r)/i:0,0,1)}valueToAngle(t){return this.ratioToAngle(this.valueToRatio(t))}pointAt(t,e){const r=t*bi;return{x:this.cx+Math.cos(r)*e,y:this.cy+Math.sin(r)*e}}}class Si{static renderLabel(t){return"horizontal"===(t.orientation??"arc")?Si.renderHorizontalLabel(t):Si.renderArcLabel(t)}static renderHorizontalLabel(t){const e=Si.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:t.angle}),r=t.transformContext??{},s=r.rotation??0,i=r.flipX??!1?-1:1,o=r.flipY??!1?-1:1;return H`
      <text
        x="${e.x}"
        y="${e.y}"
        text-anchor="middle"
        style="dominant-baseline:central;fill:var(--primary-text-color)"
        class="horseshoe-label"
        transform="
          translate(${e.x} ${e.y})
          scale(${i} ${o})
          rotate(${-s})
          translate(${-e.x} ${-e.y})
        "
      >
        ${t.label}
      </text>
    `}static renderArcLabel(t){const e=String(t.label??""),r=Si.getLabelGeometry({angle:t.angle,transformContext:t.transformContext}).visualAngle,s=r>=180&&r<=360,i=r-12,o=r+12,a=s?i:o,n=s?o:i,l=s?1:0,h=Si.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:a}),c=Si.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:n}),u=`${t.cardId}-horseshoe-label-${t.horseshoeIndex}-${t.index}`,d=t.inverseTransform??"";return H`
      <g transform="${d}">
        <path
          id="${u}"
          d="M ${h.x} ${h.y} A ${t.radius} ${t.radius} 0 0 ${l} ${c.x} ${c.y}"
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
            ${e}
          </textPath>
        </text>
      </g>
    `}static renderLabelBadge(t){return"horizontal"===(t.orientation??"arc")?Si.renderHorizontalBadge(t):Si.renderArcBadge(t)}static renderArcSegment(t){const e=Si.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:t.startAngle}),r=Si.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:t.endAngle}),s=Math.abs(t.endAngle-t.startAngle)>180?1:0,i=t.endAngle>t.startAngle?1:0;return H`
      <path
        class="${t.className??""}"
        d="M ${e.x} ${e.y} A ${t.radius} ${t.radius} 0 ${s} ${i} ${r.x} ${r.y}"
        fill="none"
        stroke="${t.color??"currentColor"}"
        stroke-width="${t.width}"
        stroke-linecap="${t.lineCap??"round"}"
      />
    `}static renderArcBadge(t){const e=String(t.label??""),r=t.badge??{},s=Number(r.padding??2),i=Number(r.char_width??4),o=Number(r.width??e.length*i+2*s),a=Number(r.height??8),n=Math.max(0,o-a),l=Si.arcLengthToDegrees(n,t.radius),h=Si.buildArcCapsulePath({cx:t.cx,cy:t.cy,radius:t.radius,angle:t.angle,arcSize:l,width:a});return H`
      <path
        class="horseshoe-label-badge"
        d="${h}"
        fill="${r.color??"var(--card-background-color)"}"
        stroke="${r.border_color??"none"}"
      />
    `}static renderHorizontalBadge(t){const e=t.badge??{},r=Si.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:t.angle}),s=String(t.label??""),i=Number(e.padding??4),o=Number(e.radius??Math.max(7,3*s.length+i));return H`
      <circle
        class="horseshoe-label-badge"
        cx="${r.x}"
        cy="${r.y}"
        r="${o}"
        fill="${e.color??"var(--card-background-color)"}"
        stroke="${e.border_color??"none"}"
      />
    `}static pointAt(t){const e=Si.degToRad(t.angle);return{x:t.cx+Math.cos(e)*t.radius,y:t.cy+Math.sin(e)*t.radius}}static normalizeAngle(t){return(t%360+360)%360}static degToRad(t){return t*Math.PI/180}static radToDeg(t){return 180*t/Math.PI}static arcLengthToDegrees(t,e){return Number(t)/(2*Math.PI*e)*360}static getLabelGeometry(t){const e=t.angle??0,r=t.transformContext??{},s=r.rotation??0,i=r.flipX??!1,o=r.flipY??!1;return{positionAngle:e,visualAngle:Si.getVisualAngleFromParentTransform({angle:e,rotation:s,flipX:i,flipY:o}),mirrored:i!==o}}static getVisualAngleFromParentTransform(t){const e=t.angle??0,r=t.rotation??0,s=t.flipX??!1?-1:1,i=t.flipY??!1?-1:1,o=Si.degToRad(e),a=Si.degToRad(r),n=Math.cos(o),l=Math.sin(o),h=(n*Math.cos(a)-l*Math.sin(a))*s,c=(n*Math.sin(a)+l*Math.cos(a))*i;return Si.normalizeAngle(Si.radToDeg(Math.atan2(c,h)))}static buildArcCapsulePath(t){const e=t.width/2,r=t.radius+e,s=t.radius-e,i=t.angle-t.arcSize/2,o=t.angle+t.arcSize/2,a=Si.pointAt({cx:t.cx,cy:t.cy,radius:r,angle:i}),n=Si.pointAt({cx:t.cx,cy:t.cy,radius:r,angle:o}),l=Si.pointAt({cx:t.cx,cy:t.cy,radius:s,angle:o}),h=Si.pointAt({cx:t.cx,cy:t.cy,radius:s,angle:i}),c=t.arcSize>180?1:0;return`\n      M ${a.x} ${a.y}\n      A ${r} ${r} 0 ${c} 1 ${n.x} ${n.y}\n      A ${e} ${e} 0 0 1 ${l.x} ${l.y}\n      A ${s} ${s} 0 ${c} 0 ${h.x} ${h.y}\n      A ${e} ${e} 0 0 1 ${a.x} ${a.y}\n      Z\n    `}}function ki(t,e,r){return`horseshoe-state-${t}-${e}-${r}`}function Ci(t,e){return`horseshoe-state-gradient-${t}-${e}`}function Ai(t,e,r,s,i){const o={...t.horseshoe_state.styles},a={...t.horseshoe_scale.styles},n=Ci(s,i);return H`
    <g class="horseshoe__state-layer">
      ${function(t,e,r,s,i){if("lineargradient"!==t.show?.horseshoe_style)return"";const o=t.colorStops.colors,a=o[0].color,n=o[o.length-1].color,l=r.find((t=>t.arc.gradientOffset))?.arc.gradientOffset??"0%",h=Ci(s,i),c=e.pointAt(e.startAngle,e.radius),u=e.pointAt(e.endAngle,e.radius);return H`
    <defs>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        gradientTransform="rotate(0)"
        id="${h}"
        x1="${c.x}"
        y1="${c.y}"
        x2="${u.x}"
        y2="${u.y}"
      >
        <stop id="${h}-color1" offset="${l}" stop-color="${n}" style="transition: stop-color 1s ease;"></stop>
        <stop offset="100%" stop-color="${a}" style="transition: stop-color 1s ease;"></stop>
      </linearGradient>
    </defs>
  `}(t,e,r,s,i)}
      ${r.map((e=>{const r=!1===e.arc.active?a:o,l="lineargradient"===t.show?.horseshoe_style&&!1!==e.arc.active?`url('#${n}')`:e.arc.color??r.fill??t.horseshoe_state.color??"none",h={...r,fill:l};e.path||(h.opacity="0");const c=ki(s,i,e.key);return H`
          <path
            id="${c}"
            data-horseshoe-state-path="${c}"
            class="horseshoe__state"
            d="${e.path}"
            style=${pt(h)}
          ></path>
        `}))}
    </g>
  `}function Mi(t,e,r={}){if(!e.length)return H``;const{layerClass:s,itemClass:i,styles:o={}}=r,{filter:a,...n}=o;return H`
    <g class=${s} style=${pt(a?{filter:a}:{})}>
      ${e.map((t=>{const e={"stroke-width":0,...n,fill:t.color??n.fill??n.stroke??"currentColor"};return t.path?H`
              <path
                class=${i}
                d=${t.path}
                style=${pt(e)}
              ></path>
            `:H``}))}
    </g>
  `}function Ei(t,e,r,s,i,o){const a={...t.horseshoe_state.styles},n={...t.horseshoe_scale.styles},l=Ci(i,o),h=s.renderRoot?.querySelector(`#${l}-color1`);if("lineargradient"===t.show?.horseshoe_style&&h){const t=e.find((t=>t.arc.gradientOffset))?.arc.gradientOffset;t&&h.setAttribute("offset",t)}e.forEach((e=>{const h=function(t,e,r,s,i){if(!i?.key)return;if(t.has(i.key)){const e=t.get(i.key);if(e?.isConnected)return e;t.delete(i.key)}const o=e?.renderRoot??e?.shadowRoot;if(!o)return;const a=ki(r,s,i.key),n=o.getElementById?.(a)??o.querySelector?.(`[data-horseshoe-state-path="${a}"]`);return n&&t.set(i.key,n),n}(r,s,i,o,e);if(!h)return;const c=!1===e.arc.active?n:a,u="lineargradient"===t.show?.horseshoe_style&&!1!==e.arc.active?`url('#${l}')`:e.arc.color??c.fill??t.horseshoe_state.color??"none",d={...c,fill:u};e.path||(d.opacity="0"),h.setAttribute("d",e.path||""),h.setAttribute("style",Object.entries(d).map((([t,e])=>`${t}: ${e}`)).join("; "))}))}const Ni=t=>Array.isArray(t)?t:[];class Ti{static buildBandPath(t={}){const{geometry:e,arc:r={},band:s={}}=t;if(!e||!1===r.visible)return"";const i={startAngle:0,endAngle:0,startCap:"butt",endCap:"butt",...r},o={radius:e.radius,width:1,...s},a=Number(i.startAngle),n=Number(i.endAngle),l=Number(o.radius),h=Number(o.width);if(!(Number.isFinite(a)&&Number.isFinite(n)&&Number.isFinite(l)&&Number.isFinite(h)))return"";if(n===a||h<=0)return"";const c=l-h/2,u=l+h/2;if(c<=0||u<=0)return"";const d=e.pointAt(a,u),p=e.pointAt(n,u),m=e.pointAt(n,c),g=e.pointAt(a,c),f=Math.abs(n-a)>180?1:0,y=n>a?1:0,v=y?0:1,b=h/2,_=[];return _.push(`M ${d.x} ${d.y}`),_.push(`A ${u} ${u} 0 ${f} ${y} ${p.x} ${p.y}`),"round"===i.endCap?_.push(`A ${b} ${b} 0 0 ${y} ${m.x} ${m.y}`):_.push(`L ${m.x} ${m.y}`),_.push(`A ${c} ${c} 0 ${f} ${v} ${g.x} ${g.y}`),"round"===i.startCap?_.push(`A ${b} ${b} 0 0 ${y} ${d.x} ${d.y}`):_.push(`L ${d.x} ${d.y}`),_.push("Z"),_.join(" ")}}function zi(t,e){const r=t.show?.scale_style??"fixed";return"none"===r?[]:"colorstop"===r?function(t,e){const r=Ni(t.colorStops?.colors),s=Number(t.colorStops?.gap??0),i=[];if(!r.length)return[{key:"scale",startAngle:e.startAngle,endAngle:e.endAngle,startCap:t.horseshoe_scale.linecap.start,endCap:t.horseshoe_scale.linecap.end,color:t.horseshoe_scale.color}];const o=[{value:Number(t.horseshoe_scale.min),color:r[0].color},...r.map((t=>({value:Number(t.value),color:t.color}))),{value:Number(t.horseshoe_scale.max),color:r[r.length-1].color}];for(let n=0;n<o.length-1;n+=1){const t=o[n],r=o[n+1],a=e.valueToAngle(t.value),l=e.valueToAngle(r.value),h=0===n?a:a+s/2,c=n===o.length-2?l:l-s/2,u=c>h;i.push({key:`scale-colorstop-${n}`,startAngle:u?h:0,endAngle:u?c:0,startCap:"butt",endCap:"butt",color:t.color,value:t.value,visible:u})}const a=i.filter((t=>!1!==t.visible));return a.length&&(a[0].startCap=t.horseshoe_scale.linecap.start,a[a.length-1].endCap=t.horseshoe_scale.linecap.end),i}(t,e):[{key:"scale",startAngle:e.startAngle,endAngle:e.endAngle,startCap:t.horseshoe_scale.linecap.start,endCap:t.horseshoe_scale.linecap.end,color:t.horseshoe_scale.color}]}function Ii(t,e,r={}){const{mode:s="none",config:i={},radius:o=e.radius,width:a=6,gap:n=0,keyPrefix:l="background"}=r;if("none"===s)return[];if("colorstop"===s){const r=Ni(t.colorStops?.colors);if(!r.length)return[];const s=[],h=Number(t.horseshoe_scale.min),c=Number(t.horseshoe_scale.max),u=r.map((t=>({value:Number(t.value),color:t.color}))),d=[...u[0]?.value===h?[]:[{value:h,color:r[0].color}],...u,...u[u.length-1]?.value===c?[]:[{value:c,color:r[r.length-1].color}]];for(let t=0;t<d.length-1;t+=1){const r=d[t],h=d[t+1],c=e.valueToAngle(r.value),u=e.valueToAngle(h.value),p=0===t,m=t===d.length-2,g=p?c:c+n/2,f=m?u:u-n/2;if(f>g){const n=i.linecap??"round",h={key:`${l}-colorstop-${t}`,startAngle:g,endAngle:f,startCap:p?n:"butt",endCap:m?n:"butt"};s.push({key:h.key,arc:h,path:Ti.buildBandPath({geometry:e,arc:h,band:{radius:o,width:a}}),startAngle:g,endAngle:f,radius:o,width:a,color:r.color,lineCap:n})}}return s}if("fixed"===s){const t=i.linecap??"round",r={key:`${l}-fixed`,startAngle:e.startAngle,endAngle:e.endAngle,startCap:t,endCap:t};return[{key:r.key,arc:r,path:Ti.buildBandPath({geometry:e,arc:r,band:{radius:o,width:a}}),startAngle:e.startAngle,endAngle:e.endAngle,radius:o,width:a,color:i.color,lineCap:t}]}return[]}function Pi(t,e,r,s){const i=t.show?.horseshoe_style,o=Number(s.fromAngle??e.startAngle),a=Number(s.toAngle??e.startAngle);return"colorstopsegments"===i?function(t,e,r,s){const i=Ni(t.colorStops?.colors),o=Number(t.colorStops?.gap??0),a=[];if(i.length<2)return[{key:"state-value",startAngle:r,endAngle:s,startCap:t.horseshoe_state.linecap.start,endCap:t.horseshoe_state.linecap.end}];for(let l=0;l<i.length-1;l+=1){const t=i[l],n=i[l+1],h=e.valueToAngle(t.value),c=e.valueToAngle(n.value),u=Math.max(h,r)+o/2,d=Math.min(c,s)-o/2,p=d>u;a.push({key:`colorstop-${l}`,startAngle:p?u:0,endAngle:p?d:0,startCap:"butt",endCap:"butt",color:t.color,value:t.value,label:t.label,visible:p})}const n=a.filter((t=>!1!==t.visible));return n.length&&(n[0].startCap=t.horseshoe_state.linecap.start,n[n.length-1].endCap=t.horseshoe_state.linecap.end),a}(t,e,o,a):"autominmax"===i?[{key:"state-value",startAngle:o,endAngle:a,startCap:t.horseshoe_state.linecap.start,endCap:t.horseshoe_state.linecap.end,color:ci.calculateStrokeColor(r,t.colorStopsMinMax,!0)}]:"lineargradient"===i?[{key:"state-value",startAngle:o,endAngle:a,startCap:t.horseshoe_state.linecap.start,endCap:t.horseshoe_state.linecap.end,gradientOffset:"0%"}]:"colorstop"===i||"colorstopgradient"===i?[{key:"state-value",startAngle:o,endAngle:a,startCap:t.horseshoe_state.linecap.start,endCap:t.horseshoe_state.linecap.end,color:ci.calculateStrokeColor(r,t.colorStops,"colorstopgradient"===i)}]:[{key:"state-value",startAngle:o,endAngle:a,startCap:t.horseshoe_state.linecap.start,endCap:t.horseshoe_state.linecap.end}]}function Oi(t,e,r){return"segment"===t.horseshoe_state.mode?function(t,e,r){const s=t.state_map.map,i=t.horseshoe_state.segment_gap,o=s.length;if(!o)return[];const a=e.arcDegrees/o;return s.map(((s,n)=>{const l=Number(s.value)===Number(r);return{key:`mapped-state-${n}`,startAngle:e.startAngle+n*a+i/2,endAngle:e.startAngle+(n+1)*a-i/2,startCap:0===n?t.horseshoe_state.linecap.start:"butt",endCap:n===o-1?t.horseshoe_state.linecap.end:"butt",active:l,value:s.value,label:s.label??String(s.state)}}))}(t,e,r):"bidirectional"===t.bar_mode||"bidirectional_symmetrical"===t.bar_mode||"bidirectional_linear"===t.bar_mode?function(t,e,r){const s=e.valueToAngle(r),i=e.zeroAngle;return Pi(t,e,r,{fromAngle:Math.min(i,s),toAngle:Math.max(i,s)})}(t,e,r):function(t,e,r){return Pi(t,e,r,{fromAngle:e.startAngle,toAngle:e.valueToAngle(r)})}(t,e,r)}function ji(t,e,r){const s=Oi(t,e,r),i={radius:e.radius,width:t.horseshoe_state.width};return s.map(((t,r)=>({key:t.key??`state-arc-${r}`,arc:t,path:Ti.buildBandPath({geometry:e,arc:t,band:i})})))}function Ri(t,e,r){const s=[];for(let i=t;i<=e+1e-9;i+=r)s.push(Number(i.toFixed(10)));return s}function Di(t,e){return function(t){const e=t.show.labels_at??"none",r=Number(t.horseshoe_scale.min),s=Number(t.horseshoe_scale.max),i=Ni(t.colorStops?.colors);let o=[];if("minmax"===e&&(o=[{value:r,text:String(r),role:"min"},{value:s,text:String(s),role:"max"}]),"minmax0"===e&&(o=[{value:r,text:String(r),role:"min"},{value:0,text:"0",role:"zero"},{value:s,text:String(s),role:"max"}]),"colorstop"!==e&&"colorstops"!==e||(o=[{value:r,text:String(r),role:"min"},...i.map((t=>({value:t.value,text:t.label??String(t.value),role:"colorstop",color:t.color}))),{value:s,text:String(s),role:"max"}]),"ticks_major"===e){const e=Number(t.horseshoe_tickmarks?.ticks_major?.ticksize);Number.isFinite(e)&&e>0&&(o=Ri(r,s,e).map(((t,e,r)=>({value:t,text:String(t),role:0===e?"min":e===r.length-1?"max":"tick-major"}))))}if("both"===e){const e=i.length?[{value:r,text:String(r),role:"min"},...i.map((t=>({value:t.value,text:t.label??String(t.value),role:"colorstop",color:t.color}))),{value:s,text:String(s),role:"max"}]:[],a=Number(t.horseshoe_tickmarks?.ticks_major?.ticksize);o=[...e,...Number.isFinite(a)&&a>0?Ri(r,s,a).map((t=>({value:t,text:String(t),role:"tick-major"}))):[]]}const a=o.filter((t=>{const e=Number(t.value);return Number.isFinite(e)&&e>=r&&e<=s})).sort(((t,e)=>Number(t.value)-Number(e.value))).filter(((t,e,r)=>{const s=Number(t.value);return r.findIndex((t=>Number(t.value)===s))===e})),n=Number(t.horseshoe_labels.distance_min??0),l=[];return a.forEach((t=>{const e=Number(t.value);if(n<=0)return void l.push(t);const r=l[l.length-1];(!r||Math.abs(e-Number(r.value))>=n)&&l.push(t)})),l.length&&(l[0].role="min",l[l.length-1].role="max"),l}(t).map((r=>function(t,e,r={}){const s=Number(r.value),i=e.valueToAngle(s),o=e.radius+Number(t.horseshoe_labels.offset??t.horseshoe_state.width+2),a=e.pointAt(i,o);return{...r,value:s,text:r.text??String(s),role:r.role??"label",angle:i,radius:o,x:a.x,y:a.y}}(t,e,r)))}const Vi={enabled:!0,duration:2500,easing:"ease-out",debug:!1};function Gi(t){return"string"==typeof t?{start:t,end:t}:t&&"object"==typeof t?{start:t.start??"butt",end:t.end??"butt"}:{start:"butt",end:"butt"}}function Li(t){const e=Number(t.min),r=Number(t.max);return e>=0||r<=0?0:Bs((0-e)/(r-e),0,1)}function Ui(t,e,r,s,i){const o={entity_index:r},a=function(t){const e={horseshoe:!0,horseshoe_style:"fixed",labels_at:"none",...t.show??{}};if(!t.horseshoe_scale)throw new Error("[V2] Missing horseshoe_scale");const r={min:0,max:100,width:6,color:"var(--primary-background-color)",linecap:"round",type:"linear",...t.horseshoe_scale??{}};if(void 0===r.min)throw new Error("[V2] Missing horseshoe_scale.min");if(void 0===r.max)throw new Error("[V2] Missing horseshoe_scale.max");if(!r.type)throw new Error("[V2] Missing horseshoe_scale.type");if(("splineorg"===r.type||"spline"===r.type)&&!r.spline)throw new Error("[V2] Missing horseshoe_scale.spline");const s={width:12,color:"var(--primary-color)",linecap:"round",mode:"value",segment_gap:2,animation:Vi,...t.horseshoe_state??{}},i={...t.horseshoe_background??{}},o={offset:12,...t.horseshoe_labels??{}},a={...t.horseshoe_tickmarks??{}},n=t.state_map??s.state_map,l=t.color_stops??t.colorstops,h=ft.ensureMinimumStops(ft.normalize(l),r.max),c=h.colors[0],u=h.colors[h.colors.length-1],d=ft.normalize({[r.min]:c.color,[r.max]:u.color}),p=t.radius??45,m=t.tickmarks_radius??43,g=t.arc_degrees??260,f=t.bar_mode??"normal",y="bidirectional"===f||"bidirectional_symmetrical"===f,v=t.group_config,b=t.xpos??t.horseshoe_position?.xpos??t.horseshoe_position?.cx??50,_=t.yposc||(t.ypos??t.horseshoe_position?.ypos??t.horseshoe_position?.cy??50),x=v?v.xpos+b-50:b,w=v?v.ypos+_-50:_,$=v?{xpos:v.xpos/100*di,ypos:v.ypos/100*di}:void 0;return{...t,show:e,group_config:v?{...v,svg:$}:v,xpos:x,ypos:w,radius:p,tickmarks_radius:m,arc_degrees:g,svg:{xpos:x/100*di,ypos:w/100*di,radius:p/100*di,tickmarks_radius:m/100*di},start_angle:t.start_angle??90+(360-g)/2,bar_mode:f,zero_ratio:t.zero_ratio??(y?.5:Li(r)),state_map:n,color_stops:l,colorstops:l,colorStops:h,colorStopsMinMax:d,horseshoe_background:{...i,styles:{...mt.toStyleDict(i.styles)}},horseshoe_scale:{...r,linecap:Gi(r.linecap),styles:{fill:r.color,...mt.toStyleDict(r.styles)}},horseshoe_state:{...s,animation:{...Vi,...s.animation??{}},linecap:Gi(s.linecap),styles:{fill:s.color,...mt.toStyleDict(s.styles)}},horseshoe_labels:{...o,background:{...o.background??{},styles:{...mt.toStyleDict(o.background?.styles)}},badges:{...o.badges??{},styles:{...mt.toStyleDict(o.badges?.styles)}},styles:{fill:"var(--primary-text-color)","font-size":"6px",...mt.toStyleDict(o.styles)}},horseshoe_tickmarks:{...a,background:{...a.background??{},styles:{...mt.toStyleDict(a.background?.styles)}},ticks_major:a.ticks_major?{...a.ticks_major,styles:{...mt.toStyleDict(a.ticks_major?.styles)}}:a.ticks_major,ticks_minor:a.ticks_minor?{...a.ticks_minor,styles:{...mt.toStyleDict(a.ticks_minor?.styles)}}:a.ticks_minor}}}(e.getJsTemplateOrValue(o,t,{resolveKeys:!0}));let n=s.state;i?.attribute&&void 0!==s.attributes?.[i.attribute]&&(n=s.attributes[i.attribute]);const l=a.state_map?function(t,e,r){return t.find((t=>void 0!==t.state?String(t.state)===String(e):void 0!==t.value&&String(t.value)===String(r)))}(a.state_map.map,s.state,n):void 0,h=Number(l?.value??n);return{runtimeConfig:a,rawState:s.state,mappedState:l,value:h}}function Hi(t,e,r){const s=[];for(let i=t;i<=e+1e-9;i+=r)s.push(Number(i.toFixed(10)));return s}function qi(t){return t?.show?.tickmarks??t?.show?.ticks}function Bi(t,e,r,s,i,o){if(!r||!s.length)return[];const a=mt.toStyleDict(r.styles),n={...a,"stroke-width":a["stroke-width"]??0},l=e.radius+Number(r.offset??0),h=Number(r.width);if(!Number.isFinite(h)||h<=0)throw new Error(`[horseshoe-tickmarks] Missing or invalid ${i} tick width`);const c=Number(r.thickness);return s.map(((s,u)=>{const d=e.valueToAngle(s),p="minor"===i&&o?.has(s)?Math.min(c,o.get(s)):c;"minor"===i&&(t.debug_ticks||t.dev?.debug_ticks)&&console.log("[horseshoe-tickmarks] minor thickness",{value:s,configuredThickness:c,maxThickness:o?.get(s),finalThickness:p,limited:o?.has(s)&&p!==c});const m=function(t,e,r,s){const i=t?.color_mode;return"colorstop"===i?ci.calculateStrokeColor(r,s.colorStops,!1):"colorstopgradient"===i?ci.calculateStrokeColor(r,s.colorStops,!0):t?.color??e.fill}(r,a,s,t),g={...n,fill:m??a.fill};if(void 0===m&&t.dev?.debug_colors&&console.log("[horseshoe-tickmarks] unresolved tick fill",{layerName:i,value:s,colorMode:r.color_mode,colorStops:t.colorStops}),"circle"===r.shape){const t=e.pointAt(d,l);return{key:`${i}-${u}`,shape:"circle",x:t.x,y:t.y,radius:Number(r.radius??h/2),value:s,thickness:p,startAngle:d,endAngle:d,styles:g,className:"major"===i?"horseshoe__tick-major":"horseshoe__tick-minor"}}const f=h,y=function(t,e){return Number(t)/(2*Math.PI*e)*360}(p,l),v=d-y/2,b=d+y/2,_=function(t,e,r){return Ti.buildBandPath({geometry:t,arc:e,band:r})}(e,{key:`${i}-${u}`,startAngle:v,endAngle:b,startCap:"butt",endCap:"butt"},{radius:l,width:f});return{key:`${i}-${u}`,path:_,value:s,thickness:p,startAngle:v,endAngle:b,styles:g,className:"major"===i?"horseshoe__tick-major":"horseshoe__tick-minor"}})).filter((t=>t.path||"circle"===t.shape))}function Fi(t,e){if(!qi(t))return[];const r=t.horseshoe_tickmarks;if(!r?.ticks_major&&!r?.ticks_minor)return[];const s=Number(t.horseshoe_scale.min),i=Number(t.horseshoe_scale.max),o=r.ticks_major,a=r.ticks_minor,n=Number(o?.ticksize),l=Number(a?.ticksize),h=Number.isFinite(n)&&n>0?Hi(s,i,n):[],c=Number.isFinite(l)&&l>0?Hi(s,i,l).filter((t=>!(Number.isFinite(n)&&n>0)||!function(t,e,r){const s=(t-e)/r;return Math.abs(s-Math.round(s))<1e-9}(t,s,n))):[],u=new Map;if(("splineorg"===t.horseshoe_scale.type||"spline"===t.horseshoe_scale.type)&&h.length>1&&c.length){const r=e.radius+Number(a.offset??0),s=Number(o.thickness),i=h.slice(0,-1).map(((t,r)=>Math.abs(e.valueToAngle(h[r+1])-e.valueToAngle(t)))),n=i[1]??i[0];for(let o=0;o<h.length-1;o+=1){const i=h[o],p=h[o+1],m=c.filter((t=>t>i&&t<p));if(m.length){const o=Math.abs(e.valueToAngle(p)-e.valueToAngle(i)),h=(d=r,Number(o)/360*(2*Math.PI*d)),c=Math.max(0,h-s),g=Math.abs(p-i)/l,f=Math.min(1,o/n),y=Math.min(c/g,Number(a.thickness)*f);(t.debug_ticks||t.dev?.debug_ticks)&&console.log("[horseshoe-tickmarks] spline minor interval",{scaleType:t.horseshoe_scale.type,majorStartValue:i,majorEndValue:p,minorValues:m,majorGapDegrees:o,referenceMajorGapDegrees:n,intervalRatio:f,minorRadius:r,majorGapArcLength:h,majorThickness:s,availableMinorArcLength:c,minorTickSize:l,minorSlotsBetweenMajorTicks:g,configuredMinorThickness:Number(a.thickness),maxMinorThickness:y}),m.forEach((t=>{u.set(t,y)}))}}}var d;return[...Bi(t,e,a,c,"minor",u),...Bi(t,e,o,h,"major")]}class Wi{static setConfig(t,e,r,s){const i=Wi.getLegacyRootConfig(t);return[...i?[i]:[],...[...Array.isArray(t.layout?.horseshoes_v2)?t.layout.horseshoes_v2:[],...Array.isArray(t.layout?.horseshoes)?t.layout.horseshoes:[]]].filter(Boolean).map(((t,e)=>Wi.applyLegacyTickmarkCompat(t))).map(((i,o)=>new Wi(function(t,e,r){const s=t.entity_index??0,i=t.group?r?.[t.group]:void 0;return{entity_index:s,...t,group_config:i,index:e,show:{horseshoe:!0,horseshoe_style:"fixed",labels_at:"none",...t.show??{}}}}(i,o,t.layout?.groups),o,e,r,s))).filter((t=>!1!==t.show?.horseshoe))}static getLegacyRootConfig(t){const e=["entity_index","show","horseshoe_position","horseshoe_scale","horseshoe_state","horseshoe_background","horseshoe_labels","horseshoe_tickmarks","color_stops","colorstops","styles","bar_mode","radius","tickmarks_radius","arc_degrees","start_angle","rotate","flip","xpos","ypos","yposc"];if(!e.filter((t=>"show"!==t&&"styles"!==t&&"entity_index"!==t)).some((e=>void 0!==t[e])))return;const r={};return e.forEach((e=>{void 0!==t[e]&&(r[e]=t[e])})),Object.keys(r).length?r:void 0}static applyLegacyTickmarkCompat(t){if(!0!==t.show?.scale_tickmarks)return t;const e=t.horseshoe_tickmarks??{};if(e.ticks_major||e.ticks_minor)return{...t,show:{...t.show,tickmarks:t.show.tickmarks??t.show.ticks??!0}};const r=t.horseshoe_scale??{},s=Number(r.min??0),i=Number(r.max??100)-s,o=r.ticksize??(i?i/10:void 0),a=Number(t.radius??45),n=Number(t.tickmarks_radius??43),l=Number(r.width??6);return{...t,show:{...t.show,tickmarks:!0},horseshoe_tickmarks:{...e,ticks_major:{ticksize:o,shape:"circle",radius:l/2,width:l,thickness:l,offset:n-a,styles:[...Array.isArray(e.styles)?e.styles:e.styles?[e.styles]:[],{fill:r.color??"var(--primary-background-color)"}]}}}}constructor(t,e,r,s,i){this.config=t,this.index=e,this.templates=r,this.cardId=s,this.card=i,this.entity_index=t.entity_index??0,this.defaultZpos=pi.horseshoes_v2,this.config.zpos??=this.defaultZpos,this.zpos=this.config.zpos,this.renderIndex=mi.horseshoes_v2+e,this.show=t.show,this.entity=void 0,this.entityConfig=void 0,this.rawState=void 0,this.value=void 0,this.displayValue=void 0,this.mappedState=void 0,this.runtimeConfig=void 0,this.scale=void 0,this.geometry=void 0,this.valueAnimator={frame:void 0,startTime:void 0,fromValue:void 0,toValue:void 0,animating:!1},this.statePathElements=new Map,this.pathItemCache=new Map,this.pathItemCacheKey=void 0}setState(t,e){this.entity=t,this.entityConfig=e;const r=Ui(this.config,this.templates,this.entity_index,t,e),s=r.value,i=Number.isFinite(this.displayValue)?this.displayValue:s;this.runtimeConfig=r.runtimeConfig,this.zpos=this.runtimeConfig.zpos??this.defaultZpos,this.rawState=r.rawState,this.mappedState=r.mappedState,this.value=s,this.scale=new wi(this.runtimeConfig.horseshoe_scale),this.geometry=new $i(this.runtimeConfig,this.scale),this.refreshPathItemCacheKey(),Number.isFinite(this.displayValue)?this.displayValue!==this.value&&this.startValueAnimation({fromValue:i,toValue:this.value}):this.displayValue=this.value}render(){if(!(Number.isFinite(this.value)&&this.runtimeConfig&&this.scale&&this.geometry))return H``;if(this.card?.config?.palettes&&!this.card.palettesLoaded)return H``;const t=this.geometry.getGroupTransform();return H`
      <g
        id="horseshoe-${this.index}"
        class="horseshoe"
        transform="${t}"
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
    `}getPathItemCacheKey(){return JSON.stringify({show:this.runtimeConfig.show,svg:this.runtimeConfig.svg,arc_degrees:this.runtimeConfig.arc_degrees,start_angle:this.runtimeConfig.start_angle,rotate:this.runtimeConfig.rotate,flip:this.runtimeConfig.flip,group_config:this.runtimeConfig.group_config,bar_mode:this.runtimeConfig.bar_mode,zero_ratio:this.runtimeConfig.zero_ratio,colorStops:this.runtimeConfig.colorStops,colorStopsMinMax:this.runtimeConfig.colorStopsMinMax,horseshoe_background:this.runtimeConfig.horseshoe_background,horseshoe_scale:this.runtimeConfig.horseshoe_scale,horseshoe_state:{width:this.runtimeConfig.horseshoe_state.width,linecap:this.runtimeConfig.horseshoe_state.linecap,mode:this.runtimeConfig.horseshoe_state.mode,segment_gap:this.runtimeConfig.horseshoe_state.segment_gap,color:this.runtimeConfig.horseshoe_state.color,styles:this.runtimeConfig.horseshoe_state.styles},state_map:this.runtimeConfig.state_map,horseshoe_labels:this.runtimeConfig.horseshoe_labels,horseshoe_tickmarks:this.runtimeConfig.horseshoe_tickmarks})}refreshPathItemCacheKey(){const t=this.getPathItemCacheKey();t!==this.pathItemCacheKey&&(this.pathItemCache.clear(),this.pathItemCacheKey=t)}clearPathItemCache(){this.pathItemCache.clear(),this.pathItemCacheKey=void 0}getCachedPathItems(t,e){if(!this.pathItemCache.has(t)){ci.unresolvedColor=!1;const r=e();if(ci.unresolvedColor)return r;this.pathItemCache.set(t,r)}return this.pathItemCache.get(t)}renderHorseshoeBackground(){const t=this.getCachedPathItems("horseshoeBackgroundItems",(()=>function(t,e){const r=t.show.horseshoe_background??"none",s=t.horseshoe_background??{};return Ii(t,e,{mode:r,config:s,radius:e.radius+Number(s.offset??0),width:Number(s.width??t.horseshoe_scale.width??t.horseshoe_state.width??6),gap:Number(s.gap??t.colorStops?.gap??0),keyPrefix:"horseshoe-background"})}(this.runtimeConfig,this.geometry)));return function(t,e,r){return Mi(0,r,{layerClass:"horseshoe__background-layer",itemClass:"horseshoe__background",styles:t.horseshoe_background.styles})}(this.runtimeConfig,this.geometry,t)}renderScale(){const t=this.getCachedPathItems("scalePathItems",(()=>function(t,e){const r=zi(t,e),s={radius:e.radius,width:t.horseshoe_scale.width};return r.map(((t,r)=>({key:t.key??`scale-arc-${r}`,arc:t,path:Ti.buildBandPath({geometry:e,arc:t,band:s})})))}(this.runtimeConfig,this.geometry)));return function(t,e,r){const s={...t.horseshoe_scale.styles};return H`
    <g class="horseshoe__scale-layer" style=${pt(s)}>
      ${r.map((e=>{const r=e.arc.color??t.horseshoe_scale.color??s.fill??"none";return e.path?H`
              <path
                class="horseshoe__scale"
                d=${e.path}
                fill="${r}"
              ></path>
            `:H``}))}
    </g>
  `}(this.runtimeConfig,this.geometry,t)}renderState(){const t=ji(this.runtimeConfig,this.geometry,this.displayValue??this.value);return Ai(this.runtimeConfig,this.geometry,t,this.cardId,this.index)}renderTickmarks(){return function(t){return t.length?H`
    <g class="horseshoe__ticks-layer">
      ${t.map((t=>"circle"===t.shape?H`
            <circle
              class="${t.className}"
              cx="${t.x}"
              cy="${t.y}"
              r="${t.radius}"
              data-value="${t.value??""}"
              data-thickness="${t.thickness??""}"
              data-start-angle="${t.startAngle??""}"
              data-end-angle="${t.endAngle??""}"
              style=${pt(t.styles??{})}
            ></circle>
          `:H`
            <path
              class="${t.className}"
              d="${t.path}"
              data-value="${t.value??""}"
              data-thickness="${t.thickness??""}"
              data-start-angle="${t.startAngle??""}"
              data-end-angle="${t.endAngle??""}"
              style=${pt(t.styles??{})}
            ></path>
          `))}
    </g>
  `:H``}(this.getCachedPathItems("tickPathItems",(()=>Fi(this.runtimeConfig,this.geometry))))}renderTickmarkBackground(){const t=this.getCachedPathItems("tickmarkBackgroundItems",(()=>function(t,e){if(!qi(t))return[];const r=t.show.tick_background??"none",s=t.horseshoe_tickmarks??{},i=s.background??{},o=s.ticks_major??{},a=s.ticks_minor??{};return Ii(t,e,{mode:r,config:i,radius:e.radius+Number(i.offset??o.offset??a.offset??0),width:Number(i.width??o.width??a.width??4),gap:Number(i.gap??0),keyPrefix:"tick-background"})}(this.runtimeConfig,this.geometry)));return function(t,e,r){return Mi(0,r,{layerClass:"horseshoe__tick-background-layer",itemClass:"horseshoe__tick-background",styles:t.horseshoe_tickmarks.background.styles})}(this.runtimeConfig,this.geometry,t)}renderLabels(){const t=this.getCachedPathItems("labelItems",(()=>Di(this.runtimeConfig,this.geometry)));return function(t,e,r,s,i){const o={...t.horseshoe_labels.styles};return H`
    <g class="horseshoe__labels-layer" style=${pt(o)}>
      ${i.map(((i,o)=>Si.renderLabel({horseshoeIndex:s,index:o,label:i.text,angle:i.angle,cx:e.cx,cy:e.cy,radius:i.radius,cardId:r,orientation:t.horseshoe_labels.orientation??"arc",isMin:"min"===i.role,isMax:"max"===i.role,transformContext:e.getTransformContext(),inverseTransform:e.getInverseGroupTransform()})))}
    </g>
  `}(this.runtimeConfig,this.geometry,this.cardId,this.index,t)}renderLabelBackground(){const t=this.getCachedPathItems("labelBackgroundItems",(()=>function(t,e){const r=t.show.label_background??"none",s=t.horseshoe_labels.background??{};return Ii(t,e,{mode:r,config:s,radius:e.radius+Number(t.horseshoe_labels.offset??t.horseshoe_state.width+2),width:Number(s.width??6),gap:Number(s.gap??0),keyPrefix:"label-background"})}(this.runtimeConfig,this.geometry)));return function(t,e,r){return Mi(0,r,{layerClass:"horseshoe__label-background-layer",itemClass:"horseshoe__label-background",styles:t.horseshoe_labels.background.styles})}(this.runtimeConfig,this.geometry,t)}renderLabelBadges(){const t=this.getCachedPathItems("labelItems",(()=>Di(this.runtimeConfig,this.geometry)));return function(t,e,r,s,i){if(!i.length||!t.show.label_badges)return H``;const o={...t.horseshoe_labels.badges.styles};return H`
    <g class="horseshoe__label-badges-layer" style=${pt(o)}>
      ${i.map(((i,o)=>Si.renderLabelBadge({horseshoeIndex:s,index:o,label:i.text,angle:i.angle,cx:e.cx,cy:e.cy,radius:i.radius,cardId:r,orientation:t.horseshoe_labels.orientation??"arc",badge:t.horseshoe_labels.badges??{}})))}
    </g>
  `}(this.runtimeConfig,this.geometry,this.cardId,this.index,t)}getStateAnimationConfig(){return t=this.runtimeConfig,{...yi,...t?.horseshoe_state?.animation??{}};var t}startValueAnimation(t={}){const e=this.getStateAnimationConfig();vi(this.valueAnimator,e,t,{onUpdate:t=>{this.displayValue=t,this.updateStatePathDom({value:this.displayValue})},onComplete:t=>{this.displayValue=t,this.updateStatePathDom({value:this.displayValue})}})}updateStatePathDom(t={}){if(!this.runtimeConfig||!this.geometry||!this.scale)return;const e=Number(t.value??this.displayValue??this.value),r=ji(this.runtimeConfig,this.geometry,e);Ei(this.runtimeConfig,r,this.statePathElements,this.card,this.cardId,this.index)}}class Ki{constructor(t,e,r,s,i,o,a=o,n=0){this.config=t,this.index=e,this.templates=r,this.cardId=s,this.card=i,this.animationSection=o,this.zposSection=a,this.defaultZpos=pi[a]??0,this.config.zpos??=this.defaultZpos,this.zpos=this.config.zpos,this.renderIndex=(mi[a]??0)+e,this.entity_index=t.entity_index??n,this.entity=void 0,this.entityConfig=void 0,this.runtimeConfig=t}setState(t,e){this.entity=t,this.entityConfig=e,this.runtimeConfig=gt.getJsTemplateOrValue(this.config,this.config,{resolveKeys:!0}),this.zpos=this.runtimeConfig.zpos??this.defaultZpos}getStyles(t){return{...t,...mt.toStyleDict(this.runtimeConfig.styles),...mt.toStyleDict(this.card.animations?.[this.animationSection]?.[this.runtimeConfig.animation_id]??{})}}applyColorStops(t,e){const r=this.card._getItemColorFromStops(this.runtimeConfig);r&&(t[e]=r)}textEllipsis(t,e){return e&&e<t.length?t.slice(0,e-1).concat("..."):t}getGroupScaleTransform(){return this.card._getGroupScaleTransform(this.runtimeConfig)}getGroupScaleStyle(){return this.card._getGroupScaleStyle(this.runtimeConfig)}handlePopup(t){if(void 0===this.entity_index||null===this.entity_index)return;const e=this.card.entities[this.entity_index];e&&this.card.handlePopup(t,e)}}class Ji extends Ki{static setConfig(t,e,r,s){return(t.layout?.rectangles??[]).map(((t,i)=>new Ji(t,i,e,r,s)))}constructor(t,e,r,s,i){super({radius:0,...t},e,r,s,i,"rectangles","rectangles",void 0),this.config.svg=this.calculateSvgDimensions(),this.runtimeConfig=this.config}setState(t,e){super.setState(t,e),this.runtimeConfig.svg=this.calculateSvgDimensions(this.runtimeConfig)}calculateSvgDimensions(t=this.config){const e=this.card._calculateSvgCoordinatesInGroup(t),r=gi.calculateSvgDimension(t.width),s=gi.calculateSvgDimension(t.height),i="object"==typeof t.radius?t.radius:{all:t.radius},o=Math.min(s,r)/2,a=t=>Math.min(o,Math.max(0,gi.calculateSvgDimension(t)));return e.width=r,e.height=s,e.x=e.xpos-r/2,e.y=e.ypos-s/2,e.radiusTopLeft=a(i.top_left??i.left??i.top??i.all),e.radiusTopRight=a(i.top_right??i.right??i.top??i.all),e.radiusBottomLeft=a(i.bottom_left??i.left??i.bottom??i.all),e.radiusBottomRight=a(i.bottom_right??i.right??i.bottom??i.all),e}buildRoundedRectanglePath(){const t=this.runtimeConfig.svg;return`\n      M ${t.x+t.radiusTopLeft} ${t.y}\n      h ${t.width-t.radiusTopLeft-t.radiusTopRight}\n      q ${t.radiusTopRight} 0 ${t.radiusTopRight} ${t.radiusTopRight}\n      v ${t.height-t.radiusTopRight-t.radiusBottomRight}\n      q 0 ${t.radiusBottomRight} -${t.radiusBottomRight} ${t.radiusBottomRight}\n      h -${t.width-t.radiusBottomRight-t.radiusBottomLeft}\n      q -${t.radiusBottomLeft} 0 -${t.radiusBottomLeft} -${t.radiusBottomLeft}\n      v -${t.height-t.radiusBottomLeft-t.radiusTopLeft}\n      q 0 -${t.radiusTopLeft} ${t.radiusTopLeft} -${t.radiusTopLeft}\n      Z\n    `}render(){const t=this.getStyles({fill:"var(--primary-background-color)",stroke:"none","stroke-width":0});return this.applyColorStops(t,"fill"),H`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <path
          @click=${t=>this.handlePopup(t)}
          class="rectangle-tool"
          d="${this.buildRoundedRectanglePath()}"
          style=${pt(t)}
        ></path>
      </g>
    `}}class Xi extends Ki{static setConfig(t,e,r,s){return[...(t.layout?.lines??[]).map((t=>Xi.normalizeLineConfig(t,"lines"))),...(t.layout?.hlines??[]).map((t=>Xi.normalizeLineConfig(t,"hlines"))),...(t.layout?.vlines??[]).map((t=>Xi.normalizeLineConfig(t,"vlines")))].map(((t,i)=>new Xi(t,i,e,r,s)))}static normalizeLineConfig(t,e){let r=t.orientation??"horizontal";return"hlines"===e&&(r="horizontal"),"vlines"===e&&(r="vertical"),{...t,orientation:r,animation_section:e}}constructor(t,e,r,s,i){const o={orientation:"horizontal",length:10,xpos:50,ypos:50,...t};super(o,e,r,s,i,o.animation_section,o.animation_section,void 0),this.validateOrientation(this.config.orientation),this.config.svg=this.calculateSvgDimensions(),this.runtimeConfig=this.config}setState(t,e){super.setState(t,e),this.validateOrientation(this.runtimeConfig.orientation),this.runtimeConfig.svg=this.calculateSvgDimensions(this.runtimeConfig)}validateOrientation(t){if(!["horizontal","vertical","fromto"].includes(t))throw Error(`LineTool::validateOrientation - invalid orientation '${t}' [horizontal, vertical, fromto]`)}calculateSvgDimensions(t=this.config){if("fromto"===t.orientation){const e=t.start??{xpos:t.x1,ypos:t.y1},r=t.end??{xpos:t.x2,ypos:t.y2},s=this.card._calculateSvgCoordinatesInGroup({...t,xpos:e.xpos??e.x,ypos:e.ypos??e.y}),i=this.card._calculateSvgCoordinatesInGroup({...t,xpos:r.xpos??r.x,ypos:r.ypos??r.y});return{xpos:(s.xpos+i.xpos)/2,ypos:(s.ypos+i.ypos)/2,x1:s.xpos,y1:s.ypos,x2:i.xpos,y2:i.ypos}}const e=this.card._calculateSvgCoordinatesInGroup(t),r=gi.calculateSvgDimension(t.length);return"vertical"===t.orientation?{...e,length:r,x1:e.xpos,y1:e.ypos-r/2,x2:e.xpos,y2:e.ypos+r/2}:{...e,length:r,x1:e.xpos-r/2,y1:e.ypos,x2:e.xpos+r/2,y2:e.ypos}}render(){const t=this.getStyles({"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2"});return this.applyColorStops(t,"stroke"),H`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <line
          @click=${t=>this.handlePopup(t)}
          class="line-tool"
          x1="${this.runtimeConfig.svg.x1}"
          y1="${this.runtimeConfig.svg.y1}"
          x2="${this.runtimeConfig.svg.x2}"
          y2="${this.runtimeConfig.svg.y2}"
          style=${pt(t)}
        ></line>
      </g>
    `}}class Zi extends Ki{static setConfig(t,e,r,s){return(t.layout?.circles??[]).map(((t,i)=>new Zi(t,i,e,r,s)))}constructor(t,e,r,s,i){super({radius:0,...t},e,r,s,i,"circles","circles",void 0),this.config.svg=this.calculateSvgDimensions(),this.runtimeConfig=this.config}setState(t,e){super.setState(t,e),this.runtimeConfig.svg=this.calculateSvgDimensions(this.runtimeConfig)}calculateSvgDimensions(t=this.config){const e=this.card._calculateSvgCoordinatesInGroup(t);return e.radius=void 0!==t.radius_percent?gi.calculateSvgDimension(t.radius_percent):t.radius,e}render(){const t=this.getStyles({});return this.applyColorStops(t,"stroke"),H`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <circle
          @click=${t=>this.handlePopup(t)}
          class="circle-tool"
          cx="${this.runtimeConfig.svg.xpos}"
          cy="${this.runtimeConfig.svg.ypos}"
          r="${this.runtimeConfig.svg.radius}"
          style=${pt(t)}
        ></circle>
      </g>
    `}}class Yi extends Ki{static setConfig(t,e,r,s){return(t.layout?.names??[]).map(((t,i)=>new Yi(t,i,e,r,s)))}constructor(t,e,r,s,i){super(t,e,r,s,i,"names"),this.config.svg=this.calculateSvgDimensions(),this.runtimeConfig=this.config,this.name=""}setState(t,e){super.setState(t,e),this.runtimeConfig.svg=this.calculateSvgDimensions(this.runtimeConfig),this.name=this.textEllipsis(this.buildName(),this.runtimeConfig.max_characters??this.runtimeConfig.ellipsis)}calculateSvgDimensions(t=this.config){return this.card._calculateSvgCoordinatesInGroup(t)}buildName(){return this.entityConfig.name??this.entity.attributes.friendly_name??this.entity?.entity_id??"?"}render(){const t=this.getStyles({"font-size":"1.5em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"});return this.applyColorStops(t,"stroke"),H`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text @click=${t=>this.handlePopup(t)}>
          <tspan
            class="entity__name"
            x="${this.runtimeConfig.svg.xpos}"
            y="${this.runtimeConfig.svg.ypos}"
            style=${pt(t)}>
            ${this.name}</tspan>
        </text>
      </g>
    `}}class Qi extends Ki{static setConfig(t,e,r,s){return(t.layout?.areas??[]).map(((t,i)=>new Qi(t,i,e,r,s)))}constructor(t,e,r,s,i){super(t,e,r,s,i,"areas"),this.config.svg=this.calculateSvgDimensions(),this.runtimeConfig=this.config,this.area=""}setState(t,e){super.setState(t,e),this.runtimeConfig.svg=this.calculateSvgDimensions(this.runtimeConfig),this.area=this.textEllipsis(this.buildArea(),this.runtimeConfig.max_characters??this.runtimeConfig.ellipsis)}calculateSvgDimensions(t=this.config){return this.card._calculateSvgCoordinatesInGroup(t)}buildArea(){if(this.entityConfig.area)return this.entityConfig.area;if(!this.card._hass||!this.card._hass.areas)return"";const t=this.card._hass.entities&&this.card._hass.entities[this.entityConfig.entity];let e=t?t.area_id:null;if(!e&&t&&t.device_id&&this.card._hass.devices){const r=this.card._hass.devices[t.device_id];e=r?r.area_id:null}if(e){const t=this.card._hass.areas[e];return t?t.name:""}return"?"}render(){const t=this.getStyles({"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"});return this.applyColorStops(t,"stroke"),H`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text @click=${t=>this.handlePopup(t)}>
          <tspan
            class="entity__area"
            x="${this.runtimeConfig.svg.xpos}"
            y="${this.runtimeConfig.svg.ypos}"
            style=${pt(t)}>
            ${this.area}</tspan>
        </text>
      </g>
    `}}class to extends Ki{static setConfig(t,e,r,s){return(t.layout?.states??[]).map(((t,i)=>new to(t,i,e,r,s)))}static buildState(t,e,r,s){if(void 0===t)return t;if(null===t)return t;if(e.convert){let i,o,a=e.convert.match(/(^\w+)\((\d+)\)/);switch(null===a?i=e.convert:3===a.length&&(i=a[1],o=Number(a[2])),i){case"brightness_pct":t="undefined"===t?"undefined":`${Math.round(t/255*100)}`;break;case"multiply":t=`${Math.round(t*o)}`;break;case"divide":t=`${Math.round(t/o)}`;break;case"rgb_csv":case"rgb_hex":if(e.attribute){let o=r.states[e.entity];switch(o.attributes.color_mode){case"unknown":case"onoff":case"brightness":case"white":break;case"color_temp":if(o.attributes.color_temp_kelvin){let e=Fs(o.attributes.color_temp_kelvin);const r=Us(e);r[1]<.4&&(r[1]<.1?r[2]=225:r[1]=.4),e=Hs(r),e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===i?`${e[0]},${e[1]},${e[2]}`:Ls(e)}else t="rgb_csv"===i?"255,255,255":"#ffffff00";break;case"hs":{let e=qs([o.attributes.hs_color[0],o.attributes.hs_color[1]/100]);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===i?`${e[0]},${e[1]},${e[2]}`:Ls(e)}break;case"rgb":{const e=Us(s?.attributes?.rgb_color??o.attributes.rgb_color);e[1]<.4&&(e[1]<.1?e[2]=225:e[1]=.4);const r=Hs(e);t="rgb_csv"===i?r.toString():Ls(r)}break;case"rgbw":{let e=(t=>{const[e,r,s,i]=t;return Xs([e,r,s,i],[e+i,r+i,s+i])})(o.attributes.rgbw_color);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===i?`${e[0]},${e[1]},${e[2]}`:Ls(e)}break;case"rgbww":{let e=Ys(o.attributes.rgbww_color,o.attributes?.min_color_temp_kelvin,o.attributes?.max_color_temp_kelvin);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===i?`${e[0]},${e[1]},${e[2]}`:Ls(e)}break;case"xy":if(o.attributes.hs_color){let e=qs([o.attributes.hs_color[0],o.attributes.hs_color[1]/100]);const r=Us(e);r[1]<.4&&(r[1]<.1?r[2]=225:r[1]=.4),e=Hs(r),e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===i?`${e[0]},${e[1]},${e[2]}`:Ls(e)}else if(o.attributes.color){let e={};e.l=o.attributes.brightness,e.h=o.attributes.color.h||o.attributes.color.hue,e.s=o.attributes.color.s||o.attributes.color.saturation;let{r:r,g:s,b:a}=ci.hslToRgb(e);if("rgb_csv"===i)t=`${r},${s},${a}`;else{t=`#${ci.padZero(r.toString(16))}${ci.padZero(s.toString(16))}${ci.padZero(a.toString(16))}`}}else o.attributes.xy_color}}break;default:console.error(`Unknown converter [${i}] specified for entity [${e.entity}]!`)}}return void 0!==t?Number.isNaN(t)?t:t.toString():void 0}constructor(t,e,r,s,i){super(t,e,r,s,i,"states"),this.config.svg=this.calculateSvgDimensions(),this.runtimeConfig=this.config,this.state="",this.uom=""}setState(t,e){super.setState(t,e),this.runtimeConfig.svg=this.calculateSvgDimensions(this.runtimeConfig),this.buildStateAndUom()}calculateSvgDimensions(t=this.config){return this.card._calculateSvgCoordinatesInGroup(t)}formatEntityStateParts(){const t=void 0!==this.entityConfig.attribute,e=this.entityConfig.format||{};let r=t?this.entity.attributes[this.entityConfig.attribute]:this.entity.state;if(!0===e.raw_state_keep)return!0===e.raw_state_clean&&"string"==typeof r&&(r=r.replace(/_/g," ")),[{type:"value",value:r}];const s=t?this.card._hass.formatEntityAttributeValueToParts(this.entity,this.entityConfig.attribute):this.card._hass.formatEntityStateToParts(this.entity,to.buildState(this.entity.state,this.entityConfig,this.card._hass,this.entity));let i;if(!Number.isNaN(Number(r))&&null!==r&&""!==r){const t=e.locale||this.card._hass.locale?.language||this.card._hass.language||"en-US",a=s.find((t=>"value"===t.type));let n;if(a&&void 0!==a.value&&null!==a.value){const t=String(a.value),e=Math.max(t.lastIndexOf("."),t.lastIndexOf(","));n=-1!==e?t.length-e-1:0}const l=e.decimals_max??(void 0!==n?n:void 0!==this.entityConfig.decimals?Number(this.entityConfig.decimals):2);let h=e.decimals_min??(void 0!==n?n:void 0!==this.entityConfig.decimals?Number(this.entityConfig.decimals):0);h>l&&(h=l);try{i=new Intl.NumberFormat(t,{useGrouping:!1!==e.separator,minimumFractionDigits:h,maximumFractionDigits:l}).format(Number(r))}catch(o){console.error("Error formatting numeric state inside parts:",o)}}return s.map((t=>"value"===t.type&&void 0!==i?{...t,value:i}:"unit"===t.type&&void 0!==this.entityConfig.unit?{...t,value:this.entityConfig.unit}:t))}buildStateAndUom(){const t=this.formatEntityStateParts();let e="",r="";t.forEach((t=>{"unit"===t.type?r+=t.value:"value"===t.type&&(e+=t.value)})),this.state=e.trim(),this.uom=this.buildUom(r.trim())}buildUom(t){return this.entityConfig.unit||t||""}getUomStyles(t){const e=this.runtimeConfig.uom??{},r=mt.toStyleDict(e.styles),s=t["font-size"];let i=.5,o="em";const a=String(s).trim().match(/^(\d*\.?\d+)([a-z%]+)$/i);return a?(i=.6*Number(a[1]),o=a[2]):console.error("Cannot determine font-size for state",s),{...t,opacity:"0.7","font-size":`${i}${o}`,...r}}render(){const t=this.getStyles({"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"});this.applyColorStops(t,"fill");const e=this.getUomStyles(t),r=this.runtimeConfig.dx?this.runtimeConfig.dx:"0",s=this.runtimeConfig.dy?this.runtimeConfig.dy:"0",i=this.runtimeConfig.uom??{},o=i.dx??"0.1",a=i.dy??"-0.45";return H`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text @click=${t=>this.handlePopup(t)}>
          <tspan
            class="state__value"
            x="${this.runtimeConfig.svg.xpos}"
            y="${this.runtimeConfig.svg.ypos}"
            dx="${r}em"
            dy="${s}em"
            style=${pt(t)}
          >${this.state}</tspan><tspan
            class="state__uom"
            dx="${o}em"
            dy="${a}em"
            style=${pt(e)}
          >${this.uom}</tspan>
        </text>
      </g>
    `}}function eo(t,e,r){if(r||2===arguments.length)for(var s,i=0,o=e.length;i<o;i++)!s&&i in e||(s||(s=Array.prototype.slice.call(e,0,i)),s[i]=e[i]);return t.concat(s||Array.prototype.slice.call(e))}"function"==typeof SuppressedError&&SuppressedError;var ro,so={};
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */var io=function(){if(ro)return so;ro=1;var t=/; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g,e=/^[\u000b\u0020-\u007e\u0080-\u00ff]+$/,r=/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/,s=/\\([\u000b\u0020-\u00ff])/g,i=/([\\"])/g,o=/^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;function a(t){var s=String(t);if(r.test(s))return s;if(s.length>0&&!e.test(s))throw new TypeError("invalid parameter value");return'"'+s.replace(i,"\\$1")+'"'}function n(t){this.parameters=Object.create(null),this.type=t}return so.format=function(t){if(!t||"object"!=typeof t)throw new TypeError("argument obj is required");var e=t.parameters,s=t.type;if(!s||!o.test(s))throw new TypeError("invalid type");var i=s;if(e&&"object"==typeof e)for(var n,l=Object.keys(e).sort(),h=0;h<l.length;h++){if(n=l[h],!r.test(n))throw new TypeError("invalid parameter name");i+="; "+n+"="+a(e[n])}return i},so.parse=function(e){if(!e)throw new TypeError("argument string is required");var r="object"==typeof e?function(t){var e;"function"==typeof t.getHeader?e=t.getHeader("content-type"):"object"==typeof t.headers&&(e=t.headers&&t.headers["content-type"]);if("string"!=typeof e)throw new TypeError("content-type header is missing from object");return e}(e):e;if("string"!=typeof r)throw new TypeError("argument string is required to be a string");var i=r.indexOf(";"),a=-1!==i?r.slice(0,i).trim():r.trim();if(!o.test(a))throw new TypeError("invalid media type");var l=new n(a.toLowerCase());if(-1!==i){var h,c,u;for(t.lastIndex=i;c=t.exec(r);){if(c.index!==i)throw new TypeError("invalid parameter format");i+=c[0].length,h=c[1].toLowerCase(),34===(u=c[2]).charCodeAt(0)&&-1!==(u=u.slice(1,-1)).indexOf("\\")&&(u=u.replace(s,"$1")),l.parameters[h]=u}if(i!==r.length)throw new TypeError("invalid parameter format")}return l},so}(),oo=new Map,ao=function(t){return t.cloneNode(!0)},no=function(){return"file:"===window.location.protocol},lo=function(t,e,r){var s=new XMLHttpRequest;s.onreadystatechange=function(){try{if(!/\.svg/i.test(t)&&2===s.readyState){var e=s.getResponseHeader("Content-Type");if(!e)throw new Error("Content type not found");var i=io.parse(e).type;if("image/svg+xml"!==i&&"text/plain"!==i)throw new Error("Invalid content type: ".concat(i))}if(4===s.readyState){if(404===s.status||null===s.responseXML)throw new Error(no()?"Note: SVG injection ajax calls do not work locally without adjusting security settings in your browser. Or consider using a local webserver.":"Unable to load SVG file: "+t);if(!(200===s.status||no()&&0===s.status))throw new Error("There was a problem injecting the SVG: "+s.status+" "+s.statusText);r(null,s)}}catch(o){if(s.abort(),!(o instanceof Error))throw o;r(o,s)}},s.open("GET",t),s.withCredentials=e,s.overrideMimeType&&s.overrideMimeType("image/svg+xml"),s.send()},ho={},co=function(t,e){var r;null!==(r=ho[t])&&void 0!==r||(ho[t]=[]),ho[t].push(e)},uo=function(t,e,r){if(oo.has(t)){var s=oo.get(t);if(void 0===s)return void co(t,r);if(s instanceof SVGSVGElement)return void r(null,ao(s))}oo.set(t,void 0),co(t,r),lo(t,e,(function(e,r){var s;e?oo.set(t,e):(null===(s=r.responseXML)||void 0===s?void 0:s.documentElement)instanceof SVGSVGElement&&oo.set(t,r.responseXML.documentElement),function(t){var e=ho[t];if(e)for(var r=function(r,s){setTimeout((function(){if(Array.isArray(ho[t])){var s=oo.get(t),i=e[r];if(!i)return;s instanceof SVGSVGElement&&i(null,ao(s)),s instanceof Error&&i(s),r===e.length-1&&delete ho[t]}}),0)},s=0,i=e.length;s<i;s++)r(s)}(t)}))},po=function(t,e,r){lo(t,e,(function(t,e){var s;t?r(t):(null===(s=e.responseXML)||void 0===s?void 0:s.documentElement)instanceof SVGSVGElement&&r(null,e.responseXML.documentElement)}))},mo="data:image/svg+xml",go=0,fo=[],yo={},vo="http://www.w3.org/1999/xlink",bo=function(t,e,r,s,i,o,a){var n,l=null!==(n=t.getAttribute("data-src"))&&void 0!==n?n:t.getAttribute("src");if(l){if(-1!==fo.indexOf(t))return fo.splice(fo.indexOf(t),1),void(t=null);fo.push(t),t.setAttribute("src","");var h=l.indexOf("#"),c=-1!==h?l.slice(0,h):l,u=-1!==h?l.slice(h+1):null,d=function(t){if(!t.startsWith(mo))return null;var e,r=t.slice(18);if(r.startsWith(";base64,"))try{e=atob(r.slice(8))}catch(n){return new Error("Invalid base64 in data URL")}else if(r.startsWith(","))try{e=decodeURIComponent(r.slice(1))}catch(o){return new Error("Invalid encoding in data URL")}else{if(!r.startsWith(";charset=utf-8,"))return new Error("Unsupported data URL format");try{e=decodeURIComponent(r.slice(15))}catch(a){return new Error("Invalid encoding in data URL")}}var s=(new DOMParser).parseFromString(e,"image/svg+xml"),i=s.querySelector("parsererror");return i?new Error("Data URL SVG parse error: "+i.textContent.trim()):s.documentElement instanceof SVGSVGElement?s.documentElement:new Error("Data URL did not contain a valid SVG element")}(c);if(d instanceof Error)return fo.splice(fo.indexOf(t),1),t=null,void a(d);var p=function(s,i){var n,h;if(!i)return fo.splice(fo.indexOf(t),1),t=null,void a(s);var d=i;if(u){var p=function(t,e){var r=t.querySelector("#"+CSS.escape(e));if("symbol"!==(null==r?void 0:r.tagName.toLowerCase()))return null;for(var s=document.createElementNS("http://www.w3.org/2000/svg","svg"),i=r.attributes,o=0,a=i.length;o<a;o++){var n=i[o];"id"!==n.name&&s.setAttribute(n.name,n.value)}var l=r.childNodes;for(o=0,a=l.length;o<a;o++)s.appendChild(l[o].cloneNode(!0));return s}(i,u);if(!p)return fo.splice(fo.indexOf(t),1),t=null,void a(new Error('Symbol "'.concat(u,'" not found in ').concat(c)));d=p}var m=t.getAttribute("id");m&&d.setAttribute("id",m);var g=t.getAttribute("title");g&&d.setAttribute("title",g);var f=t.getAttribute("width");f&&d.setAttribute("width",f);var y=t.getAttribute("height");y&&d.setAttribute("height",y);var v=Array.from(new Set(eo(eo(eo([],(null!==(n=d.getAttribute("class"))&&void 0!==n?n:"").split(" "),!0),["injected-svg"],!1),(null!==(h=t.getAttribute("class"))&&void 0!==h?h:"").split(" "),!0))).join(" ").trim();d.setAttribute("class",v);var b=t.getAttribute("style");b&&d.setAttribute("style",b),d.setAttribute("data-src",l);var _=[].filter.call(t.attributes,(function(t){return/^data-\w[\w-]*$/.test(t.name)}));if(Array.prototype.forEach.call(_,(function(t){t.name&&t.value&&d.setAttribute(t.name,t.value)})),r){var x,w,$,S,k,C={clipPath:["clip-path"],"color-profile":["color-profile"],cursor:["cursor"],filter:["filter"],linearGradient:["fill","stroke"],marker:["marker","marker-start","marker-mid","marker-end"],mask:["mask"],path:[],pattern:["fill","stroke"],radialGradient:["fill","stroke"]},A=function(t,e){return t.replace(/url\((['"]?)\s*#([^\s'"\)]+)\s*\1\)/g,(function(t,r,s){var i=e[s];return i?"url(#".concat(i,")"):t}))},M=function(t,e){if(!t.startsWith("#"))return t;var r=e[t.slice(1)];return r?"#"+r:t},E=[],N={};Object.keys(C).forEach((function(t){x=t;for(var e=0,r=(w=d.querySelectorAll(x+"[id]")).length;e<r;e++){var s=w[e];S=s.id,k=S+"-"+ ++go,N[S]=k,E.push({element:s,currentId:S,newId:k})}})),Object.keys(C).forEach((function(t){var e;$=C[t],Array.prototype.forEach.call($,(function(t){for(var r=0,s=(e=d.querySelectorAll("["+t+"]")).length;r<s;r++){var i=e[r],o=i.getAttribute(t);if(o){var a=A(o,N);a!==o&&i.setAttribute(t,a)}}}))}));for(var T=d.querySelectorAll("*"),z=0,I=T.length;z<I;z++){var P=T[z],O=P.getAttribute("href");if(O){var j=M(O,N);j!==O&&P.setAttribute("href",j)}var R=P.getAttributeNS(vo,"href");if(R){var D=M(R,N);D!==R&&P.setAttributeNS(vo,"href",D)}}for(var V=d.querySelectorAll("[style]"),G=0,L=V.length;G<L;G++){var U=V[G],H=U.getAttribute("style");if(H){var q=A(H,N);q!==H&&U.setAttribute("style",q)}}for(var B=d.querySelectorAll("style"),F=0,W=B.length;F<W;F++){var K=B[F],J=K.textContent;if(J){var X=A(J,N);X!==J&&(K.textContent=X)}}for(var Z=0,Y=E.length;Z<Y;Z++)E[Z].element.id=E[Z].newId}d.removeAttribute("xmlns:a");for(var Q,tt,et=d.querySelectorAll("script"),rt=[],st=0,it=et.length;st<it;st++){var ot=et[st];(tt=ot.getAttribute("type"))&&"application/ecmascript"!==tt&&"application/javascript"!==tt&&"text/javascript"!==tt||((Q=ot.innerText||ot.textContent)&&rt.push(Q),d.removeChild(ot))}if(rt.length>0&&("always"===e||"once"===e&&!yo[l])){for(var at=0,nt=rt.length;at<nt;at++)new Function(rt[at])(window);yo[l]=!0}var lt=d.querySelectorAll("style");if(Array.prototype.forEach.call(lt,(function(t){t.textContent+=""})),d.setAttribute("xmlns","http://www.w3.org/2000/svg"),d.setAttribute("xmlns:xlink",vo),o(d),!t.parentNode)return fo.splice(fo.indexOf(t),1),t=null,void a(new Error("Parent node is null"));t.parentNode.replaceChild(d,t),fo.splice(fo.indexOf(t),1),t=null,a(null,d)};if(d)setTimeout((function(){p(null,d)}),0);else(s?uo:po)(c,i,p)}else a(new Error("Invalid data-src or src attribute"))};const _o={apparent_temperature:"mdi:thermometer",cloud_coverage:"mdi:weather-cloudy",dew_point:"mdi:thermometer-water",humidity:"mdi:water-percent",pressure:"mdi:gauge",temperature:"mdi:thermometer",uv_index:"mdi:sun-wireless",visibility:"mdi:weather-fog",wind_bearing:"mdi:weather-windy",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",precipitation_probability:"mdi:weather-pouring",condition_clear_night:"mdi:weather-night",condition_cloudy:"mdi:weather-cloudy",condition_fog:"mdi:weather-fog",condition_hail:"mdi:weather-hail",condition_lightning:"mdi:weather-lightning",condition_lightning_rainy:"mdi:weather-lightning-rainy",condition_partlycloudy:"mdi:weather-partly-cloudy",condition_pouring:"mdi:weather-pouring",condition_rainy:"mdi:weather-rainy",condition_snowy:"mdi:weather-snowy",condition_snowy_rainy:"mdi:weather-snowy-rainy",condition_sunny:"mdi:weather-sunny",condition_windy:"mdi:weather-windy",condition_windy_variant:"mdi:weather-windy-variant",condition_exceptional:"mdi:alert-circle-outline"},xo=(t,e)=>t&&t.components.includes(e),wo={entity:{},entity_component:{}},$o=async(t,e,r)=>((t,e)=>t.sendMessagePromise(e))(t,{type:"frontend/get_icons",category:e,integration:r}),So=async(t,e,r,s=!1)=>{if(!s&&r in wo.entity)return wo.entity[r];if(!xo(t,r)||!((t,e,r,s)=>{const[i,o,a]=t.split(".",3);return Number(i)>e||Number(i)===e&&(void 0===s?Number(o)>=r:Number(o)>r)||void 0!==s&&Number(i)===e&&Number(o)===r&&Number(a)>=s})(e.haVersion,2024,2))return;const i=$o(e,"entity",r).then((t=>t?.resources[r]));return wo.entity[r]=i,wo.entity[r]},ko=async(t,e,r,s=!1)=>!s&&wo.entity_component.resources&&wo.entity_component.domains?.includes(r)?wo.entity_component.resources.then((t=>t[r])):xo(e,r)?(wo.entity_component.domains=[...e.components],wo.entity_component.resources=$o(t,"entity_component").then((t=>t.resources)),wo.entity_component.resources.then((t=>t[r]))):void 0,Co=new WeakMap,Ao=(t,e)=>{if(e)return t&&e.state?.[t]?e.state[t]:void 0!==t&&e.range&&!isNaN(Number(t))?((t,e)=>{let r=Co.get(e);if(r||(r=Object.keys(e).map(Number).filter((t=>!isNaN(t))).sort(((t,e)=>t-e)),Co.set(e,r)),0===r.length)return;if(t<r[0])return;let s=r[0];for(const i of r){if(!(t>=i))break;s=i}return e[s.toString()]})(Number(t),e.range)??e.default:e.default},Mo=async(t,e,r,s,i,o)=>{const a=o?.platform,n=o?.translation_key,l=s?.attributes.device_class,h=s?.state;let c;if(n&&a){const s=await So(t,e,a);if(s){const t=s[r]?.[n];c=Ao(h,t)}}if(!c&&s&&(c=((t,e)=>{const r=Qs(t),s=e??t.state;switch(r){case"device_tracker":return((t,e)=>{const r=e??t.state;return"router"===t?.attributes.source_type?"home"===r?"mdi:lan-connect":"mdi:lan-disconnect":["bluetooth","bluetooth_le"].includes(t?.attributes.source_type)?"home"===r?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===r?"mdi:account-arrow-right":"mdi:account"})(t,s);case"sun":return"above_horizon"===s?"mdi:white-balance-sunny":"mdi:weather-night";case"input_datetime":if(!t.attributes.has_date)return"mdi:clock";if(!t.attributes.has_time)return"mdi:calendar"}})(s,h)),!c){const s=await ko(e,t,r);if(s){const t=l&&s[l]||s._;c=Ao(h,t)}}return c};class Eo extends Ki{static setConfig(t,e,r,s){return(t.layout?.icons??[]).map(((t,i)=>new Eo(t,i,e,r,s)))}constructor(t,e,r,s,i){super(t,e,r,s,i,"icons","icons",void 0!==t.icon||void 0!==t.state_map?void 0:0),this.config.svg=this.calculateSvgDimensions(),this.runtimeConfig=this.config,this.iconId=Math.random().toString(36).substr(2,9),this.iconSvg=void 0,this.pendingIconPath=void 0}setState(t,e){super.setState(t,e),this.runtimeConfig.svg=this.calculateSvgDimensions(this.runtimeConfig)}calculateSvgDimensions(t=this.config){return this.card._calculateSvgCoordinatesInGroup(t)}getGroupScaleTransform(t=this.runtimeConfig){return this.card._getGroupScaleTransform(t)}getGroupScaleStyle(t=this.runtimeConfig){return this.card._getGroupScaleStyle(t)}getStateMapItem(){const t=this.runtimeConfig?.state_map?.map;if(!t)return;const e=this.entity?.state;return t.find((t=>t.state===e))??t.find((t=>"default"===t.state))}buildIcon(t,e=this.runtimeConfig){const r=this.card.animations?.iconsIcon?.[e.animation_id];if(r)return r;if(t?.icon)return t.icon;if(!this.entity||!this.entityConfig)return e.icon;if(this.entityConfig.icon)return this.entityConfig.icon;const s=this.entityConfig.entity,i=this.entityConfig.attribute,o=i?this.entity.attributes?.[i]:void 0,a=this.entity.entity_id?.split(".")[0];if(this.entity.attributes?.icon&&!i)return this.entity.attributes.icon;if(i&&"weather"===a){const t=_o[i];if(t)return t}this.card.entitiesIcon??={},this.card.entitiesIconKey??={},this.card.entitiesIconPending??={};const n=i?`${s}|attribute:${i}`:`${s}|state`,l=i?[s,"attribute",i,o??"",a??"",this.entity.attributes?.device_class??"",this.entity.attributes?.icon??""].join("|"):[s,"state",this.entity.state??"",a??"",this.entity.attributes?.device_class??"",this.entity.attributes?.icon??""].join("|");if(this.card.entitiesIconKey[n]===l)return this.card.entitiesIcon[n];if(this.card.entitiesIconKey[n]=l,!this.card.entitiesIconPending[n]){this.card.entitiesIconPending[n]=!0;const t=i?(async(t,e,r,s)=>{let i;const o=Qs(e),a=e.attributes.device_class,n=t.entities?.[e.entity_id],l=n?.platform,h=n?.translation_key,c=s??e.attributes[r];if(h&&l){const e=await So(t.config,t.connection,l);e&&(i=Ao(c,e[o]?.[h]?.state_attributes?.[r]))}if(!i){const e=await ko(t.connection,t.config,o);if(e){const t=a&&e[a]?.state_attributes?.[r]||e._?.state_attributes?.[r];i=Ao(c,t)}}return i})(this.card._hass,this.entity,i,void 0!==o?String(o):void 0):(async(t,e,r,s,i)=>{const o=t?.[s.entity_id];if(o?.icon)return o.icon;const a=Qs(s);return Mo(e,r,a,s,i,o)})(this.card._hass.entities,this.card._hass.config,this.card._hass.connection,this.entity);t.then((t=>{this.card.entitiesIconKey[n]===l&&t&&this.card.entitiesIcon[n]!==t&&(this.card.entitiesIcon[n]=t,this.card.requestUpdate())})).catch((t=>{console.error(i?"IconTool.buildIcon attributeIcon failed":"IconTool.buildIcon entityIcon failed",s,i??"",t)})).finally((()=>{this.card.entitiesIconPending[n]=!1}))}return this.card.entitiesIcon[n]}isUrlIcon(t){return"string"==typeof t&&/^url\(['"]?.+['"]?\)$/i.test(t.trim())}isSvgUrl(t){return t.endsWith(".svg")}getUrlFromCssUrl(t){return t.trim().replace(/^url\(['"]?/i,"").replace(/['"]?\)$/,"")}injectSvgUrlIcons(){const t=this.card.shadowRoot.querySelectorAll("svg.icon-svg-url[data-src]:not(.injected-svg)");t.length&&function(t,e){var r=void 0===e?{}:e,s=r.afterAll,i=void 0===s?function(){}:s,o=r.afterEach,a=void 0===o?function(){}:o,n=r.beforeEach,l=void 0===n?function(){}:n,h=r.cacheRequests,c=void 0===h||h,u=r.evalScripts,d=void 0===u?"never":u,p=r.httpRequestWithCredentials,m=void 0!==p&&p,g=r.renumerateIRIElements,f=void 0===g||g;if(t&&"length"in t)for(var y=0,v=0,b=t.length;v<b;v++){var _=t[v];_&&bo(_,d,f,c,m,l,(function(e,r){a(e,r),t&&"length"in t&&t.length===++y&&i(y)}))}else t?bo(t,d,f,c,m,l,(function(e,r){a(e,r),i(1),t=null})):i(0)}(t,{beforeEach(t){t.removeAttribute("height"),t.removeAttribute("width")},afterEach:(t,e)=>{if(t||!e)return;const r=e.dataset.src;r&&(this.card.svgUrlCache[r]=e.cloneNode(!0))},afterAll:()=>{this.card.requestUpdate()},cacheRequests:!1,evalScripts:"once",httpRequestWithCredentials:!1,renumerateIRIElements:!1})}renderCachedSvgUrlIcon(t,e,r,s,i,o,a){const n=this.card.svgUrlCache[e].cloneNode(!0),l=t.rotate??0,h=s/24,c=i-s*a+12*h,u=o-.5*s-(t.yposc?0:.25*s)+12*h;return n.classList.remove("hidden"),H`
      <g
        transform="${this.getGroupScaleTransform(t)}"
        style="${this.getGroupScaleStyle(t)}"
      >
        <g
          class="icon-position"
          transform="translate(${c} ${u})"
          @click=${t=>this.handlePopup(t)}
        >
          <rect
            x="${-s/2}"
            y="${-s/2}"
            height="${s}px"
            width="${s}px"
            stroke-width="0px"
            fill="rgba(0,0,0,0)"
          ></rect>

          <g class="icon-style-animation" style="${pt(r)}">
            <g class="icon-rotate" transform="rotate(${l})">
              <svg
                x="${-s/2}"
                y="${-s/2}"
                width="${s}"
                height="${s}"
                viewBox="0 0 24 24"
                overflow="visible"
              >
                ${n}
              </svg>
            </g>
          </g>
        </g>
      </g>
    `}renderSvgUrlPlaceholder(t,e,r,s,i,o){const a=t.rotate??0,n=r/24,l=s-r*o+12*n,h=i-.5*r-(t.yposc?0:.25*r)+12*n;return H`
      <g
        transform="${this.getGroupScaleTransform(t)}"
        style="${this.getGroupScaleStyle(t)}"
      >
        <g class="icon-position" transform="translate(${l} ${h})">
          <g class="icon-rotate" transform="rotate(${a})">
            <g class="icon-scale" transform="scale(${n})">
              <g class="icon-center" transform="translate(-12 -12)">
                <svg
                  class="icon-svg-url hidden"
                  data-src="${e}"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <image
                    href="${e}"
                    width="24"
                    height="24"
                  />
                </svg>
              </g>
            </g>
          </g>
        </g>
      </g>
    `}renderSvgUrlIcon(t,e,r,s,i,o,a){return this.card.svgUrlCache[e]?this.renderCachedSvgUrlIcon(t,e,r,s,i,o,a):this.renderSvgUrlPlaceholder(t,e,s,i,o,a)}renderImageUrlIcon(t,e,r,s,i,o,a){const n=t.rotate??0,l=s/24,h=i-s*a+12*l,c=o-.5*s-(t.yposc?0:.25*s)+12*l;return H`
      <g
        transform="${this.getGroupScaleTransform(t)}"
        style="${this.getGroupScaleStyle(t)}"
      >
        <g
          class="icon-position"
          transform="translate(${h} ${c})"
          @click=${t=>this.handlePopup(t)}
        >
          <rect
            x="${-s/2}"
            y="${-s/2}"
            height="${s}px"
            width="${s}px"
            stroke-width="0px"
            fill="rgba(0,0,0,0)"
          ></rect>

          <g class="icon-style-animation" style="${pt(r)}">
            <g class="icon-rotate" transform="rotate(${n})">
              <g class="icon-scale" transform="scale(${l})">
                <g class="icon-center" transform="translate(-12 -12)">
                  <image
                    href="${e}"
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
    `}getRenderedHaIconPath(){const t=this.card.shadowRoot.getElementById(`icon-${this.iconId}`);return t?.shadowRoot?.querySelector("*")?.path}render(){const t=this.runtimeConfig;t.entity=t.entity?t.entity:0;const e=12*(t.icon_size?t.icon_size:t.size?t.size:2),r=t.svg.xpos,s=t.svg.ypos,i=t.align?t.align:"center",o="center"===i?.5:"start"===i?-1:1,a=r-e*o,n=s-e*o,l=e,h=this.getStateMapItem();let c=t;h&&(c=fi.mergeDeep(t,h));const u=this.entity?ci.getHaEntityIconStyle(this.entity):{fill:"currentColor",color:"var(--state-icon-color)"},d={};d.fill=u.fill,d.color=u.color,d.filter=u.filter;const p=gt.getJsTemplateOrValue(c,c.styles);let m=mt.toStyleDict(p);const g=this.card.animations?.icons?.[c.animation_id]??{},f=this.card._getItemColorFromStops(c);f&&(m.fill=f,m.color=f),m={...d,...m,...g};const y=this.buildIcon(h,c);if(this.isUrlIcon(y)){const t=this.getUrlFromCssUrl(y);return this.isSvgUrl(t)?this.renderSvgUrlIcon(c,t,m,e,r,s,o):this.renderImageUrlIcon(c,t,m,e,r,s,o)}if(!y)return H``;if(this.card.iconCache[y])this.iconSvg=this.card.iconCache[y];else if(this.iconSvg=void 0,this.pendingIconPath!==y){this.pendingIconPath=y;let t=0;const e=40,r=50,s=()=>{if(this.pendingIconPath!==y)return;const i=this.getRenderedHaIconPath();if(i)return this.iconSvg=i,this.card.iconCache[y]=i,this.pendingIconPath=void 0,void this.card.requestUpdate();t+=1,t>=e?this.pendingIconPath=void 0:window.setTimeout(s,r)};(this.card?.updateComplete&&"function"==typeof this.card.updateComplete.then?this.card.updateComplete:new Promise((t=>{window.requestAnimationFrame(t)}))).then((()=>{window.setTimeout(s,0)}))}if(this.iconSvg){const t=r-e*o,i=s-.5*e-(c.yposc?0:.25*e),a=e/24,n=c.rotate??0,l=t+12*a,h=i+12*a;return m["transform-origin"]??="0 0",H`
        <g
          transform="${this.getGroupScaleTransform(c)}"
          style="${this.getGroupScaleStyle(c)}"
        >
          <g
            id="icon-rendered-${this.iconId}"
            class="icon-position"
            transform="translate(${l} ${h})"
            @click=${t=>this.handlePopup(t)}
          >
            <rect
              x="${-e/2}"
              y="${-e/2}"
              height="${e}px"
              width="${e}px"
              stroke-width="0px"
              fill="rgba(0,0,0,0)"
            ></rect>

            <g class="icon-style-animation" style="${pt(m)}">
              <g class="icon-rotate" transform="rotate(${n})">
                <g class="icon-scale" transform="scale(${a})">
                  <g class="icon-center" transform="translate(-12 -12)">
                    <path d="${this.iconSvg}"></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      `}return H`
      <foreignObject
        width="0px"
        height="0px"
        x="${a}"
        y="${n}"
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
              id="icon-${this.iconId}"
            ></ha-icon>
          </div>
        </body>
      </foreignObject>
    `}}class No{static cache=new Map;static load(t){if(this.cache.has(t))return this.cache.get(t);const e=fetch(t).then((async e=>{if(!e.ok)throw new Error(`Could not load palette: ${t}`);return e.json()}));return this.cache.set(t,e),e}static async loadAll(t={}){const e=await Promise.all(Object.entries(t||{}).map((async([t,e])=>[t,await this.load(e)])));return Object.fromEntries(e)}static apply(t,e,r){Object.entries(e.ref).forEach((([e,r])=>{t.style.setProperty(`--${e}`,r)})),Object.entries(e.modes[r]).forEach((([e,r])=>{t.style.setProperty(`--${e}`,r)}))}static applyAll(t,e,r){Object.entries(e).forEach((([,e])=>{this.apply(t,e,r)}))}}console.info("%c FLEX-HORSESHOE-CARD %c Version 5.4.7-dev.11 ","color: white; font-weight: bold; background: darkgreen","color: darkgreen; font-weight: bold; background: white");const To={action:"more-info"},zo={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed",scale_style:"fixed"};class Io extends nt{constructor(){if(super(),ci.setElement(this),this.palettesLoaded=!1,this.cardId=Math.random().toString(36).substr(2,9),this._hass=void 0,this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.viewBoxSize=di,this.viewBox={width:di,height:di},this.colorStops={},this.animations={},this.animations.lines={},this.animations.vlines={},this.animations.hlines={},this.animations.circles={},this.animations.rectangles={},this.animations.icons={},this.animations.iconsIcon={},this.animations.names={},this.animations.areas={},this.animations.states={},this.rectangleTools=[],this.lineTools=[],this.circleTools=[],this.nameTools=[],this.areaTools=[],this.stateTools=[],this.iconTools=[],this.resolvedEntityConfigs=[],this.colorCache={},this.isAndroid=!1,this.isSafari=!1,this.iOS=!1,this.resolvedVariables={},this.iconCache={},this.svgUrlCache||={},this.theme={},this.theme.checked=!1,this.theme.isLoaded=!1,this.theme.modeChanged=!1,this.theme.darkMode=!1,this.theme.light={},this.theme.dark={},this.palettes={},this.bar_mode="normal",this.dev={debug:!1},this.isAndroid=!!window.navigator.userAgent.match(/Android/),!this.isAndroid){const t=window.navigator.userAgent||"",e=t.toLowerCase(),r=window.navigator.platform||"",s=(/iPad|iPhone|iPod/.test(t)||"MacIntel"===r&&window.navigator.maxTouchPoints>1)&&!window.MSStream,i=t.match(/Version\/(\d+)(?:\.[\d.]+)?.*Safari/i),o=i?Number(i[1]):void 0,a=e.match(/\bos\s+(\d+)(?:[._]\d+)*.*like safari/),n=e.match(/\bios\s+(\d+)(?:[._]\d+)*/),l=n?Number(n[1]):a?Number(a[1]):void 0,h=Number.isFinite(o),c=Number.isFinite(l)&&e.includes("like safari"),u=h?o:c?l:void 0;this.iOS=s,this.isSafari=Number.isFinite(u),this.safariMajorVersion=u,this.isHomeAssistantLikeSafari=c,this.isRealSafari=h,this.isSafari14=this.isSafari&&14===u,this.isSafari15=this.isSafari&&15===u,this.isSafari16=this.isSafari&&16===u,this.isSafari17=this.isSafari&&17===u,this.isSafari18=this.isSafari&&18===u,this.isSafari26=this.isSafari&&26===u,this.isSafari27=this.isSafari&&27===u,this.isSafari28=this.isSafari&&28===u,this.isSafari29=this.isSafari&&29===u,this.isSafari30=this.isSafari&&30===u,this.isSafariGte16=this.isSafari&&u>=16,this.dev?.debug&&console.log("browser detection",{ua:t,isAndroid:this.isAndroid,isIOS:this.iOS,isSafari:this.isSafari,isRealSafari:this.isRealSafari,isHomeAssistantLikeSafari:this.isHomeAssistantLikeSafari,safariMajorVersion:this.safariMajorVersion,isSafariGte16:this.isSafariGte16}),this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config)}}static get styles(){return o`
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

      .icon-svg-url.hidden {
        display: none;
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
    `}_resolveEntityConfigs(t){return t?.dev?.debug&&console.log("resolving entity config for",t?.entities),t?.entities?.map(((t,e)=>{const r={entity_index:e};return gt.getJsTemplateOrValue(r,t)}))??[]}_setToolEntityState(t){const e=t.entity_index;if(null==e)return t.setState(void 0,void 0),t;const r=this.resolvedEntityConfigs[e],s=this.entities[e];return s&&r?(t.setState(s,r),t):t}themeIsDarkMode(){return!0===this.theme.darkMode}themeIsLightMode(){return!1===this.theme.darkMode}set hass(t){this.setHass(t)}setHass(t,e=!1){this._hass=t,gt.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes});let r=e;const s=t.selectedTheme||t.themes.theme||"",i=!0===t.themes.darkMode;if(this.theme.nameChanged=this.theme.name!==s,this.theme.modeChanged=this.theme.darkMode!==i,this.theme.nameChanged||this.theme.modeChanged){this.theme.name=s,this.theme.darkMode=i,ci.colorCache={};const t=this.hass?.themes?.darkMode?"dark":"light";No.applyAll(this,this.palettes,t),this.horseshoeGauges?.forEach((t=>t.clearPathItemCache()))}this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.resolvedEntityConfigs.forEach(((e,s)=>{const i=t.states[e.entity];if(!i)return;this.entities[s]=i;const o=to.buildState(i.state,e,this._hass,i);if(Qs(i),o!==this.entitiesStr[s]&&(this.entitiesStr[s]=o,r=!0),e.attribute&&Object.prototype.hasOwnProperty.call(i.attributes,e.attribute)){const t=to.buildState(i.attributes[e.attribute],e,this._hass,i);t!==this.attributesStr[s]&&(this.attributesStr[s]=t,r=!0)}})),r&&(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.horseshoeGauges=this.horseshoeGauges.map((t=>this._setToolEntityState(t))),this.rectangleTools=(this.rectangleTools??[]).map((t=>this._setToolEntityState(t))),this.lineTools=(this.lineTools??[]).map((t=>this._setToolEntityState(t))),this.circleTools=(this.circleTools??[]).map((t=>this._setToolEntityState(t))),this.nameTools=(this.nameTools??[]).map((t=>this._setToolEntityState(t))),this.areaTools=(this.areaTools??[]).map((t=>this._setToolEntityState(t))),this.stateTools=(this.stateTools??[]).map((t=>this._setToolEntityState(t))),this.iconTools=(this.iconTools??[]).map((t=>this._setToolEntityState(t))),this.config.animations&&Object.keys(this.config.animations).map((t=>{const e=t.substr(Number(t.indexOf(".")+1));return this.config.animations[t].map((t=>this.entities[e].state.toLowerCase()===t.state.toLowerCase()&&(t.lines&&t.lines.forEach((t=>this._updateAnimationStyles("lines",t))),t.vlines&&t.vlines.forEach((t=>this._updateAnimationStyles("vlines",t))),t.hlines&&t.hlines.forEach((t=>this._updateAnimationStyles("hlines",t))),t.circles&&t.circles.forEach((t=>this._updateAnimationStyles("circles",t))),t.rectangles&&t.rectangles.forEach((t=>this._updateAnimationStyles("rectangles",t))),t.names&&t.names.forEach((t=>this._updateAnimationStyles("names",t))),t.areas&&t.areas.forEach((t=>this._updateAnimationStyles("areas",t))),t.icons&&t.icons.forEach((t=>{const e=t.animation_id;this.animations.icons[e]&&t.reuse||(this.animations.icons[e]={},this.animations.iconsIcon[e]={});const r=gt.getJsTemplateOrValue(t,t.styles),s=mt.toStyleDict(r);this.animations.icons[e]={...this.animations.icons[e],...s},this.animations.iconsIcon[e]=gt.getJsTemplateOrValue(t,t.icon)})),t.states&&t.states.forEach((t=>this._updateAnimationStyles("states",t))),!0))),!0})),gt.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),this.theme.modeChanged=!1,this.requestUpdate())}_updateAnimationStyles(t,e){const r=e.animation_id;if(null==r)return;const s=gt.getJsTemplateOrValue(e,e.styles),i=mt.toStyleDict(s);this.animations[t][r]={...e.reuse?this.animations[t][r]??{}:{},...i}}_prepareItemColorStops(t){["states","names","areas","circles","rectangles","lines","hlines","vlines","icons","horseshoes","horseshoes_v2"].forEach((e=>{const r=t.layout?.[e];Array.isArray(r)&&r.forEach((t=>{if(!t.color_stops)return;const e=gt.getJsTemplateOrValue(t,t.color_stops,{resolveKeys:!0});t._colorStops=ft.normalize(e)}))}))}_calculateSvgCoordinatesInGroup(t){const e={xpos:gi.calculateSvgDimension(t.xpos),ypos:gi.calculateSvgDimension(t.yposc||t.ypos)},r=this.config.layout?.groups?.[t.group];if(!t.group||!r)return e;return{xpos:gi.calculateSvgDimension(r.xpos+t.xpos-50),ypos:gi.calculateSvgDimension(r.ypos+(t.yposc||t.ypos)-50)}}_computeGroupDimensions(t){const e=t.layout?.groups;e&&Object.entries(e).forEach((([t,e])=>{e.svg={xpos:gi.calculateSvgDimension(e.xpos),ypos:gi.calculateSvgDimension(e.ypos)}}))}_computeSvgDimensions(t){const e=t.layout;e?.icons&&e.icons.forEach((t=>{t.svg=this._calculateSvgCoordinatesInGroup(t)})),this?.horseshoes&&this.horseshoes.forEach((t=>{t.svg=this._calculateSvgCoordinatesInGroup(t),t.svg.radius=gi.calculateSvgDimension(t.radius),t.svg.tickmarksRadius=gi.calculateSvgDimension(t.tickmarks_radius),t.svg.rotateX=t.svg.xpos,t.svg.rotateY=t.svg.ypos}))}_isStaticCalc(t){return"string"==typeof t&&t.startsWith("calc(")&&t.endsWith(")")}_evaluateStaticCalc(t,e={}){const r=t.slice(5,-1).trim();if(!/^[0-9+\-*/().,\sA-Za-z_]+$/.test(r))throw new Error(`Invalid static calc expression '${t}'`);const s={...e,sin:Math.sin,cos:Math.cos,tan:Math.tan,abs:Math.abs,round:Math.round,floor:Math.floor,ceil:Math.ceil,min:Math.min,max:Math.max,sqrt:Math.sqrt,PI:Math.PI},i=Function(...Object.keys(s),`"use strict"; return (${r});`)(...Object.values(s));if(!this._isStaticNumber(i))throw new Error(`Static calc expression '${t}' did not return a finite number`);return i}_isStaticNumber(t){return"number"==typeof t&&Number.isFinite(t)}_applySameAsDeltas(t,e,r){return Object.entries(t).forEach((([t,s])=>{if(!t.startsWith("same_as_d"))return;const i=t.substring(9);if(!i)throw new Error(`Invalid same_as delta field '${t}' for item ${r}`);if(void 0===e[i])throw new Error(`same_as delta '${t}' requires '${i}' for item ${r}`);if(!this._isStaticNumber(e[i]))throw new Error(`same_as delta '${t}' requires numeric '${i}' for item ${r}`);if(!this._isStaticNumber(s))throw new Error(`same_as delta '${t}' must be numeric for item ${r}`);e[i]+=s})),e}_mergeSameAsItem(t,e,r="merge",s){const i=fi.mergeDeep(t,e);return Object.entries(e).forEach((([e,o])=>{const a=o?.same_as_merge??r,n=o?.same_as_key??s;if("replace"!==a){if("keyed"===a){if(!n)throw new Error(`same_as_key is required when same_as_merge is keyed for field '${e}'`);const{same_as_merge:r,same_as_key:s,...a}=o;i[e]=fi.mergeDeep(t[e]??{},a),Object.entries(a).forEach((([r,s])=>{Array.isArray(t[e]?.[r])&&Array.isArray(s)&&(i[e][r]=this._mergeListByKey(t[e][r],s,n))}))}}else{const{same_as_merge:t,same_as_key:r,...s}=o;i[e]=s}})),i}_mergeSameAsKeyed(t,e,r){const s=fi.mergeDeep(t,e);if(!r)throw new Error("same_as_key is required when same_as_merge is keyed");return Object.keys(e).forEach((i=>{Array.isArray(t[i])&&Array.isArray(e[i])&&(s[i]=this._mergeListByKey(t[i],e[i],r))})),s}_mergeListByKey(t,e,r){const s=new Map;return t.forEach((t=>{s.set(String(t[r]),t)})),e.forEach((t=>{const e=String(t[r]);s.has(e)?s.set(e,fi.mergeDeep(s.get(e),t)):s.set(e,t)})),[...s.values()]}_resolveSameAsItems(t){const e=new Map;return t.map(((t,r)=>{let s;if(void 0===t.same_as)s=t;else{const i=e.get(String(t.same_as));if(!i)throw new Error(`same_as '${t.same_as}' not found for item ${r}`);const{same_as:o,same_as_replace:a=[],...n}=t,l={...i};a.forEach((t=>{delete l[t]})),s=fi.mergeDeep(l,n),s=this._applySameAsDeltas(t,s),delete s.same_as,delete s.same_as_replace,Object.keys(s).filter((t=>t.startsWith("same_as_d"))).forEach((t=>delete s[t]))}return e.set(String(s.id),s),s}))}_resolveSectionSameAs(t){["horseshoes","horseshoes_v2","states","names","areas","circles","rectangles","lines","hlines","vlines","icons"].forEach((e=>{const r=t.layout?.[e];Array.isArray(r)&&(t.layout[e]=this._resolveSameAsItems(r))}))}_assignIdItems(t){return t.map(((t,e)=>({...t,id:String(t.id??e)})))}_assignSectionIds(t){["horseshoes","horseshoes_v2","states","names","areas","circles","rectangles","lines","hlines","vlines","icons"].forEach((e=>{const r=t.layout?.[e];Array.isArray(r)&&(t.layout[e]=this._assignIdItems(r))}))}_isStaticRef(t){return"string"==typeof t&&t.startsWith("ref(")&&t.endsWith(")")}_cloneStaticValue(t){return t&&"object"==typeof t?fi.mergeDeep(Array.isArray(t)?[]:{},t):t}_evaluateConstants(t){const e=t.constants;if(!e||"object"!=typeof e)return{};const r={};return Object.entries(e).forEach((([t,s])=>{e[t]=this._evaluateStaticConfig(s,r),this._isStaticNumber(e[t])&&(r[t]=e[t])})),r}_resolveStaticRef(t,e){if(!this._isStaticRef(t))return t;const r=t.slice(4,-1).trim();if(!(r in e))throw new Error(`Static ref '${r}' not found`);return this._cloneStaticValue(e[r])}_resolveStaticRefs(t,e={}){return this._isStaticRef(t)?this._resolveStaticRef(t,e):Array.isArray(t)?t.map((t=>this._resolveStaticRefs(t,e))):t&&"object"==typeof t?(Object.entries(t).forEach((([r,s])=>{t[r]=this._resolveStaticRefs(s,e)})),t):t}_evaluateStaticConfig(t,e={}){return this._isStaticCalc(t)?this._evaluateStaticCalc(t,e):Array.isArray(t)?t.map((t=>this._evaluateStaticConfig(t,e))):t&&"object"==typeof t?(Object.entries(t).forEach((([r,s])=>{t[r]=this._evaluateStaticConfig(s,e)})),t):t}setConfig(t){try{if(t=JSON.parse(JSON.stringify(t)),this.dev={...t.dev},!t.entities)throw Error("No entities defined");if(!t.layout)throw Error("No layout defined");t?.palettes&&(this.palettesLoaded=!1,No.loadAll(t?.palettes).then((t=>{this.palettes=t;const e=this.hass?.themes?.darkMode?"dark":"light";ci.setElement(this),No.applyAll(this,t,e),ci.colorCache={},this.palettesLoaded=!0,this.horseshoeGauges?.forEach((t=>t.clearPathItemCache())),this.setHass(this._hass,!0),this.requestUpdate()}))),this._assignSectionIds(t);const e=this._evaluateConstants(t);this._resolveStaticRefs(t,t.constants),this._evaluateStaticConfig(t,e),this._resolveSectionSameAs(t),gt.setContext({hass:this._hass,config:t,entities:this.entities,horseshoes:this.horseshoes});const r=this._resolveEntityConfigs(t);if(r){if("sensor"!==yt(r[0].entity)&&r[0].attribute&&!isNaN(r[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}r.forEach((t=>{t.tap_action||(t.tap_action={...To})}));const s={texts:[],card_filter:"card--filter-none",bar_mode:t.bar_mode||"normal",...t,show:{...zo,...t.show}};this.horseshoeGauges=Wi.setConfig(t,gt,this.cardId,this),this._prepareItemColorStops(s),this.config=s,this.bar_mode=s.bar_mode||"normal",this.aspectratio=(this.config.layout.aspectratio||this.config.aspectratio||"1/1").trim();const i=this.aspectratio.split("/");this.viewBox||(this.viewBox={}),this.viewBox.width=i[0]*ui,this.viewBox.height=i[1]*ui,this._computeGroupDimensions(this.config),this._computeSvgDimensions(this.config),this.rectangleTools=Ji.setConfig(this.config,gt,this.cardId,this),this.lineTools=Xi.setConfig(this.config,gt,this.cardId,this),this.circleTools=Zi.setConfig(this.config,gt,this.cardId,this),this.nameTools=Yi.setConfig(this.config,gt,this.cardId,this),this.areaTools=Qi.setConfig(this.config,gt,this.cardId,this),this.stateTools=to.setConfig(this.config,gt,this.cardId,this),this.iconTools=Eo.setConfig(this.config,gt,this.cardId,this),gt.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes})}catch(e){throw console.error("[FHC setConfig] CONFIG ERROR",{error:e,message:e?.message,stack:e?.stack,rawConfig:t,horseshoes:this.horseshoes}),e}}_getItemStateValue(t={}){const e=t.entity_index;if(null==e)return;const r=this.entities?.[e],s=this.config?.entities?.[e];if(!r)return;const i=s?.attribute;return i&&r.attributes&&void 0!==r.attributes[i]?r.attributes[i]:r.state}_getItemColorFromStops(t={}){if(!t._colorStops)return;const e=this._getItemStateValue(t),r=Number(e);return Number.isFinite(r)?ci.calculateStrokeColor(r,t._colorStops,!0===t.colorstop_gradient):void 0}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback()}render({config:t}=this){const e=gt.getJsTemplateOrValue({entity_index:0},t?.styles),r=mt.toStyleDict(e);return U`
      <ha-card @click=${t=>this.handlePopup(t,this.entities[0])} style=${pt(r)}>
        <div class="container" id="container">${this._renderSvg()}</div>

      </ha-card>
    `}_renderSvgDefs(){return H`
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
    `}_renderSvg(){const t=this.config.card_filter?this.config.card_filter:"card--filter-none";return H`
        <svg xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
            class="${t}"
          viewBox='0 0 ${this.viewBox.width} ${this.viewBox.height}'>
            ${this._renderSvgDefs()}
            <g id="layout-tools" class="layout-tools">
              ${this._renderLayoutTools()}
            </g>
        </svg>
      `}_getRenderableTools(){return[...this.rectangleTools??[],...this.circleTools??[],...this.horseshoeGauges??[],...this.lineTools??[],...this.iconTools??[],...this.areaTools??[],...this.nameTools??[],...this.stateTools??[]]}_getToolSortNumber(t,e=0){const r=Number(t);return Number.isFinite(r)?r:e}_sortRenderableTools(t,e){const r=this._getToolSortNumber(t.zpos)-this._getToolSortNumber(e.zpos);return 0!==r?r:this._getToolSortNumber(t.renderIndex)-this._getToolSortNumber(e.renderIndex)}_renderLayoutTools(){return H`
      ${this._getRenderableTools().sort(((t,e)=>this._sortRenderableTools(t,e))).map((t=>t.render()))}
    `}_getGroupScaleTransform(t){const e=t?.group?this.config?.layout?.groups?.[t.group]:void 0;if(!e?.scale&&!t?.flip)return"";const r=e?.scale?.x??e?.scale??1,s=e?.scale?.y??e?.scale??1;return`scale(${r*("x"===t?.flip||"both"===t?.flip?-1:1)}, ${s*("y"===t?.flip||"both"===t?.flip?-1:1)})`}_getGroupScaleStyle(t){const e=t?.group?this.config?.layout?.groups?.[t.group]:void 0;return e?.scale&&e.svg?`transform-origin:${e.svg.xpos}px ${e.svg.ypos}px; transform-box:view-box;`:`transform-origin:${t.svg.xpos}px ${t.svg.ypos}px; transform-box:view-box;`}updated(t){super.updated?.(t),this.iconTools?.[0]?.injectSvgUrlIcons()}_handleClick(t,e,r,s,i){let o;switch(s.action){case"more-info":o=new Event("hass-more-info",{composed:!0}),o.detail={entityId:i},t.dispatchEvent(o);break;case"navigate":if(!s.navigation_path)return;window.history.pushState(null,"",s.navigation_path),o=new Event("location-changed",{composed:!0}),o.detail={replace:!1},window.dispatchEvent(o);break;case"call-service":{if(!s.service)return;const[t,r]=s.service.split(".",2),i={...s.service_data};e.callService(t,r,i);break}case"fire-dom-event":o=new Event("ll-custom",{composed:!0,bubbles:!0}),o.detail=s,t.dispatchEvent(o)}}handlePopup(t,e){t.stopPropagation();const r=this.resolvedEntityConfigs.find((t=>t.entity===e.entity_id)),s=r?.tap_action??this.config?.tap_action??{action:"more-info"};this._handleClick(this,this._hass,this.config,s,e.entity_id)}_computeEntity(t){return t.substr(t.indexOf(".")+1)}getCardSize(){return 4}}customElements.get("flex-horseshoe-card")||customElements.define("flex-horseshoe-card",Io);

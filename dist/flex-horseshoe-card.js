/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let a=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new a(s,t,i)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,i))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:n,defineProperty:h,getOwnPropertyDescriptor:l,getOwnPropertyNames:c,getOwnPropertySymbols:d,getPrototypeOf:u}=Object,p=globalThis,g=p.trustedTypes,m=g?g.emptyScript:"",f=p.reactiveElementPolyfillSupport,y=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!n(t,e),_={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:a}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);a?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...c(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const t=this._$Eu(e,i);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of s){const s=document.createElement("style"),a=t.litNonce;void 0!==a&&s.setAttribute("nonce",a),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const a=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==a?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const r=a.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,a){if(void 0!==t){const r=this.constructor;if(!1===s&&(a=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??b)(a,e)||i.useDefault&&i.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:a},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==a||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[y("elementProperties")]=new Map,x[y("finalized")]=new Map,f?.({ReactiveElement:x}),(p.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,$=w.trustedTypes,k=$?$.createPolicy("flex-horseshoe-card-lit-html",{createHTML:t=>t}):void 0,S="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,A="?"+M,T=`<${A}>`,C=document,E=()=>C.createComment(""),I=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,R="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,P=/-->/g,z=/>/g,G=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,F=/"/g,L=/^(?:script|style|textarea|title)$/i,j=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),O=j(1),H=j(2),V=Symbol.for("lit-noChange"),U=Symbol.for("lit-nothing"),q=new WeakMap,X=C.createTreeWalker(C,129);function Y(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const W=(t,e)=>{const i=t.length-1,s=[];let a,r=2===e?"<svg>":3===e?"<math>":"",o=D;for(let n=0;n<i;n++){const e=t[n];let i,h,l=-1,c=0;for(;c<e.length&&(o.lastIndex=c,h=o.exec(e),null!==h);)c=o.lastIndex,o===D?"!--"===h[1]?o=P:void 0!==h[1]?o=z:void 0!==h[2]?(L.test(h[2])&&(a=RegExp("</"+h[2],"g")),o=G):void 0!==h[3]&&(o=G):o===G?">"===h[0]?(o=a??D,l=-1):void 0===h[1]?l=-2:(l=o.lastIndex-h[2].length,i=h[1],o=void 0===h[3]?G:'"'===h[3]?F:B):o===F||o===B?o=G:o===P||o===z?o=D:(o=G,a=void 0);const d=o===G&&t[n+1].startsWith("/>")?" ":"";r+=o===D?e+T:l>=0?(s.push(i),e.slice(0,l)+S+e.slice(l)+M+d):e+M+(-2===l?n:d)}return[Y(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class J{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let a=0,r=0;const o=t.length-1,n=this.parts,[h,l]=W(t,e);if(this.el=J.createElement(h,i),X.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=X.nextNode())&&n.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=l[r++],i=s.getAttribute(t).split(M),o=/([.?@])?(.*)/.exec(e);n.push({type:1,index:a,name:o[2],strings:i,ctor:"."===o[1]?et:"?"===o[1]?it:"@"===o[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(M)&&(n.push({type:6,index:a}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(M),e=t.length-1;if(e>0){s.textContent=$?$.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],E()),X.nextNode(),n.push({type:2,index:++a});s.append(t[e],E())}}}else if(8===s.nodeType)if(s.data===A)n.push({type:2,index:a});else{let t=-1;for(;-1!==(t=s.data.indexOf(M,t+1));)n.push({type:7,index:a}),t+=M.length-1}a++}}static createElement(t,e){const i=C.createElement("template");return i.innerHTML=t,i}}function Z(t,e,i=t,s){if(e===V)return e;let a=void 0!==s?i._$Co?.[s]:i._$Cl;const r=I(e)?void 0:e._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),void 0===r?a=void 0:(a=new r(t),a._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=a:i._$Cl=a),void 0!==a&&(e=Z(t,a._$AS(t,e.values),a,s)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??C).importNode(e,!0);X.currentNode=s;let a=X.nextNode(),r=0,o=0,n=i[0];for(;void 0!==n;){if(r===n.index){let e;2===n.type?e=new Q(a,a.nextSibling,this,t):1===n.type?e=new n.ctor(a,n.name,n.strings,this,t):6===n.type&&(e=new at(a,this,t)),this._$AV.push(e),n=i[++o]}r!==n?.index&&(a=X.nextNode(),r++)}return X.currentNode=C,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}let Q=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=U,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),I(t)?t===U||null==t||""===t?(this._$AH!==U&&this._$AR(),this._$AH=U):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==U&&I(this._$AH)?this._$AA.nextSibling.data=t:this.T(C.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new K(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new J(t)),e}k(e){N(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,a=0;for(const r of e)a===i.length?i.push(s=new t(this.O(E()),this.O(E()),this,this.options)):s=i[a],s._$AI(r),a++;a<i.length&&(this._$AR(s&&s._$AB.nextSibling,a),i.length=a)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}};class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,a){this.type=1,this._$AH=U,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=U}_$AI(t,e=this,i,s){const a=this.strings;let r=!1;if(void 0===a)t=Z(this,t,e,0),r=!I(t)||t!==this._$AH&&t!==V,r&&(this._$AH=t);else{const s=t;let o,n;for(t=a[0],o=0;o<a.length-1;o++)n=Z(this,s[i+o],e,o),n===V&&(n=this._$AH[o]),r||=!I(n)||n!==this._$AH[o],n===U?t=U:t!==U&&(t+=(n??"")+a[o+1]),this._$AH[o]=n}r&&!s&&this.j(t)}j(t){t===U?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===U?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==U)}}class st extends tt{constructor(t,e,i,s,a){super(t,e,i,s,a),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??U)===V)return;const i=this._$AH,s=t===U&&i!==U||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==U&&(i===U||s);s&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(J,Q),(w.litHtmlVersions??=[]).push("3.3.2");const ot=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let nt=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let a=s._$litPart$;if(void 0===a){const t=i?.renderBefore??null;s._$litPart$=a=new Q(e.insertBefore(E(),t),t,void 0,i??{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};nt._$litElement$=!0,nt.finalized=!0,ot.litElementHydrateSupport?.({LitElement:nt});const ht=ot.litElementPolyfillSupport;ht?.({LitElement:nt}),(ot.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt=1,ct=2,dt=t=>(...e)=>({_$litDirective$:t,values:e});let ut=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pt="important",gt=" !"+pt,mt=dt(class extends ut{constructor(t){if(super(t),t.type!==lt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`}),"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const s of this.ft)null==e[s]&&(this.ft.delete(s),s.includes("-")?i.removeProperty(s):i[s]=null);for(const s in e){const t=e[s];if(null!=t){this.ft.add(s);const e="string"==typeof t&&t.endsWith(gt);s.includes("-")||e?i.setProperty(s,e?t.slice(0,-11):t,e?pt:""):i[s]=t}}return V}});class ft{static toStyleDict(t){return ft.toDict(t,{stringToDict:ft.cssStringToDict,mapValue:ft.toStyleValue})}static toClassDict(t){return ft.toDict(t,{stringToDict:ft.classStringToDict,mapValue:Boolean})}static toIconDict(t){return ft.toDict(t,{stringToDict:ft.stringToDefaultDict("default"),mapValue:String})}static toDict(t,e={}){const{stringToDict:i=ft.stringToDefaultDict("default"),mapValue:s=(t=>t),skipNull:a=!0,skipFalse:r=!0}=e,o=t=>null==t&&a||!1===t&&r?{}:Array.isArray(t)?t.reduce(((t,e)=>({...t,...o(e)})),{}):ft.isPlainObject(t)?Object.fromEntries(Object.entries(t).filter((([,t])=>(null!=t||!a)&&(!1!==t||!r))).map((([t,e])=>[t,s(e,t)]))):"string"==typeof t?i(t):{};return o(t)}static toStyleValue(t){return null==t?t:String(t).trim().replace(/;+$/,"")}static cssStringToDict(t){return String(t).split(";").map((t=>t.trim())).filter(Boolean).reduce(((t,e)=>{const i=e.indexOf(":");if(i<=0)return t;const s=e.slice(0,i).trim(),a=e.slice(i+1).trim();return s&&a?{...t,[s]:a}:t}),{})}static toColorStopDict(t){return ft.toDict(t,{stringToDict:ft.keyValueStringToDict,mapValue:String})}static keyValueStringToDict(t){const e=String(t).trim(),i=e.indexOf(":");if(i<=0)return{};const s=e.slice(0,i).trim(),a=e.slice(i+1).trim();return s&&a?{[s]:a}:{}}static classStringToDict(t){return String(t).trim().split(/\s+/).filter(Boolean).reduce(((t,e)=>({...t,[e]:!0})),{})}static stringToDefaultDict(t="default"){return e=>({[t]:String(e)})}static requireArray(t,e="value"){if(null==t)return[];if(!Array.isArray(t))throw new Error(`[config-helper] "${e}" must be an array.`);return t}static ensureArray(t){return null==t?[]:Array.isArray(t)?t:[t]}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}}class yt{static context={};static javascriptTemplateFlags=new WeakMap;static javascriptFunctionCache=new Map;static setContext(t={}){yt.context=t}static detectJavascriptTemplates(t){if("string"==typeof t)return yt.isJsTemplate(t);if(Array.isArray(t)){let e=!1;return t.forEach((t=>{yt.detectJavascriptTemplates(t)&&(e=!0)})),yt.javascriptTemplateFlags.set(t,e),e}if(yt.isPlainObject(t)){let e=!1;return Object.entries(t).forEach((([t,i])=>{yt.isJsTemplate(t)&&(e=!0),yt.detectJavascriptTemplates(i)&&(e=!0)})),yt.javascriptTemplateFlags.set(t,e),e}return!1}static hasJavascriptTemplates(t){return"string"==typeof t?yt.isJsTemplate(t):!(!t||"object"!=typeof t)&&(yt.javascriptTemplateFlags.has(t)||yt.detectJavascriptTemplates(t),!0===yt.javascriptTemplateFlags.get(t))}static getJsTemplateOrValue(t,e,i={}){return yt._getJsTemplateOrValue(t,e,i,0)}static _getJsTemplateOrValue(t,e,i={},s=0){const{resolveKeys:a=!0,maxDepth:r=10}=i;if(s>=r)return e;if(null==e)return e;if(["number","boolean","bigint","symbol"].includes(typeof e))return e;if(Array.isArray(e))return e.map((e=>yt._getJsTemplateOrValue(t,e,i,s)));if(yt.isPlainObject(e))return Object.fromEntries(Object.entries(e).map((([e,r])=>{const o=a?yt._getJsTemplateOrValue(t,e,i,s):e,n=yt._getJsTemplateOrValue(t,r,i,s);return[String(o),n]})));if("string"!=typeof e)return e;const o=e.trim();if(!yt.isJsTemplate(o))return e;const n=yt.evaluateJsTemplate(t,yt.extractJsTemplateCode(o));return yt._getJsTemplateOrValue(t,n,i,s+1)}static isJsTemplate(t){return"string"==typeof t&&t.trim().startsWith("[[[")&&t.trim().endsWith("]]]")}static extractJsTemplateCode(t){return String(t).trim().slice(3,-3).trim()}static evaluateJsTemplate(t,e){const{hass:i,config:s,entities:a=[]}=yt.context,r=yt._getItemEntityIndex(t),o=yt._getTemplateState(t),n=a?.[r],h=i?.states,l=s?.constants??{},c=i?.user;s?.dev?.debug&&console.log("Evaluating JavaScript template with context:",{hass:i,config:s,entity:n,entities:a,states:h,state:o,constants:l,item:t,user:c});try{let r=yt.javascriptFunctionCache.get(e);return r||(r=new Function("hass","config","entity","entities","states","state","constants","item","user",`\n            "use strict";\n            ${e}\n          `),yt.javascriptFunctionCache.set(e,r)),r(i,s,n,a,h,o,l,t,c)}catch(d){return void(s?.dev?.debug&&console.error("[templates] JavaScript template error:",{error:d,item:t,javascript:e}))}}static _getTemplateState(t={}){const e=yt._getItemEntityIndex(t),i=yt.context.entities?.[e],s=yt.context.config?.entities?.[e]||{};if(!i)return;const a=s.attribute;return a&&i.attributes&&void 0!==i.attributes[a]?i.attributes[a]:i.state}static _getItemEntityIndex(t={}){if(void 0===t.entity_index||null===t.entity_index)return;const e=Number(t.entity_index);return Number.isFinite(e)?e:void 0}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}}class vt{static normalize(t,e){return t?Array.isArray(t)?{scales:{},colors:vt.normalizeColors(t)}:!vt.isPlainObject(t)||t.colors||t.scales||t.modes?vt.isPlainObject(t)?{...t,scales:vt.normalizeScales(t.scales),colors:vt.normalizeColors(vt.getDarkOrLightColors(t,e))}:{scales:{},colors:[]}:{scales:{},colors:vt.normalizeColors(t)}:{scales:{},colors:[]}}static getDarkOrLightColors(t,e){const i=t.colors,s=e&&vt.isPlainObject(t.modes)?t.modes[e]:void 0;return null==s?i:s}static normalizeScales(t){return vt.isPlainObject(t)?Object.fromEntries(Object.entries(t).map((([t,e])=>[t,vt.isPlainObject(e)?{...e}:e]))):{}}static normalizeColors(t){return t?Array.isArray(t)?t.flatMap((t=>vt.normalizeColorArrayEntry(t))).filter(Boolean).sort(((t,e)=>t.value-e.value)):vt.isPlainObject(t)?Object.entries(t).map((([t,e])=>vt.normalizeColorPair(t,e))).filter(Boolean).sort(((t,e)=>t.value-e.value)):[]:[]}static normalizeColorArrayEntry(t){if(vt.isPlainObject(t)&&Object.prototype.hasOwnProperty.call(t,"value")&&Object.prototype.hasOwnProperty.call(t,"color")){const e=vt.normalizeColorEntry(t);return e?[e]:[]}return vt.isPlainObject(t)?Object.entries(t).map((([t,e])=>vt.normalizeColorPair(t,e))).filter(Boolean):[]}static normalizeColorPair(t,e){const i=Number(t);return Number.isFinite(i)?null==e?null:{value:i,color:String(e)}:null}static normalizeColorEntry(t){if(!vt.isPlainObject(t))return null;const e=Number(t.value);return Number.isFinite(e)?void 0===t.color||null===t.color?null:{...t,value:e,color:String(t.color)}:null}static ensureMinimumStops(t,e){return t?.colors&&1===t.colors.length?{...t,colors:[t.colors[0],{value:e,color:t.colors[0].color}]}:t}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}}const bt=t=>t.substring(0,t.indexOf(".")),_t=(t,e)=>{if("number"==typeof t)return 3===e?{mode:"rgb",r:(t>>8&15|t>>4&240)/255,g:(t>>4&15|240&t)/255,b:(15&t|t<<4&240)/255}:4===e?{mode:"rgb",r:(t>>12&15|t>>8&240)/255,g:(t>>8&15|t>>4&240)/255,b:(t>>4&15|240&t)/255,alpha:(15&t|t<<4&240)/255}:6===e?{mode:"rgb",r:(t>>16&255)/255,g:(t>>8&255)/255,b:(255&t)/255}:8===e?{mode:"rgb",r:(t>>24&255)/255,g:(t>>16&255)/255,b:(t>>8&255)/255,alpha:(255&t)/255}:void 0},xt={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},wt=/^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i,$t="([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)",kt=`${$t}%`,St=`(?:${$t}%|${$t})`,Mt=`(?:${$t}(deg|grad|rad|turn)|${$t})`,At="\\s*,\\s*",Tt=new RegExp(`^rgba?\\(\\s*${$t}${At}${$t}${At}${$t}\\s*(?:,\\s*${St}\\s*)?\\)$`),Ct=new RegExp(`^rgba?\\(\\s*${kt}${At}${kt}${At}${kt}\\s*(?:,\\s*${St}\\s*)?\\)$`),Et=(t="rgb")=>e=>void 0!==(e=((t,e)=>void 0===t?void 0:"object"!=typeof t?Zt(t):void 0!==t.mode?t:e?{...t,mode:e}:void 0)(e,t))?e.mode===t?e:It[e.mode][t]?It[e.mode][t](e):"rgb"===t?It[e.mode].rgb(e):It.rgb[t](It[e.mode].rgb(e)):void 0,It={},Nt={},Rt=[],Dt={},Pt=t=>t,zt=t=>(It[t.mode]={...It[t.mode],...t.toMode},Object.keys(t.fromMode||{}).forEach((e=>{It[e]||(It[e]={}),It[e][t.mode]=t.fromMode[e]})),t.ranges||(t.ranges={}),t.difference||(t.difference={}),t.channels.forEach((e=>{if(void 0===t.ranges[e]&&(t.ranges[e]=[0,1]),!t.interpolate[e])throw new Error(`Missing interpolator for: ${e}`);"function"==typeof t.interpolate[e]&&(t.interpolate[e]={use:t.interpolate[e]}),t.interpolate[e].fixup||(t.interpolate[e].fixup=Pt)})),Nt[t.mode]=t,(t.parse||[]).forEach((e=>{Gt(e,t.mode)})),Et(t.mode)),Gt=(t,e)=>{if("string"==typeof t){if(!e)throw new Error("'mode' required when 'parser' is a string");Dt[t]=e}else"function"==typeof t&&Rt.indexOf(t)<0&&Rt.push(t)},Bt=/[^\x00-\x7F]|[a-zA-Z_]/,Ft=/[^\x00-\x7F]|[-\w]/,Lt={Function:"function",Ident:"ident",Number:"number",Percentage:"percentage",ParenClose:")",None:"none",Hue:"hue",Alpha:"alpha"};let jt=0;function Ot(t){let e=t[jt],i=t[jt+1];return"-"===e||"+"===e?/\d/.test(i)||"."===i&&/\d/.test(t[jt+2]):/\d/.test("."===e?i:e)}function Ht(t){if(jt>=t.length)return!1;let e=t[jt];if(Bt.test(e))return!0;if("-"===e){if(t.length-jt<2)return!1;let e=t[jt+1];return!("-"!==e&&!Bt.test(e))}return!1}const Vt={deg:1,rad:180/Math.PI,grad:.9,turn:360};function Ut(t){let e="";if("-"!==t[jt]&&"+"!==t[jt]||(e+=t[jt++]),e+=qt(t),"."===t[jt]&&/\d/.test(t[jt+1])&&(e+=t[jt++]+qt(t)),"e"!==t[jt]&&"E"!==t[jt]||("-"!==t[jt+1]&&"+"!==t[jt+1]||!/\d/.test(t[jt+2])?/\d/.test(t[jt+1])&&(e+=t[jt++]+qt(t)):e+=t[jt++]+t[jt++]+qt(t)),Ht(t)){let i=Xt(t);return"deg"===i||"rad"===i||"turn"===i||"grad"===i?{type:Lt.Hue,value:e*Vt[i]}:void 0}return"%"===t[jt]?(jt++,{type:Lt.Percentage,value:+e}):{type:Lt.Number,value:+e}}function qt(t){let e="";for(;/\d/.test(t[jt]);)e+=t[jt++];return e}function Xt(t){let e="";for(;jt<t.length&&Ft.test(t[jt]);)e+=t[jt++];return e}function Yt(t){let e=Xt(t);return"("===t[jt]?(jt++,{type:Lt.Function,value:e}):"none"===e?{type:Lt.None,value:void 0}:{type:Lt.Ident,value:e}}function Wt(t){t._i=0;let e=t[t._i++];if(!e||e.type!==Lt.Function||"color"!==e.value)return;if(e=t[t._i++],e.type!==Lt.Ident)return;const i=Dt[e.value];if(!i)return;const s={mode:i},a=Jt(t,!1);if(!a)return;const r=(t=>Nt[t])(i).channels;for(let o,n,h=0;h<r.length;h++)o=a[h],n=r[h],o.type!==Lt.None&&(s[n]=o.type===Lt.Number?o.value:o.value/100,"alpha"===n&&(s[n]=Math.max(0,Math.min(1,s[n]))));return s}function Jt(t,e){const i=[];let s;for(;t._i<t.length;)if(s=t[t._i++],s.type===Lt.None||s.type===Lt.Number||s.type===Lt.Alpha||s.type===Lt.Percentage||e&&s.type===Lt.Hue)i.push(s);else{if(s.type!==Lt.ParenClose)return;if(t._i<t.length)return}if(!(i.length<3||i.length>4)){if(4===i.length){if(i[3].type!==Lt.Alpha)return;i[3]=i[3].value}return 3===i.length&&i.push({type:Lt.None,value:void 0}),i.every((t=>t.type!==Lt.Alpha))?i:void 0}}const Zt=t=>{if("string"!=typeof t)return;const e=function(t=""){let e,i=t.trim(),s=[];for(jt=0;jt<i.length;)if(e=i[jt++],"\n"!==e&&"\t"!==e&&" "!==e){if(","===e)return;if(")"!==e){if("+"===e){if(jt--,Ot(i)){s.push(Ut(i));continue}return}if("-"===e){if(jt--,Ot(i)){s.push(Ut(i));continue}if(Ht(i)){s.push({type:Lt.Ident,value:Xt(i)});continue}return}if("."===e){if(jt--,Ot(i)){s.push(Ut(i));continue}return}if("/"===e){for(;jt<i.length&&("\n"===i[jt]||"\t"===i[jt]||" "===i[jt]);)jt++;let t;if(Ot(i)&&(t=Ut(i),t.type!==Lt.Hue)){s.push({type:Lt.Alpha,value:t});continue}if(Ht(i)&&"none"===Xt(i)){s.push({type:Lt.Alpha,value:{type:Lt.None,value:void 0}});continue}return}if(/\d/.test(e))jt--,s.push(Ut(i));else{if(!Bt.test(e))return;jt--,s.push(Yt(i))}}else s.push({type:Lt.ParenClose})}else for(;jt<i.length&&("\n"===i[jt]||"\t"===i[jt]||" "===i[jt]);)jt++;return s}(t),i=e?function(t,e){t._i=0;let i=t[t._i++];if(!i||i.type!==Lt.Function)return;let s=Jt(t,e);return s?(s.unshift(i.value),s):void 0}(e,!0):void 0;let s,a=0,r=Rt.length;for(;a<r;)if(void 0!==(s=Rt[a++](t,i)))return s;return e?Wt(e):void 0};const Kt=(Qt=(t,e,i)=>t+i*(e-t),t=>{let e=(t=>{let e=[];for(let i=0;i<t.length-1;i++){let s=t[i],a=t[i+1];void 0===s&&void 0===a?e.push(void 0):void 0!==s&&void 0!==a?e.push([s,a]):e.push(void 0!==s?[s,s]:[a,a])}return e})(t);return t=>{let i=t*e.length,s=t>=1?e.length-1:Math.max(Math.floor(i),0),a=e[s];return void 0===a?void 0:Qt(a[0],a[1],i-s)}});var Qt;const te=t=>{let e=!1,i=t.map((t=>void 0!==t?(e=!0,t):1));return e?i:t},ee={mode:"rgb",channels:["r","g","b","alpha"],parse:[function(t,e){if(!e||"rgb"!==e[0]&&"rgba"!==e[0])return;const i={mode:"rgb"},[,s,a,r,o]=e;return s.type!==Lt.Hue&&a.type!==Lt.Hue&&r.type!==Lt.Hue?(s.type!==Lt.None&&(i.r=s.type===Lt.Number?s.value/255:s.value/100),a.type!==Lt.None&&(i.g=a.type===Lt.Number?a.value/255:a.value/100),r.type!==Lt.None&&(i.b=r.type===Lt.Number?r.value/255:r.value/100),o.type!==Lt.None&&(i.alpha=Math.min(1,Math.max(0,o.type===Lt.Number?o.value:o.value/100))),i):void 0},t=>{let e;return(e=t.match(wt))?_t(parseInt(e[1],16),e[1].length):void 0},t=>{let e,i={mode:"rgb"};if(e=t.match(Tt))void 0!==e[1]&&(i.r=e[1]/255),void 0!==e[2]&&(i.g=e[2]/255),void 0!==e[3]&&(i.b=e[3]/255);else{if(!(e=t.match(Ct)))return;void 0!==e[1]&&(i.r=e[1]/100),void 0!==e[2]&&(i.g=e[2]/100),void 0!==e[3]&&(i.b=e[3]/100)}return void 0!==e[4]?i.alpha=Math.max(0,Math.min(1,e[4]/100)):void 0!==e[5]&&(i.alpha=Math.max(0,Math.min(1,+e[5]))),i},t=>_t(xt[t.toLowerCase()],6),t=>"transparent"===t?{mode:"rgb",r:0,g:0,b:0,alpha:0}:void 0,"srgb"],serialize:"srgb",interpolate:{r:Kt,g:Kt,b:Kt,alpha:{use:Kt,fixup:te}},gamut:!0,white:{r:1,g:1,b:1},black:{r:0,g:0,b:0}},ie=(t=0)=>Math.pow(Math.abs(t),563/256)*Math.sign(t),se=t=>{let e=ie(t.r),i=ie(t.g),s=ie(t.b),a={mode:"xyz65",x:.5766690429101305*e+.1855582379065463*i+.1882286462349947*s,y:.297344975250536*e+.6273635662554661*i+.0752914584939979*s,z:.0270313613864123*e+.0706888525358272*i+.9913375368376386*s};return void 0!==t.alpha&&(a.alpha=t.alpha),a},ae=t=>Math.pow(Math.abs(t),256/563)*Math.sign(t),re=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a={mode:"a98",r:ae(2.0415879038107465*t-.5650069742788597*e-.3447313507783297*i),g:ae(-.9692436362808798*t+1.8759675015077206*e+.0415550574071756*i),b:ae(.0134442806320312*t-.1183623922310184*e+1.0151749943912058*i)};return void 0!==s&&(a.alpha=s),a},oe=(t=0)=>{const e=Math.abs(t);return e<=.04045?t/12.92:(Math.sign(t)||1)*Math.pow((e+.055)/1.055,2.4)},ne=({r:t,g:e,b:i,alpha:s})=>{let a={mode:"lrgb",r:oe(t),g:oe(e),b:oe(i)};return void 0!==s&&(a.alpha=s),a},he=t=>{let{r:e,g:i,b:s,alpha:a}=ne(t),r={mode:"xyz65",x:.4123907992659593*e+.357584339383878*i+.1804807884018343*s,y:.2126390058715102*e+.715168678767756*i+.0721923153607337*s,z:.0193308187155918*e+.119194779794626*i+.9505321522496607*s};return void 0!==a&&(r.alpha=a),r},le=(t=0)=>{const e=Math.abs(t);return e>.0031308?(Math.sign(t)||1)*(1.055*Math.pow(e,1/2.4)-.055):12.92*t},ce=({r:t,g:e,b:i,alpha:s},a="rgb")=>{let r={mode:a,r:le(t),g:le(e),b:le(i)};return void 0!==s&&(r.alpha=s),r},de=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=ce({r:3.2409699419045226*t-1.537383177570094*e-.4986107602930034*i,g:-.9692436362808796*t+1.8759675015077204*e+.0415550574071756*i,b:.0556300796969936*t-.2039769588889765*e+1.0569715142428784*i});return void 0!==s&&(a.alpha=s),a},ue={...ee,mode:"a98",parse:["a98-rgb"],serialize:"a98-rgb",fromMode:{rgb:t=>re(he(t)),xyz65:re},toMode:{rgb:t=>de(se(t)),xyz65:se}},pe=t=>(t%=360)<0?t+360:t,ge=t=>((t,e)=>t.map(((i,s,a)=>{if(void 0===i)return i;let r=pe(i);return 0===s||void 0===t[s-1]?r:e(r-pe(a[s-1]))})).reduce(((t,e)=>t.length&&void 0!==e&&void 0!==t[t.length-1]?(t.push(e+t[t.length-1]),t):(t.push(e),t)),[]))(t,(t=>Math.abs(t)<=180?t:t-360*Math.sign(t))),me=[-.14861,1.78277,-.29227,-.90649,1.97294,0],fe=Math.PI/180,ye=180/Math.PI;let ve=me[3]*me[4],be=me[1]*me[4],_e=me[1]*me[2]-me[0]*me[3];const xe=(t,e)=>{if(void 0===t.h||void 0===e.h||!t.s||!e.s)return 0;let i=pe(t.h),s=pe(e.h),a=Math.sin((s-i+360)/2*Math.PI/180);return 2*Math.sqrt(t.s*e.s)*a},we=(t,e)=>{if(void 0===t.h||void 0===e.h||!t.c||!e.c)return 0;let i=pe(t.h),s=pe(e.h),a=Math.sin((s-i+360)/2*Math.PI/180);return 2*Math.sqrt(t.c*e.c)*a},$e=t=>{let e=t.reduce(((t,e)=>{if(void 0!==e){let i=e*Math.PI/180;t.sin+=Math.sin(i),t.cos+=Math.cos(i)}return t}),{sin:0,cos:0}),i=180*Math.atan2(e.sin,e.cos)/Math.PI;return i<0?360+i:i},ke={mode:"cubehelix",channels:["h","s","l","alpha"],parse:["--cubehelix"],serialize:"--cubehelix",ranges:{h:[0,360],s:[0,4.614],l:[0,1]},fromMode:{rgb:({r:t,g:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=(_e*i+t*ve-e*be)/(_e+ve-be),r=i-a,o=(me[4]*(e-a)-me[2]*r)/me[3],n={mode:"cubehelix",l:a,s:0===a||1===a?void 0:Math.sqrt(r*r+o*o)/(me[4]*a*(1-a))};return n.s&&(n.h=Math.atan2(o,r)*ye-120),void 0!==s&&(n.alpha=s),n}},toMode:{rgb:({h:t,s:e,l:i,alpha:s})=>{let a={mode:"rgb"};t=(void 0===t?0:t+120)*fe,void 0===i&&(i=0);let r=void 0===e?0:e*i*(1-i),o=Math.cos(t),n=Math.sin(t);return a.r=i+r*(me[0]*o+me[1]*n),a.g=i+r*(me[2]*o+me[3]*n),a.b=i+r*(me[4]*o+me[5]*n),void 0!==s&&(a.alpha=s),a}},interpolate:{h:{use:Kt,fixup:ge},s:Kt,l:Kt,alpha:{use:Kt,fixup:te}},difference:{h:xe},average:{h:$e}},Se=({l:t,a:e,b:i,alpha:s},a="lch")=>{void 0===e&&(e=0),void 0===i&&(i=0);let r=Math.sqrt(e*e+i*i),o={mode:a,l:t,c:r};return r&&(o.h=pe(180*Math.atan2(i,e)/Math.PI)),void 0!==s&&(o.alpha=s),o},Me=({l:t,c:e,h:i,alpha:s},a="lab")=>{void 0===i&&(i=0);let r={mode:a,l:t,a:e?e*Math.cos(i/180*Math.PI):0,b:e?e*Math.sin(i/180*Math.PI):0};return void 0!==s&&(r.alpha=s),r},Ae=Math.pow(29,3)/Math.pow(3,3),Te=Math.pow(6,3)/Math.pow(29,3),Ce=.3457/.3585,Ee=1,Ie=.2958/.3585,Ne=.3127/.329,Re=1,De=.3583/.329;let Pe=t=>Math.pow(t,3)>Te?Math.pow(t,3):(116*t-16)/Ae;const ze=({l:t,a:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=(t+16)/116,r=a-i/200,o={mode:"xyz65",x:Pe(e/500+a)*Ne,y:Pe(a)*Re,z:Pe(r)*De};return void 0!==s&&(o.alpha=s),o},Ge=t=>de(ze(t)),Be=t=>t>Te?Math.cbrt(t):(Ae*t+16)/116,Fe=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=Be(t/Ne),r=Be(e/Re),o={mode:"lab65",l:116*r-16,a:500*(a-r),b:200*(r-Be(i/De))};return void 0!==s&&(o.alpha=s),o},Le=t=>{let e=Fe(he(t));return t.r===t.b&&t.b===t.g&&(e.a=e.b=0),e},je=26/180*Math.PI,Oe=Math.cos(je),He=Math.sin(je),Ve=100/Math.log(1.39),Ue=({l:t,c:e,h:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a={mode:"lab65",l:(Math.exp(1*t/Ve)-1)/.0039},r=(Math.exp(.0435*e*1*1)-1)/.075,o=r*Math.cos(i/180*Math.PI-je),n=r*Math.sin(i/180*Math.PI-je);return a.a=o*Oe-n/.83*He,a.b=o*He+n/.83*Oe,void 0!==s&&(a.alpha=s),a},qe=({l:t,a:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=e*Oe+i*He,r=.83*(i*Oe-e*He),o=Math.sqrt(a*a+r*r),n={mode:"dlch",l:Ve/1*Math.log(1+.0039*t),c:Math.log(1+.075*o)/.0435};return n.c&&(n.h=pe((Math.atan2(r,a)+je)/Math.PI*180)),void 0!==s&&(n.alpha=s),n},Xe=t=>Ue(Se(t,"dlch")),Ye=t=>Me(qe(t),"dlab"),We={mode:"dlab",parse:["--din99o-lab"],serialize:"--din99o-lab",toMode:{lab65:Xe,rgb:t=>Ge(Xe(t))},fromMode:{lab65:Ye,rgb:t=>Ye(Le(t))},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-40.09,45.501],b:[-40.469,44.344]},interpolate:{l:Kt,a:Kt,b:Kt,alpha:{use:Kt,fixup:te}}},Je={mode:"dlch",parse:["--din99o-lch"],serialize:"--din99o-lch",toMode:{lab65:Ue,dlab:t=>Me(t,"dlab"),rgb:t=>Ge(Ue(t))},fromMode:{lab65:qe,dlab:t=>Se(t,"dlch"),rgb:t=>qe(Le(t))},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,51.484],h:[0,360]},interpolate:{l:Kt,c:Kt,h:{use:Kt,fixup:ge},alpha:{use:Kt,fixup:te}},difference:{h:we},average:{h:$e}};const Ze={mode:"hsi",toMode:{rgb:function({h:t,s:e,i:i,alpha:s}){t=pe(void 0!==t?t:0),void 0===e&&(e=0),void 0===i&&(i=0);let a,r=Math.abs(t/60%2-1);switch(Math.floor(t/60)){case 0:a={r:i*(1+e*(3/(2-r)-1)),g:i*(1+e*(3*(1-r)/(2-r)-1)),b:i*(1-e)};break;case 1:a={r:i*(1+e*(3*(1-r)/(2-r)-1)),g:i*(1+e*(3/(2-r)-1)),b:i*(1-e)};break;case 2:a={r:i*(1-e),g:i*(1+e*(3/(2-r)-1)),b:i*(1+e*(3*(1-r)/(2-r)-1))};break;case 3:a={r:i*(1-e),g:i*(1+e*(3*(1-r)/(2-r)-1)),b:i*(1+e*(3/(2-r)-1))};break;case 4:a={r:i*(1+e*(3*(1-r)/(2-r)-1)),g:i*(1-e),b:i*(1+e*(3/(2-r)-1))};break;case 5:a={r:i*(1+e*(3/(2-r)-1)),g:i*(1-e),b:i*(1+e*(3*(1-r)/(2-r)-1))};break;default:a={r:i*(1-e),g:i*(1-e),b:i*(1-e)}}return a.mode="rgb",void 0!==s&&(a.alpha=s),a}},parse:["--hsi"],serialize:"--hsi",fromMode:{rgb:function({r:t,g:e,b:i,alpha:s}){void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=Math.max(t,e,i),r=Math.min(t,e,i),o={mode:"hsi",s:t+e+i===0?0:1-3*r/(t+e+i),i:(t+e+i)/3};return a-r!=0&&(o.h=60*(a===t?(e-i)/(a-r)+6*(e<i):a===e?(i-t)/(a-r)+2:(t-e)/(a-r)+4)),void 0!==s&&(o.alpha=s),o}},channels:["h","s","i","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:Kt,fixup:ge},s:Kt,i:Kt,alpha:{use:Kt,fixup:te}},difference:{h:xe},average:{h:$e}};const Ke=new RegExp(`^hsla?\\(\\s*${Mt}${At}${kt}${At}${kt}\\s*(?:,\\s*${St}\\s*)?\\)$`);const Qe={mode:"hsl",toMode:{rgb:function({h:t,s:e,l:i,alpha:s}){t=pe(void 0!==t?t:0),void 0===e&&(e=0),void 0===i&&(i=0);let a,r=i+e*(i<.5?i:1-i),o=r-2*(r-i)*Math.abs(t/60%2-1);switch(Math.floor(t/60)){case 0:a={r:r,g:o,b:2*i-r};break;case 1:a={r:o,g:r,b:2*i-r};break;case 2:a={r:2*i-r,g:r,b:o};break;case 3:a={r:2*i-r,g:o,b:r};break;case 4:a={r:o,g:2*i-r,b:r};break;case 5:a={r:r,g:2*i-r,b:o};break;default:a={r:2*i-r,g:2*i-r,b:2*i-r}}return a.mode="rgb",void 0!==s&&(a.alpha=s),a}},fromMode:{rgb:function({r:t,g:e,b:i,alpha:s}){void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=Math.max(t,e,i),r=Math.min(t,e,i),o={mode:"hsl",s:a===r?0:(a-r)/(1-Math.abs(a+r-1)),l:.5*(a+r)};return a-r!=0&&(o.h=60*(a===t?(e-i)/(a-r)+6*(e<i):a===e?(i-t)/(a-r)+2:(t-e)/(a-r)+4)),void 0!==s&&(o.alpha=s),o}},channels:["h","s","l","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(t,e){if(!e||"hsl"!==e[0]&&"hsla"!==e[0])return;const i={mode:"hsl"},[,s,a,r,o]=e;if(s.type!==Lt.None){if(s.type===Lt.Percentage)return;i.h=s.value}if(a.type!==Lt.None){if(a.type===Lt.Hue)return;i.s=a.value/100}if(r.type!==Lt.None){if(r.type===Lt.Hue)return;i.l=r.value/100}return o.type!==Lt.None&&(i.alpha=Math.min(1,Math.max(0,o.type===Lt.Number?o.value:o.value/100))),i},t=>{let e=t.match(Ke);if(!e)return;let i={mode:"hsl"};return void 0!==e[3]?i.h=+e[3]:void 0!==e[1]&&void 0!==e[2]&&(i.h=((t,e)=>{switch(e){case"deg":return+t;case"rad":return t/Math.PI*180;case"grad":return t/10*9;case"turn":return 360*t}})(e[1],e[2])),void 0!==e[4]&&(i.s=Math.min(Math.max(0,e[4]/100),1)),void 0!==e[5]&&(i.l=Math.min(Math.max(0,e[5]/100),1)),void 0!==e[6]?i.alpha=Math.max(0,Math.min(1,e[6]/100)):void 0!==e[7]&&(i.alpha=Math.max(0,Math.min(1,+e[7]))),i}],serialize:t=>`hsl(${void 0!==t.h?t.h:"none"} ${void 0!==t.s?100*t.s+"%":"none"} ${void 0!==t.l?100*t.l+"%":"none"}${t.alpha<1?` / ${t.alpha}`:""})`,interpolate:{h:{use:Kt,fixup:ge},s:Kt,l:Kt,alpha:{use:Kt,fixup:te}},difference:{h:xe},average:{h:$e}};function ti({h:t,s:e,v:i,alpha:s}){t=pe(void 0!==t?t:0),void 0===e&&(e=0),void 0===i&&(i=0);let a,r=Math.abs(t/60%2-1);switch(Math.floor(t/60)){case 0:a={r:i,g:i*(1-e*r),b:i*(1-e)};break;case 1:a={r:i*(1-e*r),g:i,b:i*(1-e)};break;case 2:a={r:i*(1-e),g:i,b:i*(1-e*r)};break;case 3:a={r:i*(1-e),g:i*(1-e*r),b:i};break;case 4:a={r:i*(1-e*r),g:i*(1-e),b:i};break;case 5:a={r:i,g:i*(1-e),b:i*(1-e*r)};break;default:a={r:i*(1-e),g:i*(1-e),b:i*(1-e)}}return a.mode="rgb",void 0!==s&&(a.alpha=s),a}function ei({r:t,g:e,b:i,alpha:s}){void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=Math.max(t,e,i),r=Math.min(t,e,i),o={mode:"hsv",s:0===a?0:1-r/a,v:a};return a-r!=0&&(o.h=60*(a===t?(e-i)/(a-r)+6*(e<i):a===e?(i-t)/(a-r)+2:(t-e)/(a-r)+4)),void 0!==s&&(o.alpha=s),o}const ii={mode:"hsv",toMode:{rgb:ti},parse:["--hsv"],serialize:"--hsv",fromMode:{rgb:ei},channels:["h","s","v","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:Kt,fixup:ge},s:Kt,v:Kt,alpha:{use:Kt,fixup:te}},difference:{h:xe},average:{h:$e}};const si={mode:"hwb",toMode:{rgb:function({h:t,w:e,b:i,alpha:s}){if(void 0===e&&(e=0),void 0===i&&(i=0),e+i>1){let t=e+i;e/=t,i/=t}return ti({h:t,s:1===i?1:1-e/(1-i),v:1-i,alpha:s})}},fromMode:{rgb:function(t){let e=ei(t);if(void 0===e)return;let i=void 0!==e.s?e.s:0,s=void 0!==e.v?e.v:0,a={mode:"hwb",w:(1-i)*s,b:1-s};return void 0!==e.h&&(a.h=e.h),void 0!==e.alpha&&(a.alpha=e.alpha),a}},channels:["h","w","b","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(t,e){if(!e||"hwb"!==e[0])return;const i={mode:"hwb"},[,s,a,r,o]=e;if(s.type!==Lt.None){if(s.type===Lt.Percentage)return;i.h=s.value}if(a.type!==Lt.None){if(a.type===Lt.Hue)return;i.w=a.value/100}if(r.type!==Lt.None){if(r.type===Lt.Hue)return;i.b=r.value/100}return o.type!==Lt.None&&(i.alpha=Math.min(1,Math.max(0,o.type===Lt.Number?o.value:o.value/100))),i}],serialize:t=>`hwb(${void 0!==t.h?t.h:"none"} ${void 0!==t.w?100*t.w+"%":"none"} ${void 0!==t.b?100*t.b+"%":"none"}${t.alpha<1?` / ${t.alpha}`:""})`,interpolate:{h:{use:Kt,fixup:ge},w:Kt,b:Kt,alpha:{use:Kt,fixup:te}},difference:{h:(t,e)=>{if(void 0===t.h||void 0===e.h)return 0;let i=pe(t.h),s=pe(e.h);return Math.abs(s-i)>180?i-(s-360*Math.sign(s-i)):s-i}},average:{h:$e}},ai=.1593017578125,ri=78.84375,oi=.8359375,ni=18.8515625,hi=18.6875;function li(t){if(t<0)return 0;const e=Math.pow(t,1/ri);return 1e4*Math.pow(Math.max(0,e-oi)/(ni-hi*e),1/ai)}function ci(t){if(t<0)return 0;const e=Math.pow(t/1e4,ai);return Math.pow((oi+ni*e)/(1+hi*e),ri)}const di=t=>Math.max(t/203,0),ui=({i:t,t:e,p:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);const a=li(t+.008609037037932761*e+.11102962500302593*i),r=li(t-.00860903703793275*e-.11102962500302599*i),o=li(t+.5600313357106791*e-.32062717498731885*i),n={mode:"xyz65",x:di(2.070152218389422*a-1.3263473389671556*r+.2066510476294051*o),y:di(.3647385209748074*a+.680566024947227*r-.0453045459220346*o),z:di(-.049747207535812*a-.0492609666966138*r+1.1880659249923042*o)};return void 0!==s&&(n.alpha=s),n},pi=(t=0)=>Math.max(203*t,0),gi=({x:t,y:e,z:i,alpha:s})=>{const a=pi(t),r=pi(e),o=pi(i),n=ci(.3592832590121217*a+.6976051147779502*r-.0358915932320289*o),h=ci(-.1920808463704995*a+1.1004767970374323*r+.0753748658519118*o),l=ci(.0070797844607477*a+.0748396662186366*r+.8433265453898765*o),c={mode:"itp",i:.5*n+.5*h,t:1.61376953125*n-3.323486328125*h+1.709716796875*l,p:4.378173828125*n-4.24560546875*h-.132568359375*l};return void 0!==s&&(c.alpha=s),c},mi={mode:"itp",channels:["i","t","p","alpha"],parse:["--ictcp"],serialize:"--ictcp",toMode:{xyz65:ui,rgb:t=>de(ui(t))},fromMode:{xyz65:gi,rgb:t=>gi(he(t))},ranges:{i:[0,.581],t:[-.369,.272],p:[-.164,.331]},interpolate:{i:Kt,t:Kt,p:Kt,alpha:{use:Kt,fixup:te}}},fi=t=>{if(t<0)return 0;let e=Math.pow(t/1e4,ai);return Math.pow((oi+ni*e)/(1+hi*e),134.03437499999998)},yi=(t=0)=>Math.max(203*t,0),vi=({x:t,y:e,z:i,alpha:s})=>{t=yi(t),e=yi(e);let a=1.15*t-.15*(i=yi(i)),r=.66*e+.34*t,o=fi(.41478972*a+.579999*r+.014648*i),n=fi(-.20151*a+1.120649*r+.0531008*i),h=fi(-.0166008*a+.2648*r+.6684799*i),l=(o+n)/2,c={mode:"jab",j:.44*l/(1-.56*l)-16295499532821565e-27,a:3.524*o-4.066708*n+.542708*h,b:.199076*o+1.096799*n-1.295875*h};return void 0!==s&&(c.alpha=s),c},bi=16295499532821565e-27,_i=t=>{if(t<0)return 0;let e=Math.pow(t,.007460772656268216);return 1e4*Math.pow((oi-e)/(hi*e-ni),1/ai)},xi=t=>t/203,wi=({j:t,a:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=(t+bi)/(.44+.56*(t+bi)),r=_i(a+.13860504*e+.058047316*i),o=_i(a-.13860504*e-.058047316*i),n=_i(a-.096019242*e-.8118919*i),h={mode:"xyz65",x:xi(1.661373024652174*r-.914523081304348*o+.23136208173913045*n),y:xi(-.3250758611844533*r+1.571847026732543*o-.21825383453227928*n),z:xi(-.090982811*r-.31272829*o+1.5227666*n)};return void 0!==s&&(h.alpha=s),h},$i=t=>{let e=vi(he(t));return t.r===t.b&&t.b===t.g&&(e.a=e.b=0),e},ki=t=>de(wi(t)),Si={mode:"jab",channels:["j","a","b","alpha"],parse:["--jzazbz"],serialize:"--jzazbz",fromMode:{rgb:$i,xyz65:vi},toMode:{rgb:ki,xyz65:wi},ranges:{j:[0,.222],a:[-.109,.129],b:[-.185,.134]},interpolate:{j:Kt,a:Kt,b:Kt,alpha:{use:Kt,fixup:te}}},Mi=({j:t,a:e,b:i,alpha:s})=>{void 0===e&&(e=0),void 0===i&&(i=0);let a=Math.sqrt(e*e+i*i),r={mode:"jch",j:t,c:a};return a&&(r.h=pe(180*Math.atan2(i,e)/Math.PI)),void 0!==s&&(r.alpha=s),r},Ai=({j:t,c:e,h:i,alpha:s})=>{void 0===i&&(i=0);let a={mode:"jab",j:t,a:e?e*Math.cos(i/180*Math.PI):0,b:e?e*Math.sin(i/180*Math.PI):0};return void 0!==s&&(a.alpha=s),a},Ti={mode:"jch",parse:["--jzczhz"],serialize:"--jzczhz",toMode:{jab:Ai,rgb:t=>ki(Ai(t))},fromMode:{rgb:t=>Mi($i(t)),jab:Mi},channels:["j","c","h","alpha"],ranges:{j:[0,.221],c:[0,.19],h:[0,360]},interpolate:{h:{use:Kt,fixup:ge},c:Kt,j:Kt,alpha:{use:Kt,fixup:te}},difference:{h:we},average:{h:$e}},Ci=Math.pow(29,3)/Math.pow(3,3),Ei=Math.pow(6,3)/Math.pow(29,3);let Ii=t=>Math.pow(t,3)>Ei?Math.pow(t,3):(116*t-16)/Ci;const Ni=({l:t,a:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=(t+16)/116,r=a-i/200,o={mode:"xyz50",x:Ii(e/500+a)*Ce,y:Ii(a)*Ee,z:Ii(r)*Ie};return void 0!==s&&(o.alpha=s),o},Ri=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=ce({r:3.1341359569958707*t-1.6173863321612538*e-.4906619460083532*i,g:-.978795502912089*t+1.916254567259524*e+.03344273116131949*i,b:.07195537988411677*t-.2289768264158322*e+1.405386058324125*i});return void 0!==s&&(a.alpha=s),a},Di=t=>Ri(Ni(t)),Pi=t=>{let{r:e,g:i,b:s,alpha:a}=ne(t),r={mode:"xyz50",x:.436065742824811*e+.3851514688337912*i+.14307845442264197*s,y:.22249319175623702*e+.7168870538238823*i+.06061979053616537*s,z:.013923904500943465*e+.09708128566574634*i+.7140993584005155*s};return void 0!==a&&(r.alpha=a),r},zi=t=>t>Ei?Math.cbrt(t):(Ci*t+16)/116,Gi=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=zi(t/Ce),r=zi(e/Ee),o={mode:"lab",l:116*r-16,a:500*(a-r),b:200*(r-zi(i/Ie))};return void 0!==s&&(o.alpha=s),o},Bi=t=>{let e=Gi(Pi(t));return t.r===t.b&&t.b===t.g&&(e.a=e.b=0),e};const Fi={mode:"lab",toMode:{xyz50:Ni,rgb:Di},fromMode:{xyz50:Gi,rgb:Bi},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-125,125],b:[-125,125]},parse:[function(t,e){if(!e||"lab"!==e[0])return;const i={mode:"lab"},[,s,a,r,o]=e;return s.type!==Lt.Hue&&a.type!==Lt.Hue&&r.type!==Lt.Hue?(s.type!==Lt.None&&(i.l=Math.min(Math.max(0,s.value),100)),a.type!==Lt.None&&(i.a=a.type===Lt.Number?a.value:125*a.value/100),r.type!==Lt.None&&(i.b=r.type===Lt.Number?r.value:125*r.value/100),o.type!==Lt.None&&(i.alpha=Math.min(1,Math.max(0,o.type===Lt.Number?o.value:o.value/100))),i):void 0}],serialize:t=>`lab(${void 0!==t.l?t.l:"none"} ${void 0!==t.a?t.a:"none"} ${void 0!==t.b?t.b:"none"}${t.alpha<1?` / ${t.alpha}`:""})`,interpolate:{l:Kt,a:Kt,b:Kt,alpha:{use:Kt,fixup:te}}},Li={...Fi,mode:"lab65",parse:["--lab-d65"],serialize:"--lab-d65",toMode:{xyz65:ze,rgb:Ge},fromMode:{xyz65:Fe,rgb:Le},ranges:{l:[0,100],a:[-125,125],b:[-125,125]}};const ji={mode:"lch",toMode:{lab:Me,rgb:t=>Di(Me(t))},fromMode:{rgb:t=>Se(Bi(t)),lab:Se},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,150],h:[0,360]},parse:[function(t,e){if(!e||"lch"!==e[0])return;const i={mode:"lch"},[,s,a,r,o]=e;if(s.type!==Lt.None){if(s.type===Lt.Hue)return;i.l=Math.min(Math.max(0,s.value),100)}if(a.type!==Lt.None&&(i.c=Math.max(0,a.type===Lt.Number?a.value:150*a.value/100)),r.type!==Lt.None){if(r.type===Lt.Percentage)return;i.h=r.value}return o.type!==Lt.None&&(i.alpha=Math.min(1,Math.max(0,o.type===Lt.Number?o.value:o.value/100))),i}],serialize:t=>`lch(${void 0!==t.l?t.l:"none"} ${void 0!==t.c?t.c:"none"} ${void 0!==t.h?t.h:"none"}${t.alpha<1?` / ${t.alpha}`:""})`,interpolate:{h:{use:Kt,fixup:ge},c:Kt,l:Kt,alpha:{use:Kt,fixup:te}},difference:{h:we},average:{h:$e}},Oi={...ji,mode:"lch65",parse:["--lch-d65"],serialize:"--lch-d65",toMode:{lab65:t=>Me(t,"lab65"),rgb:t=>Ge(Me(t,"lab65"))},fromMode:{rgb:t=>Se(Le(t),"lch65"),lab65:t=>Se(t,"lch65")},ranges:{l:[0,100],c:[0,150],h:[0,360]}},Hi=({l:t,u:e,v:i,alpha:s})=>{void 0===e&&(e=0),void 0===i&&(i=0);let a=Math.sqrt(e*e+i*i),r={mode:"lchuv",l:t,c:a};return a&&(r.h=pe(180*Math.atan2(i,e)/Math.PI)),void 0!==s&&(r.alpha=s),r},Vi=({l:t,c:e,h:i,alpha:s})=>{void 0===i&&(i=0);let a={mode:"luv",l:t,u:e?e*Math.cos(i/180*Math.PI):0,v:e?e*Math.sin(i/180*Math.PI):0};return void 0!==s&&(a.alpha=s),a},Ui=(t,e,i)=>4*t/(t+15*e+3*i),qi=(t,e,i)=>9*e/(t+15*e+3*i),Xi=Ui(Ce,Ee,Ie),Yi=qi(Ce,Ee,Ie),Wi=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=(r=e/Ee)<=Ei?Ci*r:116*Math.cbrt(r)-16;var r;let o=Ui(t,e,i),n=qi(t,e,i);isFinite(o)&&isFinite(n)?(o=13*a*(o-Xi),n=13*a*(n-Yi)):a=o=n=0;let h={mode:"luv",l:a,u:o,v:n};return void 0!==s&&(h.alpha=s),h},Ji=((t,e,i)=>4*t/(t+15*e+3*i))(Ce,Ee,Ie),Zi=((t,e,i)=>9*e/(t+15*e+3*i))(Ce,Ee,Ie),Ki=({l:t,u:e,v:i,alpha:s})=>{if(void 0===t&&(t=0),0===t)return{mode:"xyz50",x:0,y:0,z:0};void 0===e&&(e=0),void 0===i&&(i=0);let a=e/(13*t)+Ji,r=i/(13*t)+Zi,o=Ee*(t<=8?t/Ci:Math.pow((t+16)/116,3)),n={mode:"xyz50",x:o*(9*a)/(4*r),y:o,z:o*(12-3*a-20*r)/(4*r)};return void 0!==s&&(n.alpha=s),n},Qi={mode:"lchuv",toMode:{luv:Vi,rgb:t=>Ri(Ki(Vi(t)))},fromMode:{rgb:t=>Hi(Wi(Pi(t))),luv:Hi},channels:["l","c","h","alpha"],parse:["--lchuv"],serialize:"--lchuv",ranges:{l:[0,100],c:[0,176.956],h:[0,360]},interpolate:{h:{use:Kt,fixup:ge},c:Kt,l:Kt,alpha:{use:Kt,fixup:te}},difference:{h:we},average:{h:$e}},ts={...ee,mode:"lrgb",toMode:{rgb:ce},fromMode:{rgb:ne},parse:["srgb-linear"],serialize:"srgb-linear"},es={mode:"luv",toMode:{xyz50:Ki,rgb:t=>Ri(Ki(t))},fromMode:{xyz50:Wi,rgb:t=>Wi(Pi(t))},channels:["l","u","v","alpha"],parse:["--luv"],serialize:"--luv",ranges:{l:[0,100],u:[-84.936,175.042],v:[-125.882,87.243]},interpolate:{l:Kt,u:Kt,v:Kt,alpha:{use:Kt,fixup:te}}},is=({r:t,g:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=Math.cbrt(.412221469470763*t+.5363325372617348*e+.0514459932675022*i),r=Math.cbrt(.2119034958178252*t+.6806995506452344*e+.1073969535369406*i),o=Math.cbrt(.0883024591900564*t+.2817188391361215*e+.6299787016738222*i),n={mode:"oklab",l:.210454268309314*a+.7936177747023054*r-.0040720430116193*o,a:1.9779985324311684*a-2.42859224204858*r+.450593709617411*o,b:.0259040424655478*a+.7827717124575296*r-.8086757549230774*o};return void 0!==s&&(n.alpha=s),n},ss=t=>{let e=is(ne(t));return t.r===t.b&&t.b===t.g&&(e.a=e.b=0),e},as=({l:t,a:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=Math.pow(t+.3963377773761749*e+.2158037573099136*i,3),r=Math.pow(t-.1055613458156586*e-.0638541728258133*i,3),o=Math.pow(t-.0894841775298119*e-1.2914855480194092*i,3),n={mode:"lrgb",r:4.076741636075957*a-3.3077115392580616*r+.2309699031821044*o,g:-1.2684379732850317*a+2.6097573492876887*r-.3413193760026573*o,b:-.0041960761386756*a-.7034186179359362*r+1.7076146940746117*o};return void 0!==s&&(n.alpha=s),n},rs=t=>ce(as(t));function os(t){const e=.206,i=1.206/1.03;return.5*(i*t-e+Math.sqrt((i*t-e)*(i*t-e)+.12*i*t))}function ns(t){return(t*t+.206*t)/(1.206/1.03*(t+.03))}function hs(t,e){let i=function(t,e){let i,s,a,r,o,n,h,l;-1.88170328*t-.80936493*e>1?(i=1.19086277,s=1.76576728,a=.59662641,r=.75515197,o=.56771245,n=4.0767416621,h=-3.3077115913,l=.2309699292):1.81444104*t-1.19445276*e>1?(i=.73956515,s=-.45954404,a=.08285427,r=.1254107,o=.14503204,n=-1.2684380046,h=2.6097574011,l=-.3413193965):(i=1.35733652,s=-.00915799,a=-1.1513021,r=-.50559606,o=.00692167,n=-.0041960863,h=-.7034186147,l=1.707614701);let c=i+s*t+a*e+r*t*t+o*t*e,d=.3963377774*t+.2158037573*e,u=-.1055613458*t-.0638541728*e,p=-.0894841775*t-1.291485548*e;{let t=1+c*d,e=1+c*u,i=1+c*p,s=n*(t*t*t)+h*(e*e*e)+l*(i*i*i),a=n*(3*d*t*t)+h*(3*u*e*e)+l*(3*p*i*i);c-=s*a/(a*a-.5*s*(n*(6*d*d*t)+h*(6*u*u*e)+l*(6*p*p*i)))}return c}(t,e),s=as({l:1,a:i*t,b:i*e}),a=Math.cbrt(1/Math.max(s.r,s.g,s.b));return[a,a*i]}function ls(t,e,i=null){i||(i=hs(t,e));let s=i[0],a=i[1];return[a/s,a/(1-s)]}function cs(t,e,i){let s=hs(e,i),a=function(t,e,i,s,a,r=null){let o;if(r||(r=hs(t,e)),(i-a)*r[1]-(r[0]-a)*s<=0)o=r[1]*a/(s*r[0]+r[1]*(a-i));else{o=r[1]*(a-1)/(s*(r[0]-1)+r[1]*(a-i));{let r=i-a,n=.3963377774*t+.2158037573*e,h=-.1055613458*t-.0638541728*e,l=-.0894841775*t-1.291485548*e,c=r+s*n,d=r+s*h,u=r+s*l;{let t=a*(1-o)+o*i,e=o*s,r=t+e*n,p=t+e*h,g=t+e*l,m=r*r*r,f=p*p*p,y=g*g*g,v=3*c*r*r,b=3*d*p*p,_=3*u*g*g,x=6*c*c*r,w=6*d*d*p,$=6*u*u*g,k=4.0767416621*m-3.3077115913*f+.2309699292*y-1,S=4.0767416621*v-3.3077115913*b+.2309699292*_,M=S/(S*S-.5*k*(4.0767416621*x-3.3077115913*w+.2309699292*$)),A=-k*M,T=-1.2684380046*m+2.6097574011*f-.3413193965*y-1,C=-1.2684380046*v+2.6097574011*b-.3413193965*_,E=C/(C*C-.5*T*(-1.2684380046*x+2.6097574011*w-.3413193965*$)),I=-T*E,N=-.0041960863*m-.7034186147*f+1.707614701*y-1,R=-.0041960863*v-.7034186147*b+1.707614701*_,D=R/(R*R-.5*N*(-.0041960863*x-.7034186147*w+1.707614701*$)),P=-N*D;A=M>=0?A:1e6,I=E>=0?I:1e6,P=D>=0?P:1e6,o+=Math.min(A,Math.min(I,P))}}}return o}(e,i,t,1,t,s),r=ls(e,i,s),o=t*(.11516993+1/(7.4477897+4.1590124*i+e*(1.75198401*i-2.19557347+e*(-2.13704948-10.02301043*i+e*(5.38770819*i-4.24894561+4.69891013*e))))),n=(1-t)*(.11239642+1/(1.6132032-.68124379*i+e*(.40370612+.90148123*i+e*(.6122399*i-.27087943+e*(.00299215-.45399568*i-.14661872*e))))),h=.9*(a/Math.min(t*r[0],(1-t)*r[1]))*Math.sqrt(Math.sqrt(1/(1/(o*o*o*o)+1/(n*n*n*n))));return o=.4*t,n=.8*(1-t),[Math.sqrt(1/(1/(o*o)+1/(n*n))),h,a]}function ds(t){const e=void 0!==t.l?t.l:0,i=void 0!==t.a?t.a:0,s=void 0!==t.b?t.b:0,a={mode:"okhsl",l:os(e)};void 0!==t.alpha&&(a.alpha=t.alpha);let r=Math.sqrt(i*i+s*s);if(!r)return a.s=0,a;let o,[n,h,l]=cs(e,i/r,s/r);if(r<h){let t=0,e=.8*n;o=.8*((r-t)/(e+(1-e/h)*(r-t)))}else{let t=.2*h*h*1.25*1.25/n;o=.8+.2*((r-h)/(t+(1-t/(l-h))*(r-h)))}return o&&(a.s=o,a.h=pe(180*Math.atan2(s,i)/Math.PI)),a}function us(t){let e=void 0!==t.h?t.h:0,i=void 0!==t.s?t.s:0,s=void 0!==t.l?t.l:0;const a={mode:"oklab",l:ns(s)};if(void 0!==t.alpha&&(a.alpha=t.alpha),!i||1===s)return a.a=a.b=0,a;let r,o,n,h,l=Math.cos(e/180*Math.PI),c=Math.sin(e/180*Math.PI),[d,u,p]=cs(a.l,l,c);i<.8?(r=1.25*i,o=0,n=.8*d,h=1-n/u):(r=5*(i-.8),o=u,n=.2*u*u*1.25*1.25/d,h=1-n/(p-u));let g=o+r*n/(1-h*r);return a.a=g*l,a.b=g*c,a}const ps={...Qe,mode:"okhsl",channels:["h","s","l","alpha"],parse:["--okhsl"],serialize:"--okhsl",fromMode:{oklab:ds,rgb:t=>ds(ss(t))},toMode:{oklab:us,rgb:t=>rs(us(t))}};function gs(t){let e=void 0!==t.l?t.l:0,i=void 0!==t.a?t.a:0,s=void 0!==t.b?t.b:0,a=Math.sqrt(i*i+s*s),r=a?i/a:1,o=a?s/a:1,[n,h]=ls(r,o),l=1-.5/n,c=h/(a+e*h),d=c*e,u=c*a,p=ns(d),g=u*p/d,m=as({l:p,a:r*g,b:o*g}),f=Math.cbrt(1/Math.max(m.r,m.g,m.b,0));e/=f,a=a/f*os(e)/e,e=os(e);const y={mode:"okhsv",s:a?(.5+h)*u/(.5*h+h*l*u):0,v:e?e/d:0};return y.s&&(y.h=pe(180*Math.atan2(s,i)/Math.PI)),void 0!==t.alpha&&(y.alpha=t.alpha),y}function ms(t){const e={mode:"oklab"};void 0!==t.alpha&&(e.alpha=t.alpha);const i=void 0!==t.h?t.h:0,s=void 0!==t.s?t.s:0,a=void 0!==t.v?t.v:0,r=Math.cos(i/180*Math.PI),o=Math.sin(i/180*Math.PI),[n,h]=ls(r,o),l=.5,c=1-l/n,d=1-s*l/(l+h-h*c*s),u=s*h*l/(l+h-h*c*s),p=ns(d),g=u*p/d,m=as({l:p,a:r*g,b:o*g}),f=Math.cbrt(1/Math.max(m.r,m.g,m.b,0)),y=ns(a*d),v=u*y/d;return e.l=y*f,e.a=v*r*f,e.b=v*o*f,e}const fs={...ii,mode:"okhsv",channels:["h","s","v","alpha"],parse:["--okhsv"],serialize:"--okhsv",fromMode:{oklab:gs,rgb:t=>gs(ss(t))},toMode:{oklab:ms,rgb:t=>rs(ms(t))}};const ys={...Fi,mode:"oklab",toMode:{lrgb:as,rgb:rs},fromMode:{lrgb:is,rgb:ss},ranges:{l:[0,1],a:[-.4,.4],b:[-.4,.4]},parse:[function(t,e){if(!e||"oklab"!==e[0])return;const i={mode:"oklab"},[,s,a,r,o]=e;return s.type!==Lt.Hue&&a.type!==Lt.Hue&&r.type!==Lt.Hue?(s.type!==Lt.None&&(i.l=Math.min(Math.max(0,s.type===Lt.Number?s.value:s.value/100),1)),a.type!==Lt.None&&(i.a=a.type===Lt.Number?a.value:.4*a.value/100),r.type!==Lt.None&&(i.b=r.type===Lt.Number?r.value:.4*r.value/100),o.type!==Lt.None&&(i.alpha=Math.min(1,Math.max(0,o.type===Lt.Number?o.value:o.value/100))),i):void 0}],serialize:t=>`oklab(${void 0!==t.l?t.l:"none"} ${void 0!==t.a?t.a:"none"} ${void 0!==t.b?t.b:"none"}${t.alpha<1?` / ${t.alpha}`:""})`};const vs={...ji,mode:"oklch",toMode:{oklab:t=>Me(t,"oklab"),rgb:t=>rs(Me(t,"oklab"))},fromMode:{rgb:t=>Se(ss(t),"oklch"),oklab:t=>Se(t,"oklch")},parse:[function(t,e){if(!e||"oklch"!==e[0])return;const i={mode:"oklch"},[,s,a,r,o]=e;if(s.type!==Lt.None){if(s.type===Lt.Hue)return;i.l=Math.min(Math.max(0,s.type===Lt.Number?s.value:s.value/100),1)}if(a.type!==Lt.None&&(i.c=Math.max(0,a.type===Lt.Number?a.value:.4*a.value/100)),r.type!==Lt.None){if(r.type===Lt.Percentage)return;i.h=r.value}return o.type!==Lt.None&&(i.alpha=Math.min(1,Math.max(0,o.type===Lt.Number?o.value:o.value/100))),i}],serialize:t=>`oklch(${void 0!==t.l?t.l:"none"} ${void 0!==t.c?t.c:"none"} ${void 0!==t.h?t.h:"none"}${t.alpha<1?` / ${t.alpha}`:""})`,ranges:{l:[0,1],c:[0,.4],h:[0,360]}},bs=t=>{let{r:e,g:i,b:s,alpha:a}=ne(t),r={mode:"xyz65",x:.486570948648216*e+.265667693169093*i+.1982172852343625*s,y:.2289745640697487*e+.6917385218365062*i+.079286914093745*s,z:0*e+.0451133818589026*i+1.043944368900976*s};return void 0!==a&&(r.alpha=a),r},_s=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=ce({r:2.4934969119414263*t-.9313836179191242*e-.402710784450717*i,g:-.8294889695615749*t+1.7626640603183465*e+.0236246858419436*i,b:.0358458302437845*t-.0761723892680418*e+.9568845240076871*i},"p3");return void 0!==s&&(a.alpha=s),a},xs={...ee,mode:"p3",parse:["display-p3"],serialize:"display-p3",fromMode:{rgb:t=>_s(he(t)),xyz65:_s},toMode:{rgb:t=>de(bs(t)),xyz65:bs}},ws=t=>{let e=Math.abs(t);return e>=1/512?Math.sign(t)*Math.pow(e,1/1.8):16*t},$s=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a={mode:"prophoto",r:ws(1.3457868816471585*t-.2555720873797946*e-.0511018649755453*i),g:ws(-.5446307051249019*t+1.5082477428451466*e+.0205274474364214*i),b:ws(0*t+0*e+1.2119675456389452*i)};return void 0!==s&&(a.alpha=s),a},ks=(t=0)=>{let e=Math.abs(t);return e>=16/512?Math.sign(t)*Math.pow(e,1.8):t/16},Ss=t=>{let e=ks(t.r),i=ks(t.g),s=ks(t.b),a={mode:"xyz50",x:.7977666449006423*e+.1351812974005331*i+.0313477341283922*s,y:.2880748288194013*e+.7118352342418731*i+899369387256e-16*s,z:0*e+0*i+.8251046025104602*s};return void 0!==t.alpha&&(a.alpha=t.alpha),a},Ms={...ee,mode:"prophoto",parse:["prophoto-rgb"],serialize:"prophoto-rgb",fromMode:{xyz50:$s,rgb:t=>$s(Pi(t))},toMode:{xyz50:Ss,rgb:t=>Ri(Ss(t))}},As=1.09929682680944,Ts=t=>{const e=Math.abs(t);return e>.018053968510807?(Math.sign(t)||1)*(As*Math.pow(e,.45)-(As-1)):4.5*t},Cs=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a={mode:"rec2020",r:Ts(1.7166511879712683*t-.3556707837763925*e-.2533662813736599*i),g:Ts(-.6666843518324893*t+1.6164812366349395*e+.0157685458139111*i),b:Ts(.0176398574453108*t-.0427706132578085*e+.9421031212354739*i)};return void 0!==s&&(a.alpha=s),a},Es=1.09929682680944,Is=(t=0)=>{let e=Math.abs(t);return e<.08124285829863151?t/4.5:(Math.sign(t)||1)*Math.pow((e+Es-1)/Es,1/.45)},Ns=t=>{let e=Is(t.r),i=Is(t.g),s=Is(t.b),a={mode:"xyz65",x:.6369580483012911*e+.1446169035862083*i+.1688809751641721*s,y:.262700212011267*e+.6779980715188708*i+.059301716469862*s,z:0*e+.0280726930490874*i+1.0609850577107909*s};return void 0!==t.alpha&&(a.alpha=t.alpha),a},Rs={...ee,mode:"rec2020",fromMode:{xyz65:Cs,rgb:t=>Cs(he(t))},toMode:{xyz65:Ns,rgb:t=>de(Ns(t))},parse:["rec2020"],serialize:"rec2020"},Ds=.0037930732552754493,Ps=Math.cbrt(Ds),zs=t=>Math.cbrt(t)-Ps,Gs=t=>Math.pow(t+Ps,3),Bs={mode:"xyb",channels:["x","y","b","alpha"],parse:["--xyb"],serialize:"--xyb",toMode:{rgb:({x:t,y:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);const a=Gs(t+e)-Ds,r=Gs(e-t)-Ds,o=Gs(i+e)-Ds,n=ce({r:11.031566904639861*a-9.866943908131562*r-.16462299650829934*o,g:-3.2541473810744237*a+4.418770377582723*r-.16462299650829934*o,b:-3.6588512867136815*a+2.7129230459360922*r+1.9459282407775895*o});return void 0!==s&&(n.alpha=s),n}},fromMode:{rgb:t=>{const{r:e,g:i,b:s,alpha:a}=ne(t),r=zs(.3*e+.622*i+.078*s+Ds),o=zs(.23*e+.692*i+.078*s+Ds),n={mode:"xyb",x:(r-o)/2,y:(r+o)/2,b:zs(.2434226892454782*e+.2047674442449682*i+.5518098665095535*s+Ds)-(r+o)/2};return void 0!==a&&(n.alpha=a),n}},ranges:{x:[-.0154,.0281],y:[0,.8453],b:[-.2778,.388]},interpolate:{x:Kt,y:Kt,b:Kt,alpha:{use:Kt,fixup:te}}},Fs={mode:"xyz50",parse:["xyz-d50"],serialize:"xyz-d50",toMode:{rgb:Ri,lab:Gi},fromMode:{rgb:Pi,lab:Ni},channels:["x","y","z","alpha"],ranges:{x:[0,.964],y:[0,.999],z:[0,.825]},interpolate:{x:Kt,y:Kt,z:Kt,alpha:{use:Kt,fixup:te}}},Ls={mode:"xyz65",toMode:{rgb:de,xyz50:t=>{let{x:e,y:i,z:s,alpha:a}=t;void 0===e&&(e=0),void 0===i&&(i=0),void 0===s&&(s=0);let r={mode:"xyz50",x:1.0479298208405488*e+.0229467933410191*i-.0501922295431356*s,y:.0296278156881593*e+.990434484573249*i-.0170738250293851*s,z:-.0092430581525912*e+.0150551448965779*i+.7518742899580008*s};return void 0!==a&&(r.alpha=a),r}},fromMode:{rgb:he,xyz50:t=>{let{x:e,y:i,z:s,alpha:a}=t;void 0===e&&(e=0),void 0===i&&(i=0),void 0===s&&(s=0);let r={mode:"xyz65",x:.9554734527042182*e-.0230985368742614*i+.0632593086610217*s,y:-.0283697069632081*e+1.0099954580058226*i+.021041398966943*s,z:.0123140016883199*e-.0205076964334779*i+1.3303659366080753*s};return void 0!==a&&(r.alpha=a),r}},ranges:{x:[0,.95],y:[0,1],z:[0,1.088]},channels:["x","y","z","alpha"],parse:["xyz","xyz-d65"],serialize:"xyz-d65",interpolate:{x:Kt,y:Kt,z:Kt,alpha:{use:Kt,fixup:te}}},js={mode:"yiq",toMode:{rgb:({y:t,i:e,q:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);const a={mode:"rgb",r:t+.95608445*e+.6208885*i,g:t-.27137664*e-.6486059*i,b:t-1.10561724*e+1.70250126*i};return void 0!==s&&(a.alpha=s),a}},fromMode:{rgb:({r:t,g:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);const a={mode:"yiq",y:.29889531*t+.58662247*e+.11448223*i,i:.59597799*t-.2741761*e-.32180189*i,q:.21147017*t-.52261711*e+.31114694*i};return void 0!==s&&(a.alpha=s),a}},channels:["y","i","q","alpha"],parse:["--yiq"],serialize:"--yiq",ranges:{i:[-.595,.595],q:[-.522,.522]},interpolate:{y:Kt,i:Kt,q:Kt,alpha:{use:Kt,fixup:te}}};let Os=((t=4)=>e=>"number"==typeof e?((t,e)=>Math.round(t*(e=Math.pow(10,e)))/e)(e,t):e)(2);const Hs=t=>Math.max(0,Math.min(1,t||0)),Vs=t=>Math.round(255*Hs(t)),Us=Et("rgb"),qs=t=>(t=>{if(void 0===t)return;let e=Vs(t.r),i=Vs(t.g),s=Vs(t.b);return void 0===t.alpha||1===t.alpha?`rgb(${e}, ${i}, ${s})`:`rgba(${e}, ${i}, ${s}, ${Os(Hs(t.alpha))})`})(Us(t));zt(ue),zt(ke),zt(We),zt(Je),zt(Ze),zt(Qe),zt(ii),zt(si),zt(mi),zt(Si),zt(Ti),zt(Fi),zt(Li),zt(ji),zt(Oi),zt(Qi),zt(ts),zt(es),zt(ps),zt(fs),zt(ys),zt(vs),zt(xs),zt(Ms),zt(Rs),zt(ee),zt(Bs),zt(Fs),zt(Ls),zt(js);const Xs=t=>{const e=Math.round(Math.min(Math.max(t,0),255)).toString(16);return 1===e.length?`0${e}`:e},Ys=t=>`#${Xs(t[0])}${Xs(t[1])}${Xs(t[2])}`,Ws=t=>{const[e,i,s]=t,a=Math.max(e,i,s),r=a-Math.min(e,i,s),o=r&&(a===e?(i-s)/r:a===i?2+(s-e)/r:4+(e-i)/r);return[60*(o<0?o+6:o),a&&r/a,a]},Js=t=>{const[e,i,s]=t,a=t=>{const a=(t+e/60)%6;return s-s*i*Math.max(Math.min(a,4-a,1),0)};return[a(5),a(3),a(1)]},Zs=t=>Js([t[0],t[1],255]),Ks=(t,e,i)=>Math.min(Math.max(t,e),i),Qs=t=>{const e=t/100;return[Math.round(ta(e)),Math.round(ea(e)),Math.round(ia(e))]},ta=t=>{if(t<=66)return 255;return Ks(329.698727446*(t-60)**-.1332047592,0,255)},ea=t=>{let e;return e=t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*(t-60)**-.0755148492,Ks(e,0,255)},ia=t=>{if(t>=66)return 255;if(t<=19)return 0;const e=138.5177312231*Math.log(t-10)-305.0447927307;return Ks(e,0,255)},sa=(t,e)=>{const i=Math.max(...t),s=Math.max(...e);let a;return a=0===s?0:i/s,e.map((t=>Math.round(t*a)))},aa=t=>0===t?1e6:Math.floor(1e6/t),ra=(t,e,i)=>{const[s,a,r,o,n]=t,h=aa(e??2700),l=aa(i??6500),c=h-l;let d;try{d=n/(o+n)}catch(b){d=.5}const u=l+d*c,p=u?0===(g=u)?1e6:Math.floor(1e6/g):0;var g;const[m,f,y]=Qs(p),v=Math.max(o,n)/255;return sa([s,a,r,o,n],[s+m*v,a+f*v,r+y*v])},oa=t=>bt(t.entity_id),na="unavailable",ha="unknown",la=(ca=[na,ha],(t,e)=>ca.includes(t,e));var ca;const da=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater","weather"]),ua=(t,e)=>{if((void 0!==e?e:t?.state)===na)return"var(--state-unavailable-color)";const i=ma(t,e);return i?(s=i,Array.isArray(s)?s.reverse().reduce(((t,e)=>`var(${e}${t?`, ${t}`:""})`),void 0):`var(${s})`):void 0;var s},pa=(t,e,i)=>{const s=void 0!==i?i:e.state,a=function(t,e){const i=bt(t.entity_id),s=void 0!==e?e:t?.state;if(["button","event","infrared","input_button","radio_frequency","scene"].includes(i))return s!==na;if(la(s))return!1;if("off"===s&&"alert"!==i)return!1;switch(i){case"alarm_control_panel":return"disarmed"!==s;case"alert":return"idle"!==s;case"cover":case"valve":return"closed"!==s;case"device_tracker":case"person":return"not_home"!==s;case"lawn_mower":return!["docked","paused"].includes(s);case"lock":return"locked"!==s;case"media_player":return"standby"!==s;case"vacuum":return!["idle","docked","paused"].includes(s);case"plant":return"problem"===s;case"group":return["on","home","open","locked","problem"].includes(s);case"timer":return"active"===s;case"camera":return"streaming"===s}return!0}(e,i);return ga(t,e.attributes.device_class,s,a)},ga=(t,e,i,s)=>{const a=[],r=((t,e="_")=>{const i="àáâäæãåāăąабçćčđďдèéêëēėęěеёэфğǵгḧхîïíīįìıİийкłлḿмñńǹňнôöòóœøōõőоṕпŕřрßśšşșсťțтûüùúūǘůűųувẃẍÿýыžźżз·",s=`aaaaaaaaaaabcccdddeeeeeeeeeeefggghhiiiiiiiiijkllmmnnnnnoooooooooopprrrsssssstttuuuuuuuuuuvwxyyyzzzz${e}`,a=new RegExp(i.split("").join("|"),"g"),r={"ж":"zh","х":"kh","ц":"ts","ч":"ch","ш":"sh","щ":"shch","ю":"iu","я":"ia"};let o;return""===t?o="":(o=t.toString().toLowerCase().replace(a,(t=>s.charAt(i.indexOf(t)))).replace(/[а-я]/g,(t=>r[t]||"")).replace(/(\d),(?=\d)/g,"$1").replace(/[^a-z0-9]+/g,e).replace(new RegExp(`(${e})\\1+`,"g"),"$1").replace(new RegExp(`^${e}+`),"").replace(new RegExp(`${e}+$`),""),""===o&&(o="unknown")),o})(i,"_"),o=s?"active":"inactive";return e&&a.push(`--state-${t}-${e}-${r}-color`),a.push(`--state-${t}-${r}-color`,`--state-${t}-${o}-color`,`--state-${o}-color`),a},ma=(t,e)=>{const i=void 0!==e?e:t?.state,s=bt(t.entity_id),a=t.attributes.device_class;if("sensor"===s&&"battery"===a){const t=(t=>{const e=Number(t);if(!isNaN(e))return e>=70?"--state-sensor-battery-high-color":e>=30?"--state-sensor-battery-medium-color":"--state-sensor-battery-low-color"})(i);if(t)return[t]}if("group"===s){const i=(t=>{const e=t.attributes.entity_id||[],i=[...new Set(e.map((t=>bt(t))))];return 1===i.length?i[0]:void 0})(t);if(i&&da.has(i))return pa(i,t,e)}if(da.has(s))return pa(s,t,e)};var fa;!function(t){t[t.TARGET_TEMPERATURE=1]="TARGET_TEMPERATURE",t[t.TARGET_TEMPERATURE_RANGE=2]="TARGET_TEMPERATURE_RANGE",t[t.TARGET_HUMIDITY=4]="TARGET_HUMIDITY",t[t.FAN_MODE=8]="FAN_MODE",t[t.PRESET_MODE=16]="PRESET_MODE",t[t.SWING_MODE=32]="SWING_MODE",t[t.AUX_HEAT=64]="AUX_HEAT",t[t.TURN_OFF=128]="TURN_OFF",t[t.TURN_ON=256]="TURN_ON",t[t.SWING_HORIZONTAL_MODE=512]="SWING_HORIZONTAL_MODE"}(fa||(fa={})),["auto","heat_cool","heat","cool","dry","fan_only","off"].reduce(((t,e,i)=>(t[e]=i,t)),{});const ya={cooling:"cool",defrosting:"heat",drying:"dry",fan:"fan_only",heating:"heat",idle:"off",off:"off",preheating:"heat"};class va{static{va.colorCache={},va.element=void 0,va.unresolvedColor=!1}static _prefixKeys(t){let e={};return Object.keys(t).forEach((i=>{const s=`--${i}`,a=String(t[i]);e[s]=`${a}`})),e}static processTheme(t){let e={},i={},s={},a={};const{modes:r,...o}=t;return r&&(i={...o,...r.dark},e={...o,...r.light}),s=va._prefixKeys(e),a=va._prefixKeys(i),{themeLight:s,themeDark:a}}static processPalette(t){let e={},i={},s={},a={},r={};return Object.values(t).forEach((t=>{const{modes:a,...r}=t;e={...e,...r},a&&(s={...s,...r,...a.dark},i={...i,...r,...a.light})})),a=va._prefixKeys(i),r=va._prefixKeys(s),{paletteLight:a,paletteDark:r}}static setElement(t){va.element=t}static calculateColor(t,e,i){const s=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let a,r,o;const n=s.length;if(t<=s[0])return e[s[0]];if(t>=s[n-1])return e[s[n-1]];for(let h=0;h<n-1;h++){const n=s[h],l=s[h+1];if(t>=n&&t<l){if([a,r]=[e[n],e[l]],!i)return a;o=va.calculateValueBetween(n,l,t);break}}return va.getGradientValue(a,r,o)}static calculateColor2(t,e,i,s,a){const r=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let o,n,h;const l=r.length;if(t<=r[0])return e[r[0]];if(t>=r[l-1])return e[r[l-1]];for(let c=0;c<l-1;c++){const l=r[c],d=r[c+1];if(t>=l&&t<d){if([o,n]=[e[l].styles[i][s],e[d].styles[i][s]],!a)return o;h=va.calculateValueBetween(l,d,t);break}}return va.getGradientValue(o,n,h)}static calculateValueBetween(t,e,i){return(Math.min(Math.max(i,t),e)-t)/(e-t)}static getLovelacePanel(){var t=window.document.querySelector("home-assistant");return(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))||null}static calculateStrokeColor(t,e,i){const s=e?.colors??[];if(!s.length)return;const a=Number(t);if(!Number.isFinite(a))return s[0].color;if(a<=s[0].value)return s[0].color;const r=s[s.length-1];if(a>=r.value)return r.color;for(let o=0;o<s.length-1;o+=1){const t=s[o],e=s[o+1];if(a>=t.value&&a<e.value){if(!i)return t.color;const s=va.calculateValueBetween(t.value,e.value,a);return va.getGradientValue(t.color,e.color,s)}}return r.color}static resolveColorVariable(t){const e=this.element.style.getPropertyValue(t).trim();let i=e;if(e.startsWith("var(")){const t=e.replace(/^var\((--.*?)\)$/,"$1").trim();i=window.getComputedStyle(document.body).getPropertyValue(t).trim()}return i}static getColorVariable(t){const e=t.slice(4,-1).trim();let i=e,s="",a=0;for(let n=0;n<e.length;n+=1){const t=e[n];if("("===t)a+=1;else if(")"===t)a-=1;else if(","===t&&0===a){i=e.slice(0,n).trim(),s=e.slice(n+1).trim();break}}const r=getComputedStyle(va.element).getPropertyValue(i).trim();if(r)return r;this.lovelace||(this.lovelace=va.getLovelacePanel());const o=getComputedStyle(this.lovelace).getPropertyValue(i).trim();return o||s}static getLovelaceColorVariable(t){const e=t.substr(4,t.length-5);this.lovelace||(this.lovelace=va.getLovelacePanel());return window.getComputedStyle(this.lovelace).getPropertyValue(e)}static getGradientValue(t,e,i){const s=va.colorToRGBA(t),a=va.colorToRGBA(e);if(!s||!a)return void(va.unresolvedColor=!0);const r=1-i,o=i,n=Math.floor(s[0]*r+a[0]*o),h=Math.floor(s[1]*r+a[1]*o),l=Math.floor(s[2]*r+a[2]*o),c=Math.floor(s[3]*r+a[3]*o);return`#${va.padZero(n.toString(16))}${va.padZero(h.toString(16))}${va.padZero(l.toString(16))}${va.padZero(c.toString(16))}`}static padZero(t){return t.length<2&&(t=`0${t}`),t.substr(0,2)}static resolveColorVariableV0(t){let e=t;for(;"string"==typeof e&&e.trim().startsWith("var(");)e=va.getColorVariable(e).trim(),console.log("resolving color variable ",t,", to: ",e,"...");return e}static colorToRGBAChat(t){if(null==t)return[0,0,0,0];const e=va.colorCache[t];if(e)return e;let i=t;"string"==typeof i&&i.trim().startsWith("var(")&&(i=va.resolveColorVariable(i));const s=window.document.createElement("canvas");s.width=s.height=1;const a=s.getContext("2d");a.clearRect(0,0,1,1),a.fillStyle=i,a.fillRect(0,0,1,1);const r=[...a.getImageData(0,0,1,1).data];return va.colorCache[t]=r,r}static colorToRGBA(t){if(null==t)return[0,0,0,0];const e=va.colorCache[t];if(e)return e;let i=t;if("var"===t.substr(0,3).valueOf()){i=t;for(let e=0;e<10&&i.trim().startsWith("var(");e+=1)if(i=va.getColorVariable(i.trim()),!i)return va.unresolvedColor=!0,void(va.element?.dev?.debug_colors&&console.log("[horseshoe-colors] unresolved css var",{argColor:t}))}let s=Zt(i);if(!s){const e=window.document.createElement("span"),a="rgb(1, 2, 3)";e.style.color=a,e.style.color=i,va.element.appendChild(e);const r=window.getComputedStyle(e).color;if(e.remove(),r!==a&&(s=Zt(r)),!s)return va.unresolvedColor=!0,void(va.element?.dev?.debug_colors&&console.log("[horseshoe-colors] unparseable color",{argColor:t,resolvedColor:i,computedColor:r}))}const a=Et("rgb")(s),r=[Math.round(255*Math.min(Math.max(a.r,0),1)),Math.round(255*Math.min(Math.max(a.g,0),1)),Math.round(255*Math.min(Math.max(a.b,0),1)),Math.round(255*(a.alpha??1))];return va.colorCache[t]=r,r}static hslToRgb(t){const e=t.h/360,i=t.s/100,s=t.l/100;let a,r,o;if(0===i)a=r=o=s;else{function n(t,e,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?t+6*(e-t)*i:i<.5?e:i<2/3?t+(e-t)*(2/3-i)*6:t}const h=s<.5?s*(1+i):s+i-s*i,l=2*s-h;a=n(l,h,e+1/3),r=n(l,h,e),o=n(l,h,e-1/3)}return a*=255,r*=255,o*=255,{r:a,g:r,b:o}}static computeColor(t){if(t.attributes?.hvac_action){const e=t.attributes.hvac_action;return e in ya?ua(t,ya[e]):void 0}if(t.attributes?.rgb_color)return`rgb(${t.attributes.rgb_color.join(",")})`;const e=ua(t);return e||void 0}static getHaEntityIconStyle(t){const e=va.computeColor(t),i=(t=>{if(t.attributes.brightness&&"plant"!==bt(t.entity_id))return`brightness(${(t.attributes.brightness+245)/5}%)`;return""})(t);return{color:e??"var(--state-icon-color)",fill:"currentColor",...i?{filter:i}:{}}}}const ba=200,_a=ba,xa=12,wa={arcs:100,rectangles:200,circles:300,horseshoes:400,horseshoes_v2:400,lines:500,hlines:500,vlines:500,icons:600,sparklines:650,areas:700,names:800,states:900},$a={arcs:1e5,rectangles:2e5,circles:3e5,horseshoes:4e5,horseshoes_v2:4e5,lines:5e5,hlines:5e5,vlines:5e5,icons:6e5,sparklines:65e4,areas:7e5,names:8e5,states:9e5};class ka{static calculateValueBetween(t,e,i){return isNaN(i)?0:i?(Math.min(Math.max(i,t),e)-t)/(e-t):0}static calculateSvgCoordinate(t,e){return t/100*ba+(e-100)}static calculateSvgDimension(t){return t/100*ba}static getLovelace(){let t=window.document.querySelector("home-assistant");if(t=t&&t.shadowRoot,t=t&&t.querySelector("home-assistant-main"),t=t&&t.shadowRoot,t=t&&t.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"),t=t&&t.shadowRoot||t,t=t&&t.querySelector("ha-panel-lovelace"),t=t&&t.shadowRoot,t=t&&t.querySelector("hui-root"),t){const e=t.lovelace;return e.current_view=t.___curView,e}return null}}class Sa{static mergeDeep(...t){const e=t=>t&&"object"==typeof t;return t.reduce(((t,i)=>(Object.keys(i).forEach((s=>{const a=t[s],r=i[s];Array.isArray(a)&&Array.isArray(r)?t[s]=a.concat(...r.map((t=>e(t)?this.mergeDeep(Array.isArray(t)?[]:{},t):t))):e(a)&&e(r)?t[s]=this.mergeDeep(a,r):Array.isArray(r)?t[s]=r.map((t=>e(t)?this.mergeDeep(Array.isArray(t)?[]:{},t):t)):e(r)?t[s]=this.mergeDeep({},r):t[s]=r})),t)),{})}}const Ma=["fill","stroke","color","stop-color","flood-color"],Aa=["grayscale","monochrome","duotone","preserve_neutral","lightness","brightness","contrast","saturation","opacity"],Ta=Et("rgb"),Ca=Et("oklch");class Ea{static mergeFilters(t){let e={};return t.forEach((t=>{if(!t)return;const i=ft.toDict(t,{skipFalse:!1}),{inherit:s,...a}=i;!1===s&&(e={}),e=Sa.mergeDeep(e,a)})),e}static applyToStyles(t,e,i){const s=Array.isArray(e)?Ea.mergeFilters(e):e;if(!Ea.hasAnyFilter(s))return t;const a={...t};return Ma.forEach((t=>{if(void 0===a[t])return;const e=Ea.getFilterForProperty(s,t);Ea.hasFilter(e)&&(a[t]=Ea.applyToColor(a[t],e,i))})),a}static getFilterForProperty(t,e){const i=t[e]&&"object"==typeof t[e]?t[e]:{};return{...Object.fromEntries(Object.entries(t).filter((([t])=>Aa.includes(t)))),...i}}static hasAnyFilter(t){return Aa.some((e=>void 0!==t?.[e]))||Ma.some((e=>Ea.hasFilter(Ea.getFilterForProperty(t??{},e))))}static hasFilter(t){return Aa.some((e=>void 0!==t[e]))}static applyToColor(t,e,i){const s=String(t).trim();if("none"===s||"currentColor"===s||"inherit"===s||s.startsWith("url("))return t;va.setElement(i);const a=va.colorToRGBA(s);if(!a)return t;let r={mode:"rgb",r:a[0]/255,g:a[1]/255,b:a[2]/255,alpha:a[3]/255};return void 0!==e.grayscale&&(r=Ea.applyGrayscale(r,e.grayscale)),void 0!==e.monochrome&&(r=Ea.applyMonochrome(r,e,i)),void 0!==e.duotone&&(r=Ea.applyDuotone(r,e,i)),void 0!==e.lightness&&(r=Ea.applyLightness(r,e.lightness)),void 0!==e.brightness&&(r=Ea.applyBrightness(r,Number(e.brightness))),void 0!==e.contrast&&(r=Ea.applyContrast(r,Number(e.contrast))),void 0!==e.saturation&&(r=Ea.applySaturation(r,Number(e.saturation))),void 0!==e.opacity&&(r={...r,alpha:Ea.clamp((r.alpha??1)*Number(e.opacity),0,1)}),qs(Ta(r))}static applyGrayscale(t,e){const i=Ca(t),s="object"==typeof e,a=s?1:Number(e),r=s?Number(e.min)+i.l*(Number(e.max)-Number(e.min)):i.l,o={...i,l:Ea.clamp(r,0,1),c:0},n=Ta(o);return Ea.mixRgb(t,n,Ea.clamp(a,0,1))}static applyLightness(t,e){const i=Ca(t),s="object"==typeof e?Number(e.min)+i.l*(Number(e.max)-Number(e.min)):Number(e);return Ta({...i,l:Ea.clamp(s,0,1)})}static applyMonochrome(t,e,i){const s=Ca(t);if(e.preserve_neutral&&Ea.isNeutralOklch(s))return t;const a=Ea.normalizeMonochromeFilter(e.monochrome),r=Ea.resolveColor(a.color,i),o=Ca(r),n=Ta({...o,l:s.l,alpha:t.alpha});return Ea.mixRgb(t,n,a.amount)}static applyDuotone(t,e,i){const s=Ca(t);if(e.preserve_neutral&&Ea.isNeutralOklch(s))return t;const a=Ea.normalizeDuotoneFilter(e.duotone),r=Ea.resolveColor(a.dark,i),o=Ea.resolveColor(a.light,i),n=Ea.mixRgb(r,o,s.l);return Ea.mixRgb(t,n,a.amount)}static applyBrightness(t,e){const i=Ca(t);return Ta({...i,l:Ea.clamp(i.l*e,0,1)})}static applyContrast(t,e){return{...t,r:Ea.clamp((t.r-.5)*e+.5,0,1),g:Ea.clamp((t.g-.5)*e+.5,0,1),b:Ea.clamp((t.b-.5)*e+.5,0,1)}}static applySaturation(t,e){const i=Ca(t);return Ta({...i,c:Math.max(0,i.c*e)})}static normalizeMonochromeFilter(t){return"object"==typeof t?{color:t.color,amount:t.amount??1}:{color:t,amount:1}}static normalizeDuotoneFilter(t){return{...t,amount:t.amount??1}}static isNeutralOklch(t){return t.l<=.005||t.l>=.995||Math.abs(t.c??0)<=5e-4}static resolveColor(t,e){va.setElement(e);const i=va.colorToRGBA(String(t));return{mode:"rgb",r:i[0]/255,g:i[1]/255,b:i[2]/255,alpha:i[3]/255}}static mixRgb(t,e,i){const s=Ea.clamp(i,0,1);return{mode:"rgb",r:Ea.clamp(t.r+(e.r-t.r)*s,0,1),g:Ea.clamp(t.g+(e.g-t.g)*s,0,1),b:Ea.clamp(t.b+(e.b-t.b)*s,0,1),alpha:Ea.clamp((t.alpha??1)+((e.alpha??1)-(t.alpha??1))*s,0,1)}}static clamp(t,e,i){return Math.min(Math.max(t,e),i)}}class Ia{constructor(t,e,i,s,a,r,o=r,n=0){this.sourceConfig=t,this.hasJavascript=i.hasJavascriptTemplates(this.sourceConfig),this.config=this.sourceConfig,this.id=t.id,this.index=e,this.templates=i,this.cardId=s,this.card=a,this.animationSection=r,this.zposSection=o,this.defaultZpos=wa[o]??0,this.config.zpos??=this.defaultZpos,this.config.dzpos??=0,this.zpos=Number(this.config.zpos)+Number(this.config.dzpos),this.renderIndex=($a[o]??0)+e,this.entity_index=t.entity_index??n,this.entity=void 0,this.entityConfig=void 0,this.configChanged=!0,this.activeConfigInitialized=!1,this.activeConfigSignature=void 0}setState(t,e){this.entity=t,this.entityConfig=e;const i=this.config.group??this.sourceConfig.group??"card";if(this.configChanged=!this.activeConfigInitialized||this.card.changedGroupIds.has(i)||this.card.theme.modeChanged,this.hasJavascript&&(!this.activeConfigInitialized||this.card.evaluateJavascriptTemplates)){const t=yt.getJsTemplateOrValue(this.sourceConfig,this.sourceConfig,{resolveKeys:!0}),e=JSON.stringify(t);e!==this.activeConfigSignature&&(this.config=t,this.activeConfigSignature=e,this.configChanged=!0)}this.configChanged&&this.config.color_stops&&(this.config.colorstops=vt.normalize(this.config.color_stops,this.card.getActiveColorStopMode())),this.configChanged&&this.config.sparkline?.color_stops&&(this.config.sparkline.colorstops=vt.normalize(this.config.sparkline.color_stops,this.card.getActiveColorStopMode())),this.zpos=Number(this.config.zpos)+Number(this.config.dzpos),this.activeConfigInitialized=!0}connected(){}disconnected(){}firstUpdated(){}updated(){}hassConnected(){}requiresHassUpdate(){return!1}getStyles(t){return{...t,...ft.toStyleDict(this.config.styles),...ft.toStyleDict(this.card.animations?.[this.animationSection]?.[this.config.animation_id]??{})}}getColorFilterCascade(t=[]){const e=this.card.groupManager.getGroupChainForItem(this.config).map((t=>t.color_filter));return[this.card.config.color_filter,...e,this.config.color_filter,...t]}getRenderStyles(t,e=[]){const i=Ea.applyToStyles(t,this.getColorFilterCascade(e),this.card);return this.card.masksClips.applyGradientRefs(i)}applyColorStops(t,e){const i=this.card._getItemColorFromStops(this.config);i&&(t[e]=i)}textEllipsis(t,e){return e&&e<t.length?t.slice(0,e-1).concat("..."):t}getGroupScaleTransform(){return this.card._getGroupScaleTransform(this.config)}getGroupScaleStyle(){return this.card._getGroupScaleStyle(this.config)}renderItemLayers(t,e=this.config){let i=t;if(e.mask){(Array.isArray(e.mask)?e.mask:[e.mask]).forEach((t=>{this.card.masksClips.getMaskUseIds(t,e,this.zposSection).forEach((t=>{i=H`<g mask="url(#${t})">${i}</g>`}))}))}return e.clip&&(i=H`<g clip-path="url(#${this.card.masksClips.getClipUseId(e.clip,e,this.zposSection)})">${i}</g>`),i}handlePopup(t){if(void 0===this.entity_index||null===this.entity_index)return;const e=this.card.entities[this.entity_index];e&&this.card.handlePopup(t,e)}}const Na={enabled:!0,duration:2500,easing:"ease-out",debug:!1};function Ra(t,e,i,s={}){const a=Number(i.fromValue),r=Number(i.toValue),o=s.onUpdate,n=s.onComplete;if(!1===e.enabled)return o&&o(r),void(n&&n(r));!function(t){t.frame&&cancelAnimationFrame(t.frame),t.frame=void 0,t.startTime=void 0,t.animating=!1}(t),t.fromValue=a,t.toValue=r,t.startTime=void 0,t.animating=!0,e.debug&&console.log("[horseshoe animation] start",{fromValue:t.fromValue,toValue:t.toValue});const h=i=>{t.startTime||(t.startTime=i);const s=Number(e.duration??Na.duration),a=i-t.startTime,r=s<=0?1:Ks(a/s,0,1),l=function(t,e){return"linear"===e?t:"ease-in"===e?t**3:"ease-in-out"===e?t<.5?4*t**3:1-(-2*t+2)**3/2:1-(1-t)**3}(r,e.easing),c=t.fromValue+(t.toValue-t.fromValue)*l;o&&o(c),r<1?t.frame=requestAnimationFrame((t=>h(t))):(t.frame=void 0,t.startTime=void 0,t.animating=!1,n&&n(t.toValue),e.debug&&console.log("[horseshoe animation] end",{value:t.toValue}))};t.frame=requestAnimationFrame((t=>h(t)))}const Da=Math.PI/180;class Pa{constructor(t,e){this.x=t,this.y=e;const i=t.length;this.n=i;const s=new Array(i-1),a=new Array(i-1);for(let r=0;r<i-1;r+=1)s[r]=t[r+1]-t[r],a[r]=(e[r+1]-e[r])/s[r];this.c1s=new Array(i).fill(0),this.c1s[0]=a[0];for(let r=1;r<i-1;r+=1)this.c1s[r]=(a[r-1]+a[r])/2;this.c1s[i-1]=a[i-2];for(let r=0;r<i-1;r+=1)if(0===a[r])this.c1s[r]=0,this.c1s[r+1]=0;else{const t=this.c1s[r]/a[r],e=this.c1s[r+1]/a[r],i=Math.hypot(t,e);if(i>3){const s=3/i;this.c1s[r]=s*t*a[r],this.c1s[r+1]=s*e*a[r]}}this.c2s=new Array(i-1),this.c3s=new Array(i-1);for(let r=0;r<i-1;r+=1){const t=a[r],e=this.c1s[r+1],i=this.c1s[r];this.c2s[r]=(3*t-2*i-e)/s[r],this.c3s[r]=(i+e-2*t)/(s[r]*s[r])}}get(t){if(t<=this.x[0])return this.y[0];if(t>=this.x[this.n-1])return this.y[this.n-1];let e=0;for(let s=0;s<this.n-1;s+=1)if(t>=this.x[s]&&t<=this.x[s+1]){e=s;break}const i=t-this.x[e];return this.y[e]+this.c1s[e]*i+this.c2s[e]*i*i+this.c3s[e]*i*i*i}}class za{constructor(t,e){this.x=t,this.y=e,this.n=t.length,this.m=new Array(this.n-1),this.t=new Array(this.n);const i=new Array(this.n-1),s=new Array(this.n-1);for(let a=0;a<this.n-1;a+=1)i[a]=t[a+1]-t[a],s[a]=e[a+1]-e[a],this.m[a]=s[a]/i[a];this.t[0]=.25*this.m[0],this.t[this.n-1]=.25*this.m[this.n-2];for(let a=1;a<this.n-1;a+=1)if(0===this.m[a-1]||0===this.m[a]||this.m[a-1]*this.m[a]<0)this.t[a]=0;else{const t=2*i[a]+i[a-1],e=i[a]+2*i[a-1];this.t[a]=(t+e)/(t/this.m[a-1]+e/this.m[a])}for(let a=0;a<this.n-1;a+=1)if(0===this.m[a])this.t[a]=0,this.t[a+1]=0;else{const t=this.t[a]/this.m[a],e=this.t[a+1]/this.m[a],i=t*t+e*e;if(i>9){const s=3/Math.sqrt(i);this.t[a]=s*t*this.m[a],this.t[a+1]=s*e*this.m[a]}}}get(t){if(t<=this.x[0])return this.y[0];if(t>=this.x[this.n-1])return this.y[this.n-1];let e=0;for(let l=0;l<this.n-1;l+=1)if(t>=this.x[l]&&t<=this.x[l+1]){e=l;break}const i=this.x[e+1]-this.x[e],s=(t-this.x[e])/i,a=s*s,r=a*s,o=r-2*a+s,n=-2*r+3*a,h=r-a;return(2*r-3*a+1)*this.y[e]+o*i*this.t[e]+n*this.y[e+1]+h*i*this.t[e+1]}}class Ga{constructor(t){if(this.type=t.type,this.min=Number(t.min),this.max=Number(t.max),this.points=Ga.buildPoints(t),"splineorg"!==this.type)if("spline"!==this.type){if("linear"!==this.type)throw new Error(`[V2 GaugeScale] Unsupported scale type: ${this.type}`)}else this.spline=new za(this.points.map((t=>t.value)),this.points.map((t=>t.position)));else this.splineorg=new Pa(this.points.map((t=>t.value)),this.points.map((t=>t.position)))}static buildPoints(t){if("splineorg"!==t.type&&"spline"!==t.type)return[{value:Number(t.min),position:0},{value:Number(t.max),position:1}];if(!t.spline?.anchors)throw new Error("[V2 GaugeScale] Missing horseshoe_scale.spline.anchors");const e=t.spline.anchors.map((t=>({value:Number(t.value),position:Number(t.position)}))).filter((t=>Number.isFinite(t.value)&&Number.isFinite(t.position))).sort(((t,e)=>t.value-e.value));if("spline"===t.type){const i=Number(t.min),s=Number(t.max),a=e.filter((t=>t.value>i&&t.value<s));return[{value:i,position:0},...a,{value:s,position:1}].filter((t=>Number.isFinite(t.value)&&Number.isFinite(t.position))).sort(((t,e)=>t.value-e.value))}return e}toRatio(t){const e=Number(t);return"splineorg"===this.type?Ks(this.splineorg.get(e),0,1):"spline"===this.type?Ks(this.spline.get(e),0,1):Ks((e-this.min)/(this.max-this.min),0,1)}}class Ba{constructor(t,e){this.cx=t.svg.xpos,this.cy=t.svg.ypos,this.radius=t.svg.radius,this.tickmarksRadius=t.svg.tickmarks_radius,this.arcDegrees=t.arc_degrees,this.startAngle=t.start_angle,this.endAngle=this.startAngle+this.arcDegrees,this.rotation=Number(t.rotate??0),this.flip=t.flip??"none",this.groupConfig=t.group_config,this.barMode=t.bar_mode,this.zeroRatio=t.zero_ratio,this.zeroAngle=this.ratioToAngle(this.zeroRatio),this.scale=e}getTransformContext(){return{rotation:this.rotation,flipX:"x"===this.flip||"both"===this.flip,flipY:"y"===this.flip||"both"===this.flip}}getRotateTransform(){return this.rotation?`rotate(${this.rotation} ${this.cx} ${this.cy})`:""}getScaleTransform(){const t=this.getTransformContext();if(!t.flipX&&!t.flipY)return"";const e=t.flipX?-1:1,i=t.flipY?-1:1;return`translate(${this.cx} ${this.cy}) scale(${e} ${i}) translate(${-this.cx} ${-this.cy})`}getGroupRotateTransform(){const t=Number(this.groupConfig?.rotate??this.groupConfig?.rotation??0);return t?`rotate(${t} ${this.groupConfig.svg.xpos} ${this.groupConfig.svg.ypos})`:""}getGroupScaleTransform(){if(!this.groupConfig?.scale)return"";const t=this.groupConfig.scale.x??this.groupConfig.scale,e=this.groupConfig.scale.y??this.groupConfig.scale;return`translate(${this.groupConfig.svg.xpos} ${this.groupConfig.svg.ypos}) scale(${t} ${e}) translate(${-this.groupConfig.svg.xpos} ${-this.groupConfig.svg.ypos})`}getGroupTransform(){return[this.getGroupRotateTransform(),this.getGroupScaleTransform(),this.getRotateTransform(),this.getScaleTransform()].filter(Boolean).join(" ")}getInverseGroupTransform(){const t=this.getTransformContext(),e=[];if(t.flipX||t.flipY){const i=t.flipX?-1:1,s=t.flipY?-1:1;e.push(`translate(${this.cx} ${this.cy})`),e.push(`scale(${i} ${s})`),e.push(`translate(${-this.cx} ${-this.cy})`)}return this.rotation&&e.push(`rotate(${-this.rotation} ${this.cx} ${this.cy})`),e.join(" ")}ratioToAngle(t){return this.startAngle+t*this.arcDegrees}scaleValueToRatio(t){return this.scale.toRatio(t)}scaleValueToAngle(t){return this.ratioToAngle(this.scaleValueToRatio(t))}valueToRatio(t){const e=Number(t);if(!("bidirectional"===this.barMode||"bidirectional_symmetrical"===this.barMode)||this.scale.min>=0||this.scale.max<=0)return this.scaleValueToRatio(e);const i=this.scaleValueToRatio(0);if(e<0){const t=this.scaleValueToRatio(e);return.5*Ks(i>0?t/i:0,0,1)}const s=this.scaleValueToRatio(e),a=1-i;return.5+.5*Ks(a>0?(s-i)/a:0,0,1)}valueToAngle(t){return this.ratioToAngle(this.valueToRatio(t))}pointAt(t,e){const i=t*Da;return{x:this.cx+Math.cos(i)*e,y:this.cy+Math.sin(i)*e}}}class Fa{static applyEllipsis(t,e){const i=Number(e);return!Number.isFinite(i)||i<=0||t.length<=i?t:1===i?"…":`${t.slice(0,i-1)}…`}static renderLabel(t){return"horizontal"===(t.orientation??"arc")?Fa.renderHorizontalLabel(t):Fa.renderArcLabel(t)}static renderHorizontalLabel(t){const e=Fa.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:t.angle}),i=t.transformContext??{},s=i.rotation??0,a=i.flipX??!1?-1:1,r=i.flipY??!1?-1:1,o=Fa.applyEllipsis(String(t.label??""),t.ellipsis),n={"dominant-baseline":"central",fill:"var(--primary-text-color)",...t.styles??{}};return H`
      <text
        x="${e.x}"
        y="${e.y}"
        text-anchor="middle"
        style=${mt(t.applyColorFilter?t.applyColorFilter(n):n)}
        class="horseshoe-label"
        transform="
          translate(${e.x} ${e.y})
          scale(${a} ${r})
          rotate(${-s})
          translate(${-e.x} ${-e.y})
        "
      >
        ${o}
      </text>
    `}static renderArcLabel(t){const e=Fa.applyEllipsis(String(t.label??""),t.ellipsis),i={fill:"currentColor",...t.styles??{}},s=Number(t.arcSize??24),a=Fa.getLabelGeometry({angle:t.angle,transformContext:t.transformContext}).visualAngle,r=a>=180&&a<=360,o=a-s/2,n=a+s/2,h=r?o:n,l=r?n:o,c=r?1:0,d=Fa.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:h}),u=Fa.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:l}),p=`${t.cardId}-horseshoe-label-${t.horseshoeIndex}-${t.index}`,g=t.inverseTransform??"";return H`
      <g transform="${g}">
        <path
          id="${p}"
          d="M ${d.x} ${d.y} A ${t.radius} ${t.radius} 0 0 ${c} ${u.x} ${u.y}"
          fill="none"
          stroke="none"
        />

        <text
          class="horseshoe-label"
          style=${mt(t.applyColorFilter?t.applyColorFilter(i):i)}
          dy="0em"
        >
          <textPath
            href="#${p}"
            style="dominant-baseline:central"
            startOffset="50%"
            text-anchor="middle"
          >
            ${e}
          </textPath>
        </text>
      </g>
    `}static renderLabelBadge(t){return"horizontal"===(t.orientation??"arc")?Fa.renderHorizontalBadge(t):Fa.renderArcBadge(t)}static renderArcSegment(t){const e=Fa.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:t.startAngle}),i=Fa.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:t.endAngle}),s=Math.abs(t.endAngle-t.startAngle)>180?1:0,a=t.endAngle>t.startAngle?1:0;return H`
      <path
        class="${t.className??""}"
        d="M ${e.x} ${e.y} A ${t.radius} ${t.radius} 0 ${s} ${a} ${i.x} ${i.y}"
        fill="none"
        stroke="${t.color??"currentColor"}"
        stroke-width="${t.width}"
        stroke-linecap="${t.lineCap??"round"}"
      />
    `}static renderArcBadge(t){const e=String(t.label??""),i=t.badge??{},s=Number(i.padding??2),a=Number(i.char_width??4),r=Number(i.width??e.length*a+2*s),o=Number(i.height??8),n=Math.max(0,r-o),h=Fa.arcLengthToDegrees(n,t.radius),l=Fa.buildArcCapsulePath({cx:t.cx,cy:t.cy,radius:t.radius,angle:t.angle,arcSize:h,width:o});return H`
      <path
        class="horseshoe-label-badge"
        d="${l}"
        fill="${i.color??"var(--card-background-color)"}"
        stroke="${i.border_color??"none"}"
      />
    `}static renderHorizontalBadge(t){const e=t.badge??{},i=Fa.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:t.angle}),s=String(t.label??""),a=Number(e.padding??4),r=Number(e.radius??Math.max(7,3*s.length+a));return H`
      <circle
        class="horseshoe-label-badge"
        cx="${i.x}"
        cy="${i.y}"
        r="${r}"
        fill="${e.color??"var(--card-background-color)"}"
        stroke="${e.border_color??"none"}"
      />
    `}static pointAt(t){const e=Fa.degToRad(t.angle);return{x:t.cx+Math.cos(e)*t.radius,y:t.cy+Math.sin(e)*t.radius}}static normalizeAngle(t){return(t%360+360)%360}static degToRad(t){return t*Math.PI/180}static radToDeg(t){return 180*t/Math.PI}static arcLengthToDegrees(t,e){return Number(t)/(2*Math.PI*e)*360}static getLabelGeometry(t){const e=t.angle??0,i=t.transformContext??{},s=i.rotation??0,a=i.flipX??!1,r=i.flipY??!1;return{positionAngle:e,visualAngle:Fa.getVisualAngleFromParentTransform({angle:e,rotation:s,flipX:a,flipY:r}),mirrored:a!==r}}static getVisualAngleFromParentTransform(t){const e=t.angle??0,i=t.rotation??0,s=t.flipX??!1?-1:1,a=t.flipY??!1?-1:1,r=Fa.degToRad(e),o=Fa.degToRad(i),n=Math.cos(r),h=Math.sin(r),l=(n*Math.cos(o)-h*Math.sin(o))*s,c=(n*Math.sin(o)+h*Math.cos(o))*a;return Fa.normalizeAngle(Fa.radToDeg(Math.atan2(c,l)))}static buildArcCapsulePath(t){const e=t.width/2,i=t.radius+e,s=t.radius-e,a=t.angle-t.arcSize/2,r=t.angle+t.arcSize/2,o=Fa.pointAt({cx:t.cx,cy:t.cy,radius:i,angle:a}),n=Fa.pointAt({cx:t.cx,cy:t.cy,radius:i,angle:r}),h=Fa.pointAt({cx:t.cx,cy:t.cy,radius:s,angle:r}),l=Fa.pointAt({cx:t.cx,cy:t.cy,radius:s,angle:a}),c=t.arcSize>180?1:0;return`\n      M ${o.x} ${o.y}\n      A ${i} ${i} 0 ${c} 1 ${n.x} ${n.y}\n      A ${e} ${e} 0 0 1 ${h.x} ${h.y}\n      A ${s} ${s} 0 ${c} 0 ${l.x} ${l.y}\n      A ${e} ${e} 0 0 1 ${o.x} ${o.y}\n      Z\n    `}}function La(t,e,i){return`horseshoe-state-${t}-${e}-${i}`}function ja(t,e){return`horseshoe-state-gradient-${t}-${e}`}function Oa(t,e,i,s,a,r=(t=>t)){const o={...t.horseshoe_state.styles},n={...t.horseshoe_scale.styles},h=ja(s,a);return H`
    <g class="horseshoe__state-layer">
      ${function(t,e,i,s,a){if("lineargradient"!==t.show?.horseshoe_style)return"";const r=t.colorstops.colors,o=r[0].color,n=r[r.length-1].color,h=i.find((t=>t.arc.gradientOffset))?.arc.gradientOffset??"0%",l=ja(s,a),c=e.pointAt(e.startAngle,e.radius),d=e.pointAt(e.endAngle,e.radius);return H`
    <defs>
      <linearGradient
        gradientUnits="userSpaceOnUse"
        gradientTransform="rotate(0)"
        id="${l}"
        x1="${c.x}"
        y1="${c.y}"
        x2="${d.x}"
        y2="${d.y}"
      >
        <stop id="${l}-color1" offset="${h}" stop-color="${n}" style="transition: stop-color 1s ease;"></stop>
        <stop offset="100%" stop-color="${o}" style="transition: stop-color 1s ease;"></stop>
      </linearGradient>
    </defs>
  `}(t,e,i,s,a)}
      ${i.map((e=>{const i="stringstate_mode"===t.horseshoe_state.mode||"stringstate_level"===t.horseshoe_state.mode,l=!1!==e.arc.active||i?o:n,c="lineargradient"===t.show?.horseshoe_style&&!1!==e.arc.active?`url('#${h}')`:e.arc.color??l.fill??t.horseshoe_state.color??"none",d={...l,fill:c};i&&void 0===d.transition&&(d.transition="fill 600ms ease, opacity 600ms ease, filter 600ms ease"),i&&!1===e.arc.active&&(d.opacity=t.horseshoe_state.inactive_opacity??"0"),e.path||(d.opacity="0");const u=La(s,a,e.key);return H`
          <path
            id="${u}"
            data-horseshoe-state-path="${u}"
            class="horseshoe__state"
            d="${e.path}"
            style=${mt(r(d,e))}
          ></path>
        `}))}
    </g>
  `}function Ha(t,e,i={}){if(!e.length)return H``;const{layerClass:s,itemClass:a,styles:r={},applyColorFilter:o=(t=>t)}=i,{filter:n,...h}=r;return H`
    <g class=${s} style=${mt(n?{filter:n}:{})}>
      ${e.map((t=>{const e={"stroke-width":0,...h,fill:t.color??h.fill??h.stroke??"currentColor"};return t.path?H`
              <path
                class=${a}
                d=${t.path}
                style=${mt(o(e,t))}
              ></path>
            `:H``}))}
    </g>
  `}function Va(t,e,i,s,a,r,o=(t=>t)){const n={...t.horseshoe_state.styles},h={...t.horseshoe_scale.styles},l=ja(a,r),c=s.renderRoot?.querySelector(`#${l}-color1`);if("lineargradient"===t.show?.horseshoe_style&&c){const t=e.find((t=>t.arc.gradientOffset))?.arc.gradientOffset;t&&c.setAttribute("offset",t)}e.forEach((e=>{const c=function(t,e,i,s,a){if(!a?.key)return;if(t.has(a.key)){const e=t.get(a.key);if(e?.isConnected)return e;t.delete(a.key)}const r=e?.renderRoot??e?.shadowRoot;if(!r)return;const o=La(i,s,a.key),n=r.getElementById?.(o)??r.querySelector?.(`[data-horseshoe-state-path="${o}"]`);return n&&t.set(a.key,n),n}(i,s,a,r,e);if(!c)return;const d="stringstate_mode"===t.horseshoe_state.mode||"stringstate_level"===t.horseshoe_state.mode,u=!1!==e.arc.active||d?n:h,p="lineargradient"===t.show?.horseshoe_style&&!1!==e.arc.active?`url('#${l}')`:e.arc.color??u.fill??t.horseshoe_state.color??"none",g={...u,fill:p};d&&void 0===g.transition&&(g.transition="fill 600ms ease, opacity 600ms ease, filter 600ms ease"),d&&!1===e.arc.active&&(g.opacity=t.horseshoe_state.inactive_opacity??"0"),e.path||(g.opacity="0"),c.setAttribute("d",e.path||""),c.setAttribute("style",Object.entries(o(g,e)).map((([t,e])=>`${t}: ${e}`)).join("; "))}))}const Ua=t=>Array.isArray(t)?t:[];class qa{static buildBandPath(t={}){const{geometry:e,arc:i={},band:s={}}=t;if(!e||!1===i.visible)return"";const a={startAngle:0,endAngle:0,startCap:"butt",endCap:"butt",...i},r={radius:e.radius,width:1,...s},o=Number(a.startAngle),n=Number(a.endAngle),h=Number(r.radius),l=Number(r.width);if(!(Number.isFinite(o)&&Number.isFinite(n)&&Number.isFinite(h)&&Number.isFinite(l)))return"";if(n===o||l<=0)return"";const c=h-l/2,d=h+l/2;if(c<=0||d<=0)return"";const u=e.pointAt(o,d),p=e.pointAt(n,d),g=e.pointAt(n,c),m=e.pointAt(o,c),f=Math.abs(n-o)>180?1:0,y=n>o?1:0,v=y?0:1,b=l/2,_=[];return _.push(`M ${u.x} ${u.y}`),_.push(`A ${d} ${d} 0 ${f} ${y} ${p.x} ${p.y}`),"round"===a.endCap?_.push(`A ${b} ${b} 0 0 ${y} ${g.x} ${g.y}`):_.push(`L ${g.x} ${g.y}`),_.push(`A ${c} ${c} 0 ${f} ${v} ${m.x} ${m.y}`),"round"===a.startCap?_.push(`A ${b} ${b} 0 0 ${y} ${u.x} ${u.y}`):_.push(`L ${u.x} ${u.y}`),_.push("Z"),_.join(" ")}}function Xa(t,e){const i=t.show?.scale_style??"fixed";return"none"===i?[]:"colorstop"===i?function(t,e){const i=Ua(t.colorstops?.colors),s=Number(t.colorstops?.gap??0),a=[];if(!i.length)return[{key:"scale",startAngle:e.startAngle,endAngle:e.endAngle,startCap:t.horseshoe_scale.linecap.start,endCap:t.horseshoe_scale.linecap.end,color:t.horseshoe_scale.color}];const r=[{value:Number(t.horseshoe_scale.min),color:i[0].color},...i.map((t=>({value:Number(t.value),color:t.color}))),{value:Number(t.horseshoe_scale.max),color:i[i.length-1].color}];for(let n=0;n<r.length-1;n+=1){const t=r[n],i=r[n+1],o=e.valueToAngle(t.value),h=e.valueToAngle(i.value),l=0===n?o:o+s/2,c=n===r.length-2?h:h-s/2,d=c>l;a.push({key:`scale-colorstop-${n}`,startAngle:d?l:0,endAngle:d?c:0,startCap:"butt",endCap:"butt",color:t.color,value:t.value,visible:d})}const o=a.filter((t=>!1!==t.visible));return o.length&&(o[0].startCap=t.horseshoe_scale.linecap.start,o[o.length-1].endCap=t.horseshoe_scale.linecap.end),a}(t,e):[{key:"scale",startAngle:e.startAngle,endAngle:e.endAngle,startCap:t.horseshoe_scale.linecap.start,endCap:t.horseshoe_scale.linecap.end,color:t.horseshoe_scale.color}]}function Ya(t,e,i={}){const{mode:s="none",config:a={},radius:r=e.radius,width:o=6,gap:n=0,keyPrefix:h="background"}=i;if("none"===s)return[];if("colorstop"===s){const i=Ua(t.colorstops?.colors);if(!i.length)return[];const s=[],l=Number(t.horseshoe_scale.min),c=Number(t.horseshoe_scale.max),d=i.map((t=>({value:Number(t.value),color:t.color}))),u=[...d[0]?.value===l?[]:[{value:l,color:i[0].color}],...d,...d[d.length-1]?.value===c?[]:[{value:c,color:i[i.length-1].color}]];for(let t=0;t<u.length-1;t+=1){const i=u[t],l=u[t+1],c=e.valueToAngle(i.value),d=e.valueToAngle(l.value),p=0===t,g=t===u.length-2,m=p?c:c+n/2,f=g?d:d-n/2;if(f>m){const n=a.linecap??"round",l={key:`${h}-colorstop-${t}`,startAngle:m,endAngle:f,startCap:p?n:"butt",endCap:g?n:"butt"};s.push({key:l.key,arc:l,path:qa.buildBandPath({geometry:e,arc:l,band:{radius:r,width:o}}),startAngle:m,endAngle:f,radius:r,width:o,color:i.color,lineCap:n})}}return s}if("fixed"===s){const t=a.linecap??"round",i={key:`${h}-fixed`,startAngle:e.startAngle,endAngle:e.endAngle,startCap:t,endCap:t};return[{key:i.key,arc:i,path:qa.buildBandPath({geometry:e,arc:i,band:{radius:r,width:o}}),startAngle:e.startAngle,endAngle:e.endAngle,radius:r,width:o,color:a.color,lineCap:t}]}return[]}function Wa(t,e,i,s){const a=t.show?.horseshoe_style,r=Number(s.fromAngle??e.startAngle),o=Number(s.toAngle??e.startAngle);return"colorstopsegments"===a?function(t,e,i,s){const a=Ua(t.colorstops?.colors),r=Number(t.colorstops?.gap??0),o=[];if(a.length<2)return[{key:"state-value",startAngle:i,endAngle:s,startCap:t.horseshoe_state.linecap.start,endCap:t.horseshoe_state.linecap.end}];for(let h=0;h<a.length-1;h+=1){const t=a[h],n=a[h+1],l=e.valueToAngle(t.value),c=e.valueToAngle(n.value),d=Math.max(l,i)+r/2,u=Math.min(c,s)-r/2,p=u>d;o.push({key:`colorstop-${h}`,startAngle:p?d:0,endAngle:p?u:0,startCap:"butt",endCap:"butt",color:t.color,value:t.value,label:t.label,visible:p})}const n=o.filter((t=>!1!==t.visible));return n.length&&(n[0].startCap=t.horseshoe_state.linecap.start,n[n.length-1].endCap=t.horseshoe_state.linecap.end),o}(t,e,r,o):"autominmax"===a?[{key:"state-value",startAngle:r,endAngle:o,startCap:t.horseshoe_state.linecap.start,endCap:t.horseshoe_state.linecap.end,color:va.calculateStrokeColor(i,t.colorstopsMinMax,!0)}]:"lineargradient"===a?[{key:"state-value",startAngle:r,endAngle:o,startCap:t.horseshoe_state.linecap.start,endCap:t.horseshoe_state.linecap.end,gradientOffset:"0%"}]:"colorstop"===a||"colorstopgradient"===a?[{key:"state-value",startAngle:r,endAngle:o,startCap:t.horseshoe_state.linecap.start,endCap:t.horseshoe_state.linecap.end,color:va.calculateStrokeColor(i,t.colorstops,"colorstopgradient"===a)}]:[{key:"state-value",startAngle:r,endAngle:o,startCap:t.horseshoe_state.linecap.start,endCap:t.horseshoe_state.linecap.end}]}function Ja(t,e){return e<0?"after":t<e?"before":t>e?"after":"current"}function Za(t){const e=t.horseshoe_state?.mode;return"stringstate_mode"===e||"stringstate_level"===e?t.horseshoe_labels?.[e]:void 0}function Ka(t,e){return Ua(Za(t)?.state_map?.map).find((t=>String(t.state)===String(e)))}function Qa(t,e){return ft.toStyleDict(Za(t)?.[e]?.styles)}function tr(t,e){return ft.toStyleDict(t?.[e]?.styles)}function er(t,e,i){return"segment"===t.horseshoe_state.mode||"stringstate_mode"===t.horseshoe_state.mode||"stringstate_level"===t.horseshoe_state.mode?function(t,e,i){const s=t.state_map.map,a=t.horseshoe_state.segment_gap,r=Number(t.colorstops?.gap??0),o=s.length;if(!o)return[];const n=s.findIndex((t=>Number(t.value)===Number(i))),h=e.arcDegrees/o,l=Ua(t.colorstops?.colors),c=[{value:Number(t.horseshoe_scale.min),color:l[0]?.color},...l.map((t=>({value:Number(t.value),color:t.color}))),{value:Number(t.horseshoe_scale.max),color:l[l.length-1]?.color}];return s.map(((i,s)=>{const l=Ja(s,n),d="current"===l,u="stringstate_level"===t.horseshoe_state.mode?"before"===l||"current"===l:d,p=Number(i.value);let g,m,f=e.startAngle+s*h+a/2,y=e.startAngle+(s+1)*h-a/2,v=i.color??va.calculateStrokeColor(i.value,t.colorstops,"colorstopgradient"===t.show?.horseshoe_style);if("stringstate_mode"===t.horseshoe_state.mode||"stringstate_level"===t.horseshoe_state.mode)for(let t=0;t<c.length-1;t+=1){const s=c[t],a=c[t+1],o=0===t;if(o&&p>=s.value&&p<=a.value||p>s.value&&p<=a.value){const n=t===c.length-2;g=s.value,m=a.value,f=o?e.valueToAngle(s.value):e.valueToAngle(s.value)+r/2,y=n?e.valueToAngle(a.value):e.valueToAngle(a.value)-r/2,v=i.color??s.color;break}}return{key:`mapped-state-${s}`,startAngle:f,endAngle:y,startCap:0===s?t.horseshoe_state.linecap.start:"butt",endCap:s===o-1?t.horseshoe_state.linecap.end:"butt",active:u,relation:l,value:i.value,startValue:g,endValue:m,color:v,label:i.display_label??i.label??String(i.state??i.value)}}))}(t,e,i):"bidirectional"===t.bar_mode||"bidirectional_symmetrical"===t.bar_mode||"bidirectional_linear"===t.bar_mode?function(t,e,i){const s=e.valueToAngle(i),a=e.zeroAngle;return Wa(t,e,i,{fromAngle:Math.min(a,s),toAngle:Math.max(a,s)})}(t,e,i):function(t,e,i){return Wa(t,e,i,{fromAngle:e.startAngle,toAngle:e.valueToAngle(i)})}(t,e,i)}function ir(t,e,i){const s=er(t,e,i),a={radius:e.radius,width:t.horseshoe_state.width};return s.map(((t,i)=>({key:t.key??`state-arc-${i}`,arc:t,path:qa.buildBandPath({geometry:e,arc:t,band:a})})))}function sr(t,e,i){const s=[];for(let a=t;a<=e+1e-9;a+=i)s.push(Number(a.toFixed(10)));return s}function ar(t,e){return function(t){const e=t.show.labels_at??"none",i=Number(t.horseshoe_scale.min),s=Number(t.horseshoe_scale.max),a=Ua(t.colorstops?.colors);let r=[];if("minmax"===e&&(r=[{value:i,text:String(i),role:"min"},{value:s,text:String(s),role:"max"}]),"minmax0"===e&&(r=[{value:i,text:String(i),role:"min"},{value:0,text:"0",role:"zero"},{value:s,text:String(s),role:"max"}]),"colorstop"!==e&&"colorstops"!==e||(r=[{value:i,text:String(i),role:"min"},...a.map((t=>({value:t.value,text:t.label??String(t.value),role:"colorstop",color:t.color}))),{value:s,text:String(s),role:"max"}]),"ticks_major"===e){const e=Number(t.horseshoe_tickmarks?.ticks_major?.ticksize);Number.isFinite(e)&&e>0&&(r=sr(i,s,e).map(((t,e,i)=>({value:t,text:String(t),role:0===e?"min":e===i.length-1?"max":"tick-major"}))))}if("both"===e){const e=a.length?[{value:i,text:String(i),role:"min"},...a.map((t=>({value:t.value,text:t.label??String(t.value),role:"colorstop",color:t.color}))),{value:s,text:String(s),role:"max"}]:[],o=Number(t.horseshoe_tickmarks?.ticks_major?.ticksize);r=[...e,...Number.isFinite(o)&&o>0?sr(i,s,o).map((t=>({value:t,text:String(t),role:"tick-major"}))):[]]}if("segment"===e||"stringstate"===e){const e=Ua(t.state_map?.map),i=e.findIndex((e=>Number(e.value)===Number(t.mapped_state?.value)));if("stringstate_mode"===t.horseshoe_state?.mode||"stringstate_level"===t.horseshoe_state?.mode){const s=[{value:Number(t.horseshoe_scale.min)},...a.map((t=>({value:Number(t.value)}))),{value:Number(t.horseshoe_scale.max)}];r=e.map(((e,a)=>{const r=Ja(a,i),o=Ka(t,e.state),n=Number(e.value);let h,l,c=n;for(let t=0;t<s.length-1;t+=1){const e=s[t],i=s[t+1];if(0===t&&n>=e.value&&n<=i.value||n>e.value&&n<=i.value){c=(e.value+i.value)/2,h=e.value,l=i.value;break}}const d=Qa(t,r),u=ft.toStyleDict(o?.styles),p=tr(o,r),g={...d,...u,...p};return(t.debug_labels||t.dev?.debug_labels)&&console.log("[horseshoe-labels] string-state label style",{state:e.state,relation:r,roleStyles:d,stateRoleStyles:p,stateStyles:u,styles:g}),{value:c,startValue:h,endValue:l,text:o?.label??e.display_label??String(e.state??e.value),role:"segment",relation:r,styles:g}}))}else r=e.map(((e,s)=>{const a=Ka(t,e.state),r=Ja(s,i);return{value:e.value,text:a?.label??e.display_label??String(e.state??e.value),role:"segment",relation:r,styles:{...Qa(t,r),...ft.toStyleDict(a?.styles),...tr(a,r)}}}))}const o=r.filter((t=>{const e=Number(t.value);return Number.isFinite(e)&&e>=i&&e<=s})).sort(((t,e)=>Number(t.value)-Number(e.value))).filter(((t,e,i)=>{const s=Number(t.value);return i.findIndex((t=>Number(t.value)===s))===e})),n=Number(t.horseshoe_labels.distance_min??0),h=[];return o.forEach((t=>{const e=Number(t.value);if(n<=0)return void h.push(t);const i=h[h.length-1];(!i||Math.abs(e-Number(i.value))>=n)&&h.push(t)})),h.length&&(h[0].role="min",h[h.length-1].role="max"),h}(t).map((i=>function(t,e,i={}){const s=Number(i.value),a=void 0!==i.angle?Number(i.angle):e.valueToAngle(s),r=void 0!==i.startValue?e.valueToAngle(Number(i.startValue)):void 0,o=void 0!==i.endValue?e.valueToAngle(Number(i.endValue)):void 0,n=void 0!==r&&void 0!==o?Math.max(1,Math.abs(o-r)):void 0,h=e.radius+Number(t.horseshoe_labels.offset??t.horseshoe_state.width+2),l=e.pointAt(a,h);return{...i,value:s,text:i.text??String(s),role:i.role??"label",angle:a,arcSize:n,radius:h,x:l.x,y:l.y}}(t,e,i)))}const rr={enabled:!0,duration:2500,easing:"ease-out",debug:!1};function or(t){return"string"==typeof t?{start:t,end:t}:t&&"object"==typeof t?{start:t.start??"butt",end:t.end??"butt"}:{start:"butt",end:"butt"}}const nr=["before","current","after"];function hr(t){if(!t)return t;const e={...t};return nr.forEach((t=>{e[t]&&(e[t]={...e[t],styles:ft.toStyleDict(e[t].styles)})})),e.state_map&&(e.state_map={...e.state_map,map:(e.state_map.map??[]).map((t=>{const e={...t,styles:ft.toStyleDict(t.styles)};return nr.forEach((t=>{e[t]&&(e[t]={...e[t],styles:ft.toStyleDict(e[t].styles)})})),e}))}),e}function lr(t){const e=Number(t.min),i=Number(t.max);return e>=0||i<=0?0:Ks((0-e)/(i-e),0,1)}function cr(t,e,i){let s=e.state;if(i?.attribute&&void 0!==e.attributes?.[i.attribute]&&(s=e.attributes[i.attribute]),"rank_state"===t.state_map?.type){const i=t.colorstops,a=Number(s);let r=i.colors[i.colors.length-1];if(a<=Number(i.colors[0].value))r=i.colors[0];else if(a>=Number(i.colors[i.colors.length-1].value))r=i.colors[i.colors.length-1];else for(let t=0;t<i.colors.length-1;t+=1){const e=i.colors[t],s=i.colors[t+1];if(a>=Number(e.value)&&a<Number(s.value)){r=e;break}}const o=new Map;i.colors.forEach((t=>{const e=String(t.rank);o.has(e)||o.set(e,t.color)}));const n={...t.state_map,map:t.state_map.map.map(((t,e)=>({...t,value:e+.5,color:t.color??o.get(String(t.rank))})))},h=n.map.findIndex((t=>String(t.rank)===String(r.rank))),l={...n.map[h],color:r.color,source_value:s,source_color_stop:r},c={...i,colors:n.map.map(((t,e)=>({value:e,color:t.color,rank:t.rank,state:t.state})))},d={...t.horseshoe_scale,min:0,max:n.map.length},u=c.colors[0],p=c.colors[c.colors.length-1];return{config:{...t,sourceColorStops:i,colorstops:c,colorstopsMinMax:vt.normalize({[d.min]:u.color,[d.max]:p.color}),horseshoe_scale:d,state_map:n,mapped_state:l},rawState:e.state,mappedState:l,value:Number(l.value)}}const a=t.state_map?function(t,e,i){return t.find((t=>void 0!==t.state?String(t.state)===String(e):void 0!==t.value&&String(t.value)===String(i)))}(t.state_map.map,e.state,s):void 0,r=Number(a?.value??s);return{config:{...t,mapped_state:a},rawState:e.state,mappedState:a,value:r}}var dr,ur,pr,gr,mr;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.quote_decimal="quote_decimal",t.space_comma="space_comma",t.none="none"}(dr||(dr={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(ur||(ur={})),function(t){t.local="local",t.server="server"}(pr||(pr={})),function(t){t.language="language",t.system="system",t.DMY="DMY",t.MDY="MDY",t.YMD="YMD"}(gr||(gr={})),function(t){t.language="language",t.monday="monday",t.tuesday="tuesday",t.wednesday="wednesday",t.thursday="thursday",t.friday="friday",t.saturday="saturday",t.sunday="sunday"}(mr||(mr={}));var fr=Number.isNaN||function(t){return"number"==typeof t&&t!=t};function yr(t,e){if(t.length!==e.length)return!1;for(var i=0;i<t.length;i++)if(s=t[i],a=e[i],!(s===a||fr(s)&&fr(a)))return!1;var s,a;return!0}function vr(t,e){void 0===e&&(e=yr);var i=null;function s(){for(var s=[],a=0;a<arguments.length;a++)s[a]=arguments[a];if(i&&i.lastThis===this&&e(s,i.lastArgs))return i.lastResult;var r=t.apply(this,s);return i={lastResult:r,lastArgs:s,lastThis:this},r}return s.clear=function(){i=null},s}const br=Intl.DateTimeFormat?.().resolvedOptions?.().timeZone,_r=br??"UTC",xr=(t,e)=>t===pr.local&&br?_r:e;vr(((t,e)=>new Intl.DateTimeFormat(t.language,{weekday:"long",month:"long",day:"numeric",timeZone:xr(t.time_zone,e)})));const wr=(t,e,i)=>$r(e,i.time_zone).format(t),$r=vr(((t,e)=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric",timeZone:xr(t.time_zone,e)})));vr(((t,e)=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"short",day:"numeric",timeZone:xr(t.time_zone,e)}))),vr(((t,e)=>{const i=t.date_format===gr.system?void 0:t.language;return t.date_format===gr.language||(t.date_format,gr.system),new Intl.DateTimeFormat(i,{year:"numeric",month:"numeric",day:"numeric",timeZone:xr(t.time_zone,e)})}));const kr=(t,e,i)=>Sr(e,i.time_zone).format(t),Sr=vr(((t,e)=>new Intl.DateTimeFormat(t.language,{day:"numeric",month:"short",timeZone:xr(t.time_zone,e)})));vr(((t,e)=>new Intl.DateTimeFormat(t.language,{month:"long",year:"numeric",timeZone:xr(t.time_zone,e)}))),vr(((t,e)=>new Intl.DateTimeFormat(t.language,{month:"long",timeZone:xr(t.time_zone,e)}))),vr(((t,e)=>new Intl.DateTimeFormat(t.language,{month:"short",timeZone:xr(t.time_zone,e)}))),vr(((t,e)=>new Intl.DateTimeFormat(t.language,{year:"numeric",timeZone:xr(t.time_zone,e)}))),vr(((t,e)=>new Intl.DateTimeFormat(t.language,{weekday:"long",timeZone:xr(t.time_zone,e)}))),vr(((t,e)=>new Intl.DateTimeFormat(t.language,{weekday:"short",timeZone:xr(t.time_zone,e)}))),vr(((t,e)=>new Intl.DateTimeFormat(t.language,{weekday:"short",month:"short",day:"numeric",timeZone:xr(t.time_zone,e)}))),vr(((t,e)=>new Intl.DateTimeFormat(t.language,{weekday:"short",month:"short",day:"numeric",year:"numeric",timeZone:xr(t.time_zone,e)})));const Mr=vr((t=>{if(t.time_format===ur.language||t.time_format===ur.system){const e=t.time_format===ur.language?t.language:void 0;return new Date("January 1, 2023 22:00:00").toLocaleString(e).includes("10")}return t.time_format===ur.am_pm})),Ar=(t,e,i)=>Tr(e,i.time_zone).format(t),Tr=vr(((t,e)=>new Intl.DateTimeFormat(t.language,{hour:"numeric",minute:"2-digit",hourCycle:Mr(t)?"h12":"h23",timeZone:xr(t.time_zone,e)})));vr(((t,e)=>new Intl.DateTimeFormat(t.language,{hour:Mr(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hourCycle:Mr(t)?"h12":"h23",timeZone:xr(t.time_zone,e)}))),vr(((t,e)=>new Intl.DateTimeFormat(t.language,{weekday:"long",hour:Mr(t)?"numeric":"2-digit",minute:"2-digit",hourCycle:Mr(t)?"h12":"h23",timeZone:xr(t.time_zone,e)}))),vr(((t,e)=>new Intl.DateTimeFormat("en-GB",{hour:"numeric",minute:"2-digit",hour12:!1,timeZone:xr(t.time_zone,e)})));const Cr=(t,e,i)=>Er(e,i.time_zone).format(t),Er=vr(((t,e)=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric",hour:Mr(t)?"numeric":"2-digit",minute:"2-digit",hourCycle:Mr(t)?"h12":"h23",timeZone:xr(t.time_zone,e)})));vr((()=>new Intl.DateTimeFormat(void 0,{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}))),vr(((t,e)=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"short",day:"numeric",hour:Mr(t)?"numeric":"2-digit",minute:"2-digit",hourCycle:Mr(t)?"h12":"h23",timeZone:xr(t.time_zone,e)}))),vr(((t,e)=>new Intl.DateTimeFormat(t.language,{month:"short",day:"numeric",hour:Mr(t)?"numeric":"2-digit",minute:"2-digit",hourCycle:Mr(t)?"h12":"h23",timeZone:xr(t.time_zone,e)}))),vr(((t,e)=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric",hour:Mr(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hourCycle:Mr(t)?"h12":"h23",timeZone:xr(t.time_zone,e)})));const Ir=t=>t<10?`0${t}`:t,Nr=(t,e)=>{const i=e.days||0,s=e.hours||0,a=e.minutes||0,r=e.seconds||0,o=e.milliseconds||0;return i>0?`${Intl.NumberFormat(t.language,{style:"unit",unit:"day",unitDisplay:"long"}).format(i)} ${s}:${Ir(a)}:${Ir(r)}`:s>0?`${s}:${Ir(a)}:${Ir(r)}`:a>0?`${a}:${Ir(r)}`:r>0?Intl.NumberFormat(t.language,{style:"unit",unit:"second",unitDisplay:"long"}).format(r):o>0?Intl.NumberFormat(t.language,{style:"unit",unit:"millisecond",unitDisplay:"long"}).format(o):null};vr((t=>new Intl.DurationFormat(t.language,{style:"long"}))),vr((t=>new Intl.DurationFormat(t.language,{style:"digital",hoursDisplay:"auto"})));const Rr=["min","h","d"],Dr=vr((t=>new Intl.DurationFormat(t.language,{style:"narrow",daysDisplay:"always"}))),Pr=vr((t=>new Intl.DurationFormat(t.language,{style:"narrow",hoursDisplay:"always"}))),zr=vr((t=>new Intl.DurationFormat(t.language,{style:"narrow",minutesDisplay:"always"}))),Gr=(t,e,i,s)=>{const a=void 0!==s?((t,e=2)=>Math.round(t*10**e)/10**e)(parseFloat(e),s):parseFloat(e);switch(i){case"d":{const e=Math.floor(a),i={days:e,hours:Math.floor(24*(a-e))};return Dr(t).format(i)}case"h":{const e=Math.floor(a),i={hours:e,minutes:Math.floor(60*(a-e))};return Pr(t).format(i)}case"min":{const e=Math.floor(a),i={minutes:e,seconds:Math.floor(60*(a-e))};return zr(t).format(i)}default:throw new Error("Invalid duration unit")}},Br=(t,e,i)=>{const s=e?(t=>{switch(t.number_format){case dr.comma_decimal:return["en-US","en"];case dr.decimal_comma:return["de","es","it"];case dr.space_comma:return["fr","sv","cs"];case dr.quote_decimal:return["de-CH"];case dr.system:return;default:return t.language}})(e):void 0;return e?.number_format===dr.none||Number.isNaN(Number(t))?Number.isNaN(Number(t))||""===t||e?.number_format!==dr.none?[{type:"literal",value:t}]:new Intl.NumberFormat("en-US",Lr(t,{...i,useGrouping:!1})).formatToParts(Number(t)):new Intl.NumberFormat(s,Lr(t,i)).formatToParts(Number(t))},Fr=(t,e)=>{const i=e?.display_precision;return null!=i?{maximumFractionDigits:i,minimumFractionDigits:i}:Number.isInteger(Number(t?.attributes?.step))&&Number.isInteger(Number(t?.state))?{maximumFractionDigits:0}:void 0},Lr=(t,e)=>{const i={maximumFractionDigits:2,...e};if("string"!=typeof t)return i;if(!e||void 0===e.minimumFractionDigits&&void 0===e.maximumFractionDigits){const e=t.indexOf(".")>-1?t.split(".")[1].length:0;i.minimumFractionDigits=e,i.maximumFractionDigits=e}return i},jr=(t,e)=>"°"===t?"":e&&"%"===t?(t=>{switch(t.language){case"cs":case"de":case"fi":case"fr":case"sk":case"sv":return" ";default:return""}})(e):" ",Or=["timestamp","uptime"],Hr=(t,e,i,s,a,r,o)=>{const n=r?.[e.entity_id];return Vr(t,i,s,a,n,e.entity_id,e.attributes,e.state)},Vr=(t,e,i,s,a,r,o,n)=>Ur(t,e,i,s,a,r,o,n).map((t=>t.value)).join(""),Ur=(t,e,i,s,a,r,o,n)=>{if(n===ha||n===na)return[{type:"value",value:t(`state.default.${n}`)}];const h=bt(r),l="counter"===h||"number"===h||"input_number"===h;if(((t,e)=>!!t.unit_of_measurement||!!t.state_class||(e||[]).includes(t.device_class||""))(o,"sensor"===h?i:[])||l){if("duration"===o.device_class&&o.unit_of_measurement&&Rr.includes(o.unit_of_measurement))try{return[{type:"value",value:Gr(e,n,o.unit_of_measurement,a?.display_precision)}]}catch(c){}if("monetary"===o.device_class){let t=[];try{t=Br(n,e,{style:"currency",currency:o.unit_of_measurement,minimumFractionDigits:2,...Fr({state:n,attributes:o},a)})}catch(c){}if(t.length){const e={integer:"value",group:"value",decimal:"value",fraction:"value",minusSign:"value",plusSign:"value",literal:"literal",currency:"unit"},i=[];for(const s of t){const t=e[s.type];if(!t)continue;const a=i[i.length-1];"value"===t&&"value"===a?.type?a.value+=s.value:i.push({type:t,value:s.value})}return i}}const i=((t,e,i)=>Br(t,e,i).map((t=>t.value)).join(""))(n,e,Fr({state:n,attributes:o},a)),s=a?.translation_key&&t(`component.${a.platform}.entity.${h}.${a.translation_key}.unit_of_measurement`)||o.unit_of_measurement;return s?[{type:"value",value:i},{type:"literal",value:jr(s,e)},{type:"unit",value:s}]:[{type:"value",value:i}]}if(["date","input_datetime","time"].includes(h))try{const t=n.split(" ");if(2===t.length)return[{type:"value",value:Cr(new Date(t.join("T")),{...e,time_zone:pr.local},s)}];if(1===t.length){if(n.includes("-"))return[{type:"value",value:wr(new Date(`${n}T00:00`),{...e,time_zone:pr.local},s)}];if(n.includes(":")){const t=new Date;return[{type:"value",value:Ar(new Date(`${t.toISOString().split("T")[0]}T${n}`),{...e,time_zone:pr.local},s)}]}}return[{type:"value",value:n}]}catch(d){return[{type:"value",value:n}]}if(["ai_task","button","conversation","event","image","infrared","input_button","notify","radio_frequency","scene","stt","tag","tts","wake_word","datetime"].includes(h)||"sensor"===h&&Or.includes(o.device_class))try{return[{type:"value",value:Cr(new Date(n),e,s)}]}catch(c){return[{type:"value",value:n}]}return[{type:"value",value:a?.translation_key&&t(`component.${a.platform}.entity.${h}.${a.translation_key}.state.${n}`)||o.device_class&&t(`component.${h}.entity_component.${o.device_class}.state.${n}`)||t(`component.${h}.entity_component._.state.${n}`)||n}]};function qr(t,e,i){const s=[];for(let a=t;a<=e+1e-9;a+=i)s.push(Number(a.toFixed(10)));return s}function Xr(t){return t?.show?.tickmarks??t?.show?.ticks}function Yr(t,e,i,s,a,r){if(!i||!s.length)return[];const o=ft.toStyleDict(i.styles),n={...o,"stroke-width":o["stroke-width"]??0},h=e.radius+Number(i.offset??0),l=Number(i.width);if(!Number.isFinite(l)||l<=0)throw new Error(`[horseshoe-tickmarks] Missing or invalid ${a} tick width`);const c=Number(i.thickness);return s.map(((s,d)=>{const u=e.valueToAngle(s),p="minor"===a&&r?.has(s)?Math.min(c,r.get(s)):c;"minor"===a&&(t.debug_ticks||t.dev?.debug_ticks)&&console.log("[horseshoe-tickmarks] minor thickness",{value:s,configuredThickness:c,maxThickness:r?.get(s),finalThickness:p,limited:r?.has(s)&&p!==c});const g=function(t,e,i,s){const a=t?.color_mode;return"colorstop"===a?va.calculateStrokeColor(i,s.colorstops,!1):"colorstopgradient"===a?va.calculateStrokeColor(i,s.colorstops,!0):t?.color??e.fill}(i,o,s,t),m={...n,fill:g??o.fill};if(void 0===g&&t.dev?.debug_colors&&console.log("[horseshoe-tickmarks] unresolved tick fill",{layerName:a,value:s,colorMode:i.color_mode,colorstops:t.colorstops}),"circle"===i.shape){const t=e.pointAt(u,h);return{key:`${a}-${d}`,shape:"circle",x:t.x,y:t.y,radius:Number(i.radius??l/2),value:s,thickness:p,startAngle:u,endAngle:u,styles:m,className:"major"===a?"horseshoe__tick-major":"horseshoe__tick-minor"}}const f=l,y=function(t,e){return Number(t)/(2*Math.PI*e)*360}(p,h),v=u-y/2,b=u+y/2,_=function(t,e,i){return qa.buildBandPath({geometry:t,arc:e,band:i})}(e,{key:`${a}-${d}`,startAngle:v,endAngle:b,startCap:"butt",endCap:"butt"},{radius:h,width:f});return{key:`${a}-${d}`,path:_,value:s,thickness:p,startAngle:v,endAngle:b,styles:m,className:"major"===a?"horseshoe__tick-major":"horseshoe__tick-minor"}})).filter((t=>t.path||"circle"===t.shape))}function Wr(t,e){if(!Xr(t))return[];const i=t.horseshoe_tickmarks;if(!i?.ticks_major&&!i?.ticks_minor)return[];const s=Number(t.horseshoe_scale.min),a=Number(t.horseshoe_scale.max),r=i.ticks_major,o=i.ticks_minor,n=Number(r?.ticksize),h=Number(o?.ticksize),l=Number.isFinite(n)&&n>0?qr(s,a,n):[],c=Number.isFinite(h)&&h>0?qr(s,a,h).filter((t=>!(Number.isFinite(n)&&n>0)||!function(t,e,i){const s=(t-e)/i;return Math.abs(s-Math.round(s))<1e-9}(t,s,n))):[],d=new Map;if(("splineorg"===t.horseshoe_scale.type||"spline"===t.horseshoe_scale.type)&&l.length>1&&c.length){const i=e.radius+Number(o.offset??0),s=Number(r.thickness),a=l.slice(0,-1).map(((t,i)=>Math.abs(e.valueToAngle(l[i+1])-e.valueToAngle(t)))),n=a[1]??a[0];for(let r=0;r<l.length-1;r+=1){const a=l[r],p=l[r+1],g=c.filter((t=>t>a&&t<p));if(g.length){const r=Math.abs(e.valueToAngle(p)-e.valueToAngle(a)),l=(u=i,Number(r)/360*(2*Math.PI*u)),c=Math.max(0,l-s),m=Math.abs(p-a)/h,f=Math.min(1,r/n),y=Math.min(c/m,Number(o.thickness)*f);(t.debug_ticks||t.dev?.debug_ticks)&&console.log("[horseshoe-tickmarks] spline minor interval",{scaleType:t.horseshoe_scale.type,majorStartValue:a,majorEndValue:p,minorValues:g,majorGapDegrees:r,referenceMajorGapDegrees:n,intervalRatio:f,minorRadius:i,majorGapArcLength:l,majorThickness:s,availableMinorArcLength:c,minorTickSize:h,minorSlotsBetweenMajorTicks:m,configuredMinorThickness:Number(o.thickness),maxMinorThickness:y}),g.forEach((t=>{d.set(t,y)}))}}}var u;return[...Yr(t,e,o,c,"minor",d),...Yr(t,e,r,l,"major")]}class Jr extends Ia{static setConfig(t,e,i,s){const a=Jr.getLegacyRootConfig(t);return[...a?[a]:[],...[...Array.isArray(t.layout?.horseshoes_v2)?t.layout.horseshoes_v2:[],...Array.isArray(t.layout?.horseshoes)?t.layout.horseshoes:[]]].filter(Boolean).map(((t,e)=>Jr.applyLegacyTickmarkCompat(t))).map(((t,a)=>new Jr(function(t,e,i){const s=t.entity_index??0,a=i.getGroupForItem(t);return{entity_index:s,...t,group_config:a,index:e,show:{horseshoe:!0,horseshoe_style:"fixed",labels_at:"none",...t.show??{}}}}(t,a,s.groupManager),a,e,i,s))).filter((t=>!1!==t.show?.horseshoe))}static getLegacyRootConfig(t){const e=["entity_index","show","horseshoe_position","horseshoe_scale","horseshoe_state","horseshoe_background","horseshoe_labels","horseshoe_tickmarks","color_stops","colorstops","styles","bar_mode","radius","tickmarks_radius","arc_degrees","start_angle","rotate","flip","xpos","ypos","yposc"];if(!e.filter((t=>"show"!==t&&"styles"!==t&&"entity_index"!==t)).some((e=>void 0!==t[e])))return;const i={};return e.forEach((e=>{void 0!==t[e]&&(i[e]=t[e])})),Object.keys(i).length?i:void 0}static applyLegacyTickmarkCompat(t){if(!0!==t.show?.scale_tickmarks)return t;const e=t.horseshoe_tickmarks??{};if(e.ticks_major||e.ticks_minor)return{...t,show:{...t.show,tickmarks:t.show.tickmarks??t.show.ticks??!0}};const i=t.horseshoe_scale??{},s=Number(i.min??0),a=Number(i.max??100)-s,r=i.ticksize??(a?a/10:void 0),o=Number(t.radius??45),n=Number(t.tickmarks_radius??43),h=Number(i.width??6);return{...t,show:{...t.show,tickmarks:!0},horseshoe_tickmarks:{...e,ticks_major:{ticksize:r,shape:"circle",radius:h/2,width:h,thickness:h,offset:n-o,styles:[...Array.isArray(e.styles)?e.styles:e.styles?[e.styles]:[],{fill:i.color??"var(--primary-background-color)"}]}}}}constructor(t,e,i,s,a){super(t,e,i,s,a,"horseshoes_v2","horseshoes_v2",0),this.show=t.show,this.entity=void 0,this.entityConfig=void 0,this.rawState=void 0,this.value=void 0,this.displayValue=void 0,this.mappedState=void 0,this.normalizedConfig=void 0,this.geometryConfigSignature=void 0,this.scale=void 0,this.geometry=void 0,this.valueAnimator={frame:void 0,startTime:void 0,fromValue:void 0,toValue:void 0,animating:!1},this.statePathElements=new Map,this.pathItemCache=new Map,this.pathItemCacheKey=void 0}setState(t,e){super.setState(t,e),!this.configChanged&&this.normalizedConfig||(this.config.group_config=this.card.groupManager.getGroupForItem(this.config),this.normalizedConfig=function(t,e){const i={horseshoe:!0,horseshoe_style:"fixed",labels_at:"none",...t.show??{}};if(!t.horseshoe_scale)throw new Error("[V2] Missing horseshoe_scale");const s={min:0,max:100,width:6,color:"var(--primary-background-color)",linecap:"round",type:"linear",...t.horseshoe_scale??{}};if(void 0===s.min)throw new Error("[V2] Missing horseshoe_scale.min");if(void 0===s.max)throw new Error("[V2] Missing horseshoe_scale.max");if(!s.type)throw new Error("[V2] Missing horseshoe_scale.type");if(("splineorg"===s.type||"spline"===s.type)&&!s.spline)throw new Error("[V2] Missing horseshoe_scale.spline");const a={width:12,color:"var(--primary-color)",linecap:"round",mode:"value",segment_gap:2,animation:rr,...t.horseshoe_state??{}},r={...t.horseshoe_background??{}},o={offset:12,...t.horseshoe_labels??{}},n={...t.horseshoe_tickmarks??{}},h=t.state_map??a.state_map,l=vt.ensureMinimumStops(t.colorstops,s.max);let c=vt.normalize();if(l.colors.length>0){const t=l.colors[0],i=l.colors[l.colors.length-1];c=vt.normalize({[s.min]:t.color,[s.max]:i.color},e)}const d=t.radius??45,u=t.tickmarks_radius??43,p=t.arc_degrees??260,g=t.bar_mode??"normal",m="bidirectional"===g||"bidirectional_symmetrical"===g,f=t.group_config,y=t.xpos??t.horseshoe_position?.xpos??t.horseshoe_position?.cx??50,v=t.yposc||(t.ypos??t.horseshoe_position?.ypos??t.horseshoe_position?.cy??50),b=f?f.xpos+y-50:y,_=f?f.ypos+v-50:v,x=f?{xpos:f.xpos/100*_a,ypos:f.ypos/100*_a}:void 0;return{...t,show:i,group_config:f?{...f,svg:x}:f,xpos:b,ypos:_,radius:d,tickmarks_radius:u,arc_degrees:p,svg:{xpos:b/100*_a,ypos:_/100*_a,radius:d/100*_a,tickmarks_radius:u/100*_a},start_angle:t.start_angle??90+(360-p)/2,bar_mode:g,zero_ratio:t.zero_ratio??(m?.5:lr(s)),state_map:h,colorstops:l,colorstopsMinMax:c,horseshoe_background:{...r,styles:{...ft.toStyleDict(r.styles)}},horseshoe_scale:{...s,linecap:or(s.linecap),styles:{fill:s.color,...ft.toStyleDict(s.styles)}},horseshoe_state:{...a,animation:{...rr,...a.animation??{}},linecap:or(a.linecap),styles:{fill:a.color,...ft.toStyleDict(a.styles)}},horseshoe_labels:{...o,stringstate_level:hr(o.stringstate_level),stringstate_mode:hr(o.stringstate_mode),background:{...o.background??{},styles:{...ft.toStyleDict(o.background?.styles)}},badges:{...o.badges??{},styles:{...ft.toStyleDict(o.badges?.styles)}},styles:{fill:"var(--primary-text-color)","font-size":"6px",...ft.toStyleDict(o.styles)}},horseshoe_tickmarks:{...n,background:{...n.background??{},styles:{...ft.toStyleDict(n.background?.styles)}},ticks_major:n.ticks_major?{...n.ticks_major,styles:{...ft.toStyleDict(n.ticks_major?.styles)}}:n.ticks_major,ticks_minor:n.ticks_minor?{...n.ticks_minor,styles:{...ft.toStyleDict(n.ticks_minor?.styles)}}:n.ticks_minor}}}(this.config,this.card.getActiveColorStopMode()));const i=cr(this.normalizedConfig,t,e),s=i.value,a=Number.isFinite(this.displayValue)?this.displayValue:s;this.config=i.config,this.config.state_map=this.buildStateMapDisplayLabels(this.config.state_map,t);const r=this.config.state_map?.map?.find((t=>t.state===i.mappedState?.state&&Number(t.value)===Number(i.mappedState?.value)));let o=i.mappedState;r&&(o={...i.mappedState,...r,color:i.mappedState?.color??r.color}),this.config.mapped_state=o,this.zpos=Number(this.config.zpos)+Number(this.config.dzpos),this.rawState=i.rawState,this.mappedState=o,this.value=s;const n=JSON.stringify({horseshoe_scale:this.config.horseshoe_scale,svg:this.config.svg,arc_degrees:this.config.arc_degrees,start_angle:this.config.start_angle,rotate:this.config.rotate,flip:this.config.flip,group_config:this.config.group_config,bar_mode:this.config.bar_mode,zero_ratio:this.config.zero_ratio});n!==this.geometryConfigSignature&&(this.scale=new Ga(this.config.horseshoe_scale),this.geometry=new Ba(this.config,this.scale),this.geometryConfigSignature=n),this.refreshPathItemCacheKey();"stringstate_mode"===this.config.horseshoe_state.mode||"stringstate_level"===this.config.horseshoe_state.mode?this.displayValue=this.value:Number.isFinite(this.displayValue)?this.displayValue!==this.value&&this.startValueAnimation({fromValue:a,toValue:this.value}):this.displayValue=this.value}buildStateMapDisplayLabels(t,e){return t?.map?"rank_state"===t.type?t:{...t,map:t.map.map((t=>{const i=String(t.state??t.value),s={...e,state:i},a=this.card._hass.formatEntityState?.(e,i),r=this.card._hass.formatEntityState?.(s),o=Hr(this.card._hass.localize,s,this.card._hass.locale,[],this.card._hass.config,this.card._hass.entities),n=[a,r,o].find((t=>void 0!==t&&t!==i))??a??r??o;return(this.config?.dev?.debug_state_map||this.config?.debug_state_map)&&console.log("[horseshoe-state-map] display label",{entity_id:e.entity_id,activeState:e.state,state:i,formattedState:a,formattedStateEntity:r,computedState:o,displayLabel:n,entry:t}),{...t,display_label:n??t.display_label}}))}:t}render(){if(!(Number.isFinite(this.value)&&this.config&&this.scale&&this.geometry))return H``;if(this.card?.config?.palettes&&!this.card.palettesLoaded)return H``;const t=this.geometry.getGroupTransform();return this.renderItemLayers(H`
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
    `)}getPathItemCacheKey(){return JSON.stringify({show:this.config.show,svg:this.config.svg,arc_degrees:this.config.arc_degrees,start_angle:this.config.start_angle,rotate:this.config.rotate,flip:this.config.flip,group_config:this.config.group_config,bar_mode:this.config.bar_mode,zero_ratio:this.config.zero_ratio,colorstops:this.config.colorstops,colorstopsMinMax:this.config.colorstopsMinMax,horseshoe_background:this.config.horseshoe_background,horseshoe_scale:this.config.horseshoe_scale,horseshoe_state:{width:this.config.horseshoe_state.width,linecap:this.config.horseshoe_state.linecap,mode:this.config.horseshoe_state.mode,segment_gap:this.config.horseshoe_state.segment_gap,color:this.config.horseshoe_state.color,styles:this.config.horseshoe_state.styles},state_map:this.config.state_map,mapped_state:this.config.mapped_state,horseshoe_labels:this.config.horseshoe_labels,horseshoe_tickmarks:this.config.horseshoe_tickmarks})}refreshPathItemCacheKey(){const t=this.getPathItemCacheKey();t!==this.pathItemCacheKey&&(this.pathItemCache.clear(),this.pathItemCacheKey=t)}clearPathItemCache(){this.pathItemCache.clear(),this.pathItemCacheKey=void 0}getCachedPathItems(t,e){if(!this.pathItemCache.has(t)){va.unresolvedColor=!1;const i=e();if(va.unresolvedColor)return i;this.pathItemCache.set(t,i)}return this.pathItemCache.get(t)}renderHorseshoeBackground(){const t=this.getCachedPathItems("horseshoeBackgroundItems",(()=>function(t,e){const i=t.show.horseshoe_background??"none",s=t.horseshoe_background??{};return Ya(t,e,{mode:i,config:s,radius:e.radius+Number(s.offset??0),width:Number(s.width??t.horseshoe_scale.width??t.horseshoe_state.width??6),gap:Number(s.gap??t.colorstops?.gap??0),keyPrefix:"horseshoe-background"})}(this.config,this.geometry)));return function(t,e,i,s){return Ha(0,i,{layerClass:"horseshoe__background-layer",itemClass:"horseshoe__background",styles:t.horseshoe_background.styles,applyColorFilter:s})}(this.config,this.geometry,t,(t=>this.getRenderStyles(t,[this.config.horseshoe_background?.color_filter])))}renderScale(){const t=this.getCachedPathItems("scalePathItems",(()=>function(t,e){const i=Xa(t,e),s={radius:e.radius,width:t.horseshoe_scale.width};return i.map(((t,i)=>({key:t.key??`scale-arc-${i}`,arc:t,path:qa.buildBandPath({geometry:e,arc:t,band:s})})))}(this.config,this.geometry)));return function(t,e,i,s=(t=>t)){const a={...t.horseshoe_scale.styles};return H`
    <g class="horseshoe__scale-layer" style=${mt(s(a))}>
      ${i.map((e=>{const i={fill:e.arc.color??t.horseshoe_scale.color??a.fill??"none"};return e.path?H`
              <path
                class="horseshoe__scale"
                d=${e.path}
                style=${mt(s(i,e))}
              ></path>
            `:H``}))}
    </g>
  `}(this.config,this.geometry,t,(t=>this.getRenderStyles(t,[this.config.horseshoe_scale?.color_filter])))}renderState(){const t=ir(this.config,this.geometry,this.displayValue??this.value);return Oa(this.config,this.geometry,t,this.cardId,this.index,(t=>this.getRenderStyles(t,[this.config.horseshoe_state?.color_filter])))}renderTickmarks(){return function(t,e=(t=>t)){return t.length?H`
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
              style=${mt(e(t.styles??{},t))}
            ></circle>
          `:H`
            <path
              class="${t.className}"
              d="${t.path}"
              data-value="${t.value??""}"
              data-thickness="${t.thickness??""}"
              data-start-angle="${t.startAngle??""}"
              data-end-angle="${t.endAngle??""}"
              style=${mt(e(t.styles??{},t))}
            ></path>
          `))}
    </g>
  `:H``}(this.getCachedPathItems("tickPathItems",(()=>Wr(this.config,this.geometry))),((t,e)=>{const i="horseshoe__tick-major"===e.className?this.config.horseshoe_tickmarks?.ticks_major:this.config.horseshoe_tickmarks?.ticks_minor;return this.getRenderStyles(t,[this.config.horseshoe_tickmarks?.color_filter,i?.color_filter])}))}renderTickmarkBackground(){const t=this.getCachedPathItems("tickmarkBackgroundItems",(()=>function(t,e){if(!Xr(t))return[];const i=t.show.tick_background??"none",s=t.horseshoe_tickmarks??{},a=s.background??{},r=s.ticks_major??{},o=s.ticks_minor??{};return Ya(t,e,{mode:i,config:a,radius:e.radius+Number(a.offset??r.offset??o.offset??0),width:Number(a.width??r.width??o.width??4),gap:Number(a.gap??0),keyPrefix:"tick-background"})}(this.config,this.geometry)));return function(t,e,i){return Ha(0,i,{layerClass:"horseshoe__tick-background-layer",itemClass:"horseshoe__tick-background",styles:t.horseshoe_tickmarks.background.styles})}(this.config,this.geometry,t)}renderLabels(){const t=this.getCachedPathItems("labelItems",(()=>ar(this.config,this.geometry)));return function(t,e,i,s,a,r=(t=>t)){const o={...t.horseshoe_labels.styles};return H`
    <g class="horseshoe__labels-layer" style=${mt(r(o))}>
      ${a.map(((a,o)=>Fa.renderLabel({horseshoeIndex:s,index:o,label:a.text,styles:a.styles,relation:a.relation,ellipsis:t.horseshoe_labels.ellipsis,angle:a.angle,arcSize:t.horseshoe_labels.arc_size??a.arcSize,cx:e.cx,cy:e.cy,radius:a.radius,cardId:i,orientation:t.horseshoe_labels.orientation??"arc",isMin:"min"===a.role,isMax:"max"===a.role,transformContext:e.getTransformContext(),inverseTransform:e.getInverseGroupTransform(),applyColorFilter:r})))}
    </g>
  `}(this.config,this.geometry,this.cardId,this.index,t,(t=>this.getRenderStyles(t,[this.config.horseshoe_labels?.color_filter])))}renderLabelBackground(){const t=this.getCachedPathItems("labelBackgroundItems",(()=>function(t,e){const i=t.show.label_background??"none",s=t.horseshoe_labels.background??{};return Ya(t,e,{mode:i,config:s,radius:e.radius+Number(t.horseshoe_labels.offset??t.horseshoe_state.width+2),width:Number(s.width??6),gap:Number(s.gap??0),keyPrefix:"label-background"})}(this.config,this.geometry)));return function(t,e,i,s){return Ha(0,i,{layerClass:"horseshoe__label-background-layer",itemClass:"horseshoe__label-background",styles:t.horseshoe_labels.background.styles,applyColorFilter:s})}(this.config,this.geometry,t,(t=>this.getRenderStyles(t,[this.config.horseshoe_labels?.background?.color_filter])))}renderLabelBadges(){const t=this.getCachedPathItems("labelItems",(()=>ar(this.config,this.geometry)));return function(t,e,i,s,a,r=(t=>t)){if(!a.length||!t.show.label_badges)return H``;const o={...t.horseshoe_labels.badges.styles};return H`
    <g class="horseshoe__label-badges-layer" style=${mt(r(o))}>
      ${a.map(((a,r)=>Fa.renderLabelBadge({horseshoeIndex:s,index:r,label:a.text,angle:a.angle,cx:e.cx,cy:e.cy,radius:a.radius,cardId:i,orientation:t.horseshoe_labels.orientation??"arc",badge:t.horseshoe_labels.badges??{}})))}
    </g>
  `}(this.config,this.geometry,this.cardId,this.index,t,(t=>this.getRenderStyles(t,[this.config.horseshoe_labels?.badges?.color_filter])))}getStateAnimationConfig(){return t=this.config,{...Na,...t?.horseshoe_state?.animation??{}};var t}startValueAnimation(t={}){const e=this.getStateAnimationConfig();Ra(this.valueAnimator,e,t,{onUpdate:t=>{this.displayValue=t,this.updateStatePathDom({value:this.displayValue})},onComplete:t=>{this.displayValue=t,this.updateStatePathDom({value:this.displayValue})}})}updateStatePathDom(t={}){if(!this.config||!this.geometry||!this.scale)return;const e=Number(t.value??this.displayValue??this.value),i=ir(this.config,this.geometry,e);Va(this.config,i,this.statePathElements,this.card,this.cardId,this.index,(t=>this.getRenderStyles(t,[this.config.horseshoe_state?.color_filter])))}}class Zr extends Ia{static setConfig(t,e,i,s){return(t.layout?.rectangles??[]).map(((t,a)=>new Zr(t,a,e,i,s)))}constructor(t,e,i,s,a){const r={radius:0,...t};"object"==typeof r.width&&(r.width={padding:0,...r.width}),"object"==typeof r.height&&(r.height={padding:0,...r.height}),r.fit&&(r.fit={...r.fit,padding:{x:1.5,y:.5,...r.fit.padding}}),super(r,e,i,s,a,"rectangles","rectangles",void 0),this.config.svg=this.calculateSvgDimensions()}setState(t,e){super.setState(t,e),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config))}calculateSvgDimensions(t=this.config){let e,i,s;if(t.fit){const a=this.card.getItemGeometry(t.fit);e={xpos:a.xpos,ypos:a.ypos},i=ka.calculateSvgDimension(a.width+2*t.fit.padding.x),s=ka.calculateSvgDimension(a.height+2*t.fit.padding.y)}else e=this.card._calculateSvgCoordinatesInGroup(t),i=ka.calculateSvgDimension(this.card.getItemWidth(t.width)),s=ka.calculateSvgDimension(this.card.getItemHeight(t.height));const a="object"==typeof t.radius?t.radius:{all:t.radius},r=Math.min(s,i)/2,o=t=>Math.min(r,Math.max(0,ka.calculateSvgDimension(t)));return e.width=i,e.height=s,e.x=e.xpos-i/2,e.y=e.ypos-s/2,e.radiusTopLeft=o(a.top_left??a.left??a.top??a.all),e.radiusTopRight=o(a.top_right??a.right??a.top??a.all),e.radiusBottomLeft=o(a.bottom_left??a.left??a.bottom??a.all),e.radiusBottomRight=o(a.bottom_right??a.right??a.bottom??a.all),e}buildRoundedRectanglePath(){const t=this.config.svg;return`\n      M ${t.x+t.radiusTopLeft} ${t.y}\n      h ${t.width-t.radiusTopLeft-t.radiusTopRight}\n      q ${t.radiusTopRight} 0 ${t.radiusTopRight} ${t.radiusTopRight}\n      v ${t.height-t.radiusTopRight-t.radiusBottomRight}\n      q 0 ${t.radiusBottomRight} -${t.radiusBottomRight} ${t.radiusBottomRight}\n      h -${t.width-t.radiusBottomRight-t.radiusBottomLeft}\n      q -${t.radiusBottomLeft} 0 -${t.radiusBottomLeft} -${t.radiusBottomLeft}\n      v -${t.height-t.radiusBottomLeft-t.radiusTopLeft}\n      q 0 -${t.radiusTopLeft} ${t.radiusTopLeft} -${t.radiusTopLeft}\n      Z\n    `}render(){this.config.svg=this.calculateSvgDimensions(this.config);const t=this.getStyles({fill:"var(--primary-background-color)",stroke:"none","stroke-width":0});return this.applyColorStops(t,"fill"),this.renderItemLayers(H`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <path
          @click=${t=>this.handlePopup(t)}
          class="rectangle-tool"
          d="${this.buildRoundedRectanglePath()}"
          style=${mt(this.getRenderStyles(t))}
        ></path>
      </g>
    `)}}class Kr extends Ia{static setConfig(t,e,i,s){return[...(t.layout?.lines??[]).map((t=>Kr.normalizeLineConfig(t,"lines"))),...(t.layout?.hlines??[]).map((t=>Kr.normalizeLineConfig(t,"hlines"))),...(t.layout?.vlines??[]).map((t=>Kr.normalizeLineConfig(t,"vlines")))].map(((t,a)=>new Kr(t,a,e,i,s)))}static normalizeLineConfig(t,e){let i=t.orientation??"horizontal";return"hlines"===e&&(i="horizontal"),"vlines"===e&&(i="vertical"),{...t,orientation:i,animation_section:e}}constructor(t,e,i,s,a){const r={orientation:"horizontal",length:10,xpos:50,ypos:50,...t};super(r,e,i,s,a,r.animation_section,r.animation_section,void 0),this.validateOrientation(this.config.orientation),this.config.svg=this.calculateSvgDimensions()}setState(t,e){super.setState(t,e),this.configChanged&&(this.validateOrientation(this.config.orientation),this.config.svg=this.calculateSvgDimensions(this.config))}validateOrientation(t){if(!["horizontal","vertical","fromto"].includes(t))throw Error(`LineTool::validateOrientation - invalid orientation '${t}' [horizontal, vertical, fromto]`)}calculateSvgDimensions(t=this.config){if("fromto"===t.orientation){const e=t.start??{xpos:t.x1,ypos:t.y1},i=t.end??{xpos:t.x2,ypos:t.y2},s=this.card._calculateSvgCoordinatesInGroup({...t,xpos:e.xpos??e.x,ypos:e.ypos??e.y}),a=this.card._calculateSvgCoordinatesInGroup({...t,xpos:i.xpos??i.x,ypos:i.ypos??i.y});return{xpos:(s.xpos+a.xpos)/2,ypos:(s.ypos+a.ypos)/2,x1:s.xpos,y1:s.ypos,x2:a.xpos,y2:a.ypos}}const e=this.card._calculateSvgCoordinatesInGroup(t),i=ka.calculateSvgDimension(t.length);return"vertical"===t.orientation?{...e,length:i,x1:e.xpos,y1:e.ypos-i/2,x2:e.xpos,y2:e.ypos+i/2}:{...e,length:i,x1:e.xpos-i/2,y1:e.ypos,x2:e.xpos+i/2,y2:e.ypos}}render(){const t=this.getStyles({"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2"});return this.applyColorStops(t,"stroke"),this.renderItemLayers(H`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <line
          @click=${t=>this.handlePopup(t)}
          class="line-tool"
          x1="${this.config.svg.x1}"
          y1="${this.config.svg.y1}"
          x2="${this.config.svg.x2}"
          y2="${this.config.svg.y2}"
          style=${mt(this.getRenderStyles(t))}
        ></line>
      </g>
    `)}}class Qr extends Ia{static setConfig(t,e,i,s){return(t.layout?.circles??[]).map(((t,a)=>new Qr(t,a,e,i,s)))}constructor(t,e,i,s,a){super({radius:0,...t},e,i,s,a,"circles","circles",void 0),this.config.svg=this.calculateSvgDimensions()}setState(t,e){super.setState(t,e),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config))}calculateSvgDimensions(t=this.config){const e=this.card._calculateSvgCoordinatesInGroup(t);return e.radius=void 0!==t.radius_percent?ka.calculateSvgDimension(t.radius_percent):t.radius,e}render(){const t=this.getStyles({});return this.applyColorStops(t,"stroke"),this.renderItemLayers(H`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <circle
          @click=${t=>this.handlePopup(t)}
          class="circle-tool"
          cx="${this.config.svg.xpos}"
          cy="${this.config.svg.ypos}"
          r="${this.config.svg.radius}"
          style=${mt(this.getRenderStyles(t))}
        ></circle>
      </g>
    `)}}class to extends Ia{static setConfig(t,e,i,s){return(t.layout?.arcs??[]).map(((t,a)=>new to(t,a,e,i,s)))}constructor(t,e,i,s,a){super({xpos:50,ypos:50,radius:45,arc_degrees:260,rotate:0,flip:"none",...t},e,i,s,a,"arcs","arcs",void 0),this.config.svg=this.calculateSvgDimensions()}setState(t,e){super.setState(t,e),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config))}calculateSvgDimensions(t=this.config){const e=this.card._calculateSvgCoordinatesInGroup(t),i=ka.calculateSvgDimension(t.radius),s=Number(t.arc_degrees),a=90+(360-s)/2+Number(t.rotate),r=a+s,o=a*Math.PI/180,n=r*Math.PI/180;return e.radius=i,e.arcDegrees=s,e.largeArcFlag=Math.abs(s)>180?1:0,e.sweepFlag=s>=0?1:0,e.startX=e.xpos+i*Math.cos(o),e.startY=e.ypos+i*Math.sin(o),e.endX=e.xpos+i*Math.cos(n),e.endY=e.ypos+i*Math.sin(n),e}buildArcPath(){const t=this.config.svg;return Math.abs(t.arcDegrees)>=360?`\n        M ${t.xpos-t.radius} ${t.ypos}\n        A ${t.radius} ${t.radius} 0 1 1 ${t.xpos+t.radius} ${t.ypos}\n        A ${t.radius} ${t.radius} 0 1 1 ${t.xpos-t.radius} ${t.ypos}\n        Z\n      `:`\n      M ${t.startX} ${t.startY}\n      A ${t.radius} ${t.radius} 0 ${t.largeArcFlag} ${t.sweepFlag} ${t.endX} ${t.endY}\n      Z\n    `}render(){const t=this.getStyles({fill:"var(--primary-background-color)",stroke:"none","stroke-width":0});return this.applyColorStops(t,"fill"),this.renderItemLayers(H`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <path
          @click=${t=>this.handlePopup(t)}
          class="arc-tool"
          d="${this.buildArcPath()}"
          style=${mt(this.getRenderStyles(t))}
        ></path>
      </g>
    `)}}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const eo=(t,e)=>{const i=t._$AN;if(void 0===i)return!1;for(const s of i)s._$AO?.(e,!1),eo(s,e);return!0},io=t=>{let e,i;do{if(void 0===(e=t._$AM))break;i=e._$AN,i.delete(t),t=e}while(0===i?.size)},so=t=>{for(let e;e=t._$AM;t=e){let i=e._$AN;if(void 0===i)e._$AN=i=new Set;else if(i.has(t))break;i.add(t),oo(e)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ao(t){void 0!==this._$AN?(io(this),this._$AM=t,so(this)):this._$AM=t}function ro(t,e=!1,i=0){const s=this._$AH,a=this._$AN;if(void 0!==a&&0!==a.size)if(e)if(Array.isArray(s))for(let r=i;r<s.length;r++)eo(s[r],!1),io(s[r]);else null!=s&&(eo(s,!1),io(s));else eo(this,t)}const oo=t=>{t.type==ct&&(t._$AP??=ro,t._$AQ??=ao)};class no extends ut{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,i){super._$AT(t,e,i),so(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(eo(this,t),io(this))}setValue(t){if((t=>void 0===t.strings)(this._$Ct))this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}const ho=new WeakMap,lo=dt(class extends no{render(t){return U}update(t,[e]){const i=e!==this.G;return i&&void 0!==this.G&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=e,this.ht=t.options?.host,this.rt(this.ct=t.element)),U}rt(t){if(this.isConnected||(t=void 0),"function"==typeof this.G){const e=this.ht??globalThis;let i=ho.get(e);void 0===i&&(i=new WeakMap,ho.set(e,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,t),void 0!==t&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return"function"==typeof this.G?ho.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});class co extends Ia{static setConfig(t,e,i,s){return(t.layout?.names??[]).map(((t,a)=>new co(t,a,e,i,s)))}constructor(t,e,i,s,a){super(t,e,i,s,a,"names"),this.config.svg=this.calculateSvgDimensions(),this.name="",this.setTextElement=t=>{t&&(this.textElement=t)},this.textElementId=`${this.cardId}-name-${this.index}`,this.characterWidthFactor=.6,this.textFontSize=9,this.estimatedWidth=0,this.estimatedHeight=this.textFontSize,this.measuredWidth=0,this.measuredHeight=0,this.measuredXpos=this.config.svg.xpos,this.measuredYpos=this.config.svg.ypos,this.hasExactMeasurement=!1,this.textMeasurementSignature=""}setState(t,e){super.setState(t,e),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config)),this.name=this.textEllipsis(this.buildName(),this.config.max_characters??this.config.ellipsis);const i=this.getStyles({"font-size":"1.5em"}),s=`${this.name}|${JSON.stringify(i)}`;s!==this.textMeasurementSignature&&(this.textMeasurementSignature=s,this.estimatedWidth=this.name.length*this.textFontSize*this.characterWidthFactor,this.estimatedHeight=this.textFontSize,this.hasExactMeasurement=!1)}getWidth(){return this.hasExactMeasurement?this.measuredWidth:this.estimatedWidth}getHeight(){return this.hasExactMeasurement?this.measuredHeight:this.estimatedHeight}getXpos(){return this.hasExactMeasurement?this.measuredXpos:this.config.svg.xpos}getYpos(){return this.hasExactMeasurement?this.measuredYpos:this.config.svg.ypos}updated(){const t=this.textElement.getBBox(),e=.5*t.width,i=.5*t.height,s=t.x+t.width/2,a=t.y+t.height/2;this.textFontSize=.5*Number.parseFloat(window.getComputedStyle(this.textElement.firstElementChild).fontSize);if(!this.hasExactMeasurement||e!==this.measuredWidth||i!==this.measuredHeight||s!==this.measuredXpos||a!==this.measuredYpos){if(this.name.length>0){const t=e/this.name.length/this.textFontSize;this.characterWidthFactor=.8*this.characterWidthFactor+.2*t}this.measuredWidth=e,this.measuredHeight=i,this.measuredXpos=s,this.measuredYpos=a,this.hasExactMeasurement=!0,this.card.requestUpdate()}}calculateSvgDimensions(t=this.config){return this.card._calculateSvgCoordinatesInGroup(t)}buildName(){return this.entity.label?this.card._hass.localize(`ui.components.statistics_charts.statistic_types.${this.entity.label}`)||this.entity.label:this.entityConfig.name??this.entity.name??this.entity.attributes.friendly_name??this.entity?.entity_id??"?"}render(){const t=this.getStyles({"font-size":"1.5em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"});return this.applyColorStops(t,"stroke"),this.renderItemLayers(H`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text ${lo(this.setTextElement)} id="${this.textElementId}" @click=${t=>this.handlePopup(t)}>
          <tspan
            class="entity__name"
            x="${this.config.svg.xpos}"
            y="${this.config.svg.ypos}"
            style=${mt(this.getRenderStyles(t))}>
            ${this.name}</tspan>
        </text>
      </g>
    `)}}class uo extends Ia{static setConfig(t,e,i,s){return(t.layout?.areas??[]).map(((t,a)=>new uo(t,a,e,i,s)))}constructor(t,e,i,s,a){super(t,e,i,s,a,"areas"),this.config.svg=this.calculateSvgDimensions(),this.area="",this.setTextElement=t=>{t&&(this.textElement=t)},this.textElementId=`${this.cardId}-area-${this.index}`,this.characterWidthFactor=.6,this.textFontSize=6,this.estimatedWidth=0,this.estimatedHeight=this.textFontSize,this.measuredWidth=0,this.measuredHeight=0,this.measuredXpos=this.config.svg.xpos,this.measuredYpos=this.config.svg.ypos,this.hasExactMeasurement=!1,this.textMeasurementSignature=""}setState(t,e){super.setState(t,e),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config)),this.area=this.textEllipsis(this.buildArea(),this.config.max_characters??this.config.ellipsis);const i=this.getStyles({"font-size":"1em"}),s=`${this.area}|${JSON.stringify(i)}`;s!==this.textMeasurementSignature&&(this.textMeasurementSignature=s,this.estimatedWidth=this.area.length*this.textFontSize*this.characterWidthFactor,this.estimatedHeight=this.textFontSize,this.hasExactMeasurement=!1)}getWidth(){return this.hasExactMeasurement?this.measuredWidth:this.estimatedWidth}getHeight(){return this.hasExactMeasurement?this.measuredHeight:this.estimatedHeight}getXpos(){return this.hasExactMeasurement?this.measuredXpos:this.config.svg.xpos}getYpos(){return this.hasExactMeasurement?this.measuredYpos:this.config.svg.ypos}updated(){const t=this.textElement.getBBox(),e=.5*t.width,i=.5*t.height,s=t.x+t.width/2,a=t.y+t.height/2;this.textFontSize=.5*Number.parseFloat(window.getComputedStyle(this.textElement.firstElementChild).fontSize);if(!this.hasExactMeasurement||e!==this.measuredWidth||i!==this.measuredHeight||s!==this.measuredXpos||a!==this.measuredYpos){if(this.area.length>0){const t=e/this.area.length/this.textFontSize;this.characterWidthFactor=.8*this.characterWidthFactor+.2*t}this.measuredWidth=e,this.measuredHeight=i,this.measuredXpos=s,this.measuredYpos=a,this.hasExactMeasurement=!0,this.card.requestUpdate()}}calculateSvgDimensions(t=this.config){return this.card._calculateSvgCoordinatesInGroup(t)}buildArea(){if(this.entityConfig.area)return this.entityConfig.area;if(!this.card._hass||!this.card._hass.areas)return"";const t=this.card._hass.entities&&this.card._hass.entities[this.entityConfig.entity];let e=t?t.area_id:null;if(!e&&t&&t.device_id&&this.card._hass.devices){const i=this.card._hass.devices[t.device_id];e=i?i.area_id:null}if(e){const t=this.card._hass.areas[e];return t?t.name:""}return"?"}render(){const t=this.getStyles({"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"});return this.applyColorStops(t,"stroke"),this.renderItemLayers(H`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text ${lo(this.setTextElement)} id="${this.textElementId}" @click=${t=>this.handlePopup(t)}>
          <tspan
            class="entity__area"
            x="${this.config.svg.xpos}"
            y="${this.config.svg.ypos}"
            style=${mt(this.getRenderStyles(t))}>
            ${this.area}</tspan>
        </text>
      </g>
    `)}}var po=function(){return po=Object.assign||function(t){for(var e,i=1,s=arguments.length;i<s;i++)for(var a in e=arguments[i])Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t},po.apply(this,arguments)};var go={second:45,minute:45,hour:22,day:5};const mo=vr((t=>new Intl.DateTimeFormat(t.language,{weekday:"long",month:"long",day:"numeric"}))),fo=vr((t=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric"}))),yo=vr((t=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"numeric",day:"numeric"}))),vo=(t,e)=>bo(e).format(t),bo=vr((t=>new Intl.DateTimeFormat(t.language,{day:"numeric",month:"short"}))),_o=vr((t=>new Intl.DateTimeFormat(t.language,{month:"long",year:"numeric"}))),xo=vr((t=>new Intl.DateTimeFormat(t.language,{month:"long"})));vr((t=>new Intl.DateTimeFormat(t.language,{year:"numeric"})));const wo=vr((t=>new Intl.DateTimeFormat(t.language,{weekday:"long"}))),$o=vr((t=>new Intl.DateTimeFormat(t.language,{weekday:"short"})));var ko;!function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(ko=ko||(ko={}));const So=vr((t=>{if(t.time_format===ko.language||t.time_format===ko.system){const e=t.time_format===ko.language?t.language:void 0,i=(new Date).toLocaleString(e);return i.includes("AM")||i.includes("PM")}return t.time_format===ko.am_pm})),Mo=vr((t=>new Intl.DateTimeFormat("en"!==t.language||So(t)?t.language:"en-u-hc-h23",{hour:"numeric",minute:"2-digit",hour12:So(t)}))),Ao=vr((t=>new Intl.DateTimeFormat("en"!==t.language||So(t)?t.language:"en-u-hc-h23",{hour:So(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:So(t)}))),To=vr((t=>new Intl.DateTimeFormat("en"!==t.language||So(t)?t.language:"en-u-hc-h23",{weekday:"long",hour:So(t)?"numeric":"2-digit",minute:"2-digit",hour12:So(t)}))),Co=t=>Eo().format(t),Eo=vr((()=>new Intl.DateTimeFormat("en-GB",{hour:"numeric",minute:"2-digit",hour12:!1}))),Io=vr((t=>new Intl.DateTimeFormat("en"!==t.language||So(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"long",day:"numeric",hour:So(t)?"numeric":"2-digit",minute:"2-digit",hour12:So(t)}))),No=vr((t=>new Intl.DateTimeFormat("en"!==t.language||So(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"short",day:"numeric",hour:So(t)?"numeric":"2-digit",minute:"2-digit",hour12:So(t)}))),Ro=vr((t=>new Intl.DateTimeFormat("en"!==t.language||So(t)?t.language:"en-u-hc-h23",{month:"short",day:"numeric",hour:So(t)?"numeric":"2-digit",minute:"2-digit",hour12:So(t)}))),Do=vr((t=>new Intl.DateTimeFormat("en"!==t.language||So(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"long",day:"numeric",hour:So(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:So(t)}))),Po=vr((t=>new Intl.DateTimeFormat("en"!==t.language||So(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit",hour12:So(t)}))),zo=(t,e=2)=>{let i=`${t}`;for(let s=1;s<e;s++)i=parseInt(i)<10**s?`0${i}`:i;return i};const Go={ms:1,s:1e3,min:6e4,h:36e5,d:864e5},Bo=(t,e)=>function(t){const e=Math.floor(t/1e3/3600),i=Math.floor(t/1e3%3600/60),s=Math.floor(t/1e3%3600%60),a=Math.floor(t%1e3);return e>0?`${e}:${zo(i)}:${zo(s)}`:i>0?`${i}:${zo(s)}`:s>0||a>0?`${s}${a>0?`.${zo(a,3)}`:""}`:null}(parseFloat(t)*Go[e])||"0";class Fo extends Ia{static setConfig(t,e,i,s){return(t.layout?.states??[]).map(((t,a)=>new Fo(t,a,e,i,s)))}static buildState(t,e,i,s){if(void 0===t)return t;if(null===t)return t;if(e.convert){let a,r,o=e.convert.match(/(^\w+)\((\d+)\)/);switch(null===o?a=e.convert:3===o.length&&(a=o[1],r=Number(o[2])),a){case"brightness_pct":t="undefined"===t?"undefined":`${Math.round(t/255*100)}`;break;case"multiply":t=`${Math.round(t*r)}`;break;case"divide":t=`${Math.round(t/r)}`;break;case"rgb_csv":case"rgb_hex":if(e.attribute){let r=i.states[e.entity];switch(r.attributes.color_mode){case"unknown":case"onoff":case"brightness":case"white":break;case"color_temp":if(r.attributes.color_temp_kelvin){let e=Qs(r.attributes.color_temp_kelvin);const i=Ws(e);i[1]<.4&&(i[1]<.1?i[2]=225:i[1]=.4),e=Js(i),e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===a?`${e[0]},${e[1]},${e[2]}`:Ys(e)}else t="rgb_csv"===a?"255,255,255":"#ffffff00";break;case"hs":{let e=Zs([r.attributes.hs_color[0],r.attributes.hs_color[1]/100]);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===a?`${e[0]},${e[1]},${e[2]}`:Ys(e)}break;case"rgb":{const e=Ws(s?.attributes?.rgb_color??r.attributes.rgb_color);e[1]<.4&&(e[1]<.1?e[2]=225:e[1]=.4);const i=Js(e);t="rgb_csv"===a?i.toString():Ys(i)}break;case"rgbw":{let e=(t=>{const[e,i,s,a]=t;return sa([e,i,s,a],[e+a,i+a,s+a])})(r.attributes.rgbw_color);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===a?`${e[0]},${e[1]},${e[2]}`:Ys(e)}break;case"rgbww":{let e=ra(r.attributes.rgbww_color,r.attributes?.min_color_temp_kelvin,r.attributes?.max_color_temp_kelvin);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===a?`${e[0]},${e[1]},${e[2]}`:Ys(e)}break;case"xy":if(r.attributes.hs_color){let e=Zs([r.attributes.hs_color[0],r.attributes.hs_color[1]/100]);const i=Ws(e);i[1]<.4&&(i[1]<.1?i[2]=225:i[1]=.4),e=Js(i),e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===a?`${e[0]},${e[1]},${e[2]}`:Ys(e)}else if(r.attributes.color){let e={};e.l=r.attributes.brightness,e.h=r.attributes.color.h||r.attributes.color.hue,e.s=r.attributes.color.s||r.attributes.color.saturation;let{r:i,g:s,b:o}=va.hslToRgb(e);if("rgb_csv"===a)t=`${i},${s},${o}`;else{t=`#${va.padZero(i.toString(16))}${va.padZero(s.toString(16))}${va.padZero(o.toString(16))}`}}else r.attributes.xy_color}}break;default:console.error(`Unknown converter [${a}] specified for entity [${e.entity}]!`)}}return void 0!==t?Number.isNaN(t)?t:t.toString():void 0}constructor(t,e,i,s,a){t.show={uom:"end",...t.show??{}},super(t,e,i,s,a,"states"),this.config.svg=this.calculateSvgDimensions(),this.state="",this.uom="",this.setTextElement=t=>{t&&(this.textElement=t)},this.textElementId=`${this.cardId}-state-${this.index}`,this.characterWidthFactor=.6,this.textFontSize=6,this.uomFontSize=.6*this.textFontSize,this.measurementWidthBase=0,this.estimatedWidth=0,this.estimatedHeight=this.textFontSize,this.measuredWidth=0,this.measuredHeight=0,this.measuredXpos=this.config.svg.xpos,this.measuredYpos=this.config.svg.ypos,this.hasExactMeasurement=!1,this.textMeasurementSignature=""}setState(t,e){super.setState(t,e),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config)),this.buildStateAndUom();const i=this.getStyles({"font-size":"1em"}),s=this.getUomStyles(i),a=this.config.show.uom,r=`${this.state}|${this.uom}|${a}|${JSON.stringify(i)}|${JSON.stringify(s)}`;if(r!==this.textMeasurementSignature){this.textMeasurementSignature=r;const t=this.state.length*this.textFontSize,e=["end","top","bottom"].includes(a)?this.uom.length*this.uomFontSize:0;this.measurementWidthBase="end"===a?t+e:Math.max(t,e),this.estimatedWidth=this.measurementWidthBase*this.characterWidthFactor,this.estimatedHeight="top"===a||"bottom"===a?this.textFontSize+this.uomFontSize:this.textFontSize,this.hasExactMeasurement=!1}}getWidth(){return this.hasExactMeasurement?this.measuredWidth:this.estimatedWidth}getHeight(){return this.hasExactMeasurement?this.measuredHeight:this.estimatedHeight}getXpos(){return this.hasExactMeasurement?this.measuredXpos:this.config.svg.xpos}getYpos(){return this.hasExactMeasurement?this.measuredYpos:this.config.svg.ypos}updated(){const t=this.textElement.getBBox(),e=.5*t.width,i=.5*t.height,s=t.x+t.width/2,a=t.y+t.height/2;this.textFontSize=.5*Number.parseFloat(window.getComputedStyle(this.textElement.children[0]).fontSize);const r=this.config.show.uom,o=["end","top","bottom"].includes(r);this.uomFontSize=o?.5*Number.parseFloat(window.getComputedStyle(this.textElement.children[1]).fontSize):0;const n=this.state.length*this.textFontSize,h=o?this.uom.length*this.uomFontSize:0;this.measurementWidthBase="end"===r?n+h:Math.max(n,h);if(!this.hasExactMeasurement||e!==this.measuredWidth||i!==this.measuredHeight||s!==this.measuredXpos||a!==this.measuredYpos){if(this.measurementWidthBase>0){const t=e/this.measurementWidthBase;this.characterWidthFactor=.8*this.characterWidthFactor+.2*t}this.measuredWidth=e,this.measuredHeight=i,this.measuredXpos=s,this.measuredYpos=a,this.hasExactMeasurement=!0,this.card.requestUpdate()}}calculateSvgDimensions(t=this.config){return this.card._calculateSvgCoordinatesInGroup(t)}formatStateString(t){const e=this.config?.format||this.entityConfig?.format;if(this.entityConfig.debug&&console.log("StateTool.formatStateString",this.entityConfig.entity,t,e),"string"!=typeof e)return t;const i=this.card._hass.selectedLanguage||this.card._hass.language,s={...this.card._hass.locale,language:i};if(["relative","total","datetime","datetime-short","datetime-short_with-year","datetime_seconds","datetime-numeric","date","date_month","date_month_year","date-short","date-numeric","date_weekday","date_weekday_day","date_weekday-short","time","time-24h","time-24h_date-short","time_weekday","time_seconds"].includes(e)){const a=new Date(t);if(Number.isNaN(a.getTime()))return t;switch(e){case"relative":{const t=function(t,e,i){void 0===e&&(e=Date.now()),void 0===i&&(i={});var s=po(po({},go),i||{}),a=(+t-+e)/1e3;if(Math.abs(a)<s.second)return{value:Math.round(a),unit:"second"};var r=a/60;if(Math.abs(r)<s.minute)return{value:Math.round(r),unit:"minute"};var o=a/3600;if(Math.abs(o)<s.hour)return{value:Math.round(o),unit:"hour"};var n=a/86400;if(Math.abs(n)<s.day)return{value:Math.round(n),unit:"day"};var h=new Date(t),l=new Date(e),c=h.getFullYear()-l.getFullYear();if(Math.round(Math.abs(c))>0)return{value:Math.round(c),unit:"year"};var d=12*c+h.getMonth()-l.getMonth();if(Math.round(Math.abs(d))>0)return{value:Math.round(d),unit:"month"};var u=a/604800;return{value:Math.round(u),unit:"week"}}(a,new Date);return new Intl.RelativeTimeFormat(i,{numeric:"auto"}).format(t.value,t.unit)}case"total":case"precision":return"Not Yet Supported";case"datetime":return((t,e)=>Io(e).format(t))(a,s);case"datetime-short":return((t,e)=>Ro(e).format(t))(a,s);case"datetime-short_with-year":return((t,e)=>No(e).format(t))(a,s);case"datetime_seconds":return((t,e)=>Do(e).format(t))(a,s);case"datetime-numeric":return((t,e)=>Po(e).format(t))(a,s);case"date":return((t,e)=>fo(e).format(t))(a,s);case"date_month":return((t,e)=>xo(e).format(t))(a,s);case"date_month_year":return((t,e)=>_o(e).format(t))(a,s);case"date-short":return vo(a,s);case"date-numeric":return((t,e)=>yo(e).format(t))(a,s);case"date_weekday":return((t,e)=>wo(e).format(t))(a,s);case"date_weekday-short":return((t,e)=>$o(e).format(t))(a,s);case"date_weekday_day":return((t,e)=>mo(e).format(t))(a,s);case"time":return((t,e)=>Mo(e).format(t))(a,s);case"time-24h":return Co(a);case"time-24h_date-short":return Date.now()-a.getTime()<864e5?Co(a):vo(a,s);case"time_weekday":return((t,e)=>To(e).format(t))(a,s);case"time_seconds":return((t,e)=>Ao(e).format(t))(a,s);default:return t}}return Number.isNaN(parseFloat(t))||!Number.isFinite(Number(t))?t:"brightness"===e||"brightness_pct"===e?`${Math.round(t/255*100)} %`:"duration"===e?Bo(t,"s"):t}formatEntityStateParts(){const t=void 0!==this.entityConfig.attribute,e="object"==typeof this.config?.format?this.config.format:"object"==typeof this.entityConfig.format?this.entityConfig.format:{};let i=t?this.entity.attributes[this.entityConfig.attribute]:this.entity.state;if(!0===e.raw_state_keep)return!0===e.raw_state_clean&&"string"==typeof i&&(i=i.replace(/_/g," ")),[{type:"value",value:i}];let s=Fo.buildState(i,this.entityConfig,this.card._hass,this.entity);void 0===this.entityConfig?.format&&void 0===this.config?.format||(s=this.formatStateString(s));const a=this.entity.attributes.source_entity_id?{...this.entity,entity_id:this.entity.attributes.source_entity_id}:this.entity,r=t?this.card._hass.formatEntityAttributeValueToParts(a,this.entityConfig.attribute):this.card._hass.formatEntityStateToParts(a,s);let o;if(!Number.isNaN(Number(i))&&null!==i&&""!==i){const t=e.locale||this.card._hass.locale?.language||this.card._hass.language||"en-US",s=r.find((t=>"value"===t.type)),a=new Intl.NumberFormat(t).formatToParts(1.1).find((t=>"decimal"===t.type)).value,n=String(s.value).lastIndexOf(a),h=-1===n?0:String(s.value).length-n-1,l=void 0!==this.entityConfig.decimals?Number(this.entityConfig.decimals):h,c=e.decimals_max??l;let d=e.decimals_min??l;d>c&&(d=c),o=new Intl.NumberFormat(t,{useGrouping:!1!==e.separator,minimumFractionDigits:d,maximumFractionDigits:c}).format(Number(i))}return r.map((t=>"value"===t.type&&void 0!==o?{...t,value:o}:"unit"===t.type&&void 0!==this.entityConfig.unit?{...t,value:this.entityConfig.unit}:t))}buildStateAndUom(){const t=this.formatEntityStateParts();let e="",i="";t.forEach((t=>{"unit"===t.type?i+=t.value:"value"===t.type&&(e+=t.value)})),this.state=e.trim(),this.uom=this.buildUom(i.trim())}buildUom(t){return this.entityConfig.unit||t||""}getUomStyles(t){const e=this.config.uom??{},i=ft.toStyleDict(e.styles),s=t["font-size"];let a=.5,r="em";const o=String(s).trim().match(/^(\d*\.?\d+)([a-z%]+)$/i);return o?(a=.6*Number(o[1]),r=o[2]):console.error("Cannot determine font-size for state",s),{...t,opacity:"0.7","font-size":`${a}${r}`,...i}}render(){const t=this.getStyles({"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"});this.applyColorStops(t,"fill");const e=this.getUomStyles(t),i=this.config.dx?this.config.dx:"0",s=this.config.dy?this.config.dy:"0",a=this.config.uom??{},r=this.config.show.uom;let o=H``;if("end"===r){const t=a.dx??"0.1",i=a.dy??"-0.45";o=H`<tspan
        class="state__uom"
        dx="${t}em"
        dy="${i}em"
        style=${mt(this.getRenderStyles(e))}
      >${this.uom}</tspan>`}else if("bottom"===r){const t=a.dy??"1.5";o=H`<tspan
        class="state__uom"
        x="${this.config.svg.xpos}"
        dy="${t}em"
        style=${mt(this.getRenderStyles(e))}
      >${this.uom}</tspan>`}else if("top"===r){const t=a.dy??"-1.5";o=H`<tspan
        class="state__uom"
        x="${this.config.svg.xpos}"
        dy="${t}em"
        style=${mt(this.getRenderStyles(e))}
      >${this.uom}</tspan>`}return this.renderItemLayers(H`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text ${lo(this.setTextElement)} id="${this.textElementId}" @click=${t=>this.handlePopup(t)}>
          <tspan
            class="state__value"
            x="${this.config.svg.xpos}"
            y="${this.config.svg.ypos}"
            dx="${i}em"
            dy="${s}em"
            style=${mt(this.getRenderStyles(t))}
          >${this.state}</tspan>${o}
        </text>
      </g>
    `)}}function Lo(t,e,i){if(i||2===arguments.length)for(var s,a=0,r=e.length;a<r;a++)!s&&a in e||(s||(s=Array.prototype.slice.call(e,0,a)),s[a]=e[a]);return t.concat(s||Array.prototype.slice.call(e))}"function"==typeof SuppressedError&&SuppressedError;var jo,Oo={};
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */var Ho=function(){if(jo)return Oo;jo=1;var t=/; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g,e=/^[\u000b\u0020-\u007e\u0080-\u00ff]+$/,i=/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/,s=/\\([\u000b\u0020-\u00ff])/g,a=/([\\"])/g,r=/^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;function o(t){var s=String(t);if(i.test(s))return s;if(s.length>0&&!e.test(s))throw new TypeError("invalid parameter value");return'"'+s.replace(a,"\\$1")+'"'}function n(t){this.parameters=Object.create(null),this.type=t}return Oo.format=function(t){if(!t||"object"!=typeof t)throw new TypeError("argument obj is required");var e=t.parameters,s=t.type;if(!s||!r.test(s))throw new TypeError("invalid type");var a=s;if(e&&"object"==typeof e)for(var n,h=Object.keys(e).sort(),l=0;l<h.length;l++){if(n=h[l],!i.test(n))throw new TypeError("invalid parameter name");a+="; "+n+"="+o(e[n])}return a},Oo.parse=function(e){if(!e)throw new TypeError("argument string is required");var i="object"==typeof e?function(t){var e;"function"==typeof t.getHeader?e=t.getHeader("content-type"):"object"==typeof t.headers&&(e=t.headers&&t.headers["content-type"]);if("string"!=typeof e)throw new TypeError("content-type header is missing from object");return e}(e):e;if("string"!=typeof i)throw new TypeError("argument string is required to be a string");var a=i.indexOf(";"),o=-1!==a?i.slice(0,a).trim():i.trim();if(!r.test(o))throw new TypeError("invalid media type");var h=new n(o.toLowerCase());if(-1!==a){var l,c,d;for(t.lastIndex=a;c=t.exec(i);){if(c.index!==a)throw new TypeError("invalid parameter format");a+=c[0].length,l=c[1].toLowerCase(),34===(d=c[2]).charCodeAt(0)&&-1!==(d=d.slice(1,-1)).indexOf("\\")&&(d=d.replace(s,"$1")),h.parameters[l]=d}if(a!==i.length)throw new TypeError("invalid parameter format")}return h},Oo}(),Vo=new Map,Uo=function(t){return t.cloneNode(!0)},qo=function(){return"file:"===window.location.protocol},Xo=function(t,e,i){var s=new XMLHttpRequest;s.onreadystatechange=function(){try{if(!/\.svg/i.test(t)&&2===s.readyState){var e=s.getResponseHeader("Content-Type");if(!e)throw new Error("Content type not found");var a=Ho.parse(e).type;if("image/svg+xml"!==a&&"text/plain"!==a)throw new Error("Invalid content type: ".concat(a))}if(4===s.readyState){if(404===s.status||null===s.responseXML)throw new Error(qo()?"Note: SVG injection ajax calls do not work locally without adjusting security settings in your browser. Or consider using a local webserver.":"Unable to load SVG file: "+t);if(!(200===s.status||qo()&&0===s.status))throw new Error("There was a problem injecting the SVG: "+s.status+" "+s.statusText);i(null,s)}}catch(r){if(s.abort(),!(r instanceof Error))throw r;i(r,s)}},s.open("GET",t),s.withCredentials=e,s.overrideMimeType&&s.overrideMimeType("image/svg+xml"),s.send()},Yo={},Wo=function(t,e){var i;null!==(i=Yo[t])&&void 0!==i||(Yo[t]=[]),Yo[t].push(e)},Jo=function(t,e,i){if(Vo.has(t)){var s=Vo.get(t);if(void 0===s)return void Wo(t,i);if(s instanceof SVGSVGElement)return void i(null,Uo(s))}Vo.set(t,void 0),Wo(t,i),Xo(t,e,(function(e,i){var s;e?Vo.set(t,e):(null===(s=i.responseXML)||void 0===s?void 0:s.documentElement)instanceof SVGSVGElement&&Vo.set(t,i.responseXML.documentElement),function(t){var e=Yo[t];if(e)for(var i=function(i,s){setTimeout((function(){if(Array.isArray(Yo[t])){var s=Vo.get(t),a=e[i];if(!a)return;s instanceof SVGSVGElement&&a(null,Uo(s)),s instanceof Error&&a(s),i===e.length-1&&delete Yo[t]}}),0)},s=0,a=e.length;s<a;s++)i(s)}(t)}))},Zo=function(t,e,i){Xo(t,e,(function(t,e){var s;t?i(t):(null===(s=e.responseXML)||void 0===s?void 0:s.documentElement)instanceof SVGSVGElement&&i(null,e.responseXML.documentElement)}))},Ko="data:image/svg+xml",Qo=0,tn=[],en={},sn="http://www.w3.org/1999/xlink",an=function(t,e,i,s,a,r,o){var n,h=null!==(n=t.getAttribute("data-src"))&&void 0!==n?n:t.getAttribute("src");if(h){if(-1!==tn.indexOf(t))return tn.splice(tn.indexOf(t),1),void(t=null);tn.push(t),t.setAttribute("src","");var l=h.indexOf("#"),c=-1!==l?h.slice(0,l):h,d=-1!==l?h.slice(l+1):null,u=function(t){if(!t.startsWith(Ko))return null;var e,i=t.slice(18);if(i.startsWith(";base64,"))try{e=atob(i.slice(8))}catch(n){return new Error("Invalid base64 in data URL")}else if(i.startsWith(","))try{e=decodeURIComponent(i.slice(1))}catch(r){return new Error("Invalid encoding in data URL")}else{if(!i.startsWith(";charset=utf-8,"))return new Error("Unsupported data URL format");try{e=decodeURIComponent(i.slice(15))}catch(o){return new Error("Invalid encoding in data URL")}}var s=(new DOMParser).parseFromString(e,"image/svg+xml"),a=s.querySelector("parsererror");return a?new Error("Data URL SVG parse error: "+a.textContent.trim()):s.documentElement instanceof SVGSVGElement?s.documentElement:new Error("Data URL did not contain a valid SVG element")}(c);if(u instanceof Error)return tn.splice(tn.indexOf(t),1),t=null,void o(u);var p=function(s,a){var n,l;if(!a)return tn.splice(tn.indexOf(t),1),t=null,void o(s);var u=a;if(d){var p=function(t,e){var i=t.querySelector("#"+CSS.escape(e));if("symbol"!==(null==i?void 0:i.tagName.toLowerCase()))return null;for(var s=document.createElementNS("http://www.w3.org/2000/svg","svg"),a=i.attributes,r=0,o=a.length;r<o;r++){var n=a[r];"id"!==n.name&&s.setAttribute(n.name,n.value)}var h=i.childNodes;for(r=0,o=h.length;r<o;r++)s.appendChild(h[r].cloneNode(!0));return s}(a,d);if(!p)return tn.splice(tn.indexOf(t),1),t=null,void o(new Error('Symbol "'.concat(d,'" not found in ').concat(c)));u=p}var g=t.getAttribute("id");g&&u.setAttribute("id",g);var m=t.getAttribute("title");m&&u.setAttribute("title",m);var f=t.getAttribute("width");f&&u.setAttribute("width",f);var y=t.getAttribute("height");y&&u.setAttribute("height",y);var v=Array.from(new Set(Lo(Lo(Lo([],(null!==(n=u.getAttribute("class"))&&void 0!==n?n:"").split(" "),!0),["injected-svg"],!1),(null!==(l=t.getAttribute("class"))&&void 0!==l?l:"").split(" "),!0))).join(" ").trim();u.setAttribute("class",v);var b=t.getAttribute("style");b&&u.setAttribute("style",b),u.setAttribute("data-src",h);var _=[].filter.call(t.attributes,(function(t){return/^data-\w[\w-]*$/.test(t.name)}));if(Array.prototype.forEach.call(_,(function(t){t.name&&t.value&&u.setAttribute(t.name,t.value)})),i){var x,w,$,k,S,M={clipPath:["clip-path"],"color-profile":["color-profile"],cursor:["cursor"],filter:["filter"],linearGradient:["fill","stroke"],marker:["marker","marker-start","marker-mid","marker-end"],mask:["mask"],path:[],pattern:["fill","stroke"],radialGradient:["fill","stroke"]},A=function(t,e){return t.replace(/url\((['"]?)\s*#([^\s'"\)]+)\s*\1\)/g,(function(t,i,s){var a=e[s];return a?"url(#".concat(a,")"):t}))},T=function(t,e){if(!t.startsWith("#"))return t;var i=e[t.slice(1)];return i?"#"+i:t},C=[],E={};Object.keys(M).forEach((function(t){x=t;for(var e=0,i=(w=u.querySelectorAll(x+"[id]")).length;e<i;e++){var s=w[e];k=s.id,S=k+"-"+ ++Qo,E[k]=S,C.push({element:s,currentId:k,newId:S})}})),Object.keys(M).forEach((function(t){var e;$=M[t],Array.prototype.forEach.call($,(function(t){for(var i=0,s=(e=u.querySelectorAll("["+t+"]")).length;i<s;i++){var a=e[i],r=a.getAttribute(t);if(r){var o=A(r,E);o!==r&&a.setAttribute(t,o)}}}))}));for(var I=u.querySelectorAll("*"),N=0,R=I.length;N<R;N++){var D=I[N],P=D.getAttribute("href");if(P){var z=T(P,E);z!==P&&D.setAttribute("href",z)}var G=D.getAttributeNS(sn,"href");if(G){var B=T(G,E);B!==G&&D.setAttributeNS(sn,"href",B)}}for(var F=u.querySelectorAll("[style]"),L=0,j=F.length;L<j;L++){var O=F[L],H=O.getAttribute("style");if(H){var V=A(H,E);V!==H&&O.setAttribute("style",V)}}for(var U=u.querySelectorAll("style"),q=0,X=U.length;q<X;q++){var Y=U[q],W=Y.textContent;if(W){var J=A(W,E);J!==W&&(Y.textContent=J)}}for(var Z=0,K=C.length;Z<K;Z++)C[Z].element.id=C[Z].newId}u.removeAttribute("xmlns:a");for(var Q,tt,et=u.querySelectorAll("script"),it=[],st=0,at=et.length;st<at;st++){var rt=et[st];(tt=rt.getAttribute("type"))&&"application/ecmascript"!==tt&&"application/javascript"!==tt&&"text/javascript"!==tt||((Q=rt.innerText||rt.textContent)&&it.push(Q),u.removeChild(rt))}if(it.length>0&&("always"===e||"once"===e&&!en[h])){for(var ot=0,nt=it.length;ot<nt;ot++)new Function(it[ot])(window);en[h]=!0}var ht=u.querySelectorAll("style");if(Array.prototype.forEach.call(ht,(function(t){t.textContent+=""})),u.setAttribute("xmlns","http://www.w3.org/2000/svg"),u.setAttribute("xmlns:xlink",sn),r(u),!t.parentNode)return tn.splice(tn.indexOf(t),1),t=null,void o(new Error("Parent node is null"));t.parentNode.replaceChild(u,t),tn.splice(tn.indexOf(t),1),t=null,o(null,u)};if(u)setTimeout((function(){p(null,u)}),0);else(s?Jo:Zo)(c,a,p)}else o(new Error("Invalid data-src or src attribute"))};const rn={apparent_temperature:"mdi:thermometer",cloud_coverage:"mdi:weather-cloudy",dew_point:"mdi:thermometer-water",humidity:"mdi:water-percent",pressure:"mdi:gauge",temperature:"mdi:thermometer",uv_index:"mdi:sun-wireless",visibility:"mdi:weather-fog",wind_bearing:"mdi:weather-windy",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",precipitation_probability:"mdi:weather-pouring",condition_clear_night:"mdi:weather-night",condition_cloudy:"mdi:weather-cloudy",condition_fog:"mdi:weather-fog",condition_hail:"mdi:weather-hail",condition_lightning:"mdi:weather-lightning",condition_lightning_rainy:"mdi:weather-lightning-rainy",condition_partlycloudy:"mdi:weather-partly-cloudy",condition_pouring:"mdi:weather-pouring",condition_rainy:"mdi:weather-rainy",condition_snowy:"mdi:weather-snowy",condition_snowy_rainy:"mdi:weather-snowy-rainy",condition_sunny:"mdi:weather-sunny",condition_windy:"mdi:weather-windy",condition_windy_variant:"mdi:weather-windy-variant",condition_exceptional:"mdi:alert-circle-outline"},on=(t,e)=>t&&t.components.includes(e),nn={entity:{},entity_component:{}},hn=async(t,e,i)=>((t,e)=>t.sendMessagePromise(e))(t,{type:"frontend/get_icons",category:e,integration:i}),ln=async(t,e,i,s=!1)=>{if(!s&&i in nn.entity)return nn.entity[i];if(!on(t,i)||!((t,e,i,s)=>{const[a,r,o]=t.split(".",3);return Number(a)>e||Number(a)===e&&(void 0===s?Number(r)>=i:Number(r)>i)||void 0!==s&&Number(a)===e&&Number(r)===i&&Number(o)>=s})(e.haVersion,2024,2))return;const a=hn(e,"entity",i).then((t=>t?.resources[i]));return nn.entity[i]=a,nn.entity[i]},cn=async(t,e,i,s=!1)=>!s&&nn.entity_component.resources&&nn.entity_component.domains?.includes(i)?nn.entity_component.resources.then((t=>t[i])):on(e,i)?(nn.entity_component.domains=[...e.components],nn.entity_component.resources=hn(t,"entity_component").then((t=>t.resources)),nn.entity_component.resources.then((t=>t[i]))):void 0,dn=new WeakMap,un=(t,e)=>{if(e)return t&&e.state?.[t]?e.state[t]:void 0!==t&&e.range&&!isNaN(Number(t))?((t,e)=>{let i=dn.get(e);if(i||(i=Object.keys(e).map(Number).filter((t=>!isNaN(t))).sort(((t,e)=>t-e)),dn.set(e,i)),0===i.length)return;if(t<i[0])return;let s=i[0];for(const a of i){if(!(t>=a))break;s=a}return e[s.toString()]})(Number(t),e.range)??e.default:e.default},pn=async(t,e,i,s,a,r)=>{const o=r?.platform,n=r?.translation_key,h=s?.attributes.device_class,l=s?.state;let c;if(n&&o){const s=await ln(t,e,o);if(s){const t=s[i]?.[n];c=un(l,t)}}if(!c&&s&&(c=((t,e)=>{const i=oa(t),s=e??t.state;switch(i){case"device_tracker":return((t,e)=>{const i=e??t.state;return"router"===t?.attributes.source_type?"home"===i?"mdi:lan-connect":"mdi:lan-disconnect":["bluetooth","bluetooth_le"].includes(t?.attributes.source_type)?"home"===i?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===i?"mdi:account-arrow-right":"mdi:account"})(t,s);case"sun":return"above_horizon"===s?"mdi:white-balance-sunny":"mdi:weather-night";case"input_datetime":if(!t.attributes.has_date)return"mdi:clock";if(!t.attributes.has_time)return"mdi:calendar"}})(s,l)),!c){const s=await cn(e,t,i);if(s){const t=h&&s[h]||s._;c=un(l,t)}}return c};class gn extends Ia{static setConfig(t,e,i,s){return(t.layout?.icons??[]).map(((t,a)=>new gn(t,a,e,i,s)))}constructor(t,e,i,s,a){super(t,e,i,s,a,"icons","icons",void 0!==t.icon||void 0!==t.state_map?void 0:0),this.config.svg=this.calculateSvgDimensions(),this.iconId=Math.random().toString(36).substr(2,9),this.iconSvg=void 0,this.pendingIconPath=void 0}setState(t,e){super.setState(t,e),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config))}calculateSvgDimensions(t=this.config){return this.card._calculateSvgCoordinatesInGroup(t)}getGroupScaleTransform(t=this.config){return this.card._getGroupScaleTransform(t)}getGroupScaleStyle(t=this.config){return this.card._getGroupScaleStyle(t)}getStateMapItem(){const t=this.config?.state_map?.map;if(!t)return;const e=this.entity?.state;return t.find((t=>t.state===e))??t.find((t=>"default"===t.state))}buildIcon(t,e=this.config){const i=this.card.animations?.iconsIcon?.[e.animation_id];if(i)return i;if(t?.icon)return t.icon;if(e.icon)return e.icon;if(!this.entity||!this.entityConfig)return;if(this.entityConfig.icon)return this.entityConfig.icon;const s=this.entityConfig.entity,a=this.entityConfig.attribute,r=a?this.entity.attributes?.[a]:void 0,o=this.entity.entity_id?.split(".")[0];if(this.entity.attributes?.icon&&!a)return this.entity.attributes.icon;if(a&&"weather"===o){const t=rn[a];if(t)return t}this.card.entitiesIcon??={},this.card.entitiesIconKey??={},this.card.entitiesIconPending??={};const n=a?`${s}|attribute:${a}`:`${s}|state`,h=a?[s,"attribute",a,r??"",o??"",this.entity.attributes?.device_class??"",this.entity.attributes?.icon??""].join("|"):[s,"state",this.entity.state??"",o??"",this.entity.attributes?.device_class??"",this.entity.attributes?.icon??""].join("|");if(this.card.entitiesIconKey[n]===h)return this.card.entitiesIcon[n];if(this.card.entitiesIconKey[n]=h,!this.card.entitiesIconPending[n]){this.card.entitiesIconPending[n]=!0;const t=a?(async(t,e,i,s)=>{let a;const r=oa(e),o=e.attributes.device_class,n=t.entities?.[e.entity_id],h=n?.platform,l=n?.translation_key,c=s??e.attributes[i];if(l&&h){const e=await ln(t.config,t.connection,h);e&&(a=un(c,e[r]?.[l]?.state_attributes?.[i]))}if(!a){const e=await cn(t.connection,t.config,r);if(e){const t=o&&e[o]?.state_attributes?.[i]||e._?.state_attributes?.[i];a=un(c,t)}}return a})(this.card._hass,this.entity,a,void 0!==r?String(r):void 0):(async(t,e,i,s,a)=>{const r=t?.[s.entity_id];if(r?.icon)return r.icon;const o=oa(s);return pn(e,i,o,s,a,r)})(this.card._hass.entities,this.card._hass.config,this.card._hass.connection,this.entity);t.then((t=>{this.card.entitiesIconKey[n]===h&&t&&this.card.entitiesIcon[n]!==t&&(this.card.entitiesIcon[n]=t,this.card.requestUpdate())})).catch((t=>{console.error(a?"IconTool.buildIcon attributeIcon failed":"IconTool.buildIcon entityIcon failed",s,a??"",t)})).finally((()=>{this.card.entitiesIconPending[n]=!1}))}return this.card.entitiesIcon[n]}isUrlIcon(t){return"string"==typeof t&&/^url\(['"]?.+['"]?\)$/i.test(t.trim())}isSvgUrl(t){return t.endsWith(".svg")}getUrlFromCssUrl(t){return t.trim().replace(/^url\(['"]?/i,"").replace(/['"]?\)$/,"")}injectSvgUrlIcons(){const t=this.card.shadowRoot.querySelectorAll("svg.icon-svg-url[data-src]:not(.injected-svg)");t.length&&function(t,e){var i=void 0===e?{}:e,s=i.afterAll,a=void 0===s?function(){}:s,r=i.afterEach,o=void 0===r?function(){}:r,n=i.beforeEach,h=void 0===n?function(){}:n,l=i.cacheRequests,c=void 0===l||l,d=i.evalScripts,u=void 0===d?"never":d,p=i.httpRequestWithCredentials,g=void 0!==p&&p,m=i.renumerateIRIElements,f=void 0===m||m;if(t&&"length"in t)for(var y=0,v=0,b=t.length;v<b;v++){var _=t[v];_&&an(_,u,f,c,g,h,(function(e,i){o(e,i),t&&"length"in t&&t.length===++y&&a(y)}))}else t?an(t,u,f,c,g,h,(function(e,i){o(e,i),a(1),t=null})):a(0)}(t,{beforeEach(t){t.removeAttribute("height"),t.removeAttribute("width")},afterEach:(t,e)=>{if(t||!e)return;const i=e.dataset.src;i&&(this.card.svgUrlCache[i]=e.cloneNode(!0))},afterAll:()=>{this.card.requestUpdate()},cacheRequests:!1,evalScripts:"once",httpRequestWithCredentials:!1,renumerateIRIElements:!1})}updated(){0===this.index&&this.injectSvgUrlIcons()}renderCachedSvgUrlIcon(t,e,i,s,a,r,o){const n=this.card.svgUrlCache[e].cloneNode(!0),h=t.rotate??0,l=s/24,c=a-s*o+12*l,d=r-.5*s-(t.yposc?0:.25*s)+12*l;return n.classList.remove("hidden"),H`
      <g
        transform="${this.getGroupScaleTransform(t)}"
        style="${this.getGroupScaleStyle(t)}"
      >
        <g
          class="icon-position"
          transform="translate(${c} ${d})"
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

          <g class="icon-style-animation" style="${mt(i)}">
            <g class="icon-rotate" transform="rotate(${h})">
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
    `}renderSvgUrlPlaceholder(t,e,i,s,a,r){const o=t.rotate??0,n=i/24,h=s-i*r+12*n,l=a-.5*i-(t.yposc?0:.25*i)+12*n;return H`
      <g
        transform="${this.getGroupScaleTransform(t)}"
        style="${this.getGroupScaleStyle(t)}"
      >
        <g class="icon-position" transform="translate(${h} ${l})">
          <g class="icon-rotate" transform="rotate(${o})">
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
    `}renderSvgUrlIcon(t,e,i,s,a,r,o){return this.card.svgUrlCache[e]?this.renderCachedSvgUrlIcon(t,e,i,s,a,r,o):this.renderSvgUrlPlaceholder(t,e,s,a,r,o)}renderImageUrlIcon(t,e,i,s,a,r,o){const n=t.rotate??0,h=s/24,l=a-s*o+12*h,c=r-.5*s-(t.yposc?0:.25*s)+12*h;return H`
      <g
        transform="${this.getGroupScaleTransform(t)}"
        style="${this.getGroupScaleStyle(t)}"
      >
        <g
          class="icon-position"
          transform="translate(${l} ${c})"
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

          <g class="icon-style-animation" style="${mt(i)}">
            <g class="icon-rotate" transform="rotate(${n})">
              <g class="icon-scale" transform="scale(${h})">
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
    `}getRenderedHaIconPath(){const t=this.card.shadowRoot.getElementById(`icon-${this.iconId}`);return t?.shadowRoot?.querySelector("*")?.path}render(){const t=this.config,e=this.getStateMapItem();let i=t;e&&(i=Sa.mergeDeep(t,e));const s=void 0!==i.icon_size_percent?Number(i.icon_size_percent)/100*_a:(i.icon_size?i.icon_size:i.size?i.size:2)*xa,a=t.svg.xpos,r=t.svg.ypos,o=i.align?i.align:"center",n="center"===o?.5:"start"===o?-1:1,h=a-s*n,l=r-s*n,c=s,d=this.entity?va.getHaEntityIconStyle(this.entity):{fill:"currentColor",color:"var(--state-icon-color)"},u={};u.fill=d.fill,u.color=d.color,u.filter=d.filter;let p=ft.toStyleDict(i.styles);const g=this.card.animations?.icons?.[i.animation_id]??{},m=this.card._getItemColorFromStops(i);m&&(p.fill=m,p.color=m),p=this.getRenderStyles({...u,...p,...g},i===t?[]:[i.color_filter]);const f=this.buildIcon(e,i);if(this.isUrlIcon(f)){const t=this.getUrlFromCssUrl(f);return this.isSvgUrl(t)?this.renderItemLayers(this.renderSvgUrlIcon(i,t,p,s,a,r,n),i):this.renderItemLayers(this.renderImageUrlIcon(i,t,p,s,a,r,n),i)}if(!f)return H``;if(this.card.iconCache[f])this.iconSvg=this.card.iconCache[f];else if(this.iconSvg=void 0,this.pendingIconPath!==f){this.pendingIconPath=f;let t=0;const e=40,i=50,s=()=>{if(this.pendingIconPath!==f)return;const a=this.getRenderedHaIconPath();if(a)return this.iconSvg=a,this.card.iconCache[f]=a,this.pendingIconPath=void 0,void this.card.requestUpdate();t+=1,t>=e?this.pendingIconPath=void 0:window.setTimeout(s,i)};(this.card?.updateComplete&&"function"==typeof this.card.updateComplete.then?this.card.updateComplete:new Promise((t=>{window.requestAnimationFrame(t)}))).then((()=>{window.setTimeout(s,0)}))}if(this.iconSvg){const t=a-s*n,e=r-.5*s-(i.yposc?0:.25*s),o=s/24,h=i.rotate??0,l=t+12*o,c=e+12*o;return p["transform-origin"]??="0 0",this.renderItemLayers(H`
        <g
          transform="${this.getGroupScaleTransform(i)}"
          style="${this.getGroupScaleStyle(i)}"
        >
          <g
            id="icon-rendered-${this.iconId}"
            class="icon-position"
            transform="translate(${l} ${c})"
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

            <g class="icon-style-animation" style="${mt(p)}">
              <g class="icon-rotate" transform="rotate(${h})">
                <g class="icon-scale" transform="scale(${o})">
                  <g class="icon-center" transform="translate(-12 -12)">
                    <path d="${this.iconSvg}"></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      `,i)}return H`
      <foreignObject
        width="0px"
        height="0px"
        x="${h}"
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
              .icon=${f}
              id="icon-${this.iconId}"
            ></ha-icon>
          </div>
        </body>
      </foreignObject>
    `}}const mn=36e5;class fn{constructor(t,e,i,s,a=[],r=[],o={}){this.aggregateFuncMap={avg:this._average,median:this._median,max:this._maximum,min:this._minimum,first:this._first,last:this._last,sum:this._sum,delta:this._delta,diff:this._diff},this.config=s,this.graphArea={},this.graphArea.x=0,this.graphArea.y=0,this.graphArea.width=t-2*this.graphArea.x,this.graphArea.height=e-2*this.graphArea.y,this.drawArea={},this.drawArea.x=i.l,this.drawArea.y=i.t,this.drawArea.top=i.t,this.drawArea.bottom=i.b,this.drawArea.width=t-(i.l+i.r),this.drawArea.height=e-(i.t+i.b),this._history=void 0,this.coords=[],this.bucketMeta=[],this.stateBandSegments=[],this.xAxis={},this.yAxis={},this.width=t,this.height=e,this.margin=i,this._max=0,this._min=0;const n=this.config.period[this.config.period.type];this.points=n.bins.per_hour||1,this.hours=n.duration.hour||24,this.aggregateFuncName=this.config.sparkline.state_values.aggregate_func,this._calcPoint=this.aggregateFuncMap[this.aggregateFuncName]||this._average,this._smoothing=this.config.sparkline.state_values?.smoothing,this._logarithmic=this.config.sparkline.state_values?.logarithmic,this._groupBy=this.config.period.groupBy,this._endTime=0,this.valuesPerBucket=0,this.levelCount=1,this.gradeValues=a,this.gradeRanks=r,this.stateMap={...o},this.radialBarcodeSize=ka.calculateSvgDimension(this.config.sparkline?.radial_barcode?.size||5)}get max(){return this._max}set max(t){this._max=t}get min(){return this._min}set min(t){this._min=t}set history(t){this._history=t}update(t=void 0){if(t&&(this._history=t),!this._history)return;if(0===this._history?.length)return;if("state_bands"===this.config.sparkline.show.chart_type){if(this.min=Math.min(...this.stateMap.map.map((t=>Number(t.value)))),this.max=Math.max(...this.stateMap.map.map((t=>Number(t.value)))),this.coords=[],this.bucketMeta=[],"rolling_window"===this.config.period.type){const t=this._snapToBin(new Date),e=new Date(t.getTime()-this.config.period.rolling_window.duration.hour*mn);this.bucketMeta=[{start:e},{start:t}]}return void this.buildAxisGeometry()}this._updateEndTime();let e,i=new Date;if(i.getDate(),this.offsetHours=0,"calendar"===this.config.period.type&&"day"===this.config.period?.calendar?.period){this.config.period.calendar.duration.hour;i.getHours(),i.getMinutes(),i.getSeconds(),this.offsetHours=Math.abs(24*this.config.period.calendar.offset)}const s=mn/this.points;switch(this.calendarBucketStartMs=void 0,this.calendarBucketCount=void 0,this.offsetHours=0,this.config.period.type){case"real_time":e=1,this.hours=1;break;case"calendar":if("day"===this.config.period?.calendar?.period){const t=new Date(i);t.setHours(0,0,0,0),t.setHours(t.getHours()+24*this.config.period.calendar.offset-(this.config.period.calendar.duration.hour-24)),0===this.config.period.calendar.offset?(this.calendarBucketCount=Math.ceil((this._endTime.getTime()-t.getTime())/s),this.calendarBucketStartMs=this._endTime.getTime()-this.calendarBucketCount*s):(this.offsetHours=Math.abs(this.config.period.calendar.offset*this.hours),this.calendarBucketCount=Math.round(this.config.period.calendar.duration.hour*mn/s),this.calendarBucketStartMs=t.getTime()),e=this.calendarBucketCount}break;case"rolling_window":e=Math.ceil(this.hours*this.points)}const a=this._history.reduce(((t,e)=>this._reducer(t,e)),[]);a[0]&&a[0].length&&(a[0]=[a[0][a[0].length-1]]),a.length=e;try{this.coords=this._calcPoints(a)}catch(o){console.log("error in calcpoints")}this.min=Math.min(...this.coords.map((t=>Number(t[2])))),this.max=Math.max(...this.coords.map((t=>Number(t[2]))));const r="calendar"===this.config.period.type&&"day"===this.config.period.calendar.period?this.calendarBucketStartMs:this._endTime.getTime()-this.hours*mn;this.bucketMeta=[];for(let n=0;n<a.length;n+=1){const t=a[n],e=this.coords[n],i=new Date(r+n*s),o=new Date(i.getTime()+s),h=t?t.filter(Boolean):[];if(0===h.length)this.bucketMeta[n]={index:n,start:i,end:o,value:e?e[2]:void 0,min:void 0,avg:void 0,max:void 0,count:0};else{const t=h.map((t=>Number(t.state))),s=t.reduce(((t,e)=>t+e),0);this.bucketMeta[n]={index:n,start:i,end:o,value:e?e[2]:void 0,min:Math.min(...t),avg:s/t.length,max:Math.max(...t),count:t.length}}}if(["line","area"].includes(this.config.sparkline.show.chart_type)&&(!0===this.config.sparkline.line?.show_minmax||!0===this.config.sparkline.area?.show_minmax)){const t=this._history.reduce(((t,e)=>this._reducerMinMax(t,e)),[]);t[0][0]&&t[0][0].length&&(t[0][0]=[t[0][0][t[0][0].length-1]]),t[1][0]&&t[1][0].length&&(t[1][0]=[t[1][0][t[1][0].length-1]]),t[0].length=e,t[1].length=e;const i=[...a],s=[...a];let r=this._calcPoint;this._calcPoint=this.aggregateFuncMap.min,this.coordsMin=[],this.coordsMin=this._calcPoints(i),this._calcPoint=this.aggregateFuncMap.max,this.coordsMax=[],this.coordsMax=this._calcPoints(s),this._calcPoint=r,this.min=Math.min(...this.coordsMin.map((t=>Number(t[2])))),this.max=Math.max(...this.coordsMax.map((t=>Number(t[2]))))}this.buildAxisGeometry()}buildAxisGeometry(){const t=this.config.x_axis.labels.styles["font-size"],e=this.config.y_axis.labels.styles["font-size"],i=Number.parseFloat(t),s=Number.parseFloat(e),a=t.endsWith("%")?i/100*xa*.45:t.endsWith("em")||t.endsWith("rem")?i*xa*.45:.45*i,r=e.endsWith("%")?s/100*xa*.85:e.endsWith("em")||e.endsWith("rem")?s*xa*.85:.85*s,o=this.calculateXAxisGeometry(a),n="state_bands"===this.config.sparkline.show.chart_type?this.calculateStateBandsYAxisGeometry():this.calculateYAxisGeometry(r);this.min=n.min,this.max=n.max,this.xAxis=o,this.yAxis=n}calculateXAxisGeometry(t){const e=this.config.period[this.config.period.type],i=new Date,s=mn/this.points;let a,r,o,n;"calendar"===this.config.period.type&&"day"===e.period?(a=new Date(i),a.setHours(0,0,0,0),a.setHours(a.getHours()+24*e.offset-(e.duration.hour-24)),r=new Date(a.getTime()+e.duration.hour*mn-s),o=new Date(a),n=0===e.offset?new Date(this._snapToBin(new Date)):new Date(r)):(a=new Date(this.bucketMeta[0].start),r=new Date(this.bucketMeta[this.bucketMeta.length-1].start),o=new Date(a),n=new Date(r));const h=a.getTime(),l=r.getTime(),c=l-h,d=this.config.x_axis.labels.max_length/5*(1*t+xa),u=Math.floor(this.drawArea.width/d),p=c/(Math.max(u,4)-1),g=[1e3,5e3,15e3,3e4,6e4,3e5,6e5,9e5,18e5,36e5,72e5,144e5,216e5,432e5,864e5,1728e5,6048e5,26298e5];let m=g.findIndex((t=>t>=p));for(m<0&&(m=g.length-1);m>0&&c/g[m]<2;)m-=1;const f=g[m],y=[];let v=h;for(;v<=l;){const t=(v-h)/c;y.push({time:new Date(v),timestamp:v,x:this.drawArea.x+t*this.drawArea.width,isMidnight:0===new Date(v).getHours()&&0===new Date(v).getMinutes()}),v+=f}return{start:a,end:r,dataStart:o,dataEnd:n,interval:f,ticks:y}}calculateStateBandsYAxisGeometry(){const t=this.stateMap.map.concat().sort(((t,e)=>Number(t.value)-Number(e.value))),e=this.drawArea.height/t.length,i=t.map(((i,s)=>{const a=t.length-s-1,r=this.drawArea.y+a*e,o=.25*e,n=r+.1*e,h=r+.5*e,l=.4*e;return{state:i.state,value:Number(i.value),label:i.display_label,y:h+l/2,labelY:n,fontSize:o,bandY:h,bandHeight:l}})),s=t.slice(1).map(((t,i)=>({value:Number(t.value),y:this.drawArea.y+(i+1)*e})));return{min:Number(t[0].value),max:Number(t[t.length-1].value),interval:null,minorInterval:null,ticks:i,gridTicks:s,rows:i}}getStateBands(){const t=this.xAxis.start.getTime(),e=this.xAxis.end.getTime(),i=this.xAxis.dataEnd.getTime(),s=e-t,a=this._history.concat().sort(((t,e)=>new Date(t.last_changed).getTime()-new Date(e.last_changed).getTime())),r=[];return a.forEach((t=>{const e=r[r.length-1];e&&Number(e.state)===Number(t.state)||r.push(t)})),this.stateBandSegments=[],r.forEach(((a,o)=>{const n=Math.max(t,new Date(a.last_changed).getTime()),h=o<r.length-1?new Date(r[o+1].last_changed).getTime():i,l=Math.min(e,i,h);if(n>=l)return;const c=this.yAxis.rows.find((t=>t.value===Number(a.state))),d={state:a.haState,value:Number(a.state),label:c.label,start:new Date(n),end:new Date(l),x:this.drawArea.x+(n-t)/s*this.drawArea.width,y:c.bandY,width:(l-n)/s*this.drawArea.width,height:c.bandHeight,centerY:c.bandY+c.bandHeight/2};this.stateBandSegments.push(d)})),this.yAxis.rows.map((t=>({...t,segments:this.stateBandSegments.filter((e=>e.value===t.value))})))}calculateYAxisGeometry(t){let e=this.min,i=this.max;e===i&&(e-=1,i+=1);const s=1.5*t,a=Math.floor(this.drawArea.height/s),r=Math.max(a,2);if(this._logarithmic){const t=Math.log10(Math.max(1,e)),s=Math.log10(Math.max(1,i)),a=Math.floor(t),r=Math.ceil(s),o=[];for(let n=a;n<=r;n+=1){const a=10**n;if(a>=e&&a<=i){const e=this.drawArea.height+this.drawArea.y-(Math.log10(a)-t)/(s-t)*this.drawArea.height;o.push({value:a,y:e})}}return{min:e,max:i,interval:null,minorInterval:null,ticks:o}}const o=(i-e)/(r-1),n=10**Math.floor(Math.log10(o)),h=o/n;let l;l=h<=1?1:h<=2?2:h<=5?5:10;const c=l*n,d=c/2,u=Math.floor(e/d)*d,p=Math.ceil(i/d)*d,g=[];for(let m=Math.ceil(u/c)*c;m<=p+c/100;m+=c){const t=this.drawArea.height+this.drawArea.y-(m-u)/(p-u)*this.drawArea.height;g.push({value:m,y:t})}return{min:u,max:p,interval:c,minorInterval:d,ticks:g}}_reducerMinMax(t,e){const i=(this._endTime-new Date(e.last_changed).getTime())/mn*this.points-this.hours*this.points,s=i<0?Math.floor(Math.abs(i)):0;return t[0]||(t[0]=[]),t[1]||(t[1]=[]),t[0][s]||(t[0][s]={},t[1][s]={}),t[0][s].state=Math.min(t[0][s].state?t[0][s].state:Number.POSITIVE_INFINITY,e.state),t[0][s].haState=Math.min(t[0][s].haState?t[0][s].haState:Number.POSITIVE_INFINITY,e.haState),t[1][s].state=Math.max(t[1][s].state?t[1][s].state:Number.NEGATIVE_INFINITY,e.state),t[1][s].haState=Math.max(t[1][s].haState?t[1][s].haState:Number.NEGATIVE_INFINITY,e.haState),t}_reducer(t,e){const{type:i}=this.config.period,s=this.config.period[i];let a=this.hours;if("calendar"===i&&"day"===s.period){const t=new Date,e=s.duration.hour-24;a=0===s.offset?t.getHours()+t.getMinutes()/60+e:s.duration.hour}let r,o=this._endTime-new Date(e.last_changed).getTime();if(0===s.offset&&o<0&&(o=0),"rolling_window"===i){const t=a*this.points,e=o/mn*this.points;r=Math.max(0,Math.min(t-1,Math.floor(t-e)))}else if("calendar"===i&&"day"===s.period){const t=mn/this.points;r=Math.floor((new Date(e.last_changed).getTime()-this.calendarBucketStartMs)/t),r=Math.max(0,Math.min(this.calendarBucketCount-1,r))}else{const t=a*this.points-1,e=o/mn*this.points-t;r=e<0?Math.floor(Math.abs(e)):0}return t[r]||(t[r]=[]),t[r].push(e),t}_calcPoints(t){const e=[];let i=this.drawArea.width/(this.hours*this.points-1);i=Number.isFinite(i)?i:this.drawArea.width;const s=t.filter(Boolean)[0];let a=[this._calcPoint(s),this._lastValue(s)];const r=(t,s)=>{const r=i*s+this.drawArea.x;return t&&(a=[this._calcPoint(t),this._lastValue(t)]),e.push([r,0,t?a[0]:a[1]])};for(let o=0;o<t.length;o+=1)r(t[o],o);return e}_calcY(t){const e=this._logarithmic?Math.log10(Math.max(1,this.max)):this.max,i=this._logarithmic?Math.log10(Math.max(1,this.min)):this.min,s=(e-i)/this.drawArea.height||1;return t.map((t=>{const e=this._logarithmic?Math.log10(Math.max(1,t[2])):t[2],a=i<0?Math.abs(i):0;e>0&&Math.max(0,i);this.drawArea.height,this.drawArea.y;const r=e>0?this.drawArea.height+1*this.drawArea.top-a/s-(e-Math.max(0,i))/s:this.drawArea.height+1*this.drawArea.top-(0-i)/s,o=this.drawArea.height+1*this.drawArea.y-(e-i)/s;return[t[0],o,t[2],r]}))}_calcLevelY(t){const e=this._logarithmic?Math.log10(Math.max(1,this.max)):this.max,i=this._logarithmic?Math.log10(Math.max(1,this.min)):this.min,s=(e-i)/this.drawArea.height||1,a=i<0?Math.abs(i):0;let r=[];return t[2].forEach(((t,e)=>{const o=t>=0?this.drawArea.height+1*this.drawArea.top-1*a/s-(t-Math.max(0,i))/s:this.drawArea.height+1*this.drawArea.top-(0-t)/s;return r.push(o),r})),r}getPoints(){let t,e,{coords:i}=this;1===i.length&&(i[1]=[this.drawArea.x+this.drawArea.width,0,i[0][2]]),i=this._calcY(this.coords);let s=i[0];i.shift();const a=i.map(((i,a)=>{t=i,e=this._smoothing?this._midPoint(s[0],s[1],t[0],t[1]):t;const r=this._smoothing?(t[2]+s[2])/2:t[2];return s=t,[e[0],e[1],r,a+1]}));return a}getPath(){let t,e,{coords:i}=this;1===i.length&&(i[1]=[this.drawArea.x+this.drawArea.width,0,i[0][2]]),i=this._calcY(this.coords);let s="",a=i[0];return s+=`M${a[0]},${a[1]}`,i.forEach((i=>{t=i,e=this._smoothing?this._midPoint(a[0],a[1],t[0],t[1]):t,s+=` ${e[0]},${e[1]}`,s+=` Q ${t[0]},${t[1]}`,a=t})),s+=` ${t[0]},${t[1]}`,s}getPathMin(){let t,e,{coordsMin:i}=this;1===i.length&&(i[1]=[this.drawArea.x+this.drawArea.width,0,i[0][2]]),i=this._calcY(this.coordsMin);let s="",a=i[0];return s+=`M${a[0]},${a[1]}`,i.forEach((i=>{t=i,e=t,s+=` ${e[0]},${e[1]}`,s+=` Q ${t[0]},${t[1]}`,a=t})),s+=` ${t[0]},${t[1]}`,s}getPathMax(){let t,e,{coordsMax:i}=this;1===i.length&&(i[1]=[this.drawArea.x+this.drawArea.width,0,i[0][2]]),i=this._calcY(this.coordsMax);let s="",a=i[i.length-1];return i.reverse().forEach(((i,r,o)=>{t=i,e=t,s+=` ${e[0]},${e[1]}`,s+=` Q ${t[0]},${t[1]}`,a=t})),s+=` ${t[0]},${t[1]}`,s+=`M${a[0]},${a[1]}`,s}computeGradient(t,e){const i=e?Math.log10(Math.max(1,this._max))-Math.log10(Math.max(1,this._min)):this._max-this._min,s=i/(this.graphArea.height-this.margin.b)*this.graphArea.height-i;return t.map(((t,a,r)=>{let o,n;if(t.value>this._max&&r[a+1]){const e=(this._max-r[a+1].value)/(t.value-r[a+1].value);o=va.getGradientValue(r[a+1].color,t.color,e)}else if(t.value<this._min&&r[a-1]){const e=(r[a-1].value-this._min)/(r[a-1].value-t.value);o=va.getGradientValue(r[a-1].color,t.color,e)}return n=i<=0?0:e?(Math.log10(Math.max(1,this._max))-Math.log10(Math.max(1,t.value)))*(100/i):(this._max-t.value)*(100/(i+s)),{color:o||t.color,offset:n}}))}getAreaMinMax(t,e){let i=t;return i+=` L ${this.coordsMax[this.coordsMax.length-1][0]},\n                ${this.coordsMax[this.coordsMax.length-1][1]}`,i+=e,i+=" z",i}getArea(t){const e=this._logarithmic?Math.log10(Math.max(1,this.max)):this.max,i=this._logarithmic?Math.log10(Math.max(1,this.min)):this.min,s=(e-i)/this.drawArea.height||1,a=Math.min(e,Math.max(i,0)),r=this.drawArea.y+this.drawArea.height-(a-i)/s;let o=t;return o+=` L ${this.coords[this.coords.length-1][0]}, ${r}`,o+=` L ${this.coords[0][0]}, ${r} z`,o}polarToCartesian(t,e,i,s,a){const r=(a-90)*Math.PI/180;return{x:t+i*Math.cos(r),y:e+s*Math.sin(r)}}_calcRadialBarcodeCoords(t,e,i,s,a,r){const o=this.drawArea.x+this.drawArea.width/2,n=this.drawArea.y+this.drawArea.height/2,h=this.polarToCartesian(o,n,s,a,e),l=this.polarToCartesian(o,n,s,a,t),c=Math.abs(e-t)<=180?"0":"1",d=i?"0":"1",u=s-r,p=a-r;return{start:h,end:l,start2:this.polarToCartesian(o,n,u,p,e),end2:this.polarToCartesian(o,n,u,p,t),largeArcFlag:c,sweepFlag:d}}_calcRadialBarcode(t,e=!1,i=4,s=4){const a=this._logarithmic?Math.log10(Math.max(1,this.max)):this.max,r=this._logarithmic?Math.log10(Math.max(1,this.min)):this.min,o=this.hours*this.points,n=360/o;let h=0;const l=!0,c=(a-r)/this.radialBarcodeSize,d=t.map((t=>{const s=e?this.max:t[2];let a,o;switch(this.config.sparkline.show?.chart_variant){case"sunburst":case"sunburst_centered":a=((this._logarithmic?Math.log10(Math.max(1,s)):s)-r)/c,o=(this.drawArea.width-this.radialBarcodeSize+a)/2;break;case"sunburst_outward":a=((this._logarithmic?Math.log10(Math.max(1,s)):s)-r)/c,o=this.drawArea.width/2-this.radialBarcodeSize+a;break;case"sunburst_inward":a=((this._logarithmic?Math.log10(Math.max(1,s)):s)-r)/c,o=this.drawArea.width/2;break;default:a=this.radialBarcodeSize,o=this.drawArea.width/2}let d=[],u=[],p=[],g=[];const{start:m,end:f,start2:y,end2:v,largeArcFlag:b,sweepFlag:_}=this._calcRadialBarcodeCoords(h+i,h+n-i,l,o,o,a);return h+=n,d.push(m.x,f.x,y.x,v.x),u.push(m.y,f.y,y.y,v.y),p.push(this.drawArea.width/2,this.drawArea.width/2-this.radialBarcodeSize),g.push(this.drawArea.height/2,this.drawArea.height/2-this.radialBarcodeSize),[d,u,s,0,p,g,b,_]}));if(e&&t.length!==o){let e,s;const u=this.max;switch(this.config.sparkline.show?.chart_variant){case"sunburst":case"sunburst_centered":e=((this._logarithmic?Math.log10(Math.max(1,u)):u)-r)/c,s=(this.drawArea.width-this.radialBarcodeSize+e)/2;break;case"sunburst_outward":e=((this._logarithmic?Math.log10(Math.max(1,u)):u)-r)/c,s=this.drawArea.width/2-this.radialBarcodeSize+e;break;case"sunburst_inward":e=((this._logarithmic?Math.log10(Math.max(1,u)):u)-r)/c,s=this.drawArea.width/2;break;default:e=this.radialBarcodeSize,s=this.drawArea.width/2}let p=[];for(let r=t.length;r<o;r++){p[r]={},p[r][0]=r,p[r][1]=0,p[r][2]=a;let t=[],o=[],c=[],g=[];const{start:m,end:f,start2:y,end2:v,largeArcFlag:b,sweepFlag:_}=this._calcRadialBarcodeCoords(h+i,h+n-i,l,s,s,e);h+=n,t.push(m.x,f.x,y.x,v.x),o.push(m.y,f.y,y.y,v.y),c.push(this.drawArea.width/2,this.drawArea.width/2-this.radialBarcodeSize),g.push(this.drawArea.height/2,this.drawArea.height/2-this.radialBarcodeSize),d.push([t,o,u,0,c,g,b,_])}}return d}getRadialBarcodeBackground(t,e,i=4,s=4){this.backgroundCoords=[],this.backgroundCoords=[...this.coords];return this._calcRadialBarcode(this.backgroundCoords,!0,i,s).map(((t,e)=>({start:{x:t[0][0],y:t[1][0]},end:{x:t[0][1],y:t[1][1]},start2:{x:t[0][2],y:t[1][2]},end2:{x:t[0][3],y:t[1][3]},radius:{x:t[4][0],y:t[5][0]},radius2:{x:t[4][1],y:t[5][1]},largeArcFlag:t[6],sweepFlag:t[7],value:t[2]})))}getRadialBarcodeBackgroundPaths(){return this.radialBarcodeBackground.map(((t,e)=>{let i,s,a,r,o="0";if(["flower2","flower","rice_grain"].includes(this.config.sparkline.show?.chart_viz)){if("flower"===this.config.sparkline.show.chart_viz&&"sunburst_inward"===this.config.sparkline.show.chart_variant)i=t.radius.x,s=t.radius.y;else{const e=Math.abs(t.start.x-t.end.x),a=Math.abs(t.start.y-t.end.y);i=Math.sqrt(e*e+a*a)/2,s=i}if("flower"===this.config.sparkline.show.chart_viz&&"sunburst_outward"===this.config.sparkline.show.chart_variant)a=t.radius2.x,r=t.radius2.y;else{const e=Math.abs(t.start2.x-t.end2.x),i=Math.abs(t.start2.y-t.end2.y);a=Math.sqrt(e*e+i*i)/2,r=a,o=["rice_grain","flower"].includes(this.config.sparkline.show.chart_viz)?"1":"0"}}else i=t.radius.x,s=t.radius.y,a=t.radius2.x,r=t.radius2.y;return["M",t.start.x,t.start.y,"A",i,s,0,t.largeArcFlag,t.sweepFlag,t.end.x,t.end.y,"L",t.end2.x,t.end2.y,"A",a,r,0,t.largeArcFlag,t.sweepFlag===o?"1":"0",t.start2.x,t.start2.y,"Z"].join(" ")}))}getRadialBarcode(t,e,i=4,s=4){return this._calcRadialBarcode(this.coords,!1,i,s).map(((t,e)=>({start:{x:t[0][0],y:t[1][0]},end:{x:t[0][1],y:t[1][1]},start2:{x:t[0][2],y:t[1][2]},end2:{x:t[0][3],y:t[1][3]},radius:{x:t[4][0],y:t[5][0]},radius2:{x:t[4][1],y:t[5][1]},largeArcFlag:t[6],sweepFlag:t[7],value:t[2]})))}getRadialBarcodePaths(){return this.radialBarcode.map(((t,e)=>{let i,s,a,r,o="0";if(["flower2","flower","rice_grain"].includes(this.config.sparkline.show?.chart_viz)){if("flower"===this.config.sparkline.show.chart_viz&&"sunburst_inward"===this.config.sparkline.show.chart_variant)i=t.radius.x,s=t.radius.y;else{const e=Math.abs(t.start.x-t.end.x),a=Math.abs(t.start.y-t.end.y);i=Math.sqrt(e*e+a*a)/2,s=i}if("flower"===this.config.sparkline.show.chart_viz&&"sunburst_outward"===this.config.sparkline.show.chart_variant)a=t.radius2.x,r=t.radius2.y;else{const e=Math.abs(t.start2.x-t.end2.x),i=Math.abs(t.start2.y-t.end2.y);a=Math.sqrt(e*e+i*i)/2,r=a,o=["rice_grain","flower"].includes(this.config.sparkline.show.chart_viz)?"1":"0"}}else i=t.radius.x,s=t.radius.y,a=t.radius2.x,r=t.radius2.y;return["M",t.start.x,t.start.y,"A",i,s,0,t.largeArcFlag,t.sweepFlag,t.end.x,t.end.y,"L",t.end2.x,t.end2.y,"A",a,r,0,t.largeArcFlag,t.sweepFlag===o?"1":"0",t.start2.x,t.start2.y,"Z"].join(" ")}))}getBarcode(t,e,i=4,s=4){const a=this._logarithmic?Math.log10(Math.max(1,this.max)):this.max,r=this._logarithmic?Math.log10(Math.max(1,this.min)):this.min,o=this.coords,n=this.drawArea.width/Math.ceil(this.hours*this.points)/e,h=n-Math.min(i/2,n/2),l=(a-r)/this.drawArea.height||1;switch(this.config.sparkline.show.chart_variant){case"audio":return o.map(((i,s)=>({x:n*s*e+n*t+this.drawArea.x,y:this.drawArea.height/2-((this._logarithmic?Math.log10(Math.max(1,i[2])):i[2])-r)/l/2,height:((this._logarithmic?Math.log10(Math.max(1,i[2])):i[2])-r)/l,width:h,value:i[2]})));case"stalactites":return o.map(((i,s)=>({x:n*s*e+n*t+this.drawArea.x,y:0,height:((this._logarithmic?Math.log10(Math.max(1,i[2])):i[2])-r)/l,width:h,value:i[2]})));case"stalagmites":return o.map(((i,s)=>({x:n*s*e+n*t+this.drawArea.x,y:this.drawArea.height/1-((this._logarithmic?Math.log10(Math.max(1,i[2])):i[2])-r)/l,height:((this._logarithmic?Math.log10(Math.max(1,i[2])):i[2])-r)/l,width:h,value:i[2]})));default:return o.map(((i,s)=>({x:n*s*e+n*t+this.drawArea.x,y:0,height:this.drawArea.height,width:h,value:i[2]})))}}getEqualizer(t,e,i=4,s=4){const a=(this.drawArea.width+i)/Math.ceil(this.hours*this.points)/e;this._max,this._min,this.drawArea.height;this._min<0&&Math.abs(this._min);const r=(this.drawArea.height-this.levelCount*s)/this.levelCount;let o,n=this.coords.map(((t,e)=>{let i=[];const s=Math.trunc(t[2]/this.valuesPerBucket),a=Math.trunc(this._min/this.valuesPerBucket);o=s-a,i[0]=t[0],i[1]=[],i[2]=[];for(let r=0;r<o;r++)i[2][r]=this._min+r*this.valuesPerBucket;return i[1]=this._calcLevelY(i),i}));return n.map(((s,o)=>({x:a*o*e+a*t+this.drawArea.x,y:s[1],height:r,width:a-i,value:s[2]})))}getGrades(t,e,i=4,s=4){const a=(this.drawArea.width+i)/Math.ceil(this.hours*this.points)/e,r=(this.drawArea.height-(this.gradeRanks.length-1)*s)/this.gradeRanks.length;let o,n=this.coords.map(((t,e)=>{let i=[];const a=this.gradeRanks.length;o=a-0,i[0]=t[0],i[1]=[],i[2]=[];let n=-1,h=0;for(let s=0;s<o;s++){h=0;for(let e=0;e<this.gradeRanks[s].rangeMin.length;e++)t[2]>=this.gradeRanks[s].rangeMin[e]&&t[2]<this.gradeRanks[s].rangeMax[e]&&(h=e,n=s)}for(let l=0;l<=o;l++)l<=n&&(i[2][l]=this.gradeRanks[l].rangeMin.length>h?this.gradeRanks[l].rangeMin[h]:this.gradeRanks[l].rangeMin[0]),i[1][l]=this.drawArea.height+this.margin.t-l*(r+s);return i}));return n.map(((s,o)=>({x:a*o*e+a*t+this.drawArea.x,y:s[1],height:r,width:a-i,value:s[2]})))}getBars(t,e,i=4,s=4){const a=this._calcY(this.coords),r=(a.length>1?a[1][0]-a[0][0]:this.drawArea.width)/e,o=(this._max-this._min)/this.drawArea.height||1;this._min<0&&Math.abs(this._min);const n=Math.max(1,r-i);return a.map(((e,i)=>({x:e[0]+r*t-n/2,y:this._min>0?e[1]:e[3],height:e[2]>0?this._min<0?e[2]/o:(e[2]-this._min)/o:e[1]-e[3],width:n,value:e[2]})))}_midPoint(t,e,i,s){return[(t-i)/2+i,(e-s)/2+s]}_average(t){return t.reduce(((t,e)=>t+parseFloat(e.state)),0)/t.length}_median(t){const e=[...t].sort(((t,e)=>parseFloat(t.state)-parseFloat(e.state))),i=Math.floor((e.length-1)/2);return e.length%2==1?parseFloat(e[i].state):(parseFloat(e[i].state)+parseFloat(e[i+1].state))/2}_maximum(t){return Math.max(...t.map((t=>t.state)))}_minimum(t){return Math.min(...t.map((t=>t.state)))}_first(t){return parseFloat(t[0].state)}_last(t){return parseFloat(t[t.length-1].state)}_sum(t){return t.reduce(((t,e)=>t+parseFloat(e.state)),0)}_delta(t){return this._maximum(t)-this._minimum(t)}_diff(t){return this._last(t)-this._first(t)}_lastValue(t){return["delta","diff"].includes(this.aggregateFuncName)?0:parseFloat(t[t.length-1].state)||0}_snapToBin(t){const e=60*(60/this.points)*1e3;return new Date(Math.floor(t.getTime()/e)*e)}_updateEndTime(){if(this._endTime=new Date,"calendar"===this.config.period.type)"day"===this.config.period.calendar.period&&0!==this.config.period.calendar.offset?(this._endTime.setHours(-this.config.period.calendar.duration.hour),this._endTime.setHours(0,0,0,0)):"day"===this.config.period.calendar.period&&(this._endTime=this._snapToBin(this._endTime),this._endTime=new Date(this._endTime.getTime()+60/this.points*60*1e3));else if("rolling_window"===this.config.period.type)this._endTime=this._snapToBin(this._endTime),this._endTime=new Date(this._endTime.getTime()+60/this.points*60*1e3);else switch(this._groupBy){case"month":this._endTime.setMonth(this._endTime.getMonth()+1),this._endTime.setDate(1);break;case"date":this._endTime.setDate(this._endTime.getDate()+1),this._endTime.setHours(0,0,0,0);break;case"hour":this._endTime.setHours(this._endTime.getHours()+1),this._endTime.setMinutes(0,0,0)}}}const yn=(t,e)=>{for(let i=e,s=t.length;i<s;i+=1)if(null!=t[i].value)return i;throw new Error('Error in threshold interpolation: could not find right-nearest valued stop. Do the first and last thresholds have a set "value"?')},vn=["var(--theme-sys-color-primary)","#3498db","#e74c3c","#9b59b6","#f1c40f","#2ecc71","#1abc9c","#34495e","#e67e22","#7f8c8d","#27ae60","#2980b9","#8e44ad"],bn={line:{x:!0,y:!0},area:{x:!0,y:!0},bar:{x:!0,y:!0},dots:{x:!0,y:!0},equalizer:{x:!0,y:!0},state_bands:{x:!0,y:!0},graded:{x:!1,y:!1},barcode:{x:!0,y:!1},radial_barcode:{x:!1,y:!1}},_n=(t,e)=>{const i=(t=>{if(!t||!t.length)return t;if(null==t[0].value||null==t[t.length-1].value)throw new Error('The first and last thresholds must have a set "value".\n See xyz manual');let e=0,i=null;return t.map(((s,a)=>{if(null!=s.value)return e=a,{...s};null==i?i=yn(t,a):a>i&&(e=i,i=yn(t,a));const r=t[e].value,o=(t[i].value-r)/(i-e);return{color:"string"==typeof s?s:s.color,value:r+o*(a-e)}}))})(t);try{i.sort(((t,e)=>e.value-t.value))}catch(a){console.log("computeThresholds, error",a,i)}if("smooth"===e)return i;const s=[].concat(...i.map(((t,e)=>[t,{value:t.value-1e-4,color:i[e+1]?i[e+1].color:t.color}])));return s};class xn extends Ia{static setConfig(t,e,i,s){return(t.layout?.sparklines??[]).map(((t,a)=>new xn(t,a,e,i,s)))}constructor(t,e,i,s,a){const r={xpos:50,ypos:50,width:25,height:25,margin:0,history:{period:"rolling_window"},period:{type:"calendar",group_by:"interval",calendar:{period:"day",offset:0,duration:{hour:24},bins:{per_hour:4}}},sparkline:{state_values:{logarithmic:!1,value_factor:0,aggregate_func:"avg",smoothing:!0},line_color:[...vn],colorstops:{colors:[]},colorstops_transition:"smooth",equalizer:{value_buckets:10,square:!1},graded:{square:!1},state_bands:{radius:.5,styles:{}},radial_barcode:{size:5,line_width:0,face:{show_day_night:!1,show_hour_marks:!1,show_hour_numbers:!1,hour_marks_count:24},background:{styles:{opacity:.3}}},tooltip:{styles:{"font-size":"0.9em"}},show:{chart_type:"line",line:!0,area:!1,grid:{x:!1,y:!1},axis:{x:!1,y:!1},tickmarks:{x:!1,y:!1},labels:{x:!1,y:!1},xlabels_at:"ticks_major",ylabels_at:"ticks_major"}},x_axis:{axis:{styles:{stroke:"var(--primary-text-color)","stroke-width":1,opacity:.45}},ticks_major:{ticksize:"auto"},ticks_minor:{ticksize:"auto"},grid_major:{styles:{stroke:"var(--divider-color)","stroke-width":1,opacity:.35}},grid_minor:{styles:{stroke:"var(--divider-color)","stroke-width":1,opacity:.15}},tickmarks_major:{size:1,styles:{stroke:"var(--primary-text-color)","stroke-width":1,opacity:.45}},tickmarks_minor:{size:.5,styles:{stroke:"var(--primary-text-color)","stroke-width":1,opacity:.25}},labels:{offset:2,styles:{fill:"var(--primary-text-color)","font-size":"0.5em","text-anchor":"middle","dominant-baseline":"hanging",opacity:.7}}},y_axis:{axis:{styles:{stroke:"var(--primary-text-color)","stroke-width":1,opacity:.45}},ticks_major:{ticksize:"auto"},ticks_minor:{ticksize:"auto"},grid_major:{styles:{stroke:"var(--divider-color)","stroke-width":1,opacity:.35}},grid_minor:{styles:{stroke:"var(--divider-color)","stroke-width":1,opacity:.15}},tickmarks_major:{size:1,styles:{stroke:"var(--primary-text-color)","stroke-width":1,opacity:.45}},tickmarks_minor:{size:.5,styles:{stroke:"var(--primary-text-color)","stroke-width":1,opacity:.25}},labels:{offset:2,styles:{fill:"var(--primary-text-color)","font-size":"0.5em","text-anchor":"end","dominant-baseline":"middle",opacity:.7}}},line:{styles:{fill:"none",stroke:"var(--primary-text-color)","stroke-width":1,"stroke-linecap":"round","stroke-linejoin":"round"}},area:{styles:{fill:"var(--primary-color)",opacity:.25}}},o=Sa.mergeDeep({},t);["grid","axis","tickmarks","labels"].forEach((t=>{const e=o.sparkline?.show?.[t];"boolean"==typeof e&&(o.sparkline.show[t]={x:e,y:e})})),void 0!==o.line?.styles&&(o.line.styles=ft.toStyleDict(o.line.styles)),void 0!==o.area?.styles&&(o.area.styles=ft.toStyleDict(o.area.styles)),void 0!==o.sparkline?.state_bands?.styles&&(o.sparkline.state_bands.styles=ft.toStyleDict(o.sparkline.state_bands.styles)),["x_axis","y_axis"].forEach((t=>{["axis","grid_major","grid_minor","tickmarks_major","tickmarks_minor","labels"].forEach((e=>{void 0!==o[t]?.[e]?.styles&&(o[t][e].styles=ft.toStyleDict(o[t][e].styles))}))}));const n=Sa.mergeDeep(r,o);"state_bands"===n.sparkline.show.chart_type&&(n.sparkline.colorstops_transition="hard",void 0===o.y_axis?.labels?.styles?.["text-anchor"]&&(n.y_axis.labels.styles["text-anchor"]="start"),void 0===o.y_axis?.labels?.styles?.["dominant-baseline"]&&(n.y_axis.labels.styles["dominant-baseline"]="hanging")),super(n,e,i,s,a,"sparklines","sparklines",0),this.svg=this.calculateSvgDimensions(),this.containedGraphMargin=this.svg.margin,this.config.svg=this.svg,this.stateBandsStateMap=this.config.sparkline.state_map,this.graphConfig=this.buildGraphConfig(this.config),this.Graph=new fn(this.svg.width,this.svg.height,this.svg.margin,this.graphConfig,[],[],this.graphConfig.sparkline.state_map??{}),this.series=[],this.historySeries=void 0,this.gradient=[],this.length=[],this.area=[],this.areaMinMax=[],this.line=[],this.bar=[],this.equalizer=[],this.points=[],this.barcodeChart=[],this.barcodeChartBackground=[],this.radialBarcodeChart=[],this.radialBarcodeChartBackground=[],this.graded=[],this.stateBands=[],this.radialBarcodeChartWidth=ka.calculateSvgDimension(this.config?.sparkline?.radial_barcode?.size||5),this.linePath=void 0,this.lineMinPath=void 0,this.lineMaxPath=void 0,this.areaPath=void 0,this.areaMinMaxPath=void 0,this.stats={},this.tooltip={},this.tooltipVisible=!1,this.activePoint=void 0,this.activeX=void 0,this.dragging=!1,this.elements={},this.historyPromise=void 0,this.historyRefreshAt=0,this.binBoundaryTimer=void 0,this.calendarRangeTimer=void 0,this.historyRangeStart=void 0,this.historyRangeEnd=void 0,this.historyResynchronizationRequested=!1,this.runtimeYScale=void 0,this.config.svg=this.svg}calculateSvgDimensions(t=this.config){const e=this.card._calculateSvgCoordinatesInGroup(t),i=ka.calculateSvgDimension(t.width),s=ka.calculateSvgDimension(t.height),a=this.calculateSparklineMargin(t.margin),r=ka.calculateSvgDimension(t.sparkline?.[t.sparkline.show.chart_type]?.styles?.["stroke-width"]||t.sparkline?.line?.styles?.["stroke-width"]||t.line_width||0),o=ka.calculateSvgDimension(t.sparkline[t.sparkline.show.chart_type]?.column_spacing||this.config.bar_spacing||1),n=ka.calculateSvgDimension(t.sparkline[t.sparkline.show.chart_type]?.row_spacing||this.config.bar_spacing||1);return{...e,width:i,height:s,line_width:r,x:e.xpos-i/2,y:e.ypos-s/2,margin:a,column_spacing:o,row_spacing:n}}calculateSparklineMargin(t){const e={};return"object"==typeof t?(e.t=ka.calculateSvgDimension(t.t)||ka.calculateSvgDimension(t.y)||0,e.b=ka.calculateSvgDimension(t.b)||ka.calculateSvgDimension(t.y)||0,e.r=ka.calculateSvgDimension(t.r)||ka.calculateSvgDimension(t.x)||0,e.l=ka.calculateSvgDimension(t.l)||ka.calculateSvgDimension(t.x)||0,e.x=e.l,e.y=e.t):(e.x=ka.calculateSvgDimension(t),e.y=e.x,e.t=e.x,e.r=e.x,e.b=e.x,e.l=e.x),e}calculateContainedGraphMargin(){const t=this.calculateSparklineMargin(this.config.margin),e=bn[this.config.sparkline.show.chart_type],i=e.x&&this.config.sparkline.show.tickmarks.x,s=e.y&&this.config.sparkline.show.tickmarks.y,a=e.x&&this.config.sparkline.show.labels.x,r=e.y&&this.config.sparkline.show.labels.y,o=i?ka.calculateSvgDimension(this.config.x_axis.tickmarks_major.size):0,n=s?ka.calculateSvgDimension(this.config.y_axis.tickmarks_major.size):0,h=a?ka.calculateSvgDimension(this.config.x_axis.labels.offset):0,l=r?ka.calculateSvgDimension(this.config.y_axis.labels.offset):0,c=this.resolveAxisFontSizePixels("x",xa),d=this.resolveAxisFontSizePixels("y",xa),u=.85*c,p=.85*d,g=this.buildYAxisTicks("major").map((t=>t.label)).reduce(((t,e)=>Math.max(t,e.length)),0)*d*.5;let m=t.t,f=t.r,y=Math.max(t.b,o),v=Math.max(t.l,n);if(a){const t=this.buildXAxisTicks("major"),e=t[0].label.length*c*.6,i=t[t.length-1],s=i.label.length*c*.6,a=i.value===this.Graph.xAxis.end.getTime(),r=this.config.x_axis.labels.styles["text-anchor"];y=Math.max(y,o+h+u),"start"===r?a&&(f=Math.max(f,s)):"end"===r?v=Math.max(v,e):(v=Math.max(v,e/2),a&&(f=Math.max(f,s/2)))}return r&&"state_bands"!==this.config.sparkline.show.chart_type&&(v=Math.max(v,n+l+g),m=Math.max(m,p/2),y=Math.max(y,p/2)),{t:m,r:f,b:y,l:v,x:v,y:m}}buildGraphConfig(t){const e="state_bands"===t.sparkline.show.chart_type?{...t.sparkline,state_map:this.stateBandsStateMap}:t.sparkline;return{width:this.svg.width,height:this.svg.height,period:t.period,sparkline:e,x_axis:{...t.x_axis,labels:{...t.x_axis.labels,max_length:this.xAxisLabelLength}},y_axis:t.y_axis}}setState(t,e){super.setState(t,e);const i=JSON.stringify([this.card._hass.locale,this.card._hass.config.time_zone]);if(this.xAxisLabelLocaleKey!==i){const t=this.card._hass.locale,e=this.card._hass.config,s=[];for(let i=0;i<12;i+=1){const a=new Date(Date.UTC(2025,i,21,12,21));s.push(kr(a,t,e).replace(/\s/g,"").length)}for(let i=0;i<24;i+=1){const a=new Date(Date.UTC(2025,6,21,i,21));s.push(Ar(a,t,e).replace(/\s/g,"").length)}this.xAxisLabelLength=Math.max(...s),this.xAxisLabelLocaleKey=i}"state_bands"===this.config.sparkline.show.chart_type&&(this.stateBandsStateMap={...this.config.sparkline.state_map,map:this.config.sparkline.state_map.map.map((e=>{const i=String(e.state??e.value),s={...t,state:i},a=this.card._hass.formatEntityState?.(t,i),r=this.card._hass.formatEntityState?.(s),o=Hr(this.card._hass.localize,s,this.card._hass.locale,[],this.card._hass.config,this.card._hass.entities),n=[a,r,o].find((t=>void 0!==t&&t!==i))??a??r??o;return{...e,display_label:e.label??n??e.display_label}}))}),this.svg=this.calculateSvgDimensions(this.config),this.svg.margin=this.containedGraphMargin,this.config.svg=this.svg,this.graphConfig=this.buildGraphConfig(this.config),this.Graph=new fn(this.svg.width,this.svg.height,this.svg.margin,this.graphConfig,[],[],this.graphConfig.sparkline.state_map??{});const s="real_time"===this.config.period.type,a="rolling_window"===this.config.period.type||"calendar"===this.config.period.type&&0===this.config.period.calendar.offset,r="calendar"===this.config.period.type&&this.config.period.calendar.offset<0;s?(window.clearTimeout(this.binBoundaryTimer),window.clearTimeout(this.calendarRangeTimer),this.series=this.buildRealtimeSeries(t)):this.historySeries?(a&&this.addCurrentEntityToHistory(t),this.series=this.historySeries):this.series=r?[]:this.buildRealtimeSeries(t),r&&!this.historySeries||(this.updateGraphFromSeries(),this.tooltipVisible&&this.pointerEvent&&this.updateActivePointer(this.pointerEvent)),s||(this.fetchHistoryIfNeeded(t),this.scheduleBinBoundaryRefresh(),this.scheduleCalendarRangeRefresh())}buildRealtimeSeries(t){const e="state_bands"===this.config.sparkline.show.chart_type,i=e?this.stateBandsStateMap.map.find((e=>String(e.state)===String(t.state))):void 0,s=e?Number(i.value):this.getEntityNumericState(t),a=e?t.last_changed:(new Date).toISOString();return[{...t,state:s,haState:t.state,last_changed:a,last_updated:a}]}addCurrentEntityToHistory(t){if("calendar"===this.config.period.type&&this.config.period.calendar.offset<0)return;const e=this.buildRealtimeSeries(t)[0];this.historySeries[this.historySeries.length-1].last_changed!==e.last_changed&&this.historySeries.push(e)}pruneLiveHistoryToActiveWindow(){const t=60/this.Graph.points*60*1e3,e=Date.now(),i="rolling_window"===this.config.period.type?this.config.period.rolling_window.duration.hour:this.config.period.calendar.duration.hour,s="state_bands"===this.config.sparkline.show.chart_type?this.getHistoryRange().start.getTime():"rolling_window"===this.config.period.type?Math.floor(e/t)*t+t-60*i*60*1e3:this.getHistoryRange().start.getTime(),a=this.historySeries.concat().sort(((t,e)=>new Date(t.last_changed).getTime()-new Date(e.last_changed).getTime()));let r;const o=[];return a.forEach((t=>{new Date(t.last_changed).getTime()<s?r=t:o.push(t)})),this.historySeries=r?[r,...o]:o,this.series=this.historySeries,{start:s,end:e}}scheduleBinBoundaryRefresh(){window.clearTimeout(this.binBoundaryTimer);if(!("rolling_window"===this.config.period.type||"calendar"===this.config.period.type&&0===this.config.period.calendar.offset))return;if(!this.entity)return;const t=60/this.Graph.points*60*1e3,e=t-Date.now()%t+10;this.binBoundaryTimer=window.setTimeout((()=>{this.updateGraphFromSeries(),this.tooltipVisible&&this.pointerEvent&&this.updateActivePointer(this.pointerEvent),this.card._updateSparklineEntities(),this.card._updateToolsUsingSparklineEntities(),this.card.requestUpdate(),this.scheduleBinBoundaryRefresh()}),e)}scheduleCalendarRangeRefresh(){if(window.clearTimeout(this.calendarRangeTimer),"calendar"!==this.config.period.type)return;const t=new Date,e=new Date(t);e.setHours(24,0,0,0);const i=e.getTime()-t.getTime()+10;this.calendarRangeTimer=window.setTimeout((()=>{const t=this.getHistoryRange(),e=t.start.getTime()!==this.historyRangeStart||t.end.getTime()!==this.historyRangeEnd;e&&this.historyPromise?this.historyPromise.finally((()=>this.fetchHistoryIfNeeded(this.entity))):e&&this.fetchHistoryIfNeeded(this.entity),this.scheduleCalendarRangeRefresh()}),i)}disconnected(){window.clearTimeout(this.binBoundaryTimer),window.clearTimeout(this.calendarRangeTimer)}connected(){this.historySeries&&("rolling_window"===this.config.period.type||"calendar"===this.config.period.type&&0===this.config.period.calendar.offset)&&(this.historyResynchronizationRequested=!0)}hassConnected(){this.historySeries&&("rolling_window"===this.config.period.type||"calendar"===this.config.period.type&&0===this.config.period.calendar.offset)&&(this.historyResynchronizationRequested=!0)}requiresHassUpdate(){return this.historyResynchronizationRequested}getHistoryRefreshMs(){const t=this.config.history.refresh_interval;if("number"==typeof t)return 1e3*t;const e=t.match(/^(\d+(?:\.\d+)?)(ms|s|sec|m|min|h|hour)$/),i=Number(e[1]),s=e[2];return"ms"===s?i:"s"===s||"sec"===s?1e3*i:"m"===s||"min"===s?60*i*1e3:60*i*60*1e3}getHistoryRange(){const t=this.config.period?.calendar?.duration?.hour??this.config.period?.rolling_window?.duration?.hour??24,e=new Date;if("calendar"===this.config.period?.type&&"day"===this.config.period?.calendar?.period){const i=new Date(e);i.setHours(0,0,0,0);const s=this.config.period?.calendar?.offset??0,a=(t-24)/24;return i.setDate(i.getDate()+s-a),{start:i,end:new Date(i.getTime()+60*t*60*1e3)}}return{start:new Date(e.getTime()-60*t*60*1e3),end:e}}getHistoryRangeV2(){const t=this.config.period?.calendar?.duration?.hour??this.config.period?.rolling_window?.duration?.hour??24,e=new Date;if("calendar"===this.config.period?.type&&"day"===this.config.period?.calendar?.period){const i=new Date(e);i.setHours(0,0,0,0);const s=t/24,a=this.config.period?.calendar?.offset??0;return i.setDate(i.getDate()+a-s),{start:i,end:new Date(i.getTime()+60*t*60*1e3)}}return{start:new Date(e.getTime()-60*t*60*1e3),end:e}}getHistoryRangeV1(){const t=this.config.period?.calendar?.duration?.hour??this.config.period?.rolling_window?.duration?.hour??24,e=new Date;if("calendar"===this.config.period?.type&&"day"===this.config.period?.calendar?.period){const i=new Date(e);return i.setHours(0,0,0),i.setHours(i.getHours()+24*(this.config.period?.calendar?.offset??0)-(t-24)),{start:i,end:new Date(i.getTime()+60*t*60*1e3)}}return this.config.period,{start:new Date(e.getTime()-60*t*60*1e3),end:e}}buildHistoryPath(t,e,i){const s=encodeURIComponent(e.toISOString()),a=encodeURIComponent(i.toISOString());return`history/period/${s}?filter_entity_id=${encodeURIComponent(t)}&end_time=${a}&minimal_response&no_attributes`}fetchHistoryIfNeeded(t){const e=Date.now(),i=this.getHistoryRange(),s="calendar"===this.config.period.type,a=s&&this.config.period.calendar.offset<0,r=i.start.getTime()===this.historyRangeStart&&i.end.getTime()===this.historyRangeEnd,o=s&&!r,n=void 0!==this.config.history.refresh_interval&&e>=this.historyRefreshAt;if(this.historyPromise)return;if(a&&r)return;if(this.historySeries&&!o&&!this.historyResynchronizationRequested&&!n)return;const h=this.buildHistoryPath(this.entityConfig.entity,i.start,i.end);this.historyPromise=this.card._hass.callApi("GET",h).then((e=>{const s=0===e.length?[]:e[0];this.historySeries=this.buildHistorySeries(s,t,i.end),this.historyRangeStart=i.start.getTime(),this.historyRangeEnd=i.end.getTime(),this.addCurrentEntityToHistory(t),this.series=this.historySeries,this.updateGraphFromSeries(),this.card._updateSparklineEntities(),this.card._updateToolsUsingSparklineEntities(),void 0!==this.config.history.refresh_interval&&(this.historyRefreshAt=Date.now()+this.getHistoryRefreshMs()),this.historyResynchronizationRequested=!1,this.card.requestUpdate()})).finally((()=>{this.historyPromise=void 0}))}buildHistorySeries(t,e,i){const s="calendar"===this.config.period.type&&this.config.period.calendar.offset<0?t:t.concat([e]);if("state_bands"===this.config.sparkline.show.chart_type)return s.map((t=>{const e=this.stateBandsStateMap.map.find((e=>String(e.state)===String(t.state)));return{...t,state:Number(e.value),haState:t.state}}));return s.filter((t=>t&&Number.isFinite(Number(t.state)))).map((t=>{const e=Number(t.state);return Sa.mergeDeep(t,{state:e,haState:t.state})}))}getEntityNumericState(t){return this.entityConfig?.attribute?Number(t.attributes[this.entityConfig.attribute]):Number(t.state)}updateGraphFromSeries(){const t=this.config.sparkline.show.chart_type;if(this.card.dev.fakeData&&"state_bands"!==t){let t=40;this.series.forEach(((e,i)=>{i<this.series.length/2&&(t-=4*i),i>this.series.length/2&&(t+=3*i),e.state=t,e.haState=t}))}const e=("rolling_window"===this.config.period.type||"calendar"===this.config.period.type&&0===this.config.period.calendar.offset)&&this.historySeries?this.pruneLiveHistoryToActiveWindow():void 0;if("real_time"!==this.config.period.type){const t=this.getHistoryRange();this.Graph.hours=(t.end.getTime()-t.start.getTime())/36e5}this.Graph.update(this.series);const i=this.calculateContainedGraphMargin();if(i.t!==this.containedGraphMargin.t||i.r!==this.containedGraphMargin.r||i.b!==this.containedGraphMargin.b||i.l!==this.containedGraphMargin.l){if(this.containedGraphMargin=i,this.svg.margin=i,this.graphConfig=this.buildGraphConfig(this.config),this.Graph=new fn(this.svg.width,this.svg.height,this.svg.margin,this.graphConfig,[],[],this.graphConfig.sparkline.state_map??{}),"real_time"!==this.config.period.type){const t=this.getHistoryRange();this.Graph.hours=(t.end.getTime()-t.start.getTime())/36e5}this.Graph.update(this.series)}if("state_bands"===t)this.animationBaselineY=this.Graph.drawArea.y+this.Graph.drawArea.height;else{const t=this.Graph._calcY([[this.Graph.drawArea.x,0,0]])[0][1];this.animationBaselineY=Math.min(this.Graph.drawArea.y+this.Graph.drawArea.height,Math.max(this.Graph.drawArea.y,t))}this.area=[],this.areaMinMax=[],this.line=[],this.bar=[],this.equalizer=[],this.points=[],this.barcodeChart=[],this.barcodeChartBackground=[],this.radialBarcodeChart=[],this.radialBarcodeChartBackground=[],this.graded=[],this.stateBands="state_bands"===t&&this.historySeries?this.Graph.getStateBands():[],this.Graph.coords.length>0&&(["area","line"].includes(t)?(this.linePath=this.Graph.getPath(),!1!==this.entityConfig?.show_line&&(this.line[0]=this.linePath),"area"===t?(this.areaPath=this.Graph.getArea(this.linePath),this.area[0]=this.areaPath):this.areaPath=void 0,!0===this.config.sparkline?.line?.show_minmax||!0===this.config.sparkline?.area?.show_minmax?(this.lineMinPath=this.Graph.getPathMin(),this.lineMaxPath=this.Graph.getPathMax(),this.areaMinMaxPath=this.Graph.getAreaMinMax(this.lineMinPath,this.lineMaxPath),this.areaMinMax[0]=this.areaMinMaxPath):(this.lineMinPath=void 0,this.lineMaxPath=void 0,this.areaMinMaxPath=void 0)):(this.linePath=void 0,this.lineMinPath=void 0,this.lineMaxPath=void 0,this.areaPath=void 0,this.areaMinMaxPath=void 0),"dots"!==t&&!0!==this.config.sparkline.show.points&&!0!==this.config.sparkline?.line?.show_dots&&!0!==this.config.sparkline?.area?.show_dots||(this.points[0]=this.Graph.getPoints()),"bar"===t?this.bar[0]=this.Graph.getBars(0,1,4,4):"equalizer"===t?(this.Graph.levelCount=this.config.sparkline.equalizer.value_buckets,this.Graph.valuesPerBucket=(this.Graph.max-this.Graph.min)/this.config.sparkline.equalizer.value_buckets,this.equalizer[0]=this.Graph.getEqualizer(0,1,this.svg.column_spacing,this.svg.row_spacing)):"graded"===t?(this.Graph.levelCount=this.config.sparkline.equalizer.value_buckets,this.Graph.valuesPerBucket=(this.Graph.max-this.Graph.min)/this.config.sparkline.equalizer.value_buckets,this.graded[0]=this.Graph.getGrades(0,1,4,4)):"radial_barcode"===t?(this.radialBarcodeChartBackground[0]=this.Graph.getRadialBarcodeBackground(0,1,this.svg.column_spacing,this.svg.row_spacing),this.radialBarcodeChart[0]=this.Graph.getRadialBarcode(0,1,this.svg.column_spacing,this.svg.row_spacing),this.Graph.radialBarcodeBackground=this.radialBarcodeChartBackground[0],this.Graph.radialBarcode=this.radialBarcodeChart[0]):"barcode"===t&&(this.barcodeChart[0]=this.Graph.getBarcode(0,1,4,4))),this.config.sparkline.colorstops.colors.length>0&&!this.entityConfig?.color?this.gradient[0]=this.Graph.computeGradient(_n(this.config.sparkline.colorstops.colors,this.config.sparkline.colorstops_transition),this.config.sparkline.state_values.logarithmic):this.gradient=[],this.stats=this.calculateStatistics(this.series,e)}calculateStatistics(t,e){const i=t.filter((t=>t&&Number.isFinite(Number(t.state)))).concat().sort(((t,e)=>new Date(t.last_changed).getTime()-new Date(e.last_changed).getTime()));if(0===i.length)return{};const s=e?e.start:new Date(i[0].last_changed).getTime(),a=e?e.end:Date.now(),r=i.filter((t=>new Date(t.last_changed).getTime()<=a)),o=r.map((t=>Number(t.state))),n=Math.min(...o),h=Math.max(...o),l=r.find((t=>Number(t.state)===n)),c=r.find((t=>Number(t.state)===h)),d=new Date(l.last_changed).getTime(),u=new Date(c.last_changed).getTime(),p=d<s?new Date(s).toISOString():l.last_changed,g=u<s?new Date(s).toISOString():c.last_changed;let m=0,f=0;r.forEach(((t,e)=>{const i=Number(t.state),o=new Date(t.last_changed).getTime(),n=e<r.length-1?new Date(r[e+1].last_changed).getTime():a,h=Math.max(o,s),l=Math.min(n,a),c=Math.max(0,l-h);m+=i*c,f+=c}));return{min:n,avg:m/f,max:h,min_time:p,max_time:g}}mouseEventToPoint(t){let e=this.elements.svg.createSVGPoint();e.x=t.touches?t.touches[0].clientX:t.clientX,e.y=t.touches?t.touches[0].clientY:t.clientY;const i=this.elements.svg.getScreenCTM().inverse();return e=e.matrixTransform(i),e}mouseEventToPointV1(t){let e=this.elements.svg.createSVGPoint();const i=t.touches?.[0]??t.changedTouches?.[0]??t;e.x=i.clientX,e.y=i.clientY;const s=this.elements.svg.getScreenCTM().inverse();return e=e.matrixTransform(s),e}pointToGraphX(t){const e=t.x;return Math.max(0,Math.min(e,this.svg.width))}snapPointerXToGraphPoint(t){const e=this.Graph.coords;if(!e||0===e.length)return t;let i=e[0][0],s=Math.abs(t-i);for(let a=1;a<e.length;a+=1){const r=e[a][0],o=Math.abs(t-r);o<s&&(i=r,s=o)}return i}getRadialBarcodePointIndexFromEvent(t){const e=t?.touches?.[0]??t?.changedTouches?.[0]??t;if(void 0!==e?.clientX&&void 0!==e?.clientY){const t=this.elements.svg.getRootNode(),i=t instanceof ShadowRoot?t:document,s=Array.from(i.elementsFromPoint(e.clientX,e.clientY)).find((t=>t?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin"))),a=s?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin");if(a)return Number(a.dataset.pointIndex);const r=(this.elements.svg.querySelector(".sparkline-radial-barcode__bg-bin")?.parentNode??this.elements.svg).getBoundingClientRect(),o=r.left+r.width/2,n=r.top+r.height/2,h=(Math.atan2(e.clientY-n,e.clientX-o)*(180/Math.PI)+360+90)%360,l=this.elements.svg.querySelectorAll(".sparkline-radial-barcode__bg-bin").length;if(0===l)return NaN;const c=360/l,d=Math.floor(h/c);return Math.min(Math.max(0,d),l-1)}const i=t?.target??t?.currentTarget,s=i?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin");return s?Number(s.dataset.pointIndex):NaN}getRadialBarcodePointIndexFromEventV5(t){const e=t?.touches?.[0]??t?.changedTouches?.[0]??t;if(void 0!==e?.clientX&&void 0!==e?.clientY){const t=this.elements.svg.getRootNode(),i=t instanceof ShadowRoot?t:document,s=Array.from(i.elementsFromPoint(e.clientX,e.clientY)).find((t=>t?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin"))),a=s?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin");if(a)return Number(a.dataset.pointIndex);if(this.isInteractionLocked){const t=(this.elements.svg.querySelector(".sparkline-radial-barcode__bg-bin")?.parentNode??this.elements.svg).getBoundingClientRect(),i=t.left+t.width/2,s=t.top+t.height/2,a=(Math.atan2(e.clientY-s,e.clientX-i)*(180/Math.PI)+360+90)%360,r=this.elements.svg.querySelectorAll(".sparkline-radial-barcode__bin").length;if(0===r)return NaN;const o=360/r,n=Math.floor(a/o);return Math.min(Math.max(0,n),r-1)}return NaN}const i=t?.target??t?.currentTarget,s=i?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin");return s?Number(s.dataset.pointIndex):NaN}getRadialBarcodePointIndexFromEventV4(t){const e=t?.touches?.[0]??t?.changedTouches?.[0]??t;if(void 0!==e?.clientX){const t=this.elements.svg.getRootNode(),i=t instanceof ShadowRoot?t:document,s=Array.from(i.elementsFromPoint(e.clientX,e.clientY)).find((t=>t?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin"))),a=s?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin");return a?Number(a.dataset.pointIndex):NaN}const i=t?.target??t?.currentTarget,s=i?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin");return s?Number(s.dataset.pointIndex):NaN}getRadialBarcodePointIndexFromEventV3(t){const e=t?.touches?.[0]??t?.changedTouches?.[0],i=e??t;if(console.log("[getRadialBarcodePointIndexFromEvent], touch, point, e ",e,i,t),void 0!==i?.clientX){const t=Array.from(document.elementsFromPoint(i.clientX,i.clientY)),e=t.find((t=>t?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin"))),s=e?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin");return console.log("[getRadialBarcodePointIndexFromEvent], MATCHING ",t,e,s),s?Number(s.dataset.pointIndex):NaN}const s=t?.target??t?.currentTarget,a=s?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin");return a?Number(a.dataset.pointIndex):NaN}getRadialBarcodePointIndexFromEventV2(t){const e=t?.touches?.[0]??t?.changedTouches?.[0],i=e?document.elementFromPoint(e.clientX,e.clientY):t?.currentTarget,s=i?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin");return console.log("[getRadialBarcodePointIndexFromEvent], bin",s),Number(s?.dataset?.pointIndex)}getRadialBarcodePointIndexFromEventV1(t){const e=t?.touches?.[0]??t?.changedTouches?.[0]??t,i=void 0!==e?.clientX?document.elementsFromPoint(e.clientX,e.clientY).find((t=>t?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin"))):t?.target??t?.currentTarget,s=i?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin");return Number(s?.dataset?.pointIndex)}getPointIndexFromX(t){const e=this.Graph.coords;if(!e||0===e.length)return;let i=0,s=Math.abs(t-e[0][0]);for(let a=1;a<e.length;a+=1){const r=Math.abs(t-e[a][0]);r<s&&(i=a,s=r)}return i}getTooltipLabel(t){const e=this.card._hass.localize(`ui.panel.developer-tools.statistics.${"avg"===t?"mean":t}`);return e?e.charAt(0).toUpperCase()+e.slice(1):t}formatTooltipStat(t,e){const i=this.getTooltipLabel(t);if(void 0===e)return{label:i,value:"",uom:""};const s=this.card.entities[this.entity_index],a=this.card.resolvedEntityConfigs[this.entity_index],r=Object.create(Fo.prototype);r.entity=s,r.entityConfig=a,r.config=a,r.card=this.card,r.state="",r.uom="",r.buildStateAndUom();const o=this.card._hass.locale.language,n=new Intl.NumberFormat(o).formatToParts(1.1).find((t=>"decimal"===t.type)).value,h=r.state.lastIndexOf(n),l=-1===h?0:r.state.length-h-1;return{label:i,value:new Intl.NumberFormat(o,{minimumFractionDigits:l,maximumFractionDigits:l}).format(e),uom:r.uom}}updateTooltipFromStateBandSegment(t){const e=this.card._hass.locale,i=this.card._hass.config,s=this.elements.containerRect||this.elements.container.getBoundingClientRect(),a=t.end.getTime()-t.start.getTime();let r=Math.floor(a/1e3);const o=Math.floor(r/86400);r-=86400*o;const n=Math.floor(r/3600);r-=3600*n;const h=Math.floor(r/60),l=r-60*h;this.activeX=t.x+t.width/2,this.tooltip={entity:this.entity_index,index:this.Graph.stateBandSegments.indexOf(t),title:t.label,min:{label:"Start",value:Cr(t.start,e,i),uom:""},avg:{label:"End",value:Cr(t.end,e,i),uom:""},max:{label:"Duration",value:Nr(e,{days:o,hours:n,minutes:h,seconds:l}),uom:""},containerWidth:s.width,containerHeight:s.height}}updateTooltipFromPointIndex(t,e){const i=this.Graph.bucketMeta[t],s=this.Graph.coords[t],a=this.card._hass.locale,r=this.card._hass.config,o=this.elements.svg?.getBoundingClientRect(),n=this.card.shadowRoot.getElementById("container")?.getBoundingClientRect();if(e?.currentTarget?.getBoundingClientRect(),!i||!s||!n)return void(this.tooltip={});const h=i.start,l=0===h.getHours()&&0===h.getMinutes()&&0===h.getSeconds()&&0===h.getMilliseconds()?kr(h,a,r):Ar(h,a,r),c=this.formatTooltipStat("min",i.min),d=this.formatTooltipStat("avg",i.avg),u=this.formatTooltipStat("max",i.max),p=o?o.width/this.svg.width:1,g=o?o.height/this.svg.height:1,m=e?.touches?e.touches[0]:e,f=void 0!==m?.clientX?m.clientX-n.left:void 0!==this.tooltip.x?this.tooltip.x:o?o.left-n.left+s[0]*p:s[0],y=void 0!==m?.clientY?m.clientY-n.top:void 0!==this.tooltip.y?this.tooltip.y:o?o.top-n.top+s[1]*g:s[1];this.tooltip={entity:this.entity_index,index:t,x:f,y:y,title:l,min:c,avg:d,max:u,count:i.count,containerWidth:n.width,containerHeight:n.height}}updateTooltipFromRadialBarcode(t,e){this.activeX=void 0,this.elements.containerRect=this.elements.container.getBoundingClientRect();const i=this.elements.svg.getBoundingClientRect(),s=i.width/this.svg.width,a=i.height/this.svg.height;this.elements.tooltipBounds={left:i.left-this.elements.containerRect.left+this.Graph.drawArea.x*s,top:i.top-this.elements.containerRect.top+this.Graph.drawArea.y*a,right:i.left-this.elements.containerRect.left+(this.Graph.drawArea.x+this.Graph.drawArea.width)*s,bottom:i.top-this.elements.containerRect.top+(this.Graph.drawArea.y+this.Graph.drawArea.height)*a},this.updateRadialActiveBinDom(t),this.updateActiveIndicatorDom(),this.updateTooltipFromPointIndex(t,e),this.updateTooltipContentDom(),this.updateTooltipPositionDom(e),this.updateTooltipVisibilityDom(!0)}clearTooltip(){this.tooltip={},this.tooltipVisible=!1}clearRadialTooltip(){this.clearTooltip(),this.updateTooltipVisibilityDom(!1),this.updateActiveIndicatorDom()}scheduleRadialHoverFrame(){this._radialRafId||(this._radialRafId=window.requestAnimationFrame((()=>{if(this._radialRafId=null,this._radialPendingLeave)return this._radialPendingLeave=!1,this._radialPendingPointIndex=void 0,this._radialPendingEvent=void 0,this.restoreRadialActiveBinDom(),void this.clearRadialTooltip();const t=this._radialPendingPointIndex,e=this._radialPendingEvent;this._radialPendingPointIndex=void 0,this._radialPendingEvent=void 0,Number.isFinite(t)&&this.updateTooltipFromRadialBarcode(t,e)})))}restoreRadialActiveBinDom(){const t=this.elements.svg?.querySelectorAll(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin");t&&t.forEach((t=>{if(!t.__fhsRadialOriginalStyle)return;const e=(e,i)=>{""===i?t.style.removeProperty(e):t.style.setProperty(e,i)};e("opacity",t.__fhsRadialOriginalStyle.opacity),e("filter",t.__fhsRadialOriginalStyle.filter),e("stroke-width",t.__fhsRadialOriginalStyle.strokeWidth)}))}updateRadialActiveBinDom(t){const e=this.elements.svg?.querySelectorAll(".sparkline-radial-barcode__bin");e&&e.forEach((e=>{e.__fhsRadialOriginalStyle||(e.__fhsRadialOriginalStyle={opacity:e.style.opacity,filter:e.style.filter,strokeWidth:e.style.strokeWidth});const i=t>=0&&Number(e.dataset.pointIndex)===t;e.style.setProperty("opacity",i?"1":"0.35"),e.style.setProperty("filter",i?"brightness(1.15)":"none"),e.style.setProperty("stroke-width",i?"2":"1")}))}updateActiveIndicatorDom(){const t=this.elements.activeIndicator;t&&(void 0!==this.activeX?(t.setAttribute("x1",`${this.activeX}`),t.setAttribute("x2",`${this.activeX}`),t.style.visibility="visible"):t.style.visibility="hidden")}updateTooltipVisibilityDom(t){this.tooltipVisible=t;const e=this.elements.tooltip;e&&(e.style.display=t?"block":"none")}updateTooltipPositionDom(t){const e=this.elements.tooltip,i=this.elements.containerRect||this.elements.container.getBoundingClientRect(),s=t?.touches?.[0]??t?.changedTouches?.[0]??t;if(!e||!i)return;if(void 0===s?.clientX||void 0===s?.clientY)return;let a=s.clientX-i.left,r=s.clientY-i.top;(t?.touches?.length>0||t?.changedTouches?.length>0)&&"radial_barcode"===this.config.sparkline.show.chart_type&&(a+=18,r-=28);const o=this.elements.tooltipBounds||{left:0,top:0,right:i.width,bottom:i.height};a=Math.max(o.left,Math.min(a,o.right)),r=Math.max(o.top,Math.min(r,o.bottom)),this.tooltip.x=a,this.tooltip.y=r,e.style.left=`${a}px`,e.style.top=`${r}px`}updateTooltipContentDom(){if(!this.elements.tooltip)return;const t=this.elements.tooltipTitle,e=this.elements.tooltipRows;t.textContent=this.tooltip.title??"",e[0].children[0].textContent=this.tooltip.min?.label??"",e[0].children[1].children[0].textContent=this.tooltip.min?.value??"",e[0].children[1].children[1].textContent=this.tooltip.min?.uom?` ${this.tooltip.min.uom}`:"",e[1].children[0].textContent=this.tooltip.avg?.label??"",e[1].children[1].children[0].textContent=this.tooltip.avg?.value??"",e[1].children[1].children[1].textContent=this.tooltip.avg?.uom?` ${this.tooltip.avg.uom}`:"",e[2].children[0].textContent=this.tooltip.max?.label??"",e[2].children[1].children[0].textContent=this.tooltip.max?.value??"",e[2].children[1].children[1].textContent=this.tooltip.max?.uom?` ${this.tooltip.max.uom}`:""}updateActivePointer(t){if(this.pointerEvent=t,"state_bands"===this.config.sparkline.show.chart_type){const e=this.pointToGraphX(this.mouseEventToPoint(t)),i=this.Graph.stateBandSegments.find((t=>e>=t.x&&e<=t.x+t.width));return i?(this.updateTooltipFromStateBandSegment(i),this.updateTooltipContentDom(),this.updateActiveIndicatorDom(),this.updateTooltipPositionDom(t),void this.updateTooltipVisibilityDom(!0)):(this.clearTooltip(),this.updateTooltipVisibilityDom(!1),void this.updateActiveIndicatorDom())}const e=this.pointToGraphX(this.mouseEventToPoint(t));this.activeX=this.snapPointerXToGraphPoint(e);const i=this.getPointIndexFromX(this.activeX);if(this.tooltip.index,void 0===i)return this.clearTooltip(),this.updateTooltipVisibilityDom(!1),void this.updateActiveIndicatorDom();this.updateTooltipFromPointIndex(i,t),this.updateTooltipContentDom(),this.updateActiveIndicatorDom(),this.updateTooltipPositionDom(t),this.updateTooltipVisibilityDom(!0)}updateTooltipFromPointer(t){const e=this.pointToGraphX(this.mouseEventToPoint(t)),i=this.getPointIndexFromX(e);void 0!==i?this.updateTooltipFromPointIndex(i,t):this.clearTooltip()}updateRadialActivePointer(t){const e=this.getRadialBarcodePointIndexFromEvent(t);if(!Number.isFinite(e))return this.clearTooltip(),this.updateTooltipVisibilityDom(!1),void this.updateActiveIndicatorDom();this.elements.containerRect=this.elements.container.getBoundingClientRect();const i=this.elements.svg.getBoundingClientRect(),s=i.width/this.svg.width,a=i.height/this.svg.height;this.elements.tooltipBounds={left:i.left-this.elements.containerRect.left+this.Graph.drawArea.x*s,top:i.top-this.elements.containerRect.top+this.Graph.drawArea.y*a,right:i.left-this.elements.containerRect.left+(this.Graph.drawArea.x+this.Graph.drawArea.width)*s,bottom:i.top-this.elements.containerRect.top+(this.Graph.drawArea.y+this.Graph.drawArea.height)*a},this.updateTooltipFromRadialBarcode(e,t)}firstUpdatedFromSliderExample(t){function e(t){let e;if(t.preventDefault(),this.dragging)switch(this.m=this.mouseEventToPoint(t),this.config.position.orientation){case"horizontal":e=this.svgCoordinateToSliderValue(this,this.m),this.m.x=this.valueToSvg(this,e),this.m.x=Math.max(this.svg.scale.min,Math.min(this.m.x,this.svg.scale.max)),this.m.x=Math.round(this.m.x/this.svg.scale.step)*this.svg.scale.step;break;case"vertical":e=this.svgCoordinateToSliderValue(this,this.m),this.m.y=this.valueToSvg(this,e),this.m.y=Math.round(this.m.y/this.svg.scale.step)*this.svg.scale.step}}function i(t){t.preventDefault(),window.addEventListener("pointermove",e.bind(this),!1),window.addEventListener("pointerup",s.bind(this),!1);const i=this.mouseEventToPoint(t),a=this.svg.thumb.x1+this.svg.thumb.cx;i.x>a-10&&i.x<a+this.svg.thumb.width+10&&(this.dragging=!0,this.config.user_actions?.drag_action&&this.config.user_actions?.drag_action.update_interval&&(this.config.user_actions.drag_action.update_interval>0?this.timeOutId=setTimeout((()=>this.callDragService()),this.config.user_actions.drag_action.update_interval):this.timeOutId=null),this.m=this.mouseEventToPoint(t),"horizontal"===this.config.position.orientation?this.m.x=Math.round(this.m.x/this.svg.scale.step)*this.svg.scale.step:this.m.y=Math.round(this.m.y/this.svg.scale.step)*this.svg.scale.step,this.dev.debug&&console.log("pointerDOWN",Math.round(100*this.m.x)/100))}function s(t){t.preventDefault(),window.removeEventListener("pointermove",e.bind(this),!1),window.removeEventListener("pointerup",s.bind(this),!1),window.removeEventListener("mousemove",e.bind(this),!1),window.removeEventListener("touchmove",e.bind(this),!1),window.removeEventListener("mouseup",s.bind(this),!1),window.removeEventListener("touchend",s.bind(this),!1),this.dragging&&(this.dragging=!1,clearTimeout(this.timeOutId),this.target=0,this.dev.debug&&console.log("pointerUP"),this.callTapService())}this.labelValue=this._stateValue,this.dev.debug&&console.log("slider - firstUpdated"),this.elements={},this.elements.svg=this._card.shadowRoot.getElementById("rangeslider-".concat(this.toolId)),this.elements.capture=this.elements.svg.querySelector("#capture"),this.elements.track=this.elements.svg.querySelector("#rs-track"),this.elements.activeTrack=this.elements.svg.querySelector("#active-track"),this.elements.thumbGroup=this.elements.svg.querySelector("#rs-thumb-group"),this.elements.thumb=this.elements.svg.querySelector("#rs-thumb"),this.elements.label=this.elements.svg.querySelector("#rs-label tspan"),this.dev.debug&&console.log("slider - firstUpdated svg = ",this.elements.svg,"path=",this.elements.path,"thumb=",this.elements.thumb,"label=",this.elements.label,"text=",this.elements.text),this.elements.svg.addEventListener("touchstart",i.bind(this),!1),this.elements.svg.addEventListener("mousedown",i.bind(this),!1)}attachPointerHandlers(){if(this.elements.svg=this.card.shadowRoot.getElementById(`sparkline-${this.cardId}-${this.index}`),this.elements.container=this.card.shadowRoot.getElementById("container"),this.elements.activeIndicator=this.card.shadowRoot.getElementById(`sparkline-active-indicator-${this.cardId}-${this.index}`),this.elements.tooltip=this.card.shadowRoot.getElementById(`sparkline-tooltip-${this.cardId}-${this.index}`),this.elements.tooltipTitle=this.elements.tooltip.querySelector(".sparkline-tooltip__title"),this.elements.tooltipRows=this.elements.tooltip.querySelectorAll(".sparkline-tooltip__row"),this.elements.containerRect=this.elements.container.getBoundingClientRect(),!this.elements.svg||"true"===this.elements.svg.dataset.pointerReady)return;const t="radial_barcode"===this.config.sparkline.show.chart_type;this.elements.svg.dataset.pointerReady="true",this.Frame2=this.Frame2||function(){this.rid=null,t?this.updateRadialActivePointer(this.pointerEvent):this.updateActivePointer(this.pointerEvent)}.bind(this),this.pointerMove=this.pointerMove||function(t){t.preventDefault(),this.dragging&&(this.pointerEvent=t,this.rid||(this.rid=window.requestAnimationFrame(this.Frame2)))}.bind(this),this.hoverEnter=this.hoverEnter||function(t){const e=Number(t.currentTarget?.dataset?.pointIndex);this.pointerEvent=t,this.activeX=void 0,this._radialPendingLeave=!1,this._radialPendingPointIndex=e,this._radialPendingEvent=t,this.scheduleRadialHoverFrame()}.bind(this),this.hoverMove=this.hoverMove||function(e){if(!this.dragging){if(!this.hovering){this.hovering=!0,this.elements.containerRect=this.elements.container.getBoundingClientRect();const e=this.elements.svg.getBoundingClientRect(),i=e.width/this.svg.width,s=e.height/this.svg.height,a=t?0:this.Graph.coords.length>1?(this.Graph.coords[1][0]-this.Graph.coords[0][0])*i/2:12;this.elements.tooltipBounds={left:e.left-this.elements.containerRect.left+this.Graph.drawArea.x*i-a,top:e.top-this.elements.containerRect.top+this.Graph.drawArea.y*s,right:e.left-this.elements.containerRect.left+(this.Graph.drawArea.x+this.Graph.drawArea.width)*i+a,bottom:e.top-this.elements.containerRect.top+(this.Graph.drawArea.y+this.Graph.drawArea.height)*s}}t?this.updateRadialActivePointer(e):this.updateActivePointer(e)}}.bind(this),this.hoverLeave=this.hoverLeave||function(t){this.dragging||(this.hovering=!1,this.pointerEvent=void 0,this.activeX=void 0,this.clearTooltip(),this.updateTooltipVisibilityDom(!1),this.updateActiveIndicatorDom())}.bind(this),this.barCodeLeave=this.barCodeLeave||function(t){this.dragging||(this.hovering=!1,this.pointerEvent=void 0,this.activeX=void 0,this.clearTooltip(),this.restoreRadialActiveBinDom())}.bind(this),this.pointerDown=this.pointerDown||function(e){e.preventDefault(),window.addEventListener("pointermove",this.pointerMove,!1),window.addEventListener("pointerup",this.pointerUp,!1),this.dragging=!0,this.pointerEvent=e,this.elements.containerRect=this.elements.container.getBoundingClientRect(),t?this.updateRadialActivePointer(e):this.updateActivePointer(e),this.updateTooltipVisibilityDom(!0),this.updateActiveIndicatorDom(),this.Frame2()}.bind(this),this.pointerUp=this.pointerUp||function(e){e.preventDefault(),window.removeEventListener("pointermove",this.pointerMove,!1),window.removeEventListener("pointerup",this.pointerUp,!1),this.dragging&&(this.dragging=!1,this.activeX=void 0,this.pointerEvent=void 0,this.rid=null,this.clearTooltip(),this.updateTooltipVisibilityDom(!1),this.updateActiveIndicatorDom(),this.elements.containerRect=void 0,t&&this.restoreRadialActiveBinDom(),this.Frame2())}.bind(this),this.touchStart=this.touchStart||function(e){e.preventDefault(),window.addEventListener("pointermove",this.pointerMove,!1),window.addEventListener("pointerup",this.pointerUp,!1),this.dragging=!0,this.pointerEvent=e,this.elements.containerRect=this.elements.container.getBoundingClientRect(),t?this.updateRadialActivePointer(e):this.updateActivePointer(e),this.updateTooltipVisibilityDom(!0),this.updateActiveIndicatorDom(),this.Frame2()}.bind(this),this.mouseDown=this.mouseDown||function(t){this.pointerDown(t)}.bind(this),this.elements.svg.addEventListener("mousedown",this.mouseDown,!1),this.elements.svg.addEventListener("touchstart",this.touchStart,{passive:!1}),this.elements.svg.addEventListener("mousemove",this.hoverMove,!1),this.elements.svg.addEventListener("mouseenter",this.hoverEnter,!1),this.elements.svg.addEventListener("mouseleave",this.barCodeLeave,!1),this.elements.svg.addEventListener("mouseleave",this.hoverLeave,!1)}attachPointerHandlersV4(){if(this.elements.svg=this.card.shadowRoot.getElementById(`sparkline-${this.cardId}-${this.index}`),this.elements.container=this.card.shadowRoot.getElementById("container"),this.elements.activeIndicator=this.card.shadowRoot.getElementById(`sparkline-active-indicator-${this.cardId}-${this.index}`),this.elements.tooltip=this.card.shadowRoot.getElementById(`sparkline-tooltip-${this.cardId}-${this.index}`),this.elements.tooltipTitle=this.elements.tooltip.querySelector(".sparkline-tooltip__title"),this.elements.tooltipRows=this.elements.tooltip.querySelectorAll(".sparkline-tooltip__row"),this.elements.containerRect=this.elements.container.getBoundingClientRect(),!this.elements.svg||"true"===this.elements.svg.dataset.pointerReady)return;const t="radial_barcode"===this.config.sparkline.show.chart_type;function e(){this.rid=null,t?this.updateRadialActivePointer(this.pointerEvent):this.updateActivePointer(this.pointerEvent)}function i(t){t.preventDefault(),console.log("[pointerMove]",t),this.dragging&&(this.pointerEvent=t,this.rid||(this.rid=window.requestAnimationFrame(e.bind(this))))}function s(s){s.preventDefault(),console.log("[pointerDown]",s),window.addEventListener("pointermove",i.bind(this),!1),window.addEventListener("pointerup",a.bind(this),!1),this.dragging=!0,this.pointerEvent=s,this.elements.containerRect=this.elements.container.getBoundingClientRect(),t?this.updateRadialActivePointer(s):this.updateActivePointer(s),this.updateTooltipVisibilityDom(!0),this.updateActiveIndicatorDom(),e.call(this)}function a(s){s.preventDefault(),console.log("[pointerUp]",s),window.removeEventListener("pointermove",i.bind(this),!1),window.removeEventListener("pointerup",a.bind(this),!1),this.dragging&&(this.dragging=!1,this.activeX=void 0,this.pointerEvent=void 0,this.rid=null,this.clearTooltip(),this.updateTooltipVisibilityDom(!1),this.updateActiveIndicatorDom(),this.elements.containerRect=void 0,t&&this.restoreRadialActiveBinDom(),e.call(this))}this.elements.svg.addEventListener("mousedown",function(t){s.call(this,t)}.bind(this),!1),this.elements.svg.addEventListener("touchstart",function(s){s.preventDefault(),console.log("[touchStart]",s),window.addEventListener("pointermove",i.bind(this),!1),window.addEventListener("pointerup",a.bind(this),!1),this.dragging=!0,this.pointerEvent=s,this.elements.containerRect=this.elements.container.getBoundingClientRect(),t?this.updateRadialActivePointer(s):this.updateActivePointer(s),this.updateTooltipVisibilityDom(!0),this.updateActiveIndicatorDom(),e.call(this)}.bind(this),{passive:!1}),this.elements.svg.addEventListener("mousemove",function(e){if(!this.dragging){if(console.log("[hoverMove]",e),!this.hovering){this.hovering=!0,this.elements.containerRect=this.elements.container.getBoundingClientRect();const e=this.elements.svg.getBoundingClientRect(),i=e.width/this.svg.width,s=e.height/this.svg.height,a=t?0:this.Graph.coords.length>1?(this.Graph.coords-this.Graph.coords)*i/2:12;this.elements.tooltipBounds={left:e.left-this.elements.containerRect.left+this.Graph.drawArea.x*i-a,top:e.top-this.elements.containerRect.top+this.Graph.drawArea.y*s,right:e.left-this.elements.containerRect.left+(this.Graph.drawArea.x+this.Graph.drawArea.width)*i+a,bottom:e.top-this.elements.containerRect.top+(this.Graph.drawArea.y+this.Graph.drawArea.height)*s}}t?(console.log("[hoverMove] - isRadialBarcode -",e),this.updateRadialActivePointer(e)):this.updateActivePointer(e)}}.bind(this),!1),this.elements.svg.addEventListener("mouseenter",function(t){const e=Number(t.currentTarget?.dataset?.pointIndex);console.log("[hoverEnter] - e, pointIndex",t,e),this.pointerEvent=t,this.activeX=void 0,this._radialPendingLeave=!1,this._radialPendingPointIndex=e,this._radialPendingEvent=t,this.scheduleRadialHoverFrame()}.bind(this),!1),this.elements.svg.addEventListener("mouseleave",function(t){this.dragging||(console.log("[barCodeLeave]",t),this.hovering=!1,this.pointerEvent=void 0,this.activeX=void 0,this.clearTooltip(),this.restoreRadialActiveBinDom())}.bind(this),!1),this.elements.svg.addEventListener("mouseleave",function(t){this.dragging||(console.log("[hoverLeave]",t),this.hovering=!1,this.pointerEvent=void 0,this.activeX=void 0,this.clearTooltip(),this.updateTooltipVisibilityDom(!1),this.updateActiveIndicatorDom())}.bind(this),!1)}attachPointerHandlersV3(){if(this.elements.svg=this.card.shadowRoot.getElementById(`sparkline-${this.cardId}-${this.index}`),this.elements.container=this.card.shadowRoot.getElementById("container"),this.elements.activeIndicator=this.card.shadowRoot.getElementById(`sparkline-active-indicator-${this.cardId}-${this.index}`),this.elements.tooltip=this.card.shadowRoot.getElementById(`sparkline-tooltip-${this.cardId}-${this.index}`),this.elements.tooltipTitle=this.elements.tooltip.querySelector(".sparkline-tooltip__title"),this.elements.tooltipRows=this.elements.tooltip.querySelectorAll(".sparkline-tooltip__row"),this.elements.containerRect=this.elements.container.getBoundingClientRect(),!this.elements.svg||"true"===this.elements.svg.dataset.pointerReady)return;const t="radial_barcode"===this.config.sparkline.show.chart_type;function e(){this.rid=null,t?this.updateRadialActivePointer(this.pointerEvent):this.updateActivePointer(this.pointerEvent)}function i(t){t.preventDefault(),console.log("[pointerMove]",t),this.dragging&&(this.pointerEvent=t,this.rid||(this.rid=window.requestAnimationFrame(e.bind(this))))}function s(t){const e=Number(t.currentTarget?.dataset?.pointIndex);console.log("[hoverEnter] - e, pointIndex",t,e),this.pointerEvent=t,this.activeX=void 0,this._radialPendingLeave=!1,this._radialPendingPointIndex=e,this._radialPendingEvent=t,this.scheduleRadialHoverFrame()}function a(t){this.dragging||(console.log("[barCodeLeave]",t),this.hovering=!1,this.pointerEvent=void 0,this.activeX=void 0,this.clearTooltip(),this.restoreRadialActiveBinDom())}function r(s){s.preventDefault(),console.log("[pointerDown]",s),window.addEventListener("pointermove",i.bind(this),!1),window.addEventListener("pointerup",o.bind(this),!1),this.dragging=!0,this.pointerEvent=s,this.elements.containerRect=this.elements.container.getBoundingClientRect(),t?this.updateRadialActivePointer(s):this.updateActivePointer(s),this.updateTooltipVisibilityDom(!0),this.updateActiveIndicatorDom(),e.call(this)}function o(t){t.preventDefault(),console.log("[pointerUp]",t),window.removeEventListener("pointermove",i.bind(this),!1),window.removeEventListener("pointerup",o.bind(this),!1),window.removeEventListener("mousemove",i.bind(this),!1),window.removeEventListener("touchmove",i.bind(this),!1),window.removeEventListener("mouseup",o.bind(this),!1),window.removeEventListener("touchend",o.bind(this),!1),this.dragging&&(this.dragging=!1,this.activeX=void 0,this.pointerEvent=void 0,this.rid=null,this.clearTooltip(),this.updateTooltipVisibilityDom(!1),this.updateActiveIndicatorDom(),this.elements.containerRect=void 0,e.call(this))}function n(e){"touchmove"===e.type&&e.preventDefault(),t?this.updateRadialActivePointer(e):this.updateActivePointer(e)}function h(t){this.elements.svg.removeEventListener("touchmove",this._touchMoveInstance,{passive:!1}),this.elements.svg.removeEventListener("touchend",this._touchEndInstance,!1),a.call(this,t),this.dragging=!1,e.call(this)}this.elements.svg.addEventListener("mousedown",function(t){r.call(this,t)}.bind(this),!1),this.elements.svg.addEventListener("touchstart",function(t){t.preventDefault(),console.log("[touchStart]",t),this._touchMoveInstance=n.bind(this),this._touchEndInstance=h.bind(this),this.elements.svg.addEventListener("touchmove",this._touchMoveInstance,{passive:!1}),this.elements.svg.addEventListener("touchend",this._touchEndInstance,!1),this.dragging=!0,this.pointerEvent=t,this.elements.containerRect=this.elements.container.getBoundingClientRect(),s.call(this,t)}.bind(this),{passive:!1}),this.elements.svg.addEventListener("mousemove",function(e){if(!this.dragging){if(console.log("[hoverMove]",e),!this.hovering){this.hovering=!0,this.elements.containerRect=this.elements.container.getBoundingClientRect();const e=this.elements.svg.getBoundingClientRect(),i=e.width/this.svg.width,s=e.height/this.svg.height,a=t?0:this.Graph.coords.length>1?(this.Graph.coords[1][0]-this.Graph.coords[0][0])*i/2:12;this.elements.tooltipBounds={left:e.left-this.elements.containerRect.left+this.Graph.drawArea.x*i-a,top:e.top-this.elements.containerRect.top+this.Graph.drawArea.y*s,right:e.left-this.elements.containerRect.left+(this.Graph.drawArea.x+this.Graph.drawArea.width)*i+a,bottom:e.top-this.elements.containerRect.top+(this.Graph.drawArea.y+this.Graph.drawArea.height)*s}}t?(console.log("[hoverMove] - isRadialBarcode -",e),this.updateRadialActivePointer(e)):this.updateActivePointer(e)}}.bind(this),!1),this.elements.svg.addEventListener("mouseenter",s.bind(this),!1),this.elements.svg.addEventListener("mouseleave",a.bind(this),!1),this.elements.svg.addEventListener("mouseleave",function(t){this.dragging||(console.log("[hoverLeave]",t),this.hovering=!1,this.pointerEvent=void 0,this.activeX=void 0,this.clearTooltip(),this.updateTooltipVisibilityDom(!1),this.updateActiveIndicatorDom())}.bind(this),!1)}attachPointerHandlersV2(){if(this.elements.svg=this.card.shadowRoot.getElementById(`sparkline-${this.cardId}-${this.index}`),this.elements.container=this.card.shadowRoot.getElementById("container"),this.elements.activeIndicator=this.card.shadowRoot.getElementById(`sparkline-active-indicator-${this.cardId}-${this.index}`),this.elements.tooltip=this.card.shadowRoot.getElementById(`sparkline-tooltip-${this.cardId}-${this.index}`),this.elements.tooltipTitle=this.elements.tooltip.querySelector(".sparkline-tooltip__title"),this.elements.tooltipRows=this.elements.tooltip.querySelectorAll(".sparkline-tooltip__row"),this.elements.containerRect=this.elements.container.getBoundingClientRect(),!this.elements.svg||"true"===this.elements.svg.dataset.pointerReady)return;const t="radial_barcode"===this.config.sparkline.show.chart_type;function e(){this.rid=null,t?this.updateRadialActivePointer(this.pointerEvent):this.updateActivePointer(this.pointerEvent)}function i(t){t.preventDefault(),console.log("[pointerMove]",t),this.dragging&&(this.pointerEvent=t,this.rid||(this.rid=window.requestAnimationFrame(e.bind(this))))}function s(t){const e=Number(t.currentTarget?.dataset?.pointIndex);console.log("[hoverEnter] - e, pointIndex",t,e),this.pointerEvent=t,this.activeX=void 0,this._radialPendingLeave=!1,this._radialPendingPointIndex=e,this._radialPendingEvent=t,this.scheduleRadialHoverFrame()}function a(e){if(!this.dragging){if(console.log("[hoverMove]",e),!this.hovering){this.hovering=!0,this.elements.containerRect=this.elements.container.getBoundingClientRect();const e=this.elements.svg.getBoundingClientRect(),i=e.width/this.svg.width,s=e.height/this.svg.height,a=t?0:this.Graph.coords.length>1?(this.Graph.coords[1][0]-this.Graph.coords[0][0])*i/2:12;this.elements.tooltipBounds={left:e.left-this.elements.containerRect.left+this.Graph.drawArea.x*i-a,top:e.top-this.elements.containerRect.top+this.Graph.drawArea.y*s,right:e.left-this.elements.containerRect.left+(this.Graph.drawArea.x+this.Graph.drawArea.width)*i+a,bottom:e.top-this.elements.containerRect.top+(this.Graph.drawArea.y+this.Graph.drawArea.height)*s}}t?this.updateRadialActivePointer(e):this.updateActivePointer(e)}}function r(t){this.dragging||(console.log("[hoverLeave]",t),this.hovering=!1,this.pointerEvent=void 0,this.activeX=void 0,this.clearTooltip(),this.updateTooltipVisibilityDom(!1),this.updateActiveIndicatorDom())}function o(t){this.dragging||(console.log("[barCodeLeave]",t),this.hovering=!1,this.pointerEvent=void 0,this.activeX=void 0,this.clearTooltip(),this.restoreRadialActiveBinDom())}function n(s){s.preventDefault(),console.log("[pointerDown]",s),window.addEventListener("pointermove",i.bind(this),!1),window.addEventListener("pointerup",h.bind(this),!1),this.dragging=!0,this.pointerEvent=s,this.elements.containerRect=this.elements.container.getBoundingClientRect(),t?this.updateRadialActivePointer(s):this.updateActivePointer(s),this.updateTooltipVisibilityDom(!0),this.updateActiveIndicatorDom(),e.call(this)}function h(t){t.preventDefault(),console.log("[pointerUp]",t),window.removeEventListener("pointermove",i.bind(this),!1),window.removeEventListener("pointerup",h.bind(this),!1),window.removeEventListener("mousemove",i.bind(this),!1),window.removeEventListener("touchmove",i.bind(this),!1),window.removeEventListener("mouseup",h.bind(this),!1),window.removeEventListener("touchend",h.bind(this),!1),this.dragging&&(this.dragging=!1,this.activeX=void 0,this.pointerEvent=void 0,this.rid=null,this.clearTooltip(),this.updateTooltipVisibilityDom(!1),this.updateActiveIndicatorDom(),this.elements.containerRect=void 0,e.call(this))}function l(t){t.preventDefault(),console.log("[touchStart]",t),window.addEventListener("pointermove",i.bind(this),!1),window.addEventListener("pointerup",h.bind(this),!1),window.addEventListener("touchmove",d.bind(this),{passive:!1}),window.addEventListener("touchend",o.bind(this),!1),this.dragging=!0,this.pointerEvent=t,this.elements.containerRect=this.elements.container.getBoundingClientRect(),s.call(t)}function c(t){n.call(t)}function d(e){"touchmove"===e.type&&e.preventDefault(),t?this.updateRadialActivePointer(e):this.updateActivePointer(e)}["line","area","dots","bar","barcode"].includes(this.config.sparkline.show.chart_type)?(this.elements.svg.addEventListener("touchstart",l.bind(this),!1),this.elements.svg.addEventListener("mousedown",c.bind(this),!1),this.elements.svg.addEventListener("mouseenter",s.bind(this),!1),this.elements.svg.addEventListener("mousemove",a.bind(this),!1),this.elements.svg.addEventListener("mouseleave",r.bind(this),!1),this.elements.container.addEventListener("mousemove",a.bind(this),!1),this.elements.container.addEventListener("mouseleave",r.bind(this),!1)):["radial_barcode"].includes(this.config.sparkline.show.chart_type)&&(this.elements.svg.addEventListener("touchstart",l.bind(this),!1),this.elements.svg.addEventListener("mousedown",c.bind(this),!1),this.elements.svg.addEventListener("mouseenter",s.bind(this),!1),this.elements.svg.addEventListener("mouseleave",o.bind(this),!1),this.elements.svg.addEventListener("mouseleave",r.bind(this),!1),this.elements.svg.addEventListener("mousemove",a.bind(this),!1)),this.elements.svg.dataset.pointerReady="true"}renderSvgAreaMask(t,e){if("area"!==this.config.sparkline.show.chart_type)return"";if(!t)return"";const i="fade"===this.config.sparkline.show.fill,s=this.length[e]||!1===this.card.config.entities[e].show_line,a=this.Graph.min>=0?0:Math.abs(this.Graph.min)/(this.Graph.max-this.Graph.min)*100;return H`
      <linearGradient id=${`fill-grad-pos-${this.cardId}-${e}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-pos-${this.cardId}-${e}`}>
        <rect width="100%" height="${100-a}%" fill=${`url(#fill-grad-pos-${this.cardId}-${e})`}
         />
      </mask>
      <linearGradient id=${`fill-grad-neg-${this.cardId}-${e}`} x1="0%" y1="100%" x2="0%" y2="0%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-neg-${this.cardId}-${e}`}>
        <rect width="100%" y=${100-a}% height="${a}%" fill=${`url(#fill-grad-neg-${this.cardId}-${e})`}
         />
      </mask>

    <mask id=${`fill-${this.cardId}-${e}`}>
      <path class='fill'
        type=${this.config.sparkline.show.fill}
        .id=${e} anim=${this.config.sparkline.animate} ?init=${s}
        style="animation-delay: ${this.config.sparkline.animate?.5*e+"s":"0s"}"
        fill='white'
        mask=${i?`url(#fill-grad-mask-pos-${this.cardId}-${e})`:""}
        d=${t}
      />
      ${this.Graph.min<0?H`<path class='fill'
            type=${this.config.sparkline.show.fill}
            .id=${e} anim=${this.config.sparkline.animate} ?init=${s}
            style="animation-delay: ${this.config.sparkline.animate?.5*e+"s":"0s"}"
            fill='white'
            mask=${i?`url(#fill-grad-mask-neg-${this.cardId}-${e})`:""}
            d=${t}
          />`:""}
    </mask>`}renderSvgAreaBackground(t,e){if("area"!==this.config.sparkline.show.chart_type)return"";if(!t)return"";const i=this.getAreaStyles(),s=i;return s.fill=this.getSparklineBackgroundPaint(i),s.stroke="none",H`
      <rect
        class="sparkline-area-rect"
        x="0"
        y="0"
        width="${this.svg.width}"
        height="${this.svg.height}"
        style=${mt(this.getRenderStyles(s))}
        mask="url(#fill-${this.cardId}-${e})"
      ></rect>
    `}renderSvgAreaMinMaxMask(t,e){return["area","line"].includes(this.config.sparkline.show.chart_type)&&t?H`
      <mask id=${`fillMinMax-${this.cardId}-${e}`}>
        <path
          class='fill'
          type=${this.config.sparkline.show.fill}
          .id=${e} anim=${this.config.sparkline.animate} ?init=${this.length[e]}
          style="animation-delay: ${this.config.sparkline.animate?.5*e+"s":"0s"}"
          fill='white'
          d=${t}
        />
      </mask>
    `:""}renderSvgAreaMinMaxBackground(t,e){if(!["area","line"].includes(this.config.sparkline.show.chart_type))return"";if(!t)return"";const i=this.getAreaStyles(),s=i;return s.fill=this.getSparklineBackgroundPaint(i),s.stroke="none",H`
      <rect
        class="sparkline-area-rect"
        x="0"
        y="0"
        width="${this.svg.width}"
        height="${this.svg.height}"
        style=${mt(this.getRenderStyles(s))}
        mask="url(#fillMinMax-${this.cardId}-${e})"
      ></rect>
    `}renderSvgLineMask(t,e){if(!t)return"";const i=this.getLineStyles();return H`
      <mask id="sparkline-line-${this.cardId}-${e}">
        <path
          class="sparkline-line-mask"
          fill="none"
          stroke="white"
          stroke-width="${i["stroke-width"]}"
          stroke-linecap="${i["stroke-linecap"]}"
          stroke-linejoin="${i["stroke-linejoin"]}"
          d="${t}"
        ></path>
      </mask>
    `}renderSvgLineBackground(t,e){if(!t)return"";const i=this.getLineStyles(),s=i;return s.fill=this.getSparklineBackgroundPaint(i),s.stroke="none",delete s["stroke-width"],delete s["stroke-linecap"],delete s["stroke-linejoin"],H`
      <rect
        class="sparkline-line-rect"
        x="0"
        y="0"
        width="${this.svg.width}"
        height="${this.svg.height}"
        style=${mt(this.getRenderStyles(s))}
        mask="url(#sparkline-line-${this.cardId}-${e})"
      ></rect>
    `}renderSvgLineMinMaxMask(t,e){if("line"!==this.config.sparkline.show.chart_type)return"";if(!t)return"";const i=this.getLineStyles();return H`
      <mask id="sparkline-lineMinMax-${this.cardId}-${e}">
        <path
          class="sparkline-line-mask"
          fill="none"
          stroke="white"
          stroke-width="${i["stroke-width"]}"
          stroke-linecap="${i["stroke-linecap"]}"
          stroke-linejoin="${i["stroke-linejoin"]}"
          d="${t}"
        ></path>
      </mask>
    `}renderSvgLineMinMaxBackground(t,e){if("line"!==this.config.sparkline.show.chart_type)return"";if(!t)return"";const i=this.getLineStyles(),s=i;return s.fill=this.getSparklineBackgroundPaint(i),s.stroke="none",delete s["stroke-width"],delete s["stroke-linecap"],delete s["stroke-linejoin"],H`
      <rect
        class="sparkline-line-rect"
        x="0"
        y="0"
        width="${this.svg.width}"
        height="${this.svg.height}"
        style=${mt(this.getRenderStyles(s))}
        mask="url(#sparkline-lineMinMax-${this.cardId}-${e})"
      ></rect>
    `}renderLineMask(){if(!this.linePath)return"";const t=this.getLineStyles();return H`
      <mask id="sparkline-line-${this.cardId}-${this.index}">
        <path
          class="sparkline-line-mask"
          fill="none"
          stroke="white"
          stroke-width="${t["stroke-width"]}"
          stroke-linecap="${t["stroke-linecap"]}"
          stroke-linejoin="${t["stroke-linejoin"]}"
          d="${this.linePath}"
        ></path>
      </mask>
    `}renderSvgGradient(t){if(!t)return"";const e=t.map(((t,e)=>t?H`
        <linearGradient id=${`grad-${this.cardId}-${this.index}-${e}`} gradientTransform="rotate(90)">
          ${t.map((t=>H`
            <stop stop-color=${t.color} offset=${`${t.offset}%`}></stop>
          `))}
        </linearGradient>
      `:""));return H`${e}`}getLineStyles(){return Sa.mergeDeep(this.getStyles({fill:"none"}),ft.toStyleDict(this.config.line?.styles))}computeColor(t,e){const{colorstops:i,line_color:s,colorstops_transition:a}=this.config.sparkline,r=Number(t)||0,o=va.calculateStrokeColor(r,i,"smooth"===a);return this.card.config.entities[e].color||o||s[e]||s[0]}xTicksizeToHours(t){if("number"==typeof t)return t;const e=t.match(/^(\d+(?:\.\d+)?)(m|min|h|hour)$/),i=Number(e[1]),s=e[2];return"m"===s||"min"===s?i/60:i}resolveAxisFontSizePixels(t,e=12){const i=this.config[`${t}_axis`]?.labels?.styles?.["font-size"];if("number"==typeof i)return i;if("string"!=typeof i)return e;const s=Number.parseFloat(i);return Number.isFinite(s)?i.endsWith("px")?s:i.endsWith("em")||i.endsWith("rem")?s*xa:i.endsWith("%")?s/100*xa:s:e}getAutoXAxisTicksize(t,e){const i=this.resolveAxisFontSizePixels("x",xa),s=Math.max(3,i*("minor"===t?.35:.45));return this.calculatePerfectXAxis(e.start,e.end,this.Graph.drawArea.width,s).ticksize/36e5}getAutoYAxisTicksize(t){const e=this.resolveAxisFontSizePixels("y",xa),i=Math.max(6,e*("minor"===t?.65:.85)),s=this.calculatePerfectYAxis(this.Graph.min,this.Graph.max,this.Graph.drawArea.height,i);return"minor"===t?Math.max(s.interval/2,.5):Math.max(s.interval,.5)}calculatePerfectYAxis(t,e,i,s=12){t===e&&(t-=1,e+=1);const a=1.5*s,r=Math.floor(i/a),o=(e-t)/(Math.max(r,2)-1),n=Math.floor(Math.log10(o)),h=10**n,l=o/h;let c;c=l<=1?1:l<=2?2:l<=5?5:10;const d=c*h,u=Math.floor(t/d)*d,p=Math.ceil(e/d)*d,g=[];let m=u;const f=Math.max(0,2-n);for(;m<=p+d/100;)g.push(Number(m.toFixed(f))),m+=d;return{gridMin:Number(u.toFixed(f)),gridMax:Number(p.toFixed(f)),interval:d,ticks:g}}calculatePerfectXAxis(t,e,i,s=.6*xa){const a=new Date(t).getTime(),r=new Date(e).getTime(),o=r-a;if(o<=0)return{ticksize:0,ticks:[]};const n=1*s+xa,h=Math.floor(i/n),l=o/(Math.max(h,4)-1),c=[1e3,5e3,15e3,3e4,6e4,3e5,6e5,9e5,18e5,36e5,72e5,144e5,216e5,432e5,864e5,1728e5,6048e5,26298e5];let d=c.findIndex((t=>t>=l));for(d<0&&(d=c.length-1);d>0&&o/c[d]<2;)d-=1;const u=c[d];let p=Math.ceil(a/u)*u;const g=[];let m=null;for(;p<=r;){const t=new Date(p),e=(p-a)/o*i,s=t.toDateString(),r=m?m.toDateString():null,n=m&&s===r?Ar(t,this.card._hass.locale,this.card._hass.config):kr(t,this.card._hass.locale,this.card._hass.config);g.push({value:p,x:Number(e.toFixed(1)),label:n}),m=t,p+=u}return{ticksize:u,ticks:g}}buildXAxisTicks(t){const e=[];return this.Graph.xAxis.ticks.forEach((i=>{const s=i.isMidnight?kr(i.time,this.card._hass.locale,this.card._hass.config):Ar(i.time,this.card._hass.locale,this.card._hass.config);e.push({axis:"x",level:t,value:i.timestamp,x:i.x,label:s})})),e}buildXAxisTicksV1(t){const e=this.xTicksizeToHours(this.config.x_axis[`ticks_${t}`].ticksize),i=this.getHistoryRange(),s=60*e*60*1e3,a=new Date(Math.floor(i.start.getTime()/s)*s),r=(i.end.getTime()-i.start.getTime())/36e5,o=Math.max(1,this.Graph.hours*this.Graph.points-1),n=this.Graph.points,h=[];let l=null;const c=Math.max(1,Math.ceil(r/e));for(let d=0;d<c;d+=1){const i=d*e,s=new Date(a.getTime()+60*i*60*1e3),r=i*n,c=this.Graph.drawArea.x+r/o*this.Graph.drawArea.width,u=s.toDateString(),p=l?l.toDateString():null,g=0===i||u!==p?kr(s,this.card._hass.locale,this.card._hass.config):Ar(s,this.card._hass.locale,this.card._hass.config);console.log("[buildXAxisTicks] stuff in loop: ",c,i,r,o,s,g,l,p,u),h.push({axis:"x",level:t,value:i,x:c,label:g}),l=s}return h}buildYAxisTicks(t){if("state_bands"===this.config.sparkline.show.chart_type)return this.Graph.yAxis.ticks.map((e=>({axis:"y",level:t,value:e.value,y:e.y,labelY:e.labelY,fontSize:e.fontSize,label:e.label})));const e=new Intl.NumberFormat(this.card._hass.locale?.language||this.card._hass.language),i=[];return this.Graph.yAxis.ticks.forEach((s=>{i.push({axis:"y",level:t,value:s.value,y:s.y,label:e.format(s.value)})})),i}buildLabelTicks(t){return"none"===this.config.sparkline.show[`${t}labels_at`]?[]:"x"===t?this.buildXAxisTicks("major"):this.buildYAxisTicks("major")}renderGrid(){const t=bn[this.config.sparkline.show.chart_type],e=this.config.sparkline.show.grid.x&&t.x,i=this.config.sparkline.show.grid.y&&t.y;if(!e&&!i)return"";const s=this.getRenderStyles(ft.toStyleDict(this.config.x_axis.grid_major.styles)),a=this.getRenderStyles(ft.toStyleDict(this.config.y_axis.grid_major.styles)),r=this.buildXAxisTicks("major"),o="state_bands"===this.config.sparkline.show.chart_type?this.Graph.yAxis.gridTicks.map((t=>({axis:"y",level:"major",value:t.value,y:t.y}))):this.buildYAxisTicks("major");return H`
      ${e?H`<g class="sparkline-grid sparkline-grid--x" style="pointer-events:none;">
        ${r.map((t=>H`
          <line
            class="sparkline-grid-line sparkline-grid-line--x-major"
            x1="${t.x}"
            y1="${this.Graph.drawArea.y}"
            x2="${t.x}"
            y2="${this.Graph.drawArea.y+this.Graph.drawArea.height}"
            style=${mt(s)}
          ></line>
        `))}
      </g>`:""}
      ${i?H`<g class="sparkline-grid sparkline-grid--y" style="pointer-events:none;">
        ${o.map((t=>H`
          <line
            class="sparkline-grid-line sparkline-grid-line--y-major"
            x1="${this.Graph.drawArea.x}"
            y1="${t.y}"
            x2="${this.Graph.drawArea.x+this.Graph.drawArea.width}"
            y2="${t.y}"
            style=${mt(a)}
          ></line>
        `))}
      </g>`:""}
    `}renderAxis(){const t=bn[this.config.sparkline.show.chart_type],e=this.config.sparkline.show.axis.x&&t.x,i=this.config.sparkline.show.axis.y&&t.y;if(!e&&!i)return"";const s=this.getRenderStyles(ft.toStyleDict(this.config.x_axis.axis.styles)),a=this.getRenderStyles(ft.toStyleDict(this.config.y_axis.axis.styles));return H`
      <g class="sparkline-axis" style="pointer-events:none;">
        ${e?H`<line
          class="sparkline-axis-line sparkline-axis-line--x"
          x1="${this.Graph.drawArea.x}"
          y1="${this.Graph.drawArea.y+this.Graph.drawArea.height}"
          x2="${this.Graph.drawArea.x+this.Graph.drawArea.width}"
          y2="${this.Graph.drawArea.y+this.Graph.drawArea.height}"
          style=${mt(s)}
        ></line>`:""}
        ${i?H`<line
          class="sparkline-axis-line sparkline-axis-line--y"
          x1="${this.Graph.drawArea.x}"
          y1="${this.Graph.drawArea.y}"
          x2="${this.Graph.drawArea.x}"
          y2="${this.Graph.drawArea.y+this.Graph.drawArea.height}"
          style=${mt(a)}
        ></line>`:""}
      </g>
    `}renderTickmarks(){const t=bn[this.config.sparkline.show.chart_type],e=this.config.sparkline.show.tickmarks.x&&t.x,i=this.config.sparkline.show.tickmarks.y&&t.y;if(!e&&!i)return"";const s=this.config.x_axis.tickmarks_major,a=this.config.y_axis.tickmarks_major,r=this.getRenderStyles(ft.toStyleDict(s.styles)),o=this.getRenderStyles(ft.toStyleDict(a.styles)),n=this.buildXAxisTicks("major"),h=this.buildYAxisTicks("major"),l=ka.calculateSvgDimension(s.size),c=ka.calculateSvgDimension(a.size);return H`
      ${e?H`<g class="sparkline-tickmarks sparkline-tickmarks--x" style="pointer-events:none;">
        ${n.map((t=>H`
          <line
            class="sparkline-tickmark sparkline-tickmark--x-major"
            x1="${t.x}"
            y1="${this.Graph.drawArea.y+this.Graph.drawArea.height}"
            x2="${t.x}"
            y2="${this.Graph.drawArea.y+this.Graph.drawArea.height+l}"
            style=${mt(r)}
          ></line>
        `))}
      </g>`:""}
      ${i?H`<g class="sparkline-tickmarks sparkline-tickmarks--y" style="pointer-events:none;">
        ${h.map((t=>H`
          <line
            class="sparkline-tickmark sparkline-tickmark--y-major"
            x1="${this.Graph.drawArea.x-c}"
            y1="${t.y}"
            x2="${this.Graph.drawArea.x}"
            y2="${t.y}"
            style=${mt(o)}
          ></line>
        `))}
      </g>`:""}
    `}renderAxisLabels(){const t=bn[this.config.sparkline.show.chart_type],e=this.config.sparkline.show.labels.x&&t.x,i=this.config.sparkline.show.labels.y&&t.y;if(!e&&!i)return"";const s=this.getRenderStyles(ft.toStyleDict(this.config.x_axis.labels.styles)),a=this.getRenderStyles(ft.toStyleDict(this.config.y_axis.labels.styles)),r=this.buildLabelTicks("x"),o=this.buildLabelTicks("y"),n=this.config.sparkline.show.tickmarks.x&&t.x?ka.calculateSvgDimension(this.config.x_axis.tickmarks_major.size):0,h=this.config.sparkline.show.tickmarks.y&&t.y?ka.calculateSvgDimension(this.config.y_axis.tickmarks_major.size):0,l="state_bands"===this.config.sparkline.show.chart_type;return H`
      ${e?H`<g class="sparkline-labels sparkline-labels--x" style="pointer-events:none;">
        ${r.map((t=>H`
          <text
            class="sparkline-label sparkline-label--x"
            x="${t.x}"
            y="${this.Graph.drawArea.y+this.Graph.drawArea.height+n+ka.calculateSvgDimension(this.config.x_axis.labels.offset)}"
            style=${mt(s)}
          >${t.label}</text>
        `))}
      </g>`:""}
      ${i?H`<g class="sparkline-labels sparkline-labels--y" style="pointer-events:none;">
        ${o.map((t=>H`
          <text
            class="sparkline-label sparkline-label--y"
            x="${l?this.Graph.drawArea.x+ka.calculateSvgDimension(this.config.y_axis.labels.offset):this.Graph.drawArea.x-h-ka.calculateSvgDimension(this.config.y_axis.labels.offset)}"
            y="${l?t.labelY:t.y}"
            style=${mt(l?{...a,"font-size":`${t.fontSize}px`}:a)}
          >${t.label}</text>
        `))}
      </g>`:""}
    `}getAreaStyles(){return Sa.mergeDeep(this.getStyles({}),ft.toStyleDict(this.config.area?.styles))}getSparklineBackgroundPaint(t){return this.config.sparkline.colorstops.colors.length>0?`url(#grad-${this.cardId}-${this.index}-0)`:t.stroke||t.fill}renderArea(){return this.renderSvgAreaBackground(this.areaPath,this.entity_index)}renderLine(){return this.renderSvgLineBackground(this.linePath,this.entity_index)}renderSvgPoint(t,e,i){const s=this.computeColor(t[2],e);return H`
    <circle
      class='line--point'
      ?inactive=${this.tooltip.index!==t[3]}
      style=${`--mcg-hover: ${s};`}
      data-point-index=${t[3]}
      data-state=${t[2]}
      data-bucket-start=${i}
      data-bucket-end=${new Date(i).getTime()+60/this.Graph.points*60*1e3}
      stroke=${s}
      fill=${s}
      cx=${t[0]} cy=${t[1]} r=${this.svg.line_width/1.5}
    >
      ${this.config.sparkline.animate&&("real_time"===this.config.period.type||this.historySeries)?H`
        <animate
          attributeName='cy'
          from=${this.animationBaselineY}
          to=${t[1]}
          begin='0s'
          dur='2s'
          fill='remove'
          restart='whenNotActive'
          repeatCount='1'
          calcMode='spline'
          keyTimes='0; 1'
          keySplines='0.215 0.61 0.355 1'
        ></animate>
      `:""}
    </circle>
  `}renderSvgPoints(t,e){if(!t)return;const i=this.computeColor(this.card.entities[e].state,e);return H`
    <g class='line--points'
      ?tooltip=${this.tooltip.entity===e}
      ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
      ?init=${this.length[e]}
      anim=${this.config.sparkline.animate&&"hover"!==this.config.sparkline.show.points}
      style="animation-delay: ${this.config.sparkline.animate?.5*e+.5+"s":"0s"}"
      stroke-width=${this.svg.line_width/2}
      fill=${i}
      stroke=${i}
      >
      ${"dots"===this.config.sparkline.show.chart_type?H`
          <rect
            class='dots-hit_area'
            height=${this.Graph.height}
            width=${this.Graph.width}
            stroke-width="0"
            opacity="0"
          ></rect>
          `:H``}
      ${t.map(((t,i)=>this.renderSvgPoint(t,e,this.Graph.bucketMeta[i].start.toISOString())))}
    </g>`}renderPoints(){if("dots"!==this.config.sparkline.show.chart_type&&!0!==this.config.sparkline.show.points&&!0!==this.config.sparkline.line?.show_dots&&!0!==this.config.sparkline.area?.show_dots)return"";const t=this.Graph._calcY(this.Graph.coords).map(((t,e)=>[t[0],t[1],t[2],e]));return this.renderSvgPoints(t,0)}renderTooltip(){const t=ft.toStyleDict(this.config.sparkline.tooltip?.styles),e={left:void 0!==this.tooltip.x?`${this.tooltip.x}px`:"0px",top:void 0!==this.tooltip.y?`${this.tooltip.y}px`:"0px",transform:"translate(-50%, calc(-100% - 6px))","font-size":t["font-size"]??"0.5em","max-width":"calc(100% - 24px)","pointer-events":"none",display:this.tooltipVisible?"block":"none"},i={display:"inline-flex","align-items":"baseline","justify-content":"flex-end","text-align":"right","white-space":"nowrap"},s={"font-size":"0.72em",transform:"translateY(-0.32em)",opacity:"0.8"};return O`
      <div id="sparkline-tooltip-${this.cardId}-${this.index}" class="sparkline-tooltip" style=${mt(e)}>
        <div class="sparkline-tooltip__title"></div>
        <div class="sparkline-tooltip__row">
          <span></span>
          <span style=${mt(i)}>
            <span></span>
            <span style=${mt(s)}></span>
          </span>
        </div>
        <div class="sparkline-tooltip__row">
          <span></span>
          <span style=${mt(i)}>
            <span></span>
            <span style=${mt(s)}></span>
          </span>
        </div>
        <div class="sparkline-tooltip__row">
          <span></span>
          <span style=${mt(i)}>
            <span></span>
            <span style=${mt(s)}></span>
          </span>
        </div>
      </div>
    `}renderActiveIndicator(){return"radial_barcode"===this.config.sparkline.show.chart_type?"":H`
      <line
        id="sparkline-active-indicator-${this.cardId}-${this.index}"
        class="sparkline-active-indicator"
        x1="${this.activeX??0}"
        y1="${this.Graph.drawArea.y}"
        x2="${this.activeX??0}"
        y2="${this.Graph.drawArea.y+this.Graph.drawArea.height}"
        style="stroke:var(--primary-text-color);stroke-width:1;opacity:0.45;visibility:${void 0===this.activeX?"hidden":"visible"};pointer-events:none;"
      ></line>
    `}renderActiveIndicatorV1(){return H`
      <line
        class="sparkline-active-indicator"
        x1="0"
        y1="${this.Graph.drawArea.y}"
        x2="0"
        y2="${this.Graph.drawArea.y+this.Graph.drawArea.height}"
        style="stroke:var(--primary-text-color);stroke-width:1;opacity:0;pointer-events:none;"
      ></line>
    `}renderSvgStateBands(){if("state_bands"!==this.config.sparkline.show.chart_type)return"";const t=this.config.sparkline.animate&&this.historySeries,e=this.getRenderStyles(Sa.mergeDeep(this.getStyles({}),ft.toStyleDict(this.config.sparkline.state_bands.styles)));return H`
      <g class='state-bands'>
        <rect
          class='state-bands__hit-area'
          x=${this.Graph.drawArea.x}
          y=${this.Graph.drawArea.y}
          width=${this.Graph.drawArea.width}
          height=${this.Graph.drawArea.height}
          stroke-width='0'
          opacity='0'
        ></rect>
        ${this.stateBands.map((i=>i.segments.map((i=>{const s=this.computeColor(i.value,this.entity_index),a={...e,fill:s,stroke:s};return H`
              <rect
                class='state-bands__segment'
                data-state=${i.state}
                data-value=${i.value}
                data-start=${i.start.toISOString()}
                data-end=${i.end.toISOString()}
                x=${i.x}
                y=${i.y}
                width=${i.width}
                height=${i.height}
                rx=${ka.calculateSvgDimension(this.config.sparkline.state_bands.radius)}
                ry=${ka.calculateSvgDimension(this.config.sparkline.state_bands.radius)}
                style=${mt(a)}
              >
                ${t?H`
                    <animate
                      attributeName='width'
                      from='0'
                      to=${i.width}
                      begin='0s'
                      dur='2s'
                      fill='remove'
                      restart='whenNotActive'
                      repeatCount='1'
                      calcMode='spline'
                      keyTimes='0; 1'
                      keySplines='0.215 0.61 0.355 1'
                    ></animate>
                  `:""}
              </rect>
            `}))))}
      </g>
    `}renderSvgTrafficLight(t,e){const i=t.value||[];return H`
      ${i.map(((e,i)=>{const s=void 0!==e?this.computeColor(e+.001,0):"var(--theme-sys-elevation-surface-neutral4)",a=Array.isArray(t.y)?t.y[i]:t.y,r=Math.max(1,t.height-this.svg.line_width),o=Math.max(1,t.width-this.svg.line_width);return H`
          <rect
            x=${t.x+this.svg.line_width/2}
            y=${a-t.height+this.svg.line_width/2}
            height=${r}
            width=${o}
            fill=${s}
            stroke=${s}
            stroke-width=${this.svg.line_width?this.svg.line_width:0}
            rx="0"
            ry="0"
            pathLength="10"
          ></rect>
        `}))}
    `}renderSvgGraded(t,e){if(!t)return"";const i=this.computeColor(this.card.entities[e].state,e);return H`
      <g class='traffic-lights'
        ?tooltip=${this.tooltip.entity===e}
        ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
        ?init=${this.length[e]}
        anim=${this.config.sparkline.animate&&"hover"!==this.config.sparkline.show.points}
        style="animation-delay: ${this.config.sparkline.animate?.5*e+.5+"s":"0s"}"
        fill=${i}
        stroke=${i}
        stroke-width=${this.svg.line_width/2}
      >
        ${t.map((t=>this.renderSvgTrafficLight(t,e)))}
      </g>
    `}renderSvgEqualizerMask(t,e){if("equalizer"!==this.config.sparkline.show.chart_type)return"";if(!t)return"";const i=this.config.sparkline.animate&&("real_time"===this.config.period.type||this.historySeries),s=this.animationBaselineY;if(!0===this.config.sparkline.equalizer.square){const e=Math.min(t[0].width,t[0].height),i=e<t[0].height?(this.Graph.drawArea.height-this.config.sparkline.equalizer.value_buckets*e)/(this.config.sparkline.equalizer.value_buckets-1):0;t=t.map((t=>{const s={...t};return e<t.height&&(s.y=t.y.map(((t,s)=>this.Graph.drawArea.y+this.Graph.drawArea.height-s*(e+i)))),s.width=e,s.height=e,s}))}return H`
      <mask id=${`equalizer-bg-${this.cardId}-${e}`}>
        ${t.map((t=>t.value.map(((e,a)=>H`
          <rect
            x=${t.x}
            y=${t.y[a]-t.height}
            height=${Math.max(1,t.height)}
            width=${Math.max(1,t.width)}
            fill='white'
          >
            ${i?H`
              <animate
                attributeName='y'
                from=${s}
                to=${t.y[a]-t.height}
                begin='0s'
                dur='2s'
                fill='remove'
                restart='whenNotActive'
                repeatCount='1'
                calcMode='spline'
                keyTimes='0; 1'
                keySplines='0.215 0.61 0.355 1'
              ></animate>
            `:""}
          </rect>
        `))))}
      </mask>
    `}renderSvgBarsMask(t,e){if("bar"!==this.config.sparkline.show.chart_type)return"";if(!t)return"";const i=this.config.sparkline.animate&&("real_time"===this.config.period.type||this.historySeries);return H`
      <mask id=${`bars-bg-${this.cardId}-${e}`}>
        ${t.map((t=>H`
          <rect
            x=${t.x}
            y=${t.y}
            height=${Math.max(1,t.height)}
            width=${Math.max(1,t.width)}
            fill='white'
          >
            ${i?H`
              <animate
                attributeName='y'
                from=${t.value>0?t.y+Math.max(1,t.height):t.y}
                to=${t.y}
                begin='0s'
                dur='2s'
                fill='remove'
                restart='whenNotActive'
                repeatCount='1'
                calcMode='spline'
                keyTimes='0; 1'
                keySplines='0.215 0.61 0.355 1'
              ></animate>
              <animate
                attributeName='height'
                from='0'
                to=${Math.max(1,t.height)}
                begin='0s'
                dur='2s'
                fill='remove'
                restart='whenNotActive'
                repeatCount='1'
                calcMode='spline'
                keyTimes='0; 1'
                keySplines='0.215 0.61 0.355 1'
              ></animate>
            `:""}
          </rect>
        `))}
      </mask>
    `}renderSvgEqualizerBackground(t,e){if("equalizer"!==this.config.sparkline.show.chart_type)return"";if(!t)return"";const i=this.gradient[0]?`url(#grad-${this.cardId}-${this.index}-0)`:this.computeColor(this.card.entities[e].state,e);return H`
      <rect
        class='equalizer--bg'
        ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
        id=${`equalizer-bg-${this.cardId}-${e}`}
        fill=${i}
        height="100%"
        width="100%"
        mask=${`url(#equalizer-bg-${this.cardId}-${e})`}
      ></rect>
    `}renderSvgBarsBackground(t,e){if("bar"!==this.config.sparkline.show.chart_type)return"";if(!t)return"";const i=this.gradient[0]?`url(#grad-${this.cardId}-0)`:this.computeColor(this.card.entities[e].state,e);return H`
      <rect
        class='bars--bg'
        ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
        id=${`bars-bg-${this.cardId}-${e}`}
        fill=${i}
        height="100%"
        width="100%"
        mask=${`url(#bars-bg-${this.cardId}-${e})`}
      ></rect>
    `}renderSvgBars(t,e){if(!t)return"";const i=this.config.sparkline.animate&&("real_time"===this.config.period.type||this.historySeries);return H`
      <g class='bars' ?anim=${this.config.sparkline.animate}>
        <rect
          class='bars-hit_area'
          width=${this.Graph.width}
          height=${this.Graph.height}
          stroke-width='0'
          opacity='0'
        ></rect>
        ${t.map(((t,s)=>{const a=this.computeColor(t.value,e);return H`
            <rect
              class='bar'
              x=${t.x}
              y=${t.y}
              height=${Math.max(1,t.height)}
              width=${Math.max(1,t.width)}
              fill=${a}
              stroke=${a}
            >
              ${i?H`
                <animate
                  attributeName='y'
                  from=${t.value>0?t.y+Math.max(1,t.height):t.y}
                  to=${t.y}
                  begin='0s'
                  dur='2s'
                  fill='remove'
                  restart='whenNotActive'
                  repeatCount='1'
                  calcMode='spline'
                  keyTimes='0; 1'
                  keySplines='0.215 0.61 0.355 1'
                ></animate>
                <animate
                  attributeName='height'
                  from='0'
                  to=${Math.max(1,t.height)}
                  begin='0s'
                  dur='2s'
                  fill='remove'
                  restart='whenNotActive'
                  repeatCount='1'
                  calcMode='spline'
                  keyTimes='0; 1'
                  keySplines='0.215 0.61 0.355 1'
                ></animate>
              `:""}
            </rect>
          `}))}
      </g>
    `}renderSvgRadialBarcodeBin(t,e,i){const s=this.computeColor(t.value,this.entity_index),a=ft.toStyleDict(this.config.sparkline.radial_barcode?.foreground?.styles);return delete a.fill,delete a.stroke,H`
      <path
        class='sparkline-radial-barcode__bin'
        data-point-index=${i}
        d=${e}
        fill=${s}
        stroke=${s}
        style=${mt(this.getRenderStyles(a))}
      ></path>
    `}renderSvgRadialBarcodeBackgroundBin(t,e,i){const s=ft.toStyleDict(this.config.sparkline.radial_barcode?.background?.styles);return delete s.fill,delete s.stroke,H`
      <path
        class='sparkline-radial-barcode__bg-bin'
        data-point-index=${i}
        d=${e}
        fill='lightgray'
        style=${mt(this.getRenderStyles(s))}
      ></path>
    `}renderSvgRadialBarcodeBackground(t){const{start:e,end:i,start2:s,end2:a,largeArcFlag:r,sweepFlag:o}=this.Graph._calcRadialBarcodeCoords(0,359.9,!0,t,t,this.radialBarcodeChartWidth),n={x:t-this.radialBarcodeChartWidth,y:t-this.radialBarcodeChartWidth},h=ft.toStyleDict(this.config.sparkline.radial_barcode?.background?.styles),l=["M",e.x,e.y,"A",t,t,0,r,o,i.x,i.y,"L",a.x,a.y,"A",n.x,n.y,0,r,"0"===o?"1":"0",s.x,s.y,"Z"].join(" ");return H`
      <path fill="lightgray" d="${l}" style=${mt(this.getRenderStyles(h))}></path>
    `}renderSvgRadialBarcodeFace(t){if(!this.config?.sparkline?.radial_barcode?.face)return H``;const e=.62*t,i=.84*t,s=.74*t;return H`
      ${(()=>!0===this.config.sparkline.radial_barcode.face?.show_day_night?H`
        <circle pathLength="1" r="${e}" cx=${this.svg.width/2} cy="${this.svg.height/2}"></circle>
      `:"")()}
      ${(()=>!0===this.config.sparkline.radial_barcode.face?.show_hour_marks?H`
        <circle pathLength=${this.config.sparkline.radial_barcode.face.hour_marks_count} r="${i}" cx=${this.svg.width/2} cy="${this.svg.height/2}"></circle>
      `:"")()}
      ${(()=>"absolute"===this.config.sparkline.radial_barcode.face?.show_hour_numbers?H`
        <g>
          <text x="${this.svg.width/2}" y="${this.svg.height/2-s}">24</text>
          <text x="${this.svg.width/2}" y="${this.svg.height/2+s}">12</text>
          <text x="${this.svg.width/2+s}" y="${this.svg.height/2}">6</text>
          <text x="${this.svg.width/2-s}" y="${this.svg.height/2}">18</text>
        </g>
      `:"")()}
      ${(()=>"relative"===this.config.sparkline.radial_barcode.face?.show_hour_numbers?H`
        <g>
          <text x="${this.svg.width/2}" y="${this.svg.height/2-s}">0</text>
          <text x="${this.svg.width/2}" y="${this.svg.height/2+s}">-12</text>
          <text x="${this.svg.width/2+s}" y="${this.svg.height/2}">-18</text>
          <text x="${this.svg.width/2-s}" y="${this.svg.height/2}">-6</text>
        </g>
      `:"")()}
    `}renderSvgRadialBarcode(t,e){if(!t)return"";const i=this.Graph.getRadialBarcodePaths(),s=this.Graph.getRadialBarcodeBackgroundPaths();return H`
      <g class='graph-clock'
        ?tooltip=${this.tooltip.entity===e}
        ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
        ?init=${this.length[e]}
        anim=${this.config.sparkline.animate&&"hover"!==this.config.sparkline.show.points}
        style="animation-delay: ${this.config.sparkline.animate?.5*e+.5+"s":"0s"}"
        stroke-width=${this.svg.line_width/2}
      >
        ${this.radialBarcodeChartBackground[e].map(((t,e)=>this.renderSvgRadialBarcodeBackgroundBin(t,s[e],e)))}
        ${t.map(((t,e)=>this.renderSvgRadialBarcodeBin(t,i[e],e)))}
        ${this.renderSvgRadialBarcodeFace(this.svg.width/2-40)}
      </g>
    `}renderSvgBarcode(t,e){if(!t)return"";const i=ft.toStyleDict(this.config.sparkline.barcode?.styles);return delete i.fill,delete i.stroke,H`
      <g class='bars' ?anim=${this.config.sparkline.animate}>
        <rect
          class='barcode-hit_area'
          width=${this.Graph.width}
          height=${this.Graph.height}
          stroke-width='0'
          opacity='0'
        ></rect>      
        ${t.map(((t,s)=>{const a=this.computeColor(t.value,e);return H`
            <rect
              class='bar'
              x=${t.x}
              y=${t.y}
              height=${Math.max(1,t.height)}
              width=${t.width}
              fill=${a}
              stroke=${a}
              style=${mt(this.getRenderStyles(i))}
            >
              ${this.config.sparkline.animate&&("real_time"===this.config.period.type||this.historySeries)?H`
                <animate
                  attributeName='x'
                  from=${this.Graph.drawArea.x}
                  to=${t.x}
                  begin='0s'
                  dur='3s'
                  fill='remove'
                  restart='whenNotActive'
                  repeatCount='1'
                  calcMode='spline'
                  keyTimes='0; 1'
                  keySplines='0.215 0.61 0.355 1'
                ></animate>
              `:""}
            </rect>
          `}))}
      </g>
    `}renderSvg(){if("calendar"===this.config.period.type&&this.config.period.calendar.offset<0&&!this.historySeries)return H`
        <g
          transform="${this.getGroupScaleTransform()}"
          style="${this.getGroupScaleStyle()}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="sparkline-${this.cardId}-${this.index}"
            x="${this.svg.x}"
            y="${this.svg.y}"
            width="${this.svg.width}"
            height="${this.svg.height}"
            viewBox="0 0 ${this.svg.width} ${this.svg.height}"
            overflow="hidden"
            touch-action="none"
            style="touch-action:none; pointer-events:auto; overflow:hidden;"
          ></svg>
        </g>
      `;const t=H`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="sparkline-${this.cardId}-${this.index}"
          x="${this.svg.x}"
          y="${this.svg.y}"
          width="${this.svg.width}"
          height="${this.svg.height}"
          viewBox="0 0 ${this.svg.width} ${this.svg.height}"
          overflow="hidden"
          touch-action="none"
          style="touch-action:none; pointer-events:auto; overflow:hidden;"
        >
          <defs>
            ${this.renderSvgGradient(this.gradient)}
            ${this.area.map(((t,e)=>this.renderSvgAreaMask(t,e)))}
            ${this.areaMinMax.map(((t,e)=>this.renderSvgAreaMinMaxMask(t,e)))}
            ${this.line.map(((t,e)=>this.renderSvgLineMask(t,e)))}
          </defs>
          <g transform="translate(0 ${this.animationBaselineY})">
            <g>
              ${this.config.sparkline.animate&&["line","area"].includes(this.config.sparkline.show.chart_type)&&("real_time"===this.config.period.type||this.historySeries)?H`
                <animateTransform
                  attributeName='transform'
                  type='scale'
                  from='1 0'
                  to='1 1'
                  begin='0s'
                  dur='2s'
                  fill='remove'
                  restart='whenNotActive'
                  repeatCount='1'
                  calcMode='spline'
                  keyTimes='0; 1'
                  keySplines='0.215 0.61 0.355 1'
                ></animateTransform>
              `:""}
              <g transform="translate(0 ${-this.animationBaselineY})">
                ${this.area.map(((t,e)=>this.renderSvgAreaBackground(t,e)))}
                ${this.areaMinMax.map(((t,e)=>this.renderSvgAreaMinMaxBackground(t,e)))}
                ${this.line.map(((t,e)=>this.renderSvgLineBackground(t,e)))}
              </g>
            </g>
          </g>
          ${this.bar.map(((t,e)=>this.renderSvgBarsMask(t,e)))}
          ${this.bar.map(((t,e)=>this.renderSvgBarsBackground(t,e)))}
          ${this.bar.map(((t,e)=>this.renderSvgBars(t,e)))}
          ${this.equalizer.map(((t,e)=>this.renderSvgEqualizerMask(t,e)))}
          ${this.equalizer.map(((t,e)=>this.renderSvgEqualizerBackground(t,e)))}
          ${this.barcodeChart.map(((t,e)=>this.renderSvgBarcode(t,e)))}
          ${this.radialBarcodeChart.map(((t,e)=>this.renderSvgRadialBarcode(t,e)))}
          ${this.graded.map(((t,e)=>this.renderSvgGraded(t,e)))}
          ${this.renderSvgStateBands()}
          ${this.renderGrid()}
          ${this.renderAxis()}
          ${this.renderPoints()}
          ${this.renderActiveIndicator()}
          ${this.renderTickmarks()}
          ${this.renderAxisLabels()}
        </svg>
      </g>
    `;return t}render(){return this.renderItemLayers(this.renderSvg())}}const wn="card",$n=50;class kn{constructor(t){if(t?.[wn])throw new Error("[groups] card is reserved for the card root group");this.groups={[wn]:{id:wn,xpos:$n,ypos:$n},...t??{}},this.resolvedGroups={},Object.keys(this.groups).forEach((t=>{this.getGroup(t)}))}getGroupForItem(t){return this.getGroup(t?.group??wn)}getGroupChainForItem(t){const e=[];let i=t?.group??wn;for(;i;){const t=this.groups[i];e.unshift(t),i=i===wn?void 0:t.parent??wn}return e}getGroup(t,e=[]){if(this.resolvedGroups[t])return this.resolvedGroups[t];if(e.includes(t))throw new Error(`[groups] Circular parent reference: ${[...e,t].join(" -> ")}`);const i=this.groups[t];if(!i)throw new Error(`[groups] Unknown group: ${t}`);const s=i.parent??wn,a=t===wn?void 0:this.getGroup(s,[...e,t]),r=a?a.xpos+i.xpos-$n:i.xpos,o=a?a.ypos+i.ypos-$n:i.ypos,n={...i,id:t,parent:t===wn?void 0:s,xpos:r,ypos:o,svg:{xpos:ka.calculateSvgDimension(r),ypos:ka.calculateSvgDimension(o)}};return this.resolvedGroups[t]=n,n}calculateSvgCoordinatesInGroup(t){const e=t.xpos,i=t.yposc||t.ypos,s=this.getGroupForItem(t),a=s.xpos+e-$n,r=s.ypos+i-$n;return{xpos:ka.calculateSvgDimension(a),ypos:ka.calculateSvgDimension(r)}}getGroupScaleTransform(t){const e=this.getGroupForItem(t);if(!e.scale&&!t?.flip)return"";const i=e.scale?.x??e.scale??1,s=e.scale?.y??e.scale??1;return`scale(${i*("x"===t?.flip||"both"===t?.flip?-1:1)}, ${s*("y"===t?.flip||"both"===t?.flip?-1:1)})`}getGroupScaleStyle(t){const e=this.getGroupForItem(t);return e.scale?`transform-origin:${e.svg.xpos}px ${e.svg.ypos}px; transform-box:view-box;`:`transform-origin:${t.svg.xpos}px ${t.svg.ypos}px; transform-box:view-box;`}}const Sn=Object.freeze(["horseshoes","horseshoes_v2","states","names","areas","circles","arcs","rectangles","lines","hlines","vlines","icons","sparklines"]),Mn=Object.freeze(["rectangles","circles","arcs"]);class An{static STATIC_REF_MARKER=Symbol("fhs-static-ref");static compile(t){Sn.forEach((e=>{const i=t.layout?.[e];Array.isArray(i)&&(t.layout[e]=An.compileItems(i))})),An.compileDefinitions(t.layout?.clips),An.compileDefinitions(t.layout?.masks)}static compileDefinitions(t){t&&Object.values(t).forEach((t=>{Mn.forEach((e=>{const i=t[e];Array.isArray(i)&&(t[e]=An.compileItems(i))}))}))}static compileItems(t){const e=new Map;return t.map(((t,i)=>{let s;if(void 0===t.same_as)s=t;else{const a=e.get(String(t.same_as));if(!a)throw new Error(`same_as '${t.same_as}' not found for item ${i}`);const{same_as:r,same_as_replace:o=[],...n}=t,h={...a},l=[...o],c=(t,e)=>{t&&"object"==typeof t&&t[An.STATIC_REF_MARKER]?l.push(e.join(".")):t&&"object"==typeof t&&!Array.isArray(t)&&Object.entries(t).forEach((([t,i])=>{c(i,[...e,t])}))};Object.entries(n).forEach((([t,e])=>{c(e,[t])})),l.forEach((t=>{An.deleteReplacePath(h,t)})),s=Sa.mergeDeep(h,n),s=An.applyDeltas(t,s,i),delete s.same_as,delete s.same_as_replace,Object.keys(s).filter((t=>t.startsWith("same_as_d"))).forEach((t=>delete s[t]))}return e.set(String(s.id),s),s}))}static applyDeltas(t,e,i){return Object.entries(t).forEach((([t,s])=>{if(!t.startsWith("same_as_d"))return;const a=t.substring(9);if(!a)throw new Error(`Invalid same_as delta field '${t}' for item ${i}`);if(void 0===e[a])throw new Error(`same_as delta '${t}' requires '${a}' for item ${i}`);if(!An.isStaticNumber(e[a]))throw new Error(`same_as delta '${t}' requires numeric '${a}' for item ${i}`);if(!An.isStaticNumber(s))throw new Error(`same_as delta '${t}' must be numeric for item ${i}`);e[a]+=s})),e}static deleteReplacePath(t,e){const i=String(e).split(".");let s=t;for(let a=0;a<i.length-1;a+=1){const t=i[a];if(void 0===s[t])return;s[t]=Array.isArray(s[t])?[...s[t]]:{...s[t]},s=s[t]}delete s[i[i.length-1]]}static mergeListByKey(t,e,i){const s=new Map;return t.forEach((t=>{s.set(String(t[i]),t)})),e.forEach((t=>{const e=String(t[i]);s.has(e)?s.set(e,Sa.mergeDeep(s.get(e),t)):s.set(e,t)})),[...s.values()]}static isStaticNumber(t){return"number"==typeof t&&Number.isFinite(t)}}class Tn{static compile(t,e){if(delete t.fhs_templates,e.lovelace=e.lovelace||ka.getLovelace(),void 0!==t.template){const i=Tn.compileTemplateUse(t,e);(i.dev?.debug||t.dev?.debug)&&console.log("[FHS templates] compiled root template",{template:t.template,compiledConfig:i}),Object.keys(t).forEach((e=>delete t[e])),Object.entries(i).forEach((([e,i])=>{t[e]=i}))}const i=Tn.compileTemplateParts(t,e);return Object.keys(t).forEach((e=>delete t[e])),Object.entries(i).forEach((([e,i])=>{t[e]=i})),t}static compileTemplateUse(t,e){const i="string"==typeof t.template?t.template:t.template.name,s="string"==typeof t.template?void 0:t.template.variables,a=Tn.getTemplate(e,i),r=Tn.replaceVariables(s,a),o=Sa.mergeDeep({},t);return delete o.template,Tn.mergeTemplateConfig(r,o)}static compileTemplateParts(t,e){if(Array.isArray(t))return t.map((t=>Tn.compileTemplateParts(t,e)));if(t&&"object"==typeof t){if(void 0!==t.template){const i=Tn.compileTemplateUse(t,e);return Tn.compileTemplateParts(i,e)}const i={};return Object.entries(t).forEach((([t,s])=>{i[t]="cards"===t?s:Tn.compileTemplateParts(s,e)})),i}return t}static getTemplate(t,e){let i;if([t.lovelace.config,t.lovelace.rawConfig].forEach((t=>{i||(i=t.fhs_templates?.templates?.[e],i||t.views.forEach((t=>{i||(i=t.fhs_templates?.templates?.[e])})))})),!i)throw new Error(`FHS template '${e}' not found`);return i}static replaceVariables(t,e){if(!t&&!e.template.defaults)return Sa.mergeDeep({},e[e.template.type]);let i=t?t.slice(0):[];e.template.defaults&&(i=i.concat(e.template.defaults));let s=JSON.stringify(e[e.template.type]);return i.forEach((t=>{const e=Object.keys(t)[0],i=Object.values(t)[0];if("number"==typeof i||"boolean"==typeof i){const t=new RegExp(`"\\[\\[${e}\\]\\]"`,"gm");s=s.replace(t,i)}if("object"==typeof i){const t=new RegExp(`"\\[\\[${e}\\]\\]"`,"gm"),a=JSON.stringify(i);s=s.replace(t,a)}else{const t=new RegExp(`\\[\\[${e}\\]\\]`,"gm");s=s.replace(t,i)}})),JSON.parse(s)}static mergeTemplateConfig(t,e){const i=Sa.mergeDeep({},t);return Object.entries(e).forEach((([t,e])=>{Array.isArray(e)?i[t]=e.map((t=>t&&"object"==typeof t?Sa.mergeDeep(Array.isArray(t)?[]:{},t):t)):i[t]=e&&"object"==typeof e?Tn.mergeTemplateConfig(i[t]??{},e):e})),i}}const Cn=["xpos","ypos","width","height","zpos","embedded","frameless"];class En{constructor(t){this.parentCard=t,this.items=[]}async setConfig(t){const e=await window.loadCardHelpers();this.items=await Promise.all(t.map((async(t,i)=>{const s={...t};Cn.forEach((t=>delete s[t])),"custom:flex-horseshoe-card"===t.type&&!1!==t.embedded&&(s.embedded=!0);const a=await e.createCardElement(s);return this.parentCard._hass&&(a.hass=this.parentCard._hass),{card:a,index:i,xpos:t.xpos,ypos:t.ypos,width:t.width,height:t.height,zpos:t.zpos,frameless:!1!==t.frameless}}))),this.parentCard.requestUpdate(),this.parentCard.updateComplete.then((()=>this.removeChildCardShells()))}setHass(t){this.items.forEach((e=>{e.card.hass=t}))}async removeChildCardShells(){const t=e=>{if("ha-card"===e.localName)return e;const i=e.shadowRoot?.querySelector("ha-card");if(i)return i;const s=Array.from(e.shadowRoot?.children??[]).map((e=>t(e))).find((t=>t));return s||Array.from(e.children).map((e=>t(e))).find((t=>t))};await Promise.all(this.items.map((async e=>{e.frameless&&(e.card.updateComplete&&await e.card.updateComplete,await[1,2,3,4,5].reduce((async i=>{const s=await i;if(s)return s;await new Promise(requestAnimationFrame);const a=t(e.card);return!!a&&(a.style.background="transparent",a.style.border="0",a.style.boxShadow="none",a.style.padding="0",!0)}),Promise.resolve(!1)))})))}render(){const[t,e]=this.parentCard.aspectratio.split("/").map(Number),i=100*t,s=100*e;return O`
      <div class="fhs-child-card-layer">
        ${this.items.slice().sort(((t,e)=>Number(t.zpos??t.index)-Number(e.zpos??e.index)||t.index-e.index)).map((t=>{const e={left:(Number(t.xpos)-Number(t.width)/2)/i*100+"%",top:(Number(t.ypos)-Number(t.height)/2)/s*100+"%",width:Number(t.width)/i*100+"%",height:Number(t.height)/s*100+"%","z-index":String(t.zpos??t.index)};return O`<div
              class="fhs-child-card ${t.frameless?"fhs-child-card--frameless":""}"
              style=${mt(e)}
            >
              ${t.card}
            </div>`}))}
      </div>
    `}}class In{constructor(t,e,i){this.config=t,this.cardId=e,this.card=i,this.gradients=this.normalizeGradients(t.layout.gradients),this.clips=this.normalizeDefinitions(t.layout.clips),this.masks=this.normalizeDefinitions(t.layout.masks)}normalizeGradients(t){const e={};return Object.entries(t).forEach((([t,i])=>{const s="radial"===i.type?{type:"radial",gradientUnits:"objectBoundingBox",cx:"50%",cy:"50%",r:"50%",stops:[]}:{type:"linear",gradientUnits:"objectBoundingBox",x1:"0%",y1:"0%",x2:"100%",y2:"0%",stops:[]};e[t]=Sa.mergeDeep({},s,i),e[t].stops=e[t].stops.map((t=>{const e=Sa.mergeDeep({},{opacity:1},t);return"number"==typeof e.offset&&(e.offset=`${e.offset}%`),e})),["cx","cy","r","x1","y1","x2","y2"].forEach((i=>{"number"==typeof e[t][i]&&(e[t][i]="userSpaceOnUse"===e[t].gradientUnits?ka.calculateSvgDimension(e[t][i]):`${e[t][i]}%`)}))})),e}normalizeDefinitions(t){const e={};return Object.entries(t).forEach((([t,i])=>{e[t]=Sa.mergeDeep({},i,{rectangles:i.rectangles??[],circles:i.circles??[],arcs:i.arcs??[]}),Mn.forEach((i=>{e[t][i]=e[t][i].map((t=>void 0===t.dxpos&&void 0===t.dypos?t:Sa.mergeDeep({},{dxpos:0,dypos:0},t)))}))})),e}getGradientId(t){return`fhs-${this.cardId}-gradient-${t}`}getClipId(t,e,i){return e&&i?`fhs-${this.cardId}-clip-${t}-${i}-${e.id}`:`fhs-${this.cardId}-clip-${t}`}getClipUseId(t,e,i){return this.definitionUsesRelativePosition(this.clips[t])?this.getClipId(t,e,i):this.getClipId(t)}getMaskId(t,e,i){return e&&i?`fhs-${this.cardId}-mask-${t}-${i}-${e.id}`:`fhs-${this.cardId}-mask-${t}`}getMaskUseId(t,e,i){return this.definitionUsesRelativePosition(this.masks[t])?this.getMaskId(t,e,i):this.getMaskId(t)}getMaskUseIds(t,e,i){if(this.masks[t].soft_arc){const s=this.getMaskId(t,e,i);return[`${s}-edge`,`${s}-chord`]}return[this.getMaskUseId(t,e,i)]}renderDefs(){return H`
      ${this.renderGradients()}
      ${this.renderClips()}
      ${this.renderMasks()}
      ${this.renderRelativeClips()}
      ${this.renderRelativeMasks()}
    `}renderGradients(){return Object.entries(this.gradients).map((([t,e])=>"radial"===e.type?H`
          <radialGradient
            id="${this.getGradientId(t)}"
            gradientUnits="${e.gradientUnits}"
            cx="${e.cx}"
            cy="${e.cy}"
            r="${e.r}"
          >
            ${this.renderGradientStops(e.stops)}
          </radialGradient>
        `:H`
        <linearGradient
          id="${this.getGradientId(t)}"
          gradientUnits="${e.gradientUnits}"
          x1="${e.x1}"
          y1="${e.y1}"
          x2="${e.x2}"
          y2="${e.y2}"
        >
          ${this.renderGradientStops(e.stops)}
        </linearGradient>
      `))}renderGradientStops(t){return t.map((t=>H`
      <stop
        offset="${t.offset}"
        stop-color="${t.color}"
        stop-opacity="${t.opacity}"
      ></stop>
    `))}renderClips(){return Object.entries(this.clips).map((([t,e])=>this.definitionUsesRelativePosition(e)?H``:H`
        <clipPath id="${this.getClipId(t)}" clipPathUnits="userSpaceOnUse">
          ${this.renderShapeSections(e)}
        </clipPath>
      `))}renderMasks(){return Object.entries(this.masks).map((([t,e])=>this.definitionUsesRelativePosition(e)?H``:H`
        <mask id="${this.getMaskId(t)}" maskUnits="userSpaceOnUse">
          <g class="mask-clip-definition mask-clip-definition--mask" style=${mt(this.getDefinitionStyles(e))}>
            ${this.renderShapeSections(e)}
          </g>
        </mask>
      `))}renderRelativeClips(){return Object.entries(this.clips).map((([t,e])=>this.definitionUsesRelativePosition(e)?this.getItemsUsingDefinition("clip",t).map((({section:i,item:s})=>H`
        <clipPath id="${this.getClipId(t,s,i)}" clipPathUnits="userSpaceOnUse">
          ${this.renderShapeSections(e,s)}
        </clipPath>
      `)):H``))}renderRelativeMasks(){return Object.entries(this.masks).map((([t,e])=>this.definitionUsesRelativePosition(e)?this.getItemsUsingDefinition("mask",t).map((({section:i,item:s})=>e.soft_arc?this.renderSoftArcMasks(t,e,s,i):H`
          <mask id="${this.getMaskId(t,s,i)}" maskUnits="userSpaceOnUse">
            <g class="mask-clip-definition mask-clip-definition--mask" style=${mt(this.getDefinitionStyles(e))}>
              ${this.renderShapeSections(e,s)}
            </g>
          </mask>
        `)):H``))}renderShapeSections(t,e){return H`
      ${this.renderRectangles(t.rectangles,e)}
      ${this.renderCircles(t.circles,e)}
      ${this.renderArcs(t.arcs,e)}
    `}renderSoftArcMasks(t,e,i,s){const a=this.getMaskId(t,i,s),r=this.clips[e.soft_arc.clip].arcs[0],o=this.calculateArcDimensions(r,i),n=`${a}-edge-gradient`,h=`${a}-chord-gradient`,l=Number(e.soft_arc.edge.stops_start),c=e.soft_arc.edge.stops??[{offset:0,opacity:1},{offset:100,opacity:0}],d=Number(e.soft_arc.chord.stops_start),u=e.soft_arc.chord.stops??[{offset:0,opacity:1},{offset:100,opacity:0}],p=o.endX-o.startX,g=o.endY-o.startY,m=Math.sqrt(p**2+g**2),f=(o.startX+o.endX)/2,y=(o.startY+o.endY)/2;let v=-g/m,b=p/m;(f-o.xpos)*v+(y-o.ypos)*b<0&&(v=-v,b=-b);const _=Math.abs((f-o.xpos)*v+(y-o.ypos)*b),x=o.xpos,w=o.ypos,$=o.xpos+v*_,k=o.ypos+b*_,S=2*o.radius;return H`
      <radialGradient id="${n}" gradientUnits="objectBoundingBox" cx="50%" cy="50%" r="50%">
        ${c.map((t=>H`
          <stop
            offset="${l+Number(t.offset)/100*(100-l)}%"
            stop-color="white"
            stop-opacity="${t.opacity}"
          ></stop>
        `))}
      </radialGradient>
      <linearGradient
        id="${h}"
        gradientUnits="userSpaceOnUse"
        x1="${x}"
        y1="${w}"
        x2="${$}"
        y2="${k}"
      >
        ${u.map((t=>H`
          <stop
            offset="${d+Number(t.offset)/100*(100-d)}%"
            stop-color="white"
            stop-opacity="${t.opacity}"
          ></stop>
        `))}
      </linearGradient>
      <mask id="${a}-edge" maskUnits="userSpaceOnUse">
        <circle
          class="mask-clip-soft-arc-edge"
          cx="${o.xpos}"
          cy="${o.ypos}"
          r="${o.radius}"
          fill="url(#${n})"
        ></circle>
      </mask>
      <mask id="${a}-chord" maskUnits="userSpaceOnUse">
        <rect
          class="mask-clip-soft-arc-chord"
          x="${o.xpos-o.radius}"
          y="${o.ypos-o.radius}"
          width="${S}"
          height="${S}"
          fill="url(#${h})"
        ></rect>
      </mask>
    `}renderRectangles(t,e){return t.map((t=>{const i=this.calculateRectangleDimensions(t,e);return H`
        <path
          class="mask-clip-rectangle"
          d="${this.buildRoundedRectanglePath(i)}"
          style=${mt(this.getShapeStyles(t))}
        ></path>
      `}))}renderCircles(t,e){return t.map((t=>{const i=this.calculateCircleDimensions(t,e);return H`
        <circle
          class="mask-clip-circle"
          cx="${i.xpos}"
          cy="${i.ypos}"
          r="${i.radius}"
          style=${mt(this.getShapeStyles(t))}
        ></circle>
      `}))}renderArcs(t,e){return t.map((t=>{const i=this.calculateArcDimensions(t,e);return H`
        <path
          class="mask-clip-arc"
          d="${this.buildArcPath(i)}"
          style=${mt(this.getShapeStyles(t))}
        ></path>
      `}))}calculateRectangleDimensions(t,e){const i=this.calculateShapeCenter(t,e),s=ka.calculateSvgDimension(t.width),a=ka.calculateSvgDimension(t.height),r="object"==typeof t.radius?t.radius:{all:t.radius},o=Math.min(a,s)/2,n=t=>Math.min(o,Math.max(0,ka.calculateSvgDimension(t)));return i.width=s,i.height=a,i.x=i.xpos-s/2,i.y=i.ypos-a/2,i.radiusTopLeft=n(r.top_left??r.left??r.top??r.all),i.radiusTopRight=n(r.top_right??r.right??r.top??r.all),i.radiusBottomLeft=n(r.bottom_left??r.left??r.bottom??r.all),i.radiusBottomRight=n(r.bottom_right??r.right??r.bottom??r.all),i}calculateCircleDimensions(t,e){const i=this.calculateShapeCenter(t,e);return i.radius=void 0!==t.radius_percent?ka.calculateSvgDimension(t.radius_percent):t.radius,i}calculateArcDimensions(t,e){const i=this.calculateShapeCenter(t,e),s=ka.calculateSvgDimension(t.radius),a=Number(t.arc_degrees),r=90+(360-a)/2+Number(t.rotate),o=r+a,n=r*Math.PI/180,h=o*Math.PI/180;return i.radius=s,i.arcDegrees=a,i.largeArcFlag=Math.abs(a)>180?1:0,i.sweepFlag=a>=0?1:0,i.startX=i.xpos+s*Math.cos(n),i.startY=i.ypos+s*Math.sin(n),i.endX=i.xpos+s*Math.cos(h),i.endY=i.ypos+s*Math.sin(h),i}buildRoundedRectanglePath(t){return`\n      M ${t.x+t.radiusTopLeft} ${t.y}\n      h ${t.width-t.radiusTopLeft-t.radiusTopRight}\n      q ${t.radiusTopRight} 0 ${t.radiusTopRight} ${t.radiusTopRight}\n      v ${t.height-t.radiusTopRight-t.radiusBottomRight}\n      q 0 ${t.radiusBottomRight} -${t.radiusBottomRight} ${t.radiusBottomRight}\n      h -${t.width-t.radiusBottomRight-t.radiusBottomLeft}\n      q -${t.radiusBottomLeft} 0 -${t.radiusBottomLeft} -${t.radiusBottomLeft}\n      v -${t.height-t.radiusBottomLeft-t.radiusTopLeft}\n      q 0 -${t.radiusTopLeft} ${t.radiusTopLeft} -${t.radiusTopLeft}\n      Z\n    `}buildArcPath(t){return Math.abs(t.arcDegrees)>=360?`\n        M ${t.xpos-t.radius} ${t.ypos}\n        A ${t.radius} ${t.radius} 0 1 1 ${t.xpos+t.radius} ${t.ypos}\n        A ${t.radius} ${t.radius} 0 1 1 ${t.xpos-t.radius} ${t.ypos}\n        Z\n      `:`\n      M ${t.startX} ${t.startY}\n      A ${t.radius} ${t.radius} 0 ${t.largeArcFlag} ${t.sweepFlag} ${t.endX} ${t.endY}\n      Z\n    `}calculateShapeCenter(t,e){if(void 0!==t.dxpos||void 0!==t.dypos){const i=this.card._calculateSvgCoordinatesInGroup(e);return{xpos:i.xpos+ka.calculateSvgDimension(t.dxpos),ypos:i.ypos+ka.calculateSvgDimension(t.dypos)}}return this.card._calculateSvgCoordinatesInGroup(t)}definitionUsesRelativePosition(t){return!!t.soft_arc||Mn.some((e=>t[e].some((t=>void 0!==t.dxpos||void 0!==t.dypos))))}getItemsUsingDefinition(t,e){const i=[];return Sn.forEach((s=>{const a=this.config.layout[s];Array.isArray(a)&&a.forEach((a=>{(Array.isArray(a[t])?a[t]:[a[t]]).includes(e)&&i.push({section:s,item:a})}))})),i}getDefinitionStyles(t){return ft.toStyleDict(t.styles)}getShapeStyles(t){return this.applyGradientRefs(ft.toStyleDict(t.styles))}applyGradientRefs(t){const e={};return Object.entries(t).forEach((([t,i])=>{const s=String(i).trim().match(/^gradient\(([^)]+)\)$/);e[t]=s?`url(#${this.getGradientId(s[1].trim())})`:i})),e}renderItemLayers(t,e,i){let s=e;if(t.mask){(Array.isArray(t.mask)?t.mask:[t.mask]).forEach((e=>{this.getMaskUseIds(e,t,i).forEach((t=>{s=H`<g mask="url(#${t})">${s}</g>`}))}))}return t.clip&&(s=H`<g clip-path="url(#${this.getClipUseId(t.clip,t,i)})">${s}</g>`),s}}class Nn{static cache=new Map;static load(t){if(this.cache.has(t))return this.cache.get(t);const e=fetch(t).then((async e=>{if(!e.ok)throw new Error(`Could not load palette: ${t}`);return e.json()}));return this.cache.set(t,e),e}static async loadAll(t={}){const e=await Promise.all(Object.entries(t||{}).map((async([t,e])=>[t,await this.load(e)])));return Object.fromEntries(e)}static apply(t,e,i){Object.entries(e.ref).forEach((([e,i])=>{t.style.setProperty(`--${e}`,i)})),Object.entries(e.modes[i]).forEach((([e,i])=>{t.style.setProperty(`--${e}`,i)}))}static applyAll(t,e,i){Object.entries(e).forEach((([,e])=>{this.apply(t,e,i)}))}}console.info("%c FLEX-HORSESHOE-CARD %c Version 5.4.7-dev.19 ","color: white; font-weight: bold; background: darkgreen","color: darkgreen; font-weight: bold; background: white");const Rn={action:"more-info"},Dn={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed",scale_style:"fixed"};class Pn extends nt{constructor(){if(super(),va.setElement(this),this.palettesLoaded=!1,this.cardId=Math.random().toString(36).substr(2,9),this._hass=void 0,this.hassConnection=void 0,this.hassConnectionReadyHandler=()=>{this._getRenderableTools().forEach((t=>t.hassConnected()))},this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.viewBoxSize=_a,this.viewBox={width:_a,height:_a},this.colorStops={},this.animations={},this.animations.lines={},this.childCards=new En(this),this.animations.vlines={},this.animations.hlines={},this.animations.circles={},this.animations.arcs={},this.animations.rectangles={},this.animations.icons={},this.animations.iconsIcon={},this.animations.names={},this.animations.areas={},this.animations.states={},this.rectangleTools=[],this.lineTools=[],this.circleTools=[],this.arcTools=[],this.nameTools=[],this.areaTools=[],this.stateTools=[],this.iconTools=[],this.sparklineGraphTools=[],this.groupManager=void 0,this.sourceGroupConfigs=void 0,this.activeGroupConfigs=void 0,this.activeGroupSignatures={},this.groupsHaveJavascript=!1,this.changedGroupIds=new Set,this.resolvedEntityConfigs=[],this.entityConfigsInitialized=!1,this.evaluateJavascriptTemplates=!1,this.sourceCardStyles=void 0,this.activeCardStyles=void 0,this.cardStylesHaveJavascript=!1,this.colorCache={},this.isAndroid=!1,this.isSafari=!1,this.iOS=!1,this.resolvedVariables={},this.iconCache={},this.svgUrlCache||={},this.theme={},this.theme.checked=!1,this.theme.isLoaded=!1,this.theme.modeChanged=!1,this.theme.darkMode=!1,this.theme.light={},this.theme.dark={},this.palettes={},this.bar_mode="normal",this.dev={debug:!1},this.performanceUpdateStart=void 0,this.performanceRenderStart=void 0,this.isAndroid=!!window.navigator.userAgent.match(/Android/),!this.isAndroid){const t=window.navigator.userAgent||"",e=t.toLowerCase(),i=window.navigator.platform||"",s=(/iPad|iPhone|iPod/.test(t)||"MacIntel"===i&&window.navigator.maxTouchPoints>1)&&!window.MSStream,a=t.match(/Version\/(\d+)(?:\.[\d.]+)?.*Safari/i),r=a?Number(a[1]):void 0,o=e.match(/\bos\s+(\d+)(?:[._]\d+)*.*like safari/),n=e.match(/\bios\s+(\d+)(?:[._]\d+)*/),h=n?Number(n[1]):o?Number(o[1]):void 0,l=Number.isFinite(r),c=Number.isFinite(h)&&e.includes("like safari"),d=l?r:c?h:void 0;this.iOS=s,this.isSafari=Number.isFinite(d),this.safariMajorVersion=d,this.isHomeAssistantLikeSafari=c,this.isRealSafari=l,this.isSafari14=this.isSafari&&14===d,this.isSafari15=this.isSafari&&15===d,this.isSafari16=this.isSafari&&16===d,this.isSafari17=this.isSafari&&17===d,this.isSafari18=this.isSafari&&18===d,this.isSafari26=this.isSafari&&26===d,this.isSafari27=this.isSafari&&27===d,this.isSafari28=this.isSafari&&28===d,this.isSafari29=this.isSafari&&29===d,this.isSafari30=this.isSafari&&30===d,this.isSafariGte16=this.isSafari&&d>=16,this.dev?.debug&&console.log("browser detection",{ua:t,isAndroid:this.isAndroid,isIOS:this.iOS,isSafari:this.isSafari,isRealSafari:this.isRealSafari,isHomeAssistantLikeSafari:this.isHomeAssistantLikeSafari,safariMajorVersion:this.safariMajorVersion,isSafariGte16:this.isSafariGte16}),this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config,!1)}}static get styles(){return r`
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

      :host([embedded]) {
        display: block;
        width: 100%;
        height: 100%;
      }

      :host([embedded]) ha-card {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
      }

      :host([embedded]) .container {
        width: 100%;
        height: 100%;
      }

      :host([embedded]) .container > svg {
        width: 100%;
        height: 100%;
      }

      .container {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .fhs-child-card-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .sparkline-tooltip-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .sparkline-tooltip {
        position: absolute;
        z-index: 5;
        pointer-events: none;
        display: inline-block;
        width: auto;
        max-width: calc(100% - 24px);
        padding: 0.2em 0.3em;
        border-radius: 0.3em;
        background: var(--card-background-color, var(--ha-card-background, rgba(32, 32, 32, 0.94)));
        color: var(--primary-text-color);
        box-shadow: 0 0.35em 0.9em rgba(0, 0, 0, 0.22);
        border: 1px solid var(--divider-color);
        font-size: var(--sparkline-tooltip-font-size, 0.5em);
        -webkit-text-size-adjust: 100%;
        text-size-adjust: 100%;
        line-height: 1.15;
        transform: translate(-50%, -100%);
      }

      .sparkline-tooltip__title {
        font-weight: 600;
        margin-bottom: 0.22em;
        white-space: nowrap;
      }

      .sparkline-tooltip__row {
        display: grid;
        grid-template-columns: auto auto;
        gap: 0.6em;
        align-items: baseline;
        white-space: nowrap;
      }

      .sparkline-tooltip__row + .sparkline-tooltip__row {
        margin-top: 0.08em;
      }

      .fhs-child-card {
        position: absolute;
        pointer-events: auto;
      }

      .fhs-child-card > * {
        display: block;
        width: 100%;
        height: 100%;
      }

      .fhs-child-card--frameless {
        background: transparent;
        border: 0;
        box-shadow: none;
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
    `}_resolveEntityConfigs(t,e){return t?.dev?.debug&&console.log("resolving entity config for",t?.entities),t?.entities?.map(((t,i)=>{const s={entity_index:i};return e&&yt.hasJavascriptTemplates(t)?yt.getJsTemplateOrValue(s,t):t}))??[]}_buildSparklineEntityConfigs(){const t=[];return this.sparklineGraphTools.forEach((e=>{const i=e.entity_index,s=this.resolvedEntityConfigs[i],a=e.config.id;["min","avg","max","min_time","max_time"].forEach((e=>{const r={...s,entity:`fhs_sparkline.${a}_${e}`,local:!0,source_entity_index:i,sparkline_id:a,sparkline_stat:e};delete r.name,"min_time"!==e&&"max_time"!==e||(r.format="datetime-short",r.unit=""),t.push(r)}))})),t}_updateSparklineEntities(){const t=this.config.entities?.length??0;this.sparklineGraphTools.forEach(((e,i)=>{const s=this.entities[e.entity_index],a=e.config.id;["min","avg","max","min_time","max_time"].forEach(((r,o)=>{const n=t+5*i+o,h=e.stats[r],l={min:"min",avg:"mean",max:"max",min_time:"min",max_time:"max"}[r],c=this.resolvedEntityConfigs[e.entity_index],d=void 0!==c.decimals?Number(c.decimals):Number(String(s.state).includes(".")?String(s.state).split(".")[1].length:0),u="avg"===r&&Number.isFinite(Number(h))?Number(h).toFixed(d):String(h),p=Sa.mergeDeep(s,{entity_id:`fhs_sparkline.${a}_${r}`,state:u,label:l,attributes:{...s.attributes,source_entity_id:"min_time"===r||"max_time"===r?void 0:s.entity_id,unit_of_measurement:"min_time"===r||"max_time"===r?void 0:s.attributes.unit_of_measurement,sparkline_id:a,sparkline_stat:r}});this.entities[n]=p}))}))}_updateToolsUsingSparklineEntities(){this.evaluateJavascriptTemplates=!0,this.horseshoeGauges=this.horseshoeGauges.map((t=>this._setToolEntityState(t))),this.nameTools=(this.nameTools??[]).map((t=>this._setToolEntityState(t))),this.areaTools=(this.areaTools??[]).map((t=>this._setToolEntityState(t))),this.stateTools=(this.stateTools??[]).map((t=>this._setToolEntityState(t))),this.rectangleTools=(this.rectangleTools??[]).map((t=>this._setToolEntityState(t))),this.lineTools=(this.lineTools??[]).map((t=>this._setToolEntityState(t))),this.circleTools=(this.circleTools??[]).map((t=>this._setToolEntityState(t))),this.arcTools=(this.arcTools??[]).map((t=>this._setToolEntityState(t))),this.iconTools=(this.iconTools??[]).map((t=>this._setToolEntityState(t))),this.evaluateJavascriptTemplates=!1}_setToolEntityState(t){const e=t.entity_index;if(null==e)return t.setState(void 0,void 0),t;const i=this.resolvedEntityConfigs[e],s=this.entities[e];return s&&i?(t.setState(s,i),t):t}themeIsDarkMode(){return!0===this.theme.darkMode}themeIsLightMode(){return!1===this.theme.darkMode}getActiveColorStopMode(){const t=this._hass?.themes?.darkMode;return void 0!==t?!0===t?"dark":"light":this.themeIsDarkMode()?"dark":"light"}set hass(t){this.setHass(t)}async _updateGradientsAfterRender(){await this.updateComplete,await new Promise(requestAnimationFrame),this.requestUpdate()}setHass(t,e=!1){const i=!0===this.dev.performance,s=i?performance.now():void 0;this._hass=t,this.hassConnection!==t.connection&&(this.hassConnection&&this.isConnected&&this.hassConnection.removeEventListener("ready",this.hassConnectionReadyHandler),this.hassConnection=t.connection,this.isConnected&&this.hassConnection.addEventListener("ready",this.hassConnectionReadyHandler)),this.childCards.setHass(t);const a=i?performance.now():void 0;let r=!this.entityConfigsInitialized;const o=this.config.entities.length;this.resolvedEntityConfigs.slice(0,o).forEach(((e,i)=>{const s=t.states[e.entity];s&&(this.entities[i]!==s&&(r=!0),this.entities[i]=s)})),yt.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),r?(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config,!0),this.entityConfigsInitialized=!0):this.resolvedEntityConfigs=this.resolvedEntityConfigs.slice(0,o),this.resolvedEntityConfigs.forEach(((e,i)=>{const s=t.states[e.entity];s&&(this.entities[i]=s)})),yt.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),i&&performance.measure(`FHS:${this.cardId}:entities`,{start:a,end:performance.now()});const n=i?performance.now():void 0;if(this.changedGroupIds.clear(),r&&this.groupsHaveJavascript){const t={...this.activeGroupConfigs},e=new Set;Object.entries(this.sourceGroupConfigs).forEach((([i,s])=>{if(!yt.hasJavascriptTemplates(s))return;const a=yt.getJsTemplateOrValue(s,s,{resolveKeys:!0}),r=JSON.stringify(a);t[i]=a,r!==this.activeGroupSignatures[i]&&(this.activeGroupSignatures[i]=r,e.add(i))})),e.size>0&&(this.activeGroupConfigs=t,this.groupManager=new kn(this.activeGroupConfigs),Object.keys(this.groupManager.groups).forEach((t=>{let i=t;for(;i;){if(e.has(i)){this.changedGroupIds.add(t);break}const s=this.groupManager.groups[i];i="card"===i?void 0:s.parent??"card"}})))}i&&performance.measure(`FHS:${this.cardId}:groups`,{start:n,end:performance.now()});const h=i?performance.now():void 0;r&&this.cardStylesHaveJavascript&&(this.activeCardStyles=yt.getJsTemplateOrValue({entity_index:0},this.sourceCardStyles)),i&&performance.measure(`FHS:${this.cardId}:card-styles`,{start:h,end:performance.now()}),this.resolvedEntityConfigs=[...this.resolvedEntityConfigs,...this._buildSparklineEntityConfigs()];let l=e||r||this._getRenderableTools().some((t=>t.requiresHassUpdate()));const c=t.selectedTheme||t.themes.theme||"",d=!0===t.themes.darkMode;if(this.theme.nameChanged=this.theme.name!==c,this.theme.modeChanged=this.theme.darkMode!==d,this.theme.nameChanged||this.theme.modeChanged){this.theme.name=c,this.theme.darkMode=d,va.colorCache={};const t=this.getActiveColorStopMode();Nn.applyAll(this,this.palettes,t),this.horseshoeGauges?.forEach((t=>t.clearPathItemCache())),this._updateGradientsAfterRender(),l=!0}if(this.resolvedEntityConfigs.forEach(((e,i)=>{const s=t.states[e.entity];if(!s)return;this.entities[i]=s;const a=Fo.buildState(s.state,e,this._hass,s);if(oa(s),a!==this.entitiesStr[i]&&(this.entitiesStr[i]=a,l=!0),e.attribute&&Object.prototype.hasOwnProperty.call(s.attributes,e.attribute)){const t=Fo.buildState(s.attributes[e.attribute],e,this._hass,s);t!==this.attributesStr[i]&&(this.attributesStr[i]=t,l=!0)}})),!l)return void(i&&performance.measure(`FHS:${this.cardId}:setHass`,{start:s,end:performance.now()}));this.evaluateJavascriptTemplates=r;const u=i?performance.now():void 0;this.sparklineGraphTools=(this.sparklineGraphTools??[]).map((t=>this._setToolEntityState(t))),this._updateSparklineEntities(),this.horseshoeGauges=this.horseshoeGauges.map((t=>this._setToolEntityState(t))),this.nameTools=(this.nameTools??[]).map((t=>this._setToolEntityState(t))),this.areaTools=(this.areaTools??[]).map((t=>this._setToolEntityState(t))),this.stateTools=(this.stateTools??[]).map((t=>this._setToolEntityState(t))),this.rectangleTools=(this.rectangleTools??[]).map((t=>this._setToolEntityState(t))),this.lineTools=(this.lineTools??[]).map((t=>this._setToolEntityState(t))),this.circleTools=(this.circleTools??[]).map((t=>this._setToolEntityState(t))),this.arcTools=(this.arcTools??[]).map((t=>this._setToolEntityState(t))),this.iconTools=(this.iconTools??[]).map((t=>this._setToolEntityState(t))),i&&performance.measure(`FHS:${this.cardId}:tools`,{start:u,end:performance.now()});const p=i?performance.now():void 0;r&&this.config.animations&&Object.keys(this.config.animations).forEach((t=>{const e=t.substr(Number(t.indexOf(".")+1));this.config.animations[t].forEach((t=>{const i={...t,entity_index:e},s=yt.hasJavascriptTemplates(t)?yt.getJsTemplateOrValue(i,t):t;this.entities[e].state.toLowerCase()===s.state.toLowerCase()&&(["lines","vlines","hlines","circles","arcs","rectangles","names","areas","states"].forEach((t=>{s[t]&&s[t].forEach((e=>this._updateAnimationStyles(t,e)))})),s.icons&&s.icons.forEach((t=>{const e=t.animation_id;this.animations.icons[e]&&t.reuse||(this.animations.icons[e]={},this.animations.iconsIcon[e]={}),this.animations.icons[e]={...this.animations.icons[e],...ft.toStyleDict(t.styles)},this.animations.iconsIcon[e]=t.icon})))}))})),i&&performance.measure(`FHS:${this.cardId}:animations`,{start:p,end:performance.now()}),this.evaluateJavascriptTemplates=!1,this.changedGroupIds.clear(),yt.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),this.theme.modeChanged=!1,i&&void 0===this.performanceUpdateStart&&(this.performanceUpdateStart=s),this.requestUpdate(),i&&performance.measure(`FHS:${this.cardId}:setHass`,{start:s,end:performance.now()})}_updateAnimationStyles(t,e){const i=e.animation_id;if(null==i)return;const s=ft.toStyleDict(e.styles);this.animations[t][i]={...e.reuse?this.animations[t][i]??{}:{},...s}}_calculateSvgCoordinatesInGroup(t){return this.groupManager.calculateSvgCoordinatesInGroup(t)}_computeSvgDimensions(t){const e=t.layout;e?.icons&&e.icons.forEach((t=>{t.svg=this._calculateSvgCoordinatesInGroup(t)})),this?.horseshoes&&this.horseshoes.forEach((t=>{t.svg=this._calculateSvgCoordinatesInGroup(t),t.svg.radius=ka.calculateSvgDimension(t.radius),t.svg.tickmarksRadius=ka.calculateSvgDimension(t.tickmarks_radius),t.svg.rotateX=t.svg.xpos,t.svg.rotateY=t.svg.ypos}))}_isCalcExpression(t){return"string"==typeof t&&t.startsWith("calc(")&&t.endsWith(")")}_calculateStaticCalc(t,e={}){const i=t.slice(5,-1).trim();if(!/^[0-9+\-*/().,\sA-Za-z_]+$/.test(i))throw new Error(`Invalid static calc expression '${t}'`);const s={...e,sin:Math.sin,cos:Math.cos,tan:Math.tan,abs:Math.abs,round:Math.round,floor:Math.floor,ceil:Math.ceil,min:Math.min,max:Math.max,sqrt:Math.sqrt,PI:Math.PI},a=Function(...Object.keys(s),`"use strict"; return (${i});`)(...Object.values(s));if(!this._isStaticNumber(a))throw new Error(`Static calc expression '${t}' did not return a finite number`);return a}_isStaticNumber(t){return"number"==typeof t&&Number.isFinite(t)}_assignIdItems(t){return t.map(((t,e)=>({...t,id:String(t.id??e)})))}_assignSectionIds(t){Sn.forEach((e=>{const i=t.layout?.[e];Array.isArray(i)&&(t.layout[e]=this._assignIdItems(i))})),[t.layout?.clips,t.layout?.masks].forEach((t=>{t&&Object.values(t).forEach((t=>{Mn.forEach((e=>{const i=t[e];Array.isArray(i)&&(t[e]=this._assignIdItems(i))}))}))}))}_resolveLayoutItemEntityIndexes(t,e){const i={},s=["min","avg","max","min_time","max_time"],a=e.length;e.forEach(((t,e)=>{i[t.entity]=e})),t.layout.sparklines?.forEach(((t,e)=>{s.forEach(((r,o)=>{i[`fhs_sparkline.${t.id}_${r}`]=a+e*s.length+o}))})),Sn.forEach((e=>{const s=t.layout?.[e];Array.isArray(s)&&s.forEach((t=>{void 0!==t.entity&&(t.entity_index=i[t.entity])}))}))}_isStaticRef(t){return"string"==typeof t&&t.startsWith("ref(")&&t.endsWith(")")}_cloneStaticValue(t){return t&&"object"==typeof t?Sa.mergeDeep(Array.isArray(t)?[]:{},t):t}_buildConstants(t){const e=t.constants,i={zpos:{...wa}};return e&&"object"==typeof e?(Object.entries(e).forEach((([t,s])=>{e[t]=this._calculateStaticValues(s,i),this._isStaticNumber(e[t])&&(i[t]=e[t])})),i):i}_replaceStaticRef(t,e){if(!this._isStaticRef(t))return t;const i=t.slice(4,-1).trim();if(!(i in e))throw new Error(`Static ref '${i}' not found`);const s=this._cloneStaticValue(e[i]);return s&&"object"==typeof s&&Object.defineProperty(s,An.STATIC_REF_MARKER,{value:!0}),s}_replaceStaticRefs(t,e={}){return this._isStaticRef(t)?this._replaceStaticRef(t,e):Array.isArray(t)?t.map((t=>this._replaceStaticRefs(t,e))):t&&"object"==typeof t?(Object.entries(t).forEach((([i,s])=>{t[i]=this._replaceStaticRefs(s,e)})),t):t}_calculateStaticValues(t,e={}){if(this._isCalcExpression(t))return this._calculateStaticCalc(t,e);if(Array.isArray(t)){const i=t.map((t=>this._calculateStaticValues(t,e)));return t[An.STATIC_REF_MARKER]&&Object.defineProperty(i,An.STATIC_REF_MARKER,{value:!0}),i}return t&&"object"==typeof t?(Object.entries(t).forEach((([i,s])=>{t[i]=this._calculateStaticValues(s,e)})),t):t}_detectJavascriptTemplates(t){let e=!1;return t.entities.forEach((t=>{yt.detectJavascriptTemplates(t)&&(e=!0)})),Sn.forEach((i=>{const s=t.layout[i];Array.isArray(s)&&s.forEach((t=>{yt.detectJavascriptTemplates(t)&&(e=!0)}))})),t.layout.groups&&Object.values(t.layout.groups).forEach((t=>{yt.detectJavascriptTemplates(t)&&(e=!0)})),t.animations&&Object.values(t.animations).forEach((t=>{t.forEach((t=>{yt.detectJavascriptTemplates(t)&&(e=!0)}))})),t.styles&&yt.detectJavascriptTemplates(t.styles)&&(e=!0),e}setConfig(t){const e=!0===t.dev?.performance,i=e?performance.now():void 0;try{!0===(t=JSON.parse(JSON.stringify(t))).embedded?this.setAttribute("embedded",""):this.removeAttribute("embedded"),Tn.compile(t,this),this.dev={...t.dev};const s=Array.isArray(t.cards);if(!s&&!t.entities)throw Error("No entities defined");if(!s&&!t.layout)throw Error("No layout defined");s&&!t.layout&&(t.layout={}),s&&!t.entities&&(t.entities=[]),t?.palettes&&(this.palettesLoaded=!1,Nn.loadAll(t?.palettes).then((t=>{this.palettes=t;const e=this.getActiveColorStopMode();va.setElement(this),Nn.applyAll(this,t,e),va.colorCache={},this.palettesLoaded=!0,this.horseshoeGauges?.forEach((t=>t.clearPathItemCache())),this._hass&&this.setHass(this._hass,!0),this.requestUpdate()}))),this._assignSectionIds(t);const a=this._buildConstants(t);this._replaceStaticRefs(t,t.constants),this._calculateStaticValues(t,a),An.compile(t),this.hasJavascriptTemplates=this._detectJavascriptTemplates(t),yt.setContext({hass:this._hass,config:t,entities:this.entities,horseshoes:this.horseshoes});const r=this._resolveEntityConfigs(t,!1);if(r.length>0){if("sensor"!==bt(r[0].entity)&&r[0].attribute&&!isNaN(r[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}r.forEach((t=>{t.tap_action||(t.tap_action={...Rn})})),this._resolveLayoutItemEntityIndexes(t,r);const o={texts:[],card_filter:"card--filter-none",bar_mode:t.bar_mode||"normal",...t,show:{...Dn,...t.show}};this.config=o,this.sourceCardStyles=this.config.styles,this.activeCardStyles=this.sourceCardStyles,this.cardStylesHaveJavascript=yt.hasJavascriptTemplates(this.sourceCardStyles),this.config.layout.groups??={},this.sourceGroupConfigs=this.config.layout.groups,this.activeGroupConfigs=this.sourceGroupConfigs,this.activeGroupSignatures={},this.groupsHaveJavascript=Object.values(this.sourceGroupConfigs).some((t=>yt.hasJavascriptTemplates(t))),this.changedGroupIds.clear(),this.entityConfigsInitialized=!1,this.config.layout.gradients??={},this.config.layout.clips??={},this.config.layout.masks??={},this.groupManager=new kn(this.activeGroupConfigs),this.masksClips=new In(this.config,this.cardId,this),this.horseshoeGauges=Jr.setConfig(t,yt,this.cardId,this),this.bar_mode=o.bar_mode||"normal",this.aspectratio=(this.config.layout.aspectratio||this.config.aspectratio||"1/1").trim();const n=this.aspectratio.split("/");this.viewBox||(this.viewBox={}),this.viewBox.width=n[0]*ba,this.viewBox.height=n[1]*ba,this._computeSvgDimensions(this.config),this.nameTools=co.setConfig(this.config,yt,this.cardId,this),this.areaTools=uo.setConfig(this.config,yt,this.cardId,this),this.stateTools=Fo.setConfig(this.config,yt,this.cardId,this),this.rectangleTools=Zr.setConfig(this.config,yt,this.cardId,this),this.lineTools=Kr.setConfig(this.config,yt,this.cardId,this),this.circleTools=Qr.setConfig(this.config,yt,this.cardId,this),this.arcTools=to.setConfig(this.config,yt,this.cardId,this),this.iconTools=gn.setConfig(this.config,yt,this.cardId,this),this.sparklineGraphTools=xn.setConfig(this.config,yt,this.cardId,this),this.childCards.setConfig(this.config.cards??[]),yt.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),e&&performance.measure(`FHS:${this.cardId}:setConfig`,{start:i,end:performance.now()})}catch(s){throw console.error("[FHC setConfig] CONFIG ERROR",{error:s,message:s?.message,stack:s?.stack,rawConfig:t,horseshoes:this.horseshoes}),s}}_getItemStateValue(t={}){const e=t.entity_index;if(null==e)return;const i=this.entities?.[e],s=this.config?.entities?.[e];if(!i)return;const a=s?.attribute;return a&&i.attributes&&void 0!==i.attributes[a]?i.attributes[a]:i.state}_getItemColorFromStops(t={}){if(!t.colorstops)return;const e=this._getItemStateValue(t),i=Number(e);return Number.isFinite(i)?va.calculateStrokeColor(i,t.colorstops,!0===t.colorstop_gradient):void 0}getToolsBySection(t){return{rectangles:this.rectangleTools,circles:this.circleTools,arcs:this.arcTools,horseshoes:this.horseshoeGauges,lines:this.lineTools,icons:this.iconTools,areas:this.areaTools,names:this.nameTools,states:this.stateTools,sparklines:this.sparklineGraphTools}[t]}getItemWidth(t){if("number"==typeof t)return t;return this.getToolsBySection(t.section).find((e=>e.id===t.item_id)).getWidth()+2*t.padding}getItemHeight(t){if("number"==typeof t)return t;return this.getToolsBySection(t.section).find((e=>e.id===t.item_id)).getHeight()+2*t.padding}getItemGeometry(t){const e=this.getToolsBySection(t.section).find((e=>e.id===t.item_id));return{xpos:e.getXpos(),ypos:e.getYpos(),width:e.getWidth(),height:e.getHeight()}}connectedCallback(){super.connectedCallback(),this.hassConnection&&this.hassConnection.addEventListener("ready",this.hassConnectionReadyHandler),this._getRenderableTools().forEach((t=>t.connected()))}disconnectedCallback(){this.hassConnection&&this.hassConnection.removeEventListener("ready",this.hassConnectionReadyHandler),this._getRenderableTools().forEach((t=>t.disconnected())),super.disconnectedCallback()}render(){const t=!0===this.dev.performance,e=t?performance.now():void 0;t&&(this.performanceRenderStart=e);const i=ft.toStyleDict(this.activeCardStyles),s=O`
      <ha-card @click=${t=>this.handleCardClick(t)} style=${mt(i)}>
        <div class="container" id="container">${this._renderSvg()} ${this._renderSparklineTooltips()} ${this.childCards.render()}</div>
      </ha-card>
    `;return t&&performance.measure(`FHS:${this.cardId}:render`,{start:e,end:performance.now()}),s}_renderSvgDefs(){return H`
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

        ${this.masksClips.renderDefs()}
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
      `}_getRenderableTools(){return[...this.rectangleTools??[],...this.circleTools??[],...this.arcTools??[],...this.horseshoeGauges??[],...this.lineTools??[],...this.iconTools??[],...this.areaTools??[],...this.nameTools??[],...this.stateTools??[],...this.sparklineGraphTools??[]]}_getToolSortNumber(t,e=0){const i=Number(t);return Number.isFinite(i)?i:e}_sortRenderableTools(t,e){const i=this._getToolSortNumber(t.zpos)-this._getToolSortNumber(e.zpos);return 0!==i?i:this._getToolSortNumber(t.renderIndex)-this._getToolSortNumber(e.renderIndex)}_renderLayoutTools(){return H`
      ${this._getRenderableTools().sort(((t,e)=>this._sortRenderableTools(t,e))).map((t=>t.render()))}
    `}_renderSparklineTooltips(){return O` <div class="sparkline-tooltip-layer">${this.sparklineGraphTools?.map((t=>t.renderTooltip()))}</div> `}_getGroupScaleTransform(t){return this.groupManager.getGroupScaleTransform(t)}_getGroupScaleStyle(t){return this.groupManager.getGroupScaleStyle(t)}firstUpdated(t){super.firstUpdated?.(t),this.sparklineGraphTools?.forEach((t=>t.attachPointerHandlers()))}updated(t){const e=!0===this.dev.performance,i=e?performance.now():void 0;if(super.updated?.(t),this._getRenderableTools().forEach((e=>e.updated(t))),this.sparklineGraphTools?.forEach((t=>t.attachPointerHandlers())),e){const t=performance.now();performance.measure(`FHS:${this.cardId}:updated`,{start:i,end:t}),void 0!==this.performanceRenderStart&&(performance.measure(`FHS:${this.cardId}:lit-update`,{start:this.performanceRenderStart,end:t}),this.performanceRenderStart=void 0),void 0!==this.performanceUpdateStart&&(performance.measure(`FHS:${this.cardId}:update-cycle`,{start:this.performanceUpdateStart,end:t}),this.performanceUpdateStart=void 0),this.isUpdatePending&&(this.performanceUpdateStart=t)}}_handleClick(t,e,i,s,a){let r;switch(s.action){case"more-info":r=new Event("hass-more-info",{composed:!0}),r.detail={entityId:a},t.dispatchEvent(r);break;case"navigate":if(!s.navigation_path)return;window.history.pushState(null,"",s.navigation_path),r=new Event("location-changed",{composed:!0}),r.detail={replace:!1},window.dispatchEvent(r);break;case"call-service":{if(!s.service)return;const[t,i]=s.service.split(".",2),a={...s.service_data};e.callService(t,i,a);break}case"fire-dom-event":r=new Event("ll-custom",{composed:!0,bubbles:!0}),r.detail=s,t.dispatchEvent(r)}}handleCardClick(t){!t.composedPath().some((t=>t.classList?.contains("fhs-child-card")))&&this.entities[0]&&this.handlePopup(t,this.entities[0])}handlePopup(t,e){t.stopPropagation();const i=this.resolvedEntityConfigs.find((t=>t.entity===e.entity_id)),s=i?.tap_action??this.config?.tap_action??{action:"more-info"},a=e.entity_id.startsWith("fhs_")?this.entities[i.source_entity_index].entity_id:e.entity_id;this._handleClick(this,this._hass,this.config,s,a)}_computeEntity(t){return t.substr(t.indexOf(".")+1)}getCardSize(){return 4}}customElements.get("flex-horseshoe-card")||customElements.define("flex-horseshoe-card",Pn);

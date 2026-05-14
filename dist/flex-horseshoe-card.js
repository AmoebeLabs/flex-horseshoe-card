/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let i=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o.set(s,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,s,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1]),t[0]);return new i(o,t,s)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new i("string"==typeof t?t:t+"",void 0,s))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:a,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:c,getOwnPropertySymbols:d,getPrototypeOf:u}=Object,p=globalThis,m=p.trustedTypes,f=m?m.emptyScript:"",_=p.reactiveElementPolyfillSupport,g=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},$=(t,e)=>!a(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),o=this.getPropertyDescriptor(t,s,e);void 0!==o&&l(this.prototype,t,o)}}static getPropertyDescriptor(t,e,s){const{get:o,set:i}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const r=o?.call(this);i?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...c(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const t=this._$Eu(e,s);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,o)=>{if(e)s.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of o){const o=document.createElement("style"),i=t.litNonce;void 0!==i&&o.setAttribute("nonce",i),o.textContent=e.cssText,s.appendChild(o)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(void 0!==o&&!0===s.reflect){const i=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==i?this.removeAttribute(o):this.setAttribute(o,i),this._$Em=null}}_$AK(t,e){const s=this.constructor,o=s._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=s.getPropertyOptions(o),i="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=o;const r=i.fromAttribute(e,t.type);this[o]=r??this._$Ej?.get(o)??r,this._$Em=null}}requestUpdate(t,e,s,o=!1,i){if(void 0!==t){const r=this.constructor;if(!1===o&&(i=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??$)(i,e)||s.useDefault&&s.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:o,wrapped:i},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==i||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,s,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[g("elementProperties")]=new Map,v[g("finalized")]=new Map,_?.({ReactiveElement:v}),(p.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,w=x.trustedTypes,S=w?w.createPolicy("flex-horseshoe-card-lit-html",{createHTML:t=>t}):void 0,A="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+k,E=`<${C}>`,O=document,P=()=>O.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,N="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,V=/>/g,D=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,j=/"/g,R=/^(?:script|style|textarea|title)$/i,J=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),U=J(1),L=J(2),F=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),q=new WeakMap,K=O.createTreeWalker(O,129);function W(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const X=(t,e)=>{const s=t.length-1,o=[];let i,r=2===e?"<svg>":3===e?"<math>":"",n=z;for(let a=0;a<s;a++){const e=t[a];let s,l,h=-1,c=0;for(;c<e.length&&(n.lastIndex=c,l=n.exec(e),null!==l);)c=n.lastIndex,n===z?"!--"===l[1]?n=I:void 0!==l[1]?n=V:void 0!==l[2]?(R.test(l[2])&&(i=RegExp("</"+l[2],"g")),n=D):void 0!==l[3]&&(n=D):n===D?">"===l[0]?(n=i??z,h=-1):void 0===l[1]?h=-2:(h=n.lastIndex-l[2].length,s=l[1],n=void 0===l[3]?D:'"'===l[3]?j:H):n===j||n===H?n=D:n===I||n===V?n=z:(n=D,i=void 0);const d=n===D&&t[a+1].startsWith("/>")?" ":"";r+=n===z?e+E:h>=0?(o.push(s),e.slice(0,h)+A+e.slice(h)+k+d):e+k+(-2===h?a:d)}return[W(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class G{constructor({strings:t,_$litType$:e},s){let o;this.parts=[];let i=0,r=0;const n=t.length-1,a=this.parts,[l,h]=X(t,e);if(this.el=G.createElement(l,s),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=K.nextNode())&&a.length<n;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(A)){const e=h[r++],s=o.getAttribute(t).split(k),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:i,name:n[2],strings:s,ctor:"."===n[1]?et:"?"===n[1]?st:"@"===n[1]?ot:tt}),o.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:i}),o.removeAttribute(t));if(R.test(o.tagName)){const t=o.textContent.split(k),e=t.length-1;if(e>0){o.textContent=w?w.emptyScript:"";for(let s=0;s<e;s++)o.append(t[s],P()),K.nextNode(),a.push({type:2,index:++i});o.append(t[e],P())}}}else if(8===o.nodeType)if(o.data===C)a.push({type:2,index:i});else{let t=-1;for(;-1!==(t=o.data.indexOf(k,t+1));)a.push({type:7,index:i}),t+=k.length-1}i++}}static createElement(t,e){const s=O.createElement("template");return s.innerHTML=t,s}}function Y(t,e,s=t,o){if(e===F)return e;let i=void 0!==o?s._$Co?.[o]:s._$Cl;const r=T(e)?void 0:e._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),void 0===r?i=void 0:(i=new r(t),i._$AT(t,s,o)),void 0!==o?(s._$Co??=[])[o]=i:s._$Cl=i),void 0!==i&&(e=Y(t,i._$AS(t,e.values),i,o)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,o=(t?.creationScope??O).importNode(e,!0);K.currentNode=o;let i=K.nextNode(),r=0,n=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(i,i.nextSibling,this,t):1===a.type?e=new a.ctor(i,a.name,a.strings,this,t):6===a.type&&(e=new it(i,this,t)),this._$AV.push(e),a=s[++n]}r!==a?.index&&(i=K.nextNode(),r++)}return K.currentNode=O,o}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,o){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),T(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,o="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=G.createElement(W(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new Z(o,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new G(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,o=0;for(const i of t)o===e.length?e.push(s=new Q(this.O(P()),this.O(P()),this,this.options)):s=e[o],s._$AI(i),o++;o<e.length&&(this._$AR(s&&s._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,o,i){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=i,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=B}_$AI(t,e=this,s,o){const i=this.strings;let r=!1;if(void 0===i)t=Y(this,t,e,0),r=!T(t)||t!==this._$AH&&t!==F,r&&(this._$AH=t);else{const o=t;let n,a;for(t=i[0],n=0;n<i.length-1;n++)a=Y(this,o[s+n],e,n),a===F&&(a=this._$AH[n]),r||=!T(a)||a!==this._$AH[n],a===B?t=B:t!==B&&(t+=(a??"")+i[n+1]),this._$AH[n]=a}r&&!o&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class st extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class ot extends tt{constructor(t,e,s,o,i){super(t,e,s,o,i),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??B)===F)return;const s=this._$AH,o=t===B&&s!==B||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,i=t!==B&&(s===B||o);o&&this.element.removeEventListener(this.name,this,s),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const rt=x.litHtmlPolyfillSupport;rt?.(G,Q),(x.litHtmlVersions??=[]).push("3.3.2");const nt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let at=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const o=s?.renderBefore??e;let i=o._$litPart$;if(void 0===i){const t=s?.renderBefore??null;o._$litPart$=i=new Q(e.insertBefore(P(),t),t,void 0,s??{})}return i._$AI(t),i})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}};at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const lt=nt.litElementPolyfillSupport;lt?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ht=1;let ct=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dt="important",ut=" !"+dt,pt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends ct{constructor(t){if(super(t),t.type!==ht||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,s)=>{const o=t[s];return null==o?e:e+`${s=s.includes("-")?s:s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`}),"")}update(t,[e]){const{style:s}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const o of this.ft)null==e[o]&&(this.ft.delete(o),o.includes("-")?s.removeProperty(o):s[o]=null);for(const o in e){const t=e[o];if(null!=t){this.ft.add(o);const e="string"==typeof t&&t.endsWith(ut);o.includes("-")||e?s.setProperty(o,e?t.slice(0,-11):t,e?dt:""):s[o]=t}}return F}});class mt{static toStyleDict(t){return mt.toDict(t,{stringToDict:mt.cssStringToDict,mapValue:mt.toStyleValue})}static toClassDict(t){return mt.toDict(t,{stringToDict:mt.classStringToDict,mapValue:Boolean})}static toIconDict(t){return mt.toDict(t,{stringToDict:mt.stringToDefaultDict("default"),mapValue:String})}static toDict(t,e={}){const{stringToDict:s=mt.stringToDefaultDict("default"),mapValue:o=(t=>t),skipNull:i=!0,skipFalse:r=!0}=e,n=t=>null==t&&i||!1===t&&r?{}:Array.isArray(t)?t.reduce(((t,e)=>({...t,...n(e)})),{}):mt.isPlainObject(t)?Object.fromEntries(Object.entries(t).filter((([,t])=>(null!=t||!i)&&(!1!==t||!r))).map((([t,e])=>[t,o(e,t)]))):"string"==typeof t?s(t):{};return n(t)}static toStyleValue(t){return null==t?t:String(t).trim().replace(/;+$/,"")}static cssStringToDict(t){return String(t).split(";").map((t=>t.trim())).filter(Boolean).reduce(((t,e)=>{const s=e.indexOf(":");if(s<=0)return t;const o=e.slice(0,s).trim(),i=e.slice(s+1).trim();return o&&i?{...t,[o]:i}:t}),{})}static toColorStopDict(t){return mt.toDict(t,{stringToDict:mt.keyValueStringToDict,mapValue:String})}static keyValueStringToDict(t){const e=String(t).trim(),s=e.indexOf(":");if(s<=0)return{};const o=e.slice(0,s).trim(),i=e.slice(s+1).trim();return o&&i?{[o]:i}:{}}static classStringToDict(t){return String(t).trim().split(/\s+/).filter(Boolean).reduce(((t,e)=>({...t,[e]:!0})),{})}static stringToDefaultDict(t="default"){return e=>({[t]:String(e)})}static requireArray(t,e="value"){if(null==t)return[];if(!Array.isArray(t))throw new Error(`[config-helper] "${e}" must be an array.`);return t}static ensureArray(t){return null==t?[]:Array.isArray(t)?t:[t]}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}}class ft{static context={};static setContext(t={}){ft.context=t}static getJsTemplateOrValue(t,e,s={}){const{resolveKeys:o=!0}=s;if(null==e)return e;if(["number","boolean","bigint","symbol"].includes(typeof e))return e;if(Array.isArray(e))return e.map((e=>ft.getJsTemplateOrValue(t,e,s)));if(ft.isPlainObject(e))return Object.fromEntries(Object.entries(e).map((([e,i])=>{const r=o?ft.getJsTemplateOrValue(t,e,s):e,n=ft.getJsTemplateOrValue(t,i,s);return[String(r),n]})));if("string"!=typeof e)return e;const i=e.trim();if(ft.isJsTemplate(i)){const e=ft.evaluateJsTemplate(t,ft.extractJsTemplateCode(i));return ft.getJsTemplateOrValue(t,e,s)}return e}static getJsTemplateOrValueV1(t,e){if(null==e)return e;if(["number","boolean","bigint","symbol"].includes(typeof e))return e;if(Array.isArray(e))return e.map((e=>ft.getJsTemplateOrValue(t,e)));if(ft.isPlainObject(e))return Object.fromEntries(Object.entries(e).map((([e,s])=>[e,ft.getJsTemplateOrValue(t,s)])));if("string"!=typeof e)return e;const s=e.trim();if(ft.isJsTemplate(s)){const e=ft.extractJsTemplateCode(s),o=ft.evaluateJsTemplate(t,e);return ft.getJsTemplateOrValue(t,o)}return e}static isJsTemplate(t){return"string"==typeof t&&t.trim().startsWith("[[[")&&t.trim().endsWith("]]]")}static extractJsTemplateCode(t){return String(t).trim().slice(3,-3).trim()}static evaluateJsTemplate(t,e){const{hass:s,config:o,entities:i=[]}=ft.context,r=ft._getItemEntityIndex(t),n=ft._getTemplateState(t),a=i?.[r],l=s?.states,h=s?.user;console.log("Evaluating JavaScript template with context:",{hass:s,config:o,entity:a,entities:i,states:l,state:n,item:t,user:h});try{return new Function("hass","config","entity","entities","states","state","item","user",`\n          "use strict";\n          ${e}\n        `)(s,o,a,i,l,n,t,h)}catch(c){return void(o?.dev?.debug&&console.error("[templates] JavaScript template error:",{error:c,item:t,javascript:e}))}}static _getTemplateState(t={}){const e=ft._getItemEntityIndex(t),s=ft.context.entities?.[e],o=ft.context.config?.entities?.[e]||{};if(!s)return;const i=o.attribute;return i&&s.attributes&&void 0!==s.attributes[i]?s.attributes[i]:s.state}static _getItemEntityIndex(t={}){const e=Number(t.entity_index);return Number.isFinite(e)?e:0}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}}class _t{static normalize(t){return t?Array.isArray(t)?{scales:{},colors:_t.normalizeColors(t)}:!_t.isPlainObject(t)||t.colors||t.scales?_t.isPlainObject(t)?{scales:_t.normalizeScales(t.scales),colors:_t.normalizeColors(t.colors)}:{scales:{},colors:[]}:{scales:{},colors:_t.normalizeColors(t)}:{scales:{},colors:[]}}static normalizeScales(t){return _t.isPlainObject(t)?Object.fromEntries(Object.entries(t).map((([t,e])=>[t,_t.isPlainObject(e)?{...e}:e]))):{}}static normalizeColors(t){return t?Array.isArray(t)?t.flatMap((t=>_t.normalizeColorArrayEntry(t))).filter(Boolean).sort(((t,e)=>t.value-e.value)):_t.isPlainObject(t)?Object.entries(t).map((([t,e])=>_t.normalizeColorPair(t,e))).filter(Boolean).sort(((t,e)=>t.value-e.value)):[]:[]}static normalizeColorArrayEntry(t){if(_t.isPlainObject(t)&&Object.prototype.hasOwnProperty.call(t,"value")&&Object.prototype.hasOwnProperty.call(t,"color")){const e=_t.normalizeColorEntry(t);return e?[e]:[]}return _t.isPlainObject(t)?Object.entries(t).map((([t,e])=>_t.normalizeColorPair(t,e))).filter(Boolean):[]}static normalizeColorPair(t,e){const s=Number(t);return Number.isFinite(s)?null==e?null:{value:s,color:String(e)}:null}static normalizeColorEntry(t){if(!_t.isPlainObject(t))return null;const e=Number(t.value);return Number.isFinite(e)?void 0===t.color||null===t.color?null:{...t,value:e,color:String(t.color)}:null}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}static _testColorStopsNormalizer(){const t={entity_index:0},e=[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}];[{name:"FHC dict",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC dict with quoted keys",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC list of dicts",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC list of dicts with quoted keys",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC dict with template values",raw:{0:"[[[\n          return 'red';\n        ]]]",10:"[[[\n          return 'green';\n        ]]]",20:"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template values",raw:[{0:"[[[\n            return 'red';\n          ]]]"},{10:"[[[\n            return 'green';\n          ]]]"},{20:"[[[\n            return 'blue';\n          ]]]"}]},{name:"FHC dict with template keys",raw:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}},{name:"FHC dict with template keys and values",raw:{"[[[ return 0; ]]]":"[[[\n          return 'red';\n        ]]]","[[[ return 10; ]]]":"[[[\n          return 'green';\n        ]]]","[[[ return 20; ]]]":"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template keys and values",raw:[{"[[[ return 0; ]]]":"[[[\n            return 'red';\n          ]]]"},{"[[[ return 10; ]]]":"[[[\n            return 'green';\n          ]]]"},{"[[[ return 20; ]]]":"[[[\n            return 'blue';\n          ]]]"}]},{name:"Whole FHC color_stops as template returning dict",raw:"[[[\n        return {\n          0: 'red',\n          10: 'green',\n          20: 'blue',\n        };\n      ]]]"},{name:"Whole FHC color_stops as template returning list",raw:"[[[\n        return [\n          { 0: 'red' },\n          { 10: 'green' },\n          { 20: 'blue' },\n        ];\n      ]]]"},{name:"SAK v1 colorstops.colors dict",raw:{colors:{0:"red",10:"green",20:"blue"}}},{name:"SAK v1 colorstops.colors dict with template keys",raw:{colors:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}}},{name:"SAK v1 colorstops.colors dict with template values",raw:{colors:{0:"[[[\n            return 'red';\n          ]]]",10:"[[[\n            return 'green';\n          ]]]",20:"[[[\n            return 'blue';\n          ]]]"}}},{name:"SAK v2 colors list",raw:{scales:{default:{min:0,max:20}},colors:[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}]}},{name:"SAK v2 colors list unsorted",raw:{scales:{default:{min:0,max:20}},colors:[{value:20,color:"blue",rank:2},{value:0,color:"red",rank:1},{value:10,color:"green",rank:1}]}},{name:"SAK v2 colors list with template values",raw:{scales:{default:{min:"[[[\n              return 0;\n            ]]]",max:"[[[\n              return 20;\n            ]]]"}},colors:[{value:"[[[\n              return 0;\n            ]]]",color:"[[[\n              return 'red';\n            ]]]"},{value:"[[[\n              return 10;\n            ]]]",color:"[[[\n              return 'green';\n            ]]]"},{value:"[[[\n              return 20;\n            ]]]",color:"[[[\n              return 'blue';\n            ]]]"}]}},{name:"SAK v2 whole colors list as template",raw:{scales:{default:{min:0,max:20}},colors:"[[[\n          return [\n            { value: 0, color: 'red' },\n            { value: 10, color: 'green' },\n            { value: 20, color: 'blue' },\n          ];\n        ]]]"}}].forEach((s=>{const o=ft.getJsTemplateOrValue(t,s.raw,{resolveKeys:!0}),i=_t.normalize(o),r=i.colors.map((t=>({value:t.value,color:t.color}))),n=JSON.stringify(r)===JSON.stringify(e);console.log(`[colorstops test] ${n?"PASS":"FAIL"} - ${s.name}`,{raw:s.raw,resolved:o,normalized:i,simpleColors:r,expectedColors:e})}))}}console.info("%c FLEX-HORSESHOE-CARD %c Version 5.4.4-dev.2 ","color: white; font-weight: bold; background: darkgreen","color: darkgreen; font-weight: bold; background: white");const gt=200,yt=520/360*Math.PI*90,$t=2*Math.PI*90,bt={xpos:50,ypos:50,horseshoe_radius:90,tickmarks_radius:86},vt={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed"},xt={min:0,max:100,width:6,color:"var(--primary-background-color)"},wt={width:12,color:"var(--primary-color)"},St={action:"more-info"};class At extends at{constructor(){if(super(),this.cardId=Math.random().toString(36).substr(2,9),this._hass=void 0,this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.viewBoxSize=gt,this.colorStops={},this.animations={},this.animations.vlines={},this.animations.hlines={},this.animations.circles={},this.animations.icons={},this.animations.iconsIcon={},this.animations.names={},this.animations.areas={},this.animations.states={},this.resolvedEntityConfigs=[],this.colorCache={},this.isAndroid=!1,this.isSafari=!1,this.iOS=!1,this.iconCache={},this.iconsSvg=[],this.pendingIconPath=[],this.iconsId=[],this.bar_mode="normal",this.dev={debug:!1},this.isAndroid=!!window.navigator.userAgent.match(/Android/),!this.isAndroid){const t=window.navigator.userAgent||"",e=t.toLowerCase(),s=window.navigator.platform||"",o=(/iPad|iPhone|iPod/.test(t)||"MacIntel"===s&&window.navigator.maxTouchPoints>1)&&!window.MSStream,i=t.match(/Version\/(\d+)(?:\.[\d.]+)?.*Safari/i),r=i?Number(i[1]):void 0,n=e.match(/\bos\s+(\d+)(?:[._]\d+)*.*like safari/),a=e.match(/\bios\s+(\d+)(?:[._]\d+)*/),l=a?Number(a[1]):n?Number(n[1]):void 0,h=Number.isFinite(r),c=Number.isFinite(l)&&e.includes("like safari"),d=h?r:c?l:void 0;this.iOS=o,this.isSafari=Number.isFinite(d),this.safariMajorVersion=d,this.isHomeAssistantLikeSafari=c,this.isRealSafari=h,this.isSafari14=this.isSafari&&14===d,this.isSafari15=this.isSafari&&15===d,this.isSafari16=this.isSafari&&16===d,this.isSafari17=this.isSafari&&17===d,this.isSafari18=this.isSafari&&18===d,this.isSafari26=this.isSafari&&26===d,this.isSafari27=this.isSafari&&27===d,this.isSafari28=this.isSafari&&28===d,this.isSafari29=this.isSafari&&29===d,this.isSafari30=this.isSafari&&30===d,this.isSafariGte16=this.isSafari&&d>=16,this.dev?.debug&&console.log("browser detection",{ua:t,isAndroid:this.isAndroid,isIOS:this.iOS,isSafari:this.isSafari,isRealSafari:this.isRealSafari,isHomeAssistantLikeSafari:this.isHomeAssistantLikeSafari,safariMajorVersion:this.safariMajorVersion,isSafariGte16:this.isSafariGte16}),console.log("style test 1",mt.toStyleDict([{"font-size":"2.8em;"},{"text-anchor":"start;"},{opacity:"0.7;"}])),console.log("style test 2",mt.toStyleDict(["font-size: 2.8em;","text-anchor: start;","opacity: 0.7;"])),console.log("style test 3",mt.toStyleDict(["font-size: 2.8em","text-anchor: start","opacity: 0.7"])),console.log("style test 4",mt.toStyleDict({"font-size":"2.8em;","text-anchor":"start;",opacity:"0.7;"})),console.log("style test 5",mt.toStyleDict({"font-size":"2.8em","text-anchor":"start",opacity:.7})),console.log("style test 6",mt.toStyleDict("font-size: 2.8em; text-anchor: start; opacity: 0.7;")),console.log("style test 7",mt.toStyleDict(["[[[\n          return { 'font-size': '2.8em' };\n        ]]]","text-anchor: start;","opacity: 0.7;"]));const u=["[[[\n        return { 'font-size': '2.8em' };\n      ]]]","text-anchor: start;","opacity: 0.7;"],p={entity_index:0},m=ft.getJsTemplateOrValue(p,u),f=mt.toStyleDict(m);console.log("style test 8 - resolvedStyles",m),console.log("style test 8 - itemStyleDict",f),this.config?.dev?.debug&&_t._testColorStopsNormalizer(),this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config)}}static get styles(){return r`
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
    `}_resolveEntityConfigs(t){return t?.dev?.debug&&console.log("resolving entity config for",t?.entities),t?.entities?.map(((t,e)=>{const s={entity_index:e};return ft.getJsTemplateOrValue(s,t)}))??[]}set hass(t){this._hass=t,ft.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes});let e=!1;if(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.resolvedEntityConfigs.forEach(((s,o)=>{const i=t.states[s.entity];if(!i)return;this.entities[o]=i;const r=this._buildState(i.state,s);if(r!==this.entitiesStr[o]&&(this.entitiesStr[o]=r,e=!0),s.attribute&&Object.prototype.hasOwnProperty.call(i.attributes,s.attribute)){const t=this._buildState(i.attributes[s.attribute],s);t!==this.attributesStr[o]&&(this.attributesStr[o]=t,e=!0)}})),!e)return;this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.horseshoes=this.horseshoes.map((t=>{const e=t.entity_index??0,s=this.resolvedEntityConfigs[e],o=this.entities[e];if(!o||!s)return t;let i=o.state;s.attribute&&void 0!==o.attributes[s.attribute]&&(i=o.attributes[s.attribute]);const r=ft.getJsTemplateOrValue({entity_index:e},t.horseshoe_scale),n=r?.min??0,a=r?.max??100;let l,h,c=!1;if("bidirectional"===(t.bar_mode||"normal")){const e=t.horseshoePathLength,s=Number(i);if(s>=0){const o=Math.min(this._calculateValueBetween(0,a,s),1)*(e/2);l=`${o} ${t.circlePathLength-o}`,h=void 0,c=!1}else{const o=(1-Math.min(this._calculateValueBetween(n,0,s),1))*(e/2);l=`${o} ${t.circlePathLength-o}`,h=""+-(t.circlePathLength-o),c=!0}}else{l=`${Math.min(this._calculateValueBetween(n,a,i),1)*t.horseshoePathLength} ${10*t.radiusSize}`,h=void 0,c=!1}const d=Math.min(this._calculateValueBetween(n,a,i),1),u=t.show.horseshoe_style;let p=t.color0,m=t.color1,f=t.color1_offset,_=t.angleCoords,g=t.stroke_color;if("fixed"===u)g=t.horseshoe_state.color,p=t.horseshoe_state.color,m=t.horseshoe_state.color,f="0%";else if("autominmax"===u){const e=this._calculateStrokeColor(i,t.colorStopsMinMax,!0);p=e,m=e,f="0%"}else if("colorstop"===u||"colorstopgradient"===u){const e=this._calculateStrokeColor(i,t.colorStops,"colorstopgradient"===u);p=e,m=e,f="0%"}else"lineargradient"===u&&(_={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},f=`${Math.round(100*(1-d))}%`);return{...t,horseshoe_scale:{...t.horseshoe_scale,...r},dashArray:l,dashOffset:h,bidirectional_negative:c,stroke_color:g,color0:p,color1:m,color1_offset:f,angleCoords:_}}));const s=this.horseshoes[0];this.dashArray=s.dashArray,this.dashOffset=s.dashOffset,this._bidirectional_negative=s.bidirectional_negative,this.stroke_color=s.stroke_color,this.color0=s.color0,this.color1=s.color1,this.color1_offset=s.color1_offset,this.angleCoords=s.angleCoords,this.config.animations&&Object.keys(this.config.animations).map((t=>{const e=t.substr(Number(t.indexOf(".")+1));return this.config.animations[t].map((t=>this.entities[e].state.toLowerCase()===t.state.toLowerCase()&&(t.vlines&&t.vlines.forEach((t=>this._updateAnimationStyles("vlines",t))),t.hlines&&t.hlines.forEach((t=>this._updateAnimationStyles("hlines",t))),t.circles&&t.circles.forEach((t=>this._updateAnimationStyles("circles",t))),t.icons&&t.icons.forEach((t=>{const e=t.animation_id;this.animations.icons[e]&&t.reuse||(this.animations.icons[e]={},this.animations.iconsIcon[e]={});const s=ft.getJsTemplateOrValue(t,t.styles),o=mt.toStyleDict(s);this.animations.icons[e]={...this.animations.icons[e],...o},this.animations.iconsIcon[e]=ft.getJsTemplateOrValue(t,t.icon)})),t.states&&t.states.forEach((t=>this._updateAnimationStyles("states",t))),!0))),!0})),ft.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),this.requestUpdate()}set hassV1(t){this._hass=t,ft.setContext({hass:this._hass,config:this.config,entities:this.entities});var e,s,o,i=!1,r=0;for(e of(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.resolvedEntityConfigs)){const e=this.resolvedEntityConfigs[r],n=t.states[e.entity];n?(this.entities[r]=n,(s=this._buildState(n.state,e))!==this.entitiesStr[r]&&(this.entitiesStr[r]=s,i=!0),e.attribute&&Object.prototype.hasOwnProperty.call(n.attributes,e.attribute)&&(o=this._buildState(n.attributes[e.attribute],e))!==this.attributesStr[r]&&(this.attributesStr[r]=o,i=!0),r++):r++}if(!i)return;var n=this.entities[0].state;this.resolvedEntityConfigs[0].attribute&&this.entities[0].attributes[this.resolvedEntityConfigs[0].attribute]&&(n=this.entities[0].attributes[this.resolvedEntityConfigs[0].attribute]),this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config);const a=ft.getJsTemplateOrValue({entity_index:0},this.config.horseshoe_scale),l=a?.min??0,h=a?.max??100;if("bidirectional"===(this.config.bar_mode||"normal")){const t=yt;let e=Number(n),s=0,o=0;e>=0?(s=Math.min(this._calculateValueBetween(0,h,e),1)*(t/2),this.dashArray=`${s} ${$t-s}`,this._bidirectional_negative=!1):(o=(1-Math.min(this._calculateValueBetween(l,0,e),1))*(t/2),this.dashArray=`${o} ${$t-o}`,this.dashOffset=-(""+($t-o)),this._bidirectional_negative=!0)}else{const t=Math.min(this._calculateValueBetween(l,h,n),1)*yt,e=900;this.dashArray=`${t} ${e}`,this._bidirectional_negative=!1}const c=Math.min(this._calculateValueBetween(l,h,n),1),d=this.config.show.horseshoe_style;if("fixed"===d)this.stroke_color=this.config.horseshoe_state.color,this.color0=this.config.horseshoe_state.color,this.color1=this.config.horseshoe_state.color,this.color1_offset="0%";else if("autominmax"===d){const t=this._calculateStrokeColor(n,this.colorStopsMinMax,!0);this.color0=t,this.color1=t,this.color1_offset="0%"}else if("colorstop"===d||"colorstopgradient"===d){const t=this._calculateStrokeColor(n,this.colorStops,"colorstopgradient"===d);this.color0=t,this.color1=t,this.color1_offset="0%"}else if("lineargradient"===d){const t={x1:"0%",y1:"0%",x2:"100%",y2:"0%"};this.color1_offset=`${Math.round(100*(1-c))}%`,this.angleCoords=t}this.config.animations&&Object.keys(this.config.animations).map((t=>{const e=t.substr(Number(t.indexOf(".")+1));return this.config.animations[t].map((t=>{if(this.entities[e].state.toLowerCase()===t.state.toLowerCase())return t.vlines&&t.vlines.forEach((t=>this._updateAnimationStyles("vlines",t))),t.hlines&&t.hlines.forEach((t=>this._updateAnimationStyles("hlines",t))),t.circles&&t.circles.forEach((t=>this._updateAnimationStyles("circles",t))),t.icons&&t.icons.forEach((t=>{const e=t.animation_id;this.animations.icons[e]&&t.reuse||(this.animations.icons[e]={},this.animations.iconsIcon[e]={});const s=ft.getJsTemplateOrValue(t,t.styles),o=mt.toStyleDict(s);this.animations.icons[e]={...this.animations.icons[e],...o},this.animations.iconsIcon[e]=ft.getJsTemplateOrValue(t,t.icon)})),t.states&&t.states.forEach((t=>this._updateAnimationStyles("states",t))),!0})),!0})),this.requestUpdate()}_updateAnimationStyles(t,e){const s=e.animation_id;if(null==s)return;const o=ft.getJsTemplateOrValue(e,e.styles),i=mt.toStyleDict(o);this.animations[t][s]={...e.reuse?this.animations[t][s]??{}:{},...i}}_prepareItemColorStops(t){["states","names","areas","circles","hlines","vlines","icons"].forEach((e=>{const s=t.layout?.[e];Array.isArray(s)&&s.forEach((t=>{if(!t.color_stops)return;const e=ft.getJsTemplateOrValue(t,t.color_stops,{resolveKeys:!0});t._colorStops=_t.normalize(e)}))}))}setConfig(t){if(!(t=JSON.parse(JSON.stringify(t))).entities)throw Error("No entities defined");if(!t.layout)throw Error("No layout defined");const e=this._resolveEntityConfigs(t);if(e){if("sensor"!==this._computeDomain(e[0].entity)&&e[0].attribute&&!isNaN(e[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}e.forEach((t=>{t.tap_action||(t.tap_action={...St})}));const s={texts:[],card_filter:"card--filter-none",bar_mode:t.bar_mode||"normal",...t,show:{...vt,...t.show},horseshoe_position:{...bt,...t?.horseshoe_position},horseshoe_scale:{...xt,...t.horseshoe_scale},horseshoe_state:{...wt,...t.horseshoe_state}},o=Array.isArray(s.horseshoes)?s.horseshoes.map(((t,e)=>({...s,...t,entity_index:t.entity_index??e}))):[{...s,entity_index:0}];if(this.horseshoes=o.map(((t,e)=>{const s=t.entity_index??e,o={...vt,...t.show??{}},i={...xt,...t.horseshoe_scale??{}},r={...wt,...t.horseshoe_state??{}},n=t.xpos??t.horseshoe_position?.xpos??t.horseshoe_position?.cx??bt.xpos??bt.cx??50,a=t.ypos??t.horseshoe_position?.ypos??t.horseshoe_position?.cy??bt.ypos??bt.cy??50;if(!i.min&&0!==i.min||!i.max&&0!==i.max)throw Error(`No horseshoe min/max for scale defined for horseshoe ${e}`);const l=t.color_stops;if(!l)throw Error(`No color_stops defined for horseshoe ${e}`);const h=ft.getJsTemplateOrValue({entity_index:s},l,{resolveKeys:!0}),c=_t.normalize(h),d=c.colors;if(!d||d.length<2)throw Error(`No color_stops defined or not at least two colorstops for horseshoe ${e}`);const u=d[0],p=d[d.length-1];let m,f,_=_t.normalize({});u&&p&&(_=_t.normalize({[i.min]:u.color,[i.max]:p.color}),m=u.color,f=p.color);const g=t.radius??45,y=t.tickmarks_radius??43,$=t.arc_degrees??260,b=g/100*gt,v=y/100*gt,x=2*$/360*Math.PI*b,w=2*Math.PI*b;return{...t,entity_index:s,show:o,fill:t.fill??"rgba(0, 0, 0, 0)",xpos:n,ypos:a,bar_mode:t.bar_mode??"normal",horseshoe_scale:i,horseshoe_state:r,radius:g,tickmarks_radius:y,arc_degrees:$,radiusSize:b,tickmarksRadiusSize:v,horseshoePathLength:x,circlePathLength:w,color_stops:l,colorStops:c,colorStopsMinMax:_,color0:m,color1:f,angleCoords:{x1:"0%",y1:"0%",x2:"100%",y2:"0%"},color1_offset:"0%",dashArray:this.dashArray,dashOffset:this.dashOffset,bidirectional_negative:this._bidirectional_negative}})),!this.horseshoes.length)throw Error("No horseshoes defined");const i=this.horseshoes[0];this.colorStops=i.colorStops,this.colorStopsMinMax=i.colorStopsMinMax,this.color0=i.color0,this.color1=i.color1,this.angleCoords=i.angleCoords,this.color1_offset=i.color1_offset,this._prepareItemColorStops(s),this.config=s,this.bar_mode=s.bar_mode||"normal",this.config.layout?.icons&&this.config.layout.icons.forEach(((t,e)=>{this.iconsId[e]=Math.random().toString(36).substr(2,9)})),ft.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes})}setConfigV1(t){if(!(t=JSON.parse(JSON.stringify(t))).entities)throw Error("No entities defined");if(!t.layout)throw Error("No layout defined");if(!t.horseshoe_scale)throw Error("No horseshoe scale defined");if(!t.horseshoe_scale.min&&0===!t.horseshoe_scale.min||!t.horseshoe_scale.max)throw Error("No horseshoe min/max for scale defined");if(!t.color_stops||t.color_stops.length<2)throw Error("No color_stops defined or not at least two colorstops");const e=this._resolveEntityConfigs(t);if(e){if("sensor"!==this._computeDomain(e[0].entity)&&e[0].attribute&&!isNaN(e[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}const s={texts:[],card_filter:"card--filter-none",bar_mode:t.bar_mode||"normal",...t,show:{...vt,...t.show},horseshoe_position:{...bt,...t?.horseshoe_position},horseshoe_scale:{...xt,...t.horseshoe_scale},horseshoe_state:{...wt,...t.horseshoe_state}};for(var o of e)o.tap_action||(o.tap_action={...St});const i=ft.getJsTemplateOrValue({entity_index:0},s.color_stops,{resolveKeys:!0});this.colorStops=_t.normalize(i);const r=this.colorStops.colors,n=r[0],a=r[r.length-1];this.colorStopsMinMax=_t.normalize({}),n&&a&&(this.colorStopsMinMax=_t.normalize({[s.horseshoe_scale.min]:n.color,[s.horseshoe_scale.max]:a.color}),this.color0=n.color,this.color1=a.color);this.angleCoords={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},this.color1_offset="0%",this._prepareItemColorStops(s),this.config=s,this.bar_mode=s.bar_mode||"normal",this.config.layout?.icons&&this.config.layout.icons.forEach(((t,e)=>{this.iconsId[e]=Math.random().toString(36).substr(2,9)})),ft.setContext({hass:this._hass,config:this.config,entities:this.entities})}_getItemStateValue(t={}){const e=t.entity_index??0,s=this.entities?.[e],o=this.config?.entities?.[e];if(!s)return;const i=o?.attribute;return i&&s.attributes&&void 0!==s.attributes[i]?s.attributes[i]:s.state}_getItemColorFromStops(t={}){if(!t._colorStops)return;const e=this._getItemStateValue(t),s=Number(e);return Number.isFinite(s)?this._calculateStrokeColor(s,t._colorStops,!0===t.colorstop_gradient):void 0}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback()}render({config:t}=this){const e=ft.getJsTemplateOrValue({entity_index:0},t?.styles),s=mt.toStyleDict(e);return U`
      <ha-card @click=${t=>this.handlePopup(t,this.entities[0])} style=${pt(s)}>
        <div class="container" id="container">${this._renderSvg()}</div>

        <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
          ${this.horseshoes?.map(((t,e)=>L`
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
    `}renderV1({config:t}=this){const e=ft.getJsTemplateOrValue({entity_index:0},t?.styles),s=mt.toStyleDict(e);return U`
      <ha-card @click=${t=>this.handlePopup(t,this.entities[0])} style=${pt(s)}>
        <div class="container" id="container">${this._renderSvg()}</div>

        <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
          <linearGradient gradientTransform="rotate(0)" id="horseshoe__gradient-${this.cardId}" x1="${this.angleCoords.x1}" y1="${this.angleCoords.y1}" x2="${this.angleCoords.x2}" y2="${this.angleCoords.y2}">
            <stop offset="${this.color1_offset}" stop-color="${this.color1}"></stop>
            <stop offset="100%" stop-color="${this.color0}"></stop>
          </linearGradient>
        </svg>
      </ha-card>
    `}_renderTickMarks(t){if(!1===t.show?.scale_tickmarks)return L``;const e=t.horseshoe_scale,s=Number(e.min),o=Number(e.max),i=o-s;if(!i)return L``;const r=e.color||"var(--primary-background-color)",n=e.ticksize||i/10,a=t.arc_degrees||260,l=2*(t.xpos??50),h=2*(t.ypos??50),c=e.width?e.width/2:3,d=s%n,u=s+(0===d?0:n-d);if(u>o)return L``;const p=Math.floor((o-u)/n)+1,m=Array.from({length:p},((e,o)=>{const d=(a/2-(u+o*n-s)/i*a)*Math.PI/180;return L`
      <circle
        cx="${l-Math.sin(d)*t.tickmarksRadiusSize}"
        cy="${h-Math.cos(d)*t.tickmarksRadiusSize}"
        r="${c}"
        fill="${r}">
      </circle>
    `}));return L`${m}`}_renderTickMarksV2(t){if(!t?.show?.scale_tickmarks)return L``;const e=t.xpos??50,s=t.ypos??50,o=2*e,i=2*s,r=t.horseshoe_scale,n=r.color||"var(--primary-background-color)",a=r.ticksize||(r.max-r.min)/10,l=t.arc_degrees||260,h=r.min%a,c=r.min+(0===h?0:a-h),d=(c-r.min)/(r.max-r.min)*l,u=(r.max-c)/a,p=(l-d)/u;let m=Math.floor(u);Math.floor(m*a+c)<=r.max&&(m+=1);const f=r.width?r.width/2:3,_=Array.from({length:m},((e,s)=>{const r=d+(360-s*p-230)*Math.PI/180;return L`
      <circle
        cx="${o-Math.sin(r)*t.tickmarksRadiusSize}"
        cy="${i-Math.cos(r)*t.tickmarksRadiusSize}"
        r="${f}"
        fill="${n}">
      </circle>
    `}));return L`${_}`}_renderTickMarksV1(){const{config:t}=this;if(!t)return;if(!t.show)return;if(!t.show.scale_tickmarks)return;const e=t.horseshoe_scale.color?t.horseshoe_scale.color:"var(--primary-background-color)",s=t.horseshoe_scale.ticksize?t.horseshoe_scale.ticksize:(t.horseshoe_scale.max-t.horseshoe_scale.min)/10,o=t.horseshoe_scale.min%s,i=t.horseshoe_scale.min+(0===o?0:s-o),r=(i-t.horseshoe_scale.min)/(t.horseshoe_scale.max-t.horseshoe_scale.min)*260;var n=(t.horseshoe_scale.max-i)/s,a=Math.floor(n);const l=(260-r)/n;Math.floor(a*s+i)<=t.horseshoe_scale.max&&a++;const h=t.horseshoe_scale.width?t.horseshoe_scale.width/2:3;var c,d,u=[];for(d=0;d<a;d++)c=r+(360-d*l-230)*Math.PI/180,u[d]=L`
          <circle cx="${100-86*Math.sin(c)}"
                  cy="${100-86*Math.cos(c)}" r="${h}"
                  fill="${e}">
        `;return L`${u}`}_renderSvg(){const t=this.config.card_filter?this.config.card_filter:"card--filter-none";return L`
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
      `}_renderHorseShoes(){return L`
    ${this.horseshoes?.map(((t,e)=>this._renderHorseShoe(t,e)))??L``}
  `}_renderHorseShoesV1(){return L`${this._renderHorseShoeV1()}`}_renderHorseShoe(t,e){if(!1===t.show?.horseshoe)return L``;const s=t.xpos??50,o=t.ypos??50,i=`${s}%`,r=`${o}%`,n=2*s,a=2*o,l=t.bar_mode||"normal",h=`${t.radius}%`,c=t.fill||"rgba(0, 0, 0, 0)",d=t.horseshoe_scale.color||"#000000",u=t.horseshoe_scale.width||6,p=t.horseshoe_state.width||12,m=-90-(t.arc_degrees??260)/2,f=`${t.horseshoePathLength},${t.circlePathLength}`,_=`horseshoe__gradient-${this.cardId}-${e}`;return"bidirectional"===l?t.bidirectional_negative?L`
        <g id="horseshoe__svg__group-${e}" class="horseshoe__svg__group">
          <circle id="horseshoe__scale-${e}" class="horseshoe__scale" cx="${i}" cy="${r}" r="${h}"
            fill="${c}"
            stroke="${d}"
            stroke-dasharray="${f}"
            stroke-width="${u}"
            stroke-linecap="round"
            transform="rotate(${m} ${n} ${a})"/>
          <circle id="horseshoe__state__value-${e}" class="horseshoe__state__value" cx="${i}" cy="${r}" r="${h}"
            fill="${c}"
            stroke="url('#${_}')"
            stroke-dasharray="${t.dashArray}"
            stroke-dashoffset="${t.dashOffset}"
            stroke-width="${p}"
            stroke-linecap="round"
            transform="rotate(-90 ${n} ${a})"
            style="transition: all 2.5s ease-out;"/>
          ${this._renderTickMarks(t)}
        </g>
      `:L`
      <g id="horseshoe__svg__group-${e}" class="horseshoe__svg__group">
        <circle id="horseshoe__scale-${e}" class="horseshoe__scale" cx="${i}" cy="${r}" r="${h}"
          fill="${c}"
          stroke="${d}"
          stroke-dasharray="${f}"
          stroke-width="${u}"
          stroke-linecap="round"
          transform="rotate(${m} ${n} ${a})"/>
        <circle id="horseshoe__state__value-${e}" class="horseshoe__state__value" cx="${i}" cy="${r}" r="${h}"
          fill="${c}"
          stroke="url('#${_}')"
          stroke-dasharray="${t.dashArray}"
          stroke-width="${p}"
          stroke-linecap="round"
          transform="rotate(-90 ${n} ${a})"
          style="transition: all 2.5s ease-out;"/>
        ${this._renderTickMarks(t)}
      </g>
    `:L`
    <g id="horseshoe__svg__group-${e}" class="horseshoe__svg__group">
      <circle id="horseshoe__scale-${e}" class="horseshoe__scale" cx="${i}" cy="${r}" r="${h}"
        fill="${c}"
        stroke="${d}"
        stroke-dasharray="${f}"
        stroke-width="${u}"
        stroke-linecap="round"
        transform="rotate(${m} ${n} ${a})"/>
      <circle id="horseshoe__state__value-${e}" class="horseshoe__state__value" cx="${i}" cy="${r}" r="${h}"
        fill="${c}"
        stroke="url('#${_}')"
        stroke-dasharray="${t.dashArray}"
        stroke-width="${p}"
        stroke-linecap="round"
        transform="rotate(${m} ${n} ${a})"
        style="transition: all 2.5s ease-out;"/>
      ${this._renderTickMarks(t)}
    </g>
  `}_renderHorseShoeV1(){if(!this.config.show.horseshoe)return;return"bidirectional"===(this.config.bar_mode||"normal")?this._bidirectional_negative?L`
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
        `:L`
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
        `:L`
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
    `}_renderEntityNames(){const{layout:t}=this.config;if(!t?.names)return L``;const e={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"},s=t.names.map((t=>{const s=t.entity_index??0,o=ft.getJsTemplateOrValue(t,t.styles),i=mt.toStyleDict(o),r={...e,...i},n={...this.animations?.names?.[t.animation_id]??{}},a=this._getItemColorFromStops(t);a&&(n.stroke=a);const l={...r,...n},h=this._buildName(this.entities[t.entity_index],this.resolvedEntityConfigs[t.entity_index]);return L`
        <text
          @click=${t=>this.handlePopup(t,this.entities[s])}
          class="entity__name">
            <tspan
              class="entity__name"
              x="${t.xpos}%"
              y="${t.ypos}%"
              style=${pt(l)}>
              ${h}</tspan>
        </text>
      `}));return L`${s}`}_renderEntityAreas(){const{layout:t}=this.config;if(!t?.areas)return L``;const e={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"},s=t.areas.map((t=>{const s=t.entity_index??0,o=ft.getJsTemplateOrValue(t,t.styles),i=mt.toStyleDict(o),r={...e,...i},n={...mt.toStyleDict(this.animations?.areas?.[t.animation_id]??{})},a=this._getItemColorFromStops(t);a&&(n.stroke=a);const l={...r,...n},h=this._buildArea(this.entities[t.entity_index],this.resolvedEntityConfigs[t.entity_index]);return L`
        <text
          @click=${t=>this.handlePopup(t,this.entities[s])}
          class="entity__area">
            <tspan
              class="entity__area"
              x="${t.xpos}%"
              y="${t.ypos}%"
              style=${pt(l)}>
              ${h}</tspan>
        </text>
      `}));return L`${s}`}_renderState(t){if(!t)return L``;const e=t.entity_index??0,s=t.xpos?t.xpos:"",o=t.ypos?t.ypos:"",i=t.dx?t.dx:"0",r=t.dy?t.dy:"0",n=ft.getJsTemplateOrValue(t,t.styles),a=mt.toStyleDict(n),l=t.uom??{},h=ft.getJsTemplateOrValue(t,l.styles),c=mt.toStyleDict(h),d=l.dx??"0",u=l.dy??"-0.45";let p={};this.animations?.states?.[t.animation_id]&&(p={...this.animations.states[t.animation_id]});const m=this._getItemColorFromStops(t);m&&(p.fill=m);const f={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...a,...p},_=f["font-size"];let g=.5,y="em";const $=String(_).match(/\D+|\d*\.?\d+/g);2===$?.length?(g=.6*Number($[0]),y=$[1]):console.error("Cannot determine font-size for state",_);const b={"font-size":`${g}${y}`},v={...f,opacity:"0.7",...b,...c},x=this._buildUom(this.entities[e],this.resolvedEntityConfigs[e]),w=this.resolvedEntityConfigs[e].attribute&&this.entities[e].attributes[this.resolvedEntityConfigs[e].attribute]?this.attributesStr[e]:this.entitiesStr[e];return L`
      <text @click=${t=>this.handlePopup(t,this.entities[e])}>
        <tspan
          class="state__value"
          x="${s}%"
          y="${o}%"
          dx="${i}em"
          dy="${r}em"
          style=${pt(f)}
        >${w}</tspan><tspan
          class="state__uom"
          dx="${d}em"
          dy="${u}em"
          style=${pt(v)}
        >${x}</tspan>
      </text>
    `}_renderStates(){const{layout:t}=this.config;if(!t)return;if(!t.states)return;const e=t.states.map((t=>L`
            ${this._renderState(t)}
          `));return L`${e}`}_renderIcon(t,e){if(!t)return;t.entity=t.entity?t.entity:0,this.iconCache||={},this.iconsSvg||=[],this.pendingIconPath||=[];const s=12*(t.icon_size?t.icon_size:2),o=t.xpos?t.xpos/100:.5,i=t.ypos?t.ypos/100:.5,r=o*gt,n=i*gt,a=t.align?t.align:"center",l="center"===a?.5:"start"===a?-1:1;let h=r-s*l,c=n-s*l,d=s;const u=t.entity_index??0,p=ft.getJsTemplateOrValue(t,t.styles);let m=mt.toStyleDict(p);const f=this.animations?.icons?.[t.animation_id]??{},_=this._getItemColorFromStops(t);_&&(m.fill=_),m={...m,...f};const g=this._buildIcon(this.entities[u],this.resolvedEntityConfigs[u],this.animations?.iconsIcon?.[t.animation_id]);if(this.iconCache[g])this.iconsSvg[e]=this.iconCache[g];else if(this.iconsSvg[e]=void 0,this.pendingIconPath[e]!==g){this.pendingIconPath[e]=g;let t=0;const s=40,o=50,i=()=>{if(this.pendingIconPath[e]!==g)return;const r=this._getRenderedHaIconPath(e);if(r)return this.iconsSvg[e]=r,this.iconCache[g]=r,this.pendingIconPath[e]=void 0,void this.requestUpdate();t+=1,t>=s?this.pendingIconPath[e]=void 0:window.setTimeout(i,o)};(this._card?.updateComplete&&"function"==typeof this.updateComplete.then||this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((t=>window.requestAnimationFrame(t)))).then((()=>{window.setTimeout(i,0)}))}const y=this.iconsSvg[e];if(y){const o=r-s*l,i=n-.5*s-.25*s,a=s/24;return L`
      <g
        id="icon-rendered-${this.iconsId[e]}"
        style="${pt(m)}"
        x="${o}px"
        y="${i}px"
        transform-origin="${r} ${n}"
        @click=${e=>this.handlePopup(e,this.entities[t.entity_index])}
      >
        <rect
          x="${o}"
          y="${i}"
          height="${s}px"
          width="${s}px"
          stroke-width="0px"
          fill="rgba(0,0,0,0)"
        ></rect>

        <path
          d="${y}"
          transform="translate(${o},${i}) scale(${a})"
        ></path>
      </g>
    `}return L`
    <foreignObject
      width="0px"
      height="0px"
      x="${h}"
      y="${c}"
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
            .icon=${g}
            id="icon-${this.iconsId[e]}"
          ></ha-icon>
        </div>
      </body>
    </foreignObject>
  `}_getRenderedHaIconPath(t){const e=this.shadowRoot.getElementById(`icon-${this.iconsId[t]}`);return e?.shadowRoot?.querySelector("*")?.path}_scheduleIconPathRead(t,e){if(!t)return;if(this.iconCache[t])return void(this.iconsSvg[e]=this.iconCache[t]);if(this.pendingIconPath[e]===t)return;this.pendingIconPath[e]=t;let s=0;const o=()=>{if(this.pendingIconPath[e]!==t)return;if(this.iconCache[t])return this.iconsSvg[e]=this.iconCache[t],this.pendingIconPath[e]=void 0,void this.requestUpdate();const i=this._getRenderedHaIconPath();if(i)return this.iconsSvg[e]=i,this.iconCache[t]=i,this.pendingIconPath[e]=void 0,void this.requestUpdate();s+=1,s>=40?this.pendingIconPath[e]=void 0:this._iconPathTimer=window.setTimeout(o,50)};(this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((t=>{window.requestAnimationFrame(t)}))).then((()=>{this._iconPathTimer=window.setTimeout(o,0)}))}_renderIcons(){const{layout:t}=this.config;if(!t)return;if(!t.icons)return;const e=t.icons.map(((t,e)=>L`
            ${this._renderIcon(t,e)}
          `));return L`${e}`}_renderHorizontalLines(){const{layout:t}=this.config;if(!t?.hlines)return L``;const e={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2"},s=t.hlines.map((t=>{const s=t.entity_index??0,o=ft.getJsTemplateOrValue(t,t.styles),i=mt.toStyleDict(o),r={...e,...i},n={...mt.toStyleDict(this.animations?.hlines?.[t.animation_id]??{})},a=this._getItemColorFromStops(t);a&&(n.stroke=a);const l={...r,...n};return L`
      <line
        @click=${t=>this.handlePopup(t,this.entities[s])}
        class="line__horizontal"
        x1="${t.xpos-t.length/2}%"
        y1="${t.ypos}%"
        x2="${t.xpos+t.length/2}%"
        y2="${t.ypos}%" 
        style=${pt(l)}
      ></line>
    `}));return L`${s}`}_renderVerticalLines(){const{layout:t}=this.config;if(!t?.vlines)return L``;const e={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2"},s=t.vlines.map((t=>{const s=t.entity_index??0,o=ft.getJsTemplateOrValue(t,t.styles),i=mt.toStyleDict(o),r={...e,...i},n={...mt.toStyleDict(this.animations?.vlines?.[t.animation_id]??{})},a=this._getItemColorFromStops(t);a&&(n.stroke=a);const l={...r,...n};return L`
      <line
        @click=${t=>this.handlePopup(t,this.entities[s])}
        class="line__vertical"
        x1="${t.xpos}%"
        y1="${t.ypos-t.length/2}%"
        x2="${t.xpos}%"
        y2="${t.ypos+t.length/2}%"
        style=${pt(l)}
      ></line>
    `}));return L`${s}`}_renderCircles(){const{layout:t}=this.config;if(!t?.circles)return L``;const e={},s=t.circles.map((t=>{const s=t.entity_index??0,o=ft.getJsTemplateOrValue(t,t.styles),i=mt.toStyleDict(o),r={...e,...i},n={...mt.toStyleDict(this.animations?.circles?.[t.animation_id]??{})},a=this._getItemColorFromStops(t);a&&(n.stroke=a);const l={...r,...n};return L`
      <circle
        @click=${t=>this.handlePopup(t,this.entities[s])}
        class="svg__dot"
        cx="${t.xpos}%"
        cy="${t.ypos}%"
        r="${t.radius}"
        style=${pt(l)}
      ></circle>
    `}));return L`${s}`}_handleClick(t,e,s,o,i){let r;switch(o.action){case"more-info":r=new Event("hass-more-info",{composed:!0}),r.detail={entityId:i},t.dispatchEvent(r);break;case"navigate":if(!o.navigation_path)return;window.history.pushState(null,"",o.navigation_path),r=new Event("location-changed",{composed:!0}),r.detail={replace:!1},window.dispatchEvent(r);break;case"call-service":{if(!o.service)return;const[t,s]=o.service.split(".",2),i={...o.service_data};e.callService(t,s,i)}}}handlePopup(t,e){t.stopPropagation();const s=this.resolvedEntityConfigs.find((t=>t.entity===e.entity_id)),o=s?.tap_action??this.config?.tap_action??{action:"more-info"};this._handleClick(this,this._hass,this.config,o,e.entity_id)}handlePopupV1(t,e){t.stopPropagation(),this._handleClick(this,this._hass,this.config,this.resolvedEntityConfigs[this.resolvedEntityConfigs.findIndex(((t,s,o)=>t.entity===e.entity_id))].tap_action,e.entity_id)}_buildArea(t,e){return e.area||"?"}_buildName(t,e){return e.name||t.attributes.friendly_name}_buildIcon(t,e,s){return s||e.icon||t.attributes.icon}_buildUom(t,e){return e.unit||t.attributes.unit_of_measurement||""}_buildState(t,e){if(isNaN(t))return t;const s=Number(t);if(void 0===e.decimals||Number.isNaN(e.decimals)||Number.isNaN(s))return Math.round(100*s)/100;const o=10**e.decimals;return(Math.round(s*o)/o).toFixed(e.decimals)}_computeState(t,e){if(isNaN(t))return t;const s=Number(t);if(void 0===e||Number.isNaN(e)||Number.isNaN(s))return Math.round(100*s)/100;const o=10**e;return(Math.round(s*o)/o).toFixed(e)}_calculateStrokeColor(t,e,s){const o=e?.colors??[];if(!o.length)return;const i=Number(t);if(!Number.isFinite(i))return o[0].color;if(i<=o[0].value)return o[0].color;const r=o[o.length-1];if(i>=r.value)return r.color;for(let n=0;n<o.length-1;n+=1){const t=o[n],e=o[n+1];if(i>=t.value&&i<e.value){if(!s)return t.color;const o=this._calculateValueBetween(t.value,e.value,i);return this._getGradientValue(t.color,e.color,o)}}return r.color}_calculateValueBetween(t,e,s){return(Math.min(Math.max(s,t),e)-t)/(e-t)}_getLovelacePanel(){var t=window.document.querySelector("home-assistant");return(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))||null}_getColorVariable(t){const e=t.substr(4,t.length-5);this.lovelace||(this.lovelace=this._getLovelacePanel());return window.getComputedStyle(this.lovelace).getPropertyValue(e)}_getGradientValue(t,e,s){const o=this._colorToRGBA(t),i=this._colorToRGBA(e),r=1-s,n=s,a=Math.floor(o[0]*r+i[0]*n),l=Math.floor(o[1]*r+i[1]*n),h=Math.floor(o[2]*r+i[2]*n),c=Math.floor(o[3]*r+i[3]*n);return`#${this._padZero(a.toString(16))}${this._padZero(l.toString(16))}${this._padZero(h.toString(16))}${this._padZero(c.toString(16))}`}_padZero(t){return t.length<2&&(t=`0${t}`),t.substr(0,2)}_computeDomain(t){return t.substr(0,t.indexOf("."))}_computeEntity(t){return t.substr(t.indexOf(".")+1)}_colorToRGBA(t){if(t in this.colorCache)return this.colorCache[t];var e=t;"var"===t.substr(0,3).valueOf()&&(e=this._getColorVariable(t));var s=window.document.createElement("canvas");s.width=s.height=1;var o=s.getContext("2d");o.clearRect(0,0,1,1),o.fillStyle=e,o.fillRect(0,0,1,1);const i=[...o.getImageData(0,0,1,1).data];return this.colorCache[t]=i,i}getCardSize(){return 4}}customElements.get("flex-horseshoe-card")||customElements.define("flex-horseshoe-card",At);

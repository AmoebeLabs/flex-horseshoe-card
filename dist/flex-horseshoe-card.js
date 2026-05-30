/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),o=new WeakMap;let a=class{constructor(e,t,o){if(this._$cssResult$=!0,o!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const r=this.t;if(t&&void 0===e){const t=void 0!==r&&1===r.length;t&&(e=o.get(r)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&o.set(r,e))}return e}toString(){return this.cssText}};const s=(e,...t)=>{const o=1===e.length?e[0]:t.reduce(((t,r,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[o+1]),e[0]);return new a(o,e,r)},i=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return(e=>new a("string"==typeof e?e:e+"",void 0,r))(t)})(e):e
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,m=globalThis,p=m.trustedTypes,g=p?p.emptyScript:"",b=m.reactiveElementPolyfillSupport,f=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},v=(e,t)=>!n(e,t),_={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),o=this.getPropertyDescriptor(e,r,t);void 0!==o&&l(this.prototype,e,o)}}static getPropertyDescriptor(e,t,r){const{get:o,set:a}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:o,set(t){const s=o?.call(this);a?.call(this,t),this.requestUpdate(e,s,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const e=this.properties,t=[...d(e),...h(e)];for(const r of t)this.createProperty(r,e[r])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,r]of t)this.elementProperties.set(e,r)}this._$Eh=new Map;for(const[t,r]of this.elementProperties){const e=this._$Eu(t,r);void 0!==e&&this._$Eh.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(i(e))}else void 0!==e&&t.push(i(e));return t}static _$Eu(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((r,o)=>{if(t)r.adoptedStyleSheets=o.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const t of o){const o=document.createElement("style"),a=e.litNonce;void 0!==a&&o.setAttribute("nonce",a),o.textContent=t.cssText,r.appendChild(o)}})(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){const r=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,r);if(void 0!==o&&!0===r.reflect){const a=(void 0!==r.converter?.toAttribute?r.converter:y).toAttribute(t,r.type);this._$Em=e,null==a?this.removeAttribute(o):this.setAttribute(o,a),this._$Em=null}}_$AK(e,t){const r=this.constructor,o=r._$Eh.get(e);if(void 0!==o&&this._$Em!==o){const e=r.getPropertyOptions(o),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=o;const s=a.fromAttribute(t,e.type);this[o]=s??this._$Ej?.get(o)??s,this._$Em=null}}requestUpdate(e,t,r,o=!1,a){if(void 0!==e){const s=this.constructor;if(!1===o&&(a=this[e]),r??=s.getPropertyOptions(e),!((r.hasChanged??v)(a,t)||r.useDefault&&r.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,r))))return;this.C(e,t,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:o,wrapped:a},s){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),!0!==a||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),!0===o&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,r]of e){const{wrapped:e}=r,o=this[t];!0!==e||this._$AL.has(t)||void 0===o||this.C(t,void 0,r,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[f("elementProperties")]=new Map,x[f("finalized")]=new Map,b?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,w=$.trustedTypes,k=w?w.createPolicy("flex-horseshoe-card-lit-html",{createHTML:e=>e}):void 0,M="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+S,A=`<${C}>`,N=document,T=()=>N.createComment(""),z=e=>null===e||"object"!=typeof e&&"function"!=typeof e,E=Array.isArray,P="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,V=/-->/g,O=/>/g,D=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,L=/"/g,H=/^(?:script|style|textarea|title)$/i,R=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),F=R(1),q=R(2),G=Symbol.for("lit-noChange"),U=Symbol.for("lit-nothing"),B=new WeakMap,J=N.createTreeWalker(N,129);function W(e,t){if(!E(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(t):t}const Y=(e,t)=>{const r=e.length-1,o=[];let a,s=2===t?"<svg>":3===t?"<math>":"",i=I;for(let n=0;n<r;n++){const t=e[n];let r,l,c=-1,d=0;for(;d<t.length&&(i.lastIndex=d,l=i.exec(t),null!==l);)d=i.lastIndex,i===I?"!--"===l[1]?i=V:void 0!==l[1]?i=O:void 0!==l[2]?(H.test(l[2])&&(a=RegExp("</"+l[2],"g")),i=D):void 0!==l[3]&&(i=D):i===D?">"===l[0]?(i=a??I,c=-1):void 0===l[1]?c=-2:(c=i.lastIndex-l[2].length,r=l[1],i=void 0===l[3]?D:'"'===l[3]?L:j):i===L||i===j?i=D:i===V||i===O?i=I:(i=D,a=void 0);const h=i===D&&e[n+1].startsWith("/>")?" ":"";s+=i===I?t+A:c>=0?(o.push(r),t.slice(0,c)+M+t.slice(c)+S+h):t+S+(-2===c?n:h)}return[W(e,s+(e[r]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),o]};class X{constructor({strings:e,_$litType$:t},r){let o;this.parts=[];let a=0,s=0;const i=e.length-1,n=this.parts,[l,c]=Y(e,t);if(this.el=X.createElement(l,r),J.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(o=J.nextNode())&&n.length<i;){if(1===o.nodeType){if(o.hasAttributes())for(const e of o.getAttributeNames())if(e.endsWith(M)){const t=c[s++],r=o.getAttribute(e).split(S),i=/([.?@])?(.*)/.exec(t);n.push({type:1,index:a,name:i[2],strings:r,ctor:"."===i[1]?te:"?"===i[1]?re:"@"===i[1]?oe:ee}),o.removeAttribute(e)}else e.startsWith(S)&&(n.push({type:6,index:a}),o.removeAttribute(e));if(H.test(o.tagName)){const e=o.textContent.split(S),t=e.length-1;if(t>0){o.textContent=w?w.emptyScript:"";for(let r=0;r<t;r++)o.append(e[r],T()),J.nextNode(),n.push({type:2,index:++a});o.append(e[t],T())}}}else if(8===o.nodeType)if(o.data===C)n.push({type:2,index:a});else{let e=-1;for(;-1!==(e=o.data.indexOf(S,e+1));)n.push({type:7,index:a}),e+=S.length-1}a++}}static createElement(e,t){const r=N.createElement("template");return r.innerHTML=e,r}}function K(e,t,r=e,o){if(t===G)return t;let a=void 0!==o?r._$Co?.[o]:r._$Cl;const s=z(t)?void 0:t._$litDirective$;return a?.constructor!==s&&(a?._$AO?.(!1),void 0===s?a=void 0:(a=new s(e),a._$AT(e,r,o)),void 0!==o?(r._$Co??=[])[o]=a:r._$Cl=a),void 0!==a&&(t=K(e,a._$AS(e,t.values),a,o)),t}class Z{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,o=(e?.creationScope??N).importNode(t,!0);J.currentNode=o;let a=J.nextNode(),s=0,i=0,n=r[0];for(;void 0!==n;){if(s===n.index){let t;2===n.type?t=new Q(a,a.nextSibling,this,e):1===n.type?t=new n.ctor(a,n.name,n.strings,this,e):6===n.type&&(t=new ae(a,this,e)),this._$AV.push(t),n=r[++i]}s!==n?.index&&(a=J.nextNode(),s++)}return J.currentNode=N,o}p(e){let t=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}let Q=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,o){this.type=2,this._$AH=U,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=K(this,e,t),z(e)?e===U||null==e||""===e?(this._$AH!==U&&this._$AR(),this._$AH=U):e!==this._$AH&&e!==G&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>E(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==U&&z(this._$AH)?this._$AA.nextSibling.data=e:this.T(N.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:r}=e,o="number"==typeof r?this._$AC(e):(void 0===r.el&&(r.el=X.createElement(W(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===o)this._$AH.p(t);else{const e=new Z(o,this),r=e.u(this.options);e.p(t),this.T(r),this._$AH=e}}_$AC(e){let t=B.get(e.strings);return void 0===t&&B.set(e.strings,t=new X(e)),t}k(t){E(this._$AH)||(this._$AH=[],this._$AR());const r=this._$AH;let o,a=0;for(const s of t)a===r.length?r.push(o=new e(this.O(T()),this.O(T()),this,this.options)):o=r[a],o._$AI(s),a++;a<r.length&&(this._$AR(o&&o._$AB.nextSibling,a),r.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}};class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,o,a){this.type=1,this._$AH=U,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=a,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=U}_$AI(e,t=this,r,o){const a=this.strings;let s=!1;if(void 0===a)e=K(this,e,t,0),s=!z(e)||e!==this._$AH&&e!==G,s&&(this._$AH=e);else{const o=e;let i,n;for(e=a[0],i=0;i<a.length-1;i++)n=K(this,o[r+i],t,i),n===G&&(n=this._$AH[i]),s||=!z(n)||n!==this._$AH[i],n===U?e=U:e!==U&&(e+=(n??"")+a[i+1]),this._$AH[i]=n}s&&!o&&this.j(e)}j(e){e===U?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===U?void 0:e}}class re extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==U)}}class oe extends ee{constructor(e,t,r,o,a){super(e,t,r,o,a),this.type=5}_$AI(e,t=this){if((e=K(this,e,t,0)??U)===G)return;const r=this._$AH,o=e===U&&r!==U||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,a=e!==U&&(r===U||o);o&&this.element.removeEventListener(this.name,this,r),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ae{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){K(this,e)}}const se=$.litHtmlPolyfillSupport;se?.(X,Q),($.litHtmlVersions??=[]).push("3.3.2");const ie=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ne=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,r)=>{const o=r?.renderBefore??t;let a=o._$litPart$;if(void 0===a){const e=r?.renderBefore??null;o._$litPart$=a=new Q(t.insertBefore(T(),e),e,void 0,r??{})}return a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}};ne._$litElement$=!0,ne.finalized=!0,ie.litElementHydrateSupport?.({LitElement:ne});const le=ie.litElementPolyfillSupport;le?.({LitElement:ne}),(ie.litElementVersions??=[]).push("4.2.2");
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
 */const he="important",ue=" !"+he,me=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends de{constructor(e){if(super(e),e.type!==ce||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce(((t,r)=>{const o=e[r];return null==o?t:t+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`}),"")}update(e,[t]){const{style:r}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const o of this.ft)null==t[o]&&(this.ft.delete(o),o.includes("-")?r.removeProperty(o):r[o]=null);for(const o in t){const e=t[o];if(null!=e){this.ft.add(o);const t="string"==typeof e&&e.endsWith(ue);o.includes("-")||t?r.setProperty(o,t?e.slice(0,-11):e,t?he:""):r[o]=e}}return G}});class pe{static toStyleDict(e){return pe.toDict(e,{stringToDict:pe.cssStringToDict,mapValue:pe.toStyleValue})}static toClassDict(e){return pe.toDict(e,{stringToDict:pe.classStringToDict,mapValue:Boolean})}static toIconDict(e){return pe.toDict(e,{stringToDict:pe.stringToDefaultDict("default"),mapValue:String})}static toDict(e,t={}){const{stringToDict:r=pe.stringToDefaultDict("default"),mapValue:o=(e=>e),skipNull:a=!0,skipFalse:s=!0}=t,i=e=>null==e&&a||!1===e&&s?{}:Array.isArray(e)?e.reduce(((e,t)=>({...e,...i(t)})),{}):pe.isPlainObject(e)?Object.fromEntries(Object.entries(e).filter((([,e])=>(null!=e||!a)&&(!1!==e||!s))).map((([e,t])=>[e,o(t,e)]))):"string"==typeof e?r(e):{};return i(e)}static toStyleValue(e){return null==e?e:String(e).trim().replace(/;+$/,"")}static cssStringToDict(e){return String(e).split(";").map((e=>e.trim())).filter(Boolean).reduce(((e,t)=>{const r=t.indexOf(":");if(r<=0)return e;const o=t.slice(0,r).trim(),a=t.slice(r+1).trim();return o&&a?{...e,[o]:a}:e}),{})}static toColorStopDict(e){return pe.toDict(e,{stringToDict:pe.keyValueStringToDict,mapValue:String})}static keyValueStringToDict(e){const t=String(e).trim(),r=t.indexOf(":");if(r<=0)return{};const o=t.slice(0,r).trim(),a=t.slice(r+1).trim();return o&&a?{[o]:a}:{}}static classStringToDict(e){return String(e).trim().split(/\s+/).filter(Boolean).reduce(((e,t)=>({...e,[t]:!0})),{})}static stringToDefaultDict(e="default"){return t=>({[e]:String(t)})}static requireArray(e,t="value"){if(null==e)return[];if(!Array.isArray(e))throw new Error(`[config-helper] "${t}" must be an array.`);return e}static ensureArray(e){return null==e?[]:Array.isArray(e)?e:[e]}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}}class ge{static context={};static setContext(e={}){ge.context=e}static getJsTemplateOrValue(e,t,r={}){return ge._getJsTemplateOrValue(e,t,r,0)}static _getJsTemplateOrValue(e,t,r={},o=0){const{resolveKeys:a=!0,maxDepth:s=10}=r;if(o>=s)return t;if(null==t)return t;if(["number","boolean","bigint","symbol"].includes(typeof t))return t;if(Array.isArray(t))return t.map((t=>ge._getJsTemplateOrValue(e,t,r,o)));if(ge.isPlainObject(t))return Object.fromEntries(Object.entries(t).map((([t,s])=>{const i=a?ge._getJsTemplateOrValue(e,t,r,o):t,n=ge._getJsTemplateOrValue(e,s,r,o);return[String(i),n]})));if("string"!=typeof t)return t;const i=t.trim();if(!ge.isJsTemplate(i))return t;const n=ge.evaluateJsTemplate(e,ge.extractJsTemplateCode(i));return ge._getJsTemplateOrValue(e,n,r,o+1)}static getJsTemplateOrValueV1(e,t,r={}){const{resolveKeys:o=!0}=r;if(null==t)return t;if(["number","boolean","bigint","symbol"].includes(typeof t))return t;if(Array.isArray(t))return t.map((t=>ge.getJsTemplateOrValue(e,t,r)));if(ge.isPlainObject(t))return Object.fromEntries(Object.entries(t).map((([t,a])=>{const s=o?ge.getJsTemplateOrValue(e,t,r):t,i=ge.getJsTemplateOrValue(e,a,r);return[String(s),i]})));if("string"!=typeof t)return t;const a=t.trim();if(ge.isJsTemplate(a)){const t=ge.evaluateJsTemplate(e,ge.extractJsTemplateCode(a));return ge.getJsTemplateOrValue(e,t,r)}return t}static isJsTemplate(e){return"string"==typeof e&&e.trim().startsWith("[[[")&&e.trim().endsWith("]]]")}static extractJsTemplateCode(e){return String(e).trim().slice(3,-3).trim()}static evaluateJsTemplate(e,t){const{hass:r,config:o,entities:a=[]}=ge.context,s=ge._getItemEntityIndex(e),i=ge._getTemplateState(e),n=a?.[s],l=r?.states,c=o?.variables??{},d=r?.user;o?.dev?.debug&&console.log("Evaluating JavaScript template with context:",{hass:r,config:o,entity:n,entities:a,states:l,state:i,variables:c,item:e,user:d});try{return new Function("hass","config","entity","entities","states","state","variables","item","user",`\n          "use strict";\n          ${t}\n        `)(r,o,n,a,l,i,c,e,d)}catch(h){return void(o?.dev?.debug&&console.error("[templates] JavaScript template error:",{error:h,item:e,javascript:t}))}}static _getTemplateState(e={}){const t=ge._getItemEntityIndex(e),r=ge.context.entities?.[t],o=ge.context.config?.entities?.[t]||{};if(!r)return;const a=o.attribute;return a&&r.attributes&&void 0!==r.attributes[a]?r.attributes[a]:r.state}static _getItemEntityIndex(e={}){const t=Number(e.entity_index);return Number.isFinite(t)?t:0}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}}class be{static normalize(e){return e?Array.isArray(e)?{scales:{},colors:be.normalizeColors(e)}:!be.isPlainObject(e)||e.colors||e.scales?be.isPlainObject(e)?{...e,scales:be.normalizeScales(e.scales),colors:be.normalizeColors(e.colors)}:{scales:{},colors:[]}:{scales:{},colors:be.normalizeColors(e)}:{scales:{},colors:[]}}static normalizeScales(e){return be.isPlainObject(e)?Object.fromEntries(Object.entries(e).map((([e,t])=>[e,be.isPlainObject(t)?{...t}:t]))):{}}static normalizeColors(e){return e?Array.isArray(e)?e.flatMap((e=>be.normalizeColorArrayEntry(e))).filter(Boolean).sort(((e,t)=>e.value-t.value)):be.isPlainObject(e)?Object.entries(e).map((([e,t])=>be.normalizeColorPair(e,t))).filter(Boolean).sort(((e,t)=>e.value-t.value)):[]:[]}static normalizeColorArrayEntry(e){if(be.isPlainObject(e)&&Object.prototype.hasOwnProperty.call(e,"value")&&Object.prototype.hasOwnProperty.call(e,"color")){const t=be.normalizeColorEntry(e);return t?[t]:[]}return be.isPlainObject(e)?Object.entries(e).map((([e,t])=>be.normalizeColorPair(e,t))).filter(Boolean):[]}static normalizeColorPair(e,t){const r=Number(e);return Number.isFinite(r)?null==t?null:{value:r,color:String(t)}:null}static normalizeColorEntry(e){if(!be.isPlainObject(e))return null;const t=Number(e.value);return Number.isFinite(t)?void 0===e.color||null===e.color?null:{...e,value:t,color:String(e.color)}:null}static ensureMinimumStops(e,t){return e?.colors&&1===e.colors.length?{...e,colors:[e.colors[0],{value:t,color:e.colors[0].color}]}:e}static isPlainObject(e){return null!==e&&"object"==typeof e&&!Array.isArray(e)}static _testColorStopsNormalizer(){const e={entity_index:0},t=[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}];[{name:"FHC dict",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC dict with quoted keys",raw:{0:"red",10:"green",20:"blue"}},{name:"FHC list of dicts",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC list of dicts with quoted keys",raw:[{0:"red"},{10:"green"},{20:"blue"}]},{name:"FHC dict with template values",raw:{0:"[[[\n          return 'red';\n        ]]]",10:"[[[\n          return 'green';\n        ]]]",20:"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template values",raw:[{0:"[[[\n            return 'red';\n          ]]]"},{10:"[[[\n            return 'green';\n          ]]]"},{20:"[[[\n            return 'blue';\n          ]]]"}]},{name:"FHC dict with template keys",raw:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}},{name:"FHC dict with template keys and values",raw:{"[[[ return 0; ]]]":"[[[\n          return 'red';\n        ]]]","[[[ return 10; ]]]":"[[[\n          return 'green';\n        ]]]","[[[ return 20; ]]]":"[[[\n          return 'blue';\n        ]]]"}},{name:"FHC list with template keys and values",raw:[{"[[[ return 0; ]]]":"[[[\n            return 'red';\n          ]]]"},{"[[[ return 10; ]]]":"[[[\n            return 'green';\n          ]]]"},{"[[[ return 20; ]]]":"[[[\n            return 'blue';\n          ]]]"}]},{name:"Whole FHC color_stops as template returning dict",raw:"[[[\n        return {\n          0: 'red',\n          10: 'green',\n          20: 'blue',\n        };\n      ]]]"},{name:"Whole FHC color_stops as template returning list",raw:"[[[\n        return [\n          { 0: 'red' },\n          { 10: 'green' },\n          { 20: 'blue' },\n        ];\n      ]]]"},{name:"SAK v1 colorstops.colors dict",raw:{colors:{0:"red",10:"green",20:"blue"}}},{name:"SAK v1 colorstops.colors dict with template keys",raw:{colors:{"[[[ return 0; ]]]":"red","[[[ return 10; ]]]":"green","[[[ return 20; ]]]":"blue"}}},{name:"SAK v1 colorstops.colors dict with template values",raw:{colors:{0:"[[[\n            return 'red';\n          ]]]",10:"[[[\n            return 'green';\n          ]]]",20:"[[[\n            return 'blue';\n          ]]]"}}},{name:"SAK v2 colors list",raw:{scales:{default:{min:0,max:20}},colors:[{value:0,color:"red"},{value:10,color:"green"},{value:20,color:"blue"}]}},{name:"SAK v2 colors list unsorted",raw:{scales:{default:{min:0,max:20}},colors:[{value:20,color:"blue",rank:2},{value:0,color:"red",rank:1},{value:10,color:"green",rank:1}]}},{name:"SAK v2 colors list with template values",raw:{scales:{default:{min:"[[[\n              return 0;\n            ]]]",max:"[[[\n              return 20;\n            ]]]"}},colors:[{value:"[[[\n              return 0;\n            ]]]",color:"[[[\n              return 'red';\n            ]]]"},{value:"[[[\n              return 10;\n            ]]]",color:"[[[\n              return 'green';\n            ]]]"},{value:"[[[\n              return 20;\n            ]]]",color:"[[[\n              return 'blue';\n            ]]]"}]}},{name:"SAK v2 whole colors list as template",raw:{scales:{default:{min:0,max:20}},colors:"[[[\n          return [\n            { value: 0, color: 'red' },\n            { value: 10, color: 'green' },\n            { value: 20, color: 'blue' },\n          ];\n        ]]]"}}].forEach((r=>{const o=ge.getJsTemplateOrValue(e,r.raw,{resolveKeys:!0}),a=be.normalize(o),s=a.colors.map((e=>({value:e.value,color:e.color}))),i=JSON.stringify(s)===JSON.stringify(t);console.log(`[colorstops test] ${i?"PASS":"FAIL"} - ${r.name}`,{raw:r.raw,resolved:o,normalized:a,simpleColors:s,expectedColors:t})}))}}const fe="mdi:bookmark",ye={air_quality:"mdi:air-filter",alert:"mdi:alert",calendar:"mdi:calendar",climate:"mdi:thermostat",configurator:"mdi:cog",conversation:"mdi:microphone-message",counter:"mdi:counter",datetime:"mdi:calendar-clock",date:"mdi:calendar",demo:"mdi:home-assistant",google_assistant:"mdi:google-assistant",group:"mdi:google-circles-communities",homeassistant:"mdi:home-assistant",homekit:"mdi:home-automation",image_processing:"mdi:image-filter-frames",input_button:"mdi:gesture-tap-button",input_datetime:"mdi:calendar-clock",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",light:"mdi:lightbulb",mailbox:"mdi:mailbox",notify:"mdi:comment-alert",number:"mdi:ray-vertex",persistent_notification:"mdi:bell",plant:"mdi:Flower",proximity:"mdi:apple-safari",remote:"mdi:remote",scene:"mdi:palette",schedule:"mdi:calendar-clock",script:"mdi:script-text",select:"mdi:format-list-bulleted",sensor:"mdi:eye",simple_alarm:"mdi:bell",siren:"mdi:bullhorn",stt:"mdi:microphone-message",text:"mdi:form-textbox",time:"mdi:clock",timer:"mdi:timer-outline",tts:"mdi:speaker-message",updater:"mdi:cloud-upload",vacuum:"mdi:robot-vacuum",zone:"mdi:map-marker-radius"},ve={apparent_power:"mdi:flash",aqi:"mdi:air-filter",atmospheric_pressure:"mdi:thermometer-lines",carbon_dioxide:"mdi:molecule-co2",carbon_monoxide:"mdi:molecule-co",current:"mdi:current-ac",data_rate:"mdi:transmission-tower",data_size:"mdi:database",date:"mdi:calendar",distance:"mdi:arrow-left-right",duration:"mdi:progress-clock",energy:"mdi:lightning-bolt",frequency:"mdi:sine-wave",gas:"mdi:meter-gas",humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",irradiance:"mdi:sun-wireless",moisture:"mdi:water-percent",monetary:"mdi:cash",nitrogen_dioxide:"mdi:molecule",nitrogen_monoxide:"mdi:molecule",nitrous_oxide:"mdi:molecule",ozone:"mdi:molecule",pm1:"mdi:molecule",pm10:"mdi:molecule",pm25:"mdi:molecule",power:"mdi:flash",power_factor:"mdi:angle-acute",precipitation:"mdi:weather-rainy",precipitation_intensity:"mdi:weather-pouring",pressure:"mdi:gauge",reactive_power:"mdi:flash",signal_strength:"mdi:wifi",sound_pressure:"mdi:ear-hearing",speed:"mdi:speedometer",sulphur_dioxide:"mdi:molecule",temperature:"mdi:thermometer",timestamp:"mdi:clock",volatile_organic_compounds:"mdi:molecule",volatile_organic_compounds_parts:"mdi:molecule",voltage:"mdi:sine-wave",volume:"mdi:car-coolant-level",water:"mdi:water",weight:"mdi:weight",wind_speed:"mdi:weather-windy"},_e=e=>e.substring(0,e.indexOf(".")),xe={10:"mdi:battery-10",20:"mdi:battery-20",30:"mdi:battery-30",40:"mdi:battery-40",50:"mdi:battery-50",60:"mdi:battery-60",70:"mdi:battery-70",80:"mdi:battery-80",90:"mdi:battery-90",100:"mdi:battery"},$e=(e,t)=>{const r=Number(e);if(isNaN(r))return"off"===e?"mdi:battery":"on"===e?"mdi:battery-alert":"mdi:battery-unknown";const o=10*Math.round(r/10);return r<=5?"mdi:battery-alert-variant-outline":xe[o]},we=e=>{const t=e?.attributes.device_class;if(t&&t in ve)return ve[t];if("battery"===t)return e?((e,t)=>{const r=e.state;return $e(r)})(e):"mdi:battery";const r=e?.attributes.unit_of_measurement;return"°C"===r||"°F"===r?"mdi-thermometer":void 0},ke=(e,t,r)=>{const o=t?.state;switch(e){case"alarm_control_panel":return(e=>{switch(e){case"armed_away":return"mdi:shield-lock";case"armed_vacation":return"mdi:shield-airplane";case"armed_home":return"mdi:shield-home";case"armed_night":return"mdi:shield-moon";case"armed_custom_bypass":return"mdi:security";case"pending":return"mdi:shield-outline";case"triggered":return"mdi:bell-ring";case"disarmed":return"mdi:shield-off";default:return"mdi:shield"}})(o);case"automation":return"off"===o?"mdi:robot-off":"mdi:robot";case"binary_sensor":return((e,t)=>{const r="off"===e;switch(t?.attributes.device_class){case"battery":return r?"mdi:battery":"mdi:battery-outline";case"battery_charging":return r?"mdi:battery":"mdi:battery-charging";case"carbon_monoxide":return r?"mdi:smoke-detector":"mdi:smoke-detector-alert";case"cold":return r?"mdi:thermometer":"mdi:Snowflake";case"connectivity":return r?"mdi:close-network-outline":"mdi:check-network-outline";case"door":return r?"mdi:door-closed":"mdi:door-open";case"garage_door":return r?"mdi:garage":"mdi:garage-open";case"power":case"plug":return r?"mdi:power-plug-off":"mdi:power-plug";case"gas":case"problem":case"safety":case"tamper":return r?"mdi:check-circle":"mdi:alert-circle";case"smoke":return r?"mdi:smoke-detector-variant":"mdi:smoke-detector-variant-alert";case"heat":return r?"mdi:thermometer":"mdi:fire";case"light":return r?"mdi:brightness-5":"mdi:brightness-7";case"lock":return r?"mdi:lock":"mdi:lock-open";case"moisture":return r?"mdi:water-off":"mdi:water";case"motion":return r?"mdi:motion-sensor-off":"mdi:motion-sensor";case"occupancy":return r?"mdi:home-outline":"mdi:Home";case"opening":return r?"mdi:square":"mdi:square-outline";case"presence":return r?"mdi:home-outline":"mdi:home";case"running":return r?"mdi:stop":"mdi:play";case"sound":return r?"mdi:music-note-off":"mdi:music-note";case"update":return r?"mdi:package":"mdi:package-up";case"vibration":return r?"mdi:crop-portrait":"mdi:vibrate";case"window":return r?"mdi:window-closed":"mdi:window-open";default:return r?"mdi:radiobox-blank":"mdi:checkbox-marked-circle"}})(o,t);case"button":switch(t?.attributes.device_class){case"restart":return"mdi:restart";case"update":return"mdi:package-up";default:return"mdi:gesture-tap-button"}case"camera":return"off"===o?"mdi:video-off":"mdi:video";case"cover":return((e,t)=>{const r="closed"!==e;switch(t?.attributes.device_class){case"garage":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdigarage";default:return"mdi:Garage-open"}case"gate":switch(e){case"opening":case"closing":return"mdi:gate-arrow-right";case"closed":return"mdi:gate";default:return"mdi:gate-open"}case"door":return r?"mdi:door-open":"mdi:door-closed";case"damper":return r?"mdi:circle":"mdi:circle-slice-8";case"shutter":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window-shutter";default:return"mdi:window-shutter-open"}case"curtain":switch(e){case"opening":return"mdi:arrow-split-vertical";case"closing":return"mdi:arrow-collapse-horizontal";case"closed":return"mdi:curtains-closed";default:return"mdi:curtains"}case"blind":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:blinds-horizontal-closed";default:return"mdi:blinds-horizontal"}case"shade":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:roller-shade-closed";default:return"mdi:roller-shade"}case"window":switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}}switch(e){case"opening":return"mdi:arrow-up-box";case"closing":return"mdi:arrow-down-box";case"closed":return"mdi:window--closed";default:return"mdi:window--open"}})(o,t);case"device_tracker":return"router"===t?.attributes.source_type?"home"===o?"mdi:lan-connect":"mdi:lan-cisconnect":["bluetooth","bluetooth_le"].includes(t?.attributes.source_type)?"home"===o?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===o?"mdi:account-arrow-right":"mdi:account";case"fan":return"off"===o?"mdi:fan-off":"mdi:fan";case"humidifier":return"off"===o?"mdi:air-humidifier-off":"mdi:air-humidifier";case"input_boolean":return"on"===o?"mdi:check-circle-outline":"mdi:close-circle-outline";case"input_datetime":if(!t?.attributes.has_date)return"mdi:clock";if(!t.attributes.has_time)return"mdi:calendar";break;case"lock":switch(o){case"unlocked":return"mdi:lock-open";case"jammed":return"mdi:lock-alert";case"locking":case"unlocking":return"mdi:lock-clock";default:return"mdi:lock"}case"media_player":switch(t?.attributes.device_class){case"speaker":switch(o){case"playing":return"mdi:speaker-play";case"paused":return"mdi:speaker-pause";case"off":return"mdi:speaker-off";default:return"mdi:speaker"}case"tv":switch(o){case"playing":return"mdi:television-play";case"paused":return"mdi:television-pause";case"off":return"mdi:television-off";default:return"mdi:television"}case"receiver":return"off"===o?"mdi:audio-video-off":"mdi:audio-video";default:switch(o){case"playing":case"paused":return"mdi:cast-connected";case"off":return"mdi:cast-off";default:return"mdi:cast"}}case"number":{const e=(e=>{const t=e?.attributes.device_class;if(t&&t in ve)return ve[t]})(t);if(e)return e;break}case"person":return"not_home"===o?"mdi:account-arrow-right":"mdi:account";case"switch":switch(t?.attributes.device_class){case"outlet":return"on"===o?"mdi:power-plug":"mdi:power-plug-off";case"switch":return"on"===o?"mdi:toggle-switch-variant":"mdi:toggle-switch-variant-off";default:return"mdi:toggle-switch-variant"}case"sensor":{const e=we(t);if(e)return e;break}case"sun":return"above_horizon"===t?.state?"mdi:white-balance-sunny":"mdi:weather-night";case"switch_as_x":return"mdi:swap-horizontal";case"threshold":return"mdi:chart-sankey";case"water_heater":return"off"===o?"mdi:water-boiler-off":"mdi:water-boiler"}if(e in ye)return ye[e]},Me=e=>{return e?(t=_e(e.entity_id),ke(t,e)||(console.warn(`Unable to find icon for domain ${t}`),fe)):fe;var t};var Se,Ce,Ae,Ne,Te;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.quote_decimal="quote_decimal",e.space_comma="space_comma",e.none="none"}(Se||(Se={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(Ce||(Ce={})),function(e){e.local="local",e.server="server"}(Ae||(Ae={})),function(e){e.language="language",e.system="system",e.DMY="DMY",e.MDY="MDY",e.YMD="YMD"}(Ne||(Ne={})),function(e){e.language="language",e.monday="monday",e.tuesday="tuesday",e.wednesday="wednesday",e.thursday="thursday",e.friday="friday",e.saturday="saturday",e.sunday="sunday"}(Te||(Te={}));const ze=(e,t,r)=>{const o=t?(e=>{switch(e.number_format){case Se.comma_decimal:return["en-US","en"];case Se.decimal_comma:return["de","es","it"];case Se.space_comma:return["fr","sv","cs"];case Se.quote_decimal:return["de-CH"];case Se.system:return;default:return e.language}})(t):void 0;return t?.number_format===Se.none||Number.isNaN(Number(e))?Number.isNaN(Number(e))||""===e||t?.number_format!==Se.none?[{type:"literal",value:e}]:new Intl.NumberFormat("en-US",Ee(e,{...r,useGrouping:!1})).formatToParts(Number(e)):new Intl.NumberFormat(o,Ee(e,r)).formatToParts(Number(e))},Ee=(e,t)=>{const r={maximumFractionDigits:2,...t};if("string"!=typeof e)return r;if(!t||void 0===t.minimumFractionDigits&&void 0===t.maximumFractionDigits){const t=e.indexOf(".")>-1?e.split(".")[1].length:0;r.minimumFractionDigits=t,r.maximumFractionDigits=t}return r};Intl.DateTimeFormat?.().resolvedOptions?.().timeZone;const Pe="unavailable",Ie=(Ve=[Pe,"unknown"],(e,t)=>Ve.includes(e,t));var Ve;const Oe=(e,t)=>e&&e.components.includes(t),De=e=>_e(e.entity_id),je={entity:{},entity_component:{}},Le=async(e,t,r)=>((e,t)=>e.sendMessagePromise(t))(e,{type:"frontend/get_icons",category:t,integration:r}),He=async(e,t,r,o=!1)=>{if(!o&&r in je.entity)return je.entity[r];if(!Oe(e,r)||!((e,t,r,o)=>{const[a,s,i]=e.split(".",3);return Number(a)>t||Number(a)===t&&(void 0===o?Number(s)>=r:Number(s)>r)||void 0!==o&&Number(a)===t&&Number(s)===r&&Number(i)>=o})(t.haVersion,2024,2))return;const a=Le(t,"entity",r).then((e=>e?.resources[r]));return je.entity[r]=a,je.entity[r]},Re=async(e,t,r,o=!1)=>!o&&je.entity_component.resources&&je.entity_component.domains?.includes(r)?je.entity_component.resources.then((e=>e[r])):Oe(t,r)?(je.entity_component.domains=[...t.components],je.entity_component.resources=Le(e,"entity_component").then((e=>e.resources)),je.entity_component.resources.then((e=>e[r]))):void 0,Fe=new WeakMap,qe=(e,t)=>{if(t)return e&&t.state?.[e]?t.state[e]:void 0!==e&&t.range&&!isNaN(Number(e))?((e,t)=>{let r=Fe.get(t);if(r||(r=Object.keys(t).map(Number).filter((e=>!isNaN(e))).sort(((e,t)=>e-t)),Fe.set(t,r)),0===r.length)return;if(e<r[0])return;let o=r[0];for(const a of r){if(!(e>=a))break;o=a}return t[o.toString()]})(Number(e),t.range)??t.default:t.default},Ge=async(e,t,r,o,a,s)=>{const i=s?.platform,n=s?.translation_key,l=o?.attributes.device_class,c=o?.state;let d;if(n&&i){const o=await He(e,t,i);if(o){const e=o[r]?.[n];d=qe(c,e)}}if(!d&&o&&(d=((e,t)=>{const r=De(e),o=t??e.state;switch(r){case"device_tracker":return((e,t)=>{const r=t??e.state;return"router"===e?.attributes.source_type?"home"===r?"mdi:lan-connect":"mdi:lan-disconnect":["bluetooth","bluetooth_le"].includes(e?.attributes.source_type)?"home"===r?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===r?"mdi:account-arrow-right":"mdi:account"})(e,o);case"sun":return"above_horizon"===o?"mdi:white-balance-sunny":"mdi:weather-night";case"input_datetime":if(!e.attributes.has_date)return"mdi:clock";if(!e.attributes.has_time)return"mdi:calendar"}})(o,c)),!d){const o=await Re(t,e,r);if(o){const e=l&&o[l]||o._;d=qe(c,e)}}return d},Ue=(e,t)=>{if("number"==typeof e)return 3===t?{mode:"rgb",r:(e>>8&15|e>>4&240)/255,g:(e>>4&15|240&e)/255,b:(15&e|e<<4&240)/255}:4===t?{mode:"rgb",r:(e>>12&15|e>>8&240)/255,g:(e>>8&15|e>>4&240)/255,b:(e>>4&15|240&e)/255,alpha:(15&e|e<<4&240)/255}:6===t?{mode:"rgb",r:(e>>16&255)/255,g:(e>>8&255)/255,b:(255&e)/255}:8===t?{mode:"rgb",r:(e>>24&255)/255,g:(e>>16&255)/255,b:(e>>8&255)/255,alpha:(255&e)/255}:void 0},Be={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Je=/^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i,We="([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)",Ye=`${We}%`,Xe=`(?:${We}%|${We})`,Ke=`(?:${We}(deg|grad|rad|turn)|${We})`,Ze="\\s*,\\s*",Qe=new RegExp(`^rgba?\\(\\s*${We}${Ze}${We}${Ze}${We}\\s*(?:,\\s*${Xe}\\s*)?\\)$`),et=new RegExp(`^rgba?\\(\\s*${Ye}${Ze}${Ye}${Ze}${Ye}\\s*(?:,\\s*${Xe}\\s*)?\\)$`),tt=(e="rgb")=>t=>void 0!==(t=((e,t)=>void 0===e?void 0:"object"!=typeof e?$t(e):void 0!==e.mode?e:t?{...e,mode:t}:void 0)(t,e))?t.mode===e?t:rt[t.mode][e]?rt[t.mode][e](t):"rgb"===e?rt[t.mode].rgb(t):rt.rgb[e](rt[t.mode].rgb(t)):void 0,rt={},ot={},at=[],st={},it=e=>e,nt=e=>(rt[e.mode]={...rt[e.mode],...e.toMode},Object.keys(e.fromMode||{}).forEach((t=>{rt[t]||(rt[t]={}),rt[t][e.mode]=e.fromMode[t]})),e.ranges||(e.ranges={}),e.difference||(e.difference={}),e.channels.forEach((t=>{if(void 0===e.ranges[t]&&(e.ranges[t]=[0,1]),!e.interpolate[t])throw new Error(`Missing interpolator for: ${t}`);"function"==typeof e.interpolate[t]&&(e.interpolate[t]={use:e.interpolate[t]}),e.interpolate[t].fixup||(e.interpolate[t].fixup=it)})),ot[e.mode]=e,(e.parse||[]).forEach((t=>{lt(t,e.mode)})),tt(e.mode)),lt=(e,t)=>{if("string"==typeof e){if(!t)throw new Error("'mode' required when 'parser' is a string");st[e]=t}else"function"==typeof e&&at.indexOf(e)<0&&at.push(e)},ct=/[^\x00-\x7F]|[a-zA-Z_]/,dt=/[^\x00-\x7F]|[-\w]/,ht={Function:"function",Ident:"ident",Number:"number",Percentage:"percentage",ParenClose:")",None:"none",Hue:"hue",Alpha:"alpha"};let ut=0;function mt(e){let t=e[ut],r=e[ut+1];return"-"===t||"+"===t?/\d/.test(r)||"."===r&&/\d/.test(e[ut+2]):/\d/.test("."===t?r:t)}function pt(e){if(ut>=e.length)return!1;let t=e[ut];if(ct.test(t))return!0;if("-"===t){if(e.length-ut<2)return!1;let t=e[ut+1];return!("-"!==t&&!ct.test(t))}return!1}const gt={deg:1,rad:180/Math.PI,grad:.9,turn:360};function bt(e){let t="";if("-"!==e[ut]&&"+"!==e[ut]||(t+=e[ut++]),t+=ft(e),"."===e[ut]&&/\d/.test(e[ut+1])&&(t+=e[ut++]+ft(e)),"e"!==e[ut]&&"E"!==e[ut]||("-"!==e[ut+1]&&"+"!==e[ut+1]||!/\d/.test(e[ut+2])?/\d/.test(e[ut+1])&&(t+=e[ut++]+ft(e)):t+=e[ut++]+e[ut++]+ft(e)),pt(e)){let r=yt(e);return"deg"===r||"rad"===r||"turn"===r||"grad"===r?{type:ht.Hue,value:t*gt[r]}:void 0}return"%"===e[ut]?(ut++,{type:ht.Percentage,value:+t}):{type:ht.Number,value:+t}}function ft(e){let t="";for(;/\d/.test(e[ut]);)t+=e[ut++];return t}function yt(e){let t="";for(;ut<e.length&&dt.test(e[ut]);)t+=e[ut++];return t}function vt(e){let t=yt(e);return"("===e[ut]?(ut++,{type:ht.Function,value:t}):"none"===t?{type:ht.None,value:void 0}:{type:ht.Ident,value:t}}function _t(e){e._i=0;let t=e[e._i++];if(!t||t.type!==ht.Function||"color"!==t.value)return;if(t=e[e._i++],t.type!==ht.Ident)return;const r=st[t.value];if(!r)return;const o={mode:r},a=xt(e,!1);if(!a)return;const s=(e=>ot[e])(r).channels;for(let i,n,l=0;l<s.length;l++)i=a[l],n=s[l],i.type!==ht.None&&(o[n]=i.type===ht.Number?i.value:i.value/100,"alpha"===n&&(o[n]=Math.max(0,Math.min(1,o[n]))));return o}function xt(e,t){const r=[];let o;for(;e._i<e.length;)if(o=e[e._i++],o.type===ht.None||o.type===ht.Number||o.type===ht.Alpha||o.type===ht.Percentage||t&&o.type===ht.Hue)r.push(o);else{if(o.type!==ht.ParenClose)return;if(e._i<e.length)return}if(!(r.length<3||r.length>4)){if(4===r.length){if(r[3].type!==ht.Alpha)return;r[3]=r[3].value}return 3===r.length&&r.push({type:ht.None,value:void 0}),r.every((e=>e.type!==ht.Alpha))?r:void 0}}const $t=e=>{if("string"!=typeof e)return;const t=function(e=""){let t,r=e.trim(),o=[];for(ut=0;ut<r.length;)if(t=r[ut++],"\n"!==t&&"\t"!==t&&" "!==t){if(","===t)return;if(")"!==t){if("+"===t){if(ut--,mt(r)){o.push(bt(r));continue}return}if("-"===t){if(ut--,mt(r)){o.push(bt(r));continue}if(pt(r)){o.push({type:ht.Ident,value:yt(r)});continue}return}if("."===t){if(ut--,mt(r)){o.push(bt(r));continue}return}if("/"===t){for(;ut<r.length&&("\n"===r[ut]||"\t"===r[ut]||" "===r[ut]);)ut++;let e;if(mt(r)&&(e=bt(r),e.type!==ht.Hue)){o.push({type:ht.Alpha,value:e});continue}if(pt(r)&&"none"===yt(r)){o.push({type:ht.Alpha,value:{type:ht.None,value:void 0}});continue}return}if(/\d/.test(t))ut--,o.push(bt(r));else{if(!ct.test(t))return;ut--,o.push(vt(r))}}else o.push({type:ht.ParenClose})}else for(;ut<r.length&&("\n"===r[ut]||"\t"===r[ut]||" "===r[ut]);)ut++;return o}(e),r=t?function(e,t){e._i=0;let r=e[e._i++];if(!r||r.type!==ht.Function)return;let o=xt(e,t);return o?(o.unshift(r.value),o):void 0}(t,!0):void 0;let o,a=0,s=at.length;for(;a<s;)if(void 0!==(o=at[a++](e,r)))return o;return t?_t(t):void 0};const wt=(kt=(e,t,r)=>e+r*(t-e),e=>{let t=(e=>{let t=[];for(let r=0;r<e.length-1;r++){let o=e[r],a=e[r+1];void 0===o&&void 0===a?t.push(void 0):void 0!==o&&void 0!==a?t.push([o,a]):t.push(void 0!==o?[o,o]:[a,a])}return t})(e);return e=>{let r=e*t.length,o=e>=1?t.length-1:Math.max(Math.floor(r),0),a=t[o];return void 0===a?void 0:kt(a[0],a[1],r-o)}});var kt;const Mt=e=>{let t=!1,r=e.map((e=>void 0!==e?(t=!0,e):1));return t?r:e},St={mode:"rgb",channels:["r","g","b","alpha"],parse:[function(e,t){if(!t||"rgb"!==t[0]&&"rgba"!==t[0])return;const r={mode:"rgb"},[,o,a,s,i]=t;return o.type!==ht.Hue&&a.type!==ht.Hue&&s.type!==ht.Hue?(o.type!==ht.None&&(r.r=o.type===ht.Number?o.value/255:o.value/100),a.type!==ht.None&&(r.g=a.type===ht.Number?a.value/255:a.value/100),s.type!==ht.None&&(r.b=s.type===ht.Number?s.value/255:s.value/100),i.type!==ht.None&&(r.alpha=Math.min(1,Math.max(0,i.type===ht.Number?i.value:i.value/100))),r):void 0},e=>{let t;return(t=e.match(Je))?Ue(parseInt(t[1],16),t[1].length):void 0},e=>{let t,r={mode:"rgb"};if(t=e.match(Qe))void 0!==t[1]&&(r.r=t[1]/255),void 0!==t[2]&&(r.g=t[2]/255),void 0!==t[3]&&(r.b=t[3]/255);else{if(!(t=e.match(et)))return;void 0!==t[1]&&(r.r=t[1]/100),void 0!==t[2]&&(r.g=t[2]/100),void 0!==t[3]&&(r.b=t[3]/100)}return void 0!==t[4]?r.alpha=Math.max(0,Math.min(1,t[4]/100)):void 0!==t[5]&&(r.alpha=Math.max(0,Math.min(1,+t[5]))),r},e=>Ue(Be[e.toLowerCase()],6),e=>"transparent"===e?{mode:"rgb",r:0,g:0,b:0,alpha:0}:void 0,"srgb"],serialize:"srgb",interpolate:{r:wt,g:wt,b:wt,alpha:{use:wt,fixup:Mt}},gamut:!0,white:{r:1,g:1,b:1},black:{r:0,g:0,b:0}},Ct=(e=0)=>Math.pow(Math.abs(e),563/256)*Math.sign(e),At=e=>{let t=Ct(e.r),r=Ct(e.g),o=Ct(e.b),a={mode:"xyz65",x:.5766690429101305*t+.1855582379065463*r+.1882286462349947*o,y:.297344975250536*t+.6273635662554661*r+.0752914584939979*o,z:.0270313613864123*t+.0706888525358272*r+.9913375368376386*o};return void 0!==e.alpha&&(a.alpha=e.alpha),a},Nt=e=>Math.pow(Math.abs(e),256/563)*Math.sign(e),Tt=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a={mode:"a98",r:Nt(2.0415879038107465*e-.5650069742788597*t-.3447313507783297*r),g:Nt(-.9692436362808798*e+1.8759675015077206*t+.0415550574071756*r),b:Nt(.0134442806320312*e-.1183623922310184*t+1.0151749943912058*r)};return void 0!==o&&(a.alpha=o),a},zt=(e=0)=>{const t=Math.abs(e);return t<=.04045?e/12.92:(Math.sign(e)||1)*Math.pow((t+.055)/1.055,2.4)},Et=({r:e,g:t,b:r,alpha:o})=>{let a={mode:"lrgb",r:zt(e),g:zt(t),b:zt(r)};return void 0!==o&&(a.alpha=o),a},Pt=e=>{let{r:t,g:r,b:o,alpha:a}=Et(e),s={mode:"xyz65",x:.4123907992659593*t+.357584339383878*r+.1804807884018343*o,y:.2126390058715102*t+.715168678767756*r+.0721923153607337*o,z:.0193308187155918*t+.119194779794626*r+.9505321522496607*o};return void 0!==a&&(s.alpha=a),s},It=(e=0)=>{const t=Math.abs(e);return t>.0031308?(Math.sign(e)||1)*(1.055*Math.pow(t,1/2.4)-.055):12.92*e},Vt=({r:e,g:t,b:r,alpha:o},a="rgb")=>{let s={mode:a,r:It(e),g:It(t),b:It(r)};return void 0!==o&&(s.alpha=o),s},Ot=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=Vt({r:3.2409699419045226*e-1.537383177570094*t-.4986107602930034*r,g:-.9692436362808796*e+1.8759675015077204*t+.0415550574071756*r,b:.0556300796969936*e-.2039769588889765*t+1.0569715142428784*r});return void 0!==o&&(a.alpha=o),a},Dt={...St,mode:"a98",parse:["a98-rgb"],serialize:"a98-rgb",fromMode:{rgb:e=>Tt(Pt(e)),xyz65:Tt},toMode:{rgb:e=>Ot(At(e)),xyz65:At}},jt=e=>(e%=360)<0?e+360:e,Lt=e=>((e,t)=>e.map(((r,o,a)=>{if(void 0===r)return r;let s=jt(r);return 0===o||void 0===e[o-1]?s:t(s-jt(a[o-1]))})).reduce(((e,t)=>e.length&&void 0!==t&&void 0!==e[e.length-1]?(e.push(t+e[e.length-1]),e):(e.push(t),e)),[]))(e,(e=>Math.abs(e)<=180?e:e-360*Math.sign(e))),Ht=[-.14861,1.78277,-.29227,-.90649,1.97294,0],Rt=Math.PI/180,Ft=180/Math.PI;let qt=Ht[3]*Ht[4],Gt=Ht[1]*Ht[4],Ut=Ht[1]*Ht[2]-Ht[0]*Ht[3];const Bt=(e,t)=>{if(void 0===e.h||void 0===t.h||!e.s||!t.s)return 0;let r=jt(e.h),o=jt(t.h),a=Math.sin((o-r+360)/2*Math.PI/180);return 2*Math.sqrt(e.s*t.s)*a},Jt=(e,t)=>{if(void 0===e.h||void 0===t.h||!e.c||!t.c)return 0;let r=jt(e.h),o=jt(t.h),a=Math.sin((o-r+360)/2*Math.PI/180);return 2*Math.sqrt(e.c*t.c)*a},Wt=e=>{let t=e.reduce(((e,t)=>{if(void 0!==t){let r=t*Math.PI/180;e.sin+=Math.sin(r),e.cos+=Math.cos(r)}return e}),{sin:0,cos:0}),r=180*Math.atan2(t.sin,t.cos)/Math.PI;return r<0?360+r:r},Yt={mode:"cubehelix",channels:["h","s","l","alpha"],parse:["--cubehelix"],serialize:"--cubehelix",ranges:{h:[0,360],s:[0,4.614],l:[0,1]},fromMode:{rgb:({r:e,g:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=(Ut*r+e*qt-t*Gt)/(Ut+qt-Gt),s=r-a,i=(Ht[4]*(t-a)-Ht[2]*s)/Ht[3],n={mode:"cubehelix",l:a,s:0===a||1===a?void 0:Math.sqrt(s*s+i*i)/(Ht[4]*a*(1-a))};return n.s&&(n.h=Math.atan2(i,s)*Ft-120),void 0!==o&&(n.alpha=o),n}},toMode:{rgb:({h:e,s:t,l:r,alpha:o})=>{let a={mode:"rgb"};e=(void 0===e?0:e+120)*Rt,void 0===r&&(r=0);let s=void 0===t?0:t*r*(1-r),i=Math.cos(e),n=Math.sin(e);return a.r=r+s*(Ht[0]*i+Ht[1]*n),a.g=r+s*(Ht[2]*i+Ht[3]*n),a.b=r+s*(Ht[4]*i+Ht[5]*n),void 0!==o&&(a.alpha=o),a}},interpolate:{h:{use:wt,fixup:Lt},s:wt,l:wt,alpha:{use:wt,fixup:Mt}},difference:{h:Bt},average:{h:Wt}},Xt=({l:e,a:t,b:r,alpha:o},a="lch")=>{void 0===t&&(t=0),void 0===r&&(r=0);let s=Math.sqrt(t*t+r*r),i={mode:a,l:e,c:s};return s&&(i.h=jt(180*Math.atan2(r,t)/Math.PI)),void 0!==o&&(i.alpha=o),i},Kt=({l:e,c:t,h:r,alpha:o},a="lab")=>{void 0===r&&(r=0);let s={mode:a,l:e,a:t?t*Math.cos(r/180*Math.PI):0,b:t?t*Math.sin(r/180*Math.PI):0};return void 0!==o&&(s.alpha=o),s},Zt=Math.pow(29,3)/Math.pow(3,3),Qt=Math.pow(6,3)/Math.pow(29,3),er=.3457/.3585,tr=1,rr=.2958/.3585,or=.3127/.329,ar=1,sr=.3583/.329;let ir=e=>Math.pow(e,3)>Qt?Math.pow(e,3):(116*e-16)/Zt;const nr=({l:e,a:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=(e+16)/116,s=a-r/200,i={mode:"xyz65",x:ir(t/500+a)*or,y:ir(a)*ar,z:ir(s)*sr};return void 0!==o&&(i.alpha=o),i},lr=e=>Ot(nr(e)),cr=e=>e>Qt?Math.cbrt(e):(Zt*e+16)/116,dr=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=cr(e/or),s=cr(t/ar),i={mode:"lab65",l:116*s-16,a:500*(a-s),b:200*(s-cr(r/sr))};return void 0!==o&&(i.alpha=o),i},hr=e=>{let t=dr(Pt(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},ur=26/180*Math.PI,mr=Math.cos(ur),pr=Math.sin(ur),gr=100/Math.log(1.39),br=({l:e,c:t,h:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a={mode:"lab65",l:(Math.exp(1*e/gr)-1)/.0039},s=(Math.exp(.0435*t*1*1)-1)/.075,i=s*Math.cos(r/180*Math.PI-ur),n=s*Math.sin(r/180*Math.PI-ur);return a.a=i*mr-n/.83*pr,a.b=i*pr+n/.83*mr,void 0!==o&&(a.alpha=o),a},fr=({l:e,a:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=t*mr+r*pr,s=.83*(r*mr-t*pr),i=Math.sqrt(a*a+s*s),n={mode:"dlch",l:gr/1*Math.log(1+.0039*e),c:Math.log(1+.075*i)/.0435};return n.c&&(n.h=jt((Math.atan2(s,a)+ur)/Math.PI*180)),void 0!==o&&(n.alpha=o),n},yr=e=>br(Xt(e,"dlch")),vr=e=>Kt(fr(e),"dlab"),_r={mode:"dlab",parse:["--din99o-lab"],serialize:"--din99o-lab",toMode:{lab65:yr,rgb:e=>lr(yr(e))},fromMode:{lab65:vr,rgb:e=>vr(hr(e))},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-40.09,45.501],b:[-40.469,44.344]},interpolate:{l:wt,a:wt,b:wt,alpha:{use:wt,fixup:Mt}}},xr={mode:"dlch",parse:["--din99o-lch"],serialize:"--din99o-lch",toMode:{lab65:br,dlab:e=>Kt(e,"dlab"),rgb:e=>lr(br(e))},fromMode:{lab65:fr,dlab:e=>Xt(e,"dlch"),rgb:e=>fr(hr(e))},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,51.484],h:[0,360]},interpolate:{l:wt,c:wt,h:{use:wt,fixup:Lt},alpha:{use:wt,fixup:Mt}},difference:{h:Jt},average:{h:Wt}};const $r={mode:"hsi",toMode:{rgb:function({h:e,s:t,i:r,alpha:o}){e=jt(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let a,s=Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:a={r:r*(1+t*(3/(2-s)-1)),g:r*(1+t*(3*(1-s)/(2-s)-1)),b:r*(1-t)};break;case 1:a={r:r*(1+t*(3*(1-s)/(2-s)-1)),g:r*(1+t*(3/(2-s)-1)),b:r*(1-t)};break;case 2:a={r:r*(1-t),g:r*(1+t*(3/(2-s)-1)),b:r*(1+t*(3*(1-s)/(2-s)-1))};break;case 3:a={r:r*(1-t),g:r*(1+t*(3*(1-s)/(2-s)-1)),b:r*(1+t*(3/(2-s)-1))};break;case 4:a={r:r*(1+t*(3*(1-s)/(2-s)-1)),g:r*(1-t),b:r*(1+t*(3/(2-s)-1))};break;case 5:a={r:r*(1+t*(3/(2-s)-1)),g:r*(1-t),b:r*(1+t*(3*(1-s)/(2-s)-1))};break;default:a={r:r*(1-t),g:r*(1-t),b:r*(1-t)}}return a.mode="rgb",void 0!==o&&(a.alpha=o),a}},parse:["--hsi"],serialize:"--hsi",fromMode:{rgb:function({r:e,g:t,b:r,alpha:o}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=Math.max(e,t,r),s=Math.min(e,t,r),i={mode:"hsi",s:e+t+r===0?0:1-3*s/(e+t+r),i:(e+t+r)/3};return a-s!=0&&(i.h=60*(a===e?(t-r)/(a-s)+6*(t<r):a===t?(r-e)/(a-s)+2:(e-t)/(a-s)+4)),void 0!==o&&(i.alpha=o),i}},channels:["h","s","i","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:wt,fixup:Lt},s:wt,i:wt,alpha:{use:wt,fixup:Mt}},difference:{h:Bt},average:{h:Wt}};const wr=new RegExp(`^hsla?\\(\\s*${Ke}${Ze}${Ye}${Ze}${Ye}\\s*(?:,\\s*${Xe}\\s*)?\\)$`);const kr={mode:"hsl",toMode:{rgb:function({h:e,s:t,l:r,alpha:o}){e=jt(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let a,s=r+t*(r<.5?r:1-r),i=s-2*(s-r)*Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:a={r:s,g:i,b:2*r-s};break;case 1:a={r:i,g:s,b:2*r-s};break;case 2:a={r:2*r-s,g:s,b:i};break;case 3:a={r:2*r-s,g:i,b:s};break;case 4:a={r:i,g:2*r-s,b:s};break;case 5:a={r:s,g:2*r-s,b:i};break;default:a={r:2*r-s,g:2*r-s,b:2*r-s}}return a.mode="rgb",void 0!==o&&(a.alpha=o),a}},fromMode:{rgb:function({r:e,g:t,b:r,alpha:o}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=Math.max(e,t,r),s=Math.min(e,t,r),i={mode:"hsl",s:a===s?0:(a-s)/(1-Math.abs(a+s-1)),l:.5*(a+s)};return a-s!=0&&(i.h=60*(a===e?(t-r)/(a-s)+6*(t<r):a===t?(r-e)/(a-s)+2:(e-t)/(a-s)+4)),void 0!==o&&(i.alpha=o),i}},channels:["h","s","l","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(e,t){if(!t||"hsl"!==t[0]&&"hsla"!==t[0])return;const r={mode:"hsl"},[,o,a,s,i]=t;if(o.type!==ht.None){if(o.type===ht.Percentage)return;r.h=o.value}if(a.type!==ht.None){if(a.type===ht.Hue)return;r.s=a.value/100}if(s.type!==ht.None){if(s.type===ht.Hue)return;r.l=s.value/100}return i.type!==ht.None&&(r.alpha=Math.min(1,Math.max(0,i.type===ht.Number?i.value:i.value/100))),r},e=>{let t=e.match(wr);if(!t)return;let r={mode:"hsl"};return void 0!==t[3]?r.h=+t[3]:void 0!==t[1]&&void 0!==t[2]&&(r.h=((e,t)=>{switch(t){case"deg":return+e;case"rad":return e/Math.PI*180;case"grad":return e/10*9;case"turn":return 360*e}})(t[1],t[2])),void 0!==t[4]&&(r.s=Math.min(Math.max(0,t[4]/100),1)),void 0!==t[5]&&(r.l=Math.min(Math.max(0,t[5]/100),1)),void 0!==t[6]?r.alpha=Math.max(0,Math.min(1,t[6]/100)):void 0!==t[7]&&(r.alpha=Math.max(0,Math.min(1,+t[7]))),r}],serialize:e=>`hsl(${void 0!==e.h?e.h:"none"} ${void 0!==e.s?100*e.s+"%":"none"} ${void 0!==e.l?100*e.l+"%":"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:wt,fixup:Lt},s:wt,l:wt,alpha:{use:wt,fixup:Mt}},difference:{h:Bt},average:{h:Wt}};function Mr({h:e,s:t,v:r,alpha:o}){e=jt(void 0!==e?e:0),void 0===t&&(t=0),void 0===r&&(r=0);let a,s=Math.abs(e/60%2-1);switch(Math.floor(e/60)){case 0:a={r:r,g:r*(1-t*s),b:r*(1-t)};break;case 1:a={r:r*(1-t*s),g:r,b:r*(1-t)};break;case 2:a={r:r*(1-t),g:r,b:r*(1-t*s)};break;case 3:a={r:r*(1-t),g:r*(1-t*s),b:r};break;case 4:a={r:r*(1-t*s),g:r*(1-t),b:r};break;case 5:a={r:r,g:r*(1-t),b:r*(1-t*s)};break;default:a={r:r*(1-t),g:r*(1-t),b:r*(1-t)}}return a.mode="rgb",void 0!==o&&(a.alpha=o),a}function Sr({r:e,g:t,b:r,alpha:o}){void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=Math.max(e,t,r),s=Math.min(e,t,r),i={mode:"hsv",s:0===a?0:1-s/a,v:a};return a-s!=0&&(i.h=60*(a===e?(t-r)/(a-s)+6*(t<r):a===t?(r-e)/(a-s)+2:(e-t)/(a-s)+4)),void 0!==o&&(i.alpha=o),i}const Cr={mode:"hsv",toMode:{rgb:Mr},parse:["--hsv"],serialize:"--hsv",fromMode:{rgb:Sr},channels:["h","s","v","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:wt,fixup:Lt},s:wt,v:wt,alpha:{use:wt,fixup:Mt}},difference:{h:Bt},average:{h:Wt}};const Ar={mode:"hwb",toMode:{rgb:function({h:e,w:t,b:r,alpha:o}){if(void 0===t&&(t=0),void 0===r&&(r=0),t+r>1){let e=t+r;t/=e,r/=e}return Mr({h:e,s:1===r?1:1-t/(1-r),v:1-r,alpha:o})}},fromMode:{rgb:function(e){let t=Sr(e);if(void 0===t)return;let r=void 0!==t.s?t.s:0,o=void 0!==t.v?t.v:0,a={mode:"hwb",w:(1-r)*o,b:1-o};return void 0!==t.h&&(a.h=t.h),void 0!==t.alpha&&(a.alpha=t.alpha),a}},channels:["h","w","b","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(e,t){if(!t||"hwb"!==t[0])return;const r={mode:"hwb"},[,o,a,s,i]=t;if(o.type!==ht.None){if(o.type===ht.Percentage)return;r.h=o.value}if(a.type!==ht.None){if(a.type===ht.Hue)return;r.w=a.value/100}if(s.type!==ht.None){if(s.type===ht.Hue)return;r.b=s.value/100}return i.type!==ht.None&&(r.alpha=Math.min(1,Math.max(0,i.type===ht.Number?i.value:i.value/100))),r}],serialize:e=>`hwb(${void 0!==e.h?e.h:"none"} ${void 0!==e.w?100*e.w+"%":"none"} ${void 0!==e.b?100*e.b+"%":"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:wt,fixup:Lt},w:wt,b:wt,alpha:{use:wt,fixup:Mt}},difference:{h:(e,t)=>{if(void 0===e.h||void 0===t.h)return 0;let r=jt(e.h),o=jt(t.h);return Math.abs(o-r)>180?r-(o-360*Math.sign(o-r)):o-r}},average:{h:Wt}},Nr=.1593017578125,Tr=78.84375,zr=.8359375,Er=18.8515625,Pr=18.6875;function Ir(e){if(e<0)return 0;const t=Math.pow(e,1/Tr);return 1e4*Math.pow(Math.max(0,t-zr)/(Er-Pr*t),1/Nr)}function Vr(e){if(e<0)return 0;const t=Math.pow(e/1e4,Nr);return Math.pow((zr+Er*t)/(1+Pr*t),Tr)}const Or=e=>Math.max(e/203,0),Dr=({i:e,t:t,p:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const a=Ir(e+.008609037037932761*t+.11102962500302593*r),s=Ir(e-.00860903703793275*t-.11102962500302599*r),i=Ir(e+.5600313357106791*t-.32062717498731885*r),n={mode:"xyz65",x:Or(2.070152218389422*a-1.3263473389671556*s+.2066510476294051*i),y:Or(.3647385209748074*a+.680566024947227*s-.0453045459220346*i),z:Or(-.049747207535812*a-.0492609666966138*s+1.1880659249923042*i)};return void 0!==o&&(n.alpha=o),n},jr=(e=0)=>Math.max(203*e,0),Lr=({x:e,y:t,z:r,alpha:o})=>{const a=jr(e),s=jr(t),i=jr(r),n=Vr(.3592832590121217*a+.6976051147779502*s-.0358915932320289*i),l=Vr(-.1920808463704995*a+1.1004767970374323*s+.0753748658519118*i),c=Vr(.0070797844607477*a+.0748396662186366*s+.8433265453898765*i),d={mode:"itp",i:.5*n+.5*l,t:1.61376953125*n-3.323486328125*l+1.709716796875*c,p:4.378173828125*n-4.24560546875*l-.132568359375*c};return void 0!==o&&(d.alpha=o),d},Hr={mode:"itp",channels:["i","t","p","alpha"],parse:["--ictcp"],serialize:"--ictcp",toMode:{xyz65:Dr,rgb:e=>Ot(Dr(e))},fromMode:{xyz65:Lr,rgb:e=>Lr(Pt(e))},ranges:{i:[0,.581],t:[-.369,.272],p:[-.164,.331]},interpolate:{i:wt,t:wt,p:wt,alpha:{use:wt,fixup:Mt}}},Rr=e=>{if(e<0)return 0;let t=Math.pow(e/1e4,Nr);return Math.pow((zr+Er*t)/(1+Pr*t),134.03437499999998)},Fr=(e=0)=>Math.max(203*e,0),qr=({x:e,y:t,z:r,alpha:o})=>{e=Fr(e),t=Fr(t);let a=1.15*e-.15*(r=Fr(r)),s=.66*t+.34*e,i=Rr(.41478972*a+.579999*s+.014648*r),n=Rr(-.20151*a+1.120649*s+.0531008*r),l=Rr(-.0166008*a+.2648*s+.6684799*r),c=(i+n)/2,d={mode:"jab",j:.44*c/(1-.56*c)-16295499532821565e-27,a:3.524*i-4.066708*n+.542708*l,b:.199076*i+1.096799*n-1.295875*l};return void 0!==o&&(d.alpha=o),d},Gr=16295499532821565e-27,Ur=e=>{if(e<0)return 0;let t=Math.pow(e,.007460772656268216);return 1e4*Math.pow((zr-t)/(Pr*t-Er),1/Nr)},Br=e=>e/203,Jr=({j:e,a:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=(e+Gr)/(.44+.56*(e+Gr)),s=Ur(a+.13860504*t+.058047316*r),i=Ur(a-.13860504*t-.058047316*r),n=Ur(a-.096019242*t-.8118919*r),l={mode:"xyz65",x:Br(1.661373024652174*s-.914523081304348*i+.23136208173913045*n),y:Br(-.3250758611844533*s+1.571847026732543*i-.21825383453227928*n),z:Br(-.090982811*s-.31272829*i+1.5227666*n)};return void 0!==o&&(l.alpha=o),l},Wr=e=>{let t=qr(Pt(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},Yr=e=>Ot(Jr(e)),Xr={mode:"jab",channels:["j","a","b","alpha"],parse:["--jzazbz"],serialize:"--jzazbz",fromMode:{rgb:Wr,xyz65:qr},toMode:{rgb:Yr,xyz65:Jr},ranges:{j:[0,.222],a:[-.109,.129],b:[-.185,.134]},interpolate:{j:wt,a:wt,b:wt,alpha:{use:wt,fixup:Mt}}},Kr=({j:e,a:t,b:r,alpha:o})=>{void 0===t&&(t=0),void 0===r&&(r=0);let a=Math.sqrt(t*t+r*r),s={mode:"jch",j:e,c:a};return a&&(s.h=jt(180*Math.atan2(r,t)/Math.PI)),void 0!==o&&(s.alpha=o),s},Zr=({j:e,c:t,h:r,alpha:o})=>{void 0===r&&(r=0);let a={mode:"jab",j:e,a:t?t*Math.cos(r/180*Math.PI):0,b:t?t*Math.sin(r/180*Math.PI):0};return void 0!==o&&(a.alpha=o),a},Qr={mode:"jch",parse:["--jzczhz"],serialize:"--jzczhz",toMode:{jab:Zr,rgb:e=>Yr(Zr(e))},fromMode:{rgb:e=>Kr(Wr(e)),jab:Kr},channels:["j","c","h","alpha"],ranges:{j:[0,.221],c:[0,.19],h:[0,360]},interpolate:{h:{use:wt,fixup:Lt},c:wt,j:wt,alpha:{use:wt,fixup:Mt}},difference:{h:Jt},average:{h:Wt}},eo=Math.pow(29,3)/Math.pow(3,3),to=Math.pow(6,3)/Math.pow(29,3);let ro=e=>Math.pow(e,3)>to?Math.pow(e,3):(116*e-16)/eo;const oo=({l:e,a:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=(e+16)/116,s=a-r/200,i={mode:"xyz50",x:ro(t/500+a)*er,y:ro(a)*tr,z:ro(s)*rr};return void 0!==o&&(i.alpha=o),i},ao=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=Vt({r:3.1341359569958707*e-1.6173863321612538*t-.4906619460083532*r,g:-.978795502912089*e+1.916254567259524*t+.03344273116131949*r,b:.07195537988411677*e-.2289768264158322*t+1.405386058324125*r});return void 0!==o&&(a.alpha=o),a},so=e=>ao(oo(e)),io=e=>{let{r:t,g:r,b:o,alpha:a}=Et(e),s={mode:"xyz50",x:.436065742824811*t+.3851514688337912*r+.14307845442264197*o,y:.22249319175623702*t+.7168870538238823*r+.06061979053616537*o,z:.013923904500943465*t+.09708128566574634*r+.7140993584005155*o};return void 0!==a&&(s.alpha=a),s},no=e=>e>to?Math.cbrt(e):(eo*e+16)/116,lo=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=no(e/er),s=no(t/tr),i={mode:"lab",l:116*s-16,a:500*(a-s),b:200*(s-no(r/rr))};return void 0!==o&&(i.alpha=o),i},co=e=>{let t=lo(io(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t};const ho={mode:"lab",toMode:{xyz50:oo,rgb:so},fromMode:{xyz50:lo,rgb:co},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-125,125],b:[-125,125]},parse:[function(e,t){if(!t||"lab"!==t[0])return;const r={mode:"lab"},[,o,a,s,i]=t;return o.type!==ht.Hue&&a.type!==ht.Hue&&s.type!==ht.Hue?(o.type!==ht.None&&(r.l=Math.min(Math.max(0,o.value),100)),a.type!==ht.None&&(r.a=a.type===ht.Number?a.value:125*a.value/100),s.type!==ht.None&&(r.b=s.type===ht.Number?s.value:125*s.value/100),i.type!==ht.None&&(r.alpha=Math.min(1,Math.max(0,i.type===ht.Number?i.value:i.value/100))),r):void 0}],serialize:e=>`lab(${void 0!==e.l?e.l:"none"} ${void 0!==e.a?e.a:"none"} ${void 0!==e.b?e.b:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{l:wt,a:wt,b:wt,alpha:{use:wt,fixup:Mt}}},uo={...ho,mode:"lab65",parse:["--lab-d65"],serialize:"--lab-d65",toMode:{xyz65:nr,rgb:lr},fromMode:{xyz65:dr,rgb:hr},ranges:{l:[0,100],a:[-125,125],b:[-125,125]}};const mo={mode:"lch",toMode:{lab:Kt,rgb:e=>so(Kt(e))},fromMode:{rgb:e=>Xt(co(e)),lab:Xt},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,150],h:[0,360]},parse:[function(e,t){if(!t||"lch"!==t[0])return;const r={mode:"lch"},[,o,a,s,i]=t;if(o.type!==ht.None){if(o.type===ht.Hue)return;r.l=Math.min(Math.max(0,o.value),100)}if(a.type!==ht.None&&(r.c=Math.max(0,a.type===ht.Number?a.value:150*a.value/100)),s.type!==ht.None){if(s.type===ht.Percentage)return;r.h=s.value}return i.type!==ht.None&&(r.alpha=Math.min(1,Math.max(0,i.type===ht.Number?i.value:i.value/100))),r}],serialize:e=>`lch(${void 0!==e.l?e.l:"none"} ${void 0!==e.c?e.c:"none"} ${void 0!==e.h?e.h:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:wt,fixup:Lt},c:wt,l:wt,alpha:{use:wt,fixup:Mt}},difference:{h:Jt},average:{h:Wt}},po={...mo,mode:"lch65",parse:["--lch-d65"],serialize:"--lch-d65",toMode:{lab65:e=>Kt(e,"lab65"),rgb:e=>lr(Kt(e,"lab65"))},fromMode:{rgb:e=>Xt(hr(e),"lch65"),lab65:e=>Xt(e,"lch65")},ranges:{l:[0,100],c:[0,150],h:[0,360]}},go=({l:e,u:t,v:r,alpha:o})=>{void 0===t&&(t=0),void 0===r&&(r=0);let a=Math.sqrt(t*t+r*r),s={mode:"lchuv",l:e,c:a};return a&&(s.h=jt(180*Math.atan2(r,t)/Math.PI)),void 0!==o&&(s.alpha=o),s},bo=({l:e,c:t,h:r,alpha:o})=>{void 0===r&&(r=0);let a={mode:"luv",l:e,u:t?t*Math.cos(r/180*Math.PI):0,v:t?t*Math.sin(r/180*Math.PI):0};return void 0!==o&&(a.alpha=o),a},fo=(e,t,r)=>4*e/(e+15*t+3*r),yo=(e,t,r)=>9*t/(e+15*t+3*r),vo=fo(er,tr,rr),_o=yo(er,tr,rr),xo=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=(s=t/tr)<=to?eo*s:116*Math.cbrt(s)-16;var s;let i=fo(e,t,r),n=yo(e,t,r);isFinite(i)&&isFinite(n)?(i=13*a*(i-vo),n=13*a*(n-_o)):a=i=n=0;let l={mode:"luv",l:a,u:i,v:n};return void 0!==o&&(l.alpha=o),l},$o=((e,t,r)=>4*e/(e+15*t+3*r))(er,tr,rr),wo=((e,t,r)=>9*t/(e+15*t+3*r))(er,tr,rr),ko=({l:e,u:t,v:r,alpha:o})=>{if(void 0===e&&(e=0),0===e)return{mode:"xyz50",x:0,y:0,z:0};void 0===t&&(t=0),void 0===r&&(r=0);let a=t/(13*e)+$o,s=r/(13*e)+wo,i=tr*(e<=8?e/eo:Math.pow((e+16)/116,3)),n={mode:"xyz50",x:i*(9*a)/(4*s),y:i,z:i*(12-3*a-20*s)/(4*s)};return void 0!==o&&(n.alpha=o),n},Mo={mode:"lchuv",toMode:{luv:bo,rgb:e=>ao(ko(bo(e)))},fromMode:{rgb:e=>go(xo(io(e))),luv:go},channels:["l","c","h","alpha"],parse:["--lchuv"],serialize:"--lchuv",ranges:{l:[0,100],c:[0,176.956],h:[0,360]},interpolate:{h:{use:wt,fixup:Lt},c:wt,l:wt,alpha:{use:wt,fixup:Mt}},difference:{h:Jt},average:{h:Wt}},So={...St,mode:"lrgb",toMode:{rgb:Vt},fromMode:{rgb:Et},parse:["srgb-linear"],serialize:"srgb-linear"},Co={mode:"luv",toMode:{xyz50:ko,rgb:e=>ao(ko(e))},fromMode:{xyz50:xo,rgb:e=>xo(io(e))},channels:["l","u","v","alpha"],parse:["--luv"],serialize:"--luv",ranges:{l:[0,100],u:[-84.936,175.042],v:[-125.882,87.243]},interpolate:{l:wt,u:wt,v:wt,alpha:{use:wt,fixup:Mt}}},Ao=({r:e,g:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=Math.cbrt(.412221469470763*e+.5363325372617348*t+.0514459932675022*r),s=Math.cbrt(.2119034958178252*e+.6806995506452344*t+.1073969535369406*r),i=Math.cbrt(.0883024591900564*e+.2817188391361215*t+.6299787016738222*r),n={mode:"oklab",l:.210454268309314*a+.7936177747023054*s-.0040720430116193*i,a:1.9779985324311684*a-2.42859224204858*s+.450593709617411*i,b:.0259040424655478*a+.7827717124575296*s-.8086757549230774*i};return void 0!==o&&(n.alpha=o),n},No=e=>{let t=Ao(Et(e));return e.r===e.b&&e.b===e.g&&(t.a=t.b=0),t},To=({l:e,a:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=Math.pow(e+.3963377773761749*t+.2158037573099136*r,3),s=Math.pow(e-.1055613458156586*t-.0638541728258133*r,3),i=Math.pow(e-.0894841775298119*t-1.2914855480194092*r,3),n={mode:"lrgb",r:4.076741636075957*a-3.3077115392580616*s+.2309699031821044*i,g:-1.2684379732850317*a+2.6097573492876887*s-.3413193760026573*i,b:-.0041960761386756*a-.7034186179359362*s+1.7076146940746117*i};return void 0!==o&&(n.alpha=o),n},zo=e=>Vt(To(e));function Eo(e){const t=.206,r=1.206/1.03;return.5*(r*e-t+Math.sqrt((r*e-t)*(r*e-t)+.12*r*e))}function Po(e){return(e*e+.206*e)/(1.206/1.03*(e+.03))}function Io(e,t){let r=function(e,t){let r,o,a,s,i,n,l,c;-1.88170328*e-.80936493*t>1?(r=1.19086277,o=1.76576728,a=.59662641,s=.75515197,i=.56771245,n=4.0767416621,l=-3.3077115913,c=.2309699292):1.81444104*e-1.19445276*t>1?(r=.73956515,o=-.45954404,a=.08285427,s=.1254107,i=.14503204,n=-1.2684380046,l=2.6097574011,c=-.3413193965):(r=1.35733652,o=-.00915799,a=-1.1513021,s=-.50559606,i=.00692167,n=-.0041960863,l=-.7034186147,c=1.707614701);let d=r+o*e+a*t+s*e*e+i*e*t,h=.3963377774*e+.2158037573*t,u=-.1055613458*e-.0638541728*t,m=-.0894841775*e-1.291485548*t;{let e=1+d*h,t=1+d*u,r=1+d*m,o=n*(e*e*e)+l*(t*t*t)+c*(r*r*r),a=n*(3*h*e*e)+l*(3*u*t*t)+c*(3*m*r*r);d-=o*a/(a*a-.5*o*(n*(6*h*h*e)+l*(6*u*u*t)+c*(6*m*m*r)))}return d}(e,t),o=To({l:1,a:r*e,b:r*t}),a=Math.cbrt(1/Math.max(o.r,o.g,o.b));return[a,a*r]}function Vo(e,t,r=null){r||(r=Io(e,t));let o=r[0],a=r[1];return[a/o,a/(1-o)]}function Oo(e,t,r){let o=Io(t,r),a=function(e,t,r,o,a,s=null){let i;if(s||(s=Io(e,t)),(r-a)*s[1]-(s[0]-a)*o<=0)i=s[1]*a/(o*s[0]+s[1]*(a-r));else{i=s[1]*(a-1)/(o*(s[0]-1)+s[1]*(a-r));{let s=r-a,n=.3963377774*e+.2158037573*t,l=-.1055613458*e-.0638541728*t,c=-.0894841775*e-1.291485548*t,d=s+o*n,h=s+o*l,u=s+o*c;{let e=a*(1-i)+i*r,t=i*o,s=e+t*n,m=e+t*l,p=e+t*c,g=s*s*s,b=m*m*m,f=p*p*p,y=3*d*s*s,v=3*h*m*m,_=3*u*p*p,x=6*d*d*s,$=6*h*h*m,w=6*u*u*p,k=4.0767416621*g-3.3077115913*b+.2309699292*f-1,M=4.0767416621*y-3.3077115913*v+.2309699292*_,S=M/(M*M-.5*k*(4.0767416621*x-3.3077115913*$+.2309699292*w)),C=-k*S,A=-1.2684380046*g+2.6097574011*b-.3413193965*f-1,N=-1.2684380046*y+2.6097574011*v-.3413193965*_,T=N/(N*N-.5*A*(-1.2684380046*x+2.6097574011*$-.3413193965*w)),z=-A*T,E=-.0041960863*g-.7034186147*b+1.707614701*f-1,P=-.0041960863*y-.7034186147*v+1.707614701*_,I=P/(P*P-.5*E*(-.0041960863*x-.7034186147*$+1.707614701*w)),V=-E*I;C=S>=0?C:1e6,z=T>=0?z:1e6,V=I>=0?V:1e6,i+=Math.min(C,Math.min(z,V))}}}return i}(t,r,e,1,e,o),s=Vo(t,r,o),i=e*(.11516993+1/(7.4477897+4.1590124*r+t*(1.75198401*r-2.19557347+t*(-2.13704948-10.02301043*r+t*(5.38770819*r-4.24894561+4.69891013*t))))),n=(1-e)*(.11239642+1/(1.6132032-.68124379*r+t*(.40370612+.90148123*r+t*(.6122399*r-.27087943+t*(.00299215-.45399568*r-.14661872*t))))),l=.9*(a/Math.min(e*s[0],(1-e)*s[1]))*Math.sqrt(Math.sqrt(1/(1/(i*i*i*i)+1/(n*n*n*n))));return i=.4*e,n=.8*(1-e),[Math.sqrt(1/(1/(i*i)+1/(n*n))),l,a]}function Do(e){const t=void 0!==e.l?e.l:0,r=void 0!==e.a?e.a:0,o=void 0!==e.b?e.b:0,a={mode:"okhsl",l:Eo(t)};void 0!==e.alpha&&(a.alpha=e.alpha);let s=Math.sqrt(r*r+o*o);if(!s)return a.s=0,a;let i,[n,l,c]=Oo(t,r/s,o/s);if(s<l){let e=0,t=.8*n;i=.8*((s-e)/(t+(1-t/l)*(s-e)))}else{let e=.2*l*l*1.25*1.25/n;i=.8+.2*((s-l)/(e+(1-e/(c-l))*(s-l)))}return i&&(a.s=i,a.h=jt(180*Math.atan2(o,r)/Math.PI)),a}function jo(e){let t=void 0!==e.h?e.h:0,r=void 0!==e.s?e.s:0,o=void 0!==e.l?e.l:0;const a={mode:"oklab",l:Po(o)};if(void 0!==e.alpha&&(a.alpha=e.alpha),!r||1===o)return a.a=a.b=0,a;let s,i,n,l,c=Math.cos(t/180*Math.PI),d=Math.sin(t/180*Math.PI),[h,u,m]=Oo(a.l,c,d);r<.8?(s=1.25*r,i=0,n=.8*h,l=1-n/u):(s=5*(r-.8),i=u,n=.2*u*u*1.25*1.25/h,l=1-n/(m-u));let p=i+s*n/(1-l*s);return a.a=p*c,a.b=p*d,a}const Lo={...kr,mode:"okhsl",channels:["h","s","l","alpha"],parse:["--okhsl"],serialize:"--okhsl",fromMode:{oklab:Do,rgb:e=>Do(No(e))},toMode:{oklab:jo,rgb:e=>zo(jo(e))}};function Ho(e){let t=void 0!==e.l?e.l:0,r=void 0!==e.a?e.a:0,o=void 0!==e.b?e.b:0,a=Math.sqrt(r*r+o*o),s=a?r/a:1,i=a?o/a:1,[n,l]=Vo(s,i),c=1-.5/n,d=l/(a+t*l),h=d*t,u=d*a,m=Po(h),p=u*m/h,g=To({l:m,a:s*p,b:i*p}),b=Math.cbrt(1/Math.max(g.r,g.g,g.b,0));t/=b,a=a/b*Eo(t)/t,t=Eo(t);const f={mode:"okhsv",s:a?(.5+l)*u/(.5*l+l*c*u):0,v:t?t/h:0};return f.s&&(f.h=jt(180*Math.atan2(o,r)/Math.PI)),void 0!==e.alpha&&(f.alpha=e.alpha),f}function Ro(e){const t={mode:"oklab"};void 0!==e.alpha&&(t.alpha=e.alpha);const r=void 0!==e.h?e.h:0,o=void 0!==e.s?e.s:0,a=void 0!==e.v?e.v:0,s=Math.cos(r/180*Math.PI),i=Math.sin(r/180*Math.PI),[n,l]=Vo(s,i),c=.5,d=1-c/n,h=1-o*c/(c+l-l*d*o),u=o*l*c/(c+l-l*d*o),m=Po(h),p=u*m/h,g=To({l:m,a:s*p,b:i*p}),b=Math.cbrt(1/Math.max(g.r,g.g,g.b,0)),f=Po(a*h),y=u*f/h;return t.l=f*b,t.a=y*s*b,t.b=y*i*b,t}const Fo={...Cr,mode:"okhsv",channels:["h","s","v","alpha"],parse:["--okhsv"],serialize:"--okhsv",fromMode:{oklab:Ho,rgb:e=>Ho(No(e))},toMode:{oklab:Ro,rgb:e=>zo(Ro(e))}};const qo={...ho,mode:"oklab",toMode:{lrgb:To,rgb:zo},fromMode:{lrgb:Ao,rgb:No},ranges:{l:[0,1],a:[-.4,.4],b:[-.4,.4]},parse:[function(e,t){if(!t||"oklab"!==t[0])return;const r={mode:"oklab"},[,o,a,s,i]=t;return o.type!==ht.Hue&&a.type!==ht.Hue&&s.type!==ht.Hue?(o.type!==ht.None&&(r.l=Math.min(Math.max(0,o.type===ht.Number?o.value:o.value/100),1)),a.type!==ht.None&&(r.a=a.type===ht.Number?a.value:.4*a.value/100),s.type!==ht.None&&(r.b=s.type===ht.Number?s.value:.4*s.value/100),i.type!==ht.None&&(r.alpha=Math.min(1,Math.max(0,i.type===ht.Number?i.value:i.value/100))),r):void 0}],serialize:e=>`oklab(${void 0!==e.l?e.l:"none"} ${void 0!==e.a?e.a:"none"} ${void 0!==e.b?e.b:"none"}${e.alpha<1?` / ${e.alpha}`:""})`};const Go={...mo,mode:"oklch",toMode:{oklab:e=>Kt(e,"oklab"),rgb:e=>zo(Kt(e,"oklab"))},fromMode:{rgb:e=>Xt(No(e),"oklch"),oklab:e=>Xt(e,"oklch")},parse:[function(e,t){if(!t||"oklch"!==t[0])return;const r={mode:"oklch"},[,o,a,s,i]=t;if(o.type!==ht.None){if(o.type===ht.Hue)return;r.l=Math.min(Math.max(0,o.type===ht.Number?o.value:o.value/100),1)}if(a.type!==ht.None&&(r.c=Math.max(0,a.type===ht.Number?a.value:.4*a.value/100)),s.type!==ht.None){if(s.type===ht.Percentage)return;r.h=s.value}return i.type!==ht.None&&(r.alpha=Math.min(1,Math.max(0,i.type===ht.Number?i.value:i.value/100))),r}],serialize:e=>`oklch(${void 0!==e.l?e.l:"none"} ${void 0!==e.c?e.c:"none"} ${void 0!==e.h?e.h:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,ranges:{l:[0,1],c:[0,.4],h:[0,360]}},Uo=e=>{let{r:t,g:r,b:o,alpha:a}=Et(e),s={mode:"xyz65",x:.486570948648216*t+.265667693169093*r+.1982172852343625*o,y:.2289745640697487*t+.6917385218365062*r+.079286914093745*o,z:0*t+.0451133818589026*r+1.043944368900976*o};return void 0!==a&&(s.alpha=a),s},Bo=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a=Vt({r:2.4934969119414263*e-.9313836179191242*t-.402710784450717*r,g:-.8294889695615749*e+1.7626640603183465*t+.0236246858419436*r,b:.0358458302437845*e-.0761723892680418*t+.9568845240076871*r},"p3");return void 0!==o&&(a.alpha=o),a},Jo={...St,mode:"p3",parse:["display-p3"],serialize:"display-p3",fromMode:{rgb:e=>Bo(Pt(e)),xyz65:Bo},toMode:{rgb:e=>Ot(Uo(e)),xyz65:Uo}},Wo=e=>{let t=Math.abs(e);return t>=1/512?Math.sign(e)*Math.pow(t,1/1.8):16*e},Yo=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a={mode:"prophoto",r:Wo(1.3457868816471585*e-.2555720873797946*t-.0511018649755453*r),g:Wo(-.5446307051249019*e+1.5082477428451466*t+.0205274474364214*r),b:Wo(0*e+0*t+1.2119675456389452*r)};return void 0!==o&&(a.alpha=o),a},Xo=(e=0)=>{let t=Math.abs(e);return t>=16/512?Math.sign(e)*Math.pow(t,1.8):e/16},Ko=e=>{let t=Xo(e.r),r=Xo(e.g),o=Xo(e.b),a={mode:"xyz50",x:.7977666449006423*t+.1351812974005331*r+.0313477341283922*o,y:.2880748288194013*t+.7118352342418731*r+899369387256e-16*o,z:0*t+0*r+.8251046025104602*o};return void 0!==e.alpha&&(a.alpha=e.alpha),a},Zo={...St,mode:"prophoto",parse:["prophoto-rgb"],serialize:"prophoto-rgb",fromMode:{xyz50:Yo,rgb:e=>Yo(io(e))},toMode:{xyz50:Ko,rgb:e=>ao(Ko(e))}},Qo=1.09929682680944,ea=e=>{const t=Math.abs(e);return t>.018053968510807?(Math.sign(e)||1)*(Qo*Math.pow(t,.45)-(Qo-1)):4.5*e},ta=({x:e,y:t,z:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);let a={mode:"rec2020",r:ea(1.7166511879712683*e-.3556707837763925*t-.2533662813736599*r),g:ea(-.6666843518324893*e+1.6164812366349395*t+.0157685458139111*r),b:ea(.0176398574453108*e-.0427706132578085*t+.9421031212354739*r)};return void 0!==o&&(a.alpha=o),a},ra=1.09929682680944,oa=(e=0)=>{let t=Math.abs(e);return t<.08124285829863151?e/4.5:(Math.sign(e)||1)*Math.pow((t+ra-1)/ra,1/.45)},aa=e=>{let t=oa(e.r),r=oa(e.g),o=oa(e.b),a={mode:"xyz65",x:.6369580483012911*t+.1446169035862083*r+.1688809751641721*o,y:.262700212011267*t+.6779980715188708*r+.059301716469862*o,z:0*t+.0280726930490874*r+1.0609850577107909*o};return void 0!==e.alpha&&(a.alpha=e.alpha),a},sa={...St,mode:"rec2020",fromMode:{xyz65:ta,rgb:e=>ta(Pt(e))},toMode:{xyz65:aa,rgb:e=>Ot(aa(e))},parse:["rec2020"],serialize:"rec2020"},ia=.0037930732552754493,na=Math.cbrt(ia),la=e=>Math.cbrt(e)-na,ca=e=>Math.pow(e+na,3),da={mode:"xyb",channels:["x","y","b","alpha"],parse:["--xyb"],serialize:"--xyb",toMode:{rgb:({x:e,y:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const a=ca(e+t)-ia,s=ca(t-e)-ia,i=ca(r+t)-ia,n=Vt({r:11.031566904639861*a-9.866943908131562*s-.16462299650829934*i,g:-3.2541473810744237*a+4.418770377582723*s-.16462299650829934*i,b:-3.6588512867136815*a+2.7129230459360922*s+1.9459282407775895*i});return void 0!==o&&(n.alpha=o),n}},fromMode:{rgb:e=>{const{r:t,g:r,b:o,alpha:a}=Et(e),s=la(.3*t+.622*r+.078*o+ia),i=la(.23*t+.692*r+.078*o+ia),n={mode:"xyb",x:(s-i)/2,y:(s+i)/2,b:la(.2434226892454782*t+.2047674442449682*r+.5518098665095535*o+ia)-(s+i)/2};return void 0!==a&&(n.alpha=a),n}},ranges:{x:[-.0154,.0281],y:[0,.8453],b:[-.2778,.388]},interpolate:{x:wt,y:wt,b:wt,alpha:{use:wt,fixup:Mt}}},ha={mode:"xyz50",parse:["xyz-d50"],serialize:"xyz-d50",toMode:{rgb:ao,lab:lo},fromMode:{rgb:io,lab:oo},channels:["x","y","z","alpha"],ranges:{x:[0,.964],y:[0,.999],z:[0,.825]},interpolate:{x:wt,y:wt,z:wt,alpha:{use:wt,fixup:Mt}}},ua={mode:"xyz65",toMode:{rgb:Ot,xyz50:e=>{let{x:t,y:r,z:o,alpha:a}=e;void 0===t&&(t=0),void 0===r&&(r=0),void 0===o&&(o=0);let s={mode:"xyz50",x:1.0479298208405488*t+.0229467933410191*r-.0501922295431356*o,y:.0296278156881593*t+.990434484573249*r-.0170738250293851*o,z:-.0092430581525912*t+.0150551448965779*r+.7518742899580008*o};return void 0!==a&&(s.alpha=a),s}},fromMode:{rgb:Pt,xyz50:e=>{let{x:t,y:r,z:o,alpha:a}=e;void 0===t&&(t=0),void 0===r&&(r=0),void 0===o&&(o=0);let s={mode:"xyz65",x:.9554734527042182*t-.0230985368742614*r+.0632593086610217*o,y:-.0283697069632081*t+1.0099954580058226*r+.021041398966943*o,z:.0123140016883199*t-.0205076964334779*r+1.3303659366080753*o};return void 0!==a&&(s.alpha=a),s}},ranges:{x:[0,.95],y:[0,1],z:[0,1.088]},channels:["x","y","z","alpha"],parse:["xyz","xyz-d65"],serialize:"xyz-d65",interpolate:{x:wt,y:wt,z:wt,alpha:{use:wt,fixup:Mt}}},ma={mode:"yiq",toMode:{rgb:({y:e,i:t,q:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const a={mode:"rgb",r:e+.95608445*t+.6208885*r,g:e-.27137664*t-.6486059*r,b:e-1.10561724*t+1.70250126*r};return void 0!==o&&(a.alpha=o),a}},fromMode:{rgb:({r:e,g:t,b:r,alpha:o})=>{void 0===e&&(e=0),void 0===t&&(t=0),void 0===r&&(r=0);const a={mode:"yiq",y:.29889531*e+.58662247*t+.11448223*r,i:.59597799*e-.2741761*t-.32180189*r,q:.21147017*e-.52261711*t+.31114694*r};return void 0!==o&&(a.alpha=o),a}},channels:["y","i","q","alpha"],parse:["--yiq"],serialize:"--yiq",ranges:{i:[-.595,.595],q:[-.522,.522]},interpolate:{y:wt,i:wt,q:wt,alpha:{use:wt,fixup:Mt}}};nt(Dt),nt(Yt),nt(_r),nt(xr),nt($r),nt(kr),nt(Cr),nt(Ar),nt(Hr),nt(Xr),nt(Qr),nt(ho),nt(uo),nt(mo),nt(po),nt(Mo),nt(So),nt(Co),nt(Lo),nt(Fo),nt(qo),nt(Go),nt(Jo),nt(Zo),nt(sa),nt(St),nt(da),nt(ha),nt(ua),nt(ma);const pa=e=>{const t=Math.round(Math.min(Math.max(e,0),255)).toString(16);return 1===t.length?`0${t}`:t},ga=e=>`#${pa(e[0])}${pa(e[1])}${pa(e[2])}`,ba=e=>{const[t,r,o]=e,a=Math.max(t,r,o),s=a-Math.min(t,r,o),i=s&&(a===t?(r-o)/s:a===r?2+(o-t)/s:4+(t-r)/s);return[60*(i<0?i+6:i),a&&s/a,a]},fa=e=>{const[t,r,o]=e,a=e=>{const a=(e+t/60)%6;return o-o*r*Math.max(Math.min(a,4-a,1),0)};return[a(5),a(3),a(1)]},ya=e=>fa([e[0],e[1],255]),va=(e,t,r)=>Math.min(Math.max(e,t),r),_a=e=>{const t=e/100;return[Math.round(xa(t)),Math.round($a(t)),Math.round(wa(t))]},xa=e=>{if(e<=66)return 255;return va(329.698727446*(e-60)**-.1332047592,0,255)},$a=e=>{let t;return t=e<=66?99.4708025861*Math.log(e)-161.1195681661:288.1221695283*(e-60)**-.0755148492,va(t,0,255)},wa=e=>{if(e>=66)return 255;if(e<=19)return 0;const t=138.5177312231*Math.log(e-10)-305.0447927307;return va(t,0,255)},ka=(e,t)=>{const r=Math.max(...e),o=Math.max(...t);let a;return a=0===o?0:r/o,t.map((e=>Math.round(e*a)))},Ma=e=>0===e?1e6:Math.floor(1e6/e),Sa=(e,t,r)=>{const[o,a,s,i,n]=e,l=Ma(t??2700),c=Ma(r??6500),d=l-c;let h;try{h=n/(i+n)}catch(v){h=.5}const u=c+h*d,m=u?0===(p=u)?1e6:Math.floor(1e6/p):0;var p;const[g,b,f]=_a(m),y=Math.max(i,n)/255;return ka([o,a,s,i,n],[o+g*y,a+b*y,s+f*y])};const Ca=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater","weather"]),Aa=(e,t)=>{if((void 0!==t?t:e?.state)===Pe)return"var(--state-unavailable-color)";const r=za(e,t);return r?(o=r,Array.isArray(o)?o.reverse().reduce(((e,t)=>`var(${t}${e?`, ${e}`:""})`),void 0):`var(${o})`):void 0;var o},Na=(e,t,r)=>{const o=void 0!==r?r:t.state,a=function(e,t){const r=_e(e.entity_id),o=void 0!==t?t:e?.state;if(["button","event","infrared","input_button","radio_frequency","scene"].includes(r))return o!==Pe;if(Ie(o))return!1;if("off"===o&&"alert"!==r)return!1;switch(r){case"alarm_control_panel":return"disarmed"!==o;case"alert":return"idle"!==o;case"cover":case"valve":return"closed"!==o;case"device_tracker":case"person":return"not_home"!==o;case"lawn_mower":return!["docked","paused"].includes(o);case"lock":return"locked"!==o;case"media_player":return"standby"!==o;case"vacuum":return!["idle","docked","paused"].includes(o);case"plant":return"problem"===o;case"group":return["on","home","open","locked","problem"].includes(o);case"timer":return"active"===o;case"camera":return"streaming"===o}return!0}(t,r);return Ta(e,t.attributes.device_class,o,a)},Ta=(e,t,r,o)=>{const a=[],s=((e,t="_")=>{const r="àáâäæãåāăąабçćčđďдèéêëēėęěеёэфğǵгḧхîïíīįìıİийкłлḿмñńǹňнôöòóœøōõőоṕпŕřрßśšşșсťțтûüùúūǘůűųувẃẍÿýыžźżз·",o=`aaaaaaaaaaabcccdddeeeeeeeeeeefggghhiiiiiiiiijkllmmnnnnnoooooooooopprrrsssssstttuuuuuuuuuuvwxyyyzzzz${t}`,a=new RegExp(r.split("").join("|"),"g"),s={"ж":"zh","х":"kh","ц":"ts","ч":"ch","ш":"sh","щ":"shch","ю":"iu","я":"ia"};let i;return""===e?i="":(i=e.toString().toLowerCase().replace(a,(e=>o.charAt(r.indexOf(e)))).replace(/[а-я]/g,(e=>s[e]||"")).replace(/(\d),(?=\d)/g,"$1").replace(/[^a-z0-9]+/g,t).replace(new RegExp(`(${t})\\1+`,"g"),"$1").replace(new RegExp(`^${t}+`),"").replace(new RegExp(`${t}+$`),""),""===i&&(i="unknown")),i})(r,"_"),i=o?"active":"inactive";return t&&a.push(`--state-${e}-${t}-${s}-color`),a.push(`--state-${e}-${s}-color`,`--state-${e}-${i}-color`,`--state-${i}-color`),a},za=(e,t)=>{const r=void 0!==t?t:e?.state,o=_e(e.entity_id),a=e.attributes.device_class;if("sensor"===o&&"battery"===a){const e=(e=>{const t=Number(e);if(!isNaN(t))return t>=70?"--state-sensor-battery-high-color":t>=30?"--state-sensor-battery-medium-color":"--state-sensor-battery-low-color"})(r);if(e)return[e]}if("group"===o){const r=(e=>{const t=e.attributes.entity_id||[],r=[...new Set(t.map((e=>_e(e))))];return 1===r.length?r[0]:void 0})(e);if(r&&Ca.has(r))return Na(r,e,t)}if(Ca.has(o))return Na(o,e,t)};var Ea;!function(e){e[e.TARGET_TEMPERATURE=1]="TARGET_TEMPERATURE",e[e.TARGET_TEMPERATURE_RANGE=2]="TARGET_TEMPERATURE_RANGE",e[e.TARGET_HUMIDITY=4]="TARGET_HUMIDITY",e[e.FAN_MODE=8]="FAN_MODE",e[e.PRESET_MODE=16]="PRESET_MODE",e[e.SWING_MODE=32]="SWING_MODE",e[e.AUX_HEAT=64]="AUX_HEAT",e[e.TURN_OFF=128]="TURN_OFF",e[e.TURN_ON=256]="TURN_ON",e[e.SWING_HORIZONTAL_MODE=512]="SWING_HORIZONTAL_MODE"}(Ea||(Ea={})),["auto","heat_cool","heat","cool","dry","fan_only","off"].reduce(((e,t,r)=>(e[t]=r,e)),{});const Pa={cooling:"cool",defrosting:"heat",drying:"dry",fan:"fan_only",heating:"heat",idle:"off",off:"off",preheating:"heat"};class Ia{static{Ia.colorCache={},Ia.element=void 0}static _prefixKeys(e){let t={};return Object.keys(e).forEach((r=>{const o=`--${r}`,a=String(e[r]);t[o]=`${a}`})),t}static processTheme(e){let t={},r={},o={},a={};const{modes:s,...i}=e;return s&&(r={...i,...s.dark},t={...i,...s.light}),o=Ia._prefixKeys(t),a=Ia._prefixKeys(r),{themeLight:o,themeDark:a}}static processPalette(e){let t={},r={},o={},a={},s={};return Object.values(e).forEach((e=>{const{modes:a,...s}=e;t={...t,...s},a&&(o={...o,...s,...a.dark},r={...r,...s,...a.light})})),a=Ia._prefixKeys(r),s=Ia._prefixKeys(o),{paletteLight:a,paletteDark:s}}static setElement(e){Ia.element=e}static calculateColor(e,t,r){const o=Object.keys(t).map((e=>Number(e))).sort(((e,t)=>e-t));let a,s,i;const n=o.length;if(e<=o[0])return t[o[0]];if(e>=o[n-1])return t[o[n-1]];for(let l=0;l<n-1;l++){const n=o[l],c=o[l+1];if(e>=n&&e<c){if([a,s]=[t[n],t[c]],!r)return a;i=Ia.calculateValueBetween(n,c,e);break}}return Ia.getGradientValue(a,s,i)}static calculateColor2(e,t,r,o,a){const s=Object.keys(t).map((e=>Number(e))).sort(((e,t)=>e-t));let i,n,l;const c=s.length;if(e<=s[0])return t[s[0]];if(e>=s[c-1])return t[s[c-1]];for(let d=0;d<c-1;d++){const c=s[d],h=s[d+1];if(e>=c&&e<h){if([i,n]=[t[c].styles[r][o],t[h].styles[r][o]],!a)return i;l=Ia.calculateValueBetween(c,h,e);break}}return Ia.getGradientValue(i,n,l)}static calculateValueBetween(e,t,r){return(Math.min(Math.max(r,e),t)-e)/(t-e)}static getLovelacePanel(){var e=window.document.querySelector("home-assistant");return(e=(e=(e=(e=(e=(e=e&&e.shadowRoot)&&e.querySelector("home-assistant-main"))&&e.shadowRoot)&&e.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"))&&e.shadowRoot||e)&&e.querySelector("ha-panel-lovelace"))||null}static calculateStrokeColor(e,t,r){const o=t?.colors??[];if(!o.length)return;const a=Number(e);if(!Number.isFinite(a))return o[0].color;if(a<=o[0].value)return o[0].color;const s=o[o.length-1];if(a>=s.value)return s.color;for(let i=0;i<o.length-1;i+=1){const e=o[i],t=o[i+1];if(a>=e.value&&a<t.value){if(!r)return e.color;const o=Ia.calculateValueBetween(e.value,t.value,a);return Ia.getGradientValue(e.color,t.color,o)}}return s.color}static resolveColorVariable(e){const t=this.element.style.getPropertyValue(e).trim();console.log("rawValue for ",e,":",t);let r=t;if(t.startsWith("var(")){const e=t.replace(/^var\((--.*?)\)$/,"$1").trim(),o=window.getComputedStyle(document.body).getPropertyValue(e).trim();r=o,console.log("De echte kleur is:",o)}else console.log("De echte kleur is:",t);return r}static resolveColorVariableV1(e){const t=document.createElement("span");t.style.color=e,Ia.element.appendChild(t);const r=getComputedStyle(t).color;return t.remove(),r}static getColorVariable(e){const t=e.slice(4,-1).trim(),r=getComputedStyle(Ia.element).getPropertyValue(t).trim();if(console.log("getColorVariable - ",e,t,r,Ia.element),r)return r;this.lovelace||(this.lovelace=Ia.getLovelacePanel());const o=getComputedStyle(this.lovelace).getPropertyValue(t).trim();return console.log("getColorVariable - ll",e,t,r,o,Ia.element),o}static getColorVariableV6(e){const t=e.slice(4,-1).trim();if(t.startsWith("--fhc-")){const r=getComputedStyle(Ia.element).getPropertyValue(t).trim();return console.log("getColorVariable - ",e,t,r,Ia.element),r}return this.lovelace||(this.lovelace=Ia.getLovelacePanel()),getComputedStyle(this.lovelace).getPropertyValue(t).trim()}static getColorVariableV5(e){const t=e.slice(4,-1).trim(),r=Ia.element?.style?.getPropertyValue(t)?.trim();if(r)return r;const o=Ia.element?getComputedStyle(Ia.element).getPropertyValue(t).trim():"";return o||(this.lovelace||(this.lovelace=Ia.getLovelacePanel()),getComputedStyle(this.lovelace).getPropertyValue(t).trim())}static getColorVariableV4(e){const t=e.slice(4,-1).trim(),r=Ia.element?getComputedStyle(Ia.element).getPropertyValue(t).trim():"";return console.log("Colors.element",Ia.element),console.log("elementValue",t,r),r||(this.lovelace||(this.lovelace=Ia.getLovelacePanel()),getComputedStyle(this.lovelace).getPropertyValue(t).trim())}static getColorVariableV3(e){const t=e.slice(4,-1).trim();return console.log("getColorVariable - ",e,t),t.startsWith("--fhc-")?getComputedStyle(Ia.element).getPropertyValue(t).trim():Ia.getLovelaceColorVariable(e)}static getLovelaceColorVariable(e){const t=e.substr(4,e.length-5);this.lovelace||(this.lovelace=Ia.getLovelacePanel());return window.getComputedStyle(this.lovelace).getPropertyValue(t)}static getColorVariableV2(e){const t=e.substr(4,e.length-5);this.lovelace||(this.lovelace=Ia.getLovelacePanel());return window.getComputedStyle(this.lovelace).getPropertyValue(t)}static getColorVariableV1(e){const t=e.substr(4,e.length-5);return window.getComputedStyle(Ia.element).getPropertyValue(t)}static getGradientValue(e,t,r){const o=Ia.colorToRGBA(e),a=Ia.colorToRGBA(t),s=1-r,i=r,n=Math.floor(o[0]*s+a[0]*i),l=Math.floor(o[1]*s+a[1]*i),c=Math.floor(o[2]*s+a[2]*i),d=Math.floor(o[3]*s+a[3]*i);return`#${Ia.padZero(n.toString(16))}${Ia.padZero(l.toString(16))}${Ia.padZero(c.toString(16))}${Ia.padZero(d.toString(16))}`}static padZero(e){return e.length<2&&(e=`0${e}`),e.substr(0,2)}static resolveColorVariableV0(e){let t=e;for(;"string"==typeof t&&t.trim().startsWith("var(");)t=Ia.getColorVariable(t).trim(),console.log("resolving color variable ",e,", to: ",t,"...");return t}static colorToRGBAChat(e){if(null==e)return[0,0,0,0];const t=Ia.colorCache[e];if(t)return t;let r=e;"string"==typeof r&&r.trim().startsWith("var(")&&(r=Ia.resolveColorVariable(r));const o=window.document.createElement("canvas");o.width=o.height=1;const a=o.getContext("2d");a.clearRect(0,0,1,1),a.fillStyle=r,a.fillRect(0,0,1,1);const s=[...a.getImageData(0,0,1,1).data];return Ia.colorCache[e]=s,s}static colorToRGBA(e){if(null==e)return[0,0,0,0];const t=Ia.colorCache[e];if(t)return t;let r=e;"var"===e.substr(0,3).valueOf()&&(r=Ia.getColorVariable(e));const o=window.document.createElement("canvas");o.width=o.height=1;const a=o.getContext("2d");a.clearRect(0,0,1,1),a.fillStyle=r,a.fillRect(0,0,1,1);const s=[...a.getImageData(0,0,1,1).data];return Ia.colorCache[e]=s,s}static hslToRgb(e){const t=e.h/360,r=e.s/100,o=e.l/100;let a,s,i;if(0===r)a=s=i=o;else{function n(e,t,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?e+6*(t-e)*r:r<.5?t:r<2/3?e+(t-e)*(2/3-r)*6:e}const l=o<.5?o*(1+r):o+r-o*r,c=2*o-l;a=n(c,l,t+1/3),s=n(c,l,t),i=n(c,l,t-1/3)}return a*=255,s*=255,i*=255,{r:a,g:s,b:i}}static computeColor(e){if(e.attributes?.hvac_action){const t=e.attributes.hvac_action;return t in Pa?Aa(e,Pa[t]):void 0}if(e.attributes?.rgb_color)return`rgb(${e.attributes.rgb_color.join(",")})`;const t=Aa(e);return t||void 0}static getHaEntityIconStyle(e){const t=Ia.computeColor(e),r=(e=>{if(e.attributes.brightness&&"plant"!==_e(e.entity_id))return`brightness(${(e.attributes.brightness+245)/5}%)`;return""})(e);return{color:t??"var(--state-icon-color)",fill:"currentColor",...r?{filter:r}:{}}}}const Va=200,Oa=100,Da=Va;class ja{static calculateValueBetween(e,t,r){return isNaN(r)?0:r?(Math.min(Math.max(r,e),t)-e)/(t-e):0}static calculateSvgCoordinate(e,t){return e/100*Va+(t-Oa)}static calculateSvgDimension(e){return e/100*Va}static getLovelace(){let e=window.document.querySelector("home-assistant");if(e=e&&e.shadowRoot,e=e&&e.querySelector("home-assistant-main"),e=e&&e.shadowRoot,e=e&&e.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"),e=e&&e.shadowRoot||e,e=e&&e.querySelector("ha-panel-lovelace"),e=e&&e.shadowRoot,e=e&&e.querySelector("hui-root"),e){console.log("getLoveLace, root",e,e.lovelace);const t=e.lovelace;return t.current_view=e.___curView,t}return null}}class La{static mergeDeep(...e){const t=e=>e&&"object"==typeof e;return e.reduce(((e,r)=>(Object.keys(r).forEach((o=>{const a=e[o],s=r[o];Array.isArray(a)&&Array.isArray(s)?e[o]=a.concat(...s):t(a)&&t(s)?e[o]=this.mergeDeep(a,s):e[o]=s})),e)),{})}}const Ha={apparent_temperature:"mdi:thermometer",cloud_coverage:"mdi:weather-cloudy",dew_point:"mdi:thermometer-water",humidity:"mdi:water-percent",pressure:"mdi:gauge",temperature:"mdi:thermometer",uv_index:"mdi:sun-wireless",visibility:"mdi:weather-fog",wind_bearing:"mdi:weather-windy",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",precipitation_probability:"mdi:weather-pouring",condition_clear_night:"mdi:weather-night",condition_cloudy:"mdi:weather-cloudy",condition_fog:"mdi:weather-fog",condition_hail:"mdi:weather-hail",condition_lightning:"mdi:weather-lightning",condition_lightning_rainy:"mdi:weather-lightning-rainy",condition_partlycloudy:"mdi:weather-partly-cloudy",condition_pouring:"mdi:weather-pouring",condition_rainy:"mdi:weather-rainy",condition_snowy:"mdi:weather-snowy",condition_snowy_rainy:"mdi:weather-snowy-rainy",condition_sunny:"mdi:weather-sunny",condition_windy:"mdi:weather-windy",condition_windy_variant:"mdi:weather-windy-variant",condition_exceptional:"mdi:alert-circle-outline"},Ra={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed",scale_style:"fixed"},Fa={xpos:50,ypos:50},qa={min:0,max:100,width:6,color:"var(--primary-background-color)"},Ga={width:12,color:"var(--primary-color)"};class Ua{static setConfig(e,t){return Ua.getConfig(e).map(((e,r)=>{try{return Ua.normalizeConfig(e,r,t)}catch(o){throw console.error("[HorseshoesLayout normalize error]",{index:r,horseshoeConfig:e,error:o,message:o?.message,stack:o?.stack}),o}}))}static getConfig(e){const t=Ua.getLegacyConfig(e);return[...t?[t]:[],...Array.isArray(e.layout?.horseshoes)?e.layout.horseshoes:[]].map((e=>La.mergeDeep({},{show:Ra,horseshoe_scale:qa,horseshoe_state:Ga,entity_index:0},e))).filter((e=>!1!==e.show?.horseshoe))}static getLegacyConfig(e){const t={};return["show","horseshoe_scale","horseshoe_state","color_stops","styles"].forEach((r=>{void 0!==e[r]&&(t[r]=e[r])})),Object.keys(t).length>0?t:void 0}static normalize(e){return e?be.isPlainObject(e)&&Array.isArray(e.colors)?{...e,colors:e.colors.map((e=>be.normalizeColorEntry(e))).filter(Boolean).sort(((e,t)=>e.value-t.value))}:be.isPlainObject(e)?{colors:Object.entries(e).map((([e,t])=>be.normalizeColorPair(e,t))).filter(Boolean).sort(((e,t)=>e.value-t.value))}:Array.isArray(e)?{colors:e.flatMap((e=>be.normalizeColorArrayEntry(e))).filter(Boolean).sort(((e,t)=>e.value-t.value))}:{colors:[]}:{colors:[]}}static normalizeConfig(e,t,r){const o=e.entity_index??0,a=e.show,s=e.horseshoe_scale,i=e.horseshoe_state,n=e.xpos??e.horseshoe_position?.xpos??e.horseshoe_position?.cx??Fa.xpos??Fa.cx??50,l=e.ypos??e.horseshoe_position?.ypos??e.horseshoe_position?.cy??Fa.ypos??Fa.cy??50;if(null==s.min||null==s.max)throw Error(`No horseshoe min/max for scale defined for horseshoe ${t}`);const c=e.color_stops;let d,h,u,m;if(null!=c){const e=r.getJsTemplateOrValue({entity_index:o},c,{resolveKeys:!0});d=be.ensureMinimumStops(be.normalize(e),s.max);const t=d.colors;if(Array.isArray(t)&&t.length>=2){const e=t[0],r=t[t.length-1];null!=e?.color&&null!=r?.color&&(null==i.color&&(i.color=e.color),h=be.normalize({[s.min]:e.color,[s.max]:r.color}),u=e.color,m=r.color)}}const p=e.radius??45,g=e.tickmarks_radius??43,b=e.arc_degrees??260,f=p/100*Da,y=g/100*Da,v=2*b/360*Math.PI*f,_=2*Math.PI*f;return{...e,entity_index:o,show:a,fill:e.fill??"rgba(0, 0, 0, 0)",xpos:n,ypos:l,bar_mode:e.bar_mode??"normal",horseshoe_scale:s,horseshoe_state:i,radius:p,tickmarks_radius:g,arc_degrees:b,radiusSize:f,tickmarksRadiusSize:y,horseshoePathLength:v,circlePathLength:_,color_stops:c,colorStops:d,colorStopsMinMax:h,color0:u,color1:m,angleCoords:{x1:"0%",y1:"0%",x2:"100%",y2:"0%"},color1_offset:"0%"}}}class Ba{static renderColorStopLabel(e){const t=String(e.label);return t.length>0?Ba.renderColorStopTextPathLabel({...e,label:t}):Ba.renderColorStopRotatedLabel({...e,label:t})}static renderColorStopLabelV1(e){const t=String(e.label);return t.length>3?Ba.renderColorStopTextPathLabel({...e,label:t}):Ba.renderColorStopRotatedLabel({...e,label:t})}static renderColorStopTextPathLabel({horseshoeIndex:e,index:t,label:r,angle:o,cx:a,cy:s,radius:i,cardId:n,isMin:l=!1,isMax:c=!1,transformContext:d={}}){const h=String(r),{visualAngle:u,mirrored:m}=Ba.resolveLabelGeometry({angle:o,...d}),p=m?Ba.normalizeAngle(u+180):u;let g=p-12,b=p+12;l&&(g=p,b=p+24),c&&(g=p-24,b=p);const f=p>=270||p<=90,y=f?g:b,v=f?b:g,_=f?1:0;let x="50%",$="middle";l&&(x=f?"0%":"100%",$=f?"start":"end"),c&&(x=f?"100%":"0%",$=f?"end":"start");const w=Ba.polarToCartesian(a,s,i,y),k=Ba.polarToCartesian(a,s,i,v),M=`${n}-colorstop-label-${e}-${t}`,S=f?"0.0em":"0em",{rotation:C=0,flipX:A=!1,flipY:N=!1}=d;return q`
    <g transform="${`\n    translate(${a} ${s})\n    scale(${A?-1:1} ${N?-1:1})\n    rotate(${-C})\n    translate(${-a} ${-s})\n  `}">
      <path
        id="${M}"
        d="M ${w.x} ${w.y} A ${i} ${i} 0 0 ${_} ${k.x} ${k.y}"
        fill="none"
        stroke="none"
      />

      <text
        class="horseshoe-colorstop-label"
        style="fill:currentColor"
        dy="${S}"
      >
        <textPath
          href="#${M}"
          style="dominant-baseline:central"
          startOffset="${x}"
          text-anchor="${$}"
        >
          ${h}
        </textPath>
      </text>
    </g>
  `}static renderColorStopTextPathLabelV10({horseshoeIndex:e,index:t,label:r,angle:o,cx:a,cy:s,radius:i,cardId:n,isMin:l=!1,isMax:c=!1,transformContext:d={}}){const h=String(r),{visualAngle:u}=Ba.resolveLabelGeometry({angle:o,...d});let m=u-12,p=u+12;l&&(m=u,p=u+24),c&&(m=u-24,p=u);const g=u>=270||u<=90,b=g?m:p,f=g?p:m,y=g?1:0;let v="50%",_="middle";l&&(v=g?"0%":"100%",_=g?"start":"end"),c&&(v=g?"100%":"0%",_=g?"end":"start");const x=Ba.polarToCartesian(a,s,i,b),$=Ba.polarToCartesian(a,s,i,f),w=`${n}-colorstop-label-${e}-${t}`,k=g?"0.0em":"0em",{rotation:M=0,flipX:S=!1,flipY:C=!1}=d;return q`
    <g transform="${`\n    translate(${a} ${s})\n    scale(${S?-1:1} ${C?-1:1})\n    rotate(${-M})\n    translate(${-a} ${-s})\n  `}">
      <path
        id="${w}"
        d="M ${x.x} ${x.y} A ${i} ${i} 0 0 ${y} ${$.x} ${$.y}"
        fill="none"
        stroke="none"
      />

      <text
        class="horseshoe-colorstop-label"
        style="fill:currentColor"
        dy="${k}"
      >
        <textPath
          href="#${w}"
          style="dominant-baseline:central"
          startOffset="${v}"
          text-anchor="${_}"
        >
          ${h}
        </textPath>
      </text>
    </g>
  `}static renderColorStopTextPathLabelV9({horseshoeIndex:e,index:t,label:r,angle:o,cx:a,cy:s,radius:i,cardId:n,isMin:l=!1,isMax:c=!1,transformContext:d={}}){const h=String(r),{positionAngle:u,visualAngle:m,mirrored:p}=Ba.resolveLabelGeometry({angle:o,...d});let g=u-12,b=u+12;l&&(g=u,b=u+24),c&&(g=u-24,b=u);const f=m>=270||m<=90,y=!f,v=y?b:g,_=y?g:b,x=y?0:1;let $="50%",w="middle";l&&($=y?"100%":"0%",w=y?"end":"start"),c&&($=y?"0%":"100%",w=y?"start":"end");const k=Ba.polarToCartesian(a,s,i,v),M=Ba.polarToCartesian(a,s,i,_),S=`${n}-colorstop-label-${e}-${t}`,C=f?"0.0em":"0em",{flipX:A=!1,flipY:N=!1}=d,T=Ba.polarToCartesian(a,s,i,u),z=p?`\n      translate(${T.x} ${T.y})\n      scale(${A?-1:1} ${N?-1:1})\n      translate(${-T.x} ${-T.y})\n    `:"";return q`
    <path
      id="${S}"
      d="M ${k.x} ${k.y} A ${i} ${i} 0 0 ${x} ${M.x} ${M.y}"
      fill="none"
      stroke="none"
    />

    <text
      class="horseshoe-colorstop-label"
      style="fill:currentColor"
      dy="${C}"
      transform="${z}"
    >
      <textPath
        href="#${S}"
        style="dominant-baseline:central"
        startOffset="${$}"
        text-anchor="${w}"
      >
        ${h}
      </textPath>
    </text>
  `}static renderColorStopTextPathLabelV8({horseshoeIndex:e,index:t,label:r,angle:o,cx:a,cy:s,radius:i,cardId:n,isMin:l=!1,isMax:c=!1,transformContext:d}){const h=String(r),{positionAngle:u,visualAngle:m,mirrored:p}=Ba.resolveLabelGeometry({angle:o,...d});let g=u-12,b=u+12;l&&(g=u,b=u+24),c&&(g=u-24,b=u);const f=m>=270||m<=90,y=p?f:!f,v=y?b:g,_=y?g:b,x=y?0:1;let $="50%",w="middle";l&&($=y?"100%":"0%",w=y?"end":"start"),c&&($=y?"0%":"100%",w=y?"start":"end");const k=Ba.polarToCartesian(a,s,i,v),M=Ba.polarToCartesian(a,s,i,_),S=`${n}-colorstop-label-${e}-${t}`,C=f?"0.0em":"0em",A=Ba.polarToCartesian(a,s,i,u),{rotation:N=0,flipX:T=!1,flipY:z=!1}=d,E=p?`\n      translate(${A.x} ${A.y})\n      scale(${T?-1:1} ${z?-1:1})\n      translate(${-A.x} ${-A.y})\n    `:"";return q`
    <path
      id="${S}"
      d="M ${k.x} ${k.y} A ${i} ${i} 0 0 ${x} ${M.x} ${M.y}"
      fill="none"
      stroke="none"
    />

    <text
      class="horseshoe-colorstop-label"
      style="fill:currentColor"
      dy="${C}"
        transform="${E}"

    >
      <textPath
        href="#${S}"
        style="dominant-baseline:central"
        startOffset="${$}"
        text-anchor="${w}"
      >
        ${h}
      </textPath>
    </text>
  `}static renderColorStopTextPathLabelV7({horseshoeIndex:e,index:t,label:r,angle:o,cx:a,cy:s,radius:i,cardId:n,isMin:l=!1,isMax:c=!1,transformContext:d={}}){const h=String(r),{positionAngle:u,visualAngle:m,mirrored:p}=Ba.resolveLabelGeometry({angle:o,...d});let g=u-12,b=u+12;l&&(g=u,b=u+24),c&&(g=u-24,b=u);const f=m>=270||m<=90,y=p?f:!f,v=y?b:g,_=y?g:b,x=y?0:1;let $="50%",w="middle";l&&($=y?"100%":"0%",w=y?"end":"start"),c&&($=y?"0%":"100%",w=y?"start":"end");const k=Ba.polarToCartesian(a,s,i,v),M=Ba.polarToCartesian(a,s,i,_),S=`${n}-colorstop-label-${e}-${t}`,C=f?"0.0em":"0em",{rotation:A=0,flipX:N=!1,flipY:T=!1}=d;return q`
  <path
    id="${S}"
    d="M ${k.x} ${k.y} A ${i} ${i} 0 0 ${x} ${M.x} ${M.y}"
    fill="none"
    stroke="none"
  />

  <text
<text
  class="horseshoe-colorstop-label"
  style="fill:currentColor"
  dy="${C}"

  >
    <textPath
      href="#${S}"
      style="dominant-baseline:central"
      startOffset="${$}"
      text-anchor="${w}"
    >
      ${h}
    </textPath>
  </text>
`}static renderColorStopTextPathLabelV6({horseshoeIndex:e,index:t,label:r,angle:o,cx:a,cy:s,radius:i,cardId:n,isMin:l=!1,isMax:c=!1,transformContext:d={}}){const h=String(r),{positionAngle:u,visualAngle:m,mirrored:p}=Ba.resolveLabelGeometry({angle:o,...d});let g=u-12,b=u+12;l&&(g=u,b=u+24),c&&(g=u-24,b=u);const f=m>=270||m<=90,y=f===p,v=y?b:g,_=y?g:b,x=y?0:1;let $="50%",w="middle";l&&($=y?"100%":"0%",w=y?"end":"start"),c&&($=y?"0%":"100%",w=y?"start":"end");const k=Ba.polarToCartesian(a,s,i,v),M=Ba.polarToCartesian(a,s,i,_),S=`${n}-colorstop-label-${e}-${t}`,C=f?"0.0em":"0em";return q`
    <path
      id="${S}"
      d="M ${k.x} ${k.y} A ${i} ${i} 0 0 ${x} ${M.x} ${M.y}"
      fill="none"
      stroke="none"
    />

    <text
      class="horseshoe-colorstop-label"
      style="fill:currentColor"
      dy="${C}"
    >
      <textPath
        href="#${S}"
        style="dominant-baseline:central"
        startOffset="${$}"
        text-anchor="${w}"
      >
        ${h}
      </textPath>
    </text>
  `}static renderColorStopTextPathLabelV5({horseshoeIndex:e,index:t,label:r,angle:o,cx:a,cy:s,radius:i,cardId:n,isMin:l=!1,isMax:c=!1}){const d=String(r);let h=o-12,u=o+12;l&&(h=o,u=o+24),c&&(h=o-24,u=o);const m=o>=-90&&o<=90,p=m?h:u,g=m?u:h,b=m?1:0;let f="50%",y="middle";l&&(f=m?"0%":"100%",y=m?"start":"end"),c&&(f=m?"100%":"0%",y=m?"end":"start");const v=Ba.polarToCartesian(a,s,i,p),_=Ba.polarToCartesian(a,s,i,g),x=`${n}-colorstop-label-${e}-${t}`,$=m?"0.0em":"0em";return q`
    <path
      id="${x}"
      d="M ${v.x} ${v.y} A ${i} ${i} 0 0 ${b} ${_.x} ${_.y}"
      fill="none"
      stroke="none"
    />

    <text
      class="horseshoe-colorstop-label"
      style="fill:var(--primary-text-color)"
      dy="${$}"
    >
      <textPath
        href="#${x}"
        style="dominant-baseline:central"
        startOffset="${f}"
        text-anchor="${y}"
      >
        ${d}
      </textPath>
    </text>
  `}static renderColorStopTextPathLabelV4({index:e,label:t,angle:r,cx:o,cy:a,radius:s,cardId:i,isMin:n,isMax:l}){const c=String(t);let d=r-12,h=r+12;n&&(d=r,h=r+24),l&&(d=r-24,h=r);const u=r>-90&&r<90,m=u?d:h,p=u?h:d,g=u?1:0;let b="50%",f="middle";n&&(b=u?"0%":"100%",f=u?"start":"end"),l&&(b=u?"100%":"0%",f=u?"end":"start");const y=Ba.polarToCartesian(o,a,s,m),v=Ba.polarToCartesian(o,a,s,p),_=`${i}-colorstop-label-${e}`;return q`
    <path
      id="${_}"
      d="M ${y.x} ${y.y} A ${s} ${s} 0 0 ${g} ${v.x} ${v.y}"
      fill="none"
      stroke="none"
    />

    <text class="horseshoe-colorstop-label" style="fill:var(--primary-text-color)">
      <textPath
        href="#${_}"
        startOffset="${b}"
        text-anchor="${f}"
      >
        ${c}
      </textPath>
    </text>
  `}static renderColorStopTextPathLabelV2({index:e,label:t,angle:r,cx:o,cy:a,radius:s,cardId:i,isMin:n=!1,isMax:l=!1}){const c=String(t),d=Math.max(18,5*c.length);let h=r-d/2,u=r+d/2;n&&(h=r,u=r+d),l&&(h=r-d,u=r);const m=r>-90&&r<90,p=m?h:u,g=m?u:h,b=m?1:0,f=Ba.polarToCartesian(o,a,s,p),y=Ba.polarToCartesian(o,a,s,g),v=`${i}-colorstop-label-${e}`;return q`
    <path
      id="${v}"
      d="M ${f.x} ${f.y} A ${s} ${s} 0 0 ${b} ${y.x} ${y.y}"
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
  `}static renderColorStopTextPathLabelV1({index:e,label:t,angle:r,cx:o,cy:a,radius:s,cardId:i}){const n=String(t),l=Math.max(18,5*n.length),c=r-l/2,d=r+l/2,h=r>-90&&r<90,u=h?c:d,m=h?d:c,p=h?1:0,g=Ba.polarToCartesian(o,a,s,u),b=Ba.polarToCartesian(o,a,s,m),f=`${i}-colorstop-label-${e}`,y=`\n    M ${g.x} ${g.y}\n    A ${s} ${s} 0 0 ${p} ${b.x} ${b.y}\n  `;return q`
    <path
      id="${f}"
      d="${y}"
      fill="none"
      stroke="none"
    />

    <text class="horseshoe-colorstop-label">
      <textPath
        href="#${f}"
        startOffset="50%"
        text-anchor="middle"
      >
        ${n}
      </textPath>
    </text>
  `}static renderColorStopRotatedLabel({label:e,angle:t,cx:r,cy:o,radius:a}){const s=Ba.polarToCartesian(r,o,a,t);let i=t;return i>90&&(i-=180),i<-90&&(i+=180),q`
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
    `}static renderColorStopTextPathLabelV3({index:e,label:t,angle:r,cx:o,cy:a,radius:s,cardId:i}){const n=Math.max(18,5*String(t).length),l=r-n/2,c=r+n/2,d=Ba.polarToCartesian(o,a,s,c),h=Ba.polarToCartesian(o,a,s,l),u=`${i}-colorstop-label-${e}`,m=`\n      M ${d.x} ${d.y}\n      A ${s} ${s} 0 0 0 ${h.x} ${h.y}\n    `;return q`
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
    `}static valueToAngle(e,t,r,o,a){if("bidirectional"!==a){return-o/2+(e-t)/(r-t)*o}const s=o/2;if(e<0){return-(e/t)*s}if(e>0){return e/r*s}return 0}static valueToAngleV1(e,t,r,o,a){if("bidirectional"!==a){return-o/2+(e-t)/(r-t)*o}if(e<0){return o/2*-(e/t)}if(e>0){return e/r*(o/2)}return 0}static polarToCartesian(e,t,r,o){const a=(o-90)*Math.PI/180;return{x:e+r*Math.cos(a),y:t+r*Math.sin(a)}}static renderArcSegment({cx:e,cy:t,radius:r,startAngle:o,endAngle:a,width:s,color:i,className:n="",lineCap:l="round"}){const c=Ba.polarToCartesian(e,t,r,o),d=Ba.polarToCartesian(e,t,r,a),h=Math.abs(a-o)>180?1:0,u=a>o?1:0;return q`
    <path
      class="${n}"
      d="M ${c.x} ${c.y}
         A ${r} ${r} 0 ${h} ${u} ${d.x} ${d.y}"
      fill="none"
      stroke="${i}"
      stroke-width="${s}"
      stroke-linecap="${l}"
    />
  `}static buildColorStopSegments(e,t,r){const o=e.map((e=>({value:Number(e.value),color:e.color,label:e.label??e.value}))).filter((e=>Number.isFinite(e.value)&&e.value>=t&&e.value<=r)).sort(((e,t)=>e.value-t.value));if(!o.length)return[];const a=[{value:t,color:o[0].color},...o,{value:r,color:o[o.length-1].color}];return a.slice(0,-1).map(((e,t)=>{const r=a[t+1];return{startValue:e.value,endValue:r.value,color:e.color}})).filter((e=>e.startValue!==e.endValue))}static buildColorStopSegmentsV1(e,t,r){const o=e.map((e=>({value:Number(e.value),color:e.color,label:e.label??e.value}))).filter((e=>Number.isFinite(e.value)&&e.value>=t&&e.value<=r)).sort(((e,t)=>e.value-t.value)),a=[{value:t,color:o[0]?.color},...o,{value:r,color:o.at(-1)?.color}];return a.slice(0,-1).map(((e,t)=>{const r=a[t+1];return{startValue:e.value,endValue:r.value,color:r.color??e.color}})).filter((e=>e.startValue!==e.endValue))}static renderColorStopScaleSegments({cx:e,cy:t,radius:r,startAngle:o,endAngle:a,width:s,colorStops:i,min:n,max:l,arcDegrees:c,barMode:d,gap:h=0,opacity:u=1,className:m="",lineCap:p="butt"}){const g=Ba.buildColorStopSegments(i.colors,n,l),b="round"===p;return q`
    ${g.map(((o,a)=>{const i=0===a,p=a===g.length-1,f=Ba.valueToAngle(o.startValue,n,l,c,d)+h/2,y=Ba.valueToAngle(o.endValue,n,l,c,d)-h/2;if(y<=f)return q``;const v=y>f?1:0;return q`
        ${Ba.renderArcSegment({cx:e,cy:t,radius:r,startAngle:f,endAngle:y,width:s,color:o.color,opacity:u,className:m,lineCap:"butt"})}

        ${i&&b?Ba.renderArcHalfCap({cx:e,cy:t,radius:r,angle:f,width:s,color:o.color,opacity:u,className:m,sweepFlag:v,side:"start"}):q``}

        ${p&&b?Ba.renderArcHalfCap({cx:e,cy:t,radius:r,angle:y,width:s,color:o.color,opacity:u,className:m,sweepFlag:v,side:"end"}):q``}
      `}))}
  `}static renderColorStopScaleSegmentsV2({cx:e,cy:t,radius:r,width:o,colorStops:a,min:s,max:i,arcDegrees:n,barMode:l,gap:c=0,opacity:d=1,className:h=""}){const u=Ba.buildColorStopSegments(a,s,i);return q`
    ${u.map(((a,m)=>{const p=0===m,g=m===u.length-1,b=Ba.valueToAngle(a.startValue,s,i,n,l)+c/2,f=Ba.valueToAngle(a.endValue,s,i,n,l)-c/2;if(f<=b)return q``;const y=f>b?1:0;return q`
        ${Ba.renderArcSegment({cx:e,cy:t,radius:r,startAngle:b,endAngle:f,width:o,color:a.color,opacity:d,className:h,lineCap:"butt"})}

        ${p?Ba.renderArcHalfCap({cx:e,cy:t,radius:r,angle:b,width:o,color:a.color,opacity:d,className:h,sweepFlag:y,side:"start"}):q``}

        ${g?Ba.renderArcHalfCap({cx:e,cy:t,radius:r,angle:f,width:o,color:a.color,opacity:d,className:h,sweepFlag:y,side:"end"}):q``}
      `}))}
  `}static renderColorStopScaleSegmentsV1({cx:e,cy:t,radius:r,startAngle:o,endAngle:a,width:s,colorStops:i,min:n,max:l,arcDegrees:c,barMode:d,className:h="",lineCap:u="butt"}){const m=Ba.buildColorStopSegments(i,n,l);return q`
    ${m.map((o=>{const a=Ba.valueToAngle(o.startValue,n,l,c,d),i=Ba.valueToAngle(o.endValue,n,l,c,d);return Ba.renderArcSegment({cx:e,cy:t,radius:r,startAngle:a,endAngle:i,width:s,color:o.color,className:h,lineCap:u})}))}
  `}static renderArcHalfCap({cx:e,cy:t,radius:r,angle:o,width:a,color:s,opacity:i=1,className:n="",side:l="end"}){const c=Ba.polarToCartesian(e,t,r,o),d=a/2,h=(c.x-e)/r,u=(c.y-t)/r,m=c.x-h*d,p=c.y-u*d,g=c.x+h*d,b=c.y+u*d;return q`
    <path
      class="${n}"
      d="
        M ${m} ${p}
        A ${d} ${d} 0 0 ${"start"===l?1:0} ${g} ${b}
        Z
      "
      fill="${s}"
    />
  `}static renderArcHalfCapV1({cx:e,cy:t,radius:r,angle:o,width:a,color:s,sweepFlag:i,side:n}){const l=Ba.polarToCartesian(e,t,r,o),c=a/2,d=((i?o+90:o-90)-90)*Math.PI/180,h=Math.cos(d)*c,u=Math.sin(d)*c,m=l.x-h,p=l.y-u,g=l.x+h,b=l.y+u;return q`
      <path
        d="
          M ${m} ${p}
          A ${c} ${c} 0 0 ${"start"===n?0:1} ${g} ${b}
          L ${l.x} ${l.y}
          Z
        "
        fill="${s}"
      />
    `}static buildFixedScaleSegments({min:e,max:t,segmentSize:r,color:o}){if(!r||r<=0)return[{startValue:e,endValue:t,color:o}];const a=[];for(let s=e;s<t;s+=r)a.push({startValue:s,endValue:Math.min(s+r,t),color:o});return a}static renderFixedScaleSegments({cx:e,cy:t,radius:r,width:o,color:a,min:s,max:i,arcDegrees:n,barMode:l,segmentSize:c,gap:d=0,className:h="",lineCap:u="round"}){const m=Ba.buildFixedScaleSegments({min:s,max:i,segmentSize:c,color:a});return Ba.renderScaleSegments({cx:e,cy:t,radius:r,width:o,segments:m,min:s,max:i,arcDegrees:n,barMode:l,gap:d,className:h,lineCap:u})}static renderScaleSegments({cx:e,cy:t,radius:r,width:o,segments:a,min:s,max:i,arcDegrees:n,barMode:l,gap:c=2,className:d="",lineCap:h="butt"}){const u="round"===h;return q`
    ${a.map(((h,m)=>{const p=0===m,g=m===a.length-1,b=Ba.valueToAngle(h.startValue,s,i,n,l)+c/2,f=Ba.valueToAngle(h.endValue,s,i,n,l)-c/2;return f<=b?q``:q`
        ${Ba.renderArcSegment({cx:e,cy:t,radius:r,startAngle:b,endAngle:f,width:o,color:h.color,className:d,lineCap:"butt"})}

        ${p&&u?Ba.renderArcHalfCap({cx:e,cy:t,radius:r,angle:b,width:o,color:h.color,className:d,side:"start"}):q``}

        ${g&&u?Ba.renderArcHalfCap({cx:e,cy:t,radius:r,angle:f,width:o,color:h.color,className:d,side:"end"}):q``}
      `}))}
  `}static renderScaleTicks({cx:e,cy:t,radius:r,min:o,max:a,arcDegrees:s,barMode:i,colorStops:n,ticksMajor:l,ticksMinor:c,tickType:d}){const h=r+Number(c?.offset??0),u=h+Number(l?.offset??0),m=l?Ba.buildTickValues(o,a,Number(l.ticksize)):[];let p=c?Ba.buildTickValues(o,a,Number(c.ticksize)).filter((e=>!l||!Ba.isMajorTick(e,o,Number(l.ticksize)))):[];if("ticks_minor"===d){const e=Number(l?.ticksize);p=p.filter((t=>!Ba.isMajorTick(t,o,e)))}return q`
    ${"ticks_minor"===d&&c?Ba.renderTicks({cx:e,cy:t,radius:h,values:p,min:o,max:a,arcDegrees:s,barMode:i,width:Number(c.width??1),thickness:Number(c.thickness??2),color:c.color,colorMode:c.color_mode,colorStops:n,className:"horseshoe-scale-tick-minor"}):q``}

    ${l?Ba.renderTicks({cx:e,cy:t,radius:u,values:m,min:o,max:a,arcDegrees:s,barMode:i,width:Number(l.width??4),thickness:Number(l.thickness??10),color:l.color,colorMode:l.color_mode,colorStops:n,className:"horseshoe-scale-tick-major"}):q``}
  `}static renderScaleTicksV2({cx:e,cy:t,radius:r,min:o,max:a,arcDegrees:s,barMode:i,color:n,ticksMajor:l,ticksMinor:c,tickType:d}){const h=r+Number(c?.offset??0),u=h+Number(l?.offset??0),m=l?Ba.buildTickValues(o,a,Number(l.ticksize)):[];let p=[];if(p=c?Ba.buildTickValues(o,a,Number(c.ticksize)).filter((e=>!l||!Ba.isMajorTick(e,o,Number(l.ticksize)))):[],"ticks_minor"===d){const e=Number(l?.ticksize);p=p.filter((t=>!Ba.isMajorTick(t,o,e)))}return q`
    ${"ticks_minor"===d&&c?Ba.renderTicks({cx:e,cy:t,radius:h,values:p,min:o,max:a,arcDegrees:s,barMode:i,width:Number(c.width??1),thickness:Number(c.thickness??2),color:n,className:"horseshoe-scale-tick-minor"}):q``}

    ${l?Ba.renderTicks({cx:e,cy:t,radius:u,values:m,min:o,max:a,arcDegrees:s,barMode:i,width:Number(l.width??4),thickness:Number(l.thickness??10),color:n,className:"horseshoe-scale-tick-major"}):q``}
  `}static renderScaleTicksV1({cx:e,cy:t,radius:r,min:o,max:a,arcDegrees:s,barMode:i,color:n,ticksMajor:l,ticksMinor:c}){const d=Ba.buildTickValues(o,a,l.ticksize),h=Ba.buildTickValues(o,a,c.ticksize).filter((e=>!Ba.isMajorTick(e,o,l.ticksize)));return q`
    ${Ba.renderTicks({cx:e,cy:t,radius:r,values:h,min:o,max:a,arcDegrees:s,barMode:i,width:c.width,thickness:c.thickness,color:n,className:"horseshoe-scale-tick-minor"})}

    ${Ba.renderTicks({cx:e,cy:t,radius:r+Number(l.offset??0),values:d,min:o,max:a,arcDegrees:s,barMode:i,width:l.width,thickness:l.thickness,color:n,className:"horseshoe-scale-tick-major"})}
  `}static renderTicks({cx:e,cy:t,radius:r,values:o,min:a,max:s,arcDegrees:i,barMode:n,width:l,thickness:c,color:d,colorMode:h,colorStops:u,className:m=""}){return q`
    ${o.map((o=>{const p=Ba.valueToAngle(o,a,s,i,n),g=Ba.arcLengthToDegrees(c,r);let b=d;return"colorstop"===h&&(b=Ia.calculateStrokeColor(o,u,!1)),"colorstopgradient"===h&&(b=Ia.calculateStrokeColor(o,u,!0)),Ba.renderArcSegment({cx:e,cy:t,radius:r,startAngle:p-g/2,endAngle:p+g/2,width:l,color:b,className:m,lineCap:"butt"})}))}
  `}static renderTicksV2({cx:e,cy:t,radius:r,values:o,min:a,max:s,arcDegrees:i,barMode:n,width:l,thickness:c,color:d,colorMode:h,getTickColor:u,className:m=""}){return q`
    ${o.map((o=>{const p=Ba.valueToAngle(o,a,s,i,n),g=Ba.arcLengthToDegrees(c,r),b="fixed"===h?d:u(o,h);return Ba.renderArcSegment({cx:e,cy:t,radius:r,startAngle:p-g/2,endAngle:p+g/2,width:l,color:b,className:m,lineCap:"butt"})}))}
  `}static renderTicksV1({cx:e,cy:t,radius:r,values:o,min:a,max:s,arcDegrees:i,barMode:n,width:l,thickness:c,color:d,className:h=""}){return q`
    ${o.map((o=>{const u=Ba.valueToAngle(o,a,s,i,n),m=Ba.arcLengthToDegrees(c,r);return Ba.renderArcSegment({cx:e,cy:t,radius:r,startAngle:u-m/2,endAngle:u+m/2,width:l,color:d,className:h,lineCap:"butt"})}))}
  `}static getVisualAngleFromParentTransform({angle:e,rotation:t=0,flipX:r=!1,flipY:o=!1}){const a=r?-1:1,s=o?-1:1,i=Ba.degToRad(e),n=Ba.degToRad(t),l=Math.cos(i),c=Math.sin(i),d=(l*Math.cos(n)-c*Math.sin(n))*a,h=(l*Math.sin(n)+c*Math.cos(n))*s;return Ba.normalizeAngle(Ba.radToDeg(Math.atan2(h,d)))}static getVisualAngleFromParentTransformV1({angle:e,rotation:t=0,flipX:r=!1,flipY:o=!1}){const a=r?-1:1,s=o?-1:1,i=Ba.degToRad(e),n=Ba.degToRad(t);let l=Math.cos(i),c=Math.sin(i);l*=a,c*=s;const d=l*Math.cos(n)-c*Math.sin(n),h=l*Math.sin(n)+c*Math.cos(n);return Ba.normalizeAngle(Ba.radToDeg(Math.atan2(h,d)))}static resolveLabelGeometry({angle:e,rotation:t=0,flipX:r=!1,flipY:o=!1}){return{positionAngle:e,visualAngle:Ba.getVisualAngleFromParentTransform({angle:e,rotation:t,flipX:r,flipY:o}),mirrored:r!==o}}static renderLabel(e){return"horizontal"===e.orientation?Ba.renderHorizontalLabel(e):Ba.renderColorStopLabel(e)}static renderHorizontalLabel({label:e,angle:t,cx:r,cy:o,radius:a,transformContext:s={}}){const i=Ba.polarToCartesian(r,o,a,t),{rotation:n=0,flipX:l=!1,flipY:c=!1}=s,d=l?-1:1,h=c?-1:1;return q`
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
  `}static renderHorizontalLabelV1({label:e,angle:t,cx:r,cy:o,radius:a}){const s=Ba.polarToCartesian(r,o,a,t);return q`
    <text
      x="${s.x}"
      y="${s.y}"
      text-anchor="middle"
      style="dominant-baseline:central"
      class="horseshoe-label"
    >
      ${e}
    </text>
  `}static buildTickValues(e,t,r){const o=[];for(let a=e;a<=t+1e-9;a+=r)o.push(Number(a.toFixed(10)));return o}static isMajorTick(e,t,r){const o=(e-t)/r;return Math.abs(o-Math.round(o))<1e-9}static renderLabelBadgeV1(e){return"horizontal"===e.orientation?Ba.renderHorizontalBadge(e):Ba.renderArcLabelBadge(e)}static renderLabelBadge(e){return"horizontal"===e.orientation?Ba.renderHorizontalBadge(e):Ba.renderArcBadge(e)}static renderArcLabelBadge({label:e,angle:t,cx:r,cy:o,radius:a,badge:s}){const i=String(e),n=Number(s.padding??2),l=Number(s.char_width??4),c=Number(s.width??i.length*l+2*n),d=Number(s.height??8),h=Math.max(0,c-d/2),u=Ba.arcLengthToDegrees(h,a),m=Ba.buildArcCapsulePath({cx:r,cy:o,radius:a,angle:t,arcSize:u,width:d});return q`
    <path
      class="horseshoe-colorstop-label-badge"
      d="${m}"
    />
  `}static renderArcLabelBadgeV2({label:e,angle:t,cx:r,cy:o,radius:a,badge:s}){const i=String(e),n=Number(s.padding??2),l=Number(s.char_width??4),c=Number(s.width??i.length*l+2*n),d=Number(s.height??8),h=Ba.arcLengthToDegrees(c,a),u=Ba.buildArcCapsulePath({cx:r,cy:o,radius:a,angle:t,arcSize:h,width:d});return q`
    <path
      class="horseshoe-colorstop-label-badge"
      d="${u}"
    />
  `}static renderArcLabelBadgeV1({cx:e,cy:t,radius:r,angle:o,arcSize:a,width:s,style:i}){const n=Ba.buildArcCapsulePath({cx:e,cy:t,radius:r,angle:o,arcSize:a,width:s});return q`
    <path
      class="horseshoe-colorstop-label-badge"
      d="${n}"
    />
  `}static renderArcBadge({label:e,angle:t,cx:r,cy:o,radius:a,badge:s}){const i=String(e),n=Number(s.padding??2),l=Number(s.char_width??4),c=Number(s.width??i.length*l+2*n),d=Ba.arcLengthToDegrees(c,a);return Ba.renderArcSegment({cx:r,cy:o,radius:a,startAngle:t-d/2,endAngle:t+d/2,width:Number(s.height??8),color:s.color??"var(--card-background-color)",className:"horseshoe-label-badge",lineCap:"round"})}static renderHorizontalBadge({label:e,angle:t,cx:r,cy:o,radius:a,badge:s}){const i=Ba.polarToCartesian(r,o,a,t),n=String(e),l=Number(s.padding??4),c=Number(s.radius??Math.max(7,3*n.length+l));return q`
    <circle
      cx="${i.x}"
      cy="${i.y}"
      r="${c}"
      fill="${s.color??"var(--card-background-color)"}"
      stroke="${s.border_color??"none"}"
    />
  `}static getLabelBackgroundExtend({minLabel:e,maxLabel:t,charWidth:r,padding:o,radius:a}){const s=Math.max(String(e).length,String(t).length)*Number(r)+2*Number(o);return Ba.arcLengthToDegrees(s/2,a)}static getLabelBackgroundExtendV1({horseshoe:e,min:t,max:r,radius:o}){const a=[String(t),String(r)],s=e?.horseshoe_labels?.badges??{},i=e?.horseshoe_labels?.text??{},n=Number(s.char_width??i.char_width??4),l=Number(s.padding??3),c=Math.max(...a.map((e=>e.length*n+2*l)));return Ba.arcLengthToDegrees(c/2,o)}static arcLengthToDegrees(e,t){return Number(e)/(2*Math.PI*t)*360}static textLengthToArcDegrees(e,t,r=6){return e/(2*Math.PI*t)*360+r}static resolveLabelAngles({angle:e,objectRotation:t=0,flipX:r=!1,flipY:o=!1}){const a=r?-1:1,s=o?-1:1,i=Ba.degToRad(e),n=a*Math.cos(i),l=s*Math.sin(i),c=Ba.normalizeAngle(Ba.radToDeg(Math.atan2(l,n)));return{positionAngle:c,visualAngle:Ba.normalizeAngle(c+t)}}static normalizeAngle(e){return(e%360+360)%360}static degToRad(e){return e*Math.PI/180}static radToDeg(e){return 180*e/Math.PI}static buildArcCapsulePath({cx:e,cy:t,radius:r,angle:o,arcSize:a,width:s}){const i=s/2,n=r+i,l=r-i,c=o-a/2,d=o+a/2,h=Ba.polarToCartesian(e,t,n,c),u=Ba.polarToCartesian(e,t,n,d),m=Ba.polarToCartesian(e,t,l,d),p=Ba.polarToCartesian(e,t,l,c),g=a>180?1:0;return`\n    M ${h.x} ${h.y}\n    A ${n} ${n} 0 ${g} 1 ${u.x} ${u.y}\n    A ${i} ${i} 0 0 1 ${m.x} ${m.y}\n    A ${l} ${l} 0 ${g} 0 ${p.x} ${p.y}\n    A ${i} ${i} 0 0 1 ${h.x} ${h.y}\n    Z\n  `}static buildArcCapsulePathV1({cx:e,cy:t,radius:r,angle:o,arcSize:a,width:s}){const i=s/2,n=r+i,l=r-i,c=o-a/2,d=o+a/2,h=Ba.polarToCartesian(e,t,n,c),u=Ba.polarToCartesian(e,t,n,d),m=Ba.polarToCartesian(e,t,l,d),p=Ba.polarToCartesian(e,t,l,c),g=a>180?1:0;return`\n    M ${h.x} ${h.y}\n    A ${n} ${n} 0 ${g} 1 ${u.x} ${u.y}\n    A ${i} ${i} 0 0 1 ${m.x} ${m.y}\n    A ${l} ${l} 0 ${g} 0 ${p.x} ${p.y}\n    A ${i} ${i} 0 0 1 ${h.x} ${h.y}\n    Z\n  `}}class Ja{static cache=new Map;static load(e){if(this.cache.has(e))return this.cache.get(e);const t=fetch(e).then((async t=>{if(!t.ok)throw new Error(`Could not load palette: ${e}`);return t.json()}));return this.cache.set(e,t),t}static async loadAll(e={}){console.log("Loading palettes",e);const t=await Promise.all(Object.entries(e||{}).map((async([e,t])=>[e,await this.load(t)])));return Object.fromEntries(t)}static async loadAllV1(e){const t=await Promise.all(Object.entries(e).map((async([e,t])=>[e,await this.load(t)])));return Object.fromEntries(t)}static apply(e,t,r){Object.entries(t.ref).forEach((([t,r])=>{e.style.setProperty(`--${t}`,r)})),Object.entries(t.modes[r]).forEach((([t,r])=>{e.style.setProperty(`--${t}`,r);const o=window.getComputedStyle(e).getPropertyValue(`--${t}`).trim();console.log(`Applied palette variable --${t}: ${o}`)}))}static applyAll(e,t,r){Object.entries(t).forEach((([,t])=>{this.apply(e,t,r)}))}}console.info("%c FLEX-HORSESHOE-CARD %c Version 5.4.7-dev.2 ","color: white; font-weight: bold; background: darkgreen","color: darkgreen; font-weight: bold; background: white");const Wa={action:"more-info"},Ya={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed",scale_style:"fixed"};class Xa extends ne{constructor(){if(super(),Ia.setElement(this),this.palettesLoaded=!1,this.cardId=Math.random().toString(36).substr(2,9),this._hass=void 0,this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.viewBoxSize=Da,this.viewBox={width:Da,height:Da},this.colorStops={},this.animations={},this.animations.vlines={},this.animations.hlines={},this.animations.circles={},this.animations.icons={},this.animations.iconsIcon={},this.animations.names={},this.animations.areas={},this.animations.states={},this.resolvedEntityConfigs=[],this.colorCache={},this.isAndroid=!1,this.isSafari=!1,this.iOS=!1,this.resolvedVariables={},this.iconCache={},this.iconsSvg=[],this.pendingIconPath=[],this.iconsId=[],this.theme={},this.theme.checked=!1,this.theme.isLoaded=!1,this.theme.modeChanged=!1,this.theme.darkMode=!1,this.theme.light={},this.theme.dark={},this.palettes={},this.bar_mode="normal",this.dev={debug:!1},this.isAndroid=!!window.navigator.userAgent.match(/Android/),!this.isAndroid){const e=window.navigator.userAgent||"",t=e.toLowerCase(),r=window.navigator.platform||"",o=(/iPad|iPhone|iPod/.test(e)||"MacIntel"===r&&window.navigator.maxTouchPoints>1)&&!window.MSStream,a=e.match(/Version\/(\d+)(?:\.[\d.]+)?.*Safari/i),s=a?Number(a[1]):void 0,i=t.match(/\bos\s+(\d+)(?:[._]\d+)*.*like safari/),n=t.match(/\bios\s+(\d+)(?:[._]\d+)*/),l=n?Number(n[1]):i?Number(i[1]):void 0,c=Number.isFinite(s),d=Number.isFinite(l)&&t.includes("like safari"),h=c?s:d?l:void 0;this.iOS=o,this.isSafari=Number.isFinite(h),this.safariMajorVersion=h,this.isHomeAssistantLikeSafari=d,this.isRealSafari=c,this.isSafari14=this.isSafari&&14===h,this.isSafari15=this.isSafari&&15===h,this.isSafari16=this.isSafari&&16===h,this.isSafari17=this.isSafari&&17===h,this.isSafari18=this.isSafari&&18===h,this.isSafari26=this.isSafari&&26===h,this.isSafari27=this.isSafari&&27===h,this.isSafari28=this.isSafari&&28===h,this.isSafari29=this.isSafari&&29===h,this.isSafari30=this.isSafari&&30===h,this.isSafariGte16=this.isSafari&&h>=16,this.dev?.debug&&console.log("browser detection",{ua:e,isAndroid:this.isAndroid,isIOS:this.iOS,isSafari:this.isSafari,isRealSafari:this.isRealSafari,isHomeAssistantLikeSafari:this.isHomeAssistantLikeSafari,safariMajorVersion:this.safariMajorVersion,isSafariGte16:this.isSafariGte16}),this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config)}}static get styles(){return s`
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
    `}_resolveEntityConfigs(e){return e?.dev?.debug&&console.log("resolving entity config for",e?.entities),e?.entities?.map(((e,t)=>{const r={entity_index:t};return ge.getJsTemplateOrValue(r,e)}))??[]}_buildMyIcon(e,t,r){if(!e||!t)return;if(r)return r;if(t.icon)return t.icon;const o=t.entity,a=t.attribute,s=a?e.attributes?.[a]:void 0,i=e.entity_id?.split(".")[0];if(e.attributes?.icon&&!a)return e.attributes.icon;if(a&&"weather"===i){const e=Ha[a];if(e)return e}this.entitiesIcon??={},this.entitiesIconKey??={},this.entitiesIconPending??={};const n=a?`${o}|attribute:${a}`:`${o}|state`,l=a?[o,"attribute",a,s??"",i??"",e.attributes?.device_class??"",e.attributes?.icon??""].join("|"):[o,"state",e.state??"",i??"",e.attributes?.device_class??"",e.attributes?.icon??""].join("|");if(this.entitiesIconKey[n]===l)return this.entitiesIcon[n];if(this.entitiesIconKey[n]=l,!this.entitiesIconPending[n]){this.entitiesIconPending[n]=!0;const t=a?(async(e,t,r,o)=>{let a;const s=De(t),i=t.attributes.device_class,n=e.entities?.[t.entity_id],l=n?.platform,c=n?.translation_key,d=o??t.attributes[r];if(c&&l){const t=await He(e.config,e.connection,l);t&&(a=qe(d,t[s]?.[c]?.state_attributes?.[r]))}if(!a){const t=await Re(e.connection,e.config,s);if(t){const e=i&&t[i]?.state_attributes?.[r]||t._?.state_attributes?.[r];a=qe(d,e)}}return a})(this._hass,e,a,void 0!==s?String(s):void 0):(async(e,t,r,o,a)=>{const s=e?.[o.entity_id];if(s?.icon)return s.icon;const i=De(o);return Ge(t,r,i,o,a,s)})(this._hass.entities,this._hass.config,this._hass.connection,e);t.then((e=>{this.entitiesIconKey[n]===l&&e&&this.entitiesIcon[n]!==e&&(this.entitiesIcon[n]=e,this.requestUpdate())})).catch((e=>{console.error(a?"_buildMyIcon attributeIcon failed":"_buildMyIcon entityIcon failed",o,a??"",e)})).finally((()=>{this.entitiesIconPending[n]=!1}))}return this.entitiesIcon[n]}_formatEntityStateParts(e,t){const r=void 0!==t.attribute,o=r?this._hass.formatEntityAttributeValueToParts(e,t.attribute):this._hass.formatEntityStateToParts(e,this._buildState(e.state,t)),a=r?e.attributes[t.attribute]:e.state,s=void 0===t.decimals||Number.isNaN(Number(a))?void 0:((e,t,r)=>ze(e,t,r).map((e=>e.value)).join(""))(Number(a),this._hass.locale,{minimumFractionDigits:Number(t.decimals),maximumFractionDigits:Number(t.decimals)});return o.map((e=>"value"===e.type&&void 0!==s?{...e,value:s}:"unit"===e.type&&void 0!==t.unit?{...e,value:t.unit}:e))}themeIsDarkMode(){return!0===this.theme.darkMode}themeIsLightMode(){return!1===this.theme.darkMode}set hass(e){this.setHass(e)}setHass(e,t=!1){t&&console.warn("forceUpdate is set to true. This should only be used for testing purposes, as it can cause performance issues."),this._hass=e,ge.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes});let r=t;const o=e.selectedTheme||e.themes.theme||"",a=!0===e.themes.darkMode;if(this.theme.nameChanged=this.theme.name!==o,this.theme.modeChanged=this.theme.darkMode!==a,this.theme.nameChanged||this.theme.modeChanged){this.theme.name=o,this.theme.darkMode=a,Ia.colorCache={};const e=this.hass?.themes?.darkMode?"dark":"light";Ja.applyAll(this,this.palettes,e)}if(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.resolvedEntityConfigs.forEach(((t,o)=>{const a=e.states[t.entity];if(!a)return;this.entities[o]=a;const s=this._buildState(a.state,t);if(De(a),s!==this.entitiesStr[o]&&(this.entitiesStr[o]=s,r=!0),t.attribute&&Object.prototype.hasOwnProperty.call(a.attributes,t.attribute)){const e=this._buildState(a.attributes[t.attribute],t);e!==this.attributesStr[o]&&(this.attributesStr[o]=e,r=!0)}})),r){if(this.resolvedEntityConfigs=this._resolveEntityConfigs(this.config),this.horseshoes=this.horseshoes.map(((e,t)=>{const r=e.entity_index??0,o=this.resolvedEntityConfigs[r],a=this.entities[r];if(!a||!o)return e;let s=a.state;o.attribute&&void 0!==a.attributes[o.attribute]&&(s=a.attributes[o.attribute]);const i=ge.getJsTemplateOrValue({entity_index:r},e.horseshoe_scale),n=i?.min??0,l=i?.max??100;let c,d,h=!1;if("bidirectional"===(e.bar_mode||"normal")){this?.dev?.debug_bidirectional&&console.log("Set hass: Card ",this.cardId,"bidirectional aset as barmode");const t=e.horseshoePathLength;let r=Number(s);if(this?.dev?.debug_invert_state&&(r=-Number(s)),r>=0){this?.dev?.debug_bidirectional&&console.log("Set hass: Card ",this.cardId,"Postive state: ",r);const o=Math.min(Ia.calculateValueBetween(0,l,r),1)*(t/2);c=`${o} ${e.circlePathLength-o}`,d=void 0,h=!1}else{this?.dev?.debug_bidirectional&&console.log("Set hass: Card ",this.cardId,"Negative state: ",r);const o=(1-Math.min(Ia.calculateValueBetween(n,0,r),1))*(t/2);c=`${o} ${e.circlePathLength-o}`,d=""+-(e.circlePathLength-o),h=!0}}else{c=`${Math.min(Ia.calculateValueBetween(n,l,s),1)*e.horseshoePathLength} ${10*e.radiusSize}`,d=void 0,h=!1}const u=Math.min(Ia.calculateValueBetween(n,l,s),1),m=e.show.horseshoe_style;let p=e.color0,g=e.color1,b=e.color1_offset,f=e.angleCoords,y=e.stroke_color;if("fixed"===m)y=e.horseshoe_state.color,p=e.horseshoe_state.color,g=e.horseshoe_state.color,b="0%";else if("autominmax"===m){const t=Ia.calculateStrokeColor(s,e.colorStopsMinMax,!0);p=t,g=t,b="0%"}else if("colorstop"===m||"colorstopgradient"===m){const t=Ia.calculateStrokeColor(s,e.colorStops,"colorstopgradient"===m);p=t,g=t,b="0%"}else"lineargradient"===m&&(f={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},b=`${Math.round(100*(1-u))}%`);return{...e,horseshoe_scale:{...e.horseshoe_scale,...i},dashArray:c,dashOffset:d,bidirectional_negative:h,stroke_color:y,color0:p,color1:g,color1_offset:b,angleCoords:f}})),this.horseshoes.length>0){const e=this.horseshoes[0];this.dashArray=e.dashArray,this.dashOffset=e.dashOffset,this.bidirectional_negative=e.bidirectional_negative,this.stroke_color=e.stroke_color,this.color0=e.color0,this.color1=e.color1,this.color1_offset=e.color1_offset,this.angleCoords=e.angleCoords}this.config.animations&&Object.keys(this.config.animations).map((e=>{const t=e.substr(Number(e.indexOf(".")+1));return this.config.animations[e].map((e=>this.entities[t].state.toLowerCase()===e.state.toLowerCase()&&(e.vlines&&e.vlines.forEach((e=>this._updateAnimationStyles("vlines",e))),e.hlines&&e.hlines.forEach((e=>this._updateAnimationStyles("hlines",e))),e.circles&&e.circles.forEach((e=>this._updateAnimationStyles("circles",e))),e.icons&&e.icons.forEach((e=>{const t=e.animation_id;this.animations.icons[t]&&e.reuse||(this.animations.icons[t]={},this.animations.iconsIcon[t]={});const r=ge.getJsTemplateOrValue(e,e.styles),o=pe.toStyleDict(r);this.animations.icons[t]={...this.animations.icons[t],...o},this.animations.iconsIcon[t]=ge.getJsTemplateOrValue(e,e.icon)})),e.states&&e.states.forEach((e=>this._updateAnimationStyles("states",e))),!0))),!0})),ge.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes}),this.theme.modeChanged=!1,this.requestUpdate()}}_updateAnimationStyles(e,t){const r=t.animation_id;if(null==r)return;const o=ge.getJsTemplateOrValue(t,t.styles),a=pe.toStyleDict(o);this.animations[e][r]={...t.reuse?this.animations[e][r]??{}:{},...a}}_prepareItemColorStops(e){["states","names","areas","circles","hlines","vlines","icons","horseshoes"].forEach((t=>{const r=e.layout?.[t];Array.isArray(r)&&r.forEach((e=>{if(!e.color_stops)return;const t=ge.getJsTemplateOrValue(e,e.color_stops,{resolveKeys:!0});e._colorStops=be.normalize(t)}))}))}_calculateSvgCoordinatesInGroup(e){const t={xpos:ja.calculateSvgDimension(e.xpos),ypos:ja.calculateSvgDimension(e.ypos)},r=this.config.layout?.groups?.[e.group];if(!e.group||!r)return t;return{xpos:ja.calculateSvgDimension(r.xpos+e.xpos-50),ypos:ja.calculateSvgDimension(r.ypos+e.ypos-50)}}_computeGroupDimensions(e){const t=e.layout?.groups;t&&Object.entries(t).forEach((([e,t])=>{t.svg={xpos:ja.calculateSvgDimension(t.xpos),ypos:ja.calculateSvgDimension(t.ypos)}}))}_computeSvgDimensions(e){const t=e.layout;t?.names&&t.names.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.states&&t.states.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.areas&&t.areas.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.icons&&t.icons.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e)})),t?.hlines&&t.hlines.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.length=ja.calculateSvgDimension(e.length)})),t?.vlines&&t.vlines.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.length=ja.calculateSvgDimension(e.length)})),t?.circles&&t.circles.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.radius=e.radius})),this?.horseshoes&&this.horseshoes.forEach((e=>{e.svg=this._calculateSvgCoordinatesInGroup(e),e.svg.radius=ja.calculateSvgDimension(e.radius),e.svg.tickmarksRadius=ja.calculateSvgDimension(e.tickmarks_radius),e.svg.rotateX=e.svg.xpos,e.svg.rotateY=e.svg.ypos}))}_resolveSameAsItems(e){return e.map(((e,t,r)=>{if(void 0===e.same_as)return e;const o=r[e.same_as];if(!o)throw new Error(`same_as '${e.same_as}' not found for item ${t}`);const{same_as:a,...s}=e;return La.mergeDeep(o,s)}))}_resolveSectionSameAs(e){["horseshoes","states","names","areas","circles","hlines","vlines","icons"].forEach((t=>{const r=e.layout?.[t];Array.isArray(r)&&(e.layout[t]=this._resolveSameAsItems(r))}))}setConfig(e){try{if(e=JSON.parse(JSON.stringify(e)),this.dev={...e.dev},!e.entities)throw Error("No entities defined");if(!e.layout)throw Error("No layout defined");e?.palettes&&Ja.loadAll(e?.palettes).then((e=>{console.log("setConfig, finally loaded palettes",e),this.palettes=e;const t=this.hass?.themes?.darkMode?"dark":"light";Ia.setElement(this),Ja.applyAll(this,e,t),this.palettesLoaded||(Ia.colorCache={},Object.keys(Ia.colorCache).filter((e=>e.startsWith("var("))).forEach((e=>delete Ia.colorCache[e])),this.palettesLoaded=!0,this.setHass(this._hass,!0)),this.requestUpdate()})),this._resolveSectionSameAs(e),ge.setContext({hass:this._hass,config:e,entities:this.entities,horseshoes:this.horseshoes});const t=this._resolveEntityConfigs(e);if(t){if("sensor"!==_e(t[0].entity)&&t[0].attribute&&!isNaN(t[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}t.forEach((e=>{e.tap_action||(e.tap_action={...Wa})}));const r={texts:[],card_filter:"card--filter-none",bar_mode:e.bar_mode||"normal",...e,show:{...Ya,...e.show}};this.horseshoes=Ua.setConfig(e,ge);const o=this.horseshoes?.[0];o&&(this.colorStops=o.colorStops,this.colorStopsMinMax=o.colorStopsMinMax,this.color0=o.color0,this.color1=o.color1,this.angleCoords=o.angleCoords,this.color1_offset=o.color1_offset),this._prepareItemColorStops(r),this.config=r,this.bar_mode=r.bar_mode||"normal",this.config.layout?.icons&&this.config.layout.icons.forEach(((e,t)=>{this.iconsId[t]=Math.random().toString(36).substr(2,9)})),this.aspectratio=(this.config.layout.aspectratio||this.config.aspectratio||"1/1").trim();const a=this.aspectratio.split("/");this.viewBox||(this.viewBox={}),this.viewBox.width=a[0]*Va,this.viewBox.height=a[1]*Va,this._computeGroupDimensions(this.config),this._computeSvgDimensions(this.config),ge.setContext({hass:this._hass,config:this.config,entities:this.entities,horseshoes:this.horseshoes})}catch(t){throw console.error("[FHC setConfig] CONFIG ERROR",{error:t,message:t?.message,stack:t?.stack,rawConfig:e,horseshoes:this.horseshoes}),t}}_getItemStateValue(e={}){const t=e.entity_index??0,r=this.entities?.[t],o=this.config?.entities?.[t];if(!r)return;const a=o?.attribute;return a&&r.attributes&&void 0!==r.attributes[a]?r.attributes[a]:r.state}_getItemColorFromStops(e={}){if(!e._colorStops)return;const t=this._getItemStateValue(e),r=Number(t);return Number.isFinite(r)?Ia.calculateStrokeColor(r,e._colorStops,!0===e.colorstop_gradient):void 0}connectedCallback(){console.log("connectedCallback",this.cardId),super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback()}render({config:e}=this){console.log("render",this.cardId);const t=ge.getJsTemplateOrValue({entity_index:0},e?.styles),r=pe.toStyleDict(t);return F`
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
    `}_renderOriginalTickMarks(e,t){if(!1===e.show?.scale_tickmarks)return q``;const r=e.horseshoe_scale,o=Number(r.min),a=Number(r.max),s=a-o;if(!s)return q``;const i={entity_index:e.entity_index},n=ge.getJsTemplateOrValue(i,e?.horseshoe_tickmarks?.styles),l=pe.toStyleDict(n),c=e.svg.xpos,d=e.svg.ypos,h={transformOrigin:`${c}px ${d}px`};void 0!==e?.horseshoe_tickmarks?.fill&&(h.fill=e.horseshoe_tickmarks.fill);const u=r.color||"var(--primary-background-color)";h.fill=u;const m={...l,...h},p=r.ticksize||s/10,g=e.arc_degrees||260,b=r.width?r.width/2:3,f=o%p,y=o+(0===f?0:p-f);if(y>a)return q``;const v=Math.floor((a-y)/p)+1,_=Array.from({length:v},((t,r)=>{const a=(g/2-(y+r*p-o)/s*g)*Math.PI/180;return q`
      <circle
        cx="${c-Math.sin(a)*e.tickmarksRadiusSize}"
        cy="${d-Math.cos(a)*e.tickmarksRadiusSize}"
        r="${b}"
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
  `}_renderHorseShoe(e,t){if(!1===e.show?.horseshoe)return q``;const r=e.svg.xpos,o=e.svg.ypos,a=e.svg.rotateX,s=e.svg.rotateY,i=e.bar_mode||"normal",n=`${e.svg.radius}px`,l=e.horseshoe_scale.color||"#000000",c=e.horseshoe_scale.width||6,d=e.horseshoe_state.width||12,h=-90-(e.arc_degrees??260)/2,u=`${e.horseshoePathLength},${e.circlePathLength}`,m=`horseshoe__gradient-${this.cardId}-${t}`,p={entity_index:e.entity_index},g=ge.getJsTemplateOrValue(p,e.horseshoe_scale?.styles),b=pe.toStyleDict(g),f={stroke:l,strokeWidth:c,strokeDasharray:u,strokeLinecap:"round"};void 0!==e.horseshoe_scale?.fill&&(f.fill=e.horseshoe_scale.fill);const y={fill:"none","stroke-linecap":"round",...b,...f},v=ge.getJsTemplateOrValue(p,e.horseshoe_state?.styles),_=pe.toStyleDict(v),x={stroke:`url('#${m}')`,strokeDasharray:e.dashArray,strokeDashoffset:e.dashOffset,strokeWidth:d};void 0!==e.horseshoe_state?.fill&&(x.fill=e.horseshoe_state.fill);const $={fill:"none",transition:"all 2.5s ease-out",strokeLinecap:"round",..._,...x},w=e.rotate?`rotate(${e.rotate})`:"",k={};void 0!==y.opacity&&(k.opacity=y.opacity),void 0!==y.animation&&(k.animation=y.animation);const M=ge.getJsTemplateOrValue(p,e.horseshoe_labels?.background?.styles),S={...pe.toStyleDict(M)},C=ge.getJsTemplateOrValue(p,e.horseshoe_labels?.badges?.styles),A={...pe.toStyleDict(C)},N=ge.getJsTemplateOrValue(p,e.horseshoe_labels?.styles),T={...pe.toStyleDict(N)},z=ge.getJsTemplateOrValue(p,e.horseshoe_tickmarks?.ticks_major?.styles),E={...pe.toStyleDict(z)},P=ge.getJsTemplateOrValue(p,e.horseshoe_tickmarks?.ticks_minor?.styles),I={...pe.toStyleDict(P)},V="bidirectional"===i?-90:h;return this?.dev?.debug_bidirectional&&console.log("Render Horseshoe: Card ",this.cardId,"barMode: ",i),q`
      <g id="horseshoe__svg__group-${t}" class="horseshoe__svg__group"
        transform="${w} ${this._getGroupScaleTransform(e)}"
        style="${this._getGroupScaleStyle(e)}"
      >
        <g style=${me(k)}>
          ${this._renderHorseshoeScale(e,t)}
        </g>

        <g style=${me(S)}>
          ${this._renderHorseshoeLabelBackground(e,t)}
        </g>

        <g>
          <circle id="horseshoe__state__value-${t}" class="horseshoe__state__value"
            cx="${r}px" cy="${o}px" r="${n}"
            transform="rotate(${V} ${a} ${s})"
            style=${me($)} />
          ${this._renderOriginalTickMarks(e,t)}
        </g>

        <g style=${me(I)}>
          ${this._renderHorseshoeTicks(e,t,"ticks_minor")}
        </g>

        <g style=${me(E)}>
          ${this._renderHorseshoeTicks(e,t,"ticks_major")}
        </g>

        <g style=${me(A)}>
          ${this._renderHorseshoeLabelBadges(e,t)}
        </g>

        <g style=${me(T)}>
          ${this._renderHorseshoeLabels(e,t,w)}
        </g>
      </g>
    `}_renderEntityName(e){const t=e.entity_index??0,r=ge.getJsTemplateOrValue(e,e.styles),o={"font-size":"1.5em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...pe.toStyleDict(r)},a={...this.animations?.names?.[e.animation_id]??{}},s=this._getItemColorFromStops(e);s&&(a.stroke=s);const i={...o,...a},n=this.textEllipsis(this._buildName(this.entities[e.entity_index],this.resolvedEntityConfigs[e.entity_index]),e?.max_characters??e?.ellipsis);return q`
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
        `}_renderEntityNames(){const{layout:e}=this.config;if(!e?.names)return q``;const t=e.names.map((e=>this._renderEntityName(e)));return q`${t}`}_renderEntityArea(e){const t=e.entity_index??0,r=ge.getJsTemplateOrValue(e,e.styles),o={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...pe.toStyleDict(r)},a={...pe.toStyleDict(this.animations?.areas?.[e.animation_id]??{})},s=this._getItemColorFromStops(e);s&&(a.stroke=s);const i={...o,...a},n=this.textEllipsis(this._buildArea(this.entities[e.entity_index],this.resolvedEntityConfigs[e.entity_index]),e?.max_characters??e?.ellipsis);return q`
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
      `}_renderEntityAreas(){const{layout:e}=this.config;if(!e?.areas)return q``;const t=e.areas.map((e=>this._renderEntityArea(e)));return q`${t}`}_getGroupScaleTransform(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;if(!t?.scale&&!e?.flip)return"";const r=t?.scale?.x??t?.scale??1,o=t?.scale?.y??t?.scale??1;return`scale(${r*("x"===e?.flip||"both"===e?.flip?-1:1)}, ${o*("y"===e?.flip||"both"===e?.flip?-1:1)})`}_getGroupScaleTransformV2(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;if(!t?.scale&&!e?.flip_x&&!e?.flip_y)return"";const r=t?.scale?.x??t?.scale??1,o=t?.scale?.y??t?.scale??1;return`scale(${r*("x"===e?.flip||"both"===e?.flip?-1:1)}, ${o*("y"===e?.flip||"both"===e?.flip?-1:1)})`}_getGroupScaleTransformV1(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;if(!t?.scale)return"";return`scale(${t.scale?.x??t.scale}, ${t.scale?.y??t.scale})`}_getGroupScaleStyle(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;return t?.scale&&t.svg?`transform-origin:${t.svg.xpos}px ${t.svg.ypos}px; transform-box:view-box;`:`transform-origin:${e.svg.xpos}px ${e.svg.ypos}px; transform-box:view-box;`}_getGroupScaleStyleV1(e){const t=e?.group?this.config?.layout?.groups?.[e.group]:void 0;return t?.scale&&t.svg?`transform-origin:${t.svg.xpos}px ${t.svg.ypos}px; transform-box:view-box;`:""}_renderEntityState(e){if(!e)return q``;const t=e.entity_index??0,r=e.svg.xpos??Oa,o=e.svg.ypos??Oa,a=e.dx?e.dx:"0",s=e.dy?e.dy:"0",i=ge.getJsTemplateOrValue(e,e.styles),n=pe.toStyleDict(i),l=e.uom??{},c=ge.getJsTemplateOrValue(e,l.styles),d=pe.toStyleDict(c),h=l.dx??"0.1",u=l.dy??"-0.45";let m={};this.animations?.states?.[e.animation_id]&&(m={...this.animations.states[e.animation_id]});const p=this._getItemColorFromStops(e);p&&(m.fill=p);const g={"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle",...n,...m},b=g["font-size"];let f=.5,y="em";const v=String(b).trim().match(/^(\d*\.?\d+)([a-z%]+)$/i);v?(f=.6*Number(v[1]),y=v[2]):console.error("Cannot determine font-size for state",b);const _={"font-size":`${f}${y}`},x={...g,opacity:"0.7",..._,...d},$=this.entities[t],w=this.resolvedEntityConfigs[t]??{},k=this._formatEntityStateParts($,w);let M="",S="";k.forEach((e=>{"unit"===e.type?S+=e.value:"value"===e.type&&(M+=e.value)})),M=M.trim(),S=S.trim();const C=this._buildUom($,w,S);return q`
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
            dy="${s}em"
            style=${me(g)}
          >${M}</tspan><tspan
            class="state__uom"
            dx="${h}em"
            dy="${u}em"
            style=${me(x)}
          >${C}</tspan>
        </text>
      </g>
    `}_renderEntityStates(){const{layout:e}=this.config;if(!e)return;if(!e.states)return;const t=e.states.map((e=>q`
            ${this._renderEntityState(e)}
          `));return q`${t}`}computeEntityColor(e){if(!e||"off"===e.state||"unavailable"===e.state||"unknown"===e.state)return"var(--state-icon-color)";const t=e.state;if(!isNaN(t)||t.endsWith("W")||t.endsWith("kWh")||t.endsWith("V"))return"var(--state-icon-color)";const r=e.entity_id.split(".")[0],o=e.attributes.device_class;if("sensor"===r)return"var(--state-icon-color)";if("light"===r&&e.attributes.rgb_color&&"on"===t){const[t,r,o]=e.attributes.rgb_color;return`rgb(${t}, ${r}, ${o})`}return"binary_sensor"===r&&o&&"on"===t?`var(--state-binary_sensor-${o}-on-color, var(--state-icon-active-color))`:"climate"===r?`var(--state-climate-${t}-color, var(--state-icon-active-color))`:"on"===t?`var(--state-${r}-active-color, var(--state-${r}-color, var(--state-icon-active-color)))`:"var(--state-icon-color)"}_renderIcon(e,t){if(!e)return;e.entity=e.entity?e.entity:0,this.iconCache||={},this.iconsSvg||=[],this.pendingIconPath||=[];const r=12*(e.icon_size?e.icon_size:e.size?e.size:2),o=e.svg.xpos,a=e.svg.ypos,s=e.align?e.align:"center",i="center"===s?.5:"start"===s?-1:1;let n=o-r*i,l=a-r*i,c=r;const d=e.entity_index??0,h=this.entities[d],u=Ia.getHaEntityIconStyle(h),m={};m.fill=u.fill,m.color=u.color,m.filter=u.filter;const p=ge.getJsTemplateOrValue(e,e.styles);let g=pe.toStyleDict(p);const b=this.animations?.icons?.[e.animation_id]??{},f=this._getItemColorFromStops(e);f&&(g.fill=f),g={...m,...g,...b};const y=this._buildMyIcon(this.entities[d],this.resolvedEntityConfigs[d],this.animations?.iconsIcon?.[e.animation_id]);if(this.iconCache[y])this.iconsSvg[t]=this.iconCache[y];else if(this.iconsSvg[t]=void 0,this.pendingIconPath[t]!==y){this.pendingIconPath[t]=y;let e=0;const r=40,o=50,a=()=>{if(this.pendingIconPath[t]!==y)return;const s=this._getRenderedHaIconPath(t);if(s)return this.iconsSvg[t]=s,this.iconCache[y]=s,this.pendingIconPath[t]=void 0,void this.requestUpdate();e+=1,e>=r?this.pendingIconPath[t]=void 0:window.setTimeout(a,o)};(this?.updateComplete&&"function"==typeof this.updateComplete.then||this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((e=>window.requestAnimationFrame(e)))).then((()=>{window.setTimeout(a,0)}))}const v=this.iconsSvg[t];if(v){const s=o-r*i,n=a-.5*r-.25*r,l=r/24,c=e.rotate??0,d=s+12*l,h=n+12*l;return g["transform-origin"]??="0 0",q`
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
          `));return q`${t}`}_renderHorizontalLine(e){const t=e.entity_index??0,r=ge.getJsTemplateOrValue(e,e.styles),o={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2",...pe.toStyleDict(r)},a={...pe.toStyleDict(this.animations?.hlines?.[e.animation_id]??{})},s=this._getItemColorFromStops(e);s&&(a.stroke=s);const i={...o,...a};return q`
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
  `}_renderHorizontalLines(){const{layout:e}=this.config;if(!e?.hlines)return q``;const t=e.hlines.map((e=>this._renderHorizontalLine(e)));return q`${t}`}_renderVerticalLine(e){const t=e.entity_index??0,r=ge.getJsTemplateOrValue(e,e.styles),o={"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2",...pe.toStyleDict(r)},a={...pe.toStyleDict(this.animations?.vlines?.[e.animation_id]??{})},s=this._getItemColorFromStops(e);s&&(a.stroke=s);const i={...o,...a};return q`
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
    `}_renderVerticalLines(){const{layout:e}=this.config;if(!e?.vlines)return q``;const t=e.vlines.map((e=>this._renderVerticalLine(e)));return q`${t}`}_renderCircle(e){const t=e.entity_index??0,r=ge.getJsTemplateOrValue(e,e.styles),o={...pe.toStyleDict(r)},a={...pe.toStyleDict(this.animations?.circles?.[e.animation_id]??{})},s=this._getItemColorFromStops(e);s&&(a.stroke=s);const i={...o,...a};return q`
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
    `}_renderCircles(){const{layout:e}=this.config;if(!e?.circles)return q``;const t=e.circles.map((e=>this._renderCircle(e)));return q`${t}`}_handleClick(e,t,r,o,a){let s;switch(o.action){case"more-info":s=new Event("hass-more-info",{composed:!0}),s.detail={entityId:a},e.dispatchEvent(s);break;case"navigate":if(!o.navigation_path)return;window.history.pushState(null,"",o.navigation_path),s=new Event("location-changed",{composed:!0}),s.detail={replace:!1},window.dispatchEvent(s);break;case"call-service":{if(!o.service)return;const[e,r]=o.service.split(".",2),a={...o.service_data};t.callService(e,r,a);break}case"fire-dom-event":s=new Event("ll-custom",{composed:!0,bubbles:!0}),s.detail=o,e.dispatchEvent(s)}}handlePopup(e,t){e.stopPropagation();const r=this.resolvedEntityConfigs.find((e=>e.entity===t.entity_id)),o=r?.tap_action??this.config?.tap_action??{action:"more-info"};this._handleClick(this,this._hass,this.config,o,t.entity_id)}textEllipsis(e,t){return t&&t<e.length?e.slice(0,t-1).concat("..."):e}_buildArea(e,t){if(t.area)return t.area;if(!this._hass||!this._hass.areas)return"";const r=this._hass.entities&&this._hass.entities[t.entity];let o=r?r.area_id:null;if(!o&&r&&r.device_id&&this._hass.devices){const e=this._hass.devices[r.device_id];o=e?e.area_id:null}if(o){const e=this._hass.areas[o];return e?e.name:""}return"?"}_buildName(e,t){return t.name??e.attributes.friendly_name??e?.entity_id??"?"}_buildIcon(e,t,r){return r||t?.icon||e?.attributes?.icon||Me(e)}_buildUom(e,t,r){return t.unit||r||""}_buildState(e,t){if(void 0===e)return e;if(null===e)return e;if(t.convert){let r,o,a=t.convert.match(/(^\w+)\((\d+)\)/);switch(null===a?r=t.convert:3===a.length&&(r=a[1],o=Number(a[2])),r){case"brightness_pct":e="undefined"===e?"undefined":`${Math.round(e/255*100)}`;break;case"multiply":e=`${Math.round(e*o)}`;break;case"divide":e=`${Math.round(e/o)}`;break;case"rgb_csv":case"rgb_hex":if(t.attribute){let o=this._hass.states[t.entity];switch(o.attributes.color_mode){case"unknown":case"onoff":case"brightness":case"white":break;case"color_temp":if(o.attributes.color_temp_kelvin){let t=_a(o.attributes.color_temp_kelvin);const a=ba(t);a[1]<.4&&(a[1]<.1?a[2]=225:a[1]=.4),t=fa(a),t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:ga(t)}else e="rgb_csv"===r?"255,255,255":"#ffffff00";break;case"hs":{let t=ya([o.attributes.hs_color[0],o.attributes.hs_color[1]/100]);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:ga(t)}break;case"rgb":{const t=ba(this.stateObj.attributes.rgb_color);t[1]<.4&&(t[1]<.1?t[2]=225:t[1]=.4);const o=fa(t);e="rgb_csv"===r?o.toString():ga(o)}break;case"rgbw":{let t=(e=>{const[t,r,o,a]=e;return ka([t,r,o,a],[t+a,r+a,o+a])})(o.attributes.rgbw_color);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:ga(t)}break;case"rgbww":{let t=Sa(o.attributes.rgbww_color,o.attributes?.min_color_temp_kelvin,o.attributes?.max_color_temp_kelvin);t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:ga(t)}break;case"xy":if(o.attributes.hs_color){let t=ya([o.attributes.hs_color[0],o.attributes.hs_color[1]/100]);const a=ba(t);a[1]<.4&&(a[1]<.1?a[2]=225:a[1]=.4),t=fa(a),t[0]=Math.round(t[0]),t[1]=Math.round(t[1]),t[2]=Math.round(t[2]),e="rgb_csv"===r?`${t[0]},${t[1]},${t[2]}`:ga(t)}else if(o.attributes.color){let t={};t.l=o.attributes.brightness,t.h=o.attributes.color.h||o.attributes.color.hue,t.s=o.attributes.color.s||o.attributes.color.saturation;let{r:a,g:s,b:i}=Ia.hslToRgb(t);if("rgb_csv"===r)e=`${a},${s},${i}`;else{e=`#${Ia.padZero(a.toString(16))}${Ia.padZero(s.toString(16))}${Ia.padZero(i.toString(16))}`}}else o.attributes.xy_color}}break;default:console.error(`Unknown converter [${r}] specified for entity [${t.entity}]!`)}}return void 0!==e?Number.isNaN(e)?e:e.toString():void 0}_computeEntity(e){return e.substr(e.indexOf(".")+1)}_renderHorseshoeTicksVkapot(e,t,r){const o=e.horseshoe_tickmarks?.[r];if(console.log("_renderHorseshoeTicksticks",r,o),!o)return q``;console.log("_renderHorseshoeTicksticks. GEDEFINIEERD",r,o.ticksize);const a=Number(e.horseshoe_scale.min),s=Number(e.horseshoe_scale.max),i=e.svg.xpos,n=e.svg.ypos,l=e.svg.radius+Number(o.offset);let c=Ba.buildTickValues(a,s,Number(o.ticksize));if("ticks_minor"===r){const t=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);c=c.filter((e=>!Ba.isMajorTick(e,a,t)))}return Ba.renderTicks({cx:i,cy:n,radius:l,values:c,min:a,max:s,arcDegrees:e.arc_degrees,barMode:e.bar_mode,tickWidth:Number(o.width),tickThickness:Number(o.thickness),className:`horseshoe-${r}`})}_renderHorseshoeTicks(e,t,r){if(!e?.show?.ticks)return q``;const o=e.horseshoe_tickmarks;if(!o?.ticks_major&&!o?.ticks_minor)return q``;const a=Number(e.horseshoe_scale.min),s=Number(e.horseshoe_scale.max),i=e.svg.xpos,n=e.svg.ypos,l=e.svg.radius,c=e.bar_mode,d=e.arc_degrees;return Ba.renderScaleTicks({cx:i,cy:n,radius:l,min:a,max:s,arcDegrees:d,barMode:c,colorStops:e.colorStops,ticksMajor:o.ticks_major,ticksMinor:o.ticks_minor,tickType:r})}_renderHorseshoeTicksV2(e,t,r){if(!e?.show?.ticks)return q``;const o=e.horseshoe_tickmarks;if(!o?.ticks_major&&!o?.ticks_minor)return q``;const a=Number(e.horseshoe_scale.min),s=Number(e.horseshoe_scale.max),i=e.svg.xpos,n=e.svg.ypos,l=e.svg.radius,c=e.bar_mode,d=e.arc_degrees,h=o.color;return Ba.renderScaleTicks({cx:i,cy:n,radius:l,min:a,max:s,arcDegrees:d,barMode:c,color:h,ticksMajor:o.ticks_major,ticksMinor:o.ticks_minor,tickType:r})}_renderHorseshoeTicksV1(e,t){if(!e?.show?.ticks)return q``;const r=e.horseshoe_tickmarks;if(!r?.ticks_major&&!r?.ticks_minor)return q``;const o=Number(e.horseshoe_scale.min),a=Number(e.horseshoe_scale.max),s=e.svg.xpos,i=e.svg.ypos,n=e.svg.radius,l=e.bar_mode,c=e.arc_degrees,d=r.color;return Ba.renderScaleTicks({cx:s,cy:i,radius:n,min:o,max:a,arcDegrees:c,barMode:l,color:d,ticksMajor:r.ticks_major,ticksMinor:r.ticks_minor})}_renderHorseshoeScale(e,t){const r=e?.show?.scale_style??"fixed";if("none"===r)return q``;const o=Number(e.horseshoe_scale.min),a=Number(e.horseshoe_scale.max),s=e.svg.xpos,i=e.svg.ypos,n=e.svg.radius,l=e.bar_mode,c=e.arc_degrees,d=e.horseshoe_scale.width,h=e.horseshoe_scale.color,u=e.colorStops;return"colorstop"===r?u?.colors?.length?Ba.renderColorStopScaleSegments({cx:s,cy:i,radius:n,startAngle:-c/2,endAngle:c/2,width:d,colorStops:u,min:o,max:a,arcDegrees:c,barMode:l,gap:u.gap??0,className:"horseshoe-colorstop-scale-segment",lineCap:"round"}):q``:"fixed"===r?Ba.renderFixedScaleSegments({cx:s,cy:i,radius:n,startAngle:-c/2,endAngle:c/2,width:d,color:h,min:o,max:a,arcDegrees:c,barMode:l,segmentSize:0,gap:0,className:"horseshoe-fixed-scale-segment",lineCap:"round"}):q``}_testRenderColorStopScale(e,t){const r=t?.show?.scale_style;if(!r)return q``;const o=Number(t.horseshoe_scale.min),a=Number(t.horseshoe_scale.max),s=t.svg.xpos,i=t.svg.ypos,n=t.svg.radius,l=t.bar_mode,c=t.arc_degrees,d=t.horseshoe_scale.width,h=t.horseshoe_scale.color,u=t.colorStops;return"colorstop"===r?u?.colors?.length?Ba.renderColorStopScaleSegments({cx:s,cy:i,radius:n,startAngle:-c/2,endAngle:c/2,width:d,colorStops:u,min:o,max:a,arcDegrees:c,barMode:l,gap:u.gap??0,className:"horseshoe-colorstop-scale-segment",lineCap:"round"}):q``:"fixed_tickmarks"===r?Ba.renderScaleTicks({cx:s,cy:i,radius:n,min:o,max:a,arcDegrees:c,barMode:l,color:h,ticksMajor:t.horseshoe_scale.ticks_major,ticksMinor:t.horseshoe_scale.ticks_minor}):"fixed"===r?Ba.renderFixedScaleSegments({cx:s,cy:i,radius:n,startAngle:-c/2,endAngle:c/2,width:d,color:h,min:o,max:a,arcDegrees:c,barMode:l,segmentSize:0,gap:0,className:"horseshoe-fixed-scale-segment",lineCap:"round"}):q``}_testRenderColorStopScaleV1(e,t){if("colorstop"===t?.show?.scale_style){console.log("_testRenderColorStopScale, horseshoe",t?.show?.scale_style,e,t,t?.horseshoe_scale);const r=Number(t.horseshoe_scale.min),o=Number(t.horseshoe_scale.max),a=t.svg.xpos,s=t.svg.ypos,i=t.svg.radius,n=t.bar_mode,l=t.arc_degrees,c=t.colorStops;return[{value:r,label:r},...t.colorStops.colors,{value:o,label:o}].filter(((e,t,a)=>{const s=Number(e.value);return Number.isFinite(s)&&s>=r&&s<=o&&a.findIndex((e=>Number(e.value)===s))===t})),q`
      ${t?.colorStops?.colors.length?Ba.renderColorStopScaleSegments({cx:a,cy:s,radius:i,startAngle:-l/2,endAngle:l/2,width:t.horseshoe_scale.width,colorStops:c,min:r,max:o,arcDegrees:l,barMode:n,gap:c.gap??2,className:"horseshoe-colorstop-scale-segment",lineCap:"round"}):q``}
      `}return q``}_renderHorseshoeLabelBackground(e,t){const r=e?.show?.label_background??"none";if("none"===r)return q``;const o=e?.horseshoe_labels?.background??{},a=Number(e.horseshoe_scale.min),s=Number(e.horseshoe_scale.max),i=e.svg.xpos,n=e.svg.ypos,l=e.svg.radius+Number(e?.horseshoe_labels?.offset??e.horseshoe_state.width+2),c=e.bar_mode,d=e.arc_degrees,h=Number(o.width??6),u=o.color,m=Number(o.gap??0),p=e.colorStops;return Ba.getLabelBackgroundExtend({minLabel:a,maxLabel:s,charWidth:Number(e?.horseshoe_labels?.badges?.char_width??4),padding:Number(e?.horseshoe_labels?.badges?.padding??3),radius:l}),"colorstop"===r?p?.colors?.length?Ba.renderColorStopScaleSegments({cx:i,cy:n,radius:l,startAngle:-d/2,endAngle:d/2,width:h,colorStops:p,min:a,max:s,arcDegrees:d,barMode:c,gap:m,className:"horseshoe-label-background-colorstop",lineCap:"round"}):q``:"fixed"===r?Ba.renderFixedScaleSegments({cx:i,cy:n,radius:l,startAngle:-d/2-20,endAngle:d/2+20,width:h,color:u,min:a,max:s,arcDegrees:d,barMode:c,segmentSize:0,gap:0,className:"horseshoe-label-background-fixed",lineCap:"round"}):q``}_renderHorseshoeLabelBadges(e,t){const r=e?.show?.labels_at??"none";if("none"===r||!e?.show?.label_badges)return q``;const o=Number(e.horseshoe_scale.min),a=Number(e.horseshoe_scale.max),s=e.svg.xpos,i=e.svg.ypos,n=e.svg.radius+Number(e?.horseshoe_labels?.offset??e.horseshoe_state.width+2),l=e.bar_mode,c=e.arc_degrees,d=e.colorStops,h=e?.horseshoe_labels?.orientation??"arc",u=e?.horseshoe_labels?.badges??{};let m=[];if("minmax"===r&&(m=[{value:o,label:o},{value:a,label:a}]),"colorstop"===r){if(!d?.colors?.length)return q``;m=[{value:o,label:o},...d.colors,{value:a,label:a}]}if("ticks_major"===r){const t=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);if(!Number.isFinite(t)||t<=0)return q``;m=Ba.buildTickValues(o,a,t).map((e=>({value:e,label:e})))}if("both"===r){const t=d?.colors?.length?[{value:o,label:o},...d.colors,{value:a,label:a}]:[],r=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);m=[...t,...Number.isFinite(r)&&r>0?Ba.buildTickValues(o,a,r).map((e=>({value:e,label:e}))):[]]}m=m.filter((e=>{const t=Number(e.value);return Number.isFinite(t)&&t>=o&&t<=a})).sort(((e,t)=>Number(e.value)-Number(t.value))).filter(((e,t,r)=>{const o=Number(e.value);return r.findIndex((e=>Number(e.value)===o))===t}));const p=Number(e?.horseshoe_labels?.distance_min??0),g=[];return m.forEach((e=>{const t=Number(e.value);if(p<=0)return void g.push(e);const r=g[g.length-1];(!r||Math.abs(t-Number(r.value))>=p)&&g.push(e)})),q`
    ${g.map(((e,r)=>{const d=Number(e.value),m=Ba.valueToAngle(d,o,a,c,l);return Ba.renderLabelBadge({horseshoeIndex:t,index:r,label:e.label??e.value,angle:m,cx:s,cy:i,radius:n,cardId:this.cardId,orientation:h,badge:u})}))}
  `}_renderHorseshoeLabels(e,t,r){const o=e?.show?.labels_at??"none";if("none"===o)return q``;const a=Number(e.horseshoe_scale.min),s=Number(e.horseshoe_scale.max),i=e.svg.xpos,n=e.svg.ypos,l=e.svg.radius+Number(e?.horseshoe_labels?.offset??e.horseshoe_state.width+2),c=e.bar_mode,d=e.arc_degrees,h=e.colorStops,u=e?.horseshoe_labels?.orientation??"arc",m=e?.flip,p={rotation:e?.rotate??0,flipX:"x"===m||"both"===m,flipY:"y"===m||"both"===m};let g=[];if("minmax"===o&&(g=[{value:a,label:a},{value:s,label:s}]),"colorstop"===o){if(!h?.colors?.length)return q``;g=[{value:a,label:a},...h.colors,{value:s,label:s}].filter(((e,t,r)=>{const o=Number(e.value);return Number.isFinite(o)&&o>=a&&o<=s&&r.findIndex((e=>Number(e.value)===o))===t}))}if("ticks_major"===o){const t=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);if(!Number.isFinite(t)||t<=0)return q``;g=Ba.buildTickValues(a,s,t).map((e=>({value:e,label:e})))}if("both"===o){const t=h?.colors?.length?[{value:a,label:a},...h.colors,{value:s,label:s}]:[],r=Number(e.horseshoe_tickmarks?.ticks_major?.ticksize);g=[...t,...Number.isFinite(r)&&r>0?Ba.buildTickValues(a,s,r).map((e=>({value:e,label:e}))):[]].filter((e=>{const t=Number(e.value);return Number.isFinite(t)&&t>=a&&t<=s})).sort(((e,t)=>Number(e.value)-Number(t.value))).filter(((e,t,r)=>{const o=Number(e.value);return r.findIndex((e=>Number(e.value)===o))===t}))}const b=Number(e?.horseshoe_labels?.distance_min??0),f=[];return g.forEach((e=>{const t=Number(e.value);if(b<=0)return void f.push(e);const r=f[f.length-1];(!r||Math.abs(t-Number(r.value))>=b)&&f.push(e)})),q`
      ${f.map(((e,r)=>{const o=Number(e.value),h=Ba.valueToAngle(o,a,s,d,c);return Ba.renderLabel({horseshoeIndex:t,index:r,label:e.label??e.value,angle:h,cx:i,cy:n,radius:l,cardId:this.cardId,orientation:u,isMin:!1,isMax:!1,transformContext:p})}))}
    `}_renderColorStopLabels(e,t,r,o,a){if("colorstop"!==t?.show?.labels_at)return console.log("_renderColorStopLabels, NO labels_at",t?.show),q``;if(!o?.colors?.length)return console.log("renderColorStopLabels, no colorstops",t),q``;console.log("entering _renderColorStopLabels for",e,t);const s=Number(r.min),i=Number(r.max),n=t.svg.xpos,l=t.svg.ypos,c=t.svg.radius+Number(t?.horseshoe_labels?.offset??t.horseshoe_state.width+2),d=t.bar_mode;let h=[];"colorstop"===t?.show?.labels_at&&(h=[{value:s,label:s},...o.colors,{value:i,label:i}].filter(((e,t,r)=>{const o=Number(e.value);return Number.isFinite(o)&&o>=s&&o<=i&&r.findIndex((e=>Number(e.value)===o))===t})));const u=Number(t?.horseshoe_labels?.distance_min??0),m=[];return h.forEach(((e,t)=>{const r=Number(e.value);if(0===t||t===h.length-1||u<=0)return void m.push(e);const o=m[m.length-1];(!o||Math.abs(r-Number(o.value))>=u)&&m.push(e)})),console.log("_renderColorStopLabels, labelStops ",h,m),q`
      ${m.map(((t,r)=>{const o=Number(t.value),h=Ba.valueToAngle(o,s,i,a,d);return Ba.renderColorStopLabel({horseshoeIndex:e,index:r,label:t.label??t.value,angle:h,cx:n,cy:l,radius:c,cardId:this.cardId,isMin:!1,isMax:!1})}))}
  `}_renderColorStopLabelsV2(e,t,r,o){const a=Number(t.min),s=Number(t.max),i=e.svg.xpos,n=e.svg.ypos,l=e.svg.radius+e.horseshoe_state.width,c=e.bar_mode;return q`
    ${r.filter((e=>{const t=Number(e.value);return Number.isFinite(t)&&t>=a&&t<=s})).map(((e,t)=>{const r=Number(e.value),d=Ba.valueToAngle(r,a,s,o,c);return Ba.renderColorStopLabel({index:t,label:e.label??e.value,angle:d,cx:i,cy:n,radius:l,cardId:this.cardId})}))}
  `}_renderColorStopLabelsV1(e,t,r,o){const a=Number(t.min),s=Number(t.max),i=e.svg.xpos,n=e.svg.ypos,l=e.svg.radius+e.horseshoe_state.width;return q`
    ${r.filter((e=>{const t=Number(e.value);return Number.isFinite(t)&&t>=a&&t<=s})).map(((e,t)=>{const r=Number(e.value),c=-o/2+(r-a)/(s-a)*o;return Ba.renderColorStopLabel({index:t,label:e.label??e.value,angle:c,cx:i,cy:n,radius:l,cardId:this.cardId})}))}
  `}getCardSize(){return 4}}customElements.get("flex-horseshoe-card")||customElements.define("flex-horseshoe-card",Xa);

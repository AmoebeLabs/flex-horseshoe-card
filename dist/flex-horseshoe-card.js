/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let a=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,i))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:o,defineProperty:n,getOwnPropertyDescriptor:l,getOwnPropertyNames:h,getOwnPropertySymbols:c,getPrototypeOf:d}=Object,u=globalThis,p=u.trustedTypes,g=p?p.emptyScript:"",m=u.reactiveElementPolyfillSupport,f=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!o(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let _=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&n(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:a}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);a?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=d(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...c(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const t=this._$Eu(e,i);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of s){const s=document.createElement("style"),a=t.litNonce;void 0!==a&&s.setAttribute("nonce",a),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const a=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==a?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const r=a.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,a){if(void 0!==t){const r=this.constructor;if(!1===s&&(a=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??v)(a,e)||i.useDefault&&i.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:a},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==a||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM()}updated(t){}firstUpdated(t){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[f("elementProperties")]=new Map,_[f("finalized")]=new Map,m?.({ReactiveElement:_}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,w=x.trustedTypes,$=w?w.createPolicy("flex-horseshoe-card-lit-html",{createHTML:t=>t}):void 0,k="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+S,A=`<${M}>`,T=document,C=()=>T.createComment(""),E=t=>null===t||"object"!=typeof t&&"function"!=typeof t,I=Array.isArray,D="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,N=/>/g,P=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),G=/'/g,F=/"/g,B=/^(?:script|style|textarea|title)$/i,O=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),H=O(1),V=O(2),L=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),q=new WeakMap,U=T.createTreeWalker(T,129);function W(t,e){if(!I(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==$?$.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,s=[];let a,r=2===e?"<svg>":3===e?"<math>":"",o=z;for(let n=0;n<i;n++){const e=t[n];let i,l,h=-1,c=0;for(;c<e.length&&(o.lastIndex=c,l=o.exec(e),null!==l);)c=o.lastIndex,o===z?"!--"===l[1]?o=R:void 0!==l[1]?o=N:void 0!==l[2]?(B.test(l[2])&&(a=RegExp("</"+l[2],"g")),o=P):void 0!==l[3]&&(o=P):o===P?">"===l[0]?(o=a??z,h=-1):void 0===l[1]?h=-2:(h=o.lastIndex-l[2].length,i=l[1],o=void 0===l[3]?P:'"'===l[3]?F:G):o===F||o===G?o=P:o===R||o===N?o=z:(o=P,a=void 0);const d=o===P&&t[n+1].startsWith("/>")?" ":"";r+=o===z?e+A:h>=0?(s.push(i),e.slice(0,h)+k+e.slice(h)+S+d):e+S+(-2===h?n:d)}return[W(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class X{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let a=0,r=0;const o=t.length-1,n=this.parts,[l,h]=Y(t,e);if(this.el=X.createElement(l,i),U.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=U.nextNode())&&n.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(k)){const e=h[r++],i=s.getAttribute(t).split(S),o=/([.?@])?(.*)/.exec(e);n.push({type:1,index:a,name:o[2],strings:i,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?it:Q}),s.removeAttribute(t)}else t.startsWith(S)&&(n.push({type:6,index:a}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=w?w.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],C()),U.nextNode(),n.push({type:2,index:++a});s.append(t[e],C())}}}else if(8===s.nodeType)if(s.data===M)n.push({type:2,index:a});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)n.push({type:7,index:a}),t+=S.length-1}a++}}static createElement(t,e){const i=T.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,s){if(e===L)return e;let a=void 0!==s?i._$Co?.[s]:i._$Cl;const r=E(e)?void 0:e._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),void 0===r?a=void 0:(a=new r(t),a._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=a:i._$Cl=a),void 0!==a&&(e=J(t,a._$AS(t,e.values),a,s)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??T).importNode(e,!0);U.currentNode=s;let a=U.nextNode(),r=0,o=0,n=i[0];for(;void 0!==n;){if(r===n.index){let e;2===n.type?e=new K(a,a.nextSibling,this,t):1===n.type?e=new n.ctor(a,n.name,n.strings,this,t):6===n.type&&(e=new st(a,this,t)),this._$AV.push(e),n=i[++o]}r!==n?.index&&(a=U.nextNode(),r++)}return U.currentNode=T,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}let K=class t{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),E(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==L&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>I(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==j&&E(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=X.createElement(W(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Z(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new X(t)),e}k(e){I(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,a=0;for(const r of e)a===i.length?i.push(s=new t(this.O(C()),this.O(C()),this,this.options)):s=i[a],s._$AI(r),a++;a<i.length&&(this._$AR(s&&s._$AB.nextSibling,a),i.length=a)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}};class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,a){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(t,e=this,i,s){const a=this.strings;let r=!1;if(void 0===a)t=J(this,t,e,0),r=!E(t)||t!==this._$AH&&t!==L,r&&(this._$AH=t);else{const s=t;let o,n;for(t=a[0],o=0;o<a.length-1;o++)n=J(this,s[i+o],e,o),n===L&&(n=this._$AH[o]),r||=!E(n)||n!==this._$AH[o],n===j?t=j:t!==j&&(t+=(n??"")+a[o+1]),this._$AH[o]=n}r&&!s&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}class et extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==j)}}class it extends Q{constructor(t,e,i,s,a){super(t,e,i,s,a),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??j)===L)return;const i=this._$AH,s=t===j&&i!==j||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==j&&(i===j||s);s&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const at=x.litHtmlPolyfillSupport;at?.(X,K),(x.litHtmlVersions??=[]).push("3.3.2");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let ot=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let a=s._$litPart$;if(void 0===a){const t=i?.renderBefore??null;s._$litPart$=a=new K(e.insertBefore(C(),t),t,void 0,i??{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}};ot._$litElement$=!0,ot.finalized=!0,rt.litElementHydrateSupport?.({LitElement:ot});const nt=rt.litElementPolyfillSupport;nt?.({LitElement:ot}),(rt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt=1,ht=2,ct=t=>(...e)=>({_$litDirective$:t,values:e});let dt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ut="important",pt=" !"+ut,gt=ct(class extends dt{constructor(t){if(super(t),t.type!==lt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`}),"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const s of this.ft)null==e[s]&&(this.ft.delete(s),s.includes("-")?i.removeProperty(s):i[s]=null);for(const s in e){const t=e[s];if(null!=t){this.ft.add(s);const e="string"==typeof t&&t.endsWith(pt);s.includes("-")||e?i.setProperty(s,e?t.slice(0,-11):t,e?ut:""):i[s]=t}}return L}}),mt=((t,...e)=>{const s=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new a(s,t,i)})`
      :host {
        cursor: default;
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
`,ft=(t,e,i,s)=>{s=s||{},i=null==i?{}:i;const a=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return a.detail=i,t.dispatchEvent(a),a};function yt(t,e){let i=Number(e);return void 0!==t.min&&(i=Math.max(Number(t.min),i)),void 0!==t.max&&(i=Math.min(Number(t.max),i)),i}class vt{static numbers=new Map;static booleans=new Map;static selects=new Map;static numberEvent="flex-horseshoe-card:fhs-input-number-changed";static booleanEvent="flex-horseshoe-card:fhs-input-boolean-changed";static selectEvent="flex-horseshoe-card:fhs-input-select-changed";static numberStoragePrefix="flex-horseshoe-card:fhs-input-number";static booleanStoragePrefix="flex-horseshoe-card:fhs-input-boolean";static selectStoragePrefix="flex-horseshoe-card:fhs-input-select";constructor(t,e,i){this.cardId=t,this.entities=e,this.updateCard=i,this.config=void 0,this.stateChanged=!1,this.eventHandler=t=>{const e=this.config.entities.find((e=>e.entity===t.detail.entity_id&&"global"===e.scope));this.config.dev.debug&&console.log("[FHS global input event]",{cardId:this.cardId,entityId:t.detail.entity_id,state:t.detail.state,matched:void 0!==e}),e&&this.replaceEntityState(t.detail.entity_id,t.detail)}}validateConfig(t){this.config=t,t.entities.forEach((t=>{if(t.entity.startsWith("fhs_input_number."))!function(t){if(!Number.isFinite(Number(t.initial)))throw Error(`FHS input number '${t.entity}' requires a numeric initial value`);if(void 0!==t.scope&&!["card","global"].includes(t.scope))throw Error(`FHS input number '${t.entity}' scope must be 'card' or 'global'`);if(t.local=!0,t.scope??="card",t.persist??=!1,t.step??=1,!Number.isFinite(Number(t.step))||Number(t.step)<=0)throw Error(`FHS input number '${t.entity}' step must be a positive number`);if(void 0!==t.min&&!Number.isFinite(Number(t.min)))throw Error(`FHS input number '${t.entity}' min must be numeric`);if(void 0!==t.max&&!Number.isFinite(Number(t.max)))throw Error(`FHS input number '${t.entity}' max must be numeric`);if(void 0!==t.min&&void 0!==t.max&&Number(t.min)>=Number(t.max))throw Error(`FHS input number '${t.entity}' min must be lower than max`);if(void 0!==t.min&&Number(t.initial)<Number(t.min))throw Error(`FHS input number '${t.entity}' initial must not be lower than min`);if(void 0!==t.max&&Number(t.initial)>Number(t.max))throw Error(`FHS input number '${t.entity}' initial must not be higher than max`);if("boolean"!=typeof t.persist)throw Error(`FHS input number '${t.entity}' persist must be a boolean`);if(t.persist&&"global"!==t.scope)throw Error(`FHS input number '${t.entity}' can only persist with scope 'global'`);t.name??=t.entity.split(".",2)[1],t.unit??="",t.decimals??=0,t.tap_action??={action:"none"}}(t);else if(t.entity.startsWith("fhs_input_select."))!function(t){if(!Array.isArray(t.options)||0===t.options.length)throw Error(`FHS input select '${t.entity}' options must be a non-empty array`);if(t.options.some((t=>"string"!=typeof t||0===t.trim().length)))throw Error(`FHS input select '${t.entity}' options must contain non-empty strings`);if(new Set(t.options).size!==t.options.length)throw Error(`FHS input select '${t.entity}' options must be unique`);if(void 0!==t.scope&&!["card","global"].includes(t.scope))throw Error(`FHS input select '${t.entity}' scope must be 'card' or 'global'`);if(t.initial??=t.options[0],!t.options.includes(t.initial))throw Error(`FHS input select '${t.entity}' initial must be one of its options`);if(t.local=!0,t.scope??="card",t.persist??=!1,"boolean"!=typeof t.persist)throw Error(`FHS input select '${t.entity}' persist must be a boolean`);if(t.persist&&"global"!==t.scope)throw Error(`FHS input select '${t.entity}' can only persist with scope 'global'`);t.name??=t.entity.split(".",2)[1],t.icon??="mdi:form-dropdown",t.tap_action??={action:"none"}}(t);else if(t.entity.startsWith("fhs_input_boolean.")){if(void 0===t.initial&&(t.initial=!1),"boolean"!=typeof t.initial)throw Error(`FHS input boolean '${t.entity}' initial must be a boolean`);if(void 0!==t.scope&&!["card","global"].includes(t.scope))throw Error(`FHS input boolean '${t.entity}' scope must be 'card' or 'global'`);if(t.local=!0,t.scope??="card",t.persist??=!1,"boolean"!=typeof t.persist)throw Error(`FHS input boolean '${t.entity}' persist must be a boolean`);if(t.persist&&"global"!==t.scope)throw Error(`FHS input boolean '${t.entity}' can only persist with scope 'global'`);t.name??=t.entity.split(".",2)[1],t.icon??="mdi:toggle-switch",t.tap_action??={action:"none"}}}))}initializeEntities(t){t.forEach(((t,e)=>{t.entity.startsWith("fhs_input_number.")?this.initializeNumberEntity(t,e):t.entity.startsWith("fhs_input_select.")?this.initializeSelectEntity(t,e):t.entity.startsWith("fhs_input_boolean.")&&this.initializeBooleanEntity(t,e)}))}initializeNumberEntity(t,e){const i=(new Date).toISOString();let s={entity_id:t.entity,state:String(Number(t.initial)),last_changed:i,last_updated:i};if("global"===t.scope){if(!vt.numbers.has(t.entity)){if(t.persist){const e=`${vt.numberStoragePrefix}:${t.entity}`,i=localStorage.getItem(e);null!==i&&(s=JSON.parse(i))}vt.numbers.set(t.entity,s)}s=vt.numbers.get(t.entity)}this.entities[e]={...s,attributes:{friendly_name:t.name,icon:t.icon,unit_of_measurement:t.unit,...void 0!==t.min?{min:t.min}:{},...void 0!==t.max?{max:t.max}:{},step:t.step},context:{id:null,parent_id:null,user_id:null}}}initializeBooleanEntity(t,e){const i=(new Date).toISOString();let s={entity_id:t.entity,state:t.initial?"on":"off",last_changed:i,last_updated:i};if("global"===t.scope){if(!vt.booleans.has(t.entity)){if(t.persist){const e=`${vt.booleanStoragePrefix}:${t.entity}`,i=localStorage.getItem(e);null!==i&&(s=JSON.parse(i))}vt.booleans.set(t.entity,s)}s=vt.booleans.get(t.entity)}this.entities[e]={...s,attributes:{friendly_name:t.name,icon:t.icon},context:{id:null,parent_id:null,user_id:null}}}initializeSelectEntity(t,e){const i=(new Date).toISOString();let s={entity_id:t.entity,state:t.initial,last_changed:i,last_updated:i};if("global"===t.scope){if(!vt.selects.has(t.entity)){if(t.persist){const e=`${vt.selectStoragePrefix}:${t.entity}`,a=localStorage.getItem(e);null!==a&&(s=JSON.parse(a)),t.options.includes(s.state)||(s={entity_id:t.entity,state:t.initial,last_changed:i,last_updated:i})}vt.selects.set(t.entity,s)}s=vt.selects.get(t.entity)}this.entities[e]={...s,attributes:{friendly_name:t.name,icon:t.icon,options:[...t.options]},context:{id:null,parent_id:null,user_id:null}}}connected(){window.addEventListener(vt.numberEvent,this.eventHandler),window.addEventListener(vt.booleanEvent,this.eventHandler),window.addEventListener(vt.selectEvent,this.eventHandler)}disconnected(){window.removeEventListener(vt.numberEvent,this.eventHandler),window.removeEventListener(vt.booleanEvent,this.eventHandler),window.removeEventListener(vt.selectEvent,this.eventHandler)}markStateHandled(){this.stateChanged=!1}setNumberValue(t,e){const i=this.config.entities.find((e=>e.entity===t)),s=yt(i,e),a=(new Date).toISOString(),r={entity_id:t,state:String(s),last_changed:a,last_updated:a};if("global"!==i.scope)this.replaceEntityState(t,r);else{if(vt.numbers.set(t,r),i.persist){const e=`${vt.numberStoragePrefix}:${t}`;localStorage.setItem(e,JSON.stringify(r))}ft(window,vt.numberEvent,r)}}changeNumberValue(t,e){const i=this.config.entities.find((e=>e.entity===t)),s=this.config.entities.indexOf(i),a=function(t,e,i){return yt(t,Number(e)+Number(t.step)*i)}(i,"global"===i.scope?Number(vt.numbers.get(t).state):Number(this.entities[s].state),e);this.setNumberValue(t,a)}setBooleanState(t,e){const i=this.config.entities.find((e=>e.entity===t)),s=this.config.entities.indexOf(i),a="global"===i.scope?vt.booleans.get(t).state:this.entities[s].state,r="toggle"===e?"on"===a?"off":"on":"turn_on"===e?"on":"off",o=(new Date).toISOString(),n={entity_id:t,state:r,last_changed:o,last_updated:o};if("global"!==i.scope)this.replaceEntityState(t,n);else{if(vt.booleans.set(t,n),i.persist){const e=`${vt.booleanStoragePrefix}:${t}`;localStorage.setItem(e,JSON.stringify(n))}ft(window,vt.booleanEvent,n)}}setSelectOption(t,e){const i=this.config.entities.find((e=>e.entity===t));if(!i.options.includes(e))throw Error(`FHS input select '${t}' cannot select unknown option '${e}'`);const s=(new Date).toISOString(),a={entity_id:t,state:e,last_changed:s,last_updated:s};if("global"!==i.scope)this.replaceEntityState(t,a);else{if(vt.selects.set(t,a),i.persist){const e=`${vt.selectStoragePrefix}:${t}`;localStorage.setItem(e,JSON.stringify(a))}ft(window,vt.selectEvent,a)}}replaceEntityState(t,e){this.config.entities.forEach(((i,s)=>{i.entity===t&&(this.entities[s]={...this.entities[s],state:e.state,last_changed:e.last_changed,last_updated:e.last_updated})})),this.stateChanged=!0,this.updateCard()}}class bt{static mergeDeep(...t){const e=t=>t&&"object"==typeof t;return t.reduce(((t,i)=>(Object.keys(i).forEach((s=>{const a=t[s],r=i[s];Array.isArray(a)&&Array.isArray(r)?t[s]=a.concat(...r.map((t=>e(t)?this.mergeDeep(Array.isArray(t)?[]:{},t):t))):e(a)&&e(r)?t[s]=this.mergeDeep(a,r):Array.isArray(r)?t[s]=r.map((t=>e(t)?this.mergeDeep(Array.isArray(t)?[]:{},t):t)):e(r)?t[s]=this.mergeDeep({},r):t[s]=r})),t)),{})}}const _t={action:"more-info"};class xt{constructor(t,e){this.element=t,this.inputEntities=e,this.hass=void 0,this.resolvedEntityConfigs=void 0,this.entities=void 0}setHassAndEntities(t,e,i){this.hass=t,this.resolvedEntityConfigs=e,this.entities=i}getGestureConfig(t,e,i){let s=t?.[i];if(void 0===s&&void 0!==e){s=this.resolvedEntityConfigs[e][i],void 0===s&&"tap_action"===i&&(s=_t)}if(void 0===s)return;return(s.actions??[s]).some((t=>{if("more-info"!==t.action)return!1;if(void 0!==t.entity)return t.entity.startsWith("fhs_");if(void 0===e)return!0;const i=this.resolvedEntityConfigs[e].source_entity_index??e;return this.entities[i].entity_id.startsWith("fhs_")}))?void 0:s}getActionHandlerOptions(t,e){return{hasTap:void 0!==this.getGestureConfig(t,e,"tap_action"),hasHold:void 0!==this.getGestureConfig(t,e,"hold_action"),hasDoubleClick:void 0!==this.getGestureConfig(t,e,"double_tap_action")}}getActionEntityId(t,e){if(e.entity)return e.entity;if(void 0===t)return;const i=this.resolvedEntityConfigs[t].source_entity_index??t;return this.entities[i].entity_id}async executeAction(t,e){switch(t.action){case"select-option":{const i=e.split(".")[0];switch(i){case"input_select":case"select":await this.hass.callService(i,"select_option",{option:t.option},{entity_id:e});break;case"fhs_input_select":this.inputEntities.setSelectOption(e,t.option);break;case"input_number":await this.hass.callService("input_number","set_value",{value:t.option},{entity_id:e});break;case"fhs_input_number":this.inputEntities.setNumberValue(e,t.option);break;default:throw Error(`Select option action does not support entity domain '${i}'; configure a perform-action with option(value)`)}break}case"more-info":ft(this.element,"hass-more-info",{entityId:t.entity??e});break;case"toggle":{const i=t.entity??e;i.startsWith("fhs_input_boolean.")?this.inputEntities.setBooleanState(i,"toggle"):await this.hass.callService("homeassistant","toggle",{},{entity_id:i});break}case"perform-action":{const[e,i]=t.perform_action.split(".",2);"fhs_input_number"===e&&"set_value"===i?this.inputEntities.setNumberValue(t.target.entity_id,t.data.value):"fhs_input_select"===e&&"select_option"===i?this.inputEntities.setSelectOption(t.target.entity_id,t.data.option):"fhs_input_number"===e&&["increment","decrement"].includes(i)?this.inputEntities.changeNumberValue(t.target.entity_id,"increment"===i?1:-1):"fhs_input_boolean"===e&&["turn_on","turn_off","toggle"].includes(i)?this.inputEntities.setBooleanState(t.target.entity_id,i):await this.hass.callService(e,i,t.data,t.target);break}case"navigate":window.history[t.navigation_replace?"replaceState":"pushState"](null,"",t.navigation_path),ft(window,"location-changed",{replace:!0===t.navigation_replace});break;case"url":window.open(t.url_path,"_blank");break;case"assist":ft(this.element,"hass-start-voice-assistant",{pipeline_id:t.pipeline_id,start_listening:t.start_listening});break;case"call-service":{const[e,i]=t.service.split(".",2),s=t.target?.entity_id??t.service_data?.entity_id;"fhs_input_number"===e&&"set_value"===i?this.inputEntities.setNumberValue(s,t.service_data?.value):"fhs_input_select"===e&&"select_option"===i?this.inputEntities.setSelectOption(s,t.service_data?.option):"fhs_input_number"===e&&["increment","decrement"].includes(i)?this.inputEntities.changeNumberValue(s,"increment"===i?1:-1):"fhs_input_boolean"===e&&["turn_on","turn_off","toggle"].includes(i)?this.inputEntities.setBooleanState(s,i):await this.hass.callService(e,i,t.service_data,t.target);break}case"fire-dom-event":ft(this.element,"ll-custom",t)}}async executeSliderAction(t,e,i,s){const a=this.getActionEntityId(e,t);let r;if("set-value"===t.action){const t=a.split(".")[0];r={action:"perform-action",perform_action:`${t}.set_value`,target:{entity_id:a},data:{value:i[s]}}}else{if(r=bt.mergeDeep({},t),void 0!==r.value_field){const t=r.value_field.split(".");let e=r;t.slice(0,-1).forEach((t=>{e=e[t]})),e[t[t.length-1]]=i[s],delete r.value_field}void 0!==r.value_fields&&(Object.entries(r.value_fields).forEach((([t,e])=>{const s=t.split(".");let a=r;s.slice(0,-1).forEach((t=>{a=a[t]})),a[s[s.length-1]]=i["lower"===e?0:1]})),delete r.value_fields)}await this.executeAction(r,a)}async handleAction(t,e,i){t.stopPropagation();const s="double_tap"===t.detail.action?"double_tap_action":`${t.detail.action}_action`,a=this.getGestureConfig(e,i,s),r=this.getActionEntityId(i,a),o=a.actions??[a];a.haptic&&ft(this.element,"haptic",a.haptic),await o.reduce(((t,e)=>t.then((()=>this.executeAction(e,r)))),Promise.resolve())}}class wt{constructor(t){this.hass=void 0,this.localeSignature=void 0,this.localeChanged=!1,this.connection=void 0,this.connectedToDom=!1,this.notifyToolsConnected=t,this.connectionReadyHandler=()=>this.notifyToolsConnected()}setHass(t){const e=JSON.stringify(t.locale);this.hass=t,this.localeChanged=e!==this.localeSignature,this.localeSignature=e,this.connection!==t.connection&&(this.connection&&this.connectedToDom&&this.connection.removeEventListener("ready",this.connectionReadyHandler),this.connection=t.connection,this.connectedToDom&&this.connection.addEventListener("ready",this.connectionReadyHandler))}markLocaleHandled(){this.localeChanged=!1}connected(){this.connectedToDom=!0,this.connection&&this.connection.addEventListener("ready",this.connectionReadyHandler)}disconnected(){this.connection&&this.connection.removeEventListener("ready",this.connectionReadyHandler),this.connectedToDom=!1}}const $t=(t,e)=>{if("number"==typeof t)return 3===e?{mode:"rgb",r:(t>>8&15|t>>4&240)/255,g:(t>>4&15|240&t)/255,b:(15&t|t<<4&240)/255}:4===e?{mode:"rgb",r:(t>>12&15|t>>8&240)/255,g:(t>>8&15|t>>4&240)/255,b:(t>>4&15|240&t)/255,alpha:(15&t|t<<4&240)/255}:6===e?{mode:"rgb",r:(t>>16&255)/255,g:(t>>8&255)/255,b:(255&t)/255}:8===e?{mode:"rgb",r:(t>>24&255)/255,g:(t>>16&255)/255,b:(t>>8&255)/255,alpha:(255&t)/255}:void 0},kt={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},St=/^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i,Mt="([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)",At=`${Mt}%`,Tt=`(?:${Mt}%|${Mt})`,Ct=`(?:${Mt}(deg|grad|rad|turn)|${Mt})`,Et="\\s*,\\s*",It=new RegExp(`^rgba?\\(\\s*${Mt}${Et}${Mt}${Et}${Mt}\\s*(?:,\\s*${Tt}\\s*)?\\)$`),Dt=new RegExp(`^rgba?\\(\\s*${At}${Et}${At}${Et}${At}\\s*(?:,\\s*${Tt}\\s*)?\\)$`),zt=(t="rgb")=>e=>void 0!==(e=((t,e)=>void 0===t?void 0:"object"!=typeof t?te(t):void 0!==t.mode?t:e?{...t,mode:e}:void 0)(e,t))?e.mode===t?e:Rt[e.mode][t]?Rt[e.mode][t](e):"rgb"===t?Rt[e.mode].rgb(e):Rt.rgb[t](Rt[e.mode].rgb(e)):void 0,Rt={},Nt={},Pt=[],Gt={},Ft=t=>t,Bt=t=>(Rt[t.mode]={...Rt[t.mode],...t.toMode},Object.keys(t.fromMode||{}).forEach((e=>{Rt[e]||(Rt[e]={}),Rt[e][t.mode]=t.fromMode[e]})),t.ranges||(t.ranges={}),t.difference||(t.difference={}),t.channels.forEach((e=>{if(void 0===t.ranges[e]&&(t.ranges[e]=[0,1]),!t.interpolate[e])throw new Error(`Missing interpolator for: ${e}`);"function"==typeof t.interpolate[e]&&(t.interpolate[e]={use:t.interpolate[e]}),t.interpolate[e].fixup||(t.interpolate[e].fixup=Ft)})),Nt[t.mode]=t,(t.parse||[]).forEach((e=>{Ot(e,t.mode)})),zt(t.mode)),Ot=(t,e)=>{if("string"==typeof t){if(!e)throw new Error("'mode' required when 'parser' is a string");Gt[t]=e}else"function"==typeof t&&Pt.indexOf(t)<0&&Pt.push(t)},Ht=/[^\x00-\x7F]|[a-zA-Z_]/,Vt=/[^\x00-\x7F]|[-\w]/,Lt={Function:"function",Ident:"ident",Number:"number",Percentage:"percentage",ParenClose:")",None:"none",Hue:"hue",Alpha:"alpha"};let jt=0;function qt(t){let e=t[jt],i=t[jt+1];return"-"===e||"+"===e?/\d/.test(i)||"."===i&&/\d/.test(t[jt+2]):/\d/.test("."===e?i:e)}function Ut(t){if(jt>=t.length)return!1;let e=t[jt];if(Ht.test(e))return!0;if("-"===e){if(t.length-jt<2)return!1;let e=t[jt+1];return!("-"!==e&&!Ht.test(e))}return!1}const Wt={deg:1,rad:180/Math.PI,grad:.9,turn:360};function Yt(t){let e="";if("-"!==t[jt]&&"+"!==t[jt]||(e+=t[jt++]),e+=Xt(t),"."===t[jt]&&/\d/.test(t[jt+1])&&(e+=t[jt++]+Xt(t)),"e"!==t[jt]&&"E"!==t[jt]||("-"!==t[jt+1]&&"+"!==t[jt+1]||!/\d/.test(t[jt+2])?/\d/.test(t[jt+1])&&(e+=t[jt++]+Xt(t)):e+=t[jt++]+t[jt++]+Xt(t)),Ut(t)){let i=Jt(t);return"deg"===i||"rad"===i||"turn"===i||"grad"===i?{type:Lt.Hue,value:e*Wt[i]}:void 0}return"%"===t[jt]?(jt++,{type:Lt.Percentage,value:+e}):{type:Lt.Number,value:+e}}function Xt(t){let e="";for(;/\d/.test(t[jt]);)e+=t[jt++];return e}function Jt(t){let e="";for(;jt<t.length&&Vt.test(t[jt]);)e+=t[jt++];return e}function Zt(t){let e=Jt(t);return"("===t[jt]?(jt++,{type:Lt.Function,value:e}):"none"===e?{type:Lt.None,value:void 0}:{type:Lt.Ident,value:e}}function Kt(t){t._i=0;let e=t[t._i++];if(!e||e.type!==Lt.Function||"color"!==e.value)return;if(e=t[t._i++],e.type!==Lt.Ident)return;const i=Gt[e.value];if(!i)return;const s={mode:i},a=Qt(t,!1);if(!a)return;const r=(t=>Nt[t])(i).channels;for(let o,n,l=0;l<r.length;l++)o=a[l],n=r[l],o.type!==Lt.None&&(s[n]=o.type===Lt.Number?o.value:o.value/100,"alpha"===n&&(s[n]=Math.max(0,Math.min(1,s[n]))));return s}function Qt(t,e){const i=[];let s;for(;t._i<t.length;)if(s=t[t._i++],s.type===Lt.None||s.type===Lt.Number||s.type===Lt.Alpha||s.type===Lt.Percentage||e&&s.type===Lt.Hue)i.push(s);else{if(s.type!==Lt.ParenClose)return;if(t._i<t.length)return}if(!(i.length<3||i.length>4)){if(4===i.length){if(i[3].type!==Lt.Alpha)return;i[3]=i[3].value}return 3===i.length&&i.push({type:Lt.None,value:void 0}),i.every((t=>t.type!==Lt.Alpha))?i:void 0}}const te=t=>{if("string"!=typeof t)return;const e=function(t=""){let e,i=t.trim(),s=[];for(jt=0;jt<i.length;)if(e=i[jt++],"\n"!==e&&"\t"!==e&&" "!==e){if(","===e)return;if(")"!==e){if("+"===e){if(jt--,qt(i)){s.push(Yt(i));continue}return}if("-"===e){if(jt--,qt(i)){s.push(Yt(i));continue}if(Ut(i)){s.push({type:Lt.Ident,value:Jt(i)});continue}return}if("."===e){if(jt--,qt(i)){s.push(Yt(i));continue}return}if("/"===e){for(;jt<i.length&&("\n"===i[jt]||"\t"===i[jt]||" "===i[jt]);)jt++;let t;if(qt(i)&&(t=Yt(i),t.type!==Lt.Hue)){s.push({type:Lt.Alpha,value:t});continue}if(Ut(i)&&"none"===Jt(i)){s.push({type:Lt.Alpha,value:{type:Lt.None,value:void 0}});continue}return}if(/\d/.test(e))jt--,s.push(Yt(i));else{if(!Ht.test(e))return;jt--,s.push(Zt(i))}}else s.push({type:Lt.ParenClose})}else for(;jt<i.length&&("\n"===i[jt]||"\t"===i[jt]||" "===i[jt]);)jt++;return s}(t),i=e?function(t,e){t._i=0;let i=t[t._i++];if(!i||i.type!==Lt.Function)return;let s=Qt(t,e);return s?(s.unshift(i.value),s):void 0}(e,!0):void 0;let s,a=0,r=Pt.length;for(;a<r;)if(void 0!==(s=Pt[a++](t,i)))return s;return e?Kt(e):void 0};const ee=(ie=(t,e,i)=>t+i*(e-t),t=>{let e=(t=>{let e=[];for(let i=0;i<t.length-1;i++){let s=t[i],a=t[i+1];void 0===s&&void 0===a?e.push(void 0):void 0!==s&&void 0!==a?e.push([s,a]):e.push(void 0!==s?[s,s]:[a,a])}return e})(t);return t=>{let i=t*e.length,s=t>=1?e.length-1:Math.max(Math.floor(i),0),a=e[s];return void 0===a?void 0:ie(a[0],a[1],i-s)}});var ie;const se=t=>{let e=!1,i=t.map((t=>void 0!==t?(e=!0,t):1));return e?i:t},ae={mode:"rgb",channels:["r","g","b","alpha"],parse:[function(t,e){if(!e||"rgb"!==e[0]&&"rgba"!==e[0])return;const i={mode:"rgb"},[,s,a,r,o]=e;return s.type!==Lt.Hue&&a.type!==Lt.Hue&&r.type!==Lt.Hue?(s.type!==Lt.None&&(i.r=s.type===Lt.Number?s.value/255:s.value/100),a.type!==Lt.None&&(i.g=a.type===Lt.Number?a.value/255:a.value/100),r.type!==Lt.None&&(i.b=r.type===Lt.Number?r.value/255:r.value/100),o.type!==Lt.None&&(i.alpha=Math.min(1,Math.max(0,o.type===Lt.Number?o.value:o.value/100))),i):void 0},t=>{let e;return(e=t.match(St))?$t(parseInt(e[1],16),e[1].length):void 0},t=>{let e,i={mode:"rgb"};if(e=t.match(It))void 0!==e[1]&&(i.r=e[1]/255),void 0!==e[2]&&(i.g=e[2]/255),void 0!==e[3]&&(i.b=e[3]/255);else{if(!(e=t.match(Dt)))return;void 0!==e[1]&&(i.r=e[1]/100),void 0!==e[2]&&(i.g=e[2]/100),void 0!==e[3]&&(i.b=e[3]/100)}return void 0!==e[4]?i.alpha=Math.max(0,Math.min(1,e[4]/100)):void 0!==e[5]&&(i.alpha=Math.max(0,Math.min(1,+e[5]))),i},t=>$t(kt[t.toLowerCase()],6),t=>"transparent"===t?{mode:"rgb",r:0,g:0,b:0,alpha:0}:void 0,"srgb"],serialize:"srgb",interpolate:{r:ee,g:ee,b:ee,alpha:{use:ee,fixup:se}},gamut:!0,white:{r:1,g:1,b:1},black:{r:0,g:0,b:0}},re=(t=0)=>Math.pow(Math.abs(t),563/256)*Math.sign(t),oe=t=>{let e=re(t.r),i=re(t.g),s=re(t.b),a={mode:"xyz65",x:.5766690429101305*e+.1855582379065463*i+.1882286462349947*s,y:.297344975250536*e+.6273635662554661*i+.0752914584939979*s,z:.0270313613864123*e+.0706888525358272*i+.9913375368376386*s};return void 0!==t.alpha&&(a.alpha=t.alpha),a},ne=t=>Math.pow(Math.abs(t),256/563)*Math.sign(t),le=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a={mode:"a98",r:ne(2.0415879038107465*t-.5650069742788597*e-.3447313507783297*i),g:ne(-.9692436362808798*t+1.8759675015077206*e+.0415550574071756*i),b:ne(.0134442806320312*t-.1183623922310184*e+1.0151749943912058*i)};return void 0!==s&&(a.alpha=s),a},he=(t=0)=>{const e=Math.abs(t);return e<=.04045?t/12.92:(Math.sign(t)||1)*Math.pow((e+.055)/1.055,2.4)},ce=({r:t,g:e,b:i,alpha:s})=>{let a={mode:"lrgb",r:he(t),g:he(e),b:he(i)};return void 0!==s&&(a.alpha=s),a},de=t=>{let{r:e,g:i,b:s,alpha:a}=ce(t),r={mode:"xyz65",x:.4123907992659593*e+.357584339383878*i+.1804807884018343*s,y:.2126390058715102*e+.715168678767756*i+.0721923153607337*s,z:.0193308187155918*e+.119194779794626*i+.9505321522496607*s};return void 0!==a&&(r.alpha=a),r},ue=(t=0)=>{const e=Math.abs(t);return e>.0031308?(Math.sign(t)||1)*(1.055*Math.pow(e,1/2.4)-.055):12.92*t},pe=({r:t,g:e,b:i,alpha:s},a="rgb")=>{let r={mode:a,r:ue(t),g:ue(e),b:ue(i)};return void 0!==s&&(r.alpha=s),r},ge=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=pe({r:3.2409699419045226*t-1.537383177570094*e-.4986107602930034*i,g:-.9692436362808796*t+1.8759675015077204*e+.0415550574071756*i,b:.0556300796969936*t-.2039769588889765*e+1.0569715142428784*i});return void 0!==s&&(a.alpha=s),a},me={...ae,mode:"a98",parse:["a98-rgb"],serialize:"a98-rgb",fromMode:{rgb:t=>le(de(t)),xyz65:le},toMode:{rgb:t=>ge(oe(t)),xyz65:oe}},fe=t=>(t%=360)<0?t+360:t,ye=t=>((t,e)=>t.map(((i,s,a)=>{if(void 0===i)return i;let r=fe(i);return 0===s||void 0===t[s-1]?r:e(r-fe(a[s-1]))})).reduce(((t,e)=>t.length&&void 0!==e&&void 0!==t[t.length-1]?(t.push(e+t[t.length-1]),t):(t.push(e),t)),[]))(t,(t=>Math.abs(t)<=180?t:t-360*Math.sign(t))),ve=[-.14861,1.78277,-.29227,-.90649,1.97294,0],be=Math.PI/180,_e=180/Math.PI;let xe=ve[3]*ve[4],we=ve[1]*ve[4],$e=ve[1]*ve[2]-ve[0]*ve[3];const ke=(t,e)=>{if(void 0===t.h||void 0===e.h||!t.s||!e.s)return 0;let i=fe(t.h),s=fe(e.h),a=Math.sin((s-i+360)/2*Math.PI/180);return 2*Math.sqrt(t.s*e.s)*a},Se=(t,e)=>{if(void 0===t.h||void 0===e.h||!t.c||!e.c)return 0;let i=fe(t.h),s=fe(e.h),a=Math.sin((s-i+360)/2*Math.PI/180);return 2*Math.sqrt(t.c*e.c)*a},Me=t=>{let e=t.reduce(((t,e)=>{if(void 0!==e){let i=e*Math.PI/180;t.sin+=Math.sin(i),t.cos+=Math.cos(i)}return t}),{sin:0,cos:0}),i=180*Math.atan2(e.sin,e.cos)/Math.PI;return i<0?360+i:i},Ae={mode:"cubehelix",channels:["h","s","l","alpha"],parse:["--cubehelix"],serialize:"--cubehelix",ranges:{h:[0,360],s:[0,4.614],l:[0,1]},fromMode:{rgb:({r:t,g:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=($e*i+t*xe-e*we)/($e+xe-we),r=i-a,o=(ve[4]*(e-a)-ve[2]*r)/ve[3],n={mode:"cubehelix",l:a,s:0===a||1===a?void 0:Math.sqrt(r*r+o*o)/(ve[4]*a*(1-a))};return n.s&&(n.h=Math.atan2(o,r)*_e-120),void 0!==s&&(n.alpha=s),n}},toMode:{rgb:({h:t,s:e,l:i,alpha:s})=>{let a={mode:"rgb"};t=(void 0===t?0:t+120)*be,void 0===i&&(i=0);let r=void 0===e?0:e*i*(1-i),o=Math.cos(t),n=Math.sin(t);return a.r=i+r*(ve[0]*o+ve[1]*n),a.g=i+r*(ve[2]*o+ve[3]*n),a.b=i+r*(ve[4]*o+ve[5]*n),void 0!==s&&(a.alpha=s),a}},interpolate:{h:{use:ee,fixup:ye},s:ee,l:ee,alpha:{use:ee,fixup:se}},difference:{h:ke},average:{h:Me}},Te=({l:t,a:e,b:i,alpha:s},a="lch")=>{void 0===e&&(e=0),void 0===i&&(i=0);let r=Math.sqrt(e*e+i*i),o={mode:a,l:t,c:r};return r&&(o.h=fe(180*Math.atan2(i,e)/Math.PI)),void 0!==s&&(o.alpha=s),o},Ce=({l:t,c:e,h:i,alpha:s},a="lab")=>{void 0===i&&(i=0);let r={mode:a,l:t,a:e?e*Math.cos(i/180*Math.PI):0,b:e?e*Math.sin(i/180*Math.PI):0};return void 0!==s&&(r.alpha=s),r},Ee=Math.pow(29,3)/Math.pow(3,3),Ie=Math.pow(6,3)/Math.pow(29,3),De=.3457/.3585,ze=1,Re=.2958/.3585,Ne=.3127/.329,Pe=1,Ge=.3583/.329;let Fe=t=>Math.pow(t,3)>Ie?Math.pow(t,3):(116*t-16)/Ee;const Be=({l:t,a:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=(t+16)/116,r=a-i/200,o={mode:"xyz65",x:Fe(e/500+a)*Ne,y:Fe(a)*Pe,z:Fe(r)*Ge};return void 0!==s&&(o.alpha=s),o},Oe=t=>ge(Be(t)),He=t=>t>Ie?Math.cbrt(t):(Ee*t+16)/116,Ve=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=He(t/Ne),r=He(e/Pe),o={mode:"lab65",l:116*r-16,a:500*(a-r),b:200*(r-He(i/Ge))};return void 0!==s&&(o.alpha=s),o},Le=t=>{let e=Ve(de(t));return t.r===t.b&&t.b===t.g&&(e.a=e.b=0),e},je=26/180*Math.PI,qe=Math.cos(je),Ue=Math.sin(je),We=100/Math.log(1.39),Ye=({l:t,c:e,h:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a={mode:"lab65",l:(Math.exp(1*t/We)-1)/.0039},r=(Math.exp(.0435*e*1*1)-1)/.075,o=r*Math.cos(i/180*Math.PI-je),n=r*Math.sin(i/180*Math.PI-je);return a.a=o*qe-n/.83*Ue,a.b=o*Ue+n/.83*qe,void 0!==s&&(a.alpha=s),a},Xe=({l:t,a:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=e*qe+i*Ue,r=.83*(i*qe-e*Ue),o=Math.sqrt(a*a+r*r),n={mode:"dlch",l:We/1*Math.log(1+.0039*t),c:Math.log(1+.075*o)/.0435};return n.c&&(n.h=fe((Math.atan2(r,a)+je)/Math.PI*180)),void 0!==s&&(n.alpha=s),n},Je=t=>Ye(Te(t,"dlch")),Ze=t=>Ce(Xe(t),"dlab"),Ke={mode:"dlab",parse:["--din99o-lab"],serialize:"--din99o-lab",toMode:{lab65:Je,rgb:t=>Oe(Je(t))},fromMode:{lab65:Ze,rgb:t=>Ze(Le(t))},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-40.09,45.501],b:[-40.469,44.344]},interpolate:{l:ee,a:ee,b:ee,alpha:{use:ee,fixup:se}}},Qe={mode:"dlch",parse:["--din99o-lch"],serialize:"--din99o-lch",toMode:{lab65:Ye,dlab:t=>Ce(t,"dlab"),rgb:t=>Oe(Ye(t))},fromMode:{lab65:Xe,dlab:t=>Te(t,"dlch"),rgb:t=>Xe(Le(t))},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,51.484],h:[0,360]},interpolate:{l:ee,c:ee,h:{use:ee,fixup:ye},alpha:{use:ee,fixup:se}},difference:{h:Se},average:{h:Me}};const ti={mode:"hsi",toMode:{rgb:function({h:t,s:e,i:i,alpha:s}){t=fe(void 0!==t?t:0),void 0===e&&(e=0),void 0===i&&(i=0);let a,r=Math.abs(t/60%2-1);switch(Math.floor(t/60)){case 0:a={r:i*(1+e*(3/(2-r)-1)),g:i*(1+e*(3*(1-r)/(2-r)-1)),b:i*(1-e)};break;case 1:a={r:i*(1+e*(3*(1-r)/(2-r)-1)),g:i*(1+e*(3/(2-r)-1)),b:i*(1-e)};break;case 2:a={r:i*(1-e),g:i*(1+e*(3/(2-r)-1)),b:i*(1+e*(3*(1-r)/(2-r)-1))};break;case 3:a={r:i*(1-e),g:i*(1+e*(3*(1-r)/(2-r)-1)),b:i*(1+e*(3/(2-r)-1))};break;case 4:a={r:i*(1+e*(3*(1-r)/(2-r)-1)),g:i*(1-e),b:i*(1+e*(3/(2-r)-1))};break;case 5:a={r:i*(1+e*(3/(2-r)-1)),g:i*(1-e),b:i*(1+e*(3*(1-r)/(2-r)-1))};break;default:a={r:i*(1-e),g:i*(1-e),b:i*(1-e)}}return a.mode="rgb",void 0!==s&&(a.alpha=s),a}},parse:["--hsi"],serialize:"--hsi",fromMode:{rgb:function({r:t,g:e,b:i,alpha:s}){void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=Math.max(t,e,i),r=Math.min(t,e,i),o={mode:"hsi",s:t+e+i===0?0:1-3*r/(t+e+i),i:(t+e+i)/3};return a-r!=0&&(o.h=60*(a===t?(e-i)/(a-r)+6*(e<i):a===e?(i-t)/(a-r)+2:(t-e)/(a-r)+4)),void 0!==s&&(o.alpha=s),o}},channels:["h","s","i","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:ee,fixup:ye},s:ee,i:ee,alpha:{use:ee,fixup:se}},difference:{h:ke},average:{h:Me}};const ei=new RegExp(`^hsla?\\(\\s*${Ct}${Et}${At}${Et}${At}\\s*(?:,\\s*${Tt}\\s*)?\\)$`);const ii={mode:"hsl",toMode:{rgb:function({h:t,s:e,l:i,alpha:s}){t=fe(void 0!==t?t:0),void 0===e&&(e=0),void 0===i&&(i=0);let a,r=i+e*(i<.5?i:1-i),o=r-2*(r-i)*Math.abs(t/60%2-1);switch(Math.floor(t/60)){case 0:a={r:r,g:o,b:2*i-r};break;case 1:a={r:o,g:r,b:2*i-r};break;case 2:a={r:2*i-r,g:r,b:o};break;case 3:a={r:2*i-r,g:o,b:r};break;case 4:a={r:o,g:2*i-r,b:r};break;case 5:a={r:r,g:2*i-r,b:o};break;default:a={r:2*i-r,g:2*i-r,b:2*i-r}}return a.mode="rgb",void 0!==s&&(a.alpha=s),a}},fromMode:{rgb:function({r:t,g:e,b:i,alpha:s}){void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=Math.max(t,e,i),r=Math.min(t,e,i),o={mode:"hsl",s:a===r?0:(a-r)/(1-Math.abs(a+r-1)),l:.5*(a+r)};return a-r!=0&&(o.h=60*(a===t?(e-i)/(a-r)+6*(e<i):a===e?(i-t)/(a-r)+2:(t-e)/(a-r)+4)),void 0!==s&&(o.alpha=s),o}},channels:["h","s","l","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(t,e){if(!e||"hsl"!==e[0]&&"hsla"!==e[0])return;const i={mode:"hsl"},[,s,a,r,o]=e;if(s.type!==Lt.None){if(s.type===Lt.Percentage)return;i.h=s.value}if(a.type!==Lt.None){if(a.type===Lt.Hue)return;i.s=a.value/100}if(r.type!==Lt.None){if(r.type===Lt.Hue)return;i.l=r.value/100}return o.type!==Lt.None&&(i.alpha=Math.min(1,Math.max(0,o.type===Lt.Number?o.value:o.value/100))),i},t=>{let e=t.match(ei);if(!e)return;let i={mode:"hsl"};return void 0!==e[3]?i.h=+e[3]:void 0!==e[1]&&void 0!==e[2]&&(i.h=((t,e)=>{switch(e){case"deg":return+t;case"rad":return t/Math.PI*180;case"grad":return t/10*9;case"turn":return 360*t}})(e[1],e[2])),void 0!==e[4]&&(i.s=Math.min(Math.max(0,e[4]/100),1)),void 0!==e[5]&&(i.l=Math.min(Math.max(0,e[5]/100),1)),void 0!==e[6]?i.alpha=Math.max(0,Math.min(1,e[6]/100)):void 0!==e[7]&&(i.alpha=Math.max(0,Math.min(1,+e[7]))),i}],serialize:t=>`hsl(${void 0!==t.h?t.h:"none"} ${void 0!==t.s?100*t.s+"%":"none"} ${void 0!==t.l?100*t.l+"%":"none"}${t.alpha<1?` / ${t.alpha}`:""})`,interpolate:{h:{use:ee,fixup:ye},s:ee,l:ee,alpha:{use:ee,fixup:se}},difference:{h:ke},average:{h:Me}};function si({h:t,s:e,v:i,alpha:s}){t=fe(void 0!==t?t:0),void 0===e&&(e=0),void 0===i&&(i=0);let a,r=Math.abs(t/60%2-1);switch(Math.floor(t/60)){case 0:a={r:i,g:i*(1-e*r),b:i*(1-e)};break;case 1:a={r:i*(1-e*r),g:i,b:i*(1-e)};break;case 2:a={r:i*(1-e),g:i,b:i*(1-e*r)};break;case 3:a={r:i*(1-e),g:i*(1-e*r),b:i};break;case 4:a={r:i*(1-e*r),g:i*(1-e),b:i};break;case 5:a={r:i,g:i*(1-e),b:i*(1-e*r)};break;default:a={r:i*(1-e),g:i*(1-e),b:i*(1-e)}}return a.mode="rgb",void 0!==s&&(a.alpha=s),a}function ai({r:t,g:e,b:i,alpha:s}){void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=Math.max(t,e,i),r=Math.min(t,e,i),o={mode:"hsv",s:0===a?0:1-r/a,v:a};return a-r!=0&&(o.h=60*(a===t?(e-i)/(a-r)+6*(e<i):a===e?(i-t)/(a-r)+2:(t-e)/(a-r)+4)),void 0!==s&&(o.alpha=s),o}const ri={mode:"hsv",toMode:{rgb:si},parse:["--hsv"],serialize:"--hsv",fromMode:{rgb:ai},channels:["h","s","v","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:ee,fixup:ye},s:ee,v:ee,alpha:{use:ee,fixup:se}},difference:{h:ke},average:{h:Me}};const oi={mode:"hwb",toMode:{rgb:function({h:t,w:e,b:i,alpha:s}){if(void 0===e&&(e=0),void 0===i&&(i=0),e+i>1){let t=e+i;e/=t,i/=t}return si({h:t,s:1===i?1:1-e/(1-i),v:1-i,alpha:s})}},fromMode:{rgb:function(t){let e=ai(t);if(void 0===e)return;let i=void 0!==e.s?e.s:0,s=void 0!==e.v?e.v:0,a={mode:"hwb",w:(1-i)*s,b:1-s};return void 0!==e.h&&(a.h=e.h),void 0!==e.alpha&&(a.alpha=e.alpha),a}},channels:["h","w","b","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[function(t,e){if(!e||"hwb"!==e[0])return;const i={mode:"hwb"},[,s,a,r,o]=e;if(s.type!==Lt.None){if(s.type===Lt.Percentage)return;i.h=s.value}if(a.type!==Lt.None){if(a.type===Lt.Hue)return;i.w=a.value/100}if(r.type!==Lt.None){if(r.type===Lt.Hue)return;i.b=r.value/100}return o.type!==Lt.None&&(i.alpha=Math.min(1,Math.max(0,o.type===Lt.Number?o.value:o.value/100))),i}],serialize:t=>`hwb(${void 0!==t.h?t.h:"none"} ${void 0!==t.w?100*t.w+"%":"none"} ${void 0!==t.b?100*t.b+"%":"none"}${t.alpha<1?` / ${t.alpha}`:""})`,interpolate:{h:{use:ee,fixup:ye},w:ee,b:ee,alpha:{use:ee,fixup:se}},difference:{h:(t,e)=>{if(void 0===t.h||void 0===e.h)return 0;let i=fe(t.h),s=fe(e.h);return Math.abs(s-i)>180?i-(s-360*Math.sign(s-i)):s-i}},average:{h:Me}},ni=.1593017578125,li=78.84375,hi=.8359375,ci=18.8515625,di=18.6875;function ui(t){if(t<0)return 0;const e=Math.pow(t,1/li);return 1e4*Math.pow(Math.max(0,e-hi)/(ci-di*e),1/ni)}function pi(t){if(t<0)return 0;const e=Math.pow(t/1e4,ni);return Math.pow((hi+ci*e)/(1+di*e),li)}const gi=t=>Math.max(t/203,0),mi=({i:t,t:e,p:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);const a=ui(t+.008609037037932761*e+.11102962500302593*i),r=ui(t-.00860903703793275*e-.11102962500302599*i),o=ui(t+.5600313357106791*e-.32062717498731885*i),n={mode:"xyz65",x:gi(2.070152218389422*a-1.3263473389671556*r+.2066510476294051*o),y:gi(.3647385209748074*a+.680566024947227*r-.0453045459220346*o),z:gi(-.049747207535812*a-.0492609666966138*r+1.1880659249923042*o)};return void 0!==s&&(n.alpha=s),n},fi=(t=0)=>Math.max(203*t,0),yi=({x:t,y:e,z:i,alpha:s})=>{const a=fi(t),r=fi(e),o=fi(i),n=pi(.3592832590121217*a+.6976051147779502*r-.0358915932320289*o),l=pi(-.1920808463704995*a+1.1004767970374323*r+.0753748658519118*o),h=pi(.0070797844607477*a+.0748396662186366*r+.8433265453898765*o),c={mode:"itp",i:.5*n+.5*l,t:1.61376953125*n-3.323486328125*l+1.709716796875*h,p:4.378173828125*n-4.24560546875*l-.132568359375*h};return void 0!==s&&(c.alpha=s),c},vi={mode:"itp",channels:["i","t","p","alpha"],parse:["--ictcp"],serialize:"--ictcp",toMode:{xyz65:mi,rgb:t=>ge(mi(t))},fromMode:{xyz65:yi,rgb:t=>yi(de(t))},ranges:{i:[0,.581],t:[-.369,.272],p:[-.164,.331]},interpolate:{i:ee,t:ee,p:ee,alpha:{use:ee,fixup:se}}},bi=t=>{if(t<0)return 0;let e=Math.pow(t/1e4,ni);return Math.pow((hi+ci*e)/(1+di*e),134.03437499999998)},_i=(t=0)=>Math.max(203*t,0),xi=({x:t,y:e,z:i,alpha:s})=>{t=_i(t),e=_i(e);let a=1.15*t-.15*(i=_i(i)),r=.66*e+.34*t,o=bi(.41478972*a+.579999*r+.014648*i),n=bi(-.20151*a+1.120649*r+.0531008*i),l=bi(-.0166008*a+.2648*r+.6684799*i),h=(o+n)/2,c={mode:"jab",j:.44*h/(1-.56*h)-16295499532821565e-27,a:3.524*o-4.066708*n+.542708*l,b:.199076*o+1.096799*n-1.295875*l};return void 0!==s&&(c.alpha=s),c},wi=16295499532821565e-27,$i=t=>{if(t<0)return 0;let e=Math.pow(t,.007460772656268216);return 1e4*Math.pow((hi-e)/(di*e-ci),1/ni)},ki=t=>t/203,Si=({j:t,a:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=(t+wi)/(.44+.56*(t+wi)),r=$i(a+.13860504*e+.058047316*i),o=$i(a-.13860504*e-.058047316*i),n=$i(a-.096019242*e-.8118919*i),l={mode:"xyz65",x:ki(1.661373024652174*r-.914523081304348*o+.23136208173913045*n),y:ki(-.3250758611844533*r+1.571847026732543*o-.21825383453227928*n),z:ki(-.090982811*r-.31272829*o+1.5227666*n)};return void 0!==s&&(l.alpha=s),l},Mi=t=>{let e=xi(de(t));return t.r===t.b&&t.b===t.g&&(e.a=e.b=0),e},Ai=t=>ge(Si(t)),Ti={mode:"jab",channels:["j","a","b","alpha"],parse:["--jzazbz"],serialize:"--jzazbz",fromMode:{rgb:Mi,xyz65:xi},toMode:{rgb:Ai,xyz65:Si},ranges:{j:[0,.222],a:[-.109,.129],b:[-.185,.134]},interpolate:{j:ee,a:ee,b:ee,alpha:{use:ee,fixup:se}}},Ci=({j:t,a:e,b:i,alpha:s})=>{void 0===e&&(e=0),void 0===i&&(i=0);let a=Math.sqrt(e*e+i*i),r={mode:"jch",j:t,c:a};return a&&(r.h=fe(180*Math.atan2(i,e)/Math.PI)),void 0!==s&&(r.alpha=s),r},Ei=({j:t,c:e,h:i,alpha:s})=>{void 0===i&&(i=0);let a={mode:"jab",j:t,a:e?e*Math.cos(i/180*Math.PI):0,b:e?e*Math.sin(i/180*Math.PI):0};return void 0!==s&&(a.alpha=s),a},Ii={mode:"jch",parse:["--jzczhz"],serialize:"--jzczhz",toMode:{jab:Ei,rgb:t=>Ai(Ei(t))},fromMode:{rgb:t=>Ci(Mi(t)),jab:Ci},channels:["j","c","h","alpha"],ranges:{j:[0,.221],c:[0,.19],h:[0,360]},interpolate:{h:{use:ee,fixup:ye},c:ee,j:ee,alpha:{use:ee,fixup:se}},difference:{h:Se},average:{h:Me}},Di=Math.pow(29,3)/Math.pow(3,3),zi=Math.pow(6,3)/Math.pow(29,3);let Ri=t=>Math.pow(t,3)>zi?Math.pow(t,3):(116*t-16)/Di;const Ni=({l:t,a:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=(t+16)/116,r=a-i/200,o={mode:"xyz50",x:Ri(e/500+a)*De,y:Ri(a)*ze,z:Ri(r)*Re};return void 0!==s&&(o.alpha=s),o},Pi=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=pe({r:3.1341359569958707*t-1.6173863321612538*e-.4906619460083532*i,g:-.978795502912089*t+1.916254567259524*e+.03344273116131949*i,b:.07195537988411677*t-.2289768264158322*e+1.405386058324125*i});return void 0!==s&&(a.alpha=s),a},Gi=t=>Pi(Ni(t)),Fi=t=>{let{r:e,g:i,b:s,alpha:a}=ce(t),r={mode:"xyz50",x:.436065742824811*e+.3851514688337912*i+.14307845442264197*s,y:.22249319175623702*e+.7168870538238823*i+.06061979053616537*s,z:.013923904500943465*e+.09708128566574634*i+.7140993584005155*s};return void 0!==a&&(r.alpha=a),r},Bi=t=>t>zi?Math.cbrt(t):(Di*t+16)/116,Oi=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=Bi(t/De),r=Bi(e/ze),o={mode:"lab",l:116*r-16,a:500*(a-r),b:200*(r-Bi(i/Re))};return void 0!==s&&(o.alpha=s),o},Hi=t=>{let e=Oi(Fi(t));return t.r===t.b&&t.b===t.g&&(e.a=e.b=0),e};const Vi={mode:"lab",toMode:{xyz50:Ni,rgb:Gi},fromMode:{xyz50:Oi,rgb:Hi},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-125,125],b:[-125,125]},parse:[function(t,e){if(!e||"lab"!==e[0])return;const i={mode:"lab"},[,s,a,r,o]=e;return s.type!==Lt.Hue&&a.type!==Lt.Hue&&r.type!==Lt.Hue?(s.type!==Lt.None&&(i.l=Math.min(Math.max(0,s.value),100)),a.type!==Lt.None&&(i.a=a.type===Lt.Number?a.value:125*a.value/100),r.type!==Lt.None&&(i.b=r.type===Lt.Number?r.value:125*r.value/100),o.type!==Lt.None&&(i.alpha=Math.min(1,Math.max(0,o.type===Lt.Number?o.value:o.value/100))),i):void 0}],serialize:t=>`lab(${void 0!==t.l?t.l:"none"} ${void 0!==t.a?t.a:"none"} ${void 0!==t.b?t.b:"none"}${t.alpha<1?` / ${t.alpha}`:""})`,interpolate:{l:ee,a:ee,b:ee,alpha:{use:ee,fixup:se}}},Li={...Vi,mode:"lab65",parse:["--lab-d65"],serialize:"--lab-d65",toMode:{xyz65:Be,rgb:Oe},fromMode:{xyz65:Ve,rgb:Le},ranges:{l:[0,100],a:[-125,125],b:[-125,125]}};const ji={mode:"lch",toMode:{lab:Ce,rgb:t=>Gi(Ce(t))},fromMode:{rgb:t=>Te(Hi(t)),lab:Te},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,150],h:[0,360]},parse:[function(t,e){if(!e||"lch"!==e[0])return;const i={mode:"lch"},[,s,a,r,o]=e;if(s.type!==Lt.None){if(s.type===Lt.Hue)return;i.l=Math.min(Math.max(0,s.value),100)}if(a.type!==Lt.None&&(i.c=Math.max(0,a.type===Lt.Number?a.value:150*a.value/100)),r.type!==Lt.None){if(r.type===Lt.Percentage)return;i.h=r.value}return o.type!==Lt.None&&(i.alpha=Math.min(1,Math.max(0,o.type===Lt.Number?o.value:o.value/100))),i}],serialize:t=>`lch(${void 0!==t.l?t.l:"none"} ${void 0!==t.c?t.c:"none"} ${void 0!==t.h?t.h:"none"}${t.alpha<1?` / ${t.alpha}`:""})`,interpolate:{h:{use:ee,fixup:ye},c:ee,l:ee,alpha:{use:ee,fixup:se}},difference:{h:Se},average:{h:Me}},qi={...ji,mode:"lch65",parse:["--lch-d65"],serialize:"--lch-d65",toMode:{lab65:t=>Ce(t,"lab65"),rgb:t=>Oe(Ce(t,"lab65"))},fromMode:{rgb:t=>Te(Le(t),"lch65"),lab65:t=>Te(t,"lch65")},ranges:{l:[0,100],c:[0,150],h:[0,360]}},Ui=({l:t,u:e,v:i,alpha:s})=>{void 0===e&&(e=0),void 0===i&&(i=0);let a=Math.sqrt(e*e+i*i),r={mode:"lchuv",l:t,c:a};return a&&(r.h=fe(180*Math.atan2(i,e)/Math.PI)),void 0!==s&&(r.alpha=s),r},Wi=({l:t,c:e,h:i,alpha:s})=>{void 0===i&&(i=0);let a={mode:"luv",l:t,u:e?e*Math.cos(i/180*Math.PI):0,v:e?e*Math.sin(i/180*Math.PI):0};return void 0!==s&&(a.alpha=s),a},Yi=(t,e,i)=>4*t/(t+15*e+3*i),Xi=(t,e,i)=>9*e/(t+15*e+3*i),Ji=Yi(De,ze,Re),Zi=Xi(De,ze,Re),Ki=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=(r=e/ze)<=zi?Di*r:116*Math.cbrt(r)-16;var r;let o=Yi(t,e,i),n=Xi(t,e,i);isFinite(o)&&isFinite(n)?(o=13*a*(o-Ji),n=13*a*(n-Zi)):a=o=n=0;let l={mode:"luv",l:a,u:o,v:n};return void 0!==s&&(l.alpha=s),l},Qi=((t,e,i)=>4*t/(t+15*e+3*i))(De,ze,Re),ts=((t,e,i)=>9*e/(t+15*e+3*i))(De,ze,Re),es=({l:t,u:e,v:i,alpha:s})=>{if(void 0===t&&(t=0),0===t)return{mode:"xyz50",x:0,y:0,z:0};void 0===e&&(e=0),void 0===i&&(i=0);let a=e/(13*t)+Qi,r=i/(13*t)+ts,o=ze*(t<=8?t/Di:Math.pow((t+16)/116,3)),n={mode:"xyz50",x:o*(9*a)/(4*r),y:o,z:o*(12-3*a-20*r)/(4*r)};return void 0!==s&&(n.alpha=s),n},is={mode:"lchuv",toMode:{luv:Wi,rgb:t=>Pi(es(Wi(t)))},fromMode:{rgb:t=>Ui(Ki(Fi(t))),luv:Ui},channels:["l","c","h","alpha"],parse:["--lchuv"],serialize:"--lchuv",ranges:{l:[0,100],c:[0,176.956],h:[0,360]},interpolate:{h:{use:ee,fixup:ye},c:ee,l:ee,alpha:{use:ee,fixup:se}},difference:{h:Se},average:{h:Me}},ss={...ae,mode:"lrgb",toMode:{rgb:pe},fromMode:{rgb:ce},parse:["srgb-linear"],serialize:"srgb-linear"},as={mode:"luv",toMode:{xyz50:es,rgb:t=>Pi(es(t))},fromMode:{xyz50:Ki,rgb:t=>Ki(Fi(t))},channels:["l","u","v","alpha"],parse:["--luv"],serialize:"--luv",ranges:{l:[0,100],u:[-84.936,175.042],v:[-125.882,87.243]},interpolate:{l:ee,u:ee,v:ee,alpha:{use:ee,fixup:se}}},rs=({r:t,g:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=Math.cbrt(.412221469470763*t+.5363325372617348*e+.0514459932675022*i),r=Math.cbrt(.2119034958178252*t+.6806995506452344*e+.1073969535369406*i),o=Math.cbrt(.0883024591900564*t+.2817188391361215*e+.6299787016738222*i),n={mode:"oklab",l:.210454268309314*a+.7936177747023054*r-.0040720430116193*o,a:1.9779985324311684*a-2.42859224204858*r+.450593709617411*o,b:.0259040424655478*a+.7827717124575296*r-.8086757549230774*o};return void 0!==s&&(n.alpha=s),n},os=t=>{let e=rs(ce(t));return t.r===t.b&&t.b===t.g&&(e.a=e.b=0),e},ns=({l:t,a:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=Math.pow(t+.3963377773761749*e+.2158037573099136*i,3),r=Math.pow(t-.1055613458156586*e-.0638541728258133*i,3),o=Math.pow(t-.0894841775298119*e-1.2914855480194092*i,3),n={mode:"lrgb",r:4.076741636075957*a-3.3077115392580616*r+.2309699031821044*o,g:-1.2684379732850317*a+2.6097573492876887*r-.3413193760026573*o,b:-.0041960761386756*a-.7034186179359362*r+1.7076146940746117*o};return void 0!==s&&(n.alpha=s),n},ls=t=>pe(ns(t));function hs(t){const e=.206,i=1.206/1.03;return.5*(i*t-e+Math.sqrt((i*t-e)*(i*t-e)+.12*i*t))}function cs(t){return(t*t+.206*t)/(1.206/1.03*(t+.03))}function ds(t,e){let i=function(t,e){let i,s,a,r,o,n,l,h;-1.88170328*t-.80936493*e>1?(i=1.19086277,s=1.76576728,a=.59662641,r=.75515197,o=.56771245,n=4.0767416621,l=-3.3077115913,h=.2309699292):1.81444104*t-1.19445276*e>1?(i=.73956515,s=-.45954404,a=.08285427,r=.1254107,o=.14503204,n=-1.2684380046,l=2.6097574011,h=-.3413193965):(i=1.35733652,s=-.00915799,a=-1.1513021,r=-.50559606,o=.00692167,n=-.0041960863,l=-.7034186147,h=1.707614701);let c=i+s*t+a*e+r*t*t+o*t*e,d=.3963377774*t+.2158037573*e,u=-.1055613458*t-.0638541728*e,p=-.0894841775*t-1.291485548*e;{let t=1+c*d,e=1+c*u,i=1+c*p,s=n*(t*t*t)+l*(e*e*e)+h*(i*i*i),a=n*(3*d*t*t)+l*(3*u*e*e)+h*(3*p*i*i);c-=s*a/(a*a-.5*s*(n*(6*d*d*t)+l*(6*u*u*e)+h*(6*p*p*i)))}return c}(t,e),s=ns({l:1,a:i*t,b:i*e}),a=Math.cbrt(1/Math.max(s.r,s.g,s.b));return[a,a*i]}function us(t,e,i=null){i||(i=ds(t,e));let s=i[0],a=i[1];return[a/s,a/(1-s)]}function ps(t,e,i){let s=ds(e,i),a=function(t,e,i,s,a,r=null){let o;if(r||(r=ds(t,e)),(i-a)*r[1]-(r[0]-a)*s<=0)o=r[1]*a/(s*r[0]+r[1]*(a-i));else{o=r[1]*(a-1)/(s*(r[0]-1)+r[1]*(a-i));{let r=i-a,n=.3963377774*t+.2158037573*e,l=-.1055613458*t-.0638541728*e,h=-.0894841775*t-1.291485548*e,c=r+s*n,d=r+s*l,u=r+s*h;{let t=a*(1-o)+o*i,e=o*s,r=t+e*n,p=t+e*l,g=t+e*h,m=r*r*r,f=p*p*p,y=g*g*g,v=3*c*r*r,b=3*d*p*p,_=3*u*g*g,x=6*c*c*r,w=6*d*d*p,$=6*u*u*g,k=4.0767416621*m-3.3077115913*f+.2309699292*y-1,S=4.0767416621*v-3.3077115913*b+.2309699292*_,M=S/(S*S-.5*k*(4.0767416621*x-3.3077115913*w+.2309699292*$)),A=-k*M,T=-1.2684380046*m+2.6097574011*f-.3413193965*y-1,C=-1.2684380046*v+2.6097574011*b-.3413193965*_,E=C/(C*C-.5*T*(-1.2684380046*x+2.6097574011*w-.3413193965*$)),I=-T*E,D=-.0041960863*m-.7034186147*f+1.707614701*y-1,z=-.0041960863*v-.7034186147*b+1.707614701*_,R=z/(z*z-.5*D*(-.0041960863*x-.7034186147*w+1.707614701*$)),N=-D*R;A=M>=0?A:1e6,I=E>=0?I:1e6,N=R>=0?N:1e6,o+=Math.min(A,Math.min(I,N))}}}return o}(e,i,t,1,t,s),r=us(e,i,s),o=t*(.11516993+1/(7.4477897+4.1590124*i+e*(1.75198401*i-2.19557347+e*(-2.13704948-10.02301043*i+e*(5.38770819*i-4.24894561+4.69891013*e))))),n=(1-t)*(.11239642+1/(1.6132032-.68124379*i+e*(.40370612+.90148123*i+e*(.6122399*i-.27087943+e*(.00299215-.45399568*i-.14661872*e))))),l=.9*(a/Math.min(t*r[0],(1-t)*r[1]))*Math.sqrt(Math.sqrt(1/(1/(o*o*o*o)+1/(n*n*n*n))));return o=.4*t,n=.8*(1-t),[Math.sqrt(1/(1/(o*o)+1/(n*n))),l,a]}function gs(t){const e=void 0!==t.l?t.l:0,i=void 0!==t.a?t.a:0,s=void 0!==t.b?t.b:0,a={mode:"okhsl",l:hs(e)};void 0!==t.alpha&&(a.alpha=t.alpha);let r=Math.sqrt(i*i+s*s);if(!r)return a.s=0,a;let o,[n,l,h]=ps(e,i/r,s/r);if(r<l){let t=0,e=.8*n;o=.8*((r-t)/(e+(1-e/l)*(r-t)))}else{let t=.2*l*l*1.25*1.25/n;o=.8+.2*((r-l)/(t+(1-t/(h-l))*(r-l)))}return o&&(a.s=o,a.h=fe(180*Math.atan2(s,i)/Math.PI)),a}function ms(t){let e=void 0!==t.h?t.h:0,i=void 0!==t.s?t.s:0,s=void 0!==t.l?t.l:0;const a={mode:"oklab",l:cs(s)};if(void 0!==t.alpha&&(a.alpha=t.alpha),!i||1===s)return a.a=a.b=0,a;let r,o,n,l,h=Math.cos(e/180*Math.PI),c=Math.sin(e/180*Math.PI),[d,u,p]=ps(a.l,h,c);i<.8?(r=1.25*i,o=0,n=.8*d,l=1-n/u):(r=5*(i-.8),o=u,n=.2*u*u*1.25*1.25/d,l=1-n/(p-u));let g=o+r*n/(1-l*r);return a.a=g*h,a.b=g*c,a}const fs={...ii,mode:"okhsl",channels:["h","s","l","alpha"],parse:["--okhsl"],serialize:"--okhsl",fromMode:{oklab:gs,rgb:t=>gs(os(t))},toMode:{oklab:ms,rgb:t=>ls(ms(t))}};function ys(t){let e=void 0!==t.l?t.l:0,i=void 0!==t.a?t.a:0,s=void 0!==t.b?t.b:0,a=Math.sqrt(i*i+s*s),r=a?i/a:1,o=a?s/a:1,[n,l]=us(r,o),h=1-.5/n,c=l/(a+e*l),d=c*e,u=c*a,p=cs(d),g=u*p/d,m=ns({l:p,a:r*g,b:o*g}),f=Math.cbrt(1/Math.max(m.r,m.g,m.b,0));e/=f,a=a/f*hs(e)/e,e=hs(e);const y={mode:"okhsv",s:a?(.5+l)*u/(.5*l+l*h*u):0,v:e?e/d:0};return y.s&&(y.h=fe(180*Math.atan2(s,i)/Math.PI)),void 0!==t.alpha&&(y.alpha=t.alpha),y}function vs(t){const e={mode:"oklab"};void 0!==t.alpha&&(e.alpha=t.alpha);const i=void 0!==t.h?t.h:0,s=void 0!==t.s?t.s:0,a=void 0!==t.v?t.v:0,r=Math.cos(i/180*Math.PI),o=Math.sin(i/180*Math.PI),[n,l]=us(r,o),h=.5,c=1-h/n,d=1-s*h/(h+l-l*c*s),u=s*l*h/(h+l-l*c*s),p=cs(d),g=u*p/d,m=ns({l:p,a:r*g,b:o*g}),f=Math.cbrt(1/Math.max(m.r,m.g,m.b,0)),y=cs(a*d),v=u*y/d;return e.l=y*f,e.a=v*r*f,e.b=v*o*f,e}const bs={...ri,mode:"okhsv",channels:["h","s","v","alpha"],parse:["--okhsv"],serialize:"--okhsv",fromMode:{oklab:ys,rgb:t=>ys(os(t))},toMode:{oklab:vs,rgb:t=>ls(vs(t))}};const _s={...Vi,mode:"oklab",toMode:{lrgb:ns,rgb:ls},fromMode:{lrgb:rs,rgb:os},ranges:{l:[0,1],a:[-.4,.4],b:[-.4,.4]},parse:[function(t,e){if(!e||"oklab"!==e[0])return;const i={mode:"oklab"},[,s,a,r,o]=e;return s.type!==Lt.Hue&&a.type!==Lt.Hue&&r.type!==Lt.Hue?(s.type!==Lt.None&&(i.l=Math.min(Math.max(0,s.type===Lt.Number?s.value:s.value/100),1)),a.type!==Lt.None&&(i.a=a.type===Lt.Number?a.value:.4*a.value/100),r.type!==Lt.None&&(i.b=r.type===Lt.Number?r.value:.4*r.value/100),o.type!==Lt.None&&(i.alpha=Math.min(1,Math.max(0,o.type===Lt.Number?o.value:o.value/100))),i):void 0}],serialize:t=>`oklab(${void 0!==t.l?t.l:"none"} ${void 0!==t.a?t.a:"none"} ${void 0!==t.b?t.b:"none"}${t.alpha<1?` / ${t.alpha}`:""})`};const xs={...ji,mode:"oklch",toMode:{oklab:t=>Ce(t,"oklab"),rgb:t=>ls(Ce(t,"oklab"))},fromMode:{rgb:t=>Te(os(t),"oklch"),oklab:t=>Te(t,"oklch")},parse:[function(t,e){if(!e||"oklch"!==e[0])return;const i={mode:"oklch"},[,s,a,r,o]=e;if(s.type!==Lt.None){if(s.type===Lt.Hue)return;i.l=Math.min(Math.max(0,s.type===Lt.Number?s.value:s.value/100),1)}if(a.type!==Lt.None&&(i.c=Math.max(0,a.type===Lt.Number?a.value:.4*a.value/100)),r.type!==Lt.None){if(r.type===Lt.Percentage)return;i.h=r.value}return o.type!==Lt.None&&(i.alpha=Math.min(1,Math.max(0,o.type===Lt.Number?o.value:o.value/100))),i}],serialize:t=>`oklch(${void 0!==t.l?t.l:"none"} ${void 0!==t.c?t.c:"none"} ${void 0!==t.h?t.h:"none"}${t.alpha<1?` / ${t.alpha}`:""})`,ranges:{l:[0,1],c:[0,.4],h:[0,360]}},ws=t=>{let{r:e,g:i,b:s,alpha:a}=ce(t),r={mode:"xyz65",x:.486570948648216*e+.265667693169093*i+.1982172852343625*s,y:.2289745640697487*e+.6917385218365062*i+.079286914093745*s,z:0*e+.0451133818589026*i+1.043944368900976*s};return void 0!==a&&(r.alpha=a),r},$s=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a=pe({r:2.4934969119414263*t-.9313836179191242*e-.402710784450717*i,g:-.8294889695615749*t+1.7626640603183465*e+.0236246858419436*i,b:.0358458302437845*t-.0761723892680418*e+.9568845240076871*i},"p3");return void 0!==s&&(a.alpha=s),a},ks={...ae,mode:"p3",parse:["display-p3"],serialize:"display-p3",fromMode:{rgb:t=>$s(de(t)),xyz65:$s},toMode:{rgb:t=>ge(ws(t)),xyz65:ws}},Ss=t=>{let e=Math.abs(t);return e>=1/512?Math.sign(t)*Math.pow(e,1/1.8):16*t},Ms=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a={mode:"prophoto",r:Ss(1.3457868816471585*t-.2555720873797946*e-.0511018649755453*i),g:Ss(-.5446307051249019*t+1.5082477428451466*e+.0205274474364214*i),b:Ss(0*t+0*e+1.2119675456389452*i)};return void 0!==s&&(a.alpha=s),a},As=(t=0)=>{let e=Math.abs(t);return e>=16/512?Math.sign(t)*Math.pow(e,1.8):t/16},Ts=t=>{let e=As(t.r),i=As(t.g),s=As(t.b),a={mode:"xyz50",x:.7977666449006423*e+.1351812974005331*i+.0313477341283922*s,y:.2880748288194013*e+.7118352342418731*i+899369387256e-16*s,z:0*e+0*i+.8251046025104602*s};return void 0!==t.alpha&&(a.alpha=t.alpha),a},Cs={...ae,mode:"prophoto",parse:["prophoto-rgb"],serialize:"prophoto-rgb",fromMode:{xyz50:Ms,rgb:t=>Ms(Fi(t))},toMode:{xyz50:Ts,rgb:t=>Pi(Ts(t))}},Es=1.09929682680944,Is=t=>{const e=Math.abs(t);return e>.018053968510807?(Math.sign(t)||1)*(Es*Math.pow(e,.45)-(Es-1)):4.5*t},Ds=({x:t,y:e,z:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);let a={mode:"rec2020",r:Is(1.7166511879712683*t-.3556707837763925*e-.2533662813736599*i),g:Is(-.6666843518324893*t+1.6164812366349395*e+.0157685458139111*i),b:Is(.0176398574453108*t-.0427706132578085*e+.9421031212354739*i)};return void 0!==s&&(a.alpha=s),a},zs=1.09929682680944,Rs=(t=0)=>{let e=Math.abs(t);return e<.08124285829863151?t/4.5:(Math.sign(t)||1)*Math.pow((e+zs-1)/zs,1/.45)},Ns=t=>{let e=Rs(t.r),i=Rs(t.g),s=Rs(t.b),a={mode:"xyz65",x:.6369580483012911*e+.1446169035862083*i+.1688809751641721*s,y:.262700212011267*e+.6779980715188708*i+.059301716469862*s,z:0*e+.0280726930490874*i+1.0609850577107909*s};return void 0!==t.alpha&&(a.alpha=t.alpha),a},Ps={...ae,mode:"rec2020",fromMode:{xyz65:Ds,rgb:t=>Ds(de(t))},toMode:{xyz65:Ns,rgb:t=>ge(Ns(t))},parse:["rec2020"],serialize:"rec2020"},Gs=.0037930732552754493,Fs=Math.cbrt(Gs),Bs=t=>Math.cbrt(t)-Fs,Os=t=>Math.pow(t+Fs,3),Hs={mode:"xyb",channels:["x","y","b","alpha"],parse:["--xyb"],serialize:"--xyb",toMode:{rgb:({x:t,y:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);const a=Os(t+e)-Gs,r=Os(e-t)-Gs,o=Os(i+e)-Gs,n=pe({r:11.031566904639861*a-9.866943908131562*r-.16462299650829934*o,g:-3.2541473810744237*a+4.418770377582723*r-.16462299650829934*o,b:-3.6588512867136815*a+2.7129230459360922*r+1.9459282407775895*o});return void 0!==s&&(n.alpha=s),n}},fromMode:{rgb:t=>{const{r:e,g:i,b:s,alpha:a}=ce(t),r=Bs(.3*e+.622*i+.078*s+Gs),o=Bs(.23*e+.692*i+.078*s+Gs),n={mode:"xyb",x:(r-o)/2,y:(r+o)/2,b:Bs(.2434226892454782*e+.2047674442449682*i+.5518098665095535*s+Gs)-(r+o)/2};return void 0!==a&&(n.alpha=a),n}},ranges:{x:[-.0154,.0281],y:[0,.8453],b:[-.2778,.388]},interpolate:{x:ee,y:ee,b:ee,alpha:{use:ee,fixup:se}}},Vs={mode:"xyz50",parse:["xyz-d50"],serialize:"xyz-d50",toMode:{rgb:Pi,lab:Oi},fromMode:{rgb:Fi,lab:Ni},channels:["x","y","z","alpha"],ranges:{x:[0,.964],y:[0,.999],z:[0,.825]},interpolate:{x:ee,y:ee,z:ee,alpha:{use:ee,fixup:se}}},Ls={mode:"xyz65",toMode:{rgb:ge,xyz50:t=>{let{x:e,y:i,z:s,alpha:a}=t;void 0===e&&(e=0),void 0===i&&(i=0),void 0===s&&(s=0);let r={mode:"xyz50",x:1.0479298208405488*e+.0229467933410191*i-.0501922295431356*s,y:.0296278156881593*e+.990434484573249*i-.0170738250293851*s,z:-.0092430581525912*e+.0150551448965779*i+.7518742899580008*s};return void 0!==a&&(r.alpha=a),r}},fromMode:{rgb:de,xyz50:t=>{let{x:e,y:i,z:s,alpha:a}=t;void 0===e&&(e=0),void 0===i&&(i=0),void 0===s&&(s=0);let r={mode:"xyz65",x:.9554734527042182*e-.0230985368742614*i+.0632593086610217*s,y:-.0283697069632081*e+1.0099954580058226*i+.021041398966943*s,z:.0123140016883199*e-.0205076964334779*i+1.3303659366080753*s};return void 0!==a&&(r.alpha=a),r}},ranges:{x:[0,.95],y:[0,1],z:[0,1.088]},channels:["x","y","z","alpha"],parse:["xyz","xyz-d65"],serialize:"xyz-d65",interpolate:{x:ee,y:ee,z:ee,alpha:{use:ee,fixup:se}}},js={mode:"yiq",toMode:{rgb:({y:t,i:e,q:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);const a={mode:"rgb",r:t+.95608445*e+.6208885*i,g:t-.27137664*e-.6486059*i,b:t-1.10561724*e+1.70250126*i};return void 0!==s&&(a.alpha=s),a}},fromMode:{rgb:({r:t,g:e,b:i,alpha:s})=>{void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0);const a={mode:"yiq",y:.29889531*t+.58662247*e+.11448223*i,i:.59597799*t-.2741761*e-.32180189*i,q:.21147017*t-.52261711*e+.31114694*i};return void 0!==s&&(a.alpha=s),a}},channels:["y","i","q","alpha"],parse:["--yiq"],serialize:"--yiq",ranges:{i:[-.595,.595],q:[-.522,.522]},interpolate:{y:ee,i:ee,q:ee,alpha:{use:ee,fixup:se}}};let qs=((t=4)=>e=>"number"==typeof e?((t,e)=>Math.round(t*(e=Math.pow(10,e)))/e)(e,t):e)(2);const Us=t=>Math.max(0,Math.min(1,t||0)),Ws=t=>Math.round(255*Us(t)),Ys=zt("rgb"),Xs=t=>(t=>{if(void 0===t)return;let e=Ws(t.r),i=Ws(t.g),s=Ws(t.b);return void 0===t.alpha||1===t.alpha?`rgb(${e}, ${i}, ${s})`:`rgba(${e}, ${i}, ${s}, ${qs(Us(t.alpha))})`})(Ys(t));Bt(me),Bt(Ae),Bt(Ke),Bt(Qe),Bt(ti),Bt(ii),Bt(ri),Bt(oi),Bt(vi),Bt(Ti),Bt(Ii),Bt(Vi),Bt(Li),Bt(ji),Bt(qi),Bt(is),Bt(ss),Bt(as),Bt(fs),Bt(bs),Bt(_s),Bt(xs),Bt(ks),Bt(Cs),Bt(Ps),Bt(ae),Bt(Hs),Bt(Vs),Bt(Ls),Bt(js);const Js="unavailable",Zs="unknown",Ks=(Qs=[Js,Zs],(t,e)=>Qs.includes(t,e));var Qs;const ta=t=>t.substring(0,t.indexOf("."));const ea=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater","weather"]),ia=(t,e)=>{if((void 0!==e?e:t?.state)===Js)return"var(--state-unavailable-color)";const i=ra(t,e);return i?(s=i,Array.isArray(s)?s.reverse().reduce(((t,e)=>`var(${e}${t?`, ${t}`:""})`),void 0):`var(${s})`):void 0;var s},sa=(t,e,i)=>{const s=void 0!==i?i:e.state,a=function(t,e){const i=ta(t.entity_id),s=void 0!==e?e:t?.state;if(["button","event","infrared","input_button","radio_frequency","scene"].includes(i))return s!==Js;if(Ks(s))return!1;if("off"===s&&"alert"!==i)return!1;switch(i){case"alarm_control_panel":return"disarmed"!==s;case"alert":return"idle"!==s;case"cover":case"valve":return"closed"!==s;case"device_tracker":case"person":return"not_home"!==s;case"lawn_mower":return!["docked","paused"].includes(s);case"lock":return"locked"!==s;case"media_player":return"standby"!==s;case"vacuum":return!["idle","docked","paused"].includes(s);case"plant":return"problem"===s;case"group":return["on","home","open","locked","problem"].includes(s);case"timer":return"active"===s;case"camera":return"streaming"===s}return!0}(e,i);return aa(t,e.attributes.device_class,s,a)},aa=(t,e,i,s)=>{const a=[],r=((t,e="_")=>{const i="àáâäæãåāăąабçćčđďдèéêëēėęěеёэфğǵгḧхîïíīįìıİийкłлḿмñńǹňнôöòóœøōõőоṕпŕřрßśšşșсťțтûüùúūǘůűųувẃẍÿýыžźżз·",s=`aaaaaaaaaaabcccdddeeeeeeeeeeefggghhiiiiiiiiijkllmmnnnnnoooooooooopprrrsssssstttuuuuuuuuuuvwxyyyzzzz${e}`,a=new RegExp(i.split("").join("|"),"g"),r={"ж":"zh","х":"kh","ц":"ts","ч":"ch","ш":"sh","щ":"shch","ю":"iu","я":"ia"};let o;return""===t?o="":(o=t.toString().toLowerCase().replace(a,(t=>s.charAt(i.indexOf(t)))).replace(/[а-я]/g,(t=>r[t]||"")).replace(/(\d),(?=\d)/g,"$1").replace(/[^a-z0-9]+/g,e).replace(new RegExp(`(${e})\\1+`,"g"),"$1").replace(new RegExp(`^${e}+`),"").replace(new RegExp(`${e}+$`),""),""===o&&(o="unknown")),o})(i,"_"),o=s?"active":"inactive";return e&&a.push(`--state-${t}-${e}-${r}-color`),a.push(`--state-${t}-${r}-color`,`--state-${t}-${o}-color`,`--state-${o}-color`),a},ra=(t,e)=>{const i=void 0!==e?e:t?.state,s=ta(t.entity_id),a=t.attributes.device_class;if("sensor"===s&&"battery"===a){const t=(t=>{const e=Number(t);if(!isNaN(e))return e>=70?"--state-sensor-battery-high-color":e>=30?"--state-sensor-battery-medium-color":"--state-sensor-battery-low-color"})(i);if(t)return[t]}if("group"===s){const i=(t=>{const e=t.attributes.entity_id||[],i=[...new Set(e.map((t=>ta(t))))];return 1===i.length?i[0]:void 0})(t);if(i&&ea.has(i))return sa(i,t,e)}if(ea.has(s))return sa(s,t,e)};var oa;!function(t){t[t.TARGET_TEMPERATURE=1]="TARGET_TEMPERATURE",t[t.TARGET_TEMPERATURE_RANGE=2]="TARGET_TEMPERATURE_RANGE",t[t.TARGET_HUMIDITY=4]="TARGET_HUMIDITY",t[t.FAN_MODE=8]="FAN_MODE",t[t.PRESET_MODE=16]="PRESET_MODE",t[t.SWING_MODE=32]="SWING_MODE",t[t.AUX_HEAT=64]="AUX_HEAT",t[t.TURN_OFF=128]="TURN_OFF",t[t.TURN_ON=256]="TURN_ON",t[t.SWING_HORIZONTAL_MODE=512]="SWING_HORIZONTAL_MODE"}(oa||(oa={})),["auto","heat_cool","heat","cool","dry","fan_only","off"].reduce(((t,e,i)=>(t[e]=i,t)),{});const na={cooling:"cool",defrosting:"heat",drying:"dry",fan:"fan_only",heating:"heat",idle:"off",off:"off",preheating:"heat"};class la{static{la.colorCache={},la.element=void 0,la.unresolvedColor=!1}static _prefixKeys(t){let e={};return Object.keys(t).forEach((i=>{const s=`--${i}`,a=String(t[i]);e[s]=`${a}`})),e}static processTheme(t){let e={},i={},s={},a={};const{modes:r,...o}=t;return r&&(i={...o,...r.dark},e={...o,...r.light}),s=la._prefixKeys(e),a=la._prefixKeys(i),{themeLight:s,themeDark:a}}static processPalette(t){let e={},i={},s={},a={},r={};return Object.values(t).forEach((t=>{const{modes:a,...r}=t;e={...e,...r},a&&(s={...s,...r,...a.dark},i={...i,...r,...a.light})})),a=la._prefixKeys(i),r=la._prefixKeys(s),{paletteLight:a,paletteDark:r}}static setElement(t){la.element=t}static calculateColor(t,e,i){const s=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let a,r,o;const n=s.length;if(t<=s[0])return e[s[0]];if(t>=s[n-1])return e[s[n-1]];for(let l=0;l<n-1;l++){const n=s[l],h=s[l+1];if(t>=n&&t<h){if([a,r]=[e[n],e[h]],!i)return a;o=la.calculateValueBetween(n,h,t);break}}return la.getGradientValue(a,r,o)}static calculateColor2(t,e,i,s,a){const r=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let o,n,l;const h=r.length;if(t<=r[0])return e[r[0]];if(t>=r[h-1])return e[r[h-1]];for(let c=0;c<h-1;c++){const h=r[c],d=r[c+1];if(t>=h&&t<d){if([o,n]=[e[h].styles[i][s],e[d].styles[i][s]],!a)return o;l=la.calculateValueBetween(h,d,t);break}}return la.getGradientValue(o,n,l)}static calculateValueBetween(t,e,i){return(Math.min(Math.max(i,t),e)-t)/(e-t)}static getLovelacePanel(){var t=window.document.querySelector("home-assistant");return(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))||null}static calculateStrokeColor(t,e,i){const s=e?.colors??[];if(!s.length)return;const a=Number(t);if(!Number.isFinite(a))return s[0].color;if(a<=s[0].value)return s[0].color;const r=s[s.length-1];if(a>=r.value)return r.color;for(let o=0;o<s.length-1;o+=1){const t=s[o],e=s[o+1];if(a>=t.value&&a<e.value){if(!i)return t.color;const s=la.calculateValueBetween(t.value,e.value,a);return la.getGradientValue(t.color,e.color,s)}}return r.color}static getColorVariable(t){const e=t.slice(4,-1).trim();let i=e,s="",a=0;for(let n=0;n<e.length;n+=1){const t=e[n];if("("===t)a+=1;else if(")"===t)a-=1;else if(","===t&&0===a){i=e.slice(0,n).trim(),s=e.slice(n+1).trim();break}}const r=getComputedStyle(la.element).getPropertyValue(i).trim();if(r)return r;this.lovelace||(this.lovelace=la.getLovelacePanel());const o=getComputedStyle(this.lovelace).getPropertyValue(i).trim();return o||s}static getLovelaceColorVariable(t){const e=t.substr(4,t.length-5);this.lovelace||(this.lovelace=la.getLovelacePanel());return window.getComputedStyle(this.lovelace).getPropertyValue(e)}static getGradientValue(t,e,i){const s=la.colorToRGBA(t),a=la.colorToRGBA(e);if(!s||!a)return void(la.unresolvedColor=!0);const r=1-i,o=i,n=Math.floor(s[0]*r+a[0]*o),l=Math.floor(s[1]*r+a[1]*o),h=Math.floor(s[2]*r+a[2]*o),c=Math.floor(s[3]*r+a[3]*o);return`#${la.padZero(n.toString(16))}${la.padZero(l.toString(16))}${la.padZero(h.toString(16))}${la.padZero(c.toString(16))}`}static padZero(t){return t.length<2&&(t=`0${t}`),t.substr(0,2)}static colorToRGBA(t){if(null==t)return[0,0,0,0];const e=la.colorCache[t];if(e)return e;let i=t;if("var"===t.substr(0,3).valueOf()){i=t;for(let e=0;e<10&&i.trim().startsWith("var(");e+=1)if(i=la.getColorVariable(i.trim()),!i)return la.unresolvedColor=!0,void(la.element?.dev?.debug_colors&&console.log("[horseshoe-colors] unresolved css var",{argColor:t}))}let s=te(i);if(!s){const e=window.document.createElement("span"),a="rgb(1, 2, 3)";e.style.color=a,e.style.color=i,la.element.appendChild(e);const r=window.getComputedStyle(e).color;if(e.remove(),r!==a&&(s=te(r)),!s)return la.unresolvedColor=!0,void(la.element?.dev?.debug_colors&&console.log("[horseshoe-colors] unparseable color",{argColor:t,resolvedColor:i,computedColor:r}))}const a=zt("rgb")(s),r=[Math.round(255*Math.min(Math.max(a.r,0),1)),Math.round(255*Math.min(Math.max(a.g,0),1)),Math.round(255*Math.min(Math.max(a.b,0),1)),Math.round(255*(a.alpha??1))];return la.colorCache[t]=r,r}static hslToRgb(t){const e=t.h/360,i=t.s/100,s=t.l/100;let a,r,o;if(0===i)a=r=o=s;else{function n(t,e,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?t+6*(e-t)*i:i<.5?e:i<2/3?t+(e-t)*(2/3-i)*6:t}const l=s<.5?s*(1+i):s+i-s*i,h=2*s-l;a=n(h,l,e+1/3),r=n(h,l,e),o=n(h,l,e-1/3)}return a*=255,r*=255,o*=255,{r:a,g:r,b:o}}static computeColor(t){if(t.attributes?.hvac_action){const e=t.attributes.hvac_action;return e in na?ia(t,na[e]):void 0}if(t.attributes?.rgb_color)return`rgb(${t.attributes.rgb_color.join(",")})`;const e=ia(t);return e||void 0}static getHaEntityIconStyle(t){const e=la.computeColor(t),i=(t=>{if(t.attributes.brightness&&"plant"!==ta(t.entity_id))return`brightness(${(t.attributes.brightness+245)/5}%)`;return""})(t);return{color:e??"var(--state-icon-color)",fill:"currentColor",...i?{filter:i}:{}}}}class ha{static cache=new Map;static load(t){if(this.cache.has(t))return this.cache.get(t);const e=fetch(t).then((async e=>{if(!e.ok)throw new Error(`Could not load palette: ${t}`);return e.json()}));return this.cache.set(t,e),e}static async loadAll(t={}){const e=await Promise.all(Object.entries(t||{}).map((async([t,e])=>[t,await this.load(e)])));return Object.fromEntries(e)}static apply(t,e,i){Object.entries(e.ref).forEach((([e,i])=>{t.style.setProperty(`--${e}`,i)})),Object.entries(e.modes[i]).forEach((([e,i])=>{t.style.setProperty(`--${e}`,i)}))}static applyAll(t,e,i){Object.entries(e).forEach((([,e])=>{this.apply(t,e,i)}))}}class ca{constructor(t,e,i){this.element=t,this.redrawGradients=e,this.updateCard=i,this.hass=void 0,this.name=void 0,this.nameChanged=!1,this.modeChanged=!1,this.darkMode=!1,this.palettes={},this.palettesLoaded=!1,this.horseshoes=[]}setHorseshoes(t){this.horseshoes=t}getActiveColorStopMode(){return void 0!==this.hass?.themes?.darkMode?!0===this.hass.themes.darkMode?"dark":"light":this.darkMode?"dark":"light"}updateHass(t){this.hass=t;const e=t.selectedTheme||t.themes.theme||"",i=!0===t.themes.darkMode;return this.nameChanged=this.name!==e,this.modeChanged=this.darkMode!==i,!(!this.nameChanged&&!this.modeChanged)&&(this.name=e,this.darkMode=i,la.colorCache={},ha.applyAll(this.element,this.palettes,this.getActiveColorStopMode()),this.horseshoes.forEach((t=>t.clearPathItemCache())),this.redrawGradients(),!0)}async loadPalettes(t){this.palettesLoaded=!1,this.palettes=await ha.loadAll(t),la.setElement(this.element),ha.applyAll(this.element,this.palettes,this.getActiveColorStopMode()),la.colorCache={},this.palettesLoaded=!0,this.horseshoes.forEach((t=>t.clearPathItemCache())),this.updateCard()}markModeHandled(){this.modeChanged=!1}}class da{static toStyleDict(t){return da.toDict(t,{stringToDict:da.cssStringToDict,mapValue:da.toStyleValue})}static toClassDict(t){return da.toDict(t,{stringToDict:da.classStringToDict,mapValue:Boolean})}static toIconDict(t){return da.toDict(t,{stringToDict:da.stringToDefaultDict("default"),mapValue:String})}static toDict(t,e={}){const{stringToDict:i=da.stringToDefaultDict("default"),mapValue:s=(t=>t),skipNull:a=!0,skipFalse:r=!0}=e,o=t=>null==t&&a||!1===t&&r?{}:Array.isArray(t)?t.reduce(((t,e)=>({...t,...o(e)})),{}):da.isPlainObject(t)?Object.fromEntries(Object.entries(t).filter((([,t])=>(null!=t||!a)&&(!1!==t||!r))).map((([t,e])=>[t,s(e,t)]))):"string"==typeof t?i(t):{};return o(t)}static toStyleValue(t){return null==t?t:String(t).trim().replace(/;+$/,"")}static cssStringToDict(t){return String(t).split(";").map((t=>t.trim())).filter(Boolean).reduce(((t,e)=>{const i=e.indexOf(":");if(i<=0)return t;const s=e.slice(0,i).trim(),a=e.slice(i+1).trim();return s&&a?{...t,[s]:a}:t}),{})}static toColorStopDict(t){return da.toDict(t,{stringToDict:da.keyValueStringToDict,mapValue:String})}static keyValueStringToDict(t){const e=String(t).trim(),i=e.indexOf(":");if(i<=0)return{};const s=e.slice(0,i).trim(),a=e.slice(i+1).trim();return s&&a?{[s]:a}:{}}static classStringToDict(t){return String(t).trim().split(/\s+/).filter(Boolean).reduce(((t,e)=>({...t,[e]:!0})),{})}static stringToDefaultDict(t="default"){return e=>({[t]:String(e)})}static requireArray(t,e="value"){if(null==t)return[];if(!Array.isArray(t))throw new Error(`[config-helper] "${e}" must be an array.`);return t}static isDisabled(t,e,i,s){const a=s.hasJavascriptTemplates(e)?s.getJsTemplateOrValue(t,e):e;if(![!0,!1,0,1,"true","false","1","0"].includes(a))throw new Error(`[${i}] disabled must resolve to true, false, 0 or 1`);return!0===a||1===a||"true"===a||"1"===a}static ensureArray(t){return null==t?[]:Array.isArray(t)?t:[t]}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}}const ua=Object.freeze(["horseshoes","horseshoes_v2","states","texts","names","areas","circles","arcs","rectangles","lines","hlines","vlines","icons","sparklines","controls"]),pa=Object.freeze(["rectangles","circles","arcs"]);class ga{static STATIC_REF_MARKER=Symbol("fhs-static-ref");static compile(t){t.layout.groups=ga.compileItems(t.layout.groups),ua.forEach((e=>{const i=t.layout?.[e];Array.isArray(i)&&(t.layout[e]=ga.compileItems(i))})),ga.compileDefinitions(t.layout?.clips),ga.compileDefinitions(t.layout?.masks)}static compileDefinitions(t){t&&Object.values(t).forEach((t=>{pa.forEach((e=>{const i=t[e];Array.isArray(i)&&(t[e]=ga.compileItems(i))}))}))}static compileItems(t){const e=new Map;return t.map(((t,i)=>{let s;if(void 0===t.same_as)s=t;else{const a=e.get(String(t.same_as));if(!a)throw new Error(`same_as '${t.same_as}' not found for item ${i}`);const{same_as:r,same_as_replace:o=[],...n}=t,l={...a},h=[...o],c=(t,e)=>{t&&"object"==typeof t&&t[ga.STATIC_REF_MARKER]?h.push(e.join(".")):t&&"object"==typeof t&&!Array.isArray(t)&&Object.entries(t).forEach((([t,i])=>{c(i,[...e,t])}))};Object.entries(n).forEach((([t,e])=>{c(e,[t])})),h.forEach((t=>{ga.deleteReplacePath(l,t)})),s=bt.mergeDeep(l,n),s=ga.applyDeltas(t,s,i),delete s.same_as,delete s.same_as_replace,Object.keys(s).filter((t=>t.startsWith("same_as_d"))).forEach((t=>delete s[t]))}return e.set(String(s.id),s),s}))}static applyDeltas(t,e,i){return Object.entries(t).forEach((([t,s])=>{if(!t.startsWith("same_as_d"))return;const a=t.substring(9);if(!a)throw new Error(`Invalid same_as delta field '${t}' for item ${i}`);if(void 0===e[a])throw new Error(`same_as delta '${t}' requires '${a}' for item ${i}`);if(!ga.isStaticNumber(e[a])&&!ga.isEntityAddress(e[a]))throw new Error(`same_as delta '${t}' requires numeric '${a}' for item ${i}`);if(!ga.isStaticNumber(s))throw new Error(`same_as delta '${t}' must be numeric for item ${i}`);ga.isEntityAddress(e[a])?e[a]={...e[a],index:e[a].index+s}:e[a]+=s})),e}static deleteReplacePath(t,e){const i=String(e).split(".");let s=t;for(let a=0;a<i.length-1;a+=1){const t=i[a];if(void 0===s[t])return;s[t]=Array.isArray(s[t])?[...s[t]]:{...s[t]},s=s[t]}delete s[i[i.length-1]]}static mergeListByKey(t,e,i){const s=new Map;return t.forEach((t=>{s.set(String(t[i]),t)})),e.forEach((t=>{const e=String(t[i]);s.has(e)?s.set(e,bt.mergeDeep(s.get(e),t)):s.set(e,t)})),[...s.values()]}static isEntityAddress(t){return"entity_address"===t?.type&&"string"==typeof t.slot&&Number.isInteger(t.index)}static isStaticNumber(t){return"number"==typeof t&&Number.isFinite(t)}}const ma=200,fa=ma,ya=12,va={arcs:100,rectangles:200,circles:300,horseshoes:400,horseshoes_v2:400,lines:500,hlines:500,vlines:500,icons:600,sparklines:650,areas:700,names:800,states:900,texts:1e3,controls:1100},ba={arcs:1e5,rectangles:2e5,circles:3e5,horseshoes:4e5,horseshoes_v2:4e5,lines:5e5,hlines:5e5,vlines:5e5,icons:6e5,sparklines:65e4,areas:7e5,names:8e5,states:9e5,texts:1e6,controls:11e5};class _a{constructor(t){this.templates=t}initializeDeveloperConfig(t){t.dev={debug:!1,performance:!1,...t.dev}}initializeCardRuntimeDefaults(t){t.card_filter??="card--filter-none"}compileStaticValues(t){const e=(t,i)=>{if((t=>"string"==typeof t&&t.startsWith("calc(")&&t.endsWith(")"))(t)){const e=t.slice(5,-1).trim();if(!/^[0-9+\-*/().,\sA-Za-z_]+$/.test(e))throw new Error(`Invalid static calc expression '${t}'`);const s={...i,sin:Math.sin,cos:Math.cos,tan:Math.tan,abs:Math.abs,round:Math.round,floor:Math.floor,ceil:Math.ceil,min:Math.min,max:Math.max,sqrt:Math.sqrt,PI:Math.PI},a=Function(...Object.keys(s),`"use strict"; return (${e});`)(...Object.values(s));if("number"!=typeof a||!Number.isFinite(a))throw new Error(`Static calc expression '${t}' did not return a finite number`);return a}if(Array.isArray(t)){const s=t.map((t=>e(t,i)));return t[ga.STATIC_REF_MARKER]&&Object.defineProperty(s,ga.STATIC_REF_MARKER,{value:!0}),s}return t&&"object"==typeof t&&Object.entries(t).forEach((([s,a])=>{t[s]=e(a,i)})),t},i={zpos:{...va}},s=t.constants??{};Object.entries(s).forEach((([t,a])=>{s[t]=e(a,i),"number"==typeof s[t]&&Number.isFinite(s[t])&&(i[t]=s[t])}));const a=t=>{if("string"==typeof t&&t.startsWith("ref(")&&t.endsWith(")")){const e=t.slice(4,-1).trim();if(!(e in s))throw new Error(`Static ref '${e}' not found`);const i=s[e],a=i&&"object"==typeof i?bt.mergeDeep(Array.isArray(i)?[]:{},i):i;return a&&"object"==typeof a&&Object.defineProperty(a,ga.STATIC_REF_MARKER,{value:!0}),a}return Array.isArray(t)?t.map((t=>a(t))):(t&&"object"==typeof t&&Object.entries(t).forEach((([e,i])=>{t[e]=a(i)})),t)};a(t),e(t,i)}resolveLayoutEntityIndexes(t,e,i){const s={};if(e.forEach(((t,e)=>{s[t.entity]=void 0===s[t.entity]?e:null})),ua.forEach((e=>{const i=t.layout[e];Array.isArray(i)&&i.forEach((t=>{if(void 0!==t.entity){if(void 0===s[t.entity])throw new Error(`[${e}] Unknown entity: ${t.entity}`);if(null===s[t.entity])throw new Error(`[${e}] Entity '${t.entity}' occurs more than once; use entity_index`);t.entity_index=s[t.entity]}}))})),void 0===t.animations)return;const a={};Object.entries(t.animations).forEach((([t,r])=>{const o=t.substring(7);let n;if(/^\d+$/.test(o)){if(n=Number(o),void 0===e[n])throw new Error(`[animations] Unknown entity index: ${n}`)}else{const t=o.match(/^([A-Za-z_][A-Za-z0-9_]*)\[(\d+)\]$/);if(t){const e=t[1],s=Number(t[2]),a=i[e];if(void 0===a)throw new Error(`[animations] Unknown entity slot: ${e}`);if(void 0===a[s])throw new Error(`[animations] Entity slot ${e} has no index ${s}`);n=a[s]}else{if(n=s[o],void 0===n)throw new Error(`[animations] Unknown entity: ${o}`);if(null===n)throw new Error(`[animations] Entity '${o}' occurs more than once; use entity.<index>`)}}const l=`entity.${n}`;if(void 0!==a[l])throw new Error(`[animations] Duplicate entity target: ${l}`);a[l]=r})),t.animations=a}assignLayoutItemIds(t){const e=t=>t.map(((t,e)=>({...t,id:String(t.id??e)})));t.layout.groups??=[],t.layout.groups=e(t.layout.groups),Array.isArray(t.layout.compounds)&&(t.layout.compounds=e(t.layout.compounds),t.layout.compounds.forEach((t=>{ua.forEach((i=>{Array.isArray(t[i])&&(t[i]=e(t[i]))}))}))),ua.forEach((i=>{Array.isArray(t.layout[i])&&(t.layout[i]=e(t.layout[i]))})),[t.layout.clips,t.layout.masks].forEach((t=>{t&&Object.values(t).forEach((t=>{pa.forEach((i=>{Array.isArray(t[i])&&(t[i]=e(t[i]))}))}))}))}removeDisabledLayoutItems(t){ua.forEach((e=>{const i=t.layout[e];Array.isArray(i)&&(t.layout[e]=i.filter((t=>void 0===t.disabled||!da.isDisabled(t,t.disabled,e,this.templates))))}))}removeDisabledEntityConfigs(t){t.entities=t.entities.map(((t,e)=>{if(void 0===t.disabled)return t;const i={...t,entity_index:e};return{...t,disabled:da.isDisabled(i,t.disabled,"entities",this.templates)}})).filter((t=>!0!==t.disabled))}detectJavascriptTemplates(t){let e=!1;return t.entities.forEach((t=>{this.templates.detectJavascriptTemplates(t)&&(e=!0)})),ua.forEach((i=>{const s=t.layout[i];Array.isArray(s)&&s.forEach((t=>{this.templates.detectJavascriptTemplates(t)&&(e=!0)}))})),t.layout.groups.forEach((t=>{this.templates.detectJavascriptTemplates(t)&&(e=!0)})),t.animations&&Object.values(t.animations).forEach((t=>{t.forEach((t=>{this.templates.detectJavascriptTemplates(t)&&(e=!0)}))})),t.styles&&this.templates.detectJavascriptTemplates(t.styles)&&(e=!0),e}buildEntitySlots(t){const e={flat:[],default:[]};let i="default";return t.forEach(((t,s)=>{if(void 0!==t.slot){if("string"!=typeof t.slot||!/^[A-Za-z_][A-Za-z0-9_]*$/.test(t.slot))throw new Error(`[entities] Invalid slot ${t.slot} at index ${s}`);if("flat"===t.slot)throw new Error("[entities] Slot name flat is reserved");i=t.slot}t.slot=i,e[i]??=[],e[i].push(s),e.flat.push(s)})),e}normalizeEntityIndexAddresses(t){const e=t=>{Array.isArray(t)?t.forEach((t=>e(t))):t&&"object"==typeof t&&Object.entries(t).forEach((([i,s])=>{"entity_index"!==i||void 0===s?e(s):t[i]=(t=>{if("number"==typeof t)return{type:"entity_address",slot:"flat",index:t};if("string"==typeof t){const e=t.match(/^([A-Za-z_][A-Za-z0-9_]*)\[(\d+)\]$/);if(e)return{type:"entity_address",slot:e[1],index:Number(e[2])}}throw new Error(`[layout] Invalid entity_index ${t}. Use a number or slot[index]`)})(s)}))};e(t.layout)}flattenEntitySlotIndexes(t,e){const i=t=>{Array.isArray(t)?t.forEach((t=>i(t))):t&&"object"==typeof t&&Object.entries(t).forEach((([s,a])=>{if("entity_index"!==s||"entity_address"!==a?.type)i(a);else{const i=e[a.slot];if(void 0===i)throw new Error(`[layout] Unknown entity slot ${a.slot}`);if(a.index>=i.length)throw new Error(`[layout] Entity slot ${a.slot} has no index ${a.index}`);t[s]=i[a.index]}}))};i(t.layout)}validateActionConfigs(t){const e=["tap_action","hold_action","double_tap_action"],i=["none","more-info","toggle","perform-action","call-service","navigate","url","assist","fire-dom-event","increment","decrement","select-option"],s=(t,a)=>{Array.isArray(t)?t.forEach(((t,e)=>s(t,`${a}[${e}]`))):t&&"object"==typeof t&&Object.entries(t).forEach((([t,r])=>{const o=a?`${a}.${t}`:t;if("double_tap"===t)throw Error(`[actions] Invalid '${o}'; use 'double_tap_action'`);if(e.includes(t)){(r.actions??[r]).forEach(((t,e)=>{const s=r.actions?`${o}.actions[${e}].action`:`${o}.action`;if(!this.templates.hasJavascriptTemplates(t.action)&&!i.includes(t.action))throw Error(`[actions] Invalid action '${t.action}' at '${s}'`)}))}s(r,o)}))};s(t,"")}}class xa{static normalize(t,e){return t?Array.isArray(t)?{scales:{},colors:xa.normalizeColors(t)}:!xa.isPlainObject(t)||t.colors||t.scales||t.modes?xa.isPlainObject(t)?{...t,scales:xa.normalizeScales(t.scales),colors:xa.normalizeColors(xa.getDarkOrLightColors(t,e))}:{scales:{},colors:[]}:{scales:{},colors:xa.normalizeColors(t)}:{scales:{},colors:[]}}static getDarkOrLightColors(t,e){const i=t.colors,s=e&&xa.isPlainObject(t.modes)?t.modes[e]:void 0;return null==s?i:s}static normalizeScales(t){return xa.isPlainObject(t)?Object.fromEntries(Object.entries(t).map((([t,e])=>[t,xa.isPlainObject(e)?{...e}:e]))):{}}static normalizeColors(t){if(!t)return[];if(Array.isArray(t)){const e=t.flatMap((t=>xa.normalizeColorArrayEntry(t))).filter(Boolean);return e.some((t=>void 0!==t.state))?e:e.sort(((t,e)=>t.value-e.value))}return xa.isPlainObject(t)?Object.entries(t).map((([t,e])=>xa.normalizeColorPair(t,e))).filter(Boolean).sort(((t,e)=>t.value-e.value)):[]}static normalizeColorArrayEntry(t){if(xa.isPlainObject(t)&&Object.prototype.hasOwnProperty.call(t,"state")&&Object.prototype.hasOwnProperty.call(t,"color")){const e=xa.normalizeColorEntry(t);return e?[e]:[]}if(xa.isPlainObject(t)&&Object.prototype.hasOwnProperty.call(t,"value")&&Object.prototype.hasOwnProperty.call(t,"color")){const e=xa.normalizeColorEntry(t);return e?[e]:[]}return xa.isPlainObject(t)?Object.entries(t).map((([t,e])=>xa.normalizeColorPair(t,e))).filter(Boolean):[]}static normalizeColorPair(t,e){const i=Number(t);return Number.isFinite(i)?null==e?null:{value:i,color:String(e)}:null}static normalizeColorEntry(t){if(!xa.isPlainObject(t))return null;if(void 0!==t.state)return void 0===t.color||null===t.color?null:{...t,state:String(t.state),color:String(t.color)};const e=Number(t.value);return Number.isFinite(e)?void 0===t.color||null===t.color?null:{...t,value:e,color:String(t.color)}:null}static ensureMinimumStops(t,e){return t?.colors&&1===t.colors.length?{...t,colors:[t.colors[0],{value:e,color:t.colors[0].color}]}:t}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}}class wa{constructor(t,e){this.templates=t,this.cardTheme=e,this.stateChanged=!1}getItemColorStop(t,e,i,s){if(!e)return;const a=t.entity_index;if(null==a)return;const r=s[a];if(!r)return;const o=i.entities[a].attribute,n=o&&void 0!==r.attributes[o]?r.attributes[o]:r.state,l=e.colors.filter((t=>void 0!==t.state));if(l.length)return l.find((t=>String(t.state)===String(n)));const h=Number(n);if(!Number.isFinite(h))return;const c=la.calculateStrokeColor(h,e,"colorstopinterpolated"===t.show.item_style),d=h<=e.colors[0].value?e.colors[0]:e.colors.find(((t,i)=>{const s=e.colors[i+1];return void 0===s||h<s.value}));return d?{...d,color:c}:void 0}getItemColorFromStops(t,e,i,s){return this.getItemColorStop(t,e,i,s)?.color}buildRuntimeEntityConfigs(t,e){t.dev.debug&&console.log("resolving entity config for",t.entities);const i=t.entities.map(((t,i)=>{const s={entity_index:i},a=e&&this.templates.hasJavascriptTemplates(t)?this.templates.getJsTemplateOrValue(s,t):t;return a.color_stops&&(a.colorstops=xa.normalize(a.color_stops,this.cardTheme.getActiveColorStopMode())),a})),s=["min_time","max_time","bin_duration","aggregate_func","duration","min","avg","max"],a=t.layout.sparklines??[];return i.map((t=>{if(!t.entity.startsWith("fhs_sparkline."))return t;let e,r;if(a.forEach((i=>{s.forEach((s=>{t.entity===`fhs_sparkline.${i.id}_${s}`&&(e=i,r=s)}))})),!e)throw new Error(`[entities] Unknown sparkline entity: ${t.entity}`);const o={...i[e.entity_index],...t,local:!0,source_entity_index:e.entity_index,sparkline_id:e.id,sparkline_entity_type:r};return delete o.attribute,void 0===t.name&&delete o.name,"min_time"!==r&&"max_time"!==r||(o.format=t.format??"datetime-short",o.unit=t.unit??""),"duration"!==r&&"bin_duration"!==r||void 0!==t.unit||delete o.unit,"aggregate_func"===r&&(o.unit=t.unit??""),o}))}updateSparklineEntities(t,e,i){t.forEach(((s,a)=>{if(!s.sparkline_entity_type)return;const r=i.find((t=>t.config.id===s.sparkline_id)),o=e[s.source_entity_index],n=t[s.source_entity_index],l=s.sparkline_entity_type;let h,c=o.attributes.unit_of_measurement,d=o.attributes.device_class;if(["min","avg","max","min_time","max_time"].includes(l)){if(h=Object.hasOwn(r.stats,l)?r.stats[l]:"unavailable","avg"===l&&Number.isFinite(Number(h))){const t=void 0!==n.decimals?Number(n.decimals):Number(String(o.state).includes(".")?String(o.state).split(".")[1].length:0);h=Number(h).toFixed(t)}"min_time"!==l&&"max_time"!==l||(c=void 0,d=void 0)}if("duration"===l){if("real_time"!==r.config.period.type&&r.historyDurationReady){const t=r.config.period[r.config.period.type].duration.hour;h=String(t),c="h",t<1&&(h=String(60*t),c="min"),t>=24&&(h=String(t/24),c="d")}else h="unavailable",c="h";d="duration"}if("bin_duration"===l){if("real_time"!==r.config.period.type&&"state_bands"!==r.config.sparkline.show.chart_type&&r.historyDurationReady){const t=1/r.calculateBinsPerHour(r.config);h=String(t),c="h",t<1&&(h=String(60*t),c="min"),t>=24&&(h=String(t/24),c="d")}else h="unavailable",c="h";d="duration"}if("aggregate_func"===l){h="real_time"!==r.config.period.type&&"state_bands"!==r.config.sparkline.show.chart_type&&r.historyDurationReady?r.config.sparkline.state_values.aggregate_func:"unavailable",c=void 0,d=void 0}e[a]=bt.mergeDeep(o,{entity_id:s.entity,state:String(h),label:void 0===s.name?{min:"min",avg:"mean",max:"max",min_time:"min",max_time:"max",duration:"Duration",bin_duration:"Bin duration",aggregate_func:"Aggregate function"}[l]:void 0,attributes:{...o.attributes,source_entity_id:["min","avg","max"].includes(l)?o.entity_id:void 0,unit_of_measurement:c,device_class:d,sparkline_id:s.sparkline_id,sparkline_entity_type:l}}),this.stateChanged=!0}))}markStateHandled(){this.stateChanged=!1}}class $a{constructor(){this.styles={lines:{},vlines:{},hlines:{},circles:{},arcs:{},rectangles:{},icons:{},iconsIcon:{},names:{},areas:{},states:{},texts:{},controls:{}}}update(t,e,i,s){s&&t.animations&&Object.keys(t.animations).forEach((s=>{const a=s.substr(Number(s.indexOf(".")+1));t.animations[s].forEach((t=>{const s={...t,entity_index:a},r=i.hasJavascriptTemplates(t)?i.getJsTemplateOrValue(s,t):t;e[a].state.toLowerCase()===r.state.toLowerCase()&&(["lines","vlines","hlines","circles","arcs","rectangles","names","areas","states","texts","controls"].forEach((t=>{r[t]&&r[t].forEach((e=>{const i=e.animation_id;null!=i&&(this.styles[t][i]={...e.reuse?this.styles[t][i]??{}:{},...da.toStyleDict(e.styles)})}))})),r.icons&&r.icons.forEach((t=>{const e=t.animation_id;this.styles.icons[e]&&t.reuse||(this.styles.icons[e]={},this.styles.iconsIcon[e]={}),this.styles.icons[e]={...this.styles.icons[e],...da.toStyleDict(t.styles)},this.styles.iconsIcon[e]=t.icon})))}))}))}}const ka=["fill","stroke","color","stop-color","flood-color"],Sa=["grayscale","monochrome","duotone","preserve_neutral","lightness","brightness","contrast","saturation","opacity"],Ma=zt("rgb"),Aa=zt("oklch");class Ta{static mergeFilters(t){let e={};return t.forEach((t=>{if(!t)return;const i=da.toDict(t,{skipFalse:!1}),{inherit:s,...a}=i;!1===s&&(e={}),e=bt.mergeDeep(e,a)})),e}static applyToStyles(t,e,i){const s=Array.isArray(e)?Ta.mergeFilters(e):e;if(!Ta.hasAnyFilter(s))return t;const a={...t};return ka.forEach((t=>{if(void 0===a[t])return;const e=Ta.getFilterForProperty(s,t);Ta.hasFilter(e)&&(a[t]=Ta.applyToColor(a[t],e,i))})),a}static getFilterForProperty(t,e){const i=t[e]&&"object"==typeof t[e]?t[e]:{};return{...Object.fromEntries(Object.entries(t).filter((([t])=>Sa.includes(t)))),...i}}static hasAnyFilter(t){return Sa.some((e=>void 0!==t?.[e]))||ka.some((e=>Ta.hasFilter(Ta.getFilterForProperty(t??{},e))))}static hasFilter(t){return Sa.some((e=>void 0!==t[e]))}static applyToColor(t,e,i){const s=String(t).trim();if("none"===s||"currentColor"===s||"inherit"===s||s.startsWith("url("))return t;la.setElement(i);const a=la.colorToRGBA(s);if(!a)return t;let r={mode:"rgb",r:a[0]/255,g:a[1]/255,b:a[2]/255,alpha:a[3]/255};return void 0!==e.grayscale&&(r=Ta.applyGrayscale(r,e.grayscale)),void 0!==e.monochrome&&(r=Ta.applyMonochrome(r,e,i)),void 0!==e.duotone&&(r=Ta.applyDuotone(r,e,i)),void 0!==e.lightness&&(r=Ta.applyLightness(r,e.lightness)),void 0!==e.brightness&&(r=Ta.applyBrightness(r,Number(e.brightness))),void 0!==e.contrast&&(r=Ta.applyContrast(r,Number(e.contrast))),void 0!==e.saturation&&(r=Ta.applySaturation(r,Number(e.saturation))),void 0!==e.opacity&&(r={...r,alpha:Ta.clamp((r.alpha??1)*Number(e.opacity),0,1)}),Xs(Ma(r))}static applyGrayscale(t,e){const i=Aa(t),s="object"==typeof e,a=s?1:Number(e),r=s?Number(e.min)+i.l*(Number(e.max)-Number(e.min)):i.l,o={...i,l:Ta.clamp(r,0,1),c:0},n=Ma(o);return Ta.mixRgb(t,n,Ta.clamp(a,0,1))}static applyLightness(t,e){const i=Aa(t),s="object"==typeof e?Number(e.min)+i.l*(Number(e.max)-Number(e.min)):Number(e);return Ma({...i,l:Ta.clamp(s,0,1)})}static applyMonochrome(t,e,i){const s=Aa(t);if(e.preserve_neutral&&Ta.isNeutralOklch(s))return t;const a=Ta.normalizeMonochromeFilter(e.monochrome),r=Ta.resolveColor(a.color,i),o=Aa(r),n=Ma({...o,l:s.l,alpha:t.alpha});return Ta.mixRgb(t,n,a.amount)}static applyDuotone(t,e,i){const s=Aa(t);if(e.preserve_neutral&&Ta.isNeutralOklch(s))return t;const a=Ta.normalizeDuotoneFilter(e.duotone),r=Ta.resolveColor(a.dark,i),o=Ta.resolveColor(a.light,i),n=Ta.mixRgb(r,o,s.l);return Ta.mixRgb(t,n,a.amount)}static applyBrightness(t,e){const i=Aa(t);return Ma({...i,l:Ta.clamp(i.l*e,0,1)})}static applyContrast(t,e){return{...t,r:Ta.clamp((t.r-.5)*e+.5,0,1),g:Ta.clamp((t.g-.5)*e+.5,0,1),b:Ta.clamp((t.b-.5)*e+.5,0,1)}}static applySaturation(t,e){const i=Aa(t);return Ma({...i,c:Math.max(0,i.c*e)})}static normalizeMonochromeFilter(t){return"object"==typeof t?{color:t.color,amount:t.amount??1}:{color:t,amount:1}}static normalizeDuotoneFilter(t){return{...t,amount:t.amount??1}}static isNeutralOklch(t){return t.l<=.005||t.l>=.995||Math.abs(t.c??0)<=5e-4}static resolveColor(t,e){la.setElement(e);const i=la.colorToRGBA(String(t));return{mode:"rgb",r:i[0]/255,g:i[1]/255,b:i[2]/255,alpha:i[3]/255}}static mixRgb(t,e,i){const s=Ta.clamp(i,0,1);return{mode:"rgb",r:Ta.clamp(t.r+(e.r-t.r)*s,0,1),g:Ta.clamp(t.g+(e.g-t.g)*s,0,1),b:Ta.clamp(t.b+(e.b-t.b)*s,0,1),alpha:Ta.clamp((t.alpha??1)+((e.alpha??1)-(t.alpha??1))*s,0,1)}}static clamp(t,e,i){return Math.min(Math.max(t,e),i)}}const Ca=ct(class extends dt{update(t,[e]){return function(t,e){const i=e.hasTap||e.hasHold||e.hasDoubleClick;if(t.style.cursor=i?"pointer":"default",t.fhsActionHandler)return void(t.fhsActionHandler.options=e);const s={options:e,holdTimer:void 0,doubleTapTimer:void 0,held:!1,pointerId:void 0,startX:0,startY:0},a=e=>{t.dispatchEvent(new CustomEvent("action",{bubbles:!0,composed:!0,detail:{action:e}}))},r=()=>{window.clearTimeout(s.holdTimer),s.holdTimer=void 0,s.held=!1,s.pointerId=void 0};t.addEventListener("pointerdown",(t=>{0===t.button&&(t.stopPropagation(),s.pointerId=t.pointerId,s.startX=t.clientX,s.startY=t.clientY,s.held=!1,s.options.hasHold&&(s.holdTimer=window.setTimeout((()=>{s.held=!0,a("hold")}),500)))})),t.addEventListener("pointermove",(t=>{if(t.pointerId!==s.pointerId)return;const e=Math.abs(t.clientX-s.startX),i=Math.abs(t.clientY-s.startY);(e>8||i>8)&&r()})),t.addEventListener("pointercancel",r),t.addEventListener("pointerup",(t=>{t.pointerId===s.pointerId&&(t.preventDefault(),t.stopPropagation(),window.clearTimeout(s.holdTimer),s.holdTimer=void 0,s.pointerId=void 0,s.options.hasHold&&s.held?s.held=!1:s.options.hasDoubleClick?void 0!==s.doubleTapTimer?(window.clearTimeout(s.doubleTapTimer),s.doubleTapTimer=void 0,a("double_tap")):s.doubleTapTimer=window.setTimeout((()=>{s.doubleTapTimer=void 0,s.options.hasTap&&a("tap")}),250):s.options.hasTap&&a("tap"))})),t.addEventListener("click",(t=>{t.preventDefault(),t.stopPropagation()})),t.addEventListener("contextmenu",(t=>{s.options.hasHold&&(t.preventDefault(),t.stopPropagation())})),t.addEventListener("keydown",(t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),t.stopPropagation(),a("tap"))})),t.fhsActionHandler=s}(t.element,e),L}render(){}});class Ea{constructor(t,e,i,s,a,r,o=r,n=void 0,l=void 0){this.sourceConfig=t,this.hasJavascript=i.hasJavascriptTemplates(this.sourceConfig),this.config=this.sourceConfig,this.id=t.id,this.index=e,this.templates=i,this.cardId=s,this.card=a,this.animationSection=r,this.zposSection=o,this.defaultZpos=va[o]??0,this.config.zpos??=this.defaultZpos,this.config.dzpos??=0,this.zpos=Number(this.config.zpos)+Number(this.config.dzpos),this.renderIndex=(ba[o]??0)+e,this.entity_index=t.entity_index??n,this.colorStopPaintDefaults=l,this.entity=void 0,this.entityConfig=void 0,this.configChanged=!0,this.activeConfigInitialized=!1,this.activeConfigSignature=void 0}updateRuntimeConfig(){const t=this.config.group??this.sourceConfig.group??"card";if(this.configChanged=!this.activeConfigInitialized||this.card.cardLayout.changedGroupIds.has(t)||this.card.cardTheme.modeChanged,this.hasJavascript&&(!this.activeConfigInitialized||this.card.evaluateJavascriptTemplates)){const t=this.templates.getJsTemplateOrValue(this.sourceConfig,this.sourceConfig,{resolveKeys:!0}),e=JSON.stringify(t);e!==this.activeConfigSignature&&(this.config=t,this.activeConfigSignature=e,this.configChanged=!0)}this.configChanged&&this.config.color_stops&&(this.config.colorstops=xa.normalize(this.config.color_stops,this.card.cardTheme.getActiveColorStopMode())),this.configChanged&&this.colorStopPaintDefaults&&(this.config.color_stops||["colorstop","colorstopsegments","colorstopinterpolated"].includes(this.config.show?.item_style))&&this.normalizeLayoutItemColorStopMode(this.config),this.configChanged&&this.config.sparkline?.color_stops&&(this.config.sparkline.colorstops=xa.normalize(this.config.sparkline.color_stops,this.card.cardTheme.getActiveColorStopMode())),this.zpos=Number(this.config.zpos)+Number(this.config.dzpos),this.activeConfigInitialized=!0}normalizeLayoutItemColorStopMode(t,e=this.colorStopPaintDefaults){t.show??={},t.show.item_style??="colorstop",["colorstop","colorstopsegments","colorstopinterpolated"].includes(t.show.item_style)&&(t.colorstop={...e,...t.colorstop},t.colorstopinterpolated={...e,...t.colorstopinterpolated},t.colorstopsegments={...e,...t.colorstopsegments},["colorstop","colorstopsegments","colorstopinterpolated"].forEach((e=>{if("boolean"!=typeof t[e].fill||"boolean"!=typeof t[e].stroke)throw new Error(`[${this.animationSection}] ${e}.fill and ${e}.stroke must be boolean`)})))}setState(t,e){this.entity=t,this.entityConfig=e}setEntities(t,e){if(void 0===this.entity_index)return void this.setStaticState();const i=t[this.entity_index],s=e[this.entity_index];s&&i&&this.setState(s,i)}setStaticState(){}hassAvailable(){}connected(){}disconnected(){}firstUpdated(){}updated(){}hassConnected(){}requiresHassUpdate(){return!1}getStyles(t){return{...t,...da.toStyleDict(this.config.styles),...da.toStyleDict(this.card.cardAnimations.styles[this.animationSection]?.[this.config.animation_id]??{})}}getColorFilterCascade(t=[]){const e=this.card.cardLayout.groupManager.getGroupChainForItem(this.config).map((t=>t.color_filter));return[this.card.config.color_filter,...e,this.config.color_filter,...t]}getRenderStyles(t,e=[]){const i=Ta.applyToStyles(t,this.getColorFilterCascade(e),this.card);return this.card.cardLayout.masksClips.applyGradientRefs(i)}applyColorStops(t,e=this.config,i=["fill"]){if(!["colorstop","colorstopsegments","colorstopinterpolated"].includes(e.show?.item_style))return;const s=e.colorstops??this.card.resolvedEntityConfigs[e.entity_index].colorstops,a=this.card.cardEntities.getItemColorStop(e,s,this.card.config,this.card.entities);if(a){const s=e[e.show.item_style];Object.assign(t,da.toStyleDict(a.styles)),s.fill&&i.forEach((e=>{t[e]=a.color})),s.stroke&&(t.stroke=a.color)}}textEllipsis(t,e){return e&&e<t.length?t.slice(0,e-1).concat("..."):t}getGroupScaleTransform(){return this.card.cardLayout.getGroupScaleTransform(this.config)}getGroupScaleStyle(){return this.card.cardLayout.getGroupScaleStyle(this.config)}renderItemLayers(t,e=this.config){let i=t;if(e.mask){(Array.isArray(e.mask)?e.mask:[e.mask]).forEach((t=>{this.card.cardLayout.masksClips.getMaskUseIds(t,e,this.zposSection).forEach((t=>{i=V`<g mask="url(#${t})">${i}</g>`}))}))}return e.clip&&(i=V`<g clip-path="url(#${this.card.cardLayout.masksClips.getClipUseId(e.clip,e,this.zposSection)})">${i}</g>`),this.card.cardLayout.groupManager.isItemVisible(e)||(i=V`
        <g
          class="fhs-layout-item--hidden"
          visibility="hidden"
          opacity="0"
          pointer-events="none"
          aria-hidden="true"
        >${i}</g>
      `),i}actionHandler(){return Ca(this.card.actions.getActionHandlerOptions(this.config,this.entity_index))}handleAction(t){this.card.actions.handleAction(t,this.config,this.entity_index)}}const Ia=(t,e,i)=>Math.min(Math.max(t,e),i),Da={enabled:!0,duration:2500,easing:"ease-out",debug:!1};function za(t,e,i,s={}){const a=Number(i.fromValue),r=Number(i.toValue),o=s.onUpdate,n=s.onComplete;if(!1===e.enabled)return o&&o(r),void(n&&n(r));!function(t){t.frame&&cancelAnimationFrame(t.frame),t.frame=void 0,t.startTime=void 0,t.animating=!1}(t),t.fromValue=a,t.toValue=r,t.startTime=void 0,t.animating=!0,e.debug&&console.log("[horseshoe animation] start",{fromValue:t.fromValue,toValue:t.toValue});const l=i=>{t.startTime||(t.startTime=i);const s=Number(e.duration??Da.duration),a=i-t.startTime,r=s<=0?1:Ia(a/s,0,1),h=function(t,e){return"linear"===e?t:"ease-in"===e?t**3:"ease-in-out"===e?t<.5?4*t**3:1-(-2*t+2)**3/2:1-(1-t)**3}(r,e.easing),c=t.fromValue+(t.toValue-t.fromValue)*h;o&&o(c),r<1?t.frame=requestAnimationFrame((t=>l(t))):(t.frame=void 0,t.startTime=void 0,t.animating=!1,n&&n(t.toValue),e.debug&&console.log("[horseshoe animation] end",{value:t.toValue}))};t.frame=requestAnimationFrame((t=>l(t)))}const Ra=Math.PI/180;class Na{constructor(t,e){this.x=t,this.y=e;const i=t.length;this.n=i;const s=new Array(i-1),a=new Array(i-1);for(let r=0;r<i-1;r+=1)s[r]=t[r+1]-t[r],a[r]=(e[r+1]-e[r])/s[r];this.c1s=new Array(i).fill(0),this.c1s[0]=a[0];for(let r=1;r<i-1;r+=1)this.c1s[r]=(a[r-1]+a[r])/2;this.c1s[i-1]=a[i-2];for(let r=0;r<i-1;r+=1)if(0===a[r])this.c1s[r]=0,this.c1s[r+1]=0;else{const t=this.c1s[r]/a[r],e=this.c1s[r+1]/a[r],i=Math.hypot(t,e);if(i>3){const s=3/i;this.c1s[r]=s*t*a[r],this.c1s[r+1]=s*e*a[r]}}this.c2s=new Array(i-1),this.c3s=new Array(i-1);for(let r=0;r<i-1;r+=1){const t=a[r],e=this.c1s[r+1],i=this.c1s[r];this.c2s[r]=(3*t-2*i-e)/s[r],this.c3s[r]=(i+e-2*t)/(s[r]*s[r])}}get(t){if(t<=this.x[0])return this.y[0];if(t>=this.x[this.n-1])return this.y[this.n-1];let e=0;for(let s=0;s<this.n-1;s+=1)if(t>=this.x[s]&&t<=this.x[s+1]){e=s;break}const i=t-this.x[e];return this.y[e]+this.c1s[e]*i+this.c2s[e]*i*i+this.c3s[e]*i*i*i}}class Pa{constructor(t,e){this.x=t,this.y=e,this.n=t.length,this.m=new Array(this.n-1),this.t=new Array(this.n);const i=new Array(this.n-1),s=new Array(this.n-1);for(let a=0;a<this.n-1;a+=1)i[a]=t[a+1]-t[a],s[a]=e[a+1]-e[a],this.m[a]=s[a]/i[a];this.t[0]=.25*this.m[0],this.t[this.n-1]=.25*this.m[this.n-2];for(let a=1;a<this.n-1;a+=1)if(0===this.m[a-1]||0===this.m[a]||this.m[a-1]*this.m[a]<0)this.t[a]=0;else{const t=2*i[a]+i[a-1],e=i[a]+2*i[a-1];this.t[a]=(t+e)/(t/this.m[a-1]+e/this.m[a])}for(let a=0;a<this.n-1;a+=1)if(0===this.m[a])this.t[a]=0,this.t[a+1]=0;else{const t=this.t[a]/this.m[a],e=this.t[a+1]/this.m[a],i=t*t+e*e;if(i>9){const s=3/Math.sqrt(i);this.t[a]=s*t*this.m[a],this.t[a+1]=s*e*this.m[a]}}}get(t){if(t<=this.x[0])return this.y[0];if(t>=this.x[this.n-1])return this.y[this.n-1];let e=0;for(let h=0;h<this.n-1;h+=1)if(t>=this.x[h]&&t<=this.x[h+1]){e=h;break}const i=this.x[e+1]-this.x[e],s=(t-this.x[e])/i,a=s*s,r=a*s,o=r-2*a+s,n=-2*r+3*a,l=r-a;return(2*r-3*a+1)*this.y[e]+o*i*this.t[e]+n*this.y[e+1]+l*i*this.t[e+1]}}class Ga{constructor(t){if(this.type=t.type,this.min=Number(t.min),this.max=Number(t.max),this.points=Ga.buildPoints(t),"splineorg"!==this.type)if("spline"!==this.type){if("linear"!==this.type)throw new Error(`[V2 GaugeScale] Unsupported scale type: ${this.type}`)}else this.spline=new Pa(this.points.map((t=>t.value)),this.points.map((t=>t.position)));else this.splineorg=new Na(this.points.map((t=>t.value)),this.points.map((t=>t.position)))}static buildPoints(t){if("splineorg"!==t.type&&"spline"!==t.type)return[{value:Number(t.min),position:0},{value:Number(t.max),position:1}];if(!t.spline?.anchors)throw new Error("[V2 GaugeScale] Missing horseshoe_scale.spline.anchors");const e=t.spline.anchors.map((t=>({value:Number(t.value),position:Number(t.position)}))).filter((t=>Number.isFinite(t.value)&&Number.isFinite(t.position))).sort(((t,e)=>t.value-e.value));if("spline"===t.type){const i=Number(t.min),s=Number(t.max),a=e.filter((t=>t.value>i&&t.value<s));return[{value:i,position:0},...a,{value:s,position:1}].filter((t=>Number.isFinite(t.value)&&Number.isFinite(t.position))).sort(((t,e)=>t.value-e.value))}return e}toRatio(t){const e=Number(t);return"splineorg"===this.type?Ia(this.splineorg.get(e),0,1):"spline"===this.type?Ia(this.spline.get(e),0,1):Ia((e-this.min)/(this.max-this.min),0,1)}}class Fa{constructor(t,e,i){this.cx=t.svg.xpos,this.cy=t.svg.ypos,this.radius=t.svg.radius,this.tickmarksRadius=t.svg.tickmarks_radius,this.arcDegrees=t.arc_degrees,this.startAngle=t.start_angle,this.endAngle=this.startAngle+this.arcDegrees,this.rotation=Number(t.rotate??0),this.flip=t.flip??"none",this.groupConfig=t.group_config,this.barMode=t.bar_mode,this.absoluteSign=Number(i)<0?-1:1,this.zeroRatio=t.zero_ratio,this.zeroAngle=this.ratioToAngle(this.zeroRatio),this.scale=e}setActiveValue(t){const e=Number(t)<0?-1:1,i="absolute"===this.barMode&&e!==this.absoluteSign;return this.absoluteSign=e,i}getActiveSourceRange(){return"absolute"!==this.barMode?{start:this.scale.min,end:this.scale.max}:{start:0,end:this.absoluteSign<0?this.scale.min<0?this.scale.min:-this.scale.max:this.scale.max}}magnitudeToSourceValue(t){const e=Number(t);return 0===e?0:"absolute"===this.barMode?e*this.absoluteSign:e}getActiveMagnitudeMax(){const t=this.getActiveSourceRange();return Math.abs(t.end)}getActiveColorStops(t){if("absolute"!==this.barMode)return t;const e=this.getActiveSourceRange(),i=Math.min(e.start,e.end),s=Math.max(e.start,e.end);return t.filter((t=>Number(t.value)>=i&&Number(t.value)<=s)).sort(((t,e)=>this.valueToRatio(t.value)-this.valueToRatio(e.value)))}getTransformContext(){return{rotation:this.rotation,flipX:"x"===this.flip||"both"===this.flip,flipY:"y"===this.flip||"both"===this.flip}}getRotateTransform(){return this.rotation?`rotate(${this.rotation} ${this.cx} ${this.cy})`:""}getScaleTransform(){const t=this.getTransformContext();if(!t.flipX&&!t.flipY)return"";const e=t.flipX?-1:1,i=t.flipY?-1:1;return`translate(${this.cx} ${this.cy}) scale(${e} ${i}) translate(${-this.cx} ${-this.cy})`}getGroupRotateTransform(){const t=Number(this.groupConfig?.rotate??this.groupConfig?.rotation??0);return t?`rotate(${t} ${this.groupConfig.svg.xpos} ${this.groupConfig.svg.ypos})`:""}getGroupScaleTransform(){if(!this.groupConfig?.scale)return"";const t=this.groupConfig.scale.x??this.groupConfig.scale,e=this.groupConfig.scale.y??this.groupConfig.scale;return`translate(${this.groupConfig.svg.xpos} ${this.groupConfig.svg.ypos}) scale(${t} ${e}) translate(${-this.groupConfig.svg.xpos} ${-this.groupConfig.svg.ypos})`}getGroupTransform(){return[this.getGroupRotateTransform(),this.getGroupScaleTransform(),this.getRotateTransform(),this.getScaleTransform()].filter(Boolean).join(" ")}getInverseGroupTransform(){const t=this.getTransformContext(),e=[];if(t.flipX||t.flipY){const i=t.flipX?-1:1,s=t.flipY?-1:1;e.push(`translate(${this.cx} ${this.cy})`),e.push(`scale(${i} ${s})`),e.push(`translate(${-this.cx} ${-this.cy})`)}return this.rotation&&e.push(`rotate(${-this.rotation} ${this.cx} ${this.cy})`),e.join(" ")}ratioToAngle(t){return this.startAngle+t*this.arcDegrees}scaleValueToRatio(t){return this.scale.toRatio(t)}scaleValueToAngle(t){return this.ratioToAngle(this.scaleValueToRatio(t))}valueToRatio(t){const e=Number(t),i="bidirectional"===this.barMode||"bidirectional_symmetrical"===this.barMode;if("absolute"===this.barMode){const t=this.scaleValueToRatio(0),i=this.scaleValueToRatio(0===this.scale.min?Math.abs(e):e);if(0===this.scale.min){const e=this.scaleValueToRatio(this.scale.max);return Ia((i-t)/(e-t),0,1)}if(e<0){const e=this.scaleValueToRatio(this.scale.min);return Ia((t-i)/(t-e),0,1)}const s=this.scaleValueToRatio(this.scale.max);return Ia((i-t)/(s-t),0,1)}if(!i)return this.scaleValueToRatio(e);if(this.scale.min>=0)return.5+.5*this.scaleValueToRatio(e);if(this.scale.max<=0)return.5*this.scaleValueToRatio(e);const s=this.scaleValueToRatio(0);if(e<0){const t=this.scaleValueToRatio(e);return.5*Ia(s>0?t/s:0,0,1)}const a=this.scaleValueToRatio(e),r=1-s;return.5+.5*Ia(r>0?(a-s)/r:0,0,1)}valueToAngle(t){return this.ratioToAngle(this.valueToRatio(t))}pointAt(t,e){const i=t*Ra;return{x:this.cx+Math.cos(i)*e,y:this.cy+Math.sin(i)*e}}}class Ba{static applyEllipsis(t,e){const i=Number(e);return!Number.isFinite(i)||i<=0||t.length<=i?t:1===i?"…":`${t.slice(0,i-1)}…`}static renderLabel(t){return"horizontal"===(t.orientation??"arc")?Ba.renderHorizontalLabel(t):Ba.renderArcLabel(t)}static renderHorizontalLabel(t){const e=Ba.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:t.angle}),i=t.transformContext??{},s=i.rotation??0,a=i.flipX??!1?-1:1,r=i.flipY??!1?-1:1,o=Ba.applyEllipsis(String(t.label??""),t.ellipsis),n={"dominant-baseline":"central",fill:"var(--primary-text-color)",...t.styles??{}};return V`
      <text
        x="${e.x}"
        y="${e.y}"
        text-anchor="middle"
        style=${gt(t.applyColorFilter?t.applyColorFilter(n):n)}
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
    `}static renderArcLabel(t){const e=Ba.applyEllipsis(String(t.label??""),t.ellipsis),i={fill:"currentColor",...t.styles??{}},s=Number(t.arcSize??24),a=Ba.getLabelGeometry({angle:t.angle,transformContext:t.transformContext}).visualAngle,r=a>=180&&a<=360,o=a-s/2,n=a+s/2,l=r?o:n,h=r?n:o,c=r?1:0,d=Ba.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:l}),u=Ba.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:h}),p=`${t.cardId}-horseshoe-label-${t.horseshoeIndex}-${t.index}`,g=t.inverseTransform??"";return V`
      <g transform="${g}">
        <path
          id="${p}"
          d="M ${d.x} ${d.y} A ${t.radius} ${t.radius} 0 0 ${c} ${u.x} ${u.y}"
          fill="none"
          stroke="none"
        />

        <text
          class="horseshoe-label"
          style=${gt(t.applyColorFilter?t.applyColorFilter(i):i)}
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
    `}static renderLabelBadge(t){return"horizontal"===(t.orientation??"arc")?Ba.renderHorizontalBadge(t):Ba.renderArcBadge(t)}static renderArcSegment(t){const e=Ba.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:t.startAngle}),i=Ba.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:t.endAngle}),s=Math.abs(t.endAngle-t.startAngle)>180?1:0,a=t.endAngle>t.startAngle?1:0;return V`
      <path
        class="${t.className??""}"
        d="M ${e.x} ${e.y} A ${t.radius} ${t.radius} 0 ${s} ${a} ${i.x} ${i.y}"
        fill="none"
        stroke="${t.color??"currentColor"}"
        stroke-width="${t.width}"
        stroke-linecap="${t.lineCap??"round"}"
      />
    `}static renderArcBadge(t){const e=String(t.label??""),i=t.badge??{},s=Number(i.padding??2),a=Number(i.char_width??4),r=Number(i.width??e.length*a+2*s),o=Number(i.height??8),n=Math.max(0,r-o),l=Ba.arcLengthToDegrees(n,t.radius),h=Ba.buildArcCapsulePath({cx:t.cx,cy:t.cy,radius:t.radius,angle:t.angle,arcSize:l,width:o});return V`
      <path
        class="horseshoe-label-badge"
        d="${h}"
        fill="${i.color??"var(--card-background-color)"}"
        stroke="${i.border_color??"none"}"
      />
    `}static renderHorizontalBadge(t){const e=t.badge??{},i=Ba.pointAt({cx:t.cx,cy:t.cy,radius:t.radius,angle:t.angle}),s=String(t.label??""),a=Number(e.padding??4),r=Number(e.radius??Math.max(7,3*s.length+a));return V`
      <circle
        class="horseshoe-label-badge"
        cx="${i.x}"
        cy="${i.y}"
        r="${r}"
        fill="${e.color??"var(--card-background-color)"}"
        stroke="${e.border_color??"none"}"
      />
    `}static pointAt(t){const e=Ba.degToRad(t.angle);return{x:t.cx+Math.cos(e)*t.radius,y:t.cy+Math.sin(e)*t.radius}}static normalizeAngle(t){return(t%360+360)%360}static degToRad(t){return t*Math.PI/180}static radToDeg(t){return 180*t/Math.PI}static arcLengthToDegrees(t,e){return Number(t)/(2*Math.PI*e)*360}static getLabelGeometry(t){const e=t.angle??0,i=t.transformContext??{},s=i.rotation??0,a=i.flipX??!1,r=i.flipY??!1;return{positionAngle:e,visualAngle:Ba.getVisualAngleFromParentTransform({angle:e,rotation:s,flipX:a,flipY:r}),mirrored:a!==r}}static getVisualAngleFromParentTransform(t){const e=t.angle??0,i=t.rotation??0,s=t.flipX??!1?-1:1,a=t.flipY??!1?-1:1,r=Ba.degToRad(e),o=Ba.degToRad(i),n=Math.cos(r),l=Math.sin(r),h=(n*Math.cos(o)-l*Math.sin(o))*s,c=(n*Math.sin(o)+l*Math.cos(o))*a;return Ba.normalizeAngle(Ba.radToDeg(Math.atan2(c,h)))}static buildArcCapsulePath(t){const e=t.width/2,i=t.radius+e,s=t.radius-e,a=t.angle-t.arcSize/2,r=t.angle+t.arcSize/2,o=Ba.pointAt({cx:t.cx,cy:t.cy,radius:i,angle:a}),n=Ba.pointAt({cx:t.cx,cy:t.cy,radius:i,angle:r}),l=Ba.pointAt({cx:t.cx,cy:t.cy,radius:s,angle:r}),h=Ba.pointAt({cx:t.cx,cy:t.cy,radius:s,angle:a}),c=t.arcSize>180?1:0;return`\n      M ${o.x} ${o.y}\n      A ${i} ${i} 0 ${c} 1 ${n.x} ${n.y}\n      A ${e} ${e} 0 0 1 ${l.x} ${l.y}\n      A ${s} ${s} 0 ${c} 0 ${h.x} ${h.y}\n      A ${e} ${e} 0 0 1 ${o.x} ${o.y}\n      Z\n    `}}function Oa(t,e,i){return`horseshoe-state-${t}-${e}-${i}`}function Ha(t,e,i={}){if(!e.length)return V``;const{layerClass:s,itemClass:a,styles:r={},applyColorFilter:o=(t=>t),gradientPrefix:n}=i,{filter:l,opacity:h,...c}=r;return V`
    <g class=${s} style=${gt({filter:l,opacity:h})}>
      <defs>
        ${e.map((t=>{if(!t.arc.gradient)return V``;const e=`${n}-${t.key}`,i=o({fill:t.arc.gradient.startColor},t),s=o({fill:t.arc.gradient.endColor},t);return V`
            <linearGradient
              id=${e}
              gradientUnits="userSpaceOnUse"
              x1=${t.arc.gradient.x1}
              y1=${t.arc.gradient.y1}
              x2=${t.arc.gradient.x2}
              y2=${t.arc.gradient.y2}
            >
              <stop offset="0%" stop-color=${i.fill}></stop>
              <stop offset="100%" stop-color=${s.fill}></stop>
            </linearGradient>
          `}))}
      </defs>
      ${e.map((t=>{const e=`${n}-${t.key}`,i={"stroke-width":0,...c,fill:t.arc.gradient?`url('#${e}')`:t.color??c.fill??c.stroke??"currentColor"};return t.path?V`
              <path
                class=${a}
                d=${t.path}
                style=${gt(o(i,t))}
              ></path>
            `:V``}))}
    </g>
  `}function Va(t,e,i,s,a){if(!a?.key)return;if(t.has(a.key)){const e=t.get(a.key);if(e?.isConnected)return e;t.delete(a.key)}const r=e?.renderRoot??e?.shadowRoot;if(!r)return;const o=Oa(i,s,a.key),n=r.getElementById?.(o)??r.querySelector?.(`[data-horseshoe-state-path="${o}"]`);return n&&t.set(a.key,n),n}const La=t=>Array.isArray(t)?t:[];function ja(t,e){const i=La(t.colorstops?.colors),s=e.getActiveSourceRange(),a=e.getActiveColorStops(i);return[{value:s.start,color:la.calculateStrokeColor(s.start,t.colorstops,!1)},...a,{value:s.end,color:la.calculateStrokeColor(s.end,t.colorstops,!1)}].sort(((t,i)=>e.valueToRatio(t.value)-e.valueToRatio(i.value))).filter(((t,e,i)=>i.findIndex((e=>Number(e.value)===Number(t.value)))===e))}class qa{static buildBandPath(t={}){const{geometry:e,arc:i={},band:s={}}=t;if(!e||!1===i.visible)return"";const a={startAngle:0,endAngle:0,startCap:"butt",endCap:"butt",...i},r={radius:e.radius,width:1,...s},o=Number(a.startAngle),n=Number(a.endAngle),l=Number(r.radius),h=Number(r.width);if(!(Number.isFinite(o)&&Number.isFinite(n)&&Number.isFinite(l)&&Number.isFinite(h)))return"";if(n===o||h<=0)return"";const c=l-h/2,d=l+h/2;if(c<=0||d<=0)return"";const u=e.pointAt(o,d),p=e.pointAt(n,d),g=e.pointAt(n,c),m=e.pointAt(o,c),f=Math.abs(n-o)>180?1:0,y=n>o?1:0,v=y?0:1,b=h/2,_=[];return _.push(`M ${u.x} ${u.y}`),_.push(`A ${d} ${d} 0 ${f} ${y} ${p.x} ${p.y}`),"round"===a.endCap?_.push(`A ${b} ${b} 0 0 ${y} ${g.x} ${g.y}`):_.push(`L ${g.x} ${g.y}`),_.push(`A ${c} ${c} 0 ${f} ${v} ${m.x} ${m.y}`),"round"===a.startCap?_.push(`A ${b} ${b} 0 0 ${y} ${u.x} ${u.y}`):_.push(`L ${u.x} ${u.y}`),_.push("Z"),_.join(" ")}}function Ua(t,e){const i=t.show?.scale_style??"fixed";return"none"===i?[]:"colorstopsegments"===i?function(t,e){const i=La(t.colorstops?.colors),s=Number(t.colorstops?.gap??0),a=[];if(!i.length)return[{key:"scale",startAngle:e.startAngle,endAngle:e.endAngle,startCap:t.horseshoe_scale.linecap.start,endCap:t.horseshoe_scale.linecap.end,color:t.horseshoe_scale.color}];const r=ja(t,e);for(let n=0;n<r.length-1;n+=1){const t=r[n],i=r[n+1],o=e.valueToAngle(t.value),l=e.valueToAngle(i.value),h=0===n?o:o+s/2,c=n===r.length-2?l:l-s/2,d=c>h;a.push({key:`scale-colorstop-${n}`,startAngle:d?h:0,endAngle:d?c:0,startCap:"butt",endCap:"butt",color:t.color,value:t.value,visible:d})}const o=a.filter((t=>!1!==t.visible));return o.length&&(o[0].startCap=t.horseshoe_scale.linecap.start,o[o.length-1].endCap=t.horseshoe_scale.linecap.end),a}(t,e):[{key:"scale",startAngle:e.startAngle,endAngle:e.endAngle,startCap:t.horseshoe_scale.linecap.start,endCap:t.horseshoe_scale.linecap.end,color:t.horseshoe_scale.color}]}function Wa(t,e,i={}){const{mode:s="none",config:a={},radius:r=e.radius,width:o=6,gap:n=0,keyPrefix:l="background"}=i;if("none"===s)return[];if("lineargradient"===s||"colorstopgradient"===s){const i=a.linecap??"round";return Xa(t,e,{mode:s,radius:r,width:o,startCap:i,endCap:i,keyPrefix:l})}if("colorstopsegments"===s){if(!La(t.colorstops?.colors).length)return[];const i=[],s=ja(t,e);for(let t=0;t<s.length-1;t+=1){const h=s[t],c=s[t+1],d=e.valueToAngle(h.value),u=e.valueToAngle(c.value),p=0===t,g=t===s.length-2,m=p?d:d+n/2,f=g?u:u-n/2;if(f>m){const s=a.linecap??"round",n={key:`${l}-colorstop-${t}`,startAngle:m,endAngle:f,startCap:p?s:"butt",endCap:g?s:"butt"};i.push({key:n.key,arc:n,path:qa.buildBandPath({geometry:e,arc:n,band:{radius:r,width:o}}),startAngle:m,endAngle:f,radius:r,width:o,color:h.color,lineCap:s})}}return i}if("fixed"===s){const t=a.linecap??"round",i={key:`${l}-fixed`,startAngle:e.startAngle,endAngle:e.endAngle,startCap:t,endCap:t};return[{key:i.key,arc:i,path:qa.buildBandPath({geometry:e,arc:i,band:{radius:r,width:o}}),startAngle:e.startAngle,endAngle:e.endAngle,radius:r,width:o,color:a.color,lineCap:t}]}return[]}const Ya=6;function Xa(t,e,i={}){if("absolute"===t.bar_mode)return function(t,e,i={}){const{mode:s="colorstopgradient",radius:a=e.radius,width:r=t.horseshoe_state.width,startCap:o=t.horseshoe_state.linecap.start,endCap:n=t.horseshoe_state.linecap.end,keyPrefix:l=s}=i,h=ja(t,e),c="lineargradient"===s?h.map(((t,e)=>({value:e/(h.length-1),sourceValue:t.value,color:t.color}))):h.map((t=>({value:t.value,sourceValue:t.value,color:t.color}))),d="lineargradient"===s?t=>e.startAngle+Number(t)*e.arcDegrees:t=>e.valueToAngle(t),u={colors:c.map((t=>({value:t.value,color:t.color}))).sort(((t,e)=>t.value-e.value))},p=[];for(let g=0;g<c.length-1;g+=1){const t=c[g],e=c[g+1],i=[{startValue:t.value,endValue:e.value}];for(;i.length;){const t=i.pop(),e=d(t.startValue),s=d(t.endValue);if(a*Math.abs(s-e)*Math.PI/180>Ya){const e=(t.startValue+t.endValue)/2;i.push({startValue:e,endValue:t.endValue}),i.push({startValue:t.startValue,endValue:e})}else p.push({startValue:t.startValue,endValue:t.endValue,startAngle:e,endAngle:s})}}return p.map(((t,i)=>{const s=i===p.length-1,h=.5*Math.abs(t.endAngle-t.startAngle),c=e.pointAt(t.startAngle,a),d=e.pointAt(t.endAngle,a),g={key:`${l}-${i}`,startAngle:t.startAngle,endAngle:s?t.endAngle:t.endAngle+h,startCap:0===i?o:"butt",endCap:s?n:"butt",startValue:t.startValue,endValue:t.endValue,gradient:{x1:c.x,y1:c.y,x2:d.x,y2:d.y,startColor:la.calculateStrokeColor(t.startValue,u,!0),endColor:la.calculateStrokeColor(t.endValue,u,!0)}};return{key:g.key,arc:g,path:qa.buildBandPath({geometry:e,arc:g,band:{radius:a,width:r}})}}))}(t,e,i);const{mode:s="colorstopgradient",radius:a=e.radius,width:r=t.horseshoe_state.width,startCap:o=t.horseshoe_state.linecap.start,endCap:n=t.horseshoe_state.linecap.end,keyPrefix:l=s}=i,h=Number(t.horseshoe_scale.min),c=Number(t.horseshoe_scale.max),d="lineargradient"===s?0:h,u="lineargradient"===s?1:c,p="lineargradient"===s?t=>e.startAngle+t*e.arcDegrees:t=>e.valueToAngle(t),g=La(t.colorstops.colors),m="lineargradient"===s?{colors:g.map(((t,e)=>({value:e/(g.length-1),color:t.color})))}:t.colorstops,f=m.colors,y=[d,u,...f.map((t=>Number(t.value)))],v=[...new Set(y)].filter((t=>t>=d&&t<=u)).sort(((t,e)=>t-e)),b=[];for(let _=0;_<v.length-1;_+=1){const t=[{startValue:v[_],endValue:v[_+1]}];for(;t.length;){const e=t.pop(),i=p(e.startValue),s=p(e.endValue);if(a*Math.abs(s-i)*Math.PI/180>Ya){const i=(e.startValue+e.endValue)/2;t.push({startValue:i,endValue:e.endValue}),t.push({startValue:e.startValue,endValue:i})}else b.push({startValue:e.startValue,endValue:e.endValue,startAngle:i,endAngle:s})}}return b.map(((t,i)=>{const s=i===b.length-1,h=t.endAngle>=t.startAngle?1:-1,c=.5*Math.abs(t.endAngle-t.startAngle),d=e.pointAt(t.startAngle,a),u=e.pointAt(t.endAngle,a),p={key:`${l}-${i}`,startAngle:t.startAngle,endAngle:s?t.endAngle:t.endAngle+h*c,startCap:0===i?o:"butt",endCap:s?n:"butt",startValue:t.startValue,endValue:t.endValue,gradient:{x1:d.x,y1:d.y,x2:u.x,y2:u.y,startColor:la.calculateStrokeColor(t.startValue,m,!0),endColor:la.calculateStrokeColor(t.endValue,m,!0)}};return{key:p.key,arc:p,path:qa.buildBandPath({geometry:e,arc:p,band:{radius:a,width:r}})}}))}function Ja(t,e,i,s){const a=t.show?.horseshoe_style,r=Number(s.fromAngle??e.startAngle),o=Number(s.toAngle??e.startAngle);if("colorstopsegments"===a)return function(t,e,i,s){const a=La(t.colorstops?.colors),r=Number(t.colorstops?.gap??0),o=[];if(a.length<2)return[{key:"state-value",startAngle:i,endAngle:s,startCap:t.horseshoe_state.linecap.start,endCap:t.horseshoe_state.linecap.end}];const n=ja(t,e);for(let h=0;h<n.length-1;h+=1){const t=n[h],a=n[h+1],l=e.valueToAngle(t.value),c=e.valueToAngle(a.value),d=Math.max(l,i),u=Math.min(c,s),p=d===i?d:d+r/2,g=u===s?u:u-r/2,m=g>p;o.push({key:`colorstop-${h}`,startAngle:m?p:0,endAngle:m?g:0,startCap:"butt",endCap:"butt",color:t.color,value:t.value,label:t.label,visible:m})}const l=o.filter((t=>!1!==t.visible));return l.length&&(l[0].startCap=t.horseshoe_state.linecap.start,l[l.length-1].endCap=t.horseshoe_state.linecap.end),o}(t,e,r,o);if("autominmax"===a){const s="bidirectional"===t.bar_mode||"bidirectional_symmetrical"===t.bar_mode||"bidirectional_linear"===t.bar_mode,a="absolute"===t.bar_mode;let n=la.calculateStrokeColor(i,t.colorstopsMinMax,!0);if(s){const e=Number(i),s=Number(t.horseshoe_scale.min),a=Number(t.horseshoe_scale.max),r=t.colorstops.colors,o=r[0].color,l=r[r.length-1].color,h=la.calculateStrokeColor(0,t.colorstops,!0);n=e<0?la.getGradientValue(o,h,(e-s)/(0-s)):la.getGradientValue(h,l,e/a)}if(a){const s=Number(i),a=e.getActiveSourceRange(),r=la.calculateStrokeColor(0,t.colorstops,!0),o=la.calculateStrokeColor(a.end,t.colorstops,!0);n=la.getGradientValue(r,o,e.valueToRatio(s))}return[{key:"state-value",startAngle:r,endAngle:o,startCap:t.horseshoe_state.linecap.start,endCap:t.horseshoe_state.linecap.end,color:n}]}if("minmaxgradient"===a||"lineargradient"===a){const s=t.colorstops.colors;let n=s[0].color,l=s[s.length-1].color;const h="bidirectional"===t.bar_mode||"bidirectional_symmetrical"===t.bar_mode||"bidirectional_linear"===t.bar_mode,c="absolute"===t.bar_mode;let d=s.map((t=>t.color));if(h||c){const e=la.calculateStrokeColor(0,t.colorstops,!0);if(Number(i)<0){const t=s.filter((t=>Number(t.value)<0)).map((t=>t.color));c?(n=e,l=t[0],d=[e,...t.reverse()]):(l=e,d=[...t,e])}else n=e,d=[e,...s.filter((t=>Number(t.value)>0)).map((t=>t.color))]}const u={colors:d.map(((t,e)=>({value:e/(d.length-1),color:t})))},p=o>=r?1:-1,g=Math.abs(o-r),m=e.radius*g*Math.PI/180,f=Math.ceil(m/Ya),y=e.radius*Math.abs(e.arcDegrees)*Math.PI/180,v=Math.ceil(y/Ya),b=[];for(let i=0;i<v;i+=1){const s=i<f,o=s?i/f:0,h=s?(i+1)/f:0,c=r+p*g*o,d=r+p*g*h,m=e.pointAt(c,e.radius),y=e.pointAt(d,e.radius),v=i===f-1,_=.5*Math.abs(d-c);b.push({key:`${a}-${i}`,startAngle:c,endAngle:s&&!v?d+p*_:d,startCap:0===i?t.horseshoe_state.linecap.start:"butt",endCap:v?t.horseshoe_state.linecap.end:"butt",visible:s,gradient:{x1:m.x,y1:m.y,x2:y.x,y2:y.y,startColor:"lineargradient"===a?la.calculateStrokeColor(o,u,!0):0===o?n:la.getGradientValue(n,l,o),endColor:"lineargradient"===a?la.calculateStrokeColor(h,u,!0):0===h?n:1===h?l:la.getGradientValue(n,l,h)}})}return b}return"colorstop"===a||"colorstopinterpolated"===a?[{key:"state-value",startAngle:r,endAngle:o,startCap:t.horseshoe_state.linecap.start,endCap:t.horseshoe_state.linecap.end,color:la.calculateStrokeColor(i,t.colorstops,"colorstopinterpolated"===a)}]:"colorstopgradient"===a?[{key:"colorstopgradient-clip",startAngle:r,endAngle:o,startCap:t.horseshoe_state.linecap.start,endCap:t.horseshoe_state.linecap.end}]:[{key:"state-value",startAngle:r,endAngle:o,startCap:t.horseshoe_state.linecap.start,endCap:t.horseshoe_state.linecap.end}]}function Za(t,e){return e<0?"after":t<e?"before":t>e?"after":"current"}function Ka(t){const e=t.horseshoe_state?.mode;return"stringstate_mode"===e||"stringstate_level"===e?t.horseshoe_labels?.[e]:void 0}function Qa(t,e){return La(Ka(t)?.state_map?.map).find((t=>String(t.state)===String(e)))}function tr(t,e){return da.toStyleDict(Ka(t)?.[e]?.styles)}function er(t,e){return da.toStyleDict(t?.[e]?.styles)}function ir(t,e,i){return"segment"===t.horseshoe_state.mode||"stringstate_mode"===t.horseshoe_state.mode||"stringstate_level"===t.horseshoe_state.mode?function(t,e,i){const s=t.state_map.map,a=t.horseshoe_state.segment_gap,r=s.length;if(!r)return[];const o=s.findIndex((t=>Number(t.value)===Number(i))),n=e.arcDegrees/r;return s.map(((i,s)=>{const l=Za(s,o),h="current"===l,c="stringstate_level"===t.horseshoe_state.mode?"before"===l||"current"===l:h;Number(i.value);let d=e.startAngle+s*n+a/2,u=e.startAngle+(s+1)*n-a/2,p=i.color??la.calculateStrokeColor(i.value,t.colorstops,"colorstopinterpolated"===t.show?.horseshoe_style);return{key:`mapped-state-${s}`,startAngle:d,endAngle:u,startCap:0===s?t.horseshoe_state.linecap.start:"butt",endCap:s===r-1?t.horseshoe_state.linecap.end:"butt",active:c,relation:l,value:i.value,startValue:void 0,endValue:void 0,color:p,label:i.display_label??i.label??String(i.state??i.value)}}))}(t,e,i):"bidirectional"===t.bar_mode||"bidirectional_symmetrical"===t.bar_mode||"bidirectional_linear"===t.bar_mode?function(t,e,i){const s=e.valueToAngle(i),a=e.zeroAngle;return Ja(t,e,i,{fromAngle:Math.min(a,s),toAngle:Math.max(a,s)})}(t,e,i):function(t,e,i){return Ja(t,e,i,{fromAngle:e.startAngle,toAngle:e.valueToAngle(i)})}(t,e,i)}function sr(t,e,i){const s=ir(t,e,i),a={radius:e.radius,width:t.horseshoe_state.width};return s.map(((t,i)=>({key:t.key??`state-arc-${i}`,arc:t,path:qa.buildBandPath({geometry:e,arc:t,band:a})})))}function ar(t,e,i,s){const a=[s];for(let r=s-i;r>=t-1e-9;r-=i)a.push(Number(r.toFixed(10)));for(let r=s+i;r<=e+1e-9;r+=i)a.push(Number(r.toFixed(10)));return a.sort(((t,e)=>t-e))}function rr(t,e){const i=t.show.labels_at??"none";if("absolute"===t.bar_mode&&"segment"!==i&&"stringstate"!==i)return function(t,e){const i=t.show.labels_at??"none",s=e.getActiveMagnitudeMax(),a=e.getActiveColorStops(La(t.colorstops?.colors)),r=(t,i,s={})=>({value:e.magnitudeToSourceValue(t),text:String(t),role:i,magnitude:t,...s});let o=[];if("minmax"!==i&&"minmax0"!==i||(o=[r(0,"min"),r(s,"max")]),"colorstop"!==i&&"colorstops"!==i&&"both"!==i||(o=[r(0,"min"),...a.map((t=>({value:Number(t.value),text:t.label??String(Math.abs(Number(t.value))),role:"colorstop",magnitude:Math.abs(Number(t.value)),color:t.color}))),r(s,"max")]),"ticks_major"===i||"both"===i){const e=Number(t.horseshoe_tickmarks?.ticks_major?.ticksize);if(Number.isFinite(e)&&e>0){const t=ar(0,s,e,0).map(((t,e,i)=>r(t,0===e?"min":e===i.length-1?"max":"tick-major")));o="both"===i?[...o,...t]:t}}const n=o.sort(((t,e)=>t.magnitude-e.magnitude)).filter(((t,e,i)=>i.findIndex((e=>e.magnitude===t.magnitude))===e)),l=Number(t.horseshoe_labels.distance_min??0),h=[];return n.forEach((t=>{const e=h[h.length-1];(!e||l<=0||t.magnitude-e.magnitude>=l)&&h.push(t)})),h.length&&(h[0].role="min",h[h.length-1].role="max"),h}(t,e);const s=Number(t.horseshoe_scale.min),a=Number(t.horseshoe_scale.max),r=La(t.colorstops?.colors);let o=[];if("minmax"===i&&(o=[{value:s,text:String(s),role:"min"},{value:a,text:String(a),role:"max"}]),"minmax0"===i&&(o=[{value:s,text:String(s),role:"min"},{value:0,text:"0",role:"zero"},{value:a,text:String(a),role:"max"}]),"colorstop"!==i&&"colorstops"!==i||(o=[{value:s,text:String(s),role:"min"},...r.map((t=>({value:t.value,text:t.label??String(t.value),role:"colorstop",color:t.color}))),{value:a,text:String(a),role:"max"}]),"ticks_major"===i){const e=Number(t.horseshoe_tickmarks?.ticks_major?.ticksize),i="bidirectional"===t.bar_mode||"bidirectional_symmetrical"===t.bar_mode||"bidirectional_linear"===t.bar_mode?0:s;Number.isFinite(e)&&e>0&&(o=ar(s,a,e,i).map(((t,e,i)=>({value:t,text:String(t),role:0===e?"min":e===i.length-1?"max":"tick-major"}))))}if("both"===i){const e=r.length?[{value:s,text:String(s),role:"min"},...r.map((t=>({value:t.value,text:t.label??String(t.value),role:"colorstop",color:t.color}))),{value:a,text:String(a),role:"max"}]:[],i=Number(t.horseshoe_tickmarks?.ticks_major?.ticksize),n="bidirectional"===t.bar_mode||"bidirectional_symmetrical"===t.bar_mode||"bidirectional_linear"===t.bar_mode?0:s;o=[...e,...Number.isFinite(i)&&i>0?ar(s,a,i,n).map((t=>({value:t,text:String(t),role:"tick-major"}))):[]]}if("segment"===i||"stringstate"===i){const e=La(t.state_map?.map),i=e.findIndex((e=>Number(e.value)===Number(t.mapped_state?.value)));o="stringstate_mode"===t.horseshoe_state?.mode||"stringstate_level"===t.horseshoe_state?.mode?e.map(((e,s)=>{const a=Za(s,i),r=Qa(t,e.state);Number(e.value);const o=s+.5,n=s,l=s+1,h=tr(t,a),c=da.toStyleDict(r?.styles),d=er(r,a),u={...h,...c,...d};return(t.debug_labels||t.dev?.debug_labels)&&console.log("[horseshoe-labels] string-state label style",{state:e.state,relation:a,roleStyles:h,stateRoleStyles:d,stateStyles:c,styles:u}),{value:o,startValue:n,endValue:l,text:r?.label??e.display_label??String(e.state??e.value),role:"segment",relation:a,styles:u}})):e.map(((e,s)=>{const a=Qa(t,e.state),r=Za(s,i);return{value:e.value,text:a?.label??e.display_label??String(e.state??e.value),role:"segment",relation:r,styles:{...tr(t,r),...da.toStyleDict(a?.styles),...er(a,r)}}}))}const n="bidirectional"===t.bar_mode||"bidirectional_symmetrical"===t.bar_mode||"bidirectional_linear"===t.bar_mode,l=o.filter((t=>{const e=Number(t.value),i=e>=s&&e<=a;return Number.isFinite(e)&&(i||n&&0===e)})).sort(((t,e)=>Number(t.value)-Number(e.value))).filter(((t,e,i)=>{const s=Number(t.value);return i.findIndex((t=>Number(t.value)===s))===e})),h=Number(t.horseshoe_labels.distance_min??0),c=[];return l.forEach((t=>{const e=Number(t.value);if(h<=0)return void c.push(t);const i=c[c.length-1];(!i||Math.abs(e-Number(i.value))>=h)&&c.push(t)})),c.length&&(c[0].role="min",c[c.length-1].role="max"),c}function or(t,e){return rr(t,e).map((i=>function(t,e,i={}){const s=Number(i.value),a=void 0!==i.angle?Number(i.angle):e.valueToAngle(s),r=void 0!==i.startValue?e.valueToAngle(Number(i.startValue)):void 0,o=void 0!==i.endValue?e.valueToAngle(Number(i.endValue)):void 0,n=void 0!==r&&void 0!==o?Math.max(1,Math.abs(o-r)):void 0,l=e.radius+Number(t.horseshoe_labels.offset??t.horseshoe_state.width+2),h=e.pointAt(a,l);return{...i,value:s,text:i.text??String(s),role:i.role??"label",angle:a,arcSize:n,radius:l,x:h.x,y:h.y}}(t,e,i)))}const nr={enabled:!0,duration:2500,easing:"ease-out",debug:!1};function lr(t){return"string"==typeof t?{start:t,end:t}:t&&"object"==typeof t?{start:t.start??"butt",end:t.end??"butt"}:{start:"butt",end:"butt"}}const hr=["before","current","after"];function cr(t){if(!t)return t;const e={...t};return hr.forEach((t=>{e[t]&&(e[t]={...e[t],styles:da.toStyleDict(e[t].styles)})})),e.state_map&&(e.state_map={...e.state_map,map:(e.state_map.map??[]).map((t=>{const e={...t,styles:da.toStyleDict(t.styles)};return hr.forEach((t=>{e[t]&&(e[t]={...e[t],styles:da.toStyleDict(e[t].styles)})})),e}))}),e}function dr(t){const e=Number(t.min),i=Number(t.max);return e>=0||i<=0?0:Ia((0-e)/(i-e),0,1)}function ur(t,e,i){let s=e.state;i?.attribute&&void 0!==e.attributes?.[i.attribute]&&(s=e.attributes[i.attribute]);const a=t.colorstops.colors.filter((t=>void 0!==t.state));if(a.length){const i=a.some((t=>void 0!==t.rank))?[...a].sort(((t,e)=>Number(t.rank)-Number(e.rank))):a,r={map:i.map(((t,e)=>({...t,value:e})))},o=r.map.find((t=>String(t.state)===String(s))),n={...t.colorstops,colors:i.map(((t,e)=>({...t,value:e})))};return{config:{...t,colorstops:n,state_map:r,mapped_state:o},rawState:e.state,mappedState:o,value:Number(o.value)}}if("rank_state"===t.state_map?.type){const i=t.colorstops,a=Number(s);let r=i.colors[i.colors.length-1];if(a<=Number(i.colors[0].value))r=i.colors[0];else if(a>=Number(i.colors[i.colors.length-1].value))r=i.colors[i.colors.length-1];else for(let t=0;t<i.colors.length-1;t+=1){const e=i.colors[t],s=i.colors[t+1];if(a>=Number(e.value)&&a<Number(s.value)){r=e;break}}const o=new Map;i.colors.forEach((t=>{const e=String(t.rank);o.has(e)||o.set(e,t.color)}));const n={...t.state_map,map:t.state_map.map.map(((t,e)=>({...t,value:e+.5,color:t.color??o.get(String(t.rank))})))},l=n.map.findIndex((t=>String(t.rank)===String(r.rank))),h={...n.map[l],color:r.color,source_value:s,source_color_stop:r},c={...i,colors:n.map.map(((t,e)=>({value:e,color:t.color,rank:t.rank,state:t.state})))},d={...t.horseshoe_scale,min:0,max:n.map.length},u=c.colors[0],p=c.colors[c.colors.length-1];return{config:{...t,sourceColorStops:i,colorstops:c,colorstopsMinMax:xa.normalize({[d.min]:u.color,[d.max]:p.color}),horseshoe_scale:d,state_map:n,mapped_state:h},rawState:e.state,mappedState:h,value:Number(h.value)}}const r=t.state_map?function(t,e,i){return t.find((t=>void 0!==t.state?String(t.state)===String(e):void 0!==t.value&&String(t.value)===String(i)))}(t.state_map.map,e.state,s):void 0,o=Number(r?.value??s);return{config:{...t,mapped_state:r},rawState:e.state,mappedState:r,value:o}}var pr,gr,mr,fr,yr;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.quote_decimal="quote_decimal",t.space_comma="space_comma",t.none="none"}(pr||(pr={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(gr||(gr={})),function(t){t.local="local",t.server="server"}(mr||(mr={})),function(t){t.language="language",t.system="system",t.DMY="DMY",t.MDY="MDY",t.YMD="YMD"}(fr||(fr={})),function(t){t.language="language",t.monday="monday",t.tuesday="tuesday",t.wednesday="wednesday",t.thursday="thursday",t.friday="friday",t.saturday="saturday",t.sunday="sunday"}(yr||(yr={}));var vr=Number.isNaN||function(t){return"number"==typeof t&&t!=t};function br(t,e){if(t.length!==e.length)return!1;for(var i=0;i<t.length;i++)if(s=t[i],a=e[i],!(s===a||vr(s)&&vr(a)))return!1;var s,a;return!0}function _r(t,e){void 0===e&&(e=br);var i=null;function s(){for(var s=[],a=0;a<arguments.length;a++)s[a]=arguments[a];if(i&&i.lastThis===this&&e(s,i.lastArgs))return i.lastResult;var r=t.apply(this,s);return i={lastResult:r,lastArgs:s,lastThis:this},r}return s.clear=function(){i=null},s}const xr=Intl.DateTimeFormat?.().resolvedOptions?.().timeZone,wr=xr??"UTC",$r=(t,e)=>t===mr.local&&xr?wr:e;_r(((t,e)=>new Intl.DateTimeFormat(t.language,{weekday:"long",month:"long",day:"numeric",timeZone:$r(t.time_zone,e)})));const kr=(t,e,i)=>Sr(e,i.time_zone).format(t),Sr=_r(((t,e)=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric",timeZone:$r(t.time_zone,e)})));_r(((t,e)=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"short",day:"numeric",timeZone:$r(t.time_zone,e)}))),_r(((t,e)=>{const i=t.date_format===fr.system?void 0:t.language;return t.date_format===fr.language||(t.date_format,fr.system),new Intl.DateTimeFormat(i,{year:"numeric",month:"numeric",day:"numeric",timeZone:$r(t.time_zone,e)})}));const Mr=(t,e,i)=>Ar(e,i.time_zone).format(t),Ar=_r(((t,e)=>new Intl.DateTimeFormat(t.language,{day:"numeric",month:"short",timeZone:$r(t.time_zone,e)})));_r(((t,e)=>new Intl.DateTimeFormat(t.language,{month:"long",year:"numeric",timeZone:$r(t.time_zone,e)}))),_r(((t,e)=>new Intl.DateTimeFormat(t.language,{month:"long",timeZone:$r(t.time_zone,e)}))),_r(((t,e)=>new Intl.DateTimeFormat(t.language,{month:"short",timeZone:$r(t.time_zone,e)}))),_r(((t,e)=>new Intl.DateTimeFormat(t.language,{year:"numeric",timeZone:$r(t.time_zone,e)}))),_r(((t,e)=>new Intl.DateTimeFormat(t.language,{weekday:"long",timeZone:$r(t.time_zone,e)}))),_r(((t,e)=>new Intl.DateTimeFormat(t.language,{weekday:"short",timeZone:$r(t.time_zone,e)}))),_r(((t,e)=>new Intl.DateTimeFormat(t.language,{weekday:"short",month:"short",day:"numeric",timeZone:$r(t.time_zone,e)}))),_r(((t,e)=>new Intl.DateTimeFormat(t.language,{weekday:"short",month:"short",day:"numeric",year:"numeric",timeZone:$r(t.time_zone,e)})));const Tr=_r((t=>{if(t.time_format===gr.language||t.time_format===gr.system){const e=t.time_format===gr.language?t.language:void 0;return new Date("January 1, 2023 22:00:00").toLocaleString(e).includes("10")}return t.time_format===gr.am_pm})),Cr=(t,e,i)=>Er(e,i.time_zone).format(t),Er=_r(((t,e)=>new Intl.DateTimeFormat(t.language,{hour:"numeric",minute:"2-digit",hourCycle:Tr(t)?"h12":"h23",timeZone:$r(t.time_zone,e)})));_r(((t,e)=>new Intl.DateTimeFormat(t.language,{hour:Tr(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hourCycle:Tr(t)?"h12":"h23",timeZone:$r(t.time_zone,e)}))),_r(((t,e)=>new Intl.DateTimeFormat(t.language,{weekday:"long",hour:Tr(t)?"numeric":"2-digit",minute:"2-digit",hourCycle:Tr(t)?"h12":"h23",timeZone:$r(t.time_zone,e)}))),_r(((t,e)=>new Intl.DateTimeFormat("en-GB",{hour:"numeric",minute:"2-digit",hour12:!1,timeZone:$r(t.time_zone,e)})));const Ir=(t,e,i)=>Dr(e,i.time_zone).format(t),Dr=_r(((t,e)=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric",hour:Tr(t)?"numeric":"2-digit",minute:"2-digit",hourCycle:Tr(t)?"h12":"h23",timeZone:$r(t.time_zone,e)})));_r((()=>new Intl.DateTimeFormat(void 0,{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}))),_r(((t,e)=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"short",day:"numeric",hour:Tr(t)?"numeric":"2-digit",minute:"2-digit",hourCycle:Tr(t)?"h12":"h23",timeZone:$r(t.time_zone,e)}))),_r(((t,e)=>new Intl.DateTimeFormat(t.language,{month:"short",day:"numeric",hour:Tr(t)?"numeric":"2-digit",minute:"2-digit",hourCycle:Tr(t)?"h12":"h23",timeZone:$r(t.time_zone,e)}))),_r(((t,e)=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric",hour:Tr(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hourCycle:Tr(t)?"h12":"h23",timeZone:$r(t.time_zone,e)})));const zr=t=>t<10?`0${t}`:t,Rr=(t,e)=>{const i=e.days||0,s=e.hours||0,a=e.minutes||0,r=e.seconds||0,o=e.milliseconds||0;return i>0?`${Intl.NumberFormat(t.language,{style:"unit",unit:"day",unitDisplay:"long"}).format(i)} ${s}:${zr(a)}:${zr(r)}`:s>0?`${s}:${zr(a)}:${zr(r)}`:a>0?`${a}:${zr(r)}`:r>0?Intl.NumberFormat(t.language,{style:"unit",unit:"second",unitDisplay:"long"}).format(r):o>0?Intl.NumberFormat(t.language,{style:"unit",unit:"millisecond",unitDisplay:"long"}).format(o):null};_r((t=>new Intl.DurationFormat(t.language,{style:"long"}))),_r((t=>new Intl.DurationFormat(t.language,{style:"digital",hoursDisplay:"auto"})));const Nr=["min","h","d"],Pr=_r((t=>new Intl.DurationFormat(t.language,{style:"narrow",daysDisplay:"always"}))),Gr=_r((t=>new Intl.DurationFormat(t.language,{style:"narrow",hoursDisplay:"always"}))),Fr=_r((t=>new Intl.DurationFormat(t.language,{style:"narrow",minutesDisplay:"always"}))),Br=(t,e,i,s)=>{const a=void 0!==s?((t,e=2)=>Math.round(t*10**e)/10**e)(parseFloat(e),s):parseFloat(e);switch(i){case"d":{const e=Math.floor(a),i={days:e,hours:Math.floor(24*(a-e))};return Pr(t).format(i)}case"h":{const e=Math.floor(a),i={hours:e,minutes:Math.floor(60*(a-e))};return Gr(t).format(i)}case"min":{const e=Math.floor(a),i={minutes:e,seconds:Math.floor(60*(a-e))};return Fr(t).format(i)}default:throw new Error("Invalid duration unit")}},Or=t=>{switch(t.number_format){case pr.comma_decimal:return["en-US","en"];case pr.decimal_comma:return["de","es","it"];case pr.space_comma:return["fr","sv","cs"];case pr.quote_decimal:return["de-CH"];case pr.system:return;default:return t.language}},Hr=(t,e,i)=>{const s=e?Or(e):void 0;return e?.number_format===pr.none||Number.isNaN(Number(t))?Number.isNaN(Number(t))||""===t||e?.number_format!==pr.none?[{type:"literal",value:t}]:new Intl.NumberFormat("en-US",Lr(t,{...i,useGrouping:!1})).formatToParts(Number(t)):new Intl.NumberFormat(s,Lr(t,i)).formatToParts(Number(t))},Vr=(t,e)=>{const i=e?.display_precision;return null!=i?{maximumFractionDigits:i,minimumFractionDigits:i}:Number.isInteger(Number(t?.attributes?.step))&&Number.isInteger(Number(t?.state))?{maximumFractionDigits:0}:void 0},Lr=(t,e)=>{const i={maximumFractionDigits:2,...e};if("string"!=typeof t)return i;if(!e||void 0===e.minimumFractionDigits&&void 0===e.maximumFractionDigits){const e=t.indexOf(".")>-1?t.split(".")[1].length:0;i.minimumFractionDigits=e,i.maximumFractionDigits=e}return i},jr=(t,e)=>"°"===t?"":e&&"%"===t?(t=>{switch(t.language){case"cs":case"de":case"fi":case"fr":case"sk":case"sv":return" ";default:return""}})(e):" ",qr=["timestamp","uptime"],Ur=(t,e,i,s,a,r,o)=>{const n=r?.[e.entity_id];return Wr(t,i,s,a,n,e.entity_id,e.attributes,e.state)},Wr=(t,e,i,s,a,r,o,n)=>Yr(t,e,i,s,a,r,o,n).map((t=>t.value)).join(""),Yr=(t,e,i,s,a,r,o,n)=>{if(n===Zs||n===Js)return[{type:"value",value:t(`state.default.${n}`)}];const l=ta(r),h="counter"===l||"number"===l||"input_number"===l;if(((t,e)=>!!t.unit_of_measurement||!!t.state_class||(e||[]).includes(t.device_class||""))(o,"sensor"===l?i:[])||h){if("duration"===o.device_class&&o.unit_of_measurement&&Nr.includes(o.unit_of_measurement))try{return[{type:"value",value:Br(e,n,o.unit_of_measurement,a?.display_precision)}]}catch(c){}if("monetary"===o.device_class){let t=[];try{t=Hr(n,e,{style:"currency",currency:o.unit_of_measurement,minimumFractionDigits:2,...Vr({state:n,attributes:o},a)})}catch(c){}if(t.length){const e={integer:"value",group:"value",decimal:"value",fraction:"value",minusSign:"value",plusSign:"value",literal:"literal",currency:"unit"},i=[];for(const s of t){const t=e[s.type];if(!t)continue;const a=i[i.length-1];"value"===t&&"value"===a?.type?a.value+=s.value:i.push({type:t,value:s.value})}return i}}const i=((t,e,i)=>Hr(t,e,i).map((t=>t.value)).join(""))(n,e,Vr({state:n,attributes:o},a)),s=a?.translation_key&&t(`component.${a.platform}.entity.${l}.${a.translation_key}.unit_of_measurement`)||o.unit_of_measurement;return s?[{type:"value",value:i},{type:"literal",value:jr(s,e)},{type:"unit",value:s}]:[{type:"value",value:i}]}if(["date","input_datetime","time"].includes(l))try{const t=n.split(" ");if(2===t.length)return[{type:"value",value:Ir(new Date(t.join("T")),{...e,time_zone:mr.local},s)}];if(1===t.length){if(n.includes("-"))return[{type:"value",value:kr(new Date(`${n}T00:00`),{...e,time_zone:mr.local},s)}];if(n.includes(":")){const t=new Date;return[{type:"value",value:Cr(new Date(`${t.toISOString().split("T")[0]}T${n}`),{...e,time_zone:mr.local},s)}]}}return[{type:"value",value:n}]}catch(d){return[{type:"value",value:n}]}if(["ai_task","button","conversation","event","image","infrared","input_button","notify","radio_frequency","scene","stt","tag","tts","wake_word","datetime"].includes(l)||"sensor"===l&&qr.includes(o.device_class))try{return[{type:"value",value:Ir(new Date(n),e,s)}]}catch(c){return[{type:"value",value:n}]}return[{type:"value",value:a?.translation_key&&t(`component.${a.platform}.entity.${l}.${a.translation_key}.state.${n}`)||o.device_class&&t(`component.${l}.entity_component.${o.device_class}.state.${n}`)||t(`component.${l}.entity_component._.state.${n}`)||n}]};function Xr(t,e,i,s){const a=[s];for(let r=s-i;r>=t-1e-9;r-=i)a.push(Number(r.toFixed(10)));for(let r=s+i;r<=e+1e-9;r+=i)a.push(Number(r.toFixed(10)));return a.sort(((t,e)=>t-e))}function Jr(t){const e=t?.show?.tickmarks;if(e&&"object"==typeof e)return{major:!1!==e.major,minor:!1!==e.minor};const i=e??t?.show?.ticks;return{major:i,minor:i}}function Zr(t){const e=Jr(t);return e.major||e.minor}function Kr(t,e,i,s,a,r){if(!i||!s.length)return[];const o=da.toStyleDict(i.styles),n={...o,"stroke-width":o["stroke-width"]??0},l=e.radius+Number(i.offset??0),h=Number(i.width);if(!Number.isFinite(h)||h<=0)throw new Error(`[horseshoe-tickmarks] Missing or invalid ${a} tick width`);const c=Number(i.thickness);return s.map(((s,d)=>{const u=e.valueToAngle(s),p="minor"===a&&r?.has(s)?Math.min(c,r.get(s)):c;"minor"===a&&(t.debug_ticks||t.dev?.debug_ticks)&&console.log("[horseshoe-tickmarks] minor thickness",{value:s,configuredThickness:c,maxThickness:r?.get(s),finalThickness:p,limited:r?.has(s)&&p!==c});const g=function(t,e,i,s){const a=t?.color_mode;return"colorstop"===a?la.calculateStrokeColor(i,s.colorstops,!1):"colorstopinterpolated"===a?la.calculateStrokeColor(i,s.colorstops,!0):t?.color??e.fill}(i,o,s,t),m={...n,fill:g??o.fill};if(void 0===g&&t.dev?.debug_colors&&console.log("[horseshoe-tickmarks] unresolved tick fill",{layerName:a,value:s,colorMode:i.color_mode,colorstops:t.colorstops}),"circle"===i.shape){const t=e.pointAt(u,l);return{key:`${a}-${d}`,shape:"circle",x:t.x,y:t.y,radius:Number(i.radius??h/2),value:s,thickness:p,startAngle:u,endAngle:u,styles:m,className:"major"===a?"horseshoe__tick-major":"horseshoe__tick-minor"}}const f=h,y=function(t,e){return Number(t)/(2*Math.PI*e)*360}(p,l),v=u-y/2,b=u+y/2,_=function(t,e,i){return qa.buildBandPath({geometry:t,arc:e,band:i})}(e,{key:`${a}-${d}`,startAngle:v,endAngle:b,startCap:"butt",endCap:"butt"},{radius:l,width:f});return{key:`${a}-${d}`,path:_,value:s,thickness:p,startAngle:v,endAngle:b,styles:m,className:"major"===a?"horseshoe__tick-major":"horseshoe__tick-minor"}})).filter((t=>t.path||"circle"===t.shape))}function Qr(t,e){if(!Zr(t))return[];const i=t.horseshoe_tickmarks,s=Jr(t);if(!i?.ticks_major&&!i?.ticks_minor)return[];const a="absolute"===t.bar_mode,r="bidirectional"===t.bar_mode||"bidirectional_symmetrical"===t.bar_mode||"bidirectional_linear"===t.bar_mode,o=a?0:Number(t.horseshoe_scale.min),n=a?e.getActiveMagnitudeMax():Number(t.horseshoe_scale.max),l=a||r?0:o,h=t=>a?e.magnitudeToSourceValue(t):t,c=s.major?i.ticks_major:void 0,d=s.minor?i.ticks_minor:void 0,u=Number(c?.ticksize),p=Number(d?.ticksize),g=Number.isFinite(u)&&u>0?Xr(o,n,u,l):[],m=Number.isFinite(p)&&p>0?Xr(o,n,p,l).filter((t=>!(Number.isFinite(u)&&u>0)||!function(t,e,i){const s=(t-e)/i;return Math.abs(s-Math.round(s))<1e-9}(t,l,u))):[],f=g.map(h),y=m.map(h),v=new Map;if(("splineorg"===t.horseshoe_scale.type||"spline"===t.horseshoe_scale.type)&&g.length>1&&m.length){const i=e.radius+Number(d.offset??0),s=Number(c.thickness),a=g.slice(0,-1).map(((t,i)=>Math.abs(e.valueToAngle(h(g[i+1]))-e.valueToAngle(h(t))))),r=a[1]??a[0];for(let o=0;o<g.length-1;o+=1){const a=g[o],n=g[o+1],l=m.filter((t=>t>a&&t<n));if(l.length){const o=Math.abs(e.valueToAngle(h(n))-e.valueToAngle(h(a))),c=(b=i,Number(o)/360*(2*Math.PI*b)),u=Math.max(0,c-s),g=(n-a)/p,m=Math.min(1,o/r),f=Math.min(u/g,Number(d.thickness)*m);(t.debug_ticks||t.dev?.debug_ticks)&&console.log("[horseshoe-tickmarks] spline minor interval",{scaleType:t.horseshoe_scale.type,majorStartMagnitude:a,majorEndMagnitude:n,minorMagnitudes:l,majorGapDegrees:o,referenceMajorGapDegrees:r,intervalRatio:m,maxMinorThickness:f}),l.forEach((t=>{v.set(h(t),f)}))}}}var b;return[...Kr(t,e,d,y,"minor",v),...Kr(t,e,c,f,"major")]}class to extends Ea{static setConfig(t,e,i,s){const a=to.getLegacyRootConfig(t),r=[...a?[a]:[],...[...Array.isArray(t.layout?.horseshoes_v2)?t.layout.horseshoes_v2:[],...Array.isArray(t.layout?.horseshoes)?t.layout.horseshoes:[]]];return(!0===t.dev?.debug||!0===t.debug||!0===t.debug_state_map||r.some((t=>!0===t.debug_state_map||!0===t.horseshoe_state?.debug_state_map)))&&console.log("[FHS horseshoe] setConfig",{count:r.length,configs:r.map((t=>({show:t.show,entity_index:t.entity_index,horseshoe_state:t.horseshoe_state,color_stops:t.color_stops,colorstops:t.colorstops})))}),r.filter(Boolean).map(((t,e)=>to.applyLegacyTickmarkCompat(t))).map(((t,a)=>new to(function(t,e,i){const s=t.entity_index??0,a=i.getGroupForItem(t);return{entity_index:s,bar_mode:"normal",...t,group_config:a,index:e,show:{horseshoe:!0,horseshoe_style:"fixed",labels_at:"none",...t.show??{}}}}(t,a,s.cardLayout.groupManager),a,e,i,s))).filter((t=>!1!==t.show?.horseshoe))}static getLegacyRootConfig(t){const e=["entity_index","show","horseshoe_position","horseshoe_scale","horseshoe_state","horseshoe_background","horseshoe_labels","horseshoe_tickmarks","color_stops","colorstops","styles","bar_mode","radius","tickmarks_radius","arc_degrees","start_angle","rotate","flip","xpos","ypos","yposc"];if(!e.filter((t=>"show"!==t&&"styles"!==t&&"entity_index"!==t)).some((e=>void 0!==t[e])))return;const i={};return e.forEach((e=>{void 0!==t[e]&&(i[e]=t[e])})),Object.keys(i).length?i:void 0}static applyLegacyTickmarkCompat(t){if(!0!==t.show?.scale_tickmarks)return t;const e=t.horseshoe_tickmarks??{};if(e.ticks_major||e.ticks_minor)return{...t,show:{...t.show,tickmarks:t.show.tickmarks??t.show.ticks??!0}};const i=t.horseshoe_scale??{},s=Number(i.min??0),a=Number(i.max??100)-s,r=i.ticksize??(a?a/10:void 0),o=Number(t.radius??45),n=Number(t.tickmarks_radius??43),l=Number(i.width??6);return{...t,show:{...t.show,tickmarks:!0},horseshoe_tickmarks:{...e,ticks_major:{ticksize:r,shape:"circle",radius:l/2,width:l,thickness:l,offset:n-o,styles:[...Array.isArray(e.styles)?e.styles:e.styles?[e.styles]:[],{fill:i.color??"var(--primary-background-color)"}]}}}}constructor(t,e,i,s,a){super(t,e,i,s,a,"horseshoes_v2","horseshoes_v2",0),this.activeItemConfig=this.config,this.show=t.show,this.entity=void 0,this.entityConfig=void 0,this.rawState=void 0,this.value=void 0,this.displayValue=void 0,this.mappedState=void 0,this.normalizedConfig=void 0,this.geometryConfigSignature=void 0,this.scale=void 0,this.geometry=void 0,this.valueAnimator={frame:void 0,startTime:void 0,fromValue:void 0,toValue:void 0,animating:!1},this.statePathElements=new Map,this.pathItemCache=new Map,this.pathItemCacheKey=void 0}updateRuntimeConfig(){this.config=this.activeItemConfig,super.updateRuntimeConfig(),this.activeItemConfig=this.config,!this.configChanged&&this.normalizedConfig||(this.config.group_config=this.card.cardLayout.groupManager.getGroupForItem(this.config),this.normalizedConfig=function(t,e){const i={horseshoe:!0,horseshoe_style:"fixed",labels_at:"none",...t.show??{}};if(!t.horseshoe_scale)throw new Error("[V2] Missing horseshoe_scale");const s=t.colorstops.scales.default??{},a={min:s.min??0,max:s.max??100,width:6,color:"var(--primary-background-color)",linecap:"round",type:"linear",...t.horseshoe_scale??{}};if(void 0===a.min)throw new Error("[V2] Missing horseshoe_scale.min");if(void 0===a.max)throw new Error("[V2] Missing horseshoe_scale.max");if(!a.type)throw new Error("[V2] Missing horseshoe_scale.type");if(("splineorg"===a.type||"spline"===a.type)&&!a.spline)throw new Error("[V2] Missing horseshoe_scale.spline");const r={width:12,color:"var(--primary-color)",linecap:"round",mode:"value",segment_gap:t.colorstops.gap,animation:nr,...t.horseshoe_state??{}},o={...t.horseshoe_background??{}},n={offset:12,...t.horseshoe_labels??{}},l={...t.horseshoe_tickmarks??{}},h=t.state_map??r.state_map,c=xa.ensureMinimumStops(t.colorstops,a.max);let d=xa.normalize();if(c.colors.length>0){const t=c.colors[0],i=c.colors[c.colors.length-1];d=xa.normalize({[a.min]:t.color,[a.max]:i.color},e)}const u=t.radius??45,p=t.tickmarks_radius??43,g=360===t.arc_degrees?359.999:t.arc_degrees??260,m=t.bar_mode??"normal",f=["normal","bidirectional","bidirectional_symmetrical","bidirectional_linear","absolute"];if(!f.includes(m))throw new Error(`[V2] Invalid bar_mode '${m}' [${f.join(", ")}]`);if("absolute"===m){if(Number(a.min)>0||Number(a.max)<=0)throw new Error("[V2] absolute bar_mode requires horseshoe_scale.min <= 0 and horseshoe_scale.max > 0");if(void 0!==t.zero_ratio)throw new Error("[V2] absolute bar_mode does not support zero_ratio")}const y=["autominmax","minmaxgradient","lineargradient"].includes(i.horseshoe_style)&&("bidirectional"===m||"bidirectional_symmetrical"===m||"bidirectional_linear"===m||"absolute"===m);if(y&&(a.min<0||"absolute"===m)&&!c.colors.some((t=>Number(t.value)<0)))throw new Error(`[V2] ${i.horseshoe_style} with ${m} requires a color_stop below 0`);if(y&&a.max>0&&!c.colors.some((t=>Number(t.value)>0)))throw new Error(`[V2] ${i.horseshoe_style} with ${m} requires a color_stop above 0`);const v="bidirectional"===m||"bidirectional_symmetrical"===m,b=t.group_config,_=t.xpos??t.horseshoe_position?.xpos??t.horseshoe_position?.cx??50,x=t.yposc||(t.ypos??t.horseshoe_position?.ypos??t.horseshoe_position?.cy??50),w=b?b.xpos+_-50:_,$=b?b.ypos+x-50:x,k=b?{xpos:b.xpos/100*fa,ypos:b.ypos/100*fa}:void 0;return{...t,show:i,group_config:b?{...b,svg:k}:b,xpos:w,ypos:$,radius:u,tickmarks_radius:p,arc_degrees:g,svg:{xpos:w/100*fa,ypos:$/100*fa,radius:u/100*fa,tickmarks_radius:p/100*fa},start_angle:t.start_angle??90+(360-g)/2,bar_mode:m,zero_ratio:t.zero_ratio??(v?.5:dr(a)),state_map:h,colorstops:c,colorstopsMinMax:d,horseshoe_background:{...o,styles:{...da.toStyleDict(o.styles)}},horseshoe_scale:{...a,linecap:lr(a.linecap),styles:{fill:a.color,...da.toStyleDict(a.styles)}},horseshoe_state:{...r,animation:{...nr,...r.animation??{}},linecap:lr(r.linecap),styles:{fill:r.color,...da.toStyleDict(r.styles)}},horseshoe_labels:{...n,stringstate_level:cr(n.stringstate_level),stringstate_mode:cr(n.stringstate_mode),background:{...n.background??{},styles:{...da.toStyleDict(n.background?.styles)}},badges:{...n.badges??{},styles:{...da.toStyleDict(n.badges?.styles)}},styles:{fill:"var(--primary-text-color)","font-size":"6px",...da.toStyleDict(n.styles)}},horseshoe_tickmarks:{...l,background:{...l.background??{},styles:{...da.toStyleDict(l.background?.styles)}},ticks_major:l.ticks_major?{...l.ticks_major,styles:{...da.toStyleDict(l.ticks_major?.styles)}}:l.ticks_major,ticks_minor:l.ticks_minor?{...l.ticks_minor,styles:{...da.toStyleDict(l.ticks_minor?.styles)}}:l.ticks_minor}}}(this.config,this.card.cardTheme.getActiveColorStopMode()))}setState(t,e){super.setState(t,e);const i=ur(this.normalizedConfig,t,e),s=i.value,a=Number.isFinite(this.displayValue)?this.displayValue:s;this.config=i.config,this.config.state_map=this.buildStateMapDisplayLabels(this.config.state_map,t);const r=this.config.state_map?.map?.find((t=>t.state===i.mappedState?.state&&Number(t.value)===Number(i.mappedState?.value)));let o=i.mappedState;r&&(o={...i.mappedState,...r,color:i.mappedState?.color??r.color}),this.config.mapped_state=o,this.zpos=Number(this.config.zpos)+Number(this.config.dzpos),this.rawState=i.rawState,this.mappedState=o,this.value=s;(!0===this.config.dev?.debug||!0===this.config.debug||!0===this.config.debug_state_map||!0===this.config.horseshoe_state?.debug_state_map)&&console.log("[FHS horseshoe] setState",{index:this.index,entity:t.entity_id,rawState:i.rawState,value:this.value,mappedState:this.mappedState,show:this.config.show,stateMap:this.config.state_map,colorstops:this.config.colorstops});const n=JSON.stringify({horseshoe_scale:this.config.horseshoe_scale,svg:this.config.svg,arc_degrees:this.config.arc_degrees,start_angle:this.config.start_angle,rotate:this.config.rotate,flip:this.config.flip,group_config:this.config.group_config,bar_mode:this.config.bar_mode,zero_ratio:this.config.zero_ratio}),l=Number.isFinite(this.displayValue)?this.displayValue:s;n!==this.geometryConfigSignature?(this.scale=new Ga(this.config.horseshoe_scale),this.geometry=new Fa(this.config,this.scale,l),this.geometryConfigSignature=n):this.geometry.setActiveValue(l),this.refreshPathItemCacheKey();"stringstate_mode"===this.config.horseshoe_state.mode||"stringstate_level"===this.config.horseshoe_state.mode?this.displayValue=this.value:Number.isFinite(this.displayValue)?this.displayValue!==this.value&&this.startValueAnimation({fromValue:a,toValue:this.value}):this.displayValue=this.value}buildStateMapDisplayLabels(t,e){return t?.map?"rank_state"===t.type?t:{...t,map:t.map.map((t=>{const i=String(t.state??t.value),s={...e,state:i},a=this.card._hass.formatEntityState?.(e,i),r=this.card._hass.formatEntityState?.(s),o=Ur(this.card._hass.localize,s,this.card._hass.locale,[],this.card._hass.config,this.card._hass.entities),n=[a,r,o].find((t=>void 0!==t&&t!==i))??a??r??o;return(this.config?.dev?.debug_state_map||this.config?.debug_state_map)&&console.log("[horseshoe-state-map] display label",{entity_id:e.entity_id,activeState:e.state,state:i,formattedState:a,formattedStateEntity:r,computedState:o,displayLabel:n,entry:t}),{...t,display_label:n??t.display_label}}))}:t}render(){if(!(Number.isFinite(this.value)&&this.config&&this.scale&&this.geometry)){return(!0===this.config?.dev?.debug||!0===this.config?.debug||!0===this.config?.debug_state_map||!0===this.config?.horseshoe_state?.debug_state_map)&&console.log("[FHS horseshoe] render skipped",{index:this.index,value:this.value,hasConfig:Boolean(this.config),hasScale:Boolean(this.scale),hasGeometry:Boolean(this.geometry)}),V``}if(this.card?.config?.palettes&&!this.card.cardTheme.palettesLoaded)return V``;this.geometry.setActiveValue(this.displayValue??this.value),this.refreshPathItemCacheKey();const t=this.geometry.getGroupTransform();return this.renderItemLayers(V`
      <g
        id="horseshoe-${this.index}"
        class="horseshoe"
        transform="${t}"
        ${this.actionHandler()}
        @action=${t=>this.handleAction(t)}
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
    `)}getPathItemCacheKey(){return JSON.stringify({show:this.config.show,svg:this.config.svg,arc_degrees:this.config.arc_degrees,start_angle:this.config.start_angle,rotate:this.config.rotate,flip:this.config.flip,group_config:this.config.group_config,bar_mode:this.config.bar_mode,absolute_sign:"absolute"===this.config.bar_mode?this.geometry.absoluteSign:void 0,zero_ratio:this.config.zero_ratio,colorstops:this.config.colorstops,colorstopsMinMax:this.config.colorstopsMinMax,horseshoe_background:this.config.horseshoe_background,horseshoe_scale:this.config.horseshoe_scale,horseshoe_state:{width:this.config.horseshoe_state.width,linecap:this.config.horseshoe_state.linecap,mode:this.config.horseshoe_state.mode,segment_gap:this.config.horseshoe_state.segment_gap,color:this.config.horseshoe_state.color,styles:this.config.horseshoe_state.styles},state_map:this.config.state_map,mapped_state:this.config.mapped_state,horseshoe_labels:this.config.horseshoe_labels,horseshoe_tickmarks:this.config.horseshoe_tickmarks})}refreshPathItemCacheKey(){const t=this.getPathItemCacheKey();t!==this.pathItemCacheKey&&(this.pathItemCache.clear(),this.pathItemCacheKey=t)}clearPathItemCache(){this.pathItemCache.clear(),this.pathItemCacheKey=void 0}getCachedPathItems(t,e){if(!this.pathItemCache.has(t)){la.unresolvedColor=!1;const i=e();if(la.unresolvedColor)return i;this.pathItemCache.set(t,i)}return this.pathItemCache.get(t)}renderHorseshoeBackground(){const t=this.getCachedPathItems("horseshoeBackgroundItems",(()=>function(t,e){const i=t.show.horseshoe_background??"none",s=t.horseshoe_background??{};return Wa(t,e,{mode:i,config:s,radius:e.radius+Number(s.offset??0),width:Number(s.width??t.horseshoe_scale.width??t.horseshoe_state.width??6),gap:Number(s.gap??t.colorstops?.gap??0),keyPrefix:"horseshoe-background"})}(this.config,this.geometry)));return function(t,e,i,s,a,r){return Ha(0,i,{layerClass:"horseshoe__background-layer",itemClass:"horseshoe__background",styles:t.horseshoe_background.styles,applyColorFilter:r,gradientPrefix:`horseshoe-background-${s}-${a}`})}(this.config,this.geometry,t,this.cardId,this.index,(t=>this.getRenderStyles(t,[this.config.horseshoe_background?.color_filter])))}renderScale(){const t=this.getCachedPathItems("scalePathItems",(()=>function(t,e){const i=t.show?.scale_style??"fixed";if("lineargradient"===i||"colorstopgradient"===i)return Xa(t,e,{mode:i,radius:e.radius,width:t.horseshoe_scale.width,startCap:t.horseshoe_scale.linecap.start,endCap:t.horseshoe_scale.linecap.end,keyPrefix:`scale-${i}`});const s=Ua(t,e),a={radius:e.radius,width:t.horseshoe_scale.width};return s.map(((t,i)=>({key:t.key??`scale-arc-${i}`,arc:t,path:qa.buildBandPath({geometry:e,arc:t,band:a})})))}(this.config,this.geometry)));return function(t,e,i,s,a,r=(t=>t)){const o={...t.horseshoe_scale.styles};return V`
    <g class="horseshoe__scale-layer" style=${gt(r(o))}>
      <defs>
        ${i.map((t=>{if(!t.arc.gradient)return V``;const e=`horseshoe-scale-${s}-${a}-${t.key}`,i=r({fill:t.arc.gradient.startColor},t),o=r({fill:t.arc.gradient.endColor},t);return V`
            <linearGradient id=${e} gradientUnits="userSpaceOnUse" x1=${t.arc.gradient.x1} y1=${t.arc.gradient.y1} x2=${t.arc.gradient.x2} y2=${t.arc.gradient.y2}>
              <stop offset="0%" stop-color=${i.fill}></stop>
              <stop offset="100%" stop-color=${o.fill}></stop>
            </linearGradient>
          `}))}
      </defs>
      ${i.map((e=>{const i=`horseshoe-scale-${s}-${a}-${e.key}`,n={fill:e.arc.gradient?`url('#${i}')`:e.arc.color??t.horseshoe_scale.color??o.fill??"none"};return e.path?V`
              <path
                class="horseshoe__scale"
                d=${e.path}
                style=${gt(r(n,e))}
              ></path>
            `:V``}))}
    </g>
  `}(this.config,this.geometry,t,this.cardId,this.index,(t=>this.getRenderStyles(t,[this.config.horseshoe_scale?.color_filter])))}renderState(){const t=sr(this.config,this.geometry,this.displayValue??this.value);let e;return(!0===this.config.dev?.debug||!0===this.config.debug||!0===this.config.debug_state_map||!0===this.config.horseshoe_state?.debug_state_map)&&console.log("[FHS horseshoe] renderState",{index:this.index,value:this.displayValue??this.value,style:this.config.show?.horseshoe_style,paths:t.map((t=>({key:t.key,hasPath:Boolean(t.path),arc:t.arc})))}),"colorstopgradient"===this.config.show?.horseshoe_style&&(e=this.getCachedPathItems("colorStopGradientPathItems",(()=>{return t=this.config,e=this.geometry,Xa(t,e);var t,e}))),function(t,e,i,s,a,r,o=(t=>t)){const n={...t.horseshoe_state.styles},l={...t.horseshoe_scale.styles};if("minmaxgradient"===t.show?.horseshoe_style||"lineargradient"===t.show?.horseshoe_style){const e=t.show.horseshoe_style;return V`
      <g class="horseshoe__state-layer horseshoe__state-layer--${e}">
        <defs>
          ${i.map((t=>{const e=`${Oa(a,r,t.key)}-gradient`,i=o({fill:t.arc.gradient.startColor},t),s=o({fill:t.arc.gradient.endColor},t);return V`
              <linearGradient
                id="${e}"
                gradientUnits="userSpaceOnUse"
                spreadMethod="pad"
                x1="${t.arc.gradient.x1}"
                y1="${t.arc.gradient.y1}"
                x2="${t.arc.gradient.x2}"
                y2="${t.arc.gradient.y2}"
              >
                <stop offset="0%" stop-color="${i.fill}"></stop>
                <stop offset="100%" stop-color="${s.fill}"></stop>
              </linearGradient>
            `}))}
        </defs>
        <g id="horseshoe-state-${a}-${r}-${e}-group" class="horseshoe__state-gradient" style=${gt(o(n))}>
          ${i.map((t=>{const e=Oa(a,r,t.key),i=`${e}-gradient`;return V`
              <path
                id="${e}"
                data-horseshoe-state-path="${e}"
                class="horseshoe__state horseshoe__state-gradient-segment"
                d="${t.path}"
                style=${gt({fill:`url('#${i}')`})}
              ></path>
            `}))}
        </g>
      </g>
    `}if("colorstopgradient"===t.show?.horseshoe_style){const t=i[0],e=Oa(a,r,t.key),l=`${e}-path`;return V`
      <g class="horseshoe__state-layer horseshoe__state-layer--colorstopgradient">
        <defs>
          <clipPath id="${l}" clipPathUnits="userSpaceOnUse">
            <path
              id="${e}"
              data-horseshoe-state-path="${e}"
              d="${t.path}"
            ></path>
          </clipPath>
          ${s.map((t=>{const i=`${e}-${t.key}`,s=o({fill:t.arc.gradient.startColor},t),a=o({fill:t.arc.gradient.endColor},t);return V`
              <linearGradient
                id="${i}"
                gradientUnits="userSpaceOnUse"
                spreadMethod="pad"
                x1="${t.arc.gradient.x1}"
                y1="${t.arc.gradient.y1}"
                x2="${t.arc.gradient.x2}"
                y2="${t.arc.gradient.y2}"
              >
                <stop offset="0%" stop-color="${s.fill}"></stop>
                <stop offset="100%" stop-color="${a.fill}"></stop>
              </linearGradient>
            `}))}
        </defs>
        <g class="horseshoe__state-gradient" clip-path="url(#${l})" style=${gt(o(n))}>
          ${s.map((t=>{const i={fill:`url('#${e}-${t.key}')`};return V`
              <path
                class="horseshoe__state horseshoe__state-gradient-segment"
                d="${t.path}"
                style=${gt(i)}
              ></path>
            `}))}
        </g>
      </g>
    `}return V`
    <g class="horseshoe__state-layer">
      ${i.map((e=>{const i="stringstate_mode"===t.horseshoe_state.mode||"stringstate_level"===t.horseshoe_state.mode,s=!1!==e.arc.active||i?n:l,h=e.arc.color??s.fill??t.horseshoe_state.color??"none",c={...s,fill:h};i&&void 0===c.transition&&(c.transition="fill 600ms ease, opacity 600ms ease, filter 600ms ease"),i&&!1===e.arc.active&&(c.opacity=t.horseshoe_state.inactive_opacity??"0"),e.path||(c.opacity="0");const d=Oa(a,r,e.key);return V`
          <path
            id="${d}"
            data-horseshoe-state-path="${d}"
            class="horseshoe__state"
            d="${e.path}"
            style=${gt(o(c,e))}
          ></path>
        `}))}
    </g>
  `}(this.config,this.geometry,t,e,this.cardId,this.index,(t=>this.getRenderStyles(t,[this.config.horseshoe_state?.color_filter])))}renderTickmarks(){return function(t,e=(t=>t)){return t.length?V`
    <g class="horseshoe__ticks-layer">
      ${t.map((t=>"circle"===t.shape?V`
            <circle
              class="${t.className}"
              cx="${t.x}"
              cy="${t.y}"
              r="${t.radius}"
              data-value="${t.value??""}"
              data-thickness="${t.thickness??""}"
              data-start-angle="${t.startAngle??""}"
              data-end-angle="${t.endAngle??""}"
              style=${gt(e(t.styles??{},t))}
            ></circle>
          `:V`
            <path
              class="${t.className}"
              d="${t.path}"
              data-value="${t.value??""}"
              data-thickness="${t.thickness??""}"
              data-start-angle="${t.startAngle??""}"
              data-end-angle="${t.endAngle??""}"
              style=${gt(e(t.styles??{},t))}
            ></path>
          `))}
    </g>
  `:V``}(this.getCachedPathItems("tickPathItems",(()=>Qr(this.config,this.geometry))),((t,e)=>{const i="horseshoe__tick-major"===e.className?this.config.horseshoe_tickmarks?.ticks_major:this.config.horseshoe_tickmarks?.ticks_minor;return this.getRenderStyles(t,[this.config.horseshoe_tickmarks?.color_filter,i?.color_filter])}))}renderTickmarkBackground(){const t=this.getCachedPathItems("tickmarkBackgroundItems",(()=>function(t,e){if(!Zr(t))return[];const i=t.show.tick_background??"none",s=t.horseshoe_tickmarks??{},a=s.background??{},r=s.ticks_major??{},o=s.ticks_minor??{};return Wa(t,e,{mode:i,config:a,radius:e.radius+Number(a.offset??r.offset??o.offset??0),width:Number(a.width??r.width??o.width??4),gap:Number(a.gap??0),keyPrefix:"tick-background"})}(this.config,this.geometry)));return function(t,e,i,s,a){return Ha(0,i,{layerClass:"horseshoe__tick-background-layer",itemClass:"horseshoe__tick-background",styles:t.horseshoe_tickmarks.background.styles,gradientPrefix:`horseshoe-tick-background-${s}-${a}`})}(this.config,this.geometry,t,this.cardId,this.index)}renderLabels(){const t=this.getCachedPathItems("labelItems",(()=>or(this.config,this.geometry)));return function(t,e,i,s,a,r=(t=>t)){const o={...t.horseshoe_labels.styles};return V`
    <g class="horseshoe__labels-layer" style=${gt(r(o))}>
      ${a.map(((a,o)=>Ba.renderLabel({horseshoeIndex:s,index:o,label:a.text,styles:a.styles,relation:a.relation,ellipsis:t.horseshoe_labels.ellipsis,angle:a.angle,arcSize:t.horseshoe_labels.arc_size??a.arcSize,cx:e.cx,cy:e.cy,radius:a.radius,cardId:i,orientation:t.horseshoe_labels.orientation??"arc",isMin:"min"===a.role,isMax:"max"===a.role,transformContext:e.getTransformContext(),inverseTransform:e.getInverseGroupTransform(),applyColorFilter:r})))}
    </g>
  `}(this.config,this.geometry,this.cardId,this.index,t,(t=>this.getRenderStyles(t,[this.config.horseshoe_labels?.color_filter])))}renderLabelBackground(){const t=this.getCachedPathItems("labelBackgroundItems",(()=>function(t,e){const i=t.show.label_background??"none",s=t.horseshoe_labels.background??{};return Wa(t,e,{mode:i,config:s,radius:e.radius+Number(t.horseshoe_labels.offset??t.horseshoe_state.width+2),width:Number(s.width??6),gap:Number(s.gap??0),keyPrefix:"label-background"})}(this.config,this.geometry)));return function(t,e,i,s,a,r){return Ha(0,i,{layerClass:"horseshoe__label-background-layer",itemClass:"horseshoe__label-background",styles:t.horseshoe_labels.background.styles,applyColorFilter:r,gradientPrefix:`horseshoe-label-background-${s}-${a}`})}(this.config,this.geometry,t,this.cardId,this.index,(t=>this.getRenderStyles(t,[this.config.horseshoe_labels?.background?.color_filter])))}renderLabelBadges(){const t=this.getCachedPathItems("labelItems",(()=>or(this.config,this.geometry)));return function(t,e,i,s,a,r=(t=>t)){if(!a.length||!t.show.label_badges)return V``;const o={...t.horseshoe_labels.badges.styles};return V`
    <g class="horseshoe__label-badges-layer" style=${gt(r(o))}>
      ${a.map(((a,r)=>Ba.renderLabelBadge({horseshoeIndex:s,index:r,label:a.text,angle:a.angle,cx:e.cx,cy:e.cy,radius:a.radius,cardId:i,orientation:t.horseshoe_labels.orientation??"arc",badge:t.horseshoe_labels.badges??{}})))}
    </g>
  `}(this.config,this.geometry,this.cardId,this.index,t,(t=>this.getRenderStyles(t,[this.config.horseshoe_labels?.badges?.color_filter])))}getStateAnimationConfig(){return t=this.config,{...Da,...t?.horseshoe_state?.animation??{}};var t}startValueAnimation(t={}){const e=this.getStateAnimationConfig();za(this.valueAnimator,e,t,{onUpdate:t=>{this.displayValue=t,this.updateStatePathDom({value:this.displayValue})},onComplete:t=>{this.displayValue=t,this.updateStatePathDom({value:this.displayValue})}})}updateStatePathDom(t={}){if(!this.config||!this.geometry||!this.scale)return;const e=Number(t.value??this.displayValue??this.value);this.geometry.setActiveValue(e)&&(this.refreshPathItemCacheKey(),this.card.requestUpdate());const i=sr(this.config,this.geometry,e);!function(t,e,i,s,a,r,o=(t=>t)){const n={...t.horseshoe_state.styles},l={...t.horseshoe_scale.styles};if("minmaxgradient"===t.show?.horseshoe_style||"lineargradient"===t.show?.horseshoe_style){const l=t.show.horseshoe_style,h=s.renderRoot??s.shadowRoot,c=h.getElementById?.(`horseshoe-state-${a}-${r}-${l}-group`)??h.querySelector?.(`#horseshoe-state-${a}-${r}-${l}-group`);if(!c)return;return c.setAttribute("style",Object.entries(o(n)).map((([t,e])=>`${t}: ${e}`)).join("; ")),void e.forEach((t=>{const e=Va(i,s,a,r,t),n=`${Oa(a,r,t.key)}-gradient`,l=`${t.key}-gradient`;let c=i.get(l);if(c?.isConnected||(c=h.getElementById?.(n)??h.querySelector?.(`#${n}`),i.set(l,c)),!e||!c)return;const d=o({fill:t.arc.gradient.startColor},t),u=o({fill:t.arc.gradient.endColor},t);e.setAttribute("d",t.path||""),e.setAttribute("style",`fill: url('#${n}')`),c.setAttribute("x1",t.arc.gradient.x1),c.setAttribute("y1",t.arc.gradient.y1),c.setAttribute("x2",t.arc.gradient.x2),c.setAttribute("y2",t.arc.gradient.y2),c.children[0].setAttribute("stop-color",d.fill),c.children[1].setAttribute("stop-color",u.fill)}))}if("colorstopgradient"!==t.show?.horseshoe_style)e.forEach((e=>{const h=Va(i,s,a,r,e);if(!h)return;const c="stringstate_mode"===t.horseshoe_state.mode||"stringstate_level"===t.horseshoe_state.mode,d=!1!==e.arc.active||c?n:l,u=e.arc.color??d.fill??t.horseshoe_state.color??"none",p={...d,fill:u};c&&void 0===p.transition&&(p.transition="fill 600ms ease, opacity 600ms ease, filter 600ms ease"),c&&!1===e.arc.active&&(p.opacity=t.horseshoe_state.inactive_opacity??"0"),e.path||(p.opacity="0"),h.setAttribute("d",e.path||""),h.setAttribute("style",Object.entries(o(p,e)).map((([t,e])=>`${t}: ${e}`)).join("; "))}));else{const t=e[0],o=Va(i,s,a,r,t);if(!o)return;o.setAttribute("d",t.path||"")}}(this.config,i,this.statePathElements,this.card,this.cardId,this.index,(t=>this.getRenderStyles(t,[this.config.horseshoe_state?.color_filter])))}}class eo{static calculateValueBetween(t,e,i){return isNaN(i)?0:i?(Math.min(Math.max(i,t),e)-t)/(e-t):0}static calculateSvgCoordinate(t,e){return t/100*ma+(e-100)}static calculateSvgDimension(t){return t/100*ma}static calculateRoundedRectHorizontalInset(t,e,i,s,a){const r=Math.min(s-e,i-a);return r>=t?0:t-Math.sqrt(t**2-(t-r)**2)}static getLovelace(){let t=window.document.querySelector("home-assistant");if(t=t&&t.shadowRoot,t=t&&t.querySelector("home-assistant-main"),t=t&&t.shadowRoot,t=t&&t.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"),t=t&&t.shadowRoot||t,t=t&&t.querySelector("ha-panel-lovelace"),t=t&&t.shadowRoot,t=t&&t.querySelector("hui-root"),t){const e=t.lovelace;return e.current_view=t.___curView,e}return null}}class io extends Ea{static setConfig(t,e,i,s){return(t.layout?.rectangles??[]).map(((t,a)=>new io(t,a,e,i,s)))}constructor(t,e,i,s,a){const r={radius:0,...t};"object"==typeof r.width&&(r.width={padding:0,...r.width}),"object"==typeof r.height&&(r.height={padding:0,...r.height}),r.fit&&(r.fit={...r.fit,padding:{x:1.5,y:.5,...r.fit.padding}}),super(r,e,i,s,a,"rectangles","rectangles",void 0,{fill:!0,stroke:!1}),this.config.svg=this.calculateSvgDimensions()}updateRuntimeConfig(){super.updateRuntimeConfig(),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config))}calculateSvgDimensions(t=this.config){let e,i,s;if(t.fit){const a=this.card.cardTools.getItemGeometry(t.fit);e={xpos:a.xpos,ypos:a.ypos},i=eo.calculateSvgDimension(a.width+2*t.fit.padding.x),s=eo.calculateSvgDimension(a.height+2*t.fit.padding.y)}else e=this.card.cardLayout.calculateSvgCoordinatesInGroup(t),i=eo.calculateSvgDimension(this.card.cardTools.getItemWidth(t.width)),s=eo.calculateSvgDimension(this.card.cardTools.getItemHeight(t.height));const a="object"==typeof t.radius?t.radius:{all:t.radius},r=Math.min(s,i)/2,o=t=>Math.min(r,Math.max(0,eo.calculateSvgDimension(t)));return e.width=i,e.height=s,e.x=e.xpos-i/2,e.y=e.ypos-s/2,e.radiusTopLeft=o(a.top_left??a.left??a.top??a.all),e.radiusTopRight=o(a.top_right??a.right??a.top??a.all),e.radiusBottomLeft=o(a.bottom_left??a.left??a.bottom??a.all),e.radiusBottomRight=o(a.bottom_right??a.right??a.bottom??a.all),e}buildRoundedRectanglePath(){const t=this.config.svg;return`\n      M ${t.x+t.radiusTopLeft} ${t.y}\n      h ${t.width-t.radiusTopLeft-t.radiusTopRight}\n      q ${t.radiusTopRight} 0 ${t.radiusTopRight} ${t.radiusTopRight}\n      v ${t.height-t.radiusTopRight-t.radiusBottomRight}\n      q 0 ${t.radiusBottomRight} -${t.radiusBottomRight} ${t.radiusBottomRight}\n      h -${t.width-t.radiusBottomRight-t.radiusBottomLeft}\n      q -${t.radiusBottomLeft} 0 -${t.radiusBottomLeft} -${t.radiusBottomLeft}\n      v -${t.height-t.radiusBottomLeft-t.radiusTopLeft}\n      q 0 -${t.radiusTopLeft} ${t.radiusTopLeft} -${t.radiusTopLeft}\n      Z\n    `}render(){this.config.svg=this.calculateSvgDimensions(this.config);const t=this.getStyles({fill:"var(--primary-background-color)",stroke:"none","stroke-width":0});return this.applyColorStops(t),this.renderItemLayers(V`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <path
          ${this.actionHandler()}
          @action=${t=>this.handleAction(t)}
          class="rectangle-tool"
          d="${this.buildRoundedRectanglePath()}"
          style=${gt(this.getRenderStyles(t))}
        ></path>
      </g>
    `)}}class so extends Ea{static setConfig(t,e,i,s){return[...(t.layout?.lines??[]).map((t=>so.normalizeLineConfig(t,"lines"))),...(t.layout?.hlines??[]).map((t=>so.normalizeLineConfig(t,"hlines"))),...(t.layout?.vlines??[]).map((t=>so.normalizeLineConfig(t,"vlines")))].map(((t,a)=>new so(t,a,e,i,s)))}static normalizeLineConfig(t,e){let i=t.orientation??"horizontal";return"hlines"===e&&(i="horizontal"),"vlines"===e&&(i="vertical"),{...t,orientation:i,animation_section:e}}constructor(t,e,i,s,a){const r={orientation:"horizontal",length:10,xpos:50,ypos:50,...t};super(r,e,i,s,a,r.animation_section,r.animation_section,void 0,{fill:!1,stroke:!0}),this.validateOrientation(this.config.orientation),this.config.svg=this.calculateSvgDimensions()}updateRuntimeConfig(){super.updateRuntimeConfig(),this.configChanged&&(this.validateOrientation(this.config.orientation),this.config.svg=this.calculateSvgDimensions(this.config))}validateOrientation(t){if(!["horizontal","vertical","fromto"].includes(t))throw Error(`LineTool::validateOrientation - invalid orientation '${t}' [horizontal, vertical, fromto]`)}calculateSvgDimensions(t=this.config){if("fromto"===t.orientation){const e=t.start??{xpos:t.x1,ypos:t.y1},i=t.end??{xpos:t.x2,ypos:t.y2},s=this.card.cardLayout.calculateSvgCoordinatesInGroup({...t,xpos:e.xpos??e.x,ypos:e.ypos??e.y}),a=this.card.cardLayout.calculateSvgCoordinatesInGroup({...t,xpos:i.xpos??i.x,ypos:i.ypos??i.y});return{xpos:(s.xpos+a.xpos)/2,ypos:(s.ypos+a.ypos)/2,x1:s.xpos,y1:s.ypos,x2:a.xpos,y2:a.ypos}}const e=this.card.cardLayout.calculateSvgCoordinatesInGroup(t),i=eo.calculateSvgDimension(t.length);return"vertical"===t.orientation?{...e,length:i,x1:e.xpos,y1:e.ypos-i/2,x2:e.xpos,y2:e.ypos+i/2}:{...e,length:i,x1:e.xpos-i/2,y1:e.ypos,x2:e.xpos+i/2,y2:e.ypos}}render(){const t=this.getStyles({"stroke-linecap":"round",stroke:"var(--primary-text-color)",opacity:"1.0","stroke-width":"2"});return this.applyColorStops(t),this.renderItemLayers(V`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <line
          ${this.actionHandler()}
          @action=${t=>this.handleAction(t)}
          class="line-tool"
          x1="${this.config.svg.x1}"
          y1="${this.config.svg.y1}"
          x2="${this.config.svg.x2}"
          y2="${this.config.svg.y2}"
          style=${gt(this.getRenderStyles(t))}
        ></line>
      </g>
    `)}}class ao extends Ea{static setConfig(t,e,i,s){return(t.layout?.circles??[]).map(((t,a)=>new ao(t,a,e,i,s)))}constructor(t,e,i,s,a){super({radius:0,...t},e,i,s,a,"circles","circles",void 0,{fill:!1,stroke:!0}),this.config.svg=this.calculateSvgDimensions()}updateRuntimeConfig(){super.updateRuntimeConfig(),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config))}calculateSvgDimensions(t=this.config){const e=this.card.cardLayout.calculateSvgCoordinatesInGroup(t);return e.radius=void 0!==t.radius_percent?eo.calculateSvgDimension(t.radius_percent):t.radius,e}render(){const t=this.getStyles({});return this.applyColorStops(t),this.renderItemLayers(V`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <circle
          ${this.actionHandler()}
          @action=${t=>this.handleAction(t)}
          class="circle-tool"
          cx="${this.config.svg.xpos}"
          cy="${this.config.svg.ypos}"
          r="${this.config.svg.radius}"
          style=${gt(this.getRenderStyles(t))}
        ></circle>
      </g>
    `)}}class ro extends Ea{static setConfig(t,e,i,s){return(t.layout?.arcs??[]).map(((t,a)=>new ro(t,a,e,i,s)))}constructor(t,e,i,s,a){super({xpos:50,ypos:50,radius:45,arc_degrees:260,rotate:0,flip:"none",...t},e,i,s,a,"arcs","arcs",void 0,{fill:!0,stroke:!1}),this.config.svg=this.calculateSvgDimensions()}updateRuntimeConfig(){super.updateRuntimeConfig(),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config))}calculateSvgDimensions(t=this.config){const e=this.card.cardLayout.calculateSvgCoordinatesInGroup(t),i=eo.calculateSvgDimension(t.radius),s=Number(t.arc_degrees),a=90+(360-s)/2+Number(t.rotate),r=a+s,o=a*Math.PI/180,n=r*Math.PI/180;return e.radius=i,e.arcDegrees=s,e.largeArcFlag=Math.abs(s)>180?1:0,e.sweepFlag=s>=0?1:0,e.startX=e.xpos+i*Math.cos(o),e.startY=e.ypos+i*Math.sin(o),e.endX=e.xpos+i*Math.cos(n),e.endY=e.ypos+i*Math.sin(n),e}buildArcPath(){const t=this.config.svg;return Math.abs(t.arcDegrees)>=360?`\n        M ${t.xpos-t.radius} ${t.ypos}\n        A ${t.radius} ${t.radius} 0 1 1 ${t.xpos+t.radius} ${t.ypos}\n        A ${t.radius} ${t.radius} 0 1 1 ${t.xpos-t.radius} ${t.ypos}\n        Z\n      `:`\n      M ${t.startX} ${t.startY}\n      A ${t.radius} ${t.radius} 0 ${t.largeArcFlag} ${t.sweepFlag} ${t.endX} ${t.endY}\n      Z\n    `}render(){const t=this.getStyles({fill:"var(--primary-background-color)",stroke:"none","stroke-width":0});return this.applyColorStops(t),this.renderItemLayers(V`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <path
          ${this.actionHandler()}
          @action=${t=>this.handleAction(t)}
          class="arc-tool"
          d="${this.buildArcPath()}"
          style=${gt(this.getRenderStyles(t))}
        ></path>
      </g>
    `)}}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const oo=(t,e)=>{const i=t._$AN;if(void 0===i)return!1;for(const s of i)s._$AO?.(e,!1),oo(s,e);return!0},no=t=>{let e,i;do{if(void 0===(e=t._$AM))break;i=e._$AN,i.delete(t),t=e}while(0===i?.size)},lo=t=>{for(let e;e=t._$AM;t=e){let i=e._$AN;if(void 0===i)e._$AN=i=new Set;else if(i.has(t))break;i.add(t),uo(e)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ho(t){void 0!==this._$AN?(no(this),this._$AM=t,lo(this)):this._$AM=t}function co(t,e=!1,i=0){const s=this._$AH,a=this._$AN;if(void 0!==a&&0!==a.size)if(e)if(Array.isArray(s))for(let r=i;r<s.length;r++)oo(s[r],!1),no(s[r]);else null!=s&&(oo(s,!1),no(s));else oo(this,t)}const uo=t=>{t.type==ht&&(t._$AP??=co,t._$AQ??=ho)};class po extends dt{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,i){super._$AT(t,e,i),lo(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(oo(this,t),no(this))}setValue(t){if((t=>void 0===t.strings)(this._$Ct))this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}const go=new WeakMap,mo=ct(class extends po{render(t){return j}update(t,[e]){const i=e!==this.G;return i&&void 0!==this.G&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=e,this.ht=t.options?.host,this.rt(this.ct=t.element)),j}rt(t){if(this.isConnected||(t=void 0),"function"==typeof this.G){const e=this.ht??globalThis;let i=go.get(e);void 0===i&&(i=new WeakMap,go.set(e,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,t),void 0!==t&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return"function"==typeof this.G?go.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});class fo extends Ea{static setConfig(t,e,i,s){return(t.layout?.names??[]).map(((t,a)=>new fo(t,a,e,i,s)))}constructor(t,e,i,s,a){t.xpos=t.xpos??0,t.ypos=t.ypos??0,super(t,e,i,s,a,"names","names",0,{fill:!0,stroke:!1}),this.config.svg=this.calculateSvgDimensions(),this.name="",this.setTextElement=t=>{t&&(this.textElement=t)},this.textElementId=`${this.cardId}-name-${this.index}`,this.characterWidthFactor=.6,this.textFontSize=9,this.estimatedWidth=0,this.estimatedHeight=this.textFontSize,this.measuredWidth=0,this.measuredHeight=0,this.measuredXpos=this.config.svg.xpos,this.measuredYpos=this.config.svg.ypos,this.hasExactMeasurement=!1,this.textMeasurementSignature=""}updateRuntimeConfig(){super.updateRuntimeConfig(),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config))}setState(t,e){super.setState(t,e),this.name=this.textEllipsis(this.buildName(),this.config.max_characters??this.config.ellipsis);const i=this.getStyles({"font-size":"1.5em"}),s=`${this.name}|${JSON.stringify(i)}`;s!==this.textMeasurementSignature&&(this.textMeasurementSignature=s,this.estimatedWidth=this.name.length*this.textFontSize*this.characterWidthFactor,this.estimatedHeight=this.textFontSize,this.hasExactMeasurement=!1)}getWidth(){return this.hasExactMeasurement?this.measuredWidth:this.estimatedWidth}getHeight(){return this.hasExactMeasurement?this.measuredHeight:this.estimatedHeight}getXpos(){return this.hasExactMeasurement?this.measuredXpos:this.config.svg.xpos}getYpos(){return this.hasExactMeasurement?this.measuredYpos:this.config.svg.ypos}updated(){const t=this.textElement.getBBox(),e=.5*t.width,i=.5*t.height,s=t.x+t.width/2,a=t.y+t.height/2;this.textFontSize=.5*Number.parseFloat(window.getComputedStyle(this.textElement.firstElementChild).fontSize);if(!this.hasExactMeasurement||e!==this.measuredWidth||i!==this.measuredHeight||s!==this.measuredXpos||a!==this.measuredYpos){if(this.name.length>0){const t=e/this.name.length/this.textFontSize;this.characterWidthFactor=.8*this.characterWidthFactor+.2*t}this.measuredWidth=e,this.measuredHeight=i,this.measuredXpos=s,this.measuredYpos=a,this.hasExactMeasurement=!0,this.card.requestUpdate()}}calculateSvgDimensions(t=this.config){return this.card.cardLayout.calculateSvgCoordinatesInGroup(t)}buildName(){return this.entity.label?this.card._hass.localize(`ui.components.statistics_charts.statistic_types.${this.entity.label}`)||this.entity.label:this.entityConfig.name??this.entity.name??this.entity.attributes.friendly_name??this.entity?.entity_id??"?"}getTextParts(t){let e={};return t.includeStyles&&(e=this.getStyles({"font-size":"1.5em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"}),this.applyColorStops(e)),[{type:"name",value:this.name,entity_index:this.entity_index,styles:{...e,...da.toStyleDict(t.styles)}}]}render(){const[t]=this.getTextParts({includeStyles:!0,styles:{}});return this.renderItemLayers(V`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text ${mo(this.setTextElement)} id="${this.textElementId}" ${this.actionHandler()}
          @action=${t=>this.handleAction(t)}>
          <tspan
            class="entity__name"
            x="${this.config.svg.xpos}"
            y="${this.config.svg.ypos}"
            style=${gt(this.getRenderStyles(t.styles))}>
            ${t.value}</tspan>
        </text>
      </g>
    `)}}class yo extends Ea{static setConfig(t,e,i,s){return(t.layout?.areas??[]).map(((t,a)=>new yo(t,a,e,i,s)))}constructor(t,e,i,s,a){t.xpos=t.xpos??0,t.ypos=t.ypos??0,super(t,e,i,s,a,"areas","areas",0,{fill:!0,stroke:!1}),this.config.svg=this.calculateSvgDimensions(),this.area="",this.setTextElement=t=>{t&&(this.textElement=t)},this.textElementId=`${this.cardId}-area-${this.index}`,this.characterWidthFactor=.6,this.textFontSize=6,this.estimatedWidth=0,this.estimatedHeight=this.textFontSize,this.measuredWidth=0,this.measuredHeight=0,this.measuredXpos=this.config.svg.xpos,this.measuredYpos=this.config.svg.ypos,this.hasExactMeasurement=!1,this.textMeasurementSignature=""}updateRuntimeConfig(){super.updateRuntimeConfig(),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config))}setState(t,e){super.setState(t,e),this.area=this.textEllipsis(this.buildArea(),this.config.max_characters??this.config.ellipsis);const i=this.getStyles({"font-size":"1em"}),s=`${this.area}|${JSON.stringify(i)}`;s!==this.textMeasurementSignature&&(this.textMeasurementSignature=s,this.estimatedWidth=this.area.length*this.textFontSize*this.characterWidthFactor,this.estimatedHeight=this.textFontSize,this.hasExactMeasurement=!1)}getWidth(){return this.hasExactMeasurement?this.measuredWidth:this.estimatedWidth}getHeight(){return this.hasExactMeasurement?this.measuredHeight:this.estimatedHeight}getXpos(){return this.hasExactMeasurement?this.measuredXpos:this.config.svg.xpos}getYpos(){return this.hasExactMeasurement?this.measuredYpos:this.config.svg.ypos}updated(){const t=this.textElement.getBBox(),e=.5*t.width,i=.5*t.height,s=t.x+t.width/2,a=t.y+t.height/2;this.textFontSize=.5*Number.parseFloat(window.getComputedStyle(this.textElement.firstElementChild).fontSize);if(!this.hasExactMeasurement||e!==this.measuredWidth||i!==this.measuredHeight||s!==this.measuredXpos||a!==this.measuredYpos){if(this.area.length>0){const t=e/this.area.length/this.textFontSize;this.characterWidthFactor=.8*this.characterWidthFactor+.2*t}this.measuredWidth=e,this.measuredHeight=i,this.measuredXpos=s,this.measuredYpos=a,this.hasExactMeasurement=!0,this.card.requestUpdate()}}calculateSvgDimensions(t=this.config){return this.card.cardLayout.calculateSvgCoordinatesInGroup(t)}buildArea(){if(this.entityConfig.area)return this.entityConfig.area;if(!this.card._hass||!this.card._hass.areas)return"";const t=this.card._hass.entities&&this.card._hass.entities[this.entityConfig.entity];let e=t?t.area_id:null;if(!e&&t&&t.device_id&&this.card._hass.devices){const i=this.card._hass.devices[t.device_id];e=i?i.area_id:null}if(e){const t=this.card._hass.areas[e];return t?t.name:""}return"?"}getTextParts(t){let e={};return t.includeStyles&&(e=this.getStyles({"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"}),this.applyColorStops(e)),[{type:"area",value:this.area,entity_index:this.entity_index,styles:{...e,...da.toStyleDict(t.styles)}}]}render(){const[t]=this.getTextParts({includeStyles:!0,styles:{}});return this.renderItemLayers(V`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text ${mo(this.setTextElement)} id="${this.textElementId}" ${this.actionHandler()}
          @action=${t=>this.handleAction(t)}>
          <tspan
            class="entity__area"
            x="${this.config.svg.xpos}"
            y="${this.config.svg.ypos}"
            style=${gt(this.getRenderStyles(t.styles))}>
            ${t.value}</tspan>
        </text>
      </g>
    `)}}var vo=function(){return vo=Object.assign||function(t){for(var e,i=1,s=arguments.length;i<s;i++)for(var a in e=arguments[i])Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t},vo.apply(this,arguments)};var bo={second:45,minute:45,hour:22,day:5};const _o=_r((t=>new Intl.DateTimeFormat(t.language,{weekday:"long",month:"long",day:"numeric"}))),xo=_r((t=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"long",day:"numeric"}))),wo=_r((t=>new Intl.DateTimeFormat(t.language,{year:"numeric",month:"numeric",day:"numeric"}))),$o=(t,e)=>ko(e).format(t),ko=_r((t=>new Intl.DateTimeFormat(t.language,{day:"numeric",month:"short"}))),So=_r((t=>new Intl.DateTimeFormat(t.language,{month:"long",year:"numeric"}))),Mo=_r((t=>new Intl.DateTimeFormat(t.language,{month:"long"})));_r((t=>new Intl.DateTimeFormat(t.language,{year:"numeric"})));const Ao=_r((t=>new Intl.DateTimeFormat(t.language,{weekday:"long"}))),To=_r((t=>new Intl.DateTimeFormat(t.language,{weekday:"short"})));var Co;!function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(Co=Co||(Co={}));const Eo=_r((t=>{if(t.time_format===Co.language||t.time_format===Co.system){const e=t.time_format===Co.language?t.language:void 0,i=(new Date).toLocaleString(e);return i.includes("AM")||i.includes("PM")}return t.time_format===Co.am_pm})),Io=_r((t=>new Intl.DateTimeFormat("en"!==t.language||Eo(t)?t.language:"en-u-hc-h23",{hour:"numeric",minute:"2-digit",hour12:Eo(t)}))),Do=_r((t=>new Intl.DateTimeFormat("en"!==t.language||Eo(t)?t.language:"en-u-hc-h23",{hour:Eo(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:Eo(t)}))),zo=_r((t=>new Intl.DateTimeFormat("en"!==t.language||Eo(t)?t.language:"en-u-hc-h23",{weekday:"long",hour:Eo(t)?"numeric":"2-digit",minute:"2-digit",hour12:Eo(t)}))),Ro=t=>No().format(t),No=_r((()=>new Intl.DateTimeFormat("en-GB",{hour:"numeric",minute:"2-digit",hour12:!1}))),Po=_r((t=>new Intl.DateTimeFormat("en"!==t.language||Eo(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"long",day:"numeric",hour:Eo(t)?"numeric":"2-digit",minute:"2-digit",hour12:Eo(t)}))),Go=_r((t=>new Intl.DateTimeFormat("en"!==t.language||Eo(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"short",day:"numeric",hour:Eo(t)?"numeric":"2-digit",minute:"2-digit",hour12:Eo(t)}))),Fo=_r((t=>new Intl.DateTimeFormat("en"!==t.language||Eo(t)?t.language:"en-u-hc-h23",{month:"short",day:"numeric",hour:Eo(t)?"numeric":"2-digit",minute:"2-digit",hour12:Eo(t)}))),Bo=_r((t=>new Intl.DateTimeFormat("en"!==t.language||Eo(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"long",day:"numeric",hour:Eo(t)?"numeric":"2-digit",minute:"2-digit",second:"2-digit",hour12:Eo(t)}))),Oo=_r((t=>new Intl.DateTimeFormat("en"!==t.language||Eo(t)?t.language:"en-u-hc-h23",{year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"2-digit",hour12:Eo(t)}))),Ho=(t,e=2)=>{let i=`${t}`;for(let s=1;s<e;s++)i=parseInt(i)<10**s?`0${i}`:i;return i};const Vo={ms:1,s:1e3,min:6e4,h:36e5,d:864e5},Lo=(t,e)=>function(t){const e=Math.floor(t/1e3/3600),i=Math.floor(t/1e3%3600/60),s=Math.floor(t/1e3%3600%60),a=Math.floor(t%1e3);return e>0?`${e}:${Ho(i)}:${Ho(s)}`:i>0?`${i}:${Ho(s)}`:s>0||a>0?`${s}${a>0?`.${Ho(a,3)}`:""}`:null}(parseFloat(t)*Vo[e])||"0",jo=t=>{const e=Math.round(Math.min(Math.max(t,0),255)).toString(16);return 1===e.length?`0${e}`:e},qo=t=>`#${jo(t[0])}${jo(t[1])}${jo(t[2])}`,Uo=t=>{const[e,i,s]=t,a=Math.max(e,i,s),r=a-Math.min(e,i,s),o=r&&(a===e?(i-s)/r:a===i?2+(s-e)/r:4+(e-i)/r);return[60*(o<0?o+6:o),a&&r/a,a]},Wo=t=>{const[e,i,s]=t,a=t=>{const a=(t+e/60)%6;return s-s*i*Math.max(Math.min(a,4-a,1),0)};return[a(5),a(3),a(1)]},Yo=t=>Wo([t[0],t[1],255]),Xo=t=>{const e=t/100;return[Math.round(Jo(e)),Math.round(Zo(e)),Math.round(Ko(e))]},Jo=t=>{if(t<=66)return 255;return Ia(329.698727446*(t-60)**-.1332047592,0,255)},Zo=t=>{let e;return e=t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*(t-60)**-.0755148492,Ia(e,0,255)},Ko=t=>{if(t>=66)return 255;if(t<=19)return 0;const e=138.5177312231*Math.log(t-10)-305.0447927307;return Ia(e,0,255)},Qo=(t,e)=>{const i=Math.max(...t),s=Math.max(...e);let a;return a=0===s?0:i/s,e.map((t=>Math.round(t*a)))},tn=t=>0===t?1e6:Math.floor(1e6/t),en=(t,e,i)=>{const[s,a,r,o,n]=t,l=tn(e??2700),h=tn(i??6500),c=l-h;let d;try{d=n/(o+n)}catch(b){d=.5}const u=h+d*c,p=u?0===(g=u)?1e6:Math.floor(1e6/g):0;var g;const[m,f,y]=Xo(p),v=Math.max(o,n)/255;return Qo([s,a,r,o,n],[s+m*v,a+f*v,r+y*v])};class sn extends Ea{static setConfig(t,e,i,s){return(t.layout?.states??[]).map(((t,a)=>new sn(t,a,e,i,s)))}static buildState(t,e,i,s){if(void 0===t)return t;if(null===t)return t;if(e.convert){let a,r,o=e.convert.match(/(^\w+)\((\d+)\)/);switch(null===o?a=e.convert:3===o.length&&(a=o[1],r=Number(o[2])),a){case"brightness_pct":t="undefined"===t?"undefined":`${Math.round(t/255*100)}`;break;case"multiply":t=""+t*r;break;case"divide":t=""+t/r;break;case"rgb_csv":case"rgb_hex":if(e.attribute){let r=i.states[e.entity];switch(r.attributes.color_mode){case"unknown":case"onoff":case"brightness":case"white":break;case"color_temp":if(r.attributes.color_temp_kelvin){let e=Xo(r.attributes.color_temp_kelvin);const i=Uo(e);i[1]<.4&&(i[1]<.1?i[2]=225:i[1]=.4),e=Wo(i),e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===a?`${e[0]},${e[1]},${e[2]}`:qo(e)}else t="rgb_csv"===a?"255,255,255":"#ffffff00";break;case"hs":{let e=Yo([r.attributes.hs_color[0],r.attributes.hs_color[1]/100]);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===a?`${e[0]},${e[1]},${e[2]}`:qo(e)}break;case"rgb":{const e=Uo(s?.attributes?.rgb_color??r.attributes.rgb_color);e[1]<.4&&(e[1]<.1?e[2]=225:e[1]=.4);const i=Wo(e);t="rgb_csv"===a?i.toString():qo(i)}break;case"rgbw":{let e=(t=>{const[e,i,s,a]=t;return Qo([e,i,s,a],[e+a,i+a,s+a])})(r.attributes.rgbw_color);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===a?`${e[0]},${e[1]},${e[2]}`:qo(e)}break;case"rgbww":{let e=en(r.attributes.rgbww_color,r.attributes?.min_color_temp_kelvin,r.attributes?.max_color_temp_kelvin);e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===a?`${e[0]},${e[1]},${e[2]}`:qo(e)}break;case"xy":if(r.attributes.hs_color){let e=Yo([r.attributes.hs_color[0],r.attributes.hs_color[1]/100]);const i=Uo(e);i[1]<.4&&(i[1]<.1?i[2]=225:i[1]=.4),e=Wo(i),e[0]=Math.round(e[0]),e[1]=Math.round(e[1]),e[2]=Math.round(e[2]),t="rgb_csv"===a?`${e[0]},${e[1]},${e[2]}`:qo(e)}else if(r.attributes.color){let e={};e.l=r.attributes.brightness,e.h=r.attributes.color.h||r.attributes.color.hue,e.s=r.attributes.color.s||r.attributes.color.saturation;let{r:i,g:s,b:o}=la.hslToRgb(e);if("rgb_csv"===a)t=`${i},${s},${o}`;else{t=`#${la.padZero(i.toString(16))}${la.padZero(s.toString(16))}${la.padZero(o.toString(16))}`}}else r.attributes.xy_color}}break;default:console.error(`Unknown converter [${a}] specified for entity [${e.entity}]!`)}}return void 0!==t?Number.isNaN(t)?t:t.toString():void 0}constructor(t,e,i,s,a){t.xpos=t.xpos??0,t.ypos=t.ypos??0,t.show={uom:"end",...t.show??{}},super(t,e,i,s,a,"states","states",0,{fill:!0,stroke:!1}),this.config.svg=this.calculateSvgDimensions(),this.state="",this.uom="",this.setTextElement=t=>{t&&(this.textElement=t)},this.textElementId=`${this.cardId}-state-${this.index}`,this.characterWidthFactor=.6,this.textFontSize=6,this.uomFontSize=.6*this.textFontSize,this.measurementWidthBase=0,this.estimatedWidth=0,this.estimatedHeight=this.textFontSize,this.measuredWidth=0,this.measuredHeight=0,this.measuredXpos=this.config.svg.xpos,this.measuredYpos=this.config.svg.ypos,this.hasExactMeasurement=!1,this.textMeasurementSignature=""}updateRuntimeConfig(){super.updateRuntimeConfig(),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config))}setState(t,e){super.setState(t,e),this.buildStateAndUom();const i=this.getStyles({"font-size":"1em"}),s=this.getUomStyles(i,this.config.uom??{}),a=this.config.show.uom,r=`${this.state}|${this.uom}|${a}|${JSON.stringify(i)}|${JSON.stringify(s)}`;if(r!==this.textMeasurementSignature){this.textMeasurementSignature=r;const t=this.state.length*this.textFontSize,e=["end","top","bottom"].includes(a)?this.uom.length*this.uomFontSize:0;this.measurementWidthBase="end"===a?t+e:Math.max(t,e),this.estimatedWidth=this.measurementWidthBase*this.characterWidthFactor,this.estimatedHeight="top"===a||"bottom"===a?this.textFontSize+this.uomFontSize:this.textFontSize,this.hasExactMeasurement=!1}}getWidth(){return this.hasExactMeasurement?this.measuredWidth:this.estimatedWidth}getHeight(){return this.hasExactMeasurement?this.measuredHeight:this.estimatedHeight}getXpos(){return this.hasExactMeasurement?this.measuredXpos:this.config.svg.xpos}getYpos(){return this.hasExactMeasurement?this.measuredYpos:this.config.svg.ypos}updated(){const t=this.textElement.getBBox(),e=.5*t.width,i=.5*t.height,s=t.x+t.width/2,a=t.y+t.height/2;this.textFontSize=.5*Number.parseFloat(window.getComputedStyle(this.textElement.children[0]).fontSize);const r=this.config.show.uom,o=["end","top","bottom"].includes(r);this.uomFontSize=o?.5*Number.parseFloat(window.getComputedStyle(this.textElement.children[1]).fontSize):0;const n=this.state.length*this.textFontSize,l=o?this.uom.length*this.uomFontSize:0;this.measurementWidthBase="end"===r?n+l:Math.max(n,l);if(!this.hasExactMeasurement||e!==this.measuredWidth||i!==this.measuredHeight||s!==this.measuredXpos||a!==this.measuredYpos){if(this.measurementWidthBase>0){const t=e/this.measurementWidthBase;this.characterWidthFactor=.8*this.characterWidthFactor+.2*t}this.measuredWidth=e,this.measuredHeight=i,this.measuredXpos=s,this.measuredYpos=a,this.hasExactMeasurement=!0,this.card.requestUpdate()}}calculateSvgDimensions(t=this.config){return this.card.cardLayout.calculateSvgCoordinatesInGroup(t)}formatStateString(t){const e=this.config?.format||this.entityConfig?.format;if(this.entityConfig.debug&&console.log("StateTool.formatStateString",this.entityConfig.entity,t,e),"string"!=typeof e)return t;const i=this.card._hass.selectedLanguage||this.card._hass.language,s={...this.card._hass.locale,language:i};if(["relative","total","datetime","datetime-short","datetime-short_with-year","datetime_seconds","datetime-numeric","date","date_month","date_month_year","date-short","date-numeric","date_weekday","date_weekday_day","date_weekday-short","time","time-24h","time-24h_date-short","time_weekday","time_seconds"].includes(e)){const a=new Date(t);if(Number.isNaN(a.getTime()))return t;switch(e){case"relative":{const t=function(t,e,i){void 0===e&&(e=Date.now()),void 0===i&&(i={});var s=vo(vo({},bo),i||{}),a=(+t-+e)/1e3;if(Math.abs(a)<s.second)return{value:Math.round(a),unit:"second"};var r=a/60;if(Math.abs(r)<s.minute)return{value:Math.round(r),unit:"minute"};var o=a/3600;if(Math.abs(o)<s.hour)return{value:Math.round(o),unit:"hour"};var n=a/86400;if(Math.abs(n)<s.day)return{value:Math.round(n),unit:"day"};var l=new Date(t),h=new Date(e),c=l.getFullYear()-h.getFullYear();if(Math.round(Math.abs(c))>0)return{value:Math.round(c),unit:"year"};var d=12*c+l.getMonth()-h.getMonth();if(Math.round(Math.abs(d))>0)return{value:Math.round(d),unit:"month"};var u=a/604800;return{value:Math.round(u),unit:"week"}}(a,new Date);return new Intl.RelativeTimeFormat(i,{numeric:"auto"}).format(t.value,t.unit)}case"total":case"precision":return"Not Yet Supported";case"datetime":return((t,e)=>Po(e).format(t))(a,s);case"datetime-short":return((t,e)=>Fo(e).format(t))(a,s);case"datetime-short_with-year":return((t,e)=>Go(e).format(t))(a,s);case"datetime_seconds":return((t,e)=>Bo(e).format(t))(a,s);case"datetime-numeric":return((t,e)=>Oo(e).format(t))(a,s);case"date":return((t,e)=>xo(e).format(t))(a,s);case"date_month":return((t,e)=>Mo(e).format(t))(a,s);case"date_month_year":return((t,e)=>So(e).format(t))(a,s);case"date-short":return $o(a,s);case"date-numeric":return((t,e)=>wo(e).format(t))(a,s);case"date_weekday":return((t,e)=>Ao(e).format(t))(a,s);case"date_weekday-short":return((t,e)=>To(e).format(t))(a,s);case"date_weekday_day":return((t,e)=>_o(e).format(t))(a,s);case"time":return((t,e)=>Io(e).format(t))(a,s);case"time-24h":return Ro(a);case"time-24h_date-short":return Date.now()-a.getTime()<864e5?Ro(a):$o(a,s);case"time_weekday":return((t,e)=>zo(e).format(t))(a,s);case"time_seconds":return((t,e)=>Do(e).format(t))(a,s);default:return t}}return Number.isNaN(parseFloat(t))||!Number.isFinite(Number(t))?t:"brightness"===e||"brightness_pct"===e?`${Math.round(t/255*100)} %`:"duration"===e?Lo(t,"s"):t}formatEntityStateParts(){const t=void 0!==this.entityConfig.attribute,e="object"==typeof this.config?.format?this.config.format:"object"==typeof this.entityConfig.format?this.entityConfig.format:{};let i=t?this.entity.attributes[this.entityConfig.attribute]:this.entity.state;if(!0===e.raw_state_keep)return!0===e.raw_state_clean&&"string"==typeof i&&(i=i.replace(/_/g," ")),[{type:"value",value:i}];let s=sn.buildState(i,this.entityConfig,this.card._hass,this.entity);void 0===this.entityConfig?.format&&void 0===this.config?.format||(s=this.formatStateString(s));const a=this.entity.attributes.source_entity_id?{...this.entity,entity_id:this.entity.attributes.source_entity_id}:this.entity,r=t?this.card._hass.formatEntityAttributeValueToParts(a,this.entityConfig.attribute):this.card._hass.formatEntityStateToParts(a,s),o=(void 0!==this.entityConfig.decimals||void 0!==e.decimals_min||void 0!==e.decimals_max||void 0!==e.locale||void 0!==e.separator)&&!Number.isNaN(Number(s))&&null!==s&&""!==s;let n,l=-1;if(o){const t=void 0!==e.locale?e.locale:Or(this.card._hass.locale),i=this.card._hass.entities[a.entity_id],o=this.entity.attributes.source_entity_id?this.card._hass.states[this.entity.attributes.source_entity_id]:a,h=Lr(o.state,Vr(o,i)),c=void 0!==this.entityConfig.decimals?Number(this.entityConfig.decimals):h.maximumFractionDigits,d=e.decimals_max??c;let u=e.decimals_min??c;u>d&&(u=d),l=r.findIndex((t=>"value"===t.type&&/\p{Decimal_Number}/u.test(t.value)));const p=r.some(((t,e)=>e!==l&&"value"===t.type&&!/\p{Decimal_Number}/u.test(t.value)))?Math.abs(Number(s)):Number(s);n=new Intl.NumberFormat(t,{useGrouping:!1!==e.separator,minimumFractionDigits:u,maximumFractionDigits:d}).format(p)}return r.map(((t,e)=>e===l&&void 0!==n?{...t,value:n}:"unit"===t.type&&void 0!==this.entityConfig.unit?{...t,value:this.entityConfig.unit}:t))}buildStateAndUom(){const t=this.formatEntityStateParts(),e=t.filter((t=>"unit"!==t.type)).map((t=>t.value)).join(""),i=t.find((t=>"unit"===t.type))?.value??"";this.state=this.textEllipsis(e.trim(),this.config.max_characters??this.config.ellipsis),this.uom=this.buildUom(i.trim())}buildUom(t){return this.entityConfig.unit||t||""}getUomStyles(t,e){const i=da.toStyleDict(e.styles),s=t["font-size"];let a=.5,r="em";const o=String(s).trim().match(/^(\d*\.?\d+)([a-z%]+)$/i);return o?(a=.6*Number(o[1]),r=o[2]):console.error("Cannot determine font-size for state",s),{...t,opacity:"0.7","font-size":`${a}${r}`,...i}}getTextParts(t){let e={};t.includeStyles&&(e=this.getStyles({"font-size":"1em",color:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle"}),this.applyColorStops(e)),e={...e,...da.toStyleDict(t.styles)};const i=this.config.uom??{},s=t.uom??{},a={...i,...s,styles:{...t.includeStyles?da.toStyleDict(i.styles):{},...da.toStyleDict(s.styles)}},r=t.show?.uom??this.config.show.uom,o=[{type:"value",value:this.state,entity_index:this.entity_index,styles:e}];if(!["end","top","bottom"].includes(r))return o;const n={"font-size":"1em",...e},l={type:"unit",value:this.uom,entity_index:this.entity_index,styles:this.getUomStyles(n,a),uom_position:r};return"end"===r?(l.dx=a.dx??"0.1",l.dy=a.dy??"-0.45"):(l.new_line=!0,l.dy=a.dy??("bottom"===r?"1.5":"-1.5")),o.push(l),o}render(){const t=this.getTextParts({includeStyles:!0,styles:{},uom:{},show:this.config.show}),e=t[0],i=t[1],s=this.config.dx?this.config.dx:"0",a=this.config.dy?this.config.dy:"0";let r=V``;return"end"===i?.uom_position?r=V`<tspan
        class="state__uom"
        dx="${i.dx}em"
        dy="${i.dy}em"
        style=${gt(this.getRenderStyles(i.styles))}
      >${i.value}</tspan>`:("bottom"===i?.uom_position||"top"===i?.uom_position)&&(r=V`<tspan
        class="state__uom"
        x="${this.config.svg.xpos}"
        dy="${i.dy}em"
        style=${gt(this.getRenderStyles(i.styles))}
      >${i.value}</tspan>`),this.renderItemLayers(V`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text ${mo(this.setTextElement)} id="${this.textElementId}" ${this.actionHandler()}
          @action=${t=>this.handleAction(t)}>
          <tspan
            class="state__value"
            x="${this.config.svg.xpos}"
            y="${this.config.svg.ypos}"
            dx="${s}em"
            dy="${a}em"
            style=${gt(this.getRenderStyles(e.styles))}
          >${e.value}</tspan>${r}
        </text>
      </g>
    `)}}const an={name:"names",area:"areas",state:"states"};class rn extends Ea{static setConfig(t,e,i,s){return(t.layout?.texts??[]).map(((t,a)=>new rn(t,a,e,i,s)))}constructor(t,e,i,s,a){const r=(Array.isArray(t.text)?t.text:[t.text]).map((e=>{const i="object"==typeof e?e:{value:e};return{type:"text",...i.new_line?{dy:1.2}:{},...void 0===t.localize_tag||Array.isArray(t.text)?{}:{localize_tag:t.localize_tag},...i}})),o={tap_action:{action:"none"},...t};if("wrap"===o.text_overflow?.mode||"ellipsis"===o.text_overflow?.mode){const t=o.text_overflow[o.text_overflow.mode];if(void 0!==t.characters===(void 0!==t.max_width))throw new Error(`[texts] text_overflow.${o.text_overflow.mode} requires exactly one of characters or max_width`)}"wrap"===o.text_overflow?.mode&&void 0===o.text_overflow.wrap.dy&&(o.text_overflow={...o.text_overflow,wrap:{dy:1.2,...o.text_overflow.wrap}}),delete o.text,delete o.localize_tag,super(o,e,i,s,a,"texts","texts",void 0,{fill:!0,stroke:!1}),this.sourceTextParts=r,this.textPartsHaveJavascript=this.sourceTextParts.some((t=>this.templates.hasJavascriptTemplates(t))),this.activeTextParts=[],this.activeTextPartsSignature=void 0,this.textParts=[],this.config.svg=this.calculateSvgDimensions(),this.setTextElement=t=>{t&&(this.textElement=t)},this.textElementId=`${this.cardId}-text-${this.index}`,this.textFitScale=1,this.widthMeasurementParts=[],this.widthMeasurementElements=[],this.widthEllipsisElements=[],this.widthOverflowParts=[],this.widthOverflowSourceSignature=void 0,this.widthOverflowMeasurementSignature=void 0,this.widthOverflowPending=!1,this.widthMeasurementScheduled=!1,this.characterWidthFactor=.6,this.textFontSize=6,this.estimatedWidth=0,this.estimatedHeight=this.textFontSize,this.measuredWidth=0,this.measuredHeight=0,this.measuredXpos=this.config.svg.xpos,this.measuredYpos=this.config.svg.ypos,this.hasExactMeasurement=!1,this.textMeasurementSignature="";const n={name:fo,area:yo,state:sn};this.inlineTextSourceTools=this.sourceTextParts.map(((t,e)=>{if(!an[t.type]||void 0!==t.id)return;return new(0,n[t.type])(bt.mergeDeep({id:`${this.id}-source-${e}`,entity_index:t.entity_index??this.entity_index,xpos:0,ypos:0},t),e,this.templates,this.cardId,this.card)})),this.sourceTextParts.forEach((t=>{an[t.type]&&void 0!==t.id&&this.getReferencedTextTool(t)}))}getReferencedTextTool(t){const e=an[t.type],i=this.card.cardTools.getBySection(e).find((e=>String(e.id)===String(t.id)));if(!i)throw new Error(`[texts] ${t.type} source '${t.id}' not found for text '${this.id}'`);return i}getTextSourceTool(t,e){return void 0!==t.inline_source_index?this.inlineTextSourceTools[t.inline_source_index]:void 0===t.id?this.inlineTextSourceTools[e]:this.getReferencedTextTool(t)}updateRuntimeConfig(){if(super.updateRuntimeConfig(),this.inlineTextSourceTools.filter((t=>void 0!==t)).forEach((t=>t.updateRuntimeConfig())),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config)),void 0===this.activeTextPartsSignature||this.configChanged||this.textPartsHaveJavascript&&this.card.evaluateJavascriptTemplates){const t=this.sourceTextParts.map(((t,e)=>{const i=an[t.type]?this.getTextSourceTool(t,e):void 0,s={...t,id:t.id??this.config.id,inline_source_index:void 0===t.id&&i?e:void 0,entity_index:i?i.entity_index:t.entity_index??this.config.entity_index},a=this.templates.hasJavascriptTemplates(t)?this.templates.getJsTemplateOrValue(s,s,{resolveKeys:!0}):s;return a.color_stops&&(a.colorstops=xa.normalize(a.color_stops,this.card.cardTheme.getActiveColorStopMode())),(a.color_stops||["colorstop","colorstopinterpolated"].includes(a.show?.item_style))&&this.normalizeLayoutItemColorStopMode(a),a})),e=JSON.stringify(t);e!==this.activeTextPartsSignature&&(this.activeTextParts=t,this.activeTextPartsSignature=e,this.configChanged=!0)}}setState(t,e){super.setState(t,e);const i=this.activeTextParts.flatMap(((t,e)=>{const i=an[t.type]?this.getTextSourceTool(t,e):void 0;void 0!==t.inline_source_index&&(i.entity_index=t.entity_index,i.config.entity_index=t.entity_index,i.setState(this.card.entities[t.entity_index],this.card.resolvedEntityConfigs[t.entity_index]));const s=i?i.entity_index:t.entity_index,a=this.card.entities[s],r=t.state_map?.map,o=r?r.find((t=>String(t.state)===String(a.state)))??r.find((t=>"default"===t.state)):void 0,n=o?bt.mergeDeep(t,o):{...t};if(void 0!==n.localize_tag&&(n.value=this.card._hass.localize(n.localize_tag)),n.color_stops&&(n.colorstops=xa.normalize(n.color_stops,this.card.cardTheme.getActiveColorStopMode())),(n.color_stops||["colorstop","colorstopinterpolated"].includes(n.show?.item_style))&&this.normalizeLayoutItemColorStopMode(n),i){const t={includeStyles:!1!==n.source_styles,styles:n.styles,uom:n.uom,show:n.show};return i.getTextParts(t).map(((e,s)=>{const a={...e,entity_index:i.entity_index,animation_id:n.animation_id,colorstops:n.colorstops,show:n.show,colorstop:n.colorstop,colorstopinterpolated:n.colorstopinterpolated,ellipsis:n.ellipsis,source_reference:{type:n.type,id:n.id,inline_source_index:n.inline_source_index,part_index:s,options:t}};return 0===s&&(void 0!==n.new_line&&(a.new_line=n.new_line),void 0!==n.dx&&(a.dx=n.dx),void 0!==n.dy&&(a.dy=n.dy)),a.value=this.textEllipsis(String(a.value),a.ellipsis),a}))}return n.value=this.textEllipsis(String(n.value),n.ellipsis),[n]})),s=this.config.text_overflow,a=s?.wrap,r=s?.ellipsis,o="wrap"===s?.mode?a:r;let n,l=i;if(("wrap"===s?.mode||"ellipsis"===s?.mode)&&void 0!==o.max_width){const t=[];i.forEach((e=>{let i=!0;Array.from(String(e.value).matchAll(/\s+|\S+/g),(t=>t[0])).forEach((s=>{const a={...e,value:s};i||(delete a.new_line,delete a.dx,delete a.dy),t.push(a),i=!1}))}));const e=`${JSON.stringify(t)}|${JSON.stringify(s)}`;e!==this.widthOverflowSourceSignature&&(this.widthMeasurementParts=t,this.widthOverflowSourceSignature=e,this.widthOverflowMeasurementSignature=void 0,this.widthOverflowPending=!0),l=this.widthOverflowParts}else{if(this.widthMeasurementParts=[],this.widthOverflowParts=[],this.widthOverflowSourceSignature=void 0,this.widthOverflowMeasurementSignature=void 0,this.widthOverflowPending=!1,"wrap"===s?.mode){const t=[];let e=0,s=1,r=[],o=!1;if(i.forEach((i=>{if(o)return;let n=!1;i.new_line&&(r=[],a.max_lines&&s>=a.max_lines?(n=!0,r.push({...i,value:" "})):(s+=1,e=0));let l=!0;Array.from(String(i.value).matchAll(/\s+|\S+/g),(t=>t[0])).forEach((h=>{if(o)return;if(/^\s+$/.test(h))return void(e>0&&r.push({...i,value:h}));const c=r.reduce(((t,e)=>t+e.value.length),0),d=e>0&&c>0&&e+c+h.length>a.characters,u=!a.max_lines||s<a.max_lines,p=d&&u,g=d&&!u||n,m={...i,value:h};p?(r=[],s+=1,e=0,m.new_line=!0,m.dy=a.dy,delete m.dx):(0===e&&(r=[]),r.forEach((i=>{delete i.new_line,delete i.dx,delete i.dy,t.push(i),e+=i.value.length})),r=[],l&&!n||(delete m.new_line,delete m.dx,delete m.dy)),t.push(m),e+=h.length,l=!1,g&&(o=!0)}))})),o){let e=0;t.forEach(((t,i)=>{t.new_line&&(e=i)}));const i=t.splice(e);let s=a.characters-3,r=!1;i.forEach((e=>{if(!r){if(e.value.length<=s)return t.push(e),void(s-=e.value.length);t.push({...e,value:`${e.value.slice(0,s)}...`}),r=!0}}))}l=t}n="ellipsis"===s?.mode?r.characters:"wrap"===s?.mode&&a.max_lines?a.characters:this.config.ellipsis}let h=n,c=!1;const d=[];l.forEach((t=>{if(t.new_line&&(h=n,c=!1),!c){if(h&&t.value.length>h)return d.push({...t,value:this.textEllipsis(t.value,h)}),h=0,void(c=!0);d.push(t),h&&(h-=t.value.length),0===h&&n&&(c=!0)}})),this.textParts=d;const u=[0];this.textParts.forEach((t=>{t.new_line&&u.push(0),u[u.length-1]+=t.value.length}));const p=this.getStyles({"font-size":"1em"}),g=`${JSON.stringify(this.textParts)}|${JSON.stringify(p)}|${JSON.stringify(s)}`;if(g!==this.textMeasurementSignature){this.textMeasurementSignature=g,this.estimatedWidth=Math.max(...u)*this.textFontSize*this.characterWidthFactor;const t="wrap"===s?.mode?a.dy:1.2;this.estimatedHeight=this.textFontSize+(u.length-1)*this.textFontSize*t}}getWidth(){return this.hasExactMeasurement?this.measuredWidth:this.estimatedWidth}getHeight(){return this.hasExactMeasurement?this.measuredHeight:this.estimatedHeight}getXpos(){return this.hasExactMeasurement?this.measuredXpos:this.config.svg.xpos}getYpos(){return this.hasExactMeasurement?this.measuredYpos:this.config.svg.ypos}calculateTextPartsForMeasuredWidth(t,e){const i=this.config.text_overflow,s="wrap"===i.mode?i.wrap:i.ellipsis,a=this.widthMeasurementParts.map(((i,s)=>({part:i,index:s,width:t[s],ellipsisWidth:e[s],characters:[...String(i.value)],element:this.widthMeasurementElements[s]}))),r=(t,e)=>{const i=t.reduce(((t,e)=>t+e.width),0);if(!e&&i<=s.max_width)return t.map((t=>t.part));let a=0,r=t.reduce(((t,e)=>t+e.characters.length),0),o=0;for(;a<=r;){const e=Math.floor((a+r)/2);let i=e,n=0,l=t[0];t.some((t=>(l=t,i>=t.characters.length?(n+=t.width,i-=t.characters.length,!1):(n+=.5*t.element.getSubStringLength(0,i),i=0,!0)))),n+=l.ellipsisWidth,n<=s.max_width?(o=e,a=e+1):r=e-1}const n=[];let l=o,h=!1;if(t.forEach((t=>{if(!h){if(l>=t.characters.length)return n.push(t.part),void(l-=t.characters.length);n.push({...t.part,value:t.characters.slice(0,l).join("").concat("...")}),h=!0}})),!h){const t=n.pop();n.push({...t,value:String(t.value).concat("...")})}return n};if("ellipsis"===i.mode){const t=[];let e=[];return a.forEach((i=>{i.part.new_line&&e.length>0&&(t.push(...r(e,!1)),e=[]),e.push(i)})),t.push(...r(e,!1)),t}const o=[];let n=0,l=1,h=[],c=!1;for(let d=0;d<a.length;d+=1){const t=a[d];if(t.part.new_line){if(h=[],s.max_lines&&l>=s.max_lines){c=!0;break}l+=1,n=0}if(/^\s+$/.test(t.part.value))n>0&&h.push(t);else{const e=h.reduce(((t,e)=>t+e.width),0);if(n>0&&n+e+t.width>s.max_width){if(s.max_lines&&l>=s.max_lines){c=!0;break}const e={...t.part,new_line:!0,dy:s.dy};delete e.dx,o.push({...t,part:e}),h=[],l+=1,n=t.width}else h.forEach((t=>{const e={...t.part};delete e.new_line,delete e.dx,delete e.dy,o.push({...t,part:e}),n+=t.width})),h=[],o.push(t),n+=t.width}}if(c){let t=0;o.forEach(((e,i)=>{e.part.new_line&&(t=i)}));const e=o.splice(t),i=r(e,!0);return[...o.map((t=>t.part)),...i]}return o.map((t=>t.part))}setStaticState(){this.setState(void 0,void 0)}updated(){if(this.widthMeasurementParts.length>0&&this.widthOverflowPending){if(!this.widthMeasurementScheduled){this.widthMeasurementScheduled=!0;const t=this.widthOverflowSourceSignature;document.fonts.ready.then((async()=>{let e,i,s;for(let a=0;a<5&&(await new Promise(requestAnimationFrame),t===this.widthOverflowSourceSignature);a+=1){e=this.widthMeasurementElements.map((t=>Number((.5*t.getComputedTextLength()).toFixed(4)))),i=this.widthEllipsisElements.map((t=>Number((.5*t.getComputedTextLength()).toFixed(4))));const t=`${JSON.stringify(e)}|${JSON.stringify(i)}`;if(e.some((t=>t>0))&&t===s)break;s=t}this.widthMeasurementScheduled=!1,t===this.widthOverflowSourceSignature&&(this.widthOverflowParts=this.calculateTextPartsForMeasuredWidth(e,i),this.textParts=this.widthOverflowParts,this.widthOverflowMeasurementSignature=`${this.widthOverflowSourceSignature}|${JSON.stringify(e)}|${JSON.stringify(i)}`,this.widthOverflowPending=!1),this.card.requestUpdate()}))}return}if(this.widthMeasurementParts.length>0){const t=.5,e=this.widthMeasurementElements.map((e=>Number((e.getComputedTextLength()*t).toFixed(4)))),i=this.widthEllipsisElements.map((e=>Number((e.getComputedTextLength()*t).toFixed(4)))),s=`${this.widthOverflowSourceSignature}|${JSON.stringify(e)}|${JSON.stringify(i)}`;if(s!==this.widthOverflowMeasurementSignature)return this.widthOverflowParts=this.calculateTextPartsForMeasuredWidth(e,i),this.textParts=this.widthOverflowParts,this.widthOverflowMeasurementSignature=s,void this.card.requestUpdate()}const t=this.textElement.getAttribute("transform");this.textElement.removeAttribute("transform");const e=this.textElement.getBBox();this.textElement.setAttribute("transform",t);const i=.5*e.width,s=.5*e.height,a=e.x+e.width/2,r=e.y+e.height/2,o=this.config.text_overflow,n=o?.fit,l=Number.parseFloat(window.getComputedStyle(this.textElement).fontSize);let h=1;if(this.textFontSize=.5*Number.parseFloat(window.getComputedStyle(this.textElement.firstElementChild).fontSize),"fit"===o?.mode&&i>n.max_width&&(h=n.max_width/i,void 0!==n.min_font_size)){const t=Number.parseFloat(window.getComputedStyle(this.textElement.parentElement).fontSize),e=Number.parseFloat(n.min_font_size)*t/l;h=Math.min(1,Math.max(h,e))}const c=i*h,d=s*h,u=this.config.svg.xpos+(a-this.config.svg.xpos)*h,p=this.config.svg.ypos+(r-this.config.svg.ypos)*h,g=1e-4,m=Math.abs(h-this.textFitScale)>g,f=!this.hasExactMeasurement||Math.abs(c-this.measuredWidth)>g||Math.abs(d-this.measuredHeight)>g||Math.abs(u-this.measuredXpos)>g||Math.abs(p-this.measuredYpos)>g;if(m||f){const t=this.textParts.reduce(((t,e)=>t+e.value.length),0);if(t>0){const e=i/t/this.textFontSize;this.characterWidthFactor=.8*this.characterWidthFactor+.2*e}this.textFitScale=h,this.measuredWidth=c,this.measuredHeight=d,this.measuredXpos=u,this.measuredYpos=p,this.hasExactMeasurement=!0,this.card.requestUpdate()}}calculateSvgDimensions(t=this.config){return this.card.cardLayout.calculateSvgCoordinatesInGroup(t)}render(){const t=[this.config.tap_action,this.config.hold_action,this.config.double_tap_action].some((t=>{if(!t)return!1;return(t.actions??[t]).some((t=>"none"!==t.action))})),e=this.getStyles({"font-size":"1em",fill:"var(--primary-text-color)",opacity:"1.0","text-anchor":"middle","dominant-baseline":"middle","pointer-events":t?"auto":"none"});this.applyColorStops(e);const i="fit"===this.config.text_overflow?.mode?`translate(${this.config.svg.xpos} ${this.config.svg.ypos}) scale(${this.textFitScale}) translate(-${this.config.svg.xpos} -${this.config.svg.ypos})`:"",s=t=>{let e=t;if(t.source_reference){const i=this.getTextSourceTool(t.source_reference,t.source_reference.inline_source_index).getTextParts(t.source_reference.options)[t.source_reference.part_index];e={...t,styles:i.styles}}const i=da.toStyleDict(e.styles),s=da.toStyleDict(this.card.cardAnimations.styles.texts[e.animation_id]??{});return this.applyColorStops(i,e),{...e,renderStyles:this.getRenderStyles({...i,...s})}},a=this.textParts.map((t=>s(t))),r=this.widthMeasurementParts.map((t=>s(t))),o={...e,opacity:"0","pointer-events":"none","white-space":"pre"};return this.widthMeasurementElements=new Array(r.length),this.widthEllipsisElements=new Array(r.length),this.renderItemLayers(V`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <text
          ${mo(this.setTextElement)}
          id="${this.textElementId}"
          transform="${i}"
          x="${this.config.svg.xpos}"
          y="${this.config.svg.ypos}"
          dominant-baseline="${e["dominant-baseline"]}"
          style=${gt(this.getRenderStyles(e))}
          ${this.actionHandler()}
          @action=${t=>this.handleAction(t)}
          visibility="${this.widthOverflowPending&&0===this.widthOverflowParts.length?"hidden":"visible"}"
        >${a.map((t=>{const i=t.dx??0,s=t.dy??0;return t.new_line?V`<tspan
                class="text-tool__part"
                x="${this.config.svg.xpos}"
                dx="${i}em"
                dy="${s}em"
                dominant-baseline="${e["dominant-baseline"]}"
                style=${gt(t.renderStyles)}
              >${t.value}</tspan>`:V`<tspan
                class="text-tool__part"
                dx="${i}em"
                dy="${s}em"
                dominant-baseline="${e["dominant-baseline"]}"
                style=${gt(t.renderStyles)}
              >${t.value}</tspan>`}))}</text>
        ${r.length>0?V`
          <text
            class="text-tool__measurement"
            x="${this.config.svg.xpos}"
            y="${this.config.svg.ypos}"
            pointer-events="none"
            aria-hidden="true"
            style=${gt(this.getRenderStyles(o))}
          >${r.map(((t,e)=>V`
            <tspan
              ${mo((t=>{t&&(this.widthMeasurementElements[e]=t)}))}
              style=${gt(t.renderStyles)}
            >${t.value}</tspan>
            <tspan
              ${mo((t=>{t&&(this.widthEllipsisElements[e]=t)}))}
              style=${gt(t.renderStyles)}
            >...</tspan>
          `))}</text>
        `:""}
      </g>
    `)}}function on(t,e,i){if(i||2===arguments.length)for(var s,a=0,r=e.length;a<r;a++)!s&&a in e||(s||(s=Array.prototype.slice.call(e,0,a)),s[a]=e[a]);return t.concat(s||Array.prototype.slice.call(e))}"function"==typeof SuppressedError&&SuppressedError;var nn,ln={};
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */var hn=function(){if(nn)return ln;nn=1;var t=/; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g,e=/^[\u000b\u0020-\u007e\u0080-\u00ff]+$/,i=/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/,s=/\\([\u000b\u0020-\u00ff])/g,a=/([\\"])/g,r=/^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;function o(t){var s=String(t);if(i.test(s))return s;if(s.length>0&&!e.test(s))throw new TypeError("invalid parameter value");return'"'+s.replace(a,"\\$1")+'"'}function n(t){this.parameters=Object.create(null),this.type=t}return ln.format=function(t){if(!t||"object"!=typeof t)throw new TypeError("argument obj is required");var e=t.parameters,s=t.type;if(!s||!r.test(s))throw new TypeError("invalid type");var a=s;if(e&&"object"==typeof e)for(var n,l=Object.keys(e).sort(),h=0;h<l.length;h++){if(n=l[h],!i.test(n))throw new TypeError("invalid parameter name");a+="; "+n+"="+o(e[n])}return a},ln.parse=function(e){if(!e)throw new TypeError("argument string is required");var i="object"==typeof e?function(t){var e;"function"==typeof t.getHeader?e=t.getHeader("content-type"):"object"==typeof t.headers&&(e=t.headers&&t.headers["content-type"]);if("string"!=typeof e)throw new TypeError("content-type header is missing from object");return e}(e):e;if("string"!=typeof i)throw new TypeError("argument string is required to be a string");var a=i.indexOf(";"),o=-1!==a?i.slice(0,a).trim():i.trim();if(!r.test(o))throw new TypeError("invalid media type");var l=new n(o.toLowerCase());if(-1!==a){var h,c,d;for(t.lastIndex=a;c=t.exec(i);){if(c.index!==a)throw new TypeError("invalid parameter format");a+=c[0].length,h=c[1].toLowerCase(),34===(d=c[2]).charCodeAt(0)&&-1!==(d=d.slice(1,-1)).indexOf("\\")&&(d=d.replace(s,"$1")),l.parameters[h]=d}if(a!==i.length)throw new TypeError("invalid parameter format")}return l},ln}(),cn=new Map,dn=function(t){return t.cloneNode(!0)},un=function(){return"file:"===window.location.protocol},pn=function(t,e,i){var s=new XMLHttpRequest;s.onreadystatechange=function(){try{if(!/\.svg/i.test(t)&&2===s.readyState){var e=s.getResponseHeader("Content-Type");if(!e)throw new Error("Content type not found");var a=hn.parse(e).type;if("image/svg+xml"!==a&&"text/plain"!==a)throw new Error("Invalid content type: ".concat(a))}if(4===s.readyState){if(404===s.status||null===s.responseXML)throw new Error(un()?"Note: SVG injection ajax calls do not work locally without adjusting security settings in your browser. Or consider using a local webserver.":"Unable to load SVG file: "+t);if(!(200===s.status||un()&&0===s.status))throw new Error("There was a problem injecting the SVG: "+s.status+" "+s.statusText);i(null,s)}}catch(r){if(s.abort(),!(r instanceof Error))throw r;i(r,s)}},s.open("GET",t),s.withCredentials=e,s.overrideMimeType&&s.overrideMimeType("image/svg+xml"),s.send()},gn={},mn=function(t,e){var i;null!==(i=gn[t])&&void 0!==i||(gn[t]=[]),gn[t].push(e)},fn=function(t,e,i){if(cn.has(t)){var s=cn.get(t);if(void 0===s)return void mn(t,i);if(s instanceof SVGSVGElement)return void i(null,dn(s))}cn.set(t,void 0),mn(t,i),pn(t,e,(function(e,i){var s;e?cn.set(t,e):(null===(s=i.responseXML)||void 0===s?void 0:s.documentElement)instanceof SVGSVGElement&&cn.set(t,i.responseXML.documentElement),function(t){var e=gn[t];if(e)for(var i=function(i,s){setTimeout((function(){if(Array.isArray(gn[t])){var s=cn.get(t),a=e[i];if(!a)return;s instanceof SVGSVGElement&&a(null,dn(s)),s instanceof Error&&a(s),i===e.length-1&&delete gn[t]}}),0)},s=0,a=e.length;s<a;s++)i(s)}(t)}))},yn=function(t,e,i){pn(t,e,(function(t,e){var s;t?i(t):(null===(s=e.responseXML)||void 0===s?void 0:s.documentElement)instanceof SVGSVGElement&&i(null,e.responseXML.documentElement)}))},vn="data:image/svg+xml",bn=0,_n=[],xn={},wn="http://www.w3.org/1999/xlink",$n=function(t,e,i,s,a,r,o){var n,l=null!==(n=t.getAttribute("data-src"))&&void 0!==n?n:t.getAttribute("src");if(l){if(-1!==_n.indexOf(t))return _n.splice(_n.indexOf(t),1),void(t=null);_n.push(t),t.setAttribute("src","");var h=l.indexOf("#"),c=-1!==h?l.slice(0,h):l,d=-1!==h?l.slice(h+1):null,u=function(t){if(!t.startsWith(vn))return null;var e,i=t.slice(18);if(i.startsWith(";base64,"))try{e=atob(i.slice(8))}catch(n){return new Error("Invalid base64 in data URL")}else if(i.startsWith(","))try{e=decodeURIComponent(i.slice(1))}catch(r){return new Error("Invalid encoding in data URL")}else{if(!i.startsWith(";charset=utf-8,"))return new Error("Unsupported data URL format");try{e=decodeURIComponent(i.slice(15))}catch(o){return new Error("Invalid encoding in data URL")}}var s=(new DOMParser).parseFromString(e,"image/svg+xml"),a=s.querySelector("parsererror");return a?new Error("Data URL SVG parse error: "+a.textContent.trim()):s.documentElement instanceof SVGSVGElement?s.documentElement:new Error("Data URL did not contain a valid SVG element")}(c);if(u instanceof Error)return _n.splice(_n.indexOf(t),1),t=null,void o(u);var p=function(s,a){var n,h;if(!a)return _n.splice(_n.indexOf(t),1),t=null,void o(s);var u=a;if(d){var p=function(t,e){var i=t.querySelector("#"+CSS.escape(e));if("symbol"!==(null==i?void 0:i.tagName.toLowerCase()))return null;for(var s=document.createElementNS("http://www.w3.org/2000/svg","svg"),a=i.attributes,r=0,o=a.length;r<o;r++){var n=a[r];"id"!==n.name&&s.setAttribute(n.name,n.value)}var l=i.childNodes;for(r=0,o=l.length;r<o;r++)s.appendChild(l[r].cloneNode(!0));return s}(a,d);if(!p)return _n.splice(_n.indexOf(t),1),t=null,void o(new Error('Symbol "'.concat(d,'" not found in ').concat(c)));u=p}var g=t.getAttribute("id");g&&u.setAttribute("id",g);var m=t.getAttribute("title");m&&u.setAttribute("title",m);var f=t.getAttribute("width");f&&u.setAttribute("width",f);var y=t.getAttribute("height");y&&u.setAttribute("height",y);var v=Array.from(new Set(on(on(on([],(null!==(n=u.getAttribute("class"))&&void 0!==n?n:"").split(" "),!0),["injected-svg"],!1),(null!==(h=t.getAttribute("class"))&&void 0!==h?h:"").split(" "),!0))).join(" ").trim();u.setAttribute("class",v);var b=t.getAttribute("style");b&&u.setAttribute("style",b),u.setAttribute("data-src",l);var _=[].filter.call(t.attributes,(function(t){return/^data-\w[\w-]*$/.test(t.name)}));if(Array.prototype.forEach.call(_,(function(t){t.name&&t.value&&u.setAttribute(t.name,t.value)})),i){var x,w,$,k,S,M={clipPath:["clip-path"],"color-profile":["color-profile"],cursor:["cursor"],filter:["filter"],linearGradient:["fill","stroke"],marker:["marker","marker-start","marker-mid","marker-end"],mask:["mask"],path:[],pattern:["fill","stroke"],radialGradient:["fill","stroke"]},A=function(t,e){return t.replace(/url\((['"]?)\s*#([^\s'"\)]+)\s*\1\)/g,(function(t,i,s){var a=e[s];return a?"url(#".concat(a,")"):t}))},T=function(t,e){if(!t.startsWith("#"))return t;var i=e[t.slice(1)];return i?"#"+i:t},C=[],E={};Object.keys(M).forEach((function(t){x=t;for(var e=0,i=(w=u.querySelectorAll(x+"[id]")).length;e<i;e++){var s=w[e];k=s.id,S=k+"-"+ ++bn,E[k]=S,C.push({element:s,currentId:k,newId:S})}})),Object.keys(M).forEach((function(t){var e;$=M[t],Array.prototype.forEach.call($,(function(t){for(var i=0,s=(e=u.querySelectorAll("["+t+"]")).length;i<s;i++){var a=e[i],r=a.getAttribute(t);if(r){var o=A(r,E);o!==r&&a.setAttribute(t,o)}}}))}));for(var I=u.querySelectorAll("*"),D=0,z=I.length;D<z;D++){var R=I[D],N=R.getAttribute("href");if(N){var P=T(N,E);P!==N&&R.setAttribute("href",P)}var G=R.getAttributeNS(wn,"href");if(G){var F=T(G,E);F!==G&&R.setAttributeNS(wn,"href",F)}}for(var B=u.querySelectorAll("[style]"),O=0,H=B.length;O<H;O++){var V=B[O],L=V.getAttribute("style");if(L){var j=A(L,E);j!==L&&V.setAttribute("style",j)}}for(var q=u.querySelectorAll("style"),U=0,W=q.length;U<W;U++){var Y=q[U],X=Y.textContent;if(X){var J=A(X,E);J!==X&&(Y.textContent=J)}}for(var Z=0,K=C.length;Z<K;Z++)C[Z].element.id=C[Z].newId}u.removeAttribute("xmlns:a");for(var Q,tt,et=u.querySelectorAll("script"),it=[],st=0,at=et.length;st<at;st++){var rt=et[st];(tt=rt.getAttribute("type"))&&"application/ecmascript"!==tt&&"application/javascript"!==tt&&"text/javascript"!==tt||((Q=rt.innerText||rt.textContent)&&it.push(Q),u.removeChild(rt))}if(it.length>0&&("always"===e||"once"===e&&!xn[l])){for(var ot=0,nt=it.length;ot<nt;ot++)new Function(it[ot])(window);xn[l]=!0}var lt=u.querySelectorAll("style");if(Array.prototype.forEach.call(lt,(function(t){t.textContent+=""})),u.setAttribute("xmlns","http://www.w3.org/2000/svg"),u.setAttribute("xmlns:xlink",wn),r(u),!t.parentNode)return _n.splice(_n.indexOf(t),1),t=null,void o(new Error("Parent node is null"));t.parentNode.replaceChild(u,t),_n.splice(_n.indexOf(t),1),t=null,o(null,u)};if(u)setTimeout((function(){p(null,u)}),0);else(s?fn:yn)(c,a,p)}else o(new Error("Invalid data-src or src attribute"))};const kn={apparent_temperature:"mdi:thermometer",cloud_coverage:"mdi:weather-cloudy",dew_point:"mdi:thermometer-water",humidity:"mdi:water-percent",pressure:"mdi:gauge",temperature:"mdi:thermometer",uv_index:"mdi:sun-wireless",visibility:"mdi:weather-fog",wind_bearing:"mdi:weather-windy",wind_speed:"mdi:weather-windy",precipitation:"mdi:weather-rainy",precipitation_probability:"mdi:weather-pouring",condition_clear_night:"mdi:weather-night",condition_cloudy:"mdi:weather-cloudy",condition_fog:"mdi:weather-fog",condition_hail:"mdi:weather-hail",condition_lightning:"mdi:weather-lightning",condition_lightning_rainy:"mdi:weather-lightning-rainy",condition_partlycloudy:"mdi:weather-partly-cloudy",condition_pouring:"mdi:weather-pouring",condition_rainy:"mdi:weather-rainy",condition_snowy:"mdi:weather-snowy",condition_snowy_rainy:"mdi:weather-snowy-rainy",condition_sunny:"mdi:weather-sunny",condition_windy:"mdi:weather-windy",condition_windy_variant:"mdi:weather-windy-variant",condition_exceptional:"mdi:alert-circle-outline"},Sn=(t,e)=>t&&t.components.includes(e),Mn=t=>ta(t.entity_id),An={entity:{},entity_component:{}},Tn=async(t,e,i)=>((t,e)=>t.sendMessagePromise(e))(t,{type:"frontend/get_icons",category:e,integration:i}),Cn=async(t,e,i,s=!1)=>{if(!s&&i in An.entity)return An.entity[i];if(!Sn(t,i)||!((t,e,i,s)=>{const[a,r,o]=t.split(".",3);return Number(a)>e||Number(a)===e&&(void 0===s?Number(r)>=i:Number(r)>i)||void 0!==s&&Number(a)===e&&Number(r)===i&&Number(o)>=s})(e.haVersion,2024,2))return;const a=Tn(e,"entity",i).then((t=>t?.resources[i]));return An.entity[i]=a,An.entity[i]},En=async(t,e,i,s=!1)=>!s&&An.entity_component.resources&&An.entity_component.domains?.includes(i)?An.entity_component.resources.then((t=>t[i])):Sn(e,i)?(An.entity_component.domains=[...e.components],An.entity_component.resources=Tn(t,"entity_component").then((t=>t.resources)),An.entity_component.resources.then((t=>t[i]))):void 0,In=new WeakMap,Dn=(t,e)=>{if(e)return t&&e.state?.[t]?e.state[t]:void 0!==t&&e.range&&!isNaN(Number(t))?((t,e)=>{let i=In.get(e);if(i||(i=Object.keys(e).map(Number).filter((t=>!isNaN(t))).sort(((t,e)=>t-e)),In.set(e,i)),0===i.length)return;if(t<i[0])return;let s=i[0];for(const a of i){if(!(t>=a))break;s=a}return e[s.toString()]})(Number(t),e.range)??e.default:e.default},zn=async(t,e,i,s,a,r)=>{const o=r?.platform,n=r?.translation_key,l=s?.attributes.device_class,h=s?.state;let c;if(n&&o){const s=await Cn(t,e,o);if(s){const t=s[i]?.[n];c=Dn(h,t)}}if(!c&&s&&(c=((t,e)=>{const i=Mn(t),s=e??t.state;switch(i){case"device_tracker":return((t,e)=>{const i=e??t.state;return"router"===t?.attributes.source_type?"home"===i?"mdi:lan-connect":"mdi:lan-disconnect":["bluetooth","bluetooth_le"].includes(t?.attributes.source_type)?"home"===i?"mdi:bluetooth-connect":"mdi:bluetooth":"not_home"===i?"mdi:account-arrow-right":"mdi:account"})(t,s);case"sun":return"above_horizon"===s?"mdi:white-balance-sunny":"mdi:weather-night";case"input_datetime":if(!t.attributes.has_date)return"mdi:clock";if(!t.attributes.has_time)return"mdi:calendar"}})(s,h)),!c){const s=await En(e,t,i);if(s){const t=l&&s[l]||s._;c=Dn(h,t)}}return c};class Rn extends Ea{static setConfig(t,e,i,s){return(t.layout?.icons??[]).map(((t,a)=>new Rn(t,a,e,i,s)))}constructor(t,e,i,s,a){super(t,e,i,s,a,"icons","icons",void 0!==t.icon||void 0!==t.state_map?void 0:0,{fill:!0,stroke:!1}),this.config.svg=this.calculateSvgDimensions(),this.iconId=Math.random().toString(36).substr(2,9),this.iconSvg=void 0,this.pendingIconPath=void 0}updateRuntimeConfig(){super.updateRuntimeConfig(),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config))}calculateSvgDimensions(t=this.config){return this.card.cardLayout.calculateSvgCoordinatesInGroup(t)}getGroupScaleTransform(t=this.config){return this.card.cardLayout.getGroupScaleTransform(t)}getGroupScaleStyle(t=this.config){return this.card.cardLayout.getGroupScaleStyle(t)}getStateMapItem(){const t=this.config?.state_map?.map;if(!t)return;const e=this.entity?.state;return t.find((t=>void 0!==t.state&&String(t.state)===String(e)))??t.find((t=>"default"===t.state))}buildIcon(t,e=this.config){const i=this.card.cardAnimations.styles.iconsIcon[e.animation_id];if(i)return i;if(t?.icon)return t.icon;if(e.icon)return e.icon;if(!this.entity||!this.entityConfig)return;if(this.entityConfig.icon)return this.entityConfig.icon;const s=this.entityConfig.entity,a=this.entityConfig.attribute,r=a?this.entity.attributes?.[a]:void 0,o=this.entity.entity_id?.split(".")[0];if(this.entity.attributes?.icon&&!a)return this.entity.attributes.icon;if(a&&"weather"===o){const t=kn[a];if(t)return t}this.card.entitiesIcon??={},this.card.entitiesIconKey??={},this.card.entitiesIconPending??={};const n=a?`${s}|attribute:${a}`:`${s}|state`,l=a?[s,"attribute",a,r??"",o??"",this.entity.attributes?.device_class??"",this.entity.attributes?.icon??""].join("|"):[s,"state",this.entity.state??"",o??"",this.entity.attributes?.device_class??"",this.entity.attributes?.icon??""].join("|");if(this.card.entitiesIconKey[n]===l)return this.card.entitiesIcon[n];if(this.card.entitiesIconKey[n]=l,!this.card.entitiesIconPending[n]){this.card.entitiesIconPending[n]=!0;const t=a?(async(t,e,i,s)=>{let a;const r=Mn(e),o=e.attributes.device_class,n=t.entities?.[e.entity_id],l=n?.platform,h=n?.translation_key,c=s??e.attributes[i];if(h&&l){const e=await Cn(t.config,t.connection,l);e&&(a=Dn(c,e[r]?.[h]?.state_attributes?.[i]))}if(!a){const e=await En(t.connection,t.config,r);if(e){const t=o&&e[o]?.state_attributes?.[i]||e._?.state_attributes?.[i];a=Dn(c,t)}}return a})(this.card._hass,this.entity,a,void 0!==r?String(r):void 0):(async(t,e,i,s,a)=>{const r=t?.[s.entity_id];if(r?.icon)return r.icon;const o=Mn(s);return zn(e,i,o,s,a,r)})(this.card._hass.entities,this.card._hass.config,this.card._hass.connection,this.entity);t.then((t=>{this.card.entitiesIconKey[n]===l&&t&&this.card.entitiesIcon[n]!==t&&(this.card.entitiesIcon[n]=t,this.card.requestUpdate())})).catch((t=>{console.error(a?"IconTool.buildIcon attributeIcon failed":"IconTool.buildIcon entityIcon failed",s,a??"",t)})).finally((()=>{this.card.entitiesIconPending[n]=!1}))}return this.card.entitiesIcon[n]}isUrlIcon(t){return"string"==typeof t&&/^url\(['"]?.+['"]?\)$/i.test(t.trim())}isSvgUrl(t){return t.endsWith(".svg")}getUrlFromCssUrl(t){return t.trim().replace(/^url\(['"]?/i,"").replace(/['"]?\)$/,"")}injectSvgUrlIcons(){const t=this.card.shadowRoot.querySelectorAll("svg.icon-svg-url[data-src]:not(.injected-svg)");t.length&&function(t,e){var i=void 0===e?{}:e,s=i.afterAll,a=void 0===s?function(){}:s,r=i.afterEach,o=void 0===r?function(){}:r,n=i.beforeEach,l=void 0===n?function(){}:n,h=i.cacheRequests,c=void 0===h||h,d=i.evalScripts,u=void 0===d?"never":d,p=i.httpRequestWithCredentials,g=void 0!==p&&p,m=i.renumerateIRIElements,f=void 0===m||m;if(t&&"length"in t)for(var y=0,v=0,b=t.length;v<b;v++){var _=t[v];_&&$n(_,u,f,c,g,l,(function(e,i){o(e,i),t&&"length"in t&&t.length===++y&&a(y)}))}else t?$n(t,u,f,c,g,l,(function(e,i){o(e,i),a(1),t=null})):a(0)}(t,{beforeEach(t){t.removeAttribute("height"),t.removeAttribute("width")},afterEach:(t,e)=>{if(t||!e)return;const i=e.dataset.src;i&&(this.card.svgUrlCache[i]=e.cloneNode(!0))},afterAll:()=>{this.card.requestUpdate()},cacheRequests:!1,evalScripts:"once",httpRequestWithCredentials:!1,renumerateIRIElements:!1})}updated(){0===this.index&&this.injectSvgUrlIcons()}renderCachedSvgUrlIcon(t,e,i,s,a,r,o){const n=this.card.svgUrlCache[e].cloneNode(!0),l=t.rotate??0,h=s/24,c=a-s*o+12*h,d=r-.5*s-(t.yposc?0:.25*s)+12*h;return n.classList.remove("hidden"),V`
      <g
        transform="${this.getGroupScaleTransform(t)}"
        style="${this.getGroupScaleStyle(t)}"
      >
        <g
          class="icon-position"
          transform="translate(${c} ${d})"
          ${this.actionHandler()}
          @action=${t=>this.handleAction(t)}
        >
          <rect
            x="${-s/2}"
            y="${-s/2}"
            height="${s}px"
            width="${s}px"
            stroke-width="0px"
            fill="rgba(0,0,0,0)"
            pointer-events="${"none"===t.tap_action?.action?"none":"auto"}"
          ></rect>

          <g class="icon-style-animation" style="${gt(i)}">
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
    `}renderSvgUrlPlaceholder(t,e,i,s,a,r){const o=t.rotate??0,n=i/24,l=s-i*r+12*n,h=a-.5*i-(t.yposc?0:.25*i)+12*n;return V`
      <g
        transform="${this.getGroupScaleTransform(t)}"
        style="${this.getGroupScaleStyle(t)}"
      >
        <g class="icon-position" transform="translate(${l} ${h})">
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
    `}renderSvgUrlIcon(t,e,i,s,a,r,o){return this.card.svgUrlCache[e]?this.renderCachedSvgUrlIcon(t,e,i,s,a,r,o):this.renderSvgUrlPlaceholder(t,e,s,a,r,o)}renderImageUrlIcon(t,e,i,s,a,r,o){const n=t.rotate??0,l=s/24,h=a-s*o+12*l,c=r-.5*s-(t.yposc?0:.25*s)+12*l;return V`
      <g
        transform="${this.getGroupScaleTransform(t)}"
        style="${this.getGroupScaleStyle(t)}"
      >
        <g
          class="icon-position"
          transform="translate(${h} ${c})"
          ${this.actionHandler()}
          @action=${t=>this.handleAction(t)}
        >
          <rect
            x="${-s/2}"
            y="${-s/2}"
            height="${s}px"
            width="${s}px"
            stroke-width="0px"
            fill="rgba(0,0,0,0)"
            pointer-events="${"none"===t.tap_action?.action?"none":"auto"}"
          ></rect>

          <g class="icon-style-animation" style="${gt(i)}">
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
    `}getRenderedHaIconPath(){const t=this.card.shadowRoot.getElementById(`icon-${this.iconId}`);return t?.shadowRoot?.querySelector("*")?.path}render(){const t=this.config,e=this.getStateMapItem();let i=t;e&&(i=bt.mergeDeep(t,e));const s=void 0!==i.icon_size_percent?Number(i.icon_size_percent)/100*fa:(i.icon_size?i.icon_size:i.size?i.size:2)*ya,a=t.svg.xpos,r=t.svg.ypos,o=i.align?i.align:"center",n="center"===o?.5:"start"===o?-1:1,l=a-s*n,h=r-s*n,c=s,d=this.entity?la.getHaEntityIconStyle(this.entity):{fill:"currentColor",color:"var(--state-icon-color)"},u={};u.fill=d.fill,u.color=d.color,u.filter=d.filter;let p=da.toStyleDict(i.styles);const g=this.card.cardAnimations.styles.icons[i.animation_id]??{};this.applyColorStops(p,i,["fill","color"]),p=this.getRenderStyles({...u,...p,...g},i===t?[]:[i.color_filter]);const m=this.buildIcon(e,i);if(this.isUrlIcon(m)){const t=this.getUrlFromCssUrl(m);return this.isSvgUrl(t)?this.renderItemLayers(this.renderSvgUrlIcon(i,t,p,s,a,r,n),i):this.renderItemLayers(this.renderImageUrlIcon(i,t,p,s,a,r,n),i)}if(!m)return V``;if(this.card.iconCache[m])this.iconSvg=this.card.iconCache[m];else if(this.iconSvg=void 0,this.pendingIconPath!==m){this.pendingIconPath=m;let t=0;const e=40,i=50,s=()=>{if(this.pendingIconPath!==m)return;const a=this.getRenderedHaIconPath();if(a)return this.iconSvg=a,this.card.iconCache[m]=a,this.pendingIconPath=void 0,void this.card.requestUpdate();t+=1,t>=e?this.pendingIconPath=void 0:window.setTimeout(s,i)};(this.card?.updateComplete&&"function"==typeof this.card.updateComplete.then?this.card.updateComplete:new Promise((t=>{window.requestAnimationFrame(t)}))).then((()=>{window.setTimeout(s,0)}))}if(this.iconSvg){const t=a-s*n,e=r-.5*s-(i.yposc?0:.25*s),o=s/24,l=i.rotate??0,h=t+12*o,c=e+12*o;return p["transform-origin"]??="0 0",this.renderItemLayers(V`
        <g
          transform="${this.getGroupScaleTransform(i)}"
          style="${this.getGroupScaleStyle(i)}"
        >
          <g
            id="icon-rendered-${this.iconId}"
            class="icon-position"
            transform="translate(${h} ${c})"
            ${this.actionHandler()}
            @action=${t=>this.handleAction(t)}
          >
            <rect
              x="${-s/2}"
              y="${-s/2}"
              height="${s}px"
              width="${s}px"
              stroke-width="0px"
              fill="rgba(0,0,0,0)"
              pointer-events="${"none"===i.tap_action?.action?"none":"auto"}"
            ></rect>

            <g class="icon-style-animation" style="${gt(p)}">
              <g class="icon-rotate" transform="rotate(${l})">
                <g class="icon-scale" transform="scale(${o})">
                  <g class="icon-center" transform="translate(-12 -12)">
                    <path d="${this.iconSvg}"></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      `,i)}return V`
      <foreignObject
        width="0px"
        height="0px"
        x="${l}"
        y="${h}"
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
              .icon=${m}
              id="icon-${this.iconId}"
            ></ha-icon>
          </div>
        </body>
      </foreignObject>
    `}}class Nn extends Ea{constructor(t,e,i,s,a){const r={tap_action:"selection",hold_action:"medium",double_tap_action:"heavy"},o=bt.mergeDeep({visibility:"visible",unavailable:{styles:{opacity:.35}}},t),n=t=>{Array.isArray(t)?t.forEach((t=>n(t))):t&&"object"==typeof t&&Object.entries(t).forEach((([e,i])=>{void 0!==r[e]&&"none"!==i.action&&(t[e]=bt.mergeDeep({haptic:r[e]},i)),n(t[e])}))};if(n(o),void 0!==o.label){o.label=bt.mergeDeep({position:"start",gap:0,offset:{x:0,y:0},entity_index:o.entity_index,tap_action:{action:"none"}},o.label);const t={start:{"text-anchor":"end","dominant-baseline":"central"},end:{"text-anchor":"start","dominant-baseline":"central"},top:{"text-anchor":"middle","dominant-baseline":"central"},bottom:{"text-anchor":"middle","dominant-baseline":"central"}};o.label.styles=bt.mergeDeep(t[o.label.position],da.toStyleDict(o.label.styles))}super(o,e,i,s,a,"controls","controls",void 0,{fill:!0,stroke:!1}),this.hasControlLabel=void 0!==o.label,this.labelTextTool=void 0}updateRuntimeConfig(){if(super.updateRuntimeConfig(),!["visible","hidden","unavailable"].includes(this.config.visibility))throw Error(`[controls] Invalid visibility '${this.config.visibility}' [visible, hidden, unavailable]`)}getControlActionHandlerOptions(t,e){return"unavailable"===this.config.visibility?{hasTap:!1,hasHold:!1,hasDoubleClick:!1}:this.card.actions.getActionHandlerOptions(t,e)}controlActionHandler(t,e){return Ca(this.getControlActionHandlerOptions(t,e))}handleControlAction(t,e,i){"unavailable"!==this.config.visibility?this.card.actions.handleAction(t,e,i):t.stopPropagation()}createControlLabelTextTool(t,e){if(!this.hasControlLabel)return;const i=this.config.label;let s=this.config.xpos,a=this.config.ypos;switch(i.position){case"start":s-=t/2+i.gap;break;case"end":s+=t/2+i.gap;break;case"top":a-=e/2+i.gap;break;case"bottom":a+=e/2+i.gap;break;default:throw Error(`ControlBase - invalid label position '${i.position}' [start, end, top, bottom]`)}s+=i.offset.x,a+=i.offset.y;const r=bt.mergeDeep({id:`${this.id}-label`,group:this.config.group,entity_index:i.entity_index,xpos:s,yposc:a},i,{xpos:s,yposc:a,tap_action:{action:"none"}}),o=Array.isArray(r.text)?r.text:[r.text];r.text=o.map((t=>"object"!=typeof t?{value:t,styles:da.toStyleDict(r.styles)}:bt.mergeDeep(t,{styles:bt.mergeDeep(da.toStyleDict(r.styles),da.toStyleDict(t.styles))}))),delete r.styles,delete r.position,delete r.gap,delete r.offset,this.labelTextTool=new rn(r,0,this.templates,this.cardId,this.card),this.labelTextTool.updateRuntimeConfig()}setState(t,e){if(super.setState(t,e),this.hasControlLabel){const t=this.labelTextTool.entity_index;this.labelTextTool.setState(this.card.entities[t],this.card.resolvedEntityConfigs[t])}}setStaticState(){this.hasControlLabel&&this.card.cardTools.setToolEntityState(this.labelTextTool,this.card.resolvedEntityConfigs,this.card.entities)}updated(){this.hasControlLabel&&this.labelTextTool.updated()}renderControlLabel(){return this.hasControlLabel?this.labelTextTool.render():V``}renderControl(t){let e=V`${this.renderControlLabel()}${t}`;if("unavailable"===this.config.visibility){const t=`${this.cardId}-${this.id}-unavailable-grayscale`,i=bt.mergeDeep(da.toStyleDict(this.config.unavailable.styles),{"pointer-events":"none"});e=V`
        <defs>
          <filter
            id="${t}"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
            color-interpolation-filters="sRGB"
          >
            <feColorMatrix type="saturate" values="0"></feColorMatrix>
          </filter>
        </defs>
        <g
          class="fhs-control--unavailable"
          style=${gt(i)}
          filter="url(#${t})"
          aria-disabled="true"
        >
          ${e}
        </g>
      `}return this.renderItemLayers(e)}}const Pn=36e5;class Gn{constructor(t,e,i,s,a,r=[],o=[],n={}){if(this.aggregateFuncMap={avg:this._average,median:this._median,max:this._maximum,min:this._minimum,first:this._first,last:this._last,sum:this._sum,delta:this._delta,diff:this._diff},this.config=a,this.width=t,this.height=e,this.graphArea={},this.graphArea.x=0,this.graphArea.y=0,this.graphArea.width=t-2*this.graphArea.x,this.graphArea.height=e-2*this.graphArea.y,this.axisArea={},this.dataArea={},this.setGraphAreas(i,s,0),this._history=void 0,this.coords=[],this.bucketMeta=[],this.stateBandSegments=[],this.stateBandTransitions=[],this.xAxis={},this.yAxis={},this._max=0,this._min=0,this.sharedYAxisBounds=void 0,"real_time"===this.config.period.type)this.points=1,this.hours=1;else{const t=this.config.period[this.config.period.type];this.points=t.bins.per_hour||1,this.hours=t.duration.hour||24}this.aggregateFuncName=this.config.sparkline.state_values.aggregate_func,this._calcPoint=this.aggregateFuncMap[this.aggregateFuncName]||this._average,this._smoothing=this.config.sparkline.state_values?.smoothing,this._logarithmic=this.config.sparkline.state_values?.logarithmic,this._groupBy=this.config.period.groupBy,this._endTime=0,this.valuesPerBucket=0,this.levelCount=1,this.gradeValues=r,this.gradeRanks=o,this.stateMap={...n},this.radialBarcodeSize=eo.calculateSvgDimension(this.config.sparkline?.radial_barcode?.size||5)}setGraphAreas(t,e,i,s=void 0){const a=this.axisArea,r=this.dataArea,o=this.config.sparkline.show.chart_type;let n="dots"===o,l=0,h=0,c=0,d=0;if("line"===o&&(n=!0===this.config.sparkline.show.points||!0===this.config.sparkline.line.show_dots),"area"===o&&(n=!0===this.config.sparkline.show.points||!0===this.config.sparkline.area.show_dots),n){const t=eo.calculateSvgDimension(this.config.sparkline.dots.radius)+this.config.geometry.line_width/2/2;l=t,h=t,c=t,d=t}if("bar"===o&&i>1){const s=this.width-t.l-t.r-e.l-e.r,a=Math.max(1,(s+this.config.geometry.column_spacing)/i-this.config.geometry.column_spacing);d=a/2,h=a/2}void 0!==s&&(l=s.t,h=s.r,c=s.b,d=s.l);const u={t:e.t+l,r:e.r+h,b:e.b+c,l:e.l+d};return this.axisMargin={...t},this.configuredMargin={...e},this.chartGeometryMargin={t:l,r:h,b:c,l:d,x:d,y:l},this.effectiveMargin={...u,x:u.l,y:u.t},this.axisArea={x:t.l,y:t.t,width:this.width-t.l-t.r,height:this.height-t.t-t.b},this.dataArea={x:this.axisArea.x+u.l,y:this.axisArea.y+u.t,top:this.axisArea.y+u.t,bottom:t.b+u.b,width:this.axisArea.width-u.l-u.r,height:this.axisArea.height-u.t-u.b},this.drawArea=this.dataArea,this.margin={t:t.t+u.t,r:t.r+u.r,b:t.b+u.b,l:t.l+u.l,x:t.l+u.l,y:t.t+u.t},a.x!==this.axisArea.x||a.y!==this.axisArea.y||a.width!==this.axisArea.width||a.height!==this.axisArea.height||r.x!==this.dataArea.x||r.y!==this.dataArea.y||r.width!==this.dataArea.width||r.height!==this.dataArea.height}get max(){return this._max}set max(t){this._max=t}get min(){return this._min}set min(t){this._min=t}setSharedYAxisBounds(t,e){this.sharedYAxisBounds={lowerBound:t,upperBound:e}}clearSharedYAxisBounds(){this.sharedYAxisBounds=void 0}set history(t){this._history=t}update(t=void 0){if(t&&(this._history=t),!this._history)return!1;if(0===this._history.length)return!1;if("state_bands"===this.config.sparkline.show.chart_type)return this.min=Math.min(...this.stateMap.map.map((t=>Number(t.value)))),this.max=Math.max(...this.stateMap.map.map((t=>Number(t.value)))),this.coords=[],this.bucketMeta=[],this.buildAxisGeometry(),!0;this._updateEndTime();let e,i=new Date;if(i.getDate(),this.offsetHours=0,"calendar"===this.config.period.type&&"day"===this.config.period?.calendar?.period){this.config.period.calendar.duration.hour;i.getHours(),i.getMinutes(),i.getSeconds(),this.offsetHours=Math.abs(24*this.config.period.calendar.offset)}const s=Pn/this.points;switch(this.calendarBucketStartMs=void 0,this.calendarBucketCount=void 0,this.offsetHours=0,this.config.period.type){case"real_time":e=1,this.hours=1;break;case"calendar":if("day"===this.config.period?.calendar?.period){const t=new Date(i);t.setHours(0,0,0,0),t.setHours(t.getHours()+24*this.config.period.calendar.offset-(this.config.period.calendar.duration.hour-24)),0===this.config.period.calendar.offset?(this.calendarBucketCount=Math.ceil((this._endTime.getTime()-t.getTime())/s),this.calendarBucketStartMs=this._endTime.getTime()-this.calendarBucketCount*s):(this.offsetHours=Math.abs(this.config.period.calendar.offset*this.hours),this.calendarBucketCount=Math.round(this.config.period.calendar.duration.hour*Pn/s),this.calendarBucketStartMs=t.getTime()),e=this.calendarBucketCount}break;case"rolling_window":e=Math.ceil(this.hours*this.points)}const a="real_time"===this.config.period.type?[this._history]:this._history.reduce(((t,e)=>this._reducer(t,e)),[]);a[0]&&a[0].length&&(a[0]=[a[0][a[0].length-1]]),a.length=e;try{this.coords=this._calcPoints(a)}catch(l){console.log("error in calcpoints")}this.min=Math.min(...this.coords.map((t=>Number(t[2])))),this.max=Math.max(...this.coords.map((t=>Number(t[2]))));const r="calendar"===this.config.period.type&&"day"===this.config.period.calendar.period?this.calendarBucketStartMs:this._endTime.getTime()-this.hours*Pn;this.bucketMeta=[];for(let h=0;h<a.length;h+=1){const t=a[h],e=this.coords[h],i=new Date(r+h*s),o=new Date(i.getTime()+s),n=t?t.filter(Boolean):[];if(0===n.length)this.bucketMeta[h]={index:h,start:i,end:o,value:e?e[2]:void 0,min:void 0,avg:void 0,max:void 0,count:0};else{const t=n.map((t=>Number(t.state))),s=t.reduce(((t,e)=>t+e),0);this.bucketMeta[h]={index:h,start:i,end:o,value:e?e[2]:void 0,min:Math.min(...t),avg:s/t.length,max:Math.max(...t),count:t.length}}}const o=this.config.sparkline.show.chart_type,n="line"===o?!0===this.config.sparkline.line?.show_minmax:"area"===o&&!0===this.config.sparkline.area?.show_minmax;if(["line","area"].includes(o)&&n){const t=this._history.reduce(((t,e)=>this._reducerMinMax(t,e)),[]);t[0][0]&&t[0][0].length&&(t[0][0]=[t[0][0][t[0][0].length-1]]),t[1][0]&&t[1][0].length&&(t[1][0]=[t[1][0][t[1][0].length-1]]),t[0].length=e,t[1].length=e;const i=[...a],s=[...a];let r=this._calcPoint;this._calcPoint=this.aggregateFuncMap.min,this.coordsMin=[],this.coordsMin=this._calcPoints(i),this._calcPoint=this.aggregateFuncMap.max,this.coordsMax=[],this.coordsMax=this._calcPoints(s),this._calcPoint=r,this.min=Math.min(...this.coordsMin.map((t=>Number(t[2])))),this.max=Math.max(...this.coordsMax.map((t=>Number(t[2]))))}return void 0!==this.config.y_axis.lower_bound&&(this.min=Number(this.config.y_axis.lower_bound)),void 0!==this.config.y_axis.upper_bound&&(this.max=Number(this.config.y_axis.upper_bound)),this.buildAxisGeometry(),!0}buildAxisGeometry(){const t=this.config.x_axis.labels.styles["font-size"],e=this.config.y_axis.labels.styles["font-size"],i=Number.parseFloat(t),s=Number.parseFloat(e),a=t.endsWith("%")?i/100*ya*.45:t.endsWith("em")||t.endsWith("rem")?i*ya*.45:.45*i,r=e.endsWith("%")?s/100*ya*.85:e.endsWith("em")||e.endsWith("rem")?s*ya*.85:.85*s,o=this.calculateXAxisGeometry(a),n="state_bands"===this.config.sparkline.show.chart_type?this.calculateStateBandsYAxisGeometry():this.calculateYAxisGeometry(r);this.min=n.min,this.max=n.max,this.xAxis=o,this.yAxis=n}calculateXAxisGeometry(t){const e=this.config.period[this.config.period.type],i=new Date,s=Pn/this.points;let a,r,o,n;"state_bands"===this.config.sparkline.show.chart_type?"calendar"===this.config.period.type?(a=new Date(i),a.setHours(0,0,0,0),a.setHours(a.getHours()+24*e.offset-(e.duration.hour-24)),r=new Date(a.getTime()+e.duration.hour*Pn),o=new Date(a),n=0===e.offset?new Date(i):new Date(r)):(r=new Date(i),a=new Date(r.getTime()-e.duration.hour*Pn),o=new Date(a),n=new Date(r)):"calendar"===this.config.period.type&&"day"===e.period?(a=new Date(i),a.setHours(0,0,0,0),a.setHours(a.getHours()+24*e.offset-(e.duration.hour-24)),r=new Date(a.getTime()+e.duration.hour*Pn-s),o=new Date(a),n=0===e.offset?new Date(this._snapToBin(new Date)):new Date(r)):(a=new Date(this.bucketMeta[0].start),r=new Date(this.bucketMeta[this.bucketMeta.length-1].start),o=new Date(a),n=new Date(r));const l=a.getTime(),h=r.getTime(),c=h-l,d=this.config.x_axis.labels.max_length/5*(1*t+ya),u=Math.floor(this.drawArea.width/d),p=c/(Math.max(u,4)-1),g=[1e3,5e3,15e3,3e4,6e4,3e5,6e5,9e5,18e5,36e5,72e5,144e5,216e5,432e5,864e5,1728e5,6048e5,26298e5];let m=g.findIndex((t=>t>=p));for(m<0&&(m=g.length-1);m>0&&c/g[m]<2;)m-=1;if("state_bands"!==this.config.sparkline.show.chart_type)for(;m<g.length-1&&g[m]*this.points%Pn!=0;)m+=1;const f=g[m],y=[],v=new Set;if(f<864e5){const t=new Date(a);for(t.setHours(0,0,0,0);t.getTime()<=h;){for(let e=0;e<864e5;e+=f){const i=Math.floor(e/Pn),s=Math.floor(e%Pn/6e4),a=Math.floor(e%6e4/1e3),r=e%1e3,o=new Date(t.getFullYear(),t.getMonth(),t.getDate(),i,s,a,r),n=o.getTime();if(n>=l&&n<=h&&!v.has(n)){v.add(n);const t=(n-l)/c;y.push({time:o,timestamp:n,x:this.drawArea.x+t*this.drawArea.width,isMidnight:0===o.getHours()&&0===o.getMinutes()})}}t.setDate(t.getDate()+1),t.setHours(0,0,0,0)}}else if(f===g[g.length-1]){const t=new Date(a.getFullYear(),a.getMonth(),1);for(t.getTime()<l&&t.setMonth(t.getMonth()+1);t.getTime()<=h;){const e=t.getTime(),i=(e-l)/c;y.push({time:new Date(t),timestamp:e,x:this.drawArea.x+i*this.drawArea.width,isMidnight:!0}),t.setMonth(t.getMonth()+1)}}else{const t=f/864e5,e=new Date(a);for(e.setHours(0,0,0,0),e.getTime()<l&&e.setDate(e.getDate()+1);e.getTime()<=h;){const i=e.getTime(),s=(i-l)/c;y.push({time:new Date(e),timestamp:i,x:this.drawArea.x+s*this.drawArea.width,isMidnight:!0}),e.setDate(e.getDate()+t),e.setHours(0,0,0,0)}}return{start:a,end:r,dataStart:o,dataEnd:n,interval:f,ticks:y}}calculateStateBandsYAxisGeometry(){const t=this.stateMap.map.concat().sort(((t,e)=>Number(t.value)-Number(e.value))),e=this.drawArea.height/t.length,i=t.map(((i,s)=>{const a=t.length-s-1,r=this.drawArea.y+a*e,o=.25*e,n=r+.1*e,l=r+.5*e,h=.4*e;return{state:i.state,value:Number(i.value),label:i.display_label,y:l+h/2,labelY:n,fontSize:o,bandY:l,bandHeight:h}})),s=t.slice(1).map(((t,i)=>({value:Number(t.value),y:this.drawArea.y+(i+1)*e})));return{min:Number(t[0].value),max:Number(t[t.length-1].value),interval:null,minorInterval:null,ticks:i,gridTicks:s,rows:i}}getStateBands(){const t=this.xAxis.start.getTime(),e=this.xAxis.end.getTime(),i=this.xAxis.dataEnd.getTime(),s=e-t,a=this._history.concat().sort(((t,e)=>new Date(t.last_changed).getTime()-new Date(e.last_changed).getTime())),r=[];a.forEach((t=>{const e=r[r.length-1];e&&Number(e.state)===Number(t.state)||r.push(t)})),this.stateBandSegments=[],r.forEach(((a,o)=>{const n=Math.max(t,new Date(a.last_changed).getTime()),l=o<r.length-1?new Date(r[o+1].last_changed).getTime():i,h=Math.min(e,i,l);if(n>=h)return;const c=this.yAxis.rows.find((t=>t.value===Number(a.state))),d={state:a.haState,value:Number(a.state),label:c.label,start:new Date(n),end:new Date(h),x:this.drawArea.x+(n-t)/s*this.drawArea.width,y:c.bandY,width:(h-n)/s*this.drawArea.width,height:c.bandHeight,centerY:c.bandY+c.bandHeight/2};this.stateBandSegments.push(d)})),this.stateBandTransitions=[];for(let o=0;o<this.stateBandSegments.length-1;o+=1){const t=this.stateBandSegments[o],e=this.stateBandSegments[o+1];t.end.getTime()===e.start.getTime()&&this.stateBandTransitions.push({x:e.x,fromY:t.centerY,toY:e.centerY,height:t.height})}return this.yAxis.rows.map((t=>({...t,segments:this.stateBandSegments.filter((e=>e.value===t.value))})))}calculateYAxisGeometry(t){const e=void 0!==this.sharedYAxisBounds||void 0!==this.config.y_axis.lower_bound,i=void 0!==this.sharedYAxisBounds||void 0!==this.config.y_axis.upper_bound;let s=void 0!==this.sharedYAxisBounds?this.sharedYAxisBounds.lowerBound:e?Number(this.config.y_axis.lower_bound):this.min,a=void 0!==this.sharedYAxisBounds?this.sharedYAxisBounds.upperBound:i?Number(this.config.y_axis.upper_bound):this.max;s===a&&(e||(s-=1),i||(a+=1));const r=1.5*t,o=Math.floor(this.drawArea.height/r),n=Math.max(o,2);if(this._logarithmic){const t=Math.log10(Math.max(1,s)),e=Math.log10(Math.max(1,a)),i=Math.floor(t),r=Math.ceil(e),o=[];for(let n=i;n<=r;n+=1){const i=10**n;if(i>=s&&i<=a){const s=this.drawArea.height+this.drawArea.y-(Math.log10(i)-t)/(e-t)*this.drawArea.height;o.push({value:i,y:s})}}return{min:s,max:a,interval:null,minorInterval:null,ticks:o}}const l=(a-s)/(n-1),h=10**Math.floor(Math.log10(l)),c=l/h;let d;d=c<=1?1:c<=2?2:c<=5?5:10;const u=d*h,p=u/2,g=e?s:Math.floor(s/p)*p,m=i?a:Math.ceil(a/p)*p,f=[];for(let y=Math.ceil(g/u)*u;y<=m+u/100;y+=u){const t=this.drawArea.height+this.drawArea.y-(y-g)/(m-g)*this.drawArea.height;f.push({value:y,y:t})}return{min:g,max:m,interval:u,minorInterval:p,ticks:f}}_reducerMinMax(t,e){const i=(this._endTime-new Date(e.last_changed).getTime())/Pn*this.points-this.hours*this.points,s=i<0?Math.floor(Math.abs(i)):0;return t[0]||(t[0]=[]),t[1]||(t[1]=[]),t[0][s]||(t[0][s]={},t[1][s]={}),t[0][s].state=Math.min(t[0][s].state?t[0][s].state:Number.POSITIVE_INFINITY,e.state),t[0][s].haState=Math.min(t[0][s].haState?t[0][s].haState:Number.POSITIVE_INFINITY,e.haState),t[1][s].state=Math.max(t[1][s].state?t[1][s].state:Number.NEGATIVE_INFINITY,e.state),t[1][s].haState=Math.max(t[1][s].haState?t[1][s].haState:Number.NEGATIVE_INFINITY,e.haState),t}_reducer(t,e){const{type:i}=this.config.period,s=this.config.period[i];let a=this.hours;if("calendar"===i&&"day"===s.period){const t=new Date,e=s.duration.hour-24;a=0===s.offset?t.getHours()+t.getMinutes()/60+e:s.duration.hour}let r,o=this._endTime-new Date(e.last_changed).getTime();if(0===s.offset&&o<0&&(o=0),"rolling_window"===i){const t=a*this.points,e=o/Pn*this.points;r=Math.max(0,Math.min(t-1,Math.floor(t-e)))}else if("calendar"===i&&"day"===s.period){const t=Pn/this.points;r=Math.floor((new Date(e.last_changed).getTime()-this.calendarBucketStartMs)/t),r=Math.max(0,Math.min(this.calendarBucketCount-1,r))}else{const t=a*this.points-1,e=o/Pn*this.points-t;r=e<0?Math.floor(Math.abs(e)):0}return t[r]||(t[r]=[]),t[r].push(e),t}_calcPoints(t){const e=[];let i=this.drawArea.width/(this.hours*this.points-1);i=Number.isFinite(i)?i:this.drawArea.width;const s=t.filter(Boolean)[0];let a=[this._calcPoint(s),this._lastValue(s)];const r=(t,s)=>{const r=i*s+this.drawArea.x;return t&&(a=[this._calcPoint(t),this._lastValue(t)]),e.push([r,0,t?a[0]:a[1]])};for(let o=0;o<t.length;o+=1)r(t[o],o);return e}_calcY(t){const e=this._logarithmic?Math.log10(Math.max(1,this.max)):this.max,i=this._logarithmic?Math.log10(Math.max(1,this.min)):this.min,s=(e-i)/this.drawArea.height||1;return t.map((t=>{const e=this._logarithmic?Math.log10(Math.max(1,t[2])):t[2],a=i<0?Math.abs(i):0;e>0&&Math.max(0,i);this.drawArea.height,this.drawArea.y;const r=e>0?this.drawArea.height+1*this.drawArea.top-a/s-(e-Math.max(0,i))/s:this.drawArea.height+1*this.drawArea.top-(0-i)/s,o=this.drawArea.height+1*this.drawArea.y-(e-i)/s;return[t[0],o,t[2],r]}))}_calcLevelY(t){const e=this._logarithmic?Math.log10(Math.max(1,this.max)):this.max,i=this._logarithmic?Math.log10(Math.max(1,this.min)):this.min,s=(e-i)/this.drawArea.height||1,a=i<0?Math.abs(i):0;let r=[];return t[2].forEach(((t,e)=>{const o=t>=0?this.drawArea.height+1*this.drawArea.top-1*a/s-(t-Math.max(0,i))/s:this.drawArea.height+1*this.drawArea.top-(0-t)/s;return r.push(o),r})),r}getPoints(){let t,e,{coords:i}=this;1===i.length&&(i[1]=[this.drawArea.x+this.drawArea.width,0,i[0][2]]),i=this._calcY(this.coords);let s=i[0];i.shift();const a=i.map(((i,a)=>{t=i,e=this._smoothing?this._midPoint(s[0],s[1],t[0],t[1]):t;const r=this._smoothing?(t[2]+s[2])/2:t[2];return s=t,[e[0],e[1],r,a+1]}));return a}getPath(){let t,e,{coords:i}=this;1===i.length&&(i[1]=[this.drawArea.x+this.drawArea.width,0,i[0][2]]),i=this._calcY(this.coords);let s="",a=i[0];return s+=`M${a[0]},${a[1]}`,i.forEach((i=>{t=i,e=this._smoothing?this._midPoint(a[0],a[1],t[0],t[1]):t,s+=` ${e[0]},${e[1]}`,s+=` Q ${t[0]},${t[1]}`,a=t})),s+=` ${t[0]},${t[1]}`,s}getPathMin(){let t,e,{coordsMin:i}=this;1===i.length&&(i[1]=[this.drawArea.x+this.drawArea.width,0,i[0][2]]),i=this._calcY(this.coordsMin);let s="",a=i[0];return s+=`M${a[0]},${a[1]}`,i.forEach((i=>{t=i,e=t,s+=` ${e[0]},${e[1]}`,s+=` Q ${t[0]},${t[1]}`,a=t})),s+=` ${t[0]},${t[1]}`,s}getPathMax(){let t,e,{coordsMax:i}=this;1===i.length&&(i[1]=[this.drawArea.x+this.drawArea.width,0,i[0][2]]),i=this._calcY(this.coordsMax);let s="",a=i[i.length-1];return i.reverse().forEach(((i,r,o)=>{t=i,e=t,s+=` ${e[0]},${e[1]}`,s+=` Q ${t[0]},${t[1]}`,a=t})),s+=` ${t[0]},${t[1]}`,s+=`M${a[0]},${a[1]}`,s}computeGradient(t,e){const i=e?Math.log10(Math.max(1,this._max))-Math.log10(Math.max(1,this._min)):this._max-this._min,s=i/(this.graphArea.height-this.margin.b)*this.graphArea.height-i;return t.map(((t,a,r)=>{let o,n;if(t.value>this._max&&r[a+1]){const e=(this._max-r[a+1].value)/(t.value-r[a+1].value);o=la.getGradientValue(r[a+1].color,t.color,e)}else if(t.value<this._min&&r[a-1]){const e=(r[a-1].value-this._min)/(r[a-1].value-t.value);o=la.getGradientValue(r[a-1].color,t.color,e)}return n=i<=0?0:e?(Math.log10(Math.max(1,this._max))-Math.log10(Math.max(1,t.value)))*(100/i):(this._max-t.value)*(100/(i+s)),{color:o||t.color,offset:n}}))}getAreaMinMax(t,e){let i=t;return i+=` L ${this.coordsMax[this.coordsMax.length-1][0]},\n                ${this.coordsMax[this.coordsMax.length-1][1]}`,i+=e,i+=" z",i}getArea(t){const e=this._logarithmic?Math.log10(Math.max(1,this.max)):this.max,i=this._logarithmic?Math.log10(Math.max(1,this.min)):this.min,s=(e-i)/this.drawArea.height||1,a=Math.min(e,Math.max(i,0)),r=this.drawArea.y+this.drawArea.height-(a-i)/s;let o=t;return o+=` L ${this.coords[this.coords.length-1][0]}, ${r}`,o+=` L ${this.coords[0][0]}, ${r} z`,o}polarToCartesian(t,e,i,s,a){const r=(a-90)*Math.PI/180;return{x:t+i*Math.cos(r),y:e+s*Math.sin(r)}}_calcRadialBarcodeCoords(t,e,i,s,a,r){const o=this.drawArea.x+this.drawArea.width/2,n=this.drawArea.y+this.drawArea.height/2,l=this.polarToCartesian(o,n,s,a,e),h=this.polarToCartesian(o,n,s,a,t),c=Math.abs(e-t)<=180?"0":"1",d=i?"0":"1",u=s-r,p=a-r;return{start:l,end:h,start2:this.polarToCartesian(o,n,u,p,e),end2:this.polarToCartesian(o,n,u,p,t),largeArcFlag:c,sweepFlag:d}}_calcRadialBarcode(t,e=!1,i=4,s=4){const a=this._logarithmic?Math.log10(Math.max(1,this.max)):this.max,r=this._logarithmic?Math.log10(Math.max(1,this.min)):this.min,o=this.hours*this.points,n=360/o;let l=0;const h=!0,c=(a-r)/this.radialBarcodeSize,d=t.map((t=>{const s=e?this.max:t[2];let a,o;switch(this.config.sparkline.show?.chart_variant){case"sunburst":case"sunburst_centered":a=((this._logarithmic?Math.log10(Math.max(1,s)):s)-r)/c,o=(this.drawArea.width-this.radialBarcodeSize+a)/2;break;case"sunburst_outward":a=((this._logarithmic?Math.log10(Math.max(1,s)):s)-r)/c,o=this.drawArea.width/2-this.radialBarcodeSize+a;break;case"sunburst_inward":a=((this._logarithmic?Math.log10(Math.max(1,s)):s)-r)/c,o=this.drawArea.width/2;break;default:a=this.radialBarcodeSize,o=this.drawArea.width/2}let d=[],u=[],p=[],g=[];const{start:m,end:f,start2:y,end2:v,largeArcFlag:b,sweepFlag:_}=this._calcRadialBarcodeCoords(l+i,l+n-i,h,o,o,a);return l+=n,d.push(m.x,f.x,y.x,v.x),u.push(m.y,f.y,y.y,v.y),p.push(this.drawArea.width/2,this.drawArea.width/2-this.radialBarcodeSize),g.push(this.drawArea.height/2,this.drawArea.height/2-this.radialBarcodeSize),[d,u,s,0,p,g,b,_]}));if(e&&t.length!==o){let e,s;const u=this.max;switch(this.config.sparkline.show?.chart_variant){case"sunburst":case"sunburst_centered":e=((this._logarithmic?Math.log10(Math.max(1,u)):u)-r)/c,s=(this.drawArea.width-this.radialBarcodeSize+e)/2;break;case"sunburst_outward":e=((this._logarithmic?Math.log10(Math.max(1,u)):u)-r)/c,s=this.drawArea.width/2-this.radialBarcodeSize+e;break;case"sunburst_inward":e=((this._logarithmic?Math.log10(Math.max(1,u)):u)-r)/c,s=this.drawArea.width/2;break;default:e=this.radialBarcodeSize,s=this.drawArea.width/2}let p=[];for(let r=t.length;r<o;r++){p[r]={},p[r][0]=r,p[r][1]=0,p[r][2]=a;let t=[],o=[],c=[],g=[];const{start:m,end:f,start2:y,end2:v,largeArcFlag:b,sweepFlag:_}=this._calcRadialBarcodeCoords(l+i,l+n-i,h,s,s,e);l+=n,t.push(m.x,f.x,y.x,v.x),o.push(m.y,f.y,y.y,v.y),c.push(this.drawArea.width/2,this.drawArea.width/2-this.radialBarcodeSize),g.push(this.drawArea.height/2,this.drawArea.height/2-this.radialBarcodeSize),d.push([t,o,u,0,c,g,b,_])}}return d}getRadialBarcodeBackground(t,e,i=4,s=4){this.backgroundCoords=[],this.backgroundCoords=[...this.coords];return this._calcRadialBarcode(this.backgroundCoords,!0,i,s).map(((t,e)=>({start:{x:t[0][0],y:t[1][0]},end:{x:t[0][1],y:t[1][1]},start2:{x:t[0][2],y:t[1][2]},end2:{x:t[0][3],y:t[1][3]},radius:{x:t[4][0],y:t[5][0]},radius2:{x:t[4][1],y:t[5][1]},largeArcFlag:t[6],sweepFlag:t[7],value:t[2]})))}getRadialBarcodeBackgroundPaths(){return this.radialBarcodeBackground.map(((t,e)=>{let i,s,a,r,o="0";if(["flower2","flower","rice_grain"].includes(this.config.sparkline.show?.chart_viz)){if("flower"===this.config.sparkline.show.chart_viz&&"sunburst_inward"===this.config.sparkline.show.chart_variant)i=t.radius.x,s=t.radius.y;else{const e=Math.abs(t.start.x-t.end.x),a=Math.abs(t.start.y-t.end.y);i=Math.sqrt(e*e+a*a)/2,s=i}if("flower"===this.config.sparkline.show.chart_viz&&"sunburst_outward"===this.config.sparkline.show.chart_variant)a=t.radius2.x,r=t.radius2.y;else{const e=Math.abs(t.start2.x-t.end2.x),i=Math.abs(t.start2.y-t.end2.y);a=Math.sqrt(e*e+i*i)/2,r=a,o=["rice_grain","flower"].includes(this.config.sparkline.show.chart_viz)?"1":"0"}}else i=t.radius.x,s=t.radius.y,a=t.radius2.x,r=t.radius2.y;return["M",t.start.x,t.start.y,"A",i,s,0,t.largeArcFlag,t.sweepFlag,t.end.x,t.end.y,"L",t.end2.x,t.end2.y,"A",a,r,0,t.largeArcFlag,t.sweepFlag===o?"1":"0",t.start2.x,t.start2.y,"Z"].join(" ")}))}getRadialBarcode(t,e,i=4,s=4){return this._calcRadialBarcode(this.coords,!1,i,s).map(((t,e)=>({start:{x:t[0][0],y:t[1][0]},end:{x:t[0][1],y:t[1][1]},start2:{x:t[0][2],y:t[1][2]},end2:{x:t[0][3],y:t[1][3]},radius:{x:t[4][0],y:t[5][0]},radius2:{x:t[4][1],y:t[5][1]},largeArcFlag:t[6],sweepFlag:t[7],value:t[2]})))}getRadialBarcodePaths(){return this.radialBarcode.map(((t,e)=>{let i,s,a,r,o="0";if(["flower2","flower","rice_grain"].includes(this.config.sparkline.show?.chart_viz)){if("flower"===this.config.sparkline.show.chart_viz&&"sunburst_inward"===this.config.sparkline.show.chart_variant)i=t.radius.x,s=t.radius.y;else{const e=Math.abs(t.start.x-t.end.x),a=Math.abs(t.start.y-t.end.y);i=Math.sqrt(e*e+a*a)/2,s=i}if("flower"===this.config.sparkline.show.chart_viz&&"sunburst_outward"===this.config.sparkline.show.chart_variant)a=t.radius2.x,r=t.radius2.y;else{const e=Math.abs(t.start2.x-t.end2.x),i=Math.abs(t.start2.y-t.end2.y);a=Math.sqrt(e*e+i*i)/2,r=a,o=["rice_grain","flower"].includes(this.config.sparkline.show.chart_viz)?"1":"0"}}else i=t.radius.x,s=t.radius.y,a=t.radius2.x,r=t.radius2.y;return["M",t.start.x,t.start.y,"A",i,s,0,t.largeArcFlag,t.sweepFlag,t.end.x,t.end.y,"L",t.end2.x,t.end2.y,"A",a,r,0,t.largeArcFlag,t.sweepFlag===o?"1":"0",t.start2.x,t.start2.y,"Z"].join(" ")}))}getBarcode(t,e,i=4,s=4){const a=this._logarithmic?Math.log10(Math.max(1,this.max)):this.max,r=this._logarithmic?Math.log10(Math.max(1,this.min)):this.min,o=this.coords,n=this.drawArea.width/Math.ceil(this.hours*this.points)/e,l=n-Math.min(i/2,n/2),h=(a-r)/this.drawArea.height||1;switch(this.config.sparkline.show.chart_variant){case"audio":return o.map(((i,s)=>({x:n*s*e+n*t+this.drawArea.x,y:this.drawArea.height/2-((this._logarithmic?Math.log10(Math.max(1,i[2])):i[2])-r)/h/2,height:((this._logarithmic?Math.log10(Math.max(1,i[2])):i[2])-r)/h,width:l,value:i[2]})));case"stalactites":return o.map(((i,s)=>({x:n*s*e+n*t+this.drawArea.x,y:0,height:((this._logarithmic?Math.log10(Math.max(1,i[2])):i[2])-r)/h,width:l,value:i[2]})));case"stalagmites":return o.map(((i,s)=>({x:n*s*e+n*t+this.drawArea.x,y:this.drawArea.height/1-((this._logarithmic?Math.log10(Math.max(1,i[2])):i[2])-r)/h,height:((this._logarithmic?Math.log10(Math.max(1,i[2])):i[2])-r)/h,width:l,value:i[2]})));default:return o.map(((i,s)=>({x:n*s*e+n*t+this.drawArea.x,y:0,height:this.drawArea.height,width:l,value:i[2]})))}}getEqualizer(t,e,i=4,s=4){const a=(this.drawArea.width+i)/Math.ceil(this.hours*this.points)/e;this._max,this._min,this.drawArea.height;this._min<0&&Math.abs(this._min);const r=(this.drawArea.height-this.levelCount*s)/this.levelCount;let o,n=this.coords.map(((t,e)=>{let i=[];const s=Math.trunc(t[2]/this.valuesPerBucket),a=Math.trunc(this._min/this.valuesPerBucket);o=s-a,i[0]=t[0],i[1]=[],i[2]=[];for(let r=0;r<o;r++)i[2][r]=this._min+r*this.valuesPerBucket;return i[1]=this._calcLevelY(i),i}));return n.map(((s,o)=>({x:a*o*e+a*t+this.drawArea.x,y:s[1],height:r,width:a-i,value:s[2]})))}getGrades(t,e,i=4,s=4){const a=(this.drawArea.width+i)/Math.ceil(this.hours*this.points)/e,r=(this.drawArea.height-(this.gradeRanks.length-1)*s)/this.gradeRanks.length;let o,n=this.coords.map(((t,e)=>{let i=[];const a=this.gradeRanks.length;o=a-0,i[0]=t[0],i[1]=[],i[2]=[];let n=-1,l=0;for(let s=0;s<o;s++){l=0;for(let e=0;e<this.gradeRanks[s].rangeMin.length;e++)t[2]>=this.gradeRanks[s].rangeMin[e]&&t[2]<this.gradeRanks[s].rangeMax[e]&&(l=e,n=s)}for(let h=0;h<=o;h++)h<=n&&(i[2][h]=this.gradeRanks[h].rangeMin.length>l?this.gradeRanks[h].rangeMin[l]:this.gradeRanks[h].rangeMin[0]),i[1][h]=this.drawArea.height+this.margin.t-h*(r+s);return i}));return n.map(((s,o)=>({x:a*o*e+a*t+this.drawArea.x,y:s[1],height:r,width:a-i,value:s[2]})))}getBars(t,e,i=4,s=4){const a=this._calcY(this.coords),r=(a.length>1?a[1][0]-a[0][0]:this.drawArea.width)/e,o=(this._max-this._min)/this.drawArea.height||1;this._min<0&&Math.abs(this._min);const n=Math.max(1,r-i);return a.map(((e,i)=>({x:e[0]+r*t-n/2,y:this._min>0?e[1]:e[3],height:e[2]>0?this._min<0?e[2]/o:(e[2]-this._min)/o:e[1]-e[3],width:n,value:e[2]})))}_midPoint(t,e,i,s){return[(t-i)/2+i,(e-s)/2+s]}_average(t){return t.reduce(((t,e)=>t+parseFloat(e.state)),0)/t.length}_median(t){const e=[...t].sort(((t,e)=>parseFloat(t.state)-parseFloat(e.state))),i=Math.floor((e.length-1)/2);return e.length%2==1?parseFloat(e[i].state):(parseFloat(e[i].state)+parseFloat(e[i+1].state))/2}_maximum(t){return Math.max(...t.map((t=>t.state)))}_minimum(t){return Math.min(...t.map((t=>t.state)))}_first(t){return parseFloat(t[0].state)}_last(t){return parseFloat(t[t.length-1].state)}_sum(t){return t.reduce(((t,e)=>t+parseFloat(e.state)),0)}_delta(t){return this._maximum(t)-this._minimum(t)}_diff(t){return this._last(t)-this._first(t)}_lastValue(t){return["delta","diff"].includes(this.aggregateFuncName)?0:parseFloat(t[t.length-1].state)||0}_snapToBin(t){const e=60*(60/this.points)*1e3;return new Date(Math.floor(t.getTime()/e)*e)}_updateEndTime(){if(this._endTime=new Date,"calendar"===this.config.period.type)"day"===this.config.period.calendar.period&&0!==this.config.period.calendar.offset?(this._endTime.setHours(-this.config.period.calendar.duration.hour),this._endTime.setHours(0,0,0,0)):"day"===this.config.period.calendar.period&&(this._endTime=this._snapToBin(this._endTime),this._endTime=new Date(this._endTime.getTime()+60/this.points*60*1e3));else if("rolling_window"===this.config.period.type)this._endTime=this._snapToBin(this._endTime),this._endTime=new Date(this._endTime.getTime()+60/this.points*60*1e3);else switch(this._groupBy){case"month":this._endTime.setMonth(this._endTime.getMonth()+1),this._endTime.setDate(1);break;case"date":this._endTime.setDate(this._endTime.getDate()+1),this._endTime.setHours(0,0,0,0);break;case"hour":this._endTime.setHours(this._endTime.getHours()+1),this._endTime.setMinutes(0,0,0)}}}class Fn{constructor(t){const e=void 0===t.series?[{id:"default",entity_index:t.entity_index}]:t.series,i=new Set;e.forEach((e=>{if("string"!=typeof e.id||0===e.id.length)throw new Error("[sparklines] every series requires a non-empty id");if(i.has(e.id))throw new Error("[sparklines] series ids must be unique");if(!Number.isInteger(e.entity_index))throw new Error(`[sparklines] series '${e.id}' requires entity_index`);if(void 0!==t.series&&void 0!==e.period)throw new Error(`[sparklines] series '${e.id}' cannot override period before offset support is added`);const s=e.sparkline?.show?.chart_type??t.sparkline.show.chart_type;if(void 0!==t.series&&!["line","area","dots"].includes(s))throw new Error(`[sparklines] series '${e.id}' chart_type must be line, area or dots`);i.add(e.id)})),this.items=e.map((e=>{const i=bt.mergeDeep({},t,e);return delete i.id,delete i.series,{id:e.id,entity_index:e.entity_index,config:i,entity:void 0,entityConfig:void 0,graph:void 0,rows:[],historySeries:void 0,historyPromise:void 0,historyRangeStart:void 0,historyRangeEnd:void 0,historyEntityId:void 0,historyLoading:!1,historyRefreshAt:0,historyResynchronizationRequested:!1,preserveGraphWhileHistoryLoads:!1}}))}get defaultItem(){return this.items[0]}createGraph(t,e,i,s,a,r,o,n,l){t.graph=new Gn(e,i,s,a,r,o,n,l)}clearGraphs(){this.items.forEach((t=>{t.graph=void 0}))}setRows(t,e){t.rows=e}updateGraphs(){return this.items.map((t=>t.graph.update(t.rows)))}}const Bn=(t,e)=>{for(let i=e,s=t.length;i<s;i+=1)if(null!=t[i].value)return i;throw new Error('Error in threshold interpolation: could not find right-nearest valued stop. Do the first and last thresholds have a set "value"?')},On=["var(--theme-sys-color-primary)","#3498db","#e74c3c","#9b59b6","#f1c40f","#2ecc71","#1abc9c","#34495e","#e67e22","#7f8c8d","#27ae60","#2980b9","#8e44ad"],Hn={line:{x:!0,y:!0},area:{x:!0,y:!0},bar:{x:!0,y:!0},dots:{x:!0,y:!0},equalizer:{x:!0,y:!0},state_bands:{x:!0,y:!0},graded:{x:!1,y:!1},barcode:{x:!0,y:!1},radial_barcode:{x:!1,y:!1}},Vn=(t,e)=>{const i=(t=>{if(!t||!t.length)return t;if(null==t[0].value||null==t[t.length-1].value)throw new Error('The first and last thresholds must have a set "value".\n See xyz manual');let e=0,i=null;return t.map(((s,a)=>{if(null!=s.value)return e=a,{...s};null==i?i=Bn(t,a):a>i&&(e=i,i=Bn(t,a));const r=t[e].value,o=(t[i].value-r)/(i-e);return{color:"string"==typeof s?s:s.color,value:r+o*(a-e)}}))})(t);try{i.sort(((t,e)=>e.value-t.value))}catch(a){console.log("computeThresholds, error",a,i)}if("smooth"===e)return i;const s=[].concat(...i.map(((t,e)=>[t,{value:t.value-1e-4,color:i[e+1]?i[e+1].color:t.color}])));return s};class Ln extends Ea{get Graph(){return this.sparklineSeries.defaultItem.graph}get series(){return this.sparklineSeries.defaultItem.rows}set series(t){this.sparklineSeries.setRows(this.sparklineSeries.defaultItem,t)}get historySeries(){return this.sparklineSeries.defaultItem.historySeries}set historySeries(t){this.sparklineSeries.defaultItem.historySeries=t}get historyPromise(){return this.sparklineSeries.defaultItem.historyPromise}set historyPromise(t){this.sparklineSeries.defaultItem.historyPromise=t}get historyRangeStart(){return this.sparklineSeries.defaultItem.historyRangeStart}set historyRangeStart(t){this.sparklineSeries.defaultItem.historyRangeStart=t}get historyRangeEnd(){return this.sparklineSeries.defaultItem.historyRangeEnd}set historyRangeEnd(t){this.sparklineSeries.defaultItem.historyRangeEnd=t}get historyEntityId(){return this.sparklineSeries.defaultItem.historyEntityId}set historyEntityId(t){this.sparklineSeries.defaultItem.historyEntityId=t}get historyLoading(){return this.sparklineSeries.items.some((t=>t.historyLoading))}set historyLoading(t){this.sparklineSeries.defaultItem.historyLoading=t}get historyRefreshAt(){return this.sparklineSeries.defaultItem.historyRefreshAt}set historyRefreshAt(t){this.sparklineSeries.defaultItem.historyRefreshAt=t}get historyResynchronizationRequested(){return this.sparklineSeries.defaultItem.historyResynchronizationRequested}set historyResynchronizationRequested(t){this.sparklineSeries.defaultItem.historyResynchronizationRequested=t}get preserveGraphWhileHistoryLoads(){return this.sparklineSeries.defaultItem.preserveGraphWhileHistoryLoads}set preserveGraphWhileHistoryLoads(t){this.sparklineSeries.defaultItem.preserveGraphWhileHistoryLoads=t}static setConfig(t,e,i,s){return(t.layout?.sparklines??[]).map(((t,a)=>new Ln(t,a,e,i,s)))}constructor(t,e,i,s,a){const r={xpos:50,ypos:50,width:25,height:25,margin:0,history:{period:"rolling_window"},period:{type:"calendar",group_by:"interval",calendar:{period:"day",offset:0,duration:{hour:24},bins:{per_hour:"auto",density:"medium"}}},sparkline:{state_values:{logarithmic:!1,value_factor:0,aggregate_func:"avg",smoothing:!0},line_color:[...On],colorstops:{colors:[]},colorstops_transition:"smooth",dots:{radius:2},line:{show_dots:!1},area:{show_dots:!1},bar:{background:{show:{item_style:"none"},color:"var(--divider-color)",colorstopsegments:{fill:!0,stroke:!1},lineargradient:{fill:!0,stroke:!1},colorstopgradient:{fill:!0,stroke:!1},styles:{opacity:.2,rx:0,ry:0}},foreground:{styles:{rx:0,ry:0}}},equalizer:{value_buckets:10,square:!1,background:{show:{item_style:"none"},color:"var(--divider-color)",colorstopsegments:{fill:!0,stroke:!1},lineargradient:{fill:!0,stroke:!1},colorstopgradient:{fill:!0,stroke:!1},styles:{opacity:.2,rx:0,ry:0}}},graded:{square:!1,background:{styles:{}},foreground:{styles:{}}},state_bands:{radius:.5,update_interval:"5min",styles:{"stroke-width":0},background:{padding:.75,connection_width:.375,styles:{opacity:.3}}},radial_barcode:{size:5,line_width:0,face:{show_day_night:!1,show_hour_marks:!1,show_hour_numbers:!1,hour_marks_count:24},background:{styles:{opacity:.3}}},tooltip:{styles:{"font-size":"0.9em"}},show:{chart_type:"line",points:!1,line:!0,area:!1,grid:{x:!1,y:!1},axis:{x:!1,y:!1},tickmarks:{x:!1,y:!1},labels:{x:!1,y:!1},xlabels_at:"ticks_major",ylabels_at:"ticks_major"}},x_axis:{axis:{styles:{stroke:"var(--primary-text-color)","stroke-width":1,opacity:.45}},ticks_major:{ticksize:"auto"},ticks_minor:{ticksize:"auto"},grid_major:{styles:{stroke:"var(--divider-color)","stroke-width":1,opacity:.35}},grid_minor:{styles:{stroke:"var(--divider-color)","stroke-width":1,opacity:.15}},tickmarks_major:{size:1,styles:{stroke:"var(--primary-text-color)","stroke-width":1,opacity:.45}},tickmarks_minor:{size:.5,styles:{stroke:"var(--primary-text-color)","stroke-width":1,opacity:.25}},labels:{offset:2,styles:{fill:"var(--primary-text-color)","font-size":"0.5em","text-anchor":"middle","dominant-baseline":"hanging",opacity:.7}}},y_axis:{axis:{styles:{stroke:"var(--primary-text-color)","stroke-width":1,opacity:.45}},ticks_major:{ticksize:"auto"},ticks_minor:{ticksize:"auto"},grid_major:{styles:{stroke:"var(--divider-color)","stroke-width":1,opacity:.35}},grid_minor:{styles:{stroke:"var(--divider-color)","stroke-width":1,opacity:.15}},tickmarks_major:{size:1,styles:{stroke:"var(--primary-text-color)","stroke-width":1,opacity:.45}},tickmarks_minor:{size:.5,styles:{stroke:"var(--primary-text-color)","stroke-width":1,opacity:.25}},labels:{offset:2,styles:{fill:"var(--primary-text-color)","font-size":"0.5em","text-anchor":"end","dominant-baseline":"middle",opacity:.7}}},line:{styles:{fill:"none",stroke:"var(--primary-text-color)","stroke-width":1,"stroke-linecap":"round","stroke-linejoin":"round"}},area:{styles:{fill:"var(--primary-color)",opacity:.25}}},o=bt.mergeDeep({},t);!0===o.period?.real_time&&(o.period.type="real_time"),["bar","equalizer"].forEach((t=>{void 0!==o.sparkline?.[t]?.background?.styles&&(o.sparkline[t].background.styles=da.toStyleDict(o.sparkline[t].background.styles))})),void 0!==o.sparkline?.bar?.foreground?.styles&&(o.sparkline.bar.foreground.styles=da.toStyleDict(o.sparkline.bar.foreground.styles)),["grid","axis","tickmarks","labels"].forEach((t=>{const e=o.sparkline?.show?.[t];"boolean"==typeof e&&(o.sparkline.show[t]={x:e,y:e})})),void 0!==o.line?.styles&&(o.line.styles=da.toStyleDict(o.line.styles)),void 0!==o.area?.styles&&(o.area.styles=da.toStyleDict(o.area.styles)),void 0!==o.sparkline?.state_bands?.styles&&(o.sparkline.state_bands.styles=da.toStyleDict(o.sparkline.state_bands.styles)),void 0!==o.sparkline?.state_bands?.background?.styles&&(o.sparkline.state_bands.background.styles=da.toStyleDict(o.sparkline.state_bands.background.styles)),void 0!==o.sparkline?.graded?.background?.styles&&(o.sparkline.graded.background.styles=da.toStyleDict(o.sparkline.graded.background.styles)),void 0!==o.sparkline?.graded?.foreground?.styles&&(o.sparkline.graded.foreground.styles=da.toStyleDict(o.sparkline.graded.foreground.styles)),["x_axis","y_axis"].forEach((t=>{["axis","grid_major","grid_minor","tickmarks_major","tickmarks_minor","labels"].forEach((e=>{void 0!==o[t]?.[e]?.styles&&(o[t][e].styles=da.toStyleDict(o[t][e].styles))}))}));const n=bt.mergeDeep(r,o);["calendar","rolling_window"].forEach((t=>{void 0!==n.period[t]&&(n.period[t].bins??={},n.period[t].bins.per_hour??="auto",n.period[t].bins.density??="medium")})),"state_bands"===n.sparkline.show.chart_type&&(n.sparkline.colorstops_transition="hard",void 0===o.y_axis?.labels?.styles?.["text-anchor"]&&(n.y_axis.labels.styles["text-anchor"]="start"),void 0===o.y_axis?.labels?.styles?.["dominant-baseline"]&&(n.y_axis.labels.styles["dominant-baseline"]="hanging"));const l=i.hasJavascriptTemplates(n.period);if(super(n,e,i,s,a,"sparklines","sparklines",0),this.sparklineSeries=new Fn(this.config),this.svg=this.calculateSvgDimensions(),this.configuredGraphMargin=this.svg.margin,this.axisMargin={t:0,r:0,b:0,l:0,x:0,y:0},this.config.svg=this.svg,this.stateBandsStateMap=this.config.sparkline.state_map,this.gradeValues=[],this.gradeRanks=[],this.historyDurationReady=!1,!l){const t="real_time"===this.config.period.type?1:Number(this.config.period[this.config.period.type].duration.hour);this.historyDurationReady="real_time"===this.config.period.type||Number.isFinite(t)&&t>0}const h=this.calculateSharedBinsPerHour();this.graphConfig=this.historyDurationReady?this.buildGraphConfig(this.config,h):void 0,this.historyDurationReady&&this.sparklineSeries.items.forEach((t=>{const e=this.buildGraphConfig(t.config,h);this.sparklineSeries.createGraph(t,this.svg.width,this.svg.height,this.axisMargin,this.configuredGraphMargin,e,this.gradeValues,this.gradeRanks,e.sparkline.state_map??{})})),this.graphReady=!1,this.series=[],this.historySeries=void 0,this.gradient=[],this.length=[],this.area=[],this.areaMinMax=[],this.line=[],this.bar=[],this.equalizer=[],this.points=[],this.barcodeChart=[],this.barcodeChartBackground=[],this.radialBarcodeChart=[],this.radialBarcodeChartBackground=[],this.graded=[],this.stateBands=[],this.radialBarcodeChartWidth=eo.calculateSvgDimension(this.config?.sparkline?.radial_barcode?.size||5),this.linePath=void 0,this.lineMinPath=void 0,this.lineMaxPath=void 0,this.areaPath=void 0,this.areaMinMaxPath=void 0,this.stats={},this.tooltip={},this.tooltipVisible=!1,this.activePoint=void 0,this.activeX=void 0,this.dragging=!1,this.elements={},this.historyPromise=void 0,this.historyRefreshAt=0,this.binBoundaryTimer=void 0,this.calendarRangeTimer=void 0,this.historyRangeStart=void 0,this.historyRangeEnd=void 0,this.historyPeriodSignature=JSON.stringify(this.config.period),this.historyEntityId=void 0,this.historyResynchronizationRequested=!1,this.historyLoading=!1,this.preserveGraphWhileHistoryLoads=!1,this.prefersReducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches,this.runtimeYScale=void 0,this.config.svg=this.svg}calculateSvgDimensions(t=this.config){const e=this.card.cardLayout.calculateSvgCoordinatesInGroup(t),i=eo.calculateSvgDimension(t.width),s=eo.calculateSvgDimension(t.height),a=this.calculateSparklineMargin(t.margin),r=eo.calculateSvgDimension(t.sparkline?.[t.sparkline.show.chart_type]?.styles?.["stroke-width"]||t.sparkline?.line?.styles?.["stroke-width"]||t.line_width||0),o=eo.calculateSvgDimension(t.sparkline[t.sparkline.show.chart_type]?.column_spacing||this.config.bar_spacing||1),n=eo.calculateSvgDimension(t.sparkline[t.sparkline.show.chart_type]?.row_spacing||this.config.bar_spacing||1);return{...e,width:i,height:s,line_width:r,x:e.xpos-i/2,y:e.ypos-s/2,margin:a,column_spacing:o,row_spacing:n}}calculateSparklineMargin(t){const e={};return"object"==typeof t?(e.t=eo.calculateSvgDimension(t.t)||eo.calculateSvgDimension(t.y)||0,e.b=eo.calculateSvgDimension(t.b)||eo.calculateSvgDimension(t.y)||0,e.r=eo.calculateSvgDimension(t.r)||eo.calculateSvgDimension(t.x)||0,e.l=eo.calculateSvgDimension(t.l)||eo.calculateSvgDimension(t.x)||0,e.x=e.l,e.y=e.t):(e.x=eo.calculateSvgDimension(t),e.y=e.x,e.t=e.x,e.r=e.x,e.b=e.x,e.l=e.x),e}calculateAxisMargin(){const t=Hn[this.config.sparkline.show.chart_type],e=t.x&&this.config.sparkline.show.tickmarks.x,i=t.y&&this.config.sparkline.show.tickmarks.y,s=t.x&&this.config.sparkline.show.labels.x,a=t.y&&this.config.sparkline.show.labels.y,r=e?eo.calculateSvgDimension(this.config.x_axis.tickmarks_major.size):0,o=i?eo.calculateSvgDimension(this.config.y_axis.tickmarks_major.size):0,n=s?eo.calculateSvgDimension(this.config.x_axis.labels.offset):0,l=a?eo.calculateSvgDimension(this.config.y_axis.labels.offset):0,h=this.resolveAxisFontSizePixels("x",ya),c=this.resolveAxisFontSizePixels("y",ya),d=h,u=.85*c,p=this.buildYAxisTicks("major").map((t=>t.label)).reduce(((t,e)=>Math.max(t,e.length)),0)*c*.5;let g=0,m=0,f=r,y=o;if(s){const t=this.buildXAxisTicks("major"),e=t[0].label.length*h*.6,i=t[t.length-1].label.length*h*.6,s=this.config.x_axis.labels.styles["text-anchor"],a="end"===s?e:"start"===s?0:e/2,o="start"===s?i:"end"===s?0:i/2;f=Math.max(f,r+n+d),y=Math.max(y,a),m=Math.max(m,o)}return a&&"state_bands"!==this.config.sparkline.show.chart_type&&(y=Math.max(y,o+l+p),g=Math.max(g,u/2),f=Math.max(f,u/2)),{t:g,r:m,b:f,l:y,x:y,y:g}}calculateBinsPerHour(t){const e=t.period[t.period.type],i=e.bins.per_hour;if("auto"!==i)return i;const s=[1/24,1/12,.125,1/6,.25,.5,1,2,3,4,6,12],a=t.sparkline.show.chart_type,r=("radial_barcode"===a?Math.PI*t.width:t.width)/({line:1,area:1,dots:2,bar:2,barcode:2,equalizer:2,graded:2,radial_barcode:5.6}[a]*{low:2,medium:1,high:.5}[e.bins.density])/e.duration.hour;for(let o=s.length-1;o>=0;o-=1)if(s[o]<=r)return s[o];return s[0]}calculateSharedBinsPerHour(){if(1!==this.sparklineSeries.items.length)return Math.min(...this.sparklineSeries.items.map((t=>this.calculateBinsPerHour(t.config))))}buildGraphConfig(t,e=void 0){const i=bt.mergeDeep({},t.period),s=t.sparkline.show.chart_type,a="state_bands"===s?{...t.sparkline,state_map:this.stateBandsStateMap}:t.sparkline,r=bt.mergeDeep({},t.y_axis),o=t.sparkline.colorstops?.scales?.default;return"real_time"===i.type&&["bar","equalizer"].includes(s)&&void 0!==o&&(r.lower_bound=Number(o.min),r.upper_bound=Number(o.max)),"real_time"!==i.type&&(i[i.type].bins.per_hour="state_bands"===s?1:e??this.calculateBinsPerHour(t)),{width:this.svg.width,height:this.svg.height,geometry:{line_width:this.svg.line_width,column_spacing:this.svg.column_spacing},period:i,sparkline:a,x_axis:{...t.x_axis,labels:{...t.x_axis.labels,max_length:this.xAxisLabelLength}},y_axis:r}}updateRuntimeConfig(){if(super.updateRuntimeConfig(),this.configChanged&&"calendar"===this.config.period.type&&"day"===this.config.period.calendar.period&&Number(this.config.period.calendar.duration.hour)<24){const t=this.config.period.calendar.duration.hour;this.config.period.calendar.duration.hour=24,console.warn(`[FHS sparkline] calendar day duration '${t}' hours is shorter than one day; using 24 hours`)}if(["grid","axis","tickmarks","labels"].forEach((t=>{const e=this.config.sparkline.show[t];"boolean"==typeof e&&(this.config.sparkline.show[t]={x:e,y:e})})),this.configChanged&&(["bar","equalizer"].forEach((t=>{const e=this.config.sparkline[t].background,i=e.show.item_style;if(e.styles=da.toStyleDict(e.styles),!["none","fixed","colorstopsegments","lineargradient","colorstopgradient"].includes(i))throw new Error(`[sparklines] sparkline.${t}.background.show.item_style must be none, fixed, colorstopsegments, lineargradient or colorstopgradient`);if(!("colorstopsegments"!==i&&"lineargradient"!==i&&"colorstopgradient"!==i||"boolean"==typeof e[i].fill&&"boolean"==typeof e[i].stroke))throw new Error(`[sparklines] sparkline.${t}.background.${i}.fill and stroke must be boolean`)})),this.config.sparkline.bar.foreground.styles=da.toStyleDict(this.config.sparkline.bar.foreground.styles)),this.configChanged){const t=void 0!==this.config.y_axis.lower_bound;if(t!==(void 0!==this.config.y_axis.upper_bound))throw new Error("[sparklines] y_axis.lower_bound and y_axis.upper_bound must be configured together");if(t&&(!Number.isFinite(Number(this.config.y_axis.lower_bound))||!Number.isFinite(Number(this.config.y_axis.upper_bound))))throw new Error("[sparklines] y_axis.lower_bound and y_axis.upper_bound must be numeric");if(t&&Number(this.config.y_axis.lower_bound)>=Number(this.config.y_axis.upper_bound))throw new Error("[sparklines] y_axis.lower_bound must be smaller than y_axis.upper_bound")}if(this.configChanged&&"real_time"===this.config.period.type&&["bar","equalizer"].includes(this.config.sparkline.show.chart_type)){if(void 0===this.config.sparkline.colorstops.scales?.default)throw new Error(`[sparklines] real-time ${this.config.sparkline.show.chart_type} requires color_stops.scales.default`);if(void 0===this.config.sparkline.colorstops.scales.default.min||void 0===this.config.sparkline.colorstops.scales.default.max)throw new Error(`[sparklines] real-time ${this.config.sparkline.show.chart_type} requires color_stops.scales.default.min and max`)}const t="real_time"===this.config.period.type?1:Number(this.config.period[this.config.period.type].duration.hour);if(this.historyDurationReady="real_time"===this.config.period.type||Number.isFinite(t)&&t>0,this.configChanged){const t=JSON.stringify(this.config.period);t!==this.historyPeriodSignature&&(this.historySeries||this.historyPromise)&&(this.historyResynchronizationRequested=!0,this.historyDurationReady&&!this.acceptedHistoryContainsRange(this.sparklineSeries.defaultItem,this.getHistoryRange(this.sparklineSeries.defaultItem))?(this.historyLoading=!0,this.preserveGraphWhileHistoryLoads=void 0!==this.historySeries,window.clearTimeout(this.binBoundaryTimer),window.clearTimeout(this.calendarRangeTimer),this.clearTooltip()):(this.historyLoading=!1,this.preserveGraphWhileHistoryLoads=!1)),this.historyPeriodSignature=t}if(this.card.dev.debug&&this.configChanged&&console.log("[FHS sparkline runtime period]",{cardId:this.cardId,sparklineId:this.config.id,periodType:this.config.period.type,durationHours:"rolling_window"===this.config.period.type?this.config.period.rolling_window.duration.hour:this.config.period.calendar.duration.hour,historyResynchronizationRequested:this.historyResynchronizationRequested}),this.preserveGraphWhileHistoryLoads)return;const e=JSON.stringify([this.card._hass.locale,this.card._hass.config.time_zone]);if(this.xAxisLabelLocaleKey!==e){const t=this.card._hass.locale,i=this.card._hass.config,s=[];for(let e=0;e<12;e+=1){const a=new Date(Date.UTC(2025,e,21,12,21));s.push(Mr(a,t,i).replace(/\s/g,"").length)}for(let e=0;e<24;e+=1){const a=new Date(Date.UTC(2025,6,21,e,21));s.push(Cr(a,t,i).replace(/\s/g,"").length)}this.xAxisLabelLength=Math.max(...s),this.xAxisLabelLocaleKey=e}if("state_bands"===this.config.sparkline.show.chart_type){const t=this.card.entities[this.entity_index];this.stateBandsStateMap={...this.config.sparkline.state_map,map:this.config.sparkline.state_map.map.map((e=>{const i=String(e.state??e.value),s={...t,state:i},a=this.card._hass.formatEntityState?.(t,i),r=this.card._hass.formatEntityState?.(s),o=Ur(this.card._hass.localize,s,this.card._hass.locale,[],this.card._hass.config,this.card._hass.entities),n=[a,r,o].find((t=>void 0!==t&&t!==i))??a??r??o;return{...e,display_label:e.label??n??e.display_label}}))}}if(this.svg=this.calculateSvgDimensions(this.config),this.configuredGraphMargin=this.svg.margin,this.axisMargin={t:0,r:0,b:0,l:0,x:0,y:0},this.config.svg=this.svg,this.sparklineSeries.items.forEach(((t,e)=>{const i=void 0===this.config.series?{}:this.config.series[e];t.config=bt.mergeDeep({},this.config,i),delete t.config.id,delete t.config.series})),!this.historyDurationReady)return window.clearTimeout(this.binBoundaryTimer),window.clearTimeout(this.calendarRangeTimer),this.historyLoading=!1,this.preserveGraphWhileHistoryLoads=!1,this.graphConfig=void 0,this.sparklineSeries.clearGraphs(),this.graphReady=!1,this.series=[],this.stats={},void this.clearTooltip();this.gradeValues=[],this.config.sparkline.colorstops.colors.map(((t,e)=>this.gradeValues[e]=t.value)),this.gradeRanks=[],this.config.sparkline.colorstops.colors.map(((t,e)=>{const i="rank_order"===this.config.sparkline.show.chart_variant&&void 0!==t.rank?t.rank:e;return this.gradeRanks[i]||(this.gradeRanks[i]={value:[],rangeMin:[],rangeMax:[]}),this.gradeRanks[i].rank=i,this.gradeRanks[i].color=t.color,this.gradeRanks[i].value.push(t.value),this.gradeRanks[i].rangeMin.push(t.value),this.gradeRanks[i].rangeMax.push(this.config.sparkline.colorstops.colors[e+1]?.value||1/0),!0}));const i=this.calculateSharedBinsPerHour();this.graphConfig=this.buildGraphConfig(this.config,i),this.sparklineSeries.items.forEach((t=>{const e=this.buildGraphConfig(t.config,i);this.sparklineSeries.createGraph(t,this.svg.width,this.svg.height,this.axisMargin,this.configuredGraphMargin,e,this.gradeValues,this.gradeRanks,e.sparkline.state_map??{})})),this.graphReady=!1}setEntities(t,e){this.sparklineSeries.items.forEach((i=>{i.entity=e[i.entity_index],i.entityConfig=t[i.entity_index]})),this.setState(this.sparklineSeries.defaultItem.entity,this.sparklineSeries.defaultItem.entityConfig),this.sparklineSeries.items.slice(1).forEach((t=>this.setSeriesState(t)))}setSeriesState(t){const{config:e,entity:i}=t,s="real_time"===e.period.type,a="rolling_window"===e.period.type||"calendar"===e.period.type&&0===e.period.calendar.offset,r=void 0!==t.historyEntityId&&t.historyEntityId!==i.entity_id;if(t.historyEntityId=i.entity_id,r&&(t.historySeries=void 0,t.rows=[],t.historyRangeStart=void 0,t.historyRangeEnd=void 0,t.historyRefreshAt=0,t.historyResynchronizationRequested=!s,t.historyLoading=!s&&this.historyDurationReady,t.preserveGraphWhileHistoryLoads=!1,this.clearTooltip()),s)return t.rows=[{state:this.getEntityNumericState(t,i)}],void this.updateGraphFromSeries();this.historyDurationReady?(t.historySeries&&!t.preserveGraphWhileHistoryLoads?(a&&this.addCurrentEntityToHistory(t,i),t.rows=t.historySeries,this.updateGraphFromSeries()):t.rows=[],this.fetchHistoryIfNeeded(t)):t.rows=[]}setState(t,e){super.setState(t,e);const i="real_time"===this.config.period.type,s="rolling_window"===this.config.period.type||"calendar"===this.config.period.type&&0===this.config.period.calendar.offset,a=void 0!==this.historyEntityId&&this.historyEntityId!==t.entity_id;if(this.historyEntityId=t.entity_id,a&&(window.clearTimeout(this.binBoundaryTimer),window.clearTimeout(this.calendarRangeTimer),this.historySeries=void 0,this.series=[],this.stats={},this.historyRangeStart=void 0,this.historyRangeEnd=void 0,this.historyRefreshAt=0,this.historyResynchronizationRequested=!i,this.historyLoading=!i&&this.historyDurationReady,this.preserveGraphWhileHistoryLoads=!1,this.clearTooltip()),i){window.clearTimeout(this.binBoundaryTimer),window.clearTimeout(this.calendarRangeTimer);const e=this.getEntityNumericState(this.sparklineSeries.defaultItem,t);return this.series=[{state:e}],void this.updateGraphFromSeries()}this.historyDurationReady?(this.historySeries&&!this.preserveGraphWhileHistoryLoads?(s&&this.addCurrentEntityToHistory(this.sparklineSeries.defaultItem,t),this.series=this.historySeries,this.updateGraphFromSeries(),this.tooltipVisible&&this.pointerEvent&&this.updateActivePointer(this.pointerEvent)):this.series=[],this.fetchHistoryIfNeeded(this.sparklineSeries.defaultItem),this.preserveGraphWhileHistoryLoads||(this.scheduleBinBoundaryRefresh(),this.scheduleCalendarRangeRefresh())):this.series=[]}buildCurrentHistoryRow(t,e){const i="state_bands"===t.config.sparkline.show.chart_type,s=i?this.stateBandsStateMap.map.find((t=>String(t.state)===String(e.state))):void 0,a=i?Number(s.value):this.getEntityNumericState(t,e),r=i?e.last_changed:(new Date).toISOString();return{...e,state:a,haState:e.state,last_changed:r,last_updated:r}}addCurrentEntityToHistory(t,e){if("calendar"===t.config.period.type&&t.config.period.calendar.offset<0)return;const i=this.buildCurrentHistoryRow(t,e);t.historySeries[t.historySeries.length-1].last_changed!==i.last_changed&&t.historySeries.push(i)}pruneLiveHistoryToActiveWindow(){const t=60/this.Graph.points*60*1e3,e=Date.now(),i="rolling_window"===this.config.period.type?this.config.period.rolling_window.duration.hour:this.config.period.calendar.duration.hour,s="state_bands"===this.config.sparkline.show.chart_type?this.getHistoryRange(this.sparklineSeries.defaultItem).start.getTime():"rolling_window"===this.config.period.type?Math.floor(e/t)*t+t-60*i*60*1e3:this.getHistoryRange(this.sparklineSeries.defaultItem).start.getTime(),a=this.historySeries.concat().sort(((t,e)=>new Date(t.last_changed).getTime()-new Date(e.last_changed).getTime()));let r;const o=[];return a.forEach((t=>{new Date(t.last_changed).getTime()<s?r=t:o.push(t)})),this.historySeries=r?[r,...o]:o,this.series=this.historySeries,{start:s,end:e}}scheduleBinBoundaryRefresh(){window.clearTimeout(this.binBoundaryTimer);if(!("rolling_window"===this.config.period.type||"calendar"===this.config.period.type&&0===this.config.period.calendar.offset))return;if(!this.entity)return;const t="state_bands"===this.config.sparkline.show.chart_type?this.getRefreshIntervalMs(this.config.sparkline.state_bands.update_interval):60/this.Graph.points*60*1e3,e=t-Date.now()%t+10;this.binBoundaryTimer=window.setTimeout((()=>{this.updateGraphFromSeries(),this.tooltipVisible&&this.pointerEvent&&this.updateActivePointer(this.pointerEvent),this.card.cardEntities.updateSparklineEntities(this.card.resolvedEntityConfigs,this.card.entities,this.card.cardTools.getBySection("sparklines")),this.card.setHass(this.card._hass),this.scheduleBinBoundaryRefresh()}),e)}scheduleCalendarRangeRefresh(){if(window.clearTimeout(this.calendarRangeTimer),"calendar"!==this.config.period.type)return;const t=new Date,e=new Date(t);e.setHours(24,0,0,0);const i=e.getTime()-t.getTime()+10;this.calendarRangeTimer=window.setTimeout((()=>{this.sparklineSeries.items.forEach((t=>{const e=this.getHistoryRange(t),i=e.start.getTime()!==t.historyRangeStart||e.end.getTime()!==t.historyRangeEnd;i&&t.historyPromise?t.historyPromise.finally((()=>this.fetchHistoryIfNeeded(t))):i&&this.fetchHistoryIfNeeded(t)})),this.scheduleCalendarRangeRefresh()}),i)}disconnected(){window.clearTimeout(this.binBoundaryTimer),window.clearTimeout(this.calendarRangeTimer)}connected(){this.sparklineSeries.items.forEach((t=>{const e="rolling_window"===t.config.period.type||"calendar"===t.config.period.type&&0===t.config.period.calendar.offset;t.historySeries&&e&&(t.historyResynchronizationRequested=!0)}))}hassConnected(){this.connected()}requiresHassUpdate(){return this.sparklineSeries.items.some((t=>t.historyResynchronizationRequested))}getRefreshIntervalMs(t){if("number"==typeof t)return 1e3*t;const e=t.match(/^(\d+(?:\.\d+)?)(ms|s|sec|m|min|h|hour)$/),i=Number(e[1]),s=e[2];return"ms"===s?i:"s"===s||"sec"===s?1e3*i:"m"===s||"min"===s?60*i*1e3:60*i*60*1e3}getHistoryRange(t){const{config:e}=t,i="rolling_window"===e.period.type?e.period.rolling_window.duration.hour:e.period.calendar.duration.hour,s=new Date;if("calendar"===e.period.type&&"day"===e.period.calendar.period){const t=new Date(s);t.setHours(0,0,0,0);const a=e.period.calendar.offset??0,r=(i-24)/24;return t.setDate(t.getDate()+a-r),{start:t,end:new Date(t.getTime()+60*i*60*1e3)}}return{start:new Date(s.getTime()-60*i*60*1e3),end:s}}acceptedHistoryContainsRange(t,e){if(void 0===t.historySeries)return!1;return"rolling_window"===t.config.period.type||"calendar"===t.config.period.type&&0===t.config.period.calendar.offset?t.historyRangeStart<=e.start.getTime():t.historyRangeStart<=e.start.getTime()&&t.historyRangeEnd>=e.end.getTime()}buildHistoryPath(t,e,i){const s=encodeURIComponent(e.toISOString()),a=encodeURIComponent(i.toISOString());return`history/period/${s}?filter_entity_id=${encodeURIComponent(t)}&end_time=${a}&minimal_response&no_attributes`}fetchHistoryIfNeeded(t){if(!this.historyDurationReady)return;const{config:e,entity:i}=t,s=Date.now(),a=this.getHistoryRange(t),r="calendar"===e.period.type,o=r&&e.period.calendar.offset<0,n=this.acceptedHistoryContainsRange(t,a),l=r&&!n,h=void 0!==e.history.refresh_interval&&s>=t.historyRefreshAt;if(this.card.dev.debug&&console.log("[FHS sparkline history decision]",{cardId:this.cardId,sparklineId:e.id,durationHours:"rolling_window"===e.period.type?e.period.rolling_window.duration.hour:e.period.calendar.duration.hour,historyPromiseActive:void 0!==t.historyPromise,historySeriesRows:t.historySeries?.length,historyResynchronizationRequested:t.historyResynchronizationRequested,representedRange:n,rangeStart:a.start.toISOString(),rangeEnd:a.end.toISOString()}),t.historyPromise)return;if(o&&n)return;if(t.historySeries&&!l&&!t.historyResynchronizationRequested&&!h)return;n||(t.historyLoading=!0,this.clearTooltip(),this.card.requestUpdate());const c=i.entity_id,d=this.buildHistoryPath(c,a.start,a.end),u=this.historyPeriodSignature;t.historyPromise=this.card._hass.callApi("GET",d).then((s=>{const r=0===s.length?[]:s[0],o=u===this.historyPeriodSignature,n=c===t.historyEntityId;this.card.dev.debug&&console.log("[FHS sparkline history response]",{cardId:this.cardId,sparklineId:e.id,requestedRangeStart:a.start.toISOString(),requestedRangeEnd:a.end.toISOString(),historyRows:r.length,requestedEntityId:c,requestMatchesActivePeriod:o,requestMatchesActiveEntity:n}),o&&n&&(t.historySeries=this.buildHistorySeries(t,r,i,a.end),t.historyRangeStart=a.start.getTime(),t.historyRangeEnd=a.end.getTime(),t.historyLoading=!1,t.preserveGraphWhileHistoryLoads&&(t.preserveGraphWhileHistoryLoads=!1,this.updateRuntimeConfig()),this.addCurrentEntityToHistory(t,i),t.rows=t.historySeries,this.updateGraphFromSeries(),this.card.cardEntities.updateSparklineEntities(this.card.resolvedEntityConfigs,this.card.entities,this.card.cardTools.getBySection("sparklines")),void 0!==e.history.refresh_interval&&(t.historyRefreshAt=Date.now()+this.getRefreshIntervalMs(e.history.refresh_interval)),t.historyResynchronizationRequested=!0,this.card.setHass(this.card._hass),t.historyResynchronizationRequested=!1)})).catch((e=>{throw t.historyResynchronizationRequested||(t.historyLoading=!1,this.card.requestUpdate()),e})).finally((()=>{t.historyPromise=void 0,t.historyResynchronizationRequested&&this.fetchHistoryIfNeeded(t)}))}buildHistorySeries(t,e,i,s){const a="calendar"===t.config.period.type&&t.config.period.calendar.offset<0?e:e.concat([i]);if("state_bands"===t.config.sparkline.show.chart_type)return a.map((t=>{const e=this.stateBandsStateMap.map.find((e=>String(e.state)===String(t.state)));return{...t,state:Number(e.value),haState:t.state}}));return a.filter((t=>t&&Number.isFinite(Number(t.state)))).map((t=>{const e=Number(t.state);return bt.mergeDeep(t,{state:e,haState:t.state})}))}getEntityNumericState(t,e){return t.entityConfig?.attribute?Number(e.attributes[t.entityConfig.attribute]):Number(e.state)}updateMultipleSeriesGraphs(){this.sparklineSeries.items.forEach((t=>{if(t.graph.clearSharedYAxisBounds(),"real_time"!==t.config.period.type){const e=this.getHistoryRange(t);t.graph.hours=(e.end.getTime()-e.start.getTime())/36e5}t.graph.update(t.rows)}));const t=this.sparklineSeries.items.filter((t=>t.graph.coords.length>0));if(this.graphReady=t.length===this.sparklineSeries.items.length,!this.graphReady)return void(this.stats={});const e=Math.min(...t.map((t=>t.graph.min))),i=Math.max(...t.map((t=>t.graph.max)));t.forEach((t=>{t.graph.setSharedYAxisBounds(e,i),t.graph.update(t.rows)}));const s=this.calculateAxisMargin(),a={t:0,r:0,b:0,l:0};this.sparklineSeries.items.forEach((t=>{if("dots"===t.config.sparkline.show.chart_type||!0===t.config.sparkline.show.points||!0===t.config.sparkline.line.show_dots||!0===t.config.sparkline.area.show_dots){const e=eo.calculateSvgDimension(t.config.sparkline.dots.radius)+this.svg.line_width/4;a.t=Math.max(a.t,e),a.r=Math.max(a.r,e),a.b=Math.max(a.b,e),a.l=Math.max(a.l,e)}})),t.forEach((t=>{t.graph.setGraphAreas(s,this.configuredGraphMargin,t.graph.coords.length,a),t.graph.update(t.rows)})),this.axisMargin=s,this.area=[],this.areaMinMax=[],this.line=[],this.points=[],this.gradient=[],this.sparklineSeries.items.forEach(((t,e)=>{const{graph:i,config:s}=t,a=s.sparkline.show.chart_type;if(["line","area"].includes(a)){const t=i.getPath();!1!==s.sparkline.show.line&&(this.line[e]=t),"area"===a&&(this.area[e]=i.getArea(t))}"dots"!==a&&!0!==s.sparkline.show.points&&!0!==s.sparkline.line.show_dots&&!0!==s.sparkline.area.show_dots||(this.points[e]=i._calcY(i.coords).map(((t,e)=>[t[0],t[1],t[2],e])))}));const r=this.Graph,o=r._calcY([[r.drawArea.x,0,0]])[0][1];this.animationBaselineY=Math.min(r.drawArea.y+r.drawArea.height,Math.max(r.drawArea.y,o)),this.stats=this.calculateStatistics(this.series)}updateGraphFromSeries(){if(this.sparklineSeries.items.length>1)return void this.updateMultipleSeriesGraphs();const t=this.config.sparkline.show.chart_type;if(this.card.dev.fakeData&&"state_bands"!==t){let t=40;this.series.forEach(((e,i)=>{i<this.series.length/2&&(t-=4*i),i>this.series.length/2&&(t+=3*i),e.state=t,e.haState=t}))}const e=("rolling_window"===this.config.period.type||"calendar"===this.config.period.type&&0===this.config.period.calendar.offset)&&this.historySeries?this.pruneLiveHistoryToActiveWindow():void 0;if("real_time"!==this.config.period.type){const t=this.getHistoryRange(this.sparklineSeries.defaultItem);this.Graph.hours=(t.end.getTime()-t.start.getTime())/36e5}if(this.graphReady=this.sparklineSeries.updateGraphs()[0],!this.graphReady)return void(this.stats={});const i=this.calculateAxisMargin();if(this.Graph.setGraphAreas(i,this.configuredGraphMargin,this.Graph.coords.length)&&(this.axisMargin=i,this.graphReady=this.sparklineSeries.updateGraphs()[0]),"state_bands"===t)this.animationBaselineY=this.Graph.drawArea.y+this.Graph.drawArea.height;else{const t=this.Graph._calcY([[this.Graph.drawArea.x,0,0]])[0][1];this.animationBaselineY=Math.min(this.Graph.drawArea.y+this.Graph.drawArea.height,Math.max(this.Graph.drawArea.y,t))}if(this.area=[],this.areaMinMax=[],this.line=[],this.bar=[],this.equalizer=[],this.points=[],this.barcodeChart=[],this.barcodeChartBackground=[],this.radialBarcodeChart=[],this.radialBarcodeChartBackground=[],this.graded=[],this.stateBands="state_bands"===t&&this.historySeries?this.Graph.getStateBands():[],this.Graph.coords.length>0){if(["area","line"].includes(t)){this.linePath=this.Graph.getPath(),!1!==this.entityConfig?.show_line&&(this.line[0]=this.linePath),"area"===t?(this.areaPath=this.Graph.getArea(this.linePath),this.area[0]=this.areaPath):this.areaPath=void 0;("line"===t?!0===this.config.sparkline?.line?.show_minmax:!0===this.config.sparkline?.area?.show_minmax)?(this.lineMinPath=this.Graph.getPathMin(),this.lineMaxPath=this.Graph.getPathMax(),this.areaMinMaxPath=this.Graph.getAreaMinMax(this.lineMinPath,this.lineMaxPath),this.areaMinMax[0]=this.areaMinMaxPath):(this.lineMinPath=void 0,this.lineMaxPath=void 0,this.areaMinMaxPath=void 0)}else this.linePath=void 0,this.lineMinPath=void 0,this.lineMaxPath=void 0,this.areaPath=void 0,this.areaMinMaxPath=void 0;"dots"!==t&&!0!==this.config.sparkline.show.points&&!0!==this.config.sparkline?.line?.show_dots&&!0!==this.config.sparkline?.area?.show_dots||(this.points[0]=this.Graph.getPoints()),"bar"===t?(this.bar[0]=this.Graph.getBars(0,1,this.svg.column_spacing,this.svg.row_spacing),"real_time"===this.config.period.type&&(this.bar[0][0].x=this.Graph.drawArea.x+(this.Graph.drawArea.width-this.bar[0][0].width)/2)):"equalizer"===t?(this.Graph.levelCount=this.config.sparkline.equalizer.value_buckets,this.Graph.valuesPerBucket=(this.Graph.max-this.Graph.min)/this.config.sparkline.equalizer.value_buckets,this.equalizer[0]=this.Graph.getEqualizer(0,1,this.svg.column_spacing,this.svg.row_spacing)):"graded"===t?(this.Graph.levelCount=this.config.sparkline.equalizer.value_buckets,this.Graph.valuesPerBucket=(this.Graph.max-this.Graph.min)/this.config.sparkline.equalizer.value_buckets,this.graded[0]=this.Graph.getGrades(0,1,this.svg.column_spacing,this.svg.row_spacing)):"radial_barcode"===t?(this.radialBarcodeChartBackground[0]=this.Graph.getRadialBarcodeBackground(0,1,this.svg.column_spacing,this.svg.row_spacing),this.radialBarcodeChart[0]=this.Graph.getRadialBarcode(0,1,this.svg.column_spacing,this.svg.row_spacing),this.Graph.radialBarcodeBackground=this.radialBarcodeChartBackground[0],this.Graph.radialBarcode=this.radialBarcodeChart[0]):"barcode"===t&&(this.barcodeChart[0]=this.Graph.getBarcode(0,1,this.svg.column_spacing,this.svg.row_spacing))}if(this.config.sparkline.colorstops.colors.length>0&&!this.entityConfig?.color?this.gradient[0]=this.Graph.computeGradient(Vn(this.config.sparkline.colorstops.colors,this.config.sparkline.colorstops_transition),this.config.sparkline.state_values.logarithmic):this.gradient=[],"real_time"===this.config.period.type){const t=Number(this.series[0].state);this.stats={min:t,avg:t,max:t,min_time:this.entity.last_changed,max_time:this.entity.last_changed}}else this.stats=this.calculateStatistics(this.series,e)}calculateStatistics(t,e){const i=t.filter((t=>t&&Number.isFinite(Number(t.state)))).concat().sort(((t,e)=>new Date(t.last_changed).getTime()-new Date(e.last_changed).getTime()));if(0===i.length)return{};const s=e?e.start:new Date(i[0].last_changed).getTime(),a=e?e.end:Date.now(),r=i.filter((t=>new Date(t.last_changed).getTime()<=a)),o=r.map((t=>Number(t.state))),n=Math.min(...o),l=Math.max(...o),h=r.find((t=>Number(t.state)===n)),c=r.find((t=>Number(t.state)===l)),d=new Date(h.last_changed).getTime(),u=new Date(c.last_changed).getTime(),p=d<s?new Date(s).toISOString():h.last_changed,g=u<s?new Date(s).toISOString():c.last_changed;let m=0,f=0;r.forEach(((t,e)=>{const i=Number(t.state),o=new Date(t.last_changed).getTime(),n=e<r.length-1?new Date(r[e+1].last_changed).getTime():a,l=Math.max(o,s),h=Math.min(n,a),c=Math.max(0,h-l);m+=i*c,f+=c}));return{min:n,avg:m/f,max:l,min_time:p,max_time:g}}mouseEventToPoint(t){let e=this.elements.svg.createSVGPoint();e.x=t.touches?t.touches[0].clientX:t.clientX,e.y=t.touches?t.touches[0].clientY:t.clientY;const i=this.elements.svg.getScreenCTM().inverse();return e=e.matrixTransform(i),e}pointToGraphX(t){const e=t.x;return Math.max(0,Math.min(e,this.svg.width))}snapPointerXToGraphPoint(t){const e=this.Graph.coords;if(!e||0===e.length)return t;let i=e[0][0],s=Math.abs(t-i);for(let a=1;a<e.length;a+=1){const r=e[a][0],o=Math.abs(t-r);o<s&&(i=r,s=o)}return i}getRadialBarcodePointIndexFromEvent(t){const e=t?.touches?.[0]??t?.changedTouches?.[0]??t;if(void 0!==e?.clientX&&void 0!==e?.clientY){const t=this.elements.svg.getRootNode(),i=t instanceof ShadowRoot?t:document,s=Array.from(i.elementsFromPoint(e.clientX,e.clientY)).find((t=>t?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin"))),a=s?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin");if(a)return Number(a.dataset.pointIndex);const r=(this.elements.svg.querySelector(".sparkline-radial-barcode__bg-bin")?.parentNode??this.elements.svg).getBoundingClientRect(),o=r.left+r.width/2,n=r.top+r.height/2,l=(Math.atan2(e.clientY-n,e.clientX-o)*(180/Math.PI)+360+90)%360,h=this.elements.svg.querySelectorAll(".sparkline-radial-barcode__bg-bin").length;if(0===h)return NaN;const c=360/h,d=Math.floor(l/c);return Math.min(Math.max(0,d),h-1)}const i=t?.target??t?.currentTarget,s=i?.closest?.(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin");return s?Number(s.dataset.pointIndex):NaN}getPointIndexFromX(t){const e=this.Graph.coords;if(!e||0===e.length)return;let i=0,s=Math.abs(t-e[0][0]);for(let a=1;a<e.length;a+=1){const r=Math.abs(t-e[a][0]);r<s&&(i=a,s=r)}return i}getTooltipLabel(t){const e=this.card._hass.localize(`ui.panel.developer-tools.statistics.${"avg"===t?"mean":t}`);return e?e.charAt(0).toUpperCase()+e.slice(1):t}formatTooltipStat(t,e){const i=this.getTooltipLabel(t);if(void 0===e)return{label:i,value:"",uom:""};const s=this.card.entities[this.entity_index],a=this.card.resolvedEntityConfigs[this.entity_index],r=Object.create(sn.prototype);r.entity=s,r.entityConfig=a,r.config=a,r.card=this.card,r.state="",r.uom="",r.buildStateAndUom();const o=this.card._hass.locale.language,n=new Intl.NumberFormat(o).formatToParts(1.1).find((t=>"decimal"===t.type)).value,l=r.state.lastIndexOf(n),h=-1===l?0:r.state.length-l-1;return{label:i,value:new Intl.NumberFormat(o,{minimumFractionDigits:h,maximumFractionDigits:h}).format(e),uom:r.uom}}formatSeriesTooltipValue(t,e){if(void 0===e)return{value:"",uom:""};const i=Object.create(sn.prototype);i.entity=t.entity,i.entityConfig=t.entityConfig,i.config=t.entityConfig,i.state="",i.uom="",i.card=this.card,i.buildStateAndUom();const s=this.card._hass.locale.language,a=new Intl.NumberFormat(s).formatToParts(1.1).find((t=>"decimal"===t.type)).value,r=i.state.lastIndexOf(a),o=-1===r?0:i.state.length-r-1;return{value:new Intl.NumberFormat(s,{minimumFractionDigits:o,maximumFractionDigits:o}).format(e),uom:i.uom}}updateTooltipFromStateBandSegment(t){const e=this.card._hass.locale,i=this.card._hass.config,s=this.elements.containerRect||this.elements.container.getBoundingClientRect(),a=t.end.getTime()-t.start.getTime();let r=Math.floor(a/1e3);const o=Math.floor(r/86400);r-=86400*o;const n=Math.floor(r/3600);r-=3600*n;const l=Math.floor(r/60),h=r-60*l;this.activeX=t.x+t.width/2,this.tooltip={entity:this.entity_index,index:this.Graph.stateBandSegments.indexOf(t),title:t.label,min:{label:"Start",value:Ir(t.start,e,i),uom:""},avg:{label:"End",value:Ir(t.end,e,i),uom:""},max:{label:"Duration",value:Rr(e,{days:o,hours:n,minutes:l,seconds:h}),uom:""},containerWidth:s.width,containerHeight:s.height}}updateTooltipFromPointIndex(t,e){const i=this.Graph.bucketMeta[t],s=this.Graph.coords[t],a=this.card._hass.locale,r=this.card._hass.config,o=this.elements.svg?.getBoundingClientRect(),n=this.card.shadowRoot.getElementById("container")?.getBoundingClientRect();if(e?.currentTarget?.getBoundingClientRect(),!i||!s||!n)return void(this.tooltip={});const l=i.start,h=0===l.getHours()&&0===l.getMinutes()&&0===l.getSeconds()&&0===l.getMilliseconds()?Mr(l,a,r):Cr(l,a,r);if(this.sparklineSeries.items.length>1){const i=this.sparklineSeries.items.map(((t,e)=>{const i=t.graph.coords.reduce(((e,i,a)=>Math.abs(i[0]-s[0])<Math.abs(t.graph.coords[e][0]-s[0])?a:e),0),a=t.graph.bucketMeta[i],r=this.formatSeriesTooltipValue(t,a.avg);return{label:t.config.name??t.entity.attributes.friendly_name??t.id,color:t.config.color??t.entityConfig.color??t.config.sparkline.line_color[e],...r}})),a=o?o.width/this.svg.width:1,r=o?o.height/this.svg.height:1,l=e?.touches?e.touches[0]:e,c=void 0!==l?.clientX?l.clientX-n.left:void 0!==this.tooltip.x?this.tooltip.x:o?o.left-n.left+s[0]*a:s[0],d=void 0!==l?.clientY?l.clientY-n.top:void 0!==this.tooltip.y?this.tooltip.y:o?o.top-n.top+s[1]*r:s[1];return void(this.tooltip={entity:this.entity_index,index:t,x:c,y:d,title:h,series:i,containerWidth:n.width,containerHeight:n.height})}const c=this.formatTooltipStat("min",i.min),d=this.formatTooltipStat("avg",i.avg),u=this.formatTooltipStat("max",i.max),p=o?o.width/this.svg.width:1,g=o?o.height/this.svg.height:1,m=e?.touches?e.touches[0]:e,f=void 0!==m?.clientX?m.clientX-n.left:void 0!==this.tooltip.x?this.tooltip.x:o?o.left-n.left+s[0]*p:s[0],y=void 0!==m?.clientY?m.clientY-n.top:void 0!==this.tooltip.y?this.tooltip.y:o?o.top-n.top+s[1]*g:s[1];this.tooltip={entity:this.entity_index,index:t,x:f,y:y,title:h,min:c,avg:d,max:u,count:i.count,containerWidth:n.width,containerHeight:n.height}}updateTooltipFromRadialBarcode(t,e){this.activeX=void 0,this.elements.containerRect=this.elements.container.getBoundingClientRect();const i=this.elements.svg.getBoundingClientRect(),s=i.width/this.svg.width,a=i.height/this.svg.height;this.elements.tooltipBounds={left:i.left-this.elements.containerRect.left+this.Graph.drawArea.x*s,top:i.top-this.elements.containerRect.top+this.Graph.drawArea.y*a,right:i.left-this.elements.containerRect.left+(this.Graph.drawArea.x+this.Graph.drawArea.width)*s,bottom:i.top-this.elements.containerRect.top+(this.Graph.drawArea.y+this.Graph.drawArea.height)*a},this.updateRadialActiveBinDom(t),this.updateActiveIndicatorDom(),this.updateTooltipFromPointIndex(t,e),this.updateTooltipContentDom(),this.updateTooltipPositionDom(e),this.updateTooltipVisibilityDom(!0)}clearTooltip(){this.tooltip={},this.tooltipVisible=!1}clearRadialTooltip(){this.clearTooltip(),this.updateTooltipVisibilityDom(!1),this.updateActiveIndicatorDom()}scheduleRadialHoverFrame(){this._radialRafId||(this._radialRafId=window.requestAnimationFrame((()=>{if(this._radialRafId=null,this._radialPendingLeave)return this._radialPendingLeave=!1,this._radialPendingPointIndex=void 0,this._radialPendingEvent=void 0,this.restoreRadialActiveBinDom(),void this.clearRadialTooltip();const t=this._radialPendingPointIndex,e=this._radialPendingEvent;this._radialPendingPointIndex=void 0,this._radialPendingEvent=void 0,Number.isFinite(t)&&this.updateTooltipFromRadialBarcode(t,e)})))}restoreRadialActiveBinDom(){const t=this.elements.svg?.querySelectorAll(".sparkline-radial-barcode__bin, .sparkline-radial-barcode__bg-bin");t&&t.forEach((t=>{if(!t.__fhsRadialOriginalStyle)return;const e=(e,i)=>{""===i?t.style.removeProperty(e):t.style.setProperty(e,i)};e("opacity",t.__fhsRadialOriginalStyle.opacity),e("filter",t.__fhsRadialOriginalStyle.filter),e("stroke-width",t.__fhsRadialOriginalStyle.strokeWidth)}))}updateRadialActiveBinDom(t){const e=this.elements.svg?.querySelectorAll(".sparkline-radial-barcode__bin");e&&e.forEach((e=>{e.__fhsRadialOriginalStyle||(e.__fhsRadialOriginalStyle={opacity:e.style.opacity,filter:e.style.filter,strokeWidth:e.style.strokeWidth});const i=t>=0&&Number(e.dataset.pointIndex)===t;e.style.setProperty("opacity",i?"1":"0.35"),e.style.setProperty("filter",i?"brightness(1.15)":"none"),e.style.setProperty("stroke-width",i?"2":"1")}))}updateActiveIndicatorDom(){const t=this.elements.activeIndicator;t&&(void 0!==this.activeX?(t.setAttribute("x1",`${this.activeX}`),t.setAttribute("x2",`${this.activeX}`),t.style.visibility="visible"):t.style.visibility="hidden")}updateTooltipVisibilityDom(t){this.tooltipVisible=t;const e=this.elements.tooltip;e&&(e.style.display=t?"block":"none")}updateTooltipPositionDom(t){const e=this.elements.tooltip,i=this.elements.containerRect||this.elements.container.getBoundingClientRect(),s=t?.touches?.[0]??t?.changedTouches?.[0]??t;if(!e||!i)return;if(void 0===s?.clientX||void 0===s?.clientY)return;let a=s.clientX-i.left,r=s.clientY-i.top;(t?.touches?.length>0||t?.changedTouches?.length>0)&&"radial_barcode"===this.config.sparkline.show.chart_type&&(a+=18,r-=28);const o=this.elements.tooltipBounds||{left:0,top:0,right:i.width,bottom:i.height};a=Math.max(o.left,Math.min(a,o.right)),r=Math.max(o.top,Math.min(r,o.bottom)),this.tooltip.x=a,this.tooltip.y=r,e.style.left=`${a}px`,e.style.top=`${r}px`}updateTooltipContentDom(){if(!this.elements.tooltip)return;const t=this.elements.tooltipTitle,e=this.elements.tooltipRows;t.textContent=this.tooltip.title??"",this.sparklineSeries.items.length>1?e.forEach(((t,e)=>{const i=this.tooltip.series[e];t.children[0].children[1].textContent=i.label,t.children[1].children[0].textContent=i.value,t.children[1].children[1].textContent=i.uom?` ${i.uom}`:""})):(e[0].children[0].textContent=this.tooltip.min?.label??"",e[0].children[1].children[0].textContent=this.tooltip.min?.value??"",e[0].children[1].children[1].textContent=this.tooltip.min?.uom?` ${this.tooltip.min.uom}`:"",e[1].children[0].textContent=this.tooltip.avg?.label??"",e[1].children[1].children[0].textContent=this.tooltip.avg?.value??"",e[1].children[1].children[1].textContent=this.tooltip.avg?.uom?` ${this.tooltip.avg.uom}`:"",e[2].children[0].textContent=this.tooltip.max?.label??"",e[2].children[1].children[0].textContent=this.tooltip.max?.value??"",e[2].children[1].children[1].textContent=this.tooltip.max?.uom?` ${this.tooltip.max.uom}`:"")}updateActivePointer(t){if(this.pointerEvent=t,"state_bands"===this.config.sparkline.show.chart_type){const e=this.pointToGraphX(this.mouseEventToPoint(t)),i=this.Graph.stateBandSegments.find((t=>e>=t.x&&e<=t.x+t.width));return i?(this.updateTooltipFromStateBandSegment(i),this.updateTooltipContentDom(),this.updateActiveIndicatorDom(),this.updateTooltipPositionDom(t),void this.updateTooltipVisibilityDom(!0)):(this.clearTooltip(),this.updateTooltipVisibilityDom(!1),void this.updateActiveIndicatorDom())}const e=this.pointToGraphX(this.mouseEventToPoint(t));this.activeX=this.snapPointerXToGraphPoint(e);const i=this.getPointIndexFromX(this.activeX);if(this.tooltip.index,void 0===i)return this.clearTooltip(),this.updateTooltipVisibilityDom(!1),void this.updateActiveIndicatorDom();this.updateTooltipFromPointIndex(i,t),this.updateTooltipContentDom(),this.updateActiveIndicatorDom(),this.updateTooltipPositionDom(t),this.updateTooltipVisibilityDom(!0)}updateTooltipFromPointer(t){const e=this.pointToGraphX(this.mouseEventToPoint(t)),i=this.getPointIndexFromX(e);void 0!==i?this.updateTooltipFromPointIndex(i,t):this.clearTooltip()}updateRadialActivePointer(t){const e=this.getRadialBarcodePointIndexFromEvent(t);if(!Number.isFinite(e))return this.clearTooltip(),this.updateTooltipVisibilityDom(!1),void this.updateActiveIndicatorDom();this.elements.containerRect=this.elements.container.getBoundingClientRect();const i=this.elements.svg.getBoundingClientRect(),s=i.width/this.svg.width,a=i.height/this.svg.height;this.elements.tooltipBounds={left:i.left-this.elements.containerRect.left+this.Graph.drawArea.x*s,top:i.top-this.elements.containerRect.top+this.Graph.drawArea.y*a,right:i.left-this.elements.containerRect.left+(this.Graph.drawArea.x+this.Graph.drawArea.width)*s,bottom:i.top-this.elements.containerRect.top+(this.Graph.drawArea.y+this.Graph.drawArea.height)*a},this.updateTooltipFromRadialBarcode(e,t)}attachPointerHandlers(){if(this.elements.svg=this.card.shadowRoot.getElementById(`sparkline-${this.cardId}-${this.index}`),this.elements.container=this.card.shadowRoot.getElementById("container"),this.elements.activeIndicator=this.card.shadowRoot.getElementById(`sparkline-active-indicator-${this.cardId}-${this.index}`),this.elements.tooltip=this.card.shadowRoot.getElementById(`sparkline-tooltip-${this.cardId}-${this.index}`),this.elements.tooltipTitle=this.elements.tooltip.querySelector(".sparkline-tooltip__title"),this.elements.tooltipRows=this.elements.tooltip.querySelectorAll(".sparkline-tooltip__row"),this.elements.containerRect=this.elements.container.getBoundingClientRect(),!this.elements.svg||"true"===this.elements.svg.dataset.pointerReady)return;const t="radial_barcode"===this.config.sparkline.show.chart_type;this.elements.svg.dataset.pointerReady="true",this.Frame2=this.Frame2||function(){this.rid=null,t?this.updateRadialActivePointer(this.pointerEvent):this.updateActivePointer(this.pointerEvent)}.bind(this),this.pointerMove=this.pointerMove||function(t){t.preventDefault(),this.dragging&&(this.pointerEvent=t,this.rid||(this.rid=window.requestAnimationFrame(this.Frame2)))}.bind(this),this.hoverEnter=this.hoverEnter||function(t){const e=Number(t.currentTarget?.dataset?.pointIndex);this.pointerEvent=t,this.activeX=void 0,this._radialPendingLeave=!1,this._radialPendingPointIndex=e,this._radialPendingEvent=t,this.scheduleRadialHoverFrame()}.bind(this),this.hoverMove=this.hoverMove||function(e){if(!this.dragging){if(!this.hovering){this.hovering=!0,this.elements.containerRect=this.elements.container.getBoundingClientRect();const e=this.elements.svg.getBoundingClientRect(),i=e.width/this.svg.width,s=e.height/this.svg.height,a=t?0:this.Graph.coords.length>1?(this.Graph.coords[1][0]-this.Graph.coords[0][0])*i/2:12;this.elements.tooltipBounds={left:e.left-this.elements.containerRect.left+this.Graph.drawArea.x*i-a,top:e.top-this.elements.containerRect.top+this.Graph.drawArea.y*s,right:e.left-this.elements.containerRect.left+(this.Graph.drawArea.x+this.Graph.drawArea.width)*i+a,bottom:e.top-this.elements.containerRect.top+(this.Graph.drawArea.y+this.Graph.drawArea.height)*s}}t?this.updateRadialActivePointer(e):this.updateActivePointer(e)}}.bind(this),this.hoverLeave=this.hoverLeave||function(t){this.dragging||(this.hovering=!1,this.pointerEvent=void 0,this.activeX=void 0,this.clearTooltip(),this.updateTooltipVisibilityDom(!1),this.updateActiveIndicatorDom())}.bind(this),this.barCodeLeave=this.barCodeLeave||function(t){this.dragging||(this.hovering=!1,this.pointerEvent=void 0,this.activeX=void 0,this.clearTooltip(),this.restoreRadialActiveBinDom())}.bind(this),this.pointerDown=this.pointerDown||function(e){e.preventDefault(),window.addEventListener("pointermove",this.pointerMove,!1),window.addEventListener("pointerup",this.pointerUp,!1),this.dragging=!0,this.pointerEvent=e,this.elements.containerRect=this.elements.container.getBoundingClientRect(),t?this.updateRadialActivePointer(e):this.updateActivePointer(e),this.updateTooltipVisibilityDom(!0),this.updateActiveIndicatorDom(),this.Frame2()}.bind(this),this.pointerUp=this.pointerUp||function(e){e.preventDefault(),window.removeEventListener("pointermove",this.pointerMove,!1),window.removeEventListener("pointerup",this.pointerUp,!1),this.dragging&&(this.dragging=!1,this.activeX=void 0,this.pointerEvent=void 0,this.rid=null,this.clearTooltip(),this.updateTooltipVisibilityDom(!1),this.updateActiveIndicatorDom(),this.elements.containerRect=void 0,t&&this.restoreRadialActiveBinDom(),this.Frame2())}.bind(this),this.touchStart=this.touchStart||function(e){e.preventDefault(),window.addEventListener("pointermove",this.pointerMove,!1),window.addEventListener("pointerup",this.pointerUp,!1),this.dragging=!0,this.pointerEvent=e,this.elements.containerRect=this.elements.container.getBoundingClientRect(),t?this.updateRadialActivePointer(e):this.updateActivePointer(e),this.updateTooltipVisibilityDom(!0),this.updateActiveIndicatorDom(),this.Frame2()}.bind(this),this.mouseDown=this.mouseDown||function(t){this.pointerDown(t)}.bind(this),this.elements.svg.addEventListener("mousedown",this.mouseDown,!1),this.elements.svg.addEventListener("touchstart",this.touchStart,{passive:!1}),this.elements.svg.addEventListener("mousemove",this.hoverMove,!1),this.elements.svg.addEventListener("mouseenter",this.hoverEnter,!1),this.elements.svg.addEventListener("mouseleave",this.barCodeLeave,!1),this.elements.svg.addEventListener("mouseleave",this.hoverLeave,!1)}renderSvgAreaMask(t,e){if("area"!==this.config.sparkline.show.chart_type)return"";if(!t)return"";const i="fade"===this.config.sparkline.show.fill,s=this.length[e]||!1===this.card.config.entities[e].show_line,a=this.Graph.min>=0?0:Math.abs(this.Graph.min)/(this.Graph.max-this.Graph.min)*100;return V`
      <linearGradient id=${`fill-grad-pos-${this.cardId}-${this.index}-${e}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-pos-${this.cardId}-${this.index}-${e}`}>
        <rect width="100%" height="${100-a}%" fill=${`url(#fill-grad-pos-${this.cardId}-${this.index}-${e})`}
         />
      </mask>
      <linearGradient id=${`fill-grad-neg-${this.cardId}-${this.index}-${e}`} x1="0%" y1="100%" x2="0%" y2="0%">
        <stop stop-color='white' offset='0%' stop-opacity='1'/>
        <stop stop-color='white' offset='100%' stop-opacity='0.1'/>
      </linearGradient>
      <mask id=${`fill-grad-mask-neg-${this.cardId}-${this.index}-${e}`}>
        <rect width="100%" y=${100-a}% height="${a}%" fill=${`url(#fill-grad-neg-${this.cardId}-${this.index}-${e})`}
         />
      </mask>

    <mask id=${`fill-${this.cardId}-${this.index}-${e}`}>
      <path class='fill'
        type=${this.config.sparkline.show.fill}
        .id=${e} anim=${this.config.sparkline.animate} ?init=${s}
        style="animation-delay: ${this.config.sparkline.animate?.5*e+"s":"0s"}"
        fill='white'
        mask=${i?`url(#fill-grad-mask-pos-${this.cardId}-${this.index}-${e})`:""}
        d=${t}
      />
      ${this.Graph.min<0?V`<path class='fill'
            type=${this.config.sparkline.show.fill}
            .id=${e} anim=${this.config.sparkline.animate} ?init=${s}
            style="animation-delay: ${this.config.sparkline.animate?.5*e+"s":"0s"}"
            fill='white'
            mask=${i?`url(#fill-grad-mask-neg-${this.cardId}-${this.index}-${e})`:""}
            d=${t}
          />`:""}
    </mask>`}renderSvgAreaBackground(t,e){if("area"!==this.config.sparkline.show.chart_type)return"";if(!t)return"";const i=this.getAreaStyles(),s=i;return s.fill=this.getSparklineBackgroundPaint(i),s.stroke="none",V`
      <rect
        class="sparkline-area-rect"
        x="0"
        y="0"
        width="${this.svg.width}"
        height="${this.svg.height}"
        style=${gt(this.getRenderStyles(s))}
        mask="url(#fill-${this.cardId}-${this.index}-${e})"
      ></rect>
    `}renderSvgAreaMinMaxMask(t,e){return["area","line"].includes(this.config.sparkline.show.chart_type)&&t?V`
      <mask id=${`fillMinMax-${this.cardId}-${this.index}-${e}`}>
        <path
          class='fill'
          type=${this.config.sparkline.show.fill}
          .id=${e} anim=${this.config.sparkline.animate} ?init=${this.length[e]}
          style="animation-delay: ${this.config.sparkline.animate?.5*e+"s":"0s"}"
          fill='white'
          d=${t}
        />
      </mask>
    `:""}renderSvgAreaMinMaxBackground(t,e){if(!["area","line"].includes(this.config.sparkline.show.chart_type))return"";if(!t)return"";const i=this.getAreaStyles(),s=i;return s.fill=this.getSparklineBackgroundPaint(i),s.stroke="none",V`
      <rect
        class="sparkline-area-rect"
        x="0"
        y="0"
        width="${this.svg.width}"
        height="${this.svg.height}"
        style=${gt(this.getRenderStyles(s))}
        mask="url(#fillMinMax-${this.cardId}-${this.index}-${e})"
      ></rect>
    `}renderSvgLineMask(t,e){if(!0!==this.config.sparkline.show.line)return"";if(!t)return"";const i=this.getLineStyles();return V`
      <mask id="sparkline-line-${this.cardId}-${this.index}-${e}">
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
    `}renderSvgLineBackground(t,e){if(!0!==this.config.sparkline.show.line)return"";if(!t)return"";const i=this.getLineStyles(),s=i;return s.fill=this.getSparklineBackgroundPaint(i),s.stroke="none",delete s["stroke-width"],delete s["stroke-linecap"],delete s["stroke-linejoin"],V`
      <rect
        class="sparkline-line-rect"
        x="0"
        y="0"
        width="${this.svg.width}"
        height="${this.svg.height}"
        style=${gt(this.getRenderStyles(s))}
        mask="url(#sparkline-line-${this.cardId}-${this.index}-${e})"
      ></rect>
    `}renderSvgLineMinMaxMask(t,e){if("line"!==this.config.sparkline.show.chart_type)return"";if(!t)return"";const i=this.getLineStyles();return V`
      <mask id="sparkline-lineMinMax-${this.cardId}-${this.index}-${e}">
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
    `}renderSvgLineMinMaxBackground(t,e){if("line"!==this.config.sparkline.show.chart_type)return"";if(!t)return"";const i=this.getLineStyles(),s=i;return s.fill=this.getSparklineBackgroundPaint(i),s.stroke="none",delete s["stroke-width"],delete s["stroke-linecap"],delete s["stroke-linejoin"],V`
      <rect
        class="sparkline-line-rect"
        x="0"
        y="0"
        width="${this.svg.width}"
        height="${this.svg.height}"
        style=${gt(this.getRenderStyles(s))}
        mask="url(#sparkline-lineMinMax-${this.cardId}-${this.index}-${e})"
      ></rect>
    `}renderLineMask(){if(!this.linePath)return"";const t=this.getLineStyles();return V`
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
    `}renderSvgGradient(t){if(!t)return"";const e=t.map(((t,e)=>t?V`
        <linearGradient id=${`grad-${this.cardId}-${this.index}-${e}`} gradientTransform="rotate(90)">
          ${t.map((t=>V`
            <stop stop-color=${t.color} offset=${`${t.offset}%`}></stop>
          `))}
        </linearGradient>
      `:""));return V`${e}`}getLineStyles(){return bt.mergeDeep(this.getStyles({fill:"none"}),da.toStyleDict(this.config.line?.styles))}computeColor(t,e){const{colorstops:i,line_color:s,colorstops_transition:a}=this.config.sparkline,r=Number(t)||0,o=la.calculateStrokeColor(r,i,"smooth"===a);return this.card.config.entities[e].color||o||s[e]||s[0]}xTicksizeToHours(t){if("number"==typeof t)return t;const e=t.match(/^(\d+(?:\.\d+)?)(m|min|h|hour)$/),i=Number(e[1]),s=e[2];return"m"===s||"min"===s?i/60:i}resolveAxisFontSizePixels(t,e=12){const i=this.config[`${t}_axis`]?.labels?.styles?.["font-size"];if("number"==typeof i)return i;if("string"!=typeof i)return e;const s=Number.parseFloat(i);return Number.isFinite(s)?i.endsWith("px")?s:i.endsWith("em")||i.endsWith("rem")?s*ya:i.endsWith("%")?s/100*ya:s:e}getAutoXAxisTicksize(t,e){const i=this.resolveAxisFontSizePixels("x",ya),s=Math.max(3,i*("minor"===t?.35:.45));return this.calculatePerfectXAxis(e.start,e.end,this.Graph.drawArea.width,s).ticksize/36e5}getAutoYAxisTicksize(t){const e=this.resolveAxisFontSizePixels("y",ya),i=Math.max(6,e*("minor"===t?.65:.85)),s=this.calculatePerfectYAxis(this.Graph.min,this.Graph.max,this.Graph.drawArea.height,i);return"minor"===t?Math.max(s.interval/2,.5):Math.max(s.interval,.5)}calculatePerfectYAxis(t,e,i,s=12){t===e&&(t-=1,e+=1);const a=1.5*s,r=Math.floor(i/a),o=(e-t)/(Math.max(r,2)-1),n=Math.floor(Math.log10(o)),l=10**n,h=o/l;let c;c=h<=1?1:h<=2?2:h<=5?5:10;const d=c*l,u=Math.floor(t/d)*d,p=Math.ceil(e/d)*d,g=[];let m=u;const f=Math.max(0,2-n);for(;m<=p+d/100;)g.push(Number(m.toFixed(f))),m+=d;return{gridMin:Number(u.toFixed(f)),gridMax:Number(p.toFixed(f)),interval:d,ticks:g}}calculatePerfectXAxis(t,e,i,s=.6*ya){const a=new Date(t).getTime(),r=new Date(e).getTime(),o=r-a;if(o<=0)return{ticksize:0,ticks:[]};const n=1*s+ya,l=Math.floor(i/n),h=o/(Math.max(l,4)-1),c=[1e3,5e3,15e3,3e4,6e4,3e5,6e5,9e5,18e5,36e5,72e5,144e5,216e5,432e5,864e5,1728e5,6048e5,26298e5];let d=c.findIndex((t=>t>=h));for(d<0&&(d=c.length-1);d>0&&o/c[d]<2;)d-=1;const u=c[d];let p=Math.ceil(a/u)*u;const g=[];let m=null;for(;p<=r;){const t=new Date(p),e=(p-a)/o*i,s=t.toDateString(),r=m?m.toDateString():null,n=m&&s===r?Cr(t,this.card._hass.locale,this.card._hass.config):Mr(t,this.card._hass.locale,this.card._hass.config);g.push({value:p,x:Number(e.toFixed(1)),label:n}),m=t,p+=u}return{ticksize:u,ticks:g}}buildXAxisTicks(t){const e=[];return this.Graph.xAxis.ticks.forEach((i=>{const s=i.isMidnight?Mr(i.time,this.card._hass.locale,this.card._hass.config):Cr(i.time,this.card._hass.locale,this.card._hass.config);e.push({axis:"x",level:t,value:i.timestamp,x:i.x,label:s})})),e}buildYAxisTicks(t){if("state_bands"===this.config.sparkline.show.chart_type)return this.Graph.yAxis.ticks.map((e=>({axis:"y",level:t,value:e.value,y:e.y,labelY:e.labelY,fontSize:e.fontSize,label:e.label})));const e=new Intl.NumberFormat(this.card._hass.locale?.language||this.card._hass.language),i=[];return this.Graph.yAxis.ticks.forEach((s=>{i.push({axis:"y",level:t,value:s.value,y:s.y,label:e.format(s.value)})})),i}buildLabelTicks(t){return"none"===this.config.sparkline.show[`${t}labels_at`]?[]:"x"===t?this.buildXAxisTicks("major"):this.buildYAxisTicks("major")}renderGrid(){const t=Hn[this.config.sparkline.show.chart_type],e=this.config.sparkline.show.grid.x&&t.x,i=this.config.sparkline.show.grid.y&&t.y;if(!e&&!i)return"";const s=this.getRenderStyles(da.toStyleDict(this.config.x_axis.grid_major.styles)),a=this.getRenderStyles(da.toStyleDict(this.config.y_axis.grid_major.styles)),r=this.buildXAxisTicks("major"),o="state_bands"===this.config.sparkline.show.chart_type?this.Graph.yAxis.gridTicks.map((t=>({axis:"y",level:"major",value:t.value,y:t.y}))):this.buildYAxisTicks("major");return V`
      ${e?V`<g class="sparkline-grid sparkline-grid--x" style="pointer-events:none;">
        ${r.map((t=>V`
          <line
            class="sparkline-grid-line sparkline-grid-line--x-major"
            x1="${t.x}"
            y1="${this.Graph.axisArea.y}"
            x2="${t.x}"
            y2="${this.Graph.axisArea.y+this.Graph.axisArea.height}"
            style=${gt(s)}
          ></line>
        `))}
      </g>`:""}
      ${i?V`<g class="sparkline-grid sparkline-grid--y" style="pointer-events:none;">
        ${o.map((t=>V`
          <line
            class="sparkline-grid-line sparkline-grid-line--y-major"
            x1="${this.Graph.axisArea.x}"
            y1="${t.y}"
            x2="${this.Graph.axisArea.x+this.Graph.axisArea.width}"
            y2="${t.y}"
            style=${gt(a)}
          ></line>
        `))}
      </g>`:""}
    `}renderAxis(){const t=Hn[this.config.sparkline.show.chart_type],e=this.config.sparkline.show.axis.x&&t.x,i=this.config.sparkline.show.axis.y&&t.y;if(!e&&!i)return"";const s=this.getRenderStyles(da.toStyleDict(this.config.x_axis.axis.styles)),a=this.getRenderStyles(da.toStyleDict(this.config.y_axis.axis.styles));return V`
      <g class="sparkline-axis" style="pointer-events:none;">
        ${e?V`<line
          class="sparkline-axis-line sparkline-axis-line--x"
          x1="${this.Graph.axisArea.x}"
          y1="${this.Graph.axisArea.y+this.Graph.axisArea.height}"
          x2="${this.Graph.axisArea.x+this.Graph.axisArea.width}"
          y2="${this.Graph.axisArea.y+this.Graph.axisArea.height}"
          style=${gt(s)}
        ></line>`:""}
        ${i?V`<line
          class="sparkline-axis-line sparkline-axis-line--y"
          x1="${this.Graph.axisArea.x}"
          y1="${this.Graph.axisArea.y}"
          x2="${this.Graph.axisArea.x}"
          y2="${this.Graph.axisArea.y+this.Graph.axisArea.height}"
          style=${gt(a)}
        ></line>`:""}
      </g>
    `}renderTickmarks(){const t=Hn[this.config.sparkline.show.chart_type],e=this.config.sparkline.show.tickmarks.x&&t.x,i=this.config.sparkline.show.tickmarks.y&&t.y;if(!e&&!i)return"";const s=this.config.x_axis.tickmarks_major,a=this.config.y_axis.tickmarks_major,r=this.getRenderStyles(da.toStyleDict(s.styles)),o=this.getRenderStyles(da.toStyleDict(a.styles)),n=this.buildXAxisTicks("major"),l=this.buildYAxisTicks("major"),h=eo.calculateSvgDimension(s.size),c=eo.calculateSvgDimension(a.size);return V`
      ${e?V`<g class="sparkline-tickmarks sparkline-tickmarks--x" style="pointer-events:none;">
        ${n.map((t=>V`
          <line
            class="sparkline-tickmark sparkline-tickmark--x-major"
            x1="${t.x}"
            y1="${this.Graph.axisArea.y+this.Graph.axisArea.height}"
            x2="${t.x}"
            y2="${this.Graph.axisArea.y+this.Graph.axisArea.height+h}"
            style=${gt(r)}
          ></line>
        `))}
      </g>`:""}
      ${i?V`<g class="sparkline-tickmarks sparkline-tickmarks--y" style="pointer-events:none;">
        ${l.map((t=>V`
          <line
            class="sparkline-tickmark sparkline-tickmark--y-major"
            x1="${this.Graph.axisArea.x-c}"
            y1="${t.y}"
            x2="${this.Graph.axisArea.x}"
            y2="${t.y}"
            style=${gt(o)}
          ></line>
        `))}
      </g>`:""}
    `}renderAxisLabels(){const t=Hn[this.config.sparkline.show.chart_type],e=this.config.sparkline.show.labels.x&&t.x,i=this.config.sparkline.show.labels.y&&t.y;if(!e&&!i)return"";const s=this.getRenderStyles(da.toStyleDict(this.config.x_axis.labels.styles)),a=this.getRenderStyles(da.toStyleDict(this.config.y_axis.labels.styles)),r=this.buildLabelTicks("x"),o=this.buildLabelTicks("y"),n=this.config.sparkline.show.tickmarks.x&&t.x?eo.calculateSvgDimension(this.config.x_axis.tickmarks_major.size):0,l=this.config.sparkline.show.tickmarks.y&&t.y?eo.calculateSvgDimension(this.config.y_axis.tickmarks_major.size):0,h="state_bands"===this.config.sparkline.show.chart_type;return V`
      ${e?V`<g class="sparkline-labels sparkline-labels--x" style="pointer-events:none;">
        ${r.map((t=>V`
          <text
            class="sparkline-label sparkline-label--x"
            x="${t.x}"
            y="${this.Graph.axisArea.y+this.Graph.axisArea.height+n+eo.calculateSvgDimension(this.config.x_axis.labels.offset)}"
            style=${gt(s)}
          >${t.label}</text>
        `))}
      </g>`:""}
      ${i?V`<g class="sparkline-labels sparkline-labels--y" style="pointer-events:none;">
        ${o.map((t=>V`
          <text
            class="sparkline-label sparkline-label--y"
            x="${h?this.Graph.drawArea.x+eo.calculateSvgDimension(this.config.y_axis.labels.offset):this.Graph.axisArea.x-l-eo.calculateSvgDimension(this.config.y_axis.labels.offset)}"
            y="${h?t.labelY:t.y}"
            style=${gt(h?{...a,"font-size":`${t.fontSize}px`}:a)}
          >${t.label}</text>
        `))}
      </g>`:""}
    `}getAreaStyles(){return bt.mergeDeep(this.getStyles({}),da.toStyleDict(this.config.area?.styles))}getSparklineBackgroundPaint(t){return this.config.sparkline.colorstops.colors.length>0?`url(#grad-${this.cardId}-${this.index}-0)`:t.stroke||t.fill}renderArea(){return this.renderSvgAreaBackground(this.areaPath,this.entity_index)}renderLine(){return this.renderSvgLineBackground(this.linePath,this.entity_index)}renderSvgPoint(t,e,i){const s=this.computeColor(t[2],e),a=eo.calculateSvgDimension(this.config.sparkline.dots.radius);return V`
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
      cx=${t[0]} cy=${t[1]} r=${a}
    >
      ${this.config.sparkline.animate&&("real_time"===this.config.period.type||this.historySeries)?V`
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
  `}renderSvgPoints(t,e){if(!t)return;const i=this.computeColor(this.card.entities[e].state,e);return V`
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
      ${t.map(((t,i)=>this.renderSvgPoint(t,e,this.Graph.bucketMeta[i].start.toISOString())))}
    </g>`}renderPoints(){if("dots"!==this.config.sparkline.show.chart_type&&!0!==this.config.sparkline.show.points&&!0!==this.config.sparkline.line?.show_dots&&!0!==this.config.sparkline.area?.show_dots)return"";const t=this.Graph._calcY(this.Graph.coords).map(((t,e)=>[t[0],t[1],t[2],e]));return this.renderSvgPoints(t,0)}renderTooltip(){const t=da.toStyleDict(this.config.sparkline.tooltip?.styles),e={left:void 0!==this.tooltip.x?`${this.tooltip.x}px`:"0px",top:void 0!==this.tooltip.y?`${this.tooltip.y}px`:"0px",transform:"translate(-50%, calc(-100% - 6px))","font-size":t["font-size"]??"0.5em","max-width":"calc(100% - 24px)","pointer-events":"none",display:this.tooltipVisible?"block":"none"},i={display:"inline-flex","align-items":"baseline","justify-content":"flex-end","text-align":"right","white-space":"nowrap"},s={"font-size":"0.72em",transform:"translateY(-0.32em)",opacity:"0.8"};return H`
      <div id="sparkline-tooltip-${this.cardId}-${this.index}" class="sparkline-tooltip" style=${gt(e)}>
        <div class="sparkline-tooltip__title"></div>
        ${this.sparklineSeries.items.length>1?this.sparklineSeries.items.map(((t,e)=>H`
            <div class="sparkline-tooltip__row sparkline-tooltip__row--series">
              <span style=${gt({display:"inline-flex",alignItems:"center",gap:"0.35em"})}>
                <span class="sparkline-tooltip__series-color" style=${gt({width:"0.7em",height:"0.7em",background:t.config.color??t.entityConfig.color??t.config.sparkline.line_color[e],borderRadius:"50%"})}></span>
                <span></span>
              </span>
              <span style=${gt(i)}>
                <span></span>
                <span style=${gt(s)}></span>
              </span>
            </div>
          `)):H`
            <div class="sparkline-tooltip__row"><span></span><span style=${gt(i)}><span></span><span style=${gt(s)}></span></span></div>
            <div class="sparkline-tooltip__row"><span></span><span style=${gt(i)}><span></span><span style=${gt(s)}></span></span></div>
            <div class="sparkline-tooltip__row"><span></span><span style=${gt(i)}><span></span><span style=${gt(s)}></span></span></div>
          `}
      </div>
    `}renderCartesianHitArea(){return["radial_barcode","graded","state_bands"].includes(this.config.sparkline.show.chart_type)?V``:V`
      <rect
        class="sparkline-cartesian-hit-area"
        x="${this.Graph.drawArea.x}"
        y="${this.Graph.drawArea.y}"
        width="${this.Graph.drawArea.width}"
        height="${this.Graph.drawArea.height}"
        fill="rgba(0, 0, 0, 0)"
        pointer-events="all"
      ></rect>
    `}renderActiveIndicator(){return"radial_barcode"===this.config.sparkline.show.chart_type||"graded"===this.config.sparkline.show.chart_type?"":V`
      <line
        id="sparkline-active-indicator-${this.cardId}-${this.index}"
        class="sparkline-active-indicator"
        x1="${this.activeX??0}"
        y1="${this.Graph.drawArea.y}"
        x2="${this.activeX??0}"
        y2="${this.Graph.drawArea.y+this.Graph.drawArea.height}"
        style="stroke:var(--primary-text-color);stroke-width:1;opacity:0.45;visibility:${void 0===this.activeX?"hidden":"visible"};pointer-events:none;"
      ></line>
    `}renderSvgStateBandsMask(){if("state_bands"!==this.config.sparkline.show.chart_type)return"";const t=eo.calculateSvgDimension(this.config.sparkline.state_bands.background.padding),e=eo.calculateSvgDimension(this.config.sparkline.state_bands.background.connection_width),i=eo.calculateSvgDimension(this.config.sparkline.state_bands.radius)+t,s=this.Graph.yAxis.rows.concat().sort(((t,e)=>t.y-e.y)),a=s[0].y,r=s[s.length-1].y;return V`
      <linearGradient
        id=${`state-bands-bg-gradient-${this.cardId}-${this.index}`}
        gradientUnits='userSpaceOnUse'
        x1='0'
        y1=${a}
        x2='0'
        y2=${r}
      >
        ${s.map((t=>V`
            <stop
              offset=${(t.y-a)/(r-a)*100+"%"}
              stop-color=${this.computeColor(t.value,this.entity_index)}
            ></stop>
          `))}
      </linearGradient>
      <mask id=${`state-bands-bg-${this.cardId}-${this.index}`}>
        ${this.Graph.stateBandTransitions.map((t=>V`
            <line
              x1=${t.x}
              y1=${t.fromY}
              x2=${t.x}
              y2=${t.toY}
              stroke='white'
              stroke-width=${e}
              stroke-linecap='round'
            ></line>
          `))}
        ${this.Graph.stateBandSegments.map((e=>{const s=e.x-t,a=e.width+2*t;return V`
            <rect
              x=${s}
              y=${e.y-t}
              width=${a}
              height=${e.height+2*t}
              rx=${i}
              ry=${i}
              fill='white'
            ></rect>
          `}))}
      </mask>
    `}renderSvgStateBandsBackground(){if("state_bands"!==this.config.sparkline.show.chart_type)return"";const t=this.getRenderStyles(da.toStyleDict(this.config.sparkline.state_bands.background.styles)),e=eo.calculateSvgDimension(this.config.sparkline.state_bands.background.padding);return V`
      <rect
        class='state-bands__background'
        x=${this.Graph.drawArea.x-e}
        y=${this.Graph.drawArea.y}
        width=${this.Graph.drawArea.width+2*e}
        height=${this.Graph.drawArea.height}
        fill=${`url(#state-bands-bg-gradient-${this.cardId}-${this.index})`}
        mask=${`url(#state-bands-bg-${this.cardId}-${this.index})`}
        style=${gt(t)}
      ></rect>
    `}renderSvgStateBands(){if("state_bands"!==this.config.sparkline.show.chart_type)return"";const t=this.config.sparkline.animate&&this.historySeries,e=this.getRenderStyles(bt.mergeDeep(this.getStyles({}),da.toStyleDict(this.config.sparkline.state_bands.styles)));return V`
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
        ${this.stateBands.map((i=>i.segments.map((i=>{const s=this.computeColor(i.value,this.entity_index),a={...e,fill:s,stroke:s};return V`
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
                rx=${eo.calculateSvgDimension(this.config.sparkline.state_bands.radius)}
                ry=${eo.calculateSvgDimension(this.config.sparkline.state_bands.radius)}
                style=${gt(a)}
              >
                ${t?V`
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
    `}renderSvgTrafficLight(t,e){const i={...this.config.sparkline.graded.background.styles},s={...this.config.sparkline.graded.foreground.styles},a="var(--theme-sys-elevation-surface-neutral4)";return delete i.fill,delete i.stroke,delete s.fill,delete s.stroke,V`
      ${this.gradeRanks.map(((e,r)=>{const o=t.value[r],n=void 0!==o?this.computeColor(o+.001,0):"transparent",l=Array.isArray(t.y)?t.y[r]:t.y,h=Math.max(1,t.height-this.svg.line_width),c=Math.max(1,t.width-this.svg.line_width);return V`
          <rect
            class='traffic-light-background'
            x=${t.x+this.svg.line_width/2}
            y=${l-t.height+this.svg.line_width/2}
            height=${h}
            width=${c}
            fill=${a}
            stroke=${a}
            stroke-width=${this.svg.line_width?this.svg.line_width:0}
            pathLength='10'
            style=${gt(this.getRenderStyles(i))}
          ></rect>
          <rect
            class='traffic-light-foreground'
            x=${t.x+this.svg.line_width/2}
            y=${l-t.height+this.svg.line_width/2}
            height=${h}
            width=${c}
            fill=${n}
            stroke=${n}
            stroke-width=${this.svg.line_width?this.svg.line_width:0}
            pathLength='10'
            style=${gt(this.getRenderStyles(s))}
          ></rect>
        `}))}
    `}renderSvgGraded(t,e){if(!t)return"";const i=this.computeColor(this.card.entities[e].state,e);return V`
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
    `}renderSvgEqualizerMask(t,e){if("equalizer"!==this.config.sparkline.show.chart_type)return"";if(!t)return"";const i=this.config.sparkline.animate&&("real_time"===this.config.period.type||this.historySeries),s=this.animationBaselineY;if("real_time"===this.config.period.type&&(t=t.map((t=>{const e={...t,activeLevelCount:t.value.length,value:[],y:[]};for(let i=0;i<this.config.sparkline.equalizer.value_buckets;i+=1)e.value[i]=this.Graph.min+i*this.Graph.valuesPerBucket,e.y[i]=this.Graph.drawArea.y+this.Graph.drawArea.height-i*(t.height+this.svg.row_spacing);return e}))),!0===this.config.sparkline.equalizer.square){const e=Math.min(t[0].width,t[0].height),i=e<t[0].height?(this.Graph.drawArea.height-this.config.sparkline.equalizer.value_buckets*e)/(this.config.sparkline.equalizer.value_buckets-1):0;t=t.map((t=>{const s={...t};return e<t.height&&(s.y=t.y.map(((t,s)=>this.Graph.drawArea.y+this.Graph.drawArea.height-s*(e+i)))),s.width=e,s.height=e,s}))}return V`
      <mask id=${`equalizer-bg-${this.cardId}-${e}`}>
        ${t.map((t=>t.value.map(((e,a)=>V`
          <rect
            x=${t.x}
            y=${t.y[a]-t.height}
            height=${Math.max(1,t.height)}
            width=${Math.max(1,t.width)}
            fill='white'
            style=${gt({opacity:"real_time"===this.config.period.type?a<t.activeLevelCount?1:0:void 0,transition:"real_time"===this.config.period.type&&this.config.sparkline.animate?"opacity 0.5s ease":void 0})}
          >
            ${i?V`
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
    `}renderSvgBarsMask(t,e){if("bar"!==this.config.sparkline.show.chart_type)return"";if("real_time"===this.config.period.type)return"";if(!t)return"";const i=this.config.sparkline.animate&&this.historySeries;return V`
      <mask id=${`bars-bg-${this.cardId}-${e}`}>
        ${t.map((t=>V`
          <rect
            x=${t.x}
            y=${t.y}
            height=${Math.max(1,t.height)}
            width=${Math.max(1,t.width)}
            fill='white'
          >
            ${i?V`
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
    `}renderSvgEqualizerTrack(t){const e=this.config.sparkline.equalizer.background,i=e.show.item_style;if("none"===i)return"";const s={colors:this.config.sparkline.colorstops.colors.map(((t,e)=>({value:e/(this.config.sparkline.colorstops.colors.length-1),color:t.color})))};return V`
      <g class='equalizer-track'>
        ${t.map((t=>{let a=t.width,r=t.height,o=this.svg.row_spacing;if(!0===this.config.sparkline.equalizer.square){const t=Math.min(a,r);o=t<r?(this.Graph.drawArea.height-this.config.sparkline.equalizer.value_buckets*t)/(this.config.sparkline.equalizer.value_buckets-1):o,a=t,r=t}return Array.from({length:this.config.sparkline.equalizer.value_buckets},((n,l)=>{const h=this.Graph.min+l*this.Graph.valuesPerBucket;let c={...e.styles};if("fixed"===i)c={fill:e.color,...c};else{const t="lineargradient"===i?la.calculateStrokeColor(l/(this.config.sparkline.equalizer.value_buckets-1),s,!0):la.calculateStrokeColor(h,this.config.sparkline.colorstops,"colorstopgradient"===i);e[i].fill&&(c.fill=t),e[i].stroke&&(c.stroke=t)}const d=this.Graph.drawArea.y+this.Graph.drawArea.height-l*(r+o)-r;return V`
              <rect
                class='equalizer-track__bucket'
                x=${t.x}
                y=${d}
                width=${Math.max(1,a)}
                height=${Math.max(1,r)}
                style=${gt(this.getRenderStyles(c))}
              ></rect>
            `}))}))}
      </g>
    `}renderSvgBarTrack(t){const e=this.config.sparkline.bar.background,i=e.show.item_style;if("none"===i)return"";let s={...e.styles},a="";if("fixed"===i)s={fill:e.color,...s};else{let r;if("lineargradient"===i)r=[...this.config.sparkline.colorstops.colors].reverse().map(((t,e,i)=>({color:t.color,offset:e/(i.length-1)*100})));else{const t=Vn(this.config.sparkline.colorstops.colors,"colorstopsegments"===i?"hard":"smooth");r=this.Graph.computeGradient(t,this.config.sparkline.state_values.logarithmic)}const o=`bar-track-gradient-${this.cardId}-${this.index}-${t}`,n=`url(#${o})`;e[i].fill&&(s.fill=n),e[i].stroke&&(s.stroke=n),a=V`
        <defs>
          <linearGradient id=${o} gradientTransform='rotate(90)'>
            ${r.map((t=>V`
              <stop stop-color=${t.color} offset=${`${t.offset}%`}></stop>
            `))}
          </linearGradient>
        </defs>
      `}const r=Math.max(1,this.Graph.drawArea.width-this.svg.column_spacing),o=this.Graph.drawArea.x+(this.Graph.drawArea.width-r)/2;return V`
      ${a}
      <rect
        class='bar-track'
        x=${o}
        y=${this.Graph.drawArea.y}
        width=${r}
        height=${this.Graph.drawArea.height}
        rx=${e.styles.rx}
        ry=${e.styles.ry}
        style=${gt(this.getRenderStyles(s))}
      ></rect>
    `}renderSvgEqualizerBackground(t,e){if("equalizer"!==this.config.sparkline.show.chart_type)return"";if(!t)return"";const i=this.gradient[0]?`url(#grad-${this.cardId}-${this.index}-0)`:this.computeColor(this.card.entities[e].state,e);return V`
      <rect
        class='equalizer--bg'
        ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
        id=${`equalizer-bg-${this.cardId}-${e}`}
        fill=${i}
        height="100%"
        width="100%"
        mask=${`url(#equalizer-bg-${this.cardId}-${e})`}
      ></rect>
    `}renderSvgBarsBackground(t,e){if("bar"!==this.config.sparkline.show.chart_type)return"";if("fade"===this.config.sparkline.show.fill)return"";if("real_time"===this.config.period.type)return"";if(!t)return"";const i=this.gradient[0]?`url(#grad-${this.cardId}-${this.index}-0)`:this.computeColor(this.card.entities[e].state,e);return V`
      <rect
        class='bars--bg'
        ?inactive=${void 0!==this.tooltip.entity&&this.tooltip.entity!==e}
        id=${`bars-bg-${this.cardId}-${e}`}
        fill=${i}
        height="100%"
        width="100%"
        mask=${`url(#bars-bg-${this.cardId}-${e})`}
      ></rect>
    `}renderSvgBars(t,e){if(!t)return"";const i=this.config.sparkline.animate&&("real_time"===this.config.period.type||this.historySeries),s=this.config.sparkline.animate&&"real_time"===this.config.period.type?"y 2s cubic-bezier(0.215, 0.61, 0.355, 1), height 2s cubic-bezier(0.215, 0.61, 0.355, 1)":void 0,a={...this.config.sparkline.bar.foreground.styles},r="fade"===this.config.sparkline.show.fill;return delete a.fill,delete a.stroke,V`
      <g class='bars' ?anim=${this.config.sparkline.animate}>
        ${t.map(((t,o)=>{const n=this.computeColor(t.value,e),l=`bar-fill-fade-${this.cardId}-${this.index}-${e}-${o}`,h=r?`url(#${l})`:n;return V`
            ${r?V`
                <linearGradient
                  id=${l}
                  x1='0%'
                  y1=${t.value>=0?"0%":"100%"}
                  x2='0%'
                  y2=${t.value>=0?"100%":"0%"}
                >
                  <stop stop-color=${n} offset='0%' stop-opacity='1'></stop>
                  <stop stop-color=${n} offset='100%' stop-opacity='0.1'></stop>
                </linearGradient>
              `:""}
            <rect
              class='bar'
              x=${t.x}
              y=${t.y}
              height=${Math.max(1,t.height)}
              width=${Math.max(1,t.width)}
              rx=${a.rx}
              ry=${a.ry}
              fill=${h}
              stroke=${n}
              style=${gt(this.getRenderStyles({y:s?`${t.y}px`:void 0,height:s?`${Math.max(1,t.height)}px`:void 0,transition:s,...a}))}
            >
              ${i?V`
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
    `}renderSvgRadialBarcodeBin(t,e,i){const s=this.computeColor(t.value,this.entity_index),a=da.toStyleDict(this.config.sparkline.radial_barcode?.foreground?.styles);return delete a.fill,delete a.stroke,V`
      <path
        class='sparkline-radial-barcode__bin'
        data-point-index=${i}
        d=${e}
        fill=${s}
        stroke=${s}
        style=${gt(this.getRenderStyles(a))}
      ></path>
    `}renderSvgRadialBarcodeBackgroundBin(t,e,i){const s=da.toStyleDict(this.config.sparkline.radial_barcode?.background?.styles);return delete s.fill,delete s.stroke,V`
      <path
        class='sparkline-radial-barcode__bg-bin'
        data-point-index=${i}
        d=${e}
        fill='lightgray'
        style=${gt(this.getRenderStyles(s))}
      ></path>
    `}renderSvgRadialBarcodeBackground(t){const{start:e,end:i,start2:s,end2:a,largeArcFlag:r,sweepFlag:o}=this.Graph._calcRadialBarcodeCoords(0,359.9,!0,t,t,this.radialBarcodeChartWidth),n={x:t-this.radialBarcodeChartWidth,y:t-this.radialBarcodeChartWidth},l=da.toStyleDict(this.config.sparkline.radial_barcode?.background?.styles),h=["M",e.x,e.y,"A",t,t,0,r,o,i.x,i.y,"L",a.x,a.y,"A",n.x,n.y,0,r,"0"===o?"1":"0",s.x,s.y,"Z"].join(" ");return V`
      <path fill="lightgray" d="${h}" style=${gt(this.getRenderStyles(l))}></path>
    `}renderSvgRadialBarcodeFace(t){if(!this.config?.sparkline?.radial_barcode?.face)return V``;const e=.62*t,i=.84*t,s=.74*t;return V`
      ${(()=>!0===this.config.sparkline.radial_barcode.face?.show_day_night?V`
        <circle pathLength="1" r="${e}" cx=${this.svg.width/2} cy="${this.svg.height/2}"></circle>
      `:"")()}
      ${(()=>!0===this.config.sparkline.radial_barcode.face?.show_hour_marks?V`
        <circle pathLength=${this.config.sparkline.radial_barcode.face.hour_marks_count} r="${i}" cx=${this.svg.width/2} cy="${this.svg.height/2}"></circle>
      `:"")()}
      ${(()=>"absolute"===this.config.sparkline.radial_barcode.face?.show_hour_numbers?V`
        <g>
          <text x="${this.svg.width/2}" y="${this.svg.height/2-s}">24</text>
          <text x="${this.svg.width/2}" y="${this.svg.height/2+s}">12</text>
          <text x="${this.svg.width/2+s}" y="${this.svg.height/2}">6</text>
          <text x="${this.svg.width/2-s}" y="${this.svg.height/2}">18</text>
        </g>
      `:"")()}
      ${(()=>"relative"===this.config.sparkline.radial_barcode.face?.show_hour_numbers?V`
        <g>
          <text x="${this.svg.width/2}" y="${this.svg.height/2-s}">0</text>
          <text x="${this.svg.width/2}" y="${this.svg.height/2+s}">-12</text>
          <text x="${this.svg.width/2+s}" y="${this.svg.height/2}">-18</text>
          <text x="${this.svg.width/2-s}" y="${this.svg.height/2}">-6</text>
        </g>
      `:"")()}
    `}renderSvgRadialBarcode(t,e){if(!t)return"";const i=this.Graph.getRadialBarcodePaths(),s=this.Graph.getRadialBarcodeBackgroundPaths();return V`
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
    `}renderSvgBarcode(t,e){if(!t)return"";const i=da.toStyleDict(this.config.sparkline.barcode?.styles);return delete i.fill,delete i.stroke,V`
      <g class='bars' ?anim=${this.config.sparkline.animate}>
        ${t.map(((t,s)=>{const a=this.computeColor(t.value,e);return V`
            <rect
              class='bar'
              x=${t.x}
              y=${t.y}
              height=${Math.max(1,t.height)}
              width=${t.width}
              fill=${a}
              stroke=${a}
              style=${gt(this.getRenderStyles(i))}
            >
              ${this.config.sparkline.animate&&("real_time"===this.config.period.type||this.historySeries)?V`
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
    `}renderHistoryLoadingSpinner(){if(!this.historyLoading)return V``;const t=this.Graph.drawArea.x+this.Graph.drawArea.width/2,e=this.Graph.drawArea.y+this.Graph.drawArea.height/2,i=.08*Math.min(this.Graph.drawArea.width,this.Graph.drawArea.height),s=.2*i,a=2*Math.PI*i,r=.15*a,o=.65*a;return V`
      <g class="sparkline-history-spinner" pointer-events="none">
        <circle
          cx=${t}
          cy=${e}
          r=${i}
          fill="none"
          stroke="var(--primary-color)"
          stroke-width=${s}
          opacity="0.2"
        ></circle>
        <circle
          cx=${t}
          cy=${e}
          r=${i}
          fill="none"
          stroke="var(--primary-color)"
          stroke-width=${s}
          stroke-linecap="round"
          stroke-dasharray="${r} ${a-r}"
        >
          ${this.prefersReducedMotion?V``:V`
                <animate
                  attributeName="stroke-dasharray"
                  values="${r} ${a-r}; ${o} ${a-o}; ${r} ${a-r}"
                  dur="1.4s"
                  repeatCount="indefinite"
                ></animate>
                <animate
                  attributeName="stroke-dashoffset"
                  values="0; ${.25*-a}; ${-a}"
                  dur="1.4s"
                  repeatCount="indefinite"
                ></animate>
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 ${t} ${e}"
                  to="360 ${t} ${e}"
                  dur="1.4s"
                  repeatCount="indefinite"
                ></animateTransform>
              `}
        </circle>
      </g>
    `}renderMultipleSeriesCartesian(){return V`
      ${this.sparklineSeries.items.map(((t,e)=>{const{config:i,graph:s}=t,a=i.sparkline.show.chart_type,r=i.color??t.entityConfig.color??i.sparkline.line_color[e],o=da.toStyleDict(i.line.styles),n=da.toStyleDict(i.area.styles),l=["line","area"].includes(a)?s.getPath():void 0,h="area"===a?s.getArea(l):void 0,c="dots"===a||!0===i.sparkline.show.points||!0===i.sparkline.line.show_dots||!0===i.sparkline.area.show_dots?s._calcY(s.coords):[],d=eo.calculateSvgDimension(i.sparkline.dots.radius);return V`
          ${h?V`<path class="sparkline-series-area" d="${h}" fill="${r}" stroke="none" style=${gt(this.getRenderStyles({...n,fill:r}))}></path>`:""}
          ${l&&!1!==i.sparkline.show.line?V`<path class="sparkline-series-line" d="${l}" fill="none" stroke="${r}" style=${gt(this.getRenderStyles({...o,fill:"none",stroke:r}))}></path>`:""}
          ${c.map((t=>V`<circle class="sparkline-series-point" cx="${t[0]}" cy="${t[1]}" r="${d}" fill="${r}" stroke="${r}"></circle>`))}
        `}))}
    `}renderSvg(){if(!this.graphReady)return V`
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
            overflow="visible"
            touch-action="none"
            style="touch-action:none; pointer-events:none; overflow:visible;"
            @pointerdown=${t=>t.stopPropagation()}
            @click=${t=>t.stopPropagation()}
          >
            ${this.historyDurationReady?this.renderHistoryLoadingSpinner():V``}
          </svg>
        </g>
      `;const t=V`
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
          overflow="visible"
          touch-action="none"
          style="touch-action:none; pointer-events:${this.historyLoading?"none":"auto"}; overflow:visible;"
          ${this.actionHandler()}
          @action=${t=>this.handleAction(t)}
          @pointerdown=${t=>t.stopPropagation()}
          @click=${t=>t.stopPropagation()}
        >
          <defs>
            ${this.renderSvgGradient(this.gradient)}
            ${this.area.map(((t,e)=>this.renderSvgAreaMask(t,e)))}
            ${this.areaMinMax.map(((t,e)=>this.renderSvgAreaMinMaxMask(t,e)))}
            ${this.line.map(((t,e)=>this.renderSvgLineMask(t,e)))}
            ${this.renderSvgStateBandsMask()}
          </defs>
          <g
            opacity=${this.historyLoading?.2:1}
            style="pointer-events:${this.historyLoading?"none":"auto"}"
          >
          ${this.renderCartesianHitArea()}
          <g transform="translate(0 ${this.animationBaselineY})">
            <g>
              ${this.config.sparkline.animate&&["line","area"].includes(this.config.sparkline.show.chart_type)&&("real_time"===this.config.period.type||this.historySeries)?V`
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
                ${this.sparklineSeries.items.length>1?this.renderMultipleSeriesCartesian():V`
                    ${this.area.map(((t,e)=>this.renderSvgAreaBackground(t,e)))}
                    ${this.areaMinMax.map(((t,e)=>this.renderSvgAreaMinMaxBackground(t,e)))}
                    ${this.line.map(((t,e)=>this.renderSvgLineBackground(t,e)))}
                  `}
              </g>
            </g>
          </g>
          ${this.bar.map(((t,e)=>this.renderSvgBarsMask(t,e)))}
          ${this.bar.map(((t,e)=>this.renderSvgBarTrack(e)))}
          ${this.bar.map(((t,e)=>this.renderSvgBarsBackground(t,e)))}
          ${this.bar.map(((t,e)=>this.renderSvgBars(t,e)))}
          ${this.equalizer.map(((t,e)=>this.renderSvgEqualizerMask(t,e)))}
          ${this.equalizer.map(((t,e)=>this.renderSvgEqualizerTrack(t,e)))}
          ${this.equalizer.map(((t,e)=>this.renderSvgEqualizerBackground(t,e)))}
          ${this.barcodeChart.map(((t,e)=>this.renderSvgBarcode(t,e)))}
          ${this.radialBarcodeChart.map(((t,e)=>this.renderSvgRadialBarcode(t,e)))}
          ${this.graded.map(((t,e)=>this.renderSvgGraded(t,e)))}
          ${this.renderSvgStateBandsBackground()}
          ${this.renderSvgStateBands()}
          ${this.renderGrid()}
          ${this.renderAxis()}
          ${1===this.sparklineSeries.items.length?this.renderPoints():""}
          ${this.renderActiveIndicator()}
          ${this.renderTickmarks()}
          ${this.renderAxisLabels()}
          </g>
          ${this.renderHistoryLoadingSpinner()}
        </svg>
      </g>
    `;return t}render(){return this.renderItemLayers(this.renderSvg())}}const jn=["icon","text","state","name","area","line","circle","horseshoe","sparkline"],qn=["state","name","area"];class Un{constructor(t,e,i,s,a,r,o,n,l){this.contentConfig=t,this.direction=e,this.bounds=i,this.itemOverrides=s,this.parentEntityIndex=a,this.instanceId=r,this.templates=o,this.cardId=n,this.card=l,this.vertical="vertical"===e,this.childTools=[];const h=t.padding;if("number"==typeof h)this.padding={top:h,right:h,bottom:h,left:h};else{const t="object"==typeof h.y?h.y.top:h.y,e="object"==typeof h.y?h.y.bottom:h.y;this.padding={top:h.top??t??0,right:h.right??h.x??0,bottom:h.bottom??e??0,left:h.left??h.x??0}}const c=new Set;this.items=t.items.map(((t,e)=>{if(void 0===t.id)throw Error(`[controls] Content item ${e} requires an id`);if(c.has(t.id))throw Error(`[controls] Duplicate content item id '${t.id}'`);if(!jn.includes(t.type))throw Error(`[controls] Invalid content item type '${t.type}' [${jn.join(", ")}]`);c.add(t.id);const i=bt.mergeDeep({entity_index:a},t,s[t.id]??{}),r=i.margin??0;let o;return o="number"==typeof r?{top:r,right:r,bottom:r,left:r}:{top:r.top??r.y??0,right:r.right??r.x??0,bottom:r.bottom??r.y??0,left:r.left??r.x??0},{...i,margin:o}})),this.createVisualTools()}createVisualTools(){const t=this.bounds.xpos-this.bounds.width/2+this.padding.left,e=this.bounds.ypos-this.bounds.height/2+this.padding.top,i=this.bounds.width-this.padding.left-this.padding.right,s=this.bounds.height-this.padding.top-this.padding.bottom,a=((this.vertical?s:i)-this.contentConfig.gap*(this.items.length-1))/this.items.length;this.childTools=this.items.map(((r,o)=>{const n=this.vertical?t:t+o*(a+this.contentConfig.gap),l=this.vertical?e+o*(a+this.contentConfig.gap):e,h=this.vertical?i:a,c=this.vertical?a:s,d=n+r.margin.left,u=l+r.margin.top,p=h-r.margin.left-r.margin.right,g=d+p/2,m=u+(c-r.margin.top-r.margin.bottom)/2,f=`${this.cardId}-${this.instanceId}-${r.id}`,y=`${this.instanceId}-${r.id}`,v=bt.mergeDeep(r,{id:y,group:this.bounds.group,xpos:g,ypos:m,yposc:m,tap_action:{action:"none"},hold_action:{action:"none"},double_tap_action:{action:"none"},styles:bt.mergeDeep(da.toStyleDict(r.styles),{"pointer-events":"none"})});let b;switch(delete v.type,delete v.margin,r.type){case"icon":v.icon_size_percent=Math.min(i,s)*r.size/100,delete v.size,b=new Rn(v,o,this.templates,f,this.card);break;case"text":v.text_overflow=bt.mergeDeep({mode:"fit",fit:{max_width:p}},v.text_overflow??{}),b=new rn(v,o,this.templates,f,this.card);break;case"state":case"name":case"area":{const t={...v,type:r.type};delete t.id,delete t.text,delete t.styles,v.text=[t],v.text_overflow=bt.mergeDeep({mode:"fit",fit:{max_width:p}},v.text_overflow??{}),b=new rn(v,o,this.templates,f,this.card);break}case"line":v.animation_section="lines",b=new so(v,o,this.templates,f,this.card);break;case"circle":b=new ao(v,o,this.templates,f,this.card);break;case"horseshoe":[b]=to.setConfig({layout:{horseshoes:[v]}},this.templates,f,this.card);break;case"sparkline":[b]=Ln.setConfig({layout:{sparklines:[v]}},this.templates,f,this.card);break;default:throw Error(`[controls] Invalid content item type '${r.type}'`)}return{id:r.id,type:qn.includes(r.type)?"text":r.type,baseStyles:da.toStyleDict(b.config.styles),tool:b}}))}updateRuntimeConfig(){this.childTools.forEach((t=>t.tool.updateRuntimeConfig()))}setState(t,e){this.childTools.forEach((i=>{"icon"!==i.type&&"text"!==i.type||(i.tool.config.styles=bt.mergeDeep(da.toStyleDict(t[i.type].styles),i.baseStyles,{transition:`fill ${e}, color ${e}, opacity ${e}`})),this.card.cardTools.setToolEntityState(i.tool,this.card.resolvedEntityConfigs,this.card.entities)}))}render(){return V`
      <g class="control-content" style="pointer-events:none;">
        ${this.childTools.map((t=>t.tool.render()))}
      </g>
    `}hassAvailable(){this.childTools.forEach((t=>t.tool.hassAvailable()))}connected(){this.childTools.forEach((t=>t.tool.connected()))}disconnected(){this.childTools.forEach((t=>t.tool.disconnected()))}hassConnected(){this.childTools.forEach((t=>t.tool.hassConnected()))}requiresHassUpdate(){return this.childTools.some((t=>t.tool.requiresHassUpdate()))}firstUpdated(t){this.childTools.forEach((e=>e.tool.firstUpdated(t)))}updated(t){this.childTools.forEach((e=>e.tool.updated(t)))}}class Wn extends Nn{constructor(t,e,i,s,a){const r={orientation:"horizontal",width:20,height:10,tap_action:{action:"toggle"},background:{radius:2,styles:{}},content:{mode:"content_horizontal",content_horizontal:{padding:{x:2,y:1.5},gap:3,icon:{size:75,styles:{}},text:{text:"",styles:{}}},content_vertical:{padding:{x:2,y:1.5},gap:2,icon:{size:75,styles:{}},text:{text:"",styles:{}}},content_icon:{padding:{x:2,y:1.5},icon:{size:65,styles:{}}},content_text:{padding:{x:2,y:1.5},text:"",styles:{}}},show:{item_variant:"default",item_viz:"viz_button",item_style:"filled_square"},viz_button:{inactive:{background:{styles:{fill:"var(--secondary-background-color)"}},icon:{styles:{fill:"var(--primary-text-color)"}},text:{styles:{fill:"var(--primary-text-color)"}}},active:{background:{styles:{fill:"var(--primary-color)"}},icon:{styles:{fill:"var(--primary-background-color)"}},text:{styles:{fill:"var(--primary-background-color)"}}},animation:{duration:200,easing:"ease-out"},press:{scale:.9,duration:140,easing:"ease-out"}},viz_line:{indicator:{position:"bottom",padding:{x:1,y:.75},thickness:.75,radius:.375},inactive:{background:{styles:{fill:"var(--secondary-background-color)"}},indicator:{styles:{fill:"var(--divider-color)"}},icon:{styles:{fill:"var(--primary-text-color)"}},text:{styles:{fill:"var(--primary-text-color)"}}},active:{background:{styles:{fill:"var(--secondary-background-color)"}},indicator:{styles:{fill:"var(--primary-color)"}},icon:{styles:{fill:"var(--primary-color)"}},text:{styles:{fill:"var(--primary-color)"}}},animation:{duration:200,easing:"ease-out"},press:{scale:.9,duration:140,easing:"ease-out"}}},o={},n={background:{styles:{fill:"var(--card-background-color)",stroke:"var(--divider-color)","stroke-width":.5}},viz_button:{inactive:{background:{styles:{fill:"var(--card-background-color)",stroke:"var(--divider-color)","stroke-width":.5}}},active:{background:{styles:{fill:"var(--primary-color)",stroke:"none"}},icon:{styles:{fill:"var(--primary-background-color)"}},text:{styles:{fill:"var(--primary-background-color)"}}}},viz_line:{inactive:{background:{styles:{fill:"var(--card-background-color)",stroke:"var(--divider-color)","stroke-width":.5}}},active:{background:{styles:{fill:"var(--card-background-color)",stroke:"var(--divider-color)","stroke-width":.5}}}}},l={background:{radius:5}},h={background:{radius:2}},c={filled_round:bt.mergeDeep(o,l),filled_square:bt.mergeDeep(o,h),outlined_round:bt.mergeDeep(n,l),outlined_square:bt.mergeDeep(n,h)},d=bt.mergeDeep(r,t);if("default"!==d.show.item_variant)throw Error(`[controls] Invalid button item_variant '${d.show.item_variant}' [default]`);if(!["viz_button","viz_line"].includes(d.show.item_viz))throw Error(`[controls] Invalid button item_viz '${d.show.item_viz}' [viz_button, viz_line]`);if(!Object.hasOwn(c,d.show.item_style))throw Error(`[controls] Invalid button item_style '${d.show.item_style}' [${Object.keys(c).join(", ")}]`);const u=bt.mergeDeep(r,c[d.show.item_style],t),p=u.show.item_viz;u[p]=bt.mergeDeep(r.viz_button,u[p]),u.state_map=void 0===t.state_map?{map:[{state:"on",active:!0},{state:"default",active:!1}]}:bt.mergeDeep({},t.state_map),super(u,e,i,s,a),this.config.svg=this.calculateSvgDimensions(),this.active=!1,this.contentTextTool=void 0,this.contentIconTool=void 0,this.contentVisual=void 0,this.contentTextBaseStyles=void 0,this.contentIconBaseStyles=void 0,this.createButtonContentTools(),this.createControlLabelTextTool(this.config.width,this.config.height)}createButtonContentTools(){this.contentVisual?.disconnected();const t=this.config.content.mode,e=this.config.content[t],i=["content_horizontal","content_vertical","content_icon"].includes(t),s=["content_horizontal","content_vertical","content_text"].includes(t),a="content_vertical"===t,r=this.config.width-2*e.padding.x;let o=this.config.height-2*e.padding.y,n=this.config.ypos;if("viz_line"===this.config.show.item_viz){const t=this.config.viz_line,e=t.indicator.padding.y+t.indicator.thickness;o-=e,n+="top"===t.indicator.position?e/2:-e/2}if(void 0!==e.items){if(!["content_horizontal","content_vertical"].includes(t))throw Error("[controls] Explicit button content items require content_horizontal or content_vertical");return this.contentIconTool=void 0,this.contentTextTool=void 0,void(this.contentVisual=new Un(e,"content_vertical"===t?"vertical":"horizontal",{xpos:this.config.xpos,ypos:n,width:this.config.width,height:o,group:this.config.group},{},this.entity_index,`${this.id}-content`,this.templates,this.cardId,this.card))}this.contentVisual=void 0;const l=e.icon,h="content_text"===t?e:e.text,c=i?Math.min(r,o)*l.size/100:0,d=i&&s&&!a?r-c-e.gap:r,u=i&&s&&!a?this.config.xpos-(d+e.gap)/2:this.config.xpos,p=i&&s&&a?n-(c+e.gap)/2:n,g=i&&s&&!a?this.config.xpos+(c+e.gap)/2:this.config.xpos,m=i&&s&&a?n+(c+e.gap)/2:n;if(i){const t=bt.mergeDeep({id:`${this.id}-icon`,group:this.config.group,entity_index:this.entity_index,xpos:u,yposc:p,icon_size_percent:c,tap_action:{action:"none"},styles:{"pointer-events":"none"}},l,{xpos:u,yposc:p,icon_size_percent:c,tap_action:{action:"none"}});delete t.size,this.contentIconBaseStyles=da.toStyleDict(t.styles),this.contentIconTool=new Rn(t,0,this.templates,this.cardId,this.card)}else this.contentIconBaseStyles=void 0,this.contentIconTool=void 0;if(s){const t=bt.mergeDeep({id:`${this.id}-text`,group:this.config.group,entity_index:this.entity_index,xpos:g,yposc:m,text_overflow:{mode:"fit",fit:{max_width:d}},tap_action:{action:"none"},styles:{"text-anchor":"middle","dominant-baseline":"central","pointer-events":"none"}},h,{xpos:g,yposc:m,tap_action:{action:"none"}});delete t.padding,this.contentTextBaseStyles=da.toStyleDict(t.styles),this.contentTextTool=new rn(t,0,this.templates,this.cardId,this.card)}else this.contentTextBaseStyles=void 0,this.contentTextTool=void 0}updateRuntimeConfig(){super.updateRuntimeConfig(),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config),this.createButtonContentTools(),this.createControlLabelTextTool(this.config.width,this.config.height)),this.contentVisual&&this.contentVisual.updateRuntimeConfig(),this.contentIconTool&&this.contentIconTool.updateRuntimeConfig(),this.contentTextTool&&this.contentTextTool.updateRuntimeConfig()}setStaticState(){super.setStaticState();const t=this.config[this.config.show.item_viz],e=t.inactive,i=t.animation.duration+"ms "+t.animation.easing;this.active=!1,this.contentVisual&&this.contentVisual.setState(e,i),this.contentIconTool&&(this.contentIconTool.config.styles=bt.mergeDeep(da.toStyleDict(e.icon.styles),this.contentIconBaseStyles,{transition:"fill "+i+", color "+i+", opacity "+i}),this.contentIconTool.setStaticState()),this.contentTextTool&&(this.contentTextTool.config.styles=bt.mergeDeep(da.toStyleDict(e.text.styles),this.contentTextBaseStyles,{transition:"fill "+i+", color "+i+", opacity "+i}),this.contentTextTool.setStaticState())}setState(t,e){super.setState(t,e);const i=this.config.state_map.map.find((e=>String(e.state)===String(t.state)))??this.config.state_map.map.find((t=>"default"===t.state)),s=this.config[this.config.show.item_viz],a=i.active?s.active:s.inactive,r=`${s.animation.duration}ms ${s.animation.easing}`;this.active=i.active,this.contentVisual&&this.contentVisual.setState(a,r),this.contentIconTool&&(this.contentIconTool.config.styles=bt.mergeDeep(da.toStyleDict(a.icon.styles),this.contentIconBaseStyles,{transition:`fill ${r}, color ${r}, opacity ${r}`}),this.contentIconTool.setState(t,e)),this.contentTextTool&&(this.contentTextTool.config.styles=bt.mergeDeep(da.toStyleDict(a.text.styles),this.contentTextBaseStyles,{transition:`fill ${r}, color ${r}, opacity ${r}`}),this.contentTextTool.setState(t,e))}updated(){super.updated(),this.contentVisual&&this.contentVisual.updated(),this.contentIconTool&&this.contentIconTool.updated(),this.contentTextTool&&this.contentTextTool.updated()}firstUpdated(t){super.firstUpdated(t),this.contentVisual&&this.contentVisual.firstUpdated(t)}hassAvailable(){super.hassAvailable(),this.contentVisual&&this.contentVisual.hassAvailable()}connected(){super.connected(),this.contentVisual&&this.contentVisual.connected()}disconnected(){this.contentVisual&&this.contentVisual.disconnected(),super.disconnected()}hassConnected(){super.hassConnected(),this.contentVisual&&this.contentVisual.hassConnected()}requiresHassUpdate(){return super.requiresHassUpdate()||this.contentVisual&&this.contentVisual.requiresHassUpdate()}calculateSvgDimensions(t=this.config){return this.card.cardLayout.calculateSvgCoordinatesInGroup(t)}animateButtonPress(t){const e=this.config.svg,i=this.config[this.config.show.item_viz].press,s=`translate(${e.xpos}px, ${e.ypos}px) scale(1) translate(-${e.xpos}px, -${e.ypos}px)`,a=`translate(${e.xpos}px, ${e.ypos}px) scale(${i.scale}) translate(-${e.xpos}px, -${e.ypos}px)`;t.getAnimations().forEach((t=>t.cancel())),t.animate([{transform:s},{transform:a},{transform:s}],{duration:i.duration,easing:i.easing})}render(){const t=this.config.show.item_viz,e=this.config[t],i=this.active?e.active:e.inactive,s=`${e.animation.duration}ms ${e.animation.easing}`,a=eo.calculateSvgDimension(this.config.width),r=eo.calculateSvgDimension(this.config.height),o=this.config.svg.xpos-a/2,n=this.config.svg.ypos-r/2,l=this.getStyles(bt.mergeDeep(da.toStyleDict(this.config.background.styles),da.toStyleDict(i.background.styles),{transition:`fill ${s}, stroke ${s}, opacity ${s}`}));let h=V``;if("viz_line"===this.config.show.item_viz){const t=eo.calculateSvgDimension(e.indicator.padding.x),l=eo.calculateSvgDimension(e.indicator.padding.y),c=eo.calculateSvgDimension(e.indicator.thickness),d="top"===e.indicator.position?n+l:n+r-l-c,u=Math.min(eo.calculateSvgDimension(this.config.background.radius),a/2,r/2),p=eo.calculateRoundedRectHorizontalInset(u,n,n+r,d,d+c)+t,g=a-2*p,m=this.getStyles(bt.mergeDeep(da.toStyleDict(i.indicator.styles),{transition:`fill ${s}, stroke ${s}, opacity ${s}`,"pointer-events":"none"}));h=V`
        <rect
          class="button-control__indicator"
          x="${o+p}"
          y="${d}"
          width="${g}"
          height="${c}"
          rx="${eo.calculateSvgDimension(e.indicator.radius)}"
          style=${gt(m)}
        />
      `}const c=V`
      <g
        class="button-control"
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <rect
          class="button-control__background"
          x="${o}"
          y="${n}"
          width="${a}"
          height="${r}"
          rx="${eo.calculateSvgDimension(this.config.background.radius)}"
          style=${gt(l)}
        />
        ${h}
      </g>
    `,d=V`
      <g class="button-control__press">
        ${c}
        ${this.contentVisual?.render()}
        ${this.contentIconTool?.render()}
        ${this.contentTextTool?.render()}
        <rect
          class="button-control__hit-area"
          x="${o}"
          y="${n}"
          width="${a}"
          height="${r}"
          fill="transparent"
          style="outline: none;"
          tabindex="0"
          role="button"
          ${this.controlActionHandler(this.config,this.entity_index)}
          @pointerdown=${t=>this.animateButtonPress(t.currentTarget.parentElement)}
          @action=${t=>this.handleControlAction(t,this.config,this.entity_index)}
        />
      </g>
    `;return this.renderControl(d)}}class Yn extends Nn{constructor(t,e,i,s,a){const r={show:{item_variant:"stepper",item_viz:"buttons",item_style:"filled_square"},orientation:"horizontal",width:30,height:10,padding:{x:.5,y:.5},gap:.5,animation:{press:{scale:.9,duration:140,easing:"ease-out"}},background:{radius:2,styles:{fill:"transparent"}},content:{mode:"content_horizontal",content_horizontal:{minus:{tap_action:{action:"decrement"},background:{radius:2,styles:{fill:"var(--secondary-background-color)"}},mode:"content_text",content_text:{text:"-",styles:{}},content_icon:{size:75,icon:{icon:"mdi:minus",styles:{fill:"var(--primary-text-color)"}}}},value:{size:75,show:{uom:"end"},styles:{}},plus:{tap_action:{action:"increment"},background:{radius:2,styles:{fill:"var(--secondary-background-color)"}},mode:"content_text",content_text:{text:"+",styles:{}},content_icon:{size:75,icon:{icon:"mdi:plus",styles:{fill:"var(--primary-text-color)"}}}}},content_vertical:{minus:{tap_action:{action:"decrement"},background:{radius:2,styles:{fill:"var(--secondary-background-color)"}},mode:"content_text",content_text:{text:"-",styles:{}},content_icon:{size:75,icon:{icon:"mdi:chevron-down",styles:{fill:"var(--primary-text-color)"}}}},value:{size:75,show:{uom:"end"},styles:{}},plus:{tap_action:{action:"increment"},background:{radius:2,styles:{fill:"var(--secondary-background-color)"}},mode:"content_text",content_text:{text:"+",styles:{}},content_icon:{size:75,icon:{icon:"mdi:chevron-up",styles:{fill:"var(--primary-text-color)"}}}}}}},o={background:{styles:{fill:"var(--secondary-background-color)",stroke:"none"}},content:{content_horizontal:{minus:{background:{styles:{fill:"var(--card-background-color)",stroke:"none"}}},plus:{background:{styles:{fill:"var(--card-background-color)",stroke:"none"}}}},content_vertical:{minus:{background:{styles:{fill:"var(--card-background-color)",stroke:"none"}}},plus:{background:{styles:{fill:"var(--card-background-color)",stroke:"none"}}}}}},n={background:{styles:{fill:"var(--card-background-color)",stroke:"var(--divider-color)","stroke-width":.5}},content:{content_horizontal:{minus:{background:{styles:{fill:"transparent",stroke:"none"}},content_text:{styles:{fill:"var(--primary-text-color)"}},content_icon:{icon:{styles:{fill:"var(--primary-text-color)"}}}},value:{styles:{fill:"var(--primary-text-color)"}},plus:{background:{styles:{fill:"transparent",stroke:"none"}},content_text:{styles:{fill:"var(--primary-text-color)"}},content_icon:{icon:{styles:{fill:"var(--primary-text-color)"}}}}},content_vertical:{minus:{background:{styles:{fill:"transparent",stroke:"none"}},content_text:{styles:{fill:"var(--primary-text-color)"}},content_icon:{icon:{styles:{fill:"var(--primary-text-color)"}}}},value:{styles:{fill:"var(--primary-text-color)"}},plus:{background:{styles:{fill:"transparent",stroke:"none"}},content_text:{styles:{fill:"var(--primary-text-color)"}},content_icon:{icon:{styles:{fill:"var(--primary-text-color)"}}}}}}},l={background:{radius:5}},h={background:{radius:2}},c={filled_round:bt.mergeDeep(o,l),filled_square:bt.mergeDeep(o,h),outlined_round:bt.mergeDeep(n,l),outlined_square:bt.mergeDeep(n,h)},d=bt.mergeDeep({},t);["content_horizontal","content_vertical"].forEach((t=>{const e=d.content?.[t];if("string"==typeof e){if(!["content_text","content_icon"].includes(e))throw Error(`[controls] Invalid number content shorthand '${e}' [content_text, content_icon]`);d.content[t]={minus:{mode:e},plus:{mode:e}}}}));const u=bt.mergeDeep(r,d);if("stepper"!==u.show.item_variant)throw Error(`[controls] Invalid number item_variant '${u.show.item_variant}' [stepper]`);if("buttons"!==u.show.item_viz)throw Error(`[controls] Invalid number item_viz '${u.show.item_viz}' [buttons]`);if(!Object.hasOwn(c,u.show.item_style))throw Error(`[controls] Invalid number item_style '${u.show.item_style}' [${Object.keys(c).join(", ")}]`);const p="vertical"===u.orientation?{content:{content_horizontal:{minus:{content_icon:{icon:{icon:"mdi:chevron-down"}}},plus:{content_icon:{icon:{icon:"mdi:chevron-up"}}}},content_vertical:{minus:{content_icon:{icon:{icon:"mdi:chevron-down"}}},plus:{content_icon:{icon:{icon:"mdi:chevron-up"}}}}}}:{content:{content_horizontal:{minus:{content_icon:{icon:{icon:"mdi:minus"}}},plus:{content_icon:{icon:{icon:"mdi:plus"}}}},content_vertical:{minus:{content_icon:{icon:{icon:"mdi:minus"}}},plus:{content_icon:{icon:{icon:"mdi:plus"}}}}}};super(bt.mergeDeep(r,p,c[u.show.item_style],d),e,i,s,a),this.config.svg=this.calculateSvgDimensions(),this.minusContentTool=void 0,this.plusContentTool=void 0,this.valueStateTool=void 0,this.minusActionConfig=void 0,this.plusActionConfig=void 0,this.createNumberContentTools(),this.createControlLabelTextTool(this.config.width,this.config.height)}createNumberContentTools(){const t="horizontal"===this.config.orientation,e=this.config.content[this.config.content.mode],i=this.config.width-2*this.config.padding.x,s=this.config.height-2*this.config.padding.y,a=t?i:s,r=t?s:i,o=Math.min(r,(a-2*this.config.gap)/3),n=(t?i:s)-2*o-2*this.config.gap,l=t?this.config.xpos-n/2-this.config.gap-o/2:this.config.xpos,h=t?this.config.ypos:this.config.ypos+n/2+this.config.gap+o/2,c=t?this.config.xpos+n/2+this.config.gap+o/2:this.config.xpos,d=t?this.config.ypos:this.config.ypos-n/2-this.config.gap-o/2;this.numberGeometry={horizontal:t,innerWidth:i,innerHeight:s,buttonSize:o,valueWidth:t?n:i,valueHeight:t?s:n,minusCenterX:l,minusCenterY:h,plusCenterX:c,plusCenterY:d};const u=[{name:"minus",config:e.minus,xpos:l,ypos:h},{name:"plus",config:e.plus,xpos:c,ypos:d}].map(((t,e)=>{if("content_icon"===t.config.mode){const i=bt.mergeDeep({id:`${this.id}-${t.name}-icon`,group:this.config.group,entity_index:this.entity_index,xpos:t.xpos,yposc:t.ypos,icon_size_percent:o*t.config.content_icon.size/100,tap_action:{action:"none"},styles:{"pointer-events":"none"}},t.config.content_icon.icon,{tap_action:{action:"none"}});return new Rn(i,e,this.templates,this.cardId,this.card)}const i=bt.mergeDeep({id:`${this.id}-${t.name}-text`,group:this.config.group,entity_index:this.entity_index,xpos:t.xpos,yposc:t.ypos,text:t.config.content_text.text,tap_action:{action:"none"},styles:{"text-anchor":"middle","dominant-baseline":"central","pointer-events":"none"}},t.config.content_text,{tap_action:{action:"none"}});return new rn(i,e,this.templates,this.cardId,this.card)}));[this.minusContentTool,this.plusContentTool]=u;const p=bt.mergeDeep({id:`${this.id}-value`,group:this.config.group,entity_index:this.entity_index,xpos:this.config.xpos,ypos:this.config.ypos,tap_action:{action:"none"},styles:{"text-anchor":"middle","pointer-events":"none"}},e.value,{xpos:this.config.xpos,ypos:this.config.ypos,tap_action:{action:"none"}});this.valueStateTool=new sn(p,0,this.templates,this.cardId,this.card),this.valueMeasurementSignature="",this.valueMeasurementPass=0}updateRuntimeConfig(){super.updateRuntimeConfig(),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config),this.createNumberContentTools(),this.createControlLabelTextTool(this.config.width,this.config.height)),this.minusContentTool.updateRuntimeConfig(),this.plusContentTool.updateRuntimeConfig(),this.valueStateTool.updateRuntimeConfig()}setState(t,e){super.setState(t,e);const i=this.config.content[this.config.content.mode],s=t.entity_id.split(".")[0];this.minusActionConfig=bt.mergeDeep(i.minus,{tap_action:"decrement"===i.minus.tap_action.action?{action:"perform-action",perform_action:`${s}.decrement`,target:{entity_id:t.entity_id}}:i.minus.tap_action}),this.plusActionConfig=bt.mergeDeep(i.plus,{tap_action:"increment"===i.plus.tap_action.action?{action:"perform-action",perform_action:`${s}.increment`,target:{entity_id:t.entity_id}}:i.plus.tap_action}),this.minusContentTool.setState(t,e),this.plusContentTool.setState(t,e),this.valueStateTool.setState(t,e),this.valueMeasurementSignature!==this.valueStateTool.textMeasurementSignature&&(this.valueMeasurementSignature=this.valueStateTool.textMeasurementSignature,this.valueMeasurementPass=0)}updated(){super.updated(),this.minusContentTool.updated(),this.plusContentTool.updated(),this.valueMeasurementPass<5&&(this.valueMeasurementPass+=1,this.valueStateTool.updated())}calculateSvgDimensions(t=this.config){return this.card.cardLayout.calculateSvgCoordinatesInGroup(t)}animateButtonPress(t,e){const i=`translate(${e.xpos}px, ${e.ypos}px) scale(1) translate(-${e.xpos}px, -${e.ypos}px)`,s=`translate(${e.xpos}px, ${e.ypos}px) scale(${this.config.animation.press.scale}) translate(-${e.xpos}px, -${e.ypos}px)`;t.getAnimations().forEach((t=>t.cancel())),t.animate([{transform:i},{transform:s},{transform:i}],{duration:this.config.animation.press.duration,easing:this.config.animation.press.easing})}render(){const t=this.config.content[this.config.content.mode],e=this.numberGeometry,i=eo.calculateSvgDimension(this.config.width),s=eo.calculateSvgDimension(this.config.height),a=eo.calculateSvgDimension(e.buttonSize),r=this.card.cardLayout.calculateSvgCoordinatesInGroup({group:this.config.group,xpos:e.minusCenterX,ypos:e.minusCenterY}),o=this.card.cardLayout.calculateSvgCoordinatesInGroup({group:this.config.group,xpos:e.plusCenterX,ypos:e.plusCenterY}),n=this.valueStateTool.getWidth(),l=this.valueStateTool.getHeight(),h=e.valueHeight*t.value.size/100,c=Math.min(1,e.valueWidth/n,h/l),d=`translate(${this.valueStateTool.config.svg.xpos} ${this.valueStateTool.config.svg.ypos}) scale(${c}) translate(-${this.valueStateTool.getXpos()} -${this.valueStateTool.getYpos()})`,u=this.getStyles(da.toStyleDict(this.config.background.styles)),p=this.getStyles(da.toStyleDict(t.minus.background.styles)),g=this.getStyles(da.toStyleDict(t.plus.background.styles)),m=V`
      <g
        class="number-control"
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <rect
          class="number-control__background"
          x="${this.config.svg.xpos-i/2}"
          y="${this.config.svg.ypos-s/2}"
          width="${i}"
          height="${s}"
          rx="${eo.calculateSvgDimension(this.config.background.radius)}"
          style=${gt(u)}
        />
      </g>
    `;return this.renderControl(V`
      ${m}
      <g class="number-control__minus-button">
        <rect
          class="number-control__minus-background"
          x="${r.xpos-a/2}"
          y="${r.ypos-a/2}"
          width="${a}"
          height="${a}"
          rx="${eo.calculateSvgDimension(t.minus.background.radius)}"
          style=${gt(p)}
        />
        ${this.minusContentTool.render()}
        <rect
          class="number-control__minus-hit-area"
          x="${r.xpos-a/2}"
          y="${r.ypos-a/2}"
          width="${a}"
          height="${a}"
          fill="transparent"
          style="outline: none;"
          tabindex="0"
          role="button"
          ${this.controlActionHandler(this.minusActionConfig,this.entity_index)}
          @pointerdown=${t=>this.animateButtonPress(t.currentTarget.parentElement,r)}
          @action=${t=>this.handleControlAction(t,this.minusActionConfig,this.entity_index)}
        />
      </g>
      <g class="number-control__value" transform="${d}">
        ${this.valueStateTool.render()}
      </g>
      <g class="number-control__plus-button">
        <rect
          class="number-control__plus-background"
          x="${o.xpos-a/2}"
          y="${o.ypos-a/2}"
          width="${a}"
          height="${a}"
          rx="${eo.calculateSvgDimension(t.plus.background.radius)}"
          style=${gt(g)}
        />
        ${this.plusContentTool.render()}
        <rect
          class="number-control__plus-hit-area"
          x="${o.xpos-a/2}"
          y="${o.ypos-a/2}"
          width="${a}"
          height="${a}"
          fill="transparent"
          style="outline: none;"
          tabindex="0"
          role="button"
          ${this.controlActionHandler(this.plusActionConfig,this.entity_index)}
          @pointerdown=${t=>this.animateButtonPress(t.currentTarget.parentElement,o)}
          @action=${t=>this.handleControlAction(t,this.plusActionConfig,this.entity_index)}
        />
      </g>
    `)}}class Xn extends Nn{static removeDisabledOptionConfigs(t,e){void 0!==t.option_map&&(t.option_map=t.option_map.filter((t=>void 0===t.disabled||!da.isDisabled(t,t.disabled,"controls.option_map",e))))}static normalizeOptionMap(t,e){if(!Array.isArray(t)||0===t.length)throw Error("[controls] Select option_map must contain at least one option");return t.map(((t,i)=>{if(!Object.hasOwn(t,"value"))throw Error(`[controls] Select option_map[${i}] requires value`);return bt.mergeDeep({state:t.value,text:t.value,tap_action:e.tap_action,...void 0!==e.hold_action?{hold_action:e.hold_action}:{},...void 0!==e.double_tap_action?{double_tap_action:e.double_tap_action}:{},entity_index:e.entity_index,content:{},text_config:{},icon_config:{}},t)}))}static buildOptionActionConfig(t){const e=i=>{if(Array.isArray(i))return i.map((t=>e(t)));if(i&&"object"==typeof i)return Object.fromEntries(Object.entries(i).map((([t,i])=>[t,e(i)])));if("string"!=typeof i)return i;const s=i.trim(),a=s.match(/^option\(([A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*)\)$/);if(null===a){if(s.startsWith("option("))throw Error(`[controls] Invalid select option reference '${i}'`);return i}let r=t;return a[1].split(".").forEach((t=>{if(null===r||"object"!=typeof r||!Object.hasOwn(r,t))throw Error(`[controls] Select option reference '${i}' not found`);r=r[t]})),r},i=bt.mergeDeep({},t);return["tap_action","hold_action","double_tap_action"].forEach((t=>{void 0!==i[t]&&(i[t]=e(i[t]))})),i}constructor(t,e,i,s,a){const r=void 0===t.option_map,o={orientation:"horizontal",width:34,height:11,tap_action:{action:"select-option",option:"option(value)"},background:{radius:5,styles:{}},track:{padding:{x:.5,y:.5},styles:{}},separator:{padding:{x:1,y:1},styles:{stroke:"var(--divider-color)","stroke-width":.25}},option_map:[],content:{mode:"content_vertical",content_vertical:{padding:{x:.5,y:.5},gap:.5,icon:{size:45,styles:{}},text:{styles:{}}},content_horizontal:{padding:{x:.5,y:.5},gap:.5,icon:{size:45,styles:{}},text:{styles:{}}}},show:{item_variant:"segmented",item_viz:"viz_button",item_style:"filled_round",separator:!0},viz_button:{background:{styles:{fill:"var(--secondary-background-color)"}},track:{styles:{fill:"transparent"}},indicator:{position:"fill",padding:{x:.5,y:.5},thickness:.75,radius:2,styles:{fill:"var(--primary-color)",opacity:.8}},selected:{background:{styles:{fill:"transparent"}},icon:{styles:{fill:"var(--primary-background-color)"}},text:{styles:{fill:"var(--primary-background-color)"}}},unselected:{background:{styles:{fill:"transparent"}},icon:{styles:{fill:"var(--primary-text-color)"}},text:{styles:{fill:"var(--primary-text-color)"}}},animation:{duration:250,easing:"ease-out"},press:{scale:.9,duration:140,easing:"ease-out"}},viz_line:{background:{styles:{fill:"var(--secondary-background-color)"}},track:{styles:{fill:"transparent"}},indicator:{position:"bottom",padding:{x:.5,y:.5},thickness:.75,radius:.375,styles:{fill:"var(--primary-color)"}},selected:{background:{styles:{fill:"transparent"}},icon:{styles:{fill:"var(--primary-color)"}},text:{styles:{fill:"var(--primary-color)"}}},unselected:{background:{styles:{fill:"transparent"}},icon:{styles:{fill:"var(--primary-text-color)"}},text:{styles:{fill:"var(--primary-text-color)"}}},animation:{duration:250,easing:"ease-out"},press:{scale:.9,duration:140,easing:"ease-out"}}},n={background:{styles:{fill:"var(--secondary-background-color)",stroke:"none"}},viz_button:{background:{styles:{fill:"var(--secondary-background-color)",stroke:"none"}},indicator:{styles:{fill:"var(--primary-color)",stroke:"none"}}},viz_line:{background:{styles:{fill:"var(--secondary-background-color)",stroke:"none"}},indicator:{styles:{fill:"var(--primary-color)",stroke:"none"}}}},l={background:{styles:{fill:"var(--card-background-color)",stroke:"var(--divider-color)","stroke-width":1}},viz_button:{background:{styles:{fill:"var(--card-background-color)",stroke:"var(--divider-color)","stroke-width":1}},track:{styles:{fill:"transparent"}},indicator:{styles:{fill:"var(--primary-color)",stroke:"none"}},selected:{background:{styles:{fill:"transparent"}},icon:{styles:{fill:"var(--primary-background-color)"}},text:{styles:{fill:"var(--primary-background-color)"}}}},viz_line:{background:{styles:{fill:"var(--card-background-color)",stroke:"var(--divider-color)","stroke-width":1}},track:{styles:{fill:"transparent"}},indicator:{styles:{fill:"var(--primary-color)",stroke:"none"}}}},h={background:{radius:5}},c={background:{radius:2}},d={filled_round:bt.mergeDeep(n,h),filled_square:bt.mergeDeep(n,c),outlined_round:bt.mergeDeep(l,h),outlined_square:bt.mergeDeep(l,c)},u=bt.mergeDeep(o,t);if("segmented"!==u.show.item_variant)throw Error(`[controls] Invalid select item_variant '${u.show.item_variant}' [segmented]`);if(!["viz_button","viz_line"].includes(u.show.item_viz))throw Error(`[controls] Invalid select item_viz '${u.show.item_viz}' [viz_button, viz_line]`);if(!Object.hasOwn(d,u.show.item_style))throw Error(`[controls] Invalid select item_style '${u.show.item_style}' [${Object.keys(d).join(", ")}]`);const p=bt.mergeDeep(o,d[u.show.item_style],t),g=p.show.item_viz;p[g]=bt.mergeDeep(o.viz_button,p[g]);let m=p[g].indicator.padding;"number"==typeof m&&(p[g].indicator.padding={x:m,y:m}),m=p[g].indicator.padding,"number"==typeof m.y&&(m.y={top:m.y,bottom:m.y}),p.separator.padding=bt.mergeDeep(p.separator.padding,{x:p.track.padding.x+m.x},t.separator?.padding??{}),["content_vertical","content_horizontal"].forEach((t=>{const e=p.content[t].padding;"number"==typeof e.y&&(e.y={top:e.y,bottom:e.y})})),p.option_map=r?[]:Xn.normalizeOptionMap(p.option_map,p),super(p,e,i,s,a),this.usesEntityOptions=r,this.optionsInitialized=!r,this.entityOptionsSignature=void 0,this.controlHassAvailable=!1,this.controlConnected=!1,this.config.svg=this.calculateSvgDimensions(),this.selectedOptionIndex=-1,this.optionTextTools=[],this.optionIconTools=[],this.optionContentVisuals=[],this.optionActionConfigs=this.optionsInitialized?this.config.option_map.map((t=>Xn.buildOptionActionConfig(t))):[],this.optionsInitialized&&this.createOptionContentTools(),this.createControlLabelTextTool(this.config.width,this.config.height)}createOptionContentTools(){this.optionContentVisuals.forEach((t=>t.disconnected())),this.optionContentVisuals=[],this.optionTextBaseStyles=[],this.optionIconBaseStyles=[];const t=this.config.option_map.length,e="horizontal"===this.config.orientation,i="content_vertical"===this.config.content.mode,s=this.config.width-2*this.config.track.padding.x,a=this.config.height-2*this.config.track.padding.y,r=e?s/t:s,o=e?a:a/t,n=this.config.xpos-s/2,l=this.config.ypos-a/2,h=this.config.content[this.config.content.mode],c=this.config[this.config.show.item_viz],d=h.padding.y.top,u=h.padding.y.bottom,p=c.indicator.padding.y.top,g=c.indicator.padding.y.bottom;let m,f,y=0;switch(c.indicator.position){case"fill":m=r-2*h.padding.x,f=o-d-u;break;case"top":m=r-2*h.padding.x,f=o-c.indicator.thickness-p-d-u,y=(c.indicator.thickness+p)/2;break;case"bottom":m=r-2*h.padding.x,f=o-c.indicator.thickness-g-d-u,y=-(c.indicator.thickness+g)/2;break;default:throw Error(`[controls] Invalid select indicator position '${c.indicator.position}' [fill, top, bottom]`)}if(y+=(d-u)/2,void 0!==h.items){this.optionTextTools=[],this.optionIconTools=[];const t=f+d+u;return void(this.optionContentVisuals=this.config.option_map.map(((s,a)=>{const c=e?n+r*(a+.5):this.config.xpos,d=e?this.config.ypos+y:l+o*(a+.5)+y;return new Un(h,i?"vertical":"horizontal",{xpos:c,ypos:d,width:r,height:t,group:this.config.group},s.content,s.entity_index,`${this.id}-option-${a}-content`,this.templates,this.cardId,this.card)})))}const v=Math.min(m,f)*h.icon.size/100,b=i?m:m-v-h.gap;this.optionTextTools=this.config.option_map.map(((t,s)=>{const a=e?n+r*(s+.5):this.config.xpos,c=e?this.config.ypos+y:l+o*(s+.5)+y,d=void 0!==t.icon,u=d&&!i?a+(v+h.gap)/2:a,p=d&&i?c+(v+h.gap)/2:c,g=bt.mergeDeep({id:`${this.id}-option-${s}-text`,group:this.config.group,entity_index:this.entity_index,xpos:u,yposc:p,text:t.text,text_overflow:{mode:"fit",fit:{max_width:d?b:m}},tap_action:{action:"none"},styles:{"text-anchor":"middle","dominant-baseline":"central","pointer-events":"none"}},h.text,t.text_config,{tap_action:{action:"none"}});return this.optionTextBaseStyles[s]=g.styles,new rn(g,s,this.templates,this.cardId,this.card)})),this.optionIconTools=this.config.option_map.map(((t,s)=>{if(void 0===t.icon)return;const a="string"==typeof t.icon?{icon:t.icon}:t.icon,c=e?n+r*(s+.5):this.config.xpos,d=e?this.config.ypos+y:l+o*(s+.5)+y,u=i?c:c-(b+h.gap)/2,p=i?d-(v+h.gap)/2:d,g=bt.mergeDeep({id:`${this.id}-option-${s}-icon`,group:this.config.group,entity_index:this.entity_index,xpos:u,yposc:p,icon_size_percent:v,tap_action:{action:"none"},styles:{"pointer-events":"none"}},h.icon,a,t.icon_config,{tap_action:{action:"none"}});return delete g.size,this.optionIconBaseStyles[s]=g.styles,new Rn(g,s,this.templates,this.cardId,this.card)}))}updateRuntimeConfig(){super.updateRuntimeConfig();let t=!1;this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config),this.optionsInitialized&&(this.createOptionContentTools(),t=!0),this.createControlLabelTextTool(this.config.width,this.config.height)),this.optionContentVisuals.forEach((t=>t.updateRuntimeConfig())),this.optionTextTools.forEach((t=>t.updateRuntimeConfig())),this.optionIconTools.filter((t=>void 0!==t)).forEach((t=>t.updateRuntimeConfig())),t&&this.controlHassAvailable&&this.optionContentVisuals.forEach((t=>t.hassAvailable())),t&&this.controlConnected&&this.optionContentVisuals.forEach((t=>t.connected()))}setState(t,e){if(super.setState(t,e),this.usesEntityOptions){if(!Array.isArray(t.attributes.options)||0===t.attributes.options.length)throw Error(`[controls] Select '${this.id}' requires option_map or entity.attributes.options`);const e=JSON.stringify(t.attributes.options);if(e!==this.entityOptionsSignature){const i=t.attributes.options.map((t=>({value:t})));this.config.option_map=Xn.normalizeOptionMap(i,this.config),this.entityOptionsSignature=e,this.optionsInitialized=!0,this.createOptionContentTools(),this.optionContentVisuals.forEach((t=>t.updateRuntimeConfig())),this.optionTextTools.forEach((t=>t.updateRuntimeConfig())),this.optionIconTools.filter((t=>void 0!==t)).forEach((t=>t.updateRuntimeConfig())),this.controlHassAvailable&&this.optionContentVisuals.forEach((t=>t.hassAvailable())),this.controlConnected&&this.optionContentVisuals.forEach((t=>t.connected()))}}const i=void 0===e.attribute?t.state:t.attributes[e.attribute];this.selectedOptionIndex=this.config.option_map.findIndex((t=>String(t.state)===String(i)));const s=this.config[this.config.show.item_viz],a=`${s.animation.duration}ms ${s.animation.easing}`;this.optionActionConfigs=this.config.option_map.map((t=>Xn.buildOptionActionConfig(t))),this.optionContentVisuals.forEach(((t,e)=>{const i=e===this.selectedOptionIndex?s.selected:s.unselected;t.setState(i,a)})),this.optionTextTools.forEach(((i,r)=>{const o=r===this.selectedOptionIndex?s.selected:s.unselected;i.config.styles=bt.mergeDeep(da.toStyleDict(o.text.styles),da.toStyleDict(this.optionTextBaseStyles[r]),{transition:`fill ${a}, color ${a}, opacity ${a}`}),i.setState(t,e)})),this.optionIconTools.forEach(((t,e)=>{if(void 0===t)return;const i=e===this.selectedOptionIndex?s.selected:s.unselected;t.config.styles=bt.mergeDeep(da.toStyleDict(i.icon.styles),da.toStyleDict(this.optionIconBaseStyles[e]),{transition:`fill ${a}, color ${a}, opacity ${a}`}),this.card.cardTools.setToolEntityState(t,this.card.resolvedEntityConfigs,this.card.entities)}))}updated(){super.updated(),this.optionContentVisuals.forEach((t=>t.updated())),this.optionTextTools.forEach((t=>t.updated())),this.optionIconTools.filter((t=>void 0!==t)).forEach((t=>t.updated()))}firstUpdated(t){super.firstUpdated(t),this.optionContentVisuals.forEach((e=>e.firstUpdated(t)))}hassAvailable(){super.hassAvailable(),this.controlHassAvailable=!0,this.optionContentVisuals.forEach((t=>t.hassAvailable()))}connected(){super.connected(),this.controlConnected=!0,this.optionContentVisuals.forEach((t=>t.connected()))}disconnected(){this.optionContentVisuals.forEach((t=>t.disconnected())),this.controlConnected=!1,super.disconnected()}hassConnected(){super.hassConnected(),this.optionContentVisuals.forEach((t=>t.hassConnected()))}requiresHassUpdate(){return super.requiresHassUpdate()||this.optionContentVisuals.some((t=>t.requiresHassUpdate()))}calculateSvgDimensions(t=this.config){return this.card.cardLayout.calculateSvgCoordinatesInGroup(t)}animateOptionPress(t,e,i){const s=this.config[this.config.show.item_viz].press,a=`translate(${e}px, ${i}px) scale(1) translate(-${e}px, -${i}px)`,r=`translate(${e}px, ${i}px) scale(${s.scale}) translate(-${e}px, -${i}px)`;t.getAnimations().forEach((t=>t.cancel())),t.animate([{transform:a},{transform:r},{transform:a}],{duration:s.duration,easing:s.easing})}render(){if(!this.optionsInitialized)return this.renderControl(V``);const t=this.config[this.config.show.item_viz],e="horizontal"===this.config.orientation,i=this.config.option_map.length,s=eo.calculateSvgDimension(this.config.width),a=eo.calculateSvgDimension(this.config.height),r=eo.calculateSvgDimension(this.config.width-2*this.config.track.padding.x),o=eo.calculateSvgDimension(this.config.height-2*this.config.track.padding.y),n=e?r/i:r,l=e?o:o/i,h=this.config.svg.xpos-r/2,c=this.config.svg.ypos-o/2,d=eo.calculateSvgDimension(t.indicator.padding.x),u=eo.calculateSvgDimension(t.indicator.padding.y.top),p=eo.calculateSvgDimension(t.indicator.padding.y.bottom),g=eo.calculateSvgDimension(this.config.separator.padding.x),m=eo.calculateSvgDimension(this.config.separator.styles["stroke-width"]);let f=e&&this.selectedOptionIndex>0?g+m/2:d,y=e&&this.selectedOptionIndex<i-1?g+m/2:d;const v=eo.calculateSvgDimension(t.indicator.thickness);let b,_,x=h+f,w=n-f-y;switch(t.indicator.position){case"fill":b=c+u,_=l-u-p;break;case"top":b=c+u,_=v;break;case"bottom":b=c+l-p-v,_=v;break;default:throw Error(`[controls] Invalid select indicator position '${t.indicator.position}' [fill, top, bottom]`)}const $=this.config.svg.xpos-s/2,k=this.config.svg.ypos-a/2,S=eo.calculateSvgDimension(t.indicator.radius),M=Math.min(eo.calculateSvgDimension(this.config.background.radius),s/2,a/2);if("viz_line"===this.config.show.item_viz){const t=b+(!e&&this.selectedOptionIndex>=0?this.selectedOptionIndex*l:0),s=eo.calculateRoundedRectHorizontalInset(M,k,k+a,t,t+_),r=h-$,o=Math.max(d,s+d-r);e&&0!==this.selectedOptionIndex||(f=Math.max(f,o)),e&&this.selectedOptionIndex!==i-1||(y=Math.max(y,o)),x=h+f,w=n-f-y}const A=Math.min(M-Math.max(h+d-$,b-k),w/2,_/2);let T=S,C=S,E=S,I=S,D=S,z=S,R=S,N=S;"viz_button"===this.config.show.item_viz&&(e?(0===this.selectedOptionIndex&&(T=A,C=A,R=A,N=A),this.selectedOptionIndex===i-1&&(E=A,I=A,D=A,z=A)):(0===this.selectedOptionIndex&&(T=A,C=A,E=A,I=A),this.selectedOptionIndex===i-1&&(R=A,N=A,D=A,z=A)));const P=`\n      M ${x+T} ${b}\n      H ${x+w-E}\n      A ${E} ${I} 0 0 1 ${x+w} ${b+I}\n      V ${b+_-z}\n      A ${D} ${z} 0 0 1 ${x+w-D} ${b+_}\n      H ${x+R}\n      A ${R} ${N} 0 0 1 ${x} ${b+_-N}\n      V ${b+C}\n      A ${T} ${C} 0 0 1 ${x+T} ${b}\n      Z\n    `,G=e&&this.selectedOptionIndex>=0?this.selectedOptionIndex*n:0,F=!e&&this.selectedOptionIndex>=0?this.selectedOptionIndex*l:0,B=`${t.animation.duration}ms ${t.animation.easing}`,O=this.getStyles(bt.mergeDeep(da.toStyleDict(this.config.background.styles),da.toStyleDict(t.background.styles))),H=this.getStyles(bt.mergeDeep(da.toStyleDict(this.config.track.styles),da.toStyleDict(t.track.styles))),L=this.getStyles(bt.mergeDeep(da.toStyleDict(t.indicator.styles),{transition:`fill ${B}, stroke ${B}, opacity ${B}`})),j=eo.calculateSvgDimension(this.config.separator.padding.y),q=this.getStyles(bt.mergeDeep(da.toStyleDict(this.config.separator.styles),{"pointer-events":"none"})),U={transform:`translate(${G}px, ${F}px)`,transition:`transform ${B}`,"pointer-events":"none",visibility:-1===this.selectedOptionIndex?"hidden":"visible"},W=V`
      <g
        class="select-control"
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <rect
          class="select-control__background"
          x="${$}"
          y="${k}"
          width="${s}"
          height="${a}"
          rx="${eo.calculateSvgDimension(this.config.background.radius)}"
          style=${gt(O)}
        />
        <rect
          class="select-control__track"
          x="${h}"
          y="${c}"
          width="${r}"
          height="${o}"
          style=${gt(H)}
        />
        ${this.config.option_map.map(((i,s)=>{const a=s===this.selectedOptionIndex?t.selected:t.unselected;return V`
            <rect
              class="select-control__option-background"
              x="${h+(e?s*n:0)}"
              y="${c+(e?0:s*l)}"
              width="${n}"
              height="${l}"
              style=${gt(this.getStyles(bt.mergeDeep(da.toStyleDict(a.background.styles),{transition:`fill ${B}, stroke ${B}, opacity ${B}`})))}
            />
          `}))}
        <g
          class="select-control__indicator-position"
          style=${gt(U)}
        >
          <path
            class="select-control__indicator"
            d="${P}"
            style=${gt(L)}
          />
        </g>
        ${this.config.show.separator?[...this.config.option_map.keys()].slice(1).map((t=>e?V`
            <line
              class="select-control__separator"
              x1="${h+t*n}"
              y1="${c+j}"
              x2="${h+t*n}"
              y2="${c+o-j}"
              style=${gt(q)}
            />
          `:V`
            <line
              class="select-control__separator"
              x1="${h+g}"
              y1="${c+t*l}"
              x2="${h+r-g}"
              y2="${c+t*l}"
              style=${gt(q)}
            />
          `)):V``}
      </g>
    `,Y=this.config.option_map.map(((t,i)=>V`
      <g class="select-control__option-content">
        ${this.optionIconTools[i]?.render()}
        ${this.optionContentVisuals[i]?.render()}
        ${this.optionTextTools[i]?.render()}
        <rect
          class="select-control__hit-area"
          x="${h+(e?i*n:0)}"
          y="${c+(e?0:i*l)}"
          width="${n}"
          height="${l}"
          fill="transparent"
          style="outline: none;"
          tabindex="0"
          role="button"
          ${this.controlActionHandler(this.optionActionConfigs[i],this.entity_index)}
          @pointerdown=${t=>this.animateOptionPress(t.currentTarget.parentElement,h+(e?i*n:0)+n/2,c+(e?0:i*l)+l/2)}
          @action=${t=>this.handleControlAction(t,this.optionActionConfigs[i],this.entity_index)}
        />
      </g>
    `));return this.renderControl(V`${W}${Y}`)}}class Jn extends Nn{constructor(t,e,i,s,a){const r={show:{item_variant:"single",item_viz:"linear",item_style:"ha"},orientation:"horizontal",width:40,height:10,scale:{min:{attribute:"min"},max:{attribute:"max"},step:{attribute:"step"}},interaction:{update_interval:100,haptic:"selection"},animation:{duration:180,easing:"ease-in-out"},set_value_action:{action:"set-value"},value:{show:!0,position:"top",gap:1,range_spacing:8,separator:"-",offset:{x:0,y:0},state:{show:{uom:"none"},styles:{}},separator_config:{}},linear:{track:{height:8,radius:4,styles:{fill:"var(--secondary-background-color)"}},active:{radius:2,styles:{fill:"var(--fhs-slider-active-color, var(--primary-color))"}},thumb:{width:.8,height:4,radius:.4,margin:1,hit_size:12,styles:{fill:"var(--primary-background-color)"}}},circular:{start_angle:-135,arc_degrees:270,clockwise:!0,radius:12,track:{width:5,styles:{fill:"none",stroke:"var(--secondary-background-color)","stroke-linecap":"round"}},active:{width:5,styles:{fill:"none",stroke:"var(--fhs-slider-active-color, var(--primary-color))","stroke-linecap":"round"}},thumb:{width:.8,length:"50%",hit_size:12,styles:{stroke:"var(--primary-background-color)","stroke-linecap":"round"}},capture:{width:12}}},o="circular"===bt.mergeDeep(r,t).show.item_viz?{width:30,height:30,value:{position:"center"}}:{width:40,height:10},n=bt.mergeDeep(r,o,t);if("string"==typeof n.circular.thumb.length){if(!/^\d+(\.\d+)?%$/.test(n.circular.thumb.length))throw Error("[controls] Slider circular.thumb.length must be numeric or a percentage");n.circular.thumb.length=n.circular.track.width*Number(n.circular.thumb.length.slice(0,-1))/100}if(!["single","range"].includes(n.show.item_variant))throw Error(`[controls] Invalid slider item_variant '${n.show.item_variant}' [single, range]`);if(!["linear","circular"].includes(n.show.item_viz))throw Error(`[controls] Invalid slider item_viz '${n.show.item_viz}' [linear, circular]`);if("ha"!==n.show.item_style)throw Error(`[controls] Invalid slider item_style '${n.show.item_style}' [ha]`);if(!["horizontal","vertical"].includes(n.orientation))throw Error(`[controls] Invalid slider orientation '${n.orientation}' [horizontal, vertical]`);if(!["center","start","end","top","bottom"].includes(n.value.position))throw Error(`[controls] Invalid slider value position '${n.value.position}'`);if(!Number.isFinite(Number(n.interaction.update_interval))||Number(n.interaction.update_interval)<0)throw Error("[controls] Slider interaction.update_interval must be zero or positive");if(!Number.isFinite(Number(n.animation.duration))||Number(n.animation.duration)<0)throw Error("[controls] Slider animation.duration must be zero or positive");if(!Number.isFinite(Number(n.circular.arc_degrees))||Number(n.circular.arc_degrees)<=0||Number(n.circular.arc_degrees)>360)throw Error("[controls] Slider circular.arc_degrees must be greater than zero and at most 360");if(void 0!==n.set_value_action.value_field){const t=n.set_value_action.value_field.split(".");let e=n.set_value_action;t.slice(0,-1).forEach((t=>{if("object"!=typeof e[t])throw Error(`[controls] Slider value_field '${n.set_value_action.value_field}' does not exist`);e=e[t]}))}if(void 0!==n.set_value_action.value_fields&&Object.entries(n.set_value_action.value_fields).forEach((([t,e])=>{if(!["lower","upper"].includes(e))throw Error(`[controls] Slider value_fields '${t}' must select lower or upper`);const i=t.split(".");let s=n.set_value_action;i.slice(0,-1).forEach((e=>{if("object"!=typeof s[e])throw Error(`[controls] Slider value_fields path '${t}' does not exist`);s=s[e]}))})),"single"===n.show.item_variant)n.values=[{entity_index:n.entity_index,value:{}}];else{if(!Array.isArray(n.values)||2!==n.values.length)throw Error("[controls] Range slider requires exactly two values");n.values=n.values.map((t=>bt.mergeDeep({value:{}},t))),n.entity_index=n.values[0].entity_index}super(n,e,i,s,a),this.config.svg=this.calculateSvgDimensions(),this.sliderValues="single"===this.config.show.item_variant?[0]:[0,0],this.displaySliderValues=[...this.sliderValues],this.sliderAvailable=!1,this.resolvedScale={},this.activeValueIndex=0,this.dragging=!1,this.draggingThumb=!1,this.lastWrittenSignature="",this.renderFrame=void 0,this.stateAnimationFrame=void 0,this.writeTimer=void 0,this.pointerMoveListener=t=>this.moveSliderPointer(t),this.pointerUpListener=t=>this.finishSliderPointer(t),this.createSliderValueTools(),this.createControlLabelTextTool(this.config.width,this.config.height)}createSliderValueTools(){if(this.valueStateTools=[],this.valueSeparatorTool=void 0,!this.config.value.show)return;const t=this.config.value;let e=this.config.xpos,i=this.config.ypos;switch(t.position){case"start":e-=this.config.width/2+t.gap;break;case"end":e+=this.config.width/2+t.gap;break;case"top":i-=this.config.height/2+t.gap;break;case"bottom":i+=this.config.height/2+t.gap}e+=t.offset.x,i+=t.offset.y,this.valueStateTools=this.config.values.map(((s,a)=>{const r="range"===this.config.show.item_variant?e+(0===a?-t.range_spacing/2:t.range_spacing/2):e,o=bt.mergeDeep({id:`${this.id}-value-${a}`,group:this.config.group,entity_index:s.entity_index,xpos:r,yposc:i,tap_action:{action:"none"},styles:{fill:"var(--primary-text-color)","text-anchor":"middle","pointer-events":"none"}},t.state,s.value,{xpos:r,yposc:i,tap_action:{action:"none"}});return new sn(o,a,this.templates,this.cardId,this.card)})),"range"===this.config.show.item_variant&&(this.valueSeparatorTool=new rn(bt.mergeDeep({id:`${this.id}-value-separator`,group:this.config.group,entity_index:this.config.values[0].entity_index,xpos:e,yposc:i,text:t.separator,tap_action:{action:"none"},styles:{fill:"var(--primary-text-color)","text-anchor":"middle","dominant-baseline":"central","pointer-events":"none"}},t.separator_config,{xpos:e,yposc:i,tap_action:{action:"none"}}),0,this.templates,this.cardId,this.card))}updateRuntimeConfig(){super.updateRuntimeConfig(),this.configChanged&&(this.config.svg=this.calculateSvgDimensions(this.config),this.createSliderValueTools(),this.createControlLabelTextTool(this.config.width,this.config.height)),this.valueStateTools.forEach((t=>t.updateRuntimeConfig())),this.valueSeparatorTool&&this.valueSeparatorTool.updateRuntimeConfig()}setState(t,e){super.setState(t,e);const i=this.card.entities[this.config.values[0].entity_index];if(["min","max","step"].forEach((t=>{const e=this.config.scale[t];this.resolvedScale[t]=Number("object"==typeof e?i.attributes[e.attribute]:e)})),!Number.isFinite(this.resolvedScale.min)||!Number.isFinite(this.resolvedScale.max)||this.resolvedScale.min>=this.resolvedScale.max)throw Error("[controls] Slider scale requires a numeric min lower than max");if(!Number.isFinite(this.resolvedScale.step)||this.resolvedScale.step<=0)throw Error("[controls] Slider scale.step must be a positive number");const s=this.config.values.map((t=>{const e=this.card.entities[t.entity_index],i=this.card.resolvedEntityConfigs[t.entity_index];return Number(void 0===i.attribute?e.state:e.attributes[i.attribute])})),a=this.sliderAvailable;if(this.sliderAvailable=s.every((t=>Number.isFinite(t))),this.sliderAvailable){if(!this.dragging){if("range"===this.config.show.item_variant&&s[0]>s[1])throw Error("[controls] Slider lower value must not exceed its upper value");const t=[...this.displaySliderValues];if(this.sliderValues=s,"range"===this.config.show.item_variant&&a&&this.config.animation.duration>0&&this.sliderValues.some(((e,i)=>e!==t[i]))){let e;window.cancelAnimationFrame(this.stateAnimationFrame);const i=s=>{void 0===e&&(e=s);const a=Math.min((s-e)/this.config.animation.duration,1),r=a*a*(3-2*a);this.displaySliderValues=this.sliderValues.map(((e,i)=>t[i]+(e-t[i])*r)),this.card.requestUpdate(),this.stateAnimationFrame=a<1?window.requestAnimationFrame(i):void 0};this.stateAnimationFrame=window.requestAnimationFrame(i)}else this.displaySliderValues=[...this.sliderValues]}this.publishSliderValuesToStateTools()}else if(this.valueStateTools.forEach(((t,e)=>{const i=this.config.values[e];t.setState(this.card.entities[i.entity_index],this.card.resolvedEntityConfigs[i.entity_index])})),this.valueSeparatorTool){const t=this.config.values[0].entity_index;this.valueSeparatorTool.setState(this.card.entities[t],this.card.resolvedEntityConfigs[t])}}publishSliderValuesToStateTools(){if(this.valueStateTools.forEach(((t,e)=>{const i=this.config.values[e],s=this.card.resolvedEntityConfigs[i.entity_index];let a={state:String(this.sliderValues[e])};void 0!==s.attribute&&(a={attributes:{[s.attribute]:this.sliderValues[e]}});const r=bt.mergeDeep({},this.card.entities[i.entity_index],a);t.setState(r,this.card.resolvedEntityConfigs[i.entity_index])})),this.valueSeparatorTool){const t=this.config.values[0].entity_index;this.valueSeparatorTool.setState(this.card.entities[t],this.card.resolvedEntityConfigs[t])}}calculateSvgDimensions(t=this.config){return this.card.cardLayout.calculateSvgCoordinatesInGroup(t)}pointerEventToSvgPoint(t){const e=this.card.shadowRoot.getElementById(`${this.cardId}-${this.id}-slider`);return new DOMPoint(t.clientX,t.clientY).matrixTransform(e.getScreenCTM().inverse())}snapSliderValue(t){const{min:e,max:i,step:s}=this.resolvedScale,a=String(s).includes(".")?String(s).split(".")[1].length:0,r=Math.round((t-e)/s)*s+e;return Number(Math.max(e,Math.min(i,r)).toFixed(a))}sliderValueToRatio(t){return(t-this.resolvedScale.min)/(this.resolvedScale.max-this.resolvedScale.min)}getSliderGeometry(){const t=eo.calculateSvgDimension(this.config.width),e=eo.calculateSvgDimension(this.config.height);return{cx:this.config.svg.xpos,cy:this.config.svg.ypos,width:t,height:e,startX:this.config.svg.xpos-t/2,startY:this.config.svg.ypos+e/2,length:"horizontal"===this.config.orientation?t:e,radius:eo.calculateSvgDimension(this.config.circular.radius)}}svgPointToSliderValue(t){const e=this.getSliderGeometry();let i;if("linear"===this.config.show.item_viz)i="horizontal"===this.config.orientation?(t.x-e.startX)/e.length:(e.startY-t.y)/e.length,i=Math.max(0,Math.min(1,i));else{const s=this.config.circular,a=(180*Math.atan2(t.y-e.cy,t.x-e.cx)/Math.PI+90+360)%360,r=(s.start_angle+360)%360;let o=s.clockwise?(a-r+360)%360:(r-a+360)%360;if(o>s.arc_degrees){const t=Math.min(o,360-o),e=Math.abs(o-s.arc_degrees);o=t<=Math.min(e,360-e)?0:s.arc_degrees}i=o/s.arc_degrees}return this.snapSliderValue(this.resolvedScale.min+i*(this.resolvedScale.max-this.resolvedScale.min))}startSliderPointer(t,e){if("unavailable"===this.config.visibility)return;t.preventDefault(),t.stopPropagation(),window.cancelAnimationFrame(this.stateAnimationFrame),this.stateAnimationFrame=void 0,this.displaySliderValues=[...this.sliderValues];const i=this.svgPointToSliderValue(this.pointerEventToSvgPoint(t));if("range"===this.config.show.item_variant&&void 0===e){const t=Math.abs(i-this.sliderValues[0]),e=Math.abs(i-this.sliderValues[1]);t<e&&(this.activeValueIndex=0),e<t&&(this.activeValueIndex=1)}else void 0!==e&&(this.activeValueIndex=e);this.dragging=!0,this.draggingThumb=void 0!==e,this.lastWrittenSignature=JSON.stringify(this.sliderValues),window.addEventListener("pointermove",this.pointerMoveListener,{passive:!1}),window.addEventListener("pointerup",this.pointerUpListener,{passive:!1}),window.addEventListener("pointercancel",this.pointerUpListener,{passive:!1}),ft(this.card,"haptic",this.config.interaction.haptic),this.applySliderPointerValue(i),this.config.interaction.update_interval>0&&(this.writeTimer=window.setInterval((()=>this.writeSliderValues(!1)),this.config.interaction.update_interval))}applySliderPointerValue(t){let e=t;"range"===this.config.show.item_variant&&(e=0===this.activeValueIndex?Math.min(e,this.sliderValues[1]):Math.max(e,this.sliderValues[0])),this.sliderValues[this.activeValueIndex]=e,this.displaySliderValues=[...this.sliderValues],this.scheduleSliderRender()}moveSliderPointer(t){t.preventDefault(),this.draggingThumb=!0,this.applySliderPointerValue(this.svgPointToSliderValue(this.pointerEventToSvgPoint(t)))}finishSliderPointer(t){t.preventDefault(),t.stopPropagation(),this.dragging=!1,this.draggingThumb=!1,window.removeEventListener("pointermove",this.pointerMoveListener),window.removeEventListener("pointerup",this.pointerUpListener),window.removeEventListener("pointercancel",this.pointerUpListener),window.clearInterval(this.writeTimer),this.writeTimer=void 0,this.writeSliderValues(!0)}scheduleSliderRender(){void 0===this.renderFrame&&(this.renderFrame=window.requestAnimationFrame((()=>{this.renderFrame=void 0,this.publishSliderValuesToStateTools(),this.card.requestUpdate()})))}writeSliderValues(t){const e=JSON.stringify(this.sliderValues);(t||e!==this.lastWrittenSignature)&&(this.lastWrittenSignature=e,this.card.actions.executeSliderAction(this.config.set_value_action,this.config.values[this.activeValueIndex].entity_index,this.sliderValues,this.activeValueIndex))}handleSliderKeydown(t,e){if("unavailable"===this.config.visibility)return;const i=["ArrowRight","ArrowUp"],s=["ArrowLeft","ArrowDown"];if(![...i,...s,"Home","End"].includes(t.key))return;t.preventDefault(),t.stopPropagation(),this.activeValueIndex=e;let a=this.sliderValues[e];i.includes(t.key)&&(a+=this.resolvedScale.step),s.includes(t.key)&&(a-=this.resolvedScale.step),"Home"===t.key&&(a=this.resolvedScale.min),"End"===t.key&&(a=this.resolvedScale.max),this.applySliderPointerValue(this.snapSliderValue(a)),this.writeSliderValues(!0)}disconnected(){window.removeEventListener("pointermove",this.pointerMoveListener),window.removeEventListener("pointerup",this.pointerUpListener),window.removeEventListener("pointercancel",this.pointerUpListener),window.clearInterval(this.writeTimer),void 0!==this.renderFrame&&window.cancelAnimationFrame(this.renderFrame),void 0!==this.stateAnimationFrame&&window.cancelAnimationFrame(this.stateAnimationFrame)}updated(){super.updated(),this.valueStateTools.forEach((t=>t.updated())),this.valueSeparatorTool&&this.valueSeparatorTool.updated()}circularRatioToPoint(t,e){const i=this.config.circular,s=i.clockwise?1:-1,a=(i.start_angle+s*i.arc_degrees*t-90)*Math.PI/180,r=this.getSliderGeometry();return{x:r.cx+e*Math.cos(a),y:r.cy+e*Math.sin(a)}}circularArcPath(t,e){const i=this.getSliderGeometry(),s=this.circularRatioToPoint(t,i.radius),a=this.circularRatioToPoint(e,i.radius),r=Math.abs(e-t)*this.config.circular.arc_degrees,o=r>180?1:0,n=this.config.circular.clockwise?1:0;if(r>=360){const r=t+(e-t)/2,o=this.circularRatioToPoint(r,i.radius);return`M ${s.x} ${s.y} A ${i.radius} ${i.radius} 0 1 ${n} ${o.x} ${o.y} A ${i.radius} ${i.radius} 0 1 ${n} ${a.x} ${a.y}`}return`M ${s.x} ${s.y} A ${i.radius} ${i.radius} 0 ${o} ${n} ${a.x} ${a.y}`}renderLinearThumb(t,e,i,s){const a=this.config.linear,r="horizontal"===this.config.orientation,o=eo.calculateSvgDimension(a.thumb.hit_size),n=eo.calculateSvgDimension(r?a.thumb.width:a.thumb.height),l=eo.calculateSvgDimension(r?a.thumb.height:a.thumb.width),h=r?e-n/2:i.cx-n/2,c=r?i.cy-l/2:e-l/2,d=r?e-o/2:i.cx-o/2,u=r?i.cy-o/2:e-o/2;return V`
      <g class="slider-control__thumb">
        <rect
          class="slider-control__thumb-hit-area"
          x=${d} y=${u} width=${o} height=${o}
          fill="transparent" tabindex="0" role="slider"
          aria-valuemin=${this.resolvedScale.min}
          aria-valuemax=${this.resolvedScale.max}
          aria-valuenow=${this.sliderValues[t]}
          style="outline:none;touch-action:none;cursor:pointer;"
          @pointerdown=${e=>this.startSliderPointer(e,t)}
          @keydown=${e=>this.handleSliderKeydown(e,t)}
        />
        ${s?V`
          <rect
            class="slider-control__thumb-marker"
            x=${h} y=${c} width=${n} height=${l}
            rx=${eo.calculateSvgDimension(a.thumb.radius)}
            style=${gt(this.getStyles(da.toStyleDict(a.thumb.styles)))}
            pointer-events="none"
          />
        `:V``}
      </g>
    `}renderHaSlider(){const t=this.getSliderGeometry(),e=this.config.linear,i="horizontal"===this.config.orientation,s=eo.calculateSvgDimension(e.track.height),a=eo.calculateSvgDimension(e.track.radius),r=eo.calculateSvgDimension(i?e.thumb.width:e.thumb.height),o=eo.calculateSvgDimension(i?e.thumb.height:e.thumb.width),n=eo.calculateSvgDimension(e.thumb.margin),l="range"===this.config.show.item_variant?this.sliderValueToRatio(this.displaySliderValues[0]):0,h=this.sliderValueToRatio(this.displaySliderValues[this.displaySliderValues.length-1]),c=i?t.startX:t.cx-s/2,d=i?t.cy-s/2:t.startY-t.length,u=i?t.length:s,p=i?s:t.length,g=i?r:o,m=t.length-2*n-g,f=i?t.startX+n+r/2+m*l:t.startY-n-o/2-m*l,y=i?t.startX+n+r/2+m*h:t.startY-n-o/2-m*h,v=i?f:c,b=i?d:y,_=i?y-f:s,x=i?s:f-y,w=`${this.cardId}-${this.id}-ha-track-clip`,$=(1-h)*m,k=$/t.length*100,S=i?c+t.length-n-r/2-$:d+n+o/2+$,M=this.dragging&&this.draggingThumb?"none":`transform ${this.config.animation.duration}ms ${this.config.animation.easing}`,A=i?`translateX(-${k}%)`:`translateY(${k}%)`,T=this.getStyles({"--fhs-slider-active-color":la.computeColor(this.entity),...da.toStyleDict(e.active.styles)});return V`
      <defs>
        <clipPath id=${w}>
          <rect x=${c} y=${d} width=${u} height=${p}
            rx=${a} />
        </clipPath>
      </defs>
      <rect x=${c} y=${d} width=${u} height=${p}
        rx=${a}
        style=${gt(this.getStyles(da.toStyleDict(e.track.styles)))}
        pointer-events="none" />
      ${this.sliderAvailable?V`
        <rect
          class="slider-control__capture"
          x=${t.startX} y=${t.startY-t.height}
          width=${t.width} height=${t.height}
          fill="transparent" style="touch-action:none;cursor:pointer;"
          @pointerdown=${t=>this.startSliderPointer(t,void 0)}
        />
        ${"single"===this.config.show.item_variant?V`
          <g clip-path="url(#${w})">
            <g style="transform-box:fill-box;transform:${A};transition:${M};">
              <rect x=${c} y=${d} width=${u} height=${p}
                rx=${eo.calculateSvgDimension(e.active.radius)}
                style=${gt(T)}
                pointer-events="none" />
              <rect
                class="slider-control__thumb-marker"
                x=${i?c+t.length-n-r:t.cx-r/2}
                y=${i?t.cy-o/2:d+n}
                width=${r} height=${o}
                rx=${eo.calculateSvgDimension(e.thumb.radius)}
                style=${gt(this.getStyles(da.toStyleDict(e.thumb.styles)))}
                pointer-events="none" />
            </g>
          </g>
          ${this.renderLinearThumb(0,S,t,!1)}
        `:V`
          <rect x=${v} y=${b} width=${_} height=${x}
            rx=${eo.calculateSvgDimension(e.active.radius)}
            style=${gt(T)}
            pointer-events="none" />
          ${this.displaySliderValues.map(((e,s)=>{const a=this.sliderValueToRatio(e),l=i?t.startX+n+r/2+m*a:t.startY-n-o/2-m*a;return this.renderLinearThumb(s,l,t,!0)}))}
        `}
      `:V``}
    `}renderCircularSlider(){const t=this.getSliderGeometry(),e=this.config.circular,i="range"===this.config.show.item_variant?this.sliderValueToRatio(this.displaySliderValues[0]):0,s=this.sliderValueToRatio(this.displaySliderValues[this.displaySliderValues.length-1]),a=eo.calculateSvgDimension(e.capture.width),r=eo.calculateSvgDimension(e.thumb.length),o=eo.calculateSvgDimension(e.thumb.hit_size),n=this.getStyles({"--fhs-slider-active-color":la.computeColor(this.entity),...da.toStyleDict(e.active.styles)});return V`
      <path d=${this.circularArcPath(0,1)}
        style=${gt(this.getStyles(da.toStyleDict(e.track.styles)))}
        stroke-width=${eo.calculateSvgDimension(e.track.width)} pointer-events="none" />
      ${this.sliderAvailable?V`
        <path d=${this.circularArcPath(0,1)} fill="none" stroke="transparent"
          stroke-width=${a} style="touch-action:none;cursor:pointer;"
          @pointerdown=${t=>this.startSliderPointer(t,void 0)} />
        <path d=${this.circularArcPath(i,s)}
          style=${gt(n)}
          stroke-width=${eo.calculateSvgDimension(e.active.width)} pointer-events="none" />
        ${this.displaySliderValues.map(((i,s)=>{const a=this.sliderValueToRatio(i),n=this.circularRatioToPoint(a,t.radius),l=this.circularRatioToPoint(a,t.radius-r/2),h=this.circularRatioToPoint(a,t.radius+r/2);return V`
            <circle cx=${n.x} cy=${n.y} r=${o/2}
              fill="transparent" tabindex="0" role="slider"
              aria-valuemin=${this.resolvedScale.min}
              aria-valuemax=${this.resolvedScale.max}
              aria-valuenow=${this.sliderValues[s]}
              style="outline:none;touch-action:none;cursor:pointer;"
              @pointerdown=${t=>this.startSliderPointer(t,s)}
              @keydown=${t=>this.handleSliderKeydown(t,s)} />
            <line x1=${l.x} y1=${l.y}
              x2=${h.x} y2=${h.y}
              stroke-width=${eo.calculateSvgDimension(e.thumb.width)}
              style=${gt(this.getStyles(da.toStyleDict(e.thumb.styles)))}
              pointer-events="none" />
          `}))}
      `:V``}
    `}render(){const t=V`
      <g id="${this.cardId}-${this.id}-slider" class="slider-control"
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}">
        ${"linear"===this.config.show.item_viz?this.renderHaSlider():this.renderCircularSlider()}
      </g>
    `;return this.renderControl(V`
      ${t}
      ${this.valueStateTools.map((t=>t.render()))}
      ${this.valueSeparatorTool?this.valueSeparatorTool.render():V``}
    `)}}class Zn extends Nn{constructor(t,e,i,s,a){const r={orientation:"horizontal",show:{item_variant:"switch",item_viz:"default",item_style:"ha"},ha:{},ios:{},industrial:{},tap_action:{action:"toggle"},track:{width:16,height:7,radius:3.5},thumb:{width:9,height:9,radius:4.5,offset:4.5},content:{mode:"content_none",content_icon:{size:75,icon:{}}}},o={animation:{duration:250,easing:"ease-out",states:{on:{track:{styles:{fill:"var(--switch-checked-track-color)","pointer-events":"auto"}},thumb:{fill:"var(--switch-checked-button-color)",transform:"translateX(4.5em)","pointer-events":"auto"}},off:{styles:{track:{fill:"var(--switch-checked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-checked-button-color)",transform:"translateX(4.5em)","pointer-events":"auto"}}}}}},n={animation:{duration:250,easing:"ease-out",on:{track:{styles:{fill:"var(--switch-checked-track-color)","pointer-events":"auto"}},thumb:{fill:"var(--switch-checked-button-color)",transform:"translateY(4.5em)","pointer-events":"auto"}},off:{styles:{track:{fill:"var(--switch-checked-track-color)","pointer-events":"auto"},thumb:{fill:"var(--switch-checked-button-color)",transform:"translateY(4.5em)","pointer-events":"auto"}}}}};let l;switch(t.orientation){default:case"horizontal":l=bt.mergeDeep(r,o,t);break;case"vertical":l=bt.mergeDeep(r,n,t)}super(l,e,i,s,a),this.validateOrientation(this.config.orientation),this.config=this.buildConfig(this.config),this.config.svg=this.calculateSvgDimensions(),this.createThumbIconTool(),this.createControlLabelTextTool("vertical"===this.config.orientation?this.config.width*this.config[this.config.show.item_style].svgVbW/this.config[this.config.show.item_style].svgVbH:this.config.width,"vertical"===this.config.orientation?this.config.width:this.config.width*this.config[this.config.show.item_style].svgVbH/this.config[this.config.show.item_style].svgVbW)}createThumbIconTool(){if("content_icon"!==this.config.content.mode)return void(this.iconTool=void 0);const t=bt.mergeDeep({id:`${this.id}-icon`,entity_index:this.entity_index,xpos:50,yposc:50,icon_size_percent:this.config.content.content_icon.size,tap_action:{action:"none"}},this.config.content.content_icon.icon,{tap_action:{action:"none"}});this.iconTool=new Rn(t,0,this.templates,this.cardId,this.card)}buildConfig(t){const e={ios:{vbH:26,vbW:50,xOn:26,xOff:2,knobY:2,knobW:22,knobH:22,knobRx:11,trackY:0,trackH:26,trackRx:13,checked:{track:{styles:{fill:"#34C759",opacity:"1.0"}},thumb:{styles:{fill:"#FFFFFF",opacity:"1.0"}},icon:{styles:{fill:"#FFFFFF",opacity:"1.0"}}},unchecked:{track:{styles:{fill:"#E9E9EA",opacity:"1.0"}},thumb:{styles:{fill:"#FFFFFF",opacity:"1.0"}},icon:{styles:{fill:"#8E8E93",opacity:"0.8"}}}},ha:{vbH:26,vbW:50,xOn:30,xOff:0,knobY:3,knobW:20,knobH:20,knobRx:10,trackY:6,trackH:14,trackRx:7,shadow:{x:"-20%",y:"-20%",width:"140%",height:"140%",dx:0,dy:1,stdDeviation:1,color:"#000000",opacity:.2},checked:{track:{styles:{fill:"var(--switch-checked-track-color, #4ad66d)"}},thumb:{styles:{fill:"var(--switch-checked-button-color, #ffffff)"}},icon:{styles:{fill:"var(--primary-color, #2196F3)"}}},unchecked:{track:{styles:{fill:"var(--switch-unchecked-track-color, #9b9b9b)",opacity:"0.6"}},thumb:{styles:{fill:"var(--switch-unchecked-button-color, #ffffff)"}},icon:{styles:{fill:"#757575",opacity:"0.5"}}}},industrial:{vbH:26,vbW:50,xOn:26,xOff:2,knobY:2,knobW:22,knobH:22,knobRx:0,trackY:0,trackH:26,trackRx:0,checked:{track:{styles:{fill:"#D32F2F",stroke:"#FFCDD2","stroke-width":"0.5"}},thumb:{styles:{fill:"#FFFFFF"}},icon:{styles:{fill:"#D32F2F"}}},unchecked:{track:{styles:{fill:"#212121"}},thumb:{styles:{fill:"#B0BEC5"}},icon:{styles:{fill:"#455A64"}}}}};if("switch"!==t.show.item_variant)throw Error(`[controls] Invalid toggle item_variant '${t.show.item_variant}' [switch]`);if("default"!==t.show.item_viz)throw Error(`[controls] Invalid toggle item_viz '${t.show.item_viz}' [default]`);if(!Object.hasOwn(e,t.show.item_style))throw Error(`[controls] Invalid toggle item_style '${t.show.item_style}' [${Object.keys(e).join(", ")}]`);const i=t.show.item_style,s="vertical"===t.orientation;t[i]=bt.mergeDeep(e[i],t[i]);const a=t[i].knobY,r=s?t[i].trackH:t[i].vbW,o=s?t[i].vbW:t[i].trackH;if(void 0!==t[i].shadow){t[i].shadow.id=`${this.cardId}-${this.id}-toggle-shadow`;const e={filter:`url(#${t[i].shadow.id})`};t[i].checked.thumb.styles=bt.mergeDeep(t[i].checked.thumb.styles,e),t[i].unchecked.thumb.styles=bt.mergeDeep(t[i].unchecked.thumb.styles,e)}if(t[i].svgVbW=s?t[i].vbH:t[i].vbW,t[i].svgVbH=s?t[i].vbW:t[i].vbH,t[i].renderTrackX=s?t[i].trackY:0,t[i].renderTrackY=s?0:t[i].trackY,t[i].renderTrackWidth=r,t[i].renderTrackHeight=o,t[i].on={knobX:s?a:t[i].xOn,knobY:s?t[i].xOn:a,trackStyles:t[i].checked.track.styles,thumbStyles:t[i].checked.thumb.styles,iconStyles:t[i].checked.icon.styles},t[i].off={knobX:s?a:t[i].xOff,knobY:s?t[i].xOff:a,trackStyles:t[i].unchecked.track.styles,thumbStyles:t[i].unchecked.thumb.styles,iconStyles:t[i].unchecked.icon.styles},t[i].icon){const e=.65,s=t[i].knobW*e/24,a=(t[i].knobW-24*s)/2/s,r=(t[i].knobH-24*s)/2/s;t[i].iconTransform=`scale(${s}) translate(${a} ${r})`}else t[i].iconTransform="";return t}validateOrientation(t){if(!["horizontal","vertical"].includes(t))throw Error(`ToggleTool::validateOrientation - invalid orientation '${t}' [horizontal, vertical]`)}updateRuntimeConfig(){super.updateRuntimeConfig(),this.configChanged&&(this.config=this.buildConfig(this.config),this.validateOrientation(this.config.orientation),this.config.svg=this.calculateSvgDimensions(this.config),this.createThumbIconTool(),this.createControlLabelTextTool("vertical"===this.config.orientation?this.config.width*this.config[this.config.show.item_style].svgVbW/this.config[this.config.show.item_style].svgVbH:this.config.width,"vertical"===this.config.orientation?this.config.width:this.config.width*this.config[this.config.show.item_style].svgVbH/this.config[this.config.show.item_style].svgVbW))}setState(t,e){super.setState(t,e),"content_icon"===this.config.content.mode&&this.iconTool.setState(t,e)}updated(){super.updated(),"content_icon"===this.config.content.mode&&this.iconTool.updated()}calculateSvgDimensions(t=this.config){const e=this.card.cardLayout.calculateSvgCoordinatesInGroup(t),i=t[t.show.item_style],s=eo.calculateSvgDimension(t.width);return e.width="vertical"===t.orientation?s*i.svgVbW/i.svgVbH:s,e.height="vertical"===t.orientation?s:s*i.svgVbH/i.svgVbW,e.x=e.xpos-e.width/2,e.y=e.ypos-e.height/2,e}_renderToggle(){const t=this.config.show.item_style,e=this.config,i="on"===this.entity.state,s=this.config[t],a=i?s.on:s.off,r=`${this.config.animation.duration}ms ${this.config.animation.easing}`,o=this.getStyles(bt.mergeDeep({},a.trackStyles,{transition:`fill ${r}, stroke ${r}, opacity ${r}`})),n=this.getStyles(a.thumbStyles),l={transform:`translate(${a.knobX}px, ${a.knobY}px)`,transition:`transform ${r}`,"pointer-events":"none"},h="content_icon"===this.config.content.mode?this.iconTool.render():V``;return V`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
      >
        <g class="toggle-style-animation">
          <svg
            x="${e.svg.x}"
            y="${e.svg.y}"
            width="${e.svg.width}"
            height="${e.svg.height}"
            viewBox="0 0 ${s.svgVbW} ${s.svgVbH}"
            style="overflow: visible;"
          >
          <g class="toggle-scale">
            <svg viewBox="0 0 ${s.svgVbW} ${s.svgVbH}" style="width: 100%; height: auto; display: block; overflow: visible;">

              ${void 0!==s.shadow?V`
                <defs>
                  <filter
                    id="${s.shadow.id}"
                    x="${s.shadow.x}"
                    y="${s.shadow.y}"
                    width="${s.shadow.width}"
                    height="${s.shadow.height}"
                    color-interpolation-filters="sRGB"
                  >
                    <feGaussianBlur in="SourceAlpha" stdDeviation="${s.shadow.stdDeviation}" result="shadow-blur" />
                    <feOffset in="shadow-blur" dx="${s.shadow.dx}" dy="${s.shadow.dy}" result="shadow-offset" />
                    <feFlood flood-color="${s.shadow.color}" flood-opacity="${s.shadow.opacity}" result="shadow-color" />
                    <feComposite in="shadow-color" in2="shadow-offset" operator="in" result="shadow" />
                    <feMerge>
                      <feMergeNode in="shadow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              `:V``}

              <!-- De Track -->
              <rect
                x="${s.renderTrackX}" y="${s.renderTrackY}"
                width="${s.renderTrackWidth}" height="${s.renderTrackHeight}"
                rx="${s.trackRx}"
                style=${gt(o)}
              />

              <!-- De Knop / Thumb (Beweegt netjes mee over de X of Y as) -->
              <!-- The thumb and its real IconTool share one animated position group. -->
              <g class="toggle-thumb-position" style=${gt(l)}>
                <rect
                  x="0" y="0"
                  width="${s.knobW}" height="${s.knobH}"
                  rx="${s.knobRx}"
                  style=${gt(n)}
                />
                <g
                  class="toggle-thumb-icon"
                  transform="translate(${(s.knobW-Math.min(s.knobW,s.knobH))/2} ${(s.knobH-Math.min(s.knobW,s.knobH))/2}) scale(${Math.min(s.knobW,s.knobH)/fa})"
                  pointer-events="none"
                >
                  ${h}
                </g>
              </g>
            </svg>
            </g>
          </g>
        </g>
        </svg>
      </g>
      `}render(){const t=V`
      <g
        transform="${this.getGroupScaleTransform()}"
        style="${this.getGroupScaleStyle()}"
          ${this.controlActionHandler(this.config,this.entity_index)}
          @action=${t=>this.handleControlAction(t,this.config,this.entity_index)}
      >
        ${this._renderToggle()}
      </g>
    `;return this.renderControl(t)}}class Kn{static compileConfig(t,e){void 0!==t.layout.controls&&t.layout.controls.forEach((t=>{if("select"===t.type)Xn.removeDisabledOptionConfigs(t,e)}))}static setConfig(t,e,i,s){return void 0===t.layout.controls?[]:t.layout.controls.map(((t,a)=>{switch(t.type){case"toggle":return new Zn(t,a,e,i,s);case"select":return new Xn(t,a,e,i,s);case"number":return new Yn(t,a,e,i,s);case"button":return new Wn(t,a,e,i,s);case"slider":return new Jn(t,a,e,i,s);default:throw new Error(`Unknown control type: ${t.type}`)}}))}}const Qn=["horseshoes","names","areas","states","texts","rectangles","lines","circles","arcs","icons","controls"],tl=["rectangles","circles","arcs","horseshoes","lines","icons","areas","names","states","texts","sparklines","controls"];class el{constructor(t,e,i){this.card=t,this.templates=e,this.cardId=i,this.sections={rectangles:[],circles:[],arcs:[],horseshoes:[],lines:[],icons:[],areas:[],names:[],states:[],texts:[],sparklines:[],controls:[]}}setHorseshoeConfig(t){this.sections.horseshoes=to.setConfig(t,this.templates,this.cardId,this.card)}setLayoutToolConfig(t){this.sections.names=fo.setConfig(t,this.templates,this.cardId,this.card),this.sections.areas=yo.setConfig(t,this.templates,this.cardId,this.card),this.sections.states=sn.setConfig(t,this.templates,this.cardId,this.card),this.sections.texts=rn.setConfig(t,this.templates,this.cardId,this.card),this.sections.rectangles=io.setConfig(t,this.templates,this.cardId,this.card),this.sections.lines=so.setConfig(t,this.templates,this.cardId,this.card),this.sections.circles=ao.setConfig(t,this.templates,this.cardId,this.card),this.sections.arcs=ro.setConfig(t,this.templates,this.cardId,this.card),this.sections.icons=Rn.setConfig(t,this.templates,this.cardId,this.card),this.sections.controls=Kn.setConfig(t,this.templates,this.cardId,this.card),this.sections.sparklines=Ln.setConfig(t,this.templates,this.cardId,this.card)}getBySection(t){return this.sections[t]}getItemWidth(t){if("number"==typeof t)return t;return this.sections[t.section].find((e=>e.id===t.item_id)).getWidth()+2*t.padding}getItemHeight(t){if("number"==typeof t)return t;return this.sections[t.section].find((e=>e.id===t.item_id)).getHeight()+2*t.padding}getItemGeometry(t){const e=this.sections[t.section].find((e=>e.id===t.item_id));return{xpos:e.getXpos(),ypos:e.getYpos(),width:e.getWidth(),height:e.getHeight()}}getRenderableTools(){return tl.flatMap((t=>this.sections[t]))}getSortedRenderableTools(){return this.getRenderableTools().sort(((t,e)=>Number(t.zpos)-Number(e.zpos)||Number(t.renderIndex)-Number(e.renderIndex)))}updateSparklineRuntimeConfig(){this.sections.sparklines.forEach((t=>t.updateRuntimeConfig()))}updateRuntimeConfig(){Qn.forEach((t=>this.sections[t].forEach((t=>t.updateRuntimeConfig()))))}setToolEntityState(t,e,i){t.setEntities(e,i)}setEntityStates(t,e,i){t.forEach((t=>{this.sections[t].forEach((t=>this.setToolEntityState(t,e,i)))}))}setSparklineEntityStates(t,e){this.setEntityStates(["sparklines"],t,e)}setRuntimeEntityStates(t,e){this.setEntityStates(Qn,t,e)}hassAvailable(){this.getRenderableTools().forEach((t=>t.hassAvailable()))}hassConnected(){this.getRenderableTools().forEach((t=>t.hassConnected()))}connected(){this.getRenderableTools().forEach((t=>t.connected()))}disconnected(){this.getRenderableTools().forEach((t=>t.disconnected()))}firstUpdated(t){this.getRenderableTools().forEach((e=>e.firstUpdated(t))),this.attachSparklinePointerHandlers()}updated(t){this.getRenderableTools().forEach((e=>e.updated(t))),this.attachSparklinePointerHandlers()}attachSparklinePointerHandlers(){this.sections.sparklines.forEach((t=>t.attachPointerHandlers()))}}const il="card",sl=50;class al{constructor(t){if(t.some((t=>String(t.id)===il)))throw new Error("[groups] card is reserved for the card root group");this.groups={[il]:{id:il,xpos:sl,ypos:sl}},t.forEach((t=>{this.groups[String(t.id)]=t})),this.resolvedGroups={},Object.keys(this.groups).forEach((t=>{this.getGroup(t)}))}getGroupForItem(t){return this.getGroup(t?.group??il)}getGroupChainForItem(t){const e=[];let i=t?.group??il;for(;i;){const t=this.groups[i];e.unshift(t),i=i===il?void 0:t.parent??il}return e}isItemVisible(t){return this.getGroupChainForItem(t).every((t=>"hidden"!==t.visibility))&&"hidden"!==t.visibility}getGroup(t,e=[]){if(this.resolvedGroups[t])return this.resolvedGroups[t];if(e.includes(t))throw new Error(`[groups] Circular parent reference: ${[...e,t].join(" -> ")}`);const i=this.groups[t];if(!i)throw new Error(`[groups] Unknown group: ${t}`);const s=i.parent??il,a=t===il?void 0:this.getGroup(s,[...e,t]),r=a?a.xpos+i.xpos-sl:i.xpos,o=a?a.ypos+i.ypos-sl:i.ypos,n={...i,id:t,parent:t===il?void 0:s,xpos:r,ypos:o,svg:{xpos:eo.calculateSvgDimension(r),ypos:eo.calculateSvgDimension(o)}};return this.resolvedGroups[t]=n,n}calculateSvgCoordinatesInGroup(t){const e=t.xpos,i=t.yposc||t.ypos,s=this.getGroupForItem(t),a=s.xpos+e-sl,r=s.ypos+i-sl;return{xpos:eo.calculateSvgDimension(a),ypos:eo.calculateSvgDimension(r)}}getGroupScaleTransform(t){const e=this.getGroupForItem(t);if(!e.scale&&!t?.flip)return"";const i=e.scale?.x??e.scale??1,s=e.scale?.y??e.scale??1;return`scale(${i*("x"===t?.flip||"both"===t?.flip?-1:1)}, ${s*("y"===t?.flip||"both"===t?.flip?-1:1)})`}getGroupScaleStyle(t){const e=this.getGroupForItem(t);return e.scale?`transform-origin:${e.svg.xpos}px ${e.svg.ypos}px; transform-box:view-box;`:`transform-origin:${t.svg.xpos}px ${t.svg.ypos}px; transform-box:view-box;`}}class rl{constructor(t,e,i){this.config=t,this.cardId=e,this.card=i,this.gradients=this.normalizeGradients(t.layout.gradients),this.clips=this.normalizeDefinitions(t.layout.clips),this.masks=this.normalizeDefinitions(t.layout.masks)}normalizeGradients(t){const e={};return Object.entries(t).forEach((([t,i])=>{const s="radial"===i.type?{type:"radial",gradientUnits:"objectBoundingBox",cx:"50%",cy:"50%",r:"50%",stops:[]}:{type:"linear",gradientUnits:"objectBoundingBox",x1:"0%",y1:"0%",x2:"100%",y2:"0%",stops:[]};e[t]=bt.mergeDeep({},s,i),e[t].stops=e[t].stops.map((t=>{const e=bt.mergeDeep({},{opacity:1},t);return"number"==typeof e.offset&&(e.offset=`${e.offset}%`),e})),["cx","cy","r","x1","y1","x2","y2"].forEach((i=>{"number"==typeof e[t][i]&&(e[t][i]="userSpaceOnUse"===e[t].gradientUnits?eo.calculateSvgDimension(e[t][i]):`${e[t][i]}%`)}))})),e}normalizeDefinitions(t){const e={};return Object.entries(t).forEach((([t,i])=>{e[t]=bt.mergeDeep({},i,{rectangles:i.rectangles??[],circles:i.circles??[],arcs:i.arcs??[]}),pa.forEach((i=>{e[t][i]=e[t][i].map((t=>void 0===t.dxpos&&void 0===t.dypos?t:bt.mergeDeep({},{dxpos:0,dypos:0},t)))}))})),e}getGradientId(t){return`fhs-${this.cardId}-gradient-${t}`}getClipId(t,e,i){return e&&i?`fhs-${this.cardId}-clip-${t}-${i}-${e.id}`:`fhs-${this.cardId}-clip-${t}`}getClipUseId(t,e,i){return this.definitionUsesRelativePosition(this.clips[t])?this.getClipId(t,e,i):this.getClipId(t)}getMaskId(t,e,i){return e&&i?`fhs-${this.cardId}-mask-${t}-${i}-${e.id}`:`fhs-${this.cardId}-mask-${t}`}getMaskUseId(t,e,i){return this.definitionUsesRelativePosition(this.masks[t])?this.getMaskId(t,e,i):this.getMaskId(t)}getMaskUseIds(t,e,i){if(this.masks[t].soft_arc){const s=this.getMaskId(t,e,i);return[`${s}-edge`,`${s}-chord`]}return[this.getMaskUseId(t,e,i)]}renderDefs(){return V`
      ${this.renderGradients()}
      ${this.renderClips()}
      ${this.renderMasks()}
      ${this.renderRelativeClips()}
      ${this.renderRelativeMasks()}
    `}renderGradients(){return Object.entries(this.gradients).map((([t,e])=>"radial"===e.type?V`
          <radialGradient
            id="${this.getGradientId(t)}"
            gradientUnits="${e.gradientUnits}"
            cx="${e.cx}"
            cy="${e.cy}"
            r="${e.r}"
          >
            ${this.renderGradientStops(e.stops)}
          </radialGradient>
        `:V`
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
      `))}renderGradientStops(t){return t.map((t=>V`
      <stop
        offset="${t.offset}"
        stop-color="${t.color}"
        stop-opacity="${t.opacity}"
      ></stop>
    `))}renderClips(){return Object.entries(this.clips).map((([t,e])=>this.definitionUsesRelativePosition(e)?V``:V`
        <clipPath id="${this.getClipId(t)}" clipPathUnits="userSpaceOnUse">
          ${this.renderShapeSections(e)}
        </clipPath>
      `))}renderMasks(){return Object.entries(this.masks).map((([t,e])=>this.definitionUsesRelativePosition(e)?V``:V`
        <mask id="${this.getMaskId(t)}" maskUnits="userSpaceOnUse">
          <g class="mask-clip-definition mask-clip-definition--mask" style=${gt(this.getDefinitionStyles(e))}>
            ${this.renderShapeSections(e)}
          </g>
        </mask>
      `))}renderRelativeClips(){return Object.entries(this.clips).map((([t,e])=>this.definitionUsesRelativePosition(e)?this.getItemsUsingDefinition("clip",t).map((({section:i,item:s})=>V`
        <clipPath id="${this.getClipId(t,s,i)}" clipPathUnits="userSpaceOnUse">
          ${this.renderShapeSections(e,s)}
        </clipPath>
      `)):V``))}renderRelativeMasks(){return Object.entries(this.masks).map((([t,e])=>this.definitionUsesRelativePosition(e)?this.getItemsUsingDefinition("mask",t).map((({section:i,item:s})=>e.soft_arc?this.renderSoftArcMasks(t,e,s,i):V`
          <mask id="${this.getMaskId(t,s,i)}" maskUnits="userSpaceOnUse">
            <g class="mask-clip-definition mask-clip-definition--mask" style=${gt(this.getDefinitionStyles(e))}>
              ${this.renderShapeSections(e,s)}
            </g>
          </mask>
        `)):V``))}renderShapeSections(t,e){return V`
      ${this.renderRectangles(t.rectangles,e)}
      ${this.renderCircles(t.circles,e)}
      ${this.renderArcs(t.arcs,e)}
    `}renderSoftArcMasks(t,e,i,s){const a=this.getMaskId(t,i,s),r=this.clips[e.soft_arc.clip].arcs[0],o=this.calculateArcDimensions(r,i),n=`${a}-edge-gradient`,l=`${a}-chord-gradient`,h=Number(e.soft_arc.edge.stops_start),c=e.soft_arc.edge.stops??[{offset:0,opacity:1},{offset:100,opacity:0}],d=Number(e.soft_arc.chord.stops_start),u=e.soft_arc.chord.stops??[{offset:0,opacity:1},{offset:100,opacity:0}],p=o.endX-o.startX,g=o.endY-o.startY,m=Math.sqrt(p**2+g**2),f=(o.startX+o.endX)/2,y=(o.startY+o.endY)/2;let v=-g/m,b=p/m;(f-o.xpos)*v+(y-o.ypos)*b<0&&(v=-v,b=-b);const _=Math.abs((f-o.xpos)*v+(y-o.ypos)*b),x=o.xpos,w=o.ypos,$=o.xpos+v*_,k=o.ypos+b*_,S=2*o.radius;return V`
      <radialGradient id="${n}" gradientUnits="objectBoundingBox" cx="50%" cy="50%" r="50%">
        ${c.map((t=>V`
          <stop
            offset="${h+Number(t.offset)/100*(100-h)}%"
            stop-color="white"
            stop-opacity="${t.opacity}"
          ></stop>
        `))}
      </radialGradient>
      <linearGradient
        id="${l}"
        gradientUnits="userSpaceOnUse"
        x1="${x}"
        y1="${w}"
        x2="${$}"
        y2="${k}"
      >
        ${u.map((t=>V`
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
          fill="url(#${l})"
        ></rect>
      </mask>
    `}renderRectangles(t,e){return t.map((t=>{const i=this.calculateRectangleDimensions(t,e);return V`
        <path
          class="mask-clip-rectangle"
          d="${this.buildRoundedRectanglePath(i)}"
          style=${gt(this.getShapeStyles(t))}
        ></path>
      `}))}renderCircles(t,e){return t.map((t=>{const i=this.calculateCircleDimensions(t,e);return V`
        <circle
          class="mask-clip-circle"
          cx="${i.xpos}"
          cy="${i.ypos}"
          r="${i.radius}"
          style=${gt(this.getShapeStyles(t))}
        ></circle>
      `}))}renderArcs(t,e){return t.map((t=>{const i=this.calculateArcDimensions(t,e);return V`
        <path
          class="mask-clip-arc"
          d="${this.buildArcPath(i)}"
          style=${gt(this.getShapeStyles(t))}
        ></path>
      `}))}calculateRectangleDimensions(t,e){const i=this.calculateShapeCenter(t,e),s=eo.calculateSvgDimension(t.width),a=eo.calculateSvgDimension(t.height),r="object"==typeof t.radius?t.radius:{all:t.radius},o=Math.min(a,s)/2,n=t=>Math.min(o,Math.max(0,eo.calculateSvgDimension(t)));return i.width=s,i.height=a,i.x=i.xpos-s/2,i.y=i.ypos-a/2,i.radiusTopLeft=n(r.top_left??r.left??r.top??r.all),i.radiusTopRight=n(r.top_right??r.right??r.top??r.all),i.radiusBottomLeft=n(r.bottom_left??r.left??r.bottom??r.all),i.radiusBottomRight=n(r.bottom_right??r.right??r.bottom??r.all),i}calculateCircleDimensions(t,e){const i=this.calculateShapeCenter(t,e);return i.radius=void 0!==t.radius_percent?eo.calculateSvgDimension(t.radius_percent):t.radius,i}calculateArcDimensions(t,e){const i=this.calculateShapeCenter(t,e),s=eo.calculateSvgDimension(t.radius),a=Number(t.arc_degrees),r=90+(360-a)/2+Number(t.rotate),o=r+a,n=r*Math.PI/180,l=o*Math.PI/180;return i.radius=s,i.arcDegrees=a,i.largeArcFlag=Math.abs(a)>180?1:0,i.sweepFlag=a>=0?1:0,i.startX=i.xpos+s*Math.cos(n),i.startY=i.ypos+s*Math.sin(n),i.endX=i.xpos+s*Math.cos(l),i.endY=i.ypos+s*Math.sin(l),i}buildRoundedRectanglePath(t){return`\n      M ${t.x+t.radiusTopLeft} ${t.y}\n      h ${t.width-t.radiusTopLeft-t.radiusTopRight}\n      q ${t.radiusTopRight} 0 ${t.radiusTopRight} ${t.radiusTopRight}\n      v ${t.height-t.radiusTopRight-t.radiusBottomRight}\n      q 0 ${t.radiusBottomRight} -${t.radiusBottomRight} ${t.radiusBottomRight}\n      h -${t.width-t.radiusBottomRight-t.radiusBottomLeft}\n      q -${t.radiusBottomLeft} 0 -${t.radiusBottomLeft} -${t.radiusBottomLeft}\n      v -${t.height-t.radiusBottomLeft-t.radiusTopLeft}\n      q 0 -${t.radiusTopLeft} ${t.radiusTopLeft} -${t.radiusTopLeft}\n      Z\n    `}buildArcPath(t){return Math.abs(t.arcDegrees)>=360?`\n        M ${t.xpos-t.radius} ${t.ypos}\n        A ${t.radius} ${t.radius} 0 1 1 ${t.xpos+t.radius} ${t.ypos}\n        A ${t.radius} ${t.radius} 0 1 1 ${t.xpos-t.radius} ${t.ypos}\n        Z\n      `:`\n      M ${t.startX} ${t.startY}\n      A ${t.radius} ${t.radius} 0 ${t.largeArcFlag} ${t.sweepFlag} ${t.endX} ${t.endY}\n      Z\n    `}calculateShapeCenter(t,e){if(void 0!==t.dxpos||void 0!==t.dypos){const i=this.card.calculateSvgCoordinatesInGroup(e);return{xpos:i.xpos+eo.calculateSvgDimension(t.dxpos),ypos:i.ypos+eo.calculateSvgDimension(t.dypos)}}return this.card.calculateSvgCoordinatesInGroup(t)}definitionUsesRelativePosition(t){return!!t.soft_arc||pa.some((e=>t[e].some((t=>void 0!==t.dxpos||void 0!==t.dypos))))}getItemsUsingDefinition(t,e){const i=[];return ua.forEach((s=>{const a=this.config.layout[s];Array.isArray(a)&&a.forEach((a=>{(Array.isArray(a[t])?a[t]:[a[t]]).includes(e)&&i.push({section:s,item:a})}))})),i}getDefinitionStyles(t){return da.toStyleDict(t.styles)}getShapeStyles(t){return this.applyGradientRefs(da.toStyleDict(t.styles))}applyGradientRefs(t){const e={};return Object.entries(t).forEach((([t,i])=>{const s=String(i).trim().match(/^gradient\(([^)]+)\)$/);e[t]=s?`url(#${this.getGradientId(s[1].trim())})`:i})),e}renderItemLayers(t,e,i){let s=e;if(t.mask){(Array.isArray(t.mask)?t.mask:[t.mask]).forEach((e=>{this.getMaskUseIds(e,t,i).forEach((t=>{s=V`<g mask="url(#${t})">${s}</g>`}))}))}return t.clip&&(s=V`<g clip-path="url(#${this.getClipUseId(t.clip,t,i)})">${s}</g>`),s}}class ol{constructor(t,e){this.templates=t,this.cardId=e,this.viewBox={width:fa,height:fa},this.sourceGroupConfigs=[],this.activeGroupConfigs=[],this.activeGroupSignatures={},this.groupsHaveJavascript=!1,this.changedGroupIds=new Set}setConfig(t,e){t.layout.groups??=[],t.layout.gradients??={},t.layout.clips??={},t.layout.masks??={},this.sourceGroupConfigs=t.layout.groups,this.activeGroupConfigs=this.sourceGroupConfigs,this.activeGroupSignatures={},this.groupsHaveJavascript=this.sourceGroupConfigs.some((t=>this.templates.hasJavascriptTemplates(t))),this.changedGroupIds.clear(),this.groupManager=new al(this.activeGroupConfigs),this.masksClips=new rl(t,this.cardId,this),this.aspectratio=(t.layout.aspectratio||t.aspectratio||"1/1").trim();const i=this.aspectratio.split("/");this.viewBox.width=i[0]*ma,this.viewBox.height=i[1]*ma,t.layout.icons&&t.layout.icons.forEach((t=>{t.svg=this.calculateSvgCoordinatesInGroup(t)})),e&&e.forEach((t=>{t.svg=this.calculateSvgCoordinatesInGroup(t),t.svg.radius=eo.calculateSvgDimension(t.radius),t.svg.tickmarksRadius=eo.calculateSvgDimension(t.tickmarks_radius),t.svg.rotateX=t.svg.xpos,t.svg.rotateY=t.svg.ypos}))}updateGroups(t){if(this.changedGroupIds.clear(),!t||!this.groupsHaveJavascript)return;const e=[...this.activeGroupConfigs],i=new Set;this.sourceGroupConfigs.forEach(((t,s)=>{if(!this.templates.hasJavascriptTemplates(t))return;const a=String(t.id),r=this.templates.getJsTemplateOrValue(t,t,{resolveKeys:!0}),o=JSON.stringify(r);e[s]=r,o!==this.activeGroupSignatures[a]&&(this.activeGroupSignatures[a]=o,i.add(a))})),0!==i.size&&(this.activeGroupConfigs=e,this.groupManager=new al(this.activeGroupConfigs),Object.keys(this.groupManager.groups).forEach((t=>{let e=t;for(;e;){if(i.has(e)){this.changedGroupIds.add(t);break}const s=this.groupManager.groups[e];e="card"===e?void 0:s.parent??"card"}})))}markGroupsHandled(){this.changedGroupIds.clear()}calculateSvgCoordinatesInGroup(t){return this.groupManager.calculateSvgCoordinatesInGroup(t)}getGroupScaleTransform(t){return this.groupManager.getGroupScaleTransform(t)}getGroupScaleStyle(t){return this.groupManager.getGroupScaleStyle(t)}renderSvgDefs(){return V`
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
    `}}class nl{static javascriptTemplateFlags=new WeakMap;static javascriptFunctionCache=new Map;constructor(t){this.context={hass:void 0,config:void 0,entities:t,entity_slots:void 0}}beginConfig(t){this.context.config=t,this.context.entity_slots=void 0}setEntitySlots(t){this.context.entity_slots=t}setHass(t){this.context.hass=t}detectJavascriptTemplates(t){return nl.detectJavascriptTemplates(t)}hasJavascriptTemplates(t){return nl.hasJavascriptTemplates(t)}getJsTemplateOrValue(t,e,i={}){return this._getJsTemplateOrValue(t,e,i,0)}static detectJavascriptTemplates(t){if("string"==typeof t)return nl.isJsTemplate(t);if(Array.isArray(t)){let e=!1;return t.forEach((t=>{nl.detectJavascriptTemplates(t)&&(e=!0)})),nl.javascriptTemplateFlags.set(t,e),e}if(nl.isPlainObject(t)){let e=!1;return Object.entries(t).forEach((([t,i])=>{nl.isJsTemplate(t)&&(e=!0),nl.detectJavascriptTemplates(i)&&(e=!0)})),nl.javascriptTemplateFlags.set(t,e),e}return!1}static hasJavascriptTemplates(t){return"string"==typeof t?nl.isJsTemplate(t):!(!t||"object"!=typeof t)&&(nl.javascriptTemplateFlags.has(t)||nl.detectJavascriptTemplates(t),!0===nl.javascriptTemplateFlags.get(t))}_getJsTemplateOrValue(t,e,i,s){const{resolveKeys:a=!0,maxDepth:r=10}=i;if(s>=r)return e;if(null==e)return e;if(["number","boolean","bigint","symbol"].includes(typeof e))return e;if(Array.isArray(e))return e.map((e=>this._getJsTemplateOrValue(t,e,i,s)));if(nl.isPlainObject(e))return Object.fromEntries(Object.entries(e).map((([e,r])=>{const o=a?this._getJsTemplateOrValue(t,e,i,s):e,n=this._getJsTemplateOrValue(t,r,i,s);return[String(o),n]})));if("string"!=typeof e)return e;const o=e.trim();if(!nl.isJsTemplate(o))return e;const n=this.evaluateJsTemplate(t,nl.extractJsTemplateCode(o));return this._getJsTemplateOrValue(t,n,i,s+1)}static isJsTemplate(t){return"string"==typeof t&&t.trim().startsWith("[[[")&&t.trim().endsWith("]]]")}static extractJsTemplateCode(t){return String(t).trim().slice(3,-3).trim()}evaluateJsTemplate(t,e){const{hass:i,config:s,entities:a,entity_slots:r}=this.context,o=nl._getItemEntityIndex(t),n=this._getTemplateState(t),l=a[o],h=i?.states,c=s?.constants??{},d=i?.user;s?.dev?.debug&&console.log("Evaluating JavaScript template with context:",{hass:i,config:s,entity:l,entities:a,states:h,state:n,constants:c,entity_slots:r,item:t,user:d});try{let o=nl.javascriptFunctionCache.get(e);return o||(o=new Function("hass","config","entity","entities","states","state","constants","entity_slots","item","user",`\n            "use strict";\n            ${e}\n          `),nl.javascriptFunctionCache.set(e,o)),o(i,s,l,a,h,n,c,r,t,d)}catch(u){return void(s?.dev?.debug&&console.error("[templates] JavaScript template error:",{error:u,item:t,javascript:e}))}}_getTemplateState(t={}){const e=nl._getItemEntityIndex(t),i=this.context.entities[e],s=this.context.config.entities[e];if(!i)return;const a=s.attribute;return a&&i.attributes&&void 0!==i.attributes[a]?i.attributes[a]:i.state}static _getItemEntityIndex(t={}){if(void 0===t.entity_index||null===t.entity_index)return;const e=Number(t.entity_index);return Number.isFinite(e)?e:void 0}static isPlainObject(t){return null!==t&&"object"==typeof t&&!Array.isArray(t)}}const ll={name:"names",area:"areas",state:"states"};class hl{static compile(t){const e=t.layout.compounds;if(!Array.isArray(e))return;const i=(t,e)=>{t&&"object"==typeof t&&e&&"object"==typeof e&&(t[ga.STATIC_REF_MARKER]&&!e[ga.STATIC_REF_MARKER]&&Object.defineProperty(e,ga.STATIC_REF_MARKER,{value:!0}),Array.isArray(t)?t.forEach(((t,s)=>i(t,e[s]))):Object.entries(t).forEach((([t,s])=>{i(s,e[t])})))},s=new Set;e.forEach((t=>{if(s.has(String(t.id)))throw new Error(`[compounds] duplicate compound id '${t.id}'`);s.add(String(t.id)),ua.forEach((e=>{const i=new Set,s=t[e];Array.isArray(s)&&s.forEach((s=>{if(i.has(String(s.id)))throw new Error(`[compounds] duplicate child id '${s.id}' in ${t.id}.${e}`);i.add(String(s.id))}))}))}));const a=new Map,r=e.map(((t,e)=>{let s=t;if(void 0!==t.same_as){const r=a.get(String(t.same_as));if(!r)throw new Error(`[compounds] same_as '${t.same_as}' not found for compound ${e}`);const o={...t},n=o.same_as_replace??[],l={...r},h=[...n];delete o.same_as,delete o.same_as_replace;const c=(t,e,i)=>{t&&"object"==typeof t&&t[ga.STATIC_REF_MARKER]?i.push(e.join(".")):t&&"object"==typeof t&&!Array.isArray(t)&&Object.entries(t).forEach((([t,s])=>{c(s,[...e,t],i)}))};Object.entries(o).forEach((([t,e])=>{ua.includes(t)||c(e,[t],h)})),h.forEach((t=>{ga.deleteReplacePath(l,t)}));const d={},u={};ua.forEach((t=>{d[t]=l[t],u[t]=o[t],delete l[t],delete o[t]})),s=bt.mergeDeep(l,o),i(l,s),i(o,s),s=ga.applyDeltas(t,s,e),ua.forEach((e=>{const a=d[e],r=u[e];if(!a&&!r)return;if(!a)return void(s[e]=r);if(!r)return void(s[e]=a);const o=[...a],n=new Map;o.forEach(((t,e)=>{n.set(String(t.id),e)})),r.forEach(((s,a)=>{const r=n.get(String(s.id));if(void 0===r)return n.set(String(s.id),o.length),void o.push(s);if(void 0!==s.same_as)throw new Error(`[compounds] ${t.id}.${e}.${s.id} cannot override an inherited child and use same_as`);const l={...o[r]},h=[...s.same_as_replace??[]];Object.entries(s).forEach((([t,e])=>{c(e,[t],h)})),h.forEach((t=>{ga.deleteReplacePath(l,t)}));let d=bt.mergeDeep(l,s);i(l,d),i(s,d),d=ga.applyDeltas(s,d,a),delete d.same_as_replace,Object.keys(d).filter((t=>t.startsWith("same_as_d"))).forEach((t=>delete d[t])),o[r]=d})),s[e]=o})),delete s.same_as,delete s.same_as_replace,Object.keys(s).filter((t=>t.startsWith("same_as_d"))).forEach((t=>delete s[t]))}return a.set(String(s.id),s),s})),o={};ua.forEach((e=>{o[e]=new Set((t.layout[e]??[]).map((t=>String(t.id))))})),r.forEach((e=>{const s={};ua.forEach((t=>{s[t]=new Set((e[t]??[]).map((t=>String(t.id))))}));const a={...e};delete a.id,delete a.same_as,delete a.same_as_replace,Object.keys(a).filter((t=>t.startsWith("same_as_d"))).forEach((t=>delete a[t])),ua.forEach((t=>delete a[t])),ua.forEach((r=>{const n=e[r];Array.isArray(n)&&(t.layout[r]??=[],n.forEach((n=>{const l=String(n.id),h=`${e.id}--${l}`;if(o[r].has(h))throw new Error(`[compounds] generated id '${h}' already exists in layout.${r}`);const c=bt.mergeDeep(a,n);if(i(a,c),i(n,c),void 0!==n.same_as&&void 0===n.entity_index&&void 0!==a.entity_index&&delete c.entity_index,c.id=h,void 0!==c.same_as&&s[r].has(String(c.same_as))&&(c.same_as=`${e.id}--${c.same_as}`),["fit","width","height"].forEach((t=>{const i=c[t];i&&"object"==typeof i&&s[i.section]?.has(String(i.item_id))&&(i.item_id=`${e.id}--${i.item_id}`)})),"texts"===r){(Array.isArray(c.text)?c.text:[c.text]).forEach((t=>{if(!t||"object"!=typeof t)return;const i=ll[t.type];i&&s[i].has(String(t.id))&&(t.id=`${e.id}--${t.id}`)}))}o[r].add(h),t.layout[r].push(c)})))}))})),delete t.layout.compounds}}class cl{static compile(t,e){if(delete t.fhs_templates,e.lovelace=e.lovelace||eo.getLovelace(),void 0!==t.template){const i=cl.compileTemplateUse(t,e);(i.dev?.debug||t.dev?.debug)&&console.log("[FHS templates] compiled root template",{template:t.template,compiledConfig:i}),Object.keys(t).forEach((e=>delete t[e])),Object.entries(i).forEach((([e,i])=>{t[e]=i}))}const i=cl.compileTemplateParts(t,e);if(void 0!==i.default_entities){const t={};i.default_entities.forEach((e=>{if(void 0!==t[e.entity])throw new Error(`[templates] Duplicate default entity: ${e.entity}`);t[e.entity]=e})),i.entities??=[];const e=new Set;i.entities=i.entities.map((i=>{if(e.add(i.entity),void 0===t[i.entity])return i;const s=t[i.entity];if(void 0!==s.slot&&void 0!==i.slot&&s.slot!==i.slot)throw new Error(`[templates] Entity ${i.entity} cannot change its default slot`);const a=cl.mergeTemplateConfig(s,i);return void 0!==s.slot&&(a.slot=s.slot),a})),i.default_entities.forEach((t=>{e.has(t.entity)||i.entities.push(bt.mergeDeep({},t))})),delete i.default_entities}return Object.keys(t).forEach((e=>delete t[e])),Object.entries(i).forEach((([e,i])=>{t[e]=i})),t}static compileTemplateUse(t,e){const i="string"==typeof t.template?t.template:t.template.name,s="string"==typeof t.template?void 0:t.template.variables,a=cl.getTemplate(e,i),r=cl.replaceVariables(s,a),o=bt.mergeDeep({},t);return delete o.template,cl.mergeTemplateConfig(r,o)}static compileTemplateParts(t,e){if(Array.isArray(t))return t.map((t=>cl.compileTemplateParts(t,e)));if(t&&"object"==typeof t){if(void 0!==t.template){const i=cl.compileTemplateUse(t,e);return cl.compileTemplateParts(i,e)}const i={};return Object.entries(t).forEach((([t,s])=>{i[t]="cards"===t?s:cl.compileTemplateParts(s,e)})),i}return t}static getTemplate(t,e){const i=[t.lovelace.config,t.lovelace.rawConfig],s=["fhs_user_templates","fhs_sys_templates"];let a;if(i.forEach((t=>{a||t.views?.forEach((t=>{a||s.forEach((i=>{a||(a=t[i]?.templates?.[e])}))}))})),i.forEach((t=>{a||s.forEach((i=>{a||(a=t[i]?.templates?.[e])}))})),!a)throw new Error(`FHS template '${e}' not found`);return a}static replaceVariables(t,e){if(!t&&!e.template.defaults)return bt.mergeDeep({},e[e.template.type]);let i=t?t.slice(0):[];e.template.defaults&&(i=i.concat(e.template.defaults));let s=JSON.stringify(e[e.template.type]);return i.forEach((t=>{const e=Object.keys(t)[0],i=Object.values(t)[0];if("number"==typeof i||"boolean"==typeof i){const t=new RegExp(`"\\[\\[${e}\\]\\]"`,"gm");s=s.replace(t,i)}if("object"==typeof i){const t=new RegExp(`"\\[\\[${e}\\]\\]"`,"gm"),a=JSON.stringify(i);s=s.replace(t,a)}else{const t=new RegExp(`\\[\\[${e}\\]\\]`,"gm");s=s.replace(t,i)}})),JSON.parse(s)}static mergeTemplateConfig(t,e){const i=bt.mergeDeep({},t);return Object.entries(e).forEach((([t,e])=>{Array.isArray(e)?i[t]=e.map((t=>t&&"object"==typeof t?bt.mergeDeep(Array.isArray(t)?[]:{},t):t)):i[t]=e&&"object"==typeof e?cl.mergeTemplateConfig(i[t]??{},e):e})),i}}const dl=["xpos","ypos","width","height","zpos","embedded","frameless"];class ul{constructor(t){this.parentCard=t,this.items=[]}async setConfig(t){const e=await window.loadCardHelpers();this.items=await Promise.all(t.map((async(t,i)=>{const s={...t};dl.forEach((t=>delete s[t])),"custom:flex-horseshoe-card"===t.type&&!1!==t.embedded&&(s.embedded=!0);const a=await e.createCardElement(s);return this.parentCard._hass&&(a.hass=this.parentCard._hass),{card:a,index:i,xpos:t.xpos,ypos:t.ypos,width:t.width,height:t.height,zpos:t.zpos,frameless:!1!==t.frameless}}))),this.parentCard.requestUpdate(),this.parentCard.updateComplete.then((()=>this.removeChildCardShells()))}setHass(t){this.items.forEach((e=>{e.card.hass=t}))}async removeChildCardShells(){const t=e=>{if("ha-card"===e.localName)return e;const i=e.shadowRoot?.querySelector("ha-card");if(i)return i;const s=Array.from(e.shadowRoot?.children??[]).map((e=>t(e))).find((t=>t));return s||Array.from(e.children).map((e=>t(e))).find((t=>t))};await Promise.all(this.items.map((async e=>{e.frameless&&(e.card.updateComplete&&await e.card.updateComplete,await[1,2,3,4,5].reduce((async i=>{const s=await i;if(s)return s;await new Promise(requestAnimationFrame);const a=t(e.card);return!!a&&(a.style.background="transparent",a.style.border="0",a.style.boxShadow="none",a.style.padding="0",!0)}),Promise.resolve(!1)))})))}render(){const[t,e]=this.parentCard.cardLayout.aspectratio.split("/").map(Number),i=100*t,s=100*e;return H`
      <div class="fhs-child-card-layer">
        ${this.items.slice().sort(((t,e)=>Number(t.zpos??t.index)-Number(e.zpos??e.index)||t.index-e.index)).map((t=>{const e={left:(Number(t.xpos)-Number(t.width)/2)/i*100+"%",top:(Number(t.ypos)-Number(t.height)/2)/s*100+"%",width:Number(t.width)/i*100+"%",height:Number(t.height)/s*100+"%","z-index":String(t.zpos??t.index)};return H`<div
              class="fhs-child-card ${t.frameless?"fhs-child-card--frameless":""}"
              style=${gt(e)}
            >
              ${t.card}
            </div>`}))}
      </div>
    `}}console.info("%c FLEX-HORSESHOE-CARD %c Version 5.4.7-dev.28 ","color: white; font-weight: bold; background: darkgreen","color: darkgreen; font-weight: bold; background: white");class pl extends ot{constructor(){super(),la.setElement(this),this.cardId=Math.random().toString(36).substr(2,9),this._hass=void 0,this.entities=[],this.templates=new nl(this.entities),this.cardLayout=new ol(this.templates,this.cardId),this.cardTools=new el(this,this.templates,this.cardId),this.homeAssistant=new wt((()=>this.cardTools.hassConnected())),this.cardInputEntities=new vt(this.cardId,this.entities,(()=>this.setHass(this._hass))),this.actions=new xt(this,this.cardInputEntities),this.cardConfig=new _a(this.templates),this.cardTheme=new ca(this,(()=>this._updateGradientsAfterRender()),(()=>{this._hass&&this.setHass(this._hass,!0),this.requestUpdate()})),this.cardEntities=new wa(this.templates,this.cardTheme),this.entitiesStr=[],this.attributesStr=[],this.childCards=new ul(this),this.cardAnimations=new $a,this.resolvedEntityConfigs=[],this.entitySlots={flat:[],default:[]},this.entityConfigsInitialized=!1,this.evaluateJavascriptTemplates=!1,this.sourceCardStyles=void 0,this.activeCardStyles=void 0,this.cardStylesHaveJavascript=!1,this.iconCache={},this.svgUrlCache={},this.dev={debug:!1},this.performanceUpdateStart=void 0,this.performanceRenderStart=void 0}static styles=mt;set hass(t){this.setHass(t)}async _updateGradientsAfterRender(){await this.updateComplete,await new Promise(requestAnimationFrame),this.requestUpdate()}setHass(t,e=!1){const i=!0===this.dev.performance,s=i?performance.now():void 0,a=void 0===this._hass;this._hass=t,this.templates.setHass(t),this.homeAssistant.setHass(t);const r=this.homeAssistant.localeChanged,o=this.cardTheme.updateHass(t);this.childCards.setHass(t);const n=i?performance.now():void 0,l=this.cardEntities.stateChanged;let h=this.cardInputEntities.stateChanged||!this.entityConfigsInitialized;const c=this.config.entities.length;this.resolvedEntityConfigs.slice(0,c).forEach(((e,i)=>{const s=e.local?this.entities[i]:t.states[e.entity];s&&(this.entities[i]!==s&&(h=!0),this.entities[i]=s)}));const d=h||r||o;d?(this.resolvedEntityConfigs=this.cardEntities.buildRuntimeEntityConfigs(this.config,!0),this.entityConfigsInitialized=!0):this.resolvedEntityConfigs=this.resolvedEntityConfigs.slice(0,c),this.resolvedEntityConfigs.forEach(((e,i)=>{const s=e.local?this.entities[i]:t.states[e.entity];s&&(this.entities[i]=s)})),this.actions.setHassAndEntities(t,this.resolvedEntityConfigs,this.entities),i&&performance.measure(`FHS:${this.cardId}:entities`,{start:n,end:performance.now()});const u=i?performance.now():void 0;this.cardLayout.updateGroups(d),i&&performance.measure(`FHS:${this.cardId}:groups`,{start:u,end:performance.now()});const p=i?performance.now():void 0;d&&this.cardStylesHaveJavascript&&(this.activeCardStyles=this.templates.getJsTemplateOrValue({entity_index:0},this.sourceCardStyles)),i&&performance.measure(`FHS:${this.cardId}:card-styles`,{start:p,end:performance.now()});let g=e||d||l||this.cardTools.getRenderableTools().some((t=>t.requiresHassUpdate()));if(this.resolvedEntityConfigs.forEach(((e,i)=>{const s=e.local?this.entities[i]:t.states[e.entity];if(!s)return;this.entities[i]=s;const a=sn.buildState(s.state,e,this._hass,s);if(a!==this.entitiesStr[i]&&(this.entitiesStr[i]=a,g=!0),e.attribute&&Object.prototype.hasOwnProperty.call(s.attributes,e.attribute)){const t=sn.buildState(s.attributes[e.attribute],e,this._hass,s);t!==this.attributesStr[i]&&(this.attributesStr[i]=t,g=!0)}})),!g)return void(i&&performance.measure(`FHS:${this.cardId}:setHass`,{start:s,end:performance.now()}));a&&this.cardTools.hassAvailable(),this.evaluateJavascriptTemplates=d;const m=i?performance.now():void 0;this.cardTools.updateSparklineRuntimeConfig(),this.cardTools.setSparklineEntityStates(this.resolvedEntityConfigs,this.entities),this.cardEntities.updateSparklineEntities(this.resolvedEntityConfigs,this.entities,this.cardTools.getBySection("sparklines")),this.cardTools.updateRuntimeConfig(),this.cardTools.setRuntimeEntityStates(this.resolvedEntityConfigs,this.entities),i&&performance.measure(`FHS:${this.cardId}:tools`,{start:m,end:performance.now()});const f=i?performance.now():void 0;this.cardAnimations.update(this.config,this.entities,this.templates,h||l),i&&performance.measure(`FHS:${this.cardId}:animations`,{start:f,end:performance.now()}),this.evaluateJavascriptTemplates=!1,this.cardInputEntities.markStateHandled(),this.cardEntities.markStateHandled(),this.cardLayout.markGroupsHandled(),this.homeAssistant.markLocaleHandled(),this.cardTheme.markModeHandled(),i&&void 0===this.performanceUpdateStart&&(this.performanceUpdateStart=s),this.requestUpdate(),i&&performance.measure(`FHS:${this.cardId}:setHass`,{start:s,end:performance.now()})}setConfig(t){const e=!0===t.dev?.performance,i=e?performance.now():void 0;try{!0===(t=JSON.parse(JSON.stringify(t))).embedded?this.setAttribute("embedded",""):this.removeAttribute("embedded"),cl.compile(t,this),this.templates.beginConfig(t),this.cardConfig.initializeDeveloperConfig(t),this.dev={...t.dev};const s=Array.isArray(t.cards);if(!s&&!t.entities)throw Error("No entities defined");if(!s&&!t.layout)throw Error("No layout defined");s&&!t.layout&&(t.layout={}),s&&!t.entities&&(t.entities=[]),t?.palettes&&this.cardTheme.loadPalettes(t.palettes),this.cardConfig.assignLayoutItemIds(t),this.cardConfig.compileStaticValues(t),Kn.compileConfig(t,this.templates),this.cardConfig.removeDisabledEntityConfigs(t),this.entitySlots=this.cardConfig.buildEntitySlots(t.entities),this.templates.setEntitySlots(this.entitySlots),this.cardConfig.normalizeEntityIndexAddresses(t),hl.compile(t),ga.compile(t),this.cardConfig.removeDisabledLayoutItems(t),this.cardInputEntities.validateConfig(t),this.cardConfig.validateActionConfigs(t),this.cardConfig.detectJavascriptTemplates(t);const a=this.cardEntities.buildRuntimeEntityConfigs(t,!1);if(this.cardInputEntities.initializeEntities(a),a.length>0){const t=ta(a[0].entity);if("sensor"!==t&&"fhs_input_number"!==t&&"fhs_input_boolean"!==t&&"fhs_input_select"!==t&&a[0].attribute&&!isNaN(a[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}this.cardConfig.resolveLayoutEntityIndexes(t,a,this.entitySlots),this.cardConfig.flattenEntitySlotIndexes(t,this.entitySlots),this.cardConfig.initializeCardRuntimeDefaults(t),this.config=t,this.sourceCardStyles=this.config.styles,this.activeCardStyles=this.sourceCardStyles,this.cardStylesHaveJavascript=this.templates.hasJavascriptTemplates(this.sourceCardStyles),this.entityConfigsInitialized=!1,this.cardLayout.setConfig(this.config,this.horseshoes),this.cardTools.setHorseshoeConfig(t),this.cardTheme.setHorseshoes(this.cardTools.getBySection("horseshoes")),this.cardTools.setLayoutToolConfig(this.config),this.childCards.setConfig(this.config.cards??[]),void 0!==this._hass&&this.cardTools.hassAvailable(),e&&performance.measure(`FHS:${this.cardId}:setConfig`,{start:i,end:performance.now()})}catch(s){throw console.error("[FHC setConfig] CONFIG ERROR",{error:s,message:s?.message,stack:s?.stack,rawConfig:t,horseshoes:this.horseshoes,entity_slots:this.entitySlots}),s}}connectedCallback(){super.connectedCallback(),this.cardInputEntities.connected(),this.homeAssistant.connected(),this.cardTools.connected()}disconnectedCallback(){this.cardInputEntities.disconnected(),this.homeAssistant.disconnected(),this.cardTools.disconnected(),super.disconnectedCallback()}render(){const t=!0===this.dev.performance,e=t?performance.now():void 0;t&&(this.performanceRenderStart=e);const i=da.toStyleDict(this.activeCardStyles),s=H`
      <ha-card style=${gt(i)}>
        <div class="container" id="container">${this._renderSvg()} ${this._renderSparklineTooltips()} ${this.childCards.render()}</div>
      </ha-card>
    `;return t&&performance.measure(`FHS:${this.cardId}:render`,{start:e,end:performance.now()}),s}_renderSvg(){return V`
        <svg xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
            class="${this.config.card_filter}"
          viewBox='0 0 ${this.cardLayout.viewBox.width} ${this.cardLayout.viewBox.height}'>
            ${this.cardLayout.renderSvgDefs()}
            <g id="layout-tools" class="layout-tools">
              ${this._renderLayoutTools()}
            </g>
        </svg>
      `}_renderLayoutTools(){return V`
      ${this.cardTools.getSortedRenderableTools().map((t=>t.render()))}
    `}_renderSparklineTooltips(){return H` <div class="sparkline-tooltip-layer">${this.cardTools.getBySection("sparklines").map((t=>t.renderTooltip()))}</div> `}firstUpdated(t){super.firstUpdated?.(t),this.cardTools.firstUpdated(t)}updated(t){const e=!0===this.dev.performance,i=e?performance.now():void 0;if(super.updated?.(t),this.cardTools.updated(t),e){const t=performance.now();performance.measure(`FHS:${this.cardId}:updated`,{start:i,end:t}),void 0!==this.performanceRenderStart&&(performance.measure(`FHS:${this.cardId}:lit-update`,{start:this.performanceRenderStart,end:t}),this.performanceRenderStart=void 0),void 0!==this.performanceUpdateStart&&(performance.measure(`FHS:${this.cardId}:update-cycle`,{start:this.performanceUpdateStart,end:t}),this.performanceUpdateStart=void 0),this.isUpdatePending&&(this.performanceUpdateStart=t)}}getCardSize(){return 4}}customElements.get("flex-horseshoe-card")||customElements.define("flex-horseshoe-card",pl);

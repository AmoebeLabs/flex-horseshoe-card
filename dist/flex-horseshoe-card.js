/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce(((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1]),t[0]);return new o(s,t,i)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:a,defineProperty:h,getOwnPropertyDescriptor:l,getOwnPropertyNames:c,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,m=globalThis,f=m.trustedTypes,u=f?f.emptyScript:"",_=m.reactiveElementPolyfillSupport,g=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?u:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!a(t,e),x={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);o?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...c(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const t=this._$Eu(e,i);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const r=o.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const r=this.constructor;if(!1===s&&(o=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??$)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[g("elementProperties")]=new Map,b[g("finalized")]=new Map,_?.({ReactiveElement:b}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,v=w.trustedTypes,S=v?v.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+k,C=`<${E}>`,O=document,N=()=>O.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,j="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,R=/>/g,H=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),T=/'/g,I=/"/g,L=/^(?:script|style|textarea|title)$/i,B=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),D=B(1),V=B(2),q=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),X=new WeakMap,J=O.createTreeWalker(O,129);function Y(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,s=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=z;for(let a=0;a<i;a++){const e=t[a];let i,h,l=-1,c=0;for(;c<e.length&&(n.lastIndex=c,h=n.exec(e),null!==h);)c=n.lastIndex,n===z?"!--"===h[1]?n=U:void 0!==h[1]?n=R:void 0!==h[2]?(L.test(h[2])&&(o=RegExp("</"+h[2],"g")),n=H):void 0!==h[3]&&(n=H):n===H?">"===h[0]?(n=o??z,l=-1):void 0===h[1]?l=-2:(l=n.lastIndex-h[2].length,i=h[1],n=void 0===h[3]?H:'"'===h[3]?I:T):n===I||n===T?n=H:n===U||n===R?n=z:(n=H,o=void 0);const d=n===H&&t[a+1].startsWith("/>")?" ":"";r+=n===z?e+C:l>=0?(s.push(i),e.slice(0,l)+A+e.slice(l)+k+d):e+k+(-2===l?a:d)}return[Y(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class W{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[h,l]=G(t,e);if(this.el=W.createElement(h,i),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=J.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const e=l[r++],i=s.getAttribute(t).split(k),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?et:"?"===n[1]?it:"@"===n[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(k),e=t.length-1;if(e>0){s.textContent=v?v.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],N()),J.nextNode(),a.push({type:2,index:++o});s.append(t[e],N())}}}else if(8===s.nodeType)if(s.data===E)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(k,t+1));)a.push({type:7,index:o}),t+=k.length-1}o++}}static createElement(t,e){const i=O.createElement("template");return i.innerHTML=t,i}}function Z(t,e,i=t,s){if(e===q)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const r=P(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=Z(t,o._$AS(t,e.values),o,s)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??O).importNode(e,!0);J.currentNode=s;let o=J.nextNode(),r=0,n=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new ot(o,this,t)),this._$AV.push(e),a=i[++n]}r!==a?.index&&(o=J.nextNode(),r++)}return J.currentNode=O,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),P(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=W.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new K(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=X.get(t.strings);return void 0===e&&X.set(t.strings,e=new W(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new Q(this.O(N()),this.O(N()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(t,e=this,i,s){const o=this.strings;let r=!1;if(void 0===o)t=Z(this,t,e,0),r=!P(t)||t!==this._$AH&&t!==q,r&&(this._$AH=t);else{const s=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=Z(this,s[i+n],e,n),a===q&&(a=this._$AH[n]),r||=!P(a)||a!==this._$AH[n],a===F?t=F:t!==F&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!s&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class st extends tt{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??F)===q)return;const i=this._$AH,s=t===F&&i!==F||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==F&&(i===F||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(W,Q),(w.litHtmlVersions??=[]).push("3.3.2");const nt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class at extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new Q(e.insertBefore(N(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const ht=nt.litElementPolyfillSupport;ht?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.2");console.info("%c   FLEX-HORSESHOE-CARD   \n%c       Version 5.3.1-dev.4   ","color: yellow; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray");const lt=200,ct=520/360*Math.PI*90,dt={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed"},pt={min:0,max:100,width:6,color:"var(--primary-background-color)"},mt={width:12,color:"var(--primary-color)"},ft={action:"more-info"};customElements.define("flex-horseshoe-card",class extends at{constructor(){if(super(),this.cardId=Math.random().toString(36).substr(2,9),this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.viewBoxSize=lt,this.colorStops={},this.animations={},this.animations.vlines={},this.animations.hlines={},this.animations.circles={},this.animations.icons={},this.animations.names={},this.animations.areas={},this.animations.states={},this.colorCache={},this.isAndroid=!1,this.isSafari=!1,this.iOS=!1,this.dev={debug:!1},this.isAndroid=!!window.navigator.userAgent.match(/Android/),!this.isAndroid){const t=window.navigator.userAgent||"",e=t.toLowerCase(),i=window.navigator.platform||"",s=(/iPad|iPhone|iPod/.test(t)||"MacIntel"===i&&window.navigator.maxTouchPoints>1)&&!window.MSStream,o=t.match(/Version\/(\d+)(?:\.[\d.]+)?.*Safari/i),r=o?Number(o[1]):void 0,n=e.match(/\bos\s+(\d+)(?:[._]\d+)*.*like safari/),a=e.match(/\bios\s+(\d+)(?:[._]\d+)*/),h=a?Number(a[1]):n?Number(n[1]):void 0,l=Number.isFinite(r),c=Number.isFinite(h)&&e.includes("like safari"),d=l?r:c?h:void 0;this.iOS=s,this.isSafari=Number.isFinite(d),this.safariMajorVersion=d,this.isHomeAssistantLikeSafari=c,this.isRealSafari=l,this.isSafari14=this.isSafari&&14===d,this.isSafari15=this.isSafari&&15===d,this.isSafari16=this.isSafari&&16===d,this.isSafari17=this.isSafari&&17===d,this.isSafari18=this.isSafari&&18===d,this.isSafari26=this.isSafari&&26===d,this.isSafari27=this.isSafari&&27===d,this.isSafari28=this.isSafari&&28===d,this.isSafari29=this.isSafari&&29===d,this.isSafari30=this.isSafari&&30===d,this.isSafariGte16=this.isSafari&&d>=16,this.dev?.debug&&console.log("browser detection",{ua:t,isAndroid:this.isAndroid,isIOS:this.iOS,isSafari:this.isSafari,isRealSafari:this.isRealSafari,isHomeAssistantLikeSafari:this.isHomeAssistantLikeSafari,safariMajorVersion:this.safariMajorVersion,isSafariGte16:this.isSafariGte16})}}static get styles(){return r`
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
        
        #label, #name {
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
          fill : var(--primary-text-color);
        }
  
        .state__value {
          font-size: 3em;
          opacity: 1;
          fill : var(--primary-text-color);
          text-anchor: middle;
        }
        .entity__name {
          text-anchor: middle;
          overflow: hidden;
          opacity: 0.8;
          fill : var(--primary-text-color);
          font-size: 1.5em;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
  
        .entity__area {
          font-size: 12px;
          opacity: 0.7;
          overflow: hidden;
          fill : var(--primary-text-color);
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
          filter:  drop-shadow(0 1px 0 #ccc)
         drop-shadow(0 2px 0 #c9c9c9)
         drop-shadow(0 3px 0 #bbb)
         drop-shadow(0 4px 0 #b9b9b9)
         drop-shadow(0 5px 0 #aaa)
         drop-shadow(0 6px 1px rgba(0,0,0,.1))
         drop-shadow(0 0 5px rgba(0,0,0,.1))
         drop-shadow(0 1px 3px rgba(0,0,0,.3))
         drop-shadow(0 3px 5px rgba(0,0,0,.2))
         drop-shadow(0 5px 10px rgba(0,0,0,.25))
         drop-shadow(0 10px 10px rgba(0,0,0,.2))
         drop-shadow(0 20px 20px rgba(0,0,0,.15));
        }
        .card--dropshadow-medium--opaque--sepia90 {
          filter: drop-shadow(0.0em 0.05em 0px #b2a98f22)
                  drop-shadow(0.0em 0.07em 0px #b2a98f55)
                  drop-shadow(0.0em 0.10em 0px #b2a98f88)
                  drop-shadow(0px 0.6em 0.9em rgba(0,0,0,0.15))
                  drop-shadow(0px 1.2em 0.15em rgba(0,0,0,0.1))
                  drop-shadow(0px 2.4em 2.5em rgba(0,0,0,0.1))
                  sepia(90%);
        }
  
        .card--dropshadow-heavy--sepia90 {
          filter: drop-shadow(0.0em 0.05em 0px #b2a98f22)
                  drop-shadow(0.0em 0.07em 0px #b2a98f55)
                  drop-shadow(0.0em 0.10em 0px #b2a98f88)
                  drop-shadow(0px 0.3em 0.45em rgba(0,0,0,0.5))
                  drop-shadow(0px 0.6em 0.07em rgba(0,0,0,0.3))
                  drop-shadow(0px 1.2em 1.25em rgba(0,0,0,1))
                  drop-shadow(0px 1.8em 1.6em rgba(0,0,0,0.1))
                  drop-shadow(0px 2.4em 2.0em rgba(0,0,0,0.1))
                  drop-shadow(0px 3.0em 2.5em rgba(0,0,0,0.1))
                  sepia(90%);
        }
  
        .card--dropshadow-heavy {
          filter: drop-shadow(0.0em 0.05em 0px #b2a98f22)
                  drop-shadow(0.0em 0.07em 0px #b2a98f55)
                  drop-shadow(0.0em 0.10em 0px #b2a98f88)
                  drop-shadow(0px 0.3em 0.45em rgba(0,0,0,0.5))
                  drop-shadow(0px 0.6em 0.07em rgba(0,0,0,0.3))
                  drop-shadow(0px 1.2em 1.25em rgba(0,0,0,1))
                  drop-shadow(0px 1.8em 1.6em rgba(0,0,0,0.1))
                  drop-shadow(0px 2.4em 2.0em rgba(0,0,0,0.1))
                  drop-shadow(0px 3.0em 2.5em rgba(0,0,0,0.1));
        }
  
        .card--dropshadow-medium--sepia90 {
          filter: drop-shadow(0.0em 0.05em 0px #b2a98f)
                  drop-shadow(0.0em 0.15em 0px #b2a98f)
                  drop-shadow(0.0em 0.15em 0px #b2a98f)
                  drop-shadow(0px 0.6em 0.9em rgba(0,0,0,0.15))
                  drop-shadow(0px 1.2em 0.15em rgba(0,0,0,0.1))
                  drop-shadow(0px 2.4em 2.5em rgba(0,0,0,0.1))
                  sepia(90%);
        }
  
        .card--dropshadow-medium {
          filter: drop-shadow(0.0em 0.05em 0px #b2a98f)
                  drop-shadow(0.0em 0.15em 0px #b2a98f)
                  drop-shadow(0.0em 0.15em 0px #b2a98f)
                  drop-shadow(0px 0.6em 0.9em rgba(0,0,0,0.15))
                  drop-shadow(0px 1.2em 0.15em rgba(0,0,0,0.1))
                  drop-shadow(0px 2.4em 2.5em rgba(0,0,0,0.1));
        }
  
        .card--dropshadow-light--sepia90 {
          filter: drop-shadow(0px 0.10em 0px #b2a98f)
                  drop-shadow(0.1em 0.5em 0.2em rgba(0, 0, 0, .5))
                  sepia(90%);
        }
  
        .card--dropshadow-light {
          filter: drop-shadow(0px 0.10em 0px #b2a98f)
                  drop-shadow(0.1em 0.5em 0.2em rgba(0, 0, 0, .5));
        }
  
        .card--dropshadow-down-and-distant {
          filter: drop-shadow(0px 0.05em 0px #b2a98f)
                  drop-shadow(0px 14px 10px rgba(0,0,0,0.15)
                  drop-shadow(0px 24px 2px rgba(0,0,0,0.1))
                  drop-shadow(0px 34px 30px rgba(0,0,0,0.1));
        }
        .card--filter-none {
        }
  
        .horseshoe__svg__group {
          transform: translateY(15%);
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
        
      `}set hass(t){this._hass=t;var e,i,s=!1,o=0,r=!1;for(e of this.config.entities)this.entities[o]=t.states[this.config.entities[o].entity],this.config.entities[o].attribute&&this.entities[o].attributes[this.config.entities[o].attribute]&&((i=this._buildState(this.entities[o].attributes[this.config.entities[o].attribute],this.config.entities[o]))!==this.attributesStr[o]&&(this.attributesStr[o]=i,s=!0),r=!0),r||(i=this._buildState(this.entities[o].state,this.config.entities[o]))!==this.entitiesStr[o]&&(this.entitiesStr[o]=i,s=!0),o++;if(!s)return;var n=this.entities[0].state;this.config.entities[0].attribute&&this.entities[0].attributes[this.config.entities[0].attribute]&&(n=this.entities[0].attributes[this.config.entities[0].attribute]);const a=this.config.horseshoe_scale.min||0,h=this.config.horseshoe_scale.max||100,l=Math.min(this._calculateValueBetween(a,h,n),1),c=l*ct;this.dashArray=`${c} 900`;const d=this.config.show.horseshoe_style;if("fixed"===d)this.stroke_color=this.config.horseshoe_state.color,this.color0=this.config.horseshoe_state.color,this.color1=this.config.horseshoe_state.color,this.color1_offset="0%";else if("autominmax"===d){const t=this._calculateStrokeColor(n,this.colorStopsMinMax,!0);this.color0=t,this.color1=t,this.color1_offset="0%"}else if("colorstop"===d||"colorstopgradient"===d){const t=this._calculateStrokeColor(n,this.colorStops,"colorstopgradient"===d);this.color0=t,this.color1=t,this.color1_offset="0%"}else if("lineargradient"===d){const t={x1:"0%",y1:"0%",x2:"100%",y2:"0%"};this.color1_offset=`${Math.round(100*(1-l))}%`,this.angleCoords=t}this.config.animations&&Object.keys(this.config.animations).map((t=>{const e=t.substr(Number(t.indexOf(".")+1));return this.config.animations[t].map((t=>{if(this.entities[e].state.toLowerCase()===t.state.toLowerCase())return t.vlines&&t.vlines.map((t=>(this.animations.vlines[t.animation_id]&&t.reuse||(this.animations.vlines[t.animation_id]={}),this.animations.vlines[t.animation_id]=Object.assign(this.animations.vlines[t.animation_id],...t.styles),!0))),t.hlines&&t.hlines.map((t=>(this.animations.hlines[t.animation_id]&&t.reuse||(this.animations.hlines[t.animation_id]={}),this.animations.hlines[t.animation_id]=Object.assign(this.animations.hlines[t.animation_id],...t.styles),!0))),t.circles&&t.circles.map((t=>(this.animations.circles[t.animation_id]&&t.reuse||(this.animations.circles[t.animation_id]={}),this.animations.circles[t.animation_id]=Object.assign(this.animations.circles[t.animation_id],...t.styles),!0))),t.icons&&t.icons.map((t=>(this.animations.icons[t.animation_id]&&t.reuse||(this.animations.icons[t.animation_id]={}),this.animations.icons[t.animation_id]=Object.assign(this.animations.icons[t.animation_id],...t.styles),!0))),t.states&&t.states.map((t=>(this.animations.states[t.animation_id]&&t.reuse||(this.animations.states[t.animation_id]={}),this.animations.states[t.animation_id]=Object.assign(this.animations.states[t.animation_id],...t.styles),!0))),!0})),!0})),this.requestUpdate()}setConfig(t){if(!(t=JSON.parse(JSON.stringify(t))).entities)throw Error("No entities defined");if(!t.layout)throw Error("No layout defined");if(!t.horseshoe_scale)throw Error("No horseshoe scale defined");if(!t.horseshoe_scale.min&&0===!t.horseshoe_scale.min||!t.horseshoe_scale.max)throw Error("No horseshoe min/max for scale defined");if(!t.color_stops||t.color_stops.length<2)throw Error("No color_stops defined or not at least two colorstops");if(t.entities){if("sensor"!==this._computeDomain(t.entities[0].entity)&&t.entities[0].attribute&&!isNaN(t.entities[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}const e={texts:[],card_filter:"card--filter-none",...t,show:{...dt,...t.show},horseshoe_scale:{...pt,...t.horseshoe_scale},horseshoe_state:{...mt,...t.horseshoe_state}};for(var i of e.entities)i.tap_action||(i.tap_action={...ft});let s={};e.color_stops&&Object.keys(e.color_stops).forEach((t=>{s[t]=e.color_stops[t]}));const o=Object.keys(s).map((t=>Number(t))).sort(((t,e)=>t-e));this.colorStops=s,this.sortedStops=o;let r={};r[e.horseshoe_scale.min]=s[o[0]],r[e.horseshoe_scale.max]=s[o[o.length-1]],this.colorStopsMinMax=r,this.color0=s[o[0]],this.color1=s[o[o.length-1]];this.angleCoords={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},this.color1_offset="0%",this.config=e}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback()}render({config:t}=this){return D`
    <ha-card
      @click=${t=>this.handlePopup(t,this.entities[0])}
    >
          <div class="container" id="container">
            ${this._renderSvg()}
          </div>
  
        <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
          <linearGradient gradientTransform="rotate(0)" id="horseshoe__gradient-${this.cardId}" x1="${this.angleCoords.x1}", y1="${this.angleCoords.y1}", x2="${this.angleCoords.x2}" y2="${this.angleCoords.y2}">
            <stop offset="${this.color1_offset}" stop-color="${this.color1}" />
            <stop offset="100%" stop-color="${this.color0}" />
          </linearGradient>
        </svg>
    </ha-card>
    `}_renderTickMarks(){const{config:t}=this;if(!t)return;if(!t.show)return;if(!t.show.scale_tickmarks)return;const e=t.horseshoe_scale.color?t.horseshoe_scale.color:"var(--primary-background-color)",i=t.horseshoe_scale.ticksize?t.horseshoe_scale.ticksize:(t.horseshoe_scale.max-t.horseshoe_scale.min)/10,s=t.horseshoe_scale.min%i,o=t.horseshoe_scale.min+(0===s?0:i-s),r=(o-t.horseshoe_scale.min)/(t.horseshoe_scale.max-t.horseshoe_scale.min)*260;var n=(t.horseshoe_scale.max-o)/i,a=Math.floor(n);const h=(260-r)/n;Math.floor(a*i+o)<=t.horseshoe_scale.max&&a++;const l=t.horseshoe_scale.width?t.horseshoe_scale.width/2:3;var c,d,p=[];for(d=0;d<a;d++)c=r+(360-d*h-230)*Math.PI/180,p[d]=V`
          <circle cx="${100-86*Math.sin(c)}"
                  cy="${100-86*Math.cos(c)}" r="${l}"
                  fill="${e}">
        `;return V`${p}`}_renderSvg(){const t=this.config.card_filter?this.config.card_filter:"card--filter-none";return V`
        <svg xmlns=http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
            class="${t}" 
          viewbox='0 0 200 200'>
            ${this._renderHorseShoe()}
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
      `}_renderHorseShoe(){if(this.config.show.horseshoe)return V`
        <g id="horseshoe__svg__group" class="horseshoe__svg__group">
          <circle id="horseshoe__scale" class="horseshoe__scale" cx="50%" cy="50%" r="45%"
            fill="${this.config.fill||"rgba(0, 0, 0, 0)"}"
            stroke="${this.config.horseshoe_scale.color||"#000000"}"
            stroke-dasharray="408.4070449,180"
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
      `}_renderEntityNames(){const{layout:t}=this.config;if(!t)return;if(!t.names)return;const e=t.names.map((t=>{let e={"font-size":"1.5em;",color:"var(--primary-text-color);",opacity:"1.0;","text-anchor":"middle;"};t.styles&&(e=Object.assign(e,...t.styles));let i={};this.animations.names[t.index]&&(i=Object.assign(i,this.animations.names[t.index])),e={...e,...i};const s=JSON.stringify(e).slice(1,-1).replace(/"/g,"").replace(/,/g,""),o=this._buildName(this.entities[t.entity_index],this.config.entities[t.entity_index]);return V`
      <text>
        <tspan class="entity__name" x="${t.xpos}%" y="${t.ypos}%" style="${s}">${o}</tspan>
      </text>
          `}));return V`${e}`}_renderEntityAreas(){const{layout:t}=this.config;if(!t)return;if(!t.areas)return;const e=t.areas.map((t=>{let e={"font-size":"1em;",color:"var(--primary-text-color);",opacity:"1.0;","text-anchor":"middle;"};t.styles&&(e=Object.assign(e,...t.styles));let i={};this.animations.areas[t.index]&&(i=Object.assign(i,this.animations.areas[t.index])),e={...e,...i};const s=JSON.stringify(e).slice(1,-1).replace(/"/g,"").replace(/,/g,""),o=this._buildArea(this.entities[t.entity_index],this.config.entities[t.entity_index]);return V`
      <text class="entity__area">
        <tspan class="entity__area" x="${t.xpos}%" y="${t.ypos}%" style="${s}">${o}</tspan>
      </text>
          `}));return V`${e}`}_renderState(t){if(!t)return;const e=t.xpos?t.xpos:"",i=t.ypos?t.ypos:"",s=t.dx?t.dx:"0",o=t.dy?t.dy:"0";let r={"font-size":"1em;",color:"var(--primary-text-color);",opacity:"1.0;","text-anchor":"middle;"};t.styles&&(r=Object.assign(r,...t.styles));let n={};this.animations.states[t.index]&&(n=Object.assign(n,this.animations.states[t.index])),r={...r,...n};const a=JSON.stringify(r).slice(1,-1).replace(/"/g,"").replace(/,/g,"");var h=r["font-size"],l=.5,c="em;";const d=h.match(/\D+|\d*\.?\d+/g);2===d.length?(l=.6*Number(d[0]),c=d[1]):console.error("Cannot determine font-size for state",h),h={"font-size":l+c};let p={...r,opacity:"0.7;",...h};const m=JSON.stringify(p).slice(1,-1).replace(/"/g,"").replace(/,/g,""),f=this._buildUom(this.entities[t.entity_index],this.config.entities[t.entity_index]),u=this.config.entities[t.entity_index].attribute&&this.entities[t.entity_index].attributes[this.config.entities[t.entity_index].attribute]?this.attributesStr[t.entity_index]:this.entitiesStr[t.entity_index];return this._computeDomain(this.entities[t.entity_index].entity_id),V`
    <text @click=${e=>this.handlePopup(e,this.entities[t.entity_index])}>
      <tspan class="state__value" x="${e}%" y="${i}%" dx="${s}em" dy="${o}em" 
      style="${a}">
      ${u}</tspan>
      <tspan class="state__uom" dx="-0.1em" dy="-0.45em"
      style="${m}">
      ${f}</tspan>
    </text>
    `}_renderStates(){const{layout:t}=this.config;if(!t)return;if(!t.states)return;const e=t.states.map((t=>V`
            ${this._renderState(t)}
          `));return V`${e}`}async _handleBoundingBoxTimeout(t,e){t.animationFired=!1,t._card.requestUpdate()}_renderIcon(t){if(!t)return;t.entity=t.entity?t.entity:0,this.hasOwnProperty("animationFired")||(this.animationFired=!1),this.hasOwnProperty("hide")||(this.hide=!0);var e=t.icon_size?t.icon_size:2,i=12*e;const s=t.xpos?t.xpos/100:.5,o=t.ypos?t.ypos/100:.5,r=t.align?t.align:"center",n="center"===r?.5:"start"===r?-1:1,a=(this.clientWidth-20)/lt,h=this.getBoundingClientRect();this.getClientRects(),h.height/h.width<.9?(this.animationFired=!1,this.hide=!0):this.hide=!1;var l=s*lt,c=o*lt;this.isSafari||this.iOS?(e*=a,l=l*a-i*n*a,c=c*a-.5*i*a-.25*i*a):(l-=i*n,c=c-.5*i-.25*i);let d={};t.styles&&(d=Object.assign(d,...t.styles));let p={};this.animations.icons[t.animation_id]&&(p=Object.assign(p,this.animations.icons[t.animation_id])),d={...d,...p};const m=JSON.stringify(d).slice(1,-1).replace(/"/g,"").replace(/,/g,""),f=this._buildIcon(this.entities[t.entity_index],this.config.entities[t.entity_index]);return this.animationFired?V`
      <g @click=${e=>this.handlePopup(e,this.entities[t.entity_index])}>
        <foreignObject width="${e}em" height="${e}em" x="${l}" y="${c}">
          <body>
            <div class="icon">
              <ha-icon .icon=${f} style="line-height:${e}em;--mdc-icon-size:${e}em;width:100%; height:100%;align-self:center;${m}";
                  >
              </ha-icon>
            </div>
          </body>
        </foreignObject>
        <g>
        `:V`
      <g @click=${e=>this.handlePopup(e,this.entities[t.entity_index])}>
        <foreignObject width="0" height="0" x="${l}" y="${c}" visibility="${this.hide?"hidden":"visible"}">
          <body>
            <div class="icon">
              <ha-icon .icon=${f} style="animation: flash 0.15s 1;line-height:${e}em;--mdc-icon-size:${e}em;width:100%; height:100%;align-self:center;${m}";
                  @animationend=${t=>this._handleAnimationEvent(t,this)}
                  >
              </ha-icon>
            </div>
          </body>
        </foreignObject>
        <g>
        `}_handleAnimationEvent(t,e){t.stopPropagation(),t.preventDefault(),e.animationFired=!0,e.requestUpdate()}_renderIcons(){const{layout:t}=this.config;if(!t)return;if(!t.icons)return;const e=t.icons.map((t=>V`
            ${this._renderIcon(t)}
          `));return V`${e}`}_renderHorizontalLines(){const{layout:t}=this.config;if(!t)return;if(!t.hlines)return;const e={"stroke-linecap":"round;",stroke:"var(--primary-text-color);",opacity:"1.0;","stroke-width":"2;"},i=t.hlines.map((t=>{let i={...e};i=Object.assign(i,...t.styles);let s={};this.animations.hlines[t.animation_id]&&(s=Object.assign(s,this.animations.hlines[t.animation_id])),i={...i,...s};const o=JSON.stringify(i).slice(1,-1).replace(/"/g,"").replace(/,/g,"");return t.entity_index=t.entity_index?t.entity_index:0,V`
          <line @click=${e=>this.handlePopup(e,this.entities[t.entity_index])}
           class="line__horizontal" x1="${t.xpos-t.length/2}%" y1="${t.ypos}%" x2="${t.xpos+t.length/2}%" y2="${t.ypos}%" style="${o}"/>
          `}));return V`${i}`}_renderVerticalLines(){const{layout:t}=this.config;if(!t)return;if(!t.vlines)return;const e={"stroke-linecap":"round;",stroke:"var(--primary-text-color);",opacity:"1.0;","stroke-width":"2;"},i=t.vlines.map((t=>{let i={...e};i=Object.assign(i,...t.styles);let s={};this.animations.vlines[t.animation_id]&&(s=Object.assign(s,this.animations.vlines[t.animation_id])),i={...i,...s};const o=JSON.stringify(i).slice(1,-1).replace(/"/g,"").replace(/,/g,"");return t.entity_index=t.entity_index?t.entity_index:0,V`
          <line @click=${e=>this.handlePopup(e,this.entities[t.entity_index])} 
           class="line__vertical" x1="${t.xpos}%" y1="${t.ypos-t.length/2}%" x2="${t.xpos}%" y2="${t.ypos+t.length/2}%" style="${o}"/>
          `}));return V`${i}`}_renderCircles(){const{layout:t}=this.config;if(!t)return;if(!t.circles)return;const e=t.circles.map((t=>{let e={};t.styles&&(e=Object.assign(e,...t.styles));let i={};this.animations.circles[t.animation_id]&&(i=Object.assign(i,this.animations.circles[t.animation_id])),e={...e,...i};const s=JSON.stringify(e).slice(1,-1).replace(/"/g,"").replace(/,/g,"");return t.entity_index=t.entity_index?t.entity_index:0,V`
          <circle class="svg__dot" @click=${e=>this.handlePopup(e,this.entities[t.entity_index])}
          cx="${t.xpos}%" cy="${t.ypos}%" r="${t.radius}"
          style="${s}"/>          
          `}));return V`${e}`}_handleClick(t,e,i,s,o){let r;switch(s.action){case"more-info":r=new Event("hass-more-info",{composed:!0}),r.detail={entityId:o},t.dispatchEvent(r);break;case"navigate":if(!s.navigation_path)return;window.history.pushState(null,"",s.navigation_path),r=new Event("location-changed",{composed:!0}),r.detail={replace:!1},window.dispatchEvent(r);break;case"call-service":{if(!s.service)return;const[t,i]=s.service.split(".",2),o={...s.service_data};e.callService(t,i,o)}}}handlePopup(t,e){t.stopPropagation(),this._handleClick(this,this._hass,this.config,this.config.entities[this.config.entities.findIndex(((t,i,s)=>t.entity===e.entity_id))].tap_action,e.entity_id)}_buildArea(t,e){return e.area||"?"}_buildName(t,e){return e.name||t.attributes.friendly_name}_buildIcon(t,e){return e.icon||t.attributes.icon}_buildUom(t,e){return e.unit||t.attributes.unit_of_measurement||""}_buildState(t,e){if(isNaN(t))return t;const i=Number(t);if(void 0===e.decimals||Number.isNaN(e.decimals)||Number.isNaN(i))return Math.round(100*i)/100;const s=10**e.decimals;return(Math.round(i*s)/s).toFixed(e.decimals)}_computeState(t,e){if(isNaN(t))return t;const i=Number(t);if(void 0===e||Number.isNaN(e)||Number.isNaN(i))return Math.round(100*i)/100;const s=10**e;return(Math.round(i*s)/s).toFixed(e)}_calculateStrokeColor(t,e,i){const s=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let o,r,n;const a=s.length;if(t<=s[0])return e[s[0]];if(t>=s[a-1])return e[s[a-1]];for(let h=0;h<a-1;h++){const a=s[h],l=s[h+1];if(t>=a&&t<l){if([o,r]=[e[a],e[l]],!i)return o;n=this._calculateValueBetween(a,l,t);break}}return this._getGradientValue(o,r,n)}_calculateValueBetween(t,e,i){return(Math.min(Math.max(i,t),e)-t)/(e-t)}_getLovelacePanel(){var t=window.document.querySelector("home-assistant");return(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))||null}_getColorVariable(t){const e=t.substr(4,t.length-5);this.lovelace||(this.lovelace=this._getLovelacePanel());return window.getComputedStyle(this.lovelace).getPropertyValue(e)}_getGradientValue(t,e,i){const s=this._colorToRGBA(t),o=this._colorToRGBA(e),r=1-i,n=i,a=Math.floor(s[0]*r+o[0]*n),h=Math.floor(s[1]*r+o[1]*n),l=Math.floor(s[2]*r+o[2]*n),c=Math.floor(s[3]*r+o[3]*n);return`#${this._padZero(a.toString(16))}${this._padZero(h.toString(16))}${this._padZero(l.toString(16))}${this._padZero(c.toString(16))}`}_padZero(t){return t.length<2&&(t=`0${t}`),t.substr(0,2)}_computeDomain(t){return t.substr(0,t.indexOf("."))}_computeEntity(t){return t.substr(t.indexOf(".")+1)}_colorToRGBA(t){if(t in this.colorCache)return this.colorCache[t];var e=t;"var"===t.substr(0,3).valueOf()&&(e=this._getColorVariable(t));var i=window.document.createElement("canvas");i.width=i.height=1;var s=i.getContext("2d");s.clearRect(0,0,1,1),s.fillStyle=e,s.fillRect(0,0,1,1);const o=[...s.getImageData(0,0,1,1).data];return this.colorCache[t]=o,o}getCardSize(){return 4}});

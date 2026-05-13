/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1]),t[0]);return new o(i,t,s)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,{is:a,defineProperty:h,getOwnPropertyDescriptor:l,getOwnPropertyNames:c,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,m=globalThis,f=m.trustedTypes,u=f?f.emptyScript:"",_=m.reactiveElementPolyfillSupport,g=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?u:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},$=(t,e)=>!a(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&h(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=l(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);o?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...c(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const t=this._$Eu(e,s);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of i){const i=document.createElement("style"),o=t.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const r=o.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const r=this.constructor;if(!1===i&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??$)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[g("elementProperties")]=new Map,x[g("finalized")]=new Map,_?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,v=w.trustedTypes,S=v?v.createPolicy("flex-horseshoe-card-lit-html",{createHTML:t=>t}):void 0,A="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+k,C=`<${E}>`,O=document,P=()=>O.createComment(""),N=t=>null===t||"object"!=typeof t&&"function"!=typeof t,I=Array.isArray,M="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,j=/-->/g,R=/>/g,H=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,z=/"/g,V=/^(?:script|style|textarea|title)$/i,L=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),B=L(1),D=L(2),F=Symbol.for("lit-noChange"),J=Symbol.for("lit-nothing"),q=new WeakMap,X=O.createTreeWalker(O,129);function Y(t,e){if(!I(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const G=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=T;for(let a=0;a<s;a++){const e=t[a];let s,h,l=-1,c=0;for(;c<e.length&&(n.lastIndex=c,h=n.exec(e),null!==h);)c=n.lastIndex,n===T?"!--"===h[1]?n=j:void 0!==h[1]?n=R:void 0!==h[2]?(V.test(h[2])&&(o=RegExp("</"+h[2],"g")),n=H):void 0!==h[3]&&(n=H):n===H?">"===h[0]?(n=o??T,l=-1):void 0===h[1]?l=-2:(l=n.lastIndex-h[2].length,s=h[1],n=void 0===h[3]?H:'"'===h[3]?z:U):n===z||n===U?n=H:n===j||n===R?n=T:(n=H,o=void 0);const d=n===H&&t[a+1].startsWith("/>")?" ":"";r+=n===T?e+C:l>=0?(i.push(s),e.slice(0,l)+A+e.slice(l)+k+d):e+k+(-2===l?a:d)}return[Y(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class W{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[h,l]=G(t,e);if(this.el=W.createElement(h,s),X.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=X.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(A)){const e=l[r++],s=i.getAttribute(t).split(k),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?et:"?"===n[1]?st:"@"===n[1]?it:tt}),i.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(V.test(i.tagName)){const t=i.textContent.split(k),e=t.length-1;if(e>0){i.textContent=v?v.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],P()),X.nextNode(),a.push({type:2,index:++o});i.append(t[e],P())}}}else if(8===i.nodeType)if(i.data===E)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(k,t+1));)a.push({type:7,index:o}),t+=k.length-1}o++}}static createElement(t,e){const s=O.createElement("template");return s.innerHTML=t,s}}function Z(t,e,s=t,i){if(e===F)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const r=N(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=Z(t,o._$AS(t,e.values),o,i)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??O).importNode(e,!0);X.currentNode=i;let o=X.nextNode(),r=0,n=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new ot(o,this,t)),this._$AV.push(e),a=s[++n]}r!==a?.index&&(o=X.nextNode(),r++)}return X.currentNode=O,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=J,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),N(t)?t===J||null==t||""===t?(this._$AH!==J&&this._$AR(),this._$AH=J):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>I(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==J&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=W.createElement(Y(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new K(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new W(t)),e}k(t){I(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new Q(this.O(P()),this.O(P()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=J,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=J}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=Z(this,t,e,0),r=!N(t)||t!==this._$AH&&t!==F,r&&(this._$AH=t);else{const i=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=Z(this,i[s+n],e,n),a===F&&(a=this._$AH[n]),r||=!N(a)||a!==this._$AH[n],a===J?t=J:t!==J&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!i&&this.j(t)}j(t){t===J?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===J?void 0:t}}class st extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==J)}}class it extends tt{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??J)===F)return;const s=this._$AH,i=t===J&&s!==J||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==J&&(s===J||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(W,Q),(w.litHtmlVersions??=[]).push("3.3.2");const nt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class at extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new Q(e.insertBefore(P(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const ht=nt.litElementPolyfillSupport;ht?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.2");console.info("%c FLEX-HORSESHOE-CARD %c Version 5.4.4 ","color: white; font-weight: bold; background: darkgreen","color: darkgreen; font-weight: bold; background: white");const lt=200,ct=520/360*Math.PI*90,dt=2*Math.PI*90,pt={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed"},mt={min:0,max:100,width:6,color:"var(--primary-background-color)"},ft={width:12,color:"var(--primary-color)"},ut={action:"more-info"};class _t extends at{constructor(){if(super(),this.cardId=Math.random().toString(36).substr(2,9),this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.viewBoxSize=lt,this.colorStops={},this.animations={},this.animations.vlines={},this.animations.hlines={},this.animations.circles={},this.animations.icons={},this.animations.iconsIcon={},this.animations.names={},this.animations.areas={},this.animations.states={},this.colorCache={},this.isAndroid=!1,this.isSafari=!1,this.iOS=!1,this.iconCache={},this.iconsSvg=[],this.pendingIconPath=[],this.iconsId=[],this.bar_mode="normal",this.dev={debug:!1},this.isAndroid=!!window.navigator.userAgent.match(/Android/),!this.isAndroid){const t=window.navigator.userAgent||"",e=t.toLowerCase(),s=window.navigator.platform||"",i=(/iPad|iPhone|iPod/.test(t)||"MacIntel"===s&&window.navigator.maxTouchPoints>1)&&!window.MSStream,o=t.match(/Version\/(\d+)(?:\.[\d.]+)?.*Safari/i),r=o?Number(o[1]):void 0,n=e.match(/\bos\s+(\d+)(?:[._]\d+)*.*like safari/),a=e.match(/\bios\s+(\d+)(?:[._]\d+)*/),h=a?Number(a[1]):n?Number(n[1]):void 0,l=Number.isFinite(r),c=Number.isFinite(h)&&e.includes("like safari"),d=l?r:c?h:void 0;this.iOS=i,this.isSafari=Number.isFinite(d),this.safariMajorVersion=d,this.isHomeAssistantLikeSafari=c,this.isRealSafari=l,this.isSafari14=this.isSafari&&14===d,this.isSafari15=this.isSafari&&15===d,this.isSafari16=this.isSafari&&16===d,this.isSafari17=this.isSafari&&17===d,this.isSafari18=this.isSafari&&18===d,this.isSafari26=this.isSafari&&26===d,this.isSafari27=this.isSafari&&27===d,this.isSafari28=this.isSafari&&28===d,this.isSafari29=this.isSafari&&29===d,this.isSafari30=this.isSafari&&30===d,this.isSafariGte16=this.isSafari&&d>=16,this.dev?.debug&&console.log("browser detection",{ua:t,isAndroid:this.isAndroid,isIOS:this.iOS,isSafari:this.isSafari,isRealSafari:this.isRealSafari,isHomeAssistantLikeSafari:this.isHomeAssistantLikeSafari,safariMajorVersion:this.safariMajorVersion,isSafariGte16:this.isSafariGte16})}}static get styles(){return r`
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
                  drop-shadow(0px 14px 10px rgba(0,0,0,0.15))
                  drop-shadow(0px 24px 2px rgba(0,0,0,0.1))
                  drop-shadow(0px 34px 30px rgba(0,0,0,0.1));
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
        
      `}set hass(t){this._hass=t;var e,s,i,o=!1,r=0;for(e of this.config.entities){const e=this.config.entities[r],n=t.states[e.entity];n?(this.entities[r]=n,(s=this._buildState(n.state,e))!==this.entitiesStr[r]&&(this.entitiesStr[r]=s,o=!0),e.attribute&&Object.prototype.hasOwnProperty.call(n.attributes,e.attribute)&&(i=this._buildState(n.attributes[e.attribute],e))!==this.attributesStr[r]&&(this.attributesStr[r]=i,o=!0),r++):r++}if(!o)return;var n=this.entities[0].state;this.config.entities[0].attribute&&this.entities[0].attributes[this.config.entities[0].attribute]&&(n=this.entities[0].attributes[this.config.entities[0].attribute]);const a=this.config.horseshoe_scale.min||0,h=this.config.horseshoe_scale.max||100;if("bidirectional"===(this.config.bar_mode||"normal")){const t=ct;let e=Number(n),s=0,i=0;e>=0?(s=Math.min(this._calculateValueBetween(0,h,e),1)*(t/2),this.dashArray=`${s} ${dt-s}`,this._bidirectional_negative=!1):(i=(1-Math.min(this._calculateValueBetween(a,0,e),1))*(t/2),this.dashArray=`${i} ${dt-i}`,this.dashOffset=-(""+(dt-i)),this._bidirectional_negative=!0)}else{const t=Math.min(this._calculateValueBetween(a,h,n),1)*ct,e=900;this.dashArray=`${t} ${e}`,this._bidirectional_negative=!1}const l=Math.min(this._calculateValueBetween(a,h,n),1),c=this.config.show.horseshoe_style;if("fixed"===c)this.stroke_color=this.config.horseshoe_state.color,this.color0=this.config.horseshoe_state.color,this.color1=this.config.horseshoe_state.color,this.color1_offset="0%";else if("autominmax"===c){const t=this._calculateStrokeColor(n,this.colorStopsMinMax,!0);this.color0=t,this.color1=t,this.color1_offset="0%"}else if("colorstop"===c||"colorstopgradient"===c){const t=this._calculateStrokeColor(n,this.colorStops,"colorstopgradient"===c);this.color0=t,this.color1=t,this.color1_offset="0%"}else if("lineargradient"===c){const t={x1:"0%",y1:"0%",x2:"100%",y2:"0%"};this.color1_offset=`${Math.round(100*(1-l))}%`,this.angleCoords=t}this.config.animations&&Object.keys(this.config.animations).map((t=>{const e=t.substr(Number(t.indexOf(".")+1));return this.config.animations[t].map((t=>{if(this.entities[e].state.toLowerCase()===t.state.toLowerCase())return t.vlines&&t.vlines.map((t=>(this.animations.vlines[t.animation_id]&&t.reuse||(this.animations.vlines[t.animation_id]={}),this.animations.vlines[t.animation_id]=Object.assign(this.animations.vlines[t.animation_id],...t.styles),!0))),t.hlines&&t.hlines.map((t=>(this.animations.hlines[t.animation_id]&&t.reuse||(this.animations.hlines[t.animation_id]={}),this.animations.hlines[t.animation_id]=Object.assign(this.animations.hlines[t.animation_id],...t.styles),!0))),t.circles&&t.circles.map((t=>(this.animations.circles[t.animation_id]&&t.reuse||(this.animations.circles[t.animation_id]={}),this.animations.circles[t.animation_id]=Object.assign(this.animations.circles[t.animation_id],...t.styles),!0))),t.icons&&t.icons.map((t=>(this.animations.icons[t.animation_id]&&t.reuse||(this.animations.icons[t.animation_id]={},this.animations.iconsIcon[t.animation_id]={}),this.animations.icons[t.animation_id]=Object.assign(this.animations.icons[t.animation_id],...t.styles),this.animations.iconsIcon[t.animation_id]=t?.icon,!0))),t.states&&t.states.map((t=>(this.animations.states[t.animation_id]&&t.reuse||(this.animations.states[t.animation_id]={}),this.animations.states[t.animation_id]=Object.assign(this.animations.states[t.animation_id],...t.styles),!0))),!0})),!0})),this.requestUpdate()}_prepareItemColorStops(t){["states","names","areas","circles","hlines","vlines","icons"].forEach((e=>{const s=t.layout?.[e];Array.isArray(s)&&s.forEach((t=>{t.color_stops&&(t._colorStops=t.color_stops)}))}))}setConfig(t){if(!(t=JSON.parse(JSON.stringify(t))).entities)throw Error("No entities defined");if(!t.layout)throw Error("No layout defined");if(!t.horseshoe_scale)throw Error("No horseshoe scale defined");if(!t.horseshoe_scale.min&&0===!t.horseshoe_scale.min||!t.horseshoe_scale.max)throw Error("No horseshoe min/max for scale defined");if(!t.color_stops||t.color_stops.length<2)throw Error("No color_stops defined or not at least two colorstops");if(t.entities){if("sensor"!==this._computeDomain(t.entities[0].entity)&&t.entities[0].attribute&&!isNaN(t.entities[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}const e={texts:[],card_filter:"card--filter-none",bar_mode:t.bar_mode||"normal",...t,show:{...pt,...t.show},horseshoe_scale:{...mt,...t.horseshoe_scale},horseshoe_state:{...ft,...t.horseshoe_state}};for(var s of e.entities)s.tap_action||(s.tap_action={...ut});let i={};e.color_stops&&Object.keys(e.color_stops).forEach((t=>{i[t]=e.color_stops[t]}));const o=Object.keys(i).map((t=>Number(t))).sort(((t,e)=>t-e));this.colorStops=i,this.sortedStops=o;let r={};r[e.horseshoe_scale.min]=i[o[0]],r[e.horseshoe_scale.max]=i[o[o.length-1]],this.colorStopsMinMax=r,this.color0=i[o[0]],this.color1=i[o[o.length-1]];this.angleCoords={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},this.color1_offset="0%",this._prepareItemColorStops(e),this.config=e,this.bar_mode=e.bar_mode||"normal",this.config.layout?.icons&&this.config.layout.icons.forEach(((t,e)=>{this.iconsId[e]=Math.random().toString(36).substr(2,9)}))}_getItemEntityIndex(t={}){const e=Number(t.entity_index);return Number.isFinite(e)?e:0}_getItemStateValue(t={}){const e=t.entity_index??0,s=this.entities?.[e],i=this.config?.entities?.[e];if(!s)return;const o=i?.attribute;return o&&s.attributes&&void 0!==s.attributes[o]?s.attributes[o]:s.state}_getItemColorFromStops(t={}){if(!t._colorStops)return;const e=this._getItemStateValue(t),s=Number(e);return Number.isFinite(s)?this._calculateStrokeColor(s,t._colorStops,!0===t.colorstop_gradient):void 0}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback()}render({config:t}=this){const e=this._mergeStyles({},{styles:this.config?.styles}),s=this._buildStyleString([e]);return B`
    <ha-card
      @click=${t=>this.handlePopup(t,this.entities[0])}
      style="${s}"
    >
          <div class="container" id="container">
            ${this._renderSvg()}
          </div>
  
        <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
          <linearGradient gradientTransform="rotate(0)" id="horseshoe__gradient-${this.cardId}"
           x1="${this.angleCoords.x1}" y1="${this.angleCoords.y1}" x2="${this.angleCoords.x2}" y2="${this.angleCoords.y2}">
            <stop offset="${this.color1_offset}" stop-color="${this.color1}" />
            <stop offset="100%" stop-color="${this.color0}" />
          </linearGradient>
        </svg>
    </ha-card>
    `}_buildStyleString(t){return t?Object.entries(Object.assign({},...t)).map((([t,e])=>`${t}: ${e}`)).join(" "):""}_renderTickMarks(){const{config:t}=this;if(!t)return;if(!t.show)return;if(!t.show.scale_tickmarks)return;const e=t.horseshoe_scale.color?t.horseshoe_scale.color:"var(--primary-background-color)",s=t.horseshoe_scale.ticksize?t.horseshoe_scale.ticksize:(t.horseshoe_scale.max-t.horseshoe_scale.min)/10,i=t.horseshoe_scale.min%s,o=t.horseshoe_scale.min+(0===i?0:s-i),r=(o-t.horseshoe_scale.min)/(t.horseshoe_scale.max-t.horseshoe_scale.min)*260;var n=(t.horseshoe_scale.max-o)/s,a=Math.floor(n);const h=(260-r)/n;Math.floor(a*s+o)<=t.horseshoe_scale.max&&a++;const l=t.horseshoe_scale.width?t.horseshoe_scale.width/2:3;var c,d,p=[];for(d=0;d<a;d++)c=r+(360-d*h-230)*Math.PI/180,p[d]=D`
          <circle cx="${100-86*Math.sin(c)}"
                  cy="${100-86*Math.cos(c)}" r="${l}"
                  fill="${e}">
        `;return D`${p}`}_renderSvg(){const t=this.config.card_filter?this.config.card_filter:"card--filter-none";return D`
        <svg xmlns="http://www/w3.org/2000/svg" xmlns:xlink="http://www/w3.org/1999/xlink"
            class="${t}" 
          viewBox='0 0 200 200'>
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
      `}_renderHorseShoe(){if(!this.config.show.horseshoe)return;return"bidirectional"===(this.config.bar_mode||"normal")?this._bidirectional_negative?D`
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
        `:D`
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
        `:D`
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
    `}_renderEntityNames(){const{layout:t}=this.config;if(!t)return;if(!t.names)return;const e=t.names.map((t=>{let e=this._mergeStyles({"font-size":"1.5em;",color:"var(--primary-text-color);",opacity:"1.0;","text-anchor":"middle;"},t),s={};this.animations.names[t.index]&&(s=Object.assign(s,this.animations.names[t.index]));const i=this._getItemColorFromStops(t);i&&(s.fill=i),e={...e,...s};const o=JSON.stringify(e).slice(1,-1).replace(/"/g,"").replace(/,/g,""),r=this._buildName(this.entities[t.entity_index],this.config.entities[t.entity_index]);return D`
      <text>
        <tspan class="entity__name" x="${t.xpos}%" y="${t.ypos}%" style="${o}">${r}</tspan>
      </text>
          `}));return D`${e}`}_renderEntityAreas(){const{layout:t}=this.config;if(!t)return;if(!t.areas)return;const e=t.areas.map((t=>{let e=this._mergeStyles({"font-size":"1em;",color:"var(--primary-text-color);",opacity:"1.0;","text-anchor":"middle;"},t),s={};this.animations.areas[t.index]&&(s=Object.assign(s,this.animations.areas[t.index]));const i=this._getItemColorFromStops(t);i&&(s.fill=i),e={...e,...s};const o=JSON.stringify(e).slice(1,-1).replace(/"/g,"").replace(/,/g,""),r=this._buildArea(this.entities[t.entity_index],this.config.entities[t.entity_index]);return D`
      <text class="entity__area">
        <tspan class="entity__area" x="${t.xpos}%" y="${t.ypos}%" style="${o}">${r}</tspan>
      </text>
          `}));return D`${e}`}_renderState(t){if(!t)return;const e=t.xpos?t.xpos:"",s=t.ypos?t.ypos:"",i=t.dx?t.dx:"0",o=t.dy?t.dy:"0";let r=this._mergeStyles({"font-size":"1em;",color:"var(--primary-text-color);",opacity:"1.0;","text-anchor":"middle;"},t),n={};this.animations.states[t.index]&&(n=Object.assign(n,this.animations.states[t.index]));const a=this._getItemColorFromStops(t);a&&(n.fill=a),r={...r,...n};const h=JSON.stringify(r).slice(1,-1).replace(/"/g,"").replace(/,/g,"");var l=r["font-size"],c=.5,d="em;";const p=l.match(/\D+|\d*\.?\d+/g);2===p.length?(c=.6*Number(p[0]),d=p[1]):console.error("Cannot determine font-size for state",l),l={"font-size":c+d};let m={...r,opacity:"0.7;",...l};const f=JSON.stringify(m).slice(1,-1).replace(/"/g,"").replace(/,/g,""),u=this._buildUom(this.entities[t.entity_index],this.config.entities[t.entity_index]),_=this.config.entities[t.entity_index].attribute&&this.entities[t.entity_index].attributes[this.config.entities[t.entity_index].attribute]?this.attributesStr[t.entity_index]:this.entitiesStr[t.entity_index];return this._computeDomain(this.entities[t.entity_index].entity_id),D`
      <text @click=${e=>this.handlePopup(e,this.entities[t.entity_index])}>
        <tspan class="state__value" x="${e}%" y="${s}%" dx="${i}em" dy="${o}em" 
        style="${h}">
        ${_}</tspan>
        <tspan class="state__uom" dx="-0.1em" dy="-0.45em"
        style="${f}">
        ${u}</tspan>
      </text>
      `}_renderStates(){const{layout:t}=this.config;if(!t)return;if(!t.states)return;const e=t.states.map((t=>D`
            ${this._renderState(t)}
          `));return D`${e}`}_renderIcon(t,e){if(!t)return;t.entity=t.entity?t.entity:0,this.iconCache||={},this.iconsSvg||=[],this.pendingIconPath||=[];const s=12*(t.icon_size?t.icon_size:2),i=t.xpos?t.xpos/100:.5,o=t.ypos?t.ypos/100:.5,r=i*lt,n=o*lt,a=t.align?t.align:"center",h="center"===a?.5:"start"===a?-1:1;let l=r-s*h,c=n-s*h,d=s,p=this._mergeStyles({},t),m={};this.animations.icons[t.animation_id]&&(m=Object.assign(m,this.animations.icons[t.animation_id]));const f=this._getItemColorFromStops(t);f&&(p.fill=f),p={...p,...m};const u=JSON.stringify(p).slice(1,-1).replace(/"/g,"").replace(/,/g,""),_=this._buildIcon(this.entities[t.entity_index],this.config.entities[t.entity_index],this.animations.iconsIcon[t.animation_id]);if(this.iconCache[_])this.iconsSvg[e]=this.iconCache[_];else if(this.iconsSvg[e]=void 0,this.pendingIconPath[e]!==_){this.pendingIconPath[e]=_;let t=0;const s=40,i=50,o=()=>{if(this.pendingIconPath[e]!==_)return;const r=this._getRenderedHaIconPath(e);if(r)return this.iconsSvg[e]=r,this.iconCache[_]=r,this.pendingIconPath[e]=void 0,void this.requestUpdate();t+=1,t>=s?this.pendingIconPath[e]=void 0:window.setTimeout(o,i)};(this._card?.updateComplete&&"function"==typeof this.updateComplete.then||this.updateComplete&&"function"==typeof this.updateComplete.then?this.updateComplete:new Promise((t=>window.requestAnimationFrame(t)))).then((()=>{window.setTimeout(o,0)}))}const g=this.iconsSvg[e];if(g){const i=r-s*h,o=n-.5*s-.25*s,a=s/24;return D`
      <g
        id="icon-rendered-${this.iconsId[e]}"
        style="${u}"
        x="${i}px"
        y="${o}px"
        transform-origin="${r} ${n}"
        @click=${e=>this.handlePopup(e,this.entities[t.entity_index])}
      >
        <rect
          x="${i}"
          y="${o}"
          height="${s}px"
          width="${s}px"
          stroke-width="0px"
          fill="rgba(0,0,0,0)"
        ></rect>

        <path
          d="${g}"
          transform="translate(${i},${o}) scale(${a})"
        ></path>
      </g>
    `}return D`
    <foreignObject
      width="0px"
      height="0px"
      x="${l}"
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
            .icon=${_}
            id="icon-${this.iconsId[e]}"
          ></ha-icon>
        </div>
      </body>
    </foreignObject>
  `}_getRenderedHaIconPath(t){const e=this.shadowRoot.getElementById(`icon-${this.iconsId[t]}`);return e?.shadowRoot?.querySelector("*")?.path}_scheduleIconPathRead(t,e){if(!t)return;if(this.iconCache[t])return void(this.iconsSvg[e]=this.iconCache[t]);if(this.pendingIconPath[e]===t)return;this.pendingIconPath[e]=t;let s=0;const i=()=>{if(this.pendingIconPath[e]!==t)return;if(this.iconCache[t])return this.iconsSvg[e]=this.iconCache[t],this.pendingIconPath[e]=void 0,void this._card.requestUpdate();const o=this._getRenderedHaIconPath();if(o)return this.iconsSvg[e]=o,this.iconCache[t]=o,this.pendingIconPath[e]=void 0,void this._card.requestUpdate();s+=1,s>=40?this.pendingIconPath[e]=void 0:this._iconPathTimer=window.setTimeout(i,50)};(this._card.updateComplete&&"function"==typeof this._card.updateComplete.then?this._card.updateComplete:new Promise((t=>{window.requestAnimationFrame(t)}))).then((()=>{this._iconPathTimer=window.setTimeout(i,0)}))}_renderIcons(){const{layout:t}=this.config;if(!t)return;if(!t.icons)return;const e=t.icons.map(((t,e)=>D`
            ${this._renderIcon(t,e)}
          `));return D`${e}`}_renderHorizontalLines(){const{layout:t}=this.config;if(!t)return;if(!t.hlines)return;const e={"stroke-linecap":"round;",stroke:"var(--primary-text-color);",opacity:"1.0;","stroke-width":"2;"},s=t.hlines.map((t=>{let s=this._mergeStyles(e,t),i={};this.animations.hlines[t.animation_id]&&(i=Object.assign(i,this.animations.hlines[t.animation_id]));const o=this._getItemColorFromStops(t);o&&(i.fill=o),s={...s,...i};const r=JSON.stringify(s).slice(1,-1).replace(/"/g,"").replace(/,/g,"");return t.entity_index=t.entity_index?t.entity_index:0,D`
          <line @click=${e=>this.handlePopup(e,this.entities[t.entity_index])}
           class="line__horizontal" x1="${t.xpos-t.length/2}%" y1="${t.ypos}%" x2="${t.xpos+t.length/2}%" y2="${t.ypos}%" style="${r}"/>
          `}));return D`${s}`}_renderVerticalLines(){const{layout:t}=this.config;if(!t)return;if(!t.vlines)return;const e={"stroke-linecap":"round;",stroke:"var(--primary-text-color);",opacity:"1.0;","stroke-width":"2;"},s=t.vlines.map((t=>{let s=this._mergeStyles(e,t),i={};this.animations.vlines[t.animation_id]&&(i=Object.assign(i,this.animations.vlines[t.animation_id]));const o=this._getItemColorFromStops(t);o&&(i.fill=o),s={...s,...i};const r=JSON.stringify(s).slice(1,-1).replace(/"/g,"").replace(/,/g,"");return t.entity_index=t.entity_index?t.entity_index:0,D`
          <line @click=${e=>this.handlePopup(e,this.entities[t.entity_index])} 
           class="line__vertical" x1="${t.xpos}%" y1="${t.ypos-t.length/2}%" x2="${t.xpos}%" y2="${t.ypos+t.length/2}%" style="${r}"/>
          `}));return D`${s}`}_renderCircles(){const{layout:t}=this.config;if(!t)return;if(!t.circles)return;const e=t.circles.map((t=>{let e=this._mergeStyles({},t),s={};this.animations.circles[t.animation_id]&&(s=Object.assign(s,this.animations.circles[t.animation_id]));const i=this._getItemColorFromStops(t);i&&(s.fill=i),e={...e,...s};const o=JSON.stringify(e).slice(1,-1).replace(/"/g,"").replace(/,/g,"");return t.entity_index=t.entity_index?t.entity_index:0,D`
        <circle class="svg__dot" @click=${e=>this.handlePopup(e,this.entities[t.entity_index])}
        cx="${t.xpos}%" cy="${t.ypos}%" r="${t.radius}"
        style="${o}"/>          
        `}));return D`${e}`}_handleClick(t,e,s,i,o){let r;switch(i.action){case"more-info":r=new Event("hass-more-info",{composed:!0}),r.detail={entityId:o},t.dispatchEvent(r);break;case"navigate":if(!i.navigation_path)return;window.history.pushState(null,"",i.navigation_path),r=new Event("location-changed",{composed:!0}),r.detail={replace:!1},window.dispatchEvent(r);break;case"call-service":{if(!i.service)return;const[t,s]=i.service.split(".",2),o={...i.service_data};e.callService(t,s,o)}}}handlePopup(t,e){t.stopPropagation(),this._handleClick(this,this._hass,this.config,this.config.entities[this.config.entities.findIndex(((t,s,i)=>t.entity===e.entity_id))].tap_action,e.entity_id)}_buildArea(t,e){return e.area||"?"}_buildName(t,e){return e.name||t.attributes.friendly_name}_buildIcon(t,e,s){return s||e.icon||t.attributes.icon}_buildUom(t,e){return e.unit||t.attributes.unit_of_measurement||""}_buildState(t,e){if(isNaN(t))return t;const s=Number(t);if(void 0===e.decimals||Number.isNaN(e.decimals)||Number.isNaN(s))return Math.round(100*s)/100;const i=10**e.decimals;return(Math.round(s*i)/i).toFixed(e.decimals)}_computeState(t,e){if(isNaN(t))return t;const s=Number(t);if(void 0===e||Number.isNaN(e)||Number.isNaN(s))return Math.round(100*s)/100;const i=10**e;return(Math.round(s*i)/i).toFixed(e)}_calculateStrokeColor(t,e,s){const i=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let o,r,n;const a=i.length;if(t<=i[0])return e[i[0]];if(t>=i[a-1])return e[i[a-1]];for(let h=0;h<a-1;h++){const a=i[h],l=i[h+1];if(t>=a&&t<l){if([o,r]=[e[a],e[l]],!s)return o;n=this._calculateValueBetween(a,l,t);break}}return this._getGradientValue(o,r,n)}_calculateValueBetween(t,e,s){return(Math.min(Math.max(s,t),e)-t)/(e-t)}_getLovelacePanel(){var t=window.document.querySelector("home-assistant");return(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))||null}_getColorVariable(t){const e=t.substr(4,t.length-5);this.lovelace||(this.lovelace=this._getLovelacePanel());return window.getComputedStyle(this.lovelace).getPropertyValue(e)}_getGradientValue(t,e,s){const i=this._colorToRGBA(t),o=this._colorToRGBA(e),r=1-s,n=s,a=Math.floor(i[0]*r+o[0]*n),h=Math.floor(i[1]*r+o[1]*n),l=Math.floor(i[2]*r+o[2]*n),c=Math.floor(i[3]*r+o[3]*n);return`#${this._padZero(a.toString(16))}${this._padZero(h.toString(16))}${this._padZero(l.toString(16))}${this._padZero(c.toString(16))}`}_padZero(t){return t.length<2&&(t=`0${t}`),t.substr(0,2)}_computeDomain(t){return t.substr(0,t.indexOf("."))}_computeEntity(t){return t.substr(t.indexOf(".")+1)}_colorToRGBA(t){if(t in this.colorCache)return this.colorCache[t];var e=t;"var"===t.substr(0,3).valueOf()&&(e=this._getColorVariable(t));var s=window.document.createElement("canvas");s.width=s.height=1;var i=s.getContext("2d");i.clearRect(0,0,1,1),i.fillStyle=e,i.fillRect(0,0,1,1);const o=[...i.getImageData(0,0,1,1).data];return this.colorCache[t]=o,o}getCardSize(){return 4}_getTemplateState(t={}){const e=this._getItemEntityIndex(t),s=this.entities?.[e],i=this.config?.entities?.[e]||{};if(!s)return;const o=i.attribute;return o&&s.attributes&&void 0!==s.attributes[o]?s.attributes[o]:s.state}_evaluateJsTemplate(t,e){const s=this._getItemEntityIndex(t),i=this._getTemplateState(t),o=this.entities?.[s],r=this.config?.entities?.[s];try{return new Function("state","states","entity","user","hass","tool_config","entity_config","states_str","attributes_str",`"use strict";\n${e}`).call(this,i,this._hass?.states||{},o,this._hass?.user,this._hass,t,r,this.entitiesStr,this.attributesStr)}catch(S){throw S.name="FlexHorseshoeCard-evaluateJsTemplate-Error",console.error("Error evaluating JS template",{item:t,jsTemplate:e,error:S}),S}}_getJsTemplateOrValue(t,e){if(null==e)return e;if(["number","boolean","bigint","symbol"].includes(typeof e))return e;if(Array.isArray(e))return e.map((e=>this._getJsTemplateOrValue(t,e)));if("object"==typeof e)return Object.fromEntries(Object.entries(e).map((([e,s])=>[e,this._getJsTemplateOrValue(t,s)])));if("string"!=typeof e)return e;const s=e.trim();return s.startsWith("[[[")&&s.endsWith("]]]")?this._evaluateJsTemplate(t,s.slice(3,-3).trim()):e}_mergeStyles(t={},e={}){if(!e.styles)return{...t};const s=this._getJsTemplateOrValue(e,e.styles);return Array.isArray(s)?Object.assign({},t,...s.filter((t=>t&&"object"==typeof t))):s&&"object"==typeof s?{...t,...s}:{...t}}_styleToString(t={}){return Object.entries(t).filter((([,t])=>null!=t)).map((([t,e])=>`${t}: ${String(e).trim()}`)).join(" ")}}customElements.get("flex-horseshoe-card")||customElements.define("flex-horseshoe-card",_t);

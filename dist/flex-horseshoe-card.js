/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const t="undefined"!=typeof window&&null!=window.customElements&&void 0!==window.customElements.polyfillWrapFlushCallback,e=(t,e,s=null)=>{for(;e!==s;){const s=e.nextSibling;t.removeChild(e),e=s}},s=`{{lit-${String(Math.random()).slice(2)}}}`,i=`\x3c!--${s}--\x3e`,r=new RegExp(`${s}|${i}`),o="$lit$";class n{constructor(t,e){this.parts=[],this.element=e;const i=[],n=[],l=document.createTreeWalker(e.content,133,null,!1);let c=0,p=-1,u=0;const{strings:m,values:{length:f}}=t;for(;u<f;){const t=l.nextNode();if(null!==t){if(p++,1===t.nodeType){if(t.hasAttributes()){const e=t.attributes,{length:s}=e;let i=0;for(let t=0;t<s;t++)a(e[t].name,o)&&i++;for(;i-- >0;){const e=m[u],s=d.exec(e)[2],i=s.toLowerCase()+o,n=t.getAttribute(i);t.removeAttribute(i);const a=n.split(r);this.parts.push({type:"attribute",index:p,name:s,strings:a}),u+=a.length-1}}"TEMPLATE"===t.tagName&&(n.push(t),l.currentNode=t.content)}else if(3===t.nodeType){const e=t.data;if(e.indexOf(s)>=0){const s=t.parentNode,n=e.split(r),l=n.length-1;for(let e=0;e<l;e++){let i,r=n[e];if(""===r)i=h();else{const t=d.exec(r);null!==t&&a(t[2],o)&&(r=r.slice(0,t.index)+t[1]+t[2].slice(0,-5)+t[3]),i=document.createTextNode(r)}s.insertBefore(i,t),this.parts.push({type:"node",index:++p})}""===n[l]?(s.insertBefore(h(),t),i.push(t)):t.data=n[l],u+=l}}else if(8===t.nodeType)if(t.data===s){const e=t.parentNode;null!==t.previousSibling&&p!==c||(p++,e.insertBefore(h(),t)),c=p,this.parts.push({type:"node",index:p}),null===t.nextSibling?t.data="":(i.push(t),p--),u++}else{let e=-1;for(;-1!==(e=t.data.indexOf(s,e+1));)this.parts.push({type:"node",index:-1}),u++}}else l.currentNode=n.pop()}for(const s of i)s.parentNode.removeChild(s)}}const a=(t,e)=>{const s=t.length-e.length;return s>=0&&t.slice(s)===e},l=t=>-1!==t.index,h=()=>document.createComment(""),d=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function c(t,e){const{element:{content:s},parts:i}=t,r=document.createTreeWalker(s,133,null,!1);let o=u(i),n=i[o],a=-1,l=0;const h=[];let d=null;for(;r.nextNode();){a++;const t=r.currentNode;for(t.previousSibling===d&&(d=null),e.has(t)&&(h.push(t),null===d&&(d=t)),null!==d&&l++;void 0!==n&&n.index===a;)n.index=null!==d?-1:n.index-l,o=u(i,o),n=i[o]}h.forEach((t=>t.parentNode.removeChild(t)))}const p=t=>{let e=11===t.nodeType?0:1;const s=document.createTreeWalker(t,133,null,!1);for(;s.nextNode();)e++;return e},u=(t,e=-1)=>{for(let s=e+1;s<t.length;s++){const e=t[s];if(l(e))return s}return-1};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const m=new WeakMap,f=t=>"function"==typeof t&&m.has(t),g={},_={};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class y{constructor(t,e,s){this.__parts=[],this.template=t,this.processor=e,this.options=s}update(t){let e=0;for(const s of this.__parts)void 0!==s&&s.setValue(t[e]),e++;for(const s of this.__parts)void 0!==s&&s.commit()}_clone(){const e=t?this.template.element.content.cloneNode(!0):document.importNode(this.template.element.content,!0),s=[],i=this.template.parts,r=document.createTreeWalker(e,133,null,!1);let o,n=0,a=0,h=r.nextNode();for(;n<i.length;)if(o=i[n],l(o)){for(;a<o.index;)a++,"TEMPLATE"===h.nodeName&&(s.push(h),r.currentNode=h.content),null===(h=r.nextNode())&&(r.currentNode=s.pop(),h=r.nextNode());if("node"===o.type){const t=this.processor.handleTextExpression(this.options);t.insertAfterNode(h.previousSibling),this.__parts.push(t)}else this.__parts.push(...this.processor.handleAttributeExpressions(h,o.name,o.strings,this.options));n++}else this.__parts.push(void 0),n++;return t&&(document.adoptNode(e),customElements.upgrade(e)),e}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const w=window.trustedTypes&&trustedTypes.createPolicy("lit-html",{createHTML:t=>t}),x=` ${s} `;class b{constructor(t,e,s,i){this.strings=t,this.values=e,this.type=s,this.processor=i}getHTML(){const t=this.strings.length-1;let e="",r=!1;for(let n=0;n<t;n++){const t=this.strings[n],a=t.lastIndexOf("\x3c!--");r=(a>-1||r)&&-1===t.indexOf("--\x3e",a+1);const l=d.exec(t);e+=null===l?t+(r?x:i):t.substr(0,l.index)+l[1]+l[2]+o+l[3]+s}return e+=this.strings[t],e}getTemplateElement(){const t=document.createElement("template");let e=this.getHTML();return void 0!==w&&(e=w.createHTML(e)),t.innerHTML=e,t}}class v extends b{getHTML(){return`<svg>${super.getHTML()}</svg>`}getTemplateElement(){const t=super.getTemplateElement(),e=t.content,s=e.firstChild;return e.removeChild(s),((t,e,s=null,i=null)=>{for(;e!==s;){const s=e.nextSibling;t.insertBefore(e,i),e=s}})(e,s.firstChild),t}}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const S=t=>null===t||!("object"==typeof t||"function"==typeof t),k=t=>Array.isArray(t)||!(!t||!t[Symbol.iterator]);class N{constructor(t,e,s){this.dirty=!0,this.element=t,this.name=e,this.strings=s,this.parts=[];for(let i=0;i<s.length-1;i++)this.parts[i]=this._createPart()}_createPart(){return new C(this)}_getValue(){const t=this.strings,e=t.length-1,s=this.parts;if(1===e&&""===t[0]&&""===t[1]){const t=s[0].value;if("symbol"==typeof t)return String(t);if("string"==typeof t||!k(t))return t}let i="";for(let r=0;r<e;r++){i+=t[r];const e=s[r];if(void 0!==e){const t=e.value;if(S(t)||!k(t))i+="string"==typeof t?t:String(t);else for(const e of t)i+="string"==typeof e?e:String(e)}}return i+=t[e],i}commit(){this.dirty&&(this.dirty=!1,this.element.setAttribute(this.name,this._getValue()))}}class C{constructor(t){this.value=void 0,this.committer=t}setValue(t){t===g||S(t)&&t===this.value||(this.value=t,f(t)||(this.committer.dirty=!0))}commit(){for(;f(this.value);){const t=this.value;this.value=g,t(this)}this.value!==g&&this.committer.commit()}}class ${constructor(t){this.value=void 0,this.__pendingValue=void 0,this.options=t}appendInto(t){this.startNode=t.appendChild(h()),this.endNode=t.appendChild(h())}insertAfterNode(t){this.startNode=t,this.endNode=t.nextSibling}appendIntoPart(t){t.__insert(this.startNode=h()),t.__insert(this.endNode=h())}insertAfterPart(t){t.__insert(this.startNode=h()),this.endNode=t.endNode,t.endNode=this.startNode}setValue(t){this.__pendingValue=t}commit(){if(null===this.startNode.parentNode)return;for(;f(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=g,t(this)}const t=this.__pendingValue;t!==g&&(S(t)?t!==this.value&&this.__commitText(t):t instanceof b?this.__commitTemplateResult(t):t instanceof Node?this.__commitNode(t):k(t)?this.__commitIterable(t):t===_?(this.value=_,this.clear()):this.__commitText(t))}__insert(t){this.endNode.parentNode.insertBefore(t,this.endNode)}__commitNode(t){this.value!==t&&(this.clear(),this.__insert(t),this.value=t)}__commitText(t){const e=this.startNode.nextSibling,s="string"==typeof(t=null==t?"":t)?t:String(t);e===this.endNode.previousSibling&&3===e.nodeType?e.data=s:this.__commitNode(document.createTextNode(s)),this.value=t}__commitTemplateResult(t){const e=this.options.templateFactory(t);if(this.value instanceof y&&this.value.template===e)this.value.update(t.values);else{const s=new y(e,t.processor,this.options),i=s._clone();s.update(t.values),this.__commitNode(i),this.value=s}}__commitIterable(t){Array.isArray(this.value)||(this.value=[],this.clear());const e=this.value;let s,i=0;for(const r of t)s=e[i],void 0===s&&(s=new $(this.options),e.push(s),0===i?s.appendIntoPart(this):s.insertAfterPart(e[i-1])),s.setValue(r),s.commit(),i++;i<e.length&&(e.length=i,this.clear(s&&s.endNode))}clear(t=this.startNode){e(this.startNode.parentNode,t.nextSibling,this.endNode)}}class P{constructor(t,e,s){if(this.value=void 0,this.__pendingValue=void 0,2!==s.length||""!==s[0]||""!==s[1])throw new Error("Boolean attributes can only contain a single expression");this.element=t,this.name=e,this.strings=s}setValue(t){this.__pendingValue=t}commit(){for(;f(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=g,t(this)}if(this.__pendingValue===g)return;const t=!!this.__pendingValue;this.value!==t&&(t?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name),this.value=t),this.__pendingValue=g}}class A extends N{constructor(t,e,s){super(t,e,s),this.single=2===s.length&&""===s[0]&&""===s[1]}_createPart(){return new O(this)}_getValue(){return this.single?this.parts[0].value:super._getValue()}commit(){this.dirty&&(this.dirty=!1,this.element[this.name]=this._getValue())}}class O extends C{}let E=!1;(()=>{try{const t={get capture(){return E=!0,!1}};window.addEventListener("test",t,t),window.removeEventListener("test",t,t)}catch(t){}})();class T{constructor(t,e,s){this.value=void 0,this.__pendingValue=void 0,this.element=t,this.eventName=e,this.eventContext=s,this.__boundHandleEvent=t=>this.handleEvent(t)}setValue(t){this.__pendingValue=t}commit(){for(;f(this.__pendingValue);){const t=this.__pendingValue;this.__pendingValue=g,t(this)}if(this.__pendingValue===g)return;const t=this.__pendingValue,e=this.value,s=null==t||null!=e&&(t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive),i=null!=t&&(null==e||s);s&&this.element.removeEventListener(this.eventName,this.__boundHandleEvent,this.__options),i&&(this.__options=V(t),this.element.addEventListener(this.eventName,this.__boundHandleEvent,this.__options)),this.value=t,this.__pendingValue=g}handleEvent(t){"function"==typeof this.value?this.value.call(this.eventContext||this.element,t):this.value.handleEvent(t)}}const V=t=>t&&(E?{capture:t.capture,passive:t.passive,once:t.once}:t.capture)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */;function M(t){let e=j.get(t.type);void 0===e&&(e={stringsArray:new WeakMap,keyString:new Map},j.set(t.type,e));let i=e.stringsArray.get(t.strings);if(void 0!==i)return i;const r=t.strings.join(s);return i=e.keyString.get(r),void 0===i&&(i=new n(t,t.getTemplateElement()),e.keyString.set(r,i)),e.stringsArray.set(t.strings,i),i}const j=new Map,z=new WeakMap;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const U=new
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class{handleAttributeExpressions(t,e,s,i){const r=e[0];if("."===r){return new A(t,e.slice(1),s).parts}if("@"===r)return[new T(t,e.slice(1),i.eventContext)];if("?"===r)return[new P(t,e.slice(1),s)];return new N(t,e,s).parts}handleTextExpression(t){return new $(t)}};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */"undefined"!=typeof window&&(window.litHtmlVersions||(window.litHtmlVersions=[])).push("1.4.1");const R=(t,...e)=>new b(t,e,"html",U),I=(t,...e)=>new v(t,e,"svg",U)
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */,L=(t,e)=>`${t}--${e}`;let q=!0;void 0===window.ShadyCSS?q=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),q=!1);const B=t=>e=>{const i=L(e.type,t);let r=j.get(i);void 0===r&&(r={stringsArray:new WeakMap,keyString:new Map},j.set(i,r));let o=r.stringsArray.get(e.strings);if(void 0!==o)return o;const a=e.strings.join(s);if(o=r.keyString.get(a),void 0===o){const s=e.getTemplateElement();q&&window.ShadyCSS.prepareTemplateDom(s,t),o=new n(e,s),r.keyString.set(a,o)}return r.stringsArray.set(e.strings,o),o},H=["html","svg"],F=new Set,J=(t,e,s)=>{F.add(t);const i=s?s.element:document.createElement("template"),r=e.querySelectorAll("style"),{length:o}=r;if(0===o)return void window.ShadyCSS.prepareTemplateStyles(i,t);const n=document.createElement("style");for(let h=0;h<o;h++){const t=r[h];t.parentNode.removeChild(t),n.textContent+=t.textContent}(t=>{H.forEach((e=>{const s=j.get(L(e,t));void 0!==s&&s.keyString.forEach((t=>{const{element:{content:e}}=t,s=new Set;Array.from(e.querySelectorAll("style")).forEach((t=>{s.add(t)})),c(t,s)}))}))})(t);const a=i.content;s?function(t,e,s=null){const{element:{content:i},parts:r}=t;if(null==s)return void i.appendChild(e);const o=document.createTreeWalker(i,133,null,!1);let n=u(r),a=0,l=-1;for(;o.nextNode();)for(l++,o.currentNode===s&&(a=p(e),s.parentNode.insertBefore(e,s));-1!==n&&r[n].index===l;){if(a>0){for(;-1!==n;)r[n].index+=a,n=u(r,n);return}n=u(r,n)}}(s,n,a.firstChild):a.insertBefore(n,a.firstChild),window.ShadyCSS.prepareTemplateStyles(i,t);const l=a.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==l)e.insertBefore(l.cloneNode(!0),e.firstChild);else if(s){a.insertBefore(n,a.firstChild);const t=new Set;t.add(n),c(s,t)}};window.JSCompiler_renameProperty=(t,e)=>t;const X={toAttribute(t,e){switch(e){case Boolean:return t?"":null;case Object:case Array:return null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){switch(e){case Boolean:return null!==t;case Number:return null===t?null:Number(t);case Object:case Array:return JSON.parse(t)}return t}},D=(t,e)=>e!==t&&(e==e||t==t),Y={attribute:!0,type:String,converter:X,reflect:!1,hasChanged:D},W="finalized";class G extends HTMLElement{constructor(){super(),this.initialize()}static get observedAttributes(){this.finalize();const t=[];return this._classProperties.forEach(((e,s)=>{const i=this._attributeNameForProperty(s,e);void 0!==i&&(this._attributeToPropertyMap.set(i,s),t.push(i))})),t}static _ensureClassProperties(){if(!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties",this))){this._classProperties=new Map;const t=Object.getPrototypeOf(this)._classProperties;void 0!==t&&t.forEach(((t,e)=>this._classProperties.set(e,t)))}}static createProperty(t,e=Y){if(this._ensureClassProperties(),this._classProperties.set(t,e),e.noAccessor||this.prototype.hasOwnProperty(t))return;const s="symbol"==typeof t?Symbol():`__${t}`,i=this.getPropertyDescriptor(t,s,e);void 0!==i&&Object.defineProperty(this.prototype,t,i)}static getPropertyDescriptor(t,e,s){return{get(){return this[e]},set(i){const r=this[t];this[e]=i,this.requestUpdateInternal(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this._classProperties&&this._classProperties.get(t)||Y}static finalize(){const t=Object.getPrototypeOf(this);if(t.hasOwnProperty(W)||t.finalize(),this[W]=!0,this._ensureClassProperties(),this._attributeToPropertyMap=new Map,this.hasOwnProperty(JSCompiler_renameProperty("properties",this))){const t=this.properties,e=[...Object.getOwnPropertyNames(t),..."function"==typeof Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(t):[]];for(const s of e)this.createProperty(s,t[s])}}static _attributeNameForProperty(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}static _valueHasChanged(t,e,s=D){return s(t,e)}static _propertyValueFromAttribute(t,e){const s=e.type,i=e.converter||X,r="function"==typeof i?i:i.fromAttribute;return r?r(t,s):t}static _propertyValueToAttribute(t,e){if(void 0===e.reflect)return;const s=e.type,i=e.converter;return(i&&i.toAttribute||X.toAttribute)(t,s)}initialize(){this._updateState=0,this._updatePromise=new Promise((t=>this._enableUpdatingResolver=t)),this._changedProperties=new Map,this._saveInstanceProperties(),this.requestUpdateInternal()}_saveInstanceProperties(){this.constructor._classProperties.forEach(((t,e)=>{if(this.hasOwnProperty(e)){const t=this[e];delete this[e],this._instanceProperties||(this._instanceProperties=new Map),this._instanceProperties.set(e,t)}}))}_applyInstanceProperties(){this._instanceProperties.forEach(((t,e)=>this[e]=t)),this._instanceProperties=void 0}connectedCallback(){this.enableUpdating()}enableUpdating(){void 0!==this._enableUpdatingResolver&&(this._enableUpdatingResolver(),this._enableUpdatingResolver=void 0)}disconnectedCallback(){}attributeChangedCallback(t,e,s){e!==s&&this._attributeToProperty(t,s)}_propertyToAttribute(t,e,s=Y){const i=this.constructor,r=i._attributeNameForProperty(t,s);if(void 0!==r){const t=i._propertyValueToAttribute(e,s);if(void 0===t)return;this._updateState=8|this._updateState,null==t?this.removeAttribute(r):this.setAttribute(r,t),this._updateState=-9&this._updateState}}_attributeToProperty(t,e){if(8&this._updateState)return;const s=this.constructor,i=s._attributeToPropertyMap.get(t);if(void 0!==i){const t=s.getPropertyOptions(i);this._updateState=16|this._updateState,this[i]=s._propertyValueFromAttribute(e,t),this._updateState=-17&this._updateState}}requestUpdateInternal(t,e,s){let i=!0;if(void 0!==t){const r=this.constructor;s=s||r.getPropertyOptions(t),r._valueHasChanged(this[t],e,s.hasChanged)?(this._changedProperties.has(t)||this._changedProperties.set(t,e),!0!==s.reflect||16&this._updateState||(void 0===this._reflectingProperties&&(this._reflectingProperties=new Map),this._reflectingProperties.set(t,s))):i=!1}!this._hasRequestedUpdate&&i&&(this._updatePromise=this._enqueueUpdate())}requestUpdate(t,e){return this.requestUpdateInternal(t,e),this.updateComplete}async _enqueueUpdate(){this._updateState=4|this._updateState;try{await this._updatePromise}catch(e){}const t=this.performUpdate();return null!=t&&await t,!this._hasRequestedUpdate}get _hasRequestedUpdate(){return 4&this._updateState}get hasUpdated(){return 1&this._updateState}performUpdate(){if(!this._hasRequestedUpdate)return;this._instanceProperties&&this._applyInstanceProperties();let t=!1;const e=this._changedProperties;try{t=this.shouldUpdate(e),t?this.update(e):this._markUpdated()}catch(s){throw t=!1,this._markUpdated(),s}t&&(1&this._updateState||(this._updateState=1|this._updateState,this.firstUpdated(e)),this.updated(e))}_markUpdated(){this._changedProperties=new Map,this._updateState=-5&this._updateState}get updateComplete(){return this._getUpdateComplete()}_getUpdateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._updatePromise}shouldUpdate(t){return!0}update(t){void 0!==this._reflectingProperties&&this._reflectingProperties.size>0&&(this._reflectingProperties.forEach(((t,e)=>this._propertyToAttribute(e,this[e],t))),this._reflectingProperties=void 0),this._markUpdated()}updated(t){}firstUpdated(t){}}G[W]=!0;
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const Z=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,K=Symbol();class Q{constructor(t,e){if(e!==K)throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t}get styleSheet(){return void 0===this._styleSheet&&(Z?(this._styleSheet=new CSSStyleSheet,this._styleSheet.replaceSync(this.cssText)):this._styleSheet=null),this._styleSheet}toString(){return this.cssText}}const tt=(t,...e)=>{const s=e.reduce(((e,s,i)=>e+(t=>{if(t instanceof Q)return t.cssText;if("number"==typeof t)return t;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`)})(s)+t[i+1]),t[0]);return new Q(s,K)};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litElementVersions||(window.litElementVersions=[])).push("2.5.1");const et={};class st extends G{static getStyles(){return this.styles}static _getUniqueStyles(){if(this.hasOwnProperty(JSCompiler_renameProperty("_styles",this)))return;const t=this.getStyles();if(Array.isArray(t)){const e=(t,s)=>t.reduceRight(((t,s)=>Array.isArray(s)?e(s,t):(t.add(s),t)),s),s=e(t,new Set),i=[];s.forEach((t=>i.unshift(t))),this._styles=i}else this._styles=void 0===t?[]:[t];this._styles=this._styles.map((t=>{if(t instanceof CSSStyleSheet&&!Z){const e=Array.prototype.slice.call(t.cssRules).reduce(((t,e)=>t+e.cssText),"");return new Q(String(e),K)}return t}))}initialize(){super.initialize(),this.constructor._getUniqueStyles(),this.renderRoot=this.createRenderRoot(),window.ShadowRoot&&this.renderRoot instanceof window.ShadowRoot&&this.adoptStyles()}createRenderRoot(){return this.attachShadow(this.constructor.shadowRootOptions)}adoptStyles(){const t=this.constructor._styles;0!==t.length&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow?Z?this.renderRoot.adoptedStyleSheets=t.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):this._needsShimAdoptedStyleSheets=!0:window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map((t=>t.cssText)),this.localName))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&void 0!==window.ShadyCSS&&window.ShadyCSS.styleElement(this)}update(t){const e=this.render();super.update(t),e!==et&&this.constructor.render(e,this.renderRoot,{scopeName:this.localName,eventContext:this}),this._needsShimAdoptedStyleSheets&&(this._needsShimAdoptedStyleSheets=!1,this.constructor._styles.forEach((t=>{const e=document.createElement("style");e.textContent=t.cssText,this.renderRoot.appendChild(e)})))}render(){return et}}st.finalized=!0,st.render=(t,s,i)=>{if(!i||"object"!=typeof i||!i.scopeName)throw new Error("The `scopeName` option is required.");const r=i.scopeName,o=z.has(s),n=q&&11===s.nodeType&&!!s.host,a=n&&!F.has(r),l=a?document.createDocumentFragment():s;if(((t,s,i)=>{let r=z.get(s);void 0===r&&(e(s,s.firstChild),z.set(s,r=new $(Object.assign({templateFactory:M},i))),r.appendInto(s)),r.setValue(t),r.commit()})(t,l,Object.assign({templateFactory:B(r)},i)),a){const t=z.get(l);z.delete(l);const i=t.value instanceof y?t.value.template:void 0;J(r,l,i),e(s,s.firstChild),s.appendChild(l),z.set(s,t)}!o&&n&&window.ShadyCSS.styleElement(s.host)},st.shadowRootOptions={mode:"open"};console.info("%c   FLEX-HORSESHOE-CARD   \n%c       Version 2.0   ","color: yellow; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray");const it=200,rt=520/360*Math.PI*90,ot={horseshoe:!0,scale_tickmarks:!1,horseshoe_style:"fixed"},nt={min:0,max:100,width:6,color:"var(--primary-background-color)"},at={width:12,color:"var(--primary-color)"},lt={action:"more-info"};customElements.define("flex-horseshoe-card",class extends st{constructor(){super(),this.cardId=Math.random().toString(36).substr(2,9),this.entities=[],this.entitiesStr=[],this.attributesStr=[],this.viewBoxSize=it,this.colorStops={},this.animations={},this.animations.vlines={},this.animations.hlines={},this.animations.circles={},this.animations.icons={},this.animations.names={},this.animations.areas={},this.animations.states={},this.colorCache={},this.isAndroid=!!window.navigator.userAgent.match(/Android/),this.isAndroid||(this.isSafari=!!window.navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),this.iOS=(/iPad|iPhone|iPod/.test(window.navigator.userAgent)||"MacIntel"===window.navigator.platform&&window.navigator.maxTouchPoints>1)&&!window.MSStream,this.isSafari=!!window.navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),this.iOS=(/iPad|iPhone|iPod/.test(window.navigator.userAgent)||"MacIntel"===window.navigator.platform&&window.navigator.maxTouchPoints>1)&&!window.MSStream,this.isSafari14=this.isSafari&&/Version\/14\.[0-9]/.test(window.navigator.userAgent),this.isSafari15=this.isSafari&&/Version\/15\.[0-9]/.test(window.navigator.userAgent),this.isSafari16=this.isSafari&&/Version\/16\.[0-9]/.test(window.navigator.userAgent),this.isSafari17=this.isSafari&&/Version\/17\.[0-9]/.test(window.navigator.userAgent),this.isSafari18=this.isSafari&&/Version\/18\.[0-9]/.test(window.navigator.userAgent),this.isSafari14=this.isSafari14||/os 14.*like safari/.test(window.navigator.userAgent.toLowerCase()),this.isSafari15=this.isSafari15||/os 15.*like safari/.test(window.navigator.userAgent.toLowerCase()),this.isSafari16=this.isSafari16||/os 16.*like safari/.test(window.navigator.userAgent.toLowerCase()),this.isSafari17=this.isSafari17||/os 17.*like safari/.test(window.navigator.userAgent.toLowerCase()),this.isSafari18=this.isSafari18||/os 18.*like safari/.test(window.navigator.userAgent.toLowerCase()))}static get styles(){return tt`
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
        
      `}set hass(t){this._hass=t;var e,s,i=!1,r=0,o=!1;for(e of this.config.entities)this.entities[r]=t.states[this.config.entities[r].entity],this.config.entities[r].attribute&&this.entities[r].attributes[this.config.entities[r].attribute]&&((s=this._buildState(this.entities[r].attributes[this.config.entities[r].attribute],this.config.entities[r]))!==this.attributesStr[r]&&(this.attributesStr[r]=s,i=!0),o=!0),o||(s=this._buildState(this.entities[r].state,this.config.entities[r]))!==this.entitiesStr[r]&&(this.entitiesStr[r]=s,i=!0),r++;if(!i)return;var n=this.entities[0].state;this.config.entities[0].attribute&&this.entities[0].attributes[this.config.entities[0].attribute]&&(n=this.entities[0].attributes[this.config.entities[0].attribute]);const a=this.config.horseshoe_scale.min||0,l=this.config.horseshoe_scale.max||100,h=Math.min(this._calculateValueBetween(a,l,n),1),d=h*rt;this.dashArray=`${d} 900`;const c=this.config.show.horseshoe_style;if("fixed"===c)this.stroke_color=this.config.horseshoe_state.color,this.color0=this.config.horseshoe_state.color,this.color1=this.config.horseshoe_state.color,this.color1_offset="0%";else if("autominmax"===c){const t=this._calculateStrokeColor(n,this.colorStopsMinMax,!0);this.color0=t,this.color1=t,this.color1_offset="0%"}else if("colorstop"===c||"colorstopgradient"===c){const t=this._calculateStrokeColor(n,this.colorStops,"colorstopgradient"===c);this.color0=t,this.color1=t,this.color1_offset="0%"}else if("lineargradient"===c){const t={x1:"0%",y1:"0%",x2:"100%",y2:"0%"};this.color1_offset=`${Math.round(100*(1-h))}%`,this.angleCoords=t}this.config.animations&&Object.keys(this.config.animations).map((t=>{const e=t.substr(Number(t.indexOf(".")+1));return this.config.animations[t].map((t=>{if(this.entities[e].state.toLowerCase()===t.state.toLowerCase())return t.vlines&&t.vlines.map((t=>(this.animations.vlines[t.animation_id]&&t.reuse||(this.animations.vlines[t.animation_id]={}),this.animations.vlines[t.animation_id]=Object.assign(this.animations.vlines[t.animation_id],...t.styles),!0))),t.hlines&&t.hlines.map((t=>(this.animations.hlines[t.animation_id]&&t.reuse||(this.animations.hlines[t.animation_id]={}),this.animations.hlines[t.animation_id]=Object.assign(this.animations.hlines[t.animation_id],...t.styles),!0))),t.circles&&t.circles.map((t=>(this.animations.circles[t.animation_id]&&t.reuse||(this.animations.circles[t.animation_id]={}),this.animations.circles[t.animation_id]=Object.assign(this.animations.circles[t.animation_id],...t.styles),!0))),t.icons&&t.icons.map((t=>(this.animations.icons[t.animation_id]&&t.reuse||(this.animations.icons[t.animation_id]={}),this.animations.icons[t.animation_id]=Object.assign(this.animations.icons[t.animation_id],...t.styles),!0))),t.states&&t.states.map((t=>(this.animations.states[t.animation_id]&&t.reuse||(this.animations.states[t.animation_id]={}),this.animations.states[t.animation_id]=Object.assign(this.animations.states[t.animation_id],...t.styles),!0))),!0})),!0})),this.requestUpdate()}setConfig(t){if(!(t=JSON.parse(JSON.stringify(t))).entities)throw Error("No entities defined");if(!t.layout)throw Error("No layout defined");if(!t.horseshoe_scale)throw Error("No horseshoe scale defined");if(!t.horseshoe_scale.min&&0===!t.horseshoe_scale.min||!t.horseshoe_scale.max)throw Error("No horseshoe min/max for scale defined");if(!t.color_stops||t.color_stops.length<2)throw Error("No color_stops defined or not at least two colorstops");if(t.entities){if("sensor"!==this._computeDomain(t.entities[0].entity)&&t.entities[0].attribute&&!isNaN(t.entities[0].attribute))throw Error("First entity or attribute must be a numbered sensorvalue, but is NOT")}const e={texts:[],card_filter:"card--filter-none",...t,show:{...ot,...t.show},horseshoe_scale:{...nt,...t.horseshoe_scale},horseshoe_state:{...at,...t.horseshoe_state}};for(var s of e.entities)s.tap_action||(s.tap_action={...lt});let i={};e.color_stops&&Object.keys(e.color_stops).forEach((t=>{i[t]=e.color_stops[t]}));const r=Object.keys(i).map((t=>Number(t))).sort(((t,e)=>t-e));this.colorStops=i,this.sortedStops=r;let o={};o[e.horseshoe_scale.min]=i[r[0]],o[e.horseshoe_scale.max]=i[r[r.length-1]],this.colorStopsMinMax=o,this.color0=i[r[0]],this.color1=i[r[r.length-1]];this.angleCoords={x1:"0%",y1:"0%",x2:"100%",y2:"0%"},this.color1_offset="0%",this.config=e}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback()}render({config:t}=this){return R`
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
    `}_renderTickMarks(){const{config:t}=this;if(!t)return;if(!t.show)return;if(!t.show.scale_tickmarks)return;const e=t.horseshoe_scale.color?t.horseshoe_scale.color:"var(--primary-background-color)",s=t.horseshoe_scale.ticksize?t.horseshoe_scale.ticksize:(t.horseshoe_scale.max-t.horseshoe_scale.min)/10,i=t.horseshoe_scale.min%s,r=t.horseshoe_scale.min+(0===i?0:s-i),o=(r-t.horseshoe_scale.min)/(t.horseshoe_scale.max-t.horseshoe_scale.min)*260;var n=(t.horseshoe_scale.max-r)/s,a=Math.floor(n);const l=(260-o)/n;Math.floor(a*s+r)<=t.horseshoe_scale.max&&a++;const h=t.horseshoe_scale.width?t.horseshoe_scale.width/2:3;var d,c,p=[];for(c=0;c<a;c++)d=o+(360-c*l-230)*Math.PI/180,p[c]=I`
          <circle cx="${100-86*Math.sin(d)}"
                  cy="${100-86*Math.cos(d)}" r="${h}"
                  fill="${e}">
        `;return I`${p}`}_renderSvg(){const t=this.config.card_filter?this.config.card_filter:"card--filter-none";return I`
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
      `}_renderHorseShoe(){if(this.config.show.horseshoe)return I`
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
      `}_renderEntityNames(){const{layout:t}=this.config;if(!t)return;if(!t.names)return;const e=t.names.map((t=>{let e={"font-size":"1.5em;",color:"var(--primary-text-color);",opacity:"1.0;","text-anchor":"middle;"};t.styles&&(e=Object.assign(e,...t.styles));let s={};this.animations.names[t.index]&&(s=Object.assign(s,this.animations.names[t.index])),e={...e,...s};const i=JSON.stringify(e).slice(1,-1).replace(/"/g,"").replace(/,/g,""),r=this._buildName(this.entities[t.entity_index],this.config.entities[t.entity_index]);return I`
      <text>
        <tspan class="entity__name" x="${t.xpos}%" y="${t.ypos}%" style="${i}">${r}</tspan>
      </text>
          `}));return I`${e}`}_renderEntityAreas(){const{layout:t}=this.config;if(!t)return;if(!t.areas)return;const e=t.areas.map((t=>{let e={"font-size":"1em;",color:"var(--primary-text-color);",opacity:"1.0;","text-anchor":"middle;"};t.styles&&(e=Object.assign(e,...t.styles));let s={};this.animations.areas[t.index]&&(s=Object.assign(s,this.animations.areas[t.index])),e={...e,...s};const i=JSON.stringify(e).slice(1,-1).replace(/"/g,"").replace(/,/g,""),r=this._buildArea(this.entities[t.entity_index],this.config.entities[t.entity_index]);return I`
      <text class="entity__area">
        <tspan class="entity__area" x="${t.xpos}%" y="${t.ypos}%" style="${i}">${r}</tspan>
      </text>
          `}));return I`${e}`}_renderState(t){if(!t)return;const e=t.xpos?t.xpos:"",s=t.ypos?t.ypos:"",i=t.dx?t.dx:"0",r=t.dy?t.dy:"0";let o={"font-size":"1em;",color:"var(--primary-text-color);",opacity:"1.0;","text-anchor":"middle;"};t.styles&&(o=Object.assign(o,...t.styles));let n={};this.animations.states[t.index]&&(n=Object.assign(n,this.animations.states[t.index])),o={...o,...n};const a=JSON.stringify(o).slice(1,-1).replace(/"/g,"").replace(/,/g,"");var l=o["font-size"],h=.5,d="em;";const c=l.match(/\D+|\d*\.?\d+/g);2===c.length?(h=.6*Number(c[0]),d=c[1]):console.error("Cannot determine font-size for state",l),l={"font-size":h+d};let p={...o,opacity:"0.7;",...l};const u=JSON.stringify(p).slice(1,-1).replace(/"/g,"").replace(/,/g,""),m=this._buildUom(this.entities[t.entity_index],this.config.entities[t.entity_index]),f=this.config.entities[t.entity_index].attribute&&this.entities[t.entity_index].attributes[this.config.entities[t.entity_index].attribute]?this.attributesStr[t.entity_index]:this.entitiesStr[t.entity_index];return this._computeDomain(this.entities[t.entity_index].entity_id),I`
    <text @click=${e=>this.handlePopup(e,this.entities[t.entity_index])}>
      <tspan class="state__value" x="${e}%" y="${s}%" dx="${i}em" dy="${r}em" 
      style="${a}">
      ${f}</tspan>
      <tspan class="state__uom" dx="-0.1em" dy="-0.45em"
      style="${u}">
      ${m}</tspan>
    </text>
    `}_renderStates(){const{layout:t}=this.config;if(!t)return;if(!t.states)return;const e=t.states.map((t=>I`
            ${this._renderState(t)}
          `));return I`${e}`}_renderIcon(t){if(!t)return;t.entity=t.entity?t.entity:0;var e=t.icon_size?t.icon_size:2,s=12*e;const i=t.xpos?t.xpos/100:.5,r=t.ypos?t.ypos/100:.5,o=t.align?t.align:"center",n="center"===o?.5:"start"===o?-1:1,a=(this.clientWidth-20)/it;var l=i*it,h=r*it;this.isSafari&&!this.isSafari18||this.iOS?(e*=a,l=l*a-s*n*a,h=h*a-.5*s*a-.25*s*a):(l-=s*n,h=h-.5*s-.25*s);let d={};t.styles&&(d=Object.assign(d,...t.styles));let c={};this.animations.icons[t.animation_id]&&(c=Object.assign(c,this.animations.icons[t.animation_id])),d={...d,...c};const p=JSON.stringify(d).slice(1,-1).replace(/"/g,"").replace(/,/g,""),u=this._buildIcon(this.entities[t.entity_index],this.config.entities[t.entity_index]);return I`
    <g @click=${e=>this.handlePopup(e,this.entities[t.entity_index])}>
      <foreignObject width="${e}em" height="${e}em" x="${l}" y="${h}">
        <body>
          <div class="icon">
            <ha-icon .icon=${u} style="line-height:${e}em;--mdc-icon-size:${e}em;width:100%; height:100%;align-self:center;${p}";></ha-icon>
          </div>
        </body>
      </foreignObject>
      <g>
      `}_renderIcons(){const{layout:t}=this.config;if(!t)return;if(!t.icons)return;const e=t.icons.map((t=>I`
            ${this._renderIcon(t)}
          `));return I`${e}`}_renderHorizontalLines(){const{layout:t}=this.config;if(!t)return;if(!t.hlines)return;const e={"stroke-linecap":"round;",stroke:"var(--primary-text-color);",opacity:"1.0;","stroke-width":"2;"},s=t.hlines.map((t=>{let s={...e};s=Object.assign(s,...t.styles);let i={};this.animations.hlines[t.animation_id]&&(i=Object.assign(i,this.animations.hlines[t.animation_id])),s={...s,...i};const r=JSON.stringify(s).slice(1,-1).replace(/"/g,"").replace(/,/g,"");return t.entity_index=t.entity_index?t.entity_index:0,I`
          <line @click=${e=>this.handlePopup(e,this.entities[t.entity_index])}
           class="line__horizontal" x1="${t.xpos-t.length/2}%" y1="${t.ypos}%" x2="${t.xpos+t.length/2}%" y2="${t.ypos}%" style="${r}"/>
          `}));return I`${s}`}_renderVerticalLines(){const{layout:t}=this.config;if(!t)return;if(!t.vlines)return;const e={"stroke-linecap":"round;",stroke:"var(--primary-text-color);",opacity:"1.0;","stroke-width":"2;"},s=t.vlines.map((t=>{let s={...e};s=Object.assign(s,...t.styles);let i={};this.animations.vlines[t.animation_id]&&(i=Object.assign(i,this.animations.vlines[t.animation_id])),s={...s,...i};const r=JSON.stringify(s).slice(1,-1).replace(/"/g,"").replace(/,/g,"");return t.entity_index=t.entity_index?t.entity_index:0,I`
          <line @click=${e=>this.handlePopup(e,this.entities[t.entity_index])} 
           class="line__vertical" x1="${t.xpos}%" y1="${t.ypos-t.length/2}%" x2="${t.xpos}%" y2="${t.ypos+t.length/2}%" style="${r}"/>
          `}));return I`${s}`}_renderCircles(){const{layout:t}=this.config;if(!t)return;if(!t.circles)return;const e=t.circles.map((t=>{let e={};t.styles&&(e=Object.assign(e,...t.styles));let s={};this.animations.circles[t.animation_id]&&(s=Object.assign(s,this.animations.circles[t.animation_id])),e={...e,...s};const i=JSON.stringify(e).slice(1,-1).replace(/"/g,"").replace(/,/g,"");return t.entity_index=t.entity_index?t.entity_index:0,I`
          <circle class="svg__dot" @click=${e=>this.handlePopup(e,this.entities[t.entity_index])}
          cx="${t.xpos}%" cy="${t.ypos}%" r="${t.radius}"
          style="${i}"/>          
          `}));return I`${e}`}_handleClick(t,e,s,i,r){let o;switch(i.action){case"more-info":o=new Event("hass-more-info",{composed:!0}),o.detail={entityId:r},t.dispatchEvent(o);break;case"navigate":if(!i.navigation_path)return;window.history.pushState(null,"",i.navigation_path),o=new Event("location-changed",{composed:!0}),o.detail={replace:!1},window.dispatchEvent(o);break;case"call-service":{if(!i.service)return;const[t,s]=i.service.split(".",2),r={...i.service_data};e.callService(t,s,r)}}}handlePopup(t,e){t.stopPropagation(),this._handleClick(this,this._hass,this.config,this.config.entities[this.config.entities.findIndex(((t,s,i)=>t.entity===e.entity_id))].tap_action,e.entity_id)}_buildArea(t,e){return e.area||"?"}_buildName(t,e){return e.name||t.attributes.friendly_name}_buildIcon(t,e){return e.icon||t.attributes.icon}_buildUom(t,e){return e.unit||t.attributes.unit_of_measurement||""}_buildState(t,e){if(isNaN(t))return t;const s=Number(t);if(void 0===e.decimals||Number.isNaN(e.decimals)||Number.isNaN(s))return Math.round(100*s)/100;const i=10**e.decimals;return(Math.round(s*i)/i).toFixed(e.decimals)}_computeState(t,e){if(isNaN(t))return t;const s=Number(t);if(void 0===e||Number.isNaN(e)||Number.isNaN(s))return Math.round(100*s)/100;const i=10**e;return(Math.round(s*i)/i).toFixed(e)}_calculateStrokeColor(t,e,s){const i=Object.keys(e).map((t=>Number(t))).sort(((t,e)=>t-e));let r,o,n;const a=i.length;if(t<=i[0])return e[i[0]];if(t>=i[a-1])return e[i[a-1]];for(let l=0;l<a-1;l++){const a=i[l],h=i[l+1];if(t>=a&&t<h){if([r,o]=[e[a],e[h]],!s)return r;n=this._calculateValueBetween(a,h,t);break}}return this._getGradientValue(r,o,n)}_calculateValueBetween(t,e,s){return(Math.min(Math.max(s,t),e)-t)/(e-t)}_getLovelacePanel(){var t=window.document.querySelector("home-assistant");return(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver, ha-drawer partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))||null}_getColorVariable(t){const e=t.substr(4,t.length-5);this.lovelace||(this.lovelace=this._getLovelacePanel());return window.getComputedStyle(this.lovelace).getPropertyValue(e)}_getGradientValue(t,e,s){const i=this._colorToRGBA(t),r=this._colorToRGBA(e),o=1-s,n=s,a=Math.floor(i[0]*o+r[0]*n),l=Math.floor(i[1]*o+r[1]*n),h=Math.floor(i[2]*o+r[2]*n),d=Math.floor(i[3]*o+r[3]*n);return`#${this._padZero(a.toString(16))}${this._padZero(l.toString(16))}${this._padZero(h.toString(16))}${this._padZero(d.toString(16))}`}_padZero(t){return t.length<2&&(t=`0${t}`),t.substr(0,2)}_computeDomain(t){return t.substr(0,t.indexOf("."))}_computeEntity(t){return t.substr(t.indexOf(".")+1)}_colorToRGBA(t){if(t in this.colorCache)return this.colorCache[t];var e=t;"var"===t.substr(0,3).valueOf()&&(e=this._getColorVariable(t));var s=window.document.createElement("canvas");s.width=s.height=1;var i=s.getContext("2d");i.clearRect(0,0,1,1),i.fillStyle=e,i.fillRect(0,0,1,1);const r=[...i.getImageData(0,0,1,1).data];return this.colorCache[t]=r,r}getCardSize(){return 4}});

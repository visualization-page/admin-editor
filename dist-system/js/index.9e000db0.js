(function(e){function t(t){for(var r,o,c=t[0],u=t[1],s=t[2],l=0,d=[];l<c.length;l++)o=c[l],Object.prototype.hasOwnProperty.call(a,o)&&a[o]&&d.push(a[o][0]),a[o]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(e[r]=u[r]);f&&f(t);while(d.length)d.shift()();return i.push.apply(i,s||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],r=!0,o=1;o<n.length;o++){var c=n[o];0!==a[c]&&(r=!1)}r&&(i.splice(t--,1),e=u(u.s=n[0]))}return e}var r={},o={index:0},a={index:0},i=[];function c(e){return u.p+"js/"+({"editor~page":"editor~page",editor:"editor",project:"project"}[e]||e)+"."+{"chunk-7061ff12":"7c9e1980","editor~page":"d5efa3d7",editor:"0d6ea9d9",project:"3b186493"}[e]+".js"}function u(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.e=function(e){var t=[],n={"chunk-7061ff12":1,"editor~page":1,editor:1,project:1};o[e]?t.push(o[e]):0!==o[e]&&n[e]&&t.push(o[e]=new Promise((function(t,n){for(var r="css/"+({"editor~page":"editor~page",editor:"editor",project:"project"}[e]||e)+"."+{"chunk-7061ff12":"5fad6a43","editor~page":"7f6741e3",editor:"324d40a2",project:"686acd9b"}[e]+".css",a=u.p+r,i=document.getElementsByTagName("link"),c=0;c<i.length;c++){var s=i[c],l=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(l===r||l===a))return t()}var d=document.getElementsByTagName("style");for(c=0;c<d.length;c++){s=d[c],l=s.getAttribute("data-href");if(l===r||l===a)return t()}var f=document.createElement("link");f.rel="stylesheet",f.type="text/css",f.onload=t,f.onerror=function(t){var r=t&&t.target&&t.target.src||a,i=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");i.code="CSS_CHUNK_LOAD_FAILED",i.request=r,delete o[e],f.parentNode.removeChild(f),n(i)},f.href=a;var p=document.getElementsByTagName("head")[0];p.appendChild(f)})).then((function(){o[e]=0})));var r=a[e];if(0!==r)if(r)t.push(r[2]);else{var i=new Promise((function(t,n){r=a[e]=[t,n]}));t.push(r[2]=i);var s,l=document.createElement("script");l.charset="utf-8",l.timeout=120,u.nc&&l.setAttribute("nonce",u.nc),l.src=c(e);var d=new Error;s=function(t){l.onerror=l.onload=null,clearTimeout(f);var n=a[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;d.message="Loading chunk "+e+" failed.\n("+r+": "+o+")",d.name="ChunkLoadError",d.type=r,d.request=o,n[1](d)}a[e]=void 0}};var f=setTimeout((function(){s({type:"timeout",target:l})}),12e4);l.onerror=l.onload=s,document.head.appendChild(l)}return Promise.all(t)},u.m=e,u.c=r,u.d=function(e,t,n){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)u.d(n,r,function(t){return e[t]}.bind(null,r));return n},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="/",u.oe=function(e){throw console.error(e),e};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=t,s=s.slice();for(var d=0;d<s.length;d++)t(s[d]);var f=l;i.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("cd49")},"0889":function(e,t,n){"use strict";var r=n("819e"),o=n.n(r);o.a},2395:function(e,t,n){},"5f72":function(e,t){e.exports=ELEMENT},"7c55":function(e,t,n){"use strict";var r=n("2395"),o=n.n(r);o.a},8165:function(e,t){e.exports=vueCompositionApi},"819e":function(e,t,n){},"8bbf":function(e,t){e.exports=Vue},cd49:function(e,t,n){"use strict";n.r(t);n("b0c0"),n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("8bbf"),o=n.n(r),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("router-view")],1)},i=[],c={},u=c,s=(n("7c55"),n("2877")),l=Object(s["a"])(u,a,i,!1,null,null,null),d=l.exports,f=(n("d3b7"),n("8c4f")),p=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"flex-center bg-333",staticStyle:{height:"100vh"}},[n("div",[e._m(0),n("div",{staticClass:"tc mt50 pt50 flex pl30"},[n("div",{staticClass:"cp c-button button--tamaya button--border-medium",attrs:{"data-text":"立即开始"},on:{click:function(t){return e.$router.push("/project/list")}}},[n("span",[e._v("立即开始")])]),e._e()])])])},h=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"flex"},[n("div",{staticClass:"tc"},[n("p",{staticClass:"f40 c-fff"},[e._v("Butterfly")]),n("p",{staticClass:"c-aaa f14 mt10"},[e._v("快速搭建h5 @讯盟FE")])]),n("img",{staticClass:"ml20",attrs:{height:"14px",src:"https://img.shields.io/badge/-beta 0.0.1-orange",alt:""}})])}],m={name:"home",components:{}},v=m,g=(n("0889"),Object(s["a"])(v,p,h,!1,null,null,null)),b=g.exports;o.a.use(f["a"]);var y=[{path:"/",name:"home",component:b},{path:"/editor",name:"editor",component:function(){return Promise.all([n.e("chunk-7061ff12"),n.e("editor~page"),n.e("editor")]).then(n.bind(null,"f73c"))},children:[{path:":dir",name:"editor-edit",component:function(){return Promise.all([n.e("chunk-7061ff12"),n.e("editor~page"),n.e("editor")]).then(n.bind(null,"f73c"))}}]},{path:"/project/list",name:"project-list",component:function(){return Promise.all([n.e("chunk-7061ff12"),n.e("project")]).then(n.bind(null,"83b7"))}}],w=new f["a"]({routes:y}),j=w,x=n("2f62");o.a.use(x["a"]);var E=new x["a"].Store({state:{},mutations:{},actions:{},modules:{}}),C=n("30e1"),_=n.n(C),k=n("5f72");o.a.prototype.$ELEMENT={size:"mini",zIndex:3e3},o.a.use(k["Button"]).use(k["Tabs"]).use(k["TabPane"]).use(k["Form"]).use(k["FormItem"]).use(k["Input"]).use(k["Select"]).use(k["Option"]).use(k["Checkbox"]).use(k["Dialog"]).use(k["Tree"]).use(k["Cascader"]).use(k["Slider"]).use(k["ColorPicker"]).use(k["Tooltip"]);n("55ce");o.a.config.productionTip=!1;var O=o.a.prototype.$native=new _.a;if(O.name=O.cookie("userName"),O.name)document.addEventListener("DOMContentLoaded",(function(){new o.a({router:j,store:E,render:function(e){return e(d)}}).$mount("#app")}));else{var P=!1;document.addEventListener("visibilitychange",(function(){"hidden"===document.visibilityState?P&&k["MessageBox"].close():location.reload()})),new o.a({render:function(e){return e("p",{class:"tc pt50 mt50 f32 c-999"},["登录中..."])},mounted:function(){this.showLogin()},methods:{showLogin:function(){k["MessageBox"].alert("当前状态未登录，即将跳转 web 版彩云选择一家企业登录").then((function(){P=!0,window.open("//web.jituancaiyun.".concat("https:"===location.protocol?"com":"net"))})).catch(this.showLogin)}}}).$mount("#app")}}});
//# sourceMappingURL=index.9e000db0.js.map
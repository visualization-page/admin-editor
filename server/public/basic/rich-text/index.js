(function(t,n){"object"===typeof exports&&"object"===typeof module?module.exports=n(require("Vue")):"function"===typeof define&&define.amd?define(["Vue"],n):"object"===typeof exports?exports["bf-rich-text"]=n(require("Vue")):t["bf-rich-text"]=n(t["Vue"])})("undefined"!==typeof self?self:this,(function(t){return function(t){var n={};function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r})},e.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"===typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)e.d(r,o,function(n){return t[n]}.bind(null,o));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t["default"]}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s="fb15")}({"057f":function(t,n,e){var r=e("fc6a"),o=e("241c").f,c={}.toString,i="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],f=function(t){try{return o(t)}catch(n){return i.slice()}};t.exports.f=function(t){return i&&"[object Window]"==c.call(t)?f(t):o(r(t))}},"06cf":function(t,n,e){var r=e("83ab"),o=e("d1e7"),c=e("5c6c"),i=e("fc6a"),f=e("c04e"),u=e("5135"),a=e("0cfb"),s=Object.getOwnPropertyDescriptor;n.f=r?s:function(t,n){if(t=i(t),n=f(n,!0),a)try{return s(t,n)}catch(e){}if(u(t,n))return c(!o.f.call(t,n),t[n])}},"0cfb":function(t,n,e){var r=e("83ab"),o=e("d039"),c=e("cc12");t.exports=!r&&!o((function(){return 7!=Object.defineProperty(c("div"),"a",{get:function(){return 7}}).a}))},"159b":function(t,n,e){var r=e("da84"),o=e("fdbc"),c=e("17c2"),i=e("9112");for(var f in o){var u=r[f],a=u&&u.prototype;if(a&&a.forEach!==c)try{i(a,"forEach",c)}catch(s){a.forEach=c}}},"17c2":function(t,n,e){"use strict";var r=e("b727").forEach,o=e("b301");t.exports=o("forEach")?function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}:[].forEach},"1be4":function(t,n,e){var r=e("d066");t.exports=r("document","documentElement")},"1c0b":function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(String(t)+" is not a function");return t}},"1d80":function(t,n){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on "+t);return t}},"1dde":function(t,n,e){var r=e("d039"),o=e("b622"),c=e("60ae"),i=o("species");t.exports=function(t){return c>=51||!r((function(){var n=[],e=n.constructor={};return e[i]=function(){return{foo:1}},1!==n[t](Boolean).foo}))}},"23cb":function(t,n,e){var r=e("a691"),o=Math.max,c=Math.min;t.exports=function(t,n){var e=r(t);return e<0?o(e+n,0):c(e,n)}},"23e7":function(t,n,e){var r=e("da84"),o=e("06cf").f,c=e("9112"),i=e("6eeb"),f=e("ce4e"),u=e("e893"),a=e("94ca");t.exports=function(t,n){var e,s,l,p,d,b,v=t.target,y=t.global,h=t.stat;if(s=y?r:h?r[v]||f(v,{}):(r[v]||{}).prototype,s)for(l in n){if(d=n[l],t.noTargetGet?(b=o(s,l),p=b&&b.value):p=s[l],e=a(y?l:v+(h?".":"#")+l,t.forced),!e&&void 0!==p){if(typeof d===typeof p)continue;u(d,p)}(t.sham||p&&p.sham)&&c(d,"sham",!0),i(s,l,d,t)}}},"241c":function(t,n,e){var r=e("ca84"),o=e("7839"),c=o.concat("length","prototype");n.f=Object.getOwnPropertyNames||function(t){return r(t,c)}},"37e8":function(t,n,e){var r=e("83ab"),o=e("9bf2"),c=e("825a"),i=e("df75");t.exports=r?Object.defineProperties:function(t,n){c(t);var e,r=i(n),f=r.length,u=0;while(f>u)o.f(t,e=r[u++],n[e]);return t}},"428f":function(t,n,e){var r=e("da84");t.exports=r},"44ad":function(t,n,e){var r=e("d039"),o=e("c6b6"),c="".split;t.exports=r((function(){return!Object("z").propertyIsEnumerable(0)}))?function(t){return"String"==o(t)?c.call(t,""):Object(t)}:Object},4930:function(t,n,e){var r=e("d039");t.exports=!!Object.getOwnPropertySymbols&&!r((function(){return!String(Symbol())}))},"4d64":function(t,n,e){var r=e("fc6a"),o=e("50c4"),c=e("23cb"),i=function(t){return function(n,e,i){var f,u=r(n),a=o(u.length),s=c(i,a);if(t&&e!=e){while(a>s)if(f=u[s++],f!=f)return!0}else for(;a>s;s++)if((t||s in u)&&u[s]===e)return t||s||0;return!t&&-1}};t.exports={includes:i(!0),indexOf:i(!1)}},"4de4":function(t,n,e){"use strict";var r=e("23e7"),o=e("b727").filter,c=e("d039"),i=e("1dde"),f=i("filter"),u=f&&!c((function(){[].filter.call({length:-1,0:1},(function(t){throw t}))}));r({target:"Array",proto:!0,forced:!f||!u},{filter:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}})},"50c4":function(t,n,e){var r=e("a691"),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},5135:function(t,n){var e={}.hasOwnProperty;t.exports=function(t,n){return e.call(t,n)}},5692:function(t,n,e){var r=e("c430"),o=e("c6cd");(t.exports=function(t,n){return o[t]||(o[t]=void 0!==n?n:{})})("versions",[]).push({version:"3.6.1",mode:r?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},"56ef":function(t,n,e){var r=e("d066"),o=e("241c"),c=e("7418"),i=e("825a");t.exports=r("Reflect","ownKeys")||function(t){var n=o.f(i(t)),e=c.f;return e?n.concat(e(t)):n}},"5c6c":function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},"60ae":function(t,n,e){var r,o,c=e("da84"),i=e("b39a"),f=c.process,u=f&&f.versions,a=u&&u.v8;a?(r=a.split("."),o=r[0]+r[1]):i&&(r=i.match(/Edge\/(\d+)/),(!r||r[1]>=74)&&(r=i.match(/Chrome\/(\d+)/),r&&(o=r[1]))),t.exports=o&&+o},"65f0":function(t,n,e){var r=e("861d"),o=e("e8b5"),c=e("b622"),i=c("species");t.exports=function(t,n){var e;return o(t)&&(e=t.constructor,"function"!=typeof e||e!==Array&&!o(e.prototype)?r(e)&&(e=e[i],null===e&&(e=void 0)):e=void 0),new(void 0===e?Array:e)(0===n?0:n)}},"69f3":function(t,n,e){var r,o,c,i=e("7f9a"),f=e("da84"),u=e("861d"),a=e("9112"),s=e("5135"),l=e("f772"),p=e("d012"),d=f.WeakMap,b=function(t){return c(t)?o(t):r(t,{})},v=function(t){return function(n){var e;if(!u(n)||(e=o(n)).type!==t)throw TypeError("Incompatible receiver, "+t+" required");return e}};if(i){var y=new d,h=y.get,g=y.has,m=y.set;r=function(t,n){return m.call(y,t,n),n},o=function(t){return h.call(y,t)||{}},c=function(t){return g.call(y,t)}}else{var x=l("state");p[x]=!0,r=function(t,n){return a(t,x,n),n},o=function(t){return s(t,x)?t[x]:{}},c=function(t){return s(t,x)}}t.exports={set:r,get:o,has:c,enforce:b,getterFor:v}},"6eeb":function(t,n,e){var r=e("da84"),o=e("9112"),c=e("5135"),i=e("ce4e"),f=e("8925"),u=e("69f3"),a=u.get,s=u.enforce,l=String(String).split("String");(t.exports=function(t,n,e,f){var u=!!f&&!!f.unsafe,a=!!f&&!!f.enumerable,p=!!f&&!!f.noTargetGet;"function"==typeof e&&("string"!=typeof n||c(e,"name")||o(e,"name",n),s(e).source=l.join("string"==typeof n?n:"")),t!==r?(u?!p&&t[n]&&(a=!0):delete t[n],a?t[n]=e:o(t,n,e)):a?t[n]=e:i(n,e)})(Function.prototype,"toString",(function(){return"function"==typeof this&&a(this).source||f(this)}))},7418:function(t,n){n.f=Object.getOwnPropertySymbols},"746f":function(t,n,e){var r=e("428f"),o=e("5135"),c=e("c032"),i=e("9bf2").f;t.exports=function(t){var n=r.Symbol||(r.Symbol={});o(n,t)||i(n,t,{value:c.f(t)})}},7839:function(t,n){t.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]},"7b0b":function(t,n,e){var r=e("1d80");t.exports=function(t){return Object(r(t))}},"7c73":function(t,n,e){var r,o=e("825a"),c=e("37e8"),i=e("7839"),f=e("d012"),u=e("1be4"),a=e("cc12"),s=e("f772"),l=">",p="<",d="prototype",b="script",v=s("IE_PROTO"),y=function(){},h=function(t){return p+b+l+t+p+"/"+b+l},g=function(t){t.write(h("")),t.close();var n=t.parentWindow.Object;return t=null,n},m=function(){var t,n=a("iframe"),e="java"+b+":";return n.style.display="none",u.appendChild(n),n.src=String(e),t=n.contentWindow.document,t.open(),t.write(h("document.F=Object")),t.close(),t.F},x=function(){try{r=document.domain&&new ActiveXObject("htmlfile")}catch(n){}x=r?g(r):m();var t=i.length;while(t--)delete x[d][i[t]];return x()};f[v]=!0,t.exports=Object.create||function(t,n){var e;return null!==t?(y[d]=o(t),e=new y,y[d]=null,e[v]=t):e=x(),void 0===n?e:c(e,n)}},"7f9a":function(t,n,e){var r=e("da84"),o=e("8925"),c=r.WeakMap;t.exports="function"===typeof c&&/native code/.test(o(c))},"825a":function(t,n,e){var r=e("861d");t.exports=function(t){if(!r(t))throw TypeError(String(t)+" is not an object");return t}},"83ab":function(t,n,e){var r=e("d039");t.exports=!r((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))},8418:function(t,n,e){"use strict";var r=e("c04e"),o=e("9bf2"),c=e("5c6c");t.exports=function(t,n,e){var i=r(n);i in t?o.f(t,i,c(0,e)):t[i]=e}},"861d":function(t,n){t.exports=function(t){return"object"===typeof t?null!==t:"function"===typeof t}},8925:function(t,n,e){var r=e("c6cd"),o=Function.toString;"function"!=typeof r.inspectSource&&(r.inspectSource=function(t){return o.call(t)}),t.exports=r.inspectSource},"8bbf":function(n,e){n.exports=t},"90e3":function(t,n){var e=0,r=Math.random();t.exports=function(t){return"Symbol("+String(void 0===t?"":t)+")_"+(++e+r).toString(36)}},9112:function(t,n,e){var r=e("83ab"),o=e("9bf2"),c=e("5c6c");t.exports=r?function(t,n,e){return o.f(t,n,c(1,e))}:function(t,n,e){return t[n]=e,t}},"94ca":function(t,n,e){var r=e("d039"),o=/#|\.prototype\./,c=function(t,n){var e=f[i(t)];return e==a||e!=u&&("function"==typeof n?r(n):!!n)},i=c.normalize=function(t){return String(t).replace(o,".").toLowerCase()},f=c.data={},u=c.NATIVE="N",a=c.POLYFILL="P";t.exports=c},"9bf2":function(t,n,e){var r=e("83ab"),o=e("0cfb"),c=e("825a"),i=e("c04e"),f=Object.defineProperty;n.f=r?f:function(t,n,e){if(c(t),n=i(n,!0),c(e),o)try{return f(t,n,e)}catch(r){}if("get"in e||"set"in e)throw TypeError("Accessors not supported");return"value"in e&&(t[n]=e.value),t}},a4d3:function(t,n,e){"use strict";var r=e("23e7"),o=e("da84"),c=e("d066"),i=e("c430"),f=e("83ab"),u=e("4930"),a=e("fdbf"),s=e("d039"),l=e("5135"),p=e("e8b5"),d=e("861d"),b=e("825a"),v=e("7b0b"),y=e("fc6a"),h=e("c04e"),g=e("5c6c"),m=e("7c73"),x=e("df75"),O=e("241c"),S=e("057f"),w=e("7418"),j=e("06cf"),P=e("9bf2"),E=e("d1e7"),T=e("9112"),_=e("6eeb"),L=e("5692"),M=e("f772"),C=e("d012"),N=e("90e3"),k=e("b622"),D=e("c032"),F=e("746f"),V=e("d44e"),A=e("69f3"),I=e("b727").forEach,R=M("hidden"),$="Symbol",G="prototype",z=k("toPrimitive"),H=A.set,W=A.getterFor($),q=Object[G],B=o.Symbol,U=c("JSON","stringify"),X=j.f,J=P.f,K=S.f,Q=E.f,Y=L("symbols"),Z=L("op-symbols"),tt=L("string-to-symbol-registry"),nt=L("symbol-to-string-registry"),et=L("wks"),rt=o.QObject,ot=!rt||!rt[G]||!rt[G].findChild,ct=f&&s((function(){return 7!=m(J({},"a",{get:function(){return J(this,"a",{value:7}).a}})).a}))?function(t,n,e){var r=X(q,n);r&&delete q[n],J(t,n,e),r&&t!==q&&J(q,n,r)}:J,it=function(t,n){var e=Y[t]=m(B[G]);return H(e,{type:$,tag:t,description:n}),f||(e.description=n),e},ft=a?function(t){return"symbol"==typeof t}:function(t){return Object(t)instanceof B},ut=function(t,n,e){t===q&&ut(Z,n,e),b(t);var r=h(n,!0);return b(e),l(Y,r)?(e.enumerable?(l(t,R)&&t[R][r]&&(t[R][r]=!1),e=m(e,{enumerable:g(0,!1)})):(l(t,R)||J(t,R,g(1,{})),t[R][r]=!0),ct(t,r,e)):J(t,r,e)},at=function(t,n){b(t);var e=y(n),r=x(e).concat(bt(e));return I(r,(function(n){f&&!lt.call(e,n)||ut(t,n,e[n])})),t},st=function(t,n){return void 0===n?m(t):at(m(t),n)},lt=function(t){var n=h(t,!0),e=Q.call(this,n);return!(this===q&&l(Y,n)&&!l(Z,n))&&(!(e||!l(this,n)||!l(Y,n)||l(this,R)&&this[R][n])||e)},pt=function(t,n){var e=y(t),r=h(n,!0);if(e!==q||!l(Y,r)||l(Z,r)){var o=X(e,r);return!o||!l(Y,r)||l(e,R)&&e[R][r]||(o.enumerable=!0),o}},dt=function(t){var n=K(y(t)),e=[];return I(n,(function(t){l(Y,t)||l(C,t)||e.push(t)})),e},bt=function(t){var n=t===q,e=K(n?Z:y(t)),r=[];return I(e,(function(t){!l(Y,t)||n&&!l(q,t)||r.push(Y[t])})),r};if(u||(B=function(){if(this instanceof B)throw TypeError("Symbol is not a constructor");var t=arguments.length&&void 0!==arguments[0]?String(arguments[0]):void 0,n=N(t),e=function(t){this===q&&e.call(Z,t),l(this,R)&&l(this[R],n)&&(this[R][n]=!1),ct(this,n,g(1,t))};return f&&ot&&ct(q,n,{configurable:!0,set:e}),it(n,t)},_(B[G],"toString",(function(){return W(this).tag})),_(B,"withoutSetter",(function(t){return it(N(t),t)})),E.f=lt,P.f=ut,j.f=pt,O.f=S.f=dt,w.f=bt,D.f=function(t){return it(k(t),t)},f&&(J(B[G],"description",{configurable:!0,get:function(){return W(this).description}}),i||_(q,"propertyIsEnumerable",lt,{unsafe:!0}))),r({global:!0,wrap:!0,forced:!u,sham:!u},{Symbol:B}),I(x(et),(function(t){F(t)})),r({target:$,stat:!0,forced:!u},{for:function(t){var n=String(t);if(l(tt,n))return tt[n];var e=B(n);return tt[n]=e,nt[e]=n,e},keyFor:function(t){if(!ft(t))throw TypeError(t+" is not a symbol");if(l(nt,t))return nt[t]},useSetter:function(){ot=!0},useSimple:function(){ot=!1}}),r({target:"Object",stat:!0,forced:!u,sham:!f},{create:st,defineProperty:ut,defineProperties:at,getOwnPropertyDescriptor:pt}),r({target:"Object",stat:!0,forced:!u},{getOwnPropertyNames:dt,getOwnPropertySymbols:bt}),r({target:"Object",stat:!0,forced:s((function(){w.f(1)}))},{getOwnPropertySymbols:function(t){return w.f(v(t))}}),U){var vt=!u||s((function(){var t=B();return"[null]"!=U([t])||"{}"!=U({a:t})||"{}"!=U(Object(t))}));r({target:"JSON",stat:!0,forced:vt},{stringify:function(t,n,e){var r,o=[t],c=1;while(arguments.length>c)o.push(arguments[c++]);if(r=n,(d(n)||void 0!==t)&&!ft(t))return p(n)||(n=function(t,n){if("function"==typeof r&&(n=r.call(this,t,n)),!ft(n))return n}),o[1]=n,U.apply(null,o)}})}B[G][z]||T(B[G],z,B[G].valueOf),V(B,$),C[R]=!0},a691:function(t,n){var e=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:e)(t)}},b0c0:function(t,n,e){var r=e("83ab"),o=e("9bf2").f,c=Function.prototype,i=c.toString,f=/^\s*function ([^ (]*)/,u="name";!r||u in c||o(c,u,{configurable:!0,get:function(){try{return i.call(this).match(f)[1]}catch(t){return""}}})},b301:function(t,n,e){"use strict";var r=e("d039");t.exports=function(t,n){var e=[][t];return!e||!r((function(){e.call(null,n||function(){throw 1},1)}))}},b39a:function(t,n,e){var r=e("d066");t.exports=r("navigator","userAgent")||""},b622:function(t,n,e){var r=e("da84"),o=e("5692"),c=e("5135"),i=e("90e3"),f=e("4930"),u=e("fdbf"),a=o("wks"),s=r.Symbol,l=u?s:s&&s.withoutSetter||i;t.exports=function(t){return c(a,t)||(f&&c(s,t)?a[t]=s[t]:a[t]=l("Symbol."+t)),a[t]}},b64b:function(t,n,e){var r=e("23e7"),o=e("7b0b"),c=e("df75"),i=e("d039"),f=i((function(){c(1)}));r({target:"Object",stat:!0,forced:f},{keys:function(t){return c(o(t))}})},b727:function(t,n,e){var r=e("f8c2"),o=e("44ad"),c=e("7b0b"),i=e("50c4"),f=e("65f0"),u=[].push,a=function(t){var n=1==t,e=2==t,a=3==t,s=4==t,l=6==t,p=5==t||l;return function(d,b,v,y){for(var h,g,m=c(d),x=o(m),O=r(b,v,3),S=i(x.length),w=0,j=y||f,P=n?j(d,S):e?j(d,0):void 0;S>w;w++)if((p||w in x)&&(h=x[w],g=O(h,w,m),t))if(n)P[w]=g;else if(g)switch(t){case 3:return!0;case 5:return h;case 6:return w;case 2:u.call(P,h)}else if(s)return!1;return l?-1:a||s?s:P}};t.exports={forEach:a(0),map:a(1),filter:a(2),some:a(3),every:a(4),find:a(5),findIndex:a(6)}},c032:function(t,n,e){var r=e("b622");n.f=r},c04e:function(t,n,e){var r=e("861d");t.exports=function(t,n){if(!r(t))return t;var e,o;if(n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;if("function"==typeof(e=t.valueOf)&&!r(o=e.call(t)))return o;if(!n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},c430:function(t,n){t.exports=!1},c6b6:function(t,n){var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},c6cd:function(t,n,e){var r=e("da84"),o=e("ce4e"),c="__core-js_shared__",i=r[c]||o(c,{});t.exports=i},c8ba:function(t,n){var e;e=function(){return this}();try{e=e||new Function("return this")()}catch(r){"object"===typeof window&&(e=window)}t.exports=e},ca84:function(t,n,e){var r=e("5135"),o=e("fc6a"),c=e("4d64").indexOf,i=e("d012");t.exports=function(t,n){var e,f=o(t),u=0,a=[];for(e in f)!r(i,e)&&r(f,e)&&a.push(e);while(n.length>u)r(f,e=n[u++])&&(~c(a,e)||a.push(e));return a}},cc12:function(t,n,e){var r=e("da84"),o=e("861d"),c=r.document,i=o(c)&&o(c.createElement);t.exports=function(t){return i?c.createElement(t):{}}},ce4e:function(t,n,e){var r=e("da84"),o=e("9112");t.exports=function(t,n){try{o(r,t,n)}catch(e){r[t]=n}return n}},d012:function(t,n){t.exports={}},d039:function(t,n){t.exports=function(t){try{return!!t()}catch(n){return!0}}},d066:function(t,n,e){var r=e("428f"),o=e("da84"),c=function(t){return"function"==typeof t?t:void 0};t.exports=function(t,n){return arguments.length<2?c(r[t])||c(o[t]):r[t]&&r[t][n]||o[t]&&o[t][n]}},d1e7:function(t,n,e){"use strict";var r={}.propertyIsEnumerable,o=Object.getOwnPropertyDescriptor,c=o&&!r.call({1:2},1);n.f=c?function(t){var n=o(this,t);return!!n&&n.enumerable}:r},d44e:function(t,n,e){var r=e("9bf2").f,o=e("5135"),c=e("b622"),i=c("toStringTag");t.exports=function(t,n,e){t&&!o(t=e?t:t.prototype,i)&&r(t,i,{configurable:!0,value:n})}},da84:function(t,n,e){(function(n){var e=function(t){return t&&t.Math==Math&&t};t.exports=e("object"==typeof globalThis&&globalThis)||e("object"==typeof window&&window)||e("object"==typeof self&&self)||e("object"==typeof n&&n)||Function("return this")()}).call(this,e("c8ba"))},dbb4:function(t,n,e){var r=e("23e7"),o=e("83ab"),c=e("56ef"),i=e("fc6a"),f=e("06cf"),u=e("8418");r({target:"Object",stat:!0,sham:!o},{getOwnPropertyDescriptors:function(t){var n,e,r=i(t),o=f.f,a=c(r),s={},l=0;while(a.length>l)e=o(r,n=a[l++]),void 0!==e&&u(s,n,e);return s}})},df75:function(t,n,e){var r=e("ca84"),o=e("7839");t.exports=Object.keys||function(t){return r(t,o)}},e439:function(t,n,e){var r=e("23e7"),o=e("d039"),c=e("fc6a"),i=e("06cf").f,f=e("83ab"),u=o((function(){i(1)})),a=!f||u;r({target:"Object",stat:!0,forced:a,sham:!f},{getOwnPropertyDescriptor:function(t,n){return i(c(t),n)}})},e893:function(t,n,e){var r=e("5135"),o=e("56ef"),c=e("06cf"),i=e("9bf2");t.exports=function(t,n){for(var e=o(n),f=i.f,u=c.f,a=0;a<e.length;a++){var s=e[a];r(t,s)||f(t,s,u(n,s))}}},e8b5:function(t,n,e){var r=e("c6b6");t.exports=Array.isArray||function(t){return"Array"==r(t)}},f6fd:function(t,n){(function(t){var n="currentScript",e=t.getElementsByTagName("script");n in t||Object.defineProperty(t,n,{get:function(){try{throw new Error}catch(r){var t,n=(/.*at [^\(]*\((.*):.+:.+\)$/gi.exec(r.stack)||[!1])[1];for(t in e)if(e[t].src==n||"interactive"==e[t].readyState)return e[t];return null}}})})(document)},f772:function(t,n,e){var r=e("5692"),o=e("90e3"),c=r("keys");t.exports=function(t){return c[t]||(c[t]=o(t))}},f8c2:function(t,n,e){var r=e("1c0b");t.exports=function(t,n,e){if(r(t),void 0===n)return t;switch(e){case 0:return function(){return t.call(n)};case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,o){return t.call(n,e,r,o)}}return function(){return t.apply(n,arguments)}}},fb15:function(t,n,e){"use strict";var r;(e.r(n),"undefined"!==typeof window)&&(e("f6fd"),(r=window.document.currentScript)&&(r=r.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))&&(e.p=r[1]));e("a4d3"),e("4de4"),e("b0c0"),e("e439"),e("dbb4"),e("b64b"),e("159b");function o(t,n,e){return n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}var c=e("8bbf"),i=e.n(c),f=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"basic-rich",domProps:{innerHTML:t._s(t.content)}})},u=[],a={name:"basic-rich",props:{content:String}},s=a;function l(t,n,e,r,o,c,i,f){var u,a="function"===typeof t?t.options:t;if(n&&(a.render=n,a.staticRenderFns=e,a._compiled=!0),r&&(a.functional=!0),c&&(a._scopeId="data-v-"+c),i?(u=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,t||"undefined"===typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),o&&o.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(i)},a._ssrRegister=u):o&&(u=f?function(){o.call(this,this.$root.$options.shadowRoot)}:o),u)if(a.functional){a._injectStyles=u;var s=a.render;a.render=function(t,n){return u.call(n),s(t,n)}}else{var l=a.beforeCreate;a.beforeCreate=l?[].concat(l,u):[u]}return{exports:t,options:a}}var p=l(s,f,u,!1,null,null,null),d=p.exports,b={id:2,version:"0.0.1",cover:"",className:"",createdUser:{id:0,name:"jmingzi"},events:[],style:{width:"100%",height:"60px",positionType:"absolute",position:{},margin:{},padding:{},zIndex:0,code:"(function () {\n  return {\n  }\n})()"},children:[],show:!0,outDocFlow:!1};function v(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable}))),e.push.apply(e,r)}return e}function y(t){for(var n=1;n<arguments.length;n++){var e=null!=arguments[n]?arguments[n]:{};n%2?v(Object(e),!0).forEach((function(n){o(t,n,e[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):v(Object(e)).forEach((function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}))}return t}i.a.component(d.name,d);var h=y({componentName:d.name,title:"富文本",type:"rich-text"},b,{style:y({},b.style,{height:"100px"}),props:{content:"富文本"}}),g=[{type:"rich-text",label:"文本内容",block:!0,field:"props.content"}];e.d(n,"schema",(function(){return g}));n["default"]=h},fc6a:function(t,n,e){var r=e("44ad"),o=e("1d80");t.exports=function(t){return r(o(t))}},fdbc:function(t,n){t.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}},fdbf:function(t,n,e){var r=e("4930");t.exports=r&&!Symbol.sham&&"symbol"==typeof Symbol.iterator}})}));
//# sourceMappingURL=bf-rich-text.umd.min.js.map
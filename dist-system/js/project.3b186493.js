(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["project"],{"0e20":function(t,e,n){},3400:function(t,e,n){"use strict";var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"header-opt height-100 flex-center-between plr20"},[n("div",{staticClass:"flex items-center cp",on:{click:function(e){return t.$router.push("/")}}},[n("span",{staticClass:"f32 c-fff"},[t._v("Butterfly")]),t._m(0)]),n("div",{staticClass:"flex"},[t._l(t.opts||t.localOpts,(function(e,r){return[n("div",{key:e.label,staticClass:"plr15"},[n("el-button",{attrs:{type:"text"},on:{click:function(t){return e.action()}}},[n("span",{staticClass:"flex-center flex-column"},[n("div",{staticStyle:{height:"20px"}},[n("i",{class:e.icon})]),t._v(" "+t._s(e.label)+" ")])])],1),n("div",{key:r,staticClass:"h30 bg-666 mt10",staticStyle:{width:"2px"}})]})),n("div",{staticClass:"avatar flex-center c-aaa ml20"},[n("div",{staticClass:"avatar-img relative c-fff flex-center",attrs:{"overflow-h":""}},[t._v(" "+t._s(t.name.substr(-2))+" "),t._e()]),t._e()])],2)])},i=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"ml10"},[n("img",{attrs:{height:"14px",src:"https://img.shields.io/badge/-beta 0.0.1-lightgrey",alt:""}}),n("p",{staticClass:"c-aaa"},[t._v("快速搭建h5")])])}],a=(n("a4d3"),n("99af"),n("4de4"),n("b0c0"),n("e439"),n("dbb4"),n("b64b"),n("159b"),n("ade3")),s=(n("96cf"),n("1da1")),o=n("8bbf"),c=n.n(o),u=n("8165"),l=n("537d"),f=n("4097"),d=n("5f72"),h=n("7f5d");function p(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function b(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?p(Object(n),!0).forEach((function(e){Object(a["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var m=Object(u["defineComponent"])({props:{opts:Array},setup:function(){var t=c.a.prototype.$native,e=Object(u["ref"])("//filesystem.api.jituancaiyun.net/sfs/avatar?uid="+t.uid),n=[{label:"导入项目",icon:"el-icon-upload f16",action:function(){var t=Object(s["a"])(regeneratorRuntime.mark((function t(){var e,n,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,d["MessageBox"].prompt("请输入项目英文名称");case 2:if(e=t.sent,n=e.value,n){t.next=6;break}return t.abrupt("return",d["Message"].error("名称不能为空"));case 6:return t.next=8,h["a"].get("project/get",{dir:n});case 8:return r=t.sent,t.next=11,Object(l["c"])(r.data.project);case 11:d["Message"].success("导入成功");case 12:case"end":return t.stop()}}),t)})));function e(){return t.apply(this,arguments)}return e}()},{label:"同步组件到cdn",icon:"el-icon-refresh-right f16",action:function(){}},{label:"下载项目",icon:"el-icon-download f16",action:function(){}},{label:"发布项目",icon:"el-icon-position f16",action:function(){}},{label:"保存项目",icon:"iconfont icon-save",action:function(){var t=Object(s["a"])(regeneratorRuntime.mark((function t(){var e,n,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(l["d"].dir){t.next=2;break}return t.abrupt("return",d["Message"].error("请输入英文名 dir"));case 2:return t.next=4,d["MessageBox"].prompt("请输入改动描述");case 4:if(e=t.sent,n=e.value,n&&!(n.length<5)){t.next=8;break}return t.abrupt("return",d["Message"].error("描述至少5个字"));case 8:return r=function t(e){return h["a"].post("project/save",{dir:l["d"].dir,force:e,project:b({},l["d"],{info:{userName:c.a.prototype.$native.name,remark:n,time:Date.now()}})},{codeCallback:{6001:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,d["MessageBox"].confirm("项目已存在，确认覆盖？");case 2:return e.next=4,t(!0);case 4:d["Message"].success("保存成功");case 5:case"end":return e.stop()}}),e)})));function n(){return e.apply(this,arguments)}return n}()}})},t.next=11,r();case 11:d["Message"].success("保存成功");case 12:case"end":return t.stop()}}),t)})));function e(){return t.apply(this,arguments)}return e}()},{label:"保存本地",icon:"el-icon-finished f16",action:function(){Object(l["b"])(),d["Message"].success("保存成功")}},{label:"预览页面",icon:"el-icon-document-remove f16",action:function(){f["b"].value?window.open("http://api.jituancaiyun.net/butterfly/render.html"+"#/page/".concat(l["d"].dir,"/").concat(f["b"].value.id)):d["Message"].info("请选中一个页面")}},{label:"预览项目",icon:"el-icon-folder-opened f16",action:function(){window.open("http://api.jituancaiyun.net/butterfly/render.html"+"#/project/".concat(l["d"].dir))}}];return{localOpts:n,avatar:e,name:t.name}}}),v=m,y=(n("bde8"),n("2877")),g=Object(y["a"])(v,r,i,!1,null,null,null);e["a"]=g.exports},"42ae":function(t,e,n){},"7f5d":function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));n("cc4a");var r=n("38bf"),i=n.n(r),a=n("5f72"),s={self:null,open:function(){this.self||(this.self=a["Loading"].service({background:"transparent"}))},close:function(){this.self&&(this.self.close(),this.self=null)}},o=new i.a({baseUrl:"http://api.jituancaiyun.net",urlMap:{component:{list:"/butterfly/component/:type",update:"/butterfly/component/:type",export:"/butterfly/component/export/:type",download:"/butterfly/component/download/:type"},project:{save:"/butterfly/project/:dir",get:"/butterfly/project/:dir"},delete:"/butterfly/delete/:type/:dir"},notify:a["Message"],loadingMethods:s,contentType:"application/json"})},"83b7":function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"project-list__wrap height-100"},[n("div",{staticClass:"app-header"},[n("header-opt",{attrs:{opts:t.opts}})],1),n("div",{staticClass:"project-list"},[n("el-table",{staticStyle:{width:"100%"},attrs:{data:t.tableData,border:""}},[n("el-table-column",{attrs:{prop:"dir",label:"项目",width:"120"}}),n("el-table-column",{attrs:{prop:"desc",label:"描述"}}),n("el-table-column",{attrs:{prop:"createUser",label:"创建人",width:"60"}}),n("el-table-column",{attrs:{prop:"info.userName",label:"修改人",width:"60"}}),n("el-table-column",{attrs:{prop:"info.time",label:"修改时间",width:"130"}}),n("el-table-column",{attrs:{prop:"info.remark",label:"修改备注"}}),n("el-table-column",{attrs:{fixed:"right",label:"操作",width:"130"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-button",{attrs:{type:"text",size:"small"},on:{click:function(n){return t.handlePreview(e.row)}}},[t._v("查看")]),t.hasPriv(e.row)?[n("el-button",{attrs:{type:"text",size:"small"},on:{click:function(n){return t.handleDel(e.row)}}},[t._v("删除")]),n("el-button",{attrs:{type:"text",size:"small"},on:{click:function(n){return t.$router.push("/editor/"+e.row.dir)}}},[t._v("编辑")])]:t._e()]}}])})],1)],1)])},i=[],a=(n("a4d3"),n("4de4"),n("c740"),n("c975"),n("d81d"),n("a434"),n("b0c0"),n("e439"),n("dbb4"),n("b64b"),n("159b"),n("96cf"),n("1da1")),s=n("ade3"),o=n("3400"),c=n("7f5d"),u=n("5f72"),l=n("a186"),f=n.n(l);function d(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function h(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?d(Object(n),!0).forEach((function(e){Object(s["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var p={components:{HeaderOpt:o["a"]},data:function(){var t=this;return{opts:[{label:"关于",icon:"el-icon-s-flag f16",action:function(){t.$router.push("/")}},{label:"教程",icon:"el-icon-question f16",action:function(){t.$router.push("/tourism")}},{label:"创建项目",icon:"el-icon-plus f16",action:function(){t.$router.push("/editor")}}],tableData:[]}},created:function(){var t=this;c["a"].get("component/list",{type:"project"}).then((function(e){t.tableData=e.data.map((function(t){return h({},t,{info:h({},t.info||{},{time:t.info.time?f()(t.info.time).format("YYYY/MM/DD HH:mm"):"-"})})}))}))},methods:{hasPriv:function(t){return t.createUser===this.$native.name||(t.info.whitelist||"").indexOf(this.$native.name)>-1},handlePreview:function(t){window.open("http://api.jituancaiyun.net/butterfly/render.html"+"#/project/".concat(t.dir))},handleDel:function(){var t=Object(a["a"])(regeneratorRuntime.mark((function t(e){var n,r=this;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,u["MessageBox"].confirm("确认删除吗？");case 2:n=this.tableData.findIndex((function(t){return t.dir===e.dir})),c["a"].post("delete",{type:"project",dir:e.dir},{successMessage:"删除成功"}).then((function(){r.tableData.splice(n,1)}));case 4:case"end":return t.stop()}}),t,this)})));function e(e){return t.apply(this,arguments)}return e}()}},b=p,m=(n("d779"),n("2877")),v=Object(m["a"])(b,r,i,!1,null,null,null);e["default"]=v.exports},a186:function(t,e,n){!function(e,n){t.exports=n()}(0,(function(){"use strict";var t="millisecond",e="second",n="minute",r="hour",i="day",a="week",s="month",o="quarter",c="year",u=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,l=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,f=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},d={s:f,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+f(r,2,"0")+":"+f(i,2,"0")},m:function(t,e){var n=12*(e.year()-t.year())+(e.month()-t.month()),r=t.clone().add(n,s),i=e-r<0,a=t.clone().add(n+(i?-1:1),s);return Number(-(n+(e-r)/(i?r-a:a-r))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(u){return{M:s,y:c,w:a,d:i,D:"date",h:r,m:n,s:e,ms:t,Q:o}[u]||String(u||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},h={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},p="en",b={};b[p]=h;var m=function(t){return t instanceof $},v=function(t,e,n){var r;if(!t)return p;if("string"==typeof t)b[t]&&(r=t),e&&(b[t]=e,r=t);else{var i=t.name;b[i]=t,r=i}return!n&&r&&(p=r),r||!n&&p},y=function(t,e,n){if(m(t))return t.clone();var r=e?"string"==typeof e?{format:e,pl:n}:e:{};return r.date=t,new $(r)},g=d;g.l=v,g.i=m,g.w=function(t,e){return y(t,{locale:e.$L,utc:e.$u,$offset:e.$offset})};var $=function(){function f(t){this.$L=this.$L||v(t.locale,null,!0),this.parse(t)}var d=f.prototype;return d.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(g.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(u);if(r)return n?new Date(Date.UTC(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)):new Date(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)}return new Date(e)}(t),this.init()},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},d.$utils=function(){return g},d.isValid=function(){return!("Invalid Date"===this.$d.toString())},d.isSame=function(t,e){var n=y(t);return this.startOf(e)<=n&&n<=this.endOf(e)},d.isAfter=function(t,e){return y(t)<this.startOf(e)},d.isBefore=function(t,e){return this.endOf(e)<y(t)},d.$g=function(t,e,n){return g.u(t)?this[e]:this.set(n,t)},d.year=function(t){return this.$g(t,"$y",c)},d.month=function(t){return this.$g(t,"$M",s)},d.day=function(t){return this.$g(t,"$W",i)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",r)},d.minute=function(t){return this.$g(t,"$m",n)},d.second=function(t){return this.$g(t,"$s",e)},d.millisecond=function(e){return this.$g(e,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,o){var u=this,l=!!g.u(o)||o,f=g.p(t),d=function(t,e){var n=g.w(u.$u?Date.UTC(u.$y,e,t):new Date(u.$y,e,t),u);return l?n:n.endOf(i)},h=function(t,e){return g.w(u.toDate()[t].apply(u.toDate(),(l?[0,0,0,0]:[23,59,59,999]).slice(e)),u)},p=this.$W,b=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(f){case c:return l?d(1,0):d(31,11);case s:return l?d(1,b):d(0,b+1);case a:var y=this.$locale().weekStart||0,$=(p<y?p+7:p)-y;return d(l?m-$:m+(6-$),b);case i:case"date":return h(v+"Hours",0);case r:return h(v+"Minutes",1);case n:return h(v+"Seconds",2);case e:return h(v+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(a,o){var u,l=g.p(a),f="set"+(this.$u?"UTC":""),d=(u={},u[i]=f+"Date",u.date=f+"Date",u[s]=f+"Month",u[c]=f+"FullYear",u[r]=f+"Hours",u[n]=f+"Minutes",u[e]=f+"Seconds",u[t]=f+"Milliseconds",u)[l],h=l===i?this.$D+(o-this.$W):o;if(l===s||l===c){var p=this.clone().set("date",1);p.$d[d](h),p.init(),this.$d=p.set("date",Math.min(this.$D,p.daysInMonth())).toDate()}else d&&this.$d[d](h);return this.init(),this},d.set=function(t,e){return this.clone().$set(t,e)},d.get=function(t){return this[g.p(t)]()},d.add=function(t,o){var u,l=this;t=Number(t);var f=g.p(o),d=function(e){var n=y(l);return g.w(n.date(n.date()+Math.round(e*t)),l)};if(f===s)return this.set(s,this.$M+t);if(f===c)return this.set(c,this.$y+t);if(f===i)return d(1);if(f===a)return d(7);var h=(u={},u[n]=6e4,u[r]=36e5,u[e]=1e3,u)[f]||1,p=this.$d.getTime()+t*h;return g.w(p,this)},d.subtract=function(t,e){return this.add(-1*t,e)},d.format=function(t){var e=this;if(!this.isValid())return"Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",r=g.z(this),i=this.$locale(),a=this.$H,s=this.$m,o=this.$M,c=i.weekdays,u=i.months,f=function(t,r,i,a){return t&&(t[r]||t(e,n))||i[r].substr(0,a)},d=function(t){return g.s(a%12||12,t,"0")},h=i.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},p={YY:String(this.$y).slice(-2),YYYY:this.$y,M:o+1,MM:g.s(o+1,2,"0"),MMM:f(i.monthsShort,o,u,3),MMMM:u[o]||u(this,n),D:this.$D,DD:g.s(this.$D,2,"0"),d:String(this.$W),dd:f(i.weekdaysMin,this.$W,c,2),ddd:f(i.weekdaysShort,this.$W,c,3),dddd:c[this.$W],H:String(a),HH:g.s(a,2,"0"),h:d(1),hh:d(2),a:h(a,s,!0),A:h(a,s,!1),m:String(s),mm:g.s(s,2,"0"),s:String(this.$s),ss:g.s(this.$s,2,"0"),SSS:g.s(this.$ms,3,"0"),Z:r};return n.replace(l,(function(t,e){return e||p[t]||r.replace(":","")}))},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,u,l){var f,d=g.p(u),h=y(t),p=6e4*(h.utcOffset()-this.utcOffset()),b=this-h,m=g.m(this,h);return m=(f={},f[c]=m/12,f[s]=m,f[o]=m/3,f[a]=(b-p)/6048e5,f[i]=(b-p)/864e5,f[r]=b/36e5,f[n]=b/6e4,f[e]=b/1e3,f)[d]||b,l?m:g.a(m)},d.daysInMonth=function(){return this.endOf(s).$D},d.$locale=function(){return b[this.$L]},d.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=v(t,e,!0);return r&&(n.$L=r),n},d.clone=function(){return g.w(this.$d,this)},d.toDate=function(){return new Date(this.valueOf())},d.toJSON=function(){return this.isValid()?this.toISOString():null},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},f}();return y.prototype=$.prototype,y.extend=function(t,e){return t(e,$,y),y},y.locale=v,y.isDayjs=m,y.unix=function(t){return y(1e3*t)},y.en=b[p],y.Ls=b,y}))},bde8:function(t,e,n){"use strict";var r=n("42ae"),i=n.n(r);i.a},c975:function(t,e,n){"use strict";var r=n("23e7"),i=n("4d64").indexOf,a=n("b301"),s=[].indexOf,o=!!s&&1/[1].indexOf(1,-0)<0,c=a("indexOf");r({target:"Array",proto:!0,forced:o||c},{indexOf:function(t){return o?s.apply(this,arguments)||0:i(this,t,arguments.length>1?arguments[1]:void 0)}})},d779:function(t,e,n){"use strict";var r=n("0e20"),i=n.n(r);i.a}}]);
//# sourceMappingURL=project.3b186493.js.map
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Native=t()}(this,function(){"use strict";var e=location.hostname.split("."),t=e[e.length-1],n=/s/.test(location.protocol);function i(e,t){for(var n in a)for(var i in a[n])if(i===e&&a[n][i]===t)return a[n];return{}}var a={jituancaiyun:{allName:"移动彩云",name:"彩云",logo:"https://statics.jituancaiyun.com/activity/images/jtcy/dept.png",logoAbs:"/images/appLogo/jtcy/logo-s.png",slogan:"移动彩云，让工作沟通更便捷",uri:"jituancaiyun",uriPrefix:"",adminPrefix:"",hostName:".jituancaiyun."+t,color:"#de6262",avatar:"//filesystem.api.jituancaiyun."+t+"/sfs/avatar?uid=",orgType:1,downUrl:"//jituancaiyun.com/d",adminUrl:location.protocol+"//admin.jituancaiyun."+t,loginUrl:location.protocol+"//acl.admin.jituancaiyun."+t+"/power/user/view/login.html",userInfoDoUrl:"//note.api.jituancaiyun."+t+"/hta/org/userInfo.do",serviceUrl:location.protocol+"//appadmin.api.jituancaiyun."+t+"/m/index.html#/service?appId=",approveUrl:location.protocol+"//"+(n?"approve.":"")+"api.jituancaiyun."+t+(n?"/approve/caiyun/approve-c":"/approve/1")+"/index.html",expenseUrl:location.protocol+"//"+(n?"approve.":"")+"api.jituancaiyun."+t+(n?"/approve/caiyun":"")+(n?"/expense-new":"/expense/1")+"/index.html",expenseCreateUrl:function(e,t){return t||(t="purchase"),this.expenseUrl+"#/create-expense-entry?approveId="+e+"&type="+t},hasSceneCmsLink:!0,domain:"jituancaiyun"},duanmatong:{allName:"移动办公云",name:"移动办公云",logo:"https://statics.duanmatong.cn/images/appLogo/hnm/logo-s.png",logoAbs:"/images/appLogo/hnm/logo-s.png",slogan:"移动办公更轻松",uri:"duanmatong",uriPrefix:"",adminPrefix:"",hostName:".duanmatong.cn",color:"#2e8ffa",avatar:"//filesystem.api.duanmatong.cn/sfs/avatar?uid=",orgType:6,downUrl:"//duanmatong.cn/d",adminUrl:"https://admin.duanmatong.cn",loginUrl:"//acl.duanmatong.cn/power/user/view/duanmatongLogin.html",userInfoDoUrl:"//note.api.duanmatong.cn/hta/org/userInfo.do",serviceUrl:"https://admin.duanmatong.cn/m/index.html#/service?appId=",approveUrl:"https://approve.api.duanmatong.cn/approve/1/index.html",expenseUrl:"https://approve.api.duanmatong.cn/expense/1/index.html",hasSceneCmsLink:!0,domain:"duanmatong"},henan:{allName:"快马",name:"快马",logo:"https://statics.jituancaiyun.com/activity/images/jtcy/dept.png",logoAbs:"/images/appLogo/jtcy/logo-s.png",slogan:"",uri:"henancaiyun",uriPrefix:"",adminPrefix:"",hostName:"henancaiyun.com",color:"#FF5858",avatar:"//fs.henancaiyun.com/sfs/avatar?uid=",orgType:8,downUrl:"//henancaiyun.com/d",adminUrl:"//admin.henancaiyun.com",loginUrl:"//acl.henancaiyun.com/power/user/view/login.html",userInfoDoUrl:"//note.api.henancaiyun.com/hta/org/userInfo.do",serviceUrl:"https://admin.henancaiyun.com/m/index.html#/service?appId=",approveUrl:"https://api.henancaiyun.com/approve/1/index.html",expenseUrl:"https://api.henancaiyun.com/expense/1/index.html",hasSceneCmsLink:!0},jx:{allName:"智办公",name:"智办公",logo:"https://statics.jituancaiyun.com/activity/images/jtcy/dept.png",logoAbs:"/images/appLogo/jtcy/logo-s.png",slogan:"智办公，更轻松",uri:"zbangong",uriPrefix:"",adminPrefix:"",hostName:"zbangong.cn",color:"#558EEE",avatar:"//fs.zbangong.cn/sfs/avatar?uid=",orgType:9,downUrl:"//download.zbangong.cn",adminUrl:"https://admin.zbangong.cn",loginUrl:"//admin.zbangong.cn/power/user/view/jxLogin.html",userInfoDoUrl:"//api.zbangong.cn/hta/org/userInfo.do",serviceUrl:"https://admin.zbangong.cn/m/index.html#/service?appId=",approveUrl:"https://api.zbangong.cn/approve/1/index.html",expenseUrl:"https://api.zbangong.cn/expense/1/index.html",hasSceneCmsLink:!0,domain:"zbangong.cn"},maizhiyun:{allName:"脉智云",name:"脉智云",logo:"https://statics.jituancaiyun.com/activity/images/jtcy/dept.png",logoAbs:"/images/appLogo/jtcy/logo-s.png",slogan:"让工作沟通更便捷！",uri:"maizhiyun",uriPrefix:"",adminPrefix:"",hostName:".maizhiyun.cn",color:"#558EEE",avatar:"//api.maizhiyun.cn/sfs/avatar?uid=",orgType:34,downUrl:"//maizhiyun.cn/d",adminUrl:"https://admin.maizhiyun.cn",loginUrl:"//acl.maizhiyun.cn/power/user/view/login.html",userInfoDoUrl:"//api.maizhiyun.cn/hta/org/userInfo.do",serviceUrl:"https://admin.maizhiyun.cn/m/index.html#/service?appId=",approveUrl:"https://api.maizhiyun.cn/approve/1/index.html",expenseUrl:"https://api.maizhiyun.cn/expense/1/index.html",hasSceneCmsLink:!0,domain:"maizhiyun"},hebeicaiyun:{allName:"河北云办公",name:"河北云办公",logo:"https://statics.hebeicaiyun.com/config/logo.png ",slogan:"云办公，更轻松",uri:"hebeicaiyun",uriPrefix:"",adminPrefix:"",hostName:".hebeicaiyun.com",color:"#0099ff",avatar:"https://api.hebeicaiyun.com/sfs/avatar?uid=",orgType:20,downUrl:"https://hebeicaiyun.com/d",adminUrl:"https://admin.hebeicaiyun.com",loginUrl:"https://admin.hebeicaiyun.com/power/user/view/login.html",userInfoDoUrl:"https://admin.hebeicaiyun.com/hta/org/userInfo.do",serviceUrl:"https://admin.hebeicaiyun.com/m/index.html#/service?appId=",approveUrl:"https://api.hebeicaiyun.com/approve/1/index.html",expenseUrl:"https://api.hebeicaiyun.com/expense/1/index.html",hasSceneCmsLink:!0,domain:"hebeicaiyun"},sd:{allName:"山东彩云",name:"山东彩云",logo:"https://statics-sd.uban360.com/config/logo.png",slogan:"云办公，更轻松",uri:"-sd",uriPrefix:"",adminPrefix:"",hostName:"-sd.uban360.com",color:"rgba(25,157,250,1)",avatar:"https://api-sd.uban360.com/sfs/avatar?uid=",orgType:26,downUrl:"https://hebeicaiyun.com/d",adminUrl:"https://admin-sd.uban360.com",loginUrl:"https://admin-sd.uban360.com/power/user/view/login.html",userInfoDoUrl:"https://admin-sd.uban360.com/hta/org/userInfo.do",serviceUrl:"https://admin-sd.uban360.com/m/index.html#/service?appId=",approveUrl:"https://api-sd.uban360.com/approve/1/index.html",expenseUrl:"https://api-sd.uban360.com/expense/1/index.html",hasSceneCmsLink:!0,domain:"-sd.uban360.com"}};function o(e){void 0===(e=void 0!==e?Number(e):e)?e=1:8011==+e&&(e=8);var a=i("orgType",e),o={ext:t,online:n,data:a,getDataByField:i};return function(e,t){if("object"==typeof e&&"object"==typeof t){for(var n in e)t[n]=e[n];return!0}}(a,o),o}var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},c=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},u=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},l=function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)},d={get:function(e){var t=null;if(document.cookie&&""!==document.cookie)for(var n=document.cookie.split(";"),i=0;i<n.length;i++){var a=n[i].trim();if(a.substring(0,e.length+1)===e+"="){t=decodeURIComponent(a.substring(e.length+1));break}}return t},set:function(e,t,n){document.cookie=" "+e+"="+t+"; domain="+n+";"},debug:function(e,t){var n=this;"string"==typeof e||(e=e.payToken)?this.set("payToken",e,t):"object"===(void 0===e?"undefined":r(e))&&Object.keys(e).forEach(function(i){n.set(i,e[i],t)})}},m={isIOS:/iPhone|iPad|iPod/.test(navigator.userAgent),getSearch:function(){var e=location.search.slice(1),t={},n=[];if(e){for(var i=e.split("&"),a=0;a<i.length;a++)t[(n=i[a].split("="))[0]]=n[1];return t}return null},getCookie:function(e){var t=null;if(document.cookie&&""!=document.cookie)for(var n=document.cookie.split(";"),i=0;i<n.length;i++){var a=n[i].trim();if(a.substr(0,e.length+1)===e+"="){t=decodeURIComponent(a.substring(e.length+1));break}}return t},getBinarySum:function(e){var t=0;return e.map(function(e){t+=1<<e-1}),t},getTomorrowTimeStamp:function(){var e=new Date;return e.setDate(e.getDate()+1),e.getTime()},genderCallbackToken:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return"defineCallback_"+(Date.now()+e)}};var v=null,p=!1,g=null,h=function(e){var t=e.city,n=e.province,i=e.district;if(t||(t=n),t===n){["上海市","北京市","重庆市","天津市"].every(function(e){return e!==t})&&(t=i)}return s({},e,{city:t})},f=function(e){var t,n=e.adcode,i=e.lat,a=e.lng;if(n){var o=h(e);return y(e),Promise.resolve(o)}return window.AMap?(t=[a,i],new Promise(function(e,n){AMap.service("AMap.Geocoder",function(){new AMap.Geocoder({city:"010"}).getAddress(t,function(t,i){if("complete"===t&&"OK"===i.info){var a=h(i.regeocode.addressComponent);y(a),e(a)}else k(n,"AMap.Geocoder 查询失败")})})})).then(function(e){return s({},e,{lng:a,lat:i})}):k(null,"AMap全局未注册，请引入高德SDK")},y=function(e){if(!(e instanceof Object)){var t=sessionStorage.getItem("locate-address");return t?JSON.parse(t):null}sessionStorage.setItem("locate-address",JSON.stringify(e))},k=function(e){var t={code:400,msg:arguments.length>1&&void 0!==arguments[1]?arguments[1]:"定位失败，请重试"};if(!e)return Promise.reject(t);e(t)},b=function(e,t){g=setTimeout(function(){p||k(e,"定位超时")},t)};var w=window.navigator&&window.navigator.userAgent||"",I=/Mobile/.test(w)&&w.match(/iPad|iPod|iPhone/);/Mobile/.test(w)&&/Android/i.test(w);window.JSBridge={_SURPPORTED_API:null,H5API:{},_callback:{},_event:{},onSuccess:function(e,t){if("string"==typeof e&&"object"===(void 0===t?"undefined":r(t)))try{window.JSBridge._callback[e](t)}catch(e){}else try{"string"==typeof t&&(t=JSON.parse(decodeURIComponent(t))),window.JSBridge._callback[e](t)}catch(e){}},onError:function(e){},requestHybrid:function(e){var t=this;if(e.callback){var n=e.callbackName||"token_"+(new Date).getTime();t._callback[n]=function(i){e.callback(i),delete t._callback[n]},e._token=n}var i=t._getUrlByParams(e,e.callbackName);t._postToNative(i)},_getUrlByParams:function(e){var t="";return t+="native://"+e.method,e.data?("object"==r(e.data)&&(e.data=JSON.stringify(e.data)),t+="?data="+encodeURIComponent(e.data),t+="&callback="+e._token):t+="?callback="+e._token,t},_postToNative:function(e){var t=document.createElement("iframe");t.src=e,t.style.display="none",document.body.appendChild(t),document.body.removeChild(t),t=null},native:function(e,t){if(window.Promise)return window.JSBridge.nativePromise(e,t);var n=null;return setTimeout(function(){window.JSBridge.requestHybrid({method:e,data:t,callback:function(e){n&&n(e)}})},0),{then:function(e){n=e}}},nativePromise:function(e,t){return new Promise(function(n,i){window.JSBridge.requestHybrid({method:e,data:t,callback:function(e){200===e.code?n(e):i(e)}})})},noMenu:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],t=function(){window.JSBridge.native("menu",[])};I&&!e?setTimeout(t,500):t()},toast:function(e,t){window.JSBridge.native("toast",{msg:e,time:t||3})},confirm:function(e,t,n,i,a){return window.JSBridge.native("confirm",{title:e,msg:t,ok:n,cancel:i},a)}};var x=d.get("orgType");x=x?Number(x):1,window.AppInfo=o(x);var U={isPromise:!0,orgType:x,local:!1};return function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};c(this,e),this.search=m.getSearch(),this.uid=d.get("userId"),this.name=d.get("username"),this.orgId=this.search&&this.search.orgId?this.search.orgId:d.get("orgId"),this.appInfo=o(x),this.cookie=d.get,this.debug=d.debug.bind(d);var n=s({},U,t);n.orgType&&(this.appInfo=o(x)),this.options=n}return u(e,[{key:"setAppInfoByField",value:function(){}},{key:"native",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return this.isMethodUseAble(e,t.mock)?t.mock?function(e,t){switch(e){case"openurl":/http[s]*/.test(t.url)?location.href=t.url:alert("url不合法");break;case"getversion":return Promise.resolve({code:200,data:{version:"100.1.0"}});case"getlocation":return Promise.resolve({code:200,data:{AOIName:"",POIName:"西溪壹号",adcode:"",city:"杭州",citycode:"0571",country:"中国",district:"西湖区",errorCode:0,lat:30.281809,lng:120.068968,location:0,province:"浙江省",street:"花匠路",streetNum:"796号"}})}}(e,t):JSBridge.nativePromise(e,t):(this.noticeUpdateClient(),Promise.reject())}},{key:"noticeUpdateClient",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"当前版本不支持该功能，请升级";window.JSBridge.confirm("温馨提示",t,"立即升级","取消").then(function(t){"ok"===t.data&&(location.href=window._ESC_APP_CONFIG&&window._ESC_APP_CONFIG.downloadUrl||e.appInfo.data.downUrl)})}},{key:"openUrl",value:function(e){var t={url:"",cookie:1,noDefaultMenu:1,mock:!1};return e instanceof Object?t=s({},t,e):t.url=e,this.native("openurl",t)}},{key:"openApp",value:function(e){var t={};return e instanceof Object?t=e:t.url=e,this.native("openapp",t)}},{key:"openOtherPage",value:function(e){return this.native("openotherpage",e)}},{key:"chat",value:function(e){return this.native("chat",e)}},{key:"getMeetingPage",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{orgid:this.orgId};return this.native("getmeetingpage",e)}},{key:"meetingAdminPage",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{orgid:this.orgId};return this.native("meetingadminpage",e)}},{key:"getVersion",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return new Promise(function(n,i){var a=void 0,o=m.getCookie("appversion");o?n(a=o):e.native("getversion",{mock:t}).then(function(e){(a=e.data.version)&&!a.includes("_")&&(a="_"+a),n(a)}).catch(function(t){e.toast("调用客户端version失败"),i("None_0.0.0")})})}},{key:"getAllMethod",value:function(){return window.JSBridge.native("getallmethod")}},{key:"checkMethod",value:function(e){var t={};return e instanceof Object?t=s({},e):t.method=e,this.native("checkmethod",t)}},{key:"outerShare",value:function(e){var t={title:"",desc:"",link:"",pic:""};return e instanceof Object?t=s({},t,e):t.type=e,this.native("outershare",t)}},{key:"share",value:function(e){var t={title:"",desc:"",link:"",pic:""};return t=s({},t,e),this.native("share",t)}},{key:"msgShare",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return this.native("msgshare",e)}},{key:"sendMsg",value:function(e){return this.native("sendmsg",e)}},{key:"getOrgNameById",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.orgId;return new Promise(function(n,i){e.native("getorglist",{orgId:t}).then(function(t){t&&t.data.length>0?n(decodeURIComponent(t.data[0].orgName)):(e.toast("getOrgNameById，客户端getorglist返回为空"),i({code:400}))})})}},{key:"selectMembers",value:function(e){var t=this;return this.getOrgNameById().then(function(n){var i={count:5,selectMeType:0,orgid:t.orgId,orgName:n,type:1,excludedtype:1,selected:[],department:[]};return e instanceof Object?(e.type&&Array.isArray(e.type)&&(e.type=m.getBinarySum(e.type)),e.excludedtype&&Array.isArray(e.excludedtype)&&(e.excludedtype=m.getBinarySum(e.excludedtype)),i=s({},i,e)):"number"==typeof e&&(i.count=e),t.native("selectmembers",i)})}},{key:"selectDepartments",value:function(e){var t={count:5,orgid:this.orgId,selected:[]};return e instanceof Object?t=s({},t,e):"number"==typeof e&&(t.count=e),this.native("selectdepartments",t)}},{key:"getOrgList",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.orgId,t={};return e&&(t.orgid=e),this.native("getorglist",t)}},{key:"getOrgAdminList",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.orgId,t={};return e&&(t.orgid=e),this.native("getorgadminlist",t)}},{key:"isOrgAdmin",value:function(e){var t=this,n={uid:this.uid,orgid:this.orgId};return e instanceof Object?n=s({},n,e):n.uid=e,new Promise(function(e,i){t.getOrgAdminList(n.orgid).then(function(t){t.data&&t.data.length&&t.data.map(function(t,i){t.uid===n.uid&&e(!0)}),e(!1)})})}},{key:"locate",value:function(e){return function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=y(),i=s({sdk:0,location:0,category:0,timeout:1,timeoutHack:!0,accuracy:100,delayTimeout:1e4},t);return i.timeoutHack&&(i.timeout=m.isIOS?1:5e3),v?(console.log("locate instance is exist"),v):v=new Promise(function(a,o){if(b(o,i.delayTimeout),t.force||!n)return p=!1,e.native("getlocation",i).then(function(e){p=!0,g&&clearTimeout(g),200===e.code&&e.data&&e.data.lat&&e.data.lng?a(f(e.data)):k(o)});p=!0,g&&clearTimeout(g),a(n)}).finally(function(){v=null})}.call(this,e)}},{key:"pageStat",value:function(e){var t={};return e instanceof Object?t=e:t.eventId=e,this.native("pagestat",t)}},{key:"getOperator",value:function(){return this.native("getoperator",{mock:!1})}},{key:"menu",value:function(e){var t={name:"",icon:"",action:"",unreadCount:0,mock:!1};return Array.isArray(e)?t=e.map(function(e){return s({},t,e)}):this.toast("menu options is a array"),this.native("menu",t)}},{key:"menuCallJs",value:function(e,t){var n=this,i=void 0,a=[];"object"===(void 0===e?"undefined":r(e))?a=Object.keys(e).map(function(t,a){return i=m.genderCallbackToken(a),n.defineCallback(i,e[t]),{name:t,action:"native://calljs?callback="+i}}):"string"==typeof e&&"function"==typeof t&&(i=m.genderCallbackToken(),this.defineCallback(i,t),a.push({name:e,action:"native://calljs?callback="+i})),this.menu(a)}},{key:"refresh",value:function(e){var t={};e instanceof Object?t=e:t.name=e,this.native("locate",t)}},{key:"pedometer",value:function(e){var t={};return e instanceof Object?("string"==typeof e.leaderboardTimestamp&&(e.leaderboardTimestamp=1e3*new Date(e.leaderboardTimestamp).getTime()),t=e):t.pageIndex=e,this.native("pedometer",t)}},{key:"activeAll",value:function(e){var t={orgId:this.orgId};return e instanceof Object?("number"==typeof e.deptIds?t.deptIds=[e.deptIds]:Array.isArray(e.deptIds)&&(t.deptIds=e.deptIds),t=s({},t,e)):t.orgId=e,this.native("activeall",t)}},{key:"addAdmin",value:function(e){var t={orgId:this.orgId};return e instanceof Object?t=s({},t,e):t.orgId=e,this.native("addadmin",t)}},{key:"isWifi",value:function(){return this.native("iswifi")}},{key:"workingTrack",value:function(e){var t={orgId:this.orgId};return e instanceof Object?t=s({},t,e):t.type=e,this.native("workingtrack",t)}},{key:"updateUser",value:function(e){var t={uid:this.uid,orgid:this.orgId,name:"",mobile:"",title:"",email:"",workPhone:"",shotNum:"",workPhone1:"",shotNum1:"",workPhone2:"",shotNum2:"",homePhone:"",fax:"",departmentId:0,newDeptId:0};return t=s({},t,e),this.native("updateuserinfo",t)}},{key:"updateOrgname",value:function(e){var t={orgid:this.orgId,orgName:""};return e instanceof Object?t=s({},t,e):"string"==typeof e?t.orgName=e:t.orgid=e,this.native("updateorgname",t)}},{key:"addIbeacon",value:function(e){return this.native("addibeacon",{id:e})}},{key:"getMachineId",value:function(){return this.native("getidentification")}},{key:"availableWifiList",value:function(){return this.native("availablewifilist")}},{key:"currentWifi",value:function(){return this.native("currentwifi")}},{key:"saveFile",value:function(e){return this.native("saveFile",{url:e})}},{key:"systemEvent",value:function(e){var t=m.getTomorrowTimeStamp(),n=1e3*(new Date).getTime(),i={content:"",stattime:n,endtime:t,alerttime:(t+n)/2,url:"",note:""};return i=s({},i,e),this.native("systemevent",i)}},{key:"audioRecord",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return this.native("audioRecord",{url:e})}},{key:"videoRecord",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return this.native("videoRecord",{url:e})}},{key:"dissolveTeam",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.orgId;return this.native("dissolveteam",{orgid:e})}},{key:"openPdf",value:function(e){var t={url:"",name:"",buttons:[]};return e instanceof Object?t=s({},t,e):t.url=e,this.native("openpdf",t)}},{key:"msgRedDot",value:function(e){var t={orgId:this.orgId};return t=s({},t,e),this.native("msgRedDot",e)}},{key:"callClientUpdate",value:function(e){var t={orgId:this.orgId,iconId:e};return this.native("callclientupdate",t)}},{key:"hideKeyboard",value:function(){this.native("hidekeyboard")}},{key:"createTeam",value:function(){this.native("createteam")}},{key:"openCommonTools",value:function(){this.native("opencommontools")}},{key:"selectFile",value:function(e){return this.native("selectfile",e)}},{key:"openInvite",value:function(){return this.native("openinvite")}},{key:"selectCity",value:function(e){return this.native("selectcity",{selected:e})}},{key:"selectInDustry",value:function(e){return this.native("selectindustry",{selected:e})}},{key:"personDetail",value:function(e){var t={uid:this.uid,name:""};return e instanceof Object?t=s({},t,e):t.uid=e,this.native("persondetail",t)}},{key:"cameraScan",value:function(){return this.native("camerascan")}},{key:"defineCallback",value:function(e,t){"string"==typeof e?window.JSBridge._callback[e]=t:Object.keys(e).map(function(t){window.JSBridge._callback[t]=e[t]})}},{key:"callParentJs",value:function(e,t){if(this.isMethodUseAble("callparentjs")){var n="native://callparentjs";n+="?data="+encodeURIComponent(JSON.stringify(e)),n+="&callback="+t,window.JSBridge._postToNative(n),window.JSBridge.native("close")}else this.noticeUpdateClient()}},{key:"editUserDetail",value:function(){return this.native("edituserdetail")}},{key:"noMenu",value:function(){window.JSBridge.noMenu(!0)}},{key:"toast",value:function(e){console.log(e),window.JSBridge.toast(e)}},{key:"alert",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return this.native("alert",{msg:t,title:e})}},{key:"confirm",value:function(e){var t=this,n={title:"",msg:"",ok:"确定",cancel:"取消"};return"string"==typeof e?n.msg=e:n=s({},n,e),new Promise(function(e,i){t.native("confirm",n).then(function(t){"ok"===t.data?e():"cancel"===t.data&&i()})})}},{key:"prompt",value:function(e){var t={title:"",msg:"",placeholder:"",textLength:-1,confirmText:"确定",cancelText:"取消"};return e instanceof Object?t=s({},t,e):t.title=e,this.native(this.isMethodUseAble("multilineprompt")?"multilineprompt":"prompt",t)}},{key:"actionSheet",value:function(e){var t={title:"",list:[]};return e instanceof Object?("string"==typeof e.list&&t.list.push({text:"",desc:"",value:""}),Array.isArray(e.list)&&(t.list=[].concat(l(e.list)))):t.list.push({text:"",desc:"",value:""}),this.native("actionSheet",t)}},{key:"modal",value:function(e){var t={title:"",msg:"",img:"",link:""};return e instanceof Object?t=s({},t,e):t.title=e,this.native("modal",t)}},{key:"selectPic",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:5;return this.native("selectpic",{max:e})}},{key:"selectDate",value:function(e){var t={type:1,customData:["上午","下午"],defaultValue:(new Date).getTime(),defaultCustomValue:"上午",format:"yyyy-MM-dd HH:mm"};return e instanceof Object?t=s({},t,e):t.type=e,this.native("selectdate",t)}},{key:"selectPeriodDate",value:function(e){var t=this;return new Promise(function(n,i){var a={type:2,customData:["上午","下午"],customDataTime:["08:00","18:00"],defaultValue:new Date("2018-01-25 08:00").getTime(),defaultCustomValue:"上午"};if(e instanceof Object)a=s({},a,e);else if(e)return void t.toast("参数错误");t.native("selectdate",a).then(function(e){if(1===a.type)n({code:200,data:new Date(e.data).getTime()});else{var t=e.data.slice(e.data.length-2),i=a.customData.indexOf(t),o=e.data.replace(t,a.customDataTime[i]);n({code:200,data:new Date(o).getTime()})}})})}},{key:"picker",value:function(e){var t={title:"",list:[]};return e instanceof Object&&(Array.isArray(e.list)?t.list=[].concat(l(e.list)):t.list.push({text:"",value:""})),this.native("picker",t)}},{key:"photo",value:function(){return this.native("photo")}},{key:"findFriend",value:function(){return this.native("findfriend")}},{key:"schedule",value:function(e){var t={content:"",time:(new Date).getTime(),remindtime:m.getTomorrowTimeStamp(),remindtype:1,priority:0};return e instanceof Object?t=s({},t,e):t.content=e,this.native("schedule",t)}},{key:"openContractManager",value:function(e){var t={orgid:this.orgId};return e instanceof Object?t=s({},t,e):t.orgid=e,this.native("opencontractmanager",t)}},{key:"launchChat",value:function(){return this.native("launchchat")}},{key:"close",value:function(){return this.native("close")}},{key:"closeSignAlert",value:function(){return this.native("losesignalert")}},{key:"previewImages",value:function(e){var t={position:0,urls:[]};return t=s({},t,e),this.native("previewimages",t)}},{key:"customDataSelect",value:function(e){var t={dialogTitle:"",level:0,datatype:0,selected:[],data:[],idata:[]};return t=s({},t,e),this.native("customdataselect",t)}},{key:"isMethodUseAble",value:function(e){return!0}},{key:"compareVersion",value:function(e,t){if(!e)return!1;e=e.split("_")[1].split(".").map(function(e){return Number(e)}),t=t.split(".").map(function(e){return Number(e)});for(var n=0;n<e.length;n++)if(e[n]<t[n])return!1;return!0}},{key:"commonCatchSchema",value:function(e,t,n){n&&console.log(n),this.toast(e+" is call error by client")}}]),e}()});
//# sourceMappingURL=native.js.map
"use strict";(self.webpackChunkRemoteClient=self.webpackChunkRemoteClient||[]).push([[8326,4889],{78346:(e,t,r)=>{r.d(t,{bA:()=>T});var o=r(20102),s=r(80442),n=r(95330),i=r(80903),a=r(25045),l=r(40330),d=r(92604),u=r(94362),c=r(99880),p=r(68773),h=(r(2587),r(17452));const f={};function y(e){var t;const r={async:e.async,isDebug:e.isDebug,locale:e.locale,baseUrl:e.baseUrl,has:{...e.has},map:{...e.map},packages:e.packages&&e.packages.concat()||[],paths:{...e.paths}};return e.hasOwnProperty("async")||(r.async=!0),e.hasOwnProperty("isDebug")||(r.isDebug=!1),e.baseUrl||(r.baseUrl=f.baseUrl),null==(t=f.packages)||t.forEach((e=>{!function(e,t){for(const r of e)if(r.name===t.name)return;e.push(t)}(r.packages,e)})),r}var m=r(41213);class g{constructor(){const e=document.createDocumentFragment();["addEventListener","dispatchEvent","removeEventListener"].forEach((t=>{this[t]=(...r)=>e[t](...r)}))}}class w{constructor(){this._dispatcher=new g,this._workerPostMessage({type:u.Cs.HANDSHAKE})}terminate(){}get onmessage(){return this._onmessageHandler}set onmessage(e){this._onmessageHandler&&this.removeEventListener("message",this._onmessageHandler),this._onmessageHandler=e,e&&this.addEventListener("message",e)}get onmessageerror(){return this._onmessageerrorHandler}set onmessageerror(e){this._onmessageerrorHandler&&this.removeEventListener("messageerror",this._onmessageerrorHandler),this._onmessageerrorHandler=e,e&&this.addEventListener("messageerror",e)}get onerror(){return this._onerrorHandler}set onerror(e){this._onerrorHandler&&this.removeEventListener("error",this._onerrorHandler),this._onerrorHandler=e,e&&this.addEventListener("error",e)}postMessage(e){(0,m.Y)((()=>{this._workerMessageHandler(new MessageEvent("message",{data:e}))}))}dispatchEvent(e){return this._dispatcher.dispatchEvent(e)}addEventListener(e,t,r){this._dispatcher.addEventListener(e,t,r)}removeEventListener(e,t,r){this._dispatcher.removeEventListener(e,t,r)}_workerPostMessage(e){(0,m.Y)((()=>{this.dispatchEvent(new MessageEvent("message",{data:e}))}))}async _workerMessageHandler(e){const t=(0,u.QM)(e);if(t&&t.type===u.Cs.OPEN){const{modulePath:e,jobId:r}=t;let o=await a.default.loadWorker(e);o||(o=await import(e));const s=a.default.connect(o);this._workerPostMessage({type:u.Cs.OPENED,jobId:r,data:s})}}}var b=r(70171),v=r(17202);const _=d.Z.getLogger("esri.core.workers"),{HANDSHAKE:C}=u.Cs;let k,S;const j="Failed to create Worker. Fallback to execute module in main thread";async function R(e){return new Promise((t=>{function r(s){const n=(0,u.QM)(s);n&&n.type===C&&(e.removeEventListener("message",r),e.removeEventListener("error",o),t(e))}function o(t){t.preventDefault(),e.removeEventListener("message",r),e.removeEventListener("error",o),_.warn("Failed to create Worker. Fallback to execute module in main thread",t),(e=new w).addEventListener("message",r),e.addEventListener("error",o)}e.addEventListener("message",r),e.addEventListener("error",o)}))}let E=0;const M=d.Z.getLogger("esri.core.workers"),{ABORT:P,INVOKE:N,OPEN:Z,OPENED:x,RESPONSE:O}=u.Cs;class I{constructor(e,t){this._outJobs=new Map,this._inJobs=new Map,this.worker=e,this.id=t,e.addEventListener("message",this._onMessage.bind(this)),e.addEventListener("error",(e=>{e.preventDefault(),M.error(e)}))}static async create(e){const t=await async function(){if(!(0,s.Z)("esri-workers")||((0,s.Z)("mozilla"),0))return R(new w);if(!k&&!S)try{const e='let globalId=0;const outgoing=new Map,configuration=JSON.parse("{CONFIGURATION}");self.esriConfig=configuration.esriConfig;const workerPath=self.esriConfig.workers.workerPath,HANDSHAKE=0,OPEN=1,OPENED=2,RESPONSE=3,INVOKE=4,ABORT=5;function createAbortError(){const e=new Error("Aborted");return e.name="AbortError",e}function receiveMessage(e){return e&&e.data?"string"==typeof e.data?JSON.parse(e.data):e.data:null}function invokeStaticMessage(e,o,r){const t=r&&r.signal,n=globalId++;return new Promise(((r,i)=>{if(t){if(t.aborted)return i(createAbortError());t.addEventListener("abort",(()=>{outgoing.get(n)&&(outgoing.delete(n),self.postMessage({type:5,jobId:n}),i(createAbortError()))}))}outgoing.set(n,{resolve:r,reject:i}),self.postMessage({type:4,jobId:n,methodName:e,abortable:null!=t,data:o})}))}let workerRevisionChecked=!1;function checkWorkerRevision(e){if(!workerRevisionChecked&&e.kernelInfo){workerRevisionChecked=!0;const{revision:o,buildDate:r,version:t}=configuration.kernelInfo,{revision:n,buildDate:i,version:s}=e.kernelInfo;o!==n&&console.warn(`[esri.core.workers] Version mismatch detected between ArcGIS API for JavaScript and assets:\\nAPI version: ${t} [Date: ${r}, Revision: ${o.slice(0,8)}]\nAssets version: ${s} [Date: ${i}, Revision: ${n.slice(0,8)}]`)}}function messageHandler(e){const o=receiveMessage(e);if(!o)return;const r=o.jobId;switch(o.type){case 1:let e;function t(o){const t=e.connect(o);self.postMessage({type:2,jobId:r,data:t},[t])}"function"==typeof define&&define.amd?require([workerPath],(r=>{e=r.default||r,checkWorkerRevision(e),e.loadWorker(o.modulePath).then((e=>e||new Promise((e=>{require([o.modulePath],e)})))).then(t)})):"System"in self&&"function"==typeof System.import?System.import(workerPath).then((r=>(e=r.default,checkWorkerRevision(e),e.loadWorker(o.modulePath)))).then((e=>e||System.import(o.modulePath))).then(t):esriConfig.workers.useDynamicImport?import(workerPath).then((r=>{e=r.default||r,checkWorkerRevision(e),e.loadWorker(o.modulePath).then((e=>e||import(o.modulePath))).then(t)})):(self.RemoteClient||importScripts(workerPath),e=self.RemoteClient.default||self.RemoteClient,checkWorkerRevision(e),e.loadWorker(o.modulePath).then(t));break;case 3:if(outgoing.has(r)){const e=outgoing.get(r);outgoing.delete(r),o.error?e.reject(JSON.parse(o.error)):e.resolve(o.data)}}}self.dojoConfig=configuration.loaderConfig,esriConfig.workers.loaderUrl&&(self.importScripts(esriConfig.workers.loaderUrl),"function"==typeof require&&"function"==typeof require.config&&require.config(configuration.loaderConfig)),self.addEventListener("message",messageHandler),self.postMessage({type:0});'.replace('"{CONFIGURATION}"',`'${function(){let e;if(null!=p.Z.default){const t={...p.Z};delete t.default,e=JSON.parse(JSON.stringify(t))}else e=JSON.parse(JSON.stringify(p.Z));e.assetsPath=(0,h.hF)(e.assetsPath),e.request.interceptors=[],e.log.interceptors=[],e.locale=(0,b.Kd)(),e.has={"esri-csp-restrictions":(0,s.Z)("esri-csp-restrictions"),"esri-2d-debug":!1,"esri-2d-update-debug":(0,s.Z)("esri-2d-update-debug"),"esri-2d-query-centroid-enabled":(0,s.Z)("esri-2d-query-centroid-enabled"),"featurelayer-pbf":(0,s.Z)("featurelayer-pbf"),"featurelayer-simplify-thresholds":(0,s.Z)("featurelayer-simplify-thresholds"),"featurelayer-simplify-payload-size-factors":(0,s.Z)("featurelayer-simplify-payload-size-factors"),"featurelayer-simplify-mobile-factor":(0,s.Z)("featurelayer-simplify-mobile-factor"),"esri-atomics":(0,s.Z)("esri-atomics"),"esri-shared-array-buffer":(0,s.Z)("esri-shared-array-buffer"),"esri-tiles-debug":(0,s.Z)("esri-tiles-debug"),"esri-workers-arraybuffer-transfer":(0,s.Z)("esri-workers-arraybuffer-transfer"),"feature-polyline-generalization-factor":(0,s.Z)("feature-polyline-generalization-factor"),"host-webworker":1},e.workers.loaderUrl&&(e.workers.loaderUrl=(0,h.hF)(e.workers.loaderUrl)),e.workers.workerPath?e.workers.workerPath=(0,h.hF)(e.workers.workerPath):e.workers.workerPath=(0,h.hF)((0,c.V)("esri/core/workers/RemoteClient.js")),e.workers.useDynamicImport=!1;const t=p.Z.workers.loaderConfig,r=y({baseUrl:null==t?void 0:t.baseUrl,locale:(0,b.Kd)(),has:{"csp-restrictions":1,"dojo-test-sniff":0,"host-webworker":1,...null==t?void 0:t.has},map:{...null==t?void 0:t.map},paths:{...null==t?void 0:t.paths},packages:(null==t?void 0:t.packages)||[]}),o={version:l.i8,buildDate:v.r,revision:v.$};return JSON.stringify({esriConfig:e,loaderConfig:r,kernelInfo:o})}()}'`);k=URL.createObjectURL(new Blob([e],{type:"text/javascript"}))}catch(e){S=e||{}}let e;if(k)try{e=new Worker(k,{name:"esri-worker-"+E++})}catch(t){_.warn(j,S),e=new w}else _.warn(j,S),e=new w;return R(e)}();return new I(t,e)}terminate(){this.worker.terminate()}async open(e,t={}){const{signal:r}=t,o=(0,u.jt)();return new Promise(((t,s)=>{const i={resolve:t,reject:s,abortHandle:(0,n.$F)(r,(()=>{this._outJobs.delete(o),this._post({type:P,jobId:o})}))};this._outJobs.set(o,i),this._post({type:Z,jobId:o,modulePath:e})}))}_onMessage(e){const t=(0,u.QM)(e);if(t)switch(t.type){case x:this._onOpenedMessage(t);break;case O:this._onResponseMessage(t);break;case P:this._onAbortMessage(t);break;case N:this._onInvokeMessage(t)}}_onAbortMessage(e){const t=this._inJobs,r=e.jobId,o=t.get(r);o&&(o.controller&&o.controller.abort(),t.delete(r))}_onInvokeMessage(e){const{methodName:t,jobId:r,data:o,abortable:s}=e,i=s?new AbortController:null,a=this._inJobs,d=l.Nv[t];let c;try{if("function"!=typeof d)throw new TypeError(`${t} is not a function`);c=d.call(null,o,{signal:i?i.signal:null})}catch(e){return void this._post({type:O,jobId:r,error:(0,u.AB)(e)})}(0,n.y8)(c)?(a.set(r,{controller:i,promise:c}),c.then((e=>{a.has(r)&&(a.delete(r),this._post({type:O,jobId:r},e))}),(e=>{a.has(r)&&(a.delete(r),e||(e={message:"Error encountered at method"+t}),(0,n.D_)(e)||this._post({type:O,jobId:r,error:(0,u.AB)(e||{message:`Error encountered at method ${t}`})}))}))):this._post({type:O,jobId:r},c)}_onOpenedMessage(e){var t;const{jobId:r,data:o}=e,s=this._outJobs.get(r);s&&(this._outJobs.delete(r),null==(t=s.abortHandle)||t.remove(),s.resolve(o))}_onResponseMessage(e){var t;const{jobId:r,error:s,data:n}=e,i=this._outJobs.get(r);i&&(this._outJobs.delete(r),null==(t=i.abortHandle)||t.remove(),s?i.reject(o.Z.fromJSON(JSON.parse(s))):i.resolve(n))}_post(e,t,r){return(0,u.oi)(this.worker,e,t,r)}}let F=(0,s.Z)("esri-workers-debug")?1:(0,s.Z)("host-browser")?navigator.hardwareConcurrency-1:0;F||(F=(0,s.Z)("safari")&&(0,s.Z)("mac")||(0,s.Z)("trident")?7:2);let A=0;const L=[];async function B(e,t){const r=new i.Z;return await r.open(e,t),r}async function T(e,t={}){if("string"!=typeof e)throw new o.Z("workers:undefined-module","modulePath is missing");let r=t.strategy||"distributed";if((0,s.Z)("host-webworker")&&!(0,s.Z)("esri-workers")&&(r="local"),"local"===r){let r=await a.default.loadWorker(e);r||(r=await import(e)),(0,n.k_)(t.signal);const o=t.client||r;return B([a.default.connect(r)],{...t,client:o})}if(await async function(){if(H)return H;D=new AbortController;const e=[];for(let t=0;t<F;t++){const r=I.create(t).then((e=>(L[t]=e,e)));e.push(r)}return H=Promise.all(e),H}(),(0,n.k_)(t.signal),"dedicated"===r){const r=A++%F;return B([await L[r].open(e,t)],t)}if(t.maxNumWorkers&&t.maxNumWorkers>0){const r=Math.min(t.maxNumWorkers,F);if(r<F){const o=new Array(r);for(let s=0;s<r;++s){const r=A++%F;o[s]=L[r].open(e,t)}return B(o,t)}}return B(L.map((r=>r.open(e,t))),t)}let D,H=null},2587:(e,t,r)=>{r(90344),r(18848),r(940),r(70171);var o=r(94443),s=r(3172),n=r(20102),i=r(70586);async function a(e){if((0,i.pC)(l.fetchBundleAsset))return l.fetchBundleAsset(e);const t=await(0,s.default)(e,{responseType:"text"});return JSON.parse(t.data)}const l={};var d,u=r(99880);(0,o.tz)((d={pattern:"esri/",location:u.V},new class{constructor({base:e="",pattern:t,location:r=new URL(window.location.href)}){let o;o="string"==typeof r?e=>new URL(e,new URL(r,window.location.href)).href:r instanceof URL?e=>new URL(e,r).href:r,this.pattern="string"==typeof t?new RegExp(`^${t}`):t,this.getAssetUrl=o,e=e?e.endsWith("/")?e:e+"/":"",this.matcher=new RegExp(`^${e}(?:(.*)/)?(.*)$`)}fetchMessageBundle(e,t){return async function(e,t,r,s){const i=t.exec(r);if(!i)throw new n.Z("esri-intl:invalid-bundle",`Bundle id "${r}" is not compatible with the pattern "${t}"`);const l=i[1]?`${i[1]}/`:"",d=i[2],u=(0,o.Su)(s),c=`${l}${d}.json`,p=u?`${l}${d}_${u}.json`:c;let h;try{h=await a(e(p))}catch(t){if(p===c)throw new n.Z("intl:unknown-bundle",`Bundle "${r}" cannot be loaded`,{error:t});try{h=await a(e(c))}catch(e){throw new n.Z("intl:unknown-bundle",`Bundle "${r}" cannot be loaded`,{error:e})}}return h}(this.getAssetUrl,this.matcher,e,t)}}(d)))},94443:(e,t,r)=>{r.d(t,{ME:()=>h,Su:()=>f,tz:()=>p});var o=r(20102),s=r(95330),n=r(70171);const i=/^([a-z]{2})(?:[-_]([A-Za-z]{2}))?$/,a={ar:!0,bg:!0,bs:!0,ca:!0,cs:!0,da:!0,de:!0,el:!0,en:!0,es:!0,et:!0,fi:!0,fr:!0,he:!0,hr:!0,hu:!0,id:!0,it:!0,ja:!0,ko:!0,lt:!0,lv:!0,nb:!0,nl:!0,pl:!0,"pt-BR":!0,"pt-PT":!0,ro:!0,ru:!0,sk:!0,sl:!0,sr:!0,sv:!0,th:!0,tr:!0,uk:!0,vi:!0,"zh-CN":!0,"zh-HK":!0,"zh-TW":!0};function l(e){var t;return null!=(t=a[e])&&t}const d=[],u=new Map;function c(e){for(const t of u.keys())y(e.pattern,t)&&u.delete(t)}function p(e){return d.includes(e)||(c(e),d.unshift(e)),{remove(){const t=d.indexOf(e);t>-1&&(d.splice(t,1),c(e))}}}async function h(e){const t=(0,n.Kd)();u.has(e)||u.set(e,async function(e,t){const r=[];for(const o of d)if(y(o.pattern,e))try{return await o.fetchMessageBundle(e,t)}catch(e){r.push(e)}if(r.length)throw new o.Z("intl:message-bundle-error",`Errors occurred while loading "${e}"`,{errors:r});throw new o.Z("intl:no-message-bundle-loader",`No loader found for message bundle "${e}"`)}(e,t));const r=u.get(e);return await m.add(r),r}function f(e){if(!i.test(e))return null;const[,t,r]=i.exec(e),o=t+(r?"-"+r.toUpperCase():"");return l(o)?o:l(t)?t:null}function y(e,t){return"string"==typeof e?t.startsWith(e):e.test(t)}(0,n.Ze)((()=>{u.clear()}));const m=new class{constructor(){this._numLoading=0}async waitForAll(){this._dfd&&await this._dfd.promise}add(e){return this._increase(),e.then((()=>this._decrease()),(()=>this._decrease())),this.waitForAll()}_increase(){this._numLoading++,this._dfd||(this._dfd=(0,s.dD)())}_decrease(){this._numLoading=Math.max(this._numLoading-1,0),this._dfd&&0===this._numLoading&&(this._dfd.resolve(),this._dfd=null)}}},940:(e,t,r)=>{r.d(t,{n:()=>d});var o=r(92604),s=r(78286),n=r(19153),i=r(90344),a=r(18848);const l=o.Z.getLogger("esri.intl");function d(e,t,r={}){const{format:o={}}=r;return(0,n.gx)(e,(e=>function(e,t,r){let o,n;const i=e.indexOf(":");if(-1===i?o=e.trim():(o=e.slice(0,i).trim(),n=e.slice(i+1).trim()),!o)return"";const a=(0,s.hS)(o,t);if(null==a)return"";const l=r[n]||r[o];return l?u(a,l):n?c(a,n):p(a)}(e,t,o)))}function u(e,t){switch(t.type){case"date":return(0,i.p6)(e,t.intlOptions);case"number":return(0,a.uf)(e,t.intlOptions);default:return l.warn("missing format descriptor for key {key}"),p(e)}}function c(e,t){switch(t.toLowerCase()){case"dateformat":return(0,i.p6)(e);case"numberformat":return(0,a.uf)(e);default:return l.warn(`inline format is unsupported since 4.12: ${t}`),/^(dateformat|datestring)/i.test(t)?(0,i.p6)(e):/^numberformat/i.test(t)?(0,a.uf)(e):p(e)}}function p(e){switch(typeof e){case"string":return e;case"number":return(0,a.uf)(e);case"boolean":return""+e;default:return e instanceof Date?(0,i.p6)(e):""}}},60199:(e,t,r)=>{r.d(t,{D:()=>n});var o=r(66677);const s=[];function n(e,t){if((0,o.M8)(e.url))return!0;const{wkid:r}=t;for(const t of s){if(e.version>=t[0])return!0;if("function"==typeof t[1]&&(t[1]=t[1]()),t[1].has(r))return!1}return!0}s.push([10.91,()=>{const e=new Set([9709,9716,9741,9761,9766]);for(let t=9712;t<=9713;t++)e.add(t);for(let t=9748;t<=9749;t++)e.add(t);for(let t=20904;t<=20932;t++)e.add(t);for(let t=21004;t<=21032;t++)e.add(t);for(let t=21207;t<=21264;t++)e.add(t);for(let t=21307;t<=21364;t++)e.add(t);for(let t=102759;t<=102760;t++)e.add(t);for(let t=102901;t<=102960;t++)e.add(t);return e}]),s.push([10.9,()=>{const e=new Set([9300,9354,9364,9367,9373,9377,9387,9456,9473,9498,9678,9680,29874,103599,103872,104028]);for(let t=9356;t<=9360;t++)e.add(t);for(let t=9404;t<=9407;t++)e.add(t);for(let t=9476;t<=9482;t++)e.add(t);for(let t=9487;t<=9494;t++)e.add(t);for(let t=9697;t<=9699;t++)e.add(t);return e}]),s.push([10.81,()=>{const e=new Set([9265,9333,103598,103699]);for(let t=9248;t<=9254;t++)e.add(t);for(let t=9271;t<=9273;t++)e.add(t);for(let t=9284;t<=9285;t++)e.add(t);for(let t=21453;t<=21463;t++)e.add(t);return e}]),s.push([10.8,()=>{const e=new Set([8088,8395,8428,8433,8531,8687,8692,8694,8699,8900,9003,9006,9009,9012,9017,9191]);for(let t=8035;t<=8036;t++)e.add(t);for(let t=8455;t<=8456;t++)e.add(t);for(let t=8518;t<=8529;t++)e.add(t);for(let t=8533;t<=8536;t++)e.add(t);for(let t=8538;t<=8540;t++)e.add(t);for(let t=8677;t<=8679;t++)e.add(t);for(let t=8902;t<=8903;t++)e.add(t);for(let t=8907;t<=8910;t++)e.add(t);for(let t=8949;t<=8951;t++)e.add(t);for(let t=8972;t<=8987;t++)e.add(t);for(let t=9039;t<=9040;t++)e.add(t);for(let t=9068;t<=9069;t++)e.add(t);for(let t=9140;t<=9141;t++)e.add(t);for(let t=9148;t<=9150;t++)e.add(t);for(let t=9153;t<=9159;t++)e.add(t);for(let t=9205;t<=9218;t++)e.add(t);for(let t=9221;t<=9222;t++)e.add(t);for(let t=54098;t<=54101;t++)e.add(t);return e}]),s.push([10.71,()=>{const e=new Set([6316]);for(let t=8351;t<=8353;t++)e.add(t);for(let t=9294;t<=9297;t++)e.add(t);for(let t=103586;t<=103594;t++)e.add(t);for(let t=103696;t<=103698;t++)e.add(t);return e}]),s.push([10.7,()=>{const e=new Set([8387,8391,8427,8545,8682,8685,8818,31370,104022,104024,104975]);for(let t=8065;t<=8068;t++)e.add(t);for(let t=8082;t<=8083;t++)e.add(t);for(let t=8379;t<=8385;t++)e.add(t);for(let t=8836;t<=8840;t++)e.add(t);for(let t=8857;t<=8860;t++)e.add(t);for(let t=53035;t<=53037;t++)e.add(t);for(let t=54090;t<=54091;t++)e.add(t);for(let t=102498;t<=102499;t++)e.add(t);return e}]),s.push([10.61,()=>new Set([102497])]),s.push([10.6,()=>{const e=new Set([7803,7805,7887,8086,8232,8237,8240,8246,8249,8252,8255,9019,9391]);for(let t=7755;t<=7787;t++)e.add(t);for(let t=7791;t<=7795;t++)e.add(t);for(let t=7799;t<=7801;t++)e.add(t);for(let t=7825;t<=7831;t++)e.add(t);for(let t=7877;t<=7878;t++)e.add(t);for(let t=7882;t<=7883;t++)e.add(t);for(let t=7991;t<=7992;t++)e.add(t);for(let t=8042;t<=8043;t++)e.add(t);for(let t=8058;t<=8059;t++)e.add(t);for(let t=8311;t<=8348;t++)e.add(t);for(let t=9060;t<=9067;t++)e.add(t);for(let t=102562;t<=102568;t++)e.add(t);for(let t=102799;t<=102900;t++)e.add(t);return e}]),s.push([10.51,()=>{const e=new Set([7683,7881,7886,7899,8888,9e3]);for(let t=8013;t<=8032;t++)e.add(t);for(let t=9053;t<=9057;t++)e.add(t);for(let t=104017;t<=104018;t++)e.add(t);for(let t=104971;t<=104974;t++)e.add(t);return e}]),s.push([10.5,()=>{const e=new Set([6962,7035,7037,7039,7041,7084,7086,7133,7798,102399]);for(let t=4087;t<=4088;t++)e.add(t);for(let t=5896;t<=5899;t++)e.add(t);for(let t=7005;t<=7007;t++)e.add(t);for(let t=7057;t<=7070;t++)e.add(t);for(let t=7073;t<=7082;t++)e.add(t);for(let t=7109;t<=7128;t++)e.add(t);for(let t=7844;t<=7859;t++)e.add(t);return e}])},56545:(e,t,r)=>{r.d(t,{Z:()=>p});var o,s=r(43697),n=r(96674),i=r(22974),a=r(5600),l=r(75215),d=r(52011),u=r(30556);let c=o=class extends n.wq{constructor(e){super(e),this.attachmentTypes=null,this.attachmentsWhere=null,this.keywords=null,this.globalIds=null,this.name=null,this.num=null,this.objectIds=null,this.returnMetadata=!1,this.size=null,this.start=null,this.where=null}writeStart(e,t){t.resultOffset=this.start,t.resultRecordCount=this.num||10}clone(){return new o((0,i.d9)({attachmentTypes:this.attachmentTypes,attachmentsWhere:this.attachmentsWhere,keywords:this.keywords,where:this.where,globalIds:this.globalIds,name:this.name,num:this.num,objectIds:this.objectIds,returnMetadata:this.returnMetadata,size:this.size,start:this.start}))}};(0,s._)([(0,a.Cb)({type:[String],json:{write:!0}})],c.prototype,"attachmentTypes",void 0),(0,s._)([(0,a.Cb)({type:String,json:{read:{source:"attachmentsDefinitionExpression"},write:{target:"attachmentsDefinitionExpression"}}})],c.prototype,"attachmentsWhere",void 0),(0,s._)([(0,a.Cb)({type:[String],json:{write:!0}})],c.prototype,"keywords",void 0),(0,s._)([(0,a.Cb)({type:[Number],json:{write:!0}})],c.prototype,"globalIds",void 0),(0,s._)([(0,a.Cb)({json:{write:!0}})],c.prototype,"name",void 0),(0,s._)([(0,a.Cb)({type:Number,json:{read:{source:"resultRecordCount"}}})],c.prototype,"num",void 0),(0,s._)([(0,a.Cb)({type:[Number],json:{write:!0}})],c.prototype,"objectIds",void 0),(0,s._)([(0,a.Cb)({type:Boolean,json:{default:!1,write:!0}})],c.prototype,"returnMetadata",void 0),(0,s._)([(0,a.Cb)({type:[Number],json:{write:!0}})],c.prototype,"size",void 0),(0,s._)([(0,a.Cb)({type:Number,json:{read:{source:"resultOffset"}}})],c.prototype,"start",void 0),(0,s._)([(0,u.c)("start"),(0,u.c)("num")],c.prototype,"writeStart",null),(0,s._)([(0,a.Cb)({type:String,json:{read:{source:"definitionExpression"},write:{target:"definitionExpression"}}})],c.prototype,"where",void 0),c=o=(0,s._)([(0,d.j)("esri.rest.support.AttachmentQuery")],c),c.from=(0,l.se)(c);const p=c},74889:(e,t,r)=>{r.r(t),r.d(t,{default:()=>v});var o,s=r(43697),n=r(66577),i=r(38171),a=r(35454),l=r(96674),d=r(22974),u=r(70586),c=r(5600),p=(r(75215),r(71715)),h=r(52011),f=r(30556),y=r(82971),m=r(33955),g=r(1231);const w=new a.X({esriGeometryPoint:"point",esriGeometryMultipoint:"multipoint",esriGeometryPolyline:"polyline",esriGeometryPolygon:"polygon",esriGeometryEnvelope:"extent",mesh:"mesh","":null});let b=o=class extends l.wq{constructor(e){super(e),this.displayFieldName=null,this.exceededTransferLimit=!1,this.features=[],this.fields=null,this.geometryType=null,this.hasM=!1,this.hasZ=!1,this.queryGeometry=null,this.spatialReference=null}readFeatures(e,t){const r=y.Z.fromJSON(t.spatialReference),o=[];for(let t=0;t<e.length;t++){const s=e[t],n=i.Z.fromJSON(s),a=s.geometry&&s.geometry.spatialReference;(0,u.pC)(n.geometry)&&!a&&(n.geometry.spatialReference=r);const l=s.aggregateGeometries,d=n.aggregateGeometries;if(l&&(0,u.pC)(d))for(const e in d){const t=d[e],o=l[e],s=null==o?void 0:o.spatialReference;(0,u.pC)(t)&&!s&&(t.spatialReference=r)}o.push(n)}return o}writeGeometryType(e,t,r,o){if(e)return void w.write(e,t,r,o);const{features:s}=this;if(s)for(const e of s)if(e&&(0,u.pC)(e.geometry))return void w.write(e.geometry.type,t,r,o)}readQueryGeometry(e,t){if(!e)return null;const r=!!e.spatialReference,o=(0,m.im)(e);return!r&&t.spatialReference&&(o.spatialReference=y.Z.fromJSON(t.spatialReference)),o}writeSpatialReference(e,t){if(e)return void(t.spatialReference=e.toJSON());const{features:r}=this;if(r)for(const e of r)if(e&&(0,u.pC)(e.geometry)&&e.geometry.spatialReference)return void(t.spatialReference=e.geometry.spatialReference.toJSON())}clone(){return new o(this.cloneProperties())}cloneProperties(){return(0,d.d9)({displayFieldName:this.displayFieldName,exceededTransferLimit:this.exceededTransferLimit,features:this.features,fields:this.fields,geometryType:this.geometryType,hasM:this.hasM,hasZ:this.hasZ,queryGeometry:this.queryGeometry,spatialReference:this.spatialReference,transform:this.transform})}toJSON(e){const t=this.write();if(t.features&&Array.isArray(e)&&e.length>0)for(let r=0;r<t.features.length;r++){const o=t.features[r];if(o.geometry){const t=e&&e[r];o.geometry=t&&t.toJSON()||o.geometry}}return t}quantize(e){const{scale:[t,r],translate:[o,s]}=e,n=this.features,i=this._getQuantizationFunction(this.geometryType,(e=>Math.round((e-o)/t)),(e=>Math.round((s-e)/r)));for(let e=0,t=n.length;e<t;e++)i((0,u.Wg)(n[e].geometry))||(n.splice(e,1),e--,t--);return this.transform=e,this}unquantize(){const{geometryType:e,features:t,transform:r}=this;if(!r)return this;const{translate:[o,s],scale:[n,i]}=r,a=this._getHydrationFunction(e,(e=>e*n+o),(e=>s-e*i));for(const{geometry:e}of t)(0,u.pC)(e)&&a(e);return this.transform=null,this}_quantizePoints(e,t,r){let o,s;const n=[];for(let i=0,a=e.length;i<a;i++){const a=e[i];if(i>0){const e=t(a[0]),i=r(a[1]);e===o&&i===s||(n.push([e-o,i-s]),o=e,s=i)}else o=t(a[0]),s=r(a[1]),n.push([o,s])}return n.length>0?n:null}_getQuantizationFunction(e,t,r){return"point"===e?e=>(e.x=t(e.x),e.y=r(e.y),e):"polyline"===e||"polygon"===e?e=>{const o=(0,m.oU)(e)?e.rings:e.paths,s=[];for(let e=0,n=o.length;e<n;e++){const n=o[e],i=this._quantizePoints(n,t,r);i&&s.push(i)}return s.length>0?((0,m.oU)(e)?e.rings=s:e.paths=s,e):null}:"multipoint"===e?e=>{const o=this._quantizePoints(e.points,t,r);return o.length>0?(e.points=o,e):null}:"extent"===e?e=>e:null}_getHydrationFunction(e,t,r){return"point"===e?e=>{e.x=t(e.x),e.y=r(e.y)}:"polyline"===e||"polygon"===e?e=>{const o=(0,m.oU)(e)?e.rings:e.paths;let s,n;for(let e=0,i=o.length;e<i;e++){const i=o[e];for(let e=0,o=i.length;e<o;e++){const o=i[e];e>0?(s+=o[0],n+=o[1]):(s=o[0],n=o[1]),o[0]=t(s),o[1]=r(n)}}}:"extent"===e?e=>{e.xmin=t(e.xmin),e.ymin=r(e.ymin),e.xmax=t(e.xmax),e.ymax=r(e.ymax)}:"multipoint"===e?e=>{const o=e.points;let s,n;for(let e=0,i=o.length;e<i;e++){const i=o[e];e>0?(s+=i[0],n+=i[1]):(s=i[0],n=i[1]),i[0]=t(s),i[1]=r(n)}}:void 0}};(0,s._)([(0,c.Cb)({type:String,json:{write:!0}})],b.prototype,"displayFieldName",void 0),(0,s._)([(0,c.Cb)({type:Boolean,json:{write:{overridePolicy:e=>({enabled:e})}}})],b.prototype,"exceededTransferLimit",void 0),(0,s._)([(0,c.Cb)({type:[i.Z],json:{write:!0}})],b.prototype,"features",void 0),(0,s._)([(0,p.r)("features")],b.prototype,"readFeatures",null),(0,s._)([(0,c.Cb)({type:[g.Z],json:{write:!0}})],b.prototype,"fields",void 0),(0,s._)([(0,c.Cb)({type:["point","multipoint","polyline","polygon","extent","mesh"],json:{read:{reader:w.read}}})],b.prototype,"geometryType",void 0),(0,s._)([(0,f.c)("geometryType")],b.prototype,"writeGeometryType",null),(0,s._)([(0,c.Cb)({type:Boolean,json:{write:{overridePolicy:e=>({enabled:e})}}})],b.prototype,"hasM",void 0),(0,s._)([(0,c.Cb)({type:Boolean,json:{write:{overridePolicy:e=>({enabled:e})}}})],b.prototype,"hasZ",void 0),(0,s._)([(0,c.Cb)({types:n.qM,json:{write:!0}})],b.prototype,"queryGeometry",void 0),(0,s._)([(0,p.r)("queryGeometry")],b.prototype,"readQueryGeometry",null),(0,s._)([(0,c.Cb)({type:y.Z,json:{write:!0}})],b.prototype,"spatialReference",void 0),(0,s._)([(0,f.c)("spatialReference")],b.prototype,"writeSpatialReference",null),(0,s._)([(0,c.Cb)({json:{write:!0}})],b.prototype,"transform",void 0),b=o=(0,s._)([(0,h.j)("esri.rest.support.FeatureSet")],b),b.prototype.toJSON.isDefaultToJSON=!0;const v=b},75935:(e,t,r)=>{r.d(t,{Z:()=>f});var o,s=r(43697),n=(r(66577),r(96674)),i=r(22974),a=r(5600),l=r(75215),d=r(52011),u=r(30556),c=r(10158),p=r(82971);let h=o=class extends n.wq{constructor(e){super(e),this.dynamicDataSource=void 0,this.gdbVersion=null,this.geometryPrecision=void 0,this.historicMoment=null,this.maxAllowableOffset=void 0,this.objectIds=null,this.orderByFields=null,this.outFields=null,this.outSpatialReference=null,this.relationshipId=void 0,this.start=void 0,this.num=void 0,this.returnGeometry=!1,this.returnM=void 0,this.returnZ=void 0,this.where=null}_writeHistoricMoment(e,t){t.historicMoment=e&&e.getTime()}writeStart(e,t){t.resultOffset=this.start,t.resultRecordCount=this.num||10,this.start>0&&null==this.where&&(t.definitionExpression="1=1")}clone(){return new o((0,i.d9)({dynamicDataSource:this.dynamicDataSource,gdbVersion:this.gdbVersion,geometryPrecision:this.geometryPrecision,historicMoment:this.historicMoment&&new Date(this.historicMoment.getTime()),maxAllowableOffset:this.maxAllowableOffset,objectIds:this.objectIds,orderByFields:this.orderByFields,outFields:this.outFields,outSpatialReference:this.outSpatialReference,relationshipId:this.relationshipId,start:this.start,num:this.num,returnGeometry:this.returnGeometry,where:this.where,returnZ:this.returnZ,returnM:this.returnM}))}};(0,s._)([(0,a.Cb)({type:c.n,json:{write:!0}})],h.prototype,"dynamicDataSource",void 0),(0,s._)([(0,a.Cb)({type:String,json:{write:!0}})],h.prototype,"gdbVersion",void 0),(0,s._)([(0,a.Cb)({type:Number,json:{write:!0}})],h.prototype,"geometryPrecision",void 0),(0,s._)([(0,a.Cb)({type:Date})],h.prototype,"historicMoment",void 0),(0,s._)([(0,u.c)("historicMoment")],h.prototype,"_writeHistoricMoment",null),(0,s._)([(0,a.Cb)({type:Number,json:{write:!0}})],h.prototype,"maxAllowableOffset",void 0),(0,s._)([(0,a.Cb)({type:[Number],json:{write:!0}})],h.prototype,"objectIds",void 0),(0,s._)([(0,a.Cb)({type:[String],json:{write:!0}})],h.prototype,"orderByFields",void 0),(0,s._)([(0,a.Cb)({type:[String],json:{write:!0}})],h.prototype,"outFields",void 0),(0,s._)([(0,a.Cb)({type:p.Z,json:{read:{source:"outSR"},write:{target:"outSR"}}})],h.prototype,"outSpatialReference",void 0),(0,s._)([(0,a.Cb)({json:{write:!0}})],h.prototype,"relationshipId",void 0),(0,s._)([(0,a.Cb)({type:Number,json:{read:{source:"resultOffset"}}})],h.prototype,"start",void 0),(0,s._)([(0,u.c)("start"),(0,u.c)("num")],h.prototype,"writeStart",null),(0,s._)([(0,a.Cb)({type:Number,json:{read:{source:"resultRecordCount"}}})],h.prototype,"num",void 0),(0,s._)([(0,a.Cb)({json:{write:!0}})],h.prototype,"returnGeometry",void 0),(0,s._)([(0,a.Cb)({type:Boolean,json:{write:{overridePolicy:e=>({enabled:e})}}})],h.prototype,"returnM",void 0),(0,s._)([(0,a.Cb)({type:Boolean,json:{write:{overridePolicy:e=>({enabled:e})}}})],h.prototype,"returnZ",void 0),(0,s._)([(0,a.Cb)({type:String,json:{read:{source:"definitionExpression"},write:{target:"definitionExpression"}}})],h.prototype,"where",void 0),h=o=(0,s._)([(0,d.j)("esri.rest.support.RelationshipQuery")],h),h.from=(0,l.se)(h);const f=h},28141:(e,t,r)=>{r.d(t,{Z:()=>C});var o,s=r(43697),n=r(66577),i=r(92835),a=r(35454),l=r(96674),d=r(22974),u=r(5600),c=r(75215),p=r(52011),h=r(30556),f=r(33955);r(67676),r(80442);let y=o=class extends l.wq{constructor(e){super(e),this.groupByFields=void 0,this.topCount=void 0,this.orderByFields=void 0}clone(){return new o({groupByFields:this.groupByFields,topCount:this.topCount,orderByFields:this.orderByFields})}};(0,s._)([(0,u.Cb)({type:[String],json:{write:!0}})],y.prototype,"groupByFields",void 0),(0,s._)([(0,u.Cb)({type:Number,json:{write:!0}})],y.prototype,"topCount",void 0),(0,s._)([(0,u.Cb)({type:[String],json:{write:!0}})],y.prototype,"orderByFields",void 0),y=o=(0,s._)([(0,p.j)("esri.rest.support.TopFilter")],y);const m=y;var g,w=r(82971);const b=new a.X({esriSpatialRelIntersects:"intersects",esriSpatialRelContains:"contains",esriSpatialRelCrosses:"crosses",esriSpatialRelDisjoint:"disjoint",esriSpatialRelEnvelopeIntersects:"envelope-intersects",esriSpatialRelIndexIntersects:"index-intersects",esriSpatialRelOverlaps:"overlaps",esriSpatialRelTouches:"touches",esriSpatialRelWithin:"within",esriSpatialRelRelation:"relation"}),v=new a.X({esriSRUnit_Meter:"meters",esriSRUnit_Kilometer:"kilometers",esriSRUnit_Foot:"feet",esriSRUnit_StatuteMile:"miles",esriSRUnit_NauticalMile:"nautical-miles",esriSRUnit_USNauticalMile:"us-nautical-miles"});let _=g=class extends l.wq{constructor(e){super(e),this.cacheHint=void 0,this.distance=void 0,this.geometry=null,this.geometryPrecision=void 0,this.maxAllowableOffset=void 0,this.num=void 0,this.objectIds=null,this.orderByFields=null,this.outFields=null,this.outSpatialReference=null,this.resultType=null,this.returnGeometry=!1,this.returnM=void 0,this.returnZ=void 0,this.start=void 0,this.spatialRelationship="intersects",this.timeExtent=null,this.topFilter=void 0,this.units=null,this.where="1=1"}writeStart(e,t){t.resultOffset=this.start,t.resultRecordCount=this.num||10}clone(){return new g((0,d.d9)({cacheHint:this.cacheHint,distance:this.distance,geometry:this.geometry,geometryPrecision:this.geometryPrecision,maxAllowableOffset:this.maxAllowableOffset,num:this.num,objectIds:this.objectIds,orderByFields:this.orderByFields,outFields:this.outFields,outSpatialReference:this.outSpatialReference,resultType:this.resultType,returnGeometry:this.returnGeometry,returnZ:this.returnZ,returnM:this.returnM,start:this.start,spatialRelationship:this.spatialRelationship,timeExtent:this.timeExtent,topFilter:this.topFilter,units:this.units,where:this.where}))}};(0,s._)([(0,u.Cb)({type:Boolean,json:{write:!0}})],_.prototype,"cacheHint",void 0),(0,s._)([(0,u.Cb)({type:Number,json:{write:{overridePolicy:e=>({enabled:e>0})}}})],_.prototype,"distance",void 0),(0,s._)([(0,u.Cb)({types:n.qM,json:{read:f.im,write:!0}})],_.prototype,"geometry",void 0),(0,s._)([(0,u.Cb)({type:Number,json:{write:!0}})],_.prototype,"geometryPrecision",void 0),(0,s._)([(0,u.Cb)({type:Number,json:{write:!0}})],_.prototype,"maxAllowableOffset",void 0),(0,s._)([(0,u.Cb)({type:Number,json:{read:{source:"resultRecordCount"}}})],_.prototype,"num",void 0),(0,s._)([(0,u.Cb)({json:{write:!0}})],_.prototype,"objectIds",void 0),(0,s._)([(0,u.Cb)({type:[String],json:{write:!0}})],_.prototype,"orderByFields",void 0),(0,s._)([(0,u.Cb)({type:[String],json:{write:!0}})],_.prototype,"outFields",void 0),(0,s._)([(0,u.Cb)({type:w.Z,json:{read:{source:"outSR"},write:{target:"outSR"}}})],_.prototype,"outSpatialReference",void 0),(0,s._)([(0,u.Cb)({type:String,json:{write:!0}})],_.prototype,"resultType",void 0),(0,s._)([(0,u.Cb)({json:{write:!0}})],_.prototype,"returnGeometry",void 0),(0,s._)([(0,u.Cb)({type:Boolean,json:{write:{overridePolicy:e=>({enabled:e})}}})],_.prototype,"returnM",void 0),(0,s._)([(0,u.Cb)({type:Boolean,json:{write:{overridePolicy:e=>({enabled:e})}}})],_.prototype,"returnZ",void 0),(0,s._)([(0,u.Cb)({type:Number,json:{read:{source:"resultOffset"}}})],_.prototype,"start",void 0),(0,s._)([(0,h.c)("start"),(0,h.c)("num")],_.prototype,"writeStart",null),(0,s._)([(0,u.Cb)({type:String,json:{read:{source:"spatialRel",reader:b.read},write:{target:"spatialRel",writer:b.write}}})],_.prototype,"spatialRelationship",void 0),(0,s._)([(0,u.Cb)({type:i.Z,json:{write:!0}})],_.prototype,"timeExtent",void 0),(0,s._)([(0,u.Cb)({type:m,json:{write:!0}})],_.prototype,"topFilter",void 0),(0,s._)([(0,u.Cb)({type:String,json:{read:v.read,write:{writer:v.write,overridePolicy(e){return{enabled:e&&this.distance>0}}}}})],_.prototype,"units",void 0),(0,s._)([(0,u.Cb)({type:String,json:{write:!0}})],_.prototype,"where",void 0),_=g=(0,s._)([(0,p.j)("esri.rest.support.TopFeaturesQuery")],_),_.from=(0,c.se)(_);const C=_}}]);
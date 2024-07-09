import{ad as G,ab as F,ai as j,am as x,an as D,ao as q,ap as K,aq as w,ar as k,as as W,at as X,af as b,ag as Y,ac as m,a2 as z,au as J,g as Z,av as ee,aw as te,ax as re,r as Q}from"./index-3fc7229d.js";var se=function(r){G(u,r);function u(n,t){var e;return e=r.call(this)||this,e.client=n,e.options=t,e.trackedProps=[],e.previousSelectError=null,e.bindMethods(),e.setOptions(t),e}var s=u.prototype;return s.bindMethods=function(){this.remove=this.remove.bind(this),this.refetch=this.refetch.bind(this)},s.onSubscribe=function(){this.listeners.length===1&&(this.currentQuery.addObserver(this),B(this.currentQuery,this.options)&&this.executeFetch(),this.updateTimers())},s.onUnsubscribe=function(){this.listeners.length||this.destroy()},s.shouldFetchOnReconnect=function(){return T(this.currentQuery,this.options,this.options.refetchOnReconnect)},s.shouldFetchOnWindowFocus=function(){return T(this.currentQuery,this.options,this.options.refetchOnWindowFocus)},s.destroy=function(){this.listeners=[],this.clearTimers(),this.currentQuery.removeObserver(this)},s.setOptions=function(t,e){var a=this.options,i=this.currentQuery;if(this.options=this.client.defaultQueryObserverOptions(t),typeof this.options.enabled<"u"&&typeof this.options.enabled!="boolean")throw new Error("Expected enabled to be a boolean");this.options.queryKey||(this.options.queryKey=a.queryKey),this.updateQuery();var c=this.hasListeners();c&&N(this.currentQuery,i,this.options,a)&&this.executeFetch(),this.updateResult(e),c&&(this.currentQuery!==i||this.options.enabled!==a.enabled||this.options.staleTime!==a.staleTime)&&this.updateStaleTimeout();var o=this.computeRefetchInterval();c&&(this.currentQuery!==i||this.options.enabled!==a.enabled||o!==this.currentRefetchInterval)&&this.updateRefetchInterval(o)},s.getOptimisticResult=function(t){var e=this.client.defaultQueryObserverOptions(t),a=this.client.getQueryCache().build(this.client,e);return this.createResult(a,e)},s.getCurrentResult=function(){return this.currentResult},s.trackResult=function(t,e){var a=this,i={},c=function(h){a.trackedProps.includes(h)||a.trackedProps.push(h)};return Object.keys(t).forEach(function(o){Object.defineProperty(i,o,{configurable:!1,enumerable:!0,get:function(){return c(o),t[o]}})}),(e.useErrorBoundary||e.suspense)&&c("error"),i},s.getNextResult=function(t){var e=this;return new Promise(function(a,i){var c=e.subscribe(function(o){o.isFetching||(c(),o.isError&&(t!=null&&t.throwOnError)?i(o.error):a(o))})})},s.getCurrentQuery=function(){return this.currentQuery},s.remove=function(){this.client.getQueryCache().remove(this.currentQuery)},s.refetch=function(t){return this.fetch(F({},t,{meta:{refetchPage:t==null?void 0:t.refetchPage}}))},s.fetchOptimistic=function(t){var e=this,a=this.client.defaultQueryObserverOptions(t),i=this.client.getQueryCache().build(this.client,a);return i.fetch().then(function(){return e.createResult(i,a)})},s.fetch=function(t){var e=this;return this.executeFetch(t).then(function(){return e.updateResult(),e.currentResult})},s.executeFetch=function(t){this.updateQuery();var e=this.currentQuery.fetch(this.options,t);return t!=null&&t.throwOnError||(e=e.catch(j)),e},s.updateStaleTimeout=function(){var t=this;if(this.clearStaleTimeout(),!(x||this.currentResult.isStale||!D(this.options.staleTime))){var e=q(this.currentResult.dataUpdatedAt,this.options.staleTime),a=e+1;this.staleTimeoutId=setTimeout(function(){t.currentResult.isStale||t.updateResult()},a)}},s.computeRefetchInterval=function(){var t;return typeof this.options.refetchInterval=="function"?this.options.refetchInterval(this.currentResult.data,this.currentQuery):(t=this.options.refetchInterval)!=null?t:!1},s.updateRefetchInterval=function(t){var e=this;this.clearRefetchInterval(),this.currentRefetchInterval=t,!(x||this.options.enabled===!1||!D(this.currentRefetchInterval)||this.currentRefetchInterval===0)&&(this.refetchIntervalId=setInterval(function(){(e.options.refetchIntervalInBackground||K.isFocused())&&e.executeFetch()},this.currentRefetchInterval))},s.updateTimers=function(){this.updateStaleTimeout(),this.updateRefetchInterval(this.computeRefetchInterval())},s.clearTimers=function(){this.clearStaleTimeout(),this.clearRefetchInterval()},s.clearStaleTimeout=function(){clearTimeout(this.staleTimeoutId),this.staleTimeoutId=void 0},s.clearRefetchInterval=function(){clearInterval(this.refetchIntervalId),this.refetchIntervalId=void 0},s.createResult=function(t,e){var a=this.currentQuery,i=this.options,c=this.currentResult,o=this.currentResultState,h=this.currentResultOptions,d=t!==a,v=d?t.state:this.currentQueryInitialState,y=d?this.currentResult:this.previousQueryResult,l=t.state,S=l.dataUpdatedAt,I=l.error,E=l.errorUpdatedAt,O=l.isFetching,f=l.status,U=!1,A=!1,p;if(e.optimisticResults){var L=this.hasListeners(),H=!L&&B(t,e),M=L&&N(t,a,e,i);(H||M)&&(O=!0,S||(f="loading"))}if(e.keepPreviousData&&!l.dataUpdateCount&&(y!=null&&y.isSuccess)&&f!=="error")p=y.data,S=y.dataUpdatedAt,f=y.status,U=!0;else if(e.select&&typeof l.data<"u"){var P;if(c&&l.data===(o==null?void 0:o.data)&&e.select===((P=this.previousSelect)==null?void 0:P.fn)&&!this.previousSelectError)p=this.previousSelect.result;else try{p=e.select(l.data),e.structuralSharing!==!1&&(p=w(c==null?void 0:c.data,p)),this.previousSelect={fn:e.select,result:p},this.previousSelectError=null}catch(g){k().error(g),I=g,this.previousSelectError=g,E=Date.now(),f="error"}}else p=l.data;if(typeof e.placeholderData<"u"&&typeof p>"u"&&(f==="loading"||f==="idle")){var R;if(c!=null&&c.isPlaceholderData&&e.placeholderData===(h==null?void 0:h.placeholderData))R=c.data;else if(R=typeof e.placeholderData=="function"?e.placeholderData():e.placeholderData,e.select&&typeof R<"u")try{R=e.select(R),e.structuralSharing!==!1&&(R=w(c==null?void 0:c.data,R)),this.previousSelectError=null}catch(g){k().error(g),I=g,this.previousSelectError=g,E=Date.now(),f="error"}typeof R<"u"&&(f="success",p=R,A=!0)}var $={status:f,isLoading:f==="loading",isSuccess:f==="success",isError:f==="error",isIdle:f==="idle",data:p,dataUpdatedAt:S,error:I,errorUpdatedAt:E,failureCount:l.fetchFailureCount,errorUpdateCount:l.errorUpdateCount,isFetched:l.dataUpdateCount>0||l.errorUpdateCount>0,isFetchedAfterMount:l.dataUpdateCount>v.dataUpdateCount||l.errorUpdateCount>v.errorUpdateCount,isFetching:O,isRefetching:O&&f!=="loading",isLoadingError:f==="error"&&l.dataUpdatedAt===0,isPlaceholderData:A,isPreviousData:U,isRefetchError:f==="error"&&l.dataUpdatedAt!==0,isStale:_(t,e),refetch:this.refetch,remove:this.remove};return $},s.shouldNotifyListeners=function(t,e){if(!e)return!0;var a=this.options,i=a.notifyOnChangeProps,c=a.notifyOnChangePropsExclusions;if(!i&&!c||i==="tracked"&&!this.trackedProps.length)return!0;var o=i==="tracked"?this.trackedProps:i;return Object.keys(t).some(function(h){var d=h,v=t[d]!==e[d],y=o==null?void 0:o.some(function(S){return S===h}),l=c==null?void 0:c.some(function(S){return S===h});return v&&!l&&(!o||y)})},s.updateResult=function(t){var e=this.currentResult;if(this.currentResult=this.createResult(this.currentQuery,this.options),this.currentResultState=this.currentQuery.state,this.currentResultOptions=this.options,!W(this.currentResult,e)){var a={cache:!0};(t==null?void 0:t.listeners)!==!1&&this.shouldNotifyListeners(this.currentResult,e)&&(a.listeners=!0),this.notify(F({},a,t))}},s.updateQuery=function(){var t=this.client.getQueryCache().build(this.client,this.options);if(t!==this.currentQuery){var e=this.currentQuery;this.currentQuery=t,this.currentQueryInitialState=t.state,this.previousQueryResult=this.currentResult,this.hasListeners()&&(e==null||e.removeObserver(this),t.addObserver(this))}},s.onQueryUpdate=function(t){var e={};t.type==="success"?e.onSuccess=!0:t.type==="error"&&!X(t.error)&&(e.onError=!0),this.updateResult(e),this.hasListeners()&&this.updateTimers()},s.notify=function(t){var e=this;b.batch(function(){t.onSuccess?(e.options.onSuccess==null||e.options.onSuccess(e.currentResult.data),e.options.onSettled==null||e.options.onSettled(e.currentResult.data,null)):t.onError&&(e.options.onError==null||e.options.onError(e.currentResult.error),e.options.onSettled==null||e.options.onSettled(void 0,e.currentResult.error)),t.listeners&&e.listeners.forEach(function(a){a(e.currentResult)}),t.cache&&e.client.getQueryCache().notify({query:e.currentQuery,type:"observerResultsUpdated"})})},u}(Y);function ie(r,u){return u.enabled!==!1&&!r.state.dataUpdatedAt&&!(r.state.status==="error"&&u.retryOnMount===!1)}function B(r,u){return ie(r,u)||r.state.dataUpdatedAt>0&&T(r,u,u.refetchOnMount)}function T(r,u,s){if(u.enabled!==!1){var n=typeof s=="function"?s(r):s;return n==="always"||n!==!1&&_(r,u)}return!1}function N(r,u,s,n){return s.enabled!==!1&&(r!==u||n.enabled===!1)&&(!s.suspense||r.state.status!=="error")&&_(r,s)}function _(r,u){return r.isStaleByTime(u.staleTime)}function ne(){var r=!1;return{clearReset:function(){r=!1},reset:function(){r=!0},isReset:function(){return r}}}var ue=m.createContext(ne()),ae=function(){return m.useContext(ue)};function oe(r,u,s){return typeof u=="function"?u.apply(void 0,s):typeof u=="boolean"?u:!!r}function ce(r,u){var s=m.useRef(!1),n=m.useState(0),t=n[1],e=z(),a=ae(),i=e.defaultQueryObserverOptions(r);i.optimisticResults=!0,i.onError&&(i.onError=b.batchCalls(i.onError)),i.onSuccess&&(i.onSuccess=b.batchCalls(i.onSuccess)),i.onSettled&&(i.onSettled=b.batchCalls(i.onSettled)),i.suspense&&(typeof i.staleTime!="number"&&(i.staleTime=1e3),i.cacheTime===0&&(i.cacheTime=1)),(i.suspense||i.useErrorBoundary)&&(a.isReset()||(i.retryOnMount=!1));var c=m.useState(function(){return new u(e,i)}),o=c[0],h=o.getOptimisticResult(i);if(m.useEffect(function(){s.current=!0,a.clearReset();var d=o.subscribe(b.batchCalls(function(){s.current&&t(function(v){return v+1})}));return o.updateResult(),function(){s.current=!1,d()}},[a,o]),m.useEffect(function(){o.setOptions(i,{listeners:!1})},[i,o]),i.suspense&&h.isLoading)throw o.fetchOptimistic(i).then(function(d){var v=d.data;i.onSuccess==null||i.onSuccess(v),i.onSettled==null||i.onSettled(v,null)}).catch(function(d){a.clearReset(),i.onError==null||i.onError(d),i.onSettled==null||i.onSettled(void 0,d)});if(h.isError&&!a.isReset()&&!h.isFetching&&oe(i.suspense,i.useErrorBoundary,[h.error,o.getCurrentQuery()]))throw h.error;return i.notifyOnChangeProps==="tracked"&&(h=o.trackResult(h,i)),h}function Re(r,u,s){var n=J(r,u,s);return ce(n,se)}var le=ee,he=te,fe=re,de={formats:fe,parse:he,stringify:le};const C=Z(de);function ye(r){return Q.createContext(r)}function V(r){return r!=null&&r!==""}function Se(r){const u=C.stringify(r,{filter:["page","items_per_page"],skipNulls:!0}),s=C.stringify(r,{filter:["sort","order"],skipNulls:!0}),n=V(r.keyword)?C.stringify(r,{filter:["keyword"],skipNulls:!0}):"",t=r.filter?Object.entries(r.filter).filter(e=>V(e[1])).map(e=>`filter_${e[0]}=${e[1]}`).join("&"):"";return[u,s,n,t].filter(e=>e).join("&").toLowerCase()}function ge(r,u){return r?!0:!u||!u.length}function me(r,u){return r?r.length>0&&r.length===u.length:!1}function be(r,u,s){if(r)if(u.includes(r))s(u.filter(n=>n!==r));else{const n=[...u];n.push(r),s(n)}}function Ie(r,u,s){if(r){u([]);return}!s||!s.length||u(s.filter(n=>n.id).map(n=>n.id))}function Ee(r,u){const[s,n]=Q.useState(r);return Q.useEffect(()=>{const t=setTimeout(()=>{n(r)},u);return()=>{clearTimeout(t)}},[r,u]),s}const pe={page:"1",PageCount:10},Oe={state:pe,updateState:()=>{}},Ce={refetch:()=>{},isLoading:!1,query:""},Qe={selected:[],onSelect:()=>{},onSelectAll:()=>{},clearSelected:()=>{},setItemIdForUpdate:()=>{},isAllSelected:!1,disabled:!1},Te={USERS_LIST:"users-list",CATEGORIES_LIST:"categories-list",ARCHIVED_CATEGORIES_LIST:"archived-categories-list",SUB_CATEGORIES_LIST:"sub-categories-list",ARCHIVED_SUB_CATEGORIES_LIST:"archived-sub-categories-list",CHILD_SUB_CATEGORIES_LIST:"child-sub-categories-list",ARCHIVED_CHILD_SUB_CATEGORIES_LIST:"archived-child-sub-categories-list",BRNACHES_LIST:"branches-list",ARCHIVED_BRNACHES_LIST:"archived-branches-list",TYPES_LIST:"types-list",ARCHIVED_TYPES_LIST:"archived-types-list",EXTRAS_LIST:"extras-list",ARCHIVED_EXTRAS_LIST:"archived-extras-list",PRODUCTS_LIST:"products-list",ARCHIVED_PRODUCTS_LIST:"archived-products-list"};export{Te as Q,Ce as a,pe as b,ye as c,Qe as d,ge as e,me as f,be as g,Ie as h,Oe as i,Ee as j,V as k,oe as l,Se as s,Re as u};

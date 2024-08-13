import{r as o,ar as Q,bU as de,b6 as ce,as as Re,at as _e,z as e,au as Me,av as De,a0 as me,a$ as ue,a1 as I,G as re,a5 as Fe,aC as ge,bV as pe,bW as Oe,ab as D,ao as Be,bX as $e,ap as N,K as He,ay as _,aK as F,b3 as be,bY as Ve,bZ as Qe,b_ as Le,b$ as Ue,ax as qe,aF as Ke,c0 as Ge,b9 as ze,aG as We,a7 as te,aL as v,aM as oe,aN as p,aO as C,ba as Ye,bb as Xe,c1 as Ze,c2 as Je,aR as w,aS as A,aT as ne,aU as ie,bS as ea,bT as aa,aV as sa,aW as ra,T as ta,aX as oa,aY as na,E as ia,aD as la,M as da,N as V,O as ca,P as ma,Q as ua}from"./index-8a491e06.js";const he=o.createContext(Q),ga=({children:n})=>{const[l,c]=o.useState(Q.selected),[b,d]=o.useState(Q.itemIdForUpdate),{isLoading:u}=de(),m=ce(),x=o.useMemo(()=>Re(u,m),[u,m]),s=o.useMemo(()=>_e(m,l),[m,l]);return e.jsx(he.Provider,{value:{selected:l,itemIdForUpdate:b,setItemIdForUpdate:d,disabled:x,isAllSelected:s,onSelect:t=>{Me(t,l,c)},onSelectAll:()=>{De(s,c,m)},clearSelected:()=>{c([])}},children:n})},R=()=>o.useContext(he),pa=()=>{const n={borderRadius:"0.475rem",boxShadow:"0 0 50px 0 rgb(82 63 105 / 15%)",backgroundColor:"#fff",color:"#7e8299",fontWeight:"500",margin:"0",width:"auto",padding:"1rem 2rem",top:"calc(50% - 2rem)",left:"calc(50% - 4rem)"};return e.jsx("div",{style:{...n,position:"absolute",textAlign:"center"},children:"Processing..."})},ba=me().shape({order:ue().min(0,"Order can't be negative"),name:I().min(3,"Minimum 3 symbols").required("Name is required"),description:I().min(3,"Minimum 3 symbols")}),le=({category:n,isCategoryLoading:l})=>{const{setItemIdForUpdate:c}=R(),{refetch:b}=de(),[d]=o.useState({...n,available:n.available||!0,name:n.name||""}),u=t=>{t&&b(),c(void 0)},m=re("media/svg/avatars/blank.svg"),x=re(`media/${d.imgCover}`),s=Fe({initialValues:d,validationSchema:ba,onSubmit:async(t,{setSubmitting:h})=>{h(!0);try{ge(t._id)?await pe(t==null?void 0:t._id,t):await Oe(t)}catch(f){console.error(f)}finally{h(!0),u(!0)}}});return e.jsxs(e.Fragment,{children:[e.jsxs("form",{id:"kt_modal_add_user_form",className:"form ",onSubmit:s.handleSubmit,noValidate:!0,children:[e.jsxs("div",{className:"d-flex flex-column scroll-y me-n7 pe-7",id:"kt_modal_add_user_scroll","data-kt-scroll":"true","data-kt-scroll-activate":"{default: false, lg: true}","data-kt-scroll-max-height":"auto","data-kt-scroll-dependencies":"#kt_modal_add_user_header","data-kt-scroll-wrappers":"#kt_modal_add_user_scroll","data-kt-scroll-offset":"300px",children:[e.jsxs("div",{className:"fv-row mb-7",children:[e.jsx("label",{className:"d-block fw-bold fs-6 ms-2 mb-5",children:"ImgCover"}),e.jsx("div",{className:"image-input image-input-outline ms-2","data-kt-image-input":"true",style:{backgroundImage:`url('${m}')`},children:e.jsx("div",{className:"image-input-wrapper w-125px h-125px ms-2",style:{backgroundImage:`url('${x}')`}})})]}),e.jsxs("div",{className:"fv-row mb-7",children:[e.jsx("label",{className:"required fw-bold fs-6 ps-2 mb-2",children:"Name"}),e.jsx("input",{placeholder:"Full name",...s.getFieldProps("name"),type:"text",name:"name",className:D("form-control form-control-solid mb-3 ms-2 mb-lg-0",{"is-invalid":s.touched.name&&s.errors.name},{"is-valid":s.touched.name&&!s.errors.name}),autoComplete:"off",disabled:s.isSubmitting||l}),s.touched.name&&s.errors.name&&e.jsx("div",{className:"fv-plugins-message-container",children:e.jsx("div",{className:"fv-help-block",children:e.jsx("span",{role:"alert",children:s.errors.name})})})]}),e.jsxs("div",{className:"fv-row mb-7",children:[e.jsx("label",{className:"required fw-bold fs-6  ms-2 mb-2",children:"Order"}),e.jsx("input",{placeholder:"order",...s.getFieldProps("order"),className:D("form-control form-control-solid mb-3 mb-lg-0 ms-2",{"is-invalid":s.touched.order&&s.errors.order},{"is-valid":s.touched.order&&!s.errors.order}),type:"text",name:"order",autoComplete:"off",disabled:s.isSubmitting||l}),s.touched.order&&s.errors.order&&e.jsx("div",{className:"fv-plugins-message-container",children:e.jsx("span",{role:"alert",children:s.errors.order})})]}),e.jsxs("div",{className:"fv-row mb-7",children:[e.jsx("label",{className:"required fw-bold fs-6 mb-2 ms-2",children:"Description"}),e.jsx("input",{placeholder:"description",...s.getFieldProps("description"),className:D("form-control form-control-solid mb-3 mb-lg-0 ms-2",{"is-invalid":s.touched.description&&s.errors.description},{"is-valid":s.touched.description&&!s.errors.description}),type:"text",name:"description",autoComplete:"off",disabled:s.isSubmitting||l}),s.touched.description&&s.errors.description&&e.jsx("div",{className:"fv-plugins-message-container",children:e.jsx("span",{role:"alert",children:s.errors.description})})]}),e.jsxs("div",{className:"fv-row mb-7",children:[e.jsx("label",{className:"required fw-bold fs-6 mb-2 ms-2",children:"Available"}),e.jsxs("select",{...s.getFieldProps("available"),className:D("form-control form-control-solid mb-3 mb-lg-0 ms-2",{"is-invalid":s.touched.description&&s.errors.description},{"is-valid":s.touched.description&&!s.errors.description}),name:"available",autoComplete:"off",disabled:s.isSubmitting||l,children:[e.jsx("option",{value:"true",children:"Yes"}),e.jsx("option",{value:"false",children:"No"})]}),s.touched.available&&s.errors.available&&e.jsx("div",{className:"fv-plugins-message-container",children:e.jsx("span",{role:"alert",children:s.errors.available})})]})]}),e.jsxs("div",{className:"text-center pt-15",children:[e.jsx("button",{type:"reset",onClick:()=>u(),className:"btn btn-light me-3","data-kt-users-modal-action":"cancel",disabled:s.isSubmitting||l,children:"Discard"}),e.jsxs("button",{type:"submit",className:"btn btn-primary","data-kt-users-modal-action":"submit",disabled:l||s.isSubmitting||!s.isValid||!s.touched,children:[e.jsx("span",{className:"indicator-label",children:"Submit"}),(s.isSubmitting||l)&&e.jsxs("span",{className:"indicator-progress",children:["Please wait..."," ",e.jsx("span",{className:"spinner-border spinner-border-sm align-middle ms-2"})]})]})]})]}),(s.isSubmitting||l)&&e.jsx(pa,{})]})},ha=()=>{const{itemIdForUpdate:n,setItemIdForUpdate:l}=R(),c=ge(n),{isLoading:b,data:d,error:u}=Be(`${N.CATEGORIES_LIST}-category-${n}`,()=>$e(n),{cacheTime:0,enabled:c,onError:m=>{l(void 0),console.error(m)}});return n?!b&&!u&&d?e.jsx(le,{isCategoryLoading:b,category:d}):null:e.jsx(le,{isCategoryLoading:b,category:{_id:void 0,available:!0}})},xa=()=>{const{setItemIdForUpdate:n}=R();return e.jsxs("div",{className:"modal-header",children:[e.jsx("h2",{className:"fw-bolder",children:"Add Category"}),e.jsx("div",{className:"btn btn-icon btn-sm btn-active-icon-primary","data-kt-users-modal-action":"close",onClick:()=>n(void 0),style:{cursor:"pointer"},children:e.jsx(He,{iconName:"cross",className:"fs-1"})})]})},fa=()=>(o.useEffect(()=>(document.body.classList.add("modal-open"),()=>{document.body.classList.remove("modal-open")}),[]),e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"modal fade show d-block",id:"kt_modal_add_user",role:"dialog",tabIndex:-1,"aria-modal":"true",children:e.jsx("div",{className:"modal-dialog modal-dialog-centered mw-650px",children:e.jsxs("div",{className:"modal-content",children:[e.jsx(xa,{}),e.jsx("div",{className:"modal-body scroll-y mx-5 mx-xl-15 my-7",children:e.jsx(ha,{})})]})})}),e.jsx("div",{className:"modal-backdrop fade show"})]})),ja=n=>{const[l,c]=o.useState([]),[b,d]=o.useState(!1),u=o.useMemo(()=>[{accessorKey:"name",header:"Name"}],[]),m=_(({productId:s,order:t})=>Ve(n.id,s,t),{onSuccess:()=>{d(!0)}});o.useEffect(()=>{console.log("id",n.id),(async()=>{await Qe(n==null?void 0:n.id).catch(t=>console.log(t)).then(t=>c(t==null?void 0:t.products))})()},[n==null?void 0:n.id,b,m]);const x=F({autoResetPageIndex:!1,columns:u,data:l,enableRowOrdering:!0,enableSorting:!1,muiRowDragHandleProps:({table:s})=>({onDragEnd:async()=>{var f,j;const{draggingRow:t,hoveredRow:h}=s.getState();h&&t&&(console.log("hoveredRow",(f=h.original)==null?void 0:f.category[0].order,"draggingRow",t.original._id),await m.mutateAsync({productId:t.original._id,order:(j=h.original)==null?void 0:j.category[0].order}))}})});return e.jsx(be,{table:x})},ya=n=>{const[l,c]=o.useState([]),[b,d]=o.useState(!1),u=o.useMemo(()=>[{accessorKey:"name",header:"Name"},{accessorKey:"category.0.order",header:"Order"}],[]),m=_(({productId:s,order:t})=>Le(n.id,s,t),{onSuccess:()=>{d(!0)}});o.useEffect(()=>{(async()=>{await Ue(n==null?void 0:n.id).catch(t=>console.log(t)).then(t=>c(t==null?void 0:t.products))})()},[n.id,b]);const x=F({autoResetPageIndex:!1,columns:u,data:l,enableRowOrdering:!0,enableSorting:!1,muiRowDragHandleProps:({table:s})=>({onDragEnd:async()=>{var f,j;const{draggingRow:t,hoveredRow:h}=s.getState();h&&t&&(console.log("hoveredRow",(f=h.original)==null?void 0:f.category[0].order,"draggingRow",t.original._id),await m.mutateAsync({productId:t.original._id,order:(j=h.original)==null?void 0:j.category[0].order}))}})});return e.jsx(be,{table:x})},va=()=>{const{selected:n,clearSelected:l}=R(),c=qe(),{setItemIdForUpdate:b}=R(),[d,u]=o.useState({}),{active:m,archived:x}=ce(),{active:s,archived:t}=Ke(),h=Ge(),[f,j]=o.useState(!1),[xe,O]=o.useState(m),[fe,B]=o.useState(()=>x);o.useState(null);const[M,T]=o.useState(null),[je,$]=o.useState(!1),[ye,L]=o.useState(!1),[ve,U]=o.useState(!1),[g,P]=o.useState(),[H,q]=o.useState([...s,...t]);o.useState(!0);const[Ce,Se]=o.useState();g==null||g._id,o.useEffect(()=>{(async()=>{try{const r=await Ye(),i=await Xe();q([...r.data,...i.data])}catch(r){console.error("Error fetching branches:",r)}})()},[]);const K=o.useMemo(()=>H.map(a=>({value:a._id,label:a.name})),[H]),we=o.useMemo(()=>[{accessorKey:"name",header:"Name",size:50,muiEditTextFieldProps:{required:!0,error:!!(d!=null&&d.name),helperText:d==null?void 0:d.name,onFocus:()=>u({...d,name:void 0})}},{accessorKey:"description",header:"Description",size:100},{accessorKey:"order",header:"Order",size:30,muiTableBodyCellProps:{align:"center"},muiTableHeadCellProps:{align:"center"}},{accessorKey:"available",header:"Available",size:100,muiTableBodyCellProps:{align:"right"},muiTableHeadCellProps:{align:"left"},Cell:({cell:a})=>e.jsx("div",{className:"form-check form-switch form-check-custom form-check-solid",children:e.jsx("input",{className:"form-check-input cursor-pointer",type:"checkbox",checked:a.getValue(),onClick:()=>S.mutateAsync({id:a.row.original._id,update:{available:!a.row.original.available}}),id:a.row.original._id})})},{accessorKey:"branch",header:"Branch",editVariant:"select",grow:!0,size:200,muiTableBodyCellProps:{align:"center"},muiTableHeadCellProps:{align:"center"},Edit:({cell:a,row:r,table:i})=>{const y=a.getValue();let E=[];return y.map(k=>{E.push({value:k.branch._id,label:k.branch.name})}),e.jsx(ze,{className:"react-select-styled",classNamePrefix:"react-select",isMulti:!0,options:K,defaultValue:E,menuPortalTarget:document.body,styles:{menuPortal:k=>({...k,zIndex:9999})},onChange:k=>{const Ee=k?k.map(Ie=>Ie.value):[];Se(Ee)}})},Cell:({cell:a})=>{const r=a.getValue();return e.jsx(e.Fragment,{children:r.map(i=>e.jsx("span",{className:"badge badge-secondary me-1",children:i.branch.name}))})}}],[K,s,t,H,d]),Ae=me().shape({name:I().min(3,"Minimum 3 symbols").required("Name is required"),description:I().min(3,"Minimum 3 symbols").optional(),imgCover:I().min(3,"Minimum 3 symbols").optional(),order:ue().min(1,"Minimum order is 1").optional(),branch:We().of(I()).min(1,"Minimum 3 symbols").optional(),available:te().optional(),deleted:te().optional()}),G=async a=>{Ae.validate(a.row.original).catch(i=>u(i.message)),u({});const r={...a.values,branch:Ce.map(i=>({branch:i}))};await S.mutateAsync({id:a.row.original._id,update:r}),se.setEditingRow(null)},z=()=>{L(!0)},W=()=>{L(!1)},Y=()=>{U(!0)},X=()=>{U(!1)},Z=()=>{$(!0)},ke=async()=>{await Te.mutateAsync(),$(!1)},Ne=()=>{b(null)},J=()=>{$(!1)},Te=_(()=>Ze(g),{onSuccess:()=>{c.invalidateQueries([`${N.CATEGORIES_LIST}`]),c.invalidateQueries([`${N.ARCHIVED_CATEGORIES_LIST}`]),c.refetchQueries([`${N.CATEGORIES_LIST}`]),c.refetchQueries([`${N.ARCHIVED_CATEGORIES_LIST}`]),j(!0)}}),ee=_(a=>Je(a),{onSuccess:()=>{c.invalidateQueries([`${N.CATEGORIES_LIST}`]),c.invalidateQueries([`${N.ARCHIVED_CATEGORIES_LIST}`]),h(),j(!0),l()}}),S=_(({id:a,update:r})=>pe(a,r),{onSuccess:()=>{h(),j(!0)}}),ae={columns:we,enableRowDragging:!0,enableFullScreenToggle:!1,muiTableContainerProps:{sx:{minHeight:"320px"}}};o.useEffect(()=>{O(m),B(x),q([...s,...t])},[m,x,f,s,t]);const se=F({...ae,enableRowSelection:!0,enableStickyHeader:!0,enableCellActions:!0,enableClickToCopy:"context-menu",enableEditing:!0,editDisplayMode:"row",createDisplayMode:"row",rowPinningDisplayMode:"select-sticky",positionToolbarAlertBanner:"bottom",positionActionsColumn:"last",enableRowOrdering:!0,enableSorting:!1,enableExpandAll:!1,state:{columnOrder:["mrt-row-select","mrt-row-drag","name","description","order","mrt-row-expand","branch","available"]},muiDetailPanelProps:()=>({sx:a=>({backgroundColor:a.palette.mode==="dark"?"rgba(255,210,244,0.1)":"rgba(0,0,0,0.1)"})}),muiExpandButtonProps:({row:a,table:r})=>({onClick:()=>r.setExpanded({[a.id]:!a.getIsExpanded()}),sx:{transform:a.getIsExpanded()?"rotate(180deg)":"rotate(-90deg)",transition:"transform 0.2s"}}),renderDetailPanel:({row:a})=>a.original.branch?e.jsx(e.Fragment,{children:a.original.branch.map(r=>e.jsx("span",{className:"badge badge-secondary me-1",children:r.branch.name}))}):null,muiRowDragHandleProps:({table:a})=>({onDragEnd:async()=>{const{draggingRow:r,hoveredRow:i}=a.getState();M==="table-2"?(T(null),await S.mutateAsync({id:r==null?void 0:r.original._id,update:{deleted:!0}}),B(y=>[...y,r.original]),O(y=>y.filter(E=>E!==r.original))):i&&r&&(await S.mutateAsync({id:r==null?void 0:r.original._id,update:{order:i==null?void 0:i.original.order}}),T(null))}}),renderTopToolbarCustomActions:({table:a})=>e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"card-header ribbon ribbon-start",children:e.jsx("div",{className:"ribbon-label ribbon ribbon-start bg-success",children:"Active"})}),e.jsxs(v,{sx:{display:"flex",gap:"1rem",p:"4px",justifyContent:"right"},children:[e.jsx(C,{color:"info",onClick:Ne,variant:"contained",children:"Add Category"}),e.jsx(C,{color:"warning",onClick:async()=>{a.getSelectedRowModel().rows.map(async r=>{await S.mutateAsync({id:r.original._id,update:{available:!r.original.available}})}),a.toggleAllRowsSelected(!1)},variant:"contained",children:"Toggle Available"}),e.jsx(C,{color:"error",onClick:async()=>{let r=[];a.getSelectedRowModel().rows.map(i=>r.push(i.original._id)),await ee.mutateAsync(r),a.toggleAllRowsSelected(!1)},variant:"contained",children:"Delete Selected"})]})]}),data:xe,onEditingRowCancel:()=>u({}),onEditingRowSave:a=>G(a),getRowId:a=>`table-1-${a.name}`,muiTablePaperProps:{onDragEnter:()=>T("table-1"),sx:{outline:M==="table-1"?"2px dashed green":void 0}},displayColumnDefOptions:{"mrt-row-actions":{muiTableHeadCellProps:{align:"center"}}},renderRowActions:({row:a,table:r})=>e.jsxs(v,{sx:{display:"flex",gap:"1rem"},children:[e.jsx(w,{title:"Edit",children:e.jsx(A,{onClick:()=>r.setEditingRow(a),children:e.jsx(ne,{})})}),e.jsx(w,{title:"Delete",children:e.jsx(A,{color:"error",onClick:()=>{P(a.original._id),Z()},children:e.jsx(ie,{})})}),e.jsx(w,{title:"Arrange products",children:e.jsx(A,{color:"success",onClick:()=>{P(a.original),z()},children:e.jsx("i",{className:"fa-brands fa-2xl text-primary fa-product-hunt"})})}),e.jsx(w,{title:"Arrange SubCategories",children:e.jsx(A,{color:"warning",onClick:()=>{P(a.original),Y()},children:e.jsx("i",{className:"fa-solid fa-layer-group text-warning"})})})]})}),Pe=F({...ae,data:fe,enableRowSelection:!0,enableStickyHeader:!0,enableCellActions:!0,enableClickToCopy:"context-menu",enableEditing:!0,editDisplayMode:"row",createDisplayMode:"row",rowPinningDisplayMode:"select-sticky",positionToolbarAlertBanner:"bottom",positionActionsColumn:"last",enableRowOrdering:!0,enableSorting:!1,enableExpandAll:!1,state:{columnOrder:["mrt-row-select","mrt-row-drag","name","description","order","mrt-row-expand","branch","available"]},muiDetailPanelProps:()=>({sx:a=>({backgroundColor:a.palette.mode==="dark"?"rgba(255,210,244,0.1)":"rgba(0,0,0,0.1)"})}),muiExpandButtonProps:({row:a,table:r})=>({onClick:()=>r.setExpanded({[a.id]:!a.getIsExpanded()}),sx:{transform:a.getIsExpanded()?"rotate(180deg)":"rotate(-90deg)",transition:"transform 0.2s"}}),renderDetailPanel:({row:a})=>a.original.branch?e.jsx(e.Fragment,{children:a.original.branch.map(r=>e.jsx("span",{className:"badge badge-secondary me-1",children:r.branch.name}))}):null,muiRowDragHandleProps:({table:a})=>({onDragEnd:async()=>{const{draggingRow:r,hoveredRow:i}=a.getState();M==="table-1"?(T(null),await S.mutateAsync({id:r==null?void 0:r.original._id,update:{deleted:!1}}),B(y=>[...y,r.original]),O(y=>y.filter(E=>E!==r.original))):i&&r&&(await S.mutateAsync({id:r==null?void 0:r.original._id,update:{order:i==null?void 0:i.original.order}}),T(null))}}),renderTopToolbarCustomActions:({table:a})=>e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"card-header ribbon ribbon-start",children:e.jsx("div",{className:"ribbon-label ribbon ribbon-start bg-danger",children:"Archived"})}),e.jsxs(v,{sx:{display:"flex",gap:"1rem",p:"4px",justifyContent:"right"},children:[e.jsx(C,{color:"warning",onClick:async()=>{a.getSelectedRowModel().rows.map(async r=>{await S.mutateAsync({id:r.original._id,update:{available:!r.original.available}})}),a.toggleAllRowsSelected(!1)},variant:"contained",children:"Toggle Available"}),e.jsx(C,{color:"error",onClick:async()=>{let r=[];a.getSelectedRowModel().rows.map(i=>r.push(i.original._id)),await ee.mutateAsync(r),a.toggleAllRowsSelected(!1)},variant:"contained",children:"Delete Selected"})]})]}),defaultColumn:{size:100},onEditingRowCancel:()=>u({}),onEditingRowSave:a=>G(a),getRowId:a=>`table-2-${a.name}`,muiTablePaperProps:{onDragEnter:()=>T("table-2"),sx:{outline:M==="table-2"?"2px dashed pink":void 0}},displayColumnDefOptions:{"mrt-row-actions":{muiTableHeadCellProps:{align:"center"}}},renderRowActions:({row:a,table:r})=>e.jsxs(v,{sx:{display:"flex",gap:"1rem"},children:[e.jsx(w,{title:"Edit",children:e.jsx(A,{onClick:()=>r.setEditingRow(a),children:e.jsx(ne,{})})}),e.jsx(w,{title:"Delete",children:e.jsx(A,{color:"error",onClick:()=>{P(a.original._id),Z()},children:e.jsx(ie,{})})}),e.jsx(w,{title:"Arrange products",children:e.jsx(A,{color:"success",onClick:()=>{P(a.original),z()},children:e.jsx("i",{className:"fa-brands fa-2xl text-primary fa-product-hunt"})})}),e.jsx(w,{title:"Arrange SubCategories",children:e.jsx(A,{color:"warning",onClick:()=>{P(a.original),Y()},children:e.jsx("i",{className:"fa-solid fa-layer-group text-warning"})})})]})});return e.jsxs(e.Fragment,{children:[e.jsx(v,{sx:{display:"grid",gap:"1rem",overflow:"auto",p:"4px"},children:e.jsx(oe,{table:se})}),e.jsx(v,{sx:{display:"grid",gap:"1rem",overflow:"auto",p:"4px"},children:e.jsx(oe,{table:Pe})}),e.jsxs(p,{show:je,onHide:J,children:[e.jsx(p.Header,{closeButton:!0,children:e.jsx(p.Title,{children:"Confirm Deletion"})}),e.jsx(p.Body,{children:"Are you sure you want to delete this item?"}),e.jsx(p.Footer,{children:e.jsxs(v,{sx:{display:"flex",gap:"1rem",p:"4px"},children:[e.jsx(C,{color:"info",variant:"contained",onClick:J,children:"Cancel"}),e.jsx(C,{color:"error",variant:"contained",onClick:ke,children:"Delete"})]})})]}),e.jsxs(p,{show:ye,onHide:W,children:[e.jsx(p.Header,{closeButton:!0,children:e.jsxs(p.Title,{children:["Arrange Procusts Order in ",g==null?void 0:g.name," Category"]})}),e.jsx(p.Body,{children:e.jsx(ja,{id:g==null?void 0:g._id})}),e.jsx(p.Footer,{children:e.jsx(v,{sx:{display:"flex",gap:"1rem",p:"4px"},children:e.jsx(C,{color:"info",variant:"contained",onClick:W,children:"Close"})})})]}),e.jsxs(p,{show:ve,onHide:X,children:[e.jsx(p.Header,{closeButton:!0,children:e.jsxs(p.Title,{children:["Arrange SubCategories Order in ",g==null?void 0:g.name," Category"]})}),e.jsx(p.Body,{children:e.jsx(ya,{id:g==null?void 0:g._id})}),e.jsx(p.Footer,{children:e.jsx(v,{sx:{display:"flex",gap:"1rem",p:"4px"},children:e.jsx(C,{color:"info",variant:"contained",onClick:X,children:"Close"})})})]})]})},Ca=()=>{const{itemIdForUpdate:n}=R();return e.jsxs(e.Fragment,{children:[e.jsx(la,{children:e.jsx(va,{})}),n!==void 0&&e.jsx(fa,{})]})},Sa=()=>e.jsx(ea,{children:e.jsx(aa,{children:e.jsx(sa,{children:e.jsx(ra,{children:e.jsxs(ga,{children:[e.jsx(ta,{}),e.jsx(oa,{backend:na,children:e.jsx(ia,{children:e.jsx(Ca,{})})})]})})})})}),wa=[{title:"Category Management",path:"/apps/eCommerce/categories",isSeparator:!1,isActive:!1},{title:"",path:"",isSeparator:!0,isActive:!1}],ka=()=>e.jsxs(da,{children:[e.jsx(V,{element:e.jsx(ca,{}),children:e.jsx(V,{path:"categories",element:e.jsxs(e.Fragment,{children:[e.jsx(ma,{breadcrumbs:wa,children:"Categories list"}),e.jsx(Sa,{})]})})}),e.jsx(V,{index:!0,element:e.jsx(ua,{to:"/apps/eCommerce/categories"})})]});export{ka as default};
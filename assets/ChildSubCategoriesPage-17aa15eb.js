import{r as i,ar as W,aZ as xe,a_ as fe,as as Le,at as ze,z as e,au as Ue,av as Ke,a0 as Ce,a$ as ve,a1 as P,G as ce,a5 as qe,aC as je,b0 as ye,b1 as Ge,ab as B,ao as We,b2 as Ye,ap as N,K as Xe,ay as F,aK as Y,b3 as Ze,b4 as Je,b5 as ea,ax as aa,aF as sa,b6 as ta,b7 as ra,b8 as ia,b9 as q,aG as me,a7 as ue,aL as w,aM as ge,aN as v,aO as A,ba as oa,bb as la,bc as na,bd as da,be as ca,bf as ma,bg as ua,bh as ga,aR as _,aS as I,aT as be,aU as he,bi as ba,bj as ha,aV as pa,aW as xa,T as fa,E as Ca,aX as va,aY as ja,aD as ya,M as Sa,N as G,O as wa,P as Aa,Q as Na}from"./index-8a491e06.js";const Se=i.createContext(W),Pa=({children:d})=>{const[m,g]=i.useState(W.selected),[p,u]=i.useState(W.itemIdForUpdate),{isLoading:b}=xe(),h=fe(),j=i.useMemo(()=>Le(b,h),[b,h]),t=i.useMemo(()=>ze(h,m),[h,m]);return e.jsx(Se.Provider,{value:{selected:m,itemIdForUpdate:p,setItemIdForUpdate:u,disabled:j,isAllSelected:t,onSelect:n=>{Ue(n,m,g)},onSelectAll:()=>{Ke(t,g,h)},clearSelected:()=>{g([])}},children:d})},R=()=>i.useContext(Se),Ea=()=>{const d={borderRadius:"0.475rem",boxShadow:"0 0 50px 0 rgb(82 63 105 / 15%)",backgroundColor:"#fff",color:"#7e8299",fontWeight:"500",margin:"0",width:"auto",padding:"1rem 2rem",top:"calc(50% - 2rem)",left:"calc(50% - 4rem)"};return e.jsx("div",{style:{...d,position:"absolute",textAlign:"center"},children:"Processing..."})},Ta=Ce().shape({order:ve().min(0,"Order can't be negative"),name:P().min(3,"Minimum 3 symbols").required("Name is required"),description:P().min(3,"Minimum 3 symbols")}),pe=({subCategory:d,isSubCategoryLoading:m})=>{const{setItemIdForUpdate:g}=R(),{refetch:p}=xe(),[u]=i.useState({...d,available:d.available||!0,name:d.name||""}),b=n=>{n&&p(),g(void 0)},h=ce("media/svg/avatars/blank.svg"),j=ce(`media/${u.imgCover}`),t=qe({initialValues:u,validationSchema:Ta,onSubmit:async(n,{setSubmitting:y})=>{y(!0);try{je(n._id)?await ye(n==null?void 0:n._id,n):await Ge(n)}catch(E){console.error(E)}finally{y(!0),b(!0)}}});return e.jsxs(e.Fragment,{children:[e.jsxs("form",{id:"kt_modal_add_user_form",className:"form ",onSubmit:t.handleSubmit,noValidate:!0,children:[e.jsxs("div",{className:"d-flex flex-column scroll-y me-n7 pe-7",id:"kt_modal_add_user_scroll","data-kt-scroll":"true","data-kt-scroll-activate":"{default: false, lg: true}","data-kt-scroll-max-height":"auto","data-kt-scroll-dependencies":"#kt_modal_add_user_header","data-kt-scroll-wrappers":"#kt_modal_add_user_scroll","data-kt-scroll-offset":"300px",children:[e.jsxs("div",{className:"fv-row mb-7",children:[e.jsx("label",{className:"d-block fw-bold fs-6 ms-2 mb-5",children:"ImgCover"}),e.jsx("div",{className:"image-input image-input-outline ms-2","data-kt-image-input":"true",style:{backgroundImage:`url('${h}')`},children:e.jsx("div",{className:"image-input-wrapper w-125px h-125px ms-2",style:{backgroundImage:`url('${j}')`}})})]}),e.jsxs("div",{className:"fv-row mb-7",children:[e.jsx("label",{className:"required fw-bold fs-6 ps-2 mb-2",children:"Name"}),e.jsx("input",{placeholder:"Full name",...t.getFieldProps("name"),type:"text",name:"name",className:B("form-control form-control-solid mb-3 ms-2 mb-lg-0",{"is-invalid":t.touched.name&&t.errors.name},{"is-valid":t.touched.name&&!t.errors.name}),autoComplete:"off",disabled:t.isSubmitting||m}),t.touched.name&&t.errors.name&&e.jsx("div",{className:"fv-plugins-message-container",children:e.jsx("div",{className:"fv-help-block",children:e.jsx("span",{role:"alert",children:t.errors.name})})})]}),e.jsxs("div",{className:"fv-row mb-7",children:[e.jsx("label",{className:"required fw-bold fs-6  ms-2 mb-2",children:"Order"}),e.jsx("input",{placeholder:"order",...t.getFieldProps("order"),className:B("form-control form-control-solid mb-3 mb-lg-0 ms-2",{"is-invalid":t.touched.order&&t.errors.order},{"is-valid":t.touched.order&&!t.errors.order}),type:"text",name:"order",autoComplete:"off",disabled:t.isSubmitting||m}),t.touched.order&&t.errors.order&&e.jsx("div",{className:"fv-plugins-message-container",children:e.jsx("span",{role:"alert",children:t.errors.order})})]}),e.jsxs("div",{className:"fv-row mb-7",children:[e.jsx("label",{className:"required fw-bold fs-6 mb-2 ms-2",children:"Description"}),e.jsx("input",{placeholder:"description",...t.getFieldProps("description"),className:B("form-control form-control-solid mb-3 mb-lg-0 ms-2",{"is-invalid":t.touched.description&&t.errors.description},{"is-valid":t.touched.description&&!t.errors.description}),type:"text",name:"description",autoComplete:"off",disabled:t.isSubmitting||m}),t.touched.description&&t.errors.description&&e.jsx("div",{className:"fv-plugins-message-container",children:e.jsx("span",{role:"alert",children:t.errors.description})})]}),e.jsxs("div",{className:"fv-row mb-7",children:[e.jsx("label",{className:"required fw-bold fs-6 mb-2 ms-2",children:"Available"}),e.jsxs("select",{...t.getFieldProps("available"),className:B("form-control form-control-solid mb-3 mb-lg-0 ms-2",{"is-invalid":t.touched.description&&t.errors.description},{"is-valid":t.touched.description&&!t.errors.description}),name:"available",autoComplete:"off",disabled:t.isSubmitting||m,children:[e.jsx("option",{value:"true",children:"Yes"}),e.jsx("option",{value:"false",children:"No"})]}),t.touched.available&&t.errors.available&&e.jsx("div",{className:"fv-plugins-message-container",children:e.jsx("span",{role:"alert",children:t.errors.available})})]})]}),e.jsxs("div",{className:"text-center pt-15",children:[e.jsx("button",{type:"reset",onClick:()=>b(),className:"btn btn-light me-3","data-kt-users-modal-action":"cancel",disabled:t.isSubmitting||m,children:"Discard"}),e.jsxs("button",{type:"submit",className:"btn btn-primary","data-kt-users-modal-action":"submit",disabled:m||t.isSubmitting||!t.isValid||!t.touched,children:[e.jsx("span",{className:"indicator-label",children:"Submit"}),(t.isSubmitting||m)&&e.jsxs("span",{className:"indicator-progress",children:["Please wait..."," ",e.jsx("span",{className:"spinner-border spinner-border-sm align-middle ms-2"})]})]})]})]}),(t.isSubmitting||m)&&e.jsx(Ea,{})]})},ka=()=>{const{itemIdForUpdate:d,setItemIdForUpdate:m}=R(),g=je(d),{isLoading:p,data:u,error:b}=We(`${N.CHILD_SUB_CATEGORIES_LIST}-xhildsubcategory-${d}`,()=>Ye(d),{cacheTime:0,enabled:g,onError:h=>{m(void 0),console.error(h)}});return d?!p&&!b&&u?e.jsx(pe,{isSubCategoryLoading:p,subCategory:u}):null:e.jsx(pe,{isSubCategoryLoading:p,subCategory:{_id:void 0,available:!0}})},_a=()=>{const{setItemIdForUpdate:d}=R();return e.jsxs("div",{className:"modal-header",children:[e.jsx("h2",{className:"fw-bolder",children:"Add SubCategory"}),e.jsx("div",{className:"btn btn-icon btn-sm btn-active-icon-primary","data-kt-users-modal-action":"close",onClick:()=>d(void 0),style:{cursor:"pointer"},children:e.jsx(Xe,{iconName:"cross",className:"fs-1"})})]})},Ia=()=>(i.useEffect(()=>(document.body.classList.add("modal-open"),()=>{document.body.classList.remove("modal-open")}),[]),e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"modal fade show d-block",id:"kt_modal_add_user",role:"dialog",tabIndex:-1,"aria-modal":"true",children:e.jsx("div",{className:"modal-dialog modal-dialog-centered mw-650px",children:e.jsxs("div",{className:"modal-content",children:[e.jsx(_a,{}),e.jsx("div",{className:"modal-body scroll-y mx-5 mx-xl-15 my-7",children:e.jsx(ka,{})})]})})}),e.jsx("div",{className:"modal-backdrop fade show"})]})),Ra=d=>{const[m,g]=i.useState([]),[p,u]=i.useState(!1),b=i.useMemo(()=>[{accessorKey:"name",header:"Name"},{accessorKey:"childSubCategory.0.order",header:"Order"}],[]),h=F(({productId:t,order:n})=>Je(d.id,t,n),{onSuccess:()=>{u(!0)}});i.useEffect(()=>{console.log("id",d.id),(async()=>{await ea(d==null?void 0:d.id).catch(n=>console.log(n)).then(n=>g(n==null?void 0:n.products))})()},[d==null?void 0:d.id,p]);const j=Y({autoResetPageIndex:!1,columns:b,data:m,enableRowOrdering:!0,enableSorting:!1,muiRowDragHandleProps:({table:t})=>({onDragEnd:async()=>{var E,M;const{draggingRow:n,hoveredRow:y}=t.getState();y&&n&&(console.log("hoveredRow",(E=y.original)==null?void 0:E.childSubCategory[0].order,"draggingRow",n.original._id),await h.mutateAsync({productId:n.original._id,order:(M=y.original)==null?void 0:M.childSubCategory[0].order}))}})});return e.jsx(Ze,{table:j})},Ma=()=>{const{selected:d,clearSelected:m}=R(),g=aa(),{setItemIdForUpdate:p}=R(),[u,b]=i.useState({}),{active:h,archived:j}=fe(),{active:t,archived:n}=sa(),{active:y,archived:E}=ta(),{active:M,archived:we}=ra(),X=ia(),[Ae,V]=i.useState(!1),[Ne,O]=i.useState(h),[Pe,$]=i.useState(()=>j);i.useState(null);const[T,k]=i.useState(null),[Ee,H]=i.useState(!1),[Te,Z]=i.useState(!1);i.useState(!1);const[C,D]=i.useState(),[Q,J]=i.useState([...t,...n]),[ee,ke]=i.useState([...y,...E]),[ae,_e]=i.useState([...M,...we]);i.useState(!0);const[L,Ie]=i.useState(),[z,Re]=i.useState(),[U,Me]=i.useState();C==null||C._id,i.useEffect(()=>{(async()=>{try{const l=await oa(),c=await la();J([...l.data,...c.data])}catch(l){console.error("Error fetching branches:",l)}})(),(async()=>{try{const l=await na(),c=await da();ke([...l.data,...c.data])}catch(l){console.error("Error fetching categories:",l)}})(),(async()=>{try{const l=await ca(),c=await ma();_e([...l.data,...c.data])}catch(l){console.error("Error fetching subcategories:",l)}})()},[]);const K=i.useMemo(()=>Q.map(a=>({value:a._id,label:a.name})),[Q]),De=i.useMemo(()=>ee.map(a=>({value:a._id,label:a.name})),[ee]),Be=i.useMemo(()=>ae.map(a=>({value:a._id,label:a.name})),[ae]),Fe=i.useMemo(()=>[{accessorKey:"name",header:"Name",size:50,muiEditTextFieldProps:{required:!0,error:!!(u!=null&&u.name),helperText:u==null?void 0:u.name,onFocus:()=>b({...u,name:void 0})}},{accessorKey:"description",header:"Description",size:100},{accessorKey:"order",header:"Order",size:30,muiTableBodyCellProps:{align:"center"},muiTableHeadCellProps:{align:"center"}},{accessorKey:"available",header:"Available",size:100,muiTableBodyCellProps:{align:"right"},muiTableHeadCellProps:{align:"left"},Cell:({cell:a})=>e.jsx("div",{className:"form-check form-switch form-check-custom form-check-solid",children:e.jsx("input",{className:"form-check-input cursor-pointer",type:"checkbox",checked:a.getValue(),onClick:()=>S.mutateAsync({id:a.row.original._id,update:{available:!a.row.original.available}}),id:a.row.original._id})})},{accessorKey:"category",header:"Category",editVariant:"select",grow:!0,size:200,muiTableBodyCellProps:{align:"center"},muiTableHeadCellProps:{align:"center"},Edit:({cell:a,row:s,table:r})=>{const l=a.getValue();let c=[];return l.map(o=>{var x,f;c.push({value:(x=o==null?void 0:o.category)==null?void 0:x._id,label:(f=o==null?void 0:o.category)==null?void 0:f.name})}),console.log("edit",c),e.jsx(q,{className:"react-select-styled",classNamePrefix:"react-select",isMulti:!0,options:De,defaultValue:c,menuPortalTarget:document.body,styles:{menuPortal:o=>({...o,zIndex:9999})},onChange:o=>{const x=o?o.map(f=>f.value):[];Re(x)}})},Cell:({cell:a})=>{const s=a.getValue();return e.jsx(e.Fragment,{children:s==null?void 0:s.map(r=>e.jsx("span",{className:"badge badge-warning me-1",children:r.category.name}))})}},{accessorKey:"subCategory",header:"SubCategory",editVariant:"select",grow:!0,size:200,muiTableBodyCellProps:{align:"center"},muiTableHeadCellProps:{align:"center"},Edit:({cell:a,row:s,table:r})=>{const l=a.getValue();console.log("subcategories from child",l);let c=[];return l.map(o=>{var x,f;c.push({value:(x=o==null?void 0:o.subCategory)==null?void 0:x._id,label:(f=o==null?void 0:o.subCategory)==null?void 0:f.name})}),console.log("edit",c),e.jsx(q,{className:"react-select-styled",classNamePrefix:"react-select",isMulti:!0,options:Be,defaultValue:c,menuPortalTarget:document.body,styles:{menuPortal:o=>({...o,zIndex:9999})},onChange:o=>{const x=o?o.map(f=>f.value):[];Me(x)}})},Cell:({cell:a})=>{const s=a.getValue();return e.jsx(e.Fragment,{children:s==null?void 0:s.map(r=>{var l;return e.jsx("span",{className:"badge badge-primary me-1",children:(l=r==null?void 0:r.subCategory)==null?void 0:l.name})})})}},{accessorKey:"branch",header:"Branch",editVariant:"select",grow:!0,size:200,muiTableBodyCellProps:{align:"center"},muiTableHeadCellProps:{align:"center"},Edit:({cell:a,row:s,table:r})=>{const l=a.getValue();console.log("branchs from sub",K);let c=[];return l.map(o=>{c.push({value:o.branch._id,label:o.branch.name})}),e.jsx(q,{className:"react-select-styled",classNamePrefix:"react-select",isMulti:!0,options:K,defaultValue:c,menuPortalTarget:document.body,styles:{menuPortal:o=>({...o,zIndex:9999})},onChange:o=>{const x=o?o.map(f=>f.value):[];Ie(x)}})},Cell:({cell:a})=>{const s=a.getValue();return e.jsx(e.Fragment,{children:s.map(r=>e.jsx("span",{className:"badge badge-secondary me-1",children:r.branch.name}))})}}],[K,t,n,Q,u]),Ve=Ce().shape({name:P().min(3,"Minimum 3 symbols").required("Name is required"),description:P().min(3,"Minimum 3 symbols").optional(),imgCover:P().min(3,"Minimum 3 symbols").optional(),order:ve().min(1,"Minimum order is 1").optional(),branch:me().of(P()).min(1,"Minimum 3 symbols").optional(),category:me().of(P()).min(1,"Minimum 3 symbols").optional(),available:ue().optional(),deleted:ue().optional()}),se=async a=>{Ve.validate(a.row.original).catch(r=>b(r.message)),b({});const s={...a.values,branch:L==null?void 0:L.map(r=>({branch:r})),category:z==null?void 0:z.map(r=>({category:r})),subCategory:U==null?void 0:U.map(r=>({subCategory:r}))};await S.mutateAsync({id:a.row.original._id,update:s}),de.setEditingRow(null)},te=()=>{Z(!0)},re=()=>{Z(!1)},ie=()=>{H(!0)},Oe=async()=>{await He.mutateAsync(),H(!1)},$e=()=>{p(null)},oe=()=>{H(!1)},He=F(()=>ua(C),{onSuccess:()=>{g.invalidateQueries([`${N.CATEGORIES_LIST}`]),g.invalidateQueries([`${N.ARCHIVED_CATEGORIES_LIST}`]),g.refetchQueries([`${N.CATEGORIES_LIST}`]),g.refetchQueries([`${N.ARCHIVED_CATEGORIES_LIST}`]),V(!0)}}),le=F(a=>ga(a),{onSuccess:()=>{g.invalidateQueries([`${N.CATEGORIES_LIST}`]),g.invalidateQueries([`${N.ARCHIVED_CATEGORIES_LIST}`]),X(),V(!0),m()}}),S=F(({id:a,update:s})=>ye(a,s),{onSuccess:()=>{X(),V(!0)}}),ne={columns:Fe,enableRowDragging:!0,enableFullScreenToggle:!1,muiTableContainerProps:{sx:{minHeight:"320px"}}};i.useEffect(()=>{O(h),$(j),J([...t,...n])},[h,j,Ae,t,n]);const de=Y({...ne,enableRowSelection:!0,enableStickyHeader:!0,enableCellActions:!0,enableClickToCopy:"context-menu",enableEditing:!0,editDisplayMode:"row",createDisplayMode:"row",rowPinningDisplayMode:"select-sticky",positionToolbarAlertBanner:"bottom",positionActionsColumn:"last",enableRowOrdering:!0,enableSorting:!0,enableExpandAll:!0,state:{columnOrder:["mrt-row-select","mrt-row-drag","name","description","order","mrt-row-expand","branch","category","subCategory","available"]},muiDetailPanelProps:()=>({sx:a=>({backgroundColor:a.palette.mode==="dark"?"rgba(255,210,244,0.1)":"rgba(0,0,0,0.1)"})}),muiExpandButtonProps:({row:a,table:s})=>({onClick:()=>s.setExpanded({[a.id]:!a.getIsExpanded()}),sx:{transform:a.getIsExpanded()?"rotate(180deg)":"rotate(-90deg)",transition:"transform 0.2s"}}),renderDetailPanel:({row:a})=>a.original.branch?e.jsxs("div",{className:"d-flex justify-content-evenly",children:[e.jsxs("div",{children:["Branches :",a.original.branch.map((s,r)=>e.jsx("span",{className:"badge badge-secondary me-1",children:s.branch.name},r))]}),e.jsxs("div",{children:["Categories :",a.original.category.map((s,r)=>e.jsx("span",{className:"badge badge-warning me-1",children:s.category.name},r))]}),e.jsxs("div",{children:["subCategories :",a.original.subCategory.map((s,r)=>e.jsx("span",{className:"badge badge-primary me-1",children:s.subCategory.name},r))]})]}):null,muiRowDragHandleProps:({table:a})=>({onDragEnd:async()=>{const{draggingRow:s,hoveredRow:r}=a.getState();T==="table-2"?(console.log("table-2"),await S.mutateAsync({id:s==null?void 0:s.original._id,update:{deleted:!0}}),$(l=>[...l,s.original]),O(l=>l.filter(c=>c!==s.original)),k(null)):T==="table-1"&&(k(null),console.log("draggingRow?.original._id",s),await S.mutateAsync({id:s==null?void 0:s.original._id,update:{order:r==null?void 0:r.original.order}}))}}),renderTopToolbarCustomActions:({table:a})=>e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"card-header ribbon ribbon-start",children:e.jsx("div",{className:"ribbon-label ribbon ribbon-start bg-success",children:"Active"})}),e.jsxs(w,{sx:{display:"flex",gap:"1rem",p:"4px",justifyContent:"right"},children:[e.jsx(A,{color:"info",onClick:$e,variant:"contained",children:"Add ChildSubCategory"}),e.jsx(A,{color:"warning",onClick:async()=>{a.getSelectedRowModel().rows.map(async s=>{await S.mutateAsync({id:s.original._id,update:{available:!s.original.available}})}),a.toggleAllRowsSelected(!1)},variant:"contained",children:"Toggle Available"}),e.jsx(A,{color:"error",onClick:async()=>{let s=[];a.getSelectedRowModel().rows.map(r=>s.push(r.original._id)),await le.mutateAsync(s),a.toggleAllRowsSelected(!1)},variant:"contained",children:"Delete Selected"})]})]}),data:Ne,onEditingRowCancel:()=>b({}),onEditingRowSave:a=>se(a),getRowId:a=>`table-1-${a.name}`,muiTablePaperProps:{onDragEnter:()=>k("table-1"),sx:{outline:T==="table-1"?"2px dashed green":void 0}},displayColumnDefOptions:{"mrt-row-actions":{muiTableHeadCellProps:{align:"center"}}},renderRowActions:({row:a,table:s})=>e.jsxs(w,{sx:{display:"flex",gap:"1rem"},children:[e.jsx(_,{title:"Edit",children:e.jsx(I,{onClick:()=>s.setEditingRow(a),children:e.jsx(be,{})})}),e.jsx(_,{title:"Delete",children:e.jsx(I,{color:"error",onClick:()=>{D(a.original._id),ie()},children:e.jsx(he,{})})}),e.jsx(_,{title:"Arrange products",children:e.jsx(I,{color:"success",onClick:()=>{D(a.original),te()},children:e.jsx("i",{className:"fa-brands fa-2xl text-primary fa-product-hunt"})})})]})}),Qe=Y({...ne,data:Pe,enableRowSelection:!0,enableStickyHeader:!0,enableCellActions:!0,enableClickToCopy:"context-menu",enableEditing:!0,editDisplayMode:"row",createDisplayMode:"row",rowPinningDisplayMode:"select-sticky",positionToolbarAlertBanner:"bottom",positionActionsColumn:"last",enableRowOrdering:!0,enableSorting:!0,enableExpandAll:!0,state:{columnOrder:["mrt-row-select","mrt-row-drag","name","description","order","mrt-row-expand","branch","category","subCategory","available"]},muiDetailPanelProps:()=>({sx:a=>({backgroundColor:a.palette.mode==="dark"?"rgba(255,210,244,0.1)":"rgba(0,0,0,0.1)"})}),muiExpandButtonProps:({row:a,table:s})=>({onClick:()=>s.setExpanded({[a.id]:!a.getIsExpanded()}),sx:{transform:a.getIsExpanded()?"rotate(180deg)":"rotate(-90deg)",transition:"transform 0.2s"}}),renderDetailPanel:({row:a})=>a.original.branch?e.jsxs("div",{className:"d-flex justify-content-evenly",children:[e.jsxs("div",{children:["Branches :",a.original.branch.map((s,r)=>e.jsx("span",{className:"badge badge-secondary me-1",children:s.branch.name},r))]}),e.jsxs("div",{children:["Categories :",a.original.category.map((s,r)=>e.jsx("span",{className:"badge badge-warning me-1",children:s.category.name},r))]}),e.jsxs("div",{children:["subCategories :",a.original.subCategory.map((s,r)=>e.jsx("span",{className:"badge badge-primary me-1",children:s.subCategory.name},r))]})]}):null,muiRowDragHandleProps:({table:a})=>({onDragEnd:async()=>{const{draggingRow:s,hoveredRow:r}=a.getState();T==="table-1"?(console.log("table-1"),await S.mutateAsync({id:s==null?void 0:s.original._id,update:{deleted:!1}}),$(l=>[...l,s.original]),O(l=>l.filter(c=>c!==s.original)),k(null)):T==="table-2"&&(k(null),console.log("draggingRow?.original._id",s),await S.mutateAsync({id:s==null?void 0:s.original._id,update:{order:r==null?void 0:r.original.order}}))}}),renderTopToolbarCustomActions:({table:a})=>e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"card-header ribbon ribbon-start",children:e.jsx("div",{className:"ribbon-label ribbon ribbon-start bg-danger",children:"Archived"})}),e.jsxs(w,{sx:{display:"flex",gap:"1rem",p:"4px",justifyContent:"right"},children:[e.jsx(A,{color:"warning",onClick:async()=>{a.getSelectedRowModel().rows.map(async s=>{await S.mutateAsync({id:s.original._id,update:{available:!s.original.available}})}),a.toggleAllRowsSelected(!1)},variant:"contained",children:"Toggle Available"}),e.jsx(A,{color:"error",onClick:async()=>{let s=[];a.getSelectedRowModel().rows.map(r=>s.push(r.original._id)),await le.mutateAsync(s),a.toggleAllRowsSelected(!1)},variant:"contained",children:"Delete Selected"})]})]}),onEditingRowCancel:()=>b({}),onEditingRowSave:a=>se(a),getRowId:a=>`table-2-${a.name}`,muiTablePaperProps:{onDragEnter:()=>k("table-2"),sx:{outline:T==="table-2"?"2px dashed pink":void 0}},displayColumnDefOptions:{"mrt-row-actions":{muiTableHeadCellProps:{align:"center"}}},renderRowActions:({row:a,table:s})=>e.jsxs(w,{sx:{display:"flex",gap:"1rem"},children:[e.jsx(_,{title:"Edit",children:e.jsx(I,{onClick:()=>s.setEditingRow(a),children:e.jsx(be,{})})}),e.jsx(_,{title:"Delete",children:e.jsx(I,{color:"error",onClick:()=>{D(a.original._id),ie()},children:e.jsx(he,{})})}),e.jsx(_,{title:"Arrange products",children:e.jsx(I,{color:"success",onClick:()=>{D(a.original),te()},children:e.jsx("i",{className:"fa-brands fa-2xl text-primary fa-product-hunt"})})})]})});return e.jsxs(e.Fragment,{children:[e.jsx(w,{sx:{display:"grid",gap:"1rem",overflow:"auto",p:"4px"},children:e.jsx(ge,{table:de})}),e.jsx(w,{sx:{display:"grid",gap:"1rem",overflow:"auto",p:"4px"},children:e.jsx(ge,{table:Qe})}),e.jsxs(v,{show:Ee,onHide:oe,children:[e.jsx(v.Header,{closeButton:!0,children:e.jsx(v.Title,{children:"Confirm Deletion"})}),e.jsx(v.Body,{children:"Are you sure you want to delete this item?"}),e.jsx(v.Footer,{children:e.jsxs(w,{sx:{display:"flex",gap:"1rem",p:"4px"},children:[e.jsx(A,{color:"info",variant:"contained",onClick:oe,children:"Cancel"}),e.jsx(A,{color:"error",variant:"contained",onClick:Oe,children:"Delete"})]})})]}),e.jsxs(v,{show:Te,onHide:re,children:[e.jsx(v.Header,{closeButton:!0,children:e.jsxs(v.Title,{children:["Arrange Procusts Order in ",C==null?void 0:C.name," SubCategory"]})}),e.jsx(v.Body,{children:e.jsx(Ra,{id:C==null?void 0:C._id})}),e.jsx(v.Footer,{children:e.jsx(w,{sx:{display:"flex",gap:"1rem",p:"4px"},children:e.jsx(A,{color:"info",variant:"contained",onClick:re,children:"Close"})})})]})]})},Da=()=>{const{itemIdForUpdate:d}=R();return e.jsxs(e.Fragment,{children:[e.jsx(ya,{children:e.jsx(Ma,{})}),d!==void 0&&e.jsx(Ia,{})]})},Ba=()=>e.jsx(ba,{children:e.jsx(ha,{children:e.jsx(pa,{children:e.jsx(xa,{children:e.jsxs(Pa,{children:[e.jsx(fa,{}),e.jsx(Ca,{children:e.jsx(va,{backend:ja,children:e.jsx(Da,{})})})]})})})})}),Fa=[{title:"ChildSubCategory Management",path:"/apps/eCommerce/childSubCategories",isSeparator:!1,isActive:!1},{title:"",path:"",isSeparator:!0,isActive:!1}],Oa=()=>e.jsxs(Sa,{children:[e.jsx(G,{element:e.jsx(wa,{}),children:e.jsx(G,{path:"childSubCategories",element:e.jsxs(e.Fragment,{children:[e.jsx(Aa,{breadcrumbs:Fa,children:"ChildSubCategories list"}),e.jsx(Ba,{})]})})}),e.jsx(G,{index:!0,element:e.jsx(Na,{to:"/apps/eCommerce/childSubCategories"})})]});export{Oa as default};
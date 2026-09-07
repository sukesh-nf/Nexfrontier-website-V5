(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,76487,e=>{"use strict";e.i(47167);var r=e.i(43476),n=e.i(71645),a=e.i(71689),i=e.i(70756),s=e.i(63209),d=e.i(31278),t=e.i(72520),o=e.i(94351),c=e.i(92270);let l={ASSUMPTION:{bg:"rgba(148, 163, 184, 0.06)",color:"var(--nf-text-tertiary)",border:"rgba(148, 163, 184, 0.2)"},HYPOTHESIS:{bg:"rgba(12, 192, 223, 0.04)",color:"var(--nf-cyan)",border:"rgba(12, 192, 223, 0.15)"},THESIS:{bg:"rgba(12, 192, 223, 0.06)",color:"var(--nf-cyan)",border:"rgba(12, 192, 223, 0.2)"},EVIDENCE:{bg:"rgba(12, 192, 223, 0.10)",color:"var(--nf-cyan)",border:"rgba(12, 192, 223, 0.3)"},"CUSTOMER VALIDATION":{bg:"rgba(52, 211, 153, 0.06)",color:"var(--nf-positive)",border:"rgba(52, 211, 153, 0.2)"},"PAID VALIDATION":{bg:"rgba(52, 211, 153, 0.10)",color:"var(--nf-positive)",border:"rgba(52, 211, 153, 0.3)"},"REPEATABLE PROOF":{bg:"rgba(52, 211, 153, 0.14)",color:"var(--nf-positive)",border:"rgba(52, 211, 153, 0.4)"}};function m({state:e}){let n=l[e];return(0,r.jsx)("span",{style:{display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"0.6875rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"5px 12px",borderRadius:"999px",background:n.bg,color:n.color,border:`1px solid ${n.border}`},children:e})}var f=e.i(78583);function p({items:e}){return e.length?(0,r.jsxs)("div",{style:{marginTop:"var(--nf-space-6)"},children:[(0,r.jsx)("span",{style:{display:"block",fontSize:"0.6875rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--nf-text-tertiary)",marginBottom:"var(--nf-space-4)"},children:"Supporting Material"}),(0,r.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"2px"},children:e.map((e,n)=>(0,r.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"12px",padding:"12px 16px",background:"var(--nf-bg-surface-1)",border:"1px solid var(--nf-border)",borderRadius:"var(--nf-radius-control)"},children:[(0,r.jsx)(f.FileText,{size:16,color:"var(--nf-cyan)"}),(0,r.jsxs)("div",{style:{flex:1},children:[(0,r.jsx)("p",{style:{fontSize:"0.875rem",fontWeight:500,color:"var(--nf-text-primary)",margin:0},children:e.name}),e.description&&(0,r.jsx)("p",{style:{fontSize:"0.75rem",color:"var(--nf-text-tertiary)",margin:"2px 0 0"},children:e.description})]}),e.href&&(0,r.jsx)("a",{href:e.href,target:"_blank",rel:"noopener noreferrer",style:{fontSize:"0.75rem",fontWeight:600,color:"var(--nf-cyan)",textDecoration:"none"},children:"Open →"})]},n))})]}):null}let g="https://bjkvgobjxduhvxyjbujo.supabase.co",h="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqa3Znb2JqeGR1aHZ4eWpidWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2OTg4MzgsImV4cCI6MjEwNDI3NDgzOH0.wpLWH5Zf8MH9qzvAYovnJgaSPFsN54GJQ9bUow4rQcg",x="720px",v="1080px",b={"investment-case":["An emerging enterprise problem.","A potential new category.","A proof-stage investment opportunity."],"market-evidence":["The market is not just changing.","AI may be changing the conditions of change itself."],"economic-opportunity":["The bigger prize may not be the software market.","It may be the economic value moving underneath it."],product:["See what is changing.","Understand what it means.","Navigate where to act."],proof:["The thesis matters only if the evidence progresses."],round:["Fund the proof.","Earn the right to scale."]};function u({slug:e,title:l,question:m,investorName:f,onLogout:x}){let[v,u]=(0,n.useState)("loading"),[j,N]=(0,n.useState)(null),[w,k]=(0,n.useState)(!1);(0,n.useEffect)(()=>{k("1"===new URLSearchParams(window.location.search).get("preview"))},[]),(0,n.useEffect)(()=>{let r=!1;return(async()=>{try{if(w){let n=sessionStorage.getItem("drm_admin_token"),a=await fetch(`${g}/functions/v1/drm-content-admin?action=get-draft&slug=${e}`,{headers:{Authorization:`Bearer ${n}`,apikey:h||""}}),i=await a.json();if(r)return;if(!i.ok)return void u("error");N(i),u("ready")}else{let n=sessionStorage.getItem("drm_session_token");if(!n){r||u("auth-required");return}let a=await fetch(`${g}/functions/v1/drm-content?slug=${e}`,{headers:{Authorization:`Bearer ${n}`,apikey:h||""}}),i=await a.json();if(r)return;if(!i.ok)return void("AUTH_REQUIRED"===i.code||"AUTH_EXPIRED"===i.code?u("auth-required"):"NDA_REQUIRED"===i.code||i.nda_required?u("nda-required"):"ACCESS_REVOKED"===i.code?u("access-revoked"):"PAGE_UNAVAILABLE"===i.code?u("page-unavailable"):u("error"));N(i),u("ready")}}catch{r||u("error")}})(),()=>{r=!0}},[e,w]);let z=j?.sections?[...j.sections].sort((e,r)=>(e.order??0)-(r.order??0)):[],A=b[e]||[l];return(0,r.jsxs)("div",{className:"nf-drm-page",style:{minHeight:"100vh",background:"var(--nf-bg-primary)"},children:[(0,r.jsx)("header",{className:"nf-drm-header",children:(0,r.jsxs)("div",{className:"nf-drm-header-inner",children:[(0,r.jsxs)("div",{className:"nf-drm-header-left",children:[(0,r.jsx)(i.Lock,{size:16,color:"var(--nf-cyan)"}),(0,r.jsx)("span",{className:"nf-drm-header-brand",children:"NexFrontier"}),(0,r.jsx)("span",{className:"nf-drm-header-tag",children:"Investor Data Room"})]}),(0,r.jsxs)("div",{className:"nf-drm-header-right",children:[(0,r.jsxs)("a",{href:"/investor-data-room",className:"nf-drm-header-link",children:[(0,r.jsx)(o.Home,{size:14})," ",(0,r.jsx)("span",{className:"nf-drm-home-label",children:"Data Room Home"})]}),f&&(0,r.jsx)("span",{className:"nf-drm-investor-name",children:f}),x&&(0,r.jsxs)("button",{onClick:x,className:"nf-drm-header-link nf-drm-logout-btn",children:[(0,r.jsx)(c.LogOut,{size:14})," ",(0,r.jsx)("span",{className:"nf-drm-signout-label",children:"Sign Out"})]})]})]})}),w&&"ready"===v&&(0,r.jsxs)("div",{className:"nf-drm-draft-indicator",children:[(0,r.jsx)("span",{className:"nf-drm-draft-dot"}),"DRAFT PREVIEW · NOT INVESTOR VISIBLE"]}),(0,r.jsxs)("main",{className:"nf-drm-main",style:{maxWidth:"1220px"},children:[(0,r.jsxs)("a",{href:"/investor-data-room",className:"nf-drm-back-link",children:[(0,r.jsx)(a.ArrowLeft,{size:14})," Data Room Home"]}),(0,r.jsxs)("div",{className:"nf-drm-hero",children:[(0,r.jsx)("span",{className:"nf-drm-hero-eyebrow",children:l}),(0,r.jsx)("h1",{className:"nf-drm-hero-title",children:A.map((e,n)=>(0,r.jsx)("span",{className:"nf-drm-hero-line",children:e},n))}),(0,r.jsx)("p",{className:"nf-drm-hero-question",children:m}),(0,r.jsx)("div",{className:"nf-drm-hero-divider"})]}),"loading"===v&&(0,r.jsxs)("div",{className:"nf-drm-loading",children:[(0,r.jsx)(d.Loader2,{size:18,className:"nf-drm-spin"})," Loading..."]}),"auth-required"===v&&(0,r.jsx)(W,{icon:(0,r.jsx)(i.Lock,{size:28}),title:"Authentication required",message:"Please sign in to access this page.",actionHref:"/investor-data-room",actionLabel:"Go to Data Room"}),"nda-required"===v&&(0,r.jsx)(W,{icon:(0,r.jsx)(i.Lock,{size:28}),title:"NDA acceptance required",message:"You must accept the current NDA before accessing Data Room content.",actionHref:"/investor-data-room/nda",actionLabel:"Accept NDA"}),"access-revoked"===v&&(0,r.jsx)(W,{icon:(0,r.jsx)(s.AlertCircle,{size:28}),title:"Access revoked",message:"Your Data Room access is no longer active.",actionHref:"/investor-data-room",actionLabel:"Return to Data Room"}),"page-unavailable"===v&&(0,r.jsx)(W,{icon:(0,r.jsx)(s.AlertCircle,{size:28}),title:"Page unavailable",message:"This page is not currently available.",actionHref:"/investor-data-room",actionLabel:"Back to Data Room"}),"error"===v&&(0,r.jsx)(W,{icon:(0,r.jsx)(s.AlertCircle,{size:28}),title:"Unable to load",message:"An error occurred while loading this page. Please try again.",actionHref:"/investor-data-room",actionLabel:"Back to Data Room"}),"ready"===v&&j&&(0,r.jsxs)(r.Fragment,{children:[z.map((n,a)=>(0,r.jsx)(y,{section:n,slug:e,isLast:a===z.length-1},a)),j.supporting_materials&&j.supporting_materials.length>0&&(0,r.jsx)(p,{items:j.supporting_materials}),j.related_links&&j.related_links.length>0&&(0,r.jsx)("div",{className:"nf-drm-cta-area",children:j.related_links.map((e,n)=>(0,r.jsxs)("a",{href:e.href,className:e.primary?"nf-drm-cta nf-drm-cta-primary":"nf-drm-cta-continuation",children:[e.label," ",!e.label.includes("→")&&(0,r.jsx)(t.ArrowRight,{size:16})]},n))}),(0,r.jsxs)("div",{className:"nf-drm-footer-row",children:[(0,r.jsxs)("span",{className:"nf-drm-last-updated",children:["Last updated: ",j.last_updated]}),(0,r.jsxs)("a",{href:"/investor-data-room",className:"nf-drm-back-link",children:[(0,r.jsx)(a.ArrowLeft,{size:14})," Back to Data Room"]})]})]})]}),(0,r.jsx)("style",{children:_})]})}function y({section:e,slug:n,isLast:a}){let i=e.display_treatment||"default";return"columns"===i&&e.children?(0,r.jsx)(N,{section:e,isLast:a}):"grid-2x2"===i&&e.children?(0,r.jsx)(w,{section:e,isLast:a}):"capital-grid"===i&&e.children?(0,r.jsx)(k,{section:e,isLast:a}):"hypothesis-block"===i?(0,r.jsx)(z,{section:e,isLast:a}):"progression"===i&&e.children?(0,r.jsx)(A,{section:e,isLast:a}):"two-side"===i&&e.children?(0,r.jsx)(E,{section:e,isLast:a}):"concept-row"===i&&e.body?(0,r.jsx)(I,{section:e,isLast:a}):"callout"===i?(0,r.jsx)(L,{section:e,isLast:a}):"value-gap"===i?(0,r.jsx)(S,{section:e,isLast:a}):"lens-grid"===i&&e.children?(0,r.jsx)(R,{section:e,isLast:a}):"triad"===i&&e.body?(0,r.jsx)(T,{section:e,isLast:a}):"numbered-list"===i&&e.children?(0,r.jsx)(B,{section:e,isLast:a}):"peer-pair"===i&&e.children?(0,r.jsx)(D,{section:e,isLast:a}):"evidence-progression"===i&&e.children?(0,r.jsx)(O,{section:e,isLast:a}):(0,r.jsx)(j,{section:e,isLast:a})}function j({section:e,isLast:n}){return(0,r.jsxs)("section",{className:"nf-drm-section",style:{borderBottom:n?"none":void 0},children:[e.label&&(0,r.jsxs)("div",{className:"nf-drm-section-label-row",children:[(0,r.jsx)("span",{className:"nf-drm-section-label",children:e.label}),e.evidence_state&&(0,r.jsx)(m,{state:e.evidence_state})]}),e.heading&&(0,r.jsx)("h2",{className:"nf-drm-section-heading",children:e.heading}),e.body&&(0,r.jsx)(P,{text:e.body,maxWidth:x}),e.children&&e.children.map((e,n)=>(0,r.jsxs)("div",{className:"nf-drm-child-block",children:[e.heading&&(0,r.jsx)("h3",{className:"nf-drm-child-heading",children:e.heading}),e.body&&(0,r.jsx)(P,{text:e.body,maxWidth:x}),e.evidence_state&&(0,r.jsx)("div",{className:"nf-drm-child-badge",children:(0,r.jsx)(m,{state:e.evidence_state})})]},n))]})}function N({section:e,isLast:n}){let a=e.children?.length??1;return(0,r.jsxs)("section",{className:"nf-drm-section nf-drm-section-wide",style:{borderBottom:n?"none":void 0},children:[e.label&&(0,r.jsx)("span",{className:"nf-drm-section-label",children:e.label}),e.heading&&(0,r.jsx)("h2",{className:"nf-drm-section-heading",children:e.heading}),e.body&&(0,r.jsx)(P,{text:e.body,maxWidth:x,marginBottom:"var(--nf-space-6)"}),(0,r.jsx)("div",{className:"nf-drm-prop-columns","data-count":Math.min(a,3),children:e.children?.map((e,n)=>(0,r.jsxs)("div",{className:"nf-drm-prop-col",children:[e.heading&&(0,r.jsx)("span",{className:"nf-drm-prop-num",children:String(n+1).padStart(2,"0")}),e.heading&&(0,r.jsx)("h3",{className:"nf-drm-prop-heading",children:e.heading}),e.body&&(0,r.jsx)("p",{className:"nf-drm-body-sm",children:e.body}),e.evidence_state&&(0,r.jsx)("div",{className:"nf-drm-prop-badge",children:(0,r.jsx)(m,{state:e.evidence_state})})]},n))})]})}function w({section:e,isLast:n}){return(0,r.jsxs)("section",{className:"nf-drm-section nf-drm-section-wide",style:{borderBottom:n?"none":void 0},children:[e.label&&(0,r.jsx)("span",{className:"nf-drm-section-label",children:e.label}),e.heading&&(0,r.jsx)("h2",{className:"nf-drm-section-heading",children:e.heading}),e.body&&(0,r.jsx)(P,{text:e.body,maxWidth:x,marginBottom:"var(--nf-space-6)"}),(0,r.jsx)("div",{className:"nf-drm-grid-2x2",children:e.children?.map((e,n)=>(0,r.jsxs)("div",{className:"nf-drm-grid-cell",children:[e.heading&&(0,r.jsx)("span",{className:"nf-drm-grid-cell-label",children:e.heading}),e.body&&(0,r.jsx)("p",{className:"nf-drm-body-sm",children:e.body})]},n))})]})}function k({section:e,isLast:n}){let a=[];return e.heading&&a.push({heading:e.heading,body:e.body}),e.children&&a.push(...e.children),(0,r.jsxs)("section",{className:"nf-drm-section nf-drm-section-wide",style:{borderBottom:n?"none":void 0},children:[e.label&&(0,r.jsx)("span",{className:"nf-drm-section-label",children:e.label}),(0,r.jsx)("div",{className:"nf-drm-capital-grid",children:a.map((e,n)=>(0,r.jsxs)("div",{className:"nf-drm-capital-cell",children:[e.heading&&(0,r.jsx)("span",{className:"nf-drm-capital-cell-label",children:e.heading}),e.body&&(0,r.jsx)("p",{className:"nf-drm-body-sm",children:e.body})]},n))})]})}function z({section:e,isLast:n}){return(0,r.jsxs)("section",{className:"nf-drm-section",style:{borderBottom:n?"none":void 0},children:[e.label&&(0,r.jsx)("span",{className:"nf-drm-section-label",children:e.label}),e.heading&&(0,r.jsx)("h2",{className:"nf-drm-section-heading",children:e.heading}),(0,r.jsxs)("div",{className:"nf-drm-hypothesis-block",children:[e.body&&(0,r.jsx)(P,{text:e.body,maxWidth:x,className:"nf-drm-hypothesis-body"}),e.children?.map((e,n)=>(0,r.jsxs)("div",{className:"nf-drm-hypothesis-child",children:[e.heading&&(0,r.jsx)("span",{className:"nf-drm-hypothesis-child-label",children:e.heading}),e.body&&(0,r.jsx)("p",{className:"nf-drm-body-sm",style:{maxWidth:x},children:e.body})]},n)),e.evidence_state&&(0,r.jsx)("div",{className:"nf-drm-hypothesis-badge",children:(0,r.jsx)(m,{state:e.evidence_state})})]})]})}function A({section:e,isLast:n}){return(0,r.jsxs)("section",{className:"nf-drm-section",style:{borderBottom:n?"none":void 0},children:[e.label&&(0,r.jsx)("span",{className:"nf-drm-section-label",children:e.label}),e.heading&&(0,r.jsx)("h2",{className:"nf-drm-section-heading",children:e.heading}),e.body&&(0,r.jsx)(P,{text:e.body,maxWidth:x,marginBottom:"var(--nf-space-5)"}),(0,r.jsx)("div",{className:"nf-drm-progression",children:e.children?.map((n,a)=>(0,r.jsxs)("div",{className:"nf-drm-progression-step",children:[(0,r.jsxs)("div",{className:"nf-drm-progression-step-inner",children:[n.heading&&(0,r.jsx)("span",{className:"nf-drm-progression-heading",children:n.heading}),n.body&&(0,r.jsx)("p",{className:"nf-drm-body-sm",children:n.body})]}),a<(e.children?.length??0)-1&&(0,r.jsx)("div",{className:"nf-drm-progression-arrow","aria-hidden":"true",children:"↓"})]},a))})]})}function E({section:e,isLast:n}){return(0,r.jsxs)("section",{className:"nf-drm-section nf-drm-section-wide",style:{borderBottom:n?"none":void 0},children:[e.label&&(0,r.jsx)("span",{className:"nf-drm-section-label",children:e.label}),e.heading&&(0,r.jsx)("h2",{className:"nf-drm-section-heading",children:e.heading}),e.body&&(0,r.jsx)(P,{text:e.body,maxWidth:x,marginBottom:"var(--nf-space-6)"}),(0,r.jsx)("div",{className:"nf-drm-two-side",children:e.children?.map((e,n)=>(0,r.jsxs)("div",{className:0===n?"nf-drm-two-side-col nf-drm-two-side-today":"nf-drm-two-side-col nf-drm-two-side-proved",children:[e.heading&&(0,r.jsx)("span",{className:"nf-drm-two-side-label",children:e.heading}),e.body&&(0,r.jsx)("p",{className:"nf-drm-body-sm",children:e.body})]},n))})]})}function I({section:e,isLast:n}){var a;return(0,r.jsxs)("section",{className:"nf-drm-section",style:{borderBottom:n?"none":void 0},children:[e.label&&(0,r.jsx)("span",{className:"nf-drm-section-label",children:e.label}),e.heading&&(0,r.jsx)("h2",{className:"nf-drm-section-heading",children:e.heading}),e.body&&(0,r.jsx)(P,{text:e.body,maxWidth:x,marginBottom:"var(--nf-space-5)"}),(0,r.jsx)("div",{className:"nf-drm-concept-row",children:((a=e.body)?["interactive","nonlinear","path-dependent","responsive","difficult to interpret through historical assumptions alone"].filter(e=>a.toLowerCase().includes(e)):[]).map((e,n)=>(0,r.jsx)("span",{className:"nf-drm-concept-chip",children:e},n))})]})}function L({section:e,isLast:n}){return(0,r.jsxs)("section",{className:"nf-drm-section nf-drm-section-wide",style:{borderBottom:n?"none":void 0},children:[e.label&&(0,r.jsx)("span",{className:"nf-drm-section-label",children:e.label}),e.heading&&(0,r.jsx)("h2",{className:"nf-drm-section-heading",children:e.heading}),(0,r.jsxs)("div",{className:"nf-drm-callout",children:[e.body&&(0,r.jsx)(P,{text:e.body,maxWidth:x,className:"nf-drm-callout-body"}),e.children?.map((e,n)=>(0,r.jsxs)("div",{className:"nf-drm-callout-child",children:[e.heading&&(0,r.jsx)("span",{className:"nf-drm-callout-child-label",children:e.heading}),e.body&&(0,r.jsx)("p",{className:"nf-drm-body-sm",style:{maxWidth:x},children:e.body})]},n))]})]})}function S({section:e,isLast:n}){return(0,r.jsxs)("section",{className:"nf-drm-section",style:{borderBottom:n?"none":void 0},children:[e.label&&(0,r.jsx)("span",{className:"nf-drm-section-label",children:e.label}),e.heading&&(0,r.jsx)("h2",{className:"nf-drm-section-heading",children:e.heading}),e.body&&(0,r.jsx)(P,{text:e.body,maxWidth:x,marginBottom:"var(--nf-space-6)"}),(0,r.jsx)("div",{className:"nf-drm-value-gap",children:(0,r.jsxs)("div",{className:"nf-drm-value-gap-bar",children:[(0,r.jsx)("div",{className:"nf-drm-value-gap-segment nf-drm-value-gap-captured",children:(0,r.jsx)("span",{className:"nf-drm-value-gap-label",children:"ENTERPRISE VALUE CURRENTLY CAPTURED"})}),(0,r.jsx)("div",{className:"nf-drm-value-gap-segment nf-drm-value-gap-gap",children:(0,r.jsx)("span",{className:"nf-drm-value-gap-label",children:"VALUE GAP"})}),(0,r.jsx)("div",{className:"nf-drm-value-gap-segment nf-drm-value-gap-available",children:(0,r.jsx)("span",{className:"nf-drm-value-gap-label",children:"MARKET OPPORTUNITY AVAILABLE"})})]})})]})}function R({section:e,isLast:n}){return(0,r.jsxs)("section",{className:"nf-drm-section nf-drm-section-wide",style:{borderBottom:n?"none":void 0},children:[e.label&&(0,r.jsx)("span",{className:"nf-drm-section-label",children:e.label}),e.heading&&(0,r.jsx)("h2",{className:"nf-drm-section-heading",children:e.heading}),e.body&&(0,r.jsx)(P,{text:e.body,maxWidth:x,marginBottom:"var(--nf-space-6)"}),(0,r.jsx)("div",{className:"nf-drm-lens-grid",children:e.children?.map((e,n)=>(0,r.jsxs)("div",{className:"nf-drm-lens",children:[(0,r.jsx)("span",{className:"nf-drm-lens-num",children:String(n+1).padStart(2,"0")}),e.heading&&(0,r.jsx)("h3",{className:"nf-drm-lens-name",children:e.heading}),e.body&&(0,r.jsx)("p",{className:"nf-drm-body-sm",children:e.body})]},n))})]})}function T({section:e,isLast:n}){var a;return(0,r.jsxs)("section",{className:"nf-drm-section nf-drm-section-wide",style:{borderBottom:n?"none":void 0},children:[e.label&&(0,r.jsx)("span",{className:"nf-drm-section-label",children:e.label}),e.heading&&(0,r.jsx)("h2",{className:"nf-drm-section-heading",children:e.heading}),e.body&&(0,r.jsx)(P,{text:e.body,maxWidth:x,marginBottom:"var(--nf-space-6)"}),(0,r.jsx)("div",{className:"nf-drm-triad",children:((a=e.body)?a.split("\n").map(e=>e.trim()).map(e=>e.match(/^(SEE|UNDERSTAND|NAVIGATE)\s+(.+)$/)).filter(e=>!!e).slice(0,3).map(e=>({verb:e[1],description:e[2].trim()})):[]).map((e,n)=>(0,r.jsxs)("div",{className:"nf-drm-triad-item",children:[(0,r.jsx)("span",{className:"nf-drm-triad-verb",children:e.verb}),(0,r.jsx)("span",{className:"nf-drm-triad-desc",children:e.description}),n<2&&(0,r.jsx)("span",{className:"nf-drm-triad-link","aria-hidden":"true"})]},n))})]})}function B({section:e,isLast:n}){return(0,r.jsxs)("section",{className:"nf-drm-section",style:{borderBottom:n?"none":void 0},children:[e.label&&(0,r.jsx)("span",{className:"nf-drm-section-label",children:e.label}),e.heading&&(0,r.jsx)("h2",{className:"nf-drm-section-heading",children:e.heading}),e.body&&(0,r.jsx)(P,{text:e.body,maxWidth:x,marginBottom:"var(--nf-space-5)"}),(0,r.jsx)("div",{className:"nf-drm-numbered-list",children:e.children?.map((e,n)=>(0,r.jsxs)("div",{className:"nf-drm-numbered-item",children:[(0,r.jsx)("span",{className:"nf-drm-numbered-num",children:e.heading||String(n+1).padStart(2,"0")}),(0,r.jsx)("span",{className:"nf-drm-numbered-text",children:e.body})]},n))})]})}function D({section:e,isLast:n}){return(0,r.jsxs)("section",{className:"nf-drm-section nf-drm-section-wide",style:{borderBottom:n?"none":void 0},children:[e.label&&(0,r.jsx)("span",{className:"nf-drm-section-label",children:e.label}),e.heading&&(0,r.jsx)("h2",{className:"nf-drm-section-heading",children:e.heading}),e.body&&(0,r.jsx)(P,{text:e.body,maxWidth:x,marginBottom:"var(--nf-space-6)"}),(0,r.jsxs)("div",{className:"nf-drm-peer-pair",children:[e.children?.length===1&&e.heading&&(0,r.jsxs)("div",{className:"nf-drm-peer-card nf-drm-peer-upside",children:[(0,r.jsx)("h3",{className:"nf-drm-peer-heading",children:e.heading}),e.body&&(0,r.jsx)(P,{text:e.body,maxWidth:x})]}),e.children?.map((n,a)=>(0,r.jsxs)("div",{className:(e.children?.length,"nf-drm-peer-card nf-drm-peer-loss"),children:[n.heading&&(0,r.jsx)("h3",{className:"nf-drm-peer-heading",children:n.heading}),n.body&&(0,r.jsx)("p",{className:"nf-drm-body-sm",children:n.body})]},a))]})]})}function O({section:e,isLast:n}){let a=["ASSUMPTION","HYPOTHESIS","EVIDENCE","CUSTOMER VALIDATION","PAID VALIDATION","REPEATABLE PROOF"];return(0,r.jsxs)("section",{className:"nf-drm-section nf-drm-section-wide",style:{borderBottom:n?"none":void 0},children:[e.label&&(0,r.jsx)("span",{className:"nf-drm-section-label",children:e.label}),e.heading&&(0,r.jsx)("h2",{className:"nf-drm-section-heading",children:e.heading}),e.body&&(0,r.jsx)(P,{text:e.body,maxWidth:x,marginBottom:"var(--nf-space-6)"}),(0,r.jsx)("div",{className:"nf-drm-evidence-progression",children:a.map((e,n)=>{let i=2===n,s=3===n,d=n<2,t=n>3;return(0,r.jsxs)("div",{className:["nf-drm-evidence-stage",i?"nf-drm-evidence-current":"",s?"nf-drm-evidence-next":"",d?"nf-drm-evidence-past":"",t?"nf-drm-evidence-future":""].filter(Boolean).join(" "),children:[i&&(0,r.jsx)("span",{className:"nf-drm-evidence-marker",children:"CURRENT"}),s&&(0,r.jsx)("span",{className:"nf-drm-evidence-marker nf-drm-evidence-marker-next",children:"NEXT"}),(0,r.jsx)("span",{className:"nf-drm-evidence-name",children:e}),n<a.length-1&&(0,r.jsx)("span",{className:"nf-drm-evidence-arrow","aria-hidden":"true",children:"→"})]},n)})})]})}function P({text:e,maxWidth:n,marginBottom:a,className:i}){let s=e.split("\n\n").filter(e=>e.trim());return(0,r.jsx)(r.Fragment,{children:s.map((e,d)=>(0,r.jsx)("p",{className:`nf-drm-body${i?" "+i:""}`,style:{maxWidth:n||x,marginBottom:a||(d<s.length-1?"var(--nf-space-4)":void 0)},children:e},d))})}function W({icon:e,title:n,message:a,actionHref:i,actionLabel:s}){return(0,r.jsxs)("div",{className:"nf-drm-access-denied",children:[(0,r.jsx)("div",{className:"nf-drm-access-icon",children:e}),(0,r.jsx)("h2",{className:"nf-drm-access-title",children:n}),(0,r.jsx)("p",{className:"nf-drm-access-message",children:a}),(0,r.jsx)("a",{href:i,className:"nf-drm-cta nf-drm-cta-primary",children:s})]})}let _=`
.nf-drm-page { display: flex; flex-direction: column; min-height: 100vh; }

/* Header */
.nf-drm-header { position: sticky; top: 0; z-index: 50; background: var(--nf-bg-secondary); border-bottom: 1px solid var(--nf-border); padding: 0 var(--nf-space-5); }
.nf-drm-header-inner { max-width: var(--nf-container-wide); margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 56px; }
.nf-drm-header-left { display: flex; align-items: center; gap: var(--nf-space-3); }
.nf-drm-header-brand { font-size: 0.9375rem; font-weight: 600; color: var(--nf-text-primary); letter-spacing: -0.02em; }
.nf-drm-header-tag { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 8px; border-radius: 999px; background: var(--nf-cyan-dim); color: var(--nf-cyan); border: 1px solid var(--nf-cyan-border); }
.nf-drm-header-right { display: flex; align-items: center; gap: var(--nf-space-4); }
.nf-drm-header-link { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8125rem; color: var(--nf-text-tertiary); text-decoration: none; background: none; border: none; cursor: pointer; transition: color var(--nf-transition-fast); }
.nf-drm-header-link:hover { color: var(--nf-cyan); }
.nf-drm-logout-btn:hover { color: var(--nf-negative) !important; }
.nf-drm-investor-name { font-size: 0.75rem; color: var(--nf-text-tertiary); }

/* Draft indicator */
.nf-drm-draft-indicator { position: sticky; top: 56px; z-index: 49; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 8px var(--nf-space-5); background: rgba(245, 166, 35, 0.06); border-bottom: 1px solid rgba(245, 166, 35, 0.15); font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--nf-warning); }
.nf-drm-draft-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--nf-warning); flex-shrink: 0; }

/* Main shell */
.nf-drm-main { margin: 0 auto; width: 100%; padding: var(--nf-space-9) var(--nf-space-5) var(--nf-space-10); }

/* Back link */
.nf-drm-back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8125rem; color: var(--nf-text-tertiary); text-decoration: none; margin-bottom: var(--nf-space-7); transition: color var(--nf-transition-fast); }
.nf-drm-back-link:hover { color: var(--nf-cyan); }

/* Hero */
.nf-drm-hero { margin-bottom: var(--nf-space-8); }
.nf-drm-hero-eyebrow { display: block; font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--nf-cyan); margin-bottom: var(--nf-space-4); }
.nf-drm-hero-title { font-size: clamp(1.9375rem, 3.5vw, 3rem); font-weight: 500; color: var(--nf-text-primary); letter-spacing: -0.03em; line-height: 1.1; margin: 0 0 var(--nf-space-5); max-width: 900px; }
.nf-drm-hero-line { display: block; }
.nf-drm-hero-question { font-size: clamp(1.0625rem, 1.2vw, 1.25rem); line-height: 1.5; color: var(--nf-text-secondary); max-width: 680px; margin: 0 0 var(--nf-space-5); padding-left: var(--nf-space-4); border-left: 2px solid var(--nf-cyan-border); }
.nf-drm-hero-divider { width: 48px; height: 1px; background: var(--nf-cyan); margin-top: var(--nf-space-6); opacity: 0.5; }

/* Section base */
.nf-drm-section { padding-top: var(--nf-space-7); padding-bottom: var(--nf-space-7); border-bottom: 1px solid var(--nf-border-soft); max-width: ${x}; }
.nf-drm-section-wide { max-width: ${v}; }

/* Section labels & headings */
.nf-drm-section-label-row { display: flex; align-items: center; gap: var(--nf-space-3); margin-bottom: var(--nf-space-3); }
.nf-drm-section-label { display: inline-block; font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--nf-cyan); margin-bottom: var(--nf-space-3); }
.nf-drm-section-heading { font-size: clamp(1.5rem, 2.2vw, 2rem); font-weight: 500; color: var(--nf-text-primary); letter-spacing: -0.025em; line-height: 1.2; margin: 0 0 var(--nf-space-5); max-width: 900px; }

/* Body */
.nf-drm-body { font-size: 1.0625rem; line-height: 1.65; color: var(--nf-text-secondary); margin: 0; }
.nf-drm-body-sm { font-size: 0.9375rem; line-height: 1.6; color: var(--nf-text-secondary); margin: 0; }

/* Child blocks */
.nf-drm-child-block { margin-top: var(--nf-space-5); }
.nf-drm-child-heading { font-size: 1.0625rem; font-weight: 600; color: var(--nf-text-primary); margin: 0 0 var(--nf-space-2); }
.nf-drm-child-badge { margin-top: var(--nf-space-2); }

/* Proposition columns */
.nf-drm-prop-columns { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--nf-space-5); }
.nf-drm-prop-columns[data-count="2"] { grid-template-columns: repeat(2, 1fr); }
.nf-drm-prop-columns[data-count="1"] { grid-template-columns: 1fr; }
.nf-drm-prop-col { display: flex; flex-direction: column; gap: var(--nf-space-3); padding: var(--nf-space-6) var(--nf-space-5); background: var(--nf-bg-surface-1); border: 1px solid var(--nf-border-soft); border-radius: var(--nf-radius-panel); border-top: 2px solid var(--nf-cyan-border); }
.nf-drm-prop-num { font-size: 0.75rem; font-weight: 700; color: var(--nf-cyan); letter-spacing: 0.1em; }
.nf-drm-prop-heading { font-size: 1.0625rem; font-weight: 600; color: var(--nf-text-primary); line-height: 1.3; margin: 0; }
.nf-drm-prop-badge { margin-top: auto; padding-top: var(--nf-space-3); }

/* Grid 2x2 */
.nf-drm-grid-2x2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--nf-space-4); }
.nf-drm-grid-cell { display: flex; flex-direction: column; gap: var(--nf-space-3); padding: var(--nf-space-6) var(--nf-space-5); background: var(--nf-bg-surface-1); border: 1px solid var(--nf-border-soft); border-radius: var(--nf-radius-panel); }
.nf-drm-grid-cell-label { font-size: 0.75rem; font-weight: 700; color: var(--nf-text-secondary); letter-spacing: 0.08em; text-transform: uppercase; }

/* Capital grid */
.nf-drm-capital-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--nf-space-4); }
.nf-drm-capital-cell { display: flex; flex-direction: column; gap: var(--nf-space-3); padding: var(--nf-space-6) var(--nf-space-5); background: var(--nf-bg-surface-1); border: 1px solid var(--nf-border-soft); border-radius: var(--nf-radius-panel); border-top: 2px solid var(--nf-cyan-border); }
.nf-drm-capital-cell-label { font-size: 0.75rem; font-weight: 700; color: var(--nf-text-secondary); letter-spacing: 0.08em; text-transform: uppercase; }
@media (max-width: 1024px) { .nf-drm-capital-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .nf-drm-capital-grid { grid-template-columns: 1fr; } }

/* Hypothesis block */
.nf-drm-hypothesis-block { padding: var(--nf-space-7) var(--nf-space-6); background: rgba(12, 192, 223, 0.025); border: 1px solid rgba(12, 192, 223, 0.12); border-radius: var(--nf-radius-panel); }
.nf-drm-hypothesis-body { font-size: 1.125rem !important; font-weight: 500; color: var(--nf-text-primary) !important; line-height: 1.5; }
.nf-drm-hypothesis-child { margin-top: var(--nf-space-4); }
.nf-drm-hypothesis-child-label { display: block; font-size: 0.6875rem; font-weight: 700; color: var(--nf-text-tertiary); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
.nf-drm-hypothesis-badge { margin-top: var(--nf-space-5); }

/* Progression */
.nf-drm-progression { display: flex; flex-direction: column; gap: 0; }
.nf-drm-progression-step { display: flex; flex-direction: column; }
.nf-drm-progression-step-inner { padding: var(--nf-space-5) var(--nf-space-5); background: var(--nf-bg-surface-1); border: 1px solid var(--nf-border-soft); border-radius: var(--nf-radius-panel); border-left: 2px solid var(--nf-cyan-border); }
.nf-drm-progression-heading { font-size: 0.9375rem; font-weight: 600; color: var(--nf-text-primary); display: block; margin: 0; }
.nf-drm-progression-arrow { display: flex; justify-content: center; padding: var(--nf-space-2) 0; color: var(--nf-text-tertiary); font-size: 1.125rem; opacity: 0.5; }

/* Two-side */
.nf-drm-two-side { display: grid; grid-template-columns: 1fr 1fr; gap: var(--nf-space-5); }
.nf-drm-two-side-col { display: flex; flex-direction: column; gap: var(--nf-space-3); padding: var(--nf-space-7) var(--nf-space-6); border: 1px solid var(--nf-border-soft); border-radius: var(--nf-radius-panel); }
.nf-drm-two-side-today { background: var(--nf-bg-surface-1); }
.nf-drm-two-side-proved { background: rgba(12, 192, 223, 0.025); border-color: rgba(12, 192, 223, 0.15); }
.nf-drm-two-side-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.nf-drm-two-side-today .nf-drm-two-side-label { color: var(--nf-text-secondary); }
.nf-drm-two-side-proved .nf-drm-two-side-label { color: var(--nf-cyan); }

/* Concept row */
.nf-drm-concept-row { display: flex; flex-wrap: wrap; gap: var(--nf-space-2); }
.nf-drm-concept-chip { display: inline-flex; align-items: center; padding: 8px 16px; background: var(--nf-bg-surface-1); border: 1px solid var(--nf-border-soft); border-radius: 999px; font-size: 0.875rem; font-weight: 500; color: var(--nf-text-secondary); }

/* Callout */
.nf-drm-callout { padding: var(--nf-space-7) var(--nf-space-6); max-width: ${v}; background: var(--nf-bg-surface-1); border: 1px solid var(--nf-border-strong); border-left: 3px solid var(--nf-cyan); border-radius: var(--nf-radius-panel); }
.nf-drm-callout-body { font-size: 1.0625rem !important; color: var(--nf-text-primary) !important; line-height: 1.55; }
.nf-drm-callout-child { margin-top: var(--nf-space-4); }
.nf-drm-callout-child-label { display: block; font-size: 0.6875rem; font-weight: 700; color: var(--nf-text-tertiary); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }

/* Value gap */
.nf-drm-value-gap { max-width: ${v}; }
.nf-drm-value-gap-bar { display: flex; height: 64px; border-radius: var(--nf-radius-panel); overflow: hidden; border: 1px solid var(--nf-border-soft); }
.nf-drm-value-gap-segment { display: flex; align-items: center; justify-content: center; padding: 0 var(--nf-space-4); }
.nf-drm-value-gap-captured { flex: 0 0 35%; background: var(--nf-bg-surface-1); border-right: 1px solid var(--nf-border-soft); }
.nf-drm-value-gap-gap { flex: 1; background: rgba(12, 192, 223, 0.06); border-right: 1px solid var(--nf-border-soft); }
.nf-drm-value-gap-available { flex: 0 0 30%; background: var(--nf-bg-surface-2); }
.nf-drm-value-gap-label { font-size: 0.625rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--nf-text-tertiary); text-align: center; line-height: 1.3; }

/* Lens grid */
.nf-drm-lens-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--nf-space-3); }
.nf-drm-lens { display: flex; flex-direction: column; gap: var(--nf-space-3); padding: var(--nf-space-5) var(--nf-space-4); background: var(--nf-bg-surface-1); border: 1px solid var(--nf-border-soft); border-radius: var(--nf-radius-panel); border-top: 2px solid var(--nf-cyan-border); }
.nf-drm-lens-num { font-size: 0.6875rem; font-weight: 700; color: var(--nf-cyan); letter-spacing: 0.14em; }
.nf-drm-lens-name { font-size: 0.9375rem; font-weight: 600; color: var(--nf-text-primary); line-height: 1.3; margin: 0; }
@media (max-width: 1100px) { .nf-drm-lens-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 700px) { .nf-drm-lens-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .nf-drm-lens-grid { grid-template-columns: 1fr; } }

/* Triad */
.nf-drm-triad { display: flex; align-items: stretch; gap: 0; }
.nf-drm-triad-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: var(--nf-space-3); padding: var(--nf-space-7) var(--nf-space-5); position: relative; }
.nf-drm-triad-item:not(:last-child) { border-right: 1px solid var(--nf-border-soft); }
.nf-drm-triad-verb { font-size: clamp(1.5rem, 2vw, 2rem); font-weight: 500; color: var(--nf-cyan); letter-spacing: -0.02em; }
.nf-drm-triad-desc { font-size: 1rem; color: var(--nf-text-secondary); text-align: center; }
.nf-drm-triad-link { display: none; }
@media (max-width: 768px) { .nf-drm-triad { flex-direction: column; } .nf-drm-triad-item:not(:last-child) { border-right: none; border-bottom: 1px solid var(--nf-border-soft); } }

/* Numbered list */
.nf-drm-numbered-list { display: flex; flex-direction: column; gap: 0; }
.nf-drm-numbered-item { display: flex; align-items: baseline; gap: var(--nf-space-4); padding: var(--nf-space-4) 0; border-bottom: 1px solid var(--nf-border-soft); }
.nf-drm-numbered-item:last-child { border-bottom: none; }
.nf-drm-numbered-num { font-size: 0.875rem; font-weight: 700; color: var(--nf-cyan); letter-spacing: 0.08em; min-width: 28px; flex-shrink: 0; }
.nf-drm-numbered-text { font-size: 1.0625rem; color: var(--nf-text-primary); line-height: 1.5; }

/* Peer pair */
.nf-drm-peer-pair { display: grid; grid-template-columns: 1fr 1fr; gap: var(--nf-space-5); }
.nf-drm-peer-card { display: flex; flex-direction: column; gap: var(--nf-space-3); padding: var(--nf-space-7) var(--nf-space-6); border: 1px solid var(--nf-border-soft); border-radius: var(--nf-radius-panel); }
.nf-drm-peer-upside { background: rgba(12, 192, 223, 0.025); border-color: rgba(12, 192, 223, 0.15); }
.nf-drm-peer-loss { background: var(--nf-bg-surface-1); }
.nf-drm-peer-heading { font-size: 1.125rem; font-weight: 600; color: var(--nf-text-primary); margin: 0; }
.nf-drm-peer-upside .nf-drm-peer-heading { color: var(--nf-cyan); }
@media (max-width: 768px) { .nf-drm-peer-pair { grid-template-columns: 1fr; } }

/* Evidence progression */
.nf-drm-evidence-progression { display: flex; align-items: stretch; gap: 0; flex-wrap: wrap; }
.nf-drm-evidence-stage { display: flex; align-items: center; gap: var(--nf-space-2); padding: var(--nf-space-4) var(--nf-space-4); position: relative; border: 1px solid var(--nf-border-soft); border-radius: var(--nf-radius-control); background: var(--nf-bg-surface-1); margin-bottom: var(--nf-space-2); }
.nf-drm-evidence-stage:not(:last-child) { margin-right: var(--nf-space-2); }
.nf-drm-evidence-name { font-size: 0.75rem; font-weight: 600; color: var(--nf-text-tertiary); letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap; }
.nf-drm-evidence-arrow { color: var(--nf-text-tertiary); opacity: 0.4; }
.nf-drm-evidence-marker { font-size: 0.5625rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--nf-cyan); padding: 2px 6px; border-radius: 4px; background: rgba(12, 192, 223, 0.08); border: 1px solid rgba(12, 192, 223, 0.2); }
.nf-drm-evidence-marker-next { color: var(--nf-warning); background: rgba(245, 166, 35, 0.06); border-color: rgba(245, 166, 35, 0.2); }
.nf-drm-evidence-current .nf-drm-evidence-name { color: var(--nf-cyan); }
.nf-drm-evidence-next .nf-drm-evidence-name { color: var(--nf-warning); }
.nf-drm-evidence-past { opacity: 0.5; }
.nf-drm-evidence-future { opacity: 0.3; }
@media (max-width: 768px) { .nf-drm-evidence-progression { flex-direction: column; } .nf-drm-evidence-stage:not(:last-child) { margin-right: 0; } .nf-drm-evidence-arrow { display: none; } }

/* CTA */
.nf-drm-cta-area { margin-top: var(--nf-space-9); padding-top: var(--nf-space-7); border-top: 1px solid var(--nf-border); display: flex; flex-direction: column; gap: var(--nf-space-3); max-width: 400px; }
.nf-drm-cta { display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: var(--nf-radius-button); font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: background var(--nf-transition-fast), border-color var(--nf-transition-fast), color var(--nf-transition-fast); justify-content: center; }
.nf-drm-cta-primary { background: var(--nf-cyan); color: #041014; border: 1px solid var(--nf-cyan); }
.nf-drm-cta-primary:hover { background: var(--nf-cyan-hover); border-color: var(--nf-cyan-hover); }
.nf-drm-cta-secondary { background: transparent; color: var(--nf-text-secondary); border: 1px solid var(--nf-border); }
.nf-drm-cta-secondary:hover { border-color: var(--nf-cyan-border); color: var(--nf-cyan); }
.nf-drm-cta-continuation { display: inline-flex; align-items: center; gap: 8px; padding: 14px 0; font-size: 1.0625rem; font-weight: 500; color: var(--nf-cyan); text-decoration: none; transition: color var(--nf-transition-fast); border: none; background: none; }
.nf-drm-cta-continuation:hover { color: var(--nf-cyan-hover); }
.nf-drm-cta:focus-visible { outline: 2px solid var(--nf-focus-border); outline-offset: 2px; }

/* Footer */
.nf-drm-footer-row { margin-top: var(--nf-space-8); padding-top: var(--nf-space-5); border-top: 1px solid var(--nf-border-soft); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--nf-space-3); }
.nf-drm-last-updated { font-size: 0.75rem; color: var(--nf-text-tertiary); }

/* Access denied */
.nf-drm-access-denied { padding: var(--nf-space-8); background: var(--nf-bg-surface-1); border: 1px solid var(--nf-border); border-radius: var(--nf-radius-panel); text-align: center; max-width: 420px; margin: var(--nf-space-8) auto 0; }
.nf-drm-access-icon { color: var(--nf-text-tertiary); margin-bottom: var(--nf-space-4); }
.nf-drm-access-title { font-size: 1.125rem; font-weight: 600; color: var(--nf-text-primary); margin: 0 0 var(--nf-space-3); }
.nf-drm-access-message { font-size: 0.875rem; color: var(--nf-text-tertiary); margin: 0 0 var(--nf-space-5); }

/* Loading */
.nf-drm-loading { display: flex; align-items: center; gap: 10px; color: var(--nf-text-tertiary); font-size: 0.875rem; padding: var(--nf-space-8) 0; }

/* Spin */
@keyframes nf-drm-spin { to { transform: rotate(360deg); } }
.nf-drm-spin { animation: nf-drm-spin 1s linear infinite; }

/* Responsive */
@media (max-width: 1024px) { .nf-drm-prop-columns { grid-template-columns: 1fr 1fr; } .nf-drm-prop-columns[data-count="1"] { grid-template-columns: 1fr; } }
@media (max-width: 768px) {
  .nf-drm-main { padding: var(--nf-space-8) var(--nf-space-4) var(--nf-space-9); }
  .nf-drm-hero-title { font-size: clamp(1.75rem, 5vw, 2.25rem); }
  .nf-drm-hero-question { font-size: 1.0625rem; }
  .nf-drm-section-heading { font-size: 1.375rem; }
  .nf-drm-prop-columns, .nf-drm-prop-columns[data-count="2"], .nf-drm-prop-columns[data-count="3"] { grid-template-columns: 1fr; }
  .nf-drm-grid-2x2 { grid-template-columns: 1fr; }
  .nf-drm-two-side { grid-template-columns: 1fr; }
  .nf-drm-home-label, .nf-drm-investor-name { display: none; }
  .nf-drm-section, .nf-drm-section-wide { max-width: 100%; }
  .nf-drm-value-gap-bar { flex-direction: column; height: auto; }
  .nf-drm-value-gap-segment { padding: var(--nf-space-4); border-right: none; border-bottom: 1px solid var(--nf-border-soft); }
}
@media (max-width: 480px) {
  .nf-drm-signout-label { display: none; }
  .nf-drm-body { font-size: 1rem; }
  .nf-drm-hero-title { font-size: clamp(1.5rem, 6vw, 1.9375rem); }
  .nf-drm-hero-question { font-size: 0.9375rem; }
}
@media (prefers-reduced-motion: reduce) { .nf-drm-spin { animation: none; } }
`;e.s(["RuntimeTopicPage",()=>u],76487)}]);
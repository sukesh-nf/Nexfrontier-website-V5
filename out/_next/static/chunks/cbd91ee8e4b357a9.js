(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,4652,e=>{"use strict";var a=e.i(43476),s=e.i(71645);let t={revenue:"",nonPeopleCost:"",peopleCost:"",ebitda:"",customers:"",ltv:"",lifetime:""},n={revenue:1,cost:1,capacity:1,customer:1,capability:.1};function i(e){let a="number"==typeof e?e:Number(e);return Number.isFinite(a)?a:null}function l(e){let a=i(e);return null!==a&&a>0?a:null}function r(e,a=!1){if(null===e||!Number.isFinite(e))return"—";let s=Math.abs(e),t=e<0?"−":a&&e>0?"+":"";return s>=1e6?`${t}${(s/1e6).toFixed(s>=1e7?1:2)}M`:s>=1e3?`${t}${(s/1e3).toFixed(s>=1e5?0:1)}K`:`${t}${Math.round(s).toLocaleString("en-US")}`}function o(e){return`${Number.isInteger(e)?e:e.toFixed(2).replace(/0$/,"")}%`}function c(e){return`${e.toFixed(1)} pp`}function d(e,a){return Math.max(0,i(e[a])??0)}function p(e,a,s){let t=d(e,"revenue")*a.revenue/100,n=d(e,"nonPeopleCost")*a.cost/100,i=d(e,"peopleCost")*a.capacity/100,l=(s??0)*a.customer/100,r=d(e,"revenue")*a.capability/100;return{revenue:t,cost:n,capacity:i,customer:l,capability:r,gross:t+n+i+l+r}}function u(e,a){}e.i(47167);var m=e.i(72520),v=e.i(71689),f=e.i(43531),h=e.i(75254);let g=(0,h.default)("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);var b=e.i(40160),x=e.i(78583),y=e.i(64659);let j=(0,h.default)("Compass",[["path",{d:"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",key:"9ktpf1"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]),N=["Your Business","Quiet Loss™","Adaptive Value™","Enterprise Value"],w=[{key:"revenue",label:"Revenue",base:"R",formula:"R × %"},{key:"cost",label:"Cost",base:"OC",formula:"OC × %"},{key:"capacity",label:"Capacity",base:"PC",formula:"PC × %"},{key:"customer",label:"Customer Value",base:"Pool",formula:"Pool × %"},{key:"capability",label:"Enterprise Capability",base:"R",formula:"R × pp"}],q=[{name:"Defensive Value",desc:"Protecting existing revenue and customer relationships from erosion."},{name:"Offensive Value",desc:"Capturing new opportunity created by changing market conditions."},{name:"Revenue Health",desc:"Whether revenue quality, mix and pipeline are improving or deteriorating."},{name:"Customer Lifetime Value",desc:"How changing customer intent and expectations affect long-term value."},{name:"Enterprise Capability",desc:"Whether the organisation can adapt fast enough to capture what is possible."}];function k(){let[e,r]=(0,s.useState)(1),[o,c]=(0,s.useState)(t),[m,v]=(0,s.useState)(n),[f,h]=(0,s.useState)(n),[b,x]=(0,s.useState)(20),[y,j]=(0,s.useState)(70),[N,w]=(0,s.useState)(""),[q,k]=(0,s.useState)(!1),[T,R]=(0,s.useState)(!1),S=(0,s.useRef)(null);(0,s.useEffect)(()=>{let e=window.sessionStorage.getItem("nf-enterprise-value-calculator");if(e){let a=JSON.parse(e);r(a.stage),c(a.inputs),v(a.qlAssumptions),h(a.avAssumptions),x(a.overlap),j(a.realisation),w(a.costToRealise)}k(!0)},[]),(0,s.useEffect)(()=>{q&&window.sessionStorage.setItem("nf-enterprise-value-calculator",JSON.stringify({stage:e,inputs:o,qlAssumptions:m,avAssumptions:f,overlap:b,realisation:y,costToRealise:N}))},[q,e,o,m,f,b,y,N]);let L=e=>{r(e),requestAnimationFrame(()=>{S.current?.scrollIntoView({behavior:"smooth",block:"start"})})},W=(0,s.useMemo)(()=>{let e,a,s;return e=l(o.customers),a=l(o.lifetime),s=i(o.ltv),null!==e&&null!==a&&null!==s&&s>=0?s/a*e:null},[o]),F=(0,s.useMemo)(()=>{let e=i(o.revenue),a=i(o.ebitda);return null===e||0===e||null===a?null:a/e*100},[o]),D=(0,s.useMemo)(()=>p(o,m,W),[o,m,W]),M=(0,s.useMemo)(()=>p(o,f,W),[o,f,W]),P=D.gross+M.gross,Q=b/100*P,B=P*(1-b/100),U=y/100*B,Y=B*(1-y/100),G=Math.max(0,i(N)??0),H=U-G,_=.0025*d(o,"revenue"),K=(0,s.useMemo)(()=>{let e=i(o.revenue);return null!==l(o.lifetime)&&null!==e&&e>=0},[o]);return(0,a.jsxs)("div",{ref:S,children:[(0,a.jsxs)("div",{className:"nf-calc-progress-shell",children:[(0,a.jsx)(C,{stage:e,maxReachedStage:Math.max(e,+!!K),onStepClick:a=>{a<=e&&L(a)}}),(0,a.jsxs)("button",{type:"button",className:"nf-calc-reset-btn",onClick:()=>R(!0),children:[(0,a.jsx)(g,{size:16})," Reset to Defaults"]})]}),T&&(0,a.jsxs)("div",{className:"nf-calc-reset-confirm",children:[(0,a.jsx)("p",{children:"Reset all inputs and assumptions to defaults? This cannot be undone."}),(0,a.jsxs)("div",{style:{display:"flex",gap:"var(--nf-space-3)"},children:[(0,a.jsx)("button",{type:"button",className:"nf-cta nf-cta-secondary",onClick:()=>R(!1),children:"Cancel"}),(0,a.jsx)("button",{type:"button",className:"nf-cta nf-cta-primary",onClick:()=>{c(t),v(n),h(n),x(20),j(70),w(""),r(1),R(!1),requestAnimationFrame(()=>{S.current?.scrollIntoView({behavior:"smooth",block:"start"})})},children:"Yes, Reset"})]})]}),1===e&&(0,a.jsxs)(A,{heading:"Your Business",question:"What does the business look like today?",supporting:"Use annual figures wherever requested. These numbers create the reference point for the scenario.",children:[(0,a.jsxs)("div",{className:"nf-calc-step1-grid",children:[(0,a.jsxs)("div",{className:"nf-calc-step1-col",children:[(0,a.jsx)(V,{label:"01 Annual Revenue",variable:"R",value:o.revenue,onChange:e=>c({...o,revenue:e})}),(0,a.jsx)(V,{label:"02 Annual Non-People Operating Cost",variable:"OC",hint:"Examples may include facilities, systems, suppliers and other non-people operating costs.",value:o.nonPeopleCost,onChange:e=>c({...o,nonPeopleCost:e})}),(0,a.jsx)(V,{label:"03 Annual People / Capacity Cost",variable:"PC",hint:"Annual people and capacity-related cost.",value:o.peopleCost,onChange:e=>c({...o,peopleCost:e})}),(0,a.jsx)(V,{label:"04 Annual EBITDA",variable:"E",hint:"May be negative.",allowNegative:!0,value:o.ebitda,onChange:e=>c({...o,ebitda:e})})]}),(0,a.jsxs)("div",{className:"nf-calc-step1-col",children:[(0,a.jsx)(V,{label:"05 Active Customers",variable:"A",value:o.customers,onChange:e=>c({...o,customers:e})}),(0,a.jsx)(V,{label:"06 Average Customer Lifetime Value",variable:"LTV",value:o.ltv,onChange:e=>c({...o,ltv:e})}),(0,a.jsx)(V,{label:"07 Average Customer Lifetime",variable:"T",hint:"Years. Must be greater than zero.",value:o.lifetime,onChange:e=>c({...o,lifetime:e}),error:""!==o.lifetime&&null===l(o.lifetime)?"Lifetime must be greater than zero.":void 0})]})]}),(0,a.jsx)(E,{ebitdaMargin:F,customerPool:W}),(0,a.jsx)(O,{onNext:()=>{K&&(L(2),u("calculator_stage_completion",{stage:1}))},nextLabel:"Continue to Quiet Loss™",nextDisabled:!K})]}),2===e&&(0,a.jsx)(z,{qlAssumptions:m,qlResults:D,inputs:o,pool:W,onChange:v,onBack:()=>L(1),onNext:()=>{L(3),u("calculator_stage_completion",{stage:2})}}),3===e&&(0,a.jsx)($,{avAssumptions:f,avResults:M,onChange:h,onBack:()=>L(2),onNext:()=>{L(4),u("calculator_stage_completion",{stage:3})}}),4===e&&(0,a.jsx)(I,{qlResults:D,avResults:M,gvo:P,overlap:b,overlapValue:Q,adjustedOpportunity:B,realisation:y,expectedRealisable:U,riskAllowance:Y,costToRealise:N,costValue:G,evDelta:H,scenarioStatus:H>_?"above":H<-_?"below":"neutral",inputs:o,qlAssumptions:m,avAssumptions:f,pool:W,ebitdaMargin:F,onOverlapChange:x,onRealisationChange:j,onCostToRealiseChange:w,onBack:()=>L(3),onReviewInputs:()=>L(1)})]})}function C({stage:e,onStepClick:s}){return(0,a.jsx)("div",{className:"nf-calc-progress",children:N.map((t,n)=>{let i=n+1,l=i===e,r=i<e,o=i<e;return(0,a.jsxs)("div",{className:`nf-calc-progress-step ${l?"active":""} ${r?"complete":""} ${!l&&!r?"upcoming":""}`,children:[(0,a.jsx)("button",{type:"button",className:"nf-calc-progress-circle",onClick:()=>o&&s(i),disabled:!o,"aria-label":`Step ${i}: ${t}`,style:{cursor:o?"pointer":"default"},children:r?(0,a.jsx)(f.Check,{size:20}):`0${i}`}),(0,a.jsx)("span",{className:"nf-calc-progress-label",children:t}),n<3&&(0,a.jsx)("div",{className:"nf-calc-progress-connector"})]},n)})})}function A({heading:e,question:s,supporting:t,eyebrow:n,children:i}){return(0,a.jsxs)("div",{children:[n&&(0,a.jsx)("div",{className:"nf-calc-stage-eyebrow",children:n}),(0,a.jsx)("h2",{className:"nf-calc-stage-heading",children:e}),s&&(0,a.jsx)("p",{className:"nf-calc-stage-question",children:s}),t&&(0,a.jsx)("p",{className:"nf-calc-stage-supporting",children:t}),i]})}function V({label:e,variable:s,value:t,onChange:n,hint:i,allowNegative:l,error:r,hideLabel:o}){return(0,a.jsxs)("div",{children:[!o&&(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"},children:[(0,a.jsx)("span",{style:{fontSize:"var(--nf-text-body)",fontWeight:600,color:"var(--nf-text-primary)"},children:e}),s&&(0,a.jsxs)("span",{style:{fontSize:"0.75rem",color:"var(--nf-text-tertiary)"},children:["(",s,")"]})]}),(0,a.jsx)("input",{type:"number",value:t,onChange:e=>{let a=e.target.value;if(""===a)return void n("");let s=Number(a);Number.isFinite(s)&&(l||!(s<0))&&n(a)},placeholder:"0",className:"nf-calc-input",style:{width:"100%",padding:"12px 16px",background:"var(--nf-bg-inset)",border:`1px solid ${r?"var(--nf-negative)":"var(--nf-border)"}`,borderRadius:"var(--nf-radius-control)",color:"var(--nf-text-primary)",fontSize:"0.9375rem",outline:"none"}}),i&&(0,a.jsx)("p",{style:{fontSize:"0.8125rem",color:"var(--nf-text-tertiary)",marginTop:"6px"},children:i}),r&&(0,a.jsx)("p",{style:{fontSize:"0.8125rem",color:"var(--nf-negative)",marginTop:"6px"},children:r})]})}function E({ebitdaMargin:e,customerPool:s}){return(0,a.jsxs)("div",{className:"nf-calc-derived",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{className:"nf-calc-derived-label",children:"EBITDA Margin"}),(0,a.jsx)("div",{className:"nf-calc-derived-value",children:null===e?"N/A":`${e.toFixed(1)}%`})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{className:"nf-calc-derived-label",children:"Annualised Customer Value Pool"}),(0,a.jsx)("div",{className:"nf-calc-derived-value",children:r(s)}),(0,a.jsx)("div",{className:"nf-calc-derived-note",children:"Used only as an annual Customer Value reference. Not claimed revenue."})]})]})}let T={revenue:"What share of current annual revenue might reasonably represent value that could have been captured from opportunity already available?",cost:"What share of annual non-people operating cost might reasonably be avoidable, reducible or better deployed?",capacity:"What share of annual people and capacity cost might reasonably represent underused or poorly deployed capacity?",customer:"What share of today’s customer value pool might reasonably represent value already available but not fully captured across the customer base?",capability:"What share of current annual revenue might reasonably reflect value that stronger enterprise capability could already have protected or captured?"};function z({qlAssumptions:e,qlResults:s,inputs:t,pool:n,onChange:i,onBack:l,onNext:o}){return(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{className:"nf-calc-stage-eyebrow",children:"02 QUIET LOSS™"}),(0,a.jsx)("h2",{className:"nf-calc-stage-heading",children:"What value might already be going unrealised?"}),(0,a.jsxs)("div",{className:"nf-ql-orientation",children:[(0,a.jsx)("p",{className:"nf-ql-orientation-lead",children:"You are now exploring how much value may already be available to the business but not fully captured."}),(0,a.jsx)("p",{className:"nf-ql-orientation-body",children:"You are not being asked to predict the future. You are applying your own scenario assumptions to the five Enterprise Value dimensions, your judgement about how much value may already exist within today's opportunity. These are your assumptions, not NexFrontier benchmarks."})]}),(0,a.jsxs)("div",{className:"nf-calc-stage-result nf-calc-stage-result-ql nf-ql-summary",children:[(0,a.jsx)("div",{className:"nf-calc-stage-result-label",children:"Illustrative Quiet Loss™"}),(0,a.jsx)("div",{className:"nf-calc-stage-result-value",children:r(s.gross)}),(0,a.jsx)("div",{className:"nf-calc-stage-result-sub",children:"Gross annual scenario"}),(0,a.jsx)("div",{className:"nf-calc-stage-result-note",children:"This is the value your assumptions suggest may already exist within today's opportunity but may not be fully captured."}),(0,a.jsx)("div",{className:"nf-calc-stage-result-warning",children:"This is not confirmed loss."})]}),(0,a.jsx)("div",{className:"nf-ql-dimensions",children:w.map((t,n)=>(0,a.jsx)(R,{index:n+1,row:t,value:e[t.key],dollarValue:s[t.key],onChange:a=>i({...e,[t.key]:a})},t.key))}),(0,a.jsxs)("div",{className:"nf-ql-why-matters",children:[(0,a.jsx)("div",{className:"nf-ql-why-matters-label",children:"Why this matters"}),(0,a.jsx)("p",{children:"A business can be performing well and still capture less value than the opportunity available to it. This estimate gives you a reason to investigate, not proof that the loss exists."})]}),(0,a.jsx)(O,{onBack:l,backLabel:"Back to Your Business",onNext:o,nextLabel:"Continue to Adaptive Value\\u2122"})]})}function R({index:e,row:s,value:t,dollarValue:n,onChange:i}){let l="capability"===s.key,d=l?2:10,p=l?.1:.25;return(0,a.jsxs)("div",{className:"nf-ql-dim-card",children:[(0,a.jsxs)("div",{className:"nf-ql-dim-header",children:[(0,a.jsxs)("span",{className:"nf-ql-dim-number",children:["0",e]}),(0,a.jsx)("span",{className:"nf-ql-dim-name",children:s.label})]}),(0,a.jsx)("p",{className:"nf-ql-dim-explain",children:T[s.key]}),(0,a.jsxs)("div",{className:"nf-ql-dim-controls",children:[(0,a.jsx)("input",{type:"range",min:0,max:d,step:p,value:t,onChange:e=>i(Number(e.target.value)),className:"nf-ql-dim-slider",style:{accentColor:"var(--nf-negative)"},"aria-label":`${s.label} assumption`}),(0,a.jsx)("input",{type:"number",min:0,max:d,step:p,value:t,onChange:e=>{let a=Number(e.target.value);Number.isFinite(a)&&i(Math.max(0,Math.min(d,a)))},className:"nf-ql-dim-number-input","aria-label":`${s.label} percentage`}),(0,a.jsx)("span",{className:"nf-ql-dim-unit",children:l?"pp":"%"})]}),(0,a.jsxs)("div",{className:"nf-ql-dim-results",children:[(0,a.jsxs)("div",{className:"nf-ql-dim-percent",children:[(0,a.jsx)("span",{className:"nf-ql-dim-results-label",children:"Current assumption"}),(0,a.jsx)("span",{className:"nf-ql-dim-results-value",children:l?c(t):o(t)})]}),(0,a.jsxs)("div",{className:"nf-ql-dim-dollar",children:[(0,a.jsx)("span",{className:"nf-ql-dim-results-label",children:"Estimated contribution"}),(0,a.jsx)("span",{className:"nf-ql-dim-results-value",style:{color:"var(--nf-negative)"},children:r(n)})]})]}),(0,a.jsxs)("p",{className:"nf-ql-dim-default",children:["Default: ",l?c(t):o(t),". Illustrative starting assumption."]})]})}let S={revenue:"What additional share of annual revenue might become possible if market change creates new opportunity the business can capture?",cost:"What additional annual cost improvement might become possible if changing conditions allow the business to operate differently or more efficiently?",capacity:"What additional value might become possible if existing people and capacity can be deployed more effectively as conditions change?",customer:"What additional customer value might become possible if changing market conditions create new economically meaningful opportunity across the customer base?",capability:"What additional share of annual revenue might become possible if stronger enterprise capability allows the business to capture new opportunity created by market change?"};function $({avAssumptions:e,avResults:s,onChange:t,onBack:n,onNext:i}){return(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{className:"nf-calc-stage-eyebrow",children:"03 ADAPTIVE VALUE™"}),(0,a.jsx)("h2",{className:"nf-calc-stage-heading",children:"What more could become possible?"}),(0,a.jsxs)("div",{className:"nf-av-orientation",children:[(0,a.jsx)("p",{className:"nf-av-orientation-lead",children:"You are now exploring additional value that may become possible as market conditions change and the enterprise adapts effectively."}),(0,a.jsxs)("div",{className:"nf-av-orientation-compare",children:[(0,a.jsxs)("div",{className:"nf-av-orientation-ql",children:[(0,a.jsx)("span",{className:"nf-av-orientation-tag",children:"Quiet Loss™"}),(0,a.jsx)("p",{children:"Asks what value may already exist but not be fully captured."})]}),(0,a.jsxs)("div",{className:"nf-av-orientation-av",children:[(0,a.jsx)("span",{className:"nf-av-orientation-tag",children:"Adaptive Value™"}),(0,a.jsx)("p",{children:"Asks what additional value may become possible if changing market conditions create new economically meaningful opportunity."})]})]}),(0,a.jsx)("p",{className:"nf-av-orientation-body",children:"You are not predicting the future. You are applying illustrative scenario assumptions to explore potential additional annual value. These are your assumptions, not NexFrontier benchmarks."})]}),(0,a.jsxs)("div",{className:"nf-calc-stage-result nf-calc-stage-result-av nf-av-summary",children:[(0,a.jsx)("div",{className:"nf-calc-stage-result-label",children:"Illustrative Adaptive Value™"}),(0,a.jsx)("div",{className:"nf-calc-stage-result-value",children:r(s.gross)}),(0,a.jsx)("div",{className:"nf-calc-stage-result-sub",children:"Gross annual scenario"}),(0,a.jsx)("div",{className:"nf-calc-stage-result-note",children:"This is the additional annual value your assumptions suggest may become possible if market change creates economically meaningful opportunity and the enterprise adapts effectively."}),(0,a.jsx)("div",{className:"nf-calc-stage-result-warning",children:"This is not a forecast."})]}),(0,a.jsx)("div",{className:"nf-av-dimensions",children:w.map((n,i)=>(0,a.jsx)(L,{index:i+1,row:n,value:e[n.key],dollarValue:s[n.key],onChange:a=>t({...e,[n.key]:a})},n.key))}),(0,a.jsxs)("div",{className:"nf-av-why-matters",children:[(0,a.jsx)("div",{className:"nf-av-why-matters-label",children:"Why this matters"}),(0,a.jsx)("p",{children:"Market change does not automatically create value. Adaptive Value™ becomes relevant only where new opportunity is economically meaningful and the enterprise can capture it."})]}),(0,a.jsx)(O,{onBack:n,backLabel:"Back to Quiet Loss\\u2122",onNext:i,nextLabel:"Continue to Enterprise Value"})]})}function L({index:e,row:s,value:t,dollarValue:n,onChange:i}){let l="capability"===s.key,d=l?2:10,p=l?.1:.25;return(0,a.jsxs)("div",{className:"nf-av-dim-card",children:[(0,a.jsxs)("div",{className:"nf-av-dim-header",children:[(0,a.jsxs)("span",{className:"nf-av-dim-number",children:["0",e]}),(0,a.jsx)("span",{className:"nf-av-dim-name",children:s.label})]}),(0,a.jsx)("p",{className:"nf-av-dim-explain",children:S[s.key]}),(0,a.jsxs)("div",{className:"nf-av-dim-controls",children:[(0,a.jsx)("input",{type:"range",min:0,max:d,step:p,value:t,onChange:e=>i(Number(e.target.value)),className:"nf-av-dim-slider",style:{accentColor:"var(--nf-cyan)"},"aria-label":`${s.label} assumption`}),(0,a.jsx)("input",{type:"number",min:0,max:d,step:p,value:t,onChange:e=>{let a=Number(e.target.value);Number.isFinite(a)&&i(Math.max(0,Math.min(d,a)))},className:"nf-av-dim-number-input","aria-label":`${s.label} percentage`}),(0,a.jsx)("span",{className:"nf-av-dim-unit",children:l?"pp":"%"})]}),(0,a.jsxs)("div",{className:"nf-av-dim-results",children:[(0,a.jsxs)("div",{className:"nf-av-dim-percent",children:[(0,a.jsx)("span",{className:"nf-av-dim-results-label",children:"Current assumption"}),(0,a.jsx)("span",{className:"nf-av-dim-results-value",children:l?c(t):o(t)})]}),(0,a.jsxs)("div",{className:"nf-av-dim-dollar",children:[(0,a.jsx)("span",{className:"nf-av-dim-results-label",children:"Estimated contribution"}),(0,a.jsx)("span",{className:"nf-av-dim-results-value",style:{color:"var(--nf-cyan)"},children:r(n)})]})]}),(0,a.jsxs)("p",{className:"nf-av-dim-default",children:["Default: ",l?c(t):o(t),". Illustrative starting assumption."]})]})}let W=["Which assumptions have the greatest influence on the result?","Where might evidence confirm or challenge the Quiet Loss™ estimate?","Which market changes could materially affect Adaptive Value™?","What would need to be true for the estimated value to become real?","Which areas deserve leadership attention first?"];function I({qlResults:e,avResults:t,gvo:n,overlap:i,overlapValue:l,adjustedOpportunity:o,realisation:c,expectedRealisable:d,riskAllowance:p,costToRealise:u,costValue:m,evDelta:v,scenarioStatus:f,inputs:h,qlAssumptions:g,avAssumptions:y,pool:N,ebitdaMargin:k,onOverlapChange:C,onRealisationChange:A,onCostToRealiseChange:V,onBack:E,onReviewInputs:T}){let[z,R]=(0,s.useState)(!1),[S,$]=(0,s.useState)(!1),[L,I]=(0,s.useState)(!1),B="above"===f?"var(--nf-positive)":"below"===f?"var(--nf-negative)":"var(--nf-neutral)";return(0,a.jsxs)("div",{children:[(0,a.jsx)("div",{className:"nf-calc-stage-eyebrow",children:"04 ENTERPRISE VALUE"}),(0,a.jsx)("h2",{className:"nf-calc-stage-heading",children:"Illustrative Annual Enterprise Value Delta"}),(0,a.jsx)("p",{className:"nf-calc-stage-supporting",children:"You have completed your scenario. This page brings your assumptions together into a single illustrative result and suggests what it may mean."}),(0,a.jsxs)("div",{className:"nf-ev-grid",children:[(0,a.jsxs)("div",{className:"nf-ev-left",children:[(0,a.jsxs)("div",{className:"nf-ev-equation",children:[(0,a.jsxs)("div",{className:"nf-ev-eq-term",children:[(0,a.jsx)("span",{className:"nf-ev-eq-label",children:"Quiet Loss™"}),(0,a.jsx)("span",{className:"nf-ev-eq-value",style:{color:"var(--nf-negative)"},children:r(e.gross)})]}),(0,a.jsx)("span",{className:"nf-ev-eq-op",children:"+"}),(0,a.jsxs)("div",{className:"nf-ev-eq-term",children:[(0,a.jsx)("span",{className:"nf-ev-eq-label",children:"Adaptive Value™"}),(0,a.jsx)("span",{className:"nf-ev-eq-value",style:{color:"var(--nf-cyan)"},children:r(t.gross)})]}),(0,a.jsx)("span",{className:"nf-ev-eq-op",children:"="}),(0,a.jsxs)("div",{className:"nf-ev-eq-term",children:[(0,a.jsx)("span",{className:"nf-ev-eq-label",children:"Gross Value Opportunity"}),(0,a.jsx)("span",{className:"nf-ev-eq-value",style:{color:"var(--nf-text-primary)"},children:r(n)})]})]}),(0,a.jsxs)("div",{className:"nf-ev-hero",children:[(0,a.jsx)("div",{className:"nf-ev-hero-label",children:"Illustrative Annual EV Delta"}),(0,a.jsxs)("div",{className:"nf-ev-hero-value",style:{color:B},children:[r(v,!0),(0,a.jsx)("span",{className:"nf-ev-hero-unit",children:" / year"})]}),(0,a.jsx)("div",{className:"nf-ev-hero-status",style:{color:B},children:"above"===f?"Above Status Quo":"below"===f?"Below Status Quo":"Broadly in line with Status Quo"}),(0,a.jsx)("p",{className:"nf-ev-hero-note",children:"Your current annual business position before applying the illustrative value assumptions above. This is not a forecast or formal valuation benchmark."})]}),(0,a.jsxs)("div",{className:"nf-ev-adjustments",children:[(0,a.jsx)("h3",{className:"nf-ev-section-title",children:"Applying Economic Reality"}),(0,a.jsx)("p",{className:"nf-ev-section-sub",children:"Three adjustments turn gross opportunity into a more realistic estimate. These are your assumptions."}),(0,a.jsx)(F,{label:"Overlap",value:i,unit:"%",min:0,max:50,step:5,onChange:C,explain:"Some Quiet Loss\\u2122 and Adaptive Value\\u2122 may describe the same underlying value. Use this to avoid counting the same opportunity twice.",effectLabel:"Reduces gross by",effectValue:r(l),resultLabel:"Adjusted opportunity",resultValue:r(o)}),(0,a.jsx)(F,{label:"Expected Realisation",value:c,unit:"%",min:0,max:100,step:5,onChange:A,explain:"Not every identified opportunity will be captured. Use this to estimate what share might realistically become realised value.",effectLabel:"Risk / uncertainty allowance",effectValue:r(p),resultLabel:"Expected realisable value",resultValue:r(d)}),(0,a.jsxs)("div",{className:"nf-ev-adj-card",children:[(0,a.jsx)("div",{className:"nf-ev-adj-header",children:(0,a.jsx)("span",{className:"nf-ev-adj-name",children:"Cost to Realise"})}),(0,a.jsx)("p",{className:"nf-ev-adj-explain",children:"Capturing value may require investment. Enter the estimated annual cost of making the changes needed."}),(0,a.jsxs)("div",{className:"nf-ev-adj-controls",children:[(0,a.jsx)("span",{className:"nf-ev-adj-prefix",children:"$"}),(0,a.jsx)("input",{type:"number",min:0,value:u,onChange:e=>V(e.target.value),className:"nf-ev-adj-cost-input",placeholder:"0","aria-label":"Estimated annual cost to realise"}),(0,a.jsx)("span",{className:"nf-ev-adj-unit",children:"/ year"})]}),(0,a.jsxs)("div",{className:"nf-ev-adj-effect",children:[(0,a.jsx)("span",{className:"nf-ev-adj-effect-label",children:"Subtracted from realisable value"}),(0,a.jsx)("span",{className:"nf-ev-adj-effect-value",children:r(m)})]})]})]})]}),(0,a.jsxs)("div",{className:"nf-ev-right",children:[(0,a.jsxs)("div",{className:"nf-ev-insight-card nf-ev-insight-mean",children:[(0,a.jsx)("div",{className:"nf-ev-insight-label",children:"What this may mean"}),(0,a.jsx)("p",{children:"Your scenario suggests there may be enough economic significance to justify further investigation. The result is not proof of available value, but it can help identify whether the question deserves leadership attention."})]}),(0,a.jsxs)("div",{className:"nf-ev-insight-card nf-ev-insight-not",children:[(0,a.jsx)("div",{className:"nf-ev-insight-label",children:"What this does not prove"}),(0,a.jsx)("p",{children:"Realised value, future performance, causation, or a formal valuation. It is an illustrative scenario based on your assumptions, not evidence of outcomes."})]}),(0,a.jsxs)("div",{className:"nf-ev-insight-card nf-ev-insight-invest",children:[(0,a.jsx)("div",{className:"nf-ev-insight-label",children:"What deserves investigation next"}),(0,a.jsx)("ol",{className:"nf-ev-invest-list",children:W.map((e,s)=>(0,a.jsx)("li",{children:e},s))})]})]})]}),(0,a.jsx)(D,{title:"Value Bridge",subtitle:"How the result is built from gross opportunity to EV delta.",open:L,onToggle:()=>I(!L),children:(0,a.jsx)(M,{qlGross:e.gross,avGross:t.gross,overlap:l,risk:p,cost:m,evDelta:v})}),(0,a.jsxs)(D,{title:"Five-Dimension Gross Breakdown",subtitle:"Quiet Loss\\u2122 and Adaptive Value\\u2122 by dimension, before adjustments.",open:z,onToggle:()=>R(!z),children:[(0,a.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"var(--nf-space-3)"},children:w.map(s=>{let n=e[s.key],i=t[s.key];return(0,a.jsxs)("div",{className:"nf-calc-dim-row",children:[(0,a.jsx)("span",{className:"nf-calc-dim-label",children:s.label}),(0,a.jsxs)("span",{className:"nf-calc-dim-ql",children:["QL: ",r(n)]}),(0,a.jsxs)("span",{className:"nf-calc-dim-av",children:["AV: ",r(i)]}),(0,a.jsx)("span",{className:"nf-calc-dim-total",children:r(n+i)})]},s.key)})}),(0,a.jsx)("p",{className:"nf-ev-collapsible-note",children:"Values shown here are gross, before overlap, expected realisation and cost to realise."})]}),(0,a.jsx)(D,{title:"Value Translation Framework\\u2122 Lenses",subtitle:"Five interpretive lenses that help frame where value may appear.",open:S,onToggle:()=>$(!S),children:(0,a.jsx)("div",{className:"nf-calc-vtf-grid",children:q.map(e=>(0,a.jsxs)("div",{className:"nf-calc-vtf-card",children:[(0,a.jsx)("div",{className:"nf-calc-vtf-name",children:e.name}),(0,a.jsx)("div",{className:"nf-calc-vtf-desc",children:e.desc})]},e.name))})}),(0,a.jsxs)("div",{className:"nf-ev-engagement",children:[(0,a.jsxs)("div",{className:"nf-ev-engagement-ctas",children:[(0,a.jsxs)("button",{type:"button",className:"nf-cta nf-cta-primary",onClick:()=>(function(e){let{inputs:a,qlResults:s,avResults:t,qlAssumptions:n,avAssumptions:i,overlap:l,overlapValue:o,adjustedOpportunity:c,realisation:d,expectedRealisable:p,riskAllowance:u,costValue:m,evDelta:v,scenarioStatus:f,pool:h,ebitdaMargin:g}=e,b=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),x="above"===f?"#10b981":"below"===f?"#f87171":"#94a3b8",y=s.gross+t.gross,j=w.map(e=>{let a=s[e.key],n=t[e.key];return`<tr>
      <td class="dim-name">${e.label}</td>
      <td class="dim-val">${r(a)}</td>
      <td class="dim-val">${r(n)}</td>
      <td class="dim-val dim-total">${r(a+n)}</td>
    </tr>`}).join(""),N=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>NexFrontier Enterprise Value Scenario Report</title>
<style>
  @page {
    size: A4;
    margin: 18mm 16mm 22mm 16mm;
  }
  @page :first {
    margin: 0;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #1a1a1a;
    font-size: 10.5pt;
    line-height: 1.55;
    background: #fff;
  }

  /* Cover page */
  .cover {
    page-break-after: always;
    width: 210mm;
    height: 297mm;
    background: #041014;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 28mm 22mm;
    position: relative;
  }
  .cover-logo {
    font-size: 16pt;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #fff;
  }
  .cover-logo .accent { color: #0cc0df; }
  .cover-body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .cover-eyebrow {
    font-size: 8.5pt;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #0cc0df;
    margin-bottom: 16px;
  }
  .cover-title {
    font-size: 30pt;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin-bottom: 18px;
    max-width: 150mm;
  }
  .cover-sub {
    font-size: 11pt;
    line-height: 1.6;
    color: #94a3b8;
    max-width: 140mm;
    margin-bottom: 36px;
  }
  .cover-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 9.5pt;
    color: #cbd5e1;
  }
  .cover-meta-label { color: #64748b; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.12em; }
  .cover-meta-val { color: #e2e8f0; font-weight: 500; }
  .cover-footer {
    border-top: 1px solid rgba(255,255,255,0.12);
    padding-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 8pt;
    color: #64748b;
  }
  .cover-disclaimer {
    background: rgba(248, 113, 113, 0.08);
    border: 1px solid rgba(248, 113, 113, 0.25);
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 8.5pt;
    color: #fca5a5;
    margin-top: 20px;
    max-width: 130mm;
  }

  /* Content pages */
  .page {
    page-break-after: always;
    padding-top: 4mm;
  }
  .page:last-child { page-break-after: auto; }
  .page-eyebrow {
    font-size: 7.5pt;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #0cc0df;
    margin-bottom: 6px;
  }
  .page-heading {
    font-size: 18pt;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #041014;
    margin-bottom: 14px;
    line-height: 1.2;
  }
  .page-sub {
    font-size: 10pt;
    color: #64748b;
    margin-bottom: 20px;
    line-height: 1.55;
    max-width: 165mm;
  }
  h3.section {
    font-size: 11pt;
    font-weight: 600;
    color: #041014;
    margin-top: 18px;
    margin-bottom: 8px;
  }
  p { margin-bottom: 8px; }
  p.body { font-size: 10pt; color: #334155; line-height: 1.6; }

  /* Executive summary cards */
  .exec-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin-bottom: 18px;
  }
  .exec-card {
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px 14px;
    background: #f8fafc;
  }
  .exec-card.ql { border-top: 3px solid #f87171; }
  .exec-card.av { border-top: 3px solid #0cc0df; }
  .exec-card.gvo { border-top: 3px solid #041014; }
  .exec-label { font-size: 7.5pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 4px; }
  .exec-value { font-size: 16pt; font-weight: 700; color: #041014; }
  .exec-card.ql .exec-value { color: #f87171; }
  .exec-card.av .exec-value { color: #0cc0df; }

  /* Equation */
  .equation {
    display: flex;
    align-items: stretch;
    gap: 8px;
    margin-bottom: 18px;
  }
  .eq-term {
    flex: 1;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 8px;
    text-align: center;
    background: #f8fafc;
  }
  .eq-label { font-size: 7.5pt; color: #64748b; margin-bottom: 4px; }
  .eq-value { font-size: 13pt; font-weight: 700; }
  .eq-op { display: flex; align-items: center; font-size: 14pt; font-weight: 700; color: #94a3b8; }
  .eq-term.ql .eq-value { color: #f87171; }
  .eq-term.av .eq-value { color: #0cc0df; }
  .eq-term.adj .eq-value { color: #64748b; font-size: 10pt; }
  .eq-term.delta { background: #041014; border-color: #041014; }
  .eq-term.delta .eq-label { color: #94a3b8; }
  .eq-term.delta .eq-value { color: #0cc0df; }

  /* Adjustment rows */
  .adj-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  .adj-table th { text-align: left; font-size: 7.5pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; padding: 6px 10px; border-bottom: 1px solid #e2e8f0; }
  .adj-table td { font-size: 9.5pt; padding: 7px 10px; border-bottom: 1px solid #f1f5f9; }
  .adj-table td.val { font-weight: 600; text-align: right; font-variant-numeric: tabular-nums; }

  /* Dimension table */
  .dim-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  .dim-table th { text-align: left; font-size: 7.5pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; padding: 6px 10px; border-bottom: 1px solid #e2e8f0; }
  .dim-table th.num { text-align: right; }
  .dim-table td { font-size: 9.5pt; padding: 7px 10px; border-bottom: 1px solid #f1f5f9; }
  .dim-name { color: #041014; font-weight: 500; }
  .dim-val { text-align: right; font-variant-numeric: tabular-nums; color: #64748b; }
  .dim-total { font-weight: 600; color: #041014; }

  /* Delta banner */
  .delta-banner {
    background: #041014;
    color: #fff;
    border-radius: 8px;
    padding: 18px 24px;
    text-align: center;
    margin-bottom: 18px;
  }
  .delta-label { font-size: 8pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #94a3b8; margin-bottom: 6px; }
  .delta-value { font-size: 26pt; font-weight: 700; color: ${x}; margin-bottom: 4px; }
  .delta-status { font-size: 10pt; font-weight: 600; color: ${x}; margin-bottom: 6px; }
  .delta-note { font-size: 8.5pt; color: #94a3b8; }

  /* Interpretation list */
  .interp-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .interp-item { display: grid; grid-template-columns: 160px 1fr; gap: 12px; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 4px; background: #f8fafc; }
  .interp-label { font-size: 8.5pt; font-weight: 600; color: #475569; }
  .interp-text { font-size: 9pt; color: #64748b; line-height: 1.5; }

  /* VTF lenses */
  .vtf-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .vtf-item { padding: 8px 12px; border-left: 3px solid #0cc0df; background: #f8fafc; border-radius: 0 4px 4px 0; }
  .vtf-name { font-size: 9.5pt; font-weight: 600; color: #041014; margin-bottom: 2px; }
  .vtf-desc { font-size: 8.5pt; color: #64748b; line-height: 1.5; }

  /* Questions */
  .q-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; counter-reset: q; }
  .q-item { display: grid; grid-template-columns: 28px 1fr; gap: 10px; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 4px; }
  .q-num { font-size: 10pt; font-weight: 700; color: #0cc0df; }
  .q-text { font-size: 9.5pt; color: #334155; line-height: 1.55; }

  /* Evidence note */
  .evidence-note {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 6px;
    padding: 14px 18px;
    margin-bottom: 16px;
  }
  .evidence-title { font-size: 9pt; font-weight: 700; color: #dc2626; margin-bottom: 6px; }
  .evidence-body { font-size: 9pt; color: #991b1b; line-height: 1.55; }

  /* Closing note */
  .closing-note {
    background: #041014;
    color: #fff;
    border-radius: 8px;
    padding: 24px 28px;
    margin-bottom: 20px;
  }
  .closing-note p { font-size: 10pt; color: #cbd5e1; line-height: 1.65; margin-bottom: 10px; }
  .closing-note p:last-child { margin-bottom: 0; }
  .closing-note .highlight { color: #0cc0df; font-weight: 500; }

  /* CTA */
  .cta-panel {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 28px 28px 24px;
    text-align: center;
  }
  .cta-headline { font-size: 18pt; font-weight: 600; color: #041014; letter-spacing: -0.02em; margin-bottom: 10px; }
  .cta-sub { font-size: 10pt; color: #64748b; line-height: 1.6; margin-bottom: 20px; max-width: 130mm; margin-left: auto; margin-right: auto; }
  .cta-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  .cta-btn {
    display: inline-block;
    padding: 11px 22px;
    border-radius: 6px;
    font-size: 9.5pt;
    font-weight: 600;
    text-decoration: none;
  }
  .cta-btn-primary { background: #0cc0df; color: #041014; }
  .cta-btn-secondary { background: #041014; color: #fff; }
  .cta-btn-tertiary { background: transparent; color: #041014; border: 1px solid #cbd5e1; }
  .cta-note { font-size: 7.5pt; color: #94a3b8; margin-top: 14px; }

  /* Contact */
  .contact-block {
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px solid #e2e8f0;
    text-align: center;
    font-size: 9pt;
    color: #64748b;
  }
  .contact-block a { color: #0cc0df; text-decoration: none; }

  /* Running footer */
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 6mm 16mm 4mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 7.5pt;
    color: #94a3b8;
    border-top: 1px solid #e2e8f0;
  }
  .footer-brand { font-weight: 600; color: #64748b; }
  .footer-brand .accent { color: #0cc0df; }
  .footer-page::after { content: counter(page); }
  .page { counter-increment: page; }
  body { counter-reset: page; }

  /* Avoid orphan headings */
  h3.section { break-after: avoid; }
  .page-eyebrow, .page-heading { break-after: avoid; }
  .exec-grid, .equation, .dim-table, .adj-table, .delta-banner { break-inside: avoid; }
  .interp-item, .vtf-item, .q-item { break-inside: avoid; }
</style>
</head>
<body>

<!-- COVER -->
<div class="cover">
  <div>
    <div class="cover-logo">Nex<span class="accent">Frontier</span></div>
  </div>
  <div class="cover-body">
    <div class="cover-eyebrow">Illustrative Scenario Report</div>
    <div class="cover-title">Enterprise Value Scenario Report</div>
    <div class="cover-sub">An illustrative view of where value may already be going unrealised, where additional value may become possible, and what the scenario may warrant investigating next.</div>
    <div class="cover-meta">
      <div>
        <div class="cover-meta-label">Report Date</div>
        <div class="cover-meta-val">${b}</div>
      </div>
      <div>
        <div class="cover-meta-label">Prepared By</div>
        <div class="cover-meta-val">NexFrontier</div>
      </div>
    </div>
    <div class="cover-disclaimer">Illustrative scenario, not a valuation, forecast or diagnosis.</div>
  </div>
  <div class="cover-footer">
    <span>NexFrontier &middot; Intelligence for AI-mediated markets</span>
    <span>www.nexfrontier.my</span>
  </div>
</div>

<!-- OPENING NOTE -->
<div class="page">
  <div class="page-eyebrow">About this report</div>
  <div class="page-heading">About this report</div>
  <p class="body">This report translates the assumptions you entered into an illustrative view of Enterprise Value.</p>
  <p class="body">It considers two related possibilities:</p>
  <p class="body"><strong>Quiet Loss&trade;</strong>, value that may already be available from existing market opportunity but not fully captured, and <strong>Adaptive Value&trade;</strong>, additional value that may become possible as market conditions change.</p>
  <p class="body">The figures are not claims about your business. They are a structured way to ask whether there may be enough economic significance to justify further investigation.</p>
  <p class="body">NexFrontier's role is to help move that question from assumption to evidence.</p>
  <div class="footer">
    <span class="footer-brand">Nex<span class="accent">Frontier</span> &middot; www.nexfrontier.my</span>
    <span class="footer-page"></span>
  </div>
</div>

<!-- EXECUTIVE SUMMARY -->
<div class="page">
  <div class="page-eyebrow">Executive Summary</div>
  <div class="page-heading">Executive Summary</div>
  <p class="page-sub">The result of your scenario at a glance. All figures are illustrative annual values.</p>

  <div class="exec-grid">
    <div class="exec-card ql">
      <div class="exec-label">Quiet Loss&trade;</div>
      <div class="exec-value">${r(s.gross)}</div>
    </div>
    <div class="exec-card av">
      <div class="exec-label">Adaptive Value&trade;</div>
      <div class="exec-value">${r(t.gross)}</div>
    </div>
    <div class="exec-card gvo">
      <div class="exec-label">Gross Value Opportunity</div>
      <div class="exec-value">${r(y)}</div>
    </div>
  </div>

  <div class="equation">
    <div class="eq-term ql">
      <div class="eq-label">Quiet Loss&trade;</div>
      <div class="eq-value">${r(s.gross)}</div>
    </div>
    <div class="eq-op">+</div>
    <div class="eq-term av">
      <div class="eq-label">Adaptive Value&trade;</div>
      <div class="eq-value">${r(t.gross)}</div>
    </div>
    <div class="eq-op">&rarr;</div>
    <div class="eq-term adj">
      <div class="eq-label">Adjustments</div>
      <div class="eq-value">Overlap ${l}% &middot; Realisation ${d}% &middot; Cost ${r(m)}</div>
    </div>
    <div class="eq-op">&rarr;</div>
    <div class="eq-term delta">
      <div class="eq-label">EV Delta</div>
      <div class="eq-value">${r(v,!0)}</div>
    </div>
  </div>

  <table class="adj-table">
    <tr><th>Adjustment</th><th style="text-align:right">Value</th></tr>
    <tr><td>Gross Value Opportunity (QL + AV)</td><td class="val">${r(y)}</td></tr>
    <tr><td>Cross-Dimension Overlap (${l}%)</td><td class="val">${r(-o)}</td></tr>
    <tr><td>Adjusted Opportunity</td><td class="val">${r(c)}</td></tr>
    <tr><td>Expected Realisation (${d}%)</td><td class="val">${r(p)}</td></tr>
    <tr><td>Risk / Uncertainty Allowance</td><td class="val">${r(-u)}</td></tr>
    <tr><td>Estimated Annual Cost to Realise</td><td class="val">${r(-m)}</td></tr>
  </table>

  <div class="delta-banner">
    <div class="delta-label">Illustrative Annual Enterprise Value Delta</div>
    <div class="delta-value">${r(v,!0)}</div>
    <div class="delta-status">${"above"===f?"Above Status Quo":"below"===f?"Below Status Quo":"Broadly in line with Status Quo"}</div>
    <div class="delta-note">Illustrative annual movement relative to today's position.</div>
  </div>

  <div class="footer">
    <span class="footer-brand">Nex<span class="accent">Frontier</span> &middot; www.nexfrontier.my</span>
    <span class="footer-page"></span>
  </div>
</div>

<!-- WHAT THE RESULT MEANS -->
<div class="page">
  <div class="page-eyebrow">Interpretation</div>
  <div class="page-heading">What the result means</div>

  <div class="interp-list">
    <div class="interp-item">
      <span class="interp-label">What Quiet Loss&trade; represents</span>
      <span class="interp-text">Value from existing market opportunity that may not be fully captured today.</span>
    </div>
    <div class="interp-item">
      <span class="interp-label">What Adaptive Value&trade; represents</span>
      <span class="interp-text">Additional value that may become possible as market conditions change and the enterprise adapts.</span>
    </div>
    <div class="interp-item">
      <span class="interp-label">Why overlap is applied</span>
      <span class="interp-text">Reduces the combined QL + AV figure by your overlap assumption to avoid double-counting related economics across dimensions.</span>
    </div>
    <div class="interp-item">
      <span class="interp-label">Why expected realisation is applied</span>
      <span class="interp-text">Reduces the adjusted opportunity to what may reasonably survive uncertainty, execution risk and practical constraints.</span>
    </div>
    <div class="interp-item">
      <span class="interp-label">Why cost to realise matters</span>
      <span class="interp-text">Subtracted from the expected realisable value to arrive at the illustrative annual EV delta.</span>
    </div>
    <div class="interp-item">
      <span class="interp-label">What the EV Delta represents</span>
      <span class="interp-text">An illustrative annual movement relative to today's position, after adjustments.</span>
    </div>
    <div class="interp-item">
      <span class="interp-label">What this result does not prove</span>
      <span class="interp-text">Realised value, future performance, causation or a formal valuation.</span>
    </div>
  </div>

  <div class="footer">
    <span class="footer-brand">Nex<span class="accent">Frontier</span> &middot; www.nexfrontier.my</span>
    <span class="footer-page"></span>
  </div>
</div>

<!-- FIVE DIMENSIONS -->
<div class="page">
  <div class="page-eyebrow">Value Dimensions</div>
  <div class="page-heading">Five Enterprise Value Dimensions</div>
  <p class="page-sub">These are five different economic lenses on the same enterprise, not five separate products. The scenario contribution for each dimension is shown below.</p>

  <table class="dim-table">
    <tr>
      <th>Dimension</th>
      <th class="num">Quiet Loss&trade;</th>
      <th class="num">Adaptive Value&trade;</th>
      <th class="num">Combined</th>
    </tr>
    ${j}
  </table>
  <p style="font-size:8pt;color:#94a3b8;font-style:italic;margin-bottom:16px">Values shown are gross, before overlap, expected realisation and cost to realise.</p>

  <h3 class="section">How to read these dimensions</h3>
  <p class="body"><strong>Revenue</strong> &mdash; value from revenue opportunity across existing and changing market conditions.</p>
  <p class="body"><strong>Cost</strong> &mdash; value from cost efficiency or cost avoidance across non-people operating costs.</p>
  <p class="body"><strong>Capacity</strong> &mdash; value from people and capacity-related cost effectiveness.</p>
  <p class="body"><strong>Customer Value</strong> &mdash; value from the annualised customer value pool and customer lifetime dynamics.</p>
  <p class="body"><strong>Enterprise Capability</strong> &mdash; value from the organisation's ability to adapt fast enough to capture what is possible.</p>

  <div class="footer">
    <span class="footer-brand">Nex<span class="accent">Frontier</span> &middot; www.nexfrontier.my</span>
    <span class="footer-page"></span>
  </div>
</div>

<!-- VALUE TRANSLATION FRAMEWORK -->
<div class="page">
  <div class="page-eyebrow">Methodology</div>
  <div class="page-heading">Value Translation Framework&trade;</div>
  <p class="body">NexFrontier's Value Translation Framework&trade; is used to translate observed operational and market evidence into economic meaning.</p>
  <p class="body">The framework provides interpretive lenses that help frame where value may appear. These are different perspectives on the same enterprise, not separate required calculations.</p>

  <div class="vtf-list">
    <div class="vtf-item">
      <div class="vtf-name">Defensive Value</div>
      <div class="vtf-desc">Protecting existing revenue and customer relationships from erosion.</div>
    </div>
    <div class="vtf-item">
      <div class="vtf-name">Offensive Value</div>
      <div class="vtf-desc">Capturing new opportunity created by changing market conditions.</div>
    </div>
    <div class="vtf-item">
      <div class="vtf-name">Revenue Health</div>
      <div class="vtf-desc">Whether revenue quality, mix and pipeline are improving or deteriorating.</div>
    </div>
    <div class="vtf-item">
      <div class="vtf-name">Customer Lifetime Value</div>
      <div class="vtf-desc">How changing customer intent and expectations affect long-term value.</div>
    </div>
    <div class="vtf-item">
      <div class="vtf-name">Enterprise Capability</div>
      <div class="vtf-desc">Whether the organisation can adapt fast enough to capture what is possible.</div>
    </div>
  </div>

  <div class="footer">
    <span class="footer-brand">Nex<span class="accent">Frontier</span> &middot; www.nexfrontier.my</span>
    <span class="footer-page"></span>
  </div>
</div>

<!-- QUESTIONS -->
<div class="page">
  <div class="page-eyebrow">Next Steps</div>
  <div class="page-heading">What deserves investigation next?</div>
  <p class="page-sub">These questions turn the scenario result into executive inquiry rather than recommendations presented as fact.</p>

  <div class="q-list">
    <div class="q-item"><span class="q-num">1</span><span class="q-text">Where might existing opportunity already be going unrealised?</span></div>
    <div class="q-item"><span class="q-num">2</span><span class="q-text">Which value dimensions contribute most to the scenario?</span></div>
    <div class="q-item"><span class="q-num">3</span><span class="q-text">What evidence would confirm or challenge these assumptions?</span></div>
    <div class="q-item"><span class="q-num">4</span><span class="q-text">Where may changing customer behaviour or AI-mediated market conditions alter the opportunity?</span></div>
    <div class="q-item"><span class="q-num">5</span><span class="q-text">Which assumptions are most sensitive to the final result?</span></div>
    <div class="q-item"><span class="q-num">6</span><span class="q-text">What would leadership need to know before deciding whether intervention is justified?</span></div>
  </div>

  <div class="footer">
    <span class="footer-brand">Nex<span class="accent">Frontier</span> &middot; www.nexfrontier.my</span>
    <span class="footer-page"></span>
  </div>
</div>

<!-- EVIDENCE DISCIPLINE -->
<div class="page">
  <div class="page-eyebrow">Evidence Discipline</div>
  <div class="page-heading">Possibility is not proof</div>

  <div class="evidence-note">
    <div class="evidence-title">Possibility is not proof.</div>
    <div class="evidence-body">
      The report is based on user-entered scenario assumptions. It does not establish causation, realised value, future performance, recoverability or a formal valuation.
      <br><br>
      Actual claims require business evidence.
    </div>
  </div>

  <h3 class="section">What this does not prove</h3>
  <p class="body">This does not prove realised value, future performance, causation or a formal valuation.</p>
  <p class="body">This calculator does not diagnose Quiet Loss&trade;, forecast Adaptive Value&trade; or value your business.</p>
  <p class="body">Evidence determines what is real, what is material and what may be worth acting on.</p>

  <div class="footer">
    <span class="footer-brand">Nex<span class="accent">Frontier</span> &middot; www.nexfrontier.my</span>
    <span class="footer-page"></span>
  </div>
</div>

<!-- CLOSING NOTE + CTA -->
<div class="page">
  <div class="page-eyebrow">From Scenario to Evidence</div>
  <div class="page-heading">The useful question</div>

  <div class="closing-note">
    <p>The useful question is not whether this number is right.</p>
    <p>It is whether the possibility is significant enough to investigate.</p>
    <p>NexFrontier is building <span class="highlight">intelligence for AI-mediated markets</span> to help businesses understand what is changing, what may matter economically, and what the evidence says deserves attention.</p>
    <p>If this scenario raises a question worth exploring in your business, the next step is to <span class="highlight">test it against real evidence</span>.</p>
  </div>

  <div class="cta-panel">
    <div class="cta-headline">Turn the scenario into evidence.</div>
    <div class="cta-sub">Explore what may actually be happening in your business, what appears economically material and what may deserve leadership attention.</div>
    <div class="cta-row">
      <a class="cta-btn cta-btn-primary" href="${P}">Request a NexFrontier conversation</a>
      <a class="cta-btn cta-btn-secondary" href="${P}">Ask us to contact you</a>
      <a class="cta-btn cta-btn-tertiary" href="${Q}">Book a meeting</a>
    </div>
    <div class="cta-note">Meeting booking is routed via Market Enquiry until a live scheduling URL is configured.</div>
  </div>

  <div class="contact-block">
    <strong>NexFrontier Group Sdn. Bhd.</strong><br>
    L9, Menara Public Gold @TRX, 50400 Kuala Lumpur, Malaysia<br>
    <a href="mailto:hello@nexfrontier.my">hello@nexfrontier.my</a> &middot; <a href="https://www.nexfrontier.my">www.nexfrontier.my</a>
  </div>

  <div class="footer">
    <span class="footer-brand">Nex<span class="accent">Frontier</span> &middot; www.nexfrontier.my</span>
    <span class="footer-page"></span>
  </div>
</div>

</body>
</html>`,q=window.open("","_blank");q?(q.document.open(),q.document.write(N),q.document.close(),q.focus(),setTimeout(()=>{q.print()},500)):alert("Please allow pop-ups to open your report.")})({inputs:h,qlResults:e,avResults:t,qlAssumptions:g,avAssumptions:y,overlap:i,overlapValue:l,adjustedOpportunity:o,realisation:c,expectedRealisable:d,riskAllowance:p,costValue:m,evDelta:v,scenarioStatus:f,pool:N,ebitdaMargin:k}),children:[(0,a.jsx)(b.Download,{size:16})," Open My Enterprise Value Report"]}),(0,a.jsxs)("button",{type:"button",className:"nf-cta nf-cta-secondary",onClick:T,children:[(0,a.jsx)(x.FileText,{size:16})," Review My Inputs"]}),(0,a.jsxs)("a",{href:"/market-enquiry?topic=enterprise-value",className:"nf-cta nf-cta-tertiary",children:[(0,a.jsx)(j,{size:16})," Explore This With NexFrontier"]})]}),(0,a.jsx)("p",{className:"nf-ev-engagement-support",children:"If this scenario raises a question worth investigating, NexFrontier can help test it against real evidence."}),(0,a.jsx)("p",{className:"nf-calc-session-warning",children:"Your report opens in a new window. Use your browser's Print dialog to save it as a PDF before leaving this session."})]}),(0,a.jsx)(O,{onBack:E,backLabel:"Back to Adaptive Value\\u2122"})]})}function F({label:e,value:s,unit:t,min:n,max:i,step:l,onChange:r,explain:o,effectLabel:c,effectValue:d,resultLabel:p,resultValue:u}){return(0,a.jsxs)("div",{className:"nf-ev-adj-card",children:[(0,a.jsxs)("div",{className:"nf-ev-adj-header",children:[(0,a.jsx)("span",{className:"nf-ev-adj-name",children:e}),(0,a.jsxs)("span",{className:"nf-ev-adj-current",children:[s,t]})]}),(0,a.jsx)("p",{className:"nf-ev-adj-explain",children:o}),(0,a.jsxs)("div",{className:"nf-ev-adj-controls",children:[(0,a.jsx)("input",{type:"range",min:n,max:i,step:l,value:s,onChange:e=>r(Number(e.target.value)),className:"nf-ev-adj-slider","aria-label":e}),(0,a.jsx)("input",{type:"number",min:n,max:i,step:l,value:s,onChange:e=>{let a=Number(e.target.value);Number.isFinite(a)&&r(Math.max(n,Math.min(i,a)))},className:"nf-ev-adj-number-input","aria-label":`${e} value`})]}),(0,a.jsxs)("div",{className:"nf-ev-adj-effects",children:[(0,a.jsxs)("div",{className:"nf-ev-adj-effect",children:[(0,a.jsx)("span",{className:"nf-ev-adj-effect-label",children:c}),(0,a.jsx)("span",{className:"nf-ev-adj-effect-value",children:d})]}),(0,a.jsxs)("div",{className:"nf-ev-adj-effect",children:[(0,a.jsx)("span",{className:"nf-ev-adj-effect-label",children:p}),(0,a.jsx)("span",{className:"nf-ev-adj-effect-value",style:{color:"var(--nf-cyan)"},children:u})]})]})]})}function D({title:e,subtitle:s,open:t,onToggle:n,children:i}){return(0,a.jsxs)("div",{className:"nf-ev-collapsible",children:[(0,a.jsxs)("button",{type:"button",className:"nf-ev-collapsible-header",onClick:n,"aria-expanded":t,children:[(0,a.jsxs)("div",{className:"nf-ev-collapsible-titles",children:[(0,a.jsx)("span",{className:"nf-ev-collapsible-title",children:e}),(0,a.jsx)("span",{className:"nf-ev-collapsible-sub",children:s})]}),(0,a.jsx)(y.ChevronDown,{size:20,className:"nf-ev-collapsible-chevron",style:{transform:t?"rotate(180deg)":"none"}})]}),t&&(0,a.jsx)("div",{className:"nf-ev-collapsible-body",children:i})]})}function M({qlGross:e,avGross:s,overlap:t,risk:n,cost:i,evDelta:l}){let o=[{label:"Status Quo",value:r(0)},{label:"+ Quiet Loss™",value:r(e,!0)},{label:"+ Adaptive Value™",value:r(s,!0)},{label:"− Overlap",value:r(-t,!0)},{label:"− Risk / Uncertainty",value:r(-n,!0)},{label:"− Cost to Realise",value:r(-i,!0)},{label:"Enterprise Value Delta",value:r(l,!0)}];return(0,a.jsx)("div",{style:{marginBottom:"var(--nf-space-8)"},children:(0,a.jsx)("div",{style:{display:"flex",flexDirection:"column",gap:"4px"},children:o.map((e,s)=>{let t=s===o.length-1;return(0,a.jsxs)("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",borderRadius:"var(--nf-radius-control)",background:t?"var(--nf-bg-surface-3)":"var(--nf-bg-surface-1)",border:"1px solid "+(t?"var(--nf-border-accent)":"var(--nf-border)")},children:[(0,a.jsx)("span",{style:{fontSize:"0.875rem",fontWeight:t?600:400,color:t?"var(--nf-text-primary)":"var(--nf-text-secondary)"},children:e.label}),(0,a.jsx)("span",{style:{fontSize:"0.875rem",fontWeight:t?700:500,color:t?"var(--nf-cyan)":"var(--nf-text-secondary)"},children:e.value})]},s)})})})}function O({onBack:e,backLabel:s,onNext:t,nextLabel:n,nextDisabled:i}){return(0,a.jsxs)("div",{className:"nf-calc-stage-nav",children:[e&&s&&(0,a.jsxs)("button",{onClick:e,className:"nf-calc-back-btn",children:[(0,a.jsx)(v.ArrowLeft,{size:15})," ",s]}),t&&n&&(0,a.jsxs)("button",{onClick:t,disabled:i,className:"nf-calc-next-btn",style:{opacity:i?.4:1,cursor:i?"not-allowed":"pointer"},children:[n," ",(0,a.jsx)(m.ArrowRight,{size:15})]})]})}let P="/market-enquiry",Q="/market-enquiry?topic=meeting";e.s(["EnterpriseValueCalculator",()=>k],4652)}]);
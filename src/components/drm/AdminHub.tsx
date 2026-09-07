'use client';

import { useState } from 'react';
import { FileText, LayoutDashboard } from 'lucide-react';
import { AdminShell } from './AdminShell';
import { EnquiriesAdmin } from './EnquiriesAdmin';

type View = 'core' | 'enquiries';

export function AdminHub() {
  const [view,setView]=useState<View>('core');
  return <div style={{minHeight:'100vh',background:'var(--nf-bg-primary)'}}>
    <div style={{background:'var(--nf-bg-secondary)',borderBottom:'1px solid var(--nf-border)',padding:'8px var(--nf-space-5)'}}>
      <div style={{maxWidth:'var(--nf-container-wide)',margin:'0 auto',display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
        <span style={{fontSize:'0.6875rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--nf-text-tertiary)',marginRight:6}}>Admin</span>
        <button onClick={()=>setView('core')} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 11px',borderRadius:'var(--nf-radius-button)',border:'1px solid var(--nf-border)',background:view==='core'?'var(--nf-cyan-dim)':'var(--nf-bg-surface-1)',color:view==='core'?'var(--nf-cyan)':'var(--nf-text-secondary)',fontSize:'0.8125rem',fontWeight:600,cursor:'pointer'}}><LayoutDashboard size={14}/>Core Admin</button>
        <button onClick={()=>setView('enquiries')} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 11px',borderRadius:'var(--nf-radius-button)',border:'1px solid var(--nf-border)',background:view==='enquiries'?'var(--nf-cyan-dim)':'var(--nf-bg-surface-1)',color:view==='enquiries'?'var(--nf-cyan)':'var(--nf-text-secondary)',fontSize:'0.8125rem',fontWeight:600,cursor:'pointer'}}><FileText size={14}/>Enquiries</button>
      </div>
    </div>
    {view==='core'?<AdminShell/>:<EnquiriesAdmin/>}
  </div>;
}

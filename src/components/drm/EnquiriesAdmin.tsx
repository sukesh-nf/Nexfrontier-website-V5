'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, RefreshCw, Search, X } from 'lucide-react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const STATUSES = ['pending', 'reviewing', 'contacted', 'qualified', 'closed', 'not_relevant', 'spam'] as const;
type EnquiryStatus = typeof STATUSES[number];

type Enquiry = {
  id:string; name:string; email:string; organisation?:string|null; role?:string|null;
  enquiry_type:string; revenue_range?:string|null; message?:string|null; website?:string|null;
  consent:boolean; status:EnquiryStatus; created_at:string; updated_at?:string|null;
};
type EnquiryEvent = { id:string; event_type:string; from_status?:string|null; to_status?:string|null; note?:string|null; created_at:string };

const titleCase = (v:string) => v.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
const fmt = (v?:string|null) => v ? new Date(v).toLocaleString('en-NZ',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';

export function EnquiriesAdmin() {
  const [rows,setRows]=useState<Enquiry[]>([]); const [selected,setSelected]=useState<Enquiry|null>(null);
  const [events,setEvents]=useState<EnquiryEvent[]>([]); const [loading,setLoading]=useState(true);
  const [detailLoading,setDetailLoading]=useState(false); const [saving,setSaving]=useState(false); const [error,setError]=useState('');
  const [query,setQuery]=useState(''); const [filter,setFilter]=useState('all'); const [statusDraft,setStatusDraft]=useState<EnquiryStatus>('pending');
  const [statusNote,setStatusNote]=useState(''); const [note,setNote]=useState('');

  const api = useCallback(async(action:string,body:Record<string,unknown>={})=>{
    const token=sessionStorage.getItem('drm_admin_token');
    if(!token) throw new Error('Admin sign-in required. Open Core Admin and sign in first.');
    const adminRaw=sessionStorage.getItem('drm_admin');
    if(adminRaw){ try { const admin=JSON.parse(adminRaw); if(admin.role==='content_admin') throw new Error('Market enquiries are available to Super Admin and Investor Admin only.'); } catch(e){ if(e instanceof Error && e.message.includes('Market enquiries')) throw e; } }
    const r=await fetch(`${SUPABASE_URL}/functions/v1/market-enquiry-admin?action=${action}`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`,apikey:ANON_KEY||''},body:JSON.stringify(body)});
    const data=await r.json(); if(!r.ok||!data.ok) throw new Error(data.message||'Enquiry action failed.'); return data;
  },[]);

  const load=useCallback(async()=>{setLoading(true);setError('');try{const d=await api('list');setRows(d.enquiries||[]);}catch(e){setError(e instanceof Error?e.message:'Unable to load enquiries.');}finally{setLoading(false);}},[api]);
  const open=useCallback(async(row:Enquiry)=>{setSelected(row);setStatusDraft(row.status);setEvents([]);setDetailLoading(true);setError('');try{const d=await api('detail',{enquiryId:row.id});setSelected(d.enquiry);setStatusDraft(d.enquiry.status);setEvents(d.events||[]);}catch(e){setError(e instanceof Error?e.message:'Unable to load enquiry.');}finally{setDetailLoading(false);}},[api]);
  useEffect(()=>{load();},[load]);

  const filtered=useMemo(()=>rows.filter(r=>{if(filter!=='all'&&r.status!==filter)return false;if(!query.trim())return true;const q=query.toLowerCase();return [r.name,r.email,r.organisation||'',r.role||'',r.enquiry_type].some(v=>v.toLowerCase().includes(q));}),[rows,query,filter]);

  const saveStatus=async()=>{if(!selected)return;setSaving(true);setError('');try{await api('update-status',{enquiryId:selected.id,status:statusDraft,note:statusNote});setStatusNote('');await load();await open({...selected,status:statusDraft});}catch(e){setError(e instanceof Error?e.message:'Unable to update status.');}finally{setSaving(false);}};
  const addNote=async()=>{if(!selected||!note.trim())return;setSaving(true);setError('');try{await api('add-note',{enquiryId:selected.id,note:note.trim()});setNote('');await open(selected);}catch(e){setError(e instanceof Error?e.message:'Unable to add note.');}finally{setSaving(false);}};

  return <div style={{padding:'var(--nf-space-7)',background:'var(--nf-bg-primary)',minHeight:'calc(100vh - 48px)',color:'var(--nf-text-primary)'}}>
    <div style={{display:'flex',justifyContent:'space-between',gap:16,alignItems:'flex-start',flexWrap:'wrap',marginBottom:'var(--nf-space-6)'}}><div><h2 style={{margin:0,fontSize:'1.5rem'}}>Market Enquiries</h2><p style={{margin:'6px 0 0',color:'var(--nf-text-tertiary)',fontSize:'0.8125rem'}}>Review, qualify and record follow-up from the public enquiry form.</p></div><button onClick={load} disabled={loading} style={{padding:'8px 12px',display:'inline-flex',gap:7,alignItems:'center',background:'var(--nf-bg-surface-1)',border:'1px solid var(--nf-border)',borderRadius:'var(--nf-radius-button)',color:'var(--nf-text-secondary)',cursor:'pointer'}}><RefreshCw size={14}/>Refresh</button></div>
    {error&&<div style={{padding:'10px 14px',marginBottom:'var(--nf-space-5)',border:'1px solid var(--nf-negative)',borderRadius:'var(--nf-radius-control)',background:'var(--nf-bg-surface-1)',fontSize:'0.8125rem'}}>{error}</div>}
    <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:'var(--nf-space-5)'}}><div style={{display:'flex',gap:8,alignItems:'center',padding:'8px 12px',flex:'1 1 260px',maxWidth:420,background:'var(--nf-bg-surface-1)',border:'1px solid var(--nf-border)',borderRadius:'var(--nf-radius-control)'}}><Search size={14}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, email, organisation..." style={{width:'100%',background:'none',border:0,outline:0,color:'var(--nf-text-primary)'}}/></div><select value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:'8px 12px',background:'var(--nf-bg-surface-1)',border:'1px solid var(--nf-border)',borderRadius:'var(--nf-radius-control)',color:'var(--nf-text-secondary)'}}><option value="all">All statuses</option>{STATUSES.map(s=><option key={s} value={s}>{titleCase(s)}</option>)}</select></div>
    {loading?<div style={{display:'flex',gap:8,alignItems:'center',color:'var(--nf-text-tertiary)'}}><Loader2 size={17}/>Loading enquiries...</div>:<div style={{overflowX:'auto',border:'1px solid var(--nf-border)',borderRadius:'var(--nf-radius-panel)',background:'var(--nf-bg-surface-1)'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.8125rem'}}><thead><tr>{['Name','Organisation','Type','Revenue','Received','Status'].map(h=><th key={h} style={{textAlign:'left',padding:'10px 12px',borderBottom:'1px solid var(--nf-border)',color:'var(--nf-text-tertiary)',fontSize:'0.6875rem',textTransform:'uppercase'}}>{h}</th>)}</tr></thead><tbody>{filtered.map(r=><tr key={r.id} onClick={()=>open(r)} style={{cursor:'pointer',borderBottom:'1px solid var(--nf-border)'}}><td style={{padding:'11px 12px',fontWeight:600}}>{r.name}<span style={{display:'block',fontWeight:400,color:'var(--nf-text-tertiary)'}}>{r.email}</span></td><td style={{padding:'11px 12px'}}>{r.organisation||'—'}</td><td style={{padding:'11px 12px'}}>{titleCase(r.enquiry_type)}</td><td style={{padding:'11px 12px'}}>{r.revenue_range?titleCase(r.revenue_range):'—'}</td><td style={{padding:'11px 12px',whiteSpace:'nowrap'}}>{fmt(r.created_at)}</td><td style={{padding:'11px 12px',fontWeight:700}}>{titleCase(r.status)}</td></tr>)}</tbody></table>{filtered.length===0&&<p style={{padding:24,textAlign:'center',color:'var(--nf-text-tertiary)'}}>No enquiries match the current filters.</p>}</div>}
    {selected&&<div onClick={()=>setSelected(null)} style={{position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,.65)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}><div onClick={e=>e.stopPropagation()} style={{width:'min(760px,100%)',maxHeight:'88vh',overflowY:'auto',padding:'var(--nf-space-6)',background:'var(--nf-bg-secondary)',border:'1px solid var(--nf-border)',borderRadius:'var(--nf-radius-panel)'}}><div style={{display:'flex',justifyContent:'space-between'}}><div><h3 style={{margin:0}}>{selected.name}</h3><p style={{margin:'4px 0 20px',color:'var(--nf-text-tertiary)'}}>{selected.email}</p></div><button onClick={()=>setSelected(null)} style={{background:'none',border:0,color:'var(--nf-text-tertiary)',cursor:'pointer'}}><X size={20}/></button></div>{detailLoading?<p>Loading...</p>:<><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,marginBottom:20}}><div>Organisation<br/><b>{selected.organisation||'—'}</b></div><div>Role<br/><b>{selected.role||'—'}</b></div><div>Type<br/><b>{titleCase(selected.enquiry_type)}</b></div><div>Revenue<br/><b>{selected.revenue_range?titleCase(selected.revenue_range):'—'}</b></div></div>{selected.message&&<div style={{padding:12,marginBottom:20,whiteSpace:'pre-wrap',background:'var(--nf-bg-surface-1)',border:'1px solid var(--nf-border)',borderRadius:'var(--nf-radius-control)'}}>{selected.message}</div>}<div style={{marginBottom:20}}><label style={{display:'block',marginBottom:6}}>Status</label><div style={{display:'flex',gap:8,flexWrap:'wrap'}}><select value={statusDraft} onChange={e=>setStatusDraft(e.target.value as EnquiryStatus)}>{STATUSES.map(s=><option key={s} value={s}>{titleCase(s)}</option>)}</select><input value={statusNote} onChange={e=>setStatusNote(e.target.value)} placeholder="Optional status note" style={{flex:1,minWidth:200}}/><button onClick={saveStatus} disabled={saving||statusDraft===selected.status}>Save status</button></div></div><div style={{display:'flex',gap:8,marginBottom:20}}><input value={note} onChange={e=>setNote(e.target.value)} placeholder="Add internal note..." style={{flex:1}}/><button onClick={addNote} disabled={saving||!note.trim()}>Add note</button></div><h4>History</h4>{events.length===0?<p style={{color:'var(--nf-text-tertiary)'}}>No enquiry events recorded yet.</p>:events.map(ev=><div key={ev.id} style={{padding:'8px 0',borderBottom:'1px solid var(--nf-border)'}}><b>{titleCase(ev.event_type)}</b><div style={{color:'var(--nf-text-tertiary)',fontSize:'0.75rem'}}>{fmt(ev.created_at)}{ev.to_status?` · ${ev.from_status?titleCase(ev.from_status):''} → ${titleCase(ev.to_status)}`:''}</div>{ev.note&&<div>{ev.note}</div>}</div>)}</>}</div></div>}
  </div>;
}

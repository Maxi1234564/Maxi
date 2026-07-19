function bootApp() {

const { useState, useEffect, useRef, useCallback } = React;
const e = React.createElement;

/* ─────────────────────────────────────────────────────────
   ICONS (inline SVG components)
───────────────────────────────────────────────────────── */
const Icon = ({ d, size=18, cls='' }) =>
  e('svg',{width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.75,strokeLinecap:'round',strokeLinejoin:'round',className:cls},
    e('path',{d}));

const icons = {
  menu: 'M3 12h18M3 6h18M3 18h18',
  x: 'M18 6L6 18M6 6l12 12',
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
  arrowLeft: 'M19 12H5M12 19l-7-7 7-7',
  chevDown: 'M6 9l6 6 6-6',
  phone: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.14 12a19.79 19.79 0 01-3.07-8.67A2 2 0 012.04 1h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0122 16.92z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  mapPin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 10a1 1 0 100-2 1 1 0 000 2z',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
  check: 'M20 6L9 17l-5-5',
  checkCircle: 'M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  globe: 'M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  building: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  laptop: 'M2 8a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2zM0 18h24',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  home: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  lock: 'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4',
  refresh: 'M1 4v6h6M23 20v-6h-6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15',
  layout: 'M5 3H3a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2zM21 3h-6a2 2 0 00-2 2v4a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2zM21 13h-6a2 2 0 00-2 2v4a2 2 0 002 2h6a2 2 0 002-2v-4a2 2 0 00-2-2zM5 13H3a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2z',
  msgCircle: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  target: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 18a6 6 0 100-12 6 6 0 000 12zM12 14a2 2 0 100-4 2 2 0 000 4z',
  clock: 'M12 2a10 10 0 100 20A10 10 0 0012 2zM12 6v6l4 2',
  heart: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z'
};

const Ico = ({ name, size=18, cls='' }) => e(Icon, { d: icons[name], size, cls });

/* ─────────────────────────────────────────────────────────
   SCROLL ANIMATION HOOK
───────────────────────────────────────────────────────── */
function useScrollAnim() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    setTimeout(() => {
      document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
    }, 50);
    return () => obs.disconnect();
  });
}

/* ─────────────────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────────────────── */
function MobileMenu({ nav, page, go, onClose, t, lang, setLang }) {
  const isDE = lang === 'DE';
  const [openSub, setOpenSub] = React.useState(null);

  const handleNav = key => { go(key); onClose(); };

  const menuContent = e(React.Fragment, null,
    // Backdrop
    e('div', { onClick: onClose, style:{ position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:9998,background:'rgba(26,25,23,.45)', backdropFilter:'blur(3px)' } }),

    // Panel
    e('div', { style:{ position:'fixed',top:0,right:0,bottom:0,zIndex:9999,width:'min(360px,100vw)',background:'#FAF9F7',overflowY:'auto',display:'flex',flexDirection:'column',boxShadow:'-8px 0 48px rgba(0,0,0,.15)',animation:'slideRight .22s ease-out' } },

      // Header
      e('div', { style:{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px',borderBottom:'1px solid #ECEAE6' } },
        e('span', { style:{ fontFamily:"'Cormorant Garamond',serif",fontSize:'18px',fontWeight:500,color:'#1A1917',letterSpacing:'.01em' } }, 'NSBB'),
        e('button', { onClick:onClose,'aria-label':'Menü schließen', style:{ background:'none',border:'none',cursor:'pointer',padding:'6px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'8px' } },
          e('svg',{width:20,height:20,viewBox:'0 0 24 24',fill:'none',stroke:'#1A1917',strokeWidth:2,strokeLinecap:'round'},
            e('path',{d:'M18 6L6 18M6 6l12 12'})
          )
        ),
      ),

      // Nav items
      e('nav', { style:{ flex:1,padding:'4px 0' } },
        nav.map(item => e(React.Fragment, { key:item.key },
          item.children
            // Item with children = expandable group
            ? e('div', null,
                e('button', {
                  onClick:()=>setOpenSub(openSub===item.key?null:item.key),
                  style:{ width:'100%',textAlign:'left',background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 20px' }
                },
                  e('span', { style:{ fontSize:'14px',fontWeight:500,color:openSub===item.key?'var(--accent)':'#1A1917',fontFamily:"'DM Sans',sans-serif",letterSpacing:'-.01em' } }, item.label),
                  e('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:openSub===item.key?'var(--accent)':'#6B6358',strokeWidth:2,strokeLinecap:'round',style:{transition:'transform .2s',transform:openSub===item.key?'rotate(180deg)':'none'}},
                    e('path',{d:'M6 9l6 6 6-6'})
                  ),
                ),
                openSub===item.key && e('div', { style:{ backgroundColor:'#F4F2EE',paddingTop:'4px',paddingBottom:'4px' } },
                  item.children.map(child =>
                    e('button', { key:child.key,
                      onClick:()=>handleNav(child.key),
                      style:{ width:'100%',textAlign:'left',background:'none',border:'none',cursor:'pointer',padding:'10px 24px 10px 40px',fontSize:'14px',color:page===child.key?'var(--accent)':'#3D3830',fontFamily:"'DM Sans',sans-serif",display:'block' }
                    }, child.label)
                  )
                ),
              )
            // Plain item
            : e('button', {
                onClick:()=>handleNav(item.key),
                style:{ width:'100%',textAlign:'left',background:'none',border:'none',cursor:'pointer',padding:'7px 20px',fontSize:'14px',fontWeight:500,color:page===item.key?'var(--accent)':'#1A1917',fontFamily:"'DM Sans',sans-serif",letterSpacing:'-.01em',display:'block' }
              }, item.label)
        ))
      ),

      // Divider
      e('div', { style:{ height:'1px',backgroundColor:'#ECEAE6',margin:'0 20px' } }),

      // Bottom CTA + contact
      e('div', { style:{ padding:'16px 20px 24px' } },
        // CTA button
        e('button', { onClick:()=>handleNav('kontakt'), style:{ width:'100%',padding:'14px',backgroundColor:'var(--accent)',color:'white',border:'none',borderRadius:'12px',fontSize:'14px',fontWeight:600,fontFamily:"'DM Sans',sans-serif",cursor:'pointer',marginBottom:'24px',letterSpacing:'.01em' } },
          isDE?'Beratungsgespräch vereinbaren':'Schedule a consultation'
        ),

        // Contact info
        e('div', { style:{ display:'flex',flexDirection:'column',gap:'14px' } },
          e('div', null,
            e('p', { style:{ fontSize:'10px',fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:'#B0A89E',fontFamily:"'DM Sans',sans-serif",marginBottom:'4px' } }, 'Berlin'),
            e('a', { href:'tel:+493081580930', style:{ fontSize:'13px',color:'#3D3830',fontFamily:"'DM Sans',sans-serif",textDecoration:'none',display:'block' } }, '+49 (0) 30 815 80 93'),
          ),
          e('div', null,
            e('p', { style:{ fontSize:'10px',fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:'#B0A89E',fontFamily:"'DM Sans',sans-serif",marginBottom:'4px' } }, 'Köln'),
            e('a', { href:'tel:+492219730640', style:{ fontSize:'13px',color:'#3D3830',fontFamily:"'DM Sans',sans-serif",textDecoration:'none',display:'block' } }, '+49 (0) 221 973 064 0'),
          ),
          e('a', { href:'mailto:info@nsbb.de', style:{ fontSize:'13px',color:'var(--accent)',fontFamily:"'DM Sans',sans-serif",textDecoration:'none',fontWeight:500 } }, 'info@nsbb.de'),
        ),

        // Language switch – analog zum Desktop-Header: DE und EN nebeneinander,
        // beide mit Flagge, aktive Sprache in Akzentfarbe hervorgehoben.
        e('div', { role:'group', 'aria-label': lang==='DE'?'Sprache':'Language', style:{ marginTop:'20px', display:'flex', gap:'8px' } },
          e('button', { onClick:()=>setLang('DE'), 'aria-pressed': lang==='DE', style:{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', background:'none', border:'1px solid ' + (lang==='DE' ? 'var(--accent)' : '#ECEAE6'), borderRadius:'6px', cursor:'pointer', fontSize:'12px', fontWeight:700, letterSpacing:'.08em', fontFamily:"'DM Sans',sans-serif", color: lang==='DE' ? 'var(--accent)' : '#B0A89E' } },
            e('svg', { width:14, height:10, viewBox:'0 0 5 3', style:{ borderRadius:'1px', display:'block', flexShrink:0, boxShadow:'0 0 0 1px rgba(0,0,0,.08)' } },
              e('rect',{ width:5, height:1, y:0, fill:'#000' }),
              e('rect',{ width:5, height:1, y:1, fill:'#DD0000' }),
              e('rect',{ width:5, height:1, y:2, fill:'#FFCE00' })
            ),
            'DE'
          ),
          e('button', { onClick:()=>setLang('EN'), 'aria-pressed': lang==='EN', style:{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', background:'none', border:'1px solid ' + (lang==='EN' ? 'var(--accent)' : '#ECEAE6'), borderRadius:'6px', cursor:'pointer', fontSize:'12px', fontWeight:700, letterSpacing:'.08em', fontFamily:"'DM Sans',sans-serif", color: lang==='EN' ? 'var(--accent)' : '#B0A89E' } },
            e('svg', { width:14, height:10, viewBox:'0 0 60 30', style:{ borderRadius:'1px', display:'block', flexShrink:0, boxShadow:'0 0 0 1px rgba(0,0,0,.08)' } },
              e('rect', { width:60, height:30, fill:'#012169' }),
              e('path', { d:'M0,0 L60,30 M60,0 L0,30', stroke:'#fff', strokeWidth:6 }),
              e('path', { d:'M0,0 L60,30 M60,0 L0,30', stroke:'#C8102E', strokeWidth:2 }),
              e('path', { d:'M30,0 v30 M0,15 h60', stroke:'#fff', strokeWidth:10 }),
              e('path', { d:'M30,0 v30 M0,15 h60', stroke:'#C8102E', strokeWidth:6 })
            ),
            'EN'
          )
        ),
      ),
    ),
  );

  return ReactDOM.createPortal(menuContent, document.body);
}


function Nav({ page, setPage, lang, setLang, t }) {
  const isDE = lang === 'DE';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { if (!mobileOpen) return; const h = (e) => { if (e.key==='Escape') setMobileOpen(false); }; document.addEventListener('keydown',h); return ()=>document.removeEventListener('keydown',h); }, [mobileOpen]);
  const [openDrop, setOpenDrop] = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Nav ohne "Startseite/Home" (Logo fuehrt zurueck) und ohne "Kontakt/Contact"
  // (rechts steht bereits der Kontakt-Button). altLabel enthaelt die jeweils
  // andere Sprache, damit die Button-Breite beim DE/EN-Wechsel stabil bleibt
  // (unsichtbarer Zwilling reserviert die max. Breite).
  const nav = [
    { label: lang==='DE'?'Digitale Kanzlei':'Digital Office', altLabel: lang==='DE'?'Digital Office':'Digitale Kanzlei', key: 'digital' },
    { label: lang==='DE'?'Leistungen':'Services', altLabel: lang==='DE'?'Services':'Leistungen', key: 'leistungen-unternehmen', children: [
      { label: lang==='DE'?'Für Unternehmen':'For Businesses', key: 'leistungen-unternehmen' },
      { label: lang==='DE'?'Internationales Steuerrecht':'International Tax', key: 'leistungen-international' },
      { label: lang==='DE'?'Für Privatpersonen':'For Individuals', key: 'leistungen-privat' },
    ]},
    { label: 'TGS International', altLabel: 'TGS International', key: 'tgs' },
    { label: 'Insights', altLabel: 'Insights', key: 'insights' },
    { label: lang==='DE'?'Über uns':'About us', altLabel: lang==='DE'?'About us':'Über uns', key: 'ueber-uns' },
    { label: lang==='DE'?'Karriere':'Careers', altLabel: lang==='DE'?'Careers':'Karriere', key: 'karriere' },
    { label: lang==='DE'?'Kanzleinachfolge':'Practice Succession', altLabel: lang==='DE'?'Practice Succession':'Kanzleinachfolge', key: 'kanzleinachfolge' },
  ];

  const go = (key) => { setPage(key); setMobileOpen(false); setOpenDrop(null); window.scrollTo(0,0); };

  return e(React.Fragment, null,
    e('header', {
      style:{
        position:'fixed', top:0, left:0, right:0,
        zIndex:50,
        // Immer voll deckendes Weiss – kein Grau-Durchschimmern ueber dunklen Sektionen (z.B. Leistungen)
        background: '#ffffff',
        boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,.07)' : 'none',
        transition:'padding .3s ease, box-shadow .3s ease',
        padding: scrolled ? '12px 0' : '16px 0',
      },
    },
      e('div', { style:{ maxWidth:'1320px', margin:'0 auto', padding:'0 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'24px' } },
        // Logo
        e('button', { onClick: () => go('home'), 'aria-label':'NSBB – Startseite', style:{ flexShrink:0, background:'none', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center' } },
          e('img', { src:'assets/images/logo-nav.webp', alt:'NSBB – Die Steuerberaterkanzlei', style:{ height:'44px', width:'auto', display:'block' } })
        ),

        // Desktop nav – only on large screens
        e('nav', { className:'hidden lg:flex', style:{ alignItems:'center', gap:'2px' }, onMouseLeave: () => setOpenDrop(null) },
          nav.map(item =>
            e('div', { key: item.key, style:{ position:'relative' } },
              e('button', {
                'aria-current': page.startsWith(item.key) ? 'page' : undefined,
                style:{ padding:'8px 14px', borderRadius:'8px', fontSize:'14px', fontWeight:500, border:'none', background:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", color: page.startsWith(item.key) ? '#4A7C59' : '#524C44', display:'flex', alignItems:'center', justifyContent:'center', gap:'4px' },
                onClick: () => item.children ? setOpenDrop(openDrop === item.key ? null : item.key) : go(item.key),
              },
                // Grid-Overlay: sichtbares Label + unsichtbarer Zwilling in derselben
                // Grid-Zelle -> Buttonbreite bleibt konstant beim DE/EN-Wechsel.
                e('span', { style:{ display:'inline-grid', gridTemplateAreas:'"lbl"' } },
                  e('span', { style:{ gridArea:'lbl', whiteSpace:'nowrap' } }, item.label),
                  item.altLabel && item.altLabel !== item.label && e('span', { 'aria-hidden':'true', style:{ gridArea:'lbl', whiteSpace:'nowrap', visibility:'hidden', pointerEvents:'none' } }, item.altLabel)
                ),
                item.children && e('svg',{width:13,height:13,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,style:{transform: openDrop===item.key?'rotate(180deg)':'rotate(0deg)',transition:'transform .2s'}},e('path',{d:'M6 9l6 6 6-6'}))
              ),
              item.children && openDrop === item.key && e('div', {
                style:{ position:'absolute', top:'100%', left:0, marginTop:'4px', width:'240px', background:'#fff', borderRadius:'16px', boxShadow:'0 8px 32px rgba(0,0,0,.12)', border:'1px solid #E2DDD8', padding:'8px', zIndex:100 },
              },
                item.children.map(child =>
                  child.children
                    ? e('div', { key:child.key, style:{ borderTop:'1px solid var(--border)', paddingTop:'6px', marginTop:'4px' } },
                        e('button', { style:{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', textAlign:'left', padding:'8px 16px 4px', fontSize:'13px', fontWeight:600, color: page===child.key ? 'var(--accent)' : '#1A1917', fontFamily:"'DM Sans',sans-serif", border:'none', background:'transparent', cursor:'pointer', borderRadius:'8px' }, onClick:()=>go(child.key) },
                          child.label,
                          e('svg',{width:13,height:13,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2},e('path',{d:'M9 18l6-6-6-6'}))
                        ),
                        child.children.map(sub => e('button', {
                          key:sub.key,
                          style:{ display:'block', width:'100%', textAlign:'left', padding:'8px 16px 8px 24px', fontSize:'13px', color: page===sub.key ? 'var(--accent)' : 'var(--muted)', fontFamily:"'DM Sans',sans-serif", border:'none', background:'transparent', cursor:'pointer', borderRadius:'8px' },
                          onClick: () => go(sub.key),
                        }, sub.label))
                      )
                    : e('button', {
                        key: child.key,
                        style:{ display:'block', width:'100%', textAlign:'left', padding:'10px 16px', fontSize:'14px', color: page===child.key ? 'var(--accent)' : 'var(--muted)', fontFamily:"'DM Sans',sans-serif", border:'none', background:'transparent', cursor:'pointer', borderRadius:'8px' },
                        onClick: () => go(child.key),
                      }, child.label)
                )
              ),
            )
          )
        ),

        // Right: lang + CTA (desktop) + hamburger (mobile)
        e('div', { style:{ display:'flex', alignItems:'center', gap:'12px' } },
          e('a', { href:'tel:+493081580930', style:{ display:'none', fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:500, color:'var(--muted)', textDecoration:'none', letterSpacing:'.01em' }, className:'nav-phone' }, '+49 30 815 80 93'),
          // Sprachumschalter: DE und EN untereinander, jeweils mit Flagge, aktive
          // Sprache in Akzentfarbe. So sieht der Besucher beide Optionen und muss
          // nicht raten, welche der beiden gerade aktiv ist.
          e('div', { role:'group', 'aria-label': lang==='DE'?'Sprache':'Language', style:{ display:'flex', flexDirection:'column', gap:'2px' } },
            e('button', {
              onClick: () => setLang('DE'),
              'aria-label': 'Auf Deutsch wechseln',
              'aria-pressed': lang==='DE',
              style:{ display:'flex', alignItems:'center', gap:'6px', padding:'2px 6px', background:'none', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:700, letterSpacing:'.1em', fontFamily:"'DM Sans',sans-serif", color: lang==='DE' ? 'var(--accent)' : '#B0A89E', transition:'color .2s' }
            },
              e('svg', { width:14, height:10, viewBox:'0 0 5 3', style:{ borderRadius:'1px', display:'block', flexShrink:0, boxShadow:'0 0 0 1px rgba(0,0,0,.08)' } },
                e('rect',{ width:5, height:1, y:0, fill:'#000' }),
                e('rect',{ width:5, height:1, y:1, fill:'#DD0000' }),
                e('rect',{ width:5, height:1, y:2, fill:'#FFCE00' })
              ),
              'DE'
            ),
            e('button', {
              onClick: () => setLang('EN'),
              'aria-label': 'Switch to English',
              'aria-pressed': lang==='EN',
              style:{ display:'flex', alignItems:'center', gap:'6px', padding:'2px 6px', background:'none', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:700, letterSpacing:'.1em', fontFamily:"'DM Sans',sans-serif", color: lang==='EN' ? 'var(--accent)' : '#B0A89E', transition:'color .2s' }
            },
              e('svg', { width:14, height:10, viewBox:'0 0 60 30', style:{ borderRadius:'1px', display:'block', flexShrink:0, boxShadow:'0 0 0 1px rgba(0,0,0,.08)' } },
                e('rect', { width:60, height:30, fill:'#012169' }),
                e('path', { d:'M0,0 L60,30 M60,0 L0,30', stroke:'#fff', strokeWidth:6 }),
                e('path', { d:'M0,0 L60,30 M60,0 L0,30', stroke:'#C8102E', strokeWidth:2 }),
                e('path', { d:'M30,0 v30 M0,15 h60', stroke:'#fff', strokeWidth:10 }),
                e('path', { d:'M30,0 v30 M0,15 h60', stroke:'#C8102E', strokeWidth:6 })
              ),
              'EN'
            )
          ),
          e('button', {
            className:'hidden lg:inline-flex',
            style:{ alignItems:'center', gap:'6px', padding:'10px 20px', borderRadius:'999px', background:'#4A7C59', color:'#fff', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:500, fontFamily:"'DM Sans',sans-serif" },
            onClick: () => go('kontakt'),
          }, e('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'},e('path',{d:'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z'})), t.navBook),
          // Hamburger – only on mobile
          e('button', {
            className:'lg:hidden',
            onClick: () => setMobileOpen(true),
            style:{ padding:'8px', borderRadius:'8px', background:'none', border:'none', cursor:'pointer', color:'#524C44', display:'flex', alignItems:'center', justifyContent:'center' },
            'aria-label':'Menü öffnen',
          },
            e('svg',{width:24,height:24,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'},
              e('line',{x1:3,y1:6,x2:21,y2:6}),
              e('line',{x1:3,y1:12,x2:21,y2:12}),
              e('line',{x1:3,y1:18,x2:21,y2:18}),
            )
          ),
        ),
      ),
    ),

    // Mobile menu rendered via portal (outside header DOM)
    mobileOpen && e(MobileMenu, { nav, page, go, onClose: () => setMobileOpen(false), t, lang, setLang }),
  );
}

/* ─────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────── */
const LOGO_URI = 'assets/images/logo-footer.webp';
function Footer({ setPage, lang, t }) {
  const isDE = lang === 'DE';
  const go = k => { setPage(k); window.scrollTo(0,0); };
  const year = new Date().getFullYear();

  const lbl  = { fontSize:'12px', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,.7)', fontFamily:"'DM Sans',sans-serif", marginBottom:'8px' };
  const body = { fontSize:'14px', lineHeight:1.7, color:'rgba(255,255,255,.85)', fontFamily:"'DM Sans',sans-serif", margin:0 };
  const lnk  = { display:'block', fontSize:'14px', color:'rgba(255,255,255,.85)', fontFamily:"'DM Sans',sans-serif", textDecoration:'none' };

  return e('footer', { style:{ backgroundColor:'#1A1917', paddingTop:'36px', paddingBottom:'28px' } },
    e('div', { style:{ maxWidth:'1320px', margin:'0 auto', padding:'0 20px' } },

      // Row 1: Logo + tagline + TGS line
      e('div', { style:{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'10px', paddingBottom:'22px', borderBottom:'1px solid rgba(255,255,255,.12)' } },
        e('button', { onClick:()=>go('home'), style:{ background:'none', border:'none', cursor:'pointer', padding:0 } },
          e('img', { src:LOGO_URI, alt:'NSBB', style:{ height:'32px', width:'auto', filter:'brightness(0) invert(1)', opacity:.9 } })
        ),
        e('div', null,
          e('p', { style:{ fontSize:'14px', color:'rgba(255,255,255,.82)', fontFamily:"'DM Sans',sans-serif", margin:'0 0 5px' } },
            isDE ? 'Strategisch beraten. Digital begleitet. Persönlich verbunden.' : 'Strategically advised. Digitally accompanied. Personally connected.'
          ),
          e('p', { style:{ fontSize:'13px', color:'rgba(255,255,255,.72)', fontFamily:"'DM Sans',sans-serif", margin:'0 0 5px' } },
            isDE ? 'Persönliche Steuerberatung für Unternehmen, Privatpersonen und internationale Mandanten.' : 'Personal tax advisory for businesses, individuals and international clients.'
          ),
          e('a', { href:'https://tgs-global.com', target:'_blank', rel:'noopener noreferrer', style:{ display:'inline-flex', alignItems:'center', gap:'5px', fontSize:'13px', color:'rgba(255,255,255,.8)', fontFamily:"'DM Sans',sans-serif", textDecoration:'none', letterSpacing:'.01em', marginTop:'2px' } },
            e('svg',{width:12,height:12,viewBox:'0 0 24 24',fill:'none',stroke:'rgba(255,255,255,.8)',strokeWidth:1.8,strokeLinecap:'round'},e('circle',{cx:12,cy:12,r:10}),e('path',{d:'M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z'})),
            isDE ? 'International tätig über das TGS Global Netzwerk' : 'Active internationally via the TGS Global Network',
          ),
        ),
      ),

      // Row 2: Berlin | Köln
      e('div', { style:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', paddingTop:'22px', paddingBottom:'22px', borderBottom:'1px solid rgba(255,255,255,.12)' } },
        e('div', null,
          e('p', { style:lbl }, 'Berlin'),
          e('a', { href:'https://www.google.com/maps/place/NSBB+Steuerberatungsgesellschaft+mbH/@52.4293359,13.2562634,19z/data=!4m15!1m8!3m7!1s0x47a85bcd32214c33:0xc49996f097d43f61!2sBerlepschstra%C3%9Fe+1,+14165+Berlin!3b1!8m2!3d52.429461!4d13.2565531!16s%2Fg%2F11b8v5lfv2!3m5!1s0x47a85bee320dfedf:0xd5c5592d1cbe082d!8m2!3d52.4294067!4d13.2565013!16s%2Fg%2F11qpl7gh9y', target:'_blank', rel:'noopener noreferrer', style:{ ...body, textDecoration:'none' } }, 'Berlepschstr. 1, 14165 Berlin'),
          e('a', { href:'tel:+493081580930', style:{ ...lnk, marginTop:'5px' } }, '+49 30 815 80 93'),
        ),
        e('div', null,
          e('p', { style:lbl }, 'Köln'),
          e('a', { href:'https://www.google.com/maps/place/NSBB+Steuerberatungsgesellschaft+mbH/@50.9286295,6.9619573,18z/data=!3m1!4b1!4m6!3m5!1s0x47bf251aeb6f96e7:0xe6cbbac13cb5a3c8!8m2!3d50.9286278!4d6.9632448!16s%2Fg%2F11lkz0nrsq', target:'_blank', rel:'noopener noreferrer', style:{ ...body, textDecoration:'none' } }, 'Holzmarkt 2/2A, 50676 Köln'),
          e('a', { href:'tel:+492219730640', style:{ ...lnk, marginTop:'5px' } }, '+49 221 973 064 0'),
        ),
      ),

      // Row 3: Kontakt + CTA (grid matches Row 2 so button sits under Köln)
      e('div', { style:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', paddingTop:'18px', paddingBottom:'20px', borderBottom:'1px solid rgba(255,255,255,.12)' } },
        e('div', { style:{ display:'flex', flexDirection:'column', gap:'6px' } },
          e('a', { href:'mailto:info@nsbb.de', style:{ ...lnk, fontSize:'14px', display:'flex', alignItems:'center', gap:'6px' } },
            e('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:'rgba(255,255,255,.8)',strokeWidth:1.8,strokeLinecap:'round'},e('rect',{x:2,y:4,width:20,height:16,rx:2}),e('path',{d:'M22 7l-10 7L2 7'})),
            'info@nsbb.de'
          ),
        ),
        e('button', { onClick:()=>go('kontakt'), style:{ fontSize:'13px', fontWeight:600, color:'var(--accent-light)', fontFamily:"'DM Sans',sans-serif", background:'none', border:'1px solid rgba(94,148,112,.7)', borderRadius:'999px', padding:'8px 18px', cursor:'pointer', whiteSpace:'nowrap', alignSelf:'start', justifySelf:'start' } },
          isDE ? 'Kontakt aufnehmen' : 'Get in touch'
        ),
      ),

      // FAQ link
      e('div', { style:{ paddingTop:'18px', paddingBottom:'18px', borderBottom:'1px solid rgba(255,255,255,.12)' } },
        e('button', { onClick:()=>go('faq'), style:{ fontSize:'14px', fontWeight:500, color:'rgba(255,255,255,.8)', fontFamily:"'DM Sans',sans-serif", background:'none', border:'none', cursor:'pointer', padding:0 } },
          isDE ? 'Häufige Fragen zur Zusammenarbeit →' : 'Frequently asked questions about working with us →'
        ),
      ),

      // Bottom bar
      e('div', { style:{ paddingTop:'16px', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'8px' } },
        e('p', { style:{ fontSize:'13px', color:'rgba(255,255,255,.65)', fontFamily:"'DM Sans',sans-serif", margin:0 } }, `© ${year} NSBB Steuerberatungsgesellschaft mbH`),
        e('div', { style:{ display:'flex', gap:'16px' } },
          [['impressum', isDE?'Impressum':'Legal'], ['datenschutz', isDE?'Datenschutz':'Privacy']].map(([k,l]) =>
            e('button', { key:k, onClick:()=>go(k), style:{ fontSize:'13px', color:'rgba(255,255,255,.75)', fontFamily:"'DM Sans',sans-serif", background:'none', border:'none', cursor:'pointer', padding:0 } }, l)
          ),
        ),
      ),
    ),
  );
}



function ContactCTA({ setPage, t, bg, tabPreset, stagePreset, setKontaktPreset }) {
  const handleCTA = () => {
    if (tabPreset && setKontaktPreset) setKontaktPreset({ tab: tabPreset, stage: stagePreset || 'form' });
    setPage('kontakt'); window.scrollTo(0,0);
  };
  return e('section', { className: 'py-20 md:py-28', style:{ backgroundColor: bg || 'var(--offwhite)' } },
    e('div', { className: 'max-w-site mx-auto px-5 md:px-8' },
      e('div', { className: 'rounded-3xl p-10 md:p-16 lg:p-20 text-center fade-up', style: { backgroundColor: 'var(--accent-subtle)' } },
        e('p', { className: 'label mb-5' }, t.ctaLabel),
        e('h2', { className: 'text-3xl md:text-4xl lg:text-5xl font-display mb-6 max-w-2xl mx-auto', style: { color: '#1A1917', fontFamily: "'Cormorant Garamond',serif" } }, t.ctaH2),
        e('p', { className: 'text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed' }, t.ctaSub),
        e('div', { className: 'flex justify-center' },
          e('button', { className: 'btn-p py-4 px-10 text-base', onClick: handleCTA }, e(Ico, { name: 'mail', size: 17 }), t.ctaBtn1),
        ),
      ),
    ),
  );
}

/* ─────────────────────────────────────────────────────────
   PAGE HERO (reusable)
───────────────────────────────────────────────────────── */
function PageHero({ label, title, accent, subtitle, back, backFn, fit }) {
  // Back-link is absolutely positioned near the very top of the hero so it never
  // pushes the title down. This guarantees that the label/title/subtitle block
  // sits at an identical vertical position on EVERY page – with or without a
  // back-link – so all hero sections have the same size and alignment.
  //
  // fit=true  → MAIN CHAPTERS: title+accent are each forced onto a single line
  //             (nowrap, auto-scaling) so the heading is ALWAYS exactly two lines
  //             and every main-chapter hero is identical in size. Subtitle may be
  //             passed as [line1, line2] to force exactly two lines too.
  // fit=false → SUB-PAGES with long headings: natural wrapping (no cut-off).
  var titleNode = fit
    ? [ e('span', { key:'t', className:'block', style:{ whiteSpace:'nowrap', fontSize:'clamp(1.1rem,6vw,4rem)' } }, title),
        accent && e('span', { key:'a', className:'block', style:{ whiteSpace:'nowrap', fontSize:'clamp(1.1rem,6vw,4rem)', color:'var(--accent)' } }, accent) ]
    : [ e('span', { key:'t' }, title),
        accent && e('em', { key:'a', className:'not-italic block', style:{ color:'var(--accent)' } }, accent) ];
  var subNode = !subtitle ? null
    : (fit && Array.isArray(subtitle))
      ? e('p', { className:'leading-relaxed', style:{ color:'var(--muted)' } },
          e('span', { className:'block', style:{ whiteSpace:'nowrap', fontSize:'clamp(0.6rem,2.9vw,1.05rem)' } }, subtitle[0]),
          e('span', { className:'block', style:{ whiteSpace:'nowrap', fontSize:'clamp(0.6rem,2.9vw,1.05rem)' } }, subtitle[1]))
      : e('p', { className:'text-base md:text-lg leading-relaxed', style:{ color:'var(--muted)' } }, Array.isArray(subtitle)?subtitle.join(' '):subtitle);
  return e('section', { className: 'relative pt-32 pb-20 md:pt-36 md:pb-24', style: { backgroundColor: 'var(--offwhite)' } },
    back && e('div', { className: 'absolute left-0 right-0', style: { top: '5.5rem' } },
      e('div', { className: 'max-w-site mx-auto px-5 md:px-8' },
        e('button', { className: 'inline-flex items-center gap-2 text-sm hover:opacity-70 transition-opacity', style: { color: 'var(--muted)', fontFamily: "'DM Sans',sans-serif" }, onClick: backFn },
          e(Ico, { name: 'arrowLeft', size: 14 }), back
        ),
      ),
    ),
    e('div', { className: 'max-w-site mx-auto px-5 md:px-8' },
      e('div', { className: 'max-w-2xl fade-up' },
        label && e('p', { className: 'label mb-4' }, label),
        e('h1', { className: 'font-display mb-6', style: { fontSize: fit ? undefined : 'clamp(2.5rem,5vw,4rem)', lineHeight: 1.12, letterSpacing: '-.025em', color: '#1A1917', fontFamily: "'Cormorant Garamond',serif" } }, titleNode),
        subNode,
      ),
    ),
  );
}

/* ─────────────────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────────────────── */
function HomePage({ setPage, lang, t }) {
  useScrollAnim();
  const isDE = lang === 'DE';

  const stats = [{ val:'2', lbl:t.heroStat1 }, { val:'4', lbl:t.heroStat2 }, { val:'20+', lbl:t.heroStat3 }, { val:'TGS', lbl:t.heroStat4 }];
  const tools = [{ name:'MyDATEV', sub:'Mandantenportal' }, { name:'DATEV online', sub:'Unternehmen online' }, { name:'DATEV Personal', sub:'Lohn & Gehalt' }, { name:'FP Sign', sub:'Digitale Signaturen' }, ];
  const serviceIcons = ['building','globe','user'];
   const services = t.servicesData.map((s,i) => ({ ...s, icon: serviceIcons[i] }));
  const whys = t.whyData;
  const insights = t.insightsPosts.map(p => ({...p, key:'insights'}));

  const go = (k) => { setPage(k); window.scrollTo(0,0); };

  return e('div', { className: 'page-enter' },
    /* ── HERO ── */
    e('section', { className: 'hero-bg hero-min relative flex items-center overflow-hidden', style:{ minHeight:'auto', paddingTop:'80px' } },
      e('div', { className: 'absolute inset-0 pointer-events-none', style: { background: 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(74,124,89,.06) 0%, transparent 60%)' } }),
      e('div', { className: 'max-w-site mx-auto px-5 md:px-8 w-full py-8' },
        e('div', { className: 'grid grid-cols-1 xl:grid-cols-2 gap-16 xl:gap-24 items-center' },
          e('div', null,
            e('div', { className: 'inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 text-xs font-medium', style: { backgroundColor: 'var(--accent-subtle)', color: 'var(--accent-dark)', fontFamily: "'DM Sans',sans-serif" } }, e(Ico, { name: 'mapPin', size: 12 }), t.heroBadge),
            e('h1', { className: 'font-display mb-6', style: { fontSize:'clamp(2.05rem,7vw,4.5rem)', lineHeight:1.08, letterSpacing:'-.025em', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } },
              t.heroH1a,
              e('em', { className:'not-italic block', style:{color:'var(--accent)'} }, t.heroH1b),
              e('span', { style:{whiteSpace:'nowrap'} }, t.heroH1c)
            ),
            e('p', { className: 'text-lg md:text-xl leading-relaxed max-w-lg mb-10' }, t.heroSub),

            e('div', { className: 'flex flex-col sm:flex-row gap-3 mb-14' },
              e('button', { className: 'btn-p py-4 px-8 text-base', onClick: () => go('kontakt') }, e(Ico, { name: 'calendar', size: 17 }), t.heroCta1),
              e('button', { className: 'btn-s py-4 px-8 text-base', onClick: () => { const el = document.getElementById('unsere-leistungen'); if (el) el.scrollIntoView({ behavior: 'smooth' }); } }, t.heroCta2, e(Ico, { name: 'arrowRight', size: 16 })),
            ),
            e('div', { className: 'flex flex-wrap gap-6 pt-6 border-t', style: { borderColor: 'var(--border)' } },
              stats.map(s => e('div', { key: s.lbl },
                e('div', { style:{ height:'36px', display:'flex', alignItems:'center', justifyContent:'flex-start' } },
                  e('span', { style:{ fontFamily:"'DM Sans',sans-serif", fontSize:'1.6rem', fontWeight:400, color:'var(--accent)', lineHeight:1, letterSpacing:'-.02em', display:'block' } }, s.val),
                ),
                e('p', { className: 'text-xs mt-0.5 font-medium', style: { color: 'var(--muted)', fontFamily: "'DM Sans',sans-serif" } }, s.lbl),
              ))
            ),
          ),
          // Visual card stack
          e('div', { className: 'hidden xl:block relative' },
            e('div', { className: 'relative w-full aspect-[4/5] rounded-3xl overflow-hidden', style: { backgroundColor: 'var(--cream)' } },
              e('div', { className: 'absolute inset-0 flex flex-col items-center justify-center gap-3' },
                e('div', { className: 'w-16 h-16 rounded-2xl flex items-center justify-center', style: { backgroundColor: 'var(--accent-subtle)' } }, e(Ico, { name: 'building', size: 28, cls: 'text-accent-DEFAULT' })),
                e('p', { className: 'text-sm font-medium', style: { color: 'var(--muted)' } }, isDE?'Kanzleifoto':'Firm photo'),
              ),
              // Floating cards
              e('div', { className: 'absolute -left-8 bottom-16 bg-white rounded-2xl p-5 max-w-[200px]', style: { boxShadow: '0 8px 32px rgba(0,0,0,.12)' } },
                e('p', { className: 'label mb-2' }, isDE?'Digitale Kanzlei':'Digital Office'),
                e('p', { className: 'text-sm', style: { color: 'var(--muted)' } }, 'DATEV · Cloud · eSign'),
              ),
              e('div', { className: 'absolute -right-6 top-12 bg-white rounded-2xl p-5 max-w-[180px]', style: { boxShadow: '0 8px 32px rgba(0,0,0,.12)' } },
                e('p', { className: 'text-xs font-medium mb-1', style: { color: 'var(--muted)', fontFamily: "'DM Sans',sans-serif" } }, isDE?'Netzwerk':'Network'),
                e('p', { className: 'font-display text-base', style: { color: '#1A1917', fontFamily: "'Cormorant Garamond',serif" } }, 'TGS International'),
                e('p', { className: 'text-xs mt-1', style: { color: 'var(--subtle)' } }, isDE?'Weltweit vernetzt':'Globally connected'),
              ),
            ),
          ),
        ),
      ),
    ),

    /* ── POSITIONIERUNG ── */
    e('section', { style:{ backgroundColor:'white', paddingTop:'48px', paddingBottom:'48px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { style:{ display:'grid', gridTemplateColumns:'repeat(1,1fr)', gap:'1px', backgroundColor:'#C8C4BC', borderRadius:'16px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,.08)' }, className:'grid grid-cols-1 md:grid-cols-3' },
          [
            { icon:'target', h:isDE?'Unser Anspruch':'Our commitment', d:isDE?'Wir denken steuerliche Entscheidungen immer im Zusammenhang mit den langfristigen Zielen unserer Mandanten. Unser Anspruch ist es, Vermögen zu schützen, Chancen zu erkennen und nachhaltige Lösungen zu entwickeln.':'We always consider tax decisions in the context of our clients\' long-term goals. Our aim is to protect assets, identify opportunities and develop sustainable solutions.' },
            { icon:'zap', h:isDE?'So arbeiten wir':'How we work', d:isDE?'Digitale Prozesse, feste Ansprechpartner und klare Abläufe sorgen für eine Zusammenarbeit, die effizient, transparent und persönlich bleibt. Wir verbinden moderne Technologien mit individueller Beratung auf Augenhöhe.':'Digital processes, dedicated advisors and clear workflows ensure a collaboration that stays efficient, transparent and personal. We combine modern technology with individual advice at eye level.' },
            { icon:'users', h:isDE?'Für wen wir tätig sind':'Who we work with', d:isDE?'Zu unseren Mandanten zählen Unternehmer, Unternehmen, Unternehmensgruppen und Privatpersonen mit anspruchsvollen steuerlichen Fragestellungen – national wie international.':'We advise entrepreneurs, GmbHs, corporate groups, holding structures and international clients on tax and strategic matters.' },
          ].map((item,i) => e('div', { key:i, style:{ backgroundColor:'white', padding:'28px 26px 32px', display:'flex', flexDirection:'column' } },
            e('div', { style:{ width:'38px', height:'38px', borderRadius:'10px', backgroundColor:'#D8EAE0', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px', flexShrink:0 } }, e(Ico,{name:item.icon,size:16})),
            e('h3', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.35rem', fontWeight:500, color:'#1A1917', marginBottom:'14px', lineHeight:1.2 } }, item.h),
            e('p', { style:{ fontSize:'14px', lineHeight:1.85, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", margin:0 } }, item.d),
          ))
        ),
      ),
    ),

    /* ── DIGITAL TEASER ── */
    e('section', { style: { backgroundColor: 'var(--offwhite)', paddingTop:'80px', paddingBottom:'34px' } },
      e('div', { className: 'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className: 'max-w-2xl' },
          e('div', { className: 'fade-up' },
            e('p', { className: 'label mb-4' }, t.digitalLabel),
            e('h2', { className: 'font-display mb-6', style: { fontSize:'clamp(2rem,4vw,3.25rem)', lineHeight:1.1, letterSpacing:'-.02em', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, e(React.Fragment, null, e('span',{style:{whiteSpace:'nowrap'}}, isDE?'Moderne Zusammenarbeit,':'Modern collaboration'), e('br'), e('span',{style:{whiteSpace:'nowrap'}}, isDE?'die wirklich funktioniert.':'that truly works.'))),
            e('p', { className: 'text-base md:text-lg leading-relaxed mb-8' }, t.digitalSub),
            e('ul', { className: 'space-y-3 mb-10' },
              t.digitalBenefits.map(b =>
                e('li', { key: b, className: 'flex items-center gap-3 text-sm', style: { color: 'var(--muted)', fontFamily: "'DM Sans',sans-serif" } },
                  e(Ico, { name: 'checkCircle', size: 16, cls: 'flex-shrink-0' }), b,
                )
              )
            ),
            e('button', { className: 'btn-g text-base', onClick: () => go('digital') }, t.digitalCta, e(Ico, { name: 'arrowRight', size: 17 })),
          ),

        ),
      ),
    ),

    /* ── SERVICES ── */
    e('section', { id:'unsere-leistungen', className: 'bg-white', style:{ scrollMarginTop:'90px', paddingTop:'80px', paddingBottom:'48px' } },
      e('div', { className: 'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className: 'max-w-2xl mb-8 fade-up' },
          e('p', { className: 'label mb-4' }, t.servicesLabel),
          e('h2', { className: 'font-display mb-5', style: { fontSize:'clamp(2rem,4vw,3.25rem)', lineHeight:1.1, letterSpacing:'-.02em', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, t.servicesH2),
          e('p', { className: 'text-base md:text-lg leading-relaxed' }, t.servicesSub),
        ),
        e('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
          services.map((s, i) => e('div', { key: s.key, className: 'bg-white rounded-2xl p-8 flex flex-col card-hover cursor-pointer fade-up border', style: { transitionDelay: `${i*100}ms`, borderColor: 'var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,.05)' }, onClick: () => go(s.key) },
            e('div', { className: 'w-12 h-12 rounded-2xl flex items-center justify-center mb-6', style: { backgroundColor: 'var(--accent-subtle)' } }, e(Ico, { name: s.icon, size: 20, cls: '' })),
            e('p', { className: 'label mb-3' }, s.label),
            e('h3', { className: 'font-display mb-4', style: { fontSize:'1.4rem', lineHeight:1.25, color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, s.title),
            e('p', { className: 'text-sm leading-relaxed mb-6 flex-1' }, s.desc),
            e('ul', { className: 'space-y-2 mb-8' },
              s.items.map(item => e('li', { key: item, className: 'flex items-center gap-2.5 text-sm', style: { color: 'var(--muted)', fontFamily: "'DM Sans',sans-serif" } },
                e('span', { className: 'w-1 h-1 rounded-full flex-shrink-0', style: { backgroundColor: 'var(--accent)' } }), item
              ))
            ),
            e('div', { className: 'flex items-center gap-2 text-sm font-medium', style: { color: 'var(--accent)', fontFamily: "'DM Sans',sans-serif" } }, 'Mehr erfahren', e(Ico, { name: 'arrowRight', size: 15 })),
          ))
        ),
      ),
    ),

    /* ── WHY ── */
    e('section', { style: { backgroundColor: 'var(--offwhite)', paddingTop:'80px', paddingBottom:'48px' } },
      e('div', { className: 'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className: 'grid grid-cols-1 gap-4 mb-8' },
          e('div', { className: 'fade-up' }, e('p', { className: 'label mb-4' }, t.whyLabel), e('h2', { className: 'font-display', style: { fontSize:'clamp(2rem,4vw,3.25rem)', lineHeight:1.1, letterSpacing:'-.02em', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, t.whyH2)),
          e('div', { className: 'fade-up max-w-2xl' }, e('p', { className: 'text-base md:text-lg leading-relaxed' }, t.whySub)),
        ),
        e('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' },
          ...whys.map((r, i) => e('div', { key: r.title, className: 'bg-white rounded-2xl p-8 fade-up', style: { transitionDelay:`${i*80}ms`, boxShadow:'0 1px 3px rgba(0,0,0,.04)' } },
            e('div', { className: 'w-10 h-10 rounded-xl flex items-center justify-center mb-5', style: { backgroundColor: 'var(--accent-subtle)' } }, e(Ico, { name: r.icon, size: 18 })),
            e('h3', { className: 'text-base font-medium mb-2', style: { color: '#1A1917', fontFamily: "'DM Sans',sans-serif" } }, r.title),
            e('p', { className: 'text-sm leading-relaxed' }, r.desc),
          ))),
      ),
    ),

    /* ── TGS TEASER ── */
    e('section', { className: 'bg-white', style:{ paddingTop:'80px', paddingBottom:'32px' } },
      e('div', { className: 'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className: 'rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2', style: { backgroundColor: '#1A1917' } },
          e('div', { className: 'p-10 md:p-14 lg:p-16 flex flex-col justify-center fade-up' },
            e('p', { className: 'text-xs uppercase tracking-widest font-medium mb-5', style: { color:'var(--accent-light)', fontFamily:"'DM Sans',sans-serif" } }, t.tgsTeaserLabel),
            e('h2', { className: 'font-display text-white mb-6', style: { fontSize:'clamp(1.8rem,3.5vw,2.8rem)', lineHeight:1.15, fontFamily:"'Cormorant Garamond',serif" } }, t.tgsTeaserH2a + ' ' + t.tgsTeaserH2b),
            e('p', { className: 'text-base leading-relaxed mb-10 max-w-md', style: { color:'rgba(255,255,255,.55)' } }, isDE ? 'Internationale Sachverhalte begleiten wir eigenständig und bei Bedarf gemeinsam mit unserem weltweiten TGS-Netzwerk. So erhalten unsere Mandanten auch bei komplexen grenzüberschreitenden Fragestellungen eine koordinierte Beratung aus einer Hand.' : 'We handle international matters independently and, where needed, together with our worldwide TGS network. This ensures our clients receive coordinated advice from a single source – even for complex cross-border situations.'),
            e('button', { className: 'inline-flex items-center gap-2 text-sm font-medium transition-all', style: { color:'var(--accent-light)', fontFamily:"'DM Sans',sans-serif" }, onClick: () => go('tgs') }, t.tgsTeaserCta, e(Ico, { name:'arrowRight', size:16 })),
          ),
        ),
      ),
    ),

    e(ContactCTA, { setPage, t, bg:'white' }),
  );
}

/* ─────────────────────────────────────────────────────────
   LEISTUNGEN OVERVIEW
───────────────────────────────────────────────────────── */
function LeistungenUnternehmenPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = (k) => { setPage(k); window.scrollTo(0,0); };
  const tiles = [
    {
      key: 'leistungen-unternehmen-leistungen',
      icon: 'shield',
      title: isDE ? 'Steuerberatung für Unternehmen' : 'Tax advisory for businesses',
      desc: isDE
        ? 'Laufende Steuerberatung, Gestaltungsberatung und betriebswirtschaftliche Begleitung – strukturiert, digital und persönlich.'
        : 'Ongoing tax advisory, structuring advice and business management support – structured, digital and personal.',
      items: isDE
        ? ['Laufende Steuerberatung', 'Gestaltungsberatung', 'Betriebswirtschaftliche Beratung']
        : ['Ongoing tax advisory', 'Structuring advisory', 'Business management advisory'],
    },
    {
      key: 'leistungen-unternehmen-branchen',
      icon: 'layout',
      title: isDE ? 'Branchenlösungen' : 'Industry solutions',
      desc: isDE
        ? 'Spezialisierte Steuerberatung für Ihre Branche – mit tiefem Verständnis für branchenspezifische Anforderungen, Strukturen und Gestaltungsmöglichkeiten.'
        : 'Specialised tax advice for your industry – with deep understanding of sector-specific requirements, structures and planning opportunities.',
      items: isDE
        ? ['E-Commerce & Onlinehandel', 'Bauunternehmen', 'Immobilienunternehmen', 'Internationale Unternehmen', 'Start-ups & Wachstum']
        : ['E-Commerce & online retail', 'Construction companies', 'Real estate companies', 'International businesses', 'Start-ups & growth'],
    },
  ];
  return e('div', { className:'page-enter' },
    e(PageHero, { label:isDE?'Leistungen für Unternehmen':'Services for Businesses',
  fit:true,
  title:isDE?'Steuerberatung':'Tax advisory',
  accent:isDE?'für Unternehmen.':'for businesses.',
  subtitle:isDE?['Wir begleiten GmbHs, wachstumsorientierte Unternehmen','und internationale Mandanten – digital und strukturiert.']:['We support GmbHs, growth companies and','international clients – digital and structured.']
}),

    // ── Premium positioning section ──
    e('section', { className:'py-20', style:{ backgroundColor:'#1A1917' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { style:{ maxWidth:'720px', margin:'0 auto', textAlign:'center' } },
          e('p', { className:'label mb-6', style:{ color:'var(--accent-light)' } }, isDE?'Für die richtigen Mandanten':'For the right clients'),
          e('h2', { className:'font-display mb-8 text-white', style:{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', fontFamily:"'Cormorant Garamond',serif", lineHeight:1.1 } },
            isDE?'Für Unternehmen, die mehr als Standard-Steuerberatung erwarten.':'For businesses that expect more than standard tax advice.'
          ),
          e('p', { style:{ fontSize:'16px', lineHeight:1.8, color:'rgba(255,255,255,.6)', fontFamily:"'DM Sans',sans-serif", marginBottom:'48px', maxWidth:'580px', margin:'0 auto 48px' } },
            isDE?'Wir beraten wachstumsorientierte Unternehmen, die steuerliche Gestaltung als strategischen Erfolgsfaktor verstehen – digital aufgestellt, international vernetzt und langfristig denkend.':'We advise growth-oriented businesses that understand tax structuring as a strategic success factor – digitally positioned, internationally connected and thinking long-term.'
          ),
          e('div', { style:{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'16px', maxWidth:'520px', margin:'0 auto' } },
            [
              isDE?'GmbHs und Unternehmensgruppen':'GmbHs and corporate groups',
              isDE?'Holding- und Vermögensstrukturen':'Holding and asset structures',
              isDE?'Internationale Mandanten':'International clients',
              isDE?'Wachstumsorientierte Unternehmer':'Growth-oriented entrepreneurs',
            ].map(item => e('div', { key:item, style:{ display:'flex', alignItems:'center', gap:'12px', padding:'16px 20px', borderRadius:'12px', backgroundColor:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', textAlign:'left' } },
              e('span', { style:{ width:'20px', height:'20px', borderRadius:'50%', backgroundColor:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 } },
                e('svg',{width:10,height:10,viewBox:'0 0 24 24',fill:'none',stroke:'white',strokeWidth:3},e('path',{d:'M20 6L9 17l-5-5'}))
              ),
              e('span', { style:{ fontSize:'13px', fontWeight:500, color:'rgba(255,255,255,.85)', fontFamily:"'DM Sans',sans-serif", lineHeight:1.4 } }, item),
            ))
          ),
        ),
      ),
    ),

    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6' },
        tiles.map((tile,i) => e('div', { key:tile.key, className:'rounded-3xl p-10 flex flex-col card-hover cursor-pointer fade-up border', style:{ transitionDelay:`${i*100}ms`, borderColor:'var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,.05)', backgroundColor:'white' }, onClick:()=>go(tile.key) },
          e('div', { className:'w-14 h-14 rounded-2xl flex items-center justify-center mb-7 flex-shrink-0', style:{ backgroundColor:'var(--accent-subtle)' } }, e(Ico,{name:tile.icon,size:22})),
          e('h2', { className:'font-display mb-4', style:{ fontSize:'clamp(1.4rem,2.5vw,1.9rem)', lineHeight:1.15, color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, tile.title),
          e('p', { className:'text-sm leading-relaxed mb-7 flex-1' }, tile.desc),
          e('ul', { className:'space-y-2 mb-8' },
            tile.items.map(it => e('li', { key:it, className:'flex items-center gap-2.5 text-sm', style:{ color:'var(--muted)', fontFamily:"'DM Sans',sans-serif" } },
              e('span', { style:{ width:'6px', height:'6px', borderRadius:'50%', backgroundColor:'var(--accent)', flexShrink:0, display:'inline-block' } }),
              it
            ))
          ),
          e('div', { className:'flex items-center gap-2 text-sm font-medium mt-auto', style:{ color:'var(--accent)', fontFamily:"'DM Sans',sans-serif" } },
            isDE?'Mehr erfahren':'Learn more', e(Ico,{name:'arrowRight',size:15})
          ),
        ))
      ),
    ),
    e(ContactCTA, { setPage, t, bg:'var(--offwhite)', tabPreset:'unternehmen', setKontaktPreset }),
  );
}

/* ─────────────────────────────────────────────────────────
   LEISTUNGEN UNTERNEHMEN – LEISTUNGSÜBERSICHT (3 Bereiche)
───────────────────────────────────────────────────────── */
function LeistungenUnternehmenLeistungenPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = (k) => { setPage(k); window.scrollTo(0,0); };
  const areas = [
    { key:'leistungen-unternehmen-laufend', icon:'refresh', title:isDE?'Laufende Steuerberatung':'Ongoing Tax Advisory', desc:isDE?'Zuverlässige laufende Betreuung – von der Finanzbuchführung über Lohnbuchhaltung und Jahresabschlüsse bis zur Begleitung von Betriebsprüfungen.':'Reliable ongoing support – from financial accounting and payroll to annual accounts and tax audit support.', items:isDE?['Finanzbuchführung','Lohnbuchführung','Jahresabschlüsse','Steuererklärungen','Laufende steuerliche Betreuung','Betriebsprüfungen']:['Financial accounting','Payroll accounting','Annual accounts','Tax returns','Ongoing tax support','Tax audit support'] },
    { key:'leistungen-unternehmen-gestaltung', icon:'layout', title:isDE?'Gestaltungsberatung':'Structuring Advisory', desc:isDE?'Vorausschauende steuerliche Strukturierung – von der Holdinggestaltung über Umstrukturierungen bis zur strategischen Steuerplanung.':'Forward-looking tax structuring – from holding design and restructuring to strategic tax planning.', items:isDE?['Steuerliche Gestaltungsberatung','Umstrukturierungen','Holdingstrukturen','Vorweggenommene Erbfolge','Strategische Steuerplanung']:['Tax structuring','Restructuring','Holding structures','Anticipated succession','Strategic tax planning'] },
    { key:'leistungen-unternehmen-bwl', icon:'zap', title:isDE?'Betriebswirtschaftliche Beratung':'Business Management Advisory', desc:isDE?'Mehr als Steuern – unternehmerische Begleitung bei Planung, Liquidität und strategischen Entscheidungen.':'More than tax – entrepreneurial support for planning, liquidity and strategic decisions.', items:isDE?['Betriebswirtschaftliche Auswertungen','Unternehmensplanung','Liquiditätsplanung','Unternehmenskennzahlen','Strategische Begleitung']:['Business analyses (BWA)','Corporate planning','Liquidity planning','Business KPIs','Strategic guidance'] },
  ];
  return e('div', { className:'page-enter' },
    e(PageHero, { label:isDE?'Steuerberatung für Unternehmen':'Tax advisory for businesses', title:isDE?'Drei Bereiche.':'Three areas.', accent:isDE?'Ein Ansprechpartner.':'One contact.', subtitle:isDE?'Laufende Betreuung, strategische Gestaltung und betriebswirtschaftliche Begleitung – aus einer Hand.':'Ongoing support, strategic structuring and business guidance – from a single source.', back:isDE?'Leistungen für Unternehmen':'Services for Businesses', backFn:()=>go('leistungen-unternehmen') }),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6' },
        areas.map((area,i) => e('div', { key:area.key, className:'rounded-3xl p-8 flex flex-col card-hover cursor-pointer fade-up border', style:{ transitionDelay:`${i*90}ms`, borderColor:'var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,.05)', backgroundColor:'white' }, onClick:()=>go(area.key) },
          e('div', { className:'w-12 h-12 rounded-2xl flex items-center justify-center mb-6 flex-shrink-0', style:{ backgroundColor:'var(--accent-subtle)' } }, e(Ico,{name:area.icon,size:20})),
          e('h2', { className:'font-display mb-4', style:{ fontSize:'1.45rem', lineHeight:1.2, color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, area.title),
          e('p', { className:'text-sm leading-relaxed mb-6 flex-1' }, area.desc),
          e('ul', { className:'space-y-2 mb-7' },
            area.items.slice(0,4).map(it => e('li', { key:it, className:'flex items-center gap-2.5 text-sm', style:{ color:'var(--muted)', fontFamily:"'DM Sans',sans-serif" } },
              e('span', { style:{ width:'6px', height:'6px', borderRadius:'50%', backgroundColor:'var(--accent)', flexShrink:0, display:'inline-block' } }), it
            )),
            area.items.length > 4 && e('li', { className:'text-sm', style:{ color:'var(--subtle)', fontFamily:"'DM Sans',sans-serif" } }, isDE?`+ ${area.items.length-4} weitere`:`+ ${area.items.length-4} more`)
          ),
          e('div', { className:'flex items-center gap-2 text-sm font-medium mt-auto', style:{ color:'var(--accent)', fontFamily:"'DM Sans',sans-serif" } }, isDE?'Mehr erfahren':'Learn more', e(Ico,{name:'arrowRight',size:15})),
        ))
      ),
    ),
    e(ContactCTA, { setPage, t, bg:'var(--offwhite)', tabPreset:'unternehmen', setKontaktPreset }),
  );
}


function LeistungenLaufendePage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const items = isDE ? [
    { title:'Finanzbuchführung', desc:'Strukturierte monatliche Buchführung mit digitaler Belegübermittlung über DATEV. Sie erhalten aktuelle betriebswirtschaftliche Auswertungen und behalten jederzeit den Überblick über Ihre Zahlen.' },
    { title:'Lohnbuchführung', desc:'Vollständige digitale Lohnbuchhaltung inkl. Gehaltsabrechnungen, Meldewesen, Sozialversicherungsbeiträge und Kommunikation mit Behörden – zuverlässig und termingerecht.' },
    { title:'Jahresabschlüsse', desc:'Präzise Erstellung von Bilanzen, Gewinn- und Verlustrechnungen sowie Anhang und Lagebericht – rechtssicher und mit dem Blick für steuerliche Optimierungspotenziale.' },
    { title:'Steuererklärungen', desc:'Alle relevanten Unternehmenssteuererklärungen (Körperschaftsteuer, Gewerbesteuer, Umsatzsteuer) – fristgerecht, vollständig und mit klarer Kommunikation zur Finanzbehörde.' },
    { title:'Laufende steuerliche Betreuung', desc:'Ihr persönlicher Ansprechpartner für steuerliche Fragestellungen im Alltag – schnell erreichbar, digital kommunizierend und immer auf dem aktuellen Stand der Gesetzgebung.' },
    { title:'Betreuung von Betriebsprüfungen', desc:'Professionelle Vorbereitung, aktive Begleitung und sorgfältige Nachbereitung von Betriebsprüfungen – mit Ruhe, Struktur und langjähriger Erfahrung im Umgang mit der Finanzbehörde.' },
  ] : [
    { title:'Financial accounting', desc:'Structured monthly bookkeeping with digital document submission via DATEV. You receive current management reports and always keep track of your figures.' },
    { title:'Payroll accounting', desc:'Full digital payroll including payslips, reporting, social security contributions and authority communication – reliable and on time.' },
    { title:'Annual accounts', desc:'Precise preparation of balance sheets, P&L statements, notes and management reports – legally compliant and with an eye for tax optimisation.' },
    { title:'Tax returns', desc:'All relevant corporate tax returns – filed on time, complete and with clear communication to the tax authorities.' },
    { title:'Ongoing tax support', desc:'Your dedicated contact for day-to-day tax questions – quickly reachable, digitally communicating and always up to date with current legislation.' },
    { title:'Tax audit support', desc:'Professional preparation, active accompaniment and careful follow-up of tax audits – calm, structured and with years of experience.' },
  ];
  return e('div', { className:'page-enter' },
    e(PageHero, { label:isDE?'Laufende Steuerberatung':'Ongoing Tax Advisory', title:isDE?'Verlässlich.':'Reliable.', accent:isDE?'Strukturiert. Digital.':'Structured. Digital.', subtitle:isDE?'Zuverlässige laufende Betreuung – damit Sie sich auf Ihr Unternehmen konzentrieren können.':'Reliable ongoing support – so you can focus on your business.', back:isDE?'Leistungen für Unternehmen':'Services for Businesses', backFn:()=>{ setPage('leistungen-unternehmen'); window.scrollTo(0,0); } }),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6' },
        items.map((s,i) => e('div', { key:s.title, className:'rounded-2xl p-8 fade-up border', style:{ transitionDelay:`${i*70}ms`, borderColor:'var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,.04)', backgroundColor:'white' } },
          e('hr', { className:'divider' }),
          e('h2', { className:'font-display mb-4', style:{ fontSize:'1.4rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, s.title),
          e('p', { className:'text-sm leading-relaxed' }, s.desc),
        ))
      ),
    ),
    e(ContactCTA, { setPage, t, bg:'var(--offwhite)', tabPreset:'unternehmen', setKontaktPreset }),
  );
}

/* ─────────────────────────────────────────────────────────
   LEISTUNGEN UNTERNEHMEN – GESTALTUNGSBERATUNG
───────────────────────────────────────────────────────── */
function LeistungenGestaltungPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const items = isDE ? [
    { title:'Steuerliche Gestaltungsberatung', desc:'Individuelle, vorausschauende Beratung zur steuerlichen Optimierung – von der Wahl der Rechtsform über die Gewinnverwendung bis zur langfristigen steuerlichen Strukturierung.' },
    { title:'Umstrukturierungen', desc:'Steuerlich optimierte Planung und Begleitung von Umstrukturierungen – Verschmelzungen, Spaltungen, Einbringungen und Formwechsel nach dem Umwandlungssteuergesetz.' },
    { title:'Holding- / Unternehmensstrukturen', desc:'Entwicklung und Umsetzung effizienter Holdingstrukturen und Beteiligungsmodelle – für steuerliche Optimierung, Haftungsschutz und strukturierte Vermögensverwaltung.' },
    { title:'Vorweggenommene Erbfolge', desc:'Steuerlich und zivilrechtlich durchdachte Übergabe von Unternehmensanteilen zu Lebzeiten – unter Berücksichtigung von Schenkungsteuer, Nießbrauch und Versorgungsleistungen.' },
    { title:'Strategische Steuerplanung', desc:'Langfristige, strukturierte Steuerplanung als fester Bestandteil Ihrer Unternehmensstrategie – vorausschauend, individuell und immer im Dialog mit Ihnen.' },
  ] : [
    { title:'Tax structuring advice', desc:'Individual, forward-looking advice on tax optimisation – from choice of legal form and profit distribution to long-term structural planning.' },
    { title:'Restructuring', desc:'Tax-optimised planning and support for restructurings – mergers, demergers, contributions and conversions under transformation tax law.' },
    { title:'Holding / corporate structures', desc:'Development and implementation of efficient holding structures – for tax optimisation, liability protection and structured asset management.' },
    { title:'Anticipated succession', desc:'Tax and civil-law transfer of business shares during your lifetime – taking into account gift tax, usufruct and maintenance payments.' },
    { title:'Strategic tax planning', desc:'Long-term, structured tax planning as an integral part of your corporate strategy – forward-looking, individual and always in dialogue with you.' },
  ];
  return e('div', { className:'page-enter' },
    e(PageHero, { label:isDE?'Gestaltungsberatung':'Structuring Advisory', title:isDE?'Vorausschauend.':'Forward-looking.', accent:isDE?'Strukturiert. Individuell.':'Structured. Individual.', subtitle:isDE?'Steuerliche Strukturierung, die langfristig wirkt – für Ihr Unternehmen und Ihre Vermögensnachfolge.':'Tax structuring with lasting effect – for your business and your succession.', back:isDE?'Leistungen für Unternehmen':'Services for Businesses', backFn:()=>{ setPage('leistungen-unternehmen'); window.scrollTo(0,0); } }),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6' },
        items.map((s,i) => e('div', { key:s.title, className:'rounded-2xl p-8 fade-up border', style:{ transitionDelay:`${i*70}ms`, borderColor:'var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,.04)', backgroundColor:'white' } },
          e('hr', { className:'divider' }),
          e('h2', { className:'font-display mb-4', style:{ fontSize:'1.4rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, s.title),
          e('p', { className:'text-sm leading-relaxed' }, s.desc),
        ))
      ),
    ),
    e(ContactCTA, { setPage, t, bg:'var(--offwhite)', tabPreset:'unternehmen', setKontaktPreset }),
  );
}

/* ─────────────────────────────────────────────────────────
   LEISTUNGEN UNTERNEHMEN – BETRIEBSWIRTSCHAFTLICHE BERATUNG
───────────────────────────────────────────────────────── */
function LeistungenBWLPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const items = isDE ? [
    { title:'Betriebswirtschaftliche Auswertungen', desc:'Aussagekräftige monatliche Auswertungen Ihrer Unternehmenszahlen (BWA) – verständlich aufbereitet, kommentiert und als Grundlage für unternehmerische Entscheidungen.' },
    { title:'Unternehmensplanung', desc:'Strukturierte Planung von Umsatz, Kosten und Ergebnis – als Businessplan für Investoren oder als internes Steuerungsinstrument für Ihre Unternehmensführung.' },
    { title:'Liquiditätsplanung', desc:'Vorausschauende Steuerung Ihrer Liquidität – damit Sie immer wissen, was Sie planen können, und keine Engpässe überraschend auftreten.' },
    { title:'Unternehmenskennzahlen', desc:'Aufbau und Analyse relevanter Unternehmenskennzahlen (KPIs) – für eine klare, datenbasierte Steuerung Ihres Unternehmens.' },
    { title:'Strategische Unternehmensbegleitung', desc:'Wir denken unternehmerisch mit – bei Wachstumsentscheidungen, Finanzierungsfragen, Investitionsplanung und strategischen Weichenstellungen stehen wir als Gesprächspartner zur Seite.' },
  ] : [
    { title:'Business analyses (BWA)', desc:'Meaningful monthly analyses of your business figures – clearly prepared, commented and as a basis for entrepreneurial decisions.' },
    { title:'Corporate planning', desc:'Structured planning of revenue, costs and results – as a business plan for investors or as an internal management tool.' },
    { title:'Liquidity planning', desc:'Forward-looking management of your liquidity – so you always know what you can plan for and no bottlenecks arise unexpectedly.' },
    { title:'Business KPIs', desc:'Development and analysis of relevant key performance indicators – for clear, data-driven management of your business.' },
    { title:'Strategic business guidance', desc:'We think entrepreneurially alongside you – on growth decisions, financing questions, investment planning and strategic choices, we are your sparring partner.' },
  ];
  return e('div', { className:'page-enter' },
    e(PageHero, { label:isDE?'Betriebswirtschaftliche Beratung':'Business Management Advisory', title:isDE?'Unternehmerisch.':'Entrepreneurial.', accent:isDE?'Mehr als Steuern.':'More than tax.', subtitle:isDE?'Wir begleiten Ihr Unternehmen weit über die Steuererklärung hinaus – als strategischer Sparringspartner auf Augenhöhe.':'We support your business well beyond the tax return – as a strategic sparring partner at eye level.', back:isDE?'Leistungen für Unternehmen':'Services for Businesses', backFn:()=>{ setPage('leistungen-unternehmen'); window.scrollTo(0,0); } }),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6' },
        items.map((s,i) => e('div', { key:s.title, className:'rounded-2xl p-8 fade-up border', style:{ transitionDelay:`${i*70}ms`, borderColor:'var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,.04)', backgroundColor:'white' } },
          e('hr', { className:'divider' }),
          e('h2', { className:'font-display mb-4', style:{ fontSize:'1.4rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, s.title),
          e('p', { className:'text-sm leading-relaxed' }, s.desc),
        ))
      ),
    ),
    e(ContactCTA, { setPage, t, bg:'var(--offwhite)', tabPreset:'unternehmen', setKontaktPreset }),
  );
}

/* ─────────────────────────────────────────────────────────
   LEISTUNGEN INTERNATIONAL
───────────────────────────────────────────────────────── */
function LeistungenInternationalPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = k => { setPage(k); window.scrollTo(0,0); };

  const topics = [
    {
      cat: isDE?'Unternehmen':'Businesses',
      items: [
        { key:'intl-holding',    title: isDE?'Internationale Holding- und Beteiligungsstrukturen':'International Holding & Participation Structures', desc: isDE?'Planung, Strukturierung und laufende steuerliche Betreuung internationaler Holding- und Beteiligungsmodelle.':'Planning, structuring and ongoing tax support for international holding and participation models.', page:'leistungen-international' },
        { key:'intl-gruppen',    title: isDE?'Internationale Unternehmensgruppen':'International Corporate Groups', desc: isDE?'Steuerliche Beratung international tätiger Unternehmensgruppen und Konzernstrukturen.':'Tax advisory for internationally active corporate groups and group structures.', page:'leistungen-international' },
        { key:'intl-inbound',    title: isDE?'Ausländische Unternehmen in Deutschland':'Foreign Companies in Germany', desc: isDE?'Begleitung ausländischer Unternehmen bei Investitionen und Geschäftstätigkeiten in Deutschland.':'Supporting foreign companies with investments and business activities in Germany.', page:'leistungen-international' },
        { key:'intl-outbound',   title: isDE?'Deutsche Unternehmen im Ausland':'German Companies Abroad', desc: isDE?'Steuerliche Unterstützung deutscher Unternehmen bei internationalen Aktivitäten und Expansionen.':'Tax support for German companies in international activities and expansions.', page:'leistungen-international' },
        { key:'intl-betrst',     title: isDE?'Internationale Betriebsstätten':'International Permanent Establishments', desc: isDE?'Beratung zu steuerlichen Fragestellungen rund um Betriebsstätten im In- und Ausland.':'Advisory on tax issues surrounding permanent establishments in Germany and abroad.', page:'leistungen-international' },
      ]
    },
    {
      cat: isDE?'Privatpersonen & Vermögen':'Individuals & Wealth',
      items: [
        { key:'intl-wegzug',     title: isDE?'Wegzugsbesteuerung':'Exit Taxation', desc: isDE?'Steuerliche Beratung bei Wegzug ins Ausland und grenzüberschreitenden Vermögensstrukturen.':'Tax advice on moving abroad and cross-border asset structures.', page:'intl-wegzug' },
        { key:'intl-wohnsitz',   title: isDE?'Wohnsitz im Ausland':'Foreign Tax Residence', desc: isDE?'Beratung zu Wohnsitzverlagerungen und steuerlichen Folgen internationaler Aufenthalte.':'Advice on relocations and the tax consequences of international stays.', page:'intl-wohnsitz' },
        { key:'intl-dba',        title: isDE?'Doppelbesteuerungsabkommen':'Double Taxation Treaties', desc: isDE?'Unterstützung bei der Anwendung und Auslegung von Doppelbesteuerungsabkommen.':'Support in applying and interpreting double taxation treaties.', page:'intl-dba' },
        { key:'intl-eink',       title: isDE?'Ausländische Einkünfte':'Foreign Income', desc: isDE?'Beratung zu Einkünften mit Auslandsbezug und deren steuerlicher Behandlung.':'Advice on income with a foreign connection and its tax treatment.', page:'intl-einkuenfte' },
        { key:'intl-immo',       title: isDE?'Immobilien im Ausland':'Foreign Real Estate', desc: isDE?'Steuerliche Begleitung bei Erwerb, Vermietung, Veräußerung und Vererbung von Auslandsimmobilien.':'Tax support for purchasing, renting, selling and inheriting foreign properties.', page:'intl-immobilien' },
        { key:'intl-erb',        title: isDE?'Erbschaften mit Auslandsbezug':'Cross-Border Inheritance', desc: isDE?'Steuerliche Beratung bei internationalen Erbfällen und grenzüberschreitenden Vermögensübertragungen.':'Tax advice on international inheritances and cross-border asset transfers.', page:'intl-erbschaft' },
        { key:'intl-schen',      title: isDE?'Schenkungen mit Auslandsbezug':'Cross-Border Gifts', desc: isDE?'Unterstützung bei internationalen Schenkungen und Vermögensübertragungen.':'Support for international gifts and asset transfers.', page:'intl-schenkung' },
        { key:'intl-rueck',      title: isDE?'Rückkehr nach Deutschland':'Return to Germany', desc: isDE?'Steuerliche Begleitung bei Rückkehr aus dem Ausland nach Deutschland.':'Tax support when returning to Germany from abroad.', page:'intl-rueckkehr' },
        { key:'intl-grenz',      title: isDE?'Grenzgänger':'Cross-Border Workers', desc: isDE?'Beratung für Arbeitnehmer und Unternehmer mit grenzüberschreitenden Tätigkeiten.':'Advice for employees and entrepreneurs with cross-border activities.', page:'intl-grenzgaenger' },
        { key:'intl-verm',       title: isDE?'Internationale Vermögensstrukturierung':'International Wealth Structuring', desc: isDE?'Entwicklung nachhaltiger Vermögensstrukturen mit internationalem Bezug.':'Developing sustainable wealth structures with an international dimension.', page:'intl-vermoegen' },
      ]
    },
  ];

  const faqs = isDE ? [
    { q:'Passt NSBB zu meinem internationalen Sachverhalt?', a:'NSBB berät Unternehmer, Unternehmensgruppen, Investoren und Privatpersonen bei internationalen steuerlichen Fragestellungen. Wenn Ihr Sachverhalt einen grenzüberschreitenden Bezug hat, sind Sie bei uns richtig.' },
    { q:'Betreut NSBB internationale Unternehmensgruppen?', a:'Ja. Wir begleiten international tätige Unternehmensgruppen, Holdingstrukturen und Konzerne bei laufenden steuerlichen Fragestellungen sowie bei der Strukturierung und Gestaltung.' },
    { q:'Unterstützt NSBB auch Privatpersonen?', a:'Ja. Wir beraten vermögende Privatpersonen, Unternehmer und Investoren bei Wohnsitzfragen, Wegzug, Auslandsimmobilien, Erbschaften und Schenkungen mit internationalem Bezug.' },
    { q:'Was ist die Wegzugsbesteuerung?', a:'Die Wegzugsbesteuerung erfasst stille Reserven in GmbH-Beteiligungen ab 1 % Anteilsbesitz, wenn eine in Deutschland steuerpflichtige Person ins Ausland verzieht. Sie entsteht auch ohne tatsächlichen Verkauf.' },
    { q:'Wann greifen Doppelbesteuerungsabkommen?', a:'DBA gelten zwischen zwei Staaten und regeln, welcher Staat welche Einkünfte besteuern darf. Sie verhindern, dass dieselben Einkünfte in zwei Ländern vollständig besteuert werden.' },
    { q:'Kann die Zusammenarbeit vollständig digital erfolgen?', a:'Ja. Wir arbeiten vollständig digital und betreuen Mandanten bundesweit und international über sichere digitale Prozesse.' },
  ] : [
    { q:'Is NSBB right for my international matter?', a:'NSBB advises entrepreneurs, corporate groups, investors and private individuals on international tax matters. If your situation has a cross-border dimension, we are the right partner.' },
    { q:'Does NSBB advise international corporate groups?', a:'Yes. We support internationally active corporate groups, holding structures and concerns on ongoing tax matters, structuring and tax planning.' },
    { q:'Does NSBB also support private individuals?', a:'Yes. We advise high-net-worth individuals, entrepreneurs and investors on residence questions, exit taxation, foreign real estate, inheritances and gifts with an international dimension.' },
    { q:'What is exit taxation?', a:'Exit taxation captures hidden reserves in GmbH shares held at 1% or more when a German tax resident moves abroad. The tax arises even without an actual sale.' },
    { q:'When do double taxation treaties apply?', a:'DTTs exist between two states and determine which state may tax which income. They prevent the same income from being fully taxed in two countries.' },
    { q:'Can collaboration be fully digital?', a:'Yes. We work fully digitally and advise clients across Germany and internationally via secure digital processes.' },
  ];

  const [faqOpen, setFaqOpen] = React.useState(null);

  return e('div', { className:'page-enter' },

    // ── Hero ─────────────────────────────────────────────
    e(PageHero, { label:isDE?'Internationales Steuerrecht':'International Tax',
  fit:true,
  title:isDE?'Internationales':'International',
  accent:isDE?'Steuerrecht.':'Tax Law.',
  subtitle:isDE?['Steuerberatung für grenzüberschreitende Sachverhalte','und Mandanten mit internationalem Bezug.']:['Tax advisory for cross-border matters and','clients with international connections.']
}),

    // ── Trust bar (weisser Hintergrund, dezente Trennung nach unten) ─
    e('section', { style:{ backgroundColor:'#ffffff', padding:'22px 0', borderBottom:'1px solid #ECEAE6' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { style:{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px 24px', maxWidth:'620px' } },
          [
            { v: isDE?'Berlin & Köln':'Berlin & Cologne',           l: isDE?'Standorte':'Offices' },
            { v: 'TGS Global',                                      l: isDE?'Netzwerk':'Network' },
            { v: isDE?'58 Länder':'58 Countries',                   l: isDE?'Internationale Mandate':'International mandates' },
            { v: isDE?'Unternehmer & Privatpersonen':'Entrepreneurs & Individuals', l: isDE?'Mandantenkreis':'Clients' },
          ].map(m => e('div', { key:m.v, style:{ display:'flex', flexDirection:'column', gap:'2px' } },
            e('span', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.05rem', fontWeight:500, color:'var(--accent-dark)', lineHeight:1.2 } }, m.v),
            e('span', { style:{ fontSize:'12px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif" } }, m.l),
          ))
        )
      ),
    ),

    // ── Intro ─────────────────────────────────────────────
    e('section', { style:{ backgroundColor:'white', paddingTop:'72px', paddingBottom:'56px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.9rem,3.5vw,2.8rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'20px', maxWidth:'620px' } },
          isDE ? 'Internationale Sachverhalte verlangen klare Strukturen.' : 'International matters require clear structures.'
        ),
        e('p', { className:'fade-up', style:{ fontSize:'15px', lineHeight:1.85, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", maxWidth:'660px', marginBottom:'48px' } },
          isDE ? 'Internationale steuerliche Fragestellungen betreffen heute längst nicht mehr nur Großkonzerne. Unternehmer, Unternehmensgruppen, Investoren und Privatpersonen stehen zunehmend vor grenzüberschreitenden Herausforderungen. Wir unterstützen dabei, steuerliche Risiken frühzeitig zu erkennen und nachhaltige Lösungen zu entwickeln.' : 'International tax matters no longer affect only large corporations. Entrepreneurs, corporate groups, investors and private individuals increasingly face cross-border challenges. We help identify tax risks early and develop sustainable solutions.'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:'16px' } },
          [
            { icon:'building', t: isDE?'Unternehmen':'Companies', d: isDE?'Expansion, Betriebsstätten, Tochtergesellschaften und internationale Unternehmensstrukturen.':'Expansion, permanent establishments, subsidiaries and international corporate structures.' },
            { icon:'user',     t: isDE?'Unternehmer':'Entrepreneurs', d: isDE?'Holdingstrukturen, Beteiligungen, Wegzug und internationale Vermögensplanung.':'Holding structures, participations, relocation and international wealth planning.' },
            { icon:'users',    t: isDE?'Privatpersonen':'Individuals', d: isDE?'Wohnsitzwechsel, Erbschaften, Schenkungen und Vermögen mit Auslandsbezug.':'Change of residence, inheritances, gifts and assets with a foreign connection.' },
          ].map(c => e('div', { key:c.t, style:{ border:'1px solid #ECEAE6', borderRadius:'16px', padding:'24px', backgroundColor:'#FAF9F7' } },
            e('div', { style:{ width:'36px', height:'36px', borderRadius:'8px', backgroundColor:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'16px' } }, e(Ico,{name:c.icon,size:15})),
            e('h3', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.2rem', fontWeight:500, color:'#1A1917', marginBottom:'8px' } }, c.t),
            e('p', { style:{ fontSize:'13px', lineHeight:1.7, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", margin:0 } }, c.d),
          ))
        ),
      ),
    ),

    // ── Topic grid ────────────────────────────────────────
    e('section', { id:'intl-schwerpunkte', style:{ backgroundColor:'var(--offwhite)', paddingTop:'24px', paddingBottom:'24px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('p', { className:'fade-up', style:{ fontSize:'11px', fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--accent)', fontFamily:"'DM Sans',sans-serif", marginBottom:'12px' } },
          isDE ? 'Unsere Schwerpunkte' : 'Our Focus Areas'
        ),
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.8rem,3.2vw,2.6rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'48px' } },
          isDE ? 'Schwerpunkte im internationalen Steuerrecht.' : 'Focus areas in international tax.'
        ),
        topics.map(group => e('div', { key:group.cat, style:{ marginBottom:'48px' } },
          e('p', { style:{ fontSize:'10px', fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:'#B0A89E', fontFamily:"'DM Sans',sans-serif", marginBottom:'16px', paddingBottom:'8px', borderBottom:'1px solid #ECEAE6' } }, group.cat),
          e('div', { className:'fade-up grid grid-cols-1 md:grid-cols-2', style:{ gap:'12px' } },
            group.items.map(item => e('div', { key:item.key,
              style:{ backgroundColor:'white', border:'1px solid #ECEAE6', borderRadius:'14px', padding:'20px 22px', cursor: item.page !== 'leistungen-international' ? 'pointer' : 'default', transition:'box-shadow .18s, border-color .18s' },
              onClick: item.page !== 'leistungen-international' ? ()=>go(item.page) : undefined,
              onMouseEnter: item.page !== 'leistungen-international' ? ev=>{ev.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,.08)';ev.currentTarget.style.borderColor='var(--accent)';} : undefined,
              onMouseLeave: item.page !== 'leistungen-international' ? ev=>{ev.currentTarget.style.boxShadow='none';ev.currentTarget.style.borderColor='#ECEAE6';} : undefined,
            },
              e('div', { style:{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' } },
                e('h3', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.05rem', fontWeight:500, color:'#1A1917', lineHeight:1.3, margin:0, flex:1 } }, item.title),
                item.page !== 'leistungen-international' && e('svg',{width:12,height:12,viewBox:'0 0 24 24',fill:'none',stroke:'var(--accent)',strokeWidth:2,strokeLinecap:'round',style:{flexShrink:0,marginTop:'3px',marginLeft:'8px'}},e('path',{d:'M5 12h14M12 5l7 7-7 7'})),
              ),
              e('p', { style:{ fontSize:'12px', lineHeight:1.6, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", margin:0 } }, item.desc),
            ))
          ),
        )),
      ),
    ),

    // ── TGS ──────────────────────────────────────────────
    e('section', { style:{ backgroundColor:'white', paddingTop:'72px', paddingBottom:'72px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
      e('div', { style:{ maxWidth:'900px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'48px', alignItems:'center' } },
        e('div', { className:'fade-up' },
          e('p', { style:{ fontSize:'11px', fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--accent)', fontFamily:"'DM Sans',sans-serif", marginBottom:'12px' } }, 'TGS Global'),
          e('h2', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'18px' } },
            isDE ? 'Internationale Beratung mit lokalem Ansprechpartner.' : 'International advisory with a local contact.'
          ),
          e('p', { style:{ fontSize:'14px', lineHeight:1.85, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", marginBottom:'28px' } },
            isDE ? 'Über das TGS Global Netzwerk begleiten wir internationale Sachverhalte gemeinsam mit erfahrenen Partnerkanzleien weltweit. So verbinden wir persönliche Betreuung vor Ort mit internationaler Expertise.' : 'Through the TGS Global network we handle international matters together with experienced partner firms worldwide – combining local personal support with international expertise.'
          ),
          e('button', { className:'btn-g', onClick:()=>go('tgs') },
            isDE ? 'Mehr zu TGS Global' : 'Learn about TGS Global',
            e(Ico,{name:'arrowRight',size:14})
          ),
        ),
        e('div', { className:'fade-up', style:{ transitionDelay:'100ms', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' } },
          [
            { v:'66', l: isDE?'Mitgliedsfirmen':'Member firms' },
            { v:'58', l: isDE?'Länder':'Countries' },
            { v:'4.400+', l: isDE?'Fachkräfte':'Professionals' },
            { v:'#13', l: isDE?'Weltweit':'Globally' },
          ].map(m => e('div', { key:m.v, style:{ backgroundColor:'var(--accent-subtle)', borderRadius:'14px', padding:'20px', textAlign:'center' } },
            e('p', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2rem', fontWeight:300, color:'var(--accent)', lineHeight:1, marginBottom:'6px' } }, m.v),
            e('p', { style:{ fontSize:'11px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", margin:0 } }, m.l),
          ))
        ),
      ),
      ),
    ),

    // ── Process ───────────────────────────────────────────
    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'72px', paddingBottom:'72px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.8rem,3.2vw,2.6rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'48px', maxWidth:'560px' } },
          isDE ? 'So begleiten wir internationale Mandate.' : 'How we handle international mandates.'
        ),
        e('div', { style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'24px' } },
          [
            { n:'01', t: isDE?'Analyse':'Analysis', d: isDE?'Wir erfassen die steuerlichen und wirtschaftlichen Rahmenbedingungen Ihres internationalen Sachverhalts.':'We capture the tax and economic framework of your international situation.' },
            { n:'02', t: isDE?'Strukturierung':'Structuring', d: isDE?'Gemeinsam entwickeln wir rechtssichere und langfristig tragfähige Lösungen.':'Together we develop legally sound and long-term viable solutions.' },
            { n:'03', t: isDE?'Laufende Begleitung':'Ongoing Support', d: isDE?'Wir begleiten Sie dauerhaft bei internationalen steuerlichen Fragestellungen und Veränderungen.':'We accompany you permanently on international tax matters and changes.' },
          ].map((s,i) => e('div', { key:s.n, className:'fade-up', style:{ transitionDelay:`${i*80}ms` } },
            e('p', { className:'step-num', style:{ marginBottom:'16px' } }, s.n),
            e('h3', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem', fontWeight:500, color:'#1A1917', marginBottom:'10px' } }, s.t),
            e('p', { style:{ fontSize:'13px', lineHeight:1.75, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", margin:0 } }, s.d),
          ))
        ),
      ),
    ),

    // ── FAQ ───────────────────────────────────────────────
    e('section', { style:{ backgroundColor:'white', paddingTop:'72px', paddingBottom:'72px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
      e('div', { style:{ maxWidth:'680px' } },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.8rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'36px' } },
          isDE ? 'Häufige Fragen' : 'Frequently Asked Questions'
        ),
        faqs.map((faq,i) => e('div', { key:i, style:{ borderBottom:'1px solid #ECEAE6' } },
          e('button', { onClick:()=>setFaqOpen(faqOpen===i?null:i), style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 0', gap:'16px' } },
            e('span', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.1rem', color: faqOpen===i?'#1A1917':'#3A342C', fontWeight: faqOpen===i?500:400, lineHeight:1.35 } }, faq.q),
            e('span', { style:{ flexShrink:0, width:'24px', height:'24px', borderRadius:'50%', border:`1px solid ${faqOpen===i?'var(--accent)':'#D4CFC8'}`, backgroundColor: faqOpen===i?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' } },
              faqOpen===i
                ? e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'white',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M5 12h14'}))
                : e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'#6B6358',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M12 5v14M5 12h14'}))
            ),
          ),
          faqOpen===i && e('p', { style:{ fontSize:'14px', lineHeight:1.8, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", paddingBottom:'18px', margin:0 } }, faq.a),
        )),
      ),
      ),
    ),

    // ── Closing CTA ───────────────────────────────────────
    e('section', { style:{ backgroundColor:'#F4F2EE', padding:'72px 20px' } },
      e('div', { style:{ maxWidth:'680px', margin:'0 auto', textAlign:'center' } },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.8rem,3.2vw,2.6rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'18px' } },
          isDE ? 'Internationale Sachverhalte brauchen klare Antworten.' : 'International matters need clear answers.'
        ),
        e('p', { className:'fade-up', style:{ fontSize:'15px', lineHeight:1.8, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", marginBottom:'32px' } },
          isDE ? 'Ob Unternehmensstruktur, Wegzug, Auslandsimmobilie oder internationale Expansion – wir unterstützen Sie bei steuerlichen Entscheidungen mit internationalem Bezug.' : 'Whether corporate structure, relocation, foreign property or international expansion – we support you on tax decisions with an international dimension.'
        ),
        e('button', { className:'fade-up btn-g', onClick:()=>{ if(setKontaktPreset) setKontaktPreset('international'); go('kontakt'); } },
          isDE ? 'Kontakt aufnehmen' : 'Get in touch',
          e(Ico,{name:'arrowRight',size:14})
        ),
      ),
    ),
  );
}


function IntlWegzugPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = k => { setPage(k); window.scrollTo(0,0); };

  const cases    = isDE ? ['GmbH-Gesellschafter plant Wegzug in die Schweiz oder nach Dubai',
        'Unternehmer verlegt seinen Wohnsitz dauerhaft ins EU-Ausland',
        'Gesellschafter hält über 1 % an einer Kapitalgesellschaft und zieht aus Deutschland weg',
        'Wegzug innerhalb der Familie mit gleichzeitigem Generationenwechsel',
        'Kurzfristiger Wegzug geplant ohne Kenntnisse der steuerlichen Folgen',
        'Rückkehrabsicht nach einigen Jahren – Stundungsoptionen werden geprüft'] : ['GmbH shareholder plans relocation to Switzerland or Dubai',
        'Entrepreneur moves principal residence permanently abroad',
        'Shareholder holds over 1% in a corporation and leaves Germany',
        'Family relocation combined with generational succession',
        'Short-term move planned without knowledge of tax consequences',
        'Intention to return after several years – deferral options being explored'];
  const risks    = isDE ? ['Steuerbelastung entsteht ohne Liquidität: Die Steuer fällt auf stille Reserven an, die nie realisiert wurden – die Mittel für die Zahlung fehlen häufig.',
        'Fehler bei der Antragsstellung: Stundungsanträge müssen rechtzeitig und korrekt gestellt werden. Versäumnisse können nicht rückwirkend geheilt werden.',
        'Wegzug in Drittstaaten: Außerhalb der EU entfällt die Möglichkeit der zinslosen Stundung. Die Steuer wird sofort fällig.',
        'Unterschätzung der Anteilsbewertung: Der gemeine Wert der Anteile wird nach ertragswertorientierten Methoden ermittelt – oft deutlich über dem Buchwert.',
        'Doppelbesteuerungsrisiken: Nicht alle Zielstaaten erkennen die in Deutschland gezahlte Wegzugssteuer vollständig an.',
        'Spätfolgen bei Rückkehr: Wer nach dem Wegzug zurückkehrt, kann in bestimmten Konstellationen eine Rückgängigmachung beantragen – wenn die Fristen eingehalten wurden.'] : ['Tax liability without liquidity: The tax falls on hidden reserves that were never realised – funds to pay it are often lacking.',
        'Errors in applications: Deferral applications must be filed on time and correctly. Omissions cannot be remedied retrospectively.',
        'Relocation to third countries: Outside the EU, interest-free deferral is not available. The tax becomes immediately due.',
        'Underestimating share valuation: The fair market value of shares is determined using income-based methods – often significantly above book value.',
        'Double taxation risks: Not all destination countries fully recognise the German exit tax paid.',
        'Consequences on return: Those who return after exit can in certain constellations apply for reversal – provided deadlines were met.'];
  const services = isDE ? ['Analyse der Beteiligungsstruktur und Prüfung der Steuerpflicht nach § 6 AStG',
        'Bewertung der Anteile und Ermittlung der Steuerlast',
        'Beratung zu Stundungsmöglichkeiten – insbesondere bei EU-Wegzug',
        'Strukturgestaltung vor dem Wegzug zur Minimierung der Steuerbelastung',
        'Koordination mit Beratern im Zielland über das TGS Global Netzwerk',
        'Begleitung bei Rückkehrfragen und nachträglicher Stundungsaufhebung',
        'Laufende Betreuung bei internationalen Beteiligungsstrukturen'] : ['Analysis of the shareholding structure and assessment of liability under § 6 AStG',
        'Valuation of shares and calculation of tax burden',
        'Advice on deferral options – particularly for EU relocations',
        'Pre-exit structuring to minimise tax exposure',
        'Coordination with advisors in the destination country via the TGS Global network',
        'Support on return questions and retrospective reversal of deferral',
        'Ongoing advisory for international participation structures'];
  const faqs     = isDE ? [{q:'Wann entsteht die Wegzugsbesteuerung?',a:'Die Wegzugsbesteuerung entsteht, wenn eine natürliche Person, die in den letzten zwölf Jahren mindestens sieben Jahre in Deutschland unbeschränkt steuerpflichtig war, Anteile an Kapitalgesellschaften von mindestens 1 % hält und ihren Wohnsitz oder gewöhnlichen Aufenthalt ins Ausland verlegt.'},
        {q:'Gilt sie auch für Minderheitsgesellschafter?',a:'Ja. Die 1-%-Schwelle ist vergleichsweise niedrig. Wer also nur eine geringe Beteiligung hält, kann dennoch vollständig von der Wegzugsbesteuerung erfasst werden. Auch mittelbare Beteiligungen werden einbezogen.'},
        {q:'Was passiert bei Rückkehr nach Deutschland?',a:'Bei Rückkehr innerhalb von sieben Jahren nach dem Wegzug kann eine Rückgängigmachung der festgesetzten Steuer beantragt werden, wenn die Anteile noch vorhanden sind. Ab 2022 gelten verschärfte Regeln für die Rückkehrregelung.'},
        {q:'Kann die Steuer gestundet werden?',a:'Bei Wegzug in EU- oder EWR-Staaten ist eine zinslose Stundung der Wegzugssteuer möglich. Bei Wegzug in Drittstaaten wie der Schweiz oder Dubai ist eine Stundung grundsätzlich nur gegen Sicherheitsleistung und mit Zinsen möglich.'},
        {q:'Welche Gestaltungsmöglichkeiten bestehen vor dem Wegzug?',a:'Verschiedene Umstrukturierungen können die Steuerlast deutlich reduzieren oder verschieben. Dies muss jedoch frühzeitig und unter sorgfältiger Berücksichtigung der Fristen erfolgen. Kurzfristige Gestaltungen kurz vor dem Wegzug werden kritisch geprüft.'}] : [{q:'When does exit taxation arise?',a:'Exit taxation arises when an individual who was subject to unlimited tax liability in Germany for at least seven of the last twelve years holds shares of at least 1% in a corporation and relocates their domicile or habitual residence abroad.'},
        {q:'Does it apply to minority shareholders?',a:'Yes. The 1% threshold is comparatively low. Even a small shareholding can therefore be fully subject to exit taxation. Indirect participations are also included.'},
        {q:'What happens on return to Germany?',a:'If returning within seven years of exit, it is possible to apply for reversal of the assessed tax, provided the shares still exist. Since 2022, stricter rules apply to the return provision.'},
        {q:'Can the tax be deferred?',a:'For relocation to EU or EEA states, interest-free deferral of exit tax is possible. For moves to third countries like Switzerland or Dubai, deferral is generally only available against security and with interest.'},
        {q:'What structuring options exist before relocation?',a:'Various restructuring measures can significantly reduce or defer the tax burden. However, this must be done early and with careful attention to deadlines. Short-term arrangements just before departure are scrutinised critically.'}];
  const [open, setOpen] = React.useState(null);

  return e('div', { className:'page-enter' },

    e(PageHero, {
      label: isDE?'Internationales Steuerrecht':'International Tax',
      fit: true,
      title: isDE?'Wegzugsbesteuerung:':'Exit Taxation:',
      accent: isDE?'Das müssen Sie wissen.':'What You Need to Know.',
      subtitle: isDE?['Wer Deutschland verlässt und GmbH-Anteile hält,','kann mit erheblichen Steuerfolgen konfrontiert werden.']:['Anyone leaving Germany while holding GmbH shares','can face significant tax consequences.'],
      back: isDE?'Internationales Steuerrecht':'International Tax',
      backFn: function(){ setPage('leistungen-international'); window.scrollTo(0,0); },
    }),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'12px' } },
          isDE ? 'Wann ist das Thema relevant?' : 'When does this matter?'
        ),
        e('p', { className:'fade-up', style:{ fontSize:'12px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", marginBottom:'20px' } },
          isDE ? 'Typische Praxisfälle' : 'Typical scenarios'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'10px' } },
          cases.map((c,i) => e('div', { key:i, style:{ backgroundColor:'var(--accent-subtle)', borderRadius:'12px', padding:'14px 16px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'5px', height:'5px', borderRadius:'50%', backgroundColor:'var(--accent)', flexShrink:0, marginTop:'8px' } }),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, c),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Risiken und Herausforderungen' : 'Risks and challenges'
        ),
        e('div', { className:'fade-up', style:{ display:'flex', flexDirection:'column', gap:'10px' } },
          risks.map((r,i) => e('div', { key:i, style:{ backgroundColor:'white', border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'12px', alignItems:'flex-start' } },
            e('div', { style:{ width:'24px', height:'24px', borderRadius:'6px', backgroundColor:'#FEF3F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:11,height:11,viewBox:'0 0 24 24',fill:'none',stroke:'#C33',strokeWidth:2.5,strokeLinecap:'round'},e('path',{d:'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.7, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, r),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Wie NSBB unterstützt' : 'How NSBB supports you'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'12px' } },
          services.map((s,i) => e('div', { key:i, style:{ border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'22px', height:'22px', borderRadius:'5px', backgroundColor:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:9,height:9,viewBox:'0 0 24 24',fill:'none',stroke:'var(--accent)',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M20 6L9 17l-5-5'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, s),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'28px' } },
          isDE ? 'Typische Fragen' : 'Frequently asked questions'
        ),
        faqs.map((faq,i) => e('div', { key:i, style:{ borderBottom:'1px solid #ECEAE6' } },
          e('button', { onClick:()=>setOpen(open===i?null:i), style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
            e('span', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.05rem', color: open===i?'#1A1917':'#3A342C', fontWeight: open===i?500:400, lineHeight:1.35 } }, faq.q),
            e('span', { style:{ flexShrink:0, width:'22px', height:'22px', borderRadius:'50%', border:`1px solid ${open===i?'var(--accent)':'#D4CFC8'}`, backgroundColor: open===i?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' } },
              open===i
                ? e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'white',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M5 12h14'}))
                : e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'#6B6358',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M12 5v14M5 12h14'}))
            ),
          ),
          open===i && e('p', { style:{ fontSize:'13px', lineHeight:1.8, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", paddingBottom:'16px', margin:0 } }, faq.a),
        )),
      ),
    ),

    e(ContactCTA, { setPage, t, tabPreset:'international', setKontaktPreset }),
  );
}


function IntlWohnsitzPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = k => { setPage(k); window.scrollTo(0,0); };

  const cases    = isDE ? ['Unternehmer verlegt Wohnsitz dauerhaft in die Schweiz, nach Dubai oder in ein EU-Land',
        'Person hat gleichzeitig Wohnsitze in Deutschland und im Ausland',
        'Arbeitnehmer arbeitet für ausländischen Arbeitgeber und lebt überwiegend im Ausland',
        'Rückkehr nach Deutschland nach jahrelangem Auslandsaufenthalt',
        'Wohnsitzfragen bei Ehepartnern mit unterschiedlichen Aufenthaltsorten',
        'Nachweisführung gegenüber deutschen Finanzbehörden bei bestrittener Steuerpflicht'] : ['Entrepreneur permanently relocates to Switzerland, Dubai or an EU country',
        'Person has simultaneous residences in Germany and abroad',
        'Employee works for foreign employer and lives predominantly abroad',
        'Return to Germany after years abroad',
        'Residence questions for spouses living in different countries',
        'Proving non-residency to German tax authorities'];
  const risks    = isDE ? ['Steuerpflicht trotz Wegzug: Wer einen Wohnsitz in Deutschland behält, bleibt unbeschränkt steuerpflichtig – auch wenn der Lebensmittelpunkt bereits im Ausland liegt.',
        'Doppelter Wohnsitz ohne Doppelbesteuerungsabkommen: Bei Aufenthalt in Staaten ohne DBA mit Deutschland kann eine vollständige Doppelbesteuerung aller Einkünfte entstehen.',
        'Fehlende oder unzureichende Nachweise: Deutsche Finanzämter fordern umfangreiche Dokumentation als Nachweis, dass der Wohnsitz tatsächlich ins Ausland verlagert wurde.',
        'Gewöhnlicher Aufenthalt als Risiko: Auch ohne gemeldeten Wohnsitz kann ein gewöhnlicher Aufenthalt in Deutschland die unbeschränkte Steuerpflicht auslösen.',
        'Risiken bei Rückkehr: Wer nach Jahren zurückkehrt, muss prüfen, ob und wie die zwischenzeitlich im Ausland akkumulierten Vermögenswerte in Deutschland steuerpflichtig werden.'] : ['Tax liability despite relocation: Retaining a domicile in Germany means remaining subject to unlimited tax liability – even if the centre of life is already abroad.',
        'Dual residence without a double taxation treaty: Residency in countries without a DTT with Germany can result in full double taxation of all income.',
        'Missing or insufficient evidence: German tax offices require extensive documentation proving that the domicile has genuinely been relocated abroad.',
        'Habitual residence as a risk: Even without a registered domicile, habitual residence in Germany can trigger unlimited tax liability.',
        'Return risks: Those returning after years abroad must assess how assets accumulated abroad during that time become taxable in Germany.'];
  const services = isDE ? ['Analyse der steuerlichen Ansässigkeit und Bestimmung der Steuerpflicht',
        'Beratung zur Aufgabe des deutschen Wohnsitzes und notwendigen Nachweisen',
        'Prüfung und Anwendung einschlägiger Doppelbesteuerungsabkommen',
        'Erstellung von Dokumentationen für den Nachweis der Verlagerung des Lebensmittelpunkts',
        'Begleitung bei steuerlichen Betriebsprüfungen zu Wohnsitzfragen',
        'Beratung bei Doppelwohnsitzen und Tie-breaker-Regelungen in DBA',
        'Koordination mit Beratern im Zielland über das TGS Global Netzwerk'] : ['Analysis of tax residency and determination of tax obligations',
        'Advice on giving up German domicile and required documentation',
        'Review and application of relevant double taxation treaties',
        'Preparation of documentation to prove relocation of centre of life',
        'Support during tax audits on residency questions',
        'Advice on dual residences and tie-breaker rules in DTTs',
        'Coordination with advisors in the destination country via the TGS Global network'];
  const faqs     = isDE ? [{q:'Wann endet die Steuerpflicht in Deutschland?',a:'Die unbeschränkte Steuerpflicht endet, wenn weder Wohnsitz noch gewöhnlicher Aufenthalt in Deutschland bestehen. Beide Anknüpfungsmerkmale müssen vollständig aufgegeben werden. Die Abmeldung beim Einwohnermeldeamt allein ist kein ausreichender Nachweis.'},
        {q:'Reicht eine Abmeldung aus?',a:'Nein. Die polizeiliche Abmeldung ist lediglich ein Indiz. Das Finanzamt prüft anhand weiterer Kriterien, ob tatsächlich kein Wohnsitz mehr in Deutschland besteht – etwa Wohnverhältnisse, Aufenthaltsdauer, familiäre und wirtschaftliche Bindungen.'},
        {q:'Was gilt bei mehreren Wohnsitzen?',a:'Bei einem Doppelwohnsitz ist Deutschland regelmäßig weiterhin steuerlich zuständig. Erst das jeweilige Doppelbesteuerungsabkommen kann bestimmen, welcher Staat das vorrangige Besteuerungsrecht hat. Dabei spielen die Tie-breaker-Regeln eine entscheidende Rolle.'},
        {q:'Welche Nachweise fordert das Finanzamt?',a:'Typischerweise werden Nachweise über Wohnort, Aufenthaltsdauer, soziale Bindungen, wirtschaftliche Interessen im Ausland sowie entsprechende Behördenunterlagen gefordert. Je nach Einzelfall können weitere Dokumente erforderlich sein.'},
        {q:'Was passiert mit deutschen Einkünften nach dem Wegzug?',a:'Nach Verlagerung des Wohnsitzes ins Ausland unterliegen deutschstämmige Einkünfte weiterhin der beschränkten Steuerpflicht in Deutschland. Dazu gehören etwa Einkünfte aus in Deutschland belegenen Immobilien oder deutschen Beteiligungen.'}] : [{q:'When does German tax liability end?',a:'Unlimited tax liability ends when neither domicile nor habitual residence exists in Germany. Both connecting factors must be fully given up. Deregistering from the resident register alone is insufficient proof.'},
        {q:'Is deregistration enough?',a:'No. The formal deregistration is merely an indication. The tax office reviews further criteria to determine whether a domicile truly no longer exists in Germany – such as living arrangements, length of stay, and personal and economic ties.'},
        {q:'What applies with multiple residences?',a:'With a dual residence, Germany is generally still entitled to tax. Only the applicable double taxation treaty can determine which state has primary taxing rights. Tie-breaker rules play a decisive role.'},
        {q:'What evidence does the tax office require?',a:'Typically evidence of place of residence, length of stay, social ties, economic interests abroad and corresponding official documents is required. Depending on the individual case, further documentation may be needed.'},
        {q:'What happens to German income after relocation?',a:'After relocating abroad, German-source income remains subject to limited tax liability in Germany. This includes income from real estate located in Germany or German shareholdings.'}];
  const [open, setOpen] = React.useState(null);

  return e('div', { className:'page-enter' },

    e(PageHero, {
      label: isDE?'Internationales Steuerrecht':'International Tax',
      fit: true,
      title: isDE?'Wohnsitz im Ausland:':'Residence Abroad:',
      accent: isDE?'Steuerpflicht richtig klären.':'Determining Tax Liability.',
      subtitle: isDE?['Ein Wegzug beendet die unbeschränkte Steuerpflicht','in Deutschland nicht automatisch.']:['Moving abroad does not automatically end unlimited','tax liability in Germany.'],
      back: isDE?'Internationales Steuerrecht':'International Tax',
      backFn: function(){ setPage('leistungen-international'); window.scrollTo(0,0); },
    }),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'12px' } },
          isDE ? 'Wann ist das Thema relevant?' : 'When does this matter?'
        ),
        e('p', { className:'fade-up', style:{ fontSize:'12px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", marginBottom:'20px' } },
          isDE ? 'Typische Praxisfälle' : 'Typical scenarios'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'10px' } },
          cases.map((c,i) => e('div', { key:i, style:{ backgroundColor:'var(--accent-subtle)', borderRadius:'12px', padding:'14px 16px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'5px', height:'5px', borderRadius:'50%', backgroundColor:'var(--accent)', flexShrink:0, marginTop:'8px' } }),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, c),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Risiken und Herausforderungen' : 'Risks and challenges'
        ),
        e('div', { className:'fade-up', style:{ display:'flex', flexDirection:'column', gap:'10px' } },
          risks.map((r,i) => e('div', { key:i, style:{ backgroundColor:'white', border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'12px', alignItems:'flex-start' } },
            e('div', { style:{ width:'24px', height:'24px', borderRadius:'6px', backgroundColor:'#FEF3F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:11,height:11,viewBox:'0 0 24 24',fill:'none',stroke:'#C33',strokeWidth:2.5,strokeLinecap:'round'},e('path',{d:'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.7, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, r),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Wie NSBB unterstützt' : 'How NSBB supports you'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'12px' } },
          services.map((s,i) => e('div', { key:i, style:{ border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'22px', height:'22px', borderRadius:'5px', backgroundColor:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:9,height:9,viewBox:'0 0 24 24',fill:'none',stroke:'var(--accent)',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M20 6L9 17l-5-5'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, s),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'28px' } },
          isDE ? 'Typische Fragen' : 'Frequently asked questions'
        ),
        faqs.map((faq,i) => e('div', { key:i, style:{ borderBottom:'1px solid #ECEAE6' } },
          e('button', { onClick:()=>setOpen(open===i?null:i), style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
            e('span', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.05rem', color: open===i?'#1A1917':'#3A342C', fontWeight: open===i?500:400, lineHeight:1.35 } }, faq.q),
            e('span', { style:{ flexShrink:0, width:'22px', height:'22px', borderRadius:'50%', border:`1px solid ${open===i?'var(--accent)':'#D4CFC8'}`, backgroundColor: open===i?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' } },
              open===i
                ? e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'white',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M5 12h14'}))
                : e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'#6B6358',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M12 5v14M5 12h14'}))
            ),
          ),
          open===i && e('p', { style:{ fontSize:'13px', lineHeight:1.8, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", paddingBottom:'16px', margin:0 } }, faq.a),
        )),
      ),
    ),

    e(ContactCTA, { setPage, t, tabPreset:'international', setKontaktPreset }),
  );
}


function IntlDBAPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = k => { setPage(k); window.scrollTo(0,0); };

  const cases    = isDE ? ['Unternehmer hat Beteiligungen in Deutschland und im Ausland',
        'Arbeitnehmer arbeitet für ausländischen Arbeitgeber teilweise aus dem Homeoffice in Deutschland',
        'Rentner mit Wohnsitz im Ausland bezieht deutsche Renten- oder Pensionseinkünfte',
        'Investor erhält Dividenden, Zinsen oder Lizenzgebühren aus dem Ausland',
        'GmbH-Gesellschafter mit Wohnsitzwechsel ins Ausland möchte Gewinnausschüttungen optimieren',
        'Erbfall mit Auslandsbezug – mehrere Staaten beanspruchen Besteuerungsrecht'] : ['Entrepreneur holds participations in Germany and abroad',
        'Employee works partly from a home office in Germany for a foreign employer',
        'Retiree with foreign residence receives German pension income',
        'Investor receives dividends, interest or royalties from abroad',
        'GmbH shareholder changing residence abroad wants to optimise profit distributions',
        'Inheritance with foreign connection – multiple states claim taxing rights'];
  const risks    = isDE ? ['Fehlende Kenntnis des anwendbaren DBA: Deutschland hat mit über 90 Staaten Abkommen abgeschlossen – deren Inhalte unterscheiden sich erheblich. Ein falsches Abkommen anzuwenden führt zu falschen Ergebnissen.',
        'Annahme ohne Prüfung: Viele Steuerpflichtige gehen davon aus, dass ein DBA die Doppelbesteuerung immer vollständig ausschließt. Das ist falsch – bestimmte Einkünfte werden dennoch in beiden Staaten besteuert, nur die Methode variiert.',
        'Quellensteuer unterschätzen: In vielen Ländern wird eine Quellensteuer auf Dividenden, Zinsen und Lizenzgebühren erhoben. Diese kann auf die deutsche Steuer angerechnet werden – aber nur unter bestimmten Voraussetzungen.',
        'Treaty Shopping: Missbrauchsvermeidungsklauseln in modernen DBA und das BEPS-Projekt der OECD schränken Gestaltungsmöglichkeiten erheblich ein.',
        'Unterschiede zwischen OECD-Musterabkommen und tatsächlichem DBA: Jedes Abkommen ist individuell verhandelt. Weichungen vom OECD-Muster können erhebliche steuerliche Konsequenzen haben.'] : ['Lack of knowledge of the applicable treaty: Germany has concluded treaties with over 90 states – their contents differ considerably. Applying the wrong treaty leads to wrong results.',
        'Assumption without review: Many taxpayers assume a DTT always fully eliminates double taxation. This is incorrect – certain income is still taxed in both states; only the method varies.',
        'Underestimating withholding tax: Many countries levy withholding tax on dividends, interest and royalties. This can be credited against German tax – but only under specific conditions.',
        'Treaty shopping: Anti-avoidance clauses in modern DTTs and the OECD BEPS project significantly restrict planning opportunities.',
        'Differences between OECD model and actual treaty: Each treaty is individually negotiated. Deviations from the OECD model can have significant tax consequences.'];
  const services = isDE ? ['Analyse des anwendbaren Doppelbesteuerungsabkommens',
        'Bestimmung der steuerlichen Ansässigkeit und Anwendung der Tie-breaker-Regeln',
        'Prüfung der Einkunftsarten und zugehörigen Besteuerungsrechte',
        'Beratung zu Quellensteuer und Anrechnungsmöglichkeiten in Deutschland',
        'Unterstützung bei der Beantragung von Quellensteuererstattungen',
        'Laufende Beratung bei internationalen Einkünften und Struktur',
        'Koordination mit Steuerbehörden und Beratern im Ausland'] : ['Analysis of the applicable double taxation treaty',
        'Determination of tax residency and application of tie-breaker rules',
        'Review of income categories and associated taxing rights',
        'Advice on withholding tax and credit options in Germany',
        'Support in applying for withholding tax refunds',
        'Ongoing advice on international income and structures',
        'Coordination with tax authorities and advisors abroad'];
  const faqs     = isDE ? [{q:'Muss ich Einkommen in zwei Ländern versteuern?',a:'Grundsätzlich kann eine Doppelbesteuerung entstehen, wenn zwei Staaten an denselben Einkünften steuerlich anknüpfen. Ein DBA verteilt die Besteuerungsrechte oder sieht Methoden vor, die Doppelbesteuerung zu beseitigen – Freistellungs- oder Anrechnungsmethode.'},
        {q:'Welches DBA gilt bei mehreren Aufenthaltsländern?',a:'Maßgeblich ist das DBA zwischen Deutschland und dem Staat, in dem der Steuerpflichtige ansässig ist. Bei mehreren möglichen Ansässigkeiten bestimmen die Tie-breaker-Regeln im DBA, welcher Staat als Ansässigkeitsstaat gilt.'},
        {q:'Wie werden ausländische Einkünfte in Deutschland behandelt?',a:'Je nach DBA und Einkunftsart werden ausländische Einkünfte in Deutschland entweder von der Steuer freigestellt (ggf. mit Progressionsvorbehalt) oder die ausländische Steuer wird auf die deutsche Steuer angerechnet.'},
        {q:'Was ist die Freistellungsmethode?',a:'Bei der Freistellungsmethode werden die ausländischen Einkünfte in Deutschland von der Besteuerung freigestellt. Sie können aber im Progressionsvorbehalt berücksichtigt werden, also den Steuersatz auf die übrigen Einkünfte erhöhen.'},
        {q:'Was ist die Anrechnungsmethode?',a:'Bei der Anrechnungsmethode werden die ausländischen Einkünfte in Deutschland besteuert; die im Ausland bezahlte Steuer wird jedoch auf die deutsche Steuerschuld angerechnet – bis zur Höhe der deutschen Steuer auf diese Einkünfte.'}] : [{q:'Do I have to pay tax on income in two countries?',a:'In principle, double taxation can arise when two states attach tax to the same income. A DTT distributes taxing rights or provides methods to eliminate double taxation – the exemption method or the credit method.'},
        {q:'Which DTT applies with multiple countries of residence?',a:'The decisive factor is the DTT between Germany and the state where the taxpayer is resident. Where multiple residencies are possible, the tie-breaker rules in the DTT determine which state is the state of residence.'},
        {q:'How is foreign income treated in Germany?',a:'Depending on the DTT and the type of income, foreign income is either exempt from tax in Germany (possibly with a progression clause) or the foreign tax is credited against German tax.'},
        {q:'What is the exemption method?',a:'Under the exemption method, foreign income is exempt from taxation in Germany. However, it may be taken into account under the progression clause, thereby increasing the rate applicable to remaining income.'},
        {q:'What is the credit method?',a:'Under the credit method, foreign income is taxed in Germany; however, the tax paid abroad is credited against the German tax liability – up to the amount of German tax on that income.'}];
  const [open, setOpen] = React.useState(null);

  return e('div', { className:'page-enter' },

    e(PageHero, {
      label: isDE?'Internationales Steuerrecht':'International Tax',
      fit: true,
      title: isDE?'Doppelbesteuerungsabkommen:':'Double Tax Treaties:',
      accent: isDE?'Wer darf besteuern?':'Who Has the Right to Tax?',
      subtitle: isDE?['Wer im Ausland Einkünfte erzielt, steht schnell vor','der Frage: Werde ich doppelt besteuert?']:['Anyone earning income abroad quickly faces the','question: will I be taxed twice?'],
      back: isDE?'Internationales Steuerrecht':'International Tax',
      backFn: function(){ setPage('leistungen-international'); window.scrollTo(0,0); },
    }),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'12px' } },
          isDE ? 'Wann ist das Thema relevant?' : 'When does this matter?'
        ),
        e('p', { className:'fade-up', style:{ fontSize:'12px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", marginBottom:'20px' } },
          isDE ? 'Typische Praxisfälle' : 'Typical scenarios'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'10px' } },
          cases.map((c,i) => e('div', { key:i, style:{ backgroundColor:'var(--accent-subtle)', borderRadius:'12px', padding:'14px 16px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'5px', height:'5px', borderRadius:'50%', backgroundColor:'var(--accent)', flexShrink:0, marginTop:'8px' } }),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, c),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Risiken und Herausforderungen' : 'Risks and challenges'
        ),
        e('div', { className:'fade-up', style:{ display:'flex', flexDirection:'column', gap:'10px' } },
          risks.map((r,i) => e('div', { key:i, style:{ backgroundColor:'white', border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'12px', alignItems:'flex-start' } },
            e('div', { style:{ width:'24px', height:'24px', borderRadius:'6px', backgroundColor:'#FEF3F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:11,height:11,viewBox:'0 0 24 24',fill:'none',stroke:'#C33',strokeWidth:2.5,strokeLinecap:'round'},e('path',{d:'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.7, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, r),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Wie NSBB unterstützt' : 'How NSBB supports you'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'12px' } },
          services.map((s,i) => e('div', { key:i, style:{ border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'22px', height:'22px', borderRadius:'5px', backgroundColor:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:9,height:9,viewBox:'0 0 24 24',fill:'none',stroke:'var(--accent)',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M20 6L9 17l-5-5'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, s),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'28px' } },
          isDE ? 'Typische Fragen' : 'Frequently asked questions'
        ),
        faqs.map((faq,i) => e('div', { key:i, style:{ borderBottom:'1px solid #ECEAE6' } },
          e('button', { onClick:()=>setOpen(open===i?null:i), style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
            e('span', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.05rem', color: open===i?'#1A1917':'#3A342C', fontWeight: open===i?500:400, lineHeight:1.35 } }, faq.q),
            e('span', { style:{ flexShrink:0, width:'22px', height:'22px', borderRadius:'50%', border:`1px solid ${open===i?'var(--accent)':'#D4CFC8'}`, backgroundColor: open===i?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' } },
              open===i
                ? e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'white',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M5 12h14'}))
                : e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'#6B6358',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M12 5v14M5 12h14'}))
            ),
          ),
          open===i && e('p', { style:{ fontSize:'13px', lineHeight:1.8, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", paddingBottom:'16px', margin:0 } }, faq.a),
        )),
      ),
    ),

    e(ContactCTA, { setPage, t, tabPreset:'international', setKontaktPreset }),
  );
}


function IntlEinkuenftePage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = k => { setPage(k); window.scrollTo(0,0); };

  const cases    = isDE ? ['Dividenden aus ausländischen Kapitalgesellschaften',
        'Zinserträge auf ausländischen Bankkonten',
        'Mieteinnahmen aus Immobilien in anderen Ländern',
        'Erträge aus ausländischen Investmentfonds',
        'Einkünfte als Geschäftsführer einer ausländischen Gesellschaft',
        'Veräußerungsgewinne aus ausländischen Beteiligungen'] : ['Dividends from foreign corporations',
        'Interest income from foreign bank accounts',
        'Rental income from properties in other countries',
        'Income from foreign investment funds',
        'Remuneration as director of a foreign company',
        'Capital gains from foreign shareholdings'];
  const risks    = isDE ? ['Vergessene Erklärungspflicht: Ausländische Konten, Depots oder Gesellschaftsanteile werden häufig nicht vollständig erklärt – mit erheblichen steuerlichen Risiken.',
        'Quellensteueranrechnung nicht optimiert: Ausländische Quellensteuern können auf die deutsche Steuer angerechnet werden – werden aber häufig nicht oder falsch geltend gemacht.',
        'Hinzurechnungsbesteuerung (§§ 7–14 AStG): Bei Beteiligungen an niedrig besteuerten ausländischen Gesellschaften kann eine Hinzurechnungsbesteuerung entstehen, die Einkünfte der Gesellschaft dem Gesellschafter zurechnet.',
        'Investmentfondsbesteuerung: Ausländische Investmentfonds unterliegen in Deutschland besonderen Besteuerungsregeln – Fehler führen zu Nachzahlungen.',
        'Spekulationsfristen und Veräußerungsgewinne: Gewinne aus dem Verkauf ausländischer Anlagen können in Deutschland steuerpflichtig sein – auch wenn das Ausland keine Steuer erhebt.'] : ['Overlooked declaration obligation: Foreign accounts, custody accounts or company shares are often not fully declared – with significant tax risks.',
        'Withholding tax credit not optimised: Foreign withholding taxes can be credited against German tax – but are often not claimed or claimed incorrectly.',
        'CFC taxation (§§ 7–14 AStG): Participations in low-taxed foreign companies can trigger controlled foreign corporation rules attributing the company income to the shareholder.',
        'Investment fund taxation: Foreign investment funds are subject to special taxation rules in Germany – errors lead to additional payments.',
        'Speculation periods and capital gains: Gains from the sale of foreign assets can be taxable in Germany – even if the foreign country imposes no tax.'];
  const services = isDE ? ['Vollständige Erfassung und Deklaration ausländischer Einkünfte',
        'Prüfung und Geltendmachung von Quellensteueranrechnungen',
        'Beratung zur Hinzurechnungsbesteuerung bei ausländischen Beteiligungen',
        'Steueroptimale Strukturierung von Kapitalanlagen mit Auslandsbezug',
        'Nacherklärungen und Begleitung bei Selbstanzeigen',
        'Beratung zu Erklärungspflichten bei ausländischen Konten und Depots',
        'Laufende Betreuung bei komplexen internationalen Einkunftsstrukturen'] : ['Complete capture and declaration of foreign income',
        'Review and assertion of withholding tax credits',
        'Advice on CFC taxation for foreign participations',
        'Tax-optimal structuring of foreign investments',
        'Amended returns and support for voluntary disclosures',
        'Advice on declaration obligations for foreign accounts and custody accounts',
        'Ongoing support for complex international income structures'];
  const faqs     = isDE ? [{q:'Muss ich ausländische Einkünfte in Deutschland angeben?',a:'Als in Deutschland unbeschränkt Steuerpflichtiger müssen Sie grundsätzlich alle weltweiten Einkünfte in Deutschland erklären – unabhängig davon, ob sie bereits im Ausland besteuert wurden. Doppelbesteuerungsabkommen können die Besteuerung einschränken oder eine Anrechnung vorsehen.'},
        {q:'Wie wird ausländische Quellensteuer berücksichtigt?',a:'Ausländische Quellensteuern können unter bestimmten Voraussetzungen auf die deutsche Einkommensteuer angerechnet werden. Voraussetzung ist unter anderem, dass die Quellensteuer der deutschen Steuer auf diese Einkünfte entspricht und dass ein entsprechendes DBA dies vorsieht.'},
        {q:'Was ist die Hinzurechnungsbesteuerung?',a:'Die Hinzurechnungsbesteuerung nach §§ 7 ff. AStG erfasst passive Einkünfte von beherrschten ausländischen Tochtergesellschaften, die niedrig besteuert sind. Diese Einkünfte werden dem deutschen Gesellschafter direkt zugerechnet und in Deutschland besteuert.'},
        {q:'Wie werden ausländische Dividenden besteuert?',a:'Ausländische Dividenden unterliegen in Deutschland der Abgeltungsteuer von 25 % zzgl. Solidaritätszuschlag. Im Betriebsvermögen gelten andere Regelungen. Gezahlte ausländische Quellensteuer kann bis zur Höhe der deutschen Steuer angerechnet werden.'},
        {q:'Muss ich ausländische Bankkonten melden?',a:'Es bestehen keine expliziten Meldepflichten für ausländische Bankkonten. Allerdings müssen die darauf erzielten Zinsen und Kapitalerträge vollständig in der deutschen Steuererklärung angegeben werden. Durch den automatischen Informationsaustausch kennen deutsche Finanzämter viele ausländische Konten bereits.'}] : [{q:'Must I declare foreign income in Germany?',a:'As a person subject to unlimited tax liability in Germany, you must generally declare all worldwide income in Germany – regardless of whether it has already been taxed abroad. Double taxation treaties may restrict taxation or provide for a credit.'},
        {q:'How is foreign withholding tax taken into account?',a:'Foreign withholding taxes can be credited against German income tax under certain conditions. Requirements include that the withholding tax corresponds to the German tax on that income and that the applicable DTT provides for this.'},
        {q:'What is CFC taxation?',a:'CFC taxation under §§ 7 et seq. AStG captures passive income of controlled foreign subsidiaries that are subject to low taxation. This income is attributed directly to the German shareholder and taxed in Germany.'},
        {q:'How are foreign dividends taxed?',a:'Foreign dividends are subject to flat-rate tax of 25% plus solidarity surcharge in Germany. Different rules apply to business assets. Foreign withholding tax paid can be credited up to the amount of German tax.'},
        {q:'Must I report foreign bank accounts?',a:'There are no explicit reporting obligations for foreign bank accounts. However, interest and capital income earned on them must be fully declared in the German tax return. Through automatic information exchange, German tax offices are already aware of many foreign accounts.'}];
  const [open, setOpen] = React.useState(null);

  return e('div', { className:'page-enter' },

    e(PageHero, {
      label: isDE?'Internationales Steuerrecht':'International Tax',
      fit: true,
      title: isDE?'Ausländische Einkünfte:':'Foreign Income:',
      accent: isDE?'Ihre Erklärungspflicht.':'Your Disclosure Duties.',
      subtitle: isDE?['Ausländische Einkünfte müssen in Deutschland erklärt','werden – auch wenn sie bereits besteuert wurden.']:['Foreign income must be declared in Germany –','even if it was already taxed abroad.'],
      back: isDE?'Internationales Steuerrecht':'International Tax',
      backFn: function(){ setPage('leistungen-international'); window.scrollTo(0,0); },
    }),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'12px' } },
          isDE ? 'Wann ist das Thema relevant?' : 'When does this matter?'
        ),
        e('p', { className:'fade-up', style:{ fontSize:'12px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", marginBottom:'20px' } },
          isDE ? 'Typische Praxisfälle' : 'Typical scenarios'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'10px' } },
          cases.map((c,i) => e('div', { key:i, style:{ backgroundColor:'var(--accent-subtle)', borderRadius:'12px', padding:'14px 16px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'5px', height:'5px', borderRadius:'50%', backgroundColor:'var(--accent)', flexShrink:0, marginTop:'8px' } }),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, c),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Risiken und Herausforderungen' : 'Risks and challenges'
        ),
        e('div', { className:'fade-up', style:{ display:'flex', flexDirection:'column', gap:'10px' } },
          risks.map((r,i) => e('div', { key:i, style:{ backgroundColor:'white', border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'12px', alignItems:'flex-start' } },
            e('div', { style:{ width:'24px', height:'24px', borderRadius:'6px', backgroundColor:'#FEF3F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:11,height:11,viewBox:'0 0 24 24',fill:'none',stroke:'#C33',strokeWidth:2.5,strokeLinecap:'round'},e('path',{d:'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.7, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, r),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Wie NSBB unterstützt' : 'How NSBB supports you'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'12px' } },
          services.map((s,i) => e('div', { key:i, style:{ border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'22px', height:'22px', borderRadius:'5px', backgroundColor:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:9,height:9,viewBox:'0 0 24 24',fill:'none',stroke:'var(--accent)',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M20 6L9 17l-5-5'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, s),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'28px' } },
          isDE ? 'Typische Fragen' : 'Frequently asked questions'
        ),
        faqs.map((faq,i) => e('div', { key:i, style:{ borderBottom:'1px solid #ECEAE6' } },
          e('button', { onClick:()=>setOpen(open===i?null:i), style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
            e('span', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.05rem', color: open===i?'#1A1917':'#3A342C', fontWeight: open===i?500:400, lineHeight:1.35 } }, faq.q),
            e('span', { style:{ flexShrink:0, width:'22px', height:'22px', borderRadius:'50%', border:`1px solid ${open===i?'var(--accent)':'#D4CFC8'}`, backgroundColor: open===i?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' } },
              open===i
                ? e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'white',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M5 12h14'}))
                : e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'#6B6358',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M12 5v14M5 12h14'}))
            ),
          ),
          open===i && e('p', { style:{ fontSize:'13px', lineHeight:1.8, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", paddingBottom:'16px', margin:0 } }, faq.a),
        )),
      ),
    ),

    e(ContactCTA, { setPage, t, tabPreset:'international', setKontaktPreset }),
  );
}


function IntlImmobilienPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = k => { setPage(k); window.scrollTo(0,0); };

  const cases    = isDE ? ['Erwerb einer Ferienimmobilie in Spanien, Portugal oder auf Mallorca',
        'Kauf einer Eigentumswohnung zur Kapitalanlage in einem EU-Staat',
        'Vermietung einer Auslandsimmobilie mit Mieteinnahmen',
        'Verkauf einer Auslandsimmobilie nach mehrjährigem Besitz',
        'Vererbung oder Schenkung einer Immobilie im Ausland',
        'Unternehmer erwirbt Betriebsimmobilie im Ausland'] : ['Purchase of a holiday property in Spain, Portugal or Mallorca',
        'Purchase of an apartment abroad as a capital investment',
        'Rental of a foreign property generating rental income',
        'Sale of a foreign property after several years of ownership',
        'Inheritance or gift of a property abroad',
        'Entrepreneur acquires commercial property abroad'];
  const risks    = isDE ? ['Mieteinnahmen nicht erklärt: Ausländische Mieteinnahmen müssen in Deutschland erklärt werden – auch wenn sie im Ausland bereits versteuert wurden.',
        'Fehlende Kenntnis der lokalen Steuerregeln: Im Kaufland können Grunderwerbsteuer, Grundsteuer, Quellensteuer auf Mieten und Veräußerungsgewinnsteuer anfallen. Diese werden häufig unterschätzt.',
        'Spekulationsfrist in Deutschland: Veräußerungsgewinne aus Auslandsimmobilien können in Deutschland steuerpflichtig sein – auch wenn das Ausland keine Steuer erhebt.',
        'Erbschaft- und Schenkungsteuer in zwei Ländern: Auslandsimmobilien können sowohl im Belegenheitsstaat als auch in Deutschland der Erbschaft- und Schenkungsteuer unterliegen.',
        'Fehlende Nutzung von DBA-Schutzmechanismen: Doppelbesteuerungsabkommen sehen für Immobilien regelmäßig das Belegenheitsprinzip vor – das Besteuerungsrecht liegt beim Belegenheitsstaat.'] : ['Rental income not declared: Foreign rental income must be declared in Germany – even if it has already been taxed abroad.',
        'Lack of knowledge of local tax rules: In the country of purchase, real estate transfer tax, property tax, withholding tax on rents and capital gains tax may apply – often underestimated.',
        'German speculation period: Capital gains from foreign properties can be taxable in Germany – even if the foreign country imposes no tax.',
        'Inheritance and gift tax in two countries: Foreign properties can be subject to inheritance and gift tax in both the country of location and Germany.',
        'Failure to use DTT protection: Double taxation treaties generally provide for the location principle for real estate – the right to tax lies with the state of location.'];
  const services = isDE ? ['Steuerliche Prüfung vor dem Erwerb einer Auslandsimmobilie',
        'Analyse der steuerlichen Behandlung von Mieteinnahmen in beiden Ländern',
        'Beratung zur steueroptimalen Strukturierung (privat oder über Gesellschaft)',
        'Erfassung und Deklaration in der deutschen Steuererklärung',
        'Begleitung beim Verkauf und Ermittlung des steuerlichen Gewinns',
        'Erbschaft- und schenkungsteuerliche Beratung bei Immobilien im Ausland',
        'Koordination mit lokalen Beratern über das TGS Global Netzwerk'] : ['Tax review prior to purchasing a foreign property',
        'Analysis of the tax treatment of rental income in both countries',
        'Advice on tax-optimal structuring (private or via a company)',
        'Capture and declaration in the German tax return',
        'Support on sale and determination of taxable gain',
        'Inheritance and gift tax advice for properties abroad',
        'Coordination with local advisors via the TGS Global network'];
  const faqs     = isDE ? [{q:'Muss ich Mieteinnahmen aus dem Ausland in Deutschland versteuern?',a:'Grundsätzlich ja. Als in Deutschland unbeschränkt Steuerpflichtiger müssen Sie Ihre weltweiten Einkünfte erklären. Im Ausland erzielte Mieteinnahmen können jedoch nach dem einschlägigen DBA in Deutschland freigestellt sein – allerdings häufig unter Progressionsvorbehalt.'},
        {q:'Wie wird ein Verkauf steuerlich behandelt?',a:'Veräußerungsgewinne aus Auslandsimmobilien sind in Deutschland steuerpflichtig, wenn die Spekulationsfrist von zehn Jahren nicht abgelaufen ist. Das DBA mit dem Belegenheitsstaat kann vorsehen, dass das Besteuerungsrecht dem anderen Staat zusteht. Die im Ausland gezahlte Steuer kann angerechnet werden.'},
        {q:'Welche Steuern fallen im Ausland an?',a:'Je nach Land fallen unterschiedliche Steuern an: Grunderwerbsteuer beim Kauf, laufende Grundsteuer, Quellensteuer auf Mieterträge und Kapitalgewinnsteuer beim Verkauf. Die genauen Regelungen hängen vom jeweiligen Land ab.'},
        {q:'Was gilt bei Vererbung einer Auslandsimmobilie?',a:'Bei Erbschaft einer Auslandsimmobilie können sowohl der Belegenheitsstaat als auch Deutschland Erbschaftsteuer erheben. DBA zur Erbschaftsteuer hat Deutschland nur mit wenigen Ländern geschlossen.'},
        {q:'Ist eine Gesellschaftsstruktur für den Kauf sinnvoll?',a:'Ob eine Investition über eine Gesellschaft (z. B. eine lokale Kapitalgesellschaft) sinnvoll ist, hängt von verschiedenen Faktoren ab: Steuerbelastung im Ausland, persönliche Steuersituation in Deutschland, geplante Haltedauer und Nutzungsart. Eine individuelle Analyse ist zwingend erforderlich.'}] : [{q:'Must I pay German tax on foreign rental income?',a:'In principle yes. As a person subject to unlimited tax liability in Germany, you must declare your worldwide income. However, rental income earned abroad may be exempt in Germany under the applicable DTT – though often subject to a progression clause.'},
        {q:'How is a sale treated for tax purposes?',a:'Capital gains from foreign properties are taxable in Germany if the ten-year speculation period has not expired. The DTT with the country of location may provide that the right to tax lies with the other state. Tax paid abroad can be credited.'},
        {q:'What taxes apply abroad?',a:'Depending on the country, different taxes may apply: real estate transfer tax on purchase, ongoing property tax, withholding tax on rental income and capital gains tax on sale. The exact rules depend on the country.'},
        {q:'What applies when inheriting a foreign property?',a:'When inheriting a foreign property, both the country of location and Germany may levy inheritance tax. Germany has only concluded DTTs on inheritance tax with a few countries.'},
        {q:'Is a company structure sensible for the purchase?',a:'Whether investing via a company (e.g. a local corporation) makes sense depends on various factors: tax burden abroad, personal tax situation in Germany, planned holding period and type of use. An individual analysis is essential.'}];
  const [open, setOpen] = React.useState(null);

  return e('div', { className:'page-enter' },

    e(PageHero, {
      label: isDE?'Internationales Steuerrecht':'International Tax',
      fit: true,
      title: isDE?'Immobilien im Ausland:':'Property Abroad:',
      accent: isDE?'Kauf, Vermietung, Verkauf.':'Purchase, Rental, Sale.',
      subtitle: isDE?['Auslandsimmobilien bieten Chancen – und bringen','steuerliche Fragen mit sich, die oft unterschätzt werden.']:['Foreign properties offer opportunities – and raise','tax questions that are often underestimated.'],
      back: isDE?'Internationales Steuerrecht':'International Tax',
      backFn: function(){ setPage('leistungen-international'); window.scrollTo(0,0); },
    }),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'12px' } },
          isDE ? 'Wann ist das Thema relevant?' : 'When does this matter?'
        ),
        e('p', { className:'fade-up', style:{ fontSize:'12px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", marginBottom:'20px' } },
          isDE ? 'Typische Praxisfälle' : 'Typical scenarios'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'10px' } },
          cases.map((c,i) => e('div', { key:i, style:{ backgroundColor:'var(--accent-subtle)', borderRadius:'12px', padding:'14px 16px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'5px', height:'5px', borderRadius:'50%', backgroundColor:'var(--accent)', flexShrink:0, marginTop:'8px' } }),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, c),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Risiken und Herausforderungen' : 'Risks and challenges'
        ),
        e('div', { className:'fade-up', style:{ display:'flex', flexDirection:'column', gap:'10px' } },
          risks.map((r,i) => e('div', { key:i, style:{ backgroundColor:'white', border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'12px', alignItems:'flex-start' } },
            e('div', { style:{ width:'24px', height:'24px', borderRadius:'6px', backgroundColor:'#FEF3F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:11,height:11,viewBox:'0 0 24 24',fill:'none',stroke:'#C33',strokeWidth:2.5,strokeLinecap:'round'},e('path',{d:'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.7, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, r),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Wie NSBB unterstützt' : 'How NSBB supports you'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'12px' } },
          services.map((s,i) => e('div', { key:i, style:{ border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'22px', height:'22px', borderRadius:'5px', backgroundColor:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:9,height:9,viewBox:'0 0 24 24',fill:'none',stroke:'var(--accent)',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M20 6L9 17l-5-5'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, s),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'28px' } },
          isDE ? 'Typische Fragen' : 'Frequently asked questions'
        ),
        faqs.map((faq,i) => e('div', { key:i, style:{ borderBottom:'1px solid #ECEAE6' } },
          e('button', { onClick:()=>setOpen(open===i?null:i), style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
            e('span', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.05rem', color: open===i?'#1A1917':'#3A342C', fontWeight: open===i?500:400, lineHeight:1.35 } }, faq.q),
            e('span', { style:{ flexShrink:0, width:'22px', height:'22px', borderRadius:'50%', border:`1px solid ${open===i?'var(--accent)':'#D4CFC8'}`, backgroundColor: open===i?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' } },
              open===i
                ? e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'white',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M5 12h14'}))
                : e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'#6B6358',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M12 5v14M5 12h14'}))
            ),
          ),
          open===i && e('p', { style:{ fontSize:'13px', lineHeight:1.8, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", paddingBottom:'16px', margin:0 } }, faq.a),
        )),
      ),
    ),

    e(ContactCTA, { setPage, t, tabPreset:'international', setKontaktPreset }),
  );
}


function IntlErbschaftPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = k => { setPage(k); window.scrollTo(0,0); };

  const cases    = isDE ? ['Erblasser hatte seinen letzten Wohnsitz im Ausland und hinterlässt Vermögen in Deutschland',
        'In Deutschland lebender Erbe erhält Erbschaft aus dem Ausland',
        'Nachlassvermögen umfasst Immobilien in mehreren Ländern',
        'Erbe und Erblasser haben unterschiedliche steuerliche Ansässigkeiten',
        'Familienunternehmen mit Beteiligungen in verschiedenen Ländern wird vererbt',
        'Ausländisches Erbrecht weicht erheblich vom deutschen Erbrecht ab'] : ['Deceased had their last domicile abroad and leaves assets in Germany',
        'Heir living in Germany receives an inheritance from abroad',
        'Estate includes real estate in several countries',
        'Heir and deceased have different tax residencies',
        'Family business with participations in several countries is inherited',
        'Foreign inheritance law differs significantly from German law'];
  const risks    = isDE ? ['Doppelte Erbschaftsteuer: Deutschland erhebt Erbschaftsteuer, wenn Erblasser oder Erbe Inländer sind oder wenn sich inländisches Vermögen im Nachlass befindet. Andere Länder haben ähnliche Regeln – eine Doppelbesteuerung ist möglich.',
        'Fehlende DBA: Deutschland hat zur Erbschaftsteuer nur wenige Doppelbesteuerungsabkommen abgeschlossen. Eine unilaterale Anrechnung ausländischer Erbschaftsteuer ist unter bestimmten Voraussetzungen möglich, aber begrenzt.',
        'Unterschiedliche Bewertungsmethoden: Verschiedene Länder bewerten Nachlassvermögen unterschiedlich. Dies kann dazu führen, dass der steuerliche Wert im In- und Ausland erheblich voneinander abweicht.',
        'Fristprobleme: Erbschaftsteuererklärungen müssen in der Regel innerhalb kurzer Fristen eingereicht werden. Bei internationalen Erbfällen ist die Informationsbeschaffung zeitaufwendiger.',
        'Unternehmensvermögen: Die Übertragung von Unternehmensanteilen im Erbfall unterliegt besonderen Regelungen – Bewertung, Verschonung und Stundungsmöglichkeiten müssen international berücksichtigt werden.'] : ['Double inheritance tax: Germany levies inheritance tax where the deceased or heir is a German resident or where domestic assets are in the estate. Other countries have similar rules – double taxation is possible.',
        'Limited DTTs: Germany has concluded only a few double taxation treaties on inheritance tax. Unilateral credit for foreign inheritance tax is possible under certain conditions but is limited.',
        'Different valuation methods: Different countries value estate assets differently. This can cause the tax value to differ significantly between countries.',
        'Deadline issues: Inheritance tax returns must generally be filed within short deadlines. In international cases, gathering information takes longer.',
        'Business assets: The transfer of business interests on death is subject to special rules – valuation, exemptions and deferral options must be considered internationally.'];
  const services = isDE ? ['Analyse der Steuerpflicht in Deutschland und ggf. weiteren Ländern',
        'Prüfung und Anwendung von DBA zur Erbschaftsteuer',
        'Bewertung des Nachlassvermögens nach deutschen und ausländischen Regeln',
        'Nutzung von Anrechnungsmöglichkeiten und Freibeträgen',
        'Beratung zur Verschonungsregelung bei Betriebsvermögen',
        'Erbschaftsteuererklärungen in Deutschland',
        'Koordination mit internationalen Erbschaftsteuerberatern'] : ['Analysis of tax liability in Germany and potentially other countries',
        'Review and application of inheritance tax DTTs',
        'Valuation of estate assets under German and foreign rules',
        'Utilisation of credit options and exemptions',
        'Advice on business asset relief provisions',
        'Inheritance tax returns in Germany',
        'Coordination with international inheritance tax advisors'];
  const faqs     = isDE ? [{q:'Welche Erbschaftsteuer gilt bei einem internationalen Erbfall?',a:'Deutschland erhebt Erbschaftsteuer, wenn der Erblasser oder der Erbe zum Zeitpunkt des Erbfalls Inländer im steuerlichen Sinne war (unbeschränkte Steuerpflicht) oder wenn sich inländisches Vermögen im Nachlass befindet (beschränkte Steuerpflicht).'},
        {q:'Können mehrere Staaten gleichzeitig Erbschaftsteuer erheben?',a:'Ja. Da Deutschland nur wenige Abkommen zur Erbschaftsteuer geschlossen hat, ist eine Doppelbesteuerung bei internationalen Erbfällen möglich. Eine unilaterale Anrechnungsmöglichkeit nach § 21 ErbStG kann die Belastung mindern.'},
        {q:'Welche Freibeträge gelten bei internationalen Erbfällen?',a:'Die deutschen Freibeträge gelten grundsätzlich auch bei internationalen Erbfällen. Bei beschränkter Erbschaftsteuerpflicht (nur ausländischer Erblasser und ausländischer Erbe mit inländischem Vermögen) gelten geringere Freibeträge.'},
        {q:'Muss ich eine Erbschaftsteuererklärung in Deutschland abgeben?',a:'Bei einer deutschen Erbschaftsteuerpflicht ist eine Steuererklärung einzureichen. Das Finanzamt kann auch zur Abgabe auffordern. Die Frist beträgt grundsätzlich drei Monate ab Kenntnis vom Erbfall.'},
        {q:'Wie wird Unternehmensvermögen bei internationalem Erbfall behandelt?',a:'Bei der Vererbung von Unternehmensvermögen können besondere Verschonungsregelungen in Anspruch genommen werden. Die Anwendbarkeit dieser Regelungen bei internationalem Unternehmensvermögen ist einzelfallabhängig und erfordert eine sorgfältige Analyse.'}] : [{q:'Which inheritance tax applies in a cross-border inheritance?',a:'Germany levies inheritance tax where the deceased or heir was a resident in the tax sense at the time of death (unlimited tax liability) or where domestic assets are included in the estate (limited tax liability).'},
        {q:'Can multiple states simultaneously levy inheritance tax?',a:'Yes. As Germany has concluded only a few inheritance tax treaties, double taxation in cross-border inheritances is possible. A unilateral credit option under § 21 ErbStG can reduce the burden.'},
        {q:'What exemptions apply in cross-border inheritances?',a:'German exemptions generally also apply in cross-border inheritances. For limited inheritance tax liability (foreign deceased and foreign heir with domestic assets), lower exemptions apply.'},
        {q:'Must I file an inheritance tax return in Germany?',a:'Where German inheritance tax liability exists, a tax return must be filed. The tax office may also request a return. The deadline is generally three months from knowledge of the death.'},
        {q:'How is business property treated in a cross-border inheritance?',a:'Special relief provisions can be claimed for inherited business assets. Whether these provisions apply to international business assets depends on the individual case and requires careful analysis.'}];
  const [open, setOpen] = React.useState(null);

  return e('div', { className:'page-enter' },

    e(PageHero, {
      label: isDE?'Internationales Steuerrecht':'International Tax',
      fit: true,
      title: isDE?'Erbschaften mit':'Cross-Border',
      accent: isDE?'Auslandsbezug.':'Inheritance.',
      subtitle: isDE?['Wohnt der Erblasser im Ausland oder liegt Vermögen','in mehreren Ländern, drohen doppelte Steuerpflichten.']:['If the deceased lived abroad or assets are spread','across countries, double tax liability can arise.'],
      back: isDE?'Internationales Steuerrecht':'International Tax',
      backFn: function(){ setPage('leistungen-international'); window.scrollTo(0,0); },
    }),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'12px' } },
          isDE ? 'Wann ist das Thema relevant?' : 'When does this matter?'
        ),
        e('p', { className:'fade-up', style:{ fontSize:'12px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", marginBottom:'20px' } },
          isDE ? 'Typische Praxisfälle' : 'Typical scenarios'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'10px' } },
          cases.map((c,i) => e('div', { key:i, style:{ backgroundColor:'var(--accent-subtle)', borderRadius:'12px', padding:'14px 16px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'5px', height:'5px', borderRadius:'50%', backgroundColor:'var(--accent)', flexShrink:0, marginTop:'8px' } }),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, c),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Risiken und Herausforderungen' : 'Risks and challenges'
        ),
        e('div', { className:'fade-up', style:{ display:'flex', flexDirection:'column', gap:'10px' } },
          risks.map((r,i) => e('div', { key:i, style:{ backgroundColor:'white', border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'12px', alignItems:'flex-start' } },
            e('div', { style:{ width:'24px', height:'24px', borderRadius:'6px', backgroundColor:'#FEF3F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:11,height:11,viewBox:'0 0 24 24',fill:'none',stroke:'#C33',strokeWidth:2.5,strokeLinecap:'round'},e('path',{d:'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.7, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, r),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Wie NSBB unterstützt' : 'How NSBB supports you'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'12px' } },
          services.map((s,i) => e('div', { key:i, style:{ border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'22px', height:'22px', borderRadius:'5px', backgroundColor:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:9,height:9,viewBox:'0 0 24 24',fill:'none',stroke:'var(--accent)',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M20 6L9 17l-5-5'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, s),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'28px' } },
          isDE ? 'Typische Fragen' : 'Frequently asked questions'
        ),
        faqs.map((faq,i) => e('div', { key:i, style:{ borderBottom:'1px solid #ECEAE6' } },
          e('button', { onClick:()=>setOpen(open===i?null:i), style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
            e('span', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.05rem', color: open===i?'#1A1917':'#3A342C', fontWeight: open===i?500:400, lineHeight:1.35 } }, faq.q),
            e('span', { style:{ flexShrink:0, width:'22px', height:'22px', borderRadius:'50%', border:`1px solid ${open===i?'var(--accent)':'#D4CFC8'}`, backgroundColor: open===i?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' } },
              open===i
                ? e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'white',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M5 12h14'}))
                : e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'#6B6358',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M12 5v14M5 12h14'}))
            ),
          ),
          open===i && e('p', { style:{ fontSize:'13px', lineHeight:1.8, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", paddingBottom:'16px', margin:0 } }, faq.a),
        )),
      ),
    ),

    e(ContactCTA, { setPage, t, tabPreset:'international', setKontaktPreset }),
  );
}


function IntlSchenkungPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = k => { setPage(k); window.scrollTo(0,0); };

  const cases    = isDE ? ['Eltern in Deutschland schenken Kind mit Wohnsitz im Ausland Vermögen',
        'Eltern im Ausland schenken Kind in Deutschland eine Immobilie oder Kapitalvermögen',
        'Übertragung von Unternehmensanteilen auf die nächste Generation mit Auslandsbezug',
        'Schenkung von Auslandsimmobilien innerhalb der Familie',
        'Schenkung von Kapitalvermögen auf ausländische Konten oder Depots',
        'Meldepflichten bei grenzüberschreitenden Schenkungen'] : ['Parents in Germany gift assets to a child resident abroad',
        'Parents abroad gift a property or financial assets to a child in Germany',
        'Transfer of company shares to the next generation with international dimension',
        'Gift of foreign real estate within the family',
        'Gift of financial assets to foreign accounts or custody accounts',
        'Reporting obligations for cross-border gifts'];
  const risks    = isDE ? ['Schenkungsteuer in zwei Ländern: Wenn Schenker oder Beschenkter in verschiedenen Ländern ansässig sind, können beide Staaten Schenkungsteuer erheben. Deutschland hat kaum Abkommen zur Schenkungsteuer.',
        'Fehlende Meldung: In Deutschland besteht eine Schenkungsmeldepflicht gegenüber dem Finanzamt. Auch Banken müssen Schenkungen ab bestimmten Schwellen melden.',
        'Unterschätzung des steuerpflichtigen Erwerbs: Der steuerliche Wert einer Schenkung kann erheblich vom vereinbarten oder empfundenen Wert abweichen – insbesondere bei Immobilien und Unternehmensbeteiligungen.',
        'Verlust von Freibeträgen durch falsche Gestaltung: Durch falsche Reihenfolge oder falsche Zeitpunkte von Schenkungen können Freibeträge verloren gehen oder nicht optimal genutzt werden.',
        'Auswirkungen auf Wegzugsbesteuerung: Schenkungen im Vorfeld eines geplanten Wegzugs werden steuerlich kritisch geprüft.'] : ['Gift tax in two countries: Where donor and recipient are resident in different countries, both states may levy gift tax. Germany has very few treaties on gift tax.',
        'Failure to notify: Germany has a gift notification obligation to the tax office. Banks must also report gifts above certain thresholds.',
        'Underestimating the taxable acquisition: The tax value of a gift can differ significantly from the agreed or perceived value – particularly for real estate and company participations.',
        'Loss of exemptions through incorrect structuring: Wrong sequencing or timing of gifts can cause exemptions to be lost or not used optimally.',
        'Impact on exit taxation: Gifts in advance of a planned relocation are critically scrutinised for tax purposes.'];
  const services = isDE ? ['Analyse der Schenkungsteuerpflicht in Deutschland und dem Ausland',
        'Bewertung des zu übertragenden Vermögens',
        'Beratung zur optimalen Nutzung von Freibeträgen',
        'Erstellung der Schenkungsteuererklärung',
        'Gestaltung von Übertragungen zur Minimierung der Schenkungsteuer',
        'Koordination mit Beratern im Ausland bei grenzüberschreitenden Schenkungen',
        'Beratung zu Meldepflichten und erforderlichen Notarverträgen'] : ['Analysis of gift tax liability in Germany and abroad',
        'Valuation of the assets to be transferred',
        'Advice on optimal use of exemptions',
        'Preparation of gift tax returns',
        'Structuring of transfers to minimise gift tax',
        'Coordination with advisors abroad for cross-border gifts',
        'Advice on reporting obligations and required notarial agreements'];
  const faqs     = isDE ? [{q:'Welche Steuer fällt bei einer Schenkung mit Auslandsbezug an?',a:'In Deutschland fällt Schenkungsteuer an, wenn Schenker oder Beschenkter Inländer im steuerlichen Sinne sind oder wenn inländisches Vermögen übertragen wird. Im Ausland können parallel eigene Schenkungsteuerregelungen greifen.'},
        {q:'Welche Freibeträge gelten bei Schenkungen?',a:'Die Freibeträge richten sich nach dem Verwandtschaftsverhältnis. Kinder erhalten pro Elternteil alle zehn Jahre einen Freibetrag von 400.000 Euro, Enkel 200.000 Euro, Ehegatten 500.000 Euro. Für beschränkt Schenkungsteuerpflichtige gelten niedrigere Beträge.'},
        {q:'Muss eine Schenkung gemeldet werden?',a:'In Deutschland besteht eine Anzeigepflicht gegenüber dem Finanzamt innerhalb von drei Monaten nach Vollzug der Schenkung. Dies gilt auch, wenn keine Schenkungsteuer anfällt. Banken müssen Schenkungen ab 20.000 Euro melden.'},
        {q:'Wie werden Unternehmensanteile bei einer Schenkung bewertet?',a:'Unternehmensanteile werden nach dem gemeinen Wert bewertet – in der Regel anhand des Ertragswertverfahrens nach dem Bewertungsgesetz. Bei Familienunternehmen können besondere Bewertungsabschläge in Betracht kommen.'},
        {q:'Kann Schenkungsteuer durch Ratenschenkungen optimiert werden?',a:'Ja. Durch zeitlich gestaffeltes Vorgehen und die Nutzung von Freibeträgen alle zehn Jahre kann die Schenkungsteuerlast erheblich reduziert werden. Eine vorausschauende Planung ist dabei entscheidend.'}] : [{q:'What tax applies to a cross-border gift?',a:'In Germany, gift tax applies where the donor or recipient is a resident in the tax sense or where domestic assets are transferred. Abroad, separate gift tax rules may apply in parallel.'},
        {q:'What exemptions apply to gifts?',a:'Exemptions depend on the family relationship. Children receive an exemption of €400,000 per parent every ten years, grandchildren €200,000, spouses €500,000. Lower amounts apply for limited gift tax liability.'},
        {q:'Must a gift be reported?',a:'In Germany there is a notification obligation to the tax office within three months of the gift being made. This applies even if no gift tax is due. Banks must report gifts of €20,000 or more.'},
        {q:'How are company shares valued for gift purposes?',a:'Company shares are valued at fair market value – generally using the income capitalisation method under the Valuation Act. For family businesses, special valuation discounts may be available.'},
        {q:'Can gift tax be optimised through staged gifts?',a:'Yes. Through a staggered approach utilising exemptions every ten years, the gift tax burden can be significantly reduced. Forward-looking planning is key.'}];
  const [open, setOpen] = React.useState(null);

  return e('div', { className:'page-enter' },

    e(PageHero, {
      label: isDE?'Internationales Steuerrecht':'International Tax',
      fit: true,
      title: isDE?'Schenkungen mit':'Cross-Border',
      accent: isDE?'Auslandsbezug.':'Gifts.',
      subtitle: isDE?['Schenkungen an Kinder oder Partner im Ausland können','erhebliche steuerliche Folgen haben.']:['Gifts to children or partners abroad can have','significant tax consequences.'],
      back: isDE?'Internationales Steuerrecht':'International Tax',
      backFn: function(){ setPage('leistungen-international'); window.scrollTo(0,0); },
    }),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'12px' } },
          isDE ? 'Wann ist das Thema relevant?' : 'When does this matter?'
        ),
        e('p', { className:'fade-up', style:{ fontSize:'12px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", marginBottom:'20px' } },
          isDE ? 'Typische Praxisfälle' : 'Typical scenarios'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'10px' } },
          cases.map((c,i) => e('div', { key:i, style:{ backgroundColor:'var(--accent-subtle)', borderRadius:'12px', padding:'14px 16px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'5px', height:'5px', borderRadius:'50%', backgroundColor:'var(--accent)', flexShrink:0, marginTop:'8px' } }),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, c),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Risiken und Herausforderungen' : 'Risks and challenges'
        ),
        e('div', { className:'fade-up', style:{ display:'flex', flexDirection:'column', gap:'10px' } },
          risks.map((r,i) => e('div', { key:i, style:{ backgroundColor:'white', border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'12px', alignItems:'flex-start' } },
            e('div', { style:{ width:'24px', height:'24px', borderRadius:'6px', backgroundColor:'#FEF3F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:11,height:11,viewBox:'0 0 24 24',fill:'none',stroke:'#C33',strokeWidth:2.5,strokeLinecap:'round'},e('path',{d:'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.7, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, r),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Wie NSBB unterstützt' : 'How NSBB supports you'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'12px' } },
          services.map((s,i) => e('div', { key:i, style:{ border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'22px', height:'22px', borderRadius:'5px', backgroundColor:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:9,height:9,viewBox:'0 0 24 24',fill:'none',stroke:'var(--accent)',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M20 6L9 17l-5-5'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, s),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'28px' } },
          isDE ? 'Typische Fragen' : 'Frequently asked questions'
        ),
        faqs.map((faq,i) => e('div', { key:i, style:{ borderBottom:'1px solid #ECEAE6' } },
          e('button', { onClick:()=>setOpen(open===i?null:i), style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
            e('span', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.05rem', color: open===i?'#1A1917':'#3A342C', fontWeight: open===i?500:400, lineHeight:1.35 } }, faq.q),
            e('span', { style:{ flexShrink:0, width:'22px', height:'22px', borderRadius:'50%', border:`1px solid ${open===i?'var(--accent)':'#D4CFC8'}`, backgroundColor: open===i?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' } },
              open===i
                ? e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'white',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M5 12h14'}))
                : e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'#6B6358',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M12 5v14M5 12h14'}))
            ),
          ),
          open===i && e('p', { style:{ fontSize:'13px', lineHeight:1.8, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", paddingBottom:'16px', margin:0 } }, faq.a),
        )),
      ),
    ),

    e(ContactCTA, { setPage, t, tabPreset:'international', setKontaktPreset }),
  );
}


function IntlRueckkehrPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = k => { setPage(k); window.scrollTo(0,0); };

  const cases    = isDE ? ['Rückkehr aus der Schweiz nach mehrjährigem Aufenthalt',
        'Rückkehr aus Dubai mit aufgebautem Vermögen im Ausland',
        'Rückkehr nach EU-Wegzug – Fragen zur Wegzugsbesteuerung',
        'Rückkehr mit ausländischen Gesellschaftsanteilen im Portfolio',
        'Rückkehr mit Immobilienvermögen im Ausland',
        'Rückkehr in die Familie mit Ehegatte noch im Ausland'] : ['Return from Switzerland after several years',
        'Return from Dubai with assets built up abroad',
        'Return after EU relocation – questions on exit taxation',
        'Return with foreign company shares in the portfolio',
        'Return with real estate assets abroad',
        'Return to Germany while spouse remains abroad'];
  const risks    = isDE ? ['Sofortige unbeschränkte Steuerpflicht: Mit der Begründung eines Wohnsitzes in Deutschland entsteht die unbeschränkte Steuerpflicht unmittelbar – auch wenn erst kurz danach Einkünfte oder Vermögenswerte anfallen.',
        'Auslandsvermögen unter steuerlicher Beobachtung: Im Ausland aufgebautes Vermögen (Konten, Beteiligungen, Immobilien) muss ab dem Zeitpunkt der Rückkehr in Deutschland erklärt und versteuert werden.',
        'Wegzugsbesteuerung bei Rückkehr innerhalb von sieben Jahren: Wenn die Wegzugssteuer beim Wegzug gestundet wurde, wird sie bei der Rückkehr grundsätzlich nicht mehr fällig – die Festsetzung wird gegenstandslos. Dies muss jedoch aktiv beantragt werden.',
        'Nachversteuerungsrisiken: Bestimmte Vermögenswerte, die im Ausland nicht oder gering besteuert wurden, können bei der Rückkehr in Deutschland einer Nachversteuerung unterliegen.',
        'Meldepflichten und Compliance: Ausländische Bankkonten, Gesellschaftsanteile und Immobilien müssen in Deutschland erklärt werden. Automatischer Informationsaustausch erfasst viele dieser Positionen.'] : ['Immediate unlimited tax liability: Establishing a domicile in Germany triggers unlimited tax liability immediately – even if income or assets only arise shortly thereafter.',
        'Foreign assets under scrutiny: Assets built up abroad (accounts, shareholdings, real estate) must be declared and taxed in Germany from the time of return.',
        'Exit tax on return within seven years: Where exit tax was deferred on departure, it generally no longer becomes due on return – the assessment lapses. However, this must be actively applied for.',
        'Back-taxation risks: Certain assets that were untaxed or lightly taxed abroad may be subject to back-taxation in Germany on return.',
        'Reporting obligations and compliance: Foreign bank accounts, company shares and real estate must be declared in Germany. Automatic information exchange captures many of these items.'];
  const services = isDE ? ['Steuerliche Bestandsaufnahme vor der Rückkehr',
        'Analyse der Auswirkungen auf Wegzugsbesteuerung und laufende Stundungen',
        'Erfassung und steuerliche Einordnung von Auslandsvermögen',
        'Beratung zur Erklärungspflicht ausländischer Konten, Depots und Gesellschaften',
        'Erstellung der deutschen Steuererklärung im Rückkehrjahr',
        'Begleitung bei steuerlichen Betriebsprüfungen im Zusammenhang mit der Rückkehr',
        'Laufende steuerliche Betreuung nach der Rückkehr'] : ['Pre-return tax stocktaking',
        'Analysis of impact on exit taxation and ongoing deferrals',
        'Capture and tax classification of foreign assets',
        'Advice on declaration obligations for foreign accounts, custody accounts and companies',
        'German tax return for the year of return',
        'Support during tax audits relating to the return',
        'Ongoing tax support after return'];
  const faqs     = isDE ? [{q:'Was muss ich bei der Rückkehr nach Deutschland beachten?',a:'Mit der Begründung eines Wohnsitzes in Deutschland beginnt die unbeschränkte Steuerpflicht. Ab diesem Zeitpunkt müssen alle weltweiten Einkünfte in Deutschland erklärt werden. Auslandsvermögen muss ebenfalls gemeldet und bewertet werden.'},
        {q:'Was passiert mit der Wegzugssteuer, wenn ich zurückkomme?',a:'Wenn die Wegzugssteuer gestundet war und die Rückkehr innerhalb von sieben Jahren (bis 2021: fünf Jahre) erfolgt, wird die Festsetzung auf Antrag gegenstandslos – die Steuer entfällt. Bei Rückkehr nach mehr als sieben Jahren bleibt die Steuer grundsätzlich bestehen.'},
        {q:'Muss ich meine ausländischen Konten und Depots melden?',a:'Eine explizite Meldepflicht für ausländische Konten besteht in Deutschland nicht. Allerdings müssen Zinsen, Dividenden und Veräußerungsgewinne vollständig erklärt werden. Über den automatischen Informationsaustausch kennen deutsche Finanzämter viele Auslandskonten bereits.'},
        {q:'Wie werden in der Schweiz oder Dubai angespartes Vermögen behandelt?',a:'Im Ausland angespartes Vermögen selbst unterliegt in Deutschland keiner Vermögensteuer. Jedoch werden Einkünfte daraus ab Rückkehr vollständig in Deutschland steuerpflichtig. Zudem kann bei bestimmten Gesellschaftsanteilen eine Besteuerung entstehen.'},
        {q:'Wie plane ich die Rückkehr steuerlich optimal?',a:'Eine frühzeitige Planung – idealerweise sechs bis zwölf Monate vor der Rückkehr – ermöglicht es, steuerliche Risiken zu erkennen und Vermögenspositionen optimal zu strukturieren. Eine Beratung im Vorfeld ist dringend empfohlen.'}] : [{q:'What do I need to consider when returning to Germany?',a:'Establishing a domicile in Germany triggers unlimited tax liability. From that point, all worldwide income must be declared in Germany. Foreign assets must also be reported and valued.'},
        {q:'What happens to exit tax if I return?',a:'Where exit tax was deferred and return occurs within seven years (until 2021: five years), the assessment lapses on application – the tax falls away. For returns after more than seven years, the tax generally remains.'},
        {q:'Must I report my foreign accounts and custody accounts?',a:'Germany has no explicit reporting obligation for foreign accounts. However, interest, dividends and capital gains must be fully declared. Through automatic information exchange, German tax offices are already aware of many foreign accounts.'},
        {q:'How is wealth saved in Switzerland or Dubai treated?',a:'Foreign assets as such are not subject to German wealth tax. However, income from them becomes fully taxable in Germany from the point of return. Additionally, certain company shareholdings can give rise to taxation.'},
        {q:'How do I plan my return from a tax perspective?',a:'Early planning – ideally six to twelve months before return – makes it possible to identify tax risks and structure asset positions optimally. Pre-return advice is strongly recommended.'}];
  const [open, setOpen] = React.useState(null);

  return e('div', { className:'page-enter' },

    e(PageHero, {
      label: isDE?'Internationales Steuerrecht':'International Tax',
      fit: true,
      title: isDE?'Rückkehr nach':'Returning to',
      accent: isDE?'Deutschland.':'Germany.',
      subtitle: isDE?['Die Rückkehr nach einem Auslandsaufenthalt klingt','einfach – ist es steuerlich aber nicht.']:['Returning after time abroad sounds simple –',"but it isn't from a tax perspective."],
      back: isDE?'Internationales Steuerrecht':'International Tax',
      backFn: function(){ setPage('leistungen-international'); window.scrollTo(0,0); },
    }),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'12px' } },
          isDE ? 'Wann ist das Thema relevant?' : 'When does this matter?'
        ),
        e('p', { className:'fade-up', style:{ fontSize:'12px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", marginBottom:'20px' } },
          isDE ? 'Typische Praxisfälle' : 'Typical scenarios'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'10px' } },
          cases.map((c,i) => e('div', { key:i, style:{ backgroundColor:'var(--accent-subtle)', borderRadius:'12px', padding:'14px 16px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'5px', height:'5px', borderRadius:'50%', backgroundColor:'var(--accent)', flexShrink:0, marginTop:'8px' } }),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, c),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Risiken und Herausforderungen' : 'Risks and challenges'
        ),
        e('div', { className:'fade-up', style:{ display:'flex', flexDirection:'column', gap:'10px' } },
          risks.map((r,i) => e('div', { key:i, style:{ backgroundColor:'white', border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'12px', alignItems:'flex-start' } },
            e('div', { style:{ width:'24px', height:'24px', borderRadius:'6px', backgroundColor:'#FEF3F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:11,height:11,viewBox:'0 0 24 24',fill:'none',stroke:'#C33',strokeWidth:2.5,strokeLinecap:'round'},e('path',{d:'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.7, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, r),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Wie NSBB unterstützt' : 'How NSBB supports you'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'12px' } },
          services.map((s,i) => e('div', { key:i, style:{ border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'22px', height:'22px', borderRadius:'5px', backgroundColor:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:9,height:9,viewBox:'0 0 24 24',fill:'none',stroke:'var(--accent)',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M20 6L9 17l-5-5'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, s),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'28px' } },
          isDE ? 'Typische Fragen' : 'Frequently asked questions'
        ),
        faqs.map((faq,i) => e('div', { key:i, style:{ borderBottom:'1px solid #ECEAE6' } },
          e('button', { onClick:()=>setOpen(open===i?null:i), style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
            e('span', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.05rem', color: open===i?'#1A1917':'#3A342C', fontWeight: open===i?500:400, lineHeight:1.35 } }, faq.q),
            e('span', { style:{ flexShrink:0, width:'22px', height:'22px', borderRadius:'50%', border:`1px solid ${open===i?'var(--accent)':'#D4CFC8'}`, backgroundColor: open===i?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' } },
              open===i
                ? e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'white',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M5 12h14'}))
                : e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'#6B6358',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M12 5v14M5 12h14'}))
            ),
          ),
          open===i && e('p', { style:{ fontSize:'13px', lineHeight:1.8, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", paddingBottom:'16px', margin:0 } }, faq.a),
        )),
      ),
    ),

    e(ContactCTA, { setPage, t, tabPreset:'international', setKontaktPreset }),
  );
}


function IntlGrenzgaengerPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = k => { setPage(k); window.scrollTo(0,0); };

  const cases    = isDE ? ['Arbeitnehmer wohnt in Deutschland und arbeitet in der Schweiz',
        'Arbeitnehmer wohnt in Luxemburg und arbeitet in Deutschland',
        'Selbstständiger mit Kunden in mehreren Ländern',
        'Unternehmer mit Wohnsitz in Deutschland und Betriebsstätte in Österreich',
        'Homeoffice-Regelungen bei internationalen Arbeitsverhältnissen',
        'Social-Media-Influencer oder digitaler Nomade mit internationalem Tätigkeitsgebiet'] : ['Employee lives in Germany and works in Switzerland',
        'Employee lives in Luxembourg and works in Germany',
        'Self-employed person with clients in several countries',
        'Entrepreneur resident in Germany with permanent establishment in Austria',
        'Home-office rules in international employment relationships',
        'Social media influencer or digital nomad with international activity'];
  const risks    = isDE ? ['Fehlende Grenzgängerregelung: Nicht alle DBA enthalten spezifische Grenzgängerregelungen. Ohne diese Sonderregelung gelten die allgemeinen Arbeitslohnbesteuerungsregeln, die zu einer anderen Verteilung der Besteuerungsrechte führen können.',
        'Homeoffice-Falle: Wer zu viele Tage pro Jahr im Homeoffice arbeitet, kann den Grenzgängerstatus verlieren oder eine Betriebsstätte im Wohnsitzstaat begründen.',
        'Sozialversicherungspflicht im falschen Staat: Die Sozialversicherungspflicht folgt nicht zwingend der Steuerpflicht. Bei Grenzgängern können komplexe Regeln der EU-Verordnung 883/2004 zur Anwendung kommen.',
        'Doppelbesteuerungsrisiken bei unklarer Tätigkeitsstätte: Wer in mehreren Ländern tätig ist, riskiert, dass mehrere Staaten Besteuerungsrechte beanspruchen.',
        'Meldepflichten und Compliance-Pflichten: In verschiedenen Ländern bestehen unterschiedliche Meldepflichten für Grenzgänger.'] : ['Missing cross-border worker rule: Not all DTTs contain specific cross-border worker provisions. Without this special rule, general employment income taxation rules apply, which can lead to a different distribution of taxing rights.',
        'Home-office trap: Working too many days per year from a home office can cause loss of cross-border worker status or create a permanent establishment in the country of residence.',
        'Social security obligation in the wrong state: Social security obligation does not necessarily follow tax liability. Complex rules under EU Regulation 883/2004 can apply to cross-border workers.',
        'Double taxation risks with unclear place of work: Those active in multiple countries risk multiple states claiming taxing rights.',
        'Reporting and compliance obligations: Different countries have different reporting obligations for cross-border workers.'];
  const services = isDE ? ['Analyse der steuerlichen Situation als Grenzgänger',
        'Anwendung der einschlägigen Grenzgängerregelungen im DBA',
        'Beratung zu Homeoffice-Tagen und deren steuerlichen Auswirkungen',
        'Prüfung der Sozialversicherungspflicht nach europäischem Recht',
        'Erstellung deutscher Steuererklärungen für Grenzgänger',
        'Beratung zur Betriebsstättenproblematik bei Selbstständigen',
        'Koordination mit Beratern im Tätigkeitsstaat'] : ['Analysis of the tax situation as a cross-border worker',
        'Application of relevant cross-border worker rules in the DTT',
        'Advice on home-office days and their tax consequences',
        'Review of social security liability under European law',
        'German tax returns for cross-border workers',
        'Advice on permanent establishment issues for self-employed persons',
        'Coordination with advisors in the country of activity'];
  const faqs     = isDE ? [{q:'Wo zahle ich als Grenzgänger Steuern?',a:'Das hängt vom DBA zwischen Deutschland und Ihrem Tätigkeitsstaat ab. Viele DBA enthalten spezifische Grenzgängerregelungen, die das Besteuerungsrecht dem Wohnsitzstaat zuweisen. Andere DBA sehen vor, dass der Tätigkeitsstaat besteuern darf.'},
        {q:'Was gilt für Homeoffice-Tage?',a:'Homeoffice-Tage gelten als im Wohnsitzstaat geleistete Arbeit. Bei klassischen Grenzgängerregelungen kann eine bestimmte Anzahl von Homeoffice-Tagen die Eigenschaft als Grenzgänger gefährden. Einzelne DBA enthalten spezifische Homeoffice-Regelungen.'},
        {q:'Wo bin ich sozialversicherungspflichtig?',a:'Für EU-Arbeitnehmer gilt grundsätzlich, dass die Sozialversicherungspflicht im Tätigkeitsstaat besteht. Wer zu einem erheblichen Teil im Wohnsitzstaat arbeitet (in der Regel über 25 %), ist dort sozialversicherungspflichtig.'},
        {q:'Was gilt für Selbstständige mit Kunden in mehreren Ländern?',a:'Selbstständige mit Tätigkeiten in mehreren Ländern riskieren, in jedem Tätigkeitsstaat eine Betriebsstätte zu begründen. Dies hätte zur Folge, dass die dort erzielten Gewinne in diesem Staat besteuert werden.'},
        {q:'Welche Besonderheiten gelten für Grenzgänger aus der Schweiz?',a:'Das DBA Deutschland-Schweiz enthält eine spezifische Grenzgängerregelung. Grenzgänger zwischen Deutschland und der Schweiz werden im Wohnsitzstaat besteuert; die Schweiz erhebt jedoch eine Quellensteuer von 4,5 %, die auf die deutsche Steuer angerechnet wird.'}] : [{q:'Where do cross-border workers pay taxes?',a:'This depends on the DTT between Germany and your country of work. Many DTTs contain specific cross-border worker rules assigning the taxing right to the country of residence. Others provide that the country of work may tax.'},
        {q:'What applies to home-office days?',a:'Home-office days count as work performed in the country of residence. Under classic cross-border worker rules, a certain number of home-office days may jeopardise cross-border worker status. Some DTTs contain specific home-office provisions.'},
        {q:'Where am I subject to social security?',a:'For EU employees, the general rule is that social security liability arises in the country of work. Those who work to a substantial extent in their country of residence (generally over 25%) are subject to social security there.'},
        {q:'What applies to self-employed persons with clients in several countries?',a:'Self-employed persons active in multiple countries risk establishing a permanent establishment in each country of activity. This would mean profits earned there are taxed in that state.'},
        {q:'What special rules apply to cross-border workers from Switzerland?',a:'The Germany-Switzerland DTT contains a specific cross-border worker rule. Cross-border workers between Germany and Switzerland are taxed in their country of residence; however, Switzerland levies withholding tax of 4.5%, which is credited against German tax.'}];
  const [open, setOpen] = React.useState(null);

  return e('div', { className:'page-enter' },

    e(PageHero, {
      label: isDE?'Internationales Steuerrecht':'International Tax',
      fit: true,
      title: isDE?'Grenzgänger:':'Cross-Border',
      accent: isDE?'Wo zahle ich Steuern?':'Commuters.',
      subtitle: isDE?['Wer regelmäßig die Grenze überschreitet, steht vor','einer zentralen Frage: Wer darf besteuern?']:['Anyone who regularly crosses a border faces a','key question: who has the right to tax?'],
      back: isDE?'Internationales Steuerrecht':'International Tax',
      backFn: function(){ setPage('leistungen-international'); window.scrollTo(0,0); },
    }),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'12px' } },
          isDE ? 'Wann ist das Thema relevant?' : 'When does this matter?'
        ),
        e('p', { className:'fade-up', style:{ fontSize:'12px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", marginBottom:'20px' } },
          isDE ? 'Typische Praxisfälle' : 'Typical scenarios'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'10px' } },
          cases.map((c,i) => e('div', { key:i, style:{ backgroundColor:'var(--accent-subtle)', borderRadius:'12px', padding:'14px 16px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'5px', height:'5px', borderRadius:'50%', backgroundColor:'var(--accent)', flexShrink:0, marginTop:'8px' } }),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, c),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Risiken und Herausforderungen' : 'Risks and challenges'
        ),
        e('div', { className:'fade-up', style:{ display:'flex', flexDirection:'column', gap:'10px' } },
          risks.map((r,i) => e('div', { key:i, style:{ backgroundColor:'white', border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'12px', alignItems:'flex-start' } },
            e('div', { style:{ width:'24px', height:'24px', borderRadius:'6px', backgroundColor:'#FEF3F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:11,height:11,viewBox:'0 0 24 24',fill:'none',stroke:'#C33',strokeWidth:2.5,strokeLinecap:'round'},e('path',{d:'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.7, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, r),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Wie NSBB unterstützt' : 'How NSBB supports you'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'12px' } },
          services.map((s,i) => e('div', { key:i, style:{ border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'22px', height:'22px', borderRadius:'5px', backgroundColor:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:9,height:9,viewBox:'0 0 24 24',fill:'none',stroke:'var(--accent)',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M20 6L9 17l-5-5'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, s),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'28px' } },
          isDE ? 'Typische Fragen' : 'Frequently asked questions'
        ),
        faqs.map((faq,i) => e('div', { key:i, style:{ borderBottom:'1px solid #ECEAE6' } },
          e('button', { onClick:()=>setOpen(open===i?null:i), style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
            e('span', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.05rem', color: open===i?'#1A1917':'#3A342C', fontWeight: open===i?500:400, lineHeight:1.35 } }, faq.q),
            e('span', { style:{ flexShrink:0, width:'22px', height:'22px', borderRadius:'50%', border:`1px solid ${open===i?'var(--accent)':'#D4CFC8'}`, backgroundColor: open===i?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' } },
              open===i
                ? e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'white',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M5 12h14'}))
                : e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'#6B6358',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M12 5v14M5 12h14'}))
            ),
          ),
          open===i && e('p', { style:{ fontSize:'13px', lineHeight:1.8, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", paddingBottom:'16px', margin:0 } }, faq.a),
        )),
      ),
    ),

    e(ContactCTA, { setPage, t, tabPreset:'international', setKontaktPreset }),
  );
}


function IntlVermoegenPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = k => { setPage(k); window.scrollTo(0,0); };

  const cases    = isDE ? ['Unternehmer mit Beteiligungen in mehreren Ländern möchte Struktur optimieren',
        'Familie mit Immobilienvermögen in Deutschland, Österreich und der Schweiz',
        'Investor mit internationalem Wertpapierdepot und Auslandskonten',
        'Unternehmer plant Übergabe des Unternehmens an die nächste Generation',
        'Vermögende Privatperson plant Wohnsitzwechsel und will Vermögen absichern',
        'Family Office sucht steuereffiziente Holdingstruktur mit internationalem Bezug'] : ['Entrepreneur with participations in several countries wants to optimise structure',
        'Family with real estate in Germany, Austria and Switzerland',
        'Investor with international securities portfolio and foreign accounts',
        'Entrepreneur planning business transfer to the next generation',
        'High-net-worth individual planning relocation and wanting to protect assets',
        'Family office seeking tax-efficient holding structure with international dimension'];
  const risks    = isDE ? ['Fehlende Gesamtstruktur: Wer Vermögen ohne Gesamtplanung aufbaut, riskiert unbeabsichtigte steuerliche Folgen bei Ausschüttungen, Verkäufen oder Übertragungen.',
        'Missachtung von Anti-Missbrauchsregeln: Moderne internationale Steuerregeln (BEPS, ATAD, Hinzurechnungsbesteuerung) sind darauf ausgerichtet, künstliche Strukturen zu neutralisieren.',
        'Unterschätzung der Transparenz: Automatischer Informationsaustausch, Registerveröffentlichungen und Meldepflichten machen internationale Strukturen weitgehend transparent für Steuerbehörden.',
        'Fehlende Nachfolgeplanung: Wer Vermögen strukturiert, ohne an die Übertragung auf die nächste Generation zu denken, riskiert unnötige Erbschaft- und Schenkungsteuerbelastungen.',
        'Zu komplexe Strukturen: Übermäßig komplexe Konstruktionen sind teuer in der Verwaltung und können bei Prüfungen zu erhöhtem Erklärungsbedarf führen.'] : ['Lack of overall structure: Building up assets without overall planning risks unintended tax consequences on distributions, sales or transfers.',
        'Disregard for anti-avoidance rules: Modern international tax rules (BEPS, ATAD, CFC taxation) are designed to neutralise artificial structures.',
        'Underestimating transparency: Automatic information exchange, register publications and reporting obligations make international structures largely transparent to tax authorities.',
        'Lack of succession planning: Structuring assets without thinking about transfer to the next generation risks unnecessary inheritance and gift tax burdens.',
        'Overly complex structures: Excessively complex arrangements are expensive to administer and can lead to increased explanatory requirements in audits.'];
  const services = isDE ? ['Analyse der bestehenden Vermögensstruktur und Identifikation von Optimierungspotenzialen',
        'Entwicklung einer internationalen Holdingstruktur mit steuerlicher und rechtlicher Tragfähigkeit',
        'Beratung zu internationalen Familienvermögensstrukturen und Family Offices',
        'Steuerliche Begleitung von Übertragungen auf die nächste Generation',
        'Immobilienvermögen: Strukturierung im In- und Ausland',
        'Koordination mit Rechtsanwälten, Notaren und internationalen Steuerberatern',
        'Laufende steuerliche Betreuung und Monitoring der Struktur'] : ['Analysis of existing asset structure and identification of optimisation potential',
        'Development of an international holding structure with tax and legal viability',
        'Advice on international family wealth structures and family offices',
        'Tax support for transfers to the next generation',
        'Real estate: structuring in Germany and abroad',
        'Coordination with lawyers, notaries and international tax advisors',
        'Ongoing tax support and monitoring of the structure'];
  const faqs     = isDE ? [{q:'Wie kann Vermögen international strukturiert werden?',a:'Eine internationale Vermögensstruktur kann beispielsweise über eine Holdinggesellschaft aufgebaut werden, die Beteiligungen an operativen Gesellschaften, Immobilien oder Kapitalanlagen in verschiedenen Ländern hält. Die optimale Struktur hängt von den individuellen Zielen, dem Wohnsitz und der Art der Vermögenswerte ab.'},
        {q:'Welche Risiken bestehen bei internationalen Vermögensstrukturen?',a:'Risiken bestehen insbesondere durch Anti-Missbrauchsregelungen (Hinzurechnungsbesteuerung, ATAD, BEPS), fehlende wirtschaftliche Substanz der Gesellschaften im Ausland und durch zunehmende Transparenzanforderungen. Eine fundierte Beratung ist unerlässlich.'},
        {q:'Welche Strukturen eignen sich für Unternehmerfamilien?',a:'Für Unternehmerfamilien eignen sich häufig Holdingstrukturen kombiniert mit Familiengesellschaften oder Familienpool-Strukturen. Diese ermöglichen die effiziente Übertragung von Vermögen auf die nächste Generation und können Erbschaft- und Schenkungsteuer optimieren.'},
        {q:'Ist eine Holdinggesellschaft im Ausland legal?',a:'Ja – wenn sie wirtschaftliche Substanz aufweist, einen realen Sitz hat und nicht lediglich dazu dient, Steuern zu vermeiden. Reine Briefkastengesellschaften werden nach modernem internationalem Steuerrecht nicht anerkannt.'},
        {q:'Welche Rolle spielt die Nachfolgeplanung bei der Vermögensstrukturierung?',a:'Eine vorausschauende Vermögensstrukturierung berücksichtigt die Nachfolge von Anfang an: Wer bekommt was, wann und wie? Die frühzeitige Nutzung von Freibeträgen, die Wahl der richtigen Rechtsform und die Einbindung von Familienmitgliedern sind zentrale Elemente.'}] : [{q:'How can assets be structured internationally?',a:'An international asset structure can be built, for example, via a holding company that holds participations in operating companies, real estate or capital investments in various countries. The optimal structure depends on individual goals, place of residence and the nature of the assets.'},
        {q:'What risks exist with international asset structures?',a:'Risks arise particularly from anti-avoidance rules (CFC taxation, ATAD, BEPS), insufficient economic substance of companies abroad and increasing transparency requirements. Thorough advice is essential.'},
        {q:'Which structures are suitable for entrepreneurial families?',a:'Holding structures combined with family partnerships or family pool structures are often suitable for entrepreneurial families. These enable efficient transfer of assets to the next generation and can optimise inheritance and gift tax.'},
        {q:'Is a holding company abroad legal?',a:'Yes – if it has economic substance, a real seat and is not merely designed to avoid tax. Pure shell companies are not recognised under modern international tax law.'},
        {q:'What role does succession planning play in wealth structuring?',a:'Forward-looking wealth structuring incorporates succession from the outset: who gets what, when and how? Early use of exemptions, choosing the right legal form and involving family members are central elements.'}];
  const [open, setOpen] = React.useState(null);

  return e('div', { className:'page-enter' },

    e(PageHero, {
      label: isDE?'Internationales Steuerrecht':'International Tax',
      fit: true,
      title: isDE?'Internationale':'International',
      accent: isDE?'Vermögensstrukturierung.':'Wealth Structuring.',
      subtitle: isDE?['Unternehmer und Investoren fragen zunehmend, wie','ihr Vermögen international sinnvoll strukturiert wird.']:['Entrepreneurs and investors increasingly ask how','their wealth can be structured internationally.'],
      back: isDE?'Internationales Steuerrecht':'International Tax',
      backFn: function(){ setPage('leistungen-international'); window.scrollTo(0,0); },
    }),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'12px' } },
          isDE ? 'Wann ist das Thema relevant?' : 'When does this matter?'
        ),
        e('p', { className:'fade-up', style:{ fontSize:'12px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", marginBottom:'20px' } },
          isDE ? 'Typische Praxisfälle' : 'Typical scenarios'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'10px' } },
          cases.map((c,i) => e('div', { key:i, style:{ backgroundColor:'var(--accent-subtle)', borderRadius:'12px', padding:'14px 16px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'5px', height:'5px', borderRadius:'50%', backgroundColor:'var(--accent)', flexShrink:0, marginTop:'8px' } }),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, c),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Risiken und Herausforderungen' : 'Risks and challenges'
        ),
        e('div', { className:'fade-up', style:{ display:'flex', flexDirection:'column', gap:'10px' } },
          risks.map((r,i) => e('div', { key:i, style:{ backgroundColor:'white', border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'12px', alignItems:'flex-start' } },
            e('div', { style:{ width:'24px', height:'24px', borderRadius:'6px', backgroundColor:'#FEF3F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:11,height:11,viewBox:'0 0 24 24',fill:'none',stroke:'#C33',strokeWidth:2.5,strokeLinecap:'round'},e('path',{d:'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.7, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, r),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'24px' } },
          isDE ? 'Wie NSBB unterstützt' : 'How NSBB supports you'
        ),
        e('div', { className:'fade-up', style:{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'12px' } },
          services.map((s,i) => e('div', { key:i, style:{ border:'1px solid #ECEAE6', borderRadius:'12px', padding:'16px 18px', display:'flex', gap:'10px', alignItems:'flex-start' } },
            e('div', { style:{ width:'22px', height:'22px', borderRadius:'5px', backgroundColor:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' } },
              e('svg',{width:9,height:9,viewBox:'0 0 24 24',fill:'none',stroke:'var(--accent)',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M20 6L9 17l-5-5'}))
            ),
            e('p', { style:{ fontSize:'13px', lineHeight:1.65, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:0 } }, s),
          ))
        ),
      ),
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'64px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'fade-up', style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.7rem,3vw,2.4rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'28px' } },
          isDE ? 'Typische Fragen' : 'Frequently asked questions'
        ),
        faqs.map((faq,i) => e('div', { key:i, style:{ borderBottom:'1px solid #ECEAE6' } },
          e('button', { onClick:()=>setOpen(open===i?null:i), style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
            e('span', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.05rem', color: open===i?'#1A1917':'#3A342C', fontWeight: open===i?500:400, lineHeight:1.35 } }, faq.q),
            e('span', { style:{ flexShrink:0, width:'22px', height:'22px', borderRadius:'50%', border:`1px solid ${open===i?'var(--accent)':'#D4CFC8'}`, backgroundColor: open===i?'var(--accent)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' } },
              open===i
                ? e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'white',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M5 12h14'}))
                : e('svg',{width:8,height:8,viewBox:'0 0 24 24',fill:'none',stroke:'#6B6358',strokeWidth:3,strokeLinecap:'round'},e('path',{d:'M12 5v14M5 12h14'}))
            ),
          ),
          open===i && e('p', { style:{ fontSize:'13px', lineHeight:1.8, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", paddingBottom:'16px', margin:0 } }, faq.a),
        )),
      ),
    ),

    e(ContactCTA, { setPage, t, tabPreset:'international', setKontaktPreset }),
  );
}


function LeistungenPrivatPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const items = isDE ? [
    { title:'Einkommensteuererklärungen', desc:'Professionelle Erstellung mit allen relevanten Einkunftsarten, Optimierungspotenzial und pünktlicher Abgabe.' },
    { title:'Erbschaftsteuer', desc:'Steueroptimierte Gestaltung und Erklärung im Erbfall – vorausschauend und rechtssicher.' },
    { title:'Schenkungsteuer', desc:'Steuerlich durchdachte Übertragung von Vermögen zu Lebzeiten.' },
    { title:'Vermögensnachfolge', desc:'Strukturierte und steueroptimierte Planung der Übergabe Ihres Vermögens an die nächste Generation.' },
    { title:'Private steuerliche Gestaltungsberatung', desc:'Vorausschauende Beratung zur Optimierung Ihrer persönlichen steuerlichen Situation.' },
    { title:'Immobilienbezogene steuerliche Themen', desc:'Mieteinnahmen, Veräußerungsgewinne, Grunderwerbsteuer und steuerliche Optimierung bei Immobilienvermögen.' },
  ] : [
    { title:'Income tax returns', desc:'Professional preparation covering all relevant income types, optimisation potential and timely filing.' },
    { title:'Inheritance tax', desc:'Tax-optimised structuring and filing in the event of inheritance – forward-looking and legally sound.' },
    { title:'Gift tax', desc:'Tax-smart transfer of assets during your lifetime.' },
    { title:'Wealth succession', desc:'Structured and tax-optimised planning for passing your assets to the next generation.' },
    { title:'Private tax structuring advice', desc:'Forward-looking advice to optimise your personal tax situation.' },
    { title:'Real estate-related tax matters', desc:'Rental income, capital gains, real estate transfer tax and tax optimisation for property assets.' },
  ];
  return e('div', { className:'page-enter' },
    e(PageHero, { label:isDE?'Für Privatpersonen':'For Private Clients',
  fit:true,
  title:isDE?'Persönliche':'Personal',
  accent:isDE?'Steuerberatung.':'tax advisory.',
  subtitle:isDE?['Diskret, präzise und persönlich – wir begleiten','Privatpersonen mit höchster Sorgfalt.']:['Discreet, precise and personal – we support','private clients with the utmost care.']
}),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6' },
        items.map((s,i) => e('div', { key:s.title, className:'bg-white rounded-2xl p-8 fade-up border', style:{ transitionDelay:`${i*70}ms`, borderColor:'var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,.04)' } },
          e('hr', { className:'divider' }),
          e('h2', { className:'font-display mb-4', style:{ fontSize:'1.4rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, s.title),
          e('p', { className:'text-sm leading-relaxed' }, s.desc),
        ))
      ),
    ),
    e(ContactCTA, { setPage, t, bg:'var(--offwhite)', tabPreset:'privat', setKontaktPreset }),
  );
}

/* ─────────────────────────────────────────────────────────
   DIGITALE KANZLEI
───────────────────────────────────────────────────────── */
function DigitalPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = k => { setPage(k); window.scrollTo(0,0); };

  const tools = [
    { n:'MyDATEV',                 d: isDE?'Ihr persönliches Mandantenportal für Dokumente und Steuerdaten.':'Your personal client portal for documents and tax data.',                          url:'https://mydatev-portal.apps.datev.de/' },
    { n:'DATEV Unternehmen online', d: isDE?'Digitale Belegübermittlung und Buchhaltung in Echtzeit.':'Digital document submission and real-time bookkeeping.',                                   url:'https://webapps.datev.de/duo-start/central-client-selection' },
    { n:'DATEV Personal',           d: isDE?'Digitale Lohnbuchhaltung und Gehaltsabrechnungen.':'Digital payroll accounting and salary statements.',                                           url:'https://apps.datev.de/personal-kanzlei/de/' },
    { n:'DATEV Arbeitnehmer online',d: isDE?'Digitale Gehaltsabrechnungen für Ihre Mitarbeiter.':'Digital payslips for your employees.',                                                        url:'https://apps.datev.de/ano/de/' },
    { n:'DATEV Meine Steuern',      d: isDE?'Einfache und sichere Übermittlung Ihrer steuerlichen Unterlagen.':'Simple and secure submission of your tax documents.',                          url:'https://apps.datev.de/mytax' },
    { n:'FP Sign',                  d: isDE?'Rechtssichere digitale Unterschriften für Ihre Dokumente.':'Legally compliant digital signatures for your documents.',                             url:'https://app.fp-sign.com/sso-auth/login?culture=de-DE' },
  ];

  const benefits = t.digitalBenefitData;
  const steps    = t.digitalStepData;

  return e('div', { className:'page-enter' },

    e(PageHero, { label:t.digitalPageLabel,
      fit:true,
      title:t.digitalPageH1a,
      accent:t.digitalPageH1b,
      subtitle:isDE?['Vollständig digital – mit strukturierten Prozessen','und modernen Systemen, die Ihnen Zeit sparen.']:['Fully digital – with structured processes and','modern systems that save you time.']
    }),

    // ── Systeme ──────────────────────────────────────────
    e('section', { style:{ backgroundColor:'white', paddingTop:'48px', paddingBottom:'56px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },

        // Section header
        e('div', { className:'max-w-xl mb-8 fade-up' },
          e('p', { className:'label mb-4' }, t.digitalToolsLabel),
          e('h2', { className:'font-display', style:{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif", whiteSpace:'nowrap' } }, t.digitalToolsH2),
        ),

        // Positioning sentence
        e('div', { className:'fade-up', style:{ marginBottom:'16px', paddingBottom:'20px', borderBottom:'1px solid #ECEAE6' } },
          e('p', { style:{ fontSize:'15px', lineHeight:1.8, color:'#1A1917', fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontWeight:600, maxWidth:'720px' } },
            isDE
              ? '„Digitale Prozesse sind bei NSBB kein Zusatzangebot, sondern integraler Bestandteil unserer täglichen Zusammenarbeit.“'
              : '„Digital processes at NSBB are not an add-on – they are an integral part of our daily collaboration.“'
          ),
        ),

        // Intro text
        e('p', { className:'fade-up', style:{ fontSize:'14px', lineHeight:1.75, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", maxWidth:'640px', marginBottom:'28px' } },
          isDE
            ? 'Unsere digitalen Lösungen verfolgen ein Ziel: weniger Verwaltungsaufwand, schnellere Prozesse und jederzeit Zugriff auf wichtige Informationen.'
            : 'Our digital solutions pursue one goal: less administrative burden, faster processes and access to important information at any time.'
        ),

        // Tool cards — compact, clearly clickable
        e('div', { className:'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3' },
          tools.map((tool,i) =>
            e('a', { key:tool.n,
              href:tool.url, target:'_blank', rel:'noopener noreferrer',
              className:'fade-up',
              style:{
                transitionDelay:`${i*60}ms`,
                display:'flex', alignItems:'center', justifyContent:'space-between',
                gap:'12px',
                backgroundColor:'white',
                border:'1px solid #ECEAE6',
                borderRadius:'14px',
                padding:'16px 20px',
                textDecoration:'none',
                cursor:'pointer',
                transition:'box-shadow .18s, border-color .18s, transform .18s',
                boxShadow:'0 1px 3px rgba(0,0,0,.04)',
              },
              onMouseEnter:ev=>{ev.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,.09)';ev.currentTarget.style.borderColor='var(--accent)';ev.currentTarget.style.transform='translateY(-1px)';},
              onMouseLeave:ev=>{ev.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,.04)';ev.currentTarget.style.borderColor='#ECEAE6';ev.currentTarget.style.transform='none';}
            },
              e('div', null,
                e('p', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.1rem', fontWeight:500, color:'var(--accent)', marginBottom:'2px', lineHeight:1.2 } }, tool.n),
                e('p', { style:{ fontSize:'12px', lineHeight:1.5, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", margin:0 } }, tool.d),
              ),
              e('div', { style:{ flexShrink:0, width:'28px', height:'28px', borderRadius:'8px', backgroundColor:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center' } },
                e('svg',{width:12,height:12,viewBox:'0 0 24 24',fill:'none',stroke:'var(--accent)',strokeWidth:2.5,strokeLinecap:'round'},e('path',{d:'M7 17L17 7M7 7h10v10'}))
              ),
            )
          )
        ),
      ),
    ),

    // ── Vorteile ─────────────────────────────────────────
    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'48px', paddingBottom:'56px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'max-w-xl mb-14 fade-up' },
          e('p', { className:'label mb-4' }, t.digitalBenefitsLabel),
          e('h2', { className:'font-display', style:{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif", whiteSpace:'nowrap' } }, t.digitalBenefitsH2),
        ),
        e('div', { className:'grid grid-cols-1 md:grid-cols-2 gap-5' },
          benefits.map((b,i) => e('div', { key:b.t, className:'flex gap-6 bg-white rounded-2xl p-8 fade-up', style:{ transitionDelay:`${i*80}ms`, boxShadow:'0 1px 3px rgba(0,0,0,.04)' } },
            e('div', { className:'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-1', style:{ backgroundColor:'var(--accent-subtle)' } }, e(Ico,{name:b.icon,size:18})),
            e('div', null,
              e('h3', { className:'text-base font-semibold mb-2', style:{ color:'#1A1917', fontFamily:"'DM Sans',sans-serif" } }, b.t),
              e('p', { className:'text-sm leading-relaxed' }, b.d),
            ),
          ))
        ),
      ),
    ),

    // ── 3-Schritte ───────────────────────────────────────
    e('section', { style:{ backgroundColor:'white', paddingTop:'52px', paddingBottom:'80px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'max-w-xl mb-8 fade-up' },
          e('p', { className:'label mb-4' }, t.digitalStepsLabel),
          e('h2', { className:'font-display', style:{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, e(React.Fragment, null, e('span',{style:{whiteSpace:'nowrap'}}, isDE?'In drei Schritten zu digitaler':'Three steps to digital'), e('br'), e('span',{style:{whiteSpace:'nowrap'}}, isDE?'Zusammenarbeit.':'collaboration.'))),
        ),
        e('div', { className:'grid grid-cols-1 md:grid-cols-3 gap-8' },
          steps.map((s,i) => e('div', { key:s.s, className:'fade-up', style:{ transitionDelay:`${i*100}ms` } },
            e('p', { className:'step-num mb-1' }, s.s),
            e('h3', { className:'font-display mb-3', style:{ fontSize:'1.4rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, s.t),
            e('p', { className:'text-sm leading-relaxed' }, s.d),
          ))
        ),
      ),
    ),

    // ── Abschlussblock ───────────────────────────────────
    e('section', { className:'fade-up', style:{ backgroundColor:'#F4F2EE', padding:'72px 20px' } },
      e('div', { style:{ maxWidth:'680px', margin:'0 auto', textAlign:'center' } },

        e('h2', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.8rem,3.5vw,2.6rem)', fontWeight:400, color:'#1A1917', lineHeight:1.2, marginBottom:'18px' } },
          isDE ? 'Moderne Prozesse. Persönliche Beratung.' : 'Modern processes. Personal advice.'
        ),

        e('p', { style:{ fontSize:'15px', lineHeight:1.8, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", marginBottom:'40px', maxWidth:'560px', margin:'0 auto 40px' } },
          isDE
            ? 'Digitalisierung dort, wo sie sinnvoll ist. Persönliche Betreuung dort, wo sie wichtig ist. Mit klaren Prozessen, festen Ansprechpartnern und einer Zusammenarbeit, die Ihnen Zeit spart.'
            : 'Digitalisation where it makes sense. Personal support where it matters. With clear processes, dedicated advisors and a collaboration that saves you time.'
        ),

        // Trust block
        e('div', { style:{ display:'inline-grid', gridTemplateColumns:'1fr 1fr', gap:'10px 32px', marginBottom:'36px', textAlign:'left' } },
          [
            isDE?'Fester persönlicher Ansprechpartner':'Dedicated personal advisor',
            isDE?'Digitale Prozesse ohne Mehraufwand':'Digital processes without extra effort',
            isDE?'Schnelle und direkte Kommunikation':'Fast and direct communication',
            isDE?'Transparente Zahlen und Auswertungen':'Transparent figures and reports',
          ].map((item,i) =>
            e('div', { key:i, style:{ display:'flex', alignItems:'center', gap:'8px' } },
              e('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:'var(--accent)',strokeWidth:2.5,strokeLinecap:'round',style:{flexShrink:0}},e('path',{d:'M20 6L9 17l-5-5'})),
              e('span', { style:{ fontSize:'13px', color:'#3A342C', fontFamily:"'DM Sans',sans-serif", fontWeight:500 } }, item),
            )
          )
        ),

        e('button', { className:'btn-g', onClick:()=>{ if(setKontaktPreset) setKontaktPreset('unternehmen'); go('kontakt'); }, style:{ fontSize:'14px', fontWeight:600 } },
          isDE ? 'Digitale Zusammenarbeit kennenlernen' : 'Discover our digital collaboration',
          e('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',style:{marginLeft:'8px'}},e('path',{d:'M5 12h14M12 5l7 7-7 7'}))
        ),
      ),
    ),
  );
}

function TGSPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const regions = t.tgsRegions;
  const stats = t.tgsStats;

  // Approximate country marker positions on the world map (viewBox 0 0 1000 500)
  const markers = [
    [480,180],[470,165],[490,175],[460,190],[500,160], // Europe cluster
    [510,200],[455,205],[485,155],[475,195],[465,178],
    [220,180],[200,150],[210,210],[180,200],            // North America
    [280,330],[300,300],[260,360],                       // Latin America
    [560,200],[600,180],[620,160],                       // Middle East / Asia W
    [720,210],[760,190],[800,220],[780,170],[740,240],  // Asia
    [820,360],[850,380],                                 // Australia
    [520,280],[540,320],[500,300],                       // Africa
  ];

  return e('div', { className:'page-enter' },
    // HERO
    e(PageHero, { label:isDE?'TGS – Think Global Sustainability':'TGS – Think Global Sustainability',
      fit:true,
      title:t.tgsTeaserH2a,
      accent:t.tgsTeaserH2b,
      subtitle:isDE?['Als unabhängiges deutsches Mitglied von TGS Global','verbinden wir persönliche Beratung mit globaler Reichweite.']:['As an independent German member of TGS Global,','we combine personal advice with global reach.']
    }),

    // INTRO + STATS
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'grid grid-cols-1 gap-16' },
          e('div', { className:'fade-up' },
            e('p', { className:'label mb-4' }, t.tgsNetworkLabel),
            e('h2', { className:'font-display mb-6', style:{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, t.tgsNetworkH2),
            e('p', { className:'text-base leading-relaxed mb-5' }, isDE ? 'TGS International – „Think Global Sustainability" – ist ein dynamisches globales Netzwerk unabhängiger Kanzleien für Wirtschaftsprüfung, Steuerberatung, Rechts- und Unternehmensberatung. NSBB ist eigenständiges deutsches Mitglied und bleibt vollständig unabhängig.' : 'TGS International – "Think Global Sustainability" – is a dynamic global network of independent firms providing audit, tax, legal and business advisory services. NSBB is an independent German member and remains fully autonomous.'),
            e('p', { className:'text-base leading-relaxed mb-8' }, isDE ? 'Für Sie bedeutet das: Bei internationalen Sachverhalten müssen Sie sich nicht selbst um Ansprechpartner im Ausland kümmern. Wir übernehmen die Koordination, vermitteln die passenden Netzwerkpartner und betreuen Ihren Sachverhalt strukturiert über Ländergrenzen hinweg.' : 'For you this means: with international matters you never need to find contacts abroad yourself. We handle the coordination, connect you with the right network partners and manage your case in a structured way across borders.'),
            ),
          // WORLD MAP
          e('div', { className:'fade-up', style:{ transitionDelay:'150ms', marginTop:'-32px' } },
          e('div', { className:'grid-resp-2', style:{ display:'grid', gap:'16px' } },
            [{v:'66',l:isDE?'Mitgliedsfirmen':'Member firms'},{v:'58',l:isDE?'Länder':'Countries'},{v:'4.400+',l:isDE?'Fachleute':'Professionals'},{v:isDE?'Global':'Global',l:isDE?'Vernetzt':'Connected'}].map((s,i) =>
              e('div', { key:i, style:{ background:'var(--offwhite)', borderRadius:'16px', padding:'20px', textAlign:'center' } },
                e('p', { className:'text-2xl num' }, s.v),
                e('p', { style:{ fontSize:'11px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", marginTop:'4px' } }, s.l)
              )
            )
          )
        ),
        ),
      ),
    ),

    // INDEPENDENCE MESSAGE
    e('section', { className:'py-16', style:{ backgroundColor:'var(--accent-subtle)' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 max-w-3xl text-center fade-up' },
        e('p', { className:'font-display', style:{ fontSize:'clamp(1.5rem,3vw,2.2rem)', lineHeight:1.3, color:'var(--accent-dark)', fontFamily:"'Cormorant Garamond',serif" } }, isDE ? 'Internationale Sachverhalte – persönlich begleitet, professionell koordiniert, weltweit vernetzt.' : 'International matters – personally guided, professionally coordinated, globally connected.'),
      ),
    ),

    // REGIONS
    e('section', { className:'py-20', style:{ backgroundColor:'var(--offwhite)' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'max-w-xl mb-12 fade-up' }, e('p', { className:'label mb-4' }, t.tgsRegionsLabel), e('h2', { className:'font-display', style:{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, t.tgsRegionsH2)),
        e('div', { className:'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' },
          regions.map((r,i) => e('div', { key:r.l, className:'bg-white rounded-2xl p-7 fade-up', style:{ transitionDelay:`${i*70}ms`, boxShadow:'0 1px 3px rgba(0,0,0,.04)' } },
            e('h3', { className:'font-semibold mb-2 text-sm', style:{ color:'#1A1917', fontFamily:"'DM Sans',sans-serif" } }, r.l),
            e('p', { className:'text-sm leading-relaxed' }, r.c),
          ))
        ),
      ),
    ),

    // LINKS
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'grid grid-cols-1 md:grid-cols-2 gap-5' },
          e('a', { href:'https://tgs-global.com/about/', target:'_blank', rel:'noopener noreferrer', className:'rounded-3xl p-8 card-hover block', style:{ backgroundColor:'var(--offwhite)', textDecoration:'none' } },
            e('div', { className:'w-11 h-11 rounded-xl flex items-center justify-center mb-5', style:{ backgroundColor:'var(--accent-subtle)' } }, e(Ico,{name:'globe',size:18})),
            e('h3', { className:'font-display mb-2', style:{ fontSize:'1.4rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, isDE ? 'Das TGS-Netzwerk' : 'The TGS network'),
            e('p', { className:'text-sm leading-relaxed mb-4' }, isDE ? 'Erfahren Sie mehr über TGS International, die Vision und die weltweite Aufstellung.' : 'Learn more about TGS International, its vision and global presence.'),
            e('span', { className:'inline-flex items-center gap-1.5 text-sm font-medium', style:{ color:'var(--accent)', fontFamily:"'DM Sans',sans-serif" } }, 'tgs-global.com', e(Ico,{name:'arrowRight',size:14})),
          ),
          e('a', { href:'https://tgs-global.com/', target:'_blank', rel:'noopener noreferrer', className:'rounded-3xl p-8 card-hover block', style:{ backgroundColor:'var(--offwhite)', textDecoration:'none' } },
            e('div', { className:'w-11 h-11 rounded-xl flex items-center justify-center mb-5', style:{ backgroundColor:'var(--accent-subtle)' } }, e(Ico,{name:'mapPin',size:18})),
            e('h3', { className:'font-display mb-2', style:{ fontSize:'1.4rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, isDE ? 'Alle Partner finden' : 'Find all partners'),
            e('p', { className:'text-sm leading-relaxed mb-4' }, isDE ? 'Entdecken Sie alle Mitgliedsfirmen und Standorte des TGS-Netzwerks weltweit.' : 'Discover all member firms and locations of the TGS network worldwide.'),
            e('span', { className:'inline-flex items-center gap-1.5 text-sm font-medium', style:{ color:'var(--accent)', fontFamily:"'DM Sans',sans-serif" } }, isDE ? 'Partner-Übersicht' : 'Partner directory', e(Ico,{name:'arrowRight',size:14})),
          ),
        ),
      ),
    ),

    e(ContactCTA, { setPage, t, bg:'var(--offwhite)', tabPreset:'international', setKontaktPreset }),
  );
}

const team = [
  {
    name: 'Dipl.-Kfm. Guido H. Siebert',
    statement: 'Gute Entscheidungen entstehen dort, wo Erfahrung, Zahlenverständnis und unternehmerischer Weitblick zusammenkommen.',
    statementEN: 'Good decisions arise where experience, financial acumen and entrepreneurial vision come together.',
    photo: 'assets/images/team-guido-siebert.webp',
    title: 'Geschäftsführer',
    titleEN: 'Managing Director',
    profession: 'Wirtschaftsprüfer · Steuerberater',
    professionEN: 'Auditor · Tax Advisor',
    standort: 'Berlin',
    init: 'GS',
    email: 'siebert@nsbb.de',
    phone: '+49 (0) 30 815 80 93',
    imgPos: 'center 20%',
    linkedin: null,
    focus: ['Strategische Unternehmensberatung','Erbschaft- & Schenkungsteuer','Internationales Steuerrecht','Unternehmens- und Konzernstrukturen'],
    focusEN: ['Strategic business advisory','Inheritance & gift tax','International tax law','Corporate & group structures'],
    sprachen: ['Deutsch','Englisch'],
    cv: ['Abschluss als Diplom-Kaufmann, Universität zu Köln','Berufsexamen zum Steuerberater','Berufsexamen zum Wirtschaftsprüfer','Mitwirkung in Arbeitskreisen des Instituts der Wirtschaftsprüfer und im Deutschen Rechnungslegungs Standards Committee','Partner bei einer großen, international tätigen Wirtschaftsprüfungsgesellschaft','Seit 2014 Gesellschafter-Geschäftsführer der NSBB Steuerberatungsgesellschaft mbH'],
    cvEN: ['Degree in Business Administration (Dipl.-Kfm.), University of Cologne','Professional examination as Tax Advisor','Professional examination as Auditor','Contributor to working groups of the Institute of Public Auditors and the German Accounting Standards Committee','Partner at a large, internationally active auditing firm','Managing partner of NSBB Steuerberatungsgesellschaft mbH since 2014'],
  },
  {
    name: 'Maximilian Siebert, M.Sc.',
    statement: 'Moderne Steuerberatung bedeutet für mich, digitale Prozesse mit persönlicher Beratung zu verbinden und Unternehmen bei wichtigen Entscheidungen zu begleiten.',
    statementEN: 'For me, modern tax advisory means combining digital processes with personal guidance and supporting businesses through important decisions.',
    photo: 'assets/images/team-maximilian-siebert.webp',
    title: 'Prokurist',
    titleEN: 'Authorized Signatory',
    profession: 'Steuerberater',
    professionEN: 'Tax Advisor',
    standort: 'Köln',
    init: 'MS',
    email: 'm.siebert@nsbb.de',
    phone: '+49 (0) 221 973 064 0',
    imgPos: 'center 8%',
    linkedin: null,
    focus: ['Deklarationsberatung','Umstrukturierungen','Internationales Steuerrecht','Digitalisierung & Automatisierung / KI'],
    focusEN: ['Tax return advisory','Restructurings','International tax law','Digitalisation & automation / AI'],
    sprachen: ['Deutsch','Englisch'],
    cv: ['B.Sc. Betriebswirtschaftslehre, Universität zu Köln','M.Sc. Betriebswirtschaftslehre, Universität zu Köln','Bestellung zum Steuerberater','Langjährige Tätigkeit mit Schwerpunkt auf laufender Beratung und Gestaltungsberatung','Prokurist der NSBB Steuerberatungsgesellschaft mbH'],
    cvEN: ['B.Sc. Business Administration, University of Cologne','M.Sc. Business Administration, University of Cologne','Admission as Tax Advisor','Several years of experience focused on ongoing advisory and structuring','Authorized signatory of NSBB Steuerberatungsgesellschaft mbH'],
  },
  {
    name: 'Isabell Schramm',
    statement: 'Ich kenne die steuerliche Praxis aus jeder Perspektive und begleite Mandanten mit pragmatischen Lösungen durch ihren Alltag.',
    statementEN: 'I know tax practice from every perspective and support clients through their daily business with pragmatic solutions.',
    photo: 'assets/images/team-isabell-schramm.webp',
    title: 'Prokuristin',
    titleEN: 'Authorized Signatory',
    profession: 'Steuerberaterin',
    professionEN: 'Tax Advisor',
    standort: 'Berlin',
    init: 'IS',
    email: 'schramm@nsbb.de',
    phone: '+49 (0) 30 815 80 93',
    imgPos: 'center 8%',
    linkedin: null,
    focus: ['Deklarationsberatung','Bilanzsteuerrecht','Lohn- und Personalwesen'],
    focusEN: ['Tax return advisory','Balance sheet tax law','Payroll & HR'],
    sprachen: ['Deutsch'],
    cv: ['Ausbildung zur Steuerfachangestellten','Weiterbildung zur Steuerfachwirtin','Bestellung zur Steuerberaterin','Langjährige Tätigkeit in der laufenden Beratung von Unternehmen und Privatpersonen','Prokuristin der NSBB Steuerberatungsgesellschaft mbH'],
    cvEN: ['Training as a tax clerk','Further training as a tax specialist (Steuerfachwirtin)','Admission as Tax Advisor','Several years of experience in ongoing advisory for businesses and private individuals','Authorized signatory of NSBB Steuerberatungsgesellschaft mbH'],
  },
  {
    name: 'Hanna Richrath, M.A.',
    statement: 'Gute Beratung bedeutet für mich, komplexe Themen verständlich zu machen und gemeinsam tragfähige Lösungen zu entwickeln.',
    statementEN: 'For me, good advisory means making complex topics understandable and developing viable solutions together.',
    photo: 'assets/images/team-hanna-richrath.webp',
    title: 'Prokuristin',
    titleEN: 'Authorized Signatory',
    profession: 'Steuerberaterin',
    professionEN: 'Tax Advisor',
    standort: 'Köln',
    init: 'HR',
    email: 'richrath@nsbb.de',
    phone: '+49 (0) 221 973 064 0',
    imgPos: 'center 8%',
    linkedin: null,
    focus: ['Deklarationsberatung','Umsatzsteuer','Internationales Steuerrecht'],
    focusEN: ['Tax return advisory','VAT','International tax law'],
    sprachen: ['Deutsch','Englisch'],
    cv: ['B.Sc. Volkswirtschaftslehre, Universität zu Köln','M.A. Taxation / Steuerrecht, FOM Hochschule','Bestellung zur Steuerberaterin','Langjährige Tätigkeit mit Schwerpunkt auf internationalen Sachverhalten','Prokuristin der NSBB Steuerberatungsgesellschaft mbH'],
    cvEN: ['B.Sc. Economics, University of Cologne','M.A. Taxation, FOM University of Applied Sciences','Admission as Tax Advisor','Several years of experience with a focus on international matters','Authorized signatory of NSBB Steuerberatungsgesellschaft mbH'],
  },
];

/* ─────────────────────────────────────────────────────────
   ÜBER UNS
───────────────────────────────────────────────────────── */
function UeberUnsPage({ setPage, lang, t }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const [activeProfile, setActiveProfile] = React.useState(null);
  const active = activeProfile !== null ? team[activeProfile] : null;

  // Close on ESC
  React.useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setActiveProfile(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return e('div', { className:'page-enter' },

    // ── Hero ──────────────────────────────────────────────
    e(PageHero, {
      label: isDE ? 'Das Team' : 'The Team',
      fit: true,
      title: isDE ? 'Die richtigen' : 'The Right',
      accent: isDE ? 'Ansprechpartner.' : 'People to Know.',
      subtitle: isDE
        ? ['Lernen Sie die Menschen kennen, die Unternehmen,', 'Unternehmer und Familien bei Entscheidungen begleiten.']
        : ['Meet the people who accompany businesses,', 'entrepreneurs and families through decisions.']
    }),

    // ── Team grid ─────────────────────────────────────────
    e('section', { style:{ backgroundColor:'white', paddingTop:'48px', paddingBottom:'80px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'grid grid-cols-1 md:grid-cols-2', style:{ gap:'24px 48px', justifyItems:'start' } },
          team.map((p, i) =>
            e('div', { key:p.name,
              className:'fade-up',
              style:{ transitionDelay:`${i*60}ms`, backgroundColor:'white', borderRadius:'20px', overflow:'hidden', cursor:'pointer', border:'1px solid #ECEAE6', transition:'box-shadow .2s, transform .2s', boxShadow:'0 1px 4px rgba(0,0,0,.05)', display:'flex', flexDirection:'column', height:'100%', width:'100%', maxWidth:'400px' },
              onClick:()=>setActiveProfile(i),
              onMouseEnter:ev=>{ev.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,.1)';ev.currentTarget.style.transform='translateY(-2px)';},
              onMouseLeave:ev=>{ev.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,.05)';ev.currentTarget.style.transform='none';}
            },
              // Photo - aspect ratio matches source images
              e('div', { style:{ position:'relative', width:'100%', paddingTop:'100%', overflow:'hidden', backgroundColor:'#EEECE8' } },
                p.photo
                  ? e('img', { src:p.photo, alt:p.name, loading:'lazy', style:{
                      position:'absolute', top:0, left:0, width:'100%', height:'100%',
                      objectFit:'cover',
                      objectPosition: p.imgPos || 'center 10%',
                    }})
                  : e('div', { style:{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' } },
                      e('span', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'52px', color:'var(--accent)', fontWeight:300 } }, p.init)
                    )
              ),

              // Card body
              e('div', { style:{ padding:'18px 20px 20px', display:'flex', flexDirection:'column', flex:'1' } },
                e('p', { style:{ fontSize:'10px', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--accent)', fontFamily:"'DM Sans',sans-serif", marginBottom:'4px' } }, isDE?p.title:(p.titleEN||p.title)),
                e('h3', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.25rem', color:'#1A1917', fontWeight:500, lineHeight:1.2, marginBottom:'2px' } }, p.name),
                e('p', { style:{ fontSize:'12px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", marginBottom:'10px' } },
                  (isDE?p.profession:(p.professionEN||p.profession)) + (p.standort ? ' · ' + p.standort : '')
                ),
                p.statement && e('p', { style:{
                  fontSize:'14.5px', lineHeight:1.6, color:'#6B6358',
                  fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic',
                  marginBottom:'12px', flex:'1',
                }}, '\u201C' + (isDE?p.statement:(p.statementEN||p.statement)) + '\u201D'),
                p.focus && p.focus.length > 0 && e('div', { style:{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'14px' } },
                  (isDE?p.focus:(p.focusEN||p.focus)).slice(0,3).map(f => e('div', { key:f, className:'flex items-center gap-2', style:{ fontSize:'12px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif" } }, e(Ico,{name:'checkCircle',size:13,cls:'flex-shrink-0'}), f))
                ),
                e('div', { style:{ display:'inline-flex', alignItems:'center', gap:'5px', fontSize:'12px', fontWeight:600, color:'var(--accent)', fontFamily:"'DM Sans',sans-serif", padding:'6px 12px', borderRadius:'7px', backgroundColor:'var(--accent-subtle)', alignSelf:'flex-start' } },
                  isDE ? 'Profil ansehen' : 'View profile',
                  e('svg',{width:10,height:10,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2.5,strokeLinecap:'round'},e('path',{d:'M5 12h14M12 5l7 7-7 7'}))
                ),
              ),
            )
          ),
        ),
      ),
    ),

    e(ContactCTA, { setPage, t }),

    // ── Profile Modal ──────────────────────────────────────
    active && ReactDOM.createPortal(
      e('div', {
        style:{ position:'fixed', inset:0, zIndex:9900, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' },
        onClick:()=>setActiveProfile(null)
      },
        e('div', { style:{ position:'absolute', inset:0, backgroundColor:'rgba(26,25,23,.5)', backdropFilter:'blur(6px)' } }),
        e('div', {
          style:{ position:'relative', background:'white', borderRadius:'24px', width:'100%', maxWidth:'520px', maxHeight:'92vh', overflowY:'auto', boxShadow:'0 32px 80px rgba(0,0,0,.2)' },
          onClick:ev=>ev.stopPropagation()
        },
          e('button', { onClick:()=>setActiveProfile(null), 'aria-label':'Schließen',
            style:{ position:'absolute', top:'16px', right:'16px', width:'32px', height:'32px', borderRadius:'50%', border:'none', background:'rgba(0,0,0,.06)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10 } },
            e('svg',{width:14,height:14,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2.5,strokeLinecap:'round'},e('path',{d:'M18 6L6 18M6 6l12 12'}))
          ),
          e('div', { style:{ padding:'40px 32px 28px', textAlign:'center' } },
            e('div', { style:{ width:'144px', height:'144px', borderRadius:'50%', overflow:'hidden', margin:'0 auto 20px', border:'3px solid #ECEAE6', boxShadow:'0 4px 16px rgba(0,0,0,.08)', flexShrink:0 } },
              active.photo
                ? e('img', { src:active.photo, alt:active.name, style:{ width:'100%', height:'100%', objectFit:'cover', objectPosition: active.imgPos || 'center 10%' } })
                : e('div', { style:{ width:'100%', height:'100%', backgroundColor:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center' } },
                    e('span', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'48px', color:'var(--accent)', fontWeight:300 } }, active.init)
                  )
            ),
            e('h2', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.65rem', color:'#1A1917', marginBottom:'6px', lineHeight:1.1, fontWeight:500 } }, active.name),
            e('p', { style:{ fontSize:'11px', fontWeight:600, color:'var(--accent)', fontFamily:"'DM Sans',sans-serif", letterSpacing:'.06em', textTransform:'uppercase', marginBottom:'4px' } }, isDE?active.title:(active.titleEN||active.title)),
            e('p', { style:{ fontSize:'12px', color:'#B0A89E', fontFamily:"'DM Sans',sans-serif" } }, active.standort),
          ),
          e('div', { style:{ padding:'0 32px 36px' } },
            e('div', { style:{ borderTop:'1px solid #ECEAE6', paddingTop:'24px', marginBottom:'24px' } },
              e('p', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.1rem', fontWeight:400, color:'#1A1917', lineHeight:1.75, fontStyle:'italic', textAlign:'left' } },
                '\u201C' + (isDE?active.statement:(active.statementEN||active.statement)) + '\u201D'
              ),
            ),
            active.focus && active.focus.length > 0 && e('div', { style:{ marginBottom:'20px' } },
              e('p', { style:{ fontSize:'10px', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'#B0A89E', fontFamily:"'DM Sans',sans-serif", marginBottom:'10px' } }, isDE?'Fachgebiete':'Expertise'),
              e('div', { style:{ display:'flex', flexWrap:'wrap', gap:'6px' } },
                (isDE?active.focus:(active.focusEN||active.focus)).map(f => e('span', { key:f, style:{ fontSize:'12px', fontWeight:500, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", backgroundColor:'#F4F2EE', borderRadius:'6px', padding:'5px 10px' } }, f))
              ),
            ),
            active.sprachen && active.sprachen.length > 0 && e('div', { style:{ marginBottom:'24px' } },
              e('p', { style:{ fontSize:'10px', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'#B0A89E', fontFamily:"'DM Sans',sans-serif", marginBottom:'10px' } }, isDE?'Sprachen':'Languages'),
              e('div', { style:{ display:'flex', flexWrap:'wrap', gap:'6px' } },
                active.sprachen.map(s => e('span', { key:s, style:{ fontSize:'12px', fontWeight:500, color:'var(--accent)', fontFamily:"'DM Sans',sans-serif", backgroundColor:'var(--accent-subtle)', borderRadius:'6px', padding:'5px 10px' } }, isDE?s:(s==='Deutsch'?'German':s==='Englisch'?'English':s)))
              ),
            ),
            active.cv && active.cv.length > 0 && e('div', { style:{ paddingTop:'20px', borderTop:'1px solid #ECEAE6' } },
              e('p', { style:{ fontSize:'10px', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'#B0A89E', fontFamily:"'DM Sans',sans-serif", marginBottom:'12px' } }, isDE?'Werdegang':'Background'),
              e('div', { style:{ display:'flex', flexDirection:'column', gap:'6px' } },
                (isDE?active.cv:(active.cvEN||active.cv)).map((c,ci) => e('p', { key:ci, style:{ fontSize:'12px', color:'#8A8075', fontFamily:"'DM Sans',sans-serif", margin:0, paddingLeft:'12px', borderLeft:'2px solid #ECEAE6', lineHeight:1.6 } }, c))
              ),
            ),
            e('div', { style:{ paddingTop:'24px', borderTop:'1px solid #ECEAE6', marginTop:'24px', display:'flex', flexDirection:'column', gap:'10px' } },
              e('a', { href:`mailto:${active.email}`, style:{ display:'flex', alignItems:'center', gap:'10px', fontSize:'13px', color:'#3A342C', fontFamily:"'DM Sans',sans-serif", textDecoration:'none' } },
                e('div', { style:{ width:'30px', height:'30px', borderRadius:'7px', background:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 } }, e(Ico,{name:'mail',size:13})),
                active.email,
              ),
              e('a', { href:`tel:${active.phone.replace(/[\s()\-]/g,'')}`, style:{ display:'flex', alignItems:'center', gap:'10px', fontSize:'13px', color:'#3A342C', fontFamily:"'DM Sans',sans-serif", textDecoration:'none' } },
                e('div', { style:{ width:'30px', height:'30px', borderRadius:'7px', background:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 } }, e(Ico,{name:'phone',size:13})),
                active.phone,
              ),
            ),
          ),
        ),
      ),
      document.body
    ),
  );
}

function InsightsPage({ setPage, lang, t }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const [activeTag, setActiveTag] = React.useState(isDE ? 'Alle' : 'All');
  const [showAdd, setShowAdd] = React.useState(false);
  const [adminPass, setAdminPass] = React.useState('');
  const [adminOK, setAdminOK] = React.useState(false);
  const [np, setNp] = React.useState({ tag:'GmbH', title:'', excerpt:'', photo:'', date: new Date().toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'}) });
  const [posts, setPosts] = React.useState(() => []);
  const cats = isDE ? ['Alle','GmbH','Holdingstrukturen','E-Commerce','International','Unternehmer','Immobilien','Digitalisierung'] : ['All','GmbH','Holding structures','E-Commerce','International','Entrepreneurs','Real estate','Digitalisation'];
  const filtered = (activeTag === 'Alle' || activeTag === 'All') ? posts : posts.filter(p => p.tag === activeTag);
  const addPost = () => {
    if (!np.title) return;
    setPosts(prev => [{...np, id:Date.now(), color:prev.length%3===0?'var(--accent-subtle)':'var(--cream)'}, ...prev]);
    setNp({ tag:'GmbH', title:'', excerpt:'', photo:'', date:new Date().toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'}) });
    setShowAdd(false);
  };
  const delPost = (id) => { if(window.confirm(isDE?'Beitrag löschen?':'Delete post?')) setPosts(prev=>prev.filter(p=>p.id!==id)); };
  return e('div', { className:'page-enter' },
    e(PageHero, { label:t.insightsPageLabel,
      fit:true,
      title:t.insightsPageH1a,
      accent:t.insightsPageH1b,
      subtitle:isDE?['Steuerliches Expertenwissen für wachstumsorientierte','Unternehmer – strukturiert, verständlich und praxisnah.']:['Expert tax knowledge for growth-oriented','entrepreneurs – structured, accessible and practical.']
    }),
    e('section', { style:{ backgroundColor:'white', borderBottom:'1px solid var(--border)', paddingTop:'40px', paddingBottom:'20px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8', style:{ display:'flex', flexWrap:'wrap', gap:'8px' } },
        cats.map(c => e('button', { key:c, onClick:()=>setActiveTag(c), style: activeTag===c ? { backgroundColor:'var(--accent)', color:'#fff', padding:'8px 16px', borderRadius:'999px', fontSize:'14px', fontWeight:500, fontFamily:"'DM Sans',sans-serif", border:'none', cursor:'pointer' } : { backgroundColor:'var(--offwhite)', color:'var(--muted)', padding:'8px 16px', borderRadius:'999px', fontSize:'14px', fontWeight:500, fontFamily:"'DM Sans',sans-serif", border:'none', cursor:'pointer' } }, c))
      ),
    ),
    e('section', { style:{ backgroundColor:'white', borderBottom:'1px solid var(--border)', padding:'10px 0' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8', style:{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' } },
        !adminOK
          ? e(React.Fragment, null,
              e('input', { type:'password', placeholder:isDE?'Admin-Code':'Admin code', value:adminPass, onChange:ev=>setAdminPass(ev.target.value), style:{ padding:'8px 12px', border:'1.5px solid var(--border)', borderRadius:'10px', fontSize:'13px', fontFamily:"'DM Sans',sans-serif", width:'100%', maxWidth:'210px', outline:'none' } }),
              e('button', { onClick:()=>{ if(adminPass==='Holzmarkt2/2a')setAdminOK(true); else alert(isDE?'Falscher Code':'Wrong code'); }, style:{ padding:'8px 16px', borderRadius:'10px', background:'var(--accent)', color:'white', border:'none', cursor:'pointer', fontSize:'13px', fontFamily:"'DM Sans',sans-serif" } }, isDE?'Freischalten':'Unlock'),
            )
          : e(React.Fragment, null,
              e('span', { style:{ fontSize:'12px', color:'var(--accent)', fontFamily:"'DM Sans',sans-serif", fontWeight:600 } }, '✓ ' + (isDE?'Admin aktiv':'Admin active')),
              e('button', { onClick:()=>setShowAdd(s=>!s), style:{ padding:'8px 14px', borderRadius:'10px', background:'var(--accent)', color:'white', border:'none', cursor:'pointer', fontSize:'13px', fontFamily:"'DM Sans',sans-serif" } }, isDE?'+ Neuer Beitrag':'+ New post'),
              e('button', { onClick:()=>setAdminOK(false), style:{ padding:'8px 14px', borderRadius:'10px', background:'var(--offwhite)', color:'var(--muted)', border:'1px solid var(--border)', cursor:'pointer', fontSize:'13px', fontFamily:"'DM Sans',sans-serif" } }, isDE?'Abmelden':'Log out'),
            )
      ),
    ),
    adminOK && showAdd && e('section', { style:{ backgroundColor:'var(--offwhite)', padding:'28px 0' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { style:{ background:'white', borderRadius:'16px', padding:'28px', border:'1px solid var(--border)' } },
          e('h3', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.4rem', color:'#1A1917', marginBottom:'20px' } }, isDE?'Neuen Beitrag anlegen':'Create new post'),
          e('div', { className:'grid-resp-2', style:{ display:'grid', gap:'14px', marginBottom:'14px' } },
            e('div', null, e('label', { className:'flabel' }, isDE?'Titel *':'Title *'), e('input', { type:'text', value:np.title, onChange:ev=>setNp(p=>({...p,title:ev.target.value})), className:'finput', placeholder:isDE?'Beitragstitel ...':'Post title ...' })),
            e('div', null, e('label', { className:'flabel' }, isDE?'Kategorie':'Category'), e('select', { value:np.tag, onChange:ev=>setNp(p=>({...p,tag:ev.target.value})), className:'finput' }, ['GmbH','Holdingstrukturen','E-Commerce','International','Unternehmer','Immobilien','Digitalisierung'].map(c=>e('option',{key:c,value:c},c)))),
          ),
          e('div', { style:{ marginBottom:'14px' } },
            e('label', { className:'flabel' }, isDE?'Titelbild (optional)':'Cover image (optional)'),
            e('input', { type:'file', accept:'image/*', onChange:ev=>{
              const file = ev.target.files && ev.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => setNp(p=>({...p, photo: reader.result}));
              reader.readAsDataURL(file);
            }, style:{ fontSize:'13px', fontFamily:"'DM Sans',sans-serif" } }),
            np.photo && e('img', { src:np.photo, style:{ marginTop:'8px', height:'60px', borderRadius:'8px', objectFit:'cover' } }),
          ),
          e('div', { style:{ marginBottom:'14px' } }, e('label', { className:'flabel' }, isDE?'Kurzbeschreibung':'Excerpt'), e('textarea', { value:np.excerpt, onChange:ev=>setNp(p=>({...p,excerpt:ev.target.value})), rows:3, className:'finput', style:{resize:'vertical'} })),
          e('div', { style:{ display:'flex', gap:'10px' } },
            e('button', { onClick:addPost, style:{ padding:'10px 20px', borderRadius:'999px', background:'var(--accent)', color:'white', border:'none', cursor:'pointer', fontSize:'14px', fontFamily:"'DM Sans',sans-serif" } }, isDE?'Hinzufügen':'Add'),
            e('button', { onClick:()=>setShowAdd(false), style:{ padding:'10px 20px', borderRadius:'999px', background:'transparent', color:'var(--muted)', border:'1.5px solid var(--border)', cursor:'pointer', fontSize:'14px', fontFamily:"'DM Sans',sans-serif" } }, isDE?'Abbrechen':'Cancel'),
          ),
        ),
      ),
    ),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
        filtered.length > 0 ? filtered.map((p,i) => e('div', { key:String(p.id||i), className:'bg-white rounded-2xl overflow-hidden flex flex-col card-hover fade-up', style:{ transitionDelay:`${i*60}ms`, boxShadow:'0 1px 3px rgba(0,0,0,.05)', border:'1px solid var(--border)', position:'relative' } },
          p.photo
            ? e('div', { className:'h-44', style:{ backgroundImage:'url('+p.photo+')', backgroundSize:'cover', backgroundPosition:'center' } })
            : e('div', { className:'img-placeholder h-44' },
                e('svg',{width:26,height:26,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.5,strokeLinecap:'round'},e('path',{d:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8'})),
                e('span', null, p.tag),
              ),
          adminOK && e('button', { onClick:()=>delPost(p.id||i), style:{ position:'absolute', top:'8px', right:'8px', background:'rgba(255,255,255,.92)', border:'none', borderRadius:'8px', padding:'4px 8px', fontSize:'12px', cursor:'pointer', color:'#e53e3e' } }, '×'),
          e('div', { className:'p-7 flex flex-col flex-1' },
            e('span', { className:'tag mb-4 self-start' }, p.tag),
            e('h2', { style:{ fontSize:'15px', fontWeight:600, lineHeight:1.4, marginBottom:'10px', flex:1, color:'#1A1917', fontFamily:"'DM Sans',sans-serif" } }, p.title),
            p.excerpt && e('p', { style:{ fontSize:'13px', lineHeight:1.6, marginBottom:'18px', color:'var(--muted)', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' } }, p.excerpt),
            e('div', { style:{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'14px', borderTop:'1px solid var(--border)' } },
              e('span', { style:{ fontSize:'12px', color:'var(--subtle)', fontFamily:"'DM Sans',sans-serif" } }, p.date),
              e('span', { style:{ fontSize:'12px', fontWeight:500, display:'flex', alignItems:'center', gap:'4px', color:'var(--accent)', fontFamily:"'DM Sans',sans-serif" } }, t.insightsPageRead, e(Ico,{name:'arrowRight',size:13})),
            ),
          ),
        )) : e('p', { style:{ fontSize:'14px', textAlign:'center', padding:'48px', color:'var(--muted)', gridColumn:'1/-1' } }, isDE?'Derzeit noch keine Beiträge.':'No posts yet.'),
      ),
    ),
  );
}

function KarriereBewerbungsform({ lang, isDE }) {
  const [frm, setFrm] = React.useState({ name:'', email:'', pos:'', msg:'' });
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const s = (k,v) => setFrm(f=>({...f,[k]:v}));
  const submit = async () => { if (!frm.name || !frm.email) return; setBusy(true); await new Promise(r=>setTimeout(r,700)); setBusy(false); setSent(true); };
  if (sent) return e('div', { style:{ textAlign:'center',padding:'24px' } },
    e('div', { style:{ width:'48px',height:'48px',borderRadius:'50%',backgroundColor:'var(--accent-subtle)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px' } }, e(Ico,{name:'checkCircle',size:22})),
    e('h4', { style:{ fontFamily:"'Cormorant Garamond',serif",fontSize:'1.4rem',color:'#1A1917',marginBottom:'8px' } }, isDE?'Vielen Dank!':'Thank you!'),
    e('p', { style:{ fontSize:'13px',color:'var(--muted)',fontFamily:"'DM Sans',sans-serif" } }, isDE?'Wir melden uns schnellstmöglich.':'We will be in touch soon.'),
  );
  return e('div', { style:{ display:'flex',flexDirection:'column',gap:'14px' } },
    e('div', { className:'grid-resp-2', style:{ display:'grid',gap:'12px' } },
      e('div',null,e('label',{className:'flabel'},isDE?'Name *':'Name *'),e('input',{type:'text',value:frm.name,onChange:ev=>s('name',ev.target.value),className:'finput',placeholder:isDE?'Ihr Name':'Your name'})),
      e('div',null,e('label',{className:'flabel'},'E-Mail *'),e('input',{type:'email',value:frm.email,onChange:ev=>s('email',ev.target.value),className:'finput',placeholder:'ihre@email.de'})),
    ),
    e('div',null,
      e('label',{className:'flabel'},isDE?'Gewünschte Stelle':'Position'),
      e('select',{value:frm.pos,onChange:ev=>s('pos',ev.target.value),className:'finput'},
        e('option',{value:''},isDE?'Bitte auswählen':'Please select'),
        e('option',{value:'Steuerfachangestellte/r'},isDE?'Steuerfachangestellte/r':'Tax assistant'),
        e('option',{value:'Steuerfachwirt/in'},isDE?'Steuerfachwirt/in':'Senior tax assistant'),
        e('option',{value:'Werkstudent/in'},isDE?'Werkstudent/in':'Working student'),
        e('option',{value:'Initiativbewerbung'},isDE?'Initiativbewerbung':'Speculative application'),
      ),
    ),
    e('div',null,
      e('label',{className:'flabel'},isDE?'Anschreiben (max. 500 Zeichen)':'Cover note (max. 500 chars)'),
      e('textarea',{value:frm.msg,onChange:ev=>s('msg',ev.target.value),rows:3,className:'finput',style:{resize:'vertical'},maxLength:500}),
      e('p',{style:{fontSize:'11px',textAlign:'right',color:frm.msg.length>480?'#e53e3e':'var(--subtle)',fontFamily:"'DM Sans',sans-serif",marginTop:'4px'}},frm.msg.length+'/500'),
    ),
    e('button',{onClick:submit,disabled:busy,style:{padding:'11px 24px',borderRadius:'999px',backgroundColor:'var(--accent)',color:'white',border:'none',cursor:'pointer',fontSize:'14px',fontFamily:"'DM Sans',sans-serif",alignSelf:'flex-start'}},busy?(isDE?'Bitte warten...':'Please wait...'):(isDE?'Bewerbung absenden':'Submit application')),
    e('p',{style:{fontSize:'11px',color:'var(--subtle)',fontFamily:"'DM Sans',sans-serif"}},isDE?'Wird direkt an karriere@nsbb.de weitergeleitet.':'Forwarded to karriere@nsbb.de.'),
  );
}
function KarrierePage({ setPage, lang, t }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const benefits = t.karriereBenefits;
  const positions = t.karrierePositions;
  const steps = t.karriereSteps;

  return e('div', { className:'page-enter' },
    e(PageHero, { label:t.karriereLabel,
      fit:true,
      title:t.karriereH1a,
      accent:t.karriereH1b,
      subtitle:isDE?['Wir sind eine moderne, vollständig digitale Kanzlei','mit persönlicher Atmosphäre und echten Perspektiven.']:['We are a modern, fully digital firm with a','personal atmosphere and genuine opportunities.']
    }),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'max-w-xl mb-8 fade-up' },
          e('p', { className:'label mb-4' }, t.karriereCultureLabel),
          e('h2', { className:'font-display mb-4', style:{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, t.karriereCultureH2),
        ),
        e('div', { className:'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' },
          benefits.map(function(b, i) {
            return e('div', { key:b.t, className:'fade-up rounded-2xl p-5', style:{ backgroundColor:'var(--offwhite)', transitionDelay:(i*60)+'ms' } },
              e('div', { className:'mb-3', style:{ color:'var(--accent)' } },
                e(Ico, {name:b.icon, size:28})
              ),
              e('h3', { className:'font-medium mb-1', style:{ fontSize:'15px', color:'#1A1917', fontFamily:"'DM Sans',sans-serif" } }, b.t),
              e('p', { className:'text-sm leading-relaxed' }, b.d),
            );
          })
        ),
      ),
    ),
    e('section', { className:'py-20', style:{ backgroundColor:'var(--offwhite)' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'max-w-xl mb-8 fade-up' },
          e('p', { className:'label mb-4' }, t.karrierePositionsLabel),
          e('h2', { className:'font-display', style:{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, t.karrierePositionsH2),
        ),
        e('div', { className:'space-y-2' },
          positions.map(function(p, i) {
            return e('div', { key:p.t, className:'fade-up bg-white rounded-2xl p-4 flex items-center justify-between gap-4', style:{ transitionDelay:(i*60)+'ms', cursor:'pointer' }, onClick:function(){ setPage(p.route); } },
              e('div', null,
                e('p', { style:{ fontSize:'17px', fontWeight:500, color:'#1A1917', fontFamily:"'DM Sans',sans-serif", marginBottom:'4px' } }, p.t),
                e('p', { style:{ fontSize:'13px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif" } }, p.typ + ' · ' + p.loc),
              ),
              e('div', { style:{ display:'flex', alignItems:'center', gap:'6px', color:'var(--accent)', fontSize:'13px', fontWeight:600, fontFamily:"'DM Sans',sans-serif", flexShrink:0 } },
                isDE ? 'Mehr erfahren' : 'Learn more',
                e(Ico, {name:'arrowRight', size:14}),
              ),
            );
          })
        ),
      ),
    ),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'max-w-xl mb-16 fade-up' },
          e('p', { className:'label mb-4' }, isDE ? 'Bewerbungsprozess' : 'Application process'),
          e('h2', { className:'font-display', style:{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, isDE ? 'Einfach. Schnell. Persönlich.' : 'Simple. Fast. Personal.'),
        ),
        e('div', { className:'grid grid-cols-1 sm:grid-cols-2 gap-6' },
          steps.map(function(s, i) {
            return e('div', { key:s.s, className:'fade-up', style:{ transitionDelay:(i*80)+'ms' } },
              e('p', { className:'step-num mb-1' }, s.s),
              e('h3', { className:'font-display mb-3', style:{ fontSize:'1.3rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, s.t),
              e('p', { className:'text-sm leading-relaxed' }, s.d),
            );
          })
        ),
      ),
    ),
    e(ContactCTA, { setPage, t }),
  );
}


function NachfolgePage({ setPage, lang, t }) {
  useScrollAnim();
  var isDE = lang === 'DE';
  var steps = t.nachfolgeSteps;
  var proofs = t.nachfolgeProofs;
  return e('div', { className:'page-enter' },
    e(PageHero, { label:t.nachfolgeLabel,
      fit: true,
      title: isDE ? 'Ihre Nachfolge' : 'Your Succession',
      accent: isDE ? 'in guten Händen.' : 'in Good Hands.',
      subtitle: isDE
        ? ['Sie denken an die Übergabe Ihrer Kanzlei?', 'Wir begleiten diesen Prozess mit Sorgfalt und Diskretion.']
        : ['Thinking about handing over your practice?', 'We guide this process with care and discretion.']
    }),
    e('section', { className:'py-12 bg-white', style:{ borderBottom:'1px solid var(--border)' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'flex flex-col md:flex-row items-start md:items-center gap-6 fade-up' },
          e('div', { className:'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', style:{ backgroundColor:'var(--accent-subtle)' } }, e(Ico,{name:'shield',size:22})),
          e('div', null,
            e('p', { className:'label mb-1' }, t.nachfolgeDiscrLabel),
            e('h2', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.2rem,2.5vw,1.6rem)', fontWeight:500, color:'#1A1917', lineHeight:1.25, marginBottom:'6px' } },
              e(React.Fragment, null,
                e('span',{style:{whiteSpace:'nowrap'}}, isDE?'Absolute Vertraulichkeit. Von der ersten Anfrage bis':'Absolute confidentiality. From the first enquiry'), e('br'),
                e('span',{style:{whiteSpace:'nowrap'}}, isDE?'zur erfolgreichen Übergabe.':'to a successful handover.')
              )
            ),
            e('p', { style:{ fontSize:'14px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", lineHeight:1.7 } }, t.nachfolgeDiscrText),
          ),
        ),
      ),
    ),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 gap-10' },
        e('div', { className:'fade-up' },
          e('p', { className:'label mb-4' }, t.nachfolgeExpLabel),
          e('h2', { className:'font-display mb-6', style:{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, t.nachfolgeExpH2),
          e('div', { className:'fade-up', style:{ backgroundColor:'var(--accent-subtle)', borderRadius:'12px', padding:'10px 12px 12px', textAlign:'center', marginBottom:'20px' } },
            e('p', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2.6rem', fontWeight:400, color:'var(--accent)', lineHeight:1, marginBottom:'10px' } }, '5'),
            e('p', { style:{ fontFamily:"'DM Sans',sans-serif", fontSize:'12px', fontWeight:500, color:'#3A342C', lineHeight:1.4 } }, isDE ? 'erfolgreich integrierte Kanzleien seit 2014' : 'successfully integrated practices since 2014'),
          ),
          e('p', { className:'text-base leading-relaxed mb-2' }, isDE
            ? 'Seit 2014 übernimmt und integriert NSBB erfolgreich Steuerkanzleien. Neben der ersten übernommenen Kanzlei wurden inzwischen vier weitere Kanzleien erfolgreich in die NSBB-Strukturen integriert.'
            : 'Since 2014, NSBB has been successfully acquiring and integrating tax practices. Four further practices have since been fully integrated into the NSBB structure.'
          ),
        ),
        e('ul', { className:'space-y-0 fade-up', style:{ transitionDelay:'120ms' } },
          proofs.map(function(p) { return e('li', { key:p, className:'flex items-center gap-4 text-sm font-medium py-4 border-b last:border-0', style:{ borderColor:'var(--border)', color:'var(--text)', fontFamily:"'DM Sans',sans-serif" } }, e(Ico,{name:'checkCircle',size:18}), p); })
        ),
      ),
    ),
    e('section', { style:{ backgroundColor:'white', paddingTop:'9px', paddingBottom:'30px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'max-w-2xl mx-auto text-center fade-up' },
          e('p', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.1rem,2vw,1.35rem)', fontWeight:400, color:'#3A342C', lineHeight:1.7, fontStyle:'italic', marginBottom:'0' } },
            isDE ? '\u201eEine Kanzleinachfolge ist mehr als eine Transaktion. Sie betrifft Mandanten, Mitarbeitende und gewachsene Beziehungen. Deshalb setzen wir auf einen strukturierten, persönlichen und langfristig orientierten Übergang \u2013 mit direkter Begleitung durch die Geschäftsführung.\u201c'
                 : '\u201eA practice succession is more than a transaction. It affects clients, staff and long-standing relationships. That is why we take a structured, personal and long-term approach.\u201c'
          ),
        ),
      ),
    ),
    e('section', { className:'py-20', style:{ backgroundColor:'var(--offwhite)' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'max-w-xl mb-6 fade-up' },
          e('p', { className:'label mb-4' }, t.nachfolgeProzessLabel),
          e('h2', { className:'font-display', style:{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, t.nachfolgeProzessH2)
        ),
        e('div', { className:'grid grid-cols-1 sm:grid-cols-2 gap-6' },
          steps.map(function(s, i) { return e('div', { key:s.s, className:'fade-up', style:{ transitionDelay:(i*80)+'ms' } },
            e('p', { className:'step-num mb-1' }, s.s),
            e('h3', { className:'font-display mb-3', style:{ fontSize:'1.3rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, s.t),
            e('p', { className:'text-sm leading-relaxed' }, s.d)
          ); })
        ),
      ),
    ),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'text-center rounded-3xl p-10 md:p-16 lg:p-20 fade-up', style:{ backgroundColor:'var(--offwhite)' } },
          e('div', { className:'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6', style:{ backgroundColor:'var(--accent-subtle)' } }, e(Ico,{name:'shield',size:24})),
          e('p', { className:'label mb-4' }, t.nachfolgeCtaLabel),
          e('h2', { className:'font-display mb-6 max-w-2xl mx-auto', style:{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, t.nachfolgeCtaH2),
          e('p', { className:'text-base leading-relaxed mb-8 max-w-md mx-auto' }, t.nachfolgeCtaText),
          e('div', { className:'flex flex-col sm:flex-row gap-3 justify-center items-center' },
            e('a', { href:'mailto:nachfolge@nsbb.de?subject=Vertrauliche%20Anfrage%20zur%20Kanzleinachfolge', className:'btn-p', style:{ textDecoration:'none' } }, e(Ico,{name:'mail',size:15}), t.nachfolgeCtaBtn),
          ),
        ),
      ),
    ),
  );
}

function KontaktPage({ setPage, lang, t, kontaktPreset, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  useEffect(() => { if (kontaktPreset && setKontaktPreset) setKontaktPreset(null); }, []);

  // ── Sequential inquiry counter (localStorage, separate per category) ──
  const getNextNr = (category) => {
    try {
      const key = 'nsbb_anfrage_nr_' + category;
      const n = parseInt(localStorage.getItem(key) || '0') + 1;
      localStorage.setItem(key, String(n));
      return n;
    } catch(e) { return Math.floor(Math.random()*900)+100; }
  };
  const fmtDate = () => {
    const d = new Date();
    return d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'}) + ', ' + d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}) + ' Uhr';
  };

  // ── State ───────────────────────────────────────────────────
  const [stage, setStage] = useState(() => (kontaktPreset && kontaktPreset.stage) ? kontaktPreset.stage : 'choose');
  const [tab, setTab] = useState(() => (kontaktPreset && kontaktPreset.tab) ? kontaktPreset.tab : null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    email:'', phone:'', rechtsform:'', umsatz:'', mitarbeiter:'', branche:'',
    leistung:'', einkunftsarten:[], steuerjahr:'', sonstiges:'', ansaessigkeit:'',
    sachverhalt:'', sachverhaltIntlTyp:'', intlPersonType:'privat', sachverhaltPrivat:'', sonstigePrivat:'', sonstigeAnmerkungen:'', veranlagungsjahr:'', sonstigeRechtsform:'', datenschutz:false,
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const toggleEA = (v) => set('einkunftsarten', form.einkunftsarten.includes(v) ? form.einkunftsarten.filter(x=>x!==v) : [...form.einkunftsarten, v]);

  const goTo = (type, nextStage) => { setTab(type); setStage(nextStage); window.scrollTo(0,390); };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = isDE ? 'E-Mail-Adresse erforderlich' : 'Email address required';
    if (!form.datenschutz) e.datenschutz = isDE ? 'Bitte Datenschutzerklärung bestätigen' : 'Please accept the privacy policy';
    if (tab==='unternehmen') {
      if (!form.rechtsform) e.rechtsform = isDE ? 'Bitte Rechtsform angeben' : 'Please select legal form';
      if (form.rechtsform==='Sonstige' && !form.sonstigeRechtsform) e.sonstigeRechtsform = isDE ? 'Bitte beschreiben' : 'Please describe';
      if (!form.umsatz) e.umsatz = isDE ? 'Bitte Umsatzgröße angeben' : 'Please select revenue range';
      if (!form.leistung) e.leistung = isDE ? 'Bitte Leistung auswählen' : 'Please select a service';
      if ((form.leistung==='Sonstiges'||form.leistung==='Other') && !form.sonstiges) e.sonstiges = isDE ? 'Bitte beschreiben' : 'Please describe';
    }
    if (tab==='international') {
      if (!form.intlPersonType) e.intlPersonType = isDE ? 'Bitte auswählen' : 'Please select';
      if (form.intlPersonType==='privat' && !form.sachverhaltIntlTyp) e.sachverhaltIntlTyp = isDE ? 'Bitte Sachverhalt auswählen' : 'Please select matter';
      if (!form.sachverhalt) e.sachverhalt = isDE ? 'Bitte Sachverhalt beschreiben' : 'Please describe your matter';
    }
    if (tab==='privat') {
      if (!form.leistung) e.leistung = isDE ? 'Bitte Leistung auswählen' : 'Please select a service';
      if (!form.steuerjahr) e.steuerjahr = isDE ? 'Bitte Steuerjahr angeben' : 'Please enter the tax year';
      if (!form.ansaessigkeit) e.ansaessigkeit = isDE ? 'Bitte Ansässigkeit auswählen' : 'Please select country of residence';
      if (form.leistung && !(form.leistung==='Einkommensteuererklärung'||form.leistung==='Income tax return') && !form.sonstigePrivat) e.sonstigePrivat = isDE ? 'Bitte beschreiben' : 'Please describe';
    }
    return e;
  };

  const buildMailto = () => {
    const nr = getNextNr(tab);
    const dt = fmtDate();
    const typeLabel = tab==='unternehmen' ? (isDE?'Unternehmen':'Business') : tab==='international' ? (isDE?'Internationales Steuerrecht':'International Tax') : (isDE?'Privatpersonen':'Private individuals');
    const subj = encodeURIComponent(isDE?`Anfrage ${typeLabel} (${nr})`:`Inquiry ${typeLabel} (${nr})`);
    let body = isDE
      ? `Anfrage #${nr}\nDatum: ${dt}\nArt: ${typeLabel}\n\n`
      : `Inquiry #${nr}\nDate: ${dt}\nType: ${typeLabel}\n\n`;
    body += `E-Mail: ${form.email}\n`;
    if (form.phone) body += (isDE?`Telefon: `:`Phone: `) + form.phone + '\n';
    if (tab==='unternehmen') {
      if (form.rechtsform) body += (isDE?`Rechtsform: `:`Legal form: `) + form.rechtsform + (form.sonstigeRechtsform?` (${form.sonstigeRechtsform})`:'') + '\n';
      if (form.umsatz) body += (isDE?`Umsatz: `:`Revenue: `) + form.umsatz + '\n';
      if (form.mitarbeiter) body += (isDE?`Mitarbeiter: `:`Employees: `) + form.mitarbeiter + '\n';
      if (form.branche) body += (isDE?`Branche: `:`Industry: `) + form.branche + '\n';
      if (form.leistung) body += (isDE?`Gewünschte Leistung: `:`Service: `) + form.leistung + '\n';
      if (form.sonstiges) body += (isDE?`Kurze Beschreibung: `:`Brief description: `) + form.sonstiges + '\n';
    }
    if (tab==='international') {
      body += (isDE?`Typ: `:`Type: `) + (form.intlPersonType==='privat'?(isDE?'Privatperson':'Private individual'):(isDE?'Unternehmen':'Business')) + '\n';
      if (form.intlPersonType==='privat' && form.sachverhaltIntlTyp) body += (isDE?`Art des Sachverhalts: `:`Matter type: `) + form.sachverhaltIntlTyp + '\n';
      if (form.sachverhalt) body += (isDE?`Kurze Beschreibung: `:`Brief description: `) + form.sachverhalt + '\n';
    }
    if (tab==='privat') {
      if (form.einkunftsarten.length) body += (isDE?`Einkunftsarten: `:`Income types: `) + form.einkunftsarten.join(', ') + '\n';
      if (form.steuerjahr) body += (isDE?`Steuerjahr: `:`Tax year: `) + form.steuerjahr + '\n';
      if (form.ansaessigkeit) body += (isDE?`Ansässigkeit: `:`Residence: `) + form.ansaessigkeit + '\n';
      if (form.leistung) body += (isDE?`Gewünschte Leistung: `:`Service: `) + form.leistung + '\n';
      if (form.sonstigePrivat) body += (isDE?`Kurze Beschreibung: `:`Brief description: `) + form.sonstigePrivat + '\n';
    }
    return `mailto:mandant@nsbb.de?subject=${subj}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    const mailto = buildMailto();
    window.location.href = mailto;
    setTimeout(() => setSubmitted(true), 800);
  };

  // ── Input helpers ───────────────────────────────────────────
  const inp = (name, label, type='text', placeholder='', req=true) =>
    e('div', null,
      e('label', { className:'flabel' }, label, req && e('span', { style:{ color:'var(--accent)' } }, ' *')),
      e('input', { type, value:form[name], onChange:ev=>set(name,ev.target.value), placeholder, className:'finput' }),
      errors[name] && e('p', { className:'ferr' }, errors[name]),
    );
  const sel = (name, label, opts) =>
    e('div', null,
      e('label', { className:'flabel' }, label, e('span', { style:{ color:'var(--accent)' } }, ' *')),
      e('select', { value:form[name], onChange:ev=>set(name,ev.target.value), className:'finput' },
        e('option', { value:'' }, isDE?'Bitte auswählen ...':'Please select ...'),
        opts.map(o => e('option', { key:o, value:o }, o)),
      ),
      errors[name] && e('p', { className:'ferr' }, errors[name]),
    );

  // ── Unified "Kurze Beschreibung" field ─────────────────────
  // Always max. 1000 characters, discreet "X von 1000" counter bottom-right.
  // Optional by default; mandatory (star) only where required (e.g. "Sonstiges").
  const MAXLEN = 1000;
  const descField = (name, req) =>
    e('div', null,
      e('label', { className:'flabel' },
        isDE?'Kurze Beschreibung':'Brief description',
        req
          ? e('span', { style:{ color:'var(--accent)' } }, ' *')
          : e('span', { style:{ color:'var(--subtle)', fontWeight:400 } }, isDE?' (optional)':' (optional)')
      ),
      e('textarea', { value:form[name], onChange:ev=>set(name, ev.target.value.slice(0,MAXLEN)), rows:4, maxLength:MAXLEN, className:'finput', style:{ resize:'vertical', minHeight:'110px' } }),
      e('p', { style:{ fontSize:'11px', textAlign:'right', color:(form[name]||'').length>=MAXLEN?'#e53e3e':'var(--subtle)', fontFamily:"'DM Sans',sans-serif", marginTop:'4px' } }, (form[name]||'').length + (isDE?' von ':' of ') + MAXLEN),
      errors[name] && e('p', { className:'ferr' }, errors[name]),
    );

  // ── Location data ───────────────────────────────────────────
  const locs = [
    { city:'Berlin', googleBusiness: null, /* TODO: replace null with your Google Business URL e.g. 'https://g.page/nsbb-berlin' */ anfahrt: { de:'S-Bahn: Linie S1 bis Zehlendorf (ca. 5 Min. Fußweg). Bus: M48/X10 Haltestelle Berlepschstraße. Parken: kostenfreie Parkplätze vor dem Gebäude verfügbar.', en:'S-Bahn: Line S1 to Zehlendorf (approx. 5 min walk). Bus: M48/X10 stop Berlepschstraße. Parking: free parking spaces available at the building.' }, img:'assets/images/standort-berlin.webp', addr:'Berlepschstr. 1\n14165 Berlin', tel:'+49 (0) 30 815 80 93', href:'tel:+493081580930', mapSrc:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2432!2d13.2487!3d52.4367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBerlepschstr.+1%2C+14165+Berlin!5e0!3m2!1sde!2sde!4v1700000000000!5m2!1sde!2sde' },
    { city:'Köln', googleBusiness: null, /* TODO: replace null with your Google Business URL e.g. 'https://g.page/nsbb-koeln' */ anfahrt: { de:'U-Bahn: Linie 3/4 bis Heumarkt (ca. 8 Min. Fußweg). S-Bahn: Köln Hauptbahnhof (ca. 10 Min. Fußweg). Parken: Tiefgaragenstellplätze stehen direkt unter unserem Gebäude zur Verfügung.', en:'Metro: Line 3/4 to Heumarkt (approx. 8 min walk). S-Bahn: Cologne Central Station (approx. 10 min walk). Parking: Underground parking spaces are available directly below our building.' }, img:'assets/images/standort-koeln.webp', addr:'Holzmarkt 2/2A\n50676 Köln', tel:'+49 (0) 221 973 064 0', href:'tel:+492219730640', mapSrc:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2513!2d6.9670!3d50.9282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sHolzmarkt+2%2C+50676+K%C3%B6ln!5e0!3m2!1sde!2sde!4v1700000000000!5m2!1sde!2sde' },
  ];

  const directContacts = [
    { n:'phone', t:'Berlin', v:'+49 (0) 30 815 80 93', href:'tel:+493081580930' },
    { n:'phone', t:'Köln', v:'+49 (0) 221 973 064 0', href:'tel:+492219730640' },
    { n:'mail', t:'E-Mail', v:'info@nsbb.de', href:'mailto:info@nsbb.de' },
  ];

  // ── Type selector (Stage 1) ─────────────────────────────────
  const typeCards = [
    { key:'unternehmen', icon:'building', title:isDE?'Unternehmen':'Business', desc:isDE?'GmbHs, Kapitalgesellschaften, Personengesellschaften und Einzelunternehmen.':'GmbHs, corporations, partnerships and sole traders.', next:'form' },
    { key:'international', icon:'globe', title:isDE?'Internationales Steuerrecht':'International Tax', desc:isDE?'Internationale Sachverhalte, Auslandseinkünfte, Wegzug, Unternehmensstrukturen und grenzüberschreitende Besteuerung.':'International matters, foreign income, exit taxation, corporate structures and cross-border taxation.', next:'form' },
    { key:'privat', icon:'user', title:isDE?'Privatpersonen':'Private individuals', desc:isDE?'Einkommensteuer, Immobilien, Erbschaft, Schenkung und Vermögensnachfolge.':'Income tax, real estate, inheritance, gifts and wealth succession. tax advice.', next:'form' },
  ];

  return e('div', { className:'page-enter' },
    e(PageHero, { label:t.kontaktLabel,
      fit:true,
      title:t.kontaktH1a,
      accent:t.kontaktH1b,
      subtitle:isDE?['Schildern Sie uns Ihr Anliegen – wir melden uns','persönlich und besprechen den nächsten Schritt.']:['Tell us about your matter – we will get back','to you personally to discuss the next step.']
    }),

    // ── STAGE: CHOOSE TYPE ──────────────────────────────────
    stage === 'choose' && e('section', { className:'py-16 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('p', { className:'label mb-6 text-center' }, isDE?'Worum geht es?':'What is your enquiry about?'),
        e('div', { className:'grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto' },
          typeCards.map(tc => e('div', { key:tc.key, className:'rounded-2xl p-8 flex flex-col card-hover cursor-pointer border', style:{ borderColor:'var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,.04)', backgroundColor:'white' }, onClick:()=>goTo(tc.key, tc.next) },
            e('div', { style:{ width:'44px', height:'44px', borderRadius:'12px', backgroundColor:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'16px' } }, e(Ico,{name:tc.icon,size:20})),
            e('h3', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.25rem', color:'#1A1917', marginBottom:'8px', fontWeight:400 } }, tc.title),
            e('p', { style:{ fontSize:'13px', lineHeight:1.6, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", flex:1 } }, tc.desc),
            e('div', { style:{ display:'flex', alignItems:'center', gap:'6px', marginTop:'16px', fontSize:'13px', fontWeight:500, color:'var(--accent)', fontFamily:"'DM Sans',sans-serif" } }, isDE?'Anfrage starten':'Start enquiry', e(Ico,{name:'arrowRight',size:14})),
          ))
        ),
      ),
    ),

    // ── STAGE: FORM ─────────────────────────────────────────
    stage === 'form' && e('section', { className:'py-16 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start' },

        // Left: form
        e('div', null,
          e('button', { onClick:()=>setStage('choose'), style:{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", background:'none', border:'none', cursor:'pointer', marginBottom:'24px' } }, e(Ico,{name:'arrowRight',size:13}), isDE?'Zurück':'Back'),
          e('div', { style:{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'24px' } },
            e('div', { style:{ padding:'4px 12px', borderRadius:'999px', backgroundColor:'var(--accent-subtle)', fontSize:'12px', fontWeight:600, color:'var(--accent)', fontFamily:"'DM Sans',sans-serif" } },
              tab==='unternehmen' ? (isDE?'Unternehmen':'Business') : tab==='international' ? (isDE?'Internationales Steuerrecht':'International Tax') : (isDE?'Privatperson':'Private')
            ),
          ),

          submitted
            ? e('div', { className:'text-center py-12' },
                e('div', { style:{ width:'56px', height:'56px', borderRadius:'50%', backgroundColor:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' } }, e(Ico,{name:'checkCircle',size:24})),
                e('h3', { className:'font-display mb-3', style:{ fontSize:'1.5rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, isDE?'Vielen Dank!':'Thank you!'),
                e('p', { style:{ fontSize:'14px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif" } }, isDE?'Ihre Anfrage wurde vorbereitet. Bitte senden Sie die geöffnete E-Mail ab.':'Your enquiry has been prepared. Please send the email that has opened.'),
              )
            : e('div', { className:'space-y-5' },

                // Common fields
                e('div', { className:'grid grid-cols-1 md:grid-cols-2 gap-4' },
                  inp('email','E-Mail','email',isDE?'ihre@email.de':'your@email.com'),
                  inp('phone',isDE?'Telefon':'Phone','tel','+49 ...', false),
                ),

                // UNTERNEHMEN fields
                tab === 'unternehmen' && e(React.Fragment, null,
                  e('div', { className:'grid grid-cols-1 md:grid-cols-2 gap-4' },
                    sel('rechtsform', isDE?'Rechtsform':'Legal form', ['GmbH','GmbH & Co. KG','AG','UG (haftungsbeschränkt)','GbR','KG / OHG','Sonstige']),
                    sel('umsatz', isDE?'Umsatzgröße (ca.)':'Revenue (approx.)', isDE?['bis 500.000 €','500.000 € – 2 Mio. €','2 – 5 Mio. €','5 – 10 Mio. €','10 – 50 Mio. €','über 50 Mio. €']:['up to €500k','€500k – €2m','€2m – €5m','€5m – €10m','€10m – €50m','over €50m']),
                  ),
                  form.rechtsform === 'Sonstige' && e('div', null,
                    e('label', { className:'flabel' }, isDE?'Rechtsform – Bitte beschreiben':'Legal form – please describe', e('span',{style:{color:'var(--accent)'}},' *')),
                    e('input', { type:'text', value:form.sonstigeRechtsform, onChange:ev=>set('sonstigeRechtsform',ev.target.value), className:'finput', maxLength:100 }),
                    errors.sonstigeRechtsform && e('p',{className:'ferr'},errors.sonstigeRechtsform),
                  ),
                  e('div', { className:'grid grid-cols-1 md:grid-cols-2 gap-4' },
                    sel('mitarbeiter', isDE?'Mitarbeiteranzahl':'Number of employees', ['1–5','5–10','10–25','25–50','50–100','100+']),
                    inp('branche', isDE?'Branche (optional)':'Industry (optional)', 'text', isDE?'z.B. E-Commerce, Immobilien ...':'e.g. e-commerce, real estate ...', false),
                  ),
                  sel('leistung', isDE?'Gewünschte Leistung':'Service of interest', isDE?['Laufende Steuerberatung (Jahresabschluss + Steuererklärung)','Gestaltungsberatung','Betriebswirtschaftliche Beratung','Sonstiges']:['Ongoing tax advisory (annual accounts + tax return)','Structuring advisory','Business management advisory','Other']),
                  form.leistung && descField('sonstiges', form.leistung==='Sonstiges'||form.leistung==='Other'),
                ),

                // INTERNATIONAL fields
                tab === 'international' && e(React.Fragment, null,
                  e('div', { style:{ display:'flex', gap:'8px', marginBottom:'20px' } },
                    ['privat','unternehmen'].map(pt =>
                      e('button', { key:pt, type:'button', onClick:()=>set('intlPersonType',pt), style:{ padding:'8px 20px', borderRadius:'999px', fontSize:'13px', fontWeight:500, fontFamily:"'DM Sans',sans-serif", cursor:'pointer', border:'1.5px solid', borderColor: form.intlPersonType===pt?'var(--accent)':'var(--border)', backgroundColor: form.intlPersonType===pt?'var(--accent-subtle)':'transparent', color: form.intlPersonType===pt?'var(--accent)':'var(--muted)', transition:'all .2s' } },
                        pt==='privat'?(isDE?'Privatperson':'Private individual'):(isDE?'Unternehmen':'Business')
                      )
                    )
                  ),
                  form.intlPersonType==='privat' && e('div', null,
                    e('label', { className:'flabel' }, isDE?'Art des Sachverhalts':'Type of matter', e('span',{style:{color:'var(--accent)'}},' *')),
                    e('select', { value:form.sachverhaltIntlTyp, onChange:ev=>set('sachverhaltIntlTyp',ev.target.value), className:'finput' },
                      e('option',{value:''},isDE?'Bitte auswählen ...':'Please select ...'),
                      (isDE?['Ausländische Einkünfte','Wohnsitz im Ausland','Wegzugsbesteuerung','Erbschaft mit Auslandsbezug','Grenzgänger','Immobilien im Ausland','Schenkungen mit Auslandsbezug','Rückkehr nach Deutschland','Internationale Vermögensstrukturierung','Sonstige']:['Foreign income','Residence abroad','Exit taxation','Inheritance with foreign connection','Cross-border commuter','Real estate abroad','Gifts with foreign connection','Return to Germany','International wealth structuring','Other']).map(o=>e('option',{key:o,value:o},o))
                    ),
                    errors.sachverhaltIntlTyp && e('p',{className:'ferr'},errors.sachverhaltIntlTyp),
                  ),
                  // Sachverhaltsbeschreibung is always shown and always mandatory
                  descField('sachverhalt', true),
                ),
                // PRIVAT fields
                tab === 'privat' && e(React.Fragment, null,
                  e('div', null,
                    e('label', { className:'flabel' }, isDE?'Einkunftsarten (Mehrfachauswahl)':'Income types (multiple selection)'),
                    e('div', { style:{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'6px' } },
                      (isDE?['Land- und Forstwirtschaft','Gewerbebetrieb','Selbstständige Arbeit','Nichtselbstständige Arbeit','Vermietung & Verpachtung','Kapitalvermögen','Sonstige Einkünfte']:['Agriculture & forestry','Trade / business','Self-employment','Employment','Rental income','Capital income','Other income']).map(ea =>
                        e('button', { key:ea, type:'button', onClick:()=>toggleEA(ea), style:{ padding:'6px 14px', borderRadius:'999px', fontSize:'12px', fontWeight:500, fontFamily:"'DM Sans',sans-serif", cursor:'pointer', border:'1.5px solid', borderColor: form.einkunftsarten.includes(ea)?'var(--accent)':'var(--border)', backgroundColor: form.einkunftsarten.includes(ea)?'var(--accent-subtle)':'transparent', color: form.einkunftsarten.includes(ea)?'var(--accent)':'var(--muted)' } }, ea)
                      )
                    ),
                  ),
                  e('div', { className:'grid grid-cols-1 md:grid-cols-2 gap-4' },
                    e('div', null,
                      e('label', { className:'flabel' }, isDE?'Steuerjahr':'Tax year', e('span',{style:{color:'var(--accent)'}},' *')),
                      e('input', { type:'text', inputMode:'numeric', value:form.steuerjahr, onChange:ev=>set('steuerjahr',ev.target.value), placeholder:isDE?'z.B. 2024':'e.g. 2024', className:'finput', maxLength:20 }),
                      errors.steuerjahr && e('p',{className:'ferr'},errors.steuerjahr),
                    ),
                    e('div', null,
                      e('label', { className:'flabel' }, isDE?'Ansässigkeit':'Country of residence', e('span',{style:{color:'var(--accent)'}},' *')),
                      e('select', { value:form.ansaessigkeit, onChange:ev=>set('ansaessigkeit',ev.target.value), className:'finput' },
                        e('option',{value:''},isDE?'Bitte auswählen ...':'Please select ...'),
                        (isDE?['Deutschland','EU','Drittland']:['Germany','EU','Third country']).map(o=>e('option',{key:o,value:o},o))
                      ),
                      errors.ansaessigkeit && e('p',{className:'ferr'},errors.ansaessigkeit),
                    ),
                  ),
                  sel('leistung', isDE?'Gewünschte Leistung':'Service of interest', isDE?['Einkommensteuererklärung','Erbschaft- / Schenkungsteuer','Immobilienbesteuerung','Vermögensnachfolge','Kapitalanlagen','Sonstiges']:['Income tax return','Inheritance / gift tax','Real estate taxation','Wealth succession','Capital investments','Other']),
                  form.leistung && descField('sonstigePrivat', !(form.leistung==='Einkommensteuererklärung'||form.leistung==='Income tax return')),
                ),

                // Submit
                e('div', { style:{ paddingTop:'8px' } },
                  e('label', { style:{ display:'flex', alignItems:'flex-start', gap:'10px', cursor:'pointer', marginBottom:'16px' } },
                    e('input', { type:'checkbox', checked:form.datenschutz, onChange:ev=>set('datenschutz',ev.target.checked), style:{ marginTop:'3px', flexShrink:0, accentColor:'var(--accent)' }, 'aria-required':'true' }),
                    e('span', { style:{ fontSize:'12px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", lineHeight:1.5 } },
                      isDE ? 'Ich habe die ' : 'I have read the ',
                      e('button', { type:'button', onClick:()=>{setPage('datenschutz'); window.scrollTo(0,0);}, style:{ color:'var(--accent)', background:'none', border:'none', cursor:'pointer', fontSize:'12px', padding:0, textDecoration:'underline', fontFamily:"'DM Sans',sans-serif" } }, isDE?'Datenschutzerklärung':'privacy policy'),
                      isDE?' gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage zu.':' and consent to the processing of my data to handle my enquiry.'
                    )
                  ),
                  errors.datenschutz && e('p', { className:'ferr', role:'alert', 'aria-live':'polite', style:{marginTop:'-8px',marginBottom:'12px'} }, errors.datenschutz),
                  e('button', { className:'btn-p', onClick:handleSubmit, 'aria-label': isDE?'Anfrage absenden':'Send enquiry' }, e(Ico,{name:'mail',size:16}), isDE?'Anfrage absenden':'Send enquiry'),
                ),
              ),
        ),

        // Right: direct contacts + locations
        e('div', { className:'space-y-8' },
          e('div', null,
            e('p', { className:'label mb-4' }, isDE?'Direktkontakt':'Direct contact'),
            e('div', { className:'space-y-3' },
              directContacts.map(c => e('a', { key:c.t, href:c.href, target:c.n==='msgCircle'?'_blank':undefined, rel:c.n==='msgCircle'?'noopener noreferrer':undefined, style:{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', borderRadius:'12px', backgroundColor:'var(--offwhite)', textDecoration:'none', transition:'background .2s' } },
                e('div', { style:{ width:'36px', height:'36px', borderRadius:'10px', backgroundColor:'var(--accent-subtle)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 } }, e(Ico,{name:c.n,size:16})),
                e('div', null,
                  e('p', { style:{ fontSize:'11px', fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--subtle)', fontFamily:"'DM Sans',sans-serif" } }, c.t),
                  e('p', { style:{ fontSize:'14px', fontWeight:600, color:'var(--accent)', fontFamily:"'DM Sans',sans-serif" } }, c.v),
                ),
              ))
            ),
          ),

        ),
      ),
    ),
    // ── STANDORTE (große Karten wie Screenshot) ──
    e('section', { style:{ backgroundColor:'white', paddingTop:'32px', paddingBottom:'64px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'max-w-xl mb-12 fade-up' },
          e('p', { className:'label mb-4' }, isDE?'Unsere Standorte':'Our locations'),
          e('h2', { className:'font-display', style:{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, isDE?'Berlin & Köln.':'Berlin & Cologne.')
        ),
        e('div', { className:'grid grid-cols-1 md:grid-cols-2 gap-6' },
          locs.map(loc => e('div', { key:loc.city, className:'rounded-3xl overflow-hidden fade-up', style:{ backgroundColor:'var(--offwhite)', border:'1px solid var(--border)' } },
            e('div', { style:{ display:'flex', alignItems:'stretch' } },
              loc.img && e('div', { style:{ width:'130px', flexShrink:0, overflow:'hidden' } },
                e('img', { src:loc.img, alt:`NSBB ${loc.city}`, loading:'lazy', style:{ width:'100%', height:'100%', objectFit:'cover', objectPosition: loc.city==='Köln' ? 'center 20%' : 'center center', display:'block' } })
              ),
              e('div', { style:{ padding:'24px 28px', flex:1, display:'flex', flexDirection:'column', justifyContent:'center' } },
                e('p', { className:'label mb-1' }, isDE?`Niederlassung ${loc.city}`:loc.city+' office'),
                e('h3', { className:'font-display mb-2', style:{ fontSize:'1.6rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, loc.city),
                e('p', { style:{ fontSize:'13px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", whiteSpace:'pre-line', marginBottom:'10px' } }, loc.addr),
                e('a', { href:loc.href, style:{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'14px', fontWeight:600, color:'var(--accent)', fontFamily:"'DM Sans',sans-serif", textDecoration:'none' } },
                  e(Ico,{name:'phone',size:14}), loc.tel
                ),
              ),
            ),
            e('div', { style:{ borderTop:'1px solid var(--border)', padding:'14px 20px', backgroundColor:'white' } },
              e('div', { style:{ display:'flex', alignItems:'flex-start', gap:'8px' } },
                e('span', { style:{ flexShrink:0, marginTop:'2px' } }, e(Ico,{name:'mapPin',size:13})),
                e('div', { style:{ fontSize:'12px', lineHeight:1.6, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif" } },
                  e('p', { style:{ margin:0 } },
                    loc.city==='Berlin'
                      ? (isDE?'S1 bis Zehlendorf (ca. 5 Min.). Bus M48/X10 Haltestelle Berlepschstr.':'S-Bahn S1 to Zehlendorf (5 min walk). Bus M48/X10 stop Berlepschstr.')
                      : (isDE?'U-Bahn Linie 3/4 bis Heumarkt (ca. 8 Min.).':'Metro line 3/4 to Heumarkt (8 min walk).')
                  ),
                  e('p', { style:{ margin:0 } },
                    loc.city==='Berlin'
                      ? (isDE?'Parkplätze vor Ort.':'Parking on site.')
                      : (isDE?'Tiefgaragenstellplätze für Mandanten stehen vor Ort zur Verfügung.':'Underground parking for clients available on site.')
                  ),
                ),
              ),
            ),
            e('div', { style:{ borderTop:'1px solid var(--border)', height:'220px', overflow:'hidden', position:'relative', backgroundColor:'var(--offwhite)' } },
              e('iframe', {
                src: loc.city==='Berlin'
                  ? 'https://www.google.com/maps?q=Berlepschstr.+1,+14165+Berlin&output=embed&z=15'
                  : 'https://www.google.com/maps?q=Holzmarkt+2,+50676+K%C3%B6ln&output=embed&z=15',
                width:'100%', height:'220', style:{ border:0, display:'block' },
                loading:'lazy', referrerPolicy:'no-referrer-when-downgrade',
                allowFullScreen:true, title:`NSBB ${loc.city} – Standort auf Google Maps`,
                'aria-label':`Karte: NSBB ${loc.city}`
              }),
              e('a', {
                href: loc.city==='Berlin'
                  ? 'https://www.google.com/maps/place/NSBB+Steuerberatungsgesellschaft+mbH/@52.4293359,13.2562634,19z/data=!4m15!1m8!3m7!1s0x47a85bcd32214c33:0xc49996f097d43f61!2sBerlepschstra%C3%9Fe+1,+14165+Berlin!3b1!8m2!3d52.429461!4d13.2565531!16s%2Fg%2F11b8v5lfv2!3m5!1s0x47a85bee320dfedf:0xd5c5592d1cbe082d!8m2!3d52.4294067!4d13.2565013!16s%2Fg%2F11qpl7gh9y'
                  : 'https://www.google.com/maps/place/NSBB+Steuerberatungsgesellschaft+mbH/@50.9286295,6.9619573,18z/data=!3m1!4b1!4m6!3m5!1s0x47bf251aeb6f96e7:0xe6cbbac13cb5a3c8!8m2!3d50.9286278!4d6.9632448!16s%2Fg%2F11lkz0nrsq',
                target:'_blank', rel:'noopener noreferrer',
                style:{ position:'absolute', bottom:'10px', right:'10px', backgroundColor:'white', borderRadius:'8px', padding:'6px 12px', fontSize:'12px', fontWeight:600, color:'var(--accent)', fontFamily:"'DM Sans',sans-serif", textDecoration:'none', boxShadow:'0 2px 8px rgba(0,0,0,.15)', display:'inline-flex', alignItems:'center', gap:'5px' }
              }, e(Ico,{name:'mapPin',size:12}), isDE?'Größere Karte':'Larger map')
            ),
          ))
        ),
      ),
    ),
  );
}

function ImpressumPage({ setPage, lang, t }) {
  useScrollAnim();
  const isDE = lang === 'DE';

  const S = {
    h2: { fontFamily:"'Cormorant Garamond',serif", fontSize:'1.5rem', fontWeight:500, color:'#1A1917', lineHeight:1.2, marginBottom:'12px', marginTop:'0' },
    h3: { fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:700, color:'#1A1917', letterSpacing:'.04em', textTransform:'uppercase', marginBottom:'8px', marginTop:'0' },
    p:  { fontSize:'14px', lineHeight:1.8, color:'#6B6358', fontFamily:"'DM Sans',sans-serif", margin:'0 0 8px' },
    a:  { color:'var(--accent)', textDecoration:'none' },
  };

  const sections = [
    {
      title: 'Angaben gemäß § 5 Telemediengesetz (TMG) und § 2 DL-InfoV',
      content: [
        'NSBB Steuerberatungsgesellschaft mbH',
        'Berlepschstr. 1',
        '14165 Berlin',
        '',
        'Telefon: +49 (0) 30 815 80 93',
        'Telefax: +49 (0) 30 815 14 75',
        'E-Mail: info@nsbb.de',
      ],
    },
    {
      title: 'Zuständiges Handelsregister',
      content: ['Registergericht Berlin-Charlottenburg', 'HRB 157 52'],
    },
    {
      title: 'Geschäftsführer',
      content: [
        'Guido Siebert, Diplom-Kaufmann, Wirtschaftsprüfer, Steuerberater',
      ],
    },
    {
      title: 'Aufsichtsbehörde',
      content: [
        'Steuerberaterkammer Berlin',
        'Wichmannstrasse 6',
        '10787 Berlin',
      ],
    },
    {
      title: 'Berufsbezeichnungen und berufsrechtliche Regelungen',
      content: [
        'Die Berufsbezeichnung Wirtschaftsprüfer wurde in der Bundesrepublik Deutschland verliehen.',
        'Die Berufsbezeichnung Steuerberater / Steuerberaterin wurde in der Bundesrepublik Deutschland verliehen.',
        '',
        'Relevante berufsrechtliche Regelungen für Wirtschaftsprüfer:',
        'Gesetz über einen Berufsordnung der Wirtschaftsprüfer (Wirtschaftsprüferordnung)',
        'Satzung der Wirtschaftsprüferkammer über die Rechte und Pflichten bei der Ausübung der Berufe des Wirtschaftsprüfers und des vereidigten Buchprüfers (BS WP/vBP)',
        'Die berufsrechtlichen Regelungen können bei der Wirtschaftsprüferkammer (www.wpk.de) eingesehen werden.',
        '',
        'Relevante berufsrechtliche Regelungen für Steuerberater:',
        'Steuerberatungsgesetz (StBerG) · Berufsordnung der Steuerberater (BOStB) · Durchführungsverordnung zum Steuerberatungsgesetz (DVStB) · Steuerberater-Gebührenverordnung (StBGebV)',
        'Die berufsrechtlichen Regelungen können bei der Bundessteuerberaterkammer (www.bstbk.de) eingesehen werden.',
      ],
    },
    {
      title: 'Umsatzsteuer-Identifikationsnummer',
      content: ['DE 136 578 806'],
    },
    {
      title: 'Berufshaftpflichtversicherung',
      content: [
        'Die NSBB Steuerberatungsgesellschaft mbH ist bei der',
        'ERGO Versicherungs AG Düsseldorf',
        'ERGO-Platz 1, 40477 Düsseldorf',
        'versichert.',
      ],
    },
    {
      title: 'Allgemeine Auftragsbedingungen (AGB)',
      content: [
        'Die Allgemeinen Auftragsbedingungen (AGB) der NSBB Steuerberatungsgesellschaft mbH sind in den Kanzleiräumen erhältlich.',
        '',
        'Es gilt deutsches Recht. Erfüllungsort und Gerichtsstand für Rechtsstreitigkeiten ist Berlin, sofern nicht gesetzlich ein anderer Gerichtsstand vorgesehen ist.',
      ],
    },
    {
      title: 'Haftungshinweis',
      content: [
        'Die NSBB Steuerberatungsgesellschaft mbH übernimmt keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.',
        '',
        'Obwohl die NSBB Steuerberatungsgesellschaft mbH bemüht ist, ihr Webangebot stets aktuell und inhaltlich richtig sowie vollständig anzubieten, ist das Auftreten von Fehlern nicht völlig auszuschließen. Eine Haftung für die Aktualität, die inhaltliche Richtigkeit sowie für die Vollständigkeit der im Webangebot eingestellten Informationen wird nicht übernommen, es sei denn, die Fehler wurden vorsätzlich oder grob fahrlässig aufgenommen.',
      ],
    },
  ];

  return e('div', { className:'page-enter' },
    e(PageHero, { label: isDE?'Rechtliches':'Legal', title: 'Impressum' }),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'80px' } },
      e('div', { style:{ maxWidth:'760px', margin:'0 auto', padding:'0 24px' } },
        sections.map((sec, i) =>
          e('div', { key:i, style:{ paddingBottom:'32px', marginBottom:'32px', borderBottom: i < sections.length-1 ? '1px solid #ECEAE6' : 'none' } },
            e('h2', { style:S.h2 }, sec.title),
            e('div', null,
              sec.content.map((line, j) =>
                line === ''
                  ? e('div', { key:j, style:{ height:'8px' } })
                  : e('p', { key:j, style:S.p }, line)
              )
            ),
          )
        ),
        e('p', { style:{ fontSize:'12px', color:'#B0A89E', fontFamily:"'DM Sans',sans-serif", marginTop:'16px' } }, 'Stand: Januar 2023'),
      ),
    ),
  );
}


function DatenschutzPage({ setPage, lang, t }) {
  useScrollAnim();
  const isDE = lang === 'DE';

  const S = {
    h2: { fontFamily:"'Cormorant Garamond',serif", fontSize:'1.6rem', fontWeight:500, color:'#1A1917', lineHeight:1.2, marginBottom:'16px', marginTop:'0', paddingTop:'32px' },
    h3: { fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:700, color:'#1A1917', letterSpacing:'.03em', textTransform:'uppercase', marginBottom:'10px', marginTop:'24px' },
    h4: { fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:600, color:'#3A342C', marginBottom:'8px', marginTop:'16px' },
    p:  { fontSize:'14px', lineHeight:1.85, color:'#6B6358', fontFamily:"'DM Sans',sans-serif", margin:'0 0 12px' },
    caps: { fontSize:'13px', lineHeight:1.8, color:'#6B6358', fontFamily:"'DM Sans',sans-serif", margin:'0 0 12px', fontWeight:500 },
    li: { fontSize:'14px', lineHeight:1.8, color:'#6B6358', fontFamily:"'DM Sans',sans-serif", marginBottom:'6px', paddingLeft:'16px', position:'relative' },
    h2flat: { fontFamily:"'Cormorant Garamond',serif", fontSize:'1.6rem', fontWeight:500, color:'#1A1917', lineHeight:1.2, marginBottom:'16px', marginTop:'0', paddingTop:'0' },
  };

  return e('div', { className:'page-enter' },

    e(PageHero, { label: isDE?'Rechtliches':'Legal', title: isDE?'Datenschutzerklärung':'Privacy Policy' }),

    e('section', { style:{ backgroundColor:'white', paddingTop:'64px', paddingBottom:'80px' } },
      e('div', { style:{ maxWidth:'760px', margin:'0 auto', padding:'0 24px' } },

        e('h2', { style:S.h2 }, isDE?'1. Datenschutz auf einen Blick':'1. Data protection at a glance'),
        e('h3', { style:S.h3 }, isDE?'Allgemeine Hinweise':'General information'),
        e('p', { style:S.p }, isDE?'Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.':'The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data that can be used to personally identify you. Detailed information on data protection can be found in our privacy policy set out below this text.'),

        e('h3', { style:S.h3 }, isDE?'Datenerfassung auf dieser Website':'Data collection on this website'),
        e('h4', { style:S.h4 }, isDE?'Wer ist verantwortlich für die Datenerfassung auf dieser Website?':'Who is responsible for data collection on this website?'),
        e('p', { style:S.p }, isDE?'Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle“ in dieser Datenschutzerklärung entnehmen.':'Data processing on this website is carried out by the website operator. Their contact details can be found in the "Information on the controller" section of this privacy policy.'),
        e('h4', { style:S.h4 }, isDE?'Wie erfassen wir Ihre Daten?':'How do we collect your data?'),
        e('p', { style:S.p }, isDE?'Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).':'Some data is collected because you provide it to us. This may, for example, be data you enter into a contact form. Other data is collected automatically, or after your consent, by our IT systems when you visit the website. This is mainly technical data (e.g. browser, operating system or time of page access).'),
        e('h4', { style:S.h4 }, isDE?'Wofür nutzen wir Ihre Daten?':'What do we use your data for?'),
        e('p', { style:S.p }, isDE?'Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.':'Some data is collected to ensure the website is provided without errors. Other data may be used to analyse your user behaviour.'),
        e('h4', { style:S.h4 }, isDE?'Welche Rechte haben Sie bezüglich Ihrer Daten?':'What rights do you have regarding your data?'),
        e('p', { style:S.p }, isDE?'Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.':'You have the right at any time to receive free information about the origin, recipient and purpose of your stored personal data. You also have the right to request correction or deletion of this data. If you have given consent to data processing, you can revoke this consent at any time. You also have the right, under certain circumstances, to request the restriction of processing of your personal data. Furthermore, you have the right to lodge a complaint with the competent supervisory authority.'),

        e('div', { style:{ height:'1px', backgroundColor:'#ECEAE6', margin:'40px 0' } }),

        e('h2', { style:S.h2flat }, isDE?'2. Hosting':'2. Hosting'),
        e('p', { style:S.p }, isDE?'Wir hosten die Inhalte unserer Website bei folgendem Anbieter:':'We host the content of our website with the following provider:'),
        e('h3', { style:S.h3 }, 'All-Inkl'),
        e('p', { style:S.p }, isDE?'Anbieter ist die ALL-INKL.COM – Neue Medien Münnich, Inh. René Münnich, Hauptstraße 68, 02742 Friedersdorf. Details entnehmen Sie der Datenschutzerklärung von All-Inkl: https://all-inkl.com/datenschutzinformationen/.':'The provider is ALL-INKL.COM – Neue Medien Münnich, owner René Münnich, Hauptstraße 68, 02742 Friedersdorf, Germany. Details can be found in All-Inkl\'s privacy policy: https://all-inkl.com/datenschutzinformationen/.'),
        e('p', { style:S.p }, isDE?'Die Verwendung von All-Inkl erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung unserer Website.':'The use of All-Inkl is based on Art. 6(1)(f) GDPR. We have a legitimate interest in the most reliable presentation of our website possible.'),

        e('div', { style:{ height:'1px', backgroundColor:'#ECEAE6', margin:'40px 0' } }),

        e('h2', { style:S.h2flat }, isDE?'3. Allgemeine Hinweise und Pflichtinformationen':'3. General information and mandatory disclosures'),
        e('h3', { style:S.h3 }, isDE?'Datenschutz':'Data protection'),
        e('p', { style:S.p }, isDE?'Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.':'The operators of these pages take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with statutory data protection regulations and this privacy policy.'),

        e('h3', { style:S.h3 }, isDE?'Hinweis zur verantwortlichen Stelle':'Information on the controller'),
        e('p', { style:S.p }, isDE?'Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:':'The controller responsible for data processing on this website is:'),
        e('p', { style:{ fontSize:'14px', lineHeight:2, color:'#6B6358', fontFamily:"'DM Sans',sans-serif", margin:'0 0 12px', backgroundColor:'var(--accent-subtle)', borderRadius:'12px', padding:'16px 20px' } },
          'NSBB Steuerberatungsgesellschaft mbH\nBerlepschstr. 1 · 14165 Berlin\n' + (isDE?'Telefon':'Phone') + ': +49 30 815 80 93\nE-Mail: info@nsbb.de'
        ),

        e('h3', { style:S.h3 }, isDE?'Datenschutzbeauftragter':'Data protection officer'),
        e('p', { style:S.p }, isDE?'Wir haben einen Datenschutzbeauftragten benannt. Unseren Datenschutzbeauftragten erreichen Sie unter:':'We have appointed a data protection officer. You can reach our data protection officer at:'),
        e('p', { style:S.p }, 'E-Mail: info@nsbb.de · ' + (isDE?'Telefon':'Phone') + ': +49 30 815 80 93'),

        e('h3', { style:S.h3 }, isDE?'Speicherdauer':'Storage duration'),
        e('p', { style:S.p }, isDE?'Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben.':'Unless a more specific storage period is mentioned within this privacy policy, your personal data will remain with us until the purpose for data processing no longer applies. If you assert a legitimate request for deletion or revoke consent to data processing, your data will be deleted, unless we have other legally permissible reasons for storing your personal data.'),

        e('h3', { style:S.h3 }, isDE?'Widerruf Ihrer Einwilligung zur Datenverarbeitung':'Withdrawal of your consent to data processing'),
        e('p', { style:S.p }, isDE?'Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.':'Many data processing operations are only possible with your express consent. You can revoke consent already given at any time. The legality of data processing carried out until the revocation remains unaffected.'),

        e('h3', { style:S.h3 }, isDE?'Widerspruchsrecht (Art. 21 DSGVO)':'Right to object (Art. 21 GDPR)'),
        e('p', { style:{ fontSize:'14px', lineHeight:1.85, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", margin:'0 0 12px', fontWeight:500 } }, isDE?'WENN DIE DATENVERARBEITUNG AUF GRUNDLAGE VON ART. 6 ABS. 1 LIT. E ODER F DSGVO ERFOLGT, HABEN SIE JEDERZEIT DAS RECHT, AUS GRÜNDEN, DIE SICH AUS IHRER BESONDEREN SITUATION ERGEBEN, GEGEN DIE VERARBEITUNG IHRER PERSONENBEZOGENEN DATEN WIDERSPRUCH EINZULEGEN.':'IF DATA PROCESSING IS BASED ON ART. 6(1)(E) OR (F) GDPR, YOU HAVE THE RIGHT AT ANY TIME, FOR REASONS ARISING FROM YOUR PARTICULAR SITUATION, TO OBJECT TO THE PROCESSING OF YOUR PERSONAL DATA.'),

        e('h3', { style:S.h3 }, isDE?'Beschwerderecht bei der zuständigen Aufsichtsbehörde':'Right to lodge a complaint with the competent supervisory authority'),
        e('p', { style:S.p }, isDE?'Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu.':'In the event of GDPR violations, data subjects have the right to lodge a complaint with a supervisory authority, in particular in the member state of their habitual residence, place of work, or the place of the alleged violation.'),

        e('h3', { style:S.h3 }, isDE?'Auskunft, Berichtigung und Löschung':'Right to information, correction and deletion'),
        e('p', { style:S.p }, isDE?'Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung oder Löschung dieser Daten.':'Within the scope of applicable statutory provisions, you have the right at any time to free information about your stored personal data, its origin and recipients, and the purpose of data processing, and, if applicable, a right to correction or deletion of this data.'),

        e('h3', { style:S.h3 }, isDE?'SSL- bzw. TLS-Verschlüsselung':'SSL/TLS encryption'),
        e('p', { style:S.p }, isDE?'Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt.':'For security reasons and to protect the transmission of confidential content, this site uses SSL or TLS encryption. You can recognise an encrypted connection by the fact that the browser\'s address bar changes from "http://" to "https://".'),

        e('div', { style:{ height:'1px', backgroundColor:'#ECEAE6', margin:'40px 0' } }),

        e('h2', { style:S.h2flat }, isDE?'4. Datenerfassung auf dieser Website':'4. Data collection on this website'),
        e('h3', { style:S.h3 }, isDE?'Kontaktformular':'Contact form'),
        e('p', { style:S.p }, isDE?'Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.':'If you send us enquiries via the contact form, the details you provide, including the contact details given there, will be stored by us for the purpose of processing the enquiry and in case of follow-up questions. We do not pass on this data without your consent.'),
        e('p', { style:S.p }, isDE?'Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde.':'The processing of this data is based on Art. 6(1)(b) GDPR, provided your enquiry relates to the fulfilment of a contract or is necessary for pre-contractual measures. In all other cases, processing is based on our legitimate interest in the effective handling of enquiries addressed to us (Art. 6(1)(f) GDPR) or on your consent (Art. 6(1)(a) GDPR), if requested.'),

        e('div', { style:{ height:'1px', backgroundColor:'#ECEAE6', margin:'40px 0' } }),

        e('h2', { style:S.h2flat }, isDE?'5. Analyse-Tools und Werbung':'5. Analytics tools and advertising'),
        e('h3', { style:S.h3 }, 'Google Tag Manager'),
        e('p', { style:S.p }, isDE?'Wir setzen den Google Tag Manager ein. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Der Google Tag Manager ist ein Tool, mit dessen Hilfe wir Tracking- oder Statistik-Tools auf unserer Website einbinden können. Der Google Tag Manager selbst erstellt keine Nutzerprofile, speichert keine Cookies und nimmt keine eigenständigen Analysen vor.':'We use Google Tag Manager. The provider is Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. Google Tag Manager is a tool that allows us to integrate tracking or statistics tools on our website. Google Tag Manager itself does not create user profiles, does not store cookies, and does not carry out any independent analyses.'),

        e('div', { style:{ height:'1px', backgroundColor:'#ECEAE6', margin:'40px 0' } }),

        e('h2', { style:S.h2flat }, isDE?'6. Eigene Dienste':'6. Our own services'),
        e('h3', { style:S.h3 }, isDE?'Umgang mit Bewerberdaten':'Handling of applicant data'),
        e('p', { style:S.p }, isDE?'Wir bieten Ihnen die Möglichkeit, sich bei uns zu bewerben (z. B. per E-Mail oder via Online-Bewerberformular). Im Folgenden informieren wir Sie über Umfang, Zweck und Verwendung Ihrer im Rahmen des Bewerbungsprozesses erhobenen personenbezogenen Daten.':'We offer you the opportunity to apply to us (e.g. by email or via an online application form). Below we inform you about the scope, purpose and use of your personal data collected during the application process.'),
        e('h4', { style:S.h4 }, isDE?'Umfang und Zweck der Datenerhebung':'Scope and purpose of data collection'),
        e('p', { style:S.p }, isDE?'Wenn Sie uns eine Bewerbung zukommen lassen, verarbeiten wir Ihre damit verbundenen personenbezogenen Daten (z. B. Kontakt- und Kommunikationsdaten, Bewerbungsunterlagen), soweit dies zur Entscheidung über die Begründung eines Beschäftigungsverhältnisses erforderlich ist. Rechtsgrundlage hierfür ist § 26 BDSG (Anbahnung eines Beschäftigungsverhältnisses) sowie Art. 6 Abs. 1 lit. b DSGVO.':'If you send us an application, we process your associated personal data (e.g. contact and communication data, application documents) insofar as necessary for the decision on establishing an employment relationship. The legal basis is § 26 BDSG (German Federal Data Protection Act) and Art. 6(1)(b) GDPR.'),
        e('h4', { style:S.h4 }, isDE?'Aufbewahrungsdauer der Daten':'Data retention period'),
        e('p', { style:S.p }, isDE?'Sofern wir Ihnen kein Stellenangebot machen können oder Sie eine Bewerbung zurückziehen, behalten wir uns das Recht vor, die von Ihnen übermittelten Daten auf Grundlage unserer berechtigten Interessen (Art. 6 Abs. 1 lit. f DSGVO) bis zu 6 Monate ab der Beendigung des Bewerbungsverfahrens aufzubewahren. Anschließend werden die Daten gelöscht.':'If we are unable to offer you a position or you withdraw an application, we reserve the right to retain the data you submitted, based on our legitimate interests (Art. 6(1)(f) GDPR), for up to 6 months after the application process ends. The data will then be deleted.'),

        e('div', { style:{ height:'1px', backgroundColor:'#ECEAE6', margin:'40px 0' } }),

        e('p', { style:{ fontSize:'12px', color:'#B0A89E', fontFamily:"'DM Sans',sans-serif" } }, isDE?'Stand: Dezember 2024':'Last updated: December 2024'),
      ),
    ),
  );
}


function FAQPage({ setPage, lang, t }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const [open, setOpen] = React.useState(0);

  const faqs = isDE ? [
    {
      q: 'Für welche Unternehmen ist NSBB der richtige Partner?',
      a: 'NSBB begleitet insbesondere Unternehmer, GmbHs, Unternehmensgruppen, Holdingstrukturen und international tätige Mandanten. Darüber hinaus beraten wir Privatpersonen bei anspruchsvollen steuerlichen Fragestellungen. Unser Fokus liegt auf einer langfristigen, strategischen und persönlichen steuerlichen Begleitung.'
    },
    {
      q: 'Unterstützt NSBB komplexe Unternehmens- und Holdingstrukturen sowie internationale Sachverhalte?',
      a: 'Ja. Wir begleiten Unternehmen bei der Strukturierung, Optimierung und Weiterentwicklung von Unternehmens- und Holdingstrukturen sowie bei internationalen steuerlichen Fragestellungen. Dabei verbinden wir nationale Expertise mit unserem internationalen Netzwerk für grenzüberschreitende Sachverhalte.'
    },
    {
      q: 'Übernimmt NSBB auch bestehende Mandate von anderen Steuerberatern?',
      a: 'Ja. Wir begleiten regelmäßig den Wechsel von Mandanten und sorgen für einen strukturierten und reibungslosen Übergang. Die Abstimmung mit dem bisherigen Berater sowie die Übernahme relevanter Unterlagen erfolgt professionell und effizient.'
    },
    {
      q: 'Wie läuft die erste Beratung ab?',
      a: 'In einem ersten Gespräch lernen wir Ihr Unternehmen, Ihre Ziele und Ihre aktuelle Situation kennen. Anschließend besprechen wir mögliche Handlungsfelder und die nächsten Schritte einer Zusammenarbeit.'
    },
    {
      q: 'Wer betreut mich persönlich?',
      a: 'Sie erhalten einen festen Ansprechpartner, der Ihre Situation kennt und Sie langfristig begleitet. So entstehen kurze Wege, klare Kommunikation und eine persönliche Zusammenarbeit auf Augenhöhe.'
    },
    {
      q: 'Kann die Zusammenarbeit vollständig digital erfolgen?',
      a: 'Ja. Über moderne DATEV-Lösungen und digitale Prozesse arbeiten wir effizient und standortunabhängig mit unseren Mandanten zusammen. Persönliche Gespräche bleiben selbstverständlich jederzeit möglich.'
    },
    {
      q: 'Arbeiten Sie auch mit Mandanten außerhalb von Berlin und Köln zusammen?',
      a: 'Ja. Wir betreuen Mandanten deutschlandweit sowie international. Durch unsere digitalen Prozesse ist eine standortunabhängige Zusammenarbeit problemlos möglich.'
    },
    {
      q: 'Unterstützt NSBB auch Privatpersonen?',
      a: 'Ja. Neben Unternehmern und Unternehmen beraten wir Privatpersonen insbesondere bei Einkommensteuer, Immobilien, Vermögensnachfolge sowie Erbschaft- und Schenkungsteuer.'
    },
  ] : [
    {
      q: 'Which companies is NSBB the right partner for?',
      a: 'NSBB works primarily with entrepreneurs, GmbHs, corporate groups, holding structures and internationally active clients. We also advise private individuals on complex tax matters. Our focus is on long-term, strategic and personal tax advisory.'
    },
    {
      q: 'Does NSBB support complex corporate and holding structures as well as international matters?',
      a: 'Yes. We assist companies in structuring, optimising and developing corporate and holding structures, as well as with international tax matters. We combine national expertise with our international network for cross-border situations.'
    },
    {
      q: 'Does NSBB take over existing mandates from other tax advisors?',
      a: 'Yes. We regularly support clients in switching advisors and ensure a structured and smooth transition. Coordination with the previous advisor and the transfer of relevant documents is handled professionally and efficiently.'
    },
    {
      q: 'How does the initial consultation work?',
      a: 'In an initial meeting, we get to know your business, goals and current situation. We then discuss possible areas of action and the next steps for working together.'
    },
    {
      q: 'Who is my personal contact?',
      a: 'You will have a dedicated advisor who knows your situation and accompanies you over the long term. This means short communication channels, clear processes and a personal working relationship at eye level.'
    },
    {
      q: 'Can collaboration be fully digital?',
      a: 'Yes. Through modern DATEV solutions and digital processes, we work efficiently and location-independently with our clients. Personal meetings remain possible at any time.'
    },
    {
      q: 'Do you also work with clients outside Berlin and Cologne?',
      a: 'Yes. We work with clients throughout Germany and internationally. Our digital processes make location-independent collaboration straightforward.'
    },
    {
      q: 'Does NSBB also advise private individuals?',
      a: 'Yes. In addition to entrepreneurs and businesses, we advise private individuals particularly on income tax, real estate, wealth succession and inheritance and gift tax.'
    },
  ];

  return e('div', { className: 'page-enter' },
    e(PageHero, {
      label: 'FAQ',
      fit: true,
      title: isDE ? 'Häufige Fragen' : 'Frequently asked',
      accent: isDE ? 'zur Zusammenarbeit.' : 'questions.',
      subtitle: isDE
        ? ['Die wichtigsten Fragen zur Zusammenarbeit', '– auf einen Blick.']
        : ['The most important questions about', 'working with us – at a glance.']
    }),

    e('section', { className: 'py-20 bg-white' },
      e('div', { className: 'max-w-site mx-auto px-5 md:px-8' },
        e('div', { style: { maxWidth: '680px' } },
          faqs.map((faq, i) =>
            e('div', { key: i, className: 'fade-up', style: { borderBottom: '1px solid var(--border)', transitionDelay: `${i * 60}ms` } },
              e('button', {
                className: 'w-full text-left py-6 flex items-start justify-between gap-6',
                style: { background: 'none', border: 'none', cursor: 'pointer' },
                onClick: () => setOpen(open === i ? null : i),
              },
                e('span', {
                  className: 'font-display text-xl leading-snug',
                  style: {
                    color: open === i ? '#1A1917' : '#3A342C',
                    fontWeight: open === i ? 500 : 400,
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: '1.25rem',
                    lineHeight: 1.35,
                  }
                }, faq.q),
                e('span', {
                  style: {
                    flexShrink: 0,
                    width: '28px', height: '28px',
                    borderRadius: '50%',
                    border: `1px solid ${open === i ? 'var(--accent)' : 'var(--border)'}`,
                    backgroundColor: open === i ? 'var(--accent)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all .25s ease',
                  }
                },
                  open === i
                    ? e('svg', { width: 10, height: 10, viewBox: '0 0 24 24', fill: 'none', stroke: 'white', strokeWidth: 3, strokeLinecap: 'round' }, e('path', { d: 'M5 12h14' }))
                    : e('svg', { width: 10, height: 10, viewBox: '0 0 24 24', fill: 'none', stroke: '#6B6358', strokeWidth: 3, strokeLinecap: 'round' }, e('path', { d: 'M12 5v14M5 12h14' }))
                ),
              ),
              open === i && e('div', { style: { paddingBottom: '28px' } },
                e('p', { style: {
                  fontSize: '15px', lineHeight: 1.85,
                  color: '#6B6358',
                  fontFamily: "'DM Sans',sans-serif",
                  margin: 0, maxWidth: '580px',
                }}, faq.a)
              ),
            )
          ),
        ),
      ),
    ),

    e(ContactCTA, { setPage, t }),
  );
}


function LeistungenBranchenPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = (k) => { setPage(k); window.scrollTo(0,0); };
  const branches = [
    { key:'branche-ecommerce', icon:'zap', color:'#EAF0EC', title:isDE?'E-Commerce & Onlinehandel':'E-Commerce & Online Retail', desc:isDE?'Von Amazon und Shopify bis zur OSS-Registrierung und internationalen Umsatzsteuer – wir kennen die steuerlichen Besonderheiten des Onlinehandels genau.':'From Amazon and Shopify to OSS registration and international VAT – we know the tax specifics of online retail inside out.', tags:['Amazon / Shopify / WooCommerce','OSS & EU-Umsatzsteuer','Holdingstrukturen','Internationale Verkäufe'] },
    { key:'branche-bau', icon:'home', color:'#F0EEE9', title:isDE?'Bauunternehmen':'Construction companies', desc:isDE?'Bauleistungen, Subunternehmer, Anzahlungen und Betriebsprüfungen – wir begleiten Bauunternehmen mit fundierter Branchenkenntnis.':'Construction services, subcontractors, advance payments and tax audits – we support construction and trade businesses with in-depth sector knowledge.', tags:['Bauleistungen & USt','Subunternehmerregelungen','Betriebsprüfungen','Lohnabrechnung & Wachstum'] },
    { key:'branche-immobilien', icon:'mapPin', color:'#EAF0EC', title:isDE?'Immobilienunternehmen & -investoren':'Real Estate Companies & Investors', desc:isDE?'Immobilien-GmbH, Holdingstrukturen, Projektgesellschaften und Vermögensverwaltung – wir gestalten Ihre Immobilienstruktur steueroptimiert.':'Real estate GmbH, holding structures, project companies and asset management – we design your real estate structure in a tax-optimised way.', tags:['Immobilien-GmbH & Holding','Projektgesellschaften','Vermögensverwaltung','Immobilieninvestoren'] },
    { key:'branche-international', icon:'globe', color:'#F0EEE9', title:isDE?'Internationale Unternehmen':'International Businesses', desc:isDE?'Inbound- und Outbound-Sachverhalte, Betriebsstätten, Quellensteuer und internationale Strukturen – koordiniert über unser TGS-Netzwerk in 58 Ländern.':'Inbound and outbound matters, permanent establishments, withholding tax and international structures – coordinated through our TGS network in 58 countries.', tags:['Inbound & Outbound','Betriebsstätten & Quellensteuer','Internationale Strukturen','TGS-Netzwerk 58 Länder'] },
    { key:'branche-aerzte', icon:'shield', color:'#F0EEE9', title:isDE?'Ärzte, Heilberufe & Freiberufler':'Doctors, healthcare & freelancers', desc:isDE?'Steuerberatung mit tiefem Verständnis für die besonderen Anforderungen von Ärzten, Zahnärzten, Heilberuflern und freien Berufen – von der Praxisgründung bis zur Nachfolge.':'Tax advice with deep understanding of the specific requirements of doctors, dentists, healthcare practitioners and freelancers – from practice setup to succession.', tags:isDE?['Praxisgründung & -kauf','Partnerschaftsgesellschaft','Investitionsabzugsbetrag','Freiberufliche Einnahmen']:['Practice setup & acquisition','Partnership','Investment deduction','Freelance income'] },
    { key:'branche-startup', icon:'users', color:'#EAF0EC', title:isDE?'Start-ups & Wachstumsunternehmen':'Start-ups & Growth Companies', desc:isDE?'Gründung, Beteiligungsstrukturen, Investoren und Mitarbeiterbeteiligungen – wir begleiten Start-ups von der ersten GmbH bis zur Wachstumsphase.':'Incorporation, equity structures, investors and employee participation – we support start-ups from the first GmbH through to the growth phase.', tags:['Gründung & GmbH-Setup','Beteiligungen & Investoren','Mitarbeiterbeteiligungen','Wachstumsplanung'] },
  ];
  return e('div', { className:'page-enter' },
    e(PageHero, { label:isDE?'Branchenlösungen':'Industry solutions', title:isDE?'Spezialisierte Beratung':'Specialised advice', accent:isDE?'für Ihre Branche.':'for your sector.', subtitle:isDE?'Tiefes Branchenverständnis kombiniert mit strategischer Steuerberatung – für die Anforderungen Ihrer Branche.':'Deep sector understanding combined with strategic tax advice – for the requirements of your industry.', back:isDE?'Leistungen für Unternehmen':'Services for Businesses', backFn:()=>go('leistungen-unternehmen') }),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6' },
        branches.map((b,i) => e('div', { key:b.key, className:'rounded-3xl p-8 md:p-10 flex flex-col card-hover cursor-pointer fade-up border', style:{ transitionDelay:`${i*80}ms`, borderColor:'var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,.05)', backgroundColor:'white' }, onClick:()=>go(b.key) },
          e('div', { className:'flex items-start gap-4 mb-5' },
            e('div', { style:{ width:'44px', height:'44px', borderRadius:'12px', backgroundColor:b.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 } }, e(Ico,{name:b.icon,size:19})),
            e('h2', { className:'font-display', style:{ fontSize:'1.4rem', lineHeight:1.2, color:'#1A1917', fontFamily:"'Cormorant Garamond',serif", marginTop:'6px' } }, b.title),
          ),
          e('p', { className:'text-sm leading-relaxed mb-6 flex-1' }, b.desc),
          e('div', { style:{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'24px' } },
            b.tags.map(tag => e('span', { key:tag, className:'tag' }, tag))
          ),
          e('div', { className:'flex items-center gap-2 text-sm font-medium mt-auto', style:{ color:'var(--accent)', fontFamily:"'DM Sans',sans-serif" } },
            isDE?'Zur Branchenlösung':'View industry solution', e(Ico,{name:'arrowRight',size:15})
          ),
        ))
      ),
    ),
    e(ContactCTA, { setPage, t, bg:'var(--offwhite)', tabPreset:'unternehmen', setKontaktPreset }),
  );
}

/* ─────────────────────────────────────────────────────────
   LANDING: E-COMMERCE & ONLINEHANDEL
───────────────────────────────────────────────────────── */
function BrancheEcommercePage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = (k) => { setPage(k); window.scrollTo(0,0); };
  const items = isDE ? [
    { title:'Amazon, Shopify & WooCommerce', desc:'Wir kennen die Plattformlogik und steuerlichen Besonderheiten der großen E-Commerce-Systeme – von der Umsatzsteuer auf Amazon Seller Accounts bis zur Buchführungsanbindung bei Shopify.' },
    { title:'OSS & EU-Umsatzsteuer', desc:'Der One-Stop-Shop vereinfacht die EU-weite Umsatzsteuerregistrierung – wir richten Ihre OSS-Registrierung ein, erstellen die Meldungen und halten Sie bei Änderungen auf dem aktuellen Stand.' },
    { title:'Internationale Verkäufe & Lagerlogistik', desc:'FBA, PAN-EU, Fulfillment-Netzwerke – bei grenzüberschreitender Lagerung entstehen steuerliche Registrierungspflichten in mehreren Ländern. Wir koordinieren über unser TGS-Netzwerk.' },
    { title:'Holdingstrukturen für Onlinehändler', desc:'Wachsende E-Commerce-Unternehmen profitieren von strukturierten Holdingmodellen – zur Haftungsabgrenzung, steuerlichen Optimierung und späteren Investorenaufnahme.' },
    { title:'Buchführung & digitale Prozesse', desc:'Vollständig digitale Buchführung mit DATEV – Bankanbindung, automatisierte Belegverarbeitung und aktuelle BWA-Auswertungen für Ihr Onlinehandelsunternehmen.' },
    { title:'Betriebsprüfungen im E-Commerce', desc:'E-Commerce-Unternehmen stehen besonders im Fokus von Betriebsprüfungen – wir bereiten Sie professionell vor und begleiten den gesamten Prüfungsprozess.' },
  ] : [
    { title:'Amazon, Shopify & WooCommerce', desc:'We know the platform logic and tax specifics of the major e-commerce systems – from VAT on Amazon Seller Accounts to bookkeeping integration with Shopify.' },
    { title:'OSS & EU VAT', desc:'The One-Stop-Shop simplifies EU-wide VAT registration – we set up your OSS registration, file the returns and keep you up to date with any changes.' },
    { title:'International sales & fulfilment logistics', desc:'FBA, PAN-EU, fulfilment networks – cross-border warehousing creates VAT registration obligations in multiple countries. We coordinate through our TGS network.' },
    { title:'Holding structures for online retailers', desc:'Growing e-commerce businesses benefit from structured holding models – for liability separation, tax optimisation and future investor onboarding.' },
    { title:'Bookkeeping & digital processes', desc:'Fully digital bookkeeping with DATEV – bank connection, automated document processing and current P&L reports for your online retail business.' },
    { title:'Tax audits in e-commerce', desc:'E-commerce companies are a particular focus of tax audits – we prepare you professionally and accompany the entire audit process.' },
  ];
  return e('div', { className:'page-enter' },
    e(PageHero, {
      label: isDE?'Branchenspezialisierung':'Sector specialisation',
      fit: true,
      title: isDE?'E-Commerce':'E-Commerce',
      accent: isDE?'und Onlinehandel.':'and Online Retail.',
      subtitle: isDE?['Amazon, Shopify, OSS, internationale Umsatzsteuer –','wir kennen die Plattformlogik des Onlinehandels.']:['Amazon, Shopify, OSS, international VAT –','we understand the platform logic of online retail.'],
      back: isDE?'Branchenlösungen':'Industry solutions',
      backFn: function(){ setPage('leistungen-unternehmen-branchen'); window.scrollTo(0,0); },
    }),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6' },
        items.map((s,i) => e('div', { key:s.title, className:'rounded-2xl p-8 fade-up border', style:{ transitionDelay:`${i*70}ms`, borderColor:'var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,.04)', backgroundColor:'white' } },
          e('hr', { className:'divider' }),
          e('h2', { className:'font-display mb-4', style:{ fontSize:'1.4rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, s.title),
          e('p', { className:'text-sm leading-relaxed' }, s.desc),
        ))
      ),
    ),
    e(ContactCTA, { setPage, t, bg:'var(--offwhite)', tabPreset:'unternehmen', setKontaktPreset }),
  );
}

/* ─────────────────────────────────────────────────────────
   LANDING: BAU & HANDWERK
───────────────────────────────────────────────────────── */
function BrancheBauPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = (k) => { setPage(k); window.scrollTo(0,0); };
  const items = isDE ? [
    { title:'Umsatzsteuer bei Bauleistungen', desc:'Steuerschuldnerschaft des Leistungsempfängers (§ 13b UStG), Abgrenzung Werk- vs. Dienstleistung, Nachunternehmerregelungen – wir navigieren die komplexen umsatzsteuerlichen Anforderungen im Baubereich.' },
    { title:'Subunternehmer & Nachunternehmer', desc:'Steuerliche Risiken in Subunternehmerketten, Haftungsfragen und Dokumentationspflichten – wir sorgen für rechtssichere Strukturen in Ihrer Subunternehmerkette.' },
    { title:'Anzahlungen & Teilrechnungen', desc:'Korrekte umsatzsteuerliche Behandlung von Anzahlungen, Abschlagsrechnungen und Schlussrechnungen – ein häufiger Prüfungsschwerpunkt, den wir für Sie sauber abbilden.' },
    { title:'Betriebsprüfungen', desc:'Bauunternehmen sind überdurchschnittlich häufig von Betriebsprüfungen betroffen. Wir bereiten Ihr Unternehmen gezielt vor und begleiten den gesamten Prozess professionell.' },
    { title:'Lohnbuchhaltung & SOKA-Bau', desc:'Branchenspezifische Lohnbuchhaltung mit DATEV – Sozialkassenregelungen, Mindestlohn, gewerbliches Lohnbüro und korrekte Beitragsnachweise für SOKA-Bau.' },
    { title:'Wachstum & GmbH-Strukturen', desc:'Wenn aus dem Einzelunternehmen eine GmbH oder Holding wird – wir begleiten den Rechtsformwechsel steueroptimiert und planen Ihre Wachstumsstruktur strategisch vor.' },
  ] : [
    { title:'VAT on construction services', desc:'Reverse charge (§ 13b UStG), demarcation of work contracts vs services, subcontractor regulations – we navigate the complex VAT requirements in the construction sector.' },
    { title:'Subcontractors & sub-chains', desc:'Tax risks in subcontractor chains, liability questions and documentation obligations – we ensure legally sound structures in your subcontractor chain.' },
    { title:'Advance payments & partial invoices', desc:'Correct VAT treatment of advance payments, progress invoices and final invoices – a common audit focus that we map cleanly for you.' },
    { title:'Tax audits', desc:'Construction and trade businesses are disproportionately subject to tax audits. We prepare your business specifically and professionally accompany the entire process.' },
    { title:'Payroll & SOKA-Bau', desc:'Sector-specific payroll with DATEV – holiday fund regulations, minimum wage, trade payroll and correct contribution records for SOKA-Bau.' },
    { title:'Growth & GmbH structures', desc:'When a sole trader becomes a GmbH or holding company – we accompany the change of legal form in a tax-optimised way and plan your growth structure strategically.' },
  ];
  return e('div', { className:'page-enter' },
    e(PageHero, {
      label: isDE?'Branchenspezialisierung':'Sector specialisation',
      fit: true,
      title: isDE?'Steuerberatung für':'Tax advice for',
      accent: isDE?'Bauunternehmen.':'Construction Companies.',
      subtitle: isDE?['Bauleistungen, Subunternehmer und Betriebsprüfungen –','wir kennen die steuerlichen Besonderheiten der Baubranche.']:['Construction services, subcontractors and tax audits –','we know the tax specifics of the construction sector.'],
      back: isDE?'Branchenlösungen':'Industry solutions',
      backFn: function(){ setPage('leistungen-unternehmen-branchen'); window.scrollTo(0,0); },
    }),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6' },
        items.map((s,i) => e('div', { key:s.title, className:'rounded-2xl p-8 fade-up border', style:{ transitionDelay:`${i*70}ms`, borderColor:'var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,.04)', backgroundColor:'white' } },
          e('hr', { className:'divider' }),
          e('h2', { className:'font-display mb-4', style:{ fontSize:'1.4rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, s.title),
          e('p', { className:'text-sm leading-relaxed' }, s.desc),
        ))
      ),
    ),
    e(ContactCTA, { setPage, t, bg:'var(--offwhite)', tabPreset:'unternehmen', setKontaktPreset }),
  );
}

/* ─────────────────────────────────────────────────────────
   LANDING: IMMOBILIEN
───────────────────────────────────────────────────────── */
function BrancheImmobilienPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = (k) => { setPage(k); window.scrollTo(0,0); };
  const items = isDE ? [
    { title:'Immobilien-GmbH & Holding', desc:'Die vermögensverwaltende GmbH und Holdingstrukturen sind das steuerliche Kernthema für Immobilieninvestoren – wir gestalten Ihre Struktur von Anfang an optimal und begleiten Umstrukturierungen steuereffizient.' },
    { title:'Projektgesellschaften', desc:'Für einzelne Immobilienprojekte empfiehlt sich oft eine separate Projektgesellschaft – wir beraten zu Rechtsform, steuerlicher Einbettung und optimaler Finanzierungsstruktur.' },
    { title:'Vermögensverwaltung & Family Office', desc:'Strukturierte Verwaltung von Immobilienvermögen über mehrere Gesellschaften, Generationen und Standorte – steueroptimiert, sauber strukturiert und langfristig ausgerichtet.' },
    { title:'Grunderwerbsteuer & Transaktionen', desc:'RETT-Blocking, Share Deals vs. Asset Deals, Grunderwerbsteueroptimierung – bei Immobilientransaktionen sind die steuerlichen Weichen vor dem Kauf zu stellen.' },
    { title:'Gewerblicher Grundstückshandel', desc:'Die Abgrenzung zwischen privater Vermögensverwaltung und gewerblichem Grundstückshandel ist steuerlich entscheidend. Wir analysieren und gestalten Ihre Situation rechtssicher.' },
    { title:'Laufende Betreuung & Jahresabschluss', desc:'Buchführung, Jahresabschlüsse und Steuererklärungen für Immobiliengesellschaften und Vermietungseinkünfte – präzise, fristgerecht und mit Blick auf Optimierungspotenzial.' },
  ] : [
    { title:'Real estate GmbH & holding', desc:'The asset-managing GmbH and holding structures are the core tax topic for real estate investors – we design your structure optimally from the outset and accompany restructurings tax-efficiently.' },
    { title:'Project companies', desc:'For individual real estate projects, a separate project company is often advisable – we advise on legal form, tax embedding and optimal financing structure.' },
    { title:'Asset management & family office', desc:'Structured management of real estate assets across multiple companies, generations and locations – tax-optimised, cleanly structured and long-term oriented.' },
    { title:'Real estate transfer tax & transactions', desc:'RETT-blocking, share deals vs asset deals, real estate transfer tax optimisation – for real estate transactions, the tax groundwork must be laid before the purchase.' },
    { title:'Commercial property trading', desc:'The distinction between private asset management and commercial property trading is decisive for tax purposes. We analyse and structure your situation in a legally sound way.' },
    { title:'Ongoing support & annual accounts', desc:'Bookkeeping, annual accounts and tax returns for real estate companies and rental income – precise, on time and with an eye for optimisation potential.' },
  ];
  return e('div', { className:'page-enter' },
    e(PageHero, {
      label: isDE?'Branchenspezialisierung':'Sector specialisation',
      fit: true,
      title: isDE?'Steuerberatung für':'Tax advice for',
      accent: isDE?'Immobilien & Investoren.':'Real Estate & Investors.',
      subtitle: isDE?['Immobilien-GmbH, Holdingstrukturen und Transaktionen –','wir gestalten Ihre Struktur steueroptimiert und langfristig.']:['Real estate GmbH, holdings and transactions –','we design your structure tax-optimised and long-term.'],
      back: isDE?'Branchenlösungen':'Industry solutions',
      backFn: function(){ setPage('leistungen-unternehmen-branchen'); window.scrollTo(0,0); },
    }),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6' },
        items.map((s,i) => e('div', { key:s.title, className:'rounded-2xl p-8 fade-up border', style:{ transitionDelay:`${i*70}ms`, borderColor:'var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,.04)', backgroundColor:'white' } },
          e('hr', { className:'divider' }),
          e('h2', { className:'font-display mb-4', style:{ fontSize:'1.4rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, s.title),
          e('p', { className:'text-sm leading-relaxed' }, s.desc),
        ))
      ),
    ),
    e(ContactCTA, { setPage, t, bg:'var(--offwhite)', tabPreset:'unternehmen', setKontaktPreset }),
  );
}

/* ─────────────────────────────────────────────────────────
   LANDING: INTERNATIONALE UNTERNEHMEN
───────────────────────────────────────────────────────── */
function BrancheInternationalPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = (k) => { setPage(k); window.scrollTo(0,0); };
  const items = isDE ? [
    { title:'Inbound-Sachverhalte', desc:'Ausländische Unternehmen und Investoren mit Aktivitäten in Deutschland – Betriebsstättenbegründung, steuerliche Registrierung, laufende Betreuung und strukturierte Einbettung in die deutsche Steuerordnung.' },
    { title:'Outbound-Sachverhalte', desc:'Deutsche Unternehmen und Unternehmer mit Aktivitäten im Ausland – Wegzugsbesteuerung, ausländische Betriebsstätten, grenzüberschreitende Strukturen und Doppelbesteuerungsabkommen.' },
    { title:'Internationale Holdingstrukturen', desc:'Steueroptimierte internationale Holding- und Beteiligungsstrukturen – für effiziente Gewinnausschüttungen, Haftungsabgrenzung und strategische Wachstumsplanung über Ländergrenzen hinweg.' },
    { title:'Betriebsstätten & Quellensteuer', desc:'Begründung, Qualifikation und Besteuerung ausländischer Betriebsstätten sowie Planung und Optimierung von Quellensteuern auf grenzüberschreitende Zahlungsströme.' },
    { title:'TGS-Netzwerk in 58 Ländern', desc:'Als Mitglied von TGS International koordinieren wir internationale Sachverhalte über unser Netzwerk von 66 Mitgliedsfirmen in 58 Ländern – schnell, zuverlässig und aus einer Hand.' },
    { title:'Internationale Strukturberatung', desc:'Ganzheitliche Beratung zur steueroptimalen internationalen Aufstellung Ihres Unternehmens – strategisch, vorausschauend und mit dem Blick auf nachhaltigen Mehrwert.' },
  ] : [
    { title:'Inbound matters', desc:'Foreign companies and investors with activities in Germany – permanent establishment creation, tax registration, ongoing support and structured integration into the German tax system.' },
    { title:'Outbound matters', desc:'German companies and entrepreneurs with activities abroad – exit taxation, foreign permanent establishments, cross-border structures and double taxation treaties.' },
    { title:'International holding structures', desc:'Tax-optimised international holding and participation structures – for efficient profit distributions, liability separation and strategic growth planning across borders.' },
    { title:'Permanent establishments & withholding tax', desc:'Creation, qualification and taxation of foreign permanent establishments plus planning and optimisation of withholding taxes on cross-border payment flows.' },
    { title:'TGS network in 58 countries', desc:'As a member of TGS International, we coordinate international matters through our network of 66 member firms in 58 countries – quickly, reliably and from a single source.' },
    { title:'International structure advisory', desc:'Holistic advice on the tax-optimal international positioning of your business – strategic, forward-looking and focused on sustainable added value.' },
  ];
  return e('div', { className:'page-enter' },
    e(PageHero, {
      label: isDE?'Branchenspezialisierung':'Sector specialisation',
      fit: true,
      title: isDE?'Internationale Steuerberatung.':'International Tax Advice.',
      accent: isDE?'Global vernetzt.':'Globally Connected.',
      subtitle: isDE?['Inbound, Outbound, Betriebsstätten, Quellensteuer –','wir koordinieren über unser TGS-Netzwerk in 58 Ländern.']:['Inbound, outbound, permanent establishments, tax –','we coordinate through our TGS network in 58 countries.'],
      back: isDE?'Branchenlösungen':'Industry solutions',
      backFn: function(){ setPage('leistungen-unternehmen-branchen'); window.scrollTo(0,0); },
    }),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6' },
        items.map((s,i) => e('div', { key:s.title, className:'rounded-2xl p-8 fade-up border', style:{ transitionDelay:`${i*70}ms`, borderColor:'var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,.04)', backgroundColor:'white' } },
          e('hr', { className:'divider' }),
          e('h2', { className:'font-display mb-4', style:{ fontSize:'1.4rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, s.title),
          e('p', { className:'text-sm leading-relaxed' }, s.desc),
        ))
      ),
    ),
    e('section', { className:'py-16', style:{ backgroundColor:'var(--accent-subtle)' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 text-center fade-up' },
        e('p', { className:'label mb-3' }, 'TGS International'),
        e('p', { className:'text-base max-w-xl mx-auto mb-6 leading-relaxed' }, isDE?'Für internationale Sachverhalte koordinieren wir über unser weltweites Netzwerk – mehr dazu auf unserer TGS-Seite.':'For international matters we coordinate through our global network – learn more on our TGS page.'),
        e('button', { className:'btn-g', onClick:()=>go('tgs') }, isDE?'Zum TGS-Netzwerk':'TGS network', e(Ico,{name:'arrowRight',size:15})),
      ),
    ),
    e(ContactCTA, { setPage, t, bg:'white', tabPreset:'international', setKontaktPreset }),
  );
}

/* ─────────────────────────────────────────────────────────
   LANDING: START-UPS & WACHSTUM
───────────────────────────────────────────────────────── */
function BrancheStartupPage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = (k) => { setPage(k); window.scrollTo(0,0); };
  const items = isDE ? [
    { title:'Gründung & GmbH-Setup', desc:'Von der Rechtsformwahl über die Gesellschaftervereinbarung bis zur steuerlichen Registrierung – wir begleiten Ihre Gründung strukturiert, effizient und mit Blick auf die langfristige Entwicklung.' },
    { title:'Beteiligungsstrukturen & Investoren', desc:'Wenn Investoren einsteigen, zählt jede Vertragsklausel. Wir strukturieren Ihre Beteiligungsstruktur, prüfen Termsheets aus steuerlicher Sicht und bereiten Sie auf Funding-Runden vor.' },
    { title:'Mitarbeiterbeteiligungen (VSOP/ESOP)', desc:'Virtual Share Option Programs und echte Mitarbeiterbeteiligungen steueroptimiert gestalten – damit Sie die besten Talente halten und binden können.' },
    { title:'Holding & Vermögenssicherung', desc:'Wer wächst, sollte früh eine Holdingstruktur aufbauen. Wir gestalten Ihre Holding zur Gewinnentnahme, Haftungsabschirmung und späteren Exit-Vorbereitung.' },
    { title:'Buchführung & Reporting', desc:'Aktuelle Zahlen, saubere Buchführung und professionelles Reporting – damit Sie fundierte Entscheidungen treffen können und Ihre Investoren stets gut informiert sind.' },
    { title:'Exit-Planung & Transaktionen', desc:'Wenn der Exit kommt, sind steuerliche Weichen lange vorher zu stellen. Wir begleiten Share Deals, Asset Deals und Due Diligence-Prozesse professionell und diskret.' },
  ] : [
    { title:'Incorporation & GmbH setup', desc:'From choice of legal form through the shareholder agreement to tax registration – we accompany your incorporation in a structured, efficient way with an eye on long-term development.' },
    { title:'Equity structures & investors', desc:'When investors come on board, every clause counts. We structure your equity, review term sheets from a tax perspective and prepare you for funding rounds.' },
    { title:'Employee participation (VSOP/ESOP)', desc:'Design virtual share option programs and genuine employee participation in a tax-optimised way – so you can attract and retain the best talent.' },
    { title:'Holding & asset protection', desc:'Growing businesses should build a holding structure early. We design your holding for profit distribution, liability shielding and future exit preparation.' },
    { title:'Bookkeeping & reporting', desc:'Current figures, clean bookkeeping and professional reporting – so you can make sound decisions and keep your investors well informed at all times.' },
    { title:'Exit planning & transactions', desc:'When an exit comes, the tax groundwork must be laid well in advance. We professionally and discreetly accompany share deals, asset deals and due diligence processes.' },
  ];
  return e('div', { className:'page-enter' },
    e(PageHero, {
      label: isDE?'Branchenspezialisierung':'Sector specialisation',
      fit: true,
      title: isDE?'Steuerberatung für':'Tax advice for',
      accent: isDE?'Start-ups & Wachstum.':'Start-ups & Growth.',
      subtitle: isDE?['Gründung, Beteiligungen, Investoren und Exit –','wir begleiten Sie von der GmbH bis zum Exit.']:['Incorporation, equity, investors and exit –','we support you from the first GmbH to exit.'],
      back: isDE?'Branchenlösungen':'Industry solutions',
      backFn: function(){ setPage('leistungen-unternehmen-branchen'); window.scrollTo(0,0); },
    }),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6' },
        items.map((s,i) => e('div', { key:s.title, className:'rounded-2xl p-8 fade-up border', style:{ transitionDelay:`${i*70}ms`, borderColor:'var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,.04)', backgroundColor:'white' } },
          e('hr', { className:'divider' }),
          e('h2', { className:'font-display mb-4', style:{ fontSize:'1.4rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, s.title),
          e('p', { className:'text-sm leading-relaxed' }, s.desc),
        ))
      ),
    ),
    e(ContactCTA, { setPage, t, bg:'var(--offwhite)', tabPreset:'unternehmen', setKontaktPreset }),
  );
}

/* ─────────────────────────────────────────────────────────
   LANDING: ÄRZTE, HEILBERUFE & FREIBERUFLER
───────────────────────────────────────────────────────── */
function BrancheAerztePage({ setPage, lang, t, setKontaktPreset }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const go = (k) => { setPage(k); window.scrollTo(0,0); };
  const items = isDE ? [
    { title:'Praxisgründung & Praxiskauf', desc:'Von der Einzelpraxis bis zur Berufsausübungsgemeinschaft – wir begleiten Praxisgründungen und -käufe steueroptimiert, von der Rechtsformwahl über den Kaufvertrag bis zur steuerlichen Registrierung.' },
    { title:'Partnerschaftsgesellschaft & MVZ', desc:'Die steuerlich optimale Struktur für Gemeinschaftspraxen, Partnerschaftsgesellschaften und Medizinische Versorgungszentren – individuell gestaltet und rechtssicher strukturiert.' },
    { title:'Investitionsabzugsbetrag & Abschreibungen', desc:'Für Heilberufe und Freiberufler bieten IAB, Sofortabschreibung und Sonderabschreibungen erhebliche Steuersparpotenziale. Wir identifizieren und nutzen diese systematisch für Sie.' },
    { title:'Freiberufliche Einnahmen & EÜR', desc:'Saubere Einnahmen-Überschuss-Rechnung, korrekte Abgrenzung freiberuflicher und gewerblicher Einkünfte sowie vollständige steuerliche Erfassung aller Praxiseinkünfte.' },
    { title:'Praxisnachfolge & Verkauf', desc:'Der Praxisverkauf ist ein steuerliches Großereignis. Wir planen Ihre Praxisnachfolge steueroptimiert vor – von der Bewertung über die Vertragsgestaltung bis zur optimalen Besteuerung des Veräußerungsgewinns.' },
    { title:'Vermögens- & Altersvorsorgeplanung', desc:'Ärzte und Freiberufler brauchen eine durchdachte Vermögensstruktur und Altersvorsorgeplanung. Wir beraten Sie ganzheitlich – steuerlich, strukturell und langfristig ausgerichtet.' },
  ] : [
    { title:'Practice set-up & acquisition', desc:'From sole practice to partnerships – we accompany practice set-ups and acquisitions in a tax-optimised way, from choice of legal form through the purchase agreement to tax registration.' },
    { title:'Partnership & medical care centres', desc:'The tax-optimal structure for joint practices, partnerships and medical care centres – individually designed and legally sound.' },
    { title:'Investment deduction & depreciation', desc:'For healthcare professionals and freelancers, investment deduction amounts, immediate write-offs and special depreciation offer significant tax savings. We identify and use these systematically.' },
    { title:'Freelance income & income-surplus calculation', desc:'Clean income-surplus calculation, correct demarcation of freelance and commercial income plus complete tax recording of all practice income.' },
    { title:'Practice succession & sale', desc:'Selling a practice is a major tax event. We plan your practice succession in a tax-optimised way – from valuation through contract design to optimal taxation of the disposal gain.' },
    { title:'Asset & retirement planning', desc:'Doctors and freelancers need a well-thought-out asset structure and retirement plan. We advise you holistically – tax-focused, structurally sound and long-term oriented.' },
  ];
  return e('div', { className:'page-enter' },
    e(PageHero, {
      label: isDE?'Branchenspezialisierung':'Sector specialisation',
      fit: true,
      title: isDE?'Steuerberatung für':'Tax advice for',
      accent: isDE?'Ärzte & Heilberufe.':'Doctors & Healthcare.',
      subtitle: isDE?['Praxisgründung, Partnerschaft und Nachfolge –','wir verstehen die Anforderungen der Heilberufe.']:['Practice set-up, partnership and succession –','we understand the needs of healthcare professions.'],
      back: isDE?'Branchenlösungen':'Industry solutions',
      backFn: function(){ setPage('leistungen-unternehmen-branchen'); window.scrollTo(0,0); },
    }),
    e('section', { className:'py-20 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6' },
        items.map((s,i) => e('div', { key:s.title, className:'rounded-2xl p-8 fade-up border', style:{ transitionDelay:`${i*70}ms`, borderColor:'var(--border)', boxShadow:'0 1px 3px rgba(0,0,0,.04)', backgroundColor:'white' } },
          e('hr', { className:'divider' }),
          e('h2', { className:'font-display mb-4', style:{ fontSize:'1.4rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, s.title),
          e('p', { className:'text-sm leading-relaxed' }, s.desc),
        ))
      ),
    ),
    e(ContactCTA, { setPage, t, bg:'var(--offwhite)', tabPreset:'privat', setKontaktPreset }),
  );
}

function KarriereForm({ lang, jobTitle }) {
  var isDE = lang === 'DE';
  var s1 = useState({ vorname:'', nachname:'', email:'', phone:'', standort:'', erfahrung:'', message:'' });
  var form = s1[0]; var setForm = s1[1];
  var s2 = useState(false);
  var sending = s2[0]; var setSending = s2[1];
  var s3 = useState(false);
  var sent = s3[0]; var setSent = s3[1];
  var s4 = useState('');
  var formError = s4[0]; var setFormError = s4[1];

  function setField(k, v) { setForm(function(f) { var n={}; for(var x in f) n[x]=f[x]; n[k]=v; return n; }); }

  function handleSubmit() {
    if (!form.vorname || !form.nachname || !form.email || !form.phone || !form.standort || !form.erfahrung) {
      setFormError(isDE ? 'Bitte alle Pflichtfelder ausfüllen.' : 'Please fill in all required fields.');
      return;
    }
    setSending(true); setFormError('');
    var body = (isDE?'Stelle: ':'Position: ') + jobTitle + '\n' +
               (isDE?'Vorname: ':'First name: ') + form.vorname + '\n' +
               (isDE?'Nachname: ':'Last name: ') + form.nachname + '\n' +
               'E-Mail: ' + form.email + '\n' +
               (isDE?'Telefon: ':'Phone: ') + form.phone + '\n' +
               (isDE?'Gewünschter Standort: ':'Preferred location: ') + form.standort + '\n' +
               (isDE?'Berufserfahrung: ':'Experience: ') + form.erfahrung +
               (form.message ? '\n\n' + (isDE?'Nachricht:\n':'Message:\n') + form.message : '');
    fetch('contact.php', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ type:isDE?'Karriere':'Career', email:form.email, body:body }) })
    .then(function(r){ return r.json(); })
    .then(function(res){ setSending(false); if(res.success){ setSent(true); } else { setFormError(res.message||(isDE?'Fehler beim Senden. Bitte an karriere@nsbb.de wenden.':'Error. Please email karriere@nsbb.de.')); } })
    .catch(function(){ setSending(false); setFormError(isDE?'Fehler beim Senden. Bitte an karriere@nsbb.de wenden.':'Error. Please email karriere@nsbb.de.'); });
  }

  if (sent) {
    return e('div', { className:'text-center py-8' },
      e('div', { className:'w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4', style:{ backgroundColor:'var(--accent-subtle)' } }, e(Ico,{name:'check',size:24})),
      e('h3', { className:'font-display mb-2', style:{ fontSize:'1.6rem', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, isDE?'Vielen Dank für Ihre Bewerbung!':'Thank you for your application!'),
      e('p', { className:'text-sm', style:{ color:'var(--muted)' } }, isDE?'Wir melden uns schnellstmöglich bei Ihnen.':'We will get back to you as soon as possible.')
    );
  }

  var standortOpts = isDE ? ['Berlin','Köln','Hybrid / flexibel'] : ['Berlin','Cologne','Hybrid / flexible'];
  var erfahrungOpts = isDE
    ? ['Berufseinsteiger','1–3 Jahre','3–5 Jahre','5–10 Jahre','Mehr als 10 Jahre']
    : ['Career starter','1–3 years','3–5 years','5–10 years','More than 10 years'];

  return e('div', null,
    e('div', { className:'grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4' },
      e('div', null, e('label',{className:'flabel'}, isDE?'Vorname':'First name', e('span',{style:{color:'var(--accent)'}},' *')), e('input',{type:'text',value:form.vorname,onChange:function(ev){setField('vorname',ev.target.value);},placeholder:isDE?'Vorname':'First name',className:'finput',maxLength:80})),
      e('div', null, e('label',{className:'flabel'}, isDE?'Nachname':'Last name', e('span',{style:{color:'var(--accent)'}},' *')), e('input',{type:'text',value:form.nachname,onChange:function(ev){setField('nachname',ev.target.value);},placeholder:isDE?'Nachname':'Last name',className:'finput',maxLength:80})),
    ),
    e('div', { className:'grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4' },
      e('div', null, e('label',{className:'flabel'}, 'E-Mail', e('span',{style:{color:'var(--accent)'}},' *')), e('input',{type:'email',value:form.email,onChange:function(ev){setField('email',ev.target.value);},placeholder:isDE?'ihre@email.de':'your@email.com',className:'finput',maxLength:100})),
      e('div', null, e('label',{className:'flabel'}, isDE?'Telefonnummer':'Phone', e('span',{style:{color:'var(--accent)'}},' *')), e('input',{type:'tel',value:form.phone,onChange:function(ev){setField('phone',ev.target.value);},placeholder:'+49 ...',className:'finput',maxLength:100})),
    ),
    e('div', { className:'grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4' },
      e('div', null,
        e('label',{className:'flabel'}, isDE?'Gewünschter Standort':'Preferred location', e('span',{style:{color:'var(--accent)'}},' *')),
        e('select',{value:form.standort,onChange:function(ev){setField('standort',ev.target.value);},className:'finput'},
          e('option',{value:''},isDE?'Bitte auswählen ...':'Please select ...'),
          standortOpts.map(function(o){ return e('option',{key:o,value:o},o); })
        ),
      ),
      e('div', null,
        e('label',{className:'flabel'}, isDE?'Berufserfahrung':'Experience', e('span',{style:{color:'var(--accent)'}},' *')),
        e('select',{value:form.erfahrung,onChange:function(ev){setField('erfahrung',ev.target.value);},className:'finput'},
          e('option',{value:''},isDE?'Bitte auswählen ...':'Please select ...'),
          erfahrungOpts.map(function(o){ return e('option',{key:o,value:o},o); })
        ),
      ),
    ),
    e('div', { className:'mb-6' },
      e('label',{className:'flabel'}, isDE?'Kurze Nachricht (optional)':'Short message (optional)'),
      e('textarea',{value:form.message,onChange:function(ev){setField('message',ev.target.value);},rows:3,maxLength:1000,className:'finput',style:{resize:'vertical',minHeight:'90px'},placeholder:isDE?'Was möchten Sie uns vorab mitteilen?':'What would you like to tell us in advance?'}),
    ),
    formError && e('p',{className:'ferr mb-3'},formError),
    e('button',{className:'btn-p',onClick:handleSubmit,disabled:sending,style:{opacity:sending?0.7:1,cursor:sending?'wait':'pointer'}},
      e(Ico,{name:'mail',size:15}), sending?(isDE?'Wird gesendet …':'Sending …'):(isDE?'Bewerbung absenden':'Submit application')
    ),
  );
}

function KarriereStbPage({ setPage, lang, t }) {
  useScrollAnim();
  var isDE = lang === 'DE';
  var jobTitleDE = 'Steuerberater/in';
  var jobTitleEN = 'Tax Advisor';
  return e('div', { className:'page-enter' },
    e(PageHero, { label:isDE?'Karriere bei NSBB':'Career at NSBB', title:isDE?'Steuerberater/in':'Tax Advisor', subtitle:isDE?'Voll- oder Teilzeit · Berlin oder Köln':'Full or part time · Berlin or Cologne', back:isDE?'Alle Stellen':'All positions', backFn:function(){ setPage('karriere'); } }),
    e('section', { className:'py-14 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('p', { className:'text-base leading-relaxed max-w-2xl', style:{ color:'var(--muted)' } }, isDE?'Als Steuerberater/in bei NSBB übernehmen Sie eigenverantwortlich die steuerliche Beratung eines festen Mandantenstamms – in einer modernen, digitalen Kanzlei.':'As a Tax Advisor at NSBB, you take independent responsibility for the tax advisory of an established client portfolio – within a modern, digital firm.'),
      ),
    ),
    e('section', { className:'py-14', style:{ backgroundColor:'var(--offwhite)' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12' },
        e('div', null,
          e('p', { className:'label mb-4' }, isDE?'Das erwartet Sie':'What to expect'),
          e('ul', { className:'space-y-3 mt-2' }, (isDE?['Eigenverantwortliche Betreuung eines festen Mandantenstamms','Steuerliche Beratung von Unternehmen und Privatpersonen','Erstellung von Jahresabschlüssen und Steuererklärungen','Begleitung von Betriebsprüfungen','Eigenverantwortliche Umsetzung von Gestaltungsprojekten']:['Independent management of an established client portfolio','Tax advisory for businesses and private individuals','Preparation of annual accounts and tax returns','Support during tax audits','Independent execution of structuring projects']).map(function(task) { return e('li', { key:task, className:'flex items-start gap-3 text-sm leading-relaxed' }, e(Ico,{name:'checkCircle',size:15}), task); }))
        ),
        e('div', null,
          e('p', { className:'label mb-4' }, isDE?'Das bringen Sie mit':'Your profile'),
          e('ul', { className:'space-y-3 mt-2' }, (isDE?['Erfolgreich abgelegtes Steuerberaterexamen','Mehrjährige Berufserfahrung','Freude an persönlicher Mandantenbetreuung','Eigenständige Arbeitsweise','Offenheit für digitale Prozesse']:['Successfully passed tax advisor examination','Several years of professional experience','Enjoyment of personal client relationships','Independent way of working','Openness to digital processes']).map(function(r) { return e('li', { key:r, className:'flex items-start gap-3 text-sm leading-relaxed' }, e(Ico,{name:'checkCircle',size:15}), r); }))
        ),
      ),
    ),
    e('section', { className:'py-14 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'max-w-2xl mx-auto rounded-3xl p-10 md:p-12', style:{ backgroundColor:'var(--offwhite)' } },
          e('p', { className:'label mb-4' }, isDE?'Jetzt bewerben':'Apply now'),
          e('h2', { className:'font-display mb-8', style:{ fontSize:'clamp(1.6rem,3vw,2.2rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, isDE?'Wir freuen uns auf Sie.':'We look forward to hearing from you.'),
          e(KarriereForm, { lang:lang, jobTitle:isDE?jobTitleDE:jobTitleEN }),
        ),
      ),
    ),
  );
}
function KarriereSfwPage({ setPage, lang, t }) {
  useScrollAnim();
  var isDE = lang === 'DE';
  var jobTitleDE = 'Steuerfachwirt/in';
  var jobTitleEN = 'Senior Tax Clerk';
  return e('div', { className:'page-enter' },
    e(PageHero, { label:isDE?'Karriere bei NSBB':'Career at NSBB', title:isDE?'Steuerfachwirt/in':'Senior Tax Clerk', subtitle:isDE?'Voll- oder Teilzeit · Berlin oder Köln':'Full or part time · Berlin or Cologne', back:isDE?'Alle Stellen':'All positions', backFn:function(){ setPage('karriere'); } }),
    e('section', { className:'py-14 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('p', { className:'text-base leading-relaxed max-w-2xl', style:{ color:'var(--muted)' } }, isDE?'Als Steuerfachwirt/in bei NSBB übernehmen Sie eigenverantwortlich die laufende Betreuung anspruchsvoller Mandate – in einer modernen, digitalen Kanzlei.':'As a Senior Tax Clerk at NSBB, you take independent responsibility for the ongoing support of demanding mandates – within a modern, digital firm.'),
      ),
    ),
    e('section', { className:'py-14', style:{ backgroundColor:'var(--offwhite)' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12' },
        e('div', null,
          e('p', { className:'label mb-4' }, isDE?'Das erwartet Sie':'What to expect'),
          e('ul', { className:'space-y-3 mt-2' }, (isDE?['Betreuung eines festen Mandantenstamms','Steuerliche Beratung von Unternehmen und Privatpersonen','Erstellung von Jahresabschlüssen und Steuererklärungen','Begleitung von Betriebsprüfungen','Unterstützung bei der Steuerplanung']:['Support for an established client portfolio','Tax advisory for businesses and private individuals','Preparation of annual accounts and tax returns','Support during tax audits','Support with tax planning']).map(function(task) { return e('li', { key:task, className:'flex items-start gap-3 text-sm leading-relaxed' }, e(Ico,{name:'checkCircle',size:15}), task); }))
        ),
        e('div', null,
          e('p', { className:'label mb-4' }, isDE?'Das bringen Sie mit':'Your profile'),
          e('ul', { className:'space-y-3 mt-2' }, (isDE?['Abgelegte Steuerfachwirt-Prüfung','Erfahrung in der Steuerberatung','DATEV-Kenntnisse','Strukturierte Arbeitsweise']:['Passed Steuerfachwirt examination','Experience in tax advisory','DATEV knowledge','Structured way of working']).map(function(r) { return e('li', { key:r, className:'flex items-start gap-3 text-sm leading-relaxed' }, e(Ico,{name:'checkCircle',size:15}), r); }))
        ),
      ),
    ),
    e('section', { className:'py-14 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'max-w-2xl mx-auto rounded-3xl p-10 md:p-12', style:{ backgroundColor:'var(--offwhite)' } },
          e('p', { className:'label mb-4' }, isDE?'Jetzt bewerben':'Apply now'),
          e('h2', { className:'font-display mb-8', style:{ fontSize:'clamp(1.6rem,3vw,2.2rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, isDE?'Wir freuen uns auf Sie.':'We look forward to hearing from you.'),
          e(KarriereForm, { lang:lang, jobTitle:isDE?jobTitleDE:jobTitleEN }),
        ),
      ),
    ),
  );
}
function KarriereSfaPage({ setPage, lang, t }) {
  useScrollAnim();
  var isDE = lang === 'DE';
  var jobTitleDE = 'Steuerfachangestellte/r';
  var jobTitleEN = 'Tax Clerk';
  return e('div', { className:'page-enter' },
    e(PageHero, { label:isDE?'Karriere bei NSBB':'Career at NSBB', title:isDE?'Steuerfachangestellte/r':'Tax Clerk', subtitle:isDE?'Voll- oder Teilzeit · Berlin oder Köln':'Full or part time · Berlin or Cologne', back:isDE?'Alle Stellen':'All positions', backFn:function(){ setPage('karriere'); } }),
    e('section', { className:'py-14 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('p', { className:'text-base leading-relaxed max-w-2xl', style:{ color:'var(--muted)' } }, isDE?'Als Steuerfachangestellte/r bei NSBB übernehmen Sie eigenverantwortlich die laufende Betreuung unserer Mandanten – in einer modernen, digitalen Kanzlei.':'As a Tax Clerk at NSBB, you take independent responsibility for the ongoing support of our clients – within a modern, digital firm.'),
      ),
    ),
    e('section', { className:'py-14', style:{ backgroundColor:'var(--offwhite)' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12' },
        e('div', null,
          e('p', { className:'label mb-4' }, isDE?'Das erwartet Sie':'What to expect'),
          e('ul', { className:'space-y-3 mt-2' }, (isDE?['Erstellung von Steuererklärungen','Laufende Finanzbuchhaltung','Kommunikation mit Mandanten','Mitwirkung bei digitalen Prozessen']:['Preparation of tax returns','Ongoing financial accounting','Communication with clients','Involvement in digital processes']).map(function(task) { return e('li', { key:task, className:'flex items-start gap-3 text-sm leading-relaxed' }, e(Ico,{name:'checkCircle',size:15}), task); }))
        ),
        e('div', null,
          e('p', { className:'label mb-4' }, isDE?'Das bringen Sie mit':'Your profile'),
          e('ul', { className:'space-y-3 mt-2' }, (isDE?['Abgeschlossene Ausbildung als Steuerfachangestellte/r','DATEV-Grundkenntnisse','Sorgfältige Arbeitsweise','Teamfähigkeit']:['Completed training as a tax clerk','Basic DATEV knowledge','Careful way of working','Team spirit']).map(function(r) { return e('li', { key:r, className:'flex items-start gap-3 text-sm leading-relaxed' }, e(Ico,{name:'checkCircle',size:15}), r); }))
        ),
      ),
    ),
    e('section', { className:'py-14 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'max-w-2xl mx-auto rounded-3xl p-10 md:p-12', style:{ backgroundColor:'var(--offwhite)' } },
          e('p', { className:'label mb-4' }, isDE?'Jetzt bewerben':'Apply now'),
          e('h2', { className:'font-display mb-8', style:{ fontSize:'clamp(1.6rem,3vw,2.2rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, isDE?'Wir freuen uns auf Sie.':'We look forward to hearing from you.'),
          e(KarriereForm, { lang:lang, jobTitle:isDE?jobTitleDE:jobTitleEN }),
        ),
      ),
    ),
  );
}
function KarriereBbhPage({ setPage, lang, t }) {
  useScrollAnim();
  var isDE = lang === 'DE';
  var jobTitleDE = 'Bilanzbuchhalter/in';
  var jobTitleEN = 'Financial Accountant';
  return e('div', { className:'page-enter' },
    e(PageHero, { label:isDE?'Karriere bei NSBB':'Career at NSBB', title:isDE?'Bilanzbuchhalter/in':'Financial Accountant', subtitle:isDE?'Voll- oder Teilzeit · Berlin oder Köln':'Full or part time · Berlin or Cologne', back:isDE?'Alle Stellen':'All positions', backFn:function(){ setPage('karriere'); } }),
    e('section', { className:'py-14 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('p', { className:'text-base leading-relaxed max-w-2xl', style:{ color:'var(--muted)' } }, isDE?'Als Bilanzbuchhalter/in bei NSBB übernehmen Sie eigenverantwortlich anspruchsvolle Mandate in der Finanzbuchhaltung – in einer modernen, digitalen Kanzlei.':'As a Financial Accountant at NSBB, you take independent responsibility for demanding mandates in financial accounting – within a modern, digital firm.'),
      ),
    ),
    e('section', { className:'py-14', style:{ backgroundColor:'var(--offwhite)' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12' },
        e('div', null,
          e('p', { className:'label mb-4' }, isDE?'Das erwartet Sie':'What to expect'),
          e('ul', { className:'space-y-3 mt-2' }, (isDE?['Betreuung eines festen Mandantenstamms','Steuerliche Beratung von Unternehmen und Privatpersonen','Erstellung von Jahresabschlüssen und Steuererklärungen','Begleitung von Betriebsprüfungen','Unterstützung bei der Steuerplanung']:['Support for an established client portfolio','Tax advisory for businesses and private individuals','Preparation of annual accounts and tax returns','Support during tax audits','Support with tax planning']).map(function(task) { return e('li', { key:task, className:'flex items-start gap-3 text-sm leading-relaxed' }, e(Ico,{name:'checkCircle',size:15}), task); }))
        ),
        e('div', null,
          e('p', { className:'label mb-4' }, isDE?'Das bringen Sie mit':'Your profile'),
          e('ul', { className:'space-y-3 mt-2' }, (isDE?['IHK-geprüfte/r Bilanzbuchhalter/in','Erfahrung in der Steuerberatung','DATEV-Kenntnisse','Strukturierte Arbeitsweise']:['Certified Bilanzbuchhalter (IHK)','Experience in tax advisory','DATEV knowledge','Structured way of working']).map(function(r) { return e('li', { key:r, className:'flex items-start gap-3 text-sm leading-relaxed' }, e(Ico,{name:'checkCircle',size:15}), r); }))
        ),
      ),
    ),
    e('section', { className:'py-14 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'max-w-2xl mx-auto rounded-3xl p-10 md:p-12', style:{ backgroundColor:'var(--offwhite)' } },
          e('p', { className:'label mb-4' }, isDE?'Jetzt bewerben':'Apply now'),
          e('h2', { className:'font-display mb-8', style:{ fontSize:'clamp(1.6rem,3vw,2.2rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, isDE?'Wir freuen uns auf Sie.':'We look forward to hearing from you.'),
          e(KarriereForm, { lang:lang, jobTitle:isDE?jobTitleDE:jobTitleEN }),
        ),
      ),
    ),
  );
}
function KarriereInitPage({ setPage, lang, t }) {
  useScrollAnim();
  var isDE = lang === 'DE';
  var jobTitleDE = 'Initiativbewerbung';
  var jobTitleEN = 'Speculative Application';
  return e('div', { className:'page-enter' },
    e(PageHero, { label:isDE?'Karriere bei NSBB':'Career at NSBB', title:isDE?'Initiativbewerbung':'Speculative Application', subtitle:isDE?'Alle Positionen · Berlin oder Köln':'All positions · Berlin or Cologne', back:isDE?'Alle Stellen':'All positions', backFn:function(){ setPage('karriere'); } }),
    e('section', { className:'py-14 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('p', { className:'text-base leading-relaxed max-w-2xl', style:{ color:'var(--muted)' } }, isDE?'Bei NSBB erwartet Sie eigenverantwortliche Mandantenarbeit in einem eingespielten Team – in einer modernen, digitalen Kanzlei.':'At NSBB, independent client work awaits you within a well-established team – in a modern, digital firm.'),
      ),
    ),
    e('section', { className:'py-14', style:{ backgroundColor:'var(--offwhite)' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12' },
        e('div', null,
          e('p', { className:'label mb-4' }, isDE?'Das erwartet Sie':'What to expect'),
          e('ul', { className:'space-y-3 mt-2' }, (isDE?['Vielfältige Aufgaben in der steuerlichen Beratung','Betreuung eines abwechslungsreichen Mandantenkreises','Moderne, vollständig digitale Arbeitsprozesse','Individuelle Entwicklungs- und Weiterbildungsmöglichkeiten']:['Varied tasks in tax advisory','Support for a diverse portfolio of clients','Modern, fully digital working processes','Individual development and training opportunities']).map(function(task) { return e('li', { key:task, className:'flex items-start gap-3 text-sm leading-relaxed' }, e(Ico,{name:'checkCircle',size:15}), task); }))
        ),
        e('div', null,
          e('p', { className:'label mb-4' }, isDE?'Das bringen Sie mit':'Your profile'),
          e('ul', { className:'space-y-3 mt-2' }, (isDE?['Ausbildung oder Studium im steuerlichen Bereich','Freude an Mandantenbetreuung','Interesse an digitalen Prozessen','Teamfähigkeit und Verlässlichkeit']:['Training or degree in a tax-related field','Enjoyment of client relationships','Interest in digital processes','Team spirit and reliability']).map(function(r) { return e('li', { key:r, className:'flex items-start gap-3 text-sm leading-relaxed' }, e(Ico,{name:'checkCircle',size:15}), r); }))
        ),
      ),
    ),
    e('section', { className:'py-14 bg-white' },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'max-w-2xl mx-auto rounded-3xl p-10 md:p-12', style:{ backgroundColor:'var(--offwhite)' } },
          e('p', { className:'label mb-4' }, isDE?'Jetzt bewerben':'Apply now'),
          e('h2', { className:'font-display mb-8', style:{ fontSize:'clamp(1.6rem,3vw,2.2rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, isDE?'Wir freuen uns auf Sie.':'We look forward to hearing from you.'),
          e(KarriereForm, { lang:lang, jobTitle:isDE?jobTitleDE:jobTitleEN }),
        ),
      ),
    ),
  );
}



/* ─────────────────────────────────────────────────────────
   FAQ PAGE
───────────────────────────────────────────────────────── */
const T = {
  DE: {
    // Nav
    navBook: 'Kontakt',
    navCall: 'Anrufen',
    navHome: 'Startseite', navLeistungen: 'Leistungen',
    navLeistUnternehmen: 'Unternehmen',
    navLeistInternational: 'Internationales Steuerrecht',
    navLeistPrivat: 'Privatpersonen',
    navDigital: 'Digitale Kanzlei',
    navTGS: 'TGS International',
    navInsights: 'Insights',
    navUeber: 'Über uns',
    navTeam: 'Team',
    navKarriere: 'Karriere',
    navNachfolge: 'Kanzleinachfolge',
    navKontakt: 'Kontakt',
    // Hero
    heroBadge: 'Berlin & Köln',
    heroH1a: 'Strategisch beraten.',
    heroH1b: 'Digital begleitet.',
    heroH1c: 'Persönlich verbunden.',
    heroSub: 'Wir begleiten Unternehmer, Unternehmen und Privatpersonen bei Wachstum, Strukturierung und steuerlichen Entscheidungen – von der laufenden Beratung bis zu komplexen nationalen und internationalen Fragestellungen.',
    heroCta1: 'Steuerliche Beratung anfragen',
    heroCta2: 'Unsere Leistungen',
    heroStat1: 'Standorte', heroStat2: 'Berufsträger', heroStat3: 'Mitarbeiter', heroStat4: 'Global Network',
    heroCard1title: 'Digitale Kanzlei', heroCard2title: 'Netzwerk', heroCard2sub: 'Weltweit vernetzt',
    // Trust bar
    trustDigital: 'Digitale Kanzlei', trustStandorte: 'Berlin & Köln',
    // Digital teaser
    digitalLabel: 'Digitale Kanzlei',
    digitalH2: 'Moderne Zusammenarbeit, die wirklich funktioniert.',
    digitalSub: 'Vollständig digital – mit klaren Prozessen, festen Ansprechpartnern und modernen Systemen. So sparen Sie Zeit, behalten jederzeit den Überblick und schaffen Freiräume für Ihr Unternehmen.',
    digitalBenefits: ['Digitale Belegübermittlung','Feste Ansprechpartner','Schnelle Kommunikation','Transparente Prozesse'],
    digitalCta: 'So funktioniert die Zusammenarbeit',
    digitalMore: '& weitere moderne Systeme',
    // Services
    servicesLabel: 'Unsere Leistungen',
    servicesH2: 'Breite Expertise. Klarer Fokus.',
    servicesSub: 'Drei Schwerpunkte. Ein Anspruch: persönliche Beratung, klare Lösungen und langfristige Perspektiven.',
    servicesMore: 'Mehr erfahren',
    servicesAll: 'Alle Leistungen',
    servicesData: [
      { label:'Für Unternehmen', key:'leistungen-unternehmen', title:'Unternehmen', desc:'Steuerliche und betriebswirtschaftliche Begleitung für Unternehmen – persönlich, vorausschauend und aus einer Hand.', items:['Laufende Steuerberatung','Gestaltungsberatung','Betriebswirtschaftliche Beratung'] },
      { label:'Internationales Steuerrecht', key:'leistungen-international', title:'Grenzüberschreitend. Strukturiert.', desc:'Internationale Steuerberatung für Unternehmen und Privatpersonen – von grenzüberschreitenden Sachverhalten bis zu komplexen Strukturen.', items:['Inbound-Sachverhalte','Outbound-Sachverhalte','Internationale Strukturen','Grenzüberschreitende Besteuerung'] },
      { label:'Für Privatpersonen', key:'leistungen-privat', title:'Persönliche Steuerberatung', desc:'Persönliche Beratung für private steuerliche Fragestellungen.', items:['Einkommensteuer','Erbschaft & Schenkung','Immobilien','Vermögensnachfolge'] },
    ],
    // Why
    whyLabel: 'Warum NSBB',
    whyH2: 'Eine Kanzlei, die anders denkt.',
    whySub: 'Wir verbinden steuerliche Kompetenz mit digitaler Effizienz und persönlichem Anspruch – für eine Zusammenarbeit, die sich richtig anfühlt.',
    whyData: [
      { icon:'zap', title:'Digital & effizient', desc:'Vollständig digitale Prozesse, moderne Systeme und kurze Kommunikationswege sparen Zeit und schaffen Freiräume für das Wesentliche.' },
      { icon:'users', title:'Persönliche Betreuung', desc:'Kein Callcenter, kein Wechsel – Sie haben feste Ansprechpartner, die Ihr Unternehmen und Ihre Situation kennen.' },
      { icon:'globe', title:'International vernetzt', desc:'Internationale Sachverhalte begleiten wir eigenständig und bei Bedarf gemeinsam mit unserem weltweiten TGS-Netzwerk – koordiniert, zuverlässig und grenzüberschreitend.' },
      { icon:'target', title:'Strategisch & vorausschauend', desc:'Steuerliche Entscheidungen betrachten wir nicht isoliert, sondern im Zusammenhang mit Ihren langfristigen Zielen, Ihrem Vermögen und Ihrer unternehmerischen Entwicklung.' },
    ],
    // TGS teaser
    tgsTeaserLabel: 'Internationales Netzwerk',
    tgsTeaserH2a: 'Internationale Steuerberatung.',
    tgsTeaserH2b: 'Weltweit vernetzt.',
    tgsTeaserSub: 'Internationale Sachverhalte begleiten wir eigenständig und bei Bedarf gemeinsam mit unserem weltweiten TGS-Netzwerk. So erhalten unsere Mandanten auch bei komplexen grenzüberschreitenden Fragestellungen eine koordinierte Beratung aus einer Hand.',
    tgsTeaserCta: 'Unser internationales Netzwerk',
    // Insights teaser
    insightsLabel: 'Insights & Expertise',
    insightsH2: 'Wissen, das weiterhilft.',
    insightsAll: 'Alle Beiträge',
    insightsRead: 'Lesen',
    insightsPosts: [
      { tag:'GmbH', title:'Holdingstruktur aufbauen: Wann es sich lohnt', date:'12. Mai 2025' },
      { tag:'E-Commerce', title:'Steuerliche Herausforderungen im Online-Handel', date:'5. Mai 2025' },
      { tag:'International', title:'Wegzugsbesteuerung für GmbH-Gesellschafter', date:'28. April 2025' },
    ],
    // Contact CTA
    ctaLabel: 'Jetzt Kontakt aufnehmen',
    ctaH2: 'Lassen Sie uns über Ihr Anliegen sprechen.',
    ctaSub: 'Ob laufende Steuerberatung, internationale Fragestellungen oder strategische Entscheidungen – wir freuen uns darauf, Ihr Anliegen kennenzulernen und gemeinsam den passenden Weg zu finden.',
    ctaBtn1: 'Kontakt aufnehmen',
    ctaBtn2: 'Kontakt aufnehmen',
    // Footer
    footerCta: 'Bereit für den nächsten Schritt?',
    footerCtaH2: 'Lernen Sie uns kennen – modern, digital, persönlich.',
    footerCtaBtn: 'Kontakt aufnehmen',
    footerDesc: 'Moderne digitale Steuerkanzlei mit Niederlassungen in Berlin und Köln. Mitglied des TGS International Netzwerks.',
    footerLinkLeistungen: 'Leistungen', footerLinkKanzlei: 'Kanzlei', footerLinkRechtliches: 'Rechtliches',
    footerCopyright: `© ${new Date().getFullYear()} NSBB Steuerberatung GmbH. Alle Rechte vorbehalten.`,
    // Pages – shared
    backAll: 'Alle Leistungen',
    moreLearn: 'Mehr erfahren',
    // Leistungen overview
    leistungenLabel: 'Leistungen',
    leistungenH1a: 'Breite Expertise.',
    leistungenH1b: 'Klarer Fokus.',
    leistungenSub: 'Wir begleiten Unternehmen, internationale Mandanten und Privatpersonen mit fundierter Expertise, modernen digitalen Prozessen und persönlichem Anspruch.',
    // Digital page
    digitalPageLabel: 'Digitale Kanzlei',
    digitalPageH1a: 'Moderne Zusammenarbeit,',
    digitalPageH1b: 'die wirklich funktioniert.',
    digitalPageSub: 'Vollständig digital – mit strukturierten Prozessen, modernen Systemen und einer Zusammenarbeit, die Ihnen Zeit spart.',
    digitalToolsLabel: 'Unsere Systeme',
    digitalToolsH2: 'Bewährte Tools. Reibungslose Prozesse.',
    digitalBenefitsLabel: 'Ihre Vorteile',
    digitalBenefitsH2: 'Was digitale Zusammenarbeit für Sie bedeutet.',
    digitalStepsLabel: 'Wie es funktioniert',
    digitalStepsH2: 'In drei Schritten zu digitaler Zusammenarbeit.',
    digitalBenefitData: [
      { icon:'zap', t:'Zeitersparnis', d:'Keine Zettelwirtschaft, kein Postversand. Belege werden digital übermittelt, Dokumente sofort bereitgestellt.' },
      { icon:'refresh', t:'Aktuelle Zahlen', d:'Durch digitale Buchhaltungsprozesse haben Sie jederzeit Zugriff auf aktuelle betriebswirtschaftliche Daten.' },
      { icon:'mapPin', t:'Ortsunabhängig', d:'Ob Berlin, Köln oder weltweit – unsere Zusammenarbeit funktioniert von überall.' },
      { icon:'lock', t:'Sicher & DSGVO-konform', d:'Alle Systeme nach deutschen Datenschutzstandards. Ihre Daten sind bei uns sicher.' },
    ],
    digitalStepData: [
      { s:'01', t:'Einfaches Onboarding', d:'Ein kurzes Gespräch, ein Klick – und Sie sind dabei. Wir richten Ihren persönlichen MyDATEV-Zugang ein, erklären alles und stehen vom ersten Tag an als persönlicher Ansprechpartner bereit.' },
      { s:'02', t:'Belege einfach digital senden', d:'Kein Postfach, kein Scannen, kein Stress. Fotos mit dem Smartphone, Upload im MyDATEV-Portal oder direkte DATEV-Anbindung – Ihre Belege kommen sicher und strukturiert zu uns.' },
      { s:'03', t:'Transparenz in Echtzeit', d:'Sie sehen Ihre aktuellen Zahlen, erhalten Ihre BWA pünktlich und bekommen Antworten schnell – digital, persönlich und auf den Punkt. So bleibt mehr Zeit für das Wesentliche: Ihr Unternehmen.' },
    ],
    // TGS page
    tgsH1: 'Die steuerliche Beratung endet nicht an der Landesgrenze.',
    tgsSub: 'Als unabhängiges Mitglied von TGS International begleiten wir grenzüberschreitende Sachverhalte weltweit.',
    tgsNetworkLabel: 'Unser Netzwerk',
    tgsNetworkH2: 'Global vernetzt. Unabhängig aufgestellt.',
    tgsNetworkText1: 'TGS International ist ein weltweiter Zusammenschluss unabhängiger Wirtschaftsprüfungs- und Steuerberatungskanzleien. NSBB ist eigenständiges deutsches Mitglied und koordiniert für unsere Mandanten international.',
    tgsRegionsLabel: 'Globale Reichweite',
    tgsRegionsH2: 'Präsenz in allen Regionen.',
    tgsRegions: [
      { l:'Europa', c:'Deutschland, Österreich, Schweiz, Großbritannien, Frankreich, Niederlande, Spanien, Polen, …' },
      { l:'Asien-Pazifik', c:'China, Indien, Indonesien, Singapur, Hongkong, Thailand, Israel, Saudi-Arabien, …' },
      { l:'Nordamerika', c:'USA, Mexiko' },
      { l:'Latein- und Südamerika', c:'Brasilien, Argentinien, Chile, Bolivien, Costa Rica, Peru' },
      { l:'Mittlerer Osten & Afrika', c:'VAE, Türkei, Marokko, Tunesien, Ghana, Senegal, Kamerun, Elfenbeinküste, …' },
    ],
    tgsStats: [{ v:'66', l:'Mitgliedsfirmen' },{ v:'58', l:'Länder' },{ v:'4.400+', l:'Fachkräfte weltweit' }],
    // Über uns
    ueberLabel: 'Über uns',
    ueberH1a: 'Eine Kanzlei',
    ueberH1b: 'mit Haltung.',
    ueberSub: 'NSBB ist eine moderne Steuerberatungsgesellschaft mit Standorten in Berlin und Köln. Wir verbinden steuerliche Kompetenz mit digitaler Effizienz.',
    ueberPhilLabel: 'Unsere Philosophie',
    ueberPhilH2: 'Moderne Beratung. Menschliche Zusammenarbeit.',
    ueberPhilP1: 'Gute Steuerberatung bedeutet für uns mehr als Steuererklärungen und Jahresabschlüsse. Wir verstehen uns als strategische Partner unserer Mandanten – denken unternehmerisch mit und begleiten langfristig.',
    ueberPhilP2: 'Digital aufgestellt, persönlich erreichbar, strukturiert in jedem Prozess – das ist unser Anspruch an uns selbst.',
    ueberValuesData: [
      { t:'Persönlich', d:'Immer ein fester Ansprechpartner – kein Callcenter, kein Massenbetrieb.' },
      { t:'Digital', d:'Vollständig digital – für maximale Effizienz und ortsunabhängige Zusammenarbeit.' },
      { t:'Strukturiert', d:'Klare Prozesse, transparente Kommunikation und strukturierte Abläufe.' },
      { t:'Langfristig', d:'Wir denken in langfristigen Mandantenbeziehungen – nicht in Einzelmandaten.' },
    ],
    ueberTeamLabel: 'Unsere Berufsträger',
    ueberTeamH2: 'Persönlich. Kompetent. Verlässlich.',
    ueberFotoFollows: 'Foto folgt',
    ueberProfileView: 'Profil ansehen',
    ueberStandortLabel: 'Unsere Standorte',
    ueberStandortH2: 'Berlin & Köln.',
    modalWerdegang: 'Werdegang',
    modalSchwerpunkte: 'Beratungsschwerpunkte',
    // Insights page
    insightsPageLabel: 'Insights & Expertise',
    insightsPageH1a: 'Wissen, das',
    insightsPageH1b: 'weiterhilft.',
    insightsPageSub: 'Steuerliches Expertenwissen für wachstumsorientierte Unternehmer – strukturiert, verständlich und praxisnah.',
    insightsPageRead: 'Lesen',
    insightsPageCats: ['Alle','GmbH','Holdingstrukturen','E-Commerce','International','Unternehmer','Immobilien','Digitalisierung'],
    insightsPagePosts: [
      { tag:'GmbH', title:'Holdingstruktur aufbauen: Wann es sich lohnt und worauf Sie achten sollten', excerpt:'Eine Holdingstruktur kann steuerlich erhebliche Vorteile bieten – aber sie ist nicht für jedes Unternehmen sinnvoll.', date:'12. Mai 2025' },
      { tag:'E-Commerce', title:'Steuerliche Herausforderungen im Online-Handel – ein Überblick', excerpt:'E-Commerce-Unternehmen sehen sich mit einer Vielzahl steuerlicher Besonderheiten konfrontiert.', date:'5. Mai 2025' },
      { tag:'International', title:'Wegzugsbesteuerung: Was GmbH-Gesellschafter wissen müssen', excerpt:'Der Wegzug ins Ausland kann für GmbH-Gesellschafter erhebliche steuerliche Konsequenzen haben.', date:'28. April 2025' },
      { tag:'GmbH', title:'GmbH-Gründung: Die wichtigsten steuerlichen Aspekte', excerpt:'Die GmbH ist die beliebteste Rechtsform für Unternehmer in Deutschland.', date:'20. April 2025' },
      { tag:'Unternehmer', title:'Betriebsprüfung: So bereiten Sie sich optimal vor', excerpt:'Mit der richtigen Vorbereitung verliert die Betriebsprüfung ihren Schrecken.', date:'14. April 2025' },
      { tag:'Immobilien', title:'Immobilienbesteuerung 2025: Was sich geändert hat', excerpt:'Die steuerlichen Rahmenbedingungen für Immobilieninvestoren haben sich verändert.', date:'7. April 2025' },
    ],
    // Karriere
    karriereLabel: 'Karriere',
    karriereH1a: 'Fachlich stark.',
    karriereH1b: 'Menschlich nah.',
    karriereSub: 'Wir sind eine moderne, vollständig digitale Kanzlei mit persönlicher Atmosphäre, flachen Hierarchien und echten Entwicklungsmöglichkeiten.',
    karriereCultureLabel: 'Kanzleikultur',
    karriereCultureH2: 'Mehr Verantwortung. Mehr Entwicklung. Mehr Zukunft.',
    karriereCultureP1: 'Bei NSBB arbeiten Sie in einem kleinen, eingespielten Team – mit kurzen Wegen, offenem Austausch und dem Vertrauen, dass Sie Ihre Aufgaben eigenverantwortlich erledigen.',
    karriereCultureP2: 'Digital und modern, ohne dabei unpersönlich zu werden. Strukturiert, ohne starr zu sein.',
    karriereBenefits: [
      { icon:'home', t:'Homeoffice & hybrid', d:'Flexible Arbeitsmodelle – im Büro oder von zuhause, ganz nach Vereinbarung.' },
      { icon:'zap', t:'Faire Vergütung', d:'Attraktive, faire Vergütung, die Ihrer Qualifikation und Erfahrung entspricht.' },
      { icon:'clock', t:'Flexible Arbeitszeiten', d:'Wir denken in Ergebnissen. Faire und flexible Zeitgestaltung.' },
      { icon:'laptop', t:'Digital arbeiten', d:'Vollständig digitale Prozesse und papierlose Zusammenarbeit.' },
      { icon:'users', t:'Persönliche Entwicklung', d:'Regelmäßige Weiterbildungen und klare Entwicklungsperspektiven.' },
      { icon:'globe', t:'Internationales Netzwerk', d:'Bei grenzüberschreitenden Fragestellungen greifen wir auf erfahrene internationale Ansprechpartner zurück.' },
      { icon:'heart', t:'Persönliches Miteinander', d:'Kollegiale Zusammenarbeit, kurze Entscheidungswege und ein Team, das sich gegenseitig unterstützt.' },
    ],
    karrierePositionsLabel: 'Offene Stellen',
    karrierePositionsH2: 'Wir suchen Verstärkung.',
    karriereInitiative: 'Kein passendes Angebot dabei?',
    karriereInitiativeText: 'Wir freuen uns auch über Initiativbewerbungen – schreiben Sie uns einfach.',
    karriereInitiativeBtn: 'Initiativ bewerben',
        karriereSteps: [
      { s:'01', t:'In 2 Minuten bewerben', d:'Kurzes Bewerbungsformular. Kein Anschreiben erforderlich.' },
      { s:'02', t:'Persönliches Kennenlernen', d:'Wir melden uns zeitnah für ein erstes Gespräch.' },
      { s:'03', t:'Gegenseitiger Austausch', d:'Lernen Sie das Team, die Kanzlei und Ihre Aufgaben kennen.' },
      { s:'04', t:'Kontinuität für Mandanten und Mitarbeitende', d:'Bestehende Mandantenbeziehungen, Mitarbeitendenstrukturen und gewachsene Werte werden bewahrt und verantwortungsvoll langfristig weitergeführt.' },
    ],
    karrierePositions: [
      { t:'Steuerberater/in', typ:'Voll- oder Teilzeit', loc:'Berlin oder Köln', route:'karriere-steuerberater' },
      { t:'Steuerfachwirt/in', typ:'Voll- oder Teilzeit', loc:'Berlin oder Köln', route:'karriere-steuerfachwirt' },
      { t:'Bilanzbuchhalter/in', typ:'Voll- oder Teilzeit', loc:'Berlin oder Köln', route:'karriere-bilanzbuchhalter' },
      { t:'Steuerfachangestellte/r', typ:'Voll- oder Teilzeit', loc:'Berlin oder Köln', route:'karriere-steuerfachangestellte' },
      { t:'Initiativbewerbung', typ:'Alle Positionen', loc:'Berlin oder Köln', route:'karriere-initiativbewerbung' },
    ],
    // Kanzleinachfolge
    nachfolgeLabel: 'Kanzleinachfolge',
    nachfolgeH1: 'Ihr Lebenswerk verdient einen verlässlichen Nachfolger.',
    nachfolgeSub: 'Sie denken an die Übergabe Ihrer Kanzlei? Wir begleiten diesen Prozess mit Sorgfalt, Diskretion und langjähriger Erfahrung.',
    nachfolgeExpLabel: 'Erfahrung & Vertrauen',
    nachfolgeExpH2: 'Bewährte Erfahrung in der Kanzleiübernahme.',
    nachfolgeExpText: 'NSBB entstand im Jahr 2017 durch die Übernahme einer etablierten Berliner Steuerberatungskanzlei. Auf dieser Grundlage folgten vier weitere Übernahmen – sowohl in Berlin als auch in Köln – aus denen die heutige NSBB Steuerberatung GmbH hervorgegangen ist. Uns ist wichtig: Ihr Personal wird übernommen und weiterbeschäftigt, und Ihre Mandanten werden weiterhin persönlich und in gewohnter Qualität betreut. So bleibt für alle Beteiligten alles beim Bewährten – ein strukturierter, fairer und diskreter Prozess von der ersten Anfrage bis zur vollständigen Integration.',
    nachfolgeProofs: ['Persönliche Begleitung durch die Geschäftsführung','Übernahme und Weiterbeschäftigung Ihres Personals','Ihre Mandanten werden weiterhin persönlich betreut','Diskreter und strukturierter Prozess','Verantwortungsvolle Fortführung gewachsener Kanzleistrukturen'],
    nachfolgeProzessLabel: 'Unser Prozess',
    nachfolgeProzessH2: 'Transparent. Strukturiert. Diskret.',
    nachfolgeSteps: [
      { s:'01', t:'Vertrauliches Erstgespräch', d:'Nehmen Sie diskret Kontakt auf. Alle Gespräche behandeln wir streng vertraulich.' },
      { s:'02', t:'Gemeinsame Zukunftsperspektive entwickeln', d:'Persönliches Kennenlernen, Austausch über Ziele, Werte und mögliche Zukunftsperspektiven Ihrer Kanzlei.' },
      { s:'03', t:'Geordnete Übergabe & Integration', d:'Sorgfältige Übernahme, strukturierte Integration und kontinuierliche Begleitung während des gesamten Prozesses.' },
      { s:'04', t:'Kontinuität für Mandanten und Mitarbeitende', d:'Bestehende Mandantenbeziehungen, Mitarbeitendenstrukturen und gewachsene Werte werden bewahrt und verantwortungsvoll langfristig weitergeführt.' },
    ],
    nachfolgeDiscrLabel: 'Absolute Vertraulichkeit',
    nachfolgeDiscrH2: 'Absolute Vertraulichkeit. Von der ersten Anfrage bis zur erfolgreichen Übergabe.',
    nachfolgeDiscrText: 'Kanzleinachfolge ist Vertrauenssache. Deshalb behandeln wir jede Anfrage diskret, persönlich und streng vertraulich.',
    nachfolgeCtaLabel: 'Vertrauliche Anfrage',
    nachfolgeCtaH2: 'Lassen Sie uns über die Zukunft Ihrer Kanzlei sprechen.',
    nachfolgeCtaText: 'Alle Anfragen behandeln wir streng vertraulich. Erstgespräche sind unverbindlich und ohne Weitergabe von Informationen an Dritte.',
    nachfolgeCtaBtn: 'Vertrauliches Erstgespräch vereinbaren',
    // Kontakt
    kontaktLabel: 'Kontakt',
    kontaktH1a: 'Lassen Sie uns',
    kontaktH1b: 'sprechen.',
    kontaktSub: 'Schildern Sie uns Ihr Anliegen – wir melden uns persönlich bei Ihnen und besprechen den passenden nächsten Schritt.',
    kontaktDirectLabel: 'Direkt erreichen',
    kontaktStandortLabel: 'Unsere Standorte',
    kontaktHinweisTitle: 'Hinweis zur Terminbuchung',
    kontaktHinweisText: 'Wir vereinbaren ausschließlich Telefontermine. Nach Ihrer Qualifizierungsanfrage schalten wir den Kalender frei.',
    kontaktTabU: 'Unternehmen', kontaktTabP: 'Privatperson', kontaktTabI: 'Int. Steuerrecht',
    kontaktTabUdesc: 'GmbHs, wachstumsorientierte Unternehmen, digitale Unternehmen',
    kontaktTabPdesc: 'Einkommensteuer, Erbschaft, Schenkung, Kapitalanlagen',
    kontaktTabIdesc: 'Grenzüberschreitende Sachverhalte, internationale Strukturen, Expatriates',
    kontaktEmail: 'E-Mail-Adresse', kontaktPhone: 'Telefonnummer', kontaktPhoneOpt: 'Telefon',
    kontaktRechtsform: 'Rechtsform', kontaktUmsatz: 'Jahresumsatz (ca.)', kontaktMA: 'Mitarbeiteranzahl',
    kontaktBranche: 'Branche', kontaktBrancheOpt: '(optional)',
    kontaktLeistung: 'Gewünschte Leistung',
    kontaktEinkunftsarten: 'Einkunftsarten',
    kontaktSteuerjahr: 'Steuerjahr',
    kontaktSonstiges: 'Kurze Beschreibung',
    kontaktAnsaessigkeit: 'Ihre Ansässigkeit',
    kontaktSachverhalt: 'Sachverhaltsbeschreibung',
    kontaktBtnU: 'Weiter zur Terminbuchung',
    kontaktBtnPS: 'Anfrage absenden',
    kontaktWaiting: 'Bitte warten …',
    kontaktPrivacyNote: 'Ihre Daten werden ausschließlich zur Kontaktaufnahme verwendet.',
    kontaktSuccessTitle: 'Vielen Dank!',
    kontaktSuccessText: 'Wir melden uns schnellstmöglich bei Ihnen.',
    kontaktCalendlyTitle: 'Qualifizierung erfolgreich!',
    kontaktCalendlySub: 'Wählen Sie jetzt Ihren Telefontermin.',
    kontaktCalendlyNote: 'Nur Telefontermine. Kein Video-Call / Zoom.',
    kontaktCalendlyBtn: 'Termin auswählen',
    kontaktCalendlyEmbedNote: 'Calendly-Kalender für Telefontermine',
    kontaktErrEmail: 'Bitte gültige E-Mail-Adresse eingeben',
    kontaktErrPhone: 'Bitte Telefonnummer angeben',
    kontaktErrRechtsform: 'Bitte Rechtsform auswählen',
    kontaktErrUmsatz: 'Bitte Umsatz auswählen',
    kontaktErrMA: 'Bitte Mitarbeiteranzahl auswählen',
    kontaktErrLeistung: 'Bitte Leistung auswählen',
    kontaktErrAnsaessigkeit: 'Bitte auswählen',
    // Impressum
    impressumLabel: 'Rechtliches', impressumH1: 'Impressum',
  },

  EN: {
    navBook: 'Contact',
    navCall: 'Call us',
    navHome: 'Home', navLeistungen: 'Services',
    navLeistUnternehmen: 'Businesses',
    navLeistInternational: 'International Tax Law',
    navLeistPrivat: 'Private Clients',
    navDigital: 'Digital Office',
    navTGS: 'TGS International',
    navInsights: 'Insights',
    navUeber: 'About us',
    navTeam: 'Team',
    navKarriere: 'Careers',
    navNachfolge: 'Practice Succession',
    navKontakt: 'Contact',
    heroBadge: 'Berlin · Cologne',
    heroH1a: 'Strategic tax counsel.',
    heroH1b: 'Digital. Personal.',
    heroH1c: 'Built to last.',
    heroSub: 'We accompany entrepreneurs, companies and private individuals in growth, structuring and tax decisions – from ongoing advice to complex national and international matters.',
    heroCta1: 'Request tax advice',
    heroCta2: 'Our services',
    heroStat1: 'Offices', heroStat2: 'Partners', heroStat3: 'Team members', heroStat4: 'Global Network',
    heroCard1title: 'Digital Office', heroCard2title: 'Network', heroCard2sub: 'Connected worldwide',
    trustDigital: 'Digital Office', trustStandorte: 'Berlin & Cologne',
    digitalLabel: 'Digital Office',
    digitalH2: 'Modern collaboration that truly works.',
    digitalSub: 'Fully digital – with clear processes, dedicated advisors and modern systems. Save time, stay informed and create space for your business.',
    digitalBenefits: ['Digital document submission','Dedicated advisors','Fast communication','Transparent processes'],
    digitalCta: 'Learn more about our digital practice',
    digitalMore: '& more modern systems',
    servicesLabel: 'Our Services',
    servicesH2: 'Broad expertise. Clear focus.',
    servicesSub: 'Three focus areas. One commitment: personal advice, clear solutions and long-term perspectives.',
    servicesMore: 'Learn more',
    servicesAll: 'All services',
    servicesData: [
      { label:'For Businesses', key:'leistungen-unternehmen', title:'Businesses', desc:'From ongoing tax advice and structuring to business management support.', items:['Ongoing tax advisory','Structuring advisory','Business management advisory'] },
      { label:'International Tax Law', key:'leistungen-international', title:'Cross-border. Structured.', desc:'International matters from a single source – coordinated through our TGS network.', items:['Inbound matters','Outbound matters','International structures','Cross-border taxation'] },
      { label:'For Private Clients', key:'leistungen-privat', title:'Personal Tax Advisory', desc:'Discreet, precise and personal – for income tax, inheritance and more.', items:['Income tax returns','Inheritance & gift tax','Real estate taxation','Capital investments'] },
    ],
    whyLabel: 'Why NSBB',
    whyH2: 'A firm that thinks differently.',
    whySub: 'We combine tax expertise with digital efficiency and a personal approach – for a partnership that truly delivers.',
    whyData: [
      { icon:'zap', title:'Digital & efficient', desc:'Fully digital processes, modern systems and short communication channels save time and create space for what matters.' },
      { icon:'users', title:'Personal support', desc:'No call centre, no switching – you have dedicated advisors who know your business and your situation.' },
      { icon:'globe', title:'Internationally connected', desc:'We handle international matters independently and, where needed, together with our worldwide TGS network – coordinated, reliable and cross-border.' },
      { icon:'target', title:'Strategic & forward-thinking', desc:'We consider tax decisions not in isolation, but in the context of your long-term goals, your assets and your entrepreneurial development.' },
    ],
    tgsTeaserLabel: 'International Network',
    tgsTeaserH2a: 'International tax advisory.',
    tgsTeaserH2b: 'Globally connected.',
    tgsTeaserSub: 'We handle international matters independently and, where needed, together with our worldwide TGS network. This ensures our clients receive coordinated advice from a single source – even for complex cross-border situations.',
    tgsTeaserCta: 'Our international network',
    insightsLabel: 'Insights & Expertise',
    insightsH2: 'Knowledge that moves you forward.',
    insightsAll: 'All articles',
    insightsRead: 'Read',
    insightsPosts: [
      { tag:'GmbH', title:'Setting up a holding structure: When it makes sense', date:'12 May 2025' },
      { tag:'E-Commerce', title:'Tax challenges in online retail – an overview', date:'5 May 2025' },
      { tag:'International', title:'Exit taxation: what GmbH shareholders need to know', date:'28 April 2025' },
    ],
    ctaLabel: 'Get in touch',
    ctaH2: 'Let us talk about your situation.',
    ctaSub: 'Whether ongoing tax advice, international matters or strategic decisions – we look forward to understanding your situation and finding the right way forward together.',
    ctaBtn1: 'Get in touch',
    ctaBtn2: 'Get in touch',
    footerCta: 'Ready for the next step?',
    footerCtaH2: 'Meet us – modern, digital, personal.',
    footerCtaBtn: 'Schedule a consultation',
    footerDesc: 'Modern digital tax practice with offices in Berlin and Cologne. Member of the TGS International Network.',
    footerLinkLeistungen: 'Services', footerLinkKanzlei: 'Firm', footerLinkRechtliches: 'Legal',
    footerCopyright: `© ${new Date().getFullYear()} NSBB Steuerberatung GmbH. All rights reserved.`,
    backAll: 'All services',
    moreLearn: 'Learn more',
    leistungenLabel: 'Services',
    leistungenH1a: 'Broad expertise.',
    leistungenH1b: 'Clear focus.',
    leistungenSub: 'We serve businesses, international clients and private individuals with deep expertise, modern digital processes and a personal touch.',
    digitalPageLabel: 'Digital Office',
    digitalPageH1a: 'Modern collaboration',
    digitalPageH1b: 'that truly works.',
    digitalPageSub: 'Fully digital – with structured processes, modern systems and a working relationship that saves you time.',
    digitalToolsLabel: 'Our systems',
    digitalToolsH2: 'Proven tools. Seamless processes.',
    digitalBenefitsLabel: 'Your benefits',
    digitalBenefitsH2: 'What digital collaboration means for you.',
    digitalStepsLabel: 'How it works',
    digitalStepsH2: 'Three steps to digital collaboration.',
    digitalBenefitData: [
      { icon:'zap', t:'Time savings', d:'No paperwork, no post. Documents submitted digitally, instantly available.' },
      { icon:'refresh', t:'Up-to-date figures', d:'Digital accounting processes give you real-time access to your business data.' },
      { icon:'mapPin', t:'Location-independent', d:'Whether Berlin, Cologne or anywhere – our collaboration works remotely.' },
      { icon:'lock', t:'Secure & GDPR-compliant', d:'All systems meet German data protection standards. Your data is safe with us.' },
    ],
    digitalStepData: [
      { s:'01', t:'Simple onboarding', d:'A brief conversation and one click – and you are set up. We configure your personal MyDATEV access, explain everything and are your dedicated contact from day one.' },
      { s:'02', t:'Send documents digitally', d:'No post, no scanning, no stress. Photos on your smartphone, upload via MyDATEV portal or direct DATEV connection – your documents reach us securely and in a structured way.' },
      { s:'03', t:'Real-time transparency', d:'You can see your current figures, receive your P&L on time and get quick answers – digitally, personally and to the point. So you can focus on what matters: your business.' },
    ],
    tgsH1: 'Tax advice does not stop at the border.',
    tgsSub: 'As an independent TGS International member we handle cross-border matters worldwide.',
    tgsNetworkLabel: 'Our network',
    tgsNetworkH2: 'Globally connected. Independently run.',
    tgsNetworkText1: 'TGS International is a worldwide association of independent audit and tax firms. NSBB is an independent German member and coordinates international matters for our clients.',
    tgsRegionsLabel: 'Global reach',
    tgsRegionsH2: 'Present in every region.',
    tgsRegions: [
      { l:'Europe', c:'Germany, Austria, Switzerland, UK, France, Netherlands, Spain, Poland, …' },
      { l:'Asia-Pacific', c:'China, India, Indonesia, Singapore, Hong Kong, Thailand, Israel, Saudi Arabia, …' },
      { l:'North America', c:'USA, Mexico' },
      { l:'Latin & South America', c:'Brazil, Argentina, Chile, Bolivia, Costa Rica, Peru' },
      { l:'Middle East & Africa', c:'UAE, Turkey, Morocco, Tunisia, Ghana, Senegal, Cameroon, Ivory Coast, …' },
    ],
    tgsStats: [{ v:'66', l:'Member firms' },{ v:'58', l:'Countries' },{ v:'4,400+', l:'Professionals worldwide' }],
    ueberLabel: 'About us',
    ueberH1a: 'A firm',
    ueberH1b: 'with conviction.',
    ueberSub: 'NSBB is a modern tax advisory firm with offices in Berlin and Cologne. We combine tax expertise with digital efficiency.',
    ueberPhilLabel: 'Our philosophy',
    ueberPhilH2: 'Modern advice. Human collaboration.',
    ueberPhilP1: 'Good tax advice means more than tax returns and annual accounts. We see ourselves as strategic partners – thinking entrepreneurially alongside our clients for the long term.',
    ueberPhilP2: 'Digitally equipped, personally reachable, structured in every process – that is our commitment to ourselves.',
    ueberValuesData: [
      { t:'Personal', d:'Always a dedicated contact – no call centre, no mass operations.' },
      { t:'Digital', d:'Fully digital – maximum efficiency and location-independent collaboration.' },
      { t:'Structured', d:'Clear processes, transparent communication and structured workflows.' },
      { t:'Long-term', d:'We think in long-term client relationships – not single engagements.' },
    ],
    ueberTeamLabel: 'Our partners',
    ueberTeamH2: 'Personal. Competent. Reliable.',
    ueberFotoFollows: 'Photo coming soon',
    ueberProfileView: 'View profile',
    ueberStandortLabel: 'Our offices',
    ueberStandortH2: 'Berlin & Cologne.',
    modalWerdegang: 'Background',
    modalSchwerpunkte: 'Areas of expertise',
    insightsPageLabel: 'Insights & Expertise',
    insightsPageH1a: 'Knowledge that',
    insightsPageH1b: 'moves you forward.',
    insightsPageSub: 'Expert tax knowledge for growth-oriented entrepreneurs – structured, accessible and practice-oriented.',
    insightsPageRead: 'Read',
    insightsPageCats: ['All','GmbH','Holding structures','E-Commerce','International','Entrepreneurs','Real estate','Digitalisation'],
    insightsPagePosts: [
      { tag:'GmbH', title:'Setting up a holding structure: When it makes sense', excerpt:'A holding structure can offer significant tax and strategic advantages – but is not right for every business.', date:'12 May 2025' },
      { tag:'E-Commerce', title:'Tax challenges in online retail – a structured overview', excerpt:'E-commerce businesses face a wide range of tax complexities.', date:'5 May 2025' },
      { tag:'International', title:'Exit taxation: what GmbH shareholders need to know', excerpt:'Relocating abroad can have significant tax consequences for GmbH shareholders.', date:'28 April 2025' },
      { tag:'GmbH', title:'Forming a GmbH: The key tax considerations', excerpt:'The GmbH is the most popular legal form for entrepreneurs in Germany.', date:'20 April 2025' },
      { tag:'Entrepreneurs', title:'Tax audit: How to prepare effectively', excerpt:'With the right preparation a tax audit need not be a stressful event.', date:'14 April 2025' },
      { tag:'Real estate', title:'Real estate taxation 2025: What has changed', excerpt:'The tax framework for real estate investors has changed significantly in recent years.', date:'7 April 2025' },
    ],
    karriereLabel: 'Careers',
    karriereH1a: 'Modern work.',
    karriereH1b: 'Personally close.',
    karriereSub: 'We are a modern, fully digital firm with a personal atmosphere, flat hierarchies and genuine development opportunities.',
    karriereCultureLabel: 'Our culture',
    karriereCultureH2: 'More responsibility. More development. More future.',
    karriereCultureP1: 'At NSBB you work in a small, well-coordinated team – short lines of communication, open exchange and the trust to work independently.',
    karriereCultureP2: 'Digital and modern without losing the human element. Structured without being rigid.',
    karriereBenefits: [
      { icon:'home', t:'Remote & hybrid', d:'Flexible working models – in the office or from home, by arrangement.' },
      { icon:'zap', t:'Fair remuneration', d:'Attractive, fair pay reflecting your qualification and experience.' },
      { icon:'clock', t:'Flexible hours', d:'We think in results. Fair and flexible time management.' },
      { icon:'laptop', t:'Digital working', d:'Fully digital processes and paperless collaboration.' },
      { icon:'users', t:'Personal development', d:'Regular training and clear development prospects.' },
      { icon:'globe', t:'International network', d:'For cross-border matters we draw on experienced international contacts.' },
      { icon:'heart', t:'Personal team culture', d:'Collaborative teamwork, short decision paths and a team that supports each other.' },
    ],
    karrierePositionsLabel: 'Open positions',
    karrierePositionsH2: 'We are hiring.',
    karriereInitiative: 'Nothing that fits?',
    karriereInitiativeText: 'We welcome speculative applications too – just get in touch.',
    karriereInitiativeBtn: 'Apply speculatively',
        karriereSteps: [
      { s:'01', t:'Apply in 2 minutes', d:'Short form. No cover letter required.' },
      { s:'02', t:'Personal introduction', d:'We will be in touch promptly.' },
      { s:'03', t:'Mutual exchange', d:'Get to know the team and your future responsibilities.' },
      { s:'04', t:'Welcome to NSBB', d:'If it works for both sides, we start together.' },
    ],
    karrierePositions: [
      { t:'Tax advisor', typ:'Full or part time', loc:'Berlin or Cologne', route:'karriere-steuerberater' },
      { t:'Senior tax clerk', typ:'Full or part time', loc:'Berlin or Cologne', route:'karriere-steuerfachwirt' },
      { t:'Financial accountant', typ:'Full or part time', loc:'Berlin or Cologne', route:'karriere-bilanzbuchhalter' },
      { t:'Tax clerk', typ:'Full or part time', loc:'Berlin or Cologne', route:'karriere-steuerfachangestellte' },
      { t:'Speculative application', typ:'All positions', loc:'Berlin or Cologne', route:'karriere-initiativbewerbung' },
    ],
    nachfolgeLabel: 'Practice Succession',
    nachfolgeH1: 'Your life\'s work deserves a reliable successor.',
    nachfolgeSub: 'Thinking about handing over your practice? We guide this process with care, discretion and years of experience.',
    nachfolgeExpLabel: 'Experience & trust',
    nachfolgeExpH2: 'Proven expertise in practice acquisition.',
    nachfolgeExpText: 'NSBB was founded in 2017 through the acquisition of an established Berlin tax advisory practice. This was followed by four further acquisitions – in both Berlin and Cologne – giving rise to NSBB Steuerberatung GmbH as it stands today. What matters to us: your staff are retained and continue to be employed, and your clients receive the same personal, high-quality service they are used to. Everything proven stays in place – a structured, fair and discreet process from first contact to full integration.',
    nachfolgeProofs: ['Personal accompaniment by management','Retention of your staff','Your clients continue to receive personal support','Discreet and structured process','Responsible continuation of established practice structures'],
    nachfolgeProzessLabel: 'Our process',
    nachfolgeProzessH2: 'Transparent. Structured. Discreet.',
    nachfolgeSteps: [
      { s:'01', t:'Confidential first contact', d:'Reach out discreetly. All conversations are strictly confidential – no obligation.' },
      { s:'02', t:'Getting to know each other', d:'Joint introduction, practice analysis and transparent valuation – no pressure.' },
      { s:'03', t:'Structured takeover', d:'Careful integration, client care and full transition into NSBB structures.' },
      { s:'04', t:'Long-term support', d:'Your clients continue to receive personal, professional service – that is our promise.' },
    ],
    nachfolgeDiscrLabel: 'Absolute Confidentiality',
    nachfolgeDiscrH2: 'Absolute confidentiality. From the first enquiry to a successful handover.',
    nachfolgeDiscrText: 'Practice succession is a matter of trust. That is why we handle every enquiry with discretion and in strict confidence.',
    nachfolgeCtaLabel: 'Confidential enquiry',
    nachfolgeCtaH2: 'Contact us confidentially.',
    nachfolgeCtaText: 'All enquiries are treated in strict confidence. Initial consultations are non-binding and without disclosure to third parties.',
    nachfolgeCtaBtn: 'Arrange a confidential first meeting',
    kontaktLabel: 'Contact',
    kontaktH1a: 'Let\'s',
    kontaktH1b: 'touch.',
    kontaktSub: 'Tell us about your matter – we will get back to you personally and discuss the right next step together.',
    kontaktDirectLabel: 'Get in touch directly',
    kontaktStandortLabel: 'Our offices',
    kontaktHinweisTitle: 'Note on appointments',
    kontaktHinweisText: 'We arrange telephone appointments only. After your qualification request we will open the calendar.',
    kontaktTabU: 'Business', kontaktTabP: 'Private', kontaktTabI: 'Int. Tax Law',
    kontaktTabUdesc: 'GmbHs, growth-oriented businesses, digital companies',
    kontaktTabPdesc: 'Income tax, inheritance, gifts, capital investments',
    kontaktTabIdesc: 'Cross-border matters, international structures, expatriates',
    kontaktEmail: 'Email address', kontaktPhone: 'Phone number', kontaktPhoneOpt: 'Phone',
    kontaktRechtsform: 'Legal form', kontaktUmsatz: 'Annual turnover (approx.)', kontaktMA: 'Number of employees',
    kontaktBranche: 'Industry', kontaktBrancheOpt: '(optional)',
    kontaktLeistung: 'Service required',
    kontaktEinkunftsarten: 'Income types',
    kontaktSteuerjahr: 'Tax year',
    kontaktSonstiges: 'Brief description',
    kontaktAnsaessigkeit: 'Your country of residence',
    kontaktSachverhalt: 'Brief description of your matter',
    kontaktBtnU: 'Continue to booking',
    kontaktBtnPS: 'Submit enquiry',
    kontaktWaiting: 'Please wait …',
    kontaktPrivacyNote: 'Your data is used solely for contact purposes.',
    kontaktSuccessTitle: 'Thank you!',
    kontaktSuccessText: 'We will be in touch as soon as possible.',
    kontaktCalendlyTitle: 'Qualification successful!',
    kontaktCalendlySub: 'Now choose your telephone appointment.',
    kontaktCalendlyNote: 'Telephone appointments only. No video calls / Zoom.',
    kontaktCalendlyBtn: 'Choose appointment',
    kontaktCalendlyEmbedNote: 'Calendly calendar for telephone appointments',
    kontaktErrEmail: 'Please enter a valid email address',
    kontaktErrPhone: 'Please provide a phone number',
    kontaktErrRechtsform: 'Please select a legal form',
    kontaktErrUmsatz: 'Please select a turnover range',
    kontaktErrMA: 'Please select a headcount range',
    kontaktErrLeistung: 'Please select a service',
    kontaktErrAnsaessigkeit: 'Please select',
    impressumLabel: 'Legal', impressumH1: 'Legal Notice (Impressum)',
  },
};

/* ─────────────────────────────────────────────────────────
   APP ROUTER
───────────────────────────────────────────────────────── */

function CookieBanner({ lang }) {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const accepted = localStorage.getItem && localStorage.getItem('nsbb_cookies');
    if (!accepted) setShow(true);
  }, []);
  const accept = () => { try { localStorage.setItem('nsbb_cookies','1'); } catch(e){} setShow(false); };
  if (!show) return null;
  const isDE = lang === 'DE';
  return e('div', { className:'cookie-banner' },
    e('div', { style:{ flex:1, minWidth:'200px' } },
      e('p', { style:{ fontSize:'13px', fontWeight:600, color:'#1A1917', fontFamily:"'DM Sans',sans-serif", marginBottom:'4px' } }, isDE?'Wir verwenden Cookies':'We use cookies'),
      e('p', { style:{ fontSize:'12px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif" } }, isDE?'Diese Website verwendet technisch notwendige Cookies. Weitere Informationen in unserer Datenschutzerklärung.':'This website uses technically necessary cookies. See our privacy policy for details.'),
    ),
    e('div', { style:{ display:'flex', gap:'8px', flexShrink:0 } },
      e('button', { onClick:accept, style:{ padding:'9px 20px', borderRadius:'999px', background:'var(--accent)', color:'white', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:500, fontFamily:"'DM Sans',sans-serif" } }, isDE?'Akzeptieren':'Accept'),
    ),
  );
}

function isDE_skip(lang){ return lang==='DE' ? 'Zum Inhalt springen' : 'Skip to content'; }

function App() {
  const [page, setPageState] = useState(() => {
    const h = window.location.hash.replace('#','');
    const validPages = ['home','leistungen','leistungen-unternehmen','leistungen-unternehmen-leistungen','leistungen-unternehmen-laufend','leistungen-unternehmen-gestaltung','leistungen-unternehmen-bwl','leistungen-unternehmen-branchen','branche-ecommerce','branche-bau','branche-immobilien','branche-international','branche-startup','branche-aerzte','leistungen-international','intl-wegzug','intl-wohnsitz','intl-dba','intl-einkuenfte','intl-immobilien','intl-erbschaft','intl-schenkung','intl-rueckkehr','intl-grenzgaenger','intl-vermoegen','leistungen-privat','digital','tgs','insights','ueber-uns','karriere','karriere-steuerberater','karriere-steuerfachwirt','karriere-steuerfachangestellte','karriere-bilanzbuchhalter','karriere-initiativbewerbung','kanzleinachfolge','kontakt','impressum','datenschutz'];
    return validPages.includes(h) ? h : 'home';
  });
  const setPage = (p) => { setPageState(p); window.location.hash = p === 'home' ? '' : p; };
  const [kontaktPreset, setKontaktPreset] = useState(null);
  const [lang, setLang] = useState('DE');
  const t = T[lang];

  useEffect(() => { window.scrollTo(0, 0); }, [page]);
  useEffect(() => { document.documentElement.lang = lang.toLowerCase(); }, [lang]);
  const pageTitles = {'home':'NSBB – Steuerberatung Berlin & Köln | Modern. Digital. Persönlich.', 'leistungen':'Leistungen | NSBB Steuerberatung', 'leistungen-unternehmen':'Steuerberatung für Unternehmen | NSBB', 'leistungen-international':'Internationales Steuerrecht | NSBB', 'leistungen-privat':'Steuerberatung für Privatpersonen | NSBB', 'digital':'Digitale Kanzlei | NSBB Steuerberatung', 'tgs':'TGS International Netzwerk | NSBB', 'ueber-uns':'Über uns & Team | NSBB Steuerberatung', 'kontakt':'Kontakt aufnehmen | NSBB Steuerberatung Berlin & Köln', 'karriere':'Karriere bei NSBB | Steuerberater gesucht', 'kanzleinachfolge':'Kanzleinachfolge | NSBB Steuerberatung', 'impressum':'Impressum | NSBB Steuerberatung', 'datenschutz':'Datenschutz | NSBB Steuerberatung'};
  useEffect(() => { const t = pageTitles[page] || 'NSBB – Steuerberatung Berlin & Köln'; document.title = t; }, [page, lang]);

  const props = { setPage, lang, t, kontaktPreset, setKontaktPreset };

    const pages = {
    home: e(HomePage, props),
    leistungen: e(LeistungenUnternehmenPage, props),
    'leistungen-unternehmen': e(LeistungenUnternehmenPage, props),
    'leistungen-unternehmen-leistungen': e(LeistungenUnternehmenLeistungenPage, props),
    'leistungen-unternehmen-laufend': e(LeistungenLaufendePage, props),
    'leistungen-unternehmen-gestaltung': e(LeistungenGestaltungPage, props),
    'leistungen-unternehmen-bwl': e(LeistungenBWLPage, props),
    'leistungen-unternehmen-branchen': e(LeistungenBranchenPage, props),
    'branche-ecommerce': e(BrancheEcommercePage, props),
    'branche-bau': e(BrancheBauPage, props),
    'branche-immobilien': e(BrancheImmobilienPage, props),
    'branche-international': e(BrancheInternationalPage, props),
    'branche-startup': e(BrancheStartupPage, props),
    'branche-aerzte': e(BrancheAerztePage, props),
    'leistungen-international': e(LeistungenInternationalPage, props),
    'intl-wegzug': e(IntlWegzugPage, props),
    'intl-wohnsitz': e(IntlWohnsitzPage, props),
    'intl-dba': e(IntlDBAPage, props),
    'intl-einkuenfte': e(IntlEinkuenftePage, props),
    'intl-immobilien': e(IntlImmobilienPage, props),
    'intl-erbschaft': e(IntlErbschaftPage, props),
    'intl-schenkung': e(IntlSchenkungPage, props),
    'intl-rueckkehr': e(IntlRueckkehrPage, props),
    'intl-grenzgaenger': e(IntlGrenzgaengerPage, props),
    'intl-vermoegen': e(IntlVermoegenPage, props),
    'leistungen-privat': e(LeistungenPrivatPage, props),
    digital: e(DigitalPage, props),
    tgs: e(TGSPage, props),
    insights: e(InsightsPage, props),
    'ueber-uns': e(UeberUnsPage, props),
    karriere: e(KarrierePage, props),
    'karriere-steuerberater': e(KarriereStbPage, props),
    'karriere-steuerfachwirt': e(KarriereSfwPage, props),
    'karriere-steuerfachangestellte': e(KarriereSfaPage, props),
    'karriere-bilanzbuchhalter': e(KarriereBbhPage, props),
    'karriere-initiativbewerbung': e(KarriereInitPage, props),
    kanzleinachfolge: e(NachfolgePage, props),
    kontakt: e(KontaktPage, props),
    impressum: e(ImpressumPage, props),
    datenschutz: e(DatenschutzPage, props),
    faq: e(FAQPage, props),
  };

  return e('div', null,
    e('a', { href:'#main', className:'skip-link' }, isDE_skip(lang)),
    e(Nav, { page, setPage, lang, setLang, t }),
    e('main', { id:'main', role:'main', key: page + lang }, pages[page] || pages.home),
    e(Footer, { setPage, lang, t }),
    e(CookieBanner, { lang }),
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(e(App));

} // end bootApp

// ── Robust bootstrap ──────────────────────────────────────
// Waits until React AND ReactDOM are actually available (they may load from a
// fallback CDN asynchronously) before booting the app, instead of assuming they
// are ready immediately. Shows a clear message instead of an endless loader if
// loading takes too long (e.g. blocked network / offline).
(function(){
  var attempts = 0;
  var maxAttempts = 100; // ~10 seconds at 100ms
  function tryBoot() {
    if (window.React && window.ReactDOM) {
      try {
        bootApp();
      } catch (err) {
        showLoadError('Die Anwendung konnte nicht gestartet werden. Bitte laden Sie die Seite neu.', 'The application could not start. Please reload the page.');
        if (window.console) console.error(err);
      }
      return;
    }
    attempts++;
    if (attempts > maxAttempts) {
      showLoadError('Die Seite konnte nicht geladen werden. Bitte prüfen Sie Ihre Internetverbindung und laden Sie die Seite neu.', 'The page could not load. Please check your internet connection and reload.');
      return;
    }
    setTimeout(tryBoot, 100);
  }
  function showLoadError(deText, enText) {
    var loader = document.getElementById('nsbb-loader');
    if (!loader) return;
    loader.innerHTML =
      '<div style="font-size:34px;letter-spacing:.04em;color:#4A7C59;font-weight:500;margin-bottom:14px;">NSBB</div>' +
      '<div style="max-width:320px;text-align:center;font-size:13px;line-height:1.6;color:#3A342C;font-family:-apple-system,system-ui,sans-serif;">' + deText + '</div>' +
      '<div style="max-width:320px;text-align:center;font-size:12px;line-height:1.6;color:#8A8075;font-family:-apple-system,system-ui,sans-serif;margin-top:8px;">' + enText + '</div>';
  }
  tryBoot();
})();


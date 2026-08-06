function bootApp() {

const { useState, useEffect, useRef, useCallback } = React;
const e = React.createElement;

// Hängt für die aktuelle Seite eine schema.org/FAQPage-Auszeichnung in den <head>
// – maschinenlesbare Frage-Antwort-Paare für Suchmaschinen und KI-Systeme. Beim
// Vorrendern (tools/vorrendern.js) wird dieses <script> mitgenommen, sodass es
// auch ohne JavaScript im Roh-HTML steht. Die Seiten rufen den Hook mit ihren
// eigenen FAQ-Daten auf – eine Quelle, kein zweiter Datensatz.
function useFaqSchema(faqs) {
  var schluessel = faqs ? faqs.map(function (f) { return f.q; }).join('|') : '';
  useEffect(function () {
    var vorhandenes = document.getElementById('nsbb-faq-jsonld');
    if (vorhandenes) vorhandenes.remove();
    if (!faqs || !faqs.length) return;
    var el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'nsbb-faq-jsonld';
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(function (f) {
        return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } };
      })
    });
    document.head.appendChild(el);
    return function () { var x = document.getElementById('nsbb-faq-jsonld'); if (x) x.remove(); };
  }, [schluessel]);
}

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
// Portal-Ersatz: Die ausgelieferte react-bundle.js exponiert als window.ReactDOM
// nur "react-dom-client" (createRoot) – OHNE ReactDOM.createPortal. Dadurch liefen
// das Profil-Modal (Ueber uns) und das mobile Menue in einen Fehler und oeffneten
// nicht. Da das Bundle nicht angefasst werden darf, rendern wir hier die Inhalte
// ueber einen eigenen createRoot in ein an document.body angehaengtes <div> –
// funktional identisch zu einem Portal (liegt ausserhalb der transform-Container).
function Portal({ children }) {
  const elRef = React.useRef(null);
  const rootRef = React.useRef(null);
  if (!elRef.current) elRef.current = document.createElement('div');
  React.useEffect(() => {
    const el = elRef.current;
    document.body.appendChild(el);
    rootRef.current = ReactDOM.createRoot(el);
    return () => {
      const r = rootRef.current;
      // Unmount verzoegern, sonst warnt React ("unmount while rendering").
      setTimeout(() => { try { r.unmount(); } catch (e) {} if (el.parentNode) el.parentNode.removeChild(el); }, 0);
    };
  }, []);
  React.useEffect(() => { if (rootRef.current) rootRef.current.render(children); });
  return null;
}
// Mini-Flaggen fuer den Sprachumschalter – rein vektoriell (SVG), keine externen
// Assets. Werden im Desktop-Header und im MobileMenu genutzt, damit beide Stellen
// dieselbe, saubere Darstellung haben.
function FlagDE({ w }) {
  const s = w || 20;
  return e('svg', { width:s, height:Math.round(s*3/5), viewBox:'0 0 5 3', style:{ borderRadius:'2px', overflow:'hidden', display:'block', flexShrink:0, boxShadow:'0 0 0 1px rgba(0,0,0,.18)' } },
    e('rect', { width:5, height:1, y:0, fill:'#000000' }),
    e('rect', { width:5, height:1, y:1, fill:'#DD0000' }),
    e('rect', { width:5, height:1, y:2, fill:'#FFCE00' })
  );
}
function FlagEN({ w }) {
  const s = w || 20;
  return e('svg', { width:s, height:Math.round(s*3/5), viewBox:'0 0 50 30', style:{ borderRadius:'2px', overflow:'hidden', display:'block', flexShrink:0, boxShadow:'0 0 0 1px rgba(0,0,0,.18)' } },
    e('rect', { width:50, height:30, fill:'#012169' }),
    e('path', { d:'M0,0 L50,30 M50,0 L0,30', stroke:'#ffffff', strokeWidth:7 }),
    e('path', { d:'M0,0 L50,30 M50,0 L0,30', stroke:'#C8102E', strokeWidth:3 }),
    e('path', { d:'M25,0 V30 M0,15 H50', stroke:'#ffffff', strokeWidth:10 }),
    e('path', { d:'M25,0 V30 M0,15 H50', stroke:'#C8102E', strokeWidth:5 })
  );
}
function MobileMenu({ nav, page, go, onClose, t, lang, setLang }) {
  const isDE = lang === 'DE';
  const [openSub, setOpenSub] = React.useState(null);
  const panelRef = React.useRef(null);

  const handleNav = key => { go(key); onClose(); };

  // Barrierefreiheit: Solange das Menü offen ist, bleibt der Tastaturfokus darin
  // gefangen (sonst wandert er auf die verdeckte Seite dahinter), Escape
  // schließt, und beim Öffnen springt der Fokus ins Menü.
  React.useEffect(() => {
    // panelRef.current wird ERST zur Laufzeit gelesen, nicht beim Effect-Start:
    // Das Menü rendert über ein Portal (eigener createRoot), das DOM ist beim
    // Effect-Start noch nicht da. Ein früher Abbruch bei null würde den
    // Fokus-Trap ganz verhindern.
    const fokusierbare = () => {
      const panel = panelRef.current;
      if (!panel) return [];
      return Array.prototype.slice.call(
        panel.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])'));
    };
    // Fokus verzögert setzen, bis das Portal-DOM steht.
    const fokusTimer = setTimeout(() => {
      const f = fokusierbare();
      if (f.length) f[0].focus();
    }, 90);
    const onKey = (ev) => {
      if (ev.key === 'Escape') { onClose(); return; }
      if (ev.key !== 'Tab') return;
      const f = fokusierbare();
      if (!f.length) return;
      const erstes = f[0], letztes = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === erstes) { ev.preventDefault(); letztes.focus(); }
      else if (!ev.shiftKey && document.activeElement === letztes) { ev.preventDefault(); erstes.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(fokusTimer); document.removeEventListener('keydown', onKey); };
  }, []);

  const menuContent = e(React.Fragment, null,
    // Backdrop
    e('div', { onClick: onClose, style:{ position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:9998,background:'rgba(26,25,23,.45)', backdropFilter:'blur(3px)' } }),

    // Panel
    e('div', { ref:panelRef, role:'dialog', 'aria-modal':'true', 'aria-label': isDE?'Hauptmenü':'Main menu', style:{ position:'fixed',top:0,right:0,bottom:0,zIndex:9999,width:'min(360px,100vw)',background:'#FAF9F7',overflowY:'auto',display:'flex',flexDirection:'column',boxShadow:'-8px 0 48px rgba(0,0,0,.15)',animation:'slideRight .22s ease-out' } },

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
                  'aria-expanded': openSub===item.key,
                  'aria-label': (isDE?'Untermenü ':'Submenu ')+item.label,
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
            e('p', { style:{ fontSize:'11px',fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:'#B0A89E',fontFamily:"'DM Sans',sans-serif",marginBottom:'4px' } }, 'Berlin'),
            e('a', { href:'tel:+493081580930', style:{ fontSize:'13px',color:'#3D3830',fontFamily:"'DM Sans',sans-serif",textDecoration:'none',display:'block' } }, '+49 (0) 30 815 80 93'),
          ),
          e('div', null,
            e('p', { style:{ fontSize:'11px',fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:'#B0A89E',fontFamily:"'DM Sans',sans-serif",marginBottom:'4px' } }, 'Köln'),
            e('a', { href:'tel:+492219730640', style:{ fontSize:'13px',color:'#3D3830',fontFamily:"'DM Sans',sans-serif",textDecoration:'none',display:'block' } }, '+49 (0) 221 973 064 0'),
          ),
          e('a', { href:'mailto:info@nsbb.de', style:{ fontSize:'13px',color:'var(--accent)',fontFamily:"'DM Sans',sans-serif",textDecoration:'none',fontWeight:500 } }, 'info@nsbb.de'),
        ),

        // Language switch – analog zum Desktop-Header: DE und EN nebeneinander,
        // beide mit Flagge, aktive Sprache in Akzentfarbe hervorgehoben.
        e('div', { role:'group', 'aria-label': lang==='DE'?'Sprache':'Language', style:{ marginTop:'20px', display:'flex', gap:'8px' } },
          e('button', { onClick:()=>setLang('DE'), 'aria-pressed': lang==='DE', style:{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', background:'none', border:'1px solid ' + (lang==='DE' ? 'var(--accent)' : '#ECEAE6'), borderRadius:'6px', cursor:'pointer', fontSize:'12px', fontWeight:700, letterSpacing:'.08em', fontFamily:"'DM Sans',sans-serif", color: lang==='DE' ? 'var(--accent)' : '#B0A89E' } },
            e(FlagDE, { w:20 }),
            'DE'
          ),
          e('button', { onClick:()=>setLang('EN'), 'aria-pressed': lang==='EN', style:{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', background:'none', border:'1px solid ' + (lang==='EN' ? 'var(--accent)' : '#ECEAE6'), borderRadius:'6px', cursor:'pointer', fontSize:'12px', fontWeight:700, letterSpacing:'.08em', fontFamily:"'DM Sans',sans-serif", color: lang==='EN' ? 'var(--accent)' : '#B0A89E' } },
            e(FlagEN, { w:20 }),
            'EN'
          )
        ),
      ),
    ),
  );

  return e(Portal, null, menuContent);
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
    // ── "Aktuelles" (frueher "Insights") ─────────────────────────────────────
    // Wieder in der Navigation: Die Rubrik traegt jetzt ab Tag 1 – die
    // monatliche Mandanteninformation (PDF) steht oben, darunter die vom
    // Kunden ueber /redaktion/ gepflegten Beitraege. Der fruehere Grund fuer
    // das Ausblenden ("leere Rubrik") ist damit entfallen.
    { label: lang==='DE'?'Aktuelles':'Insights', altLabel: lang==='DE'?'Insights':'Aktuelles', key: 'aktuelles' },
    { label: lang==='DE'?'Über uns':'About us', altLabel: lang==='DE'?'About us':'Über uns', key: 'ueber-uns', children: [
      { label: 'Team', key: 'ueber-uns' },
      { label: lang==='DE'?'Steuerberater Berlin':'Tax Advisor Berlin', key: 'steuerberater-berlin' },
      { label: lang==='DE'?'Steuerberater Köln':'Tax Advisor Cologne', key: 'steuerberater-koeln' },
    ]},
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
      e('div', { className:'nav-inner', style:{ maxWidth:'1320px', margin:'0 auto', padding:'0 20px', display:'flex', alignItems:'center', gap:'14px' } },
        // Logo
        e('button', { onClick: () => go('home'), 'aria-label':'NSBB – Startseite', style:{ flexShrink:0, background:'none', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center' } },
          e('img', { src:'assets/images/logo-nav.webp', alt:'NSBB – Die Steuerberaterkanzlei', width:240, height:112, style:{ height:'44px', width:'auto', display:'block' } })
        ),

        // Desktop nav – only on large screens
        e('nav', { className:'hidden lg:flex', style:{ alignItems:'center', gap:'2px' }, onMouseLeave: () => setOpenDrop(null) },
          nav.map(item =>
            e('div', { key: item.key, style:{ position:'relative' } },
              e('button', {
                'aria-current': page.startsWith(item.key) ? 'page' : undefined,
                style:{ padding:'8px 14px', borderRadius:'8px', fontSize:'14px', fontWeight:500, border:'none', background:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", color: page.startsWith(item.key) ? '#4A7C59' : '#524C44', display:'flex', alignItems:'center', justifyContent:'center', gap:'4px' },
                onClick: () => item.children ? setOpenDrop(openDrop === item.key ? null : item.key) : go(item.key),
                'aria-expanded': item.children ? (openDrop === item.key) : undefined,
                'aria-haspopup': item.children ? 'true' : undefined,
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
        e('div', { style:{ display:'flex', alignItems:'center', gap:'9px' } },
          e('a', { href:'tel:+493081580930', style:{ display:'none', fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:500, color:'var(--muted)', textDecoration:'none', letterSpacing:'.01em' }, className:'nav-phone' }, '+49 30 815 80 93'),
          // Sprachumschalter: DE und EN untereinander, jeweils mit Flagge, aktive
          // Sprache in Akzentfarbe. So sieht der Besucher beide Optionen und muss
          // nicht raten, welche der beiden gerade aktiv ist. Eng gesetzt (gap 0).
          e('div', { role:'group', 'aria-label': lang==='DE'?'Sprache':'Language', style:{ display:'flex', flexDirection:'column', gap:'2px' } },
            e('button', {
              onClick: () => setLang('DE'),
              'aria-label': 'Auf Deutsch wechseln',
              'aria-pressed': lang==='DE',
              // minHeight:auto hebt die globale 44px-Touch-Regel auf, damit DE/EN
              // eng untereinander stehen (Desktop = Maus, kein Touch-Target noetig).
              style:{ display:'flex', alignItems:'center', gap:'6px', padding:'1px 6px', minHeight:'auto', lineHeight:1, background:'none', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:700, letterSpacing:'.1em', fontFamily:"'DM Sans',sans-serif", color: lang==='DE' ? 'var(--accent)' : '#B0A89E', transition:'color .2s' }
            },
              e(FlagDE, { w:18 }),
              'DE'
            ),
            e('button', {
              onClick: () => setLang('EN'),
              'aria-label': 'Switch to English',
              'aria-pressed': lang==='EN',
              style:{ display:'flex', alignItems:'center', gap:'6px', padding:'1px 6px', minHeight:'auto', lineHeight:1, background:'none', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:700, letterSpacing:'.1em', fontFamily:"'DM Sans',sans-serif", color: lang==='EN' ? 'var(--accent)' : '#B0A89E', transition:'color .2s' }
            },
              e(FlagEN, { w:18 }),
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
  // Echter Link (fuer Suchmaschinen-Crawler und Besucher ohne JavaScript) mit
  // href, der zusaetzlich per JavaScript die SPA-Navigation ausloest (ohne
  // vollstaendiges Neuladen). BASIS/pfadFuer bilden die richtige Adresse.
  const seiteLink = (key, label, style) => e('a', {
    key: key,
    href: pfadFuer(key),
    onClick: (ev) => { ev.preventDefault(); go(key); },
    style: style,
  }, label);
  const year = new Date().getFullYear();

  const lbl  = { fontSize:'12px', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,.7)', fontFamily:"'DM Sans',sans-serif", marginBottom:'8px' };
  const body = { fontSize:'14px', lineHeight:1.7, color:'rgba(255,255,255,.85)', fontFamily:"'DM Sans',sans-serif", margin:0 };
  const lnk  = { display:'block', fontSize:'14px', color:'rgba(255,255,255,.85)', fontFamily:"'DM Sans',sans-serif", textDecoration:'none' };

  return e('footer', { style:{ backgroundColor:'#1A1917', paddingTop:'36px', paddingBottom:'28px' } },
    e('div', { style:{ maxWidth:'1320px', margin:'0 auto', padding:'0 20px' } },

      // Row 1: Logo + tagline + TGS line
      e('div', { style:{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:'10px', paddingBottom:'22px', borderBottom:'1px solid rgba(255,255,255,.12)' } },
        e('button', { onClick:()=>go('home'), style:{ background:'none', border:'none', cursor:'pointer', padding:0 } },
          e('img', { src:LOGO_URI, alt:'NSBB', width:280, height:134, style:{ height:'32px', width:'auto', filter:'brightness(0) invert(1)', opacity:.9 } })
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
        seiteLink('faq', isDE ? 'Häufige Fragen zur Zusammenarbeit →' : 'Frequently asked questions about working with us →',
          { fontSize:'14px', fontWeight:500, color:'rgba(255,255,255,.8)', fontFamily:"'DM Sans',sans-serif", textDecoration:'none' }),
      ),

      // Seiten-Navigation: echte Links (Suchmaschinen-Crawler + Besucher ohne JS).
      // Die aufklappbaren Menüs oben sind im vorgerenderten HTML zu; hier stehen
      // die Adressen dagegen fest im Roh-HTML.
      e('nav', { 'aria-label': isDE ? 'Seiten' : 'Pages', style:{ display:'flex', flexWrap:'wrap', gap:'8px 20px', paddingTop:'18px', paddingBottom:'18px', borderBottom:'1px solid rgba(255,255,255,.12)' } },
        [ ['leistungen-unternehmen', isDE ? 'Für Unternehmen' : 'For Businesses'],
          ['leistungen-international', isDE ? 'Internationales Steuerrecht' : 'International Tax'],
          ['leistungen-privat', isDE ? 'Für Privatpersonen' : 'For Individuals'],
          ['digital', isDE ? 'Digitale Kanzlei' : 'Digital Office'],
          ['ueber-uns', isDE ? 'Über uns' : 'About us'],
          ['steuerberater-berlin', isDE ? 'Steuerberater Berlin' : 'Tax Advisor Berlin'],
          ['steuerberater-koeln', isDE ? 'Steuerberater Köln' : 'Tax Advisor Cologne'],
          ['karriere', isDE ? 'Karriere' : 'Careers'],
          ['kanzleinachfolge', isDE ? 'Kanzleinachfolge' : 'Practice Succession'],
          ['tgs', 'TGS International'],
          ['aktuelles', isDE ? 'Aktuelles' : 'Insights'],
          ['kontakt', isDE ? 'Kontakt' : 'Contact'],
        ].map(function (p) { return seiteLink(p[0], p[1], { fontSize:'13px', color:'rgba(255,255,255,.75)', fontFamily:"'DM Sans',sans-serif", textDecoration:'none', whiteSpace:'nowrap' }); })
      ),

      // Bottom bar
      e('div', { style:{ paddingTop:'16px', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'8px' } },
        e('p', { style:{ fontSize:'13px', color:'rgba(255,255,255,.65)', fontFamily:"'DM Sans',sans-serif", margin:0 } }, `© ${year} NSBB Steuerberatungsgesellschaft mbH`),
        e('div', { style:{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'8px 16px' } },
          // Cookie-Einstellungen: öffnet den Consent-Banner erneut (Widerruf/
          // Änderung – gesetzlich gefordert, so einfach wie die Erteilung).
          e('button', { key:'consent', onClick:()=>window.dispatchEvent(new Event('nsbb:open-consent')), style:{ fontSize:'13px', color:'rgba(255,255,255,.75)', fontFamily:"'DM Sans',sans-serif", background:'none', border:'none', cursor:'pointer', padding:0 } }, isDE?'Cookie-Einstellungen':'Cookie settings'),
          [['impressum', isDE?'Impressum':'Legal'], ['datenschutz', isDE?'Datenschutz':'Privacy']].map(([k,l]) =>
            seiteLink(k, l, { fontSize:'13px', color:'rgba(255,255,255,.75)', fontFamily:"'DM Sans',sans-serif", textDecoration:'none' })
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
  // fit=true  → MAIN CHAPTERS: title on line 1, accent on line 2 (each its own
  //             block), so the heading is a two-line structure and every hero
  //             shares the SAME type scale and height. Anders als frueher KEIN
  //             whiteSpace:nowrap mehr – lange Titel duerfen umbrechen statt auf
  //             schmalen Screens abgeschnitten zu werden. Untertitel als
  //             [line1, line2] mit lesbarer Mindestgroesse.
  // fit=false → SUB-PAGES with long headings: natural wrapping (no cut-off).
  var fitTitleStyle = { fontSize:'clamp(1.55rem,5.2vw,2.9rem)', textWrap:'balance', overflowWrap:'break-word' };
  var fitSubStyle   = { fontSize:'clamp(0.95rem,2.1vw,1.1rem)', textWrap:'balance', overflowWrap:'break-word' };
  var titleNode = fit
    ? [ e('span', { key:'t', className:'block', style:fitTitleStyle }, title),
        accent && e('span', { key:'a', className:'block', style:{ ...fitTitleStyle, color:'var(--accent)' } }, accent) ]
    : [ e('span', { key:'t' }, title),
        accent && e('em', { key:'a', className:'not-italic block', style:{ color:'var(--accent)' } }, accent) ];
  var subNode = !subtitle ? null
    : (fit && Array.isArray(subtitle))
      ? e('p', { className:'leading-relaxed', style:{ color:'var(--muted)' } },
          e('span', { className:'block', style:fitSubStyle }, subtitle[0]),
          e('span', { className:'block', style:fitSubStyle }, subtitle[1]))
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
      e('div', { className: 'max-w-2xl fade-up' + (fit ? ' hero-fit-body' : '') },
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
  const insights = t.insightsPosts.map(p => ({...p, key:'aktuelles'}));

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
            e('div', { className: 'flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-6 border-t', style: { borderColor: 'var(--border)' } },
              // Kennzahlen (2 Standorte, 4 Berufsträger …) – links
              e('div', { className: 'flex flex-wrap gap-6' },
                stats.map(s => e('div', { key: s.lbl },
                  e('div', { style:{ height:'36px', display:'flex', alignItems:'center', justifyContent:'flex-start' } },
                    e('span', { style:{ fontFamily:"'DM Sans',sans-serif", fontSize:'1.6rem', fontWeight:400, color:'var(--accent)', lineHeight:1, letterSpacing:'-.02em', display:'block' } }, s.val),
                  ),
                  e('p', { className: 'text-xs mt-0.5 font-medium', style: { color: 'var(--muted)', fontFamily: "'DM Sans',sans-serif" } }, s.lbl),
                ))
              ),
              // Standort-Schnellzugriff – auf Desktop rechts daneben, mobil darunter
              e('div', { style:{ display:'flex', flexDirection:'column', gap:'8px' } },
                [
                  { key:'steuerberater-berlin', label: isDE?'Steuerberater Berlin':'Tax Advisor Berlin' },
                  { key:'steuerberater-koeln',  label: isDE?'Steuerberater Köln':'Tax Advisor Cologne' },
                ].map(loc => e('button', {
                    key: loc.key,
                    onClick: () => go(loc.key),
                    style:{ display:'inline-flex', alignItems:'center', gap:'8px', background:'var(--accent-subtle)', color:'var(--accent-dark)', border:'none', borderRadius:'10px', padding:'9px 14px', fontSize:'13px', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", whiteSpace:'nowrap' }
                  },
                  e(Ico, { name:'mapPin', size:13 }),
                  loc.label,
                  e(Ico, { name:'arrowRight', size:14 })
                ))
              ),
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
    e(PageHero, { label:isDE?'Steuerberatung für Unternehmen':'Tax advisory for businesses', fit:true, title:isDE?'Drei Bereiche.':'Three areas.', accent:isDE?'Ein Ansprechpartner.':'One contact.', subtitle:isDE?['Laufende Betreuung, strategische Gestaltung und','betriebswirtschaftliche Begleitung – aus einer Hand.']:['Ongoing support, strategic structuring and business','guidance – from a single source.'], back:isDE?'Leistungen für Unternehmen':'Services for Businesses', backFn:()=>go('leistungen-unternehmen') }),
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
    e(PageHero, { label:isDE?'Laufende Steuerberatung':'Ongoing Tax Advisory', fit:true, title:isDE?'Verlässlich.':'Reliable.', accent:isDE?'Strukturiert. Digital.':'Structured. Digital.', subtitle:isDE?['Zuverlässige laufende Betreuung – damit Sie sich','auf Ihr Unternehmen konzentrieren können.']:['Reliable ongoing support – so you can','focus on your business.'], back:isDE?'Leistungen für Unternehmen':'Services for Businesses', backFn:()=>{ setPage('leistungen-unternehmen'); window.scrollTo(0,0); } }),
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
    e(PageHero, { label:isDE?'Gestaltungsberatung':'Structuring Advisory', fit:true, title:isDE?'Vorausschauend.':'Forward-looking.', accent:isDE?'Strukturiert. Individuell.':'Structured. Individual.', subtitle:isDE?['Steuerliche Strukturierung, die langfristig wirkt –','für Ihr Unternehmen und Ihre Vermögensnachfolge.']:['Tax structuring with lasting effect – for your','business and your succession.'], back:isDE?'Leistungen für Unternehmen':'Services for Businesses', backFn:()=>{ setPage('leistungen-unternehmen'); window.scrollTo(0,0); } }),
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
    e(PageHero, { label:isDE?'Betriebswirtschaftliche Beratung':'Business Management Advisory', fit:true, title:isDE?'Unternehmerisch.':'Entrepreneurial.', accent:isDE?'Mehr als Steuern.':'More than tax.', subtitle:isDE?['Wir begleiten Ihr Unternehmen weit über die Steuererklärung hinaus –','als strategischer Sparringspartner auf Augenhöhe.']:['We support your business well beyond the tax return –','as a strategic sparring partner at eye level.'], back:isDE?'Leistungen für Unternehmen':'Services for Businesses', backFn:()=>{ setPage('leistungen-unternehmen'); window.scrollTo(0,0); } }),
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
  useFaqSchema(faqs);

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
          e('p', { style:{ fontSize:'11px', fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:'#B0A89E', fontFamily:"'DM Sans',sans-serif", marginBottom:'16px', paddingBottom:'8px', borderBottom:'1px solid #ECEAE6' } }, group.cat),
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
              e('p', { style:{ fontSize:'13px', lineHeight:1.6, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", margin:0 } }, item.desc),
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
  useFaqSchema(faqs);
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
          e('button', { onClick:()=>setOpen(open===i?null:i), 'aria-expanded': open===i, style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
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
  useFaqSchema(faqs);
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
          e('button', { onClick:()=>setOpen(open===i?null:i), 'aria-expanded': open===i, style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
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
  useFaqSchema(faqs);
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
          e('button', { onClick:()=>setOpen(open===i?null:i), 'aria-expanded': open===i, style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
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
  useFaqSchema(faqs);
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
          e('button', { onClick:()=>setOpen(open===i?null:i), 'aria-expanded': open===i, style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
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
  useFaqSchema(faqs);
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
          e('button', { onClick:()=>setOpen(open===i?null:i), 'aria-expanded': open===i, style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
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
  useFaqSchema(faqs);
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
          e('button', { onClick:()=>setOpen(open===i?null:i), 'aria-expanded': open===i, style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
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
  useFaqSchema(faqs);
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
          e('button', { onClick:()=>setOpen(open===i?null:i), 'aria-expanded': open===i, style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
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
  useFaqSchema(faqs);
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
          e('button', { onClick:()=>setOpen(open===i?null:i), 'aria-expanded': open===i, style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
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
  useFaqSchema(faqs);
  const [open, setOpen] = React.useState(null);

  return e('div', { className:'page-enter' },

    e(PageHero, {
      label: isDE?'Internationales Steuerrecht':'International Tax',
      fit: true,
      title: isDE?'Grenzgänger:':'Cross-Border Workers:',
      accent: isDE?'Wo zahle ich Steuern?':'Where Do I Pay Tax?',
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
          e('button', { onClick:()=>setOpen(open===i?null:i), 'aria-expanded': open===i, style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
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
  useFaqSchema(faqs);
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
          e('button', { onClick:()=>setOpen(open===i?null:i), 'aria-expanded': open===i, style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', gap:'14px' } },
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
          e('h2', { className:'font-display', style:{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, t.digitalToolsH2),
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
                e('p', { style:{ fontSize:'13px', lineHeight:1.5, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", margin:0 } }, tool.d),
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
          e('h2', { className:'font-display', style:{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif" } }, t.digitalBenefitsH2),
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
                e('p', { style:{ fontSize:'11px', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--accent)', fontFamily:"'DM Sans',sans-serif", marginBottom:'4px' } }, isDE?p.title:(p.titleEN||p.title)),
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
    active && e(Portal, null,
      e('div', {
        role:'dialog', 'aria-modal':'true', 'aria-label': (isDE?'Profil: ':'Profile: ')+active.name,
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
              e('p', { style:{ fontSize:'11px', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'#B0A89E', fontFamily:"'DM Sans',sans-serif", marginBottom:'10px' } }, isDE?'Fachgebiete':'Expertise'),
              e('div', { style:{ display:'flex', flexWrap:'wrap', gap:'6px' } },
                (isDE?active.focus:(active.focusEN||active.focus)).map(f => e('span', { key:f, style:{ fontSize:'12px', fontWeight:500, color:'#3A342C', fontFamily:"'DM Sans',sans-serif", backgroundColor:'#F4F2EE', borderRadius:'6px', padding:'5px 10px' } }, f))
              ),
            ),
            active.sprachen && active.sprachen.length > 0 && e('div', { style:{ marginBottom:'24px' } },
              e('p', { style:{ fontSize:'11px', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'#B0A89E', fontFamily:"'DM Sans',sans-serif", marginBottom:'10px' } }, isDE?'Sprachen':'Languages'),
              e('div', { style:{ display:'flex', flexWrap:'wrap', gap:'6px' } },
                active.sprachen.map(s => e('span', { key:s, style:{ fontSize:'12px', fontWeight:500, color:'var(--accent)', fontFamily:"'DM Sans',sans-serif", backgroundColor:'var(--accent-subtle)', borderRadius:'6px', padding:'5px 10px' } }, isDE?s:(s==='Deutsch'?'German':s==='Englisch'?'English':s)))
              ),
            ),
            active.cv && active.cv.length > 0 && e('div', { style:{ paddingTop:'20px', borderTop:'1px solid #ECEAE6' } },
              e('p', { style:{ fontSize:'11px', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'#B0A89E', fontFamily:"'DM Sans',sans-serif", marginBottom:'12px' } }, isDE?'Werdegang':'Background'),
              e('div', { style:{ display:'flex', flexDirection:'column', gap:'6px' } },
                (isDE?active.cv:(active.cvEN||active.cv)).map((c,ci) => e('p', { key:ci, style:{ fontSize:'13px', color:'#8A8075', fontFamily:"'DM Sans',sans-serif", margin:0, paddingLeft:'12px', borderLeft:'2px solid #ECEAE6', lineHeight:1.6 } }, c))
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
    ),
  );
}

// ── Aktuelles: Mandanteninformationen (PDF) + Beitraege aus der Redaktion ────
// Die Inhalte liegen NICHT im Code, sondern als JSON/Dateien in daten/ auf dem
// Server und werden vom Kunden ueber /redaktion/ gepflegt (durch den Server
// geschuetzt, siehe dokumente/Redaktionsbereich-Konzept.md, "Weg 1"). Diese
// Seite laedt die Manifeste zur Laufzeit – neue Inhalte erscheinen ohne Upload.
// Die fruehere Redaktionsleiste hier im Browser (Admin-Attrappe mit Klartext-
// Passwort) ist ersatzlos entfernt und darf laut Konzept nie zurueckkehren.
// Waehrend des Ladens traegt die Seite data-nsbb-laedt – tools/vorrendern.js
// wartet darauf, damit die Momentaufnahme nie den halbfertigen Zustand zeigt.

const MONATE_DE = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

// ── Markdown: kleiner, abhaengigkeitsfreier Parser fuer Beitragstexte ───────
// Absichtlich einfach gehalten (kein npm-Paket, kein Build-Schritt): erkennt
// genau das, was die Formatierungs-Symbolleiste im Redaktionsbereich erzeugt
// (## / ### Ueberschriften, Listen, **fett**/*kursiv*, [Text](Adresse), GFM-
// Tabellen, --- Trennlinien). React escapet alle Textinhalte automatisch beim
// Rendern – eingegebenes HTML wird nie interpretiert.
function ankerAusText(text) {
  var s = String(text || '').toLowerCase();
  s = s.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
  s = s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return s || 'abschnitt';
}

// Block-Ebene: zerlegt den Text (durch Leerzeilen getrennt) in eine Liste
// typisierter Bloecke. Ein vorhandenes "{#anker}" hinter einer Ueberschrift
// wird uebernommen (wie im gelieferten Referenz-Beitrag), sonst automatisch
// aus dem Text abgeleitet – bei Mehrfachnennung mit "-2", "-3" … eindeutig.
function markdownAst(text) {
  var bloecke = String(text || '').split(/\n{2,}/);
  var verwendeteAnker = {};
  var eindeutig = function (basis) {
    var a = basis, i = 2;
    while (verwendeteAnker[a]) { a = basis + '-' + i; i++; }
    verwendeteAnker[a] = true;
    return a;
  };
  var ast = [];
  bloecke.forEach(function (block) {
    block = block.trim();
    if (!block) return;

    if (/^-{3,}$/.test(block)) { ast.push({ typ:'trennlinie' }); return; }

    var uMatch = /^(#{2,3})\s+(.*?)\s*(?:\{#([a-z0-9-]+)\}\s*)?$/.exec(block);
    if (uMatch) {
      var uText = uMatch[2];
      var anker = uMatch[3] || eindeutig(ankerAusText(uText));
      if (uMatch[3]) { verwendeteAnker[anker] = true; }
      ast.push({ typ:'ueberschrift', ebene:uMatch[1].length, text:uText, anker:anker });
      return;
    }

    var zeilen = block.split('\n');

    // Tabelle: zweite Zeile ist eine GFM-Trennzeile aus |---|---|…
    if (zeilen.length >= 2 && /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/.test(zeilen[1].trim())) {
      var zeileZuZellen = function (z) { return z.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(function (c) { return c.trim(); }); };
      ast.push({ typ:'tabelle', kopf: zeileZuZellen(zeilen[0]), zeilen: zeilen.slice(2).map(zeileZuZellen) });
      return;
    }

    // Liste: jede Zeile beginnt mit "- "/"* " (ungeordnet) oder "1. " (geordnet).
    if (zeilen.every(function (z) { return /^\s*([-*]|\d+\.)\s+/.test(z); })) {
      ast.push({
        typ:'liste',
        geordnet: /^\s*\d+\./.test(zeilen[0]),
        punkte: zeilen.map(function (z) { return z.replace(/^\s*([-*]|\d+\.)\s+/, ''); }),
      });
      return;
    }

    // Absatz: weiche Zeilenumbrueche werden zu einem Leerzeichen (kein <br>).
    ast.push({ typ:'absatz', text: zeilen.join(' ') });
  });
  return ast;
}

// Inline-Ebene: **fett**, *kursiv*, [Text](Adresse) in eine flache Token-Liste.
function markdownInline(text) {
  var tokens = [];
  var rest = String(text || '');
  var re = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(\[([^\]]+)\]\(([^)]+)\))/;
  while (rest.length) {
    var m = re.exec(rest);
    if (!m) { tokens.push({ typ:'text', text:rest }); break; }
    if (m.index > 0) { tokens.push({ typ:'text', text:rest.slice(0, m.index) }); }
    if (m[1]) { tokens.push({ typ:'fett', text:m[2] }); }
    else if (m[3]) { tokens.push({ typ:'kursiv', text:m[4] }); }
    else { tokens.push({ typ:'link', text:m[6], href:m[7] }); }
    rest = rest.slice(m.index + m[0].length);
  }
  return tokens;
}

// Interne Adressen ("/kontakt") bekommen die BASIS vorangestellt (Live "/",
// Testadresse "/2026/"), externe/Anker-Adressen bleiben unveraendert –
// konsistent mit der uebrigen internen Verlinkung dieser Website.
function markdownLinkAdresse(href) {
  if (/^https?:\/\//i.test(href) || href.charAt(0) === '#') return href;
  if (href.charAt(0) === '/') return BASIS + href.slice(1);
  return href;
}

function markdownInlineRender(text, keyPrefix) {
  return markdownInline(text).map(function (tok, i) {
    var key = keyPrefix + '-i' + i;
    // Fett/Kursiv rekursiv rendern, damit ein Link INNERHALB von **fett**
    // (z. B. **[Text](Adresse)**) auch wirklich als Link erscheint und nicht
    // als roher Markdown-Text stehen bleibt.
    if (tok.typ === 'fett') return e('strong', { key:key }, markdownInlineRender(tok.text, key));
    if (tok.typ === 'kursiv') return e('em', { key:key }, markdownInlineRender(tok.text, key));
    if (tok.typ === 'link') {
      var extern = /^https?:\/\//i.test(tok.href);
      return e('a', { key:key, href: markdownLinkAdresse(tok.href), target: extern ? '_blank' : undefined, rel: extern ? 'noopener' : undefined, style:{ color:'var(--accent)', textDecoration:'underline' } }, tok.text);
    }
    return tok.text;
  });
}

// Block-Ebene rendern – Typografie orientiert sich an der bisherigen
// Volltext-Darstellung (14px/1.8, DM Sans, max. 720px), Ueberschriften nutzen
// die Schriftfamilie der uebrigen Seitentitel (Cormorant Garamond).
function markdownRender(ast, keyPrefix) {
  var absatzStil = { fontSize:'14px', lineHeight:1.8, color:'#3A342C', marginBottom:'14px', fontFamily:"'DM Sans',sans-serif", maxWidth:'720px' };
  var listeStil  = { fontSize:'14px', lineHeight:1.8, color:'#3A342C', marginBottom:'14px', paddingLeft:'22px', fontFamily:"'DM Sans',sans-serif", maxWidth:'720px' };
  return ast.map(function (block, i) {
    var key = keyPrefix + '-b' + i;
    if (block.typ === 'ueberschrift') {
      var stil = block.ebene === 2
        ? { fontSize:'21px', fontWeight:600, color:'#1A1917', margin:'28px 0 12px', fontFamily:"'Cormorant Garamond',serif", scrollMarginTop:'100px' }
        : { fontSize:'17px', fontWeight:600, color:'#1A1917', margin:'22px 0 10px', fontFamily:"'Cormorant Garamond',serif", scrollMarginTop:'100px' };
      return e(block.ebene === 2 ? 'h2' : 'h3', { key:key, id:block.anker, style:stil }, markdownInlineRender(block.text, key));
    }
    if (block.typ === 'absatz') {
      return e('p', { key:key, style:absatzStil }, markdownInlineRender(block.text, key));
    }
    if (block.typ === 'liste') {
      return e(block.geordnet ? 'ol' : 'ul', { key:key, style:listeStil },
        block.punkte.map(function (p, j) { return e('li', { key:key + '-p' + j, style:{ marginBottom:'6px' } }, markdownInlineRender(p, key + '-p' + j)); }));
    }
    if (block.typ === 'tabelle') {
      return e('div', { key:key, style:{ overflowX:'auto', marginBottom:'18px' } },
        e('table', { style:{ borderCollapse:'collapse', width:'100%', fontSize:'13px', fontFamily:"'DM Sans',sans-serif" } },
          e('thead', null, e('tr', null, block.kopf.map(function (c, j) { return e('th', { key:'k' + j, style:{ textAlign:'left', padding:'8px 10px', borderBottom:'2px solid var(--border)', color:'#1A1917' } }, c); }))),
          e('tbody', null, block.zeilen.map(function (zeile, ri) {
            return e('tr', { key:'r' + ri }, zeile.map(function (c, ci) { return e('td', { key:'c' + ci, style:{ padding:'8px 10px', borderBottom:'1px solid var(--border)', color:'#3A342C' } }, c); }));
          })),
        ),
      );
    }
    if (block.typ === 'trennlinie') {
      return e('hr', { key:key, style:{ border:'none', borderTop:'1px solid var(--border)', margin:'24px 0' } });
    }
    return null;
  });
}

function markdownInhaltsverzeichnis(ast) {
  return ast.filter(function (b) { return b.typ === 'ueberschrift'; });
}

// Erkennt einen Abschnitt "Haeufige Fragen"/"FAQ" und liest daraus Absaetze
// der Form "**Frage?** Antwort …" (ein Absatz je Paar). Eigene, bewusst
// einfache JS-Fassung – dieselbe Erkennung existiert nochmal in PHP
// (redaktion/index.php), weil PHP kein JS aufrufen kann; beide muessen
// unabhaengig funktionieren. Rueckgabe passt direkt zu useFaqSchema({q,a}).
function markdownFaqExtrahieren(ast) {
  var inFaq = false;
  var ergebnis = [];
  ast.forEach(function (block) {
    if (block.typ === 'ueberschrift') {
      inFaq = /^(h[äa]ufige\s+fragen|faq)s?:?$/i.test(block.text.trim());
      return;
    }
    if (!inFaq || block.typ !== 'absatz') return;
    var m = /^\*\*(.+?)\*\*\s+([\s\S]+)$/.exec(block.text);
    if (m) { ergebnis.push({ q:m[1].trim(), a:m[2].trim() }); }
  });
  return ergebnis;
}

function AktuellesPage({ setPage, lang, t }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const [beitraege, setBeitraege] = React.useState(null);   // null = laedt noch
  const [ausgaben, setAusgaben]   = React.useState(null);
  const [aktiveKat, setAktiveKat] = React.useState('Alle');
  const [slug, setSlug]           = React.useState(() => beitragsSlugAusPfad());  // '' = Uebersicht, sonst Einzelbeitrag
  const laedt = beitraege === null || ausgaben === null;

  // Manifeste laden. ?ts= umgeht jeden Zwischenspeicher. Ein Fehlschlag (Datei
  // fehlt noch, oder der Vorrender-Server liefert HTML statt JSON) ergibt
  // schlicht leere Listen – die Seite zeigt dann die Leerzustaende.
  React.useEffect(() => {
    let aktiv = true;
    const hole = (datei) => fetch(BASIS + 'daten/' + datei + '?ts=' + Date.now())
      .then(function (r) { return r.json(); }).catch(function () { return null; });
    hole('beitraege.json').then(function (d) {
      if (!aktiv) return;
      const liste = (d && Array.isArray(d.beitraege)) ? d.beitraege.filter(Boolean) : [];
      liste.sort(function (a, b) { return String(b.datum || '').localeCompare(String(a.datum || '')); });
      setBeitraege(liste);
    });
    hole('mandanteninfo.json').then(function (d) {
      if (!aktiv) return;
      const liste = (d && Array.isArray(d.ausgaben)) ? d.ausgaben.filter(Boolean) : [];
      liste.sort(function (a, b) { return (b.jahr - a.jahr) || (b.monat - a.monat); });
      setAusgaben(liste);
    });
    return () => { aktiv = false; };
  }, []);

  // Alte Hash-Adresse (#beitrag-<id>) weiter verstehen: auf die neue
  // Einzel-Adresse /beitrag/<slug> umschreiben – bereits geteilte Links und
  // Lesezeichen sollen nicht ins Leere laufen.
  React.useEffect(() => {
    if (!beitraege || slug) return;
    const m = /^#beitrag-(.+)$/.exec(window.location.hash || '');
    if (!m) return;
    const treffer = beitraege.find(b => b.id === decodeURIComponent(m[1]));
    if (!treffer || !treffer.slug) return;
    try { history.replaceState(null, '', BASIS + 'beitrag/' + treffer.slug); } catch (e) {}
    setSlug(treffer.slug);
  }, [beitraege]);

  // Browser-Zurueck/-Vorwaerts zwischen Uebersicht und Einzelbeitraegen: die
  // Komponente wird dabei nicht neu gemountet (im Router bleibt die Seite
  // "aktuelles"), darum die Adresse hier selbst nachfuehren.
  React.useEffect(() => {
    const aufNav = () => setSlug(beitragsSlugAusPfad());
    window.addEventListener('popstate', aufNav);
    return () => window.removeEventListener('popstate', aufNav);
  }, []);

  // "2026-07-22" -> "22. Juli 2026" (bewusst ohne toLocaleDateString: kein
  // Zeitzonen-Verschieben, identisch auf Server-Momentaufnahme und Browser).
  const datumAnzeige = (iso) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
    return m ? (parseInt(m[3], 10) + '. ' + MONATE_DE[parseInt(m[2], 10) - 1] + ' ' + m[1]) : (iso || '');
  };
  const alsMB = (bytes) => (Math.max(bytes / 1048576, 0.1)).toFixed(1).replace('.', ',');

  // Zu einem Beitrag wechseln bzw. zurueck zur Uebersicht – jeweils MIT
  // Verlaufseintrag (pushState), damit der Zurueck-Knopf wie erwartet wirkt.
  const zeigeBeitrag = (s) => {
    if (!s) return;
    try { history.pushState(null, '', BASIS + 'beitrag/' + s); } catch (e) {}
    setSlug(s);
    window.scrollTo(0, 0);
  };
  const zurUebersicht = () => {
    try { history.pushState(null, '', pfadFuer('aktuelles')); } catch (e) {}
    setSlug('');
    window.scrollTo(0, 0);
  };

  // Aktuell angezeigter Einzelbeitrag (oder null = Uebersicht). Markdown einmal
  // aufbereiten und an Inhaltsverzeichnis, FAQ-Strukturdaten und Darstellung
  // weiterreichen (die Hooks stehen bewusst VOR jeder Fallunterscheidung, damit
  // ihre Reihenfolge in jedem Render gleich bleibt).
  const aktuellerBeitrag = (slug && beitraege) ? (beitraege.find(b => b.slug === slug) || null) : null;
  const ast  = React.useMemo(() => aktuellerBeitrag ? markdownAst(aktuellerBeitrag.text || aktuellerBeitrag.teaser || '') : [], [aktuellerBeitrag]);
  const toc  = React.useMemo(() => markdownInhaltsverzeichnis(ast), [ast]);
  const faqs = React.useMemo(() => markdownFaqExtrahieren(ast), [ast]);
  useFaqSchema(faqs);

  // Seitentitel im Browser an den Beitrag anpassen (Suchmaschinen lesen ohnehin
  // die serverseitig erzeugte Beitragsseite – dies ist nur die Browser-Ansicht).
  // In der Übersicht wieder den Übersichtstitel setzen: der Router-Titel greift
  // nur beim Wechsel der Seite, und Beitrag wie Übersicht sind beide „aktuelles".
  React.useEffect(() => {
    if (aktuellerBeitrag) {
      document.title = aktuellerBeitrag.titel + ' | NSBB';
    } else {
      document.title = isDE ? 'Aktuelles & Mandanteninformationen | NSBB Steuerberatung' : 'Insights & News | NSBB Tax Advisors';
    }
  }, [aktuellerBeitrag, isDE]);

  // Einzel-Adresse aufgerufen, Beitraege laden noch: leere, ladende Seite zeigen
  // statt kurz die Uebersicht aufblitzen zu lassen.
  if (slug && !beitraege) {
    return e('div', { className:'page-enter', 'data-nsbb-laedt':'1', style:{ minHeight:'70vh' } });
  }

  // ── Einzelbeitrag-Ansicht: nur der Beitrag, darunter Vor/Zurueck ──────────
  if (aktuellerBeitrag) {
    const b = aktuellerBeitrag;
    const idx = beitraege.findIndex(x => x.slug === slug);
    const neuer  = idx > 0 ? beitraege[idx - 1] : null;                                   // spaeter veroeffentlicht
    const aelter = (idx >= 0 && idx < beitraege.length - 1) ? beitraege[idx + 1] : null;  // frueher veroeffentlicht
    const navBox = (bp, richtung) => e('button', { key: richtung, onClick: () => zeigeBeitrag(bp.slug),
        style:{ textAlign: richtung === 'next' ? 'right' : 'left', flex:'1 1 260px', minWidth:'200px', background:'#fff', border:'1px solid var(--border)', borderRadius:'14px', padding:'16px 20px', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" } },
      e('span', { style:{ fontSize:'12px', fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:'var(--subtle)', display:'block', marginBottom:'6px' } },
        richtung === 'next' ? (isDE ? 'Nächster Beitrag →' : 'Next article →') : (isDE ? '← Vorheriger Beitrag' : '← Previous article')),
      e('span', { style:{ fontSize:'15px', fontWeight:600, color:'#1A1917', lineHeight:1.4, display:'block' } }, bp.titel),
    );
    return e('div', { className:'page-enter' },
      /* Kopfbereich: Hero-Verlauf der Website, nur Beitrags-Metadaten */
      e('section', { style:{ background:'linear-gradient(135deg,#F7F6F3 0%,#F0EEE9 50%,#EAF0EC 100%)', padding:'40px 0 34px' } },
        e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
          e('button', { onClick: zurUebersicht, style:{ background:'none', border:'none', cursor:'pointer', color:'var(--accent)', fontSize:'13px', fontWeight:500, fontFamily:"'DM Sans',sans-serif", padding:0, marginBottom:'20px' } },
            (isDE ? '← Alle Beiträge' : '← All articles')),
          e('div', { style:{ maxWidth:'760px' } },
            b.kategorie && e('span', { className:'label', style:{ display:'block', marginBottom:'12px' } }, b.kategorie),
            e('h1', { className:'font-display', style:{ fontSize:'clamp(2rem,4.5vw,3.1rem)', lineHeight:1.12, color:'#1A1917', fontFamily:"'Cormorant Garamond',serif", margin:'0 0 16px' } }, b.titel),
            e('p', { style:{ fontSize:'14px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", margin:0 } },
              datumAnzeige(b.datum) + (b.autor ? (isDE ? ' · von ' : ' · by ') + b.autor : '')),
          ),
        ),
      ),
      /* Beitrag: Bild, Inhaltsverzeichnis, Markdown-Text – zentrierte Lesespalte */
      e('section', { style:{ background:'#fff', padding:'44px 0 56px' } },
        e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
          e('div', { style:{ maxWidth:'760px', margin:'0 auto' } },
            (b.bild && b.bild.datei) && e('img', { src: BASIS + b.bild.datei, alt:(b.bild.alt || ''), width:b.bild.breite || undefined, height:b.bild.hoehe || undefined,
              style:{ width:'100%', height:'auto', borderRadius:'16px', display:'block', marginBottom:'32px', border:'1px solid var(--border)' } }),
            toc.length > 1 && e('nav', { style:{ background:'var(--offwhite)', border:'1px solid var(--border)', borderRadius:'12px', padding:'16px 20px', marginBottom:'28px' } },
              e('p', { style:{ fontSize:'11px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--subtle)', fontFamily:"'DM Sans',sans-serif", marginBottom:'8px' } }, isDE ? 'Inhalt' : 'Contents'),
              e('ol', { style:{ margin:0, paddingLeft:'18px' } },
                toc.map((h, hi) => e('li', { key:hi, style:{ marginBottom:'5px' } },
                  e('a', { href:'#' + h.anker, style:{ fontSize:'14px', color:'var(--accent)', textDecoration:'none', fontFamily:"'DM Sans',sans-serif" },
                    onClick:(ev) => { ev.preventDefault(); const el = document.getElementById(h.anker); if (el) el.scrollIntoView({ behavior:'smooth', block:'start' }); } }, h.text)))),
            ),
            e('div', null, markdownRender(ast, 'md')),
          ),
        ),
      ),
      /* Fussbereich: Vor/Zurueck zu benachbarten Beitraegen + zurueck zur Uebersicht */
      e('section', { style:{ background:'var(--offwhite)', borderTop:'1px solid var(--border)', padding:'40px 0' } },
        e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
          e('div', { style:{ maxWidth:'760px', margin:'0 auto' } },
            (neuer || aelter) && e('div', { style:{ display:'flex', gap:'14px', flexWrap:'wrap', marginBottom:'24px' } },
              aelter ? navBox(aelter, 'prev') : e('span', { key:'sp', style:{ flex:'1 1 260px' } }),
              neuer ? navBox(neuer, 'next') : e('span', { key:'sn', style:{ flex:'1 1 260px' } }),
            ),
            e('div', { style:{ textAlign:'center' } },
              e('button', { onClick: zurUebersicht, style:{ background:'none', border:'none', cursor:'pointer', color:'var(--accent)', fontSize:'14px', fontWeight:500, fontFamily:"'DM Sans',sans-serif", padding:'6px 0' } },
                (isDE ? '← Alle Beiträge' : '← All articles'))),
          ),
        ),
      ),
    );
  }

  // Filter-Chips dynamisch aus den tatsaechlich vorhandenen Kategorien.
  const kats = ['Alle'].concat((beitraege || []).map(b => b.kategorie).filter(Boolean).filter((k, i, arr) => arr.indexOf(k) === i));
  const gefiltert = (beitraege || []).filter(b => aktiveKat === 'Alle' || b.kategorie === aktiveKat);
  const aktuelle = (ausgaben || [])[0];
  const archiv = (ausgaben || []).slice(1);

  const chipStil = (aktivChip) => aktivChip
    ? { backgroundColor:'var(--accent)', color:'#fff', padding:'8px 16px', borderRadius:'999px', fontSize:'14px', fontWeight:500, fontFamily:"'DM Sans',sans-serif", border:'none', cursor:'pointer' }
    : { backgroundColor:'white', color:'var(--muted)', padding:'8px 16px', borderRadius:'999px', fontSize:'14px', fontWeight:500, fontFamily:"'DM Sans',sans-serif", border:'1px solid var(--border)', cursor:'pointer' };

  return e('div', { className:'page-enter', 'data-nsbb-laedt': laedt ? '1' : undefined },
    e(PageHero, { label:t.aktuellesLabel,
      fit:true,
      title:t.aktuellesH1a,
      accent:t.aktuellesH1b,
      subtitle:isDE?['Die monatliche Mandanteninformation als PDF und','Fachbeiträge aus der Kanzlei – verständlich aufbereitet.']:['Our monthly client newsletter as a PDF and','articles from the firm – clear and practical.']
    }),
    // In der englischen Ansicht kurz erklaeren, warum die Inhalte deutsch sind.
    !isDE && e('section', { style:{ backgroundColor:'var(--offwhite)', padding:'14px 0', borderBottom:'1px solid var(--border)' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('p', { style:{ fontSize:'13px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", margin:0 } }, 'Our articles and client newsletters are published in German. Feel free to contact us for an English summary.'),
      ),
    ),

    /* ── Abschnitt 1: Mandanteninformation – aktuelle Ausgabe + Archiv ── */
    e('section', { style:{ backgroundColor:'white', borderBottom:'1px solid var(--border)', padding:'56px 0' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'font-display fade-up', style:{ fontSize:'clamp(1.6rem,3vw,2.2rem)', color:'#1A1917', marginBottom:'8px', fontFamily:"'Cormorant Garamond',serif" } }, isDE ? 'Mandanteninformation' : 'Client newsletter'),
        e('p', { className:'fade-up', style:{ fontSize:'14px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", maxWidth:'640px', marginBottom:'24px', lineHeight:1.7 } },
          isDE
            ? 'Jeden Monat fassen wir die wichtigsten steuerlichen Neuerungen kompakt für Sie zusammen.'
            : 'Every month we summarise the most important tax developments for you (in German).'),
        aktuelle
          ? e('div', { className:'fade-up' },
              e('a', { href: BASIS + aktuelle.datei, target:'_blank', rel:'noopener',
                       style:{ display:'inline-flex', alignItems:'center', gap:'10px', backgroundColor:'var(--accent)', color:'#fff', padding:'14px 26px', borderRadius:'999px', fontSize:'15px', fontWeight:600, fontFamily:"'DM Sans',sans-serif", textDecoration:'none' } },
                (isDE ? 'Aktuelle Ausgabe: ' : 'Current issue: ') + (aktuelle.titel || ''),
                e(Ico, { name:'arrowRight', size:16 })),
              e('p', { style:{ fontSize:'12px', color:'var(--subtle)', fontFamily:"'DM Sans',sans-serif", marginTop:'10px' } },
                (isDE ? 'PDF – öffnet in einem neuen Tab' : 'PDF – opens in a new tab') + (aktuelle.groesseBytes ? ' · ' + alsMB(aktuelle.groesseBytes) + ' MB' : '')),
            )
          : (!laedt ? e('p', { style:{ fontSize:'14px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif" } },
              isDE ? 'Die erste Mandanteninformation erscheint hier in Kürze.' : 'The first issue will be available here shortly.') : null),
        archiv.length > 0 && e('div', { className:'fade-up', style:{ marginTop:'32px' } },
          e('h3', { style:{ fontSize:'13px', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--subtle)', fontFamily:"'DM Sans',sans-serif", marginBottom:'12px' } }, isDE ? 'Frühere Ausgaben' : 'Previous issues'),
          e('div', { style:{ display:'flex', flexDirection:'column', gap:'6px', maxWidth:'520px' } },
            archiv.map(a => e('a', { key:a.id, href: BASIS + a.datei, target:'_blank', rel:'noopener',
                style:{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', padding:'10px 14px', border:'1px solid var(--border)', borderRadius:'12px', textDecoration:'none', backgroundColor:'var(--offwhite)' } },
              e('span', { style:{ fontSize:'14px', color:'#1A1917', fontFamily:"'DM Sans',sans-serif" } }, a.titel || ''),
              e('span', { style:{ fontSize:'12px', fontWeight:600, color:'var(--accent)', fontFamily:"'DM Sans',sans-serif", whiteSpace:'nowrap' } }, 'PDF'),
            )),
          ),
        ),
      ),
    ),

    /* ── Abschnitt 2: Beitraege aus der Kanzlei ── */
    e('section', { className:'py-20', style:{ backgroundColor:'var(--offwhite)' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'font-display fade-up', style:{ fontSize:'clamp(1.6rem,3vw,2.2rem)', color:'#1A1917', marginBottom:'8px', fontFamily:"'Cormorant Garamond',serif" } }, isDE ? 'Beiträge' : 'Articles'),
        e('p', { className:'fade-up', style:{ fontSize:'14px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", maxWidth:'640px', marginBottom:'24px', lineHeight:1.7 } },
          isDE ? 'Fachliches aus der Kanzlei – strukturiert, verständlich und praxisnah.' : 'Expert knowledge from the firm – structured, accessible and practical.'),
        kats.length > 1 && e('div', { className:'fade-up', style:{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'28px' } },
          kats.map(k => e('button', { key:k, onClick:()=>setAktiveKat(k), style: chipStil(aktiveKat === k) }, k === 'Alle' && !isDE ? 'All' : k))
        ),
        e('div', { className:'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
          gefiltert.length > 0 ? gefiltert.map((b, i) => {
            const bid = b.id || String(i);
            // Ganze Karte fuehrt zur eigenen Beitragsseite /beitrag/<slug>.
            return e('article', { key:bid, onClick: () => b.slug ? zeigeBeitrag(b.slug) : null,
                className:'bg-white rounded-2xl overflow-hidden flex flex-col card-hover fade-up', style:{ transitionDelay:`${i*60}ms`, boxShadow:'0 1px 3px rgba(0,0,0,.05)', border:'1px solid var(--border)', cursor: b.slug ? 'pointer' : 'default' } },
              (b.bild && b.bild.datei)
                ? e('img', { src: BASIS + b.bild.datei, alt: (b.bild.alt || ''), width: b.bild.breite || undefined, height: b.bild.hoehe || undefined, loading:'lazy',
                             style:{ width:'100%', aspectRatio:'1200 / 630', objectFit:'cover', display:'block' } })
                : e('div', { className:'img-placeholder', style:{ aspectRatio:'1200 / 630' } },
                    e('svg',{width:26,height:26,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.5,strokeLinecap:'round'},e('path',{d:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8'})),
                    e('span', null, b.kategorie || (isDE ? 'Beitrag' : 'Article')),
                  ),
              e('div', { className:'p-7 flex flex-col flex-1' },
                b.kategorie && e('span', { className:'tag mb-4 self-start' }, b.kategorie),
                e('h3', { style:{ fontSize:'15px', fontWeight:600, lineHeight:1.4, marginBottom:'10px', flex:1, color:'#1A1917', fontFamily:"'DM Sans',sans-serif" } }, b.titel),
                b.teaser && e('p', { style:{ fontSize:'13px', lineHeight:1.6, marginBottom:'18px', color:'var(--muted)', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' } }, b.teaser),
                e('div', { style:{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'14px', borderTop:'1px solid var(--border)', marginTop:'auto' } },
                  e('span', { style:{ fontSize:'12px', color:'var(--subtle)', fontFamily:"'DM Sans',sans-serif" } }, datumAnzeige(b.datum)),
                  e('span', { style:{ fontSize:'12px', fontWeight:500, display:'flex', alignItems:'center', gap:'4px', color:'var(--accent)', fontFamily:"'DM Sans',sans-serif" } },
                    (isDE ? 'Weiterlesen' : 'Read more'),
                    e(Ico, { name:'arrowRight', size:13 })),
                ),
              ),
            );
          }) : (!laedt ? e('p', { style:{ fontSize:'14px', textAlign:'center', padding:'48px', color:'var(--muted)', gridColumn:'1/-1' } },
                  isDE ? 'Derzeit noch keine Beiträge – schauen Sie bald wieder vorbei.' : 'No articles yet – please check back soon.') : null),
        ),
      ),
    ),
  );
}

// Hinweis (H1, 20.07.): Die frühere Komponente "KarriereBewerbungsform" stand
// hier, wurde aber NIRGENDS gerendert (toter Code) und täuschte einen Versand nur
// per Timer vor. Das tatsächlich genutzte Bewerbungsformular ist KarriereForm
// (weiter unten), das echt an contact.php sendet. Der tote Code wurde entfernt.
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
            e('p', { style:{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:500, color:'#3A342C', lineHeight:1.4 } }, isDE ? 'erfolgreich integrierte Kanzleien seit 2014' : 'successfully integrated practices since 2014'),
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

  // ── Anfragenummer ─────────────────────────────────────────────────────
  // Die fortlaufende Nummer vergibt jetzt der Server (contact.php) – nur dort
  // ist sie kanzleiweit eindeutig. Frueher wurde sie pro Browser im localStorage
  // gezaehlt, sodass zwei verschiedene Interessenten beide „Anfrage #1" sendeten.
  const fmtDate = () => {
    const d = new Date();
    return d.toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric'}) + ', ' + d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}) + ' Uhr';
  };

  // ── State ───────────────────────────────────────────────────
  const [stage, setStage] = useState(() => (kontaktPreset && kontaktPreset.stage) ? kontaktPreset.stage : 'choose');
  const [tab, setTab] = useState(() => (kontaktPreset && kontaktPreset.tab) ? kontaktPreset.tab : null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);      // laeuft gerade ein Versand?
  const [sendError, setSendError] = useState('');     // Fehlermeldung des Servers
  const [hp, setHp] = useState('');                   // Honeypot gegen Bots
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

  // Baut den Nachrichtentext. Frueher entstand daraus ein mailto:-Link – der
  // loeste bei Besuchern ohne eingerichtetes Mailprogramm (Web-Mail im Browser)
  // gar nichts aus, waehrend das Formular trotzdem "Vielen Dank" meldete.
  // Jetzt geht der Text an contact.php und wird dort wirklich verschickt.
  const buildBody = () => {
    const dt = fmtDate();
    const typeLabel = tab==='unternehmen' ? (isDE?'Unternehmen':'Business') : tab==='international' ? (isDE?'Internationales Steuerrecht':'International Tax') : (isDE?'Privatpersonen':'Private individuals');
    let body = isDE
      ? `Datum: ${dt}\nArt: ${typeLabel}\n\n`
      : `Date: ${dt}\nType: ${typeLabel}\n\n`;
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
    return { body: body, typeLabel: typeLabel };
  };

  const handleSubmit = () => {
    const fehler = validate();
    setErrors(fehler);
    if (Object.keys(fehler).length > 0) return;

    const daten = buildBody();
    setSending(true);
    setSendError('');

    fetch('contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: (isDE ? 'Anfrage ' : 'Inquiry ') + daten.typeLabel,
        email: form.email,
        body: daten.body,
        website: hp            // Honeypot: bleibt bei echten Besuchern leer
      })
    })
      .then(function (r) { return r.json().catch(function () { return { success: false }; }); })
      .then(function (res) {
        setSending(false);
        // Erfolg NUR melden, wenn der Server ihn bestaetigt hat.
        if (res && res.success) {
          setSubmitted(true);
          // Conversion-Signal ans dataLayer (GTM wertet es nur nach Einwilligung aus).
          try { (window.dataLayer = window.dataLayer || []).push({ event: 'generate_lead', formular: 'kontakt' }); } catch (e) {}
        } else {
          setSendError((res && res.message) || (isDE
            ? 'Der Versand ist fehlgeschlagen. Bitte schreiben Sie uns direkt an info@nsbb.de.'
            : 'Sending failed. Please email us directly at info@nsbb.de.'));
        }
      })
      .catch(function () {
        setSending(false);
        setSendError(isDE
          ? 'Der Versand ist fehlgeschlagen. Bitte prüfen Sie Ihre Internetverbindung oder schreiben Sie an info@nsbb.de.'
          : 'Sending failed. Please check your connection or email us at info@nsbb.de.');
      });
  };

  // ── Input helpers ───────────────────────────────────────────
  // Passende Autovervollstaendigung je Feld. Der Browser kann E-Mail und
  // Telefonnummer dann selbst einsetzen – am Handy spart das spuerbar Tipparbeit
  // und damit Abbrecher.
  const autoFuer = { email:'email', phone:'tel', vorname:'given-name', nachname:'family-name' };

  const inp = (name, label, type='text', placeholder='', req=true) => {
    const id = 'f-' + name;
    const fehlerId = id + '-err';
    return e('div', null,
      // htmlFor/id verbinden Beschriftung und Feld: Ein Tipp auf die
      // Beschriftung setzt den Cursor ins Feld (groessere Trefferflaeche),
      // und Screenreader koennen ansagen, wonach gefragt wird.
      e('label', { className:'flabel', htmlFor:id }, label, req && e('span', { style:{ color:'var(--accent)' } }, ' *')),
      e('input', {
        id, type, value:form[name], onChange:ev=>set(name,ev.target.value), placeholder, className:'finput',
        autoComplete: autoFuer[name] || 'on',
        inputMode: type==='tel' ? 'tel' : (type==='email' ? 'email' : undefined),
        required: req || undefined,
        'aria-required': req ? 'true' : undefined,
        'aria-invalid': errors[name] ? 'true' : undefined,
        'aria-describedby': errors[name] ? fehlerId : undefined,
      }),
      errors[name] && e('p', { className:'ferr', id:fehlerId, role:'alert' }, errors[name]),
    );
  };
  const sel = (name, label, opts) => {
    const id = 'f-' + name;
    const fehlerId = id + '-err';
    return e('div', null,
      e('label', { className:'flabel', htmlFor:id }, label, e('span', { style:{ color:'var(--accent)' } }, ' *')),
      e('select', {
        id, value:form[name], onChange:ev=>set(name,ev.target.value), className:'finput',
        'aria-required': 'true',
        'aria-invalid': errors[name] ? 'true' : undefined,
        'aria-describedby': errors[name] ? fehlerId : undefined,
      },
        e('option', { value:'' }, isDE?'Bitte auswählen ...':'Please select ...'),
        opts.map(o => e('option', { key:o, value:o }, o)),
      ),
      errors[name] && e('p', { className:'ferr', id:fehlerId, role:'alert' }, errors[name]),
    );
  };

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
    { city:'Berlin', googleBusiness: 'https://share.google/x3HqmATL5PqAqlRVX', anfahrt: { de:'S-Bahn: Linie S1 bis Zehlendorf (ca. 5 Min. Fußweg). Bus: M48/X10 Haltestelle Berlepschstraße. Parken: kostenfreie Parkplätze vor dem Gebäude verfügbar.', en:'S-Bahn: Line S1 to Zehlendorf (approx. 5 min walk). Bus: M48/X10 stop Berlepschstraße. Parking: free parking spaces available at the building.' }, img:'assets/images/standort-berlin.webp', addr:'Berlepschstr. 1\n14165 Berlin', tel:'+49 (0) 30 815 80 93', href:'tel:+493081580930', mapSrc:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2432!2d13.2487!3d52.4367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sBerlepschstr.+1%2C+14165+Berlin!5e0!3m2!1sde!2sde!4v1700000000000!5m2!1sde!2sde' },
    { city:'Köln', googleBusiness: 'https://share.google/5xYMgOyFnClvdDTx6', anfahrt: { de:'U-Bahn: Linie 3/4 bis Heumarkt (ca. 8 Min. Fußweg). S-Bahn: Köln Hauptbahnhof (ca. 10 Min. Fußweg). Parken: Tiefgaragenstellplätze stehen direkt unter unserem Gebäude zur Verfügung.', en:'Metro: Line 3/4 to Heumarkt (approx. 8 min walk). S-Bahn: Cologne Central Station (approx. 10 min walk). Parking: Underground parking spaces are available directly below our building.' }, img:'assets/images/standort-koeln.webp', addr:'Holzmarkt 2/2A\n50676 Köln', tel:'+49 (0) 221 973 064 0', href:'tel:+492219730640', mapSrc:'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2513!2d6.9670!3d50.9282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sHolzmarkt+2%2C+50676+K%C3%B6ln!5e0!3m2!1sde!2sde!4v1700000000000!5m2!1sde!2sde' },
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
                e('p', { style:{ fontSize:'14px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif" } }, isDE?'Ihre Anfrage ist bei uns eingegangen. Wir melden uns schnellstmöglich bei Ihnen.':'We have received your enquiry and will get back to you as soon as possible.'),
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
                      (isDE?['Ausländische Einkünfte','Wohnsitz im Ausland','Wegzugsbesteuerung','Erbschaft mit Auslandsbezug','Grenzgänger','Immobilien im Ausland','Schenkungen mit Auslandsbezug','Rückkehr nach Deutschland','Internationale Vermögensstrukturierung','Sonstige']:['Foreign income','Residence abroad','Exit taxation','Inheritance with foreign connection','Cross-border worker','Real estate abroad','Gifts with foreign connection','Return to Germany','International wealth structuring','Other']).map(o=>e('option',{key:o,value:o},o))
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
                    e('span', { style:{ fontSize:'13px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", lineHeight:1.5 } },
                      isDE ? 'Ich habe die ' : 'I have read the ',
                      e('button', { type:'button', onClick:()=>{setPage('datenschutz'); window.scrollTo(0,0);}, style:{ color:'var(--accent)', background:'none', border:'none', cursor:'pointer', fontSize:'12px', padding:0, textDecoration:'underline', fontFamily:"'DM Sans',sans-serif" } }, isDE?'Datenschutzerklärung':'privacy policy'),
                      isDE?' gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage zu.':' and consent to the processing of my data to handle my enquiry.'
                    )
                  ),
                  errors.datenschutz && e('p', { className:'ferr', role:'alert', 'aria-live':'polite', style:{marginTop:'-8px',marginBottom:'12px'} }, errors.datenschutz),
                  // Honeypot: fuer Menschen unsichtbar, Bots fuellen ihn aus.
                  // Nicht display:none – manche Bots erkennen das und lassen es leer.
                  e('div', { style:{ position:'absolute', left:'-9999px', width:'1px', height:'1px', overflow:'hidden' }, 'aria-hidden':'true' },
                    e('label', { htmlFor:'nsbb-website-hp' }, 'Website'),
                    e('input', { id:'nsbb-website-hp', type:'text', name:'website', tabIndex:-1, autoComplete:'off', value:hp, onChange:ev=>setHp(ev.target.value) })
                  ),
                  e('button', {
                    className:'btn-p',
                    onClick:handleSubmit,
                    disabled: sending,
                    style:{ opacity: sending ? .7 : 1, cursor: sending ? 'wait' : 'pointer' },
                    'aria-label': isDE?'Anfrage absenden':'Send enquiry'
                  }, e(Ico,{name:'mail',size:16}), sending ? (isDE?'Wird gesendet …':'Sending …') : (isDE?'Anfrage absenden':'Send enquiry')),
                  sendError && e('p', {
                    className:'ferr', role:'alert', 'aria-live':'assertive',
                    style:{ marginTop:'10px', fontSize:'.8rem', lineHeight:1.5 }
                  }, sendError),
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
                // Google-Business-Profil des Standorts. Führt Besucher direkt
                // zu Bewertungen – der stärkste Hebel für die lokale
                // Auffindbarkeit. Erscheint nur, wenn eine URL hinterlegt ist.
                loc.googleBusiness && e('a', {
                  href: loc.googleBusiness, target:'_blank', rel:'noopener noreferrer',
                  style:{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'13px', fontWeight:500, color:'var(--muted)', marginTop:'10px', fontFamily:"'DM Sans',sans-serif" }
                }, e(Ico,{name:'mapPin',size:13}), isDE?'Auf Google ansehen & bewerten':'View & review on Google'),
              ),
            ),
            e('div', { style:{ borderTop:'1px solid var(--border)', padding:'14px 20px', backgroundColor:'white' } },
              e('div', { style:{ display:'flex', alignItems:'flex-start', gap:'8px' } },
                e('span', { style:{ flexShrink:0, marginTop:'2px' } }, e(Ico,{name:'mapPin',size:13})),
                e('div', { style:{ fontSize:'13px', lineHeight:1.6, color:'var(--muted)', fontFamily:"'DM Sans',sans-serif" } },
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
            // Google Maps wurde entfernt: Die frühere Karten-Einbettung lud
            // beim Seitenaufruf ungefragt von Google und übertrug die IP-Adresse
            // des Besuchers – bei einer Kanzlei ein Datenschutzrisiko. Stattdessen
            // eine klickbare Fläche, die NICHTS automatisch lädt und Google Maps
            // erst nach aktivem Klick in einem neuen Tab öffnet.
            // Die spätere Zwei-Klick-Karte (echte Karte nach Klick nachladen)
            // steht in ROADMAP.md.
            e('a', {
              href: loc.city==='Berlin'
                ? 'https://www.google.com/maps/search/?api=1&query=NSBB+Steuerberatung+Berlin'
                : 'https://www.google.com/maps/search/?api=1&query=NSBB+Steuerberatung+K%C3%B6ln',
              target:'_blank', rel:'noopener noreferrer',
              'aria-label': (isDE?'Route planen zu NSBB ':'Directions to NSBB ')+loc.city+(isDE?' – öffnet Google Maps in neuem Tab':' – opens Google Maps in a new tab'),
              style:{ borderTop:'1px solid var(--border)', minHeight:'96px', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', backgroundColor:'var(--offwhite)', color:'var(--accent)', fontFamily:"'DM Sans',sans-serif", fontSize:'14px', fontWeight:600, textDecoration:'none' }
            },
              e(Ico,{name:'mapPin',size:16}),
              isDE?'Route planen · in Google Maps öffnen':'Get directions · open in Google Maps'
            )
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
    e(PageHero, { label: isDE?'Rechtliches':'Legal', fit:true, title: 'Impressum', subtitle: isDE?['Angaben gemäß § 5 TMG und','berufsrechtliche Informationen.']:['Information pursuant to § 5 TMG','and professional regulations.'] }),

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

    e(PageHero, { label: isDE?'Rechtliches':'Legal', fit:true, title: isDE?'Datenschutzerklärung':'Privacy Policy', subtitle: isDE?['Wie wir mit Ihren personenbezogenen','Daten umgehen.']:['How we handle your','personal data.'] }),

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
        e('p', { style:S.p }, isDE?'Wir haben mit All-Inkl einen Vertrag über Auftragsverarbeitung (AVV) geschlossen. Dies ist ein datenschutzrechtlich vorgeschriebener Vertrag, der gewährleistet, dass All-Inkl die personenbezogenen Daten unserer Websitebesucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.':'We have concluded a data processing agreement (DPA) with All-Inkl. This is a contract required under data protection law which ensures that All-Inkl processes the personal data of our website visitors only in accordance with our instructions and in compliance with the GDPR.'),

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
        e('h3', { style:S.h3 }, isDE?'Server-Logdateien':'Server log files'),
        e('p', { style:S.p }, isDE?'Der Provider der Seite erhebt und speichert automatisch Informationen in sogenannten Server-Logdateien, die Ihr Browser automatisch an uns übermittelt. Dies sind: Browsertyp und -version, verwendetes Betriebssystem, Referrer-URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und die IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.':'The provider of this site automatically collects and stores information in so-called server log files, which your browser transmits to us automatically. These are: browser type and version, operating system used, referrer URL, host name of the accessing computer, time of the server request and the IP address. This data is not merged with other data sources.'),
        e('p', { style:S.p }, isDE?'Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Sicherheit seiner Website; hierzu müssen die Server-Logdateien erfasst werden. Die Daten werden nach kurzer Zeit gelöscht, soweit sie nicht zur Aufklärung von Missbrauch oder Störungen benötigt werden.':'This data is collected on the basis of Art. 6(1)(f) GDPR. The website operator has a legitimate interest in the technically error-free presentation and the security of its website; the server log files must be recorded for this purpose. The data is deleted after a short time unless it is needed to investigate misuse or malfunctions.'),
        e('h3', { style:S.h3 }, isDE?'Kontaktformular':'Contact form'),
        e('p', { style:S.p }, isDE?'Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.':'If you send us enquiries via the contact form, the details you provide, including the contact details given there, will be stored by us for the purpose of processing the enquiry and in case of follow-up questions. We do not pass on this data without your consent.'),
        e('p', { style:S.p }, isDE?'Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde.':'The processing of this data is based on Art. 6(1)(b) GDPR, provided your enquiry relates to the fulfilment of a contract or is necessary for pre-contractual measures. In all other cases, processing is based on our legitimate interest in the effective handling of enquiries addressed to us (Art. 6(1)(f) GDPR) or on your consent (Art. 6(1)(a) GDPR), if requested.'),
        e('p', { style:S.p }, isDE?'Zum Schutz vor automatisiertem Missbrauch (Spam) begrenzen wir die Zahl der Formularsendungen pro Absender. Dazu speichern wir für maximal eine Stunde einen Zeitstempel je zugreifender IP-Adresse – die IP-Adresse wird dabei nicht im Klartext, sondern nur als nicht rückrechenbarer Prüfwert (Hash) gespeichert. Rechtsgrundlage ist unser berechtigtes Interesse an der Abwehr von Missbrauch (Art. 6 Abs. 1 lit. f DSGVO).':'To protect against automated misuse (spam), we limit the number of form submissions per sender. For this purpose we store a timestamp per accessing IP address for a maximum of one hour – the IP address is not stored in plain text but only as a non-reversible checksum (hash). The legal basis is our legitimate interest in preventing misuse (Art. 6(1)(f) GDPR).'),

        e('div', { style:{ height:'1px', backgroundColor:'#ECEAE6', margin:'40px 0' } }),

        e('h2', { style:S.h2flat }, isDE?'5. Analyse-Tools und Werbung':'5. Analytics tools and advertising'),
        e('h3', { style:S.h3 }, 'Google Tag Manager'),
        e('p', { style:S.p }, isDE?'Wir setzen den Google Tag Manager ein. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Der Google Tag Manager ist ein Tool, mit dessen Hilfe wir Tracking- oder Statistik-Tools auf unserer Website einbinden können. Der Google Tag Manager selbst erstellt keine Nutzerprofile, speichert keine Cookies und nimmt keine eigenständigen Analysen vor.':'We use Google Tag Manager. The provider is Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. Google Tag Manager is a tool that allows us to integrate tracking or statistics tools on our website. Google Tag Manager itself does not create user profiles, does not store cookies, and does not carry out any independent analyses.'),

        e('h3', { style:S.h3 }, isDE?'Einwilligung (Consent) und Cookie-Banner':'Consent and cookie banner'),
        e('p', { style:S.p }, isDE?'Statistik- und Marketing-Dienste (siehe unten) werden erst geladen, nachdem Sie über unseren Cookie-Banner ausdrücklich eingewilligt haben. Vor Ihrer Einwilligung werden keine Daten an Google übertragen. Der Google Tag Manager wird ebenfalls erst nach Ihrer Einwilligung geladen. Wir verwenden den Google Consent Mode: Bis zu Ihrer Einwilligung stehen alle Einwilligungssignale auf „denied" (abgelehnt). Ihre Auswahl speichern wir lokal in Ihrem Browser; Sie können sie jederzeit über den Link „Cookie-Einstellungen" im Seitenfuß ändern oder widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt unberührt. Rechtsgrundlage ist Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG.':'Statistics and marketing services (see below) are only loaded after you have expressly consented via our cookie banner. No data is transmitted to Google before your consent. Google Tag Manager is also only loaded after your consent. We use Google Consent Mode: until you consent, all consent signals are set to "denied". We store your choice locally in your browser; you can change or withdraw it at any time via the "Cookie settings" link in the footer. The lawfulness of processing carried out until withdrawal remains unaffected. The legal basis is your consent pursuant to Art. 6(1)(a) GDPR and § 25(1) TDDDG.'),

        e('h3', { style:S.h3 }, isDE?'Google Ads und Conversion-Tracking':'Google Ads and conversion tracking'),
        e('p', { style:S.p }, isDE?'Nach Ihrer Einwilligung setzen wir über den Google Tag Manager Google Ads mit Conversion-Tracking ein. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Damit werten wir aus, ob und wie Nutzer über unsere Anzeigen auf die Website gelangt sind (z. B. ob ein Kontaktformular abgesendet wurde). Dabei können Cookies gesetzt und Daten – auch an Server von Google in den USA – übertragen werden. Für die Datenübermittlung in die USA stützt sich Google auf die Standardvertragsklauseln der EU-Kommission und das EU-US Data Privacy Framework. Weitere Informationen finden Sie in der Datenschutzerklärung von Google unter https://policies.google.com/privacy.':'After your consent, we use Google Ads with conversion tracking via Google Tag Manager. The provider is Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. This lets us analyse whether and how users reached the website via our ads (e.g. whether a contact form was submitted). Cookies may be set and data transmitted – including to Google servers in the USA. For the transfer to the USA, Google relies on the EU Commission\'s standard contractual clauses and the EU-US Data Privacy Framework. For more information see Google\'s privacy policy at https://policies.google.com/privacy.'),

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
  useFaqSchema(faqs);

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
    e(PageHero, { label:isDE?'Branchenlösungen':'Industry solutions', fit:true, title:isDE?'Spezialisierte Beratung':'Specialised advice', accent:isDE?'für Ihre Branche.':'for your sector.', subtitle:isDE?['Tiefes Branchenverständnis kombiniert mit strategischer','Steuerberatung – für die Anforderungen Ihrer Branche.']:['Deep sector understanding combined with strategic tax','advice – for the requirements of your industry.'], back:isDE?'Leistungen für Unternehmen':'Services for Businesses', backFn:()=>go('leistungen-unternehmen') }),
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
  var s5 = useState(null);
  var file = s5[0]; var setFile = s5[1];            // optionaler Lebenslauf
  var s6 = useState('');
  var hp = s6[0]; var setHp = s6[1];                // Honeypot gegen Bots

  function setField(k, v) { setForm(function(f) { var n={}; for(var x in f) n[x]=f[x]; n[k]=v; return n; }); }

  function handleSubmit() {
    if (!form.vorname || !form.nachname || !form.email || !form.phone || !form.standort || !form.erfahrung) {
      setFormError(isDE ? 'Bitte alle Pflichtfelder ausfüllen.' : 'Please fill in all required fields.');
      return;
    }
    if (file && file.size > 5*1024*1024) {
      setFormError(isDE ? 'Die Datei ist zu groß (max. 5 MB).' : 'The file is too large (max. 5 MB).');
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
               (form.message ? '\n\n' + (isDE?'Nachricht:\n':'Message:\n') + form.message : '') +
               (file ? '\n\n' + (isDE?'(Lebenslauf im Anhang)':'(CV attached)') : '');
    // FormData statt JSON, damit ein Lebenslauf angehaengt werden kann (contact.php
    // nimmt beides an). Honeypot 'website' bleibt bei echten Besuchern leer.
    var fd = new FormData();
    fd.append('type', isDE?'Karriere':'Career');
    fd.append('email', form.email);
    fd.append('body', body);
    fd.append('website', hp);
    if (file) { fd.append('datei', file); }
    fetch('contact.php', { method:'POST', body: fd })
    .then(function(r){ return r.json(); })
    .then(function(res){ setSending(false); if(res.success){ setSent(true); try { (window.dataLayer = window.dataLayer || []).push({ event: 'generate_lead', formular: 'karriere' }); } catch(e){} } else { setFormError(res.message||(isDE?'Fehler beim Senden. Bitte an karriere@nsbb.de wenden.':'Error. Please email karriere@nsbb.de.')); } })
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
    // Honeypot: fuer Menschen unsichtbar, nur Bots fuellen es aus.
    e('input',{type:'text',name:'website',value:hp,onChange:function(ev){setHp(ev.target.value);},tabIndex:-1,autoComplete:'off','aria-hidden':'true',style:{position:'absolute',left:'-9999px',width:'1px',height:'1px',opacity:0}}),
    e('div', { className:'grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4' },
      e('div', null, e('label',{className:'flabel',htmlFor:'k-vorname'}, isDE?'Vorname':'First name', e('span',{style:{color:'var(--accent)'}},' *')), e('input',{id:'k-vorname',autoComplete:'given-name','aria-required':'true',type:'text',value:form.vorname,onChange:function(ev){setField('vorname',ev.target.value);},placeholder:isDE?'Vorname':'First name',className:'finput',maxLength:80})),
      e('div', null, e('label',{className:'flabel',htmlFor:'k-nachname'}, isDE?'Nachname':'Last name', e('span',{style:{color:'var(--accent)'}},' *')), e('input',{id:'k-nachname',autoComplete:'family-name','aria-required':'true',type:'text',value:form.nachname,onChange:function(ev){setField('nachname',ev.target.value);},placeholder:isDE?'Nachname':'Last name',className:'finput',maxLength:80})),
    ),
    e('div', { className:'grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4' },
      e('div', null, e('label',{className:'flabel',htmlFor:'k-email'}, 'E-Mail', e('span',{style:{color:'var(--accent)'}},' *')), e('input',{id:'k-email',autoComplete:'email',inputMode:'email','aria-required':'true',type:'email',value:form.email,onChange:function(ev){setField('email',ev.target.value);},placeholder:isDE?'ihre@email.de':'your@email.com',className:'finput',maxLength:100})),
      e('div', null, e('label',{className:'flabel',htmlFor:'k-phone'}, isDE?'Telefonnummer':'Phone', e('span',{style:{color:'var(--accent)'}},' *')), e('input',{id:'k-phone',autoComplete:'tel',inputMode:'tel','aria-required':'true',type:'tel',value:form.phone,onChange:function(ev){setField('phone',ev.target.value);},placeholder:'+49 ...',className:'finput',maxLength:100})),
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
    e('div', { className:'mb-6' },
      e('label',{className:'flabel'}, isDE?'Lebenslauf (optional · PDF, DOC, JPG · max. 5 MB)':'CV (optional · PDF, DOC, JPG · max. 5 MB)'),
      e('input',{type:'file',accept:'.pdf,.doc,.docx,.jpg,.jpeg,.png',onChange:function(ev){ var fl=ev.target.files&&ev.target.files[0]; setFile(fl||null); setFormError(''); },className:'finput',style:{padding:'8px',fontSize:'13px'}}),
      file && e('p',{className:'text-sm',style:{color:'var(--muted)',marginTop:'4px'}}, file.name + ' · ' + Math.round(file.size/1024) + ' KB')
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
    e(PageHero, { label:isDE?'Karriere bei NSBB':'Career at NSBB', fit:true, title:isDE?'Steuerberater/in':'Tax Advisor', subtitle:isDE?['Voll- oder Teilzeit · Berlin oder Köln','Moderne, digitale Kanzlei mit echten Perspektiven.']:['Full or part time · Berlin or Cologne','A modern, fully digital firm with real prospects.'], back:isDE?'Alle Stellen':'All positions', backFn:function(){ setPage('karriere'); } }),
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
    e(PageHero, { label:isDE?'Karriere bei NSBB':'Career at NSBB', fit:true, title:isDE?'Steuerfachwirt/in':'Senior Tax Clerk', subtitle:isDE?['Voll- oder Teilzeit · Berlin oder Köln','Moderne, digitale Kanzlei mit echten Perspektiven.']:['Full or part time · Berlin or Cologne','A modern, fully digital firm with real prospects.'], back:isDE?'Alle Stellen':'All positions', backFn:function(){ setPage('karriere'); } }),
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
    e(PageHero, { label:isDE?'Karriere bei NSBB':'Career at NSBB', fit:true, title:isDE?'Steuerfachangestellte/r':'Tax Clerk', subtitle:isDE?['Voll- oder Teilzeit · Berlin oder Köln','Moderne, digitale Kanzlei mit echten Perspektiven.']:['Full or part time · Berlin or Cologne','A modern, fully digital firm with real prospects.'], back:isDE?'Alle Stellen':'All positions', backFn:function(){ setPage('karriere'); } }),
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
    e(PageHero, { label:isDE?'Karriere bei NSBB':'Career at NSBB', fit:true, title:isDE?'Bilanzbuchhalter/in':'Financial Accountant', subtitle:isDE?['Voll- oder Teilzeit · Berlin oder Köln','Moderne, digitale Kanzlei mit echten Perspektiven.']:['Full or part time · Berlin or Cologne','A modern, fully digital firm with real prospects.'], back:isDE?'Alle Stellen':'All positions', backFn:function(){ setPage('karriere'); } }),
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
    e(PageHero, { label:isDE?'Karriere bei NSBB':'Career at NSBB', fit:true, title:isDE?'Initiativbewerbung':'Speculative Application', subtitle:isDE?['Alle Positionen · Berlin oder Köln','Moderne, digitale Kanzlei mit echten Perspektiven.']:['All positions · Berlin or Cologne','A modern, fully digital firm with real prospects.'], back:isDE?'Alle Stellen':'All positions', backFn:function(){ setPage('karriere'); } }),
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
    // Aktuelles (frueher "Insights"; Beitragsdaten kommen aus daten/, nicht aus dem Code)
    aktuellesLabel: 'Aktuelles',
    aktuellesH1a: 'Gut informiert.',
    aktuellesH1b: 'Monat für Monat.',
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
    // Laenge an die deutsche Fassung angeglichen: 5 Zeilen wie im Deutschen,
    // mit einer aehnlich vollen letzten Zeile (33 vs. 32 Zeichen) – der Hero
    // springt beim Sprachwechsel nicht mehr und es bleibt kein einzelnes
    // Wort allein stehen. Zwei inhaltliche Verbesserungen nebenbei:
    // "owner-managed companies" trifft die Zielgruppe genauer als "companies",
    // und "German and international" sagt einem auslaendischen Leser mehr
    // als "national". Bei Aenderungen bitte die Zeilenzahl nachmessen.
    heroSub: 'We support entrepreneurs, owner-managed companies and private individuals with growth, structuring and tax-related decisions – from day-to-day advisory work through to complex questions of German and international tax law.',
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
    // Insights (German "Aktuelles"; article data comes from daten/, not from code)
    aktuellesLabel: 'Insights',
    aktuellesH1a: 'Well informed.',
    aktuellesH1b: 'Month after month.',
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

/* ─────────────────────────────────────────────────────────
   EINWILLIGUNGSVERWALTUNG (Consent) + Google Tag Manager

   Grundsatz (mit der Projektleitung abgestimmt, 20.07.2026):
   GTM lädt ERST NACH ausdrücklicher Einwilligung. Vor der Zustimmung geht
   kein Byte an Google. Das ist die strengste Auslegung von § 25 TDDDG.

   Ablauf:
   1. Beim Start wird Google Consent Mode v2 auf "denied" gesetzt (falls GTM
      später lädt, kennt es den Status sofort).
   2. Der Besucher wählt im Banner: notwendig (immer), Statistik, Marketing.
   3. Wird Statistik oder Marketing zugestimmt, wird der Consent auf "granted"
      aktualisiert UND der GTM-Container nachgeladen. Sonst passiert nichts.
   4. Die Entscheidung liegt in localStorage; über den Fußzeilen-Link
      "Cookie-Einstellungen" lässt sie sich jederzeit widerrufen.

   Die eigentlichen Google-Ads-Conversion-Tags werden IM GTM-Interface
   konfiguriert (GTM-NNQTHD76), nicht hier im Code.
───────────────────────────────────────────────────────── */

var GTM_ID = 'GTM-NNQTHD76';
var CONSENT_KEY = 'nsbb_consent_v1';

// dataLayer + gtag früh bereitstellen und Consent-Grundzustand auf "denied".
function consentBootstrap() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });
}

function consentLesen() {
  try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null'); }
  catch (e) { return null; }
}

function gtmLaden() {
  if (window.__nsbbGtmGeladen) return;
  window.__nsbbGtmGeladen = true;
  window.dataLayer.push({ 'gtm.start': +new Date(), event: 'gtm.js' });
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
  document.head.appendChild(s);
}

// Wahl anwenden: Consent-Signale aktualisieren und GTM ggf. laden.
function consentAnwenden(wahl) {
  window.gtag('consent', 'update', {
    analytics_storage: wahl.analytics ? 'granted' : 'denied',
    ad_storage:        wahl.marketing ? 'granted' : 'denied',
    ad_user_data:      wahl.marketing ? 'granted' : 'denied',
    ad_personalization:wahl.marketing ? 'granted' : 'denied'
  });
  if (wahl.analytics || wahl.marketing) gtmLaden();
}

// Beim App-Start: Grundzustand setzen und eine bereits getroffene Wahl anwenden.
consentBootstrap();
(function(){
  var g = consentLesen();
  if (g && (g.analytics || g.marketing)) consentAnwenden(g);
})();

function CookieBanner({ lang }) {
  const isDE = lang === 'DE';
  const gespeichert = consentLesen();
  // Sichtbar, wenn noch keine Entscheidung vorliegt.
  const [show, setShow] = React.useState(!gespeichert);
  const [details, setDetails] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(gespeichert ? !!gespeichert.analytics : false);
  const [marketing, setMarketing] = React.useState(gespeichert ? !!gespeichert.marketing : false);

  // Über den Fußzeilen-Link erneut öffnen (Widerruf/Änderung).
  React.useEffect(() => {
    const oeffnen = () => {
      const g = consentLesen();
      setAnalytics(g ? !!g.analytics : false);
      setMarketing(g ? !!g.marketing : false);
      setDetails(true); setShow(true);
    };
    window.addEventListener('nsbb:open-consent', oeffnen);
    return () => window.removeEventListener('nsbb:open-consent', oeffnen);
  }, []);

  const speichern = (wahl) => {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...wahl, ts: Date.now() })); } catch (e) {}
    consentAnwenden(wahl);
    setShow(false); setDetails(false);
  };
  const alleAkzeptieren = () => speichern({ necessary:true, analytics:true, marketing:true });
  const nurNotwendige   = () => speichern({ necessary:true, analytics:false, marketing:false });
  const auswahlSpeichern= () => speichern({ necessary:true, analytics, marketing });

  if (!show) return null;

  const btnP = { padding:'9px 18px', borderRadius:'999px', background:'var(--accent)', color:'white', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:600, fontFamily:"'DM Sans',sans-serif" };
  const btnS = { padding:'9px 18px', borderRadius:'999px', background:'transparent', color:'var(--text)', border:'1.5px solid var(--border)', cursor:'pointer', fontSize:'13px', fontWeight:500, fontFamily:"'DM Sans',sans-serif" };
  const btnLink = { background:'none', border:'none', color:'var(--accent)', cursor:'pointer', fontSize:'12px', fontWeight:500, fontFamily:"'DM Sans',sans-serif", textDecoration:'underline', padding:0 };

  // Eine Kategorie-Zeile mit Schalter.
  const kategorie = (titel, text, an, setAn, fest) =>
    e('label', { style:{ display:'flex', gap:'12px', alignItems:'flex-start', padding:'10px 0', borderTop:'1px solid var(--border)', cursor: fest?'default':'pointer' } },
      e('input', { type:'checkbox', checked: fest ? true : an, disabled: fest, onChange: fest?undefined:(ev=>setAn(ev.target.checked)), style:{ marginTop:'2px', accentColor:'var(--accent)', flexShrink:0 } }),
      e('div', null,
        e('p', { style:{ fontSize:'13px', fontWeight:600, color:'#1A1917', fontFamily:"'DM Sans',sans-serif", margin:'0 0 2px' } }, titel + (fest ? (isDE?' (immer aktiv)':' (always on)') : '')),
        e('p', { style:{ fontSize:'12px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", margin:0, lineHeight:1.5 } }, text)
      )
    );

  return e('div', { className:'cookie-banner', role:'dialog', 'aria-modal':'false', 'aria-label': isDE?'Cookie-Einstellungen':'Cookie settings' },
    e('div', { style:{ flex:1, minWidth:'240px', maxWidth: details ? '640px' : '520px' } },
      e('p', { style:{ fontSize:'14px', fontWeight:600, color:'#1A1917', fontFamily:"'DM Sans',sans-serif", marginBottom:'4px' } }, isDE?'Wir respektieren Ihre Privatsphäre':'We respect your privacy'),
      e('p', { style:{ fontSize:'12px', color:'var(--muted)', fontFamily:"'DM Sans',sans-serif", lineHeight:1.6, marginBottom: details?'8px':0 } },
        isDE
          ? 'Technisch notwendige Cookies setzen wir immer. Für Statistik und Marketing (Google) bitten wir um Ihre Einwilligung. Sie können frei wählen und Ihre Entscheidung jederzeit über „Cookie-Einstellungen" im Seitenfuß ändern.'
          : 'We always set technically necessary cookies. For statistics and marketing (Google) we ask for your consent. You can choose freely and change your decision any time via “Cookie settings” in the footer.'
      ),
      details && e('div', { style:{ marginTop:'4px' } },
        kategorie(isDE?'Notwendig':'Necessary', isDE?'Für den Betrieb der Seite erforderlich. Speichert nur Ihre Cookie-Auswahl.':'Required to operate the site. Stores only your cookie choice.', true, null, true),
        kategorie(isDE?'Statistik':'Statistics', isDE?'Hilft zu verstehen, wie die Seite genutzt wird (z. B. Google Analytics). Derzeit nicht aktiv eingebunden.':'Helps understand how the site is used (e.g. Google Analytics). Not actively integrated yet.', analytics, setAnalytics, false),
        kategorie(isDE?'Marketing':'Marketing', isDE?'Misst den Erfolg von Google-Ads-Anzeigen (Conversion-Tracking). Lädt Google Tag Manager.':'Measures the success of Google Ads (conversion tracking). Loads Google Tag Manager.', marketing, setMarketing, false),
        e('button', { onClick:()=>setDetails(false), style:{ ...btnLink, marginTop:'8px' } }, isDE?'weniger anzeigen':'show less')
      ),
      !details && e('button', { onClick:()=>setDetails(true), style:{ ...btnLink, marginTop:'6px' } }, isDE?'Einstellungen anzeigen':'Show settings')
    ),
    e('div', { style:{ display:'flex', gap:'8px', flexShrink:0, flexWrap:'wrap', alignItems:'center' } },
      e('button', { onClick:nurNotwendige, style:btnS }, isDE?'Nur notwendige':'Necessary only'),
      details && e('button', { onClick:auswahlSpeichern, style:btnS }, isDE?'Auswahl speichern':'Save selection'),
      e('button', { onClick:alleAkzeptieren, style:btnP }, isDE?'Alle akzeptieren':'Accept all')
    ),
  );
}

function isDE_skip(lang){ return lang==='DE' ? 'Zum Inhalt springen' : 'Skip to content'; }

const validPages = ['home','leistungen','leistungen-unternehmen','leistungen-unternehmen-leistungen','leistungen-unternehmen-laufend','leistungen-unternehmen-gestaltung','leistungen-unternehmen-bwl','leistungen-unternehmen-branchen','branche-ecommerce','branche-bau','branche-immobilien','branche-international','branche-startup','branche-aerzte','leistungen-international','intl-wegzug','intl-wohnsitz','intl-dba','intl-einkuenfte','intl-immobilien','intl-erbschaft','intl-schenkung','intl-rueckkehr','intl-grenzgaenger','intl-vermoegen','leistungen-privat','digital','tgs','aktuelles','ueber-uns','steuerberater-berlin','steuerberater-koeln','karriere','karriere-steuerberater','karriere-steuerfachwirt','karriere-steuerfachangestellte','karriere-bilanzbuchhalter','karriere-initiativbewerbung','kanzleinachfolge','kontakt','faq','impressum','datenschutz'];

/* ─────────────────────────────────────────────────────────
   ADRESSEN (Routing)

   Bis Juli 2026 lief die Navigation ueber Adress-Fragmente
   (nsbb.de/#kontakt). Das sah aus wie ein Anker, war aber ein
   Zustandsmarker: JavaScript las ihn aus und rendert eine andere Seite.
   Fuer Suchmaschinen existierte damit nur EINE Adresse – alle 40
   Unterseiten waren unsichtbar und konnten nicht ranken.

   Jetzt echte Adressen (nsbb.de/kontakt) ueber die History-API.
   Damit das traegt, gehoeren drei Dinge zusammen:
     1. hier die Umstellung auf pushState/popstate
     2. eine Rewrite-Regel in der .htaccess (unbekannte Pfade -> index.html)
     3. je Seite eine HTML-Datei mit eigenem Titel (tools/seiten-generator.js)
   Fehlt eines davon, gibt es 404er oder 41 Adressen mit gleichem Titel.
───────────────────────────────────────────────────────── */

// Basis-Pfad: live "/", auf der Testadresse "/2026/". Steht als Meta-Angabe
// in der index.html und wird von den Paket-Skripten gesetzt.
const BASIS = (() => {
  const m = document.querySelector('meta[name="app-base"]');
  let b = (m && m.content) || '/';
  if (!b.startsWith('/')) b = '/' + b;
  if (!b.endsWith('/')) b += '/';
  return b;
})();

const pfadFuer = (p) => BASIS + (p === 'home' ? '' : p);

const seiteAusAdresse = () => {
  // Alte Fragment-Adressen (#kontakt) weiter verstehen – geteilte Links,
  // Lesezeichen und Suchmaschinen-Eintraege sollen nicht ins Leere laufen.
  const frag = window.location.hash.replace('#', '');
  if (frag && validPages.includes(frag)) return frag;

  let pfad = window.location.pathname;
  if (pfad.startsWith(BASIS)) pfad = pfad.slice(BASIS.length);
  pfad = pfad.replace(/^\/+|\/+$/g, '');
  if (!pfad || pfad === 'index.html') return 'home';
  // Einzelne Beitraege liegen unter /beitrag/<slug> (bewusst NICHT /aktuelles/…,
  // das kollidierte auf dem Server mit der vorhandenen Datei aktuelles.html und
  // lieferte darum 404). Sie gehoeren zur selben Seite wie die Uebersicht
  // /aktuelles – AktuellesPage liest den Slug selbst aus der Adresse.
  if (pfad === 'aktuelles' || pfad.startsWith('beitrag/')) return 'aktuelles';
  return validPages.includes(pfad) ? pfad : 'home';
};

// Slug eines Beitrags aus /beitrag/<slug> lesen (leerer String, wenn nicht vorhanden).
const beitragsSlugAusPfad = () => {
  let pfad = window.location.pathname;
  if (pfad.startsWith(BASIS)) pfad = pfad.slice(BASIS.length);
  pfad = pfad.replace(/^\/+|\/+$/g, '');
  const m = /^beitrag\/([a-z0-9-]+)$/.exec(pfad);
  return m ? m[1] : '';
};

/* ─────────────────────────────────────────────────────────
   STANDORTSEITEN (Berlin / Köln) – echte SPA-Seiten mit
   identischem Header (Nav) und identischer Hero (PageHero).
   Die statischen HTML-Dateien bleiben zusätzlich für SEO bestehen.
───────────────────────────────────────────────────────── */
const STANDORT_DATA = {
  berlin: {
    teamStandort: 'Berlin',
    eyebrow: { de:'Standort Berlin · Zehlendorf', en:'Berlin office · Zehlendorf' },
    title:   { de:'Steuerberater in', en:'Tax Advisor in' }, accentDe:'Berlin.', accentEn:'Berlin.',
    sub: { de:['Digital arbeitende Steuerberatung in Berlin-Zehlendorf –','für Unternehmen, Privatpersonen und international tätige Mandanten.'],
           en:['A digitally run tax advisory firm in Berlin-Zehlendorf –','for companies, private individuals and internationally active clients.'] },
    intro: { de:'Von der Berlepschstraße aus begleiten wir Unternehmen, Unternehmensgruppen und Privatpersonen – von der laufenden Steuerberatung bis zu komplexen Gestaltungsfragen. Steuerliche Entscheidungen denken wir nie isoliert, sondern immer im Zusammenhang mit Ihren langfristigen Zielen. Als unabhängiges Mitglied des weltweiten TGS-Netzwerks begleiten wir auch grenzüberschreitende Sachverhalte aus einer Hand.',
             en:'From Berlepschstraße, we support companies, corporate groups and private individuals – from ongoing tax advice to complex structuring questions. We never view tax decisions in isolation, but always in the context of your long-term goals. As an independent member of the worldwide TGS network, we also handle cross-border matters from a single source.' },
    servicesHead: { de:'Unsere Leistungen als Steuerberater in Berlin', en:'Our Services as a Tax Advisor in Berlin' },
    servicesSub: { de:'Unser Anspruch: persönliche Beratung, klare Lösungen und langfristige Perspektiven – für den Mittelstand, für Unternehmensgruppen und für private Vermögen.', en:'Our standard: personal advice, clear solutions and long-term perspectives – for owner-managed businesses, corporate groups and private wealth.' },
    svcUnternehmen: { de:'Wir übernehmen Ihre laufende Steuerberatung, entwickeln steuerliche Gestaltungen und begleiten Sie betriebswirtschaftlich – von der Jahresabschlusserstellung über Finanz- und Lohnbuchhaltung bis zur Vorbereitung von Bank- und Finanzierungsgesprächen.', en:'We handle your ongoing tax advice, develop tax structuring options and support you on the business side – from annual financial statements and financial and payroll accounting to the preparation of bank and financing discussions.' },
    svcIntl: { de:'Wir beraten bei Inbound- und Outbound-Sachverhalten, bei der Errichtung von Auslandsgesellschaften und Betriebsstätten sowie bei Verrechnungspreisen – eigenständig und bei Bedarf gemeinsam mit unseren TGS-Partnern weltweit.', en:'We advise on inbound and outbound matters, on setting up foreign subsidiaries and permanent establishments, and on transfer pricing – independently and, where needed, together with our TGS partners worldwide.' },
    svcPrivat: { de:'Wir begleiten Sie bei der Einkommensteuer, bei Erbschaft und Schenkung, bei Immobilien und bei der Vermögensnachfolge – vorausschauend und mit Blick auf die gesamte Vermögenssituation.', en:'We support you with income tax, inheritance and gifts, real estate and succession planning – with foresight and a view of your overall financial situation.' },
    ansprechHead: { de:'Ihre Ansprechpartner in Berlin', en:'Your Contacts in Berlin' },
    ansprechSub: { de:'Am Standort Berlin ist bei jedem Erstgespräch ein Berufsträger persönlich präsent – kein Callcenter, kein ständiger Wechsel.', en:'A qualified professional is personally present at every initial meeting – no call centre, no constant change of contact.' },
    digitalHead: { de:'Digitale Zusammenarbeit', en:'Working Together Digitally' },
    digitalText: { de:'Die Zusammenarbeit mit NSBB ist vollständig digital möglich. Über DATEV, gesicherte Cloud-Prozesse und digitale Belegübermittlung übermitteln Sie Unterlagen ortsunabhängig; Dokumente unterschreiben Sie per eSign. Feste Ansprechpartner, klare Abläufe und kurze Kommunikationswege sorgen dafür, dass Sie jederzeit den Überblick behalten und Zeit für Ihr Unternehmen gewinnen. Ob Sie in Berlin ansässig sind oder überregional arbeiten, spielt für die Zusammenarbeit keine Rolle.', en:'Working with NSBB can be entirely digital. Using DATEV, secure cloud processes and digital document submission, you send us your records from anywhere; documents are signed via eSign. Dedicated contacts, clear procedures and short communication paths keep you in control at all times and free up time for your business. Whether you are based in Berlin or work across Germany makes no difference to how we collaborate.' },
    anfahrtHead: { de:'So finden Sie uns in Berlin', en:'How to Find Us in Berlin' },
    addr: ['NSBB Steuerberatungsgesellschaft mbH','Berlepschstraße 1','14165 Berlin (Zehlendorf)'],
    phoneDisp: '+49 30 8158093-0', phoneTel: '+493081580930',
    anfahrtNote: { de:'Gut erreichbar in der Nähe des S-Bahnhofs Zehlendorf, mit Parkmöglichkeiten vor Ort. Rufen Sie uns an oder vereinbaren Sie ein unverbindliches Erstgespräch.', en:'Conveniently located near Zehlendorf S-Bahn station, with parking on site. Call us or arrange a no-obligation initial consultation.' },
    mapsUrl: 'https://www.google.com/maps/place/NSBB+Steuerberatungsgesellschaft+mbH/@52.4293359,13.2562634,19z',
    faq: { de:[
      { q:'Was kostet ein Steuerberater in Berlin?', a:'Die Vergütung richtet sich nach der Steuerberatervergütungsverordnung (StBVV). Nach einem kurzen Erstgespräch erhalten Sie von uns ein transparentes, auf Ihren Bedarf zugeschnittenes Angebot.' },
      { q:'Kann ich problemlos von meinem bisherigen Steuerberater zu NSBB wechseln?', a:'Ja. Ein Wechsel ist jederzeit möglich; die Übernahme Ihrer Unterlagen und Daten koordinieren wir für Sie.' },
      { q:'Muss ich vor Ort sein oder geht alles digital?', a:'Die Zusammenarbeit ist vollständig digital möglich. Persönliche Termine in unserem Büro in Zehlendorf sind selbstverständlich ebenso möglich.' },
      { q:'Betreuen Sie auch internationale Sachverhalte aus Berlin?', a:'Ja. Grenzüberschreitende Fragestellungen begleiten wir eigenständig und bei Bedarf gemeinsam mit unserem weltweiten TGS-Netzwerk.' },
      { q:'Für wen arbeiten Sie in Berlin?', a:'Für Unternehmen und Unternehmensgruppen, Freiberufler sowie Privatpersonen mit anspruchsvollen steuerlichen Fragestellungen – national wie international.' },
    ], en:[
      { q:'How much does a tax advisor in Berlin cost?', a:'Fees are based on the German Tax Advisor Remuneration Regulation (StBVV). After a short initial conversation, we provide a transparent quote tailored to your needs.' },
      { q:'Can I switch from my current tax advisor to NSBB easily?', a:'Yes. You can switch at any time; we coordinate the handover of your documents and data for you.' },
      { q:'Do I have to come in person, or can everything be done digitally?', a:'Collaboration can be fully digital. In-person meetings at our Zehlendorf office are of course also possible.' },
      { q:'Do you handle international matters from Berlin?', a:'Yes. We manage cross-border questions independently and, where required, together with our worldwide TGS network.' },
      { q:'Who do you work with in Berlin?', a:'Companies and corporate groups, freelancers and private individuals with demanding tax questions – both national and international.' },
    ] },
  },
  koeln: {
    teamStandort: 'Köln',
    eyebrow: { de:'Standort Köln · Rheinauhafen', en:'Cologne office · Rheinauhafen' },
    title:   { de:'Steuerberater in', en:'Tax Advisor in' }, accentDe:'Köln.', accentEn:'Cologne.',
    sub: { de:['Digitale Steuerberatung am Rheinauhafen –','für Unternehmen, Freiberufler, Privatpersonen und international tätige Mandanten.'],
           en:['A digital tax advisory firm on the Rheinauhafen –','for companies, freelancers, private individuals and internationally active clients.'] },
    intro: { de:'Vom Holzmarkt aus betreuen wir Mandanten im Rheinland und darüber hinaus. Unser Anspruch: Vermögen schützen, Chancen früh erkennen und tragfähige Lösungen entwickeln – nicht als Einzelmaßnahme, sondern mit Blick auf Ihre gesamte unternehmerische und private Entwicklung. Über das TGS-Netzwerk sind wir zugleich international vernetzt.',
             en:'From Holzmarkt, we support clients in the Rhineland and beyond. Our aim: to protect wealth, spot opportunities early and develop durable solutions – with a view of your overall business and private development. Through the TGS network, we are internationally connected at the same time.' },
    servicesHead: { de:'Unsere Leistungen als Steuerberater in Köln', en:'Our Services as a Tax Advisor in Cologne' },
    servicesSub: { de:'Drei Schwerpunkte, ein Anspruch: persönliche Beratung, klare Lösungen und langfristige Perspektiven.', en:'Three areas of focus, one standard: personal advice, clear solutions and long-term perspectives.' },
    svcUnternehmen: { de:'Von der laufenden Steuerberatung über die Gestaltungsberatung bis zur betriebswirtschaftlichen Begleitung – wir unterstützen Sie in allen Phasen, von der Gründung über das laufende Geschäft bis zur Nachfolge.', en:'From ongoing tax advice and structuring to business-management support – we assist you through every phase, from formation and day-to-day operations to succession.' },
    svcIntl: { de:'Für Unternehmen und Privatpersonen mit Auslandsbezug beraten wir bei grenzüberschreitenden Strukturen, Inbound- und Outbound-Sachverhalten sowie Verrechnungspreisen – koordiniert und aus einer Hand.', en:'For companies and individuals with international ties, we advise on cross-border structures, inbound and outbound matters and transfer pricing – coordinated and from a single source.' },
    svcPrivat: { de:'Einkommensteuer, Erbschaft und Schenkung, Immobilien und Vermögensnachfolge: Wir beraten persönlich und vorausschauend, damit private steuerliche Entscheidungen zu Ihrer Lebens- und Vermögensplanung passen.', en:'Income tax, inheritance and gifts, real estate and succession planning: we advise personally and with foresight, so that private tax decisions fit your life and wealth planning.' },
    ansprechHead: { de:'Ihre Ansprechpartner in Köln', en:'Your Contacts in Cologne' },
    ansprechSub: { de:'Zuhören steht bei uns am Anfang – erst nach der genauen Klärung Ihres Anliegens bestimmen wir gemeinsam den passenden Leistungsumfang.', en:'Listening comes first – only once we fully understand your situation do we define the right scope of services together with you.' },
    digitalHead: { de:'Digitale Zusammenarbeit', en:'Working Together Digitally' },
    digitalText: { de:'Sie arbeiten mit uns so digital, wie Sie möchten: Belege und Unterlagen tauschen Sie über DATEV und gesicherte Cloud-Wege aus, feste Ansprechpartner sorgen für kurze Wege und schnelle Antworten. Das spart Zeit, schafft Transparenz und macht den Standort zweitrangig – ob Sie im Rheinland sitzen oder bundesweit tätig sind, bleibt die Zusammenarbeit effizient und persönlich.', en:'You work with us as digitally as you like: you share records and documents via DATEV and secure cloud channels, and dedicated contacts ensure short paths and fast answers. This saves time, creates transparency and makes location secondary – whether you are based in the Rhineland or operate nationwide, our collaboration stays efficient and personal.' },
    anfahrtHead: { de:'So finden Sie uns in Köln', en:'How to Find Us in Cologne' },
    addr: ['NSBB Steuerberatungsgesellschaft mbH','Holzmarkt 2/2A','50676 Köln (Rheinauhafen / Altstadt-Süd)'],
    phoneDisp: '+49 221 973064-0', phoneTel: '+492219730640',
    anfahrtNote: { de:'Zentral gelegen und gut mit öffentlichen Verkehrsmitteln erreichbar. Rufen Sie uns an oder vereinbaren Sie ein unverbindliches Erstgespräch.', en:'Centrally located and easy to reach by public transport. Call us or arrange a no-obligation initial consultation.' },
    mapsUrl: 'https://www.google.com/maps/place/NSBB+Steuerberatungsgesellschaft+mbH/@50.9286295,6.9619573,18z',
    faq: { de:[
      { q:'Was kostet ein Steuerberater in Köln?', a:'Unsere Vergütung richtet sich nach der Steuerberatervergütungsverordnung (StBVV). Im Erstgespräch klären wir Ihren Bedarf und erstellen Ihnen ein transparentes Angebot.' },
      { q:'Ist ein Wechsel meines Steuerberaters aufwendig?', a:'Nein. Wir übernehmen die Abstimmung mit Ihrem bisherigen Berater und die Übernahme Ihrer Daten, sodass der Wechsel für Sie reibungslos verläuft.' },
      { q:'Kann die Beratung vollständig digital ablaufen?', a:'Ja. Sie können vollständig digital mit uns arbeiten – persönliche Termine am Rheinauhafen sind jederzeit möglich.' },
      { q:'Beraten Sie auch bei internationalen Steuerfragen?', a:'Ja. Auslandssachverhalte begleiten wir eigenständig und bei Bedarf gemeinsam mit unseren TGS-Partnern weltweit.' },
      { q:'Welche Mandanten betreuen Sie in Köln?', a:'Unternehmen aller Rechtsformen und Größen, Freiberufler sowie Privatpersonen mit anspruchsvollen steuerlichen Fragestellungen.' },
    ], en:[
      { q:'How much does a tax advisor in Cologne cost?', a:'Our fees are based on the German Tax Advisor Remuneration Regulation (StBVV). In an initial meeting we clarify your needs and provide a transparent quote.' },
      { q:'Is switching tax advisors complicated?', a:'No. We handle the coordination with your previous advisor and the transfer of your data, so the switch is smooth for you.' },
      { q:'Can the advice be handled entirely digitally?', a:'Yes. You can work with us fully digitally – in-person meetings at the Rheinauhafen are always possible.' },
      { q:'Do you also advise on international tax matters?', a:'Yes. We handle international matters independently and, where needed, together with our TGS partners worldwide.' },
      { q:'Which clients do you support in Cologne?', a:'Companies of all legal forms and sizes, freelancers and private individuals with demanding tax questions.' },
    ] },
  },
};

function StandortAccordion({ items }) {
  const [open, setOpen] = React.useState(null);
  return e('div', { style:{ maxWidth:'720px' } },
    items.map((it, i) => e('div', { key:i, style:{ borderBottom:'1px solid var(--border)' } },
      e('button', { onClick:()=>setOpen(open===i?null:i), 'aria-expanded': open===i, style:{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', padding:'20px 0', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'16px' } },
        e('span', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem', color:'#1A1917', lineHeight:1.25 } }, it.q),
        e('span', { 'aria-hidden':'true', style:{ color:'var(--accent)', fontSize:'1.5rem', flexShrink:0, fontFamily:"'DM Sans',sans-serif", lineHeight:1 } }, open===i ? '–' : '+')
      ),
      open===i && e('p', { style:{ padding:'0 0 20px', color:'var(--muted)', lineHeight:1.7, maxWidth:'660px' } }, it.a)
    ))
  );
}

function StandortPage({ setPage, lang, t, setKontaktPreset, city }) {
  useScrollAnim();
  const isDE = lang === 'DE';
  const d = STANDORT_DATA[city];
  const L = (o) => isDE ? o.de : o.en;
  const go = (k) => { setPage(k); window.scrollTo(0,0); };
  const people = team.filter(p => p.standort === d.teamStandort);
  const secH2 = { fontSize:'clamp(1.6rem,3vw,2.2rem)', color:'#1A1917', fontFamily:"'Cormorant Garamond',serif", lineHeight:1.15 };
  const services = [
    { key:'leistungen-unternehmen', h:{de:'Für Unternehmen',en:'For companies'}, p:d.svcUnternehmen, more:{de:'Mehr zur Beratung für Unternehmen',en:'More on advice for companies'} },
    { key:'leistungen-international', h:{de:'Internationales Steuerrecht',en:'International tax law'}, p:d.svcIntl, more:{de:'Mehr zum internationalen Steuerrecht',en:'More on international tax law'} },
    { key:'leistungen-privat', h:{de:'Für Privatpersonen',en:'For private individuals'}, p:d.svcPrivat, more:{de:'Mehr zur Beratung für Privatpersonen',en:'More on advice for private individuals'} },
  ];
  return e('div', { className:'page-enter' },
    e(PageHero, { label:L(d.eyebrow), fit:true, title:L(d.title), accent:isDE?d.accentDe:d.accentEn, subtitle:isDE?d.sub.de:d.sub.en }),

    e('section', { style:{ backgroundColor:'white', paddingTop:'40px', paddingBottom:'80px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('p', { className:'fade-up', style:{ maxWidth:'760px', color:'var(--muted)', lineHeight:1.8, marginBottom:'44px' } }, L(d.intro)),
        e('div', { className:'max-w-2xl', style:{ marginBottom:'32px' } },
          e('h2', { className:'font-display', style:{ ...secH2, marginBottom:'10px' } }, L(d.servicesHead)),
          e('p', { style:{ color:'var(--muted)' } }, L(d.servicesSub))
        ),
        e('div', { className:'grid grid-cols-1 md:grid-cols-3', style:{ gap:'24px' } },
          services.map(s => e('div', { key:s.key, className:'fade-up', style:{ background:'#fff', border:'1px solid var(--border)', borderRadius:'1.5rem', padding:'2.25rem', boxShadow:'0 1px 3px rgba(0,0,0,.05)' } },
            e('h3', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.4rem', color:'#1A1917', marginBottom:'12px' } }, L(s.h)),
            e('p', { style:{ color:'var(--muted)', fontSize:'.95rem', lineHeight:1.7, marginBottom:'18px' } }, L(s.p)),
            e('button', { onClick:()=>go(s.key), style:{ background:'none', border:'none', cursor:'pointer', color:'var(--accent)', fontWeight:600, fontSize:'.9rem', fontFamily:"'DM Sans',sans-serif", padding:0 } }, L(s.more)+' →')
          ))
        )
      )
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'72px', paddingBottom:'72px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('div', { className:'max-w-2xl', style:{ marginBottom:'28px' } },
          e('h2', { className:'font-display', style:{ ...secH2, marginBottom:'10px' } }, L(d.ansprechHead)),
          e('p', { style:{ color:'var(--muted)' } }, L(d.ansprechSub))
        ),
        e('div', { className:'grid grid-cols-1 sm:grid-cols-2', style:{ gap:'22px', maxWidth:'760px' } },
          people.map(p => e('div', { key:p.name, style:{ background:'#fff', border:'1px solid var(--border)', borderRadius:'1.25rem', padding:'2rem 1.5rem', textAlign:'center', boxShadow:'0 1px 3px rgba(0,0,0,.05)' } },
            e('div', { style:{ width:'120px', height:'120px', borderRadius:'50%', overflow:'hidden', margin:'0 auto 16px', border:'3px solid var(--accent-subtle)', boxShadow:'0 4px 16px rgba(0,0,0,.08)' } },
              e('img', { src:p.photo, alt:p.name, loading:'lazy', style:{ width:'100%', height:'100%', objectFit:'cover', objectPosition:p.imgPos||'center 10%' } })
            ),
            e('p', { style:{ fontSize:'.7rem', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--accent)', fontFamily:"'DM Sans',sans-serif" } }, isDE?p.title:(p.titleEN||p.title)),
            e('h3', { style:{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.35rem', color:'#1A1917', marginTop:'4px', lineHeight:1.15 } }, p.name),
            e('p', { style:{ fontSize:'.85rem', color:'var(--muted)', marginTop:'4px', fontFamily:"'DM Sans',sans-serif" } }, isDE?p.profession:(p.professionEN||p.profession))
          ))
        ),
        e('div', { style:{ marginTop:'26px', textAlign:'center', maxWidth:'760px' } },
          e('button', { onClick:()=>go('ueber-uns'), style:{ display:'inline-flex', alignItems:'center', gap:'.45rem', background:'var(--accent-subtle)', color:'var(--accent)', border:'none', borderRadius:'8px', padding:'9px 18px', fontSize:'.9rem', fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" } }, (isDE?'Team kennenlernen':'Meet the team')+' →')
        )
      )
    ),

    e('section', { style:{ backgroundColor:'white', paddingTop:'72px', paddingBottom:'72px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'font-display', style:{ ...secH2, marginBottom:'16px' } }, L(d.digitalHead)),
        e('p', { style:{ maxWidth:'760px', color:'var(--muted)', lineHeight:1.8 } }, L(d.digitalText))
      )
    ),

    e('section', { style:{ backgroundColor:'var(--offwhite)', paddingTop:'72px', paddingBottom:'72px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'font-display', style:{ ...secH2, marginBottom:'20px' } }, L(d.anfahrtHead)),
        e('div', { style:{ background:'#fff', border:'1px solid var(--border)', borderRadius:'1.25rem', padding:'2rem', maxWidth:'720px', boxShadow:'0 1px 3px rgba(0,0,0,.05)' } },
          e('p', { style:{ color:'#1A1917', lineHeight:1.9, fontFamily:"'DM Sans',sans-serif" } },
            e('strong', null, d.addr[0]), e('br', null),
            d.addr[1], e('br', null), d.addr[2], e('br', null),
            (isDE?'Telefon: ':'Phone: '), e('a', { href:'tel:'+d.phoneTel, style:{ color:'var(--accent)', fontWeight:600, textDecoration:'none' } }, d.phoneDisp)
          ),
          e('p', { style:{ color:'var(--muted)', marginTop:'12px', lineHeight:1.7 } }, L(d.anfahrtNote)),
          e('a', { href:d.mapsUrl, target:'_blank', rel:'noopener noreferrer', style:{ display:'inline-flex', alignItems:'center', gap:'6px', marginTop:'14px', color:'var(--accent)', fontWeight:600, textDecoration:'none', fontFamily:"'DM Sans',sans-serif" } }, (isDE?'Auf Google Maps ansehen':'View on Google Maps')+' →')
        )
      )
    ),

    e('section', { style:{ backgroundColor:'white', paddingTop:'72px', paddingBottom:'80px' } },
      e('div', { className:'max-w-site mx-auto px-5 md:px-8' },
        e('h2', { className:'font-display', style:{ ...secH2, marginBottom:'20px' } }, isDE?'Häufige Fragen':'Frequently Asked Questions'),
        e(StandortAccordion, { items: isDE ? d.faq.de : d.faq.en })
      )
    ),

    e(ContactCTA, { setPage, t, setKontaktPreset })
  );
}
function SteuerberaterBerlinPage(props){ return e(StandortPage, Object.assign({}, props, { city:'berlin' })); }
function SteuerberaterKoelnPage(props){ return e(StandortPage, Object.assign({}, props, { city:'koeln' })); }


function App() {
  const [page, setPageState] = useState(seiteAusAdresse);

  const setPage = (p) => {
    setPageState(p);
    try {
      window.history.pushState({ seite: p }, '', pfadFuer(p));
      // Unterseiten-Komponenten mit eigener Adresse (AktuellesPage kennt zusaetzlich
      // /beitrag/<slug>) horchen auf popstate. pushState loest das NICHT aus, und
      // "page" bleibt hier oft gleich (Beitrag UND Uebersicht sind beide
      // "aktuelles") – ohne dieses Signal bliebe beim Klick auf „Aktuelles" der
      // geoeffnete Beitrag stehen. Darum popstate selbst ausloesen.
      window.dispatchEvent(new Event('popstate'));
    } catch (e) {
      // Sollte pushState scheitern (sehr alte Browser, file://), faellt die
      // Navigation auf das alte Verhalten zurueck statt ganz auszufallen.
      window.location.hash = p === 'home' ? '' : p;
    }
  };

  // Browser-Zurueck und -Vorwaerts.
  useEffect(() => {
    const onNav = () => setPageState(seiteAusAdresse());
    window.addEventListener('popstate', onNav);
    window.addEventListener('hashchange', onNav);   // fuer alte Fragment-Links
    return () => {
      window.removeEventListener('popstate', onNav);
      window.removeEventListener('hashchange', onNav);
    };
  }, []);

  // Wurde die Seite ueber eine alte Fragment-Adresse aufgerufen, einmalig auf
  // die echte Adresse umschreiben – ohne neuen Eintrag im Verlauf.
  useEffect(() => {
    const frag = window.location.hash.replace('#', '');
    if (frag && validPages.includes(frag)) {
      try { window.history.replaceState({ seite: frag }, '', pfadFuer(frag)); } catch (e) {}
    }
  }, []);
  const [kontaktPreset, setKontaktPreset] = useState(null);
  // Sprachwahl merken. Vorher stand nach jedem Neuladen wieder Deutsch da –
  // unangenehm gerade fuer die internationalen Mandanten, fuer die es eigene
  // Seiten zu Wegzug, DBA und Grenzgaengern gibt.
  // Reihenfolge: ?lang=en in der Adresse (der hreflang-Verweis zeigt darauf)
  // schlaegt gespeicherte Wahl, diese schlaegt die Browsersprache.
  const [lang, setLangState] = useState(() => {
    try {
      const ausAdresse = new URLSearchParams(window.location.search).get('lang');
      if (ausAdresse) return ausAdresse.toUpperCase() === 'EN' ? 'EN' : 'DE';
      const gespeichert = localStorage.getItem('nsbb_lang');
      if (gespeichert === 'EN' || gespeichert === 'DE') return gespeichert;
      if ((navigator.language || '').toLowerCase().startsWith('en')) return 'EN';
    } catch (e) { /* privater Modus o.ae.: dann eben Deutsch */ }
    return 'DE';
  });
  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem('nsbb_lang', l); } catch (e) {}
  };
  const t = T[lang];

  useEffect(() => { window.scrollTo(0, 0); }, [page]);
  useEffect(() => { document.documentElement.lang = lang.toLowerCase(); }, [lang]);
  // Seitentitel: erscheinen im Browser-Tab, im Verlauf und in Lesezeichen –
  // und sind der erste Text, den Suchmaschinen zu einer Seite lesen.
  // Vorher trugen 28 von 41 Seiten denselben Titel.
  const pageTitles = {
    DE: {
      'home': 'NSBB – Steuerberatung Berlin & Köln | Modern. Digital. Persönlich.',
      'leistungen': 'Leistungen | NSBB Steuerberatung',
      'leistungen-unternehmen': 'Steuerberatung für Unternehmen | NSBB',
      'leistungen-unternehmen-leistungen': 'Drei Bereiche der Unternehmensberatung | NSBB',
      'leistungen-unternehmen-laufend': 'Laufende Steuerberatung & Jahresabschluss | NSBB',
      'leistungen-unternehmen-gestaltung': 'Steuerliche Gestaltungsberatung | NSBB',
      'leistungen-unternehmen-bwl': 'Betriebswirtschaftliche Beratung | NSBB',
      'leistungen-unternehmen-branchen': 'Branchenlösungen für Unternehmen | NSBB',
      'branche-ecommerce': 'Steuerberatung für E-Commerce & Onlinehandel | NSBB',
      'branche-bau': 'Steuerberatung für Bau & Handwerk | NSBB',
      'branche-immobilien': 'Steuerberatung für Immobilienunternehmen | NSBB',
      'branche-international': 'Steuerberatung für international tätige Unternehmen | NSBB',
      'branche-startup': 'Steuerberatung für Start-ups & Gründer | NSBB',
      'branche-aerzte': 'Steuerberatung für Ärzte & Heilberufe | NSBB',
      'leistungen-international': 'Internationales Steuerrecht | NSBB',
      'intl-wegzug': 'Wegzugsbesteuerung: Wegzug ins Ausland | NSBB',
      'intl-wohnsitz': 'Wohnsitz & Steuerpflicht im Ausland | NSBB',
      'intl-dba': 'Doppelbesteuerungsabkommen (DBA) | NSBB',
      'intl-einkuenfte': 'Ausländische Einkünfte richtig versteuern | NSBB',
      'intl-immobilien': 'Immobilien im Ausland: Steuern | NSBB',
      'intl-erbschaft': 'Erbschaft mit Auslandsbezug | NSBB',
      'intl-schenkung': 'Schenkung mit Auslandsbezug | NSBB',
      'intl-rueckkehr': 'Rückkehr nach Deutschland: Steuern | NSBB',
      'intl-grenzgaenger': 'Grenzgänger: Wo zahle ich Steuern? | NSBB',
      'intl-vermoegen': 'Internationale Vermögensstrukturierung | NSBB',
      'leistungen-privat': 'Steuerberatung für Privatpersonen | NSBB',
      'digital': 'Digitale Kanzlei | NSBB Steuerberatung',
      'tgs': 'TGS International Netzwerk | NSBB',
      'aktuelles': 'Aktuelles & Mandanteninformationen | NSBB Steuerberatung',
      'ueber-uns': 'Über uns & Team | NSBB Steuerberatung',
      'steuerberater-berlin': 'Steuerberater Berlin – digital & persönlich | NSBB',
      'steuerberater-koeln': 'Steuerberater Köln – digital & persönlich | NSBB',
      'karriere': 'Karriere bei NSBB | Steuerberater gesucht',
      'karriere-steuerberater': 'Stellenangebot Steuerberater (m/w/d) | NSBB',
      'karriere-steuerfachwirt': 'Stellenangebot Steuerfachwirt (m/w/d) | NSBB',
      'karriere-steuerfachangestellte': 'Stellenangebot Steuerfachangestellte (m/w/d) | NSBB',
      'karriere-bilanzbuchhalter': 'Stellenangebot Bilanzbuchhalter (m/w/d) | NSBB',
      'karriere-initiativbewerbung': 'Initiativbewerbung | NSBB Steuerberatung',
      'kanzleinachfolge': 'Kanzleinachfolge | NSBB Steuerberatung',
      'kontakt': 'Kontakt aufnehmen | NSBB Steuerberatung Berlin & Köln',
      'faq': 'Häufige Fragen | NSBB Steuerberatung',
      'impressum': 'Impressum | NSBB Steuerberatung',
      'datenschutz': 'Datenschutz | NSBB Steuerberatung',
    },
    EN: {
      'home': 'NSBB – Tax Advisors Berlin & Cologne | Modern. Digital. Personal.',
      'leistungen': 'Services | NSBB Tax Advisors',
      'leistungen-unternehmen': 'Tax Advisory for Businesses | NSBB',
      'leistungen-unternehmen-leistungen': 'Three Areas of Business Advisory | NSBB',
      'leistungen-unternehmen-laufend': 'Ongoing Tax Advisory & Annual Accounts | NSBB',
      'leistungen-unternehmen-gestaltung': 'Tax Structuring Advice | NSBB',
      'leistungen-unternehmen-bwl': 'Business Management Advisory | NSBB',
      'leistungen-unternehmen-branchen': 'Industry Solutions for Businesses | NSBB',
      'branche-ecommerce': 'Tax Advisory for E-Commerce | NSBB',
      'branche-bau': 'Tax Advisory for Construction & Trades | NSBB',
      'branche-immobilien': 'Tax Advisory for Real Estate | NSBB',
      'branche-international': 'Tax Advisory for International Businesses | NSBB',
      'branche-startup': 'Tax Advisory for Start-ups & Founders | NSBB',
      'branche-aerzte': 'Tax Advisory for Doctors & Health Professions | NSBB',
      'leistungen-international': 'International Tax Law | NSBB',
      'intl-wegzug': 'Exit Taxation: Moving Abroad | NSBB',
      'intl-wohnsitz': 'Residence & Tax Liability Abroad | NSBB',
      'intl-dba': 'Double Taxation Agreements (DTA) | NSBB',
      'intl-einkuenfte': 'Taxing Foreign Income Correctly | NSBB',
      'intl-immobilien': 'Property Abroad: Taxation | NSBB',
      'intl-erbschaft': 'Inheritance with Foreign Ties | NSBB',
      'intl-schenkung': 'Gifts with Foreign Ties | NSBB',
      'intl-rueckkehr': 'Returning to Germany: Taxation | NSBB',
      'intl-grenzgaenger': 'Cross-Border Workers: Where Do I Pay Tax? | NSBB',
      'intl-vermoegen': 'International Wealth Structuring | NSBB',
      'leistungen-privat': 'Tax Advisory for Private Individuals | NSBB',
      'digital': 'Digital Firm | NSBB Tax Advisors',
      'tgs': 'TGS International Network | NSBB',
      'aktuelles': 'Insights & News | NSBB Tax Advisors',
      'ueber-uns': 'About Us & Team | NSBB Tax Advisors',
      'steuerberater-berlin': 'Tax Advisor in Berlin – digital & personal | NSBB',
      'steuerberater-koeln': 'Tax Advisor in Cologne – digital & personal | NSBB',
      'karriere': 'Careers at NSBB | Tax Advisors Wanted',
      'karriere-steuerberater': 'Vacancy: Tax Advisor (m/f/d) | NSBB',
      'karriere-steuerfachwirt': 'Vacancy: Tax Specialist (m/f/d) | NSBB',
      'karriere-steuerfachangestellte': 'Vacancy: Tax Clerk (m/f/d) | NSBB',
      'karriere-bilanzbuchhalter': 'Vacancy: Financial Accountant (m/f/d) | NSBB',
      'karriere-initiativbewerbung': 'Speculative Application | NSBB Tax Advisors',
      'kanzleinachfolge': 'Practice Succession | NSBB Tax Advisors',
      'kontakt': 'Contact Us | NSBB Tax Advisors Berlin & Cologne',
      'faq': 'Frequently Asked Questions | NSBB Tax Advisors',
      'impressum': 'Legal Notice | NSBB Tax Advisors',
      'datenschutz': 'Privacy Policy | NSBB Tax Advisors',
    }
  };
  useEffect(() => {
    const tabelle = pageTitles[lang] || pageTitles.DE;
    document.title = tabelle[page]
      || (lang === 'EN' ? 'NSBB – Tax Advisors Berlin & Cologne' : 'NSBB – Steuerberatung Berlin & Köln');

    // canonical je Seite mitfuehren. Zeigte er weiter auf die Startseite,
    // wuerde Google alle Unterseiten als Dubletten davon werten – der
    // Gewinn der echten Adressen waere dahin.
    //
    // Bedingung: NUR im Live-Betrieb. Die Pruefung geht ueber den Basis-Pfad,
    // nicht ueber den Hostnamen – die Testfassung liegt unter nsbb.de/2026/
    // und traegt denselben Hostnamen. Eine Hostnamen-Pruefung wuerde dort
    // canonicals auf die echten Adressen setzen und Google anweisen, die
    // Testfassung der Live-Seite zuzurechnen.
    if (BASIS === '/' && window.location.hostname === 'nsbb.de') {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = 'https://nsbb.de' + (page === 'home' ? '/' : '/' + page);
    }
  }, [page, lang]);

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
    aktuelles: e(AktuellesPage, props),
    'ueber-uns': e(UeberUnsPage, props),
    'steuerberater-berlin': e(SteuerberaterBerlinPage, props),
    'steuerberater-koeln': e(SteuerberaterKoelnPage, props),
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


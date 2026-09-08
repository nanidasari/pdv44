import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import yaml from "js-yaml";

import { ArrowUpRight, ArrowRight, Menu, X, Sparkles, Box, Share2, Palette, Quote, MoveUpRight } from "lucide-react";
import "./styles.css";

const portfolioFiles = import.meta.glob("../content/portfolio/*.md", { eager: true, query: "?raw", import: "default" });
const testimonialFiles = import.meta.glob("../content/testimonials/*.md", { eager: true, query: "?raw", import: "default" });
const serviceFiles = import.meta.glob("../content/services/*.md", { eager: true, query: "?raw", import: "default" });
const pageFiles = import.meta.glob("../content/pages/*.yml", { eager: true, query: "?raw", import: "default" });
const settingsFiles = import.meta.glob("../content/settings.yml", { eager: true, query: "?raw", import: "default" });

function parseFrontmatter(raw) {
  const match = raw.match(/^---\\s*([\\s\\S]*?)\\s*---\\s*([\\s\\S]*)$/);
  if (!match) return { data: {}, body: raw.trim() };
  return { data: yaml.load(match[1]) || {}, body: match[2].trim() };
}

function loadCollection(files) {
  return Object.values(files).map(parseFrontmatter).map(x => x.data);
}

const portfolio = loadCollection(portfolioFiles).map((p, i) => ({
  title: p.title || `Project ${i + 1}`,
  category: p.category || "Branding",
  tag: p.tag || "Project",
  image: p.image || `/images/project-${(i % 4) + 1}.svg`
}));

const testimonials = loadCollection(testimonialFiles).map(t => ({
  quote: t.quote || "",
  name: t.name || "Client",
  role: t.role || ""
}));

const services = loadCollection(serviceFiles).filter(s => s.enabled !== false).map((s, i) => ({
  number: s.number || String(i + 1).padStart(2, "0"),
  title: s.title || "Service",
  description: s.description || "",
  icon: s.icon || "branding"
}));

const home = yaml.load(pageFiles["../content/pages/home.yml"] || "") || {};
const about = yaml.load(pageFiles["../content/pages/about.yml"] || "") || {};
const settings = yaml.load(settingsFiles["../content/settings.yml"] || "") || {};

const iconMap = { branding: Palette, packaging: Box, social: Share2, "art-direction": Sparkles, campaign: ArrowUpRight, presentation: MoveUpRight };

function useMouseGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = e => {
      el.style.setProperty("--mx", `${e.clientX}px`);
      el.style.setProperty("--my", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return ref;
}


async function loadText(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Could not load ${url}`);
  return res.text();
}

function parseSimpleYaml(text) {
  const out = {};
  const lines = text.replace(/\r/g, "").split("\n");
  let currentList = null;
  let currentObj = null;
  for (const raw of lines) {
    const line = raw.replace(/\t/g, "    ");
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const mList = line.match(/^([A-Za-z0-9_-]+):\s*$/);
    if (mList) {
      out[mList[1]] = {};
      currentList = null; currentObj = null;
      continue;
    }
    const mItem = line.match(/^\s*-\s+([A-Za-z0-9_-]+):\s*(.*)$/);
    if (mItem) {
      const key = mItem[1], value = cleanYamlValue(mItem[2]);
      if (!Array.isArray(out.items)) out.items = [];
      currentObj = {[key]: value}; out.items.push(currentObj); currentList = out.items;
      continue;
    }
    const m = line.match(/^\s*([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) {
      const key = m[1], value = cleanYamlValue(m[2]);
      if (currentObj && /^\s{2,}/.test(line)) currentObj[key] = value;
      else out[key] = value;
    }
  }
  return out;
}
function cleanYamlValue(v) {
  v = v.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1,-1);
  if (v === "true") return true;
  if (v === "false") return false;
  if (v === "null") return null;
  return v;
}
function parseFrontMatter(text) {
  const m = text.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*/);
  if (!m) return {};
  return parseSimpleYaml(m[1]);
}
async function loadCMSContent() {
  const defaults = {
    settings: {},
    home: {},
    about: {},
    services: [],
    testimonials: [],
    portfolio: []
  };
  const read = async (url, kind="yaml") => {
    try {
      const text = await loadText(url);
      return kind === "md" ? parseFrontMatter(text) : parseSimpleYaml(text);
    } catch { return null; }
  };
  const settings = await read("./content/settings.yml");
  const home = await read("./content/pages/home.yml");
  const about = await read("./content/pages/about.yml");
  const listFiles = async (folder) => {
    try {
      const r = await fetch(`./content/${folder}/manifest.json`, {cache:"no-store"});
      if (!r.ok) return [];
      return await r.json();
    } catch { return []; }
  };
  const readMany = async (folder, kind="md") => {
    const files = await listFiles(folder);
    return (await Promise.all(files.map(f => read(`./content/${folder}/${f}`, kind)))).filter(Boolean);
  };
  return {
    settings: settings || {},
    home: home || {},
    about: about || {},
    services: await readMany("services"),
    testimonials: await readMany("testimonials"),
    portfolio: await readMany("portfolio", "md")
  };
}

function useHashRoute() {
  const getRoute = () => {
    const raw = window.location.hash.replace(/^#/, "") || "/";
    return raw.split("?")[0] || "/";
  };
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [route]);

  return route;
}

function Link({ to, children, className = "", onClick, ...props }) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </a>
  );
}

function NavLink({ to, end, children, className = "", onClick, ...props }) {
  const current = (window.location.hash.replace(/^#/, "") || "/").split("?")[0];
  const active = current === to;
  return (
    <a
      href={`#${to}`}
      className={`${className} ${active ? "active" : ""}`.trim()}
      onClick={onClick}
      {...props}
    >
      {children}
    </a>
  );
}

function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);
  const raf = useRef(0);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const isFinePointer = window.matchMedia?.("(pointer:fine)").matches;
    if (!isFinePointer) return;

    const move = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      const interactive = e.target.closest("a, button, .project, .portfolio-item, .service-card, .quote-card");
      const isImage = e.target.closest(".project, .portfolio-item");
      const isCard = e.target.closest(".service-card, .quote-card");
      document.body.classList.toggle("cursor-hover", !!interactive);
      document.body.classList.toggle("cursor-image", !!isImage);
      document.body.classList.toggle("cursor-card", !!isCard);
      if (label.current) label.current.textContent = isImage ? "VIEW" : isCard ? "EXPLORE" : interactive ? "OPEN" : "";
    };

    const leave = () => document.body.classList.remove("cursor-hover", "cursor-image", "cursor-card");

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;
      const { x, y } = current.current;
      if (dot.current) dot.current.style.transform = `translate3d(${target.current.x}px,${target.current.y}px,0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (label.current) label.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return <>
    <div ref={dot} className="cursor-dot" aria-hidden="true" />
    <div ref={ring} className="cursor-ring" aria-hidden="true" />
    <div ref={label} className="cursor-label" aria-hidden="true" />
  </>;
}

function useInteractiveTilt(selector) {
  useEffect(() => {
    const cards = document.querySelectorAll(selector);
    const cleanups = [];
    cards.forEach((card) => {
      const move = (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
        card.style.setProperty("--ry", `${(x * 5).toFixed(2)}deg`);
        card.style.setProperty("--gx", `${(x * 100 + 50).toFixed(1)}%`);
        card.style.setProperty("--gy", `${(y * 100 + 50).toFixed(1)}%`);
      };
      const leave = () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--gx", "50%");
        card.style.setProperty("--gy", "50%");
      };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, [selector]);
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <Link to="/" className="logo" onClick={() => setOpen(false)} aria-label="Pixcel Studio home">
        <img src="./pixcel-logo.png" alt="Pixcel Studio logo" className="nav-logo-img" />
        <span className="logo-wordmark">PIXCEL<span>STUDIO</span></span>
      </Link>
      <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
      <nav className={open ? "nav-links open" : "nav-links"}>
        <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
        <NavLink to="/work" onClick={() => setOpen(false)}>Work</NavLink>
        <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>
        <a className="nav-cta" href={`mailto:${settings.email || "hello@pixcelstudio.com"}`} onClick={() => setOpen(false)}>Start a project <ArrowUpRight size={16}/></a>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="footer-brand">{settings.studio_name || "PIXCEL STUDIO"}</div>
        <p>{settings.footer_line || "Brand worlds, packaging and social systems for ambitious ideas."}</p>
      </div>
      <div className="footer-links">
        <a href={settings.instagram || "https://www.instagram.com/"} target="_blank" rel="noreferrer">Instagram</a>
        <a href={settings.behance || "https://www.behance.net/"} target="_blank" rel="noreferrer">Behance</a>
        <a href={settings.linkedin || "https://www.linkedin.com/"} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href={`mailto:${settings.email || "hello@pixcelstudio.com"}`}>Email</a>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} {settings.studio_name || "Pixcel Studio"}</span><span>Made with intention.</span></div>
    </footer>
  );
}

function GlassCard({ children, className="" }) {
  return <div className={`glass ${className}`}>{children}</div>;
}

function Home({ cms } = {}) {
  const glow = useMouseGlow();
  useInteractiveTilt(".service-card, .quote-card");
  return (
    <main ref={glow}>
      <section className="hero">
        <div className="aurora a1"/><div className="aurora a2"/><div className="aurora a3"/>
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14}/> {home.hero_eyebrow || "Independent creative studio · India"}</div>
          <h1>{(home.hero_title || "Design that moves people.").split(" ").slice(0,-2).join(" ")}<br/><em>{(home.hero_title || "Design that moves people.").split(" ").slice(-2).join(" ")}</em></h1>
          <p className="hero-sub">{home.hero_description || "We build bold identities, tactile packaging and scroll-stopping social worlds for brands ready to be remembered."}</p>
          <div className="hero-actions">
            <Link className="btn primary" to="/work">Explore our work <ArrowRight size={17}/></Link>
            <a className="btn ghost" href={`mailto:${settings.email || "hello@pixcelstudio.com"}`}>Tell us your idea</a>
          </div>
        </div>
        <div className="hero-orbit">
          <div className="orbit orbit-a"/><div className="orbit orbit-b"/>
          <div className="orb-core"><span>PX</span><small>CREATIVE<br/>SYSTEMS</small></div>
        </div>
        <div className="scroll-cue">SCROLL <span>↓</span></div>
      </section>

      <section className="marquee"><div>BRANDING · PACKAGING · SOCIAL · ART DIRECTION · STRATEGY · BRANDING · PACKAGING · SOCIAL · </div></section>

      <section className="section services">
        <div className="section-head"><div><span className="kicker">01 / WHAT WE DO</span><h2>Small studio.<br/><i>Big visual energy.</i></h2></div><p>We combine strategy, design and motion-minded thinking to make brands feel unmistakably themselves.</p></div>
        <div className="service-grid service-grid-wide">
          {services.map((s) => {
            const Icon = iconMap[s.icon] || Sparkles;
            return <GlassCard className="service-card" key={`${s.number}-${s.title}`}>
              <div className="icon-wrap"><Icon/></div><span>{s.number}</span><h3>{s.title}</h3><p>{s.description}</p>
              <a href={`mailto:${settings.email || "hello@pixcelstudio.com"}`}>Explore service <ArrowUpRight size={16}/></a>
            </GlassCard>;
          })}
        </div>
      </section>

      <section className="section work-preview">
        <div className="section-head"><div><span className="kicker">02 / SELECTED WORK</span><h2>Made to be<br/><i>noticed.</i></h2></div><Link className="text-link" to="/work">View all work <ArrowRight size={17}/></Link></div>
        <div className="work-grid">
          {portfolio.slice(0,3).map((p,i)=><Link to="/work" className={`project p${i}`} key={p.title}><img src={p.image} alt={p.title}/><div className="project-meta"><div><span>{p.category}</span><h3>{p.title}</h3></div><MoveUpRight/></div></Link>)}
        </div>
      </section>

      <section className="statement">
        <div className="statement-inner"><span className="kicker">A POINT OF VIEW</span><h2>{(home.statement || "Good design gets attention. Great design gets remembered.").split(". ")[0]}.<br/><em>{(home.statement || "Good design gets attention. Great design gets remembered.").split(". ").slice(1).join(". ")}</em></h2></div>
      </section>

      <section className="section testimonials">
        <div className="section-head"><div><span className="kicker">03 / KIND WORDS</span><h2>People we’ve<br/><i>worked with.</i></h2></div></div>
        <div className="testimonial-grid">{testimonials.map(t=><GlassCard className="quote-card" key={t.name}><Quote size={25}/><p>“{t.quote}”</p><strong>{t.name}</strong><small>{t.role}</small></GlassCard>)}</div>
      </section>

      <section className="cta"><div className="cta-glow"/><span className="kicker">HAVE A PROJECT?</span><h2>{(home.cta_title || "Let's make something impossible to ignore.").split(" ").slice(0,2).join(" ")}<br/><em>{(home.cta_title || "Let's make something impossible to ignore.").split(" ").slice(2).join(" ")}</em></h2><a className="btn primary" href={`mailto:${settings.email || "hello@pixcelstudio.com"}`}>{settings.email || "hello@pixcelstudio.com"} <ArrowUpRight size={17}/></a></section>
    </main>
  );
}

function Work({ cms } = {}) {
  useInteractiveTilt(".portfolio-item");
  const [filter, setFilter] = useState("All");
  const filters = ["All","Branding","Packaging","Social Media"];
  const list = filter === "All" ? portfolio : portfolio.filter(p => p.category === filter);
  return <main className="inner-page"><section className="page-hero"><span className="kicker">SELECTED WORK</span><h1>Ideas with<br/><em>afterglow.</em></h1><p>A living portfolio — update images, titles and categories from Decap CMS without touching the React code.</p></section>
    <section className="section portfolio-section"><div className="filters">{filters.map(f=><button className={filter===f?"active":""} onClick={()=>setFilter(f)} key={f}>{f}</button>)}</div><div className="portfolio-grid">{list.map(p=><article className="portfolio-item" key={p.title}><img src={p.image} alt={p.title}/><div><span>{p.category}</span><h3>{p.title}</h3><small>{p.tag}</small></div></article>)}</div></section></main>;
}

function About({ cms } = {}) {
  return <main className="inner-page"><section className="page-hero"><span className="kicker">{about.eyebrow || "ABOUT PIXCEL"}</span><h1>{about.title || "Built for brands with something to say."}</h1><p>{about.intro || "Pixcel Studio is an independent graphic design practice focused on creating clear, expressive visual identities with a little more character."}</p></section>
    <section className="section about-layout"><div className="about-art"><div className="about-photo">{about.founder_photo ? <img src={about.founder_photo} alt={about.founder_name || "Pixcel Studio founder"} /> : <span>PX</span>}</div></div><div className="about-copy"><span className="kicker">THE STUDIO</span><h2>{about.studio_heading || "Strategy in one hand. Play in the other."}</h2><p>{about.paragraph_1 || "We believe the strongest visual identities sit at the intersection of clarity and surprise."}</p><p>{about.paragraph_2 || "Our work spans identity, packaging and social content for founders and teams."}</p><a className="text-link" href={`mailto:${settings.email || "hello@pixcelstudio.com"}`}>Start a conversation <ArrowRight size={17}/></a></div></section>
    <section className="founder"><div><span className="kicker">THE FOUNDER</span><h2>{about.founder_name || "Israyelu Kodem."}</h2><p>{about.founder_bio || "Creative direction, brand systems and a belief that design should feel as good as it looks."}</p></div><div className="founder-card glass"><div className="portrait">{about.founder_photo ? <img src={about.founder_photo} alt={about.founder_name || "Founder"} /> : "IK"}</div><div><strong>{about.founder_name || "Israyelu Kodem"}</strong><small>{about.founder_role || "Founder & Creative Director"}</small></div></div></section>
  </main>;
}

function CMSApp() {
  const [cms, setCms] = useState(null);
  useEffect(() => {
    loadCMSContent().then(setCms);
  }, []);
  if (!cms) return <App />;
  return <App cms={cms} />;
}

function App({ cms = null }) {
  const route = useHashRoute();
  let page = <Home cms={cms}/>;

  if (route === "/work") page = <Work cms={cms}/>;
  else if (route === "/about") page = <About cms={cms}/>;

  return <><CustomCursor/><Header/>{page}<Footer/></>;
}

createRoot(document.getElementById("root")).render(<CMSApp/>);
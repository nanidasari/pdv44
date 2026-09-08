import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import { ArrowUpRight, ArrowRight, Menu, X, Sparkles, Box, Share2, Palette, Quote, MoveUpRight } from "lucide-react";
import "./styles.css";

const portfolio = [
  { title: "NOVA Coffee", category: "Branding", tag: "Identity", image: "/images/project-1.svg" },
  { title: "AURA Skin", category: "Packaging", tag: "Packaging", image: "/images/project-2.svg" },
  { title: "Melt Social", category: "Social Media", tag: "Campaign", image: "/images/project-3.svg" },
  { title: "Mono House", category: "Branding", tag: "Identity", image: "/images/project-4.svg" }
];

const testimonials = [
  { quote: "Pixcel understood the personality we wanted before we could even articulate it. The identity feels premium, warm and unmistakably ours.", name: "Ananya Rao", role: "Founder, AURA Skin" },
  { quote: "The new packaging gave our launch a completely different level of confidence. Customers notice it, photograph it and remember it.", name: "Rohan Mehta", role: "Marketing Lead, NOVA Coffee" },
  { quote: "Our social presence finally feels like one brand instead of a collection of posts. Pixcel built a system our team can actually use.", name: "Maya Joseph", role: "Co-founder, Melt" },
  { quote: "Fast, thoughtful and obsessive about the details. The final work looked better than the moodboard we started with.", name: "Karthik Sen", role: "Founder, Mono House" }
];

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
        <a className="nav-cta" href="mailto:hello@pixcelstudio.com" onClick={() => setOpen(false)}>Start a project <ArrowUpRight size={16}/></a>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="footer-brand">PIXCEL<span>STUDIO</span></div>
        <p>Brand worlds, packaging and social systems<br/>for ambitious ideas.</p>
      </div>
      <div className="footer-links">
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://www.behance.net/" target="_blank" rel="noreferrer">Behance</a>
        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="mailto:hello@pixcelstudio.com">Email</a>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Pixcel Studio</span><span>Made with intention.</span></div>
    </footer>
  );
}

function GlassCard({ children, className="" }) {
  return <div className={`glass ${className}`}>{children}</div>;
}

function Home() {
  const glow = useMouseGlow();
  return (
    <main ref={glow}>
      <section className="hero">
        <div className="aurora a1"/><div className="aurora a2"/><div className="aurora a3"/>
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14}/> Independent creative studio · India</div>
          <h1>Design that<br/><em>moves</em> people.</h1>
          <p className="hero-sub">We build bold identities, tactile packaging and scroll-stopping social worlds for brands ready to be remembered.</p>
          <div className="hero-actions">
            <Link className="btn primary" to="/work">Explore our work <ArrowRight size={17}/></Link>
            <a className="btn ghost" href="mailto:hello@pixcelstudio.com">Tell us your idea</a>
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
          {[
            [Palette,"01","Branding","Identity systems, logos, art direction, typography and guidelines that give your brand a distinct voice."],
            [Box,"02","Packaging","Packaging concepts, labels and shelf-ready artwork designed to make products impossible to ignore."],
            [Share2,"03","Social Media Creatives","Campaign systems, posts, stories and launch kits built for consistent, high-impact content."],
            [Sparkles,"04","Art Direction","A visual point of view for campaigns, shoots and brand worlds — from mood to final frame."],
            [ArrowUpRight,"05","Campaign Design","Big ideas translated into cohesive launch campaigns across digital, print and social."],
            [MoveUpRight,"06","Presentation & Pitch Decks","Beautiful, persuasive decks that make your story easier to understand and harder to forget."]
          ].map(([Icon,num,title,desc]) =>
            <GlassCard className="service-card" key={title}>
              <div className="icon-wrap"><Icon/></div><span>{num}</span><h3>{title}</h3><p>{desc}</p>
              <a href="mailto:hello@pixcelstudio.com">Explore service <ArrowUpRight size={16}/></a>
            </GlassCard>
          )}
        </div>
      </section>

      <section className="section work-preview">
        <div className="section-head"><div><span className="kicker">02 / SELECTED WORK</span><h2>Made to be<br/><i>noticed.</i></h2></div><Link className="text-link" to="/work">View all work <ArrowRight size={17}/></Link></div>
        <div className="work-grid">
          {portfolio.slice(0,3).map((p,i)=><Link to="/work" className={`project p${i}`} key={p.title}><img src={p.image} alt={p.title}/><div className="project-meta"><div><span>{p.category}</span><h3>{p.title}</h3></div><MoveUpRight/></div></Link>)}
        </div>
      </section>

      <section className="statement">
        <div className="statement-inner"><span className="kicker">A POINT OF VIEW</span><h2>Good design gets attention.<br/><em>Great design gets remembered.</em></h2></div>
      </section>

      <section className="section testimonials">
        <div className="section-head"><div><span className="kicker">03 / KIND WORDS</span><h2>People we’ve<br/><i>worked with.</i></h2></div></div>
        <div className="testimonial-grid">{testimonials.map(t=><GlassCard className="quote-card" key={t.name}><Quote size={25}/><p>“{t.quote}”</p><strong>{t.name}</strong><small>{t.role}</small></GlassCard>)}</div>
      </section>

      <section className="cta"><div className="cta-glow"/><span className="kicker">HAVE A PROJECT?</span><h2>Let's make<br/><em>something impossible to ignore.</em></h2><a className="btn primary" href="mailto:hello@pixcelstudio.com">hello@pixcelstudio.com <ArrowUpRight size={17}/></a></section>
    </main>
  );
}

function Work() {
  const [filter, setFilter] = useState("All");
  const filters = ["All","Branding","Packaging","Social Media"];
  const list = filter === "All" ? portfolio : portfolio.filter(p => p.category === filter);
  return <main className="inner-page"><section className="page-hero"><span className="kicker">SELECTED WORK</span><h1>Ideas with<br/><em>afterglow.</em></h1><p>A living portfolio — update images, titles and categories from Decap CMS without touching the React code.</p></section>
    <section className="section portfolio-section"><div className="filters">{filters.map(f=><button className={filter===f?"active":""} onClick={()=>setFilter(f)} key={f}>{f}</button>)}</div><div className="portfolio-grid">{list.map(p=><article className="portfolio-item" key={p.title}><img src={p.image} alt={p.title}/><div><span>{p.category}</span><h3>{p.title}</h3><small>{p.tag}</small></div></article>)}</div></section></main>;
}

function About() {
  return <main className="inner-page"><section className="page-hero"><span className="kicker">ABOUT PIXCEL</span><h1>Built for brands<br/><em>with something to say.</em></h1><p>Pixcel Studio is an independent graphic design practice focused on creating clear, expressive visual identities with a little more character.</p></section>
    <section className="section about-layout"><div className="about-art"><div className="about-photo"><span>PX</span></div></div><div className="about-copy"><span className="kicker">THE STUDIO</span><h2>Strategy in one hand.<br/><i>Play in the other.</i></h2><p>We believe the strongest visual identities sit at the intersection of clarity and surprise. We keep the process collaborative, the systems practical and the final work full of personality.</p><p>Our work spans identity, packaging and social content for founders and teams who want their brand to look as ambitious as the idea behind it.</p><a className="text-link" href="mailto:hello@pixcelstudio.com">Start a conversation <ArrowRight size={17}/></a></div></section>
    <section className="founder"><div><span className="kicker">THE FOUNDER</span><h2>Israyelu<br/><em>Kodem.</em></h2><p>Creative direction, brand systems and a belief that design should feel as good as it looks.</p></div><div className="founder-card glass"><div className="portrait">IK</div><div><strong>Israyelu Kodem</strong><small>Founder & Creative Director</small></div></div></section>
  </main>;
}

function App() {
  const route = useHashRoute();
  let page = <Home/>;

  if (route === "/work") page = <Work/>;
  else if (route === "/about") page = <About/>;

  return <><Header/>{page}<Footer/></>;
}

createRoot(document.getElementById("root")).render(<App/>);
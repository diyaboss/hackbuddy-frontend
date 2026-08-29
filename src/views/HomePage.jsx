import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CableConnector, PuzzleSlot, FloatingTerminal } from '../components/TechObjects';

export default function HomePage({ user }) {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [processProgress, setProcessProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => 
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );
  const processRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          if (processRef.current) {
            const rect = processRef.current.getBoundingClientRect();
            const totalScroll = rect.height - window.innerHeight;
            let progress = -rect.top / totalScroll;
            progress = Math.max(0, Math.min(1, progress));
            setProcessProgress(progress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStart = () => {
    if (!user) {
      navigate('/auth');
    } else if (user.role === 'admin' || user.role === 'superadmin') {
      navigate('/admin');
    } else if (!user.hasPhoneNumber) {
      navigate('/phone');
    } else if (!user.profile_complete) {
      navigate('/setup');
    } else {
      navigate('/discover');
    }
  };

  const getProcessOpacity = (index) => {
    if (prefersReducedMotion) return 1;
    const stage = Math.floor(processProgress * 4); // 0, 1, 2, 3
    const targetStage = Math.min(3, stage);
    return targetStage === index ? 1 : 0.2;
  };

  const processStageIndex = prefersReducedMotion ? 3 : Math.min(3, Math.floor(processProgress * 4));

  return (
    <div className="home-container">
      {/* SCENE 1 — OPEN SLOT */}
      <section className="home-scene home-hero scene-dark">
        <div className="editorial-grid">
          <p className="metadata hero-metadata-top">
            FIND WHAT YOUR TEAM IS MISSING.
          </p>
          <h1 className="display-hero hero-title" style={{ transform: prefersReducedMotion ? 'none' : `translateY(${scrollY * 0.15}px)` }}>
            HACKBUDDY
          </h1>
          <div className="hero-obj" style={{ transform: prefersReducedMotion ? 'none' : `translateY(${scrollY * -0.05}px)` }}>
            <CableConnector />
          </div>
          <p className="metadata hero-metadata-bottom">
            01 / 07
          </p>
        </div>
      </section>

      {/* SCENE 2 — MANIFESTO */}
      <section className="home-scene home-manifesto scene-paper">
        <div className="editorial-grid">
          <div className="manifesto-text-block">
            <h2 className="display-xl manifesto-title">
              MOST PLATFORMS<br/>HELP YOU FIND<br/>PEOPLE.<br/>
              <span style={{ color: 'var(--wine-700)' }}>WE HELP YOU FIND<br/>WHAT YOU'RE MISSING.</span>
            </h2>
          </div>
        </div>
      </section>

      {/* SCENE 3 — MATCH */}
      <section className="home-scene match-scene scene-dark">
        <div className="editorial-grid">
          <p className="metadata match-meta-top">
            NOT SIMILAR. COMPLEMENTARY.
          </p>
          <h2 className="display-hero match-title">MATCH</h2>
          <div className="match-obj">
             <FloatingTerminal />
          </div>
          <p className="metadata match-meta-bottom">
            CAPABILITY ROULETTE<br/>IS FOR AMATEURS.
          </p>
        </div>
      </section>

      {/* SCENE 4 — COMPLEMENT */}
      <section className="home-scene complement-scene scene-light">
        <div className="editorial-grid">
          <div className="complement-text-block">
            <h2 className="display-xl complement-title">
              YOU BUILD<br/>INTERFACES.<br/>
              THEY BUILD<br/>SYSTEMS.<br/>
              <span style={{ color: 'var(--wine-700)' }}>THAT'S USEFUL.</span>
            </h2>
          </div>
          <div className="complement-visual-block">
            <div>
              <p className="metadata" style={{ color: 'var(--stone-500)', marginBottom: '0.5rem' }}>YOU NEED</p>
              <h3 className="display-lg">BACKEND</h3>
            </div>
            <CableConnector style={{ transform: 'rotate(90deg)' }} />
            <div>
              <p className="metadata" style={{ color: 'var(--wine-700)', marginBottom: '0.5rem' }}>THEY BRING</p>
              <h3 className="display-lg" style={{ color: 'var(--wine-700)' }}>BACKEND</h3>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 5 — CAPABILITY SHOWCASE */}
      <section className="home-scene showcase-scene scene-dark">
        <div className="editorial-grid">
          <div className="showcase-line-v"></div>
          <div className="showcase-line-h"></div>

          <div className="showcase-profile-1">
            <h3 className="display-lg showcase-title-1">01<br/>FRONTEND</h3>
            <div className="showcase-section">
              <p className="metadata showcase-meta" style={{ color: 'var(--cream-50)' }}>BRINGS</p>
              <div className="showcase-tags">
                <span className="skill-tag skill-brings">React</span>
                <span className="skill-tag skill-brings">Design Systems</span>
                <span className="skill-tag skill-brings">Motion</span>
              </div>
            </div>
            <div>
              <p className="metadata showcase-meta" style={{ color: 'var(--cream-50)' }}>NEEDS</p>
              <div className="showcase-tags">
                <span className="skill-tag skill-needs" style={{ borderColor: 'var(--lime-400)', color: 'var(--lime-400)' }}>APIs</span>
                <span className="skill-tag skill-needs" style={{ borderColor: 'var(--lime-400)', color: 'var(--lime-400)' }}>Data</span>
              </div>
            </div>
          </div>
          
          <div className="showcase-profile-2">
            <h3 className="display-lg showcase-title-2">02<br/>BACKEND</h3>
            <div className="showcase-section">
              <p className="metadata showcase-meta" style={{ color: 'var(--lime-400)' }}>BRINGS</p>
              <div className="showcase-tags">
                <span className="skill-tag skill-brings" style={{ background: 'var(--lime-400)', color: 'var(--ink-950)' }}>Node</span>
                <span className="skill-tag skill-brings" style={{ background: 'var(--lime-400)', color: 'var(--ink-950)' }}>Postgres</span>
                <span className="skill-tag skill-brings" style={{ background: 'var(--lime-400)', color: 'var(--ink-950)' }}>APIs</span>
              </div>
            </div>
            <div>
              <p className="metadata showcase-meta" style={{ color: 'var(--cream-50)' }}>NEEDS</p>
              <div className="showcase-tags">
                <span className="skill-tag skill-needs">UI</span>
                <span className="skill-tag skill-needs">Design</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 6 — PROCESS */}
      <section id="how-it-works" ref={processRef} className="process-scene scene-paper" style={{ height: prefersReducedMotion ? 'auto' : '300vh', minHeight: '100vh' }}>
        <div className="process-sticky" style={{ position: prefersReducedMotion ? 'relative' : 'sticky', top: 0, height: prefersReducedMotion ? 'auto' : '100vh', padding: prefersReducedMotion ? '10vh 0' : 0 }}>
          <div className="editorial-grid process-grid" style={{ gap: prefersReducedMotion ? '4rem' : 'var(--gutter)' }}>
            <div className="process-text-block">
              <h2 className="display-hero process-word" style={{ opacity: getProcessOpacity(0) }}>FIND.</h2>
              <h2 className="display-hero process-word" style={{ opacity: getProcessOpacity(1) }}>REQUEST.</h2>
              <h2 className="display-hero process-word" style={{ opacity: getProcessOpacity(2) }}>MATCH.</h2>
              <h2 className="display-hero process-word" style={{ opacity: getProcessOpacity(3) }}>BUILD.</h2>
            </div>
            <div className="process-visual-block">
              <PuzzleSlot stage={processStageIndex} style={{ transform: 'scale(1.4)' }} />
              <p className="body-editorial process-desc">
                {processStageIndex === 0 && 'Locate the exact skills missing from your team.'}
                {processStageIndex === 1 && 'Send a direct, private request across the gap.'}
                {processStageIndex === 2 && 'Confirm the match and unlock contact details.'}
                {processStageIndex === 3 && 'Get to work on what matters.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 7 — FINAL CTA */}
      <section className="home-scene cta-scene scene-dark">
        <div className="editorial-grid">
          <div className="cta-title-block">
            <h2 className="display-hero cta-title">
              DON'T<br/>BUILD<br/><span style={{ color: 'var(--lime-400)' }}>ALONE.</span>
            </h2>
          </div>
          <div className="cta-action-block">
            <p className="metadata" style={{ marginBottom: '2rem', color: 'var(--stone-500)', fontSize: '0.85rem' }}>
              YOUR TEAM HAS A GAP. GOOD. FILL IT.
            </p>
            <button className="btn-editorial cta-btn" onClick={handleStart}>
              START MATCHING →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

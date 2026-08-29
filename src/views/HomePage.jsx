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
            // rect.top is 0 when the sticky section starts
            // rect.bottom is window.innerHeight when it ends
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
          <p className="metadata" style={{ gridColumn: '1 / -1', marginBottom: '2rem' }}>
            FIND WHAT YOUR TEAM IS MISSING.
          </p>
          <h1 className="display-hero" style={{ fontSize: 'clamp(5rem, 18vw, 22rem)', transform: prefersReducedMotion ? 'none' : `translateY(${scrollY * 0.2}px)` }}>HACKBUDDY</h1>
          <div style={{ position: 'absolute', top: '20vh', right: '10vw', zIndex: 1, transform: prefersReducedMotion ? 'none' : `translateY(${scrollY * -0.1}px)` }}>
            <CableConnector style={{ transform: 'scale(1.5) rotate(15deg)' }} />
          </div>
          <p className="metadata" style={{ position: 'absolute', bottom: 'var(--outer-margin)', right: 'var(--outer-margin)' }}>
            01 / 07
          </p>
        </div>
      </section>

      {/* SCENE 2 — MANIFESTO */}
      <section className="home-scene home-manifesto scene-light">
        <div className="editorial-grid">
          <div className="text-block" style={{ gridColumn: '1 / 10' }}>
            <h2 className="display-xl" style={{ color: 'var(--ink-950)' }}>
              MOST PLATFORMS<br/>HELP YOU FIND<br/>PEOPLE.<br/>
              <span style={{ color: 'var(--wine-700)' }}>WE HELP YOU FIND<br/>WHAT YOU'RE MISSING.</span>
            </h2>
          </div>
          <div className="obj-block" style={{ gridColumn: '12 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PuzzleSlot style={{ transform: 'scale(2) rotate(-10deg)', opacity: 0.8 }} />
          </div>
        </div>
      </section>

      {/* SCENE 3 — MATCH */}
      <section className="home-scene scene-dark" style={{ justifyContent: 'center', position: 'relative' }}>
        <div className="editorial-grid" style={{ width: '100%', alignItems: 'center' }}>
          <p className="metadata" style={{ position: 'absolute', top: '10vh', left: 'var(--outer-margin)' }}>
            NOT SIMILAR. COMPLEMENTARY.
          </p>
          <h2 className="display-hero" style={{ gridColumn: '1 / -1', fontSize: 'clamp(6rem, 24vw, 28rem)', color: 'var(--cream-50)', zIndex: 2 }}>MATCH</h2>
          <div style={{ position: 'absolute', left: '40vw', top: '30vh', zIndex: 1, opacity: 0.4 }}>
             <FloatingTerminal style={{ transform: 'scale(1.8) rotate(-5deg)' }} />
          </div>
          <p className="metadata" style={{ position: 'absolute', bottom: '10vh', right: 'var(--outer-margin)', color: 'var(--stone-500)', textAlign: 'right' }}>
            CAPABILITY ROULETTE<br/>IS FOR AMATEURS.
          </p>
        </div>
      </section>

      {/* SCENE 4 — COMPLEMENT */}
      <section className="home-scene scene-light">
        <div className="editorial-grid" style={{ alignItems: 'center' }}>
          <div style={{ gridColumn: '1 / 8' }}>
            <h2 className="display-xl" style={{ color: 'var(--ink-950)' }}>
              YOU BUILD INTERFACES.<br/>
              THEY BUILD SYSTEMS.<br/>
              THAT'S USEFUL.
            </h2>
          </div>
          <div style={{ gridColumn: '10 / 12', display: 'flex', justifyContent: 'center' }}>
             <CableConnector style={{ transform: 'rotate(90deg) scale(1.5)' }} />
          </div>
          <div style={{ gridColumn: '12 / -1' }}>
            <p className="metadata" style={{ color: 'var(--ink-950)', marginBottom: '1rem' }}>YOU NEED BACKEND</p>
            <p className="metadata" style={{ color: 'var(--wine-700)' }}>THEY BRING BACKEND</p>
          </div>
        </div>
      </section>

      {/* SCENE 5 — CAPABILITY SHOWCASE */}
      <section className="home-scene scene-dark">
        <div className="editorial-grid" style={{ alignContent: 'center' }}>
          <div style={{ gridColumn: '1 / 7' }}>
            <h3 className="display-lg" style={{ color: 'var(--lime-400)', marginBottom: '2rem' }}>01<br/>FRONTEND</h3>
            <div style={{ marginBottom: '3rem' }}>
              <p className="metadata" style={{ marginBottom: '1rem', color: 'var(--cream-50)' }}>BRINGS</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="skill-tag skill-brings">React</span>
                <span className="skill-tag skill-brings">Design Systems</span>
                <span className="skill-tag skill-brings">Motion</span>
              </div>
            </div>
            <div>
              <p className="metadata" style={{ marginBottom: '1rem', color: 'var(--cream-50)' }}>NEEDS</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="skill-tag skill-needs">APIs</span>
                <span className="skill-tag skill-needs">Data</span>
                <span className="skill-tag skill-needs">Infrastructure</span>
              </div>
            </div>
          </div>
          
          <div style={{ gridColumn: '9 / -1' }}>
            <h3 className="display-lg" style={{ color: 'var(--lime-400)', marginBottom: '2rem' }}>02<br/>BACKEND</h3>
            <div style={{ marginBottom: '3rem' }}>
              <p className="metadata" style={{ marginBottom: '1rem', color: 'var(--cream-50)' }}>BRINGS</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="skill-tag skill-brings">Node</span>
                <span className="skill-tag skill-brings">Postgres</span>
                <span className="skill-tag skill-brings">APIs</span>
              </div>
            </div>
            <div>
              <p className="metadata" style={{ marginBottom: '1rem', color: 'var(--cream-50)' }}>NEEDS</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="skill-tag skill-needs">UI</span>
                <span className="skill-tag skill-needs">Design</span>
                <span className="skill-tag skill-needs">Pitch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 6 — PROCESS */}
      <section id="how-it-works" ref={processRef} className="scene-light" style={{ position: 'relative', height: prefersReducedMotion ? 'auto' : '300vh', minHeight: '100vh' }}>
        <div style={{ position: prefersReducedMotion ? 'relative' : 'sticky', top: 0, height: prefersReducedMotion ? 'auto' : '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', padding: prefersReducedMotion ? '10vh 0' : 0 }}>
          <div className="editorial-grid" style={{ width: '100%', gap: prefersReducedMotion ? '4rem' : 'var(--gutter)' }}>
            <div style={{ gridColumn: '1 / 6', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 className="display-hero" style={{ color: 'var(--ink-950)', fontSize: '10vw', opacity: getProcessOpacity(0), transition: 'opacity 0.3s' }}>FIND.</h2>
              <h2 className="display-hero" style={{ color: 'var(--ink-950)', fontSize: '10vw', opacity: getProcessOpacity(1), transition: 'opacity 0.3s' }}>REQUEST.</h2>
              <h2 className="display-hero" style={{ color: 'var(--ink-950)', fontSize: '10vw', opacity: getProcessOpacity(2), transition: 'opacity 0.3s' }}>MATCH.</h2>
              <h2 className="display-hero" style={{ color: 'var(--ink-950)', fontSize: '10vw', opacity: getProcessOpacity(3), transition: 'opacity 0.3s' }}>BUILD.</h2>
            </div>
            <div style={{ gridColumn: '8 / -1', alignSelf: 'center', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <PuzzleSlot style={{ transform: prefersReducedMotion ? 'none' : `rotate(${scrollY * 0.1}deg)`, transition: 'transform 0.1s ease-out' }} />
              <p className="metadata" style={{ color: 'var(--wine-700)', fontSize: '1.2rem' }}>
                {processStageIndex === 0 && 'Locate the exact skills missing from your team.'}
                {processStageIndex === 1 && 'Send a direct, private request.'}
                {processStageIndex === 2 && 'Confirm the match and unlock contact details.'}
                {processStageIndex === 3 && 'Get to work.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SCENE 7 — FINAL CTA */}
      <section className="home-scene scene-dark">
        <div className="editorial-grid" style={{ alignContent: 'center', width: '100%' }}>
          <h2 className="display-xl" style={{ gridColumn: '1 / -1', marginBottom: '4rem', color: 'var(--cream-50)' }}>
            DON'T<br/>BUILD<br/>ALONE.
          </h2>
          <div style={{ gridColumn: '1 / -1' }}>
            <button className="btn-editorial" onClick={handleStart}>
              START MATCHING →
            </button>
            <p className="metadata" style={{ marginTop: '2rem', color: 'var(--stone-500)' }}>
              YOUR TEAM HAS A GAP. GOOD.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

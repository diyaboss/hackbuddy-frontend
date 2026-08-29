import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CableConnector, PuzzleSlot, FloatingTerminal } from '../components/TechObjects';

export default function HomePage({ user }) {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStart = () => {
    if (!user) navigate('/auth');
    else if (!user.hasPhoneNumber) navigate('/phone');
    else if (!user.profile_complete) navigate('/setup');
    else if (user.role === 'admin') navigate('/admin');
    else navigate('/discover');
  };

  return (
    <div className="home-container">
      {/* SCENE 1 — OPEN SLOT */}
      <section className="home-scene home-hero scene-dark">
        <div className="editorial-grid">
          <p className="metadata" style={{ gridColumn: '1 / -1', marginBottom: '2rem' }}>
            FIND WHAT YOUR TEAM IS MISSING.
          </p>
          <h1 className="display-hero" style={{ fontSize: 'clamp(5rem, 18vw, 22rem)', transform: `translateY(${scrollY * 0.2}px)` }}>HACKBUDDY</h1>
          <div style={{ position: 'absolute', top: '20vh', right: '10vw', zIndex: 1, transform: `translateY(${scrollY * -0.1}px)` }}>
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
      <section className="scene-light" style={{ position: 'relative', height: '300vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <div className="editorial-grid" style={{ width: '100%' }}>
            <div style={{ gridColumn: '1 / 6' }}>
              <h2 className="display-hero" style={{ color: 'var(--ink-950)', fontSize: '10vw' }}>FIND.</h2>
              <h2 className="display-hero" style={{ color: 'var(--ink-950)', fontSize: '10vw', opacity: 0.2 }}>REQUEST.</h2>
              <h2 className="display-hero" style={{ color: 'var(--ink-950)', fontSize: '10vw', opacity: 0.2 }}>MATCH.</h2>
              <h2 className="display-hero" style={{ color: 'var(--ink-950)', fontSize: '10vw', opacity: 0.2 }}>BUILD.</h2>
            </div>
            <div style={{ gridColumn: '8 / -1', alignSelf: 'center' }}>
              <PuzzleSlot style={{ transform: `rotate(${scrollY * 0.1}deg)`, transition: 'transform 0.1s ease-out' }} />
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

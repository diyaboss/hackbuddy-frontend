import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage({ user }) {
  const navigate = useNavigate();

  const handleStart = () => {
    if (!user) navigate('/auth');
    else if (!user.hasPhoneNumber) navigate('/phone');
    else if (!user.profile_complete) navigate('/setup');
    else if (user.role === 'admin') navigate('/admin');
    else navigate('/discover');
  };

  return (
    <div className="home-container">
      {/* Scene 1 */}
      <section className="home-scene home-hero scene-dark">
        <div className="editorial-grid">
          <p className="metadata" style={{ gridColumn: '1 / -1', marginBottom: '2rem' }}>
            FIND WHAT YOUR TEAM IS MISSING.
          </p>
          <h1 className="display-hero">HACKBUDDY</h1>
          <div className="obj-connector">?</div>
          <p className="metadata" style={{ position: 'absolute', bottom: 'var(--outer-margin)', right: 'var(--outer-margin)' }}>
            01 / 07
          </p>
        </div>
      </section>

      {/* Scene 2 */}
      <section className="home-scene home-manifesto scene-light">
        <div className="editorial-grid">
          <div className="text-block">
            <h2 className="display-xl" style={{ color: 'var(--ink-950)' }}>
              MOST PLATFORMS<br/>HELP YOU FIND<br/>PEOPLE.<br/>
              <span style={{ color: 'var(--wine-700)' }}>WE HELP YOU FIND<br/>WHAT YOU'RE MISSING.</span>
            </h2>
          </div>
          <div className="obj-block">
            <div className="obj-rack">
              <div className="obj-rack-bay"></div>
              <div className="obj-rack-bay missing"></div>
              <div className="obj-rack-bay"></div>
              <div className="obj-rack-bay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Scene 3 */}
      <section className="home-scene scene-dark" style={{ justifyContent: 'center' }}>
        <p className="metadata" style={{ position: 'absolute', left: 'var(--outer-margin)' }}>
          NOT SIMILAR. COMPLEMENTARY.
        </p>
        <h2 className="display-hero" style={{ fontSize: '22vw' }}>MATCH</h2>
      </section>

      {/* Scene 4 */}
      <section className="home-scene scene-light">
        <div className="editorial-grid" style={{ alignItems: 'center' }}>
          <div style={{ gridColumn: '1 / 8' }}>
            <h2 className="display-lg">
              YOU BUILD INTERFACES.<br/>
              THEY BUILD SYSTEMS.<br/>
              THAT'S USEFUL.
            </h2>
          </div>
          <div style={{ gridColumn: '12 / -1' }}>
            <p className="metadata">YOU NEED BACKEND</p>
            <p className="metadata" style={{ color: 'var(--wine-700)' }}>THEY BRING BACKEND</p>
          </div>
        </div>
      </section>

      {/* Scene 7: CTA */}
      <section className="home-scene scene-dark">
        <div className="editorial-grid" style={{ alignContent: 'center' }}>
          <h2 className="display-xl" style={{ gridColumn: '1 / -1', marginBottom: '4rem' }}>
            DON'T BUILD ALONE.
          </h2>
          <div style={{ gridColumn: '1 / -1' }}>
            <button className="btn-editorial" onClick={handleStart}>
              START MATCHING →
            </button>
            <p className="metadata" style={{ marginTop: '1rem', color: 'var(--stone-500)' }}>
              YOUR TEAM HAS A GAP. GOOD.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

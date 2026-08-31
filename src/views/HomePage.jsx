import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AnimalAvatar from '../components/AnimalAvatar'
import ScrollProgress from '../components/ScrollProgress'
import KineticMarquee from '../components/KineticMarquee'

export default function HomePage({ user }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.15 }
    )

    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach((el) => observer.observe(el))
    
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('is-visible'))
    }, 100)

    return () => observer.disconnect()
  }, [])

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ x, y })
  }

  const handleCtaClick = (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/auth')
    } else if (user.role === 'admin' || user.role === 'superadmin') {
      navigate('/admin')
    } else if (!user.hasPhoneNumber) {
      navigate('/phone')
    } else if (!user.profile_complete) {
      navigate('/setup')
    } else {
      navigate('/discover')
    }
  }

  return (
    <div className="home-page">
      <ScrollProgress />
      
      <section 
        className="hero content-section"
        onPointerMove={handlePointerMove}
        style={{ '--mx': mousePos.x, '--my': mousePos.y }}
      >
        <div className="hero-copy">
          <p className="eyebrow reveal">TEAM FORMATION</p>
          <h1 className="hero-title reveal">
            HACKBUDDY
          </h1>
          <p className="hero-subtitle reveal" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
            Find the people your stack is missing.
          </p>
          <button className="primary-action reveal" onClick={handleCtaClick}>
            FIND MY TEAM <span>→</span>
          </button>
        </div>

        <div className="hero-animals" aria-label="A stack of possible teammate avatars">
          <div className="hero-card hero-card-one">
            <AnimalAvatar animal="owl" label="Owl" />
          </div>
          <div className="hero-card hero-card-two">
            <AnimalAvatar animal="cat" label="Black cat" />
          </div>
          <div className="hero-card hero-card-three">
            <AnimalAvatar animal="raccoon" label="Raccoon" />
          </div>
          <span className="hero-sticker">
            TEAM CHEMISTRY
            <b>94%</b>
          </span>
        </div>

        <div className="scroll-cue">
          <span /> SCROLL TO SEE HOW IT WORKS
        </div>
      </section>

      <KineticMarquee />

      <section className="engine-section content-section">
        <div className="section-kicker reveal">
          <span>01</span> THE COMPLEMENT ENGINE
        </div>
        
        <div className="engine-heading reveal">
          <h2>Different strengths.<br />One dangerous team.</h2>
          <p>We pair people whose strongest skills fill the gaps in your team.</p>
        </div>

        <div className="skill-map reveal">
          <div className="stack-side">
            <small>YOUR STACK</small>
            <strong>AI / ML</strong>
            <strong>CYBERSECURITY</strong>
            <em>Needs a product interface</em>
          </div>
          
          <div className="signal">
            <span className="signal-line" />
            <b>94%</b>
            <small>COMPLEMENT<br />SCORE</small>
          </div>
          
          <div className="stack-side partner-stack">
            <small>THEIR STACK</small>
            <strong>REACT</strong>
            <strong>UI / UX</strong>
            <em>Needs technical depth</em>
          </div>
        </div>
      </section>

      <section className="process-section content-section">
        <div className="section-kicker reveal">
          <span>02</span> FROM SOLO TO SQUAD
        </div>

        <div className="process-row reveal">
          <span>01</span>
          <h3>Show your real stack</h3>
          <p>Skills, interests, working style and the animal you become after midnight.</p>
        </div>
        <div className="process-row reveal">
          <span>02</span>
          <h3>Meet useful humans</h3>
          <p>Every person is discoverable. The order prioritises the people who complete your team.</p>
        </div>
        <div className="process-row reveal">
          <span>03</span>
          <h3>Match, connect, build</h3>
          <p>Accepted team-ups open a Match Room so you can choose a problem statement, share contact details when you're ready, and start building.</p>
        </div>
      </section>

      <section className="rules-section content-section">
        <div className="rules-copy reveal">
          <div className="section-kicker">
            <span>03</span> TEAM RULES
          </div>
          <h2>Build a valid team.</h2>
          <p>Review the full list of rules on the hackathon guidelines page before finalizing your team.</p>
        </div>
        <div className="rule-numbers reveal">
          <div style={{ flex: 1, textAlign: 'center' }}>
            <strong>3–5</strong>
            <p>PEOPLE<br /><b>PER TEAM</b></p>
          </div>
        </div>
      </section>

      <section className="final-call">
        <div className="final-art reveal" style={{ 
          width: '100%', 
          maxWidth: '800px', 
          aspectRatio: '16/9', 
          margin: '0 auto 40px', 
          background: 'var(--surface)', 
          border: '1px dashed var(--line)', 
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <img 
            src="/brand/hackathon-collage.jpg" 
            alt="Hackathon Event Collage" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextSibling.style.display = 'block';
            }}
          />
          <span style={{ display: 'none', color: 'var(--muted)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            EVENT HIGHLIGHTS
          </span>
        </div>
        <div className="final-copy">
          <p className="eyebrow reveal">YOUR NEXT TEAMMATE IS IN THE QUEUE</p>
          <h2 className="reveal">Ready to meet<br />your missing piece?</h2>
          <button className="primary-action reveal" onClick={handleCtaClick}>
            START MATCHING <span>→</span>
          </button>
        </div>
      </section>
    </div>
  )
}

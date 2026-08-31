import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { discoverApi } from '../api/discover'
import { requestsApi } from '../api/requests'
import { profileApi } from '../api/profile'
import AnimalAvatar from '../components/AnimalAvatar'
import ConfirmModal from '../components/ConfirmModal'

export default function DiscoverView({ user, setUser, showToast }) {
  const navigate = useNavigate()
  const matchingStatus = user?.matching_status || 'active'

  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const [genderFilter, setGenderFilter] = useState('Everyone')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [requestSending, setRequestSending] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingStatus, setPendingStatus] = useState(null)
  const swipeStartRef = useRef(null)
  const swipeOffsetRef = useRef(0)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await discoverApi.getEligibleUsers(genderFilter)
      setCandidates(Array.isArray(data) ? data : [])
      setCurrentIndex(0)
      setSwipeOffset(0)
      swipeOffsetRef.current = 0
    } catch (err) {
      setCandidates([])
      showToast(err.message || 'Failed to load Discover')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (matchingStatus === 'active') {
      fetchUsers()
    } else {
      setLoading(false)
      setCandidates([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genderFilter, matchingStatus])

  const activeProfile =
    candidates.length > 0 ? candidates[currentIndex % candidates.length] : null

  const nextProfile =
    candidates.length > 1
      ? candidates[(currentIndex + 1) % candidates.length]
      : null

  const moveToNext = (direction = -1) => {
    if (!candidates.length) return
    setSwipeOffset(direction * 600)
    window.setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % candidates.length)
      setSwipeOffset(0)
      swipeOffsetRef.current = 0
    }, 240)
  }

  const handleNext = () => moveToNext(-1)

  const handleTeamUp = async () => {
    if (!activeProfile || requestSending) return

    setRequestSending(true)
    try {
      await requestsApi.sendRequest(activeProfile.id)
      showToast(
        `TEAM REQUEST SENT TO ${activeProfile.name.toUpperCase()} · THEY'LL SEE IT IN REQUESTS`
      )

      // Remove the requested person from this local deck immediately.
      const remaining = candidates.filter((candidate) => candidate.id !== activeProfile.id)
      setCandidates(remaining)
      setCurrentIndex(0)
      setSwipeOffset(0)
      swipeOffsetRef.current = 0
    } catch (err) {
      showToast(err.message || 'Failed to send request')
    } finally {
      setRequestSending(false)
    }
  }

  const handlePointerDown = (event) => {
    if (!activeProfile) return
    swipeStartRef.current = event.clientX
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (swipeStartRef.current !== null) {
      const delta = event.clientX - swipeStartRef.current
      swipeOffsetRef.current = delta
      setSwipeOffset(delta)
    }
  }

  const handlePointerUp = () => {
    if (swipeStartRef.current === null) return
    swipeStartRef.current = null
    const finalOffset = swipeOffsetRef.current

    if (finalOffset > 110) {
      handleTeamUp()
    } else if (finalOffset < -110) {
      handleNext()
    } else {
      setSwipeOffset(0)
      swipeOffsetRef.current = 0
    }
  }

  const updateStatus = async (status) => {
    if (status === 'team_found' && pendingStatus !== 'team_found') {
      setPendingStatus('team_found')
      setShowConfirm(true)
      return
    }

    setStatusUpdating(true)
    try {
      await profileApi.updateStatus(status)
      setUser((current) => ({ ...current, matching_status: status }))
      showToast(
        status === 'active'
          ? 'Matching resumed'
          : status === 'paused'
            ? 'Matching paused'
            : 'You are out of matching'
      )
    } catch (err) {
      showToast(err.message || 'Failed to update matching status')
    } finally {
      setStatusUpdating(false)
      setPendingStatus(null)
      setShowConfirm(false)
    }
  }

  const cardStyle = {
    transform: `translateX(${swipeOffset}px) rotate(${swipeOffset / 30}deg)`,
  }

  const statusToolbar = (
    <div className="portal-toolbar">
      <label className="discover-filter">
        <span>SHOW</span>
        <select
          value={genderFilter}
          onChange={(event) => setGenderFilter(event.target.value)}
          disabled={statusUpdating}
        >
          <option value="Everyone">Everyone</option>
          <option value="Women">Women</option>
          <option value="Men">Men</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </label>

      <div className="portal-modes" role="tablist">
        <button className="active" type="button">
          DISCOVER
        </button>
        <button type="button" onClick={() => navigate('/requests')}>
          TEAM REQUESTS
        </button>
      </div>

      <div className="matching-status-actions">
        <button
          className="exit-matching"
          type="button"
          onClick={() => updateStatus('paused')}
          disabled={statusUpdating}
        >
          PAUSE
        </button>
        <button
          className="exit-matching"
          type="button"
          onClick={() => updateStatus('team_found')}
          disabled={statusUpdating}
        >
          I'VE FOUND MY TEAM
        </button>
      </div>
    </div>
  )

  const renderConfirm = () => {
    if (!showConfirm) return null
    return (
      <ConfirmModal
        title="TEAM COMPLETE?"
        confirmText="I'VE FOUND MY TEAM"
        cancelText="KEEP MATCHING"
        onConfirm={() => updateStatus(pendingStatus)}
        onCancel={() => { setShowConfirm(false); setPendingStatus(null); }}
      >
        You'll stop appearing in Discover and won't receive new Team Up requests. Your existing matches and shared contacts stay available.
      </ConfirmModal>
    )
  }

  if (matchingStatus === 'team_found') {
    return (
      <section className="discover-screen">
        {renderConfirm()}
        {statusToolbar}
        <div className="requests-empty status-empty">
          <b>TEAM COMPLETE</b>
          <h2>You're out of the matching pool.</h2>
          <p>Your accepted matches and Match Rooms are still here.</p>
          <button className="primary-action" onClick={() => updateStatus('active')}>
            START MATCHING AGAIN →
          </button>
        </div>
      </section>
    )
  }

  if (matchingStatus === 'paused') {
    return (
      <section className="discover-screen">
        {renderConfirm()}
        {statusToolbar}
        <div className="requests-empty status-empty">
          <b>PAUSED</b>
          <h2>Your profile is temporarily hidden.</h2>
          <p>Resume whenever you want to start meeting teammates again.</p>
          <button className="primary-action" onClick={() => updateStatus('active')}>
            RESUME MATCHING →
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="discover-screen">
      {renderConfirm()}
      {statusToolbar}

      <div className="discover-layout">
        <aside className="match-rail">
          <p className="eyebrow">SMART ORDER</p>
          <h1>Meet people who complete your stack.</h1>
          <p className="pairing-note">
            We pair complementary people whose strengths fill the gaps in your team.
          </p>

          <div className="rail-score">
            <strong>{activeProfile ? `${activeProfile.complementScore}%` : '--'}</strong>
            <span>
              COMPLEMENT
              <br />
              SCORE
            </span>
          </div>

          <p className="filtered-count">
            <b>
              {activeProfile
                ? String((currentIndex % candidates.length) + 1).padStart(2, '0')
                : '00'}
            </b>{' '}
            / {String(candidates.length).padStart(2, '0')} IN THIS VIEW
          </p>
        </aside>

        <div className="deck-wrap">
          {loading ? (
            <div className="deck-empty">
              <p className="eyebrow">SCANNING THE ROOM</p>
              <h2>Finding people who fill your gaps…</h2>
            </div>
          ) : activeProfile ? (
            <>
              <div
                className="swipe-stamp stamp-next"
                style={{ opacity: Math.max(0, -swipeOffset / 110) }}
              >
                NEXT
              </div>
              <div
                className="swipe-stamp stamp-team"
                style={{ opacity: Math.max(0, swipeOffset / 110) }}
              >
                TEAM UP
              </div>

              {nextProfile && (
                <article className="profile-card card-behind">
                  <AnimalAvatar
                    animal={nextProfile.avatar}
                    label={nextProfile.name}
                  />
                </article>
              )}

              <article
                className="profile-card active-card"
                style={cardStyle}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                <div className="profile-visual">
                  <AnimalAvatar
                    animal={activeProfile.avatar}
                    label={activeProfile.name}
                  />
                  <span className="card-count">
                    {String((currentIndex % candidates.length) + 1).padStart(2, '0')} /{' '}
                    {String(candidates.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="profile-copy">
                  <div className="name-line">
                    <div>
                      <h2>{activeProfile.name}</h2>
                      <p>
                        {activeProfile.year} · {activeProfile.branch}
                      </p>
                    </div>
                    <span className="available">AVAILABLE</span>
                  </div>

                  <h3>Building a balanced hackathon team.</h3>

                  <div className="skill-columns">
                    <div>
                      <small>THEY BUILD WITH</small>
                      <div>
                        {activeProfile.skills.map((skill) => (
                          <span key={skill}>{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <small>THEY WANT FROM A TEAMMATE</small>
                      <div>
                        {activeProfile.lookingFor.map((skill) => (
                          <span key={skill}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="why">
                    <b>WHY YOU SHOULD TEAM UP</b>
                    {activeProfile.complementReasons.map((reason, index) => (
                      <p key={`${reason}-${index}`}>
                        <span>↳</span> {reason}
                      </p>
                    ))}
                  </div>

                  {activeProfile.bio && (
                    <div className="personality single-personality">
                      <p>
                        <small>AT 2:47 AM, WHEN IT BREAKS…</small>
                        {activeProfile.bio}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            </>
          ) : (
            <div className="deck-empty">
              <p className="eyebrow">NO ONE ELSE HERE YET</p>
              <h2>Your next HackBuddy hasn't joined yet.</h2>
              <p>
                You're active in matching. As more people finish their profiles,
                they'll appear here automatically.
              </p>
            </div>
          )}
        </div>

        <div className="swipe-actions">
          <button
            className="next-button"
            type="button"
            onClick={handleNext}
            disabled={!activeProfile || loading}
          >
            <span>←</span>
            <div>
              <b>NEXT</b>
              <small>Maybe later</small>
            </div>
          </button>

          <button
            className="team-button"
            type="button"
            onClick={handleTeamUp}
            disabled={!activeProfile || requestSending || loading}
          >
            <span>{requestSending ? '…' : '→'}</span>
            <div>
              <b>{requestSending ? 'SENDING' : 'TEAM UP'}</b>
              <small>I’d build with them</small>
            </div>
          </button>
        </div>
      </div>
    </section>
  )
}

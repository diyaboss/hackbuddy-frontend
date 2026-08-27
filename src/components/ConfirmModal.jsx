import React, { useEffect, useRef } from 'react'

export default function ConfirmModal({ title, children, confirmText, cancelText, onConfirm, onCancel }) {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    // Focus the modal for accessibility
    if (modalRef.current) modalRef.current.focus()
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '24px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div 
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          background: 'var(--ink)',
          border: '1px solid var(--line)',
          maxWidth: '480px',
          width: '100%',
          padding: '40px',
          outline: 'none',
          animation: 'fade-in 0.2s ease-out'
        }}
      >
        <h2 id="modal-title" style={{ color: 'var(--accent)', fontSize: '2rem', margin: '0 0 16px', lineHeight: 1 }}>{title}</h2>
        <div style={{ color: 'var(--paper)', fontFamily: 'var(--font-serif)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '32px' }}>
          {children}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button className="primary-action" onClick={onConfirm} style={{ width: '100%', padding: '16px' }}>
            {confirmText}
          </button>
          <button className="secondary-action" onClick={onCancel} style={{ width: '100%', padding: '16px', background: 'transparent', border: '1px solid var(--line)', color: 'var(--paper-dim)', cursor: 'pointer' }}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}

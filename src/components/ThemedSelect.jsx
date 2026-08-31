import React, { useState, useRef, useEffect } from 'react'

export default function ThemedSelect({ value, onChange, options, 'aria-label': ariaLabel }) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef(null)
  const listboxRef = useRef(null)

  const selectedOption = options.find(opt => opt.value === value) || options[0]

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setIsOpen(true)
        setFocusedIndex(options.findIndex(opt => opt.value === value))
      }
      return
    }

    switch (e.key) {
      case 'Escape':
        setIsOpen(false)
        break
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => (prev < options.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          onChange({ target: { value: options[focusedIndex].value } })
          setIsOpen(false)
        }
        break
      case 'Tab':
        setIsOpen(false)
        break
      default:
        break
    }
  }

  // Effect to scroll focused item into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listboxRef.current) {
      const activeEl = listboxRef.current.children[focusedIndex]
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [focusedIndex, isOpen])

  return (
    <div 
      className="themed-select-container" 
      ref={containerRef}
      style={{ position: 'relative', width: '100%' }}
    >
      <div 
        className={`themed-select-trigger ${isOpen ? 'open' : ''}`}
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '12px 16px',
          background: 'var(--ink-soft)',
          border: '1px solid var(--line)',
          color: 'var(--paper)',
          fontFamily: 'var(--font-ui)',
          fontSize: '1rem',
          cursor: 'pointer',
          borderRadius: '4px',
          outline: 'none',
          minHeight: '48px',
          boxShadow: isOpen ? '0 0 0 2px var(--accent)' : 'none'
        }}
      >
        <span>{selectedOption ? selectedOption.label : ''}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>▼</span>
      </div>

      {isOpen && (
        <ul
          ref={listboxRef}
          role="listbox"
          className="themed-select-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: '100%',
            maxHeight: '280px',
            overflowY: 'auto',
            background: 'var(--ink)',
            border: '1px solid var(--line)',
            borderRadius: '4px',
            padding: '8px 0',
            margin: 0,
            listStyle: 'none',
            zIndex: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
          }}
        >
          {options.map((opt, index) => {
            const isSelected = opt.value === value
            const isFocused = index === focusedIndex

            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange({ target: { value: opt.value } })
                  setIsOpen(false)
                }}
                onMouseEnter={() => setFocusedIndex(index)}
                style={{
                  padding: '10px 16px',
                  color: 'var(--paper)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: isFocused ? 'rgba(255,255,255,0.06)' : 'transparent',
                  borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent'
                }}
              >
                <span style={{ color: isSelected ? 'var(--accent)' : 'inherit', fontWeight: isSelected ? 'bold' : 'normal' }}>
                  {opt.label}
                </span>
                {isSelected && <span style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>✓</span>}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

import React from 'react'
import { AVATAR_OPTIONS } from '../data/avatars'

const legacyAnimalMap = {
  raccoon: '/animals/raccoon.svg',
  owl: '/animals/owl.svg',
  cat: '/animals/cat.svg',
  dog: '/animals/dog.svg',
}

export default function AnimalAvatar({ animal, label, compact = false }) {
  const selectedAvatar = AVATAR_OPTIONS.find((avatar) => avatar.id === animal)
  const imgSrc =
    selectedAvatar?.src ||
    legacyAnimalMap[animal] ||
    AVATAR_OPTIONS[0]?.src ||
    legacyAnimalMap.raccoon

  const resolvedLabel = label || selectedAvatar?.label || 'HackBuddy'

  return (
    <figure
      className={`animal-avatar animal-${animal || 'avatar'} ${compact ? 'animal-compact' : ''}`}
    >
      <span className="animal-halo" aria-hidden="true" />
      <img src={imgSrc} alt={`${resolvedLabel} avatar`} draggable={false} />
      {label && <figcaption>{label}</figcaption>}
    </figure>
  )
}

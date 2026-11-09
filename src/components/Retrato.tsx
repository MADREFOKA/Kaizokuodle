'use client'
/* eslint-disable @next/next/no-img-element -- imágenes externas de OPBD, sin optimizar */
import { useState } from 'react'

export function Retrato({ src, alt, size = 40 }: { src: string | null; alt: string; size?: number }) {
  const [roto, setRoto] = useState(false)
  return src && !roto ? (
    <img src={src} alt={alt} width={size} height={size} loading="lazy" referrerPolicy="no-referrer" onError={() => setRoto(true)}
      className="shrink-0 rounded-md bg-tinta-2 object-cover" style={{ width: size, height: size }} />
  ) : (
    <span role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={!alt}
      className="grid shrink-0 place-items-center rounded-md bg-tinta-2 font-display font-bold text-niebla"
      style={{ width: size, height: size }}>?</span>
  )
}

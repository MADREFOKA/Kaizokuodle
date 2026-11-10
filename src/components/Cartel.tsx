import { Retrato } from './Retrato'

/** Cartel de «Se busca» propio (no el de la obra): retrato, nombre y cifra. */
export function Cartel({ nombre, imagen, children, tono = 'normal' }: {
  nombre: string
  imagen: string | null
  children?: React.ReactNode
  tono?: 'normal' | 'acierto' | 'fallo'
}) {
  const borde = { normal: 'border-berry/50', acierto: 'border-acierto', fallo: 'border-fallo' }[tono]
  return (
    <figure className={`flex w-full max-w-xs flex-col items-center gap-3 rounded-2xl border-4 ${borde} bg-tinta/90 p-5 text-center shadow-xl shadow-black/40 backdrop-blur transition-colors`}>
      <span className="font-display text-sm font-bold text-berry">Se busca</span>
      <Retrato src={imagen} alt={nombre} size={160} />
      <figcaption className="font-display text-xl font-extrabold leading-tight">{nombre}</figcaption>
      {children}
    </figure>
  )
}

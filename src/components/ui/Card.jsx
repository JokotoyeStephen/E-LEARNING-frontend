export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`card ${hover ? 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

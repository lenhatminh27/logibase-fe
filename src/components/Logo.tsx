import { Link } from "react-router-dom"

function Logo() {
  return (
    <Link to="/" className="flex items-center" aria-label="Homepage">
      <div className="text-2xl md:text-[28px] font-bold">
        <span className="text-yellow-400">LOGI</span>
        <span className="text-blue-500">BASE</span>
      </div>
    </Link>
  )
}

export default Logo

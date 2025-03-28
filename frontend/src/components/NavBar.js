import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./NavBar.css" // Import CSS for styling

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"))
  const navigate = useNavigate()

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"))
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    navigate("/")
    // window.location.reload() // Ensures AppRouter updates
  }

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <h2 className="webTitle">Deeder</h2>
        <li>
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/maps" className="nav-link">
            Map
          </Link>
        </li>
        <li>
          <Link to="/chat" className="nav-link">
            Chat
          </Link>
        </li>
        <li>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="nav-button">
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default Navbar

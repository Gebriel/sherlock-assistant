import { useState } from "react"
import Login from "@/components/Login"

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  )

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />

  return (
    <div>
      <button
        onClick={() => {
          localStorage.removeItem("token")
          setLoggedIn(false)
        }}
      >
        Logout
      </button>
      <p>Main app goes here</p>
    </div>
  )
}

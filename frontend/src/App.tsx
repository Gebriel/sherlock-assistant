import { useState } from "react"
import Login from "@/components/Login"
import FileUpload from "@/components/FileUpload"

import { Button } from "@/components/ui/button"
import DocumentList from "./components/DocumentList"

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  )
  const [refresh, setRefresh] = useState(0)

  function handleLogout() {
    localStorage.removeItem("token")
    setLoggedIn(false)
  }

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <h1 className="text-lg font-semibold">Sherlock</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-72 flex-col gap-4 overflow-y-auto border-r p-4">
          <h2 className="text-sm font-medium">Case Files</h2>
          <FileUpload onUpload={() => setRefresh((r) => r + 1)} />
          <DocumentList refresh={refresh} />
        </aside>
      </div>
    </div>
  )
}

import { useState, useRef, useEffect } from "react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"

import { apiFetch } from "@/api"
import ReactMarkdown from "react-markdown"

type Message = {
  id: number
  role: "user" | "sherlock"
  text: string
}

export default function Chat() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chat")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    localStorage.setItem("chat", JSON.stringify(messages))
  }, [messages])

  async function handleSend(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!input.trim() || loading) return
    const question = input.trim()
    setInput("")
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: question },
    ])
    setLoading(true)

    try {
      const data = await apiFetch("/query", {
        method: "POST",
        body: JSON.stringify({ question }),
      })
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "sherlock", text: data.answer },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "sherlock",
          text: "Error contacting Sherlock. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="mt-20 text-center text-muted-foreground">
            Upload a case file, then ask your questions.
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-2xl rounded-lg px-4 py-2 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
            >
              {msg.role === "sherlock" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="mb-4 flex justify-start">
            <div className="rounded-lg bg-muted px-4 py-2 text-sm text-muted-foreground italic">
              Investigating...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 border-t p-4">
        <form onSubmit={handleSend} className="flex flex-1 gap-2">
          <Input
            placeholder="Ask about the case..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            Ask
          </Button>
        </form>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button type="button" variant="outline">
              New
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Start a new conversation?</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear the current chat. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => setMessages([])}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"

export default function FileUpload({ onUpload }: { onUpload: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [dragging, setDragging] = useState(false)
  const [inputKey, setInputKey] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(f: File | null) {
    if (!f) return
    if (!f.name.endsWith(".pdf") && !f.name.endsWith(".txt")) {
      setError("Only PDF and plain text files are supported")
      return
    }
    setError("")
    setFile(f)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files?.[0] ?? null)
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setError("")
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.detail || "Upload failed")
        return
      }
      setFile(null)
      setInputKey((k) => k + 1)
      onUpload()
    } catch {
      setError("Could not connect to server")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div
        className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${dragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <p className="text-sm text-muted-foreground">
          {file ? file.name : "Drag & drop or click to select"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">PDF or TXT</p>
      </div>
      <input
        key={inputKey}
        ref={inputRef}
        type="file"
        accept=".pdf,.txt"
        className="hidden"
        placeholder="upload"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full"
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  )
}

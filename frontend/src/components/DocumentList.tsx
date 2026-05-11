import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/api"

export default function DocumentList({ refresh }: { refresh: number }) {
  const [documents, setDocuments] = useState<string[]>([])

  useEffect(() => {
    apiFetch("/documents")
      .then((data) => setDocuments(data.documents))
      .catch(() => setDocuments([]))
  }, [refresh])

  async function handleDelete(filename: string) {
    await apiFetch(`/documents/${filename}`, { method: "DELETE" })
    setDocuments((prev) => prev.filter((f) => f !== filename))
  }

  return (
    <div className="space-y-2">
      {documents.length === 0 && (
        <p className="text-sm text-muted-foreground">No case files uploaded.</p>
      )}
      {documents.map((doc) => (
        <div key={doc} className="flex items-center justify-between text-sm">
          <span>{doc}</span>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(doc)}>
            Delete
          </Button>
        </div>
      ))}
    </div>
  )
}

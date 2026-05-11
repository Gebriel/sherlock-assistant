import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Chat from "@/components/Chat"

describe("QueryChat", () => {
  it("renders the empty state message", () => {
    render(<Chat />)
    expect(
      screen.getByText("Upload a case file, then ask your questions.")
    ).toBeInTheDocument()
  })

  it("Ask button is disabled when input is empty", () => {
    render(<Chat />)
    expect(screen.getByText("Ask")).toBeDisabled()
  })
})

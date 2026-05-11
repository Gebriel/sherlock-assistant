import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FileUpload from "@/components/FileUpload";

describe("FileUpload", () => {
  it("renders the drag and drop zone", () => {
    render(<FileUpload onUpload={() => {}} />);
    expect(
      screen.getByText("Drag & drop or click to select"),
    ).toBeInTheDocument();
  });

  it("upload button is disabled when no file is selected", () => {
    render(<FileUpload onUpload={() => {}} />);
    expect(screen.getByText("Upload")).toBeDisabled();
  });
});

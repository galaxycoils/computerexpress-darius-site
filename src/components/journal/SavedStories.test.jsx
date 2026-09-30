import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SavedStoriesProvider, useSavedStories } from "./SavedStories";

const key = "scd-saved-stories-v1";
function ReadingList() {
  const { ids, toggle, clear, undo, canUndo, error } = useSavedStories();
  return (
    <>
      <output data-testid="ids">{ids.join(",")}</output>
      <button onClick={() => toggle("story-a")}>Toggle story A</button>
      <button onClick={() => toggle("story-b")}>Toggle story B</button>
      <button onClick={clear}>Clear</button>
      {canUndo && <button onClick={undo}>Undo</button>}
      {error && <p role="alert">{error}</p>}
    </>
  );
}
const mount = () =>
  render(
    <SavedStoriesProvider>
      <ReadingList />
    </SavedStoriesProvider>,
  );
beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("a recoverable reading list", () => {
  it("restores valid, unique saved items without accepting malformed entries", () => {
    localStorage.setItem(
      key,
      JSON.stringify(["story-a", "story-a", null, 12, "story-b"]),
    );
    mount();
    expect(screen.getByTestId("ids")).toHaveTextContent("story-a,story-b");
  });
  it("persists additions and restores a removed item with Undo", () => {
    mount();
    fireEvent.click(screen.getByText("Toggle story A"));
    fireEvent.click(screen.getByText("Toggle story B"));
    expect(JSON.parse(localStorage.getItem(key))).toEqual([
      "story-a",
      "story-b",
    ]);
    fireEvent.click(screen.getByText("Toggle story A"));
    fireEvent.click(screen.getByText("Undo"));
    expect(JSON.parse(localStorage.getItem(key))).toEqual([
      "story-a",
      "story-b",
    ]);
  });
  it("can undo clearing the entire reading list", () => {
    localStorage.setItem(key, JSON.stringify(["story-a", "story-b"]));
    mount();
    fireEvent.click(screen.getByText("Clear"));
    expect(screen.getByTestId("ids")).toBeEmptyDOMElement();
    fireEvent.click(screen.getByText("Undo"));
    expect(screen.getByTestId("ids")).toHaveTextContent("story-a,story-b");
  });
  it("keeps the existing list when browser storage rejects a write", () => {
    localStorage.setItem(key, JSON.stringify(["story-a"]));
    mount();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Full", "QuotaExceededError");
    });
    fireEvent.click(screen.getByText("Clear"));
    expect(screen.getByTestId("ids")).toHaveTextContent("story-a");
    expect(screen.getByRole("alert")).toHaveTextContent(/full or disabled/);
  });
});

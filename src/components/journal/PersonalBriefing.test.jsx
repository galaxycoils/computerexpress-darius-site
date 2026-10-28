import { afterEach, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PersonalBriefing from "./PersonalBriefing";
const stories = [
  { id: "a", title: "Welland development", cities: ["Welland"], city: "Welland", topic: "Development", href: "/articles/a", kind: "Source brief", date: "2026-10-01" },
  { id: "b", title: "Thorold council", cities: ["Thorold"], city: "Thorold", topic: "City Hall", href: "/articles/b", kind: "Source brief", date: "2026-10-02" },
];
function setup() { return render(<MemoryRouter><PersonalBriefing stories={stories} /></MemoryRouter>); }
afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });
it("filters by city and interest, persists choices, and offers recovery from no matches", () => {
  setup();
  fireEvent.change(screen.getByLabelText("Where you follow"), { target: { value: "Welland" } });
  expect(screen.getByText("Welland development")).toBeInTheDocument();
  expect(screen.queryByText("Thorold council")).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("What matters to you"), { target: { value: "City Hall" } });
  expect(screen.getByText("A little quiet here.")).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem("scd-personal-briefing-v1"))).toEqual({ city: "Welland", topic: "City Hall" });
  fireEvent.click(screen.getByRole("button", { name: "Reset preferences" }));
  expect(screen.getByText("Thorold council")).toBeInTheDocument();
});
it("restores valid saved preferences and links to the filtered city feed", async () => {
  localStorage.setItem("scd-personal-briefing-v1", JSON.stringify({ city: "Welland", topic: "Development" }));
  setup();
  await waitFor(() => expect(screen.getByLabelText("Where you follow")).toHaveValue("Welland"));
  expect(screen.getByRole("link", { name: /Explore matching/ })).toHaveAttribute("href", "/news/welland?topic=Development");
});
it("keeps filtering usable when saving fails", () => {
  setup();
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("disabled"); });
  fireEvent.change(screen.getByLabelText("Where you follow"), { target: { value: "Thorold" } });
  expect(screen.getByText("Thorold council")).toBeInTheDocument();
  expect(screen.queryByText("Welland development")).not.toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("cannot be saved");
});

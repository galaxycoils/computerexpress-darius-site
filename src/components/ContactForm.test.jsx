import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ContactForm from "./ContactForm";

vi.mock("../utils/analytics", () => ({
  trackEvent: vi.fn(),
  trackLead: vi.fn(),
}));
afterEach(() => vi.unstubAllGlobals());
const mount = (url = "/contact") =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <ContactForm />
    </MemoryRouter>,
  );
const submit = () =>
  fireEvent.submit(
    screen.getByRole("button", { name: "Send message" }).closest("form"),
  );
function fill() {
  fireEvent.change(screen.getByLabelText(/^Name/), {
    target: { value: "Local Reader" },
  });
  fireEvent.change(screen.getByLabelText(/^Email/), {
    target: { value: " reader@example.com " },
  });
  fireEvent.change(screen.getByLabelText(/^Message/), {
    target: { value: "Please review this public source and the date listed." },
  });
}

describe("contact reader journeys", () => {
  it("focuses the first invalid field using the current validation result", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    mount();
    submit();
    expect(screen.getByLabelText(/^Name/)).toHaveFocus();
    fireEvent.change(screen.getByLabelText(/^Name/), {
      target: { value: "Reader" },
    });
    submit();
    expect(screen.getByLabelText(/^Email/)).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("routes a correction and its source into the moderation queue", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, received: true }),
      });
    vi.stubGlobal("fetch", fetchMock);
    mount(
      "/contact?subject=Correction&source=https%3A%2F%2Fexample.ca%2Fnotice",
    );
    expect(screen.getByLabelText("What is your message about?")).toHaveValue(
      "Correction",
    );
    fill();
    submit();
    await screen.findByRole("heading", { name: "Message received." });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toMatchObject({
      kind: "correction",
      sourceUrl: "https://example.ca/notice",
      email: "reader@example.com",
    });
    await waitFor(() =>
      expect(
        screen.getByRole("heading", { name: "Message received." }),
      ).toHaveFocus(),
    );
  });

  it("keeps details available after a rejected submission", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({
          ok: false,
          json: async () => ({
            error: "Submission service is temporarily unavailable.",
          }),
        }),
    );
    mount();
    fill();
    submit();
    await screen.findByText("Submission service is temporarily unavailable.");
    expect(screen.getByLabelText(/^Name/)).toHaveValue("Local Reader");
    expect(screen.getByLabelText(/^Message/)).toHaveValue(
      "Please review this public source and the date listed.",
    );
    expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
    expect(screen.getByRole("link", { name: /^Email / })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:"),
    );
  });

  it("never claims success for an HTTP 200 without confirmation", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({
          ok: true,
          json: async () => ({ success: false }),
        }),
    );
    mount();
    fill();
    submit();
    await screen.findByText(/We couldn’t confirm your submission/);
    expect(screen.queryByText("Message received.")).not.toBeInTheDocument();
  });

  it("requires actual event details and rejects source addresses containing credentials", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    mount("/contact?subject=Event%20submission");
    fireEvent.change(screen.getByLabelText(/^Name/), {
      target: { value: "Reader" },
    });
    fireEvent.change(screen.getByLabelText(/^Email/), {
      target: { value: "reader@example.com" },
    });
    submit();
    expect(
      screen.getByText("Add your details to the message before sending."),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/^Message/), {
      target: { value: "A community event to review." },
    });
    fireEvent.change(screen.getByLabelText(/^Page or source URL/), {
      target: { value: "https://user:password@example.ca/" },
    });
    submit();
    expect(screen.getByLabelText(/^Page or source URL/)).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

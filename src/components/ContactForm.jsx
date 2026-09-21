import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { trackEvent, trackLead } from "../utils/analytics";

const CONTACT_API = "/api/contact";

function validateName(name) {
  if (!name || name.trim().length < 2)
    return "Name must be at least 2 characters";
  return "";
}

function validateEmail(email) {
  if (!email) return "Email is required";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Please enter a valid email address";
  return "";
}

function validateMessage(message) {
  if (!message || message.trim().length < 10)
    return "Please share more details (at least 10 characters)";
  return "";
}

export default function ContactForm({ onSuccess }) {
  const [params] = useSearchParams();
  const subject = ["Event submission", "Accessibility feedback"].includes(
    params.get("subject"),
  )
    ? params.get("subject")
    : "";
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touched, setTouched] = useState({});
  const formRef = useRef(null);

  const [fields, setFields] = useState({
    name: "",
    email: "",
    message:
      subject === "Event submission"
        ? "Event name: \nOrganizer: \nDate and time: \nLocation: \nOfficial event URL: \nCost and accessibility information: \n"
        : subject === "Accessibility feedback"
          ? "Page URL: \nBarrier encountered: \n"
          : "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing (after first blur)
    if (touched[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  }

  function validateField(name, value) {
    const validators = {
      name: validateName,
      email: validateEmail,
      message: validateMessage,
    };
    const error = validators[name]?.(value) || "";
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  }

  function validateAll() {
    const errs = {
      name: validateName(fields.name),
      email: validateEmail(fields.email),
      message: validateMessage(fields.message),
    };
    setFieldErrors(errs);
    setTouched({ name: true, email: true, message: true });
    return !Object.values(errs).some(Boolean);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (validateAll()) {
      setLoading(true);
      setError(null);
      const payload = {
        name: fields.name.trim(),
        email: fields.email.trim(),
        message: fields.message.trim(),
      };

      try {
        const res = await fetch(CONTACT_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (res.ok) {
          trackLead("contact_form", {
            page_path: window.location.pathname,
          });
          trackEvent("contact_submit", {
            form_id: "contact_form",
            page_path: window.location.pathname,
          });
          setSubmitted(true);
          setFields({ name: "", email: "", message: "" });
          setTouched({});
          setFieldErrors({});
          if (onSuccess) onSuccess();
        } else {
          setError(result.error || "Something went wrong. Please try again.");
        }
      } catch (err) {
        console.error("Form submit failed:", err);
        setError("Network error. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // Focus the first field with an error
      const firstError = Object.keys(fieldErrors).find((k) => fieldErrors[k]);
      if (firstError && formRef.current) {
        formRef.current.querySelector(`[name="${firstError}"]`)?.focus();
      }
    }
  }

  if (submitted) {
    return (
      <div className="contact-form contact-form-success">
        <div className="contact-form-success-icon" aria-hidden="true">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3>Message sent</h3>
        <p>
          Thanks for reaching out. We will get back to you within 1-2 business
          days with a custom audit and recommendations.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      name="contact"
      data-form-id="contact_form"
      className="contact-form"
      onSubmit={handleSubmit}
      noValidate
    >
      {error && (
        <div className="contact-form-error" role="alert">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <div
        className={`form-field ${touched.name && fieldErrors.name ? "has-error" : ""}`}
      >
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your name"
          required
          autoComplete="name"
          value={fields.name}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
        />
        {touched.name && fieldErrors.name && (
          <span id="name-error" className="field-error" role="alert">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {fieldErrors.name}
          </span>
        )}
      </div>

      <div
        className={`form-field ${touched.email && fieldErrors.email ? "has-error" : ""}`}
      >
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
          value={fields.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
        />
        {touched.email && fieldErrors.email && (
          <span id="email-error" className="field-error" role="alert">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {fieldErrors.email}
          </span>
        )}
      </div>

      <div
        className={`form-field ${touched.message && fieldErrors.message ? "has-error" : ""}`}
      >
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          placeholder="Tell us about your project, website, or goals…"
          required
          value={fields.message}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
        />
        {touched.message && fieldErrors.message && (
          <span id="message-error" className="field-error" role="alert">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {fieldErrors.message}
          </span>
        )}
      </div>

      <div className="form-footer">
        <button
          type="submit"
          className={`button button-primary${loading ? " is-loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Sending…" : "Send Message"}
        </button>
        <p className="form-privacy">
          By submitting, you agree to be contacted regarding your inquiry. Your
          data is secure.
        </p>
      </div>
    </form>
  );
}

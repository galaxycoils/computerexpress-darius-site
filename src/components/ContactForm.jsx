import { useEffect, useId, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { trackEvent, trackLead } from "../utils/analytics";
import { submitForm } from "../utils/formRequest";
import { contactSubjects } from "../data/contactSubjects";
import { siteConfig } from "../data/siteConfig";
import UiIcon from "./journal/UiIcon";

function validate(fields) {
  const errors = {};
  if (fields.name.trim().length < 2)
    errors.name = "Enter your name (at least 2 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()))
    errors.email = "Enter a valid email address.";
  if (fields.message.trim().length < 10)
    errors.message = "Share a few more details (at least 10 characters).";
  if (
    contactSubjects.some(
      (subject) =>
        subject.template && subject.template.trim() === fields.message.trim(),
    )
  )
    errors.message = "Add your details to the message before sending.";
  if (fields.sourceUrl.trim()) {
    try {
      const source = new URL(fields.sourceUrl.trim());
      if (source.protocol !== "https:" || source.username || source.password)
        throw new Error();
    } catch {
      errors.sourceUrl =
        "Use a complete https:// page address without login details.";
    }
  }
  return errors;
}

export default function ContactForm({ onSuccess }) {
  const [params] = useSearchParams();
  const initialSubject =
    contactSubjects.find(
      (subject) => subject.label === params.get("subject"),
    ) || contactSubjects[0];
  const [subject, setSubject] = useState(initialSubject.label);
  const [fields, setFields] = useState({
    name: "",
    email: "",
    website: "",
    sourceUrl: (params.get("source") || "").slice(0, 2048),
    message: initialSubject.template,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);
  const successRef = useRef(null);
  const uid = useId();
  const fieldId = (name) => `${uid}-${name}`;

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFields((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => ({ ...previous, [name]: "" }));
  }
  function handleBlur(event) {
    const { name } = event.target;
    setFieldErrors((previous) => ({
      ...previous,
      [name]: validate(fields)[name] || "",
    }));
  }
  function changeSubject(value) {
    const previousTemplate = contactSubjects.find(
      (item) => item.label === subject,
    )?.template;
    const nextTemplate =
      contactSubjects.find((item) => item.label === value)?.template || "";
    setSubject(value);
    setFields((previous) => ({
      ...previous,
      message:
        !previous.message || previous.message === previousTemplate
          ? nextTemplate
          : previous.message,
    }));
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    const errors = validate(fields);
    setFieldErrors(errors);
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      formRef.current?.elements.namedItem(firstError)?.focus();
      return;
    }
    const payload = {
      name: fields.name.trim(),
      email: fields.email.trim(),
      message: `${subject}\n\n${fields.message.trim()}`,
      kind:
        contactSubjects.find((item) => item.label === subject)?.kind ||
        "contact",
      website: fields.website,
      sourceUrl: fields.sourceUrl.trim(),
    };
    if (JSON.stringify(payload).length > 8192) {
      setError("Please shorten your message or source link before sending.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await submitForm(
        "/api/contact",
        payload,
        "We couldn’t confirm your submission. Your details are still here; try again later or email us directly.",
      );
      setSubmitted(true);
      trackLead("contact_form", { page_path: window.location.pathname });
      trackEvent("contact_submit", {
        form_id: "contact_form",
        page_path: window.location.pathname,
      });
      onSuccess?.();
    } catch (failure) {
      setError(failure.message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted)
    return (
      <div className="contact-form contact-form-success" role="status">
        <div className="contact-form-success-icon">
          <UiIcon name="check" size={28} />
        </div>
        <h2 ref={successRef} tabIndex={-1}>
          Message received.
        </h2>
        <p>
          Your submission is in the editorial review queue. Thank you for
          helping us stay connected to the community.
        </p>
        <button
          className="journal-link"
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFields((previous) => ({ ...previous, message: "" }));
          }}
        >
          Send another message
        </button>
      </div>
    );

  return (
    <form
      ref={formRef}
      name="contact"
      data-form-id="contact_form"
      className="contact-form"
      onSubmit={handleSubmit}
      noValidate
      aria-busy={loading}
    >
      <div className="contact-form-heading">
        <p className="journal-kicker">The newsroom is listening</p>
        <h2>Send us a message.</h2>
        <p>
          Fields marked <span aria-hidden="true">*</span> are required.
        </p>
      </div>
      <div aria-hidden="true" className="contact-honeypot">
        <label htmlFor={fieldId("website")}>Website</label>
        <input
          id={fieldId("website")}
          name="website"
          tabIndex="-1"
          autoComplete="off"
          value={fields.website}
          onChange={handleChange}
        />
      </div>
      {error && (
        <div className="contact-form-error" role="alert">
          <p>{error}</p>
          <a href={`mailto:${siteConfig.email}`} className="journal-link">
            Email {siteConfig.email}
          </a>
        </div>
      )}
      <div className="form-field">
        <label htmlFor={fieldId("subject")}>What is your message about?</label>
        <select
          id={fieldId("subject")}
          value={subject}
          onChange={(event) => changeSubject(event.target.value)}
          disabled={loading}
        >
          {contactSubjects.map((item) => (
            <option key={item.label}>{item.label}</option>
          ))}
        </select>
      </div>
      <div className="contact-form-row">
        {[
          ["name", "Name", "text", "Your name", "name", 160],
          ["email", "Email", "email", "you@example.com", "email", 254],
        ].map(([name, label, type, placeholder, autoComplete, maxLength]) => (
          <div
            className={`form-field ${fieldErrors[name] ? "has-error" : ""}`}
            key={name}
          >
            <label htmlFor={fieldId(name)}>
              {label} <span aria-hidden="true">*</span>
            </label>
            <input
              id={fieldId(name)}
              name={name}
              type={type}
              required
              placeholder={placeholder}
              autoComplete={autoComplete}
              maxLength={maxLength}
              disabled={loading}
              value={fields[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(fieldErrors[name])}
              aria-describedby={
                fieldErrors[name] ? fieldId(`${name}-error`) : undefined
              }
            />
            {fieldErrors[name] && (
              <span
                id={fieldId(`${name}-error`)}
                className="field-error"
                role="alert"
              >
                {fieldErrors[name]}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className={`form-field ${fieldErrors.sourceUrl ? "has-error" : ""}`}>
        <label htmlFor={fieldId("sourceUrl")}>
          Page or source URL <span className="form-optional">(optional)</span>
        </label>
        <input
          id={fieldId("sourceUrl")}
          name="sourceUrl"
          type="url"
          inputMode="url"
          placeholder="https://"
          autoComplete="url"
          maxLength={2048}
          disabled={loading}
          value={fields.sourceUrl}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={Boolean(fieldErrors.sourceUrl)}
          aria-describedby={
            fieldErrors.sourceUrl ? fieldId("sourceUrl-error") : undefined
          }
        />
        {fieldErrors.sourceUrl && (
          <span
            id={fieldId("sourceUrl-error")}
            className="field-error"
            role="alert"
          >
            {fieldErrors.sourceUrl}
          </span>
        )}
      </div>
      <div className={`form-field ${fieldErrors.message ? "has-error" : ""}`}>
        <label htmlFor={fieldId("message")}>
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          rows={7}
          placeholder="Share your news tip, question or feedback. Include the details and sources we should check."
          required
          maxLength={5000}
          disabled={loading}
          value={fields.message}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={[
            fieldId("message-help"),
            fieldErrors.message && fieldId("message-error"),
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <span id={fieldId("message-help")} className="form-hint">
          Please avoid sharing sensitive personal information.
        </span>
        {fieldErrors.message && (
          <span
            id={fieldId("message-error")}
            className="field-error"
            role="alert"
          >
            {fieldErrors.message}
          </span>
        )}
      </div>
      <div className="form-footer">
        <button type="submit" className="journal-button" disabled={loading}>
          {loading ? "Sending…" : "Send message"}
          <UiIcon />
        </button>
        <p className="form-privacy">
          We use your details to review and respond to your message.{" "}
          <Link className="journal-link" to="/privacy">
            Privacy policy
          </Link>
        </p>
      </div>
    </form>
  );
}

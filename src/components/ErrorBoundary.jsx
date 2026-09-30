import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Could not display the page:", error, errorInfo);
  }

  componentDidUpdate(previousProps) {
    if (this.state.hasError && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    const Container = this.props.inline ? "section" : "main";
    const theme =
      typeof document !== "undefined"
        ? document.documentElement.dataset.theme
        : "light";
    return (
      <Container
        className={`${this.props.inline ? "" : `journal-root is-${theme || "light"} `}journal-error`}
      >
        <div className="journal-error-content" role="alert">
          <p className="journal-kicker">Let’s get you back on track</p>
          <h1>This page couldn’t load.</h1>
          <p>
            Try reloading the page. If the problem continues, you can browse the
            latest news or contact us for help.
          </p>
          <div className="journal-actions">
            <button
              className="journal-button"
              type="button"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
            <a className="journal-link" href="/news">
              Browse local news
            </a>
            <a className="journal-link" href="/contact">
              Contact us
            </a>
          </div>
        </div>
      </Container>
    );
  }
}

import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error("Page error:", error);
  }

  render() {
    if (this.state.failed) {
      return (
        <section className="section page-offset text-center">
          <div className="container">
            <h1 className="mb-3">Something went wrong</h1>
            <p className="text-muted mb-4">
              The page could not be shown. Please reload, or go back to the home page.
            </p>
            <button type="button" className="btn btn-brand me-2" onClick={() => window.location.reload()}>
              Reload page
            </button>
            <a href="/" className="btn btn-outline-brand">Back to Home</a>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}

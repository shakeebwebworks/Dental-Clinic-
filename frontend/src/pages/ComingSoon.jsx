import { Link } from "react-router-dom";

export default function ComingSoon({ title }) {
  const notFound = title === "Page not found";
  return (
    <section className="section page-offset text-center">
      <div className="container">
        <h1 className="mb-3">{title}</h1>
        <p className="text-muted mb-4">
          {notFound ? "Sorry, we could not find the page you were looking for." : "This page is coming soon."}
        </p>
        <Link to="/" className="btn btn-brand">Back to Home</Link>
      </div>
    </section>
  );
}

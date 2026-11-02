import { Link } from "react-router-dom";

export default function ComingSoon({ title }) {
  return (
    <section className="section page-offset text-center">
      <div className="container">
        <h1 className="mb-3">{title}</h1>
        <p className="text-muted mb-4">This page is built in the next phase.</p>
        <Link to="/" className="btn btn-brand">Back to Home</Link>
      </div>
    </section>
  );
}

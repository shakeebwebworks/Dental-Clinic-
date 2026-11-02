import { Link } from "react-router-dom";

export default function PageHeader({ title, subtitle }) {
  return (
    <section className="page-header">
      <div className="container">
        <nav aria-label="Breadcrumb" className="crumbs">
          <Link to="/">Home</Link> <span>/</span> <span>{title}</span>
        </nav>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}

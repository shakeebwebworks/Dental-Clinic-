import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import OverviewPanel from "../components/dashboard/OverviewPanel";
import AppointmentsPanel from "../components/dashboard/AppointmentsPanel";
import EnquiriesPanel from "../components/dashboard/EnquiriesPanel";
import ReviewsPanel from "../components/dashboard/ReviewsPanel";
import useAuth from "../hooks/useAuth";

const tabs = [
  ["overview", "Overview", OverviewPanel],
  ["appointments", "Appointments", AppointmentsPanel],
  ["enquiries", "Enquiries", EnquiriesPanel],
  ["reviews", "Reviews", ReviewsPanel],
];

export default function Dashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState("overview");
  const Panel = tabs.find(([key]) => key === active)[2];

  return (
    <>
      <PageHeader title="Staff Dashboard" subtitle={`Signed in as ${user.username}`} />
      <section className="section">
        <div className="container">
          <div className="dash-tabs" role="group" aria-label="Dashboard sections">
            {tabs.map(([key, label]) => (
              <button key={key} type="button" aria-pressed={active === key}
                className={`dash-tab ${active === key ? "active" : ""}`} onClick={() => setActive(key)}>
                {label}
              </button>
            ))}
          </div>
          <Panel />
        </div>
      </section>
    </>
  );
}

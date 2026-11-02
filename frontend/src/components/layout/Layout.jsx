import { Suspense, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingActions from "../common/FloatingActions";
import PageMeta from "../common/PageMeta";
import ErrorBoundary from "../common/ErrorBoundary";
import DataState from "../common/DataState";

export default function Layout() {
  const { pathname } = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Move keyboard / screen-reader focus to the new page content.
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <PageMeta />
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main" tabIndex={-1}>
        <ErrorBoundary key={pathname}>
          <Suspense
            fallback={
              <div className="page-loading">
                <DataState loading>{null}</DataState>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}

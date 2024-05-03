import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MyProvider } from "./component/ContextAPI";
import JestTesting from "./component/JestTesting";

const ShowContext = lazy(() => import("./component/ShowContext"));
const ErrorBoundaries = lazy(() => import("./component/ErrorBoundaries"));
const Navbar = lazy(() => import("./component/Navbar"));
const UseMemo = lazy(() => import("./component/UseMemo"));
const UseCallback = lazy(() => import("./component/UseCallback"));
const Debounce = lazy(() => import("./component/Debounce"));

// import ShowContext from "./component/ShowContext";
// import ErrorBoundaries from "./component/ErrorBoundaries";
// import Navbar from "./component/Navbar";
// import UseMemo from "./component/UseMemo";
// import UseCallback from "./component/UseCallback";

function App() {
  return (
    <MyProvider>
     
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<div>Loading…</div>}>
                <ShowContext />
              </Suspense>
            }
          />
          <Route
            path="/error"
            element={
              <Suspense fallback={<div>Loading…</div>}>
                <ErrorBoundaries />
              </Suspense>
            }
          />
          <Route
            path="/memo"
            element={
              <Suspense fallback={<div>Loading…</div>}>
                <UseMemo />
              </Suspense>
            }
          />
          <Route
            path="/callback"
            element={
              <Suspense fallback={<div>Loading…</div>}>
                <UseCallback />
              </Suspense>
            }
          />
          <Route
            path="/debounce"
            element={
              <Suspense fallback={<div>Loading…</div>}>
                <Debounce />
              </Suspense>
            }
          />

          <Route
            path="/jestTesting"
            element={
              <Suspense fallback={<div>Loading…</div>}>
                <JestTesting />
              </Suspense>
            }
          />
        </Routes>
      </Router>
    </MyProvider>
  );
}

export default App;

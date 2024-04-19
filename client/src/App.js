import './App.css';
import {Fragment} from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Routes,
} from "react-router-dom";

import ShowEmployee from './component/ShowEmployee';
import AddEmployee from './component/AddEmployee';

function App() {
  return (
    <Fragment>
    <Router>
      <Routes>
        <Route
          path="/"
          element={<ShowEmployee />}
        />
        <Route
          path="/add"
          element={<AddEmployee />}
        />
        <Route
          path="/edit/:id"
          element={<AddEmployee />}
        />
      </Routes>
    </Router>
  </Fragment>
  );
}

export default App;

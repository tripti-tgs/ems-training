import React, { useContext } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/error">Error</Link>
        </li>
        <li>
          <Link to="/memo">UseMemo</Link>
        </li>
        <li>
          <Link to="/callback">Callback</Link>
        </li>
        <li>
          <Link to="/debounce">Debounce</Link>
        </li>
        <li>
          <Link to="/jestTesting">Jest Testing</Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;

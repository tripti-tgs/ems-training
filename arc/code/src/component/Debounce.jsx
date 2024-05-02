import React, { useState } from "react";
const _ = require("lodash");

function Debounce() {
  const [num, setNumber] = useState(0);
  let debounce_fun = _.debounce(function () {
    setNumber(num + 1);
  }, 4000);

  debounce_fun();
  return (
    <div>
      <h1>Function debounced after 4000ms! {num}</h1>
    </div>
  );
}

export default Debounce;

import React, { useState, useMemo } from "react";

function UseMemo() {
  const [number, setNumber] = useState(1);
  const [inc, setInc] = useState(0);
  const factorial = useMemo(() => factorialOf(number), [number]);

  const onChange = (e) => {
    setNumber(Number(e.target.value));
  };
  const onClick = () => {
    setInc((i) => i + 1);
  };
  
  return (
    <div>
    <h1>{inc}</h1>
      <input tpye="number" value={number} onChange={onChange} /> = {factorial}
      <button onClick={onClick}>Render again</button>
    </div>
  );
}
function factorialOf(n) {
  console.log("called");
  return n <= 0 ? 1 : n * factorialOf(n - 1);
}

export default UseMemo;

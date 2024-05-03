import React, { useState, useEffect } from "react";

function Bomb() {
  const [num, setNumber] = useState(0);

  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      if (i == 5) {
        throw new Error("add user");
      }
      setNumber(i);
    }
  }, []); 

  return (
    <>
      <h1>{num}</h1>
    </>
  );
}

export default Bomb;

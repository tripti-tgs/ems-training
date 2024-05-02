import React, { useState, useCallback } from "react";
import ChildUseCallback from "./ChildUseCallback";

function UseCallback() {
  const [count, setCount] = useState(0);
  const memoizedCallback = useCallback(() => {
    console.log("bye");
    return 1;
  }, []);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <h2>{count}</h2>

      <ChildUseCallback value={memoizedCallback()} />
    </div>
  );
}

export default UseCallback;

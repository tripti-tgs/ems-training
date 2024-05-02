import React,{useState} from 'react'

function ChildUseCallback({value}) {
    const [count, setCount] = useState(value);
    console.log("child")
  return (
    <div>
             <button onClick={() => setCount(count+1)}>Increment</button>
            <button onClick={() => setCount(count-1)}>Decrement</button>
            <h2>{count}</h2>
    </div>
  )
}

export default ChildUseCallback
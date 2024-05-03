import React, { useState } from 'react';

function ErrorBoundary({ children }) {
  const [error, setError] = useState(false);
  const [info, setInfo] = useState(null);

  const componentDidCatch = (error, info) => {
    console.log(error, info);
    setError(true);
    setInfo(info);
  };

  if (error) {
    return (
      <div>
        <h2>There was an error</h2>
        <pre>{info.componentStack}</pre>
      </div>
    );
  }

  return children;
}

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };

  const decrement = () => {
    setCount(prevCount => prevCount - 1);
  };

  if (count > 5) {
    throw new Error('Counter crashed. Integer overflow.');
  }

  return (
    <div style={{ margin: '2rem 0' }}>
      <button className="btn btn-primary" onClick={decrement}>
        -
      </button>
      <span style={{ display: 'inlineBlock', margin: '0 1rem' }}>
        {count}
      </span>
      <button className="btn btn-primary" onClick={increment}>
        +
      </button>
    </div>
  );
}

function ErrorBoundaries() {
  return (
    <div className="container m-5">
      <h1>Error Bounds</h1>
      <p>A very simple demo on error boundaries in react 16.</p>
      <hr />
      <p>This counter throws an error but isn't caught by the error boundary. This crashes the entire app 🙃</p>
      <Counter />
      <hr />
      <p>This counter throws an error and is caught by the error boundary.</p>
      <ErrorBoundary>
        <Counter />
      </ErrorBoundary>
      <hr />
      <p>If either one of these counters throw an error, the error boundary catches and displays the ui in place of both counters.</p>
      <ErrorBoundary>
        <Counter />
        <Counter />
      </ErrorBoundary>
    </div>
  );
}

export default ErrorBoundaries;

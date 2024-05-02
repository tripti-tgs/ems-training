import React,{useState} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Bomb from './Bomb';
import ErrorFallback from './ErrorFallback';

function ErrorBoundaries() {
    const [explode, setExplode] = useState(false);

  return (
    <div>
    <button onClick={() => setExplode(prev => !prev)}>toggle explode</button>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => setExplode(false)}
      resetKeys={[explode]}
    >
      {explode && <Bomb />}
    </ErrorBoundary>
  </div>
  )
}

export default ErrorBoundaries;
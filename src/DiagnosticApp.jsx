// Simple diagnostic page to verify React is working
// Replace App.jsx temporarily with this to test

import { useState } from 'react';

function DiagnosticApp() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: 'green' }}>? React is Working!</h1>
      
      <div style={{ marginTop: '20px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h2>Diagnostic Information:</h2>
        
        <p><strong>React:</strong> {useState ? '? Loaded' : '? Not Loaded'}</p>
        
        <p><strong>State Management:</strong> 
          <button 
            onClick={() => setCount(count + 1)}
            style={{ 
              marginLeft: '10px', 
              padding: '5px 15px',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Count: {count}
          </button>
        </p>

        <p><strong>localStorage:</strong> {
          typeof window !== 'undefined' && window.localStorage ? '? Available' : '? Not Available'
        }</p>

        <p><strong>Window size:</strong> {
          typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown'
        }</p>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', background: '#fef3c7', borderRadius: '8px' }}>
        <h3>If you see this page:</h3>
        <ol>
          <li>React is working correctly ?</li>
          <li>The build system is working ?</li>
          <li>The problem is in the FTC AutoConfig app itself</li>
        </ol>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Next Steps:</h3>
        <ol>
          <li>Restore the original App.jsx</li>
          <li>Open browser console (F12)</li>
          <li>Look for error messages</li>
          <li>Check if CSS is loading in Network tab</li>
        </ol>
      </div>
    </div>
  );
}

export default DiagnosticApp;

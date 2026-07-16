import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '360px',
        height: '100vh',
        margin: '0 auto',
        fontFamily: 'Manrope, sans-serif',
        backgroundColor: '#ffffff'
      }}>
        <h1 style={{ fontSize: '18px', color: '#989898', fontWeight: 500 }}>
          V_O 프로젝트 작업 중...
        </h1>
      </div>
    </Router>
  );
}
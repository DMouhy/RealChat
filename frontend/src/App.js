import React from 'react';
import './App.css';
import MainApp from './Pages/MainApp';
import LogSign from './Pages/LogSign';

function App() {
  
  const isConnected = !!localStorage.getItem('token') || false;

  return (
    <div className="app">
      { isConnected ? <MainApp /> : <LogSign /> }
    </div>
  );
}

export default App;

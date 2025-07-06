import React from 'react';
import './globals.css';
import Navbar from '../components/navbar/navbar';

export default function App() {
  return (
    <div className="text-3xl text-center bg-white w-full h-screen text-black">
      <Navbar />
      Personal Finance Tracker
    </div>
  );
}

import React from 'react';
import './globals.css';
import Navbar from '../components/navbar/navbar';

export default function App() {
  return (
    <div className="text-3xl text-center bg-white w-full h-screen text-black">
      <Navbar />
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="text-4xl font-bold">Welcome to FinTrack</h1>
        {/* <p className="mt-4 text-lg">Your personal finance tracker</p>
        <p className="mt-2 text-sm text-gray-600">Track your expenses and manage your finances with ease.</p> */}
        <h1>Dashboard coming soon...</h1>
        <h3>Step 1: Basic Transaction Tracking implemented successfully.<br /> Please click <a href="/transactions" className='text-blue-500'>here</a> to access it</h3>
        {/* <h5>Step 2: Categories In progress</h5> */}
      </div>
    </div>
  );
}

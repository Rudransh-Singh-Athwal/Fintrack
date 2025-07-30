"use client";
import Navbar from "@/src/components/navbar/navbar";
import axios from "axios";
import React, { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function TransactionsPage() {
  return (
    <div className="text-3xl text-center bg-white w-full h-screen">
      <Navbar />
      <div className="flex flex-col items-center mt-10">
        <div className="w-[60%] flex flex-col items-center">
          <div className="flex justify-around text-nowrap w-full">
            <h1 className="w-full text-4xl font-bold text-gray-800 mb-6 py-3 text-start">
              Reports
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

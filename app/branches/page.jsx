"use client";
import { useEffect, useState } from "react";
import axios from 'axios';
import Link from "next/link";

export default function BranchesPage() {
    const [branchRows, setBranchRows] = useState([]);

    const fetchBranches = () => {
  axios.get('http://localhost:5000/api/branches')
    .then((res) => {
      setBranchRows(res.data);
    })
    .catch(() => {
      console.log("Өгөгдөл авахад алдаа гарлаа");
    });
};
console.log('branchRows', branchRows);
  useEffect(() => {
  fetchBranches();
}, []);
  return (
    <div className="flex flex-col items-center min-h-screen bg-cover bg-center py-8">
      <h1 className="text-2xl font-bold mb-8">Салбар сонгох</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
  {branchRows.map((branch) => (
    <Link
      key={branch._id}
      href={`/branches/${branch._id}`}
      className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-2 cursor-pointer hover:shadow-lg transition"
    >
      <div className="font-semibold text-lg">
        {branch.number} - {branch.location}
      </div>

    </Link>
  ))}
  </div>
</div>
  );
}
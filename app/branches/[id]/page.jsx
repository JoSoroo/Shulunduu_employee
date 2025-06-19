"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ShiftEmployeeList from "@/app/admin/components/shift/ShiftEmployeeList";

export default function BranchPage() {
  const { id } = useParams();
  const [branch, setBranch] = useState(null);
  const [shifts, setShifts] = useState([]);
  console.log('shifts', shifts);
  console.log('id', id);
  useEffect(() => {
    console.log('id', id);
    if (!id) return;
    axios.get(`http://localhost:5000/api/shifts/branch/${id}`)
      .then((res) => setShifts(res.data))
      .catch(() => setShifts([]));
  }, [id]);

  if (!branch) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Салбарын мэдээлэл уншиж байна...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-cover bg-center py-8">
      <h1 className="text-2xl font-bold mb-4">
        Салбар: {branch.row ? `${branch.row[0]} - ${branch.row[1]}` : branch.name || "-"}
      </h1>
      <div className="mb-8">
        <div><span className="font-medium">Утас:</span> {branch.row ? branch.row[2] : branch.phone || "-"}</div>
        <div><span className="font-medium">Байршил:</span> {branch.row ? branch.row[3] : branch.location || "-"}</div>
      </div>
      <h2 className="text-xl font-semibold mb-4">Ээлжийн мэдээлэл</h2>
      {shifts.length === 0 ? (
        <div>Ээлжийн мэдээлэл алга</div>
      ) : (
        shifts.map((shift) => (
          <div key={shift._id} className="w-full max-w-2xl mb-8">
            <div className="bg-primary text-white rounded-t-lg px-6 py-3 text-lg font-bold">
              {shift.date?.slice(0, 10) || "Огноо байхгүй"} — {shift.shiftType || ""}
            </div>
            <div className="bg-white rounded-b-lg shadow p-6">
              <ShiftEmployeeList details={shift.details || []} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
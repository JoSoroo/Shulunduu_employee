"use client";
import * as React from "react";
import { useEffect, useState } from "react";
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import Avatar from "@mui/material/Avatar";
// import Stack from "@mui/material/Stack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast, ToastContainer } from "react-toastify";
import DeleteItems from "../../components/delete/deleteItems";
import { useAuth } from "../../context/authContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import ShiftButton from "../../components/shift/ShiftButton";
export default function ShiftCard({ shiftType, shifts, onDelete }) {
  console.log("ShiftCard rendered with shiftType:", shiftType, "shifts:", shifts);
  // const { user } = useAuth();
  // const [shifts, setShifts] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteIndex, setSelectedDeleteIndex] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEditData, setSelectedEditData] = useState(null);

  const handleToggle = () => {
    setShowDetails((prev) => !prev);
  };

  const today = new Date().toLocaleDateString("sv-SE");
  console.log("Shifts", shifts);
  console.log("today:", today);
  const filtered = shifts?.filter(
    (s) =>
      new Date(s.date).toLocaleDateString("sv-SE") === today &&
      s.shiftType === shiftType
  );
  const confirmDelete = () => {
    const shiftId = selectedDeleteIndex;

    if (!shiftId) {
      toast.error("Устгах ID олдсонгүй.");
      return;
    }

    axios
      .delete(`http://localhost:5000/api/shifts/${shiftId}`)
      .then((res) => {
        toast.success(res.data.message);
        if (onDelete) {
          onDelete();
        }
      })
      .catch((error) => {
        console.error("Delete error:", error);
        toast.error("Устгах үед алдаа гарлаа");
      })
      .finally(() => {
        setDeleteDialogOpen(false);
        setSelectedDeleteIndex(null);
      });
  };

  const handleDelete = (shiftId) => {
    console.log("Attempting to delete shift with ID:", shiftId);
    console.log("Current filtered data:", filtered);

    if (!shiftId) {
      toast.error("Устгах ID олдсонгүй.");
      return;
    }
    setSelectedDeleteIndex(shiftId);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (shiftData) => {
    setSelectedEditData(shiftData);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setSelectedEditData(null);
    if (onDelete) {
      onDelete();
    }
  };

  // Reset edit state when dialog is closed
  useEffect(() => {
    if (!editDialogOpen) {
      setSelectedEditData(null);
    }
  }, [editDialogOpen]);

  console.log("filtered", filtered);
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{shiftType}</CardTitle>
        <CardDescription>Ээлжийн ажилчид</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
          {filtered.length > 0 ? (
            filtered[0].details.map((emp, index) => (
              <Avatar key={index}>
                <AvatarImage src={emp.image || ""} alt={emp.name} />
                <AvatarFallback>{emp.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            ))
          ) : (
            <div>Мэдээлэл алга</div>
          )}
        </div>

        <div className="m-2 flex items-center gap-1">
          <CalendarMonthIcon />
          {today}
        </div>

        {/* ✅ Table-г энд оруулна */}
        {showDetails && filtered.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Нэр</th>
                  <th className="px-4 py-2">Утас</th>
                  <th className="px-4 py-2">Албан тушаал</th>
                </tr>
              </thead>
              <tbody>
                {filtered[0].details.map((emp, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{emp.name}</td>
                    <td className="px-4 py-2">{emp.phone}</td>
                    <td className="px-4 py-2">{emp.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ❗ td биш div ашиглана */}
            <div className="mt-4 flex gap-2">
              {/* <ShiftButton data={filtered[0].details} /> */}
              {filtered[0]?.id ? (
                <>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(filtered[0].id)}
                  >
                    Устгах
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(filtered[0])}
                  >
                    Ээлж засах
                  </Button>
                </>
              ) : null}
              <DeleteItems
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
              />
              <ShiftButton
                isEdit={true}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                editData={selectedEditData}
                onSuccess={handleEditSuccess}
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button type="button" className="w-full" onClick={handleToggle}>
          {showDetails ? "Нуух" : "Дэлгэрэнгүй"}
        </Button>
      </CardFooter>
    </Card>
  );
}

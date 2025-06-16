"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import TableItems from "../../components/table/Table";
import Box from "@mui/material/Box";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Typography from "@mui/material/Typography";
import { toast, ToastContainer } from "react-toastify";
import ShiftCard from "../../components/shift/ShiftCard";
import ShiftButton from "../../components/shift/ShiftButton";

import { useAuth } from "../../context/authContext";
import axios from "axios";
const shiftHeaders = [
  "Он сар өдөр",
  "Менежер ",
  "Ээлж",
  "Ажилчидын тоо",
  "Дэлгэрэнгүй",
];
export default function ShiftPage() {
  const [shift, setShift] = useState([]);
  const [tableShifts, setTableShifts] = useState([]);
  const { user } = useAuth();
  const fetchShifts = () => {
    if (!user || !user.token) return;

    axios
      .get(`http://localhost:5000/api/shifts`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const formattedData = res.data.map((shift) => {
          const employeeRoles = [
            "manager",
            "chef",
            "waiter",
            "security",
            "cleaner",
          ];
          const employeeDetails = employeeRoles.map((role) => {
            const emp = shift.employees?.[role];
            const img = emp?.img?.data?.data
              ? `data:${emp.img.contentType};base64,${Buffer.from(
                  emp.img.data.data
                ).toString("base64")}`
              : null;

            return emp
              ? {
                  role,
                  name: emp.name,
                  phone: emp.phone,
                  position: emp.position,
                  image: img,
                }
              : {
                  role,
                  name: "Тодорхойгүй",
                  phone: "-",
                  position: role,
                  image: null,
                };
          });

          // 🔍 Менежерийн нэрийг тусад нь олох
          const managerInfo = employeeDetails.find((e) => e.role === "manager");

          return {
            id: shift._id,
            date: shift.date?.slice(0, 10) || "Огноо байхгүй",
            manager: managerInfo?.name || "Тодорхойгүй",
            shiftType: shift.shiftType || "Shift төрөл алга",
            employeeCount: employeeDetails.filter(
              (e) => e.name !== "Тодорхойгүй"
            ).length,
            details: employeeDetails,
          };
        });

        // 📄 Хүснэгтэд тохируулах
        const tableFormatted = formattedData.map((item) => ({
          id: item.id,
          row: [
            item.date,
            item.manager, // ✅ зөвхөн менежерийн нэр
            item.shiftType,
            item.employeeCount,
            item.details,
          ],
        }));

        setShift(formattedData); // Бүх мэдээлэл хадгалах
        setTableShifts(tableFormatted); // Зөвхөн хүснэгтэнд харагдах
        console.log("Table", tableFormatted);
      })
      .catch((err) => {
        console.log("Shift авахад алдаа:", err);
      });
  };

  useEffect(() => {
    if (user && user.token) {
      fetchShifts();
    }
  }, [user]);
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "white",
          p: 5,
        }}
      >
        <ToastContainer />
        <Typography>Ээлжийн мэдээлэл</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <ShiftCard shiftType="Өглөөний ээлж" shifts={shift} onDelete={fetchShifts} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <ShiftCard shiftType="Оройн ээлж" shifts={shift} onDelete={fetchShifts} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <ShiftButton onSuccess={fetchShifts} />

            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>Нийт ажилчид</CardTitle>
                <CardDescription>Өнөөдөр ажилсан ажилчид</CardDescription>
              </CardHeader>
              <CardContent>8555</CardContent>
            </Card>
          </Box>
        </Box>
        <TableItems
          caption="Салбаруудын жагсаалт"
          headers={shiftHeaders}
          rows={tableShifts}
          // onEdit={handleEdit}
          // onDelete={handleDelete}
        />
      </Box>

      {/* <DeleteItems
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      /> */}
    </ProtectedRoute>
  );
}

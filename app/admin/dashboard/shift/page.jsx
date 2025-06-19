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
  console.log("ShiftPage component rendered");
  const [shift, setShift] = useState([]);
  const [tableShifts, setTableShifts] = useState([]);
  const { user } = useAuth();
  const [totalEmployees, setTotalEmployees] = useState(0);

  const fetchShifts = () => {
    if (!user || !user.token) return;
    console.log("fetchShifts called with user:", user);

    axios
      .get(`http://localhost:5000/api/shifts`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("Raw shift data from API:", res.data);
        const formattedData = res.data.map((shift) => {
          console.log("Processing shift:", shift);
          console.log("Shift employees field:", shift.employees);
          console.log("Shift roles field:", shift.roles);
          
          // Convert Mongoose Map to JavaScript Map if needed
          const employeesMap = shift.employees instanceof Map ? 
            shift.employees : 
            new Map(Object.entries(shift.employees || {}));
          
          console.log("Employees map:", employeesMap);
          console.log("Employees map entries:", Array.from(employeesMap.entries()));
          
          // Get employee details for each role
          let employeeDetails = [];
          
          if (shift.roles && shift.roles.length > 0) {
            // New format with dynamic roles
            employeeDetails = shift.roles.map((role) => {
              console.log("Processing role:", role);
              const employeeId = employeesMap.get(role.name);
              console.log("Employee ID for role", role.name, ":", employeeId);
              
              // Find employee in the employees map
              const employee = employeeId;
              console.log("Found employee:", employee);
              
              const img = employee?.img?.data?.data
                ? `data:${employee.img.contentType};base64,${Buffer.from(
                    employee.img.data.data
                  ).toString("base64")}`
                : null;

              return employee
                ? {
                    role: role.name,
                    name: employee.name,
                    phone: employee.phone,
                    position: employee.position?.name || employee.position,
                    image: img,
                  }
                : {
                    role: role.name,
                    name: "Тодорхойгүй",
                    phone: "-",
                    position: role.name,
                    image: null,
                  };
            });
          } else {
            // Old format with hardcoded roles
            const hardcodedRoles = ['manager', 'chef', 'waiter', 'security', 'cleaner'];
            const roleToPosition = {
              manager: "Менежер",
              chef: "Тогооч",
              waiter: "Зөөгч",
              security: "Хамгаалагч",
              cleaner: "Үйлчлэгч",
            };
            
            employeeDetails = hardcodedRoles.map((roleKey) => {
              const employee = employeesMap.get(roleKey);
              console.log("Processing hardcoded role:", roleKey, "employee:", employee);
              
              const img = employee?.img?.data?.data
                ? `data:${employee.img.contentType};base64,${Buffer.from(
                    employee.img.data.data
                  ).toString("base64")}`
                : null;

              return employee
                ? {
                    role: roleToPosition[roleKey] || roleKey,
                    name: employee.name,
                    phone: employee.phone,
                    position: employee.position?.name || employee.position,
                    image: img,
                  }
                : {
                    role: roleToPosition[roleKey] || roleKey,
                    name: "Тодорхойгүй",
                    phone: "-",
                    position: roleToPosition[roleKey] || roleKey,
                    image: null,
                  };
            });
          }

          console.log("Employee details:", employeeDetails);

          // Find manager info
          const managerInfo = employeeDetails.find((e) => e.role === "Менежер");

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

        console.log("Formatted data:", formattedData);

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
        console.log("Table formatted:", tableFormatted);
      })
      .catch((err) => {
        console.log("Shift авахад алдаа:", err);
      });
  };

  const fetchTotalEmployees = () => {
    if (!user || !user.token) return;
    
    axios
      .get("http://localhost:5000/api/employees/count", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setTotalEmployees(res.data.count);
      })
      .catch((error) => {
        console.error("Error fetching total employees:", error);
      });
  };

  useEffect(() => {
    console.log("Shift page useEffect called, user:", user);
    if (user && user.token) {
      console.log("Calling fetchShifts...");
      fetchShifts();
    } else {
      console.log("User or token not available");
    }
  }, [user]);

  useEffect(() => {
    if (user && user.token) {
      fetchTotalEmployees();
    }
  }, [user]);

  console.log("ShiftPage before return - shift state:", shift);
  console.log("ShiftPage before return - tableShifts state:", tableShifts);

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
                <CardDescription>Бүртгэлтэй ажилчид</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEmployees}</div>
              </CardContent>
            </Card>
          </Box>
        </Box>
        <TableItems
          caption="Салбаруудын жагсаалт"
          headers={shiftHeaders}
          rows={tableShifts}
          tableType="shifts"
        />
      </Box>
    </ProtectedRoute>
  );
}

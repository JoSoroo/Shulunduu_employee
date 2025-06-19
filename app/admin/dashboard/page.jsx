"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Image from "next/image";
import ad1 from "./images/ad1.jpg";
import ad2 from "./images/ad2.jpg";

export default function Home() {
  console.log("Dashboard component rendered");
  const [shifts, setShifts] = useState([]);
  const [currentView, setCurrentView] = useState("ad1"); // ad1, ad2, or shift
  const { user } = useAuth();

  const advertisements = [
    {
      id: "ad1",
      image: ad1,
      duration: 3000, // 3 seconds
    },
    {
      id: "ad2",
      image: ad2,
      duration: 3000, // 3 seconds
    },
  ];

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

        setShifts(formattedData); // Бүх мэдээлэл хадгалах
        console.log("Shifts set:", formattedData);
      })
      .catch((err) => {
        console.log("Shift авахад алдаа:", err);
      });
  };

  useEffect(() => {
    console.log("Dashboard useEffect called, user:", user);
    if (user && user.token) {
      console.log("Calling fetchShifts from dashboard...");
      fetchShifts();
    } else {
      console.log("User or token not available in dashboard");
    }
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentView((prev) => {
        if (prev === "ad1") return "ad2";
        if (prev === "ad2") return "shift";
        return "ad1";
      });
    }, currentView === "shift" ? 5000 : 3000); // 5 seconds for shift, 3 seconds for ads

    return () => clearInterval(timer);
  }, [currentView]);

  const today = new Date().toLocaleDateString("sv-SE");
  const currentHour = new Date().getHours();
  
  const todayShifts = shifts.filter((s) => {
    const isToday = s.date === today;
    if (!isToday) return false;

    if (currentHour < 12) {
      return s.shiftType === "Өглөөний ээлж";
    }
    return s.shiftType === "Оройн ээлж";
  });

  const renderContent = () => {
    if (currentView === "ad1" || currentView === "ad2") {
      const ad = advertisements.find((a) => a.id === currentView);
      return (
        <div className="fixed inset-0 w-full h-full">
          <Image
            src={ad.image}
            alt="Advertisement"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={100}
          />
        </div>
      );
    }

    return (
      <div className="relative w-full h-screen flex flex-col justify-center items-center bg-background px-6">
        <div className="flex items-center gap-4 text-muted-foreground mb-8 text-2xl">
          <CalendarMonthIcon className="w-8 h-8" />
          <span>{today}</span>
          <span className="ml-4 font-semibold">
            {currentHour < 12 ? "Өглөөний ээлж" : "Оройн ээлж"}
          </span>
        </div>

        <div className="w-full max-w-[1600px] h-full">
          {todayShifts.map((shift) => (
            <Card key={shift.id} className="w-full h-full flex flex-col mb-8">
              <CardHeader className="bg-primary text-white text-center h-[100px] flex items-center justify-center">
                <CardTitle className="text-4xl">{shift.shiftType}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-8">
                <div className="flex flex-wrap gap-6 justify-center">
                  {shift.details.map((emp, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-6 p-6 bg-white rounded-xl border shadow-md w-[400px]"
                    >
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={emp.image || ""} alt={emp.name} />
                        <AvatarFallback className="text-xl font-bold">{emp.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xl font-semibold">{emp.name}</p>
                        <p className="text-base text-muted-foreground">{emp.position}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen">
      {renderContent()}
    </div>
  );
}
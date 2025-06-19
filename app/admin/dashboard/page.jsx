"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Image from "next/image";
import ShiftEmployeeList from "../components/shift/ShiftEmployeeList";

export default function Home() {
  console.log("Dashboard component rendered");
  const [shifts, setShifts] = useState([]);
  const [reclams, setReclams] = useState([]);
  const [currentView, setCurrentView] = useState("reclam"); // reclam or shift
  const [currentReclamIndex, setCurrentReclamIndex] = useState(0);
  const [currentShift, setCurrentShift] = useState(null);
  const { user } = useAuth();

  const fetchReclams = () => {
    if (!user || !user.token) return;
    console.log("fetchReclams called with user:", user);

    axios
      .get(`http://localhost:5000/api/reclams`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("Raw reclam data from API:", res.data);
        const formattedReclams = res.data.map((reclam) => ({
          id: reclam._id,
          title: reclam.title,
          image: reclam.image
            ? `data:${reclam.image.contentType};base64,${reclam.image.data}`
            : null,
          duration: 3000, // 3 seconds per reclam
        }));

        console.log("Formatted reclam data:", formattedReclams);
        setReclams(formattedReclams);
      })
      .catch((err) => {
        console.log("Reclam авахад алдаа:", err);
      });
  };

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
        console.log("Raw shifts data:", res.data);
        setShifts(res.data);
        
        // Filter current shift based on time
        const now = new Date();
        const currentHour = now.getHours();
        const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD format

        // Find today's shift
        const todaysShifts = res.data.filter(
          (shift) => shift.date?.slice(0, 10) === currentDate
        );

        if (todaysShifts.length > 0) {
          // If before 12:00, show morning shift, else show evening shift
          const targetShift =
            currentHour < 12
              ? todaysShifts.find(
                  (shift) =>
                    shift.shiftType === "Өглөөний ээлж" ||
                    shift.shiftType === "Morning"
                )
              : todaysShifts.find(
                  (shift) =>
                    shift.shiftType === "Оройн ээлж" ||
                    shift.shiftType === "Evening"
                );

          setCurrentShift(targetShift || todaysShifts[0]); // Fallback to first shift if specific type not found
        }
      })
      .catch((err) => {
        console.log("Shift авахад алдаа:", err);
        setShifts([]);
      });
  };

  useEffect(() => {
    console.log("Dashboard useEffect called, user:", user);
    if (user && user.token) {
      console.log("Calling fetchShifts and fetchReclams from dashboard...");
      fetchShifts();
      fetchReclams();
    } else {
      console.log("User or token not available in dashboard");
    }
  }, [user]);

  // Timer for cycling through reclams
  useEffect(() => {
    const timer = setInterval(() => {
      if (reclams.length > 0) {
        setCurrentReclamIndex((prev) => (prev + 1) % reclams.length);
      }
    }, 3000); // 3 seconds for each reclam

    return () => clearInterval(timer);
  }, [reclams]);

  // Timer for switching between reclam and shift views
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentView((prev) => {
        if (prev === "reclam" && reclams.length > 0) {
          return "shift";
        } else if (prev === "shift") {
          return "reclam";
        }
        return "shift";
      });
    }, currentView === "shift" ? 5000 : 3000); // 5 seconds for shift, 3 seconds for reclam

    return () => clearInterval(timer);
  }, [currentView, reclams.length]);

  const renderContent = () => {
    if (currentView === "reclam" && reclams.length > 0) {
      const currentReclam = reclams[currentReclamIndex];
      return (
        <div className="fixed inset-0 w-full h-full">
          <Image
            src={currentReclam.image}
            alt={currentReclam.title || "Advertisement"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={100}
          />
        </div>
      );
    }

    // Shift view
    if (!currentShift) {
      return (
        <div className="flex flex-col items-center min-h-screen bg-cover bg-center py-8">
          <h1 className="text-2xl font-bold mb-4">Ээлжийн мэдээлэл</h1>
          <div className="text-lg">Өнөөдрийн ээлжийн мэдээлэл байхгүй байна</div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center min-h-screen bg-cover bg-center py-8">
        <h1 className="text-2xl font-bold mb-4">Ээлжийн мэдээлэл</h1>
        <div className="w-full max-w-6xl mb-2">
          <div className="bg-primary text-white rounded-t-lg px-6 py-3 text-lg font-bold">
            {currentShift.date?.slice(0, 10) || "Огноо байхгүй"} —{" "}
            {currentShift.shiftType || ""}
          </div>
          <div className="bg-white rounded-b-lg shadow">
            <ShiftEmployeeList
              employees={currentShift.employees || {}}
              roles={currentShift.roles || []}
            />
          </div>
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

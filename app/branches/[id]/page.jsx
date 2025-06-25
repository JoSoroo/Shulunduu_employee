"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ShiftEmployeeList from "@/app/admin/components/shift/ShiftEmployeeList";
import Image from "next/image";

export default function BranchPage() {
  const { id } = useParams();
  const [shifts, setShifts] = useState([]);
  const [reclams, setReclams] = useState([]);
  const [currentShift, setCurrentShift] = useState(null);
  const [currentView, setCurrentView] = useState("reclam"); // "reclam" or "shift"
  const [currentReclamIndex, setCurrentReclamIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchReclams = () => {
    axios
      .get("http://localhost:5000/api/reclams")
      .then((res) => {
        const formatted = res.data.map((reclam) => ({
          id: reclam._id,
          title: reclam.title,
          image: reclam.image
            ? `data:${reclam.image.contentType};base64,${reclam.image.data}`
            : null,
          video: reclam.video
            ? `data:${reclam.video.contentType};base64,${reclam.video.data}`
            : null,
          duration: 3000,
        }));
        setReclams(formatted);
      })
      .catch((err) => console.error("Reclam авахад алдаа:", err));
  };

  useEffect(() => {
    if (!id) return;

    fetchReclams();

    axios
      .get(`http://localhost:5000/api/shifts/today/${id}`)
      .then((res) => {
        setShifts(res.data);
        const now = new Date();
        const currentHour = now.getHours();
        const currentDate = now.toISOString().split("T")[0];

        const todaysShifts = res.data.filter(
          (shift) => shift.date?.slice(0, 10) === currentDate
        );

        if (todaysShifts.length > 0) {
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

          setCurrentShift(targetShift || todaysShifts[0]);
        }
      })
      .catch(() => setShifts([]))
      .finally(() => setLoading(false));
  }, [id]);

  // Нэг удаа reclam -> shift -> reclam гэж ээлжлэн сольж үзүүлэх
  useEffect(() => {
    if (reclams.length === 0) return;

    let index = 0;
    const showReclam = () => {
      setCurrentView("reclam");
      setCurrentReclamIndex(index);
      setTimeout(() => {
        setCurrentView("shift");
        index = (index + 1) % reclams.length;
        setTimeout(showReclam, 6000); // дараагийн loop эхэлнэ
      }, 3000);
    };

    showReclam();

    return () => {};
  }, [reclams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[rgb(255,125,20)]">
        <div className="text-white">Ээлжийн мэдээлэл уншиж байна...</div>
      </div>
    );
  }

  const renderContent = () => {
    if (currentView === "reclam" && reclams.length > 0) {
      const currentReclam = reclams[currentReclamIndex];
      if (currentReclam.video) {
        return (
          <div className="fixed inset-0 w-full h-full">
            <video
              src={currentReclam.video}
              controls
              autoPlay
              loop
              className="object-cover w-full h-full"
            />
          </div>
        );
      }
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

    // renderContent доторх shift view хэсэг
    if (!currentShift) {
      return (
        <div className="flex flex-col items-center min-h-screen bg-[rgb(90,90,100)] py-8">
          <h1
            className="text-2xl font-bold mb-4 text-center"
            style={{ color: "rgb(90, 90, 100)" }}
          >
            ӨНӨӨДӨР ТАНД МАНАЙ ХАМТ ОЛОН ҮЙЛЧИЛЖ БАЙНА
          </h1>
          <div className="text-lg text-white">
            Өнөөдрийн ээлжийн мэдээлэл байхгүй байна
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[url('/branch.jpg')] bg-cover bg-center py-8 px-4">
        <h1
          className="text-2xl font-bold mb-4 text-center"
          style={{ color: "rgb(90, 90, 100)" }}
        >
          ӨНӨӨДӨР ТАНД МАНАЙ ХАМТ ОЛОН ҮЙЛЧИЛЖ БАЙНА
        </h1>
        <div>
          <ShiftEmployeeList
            employees={currentShift.employees || {}}
            roles={currentShift.roles || []}
          />
        </div>
        <h1
          className="text-2xl font-bold mb-4 text-center"
          style={{ color: "rgb(90, 90, 100)" }}
        >
          ТА САЙХАН ХООЛЛООРОЙ
        </h1>
      </div>
    );
  };
  // Return хэсэг
  return <div className="min-h-screen">{renderContent()}</div>;
}

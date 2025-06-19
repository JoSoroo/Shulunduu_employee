"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ShiftEmployeeList({ details }) {
  if (!details || !Array.isArray(details)) return null;

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {details.map((emp, index) => (
        <div
          key={index}
          className="flex items-center gap-6 p-6 bg-white rounded-xl border shadow-md w-[400px]"
        >
          <Avatar className="h-24 w-24">
            <AvatarImage src={emp.image || ""} alt={emp.name} />
            <AvatarFallback className="text-xl font-bold">
              {emp.name?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-semibold">{emp.name}</p>
            <p className="text-base text-muted-foreground">{emp.position}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 
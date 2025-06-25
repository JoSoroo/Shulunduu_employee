"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

export default function ShiftEmployeeList({ employees, roles }) {
  if (!employees || typeof employees !== "object") return null;

  const mainRoles = ["Ахлах тогооч", "Салбарын дарга", "Үйлчилгээний менежер"];
  const mainEmployees = [];
  const otherEmployees = [];

  const getRoleName = (roleKey) => {
    let roleName = roleKey;
    if (roles && Array.isArray(roles)) {
      const foundRole = roles.find(
        (role) =>
          role.name === roleKey || role._id === roleKey || role.description === roleKey
      );
      if (foundRole) {
        roleName = foundRole.name;
      }
    }
    return roleName;
  };

  console.log('Processing employees:', employees);

  const getImageUrl = (employee) => {
    if (!employee || !employee.img) return "";
    console.log('Processing image for employee:', employee.name);
    // Хэрэв зураг url байгаа бол шууд буцаана
    if (employee.img.url) {
      return employee.img.url;
    }
  
    const bufferData = employee.img.data;
    if (!bufferData) return "";
  
    let base64String;
  
    if (typeof bufferData === "string") {
      base64String = bufferData;
    } 
    // bufferData.data байх ёстой бол зөвхөн Array эсвэл TypedArray байх тохиолдолд хөрвүүлэх
    else if (
      bufferData.data && 
      (Array.isArray(bufferData.data) || ArrayBuffer.isView(bufferData.data))
    ) {
      try {
        const uint8Array = new Uint8Array(bufferData.data);
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i]);
        }
        base64String = btoa(binaryString);
      } catch (error) {
        console.error("Error converting buffer to base64 (array):", error);
      }
    } 
    // bufferData нь шууд ArrayBuffer эсвэл TypedArray байх тохиолдолд хөрвүүлэх
    else if (
      bufferData instanceof ArrayBuffer ||
      ArrayBuffer.isView(bufferData)
    ) {
      try {
        const uint8Array = new Uint8Array(bufferData);
        base64String = btoa(String.fromCharCode(...uint8Array));
      } catch (error) {
        console.error("Error converting ArrayBuffer to base64:", error);
      }
    } else {
      // bufferData эсвэл bufferData.data нь танигдахгүй байвал буцаахгүй
      console.warn("Image buffer not recognized or unsupported format:", bufferData);
      return "";
    }
  
    if (base64String) {
      return `data:${employee.img.contentType};base64,${base64String}`;
    }
  
    return "";
  };

  // Role-оор ангилах
  Object.entries(employees).forEach(([roleKey, empList]) => {
    console.log('Processing role:', roleKey);
    const roleName = getRoleName(roleKey);
    const list = Array.isArray(empList) ? empList : [empList];
    const enriched = list.map((emp) => ({
      ...emp,
      role: roleName,
      image: getImageUrl(emp),
    }));

    if (mainRoles.includes(roleName)) {
      mainEmployees.push(...enriched);
    } else {
      otherEmployees.push(...enriched);
    }
  });

  const chunkArray = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  const otherChunks = chunkArray(otherEmployees, 4);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Ахлах ажилчид 1 мөр */}
      {mainEmployees.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {mainEmployees.map((emp, i) => (
            <EmployeeCard key={i} employee={emp} />
          ))}
        </div>
      )}

      {/* Бусад ажилчид 4-4-ээр */}
      {otherChunks.map((group, idx) => (
        <div key={idx} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {group.map((emp, j) => (
            <EmployeeCard key={j} employee={emp} />
          ))}
        </div>
      ))}
    </div>
  );
}

function EmployeeCard({ employee }) {
  return (
    <div className="bg-white rounded-lg shadow-md text-center m-2 w-65 h-48 p-4 flex flex-col justify-between items-center">
      <Avatar className="h-28 w-30 mb-3">
        <AvatarImage src={employee.image} alt={employee.name || "Employee"} />
        <AvatarFallback className="text-xl font-bold">
          {employee.name ? employee.name.slice(0, 2).toUpperCase() : "??"}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold text-base">{employee.name}</div>
        <div className="text-sm text-gray-500">{employee.role}</div>
      </div>
    </div>
  );
}

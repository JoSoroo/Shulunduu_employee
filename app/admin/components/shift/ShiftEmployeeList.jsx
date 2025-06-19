"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ShiftEmployeeList({ employees, roles }) {
  if (!employees || typeof employees !== "object") return null;

  // Convert employees Map to array if needed
  const employeesArray =
    employees instanceof Map
      ? Array.from(employees.entries())
      : Object.entries(employees);

  // Get role name helper function
  const getRoleName = (roleKey) => {
    let roleName = roleKey;
    if (roles && Array.isArray(roles)) {
      let foundRole = roles.find((role) => role.name === roleKey);
      if (!foundRole) {
        foundRole = roles.find((role) => role._id === roleKey);
      }
      if (!foundRole) {
        foundRole = roles.find((role) => role.description === roleKey);
      }
      if (foundRole) {
        roleName = foundRole.name;
      }
    }
    return roleName;
  };

  // Handle image data helper function
  const getImageUrl = (employee) => {
    if (!employee || !employee.img) return "";
    
    if (employee.img.data) {
      const bufferData = employee.img.data;
      let base64String;

      if (typeof bufferData === "string") {
        base64String = bufferData;
      } else if (bufferData && bufferData.data) {
        const nestedBuffer = bufferData.data;
        if (typeof nestedBuffer === "string") {
          base64String = nestedBuffer;
        } else {
          try {
            const uint8Array = new Uint8Array(nestedBuffer);
            base64String = btoa(String.fromCharCode(...uint8Array));
          } catch (error) {
            console.error("Error converting buffer to base64:", error);
          }
        }
      } else if (
        bufferData instanceof ArrayBuffer ||
        ArrayBuffer.isView(bufferData)
      ) {
        try {
          const uint8Array = new Uint8Array(bufferData);
          base64String = btoa(String.fromCharCode(...uint8Array));
        } catch (error) {
          console.error("Error converting ArrayBuffer to base64:", error);
        }
      }

      if (base64String) {
        return `data:${employee.img.contentType};base64,${base64String}`;
      }
    } else if (employee.img.url) {
      return employee.img.url;
    }
    
    return "";
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {employeesArray.map(([roleKey, employeeData]) => {
          const employee =
            typeof employeeData === "string" ? employeeData : employeeData;
          
          const roleName = getRoleName(roleKey);
          const imageUrl = getImageUrl(employee);

          return (
            <div key={roleKey} className="flex flex-col items-center bg-white rounded-lg p-4 shadow-md border">
              <Avatar className="h-24 w-24 mb-3">
                <AvatarImage
                  src={imageUrl}
                  alt={employee?.name || "Employee"}
                />
                <AvatarFallback className="text-xl font-bold">
                  {employee?.name
                    ? employee.name.slice(0, 2).toUpperCase()
                    : "??"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900 mb-1">
                  {employee?.name || "Тодорхойгүй"}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  {roleName}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

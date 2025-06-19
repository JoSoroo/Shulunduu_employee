"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ShiftRoleSelector from "../shift/ShiftRoleSelector";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns"; //
import { useAuth } from "../../context/authContext";
export default function ShiftButton({ onSuccess, editData, isEdit, open, onOpenChange }) {
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [date, setDate] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [shiftType, setShiftType] = useState(""); // өглөө/орой
  const [selectedEmployees, setSelectedEmployees] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();

  // Use the open prop if provided (for edit mode), otherwise use local state
  const isDialogOpen = open !== undefined ? open : dialogOpen;
  const handleDialogChange = onOpenChange || setDialogOpen;

  // Initialize form with edit data if provided
  useEffect(() => {
    if (isEdit && editData) {
      setDate(new Date(editData.date));
      setShiftType(editData.shiftType === "Өглөөний ээлж" ? "morning" : "evening");
      
      // Convert the employees data structure to match the expected format
      if (editData.employees) {
        const convertedEmployees = {};
        Object.keys(editData.employees).forEach(role => {
          const employee = editData.employees[role];
          if (employee && employee._id) {
            convertedEmployees[role] = employee._id;
          }
        });
        setSelectedEmployees(convertedEmployees);
      }
    } else if (!isEdit) {
      // Reset form when not in edit mode
      setDate(new Date());
      setShiftType("");
      setSelectedEmployees({});
    }
  }, [isEdit, editData]);

  // Reset form when dialog is closed
  useEffect(() => {
    if (!isDialogOpen && !isEdit) {
      setDate(new Date());
      setShiftType("");
      setSelectedEmployees({});
    }
  }, [isDialogOpen, isEdit]);

  const fetchEmployees = () => {
    if (!user || !user.token) return;
    console.log("CurrentUser", user);
    axios
      .get(`http://localhost:5000/api/employees`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        const formattedData = res.data.map((employee) => {
          const imageData =
            employee.img && employee.img.data
              ? `data:${employee.img.contentType};base64,${employee.img.data}`
              : null;

          return {
            id: employee._id,
            name: employee.name,
            position: employee.position?.name || employee.position,
            role: employee.position?.name || employee.position, // Add role field for filtering
            row: [
              imageData ? (
                <img
                  src={imageData}
                  alt="Зураг"
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                "No Image"
              ),
              employee.name,
              employee.position?.name || employee.position,
              employee.branchId?.number || "Тодорхойгүй",
              employee.branchId?.location || "Тодорхойгүй",
              employee.phone,
            ],
          };
        });

        console.log("Ирсэн өгөгдөл: ", formattedData);
        setEmployees(formattedData);
      })
      .catch(() => {
        console.log("Өгөгдөл авахад алдаа гарлаа");
      });
  };

  const fetchRoles = () => {
    axios
      .get("http://localhost:5000/api/roles")
      .then((res) => {
        setRoles(res.data);
      })
      .catch(() => {
        console.log("Role өгөгдөл авахад алдаа гарлаа");
      });
  };

  useEffect(() => {
    if (user && user.token) {
      fetchEmployees();
      fetchRoles();
    }
  }, [user]);

  const roleKeyMap = {};

  const handleAddRole = () => {
    if (newRole && !selectedRoles.includes(newRole)) {
      setSelectedRoles([...selectedRoles, newRole]);
    }
  };

  const handleRoleChange = (role, employeeId) => {
    setSelectedEmployees((prev) => ({
      ...prev,
      [role]: employeeId,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const currentSelected = { ...selectedEmployees };
    console.log("Snapshot:", currentSelected);
    console.log("setselected", selectedEmployees);

    // Get role IDs for selected roles
    const selectedRoleIds = roles
      .filter(role => Object.keys(selectedEmployees).includes(role.name))
      .map(role => role._id);

    // Convert selectedEmployees to Map structure
    const employeesMap = {};
    Object.entries(selectedEmployees).forEach(([roleName, employeeId]) => {
      if (employeeId) {
        employeesMap[roleName] = employeeId;
      }
    });

    console.log("Selected employees:", selectedEmployees);
    console.log("Employees map:", employeesMap);
    console.log("Selected role IDs:", selectedRoleIds);

    const shiftData = {
      date: date.toISOString().split("T")[0],
      shiftType: shiftType === "morning" ? "Өглөөний ээлж" : "Оройн ээлж",
      branchId: user.branchId,
      roles: selectedRoleIds,
      employees: employeesMap,
    };
    console.log("Final shiftdata:", shiftData);
    try {
      if (isEdit && editData?.id) {
        // Update existing shift
        console.log("Editing shift with ID:", editData.id);
        console.log("Shift data to update:", shiftData);
        const res = await axios.put(
          `http://localhost:5000/api/shifts/${editData.id}`,
          shiftData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        toast.success("Амжилттай шинэчлэгдлээ!");
      } else {
        // Create new shift
        const res = await axios.post(
          "http://localhost:5000/api/shifts",
          shiftData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        toast.success("Амжилттай хадгалагдлаа!");
      }
      
      if (onSuccess) {
        onSuccess(); // Call the callback to refresh data
      }
      handleDialogChange(false); // Close the dialog after successful save
    } catch (err) {
      console.error(err);
      toast.error(isEdit ? "Шинэчлэх үед алдаа гарлаа" : "Хадгалах үед алдаа гарлаа");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <form>
        {!isEdit && (
          <DialogTrigger asChild>
            <Button variant="outline" className="mb-10 self-start">
              Ээлж солих
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Ээлж засах" : "Ээлжээ сонгоно уу"}</DialogTitle>
            <DialogDescription>
              {isEdit ? "Ээлжийн мэдээллийг засах" : "Солих ээлжээ сонгоно уу"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="morning"
                checked={shiftType === "morning"}
                onCheckedChange={() => setShiftType("morning")}
              />
              <Label htmlFor="morning">Өглөөний ээлж</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                id="evening"
                checked={shiftType === "evening"}
                onCheckedChange={() => setShiftType("evening")}
              />
              <Label htmlFor="evening">Оройн ээлж</Label>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <Label>Он сар өдөр</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[240px] justify-start text-left font-normal"
                    >
                      {date ? format(date, "yyyy-MM-dd") : "Он сар өдөр сонгох"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            {roles.map((role) => (
              <ShiftRoleSelector
                key={role._id}
                role={role.name}
                employees={employees}
                selected={selectedEmployees[role.name]}
                onChange={handleRoleChange}
              />
            ))}

            <div className="grid gap-2">
              <Label>Мэргэжил сонгох</Label>
              <div className="flex gap-2">
                <Select onValueChange={setNewRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Мэргэжил сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles
                      .filter((r) => !selectedRoles.includes(r.name))
                      .map((role) => (
                        <SelectItem key={role._id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" type="button" onClick={handleAddRole}>
                  + Нэмэх
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Буцах</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSave}>
              Хадгалах
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

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
export default function ShiftButton({ onSuccess, editData, isEdit = false }) {
  const [roles, setRoles] = useState([
    "Менежер",
    "Ахлах Тогооч",
    "Тогооч",
    "Зөөгч",
    "Кассчин",
    "Хамгаалагч",
    "Үйлчлэгч",
  ]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [date, setDate] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [shiftType, setShiftType] = useState(""); // өглөө/орой
  const [selectedEmployees, setSelectedEmployees] = useState({
    manager: null,
    chef: null,
    waiter: null,
    security: null,
    cashier: null,
    cleaner: null,
  });
  const { user } = useAuth();

  // Initialize form with edit data if provided
  useEffect(() => {
    if (isEdit && editData) {
      setDate(new Date(editData.date));
      setShiftType(editData.shiftType === "Өглөөний ээлж" ? "morning" : "evening");
      setSelectedEmployees(editData.employees || {});
    }
  }, [isEdit, editData]);

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
              employee.position,
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
  useEffect(() => {
    if (user && user.token) {
      fetchEmployees();
      // fetchBranches();
    }
  }, [user]);
  const roleKeyMap = {
    Менежер: "manager",
    "Ахлах Тогооч": "chef",
    Тогооч: "chef",
    Зөөгч: "waiter",
    Кассчин: "cashier",
    Хамгаалагч: "security",
    Үйлчлэгч: "cleaner",
  };

  const handleAddRole = () => {
    if (newRole && !selectedRoles.includes(newRole)) {
      setSelectedRoles([...selectedRoles, newRole]);
    }
  };
  const handleRoleChange = (role, employeeId) => {
    const key = roleKeyMap[role] || role; // нэмэлт role-уудыг шууд хадгалах
    setSelectedEmployees((prev) => ({
      ...prev,
      [key]: employeeId,
    }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const currentSelected = { ...selectedEmployees };
    console.log("Snapshot:", currentSelected);
    console.log("setselected", selectedEmployees);

    const shiftData = {
      date: date.toISOString().split("T")[0],
      shiftType: shiftType === "morning" ? "Өглөөний ээлж" : "Оройн ээлж",
      branchId: user.branchId,
      employees: selectedEmployees,
    };
    console.log("shiftdata", shiftData);
    try {
      if (isEdit && editData?.id) {
        // Update existing shift
        const res = await axios.put(
          `http://localhost:5000/api/shifts/${editData.id}`,
          shiftData
        );
        toast.success("Амжилттай шинэчлэгдлээ!");
      } else {
        // Create new shift
        const res = await axios.post(
          "http://localhost:5000/api/shifts",
          shiftData
        );
        toast.success("Амжилттай хадгалагдлаа!");
      }
      
      if (onSuccess) {
        onSuccess(); // Call the callback to refresh data
      }
    } catch (err) {
      console.error(err);
      toast.error(isEdit ? "Шинэчлэх үед алдаа гарлаа" : "Хадгалах үед алдаа гарлаа");
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-10 self-start">
            {isEdit ? "Ээлж засах" : "Ээлж солих"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
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
            <ShiftRoleSelector
              role="Менежер"
              employees={employees}
              selected={selectedEmployees["Менежер"]}
              onChange={handleRoleChange}
            />
            <ShiftRoleSelector
              role="Тогооч"
              employees={employees}
              selected={selectedEmployees["Тогооч"]}
              onChange={handleRoleChange}
            />
            <ShiftRoleSelector
              role="Кассчин"
              employees={employees}
              selected={selectedEmployees["Кассчин"]}
              onChange={handleRoleChange}
            />
            <ShiftRoleSelector
              role="Зөөгч"
              employees={employees}
              selected={selectedEmployees["Зөөгч"]}
              onChange={handleRoleChange}
            />
            <ShiftRoleSelector
              role="Хамгаалагч"
              employees={employees}
              selected={selectedEmployees["Хамгаалагч"]}
              onChange={handleRoleChange}
            />
            <ShiftRoleSelector
              role="Үйлчлэгч"
              employees={employees}
              selected={selectedEmployees["Үйлчлэгч"]}
              onChange={handleRoleChange}
            />
            {selectedRoles.map((role, index) => (
              <ShiftRoleSelector
                key={index}
                role={role}
                employees={employees}
                selected={selectedEmployees[role]}
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
                      .filter((r) => !selectedRoles.includes(r))
                      .map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
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

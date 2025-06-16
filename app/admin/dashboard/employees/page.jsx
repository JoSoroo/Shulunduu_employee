"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import TableItems from "../../components/table/Table";
import AddButton from "../../components/addbuton/Addbutton";
import { Box, Typography, IconButton } from "@mui/material";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import DeleteItems from "../../components/delete/deleteItems";
import { useAuth } from "../../context/authContext";
const employeeHeaders = [
  "Зураг",
  "Ажилчины нэр ",
  "Албан тушаал",
  "Салбар",
  "Салбарын хаяг",
  "Утас",
];

export default function EmployeePage() {
  const [employeeRows, setEmployeeRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteIndex, setSelectedDeleteIndex] = useState(null);
  const [branches, setBranches] = useState([]);
  const { user } = useAuth();
  console.log(user);
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
        setEmployeeRows(formattedData);
      })
      .catch(() => {
        console.log("Өгөгдөл авахад алдаа гарлаа");
      });
  };
  const fetchBranches = () => {
    console.log("Branch tatagdaj bna ");
    axios
      .get("http://localhost:5000/api/branches")
      .then((res) => {
        const branchOptions = res.data.map((branch) => ({
          label: `${branch.number} - ${branch.location}`,
          value: branch._id.toString(), // string хэлбэр
        }));
        setBranches(branchOptions);
      })
      .catch(() => {
        console.log("Өгөгдөл авахад алдаа гарлаа");
      });
  };
  useEffect(() => {
    if (user && user.token) {
      fetchEmployees();
      fetchBranches();
    }
  }, [user]);
  const filteredRows = employeeRows.filter((emp) => {
    return emp.row.slice(1).some((cell) => {
      if (typeof cell === "string" || typeof cell === "number") {
        return cell
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      }
      return false;
    });
  });

  console.log("employeeRows", employeeRows);
  const confirmDelete = () => {
    const employee = employeeRows[selectedDeleteIndex];
    axios
      .delete(`http://localhost:5000/api/employees/${employee.id}`)
      .then((res) => {
        toast.success(res.data.message);
        fetchEmployees();
      })
      .catch(() => toast.error("Устгах үед алдаа гарлаа"))
      .finally(() => {
        setDeleteDialogOpen(false);
        setSelectedDeleteIndex(null);
      });
  };
  const handleDelete = (index) => {
    setSelectedDeleteIndex(index);
    setDeleteDialogOpen(true);
  };
  const handleEdit = (index) => {
    const employee = employeeRows[index];
    console.log("setEditMode ajillaa");
    setEditMode(true);
    setEditData({
      id: employee.id,
      img: employee.row[0],
      name: employee.row[1],
      position: employee.row[2],
      branchId: employee.row[3],
      phone: employee.row[4],
    });
    setFormOpen(true); // формыг нээх
  };
  return (
    <ProtectedRoute allowedRoles={["admin", "manager"]}>
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
        <Typography>Ажилчидын мэдээлэл</Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Input
              placeholder="Search ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
            />
          </Box>
          <AddButton
            open={formOpen}
            onClose={(val) => {
              setFormOpen(val);
              if (!val) {
                setEditMode(false);
                setEditData(null);
              }
            }}
            title={editMode ? "менежер мэдээлэл засах" : "Шинэ менежер нэмэх"}
            defaultValues={editData}
            fields={[
              { label: "Ажилчины зураг", key: "img", type: "file" },
              { label: "Ажилчины нэр", key: "name" },
              { label: "Албан тушаал", key: "position" },
              {
                label: "Салбар",
                key: "branchId",
                type: "select",
                options: branches,
              },
              { label: "Утас", key: "phone" },
            ]}
            onSubmit={(data) => {
              const formData = new FormData();
              Object.entries(data).forEach(([key, value]) => {
                if (key === "img" && value instanceof FileList) {
                  formData.append(key, value[0]); // зураг file-оор
                } else {
                  formData.append(key, value);
                }
              });
              if (editMode && editData?.id) {
                // Update
                axios
                  .put(
                    `http://localhost:5000/api/employees/${editData.id}`,
                    formData,
                    {
                      headers: { "Content-Type": "multipart/form-data" },
                    }
                  )
                  .then((res) => {
                    toast.success("Амжилттай засагдлаа");
                    fetchEmployees();
                    fetchBranches();
                    setFormOpen(false);
                    setEditMode(false);
                    setEditData(null);
                  })
                  .catch((err) => {
                    console.error("Засахад алдаа гарлаа:", err);
                    toast.error("Засах үед алдаа гарлаа");
                  });
              } else {
                // Create
                axios
                  .post("http://localhost:5000/api/employees", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                  })
                  .then((res) => {
                    console.log("Ywj bgaa ogogdol:", data);
                    toast.success("Амжилттай нэмэгдлээ");
                    fetchEmployees();
                    fetchBranches();
                    setFormOpen(false);
                    setEditMode(false);
                    setEditData(null);
                  })
                  .catch((err) => {
                    console.error("Нэмэх үед алдаа гарлаа:", err);
                    toast.error("Нэмэх үед алдаа гарлаа");
                  });
              }

              // Form хаах
              setFormOpen(false);
              setEditMode(false);
              setEditData(null);
            }}
          />
        </Box>
        <TableItems
          caption="Ажилчидын жагсаалт"
          headers={employeeHeaders}
          rows={filteredRows}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <DeleteItems
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
        />
      </Box>
    </ProtectedRoute>
  );
}

"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import TableItems from "../../components/table/Table";
import AddButton from "../../components/addbuton/Addbutton";
import { Box, Typography, IconButton } from "@mui/material";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import DeleteItems from "../../components/delete/deleteItems";
const managerHeaders = ["Нэр", "Утас", "Салбар", "Салбарын хаяг"];

export default function ManagerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [managerRows, setManagerRows] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteIndex, setSelectedDeleteIndex] = useState(null);
  const [branches, setBranches] = useState([]);
  const fetchManagers = () => {
    axios
      .get("http://localhost:5000/api/auth")
      .then((res) => {
        const formattedData = res.data.map((manager) => ({
          id: manager._id,
          username: manager.username, // нэмж байна
          row: [
            manager.name,
            manager.phone,
            manager.branchId?.number || "Тодорхойгүй",
            manager.branchId?.location || "Тодорхойгүй",
          ],
        }));
        setManagerRows(formattedData);
      })
      .catch(() => {
        console.log("Өгөгдөл авахад алдаа гарлаа");
      });
  };
  const fetchBranches = () => {
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
    fetchManagers();
    fetchBranches();
  }, []);
  const filteredRows = managerRows.filter((manager) =>
    manager.row.some((cell) =>
      cell.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const confirmDelete = () => {
    const manager = managerRows[selectedDeleteIndex];
    axios
      .delete(`http://localhost:5000/api/auth/${manager.id}`)
      .then((res) => {
        toast.success(res.data.message);
        fetchManagers();
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

  const handleChange = () => {
    console.log("qweqwe");
  };
  const handleEdit = (index) => {
    const manager = managerRows[index];
    console.log("setEditmode ajillaa");
    setEditMode(true);
    setEditData({
      id: manager.id,
      username: manager.username, // нэмж байна
      password: "", // аюулгүй байдлын үүднээс хоосон үлдээнэ
      name: manager.row[0],
      phone: manager.row[1],
      branchId: manager.row[2],
    });
    setFormOpen(true);
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
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
        <Typography>Менежерын мэдээлэл</Typography>
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
              { label: "Email ", key: "username" },
              { label: "Нууц үг ", key: "password" },
              { label: "Нэр ", key: "name" },
              {
                label: "Салбар",
                key: "branchId",
                type: "select",
                options: branches,
              },
              { label: "Утас", key: "phone" },
            ]}
            onSubmit={(data) => {
              if (editMode && editData?.id) {
                // Update
                axios
                  .put(`http://localhost:5000/api/auth/${editData.id}`, data)
                  .then((res) => {
                    toast.success("Амжилттай засагдлаа");
                    fetchBranches();
                    fetchManagers(); // энэ бас байх ёстой
                    setFormOpen(false);
                    setEditMode(false);
                    setEditData(null);
                  })
                  .catch((err) => {
                    console.error("Засахад алдаа гарлаа:", err);
                    toast.error("Засах үед алдаа гарлаа");
                  });
              } else {
                axios
                  .post("http://localhost:5000/api/auth", data)
                  .then((res) => {
                    toast.success("Амжилттай нэмэгдлээ");
                    fetchManagers();
                  })
                  .catch((err) => {
                    console.error("Нэмэх үед алдаа гарлаа", err);
                    toast.error("Нэмэх үед алдаа гарлаа");
                  });
                setFormOpen(false);
                setEditMode(false);
                setEditData(null);
              }
            }}
          />
        </Box>
        <TableItems
          caption="Менежерүүдийн жагсаалт"
          headers={managerHeaders}
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

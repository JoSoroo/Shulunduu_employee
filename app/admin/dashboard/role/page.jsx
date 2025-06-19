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
const roleHeaders = ["Албан тушаал", "Тодорхойлолт"]; 
export default function RolePage() {
  const [roleRows, setRoleRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteIndex, setSelectedDeleteIndex] = useState(null);

  const fetchRoles = () => {
    axios
      .get("http://localhost:5000/api/roles")
      .then((res) => {
        const formattedData = res.data.map((role) => ({
          id: role._id,
          row: [role.name, role.description],
        }));
        console.log("formattedData", formattedData);
        setRoleRows(formattedData);
      })
      .catch(() => {
        console.log("Өгөгдөл авахад алдаа гарлаа");
      });
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const filteredRows = roleRows.filter((role) =>
    role.row.some((cell) =>
      cell && typeof cell === 'string' && cell.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  console.log("filteredRows", filteredRows);

  const confirmDelete = () => {
    const role = roleRows[selectedDeleteIndex];
    axios
      .delete(`http://localhost:5000/api/roles/${role.id}`)
      .then((res) => {
        toast.success(res.data.message);
        fetchRoles();
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
  const role = roleRows[index];
  console.log('setEditMode ajillaa')
  setEditMode(true);
  setEditData({
    id: role.id,
    name: role.row[0],
    description: role.row[1],
  });
  setFormOpen(true); // формыг нээх
};
  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'white', p: 5 }}>
        <ToastContainer />
        <Typography >
          Албан тушаалын жагсаалт
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
        <Input
          placeholder="Хайх..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginBottom: "20px", width: "300px" }}
        />
        </Box>
        <AddButton
          open={formOpen}
          onClose={(val) => {
            setFormOpen(val);
            if (!val) {
            setEditMode(false);
            setEditData(null);}
          }}
          title={editData ? "Албан тушаал засах " : "Шинэ салбар нэмэх"}
          defaultValues={editData}
          fields={[
            { label: "Албан тушаал", key:"name" },
            {  label: "Тодорхойлолт", key:"description" },
          ]}
          onSubmit={(data)=>{
            if (editMode && editData?.id) {
              axios
                .put(`http://localhost:5000/api/roles/${editData.id}`, data)
                .then((res) => {
                  toast.success("Амжилттай засагдлаа");
                  fetchRoles();
                })
                .catch(() => toast.error("Засах үед алдаа гарлаа"));
            } else {
              axios
                .post("http://localhost:5000/api/roles", data)
                .then((res) => {
                  toast.success("Амжилттай нэмэгдлээ");
                  fetchRoles();
                })
                .catch(() => toast.error("Нэмэх үед алдаа гарлаа"));
            }
            setFormOpen(false);
            setEditMode(false);
              setEditData(null);
          }}
          />
          </Box>
        <TableItems
          caption="Албан тушаалын жагсаалт"
            headers={roleHeaders}
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
  );}
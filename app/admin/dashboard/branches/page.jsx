"use client";
import {useEffect, useState} from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import TableItems from "../../components/table/Table";
import AddButton from "../../components/addbuton/Addbutton"
import { Box, Typography, IconButton } from '@mui/material';
import { Input } from "@/components/ui/input";
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import DeleteItems from "../../components/delete/deleteItems";
const branchHeaders = ["Салбарын дугаар", "Салбарын дарга", "Утас", "Хаяг"];
export default function BranchPage() {
  const [branchRows, setBranchRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
const [editMode, setEditMode] = useState(false);
const [editData, setEditData] = useState(null);
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [selectedDeleteIndex, setSelectedDeleteIndex] = useState(null);

const fetchBranches = () => {
  axios.get('http://localhost:5000/api/branches')
    .then((res) => {
      const formattedData = res.data.map(branch => ({
        id: branch._id,
        row: [branch.number, branch.department, branch.phone, branch.location]
      }));
      setBranchRows(formattedData);
    })
    .catch(() => {
      console.log("Өгөгдөл авахад алдаа гарлаа");
    });
};
  useEffect(() => {
  fetchBranches();
}, []);

  const filteredRows = branchRows.filter((branch) =>
    branch.row.some((cell) =>
      cell.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
   const confirmDelete = () => {
    const branch = branchRows[selectedDeleteIndex];
    axios.delete(`http://localhost:5000/api/branches/${branch.id}`)
      .then(res => {
        toast.success(res.data.message);
        fetchBranches();
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
  const branch = branchRows[index];
  console.log('setEditMode ajillaa')
  setEditMode(true);
  setEditData({
    id: branch.id,
    number: branch.row[0],
    department: branch.row[1],
    phone: branch.row[2],
    location: branch.row[3],
  });
  setFormOpen(true); // формыг нээх
};
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'white', p: 5 }}>
        <ToastContainer />
          <Typography>Салбарын мэдээлэл</Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
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
              if(!val){
              setEditMode(false);
              setEditData(null);}
            }}
            title={editMode ? "Салбар засах" : "Шинэ салбар нэмэх"}
            defaultValues={editData}
            fields={[
              { label: "Салбарын дугаар", key: "number" },
              { label: "Салбарын дарга", key: "department" },
              { label: "Утас", key: "phone" },
              { label: "Хаяг", key: "location" },
            ]}
            onSubmit={(data) => {
              if (editMode && editData?.id) {
                // Update
                axios.put(`http://localhost:5000/api/branches/${editData.id}`, data)
                  .then((res) => {
                    toast.success("Амжилттай засагдлаа");
                    fetchBranches();
                  })
                  .catch((err) => {
                    console.error("Засахад алдаа гарлаа:", err);
                    toast.error("Засах үед алдаа гарлаа");
                  });
              } else {
                // Create
                axios.post('http://localhost:5000/api/branches', data)
                  .then((res) => {
                    toast.success("Амжилттай нэмэгдлээ");
                    fetchBranches();
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
        caption="Салбаруудын жагсаалт"
        headers={branchHeaders}
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

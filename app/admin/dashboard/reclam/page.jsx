"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Addbutton from "../../components/addbuton/Addbutton";
import DeleteItems from "../../components/delete/deleteItems";

export default function ReclamPage() {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  useEffect(() => {
    // Fetch advertisements from backend
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reclams");
        setAdvertisements(response.data);
      } catch (error) {
        console.error("Error fetching advertisements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, []);

  const handleAddAdvertisement = async (formData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post(
        "http://localhost:5000/api/reclams",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Refresh the advertisements list
      const updatedResponse = await axios.get(
        "http://localhost:5000/api/reclams"
      );
      setAdvertisements(updatedResponse.data);

      setDialogOpen(false);
    } catch (error) {
      console.error("Error adding advertisement:", error);
    }
  };

  const handleEditAdvertisement = async (formData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.put(
        `http://localhost:5000/api/reclams/${selectedAd._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Refresh the advertisements list
      const updatedResponse = await axios.get(
        "http://localhost:5000/api/reclams"
      );
      setAdvertisements(updatedResponse.data);

      setEditDialogOpen(false);
      setSelectedAd(null);
    } catch (error) {
      console.error("Error updating advertisement:", error);
    }
  };

  const handleDeleteAdvertisement = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/reclams/${selectedAd._id}`);

      // Refresh the advertisements list
      const updatedResponse = await axios.get(
        "http://localhost:5000/api/reclams"
      );
      setAdvertisements(updatedResponse.data);

      setDeleteDialogOpen(false);
      setSelectedAd(null);
    } catch (error) {
      console.error("Error deleting advertisement:", error);
    }
  };

  const handleEditClick = (ad) => {
    setSelectedAd(ad);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (ad) => {
    setSelectedAd(ad);
    setDeleteDialogOpen(true);
  };

  const advertisementFields = [
    {
      key: "title",
      label: "Зарны гарчиг",
      type: "text",
    },
    {
      key: "image",
      label: "Зураг",
      type: "file",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Зар сурталчилгааны мэдээлэл уншиж байна...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Зар сурталчилгааны удирдлага
        </h1>
        <p className="text-gray-600 mt-2">
          Системийн зар сурталчилгааны мэдээллийг удирдах
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Одоогийн зар сурталчилгаанууд
          </h2>
          <Addbutton
            open={dialogOpen}
            onClose={setDialogOpen}
            title="Шинэ зар нэмэх"
            description="Зар сурталчилгааны мэдээллийг оруулна уу"
            fields={advertisementFields}
            onSubmit={handleAddAdvertisement}
            buttonLabel="Нэмэх"
          />
        </div>

        {advertisements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Одоогоор зар сурталчилгаа байхгүй байна
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advertisements.map((ad) => (
              <div key={ad._id} className="border rounded-lg p-4">
                {ad.image && (
                  <div className="mb-3">
                    <img
                      src={`data:${ad.image.contentType};base64,${ad.image.data}`}
                      alt={ad.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <h3 className="font-semibold mb-2">{ad.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(ad.createdAt).toLocaleDateString()}
                  </span>
                  <div className="space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      onClick={() => handleEditClick(ad)}
                    >
                      Засах
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 text-sm"
                      onClick={() => handleDeleteClick(ad)}
                    >
                      Устгах
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog - moved outside the map function */}
      <Addbutton
        open={editDialogOpen}
        onClose={setEditDialogOpen}
        title="Зар засах"
        description="Зар сурталчилгааны мэдээллийг засна уу"
        fields={advertisementFields}
        onSubmit={handleEditAdvertisement}
        buttonLabel="Засах"
        defaultValues={selectedAd}
        showTrigger={false}
      />

      {/* Delete Dialog */}
      <DeleteItems
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteAdvertisement}
      />
    </div>
  );
}

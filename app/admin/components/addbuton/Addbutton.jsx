"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TextField, Box, FormControl } from "@mui/material";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axios from "axios";
export default function Addbutton({
  open,
  defaultValues,
  onClose,
  title,
  description,
  fields,
  onSubmit,
  buttonLabel = "Нэмэх",
}) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(defaultValues || {});
  }, [defaultValues]);

  const handleChange = (key) => (value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({});
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(val) => onClose(val)}
      onClose={() => onClose(false)}
      PaperProps={{
        sx: { p: 3 },
      }}
    >
      <Button variant="outline" onClick={() => onClose(true)}>
        Нэмэх
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {fields &&
            fields.map((field) =>
              field.type === "select" ? (
                <Select
                  key={field.key}
                  value={formData[field.key] || ""}
                  onValueChange={handleChange(field.key)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={field.label} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options &&
                      field.options.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option?.value.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : field.type === "file" ? (
                <Input
                  key={field.key}
                  type="file"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.key]: e.target.files?.[0] || null,
                    }))
                  }
                />
              ) : (
                <Input
                  key={field.key}
                  placeholder={field.label}
                  label={field.label}
                  type={field.type || "text"}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key)(e.target.value)}
                  fullWidth
                />
              )
            )}
          <Button onClick={handleSubmit}>Хадгалах</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

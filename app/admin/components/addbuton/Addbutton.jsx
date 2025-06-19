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
  showTrigger = true,
}) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(defaultValues || {});
    setErrors({});
  }, [defaultValues, open]);

  const handleChange = (key) => (value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    fields?.forEach((field) => {
      if (field.required && (!formData[field.key] || formData[field.key] === "")) {
        newErrors[field.key] = `${field.label} заавал оруулах шаардлагатай`;
      }
      
      // Additional validation for specific field types
      if (field.type === "email" && formData[field.key]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.key])) {
          newErrors[field.key] = "Имэйл хаяг буруу байна";
        }
      }
      
      if (field.type === "number" && formData[field.key]) {
        if (isNaN(formData[field.key])) {
          newErrors[field.key] = "Тоон утга оруулна уу";
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      setFormData({});
      setErrors({});
      onClose(false);
    } catch (error) {
      console.error("Form submission error:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline">
            {buttonLabel}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          {fields &&
            fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                {field.type === "select" ? (
                  <div>
                    <label className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <Select
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
                    {errors[field.key] && (
                      <p className="text-sm text-red-500 mt-1">{errors[field.key]}</p>
                    )}
                  </div>
                ) : field.type === "file" ? (
                  <div>
                    <label className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <Input
                      type="file"
                      accept={field.accept || "*/*"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [field.key]: e.target.files?.[0] || null,
                        }))
                      }
                    />
                    {errors[field.key] && (
                      <p className="text-sm text-red-500 mt-1">{errors[field.key]}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <Input
                      placeholder={field.placeholder || field.label}
                      type={field.type || "text"}
                      value={formData[field.key] || ""}
                      onChange={handleInputChange(field.key)}
                      className={errors[field.key] ? "border-red-500" : ""}
                    />
                    {errors[field.key] && (
                      <p className="text-sm text-red-500 mt-1">{errors[field.key]}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          <div className="flex gap-2 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => onClose(false)}
              disabled={isLoading}
            >
              Цуцлах
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Хадгалж байна..." : "Хадгалах"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

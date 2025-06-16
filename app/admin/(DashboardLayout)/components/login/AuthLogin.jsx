"use client";
import axios from "axios";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Checkbox,
  FormControlLabel,
  Divider,
  InputAdornment,
  Link as MuiLink,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/authContext";

// Icons
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";

// Validation schema (email + password)
const loginSchema = yup.object({
  email: yup
    .string()
    .email("Зөв email оруулна уу")
    .required("Цахим шуудангаа оруулна уу"),
  password: yup.string().required("Нууц үгээ оруулна уу"),
});

const AuthLogin = () => {
  const { login } = useAuth(); // Use our auth context
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,

    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);

        // Use the login function from auth context
        const result = await login(values);

        if (result.success) {
          toast.success("Амжилттай нэвтэрлээ!");

          // амжилттай нэвтэрсэн тохиолдолд хаашаа шилжих
          setTimeout(() => {
            router.push("/admin/dashboard");
          }, 1000);
        } else {
          toast.error(result.error || "Нэвтрэхэд алдаа гарлаа!");
        }
      } catch (error) {
        toast.error(error.message || "Нэвтрэхэд алдаа гарлаа!");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <Box sx={{ width: "100%" }}>
      <ToastContainer />

      {/* Heading: Нэвтрэх */}
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={1}
        sx={{ color: "orange" }}
      >
        Нэвтрэх
      </Typography>

      {/* Subtext */}
      <Typography variant="body2" sx={{ color: "orange", mb: 3 }}>
        Та Шөлөндө компаний <b>Бүртгэлийн Системд</b> тавтай морилно уу?
      </Typography>

      {/* Form Fields */}
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          {/* Email */}
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Цахим шуудан"
            variant="outlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#d4803b" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Нууц үг */}
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Нууц үг"
            variant="outlined"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#d4803b" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Нэвтрэх Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{
              textTransform: "none",
              fontWeight: "none",
              backgroundColor: "#d1781f",
              "&:hover": {
                backgroundColor: "#d66f09",
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Нэвтрэх"
            )}
          </Button>
        </Stack>
      </form>

      {/* Registration Link */}
    </Box>
  );
};

export default AuthLogin;

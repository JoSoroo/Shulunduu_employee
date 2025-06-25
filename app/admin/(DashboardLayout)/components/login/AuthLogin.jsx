"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/authContext";
// Custom UI components
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Validation schema (email + password)
const loginSchema = yup.object({
  email: yup
    .string()
    .email("Зөв email оруулна уу")
    .required("Цахим шуудангаа оруулна уу"),
  password: yup.string().required("Нууц үгээ оруулна уу"),
});

const AuthLogin = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        console.log("Attempting login with values:", values);
        const result = await login(values);
        console.log("Login result after function call:", result);

        if (result.success) {
          toast.success("Амжилттай нэвтэрлээ!");
          setTimeout(() => {
            // Check if user and role are defined
            if (result.user && result.user) {
              const userRole = result.user;
              console.log("User role:", userRole);

              // Check the user's role and redirect accordingly
              if (userRole === "admin") {
                console.log("Redirecting to /admin/dashboard/branches");
                router.push("/admin/dashboard/branches");
              } else if (userRole === "manager") {
                console.log("Redirecting to /admin/dashboard");
                router.push("/admin/dashboard");
              }
            } else {
              console.error("User or role is undefined");
              toast.error("User information is incomplete.");
            }
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
    <Card className="w-full max-w-sm">
      <ToastContainer />
      <CardHeader>
        <CardTitle>Нэвтрэх</CardTitle>
        <CardDescription>
          Цахим шуудан болон нууц үгээ оруулна уу
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Цахим шуудан</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.email && formik.errors.email && (
                <span className="text-sm text-red-500">
                  {formik.errors.email}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Нууц үг</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.password && formik.errors.password && (
                <span className="text-sm text-red-500">
                  {formik.errors.password}
                </span>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2"></CardFooter>
    </Card>
  );
};

export default AuthLogin;

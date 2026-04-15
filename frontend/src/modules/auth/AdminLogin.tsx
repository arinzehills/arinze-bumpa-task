import { data, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "@components/Button";
import { InputField } from "@components/InputField";
import { SideToast } from "@components/Toast";
import { usePost } from "@app/hooks/usePost";
import { useAppModeStore } from "../../app/stores/useAppModeStore";
import { useEffect } from "react";
import { User } from "@app/stores/useAuthStore";
import { useAdminAuthStore } from "@app/stores/useAdminAuthStore";

interface AdminLoginResponse {
  user: User;
  token: string;
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuthStore();
  const { setMode } = useAppModeStore();
  const { data, isLoading, execute } = usePost<AdminLoginResponse>();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await execute(
        "/auth/login",
        {
          email: values.email,
          password: values.password,
        },
        {
          canToastSuccess: true,
          canToastError: true,
        },
      );
    },
  });

  useEffect(() => {
    if (data) {
      if (data.user.user_type != "admin") {
        SideToast.FireWarning({
          title: "Access Denied",
          message:
            "Sorry, you are not an admin. Please use the user login instead.",
        });
        return;
      }
      setMode("admin");
      login(data.user, data.token);
      navigate("/admin");
    }
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Admin Portal
        </h1>
        <p className="text-text-secondary">
          Sign in to access the admin dashboard
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <InputField
          type="email"
          label="Email"
          name="email"
          placeholder="admin@email.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : ""
          }
        />

        <InputField
          type="password"
          label="Password"
          name="password"
          placeholder="Enter your password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          obscureText
          error={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
              : ""
          }
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="text-center text-text-secondary text-sm">
        <p>
          Not an admin?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-brand-primary hover:opacity-80 font-medium"
          >
            User login
          </button>
        </p>
      </div>
    </div>
  );
};

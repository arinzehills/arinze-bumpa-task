import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "@components/Button";
import { InputField } from "@components/InputField";
import { usePost } from "@app/hooks/usePost";
import { useAppModeStore } from "../../app/stores/useAppModeStore";
import { useAuthStore } from "@app/stores/useAuthStore";

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    user_type?: "admin" | "user" | "vendor";
    role?: "admin" | "super_admin" | "user";
    total_points?: number;
    current_badge_id?: string | null;
    current_badge_name?: string | null;
  };
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

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { setMode } = useAppModeStore();
  const { isLoading, execute } = usePost<LoginResponse>();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const response = await execute(
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

      if (response) {
        // Set mode to user
        setMode("user");

        // Store auth data
        login(response.user, response.token);

        navigate("/dashboard");
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Welcome Back
        </h1>
        <p className="text-text-secondary">
          Sign in to view your rewards and achievements
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <InputField
          type="email"
          label="Email"
          name="email"
          placeholder="your@email.com"
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

      <div className="space-y-4 text-center text-text-secondary text-sm">
        <p>
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-brand-primary hover:opacity-80 font-medium"
          >
            Sign up here
          </button>
        </p>
        <div className="pt-2 border-t border-border-color">
          <p>
            Are you an admin?{" "}
            <button
              onClick={() => navigate("/admin-login")}
              className="text-brand-primary hover:opacity-80 font-medium"
            >
              Admin login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

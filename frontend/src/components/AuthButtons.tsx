import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { useAuthStore } from "@app/stores/useAuthStore";

interface AuthButtonsProps {
  primarySize?: "sm" | "md" | "lg";
  gap?: string;
  hideLogoutText?: boolean;
}

export const AuthButtons = ({
  primarySize = "md",
  gap = "gap-3",
  hideLogoutText = false,
}: AuthButtonsProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  if (isAuthenticated) {
    return (
      <div className={`flex items-center ${gap}`}>
        <Button
          onClick={() => navigate("/dashboard")}
          variant="primary"
          size={primarySize}
        >
          Dashboard
        </Button>
        {!hideLogoutText && (
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${gap}`}>
      <Button
        onClick={() => navigate("/login")}
        variant="primary"
        size={primarySize}
      >
        Login
      </Button>
      <Button
        onClick={() => navigate("/register")}
        variant="secondary"
        size={primarySize}
      >
        Register
      </Button>
    </div>
  );
};
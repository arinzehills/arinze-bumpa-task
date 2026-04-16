import { useNavigate } from "react-router-dom";
import FadeAnimation from "@components/Animations/FadeAnimation";
import { Button } from "@components/Button";

const ProductErrorState = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <FadeAnimation>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Product not found
          </h1>
          <Button onClick={() => navigate(-1)} variant="primary">
            Go Back
          </Button>
        </div>
      </FadeAnimation>
    </div>
  );
};

export default ProductErrorState;
import { useNavigate } from "react-router-dom";

const ProductDetailHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline font-medium"
        >
          ← Back to Products
        </button>
        <h1 className="text-xl font-bold text-gray-900">Product Details</h1>
        <div />
      </div>
    </header>
  );
};

export default ProductDetailHeader;
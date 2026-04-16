import { Button } from "@components/Button";
import { Product } from "../../components/ProductItem";

interface ProductInfoPanelProps {
  product: Product;
  isProcessing: boolean;
  onBuyClick: () => void;
}

const ProductInfoPanel = ({
  product,
  isProcessing,
  onBuyClick,
}: ProductInfoPanelProps) => {
  const isInStock = product.stock > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

      <p className="text-gray-600 mb-6">SKU: {product.sku}</p>

      <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

      {/* Price */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">Price</p>
        <p className="text-4xl font-bold text-blue-600">
          ${parseFloat(product.price).toFixed(2)}
        </p>
      </div>

      {/* Stock Status */}
      <div className="mb-6">
        <p
          className={`text-lg font-semibold ${
            isInStock ? "text-green-600" : "text-red-600"
          }`}
        >
          {isInStock ? `${product.stock} in stock` : "Out of stock"}
        </p>
      </div>

      {/* Loyalty Rewards Info */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm font-semibold text-blue-900 mb-2">
          🎁 Loyalty Rewards
        </p>
        <p className="text-sm text-blue-800">
          Earn ~${(parseFloat(product.price) / 10).toFixed(2)} in loyalty
          points with this purchase!
        </p>
      </div>

      {/* Buy Button */}
      <Button
        onClick={onBuyClick}
        disabled={!isInStock || isProcessing}
        variant="black"
        size="lg"
        fullWidth
      >
        {isProcessing ? "Processing..." : isInStock ? "Buy Now" : "Out of Stock"}
      </Button>
    </div>
  );
};

export default ProductInfoPanel;
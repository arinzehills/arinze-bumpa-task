import { Product } from "../../components/ProductItem";

interface ProductGalleryProps {
  product: Product;
}

const ProductGallery = ({ product }: ProductGalleryProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ProductGallery;
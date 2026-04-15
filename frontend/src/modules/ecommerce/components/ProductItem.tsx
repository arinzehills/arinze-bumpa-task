import React from 'react'
import { Link } from 'react-router-dom'

export interface Product {
  id: number
  name: string
  description: string
  price: string
  sku: string
  stock: number
  image_url: string
  created_at?: string
  updated_at?: string
}

interface ProductItemProps {
  product: Product
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const isInStock = product.stock > 0

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-gray-200">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            isInStock
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {isInStock ? `${product.stock} left` : 'Out of stock'}
          </span>
        </div>

        {/* View Details Button */}
        <Link
          to={`/ecommerce/products/${product.id}`}
          className={`w-full py-2 rounded-lg font-medium text-center transition-colors duration-200 ${
            isInStock
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={(e) => !isInStock && e.preventDefault()}
        >
          {isInStock ? 'View Details' : 'Out of Stock'}
        </Link>
      </div>
    </div>
  )
}

export default ProductItem
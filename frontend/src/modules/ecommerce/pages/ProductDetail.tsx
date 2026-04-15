import { useParams, useNavigate } from 'react-router-dom'
import { useGet } from '@app/hooks/useGet'
import { usePost } from '@app/hooks/usePost'
import FadeAnimation from '@components/Animations/FadeAnimation'
import { Loader } from '@components/Loader'
import { Button } from '@components/Button'
import { Product } from '../components/ProductItem'

interface PaymentResponse {
  cashback_points: number
  payment: {
    id: number
    status: string
    transaction_id: string
  }
}

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()

  // Fetch product details
  const { data: product, isLoading: isLoadingProduct, error } = useGet<Product>(
    `/products/${productId}`,
    { autoFetch: true }
  )

  // Payment mutation - hook handles toasts automatically
  const { execute: executePayment, isLoading: isProcessing } = usePost<PaymentResponse>()

  const handleBuyNow = async () => {
    if (!product) return

    const response = await executePayment(
      '/payments',
      { product_id: product.id },
      { canToastSuccess: true, canToastError: true }
    )

    if (response) {
      setTimeout(() => navigate(-1), 2000)
    }
  }

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (error || !product) {
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
    )
  }

  const isInStock = product.stock > 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <FadeAnimation direction="up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              <p className="text-gray-600 mb-6">SKU: {product.sku}</p>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-4xl font-bold text-blue-600">
                  ${parseFloat(product.price).toFixed(2)}
                </p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <p className={`text-lg font-semibold ${
                  isInStock ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isInStock ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </div>

              {/* Loyalty Rewards Info */}
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-2">
                  🎁 Loyalty Rewards
                </p>
                <p className="text-sm text-blue-800">
                  Earn ~${(parseFloat(product.price) / 10).toFixed(2)} in loyalty points with this purchase!
                </p>
              </div>

              {/* Buy Button */}
              <Button
                onClick={handleBuyNow}
                disabled={!isInStock || isProcessing}
                variant="black"
                size="lg"
                fullWidth
              >
                {isProcessing ? 'Processing...' : isInStock ? 'Buy Now' : 'Out of Stock'}
              </Button>
            </div>
          </div>
        </FadeAnimation>
      </main>
    </div>
  )
}

export default ProductDetail
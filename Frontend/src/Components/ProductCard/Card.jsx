import axios from "axios";
import { Edit, Eye, Heart, ShoppingCart, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import API from '../../apiBase';

function Card({
  title,
  image,
  Index,
  description,
  originalPrice,
  discountedPrice,
  rating,
  id,
  handelDelete,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handelAddToCart = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API}/cart/add-to-cart?token=${token}`,
        { productId: id, quantity: 1 }
      );
      // Add success notification here
    } catch (error) {
      alert(error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const discountPercentage = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  return (
    <div className="card-modern group max-w-sm mx-auto">
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden">
        <Link to={`/product-details?id=${id}`}>
          <img
            src={image}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
            alt={title}
          />
        </Link>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            -{discountPercentage}%
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isLiked
              ? "bg-red-500 text-white shadow-lg"
              : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </button>

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          <Link
            to={`/product-details?id=${id}`}
            className="p-2 bg-white rounded-full text-gray-700 hover:text-purple-600 transition-colors duration-200 transform hover:scale-110"
          >
            <Eye className="w-5 h-5" />
          </Link>
          <Link
            to={`/update-form/${id}`}
            className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-colors duration-200 transform hover:scale-110"
          >
            <Edit className="w-5 h-5" />
          </Link>
          <button
            onClick={() => handelDelete(id)}
            className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors duration-200 transform hover:scale-110"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({rating}.0)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gradient">
              ₹{discountedPrice}
            </span>
            {originalPrice > discountedPrice && (
              <span className="text-lg text-gray-500 line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handelAddToCart}
          disabled={isLoading}
          className="w-full btn-gradient flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Card;

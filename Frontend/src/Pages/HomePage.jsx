import axios from "axios";
import { Filter, Search, Shield, Star, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../Components/ProductCard/Card.jsx";
import API from '../apiBase';

function HomePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const dataRedux = useSelector((state) => state.user);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API}/product/get-products`
      );
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handelDelete = async (id) => {
    const response = await axios.delete(
      `${API}/product/?id=${id}`
    );
    setData(response.data.data);
  };

  const categories = ["all", "male", "female", "kids"];

  const filteredProducts = data?.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-modern bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 text-white relative overflow-hidden">
        <div className="container-modern relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-float">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                EcoMart
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover amazing products with modern design and exceptional
              quality
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="btn-gradient text-lg px-8 py-4">
                Shop Now
              </button>
              <button className="btn-outline-modern bg-white/10 border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-4">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 bg-white/10 rounded-full animate-float"></div>
      </section>

      {/* Features Section */}
      <section className="section-modern bg-white">
        <div className="container-modern">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Quick and reliable shipping to your doorstep
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Your transactions are safe and protected
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">
                Premium quality guaranteed on every purchase
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section-modern bg-gray-50">
        <div className="container-modern">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our <span className="text-gradient">Products</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collection of premium products
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern pl-10 w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-modern pl-10 pr-10 capitalize"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card-modern h-96">
                  <div className="skeleton h-56 w-full"></div>
                  <div className="p-5 space-y-3">
                    <div className="skeleton h-4 w-3/4"></div>
                    <div className="skeleton h-3 w-full"></div>
                    <div className="skeleton h-3 w-2/3"></div>
                    <div className="skeleton h-8 w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product._id}
                  title={product.title}
                  image={
                    product.images[0] ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  description={product.description}
                  originalPrice={product.originalPrice}
                  discountedPrice={product.discountedPrice}
                  rating={product.rating}
                  id={product._id}
                  handelDelete={handelDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-modern bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container-modern text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of satisfied customers and find your perfect products
            today
          </p>
          <button className="btn-gradient bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4">
            Browse All Products
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Globe, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  TrendingUp,
  Users,
  Package,
  Truck,
  Shield
} from 'lucide-react';

const Marketplace = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'grains', name: 'Grains & Cereals' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'spices', name: 'Spices' },
    { id: 'dairy', name: 'Dairy Products' }
  ];

  const products = [
    {
      id: 1,
      name: 'Premium Basmati Rice',
      category: 'grains',
      price: '₹85/kg',
      farmer: 'Rajesh Kumar',
      location: 'Punjab',
      rating: 4.8,
      reviews: 124,
      available: '500 kg',
      certified: true,
      image: '🌾'
    },
    {
      id: 2,
      name: 'Fresh Tomatoes',
      category: 'vegetables',
      price: '₹40/kg',
      farmer: 'Amit Singh',
      location: 'Maharashtra',
      rating: 4.6,
      reviews: 89,
      available: '200 kg',
      certified: true,
      image: '🍅'
    },
    {
      id: 3,
      name: 'Organic Turmeric',
      category: 'spices',
      price: '₹180/kg',
      farmer: 'Lakshmi Reddy',
      location: 'Karnataka',
      rating: 4.9,
      reviews: 156,
      available: '100 kg',
      certified: true,
      image: '🧡'
    },
    {
      id: 4,
      name: 'Fresh Mangoes',
      category: 'fruits',
      price: '₹120/kg',
      farmer: 'Sanjay Patel',
      location: 'Gujarat',
      rating: 4.7,
      reviews: 203,
      available: '300 kg',
      certified: false,
      image: '🥭'
    },
    {
      id: 5,
      name: 'Pure Ghee',
      category: 'dairy',
      price: '₹450/kg',
      farmer: 'Meera Sharma',
      location: 'Rajasthan',
      rating: 4.9,
      reviews: 178,
      available: '50 kg',
      certified: true,
      image: '🧈'
    },
    {
      id: 6,
      name: 'Wheat Grains',
      category: 'grains',
      price: '₹30/kg',
      farmer: 'Vikram Singh',
      location: 'Uttar Pradesh',
      rating: 4.5,
      reviews: 92,
      available: '1000 kg',
      certified: true,
      image: '🌾'
    }
  ];

  const stats = [
    { icon: Package, label: 'Active Listings', value: '2,500+' },
    { icon: Users, label: 'Verified Farmers', value: '10,000+' },
    { icon: Truck, label: 'Completed Orders', value: '50,000+' },
    { icon: Shield, label: 'Secure Transactions', value: '₹100Cr+' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-900">AgriChain</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 relative">
              <Link 
                to="/"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors py-5"
              >
                Home
              </Link>
              <Link 
                to="/marketplace" 
                className="text-green-600 font-medium transition-colors py-5"
              >
                Marketplace
              </Link>
              <Link 
                to="/how-it-works" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors py-5"
              >
                How It Works
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors py-5"
              >
                About
              </Link>
              
              {/* Moving Underline */}
              <div 
                className="absolute bottom-0 h-0.5 bg-green-600 transition-all duration-300 ease-in-out"
                style={{
                  width: '108px',
                  left: '120px',
                }}
              />
            </div>

            {/* Right Side Items */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-green-600 transition-colors">
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-green-600 transition-colors">
                <Globe className="w-5 h-5" />
              </button>
              <button 
                onClick={toggleDarkMode}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link 
                to="/login"
                className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Register
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-600 hover:text-green-600 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 -mx-4 px-4 py-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/"
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/marketplace" 
                  className="text-green-600 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Marketplace
                </Link>
                <Link 
                  to="/how-it-works" 
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Agricultural Marketplace
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Connect directly with verified farmers and get fresh, quality produce at fair prices
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products, farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{product.image}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    {product.certified && (
                      <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Certified
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-3 h-3 mr-1" />
                      {product.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-3 h-3 mr-1" />
                      {product.farmer}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Package className="w-3 h-3 mr-1" />
                      {product.available} available
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-green-600">{product.price}</span>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                      Contact Farmer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-green-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of farmers already selling their produce on AgriChain
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Register as Farmer
            </Link>
            <Link 
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Register as Buyer
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 AgriChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Marketplace;

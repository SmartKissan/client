import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Globe, 
  Sun, 
  Moon, 
  Menu, 
  X,
  ArrowRight,
  Users,
  Truck,
  Shield,
  Smartphone
} from 'lucide-react';

const HowItWorks = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const steps = [
    {
      number: "1",
      icon: Users,
      title: "Create Account",
      description: "Sign up as a farmer, buyer, or logistics provider with email verification and Aadhaar authentication."
    },
    {
      number: "2", 
      icon: ShoppingCart,
      title: "Browse Marketplace",
      description: "Explore available products, connect with verified partners, and discover new opportunities."
    },
    {
      number: "3",
      icon: Shield,
      title: "Secure Transactions",
      description: "Execute smart contracts with escrow protection and blockchain-based provenance tracking."
    },
    {
      number: "4",
      icon: Truck,
      title: "Logistics & Delivery",
      description: "Coordinate transportation and delivery with trusted logistics partners in real-time."
    }
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar - Same as Home */}
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
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/marketplace" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Marketplace
              </Link>
              <Link 
                to="/how-it-works" 
                className="text-green-600 font-medium transition-colors"
              >
                How It Works
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                About
              </Link>
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
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/marketplace" 
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Marketplace
                </Link>
                <Link 
                  to="/how-it-works" 
                  className="text-green-600 font-medium transition-colors"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Simple steps to transform your agricultural supply chain with AgriChain
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index}
                className="flex items-start space-x-6 p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Icon className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-green-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of farmers and buyers already using AgriChain
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Account
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link 
              to="/marketplace"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600 py-8">
            <p>&copy; 2024 AgriChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;

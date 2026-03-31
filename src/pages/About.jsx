import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Globe, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Users,
  Target,
  Award,
  Heart
} from 'lucide-react';

const About = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const values = [
    {
      icon: Target,
      title: "Mission",
      description: "To empower farmers and revolutionize agricultural supply chains through technology, transparency, and trust."
    },
    {
      icon: Award,
      title: "Vision", 
      description: "To create a global agricultural ecosystem where every farmer has direct access to markets and fair prices."
    },
    {
      icon: Heart,
      title: "Values",
      description: "Transparency, fairness, innovation, and sustainability guide everything we do at AgriChain."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Farmers Connected" },
    { number: "50,000+", label: "Active Buyers" },
    { number: "₹100Cr+", label: "Transactions Processed" },
    { number: "25+", label: "States Covered" }
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
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                How It Works
              </Link>
              <Link 
                to="/about" 
                className="text-green-600 font-medium transition-colors"
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
                className="px-4 paras py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
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
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link 
                  to="/about" 
                  className="text-green-600 font-medium transition-colors"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About AgriChain
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're building the future of agricultural supply chains with technology, trust, and transparency
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div 
                  key={index}
                  className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-green-50 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Our Story
          </h2>
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p className="mb-4">
              AgriChain was born from a simple observation: farmers deserve better. We saw hardworking farmers 
              struggling with complex supply chains, middlemen taking unfair cuts, and lack of direct market access.
            </p>
            <p className="mb-4">
              Founded in 2024, our mission was to leverage blockchain technology, smart contracts, and modern 
              logistics to create a transparent, efficient agricultural marketplace. We wanted to put power back 
              into the hands of those who feed our nation.
            </p>
            <p>
              Today, AgriChain connects thousands of farmers directly with buyers, ensuring fair prices, 
              secure transactions, and complete transparency. We're not just building a platform; we're 
              building a movement to transform Indian agriculture.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-gray-600 mb-8">
            A diverse team of technologists, agriculturists, and supply chain experts
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {['Engineering', 'Agriculture', 'Logistics', 'Support'].map((team, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{team} Team</h3>
                <p className="text-sm text-gray-600">Experts in {team.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Join Us in Revolutionizing Agriculture
          </h2>
          <p className="text-gray-600 mb-6">
            Whether you're a farmer, buyer, or logistics partner, there's a place for you in AgriChain
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register"
              className="inline-flex items-center px-6 paras py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Join AgriChain Today
            </Link>
            <Link 
              to="/contact"
              className="inline-flex items-center px-6 paras py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 paras sm:px-6 lg:px-8">
          <div className="text-center text-gray- paras 600 py-8">
            <p>&copy; 2024 AgriChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;

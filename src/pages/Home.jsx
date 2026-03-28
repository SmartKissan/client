import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
      <Navbar />
      
      {/* Hero Section with Glassmorphism */}
      <div className="relative pt-20 sm:pt-24 lg:pt-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-8rem)]">
            {/* Left Content */}
            <div className="text-center lg:text-left z-10">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-green-200 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Empowering Farmers
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                <span className="block">Grow with</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300">
                  Smart Kissan
                </span>
              </h1>
              
              <p className="mt-6 text-lg sm:text-xl text-green-100/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect directly with buyers, manage logistics, and transform your agricultural business with our cutting-edge digital platform.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-bold text-green-900 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl overflow-hidden shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started Free
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-semibold text-white bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto lg:mx-0">
                {[
                  { value: '10K+', label: 'Farmers' },
                  { value: '50K+', label: 'Buyers' },
                  { value: '₹100Cr+', label: 'Transactions' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-yellow-400">{stat.value}</div>
                    <div className="text-sm text-green-200/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Hero Image/Graphic */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                {/* Glass Card */}
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 bg-white/5 rounded-xl p-4">
                      <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-semibold">Direct Sales</div>
                        <div className="text-green-200/70 text-sm">No middlemen, better prices</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 bg-white/5 rounded-xl p-4">
                      <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-semibold">Verified Trust</div>
                        <div className="text-green-200/70 text-sm">Aadhaar verified profiles</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 bg-white/5 rounded-xl p-4">
                      <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-white font-semibold">Fast Logistics</div>
                        <div className="text-green-200/70 text-sm">Quick & safe transport</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Glass Cards */}
      <div className="py-16 sm:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-green-300 font-semibold tracking-wider uppercase text-sm">Features</span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Everything You Need to <span className="text-yellow-400">Succeed</span>
            </h2>
            <p className="mt-4 text-lg text-green-100/70 max-w-2xl mx-auto">
              Powerful tools designed specifically for the modern farmer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                title: 'Direct Marketplace',
                desc: 'Connect directly with buyers and sellers. Eliminate middlemen and get better prices for your produce.',
                color: 'from-green-400/20 to-emerald-500/20',
                iconColor: 'text-green-400'
              },
              {
                icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                title: 'Verified Profiles',
                desc: 'Aadhaar verified profiles ensure trust and security in all your transactions and partnerships.',
                color: 'from-blue-400/20 to-cyan-500/20',
                iconColor: 'text-blue-400'
              },
              {
                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                title: 'Fast Logistics',
                desc: 'Integrated logistics support to transport your goods quickly, safely, and cost-effectively.',
                color: 'from-purple-400/20 to-pink-500/20',
                iconColor: 'text-purple-400'
              },
              {
                icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
                title: 'Analytics Dashboard',
                desc: 'Track your sales, monitor market trends, and make data-driven decisions for your farm.',
                color: 'from-yellow-400/20 to-orange-500/20',
                iconColor: 'text-yellow-400'
              },
              {
                icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                title: 'Secure Payments',
                desc: 'Safe and transparent payment processing with multiple payment options available.',
                color: 'from-red-400/20 to-rose-500/20',
                iconColor: 'text-red-400'
              },
              {
                icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 3v9m0 0v9m0-9h9m-9 0H3',
                title: '24/7 Support',
                desc: 'Round-the-clock customer support to help you with any issues or questions.',
                color: 'from-teal-400/20 to-cyan-500/20',
                iconColor: 'text-teal-400'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl sm:rounded-3xl`}></div>
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className={`w-7 h-7 sm:w-8 sm:h-8 ${feature.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-green-100/70 leading-relaxed text-sm sm:text-base">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 lg:p-16 border border-white/20 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your <span className="text-yellow-400">Farm Business</span>?
            </h2>
            <p className="text-lg sm:text-xl text-green-100/80 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers and buyers already using Smart Kissan to grow their agricultural business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-green-900 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl hover:from-yellow-300 hover:to-yellow-400 shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                Start For Free
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-2xl hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Smart Kissan</span>
            </div>
            <p className="text-green-200/60 text-sm">
              © 2024 Smart Kissan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

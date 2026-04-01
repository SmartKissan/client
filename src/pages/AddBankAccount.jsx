import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wallet, ArrowLeft, Loader2, Building2, CreditCard, User, Landmark } from 'lucide-react';
import { walletService } from '../services/walletService.js';
import { useToast } from '../context/ToastContext.jsx';

const AddBankAccount = () => {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }
    
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Invalid account number (9-18 digits)';
    }
    
    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(formData.ifscCode)) {
      newErrors.ifscCode = 'Invalid IFSC code format (e.g., SBIN0001234)';
    }
    
    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await walletService.addBankAccount({
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode.toUpperCase(),
        accountHolderName: formData.accountHolderName
      });

      if (response.success) {
        success('Bank account added successfully!');
        navigate('/wallet');
      }
    } catch (err) {
      console.error('Add bank account error:', err);
      toastError(err.response?.data?.message || 'Failed to add bank account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/profile" 
            className="inline-flex items-center text-gray-600 hover:text-emerald-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Add Bank Account</h1>
              <p className="text-sm text-gray-600">Link your bank account for withdrawals</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bank Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-500" />
                  Bank Name
                </span>
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="e.g., State Bank of India"
                className={`w-full px-4 py-3 rounded-xl border ${errors.bankName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/60 backdrop-blur-sm transition-all`}
              />
              {errors.bankName && (
                <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
              )}
            </div>

            {/* Account Holder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  Account Holder Name
                </span>
              </label>
              <input
                type="text"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleChange}
                placeholder="Full name as per bank records"
                className={`w-full px-4 py-3 rounded-xl border ${errors.accountHolderName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/60 backdrop-blur-sm transition-all`}
              />
              {errors.accountHolderName && (
                <p className="text-red-500 text-xs mt-1">{errors.accountHolderName}</p>
              )}
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  Account Number
                </span>
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="9-18 digit account number"
                maxLength={18}
                className={`w-full px-4 py-3 rounded-xl border ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/60 backdrop-blur-sm transition-all`}
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
              )}
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-500" />
                  IFSC Code
                </span>
              </label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="e.g., SBIN0001234"
                maxLength={11}
                className={`w-full px-4 py-3 rounded-xl border ${errors.ifscCode ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/60 backdrop-blur-sm transition-all uppercase`}
              />
              {errors.ifscCode && (
                <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-500/30"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Adding Account...
                </span>
              ) : (
                'Add Bank Account'
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-700">
              <strong className="font-medium">Note:</strong> Your bank details are securely encrypted. 
              We use this information only for processing withdrawals to your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBankAccount;

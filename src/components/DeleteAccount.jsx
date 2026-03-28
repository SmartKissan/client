import React, { useState } from 'react';
import { Trash2, AlertTriangle, Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService.js';
import { formatError } from '../utils/errorHandler.js';
import api from '../services/api';

const DeleteAccount = ({ user, onAccountDeleted }) => {
  const [step, setStep] = useState('confirm'); // confirm, otp, success
  const [otp, setOtp] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const handleRequestOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/otp/delete-account/request');
      setMaskedEmail(response.data.data.email);
      setStep('otp');
      setCountdown(600); // 10 minutes in seconds
      
      // Start countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      const formattedError = formatError(err);
      setError(formattedError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/otp/delete-account/confirm', { otp });
      setStep('success');
      
      // Clear local storage and cookies
      localStorage.removeItem('token');
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Notify parent component
      setTimeout(() => {
        onAccountDeleted?.();
      }, 2000);
    } catch (err) {
      const formattedError = formatError(err);
      setError(formattedError.message);
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    await handleRequestOTP();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    setStep('confirm');
    setOtp('');
    setError('');
  };

  if (step === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Account Deleted</h3>
        <p className="text-green-600 mb-4">Your account has been permanently deleted. Redirecting...</p>
        <div className="w-full bg-green-200 rounded-full h-1">
          <div className="bg-green-500 h-1 rounded-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <Trash2 className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Delete Account</h3>
          <p className="text-sm text-red-600">This action cannot be undone</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      )}

      {step === 'confirm' ? (
        /* Confirmation Step */
        <div className="space-y-5">
          <div className="bg-white border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-gray-900 mb-2">Warning: Permanent Deletion</p>
                <ul className="space-y-1.5 list-disc list-inside text-gray-600">
                  <li>All your data will be permanently removed</li>
                  <li>You will lose access to all services</li>
                  <li>This action cannot be reversed</li>
                  <li>You will need to create a new account to use our services again</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handleRequestOTP}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Sending OTP...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Send OTP to Email
              </>
            )}
          </button>
        </div>
      ) : (
        /* OTP Verification Step */
        <div className="space-y-5">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to confirmation
          </button>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-base font-semibold text-gray-900 mb-1">Verify Your Identity</h4>
            <p className="text-gray-500 text-sm mb-1">
              We've sent a 6-digit OTP to
            </p>
            <p className="text-blue-600 font-medium text-sm">{maskedEmail}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Enter OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-center text-xl font-mono tracking-[0.5em] placeholder:text-gray-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {countdown > 0 ? (
                  <span className="text-amber-600">
                    Expires in {formatTime(countdown)}
                  </span>
                ) : (
                  <span className="text-red-600">OTP expired</span>
                )}
              </span>
              <button
                onClick={handleResendOTP}
                disabled={countdown > 0 || loading}
                className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Resend OTP
              </button>
            </div>

            <button
              onClick={handleConfirmDelete}
              disabled={loading || otp.length !== 6}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Deleting Account...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Permanently Delete Account
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;

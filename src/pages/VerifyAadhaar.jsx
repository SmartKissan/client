import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { otpService } from '../services/otpService.js';

const VerifyAadhaar = () => {
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const sendAadhaarOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await otpService.sendAadhaarOTP(aadhaar);
      success(response.message || 'OTP sent to your registered email');
      setOtpSent(true);
      setTimer(300);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyAadhaarOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await otpService.verifyAadhaarOTP(otp);
      success('Aadhaar verified successfully!');
      navigate('/dashboard');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Aadhaar
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {otpSent 
              ? `Enter the OTP sent to ${user?.email}` 
              : 'Enter your 12-digit Aadhaar number to receive OTP via email'
            }
          </p>
        </div>

        {!otpSent ? (
          <form className="mt-8 space-y-6" onSubmit={sendAadhaarOTP}>
            <div>
              <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700">
                Aadhaar Number
              </label>
              <input
                id="aadhaar"
                name="aadhaar"
                type="text"
                required
                maxLength={12}
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="123456789012"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter your 12-digit Aadhaar number
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || aadhaar.length !== 12}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP to Email'}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={verifyAadhaarOTP}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-center text-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="000000"
              />
              <p className="mt-1 text-xs text-gray-500">
                Check your email for the 6-digit OTP
              </p>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setTimer(0);
                }}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Change Aadhaar
              </button>

              {timer > 0 ? (
                <span className="text-sm text-gray-500">
                  Resend in {formatTime(timer)}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={sendAadhaarOTP}
                  disabled={loading}
                  className="text-sm text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Aadhaar'}
            </button>
          </form>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAadhaar;

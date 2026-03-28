import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { otpService } from '../services/otpService';
import OTPInput from '../components/OTPInput';
import CountdownTimer from '../components/CountdownTimer';
import { formatError } from '../utils/errorHandler.js';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [email, setEmail] = useState(searchParams.get('email') || user?.email || '');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/login');
      return;
    }
  }, [email, navigate]);

  const handleSendOTP = async () => {
    if (!email) {
      setFieldErrors({ email: 'Email is required' });
      return;
    }

    setIsSending(true);
    setFieldErrors({});
    setSuccess('');

    try {
      await otpService.sendEmailOTP(email);
      setSuccess('OTP sent to your email successfully!');
      setOtpSent(true);
    } catch (error) {
      const formattedError = formatError(error);
      
      // Set field-specific errors
      if (formattedError.serverMessage?.toLowerCase().includes('email')) {
        setFieldErrors({ email: formattedError.message });
      } else {
        setFieldErrors({ general: formattedError.message });
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setFieldErrors({ otp: 'Please enter a 6-digit OTP' });
      return;
    }

    setIsVerifying(true);
    setFieldErrors({});
    setSuccess('');

    try {
      const response = await otpService.verifyEmailOTP(email, otp);
      setSuccess('Email verified successfully!');
      
      // Redirect to dashboard or next step after successful verification
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      const formattedError = formatError(error);
      
      // Set field-specific errors
      if (formattedError.serverMessage?.toLowerCase().includes('otp')) {
        setFieldErrors({ otp: formattedError.message });
      } else {
        setFieldErrors({ general: formattedError.message });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOTPExpire = () => {
    setFieldErrors({ general: 'OTP has expired. Please request a new one.' });
    setOtp('');
    setOtpSent(false);
  };

  const handleResendOTP = () => {
    setOtp('');
    setFieldErrors({});
    setSuccess('');
    handleSendOTP();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit code to {email}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {!otpSent ? (
            <div>
              <button
                onClick={handleSendOTP}
                disabled={isSending || !email}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Enter 6-digit OTP
                </label>
                <OTPInput
                  length={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={isVerifying}
                />
              </div>

              <div className="flex justify-center">
                <CountdownTimer
                  initialMinutes={5}
                  onExpire={handleOTPExpire}
                  onReset={handleResendOTP}
                />
              </div>

              <div>
                <button
                  onClick={handleVerifyOTP}
                  disabled={isVerifying || otp.length !== 6}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? 'Verifying...' : 'Verify Email'}
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={handleResendOTP}
                  disabled={isSending}
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-gray-500 text-sm"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;

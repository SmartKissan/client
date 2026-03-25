import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { otpService } from '../services/otpService';
import OTPInput from '../components/OTPInput';
import CountdownTimer from '../components/CountdownTimer';
import { useToast } from '../context/ToastContext';

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError } = useToast();
  
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Verify OTP, 3: New Password
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verifiedOTP, setVerifiedOTP] = useState(''); // Store verified OTP temporarily

  // Step 1: Send OTP to email
  const handleSendOTP = async () => {
    if (!email) {
      toastError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toastError('Please enter a valid email address');
      return;
    }

    setIsSending(true);

    try {
      await otpService.sendPasswordResetOTP(email);
      toastSuccess('OTP sent to your email successfully!');
      setOtpSent(true);
      setStep(2); // Move to OTP verification step
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSending(false);
    }
  };

  // Step 2: Verify OTP only (no password yet)
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toastError('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      // Call verify endpoint without new password
      const response = await otpService.verifyPasswordResetOTPOnly(email, otp);
      
      toastSuccess('OTP verified successfully!');
      setVerifiedOTP(otp); // Store the verified OTP
      setStep(3); // Move to new password step
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Invalid OTP';
      toastError(errorMsg);
      
      // If OTP is wrong, redirect back to email step
      setTimeout(() => {
        setOtp('');
        setOtpSent(false);
        setStep(1);
        toastError('Please request a new OTP');
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password with verified OTP
  const handleResetPassword = async () => {
    if (!newPassword) {
      toastError('New password is required');
      return;
    }

    if (newPassword.length < 6) {
      toastError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toastError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await otpService.verifyPasswordResetOTP(email, verifiedOTP, newPassword);
      toastSuccess('Password reset successfully!');
      
      // Redirect to login after successful reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toastError(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPExpire = () => {
    toastError('OTP has expired. Please request a new one.');
    setOtp('');
    setVerifiedOTP('');
    setOtpSent(false);
    setStep(1);
  };

  const handleResendOTP = () => {
    setOtp('');
    setVerifiedOTP('');
    setNewPassword('');
    setConfirmPassword('');
    handleSendOTP();
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleChangeEmail = () => {
    setOtp('');
    setVerifiedOTP('');
    setOtpSent(false);
    setStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 1 && 'Enter your email to receive a reset code'}
            {step === 2 && 'Enter the verification code sent to your email'}
            {step === 3 && 'Enter your new password'}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Step 1: Email Input */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                onClick={handleSendOTP}
                disabled={isSending || !email}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? 'Sending...' : 'Send Reset Code'}
              </button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600">
                  Reset code sent to: <span className="font-medium">{email}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Enter 6-digit Code
                </label>
                <OTPInput
                  length={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={isLoading}
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
                  disabled={isLoading || otp.length !== 6}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </button>
              </div>

              <div className="text-center space-y-2">
                <button
                  onClick={handleResendOTP}
                  disabled={isSending}
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : 'Resend Code'}
                </button>
                
                <div>
                  <button
                    onClick={handleChangeEmail}
                    className="text-gray-600 hover:text-gray-500 text-sm block"
                  >
                    Change Email
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-green-600 font-medium">
                  ✓ OTP verified successfully
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Create your new password
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={handleResetPassword}
                  disabled={isLoading || !newPassword || !confirmPassword}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={handleChangeEmail}
                  className="text-gray-600 hover:text-gray-500 text-sm"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={handleBackToLogin}
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

export default PasswordReset;

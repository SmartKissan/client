import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({ 
  length = 6, 
  value = '', 
  onChange, 
  disabled = false,
  autoFocus = true 
}) => {
  const [otpValues, setOtpValues] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    // Initialize OTP values from prop
    if (value) {
      const values = value.split('').slice(0, length);
      const newValues = new Array(length).fill('');
      values.forEach((val, index) => {
        newValues[index] = val;
      });
      setOtpValues(newValues);
    }
  }, [value, length]);

  const handleChange = (index, val) => {
    // Only allow numbers
    const numVal = val.replace(/[^0-9]/g, '');
    
    if (numVal.length > 1) {
      // Handle paste case
      const pastedValues = numVal.split('').slice(0, length - index);
      const newValues = [...otpValues];
      pastedValues.forEach((pasteVal, pasteIndex) => {
        newValues[index + pasteIndex] = pasteVal;
      });
      setOtpValues(newValues);
      
      // Focus on the next empty input or the last one
      const nextEmptyIndex = newValues.findIndex(v => v === '');
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
      
      // Call onChange with complete OTP
      const completeOTP = newValues.join('');
      if (completeOTP.length === length) {
        onChange(completeOTP);
      }
    } else {
      // Handle single digit input
      const newValues = [...otpValues];
      newValues[index] = numVal;
      setOtpValues(newValues);
      
      // Call onChange with complete OTP
      const completeOTP = newValues.join('');
      onChange(completeOTP);
      
      // Auto-focus next input
      if (numVal && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newValues = [...otpValues];
      newValues[index - 1] = '';
      setOtpValues(newValues);
      onChange(newValues.join(''));
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numVal = pastedData.replace(/[^0-9]/g, '');
    
    if (numVal) {
      handleChange(0, numVal);
    }
  };

  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otpValues[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="0"
        />
      ))}
    </div>
  );
};

export default OTPInput;

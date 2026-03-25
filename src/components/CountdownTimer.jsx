import React, { useState, useEffect, useCallback } from 'react';

const CountdownTimer = ({ 
  initialMinutes = 5, 
  onExpire, 
  onReset,
  isActive = true 
}) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    setTimeLeft(initialMinutes * 60);
    setIsExpired(false);
  }, [initialMinutes]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft <= 0 && !isExpired) {
        setIsExpired(true);
        onExpire?.();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setIsExpired(true);
          onExpire?.();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isActive, onExpire, isExpired]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = useCallback(() => {
    setTimeLeft(initialMinutes * 60);
    setIsExpired(false);
    onReset?.();
  }, [initialMinutes, onReset]);

  return (
    <div className="text-center">
      <div className={`text-lg font-semibold ${isExpired ? 'text-red-600' : 'text-gray-700'}`}>
        {formatTime(timeLeft)}
      </div>
      {isExpired && (
        <div className="mt-2">
          <p className="text-red-600 text-sm">OTP has expired</p>
          <button
            onClick={handleReset}
            className="mt-1 text-indigo-600 hover:text-indigo-500 text-sm font-medium underline"
          >
            Resend OTP
          </button>
        </div>
      )}
      {!isExpired && timeLeft > 0 && (
        <p className="text-gray-500 text-sm mt-1">
          OTP expires in {formatTime(timeLeft)}
        </p>
      )}
    </div>
  );
};

export default CountdownTimer;

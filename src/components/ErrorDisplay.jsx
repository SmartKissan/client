import React from 'react';
import { AlertCircle, WifiOff, Clock, Server, Shield } from 'lucide-react';

const ErrorDisplay = ({ error, className = "" }) => {
  if (!error) return null;

  const getErrorIcon = (type) => {
    switch (type) {
      case 'TIMEOUT_ERROR':
        return <Clock className="w-5 h-5" />;
      case 'NETWORK_ERROR':
        return <WifiOff className="w-5 h-5" />;
      case 'API_ERROR':
        return <Server className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getErrorColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const getErrorTitle = (type, status) => {
    if (type === 'TIMEOUT_ERROR') return 'Request Timeout';
    if (type === 'NETWORK_ERROR') return 'Network Error';
    if (type === 'API_ERROR') {
      if (status === 401) return 'Authentication Required';
      if (status === 403) return 'Access Denied';
      if (status === 404) return 'Not Found';
      if (status === 409) return 'Conflict';
      if (status === 429) return 'Too Many Requests';
      if (status >= 500) return 'Server Error';
      return 'API Error';
    }
    return 'Error';
  };

  return (
    <div className={`border rounded-lg p-4 ${getErrorColor(error.severity)} ${className}`}>
      <div className="flex items-start gap-3">
        {getErrorIcon(error.type)}
        <div className="flex-1">
          <div className="font-semibold text-sm mb-1">
            {getErrorTitle(error.type, error.status)}
          </div>
          <div className="text-sm opacity-90 mb-2">
            {error.message}
          </div>
          
          {/* Error Details */}
          <div className="text-xs space-y-1 opacity-75">
            {error.type && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Type:</span>
                <span>{error.type}</span>
              </div>
            )}
            {error.status && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <span>{error.status} {error.statusText}</span>
              </div>
            )}
            {error.serverMessage && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Server:</span>
                <span className="truncate">{error.serverMessage}</span>
              </div>
            )}
            {error.timestamp && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Time:</span>
                <span>{new Date(error.timestamp).toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          {/* Recoverable Error Actions */}
          {error.recoverable && (
            <div className="mt-3 pt-3 border-t border-current border-opacity-20">
              <div className="text-xs flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>This error might be temporary. You can try again.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;

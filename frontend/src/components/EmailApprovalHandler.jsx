import React, { useState, useEffect } from 'react';
import {
  CheckCircle, XCircle, Clock, AlertTriangle,
  RefreshCw, ArrowLeft, Home, Mail
} from 'lucide-react';

const EmailApprovalHandler = () => {
  // Get token from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  // Simple navigation function
  const navigateToDashboard = () => {
    window.location.href = '/';
  };
  const [status, setStatus] = useState('loading'); // loading, success, error, expired
  const [approvalData, setApprovalData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (token) {
      // Verify token and get approval details
      verifyApprovalToken();
    }
  }, [token]);

  const verifyApprovalToken = async () => {
    try {
      // This would typically call an API endpoint to verify the token
      // For now, we'll simulate the verification
      setTimeout(() => {
        // Simulate token verification - in real app, call API
        setApprovalData({
          id: '1',
          reference_title: 'Maintenance Request - Office AC Repair',
          approval_type: 'maintenance_request',
          approver_name: 'John Doe',
          description: 'Air conditioning system repair in main office building',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        });
        setStatus('verified');
      }, 1000);
    } catch (error) {
      setStatus('error');
    }
  };

  const handleApproval = async (action) => {
    setIsProcessing(true);

    try {
      let response;
      if (action === 'approve') {
        response = await fetch(`http://localhost:8000/api/email-approvals/approve/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notes: 'Approved via email link'
          })
        });
      } else {
        response = await fetch(`http://localhost:8000/api/email-approvals/reject/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reason: 'Rejected via email link'
          })
        });
      }

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error processing approval:', error);
      setStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderLoading = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Approval Link</h2>
        <p className="text-gray-600">Please wait while we verify your approval request...</p>
      </div>
    </div>
  );

  const renderVerified = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-full">
                <Mail className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center">Approval Request</h1>
            <p className="text-center text-blue-100 mt-2">One-click approval system</p>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Hello {approvalData?.approver_name},</h2>
              <p className="text-gray-600">You have an approval request that requires your attention.</p>
            </div>

            {/* Approval Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Title:</span>
                  <p className="text-gray-900 mt-1">{approvalData?.reference_title}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <p className="text-gray-900 mt-1 capitalize">
                    {approvalData?.approval_type.replace('_', ' ')}
                  </p>
                </div>
                {approvalData?.description && (
                  <div>
                    <span className="font-medium text-gray-700">Description:</span>
                    <p className="text-gray-900 mt-1">{approvalData.description}</p>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500 mt-4">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Expires: {new Date(approvalData?.expires_at).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => handleApproval('approve')}
                  disabled={isProcessing}
                  className="flex-1 max-w-xs bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  <span>{isProcessing ? 'Processing...' : 'Approve Request'}</span>
                </button>

                <button
                  onClick={() => handleApproval('reject')}
                  disabled={isProcessing}
                  className="flex-1 max-w-xs bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <XCircle className="w-5 h-5" />
                  <span>Reject Request</span>
                </button>
              </div>

              <p className="text-sm text-gray-500">
                This action cannot be undone. The requester will be notified of your decision.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <button
            onClick={navigateToDashboard}
            className="text-blue-600 hover:text-blue-700 flex items-center justify-center space-x-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
        <p className="text-gray-600 mb-6">Your approval has been recorded successfully.</p>
        <p className="text-sm text-gray-500 mb-8">
          The requester has been automatically notified of your decision.
        </p>
        <button
          onClick={navigateToDashboard}
          className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600 mb-6">
          There was an error processing your approval request. The link may be invalid or expired.
        </p>
        <button
          onClick={navigateToDashboard}
          className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );

  switch (status) {
    case 'loading':
      return renderLoading();
    case 'verified':
      return renderVerified();
    case 'success':
      return renderSuccess();
    case 'error':
    default:
      return renderError();
  }
};

export default EmailApprovalHandler;
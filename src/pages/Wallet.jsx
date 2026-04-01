import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Send,
  Building2,
  CreditCard,
  Loader2,
  X,
  CheckCircle,
  Clock,
  ArrowRight,
  History,
  Trash2,
  Star
} from 'lucide-react';
import { walletService, razorpayService } from '../services/walletService.js';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const WalletPage = () => {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const { user } = useAuth();
  
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, add, withdraw, send, history
  
  // Form states
  const [addAmount, setAddAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [recipientUpi, setRecipientUpi] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendNote, setSendNote] = useState('');
  const [sendPaymentMethod, setSendPaymentMethod] = useState('wallet'); // 'wallet' or 'razorpay'
  const [processing, setProcessing] = useState(false);

  const fetchWalletData = useCallback(async () => {
    try {
      const [walletRes, transactionsRes] = await Promise.all([
        walletService.getWallet(),
        walletService.getTransactions({ limit: 10 })
      ]);
      
      if (walletRes.success) {
        setWallet(walletRes.wallet);
      }
      if (transactionsRes.success) {
        setTransactions(transactionsRes.transactions);
      }
    } catch (err) {
      console.error('Fetch wallet error:', err);
      toastError('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Add Money
  const handleAddMoney = async () => {
    if (!addAmount || addAmount < 1) {
      toastError('Please enter a valid amount (minimum ₹1)');
      return;
    }

    setProcessing(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toastError('Failed to load payment gateway');
        return;
      }

      // Create order
      const orderRes = await razorpayService.createOrder(parseFloat(addAmount));
      if (!orderRes.success) {
        toastError(orderRes.message || 'Failed to create order');
        return;
      }

      // Get Razorpay key
      const keyRes = await razorpayService.getKey();

      const options = {
        key: keyRes.keyId,
        amount: orderRes.amount,
        currency: "INR",
        name: "AgriChain Wallet",
        description: "Add money to wallet",
        order_id: orderRes.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await razorpayService.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.success) {
              success(`₹${addAmount} added successfully!`);
              setAddAmount('');
              setActiveTab('overview');
              fetchWalletData();
            }
          } catch (err) {
            toastError('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || ''
        },
        theme: {
          color: "#10B981"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Add money error:', err);
      toastError('Failed to initiate payment');
    } finally {
      setProcessing(false);
    }
  };

  // Handle Withdraw
  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount < 1) {
      toastError('Please enter a valid amount');
      return;
    }
    if (!selectedBank) {
      toastError('Please select a bank account');
      return;
    }
    if (parseFloat(withdrawAmount) > wallet?.balance) {
      toastError('Insufficient balance');
      return;
    }

    setProcessing(true);
    try {
      const res = await walletService.withdrawMoney({
        amount: parseFloat(withdrawAmount),
        bankAccountId: selectedBank
      });

      if (res.success) {
        success(`₹${withdrawAmount} withdrawn successfully!`);
        setWithdrawAmount('');
        setSelectedBank('');
        setActiveTab('overview');
        fetchWalletData();
      }
    } catch (err) {
      console.error('Withdraw error:', err);
      toastError(err.response?.data?.message || 'Withdrawal failed');
    } finally {
      setProcessing(false);
    }
  };

  // Handle Send Money
  const handleSendMoney = async () => {
    if (!recipientUpi || !recipientUpi.includes('@')) {
      toastError('Please enter a valid UPI ID');
      return;
    }
    if (!sendAmount || sendAmount < 1) {
      toastError('Please enter a valid amount');
      return;
    }
    if (parseFloat(sendAmount) > wallet?.balance) {
      toastError('Insufficient balance');
      return;
    }

    setProcessing(true);
    try {
      const res = await walletService.sendMoney({
        recipientUpiId: recipientUpi,
        amount: parseFloat(sendAmount),
        note: sendNote
      });

      if (res.success) {
        success(`₹${sendAmount} sent successfully!`);
        setRecipientUpi('');
        setSendAmount('');
        setSendNote('');
        setActiveTab('overview');
        fetchWalletData();
      }
    } catch (err) {
      console.error('Send money error:', err);
      toastError(err.response?.data?.message || 'Failed to send money');
    } finally {
      setProcessing(false);
    }
  };

  // Handle Send Money via Razorpay
  const handleSendViaRazorpay = async () => {
    if (!recipientUpi || !recipientUpi.includes('@')) {
      toastError('Please enter a valid UPI ID');
      return;
    }
    if (!sendAmount || sendAmount < 1) {
      toastError('Please enter a valid amount');
      return;
    }

    setProcessing(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toastError('Failed to load payment gateway');
        return;
      }

      // Create order for sending money
      const orderRes = await razorpayService.createOrderForSend(parseFloat(sendAmount), recipientUpi, sendNote);
      if (!orderRes.success) {
        toastError(orderRes.message || 'Failed to create order');
        return;
      }

      const keyRes = await razorpayService.getKey();

      const options = {
        key: keyRes.keyId,
        amount: orderRes.amount,
        currency: "INR",
        name: "AgriChain Wallet",
        description: `Send money to ${recipientUpi}`,
        order_id: orderRes.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await razorpayService.verifyPaymentForSend({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              recipientUpiId: recipientUpi,
              amount: parseFloat(sendAmount),
              note: sendNote
            });

            if (verifyRes.success) {
              success(`₹${sendAmount} sent successfully to ${recipientUpi}!`);
              setRecipientUpi('');
              setSendAmount('');
              setSendNote('');
              setActiveTab('overview');
              fetchWalletData();
            }
          } catch (err) {
            toastError('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || ''
        },
        theme: {
          color: "#10B981"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Send via Razorpay error:', err);
      toastError('Failed to initiate payment');
    } finally {
      setProcessing(false);
    }
  };

  // Delete bank account
  const handleDeleteBank = async (accountId) => {
    if (!confirm('Are you sure you want to delete this bank account?')) return;
    
    try {
      await walletService.deleteBankAccount(accountId);
      success('Bank account deleted');
      fetchWalletData();
    } catch (err) {
      toastError('Failed to delete bank account');
    }
  };

  // Set default bank account
  const handleSetDefault = async (accountId) => {
    try {
      await walletService.setDefaultBankAccount(accountId);
      success('Default bank account updated');
      fetchWalletData();
    } catch (err) {
      toastError('Failed to update default account');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Get transaction icon
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'wallet_add':
        return <ArrowDownLeft className="w-5 h-5 text-emerald-500" />;
      case 'wallet_withdraw':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'wallet_send':
        return <Send className="w-5 h-5 text-orange-500" />;
      case 'wallet_receive':
        return <ArrowDownLeft className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  // Get transaction label
  const getTransactionLabel = (type) => {
    switch (type) {
      case 'wallet_add': return 'Added Money';
      case 'wallet_withdraw': return 'Withdrawn';
      case 'wallet_send': return 'Sent';
      case 'wallet_receive': return 'Received';
      default: return 'Transaction';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/profile" 
            className="inline-flex items-center text-gray-600 hover:text-emerald-600 transition-colors mb-4"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Profile
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Wallet</h1>
                <p className="text-sm text-gray-600">Manage your funds and transactions</p>
              </div>
            </div>
            {wallet?.upiId && (
              <div className="text-right">
                <p className="text-xs text-gray-500">Your UPI ID</p>
                <p className="font-medium text-emerald-600">{wallet.upiId}</p>
              </div>
            )}
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 text-white">
          <p className="text-emerald-100 text-sm mb-2">Available Balance</p>
          <h2 className="text-4xl font-bold mb-6">{formatCurrency(wallet?.balance)}</h2>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('add')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Money
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors border border-emerald-400"
            >
              <ArrowUpRight className="w-4 h-4" />
              Withdraw
            </button>
            <button
              onClick={() => setActiveTab('send')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors border border-emerald-400"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Total Added</p>
            <p className="font-semibold text-emerald-600">{formatCurrency(wallet?.totalDeposited)}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Total Withdrawn</p>
            <p className="font-semibold text-red-600">{formatCurrency(wallet?.totalWithdrawn)}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Total Sent</p>
            <p className="font-semibold text-orange-600">{formatCurrency(wallet?.totalSent)}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Total Received</p>
            <p className="font-semibold text-blue-600">{formatCurrency(wallet?.totalReceived)}</p>
          </div>
        </div>

        {/* Action Panels */}
        {activeTab === 'add' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Money to Wallet</h3>
              <button onClick={() => setActiveTab('overview')} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-2">
                {[100, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAddAmount(amt)}
                    className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <button
                onClick={handleAddMoney}
                disabled={processing || !addAmount}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 transition-all"
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Proceed to Pay'}
              </button>
              <p className="text-xs text-gray-500 text-center">
                Pay via UPI, PhonePe, Google Pay, Cards, NetBanking via Razorpay
              </p>
            </div>
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Withdraw to Bank</h3>
              <button onClick={() => setActiveTab('overview')} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {wallet?.bankAccounts?.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-2">No Bank Account Connected</p>
                <p className="text-gray-500 text-sm mb-4">Please add a bank account to withdraw money</p>
                <Link
                  to="/add-bank-account"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Bank Account
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank Account</label>
                  <div className="space-y-2">
                    {wallet?.bankAccounts?.map((account) => (
                      <label
                        key={account._id}
                        className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedBank === account._id 
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="bankAccount"
                          value={account._id}
                          checked={selectedBank === account._id}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-4 h-4 text-emerald-500"
                        />
                        <div className="ml-3 flex-1">
                          <p className="font-medium text-sm">{account.bankName}</p>
                          <p className="text-xs text-gray-500">
                            ****{account.accountNumber.slice(-4)} • {account.ifscCode}
                          </p>
                        </div>
                        {account.isDefault && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    max={wallet?.balance}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Available: {formatCurrency(wallet?.balance)}
                  </p>
                </div>
                
                <button
                  onClick={handleWithdraw}
                  disabled={processing || !withdrawAmount || !selectedBank}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 transition-all"
                >
                  {processing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Withdraw'}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'send' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Send Money</h3>
              <button onClick={() => setActiveTab('overview')} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Payment Method Selection */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSendPaymentMethod('wallet')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  sendPaymentMethod === 'wallet'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Wallet Balance
              </button>
              <button
                onClick={() => setSendPaymentMethod('razorpay')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  sendPaymentMethod === 'razorpay'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pay via Razorpay
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient UPI ID</label>
                <input
                  type="text"
                  value={recipientUpi}
                  onChange={(e) => setRecipientUpi(e.target.value)}
                  placeholder="example@agrichain"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="Enter amount"
                  max={sendPaymentMethod === 'wallet' ? wallet?.balance : undefined}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {sendPaymentMethod === 'wallet' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Available: {formatCurrency(wallet?.balance)}
                  </p>
                )}
                {sendPaymentMethod === 'razorpay' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Pay via UPI, PhonePe, Google Pay, Cards via Razorpay
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
                <input
                  type="text"
                  value={sendNote}
                  onChange={(e) => setSendNote(e.target.value)}
                  placeholder="What's this for?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              {sendPaymentMethod === 'wallet' && parseFloat(sendAmount) > wallet?.balance && (
                <p className="text-sm text-red-500">Insufficient wallet balance. Switch to Razorpay to pay directly.</p>
              )}
              
              <button
                onClick={sendPaymentMethod === 'wallet' ? handleSendMoney : handleSendViaRazorpay}
                disabled={processing || !recipientUpi || !sendAmount || (sendPaymentMethod === 'wallet' && parseFloat(sendAmount) > wallet?.balance)}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 transition-all"
              >
                {processing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 
                  sendPaymentMethod === 'wallet' ? 'Send from Wallet' : 'Pay via Razorpay'}
              </button>
            </div>
          </div>
        )}

        {/* Bank Accounts Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-500" />
              Bank Accounts
            </h3>
            <Link
              to="/add-bank-account"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              + Add New
            </Link>
          </div>
          
          {wallet?.bankAccounts?.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No bank accounts added</p>
          ) : (
            <div className="space-y-3">
              {wallet?.bankAccounts?.map((account) => (
                <div
                  key={account._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{account.bankName}</p>
                      <p className="text-xs text-gray-500">
                        {account.accountHolderName} • ****{account.accountNumber.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!account.isDefault && (
                      <button
                        onClick={() => handleSetDefault(account._id)}
                        className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                        title="Set as default"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    {account.isDefault && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteBank(account._id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-500" />
              Recent Transactions
            </h3>
            <button
              onClick={() => setActiveTab(activeTab === 'history' ? 'overview' : 'history')}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              {activeTab === 'history' ? 'Show Less' : 'View All'}
            </button>
          </div>
          
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, activeTab === 'history' ? transactions.length : 5).map((tx) => (
                <div
                  key={tx._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      tx.type === 'wallet_add' ? 'bg-emerald-100' :
                      tx.type === 'wallet_withdraw' ? 'bg-red-100' :
                      tx.type === 'wallet_send' ? 'bg-orange-100' :
                      'bg-blue-100'
                    }`}>
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{getTransactionLabel(tx.type)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      tx.type === 'wallet_add' || tx.type === 'wallet_receive'
                        ? 'text-emerald-600'
                        : 'text-gray-800'
                    }`}>
                      {tx.type === 'wallet_add' || tx.type === 'wallet_receive' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tx.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;

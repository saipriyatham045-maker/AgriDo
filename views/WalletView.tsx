
import React, { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  CheckCircle,
  HelpCircle,
  Smartphone,
  Banknote,
  Building2,
  LucideIcon,
  ShieldCheck,
  User,
  Calendar,
  Lock,
  Search,
  Check
} from 'lucide-react';
import { FarmerProfile, PaymentMethodType } from '../types';
import { DataService } from '../services/dataService';

interface Props {
  farmer: FarmerProfile;
  onRepay: (amount: number, method: PaymentMethodType, details?: any) => void;
}

interface PaymentOption {
  id: PaymentMethodType;
  label: string;
  icon: LucideIcon;
  description: string;
  enabled: boolean;
}

const WalletView: React.FC<Props> = ({ farmer, onRepay }) => {
  const [amount, setAmount] = useState(farmer.outstandingBalance.toString());
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('UPI');
  
  // UPI State
  const [upiId, setUpiId] = useState('');
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [upiVerifiedName, setUpiVerifiedName] = useState<string | null>(null);
  const [upiError, setUpiError] = useState<string | null>(null);

  // Card State
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const PAYMENT_METHODS: PaymentOption[] = [
    { id: 'UPI', label: 'UPI Instant', icon: Smartphone, description: 'GPay, PhonePe, Paytm', enabled: true },
    { id: 'CARD', label: 'Debit/Credit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay', enabled: true },
    { id: 'NETBANKING', label: 'Net Banking', icon: Building2, description: 'All major banks', enabled: true },
    { id: 'CASH', label: 'Cash Deposit', icon: Banknote, description: 'AgriDo Centers', enabled: false },
  ];

  const handleVerifyUpi = async () => {
    if (!upiId) return;
    setIsVerifyingUpi(true);
    setUpiError(null);
    setUpiVerifiedName(null);
    try {
      const res = await DataService.verifyUPI(upiId);
      if (res.success) {
        setUpiVerifiedName(res.userName || 'Verified User');
      } else {
        setUpiError(res.message || 'Verification failed');
      }
    } catch (e) {
      setUpiError('Network error during verification');
    } finally {
      setIsVerifyingUpi(false);
    }
  };

  const handleRepayClick = () => {
    let details: any = {};
    if (selectedMethod === 'UPI') {
      if (!upiVerifiedName) {
        setUpiError('Please verify your UPI ID first');
        return;
      }
      details = { upiId };
    } else if (selectedMethod === 'CARD') {
      if (cardDetails.number.length < 16 || !cardDetails.expiry || cardDetails.cvv.length < 3) {
        alert('Please enter valid card details');
        return;
      }
      details = { ...cardDetails };
    }
    
    onRepay(Number(amount), selectedMethod, details);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="bg-green-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -bottom-12 -right-12 opacity-5 scale-150 rotate-12">
          <Wallet size={300} />
        </div>
        <div className="flex justify-between items-start mb-16 relative z-10">
          <div>
            <p className="text-green-100 text-xs font-black uppercase tracking-[0.2em]">AgriDo Pay-Later Limit</p>
            <h2 className="text-4xl font-black mt-4 tracking-tighter">₹{(farmer.creditLimit - farmer.outstandingBalance).toLocaleString()}</h2>
            <p className="text-green-100/60 text-xs mt-2 font-bold uppercase tracking-widest">Available Credit</p>
          </div>
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-xl border border-white/20 shadow-lg">
            <CheckCircle size={32} className="text-green-300" />
          </div>
        </div>
        <div className="flex justify-between items-end relative z-10">
          <div className="space-y-2">
            <p className="text-[10px] text-green-200 uppercase font-black tracking-widest">Card Holder</p>
            <p className="font-black text-xl tracking-tight">{farmer.name.toUpperCase()}</p>
          </div>
          <div className="text-right space-y-2">
            <p className="text-[10px] text-green-200 uppercase font-black tracking-widest">Account Type</p>
            <p className="font-black text-sm px-3 py-1 bg-white/20 rounded-lg">{farmer.isVerified ? 'VERIFIED FARMER' : 'PENDING'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-green-100">
            <h3 className="text-2xl font-black text-green-900 mb-8 tracking-tighter">Choose Payment Method</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {PAYMENT_METHODS.map((method) => (
                <div 
                  key={method.id}
                  onClick={() => method.enabled && setSelectedMethod(method.id)}
                  className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
                    !method.enabled ? 'opacity-40 grayscale cursor-not-allowed border-green-50' : 
                    selectedMethod === method.id ? 'border-green-600 bg-green-50/50 shadow-md' : 
                    'border-green-50 bg-gray-50/50 hover:border-green-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl transition-colors ${selectedMethod === method.id ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      <method.icon size={24} />
                    </div>
                    <div>
                      <span className={`font-black text-sm block ${selectedMethod === method.id ? 'text-green-900' : 'text-gray-500'}`}>{method.label}</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{method.description}</span>
                    </div>
                  </div>
                  {method.enabled && selectedMethod === method.id && (
                    <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-8">
              {/* Conditional Payment UI */}
              <div className="bg-green-50/30 p-8 rounded-3xl border border-green-100/50">
                {selectedMethod === 'UPI' && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-black text-green-700 uppercase tracking-widest mb-3 block">UPI ID Verification</label>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={18} />
                          <input 
                            type="text" 
                            placeholder="e.g. mobile@upi or name@bank"
                            className="w-full pl-11 pr-4 py-4 rounded-xl bg-white border-2 border-green-50 focus:border-green-600 outline-none transition-all font-bold"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              setUpiVerifiedName(null);
                              setUpiError(null);
                            }}
                          />
                        </div>
                        <button 
                          onClick={handleVerifyUpi}
                          disabled={!upiId || isVerifyingUpi}
                          className="px-6 py-4 bg-green-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                          {isVerifyingUpi ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search size={16} />}
                          <span>Verify</span>
                        </button>
                      </div>
                      {upiError && <p className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-widest">{upiError}</p>}
                      {upiVerifiedName && (
                        <div className="flex items-center gap-2 mt-3 p-3 bg-white border border-green-200 rounded-xl animate-in slide-in-from-top-2">
                          <CheckCircle className="text-green-600" size={16} />
                          <p className="text-[10px] text-green-900 font-black uppercase tracking-widest">{upiVerifiedName}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedMethod === 'CARD' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-green-700 uppercase tracking-widest block">Cardholder Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={18} />
                          <input 
                            type="text" 
                            placeholder="NAME AS PER CARD"
                            className="w-full pl-11 pr-4 py-4 rounded-xl bg-white border-2 border-green-50 focus:border-green-600 outline-none transition-all font-bold uppercase"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-green-700 uppercase tracking-widest block">Card Number</label>
                        <div className="relative">
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={18} />
                          <input 
                            type="text" 
                            maxLength={16}
                            placeholder="0000 0000 0000 0000"
                            className="w-full pl-11 pr-4 py-4 rounded-xl bg-white border-2 border-green-50 focus:border-green-600 outline-none transition-all font-bold"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g, '')})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-green-700 uppercase tracking-widest block">Expiry Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={18} />
                          <input 
                            type="text" 
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full pl-11 pr-4 py-4 rounded-xl bg-white border-2 border-green-50 focus:border-green-600 outline-none transition-all font-bold"
                            value={cardDetails.expiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                              setCardDetails({...cardDetails, expiry: val});
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-green-700 uppercase tracking-widest block">CVV</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={18} />
                          <input 
                            type="password" 
                            maxLength={3}
                            placeholder="***"
                            className="w-full pl-11 pr-4 py-4 rounded-xl bg-white border-2 border-green-50 focus:border-green-600 outline-none transition-all font-bold"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'NETBANKING' && (
                   <div className="text-center py-6">
                      <Building2 className="mx-auto text-green-600 mb-4" size={48} />
                      <p className="text-sm font-black text-green-900 uppercase tracking-widest">Redirect to Net Banking</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-2">You will be securely redirected to your bank's portal.</p>
                   </div>
                )}
              </div>

              <div>
                <label className="text-xs font-black text-green-700 uppercase tracking-widest mb-3 block">Payment Amount</label>
                <div className="relative mb-6">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-green-300 text-3xl">₹</span>
                  <input 
                    type="number" 
                    className="w-full pl-12 pr-6 py-6 rounded-[2rem] bg-gray-50 border-2 border-transparent focus:border-green-600 focus:bg-white outline-none transition-all text-3xl font-black text-green-900"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[500, 1000, 5000].map(val => (
                    <button 
                      key={val}
                      onClick={() => setAmount(val.toString())}
                      className="py-4 px-4 rounded-2xl border-2 border-green-50 text-xs font-black text-green-700 hover:border-green-600 hover:text-green-600 transition-all active:scale-95 bg-white"
                    >
                      +₹{val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleRepayClick}
                disabled={Number(amount) <= 0 || Number(amount) > farmer.outstandingBalance || (selectedMethod === 'UPI' && !upiVerifiedName)}
                className="w-full py-6 bg-green-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-green-200 hover:bg-green-700 transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <ShieldCheck size={24} />
                <span>Secure Repayment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-8">
          <div className="bg-green-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden h-fit">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <ShieldCheck size={120} />
             </div>
            <div>
              <ShieldCheck size={32} className="text-green-400 mb-6" />
              <h3 className="text-2xl font-black mb-3 tracking-tight">AgriDo SafePay</h3>
              <p className="text-sm text-green-100 font-medium leading-relaxed">
                All transactions are 256-bit encrypted and monitored by our 24/7 security systems. 
                Your farming credit is protected.
              </p>
            </div>
            <div className="mt-12 space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-green-800/50">
                <span className="text-xs font-bold text-green-300 uppercase tracking-widest">Next Due Date</span>
                <span className="font-black text-lg">May 15</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="text-xs font-bold text-green-300 uppercase tracking-widest">Outstanding</span>
                <span className="font-black text-green-400 text-lg">₹{farmer.outstandingBalance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-green-100 shadow-sm">
            <h4 className="font-black text-green-900 mb-6 flex items-center space-x-2 uppercase text-xs tracking-[0.2em]">
              <HelpCircle size={20} className="text-green-400" />
              <span>Guidelines</span>
            </h4>
            <div className="space-y-6">
              {[
                { n: 1, t: "Ensure your UPI ID is linked to your bank account." },
                { n: 2, t: "Manual card entry requires CVV verification." },
                { n: 3, t: "Platform fees are waived for direct bank transfers." }
              ].map((item) => (
                <div key={item.n} className="flex space-x-4 items-center">
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-green-50 text-green-700 flex items-center justify-center text-xs font-black border border-green-100">
                    {item.n}
                  </div>
                  <p className="text-xs text-gray-600 font-bold leading-tight">{item.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletView;

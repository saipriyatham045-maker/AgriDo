
import React, { useEffect, useState, useMemo } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  ShieldCheck, 
  TrendingUp,
  BrainCircuit,
  AlertTriangle,
  BellRing,
  Filter,
  ChevronDown
} from 'lucide-react';
import { FarmerProfile, NotificationRecord, Transaction } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

const FarmerDashboard: React.FC<{ farmer: FarmerProfile, notifications: NotificationRecord[] }> = ({ farmer, notifications }) => {
  const [advice, setAdvice] = useState<string>("Loading your agri-financial advice...");
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'PAID' | 'OVERDUE' | 'COMPLETED'>('ALL');

  useEffect(() => {
    const fetchAdvice = async () => {
      const msg = await getFinancialAdvice(farmer);
      setAdvice(msg);
    };
    fetchAdvice();
  }, [farmer]);

  const creditUsedPercentage = Math.round((farmer.outstandingBalance / farmer.creditLimit) * 100);

  const filteredHistory = useMemo(() => {
    if (statusFilter === 'ALL') return farmer.history;
    return farmer.history.filter(tx => tx.status === statusFilter);
  }, [farmer.history, statusFilter]);

  const FilterButton = ({ label, value }: { label: string, value: typeof statusFilter }) => (
    <button
      onClick={() => setStatusFilter(value)}
      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
        statusFilter === value 
          ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-100' 
          : 'bg-white border-green-50 text-gray-400 hover:border-green-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Credit Limit</p>
              <h3 className="text-2xl font-bold mt-1 text-green-900">₹{farmer.creditLimit.toLocaleString()}</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-lg text-green-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Available for your farming needs</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Outstanding Due</p>
              <h3 className="text-2xl font-bold mt-1 text-green-700">₹{farmer.outstandingBalance.toLocaleString()}</h3>
            </div>
            <div className="bg-green-50 p-2 rounded-lg text-green-600">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
            <div className="bg-green-600 h-full rounded-full" style={{ width: `${creditUsedPercentage}%` }}></div>
          </div>
          <p className="text-xs text-gray-400 mt-2">{creditUsedPercentage}% utilized</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Available Limit</p>
              <h3 className="text-2xl font-bold mt-1 text-green-800">₹{(farmer.creditLimit - farmer.outstandingBalance).toLocaleString()}</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-lg text-green-600">
              <ShieldCheck size={20} />
            </div>
          </div>
          <p className="text-xs text-green-600 font-bold mt-6">Ready to use</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Next Due Date</p>
              <h3 className="text-2xl font-bold mt-1 text-green-900">May 15, 2024</h3>
            </div>
            <div className="bg-green-50 p-2 rounded-lg text-green-700">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-xs text-green-700 font-bold mt-6">Upcoming shortly</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Active Alerts */}
          {notifications.filter(n => n.type !== 'SUCCESS').length > 0 && (
            <div className="bg-white rounded-3xl shadow-sm border border-green-100 overflow-hidden">
              <div className="px-8 py-5 border-b border-green-50 bg-orange-50/20 flex items-center space-x-2">
                <BellRing size={18} className="text-orange-600" />
                <h4 className="font-black text-orange-900 uppercase tracking-widest text-xs">System Alerts</h4>
              </div>
              <div className="divide-y divide-green-50">
                {notifications.filter(n => n.type !== 'SUCCESS').slice(0, 3).map(note => (
                  <div key={note.id} className="px-8 py-5 flex items-center space-x-4 hover:bg-orange-50/10 transition-colors">
                    <div className="p-3 rounded-2xl bg-orange-100 text-orange-700">
                      <AlertTriangle size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 leading-tight">{note.message}</p>
                      <p className="text-[10px] text-orange-600 mt-1 uppercase font-black tracking-widest">{note.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Purchase History Section */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-green-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-green-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-black text-green-900 uppercase tracking-widest text-sm">Purchase History</h4>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">Chronological records</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <FilterButton label="All" value="ALL" />
                <FilterButton label="Pending" value="PENDING" />
                <FilterButton label="Paid" value="PAID" />
                <FilterButton label="Overdue" value="OVERDUE" />
              </div>
            </div>

            <div className="divide-y divide-green-50">
              {filteredHistory.length === 0 ? (
                <div className="px-8 py-16 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <Clock size={32} />
                  </div>
                  <p className="text-gray-400 font-bold text-sm">No transactions found for this filter.</p>
                </div>
              ) : (
                filteredHistory.map((tx) => (
                  <div key={tx.id} className="px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-green-50/20 transition-all group">
                    <div className="flex items-center space-x-5 mb-4 sm:mb-0">
                      <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${tx.type === 'REPAYMENT' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700'}`}>
                        {tx.type === 'REPAYMENT' ? <ArrowDownRight size={22} /> : <ArrowUpRight size={22} />}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-lg tracking-tight">{tx.serviceName}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{tx.date}</p>
                          <span className="w-1 h-1 bg-gray-200 rounded-full" />
                          <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">ID: {tx.id.split('-').pop()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                      <p className={`font-black text-xl tracking-tighter ${tx.type === 'REPAYMENT' ? 'text-green-600' : 'text-gray-900'}`}>
                        {tx.type === 'REPAYMENT' ? '-' : '+'} ₹{tx.amount.toLocaleString()}
                      </p>
                      <span className={`mt-1 text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-[0.15em] border ${
                        tx.status === 'PAID' ? 'bg-green-100 text-green-700 border-green-200' : 
                        tx.status === 'PENDING' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                        tx.status === 'COMPLETED' ? 'bg-green-600 text-white border-green-700' :
                        'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="px-8 py-6 bg-green-50/10 border-t border-green-50 text-center">
              <button className="text-xs font-black text-green-700 uppercase tracking-widest flex items-center justify-center mx-auto space-x-2 hover:underline">
                <span>View Full Statement</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <div className="bg-green-600 rounded-[2.5rem] shadow-xl p-10 text-white relative overflow-hidden">
            <div className="absolute -top-6 -right-6 p-4 opacity-10 rotate-12">
              <BrainCircuit size={140} />
            </div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <BrainCircuit size={24} className="text-green-100" />
              </div>
              <h4 className="font-black text-xl uppercase tracking-tighter">AI Advisory</h4>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-inner">
              <p className="text-sm leading-relaxed font-medium italic text-green-50">
                "{advice}"
              </p>
            </div>
            <button className="mt-8 w-full bg-white text-green-700 font-black py-4 rounded-2xl hover:bg-green-50 transition-all shadow-lg shadow-green-900/20 text-xs uppercase tracking-widest">
              Review Repayment Plan
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-green-100 p-10">
            <h4 className="font-black text-green-900 mb-8 flex items-center space-x-3 uppercase text-xs tracking-[0.2em]">
              <AlertTriangle size={20} className="text-green-600" />
              <span>Safety Tips</span>
            </h4>
            <div className="space-y-8">
              {[
                { text: "Avoid 100% utilization for better future scoring.", icon: ShieldCheck },
                { text: "Repay within 60 days to avoid extra charges.", icon: Clock },
                { text: "On-time payments double your limit instantly.", icon: TrendingUp }
              ].map((tip, idx) => (
                <div key={idx} className="flex space-x-4 items-start group">
                  <div className="p-2.5 bg-green-50 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <tip.icon size={18} />
                  </div>
                  <p className="text-sm text-gray-600 font-bold leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;

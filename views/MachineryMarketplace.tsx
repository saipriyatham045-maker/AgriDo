
import React, { useState } from 'react';
import { Search, MapPin, Info, Tag, CreditCard, History, CheckCircle, ArrowRight, User, ShieldCheck, Phone, MessageSquare, Star } from 'lucide-react';
import { Machinery, FarmerProfile, Transaction } from '../types';

interface Props {
  machinery: Machinery[];
  farmer: FarmerProfile;
  onBook: (machine: Machinery, usePayLater: boolean) => void;
}

const MachineryMarketplace: React.FC<Props> = ({ machinery, farmer, onBook }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMachine, setSelectedMachine] = useState<Machinery | null>(null);
  const [usePayLater, setUsePayLater] = useState(true);
  const [viewingProvider, setViewingProvider] = useState<string | null>(null);

  const filtered = machinery.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedOrders = farmer.history.filter(tx => tx.status === 'COMPLETED').slice(0, 5);

  const convenienceFee = 250;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" size={18} />
          <input 
            type="text" 
            placeholder="Search tractors, harvesters..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-green-50 focus:border-green-600 outline-none transition-all text-gray-900 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
          <MapPin size={16} className="text-green-600" />
          <span>Services available in <strong className="text-green-900">{farmer.location}</strong></span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Machinery Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((machine) => (
              <div key={machine.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-green-50 hover:shadow-xl hover:shadow-green-900/5 transition-all group border-b-4 border-b-transparent hover:border-b-green-600">
                <div className="relative h-56 overflow-hidden">
                  <img src={machine.imageUrl} alt={machine.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-green-700 shadow-lg flex items-center gap-1">
                    <Star size={10} className="fill-green-600 text-green-600" />
                    <span>4.8</span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-black text-green-900 tracking-tight">{machine.name}</h3>
                        <p className="text-[10px] text-green-600 font-black uppercase tracking-widest mt-1">{machine.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-black text-xl">₹{machine.pricePerDay}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">per day</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-6 line-clamp-2 font-medium leading-relaxed">{machine.description}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-green-50">
                    <button 
                      onClick={() => setViewingProvider(machine.ownerName)}
                      className="flex items-center space-x-3 text-left hover:bg-green-50 p-2 rounded-xl transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-sm font-black text-white border border-green-700 shadow-sm">
                        {machine.ownerName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Provider</p>
                        <div className="flex items-center gap-1">
                            <p className="text-xs text-green-900 font-bold">{machine.ownerName}</p>
                            <ShieldCheck size={12} className="text-green-500" />
                        </div>
                      </div>
                    </button>
                    <button 
                      onClick={() => setSelectedMachine(machine)}
                      className="bg-green-600 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-95"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Recent Orders */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-3xl border border-green-100 shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <History className="text-green-600" size={18} />
                <h4 className="font-black text-green-900 text-sm uppercase tracking-widest">Recent Orders</h4>
              </div>
            </div>

            <div className="space-y-4">
              {completedOrders.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-xs text-gray-400 font-bold">No completed orders yet.</p>
                </div>
              ) : (
                completedOrders.map((order) => (
                  <div key={order.id} className="p-4 rounded-2xl bg-green-50/50 border border-green-50 group hover:bg-green-100/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-black text-green-900 truncate max-w-[140px]">{order.serviceName}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-green-700">₹{order.amount}</p>
                        <div className="flex items-center justify-end text-[8px] text-green-600 font-black uppercase tracking-widest mt-1">
                          <CheckCircle size={8} className="mr-1" />
                          <span>Done</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="w-full mt-6 py-3 border-2 border-green-100 rounded-xl text-[10px] font-black text-green-700 uppercase tracking-[0.2em] hover:bg-green-50 transition-all flex items-center justify-center space-x-2">
              <span>View All Records</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Provider Details Modal */}
      {viewingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-green-900/40 backdrop-blur-sm" onClick={() => setViewingProvider(null)} />
            <div className="relative bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                <div className="p-10 text-center bg-green-600 text-white relative">
                    <div className="absolute top-6 right-6">
                        <button onClick={() => setViewingProvider(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <ArrowRight size={24} className="rotate-45" />
                        </button>
                    </div>
                    <div className="w-24 h-24 bg-white rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-3xl font-black text-green-600 shadow-xl border-4 border-green-500">
                        {viewingProvider.charAt(0)}
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">{viewingProvider}</h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <ShieldCheck size={18} className="text-green-300" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-100">Verified Provider</span>
                    </div>
                </div>
                <div className="p-10 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 p-6 rounded-3xl border border-green-100 text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rating</p>
                            <p className="text-2xl font-black text-green-900">4.8/5</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-3xl border border-green-100 text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Services</p>
                            <p className="text-2xl font-black text-green-900">24+</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 hover:bg-green-50 rounded-2xl transition-colors">
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl"><MapPin size={20} /></div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Area</p>
                                <p className="text-sm font-bold text-gray-900">Within 50km of {farmer.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 hover:bg-green-50 rounded-2xl transition-colors cursor-pointer">
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl"><Phone size={20} /></div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Contact</p>
                                <p className="text-sm font-bold text-gray-900">+91 98XXX XXX00</p>
                            </div>
                        </div>
                    </div>
                    <button className="w-full py-5 bg-green-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                        <MessageSquare size={18} />
                        <span>Chat with Provider</span>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-green-900/20 backdrop-blur-md" onClick={() => setSelectedMachine(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 border border-green-50">
            <div className="px-10 py-8 border-b border-green-50 bg-green-50/20">
              <h3 className="text-2xl font-black text-green-900 tracking-tighter">Confirm Booking</h3>
              <p className="text-sm text-green-600 font-bold mt-1 uppercase tracking-widest">{selectedMachine.name}</p>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-gray-500 font-bold text-sm">
                  <span>Base Service Fee</span>
                  <span className="text-gray-900">₹{selectedMachine.pricePerDay}</span>
                </div>
                
                <div className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all cursor-pointer ${usePayLater ? 'border-green-600 bg-green-50/50 shadow-lg shadow-green-900/5' : 'border-green-50 bg-gray-50/30'}`}
                     onClick={() => setUsePayLater(!usePayLater)}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl shadow-sm ${usePayLater ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <p className={`font-black text-sm uppercase tracking-tight ${usePayLater ? 'text-green-800' : 'text-gray-500'}`}>Pay-Later Enabled</p>
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">60-Day Harvest Cycle</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black ${usePayLater ? 'text-green-700' : 'text-gray-400'}`}>+ ₹{convenienceFee}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Convenience</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-600 p-6 rounded-2xl border border-green-500 flex items-start space-x-4 shadow-xl shadow-green-900/10">
                <Info size={20} className="text-green-200 shrink-0 mt-0.5" />
                <div className="text-xs text-green-50 leading-relaxed font-medium italic">
                  Instant settlement provided to <strong className="text-white underline">{selectedMachine.ownerName}</strong>. 
                  Balance includes standard 10% platform commission.
                </div>
              </div>

              <div className="pt-6 border-t border-green-50">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">Total Order</span>
                  <span className="text-4xl font-black text-green-900 tracking-tighter">₹{selectedMachine.pricePerDay + (usePayLater ? convenienceFee : 0)}</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedMachine(null)}
                    className="flex-1 py-4 text-gray-400 font-black uppercase tracking-widest hover:text-green-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      onBook(selectedMachine, usePayLater);
                      setSelectedMachine(null);
                    }}
                    disabled={farmer.overdue && usePayLater}
                    className="flex-1 py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl shadow-green-100 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-widest text-sm"
                  >
                    {farmer.overdue && usePayLater ? 'Account Blocked' : 'Confirm Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineryMarketplace;

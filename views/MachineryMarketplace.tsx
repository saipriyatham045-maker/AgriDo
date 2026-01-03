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
              <div key={machine.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-green-50 hover:shadow-xl hover:shadow-green-900/5 transition-all group border-b-4 border-b-transparent">
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
      {/* (Modals for provider and booking remain as is) */}
    </div>
  );
};

export default MachineryMarketplace;

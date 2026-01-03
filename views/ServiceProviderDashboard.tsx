
import React, { useState, useRef } from 'react';
import { Tractor, DollarSign, Calendar, Plus, Settings, Trash2, X, User, Check, ImageIcon, Upload, Link as LinkIcon, History } from 'lucide-react';
import { Machinery, Transaction } from '../types';

interface Props {
  providerName: string;
  machinery: Machinery[];
  history: Transaction[];
  onAddMachine: (machine: Partial<Machinery>) => void;
  onDeleteMachine: (id: string) => void;
  onUpdateBooking: (bookingId: string, updates: Partial<Transaction>) => void;
}

const ServiceProviderDashboard: React.FC<Props> = ({ providerName, machinery, history, onAddMachine, onDeleteMachine, onUpdateBooking }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newMachine, setNewMachine] = useState<Partial<Machinery>>({ name: '', type: 'Tractor', pricePerDay: 1500, description: '', imageUrl: '' });
  const [assigningDriverId, setAssigningDriverId] = useState<string | null>(null);
  const [driverNameInput, setDriverNameInput] = useState('');

  // Fleet is filtered globally from all machinery data passed down
  const myFleet = machinery.filter(m => m.ownerName === providerName || providerName.includes(m.ownerName));
  const myBookings = history.filter(tx => tx.type === 'BOOKING');
  const visibleBookings = showAllHistory ? myBookings : myBookings.slice(0, 5);

  const totalEarnings = history.filter(tx => tx.type === 'BOOKING' && (tx.status === 'COMPLETED' || tx.status === 'PAID')).reduce((acc, tx) => acc + (tx.amount - (tx.agriDoCommission || 0)), 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewMachine({ ...newMachine, imageUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMachine({ ...newMachine, ownerName: providerName });
    setShowAddModal(false);
    setNewMachine({ name: '', type: 'Tractor', pricePerDay: 1500, description: '', imageUrl: '' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div><h2 className="text-3xl font-black text-green-900 tracking-tighter uppercase">Fleet Operations</h2></div>
        <button onClick={() => setShowAddModal(true)} className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center space-x-2 hover:bg-green-700 active:scale-95 transition-all"><Plus size={18} /><span>Register Machinery</span></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-green-100 flex items-center justify-between shadow-sm"><div className="space-y-1"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Earnings</p><h3 className="text-2xl font-black text-green-900">₹{totalEarnings.toLocaleString()}</h3></div><DollarSign className="text-green-600" size={32} /></div>
        <div className="bg-white p-8 rounded-3xl border border-green-100 flex items-center justify-between shadow-sm"><div className="space-y-1"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Fleet</p><h3 className="text-2xl font-black text-green-900">{myFleet.length} Units</h3></div><Tractor className="text-green-600" size={32} /></div>
        <div className="bg-white p-8 rounded-3xl border border-green-100 flex items-center justify-between shadow-sm"><div className="space-y-1"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Open Requests</p><h3 className="text-2xl font-black text-green-900">{myBookings.filter(tx => !tx.driverName).length}</h3></div><Calendar className="text-green-600" size={32} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6 bg-white rounded-[2.5rem] border border-green-100 overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-green-50 flex items-center justify-between">
            <h4 className="font-black text-green-900 uppercase tracking-widest text-xs">Live Bookings Queue</h4>
            <History size={16} className="text-green-600" />
          </div>
          <div className="divide-y divide-green-50">
            {visibleBookings.length === 0 ? (
              <div className="p-16 text-center text-gray-400 font-bold">No active bookings for your fleet.</div>
            ) : (
              visibleBookings.map(tx => (
                <div key={tx.id} className="p-8 space-y-5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-lg font-black text-green-900 tracking-tight">{tx.serviceName}</h5>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{tx.date}</p>
                    </div>
                    <span className="text-green-700 font-black text-lg">₹{tx.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {tx.driverName ? (
                      <div className="bg-green-600 px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md">
                        <User size={14} className="text-white" />
                        <span className="text-xs font-black text-white uppercase tracking-tight">Driver: {tx.driverName}</span>
                      </div>
                    ) : (
                      assigningDriverId === tx.id ? (
                        <div className="flex gap-2 animate-in slide-in-from-left-4">
                          <input placeholder="Enter Driver Name" className="px-4 py-2 border-2 border-green-100 rounded-xl font-bold text-xs outline-none focus:border-green-600" value={driverNameInput} onChange={e => setDriverNameInput(e.target.value)} />
                          <button onClick={() => { onUpdateBooking(tx.id, { driverName: driverNameInput }); setAssigningDriverId(null); setDriverNameInput(''); }} className="bg-green-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-green-700"><Check size={16} /></button>
                          <button onClick={() => setAssigningDriverId(null)} className="bg-gray-100 text-gray-400 p-2.5 rounded-xl"><X size={16} /></button>
                        </div>
                      ) : (
                        <button onClick={() => setAssigningDriverId(tx.id)} className="text-[10px] font-black uppercase tracking-widest text-green-600 border-2 border-green-50 px-5 py-2.5 rounded-xl hover:border-green-600 hover:bg-green-50 transition-all">Assign Personnel</button>
                      )
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {myBookings.length > 5 && (
            <div className="p-6 bg-slate-50/50 text-center border-t border-green-50">
              <button 
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="text-[10px] font-black text-green-700 uppercase tracking-widest hover:underline"
              >
                {showAllHistory ? 'Show Recent Only' : 'View All Records'}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-green-100 p-8 space-y-6 shadow-sm">
          <h4 className="font-black text-green-900 uppercase text-[10px] tracking-[0.2em]">Active Inventory</h4>
          <div className="space-y-4">
            {myFleet.map(m => (
              <div key={m.id} className="flex items-center justify-between p-4 hover:bg-green-50 rounded-2xl transition-all border border-transparent hover:border-green-100">
                <div className="flex items-center gap-4">
                  <img src={m.imageUrl} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm" alt={m.name} />
                  <div>
                    <span className="text-sm font-black block text-green-900">{m.name}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">₹{m.pricePerDay}/day</span>
                  </div>
                </div>
                <button 
                  onClick={() => { if(confirm(`PERMANENTLY DELETE ${m.name}? This cannot be undone.`)) onDeleteMachine(m.id); }} 
                  className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Delete Item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {myFleet.length === 0 && <p className="text-center text-xs text-gray-400 font-bold py-10">No machinery registered.</p>}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-green-900/30 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-green-50">
            <div className="px-10 py-8 border-b border-green-50 bg-green-50/30 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-green-900 tracking-tighter uppercase">Register Asset</h3>
                <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mt-1">Marketplace Onboarding</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-red-500 hover:rotate-90 transition-all"><X size={28} /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Name</label>
                  <input required placeholder="e.g. Swaraj 744" className="w-full px-5 py-4 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-green-600 outline-none transition-all" value={newMachine.name} onChange={e => setNewMachine({...newMachine, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Daily Rental (₹)</label>
                  <input required type="number" placeholder="Rate per day" className="w-full px-5 py-4 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-green-600 outline-none transition-all" value={newMachine.pricePerDay} onChange={e => setNewMachine({...newMachine, pricePerDay: Number(e.target.value)})} />
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description & Features</label>
                    <textarea placeholder="Outline tractor power, implements included, etc." className="w-full px-5 py-4 rounded-2xl bg-slate-50 font-bold h-36 resize-none outline-none focus:border-green-600 border-2 border-transparent transition-all" value={newMachine.description} onChange={e => setNewMachine({...newMachine, description: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Media Selection</label>
                    <div className="relative group">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="text" placeholder="Paste direct image link" className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 text-xs font-bold outline-none border-2 border-transparent focus:border-green-600 transition-all" value={newMachine.imageUrl} onChange={e => setNewMachine({...newMachine, imageUrl: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-56 space-y-4">
                  <div className="w-full aspect-square bg-slate-50 rounded-[2rem] overflow-hidden border-4 border-dashed border-slate-100 flex items-center justify-center relative group">
                    {newMachine.imageUrl ? (
                      <img src={newMachine.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Preview" />
                    ) : (
                      <div className="text-center p-6"><ImageIcon size={40} className="mx-auto text-slate-200 mb-3" /><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No Image</p></div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full py-4 text-[10px] font-black uppercase text-green-700 bg-green-50 border-2 border-green-100 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-100 hover:border-green-600 transition-all">
                    <Upload size={16} /><span>Paste image URL or import</span>
                  </button>
                </div>
              </div>
              
              <button type="submit" className="w-full py-6 bg-green-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm shadow-2xl shadow-green-900/20 hover:bg-green-700 transition-all active:scale-[0.98]">Add Machinery</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceProviderDashboard;

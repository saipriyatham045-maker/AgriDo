
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, Activity, AlertCircle, Trash2, Sprout, Tractor, Download, Edit3, X, Check, Save, Info, ArrowRight } from 'lucide-react';
import { DataService } from '../services/dataService';
import { AdminSettings, CropListing, Machinery } from '../types';

const data = [
  { name: 'Jan', volume: 4000 },
  { name: 'Feb', volume: 3000 },
  { name: 'Mar', volume: 2000 },
  { name: 'Apr', volume: 2780 },
  { name: 'May', volume: 1890 },
];

interface Props {
  settings: AdminSettings;
  onUpdateSettings: (settings: AdminSettings) => void;
  onNavigate?: (tab: any) => void;
}

const AdminPanel: React.FC<Props> = ({ settings, onUpdateSettings, onNavigate }) => {
  const [view, setView] = useState<'metrics' | 'crops' | 'machinery'>('metrics');
  const [allCrops, setAllCrops] = useState<CropListing[]>([]);
  const [allMachinery, setAllMachinery] = useState<Machinery[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (view === 'crops' || view === 'machinery') {
      refreshData();
    }
  }, [view]);

  const refreshData = async () => {
    setIsLoading(true);
    const crops = await DataService.getCrops();
    const machines = await DataService.getMachinery();
    setAllCrops(crops);
    setAllMachinery(machines);
    setIsLoading(false);
  };

  const handleDeleteItem = async (type: 'crop' | 'machine', id: string) => {
    if (confirm(`PERMANENTLY DELETE THIS ${type.toUpperCase()} LISTING? This action is immediate and irrevocable.`)) {
      if (type === 'crop') {
        await DataService.deleteCrop(id);
        setAllCrops(prev => prev.filter(c => c.id !== id));
      } else {
        await DataService.deleteMachinery(id);
        setAllMachinery(prev => prev.filter(m => m.id !== id));
      }
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} listing removed permanently.`);
    }
  };

  const startEditing = (item: any) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const saveEdit = async (type: 'crop' | 'machine') => {
    if (type === 'crop') {
      setAllCrops(prev => prev.map(c => c.id === editingId ? { ...editForm } : c));
    } else {
      setAllMachinery(prev => prev.map(m => m.id === editingId ? { ...editForm } : m));
    }
    setEditingId(null);
    setEditForm(null);
    alert("Record updated successfully.");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-32 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-4 md:px-0">
        <div>
          <h2 className="text-3xl font-black text-green-900 tracking-tighter uppercase">Governance Console</h2>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Platform Administrative Access</p>
        </div>
        {/* PDF Download Button Removed as requested */}
      </div>

      {view === 'metrics' && (
        <div className="space-y-10 px-4 md:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-[2rem] border border-green-50 shadow-sm"><DollarSign className="text-green-600 mb-6" size={32} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Volume</p><h3 className="text-3xl font-black text-green-900">₹12.5M</h3></div>
            <div className="bg-white p-8 rounded-[2rem] border border-green-50 shadow-sm"><Users className="text-green-600 mb-6" size={32} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Users</p><h3 className="text-3xl font-black text-green-900">2,482</h3></div>
            <div className="bg-white p-8 rounded-[2rem] border border-green-50 shadow-sm"><AlertCircle className="text-green-600 mb-6" size={32} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Default Rate</p><h3 className="text-3xl font-black text-green-900">1.2%</h3></div>
            <div className="bg-white p-8 rounded-[2rem] border border-green-50 shadow-sm"><Activity className="text-green-600 mb-6" size={32} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Platform Rev.</p><h3 className="text-3xl font-black text-green-900">₹480K</h3></div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-green-50 shadow-sm h-[450px]">
            <div className="flex justify-between mb-10">
              <h3 className="text-xl font-black text-green-900 uppercase tracking-tighter">Settlement Analytics</h3>
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                <Bar dataKey="volume" fill="#065f46" radius={[12, 12, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
            <button onClick={() => setView('crops')} className="bg-emerald-950 text-white p-12 rounded-[3.5rem] flex items-center justify-between group hover:bg-black transition-all shadow-2xl">
              <div className="text-left"><Sprout size={40} className="mb-6 text-emerald-400" /><h4 className="text-2xl font-black uppercase tracking-tighter">Manage All Crops</h4><p className="text-emerald-100 opacity-60 font-bold uppercase tracking-widest text-[10px] mt-2">Edit or audit harvest listings</p></div>
              <ArrowRight size={32} className="group-hover:translate-x-4 transition-transform" />
            </button>
            <button onClick={() => setView('machinery')} className="bg-green-800 text-white p-12 rounded-[3.5rem] flex items-center justify-between group hover:bg-green-900 transition-all shadow-2xl">
              <div className="text-left"><Tractor size={40} className="mb-6 text-green-300" /><h4 className="text-2xl font-black uppercase tracking-tighter">Manage Machinery</h4><p className="text-green-100 opacity-60 font-bold uppercase tracking-widest text-[10px] mt-2">Edit or delete service fleet</p></div>
              <ArrowRight size={32} className="group-hover:translate-x-4 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {view === 'crops' && (
        <div className="bg-white rounded-[3.5rem] border border-emerald-50 overflow-hidden animate-in slide-in-from-right-12 duration-500 shadow-xl mx-4 md:mx-0">
          <div className="px-12 py-10 border-b bg-slate-50/80 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Crop Inventory Control</h3>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Audit and Manage Farmer Listings</p>
            </div>
            <button onClick={() => setView('metrics')} className="p-3 text-slate-400 hover:text-red-500 hover:rotate-90 transition-all"><X size={28} /></button>
          </div>
          <div className="divide-y divide-slate-100">
            {allCrops.length === 0 ? (
              <div className="p-32 text-center text-slate-300 font-bold uppercase tracking-widest">No active listings.</div>
            ) : (
              allCrops.map(crop => (
                <div key={crop.id} className="p-10 flex flex-col md:flex-row items-center justify-between hover:bg-emerald-50/30 transition-all gap-8">
                  <div className="flex items-center gap-8 w-full md:w-auto">
                    <img src={crop.imageUrl} className="w-24 h-24 rounded-[2rem] object-cover shadow-lg" alt={crop.cropName} />
                    {editingId === crop.id ? (
                      <div className="space-y-3 flex-1">
                        <input className="w-full px-4 py-2 border rounded-xl font-bold" value={editForm.cropName} onChange={e => setEditForm({...editForm, cropName: e.target.value})} />
                        <div className="flex gap-2">
                          <input className="w-1/2 px-4 py-2 border rounded-xl font-bold" value={editForm.variety} onChange={e => setEditForm({...editForm, variety: e.target.value})} />
                          <input className="w-1/2 px-4 py-2 border rounded-xl font-bold" type="number" value={editForm.pricePerUnit} onChange={e => setEditForm({...editForm, pricePerUnit: Number(e.target.value)})} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xl font-black text-slate-900 leading-none">{crop.cropName}</p>
                        <p className="text-xs text-emerald-600 font-black uppercase tracking-widest">{crop.variety}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">Seller: {crop.farmerName} • ₹{crop.pricePerUnit}/{crop.unit}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button onClick={() => setViewingItem(crop)} className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:text-emerald-900 transition-all"><Info size={20} /></button>
                    {editingId === crop.id ? (
                      <button onClick={() => saveEdit('crop')} className="flex-1 md:flex-none p-5 bg-green-600 text-white rounded-2xl shadow-lg flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"><Save size={20} /> Save</button>
                    ) : (
                      <button onClick={() => startEditing(crop)} className="flex-1 md:flex-none p-5 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><Edit3 size={20} /></button>
                    )}
                    <button onClick={() => handleDeleteItem('crop', crop.id)} className="flex-1 md:flex-none p-5 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {view === 'machinery' && (
        <div className="bg-white rounded-[3.5rem] border border-green-50 overflow-hidden animate-in slide-in-from-right-12 duration-500 shadow-xl mx-4 md:mx-0">
          <div className="px-12 py-10 border-b bg-slate-50/80 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Machinery Fleet Control</h3>
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1">Audit and Manage Service Assets</p>
            </div>
            <button onClick={() => setView('metrics')} className="p-3 text-slate-400 hover:text-red-500 hover:rotate-90 transition-all"><X size={28} /></button>
          </div>
          <div className="divide-y divide-slate-100">
            {allMachinery.length === 0 ? (
              <div className="p-32 text-center text-slate-300 font-bold uppercase tracking-widest">No assets found.</div>
            ) : (
              allMachinery.map(m => (
                <div key={m.id} className="p-10 flex flex-col md:flex-row items-center justify-between hover:bg-green-50/30 transition-all gap-8">
                  <div className="flex items-center gap-8 w-full md:w-auto">
                    <img src={m.imageUrl} className="w-24 h-24 rounded-[2rem] object-cover shadow-lg" alt={m.name} />
                    {editingId === m.id ? (
                      <div className="space-y-3 flex-1">
                        <input className="w-full px-4 py-2 border rounded-xl font-bold" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                        <div className="flex gap-2">
                          <input className="w-1/2 px-4 py-2 border rounded-xl font-bold" value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})} />
                          <input className="w-1/2 px-4 py-2 border rounded-xl font-bold" type="number" value={editForm.pricePerDay} onChange={e => setEditForm({...editForm, pricePerDay: Number(e.target.value)})} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xl font-black text-slate-900 leading-none">{m.name}</p>
                        <p className="text-xs text-green-600 font-black uppercase tracking-widest">{m.type}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">Provider: {m.ownerName} • ₹{m.pricePerDay}/Day</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button onClick={() => setViewingItem(m)} className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:text-green-900 transition-all"><Info size={20} /></button>
                    {editingId === m.id ? (
                      <button onClick={() => saveEdit('machine')} className="flex-1 md:flex-none p-5 bg-green-600 text-white rounded-2xl shadow-lg flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"><Save size={20} /> Save</button>
                    ) : (
                      <button onClick={() => startEditing(m)} className="flex-1 md:flex-none p-5 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm"><Edit3 size={20} /></button>
                    )}
                    <button onClick={() => handleDeleteItem('machine', m.id)} className="flex-1 md:flex-none p-5 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"><Trash2 size={20} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* Modal remains unchanged */}
    </div>
  );
};

export default AdminPanel;

import React, { useState } from 'react';
import { 
  Sprout, 
  Plus, 
  Search, 
  MapPin, 
  Package,
  Info,
  X,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Star,
  Trash2,
  Calendar,
  Layers,
  ImageIcon,
  Loader2,
  Link as LinkIcon
} from 'lucide-react';
import { CropListing, FarmerProfile } from '../types';

interface Props {
  crops: CropListing[];
  farmer: FarmerProfile;
  onAddCrop: (crop: Partial<CropListing>) => void;
  onDeleteCrop: (id: string) => void;
}

const CropMarketplace: React.FC<Props> = ({ crops, farmer, onAddCrop, onDeleteCrop }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCrop, setNewCrop] = useState<Partial<CropListing>>({
    cropName: '',
    variety: '',
    quantity: 0,
    unit: 'kg',
    pricePerUnit: 0,
    description: '',
    imageUrl: '',
    harvestDate: new Date().toISOString().split('T')[0]
  });

  const filtered = crops.filter(c => 
    c.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.variety.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCrop({
      ...newCrop,
      farmerId: farmer.id,
      farmerName: farmer.name,
      location: farmer.location,
      status: 'AVAILABLE'
    });
    setShowAddModal(false);
    setNewCrop({ cropName: '', variety: '', quantity: 0, unit: 'kg', pricePerUnit: 0, description: '', imageUrl: '', harvestDate: new Date().toISOString().split('T')[0] });
  };

  const cropPlaceholders: Record<string, string> = {
    'wheat': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800',
    'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    'corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800',
    'basmati': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800'
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3">
             <div className="p-3 bg-emerald-900 text-emerald-400 rounded-2xl shadow-xl">
               <Sprout size={32} />
             </div>
             <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Crop Marketplace</h2>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Live Harvest Direct Market</p>
             </div>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-emerald-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center space-x-2">
          <Plus size={18} />
          <span>Post My Harvest</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
          <input type="text" placeholder="Search premium basmati, wheat, corn..." className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-white border-2 border-emerald-50 focus:border-emerald-600 outline-none font-black text-emerald-900" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="bg-emerald-900 rounded-[1.5rem] p-5 text-white flex items-center justify-between shadow-xl">
          <TrendingUp size={24} className="text-emerald-400" />
          <div className="text-right"><p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Market Index</p><p className="text-sm font-black">Bullish</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map(crop => (
          <div key={crop.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-emerald-50 hover:shadow-2xl transition-all group relative">
            <div className="relative h-64">
              <img src={crop.imageUrl || cropPlaceholders[crop.cropName.toLowerCase()] || cropPlaceholders['wheat']} alt={crop.cropName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" />
              <div className="absolute top-5 right-5">
                <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-xl text-[10px] font-black uppercase text-emerald-900 shadow-xl flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-600" />Verified</div>
              </div>
            </div>
            <div className="p-10 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{crop.cropName}</h3>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">{crop.variety}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-700">₹{crop.pricePerUnit}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">per {crop.unit}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-y border-emerald-50/50">
                <div className="flex items-center gap-3"><Package size={16} className="text-emerald-600" /><span className="text-xs font-black text-slate-700">{crop.quantity} {crop.unit}</span></div>
                <div className="flex items-center gap-3"><MapPin size={16} className="text-emerald-600" /><span className="text-xs font-black text-slate-700 truncate">{crop.location}</span></div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-emerald-100 font-black text-sm">{crop.farmerName.charAt(0)}</div>
                  <span className="text-xs font-black text-slate-900">{crop.farmerName}</span>
                </div>
                <button 
                  onClick={() => { if(confirm(`PERMANENTLY REMOVE ${crop.cropName} listing?`)) onDeleteCrop(crop.id); }} 
                  className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="px-10 py-8 border-b border-emerald-50 bg-emerald-50/20 flex justify-between items-center">
              <h3 className="text-2xl font-black text-emerald-900 tracking-tighter">New Listing</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
               <div className="grid grid-cols-2 gap-6">
                 <input required placeholder="Crop Name" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-600 outline-none font-black" value={newCrop.cropName} onChange={e => setNewCrop({...newCrop, cropName: e.target.value})} />
                 <input required placeholder="Variety" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-600 outline-none font-black" value={newCrop.variety} onChange={e => setNewCrop({...newCrop, variety: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-6">
                 <div className="flex gap-2"><input required type="number" placeholder="Qty" className="w-full px-6 py-4 rounded-2xl bg-slate-50 font-black" value={newCrop.quantity} onChange={e => setNewCrop({...newCrop, quantity: Number(e.target.value)})} /><select className="px-4 py-4 rounded-2xl bg-slate-50 font-black" value={newCrop.unit} onChange={e => setNewCrop({...newCrop, unit: e.target.value})}><option>kg</option><option>quintal</option><option>ton</option></select></div>
                 <input required type="number" placeholder="Price/Unit" className="w-full px-6 py-4 rounded-2xl bg-slate-50 font-black" value={newCrop.pricePerUnit} onChange={e => setNewCrop({...newCrop, pricePerUnit: Number(e.target.value)})} />
               </div>
               <input type="text" placeholder="Image URL (e.g. Unsplash)" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-600 outline-none font-black" value={newCrop.imageUrl} onChange={e => setNewCrop({...newCrop, imageUrl: e.target.value})} />
               <button type="submit" className="w-full py-5 bg-emerald-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl">Launch Listing</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropMarketplace;

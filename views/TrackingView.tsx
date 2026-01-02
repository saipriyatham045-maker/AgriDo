
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, CheckCircle2, Loader2, Phone, MessageCircle, Info } from 'lucide-react';
import { FarmerProfile, Machinery } from '../types';
import { MOCK_MACHINERY } from '../data/mockData';

const TrackingView: React.FC<{ farmer: FarmerProfile }> = ({ farmer }) => {
  const activeBookings = farmer.history.filter(tx => tx.status === 'PENDING' && tx.type === 'BOOKING');
  
  // State for simulated ETA and progress
  const [eta, setEta] = useState(24);
  const [progress, setProgress] = useState(65);

  useEffect(() => {
    const timer = setInterval(() => {
      setEta(prev => Math.max(prev - 1, 5));
      setProgress(prev => Math.min(prev + 0.5, 95));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col space-y-2 px-4 md:px-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
            <Navigation size={24} className="animate-pulse" />
          </div>
          <h2 className="text-3xl font-black text-green-900 tracking-tighter">Fleet Tracking</h2>
        </div>
        <p className="text-gray-500 font-medium">Real-time GPS updates for your booked agricultural machinery</p>
      </div>

      {activeBookings.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-green-100 rounded-[2.5rem] p-16 text-center shadow-sm mx-4 md:mx-0">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600 ring-8 ring-green-50/50">
            <Navigation size={48} className="animate-bounce" />
          </div>
          <h3 className="text-2xl font-black text-green-900 mb-3">No Active Trackings</h3>
          <p className="text-gray-500 max-w-sm mx-auto font-medium">
            Book a service from the machinery marketplace to see its movement here.
          </p>
        </div>
      ) : (
        <div className="space-y-8 px-4 md:px-0">
          {activeBookings.map((booking) => {
            const machineDetails = MOCK_MACHINERY.find(m => m.name === booking.serviceName);
            
            return (
              <div key={booking.id} className="bg-white rounded-[2.5rem] border border-green-100 shadow-xl shadow-green-900/5 overflow-hidden group">
                <div className="p-8 border-b border-green-50 bg-green-50/20">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-lg shrink-0">
                        <img 
                          src={machineDetails?.imageUrl} 
                          alt={booking.serviceName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-2xl font-black text-green-900 leading-none">{booking.serviceName}</h3>
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Live</span>
                        </div>
                        <p className="text-sm font-bold text-green-600 mt-2 uppercase tracking-[0.15em]">TRK-ID: {booking.id.split('-')[1]}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-3xl shadow-sm border border-green-50 w-full md:w-auto">
                      <Clock className="text-green-500" size={24} />
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Arrival ETA</p>
                        <p className="text-xl font-black text-green-900">{eta} Mins</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Photo Section */}
                <div className="relative aspect-[16/10] md:aspect-[21/9] bg-slate-200 overflow-hidden">
                  {/* Random Professional Map Photo as requested */}
                  <img 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000" 
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                    alt="Agricultural Region Map"
                  />
                  
                  {/* Tracking Path Overlay */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path 
                      d="M 10 80 Q 30 20 60 50 T 85 20" 
                      fill="none" 
                      stroke="#4CAF50" 
                      strokeWidth="0.8" 
                      strokeDasharray="2,2" 
                      className="opacity-60"
                    />
                    <path 
                      d="M 10 80 Q 30 20 60 50 T 85 20" 
                      fill="none" 
                      stroke="#065f46" 
                      strokeWidth="1.2" 
                      strokeDasharray="200" 
                      strokeDashoffset={200 - (2 * progress)}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>

                  {/* Machine Marker (Moving) */}
                  <div 
                    className="absolute transition-all duration-1000 ease-linear" 
                    style={{ 
                      left: `${10 + (progress * 0.75)}%`, 
                      top: `${80 - (progress * 0.6)}%` 
                    }}
                  >
                    <div className="relative -translate-x-1/2 -translate-y-1/2">
                      <div className="absolute -inset-8 bg-green-500/20 rounded-full animate-ping" />
                      <div className="bg-emerald-900 p-4 rounded-2xl text-white shadow-2xl ring-4 ring-white relative z-10 rotate-12">
                        <Navigation size={28} />
                      </div>
                    </div>
                  </div>

                  {/* Destination Marker */}
                  <div className="absolute right-[10%] top-[10%] -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="bg-red-600 p-3 rounded-full text-white shadow-xl ring-4 ring-white">
                        <MapPin size={24} />
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-3 py-1 rounded-lg text-[10px] font-black text-gray-900 shadow-md whitespace-nowrap uppercase tracking-widest border border-gray-100">
                        My Field
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator Bar */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-2xl border border-white/50 flex items-center space-x-6">
                       <div className="bg-green-100 p-3 rounded-2xl text-green-700">
                         <Info size={24} />
                       </div>
                       <div className="flex-1">
                         <div className="flex justify-between items-center mb-1">
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress to Farm</span>
                           <span className="text-xs font-black text-green-700">{Math.round(progress)}%</span>
                         </div>
                         <div className="w-full bg-green-50 h-2 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-700 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                         </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Footer Operations */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-full bg-emerald-900 flex items-center justify-center text-white text-xl font-black border-4 border-white shadow-md">
                        {machineDetails?.ownerName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Authorized Driver</p>
                        <p className="text-lg font-black text-slate-900">{machineDetails?.ownerName}</p>
                        <div className="flex items-center text-xs font-bold text-emerald-600 mt-0.5">
                          <CheckCircle2 size={12} className="mr-1" />
                          <span>AgriDo Safety Verified</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <a href="tel:+919876543210" className="p-4 bg-emerald-900 text-white rounded-2xl shadow-lg hover:bg-black transition-all">
                        <Phone size={20} />
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Journey Events</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 border-2 border-white shadow-sm">
                          <CheckCircle2 size={16} />
                        </div>
                        <p className="text-sm font-black text-slate-900">Operator En Route</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-white border-2 border-white shadow-md animate-pulse">
                          <Navigation size={14} />
                        </div>
                        <p className="text-sm font-black text-emerald-700">Approaching Hub Alpha</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrackingView;

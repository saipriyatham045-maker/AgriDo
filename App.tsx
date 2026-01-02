
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingCart, 
  Wallet, 
  Users, 
  Bell,
  CheckCircle2,
  Navigation,
  PhoneCall,
  Home,
  Loader2,
  LogOut,
  Briefcase,
  Sprout,
  ShieldCheck,
  Wifi,
  WifiOff,
  Database,
  Tractor
} from 'lucide-react';
import { UserRole, Transaction, Machinery, FarmerProfile, AdminSettings, NotificationRecord, PaymentMethodType, CropListing } from './types';
import { DataService } from './services/dataService';
import FarmerDashboard from './views/FarmerDashboard';
import MachineryMarketplace from './views/MachineryMarketplace';
import AdminPanel from './views/AdminPanel';
import WalletView from './views/WalletView';
import TrackingView from './views/TrackingView';
import LoginPage from './views/LoginPage';
import ServiceProviderDashboard from './views/ServiceProviderDashboard';
import CropMarketplace from './views/CropMarketplace';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'marketplace' | 'wallet' | 'admin' | 'tracking' | 'crops'>('dashboard');
  const [role, setRole] = useState<UserRole>(UserRole.FARMER);
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [crops, setCrops] = useState<CropListing[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [toastQueue, setToastQueue] = useState<{msg: string, type: 'success' | 'error'}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState('Secure Audit');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      try {
        const [fData, sData, mData, cData] = await Promise.all([
          DataService.getFarmer(),
          DataService.getSettings(),
          DataService.getMachinery(),
          DataService.getCrops()
        ]);

        setFarmer(fData);
        setSettings(sData);
        setMachinery(mData);
        setCrops(cData);
        setIsLocalMode(!DataService.isCloudEnabled());
        
        const session = localStorage.getItem('agridu_session');
        const savedRole = localStorage.getItem('agridu_role') as UserRole;
        const savedName = localStorage.getItem('agridu_name');

        if (session === 'active') {
          setIsLoggedIn(true);
          if (savedRole) {
            setRole(savedRole);
            if (savedRole === UserRole.ADMIN) setActiveTab('dashboard');
          }
          if (savedName && fData) setFarmer({ ...fData, name: savedName });
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  const addToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastQueue(prev => [{msg, type}, ...prev]);
    setTimeout(() => setToastQueue(prev => prev.slice(0, -1)), 5000);
  };

  const addNotification = useCallback((msg: string, type: 'REMINDER' | 'SUCCESS' | 'ALERT' = 'REMINDER') => {
    const newNote: NotificationRecord = {
      id: `note-${Date.now()}-${Math.random()}`,
      message: msg,
      timestamp: new Date().toLocaleTimeString(),
      type,
      isRead: false
    };
    setNotifications(prev => [newNote, ...prev]);
    addToast(msg, type === 'SUCCESS' ? 'success' : 'error');
  }, []);

  const handleLogin = (name: string, mobile: string, selectedRole: UserRole) => {
    setIsLoggedIn(true);
    setRole(selectedRole);
    localStorage.setItem('agridu_session', 'active');
    localStorage.setItem('agridu_role', selectedRole);
    localStorage.setItem('agridu_name', name);
    
    if (farmer) {
      const updatedFarmer = { ...farmer, name };
      setFarmer(updatedFarmer);
      DataService.saveFarmer(updatedFarmer);
    }
    
    setActiveTab('dashboard');
    addToast(`Welcome back, ${name}!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('agridu_session');
    localStorage.removeItem('agridu_role');
    localStorage.removeItem('agridu_name');
    setActiveTab('dashboard');
    setRole(UserRole.FARMER);
    addToast("Logged out successfully");
  };

  const handleUpdateBooking = async (id: string, updates: Partial<Transaction>) => {
    if (!farmer) return;
    setIsProcessing(true);
    setProcessingMsg('Updating Booking');
    const updatedHistory = farmer.history.map(tx => tx.id === id ? { ...tx, ...updates } : tx);
    const updatedFarmer = { ...farmer, history: updatedHistory };
    await DataService.saveFarmer(updatedFarmer);
    setFarmer(updatedFarmer);
    setIsLocalMode(!DataService.isCloudEnabled());
    setIsProcessing(false);
    addToast("Booking updated");
  };

  const handleAddMachine = async (machine: Partial<Machinery>) => {
    setIsProcessing(true);
    setProcessingMsg('Adding Equipment');
    const newMachine: Machinery = {
      id: `m-${Date.now()}`,
      name: machine.name || 'Equipment',
      type: machine.type || 'Tractor',
      ownerId: 'p-current',
      ownerName: machine.ownerName || 'Provider',
      pricePerDay: machine.pricePerDay || 0,
      imageUrl: machine.imageUrl || 'https://images.unsplash.com/photo-1595066344551-0e1041183f06?auto=format&fit=crop&q=80&w=1000',
      description: machine.description || ''
    };
    await DataService.addMachinery(newMachine);
    setMachinery(prev => [newMachine, ...prev]);
    setIsLocalMode(!DataService.isCloudEnabled());
    setIsProcessing(false);
    addToast("Machinery added");
  };

  const handleDeleteMachine = async (id: string) => {
    setIsProcessing(true);
    setProcessingMsg('Deleting Equipment');
    try {
      await DataService.deleteMachinery(id);
      setMachinery(prev => prev.filter(m => m.id !== id));
      addToast("Machinery removed permanently");
    } catch (e) {
      addToast("Failed to remove machinery", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddCrop = async (crop: Partial<CropListing>) => {
    if (!farmer) return;
    setIsProcessing(true);
    setProcessingMsg('Publishing Listing');
    const newCrop: CropListing = {
      id: `c-${Date.now()}`,
      farmerId: farmer.id,
      farmerName: farmer.name,
      cropName: crop.cropName || 'Crop',
      variety: crop.variety || '',
      quantity: crop.quantity || 0,
      unit: crop.unit || 'kg',
      pricePerUnit: crop.pricePerUnit || 0,
      location: crop.location || farmer.location,
      harvestDate: crop.harvestDate || new Date().toISOString().split('T')[0],
      imageUrl: crop.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800',
      description: crop.description || '',
      status: 'AVAILABLE'
    };
    await DataService.addCrop(newCrop);
    setCrops(prev => [newCrop, ...prev]);
    setIsLocalMode(!DataService.isCloudEnabled());
    setIsProcessing(false);
    addToast("Crop listing posted");
  };

  const handleDeleteCrop = async (id: string) => {
    setIsProcessing(true);
    setProcessingMsg('Removing Listing');
    try {
      await DataService.deleteCrop(id);
      setCrops(prev => prev.filter(c => c.id !== id));
      addToast("Listing removed permanently");
    } catch (e) {
      addToast("Failed to remove crop", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBooking = async (machine: Machinery, usePayLater: boolean) => {
    if (!farmer || !settings) return;
    const fee = usePayLater ? 250 : 0;
    const amount = machine.pricePerDay + fee;
    if (usePayLater && (farmer.outstandingBalance + amount > farmer.creditLimit)) {
      addToast("❌ Credit Limit Exceeded!", 'error');
      return;
    }
    setIsProcessing(true);
    setProcessingMsg('Processing Order');
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      serviceName: machine.name,
      amount: machine.pricePerDay,
      date: new Date().toISOString().split('T')[0],
      dueDate: usePayLater ? new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      status: 'PENDING',
      type: 'BOOKING',
      convenienceFee: fee,
      agriDoCommission: machine.pricePerDay * (settings.commissionRate / 100)
    };
    const updatedFarmer = { ...farmer, outstandingBalance: usePayLater ? farmer.outstandingBalance + amount : farmer.outstandingBalance, history: [newTx, ...farmer.history] };
    await DataService.saveFarmer(updatedFarmer);
    setFarmer(updatedFarmer);
    setIsLocalMode(!DataService.isCloudEnabled());
    setIsProcessing(false);
    addNotification(`✅ ${machine.name} booked!`, 'SUCCESS');
  };

  const handleRepayment = async (amount: number, method: PaymentMethodType) => {
    if (!farmer) return;
    if (amount <= 0 || amount > farmer.outstandingBalance) return;
    setIsProcessing(true);
    setProcessingMsg('Repayment Secure Audit');
    try {
      const response = await DataService.processPayment(amount, method, farmer);
      if (response.success) {
        const newTx: Transaction = {
          id: response.transactionId,
          serviceName: 'Credit Repayment',
          amount: amount,
          date: new Date().toISOString().split('T')[0],
          status: 'COMPLETED',
          type: 'REPAYMENT',
          paymentMethod: method
        };
        const updatedFarmer = { ...farmer, outstandingBalance: farmer.outstandingBalance - amount, history: [newTx, ...farmer.history] };
        await DataService.saveFarmer(updatedFarmer);
        setFarmer(updatedFarmer);
        setIsLocalMode(!DataService.isCloudEnabled());
        addNotification(`💸 Repayment success via ${method}!`, 'SUCCESS');
      }
    } catch (e: any) {
      addToast(`❌ Secure Error: ${e.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const updateAdminSettings = async (newSettings: AdminSettings) => {
    setSettings(newSettings);
    await DataService.saveSettings(newSettings);
    setIsLocalMode(!DataService.isCloudEnabled());
  };

  const BottomNavItem = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center flex-1 py-2 transition-all ${
        activeTab === id ? 'text-green-600 scale-110' : 'text-gray-400'
      }`}
    >
      <Icon size={24} className={activeTab === id ? 'fill-green-50' : ''} />
      <span className="text-[10px] font-black uppercase tracking-widest mt-1">{label}</span>
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
          <p className="text-sm font-black text-green-900 uppercase tracking-widest">Securing Connection...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (role === UserRole.FARMER) return <FarmerDashboard farmer={farmer!} notifications={notifications} />;
        if (role === UserRole.PROVIDER) return <ServiceProviderDashboard providerName={farmer!.name} machinery={machinery} history={farmer!.history} onAddMachine={handleAddMachine} onDeleteMachine={handleDeleteMachine} onUpdateBooking={handleUpdateBooking} />;
        if (role === UserRole.ADMIN) return <AdminPanel settings={settings!} onUpdateSettings={updateAdminSettings} onNavigate={setActiveTab} />;
        return null;
      case 'marketplace':
        return <MachineryMarketplace machinery={machinery} onBook={handleBooking} farmer={farmer!} />;
      case 'crops':
        return <CropMarketplace crops={crops} farmer={farmer!} onAddCrop={handleAddCrop} onDeleteCrop={handleDeleteCrop} />;
      case 'tracking':
        return <TrackingView farmer={farmer!} />;
      case 'wallet':
        return <WalletView farmer={farmer!} onRepay={handleRepayment} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 pb-20">
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-green-50 flex items-center space-x-4">
            <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
            <div className="flex flex-col">
              <span className="font-black text-green-900 uppercase text-[10px] tracking-widest">{processingMsg}</span>
              <span className="font-bold text-gray-400 text-[8px] uppercase tracking-widest">Validating with AgriDo AI...</span>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white border-b border-green-100 sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="text-green-600" size={24} />
            <span className="text-xl font-black text-green-700 tracking-tighter">AgriDo</span>
          </div>
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border transition-all ${isLocalMode ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
            {isLocalMode ? <WifiOff size={12} /> : <Wifi size={12} />}
            <span className="text-[8px] font-black uppercase tracking-widest">{isLocalMode ? 'Local Mode' : 'Cloud Sync'}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center hover:bg-red-100 active:scale-95"><LogOut size={18} /></button>
      </header>

      <main className="flex-1 p-4 md:p-8 overflow-auto max-w-7xl mx-auto w-full">
        {renderContent()}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <nav className="bg-white border-t border-green-100 flex items-center justify-around px-2 py-1 shadow-lg">
          <BottomNavItem id="dashboard" icon={Home} label="Home" />
          {(role === UserRole.FARMER || role === UserRole.ADMIN) && (
            <>
              <BottomNavItem id="crops" icon={Sprout} label="Crops" />
              <BottomNavItem id="marketplace" icon={Tractor} label="Machinery" />
              {role === UserRole.FARMER && <BottomNavItem id="tracking" icon={Navigation} label="Track" />}
              {role === UserRole.FARMER && <BottomNavItem id="wallet" icon={Wallet} label="Wallet" />}
            </>
          )}
          {role === UserRole.PROVIDER && <BottomNavItem id="marketplace" icon={Briefcase} label="Fleet" />}
        </nav>
      </div>

      <div className="fixed bottom-24 right-4 z-50 flex flex-col space-y-2">
        {toastQueue.map((toast, idx) => (
          <div key={idx} className={`${toast.type === 'success' ? 'bg-green-900' : 'bg-red-900'} text-white shadow-2xl rounded-xl px-5 py-4 flex items-center space-x-3 transform animate-in slide-in-from-right`}>
            <CheckCircle2 size={18} />
            <div className="flex-1 text-sm font-bold">{toast.msg}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


import { FarmerProfile, AdminSettings, Machinery, Transaction, PaymentMethodType, CropListing } from '../types';
import { MOCK_FARMER, DEFAULT_SETTINGS, MOCK_MACHINERY } from '../data/mockData';
import { GoogleGenAI, Type } from "@google/genai";
import { PaymentGateway } from './paymentService';
import { db } from './firebase';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const STORAGE_KEYS = {
  FARMER: 'agridu_farmer_data',
  SETTINGS: 'agridu_settings_data',
  MACHINERY: 'agridu_machinery_data',
  CROPS: 'agridu_crops_data',
};

const COLLECTIONS = {
  FARMERS: 'farmers',
  SETTINGS: 'settings',
  MACHINERY: 'machinery',
  CROPS: 'crops',
};

let cloudAvailable = !!db;

const withFallback = async <T>(
  firestoreOp: () => Promise<T>, 
  fallbackData: T, 
  localKey: string
): Promise<T> => {
  if (cloudAvailable && db) {
    try {
      return await firestoreOp();
    } catch (error: any) {
      console.warn(`[AgriDo] Firestore Error, falling back to local storage: ${error.message}`);
      if (error.code === 'permission-denied' || error.message.includes('not available')) {
         cloudAvailable = false;
      }
    }
  }

  const stored = localStorage.getItem(localKey);
  if (stored) return JSON.parse(stored);
  
  localStorage.setItem(localKey, JSON.stringify(fallbackData));
  return fallbackData;
};

const simulateNetwork = (ms: number = 600) => new Promise(resolve => setTimeout(resolve, ms));

export const DataService = {
  isCloudEnabled: () => cloudAvailable,

  async requestOTP(mobile: string): Promise<{ sessionId: string; message: string }> {
    await simulateNetwork(800);
    return { 
      sessionId: `sid_${Date.now()}`, 
      message: "Security code sent! Enter any 4 digits to proceed." 
    };
  },

  async verifyOTP(sessionId: string, code: string): Promise<{ success: boolean; message: string }> {
    await simulateNetwork(600);
    const isValid = /^\d{4}$/.test(code); 
    return { 
      success: isValid, 
      message: isValid ? "Verified." : "Invalid code. Please enter 4 digits." 
    };
  },

  async auditTransaction(amount: number, method: PaymentMethodType, farmer: FarmerProfile) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Audit payment for Farmer: ${farmer.name}, Amount: ₹${amount}, Method: ${method}. Analyze safety.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              reason: { type: Type.STRING }
            }
          }
        }
      });
      return JSON.parse(response.text);
    } catch (e) {
      return { status: "SAFE", confidence: 1, reason: "Bypassed AI audit." };
    }
  },

  async processPayment(amount: number, method: PaymentMethodType, farmer: FarmerProfile): Promise<{ success: boolean; transactionId: string }> {
    const audit = await this.auditTransaction(amount, method, farmer);
    if (audit.status === "RISKY") {
      throw new Error(`Transaction Blocked: ${audit.reason}`);
    }

    const paymentResponse = await PaymentGateway.openCheckout({
      amount,
      userName: farmer.name,
      method
    });

    if (!paymentResponse.success) {
      throw new Error("Payment gateway transaction failed.");
    }

    return { 
      success: true, 
      transactionId: paymentResponse.paymentId 
    };
  },

  async getFarmer(): Promise<FarmerProfile> {
    return withFallback(
      async () => {
        if (!db) throw new Error("Firestore missing");
        const docRef = doc(db, COLLECTIONS.FARMERS, 'f-001');
        const snap = await getDoc(docRef);
        if (snap.exists()) return snap.data() as FarmerProfile;
        await setDoc(docRef, MOCK_FARMER);
        return MOCK_FARMER;
      },
      MOCK_FARMER,
      STORAGE_KEYS.FARMER
    );
  },

  async saveFarmer(farmer: FarmerProfile): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.FARMER, JSON.stringify(farmer));
    if (cloudAvailable && db) {
      try {
        await setDoc(doc(db, COLLECTIONS.FARMERS, 'f-001'), farmer);
      } catch (e) {}
    }
  },

  async getSettings(): Promise<AdminSettings> {
    return withFallback(
      async () => {
        if (!db) throw new Error("Firestore missing");
        const docRef = doc(db, COLLECTIONS.SETTINGS, 'global');
        const snap = await getDoc(docRef);
        if (snap.exists()) return snap.data() as AdminSettings;
        await setDoc(docRef, DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      },
      DEFAULT_SETTINGS,
      STORAGE_KEYS.SETTINGS
    );
  },

  async saveSettings(settings: AdminSettings): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    if (cloudAvailable && db) {
      try {
        await setDoc(doc(db, COLLECTIONS.SETTINGS, 'global'), settings);
      } catch (e) {}
    }
  },

  async getMachinery(): Promise<Machinery[]> {
    return withFallback(
      async () => {
        if (!db) throw new Error("Firestore missing");
        const colRef = collection(db, COLLECTIONS.MACHINERY);
        const snap = await getDocs(colRef);
        if (snap.empty) {
          for (const m of MOCK_MACHINERY) {
            await setDoc(doc(db, COLLECTIONS.MACHINERY, m.id), m);
          }
          return MOCK_MACHINERY;
        }
        return snap.docs.map(d => d.data() as Machinery);
      },
      MOCK_MACHINERY,
      STORAGE_KEYS.MACHINERY
    );
  },

  async addMachinery(machine: Machinery): Promise<void> {
    const existing = await this.getMachinery();
    const updated = [machine, ...existing];
    localStorage.setItem(STORAGE_KEYS.MACHINERY, JSON.stringify(updated));
    if (cloudAvailable && db) {
      try {
        await setDoc(doc(db, COLLECTIONS.MACHINERY, machine.id), machine);
      } catch (e) {}
    }
  },

  async deleteMachinery(id: string): Promise<void> {
    const existingStr = localStorage.getItem(STORAGE_KEYS.MACHINERY);
    if (existingStr) {
      const updated = JSON.parse(existingStr).filter((m: Machinery) => m.id !== id);
      localStorage.setItem(STORAGE_KEYS.MACHINERY, JSON.stringify(updated));
    }
    
    if (cloudAvailable && db) {
      try {
        await deleteDoc(doc(db, COLLECTIONS.MACHINERY, id));
      } catch (e: any) {
        console.warn("Cloud delete failed, local sync only", e);
      }
    }
  },

  async getCrops(): Promise<CropListing[]> {
    return withFallback(
      async () => {
        if (!db) throw new Error("Firestore missing");
        const colRef = collection(db, COLLECTIONS.CROPS);
        const snap = await getDocs(colRef);
        return snap.docs.map(d => d.data() as CropListing);
      },
      [],
      STORAGE_KEYS.CROPS
    );
  },

  async addCrop(crop: CropListing): Promise<void> {
    const existing = await this.getCrops();
    const updated = [crop, ...existing];
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(updated));
    if (cloudAvailable && db) {
      try {
        await setDoc(doc(db, COLLECTIONS.CROPS, crop.id), crop);
      } catch (e) {}
    }
  },

  async deleteCrop(id: string): Promise<void> {
    const existingStr = localStorage.getItem(STORAGE_KEYS.CROPS);
    if (existingStr) {
      const updated = JSON.parse(existingStr).filter((c: CropListing) => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(updated));
    }
    
    if (cloudAvailable && db) {
      try {
        await deleteDoc(doc(db, COLLECTIONS.CROPS, id));
      } catch (e: any) {
        console.warn("Cloud delete failed, local sync only", e);
      }
    }
  },

  async resetBackend(): Promise<void> {
    localStorage.clear();
    window.location.reload();
  },

  async verifyUPI(upiId: string): Promise<{ success: boolean; userName?: string; message?: string }> {
    await simulateNetwork(800);
    return { success: true, userName: "Verified Partner" };
  },
};

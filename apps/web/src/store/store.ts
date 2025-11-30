import { create } from "zustand";

// ✅ Extension 3D du FurnitureObject
export type FurnitureObject = {
  id: string;
  name?: string;
  type?: string; // furniture type (bed, kitchen, storage, etc.)
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  
  // ✨ NOUVEAUX CHAMPS 3D
  z?: number;              // Position en hauteur (défaut: 0 = au sol)
  depth?: number;          // Profondeur 3D (défaut: height pour cube)
  rotation?: {             // Rotation sur 3 axes (en degrés)
    x?: number;
    y?: number;
    z?: number;
  };
  model3D?: string;        // Futur: URL du modèle 3D (.glb/.gltf)
};

export type Plan = {
  id: number;
  name: string;
  jsonData: FurnitureObject[];
  vanType?: string;
  expiresAt?: string;
};

export type UserSettings = {
  darkMode: boolean;
  language: 'fr' | 'en';
  currency: 'EUR' | 'USD';
};

// ✨ NOUVEAU : Mode de vue
export type ViewMode = '2D' | '3D';

type StoreState = {
  // --- Van + plans ---
  objects: FurnitureObject[];
  plans: Plan[];
  vanType: string;

  // --- Auth ---
  loggedIn: boolean;
  userName: string | null;
  userEmail: string | null;
  subscription: string | null;

  // --- Settings ---
  settings: UserSettings;
  
  // ✨ NOUVEAU : Vue 2D/3D
  viewMode: ViewMode;

  // --- Actions ---
  setVanType: (vt: string) => void;
  addObject: (o: FurnitureObject) => void;
  updateObject: (id: string, props: Partial<FurnitureObject>) => void;
  removeObject: (id: string) => void;
  addPlan: (p: Plan) => void;
  updatePlan: (p: Plan) => void;
  removePlan: (id: number) => void;

  // --- Auth setters ---
  setLoggedIn: (val: boolean) => void;
  setUserName: (name: string | null) => void;
  setUserEmail: (email: string | null) => void;
  setSubscription: (sub: string | null) => void;
  resetState: () => void;

  // --- Settings actions ---
  setSettings: (settings: Partial<UserSettings>) => void;
  applyTheme: () => void;
  
  // ✨ NOUVEAU : Toggle vue
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
};

export const useStore = create<StoreState>((set, get) => ({
  // -------------------------------------------
  // INITIAL STATE
  // -------------------------------------------
  objects: [],
  plans: [],
  vanType: "",

  // Initial user data
  userName: (() => {
    const u = localStorage.getItem("user");
    if (!u) return null;
    try {
      const name = JSON.parse(u).name || null;
      console.log('🔵 [STORE INIT] userName:', name);
      return name;
    } catch { return null; }
  })(),
  subscription: (() => {
    const u = localStorage.getItem("user");
    if (!u) return "FREE";
    try { return JSON.parse(u).subscription || "FREE"; } catch { return "FREE"; }
  })(),
  userEmail: (() => {
    const u = localStorage.getItem("user");
    if (!u) return null;
    try { return JSON.parse(u).email || null; } catch { return null; }
  })(),
  loggedIn: !!localStorage.getItem("token"),

  settings: {
    darkMode: false,
    language: 'fr',
    currency: 'EUR'
  },
  
  // ✨ NOUVEAU : Vue par défaut en 2D
  viewMode: '2D',

  // -------------------------------------------
  // ACTIONS
  // -------------------------------------------
  setVanType: (vt) => set({ vanType: vt, objects: [] }),
  addObject: (o) => set((s) => ({ objects: [...s.objects, o] })),
  updateObject: (id, props) => set((s) => ({ objects: s.objects.map((o) => (o.id === id ? { ...o, ...props } : o)) })),
  removeObject: (id) => set((s) => ({ objects: s.objects.filter((o) => o.id !== id) })),
  addPlan: (p) => set((s) => ({ plans: [...s.plans, p] })),
  updatePlan: (p) => set((s) => ({ plans: s.plans.map((x) => (x.id === p.id ? p : x)) })),
  removePlan: (id) => set((s) => ({ plans: s.plans.filter((p) => p.id !== id) })),

  // ----------------------------
  // AUTH ACTIONS
  // ----------------------------
  setLoggedIn: (val) => {
    console.log('🟢 [STORE] setLoggedIn:', val);
    set({ loggedIn: val });
  },
  setUserName: (name) => {
    console.log('🟢 [STORE] setUserName:', name);
    set({ userName: name });
  },
  setSubscription: (sub) => {
    console.log('🟢 [STORE] setSubscription:', sub);
    set({ subscription: sub });
  },
  setUserEmail: (email) => {
    console.log('🟢 [STORE] setUserEmail:', email);
    set({ userEmail: email });
  },

  // ----------------------------
  // RESET (logout)
  // ----------------------------
  resetState: () => {
    console.log('🔴 [STORE] resetState called');
    set({
      loggedIn: false,
      userName: null,
      userEmail: null,
      subscription: "FREE",
      viewMode: '2D',
      settings: {
        darkMode: false,
        language: 'fr',
        currency: 'EUR'
      }
    });
    document.body.classList.remove('dark-theme');
  },

  // ----------------------------
  // SETTINGS ACTIONS
  // ----------------------------
  setSettings: (newSettings) => {
    console.log('🟢 [STORE] setSettings:', newSettings);
    set((state) => {
      const updatedSettings = { ...state.settings, ...newSettings };

      if (updatedSettings.darkMode) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }

      return { settings: updatedSettings };
    });
  },

  applyTheme: () => {
    const state = useStore.getState();
    if (state.settings.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  },
  
  // ✨ NOUVEAU : Actions pour la vue 3D
  setViewMode: (mode) => {
    console.log('🟢 [STORE] setViewMode:', mode);
    set({ viewMode: mode });
  },
  
  toggleViewMode: () => {
    const current = get().viewMode;
    const newMode = current === '2D' ? '3D' : '2D';
    console.log('🟢 [STORE] toggleViewMode:', current, '→', newMode);
    set({ viewMode: newMode });
  }
}));

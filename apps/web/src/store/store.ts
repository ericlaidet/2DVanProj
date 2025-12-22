// apps/web/src/store/store.ts
import { create } from "zustand";

// ✅ Extension 3D complète du FurnitureObject
export type FurnitureObject = {
  id: string;
  name?: string;
  type?: string;      // furniture type (bed, kitchen, storage, bathroom, table, seat, custom)
  x: number;          // Position X (mm) - Coordonnée 2D
  y: number;          // Position Y (mm) - Coordonnée 2D
  z?: number;         // Position Z / Hauteur (mm) - Axe vertical 3D ⚠️ IMPORTANT
  width: number;      // Largeur (mm) - Dimension X
  height: number;     // Hauteur (mm) - Dimension Z (en 2D) ou Y (en 3D si pas de depth)
  depth?: number;     // Profondeur (mm) - Dimension Y en 3D ⚠️ IMPORTANT
  color: string;      // Couleur principale du meuble

  // ✨ Rotation sur 3 axes (en degrés)
  rotation?: {
    x?: number;       // Rotation X (pitch) - Basculement avant/arrière
    y?: number;       // Rotation Y (yaw) - Rotation horizontale
    z?: number;       // Rotation Z (roll) - Rotation latérale
  };

  // 🔮 Fonctionnalités futures
  model3D?: string;        // URL du modèle 3D personnalisé (.glb/.gltf)
  texture?: string;        // URL de la texture personnalisée
  material?: {             // Propriétés du matériau
    roughness?: number;    // Rugosité (0-1)
    metalness?: number;    // Métallicité (0-1)
    opacity?: number;      // Opacité (0-1)
  };
  locked?: boolean;        // Verrouiller le meuble (pas de déplacement)
  visible?: boolean;       // Visibilité du meuble
  layer?: number;          // Calque (pour groupement)
};

export type Plan = {
  id: number;
  name: string;
  jsonData: FurnitureObject[];
  vanType?: string;
  expiresAt?: string;
  thumbnail?: string;      // Miniature du plan
  createdAt?: string;      // Date de création
  updatedAt?: string;      // Date de dernière modification
  planVans?: Array<{
    van: {
      vanType: string;
    }
  }>;
};

export type UserSettings = {
  darkMode: boolean;
  language: 'fr' | 'en';
  currency: 'EUR' | 'USD';
  // ✨ Nouveaux paramètres 3D
  gridSnap?: boolean;              // Activer le snap à la grille
  gridSize?: number;               // Taille de la grille (mm)
  showGrid?: boolean;              // Afficher la grille
  shadowQuality?: 'low' | 'medium' | 'high';  // Qualité des ombres
  antialias?: boolean;             // Antialiasing
  fps?: boolean;                   // Afficher les FPS
};

// ✨ Mode de vue 2D/3D
export type ViewMode = '2D' | '3D';

// ✨ Mode de transformation 3D
export type TransformMode = 'translate' | 'rotate' | 'scale';

type StoreState = {
  // ==========================================
  // VAN + PLANS
  // ==========================================
  objects: FurnitureObject[];
  plans: Plan[];
  vanType: string;

  // ==========================================
  // AUTH
  // ==========================================
  loggedIn: boolean;
  userName: string | null;
  userEmail: string | null;
  subscription: string | null;

  // ==========================================
  // SETTINGS
  // ==========================================
  settings: UserSettings;

  // ==========================================
  // VUE 2D/3D
  // ==========================================
  viewMode: ViewMode;

  // ✨ NOUVEAU : Sélection et transformation 3D
  selectedObjectId: string | null;
  transformMode: TransformMode;

  // ✨ NOUVEAU : Historique (Undo/Redo)
  history: FurnitureObject[][];
  historyIndex: number;

  // ==========================================
  // ACTIONS - VAN & OBJECTS
  // ==========================================
  setVanType: (vt: string) => void;
  addObject: (o: FurnitureObject) => void;
  updateObject: (id: string, props: Partial<FurnitureObject>) => void;
  removeObject: (id: string) => void;
  duplicateObject: (id: string) => void;
  clearAllObjects: () => void;

  // ==========================================
  // ACTIONS - PLANS
  // ==========================================
  addPlan: (p: Plan) => void;
  updatePlan: (p: Plan) => void;
  removePlan: (id: number) => void;
  loadPlan: (plan: Plan) => void;

  // ==========================================
  // ACTIONS - AUTH
  // ==========================================
  setLoggedIn: (val: boolean) => void;
  setUserName: (name: string | null) => void;
  setUserEmail: (email: string | null) => void;
  setSubscription: (sub: string | null) => void;
  resetState: () => void;

  // ==========================================
  // ACTIONS - SETTINGS
  // ==========================================
  setSettings: (settings: Partial<UserSettings>) => void;
  applyTheme: () => void;

  // ==========================================
  // ACTIONS - VUE 2D/3D
  // ==========================================
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;

  // ✨ NOUVEAU : Sélection et transformation
  setSelectedObjectId: (id: string | null) => void;
  setTransformMode: (mode: TransformMode) => void;

  // ✨ NOUVEAU : Historique
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

export const useStore = create<StoreState>((set, get) => ({
  // ==========================================
  // INITIAL STATE
  // ==========================================
  objects: [],
  plans: [],
  vanType: "",

  // Initial user data from localStorage
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
    try {
      return JSON.parse(u).subscription || "FREE";
    } catch {
      return "FREE";
    }
  })(),

  userEmail: (() => {
    const u = localStorage.getItem("user");
    if (!u) return null;
    try {
      return JSON.parse(u).email || null;
    } catch {
      return null;
    }
  })(),

  loggedIn: !!localStorage.getItem("token"),

  // Settings par défaut
  settings: {
    darkMode: false,
    language: 'fr',
    currency: 'EUR',
    gridSnap: true,
    gridSize: 100,
    showGrid: true,
    shadowQuality: 'medium',
    antialias: true,
    fps: false
  },

  // Vue par défaut
  viewMode: '2D',

  // Sélection et transformation
  selectedObjectId: null,
  transformMode: 'translate',

  // Historique (Undo/Redo)
  history: [[]],
  historyIndex: 0,

  // ==========================================
  // ACTIONS - VAN & OBJECTS
  // ==========================================

  setVanType: (vt) => {
    console.log('🟢 [STORE] setVanType:', vt);
    set({ vanType: vt, objects: [], selectedObjectId: null });
  },

  addObject: (o) => {
    console.log('🟢 [STORE] addObject:', o);
    set((s) => {
      const newObjects = [...s.objects, o];

      // Ajouter à l'historique
      const newHistory = s.history.slice(0, s.historyIndex + 1);
      newHistory.push(newObjects);

      return {
        objects: newObjects,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  },

  updateObject: (id, props) => {
    console.log('🟢 [STORE] updateObject:', id, props);
    set((s) => {
      const newObjects = s.objects.map((o) =>
        o.id === id ? { ...o, ...props } : o
      );

      // Ajouter à l'historique seulement si changement significatif
      // (pas pour chaque mouvement de souris)
      const shouldAddToHistory =
        props.x !== undefined ||
        props.y !== undefined ||
        props.z !== undefined ||
        props.rotation !== undefined;

      if (shouldAddToHistory) {
        const newHistory = s.history.slice(0, s.historyIndex + 1);
        newHistory.push(newObjects);

        return {
          objects: newObjects,
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      }

      return { objects: newObjects };
    });
  },

  removeObject: (id) => {
    console.log('🟢 [STORE] removeObject:', id);
    set((s) => {
      const newObjects = s.objects.filter((o) => o.id !== id);

      // Ajouter à l'historique
      const newHistory = s.history.slice(0, s.historyIndex + 1);
      newHistory.push(newObjects);

      return {
        objects: newObjects,
        selectedObjectId: s.selectedObjectId === id ? null : s.selectedObjectId,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  },

  duplicateObject: (id) => {
    console.log('🟢 [STORE] duplicateObject:', id);
    set((s) => {
      const obj = s.objects.find((o) => o.id === id);
      if (!obj) return s;

      const newObj: FurnitureObject = {
        ...obj,
        id: `${obj.type}-${Date.now()}`,
        name: `${obj.name} (copie)`,
        x: obj.x + 100,
        y: obj.y + 100
      };

      const newObjects = [...s.objects, newObj];

      // Ajouter à l'historique
      const newHistory = s.history.slice(0, s.historyIndex + 1);
      newHistory.push(newObjects);

      return {
        objects: newObjects,
        selectedObjectId: newObj.id,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  },

  clearAllObjects: () => {
    console.log('🔴 [STORE] clearAllObjects');
    set((s) => {
      const newHistory = s.history.slice(0, s.historyIndex + 1);
      newHistory.push([]);

      return {
        objects: [],
        selectedObjectId: null,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  },

  // ==========================================
  // ACTIONS - PLANS
  // ==========================================

  addPlan: (p) => {
    console.log('🟢 [STORE] addPlan:', p);
    set((s) => ({ plans: [...s.plans, p] }));
  },

  updatePlan: (p) => {
    console.log('🟢 [STORE] updatePlan:', p);
    set((s) => ({
      plans: s.plans.map((x) => (x.id === p.id ? p : x))
    }));
  },

  removePlan: (id) => {
    console.log('🔴 [STORE] removePlan:', id);
    set((s) => ({
      plans: s.plans.filter((p) => p.id !== id)
    }));
  },

  loadPlan: (plan) => {
    console.log('🟢 [STORE] loadPlan:', plan);
    set({
      objects: plan.jsonData || [],
      vanType: plan.vanType || '',
      selectedObjectId: null,
      history: [plan.jsonData || []],
      historyIndex: 0
    });
  },

  // ==========================================
  // ACTIONS - AUTH
  // ==========================================

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

  resetState: () => {
    console.log('🔴 [STORE] resetState called');
    set({
      loggedIn: false,
      userName: null,
      userEmail: null,
      subscription: "FREE",
      objects: [],
      vanType: "",
      viewMode: '2D',
      selectedObjectId: null,
      transformMode: 'translate',
      history: [[]],
      historyIndex: 0,
      settings: {
        darkMode: false,
        language: 'fr',
        currency: 'EUR',
        gridSnap: true,
        gridSize: 100,
        showGrid: true,
        shadowQuality: 'medium',
        antialias: true,
        fps: false
      }
    });
    document.body.classList.remove('dark-theme');
  },

  // ==========================================
  // ACTIONS - SETTINGS
  // ==========================================

  setSettings: (newSettings) => {
    console.log('🟢 [STORE] setSettings:', newSettings);
    set((state) => {
      const updatedSettings = { ...state.settings, ...newSettings };

      // Appliquer le thème
      if (updatedSettings.darkMode) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }

      return { settings: updatedSettings };
    });
  },

  applyTheme: () => {
    const state = get();
    if (state.settings.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  },

  // ==========================================
  // ACTIONS - VUE 2D/3D
  // ==========================================

  setViewMode: (mode) => {
    console.log('🟢 [STORE] setViewMode:', mode);
    set({ viewMode: mode });
  },

  toggleViewMode: () => {
    const current = get().viewMode;
    const newMode = current === '2D' ? '3D' : '2D';
    console.log('🟢 [STORE] toggleViewMode:', current, '→', newMode);
    set({ viewMode: newMode });
  },

  // ==========================================
  // ACTIONS - SÉLECTION ET TRANSFORMATION
  // ==========================================

  setSelectedObjectId: (id) => {
    console.log('🟢 [STORE] setSelectedObjectId:', id);
    set({ selectedObjectId: id });
  },

  setTransformMode: (mode) => {
    console.log('🟢 [STORE] setTransformMode:', mode);
    set({ transformMode: mode });
  },

  // ==========================================
  // ACTIONS - HISTORIQUE (UNDO/REDO)
  // ==========================================

  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      console.log('↩️ [STORE] undo:', newIndex);
      set({
        objects: state.history[newIndex],
        historyIndex: newIndex,
        selectedObjectId: null
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      console.log('↪️ [STORE] redo:', newIndex);
      set({
        objects: state.history[newIndex],
        historyIndex: newIndex,
        selectedObjectId: null
      });
    }
  },

  canUndo: () => {
    return get().historyIndex > 0;
  },

  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  }
}));

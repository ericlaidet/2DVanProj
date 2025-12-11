// apps/web/src/constants/vanVariants.ts
// 🚐 Configuration des variantes 3D pour chaque type de van

export interface VanVariant3D {
  // Identifiant
  vanType: string;
  
  // Style de carrosserie
  brand: 'RENAULT' | 'CITROEN' | 'MERCEDES' | 'VOLKSWAGEN' | 'FIAT' | 'IVECO' | 'MAN' | 'FORD';
  style: 'MODERN' | 'CLASSIC' | 'MINIBUS';
  
  // Proportions de la cabine (en pourcentage de la longueur totale)
  cabinRatio: number; // 0.20 à 0.30 (20% à 30% de la longueur)
  
  // Dimensions spécifiques (en mm, déjà dans VAN_TYPES)
  // length, width sont récupérés depuis VAN_TYPES
  
  // Hauteur de toit (classification)
  roofHeight: 'H1' | 'H2' | 'H3'; // H1=bas, H2=moyen, H3=haut
  roofHeightMm: number; // Hauteur réelle en mm
  
  // Inclinaison du pare-brise (en degrés)
  windshieldAngle: number; // 25 à 35 degrés
  
  // Longueur du capot (en pourcentage de cabine)
  hoodRatio: number; // 0.3 à 0.5
  
  // Forme de la calandre
  grillStyle: {
    type: 'HORIZONTAL_BARS' | 'VERTICAL_BARS' | 'MESH' | 'LOGO_CENTER';
    barCount?: number;
    hasLargeLogo: boolean;
  };
  
  // Forme des phares
  headlightStyle: {
    shape: 'ROUND' | 'RECTANGULAR' | 'ANGULAR' | 'LED_STRIP';
    size: 'SMALL' | 'MEDIUM' | 'LARGE';
  };
  
  // Rétroviseurs
  mirrorStyle: {
    type: 'CLASSIC' | 'MODERN' | 'AERODYNAMIC';
    size: 'SMALL' | 'LARGE';
  };
  
  // Forme du capot
  hoodShape: {
    curvature: number; // 0.0 à 1.0 (0=plat, 1=très bombé)
    slope: number; // Pente en degrés
  };
  
  // Couleur par défaut
  defaultColor: string;
  
  // Roues
  wheelStyle: {
    diameter: number; // en mètres (0.6 à 0.8)
    rimStyle: 'STEEL' | 'ALLOY' | 'SPORT';
  };
}

/**
 * 🎨 Configuration des variantes 3D pour chaque van
 */
export const VAN_VARIANTS_3D: Record<string, VanVariant3D> = {
  // ========================================
  // RENAULT MASTER
  // ========================================
  
  'RENAULT_MASTER_L2H2': {
    vanType: 'RENAULT_MASTER_L2H2',
    brand: 'RENAULT',
    style: 'MODERN',
    cabinRatio: 0.24,
    roofHeight: 'H2',
    roofHeightMm: 2500,
    windshieldAngle: 32,
    hoodRatio: 0.4,
    grillStyle: {
      type: 'HORIZONTAL_BARS',
      barCount: 3,
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'ANGULAR',
      size: 'MEDIUM',
    },
    mirrorStyle: {
      type: 'MODERN',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.6,
      slope: 15,
    },
    defaultColor: '#ffffff',
    wheelStyle: {
      diameter: 0.65,
      rimStyle: 'STEEL',
    },
  },

  'RENAULT_MASTER_L3H2': {
    vanType: 'RENAULT_MASTER_L3H2',
    brand: 'RENAULT',
    style: 'MODERN',
    cabinRatio: 0.22,
    roofHeight: 'H2',
    roofHeightMm: 2500,
    windshieldAngle: 32,
    hoodRatio: 0.4,
    grillStyle: {
      type: 'HORIZONTAL_BARS',
      barCount: 3,
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'ANGULAR',
      size: 'MEDIUM',
    },
    mirrorStyle: {
      type: 'MODERN',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.6,
      slope: 15,
    },
    defaultColor: '#ffffff',
    wheelStyle: {
      diameter: 0.65,
      rimStyle: 'STEEL',
    },
  },

  // ========================================
  // CITROËN JUMPER
  // ========================================
  
  'CITROEN_JUMPER_L2H2': {
    vanType: 'CITROEN_JUMPER_L2H2',
    brand: 'CITROEN',
    style: 'MODERN',
    cabinRatio: 0.24,
    roofHeight: 'H2',
    roofHeightMm: 2520,
    windshieldAngle: 30,
    hoodRatio: 0.42,
    grillStyle: {
      type: 'HORIZONTAL_BARS',
      barCount: 2,
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'RECTANGULAR',
      size: 'MEDIUM',
    },
    mirrorStyle: {
      type: 'AERODYNAMIC',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.5,
      slope: 12,
    },
    defaultColor: '#ffffff',
    wheelStyle: {
      diameter: 0.65,
      rimStyle: 'STEEL',
    },
  },

  'CITROEN_JUMPER_L3H2': {
    vanType: 'CITROEN_JUMPER_L3H2',
    brand: 'CITROEN',
    style: 'MODERN',
    cabinRatio: 0.22,
    roofHeight: 'H2',
    roofHeightMm: 2520,
    windshieldAngle: 30,
    hoodRatio: 0.42,
    grillStyle: {
      type: 'HORIZONTAL_BARS',
      barCount: 2,
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'RECTANGULAR',
      size: 'MEDIUM',
    },
    mirrorStyle: {
      type: 'AERODYNAMIC',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.5,
      slope: 12,
    },
    defaultColor: '#ffffff',
    wheelStyle: {
      diameter: 0.65,
      rimStyle: 'STEEL',
    },
  },

  // ========================================
  // MERCEDES SPRINTER
  // ========================================
  
  'MERCEDES_SPRINTER_L3H2': {
    vanType: 'MERCEDES_SPRINTER_L3H2',
    brand: 'MERCEDES',
    style: 'MODERN',
    cabinRatio: 0.23,
    roofHeight: 'H2',
    roofHeightMm: 2600,
    windshieldAngle: 28,
    hoodRatio: 0.45,
    grillStyle: {
      type: 'HORIZONTAL_BARS',
      barCount: 2,
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'LED_STRIP',
      size: 'LARGE',
    },
    mirrorStyle: {
      type: 'AERODYNAMIC',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.7,
      slope: 18,
    },
    defaultColor: '#e5e7eb',
    wheelStyle: {
      diameter: 0.7,
      rimStyle: 'ALLOY',
    },
  },

  'MERCEDES_SPRINTER_L4H2': {
    vanType: 'MERCEDES_SPRINTER_L4H2',
    brand: 'MERCEDES',
    style: 'MODERN',
    cabinRatio: 0.20,
    roofHeight: 'H2',
    roofHeightMm: 2600,
    windshieldAngle: 28,
    hoodRatio: 0.45,
    grillStyle: {
      type: 'HORIZONTAL_BARS',
      barCount: 2,
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'LED_STRIP',
      size: 'LARGE',
    },
    mirrorStyle: {
      type: 'AERODYNAMIC',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.7,
      slope: 18,
    },
    defaultColor: '#e5e7eb',
    wheelStyle: {
      diameter: 0.7,
      rimStyle: 'ALLOY',
    },
  },

  'MERCEDES_SPRINTER_L5H2': {
    vanType: 'MERCEDES_SPRINTER_L5H2',
    brand: 'MERCEDES',
    style: 'MODERN',
    cabinRatio: 0.18,
    roofHeight: 'H2',
    roofHeightMm: 2600,
    windshieldAngle: 28,
    hoodRatio: 0.45,
    grillStyle: {
      type: 'HORIZONTAL_BARS',
      barCount: 2,
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'LED_STRIP',
      size: 'LARGE',
    },
    mirrorStyle: {
      type: 'AERODYNAMIC',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.7,
      slope: 18,
    },
    defaultColor: '#e5e7eb',
    wheelStyle: {
      diameter: 0.7,
      rimStyle: 'ALLOY',
    },
  },

  'MERCEDES_SPRINTER_L3H2_MINI_BUS': {
    vanType: 'MERCEDES_SPRINTER_L3H2_MINI_BUS',
    brand: 'MERCEDES',
    style: 'MINIBUS',
    cabinRatio: 0.23,
    roofHeight: 'H2',
    roofHeightMm: 2600,
    windshieldAngle: 28,
    hoodRatio: 0.45,
    grillStyle: {
      type: 'HORIZONTAL_BARS',
      barCount: 2,
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'LED_STRIP',
      size: 'LARGE',
    },
    mirrorStyle: {
      type: 'AERODYNAMIC',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.7,
      slope: 18,
    },
    defaultColor: '#e5e7eb',
    wheelStyle: {
      diameter: 0.7,
      rimStyle: 'ALLOY',
    },
  },

  // ========================================
  // VOLKSWAGEN CRAFTER
  // ========================================
  
  'VOLKSWAGEN_CRAFTER_L4H2': {
    vanType: 'VOLKSWAGEN_CRAFTER_L4H2',
    brand: 'VOLKSWAGEN',
    style: 'MODERN',
    cabinRatio: 0.20,
    roofHeight: 'H2',
    roofHeightMm: 2550,
    windshieldAngle: 30,
    hoodRatio: 0.40,
    grillStyle: {
      type: 'HORIZONTAL_BARS',
      barCount: 4,
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'RECTANGULAR',
      size: 'MEDIUM',
    },
    mirrorStyle: {
      type: 'MODERN',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.6,
      slope: 14,
    },
    defaultColor: '#ffffff',
    wheelStyle: {
      diameter: 0.68,
      rimStyle: 'STEEL',
    },
  },

  'VOLKSWAGEN_CRAFTER_L5H2': {
    vanType: 'VOLKSWAGEN_CRAFTER_L5H2',
    brand: 'VOLKSWAGEN',
    style: 'MODERN',
    cabinRatio: 0.18,
    roofHeight: 'H2',
    roofHeightMm: 2550,
    windshieldAngle: 30,
    hoodRatio: 0.40,
    grillStyle: {
      type: 'HORIZONTAL_BARS',
      barCount: 4,
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'RECTANGULAR',
      size: 'MEDIUM',
    },
    mirrorStyle: {
      type: 'MODERN',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.6,
      slope: 14,
    },
    defaultColor: '#ffffff',
    wheelStyle: {
      diameter: 0.68,
      rimStyle: 'STEEL',
    },
  },

  'VOLKSWAGEN_CRAFTER_L3H2_MINI_BUS': {
    vanType: 'VOLKSWAGEN_CRAFTER_L3H2_MINI_BUS',
    brand: 'VOLKSWAGEN',
    style: 'MINIBUS',
    cabinRatio: 0.23,
    roofHeight: 'H2',
    roofHeightMm: 2550,
    windshieldAngle: 30,
    hoodRatio: 0.40,
    grillStyle: {
      type: 'HORIZONTAL_BARS',
      barCount: 4,
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'RECTANGULAR',
      size: 'MEDIUM',
    },
    mirrorStyle: {
      type: 'MODERN',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.6,
      slope: 14,
    },
    defaultColor: '#ffffff',
    wheelStyle: {
      diameter: 0.68,
      rimStyle: 'STEEL',
    },
  },

  // ========================================
  // FIAT DUCATO
  // ========================================
  
  'FIAT_DUCATO_L3H2': {
    vanType: 'FIAT_DUCATO_L3H2',
    brand: 'FIAT',
    style: 'MODERN',
    cabinRatio: 0.22,
    roofHeight: 'H2',
    roofHeightMm: 2520,
    windshieldAngle: 30,
    hoodRatio: 0.42,
    grillStyle: {
      type: 'MESH',
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'RECTANGULAR',
      size: 'MEDIUM',
    },
    mirrorStyle: {
      type: 'MODERN',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.5,
      slope: 12,
    },
    defaultColor: '#ffffff',
    wheelStyle: {
      diameter: 0.65,
      rimStyle: 'STEEL',
    },
  },

  // ========================================
  // IVECO DAILY
  // ========================================
  
  'IVECO_DAILY_35S14_L2H2': {
    vanType: 'IVECO_DAILY_35S14_L2H2',
    brand: 'IVECO',
    style: 'MODERN',
    cabinRatio: 0.24,
    roofHeight: 'H2',
    roofHeightMm: 2520,
    windshieldAngle: 28,
    hoodRatio: 0.45,
    grillStyle: {
      type: 'VERTICAL_BARS',
      barCount: 5,
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'RECTANGULAR',
      size: 'LARGE',
    },
    mirrorStyle: {
      type: 'CLASSIC',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.4,
      slope: 16,
    },
    defaultColor: '#ffffff',
    wheelStyle: {
      diameter: 0.7,
      rimStyle: 'STEEL',
    },
  },

  'IVECO_DAILY_35S14_L3H2': {
    vanType: 'IVECO_DAILY_35S14_L3H2',
    brand: 'IVECO',
    style: 'MODERN',
    cabinRatio: 0.22,
    roofHeight: 'H2',
    roofHeightMm: 2520,
    windshieldAngle: 28,
    hoodRatio: 0.45,
    grillStyle: {
      type: 'VERTICAL_BARS',
      barCount: 5,
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'RECTANGULAR',
      size: 'LARGE',
    },
    mirrorStyle: {
      type: 'CLASSIC',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.4,
      slope: 16,
    },
    defaultColor: '#ffffff',
    wheelStyle: {
      diameter: 0.7,
      rimStyle: 'STEEL',
    },
  },

  // ========================================
  // MAN TGE
  // ========================================
  
  'MAN_TGE_L3H2': {
    vanType: 'MAN_TGE_L3H2',
    brand: 'MAN',
    style: 'MODERN',
    cabinRatio: 0.23,
    roofHeight: 'H2',
    roofHeightMm: 2550,
    windshieldAngle: 30,
    hoodRatio: 0.40,
    grillStyle: {
      type: 'HORIZONTAL_BARS',
      barCount: 3,
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'RECTANGULAR',
      size: 'MEDIUM',
    },
    mirrorStyle: {
      type: 'MODERN',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.6,
      slope: 14,
    },
    defaultColor: '#ffffff',
    wheelStyle: {
      diameter: 0.68,
      rimStyle: 'STEEL',
    },
  },

  'MAN_TGE_L4H2': {
    vanType: 'MAN_TGE_L4H2',
    brand: 'MAN',
    style: 'MODERN',
    cabinRatio: 0.20,
    roofHeight: 'H2',
    roofHeightMm: 2550,
    windshieldAngle: 30,
    hoodRatio: 0.40,
    grillStyle: {
      type: 'HORIZONTAL_BARS',
      barCount: 3,
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'RECTANGULAR',
      size: 'MEDIUM',
    },
    mirrorStyle: {
      type: 'MODERN',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.6,
      slope: 14,
    },
    defaultColor: '#ffffff',
    wheelStyle: {
      diameter: 0.68,
      rimStyle: 'STEEL',
    },
  },

  // ========================================
  // AUTRES (vans compacts, etc.)
  // ========================================
  
  // Pour les autres vans non définis, on utilisera une config par défaut
};

/**
 * 🔍 Récupère la configuration 3D d'un van
 * Si non trouvé, retourne une config par défaut
 */
export const getVanVariant3D = (vanType: string): VanVariant3D => {
  return VAN_VARIANTS_3D[vanType] || {
    vanType,
    brand: 'MERCEDES',
    style: 'MODERN',
    cabinRatio: 0.23,
    roofHeight: 'H2',
    roofHeightMm: 2500,
    windshieldAngle: 30,
    hoodRatio: 0.42,
    grillStyle: {
      type: 'HORIZONTAL_BARS',
      barCount: 3,
      hasLargeLogo: true,
    },
    headlightStyle: {
      shape: 'RECTANGULAR',
      size: 'MEDIUM',
    },
    mirrorStyle: {
      type: 'MODERN',
      size: 'LARGE',
    },
    hoodShape: {
      curvature: 0.6,
      slope: 15,
    },
    defaultColor: '#ffffff',
    wheelStyle: {
      diameter: 0.65,
      rimStyle: 'STEEL',
    },
  };
};

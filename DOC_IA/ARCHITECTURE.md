# 🏗️ AI Van Layout Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  VanSelector     │  │ FurniturePresets │  │  AIAssistant     │  │
│  │                  │  │                  │  │                  │  │
│  │ - Select van     │  │ - 6 presets      │  │ - Description    │  │
│  │ - Load dims      │  │ - One-click add  │  │ - Preferences    │  │
│  └──────────────────┘  └──────────────────┘  │ - Generate       │  │
│                                               │ - Apply          │  │
│  ┌──────────────────┐  ┌──────────────────┐  └──────────────────┘  │
│  │ FurniturePalette │  │   VanCanvas      │                         │
│  │                  │  │                  │                         │
│  │ - Custom items   │  │ - Konva.js       │                         │
│  │ - Manual dims    │  │ - Drag & drop    │                         │
│  └──────────────────┘  │ - Furniture      │                         │
│                        └──────────────────┘                         │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ useStore (Zustand)
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          STATE MANAGEMENT                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  FurnitureObject {                                                   │
│    id: string                                                        │
│    name?: string                                                     │
│    type?: string  ◄── NEW: Furniture type categorization            │
│    x: number                                                         │
│    y: number                                                         │
│    width: number                                                     │
│    height: number                                                    │
│    color: string                                                     │
│  }                                                                   │
│                                                                       │
│  Actions:                                                            │
│  - addObject()                                                       │
│  - updateObject()                                                    │
│  - removeObject()                                                    │
│  - setVanType()                                                      │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ useAI hook
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND UTILITIES                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  furniture.ts (Constants)                                   │    │
│  │  ─────────────────────────────────────────────────────────  │    │
│  │  FURNITURE_PRESETS = {                                      │    │
│  │    bed:      { icon: 🛏️, size: 1900×1400, color: blue }    │    │
│  │    kitchen:  { icon: 🍳, size: 1200×600,  color: green }   │    │
│  │    storage:  { icon: 📦, size: 800×400,   color: orange }  │    │
│  │    bathroom: { icon: 🚿, size: 800×800,   color: purple }  │    │
│  │    table:    { icon: 🪑, size: 800×600,   color: red }     │    │
│  │    seat:     { icon: 💺, size: 500×500,   color: pink }    │    │
│  │  }                                                          │    │
│  │                                                             │    │
│  │  Functions:                                                 │    │
│  │  - getFurniturePreset(type)                                │    │
│  │  - mapAITypeToFurnitureType(aiType)                        │    │
│  │  - validateFurnitureDimensions(w, h, vL, vW)               │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  aiLayoutConverter.ts (Utilities)                           │    │
│  │  ─────────────────────────────────────────────────────────  │    │
│  │  convertAILayoutToFurniture(aiItems, vanL, vanW)           │    │
│  │    ├─ Map AI types to furniture types                      │    │
│  │    ├─ Validate dimensions                                  │    │
│  │    ├─ Constrain positions                                  │    │
│  │    └─ Return FurnitureObject[]                             │    │
│  │                                                             │    │
│  │  checkOverlap(objectA, objectB)                            │    │
│  │    └─ Returns boolean                                      │    │
│  │                                                             │    │
│  │  removeOverlaps(items)                                     │    │
│  │    └─ Returns non-overlapping items                        │    │
│  │                                                             │    │
│  │  optimizeLayoutPositions(items, vanL, vanW)                │    │
│  │    ├─ Grid-based positioning (100mm grid)                  │    │
│  │    ├─ Max 50 attempts per item                             │    │
│  │    └─ Returns optimized items                              │    │
│  │                                                             │    │
│  │  calculateLayoutStats(items, vanL, vanW)                   │    │
│  │    └─ Returns { totalItems, usedArea, usagePercentage }   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP POST
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          BACKEND API                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  AIController                                               │    │
│  │  ─────────────────────────────────────────────────────────  │    │
│  │  POST /ai/generate-layout                                   │    │
│  │    ├─ @UseGuards(JwtAuthGuard, AISubscriptionGuard)        │    │
│  │    ├─ @Body() dto: GenerateLayoutDto                       │    │
│  │    └─ Returns LayoutSuggestion                             │    │
│  │                                                             │    │
│  │  POST /ai/optimize-plan                                     │    │
│  │    └─ Optimizes existing plan                              │    │
│  │                                                             │    │
│  │  GET /ai/preferences                                        │    │
│  │    └─ Analyzes user patterns                               │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  AIService                                                  │    │
│  │  ─────────────────────────────────────────────────────────  │    │
│  │  generateLayout(dto, userId)                               │    │
│  │    ├─ Get van dimensions from DB                           │    │
│  │    ├─ Build prompt with preferences                        │    │
│  │    ├─ Call OpenAI API                                      │    │
│  │    ├─ Parse & validate JSON response                       │    │
│  │    ├─ Auto-repair if needed                                │    │
│  │    ├─ Cache result                                         │    │
│  │    └─ Log usage                                            │    │
│  │                                                             │    │
│  │  optimizePlan(dto, userId)                                 │    │
│  │  analyzeUserPreferences(userId)                            │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Prompts                                                    │    │
│  │  ─────────────────────────────────────────────────────────  │    │
│  │  generateLayoutPrompt(description, prefs, van)             │    │
│  │    ├─ Van dimensions: ${van.length} × ${van.width}mm       │    │
│  │    ├─ User description: "${description}"                   │    │
│  │    ├─ Preferences: sleeping, cooking, storage, style       │    │
│  │    ├─ Furniture types: bed|kitchen|storage|bathroom|       │    │
│  │    │                    table|seat                          │    │
│  │    ├─ Colors: hex codes (#3b82f6, #10b981, etc.)          │    │
│  │    ├─ Typical dimensions for each type                     │    │
│  │    └─ Layout rules (no overlap, circulation, etc.)        │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ OpenAI API
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          OPENAI SERVICE                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Model: gpt-4.1-mini                                                │
│  Response Format: JSON                                               │
│  Temperature: 0.7 (generation) / 0.5 (optimization)                 │
│                                                                       │
│  Input:                                                              │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ System: "Tu es un expert en aménagement de vans..."        │    │
│  │ User: "Crée un aménagement selon ces critères:             │    │
│  │        - Van: DUCATO_L2H2 (5400×2050mm)                    │    │
│  │        - Description: lit arrière, cuisine compacte        │    │
│  │        - Sleeping: 2 personnes                             │    │
│  │        - Style: modern"                                    │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  Output:                                                             │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ {                                                           │    │
│  │   "layout": [                                               │    │
│  │     {                                                       │    │
│  │       "type": "bed",                                        │    │
│  │       "x": 3400,                                            │    │
│  │       "y": 325,                                             │    │
│  │       "width": 1900,                                        │    │
│  │       "height": 1400,                                       │    │
│  │       "color": "#3b82f6"                                    │    │
│  │     },                                                      │    │
│  │     {                                                       │    │
│  │       "type": "kitchen",                                    │    │
│  │       "x": 2000,                                            │    │
│  │       "y": 100,                                             │    │
│  │       "width": 1200,                                        │    │
│  │       "height": 600,                                        │    │
│  │       "color": "#10b981"                                    │    │
│  │     }                                                       │    │
│  │   ],                                                        │    │
│  │   "explanation": "Lit placé à l'arrière pour...",          │    │
│  │   "alternatives": ["Option 1", "Option 2"]                 │    │
│  │ }                                                           │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Manual Furniture Addition (Presets)
```
User clicks preset
      ↓
FurniturePresets.handleAddPreset()
      ↓
Get preset from FURNITURE_PRESETS
      ↓
Validate dimensions vs van
      ↓
addObject() to store
      ↓
VanCanvas re-renders
      ↓
Furniture appears on canvas
```

### 2. AI Layout Generation
```
User enters description
      ↓
AIAssistant.handleGenerate()
      ↓
useAI.generateLayout()
      ↓
POST /ai/generate-layout
      ↓
AIService.generateLayout()
      ↓
Build prompt with van dims
      ↓
OpenAI API call
      ↓
Parse JSON response
      ↓
Validate & repair
      ↓
Return LayoutSuggestion
      ↓
Display in AIAssistant
      ↓
User clicks "Apply"
      ↓
convertAILayoutToFurniture()
      ↓
Validate each item
      ↓
Map types to presets
      ↓
Constrain positions
      ↓
Calculate stats
      ↓
setState({ objects })
      ↓
VanCanvas re-renders
      ↓
Layout appears with stats
```

## Component Hierarchy

```
App
├── VanPlannerLayout
│   ├── Sidebar
│   │   ├── VanSelector
│   │   ├── FurniturePresets ◄── NEW
│   │   ├── FurniturePalette
│   │   └── AIAssistant (PRO)
│   │       └── useAI hook
│   └── VanCanvas
│       └── FurnitureRect[]
└── Store (Zustand)
    └── FurnitureObject[]
```

## File Dependencies

```
AIAssistant.tsx
├── imports
│   ├── useStore (store.ts)
│   ├── useAI (hooks/useAI.ts)
│   ├── VAN_TYPES (constants/vans.ts)
│   ├── convertAILayoutToFurniture (utils/aiLayoutConverter.ts)
│   └── calculateLayoutStats (utils/aiLayoutConverter.ts)
└── uses
    └── FURNITURE_PRESETS (via converter)

aiLayoutConverter.ts
├── imports
│   ├── FurnitureObject (store/store.ts)
│   ├── mapAITypeToFurnitureType (constants/furniture.ts)
│   ├── getFurniturePreset (constants/furniture.ts)
│   └── validateFurnitureDimensions (constants/furniture.ts)
└── exports
    ├── convertAILayoutToFurniture()
    ├── checkOverlap()
    ├── removeOverlaps()
    ├── optimizeLayoutPositions()
    └── calculateLayoutStats()

FurniturePresets.tsx
├── imports
│   ├── useStore (store/store.ts)
│   ├── FURNITURE_PRESETS (constants/furniture.ts)
│   ├── VAN_TYPES (constants/vans.ts)
│   └── notify (utils/notify.ts)
└── renders
    └── Grid of furniture preset cards
```

## Type Flow

```
Backend (AI Service)
    LayoutItem {
      type: 'bed' | 'kitchen' | 'storage' | 'bathroom' | 'table' | 'seat'
      x: number
      y: number
      width: number
      height: number
      color: string
    }
        ↓
    LayoutSuggestion {
      layout: LayoutItem[]
      explanation: string
      alternatives?: string[]
    }
        ↓
Frontend (AI Hook)
    AILayoutItem (same as LayoutItem)
        ↓
Frontend (Converter)
    convertAILayoutToFurniture()
        ↓
    FurnitureObject {
      id: string
      name?: string
      type?: string  ◄── Mapped from AI type
      x: number
      y: number
      width: number
      height: number
      color: string
    }
        ↓
Store
    objects: FurnitureObject[]
        ↓
Canvas
    Renders each FurnitureObject
```

## Key Algorithms

### 1. Type Mapping
```
AI Type → Furniture Type
─────────────────────────
"bed"      → "bed"
"kitchen"  → "kitchen"
"storage"  → "storage"
"bathroom" → "bathroom"
"table"    → "table"
"seat"     → "seat"
"lit"      → "bed"      (alias)
"cuisine"  → "kitchen"  (alias)
```

### 2. Dimension Validation
```
For each furniture item:
  1. Check width > 0 and height > 0
  2. Check width ≤ van.length
  3. Check height ≤ van.width
  4. If invalid, use preset defaults
```

### 3. Position Constraint
```
For each furniture item:
  x = max(0, min(x, vanLength - width))
  y = max(0, min(y, vanWidth - height))
```

### 4. Overlap Detection
```
overlap = !(
  a.x + a.width ≤ b.x ||
  a.x ≥ b.x + b.width ||
  a.y + a.height ≤ b.y ||
  a.y ≥ b.y + b.height
)
```

### 5. Position Optimization
```
For each item:
  attempts = 0
  while (hasOverlap && attempts < 50):
    move item by gridSize (100mm)
    if x exceeds bounds:
      reset x to 0
      increment y by gridSize
    attempts++
```

---

**This architecture ensures:**
- ✅ Type safety throughout the stack
- ✅ Validation at multiple levels
- ✅ Separation of concerns
- ✅ Reusable utilities
- ✅ Extensible design

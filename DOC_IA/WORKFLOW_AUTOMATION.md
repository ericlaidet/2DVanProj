# 🛠️ AI Integration Workflow Tool
## Automated Setup and Testing for VanPlanner AI Features

**Purpose**: This tool helps you verify, test, and integrate AI features step-by-step.

---

## 📋 Quick Commands

### 1. Verify Installation

Check if all required files exist:

```bash
# Frontend files
ls apps/web/src/constants/furniture.ts
ls apps/web/src/utils/aiLayoutConverter.ts
ls apps/web/src/components/van/FurniturePresets.tsx
ls apps/web/src/components/van/FurniturePresets.css

# Backend files
ls apps/api/src/ai/types/ai.types.ts
ls apps/api/src/ai/prompts/layout-generator.prompt.ts
```

### 2. Test Compilation

Verify TypeScript compiles without errors:

```bash
# Frontend
cd apps/web
pnpm tsc --noEmit

# Backend
cd apps/api
pnpm tsc --noEmit
```

### 3. Run Development Servers

```bash
# Terminal 1 - Backend
cd apps/api
pnpm dev

# Terminal 2 - Frontend
cd apps/web
pnpm dev
```

### 4. Test API Endpoints

```bash
# Health check
curl http://localhost:3000/ai/health

# Generate layout (replace TOKEN with your JWT)
curl -X POST http://localhost:3000/ai/generate-layout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vanType": "DUCATO_L2H2",
    "userDescription": "lit arrière, cuisine compacte",
    "preferences": {
      "sleepingCapacity": 2,
      "hasCooking": true,
      "hasStorage": true,
      "style": "modern"
    }
  }'
```

---

## 🔍 Verification Checklist

### Phase 1: File Verification

Run this checklist to ensure all files are in place:

```bash
# Create a verification script
cat > verify-ai-files.sh << 'EOF'
#!/bin/bash

echo "🔍 Verifying AI Integration Files..."
echo ""

# Frontend files
echo "Frontend Files:"
files=(
  "apps/web/src/constants/furniture.ts"
  "apps/web/src/utils/aiLayoutConverter.ts"
  "apps/web/src/components/van/FurniturePresets.tsx"
  "apps/web/src/components/van/FurniturePresets.css"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (MISSING)"
  fi
done

echo ""
echo "Backend Files:"
backend_files=(
  "apps/api/src/ai/types/ai.types.ts"
  "apps/api/src/ai/prompts/layout-generator.prompt.ts"
)

for file in "${backend_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (MISSING)"
  fi
done

echo ""
echo "Documentation:"
docs=(
  "DOC_IA/MASTER_AI_INTEGRATION_GUIDE.md"
  "DOC_IA/ARCHITECTURE.md"
  "DOC_IA/AI_VAN_LAYOUT_CAPABILITIES.md"
  "DOC_IA/INTEGRATION_GUIDE.md"
)

for doc in "${docs[@]}"; do
  if [ -f "$doc" ]; then
    echo "✅ $doc"
  else
    echo "❌ $doc (MISSING)"
  fi
done

echo ""
echo "✨ Verification complete!"
EOF

chmod +x verify-ai-files.sh
./verify-ai-files.sh
```

### Phase 2: Dependency Check

```bash
# Check if required packages are installed
cd apps/web
pnpm list zustand
pnpm list react-konva

cd ../api
pnpm list openai
pnpm list @nestjs/common
```

### Phase 3: Environment Variables

```bash
# Check if OpenAI API key is configured
cd apps/api
if grep -q "OPENAI_API_KEY" .env; then
  echo "✅ OPENAI_API_KEY configured"
else
  echo "❌ OPENAI_API_KEY missing in .env"
  echo "Add: OPENAI_API_KEY=sk-..."
fi
```

---

## 🧪 Testing Workflow

### Test 1: Furniture Constants

```bash
# Create a test file
cat > apps/web/src/constants/__tests__/furniture.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import {
  FURNITURE_PRESETS,
  getFurniturePreset,
  mapAITypeToFurnitureType,
  validateFurnitureDimensions
} from '../furniture';

describe('Furniture Constants', () => {
  it('should have 7 presets (6 + custom)', () => {
    expect(Object.keys(FURNITURE_PRESETS)).toHaveLength(7);
  });

  it('should map AI types correctly', () => {
    expect(mapAITypeToFurnitureType('bed')).toBe('bed');
    expect(mapAITypeToFurnitureType('lit')).toBe('bed');
    expect(mapAITypeToFurnitureType('cuisine')).toBe('kitchen');
  });

  it('should validate dimensions', () => {
    const valid = validateFurnitureDimensions(1000, 800, 5400, 2050);
    expect(valid.valid).toBe(true);

    const invalid = validateFurnitureDimensions(6000, 800, 5400, 2050);
    expect(invalid.valid).toBe(false);
  });
});
EOF

# Run tests
cd apps/web
pnpm test furniture.test.ts
```

### Test 2: AI Layout Converter

```bash
cat > apps/web/src/utils/__tests__/aiLayoutConverter.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import {
  convertAILayoutToFurniture,
  checkOverlap,
  calculateLayoutStats
} from '../aiLayoutConverter';

describe('AI Layout Converter', () => {
  it('should convert AI items to furniture objects', () => {
    const aiItems = [
      { type: 'bed', x: 100, y: 100, width: 1900, height: 1400, color: '#3b82f6' }
    ];
    const result = convertAILayoutToFurniture(aiItems, 5400, 2050);
    
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('bed');
    expect(result[0].name).toBe('Lit');
  });

  it('should detect overlaps', () => {
    const a = { id: '1', x: 0, y: 0, width: 100, height: 100, color: '#fff' };
    const b = { id: '2', x: 50, y: 50, width: 100, height: 100, color: '#fff' };
    const c = { id: '3', x: 200, y: 200, width: 100, height: 100, color: '#fff' };
    
    expect(checkOverlap(a, b)).toBe(true);
    expect(checkOverlap(a, c)).toBe(false);
  });

  it('should calculate layout stats', () => {
    const items = [
      { id: '1', type: 'bed', x: 0, y: 0, width: 1900, height: 1400, color: '#fff' },
      { id: '2', type: 'kitchen', x: 0, y: 0, width: 1200, height: 600, color: '#fff' }
    ];
    const stats = calculateLayoutStats(items, 5400, 2050);
    
    expect(stats.totalItems).toBe(2);
    expect(stats.usagePercentage).toBeGreaterThan(0);
  });
});
EOF

cd apps/web
pnpm test aiLayoutConverter.test.ts
```

### Test 3: Manual UI Testing

Create a testing checklist:

```markdown
## UI Testing Checklist

### Furniture Presets
- [ ] Open app in browser
- [ ] Login with any account
- [ ] Select van type (DUCATO_L2H2)
- [ ] Locate "Meubles prédéfinis" section
- [ ] Verify 6 furniture cards visible
- [ ] Click "Lit" (bed) preset
- [ ] Verify bed appears on canvas
- [ ] Verify success notification shows
- [ ] Try adding furniture without van selected
- [ ] Verify error message appears

### AI Generation (PRO only)
- [ ] Login with PRO account
- [ ] Select van type
- [ ] Locate "Assistant IA" section
- [ ] Enter description: "lit arrière, cuisine compacte, table pliante"
- [ ] Set preferences (sleeping: 2, cooking: yes, style: modern)
- [ ] Click "Générer un layout"
- [ ] Verify loading state shows
- [ ] Verify suggestion appears with explanation
- [ ] Click "Appliquer cette suggestion"
- [ ] Verify furniture appears on canvas
- [ ] Verify statistics notification shows
- [ ] Check furniture types and colors are correct

### Dark Mode
- [ ] Toggle dark mode
- [ ] Verify furniture presets cards are visible
- [ ] Verify text is readable
- [ ] Verify icons have proper contrast

### Responsive Design
- [ ] Resize browser to mobile width
- [ ] Verify furniture presets stack vertically
- [ ] Verify all buttons are accessible
```

---

## 🚀 Integration Steps

### Step 1: Add to Main Layout

Find your main layout file and add the FurniturePresets component:

```typescript
// Example: apps/web/src/pages/App.tsx or VanPlannerLayout.tsx

import FurniturePresets from '@/components/van/FurniturePresets';

// In your JSX:
<div className="sidebar">
  <section className="sidebar-section">
    <h2>1. Choisir un van</h2>
    <VanSelector />
  </section>

  {/* ADD THIS SECTION */}
  <section className="sidebar-section">
    <h2>2. Meubles prédéfinis</h2>
    <FurniturePresets />
  </section>

  <section className="sidebar-section">
    <h2>3. Meubles personnalisés</h2>
    <FurniturePalette />
  </section>

  {/* AI Assistant for PRO users */}
  {isPro && (
    <section className="sidebar-section">
      <h2>4. Assistant IA</h2>
      <AIAssistant subscription={subscription} />
    </section>
  )}
</div>
```

### Step 2: Add Styling (if needed)

```css
/* Add to your main CSS file or component styles */
.sidebar-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
}

.sidebar-section:last-child {
  border-bottom: none;
}

.sidebar-section h2 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

### Step 3: Verify Store Integration

Ensure your store has the `type` field:

```typescript
// apps/web/src/store/store.ts
export interface FurnitureObject {
  id: string;
  name?: string;
  type?: string; // ← This should be present
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}
```

---

## 📊 Performance Monitoring

### Monitor AI API Usage

```typescript
// Add to AIAssistant.tsx or ai.service.ts
const logAIUsage = (action: string, tokens: number, cost: number) => {
  console.log(`[AI Usage] ${action}:`, {
    tokens,
    cost: `$${cost.toFixed(4)}`,
    timestamp: new Date().toISOString()
  });
  
  // Optional: Send to analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'ai_usage', {
      action,
      tokens,
      cost
    });
  }
};
```

### Monitor Layout Statistics

```typescript
// Add to your analytics
const trackLayoutStats = (stats: LayoutStats) => {
  console.log('[Layout Stats]', stats);
  
  // Send to analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'layout_applied', {
      furniture_count: stats.totalItems,
      usage_percentage: stats.usagePercentage,
      furniture_types: Object.keys(stats.furnitureCount).join(',')
    });
  }
};
```

---

## 🐛 Debugging Tools

### Enable Debug Logging

```typescript
// Add to aiLayoutConverter.ts
const DEBUG = process.env.NODE_ENV === 'development';

export const convertAILayoutToFurniture = (aiItems, vanLength, vanWidth) => {
  if (DEBUG) {
    console.group('🔧 AI Layout Conversion');
    console.log('Input items:', aiItems);
    console.log('Van dimensions:', { vanLength, vanWidth });
  }
  
  const result = aiItems.map((item, index) => {
    const furnitureType = mapAITypeToFurnitureType(item.type);
    
    if (DEBUG) {
      console.log(`Item ${index}:`, {
        aiType: item.type,
        mappedType: furnitureType,
        dimensions: `${item.width}x${item.height}`,
        position: `(${item.x}, ${item.y})`
      });
    }
    
    // ... rest of conversion
  });
  
  if (DEBUG) {
    console.log('Output furniture:', result);
    console.groupEnd();
  }
  
  return result;
};
```

### API Response Inspector

```typescript
// Add to useAI.ts hook
const generateLayout = async (params) => {
  try {
    const response = await fetch('/ai/generate-layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    
    const data = await response.json();
    
    // Debug logging
    console.group('🤖 AI Response');
    console.log('Status:', response.status);
    console.log('Data:', data);
    console.log('Layout items:', data.layout?.length);
    console.groupEnd();
    
    return data;
  } catch (error) {
    console.error('❌ AI Generation Error:', error);
    throw error;
  }
};
```

---

## ✅ Final Verification

Run this complete verification script:

```bash
#!/bin/bash

echo "🎯 Final AI Integration Verification"
echo "===================================="
echo ""

# 1. File check
echo "1️⃣ Checking files..."
files_ok=true
for file in \
  "apps/web/src/constants/furniture.ts" \
  "apps/web/src/utils/aiLayoutConverter.ts" \
  "apps/web/src/components/van/FurniturePresets.tsx" \
  "apps/api/src/ai/types/ai.types.ts" \
  "apps/api/src/ai/prompts/layout-generator.prompt.ts"
do
  if [ ! -f "$file" ]; then
    echo "❌ Missing: $file"
    files_ok=false
  fi
done

if [ "$files_ok" = true ]; then
  echo "✅ All files present"
fi
echo ""

# 2. TypeScript compilation
echo "2️⃣ Checking TypeScript compilation..."
cd apps/web
if pnpm tsc --noEmit > /dev/null 2>&1; then
  echo "✅ Frontend TypeScript OK"
else
  echo "❌ Frontend TypeScript errors"
fi

cd ../api
if pnpm tsc --noEmit > /dev/null 2>&1; then
  echo "✅ Backend TypeScript OK"
else
  echo "❌ Backend TypeScript errors"
fi
cd ../..
echo ""

# 3. Environment check
echo "3️⃣ Checking environment..."
if grep -q "OPENAI_API_KEY" apps/api/.env 2>/dev/null; then
  echo "✅ OPENAI_API_KEY configured"
else
  echo "⚠️  OPENAI_API_KEY not found in .env"
fi
echo ""

# 4. Documentation check
echo "4️⃣ Checking documentation..."
if [ -f "DOC_IA/MASTER_AI_INTEGRATION_GUIDE.md" ]; then
  echo "✅ Master guide available"
  echo "   Read: DOC_IA/MASTER_AI_INTEGRATION_GUIDE.md"
fi
echo ""

echo "===================================="
echo "✨ Verification complete!"
echo ""
echo "Next steps:"
echo "1. Start servers: pnpm dev:api && pnpm dev:web"
echo "2. Test furniture presets"
echo "3. Test AI generation (PRO account)"
echo "4. Review documentation in DOC_IA/"
```

---

## 📚 Quick Reference

### File Locations

```
Frontend:
  Constants:   apps/web/src/constants/furniture.ts
  Utilities:   apps/web/src/utils/aiLayoutConverter.ts
  Component:   apps/web/src/components/van/FurniturePresets.tsx
  Styles:      apps/web/src/components/van/FurniturePresets.css
  AI Feature:  apps/web/src/features/ai/AIAssistant.tsx

Backend:
  Types:       apps/api/src/ai/types/ai.types.ts
  Prompts:     apps/api/src/ai/prompts/layout-generator.prompt.ts
  Service:     apps/api/src/ai/services/ai.service.ts

Documentation:
  Master:      DOC_IA/MASTER_AI_INTEGRATION_GUIDE.md
  Architecture: DOC_IA/ARCHITECTURE.md
  Capabilities: DOC_IA/AI_VAN_LAYOUT_CAPABILITIES.md
  Integration:  DOC_IA/INTEGRATION_GUIDE.md
```

### Common Commands

```bash
# Development
pnpm dev:api        # Start backend
pnpm dev:web        # Start frontend
pnpm test           # Run tests

# Build
pnpm build:api      # Build backend
pnpm build:web      # Build frontend

# Type checking
pnpm tsc --noEmit   # Check TypeScript
```

---

**🎉 You're ready to use the AI integration tools!**

For detailed information, see: `DOC_IA/MASTER_AI_INTEGRATION_GUIDE.md`

# 🚀 Quick Integration Guide - AI Van Layout Features

## Overview
This guide shows how to integrate the new AI van layout features into your application.

---

## 1️⃣ Add Furniture Presets to Your Layout

### Option A: In the Sidebar (Recommended)

Find your main layout file (likely `apps/web/src/components/layout/VanPlannerLayout.tsx` or `apps/web/src/pages/App.tsx`) and add:

```typescript
import FurniturePresets from '../components/van/FurniturePresets';

// Inside your component's JSX, add to the sidebar:
<div className="sidebar">
  {/* Existing components */}
  <VanSelector />
  
  {/* ✨ NEW: Add furniture presets */}
  <FurniturePresets />
  
  {/* Existing palette */}
  <FurniturePalette />
  
  {/* AI Assistant (if PRO) */}
  {subscription && ['PRO1', 'PRO2', 'PRO3'].includes(subscription) && (
    <AIAssistant subscription={subscription} />
  )}
</div>
```

### Option B: As a Separate Tab

```typescript
import { useState } from 'react';
import FurniturePresets from '../components/van/FurniturePresets';
import FurniturePalette from '../components/van/FurniturePalette';

const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

<div className="furniture-section">
  <div className="tabs">
    <button 
      className={activeTab === 'presets' ? 'active' : ''}
      onClick={() => setActiveTab('presets')}
    >
      Prédéfinis
    </button>
    <button 
      className={activeTab === 'custom' ? 'active' : ''}
      onClick={() => setActiveTab('custom')}
    >
      Personnalisé
    </button>
  </div>
  
  {activeTab === 'presets' ? (
    <FurniturePresets />
  ) : (
    <FurniturePalette />
  )}
</div>
```

---

## 2️⃣ Update Canvas to Show Furniture Types

The canvas already displays furniture, but you can enhance it to show type-specific information:

```typescript
// In VanCanvas.tsx or FurnitureRect component
import { getFurnitureName } from '../../constants/furniture';

// When rendering furniture name:
<Text
  text={obj.type ? getFurnitureName(obj.type) : obj.name || 'Objet'}
  // ... other props
/>
```

---

## 3️⃣ Test the Integration

### Step 1: Start the Application
```bash
# Terminal 1 - Backend
cd apps/api
pnpm dev

# Terminal 2 - Frontend
cd apps/web
pnpm dev
```

### Step 2: Test Furniture Presets
1. Open the app in browser
2. Select a van type (e.g., DUCATO_L2H2)
3. Look for the "Meubles prédéfinis" section
4. Click on a furniture preset (e.g., 🛏️ Lit)
5. Verify it appears on the canvas

### Step 3: Test AI Generation (PRO users only)
1. Ensure you're logged in with a PRO account
2. Find the "🤖 Assistant IA" section
3. Enter a description: "Je veux un lit à l'arrière et une table au milieu"
4. Click "✨ Générer un layout"
5. Review the suggestion
6. Click "✅ Appliquer cette suggestion"
7. Verify furniture appears with correct types and colors

---

## 4️⃣ Verify Dark Mode

Toggle dark mode and check:
- ✅ Furniture presets cards are visible
- ✅ Text is readable
- ✅ Icons have proper contrast
- ✅ Hover effects work correctly

---

## 5️⃣ Common Issues & Solutions

### Issue 1: "Cannot find module '@/utils/notify'"
**Solution**: Check your `tsconfig.json` has path aliases configured:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue 2: Furniture presets not showing
**Solution**: Verify the component is imported and rendered in your layout.

### Issue 3: AI generates invalid layouts
**Solution**: Check backend logs for OpenAI errors. Ensure `OPENAI_API_KEY` is set in `.env`.

### Issue 4: Colors not matching
**Solution**: The AI now uses hex colors. Ensure your backend is updated with the new prompt.

---

## 6️⃣ Optional: Add Keyboard Shortcuts

Enhance UX with keyboard shortcuts for furniture presets:

```typescript
import { useEffect } from 'react';

useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          // Add bed
          handleAddPreset('bed');
          e.preventDefault();
          break;
        case 'k':
          // Add kitchen
          handleAddPreset('kitchen');
          e.preventDefault();
          break;
        // Add more shortcuts...
      }
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

---

## 7️⃣ Example: Complete Integration

Here's a complete example of a sidebar with all features:

```typescript
// apps/web/src/components/layout/Sidebar.tsx
import React from 'react';
import VanSelector from '../van/VanSelector';
import FurniturePresets from '../van/FurniturePresets';
import FurniturePalette from '../van/FurniturePalette';
import AIAssistant from '../../features/ai/AIAssistant';
import { useStore } from '../../store/store';

const Sidebar: React.FC = () => {
  const subscription = useStore((s) => s.subscription);
  const canUseAI = subscription && ['PRO1', 'PRO2', 'PRO3'].includes(subscription);

  return (
    <div className="sidebar">
      {/* Van Selection */}
      <section className="sidebar-section">
        <h2>1. Choisir un van</h2>
        <VanSelector />
      </section>

      {/* Furniture Presets */}
      <section className="sidebar-section">
        <h2>2. Ajouter des meubles</h2>
        <FurniturePresets />
      </section>

      {/* Custom Furniture */}
      <section className="sidebar-section">
        <h2>3. Meubles personnalisés</h2>
        <FurniturePalette />
      </section>

      {/* AI Assistant (PRO only) */}
      {canUseAI && (
        <section className="sidebar-section">
          <h2>4. Assistant IA</h2>
          <AIAssistant subscription={subscription!} />
        </section>
      )}
    </div>
  );
};

export default Sidebar;
```

---

## 8️⃣ Styling Tips

Add these CSS rules for better integration:

```css
/* Sidebar sections */
.sidebar-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-section:last-child {
  border-bottom: none;
}

.sidebar-section h2 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dark-theme .sidebar-section {
  border-bottom-color: #374151;
}

.dark-theme .sidebar-section h2 {
  color: #d1d5db;
}
```

---

## 9️⃣ Performance Optimization

For large layouts, consider:

```typescript
// Memoize furniture presets to avoid re-renders
import { memo } from 'react';

const FurniturePresets = memo(() => {
  // Component code...
});

export default FurniturePresets;
```

---

## 🔟 Monitoring & Analytics

Track AI usage:

```typescript
// In AIAssistant.tsx
const handleApplySuggestion = () => {
  // ... existing code ...
  
  // Track analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'ai_layout_applied', {
      furniture_count: stats.totalItems,
      usage_percentage: stats.usagePercentage,
      van_type: vanType,
    });
  }
};
```

---

## ✅ Checklist

Before deploying:

- [ ] Furniture presets component is visible
- [ ] All 6 furniture types are available
- [ ] Clicking a preset adds it to canvas
- [ ] AI Assistant shows for PRO users
- [ ] AI-generated layouts apply correctly
- [ ] Layout statistics are displayed
- [ ] Dark mode works properly
- [ ] Responsive design works on mobile
- [ ] No console errors
- [ ] OpenAI API key is configured

---

## 📚 Additional Resources

- **Full Documentation**: `DOC_IA/AI_VAN_LAYOUT_CAPABILITIES.md`
- **Summary of Changes**: `DOC_IA/SUMMARY_MISSING_ELEMENTS.md`
- **Original Checklist**: `DOC_IA/CHECKLIST_INTEGRATION_IA.md`

---

## 🆘 Need Help?

If you encounter issues:

1. Check the browser console for errors
2. Check backend logs: `apps/api/logs/`
3. Verify environment variables in `.env`
4. Review the documentation files
5. Test with Postman collection: `van-planner.postman_collection.json`

---

**Happy Coding! 🚀**

# AI Van Layout Capabilities - Documentation

## 📋 Overview

The VanPlanner AI integration provides intelligent van layout generation and optimization using OpenAI's GPT models. This document describes the complete AI capabilities, implementation details, and missing elements that have been added.

## ✨ Features Implemented

### 1. **AI Layout Generation**
- **Endpoint**: `POST /ai/generate-layout`
- **Description**: Generates a complete van layout based on user description and preferences
- **Input Parameters**:
  - `vanType`: Type of van (e.g., "DUCATO_L2H2")
  - `userDescription`: Natural language description of desired layout
  - `preferences`: Object containing:
    - `sleepingCapacity`: Number of people (1-4)
    - `hasCooking`: Boolean for kitchen inclusion
    - `hasStorage`: Boolean for storage emphasis
    - `style`: "minimalist" | "rustic" | "modern"

### 2. **Layout Optimization**
- **Endpoint**: `POST /ai/optimize-plan`
- **Description**: Optimizes an existing plan for better space utilization
- **Input Parameters**:
  - `planId`: ID of the plan to optimize

### 3. **User Preference Analysis**
- **Endpoint**: `GET /ai/preferences`
- **Description**: Analyzes user's past layouts to identify patterns and preferences

## 🎯 Furniture Types Supported

The AI can generate the following furniture types:

| Type | Icon | Default Size | Color | Description |
|------|------|--------------|-------|-------------|
| `bed` | 🛏️ | 1900×1400mm | Blue (#3b82f6) | Sleeping area |
| `kitchen` | 🍳 | 1200×600mm | Green (#10b981) | Kitchenette with sink/stove |
| `storage` | 📦 | 800×400mm | Orange (#f59e0b) | Cabinets and storage |
| `bathroom` | 🚿 | 800×800mm | Purple (#8b5cf6) | Shower/toilet area |
| `table` | 🪑 | 800×600mm | Red (#ef4444) | Dining/work table |
| `seat` | 💺 | 500×500mm | Pink (#ec4899) | Seating/bench |

## 🆕 New Elements Added

### Frontend Components

#### 1. **Furniture Constants** (`constants/furniture.ts`)
- Predefined furniture presets with default dimensions
- Type mapping utilities for AI-generated types
- Dimension validation functions
- Color and icon associations

#### 2. **AI Layout Converter** (`utils/aiLayoutConverter.ts`)
- Converts AI-generated layouts to FurnitureObjects
- Validates dimensions against van bounds
- Detects and removes overlapping items
- Optimizes positions using grid-based algorithm
- Calculates layout statistics (area usage, furniture count)

#### 3. **Furniture Presets Component** (`components/van/FurniturePresets.tsx`)
- Visual grid of predefined furniture items
- One-click addition to canvas
- Dimension validation before adding
- Responsive design with dark mode support

#### 4. **Enhanced AI Assistant** (`features/ai/AIAssistant.tsx`)
- Improved layout application with proper type conversion
- Van dimension validation
- Layout statistics display
- Better error handling

### Backend Enhancements

#### 1. **Extended AI Types** (`ai/types/ai.types.ts`)
- Added `table` and `seat` furniture types
- Changed color from enum to string for hex color support

#### 2. **Enhanced Prompts** (`ai/prompts/layout-generator.prompt.ts`)
- Detailed furniture type descriptions
- Specific dimension guidelines
- Color specifications for each furniture type
- Clearer layout rules and constraints

### Store Updates

#### 1. **FurnitureObject Type Extension** (`store/store.ts`)
- Added optional `type` field for furniture categorization
- Maintains backward compatibility with existing objects

## 🔧 How It Works

### Layout Generation Flow

```
1. User enters description + preferences
   ↓
2. Frontend sends request to /ai/generate-layout
   ↓
3. Backend constructs prompt with van dimensions
   ↓
4. OpenAI generates JSON layout
   ↓
5. Backend validates and repairs JSON
   ↓
6. Frontend receives layout suggestion
   ↓
7. User reviews explanation and alternatives
   ↓
8. User clicks "Apply"
   ↓
9. AI layout converted to FurnitureObjects
   ↓
10. Objects validated against van dimensions
   ↓
11. Objects added to canvas with statistics
```

### AI Prompt Structure

The AI receives:
- Van dimensions (length × width in mm)
- User's natural language description
- Structured preferences (sleeping capacity, style, features)
- Furniture type specifications with dimensions
- Layout rules (no overlap, circulation space, weight distribution)

The AI returns:
- Array of furniture items with positions and dimensions
- Explanation of design choices
- Alternative suggestions
- Potential improvements

## 📊 Layout Validation

### Dimension Validation
```typescript
validateFurnitureDimensions(width, height, vanLength, vanWidth)
```
- Ensures positive dimensions
- Checks furniture fits within van bounds
- Returns validation result with error messages

### Overlap Detection
```typescript
checkOverlap(objectA, objectB)
```
- Detects if two furniture items overlap
- Used to prevent invalid layouts

### Position Optimization
```typescript
optimizeLayoutPositions(items, vanLength, vanWidth)
```
- Adjusts positions to avoid overlaps
- Uses 100mm grid for alignment
- Maximum 50 attempts per item

## 📈 Layout Statistics

When applying an AI-generated layout, users see:
- Total number of furniture items
- Used area (mm²)
- Total van area (mm²)
- Usage percentage
- Furniture count by type

Example: `✨ Layout appliqué ! 5 objets, 42.3% d'occupation`

## 🎨 Visual Enhancements

### Furniture Presets UI
- Grid layout (2 columns on desktop, 1 on mobile)
- Color-coded icons matching furniture types
- Hover effects with elevation
- Disabled state when no van selected
- Tooltips with descriptions

### AI Assistant UI
- Compact form with preferences
- Loading states during generation
- Expandable suggestion cards
- Alternative suggestions list
- One-click application

## 🔐 Access Control

AI features require PRO subscription:
- `PRO1`, `PRO2`, or `PRO3` subscription levels
- Enforced by `AISubscriptionGuard` on backend
- Frontend shows upgrade prompt for FREE users

## 🚀 Usage Examples

### Example 1: Simple Layout
```typescript
{
  vanType: "DUCATO_L2H2",
  userDescription: "Je veux un lit à l'arrière et une petite cuisine",
  preferences: {
    sleepingCapacity: 2,
    hasCooking: true,
    hasStorage: true,
    style: "modern"
  }
}
```

### Example 2: Minimalist Layout
```typescript
{
  vanType: "TRANSIT_L3H2",
  userDescription: "Aménagement minimaliste pour voyager léger",
  preferences: {
    sleepingCapacity: 1,
    hasCooking: false,
    hasStorage: false,
    style: "minimalist"
  }
}
```

## 🐛 Error Handling

### Common Issues & Solutions

1. **Invalid JSON from OpenAI**
   - Auto-repair attempts (remove trailing commas, quote keys)
   - Fallback to default values for missing fields
   - Detailed logging for debugging

2. **Overlapping Furniture**
   - Position optimization algorithm
   - Overlap detection and removal
   - User notification if items removed

3. **Out-of-Bounds Items**
   - Dimension validation before adding
   - Position clamping to van boundaries
   - Error messages with specific dimensions

## 📝 Testing

### Manual Testing Checklist
- [ ] Generate layout with different van types
- [ ] Test all furniture type combinations
- [ ] Verify dimension validation
- [ ] Check overlap detection
- [ ] Test layout statistics calculation
- [ ] Verify dark mode styling
- [ ] Test responsive design
- [ ] Check PRO subscription enforcement

### API Testing
```bash
# Generate layout
curl -X POST http://localhost:3000/ai/generate-layout \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vanType": "DUCATO_L2H2",
    "userDescription": "Lit arrière et cuisine compacte",
    "preferences": {
      "sleepingCapacity": 2,
      "hasCooking": true,
      "hasStorage": true,
      "style": "modern"
    }
  }'
```

## 🔮 Future Enhancements

Potential improvements:
1. **3D Visualization**: Show furniture in 3D perspective
2. **Drag-to-Adjust**: Allow fine-tuning AI suggestions
3. **Cost Estimation**: Calculate material costs for layout
4. **Template Library**: Save and share popular layouts
5. **Multi-Language**: Support for English, Spanish, etc.
6. **Advanced Constraints**: Electrical, plumbing considerations
7. **Furniture Rotation**: Support for rotated items
8. **Custom Furniture**: User-defined furniture types

## 📚 Related Files

### Frontend
- `apps/web/src/constants/furniture.ts` - Furniture definitions
- `apps/web/src/utils/aiLayoutConverter.ts` - Layout conversion utilities
- `apps/web/src/components/van/FurniturePresets.tsx` - Presets component
- `apps/web/src/features/ai/AIAssistant.tsx` - AI assistant UI
- `apps/web/src/hooks/useAI.ts` - AI API hook
- `apps/web/src/store/store.ts` - State management

### Backend
- `apps/api/src/ai/services/ai.service.ts` - AI service logic
- `apps/api/src/ai/prompts/layout-generator.prompt.ts` - Generation prompt
- `apps/api/src/ai/types/ai.types.ts` - Type definitions
- `apps/api/src/ai/controllers/ai.controller.ts` - API endpoints

## 🎓 Best Practices

1. **Always validate van dimensions** before adding furniture
2. **Use predefined presets** for consistent sizing
3. **Check for overlaps** after AI generation
4. **Provide detailed descriptions** for better AI results
5. **Review alternatives** before applying suggestions
6. **Test with different van types** to ensure compatibility

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review the checklist in `DOC_IA/CHECKLIST_INTEGRATION_IA.md`
3. Consult backend logs for API errors
4. Test endpoints with Postman collection

---

**Last Updated**: 2025-11-25  
**Version**: 1.0.0  
**Author**: AI Integration Team

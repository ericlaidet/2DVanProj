// apps/api/src/ai/utils/json-validator.ts
export const validateJSON = (jsonString: string) => {
  try {
    const parsed = JSON.parse(jsonString);
    return { valid: true, data: parsed };
  } catch (error) {
    return { valid: false, error };
  }
};

export const validateLayoutStructure = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.layout)) return false;
  if (typeof data.explanation !== 'string') return false;

  // Valider chaque item du layout
  for (const item of data.layout) {
    if (!item.type || !['bed', 'kitchen', 'storage', 'bathroom'].includes(item.type)) return false;
    if (typeof item.x !== 'number' || typeof item.y !== 'number') return false;
    if (typeof item.width !== 'number' || typeof item.height !== 'number') return false;
    if (!item.color || !['red', 'green', 'blue', 'yellow'].includes(item.color)) return false;
  }

  return true;
};

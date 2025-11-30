// apps/api/src/prompts/design-optimizer.prompt.ts

export const optimizeLayoutPrompt = (currentLayout: any[], van: any) => `
Tu es un expert en design de vans aménagés.

Voici les informations du van :
- Longueur : ${van.length} mm
- Largeur : ${van.width} mm

Voici le layout actuel :
${JSON.stringify(currentLayout, null, 2)}

Ta mission :
1. Améliore ce layout pour optimiser l'espace, la circulation et la répartition du poids.
2. Corrige les éventuels chevauchements ou incohérences.
3. Conserve les éléments utiles (lit, cuisine, rangement...).
4. Ajuste légèrement les tailles si nécessaire pour un meilleur équilibre.

⚠️ Réponds UNIQUEMENT en JSON valide avec **ce format exact** :

{
  "layout": [
    {
      "type": "bed|kitchen|storage|bathroom|table|seat|shower",
      "x": number,
      "y": number,
      "width": number,
      "height": number,
      "color": "string (ex: '#ffcc00' ou 'blue')"
    }
  ],
  "explanation": "Explication claire des changements réalisés",
  "improvements": ["Amélioration 1", "Amélioration 2"],
  "alternatives": ["Option alternative 1", "Option alternative 2"]
}

Règles :
- Les objets ne doivent pas se chevaucher.
- Laisse au minimum 600mm de circulation.
- Place le lit à l’arrière si possible.
- Optimise l’accès à la cuisine.
- Respecte strictement le format JSON ci-dessus.
`;


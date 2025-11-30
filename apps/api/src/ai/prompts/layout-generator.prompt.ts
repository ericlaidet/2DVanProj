export const generateLayoutPrompt = (userDescription: string, preferences: any, van: any) => `
Crée un aménagement de van selon ces critères:

Description utilisateur: "${userDescription}"

Préférences OBLIGATOIRES à respecter:
- Lit/Couchage: ${preferences?.hasBed ? `OUI - INCLURE un lit pour ${preferences?.sleepingCapacity || 2} personne(s)` : 'NON - NE PAS inclure de lit'}
- Cuisine: ${preferences?.hasCooking ? 'OUI - INCLURE une cuisine' : 'NON - NE PAS inclure de cuisine'}
- Rangements: ${preferences?.hasStorage ? 'OUI - INCLURE des rangements' : 'NON - NE PAS inclure de rangements'}
- Style: ${preferences?.style || 'moderne'}

${!preferences?.hasBed ? '⚠️ IMPORTANT: L\'utilisateur a DÉSACTIVÉ le lit - NE PAS ajouter de type "bed"' : ''}
${!preferences?.hasCooking ? '⚠️ IMPORTANT: L\'utilisateur a DÉSACTIVÉ la cuisine - NE PAS ajouter de type "kitchen"' : ''}
${!preferences?.hasStorage ? '⚠️ IMPORTANT: L\'utilisateur a DÉSACTIVÉ les rangements - NE PAS ajouter de type "storage"' : ''}

Dimensions EXACTES du van:
- Longueur (axe X): ${van.length}mm (de 0 à ${van.length}mm)
- Largeur (axe Y): ${van.width}mm (de 0 à ${van.width}mm)

🚨 SYSTÈME DE COORDONNÉES (TRÈS IMPORTANT):
- L'origine (0,0) est au coin AVANT-GAUCHE du van
- L'axe X va de l'AVANT (0mm) vers l'ARRIÈRE (${van.length}mm)
- L'axe Y va de GAUCHE (0mm) vers DROITE (${van.width}mm)
- Pour placer un meuble "à l'arrière": x doit être proche de ${van.length - 2000}mm à ${van.length - 1900}mm
- Pour centrer un meuble horizontalement: y = (${van.width} - hauteur_meuble) / 2

🚨 DIMENSIONS DES MEUBLES (width = longueur dans le van, height = largeur dans le van):
${preferences?.hasBed ? `- bed: Lit pour ${preferences?.sleepingCapacity || 2} personne(s)
  * 1 personne: width=1900mm, height=900mm (lit simple)
  * 2 personnes: width=1900mm, height=1400mm (lit double)
  Couleur: #3b82f6 (bleu)` : ''}
${preferences?.hasCooking ? '- kitchen: Cuisine - width=1200mm, height=600mm, couleur: #10b981 (vert)' : ''}
${preferences?.hasStorage ? '- storage: Rangement - width=800mm, height=400mm, couleur: #f59e0b (orange)' : ''}
- bathroom: Salle de bain - width=800mm, height=800mm, couleur: #8b5cf6 (violet)
- table: Table - width=800mm, height=600mm, couleur: #ef4444 (rouge)
- seat: Siège/Banquette - width=500mm, height=500mm, couleur: #ec4899 (rose)

Génère un JSON avec cette structure:
{
  "layout": [
    {
      "type": "bed|kitchen|storage|bathroom|table|seat",
      "x": number (position sur l'axe avant-arrière, 0 = avant, ${van.length} = arrière),
      "y": number (position sur l'axe gauche-droite, 0 = gauche, ${van.width} = droite),
      "width": number (longueur du meuble dans le sens avant-arrière),
      "height": number (largeur du meuble dans le sens gauche-droite),
      "color": "#3b82f6|#10b981|#f59e0b|#8b5cf6|#ef4444|#ec4899"
    }
  ],
  "explanation": "Explication de tes choix d'aménagement",
  "improvements": ["Amélioration 1", "Amélioration 2"],
  "alternatives": ["Alternative 1", "Alternative 2"]
}

🚨 RÈGLES CRITIQUES DE PLACEMENT:
1. RESPECTE STRICTEMENT les préférences (lit: ${preferences?.hasBed ? 'OUI' : 'NON'}, cuisine: ${preferences?.hasCooking ? 'OUI' : 'NON'}, rangements: ${preferences?.hasStorage ? 'OUI' : 'NON'})
2. VALIDATION DES COORDONNÉES:
   - Pour CHAQUE meuble, vérifie: 0 <= x < ${van.length} ET 0 <= y < ${van.width}
   - Pour CHAQUE meuble, vérifie: x + width <= ${van.length} ET y + height <= ${van.width}
   - Si un meuble dépasse, AJUSTE ses coordonnées!
3. Pour placer un lit "à l'arrière, centré":
   - x = ${van.length} - 1900 (pour un lit de 1900mm de long)
   - y = (${van.width} - height_lit) / 2 (pour centrer)
   - Exemple: x=${van.length - 1900}, y=${Math.floor((van.width - 1400) / 2)} pour un lit double
4. Les objets ne doivent PAS se chevaucher
5. Laisse de l'espace de circulation (min 600mm de largeur)
6. Utilise les couleurs spécifiées pour chaque type de meuble
7. Dans le champ "layout", mets UNIQUEMENT les meubles demandés
8. Les "alternatives" et "improvements" sont des suggestions textuelles, PAS des layouts

🚨 EXEMPLE CONCRET pour un lit double à l'arrière, centré dans un van de ${van.length}x${van.width}mm:
{
  "type": "bed",
  "x": ${van.length - 1900},
  "y": ${Math.floor((van.width - 1400) / 2)},
  "width": 1900,
  "height": 1400,
  "color": "#3b82f6"
}
`;

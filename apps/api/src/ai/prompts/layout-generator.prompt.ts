export const generateLayoutPrompt = (userDescription: string, preferences: any, van: any, existingLayout?: any[]) => `
Crée un aménagement de van selon ces critères:

Description utilisateur (PRIORITÉ ABSOLUE): "${userDescription}"

⚠️ RÈGLE FONDAMENTALE:
Si l'utilisateur mentionne EXPLICITEMENT un élément dans sa description (lit, cuisine, rangement, etc.),
tu DOIS l'inclure même si les préférences ci-dessous indiquent le contraire.
La description textuelle de l'utilisateur a TOUJOURS la priorité sur les checkboxes.

Préférences optionnelles (à utiliser SEULEMENT si la description utilisateur ne spécifie pas):
- Lit/Couchage: ${preferences?.sleepingCapacity > 0 ? `${preferences?.sleepingCapacity} personne(s)` : 'non spécifié'}
- Cuisine: ${preferences?.hasCooking ? 'suggéré' : 'non spécifié'}
- Rangements: ${preferences?.hasStorage ? 'suggéré' : 'non spécifié'}
- Style: ${preferences?.style || 'moderne'}

${existingLayout && existingLayout.length > 0 ? `
🚨 MEUBLES DÉJÀ PRÉSENTS DANS LE VAN (NE PAS DUPLIQUER, ÉVITER DE CHEVAUCHER):
${existingLayout.map((item, i) => `${i + 1}. ${item.type} - position: x=${item.x}, y=${item.y}, taille: ${item.width}x${item.height}mm`).join('\n')}

⚠️ IMPORTANT: Ces meubles occupent DÉJÀ de l'espace. Tu dois:
1. NE PAS les inclure dans ton layout (ils sont déjà là)
2. CALCULER les positions des NOUVEAUX meubles en évitant ces zones occupées
3. Proposer UNIQUEMENT les NOUVEAUX meubles demandés par l'utilisateur
` : ''}

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
- bed: Lit 
  * 1 personne: width=1900mm, height=900mm (lit simple)
  * 2 personnes: width=1900mm, height=1400mm (lit double)
  Couleur: #3b82f6 (bleu)
- kitchen: Cuisine - width=1200mm, height=600mm, couleur: #10b981 (vert)
- storage: Rangement - width=800mm, height=400mm, couleur: #f59e0b (orange)
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

1. **PRIORITÉ ABSOLUE**: Respecte ce que l'utilisateur demande dans SA DESCRIPTION TEXTUELLE avant tout

2. **VALIDATION DES COORDONNÉES**:
   - Pour CHAQUE meuble, vérifie: 0 <= x < ${van.length} ET 0 <= y < ${van.width}
   - Pour CHAQUE meuble, vérifie: x + width <= ${van.length} ET y + height <= ${van.width}
   - Si un meuble dépasse, AJUSTE ses coordonnées!

3. **ANTI-CHEVAUCHEMENT (TRÈS IMPORTANT)**: 
   Par défaut, les meubles ne doivent JAMAIS se chevaucher SAUF si l'utilisateur demande explicitement un chevauchement.
   
   Pour vérifier un chevauchement:
   - Deux meubles A et B se chevauchent SI:
     * A.x < B.x + B.width ET A.x + A.width > B.x ET
     * A.y < B.y + B.height ET A.y + A.height > B.y
   
   CALCULE toujours la position du 2ème meuble en tenant compte du 1er:
   - Si "devant A": meuble.x = A.x - meuble.width - 100mm
   - Si "derrière A": meuble.x = A.x + A.width + 100mm
   - Si "à côté de A": meuble.x ≈ A.x, meuble.y = A.y + A.height + 100mm (ou A.y - meuble.height - 100mm)
   
   ⚠️ EXCEPTION: Si l'utilisateur dit "sur", "au-dessus", "superposé" → respecte sa demande même si chevauchement

4. **PLACEMENT "DEVANT" / "DERRIÈRE"** (pour TOUS les types de meubles):
   - "à l'arrière" = x proche de ${van.length - 2000}mm (fond du van)
   - "devant" = x proche de 0mm à 1000mm (avant du van)
   - "devant X" = placer à x < X.x (plus proche de l'avant que l'élément X)
   - "derrière X" = placer à x > X.x + X.width (plus loin de l'avant que l'élément X)
   - "à côté de X" = même x, mais y différent

5. **Pour placer N'IMPORTE QUEL meuble "à l'arrière, centré"**:
   - x = ${van.length} - meuble.width (pour coller au fond)
   - y = (${van.width} - meuble.height) / 2 (pour centrer horizontalement)
   - Exemple lit: x=${van.length - 1900}, y=${Math.floor((van.width - 1400) / 2)}
   - Exemple rangement: x=${van.length - 800}, y=${Math.floor((van.width - 400) / 2)}

6. **ESPACE DE CIRCULATION**: Laisse min 600mm de largeur pour circuler

7. **COULEURS**: Utilise les couleurs spécifiées: bed=#3b82f6, storage=#f59e0b, kitchen=#10b981, etc.

8. **CHAMP LAYOUT**: Mets UNIQUEMENT les meubles demandés par l'utilisateur

9. **ALTERNATIVES/IMPROVEMENTS**: Suggestions textuelles, PAS des layouts JSON

🚨 **EXEMPLE CONCRET 1**: Lit double à l'arrière centré
{
  "type": "bed",
  "x": ${van.length - 1900},
  "y": ${Math.floor((van.width - 1400) / 2)},
  "width": 1900,
  "height": 1400,
  "color": "#3b82f6"
}

🚨 **EXEMPLE CONCRET 2**: Lit + Rangement devant (SANS CHEVAUCHEMENT)
Pour "lit à l'arrière avec rangement devant":
[
  {
    "type": "bed",
    "x": ${van.length - 1900},  // Arrière
    "y": ${Math.floor((van.width - 900) / 2)},  // Centré (lit simple)
    "width": 1900,
    "height": 900,
    "color": "#3b82f6"
  },
  {
    "type": "storage",
    "x": ${van.length - 1900 - 800 - 100},  // CALCUL: lit.x - storage.width - 100mm d'espace
    "y": ${Math.floor((van.width - 400) / 2)},  // Centré
    "width": 800,
    "height": 400,
    "color": "#f59e0b"
  }
]

⚠️ NOTE: Le rangement est à x = ${van.length - 1900 - 800 - 100} pour être DEVANT le lit (x plus petit)
et ne PAS chevaucher (lit.x - storage.width - espace_sécurité)
`;

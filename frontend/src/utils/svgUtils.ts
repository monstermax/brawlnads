import React from 'react';

// Utilitaires pour corriger les problèmes d'affichage SVG

export const fixSVGDisplay = (svgData: string): string => {
  // Ajouter un timestamp unique pour éviter le cache
  const timestamp = Date.now();
  
  // Nettoyer le SVG et ajouter des attributs de stabilité
  let cleanSVG = svgData
    .replace(/\s+/g, ' ') // Normaliser les espaces
    .replace(/>\s+</g, '><') // Supprimer les espaces entre les balises
    .trim();
  
  // Ajouter un ID unique pour éviter les conflits
  if (cleanSVG.includes('<svg')) {
    cleanSVG = cleanSVG.replace(
      '<svg',
      `<svg data-timestamp="${timestamp}" data-cache-bust="${Math.random()}"`
    );
  }
  
  // Ajouter viewBox si manquant pour la stabilité
  if (!cleanSVG.includes('viewBox')) {
    cleanSVG = cleanSVG.replace(
      'width="400" height="400"',
      'width="400" height="400" viewBox="0 0 400 400"'
    );
  }
  
  return cleanSVG;
};

export const validateSVG = (svgData: string): boolean => {
  // Vérifications de base pour s'assurer que le SVG est valide
  if (!svgData || svgData.length < 100) return false;
  if (!svgData.includes('<svg')) return false;
  if (!svgData.includes('</svg>')) return false;
  if (!svgData.includes('width="400"')) return false;
  if (!svgData.includes('height="400"')) return false;
  
  return true;
};

export const createSVGDataURL = (svgData: string): string => {
  const fixedSVG = fixSVGDisplay(svgData);
  
  if (!validateSVG(fixedSVG)) {
    console.warn('SVG invalide détecté, utilisation du fallback');
    return createFallbackSVG();
  }
  
  // Encoder proprement pour éviter les problèmes de caractères
  const encodedSVG = encodeURIComponent(fixedSVG);
  return `data:image/svg+xml,${encodedSVG}`;
};

export const createFallbackSVG = (tokenId?: number, classType?: number, rarity?: number): string => {
  // Générer des valeurs aléatoires si pas fournies
  const id = tokenId ?? Math.floor(Math.random() * 1000);
  const classIndex = classType ?? Math.floor(Math.random() * 5);
  const rarityIndex = rarity ?? Math.floor(Math.random() * 6);
  
  const classNames = ['Warrior', 'Assassin', 'Mage', 'Berserker', 'Guardian'];
  const rarityNames = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
  
  // Couleurs basées sur la rareté
  const rarityColors = ['#6B7280', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];
  
  // Couleurs basées sur la classe
  const classColors = ['#DC2626', '#7C3AED', '#2563EB', '#EA580C', '#059669'];
  
  // Stats aléatoires pour la démo
  const attack = Math.floor(Math.random() * 100) + 20;
  const defense = Math.floor(Math.random() * 100) + 20;
  const speed = Math.floor(Math.random() * 100) + 20;
  const level = Math.floor(Math.random() * 10) + 1;
  
  const fallbackSVG = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${rarityColors[rarityIndex]};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#200052;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="glow${id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg${id})" rx="40"/>
      <circle cx="200" cy="200" r="160" fill="url(#glow${id})"/>
      
      <!-- Character Body -->
      <ellipse cx="200" cy="280" rx="90" ry="70" fill="${classColors[classIndex]}" opacity="0.9"/>
      
      <!-- Character Head -->
      <circle cx="200" cy="170" r="70" fill="#F3F4F6" opacity="0.95"/>
      
      <!-- Eyes -->
      <circle cx="176" cy="160" r="12" fill="#1F2937"/>
      <circle cx="224" cy="160" r="12" fill="#1F2937"/>
      <circle cx="180" cy="156" r="4" fill="#FFFFFF"/>
      <circle cx="228" cy="156" r="4" fill="#FFFFFF"/>
      
      <!-- Mouth -->
      <path d="M 180 190 Q 200 210 220 190" stroke="#1F2937" stroke-width="4" fill="none"/>
      
      <!-- Class Symbol -->
      <circle cx="200" cy="100" r="24" fill="${classColors[classIndex]}" opacity="0.8"/>
      <text x="200" y="110" text-anchor="middle" fill="white" font-size="20" font-weight="bold">${classNames[classIndex].charAt(0)}</text>
      
      <!-- Stats Indicators -->
      <rect x="20" y="20" width="${Math.min(attack, 100)}" height="8" fill="#EF4444" rx="4"/>
      <rect x="20" y="36" width="${Math.min(defense, 100)}" height="8" fill="#3B82F6" rx="4"/>
      <rect x="20" y="52" width="${Math.min(speed, 100)}" height="8" fill="#10B981" rx="4"/>
      
      <!-- Level Badge -->
      <circle cx="340" cy="60" r="30" fill="#F59E0B" opacity="0.9"/>
      <text x="340" y="70" text-anchor="middle" fill="white" font-size="20" font-weight="bold">${level}</text>
      
      <!-- Name and ID -->
      <text x="200" y="370" text-anchor="middle" fill="white" font-size="28" font-weight="bold">${classNames[classIndex]} #${id}</text>
      <text x="200" y="390" text-anchor="middle" fill="#A0055D" font-size="16">${rarityNames[rarityIndex]}</text>
    </svg>
  `.trim();
  
  return `data:image/svg+xml,${encodeURIComponent(fallbackSVG)}`;
};

export const preloadSVG = (svgDataURL: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load SVG'));
    img.src = svgDataURL;
  });
};

// Hook pour gérer l'affichage stable des SVG
export const useSVGDisplay = (tokenURI: string | undefined) => {
  const [svgDataURL, setSvgDataURL] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    if (!tokenURI) {
      setSvgDataURL(createFallbackSVG());
      setIsLoading(false);
      return;
    }
    
    const loadSVG = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Décoder le tokenURI
        const jsonData = JSON.parse(atob(tokenURI.split(',')[1]));
        const svgData = atob(jsonData.image.split(',')[1]);
        
        // Valider et corriger le SVG
        const dataURL = createSVGDataURL(svgData);
        
        // Précharger pour s'assurer qu'il fonctionne
        await preloadSVG(dataURL);
        
        setSvgDataURL(dataURL);
      } catch (err) {
        console.error('Erreur lors du chargement du SVG:', err);
        setError('Erreur de chargement');
        setSvgDataURL(createFallbackSVG());
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSVG();
  }, [tokenURI]);
  
  return { svgDataURL, isLoading, error };
};
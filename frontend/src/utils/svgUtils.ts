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

export const createFallbackSVG = (): string => {
  // SVG de fallback simple en cas de problème
  const fallbackSVG = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="fallback-bg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" style="stop-color:#4a1a5c;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a0d3d;stop-opacity:1" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#fallback-bg)"/>
      <circle cx="200" cy="200" r="60" fill="#836EF9"/>
      <circle cx="175" cy="180" r="15" fill="#FFFFFF"/>
      <circle cx="225" cy="180" r="15" fill="#FFFFFF"/>
      <circle cx="175" cy="180" r="8" fill="#000000"/>
      <circle cx="225" cy="180" r="8" fill="#000000"/>
      <path d="M 185 210 Q 200 220 215 210" stroke="#000" stroke-width="2" fill="none"/>
      <rect x="10" y="320" width="380" height="70" fill="#000000" fill-opacity="0.8" rx="5"/>
      <text x="20" y="340" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="14">Monanimal</text>
      <text x="20" y="355" fill="#836EF9" font-family="Arial, sans-serif" font-size="11">Loading...</text>
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
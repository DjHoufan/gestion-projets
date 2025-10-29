import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  withLink?: boolean;
}

export default function Logo({ variant = 'dark', size = 'md', withLink = true }: LogoProps) {
  // Définir les tailles
  const sizes = {
    sm: {
      square: 'w-6 h-6',
      text: 'text-lg',
      subtext: 'text-[10px]',
      gap: 'gap-0.5',
      spacing: 'space-x-2'
    },
    md: {
      square: 'w-8 h-8',
      text: 'text-2xl',
      subtext: 'text-sm',
      gap: 'gap-1',
      spacing: 'space-x-3'
    },
    lg: {
      square: 'w-12 h-12',
      text: 'text-4xl',
      subtext: 'text-base',
      gap: 'gap-1.5',
      spacing: 'space-x-4'
    }
  };

  const currentSize = sizes[size];
  
  // Couleurs selon la variante
  const textColor = variant === 'light' ? 'text-white' : 'text-gray-900';
  const subtextColor = variant === 'light' ? 'text-white/90' : 'text-gray-700';
  const shadow = variant === 'light' ? 'drop-shadow-lg' : '';

  const content = (
    <>
      {/* Deux blocs verticaux côte à côte */}
      <div className={`flex ${currentSize.gap} transition-all duration-300`}>
        {/* Bloc gauche (H-F) - plus haut */}
        <div className={`flex flex-col ${currentSize.gap} -mt-2 transition-all duration-300`}>
          {/* H - Turquoise */}
          <div className={`${currentSize.square} bg-[#0F7E75] flex items-center justify-center rounded-xs transition-all duration-300`}>
            <span className="text-white font-semibold">H</span>
          </div>
          
          {/* F - Orange */}
          <div className={`${currentSize.square} bg-[#F38B3F] flex items-center justify-center rounded-xs transition-all duration-300`}>
            <span className="text-white font-semibold">F</span>
          </div>
        </div>
        
        {/* Bloc droite (U-N) - plus bas */}
        <div className={`flex flex-col ${currentSize.gap} transition-all duration-300`}>
          {/* U - Orange */}
          <div className={`${currentSize.square} bg-[#F38B3F] flex items-center justify-center rounded-xs transition-all duration-300`}>
            <span className="text-white font-semibold">U</span>
          </div>
          
          {/* N - Turquoise */}
          <div className={`${currentSize.square} bg-[#0F7E75] flex items-center justify-center rounded-xs transition-all duration-300`}>
            <span className="text-white font-semibold">N</span>
          </div>
        </div>
      </div>

      {/* Texte à droite */}
      <div className="flex flex-col justify-center transition-all duration-300">
        <h1 className={`${currentSize.text} font-bold ${textColor} ${shadow} leading-tight tracking-tight`}>
          HOUFAN
        </h1>
        <p className={`${currentSize.subtext} ${subtextColor} ${shadow} font-normal leading-tight`}>
          Research & Transform
        </p>
      </div>
    </>
  );

  if (withLink) {
    return (
      <Link href="/" className={`flex items-center ${currentSize.spacing} transition-all duration-300 `}>
        {content}
      </Link>
    );
  }

  return (
    <div className={`flex items-center ${currentSize.spacing} transition-all duration-300`}>
      {content}
    </div>
  );
}

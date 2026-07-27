import React from 'react';
import {
  Tv,
  Music,
  Wifi,
  Cloud,
  Bot,
  Palette,
  Gamepad2,
  Dumbbell,
  ShoppingBag,
  Film,
  Zap,
  BookOpen,
  CreditCard,
  Building2,
  Layers,
} from 'lucide-react';
import { CategoryType } from '../types';

interface ServiceLogoProps {
  name: string;
  category?: CategoryType;
  logoKey?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ServiceLogo: React.FC<ServiceLogoProps> = ({
  name,
  category,
  logoKey,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm rounded-xl',
    md: 'w-11 h-11 text-base rounded-2xl',
    lg: 'w-14 h-14 text-lg rounded-2xl',
    xl: 'w-18 h-18 text-2xl rounded-3xl',
  };

  const iconSizes = {
    sm: 16,
    md: 22,
    lg: 28,
    xl: 36,
  };

  const nameLower = (name || '').toLowerCase();
  const logoLower = (logoKey || '').toLowerCase();

  // Color mapping based on name or category
  const getGradientAndIcon = () => {
    if (nameLower.includes('spotify') || logoLower === 'spotify') {
      return { bg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30', icon: Music };
    }
    if (nameLower.includes('netflix') || logoLower === 'netflix') {
      return { bg: 'bg-rose-500/20 text-rose-500 border border-rose-500/30', icon: Film };
    }
    if (nameLower.includes('jio') || nameLower.includes('wifi') || nameLower.includes('broadband') || logoLower === 'wifi') {
      return { bg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', icon: Wifi };
    }
    if (nameLower.includes('aws') || nameLower.includes('cloud') || logoLower === 'cloud') {
      return { bg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', icon: Cloud };
    }
    if (nameLower.includes('chatgpt') || nameLower.includes('ai') || logoLower === 'bot') {
      return { bg: 'bg-teal-500/20 text-teal-400 border border-teal-500/30', icon: Bot };
    }
    if (nameLower.includes('adobe') || nameLower.includes('design') || logoLower === 'palette') {
      return { bg: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30', icon: Palette };
    }
    if (nameLower.includes('xbox') || nameLower.includes('game') || logoLower === 'gamepad') {
      return { bg: 'bg-green-500/20 text-green-400 border border-green-500/30', icon: Gamepad2 };
    }
    if (nameLower.includes('gym') || nameLower.includes('cult') || logoLower === 'dumbbell') {
      return { bg: 'bg-orange-500/20 text-orange-400 border border-orange-500/30', icon: Dumbbell };
    }
    if (nameLower.includes('prime') || nameLower.includes('amazon') || logoLower === 'shopping-bag') {
      return { bg: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30', icon: ShoppingBag };
    }

    // Category fallbacks
    switch (category) {
      case 'Entertainment':
        return { bg: 'bg-purple-500/20 text-purple-400 border border-purple-500/30', icon: Tv };
      case 'Utilities':
        return { bg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', icon: Zap };
      case 'Gaming':
        return { bg: 'bg-rose-500/20 text-rose-400 border border-rose-500/30', icon: Gamepad2 };
      case 'Education':
        return { bg: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30', icon: BookOpen };
      case 'Cloud':
        return { bg: 'bg-sky-500/20 text-sky-400 border border-sky-500/30', icon: Cloud };
      case 'Shopping':
        return { bg: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', icon: ShoppingBag };
      case 'Finance':
        return { bg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30', icon: CreditCard };
      default:
        return { bg: 'bg-slate-500/20 text-slate-300 border border-slate-500/30', icon: Layers };
    }
  };

  const { bg, icon: IconComponent } = getGradientAndIcon();

  return (
    <div
      className={`flex items-center justify-center font-semibold shrink-0 shadow-sm transition-transform duration-200 hover:scale-105 ${sizeClasses[size]} ${bg} ${className}`}
    >
      <IconComponent size={iconSizes[size]} />
    </div>
  );
};

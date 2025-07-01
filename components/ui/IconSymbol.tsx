// Fallback for using MaterialIcons on Android and web.

import {
  ArrowUp,
  ArrowUpDown,
  BatteryFull,
  Bell,
  Bird,
  Bomb,
  Brain,
  Brush,
  Bug,
  Cake,
  Calculator,
  Camera,
  Candy,
  Castle,
  Cat,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUp,
  Circle,
  Cloud,
  Computer,
  Crown,
  Dog,
  Download,
  Edit,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Fish,
  Flower,
  Gamepad,
  Gamepad2,
  Gem,
  Grid,
  Hash,
  Heart,
  HelpCircle,
  Home,
  Image,
  Info,
  Joystick,
  Layers,
  Leaf,
  Lock,
  Menu,
  Mic,
  Moon,
  Mountain,
  Move,
  Music,
  Palette,
  Panda,
  PartyPopper,
  PenTool,
  Plus,
  Puzzle,
  Rabbit,
  Rat,
  RefreshCw,
  Rocket,
  Search,
  Send,
  Settings,
  Share,
  Shield,
  Shrimp,
  Smile,
  Snail,
  Square,
  Star,
  Sun,
  Swords,
  Target,
  Trash,
  Trees,
  Trophy,
  Turtle,
  Unlock,
  Upload,
  User,
  Video,
  Videotape,
  Wrench,
  X,
  Ghost,
  Zap,
  RefreshCcw,
} from 'lucide-react-native';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export type IconName =
  | 'filter'
  | 'sort'
  | 'search'
  | 'game-controller'
  | 'crown'
  | 'wrench'
  | 'plus'
  | 'refresh'
  | 'arrow-up'
  | 'square'
  | 'circle'
  | 'hash'
  | 'settings'
  | 'user'
  | 'menu'
  | 'video'
  | 'moon'
  | 'shield'
  | 'file-text'
  | 'info'
  | 'chevron.right'
  | 'chevron.left'
  | 'chevron.up'
  | 'chevron.down'
  | 'battery-full'
  | 'swords'
  | 'joystick'
  | 'rocket'
  | 'gem'
  | 'computer'
  | 'calculate'
  | 'bomb'
  | 'brain'
  | 'move'
  | 'puzzle'
  | 'target'
  | 'grid'
  | 'zap'
  | 'help'
  | 'cake'
  | 'candy'
  | 'pets'
  | 'sports-soccer'
  | 'music-note'
  | 'star'
  | 'emoji-emotions'
  | 'celebration'
  | 'cat'
  | 'bird'
  | 'fish'
  | 'rabbit'
  | 'palette'
  | 'brush'
  | 'pen-tool'
  | 'layers'
  | 'gamepad'
  | 'trophy'
  | 'tree'
  | 'flower'
  | 'mountain'
  | 'cloud'
  | 'dog'
  | 'paw-print'
  | 'image'
  | 'camera'
  | 'edit'
  | 'lightning'
  | 'crosshair'
  | 'sun'
  | 'leaf'
  | 'panda'
  | 'bug'
  | 'turtle'
  | 'rat'
  | 'snail'
  | 'shrimp'
  | 'videotape'
  | 'castle'
  | 'ghost'
  | 'refresh-ccw';

// Category-based icon mappings for memory game
export const MEMORY_ICON_CATEGORIES = {
  animals: ['pets', 'cat', 'bird', 'fish', 'rabbit', 'dog', 'panda', 'bug', 'turtle', 'rat', 'snail', 'shrimp'] as const,
  design: ['palette', 'brush', 'pen-tool', 'layers', 'image', 'camera', 'edit', 'settings'] as const,
  gaming: ['gamepad', 'trophy', 'lightning', 'crosshair', 'joystick', 'swords', 'shield', 'crown'] as const,
  nature: ['tree', 'flower', 'mountain', 'cloud', 'sun', 'moon', 'star', 'leaf'] as const
} as const;

export type MemoryIconCategory = keyof typeof MEMORY_ICON_CATEGORIES;

const MAPPING = {
  'game-controller': Gamepad2,
  'swords': Swords,
  'gem': Gem,
  'bomb': Bomb,
  'computer': Computer,
  'joystick': Joystick,
  'rocket': Rocket,
  'crown': Crown,
  'wrench': Wrench,
  'plus': Plus,
  'refresh': RefreshCw,
  'arrow-up': ArrowUp,
  'square': Square,
  'circle': Circle,
  'hash': Hash,
  'settings': Settings,
  'user': User,
  'menu': Menu,
  'search': Search,
  'filter': Filter,
  'sort': ArrowUpDown,
  'video': Video,
  'image': Image,
  'house.fill': Home,
  'paperplane.fill': Send,
  'chevron.left': ChevronLeft,
  'chevron.left.forwardslash.chevron.right': ChevronLeft,
  'chevron.right': ChevronRight,
  'chevron.up': ChevronsUp,
  'chevron.down': ChevronDown,
  'xmark': X,
  'checkmark': Check,
  'candy': Candy,
  'star': Star,
  'heart': Heart,
  'share': Share,
  'download': Download,
  'upload': Upload,
  'trash': Trash,
  'edit': Edit,
  'camera': Camera,
  'mic': Mic,
  'bell': Bell,
  'lock': Lock,
  'unlock': Unlock,
  'eye': Eye,
  'eye-off': EyeOff,
  'moon': Moon,
  'sun': Sun,
  'shield': Shield,
  'file-text': FileText,
  'info': Info,
  'battery-full': BatteryFull,
  'calculate': Calculator,
  'brain': Brain,
  'move': Move,
  'puzzle': Puzzle,
  'target': Target,
  'grid': Grid,
  'zap': Zap,
  'help': HelpCircle,
  'cake': Cake,
  'pets': Cat,
  'sports-soccer': Target,
  'music-note': Music,
  'videotape': Videotape,
  'emoji-emotions': Smile,
  'celebration': PartyPopper,
  'cat': Cat,
  'bird': Bird,
  'fish': Fish,
  'rabbit': Rabbit,
  'palette': Palette,
  'brush': Brush,
  'pen-tool': PenTool,
  'layers': Layers,
  'gamepad': Gamepad,
  'trophy': Trophy,
  'tree': Trees,
  'flower': Flower,
  'mountain': Mountain,
  'cloud': Cloud,
  'dog': Dog,
  'paw-print': Heart,
  'lightning': Zap,
  'crosshair': Target,
  'leaf': Leaf,
  'panda': Panda,
  'bug': Bug,
  'turtle': Turtle,
  'rat': Rat,
  'snail': Snail,
  'shrimp': Shrimp,
  'castle': Castle,
  'ghost': Ghost,
  'refresh-ccw': RefreshCcw,
} as const;

interface IconSymbolProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function IconSymbol({ name, size = 24, color = '#000', style }: IconSymbolProps) {
  
  const Icon = MAPPING[name];
  
  if (!Icon) {
    console.error('IconSymbol: Icon not found for name:', name);
    console.error('IconSymbol: Available icons:', Object.keys(MAPPING));
    return null;
  }
  
  try {
    return <Icon size={size} color={color} style={style} />;
  } catch (error) {
    console.error('IconSymbol: Error rendering icon:', error);
    return null;
  }
}

// Helper function to get icons for a specific category
export function getMemoryIconsForCategory(category: MemoryIconCategory): readonly string[] {
  return MEMORY_ICON_CATEGORIES[category];
}

// Fallback for using MaterialIcons on Android and web.

import {
  ArrowUp,
  ArrowUpDown,
  BatteryFull,
  Bell,
  Bomb,
  Brain,
  Calculator,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Computer,
  Crown,
  Download,
  Edit,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Gamepad2,
  Gem,
  Grid,
  Hash,
  Heart,
  Home,
  Image,
  Info,
  Joystick,
  Lock,
  Menu,
  Mic,
  Moon,
  Move,
  Plus,
  Puzzle,
  RefreshCw,
  Rocket,
  Search,
  Send,
  Settings,
  Share,
  Shield,
  Square,
  Star,
  Sun,
  Swords,
  Target,
  Trash,
  Unlock,
  Upload,
  User,
  Video,
  Wrench,
  X,
  Zap
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
  | 'zap';

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
  'chevron.left.forwardslash.chevron.right': ChevronLeft,
  'chevron.right': ChevronRight,
  'chevron.up': ChevronUp,
  'chevron.down': ChevronDown,
  'xmark': X,
  'checkmark': Check,
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
  'zap': Zap
} as const;

interface IconSymbolProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function IconSymbol({ name, size = 24, color = '#000', style }: IconSymbolProps) {
  const Icon = MAPPING[name];
  return <Icon size={size} color={color} style={style} />;
}

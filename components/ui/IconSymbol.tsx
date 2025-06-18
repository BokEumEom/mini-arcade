// Fallback for using MaterialIcons on Android and web.

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

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
  'game-controller': 'gamepad-variant',
  'swords': 'sword-cross',
  'gem': 'diamond-stone',
  'bomb': 'bomb',
  'computer': 'desktop-classic',
  'joystick': 'gamepad-variant',
  'rocket': 'rocket-launch',
  'crown': 'crown',
  'wrench': 'wrench',
  'plus': 'plus',
  'refresh': 'refresh',
  'arrow-up': 'arrow-up',
  'square': 'square-outline',
  'circle': 'circle-outline',
  'hash': 'pound',
  'settings': 'cog',
  'user': 'account',
  'menu': 'menu',
  'search': 'magnify',
  'filter': 'filter-variant',
  'sort': 'sort',
  'video': 'video',
  'image': 'image',
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'chevron-left',
  'chevron.right': 'chevron-right',
  'chevron.up': 'chevron-up',
  'chevron.down': 'chevron-down',
  'xmark': 'close',
  'checkmark': 'check',
  'star': 'star',
  'heart': 'heart',
  'share': 'share-variant',
  'download': 'download',
  'upload': 'upload',
  'trash': 'delete',
  'edit': 'pencil',
  'camera': 'camera',
  'mic': 'microphone',
  'bell': 'bell',
  'lock': 'lock',
  'unlock': 'lock-open',
  'eye': 'eye',
  'eye-off': 'eye-off',
  'moon': 'weather-night',
  'sun': 'weather-sunny',
  'shield': 'shield',
  'file-text': 'file-document',
  'info': 'information',
  'battery-full': 'battery',
  'calculate': 'calculator',
  'brain': 'brain',
  'move': 'arrow-move',
  'puzzle': 'puzzle',
  'target': 'target',
  'grid': 'grid',
  'zap': 'lightning-bolt'
} as const;

interface IconSymbolProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function IconSymbol({ name, size = 24, color = '#000', style }: IconSymbolProps) {
  console.log('IconSymbol: Rendering icon:', { name, size, color });
  
  const iconName = MAPPING[name];
  
  if (!iconName) {
    console.error('IconSymbol: Icon not found for name:', name);
    console.error('IconSymbol: Available icons:', Object.keys(MAPPING));
    return null;
  }
  
  console.log('IconSymbol: Icon name found:', iconName);
  
  try {
    return <MaterialCommunityIcons name={iconName as any} size={size} color={color} style={style} />;
  } catch (error) {
    console.error('IconSymbol: Error rendering icon:', error);
    return null;
  }
}

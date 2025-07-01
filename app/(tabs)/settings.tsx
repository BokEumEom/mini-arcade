import { Header } from '@/components/common/Header';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { APP_THEME } from '@/constants/appTheme';
import { useGameHistory } from '@/hooks/useGameHistory';
import React from 'react';
import { Alert, Dimensions, Pressable, StyleSheet, Switch, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PADDING = 16;
const ICON_SIZE = 24;
const VERSION = '0.0.1';

type SettingIcon = 'moon' | 'info' | 'refresh-ccw' | 'file-text' | 'chevron.right';

interface SettingItemProps {
  icon: SettingIcon;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

function SettingItem({ 
  icon, 
  label, 
  value, 
  onPress, 
  showChevron = false,
  showSwitch = false,
  switchValue,
  onSwitchChange 
}: SettingItemProps) {
  const { isDark } = useTheme();
  const colors = isDark ? APP_THEME.dark : APP_THEME.light;
  const iconColor = colors.icon;

  return (
    <Pressable 
      style={[styles.setting, { backgroundColor: colors.card.background }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.settingLeft}>
        <IconSymbol
          name={icon}
          size={ICON_SIZE}
          color={iconColor}
        />
        <ThemedText style={styles.settingText}>{label}</ThemedText>
      </View>
      {showSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={colors.switch.track}
          thumbColor={switchValue ? colors.switch.thumb.true : colors.switch.thumb.false}
          accessibilityLabel={`Toggle ${label}`}
        />
      ) : showChevron ? (
        <IconSymbol
          name="chevron.right"
          size={ICON_SIZE}
          color={iconColor}
        />
      ) : value ? (
        <ThemedText style={[styles.settingValue, { color: colors.text }]}>{value}</ThemedText>
      ) : null}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { isDark, setTheme } = useTheme();
  const { clearGameHistory, gameHistory } = useGameHistory();
  const colors = isDark ? APP_THEME.dark : APP_THEME.light;

  const handleThemeChange = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  const handleClearGameHistory = () => {
    Alert.alert(
      '게임 기록 초기화',
      '모든 게임 플레이 기록을 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            clearGameHistory();
            Alert.alert('완료', '게임 기록이 초기화되었습니다.');
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Settings" />
      
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
        <SettingItem
          icon="moon"
          label="Dark Mode"
          showSwitch
          switchValue={isDark}
          onSwitchChange={handleThemeChange}
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Data</ThemedText>
        <SettingItem
          icon="refresh-ccw"
          label="게임 기록 초기화"
          value={`${gameHistory.length}개 게임`}
          onPress={handleClearGameHistory}
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>About</ThemedText>
        <SettingItem
          icon="info"
          label="Version"
          value={VERSION}
        />
        <SettingItem
          icon="shield"
          label="Privacy Policy"
          showChevron
          onPress={() => {/* TODO: Navigate to Privacy Policy */}}
        />
        <SettingItem
          icon="file-text"
          label="Terms of Service"
          showChevron
          onPress={() => {/* TODO: Navigate to Terms of Service */}}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: PADDING,
    width: SCREEN_WIDTH,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: PADDING,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: PADDING,
    marginBottom: 8,
    borderRadius: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 16,
    opacity: 0.7,
  },
  debugInfo: {
    marginTop: 12,
    padding: PADDING,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    marginBottom: 4,
  },
}); 
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Header({ title }: { title: string }) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.slash}>{'// '}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.underline} />
      </View>
    </SafeAreaView>
  );
}

const YELLOW = '#FFD600';

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1D1015',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  container: {
    backgroundColor: '#1D1015',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 8,
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  slash: {
    color: YELLOW,
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
  },
  title: {
    color: YELLOW,
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
  },
  underline: {
    borderBottomColor: YELLOW,
    borderBottomWidth: 4,
    borderStyle: 'solid',
    width: '100%',
    marginTop: 2,
    borderRadius: 2,
  },
});

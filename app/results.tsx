
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, ScrollView, StyleSheet, Platform, Animated } from 'react-native';
import { useEffect, useMemo, useRef } from 'react';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { PrizeConfig, PrizeDistribution } from '../types/prize';
import usePrizeCalculator from '../hooks/usePrizeCalculator';
import Button from '../components/Button';

export default function ResultsScreen() {
  const params = useLocalSearchParams<{
    totalPlayers?: string;
    buyInPerPlayer?: string;
    finePerGameweek?: string;
    numberOfGameweeks?: string;
    distribution?: string;
  }>();

  // Parse params safely
  const config: PrizeConfig = useMemo(() => {
    return {
      totalPlayers: Number(params.totalPlayers || 0),
      buyInPerPlayer: Number(params.buyInPerPlayer || 0),
      finePerGameweek: Number(params.finePerGameweek || 0),
      numberOfGameweeks: Number(params.numberOfGameweeks || 0),
    };
  }, [params]);

  const distribution: PrizeDistribution = useMemo(() => {
    try {
      const parsed = JSON.parse(params.distribution || '[]');
      if (Array.isArray(parsed)) {
        return parsed.map((v) => Number(v) || 0);
      }
      return [];
    } catch (e) {
      console.log('Failed to parse distribution', e);
      return [];
    }
  }, [params]);

  const { prizePool, prizes } = usePrizeCalculator(config, distribution);

  // Simple fade-in animation
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 400,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [fade]);

  return (
    <Animated.View style={[commonStyles.container, { opacity: fade }]}>
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={[commonStyles.content, { paddingBottom: 30, alignItems: 'stretch' }]}
      >
        <Text style={commonStyles.title}>Results</Text>

        <View style={commonStyles.section}>
          <View style={commonStyles.card}>
            <Text style={styles.header}>Summary</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Players</Text>
              <Text style={styles.value}>{config.totalPlayers}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Buy-in per Player</Text>
              <Text style={styles.value}>€{config.buyInPerPlayer.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fine per Gameweek</Text>
              <Text style={styles.value}>€{config.finePerGameweek.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Gameweeks</Text>
              <Text style={styles.value}>{config.numberOfGameweeks}</Text>
            </View>
            <View style={[styles.row, { marginTop: 6 }]}>
              <Text style={[styles.label, { fontWeight: '800' }]}>Total Prize Pool</Text>
              <Text style={[styles.value, { color: '#7CFC98', fontSize: 18 }]}>€{prizePool.toFixed(2)}</Text>
            </View>
          </View>

          <View style={commonStyles.card}>
            <Text style={styles.header}>Payouts</Text>
            {prizes.map((p) => (
              <View key={p.place} style={styles.payoutRow}>
                <Text style={styles.place}>Place {p.place}</Text>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.amount}>€{p.amount.toFixed(2)}</Text>
                  <Text style={styles.percent}>{Math.round(p.percentage * 100)}%</Text>
                </View>
              </View>
            ))}

            <View style={{ marginTop: 10 }}>
              <Button
                text="Back to Edit"
                onPress={() => router.back()}
                style={[buttonStyles.backButton, { backgroundColor: colors.secondary }]}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  label: {
    color: colors.text,
    opacity: 0.85,
  },
  value: {
    color: '#E0FFE9',
    fontWeight: '700',
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    boxShadow: '0px 2px 3px rgba(0,0,0,0.25)',
  },
  place: {
    color: colors.text,
    fontWeight: '700',
  },
  amount: {
    color: 'white',
    fontWeight: '800',
  },
  percent: {
    color: colors.grey,
    fontSize: 12,
    textAlign: 'right',
  },
});

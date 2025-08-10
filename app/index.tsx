
import { Text, View, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useState, useMemo } from 'react';
import { commonStyles, buttonStyles, colors } from '../styles/commonStyles';
import InputField from '../components/InputField';
import PercentageList from '../components/PercentageList';
import Button from '../components/Button';
import { PrizeConfig, PrizeDistribution } from '../types/prize';
import usePrizeCalculator from '../hooks/usePrizeCalculator';
import { Image } from "react-native";


export default function MainScreen() {
  // Defaults from your example
  const [config, setConfig] = useState<PrizeConfig>({
    totalPlayers: 12,
    buyInPerPlayer: 25,
    finePerGameweek: 3,
    numberOfGameweeks: 38,
  });

  const [distribution, setDistribution] = useState<PrizeDistribution>([0.40, 0.27, 0.15, 0.12, 0.06]);

  const { prizePool, percentageTotal } = usePrizeCalculator(config, distribution);
  const percentageTotal100 = useMemo(() => Math.round(percentageTotal * 100), [percentageTotal]);

  const applyPreset = (preset: 'example' | 'basic10') => {
    console.log('Applying preset', preset);
    if (preset === 'example') {
      setConfig({ totalPlayers: 12, buyInPerPlayer: 25, finePerGameweek: 3, numberOfGameweeks: 38 });
      setDistribution([0.40, 0.27, 0.15, 0.12, 0.06]);
      return;
    }
    if (preset === 'basic10') {
      setConfig({ totalPlayers: 10, buyInPerPlayer: 20, finePerGameweek: 2, numberOfGameweeks: 38 });
      setDistribution([0.5, 0.3, 0.2]);
      return;
    }
  };

  const handleCalculate = () => {
    try {
      // Prepare params; encode distribution as JSON
      const params = {
        totalPlayers: String(config.totalPlayers),
        buyInPerPlayer: String(config.buyInPerPlayer),
        finePerGameweek: String(config.finePerGameweek),
        numberOfGameweeks: String(config.numberOfGameweeks),
        distribution: JSON.stringify(distribution),
      };
      router.push({ pathname: '/results', params });
    } catch (e) {
      console.log('Failed to navigate to results', e);
    }
  };

  const disabled = percentageTotal < 0.999 || percentageTotal > 1.001;

  return (
    <KeyboardAvoidingView
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 16 : 0}
    >
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={[styles.centerContent]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.page}>
          <Text style={commonStyles.title}>Sons of Cuba FPL Prize Calculator</Text>
          <Text style={commonStyles.text}>
            Enter your league&apos;s details and distribution to calculate the prize pool and payouts.
          </Text>
          <Image
            source={{ uri: '/icon-192.png' }}   // file lives in /public
            style={styles.heroIcon}
            resizeMode="contain"
          />
          <View style={commonStyles.section}>
            <View style={commonStyles.card}>
              <Text style={styles.sectionTitle}>League Setup</Text>
              <InputField
                label="Total Players"
                value={config.totalPlayers}
                onChange={(val) => setConfig((c) => ({ ...c, totalPlayers: Math.max(0, Math.floor(val)) }))}
                keyboard="number-pad"
              />
              <InputField
                label="Buy-in per Player (€)"
                value={config.buyInPerPlayer}
                onChange={(val) => setConfig((c) => ({ ...c, buyInPerPlayer: Math.max(0, val) }))}
                keyboard="decimal-pad"
                prefix="€"
              />
              <InputField
                label="Fine per Gameweek (€)"
                value={config.finePerGameweek}
                onChange={(val) => setConfig((c) => ({ ...c, finePerGameweek: Math.max(0, val) }))}
                keyboard="decimal-pad"
                prefix="€"
              />
              <InputField
                label="Number of Gameweeks"
                value={config.numberOfGameweeks}
                onChange={(val) => setConfig((c) => ({ ...c, numberOfGameweeks: Math.max(0, Math.floor(val)) }))}
                keyboard="number-pad"
              />

              <View style={styles.row}>
                <TouchableOpacity onPress={() => applyPreset('example')} style={styles.presetChip}>
                  <Text style={styles.presetText}>Use Example</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => applyPreset('basic10')} style={styles.presetChip}>
                  <Text style={styles.presetText}>10 players quick set</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={commonStyles.card}>
              <Text style={styles.sectionTitle}>Prize Distribution</Text>
              <Text style={commonStyles.text}>
                Enter percentages for each place. They should add up to 100%.
              </Text>

              <PercentageList
                percentages={distribution.map((p) => p * 100)}
                onChange={(arr) => {
                  const normalized = arr.map((v) => Math.max(0, v) / 100);
                  setDistribution(normalized);
                }}
              />

              <View style={styles.totalRow}>
                <Text style={[commonStyles.text, { marginBottom: 0 }]}>Total</Text>
                <Text
                  style={[
                    commonStyles.text,
                    {
                      marginBottom: 0,
                      color: percentageTotal100 === 100 ? '#7CFC98' : '#FF9D9D',
                      fontWeight: '700',
                    },
                  ]}
                >
                  {percentageTotal100}%
                </Text>
              </View>
            </View>

            <View style={commonStyles.card}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Prize Pool</Text>
                <Text style={styles.summaryValue}>€{prizePool.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Distribution valid</Text>
                <Text style={[styles.summaryValue, { color: percentageTotal100 === 100 ? '#7CFC98' : '#FF9D9D' }]}>
                  {percentageTotal100 === 100 ? 'Yes' : 'No'}
                </Text>
              </View>

              <Button
                text={disabled ? 'Fix Distribution (must be 100%)' : 'Calculate Prizes'}
                onPress={handleCalculate}
                style={[buttonStyles.instructionsButton, disabled ? { opacity: 0.7 } : undefined]}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  // centers children inside the ScrollView on wide screens
  centerContent: {
    alignItems: 'center',
    paddingBottom: 30,
    paddingHorizontal: 16,
    flexGrow: 1, // allow content to fill height
  },
  // gives a nice max width while staying fluid
  page: {
    width: '100%',
    maxWidth: 980, // tweak: 840 / 960 / 1120 etc.
    alignSelf: 'center',
    marginTop: 20,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  presetChip: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
  },
  presetText: {
    color: 'white',
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: colors.text,
    fontWeight: '600',
  },
  summaryValue: {
    color: '#E0FFE9',
    fontWeight: '800',
  },
  heroIcon: {
    width: 96,
    height: 96,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
    borderRadius: 16,
  },
});

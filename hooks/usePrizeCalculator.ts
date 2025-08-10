
import { useMemo } from 'react';
import { PrizeConfig, PrizeDistribution } from '../types/prize';

interface PrizeItem {
  place: number;
  percentage: number;
  amount: number;
}

export default function usePrizeCalculator(config: PrizeConfig, distribution: PrizeDistribution) {
  return useMemo(() => {
    const { totalPlayers, buyInPerPlayer, finePerGameweek, numberOfGameweeks } = config;

    const poolFromBuyins = (totalPlayers || 0) * (buyInPerPlayer || 0);
    const poolFromFines = (finePerGameweek || 0) * (numberOfGameweeks || 0);
    const prizePool = poolFromBuyins + poolFromFines;

    const percentageTotal = distribution.reduce((sum, p) => sum + (p || 0), 0);

    // Compute prizes; normalize small floating errors by adjusting last item
    const prizes: PrizeItem[] = distribution.map((p, idx) => {
      const amount = prizePool * (p || 0);
      return {
        place: idx + 1,
        percentage: p || 0,
        amount,
      };
    });

    // Fix cents rounding to ensure total matches prizePool when rounded
    const rounded = prizes.map((x) => ({ ...x, amount: Math.round(x.amount * 100) / 100 }));
    const diff = Math.round((prizePool - rounded.reduce((s, x) => s + x.amount, 0)) * 100) / 100;
    if (rounded.length > 0 && Math.abs(diff) >= 0.01) {
      rounded[rounded.length - 1].amount = Math.round((rounded[rounded.length - 1].amount + diff) * 100) / 100;
    }

    return {
      prizePool,
      percentageTotal,
      prizes: rounded,
    };
  }, [config, distribution]);
}

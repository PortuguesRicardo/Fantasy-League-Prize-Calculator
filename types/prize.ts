
export interface PrizeConfig {
  totalPlayers: number;
  buyInPerPlayer: number;
  finePerGameweek: number;
  numberOfGameweeks: number;
}

export type PrizeDistribution = number[]; // [0..1] fractions per place

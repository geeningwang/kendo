export interface EnemyEntry {
  type: string;
  x?: number; // optional override; WaveManager uses camera-relative x if omitted
}

export interface WaveConfig {
  enemies: EnemyEntry[];
}

export interface StageConfig {
  name: string;
  bgColor: number;
  groundColor: number;
  bgmKey: string;
  waves: WaveConfig[];
}

import { stage1 } from './stage1';
import { stage2 } from './stage2';
import { stage3 } from './stage3';
import { stage4 } from './stage4';

export const stageConfigs: StageConfig[] = [stage1, stage2, stage3, stage4];

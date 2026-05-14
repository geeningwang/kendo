import type { StageConfig } from './index';

export const stage3: StageConfig = {
  name: 'STAGE 3 — SELECTION TOURNAMENT',
  bgColor: 0x1a0a2a,
  groundColor: 0x5a1a8a,
  bgmKey: 'bgm-stage3',
  waves: [
    { enemies: [{ type: 'defensive_trainee' }, { type: 'agile_trainee' }, { type: 'agile_trainee' }] },
    { enemies: [{ type: 'defensive_trainee' }, { type: 'defensive_trainee' }, { type: 'agile_trainee' }, { type: 'basic_trainee' }] },
    { enemies: [{ type: 'agile_trainee' }, { type: 'agile_trainee' }, { type: 'defensive_trainee' }, { type: 'defensive_trainee' }] },
    { enemies: [{ type: 'defensive_trainee' }, { type: 'agile_trainee' }, { type: 'agile_trainee' }, { type: 'defensive_trainee' }, { type: 'basic_trainee' }] },
  ],
};

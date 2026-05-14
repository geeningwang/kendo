import type { StageConfig } from './index';

export const stage2: StageConfig = {
  name: 'STAGE 2 — OPEN TOURNAMENT',
  bgColor: 0x0a1a2a,
  groundColor: 0x1a4a8a,
  bgmKey: 'bgm-stage2',
  waves: [
    { enemies: [{ type: 'basic_trainee' }, { type: 'basic_trainee' }, { type: 'basic_trainee' }] },
    { enemies: [{ type: 'defensive_trainee' }, { type: 'agile_trainee' }, { type: 'basic_trainee' }] },
    { enemies: [{ type: 'agile_trainee' }, { type: 'agile_trainee' }, { type: 'defensive_trainee' }] },
    { enemies: [{ type: 'defensive_trainee' }, { type: 'defensive_trainee' }, { type: 'agile_trainee' }, { type: 'basic_trainee' }] },
  ],
};

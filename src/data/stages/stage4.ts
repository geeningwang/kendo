import type { StageConfig } from './index';

export const stage4: StageConfig = {
  name: 'STAGE 4 — WORLD CHAMPIONSHIP',
  bgColor: 0x0a0a0a,
  groundColor: 0x333333,
  bgmKey: 'bgm-stage4',
  waves: [
    { enemies: [{ type: 'agile_trainee' }, { type: 'defensive_trainee' }, { type: 'agile_trainee' }, { type: 'defensive_trainee' }] },
    { enemies: [{ type: 'defensive_trainee' }, { type: 'agile_trainee' }, { type: 'agile_trainee' }, { type: 'defensive_trainee' }, { type: 'agile_trainee' }] },
    { enemies: [{ type: 'agile_trainee' }, { type: 'agile_trainee' }, { type: 'defensive_trainee' }, { type: 'defensive_trainee' }, { type: 'agile_trainee' }, { type: 'basic_trainee' }] },
  ],
};

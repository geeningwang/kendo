import type { StageConfig } from './index';

export const stage1: StageConfig = {
  name: 'STAGE 1 — DOJO TOURNAMENT',
  bgColor: 0x2a1a0a,
  groundColor: 0x8b6914,
  bgmKey: 'bgm-stage1',
  waves: [
    {
      enemies: [
        { type: 'basic_trainee' },
        { type: 'basic_trainee' },
      ],
    },
    {
      enemies: [
        { type: 'basic_trainee' },
        { type: 'defensive_trainee' },
      ],
    },
    {
      enemies: [
        { type: 'agile_trainee' },
        { type: 'basic_trainee' },
        { type: 'defensive_trainee' },
      ],
    },
  ],
};

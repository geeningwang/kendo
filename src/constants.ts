// ─── Canvas ──────────────────────────────────────────────────────────────────
export const CANVAS_W = 480;
export const CANVAS_H = 270;

// ─── Physics ─────────────────────────────────────────────────────────────────
export const GRAVITY = 800;
export const GROUND_Y = CANVAS_H - 32; // y-position of the ground surface

// ─── Player ──────────────────────────────────────────────────────────────────
export const PLAYER_SPEED = 120;
export const PLAYER_JUMP_VY = -380;
export const MAX_HP = 100;
export const MAX_ENERGY = 2; // number of energy bars

// ─── Combat ──────────────────────────────────────────────────────────────────
export const STAGGER_DURATION = 300;  // ms an enemy staggers after being hit
export const BLADE_ACTIVE_MS  = 120;  // ms the blade hitbox stays active per swing

// ─── Camera ──────────────────────────────────────────────────────────────────
export const WORLD_WIDTH = 3840; // default horizontal world size (8 screens wide)

// ─── Scenes ──────────────────────────────────────────────────────────────────
export const SCENE = {
  BOOT:    'BootScene',
  PRELOAD: 'PreloadScene',
  TITLE:   'TitleScene',
  SELECT:  'SelectScene',
  STAGE:   'StageScene',
  RESULT:  'ResultScene',
} as const;

// ─── Storage keys ────────────────────────────────────────────────────────────
export const SAVE_KEY = {
  UNLOCKED_KORYU:  'kendo_unlocked_koryu',
  STAGE_RATINGS:   'kendo_stage_ratings',
  UNLOCKED_ITEMS:  'kendo_unlocked_items',
  COMPLETION_COUNT:'kendo_completion_count',
} as const;

// ─── Stage index ─────────────────────────────────────────────────────────────
export const STAGE_COUNT = 4;

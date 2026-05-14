import Phaser from 'phaser';
import { CANVAS_W, CANVAS_H, GRAVITY } from './constants';
import { BootScene }    from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { TitleScene }   from './scenes/TitleScene';
import { SelectScene }  from './scenes/SelectScene';
import { StageScene }   from './scenes/StageScene';
import { ResultScene }  from './scenes/ResultScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: CANVAS_W,
  height: CANVAS_H,
  pixelArt: true,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: GRAVITY },
      debug: import.meta.env.DEV,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  fps: {
    target: 60,
    min: 20, // clamps max delta to 50 ms — prevents the tab-focus physics jump
  },
  scene: [BootScene, PreloadScene, TitleScene, SelectScene, StageScene, ResultScene],
};

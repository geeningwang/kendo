import Phaser from 'phaser';
import { SCENE, CANVAS_W, CANVAS_H } from '../constants';

/**
 * PreloadScene — loads all game assets and shows a progress bar.
 * When complete, transitions to TitleScene.
 *
 * Audio is intentionally NOT played here — it must wait for a user gesture
 * (handled in TitleScene) to comply with browser autoplay policy.
 */
export class PreloadScene extends Phaser.Scene {
  private bar!: Phaser.GameObjects.Graphics;
  private barBg!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: SCENE.PRELOAD });
  }

  preload() {
    this.createProgressBar();

    this.load.on('progress', (value: number) => {
      this.bar.clear();
      this.bar.fillStyle(0xffffff, 1);
      this.bar.fillRect(CANVAS_W * 0.1, CANVAS_H / 2 - 8, (CANVAS_W * 0.8) * value, 16);
    });

    // ── Placeholder assets (replaced with real atlas files when art is ready) ──
    // Characters
    // this.load.atlas('chudan', 'assets/atlas/chudan.png', 'assets/atlas/chudan.json');
    // this.load.atlas('jodan',  'assets/atlas/jodan.png',  'assets/atlas/jodan.json');
    // this.load.atlas('nito',   'assets/atlas/nito.png',   'assets/atlas/nito.json');
    // this.load.atlas('koryu',  'assets/atlas/koryu.png',  'assets/atlas/koryu.json');

    // Enemies
    // this.load.atlas('enemies', 'assets/atlas/enemies.png', 'assets/atlas/enemies.json');

    // Bosses
    // this.load.atlas('bosses',  'assets/atlas/bosses.png',  'assets/atlas/bosses.json');

    // Tilemaps
    // this.load.tilemapTiledJSON('stage1', 'assets/tilemaps/stage1.json');

    // UI
    // this.load.image('hud-frame', 'assets/ui/hud-frame.png');

    // Audio (both formats — Phaser picks the right one per browser)
    // this.load.audio('bgm-stage1', ['assets/audio/bgm/stage1.ogg', 'assets/audio/bgm/stage1.mp3']);
    // this.load.audio('sfx-hit',    ['assets/audio/sfx/hit.ogg',    'assets/audio/sfx/hit.mp3']);
  }

  create() {
    this.scene.start(SCENE.TITLE);
  }

  private createProgressBar() {
    const cx = CANVAS_W / 2;
    const cy = CANVAS_H / 2;

    // Background bar
    this.barBg = this.add.graphics();
    this.barBg.fillStyle(0x222222, 1);
    this.barBg.fillRect(CANVAS_W * 0.1, cy - 8, CANVAS_W * 0.8, 16);

    // Fill bar
    this.bar = this.add.graphics();

    // Label
    this.add.text(cx, cy - 24, 'LOADING...', {
      fontSize: '8px',
      color: '#ffffff',
      fontFamily: 'monospace',
    }).setOrigin(0.5);
  }
}

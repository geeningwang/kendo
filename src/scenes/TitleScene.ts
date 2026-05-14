import Phaser from 'phaser';
import { SCENE, CANVAS_W, CANVAS_H } from '../constants';
import { AudioManager } from '../systems/AudioManager';

/**
 * TitleScene — displays the title screen.
 *
 * The first user gesture (any key or button press) happens here,
 * which satisfies the browser autoplay policy and allows BGM to start.
 */
export class TitleScene extends Phaser.Scene {
  private pressAnyKey!: Phaser.GameObjects.Text;
  private audioUnlocked = false;

  constructor() {
    super({ key: SCENE.TITLE });
  }

  create() {
    const cx = CANVAS_W / 2;
    const cy = CANVAS_H / 2;

    // Title text (placeholder — replace with sprite when title art is ready)
    this.add.text(cx, cy - 50, 'KENDO', {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(cx, cy - 18, 'BEAT \'EM UP', {
      fontSize: '12px',
      color: '#cccccc',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.pressAnyKey = this.add.text(cx, cy + 30, 'PRESS ANY KEY', {
      fontSize: '8px',
      color: '#ffff00',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Blink the prompt
    this.tweens.add({
      targets: this.pressAnyKey,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    this.add.text(cx, CANVAS_H - 12, 'WASD / Arrow Keys  |  J/K/I/L/U/H to attack', {
      fontSize: '6px',
      color: '#888888',
      fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Any key or gamepad button advances — this is the first user gesture
    this.input.keyboard!.once('keydown', () => this.advance());
    this.input.gamepad?.once('down', () => this.advance());
  }

  private advance() {
    if (this.audioUnlocked) return;
    this.audioUnlocked = true;

    // Unlock audio (first user gesture — safe to start BGM after this)
    AudioManager.unlock(this);

    this.scene.start(SCENE.SELECT);
  }
}

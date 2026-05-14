import Phaser from 'phaser';
import { SCENE } from '../constants';

/**
 * BootScene — loads only the assets needed to render the preloader UI
 * (progress bar graphics are drawn procedurally, so nothing to load here).
 * Transitions immediately to PreloadScene.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE.BOOT });
  }

  create() {
    this.scene.start(SCENE.PRELOAD);
  }
}

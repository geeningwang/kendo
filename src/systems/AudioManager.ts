import Phaser from 'phaser';

/**
 * AudioManager — wraps Phaser sound and enforces the user-gesture gate.
 * BGM must only be started after AudioManager.unlock() has been called.
 */
export class AudioManager {
  private static unlocked = false;
  private static currentBgm: Phaser.Sound.BaseSound | null = null;

  /** Call this on the first user gesture (TitleScene key/button press). */
  static unlock(_scene: Phaser.Scene) {
    AudioManager.unlocked = true;
  }

  static playBgm(scene: Phaser.Scene, key: string) {
    if (!AudioManager.unlocked) return;
    AudioManager.stopBgm(scene);

    if (!scene.sound.get(key)) return; // asset not loaded yet (placeholder mode)

    AudioManager.currentBgm = scene.sound.add(key, { loop: true, volume: 0.6 });
    AudioManager.currentBgm.play();
  }

  static stopBgm(_scene: Phaser.Scene) {
    if (AudioManager.currentBgm) {
      AudioManager.currentBgm.stop();
      AudioManager.currentBgm = null;
    }
  }

  static playSfx(scene: Phaser.Scene, key: string, volume = 1.0) {
    if (!AudioManager.unlocked) return;
    if (!scene.sound.get(key)) return;
    scene.sound.play(key, { volume });
  }
}

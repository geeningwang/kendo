import Phaser from 'phaser';
import { Character } from './Character';

/**
 * Chūdan — Balanced, Beginner-Friendly
 *
 * Normal 3-hit combo: horizontal slash → vertical slash → thrust
 * Heavy: charged horizontal chop
 * Super: Chūdan Chain — Flash Strike (3 rapid precise slashes, costs 1 energy bar)
 */
export class Chudan extends Character {
  protected readonly NORMAL_DAMAGE  = [8, 10, 14];  // 3-hit combo
  protected readonly HEAVY_DAMAGE   = 20;
  protected readonly GRAB_DAMAGE    = 16;
  protected readonly SUPER_DAMAGE   = 30;
  protected readonly SUPER_ENERGY_COST = 1;
  protected readonly ATTACK_DURATION  = 300; // ms

  constructor(scene: Phaser.Scene, x: number, y: number, playerIndex: 0 | 1) {
    super(scene, x, y, playerIndex);
  }

  protected override getAtlasKey(): string | null {
    return 'chudan';
  }

  protected override createAnimations(key: string): void {
    const anims = this.scene.anims;
    if (anims.exists(`${key}-idle`)) return; // already registered

    anims.create({
      key: `${key}-idle`,
      frames: anims.generateFrameNames(key, { prefix: 'idle_', start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });
    anims.create({
      key: `${key}-walk`,
      frames: anims.generateFrameNames(key, { prefix: 'walk_', start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    anims.create({
      key: `${key}-attack`,
      frames: anims.generateFrameNames(key, { prefix: 'attack_', start: 0, end: 4 }),
      frameRate: 12,
      repeat: 0,
    });
  }

  protected override onSuperEnter() {
    // Flash Strike: 3 rapid slashes
    const hits = [0, 120, 240];
    hits.forEach(delay => {
      this.scene.time.delayedCall(delay, () => {
        if (!this.isDead) this.startAttack(this.SUPER_DAMAGE / 3);
      });
    });

    this.scene.cameras.main.shake(300, 0.006);

    this.scene.time.delayedCall(400, () => {
      if (!this.isDead) this.sm.transition('idle');
    });
  }
}

import Phaser from 'phaser';
import { Character } from './Character';

/**
 * Jōdan — Aggressive, High Damage / Low Margin
 *
 * Normal 3-hit combo: high diagonal slash → horizontal slash → heavy chop
 * Heavy: charged overhead cleave, launches enemies
 * Jump attack: aerial heavy slam, screen shake on landing
 * Super: Thunder Cleave — full-screen overhead slam, costs 2 energy bars
 */
export class Jodan extends Character {
  protected readonly NORMAL_DAMAGE     = [10, 12, 18]; // hits 3 are high damage
  protected readonly HEAVY_DAMAGE      = 28;           // launches
  protected readonly GRAB_DAMAGE       = 18;
  protected readonly SUPER_DAMAGE      = 50;
  protected readonly SUPER_ENERGY_COST = 2;
  protected readonly ATTACK_DURATION   = 380;          // slower wind-up

  constructor(scene: Phaser.Scene, x: number, y: number, playerIndex: 0 | 1) {
    super(scene, x, y, playerIndex);
  }

  /** Heavy: launches the enemy upward on hit. */
  protected override onHeavyEnter() {
    this.startAttack(this.HEAVY_DAMAGE);
    // Flag so StageScene can apply a launch velocity on the hit target
    this.launchOnNextHit = true;
    this.scene.time.delayedCall(this.ATTACK_DURATION * 1.6, () => {
      if (!this.isDead) {
        this.launchOnNextHit = false;
        this.sm.transition('idle');
      }
    });
  }

  /** Thunder Cleave: screen shake + full-damage strike. */
  protected override onSuperEnter() {
    this.startAttack(this.SUPER_DAMAGE);
    this.scene.cameras.main.shake(400, 0.012);

    // Wide blade zone for the cleave
    const body = this.bladeZone.body as Phaser.Physics.Arcade.Body;
    const origW = body.width;
    body.setSize(80, 32);
    this.scene.time.delayedCall(180, () => body.setSize(origW, 32));

    this.scene.time.delayedCall(this.ATTACK_DURATION * 2.2, () => {
      if (!this.isDead) this.sm.transition('idle');
    });
  }

  // Subclass-specific flag — used by StageScene combat resolution
  launchOnNextHit = false;
}

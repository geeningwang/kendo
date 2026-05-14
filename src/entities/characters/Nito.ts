import Phaser from 'phaser';
import { Character } from './Character';

/**
 * Nitō-ryū — Agile, Multi-hit
 *
 * Normal 5-hit combo: alternating left/right slashes → cross slash → dual thrust
 * Heavy: wide dual sweep (broad range, low damage)
 * Super: Raging Dance — 3-second rapid flurry, player can move during it, costs 1 bar
 */
export class Nito extends Character {
  protected readonly NORMAL_DAMAGE     = [5, 5, 6, 6, 8]; // 5-hit combo
  protected readonly HEAVY_DAMAGE      = 12;               // wide but weak
  protected readonly GRAB_DAMAGE       = 14;
  protected readonly SUPER_DAMAGE      = 8;                // per-hit during flurry
  protected readonly SUPER_ENERGY_COST = 1;
  protected readonly ATTACK_DURATION   = 200;              // fastest attacks

  // Tracks whether Raging Dance is active
  private ragingDance = false;
  private ragingDanceTimer = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, playerIndex: 0 | 1) {
    super(scene, x, y, playerIndex);
  }

  // 5-hit combo: base handleInput drives up to comboStep 5 naturally
  // (NORMAL_DAMAGE has 5 entries; base class uses array length as cap)

  override update(input: import('../../systems/InputManager').ActionMap) {
    super.update(input);

    // During Raging Dance, fire blade hits every 120 ms while active
    if (this.ragingDance) {
      this.ragingDanceTimer -= this.scene.game.loop.delta;
      if (this.ragingDanceTimer <= 0) {
        this.startAttack(this.SUPER_DAMAGE);
        this.ragingDanceTimer = 120;
      }
    }
  }

  /** Heavy: wider blade zone, low damage. */
  protected override onHeavyEnter() {
    this.startAttack(this.HEAVY_DAMAGE);
    const body = this.bladeZone.body as Phaser.Physics.Arcade.Body;
    const origW = body.width;
    body.setSize(56, 28); // wide sweep
    this.scene.time.delayedCall(160, () => body.setSize(origW, 28));
    this.scene.time.delayedCall(this.ATTACK_DURATION * 1.4, () => {
      if (!this.isDead) this.sm.transition('idle');
    });
  }

  /**
   * Raging Dance: 3-second flurry — player can still move.
   * Instead of locking into an attack state, we set a flag and return to idle
   * immediately so movement input still works.
   */
  protected override onSuperEnter() {
    this.ragingDance = true;
    this.ragingDanceTimer = 0;
    this.scene.cameras.main.shake(150, 0.003);

    this.scene.time.delayedCall(3000, () => {
      this.ragingDance = false;
      if (!this.isDead) this.sm.transition('idle');
    });

    // Return to idle right away so movement is not blocked
    this.scene.time.delayedCall(50, () => {
      if (!this.isDead && !this.sm.is('dead')) this.sm.transition('idle');
    });
  }
}

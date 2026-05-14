import Phaser from 'phaser';
import { Character } from './Character';

/**
 * Koryū — Counter-Type, Unlockable Late-Game Powerhouse
 *
 * Normal 2-hit combo: slow heavy slash → thrust (extremely high damage)
 * Heavy: defensive stance — absorbs a hit and immediately counters, launching enemy
 * Jump attack: aerial straight thrust, pierces multiple enemies
 * Super: No Gap — enter defensive stance 3 s (immune to all damage);
 *        triggers a full-screen counter-strike at the end. Costs 2 energy bars.
 *
 * Unique mechanic — STAGGER IMMUNITY:
 *   While in guard or defensive stance, takeDamage() is completely suppressed.
 *   On absorb (heavy), the absorbed hit triggers a counter-strike automatically.
 */
export class Koryu extends Character {
  protected readonly NORMAL_DAMAGE     = [22, 30];    // 2-hit combo, very high damage
  protected readonly HEAVY_DAMAGE      = 40;          // counter-launch
  protected readonly GRAB_DAMAGE       = 28;
  protected readonly SUPER_DAMAGE      = 60;          // full-screen counter
  protected readonly SUPER_ENERGY_COST = 2;
  protected readonly ATTACK_DURATION   = 500;         // slow, weighty

  /** True while absorbing via heavy stance. */
  private absorbStance = false;
  /** True during No Gap immunity window. */
  private noGapActive = false;

  constructor(scene: Phaser.Scene, x: number, y: number, playerIndex: 0 | 1) {
    super(scene, x, y, playerIndex);
  }

  /** Stagger immunity: suppressed during absorb/NoGap. */
  override takeDamage(amount: number) {
    if (this.absorbStance) {
      // Absorb the hit — immediately trigger counter
      this.absorbStance = false;
      this.startAttack(this.HEAVY_DAMAGE);
      this.scene.cameras.main.flash(100, 255, 215, 0); // golden flash
      this.scene.time.delayedCall(this.ATTACK_DURATION, () => {
        if (!this.isDead) this.sm.transition('idle');
      });
      return;
    }
    if (this.noGapActive) return; // fully immune during No Gap

    super.takeDamage(amount);
  }

  /** Heavy: enter absorb stance for a window, then counter. */
  protected override onHeavyEnter() {
    this.absorbStance = true;
    // If no hit absorbed within the window, cancel stance
    this.scene.time.delayedCall(600, () => {
      if (this.absorbStance) {
        this.absorbStance = false;
        if (!this.isDead) this.sm.transition('idle');
      }
    });
  }

  /** No Gap: 3-second full immunity → full-screen counter-strike at the end. */
  protected override onSuperEnter() {
    this.noGapActive = true;
    this.scene.cameras.main.flash(80, 0, 0, 0);

    this.scene.time.delayedCall(3000, () => {
      this.noGapActive = false;
      if (!this.isDead) {
        // Full-screen counter — wide blade zone
        this.startAttack(this.SUPER_DAMAGE);
        const body = this.bladeZone.body as Phaser.Physics.Arcade.Body;
        body.setSize(320, 270); // covers full screen width
        this.scene.cameras.main.flash(150, 255, 215, 0); // golden burst
        this.scene.time.delayedCall(200, () => body.setSize(32, 24));
        this.scene.time.delayedCall(600, () => {
          if (!this.isDead) this.sm.transition('idle');
        });
      }
    });
  }

  protected override onGuardUpdate() {
    // Koryū guard is stagger-immune (handled in takeDamage)
  }
}

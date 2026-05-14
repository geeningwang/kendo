import { Enemy } from './Enemy';
import { StageScene } from '../../scenes/StageScene';
import { Character } from '../characters/Character';

/**
 * Defensive Trainee — carries a shield.
 * Requires a heavy attack to break guard; blocks normal attacks.
 */
export class DefensiveTrainee extends Enemy {
  protected readonly MAX_HP      = 45;
  protected readonly AGGRO_RANGE = 180;
  protected readonly STRIKE_RANGE = 44;
  readonly attackDamage = 10;

  private guarding = false;

  constructor(scene: StageScene, x: number, y: number) {
    super(scene, x, y);
    this.init();
  }

  override takeDamage(amount: number, source: Character) {
    // Block normal attacks when guarding; only heavy (damage > 15) breaks guard
    if (this.guarding && amount <= 15) return;
    if (this.guarding && amount > 15) this.guarding = false; // guard broken
    super.takeDamage(amount, source);
  }

  protected override onChaseUpdate() {
    // Randomly enter guard stance when far from player
    const target = this.nearestPlayer();
    if (!target) return;

    if (this.distToPlayer(target) > 80 && Math.random() < 0.002) {
      this.guarding = true;
      this.scene.time.delayedCall(1500, () => { this.guarding = false; });
    }

    super.onChaseUpdate();
  }
}

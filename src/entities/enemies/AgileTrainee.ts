import Phaser from 'phaser';
import { Enemy } from './Enemy';
import { StageScene } from '../../scenes/StageScene';

/** Agile Trainee — fast movement, light thrusts. */
export class AgileTrainee extends Enemy {
  protected readonly MAX_HP      = 22;
  protected readonly AGGRO_RANGE = 240;
  protected readonly STRIKE_RANGE = 38;
  readonly attackDamage = 6;

  constructor(scene: StageScene, x: number, y: number) {
    super(scene, x, y);
    this.init();
  }

  protected override onChaseUpdate() {
    const target = this.nearestPlayer();
    if (!target) return;

    // Move faster than base enemy
    const dir = target.sprite.x < this.sprite.x ? -1 : 1;
    this.facing = dir as 1 | -1;
    (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocityX(dir * 100);
    this.sprite.setFlipX(dir === 1);

    if (this.distToPlayer(target) <= this.STRIKE_RANGE && this.attackCooldown <= 0) {
      this.sm.transition('attack');
    }
  }

  protected override doAttack() {
    // Faster attack window
    this.bladeActive = true;
    this.scene.time.delayedCall(80, () => { this.bladeActive = false; });
    this.scene.time.delayedCall(250, () => {
      if (!this.isDead) {
        this.attackCooldown = 900;
        this.sm.transition('chase');
      }
    });
  }
}

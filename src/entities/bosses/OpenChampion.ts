import { Boss } from './Boss';
import type { PhaseConfig } from './Boss';
import { StateMachine } from '../../utils/StateMachine';
import { StageScene } from '../../scenes/StageScene';

/**
 * Stage 2 Boss — Open Tournament Champion (Nitō-ryū style)
 *
 * Agile and evasive, high combo count.
 * Exclusive skill: Speed Slash — rapid dash + multi-hit slashes (hard to dodge).
 * High HP. Punish openings after dodging combos.
 */
export class OpenChampion extends Boss {
  protected readonly MAX_HP       = 260;
  protected readonly AGGRO_RANGE  = 350;
  protected readonly STRIKE_RANGE = 44;
  readonly attackDamage = 10;
  protected bossSpeed   = 80; // faster than base
  protected readonly telegraphDuration = 350; // shorter telegraph — agile
  protected readonly recoverDuration   = 500;
  protected readonly BOSS_NAME = 'OPEN CHAMPION';

  protected readonly phases: PhaseConfig[] = [
    { hpThreshold: 1.0, speedMult: 1 },
  ];

  constructor(scene: StageScene, x: number, y: number) {
    super(scene, x, y);
    this.init();
  }

  protected onBossAttack(sm: StateMachine) {
    const roll = Math.random();

    if (roll < 0.4) {
      this.speedSlash(sm);
    } else if (roll < 0.7) {
      this.rapidCombo(sm); // 3-hit multi-swing
    } else {
      this.singleSlash(sm);
    }
  }

  private singleSlash(sm: StateMachine) {
    this.bladeActive = true;
    this.scene.time.delayedCall(100, () => { this.bladeActive = false; });
    this.scene.time.delayedCall(350, () => sm.transition('recover'));
  }

  private rapidCombo(sm: StateMachine) {
    [0, 120, 240].forEach(delay => {
      this.scene.time.delayedCall(delay, () => {
        if (!this.isDead) {
          this.bladeActive = true;
          this.scene.time.delayedCall(80, () => { this.bladeActive = false; });
        }
      });
    });
    this.scene.time.delayedCall(480, () => sm.transition('recover'));
  }

  /** Speed Slash: dash toward the player and deliver rapid hits. */
  private speedSlash(sm: StateMachine) {
    const target = this.nearestPlayer();
    if (!target) { sm.transition('recover'); return; }

    const dir = target.sprite.x < this.sprite.x ? -1 : 1;
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;

    // Dash
    body.setVelocityX(dir * 240);
    this.scene.cameras.main.shake(100, 0.004);

    this.scene.time.delayedCall(150, () => { body.setVelocityX(0); });

    // Hits during dash
    [60, 140, 220].forEach(delay => {
      this.scene.time.delayedCall(delay, () => {
        if (!this.isDead) {
          this.bladeActive = true;
          this.scene.time.delayedCall(60, () => { this.bladeActive = false; });
        }
      });
    });

    this.scene.time.delayedCall(500, () => sm.transition('recover'));
  }
}

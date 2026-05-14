import { Boss } from './Boss';
import type { PhaseConfig } from './Boss';
import { StateMachine } from '../../utils/StateMachine';
import { StageScene } from '../../scenes/StageScene';

/**
 * Stage 1 Boss — Dojo Champion (Chūdan style)
 *
 * Exclusive skill: Steady Strike — 3 consecutive mid-level thrusts with stagger.
 * Single phase. Moderate HP. Good introduction to boss rhythm.
 */
export class DojoChampion extends Boss {
  protected readonly MAX_HP       = 180;
  protected readonly AGGRO_RANGE  = 300;
  protected readonly STRIKE_RANGE = 48;
  readonly attackDamage = 12;
  protected readonly BOSS_NAME = 'DOJO CHAMPION';

  protected readonly phases: PhaseConfig[] = [
    { hpThreshold: 1.0, speedMult: 1 },
  ];

  constructor(scene: StageScene, x: number, y: number) {
    super(scene, x, y);
    this.init();
  }

  protected onBossAttack(sm: StateMachine) {
    const roll = Math.random();

    if (roll < 0.35) {
      // Steady Strike: 3 rapid thrusts
      this.steadyStrike(sm);
    } else {
      // Normal swing
      this.normalSwing(sm);
    }
  }

  private normalSwing(sm: StateMachine) {
    this.bladeActive = true;
    this.scene.time.delayedCall(130, () => { this.bladeActive = false; });
    this.scene.time.delayedCall(400, () => sm.transition('recover'));
  }

  private steadyStrike(sm: StateMachine) {
    // 3 consecutive thrusts 180 ms apart
    [0, 180, 360].forEach(delay => {
      this.scene.time.delayedCall(delay, () => {
        if (!this.isDead) {
          this.bladeActive = true;
          this.scene.time.delayedCall(100, () => { this.bladeActive = false; });
        }
      });
    });
    this.scene.time.delayedCall(600, () => sm.transition('recover'));
  }
}

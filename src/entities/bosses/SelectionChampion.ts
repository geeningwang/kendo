import { Boss } from './Boss';
import type { PhaseConfig } from './Boss';
import { StateMachine } from '../../utils/StateMachine';
import { StageScene } from '../../scenes/StageScene';
import { CANVAS_W } from '../../constants';

/**
 * Stage 3 Boss — Selection Champion (Jōdan style)
 *
 * High damage, high defense, enormous attack range.
 * Exclusive: Sky Cleave — full-screen overhead slam, must dodge early.
 * Phase 2 (HP < 50%): faster attacks, sword aura on all moves.
 * Requires smart use of supers and defense.
 */
export class SelectionChampion extends Boss {
  protected readonly MAX_HP       = 360;
  protected readonly AGGRO_RANGE  = 320;
  protected readonly STRIKE_RANGE = 60;
  readonly attackDamage = 18;
  protected readonly telegraphDuration = 700; // long wind-up for big attacks
  protected readonly recoverDuration   = 1000;
  protected readonly BOSS_NAME = 'SELECTION CHAMPION';

  protected readonly phases: PhaseConfig[] = [
    { hpThreshold: 1.0,  speedMult: 1 },
    { hpThreshold: 0.5,  speedMult: 1.4, auraColor: 0xff4400 }, // Phase 2
  ];

  constructor(scene: StageScene, x: number, y: number) {
    super(scene, x, y);
    this.init();
  }

  protected override onPhaseChange(phase: number) {
    super.onPhaseChange(phase);
    if (phase === 1) {
      // Visual cue: tint placeholder rectangle red-orange
      this.sprite.setTint(0xff6600);
      this.scene.cameras.main.shake(600, 0.01);
    }
  }

  protected onBossAttack(sm: StateMachine) {
    const roll = Math.random();
    const isPhase2 = this.currentPhase >= 1;

    if (roll < (isPhase2 ? 0.45 : 0.25)) {
      this.skyCleave(sm);
    } else if (roll < 0.65) {
      this.heavyChop(sm);
    } else {
      this.normalSwing(sm);
    }
  }

  private normalSwing(sm: StateMachine) {
    this.bladeActive = true;
    const body = this.bladeZone.body as Phaser.Physics.Arcade.Body;
    body.setSize(56, 32); // wide due to Jōdan range
    this.scene.time.delayedCall(160, () => {
      this.bladeActive = false;
      body.setSize(32, 24);
    });
    this.scene.time.delayedCall(500, () => sm.transition('recover'));
  }

  private heavyChop(sm: StateMachine) {
    this.scene.cameras.main.shake(200, 0.006);
    this.bladeActive = true;
    const body = this.bladeZone.body as Phaser.Physics.Arcade.Body;
    body.setSize(72, 36);
    this.scene.time.delayedCall(200, () => {
      this.bladeActive = false;
      body.setSize(32, 24);
    });
    this.scene.time.delayedCall(700, () => sm.transition('recover'));
  }

  /** Sky Cleave: telegraph with a full stop, then hit the full screen width. */
  private skyCleave(sm: StateMachine) {
    // Warn: freeze briefly
    (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
    this.scene.cameras.main.shake(100, 0.004);

    this.scene.time.delayedCall(500, () => {
      if (this.isDead) return;
      this.bladeActive = true;
      const body = this.bladeZone.body as Phaser.Physics.Arcade.Body;
      body.setSize(CANVAS_W, 40); // full screen
      this.scene.cameras.main.shake(400, 0.014);
      this.scene.time.delayedCall(180, () => {
        this.bladeActive = false;
        body.setSize(32, 24);
      });
      this.scene.time.delayedCall(900, () => sm.transition('recover'));
    });
  }
}

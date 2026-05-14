import { Boss } from './Boss';
import type { PhaseConfig } from './Boss';
import { StateMachine } from '../../utils/StateMachine';
import { StageScene } from '../../scenes/StageScene';
import { CANVAS_W, CANVAS_H } from '../../constants';
import { SaveManager } from '../../systems/SaveManager';

/**
 * Stage 4 Final Boss — World Champion (Koryū style)
 *
 * Three phases:
 *   Phase 1 (100%→70%): Standard Koryū moves, mostly defensive with occasional counters
 *   Phase 2 (HP < 70%): Formation Break — wide sword aura lasting 5 s
 *   Phase 3 (HP < 30%): Unrivaled — full-screen one-shot attack (player must block/invincibility)
 *
 * On death, increments completion count and checks Koryū unlock conditions.
 */
export class WorldChampion extends Boss {
  protected readonly MAX_HP       = 500;
  protected readonly AGGRO_RANGE  = 400;
  protected readonly STRIKE_RANGE = 55;
  readonly attackDamage = 22;
  protected readonly telegraphDuration = 800;
  protected readonly recoverDuration   = 1200;
  protected readonly BOSS_NAME = '⚔ WORLD CHAMPION ⚔';

  protected readonly phases: PhaseConfig[] = [
    { hpThreshold: 1.0,  speedMult: 1 },
    { hpThreshold: 0.70, speedMult: 1.3, auraColor: 0xffcc00 }, // Phase 2
    { hpThreshold: 0.30, speedMult: 1.6, auraColor: 0xffffff }, // Phase 3
  ];

  // Formation Break: active blade aura window
  private formationBreakActive = false;
  private formationBreakTimer  = 0;

  constructor(scene: StageScene, x: number, y: number) {
    super(scene, x, y);
    this.init();
  }

  override update() {
    super.update();

    if (this.formationBreakActive) {
      this.formationBreakTimer -= this.scene.game.loop.delta;
      if (this.formationBreakTimer > 0) {
        this.bladeActive = true; // continuously active during Formation Break
      } else {
        this.formationBreakActive = false;
        this.bladeActive = false;
      }
    }
  }

  protected override onPhaseChange(phase: number) {
    super.onPhaseChange(phase);

    if (phase === 1) {
      this.sprite.setTint(0xffcc44);
      this.triggerFormationBreak();
    } else if (phase === 2) {
      this.sprite.setTint(0xffffff);
      this.scene.cameras.main.shake(800, 0.016);
      // Signal danger: flash screen
      this.scene.cameras.main.flash(400, 255, 0, 0);
    }
  }

  protected onBossAttack(sm: StateMachine) {
    const roll = Math.random();

    if (this.currentPhase >= 2 && roll < 0.35) {
      this.unrivaled(sm);
    } else if (this.currentPhase >= 1 && roll < 0.3) {
      this.triggerFormationBreak();
      this.scene.time.delayedCall(5200, () => sm.transition('recover'));
    } else if (roll < 0.4) {
      this.counterStance(sm);
    } else {
      this.heavyThrust(sm);
    }
  }

  private heavyThrust(sm: StateMachine) {
    this.bladeActive = true;
    const body = this.bladeZone.body as Phaser.Physics.Arcade.Body;
    body.setSize(48, 28);
    this.scene.time.delayedCall(180, () => {
      this.bladeActive = false;
      body.setSize(32, 24);
    });
    this.scene.time.delayedCall(600, () => sm.transition('recover'));
  }

  /** Counter stance: absorb incoming hit and strike back (mirrors Koryū player). */
  private counterStance(sm: StateMachine) {
    let absorbed = false;
    const originalTakeDamage = this.takeDamage.bind(this);

    // Temporarily override to absorb
    (this as unknown as { takeDamage: (a: number, s: unknown) => void }).takeDamage =
      (_amount: number, _source: unknown) => {
        if (!absorbed) {
          absorbed = true;
          this.bladeActive = true;
          this.scene.cameras.main.flash(100, 255, 215, 0);
          this.scene.time.delayedCall(160, () => { this.bladeActive = false; });
          this.scene.time.delayedCall(400, () => sm.transition('recover'));
        }
      };

    // Cancel if no hit absorbed within window
    this.scene.time.delayedCall(1000, () => {
      (this as unknown as { takeDamage: typeof originalTakeDamage }).takeDamage = originalTakeDamage;
      if (!absorbed && !this.isDead) sm.transition('recover');
    });
  }

  /** Formation Break: 5-second continuous sword-aura damage field. */
  private triggerFormationBreak() {
    this.formationBreakActive = true;
    this.formationBreakTimer  = 5000;
    const body = this.bladeZone.body as Phaser.Physics.Arcade.Body;
    body.setSize(64, 40);
    this.scene.cameras.main.shake(200, 0.005);
    this.scene.time.delayedCall(5000, () => body.setSize(32, 24));
  }

  /**
   * Unrivaled: one-shot full-screen attack — players must use guard or invincibility.
   * Deals 9999 damage (effectively an OHKO). Has a long visible telegraph.
   */
  private unrivaled(sm: StateMachine) {
    (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocityX(0);

    // 1.5 s warning flash
    this.scene.cameras.main.flash(1500, 255, 255, 255);
    this.scene.cameras.main.shake(200, 0.006);

    this.scene.time.delayedCall(1500, () => {
      if (this.isDead) return;
      // Hit entire screen
      this.bladeActive = true;
      const body = this.bladeZone.body as Phaser.Physics.Arcade.Body;
      body.setSize(CANVAS_W + 60, CANVAS_H);
      // Override damage to 9999 for this hit only
      const prevDmg = this.attackDamage;
      (this as { attackDamage: number }).attackDamage = 9999;
      this.scene.time.delayedCall(100, () => {
        this.bladeActive = false;
        body.setSize(32, 24);
        (this as { attackDamage: number }).attackDamage = prevDmg;
      });
      this.scene.time.delayedCall(1000, () => sm.transition('recover'));
    });
  }

  /** On final boss death: unlock Koryū if conditions are met. */
  protected override onDeadEnter() {
    super.onDeadEnter();

    SaveManager.incrementCompletionCount();
    const count = SaveManager.getCompletionCount();

    // Unlock Koryū after 3 completions
    if (count >= 3) SaveManager.unlockKoryu();
  }
}

import Phaser from 'phaser';
import { Enemy } from '../enemies/Enemy';
import { StateMachine } from '../../utils/StateMachine';
import { Character } from '../characters/Character';
import { StageScene } from '../../scenes/StageScene';
import { CANVAS_H, CANVAS_W } from '../../constants';

export interface PhaseConfig {
  hpThreshold: number;   // Enter this phase when HP drops to this % (0–1)
  speedMult: number;     // Multiplier applied to movement speed
  auraColor?: number;    // Optional sword-aura tint (hex)
}

/**
 * Boss — abstract base class extending Enemy.
 *
 * Adds phase management: each subclass declares phases[] with HP thresholds.
 * When HP crosses a threshold, currentPhase advances and onPhaseChange() fires.
 *
 * Boss state machine: INTRO → IDLE → APPROACH → TELEGRAPH → ATTACK → RECOVER → (loop)
 * DEAD is inherited from Enemy.
 */
export abstract class Boss extends Enemy {
  protected currentPhase = 0;
  protected abstract readonly phases: PhaseConfig[];
  protected abstract readonly BOSS_NAME: string;

  // Override so boss uses its own state machine setup
  protected bossSpeed = 55;
  protected telegraphDuration = 600; // ms enemy "winds up" before attacking
  protected recoverDuration   = 800; // ms cooldown after attack

  // HP bar elements (fixed on screen)
  private bossHpBg!:   Phaser.GameObjects.Graphics;
  private bossHpFill!: Phaser.GameObjects.Graphics;
  private bossLabel!:  Phaser.GameObjects.Text;

  constructor(scene: StageScene, x: number, y: number) {
    super(scene, x, y);
    this.buildBossHUD();
  }

  protected override init() {
    super.init();
    // Replace the base idle→chase loop with boss-specific states
    this.sm = this.buildBossStateMachine();
    this.sm.transition('intro');
  }

  override update() {
    if (this.isDead) return;
    super.update();
    this.updateBossHUD();
    this.checkPhaseTransition();
  }

  override takeDamage(amount: number, source: Character) {
    super.takeDamage(amount, source);
    this.updateBossHUD();
  }

  // ── Phase management ──────────────────────────────────────────────────────────

  private checkPhaseTransition() {
    const ratio = this.hp / this.MAX_HP;
    const nextPhase = this.currentPhase + 1;
    if (nextPhase < this.phases.length && ratio <= this.phases[nextPhase].hpThreshold) {
      this.currentPhase = nextPhase;
      this.onPhaseChange(nextPhase);
    }
  }

  /** Called when a new phase is entered. Override to add phase-specific effects. */
  protected onPhaseChange(phase: number) {
    this.bossSpeed *= this.phases[phase].speedMult;
    // Flash to signal phase change
    this.scene.cameras.main.flash(300, 255, 255, 255);
    this.scene.cameras.main.shake(400, 0.008);
  }

  // ── Boss state machine ────────────────────────────────────────────────────────

  private buildBossStateMachine(): StateMachine {
    const sm = new StateMachine();

    sm.addState('intro', {
      onEnter: () => {
        // Brief pause before the boss starts moving
        this.scene.time.delayedCall(1200, () => sm.transition('approach'));
      },
    });

    sm.addState('approach', {
      onUpdate: () => this.onApproachUpdate(sm),
    });

    sm.addState('telegraph', {
      onEnter: () => {
        (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
        this.scene.time.delayedCall(this.telegraphDuration, () => sm.transition('attack'));
      },
    });

    sm.addState('attack', {
      onEnter: () => this.onBossAttack(sm),
    });

    sm.addState('recover', {
      onEnter: () => {
        (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
        this.scene.time.delayedCall(this.recoverDuration, () => sm.transition('approach'));
      },
    });

    sm.addState('stagger', {
      onUpdate: () => {
        (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
        if (this.staggerTimer <= 0) sm.transition('approach');
      },
    });

    sm.addState('dead', {
      onEnter: () => this.onDeadEnter(),
    });

    return sm;
  }

  protected onApproachUpdate(sm: StateMachine) {
    const target = this.nearestPlayer();
    if (!target) return;

    const dist = this.distToPlayer(target);
    if (dist <= this.STRIKE_RANGE) {
      sm.transition('telegraph');
      return;
    }

    const dir = target.sprite.x < this.sprite.x ? -1 : 1;
    this.facing = dir as 1 | -1;
    (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocityX(dir * this.bossSpeed);
    this.sprite.setFlipX(dir === 1);
  }

  /** Override in subclass to define the specific attack. */
  protected abstract onBossAttack(sm: StateMachine): void;

  // ── Boss HUD (HP bar, name, fixed on screen) ──────────────────────────────────

  private buildBossHUD() {
    const barW = 200;
    const barH = 8;
    const x = (CANVAS_W - barW) / 2;
    const y = CANVAS_H - 20;

    this.bossHpBg = this.scene.add.graphics().setScrollFactor(0).setDepth(20);
    this.bossHpBg.fillStyle(0x333333, 1);
    this.bossHpBg.fillRect(x, y, barW, barH);
    this.bossHpBg.lineStyle(1, 0x888888, 1);
    this.bossHpBg.strokeRect(x, y, barW, barH);

    this.bossHpFill = this.scene.add.graphics().setScrollFactor(0).setDepth(21);

    this.bossLabel = this.scene.add.text(CANVAS_W / 2, y - 10, this.BOSS_NAME, {
      fontSize: '7px', color: '#ffcc00', fontFamily: 'monospace',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(21);
  }

  private updateBossHUD() {
    const barW = 200;
    const barH = 8;
    const x = (CANVAS_W - barW) / 2;
    const y = CANVAS_H - 20;
    const ratio = Math.max(0, this.hp / this.MAX_HP);

    this.bossHpFill.clear();
    this.bossHpFill.fillStyle(ratio > 0.5 ? 0xff4444 : 0xff8800, 1);
    this.bossHpFill.fillRect(x, y, barW * ratio, barH);
  }

  protected override onDeadEnter() {
    // Hide boss HUD on death
    this.bossHpBg.destroy();
    this.bossHpFill.destroy();
    this.bossLabel.destroy();
    super.onDeadEnter();

    // Delay stage-clear to let death animation play
    this.scene.time.delayedCall(1500, () => this.scene.stageClear());
  }
}

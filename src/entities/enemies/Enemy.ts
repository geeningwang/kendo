import Phaser from 'phaser';
import { StateMachine } from '../../utils/StateMachine';
import { Character } from '../characters/Character';
import { StageScene } from '../../scenes/StageScene';
import { STAGGER_DURATION } from '../../constants';

export type EnemyState = 'idle' | 'chase' | 'attack' | 'stagger' | 'dead';

/**
 * Enemy — abstract base class for all enemies.
 *
 * State machine: IDLE → CHASE → ATTACK → STAGGER → DEAD
 *
 * Subclasses override:
 *   - AGGRO_RANGE, STRIKE_RANGE
 *   - ATTACK_DAMAGE, HP
 *   - doAttack() — defines the attack behaviour
 */
export abstract class Enemy {
  scene: StageScene;
  sprite: Phaser.Physics.Arcade.Sprite;
  bladeZone: Phaser.Physics.Arcade.Image;
  bladeActive = false;

  protected sm: StateMachine;
  protected hp: number;
  protected facing: 1 | -1 = -1; // enemies start facing left (toward player)
  protected staggerTimer = 0;
  protected attackCooldown = 0;

  protected abstract readonly MAX_HP: number;
  protected abstract readonly AGGRO_RANGE: number;
  protected abstract readonly STRIKE_RANGE: number;
  readonly attackDamage: number = 10;

  constructor(scene: StageScene, x: number, y: number) {
    this.scene = scene;
    this.hp = 0; // set after subclass sets MAX_HP

    this.sprite = scene.physics.add.sprite(x, y, '');
    this.sprite.setVisible(false);
    this.buildPlaceholderGraphics();
    this.sprite.setCollideWorldBounds(true);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setSize(22, 38);

    this.bladeZone = scene.physics.add.image(x, y, '') as Phaser.Physics.Arcade.Image;
    this.bladeZone.setVisible(false);
    (this.bladeZone.body as Phaser.Physics.Arcade.Body).setSize(28, 22);
    (this.bladeZone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.bladeZone.setActive(false);

    this.sm = new StateMachine();
    this.sm
      .addState('idle',    { onUpdate: () => this.onIdleUpdate() })
      .addState('chase',   { onUpdate: () => this.onChaseUpdate() })
      .addState('attack',  { onEnter:  () => this.onAttackEnter(), onUpdate: () => this.onAttackUpdate() })
      .addState('stagger', { onUpdate: () => this.onStaggerUpdate() })
      .addState('dead',    { onEnter:  () => this.onDeadEnter() });

    this.sm.transition('idle');
  }

  /** Called after constructor so MAX_HP is defined. */
  protected init() {
    this.hp = this.MAX_HP;
  }

  get isDead(): boolean { return this.sm.is('dead'); }

  update() {
    if (this.isDead) return;

    this.bladeZone.setPosition(
      this.sprite.x + this.facing * 26,
      this.sprite.y,
    );

    this.staggerTimer   -= this.scene.game.loop.delta;
    this.attackCooldown -= this.scene.game.loop.delta;

    this.sm.update();
  }

  takeDamage(amount: number, _source: Character) {
    if (this.isDead) return;

    this.hp -= amount;
    if (this.hp <= 0) {
      this.sm.transition('dead');
    } else {
      this.sm.transition('stagger');
      this.staggerTimer = STAGGER_DURATION;
    }
  }

  protected nearestPlayer(): Character | null {
    if (this.scene.players.length === 0) return null;
    return this.scene.players.reduce((nearest, p) => {
      const dNearest = Math.abs(nearest.sprite.x - this.sprite.x);
      const dCurrent = Math.abs(p.sprite.x - this.sprite.x);
      return dCurrent < dNearest ? p : nearest;
    });
  }

  protected distToPlayer(player: Character): number {
    return Math.abs(player.sprite.x - this.sprite.x);
  }

  // ── State handlers ────────────────────────────────────────────────────────────

  protected onIdleUpdate() {
    const target = this.nearestPlayer();
    if (!target) return;
    if (this.distToPlayer(target) < this.AGGRO_RANGE) {
      this.sm.transition('chase');
    }
  }

  protected onChaseUpdate() {
    const target = this.nearestPlayer();
    if (!target) { this.sm.transition('idle'); return; }

    const dist = this.distToPlayer(target);

    if (dist <= this.STRIKE_RANGE && this.attackCooldown <= 0) {
      this.sm.transition('attack');
      return;
    }

    // Move toward player
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const dir = target.sprite.x < this.sprite.x ? -1 : 1;
    this.facing = dir as 1 | -1;
    body.setVelocityX(dir * 60);
    this.sprite.setFlipX(dir === 1); // enemies face left by default
  }

  protected onAttackEnter() {
    this.doAttack();
  }

  protected onAttackUpdate() {
    // Subclasses handle attack timing; default returns to chase after a beat
  }

  protected doAttack() {
    this.bladeActive = true;
    this.scene.time.delayedCall(120, () => { this.bladeActive = false; });
    this.scene.time.delayedCall(400, () => {
      if (!this.isDead) {
        this.attackCooldown = 1500;
        this.sm.transition('chase');
      }
    });
  }

  protected onStaggerUpdate() {
    (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocityX(0);
    if (this.staggerTimer <= 0) this.sm.transition('chase');
  }

  protected onDeadEnter() {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.setAllowGravity(false);

    this.scene.onEnemyKilled(this);

    // Fade out and destroy
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      duration: 400,
      onComplete: () => {
        this.sprite.destroy();
        this.bladeZone.destroy();
      },
    });
  }

  protected buildPlaceholderGraphics() {
    const gfx = this.scene.add.graphics();
    gfx.fillStyle(0xff4444, 1);
    gfx.fillRect(-11, -19, 22, 38);
    // Head
    gfx.fillStyle(0xffaaaa, 1);
    gfx.fillCircle(0, -26, 8);

    this.scene.events.on('update', () => {
      if (this.sprite.active) {
        gfx.setPosition(this.sprite.x, this.sprite.y);
        gfx.setAlpha(this.sprite.alpha);
      } else {
        gfx.destroy();
      }
    });
  }
}

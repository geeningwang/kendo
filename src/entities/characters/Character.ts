import Phaser from 'phaser';
import { StateMachine } from '../../utils/StateMachine';
import type { ActionMap } from '../../systems/InputManager';
import {
  PLAYER_SPEED, PLAYER_JUMP_VY, MAX_HP, MAX_ENERGY,
  STAGGER_DURATION, BLADE_ACTIVE_MS,
} from '../../constants';

export type CharacterState =
  | 'idle' | 'walk' | 'jump' | 'fall'
  | 'attack1' | 'attack2' | 'attack3'
  | 'heavy' | 'grab' | 'super'
  | 'stagger' | 'guard' | 'dead';

/**
 * Character — abstract base class for all playable characters.
 *
 * Subclasses override:
 *   - normalAttack()  — defines the 3-hit combo chain
 *   - heavyAttack()   — defines the heavy move
 *   - grabAttack()    — defines the grab
 *   - superAttack()   — defines the super (costs energy bars)
 *   - MOVE_DAMAGES    — per-move damage table
 */
export abstract class Character {
  readonly playerIndex: 0 | 1;
  scene: Phaser.Scene;
  sprite: Phaser.Physics.Arcade.Sprite;

  // Stats
  hp: number;
  maxHp: number = MAX_HP;
  energy = 0;
  readonly maxEnergy = MAX_ENERGY;

  // Combat state
  bladeActive = false;
  bladeZone!: Phaser.Physics.Arcade.Image;
  currentMoveDamage = 0;

  protected sm: StateMachine;
  protected facing: 1 | -1 = 1; // 1 = right, -1 = left
  protected onGround = false;
  protected comboStep = 0;
  protected comboResetTimer = 0;
  protected attackTimer = 0;
  protected staggerTimer = 0;

  // Each subclass fills these in
  protected abstract readonly NORMAL_DAMAGE: number[];   // per combo hit
  protected abstract readonly HEAVY_DAMAGE: number;
  protected abstract readonly GRAB_DAMAGE: number;
  protected abstract readonly SUPER_DAMAGE: number;
  protected abstract readonly SUPER_ENERGY_COST: number; // bars (1 or 2)
  protected abstract readonly ATTACK_DURATION: number;   // ms for normal swing

  constructor(scene: Phaser.Scene, x: number, y: number, playerIndex: 0 | 1) {
    this.scene = scene;
    this.playerIndex = playerIndex;
    this.hp = MAX_HP;

    // Main sprite (placeholder rectangle until atlas is ready)
    this.sprite = scene.physics.add.sprite(x, y, '');
    this.sprite.setVisible(false); // hidden until atlas available

    // Colored placeholder rectangle drawn as a Graphics child
    this.buildPlaceholderGraphics();

    this.sprite.setCollideWorldBounds(true);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setSize(24, 40);

    // Blade hitbox (invisible, toggled during attack frames)
    this.bladeZone = scene.physics.add.image(x, y, '') as Phaser.Physics.Arcade.Image;
    this.bladeZone.setVisible(false);
    (this.bladeZone.body as Phaser.Physics.Arcade.Body).setSize(32, 24);
    (this.bladeZone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.bladeZone.setActive(false);

    this.sm = this.buildStateMachine();
    this.sm.transition('idle');
  }

  get isDead(): boolean {
    return this.sm.is('dead');
  }

  // ── Public update, called each frame from StageScene ─────────────────────────
  update(input: ActionMap) {
    this.updateBladeZonePosition();

    if (this.isDead) return;

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    this.onGround = body.blocked.down;

    this.handleInput(input);
    this.sm.update();

    this.comboResetTimer -= this.scene.game.loop.delta;
    if (this.comboResetTimer <= 0) this.comboStep = 0;

    this.attackTimer -= this.scene.game.loop.delta;
    this.staggerTimer -= this.scene.game.loop.delta;
  }

  takeDamage(amount: number) {
    if (this.isDead || this.sm.is('guard')) return;

    this.hp = Math.max(0, this.hp - amount);

    // Notify scene for stats tracking
    const stage = this.scene as import('../../scenes/StageScene').StageScene;
    stage.onPlayerDamaged?.(amount);

    if (this.hp <= 0) {
      this.sm.transition('dead');
    } else {
      this.sm.transition('stagger');
      this.staggerTimer = STAGGER_DURATION;
    }
  }

  addEnergy(amount: number) {
    this.energy = Math.min(this.maxEnergy, this.energy + amount);
  }

  // ── Protected helpers ─────────────────────────────────────────────────────────

  protected handleInput(input: ActionMap) {
    const state = this.sm.state;
    const inAttack = ['attack1','attack2','attack3','heavy','grab','super'].includes(state ?? '');

    if (inAttack || state === 'stagger' || state === 'dead') return;

    // Guard
    if (input.guard && this.onGround) {
      this.sm.transition('guard');
      return;
    }

    // Super
    if (input.superJustDown && this.energy >= this.SUPER_ENERGY_COST) {
      this.energy -= this.SUPER_ENERGY_COST;
      this.sm.transition('super');
      return;
    }

    // Grab
    if (input.grabJustDown && this.onGround) {
      this.sm.transition('grab');
      return;
    }

    // Heavy
    if (input.heavyJustDown) {
      this.sm.transition('heavy');
      return;
    }

    // Normal attack (combo)
    if (input.attackJustDown) {
      const next = `attack${Math.min(this.comboStep + 1, this.NORMAL_DAMAGE.length)}` as CharacterState;
      this.comboStep = Math.min(this.comboStep + 1, this.NORMAL_DAMAGE.length);
      this.comboResetTimer = this.ATTACK_DURATION + 200;
      this.sm.transition(next);
      return;
    }

    // Movement (only when not attacking)
    if (input.jumpJustDown && this.onGround) {
      this.sm.transition('jump');
      (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocityY(PLAYER_JUMP_VY);
    } else if (!this.onGround && !this.sm.is('jump')) {
      this.sm.transition('fall');
    } else if (this.onGround && (input.left || input.right)) {
      this.sm.transition('walk');
    } else if (this.onGround) {
      this.sm.transition('idle');
    }

    // Horizontal movement
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    if (input.left) {
      body.setVelocityX(-PLAYER_SPEED);
      this.facing = -1;
    } else if (input.right) {
      body.setVelocityX(PLAYER_SPEED);
      this.facing = 1;
    } else {
      body.setVelocityX(0);
    }

    this.sprite.setFlipX(this.facing === -1);
  }

  protected startAttack(damage: number) {
    this.currentMoveDamage = damage;
    this.bladeActive = true;
    this.attackTimer = this.ATTACK_DURATION;

    // Disable blade after active window
    this.scene.time.delayedCall(BLADE_ACTIVE_MS, () => {
      this.bladeActive = false;
    });
  }

  protected endAttackState() {
    // Return to idle after attack animation finishes
    this.scene.time.delayedCall(this.ATTACK_DURATION - BLADE_ACTIVE_MS, () => {
      if (!this.isDead) this.sm.transition('idle');
    });
  }

  private updateBladeZonePosition() {
    const offsetX = this.facing * 28;
    this.bladeZone.setPosition(this.sprite.x + offsetX, this.sprite.y);
  }

  private buildPlaceholderGraphics() {
    // Placeholder colored block — replaced once atlas is loaded
    const color = this.playerIndex === 0 ? 0x4488ff : 0xff8844;
    const gfx = this.scene.add.graphics();
    gfx.fillStyle(color, 1);
    gfx.fillRect(-12, -20, 24, 40);

    // Sword indicator
    gfx.fillStyle(0xffffff, 0.8);
    gfx.fillRect(12, -10, 8, 3);

    // Attach to sprite via scene update
    this.scene.events.on('update', () => {
      gfx.setPosition(this.sprite.x, this.sprite.y);
      gfx.setScale(this.facing, 1);
    });
  }

  private buildStateMachine(): StateMachine {
    const sm = new StateMachine();

    sm.addState('idle',  { onEnter: () => this.onIdleEnter() });
    sm.addState('walk',  { onEnter: () => this.onWalkEnter() });
    sm.addState('jump',  { onEnter: () => this.onJumpEnter(), onUpdate: () => this.onJumpUpdate() });
    sm.addState('fall',  {});

    sm.addState('attack1', { onEnter: () => { this.startAttack(this.NORMAL_DAMAGE[0]); this.endAttackState(); } });
    sm.addState('attack2', { onEnter: () => { this.startAttack(this.NORMAL_DAMAGE[1] ?? this.NORMAL_DAMAGE[0]); this.endAttackState(); } });
    sm.addState('attack3', { onEnter: () => { this.startAttack(this.NORMAL_DAMAGE[2] ?? this.NORMAL_DAMAGE[0]); this.endAttackState(); } });

    sm.addState('heavy',   { onEnter: () => this.onHeavyEnter() });
    sm.addState('grab',    { onEnter: () => this.onGrabEnter() });
    sm.addState('super',   { onEnter: () => this.onSuperEnter() });

    sm.addState('guard',   { onUpdate: () => this.onGuardUpdate() });
    sm.addState('stagger', { onUpdate: () => this.onStaggerUpdate() });
    sm.addState('dead',    { onEnter: () => this.onDeadEnter() });

    return sm;
  }

  // ── State callbacks (subclasses can override) ─────────────────────────────────

  protected onIdleEnter() {}
  protected onWalkEnter() {}
  protected onJumpEnter() {}
  protected onJumpUpdate() {
    if (this.onGround) this.sm.transition('idle');
  }

  protected onHeavyEnter() {
    this.startAttack(this.HEAVY_DAMAGE);
    this.scene.time.delayedCall(this.ATTACK_DURATION * 1.5, () => {
      if (!this.isDead) this.sm.transition('idle');
    });
  }

  protected onGrabEnter() {
    this.startAttack(this.GRAB_DAMAGE);
    this.scene.time.delayedCall(this.ATTACK_DURATION * 1.2, () => {
      if (!this.isDead) this.sm.transition('idle');
    });
  }

  protected onSuperEnter() {
    this.startAttack(this.SUPER_DAMAGE);
    this.scene.cameras.main.shake(200, 0.005);
    this.scene.time.delayedCall(this.ATTACK_DURATION * 2, () => {
      if (!this.isDead) this.sm.transition('idle');
    });
  }

  protected onGuardUpdate() {
    // Guard breaks if no guard input — handled in handleInput
  }

  protected onStaggerUpdate() {
    if (this.staggerTimer <= 0) this.sm.transition('idle');
  }

  protected onDeadEnter() {
    (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
  }
}

import Phaser from 'phaser';
import { SCENE, CANVAS_W, CANVAS_H, WORLD_WIDTH, STAGE_COUNT } from '../constants';
import { InputManager } from '../systems/InputManager';
import { WaveManager }  from '../systems/WaveManager';
import { HUD }          from '../systems/HUD';
import { AudioManager } from '../systems/AudioManager';
import { Character }    from '../entities/characters/Character';
import { Chudan }       from '../entities/characters/Chudan';
import { Jodan }        from '../entities/characters/Jodan';
import { Nito }         from '../entities/characters/Nito';
import { Koryu }        from '../entities/characters/Koryu';
import { Enemy }        from '../entities/enemies/Enemy';
import { stageConfigs } from '../data/stages';

export interface StageSceneData {
  stageIndex: number;
  p1Char: string;
  p2Char: string | null;
}

export class StageScene extends Phaser.Scene {
  // Public so systems/entities can reference them
  input_manager!: InputManager;
  hud!: HUD;
  players: Character[] = [];
  enemies: Enemy[] = [];
  stageIndex = 0; // public — read by WaveManager for boss selection
  private waveManager!: WaveManager;
  private startTime = 0;
  private totalDamageTaken = 0;
  private killCount = 0;

  constructor() {
    super({ key: SCENE.STAGE });
  }

  init(data: StageSceneData) {
    this.stageIndex = data?.stageIndex ?? 0;
    this.players = [];
    this.enemies = [];
    this.killCount = 0;
    this.totalDamageTaken = 0;
  }

  create(data: StageSceneData) {
    const config = stageConfigs[this.stageIndex];

    // ── World bounds ──────────────────────────────────────────────────────────
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, CANVAS_H);

    // ── Background (placeholder colored rectangle) ────────────────────────────
    const bg = this.add.graphics();
    bg.fillStyle(config.bgColor, 1);
    bg.fillRect(0, 0, WORLD_WIDTH, CANVAS_H);
    bg.setScrollFactor(0.3); // parallax

    // Ground
    const ground = this.add.graphics();
    ground.fillStyle(config.groundColor, 1);
    ground.fillRect(0, CANVAS_H - 32, WORLD_WIDTH, 32);

    // Static ground platform for physics
    const groundGroup = this.physics.add.staticGroup();
    const groundBody = groundGroup.create(WORLD_WIDTH / 2, CANVAS_H - 16, undefined) as Phaser.Physics.Arcade.Sprite;
    groundBody.setVisible(false);
    (groundBody.body as Phaser.Physics.Arcade.StaticBody).setSize(WORLD_WIDTH, 32);

    // ── Input ─────────────────────────────────────────────────────────────────
    this.input_manager = new InputManager(this);

    // ── Players ───────────────────────────────────────────────────────────────
    const p1 = this.createCharacter(data?.p1Char ?? 'chudan', 80, CANVAS_H - 60, 0);
    this.physics.add.collider(p1.sprite, groundGroup);
    this.players.push(p1);

    if (data?.p2Char) {
      const p2 = this.createCharacter(data.p2Char, 140, CANVAS_H - 60, 1);
      this.physics.add.collider(p2.sprite, groundGroup);
      this.players.push(p2);
    }

    // ── HUD ───────────────────────────────────────────────────────────────────
    this.hud = new HUD(this, this.players);

    // ── Camera ────────────────────────────────────────────────────────────────
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, CANVAS_H);
    this.cameras.main.startFollow(this.players[0].sprite, true, 0.1, 0.1);

    // ── Wave manager ─────────────────────────────────────────────────────────
    this.waveManager = new WaveManager(this, config, groundGroup);

    // ── Audio ─────────────────────────────────────────────────────────────────
    // AudioManager.playBgm(this, config.bgmKey);

    // ── Stage HUD label ───────────────────────────────────────────────────────
    const stageLabel = this.add.text(CANVAS_W / 2, 12, config.name, {
      fontSize: '7px', color: '#ffffff', fontFamily: 'monospace',
    }).setOrigin(0.5).setScrollFactor(0);

    this.tweens.add({
      targets: stageLabel,
      alpha: 0,
      delay: 2000,
      duration: 800,
    });

    this.startTime = this.time.now;
  }

  update(_time: number, _delta: number) {
    this.input_manager.update();

    for (const player of this.players) {
      player.update(this.input_manager.getActions(player.playerIndex));
    }

    for (const enemy of this.enemies) {
      enemy.update();
    }

    this.waveManager.update();
    this.hud.update();

    this.checkBladeCombat();
    this.checkPlayerDeaths();
  }

  /** Register a kill (called by Enemy on death) */
  onEnemyKilled(enemy: Enemy) {
    this.killCount++;
    this.enemies = this.enemies.filter(e => e !== enemy);
    // Fill a bit of energy for the player who scored the kill
    this.players.forEach(p => p.addEnergy(0.25));
  }

  /** Register damage taken by a player (called by Character.takeDamage) */
  onPlayerDamaged(amount: number) {
    this.totalDamageTaken += amount;
  }

  private checkBladeCombat() {
    for (const player of this.players) {
      if (!player.bladeActive) continue;
      for (const enemy of this.enemies) {
        if (this.physics.overlap(player.bladeZone, enemy.sprite)) {
          const dmg = player.currentMoveDamage;
          enemy.takeDamage(dmg, player);
          player.bladeActive = false; // prevent multi-hit per swing
        }
      }
    }

    // Enemy blades vs player bodies
    for (const enemy of this.enemies) {
      if (!enemy.bladeActive) continue;
      for (const player of this.players) {
        if (this.physics.overlap(enemy.bladeZone, player.sprite)) {
          player.takeDamage(enemy.attackDamage);
          enemy.bladeActive = false;
        }
      }
    }
  }

  private checkPlayerDeaths() {
    const allDead = this.players.every(p => p.isDead);
    if (allDead) {
      this.endStage(false);
    }
  }

  stageClear() {
    this.endStage(true);
  }

  private endStage(cleared: boolean) {
    const elapsed = Math.floor((this.time.now - this.startTime) / 1000);
    const nextStage = this.stageIndex + 1;

    AudioManager.stopBgm(this);
    this.scene.start(SCENE.RESULT, {
      cleared,
      stageIndex: this.stageIndex,
      killCount: this.killCount,
      damageTaken: this.totalDamageTaken,
      timeSec: elapsed,
      nextStageIndex: nextStage < STAGE_COUNT ? nextStage : null,
    });
  }

  private createCharacter(key: string, x: number, y: number, playerIndex: 0 | 1): Character {
    switch (key) {
      case 'jodan':  return new Jodan(this, x, y, playerIndex);
      case 'nito':   return new Nito(this, x, y, playerIndex);
      case 'koryu':  return new Koryu(this, x, y, playerIndex);
      default:       return new Chudan(this, x, y, playerIndex);
    }
  }
}

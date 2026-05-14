import Phaser from 'phaser';
import { StageScene } from '../scenes/StageScene';
import type { StageConfig, WaveConfig } from '../data/stages';
import { BasicTrainee }     from '../entities/enemies/BasicTrainee';
import { DefensiveTrainee } from '../entities/enemies/DefensiveTrainee';
import { AgileTrainee }     from '../entities/enemies/AgileTrainee';
import { Enemy } from '../entities/enemies/Enemy';
import { CANVAS_H } from '../constants';

/**
 * WaveManager — reads a stage config and spawns enemy waves on cue.
 * A new wave is triggered when the previous wave is fully defeated.
 */
export class WaveManager {
  private scene: StageScene;
  private config: StageConfig;
  private groundGroup: Phaser.Physics.Arcade.StaticGroup;
  private waveIndex = 0;
  private bossSpawned = false;

  constructor(
    scene: StageScene,
    config: StageConfig,
    groundGroup: Phaser.Physics.Arcade.StaticGroup
  ) {
    this.scene = scene;
    this.config = config;
    this.groundGroup = groundGroup;

    // Spawn first wave immediately
    this.spawnWave();
  }

  update() {
    // Advance to next wave when all enemies in current wave are dead
    if (this.scene.enemies.length === 0 && !this.bossSpawned) {
      const nextWave = this.waveIndex;
      if (nextWave < this.config.waves.length) {
        this.spawnWave();
      } else {
        // All waves clear — spawn boss
        this.spawnBoss();
      }
    }
  }

  private spawnWave() {
    const wave: WaveConfig = this.config.waves[this.waveIndex];
    if (!wave) return;
    this.waveIndex++;

    // Move camera to hint at enemy positions
    const spawnX = this.scene.cameras.main.scrollX + 400;

    wave.enemies.forEach((entry, i) => {
      const x = spawnX + i * 40;
      const y = CANVAS_H - 60;
      const enemy = this.createEnemy(entry.type, x, y);
      if (enemy) {
        this.scene.physics.add.collider(enemy.sprite, this.groundGroup);
        this.scene.enemies.push(enemy);
      }
    });
  }

  private spawnBoss() {
    if (this.bossSpawned) return;
    this.bossSpawned = true;

    // Boss spawning is handled per-stage in future iterations
    // For now, trigger stage clear when all waves are done
    this.scene.stageClear();
  }

  private createEnemy(type: string, x: number, y: number): Enemy | null {
    switch (type) {
      case 'basic_trainee':     return new BasicTrainee(this.scene, x, y);
      case 'defensive_trainee': return new DefensiveTrainee(this.scene, x, y);
      case 'agile_trainee':     return new AgileTrainee(this.scene, x, y);
      default:
        console.warn(`WaveManager: unknown enemy type "${type}"`);
        return null;
    }
  }
}

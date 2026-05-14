import Phaser from 'phaser';
import { CANVAS_W, CANVAS_H, MAX_HP, MAX_ENERGY } from '../constants';
import { Character } from '../entities/characters/Character';

/**
 * HUD — renders HP bars, energy gauge, score, and lives.
 * All elements use setScrollFactor(0) so they stay fixed on screen.
 */
export class HUD {
  private scene: Phaser.Scene;
  private players: Character[];
  private hpBars: Phaser.GameObjects.Graphics[] = [];
  private energyBars: Phaser.GameObjects.Graphics[] = [];
  private hpTexts: Phaser.GameObjects.Text[] = [];
  private scoreText!: Phaser.GameObjects.Text;

  private score = 0;

  constructor(scene: Phaser.Scene, players: Character[]) {
    this.scene = scene;
    this.players = players;

    this.buildHUD();
  }

  update() {
    this.players.forEach((player, i) => {
      this.drawHpBar(i, player.hp, player.maxHp);
      this.drawEnergyBar(i, player.energy, MAX_ENERGY);
    });
  }

  addScore(points: number) {
    this.score += points;
    this.scoreText.setText(`SCORE ${this.score.toString().padStart(7, '0')}`);
  }

  private buildHUD() {
    const barW = 80;
    const barH = 6;
    const pad = 4;

    this.players.forEach((_, i) => {
      const xBase = i === 0 ? pad : CANVAS_W - pad - barW;

      // Name label
      this.scene.add.text(xBase, pad, `P${i + 1}`, {
        fontSize: '6px', color: '#ffffff', fontFamily: 'monospace',
      }).setScrollFactor(0).setDepth(10);

      // HP bar background
      const hpBg = this.scene.add.graphics().setScrollFactor(0).setDepth(10);
      hpBg.fillStyle(0x333333, 1);
      hpBg.fillRect(xBase, pad + 8, barW, barH);

      // HP bar fill
      const hpBar = this.scene.add.graphics().setScrollFactor(0).setDepth(11);
      this.hpBars.push(hpBar);

      // HP text
      const hpTxt = this.scene.add.text(xBase + barW + 3, pad + 8, '', {
        fontSize: '5px', color: '#ffffff', fontFamily: 'monospace',
      }).setScrollFactor(0).setDepth(11);
      this.hpTexts.push(hpTxt);

      // Energy bar background
      const enBg = this.scene.add.graphics().setScrollFactor(0).setDepth(10);
      enBg.fillStyle(0x222244, 1);
      enBg.fillRect(xBase, pad + 18, barW, barH - 2);

      // Energy bar fill
      const enBar = this.scene.add.graphics().setScrollFactor(0).setDepth(11);
      this.energyBars.push(enBar);

      // Draw initial state
      this.drawHpBar(i, MAX_HP, MAX_HP);
      this.drawEnergyBar(i, 0, MAX_ENERGY);
    });

    // Score (center top)
    this.scoreText = this.scene.add.text(CANVAS_W / 2, pad, 'SCORE 0000000', {
      fontSize: '6px', color: '#ffcc00', fontFamily: 'monospace',
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(10);

    // Stage progress hint (bottom)
    this.scene.add.text(CANVAS_W / 2, CANVAS_H - 8, 'WASD: move  J: attack  K: heavy  I: jump  U: super  H: guard', {
      fontSize: '5px', color: '#555555', fontFamily: 'monospace',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(10);
  }

  private drawHpBar(i: number, hp: number, maxHp: number) {
    const barW = 80;
    const barH = 6;
    const pad = 4;
    const xBase = i === 0 ? pad : CANVAS_W - pad - barW;
    const ratio = Math.max(0, hp / maxHp);

    const color = ratio > 0.5 ? 0x44ff44 : ratio > 0.25 ? 0xffaa00 : 0xff2222;

    const bar = this.hpBars[i];
    bar.clear();
    bar.fillStyle(color, 1);
    bar.fillRect(xBase, pad + 8, barW * ratio, barH);

    this.hpTexts[i].setText(`${hp}`);
  }

  private drawEnergyBar(i: number, energy: number, maxEnergy: number) {
    const barW = 80;
    const barH = 4;
    const pad = 4;
    const xBase = i === 0 ? pad : CANVAS_W - pad - barW;
    const ratio = Math.max(0, energy / maxEnergy);

    const bar = this.energyBars[i];
    bar.clear();
    bar.fillStyle(0x4488ff, 1);
    bar.fillRect(xBase, pad + 18, barW * ratio, barH);

    // Segment divider at 50%
    bar.lineStyle(1, 0x000000, 0.5);
    bar.lineBetween(xBase + barW / 2, pad + 18, xBase + barW / 2, pad + 18 + barH);
  }
}

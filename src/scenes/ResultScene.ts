import Phaser from 'phaser';
import { SCENE, CANVAS_W } from '../constants';
import { SaveManager } from '../systems/SaveManager';

export interface ResultSceneData {
  cleared: boolean;
  stageIndex: number;
  killCount: number;
  damageTaken: number;
  timeSec: number;
  nextStageIndex: number | null;
}

export class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE.RESULT });
  }

  create(data: ResultSceneData) {
    const cx = CANVAS_W / 2;
    let y = 30;

    const title = data.cleared ? 'STAGE CLEAR!' : 'GAME OVER';
    const titleColor = data.cleared ? '#ffff00' : '#ff4444';

    this.add.text(cx, y, title, {
      fontSize: '16px', color: titleColor, fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5);
    y += 30;

    if (data.cleared) {
      const rating = this.calcRating(data);

      this.add.text(cx, y, `KILLS: ${data.killCount}`, {
        fontSize: '8px', color: '#ffffff', fontFamily: 'monospace',
      }).setOrigin(0.5);
      y += 14;

      this.add.text(cx, y, `DAMAGE TAKEN: ${data.damageTaken}`, {
        fontSize: '8px', color: '#ffffff', fontFamily: 'monospace',
      }).setOrigin(0.5);
      y += 14;

      const mins = Math.floor(data.timeSec / 60);
      const secs = data.timeSec % 60;
      this.add.text(cx, y, `TIME: ${mins}:${secs.toString().padStart(2, '0')}`, {
        fontSize: '8px', color: '#ffffff', fontFamily: 'monospace',
      }).setOrigin(0.5);
      y += 20;

      const ratingColors: Record<string, string> = {
        S: '#ffcc00', A: '#ffffff', B: '#88ff88', C: '#8888ff', D: '#888888',
      };
      this.add.text(cx, y, `RATING: ${rating}`, {
        fontSize: '20px',
        color: ratingColors[rating] ?? '#ffffff',
        fontFamily: 'monospace',
        stroke: '#000000',
        strokeThickness: 2,
      }).setOrigin(0.5);
      y += 28;

      // Save rating
      const saved = SaveManager.getRatings();
      const key = `stage${data.stageIndex}`;
      const prev = saved[key];
      const rankOrder = ['D', 'C', 'B', 'A', 'S'];
      if (!prev || rankOrder.indexOf(rating) > rankOrder.indexOf(prev)) {
        saved[key] = rating;
        SaveManager.setRatings(saved);
      }
    }

    // ── Continue / Retry ─────────────────────────────────────────────────────
    if (data.cleared && data.nextStageIndex !== null) {
      const nextBtn = this.add.text(cx, y, '▶ NEXT STAGE', {
        fontSize: '8px', color: '#44ff88', fontFamily: 'monospace',
        backgroundColor: '#003300', padding: { x: 8, y: 4 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      nextBtn.on('pointerdown', () => {
        this.scene.start(SCENE.SELECT, { stageIndex: data.nextStageIndex });
      });
      y += 24;
    }

    const retryBtn = this.add.text(cx, y, '↺ RETRY', {
      fontSize: '8px', color: '#ffff44', fontFamily: 'monospace',
      backgroundColor: '#333300', padding: { x: 8, y: 4 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    retryBtn.on('pointerdown', () => {
      this.scene.start(SCENE.SELECT, { stageIndex: data.stageIndex });
    });
    y += 24;

    const menuBtn = this.add.text(cx, y, '⌂ TITLE', {
      fontSize: '8px', color: '#aaaaaa', fontFamily: 'monospace',
      backgroundColor: '#222222', padding: { x: 8, y: 4 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menuBtn.on('pointerdown', () => {
      this.scene.start(SCENE.TITLE);
    });

    // Keyboard shortcut
    this.input.keyboard!.once('keydown-ENTER', () => {
      if (data.cleared && data.nextStageIndex !== null) {
        this.scene.start(SCENE.SELECT, { stageIndex: data.nextStageIndex });
      } else {
        this.scene.start(SCENE.SELECT, { stageIndex: data.stageIndex });
      }
    });
  }

  private calcRating(data: ResultSceneData): string {
    let score = 100;
    score -= Math.floor(data.damageTaken / 5);
    score -= Math.max(0, data.timeSec - 120) / 10;
    score += data.killCount * 2;

    if (score >= 90) return 'S';
    if (score >= 75) return 'A';
    if (score >= 55) return 'B';
    if (score >= 35) return 'C';
    return 'D';
  }
}

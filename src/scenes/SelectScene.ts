import Phaser from 'phaser';
import { SCENE, CANVAS_W, CANVAS_H, SAVE_KEY } from '../constants';
import { SaveManager } from '../systems/SaveManager';

export interface SelectSceneData {
  stageIndex?: number; // which stage to play next (0-based); defaults to 0
}

interface CharacterInfo {
  key: string;
  name: string;
  subtitle: string;
  color: number;
  locked: boolean;
}

const CHARACTERS: CharacterInfo[] = [
  { key: 'chudan', name: 'CHŪDAN',   subtitle: 'Balanced',  color: 0x4488ff, locked: false },
  { key: 'jodan',  name: 'JŌDAN',    subtitle: 'Aggressive', color: 0xff4444, locked: false },
  { key: 'nito',   name: 'NITŌ-RYŪ', subtitle: 'Agile',     color: 0x44ff88, locked: false },
  { key: 'koryu',  name: 'KORYŪ',    subtitle: 'Counter',   color: 0xffcc00, locked: true  },
];

export class SelectScene extends Phaser.Scene {
  private selected = 0;
  private stageIndex = 0;
  private p1Char = 0;
  private cards: Phaser.GameObjects.Container[] = [];

  constructor() {
    super({ key: SCENE.SELECT });
  }

  init(data: SelectSceneData) {
    this.stageIndex = data?.stageIndex ?? 0;
    this.selected = 0;

    // Unlock Koryū if save flag is set
    const koryuUnlocked = SaveManager.get(SAVE_KEY.UNLOCKED_KORYU) === 'true';
    CHARACTERS[3].locked = !koryuUnlocked;
  }

  create() {
    const cx = CANVAS_W / 2;

    this.add.text(cx, 16, `STAGE ${this.stageIndex + 1} — SELECT CHARACTER`, {
      fontSize: '8px', color: '#ffffff', fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Build character cards
    const cardW = 80;
    const cardH = 100;
    const spacing = 10;
    const totalW = CHARACTERS.length * cardW + (CHARACTERS.length - 1) * spacing;
    const startX = (CANVAS_W - totalW) / 2;

    CHARACTERS.forEach((char, i) => {
      const x = startX + i * (cardW + spacing) + cardW / 2;
      const y = CANVAS_H / 2;
      const container = this.createCard(x, y, cardW, cardH, char);
      this.cards.push(container);
    });

    this.add.text(cx, CANVAS_H - 20, 'LEFT/RIGHT to select  |  J to confirm  |  P2: Numpad 1', {
      fontSize: '6px', color: '#888888', fontFamily: 'monospace',
    }).setOrigin(0.5);

    this.input.keyboard!.on('keydown-J', () => this.confirm());
    this.input.keyboard!.on('keydown-LEFT',  () => this.move(-1));
    this.input.keyboard!.on('keydown-RIGHT', () => this.move(1));

    this.updateCards();
  }

  private createCard(
    x: number, y: number, w: number, h: number, char: CharacterInfo
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    bg.fillStyle(char.locked ? 0x333333 : char.color, char.locked ? 0.3 : 0.4);
    bg.fillRect(-w / 2, -h / 2, w, h);
    bg.lineStyle(2, char.locked ? 0x555555 : char.color, 1);
    bg.strokeRect(-w / 2, -h / 2, w, h);

    const name = this.add.text(0, -h / 2 + 12, char.name, {
      fontSize: '7px', color: char.locked ? '#555555' : '#ffffff', fontFamily: 'monospace',
    }).setOrigin(0.5);

    const sub = this.add.text(0, -h / 2 + 22, char.subtitle, {
      fontSize: '6px', color: char.locked ? '#444444' : '#aaaaaa', fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Placeholder character silhouette
    const silhouette = this.add.graphics();
    silhouette.fillStyle(char.locked ? 0x444444 : char.color, char.locked ? 0.3 : 0.8);
    silhouette.fillRect(-16, -20, 32, 48);

    const lockText = char.locked
      ? this.add.text(0, h / 2 - 14, '🔒 LOCKED', {
          fontSize: '6px', color: '#888888', fontFamily: 'monospace',
        }).setOrigin(0.5)
      : null;

    container.add([bg, name, sub, silhouette, ...(lockText ? [lockText] : [])]);
    return container;
  }

  private move(dir: -1 | 1) {
    let next = this.selected + dir;
    if (next < 0) next = CHARACTERS.length - 1;
    if (next >= CHARACTERS.length) next = 0;
    this.selected = next;
    this.updateCards();
  }

  private confirm() {
    if (CHARACTERS[this.selected].locked) return;
    this.p1Char = this.selected;
    this.scene.start(SCENE.STAGE, {
      stageIndex: this.stageIndex,
      p1Char: CHARACTERS[this.p1Char].key,
      p2Char: null,
    });
  }

  private updateCards() {
    this.cards.forEach((card, i) => {
      const isSelected = i === this.selected;
      card.setScale(isSelected ? 1.08 : 1);
      card.setDepth(isSelected ? 1 : 0);
    });
  }
}

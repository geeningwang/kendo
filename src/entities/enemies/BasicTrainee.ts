import { Enemy } from './Enemy';
import { StageScene } from '../../scenes/StageScene';

/** Basic Trainee — knows only a simple horizontal slash. */
export class BasicTrainee extends Enemy {
  protected readonly MAX_HP     = 30;
  protected readonly AGGRO_RANGE = 200;
  protected readonly STRIKE_RANGE = 40;
  readonly attackDamage = 8;

  constructor(scene: StageScene, x: number, y: number) {
    super(scene, x, y);
    this.init();
  }
}

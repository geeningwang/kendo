import Phaser from 'phaser';

export interface ActionMap {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  attack: boolean;
  heavy: boolean;
  jump: boolean;
  grab: boolean;
  super: boolean;
  guard: boolean;
  // Edge detection — true only on the frame the input was first pressed
  attackJustDown: boolean;
  heavyJustDown:  boolean;
  jumpJustDown:   boolean;
  grabJustDown:   boolean;
  superJustDown:  boolean;
  guardJustDown:  boolean;
}

const EMPTY_MAP: ActionMap = {
  left: false, right: false, up: false, down: false,
  attack: false, heavy: false, jump: false, grab: false, super: false, guard: false,
  attackJustDown: false, heavyJustDown: false, jumpJustDown: false,
  grabJustDown: false, superJustDown: false, guardJustDown: false,
};

// Gamepad button indices (standard mapping)
const GP = {
  A: 0,  // normal attack
  X: 2,  // heavy
  B: 1,  // jump
  Y: 3,  // grab
  RB: 5, // super
  LB: 4, // guard
};

// Axis threshold for D-pad as axes
const AXIS_THRESHOLD = 0.5;

export class InputManager {
  private keys: Record<string, Phaser.Input.Keyboard.Key> = {};
  private prev: [ActionMap, ActionMap] = [{ ...EMPTY_MAP }, { ...EMPTY_MAP }];
  private curr: [ActionMap, ActionMap] = [{ ...EMPTY_MAP }, { ...EMPTY_MAP }];

  constructor(scene: Phaser.Scene) {
    // P1: WASD + JKLIUH
    const kb = scene.input.keyboard!;
    this.keys = kb.addKeys({
      // P1 move
      p1Left: 'A', p1Right: 'D', p1Up: 'W', p1Down: 'S',
      // P1 actions
      p1Attack: 'J', p1Heavy: 'K', p1Jump: 'I', p1Grab: 'L',
      p1Super: 'U', p1Guard: 'H',
      // P2 move
      p2Left: 'LEFT', p2Right: 'RIGHT', p2Up: 'UP', p2Down: 'DOWN',
      // P2 actions (numpad)
      p2Attack: 'NUMPAD_ONE',  p2Heavy: 'NUMPAD_TWO',
      p2Jump:   'NUMPAD_FIVE', p2Grab:  'NUMPAD_THREE',
      p2Super:  'NUMPAD_ZERO', p2Guard: 'NUMPAD_FOUR',
    }) as Record<string, Phaser.Input.Keyboard.Key>;
  }

  update() {
    // Store previous frame state for edge detection
    this.prev[0] = { ...this.curr[0] };
    this.prev[1] = { ...this.curr[1] };

    this.curr[0] = this.readKeyboard(0);
    this.curr[1] = this.readKeyboard(1);

    // Merge gamepad inputs (gamepad wins over keyboard for same player)
    const gamepads = navigator.getGamepads();
    if (gamepads[0]) this.mergeGamepad(gamepads[0], 0);
    if (gamepads[1]) this.mergeGamepad(gamepads[1], 1);

    // Compute just-down edges
    this.applyEdges(0);
    this.applyEdges(1);
  }

  getActions(playerIndex: 0 | 1): ActionMap {
    return this.curr[playerIndex];
  }

  private readKeyboard(p: 0 | 1): ActionMap {
    const prefix = p === 0 ? 'p1' : 'p2';
    const k = this.keys;
    const down = (key: Phaser.Input.Keyboard.Key) => key?.isDown ?? false;

    return {
      left:  down(k[`${prefix}Left`]),
      right: down(k[`${prefix}Right`]),
      up:    down(k[`${prefix}Up`]),
      down:  down(k[`${prefix}Down`]),
      attack: down(k[`${prefix}Attack`]),
      heavy:  down(k[`${prefix}Heavy`]),
      jump:   down(k[`${prefix}Jump`]),
      grab:   down(k[`${prefix}Grab`]),
      super:  down(k[`${prefix}Super`]),
      guard:  down(k[`${prefix}Guard`]),
      // Edge fields filled in applyEdges()
      attackJustDown: false, heavyJustDown: false, jumpJustDown: false,
      grabJustDown: false,   superJustDown: false,  guardJustDown: false,
    };
  }

  private mergeGamepad(gp: Gamepad, p: 0 | 1) {
    const b = (idx: number) => gp.buttons[idx]?.pressed ?? false;
    const ax = gp.axes;

    // D-pad: prefer buttons 12-15; fall back to axes 0/1
    const left  = b(14) || (ax[0] ?? 0) < -AXIS_THRESHOLD;
    const right = b(15) || (ax[0] ?? 0) >  AXIS_THRESHOLD;
    const up    = b(12) || (ax[1] ?? 0) < -AXIS_THRESHOLD;
    const down  = b(13) || (ax[1] ?? 0) >  AXIS_THRESHOLD;

    const c = this.curr[p];
    c.left   = c.left   || left;
    c.right  = c.right  || right;
    c.up     = c.up     || up;
    c.down   = c.down   || down;
    c.attack = c.attack || b(GP.A);
    c.heavy  = c.heavy  || b(GP.X);
    c.jump   = c.jump   || b(GP.B);
    c.grab   = c.grab   || b(GP.Y);
    c.super  = c.super  || b(GP.RB);
    c.guard  = c.guard  || b(GP.LB);
  }

  private applyEdges(p: 0 | 1) {
    const c = this.curr[p];
    const v = this.prev[p];
    c.attackJustDown = c.attack && !v.attack;
    c.heavyJustDown  = c.heavy  && !v.heavy;
    c.jumpJustDown   = c.jump   && !v.jump;
    c.grabJustDown   = c.grab   && !v.grab;
    c.superJustDown  = c.super  && !v.super;
    c.guardJustDown  = c.guard  && !v.guard;
  }
}

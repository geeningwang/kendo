export type StateConfig = {
  onEnter?: () => void;
  onUpdate?: () => void;
  onExit?: () => void;
};

/**
 * Generic finite state machine used by Character, Enemy, and Boss classes.
 * Each instance owns its own StateMachine.
 */
export class StateMachine {
  private states = new Map<string, StateConfig>();
  private current: string | null = null;
  private next: string | null = null;

  addState(name: string, config: StateConfig): this {
    this.states.set(name, config);
    return this;
  }

  transition(newState: string) {
    if (!this.states.has(newState)) {
      console.warn(`StateMachine: unknown state "${newState}"`);
      return;
    }
    this.next = newState;
  }

  /** Call once per frame inside the entity's update(). */
  update() {
    // Handle deferred transition
    if (this.next !== null) {
      const exiting = this.current ? this.states.get(this.current) : null;
      exiting?.onExit?.();

      this.current = this.next;
      this.next = null;

      const entering = this.states.get(this.current)!;
      entering.onEnter?.();
    }

    const current = this.current ? this.states.get(this.current) : null;
    current?.onUpdate?.();
  }

  get state(): string | null {
    return this.current;
  }

  is(name: string): boolean {
    return this.current === name;
  }
}

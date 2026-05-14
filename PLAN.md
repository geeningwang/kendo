# Kendo-Themed Beat 'em Up — Web Front-End Implementation Plan

**Core Vision**: Capture the beat 'em up feel of *Teenage Mutant Ninja Turtles: Shredder's Revenge*, with kendo as the central combat system.  
4 playable characters (3 standard + 1 hidden), 4 escalating stages (each tied to a real kendo tournament tier), retro 16-bit pixel arcade style, single-player / local co-op, emphasizing the satisfying impact and ritual of kendo strikes.

**Platform**: Browser-only, front-end static web app — no backend, no server, no installation required.

---

## I. Core Design

### 1. Characters (4 total)

**Design Principle**: Each character has a distinct move set, feel, and role rooted in a different kendo style — mirroring Shredder's Revenge's character differentiation. Works for solo players adapting to different play styles and for co-op partners complementing each other.

---

#### Standard Character 1 — Chūdan (Balanced, Beginner-Friendly)

- **Style**: The most fundamental and versatile kendo stance. Balanced offense and defense, smooth animations, high margin for error.
- **Move Set**:
  - Normal 3-hit combo: horizontal slash → vertical slash → thrust
  - Heavy attack: charged horizontal chop, medium range
  - Jump attack: aerial vertical slash
  - Grab: seize the enemy and slam with the scabbard, then push away
  - Super: **Chūdan Chain — Flash Strike** — 3 rapid precise horizontal slashes, costs 1 energy bar
- **Pixel Style**: Standard kendo uniform (white dō-maru, dark hakama), clean sword design, crisp animations — fits the "fundamental style" identity.

---

#### Standard Character 2 — Jōdan (Aggressive, High Damage / Low Margin)

- **Style**: Raised sword, downward cleaves. Large attack range and high damage, but longer wind-up and weak defense.
- **Move Set**:
  - Normal 3-hit combo: high diagonal slash → horizontal slash → heavy chop
  - Heavy attack: charged overhead cleave, launches enemies
  - Jump attack: aerial heavy slam, screen shake on landing
  - Grab: lift the enemy with a threatening overhead hold, then cleave them away
  - Super: **Jōdan Secret — Thunder Cleave** — full-screen overhead slam with screen shake, costs 2 energy bars
- **Pixel Style**: Red trim on the uniform sleeves (marking the offensive type), proud raised-sword posture, faint sword-aura effect during cleaves.

---

#### Standard Character 3 — Nitō-ryū (Agile, Multi-hit)

- **Style**: Dual short blades (kendo kodachi). Fast attacks, high combo count, lower per-hit damage but rapid pressure.
- **Move Set**:
  - Normal 5-hit combo: alternating left/right slashes → cross slash → dual thrust
  - Heavy attack: wide dual sweep, broad range but low damage
  - Jump attack: aerial dual spinning slash
  - Grab: pin the enemy between both blades, rapid cuts, then push away
  - Super: **Nitō-ryū — Raging Dance** — 3-second rapid flurry, player can move during it, costs 1 energy bar
- **Pixel Style**: Light kendo uniform (no chest guard for agility), dual blades, quick animations, afterimage trails during combos.

---

#### Hidden Character — Koryū (Counter-Type, Unlockable, Late-Game Powerhouse)

- **Unlock Condition**: Complete the game 3 times on Normal, or clear all stages without taking damage with any character. Available in character select after unlocking.
- **Style**: Ancient classical kendo. Defense and counter-attack focused, minimal but devastating moves, with a "stagger immunity" trigger mechanic.
- **Move Set**:
  - Normal 2-hit combo: slow heavy slash → thrust, extremely high damage
  - Heavy attack: defensive stance — absorbs a hit and immediately counters, launching the enemy
  - Jump attack: aerial straight thrust, pierces multiple enemies
  - Grab: seize the enemy and strike with the spine of the blade, causing stun
  - Super: **Koryū Secret — No Gap** — enter defensive stance for 3 seconds, immune to all damage; triggers a full-screen counter-strike at the end, costs 2 energy bars
- **Pixel Style**: Dark classical kendo uniform (ancient warrior aesthetic), wide blade, slow but weighty animations, golden sword-aura on counter-strike — extremely recognizable.

---

### 2. Stages (4 total, matching 4 kendo tournament tiers)

**Design Principle**: Each stage environment matches its tournament theme; regular enemies represent "tournament opponents / sparring partners" and the stage boss represents the tournament champion. Mirrors Shredder's Revenge's "stage progression + boss fight" loop, with steadily increasing difficulty and visually distinct settings.

---

#### Stage 1 — Dojo Tournament (Introductory)

- **Setting**: Kendo dojo interior (wooden floors, training targets, rest area). Horizontal scrolling, no complex traps — designed for learning the controls.
- **Enemies (3 types, 2–3 waves)**:
  - Basic Trainee: only knows a simple horizontal slash
  - Defensive Trainee: carries a shield, requires a heavy attack to break guard
  - Agile Trainee: fast movement, only does light thrusts
- **Stage Interactions**:
  - Destroy a training target → drops an energy pickup
  - Pick up a wooden sword from the rest area → temporary damage boost for 5 seconds
- **Stage Boss: Dojo Champion (Chūdan style)**  
  Same moves as Standard Character 1, but higher damage and tighter combos. Exclusive skill: **Dojo Secret — Steady Strike** (3 consecutive mid-level thrusts with stagger). Moderate HP — good introduction to boss-fight rhythm.

---

#### Stage 2 — Open Tournament (Intermediate)

- **Setting**: City kendo tournament arena (spectator stands, competition platform, backstage corridor). Simple hazards: moving platform, falling spotlight props.
- **Enemies (3 types, 3–4 waves including mixed waves)**:
  - Melee Competitor: Jōdan style, high damage
  - Ranged Competitor: throws bamboo swords, attacks from a distance
  - Support Competitor: buffs other enemies' defense — **priority target**
- **Stage Interactions**:
  - Spectator stands → drop energy bottles and health pickups
  - Smash backstage crates → drop weapon pickups
  - Moving platform → cross quickly or get pushed to the screen edge and take damage
- **Stage Boss: Open Tournament Champion (Nitō-ryū style)**  
  Agile and evasive, high combo count. Exclusive skill: **Nitō-ryū — Speed Slash** (rapid dash + multi-hit slashes, hard to dodge). High HP — punish openings after dodging combos.

---

#### Stage 3 — Selection Tournament (Hard)

- **Setting**: National kendo selection arena (large competition platform, judges' table, training wing). More hazards: moving practice posts, slippery floor traps.
- **Enemies (4 types, dense waves including elite enemies)**:
  - Heavy Competitor: carries a heavy sword, wide range, can break guard
  - Agile Elite: Nitō-ryū, extremely fast
  - Ranged Elite: bow and arrow, high fire rate
  - Defensive Elite: large shield — **requires a super to break guard**
- **Stage Interactions**:
  - Judges' table → drops an invincibility pickup (3 seconds)
  - Smash practice posts in the training wing → large energy drops
  - Slippery floor → character slides continuously, must control direction
- **Stage Boss: Selection Champion (Jōdan style)**  
  High damage, high defense, enormous attack range. Exclusive skill: **Jōdan Secret — Sky Cleave** (full-screen overhead slam, must dodge early). Enters Phase 2 below 50% HP (faster attacks, sword aura on all moves). Requires smart use of supers and defense.

---

#### Stage 4 — World Championship (Ultimate)

- **Setting**: World kendo championship venue (grand competition platform, international spectator stands, VIP corridor). Complex hazards: moving platforms, laser traps, timed falling weights.
- **Enemies (4 types, incorporates all previous enemy traits, includes boss-tier enemies)**:  
  International fighters with fully upgraded damage, HP, and attack speed. Boss-tier enemies spawn solo. Dense waves, maximum difficulty.
- **Stage Interactions**:
  - VIP corridor → drops full energy pickup
  - Spectator stands → drops full health pickup
  - Laser traps → cross quickly
  - Timed falling weights → stuns if hit
- **Stage Boss: World Champion (Koryū style)** — The final boss. Balanced offense and defense, moves mirror the hidden character but with superior power, range, and speed. Three phases:
  - **Phase 1**: Standard Koryū moves, mostly defensive with occasional counters
  - **Phase 2** (HP < 70%): Unlocks **Koryū Secret — Formation Break** (wide-range sword aura, lasts 5 seconds)
  - **Phase 3** (HP < 30%): Unlocks **Koryū Secret — Unrivaled** (full-screen one-shot attack — must trigger a block or invincibility pickup in advance)

---

## II. Core Gameplay Systems

### 1. Controls

Keyboard and gamepad are both supported via the [Web Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API).  
Local co-op uses two separate key sets so both players can play on one keyboard, or each player uses their own gamepad.

> ⚠️ **Keyboard ghosting**: Cheap keyboards cannot register more than 2–3 simultaneous key presses. If co-op inputs feel dropped, using gamepads resolves this entirely — it is a hardware limitation, not a software bug.

| Action | Player 1 (keyboard) | Player 2 (keyboard) | Gamepad (both) |
|--------|--------------------|--------------------|----------------|
| Move | WASD | Arrow keys | Left stick / D-pad |
| Normal attack | J | Numpad 1 | Button A (×) |
| Heavy attack | K | Numpad 2 | Button X (□) |
| Jump | I | Numpad 5 | Button B (○) |
| Grab | L | Numpad 3 | Button Y (△) |
| Super | U | Numpad 0 | RB / R1 |
| Guard | H | Numpad 4 | LB / L1 |

### 2. Combat Feel

- **Hit Feedback**: Every slash triggers a crisp sound effect + enemy stagger + subtle screen shake. Heavy attacks and supers have a launch effect + sword aura. Koryū counter-attacks produce a golden light burst.
- **Kendo-Specific Mechanic**: **Blade Clash** — when the player's sword meets an enemy weapon on the same frame, sparks fly and both sides briefly stagger; mash the attack button to win the clash.
- **Energy System**: 2-bar energy gauge. Kills and pickups fill it. 1 bar = basic super; 2 bars = ultimate super (hidden character and boss exclusive).
- **Character Progression**: Clearing stages unlocks **Move Upgrades** (no complex leveling — damage and range improve passively, e.g. Chūdan's super gains an extra slash). The hidden character unlocks with upgrades already applied.

### 3. Supporting Systems

- **Local Co-op**: 2-player simultaneous play. Choose different characters for complementary roles (e.g. Jōdan + Nitō-ryū). Press Guard near your partner to share HP. No friendly fire.
- **Stage Rating**: Each stage scores based on kill count, damage taken, and clear time — grades D through S. S rank unlocks a **hidden item** (e.g. a scabbard that permanently boosts damage).
- **Hidden Content**: One hidden area per stage (e.g. dojo storage room, backstage chamber in Stage 2). Contains rare items and hidden enemies that drop large amounts of energy.
- **UI**: Retro arcade-style HUD (inspired by Shredder's Revenge) — top bar shows HP, energy, and lives; bottom shows score and stage progress. Character select and stage-clear screens use kendo tournament aesthetics (trophies, tournament posters).

---

## III. Production Notes

### 1. Tech Stack

**Recommended framework: [Phaser 3](https://phaser.io/phaser3) — pinned to v3.90 (latest stable)**

> Phaser 4 is in early alpha with incomplete documentation and a changing API — not suitable for a production game project yet. Phaser 3.90 is the correct choice.

Phaser 3 is the most widely used HTML5 2D game framework and is well-suited to beat 'em ups:
- Built-in sprite animation system (frame-based, driven by JSON atlas data)
- Arcade Physics for AABB collision — sufficient for a beat 'em up; no need for Box2D
- Scene manager for title screen, character select, stage, results
- Camera with horizontal follow and world bounds for scrolling stages
- Built-in keyboard input and Web Gamepad API wrapper
- Web Audio API integration with volume control per channel (BGM / SFX)
- WebGL renderer (falls back to Canvas 2D) — handles hundreds of sprites at 60 fps

**Project setup** (already bootstrapped in this repo):
```
npm create vite@latest . -- --template vanilla-ts
npm install phaser@3   # pins to 3.90 — do NOT use plain "phaser" (resolves to Phaser 4)
```
TypeScript is recommended for larger projects; plain JavaScript works fine too.

**Sprite atlases**: Pack all sprites into texture atlases with [TexturePacker](https://www.codeandweb.com/texturepacker) (or the free [Shoebox](https://renderhjs.net/shoebox/)). A single atlas per character drastically reduces draw calls and load time.

**Audio formats**: Export BGM and SFX as both `.ogg` and `.mp3`. Phaser will use OGG on Firefox/Chrome and MP3 as fallback for Safari. Never ship uncompressed `.wav` files — they are 10× larger.

---

### 2. Known Web-Platform Limitations

These are real constraints specific to the browser environment that the design must account for:

| Issue | Impact | Solution |
|-------|--------|----------|
| **Audio autoplay policy** | Browsers block all sound until the first user gesture (click / keypress). BGM cannot start on page load. | Start BGM on the "Press any key" prompt at the title screen — this counts as a user gesture. |
| **Pixel art blurring** | Canvas scales up pixel art with bilinear interpolation by default, making sprites blurry. | Set `ctx.imageSmoothingEnabled = false` and add CSS `image-rendering: pixelated` to the canvas element. Phaser 3 has a `pixelArt: true` config flag that handles both. |
| **Gamepad API is polling-based** | No gamepad button events; must call `navigator.getGamepads()` every frame. D-pad on some controllers reports as axes (−1/+1) rather than buttons. | Poll inside the game loop. Normalize D-pad axes → button-like flags. Test with at least one Xbox and one DualShock/DualSense controller. |
| **Tab focus loss** | When the user switches away, `requestAnimationFrame` pauses. On return, the accumulated delta time causes a single enormous frame that breaks physics and animations. | Clamp delta time to a maximum (e.g. 50 ms / 20 fps minimum) every frame. Phaser does this automatically via its `fps.min` config. |
| **Save data fragility** | No file system access in the browser. `localStorage` is wiped when the user clears browser data or plays in a private/incognito window. Unlock progress is lost. | Use `localStorage` for saves. Clearly inform the player that progress is stored in the browser and may not persist across devices or in private mode. A future backend could add accounts if needed. |
| **Asset download on first load** | All sprites and audio must fully download before the game can start. Large files mean a long wait. | Keep total asset size under ~15 MB. Show a progress bar during the Phaser preload phase. Compress audio aggressively (OGG at 128 kbps for BGM, 64 kbps for SFX). |
| **Mobile / touch** | The game uses keyboard and gamepad. Touch controls for a beat 'em up are very difficult to make feel good. | **Explicitly mark mobile as out of scope for v1.** If needed later, add on-screen buttons as a separate overlay — but expect the experience to feel compromised. |

---

### 3. Pixel Art

- **Tools**: Aseprite (character animations, effects), Piskel (free online, simple backgrounds / props)
- **Asset Sourcing**: Search itch.io for "pixel art kendo" / "pixel beat em up". Download free base assets and customize (e.g. add red trim for Jōdan, add dual blades for Nitō-ryū).
- **Export format**: Export sprite sheets as PNG + JSON (Aseprite can export both at once in TexturePacker/Phaser format). All sprites for one character in one atlas file.
- **Art Priority**: Character animations > Bosses > Enemies > Backgrounds > Effects

| Asset | Requirement |
|-------|-------------|
| Characters | At least 10 animations each (idle / walk / run / jump / normal / heavy / hit / down / super / grab) |
| Bosses | At least 5 animations each (idle / attack / hit / down / super); final boss needs 2 extra phase animations |
| Backgrounds | 4 stage environments, at least 2 parallax layers each (foreground + background) |
| Effects | Hit sparks, sword aura, screen shake, super flash (simple pixel particles are fine) |

### 4. Audio

- **BGM Style**: Retro chiptune fused with traditional kendo instruments (shakuhachi, taiko), escalating by stage:
  - Dojo Tournament: light and relaxed
  - Open Tournament: energetic, fast tempo
  - Selection Tournament: tense and heavy
  - World Championship: grand and powerful
- **SFX**: Core sounds (sword strike, blade clash, enemy hurt, super activation) + secondary sounds (item pickup, UI, stage interactions). Use SFXR / JSFXR to generate base sounds and customize.
- **Free Sources**: itch.io (kendo SFX, retro arcade BGM), Freesound (sword strikes, taiko drums)
- **Export**: BGM as OGG + MP3 (~128 kbps). SFX as OGG + MP3 (~64 kbps). Load both formats and let Phaser pick the right one per browser.

### 5. Development Sequence

Goal: get it **playable** first, then make it **fun**:

1. **Bootstrap**: ~~`npm create vite -- --template vanilla-ts`~~ ✅ Done — Vite + TypeScript scaffolded, Phaser 3.90 installed (`npm install phaser@3`), `vite.config.ts` configured, canvas set to 480×270 with `pixelArt: true` and full-page CSS scaling.
2. **Core Character**: Build Chūdan. Implement movement (WASD), normal attack, heavy attack, jump using Phaser Arcade Physics. Tune hitboxes and collision.
3. **Stage 1 (Dojo Tournament)**: Build the level with a Phaser tilemap or manual platform groups. Add basic enemies with simple AI (chase + attack). Add camera horizontal follow with world bounds.
4. **Boss Fight**: Implement the Dojo Champion with a state machine (idle → approach → attack → recover → repeat). Tune HP and attack windows.
5. **Remaining Characters**: Implement Jōdan, Nitō-ryū, and Koryū one by one; tune differentiation between them.
6. **Remaining Stages**: Build Stages 2–4 in order, add enemies, hazards, and stage interactions; tune wave spawning pacing.
7. **Supporting Systems**: Local co-op (second input map + second player object), energy system, supers, HUD, stage ratings, `localStorage` save for unlocks.
8. **Polish Hit Feel**: Add screen shake (`camera.shake()`), audio (respecting the autoplay policy), particle effects; tune stagger timing and launch arcs.
9. **Test & Bug Fix**: Play through every stage with every character solo and co-op; fix hitbox issues, boss AI edge cases, and gamepad mapping bugs across browsers.
10. **Deploy**: Build with `npm run build` (Vite outputs a static `dist/` folder). Deploy to [GitHub Pages](https://pages.github.com/), [Netlify](https://netlify.com), or [itch.io](https://itch.io) (HTML5 game upload). No server needed.

### 6. Technical Challenges

| Challenge | Approach |
|-----------|----------|
| Kendo hitbox precision | Use separate Phaser physics bodies for "blade" vs. "body" — blade body only active during the attack frames, preventing phantom hits outside the swing |
| Boss AI phases | State machine class per boss: each phase is a named state with its own update logic; transition triggers are HP thresholds |
| Local co-op inputs | Two `Phaser.Input.Keyboard.KeyCombo` / cursor key objects, each bound to separate keys. For gamepads, index 0 and index 1 from `navigator.getGamepads()` |
| Hidden character unlock | On unlock, write a flag to `localStorage`. On title load, read `localStorage` and conditionally show the character in the select screen |
| Pixel-perfect rendering | `game.config.pixelArt = true` in Phaser config; wrap the canvas in a `div` with `width: 100%; height: 100%; display: flex` and use CSS `image-rendering: pixelated` |
| Audio autoplay | Never call `this.sound.play(...)` in `create()`. Gate all audio on a scene transition that follows a user gesture (button click or key press on the title screen) |

---

## IV. Timeline (Solo Developer)

| Phase | Estimate |
|-------|----------|
| Bootstrap + 1 character + Stage 1 (Dojo Tournament) | 1–2 weeks |
| Remaining 3 characters + Stages 2–4 + all bosses | 2–3 weeks |
| Supporting systems (co-op, HUD, saves, hidden content) + polish | 1–2 weeks |
| Testing, bug fixes, deploy | 1 week |
| **Total** | **5–8 weeks** |

> Assumes ~2–3 hours of work per day. Quality over speed.  
> Deployment to GitHub Pages or itch.io takes minutes once the `dist/` build is ready.

---

## V. Customizable Deliverables

The following can be prepared as ready-to-use reference materials:

- [ ] **Skill sheets** for all 4 characters (move parameters, input mappings, damage values)
- [ ] **Boss AI state machine diagrams** (states, transitions, and attack window timing for each boss)
- [ ] **Wave spawn plans** for all stages (enemy types, positions, and counts per wave)
- [ ] **Pixel art style guide** (color palettes and pixel scale for characters, bosses, and backgrounds)
- [ ] **Project folder structure** (Phaser scene files, asset organization, input manager layout)
- [x] **Phaser 3 starter template** (bootstrap code with pixelArt config, canvas scaling, and dual input setup ready to go) — implemented in `src/config.ts`, `src/main.ts`, `vite.config.ts`

---

## VI. Technical Architecture

### 1. Project Folder Structure

```
kendo-game/
├── public/
│   └── assets/
│       ├── atlas/          # Texture atlases (.png + .json) — one per character/enemy set
│       ├── audio/
│       │   ├── bgm/        # BGM tracks (.ogg + .mp3 pairs)
│       │   └── sfx/        # Sound effects (.ogg + .mp3 pairs)
│       ├── tilemaps/       # Stage tilemaps (.json, exported from Tiled)
│       └── ui/             # HUD icons, font sheets, screen overlays
├── src/
│   ├── main.ts             # Vite entry point — instantiates the Phaser game
│   ├── config.ts           # Phaser game config (canvas size, physics, scene list, pixelArt flag)
│   ├── constants.ts        # Shared constants (CANVAS_W, CANVAS_H, GRAVITY, ENERGY_MAX, etc.)
│   ├── scenes/
│   │   ├── BootScene.ts    # Loads minimal assets needed to show the preloader UI
│   │   ├── PreloadScene.ts # Loads all game assets; shows progress bar
│   │   ├── TitleScene.ts   # Title screen; first user gesture unlocks audio
│   │   ├── SelectScene.ts  # Character select; reads localStorage for unlock flags
│   │   ├── StageScene.ts   # Main gameplay scene (re-used across all 4 stages via stage config)
│   │   └── ResultScene.ts  # Stage clear / game over; writes stage rating to localStorage
│   ├── entities/
│   │   ├── characters/
│   │   │   ├── Character.ts    # Abstract base class — movement, jump, attack state machine, hitboxes
│   │   │   ├── Chudan.ts
│   │   │   ├── Jodan.ts
│   │   │   ├── Nito.ts
│   │   │   └── Koryu.ts
│   │   ├── enemies/
│   │   │   ├── Enemy.ts        # Abstract base class — chase AI, attack, stagger, death
│   │   │   ├── BasicTrainee.ts
│   │   │   ├── DefensiveTrainee.ts
│   │   │   └── ...             # One file per enemy type
│   │   └── bosses/
│   │       ├── Boss.ts         # Abstract base class — phase management, HP thresholds, state machine
│   │       ├── DojoChampion.ts
│   │       ├── OpenChampion.ts
│   │       ├── SelectionChampion.ts
│   │       └── WorldChampion.ts
│   ├── systems/
│   │   ├── InputManager.ts     # Unifies keyboard + gamepad polling; exposes a per-player action map
│   │   ├── HUD.ts              # Renders HP bars, energy gauge, score, lives — updated via events
│   │   ├── WaveManager.ts      # Reads wave config for the current stage; spawns enemies on cue
│   │   ├── SaveManager.ts      # localStorage read/write wrapper (unlocks, ratings, items)
│   │   └── AudioManager.ts     # Wraps Phaser sound; enforces the user-gesture gate for BGM
│   ├── data/
│   │   ├── stages/
│   │   │   ├── stage1.ts   # Wave definitions, enemy placements, hazard positions, boss key
│   │   │   ├── stage2.ts
│   │   │   ├── stage3.ts
│   │   │   └── stage4.ts
│   │   └── characters.ts   # Static move data (damage values, hitbox sizes, frame windows)
│   └── utils/
│       ├── StateMachine.ts # Generic finite state machine used by characters, enemies, and bosses
│       └── math.ts         # Clamp, lerp, randomInt helpers
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

### 2. Scene Architecture

| Scene | Responsibility | Transitions |
|-------|---------------|-------------|
| `BootScene` | Loads the progress bar sprite and font only | → `PreloadScene` immediately |
| `PreloadScene` | Loads all atlases, tilemaps, audio; shows progress bar | → `TitleScene` on complete |
| `TitleScene` | Displays title, handles the first user gesture to unlock audio, plays title BGM | → `SelectScene` on any key/button |
| `SelectScene` | Renders character portraits, reads `localStorage` for hidden character flag, confirms selection | → `StageScene` with `{ stageIndex, p1Char, p2Char }` in scene data |
| `StageScene` | All gameplay: spawns stage, enemies, boss; runs game loop; emits `stage-clear` or `game-over` | → `ResultScene` with rating data |
| `ResultScene` | Calculates and displays D–S rating, writes to `localStorage`, shows unlocked items | → `SelectScene` (next stage) or `TitleScene` |

**Key rule**: `StageScene` is the only scene that runs gameplay. It reads a stage config object (`stage1.ts` … `stage4.ts`) at `create()` time. Switching stages means restarting `StageScene` with different data — no duplicate scene classes.

---

### 3. Core Class Hierarchy

#### Character (base)

```
Character extends Phaser.GameObjects.Container
├── Properties: hp, maxHp, energy, maxEnergy, facing, state, onGround
├── Physics body: the character's "body" hitbox (always active)
├── Blade body: separate physics body, active only during attack frames
├── Methods
│   ├── update(input: ActionMap): drives the state machine each frame
│   ├── playAnim(key): plays the named atlas animation, never interrupts a higher-priority state
│   ├── takeDamage(amount, source): applies damage, triggers stagger state, emits 'hurt' event
│   ├── useEnergy(bars): deducts from the energy gauge; returns false if insufficient
│   └── Abstract: normalAttack(), heavyAttack(), jump(), grab(), super()
└── Subclasses override the abstract methods and define their own hitbox sizes/frame windows
```

#### Enemy (base)

```
Enemy extends Phaser.GameObjects.Container
├── State machine states: IDLE → CHASE → ATTACK → STAGGER → DEAD
├── AI update(): chase player if beyond aggroRange; attack if within strikeRange
├── takeDamage(): transitions to STAGGER; transitions to DEAD when hp ≤ 0
└── Subclasses override aggroRange, strikeRange, attackPattern, and animation keys
```

#### Boss (base)

```
Boss extends Enemy
├── phases: PhaseConfig[] — each phase has an HP threshold and its own state machine
├── currentPhase: updated in takeDamage() when HP crosses a threshold
├── Each phase state machine: IDLE → APPROACH → TELEGRAPH → ATTACK → RECOVER → repeat
└── Subclasses define phases[], move sets per phase, and exclusive skill implementations
```

#### StateMachine (generic utility)

```typescript
class StateMachine {
  addState(name: string, config: { onEnter?(); onUpdate?(); onExit?() }): this
  transition(newState: string): void
  update(): void   // calls currentState.onUpdate() each frame
}
```

Used by `Character`, `Enemy`, and `Boss` — each instance owns its own `StateMachine`.

---

### 4. Input Manager Design

`InputManager` abstracts away keyboard vs. gamepad so all character code calls a single `ActionMap`:

```typescript
interface ActionMap {
  left: boolean; right: boolean; up: boolean; down: boolean;
  attack: boolean; heavy: boolean; jump: boolean; grab: boolean;
  super: boolean; guard: boolean;
  // Edge-detection helpers (true only on the frame the key was pressed):
  attackJustDown: boolean; heavyJustDown: boolean; jumpJustDown: boolean;
  grabJustDown: boolean; superJustDown: boolean; guardJustDown: boolean;
}
```

```
InputManager
├── update(): called once per frame before any entity update
│   ├── Reads Phaser keyboard state for P1 (WASD + JKLIUH) and P2 (arrows + numpad)
│   ├── Calls navigator.getGamepads(); maps index 0 → P1, index 1 → P2
│   ├── Normalizes D-pad axes (value < -0.5 → left/up, value > 0.5 → right/down)
│   └── Merges keyboard + gamepad into one ActionMap per player
├── getP1(): ActionMap
└── getP2(): ActionMap
```

Edge-detection (`justDown`) is computed by comparing the current frame's boolean against the previous frame's boolean — no Phaser `JustDown` helper needed.

---

### 5. Phaser Game Config

```typescript
// src/config.ts
import Phaser from 'phaser';
import { BootScene, PreloadScene, TitleScene, SelectScene, StageScene, ResultScene } from './scenes';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,           // WebGL with Canvas fallback
  width: 480,
  height: 270,
  pixelArt: true,              // disables texture smoothing + sets image-rendering: pixelated
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 800 },
      debug: import.meta.env.DEV,   // show hitboxes in dev builds only
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,         // scales canvas to fill the window, maintaining aspect ratio
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  fps: {
    target: 60,
    min: 20,                   // clamps max delta to 50 ms — prevents the tab-focus-loss physics jump
  },
  scene: [BootScene, PreloadScene, TitleScene, SelectScene, StageScene, ResultScene],
};
```

```typescript
// src/main.ts
import Phaser from 'phaser';
import { gameConfig } from './config';

new Phaser.Game(gameConfig);
```

---

### 6. Hitbox System

Each character and enemy uses **two separate Arcade Physics bodies**:

| Body | Purpose | Active when |
|------|---------|-------------|
| **Body hitbox** | Receives damage from enemy blade bodies | Always |
| **Blade hitbox** | Deals damage to enemy body hitboxes | Only during the attack's active frames |

Implementation approach:
- The blade hitbox is a second `Phaser.Physics.Arcade.Image` (invisible, zero-alpha) parented to the character container.
- `setActive(false) / setActive(true)` toggles it at the start and end of active frames.
- An `Arcade.overlap` check runs each frame between all blade hitboxes and all body hitboxes.
- On overlap: call `target.takeDamage(attacker.currentMoveDamage, attacker)` and immediately disable the blade hitbox to prevent multi-hit on the same swing.

---

### 7. Build & Deploy

**Vite config** (`vite.config.ts`):

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/kendo-game/',   // set to '/' for Netlify/itch.io; set to repo name for GitHub Pages
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,  // never inline assets — keep all files as separate URLs for Phaser's loader
  },
});
```

**Build command**: `npm run build` → outputs static files to `dist/`.

**Deploy targets**:

| Target | Steps |
|--------|-------|
| **GitHub Pages** | Push `dist/` to the `gh-pages` branch (use `gh-pages` npm package: `npx gh-pages -d dist`). Set `base` in `vite.config.ts` to `'/<repo-name>/'`. |
| **Netlify** | Drag-and-drop `dist/` in the Netlify dashboard, or connect the repo and set build command `npm run build`, publish dir `dist`. Set `base` to `'/'`. |
| **itch.io** | Zip the contents of `dist/` (not the folder itself). Upload as HTML5 game. Set the root file to `index.html`. Set `base` to `'/'`. |

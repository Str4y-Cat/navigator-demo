# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Three.js-based 3D web experience project using Vite as the build tool. The project follows an object-oriented architecture with a singleton-based experience manager pattern.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (localhost:8080)
npm run dev

# Build for production
npm run build
```

## Architecture

### Singleton Pattern

The `Experience` class (src/Experiance/Experiance.js) implements a singleton pattern and serves as the central orchestrator. It is globally accessible via `window.experience` and manages all major systems:

- Scene setup (THREE.Scene)
- Camera, Renderer, World
- Resource loading
- Debug tools (enabled with `#debug` hash in URL)
- Event-driven resize and update loops

### Event System

The project uses a custom `EventEmitter` class (src/Experiance/Utils/EventEmitter.js) for event-driven communication:

- Supports namespaced events (e.g., `resize.namespace`)
- Used extensively for resize events, tick/update events, and resource loading
- Pattern: `instance.on('eventName', callback)`, `instance.trigger('eventName', args)`, `instance.off('eventName')`

### Directory Structure

```
src/
├── Experiance/
│   ├── Experiance.js       # Singleton orchestrator
│   ├── Camera.js           # PerspectiveCamera with OrbitControls
│   ├── Renderer.js         # WebGL renderer
│   ├── sources.js          # Asset definitions for loading
│   ├── Utils/
│   │   ├── EventEmitter.js # Custom event system
│   │   ├── Resources.js    # Asset loader (GLTF, textures, cubemaps)
│   │   ├── Sizes.js        # Window sizing and resize handling
│   │   ├── Time.js         # Animation loop timing
│   │   └── Debug.js        # lil-gui debug panel (enabled with #debug)
│   └── World/
│       ├── World.js        # Scene object container
│       ├── Block.js
│       ├── Environment.js
│       ├── Floor.js
│       ├── Fox.js
│       └── Flowers.js
└── script.js               # Entry point
```

### Key Patterns

1. **Singleton Access**: Most classes instantiate `this.experience = new Experience()` to access the singleton and its properties (scene, camera, resources, etc.)

2. **Lifecycle Methods**: Classes typically implement:
   - Constructor for setup
   - `resize()` for responsive handling
   - `update()` for per-frame updates
   - `destroy()` for cleanup (disposing geometries, materials, controls)

3. **Resource Loading**: Assets are defined in `sources.js` as an array of objects with `name`, `type`, and `path`. The `Resources` class loads them and triggers a `ready` event when complete.

4. **Debug Mode**: Add `#debug` to the URL to enable the lil-gui debug panel. Check `this.experience.debug.active` before adding controls.

## Vite Configuration

- Root directory: `src/`
- Static assets: `static/` (accessed from root)
- Output: `dist/`
- Plugins: vite-plugin-glsl (for shader files), vite-plugin-restart (reloads on static file changes)
- Dev server opens automatically and exposes to local network

## ESLint

Configured with basic rules:
- Semicolons required
- Prefer const over let

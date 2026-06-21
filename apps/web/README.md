# organAIzer Web App

This is the mocked Vite + React SPA port for organAIzer. 

## Local Development

1. Install dependencies at the workspace root:
   ```bash
   pnpm install
   ```

2. Start the development server for the web app:
   ```bash
   pnpm --filter @organaizer/web dev
   ```

3. Open the provided local URL (usually `http://localhost:5173`).

## Current State

- Includes a mock state machine: `upload` -> `loading` -> `result` -> `error`.
- Built with React, Tailwind CSS, and Lucide React.
- Matches the prototype design system (`EzFin`) tokens and assets.
- Mobile-first, narrow viewport app centered on desktop screens.

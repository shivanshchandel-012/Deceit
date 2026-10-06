# DECEIT UI / PWA Revamp

Replace the matching files in `apps/web` with this package.

## Vercel
Keep Root Directory as `apps/web`.

Install command:
```bash
cd ../.. && npm ci
```

Build command:
```bash
cd ../.. && npm run build --workspace=@deceit/config && npm run build --workspace=@deceit/game-types && npm run build --workspace=@deceit/game-engine && npm run build --workspace=@deceit/web
```

Output directory:
```text
.next
```

## Multiplayer
Set this Vercel environment variable only after the API is deployed:
```text
NEXT_PUBLIC_WS_URL=https://YOUR-API-DOMAIN
```

The UI intentionally does not connect to localhost when that variable is missing, so a production deployment will no longer spam `ws://localhost:4000` connection errors.

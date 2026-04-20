# Nika's World

A lightweight custom kid app for a cheap tablet.

## What it is
- React + Vite app
- offline-friendly cartoon shelf
- two mini-games
- touch-first layout
- no backend
- no login
- no app store dependency

## Main sections
- Home
- Cartoons
- Games

## How to add local cartoons
### Easy workflow
1. Put source cartoon files in:
   - `C:\Users\HP\Videos\NikaSource`
2. Run:
   - `C:\Users\HP\Desktop\Compress Nika Cartoons.bat`
3. Compressed MP4 files will be written into:
   - `public/videos`

### Current starter file names expected by the app
- `starlight-ride.mp4`
- `magic-garden.mp4`
- `rainbow-pasta-party.mp4`

If your files use different names, edit `src/data/cartoons.js`.

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Tablet use
For the cheap tablet use case, the important rule is to keep video files reasonably sized and encoded in a format the tablet can play well. MP4/H.264 is the safest default.

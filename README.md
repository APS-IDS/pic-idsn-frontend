# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Docker

Production builds are served via Nginx using the files in [Dockerfile](Dockerfile), [.dockerignore](.dockerignore), and [nginx.conf](nginx.conf).

Build the image:

```bash
docker build -t idsn-web .
```

Run the container (maps port 5173 to container port 80):

```bash
docker run --rm -p 5173:80 idsn-web
```

Notes:
- For SPA routing, Nginx falls back to `index.html`.
- If you need environment variables at build time (e.g., `VITE_*`), pass them using `--build-arg` and reference them in your Vite config or `.env` files before the build.

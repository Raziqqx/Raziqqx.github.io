import { defineConfig } from 'astro/config';

// Deployed to the user site repo Raziqqx.github.io, so there is no base path.
export default defineConfig({
  site: 'https://raziqqx.github.io',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});

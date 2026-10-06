import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DECEIT — Secret-Word Imposter Game',
    short_name: 'DECEIT',
    description: 'A real-time social deduction party game.',
    start_url: '/',
    display: 'standalone',
    background_color: '#070708',
    theme_color: '#070708',
    orientation: 'portrait-primary',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}

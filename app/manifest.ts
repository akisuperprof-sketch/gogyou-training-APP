import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: '五行精霊と漢方図鑑',
        short_name: '五行漢方',
        description: '五行と漢方を学ぶ育成ゲーム',
        start_url: '/',
        display: 'standalone',
        background_color: '#1a1a1a',
        theme_color: '#1a1a1a',
        icons: [
            {
                src: '/icon.png', // We don't have this but it's required for PWA valid manifest
                sizes: '192x192',
                type: 'image/png',
            },
        ],
    };
}

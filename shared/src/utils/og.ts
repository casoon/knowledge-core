import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

export interface OgImageOptions {
  title: string;
  description?: string;
  siteName: string;
}

/**
 * Generate a 1200x630 PNG Open Graph image.
 * Uses Satori (HTML→SVG) + resvg (SVG→PNG).
 * Must run in Node.js (not in Cloudflare Workers).
 */
export async function generateOgImage(
  options: OgImageOptions,
  fontData: ArrayBuffer
): Promise<Uint8Array> {
  const { title, description, siteName } = options;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          color: '#f5f5f5',
          fontFamily: 'Inter',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '20px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: title.length > 40 ? 48 : 56,
                      fontWeight: 700,
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                    },
                    children: title,
                  },
                },
                ...(description
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: 24,
                            color: '#a0aec0',
                            lineHeight: 1.5,
                          },
                          children:
                            description.length > 120
                              ? `${description.slice(0, 117)}...`
                              : description,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255,255,255,0.15)',
                paddingTop: '24px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { fontSize: 22, fontWeight: 600 },
                    children: siteName,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { fontSize: 18, color: '#a0aec0' },
                    children: 'Built with Astro v6',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });

  return new Uint8Array(resvg.render().asPng());
}

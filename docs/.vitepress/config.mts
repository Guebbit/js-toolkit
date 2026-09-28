import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
// withMermaid: renders ```mermaid fences as diagrams (the testing guide uses one).
export default withMermaid(
    defineConfig({
        title: '@guebbit/js-toolkit',
        description:
            'Framework-free TypeScript helpers — arrays, strings, numbers, time, formatting, DOM, browser platform — shipped as a dual ESM/CommonJS build.',
        base: '/js-toolkit/',
        themeConfig: {
            // https://vitepress.dev/reference/default-theme-config
            nav: [
                { text: 'Home', link: '/' },
                { text: 'Guide', link: '/guide/getting-started' },
                { text: 'Reference', link: '/api/arrays-and-objects' }
            ],

            sidebar: [
                {
                    text: 'Guide',
                    items: [
                        { text: 'Getting Started', link: '/guide/getting-started' },
                        { text: 'Testing', link: '/guide/testing' }
                    ]
                },
                {
                    text: 'API reference',
                    items: [
                        { text: 'Arrays and objects', link: '/api/arrays-and-objects' },
                        { text: 'Strings', link: '/api/strings' },
                        { text: 'Errors', link: '/api/errors' },
                        { text: 'Numbers and ranges', link: '/api/numbers-and-ranges' },
                        { text: 'Time', link: '/api/time' },
                        { text: 'JSON', link: '/api/json' },
                        { text: 'DOM', link: '/api/dom' },
                        { text: 'Browser platform', link: '/api/browser-platform' },
                        { text: 'Node', link: '/api/node' }
                    ]
                }
            ],

            socialLinks: [{ icon: 'github', link: 'https://github.com/Guebbit/js-toolkit' }]
        }
    })
)

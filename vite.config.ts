import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import { defineConfig } from 'vite';

// Fixes the jwt format in url issue
const dotPathFixPlugin = () => ({
    name: 'dot-path-fix-plugin',
    configureServer: (server) => {
        server.middlewares.use((req, _, next) => {
            const reqPath = req.url.split('?', 2)[0];
            if (
                !req.url.startsWith('/@')
                && !fs.existsSync(`.${reqPath}`)
                && !req.url.startsWith('/api')
            ) {
                req.url = '/';
            }
            next();
        });
    }
});

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        dotPathFixPlugin(),
    ],
    resolve: {
        alias: {
            buffer: 'buffer'
        }
    },
    optimizeDeps: {
        include: ['lodash', 'react-confirm-alert', 'react-dom', 'uuid', '@toast-ui', '@toast-ui/editor/dist/toastui-editor-viewer'],
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis'
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true
                })
            ]
        }
    },
    server: {
        fs: {
            allow: [
                "../desp-ui-fwk",
                "."
            ]
        },
        allowedHosts: ["localhost", "sandbox-ui.local"],
        proxy: {
            '/api/': {
                target: "http://localhost",
                changeOrigin: true,
                secure: false,
                configure: (proxy, _options) => {
                    proxy.on('error', (err, _req, _res) => {
                        console.log('[vite-proxy] Proxy error', err);
                    });
                    proxy.on('proxyReq', (proxyReq, req, _res) => {
                        console.log('[vite-proxy] Sending Request to the Target:', req.method, req.url);
                    });
                    proxy.on('proxyRes', (proxyRes, req, _res) => {
                        console.log('[vite-proxy] Received Response from the Target:', proxyRes.statusCode, req.url);
                    });
                },
            }
        }
    }
})
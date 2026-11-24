import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { createPaymentHandler } from './server/payment-handler.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), viteSingleFile(), {
    name: 'ozkafe-local-payments',
    configureServer(server) {
      const handler = createPaymentHandler({ env: { ...process.env, ...loadEnv(mode, process.cwd(), '') } });
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] === '/api/payments') return handler(req, res);
        next();
      });
    }
  }],
  base: '/',
}))

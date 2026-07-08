import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Configuração do Vite para o projeto React.
 * Define o plugin React e outras configurações do servidor de desenvolvimento.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
})

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // đường dẫn tương đối -> chạy được ở cả username.github.io/<repo>/ lẫn domain riêng
  base: './',
  plugins: [react()],
});

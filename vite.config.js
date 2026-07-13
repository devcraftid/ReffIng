import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        layanan: './layanan.html',
        harga: './harga.html',
        promo: './promo.html',
        tracking: './tracking.html',
        galeri: './galeri.html',
        tentang: './tentang.html',
        faq: './faq.html',
        admin: './admin/index.html',
        adminLogin: './admin/login.html',
        adminService: './admin/service.html',
        adminPengaturan: './admin/pengaturan.html',
        adminLayanan: './admin/layanan.html',
        adminHarga: './admin/harga.html',
        adminPromo: './admin/promo.html',
        adminGaleri: './admin/galeri.html',
        adminFaq: './admin/faq.html',
        adminTestimoni: './admin/testimoni.html',
        adminHistory: './admin/history.html',
        adminStok: './admin/stok.html'
      }
    }
  }
})

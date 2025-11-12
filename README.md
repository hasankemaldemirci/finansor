# Finansör 💼📊

Modern ve akıllı finansal yönetim uygulaması. Oyunlaştırma (gamification) mekaniği ile gelir-gider takibi yapın, tasarruf hedeflerinize ulaşın!

## ✨ Özellikler

### 💰 Finansal Yönetim
- 📊 **Gelir-Gider Takibi**: Kolay ve hızlı işlem ekleme
- ✏️ **İşlem Düzenleme**: Hatalı işlemleri düzeltin
- 🔍 **Gelişmiş Filtreleme**: Tarih, kategori, tutar ve arama
- 📈 **Detaylı İstatistikler**: 
  - Aylık trend grafikleri
  - Kategori bazlı pasta grafikleri
  - Gelir-gider karşılaştırmaları
  - Tasarruf oranı analizi

### 🎮 Gamification
- 🎯 **XP Sistemi**: Her işlem için XP kazanın
- 🏆 **Level Sistemi**: 100 seviye ve özel başlıklar
- 🏅 **Başarılar**: 25+ farklı achievement

### 🎨 Kullanıcı Deneyimi
- 📱 **PWA Desteği**: Mobil cihazlara yüklenebilir
- 🌗 **Dark Mode**: Açık/Koyu tema desteği
- 💎 **Modern UI**: Tailwind CSS + shadcn/ui
- ⚡ **Hızlı**: Vite ile optimize edilmiş build
- 🔒 **Local Storage**: Verileriniz cihazınızda kalır

## 🚀 Teknolojiler

- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Build**: Vite 5
- **PWA**: Vite PWA Plugin
- **Deployment**: Cloudflare Pages

## 📦 Kurulum

### Gereksinimler

- Node.js 20+
- npm veya yarn

### Adımlar

1. Repoyu klonlayın:
```bash
git clone https://github.com/yourusername/finansor.git
cd finansor
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment dosyasını oluşturun:
```bash
cp .env.example .env
```

4. Development server'ı başlatın:
```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

> **Not:** Proje klasörü adı hala `para-oyunu` olabilir, ancak uygulama adı "Finansör"dür.

## 🛠️ Komutlar

```bash
# Development
npm run dev          # Dev server başlat
npm run build        # Production build
npm run preview      # Build'i preview et

# Code Quality
npm run lint         # ESLint kontrolü
npm run format       # Prettier ile formatla
npm run type-check   # TypeScript kontrolü

# Testing
npm run test         # Testleri çalıştır
npm run test:ui      # Test UI'ı aç
```

## 📱 PWA Kullanımı

Uygulama Progressive Web App (PWA) olarak tasarlanmıştır:

1. Chrome/Edge'de siteyi açın
2. Adres çubuğundaki "Yükle" ikonuna tıklayın
3. Uygulama cihazınıza yüklenecektir
4. Artık offline kullanabilirsiniz!

## 🌐 Deployment

### Cloudflare Pages

1. GitHub repository'nizi Cloudflare Pages'e bağlayın
2. Build ayarları:
   - Build command: `npm run build`
   - Build output directory: `dist`
3. Environment variables'ları ekleyin (opsiyonel)
4. Deploy!

### Secrets Ekleme

GitHub Actions için gerekli secrets:

- `CLOUDFLARE_API_TOKEN`: Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID

## 🎮 Kullanım

1. **İşlem Ekleyin**: Gelir veya gider ekleyin
2. **İşlemleri Düzenleyin**: Hatalı işlemleri düzeltin (✏️ butonuna tıklayın)
3. **Filtreleyin ve Arayın**: İşlemlerinizi kolayca bulun
4. **İstatistikleri İnceleyin**: Grafiklerle harcamalarınızı analiz edin
5. **XP Kazanın**: Her işlem için XP kazanın
6. **Seviye Atlayın**: Yeterli XP ile seviye atlayın
7. **Başarıları Kilidi Açın**: 25+ farklı achievement kazanın

## 📂 Proje Yapısı

```
paraoyunu/
├── src/
│   ├── app/                    # App initialization & routing
│   ├── features/               # Feature modules
│   │   ├── transactions/       # Transaction feature
│   │   ├── gamification/       # Gamification feature
│   │   └── settings/           # Settings feature
│   ├── shared/                 # Shared utilities
│   │   ├── components/ui/      # shadcn/ui components
│   │   ├── hooks/              # Custom hooks
│   │   ├── utils/              # Utility functions
│   │   └── types/              # Shared types
│   ├── pages/                  # Page components
│   └── styles/                 # Global styles
├── public/                     # Static assets
└── .github/workflows/          # CI/CD
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👤 Yazar

Hasan Kemal Demirci

## 🙏 Teşekkürler

- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide](https://lucide.dev/) - Icons
- [Framer Motion](https://www.framer.com/motion/) - Animations

---

⭐ Eğer bu projeyi beğendiyseniz yıldız vermeyi unutmayın!

# Finansör 💼📊

Modern ve akıllı finansal yönetim uygulaması. Oyunlaştırma (gamification) mekaniği ile gelir-gider takibi yapın, tasarruf hedeflerinize ulaşın!

## ✨ Özellikler

### 💰 Finansal Yönetim
- 📊 **Gelir-Gider Takibi**: Minimal ve hızlı işlem ekleme formu
- 💱 **Çoklu Para Birimi**: TRY, USD, EUR desteği ve otomatik formatlama
- ✏️ **İşlem Düzenleme**: Hatalı işlemleri düzeltin (kategori & açıklama dahil)
- 🔍 **Gelişmiş Filtreleme**: Tarih, kategori, tutar ve arama
- 📈 **Detaylı İstatistikler**: 
  - Aylık trend grafikleri (line chart)
  - Kategori bazlı pasta grafikleri
  - Gelir-gider karşılaştırmaları (bar chart)
  - Tasarruf oranı analizi

### 🎮 Gamification
- 🎯 **Dengeli XP Sistemi**: Her işlem için sabit XP (15 gelir, 10 gider)
- 🏆 **Level Sistemi**: 100 seviye ve özel başlıklar
- 🏅 **Başarılar**: 25+ farklı achievement
- 🎊 **Animasyonlar**: Seviye atlama ve başarı açma efektleri

### 🎨 Kullanıcı Deneyimi
- 📱 **PWA Desteği**: Mobil cihazlara yüklenebilir
- 🌗 **Dark Mode**: Açık/Koyu tema desteği
- 💎 **Modern UI**: Tailwind CSS + shadcn/ui
- 🎨 **Özel Logo**: HandCoins ikonu ile gradient arka planlı logo
- ⚡ **Hızlı**: Vite ile optimize edilmiş build
- 🔒 **Güvenli Local Storage**: AES-256 şifreleme ile verileriniz korunur
- 🔔 **Akıllı Bildirimler**: 
  - Aylık tasarruf hedefi takibi
  - Kişiselleştirilmiş tasarruf ipuçları
  - Okunmamış bildirim göstergesi
  - Bildirim geçmişi saklama
  - "Tümünü okundu işaretle" özelliği

### 🔐 Güvenlik
- 🔐 **AES-256 Şifreleme**: Tüm veriler otomatik şifrelenir
- 🛡️ **XSS Koruması**: Input sanitization ile güvenli veri girişi
- ✅ **Zod Validation**: Tüm form ve veri doğrulaması
- 🔒 **Content Security Policy**: CSP headers ile güvenlik
- 🔑 **Cihaza Özel Anahtar**: Her cihaz için benzersiz şifreleme anahtarı

## 🚀 Teknolojiler

- **Frontend**: React 18 + TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Currency Input**: react-currency-input-field
- **Build**: Vite 5
- **PWA**: Vite PWA Plugin
- **Security**: crypto-js (AES-256), DOMPurify
- **Testing**: Vitest + Testing Library
- **Deployment**: Cloudflare Pages

## 📦 Kurulum

### Gereksinimler

- Node.js 20+
- npm veya yarn

### Adımlar

1. Repoyu klonlayın:
```bash
git clone https://github.com/hasankemaldemirci/finansor.git
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
npm run test:coverage # Coverage raporu oluştur
npm run test:watch   # Watch mode'da test
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

1. **Hızlı İşlem Ekleyin**: 
   - Gelir/Gider tab'ını seçin
   - Miktarı girin (otomatik formatlanır: 1.000,50 ₺)
   - "İşlem Ekle" butonuna tıklayın
   
2. **İşlemleri Düzenleyin**: 
   - ✏️ butonuna tıklayın
   - Kategori ve açıklama ekleyebilirsiniz
   
3. **Filtreleyin ve Arayın**: 
   - Arama yapın
   - Tarih aralığı seçin
   - Kategori ve tutar filtresi uygulayın
   
4. **İstatistikleri İnceleyin**: 
   - Aylık gelir-gider grafiği
   - Kategori dağılımı (pasta grafiği)
   - Tasarruf oranı analizi
   
5. **XP Kazanın ve Seviye Atlayın**: 
   - Her işlem için dengeli XP kazanın
   - 25+ farklı achievement kilidi açın
   - Özel seviye başlıkları edinin

## 📂 Proje Yapısı

```
finansor/
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

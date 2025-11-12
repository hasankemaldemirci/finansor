# Deployment Rehberi - Finansör

## Cloudflare Pages Deployment

### 1. Gereksinimler

- Cloudflare hesabı
- GitHub repository

### 2. Cloudflare Pages Setup

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages'e gidin
2. "Create a project" → "Connect to Git"
3. GitHub repository'nizi seçin
4. Build ayarları:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`

### 3. GitHub Secrets Ekleme

GitHub Actions otomatik deployment için:

1. GitHub repository → Settings → Secrets and variables → Actions
2. Yeni secrets ekleyin:
   - `CLOUDFLARE_API_TOKEN`: [API Tokens sayfasından](https://dash.cloudflare.com/profile/api-tokens) oluşturun
   - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare dashboard'dan Account ID'nizi alın

> **Not:** Project name olarak `finansor` kullanın.

### 4. Deployment

#### Manuel Deployment

```bash
# Build oluştur
npm run build

# Wrangler CLI ile deploy et (optional)
npx wrangler pages deploy dist
```

#### Otomatik Deployment

- `main` branch'e push yaptığınızda GitHub Actions otomatik olarak deploy eder
- Her PR için preview deployment oluşturulur

### 5. Custom Domain (Opsiyonel)

1. Cloudflare Pages → Settings → Custom domains
2. Domain ekleyin (örn: `finansor.com`)
3. DNS kayıtları otomatik olarak eklenir

### 6. Environment Variables

Eğer production için özel ayarlar gerekiyorsa:

1. Cloudflare Pages → Settings → Environment variables
2. Variables ekleyin:
   ```
   VITE_APP_NAME=ParaOyunu
   VITE_ENABLE_ANALYTICS=true
   ```

## Alternatif Deployment Seçenekleri

### Netlify

1. [Netlify](https://app.netlify.com) hesabı oluşturun
2. "New site from Git" → Repository seçin
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy!

`_redirects` dosyası zaten SPA routing için hazır.

### Vercel

```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages

1. `package.json`'a base path ekleyin:
   ```json
   "homepage": "https://yourusername.github.io/paraoyunu"
   ```

2. `vite.config.ts`'de base ekleyin:
   ```ts
   export default defineConfig({
     base: '/paraoyunu/',
     // ...
   })
   ```

3. Deploy:
   ```bash
   npm run build
   npx gh-pages -d dist
   ```

## Performance Optimization

Build zaten optimize edilmiş durumda:

- ✅ Code splitting (vendor chunks)
- ✅ Tree shaking
- ✅ Asset optimization
- ✅ Service Worker (PWA)
- ✅ Gzip compression

Build sonucu:
- Total size: ~625 KB (gzipped: ~197 KB)
- Initial load: Fast
- PWA ready

## Monitoring

### Analytics Ekleme (Opsiyonel)

1. [Plausible](https://plausible.io) veya [Simple Analytics](https://simpleanalytics.com) hesabı oluşturun
2. `index.html`'e script ekleyin
3. Environment variable'ı ayarlayın

### Error Tracking (Opsiyonel)

[Sentry](https://sentry.io) veya benzeri bir servis kullanabilirsiniz.

## Troubleshooting

### Build Hataları

```bash
# Cache temizle
rm -rf node_modules dist
npm install
npm run build
```

### TypeScript Hataları

```bash
npm run type-check
```

### PWA Çalışmıyor

- HTTPS gerekli (Cloudflare otomatik sağlar)
- Service Worker kayıtlı mı kontrol edin (DevTools → Application → Service Workers)

## Checklist

- [ ] Repository GitHub'a push edildi
- [ ] Cloudflare Pages projesi oluşturuldu
- [ ] GitHub Secrets eklendi
- [ ] İlk deployment başarılı
- [ ] PWA test edildi
- [ ] Mobile'da test edildi
- [ ] Custom domain bağlandı (opsiyonel)

## Support

Sorun yaşarsanız:
1. GitHub Issues açın
2. [Cloudflare Community](https://community.cloudflare.com/) kontrol edin
3. Build loglarını inceleyin


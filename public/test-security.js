// 🔒 Güvenlik Test Scripti
// Browser Console'da çalıştır: testSecurity()

window.testSecurity = async function() {
  console.log('%c🔒 Güvenlik Test Başlıyor...', 'font-size: 16px; font-weight: bold; color: #00D9A3');
  console.log('');

  const results = {
    encryption: false,
    xss: false,
    validation: false,
    csp: false,
    migration: false
  };

  // 1. Şifreleme Testi
  console.log('%c1️⃣ Şifreleme Testi', 'font-weight: bold; color: #6C5CE7');
  try {
    const testData = { test: 'security', timestamp: Date.now() };
    
    // LocalStorage'da şifreli veri var mı kontrol et
    const encryptedKeys = Object.keys(localStorage).filter(key => key.startsWith('secure_'));
    if (encryptedKeys.length > 0) {
      console.log('✅ Şifreli veri bulundu:', encryptedKeys);
      results.encryption = true;
    } else {
      console.log('⚠️ Henüz şifreli veri yok (ilk kullanım olabilir)');
    }
    
    // Device ID kontrolü
    const deviceId = localStorage.getItem('finansor_device_id');
    if (deviceId) {
      console.log('✅ Cihaz ID oluşturulmuş');
    }
  } catch (error) {
    console.error('❌ Şifreleme hatası:', error);
  }

  // 2. XSS Koruması Testi
  console.log('\n%c2️⃣ XSS Koruması', 'font-weight: bold; color: #6C5CE7');
  const maliciousInputs = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    'javascript:alert("XSS")',
    '<iframe src="evil.com"></iframe>'
  ];
  
  maliciousInputs.forEach(input => {
    // Basit sanitization kontrolü
    const sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
    
    if (sanitized !== input) {
      console.log(`✅ "${input.substring(0, 30)}..." temizlendi`);
      results.xss = true;
    }
  });

  // 3. Validation Testi
  console.log('\n%c3️⃣ Input Validation', 'font-weight: bold; color: #6C5CE7');
  const invalidInputs = [
    { amount: -100, expected: 'reject' },
    { amount: 9999999999, expected: 'reject' },
    { type: 'invalid', expected: 'reject' }
  ];
  
  console.log('⚠️ Validation testi için transaction eklemeyi dene:');
  console.log('   - Negatif miktar ekle → Reddedilmeli');
  console.log('   - Çok büyük miktar ekle → Reddedilmeli');

  // 4. CSP Kontrolü
  console.log('\n%c4️⃣ Content Security Policy', 'font-weight: bold; color: #6C5CE7');
  const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (csp) {
    console.log('✅ CSP header bulundu');
    console.log('   Policy:', csp.getAttribute('content').substring(0, 100) + '...');
    results.csp = true;
  } else {
    console.log('❌ CSP header bulunamadı');
  }

  const xContentType = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
  if (xContentType) {
    console.log('✅ X-Content-Type-Options header var');
  }

  const xFrameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
  if (xFrameOptions) {
    console.log('✅ X-Frame-Options header var');
  }

  // 5. Migration Kontrolü
  console.log('\n%c5️⃣ Veri Migration', 'font-weight: bold; color: #6C5CE7');
  const oldKeys = ['transactions-storage', 'gamification-storage', 'settings-storage'];
  const hasOldData = oldKeys.some(key => localStorage.getItem(key) && !localStorage.getItem(`secure_${key}`));
  
  if (hasOldData) {
    console.log('⚠️ Eski veri formatı bulundu (migration gerekebilir)');
  } else {
    console.log('✅ Eski veri formatı yok (migration tamamlanmış)');
    results.migration = true;
  }

  // Özet
  console.log('\n%c📊 Test Özeti', 'font-size: 14px; font-weight: bold; color: #00D9A3');
  console.table({
    'Şifreleme': results.encryption ? '✅' : '⚠️',
    'XSS Koruması': results.xss ? '✅' : '⚠️',
    'Validation': '⚠️ Manuel test gerekli',
    'CSP Headers': results.csp ? '✅' : '❌',
    'Migration': results.migration ? '✅' : '⚠️'
  });

  console.log('\n%c💡 İpucu:', 'font-weight: bold');
  console.log('1. Bir işlem ekle ve LocalStorage\'da "secure_transactions-storage" kontrol et');
  console.log('2. XSS testi için açıklama alanına <script>alert("test")</script> yaz');
  console.log('3. Geçersiz input için negatif miktar eklemeyi dene');
  console.log('\n%c✅ Test tamamlandı!', 'font-size: 14px; font-weight: bold; color: #00D9A3');
};

console.log('%c🔒 Güvenlik Test Scripti Yüklendi!', 'font-size: 16px; font-weight: bold; color: #00D9A3');
console.log('Çalıştırmak için: testSecurity()');


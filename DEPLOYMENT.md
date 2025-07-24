# 🚀 Deployment Rehberi - React Router Fix

Bu rehber, React Router ile ilgili URL sorunlarını çözmek için farklı hosting platformları için çözümler sunar.

## 🔧 Sorun Açıklaması
React Router client-side routing kullanır. Tarayıcıda doğrudan URL girildiğinde veya sayfa yenilendiğinde, sunucu bu route'u bilmediği için 404 hatası verir.

## 📋 Çözümler

### 1. 🌐 **Netlify (Önerilen)**
Netlify otomatik olarak SPA routing'i destekler. Sadece build klasörünü deploy edin.

**Netlify.toml dosyası (opsiyonel):**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. ⚡ **Vercel**
Vercel de otomatik SPA desteği vardır. GitHub'dan otomatik deploy.

**vercel.json dosyası (opsiyonel):**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. 🔥 **Firebase Hosting**
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

**firebase.json:**
```json
{
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 4. 🐳 **Docker ile Deploy**
```dockerfile
FROM nginx:alpine
COPY build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 5. 🏠 **Kendi Sunucunuz**

#### Apache (.htaccess zaten eklendi)
Build klasörünü web root'a kopyalayın.

#### Nginx
```bash
sudo cp nginx.conf /etc/nginx/sites-available/quran-app
sudo ln -s /etc/nginx/sites-available/quran-app /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

### 6. 🌍 **GitHub Pages**
GitHub Pages SPA routing desteklemez, ancak workaround var:

**404.html dosyası oluşturun:**
```html
<!DOCTYPE html>
<html>
<head>
    <script>
        sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/quran-app-react'">
</head>
<body></body>
</html>
```

## 🔨 Build ve Deploy Adımları

1. **Build Oluşturun:**
```bash
npm run build
```

2. **Test Edin:**
```bash
npm install -g serve
serve -s build
```

3. **Deploy:**
- Netlify: Build klasörünü sürükle-bırak
- Vercel: GitHub'a push yapın
- Kendi sunucu: Build klasörünü web root'a kopyalayın

## ✅ Test Checklist

- [ ] Ana sayfa yükleniyor: `/`
- [ ] Sure listesi: `/surah-list`
- [ ] Belirli sure: `/surah/1`
- [ ] İstatistikler: `/statistics`
- [ ] Doğrudan URL girişi çalışıyor
- [ ] Sayfa yenileme çalışıyor
- [ ] Geri buton çalışıyor

## 🚨 Önemli Notlar

1. **Homepage Ayarı:** package.json'da `"homepage": "."` eklendi
2. **Build Path:** React Router absolute path kullanır
3. **Sunucu Konfigürasyonu:** Tüm route'lar index.html'e yönlendirilmeli
4. **Cache:** Static dosyalar cache'lenebilir, index.html cache'lenmemeli

## 🔗 Faydalı Linkler

- [React Router Deployment](https://reactrouter.com/web/guides/deployment)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/)
- [Netlify SPA Redirects](https://docs.netlify.com/routing/redirects/redirect-options/#history-pushstate-and-single-page-apps)

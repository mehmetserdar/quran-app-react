# Kur'an-ı Kerim React Uygulaması

Modern React.js teknolojisi ile geliştirilmiş, kapsamlı Kur'an-ı Kerim okuma ve dua uygulaması.

## 🌟 Özellikler

### 📖 Sure Okuma
- Kur'an-ı Kerim surelerinin tam listesi
- Arapça metin, Türkçe okunuş ve meal
- Sure bilgileri (Mekki/Medeni, ayet sayısı, zorluk seviyesi)
- Arama ve filtreleme özellikleri
- Yazı boyutu ayarlama

### 🤲 Dualar
- Günlük hayatta kullanılan dualar
- Namaz duaları ve özel dualar
- Arapça, Türkçe okunuş ve anlamları
- Kategori bazlı gruplandırma

### 📊 Zikirmatik
- Dijital zikirmatik sayaç
- Farklı zikir seçenekleri (Sübhanallah, Elhamdülillah, vb.)
- Hedef belirleme (33, 99, 100, özel sayı)
- İlerleme takibi
- Ses efektleri

### 🔖 Yer İmleri
- Favori sure ve duaları kaydetme
- Hızlı erişim sağlama
- Yer imi yönetimi

### ⚙️ Ayarlar
- Yazı boyutu ayarlama
- Tema seçenekleri (Açık/Koyu)
- Bildirim ayarları
- Dil seçenekleri

## 🚀 Teknolojiler

- **React 18** - Modern React hooks ile
- **TypeScript** - Tip güvenliği için
- **Tailwind CSS** - Modern ve responsive tasarım
- **React Router** - Sayfa navigasyonu
- **Lucide React** - Modern ikonlar
- **Local Storage** - Veri saklama

## 🛠️ Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar

1. **Proje klasörüne git:**
   ```bash
   cd react-version
   ```

2. **Bağımlılıkları yükle:**
   ```bash
   npm install
   ```

3. **Geliştirme sunucusunu başlat:**
   ```bash
   npm start
   ```

4. **Tarayıcıda aç:**
   http://localhost:3000

## 🚀 Çalıştırma

Proje şu anda http://localhost:3000 adresinde çalışıyor!

## 📁 Proje Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── HomePage.tsx     # Ana sayfa
│   ├── SurahList.tsx    # Sure listesi
│   ├── SurahDetailApi.tsx # Sure detay (API entegrasyonlu)
│   ├── DuaList.tsx      # Dua listesi
│   ├── DuaDetail.tsx    # Dua detay
│   ├── Counter.tsx      # Zikirmatik
│   ├── Settings.tsx     # Ayarlar
│   └── Bookmark.tsx     # Yer imleri
├── data/                # Veri dosyaları
│   ├── sureData.ts      # Sure verileri
│   └── duaData.ts       # Dua verileri
├── types/               # TypeScript tip tanımları
│   └── index.ts
├── App.tsx              # Ana uygulama
├── App.css              # Stil dosyası
└── index.tsx            # Giriş noktası
```

## 🎨 Tasarım Özellikleri

- **Responsive Design**: Mobil, tablet ve masaüstü uyumlu
- **Modern UI**: Temiz ve kullanıcı dostu arayüz
- **Arapça Font Desteği**: Özel Arapça fontlar
- **Smooth Animations**: Akıcı geçişler ve animasyonlar
- **Accessibility**: Erişilebilirlik standartlarına uygun

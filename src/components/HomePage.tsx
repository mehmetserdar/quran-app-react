import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, Heart, Calculator, Settings, Bookmark, Clock, ArrowRight, Menu, X, Download, Play, Users, Star, Shuffle, PlayCircle, Loader, RefreshCw, BarChart3 } from 'lucide-react';

// Sure isimleri
const surahNames: { [key: number]: string } = {
  1: "Fatiha", 2: "Bakara", 3: "Ali İmran", 4: "Nisa", 5: "Maide", 6: "Enam", 7: "Araf", 8: "Enfal", 9: "Tevbe", 10: "Yunus",
  11: "Hud", 12: "Yusuf", 13: "Rad", 14: "İbrahim", 15: "Hicr", 16: "Nahl", 17: "İsra", 18: "Kehf", 19: "Meryem", 20: "Taha",
  21: "Enbiya", 22: "Hacc", 23: "Muminun", 24: "Nur", 25: "Furkan", 26: "Şuara", 27: "Neml", 28: "Kasas", 29: "Ankebut", 30: "Rum",
  31: "Lokman", 32: "Secde", 33: "Ahzab", 34: "Sebe", 35: "Fatır", 36: "Yasin", 37: "Saffat", 38: "Sad", 39: "Zümer", 40: "Mümin",
  41: "Fussilet", 42: "Şura", 43: "Zuhruf", 44: "Duhan", 45: "Casiye", 46: "Ahkaf", 47: "Muhammed", 48: "Fetih", 49: "Hucurat", 50: "Kaf",
  51: "Zariyat", 52: "Tur", 53: "Necm", 54: "Kamer", 55: "Rahman", 56: "Vakıa", 57: "Hadid", 58: "Mücadele", 59: "Haşr", 60: "Mümtahine",
  61: "Saff", 62: "Cuma", 63: "Münafikun", 64: "Tegabun", 65: "Talak", 66: "Tahrim", 67: "Mülk", 68: "Kalem", 69: "Hakka", 70: "Mearic",
  71: "Nuh", 72: "Cinn", 73: "Müzzemmil", 74: "Müddessir", 75: "Kıyamet", 76: "İnsan", 77: "Mürselat", 78: "Nebe", 79: "Naziat", 80: "Abese",
  81: "Tekvir", 82: "İnfitar", 83: "Mutaffifin", 84: "İnşikak", 85: "Buruc", 86: "Tarık", 87: "Ala", 88: "Gaşiye", 89: "Fecr", 90: "Beled",
  91: "Şems", 92: "Leyl", 93: "Duha", 94: "İnşirah", 95: "Tin", 96: "Alak", 97: "Kadir", 98: "Beyyine", 99: "Zilzal", 100: "Adiyat",
  101: "Karia", 102: "Tekasur", 103: "Asr", 104: "Hümeze", 105: "Fil", 106: "Kureyş", 107: "Maun", 108: "Kevser", 109: "Kafirun", 110: "Nasr",
  111: "Leheb", 112: "İhlas", 113: "Felak", 114: "Nas"
};

// Her sure için ayet sayıları
const surahAyahCounts: { [key: number]: number } = {
  1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206, 8: 75, 9: 129, 10: 109,
  11: 123, 12: 111, 13: 43, 14: 52, 15: 99, 16: 128, 17: 111, 18: 110, 19: 98, 20: 135,
  21: 112, 22: 78, 23: 118, 24: 64, 25: 77, 26: 227, 27: 93, 28: 88, 29: 69, 30: 60,
  31: 34, 32: 30, 33: 73, 34: 54, 35: 45, 36: 83, 37: 182, 38: 88, 39: 75, 40: 85,
  41: 54, 42: 53, 43: 89, 44: 59, 45: 37, 46: 35, 47: 38, 48: 29, 49: 18, 50: 45,
  51: 60, 52: 49, 53: 62, 54: 55, 55: 78, 56: 96, 57: 29, 58: 22, 59: 24, 60: 13,
  61: 14, 62: 11, 63: 11, 64: 18, 65: 12, 66: 12, 67: 30, 68: 52, 69: 52, 70: 44,
  71: 28, 72: 28, 73: 20, 74: 56, 75: 40, 76: 31, 77: 50, 78: 40, 79: 46, 80: 42,
  81: 29, 82: 19, 83: 36, 84: 25, 85: 22, 86: 17, 87: 19, 88: 26, 89: 30, 90: 20,
  91: 15, 92: 21, 93: 11, 94: 8, 95: 8, 96: 19, 97: 5, 98: 8, 99: 8, 100: 11,
  101: 11, 102: 8, 103: 3, 104: 9, 105: 5, 106: 4, 107: 7, 108: 3, 109: 6, 110: 3,
  111: 5, 112: 4, 113: 5, 114: 6
};

interface DailyVerse {
  arabic: string;
  turkish: string;
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null);
  const [verseLoading, setVerseLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Günün ayetini al
  const getDailyVerse = useCallback(async () => {
    try {
      setVerseLoading(true);
      
      // Cache kontrolü
      const today = new Date().toDateString();
      const cachedDate = localStorage.getItem("dailyVerseDate");
      const cachedVerse = localStorage.getItem("dailyVerse");
      
      if (cachedDate === today && cachedVerse) {
        const verseData = JSON.parse(cachedVerse);
        setDailyVerse(verseData);
        setVerseLoading(false);
        return;
      }
      
      // Rastgele sure ve ayet seçimi
      const randomSurah = Math.floor(Math.random() * 114) + 1;
      const maxAyah = surahAyahCounts[randomSurah] || 10;
      const randomAyah = Math.floor(Math.random() * maxAyah) + 1;
      
      // Meal türü kontrolü
      const mealType = localStorage.getItem("mealValue") || "diyanet";
      let mealIdentifier = "tr.diyanet";
      
      switch (mealType) {
        case "vakfi":
          mealIdentifier = "tr.vakfi";
          break;
        case "yazir":
          mealIdentifier = "tr.yazir";
          break;
        case "golpinar":
          mealIdentifier = "tr.golpinarli";
          break;
        case "ozturk":
          mealIdentifier = "tr.ozturk";
          break;
        case "ates":
          mealIdentifier = "tr.ates";
          break;
        default:
          mealIdentifier = "tr.diyanet";
      }
      
      // API URL'si
      const apiUrl = `https://api.alquran.cloud/v1/ayah/${randomSurah}:${randomAyah}/editions/ar.husary,${mealIdentifier}`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.code === 200 && data.data && data.data.length >= 2) {
        const verseData: DailyVerse = {
          arabic: data.data[0].text,
          turkish: data.data[1].text,
          surahName: surahNames[randomSurah] || "Bilinmeyen",
          surahNumber: randomSurah,
          ayahNumber: randomAyah
        };
        
        setDailyVerse(verseData);
        
        // Cache'e kaydet
        localStorage.setItem("dailyVerseDate", today);
        localStorage.setItem("dailyVerse", JSON.stringify(verseData));
      } else {
        // Varsayılan ayet
        const defaultVerse: DailyVerse = {
          arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
          turkish: "Rahman ve Rahim olan Allah'ın adıyla",
          surahName: "Fatiha",
          surahNumber: 1,
          ayahNumber: 1
        };
        setDailyVerse(defaultVerse);
      }
    } catch (error) {
      console.error("Daily verse error:", error);
      // Varsayılan ayet
      const defaultVerse: DailyVerse = {
        arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
        turkish: "Rahman ve Rahim olan Allah'ın adıyla",
        surahName: "Fatiha",
        surahNumber: 1,
        ayahNumber: 1
      };
      setDailyVerse(defaultVerse);
    } finally {
      setVerseLoading(false);
    }
  }, []);

  // Rastgele sure git fonksiyonu
  const goToRandomSurah = () => {
    const randomSurahId = Math.floor(Math.random() * 114) + 1;
    navigate(`/surah/${randomSurahId}`);
  };

  // Kaldığın yerden devam et fonksiyonu
  const continueReading = () => {
    const lastReadData = localStorage.getItem('lastReadPosition');
    if (lastReadData) {
      try {
        const { surahId, ayatNumber, surahName, timestamp } = JSON.parse(lastReadData);
        const lastReadDate = new Date(timestamp);
        const daysSinceLastRead = Math.floor((Date.now() - lastReadDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (ayatNumber) {
          // Ayet seviyesinde devam et
          const message = `${surahName} Suresi ${ayatNumber}. ayetten devam ediliyor... (${daysSinceLastRead} gün önce okunmuş)`;
          // Kısa bir bildirim göster
          const notification = document.createElement('div');
          notification.className = 'fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
          notification.textContent = message;
          document.body.appendChild(notification);
          setTimeout(() => document.body.removeChild(notification), 3000);
          
          navigate(`/surah/${surahId}#verse-${ayatNumber}`);
        } else {
          // Sure seviyesinde devam et
          const message = `${surahName} Suresinden devam ediliyor... (${daysSinceLastRead} gün önce okunmuş)`;
          const notification = document.createElement('div');
          notification.className = 'fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
          notification.textContent = message;
          document.body.appendChild(notification);
          setTimeout(() => document.body.removeChild(notification), 3000);
          
          navigate(`/surah/${surahId}`);
        }
      } catch (error) {
        // Fallback to old format
        const lastSurah = localStorage.getItem('lastReadSurah');
        if (lastSurah) {
          navigate(`/surah/${lastSurah}`);
        } else {
          alert('Henüz okumaya başlamadınız.');
        }
      }
    } else {
      // Fallback to old format
      const lastSurah = localStorage.getItem('lastReadSurah');
      if (lastSurah) {
        const surahName = surahNames[parseInt(lastSurah)] || `Sure ${lastSurah}`;
        
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = `${surahName} Suresinden devam ediliyor...`;
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 3000);
        
        navigate(`/surah/${lastSurah}`);
      } else {
        alert('Henüz okumaya başlamadınız. Bir sure seçip okumaya başlayın.');
      }
    }
  };

  // PWA Kurulum fonksiyonu
  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        // Kurulum başarılı bildirimi
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = 'Uygulama başarıyla kuruldu! Ana ekranınızda görüntülenecek.';
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 4000);
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      // Tarayıcı PWA desteklemiyor
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.textContent = 'Bu özellik şu anda desteklenmiyor. Chrome veya Edge tarayıcısı kullanmayı deneyin.';
      document.body.appendChild(notification);
      setTimeout(() => document.body.removeChild(notification), 4000);
    }
  };

  useEffect(() => {
    // PWA kurulum event listener'ı
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // PWA kurulum tamamlandığında
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      console.log('PWA kuruldu');
    };

    // Event listener'ları ekle
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Loading simulation with error handling
    const timer = setTimeout(() => {
      try {
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setError('Uygulama yüklenirken bir hata oluştu. Sayfayı yenilemeyi deneyin.');
        setIsLoading(false);
      }
    }, 1500);

    // Check cookie consent
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowCookieBanner(true);
    }

    // Günün ayetini yükle
    getDailyVerse();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [getDailyVerse]);

  const handleCookieAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowCookieBanner(false);
  };

  const handleCookieReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowCookieBanner(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Kur'an-ı Kerim Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Hata Oluştu</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Kur'an-ı Kerim - Online Kuran Okuma, Meal ve Tefsir</title>
        <meta name="description" content={`114 Sure, 6236 Ayet ve 17+ Dil Desteği ile Kapsamlı İslami Yaşam Uygulaması. Ücretsiz online Kur'an okuma, Türkçe meal, dualar ve zikirmatik.${dailyVerse ? ` Günün ayeti: ${dailyVerse.surahName} ${dailyVerse.surahNumber}:${dailyVerse.ayahNumber}` : ''}`} />
        <meta name="keywords" content="kuran, quran, kur'an-ı kerim, meal, tefsir, online kuran okuma, islamiyet, dua, zikirmatik, namaz duaları, arapça kuran, türkçe meal, diyanet meal" />
        <meta name="author" content="Kur'an-ı Kerim Uygulaması" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Turkish" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="general" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Kur'an-ı Kerim - Online Kuran Okuma" />
        <meta property="og:description" content={`114 Sure, 6236 Ayet ve 17+ Dil Desteği ile Kapsamlı İslami Yaşam Uygulaması.${dailyVerse ? ` Günün ayeti: ${dailyVerse.turkish}` : ''}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:image" content="/image/og-kuran.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Kur'an-ı Kerim" />
        <meta property="og:locale" content="tr_TR" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kur'an-ı Kerim - Online Kuran Okuma" />
        <meta name="twitter:description" content={`114 Sure, 6236 Ayet ve 17+ Dil Desteği ile Kapsamlı İslami Yaşam Uygulaması.${dailyVerse ? ` Günün ayeti: ${dailyVerse.turkish}` : ''}`} />
        <meta name="twitter:image" content="/image/og-kuran.jpg" />
        <meta name="twitter:site" content="@kuranikerim" />
        <meta name="twitter:creator" content="@kuranikerim" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#059669" />
        <meta name="msapplication-TileColor" content="#059669" />
        <meta name="msapplication-TileImage" content="/web/icon-512.png" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.alquran.cloud" />
        
        {/* Structured Data for Rich Snippets */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Kur'an-ı Kerim",
            "description": "114 Sure, 6236 Ayet ve 17+ Dil Desteği ile Kapsamlı İslami Yaşam Uygulaması",
            "url": typeof window !== 'undefined' ? window.location.href : '',
            "applicationCategory": "ReligiousApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "TRY"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Kur'an-ı Kerim Uygulaması"
            },
            "inLanguage": "tr",
            "isAccessibleForFree": true,
            "featureList": [
              "114 Sure ile tam Kur'an metni",
              "Çoklu Türkçe meal desteği",
              "Günlük dualar koleksiyonu",
              "Dijital zikirmatik",
              "Yer imi sistemi",
              "Progressive Web App",
              "Offline çalışma"
            ],
            ...(dailyVerse && {
              "mentions": {
                "@type": "Thing",
                "name": `${dailyVerse.surahName} Suresi ${dailyVerse.ayahNumber}. Ayet`,
                "description": dailyVerse.turkish
              }
            })
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      {/* Navigation */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200/30" role="banner">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" role="navigation" aria-label="Ana navigasyon">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 brand-text">Kur'an-ı Kerim</h1>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/surah-list" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">Sureler</Link>
              <Link to="/dua-list" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">Dualar</Link>
              <Link to="/bookmark" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">Yer İmleri</Link>
              <Link to="/statistics" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">İstatistikler</Link>
              <Link to="/settings" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">Ayarlar</Link>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleInstallPWA}
                className="hidden md:block bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                <Download className="h-4 w-4 inline mr-2" />
                {isInstallable ? 'Uygulamayı Kur' : 'PWA Desteği'}
              </button>
              <button 
                className="md:hidden text-gray-600 hover:text-emerald-600"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main role="main">
        <section className="relative overflow-hidden min-h-screen" aria-labelledby="hero-title">
          {/* Background Images Slideshow */}
          <div className="absolute inset-0">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-10"></div>
            {/* Animated background images */}
            <div className="absolute inset-0">
              <img 
                src="/image/m7.jpg" 
                alt="Islamic Background 1" 
                className="w-full h-full object-cover hero-bg-image"
                style={{ 
                  animation: 'fadeInOut 15s infinite',
                  animationDelay: '0s'
                }}
              />
            </div>
            <div className="absolute inset-0">
              <img 
                src="/image/m8.jpg" 
                alt="Islamic Background 2" 
                className="w-full h-full object-cover hero-bg-image"
                style={{ 
                  animation: 'fadeInOut 15s infinite',
                  animationDelay: '5s'
                }}
              />
            </div>
            <div className="absolute inset-0">
              <img 
                src="/image/m9.jpg" 
                alt="Islamic Background 3" 
                className="w-full h-full object-cover hero-bg-image"
                style={{ 
                  animation: 'fadeInOut 15s infinite',
                  animationDelay: '10s'
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="text-white">
              <h1 id="hero-title" className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight header-font">
                Kur'an-ı Kerim
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl leading-relaxed">
                114 Sure, 6236 Ayet ve 17+ Dil Desteği ile Kapsamlı İslami Yaşam Uygulaması
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <Link 
                  to="/surah-list" 
                  className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-emerald-400 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Okumaya Başla
                </Link>
                <button
                  onClick={goToRandomSurah}
                  className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-teal-400 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg"
                >
                  <Shuffle className="mr-2 h-5 w-5" />
                  Rastgele Sure
                </button>
                <button
                  onClick={continueReading}
                  className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-purple-400 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Devam Et
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center bg-white/10 backdrop-blur-md rounded-lg py-4">
                  <div className="text-3xl font-bold header-font">114</div>
                  <div className="text-gray-300 text-sm">Sure</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-md rounded-lg py-4">
                  <div className="text-3xl font-bold header-font">6,236</div>
                  <div className="text-gray-300 text-sm">Ayet</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-md rounded-lg py-4">
                  <div className="text-3xl font-bold header-font">17+</div>
                  <div className="text-gray-300 text-sm">Dil</div>
                </div>
              </div>
            </div>

            {/* Günün Ayeti Kartı */}
            <div className="relative lg:block">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-lg mx-auto relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-800 mb-2 header-font-medium">Günün Ayeti</h3>
                    <div className="w-20 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto rounded-full"></div>
                  </div>
                  
                  {verseLoading ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-8 w-8 mx-auto mb-4 animate-pulse text-emerald-600" />
                      <p className="text-gray-600">Günün ayeti yükleniyor...</p>
                    </div>
                  ) : dailyVerse ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <p className="arabic-text text-2xl text-emerald-900 leading-relaxed mb-4">
                          {dailyVerse.arabic}
                        </p>
                        <div className="w-12 h-0.5 bg-emerald-300 mx-auto"></div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-gray-700 text-lg leading-relaxed mb-4 italic">
                          "{dailyVerse.turkish}"
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-sm text-emerald-600 font-semibold">
                          <span>{dailyVerse.surahName} Suresi</span>
                          <span>•</span>
                          <span>{dailyVerse.surahNumber}:{dailyVerse.ayahNumber}</span>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-emerald-100">
                        <Link 
                          to={`/surah/${dailyVerse.surahNumber}`} 
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                        >
                          <ArrowRight className="mr-2 h-5 w-5" />
                          Tam Sayfaya Git
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Ayet yüklenemedi</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" aria-labelledby="features-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="features-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 section-title">
              Özellikler
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              İslami hayatınızı desteklemek için tasarlanmış kapsamlı uygulama
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
            
            {/* Kur'an Okuma */}
            <Link to="/surah-list" className="group">
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src="/image/m1.jpg" 
                    alt="Kur'an Okuma" 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center mb-2">
                    <BookOpen className="h-6 w-6 mr-2" />
                    <h3 className="text-xl font-semibold card-title">Sure Listesi</h3>
                  </div>
                  <p className="text-sm opacity-90">
                    114 sure ile Kur'an-ı Kerim'i okuyun
                  </p>
                </div>
              </div>
            </Link>

            {/* Dualar */}
            <Link to="/dua-list" className="group">
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src="/image/m2.jpg" 
                    alt="Dualar" 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center mb-2">
                    <Heart className="h-6 w-6 mr-2" />
                    <h3 className="text-xl font-semibold card-title">Dualar</h3>
                  </div>
                  <p className="text-sm opacity-90">
                    Günlük hayatta kullanabileceğiniz dualar
                  </p>
                </div>
              </div>
            </Link>

            {/* Zikirmatik */}
            <Link to="/counter" className="group">
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src="/image/m3.jpg" 
                    alt="Zikirmatik" 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center mb-2">
                    <Calculator className="h-6 w-6 mr-2" />
                    <h3 className="text-xl font-semibold card-title">Zikirmatik</h3>
                  </div>
                  <p className="text-sm opacity-90">
                    Dijital zikirmatik ile tesbih sayın
                  </p>
                </div>
              </div>
            </Link>

            {/* Yer İmleri */}
            <Link to="/bookmark" className="group">
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src="/image/m4.jpg" 
                    alt="Yer İmleri" 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center mb-2">
                    <Bookmark className="h-6 w-6 mr-2" />
                    <h3 className="text-xl font-semibold card-title">Yer İmleri</h3>
                  </div>
                  <p className="text-sm opacity-90">
                    Kaydettiğiniz sure ve dualar
                  </p>
                </div>
              </div>
            </Link>

            {/* Namaz Vakitleri */}
            <div className="group cursor-not-allowed opacity-60">
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src="/image/m5.jpg" 
                    alt="Namaz Vakitleri" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center mb-2">
                    <Clock className="h-6 w-6 mr-2" />
                    <h3 className="text-xl font-semibold card-title">Namaz Vakitleri</h3>
                  </div>
                  <p className="text-sm opacity-90">
                    Günlük namaz vakitleri (Yakında)
                  </p>
                </div>
              </div>
            </div>

            {/* Ayarlar */}
            <Link to="/settings" className="group">
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src="/image/m6.jpg" 
                    alt="Ayarlar" 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center mb-2">
                    <Settings className="h-6 w-6 mr-2" />
                    <h3 className="text-xl font-semibold card-title">Ayarlar</h3>
                  </div>
                  <p className="text-sm opacity-90">
                    Uygulamayı kişiselleştirin
                  </p>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 section-title">Kullanıcı Yorumları</h2>
            <p className="text-xl text-gray-600">Uygulamamızı kullanan binlerce kullanıcımızın görüşleri</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 relative">
              <div className="flex items-center mb-4 relative z-10">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 relative z-10">
                "Çok kullanışlı bir uygulama. Özellikle meal seçenekleri ve ses kaydı özelliği harika. Günlük ibadetimdeki en büyük yardımcım."
              </p>
              <div className="flex items-center relative z-10">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-emerald-600 font-semibold">A</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Ahmet K.</div>
                  <div className="text-sm text-gray-500">İstanbul</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 relative">
              <div className="flex items-center mb-4 relative z-10">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 relative z-10">
                "Dualar bölümü gerçekten çok faydalı. Çocuklarımla birlikte öğreniyoruz. Arayüz çok temiz ve kullanımı kolay."
              </p>
              <div className="flex items-center relative z-10">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-teal-600 font-semibold">F</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Fatma S.</div>
                  <div className="text-sm text-gray-500">Ankara</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 relative">
              <div className="flex items-center mb-4 relative z-10">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 relative z-10">
                "Zikirmatik özelliği harika! Hem sayar hem de motivasyon veriyor. Tasarım da çok güzel, Allah razı olsun."
              </p>
              <div className="flex items-center relative z-10">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold">M</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Mehmet A.</div>
                  <div className="text-sm text-gray-500">İzmir</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-6 header-font">Progressive Web App Olarak Kurun</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Kur'an-ı Kerim'i ana ekranınıza ekleyin. Offline erişim, hızlı yükleme ve 
              uygulama mağazasına gerek kalmadan kullanın.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button 
                onClick={handleInstallPWA}
                className={`px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center ${
                  isInstallable 
                    ? 'bg-white text-teal-600 hover:bg-teal-50 shadow-lg border border-teal-200' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Download className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="text-xs">
                    {isInstallable ? 'Hemen kur ve kullan' : 'PWA desteği'}
                  </div>
                  <div className="text-lg font-bold">
                    {isInstallable ? 'Ana Ekrana Ekle' : 'Tarayıcıda Çalıştır'}
                  </div>
                </div>
              </button>
              
              <button 
                onClick={() => {
                  const notification = document.createElement('div');
                  notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                  notification.textContent = 'Mobil uygulamalar yakında mağazalarda!';
                  document.body.appendChild(notification);
                  setTimeout(() => document.body.removeChild(notification), 3000);
                }}
                className="bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center opacity-75"
              >
                <Play className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="text-xs">Yakında</div>
                  <div className="text-lg font-bold">Mobil Mağazalar</div>
                </div>
              </button>
            </div>

            <div className="flex justify-center items-center space-x-8 text-emerald-100">
              <div className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                <span>Anında Kurulum</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                <span>Offline Çalışır</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>Ücretsiz</span>
              </div>
            </div>
          </div>
        </div>
      </section>

       


      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 section-title">
              İslami Sanat ve Kültür
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              İslam kültürünün güzelliklerini keşfedin
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl aspect-square group">
                <img 
                  src={`/image/m${i + 7}.jpg`} 
                  alt={`Islamic Art ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 section-title">
              Hoş Geldiniz
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Bu uygulama ile Kur'an-ı Kerim'i okuyabilir, Türkçe mealini öğrenebilir, 
              günlük duaları ezberleyebilir ve zikirlerinizi sayabilirsiniz. 
              İslami hayatınızı desteklemek için tasarlanmıştır.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-emerald-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 card-title">Kapsamlı İçerik</h4>
                <p className="text-gray-600">114 sure, 6236 ayet ve çoklu meal desteği</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-teal-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 card-title">Dua Koleksiyonu</h4>
                <p className="text-gray-600">Günlük hayatınızda kullanabileceğiniz dualar</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2 card-title">Kişiselleştirme</h4>
                <p className="text-gray-600">Size özel ayarlar ve yer imleri</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold brand-text">Kur'an-ı Kerim</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                İslami hayatınızı desteklemek için tasarlanmış modern ve kullanıcı dostu uygulama.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 header-font-medium">Hızlı Linkler</h4>
              <div className="space-y-2">
                <Link to="/surah-list" className="block text-gray-400 hover:text-white transition-colors">Sure Listesi</Link>
                <Link to="/dua-list" className="block text-gray-400 hover:text-white transition-colors">Dualar</Link>
                <Link to="/bookmark" className="block text-gray-400 hover:text-white transition-colors">Yer İmleri</Link>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 header-font-medium">Diğer</h4>
              <div className="space-y-2">
                <Link to="/counter" className="block text-gray-400 hover:text-white transition-colors">Zikirmatik</Link>
                <Link to="/settings" className="block text-gray-400 hover:text-white transition-colors">Ayarlar</Link>
                <Link to="/privacy" className="block text-gray-400 hover:text-white transition-colors">Gizlilik Politikası</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Kur'an-ı Kerim Uygulaması. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={closeMobileMenu}
          ></div>
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 brand-text">Kur'an-ı Kerim</h3>
                </div>
                <button onClick={closeMobileMenu} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <nav className="space-y-4">
                <Link 
                  to="/surah-list" 
                  className="flex items-center space-x-3 text-gray-700 hover:text-emerald-600 py-3 border-b border-gray-100"
                  onClick={closeMobileMenu}
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Sure Listesi</span>
                </Link>
                <Link 
                  to="/dua-list" 
                  className="flex items-center space-x-3 text-gray-700 hover:text-emerald-600 py-3 border-b border-gray-100"
                  onClick={closeMobileMenu}
                >
                  <Heart className="h-5 w-5" />
                  <span>Dualar</span>
                </Link>
                <Link 
                  to="/counter" 
                  className="flex items-center space-x-3 text-gray-700 hover:text-emerald-600 py-3 border-b border-gray-100"
                  onClick={closeMobileMenu}
                >
                  <Calculator className="h-5 w-5" />
                  <span>Zikirmatik</span>
                </Link>
                <Link 
                  to="/bookmark" 
                  className="flex items-center space-x-3 text-gray-700 hover:text-emerald-600 py-3 border-b border-gray-100"
                  onClick={closeMobileMenu}
                >
                  <Bookmark className="h-5 w-5" />
                  <span>Yer İmleri</span>
                </Link>
                <Link 
                  to="/statistics" 
                  className="flex items-center space-x-3 text-gray-700 hover:text-emerald-600 py-3 border-b border-gray-100"
                  onClick={closeMobileMenu}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>İstatistikler</span>
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center space-x-3 text-gray-700 hover:text-emerald-600 py-3 border-b border-gray-100"
                  onClick={closeMobileMenu}
                >
                  <Settings className="h-5 w-5" />
                  <span>Ayarlar</span>
                </Link>
              </nav>

              <div className="mt-8">
                <button 
                  onClick={handleInstallPWA}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  <Download className="h-4 w-4 inline mr-2" />
                  {isInstallable ? 'Uygulamayı Kur' : 'PWA Desteği'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="text-emerald-600 text-2xl">🍪</div>
              <div>
                <h4 className="font-semibold text-gray-900 header-font-medium">Çerez Politikası</h4>
                <p className="text-sm text-gray-600">
                  Deneyiminizi iyileştirmek için çerezler kullanıyoruz. Devam ederek çerez kullanımını kabul etmiş olursunuz.{' '}
                  <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700 underline">
                    Gizlilik Politikası
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleCookieReject}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors"
              >
                Reddet
              </button>
              <button 
                onClick={handleCookieAccept}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Kabul Et
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default HomePage;

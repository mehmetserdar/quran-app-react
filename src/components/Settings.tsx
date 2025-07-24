import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  Download,
  Trash2,
  Info,
  Shield,
  Bell,
  Database,
  RefreshCw,
  BookOpen,
  Smartphone
} from 'lucide-react';
import quranApi from '../services/quranApi';
interface AppSettings {
  language: string;
  fontSize: number;
  selectedTranslation: string;
  selectedReciter: string;
  showTranslation: boolean;
  showTransliteration: boolean;
  autoPlay: boolean;
  notifications: boolean;
  offlineMode: boolean;
  downloadedSurahs: number[];
}

interface TranslationOption {
  value: string;
  label: string;
  language: string;
}

interface ReciterOption {
  value: string;
  label: string;
  language: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>({
    language: 'tr',
    fontSize: 18,
    selectedTranslation: 'tr.diyanet',
    selectedReciter: 'ar.alafasy',
    showTranslation: true,
    showTransliteration: false,
    autoPlay: false,
    notifications: true,
    offlineMode: false,
    downloadedSurahs: []
  });
  
  const [cacheSize, setCacheSize] = useState(0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Available translation options
  const translationOptions: TranslationOption[] = [
    // Türkçe çeviriler
    { value: 'tr.diyanet', label: 'Diyanet İşleri Meali', language: 'tr' },
    { value: 'tr.yazir', label: 'Elmalılı Hamdi Yazır', language: 'tr' },
    { value: 'tr.golpinarli', label: 'Abdülbaki Gölpınarlı', language: 'tr' },
    { value: 'tr.ozturk', label: 'Yaşar Nuri Öztürk', language: 'tr' },
    { value: 'tr.ates', label: 'Süleyman Ateş', language: 'tr' },
    { value: 'tr.yuksel', label: 'Edip Yüksel', language: 'tr' },
    { value: 'tr.vakfi', label: 'Türkiye Diyanet Vakfı', language: 'tr' },
    
    // İngilizce çeviriler
    { value: 'en.sahih', label: 'Sahih International', language: 'en' },
    { value: 'en.pickthall', label: 'Pickthall', language: 'en' },
    { value: 'en.yusufali', label: 'Yusuf Ali', language: 'en' },
    { value: 'en.shakir', label: 'M. H. Shakir', language: 'en' },
    { value: 'en.arberry', label: 'A. J. Arberry', language: 'en' },
    { value: 'en.hilali', label: 'Hilali & Khan', language: 'en' },
    { value: 'en.maududi', label: 'Abul Ala Maududi', language: 'en' },
    
    // Arapça çeviriler
    { value: 'ar.muyassar', label: 'التفسير الميسر', language: 'ar' },
    { value: 'ar.jalalayn', label: 'تفسير الجلالين', language: 'ar' },
    { value: 'ar.qurtubi', label: 'تفسير القرطبي', language: 'ar' },
    
    // Diğer diller
    { value: 'fr.hamidullah', label: 'Muhammad Hamidullah', language: 'fr' },
    { value: 'de.bubenheim', label: 'Bubenheim & Elyas', language: 'de' },
    { value: 'es.cortes', label: 'Julio Cortés', language: 'es' },
    { value: 'it.piccardo', label: 'Hamza Roberto Piccardo', language: 'it' },
    { value: 'ru.kuliev', label: 'Эльмир Кулиев', language: 'ru' },
    { value: 'nl.leemhuis', label: 'Fred Leemhuis', language: 'nl' },
    { value: 'pt.nasr', label: 'Helmi Nasr', language: 'pt' },
    { value: 'fa.ansarian', label: 'حسین انصاریان', language: 'fa' },
    { value: 'ur.jalandhari', label: 'فتح محمد جالندھری', language: 'ur' },
    { value: 'id.indonesian', label: 'Bahasa Indonesia', language: 'id' },
    { value: 'ms.basmeih', label: 'Abdullah Muhammad Basmeih', language: 'ms' },
    { value: 'bn.bengali', label: 'বাংলা', language: 'bn' },
    { value: 'hi.hindi', label: 'हिंदी', language: 'hi' },
    { value: 'sw.barwani', label: 'Al-Barwani', language: 'sw' }
  ];

  // Available reciter options
  const reciterOptions: ReciterOption[] = [
    { value: 'ar.alafasy', label: 'Mishary Rashid Alafasy', language: 'ar' },
    { value: 'ar.minshawi', label: 'Mohamed Siddiq el-Minshawi', language: 'ar' },
    { value: 'ar.husary', label: 'Mahmoud Khalil Al-Husary', language: 'ar' }
  ];

  // App interface language options (limited to supported UI languages)
  const appLanguageOptions = [
    { value: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'ar', label: 'العربية', flag: '🇸🇦' }
  ];

  // All available languages for translation flags
  const languageOptions = [
    { value: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'ar', label: 'العربية', flag: '🇸🇦' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'it', label: 'Italiano', flag: '🇮🇹' },
    { value: 'ru', label: 'Русский', flag: '🇷🇺' },
    { value: 'nl', label: 'Nederlands', flag: '🇳🇱' },
    { value: 'pt', label: 'Português', flag: '🇵🇹' },
    { value: 'fa', label: 'فارسی', flag: '🇮🇷' },
    { value: 'ur', label: 'اردو', flag: '🇵🇰' },
    { value: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
    { value: 'ms', label: 'Bahasa Melayu', flag: '🇲🇾' },
    { value: 'bn', label: 'বাংলা', flag: '🇧🇩' },
    { value: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { value: 'sw', label: 'Kiswahili', flag: '🇹🇿' }
  ];

  useEffect(() => {
    loadSettings();
    loadCacheInfo();
    // Translations API loading removed for simplicity
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('quranAppSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...parsed }));
    }
  };

  const loadCacheInfo = () => {
    const size = quranApi.getCacheSize();
    setCacheSize(size);
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('quranAppSettings', JSON.stringify(newSettings));
  };

  const clearCache = () => {
    quranApi.clearCache();
    localStorage.removeItem('bookmarkedSurahs');
    localStorage.removeItem('lastReadSurah');
    localStorage.removeItem('readingProgress');
    setCacheSize(0);
    setShowClearConfirm(false);
    alert('Önbellek temizlendi!');
  };

  const resetSettings = () => {
    const defaultSettings: AppSettings = {
      language: 'tr',
      fontSize: 18,
      selectedTranslation: 'tr.diyanet',
      selectedReciter: 'ar.alafasy',
      showTranslation: true,
      showTransliteration: false,
      autoPlay: false,
      notifications: true,
      offlineMode: false,
      downloadedSurahs: []
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('quranAppSettings', JSON.stringify(defaultSettings));
    alert('Ayarlar sıfırlandı!');
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify({
      settings,
      bookmarks: JSON.parse(localStorage.getItem('bookmarkedSurahs') || '[]'),
      progress: localStorage.getItem('lastReadSurah'),
      exportDate: new Date().toISOString()
    }, null, 2);
    
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quran-app-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.settings) {
          setSettings(data.settings);
          localStorage.setItem('quranAppSettings', JSON.stringify(data.settings));
        }
        if (data.bookmarks) {
          localStorage.setItem('bookmarkedSurahs', JSON.stringify(data.bookmarks));
        }
        if (data.progress) {
          localStorage.setItem('lastReadSurah', data.progress);
        }
        alert('Ayarlar başarıyla içe aktarıldı!');
      } catch (error) {
        alert('Dosya formatı hatalı!');
      }
    };
    reader.readAsText(file);
  };

  const getAppVersion = () => {
    return '2.0.0'; // Versiyon bilgisi
  };

  const getStorageUsage = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length;
      }
    }
    return (total / 1024).toFixed(2); // KB cinsinden
  };

  return (
    <>
      <Helmet>
        <title>Gelişmiş Ayarlar - Kişiselleştirme ve Tercihler | Kur'an-ı Kerim</title>
        <meta name="description" content="Kur'an-ı Kerim uygulaması gelişmiş ayarları. 17+ dil desteği, meal seçenekleri, ses kayıtları, yazı tipi ayarları, bildirimler ve veri yönetimi seçenekleri." />
        <meta name="keywords" content="kuran ayarları, gelişmiş ayarlar, meal seçimi, ses kayıtları, yazı tipi boyutu, 17 dil, çeviri seçenekleri, kişiselleştirme, bildirimler, çevrimdışı mod" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Gelişmiş Ayarlar - Kişiselleştirme ve Tercihler" />
        <meta property="og:description" content="Kur'an-ı Kerim uygulaması gelişmiş ayarları. 17+ dil desteği, meal seçenekleri, ses kayıtları ve kişiselleştirme seçenekleri." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Twitter Cards */}
        <meta name="twitter:title" content="Gelişmiş Ayarlar - Kişiselleştirme ve Tercihler" />
        <meta name="twitter:description" content="Kur'an-ı Kerim uygulaması gelişmiş ayarları. 17+ dil desteği, meal seçenekleri ve kişiselleştirme seçenekleri." />
        
        {/* Canonical URL */}
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Gelişmiş Ayarlar",
            "description": "Kur'an-ı Kerim uygulaması gelişmiş ayarları ve kişiselleştirme seçenekleri",
            "url": typeof window !== 'undefined' ? window.location.href : '',
            "about": {
              "@type": "SoftwareApplication",
              "name": "Kur'an-ı Kerim",
              "applicationCategory": "ReligiousApplication",
              "featureList": [
                "17+ Dil Desteği",
                "Çoklu Meal Seçenekleri", 
                "Ses Kayıtları",
                "Yazı Tipi Ayarları",
                "Çevrimdışı Mod",
                "Veri Yönetimi"
              ]
            },
            "isPartOf": {
              "@type": "WebSite",
              "name": "Kur'an-ı Kerim",
              "url": typeof window !== 'undefined' ? window.location.origin : ''
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-emerald-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-emerald-600 hover:text-emerald-800" />
              </Link>
              <h1 className="text-2xl font-bold text-emerald-800">Ayarlar</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Görünüm Ayarları */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Görünüm Ayarları
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arayüz Dili</label>
              <select
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900"
              >
                {appLanguageOptions.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yazı Boyutu: {settings.fontSize}px
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 2))}
                  className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-gray-900"
                >
                  -
                </button>
                <input
                  type="range"
                  min="12"
                  max="32"
                  step="2"
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', Number(e.target.value))}
                  className="flex-1"
                />
                <button
                  onClick={() => updateSetting('fontSize', Math.min(32, settings.fontSize + 2))}
                  className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-gray-900"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Okuma Ayarları */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
            <BookOpen className="w-5 h-5 text-green-600" />
            Okuma Ayarları
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meal Seçimi</label>
              <select
                value={settings.selectedTranslation}
                onChange={(e) => updateSetting('selectedTranslation', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900"
              >
                {translationOptions.map(option => {
                  const langFlag = languageOptions.find(lang => lang.value === option.language)?.flag || '📖';
                  return (
                    <option key={option.value} value={option.value}>
                      {langFlag} {option.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ses Kaydı (Kari)</label>
              <select
                value={settings.selectedReciter}
                onChange={(e) => updateSetting('selectedReciter', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900"
              >
                {reciterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.showTranslation}
                  onChange={(e) => updateSetting('showTranslation', e.target.checked)}
                  className="w-4 h-4 text-green-600"
                />
                <span className="text-sm font-medium text-gray-700">Meal Göster</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.showTransliteration}
                  onChange={(e) => updateSetting('showTransliteration', e.target.checked)}
                  className="w-4 h-4 text-green-600"
                />
                <span className="text-sm font-medium text-gray-700">Latin Harfleri Göster</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.autoPlay}
                  onChange={(e) => updateSetting('autoPlay', e.target.checked)}
                  className="w-4 h-4 text-green-600"
                />
                <span className="text-sm font-medium text-gray-700">Otomatik Ses Oynatma</span>
              </label>
            </div>
          </div>
        </div>

        {/* Uygulama Ayarları */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
            <Smartphone className="w-5 h-5 text-purple-600" />
            Uygulama Ayarları
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSetting('notifications', e.target.checked)}
                className="w-4 h-4 text-green-600"
              />
              <Bell className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Bildirimler</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.offlineMode}
                onChange={(e) => updateSetting('offlineMode', e.target.checked)}
                className="w-4 h-4 text-green-600"
              />
              <Download className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Çevrimdışı Mod</span>
            </label>
          </div>
        </div>

        {/* Veri Yönetimi */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
            <Database className="w-5 h-5 text-orange-600" />
            Veri Yönetimi
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Önbellek Bilgisi</h3>
              <p className="text-sm text-gray-600 mb-3">
                Önbellek boyutu: {cacheSize} öğe<br />
                Depolama kullanımı: {getStorageUsage()} KB
              </p>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Önbelleği Temizle
              </button>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Ayarları Yedekle</h3>
              <div className="space-y-2">
                <button
                  onClick={exportSettings}
                  className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Ayarları Dışa Aktar
                </button>
                <label className="w-full flex items-center justify-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors cursor-pointer">
                  <RefreshCw className="w-4 h-4" />
                  Ayarları İçe Aktar
                  <input
                    type="file"
                    accept=".json"
                    onChange={importSettings}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Uygulama Bilgisi */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900">
            <Info className="w-5 h-5 text-gray-600" />
            Uygulama Bilgisi
          </h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>Versiyon:</strong> {getAppVersion()}
            </div>
            <div>
              <strong>API:</strong> AlQuran.cloud
            </div>
            <div>
              <strong>Arayüz Dilleri:</strong> Türkçe, İngilizce, Arapça
            </div>
            <div>
              <strong>Meal Dilleri:</strong> 17+ Dil
            </div>
            <div>
              <strong>Son Güncelleme:</strong> 24 Temmuz 2025
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex gap-3">
              <button
                onClick={resetSettings}
                className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg hover:bg-yellow-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Ayarları Sıfırla
              </button>
              <Link
                to="/privacy"
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Shield className="w-4 h-4" />
                Gizlilik Politikası
              </Link>
            </div>
          </div>

          {/* Önizleme */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-700 mb-3">Yazı Boyutu Önizlemesi</h3>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p style={{ fontSize: settings.fontSize }} className="text-gray-800 mb-2">
                Bu metin, seçtiğiniz yazı boyutu ayarıyla görünecektir.
              </p>
              <p 
                className="text-2xl font-arabic text-right" 
                style={{ fontSize: settings.fontSize + 6 }}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              {settings.showTranslation && (
                <p className="text-gray-600 mt-2" style={{ fontSize: settings.fontSize - 2 }}>
                  Rahman ve Rahim olan Allah'ın adıyla
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cache Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Önbelleği Temizle</h3>
            <p className="text-gray-600 mb-6">
              Bu işlem tüm indirilen verileri, favorileri ve okuma geçmişinizi silecektir. 
              Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={clearCache}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Evet, Temizle
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

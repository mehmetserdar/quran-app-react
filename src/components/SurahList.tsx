import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Search, BookOpen, Clock, Heart, Filter, Play, Pause, Loader, RefreshCw } from 'lucide-react';
import quranApi, { QuranApiSurah } from '../services/quranApi';

interface SurahCardProps {
  id: number;
  name: string;
  englishName: string;
  arabicName: string;
  meaning: string;
  ayahCount: number;
  revelationPlace: string;
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent) => void;
  onPlayAudio: (e: React.MouseEvent) => void;
  isPlaying: boolean;
  isLoading: boolean;
}

export default function SurahList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [bookmarkedSurahs, setBookmarkedSurahs] = useState<number[]>([]);
  const [surahs, setSurahs] = useState<QuranApiSurah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingSurah, setPlayingSurah] = useState<number | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<number | null>(null);
  const [quickActions, setQuickActions] = useState(false);

  // Enhanced surah data with Turkish names
  const surahDataMap: { [key: number]: { name: string; meaning: string; arabic: string } } = {
    1: { name: "Fatiha", meaning: "Açılış", arabic: "الفاتحة" },
    2: { name: "Bakara", meaning: "İnek", arabic: "البقرة" },
    3: { name: "Ali İmran", meaning: "Ali İmran Ailesi", arabic: "آل عمران" },
    4: { name: "Nisa", meaning: "Kadınlar", arabic: "النساء" },
    5: { name: "Maide", meaning: "Sofra", arabic: "المائدة" },
    6: { name: "Enam", meaning: "Hayvanlar", arabic: "الأنعام" },
    7: { name: "Araf", meaning: "Yüksek Yerler", arabic: "الأعراف" },
    8: { name: "Enfal", meaning: "Ganimetler", arabic: "الأنفال" },
    9: { name: "Tevbe", meaning: "Tevbe", arabic: "التوبة" },
    10: { name: "Yunus", meaning: "Yunus", arabic: "يونس" },
    11: { name: "Hud", meaning: "Hud", arabic: "هود" },
    12: { name: "Yusuf", meaning: "Yusuf", arabic: "يوسف" },
    13: { name: "Rad", meaning: "Gök Gürültüsü", arabic: "الرعد" },
    14: { name: "İbrahim", meaning: "İbrahim", arabic: "إبراهيم" },
    15: { name: "Hicr", meaning: "Hicr", arabic: "الحجر" },
    16: { name: "Nahl", meaning: "Arı", arabic: "النحل" },
    17: { name: "İsra", meaning: "Gece Yolculuğu", arabic: "الإسراء" },
    18: { name: "Kehf", meaning: "Mağara", arabic: "الكهف" },
    19: { name: "Meryem", meaning: "Meryem", arabic: "مريم" },
    20: { name: "Taha", meaning: "Taha", arabic: "طه" },
    21: { name: "Enbiya", meaning: "Peygamberler", arabic: "الأنبياء" },
    22: { name: "Hacc", meaning: "Hac", arabic: "الحج" },
    23: { name: "Muminun", meaning: "Müminler", arabic: "المؤمنون" },
    24: { name: "Nur", meaning: "Nur", arabic: "النور" },
    25: { name: "Furkan", meaning: "Furkan", arabic: "الفرقان" },
    26: { name: "Şuara", meaning: "Şairler", arabic: "الشعراء" },
    27: { name: "Neml", meaning: "Karıncalar", arabic: "النمل" },
    28: { name: "Kasas", meaning: "Kıssalar", arabic: "القصص" },
    29: { name: "Ankebut", meaning: "Örümcek", arabic: "العنكبوت" },
    30: { name: "Rum", meaning: "Rumlar", arabic: "الروم" },
    31: { name: "Lokman", meaning: "Lokman", arabic: "لقمان" },
    32: { name: "Secde", meaning: "Secde", arabic: "السجدة" },
    33: { name: "Ahzab", meaning: "Ahzab", arabic: "الأحزاب" },
    34: { name: "Sebe", meaning: "Sebe", arabic: "سبأ" },
    35: { name: "Fatır", meaning: "Yaratıcı", arabic: "فاطر" },
    36: { name: "Yasin", meaning: "Yasin", arabic: "يس" },
    37: { name: "Saffat", meaning: "Saf Tutanlar", arabic: "الصافات" },
    38: { name: "Sad", meaning: "Sad", arabic: "ص" },
    39: { name: "Zümer", meaning: "Gruplar", arabic: "الزمر" },
    40: { name: "Mümin", meaning: "Mümin", arabic: "غافر" },
    41: { name: "Fussilet", meaning: "Açıklanmış", arabic: "فصلت" },
    42: { name: "Şura", meaning: "Şura", arabic: "الشورى" },
    43: { name: "Zuhruf", meaning: "Süs", arabic: "الزخرف" },
    44: { name: "Duhan", meaning: "Duman", arabic: "الدخان" },
    45: { name: "Casiye", meaning: "Çöken", arabic: "الجاثية" },
    46: { name: "Ahkaf", meaning: "Ahkaf", arabic: "الأحقاف" },
    47: { name: "Muhammed", meaning: "Muhammed", arabic: "محمد" },
    48: { name: "Fetih", meaning: "Fetih", arabic: "الفتح" },
    49: { name: "Hucurat", meaning: "Hucuralar", arabic: "الحجرات" },
    50: { name: "Kaf", meaning: "Kaf", arabic: "ق" },
    51: { name: "Zariyat", meaning: "Savuranlar", arabic: "الذاريات" },
    52: { name: "Tur", meaning: "Tur", arabic: "الطور" },
    53: { name: "Necm", meaning: "Yıldız", arabic: "النجم" },
    54: { name: "Kamer", meaning: "Ay", arabic: "القمر" },
    55: { name: "Rahman", meaning: "Rahman", arabic: "الرحمن" },
    56: { name: "Vakıa", meaning: "Vaki Olan", arabic: "الواقعة" },
    57: { name: "Hadid", meaning: "Demir", arabic: "الحديد" },
    58: { name: "Mücadele", meaning: "Mücadele Eden", arabic: "المجادلة" },
    59: { name: "Haşr", meaning: "Haşir", arabic: "الحشر" },
    60: { name: "Mümtahine", meaning: "İmtihan Edilen", arabic: "الممتحنة" },
    61: { name: "Saff", meaning: "Saf", arabic: "الصف" },
    62: { name: "Cuma", meaning: "Cuma", arabic: "الجمعة" },
    63: { name: "Münafikun", meaning: "Münafıklar", arabic: "المنافقون" },
    64: { name: "Tegabun", meaning: "Aldatma", arabic: "التغابن" },
    65: { name: "Talak", meaning: "Boşanma", arabic: "الطلاق" },
    66: { name: "Tahrim", meaning: "Yasak", arabic: "التحريم" },
    67: { name: "Mülk", meaning: "Mülk", arabic: "الملك" },
    68: { name: "Kalem", meaning: "Kalem", arabic: "القلم" },
    69: { name: "Hakka", meaning: "Gerçek", arabic: "الحاقة" },
    70: { name: "Mearic", meaning: "Yükseliş Yolları", arabic: "المعارج" },
    71: { name: "Nuh", meaning: "Nuh", arabic: "نوح" },
    72: { name: "Cinn", meaning: "Cinler", arabic: "الجن" },
    73: { name: "Müzzemmil", meaning: "Örtünen", arabic: "المزمل" },
    74: { name: "Müddessir", meaning: "Bürünen", arabic: "المدثر" },
    75: { name: "Kıyamet", meaning: "Kıyamet", arabic: "القيامة" },
    76: { name: "İnsan", meaning: "İnsan", arabic: "الإنسان" },
    77: { name: "Mürselat", meaning: "Gönderilmiş", arabic: "المرسلات" },
    78: { name: "Nebe", meaning: "Haber", arabic: "النبأ" },
    79: { name: "Naziat", meaning: "Koparanlar", arabic: "النازعات" },
    80: { name: "Abese", meaning: "Çattı", arabic: "عبس" },
    81: { name: "Tekvir", meaning: "Dürülme", arabic: "التكوير" },
    82: { name: "İnfitar", meaning: "Yarılma", arabic: "الانفطار" },
    83: { name: "Mutaffifin", meaning: "Ölçüde Hile", arabic: "المطففين" },
    84: { name: "İnşikak", meaning: "Çatırdama", arabic: "الانشقاق" },
    85: { name: "Buruc", meaning: "Burçlar", arabic: "البروج" },
    86: { name: "Tarık", meaning: "Gece Gelen", arabic: "الطارق" },
    87: { name: "Ala", meaning: "Yüce", arabic: "الأعلى" },
    88: { name: "Gaşiye", meaning: "Kaplar", arabic: "الغاشية" },
    89: { name: "Fecr", meaning: "Fecir", arabic: "الفجر" },
    90: { name: "Beled", meaning: "Şehir", arabic: "البلد" },
    91: { name: "Şems", meaning: "Güneş", arabic: "الشمس" },
    92: { name: "Leyl", meaning: "Gece", arabic: "الليل" },
    93: { name: "Duha", meaning: "Kuşluk", arabic: "الضحى" },
    94: { name: "İnşirah", meaning: "Açılma", arabic: "الشرح" },
    95: { name: "Tin", meaning: "İncir", arabic: "التين" },
    96: { name: "Alak", meaning: "Kan Pıhtısı", arabic: "العلق" },
    97: { name: "Kadir", meaning: "Kadir", arabic: "القدر" },
    98: { name: "Beyyine", meaning: "Açık Delil", arabic: "البينة" },
    99: { name: "Zilzal", meaning: "Sarsıntı", arabic: "الزلزلة" },
    100: { name: "Adiyat", meaning: "Koşanlar", arabic: "العاديات" },
    101: { name: "Karia", meaning: "Çarpıcı", arabic: "القارعة" },
    102: { name: "Tekasur", meaning: "Çoğalma", arabic: "التكاثر" },
    103: { name: "Asr", meaning: "Asr", arabic: "العصر" },
    104: { name: "Hümeze", meaning: "Çekiştiren", arabic: "الهمزة" },
    105: { name: "Fil", meaning: "Fil", arabic: "الفيل" },
    106: { name: "Kureyş", meaning: "Kureyş", arabic: "قريش" },
    107: { name: "Maun", meaning: "Maun", arabic: "الماعون" },
    108: { name: "Kevser", meaning: "Kevser", arabic: "الكوثر" },
    109: { name: "Kafirun", meaning: "Kafirler", arabic: "الكافرون" },
    110: { name: "Nasr", meaning: "Yardım", arabic: "النصر" },
    111: { name: "Leheb", meaning: "Leheb", arabic: "المسد" },
    112: { name: "İhlas", meaning: "İhlas", arabic: "الإخلاص" },
    113: { name: "Felak", meaning: "Şafak", arabic: "الفلق" },
    114: { name: "Nas", meaning: "İnsanlar", arabic: "الناس" }
  };

  useEffect(() => {
    // Load both bookmarked surahs and detailed bookmarks for compatibility
    const simpleBookmarks = JSON.parse(localStorage.getItem('bookmarkedSurahs') || '[]');
    const detailedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    // Extract surah IDs from detailed bookmarks and merge with simple bookmarks
    const detailedSurahIds = detailedBookmarks.map((bookmark: any) => bookmark.surahId);
    const allBookmarkedSurahs = Array.from(new Set([...simpleBookmarks, ...detailedSurahIds]));
    
    setBookmarkedSurahs(allBookmarkedSurahs);
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await quranApi.getSurahs();
      setSurahs(data);
    } catch (err) {
      setError('Sureler yüklenirken bir hata oluştu. İnternet bağlantınızı kontrol edin.');
      console.error('Error loading surahs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSurahs = surahs.filter(surah => {
    const surahInfo = surahDataMap[surah.number];
    const turkishName = surahInfo?.name || surah.name;
    const meaning = surahInfo?.meaning || surah.englishNameTranslation;
    
    const matchesSearch = turkishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         surah.number.toString().includes(searchTerm);
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'mekki') return matchesSearch && surah.revelationType === 'Meccan';
    if (filter === 'medeni') return matchesSearch && surah.revelationType === 'Medinan';
    if (filter === 'bookmarked') return matchesSearch && bookmarkedSurahs.includes(surah.number);
    if (filter === 'short') return matchesSearch && surah.numberOfAyahs <= 20;
    
    return matchesSearch;
  });

  const toggleBookmark = (surahId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isCurrentlyBookmarked = bookmarkedSurahs.includes(surahId);
    const newBookmarks = isCurrentlyBookmarked
      ? bookmarkedSurahs.filter(id => id !== surahId)
      : [...bookmarkedSurahs, surahId];
    
    setBookmarkedSurahs(newBookmarks);
    
    // Update simple bookmarks
    localStorage.setItem('bookmarkedSurahs', JSON.stringify(newBookmarks));
    
    // Update detailed bookmarks for compatibility with Bookmark.tsx
    const detailedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    if (isCurrentlyBookmarked) {
      // Remove from detailed bookmarks
      const updatedDetailedBookmarks = detailedBookmarks.filter((bookmark: any) => bookmark.surahId !== surahId);
      localStorage.setItem('bookmarks', JSON.stringify(updatedDetailedBookmarks));
    } else {
      // Add to detailed bookmarks
      const surahInfo = surahDataMap[surahId];
      const newDetailedBookmark = {
        id: `bookmark_${surahId}_${Date.now()}`,
        surahId: surahId,
        surahName: surahInfo?.name || `Sure ${surahId}`,
        ayatNumber: null,
        createdAt: new Date().toISOString()
      };
      
      const updatedDetailedBookmarks = [...detailedBookmarks, newDetailedBookmark];
      localStorage.setItem('bookmarks', JSON.stringify(updatedDetailedBookmarks));
    }
  };

  const playAudio = async (surahId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If the same surah is playing, stop it
    if (playingSurah === surahId && currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setPlayingSurah(null);
      return;
    }

    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setPlayingSurah(null);
    }

    try {
      setLoadingAudio(surahId);
      const audioUrl = quranApi.getAudioUrl(surahId);
      const audio = new Audio(audioUrl);
      
      audio.addEventListener('loadstart', () => {
        setLoadingAudio(surahId);
      });

      audio.addEventListener('canplay', () => {
        setLoadingAudio(null);
        setPlayingSurah(surahId);
        setCurrentAudio(audio);
      });

      audio.addEventListener('ended', () => {
        setCurrentAudio(null);
        setPlayingSurah(null);
        setLoadingAudio(null);
      });

      audio.addEventListener('error', () => {
        setLoadingAudio(null);
        alert('Ses dosyası yüklenirken hata oluştu.');
      });

      await audio.play();
    } catch (error) {
      setLoadingAudio(null);
      console.error('Audio play error:', error);
      alert('Ses oynatılırken hata oluştu.');
    }
  };

  const randomSurah = () => {
    if (surahs.length === 0) return;
    const randomIndex = Math.floor(Math.random() * surahs.length);
    const randomSurahData = surahs[randomIndex];
    window.location.href = `/surah/${randomSurahData.number}`;
  };

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
          
          window.location.href = `/surah/${surahId}#verse-${ayatNumber}`;
        } else {
          // Sure seviyesinde devam et
          const message = `${surahName} Suresinden devam ediliyor... (${daysSinceLastRead} gün önce okunmuş)`;
          const notification = document.createElement('div');
          notification.className = 'fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
          notification.textContent = message;
          document.body.appendChild(notification);
          setTimeout(() => document.body.removeChild(notification), 3000);
          
          window.location.href = `/surah/${surahId}`;
        }
      } catch (error) {
        // Fallback to old format
        const lastSurah = localStorage.getItem('lastReadSurah');
        if (lastSurah) {
          window.location.href = `/surah/${lastSurah}`;
        } else {
          alert('Henüz okumaya başlamadınız.');
        }
      }
    } else {
      // Fallback to old format
      const lastSurah = localStorage.getItem('lastReadSurah');
      if (lastSurah) {
        const surahInfo = surahDataMap[parseInt(lastSurah)];
        const surahName = surahInfo?.name || `Sure ${lastSurah}`;
        
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = `${surahName} Suresinden devam ediliyor...`;
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 3000);
        
        window.location.href = `/surah/${lastSurah}`;
      } else {
        alert('Henüz okumaya başlamadınız. Bir sure seçip okumaya başlayın.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Sureler yükleniyor...</p>
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
            onClick={loadSurahs}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Kur'an-ı Kerim Sureleri - 114 Sure Listesi | Online Kuran Okuma</title>
        <meta name="description" content="Kur'an-ı Kerim'in 114 suresinin tam listesi. Türkçe anlamları, ayet sayıları ve okunuş bilgileri ile birlikte. Meccan ve Medenî sureleri keşfedin." />
        <meta name="keywords" content="kuran sureleri, 114 sure, sure listesi, meccan sureler, medeni sureler, kuran oku, sure isimleri, arapça sureler" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Kur'an-ı Kerim Sureleri - 114 Sure Listesi" />
        <meta property="og:description" content="Kur'an-ı Kerim'in 114 suresinin tam listesi. Türkçe anlamları, ayet sayıları ve okunuş bilgileri ile birlikte." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Twitter Cards */}
        <meta name="twitter:title" content="Kur'an-ı Kerim Sureleri - 114 Sure Listesi" />
        <meta name="twitter:description" content="Kur'an-ı Kerim'in 114 suresinin tam listesi. Türkçe anlamları, ayet sayıları ve okunuş bilgileri ile birlikte." />
        
        {/* Canonical URL */}
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Kur'an-ı Kerim Sureleri",
            "description": "Kur'an-ı Kerim'in 114 suresinin tam listesi",
            "url": typeof window !== 'undefined' ? window.location.href : '',
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": 114,
              "name": "Kur'an Sureleri"
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
      <header className="bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-emerald-600 hover:text-emerald-800" />
              </Link>
              <h1 className="text-2xl font-bold text-emerald-800">Kuran-ı Kerim</h1>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('bookmarked')}
                className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Favoriler"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={() => setQuickActions(!quickActions)}
                className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Hızlı İşlemler"
              >
                <BookOpen className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Quick Actions */}
        {quickActions && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-emerald-200">
            <h3 className="font-semibold mb-3">Hızlı İşlemler</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={randomSurah}
                className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg hover:bg-emerald-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Rastgele Sure
              </button>
              <button
                onClick={continueReading}
                className="flex items-center gap-2 bg-teal-100 text-teal-700 px-3 py-2 rounded-lg hover:bg-teal-200 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Kaldığın Yerden Devam
              </button>
              <button
                onClick={() => { setFilter('bookmarked'); setQuickActions(false); }}
                className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Heart className="w-4 h-4" />
                Favorilerim
              </button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Sure ara... (örn: Fatiha, Bakara, Yasin)"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Tümü', icon: BookOpen },
              { key: 'mekki', label: 'Mekki', icon: BookOpen },
              { key: 'medeni', label: 'Medeni', icon: BookOpen },
              { key: 'short', label: 'Kısa', icon: Clock },
              { key: 'bookmarked', label: 'Favoriler', icon: Heart }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  filter === key
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
            <button
              onClick={() => { setSearchTerm(''); setFilter('all'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              title="Filtreleri Temizle"
            >
              <Filter className="w-4 h-4" />
              Temizle
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-gray-900">{filteredSurahs.length}</div>
            <div className="text-sm text-gray-600">Görüntülenen</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredSurahs.filter(s => s.revelationType === 'Meccan').length}
            </div>
            <div className="text-sm text-gray-600">Mekki</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-blue-600">
              {filteredSurahs.filter(s => s.revelationType === 'Medinan').length}
            </div>
            <div className="text-sm text-gray-600">Medeni</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-red-600">{bookmarkedSurahs.length}</div>
            <div className="text-sm text-gray-600">Favoriler</div>
          </div>
        </div>

        {/* Surah List */}
        <div className="space-y-3">
          {filteredSurahs.map((surah) => {
            const surahInfo = surahDataMap[surah.number];
            return (
              <SurahCard
                key={surah.number}
                id={surah.number}
                name={surahInfo?.name || surah.name}
                englishName={surah.englishName}
                arabicName={surahInfo?.arabic || surah.name}
                meaning={surahInfo?.meaning || surah.englishNameTranslation}
                ayahCount={surah.numberOfAyahs}
                revelationPlace={surah.revelationType === 'Meccan' ? 'Mekke' : 'Medine'}
                isBookmarked={bookmarkedSurahs.includes(surah.number)}
                onToggleBookmark={(e) => toggleBookmark(surah.number, e)}
                onPlayAudio={(e) => playAudio(surah.number, e)}
                isPlaying={playingSurah === surah.number}
                isLoading={loadingAudio === surah.number}
              />
            );
          })}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Sonuç bulunamadı</h3>
            <p className="text-gray-500">"{searchTerm}" için sonuç bulunamadı. Arama kriterlerinizi değiştirmeyi deneyin.</p>
            <button
              onClick={() => { setSearchTerm(''); setFilter('all'); }}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Tüm Sureleri Göster
            </button>
          </div>
        )}
      </div>
      </div>
    </>
  );
}

function SurahCard({ 
  id, 
  name, 
  englishName,
  arabicName, 
  meaning, 
  ayahCount, 
  revelationPlace,
  isBookmarked,
  onToggleBookmark,
  onPlayAudio,
  isPlaying,
  isLoading
}: SurahCardProps) {
  return (
    <Link to={`/surah/${id}`} className="block">
      <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
            {id}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
              <span className="text-lg text-gray-600 font-arabic">{arabicName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                revelationPlace === 'Mekke' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {revelationPlace}
              </span>
              <span>{ayahCount} Ayet</span>
              <span>•</span>
              <span className="text-gray-500">{meaning}</span>
              {ayahCount <= 20 && (
                <>
                  <span>•</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Kısa</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onPlayAudio}
              className="p-2 rounded-full transition-colors text-gray-400 hover:text-green-600"
              title={isPlaying ? "Durdur" : "Sesli Dinle"}
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
              title={isBookmarked ? "Favorilerden Çıkar" : "Favorilere Ekle"}
            >
              <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <div className="text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
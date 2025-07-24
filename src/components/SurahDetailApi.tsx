import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Heart, Share2, BookOpen, Play, Pause, Settings, Loader } from 'lucide-react';
import quranApi from '../services/quranApi';

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
}

interface SurahApiData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

export default function SurahDetail() {
  const { id } = useParams<{ id: string }>();
  const [surahData, setSurahData] = useState<SurahApiData | null>(null);
  const [translationData, setTranslationData] = useState<SurahApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [showTranslation, setShowTranslation] = useState(true);
  const [selectedTranslation, setSelectedTranslation] = useState('tr.diyanet');
  const [selectedReciter, setSelectedReciter] = useState('ar.alafasy');
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [favoriteVerses, setFavoriteVerses] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Turkish surah names mapping
  const turkishNames = useMemo(() => ({
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
  }), []) as { [key: number]: { name: string; meaning: string; arabic: string } };

  // Translation options
  const translationOptions = [
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

  // Reciter options
  const reciterOptions = [
    { value: 'ar.alafasy', label: 'Mishary Rashid Alafasy' },
    { value: 'ar.minshawi', label: 'Mohamed Siddiq el-Minshawi' },
    { value: 'ar.husary', label: 'Mahmoud Khalil Al-Husary' }
  ];

  useEffect(() => {
    // Load favorite verses from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('bookmark') || '[]');
    const favoriteKeys = new Set<string>(
      savedFavorites.map((bookmark: any) => `${bookmark.surah}:${bookmark.ayat}`)
    );
    setFavoriteVerses(favoriteKeys);

    // Check both bookmark systems for compatibility
    const simpleBookmarks = JSON.parse(localStorage.getItem('bookmarkedSurahs') || '[]');
    const detailedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const detailedSurahIds = detailedBookmarks.map((bookmark: any) => bookmark.surahId);
    
    const isBookmarkedInSimple = simpleBookmarks.includes(Number(id));
    const isBookmarkedInDetailed = detailedSurahIds.includes(Number(id));
    
    setIsBookmarked(isBookmarkedInSimple || isBookmarkedInDetailed);
    
    // Load saved settings from both sources
    const savedFontSize = localStorage.getItem('quranFontSize');
    const savedTranslation = localStorage.getItem('selectedTranslation');
    const savedShowTranslation = localStorage.getItem('showTranslation');
    const savedReciter = localStorage.getItem('selectedReciter');
    
    // Load from SettingsAdvanced if available
    const appSettings = localStorage.getItem('quranAppSettings');
    if (appSettings) {
      try {
        const settings = JSON.parse(appSettings);
        if (settings.fontSize) setFontSize(settings.fontSize);
        if (settings.selectedTranslation) setSelectedTranslation(settings.selectedTranslation);
        if (settings.showTranslation !== undefined) setShowTranslation(settings.showTranslation);
        if (settings.selectedReciter) setSelectedReciter(settings.selectedReciter);
      } catch (error) {
        console.error('Error loading app settings:', error);
      }
    } else {
      // Fallback to individual localStorage items
      if (savedFontSize) setFontSize(Number(savedFontSize));
      if (savedTranslation) setSelectedTranslation(savedTranslation);
      if (savedShowTranslation) setShowTranslation(savedShowTranslation === 'true');
      if (savedReciter) setSelectedReciter(savedReciter);
    }
    
    const loadSurahData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Load both Arabic and translation
        const [arabicData, translationResponse] = await Promise.all([
          quranApi.getSurahWithTranslation(Number(id), 'quran-uthmani'),
          quranApi.getSurahWithTranslation(Number(id), savedTranslation || selectedTranslation)
        ]);
        
        setSurahData(arabicData);
        setTranslationData(translationResponse);
        
        // Save reading progress with detailed information
        const surahName = turkishNames[Number(id)]?.name || arabicData.englishName;
        const readingPosition = {
          surahId: Number(id),
          surahName: surahName,
          ayatNumber: null, // Will be updated when user scrolls to specific verses
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('lastReadPosition', JSON.stringify(readingPosition));
        localStorage.setItem('lastReadSurah', id); // Keep for backward compatibility
        
      } catch (err) {
        setError('Sure yüklenirken bir hata oluştu. İnternet bağlantınızı kontrol edin.');
        console.error('Error loading surah:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSurahData();
  }, [id, selectedTranslation, turkishNames]);

  // Cleanup interval and audio on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  useEffect(() => {
    if (id && selectedTranslation) {
      const loadTranslationData = async () => {
        try {
          const response = await quranApi.getSurahWithTranslation(Number(id), selectedTranslation);
          setTranslationData(response);
        } catch (err) {
          console.error('Error loading translation:', err);
        }
      };
      loadTranslationData();
    }
  }, [id, selectedTranslation]);

  // Track reading progress based on scroll position
  useEffect(() => {
    if (!surahData || !id) return;

    const handleScroll = () => {
      const verses = document.querySelectorAll('[id^="verse-"]');
      let currentVerse = null;
      
      verses.forEach((verse) => {
        const rect = verse.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          currentVerse = verse.id.replace('verse-', '');
        }
      });

      if (currentVerse) {
        const surahName = turkishNames[Number(id)]?.name || surahData.englishName;
        const readingPosition = {
          surahId: Number(id),
          surahName: surahName,
          ayatNumber: Number(currentVerse),
          timestamp: new Date().toISOString()
        };
        
        // Debounce the localStorage update to avoid too frequent writes
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          localStorage.setItem('lastReadPosition', JSON.stringify(readingPosition));
        }, 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [surahData, id, turkishNames]);

  // Auto-scroll to verse from URL hash when component loads
  useEffect(() => {
    if (!surahData) return;

    const hash = window.location.hash;
    if (hash.startsWith('#verse-')) {
      const verseNumber = hash.replace('#verse-', '');
      
      // Wait a bit for the DOM to be fully rendered
      setTimeout(() => {
        const verseElement = document.getElementById(`verse-${verseNumber}`);
        if (verseElement) {
          verseElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
          
          // Highlight the verse briefly
          verseElement.style.transition = 'all 0.3s ease';
          verseElement.style.backgroundColor = '#dcfce7';
          verseElement.style.borderColor = '#16a34a';
          verseElement.style.borderWidth = '2px';
          verseElement.style.transform = 'scale(1.02)';
          
          setTimeout(() => {
            verseElement.style.backgroundColor = '';
            verseElement.style.borderColor = '';
            verseElement.style.borderWidth = '';
            verseElement.style.transform = '';
          }, 2000);
        }
      }, 500);
    }
  }, [surahData]);

  const loadSurah = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Load both Arabic and translation
      const [arabicData, translationResponse] = await Promise.all([
        quranApi.getSurahWithTranslation(Number(id), 'quran-uthmani'),
        quranApi.getSurahWithTranslation(Number(id), selectedTranslation)
      ]);
      
      setSurahData(arabicData);
      setTranslationData(translationResponse);
      
      // Save reading progress
      localStorage.setItem('lastReadSurah', id);
      
    } catch (err) {
      setError('Sure yüklenirken bir hata oluştu. İnternet bağlantınızı kontrol edin.');
      console.error('Error loading surah:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ayet favorilere ekleme fonksiyonu
  const bookmarkVerse = (surahNumber: number, ayahNumber: number) => {
    const bookmarkKey = `${surahNumber}:${ayahNumber}`;
    const bookmarkObj = {
      surah: surahNumber.toString(),
      ayat: ayahNumber.toString()
    };
    
    const existingBookmarks = JSON.parse(localStorage.getItem("bookmark") || "[]");
    const isBookmarked = existingBookmarks.some((bookmark: any) => 
      bookmark.surah === bookmarkObj.surah && bookmark.ayat === bookmarkObj.ayat
    );
    
    if (!isBookmarked) {
      existingBookmarks.push(bookmarkObj);
      localStorage.setItem("bookmark", JSON.stringify(existingBookmarks));
      
      // Update state
      const newFavorites = new Set(favoriteVerses);
      newFavorites.add(bookmarkKey);
      setFavoriteVerses(newFavorites);
      
      
    } else {
      // Remove from favorites
      const updatedBookmarks = existingBookmarks.filter((bookmark: any) => 
        !(bookmark.surah === bookmarkObj.surah && bookmark.ayat === bookmarkObj.ayat)
      );
      localStorage.setItem("bookmark", JSON.stringify(updatedBookmarks));
      
      // Update state
      const newFavorites = new Set(favoriteVerses);
      newFavorites.delete(bookmarkKey);
      setFavoriteVerses(newFavorites);
      
     
    }
  };

  // Ayet paylaşma fonksiyonu
  const shareVerse = async (surahName: string, surahNumber: number, ayahNumber: number, ayahText: string) => {
    const shareText = `${surahName} Suresi ${ayahNumber}. Ayet:\n\n${ayahText}`;
    const shareUrl = `${window.location.origin}/surah/${surahNumber}#verse-${ayahNumber}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${surahName} Suresi ${ayahNumber}. Ayet`,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        } catch (error) {
        }
      } else {
        alert('Paylaşım için lütfen URL\'yi kopyalayın:\n' + shareUrl);}
    }
  };

  const toggleBookmark = () => {
    if (!id) return;
    
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedSurahs') || '[]');
    const surahId = Number(id);
    
    const newBookmarks = isBookmarked
      ? bookmarks.filter((bid: number) => bid !== surahId)
      : [...bookmarks, surahId];
    
    setIsBookmarked(!isBookmarked);
    localStorage.setItem('bookmarkedSurahs', JSON.stringify(newBookmarks));
    
    // Also update detailed bookmarks for compatibility with Bookmark.tsx
    const detailedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    if (isBookmarked) {
      // Remove from detailed bookmarks
      const updatedDetailedBookmarks = detailedBookmarks.filter((bookmark: any) => bookmark.surahId !== surahId);
      localStorage.setItem('bookmarks', JSON.stringify(updatedDetailedBookmarks));
    } else {
      // Add to detailed bookmarks
      const surahInfo = turkishNames[surahId];
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

  const handleShare = async () => {
    const surahInfo = turkishNames[Number(id!)];
    const shareData = {
      title: `${surahInfo?.name || 'Kuran-ı Kerim'} Suresi`,
      text: `${surahInfo?.name || 'Kuran-ı Kerim'} suresini okuyun`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link panoya kopyalandı!');
    }
  };

  const playAudio = async () => {
    if (!id || !surahData) return;

    // Stop current audio if playing
    if (isPlaying && currentAudio) {
      stopAudio();
      return;
    }

    // Start playing from first verse
    playVerseAudio(0);
  };

  const playVerseAudio = async (verseIndex: number) => {
    if (!id || !surahData) return;

    try {
      setAudioLoading(true);
      setIsReadingMode(true);
      
      // Stop any existing audio first
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.remove && currentAudio.remove(); // Remove if method exists
      }

      console.log(`Attempting to play verse ${verseIndex + 1} of ${surahData.numberOfAyahs}`);
      
      // Get the ayah number for API call
      const ayahNumber = surahData.ayahs[verseIndex].number;
      
      // Try direct audio URL approach first using selected reciter
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/${selectedReciter}/${ayahNumber}.mp3`;
      console.log(`Direct audio URL: ${audioUrl}`);
      
      // Create new audio element
      const audio = new Audio(audioUrl);
      
      // Create a single set of event handlers to avoid duplication
      const handleCanPlay = () => {
        console.log(`Verse ${verseIndex + 1} ready to play`);
        setAudioLoading(false);
        setIsPlaying(true);
        setCurrentAudio(audio);
        setActiveVerse(verseIndex + 1);
        
        // Scroll to active verse
        scrollToVerse(verseIndex + 1);
      };

      const handleEnded = () => {
        console.log(`Verse ${verseIndex + 1} ended, total verses: ${surahData.numberOfAyahs}`);
        
        // Clean up current audio
        setCurrentAudio(null);
        
        // Check if there are more verses
        if (verseIndex + 1 < surahData.numberOfAyahs) {
          console.log(`Moving to next verse: ${verseIndex + 2}`);
          // Play next verse automatically
          setTimeout(() => {
            playVerseAudio(verseIndex + 1);
          }, 800);
        } else {
          console.log('All verses completed');
          stopAudio();
        }
      };

      const handleError = (e: Event) => {
        console.error(`Audio error for verse ${verseIndex + 1}:`, e);
        setAudioLoading(false);
        setCurrentAudio(null);
        
        // Try API approach as fallback
        tryApiAudioFallback(verseIndex, ayahNumber);
      };

      const handleLoadedData = () => {
        console.log(`Verse ${verseIndex + 1} data loaded successfully`);
      };

      // Add event listeners once
      audio.addEventListener('canplay', handleCanPlay, { once: true });
      audio.addEventListener('ended', handleEnded, { once: true });
      audio.addEventListener('error', handleError, { once: true });
      audio.addEventListener('loadeddata', handleLoadedData, { once: true });

      // Try to play
      await audio.play();
      console.log(`Verse ${verseIndex + 1} started playing`);

    } catch (error) {
      console.error(`Error playing verse ${verseIndex + 1}:`, error);
      setAudioLoading(false);
      setCurrentAudio(null);
      
      // Try API approach as fallback
      if (surahData) {
        tryApiAudioFallback(verseIndex, surahData.ayahs[verseIndex].number);
      }
    }
  };

  const tryApiAudioFallback = async (verseIndex: number, ayahNumber: number) => {
    try {
      console.log(`Trying API fallback for verse ${verseIndex + 1}`);
      
      const apiUrl = `https://api.alquran.cloud/v1/ayah/${ayahNumber}/${selectedReciter}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.data && data.data.audio) {
        console.log(`API fallback successful for verse ${verseIndex + 1}`);
        
        const audio = new Audio(data.data.audio);
        
        // Set up event listeners with { once: true } to prevent duplication
        audio.addEventListener('canplay', () => {
          setAudioLoading(false);
          setIsPlaying(true);
          setCurrentAudio(audio);
          setActiveVerse(verseIndex + 1);
          scrollToVerse(verseIndex + 1);
        }, { once: true });

        audio.addEventListener('ended', () => {
          console.log(`API audio verse ${verseIndex + 1} ended`);
          setCurrentAudio(null);
          
          if (surahData && verseIndex + 1 < surahData.numberOfAyahs) {
            setTimeout(() => {
              playVerseAudio(verseIndex + 1);
            }, 800);
          } else {
            stopAudio();
          }
        }, { once: true });

        audio.addEventListener('error', () => {
          console.error(`API audio failed for verse ${verseIndex + 1}`);
          setCurrentAudio(null);
          skipToNextVerse(verseIndex);
        }, { once: true });

        await audio.play();
      } else {
        console.error(`No audio data from API for verse ${verseIndex + 1}`);
        skipToNextVerse(verseIndex);
      }
    } catch (error) {
      console.error(`API fallback failed for verse ${verseIndex + 1}:`, error);
      skipToNextVerse(verseIndex);
    }
  };

  const skipToNextVerse = (verseIndex: number) => {
    console.log(`Skipping verse ${verseIndex + 1}`);
    setAudioLoading(false);
    setCurrentAudio(null);
    
    if (surahData && verseIndex + 1 < surahData.numberOfAyahs) {
      setTimeout(() => {
        playVerseAudio(verseIndex + 1);
      }, 1000);
    } else {
      stopAudio();
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    setIsPlaying(false);
    setIsReadingMode(false);
    setActiveVerse(null);
    setAudioLoading(false);
    setCurrentAudio(null);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const scrollToVerse = (verseNumber: number) => {
    const verseElement = document.querySelector(`[data-verse="${verseNumber}"]`);
    if (verseElement) {
      verseElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  };

  const handleVerseClick = (verseNumber: number) => {
    if (isReadingMode) {
      // If in reading mode, stop audio
      stopAudio();
      return;
    }
    
    // If not in reading mode, either start playing from this verse or just select it
    if (isPlaying) {
      stopAudio();
    } else {
      // Start playing from clicked verse
      playVerseAudio(verseNumber - 1); // Convert to 0-based index
    }
  };

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(12, Math.min(32, fontSize + delta));
    setFontSize(newSize);
    
    // Save to both individual localStorage and app settings
    localStorage.setItem('quranFontSize', newSize.toString());
    
    // Update app settings if they exist
    const appSettings = localStorage.getItem('quranAppSettings');
    if (appSettings) {
      try {
        const settings = JSON.parse(appSettings);
        settings.fontSize = newSize;
        localStorage.setItem('quranAppSettings', JSON.stringify(settings));
      } catch (error) {
        console.error('Error updating app settings:', error);
      }
    }
  };

  const saveSettings = () => {
    // Save to individual localStorage items
    localStorage.setItem('selectedTranslation', selectedTranslation);
    localStorage.setItem('showTranslation', showTranslation.toString());
    localStorage.setItem('selectedReciter', selectedReciter);
    
    // Update app settings if they exist
    const appSettings = localStorage.getItem('quranAppSettings');
    if (appSettings) {
      try {
        const settings = JSON.parse(appSettings);
        settings.selectedTranslation = selectedTranslation;
        settings.showTranslation = showTranslation;
        settings.fontSize = fontSize;
        settings.selectedReciter = selectedReciter;
        localStorage.setItem('quranAppSettings', JSON.stringify(settings));
      } catch (error) {
        console.error('Error updating app settings:', error);
      }
    }
    
    setShowSettings(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Sure yükleniyor...</p>
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
          <div className="flex gap-2 justify-center">
            <button
              onClick={loadSurah}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Tekrar Dene
            </button>
            <Link 
              to="/surah-list"
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Geri Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!surahData) return null;

  const surahInfo = turkishNames[Number(id!)];
  const displayName = surahInfo?.name || surahData.name;
  const arabicName = surahInfo?.arabic || surahData.name;
  const meaning = surahInfo?.meaning || surahData.englishNameTranslation;
  const surahNumber = surahData.number;
  const currentPageUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
      <Helmet>
        <title>{`${displayName} Suresi - ${meaning} | Kur'an-ı Kerim`}</title>
        <meta name="description" content={`${displayName} Suresi (${meaning}) - ${surahData.numberOfAyahs} ayet, ${surahData.revelationType === 'Meccan' ? 'Mekkî' : 'Medenî'} sure. Arapça metin ve Türkçe meal ile birlikte okuyun.`} />
        <meta name="keywords" content={`${displayName} suresi, ${displayName} suresi türkçe, ${displayName} suresi meali, ${meaning}, kuran ${surahNumber}. sure, arapça ${displayName} suresi`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${displayName} Suresi - ${meaning} | Kur'an-ı Kerim`} />
        <meta property="og:description" content={`${displayName} Suresi (${meaning}) - ${surahData.numberOfAyahs} ayet, ${surahData.revelationType === 'Meccan' ? 'Mekkî' : 'Medenî'} sure. Arapça metin ve Türkçe meal ile birlikte okuyun.`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentPageUrl} />
        <meta property="article:section" content="Kur'an Sureleri" />
        <meta property="article:tag" content={`${displayName} Suresi`} />
        
        {/* Twitter Cards */}
        <meta name="twitter:title" content={`${displayName} Suresi - ${meaning}`} />
        <meta name="twitter:description" content={`${displayName} Suresi (${meaning}) - ${surahData.numberOfAyahs} ayet, ${surahData.revelationType === 'Meccan' ? 'Mekkî' : 'Medenî'} sure.`} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={currentPageUrl} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `${displayName} Suresi - ${meaning}`,
            "description": `${displayName} Suresi (${meaning}) - ${surahData.numberOfAyahs} ayet`,
            "url": currentPageUrl,
            "author": {
              "@type": "Organization",
              "name": "Kur'an-ı Kerim"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Kur'an-ı Kerim"
            },
            "mainEntity": {
              "@type": "CreativeWork",
              "name": `${displayName} Suresi`,
              "alternateName": arabicName,
              "description": meaning,
              "inLanguage": ["ar", "tr"],
              "isPartOf": {
                "@type": "Book",
                "name": "Kur'an-ı Kerim"
              }
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
              <Link to="/surah-list" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-emerald-600 hover:text-emerald-800" />
              </Link>
              <h1 className="text-2xl font-bold text-emerald-800">
                {displayName}
                <span className="text-xl font-arabic ml-3 text-teal-700">{arabicName}</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Ayarlar"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={playAudio}
                disabled={audioLoading}
                className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                title={isPlaying ? "Durdur" : "Sesli Dinle"}
              >
                {audioLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={toggleBookmark}
                className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                title={isBookmarked ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              >
                <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-current text-red-500' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Paylaş"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Surah Info */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <span className={`px-3 py-1 rounded-full text-sm ${
                surahData.revelationType === 'Meccan' 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {surahData.revelationType === 'Meccan' ? 'Mekki' : 'Medeni'}
              </span>
              <span>•</span>
              <span>{surahData.numberOfAyahs} Ayet</span>
              <span>•</span>
              <span>{meaning}</span>
              {isReadingMode && (
                <>
                  <span>•</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-sm animate-pulse">
                    🔊 Sesli Okuma Aktif
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Okuma Ayarları</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yazı Boyutu
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => changeFontSize(-2)}
                    className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium">{fontSize}px</span>
                  <button
                    onClick={() => changeFontSize(2)}
                    className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Seçimi
                </label>
                <select
                  value={selectedTranslation}
                  onChange={(e) => {
                    const newTranslation = e.target.value;
                    console.log('Translation changed from', selectedTranslation, 'to', newTranslation);
                    setSelectedTranslation(newTranslation);
                    
                    // Save to both individual localStorage and app settings
                    localStorage.setItem('selectedTranslation', newTranslation);
                    
                    // Update app settings if they exist
                    const appSettings = localStorage.getItem('quranAppSettings');
                    if (appSettings) {
                      try {
                        const settings = JSON.parse(appSettings);
                        settings.selectedTranslation = newTranslation;
                        localStorage.setItem('quranAppSettings', JSON.stringify(settings));
                      } catch (error) {
                        console.error('Error updating app settings:', error);
                      }
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ses Kaydı (Kari)
                </label>
                <select
                  value={selectedReciter}
                  onChange={(e) => {
                    const newReciter = e.target.value;
                    console.log('Reciter changed from', selectedReciter, 'to', newReciter);
                    setSelectedReciter(newReciter);
                    
                    // Save to both individual localStorage and app settings
                    localStorage.setItem('selectedReciter', newReciter);
                    
                    // Update app settings if they exist
                    const appSettings = localStorage.getItem('quranAppSettings');
                    if (appSettings) {
                      try {
                        const settings = JSON.parse(appSettings);
                        settings.selectedReciter = newReciter;
                        localStorage.setItem('quranAppSettings', JSON.stringify(settings));
                      } catch (error) {
                        console.error('Error updating app settings:', error);
                      }
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {reciterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showTranslation}
                    onChange={(e) => setShowTranslation(e.target.checked)}
                    className="w-4 h-4 text-emerald-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Meal Göster</span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={saveSettings}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Kaydet
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Bismillah */}
        {Number(id) !== 1 && Number(id) !== 9 && (
          <div className={`
            bg-white rounded-xl shadow-md p-8 mb-6 text-center transition-all duration-500
            ${activeVerse === 0 ? 'shadow-2xl scale-105 border-2 border-emerald-500 bg-emerald-50' : ''}
          `}>
            <p className={`
              text-2xl font-arabic leading-relaxed transition-all duration-300
              ${activeVerse === 0 ? 'text-emerald-800' : 'text-gray-800'}
            `} style={{ fontSize: fontSize + 4 }}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            {showTranslation && (
              <p className={`
                mt-3 text-lg transition-all duration-300
                ${activeVerse === 0 ? 'text-emerald-700 font-medium' : 'text-gray-600'}
              `}>
                Rahman ve Rahim olan Allah'ın adıyla
              </p>
            )}
          </div>
        )}

        {/* Ayahs */}
        <div className="space-y-6">
          {surahData.ayahs.map((ayah, index) => {
            const translationAyah = translationData?.ayahs[index];
            const isActive = activeVerse === ayah.numberInSurah;
            
            return (
              <div 
                key={ayah.number} 
                id={`verse-${ayah.numberInSurah}`}
                data-verse={ayah.numberInSurah}
                onClick={() => handleVerseClick(ayah.numberInSurah)}
                className={`
                  bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all duration-500
                  ${isActive 
                    ? 'shadow-2xl scale-105 transform border-2 border-emerald-500 bg-emerald-50' 
                    : 'hover:shadow-lg hover:scale-101'
                  }
                `}
              >
                {/* Verse indicator */}
                {isActive && (
                  <div className="mb-4 text-center">
                    <span className="inline-block bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                      {isReadingMode ? '🔊 Sesli Okuma' : '📖 Aktif Ayet'}
                    </span>
                  </div>
                )}

                {/* Verse Actions */}
                <div className="flex justify-between items-center mb-4">
                  <span className={`
                    inline-block w-8 h-8 rounded-full text-sm leading-8 text-center transition-all duration-300
                    ${isActive 
                      ? 'bg-emerald-600 text-white scale-110 shadow-lg' 
                      : 'bg-emerald-600 text-white'
                    }
                  `}>
                    {ayah.numberInSurah}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        bookmarkVerse(Number(id!), ayah.numberInSurah);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        favoriteVerses.has(`${id}:${ayah.numberInSurah}`)
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={favoriteVerses.has(`${id}:${ayah.numberInSurah}`) ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                    >
                      <Heart className={`w-4 h-4 ${favoriteVerses.has(`${id}:${ayah.numberInSurah}`) ? 'fill-current' : ''}`} />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareVerse(displayName, Number(id!), ayah.numberInSurah, ayah.text);
                      }}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      title="Ayeti Paylaş"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <div className="text-right mb-4">
                  <p 
                    className={`
                      font-arabic text-gray-800 leading-loose transition-all duration-300
                      ${isActive ? 'text-emerald-800' : ''}
                    `}
                    style={{ fontSize: fontSize + 6 }}
                  >
                    {ayah.text}
                  </p>
                </div>

                {/* Translation */}
                {showTranslation && translationAyah && (
                  <div className={`
                    border-t pt-4 transition-all duration-300
                    ${isActive ? 'border-emerald-200 bg-emerald-25' : 'border-gray-100'}
                  `}>
                    <p 
                      className={`
                        leading-relaxed transition-all duration-300
                        ${isActive ? 'text-emerald-800 font-medium' : 'text-gray-700'}
                      `}
                      style={{ fontSize: fontSize }}
                    >
                      {translationAyah.text}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          {Number(id) > 1 && (
            <Link
              to={`/surah/${Number(id) - 1}`}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Önceki Sure
            </Link>
          )}
          
          <Link
            to="/surah-list"
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors mx-auto"
          >
            <BookOpen className="w-4 h-4" />
            Sure Listesi
          </Link>

          {Number(id) < 114 && (
            <Link
              to={`/surah/${Number(id) + 1}`}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Sonraki Sure
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

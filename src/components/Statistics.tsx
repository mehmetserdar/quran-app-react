import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Clock, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Award, 
  Target,
  Home,
  Star,
  Activity,
  Flame,
  Trophy,
  Zap,
  Users,
  Timer,
  BookmarkIcon
} from 'lucide-react';

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

interface UserStatistics {
  totalReadingSessions: number;
  totalReadingTime: number; // dakika cinsinden
  surahsRead: Set<number>;
  mostReadSurah: { surahId: number; count: number };
  readingDays: Set<string>; // YYYY-MM-DD formatında
  lastReadDate: string;
  longestSession: number; // dakika cinsinden
  averageSessionTime: number;
  totalAyahsRead: number;
  bookmarksCount: number;
  duasRead: number;
  counterClicks: number;
  currentStreak: number; // günlük okuma serisi
  longestStreak: number;
}

interface DailyReading {
  date: string;
  surahsRead: number[];
  timeSpent: number;
  ayahsRead: number;
}

const Statistics: React.FC = () => {
  const [statistics, setStatistics] = useState<UserStatistics>({
    totalReadingSessions: 0,
    totalReadingTime: 0,
    surahsRead: new Set(),
    mostReadSurah: { surahId: 1, count: 0 },
    readingDays: new Set(),
    lastReadDate: '',
    longestSession: 0,
    averageSessionTime: 0,
    totalAyahsRead: 0,
    bookmarksCount: 0,
    duasRead: 0,
    counterClicks: 0,
    currentStreak: 0,
    longestStreak: 0
  });

  const [dailyReadings, setDailyReadings] = useState<DailyReading[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  // LocalStorage'dan istatistikleri yükle
  const loadStatistics = () => {
    try {
      // Okuma seansları
      const readingSessions = JSON.parse(localStorage.getItem('readingSessions') || '[]');
      
      // Yer imleri
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      
      // Zikirmatik verileri
      const counterData = JSON.parse(localStorage.getItem('counterData') || '{}');
      const totalClicks = Object.values(counterData).reduce((sum: number, count) => sum + (count as number), 0);
      
      // Dua okuma verileri
      const duaHistory = JSON.parse(localStorage.getItem('duaHistory') || '[]');
      
      // Günlük okuma verileri
      const dailyStats = JSON.parse(localStorage.getItem('dailyReadingStats') || '[]');
      
      if (readingSessions.length === 0) {
        // Eğer yeni veri yoksa eski formatı kontrol et
        const lastReadPosition = localStorage.getItem('lastReadPosition');
        const lastReadSurah = localStorage.getItem('lastReadSurah');
        
        if (lastReadPosition || lastReadSurah) {
          // Varsayılan istatistikler oluştur
          const defaultStats: UserStatistics = {
            totalReadingSessions: 1,
            totalReadingTime: 15, // varsayılan
            surahsRead: new Set([parseInt(lastReadSurah || '1')]),
            mostReadSurah: { surahId: parseInt(lastReadSurah || '1'), count: 1 },
            readingDays: new Set([new Date().toISOString().split('T')[0]]),
            lastReadDate: lastReadPosition ? JSON.parse(lastReadPosition).timestamp : new Date().toISOString(),
            longestSession: 15,
            averageSessionTime: 15,
            totalAyahsRead: 10,
            bookmarksCount: bookmarks.length,
            duasRead: duaHistory.length,
            counterClicks: totalClicks,
            currentStreak: 1,
            longestStreak: 1
          };
          setStatistics(defaultStats);
          return;
        }
      }

      // Detaylı istatistik hesaplamaları
      const surahReadCounts: { [key: number]: number } = {};
      const readingDaysSet = new Set<string>();
      let totalTime = 0;
      let totalAyahs = 0;
      let longestSession = 0;

      readingSessions.forEach((session: any) => {
        if (session.surahId) {
          surahReadCounts[session.surahId] = (surahReadCounts[session.surahId] || 0) + 1;
        }
        if (session.date) {
          readingDaysSet.add(session.date.split('T')[0]);
        }
        if (session.timeSpent) {
          totalTime += session.timeSpent;
          longestSession = Math.max(longestSession, session.timeSpent);
        }
        if (session.ayahsRead) {
          totalAyahs += session.ayahsRead;
        }
      });

      // En çok okunan sure
      let mostRead = { surahId: 1, count: 0 };
      Object.entries(surahReadCounts).forEach(([surahId, count]) => {
        if (count > mostRead.count) {
          mostRead = { surahId: parseInt(surahId), count };
        }
      });

      // Günlük okuma serisi hesapla
      const sortedDays = Array.from(readingDaysSet).sort().reverse();
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Bugün veya dün okuduysa seriyi başlat
      if (sortedDays.includes(today) || sortedDays.includes(yesterday)) {
        currentStreak = 1;
        
        // Ardışık günleri say
        for (let i = 1; i < sortedDays.length; i++) {
          const currentDay = new Date(sortedDays[i-1]);
          const nextDay = new Date(sortedDays[i]);
          const dayDiff = (currentDay.getTime() - nextDay.getTime()) / (1000 * 60 * 60 * 24);
          
          if (dayDiff === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      // En uzun seriyi hesapla
      tempStreak = 1;
      for (let i = 1; i < sortedDays.length; i++) {
        const currentDay = new Date(sortedDays[i-1]);
        const nextDay = new Date(sortedDays[i]);
        const dayDiff = (currentDay.getTime() - nextDay.getTime()) / (1000 * 60 * 60 * 24);
        
        if (dayDiff === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }

      const calculatedStats: UserStatistics = {
        totalReadingSessions: readingSessions.length,
        totalReadingTime: totalTime,
        surahsRead: new Set(Object.keys(surahReadCounts).map(Number)),
        mostReadSurah: mostRead,
        readingDays: readingDaysSet,
        lastReadDate: readingSessions[readingSessions.length - 1]?.date || '',
        longestSession,
        averageSessionTime: readingSessions.length > 0 ? totalTime / readingSessions.length : 0,
        totalAyahsRead: totalAyahs,
        bookmarksCount: bookmarks.length,
        duasRead: duaHistory.length,
        counterClicks: totalClicks,
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak)
      };

      setStatistics(calculatedStats);
      setDailyReadings(dailyStats);

    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
    }
  };

  // Başarı seviyeleri
  const getAchievements = () => {
    const achievements = [];
    
    if (statistics.totalReadingSessions >= 1) {
      achievements.push({ title: "İlk Adım", description: "İlk okuma seansınızı tamamladınız", icon: "🎯" });
    }
    if (statistics.totalReadingSessions >= 10) {
      achievements.push({ title: "Düzenli Okuyucu", description: "10 okuma seansı tamamlandı", icon: "📚" });
    }
    if (statistics.totalReadingSessions >= 50) {
      achievements.push({ title: "Kur'an Dostu", description: "50 okuma seansı tamamlandı", icon: "⭐" });
    }
    if (statistics.surahsRead.size >= 10) {
      achievements.push({ title: "Sure Kaşifi", description: "10 farklı sure okudunuz", icon: "🔍" });
    }
    if (statistics.surahsRead.size >= 50) {
      achievements.push({ title: "Kur'an Alimi", description: "50 farklı sure okudunuz", icon: "🎓" });
    }
    if (statistics.currentStreak >= 7) {
      achievements.push({ title: "Haftalık Seri", description: "7 gün ardışık okuma", icon: "🔥" });
    }
    if (statistics.currentStreak >= 30) {
      achievements.push({ title: "Aylık Seri", description: "30 gün ardışık okuma", icon: "🏆" });
    }
    if (statistics.totalReadingTime >= 60) {
      achievements.push({ title: "Saat Tamamlandı", description: "1 saat okuma süresi", icon: "⏰" });
    }
    if (statistics.totalReadingTime >= 600) {
      achievements.push({ title: "On Saatlik Yolcu", description: "10 saat okuma süresi", icon: "⚡" });
    }
    
    return achievements;
  };

  // Haftalık/aylık progress hesapla
  const getReadingProgress = () => {
    const now = new Date();
    const daysToShow = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
    const progress = [];

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = date.toISOString().split('T')[0];
      const dayData = dailyReadings.find(d => d.date === dateString);
      
      progress.push({
        date: dateString,
        day: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
        hasReading: !!dayData,
        timeSpent: dayData?.timeSpent || 0,
        surahsCount: dayData?.surahsRead?.length || 0
      });
    }

    return progress;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}s ${mins}dk`;
    }
    return `${mins}dk`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  const achievements = getAchievements();
  const readingProgress = getReadingProgress();

  return (
    <>
      <Helmet>
        <title>İstatistikler - Kur'an-ı Kerim Okuma Geçmişi</title>
        <meta name="description" content="Kişisel okuma istatistikleriniz, başarılarınız ve ilerlemenizi takip edin. Toplam okuma süresi, okunan sureler ve günlük okuma alışkanlıklarınız." />
        <meta name="keywords" content="kuran okuma istatistikleri, okuma geçmişi, kişisel takip, başarılar, okuma süresi, sure istatistikleri" />
        
        {/* Open Graph */}
        <meta property="og:title" content="İstatistikler - Kur'an-ı Kerim Okuma Geçmişi" />
        <meta property="og:description" content="Kişisel okuma istatistikleriniz ve başarılarınızı görüntüleyin" />
        <meta property="og:type" content="website" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "İstatistikler - Kur'an-ı Kerim",
            "description": "Kişisel okuma istatistikleri ve başarı takibi",
            "isPartOf": {
              "@type": "WebSite",
              "name": "Kur'an-ı Kerim"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <Home className="w-5 h-5 mr-2" />
                  <span>Ana Sayfa</span>
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium">İstatistikler</span>
              </div>
            </div>
            
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-8 h-8 mr-3 text-emerald-600" />
                Okuma İstatistiklerim
              </h1>
              <p className="text-gray-600 mt-2">
                Kur'an okuma alışkanlıklarınız ve kişisel gelişiminizi takip edin
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Ana İstatistik Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Toplam Okuma Süresi */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Okuma Süresi</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {formatTime(statistics.totalReadingTime)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <TrendingUp className="w-4 h-4 mr-1" />
                Ortalama: {formatTime(statistics.averageSessionTime)}
              </div>
            </div>

            {/* Okunan Sure Sayısı */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Okunan Sure Sayısı</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {statistics.surahsRead.size}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Target className="w-4 h-4 mr-1" />
                Hedef: 114 Sure
              </div>
            </div>

            {/* Günlük Okuma Serisi */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Günlük Seri</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {statistics.currentStreak}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Award className="w-4 h-4 mr-1" />
                Rekor: {statistics.longestStreak} gün
              </div>
            </div>

            {/* Toplam Ayet */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Okunan Ayet</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {statistics.totalAyahsRead.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Target className="w-4 h-4 mr-1" />
                Hedef: 6,236 Ayet
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Sol kolon - İlerleme ve Grafikler */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Haftalık/Aylık İlerleme */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-emerald-600" />
                    Okuma Aktivitesi
                  </h2>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setSelectedPeriod('week')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        selectedPeriod === 'week' 
                          ? 'bg-white text-emerald-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Hafta
                    </button>
                    <button
                      onClick={() => setSelectedPeriod('month')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        selectedPeriod === 'month' 
                          ? 'bg-white text-emerald-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Ay
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                  {readingProgress.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{day.day}</div>
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                          day.hasReading
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                        title={day.hasReading ? `${day.timeSpent} dk okuma` : 'Okuma yok'}
                      >
                        {day.hasReading ? '✓' : '○'}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Bu {selectedPeriod === 'week' ? 'hafta' : 'ay'} {readingProgress.filter(d => d.hasReading).length} gün okudunuz</span>
                    <span>Toplam: {formatTime(readingProgress.reduce((sum, d) => sum + d.timeSpent, 0))}</span>
                  </div>
                </div>
              </div>

              {/* En Çok Okunan Sureler */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                  En Çok Okuduklarım
                </h2>
                
                {statistics.mostReadSurah.count > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                          1
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {surahNames[statistics.mostReadSurah.surahId]} Suresi
                          </h3>
                          <p className="text-sm text-gray-600">
                            {statistics.mostReadSurah.count} kez okundu
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/surah/${statistics.mostReadSurah.surahId}`}
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Oku →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Henüz okuma geçmişi bulunmuyor</p>
                    <Link to="/surah-list" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      Okumaya başlayın →
                    </Link>
                  </div>
                )}
              </div>

              {/* Diğer İstatistikler */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-500" />
                  Diğer Aktiviteler
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <BookmarkIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{statistics.bookmarksCount}</div>
                    <div className="text-sm text-gray-600">Yer İmi</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Timer className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{statistics.duasRead}</div>
                    <div className="text-sm text-gray-600">Dua Okundu</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">{statistics.counterClicks.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Zikirmatik</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ kolon - Başarılar ve Bilgiler */}
            <div className="space-y-6">
              
              {/* Başarılar */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-500" />
                  Başarılarım
                </h2>
                
                {achievements.length > 0 ? (
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                        <div className="text-2xl mr-3">{achievement.icon}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Henüz başarı kazanılmadı</p>
                    <p className="text-sm">Okumaya devam edin!</p>
                  </div>
                )}
              </div>

              {/* Son Aktivite */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
                  Son Aktivite
                </h2>
                
                {statistics.lastReadDate ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Son okuma:</span>
                      <span className="font-medium">{formatDate(statistics.lastReadDate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">En uzun seans:</span>
                      <span className="font-medium">{formatTime(statistics.longestSession)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Toplam seans:</span>
                      <span className="font-medium">{statistics.totalReadingSessions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Aktif günler:</span>
                      <span className="font-medium">{statistics.readingDays.size} gün</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Henüz aktivite yok</p>
                    <Link to="/surah-list" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      İlk okumanızı yapın →
                    </Link>
                  </div>
                )}
              </div>

              {/* Motivasyon Kartı */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-sm p-6 text-white">
                <h2 className="text-xl font-semibold mb-4">💪 Motivasyon</h2>
                <div className="space-y-3">
                  {statistics.surahsRead.size < 10 && (
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-sm">🎯 Hedef: 10 sure okuyun</p>
                      <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                        <div 
                          className="bg-white rounded-full h-2 transition-all"
                          style={{ width: `${Math.min((statistics.surahsRead.size / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {statistics.currentStreak === 0 && (
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-sm">🔥 Günlük okuma serinizi başlatın!</p>
                    </div>
                  )}
                  
                  {statistics.totalReadingTime < 60 && (
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-sm">⏱️ 1 saate {Math.ceil(60 - statistics.totalReadingTime)} dakika</p>
                      <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                        <div 
                          className="bg-white rounded-full h-2 transition-all"
                          style={{ width: `${Math.min((statistics.totalReadingTime / 60) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistics;

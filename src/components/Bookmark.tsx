import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Bookmark as BookmarkIcon, Heart, Trash2, BookOpen } from 'lucide-react';
import { sureData } from '../data/sureData';
import { duaData } from '../data/duaData';
import type { Bookmark as BookmarkType } from '../types';

const Bookmark: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);

  const getSurahInfo = (surahId: number) => {
    return sureData.find(s => s.id === surahId);
  };

  const getDuaInfo = (duaId: number) => {
    return duaData.find(d => d.id === duaId);
  };

  const loadBookmarks = useCallback(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    // Ayet favorilerini de ekle
    const verseBookmarks = JSON.parse(localStorage.getItem('bookmark') || '[]');
    const verseBookmarkObjects = verseBookmarks.map((verse: {surah: string, ayat: string}) => ({
      id: `verse_${verse.surah}_${verse.ayat}_${Date.now()}`,
      surahId: parseInt(verse.surah),
      ayatNumber: parseInt(verse.ayat),
      surahName: getSurahInfo(parseInt(verse.surah))?.name || `Sure ${verse.surah}`,
      type: 'verse',
      createdAt: new Date().toISOString()
    }));
    
    // Mevcut bookmarklar ile ayet bookmarkları birleştir
    const allBookmarks = [...savedBookmarks, ...verseBookmarkObjects];
    setBookmarks(allBookmarks);
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const removeBookmark = (bookmarkId: string) => {
    if (window.confirm('Bu yer imini silmek istediğinizden emin misiniz?')) {
      // Eğer bu bir ayet favorisi ise, ayet favorilerinden de sil
      if (bookmarkId.startsWith('verse_')) {
        const bookmark = bookmarks.find(b => b.id === bookmarkId);
        if (bookmark && bookmark.type === 'verse') {
          const verseBookmarks = JSON.parse(localStorage.getItem('bookmark') || '[]');
          const updatedVerseBookmarks = verseBookmarks.filter((verse: {surah: string, ayat: string}) => 
            !(verse.surah === bookmark.surahId?.toString() && verse.ayat === bookmark.ayatNumber?.toString())
          );
          localStorage.setItem('bookmark', JSON.stringify(updatedVerseBookmarks));
        }
      }
      
      const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
      
      // Normal bookmarkları güncelle (ayet favorileri hariç)
      const normalBookmarks = updatedBookmarks.filter(b => b.type !== 'verse');
      localStorage.setItem('bookmarks', JSON.stringify(normalBookmarks));
      
      setBookmarks(updatedBookmarks);
    }
  };

  const clearAllBookmarks = () => {
    if (window.confirm('Tüm yer imlerini silmek istediğinizden emin misiniz?')) {
      localStorage.setItem('bookmarks', JSON.stringify([]));
      localStorage.setItem('bookmark', JSON.stringify([])); // Ayet favorilerini de temizle
      setBookmarks([]);
    }
  };

  return (
    <>
      <Helmet>
        <title>Yer İmleri - Kayıtlı Sureler ve Dualar | Kur'an-ı Kerim</title>
        <meta name="description" content={`${bookmarks.length} kayıtlı yer imi. Favori surelerinizi, ayetlerinizi ve dualarınızı buradan takip edin. Kişisel okuma listenizi yönetin.`} />
        <meta name="keywords" content="yer imleri, favori sureler, kayıtlı dualar, bookmark, kur'an takip, okuma listesi, favori ayetler" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Yer İmleri - Kayıtlı Sureler ve Dualar" />
        <meta property="og:description" content={`${bookmarks.length} kayıtlı yer imi. Favori surelerinizi, ayetlerinizi ve dualarınızı buradan takip edin.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Twitter Cards */}
        <meta name="twitter:title" content="Yer İmleri - Kayıtlı Sureler ve Dualar" />
        <meta name="twitter:description" content={`${bookmarks.length} kayıtlı yer imi. Favori surelerinizi, ayetlerinizi ve dualarınızı buradan takip edin.`} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Yer İmleri",
            "description": `${bookmarks.length} kayıtlı yer imi`,
            "url": typeof window !== 'undefined' ? window.location.href : '',
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": bookmarks.length,
              "name": "Kayıtlı Yer İmleri"
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
              <h1 className="text-2xl font-bold text-emerald-800">Yer İmleri</h1>
            </div>
            
            {bookmarks.length > 0 && (
              <button
                onClick={clearAllBookmarks}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
              >
                Tümünü Sil
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <BookmarkIcon className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              Henüz yer imi eklenmemiş
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Beğendiğiniz sure ve duaları yer imlerinize ekleyerek daha sonra kolayca erişebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/surah-list"
                className="inline-flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Sure Listesine Git
              </Link>
              <Link
                to="/dua-list"
                className="inline-flex items-center px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
              >
                <Heart className="h-5 w-5 mr-2" />
                Dua Listesine Git
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <BookmarkIcon className="h-5 w-5 mr-2" />
                  <span>{bookmarks.length} yer imi</span>
                </div>
                <div className="text-sm text-gray-500">
                  Son eklenen üstte gösterilir
                </div>
              </div>
            </div>

            {bookmarks
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((bookmark) => {
                const surahInfo = bookmark.surahId ? getSurahInfo(bookmark.surahId) : null;
                const duaInfo = bookmark.duaId ? getDuaInfo(bookmark.duaId) : null;
                const isDua = bookmark.type === 'dua' || bookmark.duaId;
                
                return (
                  <div key={bookmark.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {isDua && duaInfo ? (
                            // Dua Bookmark
                            <Link
                              to={`/dua/${bookmark.duaId}`}
                              className="group"
                            >
                              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors mb-2">
                                {bookmark.duaName || duaInfo.name}
                                <span className="text-sm text-teal-600 ml-2 bg-teal-100 px-2 py-1 rounded-full">
                                  Dua
                                </span>
                              </h3>
                              
                              <div className="space-y-2">
                                {duaInfo.occasion && (
                                  <p className="text-gray-600 text-sm">{duaInfo.occasion}</p>
                                )}
                                <p className="text-teal-600 font-arabic text-right text-sm leading-relaxed">
                                  {duaInfo.arabic.substring(0, 150)}...
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className={`px-2 py-1 rounded-full ${
                                    duaInfo.category === 'prayer' ? 'bg-blue-100 text-blue-800' :
                                    duaInfo.category === 'daily' ? 'bg-green-100 text-green-800' :
                                    duaInfo.category === 'special' ? 'bg-purple-100 text-purple-800' :
                                    duaInfo.category === 'protection' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {duaInfo.category === 'prayer' ? 'Namaz' :
                                     duaInfo.category === 'daily' ? 'Günlük' :
                                     duaInfo.category === 'special' ? 'Özel' :
                                     duaInfo.category === 'protection' ? 'Korunma' : duaInfo.category}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ) : (
                            // Surah Bookmark
                            <Link
                              to={bookmark.type === 'verse' 
                                ? `/surah/${bookmark.surahId}#verse-${bookmark.ayatNumber}` 
                                : `/surah/${bookmark.surahId}`}
                              className="group"
                            >
                              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors mb-2">
                                {bookmark.surahName} Suresi
                                {bookmark.ayatNumber && (
                                  <span className="text-sm text-gray-500 ml-2">
                                    (Ayet {bookmark.ayatNumber})
                                  </span>
                                )}
                                <span className={`text-sm ml-2 px-2 py-1 rounded-full ${
                                  bookmark.type === 'verse' 
                                    ? 'text-purple-600 bg-purple-100' 
                                    : 'text-green-600 bg-green-100'
                                }`}>
                                  {bookmark.type === 'verse' ? 'Ayet' : 'Sure'}
                                </span>
                              </h3>
                              
                              {surahInfo && (
                                <div className="space-y-2">
                                  <p className="text-gray-600 text-sm">{surahInfo.meaning}</p>
                                  <p className="text-emerald-600 font-arabic text-right text-lg">
                                    {surahInfo.arabic}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>{surahInfo.ayat} Ayet</span>
                                    <span className={`px-2 py-1 rounded-full ${
                                      surahInfo.type === 'mekki' 
                                        ? 'bg-orange-100 text-orange-800' 
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                      {surahInfo.type === 'mekki' ? 'Mekki' : 'Medeni'}
                                    </span>
                                    <span>{surahInfo.readingTime} dk</span>
                                  </div>
                                </div>
                              )}
                            </Link>
                          )}
                        </div>
                        
                        <button
                          onClick={() => removeBookmark(bookmark.id)}
                          className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Yer imini sil"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {new Date(bookmark.createdAt).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })} tarihinde eklendi
                          </span>
                          <Link
                            to={isDua ? `/dua/${bookmark.duaId}` : 
                               bookmark.type === 'verse' 
                                 ? `/surah/${bookmark.surahId}#verse-${bookmark.ayatNumber}` 
                                 : `/surah/${bookmark.surahId}`}
                            className="text-emerald-600 hover:text-emerald-800 font-medium"
                          >
                            {isDua ? 'Oku' : 'Oku'} →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Bookmark;

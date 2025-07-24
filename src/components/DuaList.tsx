import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Search, Heart } from 'lucide-react';
import { duaData } from '../data/duaData';

const DuaList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [bookmarkedDuas, setBookmarkedDuas] = useState<number[]>([]);

  useEffect(() => {
    // Load both bookmarked duas and detailed bookmarks for compatibility
    const simpleBookmarks = JSON.parse(localStorage.getItem('bookmarkedDuas') || '[]');
    const detailedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    // Extract dua IDs from detailed bookmarks and merge with simple bookmarks
    const detailedDuaIds = detailedBookmarks
      .filter((bookmark: any) => bookmark.duaId)
      .map((bookmark: any) => bookmark.duaId);
    const allBookmarkedDuas = Array.from(new Set([...simpleBookmarks, ...detailedDuaIds]));
    
    setBookmarkedDuas(allBookmarkedDuas);
  }, []);

  const toggleBookmark = (duaId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isCurrentlyBookmarked = bookmarkedDuas.includes(duaId);
    const newBookmarks = isCurrentlyBookmarked
      ? bookmarkedDuas.filter(id => id !== duaId)
      : [...bookmarkedDuas, duaId];
    
    setBookmarkedDuas(newBookmarks);
    
    // Update simple bookmarks
    localStorage.setItem('bookmarkedDuas', JSON.stringify(newBookmarks));
    
    // Update detailed bookmarks for compatibility with Bookmark.tsx
    const detailedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    
    if (isCurrentlyBookmarked) {
      // Remove from detailed bookmarks
      const updatedDetailedBookmarks = detailedBookmarks.filter((bookmark: any) => bookmark.duaId !== duaId);
      localStorage.setItem('bookmarks', JSON.stringify(updatedDetailedBookmarks));
    } else {
      // Add to detailed bookmarks
      const duaInfo = duaData.find(d => d.id === duaId);
      const newDetailedBookmark = {
        id: `bookmark_dua_${duaId}_${Date.now()}`,
        duaId: duaId,
        duaName: duaInfo?.name || `Dua ${duaId}`,
        createdAt: new Date().toISOString(),
        type: 'dua'
      };
      
      const updatedDetailedBookmarks = [...detailedBookmarks, newDetailedBookmark];
      localStorage.setItem('bookmarks', JSON.stringify(updatedDetailedBookmarks));
    }
  };

  const filteredDuas = duaData.filter(dua => {
    const matchesSearch = dua.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || dua.category === filterCategory;
    const matchesBookmark = filterCategory !== 'bookmarked' || bookmarkedDuas.includes(dua.id);
    return matchesSearch && matchesCategory && matchesBookmark;
  });

  const categories = ['all', 'bookmarked', ...Array.from(new Set(duaData.map(d => d.category)))];

  return (
    <>
      <Helmet>
        <title>İslami Dualar - Günlük Dualar ve Zikirler | Kur'an-ı Kerim</title>
        <meta name="description" content={`${duaData.length} İslami dua koleksiyonu. Sabah-akşam duaları, yemek duaları, yolculuk duaları ve daha fazlası. Arapça ve Türkçe okunuş ile birlikte.`} />
        <meta name="keywords" content="islami dualar, günlük dualar, sabah duaları, akşam duaları, yemek duaları, yolculuk duaları, arapça dualar, türkçe dualar, namaz duaları" />
        
        {/* Open Graph */}
        <meta property="og:title" content="İslami Dualar - Günlük Dualar ve Zikirler" />
        <meta property="og:description" content={`${duaData.length} İslami dua koleksiyonu. Sabah-akşam duaları, yemek duaları, yolculuk duaları ve daha fazlası.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Twitter Cards */}
        <meta name="twitter:title" content="İslami Dualar - Günlük Dualar ve Zikirler" />
        <meta name="twitter:description" content={`${duaData.length} İslami dua koleksiyonu. Sabah-akşam duaları, yemek duaları, yolculuk duaları ve daha fazlası.`} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "İslami Dualar",
            "description": `${duaData.length} İslami dua koleksiyonu`,
            "url": typeof window !== 'undefined' ? window.location.href : '',
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": duaData.length,
              "name": "İslami Dualar"
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
              <div>
                <h1 className="text-2xl font-bold text-emerald-800">Dualar</h1>
                <p className="text-emerald-600 text-sm">{duaData.length} Dua</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterCategory('bookmarked')}
                className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                title="Favoriler"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Dua ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Tüm Kategoriler' : 
                   category === 'bookmarked' ? 'Favoriler' :
                   category === 'prayer' ? 'Namaz' :
                   category === 'daily' ? 'Günlük' :
                   category === 'special' ? 'Özel' :
                   category === 'protection' ? 'Korunma' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dua List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDuas.map((dua) => (
            <div key={dua.id} className="relative">
              <Link
                to={`/dua/${dua.id}`}
                className="group block"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 border-l-4 border-teal-500">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 pr-2">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {dua.name}
                      </h3>
                      {dua.occasion && (
                        <p className="text-sm text-gray-600 mb-3">{dua.occasion}</p>
                      )}
                      <p className="text-sm text-emerald-600 font-arabic text-right mb-3 leading-relaxed">
                        {dua.arabic.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      dua.category === 'prayer' ? 'bg-blue-100 text-blue-800' :
                      dua.category === 'daily' ? 'bg-green-100 text-green-800' :
                      dua.category === 'special' ? 'bg-purple-100 text-purple-800' :
                      dua.category === 'protection' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {dua.category === 'prayer' ? 'Namaz' :
                       dua.category === 'daily' ? 'Günlük' :
                       dua.category === 'special' ? 'Özel' :
                       dua.category === 'protection' ? 'Korunma' : dua.category}
                    </span>
                    
                    <div className="text-emerald-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Bookmark Button */}
              <button
                onClick={(e) => toggleBookmark(dua.id, e)}
                className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                  bookmarkedDuas.includes(dua.id)
                    ? 'text-red-500 hover:text-red-600 bg-white shadow-md' 
                    : 'text-gray-400 hover:text-red-500 bg-white shadow-md hover:shadow-lg'
                }`}
                title={bookmarkedDuas.includes(dua.id) ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              >
                <Heart className={`w-4 h-4 ${bookmarkedDuas.includes(dua.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          ))}
        </div>

        {filteredDuas.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aradığınız kriterlere uygun dua bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default DuaList;

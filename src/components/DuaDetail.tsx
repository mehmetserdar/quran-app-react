import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Heart, Share2, Volume2 } from 'lucide-react';
import { duaData } from '../data/duaData';
import type { Dua } from '../types';

const DuaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dua, setDua] = useState<Dua | null>(null);
  const [fontSize, setFontSize] = useState('medium');

  useEffect(() => {
    if (id) {
      const foundDua = duaData.find(d => d.id === parseInt(id));
      setDua(foundDua || null);
    }
  }, [id]);

  if (!dua) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Dua bulunamadı.</p>
          <Link to="/dua-list" className="text-emerald-600 hover:text-emerald-800 mt-2 inline-block">
            Dua listesine dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${dua.name} Duası${dua.occasion ? ` - ${dua.occasion}` : ''} | İslami Dualar`}</title>
        <meta name="description" content={`${dua.name} duası${dua.occasion ? ` (${dua.occasion})` : ''} - Arapça metin, Türkçe anlamı ve okunuş rehberi. ${dua.category} kategorisindeki İslami dua.`} />
        <meta name="keywords" content={`${dua.name} duası, ${dua.category}, islami dualar, ${dua.occasion || ''}, arapça dua, türkçe dua`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${dua.name} Duası${dua.occasion ? ` - ${dua.occasion}` : ''}`} />
        <meta property="og:description" content={`${dua.name} duası${dua.occasion ? ` (${dua.occasion})` : ''} - Arapça metin, Türkçe anlamı ve okunuş rehberi.`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="article:section" content="İslami Dualar" />
        <meta property="article:tag" content={dua.category} />
        
        {/* Twitter Cards */}
        <meta name="twitter:title" content={`${dua.name} Duası`} />
        <meta name="twitter:description" content={`${dua.name} duası - Arapça metin, Türkçe anlamı ve okunuş rehberi.`} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `${dua.name} Duası`,
            "description": `${dua.name} duası - ${dua.category} kategorisindeki İslami dua`,
            "url": typeof window !== 'undefined' ? window.location.href : '',
            "author": {
              "@type": "Organization",
              "name": "İslami Dualar"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Kur'an-ı Kerim"
            },
            "mainEntity": {
              "@type": "CreativeWork",
              "name": dua.name,
              "description": dua.occasion || dua.category,
              "inLanguage": ["ar", "tr"],
              "category": dua.category
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
      <header className="bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/dua-list" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-emerald-600 hover:text-emerald-800" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-emerald-800">{dua.name}</h1>
                {dua.occasion && <p className="text-emerald-600">{dua.occasion}</p>}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200">
                <Volume2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Yazı Boyutu:</span>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
              >
                <option value="small">Küçük</option>
                <option value="medium">Orta</option>
                <option value="large">Büyük</option>
              </select>
            </div>
            
            <span className={`px-3 py-1 rounded-full text-sm ${
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
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Arapça</h3>
            <div className={`
              font-arabic text-right leading-loose p-4 bg-gray-50 rounded-lg
              ${fontSize === 'small' ? 'text-xl' : 
                fontSize === 'medium' ? 'text-2xl' : 'text-3xl'}
            `}>
              {dua.arabic}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Türkçe Okunuşu</h3>
            <div className={`
              leading-relaxed p-4 bg-blue-50 rounded-lg text-blue-900
              ${fontSize === 'small' ? 'text-sm' : 
                fontSize === 'medium' ? 'text-base' : 'text-lg'}
            `}>
              {dua.turkish}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Anlamı</h3>
            <div className={`
              leading-relaxed p-4 bg-emerald-50 rounded-lg text-emerald-900
              ${fontSize === 'small' ? 'text-sm' : 
                fontSize === 'medium' ? 'text-base' : 'text-lg'}
            `}>
              {dua.translation}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DuaDetail;

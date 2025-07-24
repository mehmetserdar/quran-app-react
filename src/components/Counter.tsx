import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, RotateCcw, Volume2 } from 'lucide-react';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedZikr, setSelectedZikr] = useState('subhanallah');

  const zikrOptions = [
    { key: 'subhanallah', name: 'Sübhanallah', arabic: 'سُبْحَانَ اللَّهِ' },
    { key: 'alhamdulillah', name: 'Elhamdülillah', arabic: 'الْحَمْدُ لِلَّهِ' },
    { key: 'allahuakbar', name: 'Allahu Ekber', arabic: 'اللَّهُ أَكْبَرُ' },
    { key: 'lailahaillallah', name: 'La ilahe illallah', arabic: 'لاَ إِلَهَ إِلاَّ اللَّهُ' },
    { key: 'astagfirullah', name: 'Estağfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ' },
  ];

  const currentZikr = zikrOptions.find(z => z.key === selectedZikr);

  useEffect(() => {
    // Load saved data
    const savedCount = localStorage.getItem(`counter-${selectedZikr}`);
    if (savedCount) {
      setCount(parseInt(savedCount));
    } else {
      setCount(0);
    }
  }, [selectedZikr]);

  useEffect(() => {
    // Save count
    localStorage.setItem(`counter-${selectedZikr}`, count.toString());
  }, [count, selectedZikr]);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    
    if (soundEnabled) {
      // Play click sound
      const audio = new Audio('/sound/click.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio play errors
      });
    }

    // Check if target reached
    if (count + 1 === target) {
      if (soundEnabled) {
        setTimeout(() => {
          const completionAudio = new Audio('/sound/completion.mp3');
          completionAudio.volume = 0.5;
          completionAudio.play().catch(() => {
            // Ignore audio play errors
          });
        }, 200);
      }
      
      // Show completion message
      setTimeout(() => {
        alert(`Tebrikler! ${target} ${currentZikr?.name} tamamladınız!`);
      }, 300);
    }
  };

  const handleReset = () => {
    if (window.confirm('Sayacı sıfırlamak istediğinizden emin misiniz?')) {
      setCount(0);
    }
  };

  const progressPercentage = Math.min((count / target) * 100, 100);

  return (
    <>
      <Helmet>
        <title>Dijital Zikirmatik - Tesbih Sayacı | İslami Zikirler</title>
        <meta name="description" content="Sübhanallah, Elhamdülillah, Allahu Ekber ve diğer zikirler için dijital tesbih sayacı. Hedefinizi belirleyin, zikirlerinizi sayın ve ruhsal gelişiminizi takip edin." />
        <meta name="keywords" content="zikirmatik, tesbih sayacı, dijital tesbih, sübhanallah, elhamdülillah, allahu ekber, la ilahe illallah, estağfirullah, zikir sayma" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Dijital Zikirmatik - Tesbih Sayacı" />
        <meta property="og:description" content="Sübhanallah, Elhamdülillah, Allahu Ekber ve diğer zikirler için dijital tesbih sayacı." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Twitter Cards */}
        <meta name="twitter:title" content="Dijital Zikirmatik - Tesbih Sayacı" />
        <meta name="twitter:description" content="Sübhanallah, Elhamdülillah, Allahu Ekber ve diğer zikirler için dijital tesbih sayacı." />
        
        {/* Canonical URL */}
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Dijital Zikirmatik",
            "description": "İslami zikirler için dijital tesbih sayacı",
            "url": typeof window !== 'undefined' ? window.location.href : '',
            "applicationCategory": "ReligiousApplication",
            "operatingSystem": "Web Browser",
            "featureList": [
              "Zikir sayma",
              "Hedef belirleme",
              "Ses efektleri",
              "İlerleme takibi"
            ],
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
              <h1 className="text-2xl font-bold text-emerald-800">Zikirmatik</h1>
            </div>
            
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg ${
                soundEnabled 
                  ? 'bg-emerald-100 text-emerald-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-8">
        {/* Zikr Selection */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Zikir Seçin</h3>
          <select
            value={selectedZikr}
            onChange={(e) => setSelectedZikr(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            {zikrOptions.map(option => (
              <option key={option.key} value={option.key}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Target Setting */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Hedef</h3>
          <div className="flex gap-2">
            {[33, 99, 100, 1000].map(num => (
              <button
                key={num}
                onClick={() => setTarget(num)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  target === num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value) || 1)}
              className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm"
              min="1"
            />
          </div>
        </div>

        {/* Current Zikr Display */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {currentZikr?.name}
          </h2>
          <p className="text-3xl font-arabic text-emerald-600 mb-4">
            {currentZikr?.arabic}
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">İlerleme</span>
            <span className="text-sm text-gray-600">{count} / {target}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-center mt-2">
            <span className="text-lg font-semibold text-emerald-600">
              %{Math.round(progressPercentage)}
            </span>
          </div>
        </div>

        {/* Counter Display */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
          <div className="text-6xl font-bold text-emerald-600 mb-4">
            {count}
          </div>
          <div className="text-gray-600">
            {target - count > 0 ? `${target - count} kaldı` : 'Hedef tamamlandı!'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleIncrement}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-colors duration-200 text-lg"
          >
            Say (+1)
          </button>
          
          <button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg shadow-lg transition-colors duration-200"
          >
            <RotateCcw className="h-6 w-6" />
          </button>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setCount(prev => prev + 10)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm"
          >
            +10
          </button>
          <button
            onClick={() => setCount(prev => prev + 33)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm"
          >
            +33
          </button>
          <button
            onClick={() => setCount(prev => prev + 99)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm"
          >
            +99
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Counter;

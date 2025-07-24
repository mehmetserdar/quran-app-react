import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Users } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Ana Sayfaya Dön
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-emerald-600" />
              <h1 className="text-xl font-bold text-gray-800">Gizlilik Politikası</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Gizlilik Politikası</h1>
            <p className="text-lg text-gray-600 mb-2">
              <strong>Son Güncelleme:</strong> 09 Temmuz 2025
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto rounded-full"></div>
          </div>

          {/* Content Sections */}
          <div className="prose prose-lg max-w-none">
            
            {/* 1. Giriş */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-800 mb-4 flex items-center">
                <Eye className="h-6 w-6 mr-2" />
                1. Giriş
              </h2>
              <p className="text-gray-700 leading-relaxed">
                kuranikerim.com.tc ("Biz", "Bizim", "Site") olarak, kullanıcılarımızın gizliliğine saygı duyar ve kişisel verilerinizin korunmasını öncelik olarak görürüz. Bu Gizlilik Politikası, web sitemizi kullanırken toplanan bilgilerin nasıl işlendiğini, saklandığını ve korunduğunu açıklar.
              </p>
            </section>

            {/* 2. Toplanan Bilgiler */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">2. Toplanan Bilgiler</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Otomatik Olarak Toplanan Bilgiler</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li><strong>Teknik Bilgiler:</strong> IP adresi, tarayıcı türü, işletim sistemi, cihaz bilgileri</li>
                <li><strong>Kullanım Bilgileri:</strong> Ziyaret edilen sayfalar, oturum süresi, tıklanan bağlantılar</li>
                <li><strong>Çerezler:</strong> Site performansını artırmak için teknik çerezler kullanılır</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Gönüllü Olarak Sağlanan Bilgiler</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>Favoriler:</strong> Kullanıcıların işaretlediği ayetler (yerel olarak saklanır)</li>
                <li><strong>Zikirmatik Verileri:</strong> Günlük zikir sayıları (yerel olarak saklanır)</li>
                <li><strong>Geri Bildirim:</strong> İletişim formları aracılığıyla gönderilen mesajlar</li>
              </ul>
            </section>

            {/* 3. Bilgilerin Kullanım Amaçları */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">3. Bilgilerin Kullanım Amaçları</h2>
              <p className="text-gray-700 mb-3">Toplanan bilgiler aşağıdaki amaçlarla kullanılır:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Site performansını iyileştirmek</li>
                <li>Kullanıcı deneyimini geliştirmek</li>
                <li>Teknik sorunları tespit etmek ve çözmek</li>
                <li>Site güvenliğini sağlamak</li>
                <li>Yasal yükümlülükleri yerine getirmek</li>
              </ul>
            </section>

            {/* 4. Veri Saklama ve Güvenlik */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-800 mb-4 flex items-center">
                <Lock className="h-6 w-6 mr-2" />
                4. Veri Saklama ve Güvenlik
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Veri Saklama</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li><strong>Yerel Veriler:</strong> Favoriler ve zikirmatik verileri kullanıcının cihazında saklanır</li>
                <li><strong>Sunucu Verileri:</strong> Teknik loglar maksimum 30 gün saklanır</li>
                <li><strong>Geri Bildirim:</strong> Kullanıcı mesajları 1 yıl süreyle saklanır</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Güvenlik Önlemleri</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>SSL sertifikası ile şifrelenmiş veri iletimi</li>
                <li>Güvenli sunucu altyapısı</li>
                <li>Düzenli güvenlik güncellemeleri</li>
                <li>Yetkisiz erişime karşı koruma</li>
              </ul>
            </section>

            {/* 5. Çerez Politikası */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">5. Çerez Politikası</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Kullanılan Çerez Türleri</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li><strong>Gerekli Çerezler:</strong> Site işlevselliği için zorunlu</li>
                <li><strong>Performans Çerezleri:</strong> Site performansını ölçmek için</li>
                <li><strong>Fonksiyonel Çerezler:</strong> Kullanıcı tercihlerini hatırlamak için</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Çerez Yönetimi</h3>
              <p className="text-gray-700">
                Tarayıcı ayarlarınızdan çerezleri yönetebilir, silebilir veya engelleyebilirsiniz.
              </p>
            </section>

            {/* 6. Üçüncü Taraf Hizmetleri */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">6. Üçüncü Taraf Hizmetleri</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Ses Dosyaları</h3>
              <p className="text-gray-700 mb-4">
                Kuran-ı Kerim ses kayıtları güvenli CDN hizmetleri aracılığıyla sunulmaktadır.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Analitik Hizmetler</h3>
              <p className="text-gray-700">
                Site trafiğini analiz etmek için anonim istatistiksel veriler kullanılabilir.
              </p>
            </section>

            {/* 7. Kullanıcı Hakları */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-800 mb-4 flex items-center">
                <Users className="h-6 w-6 mr-2" />
                7. Kullanıcı Hakları
              </h2>
              <p className="text-gray-700 mb-3">
                KVKK (Kişisel Verilerin Korunması Kanunu) kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenme amacını ve bu amaca uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içinde/dışında aktarıldığı üçüncü kişileri bilme</li>
                <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                <li>Silinmesini veya yok edilmesini isteme</li>
                <li>Düzeltme, silme, yok etme işlemlerinin üçüncü kişilere bildirilmesini isteme</li>
                <li>Zararın giderilmesini talep etme</li>
              </ul>
            </section>

            {/* 8. Veri Transferi */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">8. Veri Transferi</h2>
              <p className="text-gray-700 mb-3">
                Kişisel verileriniz yalnızca aşağıdaki durumlarda üçüncü kişilerle paylaşılabilir:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Yasal zorunluluklar</li>
                <li>Mahkeme kararları</li>
                <li>Kullanıcı izni</li>
              </ul>
            </section>

            {/* 9. Çocukların Gizliliği */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">9. Çocukların Gizliliği</h2>
              <p className="text-gray-700">
                Sitemiz 13 yaş altı çocuklardan bilerek kişisel veri toplamaz. 13 yaş altı çocukların siteyi kullanması için ebeveyn izni gereklidir.
              </p>
            </section>

            {/* 10. Uluslararası Veri Transferi */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">10. Uluslararası Veri Transferi</h2>
              <p className="text-gray-700">
                Verileriniz Türkiye sınırları içinde saklanır ve işlenir. Yurt dışına veri transferi yapılmaz.
              </p>
            </section>

            {/* 11. Gizlilik Politikası Değişiklikleri */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">11. Gizlilik Politikası Değişiklikleri</h2>
              <p className="text-gray-700">
                Bu gizlilik politikasında yapılan değişiklikler web sitesinde yayınlanır. Önemli değişiklikler için kullanıcılar bilgilendirilir.
              </p>
            </section>

            {/* 12. İletişim */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">12. İletişim</h2>
              <p className="text-gray-700 mb-3">Gizlilik ile ilgili sorularınız için:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>E-posta:</strong> info@kuranikerim.com.tc</li>
                <li><strong>Adres:</strong> İstanbul, Türkiye</li>
                <li><strong>Telefon:</strong> +90 XXX XXX XX XX</li>
              </ul>
            </section>

            {/* 13. Yürürlük */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-800 mb-4">13. Yürürlük</h2>
              <p className="text-gray-700">
                Bu Gizlilik Politikası, sitemizi kullanmaya başladığınız andan itibaren geçerlidir.
              </p>
            </section>

            {/* Not */}
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 mt-12 rounded-r-lg">
              <p className="text-emerald-800 font-medium">
                <strong>Not:</strong> Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuata uygun olarak hazırlanmıştır.
              </p>
            </div>

          </div>

          {/* Back to Top Button */}
          <div className="text-center mt-12">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Yukarı Çık
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Privacy;

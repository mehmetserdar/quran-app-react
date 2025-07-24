// Quran API Service with enhanced features
export interface QuranApiSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface QuranEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
}

export interface AudioEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
}

class QuranApiService {
  private baseUrl = 'https://api.alquran.cloud/v1';
  
  // Cache for better performance
  private cache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private async fetchWithCache<T>(url: string): Promise<T> {
    const cacheKey = url;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all surahs
  async getSurahs(): Promise<QuranApiSurah[]> {
    const response = await this.fetchWithCache<ApiResponse<QuranApiSurah[]>>(`${this.baseUrl}/surah`);
    return response.data;
  }

  // Get specific surah with translation
  async getSurahWithTranslation(surahNumber: number, edition: string = 'tr.diyanet'): Promise<any> {
    const response = await this.fetchWithCache<ApiResponse<any>>(`${this.baseUrl}/surah/${surahNumber}/${edition}`);
    return response.data;
  }

  // Get surah with multiple editions (Arabic + Translation)
  async getSurahMultipleEditions(surahNumber: number, editions: string[] = ['quran-uthmani', 'tr.diyanet']): Promise<any> {
    const editionsStr = editions.join(',');
    const response = await this.fetchWithCache<ApiResponse<any>>(`${this.baseUrl}/surah/${surahNumber}/editions/${editionsStr}`);
    return response.data;
  }

  // Get available editions (translations)
  async getEditions(): Promise<QuranEdition[]> {
    const response = await this.fetchWithCache<ApiResponse<QuranEdition[]>>(`${this.baseUrl}/edition`);
    return response.data.filter(edition => edition.type === 'translation');
  }

  // Get available audio reciters
  async getAudioEditions(): Promise<AudioEdition[]> {
    const response = await this.fetchWithCache<ApiResponse<AudioEdition[]>>(`${this.baseUrl}/edition`);
    return response.data.filter(edition => edition.type === 'audio');
  }

  // Get Turkish translations
  async getTurkishEditions(): Promise<QuranEdition[]> {
    const editions = await this.getEditions();
    return editions.filter(edition => edition.language === 'tr');
  }

  // Get specific ayah with translation
  async getAyah(surahNumber: number, ayahNumber: number, edition: string = 'tr.diyanet'): Promise<any> {
    const response = await this.fetchWithCache<ApiResponse<any>>(`${this.baseUrl}/ayah/${surahNumber}:${ayahNumber}/${edition}`);
    return response.data;
  }

  // Search in Quran
  async searchQuran(query: string, edition: string = 'tr.diyanet'): Promise<any> {
    const response = await this.fetchWithCache<ApiResponse<any>>(`${this.baseUrl}/search/${encodeURIComponent(query)}/${edition}`);
    return response.data;
  }

  // Get random ayah
  async getRandomAyah(edition: string = 'tr.diyanet'): Promise<any> {
    // Generate random surah and ayah
    const randomSurah = Math.floor(Math.random() * 114) + 1;
    const surahs = await this.getSurahs();
    const maxAyah = surahs.find(s => s.number === randomSurah)?.numberOfAyahs || 1;
    const randomAyah = Math.floor(Math.random() * maxAyah) + 1;
    
    return this.getAyah(randomSurah, randomAyah, edition);
  }

  // Get audio URL for surah
  getAudioUrl(surahNumber: number, reciter: string = 'ar.alafasy'): string {
    // Different audio URL patterns based on reciter
    const reciterMap: { [key: string]: string } = {
      'ar.alafasy': `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`,
      'ar.minshawi': `https://cdn.islamic.network/quran/audio-surah/128/ar.minshawi/${surahNumber}.mp3`,
      'ar.husary': `https://cdn.islamic.network/quran/audio-surah/128/ar.husary/${surahNumber}.mp3`,
      'ar.sudais': `https://cdn.islamic.network/quran/audio-surah/128/ar.abdurrahmaansudais/${surahNumber}.mp3`
    };

    return reciterMap[reciter] || reciterMap['ar.alafasy'];
  }

  // Get prayer times (bonus feature)
  async getPrayerTimes(city: string = 'Istanbul', country: string = 'Turkey'): Promise<any> {
    try {
      const response = await this.fetchWithCache<any>(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
      return response.data;
    } catch (error) {
      console.error('Prayer times request failed:', error);
      return null;
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache size
  getCacheSize(): number {
    return this.cache.size;
  }
}

export const quranApi = new QuranApiService();
export default quranApi;

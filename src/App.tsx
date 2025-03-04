import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Languages, X, ExternalLink, AlertCircle, LogIn, Key, LogOut, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

type Language = 'ja' | 'en' | 'zh' | 'ko' | 'ru' | 'de' | 'fr' | 'es' | 'pt' | 'nl' | 'it' | 'hi';

type ApiError = {
  message?: string;
  status?: number;
  details?: string;
};

// Language names for each locale
const LANGUAGE_NAMES = {
  ja: {
    ja: '日本語',
    en: '英語',
    zh: '中国語',
    ko: '韓国語',
    ru: 'ロシア語',
    de: 'ドイツ語',
    fr: 'フランス語',
    es: 'スペイン語',
    pt: 'ポルトガル語',
    nl: 'オランダ語',
    it: 'イタリア語',
    hi: 'ヒンディー語'
  },
  en: {
    ja: 'Japanese',
    en: 'English',
    zh: 'Chinese',
    ko: 'Korean',
    ru: 'Russian',
    de: 'German',
    fr: 'French',
    es: 'Spanish',
    pt: 'Portuguese',
    nl: 'Dutch',
    it: 'Italian',
    hi: 'Hindi'
  },
  zh: {
    ja: '日语',
    en: '英语',
    zh: '中文',
    ko: '韩语',
    ru: '俄语',
    de: '德语',
    fr: '法语',
    es: '西班牙语',
    pt: '葡萄牙语',
    nl: '荷兰语',
    it: '意大利语',
    hi: '印地语'
  },
  ko: {
    ja: '일본어',
    en: '영어',
    zh: '중국어',
    ko: '한국어',
    ru: '러시아어',
    de: '독일어',
    fr: '프랑스어',
    es: '스페인어',
    pt: '포르투갈어',
    nl: '네덜란드어',
    it: '이탈리아어',
    hi: '힌디어'
  },
  ru: {
    ja: 'Японский',
    en: 'Английский',
    zh: 'Китайский',
    ko: 'Корейский',
    ru: 'Русский',
    de: 'Немецкий',
    fr: 'Французский',
    es: 'Испанский',
    pt: 'Португальский',
    nl: 'Голландский',
    it: 'Итальянский',
    hi: 'Хинди'
  },
  de: {
    ja: 'Japanisch',
    en: 'Englisch',
    zh: 'Chinesisch',
    ko: 'Koreanisch',
    ru: 'Russisch',
    de: 'Deutsch',
    fr: 'Französisch',
    es: 'Spanisch',
    pt: 'Portugiesisch',
    nl: 'Niederländisch',
    it: 'Italienisch',
    hi: 'Hindi'
  },
  fr: {
    ja: 'Japonais',
    en: 'Anglais',
    zh: 'Chinois',
    ko: 'Coréen',
    ru: 'Russe',
    de: 'Allemand',
    fr: 'Français',
    es: 'Espagnol',
    pt: 'Portugais',
    nl: 'Néerlandais',
    it: 'Italien',
    hi: 'Hindi'
  },
  es: {
    ja: 'Japonés',
    en: 'Inglés',
    zh: 'Chino',
    ko: 'Coreano',
    ru: 'Ruso',
    de: 'Alemán',
    fr: 'Francés',
    es: 'Español',
    pt: 'Portugués',
    nl: 'Neerlandés',
    it: 'Italiano',
    hi: 'Hindi'
  },
  pt: {
    ja: 'Japonês',
    en: 'Inglês',
    zh: 'Chinês',
    ko: 'Coreano',
    ru: 'Russo',
    de: 'Alemão',
    fr: 'Francês',
    es: 'Espanhol',
    pt: 'Português',
    nl: 'Holandês',
    it: 'Italiano',
    hi: 'Hindi'
  },
  nl: {
    ja: 'Japans',
    en: 'Engels',
    zh: 'Chinees',
    ko: 'Koreaans',
    ru: 'Russisch',
    de: 'Duits',
    fr: 'Frans',
    es: 'Spaans',
    pt: 'Portugees',
    nl: 'Nederlands',
    it: 'Italiaans',
    hi: 'Hindi'
  },
  it: {
    ja: 'Giapponese',
    en: 'Inglese',
    zh: 'Cinese',
    ko: 'Coreano',
    ru: 'Russo',
    de: 'Tedesco',
    fr: 'Francese',
    es: 'Spagnolo',
    pt: 'Portoghese',
    nl: 'Olandese',
    it: 'Italiano',
    hi: 'Hindi'
  },
  hi: {
    ja: 'जापानी',
    en: 'अंग्रेजी',
    zh: 'चीनी',
    ko: 'कोरियाई',
    ru: 'रूसी',
    de: 'जर्मन',
    fr: 'फ्रेंच',
    es: 'स्पेनिश',
    pt: 'पुर्तगाली',
    nl: 'डच',
    it: 'इतालवी',
    hi: 'हिन्दी'
  }
};

// Language codes and their native names for the language switcher
const LANGUAGES: { code: Language; nativeName: string }[] = [
  { code: 'ja', nativeName: '日本語' },
  { code: 'en', nativeName: 'English' },
  { code: 'zh', nativeName: '中文' },
  { code: 'ko', nativeName: '한국어' },
  { code: 'ru', nativeName: 'Русский' },
  { code: 'de', nativeName: 'Deutsch' },
  { code: 'fr', nativeName: 'Français' },
  { code: 'es', nativeName: 'Español' },
  { code: 'pt', nativeName: 'Português' },
  { code: 'nl', nativeName: 'Nederlands' },
  { code: 'it', nativeName: 'Italiano' },
  { code: 'hi', nativeName: 'हिन्दी' }
];

function App() {
  const intl = useIntl();
  const navigate = useNavigate();
  const { lang = 'ja' } = useParams<{ lang: string }>();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState<Language>('ja');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiInput, setShowApiInput] = useState(false);
  const [showApiGuide, setShowApiGuide] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    return savedApiKey || '';
  });
  const [tempApiKey, setTempApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(() => {
    return localStorage.getItem('google_login') === 'true';
  });
  const [userName, setUserName] = useState<string | null>(() => {
    return localStorage.getItem('user_name');
  });
  const MAX_RETRIES = 3;

  // Language switcher
  const handleLanguageChange = (lang: string) => {
    navigate(`/${lang}`);
  };

  useEffect(() => {
    const checkGoogleAuth = () => {
      const isLoggedIn = localStorage.getItem('google_login') === 'true';
      setIsGoogleLoggedIn(isLoggedIn);
      
      if (isLoggedIn) {
        const storedName = localStorage.getItem('user_name');
        setUserName(storedName);
      } else {
        setUserName(null);
      }
    };

    checkGoogleAuth();
    window.addEventListener('focus', checkGoogleAuth);

    return () => {
      window.removeEventListener('focus', checkGoogleAuth);
    };
  }, []);

  useEffect(() => {
    if (error?.includes('APIキー')) {
      setShowLoginPrompt(true);
    }
  }, [error]);

  useEffect(() => {
    localStorage.setItem('google_login', isGoogleLoggedIn ? 'true' : 'false');
  }, [isGoogleLoggedIn]);

  const handleGoogleLogin = () => {
    const width = 600;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const loginWindow = window.open(
      'https://aistudio.google.com/apikey',
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const checkWindow = setInterval(() => {
      if (loginWindow?.closed) {
        clearInterval(checkWindow);
        setIsGoogleLoggedIn(true);
        localStorage.setItem('google_login', 'true');
        
        const name = window.prompt(intl.formatMessage({ id: 'app.user.label' }));
        if (name) {
          setUserName(name);
          localStorage.setItem('user_name', name);
        }
        
        setShowApiInput(true);
        setShowLoginPrompt(false);
      }
    }, 500);
  };

  const handleLogout = () => {
    setIsGoogleLoggedIn(false);
    setUserName(null);
    localStorage.removeItem('google_login');
    localStorage.removeItem('user_name');
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
  };

  const handleGetApiKey = () => {
    window.open('https://aistudio.google.com/apikey', '_blank');
  };

  const saveApiKey = () => {
    if (!tempApiKey.trim()) {
      setError(intl.formatMessage({ id: 'app.error.apiKeyRequired' }));
      return;
    }
    
    setApiKey(tempApiKey);
    localStorage.setItem('gemini_api_key', tempApiKey);
    setShowApiInput(false);
    setShowApiGuide(false);
    setRetryCount(0);
    setError(null);
  };

  const validateTranslationResponse = (text: string): boolean => {
    if (!text || text.trim().length === 0) return false;
    
    const invalidPatterns = [
      /^error/i,
      /^invalid/i,
      /^failed/i,
      /unable to translate/i,
      /cannot translate/i,
      /translation failed/i,
      /^I apologize/i,
      /^Sorry/i,
      /^Note:/i,
      /^Here's the translation/i,
      /^The translation is/i
    ];
    
    return !invalidPatterns.some(pattern => pattern.test(text.trim()));
  };

  const handleTranslationError = (error: unknown) => {
    console.error('Translation error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        setError(intl.formatMessage({ id: 'app.error.apiKeyRequired' }));
      } else if (error.message.includes('PERMISSION_DENIED')) {
        setError('APIキーの権限が不足しています。APIキーの設定を確認してください。');
      } else if (error.message.includes('RESOURCE_EXHAUSTED')) {
        setError('API利用制限に達しました。しばらく待ってから再度お試しください。');
      } else if (error.message.includes('無効な翻訳結果')) {
        setError(intl.formatMessage({ id: 'app.error.invalidTranslation' }));
      } else if (error.message.includes('not found') || error.message.includes('not supported')) {
        setError('使用しているGeminiモデルが利用できません。最新のAPIを使用しているか確認してください。');
      } else {
        setError(`翻訳エラー: ${error.message}`);
      }
    } else if (typeof error === 'object' && error !== null) {
      const apiError = error as ApiError;
      if (apiError.status === 429) {
        setError('APIの利用制限に達しました。しばらく待ってから再度お試しください。');
      } else if (apiError.status === 403) {
        setError('APIキーが無効か、権限が不足しています。');
      } else if (apiError.status === 404) {
        setError('指定されたGeminiモデルが見つかりません。最新のAPIを使用しているか確認してください。');
      } else if (apiError.message) {
        setError(`APIエラー: ${apiError.message}`);
      } else {
        setError('翻訳中にエラーが発生しました。APIキーが正しいことを確認してください。');
      }
    } else {
      setError('予期せぬエラーが発生しました。もう一度お試しください。');
    }
  };

  const translateText = async () => {
    if (!inputText.trim()) {
      setError(intl.formatMessage({ id: 'app.error.inputRequired' }));
      return;
    }

    if (!apiKey) {
      setError(intl.formatMessage({ id: 'app.error.apiKeyRequired' }));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setOutputText('');

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Use the gemini-1.5-flash model which is the latest available model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `You are a professional translator. Translate the following text to ${getLanguageName(targetLanguage)}. 
Important: Only provide the direct translation without any explanations, notes, or additional text.
Do not include phrases like "here's the translation" or "the translation is".
Do not apologize or add any comments.
Just provide the translation text directly.

Text to translate:
${inputText}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!validateTranslationResponse(text)) {
        throw new Error('無効な翻訳結果が返されました。');
      }
      
      setOutputText(text.trim());
      setRetryCount(0);
    } catch (error) {
      handleTranslationError(error);
      
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => translateText(), 1000 * (retryCount + 1));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getLanguageName = (code: Language): string => {
    return LANGUAGE_NAMES[lang as Language]?.[code] || code;
  };

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage({ id: 'app.title' })} - {getLanguageName(targetLanguage)}に翻訳</title>
        <meta 
          name="description" 
          content={intl.formatMessage(
            { id: 'app.description' },
            { language: getLanguageName(targetLanguage) }
          )} 
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Language Switcher */}
          <div className="flex flex-wrap justify-end mb-4 gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="px-3 py-1 rounded-md bg-white shadow-sm hover:bg-gray-50 transition-colors"
              >
                {lang.nativeName}
              </button>
            ))}
          </div>

          {error && (
            <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
              error.includes('APIキー') 
                ? 'bg-red-600 text-white' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Languages className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                {intl.formatMessage({ id: 'app.title' })}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {isGoogleLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">
                    <User className="w-4 h-4" />
                    <span>{userName || intl.formatMessage({ id: 'app.user.label' })}</span>
                  </div>
                  <button
                    onClick={() => setShowApiInput(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <Key className="w-4 h-4" />
                    <span>
                      {intl.formatMessage({ 
                        id: apiKey ? 'app.apiKey.change' : 'app.apiKey.set' 
                      })}
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <LogOut className="w-4 h-4" />
                    {intl.formatMessage({ id: 'app.logout' })}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <LogIn className="w-4 h-4" />
                  {intl.formatMessage({ id: 'app.login.button' })}
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-4 justify-center">
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value as Language)}
                className="block rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {LANGUAGES.map(language => (
                  <option key={language.code} value={language.code}>
                    {getLanguageName(language.code)}
                  </option>
                ))}
              </select>
              <span className="text-gray-600">
                {intl.formatMessage({ id: 'app.translateTo' })}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={intl.formatMessage({ id: 'app.inputPlaceholder' })}
                  className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <textarea
                  value={outputText}
                  readOnly
                  placeholder={intl.formatMessage({ id: 'app.outputPlaceholder' })}
                  className="w-full h-48 p-4 bg-gray-50 border rounded-lg"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={translateText}
                disabled={isLoading || !inputText}
                className={`
                  px-6 py-2 rounded-lg text-white font-medium
                  ${isLoading || !inputText
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 transition-colors'}
                `}
              >
                {isLoading 
                  ? (retryCount > 0 
                    ? intl.formatMessage(
                        { id: 'app.retrying' },
                        { count: retryCount, max: MAX_RETRIES }
                      )
                    : intl.formatMessage({ id: 'app.translating' })
                  ) 
                  : intl.formatMessage({ id: 'app.translateButton' })
                }
              </button>
            </div>
          </div>

          {/* Login Prompt Modal */}
          {showLoginPrompt && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {intl.formatMessage({ id: 'app.login.title' })}
                  </h2>
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    {intl.formatMessage({ id: 'app.login.description' })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {intl.formatMessage({ id: 'app.login.note' })}
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {intl.formatMessage({ id: 'app.login.later' })}
                  </button>
                  <button
                    onClick={() => {
                      handleGoogleLogin();
                      setShowLoginPrompt(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    {intl.formatMessage({ id: 'app.login.button' })}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* API Key Input Modal */}
          {showApiInput && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {intl.formatMessage({ id: 'app.apiKey.title' })}
                  </h2>
                  <button
                    onClick={() => setShowApiInput(false)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {intl.formatMessage({ id: 'app.apiKey.label' })}
                  </label>
                  <input
                    type="password"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder={intl.formatMessage({ id: 'app.apiKey.placeholder' })}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowApiInput(false)}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {intl.formatMessage({ id: 'app.apiKey.cancel' })}
                  </button>
                  <button
                    onClick={saveApiKey}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    {intl.formatMessage({ id: 'app.apiKey.save' })}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
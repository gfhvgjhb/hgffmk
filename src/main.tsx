import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { messages } from './i18n/messages';

// Language code mapping
const languageMap: Record<string, keyof typeof messages> = {
  'ja': 'ja',
  'zh': 'zh',
  'en': 'en',
  'ko': 'ko',
  'ru': 'ru',
  'de': 'de',
  'fr': 'fr',
  'es': 'es',
  'pt': 'pt',
  'nl': 'nl',
  'it': 'it',
  'hi': 'hi'
};

// Root component with routing
function Root() {
  return (
    <Router>
      <Routes>
        <Route path="/:lang" element={<LanguageWrapper />} />
        <Route path="/" element={<Navigate to="/ja" replace />} />
      </Routes>
    </Router>
  );
}

// Language wrapper component
function LanguageWrapper() {
  const { lang = 'ja' } = useParams<{ lang: string }>();
  const locale = languageMap[lang] || 'en';

  return (
    <IntlProvider messages={messages[locale]} locale={locale} key={locale}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </IntlProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
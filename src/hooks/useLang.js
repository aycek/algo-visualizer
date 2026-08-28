import { useState } from 'react';

export function useLang() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr');

  const toggle = () => {
    const next = lang === 'tr' ? 'en' : 'tr';
    localStorage.setItem('lang', next);
    setLang(next);
  };

  return { lang, toggle };
}

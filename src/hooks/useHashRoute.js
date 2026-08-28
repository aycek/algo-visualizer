import { useState, useEffect, useCallback } from 'react';

const VALID_PAGES = ['home', 'array', 'graph', 'tree', 'game'];

function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [page, sub] = raw.split('/').filter(Boolean);
  return { page: VALID_PAGES.includes(page) ? page : 'home', sub: sub || null };
}

export function useHashRoute() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((page, sub = null) => {
    const hash = sub ? `#/${page}/${sub}` : `#/${page}`;
    if (window.location.hash === hash) {
      setRoute({ page, sub });
    } else {
      window.location.hash = hash;
    }
  }, []);

  return { page: route.page, sub: route.sub, navigate };
}

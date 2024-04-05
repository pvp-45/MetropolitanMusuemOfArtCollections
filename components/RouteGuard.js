import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '@/lib/authenticate'; 
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '@/store'; 
import { getFavourites, getHistory } from '@/lib/userData'; 

const PUBLIC_PATHS = ['/login', '/', '/_error', '/register']; 

export default function RouteGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [, setSearchHistory] = useAtom(searchHistoryAtom);

  async function updateAtoms() {
    try {
      const favourites = await getFavourites();
      const history = await getHistory();
      setFavouritesList(favourites);
      setSearchHistory(history);
    } catch (error) {
      console.error('Error updating atoms:', error);
    }
  }

  useEffect(() => {
    authCheck(router.pathname);

    const handleRouteChange = (url) => {
      authCheck(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  function authCheck(url) {
    const path = url.split('?')[0];
    if (!PUBLIC_PATHS.includes(path) && !isAuthenticated()) {
      setAuthorized(false);
      router.push('/login');
    } else {
      updateAtoms(); 
      setAuthorized(true);
    }
  }

  if (!authorized) {
    return null; 
  }

  return <>{children}</>;
}

import { useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { WS_BASE_URL } from '../config';

export const useSocket = (onNewArticles, onTrendingUpdate, onAnalyticsUpdate) => {
  useEffect(() => {
    const socket = io(WS_BASE_URL);

    socket.on('newArticle', (article) => {
      onNewArticles([article]);
    });

    socket.on('trendingUpdate', (trending) => {
      onTrendingUpdate(trending);
    });

    socket.on('analyticsUpdate', (analytics) => {
      onAnalyticsUpdate(analytics);
    });

    return () => {
      socket.disconnect();
    };
  }, [onNewArticles, onTrendingUpdate, onAnalyticsUpdate]);
};
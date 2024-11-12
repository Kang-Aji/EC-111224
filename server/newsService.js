import fetch from 'node-fetch';
import { NEWS_API_KEY, NEWS_API_URL, OFFICIALS, DEPARTMENTS } from './config.js';
import { subHours, parseISO, isAfter } from 'date-fns';

export async function fetchNewsArticles() {
  try {
    const queries = OFFICIALS.map(official => `"${official}"`);
    const queryString = queries.join(' OR ');
    
    // Get articles from the last 24 hours
    const fromDate = subHours(new Date(), 24);
    const fromDateString = fromDate.toISOString();
    
    const url = `${NEWS_API_URL}?q=${encodeURIComponent(queryString)}&lang=en&sortby=publishedAt&from=${fromDateString}&max=100&apikey=${NEWS_API_KEY}`;
    
    console.log('Fetching news from Gnews API...');
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Gnews API Error:', error);
      throw new Error(error.message || 'News API request failed');
    }
    
    const data = await response.json();
    console.log(`Retrieved ${data.articles?.length || 0} articles from Gnews`);
    
    if (!data.articles || data.articles.length === 0) {
      console.warn('No articles returned from Gnews API');
      return [];
    }
    
    // Filter articles to ensure they're within last 24 hours and transform them
    const recentArticles = data.articles
      .filter(article => {
        const publishDate = parseISO(article.publishedAt);
        return isAfter(publishDate, fromDate);
      })
      .map(article => ({
        title: article.title,
        content: article.description || 'No content available',
        url: article.url,
        date: article.publishedAt,
        source: article.source?.name || 'Unknown Source',
        ...determineArticleMetadata(article)
      }));

    console.log(`Filtered to ${recentArticles.length} articles from last 24 hours`);
    return recentArticles;
  } catch (error) {
    console.error('Error fetching from Gnews API:', error);
    throw error;
  }
}

export function determineArticleMetadata(article) {
  const mentionedOfficials = [];
  let primaryDepartment = 'Executive';

  if (!article.title && !article.description) {
    return { officials: ['Joe Biden'], department: primaryDepartment };
  }

  const content = [
    article.title,
    article.description,
    article.source?.name
  ].filter(Boolean).join(' ').toLowerCase();
  
  for (const official of OFFICIALS) {
    if (content.includes(official.toLowerCase())) {
      mentionedOfficials.push(official);
      // Use the first mentioned official's department as primary
      if (primaryDepartment === 'Executive') {
        primaryDepartment = DEPARTMENTS[official];
      }
    }
  }

  return {
    officials: mentionedOfficials.length > 0 ? mentionedOfficials : ['Joe Biden'],
    department: primaryDepartment
  };
}
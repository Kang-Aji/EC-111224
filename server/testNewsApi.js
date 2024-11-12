import fetch from 'node-fetch';
import { NEWS_API_KEY, NEWS_API_URL } from './config.js';

async function testNewsApi() {
  try {
    const url = `${NEWS_API_URL}?q="Biden"&language=en&pageSize=1&apiKey=${NEWS_API_KEY}`;
    console.log('Testing News API connection...');
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ News API connection successful!');
      console.log('Sample article:', data.articles[0]?.title);
      return true;
    } else {
      console.error('❌ News API Error:', data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to connect to News API:', error.message);
    return false;
  }
}

testNewsApi();
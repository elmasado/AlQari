import axios from 'axios';

const BASE_URL = 'https://azap.sequencia.tv/api/es8';
const AUTH = {
  username: 'elastic',
  password: 'kikokaka',
};

export async function fetchSurah(surahNumber) {
  const response = await axios.get(`${BASE_URL}/quran/_doc/${surahNumber}`, { auth: AUTH });
  if (response.status !== 200) {
    throw new Error('Failed to fetch surah');
  }
  return response.data._source;
}

export async function searchVerses(query) {
  const response = await axios.post(
    `${BASE_URL}/search`,
    { query },
    { auth: AUTH }
  );
  return response.data.hits.hits.map(hit => hit._source);
}

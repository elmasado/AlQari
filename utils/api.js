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
    `${BASE_URL}/quran/_search`,
    query,
    { auth: AUTH }
  );
  // console.log("search:", response);
  return response.data.hits.hits.map(hit => hit);
}

export async function fetchAdhkar() {
  const response = await axios.get(`${BASE_URL}/adhkar/_search?size=300`, { auth: AUTH });
  if (response.status !== 200) {
    throw new Error('Failed to fetch adhkar');
  }
 return response.data.hits.hits.map(hit => hit._source);}
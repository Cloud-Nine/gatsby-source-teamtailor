import axios from 'axios';

const BASE_URL = 'https://api.teamtailor.com/v1';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/vnd.api+json'
  }
})

export const fetch = async ({ url, config = {} }) => {
  return await instance
    .get(`/jobs`, config)
    .then(({ data }) => data)
    .catch(error => { throw error });
};

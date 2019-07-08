import axios from 'axios';

const BASE_URL = 'https://api.teamtailor.com/v1';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/vnd.api+json'
  }
})

export const fetchJobs = async ({ config = {} }) => {
  return await instance
    .get(`/jobs?include=locations,user`, config)
    .then(({ data }) => data)
    .catch(error => { throw error });
};

// export const fetchJob = async ({ url, config = {} }) => {
//   return await instance
//     .get(url, config)
//     .then(({ data }) => data)
//     .catch(error => { throw error });
// };

export const fetchUsers = async ({ config = {} }) => {
  return await instance
    .get(`/users?include=jobs`, config)
    .then(({ data }) => data)
    .catch(error => { throw error });
};

import axios from 'axios';

const BASE_URL = 'https://api.teamtailor.com/v1';

let instance = {};

export const createInstance = (headers = {}) => {
  instance = axios.create({
    baseURL: BASE_URL,
    headers
  })
}

export const fetchJobs = async () => {
  return await instance
    .get('/jobs?include=locations,user')
    .then(({ data }) => data)
    .catch(error => { throw error });
};

export const fetchUsers = async ({ url = '/users' }) => {
  let users = []
  return await instance
    .get(url)
    .then(({ data }) => data)
    .catch(error => { throw error });
};

export const getUsers = async () => {
  let records = [];
  let keepGoing = true;
  let url = '/users?page[size]=30';

  while (keepGoing) {
    const response = await fetchUsers({ url });

    await records.push.apply(records, response.data);

    if ( response.links && response.links.next ) {
      url = response.links.next;
    } else {
      keepGoing = false;
      return records;
    }
  }

}

import { map, get } from 'lodash/fp';
import { JobNode, UserNode } from './nodes';
import { fetchJobs, fetchJob, fetchUsers } from './api';

exports.sourceNodes = async ({ actions }, configOptions) => {
  const { createNode, createTypes } = actions

  try {

    const config = {
      headers: {
        Authorization: `Token token=${configOptions.token}`,
        "X-Api-Version": configOptions.version,
        Accept: 'application/vnd.api+json'
      }
    }

    // Fetch all jobs from teamtailor
    const getJobs = await fetchJobs({ config });
    const getUsers = await fetchUsers({ config });

    const [ allJobs, allUsers ] = await Promise.all([ getJobs, getUsers ]);

    map((job) => {
      const jobNode = JobNode(job)
      createNode(jobNode)

      const typeDefs = `
        type TeamTailorJob implements Node @infer {
          categories: [String!]!
        }
      `;

      createTypes(typeDefs)

    }, allJobs.data);

    map((user) => {
      const userNode = UserNode(user)
      createNode(userNode)
    }, allUsers.data);

    return;

  } catch (error) {
    console.log('===== Gatsby Source Teamtailor =====')
    if ( get('response.data.errors', error) ) {
      console.log(get('response.data.errors', error));
    } else {
      console.log(error);
    }

    process.exit(1)
  }

};

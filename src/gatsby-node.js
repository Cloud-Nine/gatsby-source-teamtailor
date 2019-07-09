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


exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define tags as an non nullable array of strings
  // this is to make sure that gatsby understand how to handle a situation
  // where tags could be an empty array
  const typeDefs = `
    type TeamTailorJob implements Node {
      attributes: Attributes
    }

    type Attributes {
      tags: [String!]!
    }
  `;

  createTypes(typeDefs);
}

import { map, get } from 'lodash/fp';
import { JobNode, UserNode } from './nodes';
import { createInstance, fetchJobs, getUsers } from './api';

exports.sourceNodes = async ({ actions }, configOptions) => {
  const { createNode, createTypes } = actions

  try {

    createInstance({
      Authorization: `Token token=${configOptions.token}`,
      'X-Api-Version': configOptions.version,
      Accept: 'application/vnd.api+json'
    });

    // Fetch all jobs from teamtailor
    const getJobs = await fetchJobs();
    const fetchUsers = await getUsers();

    const [ allJobs, allUsers ] = await Promise.all([ getJobs, fetchUsers ]);

    map((job) => {
      const jobNode = JobNode(job)
      createNode(jobNode)
    }, allJobs.data);

    map((user) => {
      const userNode = UserNode(user)
      createNode(userNode)
    }, allUsers);

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


exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions

  // Explicitly define tags as an non nullable array of strings
  // this is to make sure that gatsby understand how to handle a situation
  // where tags could be an empty array

  const typeDefs = `
    type TeamTailorJob implements Node {
      attributes: Attributes
      recruiter: TeamTailorUser @link(by: "id", from: "recruiterId")      
    }

    type Attributes {
      tags: [String!]
    }

    type TeamTailorUser implements Node {
      teamTailorId: String
    }
  `;

  createTypes(typeDefs);
}

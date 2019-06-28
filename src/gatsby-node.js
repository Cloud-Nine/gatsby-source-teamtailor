import { map } from 'lodash/fp';
import { JobNode } from './nodes';
import { fetch } from './api';

exports.sourceNodes = async ({ actions }, configOptions) => {
  const { createNode } = actions

  try {

    // Fetch all jobs from teamtailor
    const allJobs = await fetch({
      url: '/jobs',
      config: {
        headers: {
          Authorization: `Token token=${configOptions.token}`,
          "X-Api-Version": configOptions.version,
          Accept: 'application/vnd.api+json'
        }
      }
    });

    // Map over all jobs from the response and create notes out of them
    return await map(job => {
      const jobNode = JobNode(job)
      createNode(jobNode);
    }, allJobs.data);

  } catch (error) {
    console.error(error)
    process.exit(1)
  }

};

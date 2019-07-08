import { map } from 'lodash/fp';
import { JobNode } from './nodes';
import { fetchJobs, fetchJob } from './api';

exports.sourceNodes = async ({ actions }, configOptions) => {
  const { createNode } = actions

  try {

    const fetchConfig = {
      headers: {
        Authorization: `Token token=${configOptions.token}`,
        "X-Api-Version": configOptions.version,
        Accept: 'application/vnd.api+json'
      }
    }

    // Fetch all jobs from teamtailor
    const allJobs = await fetchJobs({ config: fetchConfig });

    // Map over all jobs from the response and fetch each resource
    return Promise.all(
      map(async (job) => {

        const singleJob = await fetchJob({
          url: `/jobs/${job.id}?include=user,location`,
          config: fetchConfig
        });

        const jobNode = JobNode(singleJob.data)
        createNode(jobNode);

      }, allJobs.data)
    );

  } catch (error) {
    console.error(error)
    process.exit(1)
  }

};

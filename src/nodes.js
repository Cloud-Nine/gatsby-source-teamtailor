import createNodeHelpers from 'gatsby-node-helpers';
import { get } from 'lodash/fp';

import { getStringAfterAt } from './utils';

const {
  createNodeFactory,
  generateNodeId,
  generateTypeName,
} = createNodeHelpers({ typePrefix: `TeamTailor` });

const JOB_TYPE = `Job`;

export const JobNode = createNodeFactory(JOB_TYPE, node => {

  const externalUrl = get(['links', 'careersite-job-url'], node);
  const slug = getStringAfterAt(externalUrl, '/jobs/');

  node.slug = slug;
  return node
});

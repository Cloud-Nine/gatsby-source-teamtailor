import createNodeHelpers from 'gatsby-node-helpers';
import { get, reduce, map } from 'lodash/fp';

import { getStringAfterAt } from './utils';

const {
  createNodeFactory,
  generateNodeId,
  generateTypeName,
} = createNodeHelpers({ typePrefix: `TeamTailor` });

const JOB_TYPE = `Job`;
const USER_TYPE = `User`

export const JobNode = createNodeFactory(JOB_TYPE, node => {

  const externalUrl = get(['links', 'careersite-job-url'], node);
  const slug = getStringAfterAt(externalUrl, '/jobs/');

  const userId = get(['relationships', 'user', 'data', 'id'], node);

  // Set slug and user reference
  node.slug = slug;
  node.recruiter = generateNodeId(USER_TYPE, userId);

  // Delete old references
  delete node.relationships.user;

  return node
});

export const UserNode = createNodeFactory(USER_TYPE);

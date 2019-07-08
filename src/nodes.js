import createNodeHelpers from 'gatsby-node-helpers';
import { get, getOr, reduce, map, isEmpty } from 'lodash/fp';

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

  const tags = getOr([], 'attributes.tags', node);
  const userId = get(['relationships', 'user', 'data', 'id'], node);

  // Set new fields
  node.slug = slug;
  if ( tags || !isEmpty(tags) ) {
    node.categories = tags;
    delete node.attributes.tags
  }

  node.recruiter = generateNodeId(USER_TYPE, userId);

  return node
});

export const UserNode = createNodeFactory(USER_TYPE);

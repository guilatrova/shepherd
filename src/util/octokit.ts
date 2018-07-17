const octokit = require('@octokit/rest')();

type Method = (opts: any) => Promise<any>;

module.exports.paginate = (method: Method, extractItems = (d: any) => d) => async (options: any) => {
  let response = await method({
    ...options,
    per_page: 100,
  });
  let data = extractItems(response.data);
  while (octokit.hasNextPage(response)) {
    response = await octokit.getNextPage(response); // eslint-disable-line no-await-in-loop
    data = data.concat(extractItems(response.data));
  }
  return data;
};

// Search responses have a slightly different structure than normal ones, so we
// need to extract the items from a different key
module.exports.paginateSearch = (method: Method) => module.exports.paginate(method, (data: any) => data.items);
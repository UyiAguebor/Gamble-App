/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserList = /* GraphQL */ `
  query GetUserList($id: ID!) {
    getUserList(id: $id) {
      id
      username
      points
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUserLists = /* GraphQL */ `
  query ListUserLists(
    $filter: ModelUserListFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        points
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getGeofence = /* GraphQL */ `
  query GetGeofence($id: ID!) {
    getGeofence(id: $id) {
      id
      name
      geometry
      createdAt
      updatedAt
    }
  }
`;
export const listGeofences = /* GraphQL */ `
  query ListGeofences(
    $filter: ModelGeofenceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGeofences(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        geometry
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGeofence = /* GraphQL */ `
  mutation CreateGeofence(
    $input: CreateGeofenceInput!
    $condition: ModelGeofenceConditionInput
  ) {
    createGeofence(input: $input, condition: $condition) {
      id
      name
      geometry
      createdAt
      updatedAt
    }
  }
`;
export const updateGeofence = /* GraphQL */ `
  mutation UpdateGeofence(
    $input: UpdateGeofenceInput!
    $condition: ModelGeofenceConditionInput
  ) {
    updateGeofence(input: $input, condition: $condition) {
      id
      name
      geometry
      createdAt
      updatedAt
    }
  }
`;
export const deleteGeofence = /* GraphQL */ `
  mutation DeleteGeofence(
    $input: DeleteGeofenceInput!
    $condition: ModelGeofenceConditionInput
  ) {
    deleteGeofence(input: $input, condition: $condition) {
      id
      name
      geometry
      createdAt
      updatedAt
    }
  }
`;

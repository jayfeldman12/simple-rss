import {PluginDefinition} from 'apollo-server-core';

export const logger: PluginDefinition = {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart(requestContext) {
    console.log('Request started!');

    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      async parsingDidStart() {
        console.log('Parsing started!');
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      async validationDidStart() {
        console.log('Validation started!');
      },

      async willSendResponse() {
        console.log('response sent');
      },

      async didEncounterErrors(errorContext) {
        console.log('found an error', errorContext.errors);
      },
    };
  },
};

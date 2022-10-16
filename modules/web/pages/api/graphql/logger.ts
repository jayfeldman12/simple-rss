import {PluginDefinition} from 'apollo-server-core';

export const Logger = {
  info: (...message: any) => {
    console.info(...message, new Date().toUTCString());
  },

  log: (...message: any) => {
    console.log(...message, new Date().toUTCString());
  },

  error: (...message: any) => {
    console.error(...message, new Date().toUTCString());
  },
};

export const logger: PluginDefinition = {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart(requestContext) {
    Logger.log('Request started!');

    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      async parsingDidStart() {
        Logger.info('Parsing started!');
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      async validationDidStart() {
        Logger.info('Validation started!');
      },

      async willSendResponse() {
        Logger.log('Response sent', new Date().toUTCString());
      },

      async didEncounterErrors(errorContext) {
        Logger.error('Found an error', errorContext.errors);
      },
    };
  },
};

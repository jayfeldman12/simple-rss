import {ApolloServer} from 'apollo-server';
import {typeDefs} from './schema';
import {resolvers} from './resolvers';
import {FeedApi} from './datasources/feedApi';
import {logger} from './logger';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      feedApi: new FeedApi(),
    };
  },
  plugins: [logger],
});

server.listen().then(() => {
  console.log(`Server started`);
});

import 'reflect-metadata';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLScalarType } from 'graphql';
import { DateTimeResolver } from 'graphql-scalars';
import * as tq from 'type-graphql';
import * as dotenv from 'dotenv';
import { Context, context } from './context';
import { UserResolver } from './gql/resolvers/UserResolver';
import { AuthMiddlware } from './gql/middlewares/auth';
import { OutingResolver } from './gql/resolvers/OutingResolver';
import { PathResolver } from './gql/resolvers/PathResolver';

// Configures environment variables from .env file. See more: https://www.npmjs.com/package/dotenv
dotenv.config();

const app = async () => {
  const schema = await tq.buildSchema({
    resolvers: [UserResolver, OutingResolver, PathResolver],
    scalarsMap: [{ type: GraphQLScalarType, scalar: DateTimeResolver }],
    validate: { forbidUnknownValues: false },
    emitSchemaFile: true,
    authChecker: AuthMiddlware,
  });

  const server = new ApolloServer<Context>({ schema });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => {
      context.req = req;
      context.res = res;

      return context;
    },
  });

  console.log(`
🚀 Server ready at: ${url}
⭐️  See sample queries: http://pris.ly/e/ts/graphql-typegraphql#using-the-graphql-api`);
};

app();

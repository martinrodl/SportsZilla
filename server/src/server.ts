import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import dotenv from 'dotenv';
import { BookResolver } from './resolvers/BookResolver';

dotenv.config();
const { PORT } = process.env;

async function main() {
  const schema = await buildSchema({
    resolvers: [BookResolver], // add this
  });
  const server = new ApolloServer({ schema });
  server.listen(PORT)
    .then(() => console.info(`Server has started on port: ${PORT}!`));
}

main();

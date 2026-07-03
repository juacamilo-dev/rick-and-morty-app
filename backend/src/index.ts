import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';

import { connectDatabase } from './config/database';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './resolvers';
import { requestLogger } from './middleware/requestLogger';
import { startCharacterUpdateCron } from './jobs/updateCharacters.job';
import './models';

const PORT = process.env.PORT || 4000;

async function startServer() {
  await connectDatabase();

  const app = express();

  app.use(cors());
  app.use(requestLogger);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  app.use('/graphql', json(), expressMiddleware(apolloServer));

  app.listen(PORT, () => {
    console.log(`[Server] Backend corriendo en http://localhost:${PORT}/graphql`);
  });

  startCharacterUpdateCron();
}

startServer().catch((error) => {
  console.error('[Server] Error fatal al iniciar:', error);
  process.exit(1);
});

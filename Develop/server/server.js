const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express64')
const { typeDefs, resolvers } = require('./schemas')

const app = express();
const PORT = process.env.PORT || 3001;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', async () => {

  await apolloServer/start()
  app.use('/graphql', expressMiddleware(apolloServer, {
    context: async ({ req }) => ({ token: req.headers.token})
  }))


  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

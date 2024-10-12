import mongoose from 'mongoose';
import { MODEL_NAMES } from '../constants/models';
// import * as dotenv from 'dotenv';
// dotenv.config();

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;

const createURI = (dbName: string) => {
  // NOTE: This connects only to the dev database. Will need to structure to conditionally
  // support staging or production databases based on the environment. Those should be set
  // up in different clusters for better code separation.
  const credentials = encodeURI(`${mongoUser}:${mongoPassword}`);
  const databaseUrl =
    `mongodb+srv://${credentials}@after-dev.hubfpwg.mongodb.net/${dbName}` +
    `?retryWrites=true&w=majority&appName=after-dev`;

  return databaseUrl;
};

const connectDb = (dbName: string, { ...connectionOptions }) => {
  const uri = createURI(dbName);
  const connection = mongoose.createConnection(uri, {
    autoIndex: false,
    ...connectionOptions,
  });

  connection.on('connected', () => {
    console.log(`Connected to ${connection.name} database.`);
  });

  connection.on('error', (error) => {
    console.error(`Error connecting to ${connection.name} database:`, error);
  });

  connection.on('close', () => {
    console.log(
      `Closed connection to${connection.name} - attmepting to reconnect.`,
    );
  });

  return connection;
};

// Main core database. Might split into different databases for better organization
// later.
const coreDb = connectDb('core', {
  autoIndex: false,
});

export { coreDb, MODEL_NAMES };

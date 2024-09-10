import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import * as models from './models';
import { IncomingMessage, ServerResponse } from 'http';
import { User } from './models/user';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  mongoose: typeof mongoose;
  models: typeof models;
  req?: IncomingMessage;
  res?: ServerResponse<IncomingMessage>;
  auth0User: {
    sub: string;
    nickname: string;
    name: string;
    picture: string;
    updated_at: string;
    email: string;
    email_verified: boolean;
  } | null;
  user: User | null;
}

export const context: Context = {
  prisma: prisma,
  mongoose: mongoose,
  models,
  auth0User: null,
  user: null,
};

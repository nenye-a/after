import { PrismaClient } from '@prisma/client'
import mongoose from 'mongoose'
import * as models from './models'

const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient
  mongoose: typeof mongoose
  models: typeof models
}

export const context: Context = {
  prisma: prisma,
  mongoose: mongoose,
  models
}

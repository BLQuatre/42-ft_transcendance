import { FastifyInstance, FastifyRequest } from 'fastify';
import { googleLogSign, googleRedir } from '../controllers/google.controllers';

export async function authRoutes(app: FastifyInstance) {
  app.get('/auth/google', googleRedir);
  app.get('/auth/google/callback', googleLogSign);
}

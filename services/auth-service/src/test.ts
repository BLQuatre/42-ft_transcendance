import Fastify from 'fastify';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const app = Fastify();

const JWT_SECRET = 'supersecret';
const REFRESH_SECRET = 'refreshsecret'; // différent du secret JWT
const refreshTokenStore = new Map<string, string>(); // token -> username

const generateTokens = (username: string) => {
  const accessToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = crypto.randomBytes(64).toString('hex');
  refreshTokenStore.set(refreshToken, username);
  return { accessToken, refreshToken };
};

app.post('/auth/signup', async (req, reply) => {
  const { username, password } = req.body as any;
  const tokens = generateTokens(username);
  reply.send(tokens);
});

app.post('/auth/login', async (req, reply) => {
  const { username, password } = req.body as any;
  const tokens = generateTokens(username);
  reply.send(tokens);
});

app.post('/auth/validate', async (req, reply) => {
  const { token } = req.body as any;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    reply.send({ valid: true, decoded });
  } catch (err) {
    reply.status(401).send({ valid: false });
  }
});

app.post('/auth/refresh', async (req, reply) => {
  const { refreshToken } = req.body as any;
  const username = refreshTokenStore.get(refreshToken);
  if (!username) {
    return reply.status(401).send({ message: 'Invalid refresh token' });
  }

  // Optionally rotate token (invalider l'ancien)
  refreshTokenStore.delete(refreshToken);

  const tokens = generateTokens(username);
  reply.send(tokens);
});

app.listen({ port: 3001 });

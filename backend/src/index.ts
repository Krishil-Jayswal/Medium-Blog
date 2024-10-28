import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
  }
}>();

app.post('/api/v1/user/signup', (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());
  
  return c.text('Signup route.');
});

app.post('/api/v1/user/signin', (c) => {
  return c.text('signin route.');
});

app.post('/api/v1/blog', (c) => {
  return c.text('Hello Hono!');
});

app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!');
});

app.get('/api/v1/blog/:id', (c) => {
  return c.text('Hello Hono!');
});

export default app;

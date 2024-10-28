import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  },
  Variables: {
    userId: string
  }
}>();

app.use('/api/v1/blog/*', async (c, next) => {
  const jwt = c.req.header('Authorization');

  if(!jwt) {
    c.status(401);
    return c.json({
      error: 'unauthorized'
    });
  }

  const token = jwt.split(' ')[1];

  const payload = await verify(token, c.env.JWT_SECRET);

  if(!payload) {
    c.status(401);
    return c.json({
      error: 'unauthorized'
    });
  }
  
  c.set('userId', String(payload.id));
  await next();
});

app.post('/api/v1/user/signup', async (c) => {
  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password
      }
    });

    const token = await sign({id:user.id}, c.env.JWT_SECRET);

    return c.json({
      token
    });

  } catch (error) {
    console.error(error);

    c.status(403);
    return c.json({
      error: 'Error while signing up.'
    });
  } 
});

app.post('/api/v1/user/signin', async (c) => {

  const primsa = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    const user = await primsa.user.findUnique({
      where: {
        email: body.email,
        password: body.password
      }
    });

    if(!user) throw new Error();

    const token = await sign({id:user.id}, c.env.JWT_SECRET);

    return c.json({
      token
    });
  } catch(error) {
    console.error(error);

    c.status(403);
    return c.json({
      error: 'User not found'
    });

  }
});

app.post('/api/v1/blog', (c) => {
  console.log(c.get('userId'));
  return c.text('Hello Hono!');
});

app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!');
});

app.get('/api/v1/blog/:id', (c) => {
  return c.text('Hello Hono!');
});

export default app;

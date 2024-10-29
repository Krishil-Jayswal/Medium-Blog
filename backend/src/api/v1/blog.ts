import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
}>();

blogRouter.use('/api/v1/blog/*', async (c, next) => {
    
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

blogRouter.post('/blog', (c) => {
    return c.text('');
});

blogRouter.put('/blog', (c) => {
    return c.text('');
});

blogRouter.get('blog/bulk', (c) => {
    return c.text('');
});

blogRouter.get('/blog/:id', (c) => {
    return c.text('');
});

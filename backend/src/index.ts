import { Hono } from 'hono';
// import { protectedBlogRouter, publicBlogRouter } from './api/v1/blog';
import { cors } from 'hono/cors';
import V1Router from './api/v1/index.route';

const app = new Hono();

app.use(cors());

app.get("/", (c) => {
    return c.text("Medium Blog Backend");
});

app.route('/api/v1', V1Router);

// app.route('/api/v1/blog', publicBlogRouter);

// app.route('/api/v1/auth/blog', protectedBlogRouter);

export default app;

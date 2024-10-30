import { Hono } from 'hono';
import { userRouter } from './api/v1/user';
import { protectedBlogRouter, publicBlogRouter } from './api/v1/blog';

const app = new Hono();

app.route('/api/v1/user', userRouter);

app.route('/api/v1/blog', publicBlogRouter);

app.route('/api/v1/auth/blog', protectedBlogRouter);

export default app;

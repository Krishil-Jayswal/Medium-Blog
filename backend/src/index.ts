import { Hono } from 'hono';
import { userRouter } from './api/v1/user';
import { blogRouter } from './api/v1/blog';

const app = new Hono();

app.route('/api/v1/user', userRouter);

app.route('api/v1/blog', blogRouter);

export default app;

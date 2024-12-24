// import { Hono } from "hono";
// import { ResponseMessage } from "../../utils/responseMessages";
// import { ResponseStatus } from "../../utils/statusCodes";
// import { protectedBlogBindings, protectedBlogVariables, publicBlogBindings, publicBlogVariables } from "../../types/hono.type";
// import { createBlogInput, updateBlogInput } from "@jkrishil/medium-blog-common";
// import { protectRoute } from "../../middlewares/auth.middleware";
// import prismaClient from "../../middlewares/prismaClient.middleware";

// export const publicBlogRouter = new Hono<{
//   Bindings: publicBlogBindings,
//   Variables: publicBlogVariables
// }>();

// export const protectedBlogRouter = new Hono<{
//   Bindings: protectedBlogBindings,
//   Variables: protectedBlogVariables,
// }>();

// publicBlogRouter.use('*', prismaClient);

// // Pagination remaining.
// publicBlogRouter.get('/bulk', async (c) => {
  
//   const prisma = c.get('client');

//   try {
//     const blogs = await prisma.post.findMany({
//       select: {
//         id: true,
//         title: true,
//         content: true,
//         author: {
//           select: {
//             fullname: true,
//           },
//         },
//       },
//     });

//     return c.json({blogArray: blogs}, ResponseStatus.Success);

//   } catch(error: any) {
//     console.error('BULK ERROR: ' + error.message);
//     return c.json({error: ResponseMessage.InternalError, msg: ResponseMessage.IEBulk}, ResponseStatus.InternalError);
//   }
// });

// publicBlogRouter.get('/:blogId', async (c) => {

//   const prisma = c.get('client');

//   const id = c.req.param("blogId");
//   try {
//     if (id.length !== 36) throw new Error('InvalidBlogId');

//     const blog = await prisma.post.findFirst({
//       where: {
//         id: id,
//       },
//       select: {
//         id: true,
//         title: true,
//         content: true,
//         author: {
//           select: {
//             fullname: true,
//           },
//         },
//       },
//     });

//     if(!blog) throw new Error('BlogNotFound');

//     return c.json({blog}, ResponseStatus.Success);

//   } catch (error: any) {
//     if(error.message === 'InvalidBlogId') {
//       return c.json({error: ResponseMessage.InvalidBlogId}, ResponseStatus.InvalidInput);
//     }

//     if(error.message === 'BlogNotFound') {
//       return c.json({error: ResponseMessage.BlogNotFound}, ResponseStatus.NotFound);
//     }

//     console.error(':BLOGID ERROR ' + error.message);
//     return c.json({error: ResponseMessage.InternalError, msg: ResponseMessage.IEBlog}, ResponseStatus.InternalError);
//   }
// });

// protectedBlogRouter.use("*", protectRoute);

// protectedBlogRouter.use('*', prismaClient);

// protectedBlogRouter.post('/', async (c) => {
  
//   const prisma = c.get('client');

//   try {
//     const body = await c.req.json();

//     const { success } = createBlogInput.safeParse(body);

//     if (!success) throw new Error('InvalidInput');

//     const blog = await prisma.post.create({
//       data: {
//         title: body.title,
//         content: body.content,
//         authorId: c.get("userId"),
//       },
//     });

//     return c.json({id: blog.id, msg: ResponseMessage.BlogCreated}, ResponseStatus.Success);

//   } catch (error: any) {
//     if(error.message === 'InvalidInput') {
//       return c.json({error: ResponseMessage.InvalidInput}, ResponseStatus.InvalidInput);
//     }

//     console.error('Post Blog Error: ' + error.message);
//     return c.json({error: ResponseMessage.InternalError, msg: ResponseMessage.IECreateBlog}, ResponseStatus.InternalError);
//   }
// });

// protectedBlogRouter.put('/', async (c) => {
  
//   const prisma = c.get('client');

//   try {
//     const body = await c.req.json();

//     const { success } = updateBlogInput.safeParse(body);

//     if (!success) throw new Error('InvalidInput');

//     if(body.id.length !== 36) throw new Error('InvalidBlogId');

//     const blog = await prisma.post.update({
//       where: {
//         id: body.id,
//         authorId: c.get('userId')
//       },
//       data: {
//         title: body.title,
//         content: body.content,
//       },
//     });

//     return c.json({msg: ResponseMessage.BlogUpdated}, ResponseStatus.Success);

//   } catch (error: any) {
//     if(error.message === 'InvalidInput') {
//       return c.json({error: ResponseMessage.InvalidInput}, ResponseStatus.InvalidInput);
//     }

//     if(error.message === 'InvalidBlogId') {
//       return c.json({error: ResponseMessage.InvalidBlogId}, ResponseStatus.InvalidInput);
//     }

//     if(error.code === 'P2025') {
//       return c.json({error: ResponseMessage.BlogNotFound}, ResponseStatus.NotFound);
//     }

//     console.error('Update Blog Error: ' + error.message);
//     return c.json({error: ResponseMessage.InternalError, msg: ResponseMessage.IEBlogUpdate}, ResponseStatus.InternalError);
//   }
// });

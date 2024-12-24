import { PrismaClient } from "@prisma/client/edge";

export type userBindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

export type userVariables = {
  client: PrismaClient;
};

export type publicBlogBindings = {
  DATABASE_URL: string;
};

export type publicBlogVariables = {
  client: PrismaClient;
};

export type protectedBlogBindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

export type protectedBlogVariables = {
  userId: string;
  client: PrismaClient;
};

export type authBindings = {
  JWT_SECRET: string;
  DATABASE_URL: string;
}

export type authVariables = {
  client: PrismaClient;
  userId: string;
}

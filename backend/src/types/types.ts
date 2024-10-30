export type userBindings = {
  DATABASE_URL: string,
  JWT_SECRET: string,
};

export type publicBlogBindings = {
        DATABASE_URL: string,
}

export type protectedBlogBindings = {
    DATABASE_URL: string,
    JWT_SECRET: string,
}

export type protectedBlogVariables = {
    userId: string,
}

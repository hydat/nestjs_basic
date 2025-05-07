import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });

export default async () => {
  process.env.NODE_ENV = 'test';
};

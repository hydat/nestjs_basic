export default () => ({
  minio: {
    access_key: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
    secret_key: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
    bucket: process.env.MINIO_BUCKET ?? 'my-bucket',
  },
});

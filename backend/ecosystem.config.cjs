module.exports = {
  apps: [
    {
      name: 'mediahunter-api',
      script: 'dist/index.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

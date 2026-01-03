module.exports = {
  apps: [
    {
      name: 'nest-teashop',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};

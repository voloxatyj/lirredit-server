export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  host: process.env.HOST,
  protocol: process.env.PROTOCOL,
  environment: process.env.ENVIRONMENT,
});

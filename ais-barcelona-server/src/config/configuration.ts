export default () => ({
  server: {
    port: parseInt(process.env.SERVER_PORT, 10) || 3001,
  },
  ais: {
    pythonServerUrl: process.env.AIS_PYTHON_SERVER_URL,
  },
});

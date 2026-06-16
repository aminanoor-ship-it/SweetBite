require('dotenv').config();
const app = require('./src/app');
const { testConnection } = require('./src/config/db');

const port = Number(process.env.PORT || 5000);

async function start() {
  try {
    await testConnection();
    app.listen(port, () => {
      console.log(`SweetBite API running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to start SweetBite API:', error.message);
    process.exit(1);
  }
}

start();

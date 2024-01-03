const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

// console.log(app.get('env'));
// console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// ? Atlas MongoDB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

// ? Local MongoDB
// mongoose
//   .connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then(() => console.log('DB connection successful!'));

// ? Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

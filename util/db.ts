import mongoose from 'mongoose';

const connectDb = () => {
  mongoose.connect(process.env.DB_URL);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Database connected');
  });
};

export default connectDb;

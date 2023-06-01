import express from 'express';
import bookingRouter from './routers/booking.router';
import linesRouter from './routers/lines.router';
import shoesRouter from './routers/shoes.router';
const app = express();

app.use('/booking', bookingRouter);
app.use('/lines', linesRouter);
app.use('/shoes', shoesRouter);
export default app;

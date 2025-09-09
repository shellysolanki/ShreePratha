// import express from 'express';
// import mongoose from 'mongoose';
// import  cors from 'cors';
// import dotenv from 'dotenv';

// import userRouter from "./routes/userRouter.js";
// import reviewRouter from "./routes/reviewRouter.js";
// import paymentRouter from './routes/paymentRouter.js';
// import orderRouter from "./routes/orderRouter.js";
// import makeupRouter from './routes/makeupRouter.js';
// import jewelleryRouter from './routes/jewelleryRouter.js';
// import innerRouter from './routes/innerRouter.js';
// import couponRouter from './routes/couponRouter.js'
// import cartRouter from './routes/cartRouter.js';
// import bodycareRouter from './routes/bodyRouter.js';
// import adminRouter from './routes/adminRouter.js';
// import bagRouter from './routes/bagRouter.js';
// import authRoutes from './routes/authRouter.js';
// //import productRoutes from './routes/productRoutes.js';

// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
// app.use(cors());
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // MongoDB connect
// mongoose.connect("mongodb://127.0.0.1:27017/shreepratha")
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// // Routes
// app.use("/users", userRouter);
// app.use("/review", reviewRouter);
// app.use("/payment", paymentRouter);
// app.use("/order", orderRouter);
// app.use("/makeup", makeupRouter);
// app.use("/jewellery", jewelleryRouter);
// app.use("/inner", innerRouter);
// app.use("/coupon", couponRouter);
// app.use("/cart", cartRouter);
// app.use("/bodycare", bodycareRouter);
// app.use("/admin", adminRouter);
// app.use('/bag', bagRouter);
// app.use('/api/auth', authRoutes);
// //app.use('/api/products', productRoutes);

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRouter from "./routes/userRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import paymentRouter from './routes/paymentRouter.js';
import orderRouter from "./routes/orderRouter.js";
import makeupRouter from './routes/makeupRouter.js';
import jewelleryRouter from './routes/jewelleryRouter.js';
import innerRouter from './routes/innerRouter.js';
import couponRouter from './routes/couponRouter.js';
import cartRouter from './routes/cartRouter.js';
import bodycareRouter from './routes/bodyRouter.js';
import adminRouter from './routes/adminRouter.js';
import aboutRouter from './routes/aboutRouter.js';
import bagRouter from './routes/bagRouter.js';
import authRoutes from './routes/authRouter.js';
// import productRoutes from './routes/productRoutes.js';
import feedbackRouter from './routes/feedbackRouter.js';
import wishlistRouter from './routes/wishlistRouter.js';
import aiRouter from './routes/aiRouter.js';

dotenv.config();
const app = express();

// ✅ Payload size limit to fix 413 error
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ CORS config for frontend integration
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// ✅ MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/shreepratha")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ Modular route setup
app.use("/users", userRouter);
app.use("/review", reviewRouter);
app.use("/payment", paymentRouter);
app.use("/order", orderRouter);
app.use("/makeup", makeupRouter);
app.use("/jewellery", jewelleryRouter);
app.use("/inner", innerRouter);
app.use("/coupon", couponRouter);
app.use("/cart", cartRouter);
app.use("/bodycare", bodycareRouter);
app.use("/admin", adminRouter);
app.use("/bag", bagRouter);
app.use("/api/auth", authRoutes);
app.use("/about", aboutRouter);
app.use('/feedback', feedbackRouter);
app.use('/wishlist', wishlistRouter);
app.use('/ai', aiRouter);
// app.use('/api/products', productRoutes);

// ✅ Correct port log
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
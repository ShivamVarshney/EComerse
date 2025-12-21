import express from "express";
import cookieParser from "cookie-parser";
import formidable from "express-formidable";
import path from "path";
import cors from 'cors'

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173",                     // Keep this for local testing
    "https://frontend-beta-azure-94.vercel.app"  // <--- PASTE IT HERE (Add https://)
  ],
  credentials: true
}));
// app.use(formidable());

import userRouter from "./routes/user.routes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import ordersRoutes from "./routes/orderRoutes.js";
// import uploadRoutes from './routes/uploadRoutes.js'

app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", productRoutes);
// app.use('/api/v1/uploads' , uploadRoutes)
// const __dirname = path.resolve()
// app.use('/uploads',express.static(path.join(__dirname + '/uploads')))
app.use("/api/v1/orders", ordersRoutes);

app.get("/api/v1/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

export { app };

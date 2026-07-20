import express from "express";
import dotenv from "dotenv";
dotenv.config();
// import router from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";
import { ConnectToDB } from "./config/connect.js";
import ProductRouter from "./routes/product.routes.js";
import CategoryRouter from "./routes/category.routes.js";
import VariantRouter from "./routes/product_variant.routes.js";

await ConnectToDB();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/orders", orderRouter)
app.use("/api",ProductRouter)
app.use("/api",CategoryRouter)
app.use("/api",VariantRouter);

app.listen(PORT, () => {
  console.log(`BackEnd Server Started On Port ${PORT}`);
});

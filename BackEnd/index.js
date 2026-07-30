import express from "express";
import "dotenv/config"
import cookieParser from "cookie-parser";
import orderRouter from "./routes/order.routes.js";
import ConnectToDB from "./config/connect.js";
import ProductRouter from "./routes/product.routes.js";
import CategoryRouter from "./routes/category.routes.js";
import VariantRouter from "./routes/product_variant.routes.js";
import UserRouter from "./routes/user.routes.js";

const app = express();

await ConnectToDB();
app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 5000;


app.use("/api", UserRouter);
app.use("/api/orders", orderRouter)
app.use("/api", ProductRouter)
app.use("/api", CategoryRouter)
app.use("/api", VariantRouter);

app.listen(PORT, () => {
  console.log(`BackEnd Server Started On Port ${PORT}`);
});

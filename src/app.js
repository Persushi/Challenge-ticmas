import express from "express";
import indexRouter from './routes/index.js';
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/v1", indexRouter)
const server = app.listen(process.env.PORT || 5000, () => {
    const port = server.address().port;
    console.log(`Servidor abierto en puerto: ${port}`);
});

export default app

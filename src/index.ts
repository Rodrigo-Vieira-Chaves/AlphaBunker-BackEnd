import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { routes } from './routes/routesList';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

routes.initRoutes(app);

const port = process.env.PORT || 8000;

app.listen(port, () =>
{
    console.log(`Server is running at https://localhost:${port}`);
});

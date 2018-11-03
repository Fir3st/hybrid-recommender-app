import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as config from 'config';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as boom from 'express-boom';
import winston from '../../config/winston';
import router from './controllers';
import { initializePassport } from './middleware/auth';

const app: express.Application = express();
app.set('port', config.get('port') || 3001);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
app.use(boom());
app.use(morgan('combined', { stream: winston.stream }));
app.use(initializePassport());

router(app);

export default app;

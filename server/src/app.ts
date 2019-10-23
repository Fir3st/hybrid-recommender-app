import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as config from 'config';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as eboom from 'eboom';
import winston from './utils/winston';
import router from './controllers';
import { initializePassport } from './middleware/auth';

const app: express.Application = express();
app.set('port', config.get('port') || 3001);

app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'combined', { stream: winston.stream }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
app.use(eboom());
app.use(initializePassport());

router(app);

export default app;

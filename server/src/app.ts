import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as config from 'config';
import * as cors from 'cors';
import router from './controllers';
import { initializePassport } from './middleware/auth';

const app: express.Application = express();
app.set('port', config.get('port') || 3001);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
app.use(initializePassport());

router(app);

export default app;

import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as config from 'config';
import app from './app';

createConnection()
    .then(() => {
        console.log('Database connected');
        app.listen(app.get('port'), () => {
            console.log(`App is running at http://${config.get('host')}:${app.get('port')} in ${app.get('env')} mode`);
            console.log('Press CTRL-C to stop');
        });
    })
    .catch(error => console.log(error));

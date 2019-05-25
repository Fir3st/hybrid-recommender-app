import axios from 'axios';
import * as config from 'config';

const train = async () => {
    try {
        console.log('Training recommender API');
        const recommender = config.get('recommenderUrl');
        await axios.put(`${recommender}/train`);
    } catch (error) {
        console.log(error.message);
    }
};

train()
    .then(() => console.log('Recommender API trained'))
    .catch(error => console.log(error));

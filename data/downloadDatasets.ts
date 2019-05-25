import axios from 'axios';
import * as fs from 'fs';
import * as Path from 'path';
import * as AdmZip from 'adm-zip';

const regexp = new RegExp('(\\d)\/(\\d{4})', 'i');
const downloadData = async () => {
    const html = await axios.get('https://grouplens.org/datasets/movielens/latest/');
    const found = html.data.match(regexp);
    if (found.length >= 3) {
        const url = 'http://files.grouplens.org/datasets/movielens/ml-latest-small.zip';
        const fileName = `ml-latest-small-${found[1]}-${found[2]}.zip`;
        const path = Path.resolve(__dirname, 'original', fileName);
        const writer = fs.createWriteStream(path);

        const response = await axios.get(url, { responseType: 'stream' });

        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(fileName));
            writer.on('error', reject);
        });
    }
};

const copyFile = async (fileName) => {
    return new Promise((resolve, reject) => {
        try {
            fs.copyFileSync(`./data/original/${fileName}`, './data/original/ml-latest-small.zip');
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

const extractFiles = async () => {
    return new Promise((resolve, reject) => {
        try {
            const zip = new AdmZip('./data/original/ml-latest-small.zip');
            zip.extractEntryTo('ml-latest-small/links.csv', './data/original', false, true);
            zip.extractEntryTo('ml-latest-small/ratings.csv', './data/original', false, true);
            zip.extractEntryTo('ml-latest-small/movies.csv', './data/original', false, true);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

downloadData()
    .then(fileName => copyFile(fileName))
    .then(() => extractFiles())
    .then(() => console.log('Datasets downloaded.'))
    .catch(error => console.log(error));

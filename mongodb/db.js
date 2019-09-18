import mongoose from 'mongoose';
import configLite from 'config-lite';
import chalk from 'chalk';

const config = configLite({});

mongoose.connect(config.url, {useNewUrlParser: true});
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open', () => {
    console.log(
        chalk.green('数据库链接成功')
    );
});
db.on('error', err => {
    console.error(
        chalk.red('数据库链接出错')
    );
    mongoose.disconnect();
});
db.on('close', () => {
    console.log(
        chalk.red('数据库断开，重新链接数据库')
    );
    mongoose.connect(config.url, {
        server: {
            auto_reconnect: true
        }
    });
});

export default db;

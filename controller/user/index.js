import formidable from 'formidable';
import BaseComponent from '../../prototype/baseComponent';
import UserModle from '../../models/user/user';
import UserInfoModle from '../../models/user/userInfo';
import dtime from 'time-formater';
import crypto from 'crypto';


class User extends BaseComponent {

    constructor() {
        super();
        this.login = this.login.bind(this);
        this.encryptPassword = this.encryptPassword.bind(this);
    }

    async login(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {username, password} = fields;
            try {
                if (!username) {
                    throw new Error('用户名参数为空');
                } else if (!password) {
                    throw new Error('密码参数为空');
                }

            } catch (err) {
                console.log('登陆参数错误', err);
                res.send({
                    status: 0,
                    type: 'ERROR_QUERY',
                    message: err.message,
                })
                return
            }

            try {
                console.log(this);
                const encryptedPassword = this.encryptPassword(password);
                const user = await UserModle.findOne({username});
                console.log('user', user);
                if (!user) {
                    const user_id = await this.getId('user_id');
                    const registe_time = new dtime(new Date()).format('YYYY-MM-DD HH:mm');
                    const newUser = {username, password: encryptedPassword, registe_time,user_id};
                    const newUserInfo = {username, registe_time, user_id,id:user_id};
                    UserModle.create(newUser);
                    const createUser = new UserInfoModle(newUserInfo);
                    const userInfo = await createUser.save();
                    res.send(userInfo);
                } else if (user.password.toString() !== encryptedPassword.toString()) {
                    console.log('用户密码登陆错误');
                    res.send({
                        status: 0,
                        type: 'ERROR_PASSWORD',
                        message: '密码错误'
                    });
                    return;
                } else {
                    const userInfo = await UserInfoModle.findOne({user_id: user.user_id});
                    console.log('userInfo',userInfo);
                    res.send(userInfo);
                }

            } catch (err) {
                console.log('用户登陆失败', err);
                res.send({
                    status: 0,
                    type: 'SAVE_USER_FAILED',
                    message: '登陆失败'
                });
            }


        });

    }

    encryptPassword(password) {
        return this.md5(this.md5(password).substr(2, 7) + this.md5(password));
    }

    md5(data) {
        const md5 = crypto.createHash('md5');
        return md5.update(data).digest('base64');
    }
}

export default new User();
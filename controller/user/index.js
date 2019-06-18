import formidable from 'formidable';

class User {
    async login(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {username, password} = fields;
            try {
                if (!username) {
                    throw new Error('用户名参数为空');
                } else if (!password) {
                    throw new Error('密码参数为空');
                } else {
                    res.send({
                        status: 200,
                        message: '登陆成功！',
                    })
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
        });
    }
}

export default new User();
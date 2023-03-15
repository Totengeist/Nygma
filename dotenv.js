require('dotenv').config()

module.exports = {
        env(item) {
		return process.env[item];
        },
};


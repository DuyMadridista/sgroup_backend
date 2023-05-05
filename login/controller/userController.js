class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async register(req, res) {
        try {
            const user = req.body;
            await this.userService.registerUser(user);
            res.status(200).json({ message: 'Register successfully' });
        } catch (error) {
            console.log(error.message);
            if (error.message === 'Username already exists') {
                res.status(400).json({ message: 'Username already exists' });
            } else {
                res.status(500).json({ message: 'Failed to register user' });
            }
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const token = await this.userService.loginUser(username, password);
            res.status(200).json({ message: 'Login successfully', token: token });
        } catch (error) {
            if (error.message === 'User not found' || error.message === 'Incorrect password') {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Failed to login' });
            }
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const input = req.body;
            await this.userService.updateUser(id, input);
            return res.status(200).json({ message: 'User updated' });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({ message: 'User not found' });
            } else {
                return res.status(500).json({ message: 'Failed to update user' });
            }
        }
    }
}
module.exports = UserController;
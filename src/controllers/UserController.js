const User = require("../models/User");
const createUserToken = require("../helpers/createUserToken");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, username, password, confirmPassword, level } = req.body;

    //validations
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório" });
      return;
    }

    if (!email) {
      res.status(422).json({ message: "O email é obrigatório" });
      return;
    }
    if (!username) {
      res.status(422).json({ message: "O telefone é obrigatório" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória" });
      return;
    }
    if (!confirmPassword) {
      res.status(422).json({ message: "A confirmação de senha é obrigatória" });
      return;
    }
    if (password !== confirmPassword) {
      res.status(422).json({
        message: "A senha e a confirmação de senha precisam ser iguais",
      });
      return;
    }

    console.log('passed validations');

    // check if user exists
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      res.status(422).json({
        message: "Por favor, utilize outro e-mail!",
      });
      return;
    }

    console.log('passed user exists check');

    // create a user
    const user = new User({
      name,
      email,
      username,
      password,
      level: level || 'user',
      active: true, 
    });

    try {
      console.log('starting save')
      const newUser = await user.save();
      console.log('passed save');
    res.status(200).json(newUser);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: "O email é obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória" });
      return;
    }

    // check if user exists
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(422).json({
        message: "Não há usuário cadastrado com esse email!",
      });
      return;
    }

    // check if password match with db password
    const checkPassword = password === user.password;

    if (!checkPassword) {
      res.status(422).json({
        message: "Senha inválida!",
      });
      return;
    }

    await createUserToken(user, req, res);
  }

  static async getUsers(req, res) {
    const users = await User.find().select("-password");

    if (!users) {
      res.status(422).json({
        message: "Não há usuários cadastrados",
      });
      return;
    }

    res.status(200).json({ users });
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(422).json({
        message: "Usuário não encontrado",
      });
      return;
    }

    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    const id = req.params.id;

    //check if user exists
    const user = await User.findById(id);

    const { name, email, username, password, confirmPassword } = req.body;

    //validations
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório" });
      return;
    }

    user.name = name;

    if (!email) {
      res.status(422).json({ message: "O email é obrigatório" });
      return;
    }

    //check if email has already taken
    const userExists = await User.findOne({ email: email });

    if (user.email !== email && userExists) {
      res.status(422).json({
        message: "Por favor, utilize outro email",
      });
      return;
    }

    user.email = email;

    if (!username) {
      res.status(422).json({ message: 'O nome de usuário é obrigatório!' })
      return
    }

    user.username = username

    if(password != confirmPassword){
      res.status(422).json({ 
        message : 'As senhas não conferem!'
      });
      return;
    } else if(password === confirmPassword && password != null){
      //creating password
      user.password = password
    }

    try{
      //returns user update data
      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true },
      )
      res.status(200).json({
        message: 'Usuário atualizado com sucesso!',
      })
    }catch (err){
      res.status(500).json ({message: err})
      return
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
};

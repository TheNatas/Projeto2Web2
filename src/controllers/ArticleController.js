const Article = require("../models/Article");
const User = require("../models/User");

module.exports = class ArticleController {
  static async test(req, res) {
    res.status(200).json({ message: "Hello World!" });
  }
  static async create(req, res) {
    const { title, body, permalink, keywords, suggestion, featured, authorEmail } = req.body;

    //validations
    if (!title) {
      res.status(422).json({ message: "O título é obrigatório" });
      return;
    }

    if (!body) {
      res.status(422).json({ message: "O corpo é obrigatório" });
      return;
    }
    if (!permalink) {
      res.status(422).json({ message: "O link permanente é obrigatório" });
      return;
    }

    if (!authorEmail) {
      res.status(422).json({ message: "O email do autor é obrigatório" });
      return;
    };

    console.log('passed validations');

    // check if user exists
    const authorExists = await User.findOne({ email: email });

    if (!authorExists) {
      res.status(422).json({
        message: "Autor não existe!",
      });
      return;
    }

    console.log('passed user exists check');

    // create a user
    const article = new Article({
      title,
      body,
      permalink,
      keywords,
      suggestion,
      featured,
      authorEmail,
      publishedAt: Date.now(),
    });

    try {
      console.log('starting save')
      const newArticle = await article.save();
      console.log('passed save');
      res.status(200).json(newArticle);
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
    const user = await Article.findOne({ email: email });

    if (!user) {
      res.status(422).json({
        message: "Não há usuário cadastrado com esse email!",
      });
      return;
    }

    // check if password match with db password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({
        message: "Senha inválida!",
      });
      return;
    }

    await createArticleToken(user, req, res);
  }

  static async checkArticle(req, res) {
    let currentArticle;

    console.log(req.headers.authorization);

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "nossosecret");

      currentArticle = await Article.findById(decoded.id);

      currentArticle.password = undefined;
    } else {
      currentArticle = null;
    }

    res.status(200).send(currentArticle);
  }

  static async getArticleById(req, res) {
    const id = req.params.id;

    const user = await Article.findById(id).select("-password");

    if (!user) {
      res.status(422).json({
        message: "Usuário não encontrado",
      });
      return;
    }

    res.status(200).json({ user });
  }

  static async editArticle(req, res) {
    const id = req.params.id;

    //check if user exists
    const token = getToken(req);
    const user = await getArticleByToken(token);

    const { name, email, phone, password, confirmPassword } = req.body;

    let image = ''

    if(req.file){
     user.image = req.file.filename
    }



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
    const userExists = await Article.findOne({ email: email });

    if (user.email !== email && userExists) {
      res.status(422).json({
        message: "Por favor, utilize outro email",
      });
      return;
    }

    user.email = email;

    if (!phone) {
      res.status(422).json({ message: 'O telefone é obrigatório!' })
      return
    }

    user.phone = phone

    if(password != confirmPassword){
      res.status(422).json({ 
        message : 'As senhas não conferem!'
      });
      return;
    } else if(password === confirmPassword && password != null){
      //creating password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      user.password = passwordHash
    }

    try{
      //returns user update data
      await Article.findOneAndUpdate(
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
};

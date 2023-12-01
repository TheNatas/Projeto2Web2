const Article = require("../models/Article");
const User = require("../models/User");

module.exports = class ArticleController {
  static async create(req, res) {
    const {
      title,
      body,
      permalink,
      keywords,
      suggestion,
      featured,
      authorEmail,
    } = req.body;

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
    }

    console.log("passed validations");

    // check if user exists
    const authorExists = await User.findOne({ email: authorEmail });

    if (!authorExists) {
      res.status(422).json({
        message: "Autor não existe!",
      });
      return;
    }

    console.log("passed user exists check");

    // create a user
    const article = new Article({
      title,
      body,
      permalink,
      keywords,
      likes: 0,
      published: true,
      suggestion,
      featured,
      authorEmail,
      publishedAt: Date.now(),
    });

    try {
      console.log("starting save");
      const newArticle = await article.save();
      console.log("passed save");
      res.status(200).json(newArticle);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  }

  static async getArticles(req, res) {
    const articles = await Article.find().sort({ publishedAt: -1 });

    if (!articles) {
      res.status(422).json({
        message: "Nenhum artigo encontrado",
      });
      return;
    }

    res.status(200).json({ articles });
  }

  static async getArticleByPermalink(req, res) {
    const permalink = req.params.permalink;

    const article = await Article.findOne({ permalink: permalink });

    if (!article) {
      res.status(422).json({
        message: "Artigo não encontrado",
      });
      return;
    }

    res.status(200).json({ article });
  }

  static async editArticle(req, res) {
    const id = req.params.id;

    //check if article exists
    const article = await Article.findOne({ _id: id });

    const {
      title,
      body,
      permalink,
      keywords,
      suggestion,
      featured,
      authorEmail,
    } = req.body;

    //validations
    if (!title) {
      res.status(422).json({ message: "O título é obrigatório" });
      return;
    }
    if (article.title !== title) {
      article.title = title;
    }

    if (!body) {
      res.status(422).json({ message: "O corpo é obrigatório" });
      return;
    }
    if (article.body !== body) {
      article.body = body;
    }

    if (!permalink) {
      res.status(422).json({ message: "O link permanente é obrigatório" });
      return;
    }
    if (article.permalink !== permalink) {
      article.permalink = permalink;
    }

    if (!authorEmail) {
      res.status(422).json({ message: "O email do autor é obrigatório" });
      return;
    }
    if (article.authorEmail !== authorEmail) {
      article.authorEmail = authorEmail;
    }

    console.log("passed validations");

    // check if article exists
    const authorExists = await User.findOne({ email: authorEmail });

    if (!authorExists) {
      res.status(422).json({
        message: "Autor não existe!",
      });
      return;
    }

    console.log("passed author exists check");

    if (article.keywords !== keywords) {
      article.keywords = keywords;
    }
    if (article.suggestion !== suggestion) {
      article.suggestion = suggestion;
    }
    if (article.featured !== featured) {
      article.featured = featured;
    }

    try {
      //returns article update data
      await Article.findOneAndUpdate(
        { _id: article._id },
        { $set: article },
        { new: true }
      );
      res.status(200).json({
        article,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: err });
      return;
    }
  }

  static async deleteArticle(req, res) {
    const id = req.params.id;

    //check if article exists
    const article = await Article.findOne({ _id: id });

    if (!article) {
      res.status(422).json({
        message: "Artigo não encontrado",
      });
      return;
    }

    try {
      //returns article update data
      await Article.deleteOne({ _id: article._id });
      res.status(200).json({
        message: "Artigo deletado com sucesso!",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: err });
      return;
    }
  }

  static async getMostLikedArticles(req, res) {
    const articles = await Article.find().sort({ likes: -1 }).limit(10);

    if (!articles) {
      res.status(422).json({
        message: "Nenhum artigo encontrado",
      });
      return;
    }

    res.status(200).json({ articles });
  }

  static async getFeaturedArticles(req, res) {
    const articles = await Article.find({ featured: true });

    if (!articles) {
      res.status(422).json({
        message: "Nenhum artigo encontrado",
      });
      return;
    }

    res.status(200).json({ articles });
  }

  static async getSuggestedArticles(req, res) {
    const articles = await Article.find({ suggestion: true });

    if (!articles) {
      res.status(422).json({
        message: "Nenhum artigo encontrado",
      });
      return;
    }

    res.status(200).json({ articles });
  }

  static async getArticlesByAuthor(req, res) {
    const authorEmail = req.params.authorEmail;

    const articles = await Article.find({ authorEmail: authorEmail });

    if (!articles) {
      res.status(422).json({
        message: "Nenhum artigo encontrado",
      });
      return;
    }

    res.status(200).json({ articles });
  }

  static async getArticlesByKeyword(req, res) {
    const keyword = req.params.keyword;

    const articles = await Article.find({
      keywords: { $regex: ".*" + keyword + ".*" },
    });

    if (!articles) {
      res.status(422).json({
        message: "Nenhum artigo encontrado",
      });
      return;
    }

    res.status(200).json({ articles });
  }

  static async likeArticle(req, res) {
    const id = req.params.id;

    //check if article exists
    const article = await Article.findOne({ _id: id });

    if (!article) {
      res.status(422).json({
        message: "Artigo não encontrado",
      });
      return;
    }

    try {
      res.status(200).json({
        article,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: err });
      return;
    }
  }
};

const Article = require("../models/Article");

const liked_counter = async (req, res, next) => {
    
  const articleId = req.params.id;

  const article = Article.findOne({ _id: articleId });
  
  try{
    //returns article update data
    await Article.findOneAndUpdate(
      { _id: article._id },
      { likes: article.likes + 1 },
      { new: true },
    )
    res.status(200).json({
      message: 'Artigo atualizado com sucesso!',
    })
  } catch (err){
    console.error(err.message)
    res.status(500).json ({message: err})
    return
  }
  
  return next(); 
     
}

module.exports = liked_counter;
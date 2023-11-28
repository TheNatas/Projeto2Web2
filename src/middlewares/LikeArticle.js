const Article = require("../models/Article");

const articleLiking = async (req, res, next) => {
    
  const articleId = req.params.id;

  const article = await Article.findOne({ _id: articleId });
  
  try{
    //returns article update data
    await Article.findOneAndUpdate(
      { _id: article._id },
      { likes: article.likes + 1 },
      { new: true },
    )
    return next(); 
  } catch (err){
    console.error(err.message)
    res.status(500).json ({message: err})
    return
  }
     
}

module.exports = articleLiking;
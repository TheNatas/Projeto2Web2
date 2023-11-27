const mongoose = require("../connection");
const { Schema } = mongoose;

const Article = mongoose.model(
  "Article",
  new Schema(
    {
      title: {
        type: String,
        required:true,
      },
      body: {
        type: String,
        required: true,
      },
      permalink: {
        type: String,
        required: true,
        unique: true,
      },
      keywords: {
        type: String,
        required: true,
      },
      likes: {
        type: Number,
        required: true,
      },
      published: {
        type: Boolean,
        required: true,
      },
      suggestion: {
        type: Boolean,
        required: true,
      },
      featured: {
        type: Boolean,
        required: true,
      },
      authorEmail: {
        type: String,
        required: true,
      },
      publishedAt: {
        type: Date,
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = Article;

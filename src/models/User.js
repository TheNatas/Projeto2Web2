const mongoose = require("../connection");
const { Schema } = mongoose;

const User = mongoose.model(
  "User",
  new Schema(
    {
      name: {
        type: String,
        required:true,
      },
      email: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      level: {
        type: String,
        required: true,
      },
      active: {
        type: Boolean,
        required: true,
      }
    },
    { timestamps: true }
  )
);

module.exports = User;

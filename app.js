//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Reading Enviroment Variables
dotenv.config();

const main_StartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//start express application
const app = express();

//render template files using the view engine
app.set('view engine', 'ejs');

//Setting up our static path and Body Parser
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Connect to local MongoDB "mongodb://localhost:27017/blogDB" or Connect to Your MongoDb Atlas Connection
mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//creating postSchema
const postSchema = {
  title: String,
  content: String
};

//Creating new MongooseModel to define Post collection
const Post = mongoose.model("Post", postSchema);

//Setting up Home Route
app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("home", {
      starting_Content: main_StartingContent,
      posts: posts
    });
  });
});

//Setting up about route + render about.ejs
app.get("/about", function(req, res) {
  res.render("about", {
    about_Content: aboutContent
  });
});

//Setting up Contact Route + render contact.ejs
app.get("/contact", function(req, res) {
  res.render("contact", {
    contact_Content: contactContent
  });
});

//Setting up Compose Route + render compose.ejs
app.get("/compose", function(req, res) {
  res.render("compose");
});

//Grab the data they send to us, redirict to home route
app.post("/compose", function(req, res) {
  const post_Title = req.body.post_Title;
  const post_Body = req.body.post_Body;

  const post = new Post({
    title: post_Title,
    content: post_Body
  });

  post.save().then(res.redirect("/"));
});

//Setting Up dynamic URL
app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;
  Post.findById({
    _id: requestedPostId
  }, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

//Setting up the Delete Route + remove posts
app.post("/delete", function(req, res) {
  const deletePost = req.body.deletePost;
  Post.findOneAndRemove({
    title: deletePost
  }).then(res.redirect("/"));
});

//------------------ Listen on Port 3000 ---------------------------------------
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

//set up express server
app.listen(port, function() {
  console.log("Server started successfully on " + port);
});

// Express 
const express = require('express');
const app = express();

// Extra Modules
const bodyParser = require('body-parser');
const ejs = require('ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/wikiDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const { Schema } = mongoose;

const wikiSchema = new Schema({
    title: String,
    content: String
});

const Wiki = mongoose.model('Wiki', wikiSchema);

// Request for the whole API's data

app.route('/articles')
  
  .get((req, res) => {

    Wiki.find((err, wikis) => {
      !err ? res.send(wikis) : res.send(err);
    })
  })
  .post((req, res) => {
  
    Wiki.create({
      title: req.body.title,
      content: req.body.content
    }, err => {
      !err ? res.send('Post made, API working') : console.log(err);
    })
  })

  .delete((req, res) => {
    
    Wiki.deleteMany(err => {
      !err ? res.send('Items have been deleted') : res.send(err);
    })
  });

// Requests for specific API data

app.route('/articles/:wikiTitle')
  
  .get((req, res) => {
    Wiki.findOne({ title: req.params.wikiTitle }, (err, data) => {
      !data ? res.send('No data found under this query') : res.send(data);
    });
  })
  
  .put((req, res) => {
    Wiki.updateOne({ title: req.params.wikiTitle }, { title: req.params.title, content: req.params.content },
      err => {
        !err ? res.send('Item has been updated') : res.send(err);
      });
  })

  .patch((req, res) => {
    Wiki.updateOne({ title: req.params.wikiTitle }, { $set: req.body },
      err => {
        !err ? res.send('Updated successfuly') : res.send('Please try again');
      });
  })
  
  .delete((req, res) => {
    Wiki.deleteOne({ title: req.params.wikiTitle },
      err => !err ? res.send('Item deleted') : res.send('Please try a different query'));
  });

app.listen(3000, () => console.log('Port has started on 3000 one.'));
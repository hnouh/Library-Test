const mongoose = require("mongoose");
const seedBook = require("./book_seed");
const seedAuthor = require("./author_seed");
const Book = require("./models/bookAndAuthor").Book;
const Author = require("./models/bookAndAuthor").Author;
const authRouter = require("./routes/authRoute");
const express = require("express");
const app = express();
var cors = require("cors");
const uri =
  "mongodb+srv://hnooh:Ar648898@cluster0.mqfrq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.json());
app.use(cors()); 
app.use(authRouter); 

app.get("/allAuthors", async (req, res) => {
  try {
    const authors = await Author.find();
    res.send(authors);
  } catch (e) {
    res.status(500).send();
    console.error(e);
  }
}); 

//if books assign as reference , also work if not reference
app.get("/Authors/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const author = await Author.findOne({ _id }).populate("books").exec();
    res.send(author);
  } catch (e) {
    res.status(500).send();
    console.error(e);
  }
});

app.post("/book/:id", async (req, res) => {
  const _id = req.params.id;
  const author = await Author.findOne({ _id });
  const newBook = new Book({
    title: req.body.title,
    price: req.body.price,
    bookImage: req.body.bookImg,
    pages: req.body.pages,
  });
  author.books.push(newBook);
  console.log(author);
  try {
    await author.save();
    res.status(201).send(author);
  } catch (e) {
    console.error(e);
  }
  console.log("Added");
});

app.patch("/authors/:id", async (req, res) => {
  const allowedUpdates = ["name", "nationality", "authorImage", "password"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
    // anything not expected from the authors
  }
  try {
    const author = await Author.findOne({ _id: req.params.id });
    // find id passed into the function
    if (!author) {
      return res.status(404).send(404).send();
    }
    updates.forEach((update) => {
      author[update] = req.body[update];
      // update the values and keys dynamically
    });
    await author.save();
    res.status(200).send(author);
  } catch (e) {
    res.status(400).send(e);
    console.error(e);
  }
});

app.delete("/book/:authId/:bookId", async (req, res) => {
  const bookId = req.params.bookId;
  try {
    const author = await Author.findById(req.params.authId);
    if (!author) {
      return res.status(404).send();
    }
    await author.books.pull({ _id: bookId });
    await author.save();
    res.status(201).send(author);
  } catch (e) {
    res.status(500).send();
    console.error(e);
  }
});

app.put("/editBook/:authId/:bookId", async (req, res) => {
  Author.update(
    { "books._id": req.params.bookId },
    {
      $set: {
        "books.$.title": req.body.title,
        "books.$.pages": req.body.pages,
        "books.$.price": req.body.price,
        "books.$.bookImage": req.body.bookImage,
      },
    },
    function (err, model) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      // return res.json(model);
    }
  );
  const author = await Author.findById(req.params.authId);
  res.status(201).send(author);
});
 

//get specific book detail
app.get("/book/:authId/:bookId", async (req, res) => {
  var query = await Author.find({_id: req.params.authId}).select('books');
  // const getSpecificBook = query[1].filter(element => element._id ==req.params.bookId);
  console.log(query)
  
  const test= query.map(book =>{
    return (
      book.books.filter(element => element._id ==req.params.bookId)
      // console.log(book.books)
      
      )
  })
    try {
    console.log("tessttt:"+test);
    res.send(test)
  } catch (error) {
    res.status(400).send()
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT);

const connection = mongoose.connection;
connection.once(
  "open",
  () => console.log("Connected to DB"),
  connection.on("disconnected", () => console.log("mongo disconnected")),
  connection.on("error", (err) => {
    console.log("connection error", err);
  })
);

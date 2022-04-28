// import all libs
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = 3000;

// to prevent cors errors
app.use(cors());

// url to connect to mongodb
const uri =
  "mongodb+srv://root:root@band.vjeaa.mongodb.net/companies?retryWrites=true&w=majority";

// home get response
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/search", async (req, res) => {
  let dcmt = {};
  if (req.query.type === "name") {
    dcmt["company"] = req.query.term;
  } else {
    dcmt["ticker"] = req.query.term;
  }
  let data = [];
  // connect with the mongodb collection
  const cli = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  await cli.connect(async (err) => {
    const collect = await cli.db("companies").collect("companies");
    console.log(">>> Connected*", dcmt);

    await collect
      .find(dcmt, { projection: { _id: 0, company: 1, ticker: 1 } })
      .forEach((e) => {
        data.push(e);
      });
    cli.close();
    res.send(data);
  });
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

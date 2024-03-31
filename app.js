const express = require("express");
const mongoose = require("mongoose");
const Balance = require("./model/balance");
const watchList = require("./model/watchList");
const portfolio = require("./model/portfolio");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors());

const port = 3001;
const uri = process.env.MONGODB_CONNECTION_STRING;

mongoose.connect(uri, {});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//Creates a new blalance item. You need to pass the balance only ONCE!!
app.post("/CreateBalance", async (req, res) => {
  try {
    console.log(req.body);
    await Balance.create(req.body);

    res.send("Balance added successfully");
  } catch (error) {
    console.log("ERROR::", error);
    res.status(500).send("An error occurred");
  }
});

//Fetches the balance
app.get("/balance", async (req, res) => {
  try {
    const data = await Balance.find({});
    console.log("Balance from the Database: ", data);
    res.send(data.map((item) => item.balance));
  } catch (error) {
    console.error("ERROR::", error);
    res.status(500).send("An error occurred while fetching balances");
  }
});

//Updates the balance. You need to pass the new balance in the request body.
app.patch("/balance/:id", async (req, res) => {
  const { id } = req.params; // Extract the _id from the URL
  const { balance } = req.body; // Extract the new balance value from the request body

  if (!balance) {
    return res.status(400).send("Balance update data is missing");
  }

  try {
    const updatedBalance = await Balance.findByIdAndUpdate(
      id,
      { $set: { balance: balance } }, // Set the new balance value
      { new: true } // Return the updated document
    );

    if (!updatedBalance) {
      return res.status(404).send("Balance with the specified ID not found");
    }

    res.json(updatedBalance); // Send back the updated document
  } catch (error) {
    console.error("ERROR::", error);
    res.status(500).send("An error occurred during the update");
  }
});

//Creates a new watchList item. You need to pass the watchList array in the request body.
app.post("/CreatewatchList", async (req, res) => {
  try {
    console.log(req.body);
    await watchList.create(req.body);

    res.send("watchList added successfully");
  } catch (error) {
    console.log("ERROR::", error);
    res.status(500).send("An error occurred");
  }
});

//Fetches the watchList
app.get("/watchList", async (req, res) => {
  try {
    const data = await watchList.find({});
    console.log("watchList from the Database: ", data);
    res.send(data);
  } catch (error) {
    console.error("ERROR::", error);
    res.status(500).send("An error occurred while fetching watchLists");
  }
});

// Deletes the watchlist item with the specified name
app.delete("/DeletewatchList/:watchListName", async (req, res) => {
  const { watchListName } = req.params; // Extract the watchListName from the URL

  try {
    // Attempt to find and remove the document with the specified watchListName
    const deletedWatchList = await watchList.findOneAndDelete({
      watchList: watchListName,
    });

    // If no document was found, return a 404 error
    if (!deletedWatchList) {
      return res
        .status(404)
        .send("WatchList with the specified name not found");
    }

    // If a document was found and removed, return a success message
    res.send({
      message: "WatchList item removed successfully",
      deletedWatchList: deletedWatchList,
    });
  } catch (error) {
    console.error("ERROR::", error);
    res.status(500).send("An error occurred during the deletion process");
  }
});

//Creates a new portfolio item. You need to pass the ticker, quantity and totalcost in the request body.
app.post("/Createportfolio", async (req, res) => {
  try {
    console.log(req.body);
    await portfolio.create(req.body);

    res.send("portfolio added successfully");
  } catch (error) {
    console.log("ERROR::", error);
    res.status(500).send("An error occurred");
  }
});

//Fetches all the portfolio items
app.get("/portfolio", async (req, res) => {
  try {
    const data = await portfolio.find({});
    console.log("portfolio from the Database: ", data);
    res.send(data);
  } catch (error) {
    console.error("ERROR::", error);
    res.status(500).send("An error occurred while fetching portfolio");
  }
});

//Deletes the portfolio item with the specified ticker
app.delete("/DeleteFromportfolio/:ticker", async (req, res) => {
  const { ticker } = req.params; // Extract the ticker from the URL

  try {
    // Attempt to find and remove the document with the specified ticker
    const deletedPortfolio = await portfolio.findOneAndDelete({
      ticker: ticker,
    });

    // If no document was found, return a 404 error
    if (!deletedPortfolio) {
      return res
        .status(404)
        .send("Portfolio with the specified ticker not found");
    }

    // If a document was found and removed, return a success message
    res.send({
      message: "Portfolio item removed successfully",
      deletedPortfolio: deletedPortfolio,
    });
  } catch (error) {
    console.error("ERROR::", error);
    res.status(500).send("An error occurred during the deletion process");
  }
});

//Edits portfolio item with the specified ticker. You need to pass the new quantity and totalcost in the request body.
app.patch("/portfolio/:ticker", async (req, res) => {
  const { ticker } = req.params; // Extract the ticker from the URL
  const { quantity, totalcost } = req.body; // Extract the new values from the request body

  // Validate the incoming data
  if (quantity == null || totalcost == null) {
    return res.status(400).send("Quantity and total cost must be provided");
  }

  try {
    // Attempt to find and update the document with the specified ticker
    const updatedPortfolio = await portfolio.findOneAndUpdate(
      { ticker: ticker }, // Query criteria
      { $set: { quantity: quantity, totalcost: totalcost } }, // Update
      { new: true } // Options: return the modified document rather than the original
    );

    // If no document was found, return a 404 error
    if (!updatedPortfolio) {
      return res
        .status(404)
        .send("Portfolio with the specified ticker not found");
    }

    // If a document was found and updated, return the updated document
    res.json(updatedPortfolio);
  } catch (error) {
    console.error("ERROR::", error);
    res.status(500).send("An error occurred during the update process");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

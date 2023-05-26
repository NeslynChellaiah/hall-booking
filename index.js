const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { start } = require("repl");
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const rooms = {};
const customers = {};

app.post("/create", (req, res) => {
  let body = req.body;
  // { "data": {"seats":10,"amenities":["ac","tv"],"price":100}, "room": "A" }
  if (rooms[body.room]) {
    res.send(JSON.stringify({ message: "Room already exists" }));
    return;
  }
  rooms[body.room] = body.data;
  res.send(JSON.stringify({ message: "Room created successfully" }));
});

app.post("/book", (req, res) => {
  let body = req.body;
  //  { "customer": "Neslyn", "date": "11/2/2023", "start": 12, "end": 17, "room": "A"}
  let bookings = rooms?.[body.room]?.bookings?.[body.date];
  if (bookings) {
    for (let i = body.start; i <= body.end; i++) {
      if (bookings[i][0]) {
        res.send(JSON.stringify({ message: "Sorry slot already booked" }));
        return;
      }
    }
    for (let i = body.start; i <= body.end; i++) {
      bookings[i] = [true, body.customer];
    }
  } else {
    rooms[body.room].bookings = {};
    rooms[body.room].bookings[body.date] = new Array(25).fill([false]);

    for (let i = body.start; i <= body.end; i++) {
      rooms[body.room].bookings[body.date][i] = [true, body.customer];
    }
  }
  if (customers[body.customer]) {
    customers[body.customer].push(req.body);
  } else {
    customers[body.customer] = [req.body];
  }
  res.send(JSON.stringify({ message: "Room booked successfully" }));
});

app.get("/all-rooms", (req, res) => {
  res.send(JSON.stringify({ message: "Data sent", rooms }));
});

app.get("/customers", (req, res) => {
  res.send(JSON.stringify({ message: "Data sent", customers }));
});

app.get("/customers/:name", (req, res) => {
  let params = req.params;
  res.send(
    JSON.stringify({ message: "Data sent", data: customers[params.name] })
  );
});

app.listen(port, () => {
  console.log(`App started @ port: ${port}`);
});

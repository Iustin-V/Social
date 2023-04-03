const express = require("express");
const db = require("./db");
const cors = require("cors");

const app = express();
const PORT = 3002;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

// simple route
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error fetching data from database" });
      return;
    }
    res.json(result);
  });
});

app.get("/api/categories/:id/subcategories", (req, res) => {
  const categoryId = req.params.id;

  db.query(
    "SELECT * FROM subcategorie WHERE id_categorie = ?",
    categoryId,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching data from database" });
        return;
      }
      res.setHeader("Content-Type", "application/json");
      res.json(result);
    }
  );
});
app.get("/api/posts/all", (req, res) => {
  db.query("SELECT * FROM postari", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error fetching data from database" });
      return;
    }
    result.forEach((post) => {
        post.imagine = Buffer.from(post.imagine).toString("base64");
    });
    res.setHeader("Content-Type", "application/json");
    res.json(result);
  });
});

app.get("/api/search/:id", (req, res) => {
  const searchTerm = req.params.id;
  const query = `%${searchTerm}%`;
  db.query(
    "SELECT * FROM anunt WHERE titlu LIKE ? OR descriere LIKE ?",
    [query, query],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching data from database" });
        return;
      }
      result.forEach((listing) => {
        listing.imagine = Buffer.from(listing.imagine).toString("base64");
      });
      res.setHeader("Content-Type", "application/json");
      res.json(result);
    }
  );
});

app.post("/api/register", (req, res) => {
  const { email, parola } = req.body;
  const saltRounds = 10;
  bcrypt.hash(parola, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error hashing password" });
      return;
    }
    db.query(
      "INSERT INTO users (email,parola) VALUES (?, ?)",
      [email, hashedPassword],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Error inserting user into database" });
          return;
        }
        res.status(200).json({ message: "User registered successfully" });
      }
    );
  });
});

app.post("/api/login", (req, res) => {
  const { email, parola } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", email, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error fetching user data from database" });
      return;
    }
    if (result.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const user = result[0];
    bcrypt.compare(parola, user.parola, (err, isMatch) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error comparing passwords" });
        return;
      }
      if (!isMatch) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      const payload = { id: user.id };
      const options = { expiresIn: "1h" };
      const secretKey = "secretkey";
      jwt.sign(payload, secretKey, options, (err, token) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Error signing token" });
          return;
        }
        res.status(200).json({ token });
      });
    });
  });
});

app.post("/api/anunt", (req, res) => {
  const { titlu, descriere, data, id_subcategorie, id_user, imagine } =
    req.body;
  const base64Image = imagine.replace(/^data:image\/\w+;base64,/, "");
  const binaryImage = Buffer.from(base64Image, "base64");
  const query = `
    INSERT INTO anunt (titlu, descriere, data, id_subcategorie, id_user, imagine)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    titlu,
    descriere,
    data,
    id_subcategorie,
    id_user,
    binaryImage,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Error inserting anunt into the database" });
      return;
    }

    res
      .status(201)
      .json({ message: "Anunt created successfully", id: result.insertId });
  });
});

// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

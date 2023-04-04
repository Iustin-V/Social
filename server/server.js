const express = require("express");
const db = require("./db");
const cors = require("cors");

const app = express();
const PORT = 3002;
const bcrypt = require("bcrypt");

const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// simple route

app.get("/api/posts/all", (req, res) => {
  db.query(
    "SELECT postari.id,postari.user_id,continut,data_postarii,imagine,nume,prenume FROM postari,profil WHERE postari.user_id=profil.user_id ",
    (err, result) => {
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
    }
  );
});

app.get("/api/users/all", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const options = { expiresIn: "1h" };
  const secretKey = "secretkey";

  const decoded = await jwt.verify(token, secretKey, options);

  const user_id = decoded.id;
  db.query(
    "SELECT users.id, profil.nume, profil.prenume, profil.poza_profil FROM users JOIN profil ON users.id = profil.user_id WHERE users.id NOT IN ( SELECT CASE WHEN user_id1 = ? THEN user_id2 ELSE user_id1 END AS friend_id FROM prieteni WHERE acceptat='false' AND user_id1 = ? OR user_id2 = ? ) AND users.id <> ?",
    [user_id, user_id, user_id, user_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching data from database" });
        return;
      }
      result.forEach((post) => {
        post.poza_profil = Buffer.from(post.poza_profil).toString("base64");
      });
      res.setHeader("Content-Type", "application/json");
      res.json(result);
    }
  );
});

app.get("/api/your-posts", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const options = { expiresIn: "1h" };
  const secretKey = "secretkey";

  const decoded = await jwt.verify(token, secretKey, options);

  const user_id = decoded.id;
  console.log("user_id", user_id);
  db.query(
    "SELECT postari.id,postari.user_id,continut,data_postarii,imagine,nume,prenume FROM postari,profil WHERE postari.user_id= ? and postari.user_id=profil.user_id",
    user_id,
    (err, result) => {
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
    }
  );
});

app.get("/api/user-profile-picture", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const options = { expiresIn: "1h" };
  const secretKey = "secretkey";

  try {
    const decoded = await jwt.verify(token, secretKey, options);
    const userId = decoded.id;

    db.query(
      "SELECT poza_profil FROM profil WHERE user_id = ?",
      userId,
      (err, result) => {
        if (err) {
          console.log(err);
          res
            .status(500)
            .json({ error: "Error fetching user data from database" });
          return;
        }

        if (result.length === 0) {
          res.status(404).json({ error: "User not found" });
          return;
        }
        result.forEach((profile) => {
          profile.poza_profil = Buffer.from(profile.poza_profil).toString(
            "base64"
          );
        });

        res.status(200).json({ poza_profil: result[0].poza_profil });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error decoding token" });
  }
});

app.get("/api/profile", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const options = { expiresIn: "1h" };
    const secretKey = "secretkey";

    const decoded = await jwt.verify(token, secretKey, options);

    const user_id = decoded.id;
    db.query("SELECT * FROM profil WHERE user_id=?", user_id, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching data from database" });
        return;
      }
      result.forEach((profile) => {
        profile.poza_profil = Buffer.from(profile.poza_profil).toString(
          "base64"
        );
        profile.poza_cover = Buffer.from(profile.poza_cover).toString("base64");
      });

      res.json(result);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error signing token" });
  }
});

app.get("/api/user/profile/:id", (req, res) => {
  try {
    const id = req.params.id;
    console.log("id", id);

    db.query("SELECT * FROM profil WHERE user_id=?", id, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching data from database" });
        return;
      }
      result.forEach((profile) => {
        profile.poza_profil = Buffer.from(profile.poza_profil).toString(
          "base64"
        );
        profile.poza_cover = Buffer.from(profile.poza_cover).toString("base64");
      });

      res.json(result);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error signing token" });
  }
});

app.get("/api/user/posts/:id", (req, res) => {
  try {
    const id = req.params.id;
    console.log("id", id);

    db.query("SELECT * FROM postari WHERE user_id=?", id, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error fetching data from database" });
        return;
      }
      result.forEach((post) => {
        post.imagine = Buffer.from(post.imagine).toString("base64");
      });

      res.json(result);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error signing token" });
  }
});

app.get("/api/posts/:id", (req, res) => {
  try {
    const id = req.params.id;
    console.log("id", id);

    db.query(
      "SELECT postari.id,postari.user_id,continut,data_postarii,imagine,nume,prenume FROM postari,profil WHERE postari.id= ? and postari.user_id=profil.user_id",
      id,
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Error fetching data from database" });
          return;
        }
        result.forEach((post) => {
          post.imagine = Buffer.from(post.imagine).toString("base64");
        });

        res.json(result);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error signing token" });
  }
});

app.get("/api/comments/:id", (req, res) => {
  try {
    const id = req.params.id;
    console.log("id", id);

    db.query(
      "SELECT comentarii.id,comentarii.user_id,comentarii.continut,poza_profil,nume,prenume FROM comentarii,profil WHERE comentarii.post_id=? and comentarii.user_id=profil.user_id",
      id,
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Error fetching data from database" });
          return;
        }
        result?.forEach((post) => {
          post.poza_profil = Buffer.from(post.poza_profil).toString("base64");
        });

        res.json(result);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error signing token" });
  }
});

app.get("/api/chat/current-user", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const options = { expiresIn: "1h" };
    const secretKey = "secretkey";

    const decoded = await jwt.verify(token, secretKey, options);

    const user_id = decoded.id;
    db.query(
      "SELECT   nume,prenume,user_id,poza_profil,email  FROM profil,users WHERE profil.user_id=? and profil.user_id=users.id",
      user_id,
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Error fetching data from database" });
          return;
        }
        result.forEach((profile) => {
          profile.poza_profil = Buffer.from(profile.poza_profil).toString(
            "base64"
          );
        });

        res.json(result);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error signing token" });
  }
});

app.get("/api/chat/friend", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const options = { expiresIn: "1h" };
  const secretKey = "secretkey";

  const decoded = await jwt.verify(token, secretKey, options);

  const user_id = decoded.id;

  const promise1 = new Promise((resolve, reject) => {
    db.query(
      "SELECT DISTINCT p1.id ,p1.user_id1 AS user_id,p1.acceptat, p2.nume, p2.prenume, p2.poza_profil FROM prieteni p1 INNER JOIN profil p2 ON p1.user_id1 = p2.user_id WHERE p1.user_id2 = ?",
      user_id,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          result.forEach((user) => {
            user.poza_profil = Buffer.from(user.poza_profil).toString("base64");
          });
          resolve(result);
        }
      }
    );
  });

  const promise2 = new Promise((resolve, reject) => {
    db.query(
      "SELECT DISTINCT p1.id, p1.user_id2 AS user_id, p1.acceptat, p2.nume, p2.prenume, p2.poza_profil FROM prieteni p1 INNER JOIN profil p2 ON p1.user_id2 = p2.user_id WHERE p1.user_id1 = ?",
      user_id,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          result.forEach((user) => {
            user.poza_profil = Buffer.from(user.poza_profil).toString("base64");
          });
          resolve(result);
        }
      }
    );
  });
  Promise.all([promise1, promise2])
    .then((results) => {
      const mergedResults = results.flat();
      const result1 = results[0];
      const result2 = results[1];
      const result = {
        mergedResults: mergedResults,
        result1: result1,
        result2: result2,
      };
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error fetching data from database" });
    });
});

app.get("/api/posts/search", (req, res) => {
  const searchTerm = `%${req.headers.body}%`;

  db.query(
    "SELECT distinct postari.id,postari.user_id,continut,data_postarii,imagine,nume,prenume FROM postari,profil WHERE postari.user_id=profil.user_id and postari.continut LIKE ? OR profil.nume LIKE ? OR profil.prenume LIKE ? OR CONCAT(profil.nume, ' ', profil.prenume) LIKE ? OR CONCAT(profil.prenume, ' ', profil.nume) LIKE ?",
    [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm],
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

app.get("/api/comments/count/:id", (req, res) => {
  const postId = req.params.id;
  const query = "SELECT COUNT(*) as count FROM comentarii WHERE post_id = ?";

  db.query(query, postId, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error fetching data from database" });
      return;
    }

    const count = result[0].count;
    res.json({ count });
  });
});

app.get("/api/likes/count/:id", (req, res) => {
  const postId = req.params.id;
  const query = "SELECT COUNT(*) as count FROM aprecieri WHERE post_id = ?";

  db.query(query, postId, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error fetching data from database" });
      return;
    }

    const count = result[0].count;
    res.json({ count });
  });
});

app.get("/api/friends/check/:id", async (req, res) => {
  try {
    const friendId = req.params.id;
    const token = req.headers.authorization.split(" ")[1];
    const options = { expiresIn: "1h" };
    const secretKey = "secretkey";

    const decoded = await jwt.verify(token, secretKey, options);

    const userId = decoded.id;

    db.query(
      "SELECT * FROM prieteni WHERE (user_id1 = ? AND user_id2 = ?) OR (user_id1 = ? AND user_id2 = ?)",
      [userId, friendId, friendId, userId],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Error fetching data from database" });
          return;
        }
        if (result.length === 0) {
          res.json({ status: "Add friend" });
        } else if (result[0].acceptat === "false") {
          res.json({ status: "Sent" });
        } else {
          res.json({ status: "Friends" });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error signing token" });
  }
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

app.post("/api/create-profile", async (req, res) => {
  const {
    nume,
    prenume,
    data_nasterii,
    oras,
    tara,
    poza_profil,
    poza_cover,
    descriere,
  } = req.body;
  const base64PozaProfil = poza_profil.replace(/^data:image\/\w+;base64,/, "");
  const binaryPozaProfil = Buffer.from(base64PozaProfil, "base64");
  const base64PozaCover = poza_cover.replace(/^data:image\/\w+;base64,/, "");
  const binaryPozaCover = Buffer.from(base64PozaCover, "base64");

  const token = req.headers.authorization.split(" ")[1];
  const options = { expiresIn: "1h" };
  const secretKey = "secretkey";

  const decoded = await jwt.verify(token, secretKey, options);

  const user_id = decoded.id;

  const query = `
    INSERT INTO profil (   nume,
                          prenume,
                          data_nasterii,
                          oras,
                          tara,
                          user_id,
                          poza_profil,
                          poza_cover,
                          descriere)
    VALUES (?, ?, ?, ?, ?, ?,?,?,?)
  `;

  const values = [
    nume,
    prenume,
    data_nasterii,
    oras,
    tara,
    user_id,
    binaryPozaProfil,
    binaryPozaCover,
    descriere,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Error inserting profil into the database" });
      return;
    }

    res
      .status(201)
      .json({ message: "Profil created successfully", id: result.insertId });
  });
});

app.post("/api/create-post", async (req, res) => {
  const { continut, imagine } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const options = { expiresIn: "1h" };
  const secretKey = "secretkey";

  const decoded = await jwt.verify(token, secretKey, options);

  const user_id = decoded.id;

  const base64Imagine = imagine.replace(/^data:image\/\w+;base64,/, "");
  const binaryImagine = Buffer.from(base64Imagine, "base64");
  db.query(
    "INSERT INTO postari(user_id,continut,imagine) VALUES(?,?,?)",
    [user_id, continut, binaryImagine],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Error fetching user data from database" });
        return;
      }
      if (result.length === 0) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      res.status(200).json({ message: "Post created successfully" });
    }
  );
});
app.post("/api/create-friend", async (req, res) => {
  const id_prieten_nou = req.headers.body;
  const token = req.headers.authorization.split(" ")[1];
  const options = { expiresIn: "1h" };
  const secretKey = "secretkey";

  const decoded = await jwt.verify(token, secretKey, options);

  const user_id = decoded.id;

  db.query(
    "INSERT INTO prieteni(user_id1,user_id2,acceptat) VALUES(?,?,?)",
    [user_id, id_prieten_nou, "false"],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Error fetching user data from database" });
        return;
      }
      if (result.length === 0) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      res.status(200).json({ message: "Post created successfully" });
    }
  );
});
app.post("/api/post/create-comment", async (req, res) => {
  const { post_id, continut } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const options = { expiresIn: "1h" };
  const secretKey = "secretkey";

  const decoded = await jwt.verify(token, secretKey, options);

  const user_id = decoded.id;

  db.query(
    "INSERT INTO comentarii(user_id,post_id, continut) VALUES(?,?,?)",
    [user_id, post_id, continut],
    (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Error fetching user data from database" });
        return;
      }
      if (result.length === 0) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      res.status(200).json({ message: "Post created successfully" });
    }
  );
});

app.post("/api/like-post", async (req, res) => {
  const { post_id } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const options = { expiresIn: "1h" };
  const secretKey = "secretkey";

  try {
    const decoded = await jwt.verify(token, secretKey, options);

    const user_id = decoded.id;

    db.query(
      "INSERT INTO aprecieri (user_id, post_id) VALUES (?, ?)",
      [user_id, post_id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: "Error adding like to database" });
          return;
        }

        res.status(200).json({ message: "Like added successfully" });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error adding like to database" });
  }
});

app.put("/api/edit-profile", async (req, res) => {
  try {
    const {
      nume,
      prenume,
      data_nasterii,
      oras,
      tara,
      poza_profil,
      poza_cover,
      descriere,
    } = req.body;

    const base64PozaProfil = poza_profil.replace(
      /^data:image\/\w+;base64,/,
      ""
    );
    const binaryPozaProfil = Buffer.from(base64PozaProfil, "base64");
    const base64PozaCover = poza_cover.replace(/^data:image\/\w+;base64,/, "");
    const binaryPozaCover = Buffer.from(base64PozaCover, "base64");

    const token = req.headers.authorization.split(" ")[1];
    const options = { expiresIn: "1h" };
    const secretKey = "secretkey";

    const decoded = await jwt.verify(token, secretKey, options);

    const user_id = decoded.id;

    const updateQuery = `
      UPDATE profil
      SET nume = ?, prenume = ?, data_nasterii = ?, oras = ?, tara = ?, poza_profil = ?, poza_cover = ?, descriere = ?
      WHERE user_id = ?
    `;

    const values = [
      nume,
      prenume,
      data_nasterii,
      oras,
      tara,
      binaryPozaProfil,
      binaryPozaCover,
      descriere,
      user_id,
    ];

    db.query(updateQuery, values, (err, result) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: "Error updating profil into the database" });
        return;
      }

      res
        .status(200)
        .json({ message: "Profil updated successfully", id: user_id });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating profil into the database" });
  }
});

app.put("/api/edit-post", async (req, res) => {
  try {
    const { continut, imagine, id } = req.body;

    const base64Imagine = imagine.replace(/^data:image\/\w+;base64,/, "");
    const binaryImagine = Buffer.from(base64Imagine, "base64");

    const token = req.headers.authorization.split(" ")[1];
    const options = { expiresIn: "1h" };
    const secretKey = "secretkey";

    const decoded = await jwt.verify(token, secretKey, options);

    const user_id = decoded.id;

    const updateQuery = `
      UPDATE postari
      SET continut=?, imagine=?
      WHERE id=? and  user_id = ? 
    `;

    const values = [continut, binaryImagine, id, user_id];

    db.query(updateQuery, values, (err, result) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: "Error updating profil into the database" });
        return;
      }

      res
        .status(200)
        .json({ message: "Profil updated successfully", id: user_id });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating profil into the database" });
  }
});

app.put("/api/friend/update", async (req, res) => {
  const { prietenieId, stare } = req.body;

  const query = "UPDATE prieteni SET acceptat = ? WHERE id = ?";
  db.query(query, [stare, prietenieId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating data in database" });
      return;
    }
    res.status(200).json({ message: "Friendship updated successfully" });
  });
});

app.delete("/api/friend/delete-request", async (req, res) => {
  const prietenieId = req.headers.body;

  const query = "DELETE FROM prieteni WHERE id = ?";
  db.query(query, prietenieId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating data in database" });
      return;
    }
    res.status(200).json({ message: "Friendship updated successfully" });
  });
});

app.delete("/api/delete-account", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const options = { expiresIn: "1h" };
  const secretKey = "secretkey";

  jwt.verify(token, secretKey, options, (err, decoded) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error decoding token" });
      return;
    }

    const user_id = decoded.id;
    db.query("DELETE FROM postari WHERE user_id=?", user_id, (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Error deleting user posts from database" });
        return;
      }
    });
    db.query("DELETE FROM profil WHERE user_id=?", user_id, (err, result) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ error: "Error deleting user profile from database" });
        return;
      }
    });

    db.query("DELETE FROM users WHERE id=?", user_id, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Error deleting user from database" });
        return;
      }
    });
    res.status(200).json({ message: "User account deleted successfully" });
  });
});

app.delete("/api/delete-post", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const postId = req.headers.body;
  const options = { expiresIn: "1h" };
  const secretKey = "secretkey";

  jwt.verify(token, secretKey, options, (err, decoded) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error decoding token" });
      return;
    }

    const user_id = decoded.id;

    db.query(
      "DELETE FROM comentarii WHERE post_id=? ",
      postId,
      (err, result) => {
        if (err) {
          console.log(err);
          res
            .status(500)
            .json({ error: "Error deleting user posts from database" });
          return;
        }
      }
    );
    db.query(
      "DELETE FROM aprecieri WHERE post_id=? ",
      postId,
      (err, result) => {
        if (err) {
          console.log(err);
          res
            .status(500)
            .json({ error: "Error deleting user posts from database" });
          return;
        }
      }
    );
    db.query(
      "DELETE FROM postari WHERE id=? and user_id=?",
      [postId, user_id],
      (err, result) => {
        if (err) {
          console.log(err);
          res
            .status(500)
            .json({ error: "Error deleting user posts from database" });
          return;
        }
      }
    );

    res.status(200).json({ message: "User account deleted successfully" });
  });
});

app.delete("/api/remove-friend/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const options = { expiresIn: "1h" };
    const secretKey = "secretkey";

    const decoded = await jwt.verify(token, secretKey, options);

    const id = decoded.id;

    db.query(
        "DELETE FROM prieteni WHERE (user_id1=? AND user_id2=?) OR (user_id1=? AND user_id2=?)",
        [id, user_id, user_id, id],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ error: "Error removing friend" });
            return;
          }

          res.status(200).json({ message: "Friend removed successfully" });
        }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error removing friend" });
  }
});

// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

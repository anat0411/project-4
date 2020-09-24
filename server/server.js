const express = require("express");
const cors = require("cors");
const { pool } = require("./dbConnection");
const session = require("express-session");
const port = process.env.PORT || 3001;
const app = express();
const multer = require("multer");
const { v4: uuid4 } = require("uuid");
const path = require("path");
const http = require("http").createServer(app);
const bcrypt = require("bcrypt");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    if (![".svg", ".png", ".jpeg", ".jpg"].includes(ext)) {
      return cb(new Error("Ext disalowed"));
    }

    cb(null, uuid4() + ext);
  },
});
const upload = multer({ storage: storage });
app.use("/", express.static("../client/bulid"));
app.use("/uploads", express.static("uploads"));

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

app.use(function (req, res, next) {
  console.log("cors -----------");
  // Website you wish to allow to connect
  // res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(
  session({
    name: "sessionID",
    secret: process.env.SECRET || "asdf@#$%fdgsdfg234dfsG345__sdf!",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000 * 24 * 30,
      httpOnly: true,
    },
  })
);

app.use(express.json());

const isCustomerAuth = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.sendStatus(403);
};

const isAdminAuth = (req, res, next) => {
  if (req.session.admin) {
    return next();
  }
  res.sendStatus(403);
};

app.route("/auth/verify").get(isCustomerAuth, (req, res) => {
  res.sendStatus(200);
});

app.route("/auth/admin/verify").get(isAdminAuth, (req, res) => {
  res.sendStatus(200);
});

app.route("/api/login").post((req, res) => {
  const { email, password } = req.body;
  console.log("BODY LOGIN --------- ", req.body.email);

  // if (!email || !password || !email.includes("@")) {
  //   return res.json({ success: false, msg: "Missing data" });
  // }

  pool.query(
    `
        SELECT * FROM customers
        WHERE email = ?
        `,
    [email],
    (err, results) => {
      if (err) throw err;
      console.log("RES --------------------------------", results);

      if (results.length) {
        const {
          password: hash,
          email,
          customer_id_number,
          identification_number,
        } = results[0];
        console.log(identification_number);

        bcrypt.compare(password, hash, (err, result) => {
          if (err) throw err;
          console.log(result);

          if (result) {
            req.session.user = {
              email: email,
              customerIdNumber: customer_id_number,
              identification_number: identification_number,
            };
            console.log("SESSION LOGIN ====================", req.session);
            res.json({
              success: true,
              email: email,
              customerIdNumber: customer_id_number,
              identification_number: identification_number,
            });
          } else {
            console.log("Err");
            res.json({ success: false });
          }
        });
      } else {
        console.log(success);
        res.json({ success: false });
      }
    }
  );
});

app.get("/api/logout", isCustomerAuth, (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.route("/api/admin/login").post((req, res) => {
  const { email, password } = req.body;

  // if (!email || !password || !email.includes("@")) {
  //   return res.json({ success: false, msg: "Missing fields" });
  // }

  pool.query(
    `
          SELECT * FROM admin
          WHERE email = ?
          `,
    [email],
    (err, results) => {
      if (err) throw err;

      if (results.length) {
        const { password: hash, id } = results[0];

        bcrypt.compare(password, hash, (err, result) => {
          if (err) throw err;
          console.log(result);

          // success login
          if (result) {
            req.session.admin = {
              email: email,
              id: id,
            };
            res.json({
              success: true,
              email: email,
              id: id,
            });
          } else {
            console.log("Err");
            res.json({ success: false });
          }
        });
      } else {
        console.log(success);
        res.json({ success: false });
      }
    }
  );
});

app.get("/api/admin/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.route("/api/register").post((req, res) => {
  const {
    firstName,
    lastName,
    email,
    identification_number,
    password,
    city,
    street,
  } = req.body;
  // if (
  //   !firstname ||
  //   !lastname ||
  //   !email ||
  //   !identification_number ||
  //   !password ||
  //   !city ||
  //   !street ||
  //   typeof firstname !== String ||
  //   typeof lastname !== String ||
  //   typeof email !== String ||
  //   typeof identification_number !== Number ||
  //   typeof password !== String ||
  //   typeof city !== String ||
  //   typeof street !== String ||
  //   !email.includes("@")
  // ) {
  //   return res.json({ success: false, msg: "Missing data" });
  // }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    pool.query(
      `
      INSERT INTO customers (firstname, lastname, email, identification_number, password, city, street)
      VALUES (?,?,?,?,?,?,?);
              `,
      [firstName, lastName, email, identification_number, hash, city, street],
      (err, results) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.json({ success: false, msg: "username already exists" });
          }

          throw err;
        }

        res.json({ success: true, msg: results.insertId });
      }
    );
  });
});

app.route("/api/admin/register").post((req, res) => {
  const { firstName, lastName, email, adminIdNumber, password } = req.body;
  // if (
  //   !firstname ||
  //   !lastname ||
  //   !email ||
  //   !admin_id_number ||
  //   !password ||
  //   typeof firstname !== String ||
  //   typeof lastname !== String ||
  //   typeof email !== String ||
  //   typeof admin_id_number !== Number ||
  //   typeof password !== String ||
  //   !email.includes("@")
  // ) {
  //   return res.json({ success: false, msg: "Missing fields" });
  // }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    pool.query(
      `
      INSERT INTO admin (firstname, lastname, email, admin_id_number, password)
      VALUES (?,?,?,?,?)
                `,
      [firstName, lastName, email, adminIdNumber, hash],
      (err, results) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.json({ success: false, msg: "username already exists" });
          }

          throw err;
        }

        res.json({ success: true, msg: results.insertId });
      }
    );
  });
});

app.route("/api/products").get(isCustomerAuth, (req, res) => {
  pool.query(
    `
  SELECT  p.product_id, p.name, p.category_id, c.category_name, p.product_price, p.product_image
  FROM products AS p
  LEFT JOIN category as c ON
  p.category_id = c.category_id`,
    [],
    (err, results, fields) => {
      if (err) throw err;
      res.json(results);
      // console.log(results[0].name);
    }
  );
});

app.route("/api/:category").get(isCustomerAuth, (req, res) => {
  const category = req.params.category;
  console.log(category);
  pool.query(
    `
    SELECT c.category_id, c.category_name, p.product_id, p.name, p.product_price
    FROM category AS c
    LEFT JOIN products as p ON
    c.category_id = p.category_id
    WHERE c.category_name =?`,
    [category],
    (err, results, fields) => {
      if (err) throw err;
      res.json(results);
    }
  );
});

app.route("/api/cart/:customerid").get((req, res) => {
  const customerIdNumber = req.params.customerid;
  console.log("customer id number -----------------------", customerIdNumber);
  pool.query(
    `SELECT * from carts WHERE customer_id_number=? `,
    [customerIdNumber],
    (err, results, fields) => {
      if (err) throw err;
      if (results.length === 0) {
        return [];
      } else {
        const cart_id = results[0].cart_id;
        pool.query(
          `SELECT p.product_id, p.name, p.category_id, p.product_price, p.product_image,
        c_i.item_id, c_i.product_units, c_i.cart_id, c_i.item_price
           FROM supermarket.products AS p
           LEFT JOIN supermarket.cart_items AS c_i ON
           p.product_id = c_i.product_id
           WHERE c_i.cart_id=?`,
          [cart_id],
          (err_2, results_2, fields_2) => {
            if (err_2) throw err_2;
            const cart = {
              id: cart_id,
              items: results_2,
            };
            // console.log(cart);
            res.json(cart);
          }
        );
      }
    }
  );
});

app.route("/api/products/search/:input").get(isCustomerAuth, (req, res) => {
  const input = req.params.input;
  pool.query(
    `SELECT * from products WHERE name=? `,
    [input],
    (err, results, fields) => {
      if (err) throw err;
      res.json(results);
    }
  );
});

app.route("/api/admin/add/product").post(upload.single("image"), (req, res) => {
  const { name, category_id, product_price } = req.body;
  const product_image = req.file;
  if (
    !name ||
    !category_id ||
    !product_price ||
    !product_image ||
    typeof name !== String ||
    typeof category_id !== Number ||
    typeof product_price !== Number ||
    typeof product_image !== String
  ) {
    return res.json({ success: false, msg: "Missing fields ADD VACATION" });
  }

  pool.query(
    `
    INSERT INTO products (name, category_id, product_price, product_image)
    VALUES (?,?,?,?)
          `,
    [name, category_id, product_price, product_image.path],
    (err, results) => {
      if (err) throw err;
      if (results) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    }
  );
});

app.route("/api/admin/edit/product/:id").get(isAdminAuth, (req, res) => {
  const id = req.params.id;
  pool.query(`SELECT * FROM products`, [id], (err, results, fields) => {
    if (err) throw err;
    res.json(results);
  });
});

app.route("/api/admin/edit/product/:id").get(isAdminAuth, (req, res) => {
  const id = req.params.id;
  pool.query(`SELECT * FROM products`, [id], (err, results, fields) => {
    if (err) throw err;
    res.json(results);
  });
});

app
  .route("/api/admin/edit/product/:id")
  .put(upload.single("image"), isAdminAuth, (req, res) => {
    const { name, category_id, product_price } = req.body;
    const product_image = req.file;
    const id = req.params.id;

    if (
      !name ||
      !category_id ||
      !product_price ||
      !product_image ||
      typeof name !== String ||
      typeof category_id !== Number ||
      typeof product_price !== Number ||
      typeof product_image !== String
    ) {
      return res.json({ success: false, msg: "Missing fields EDIT product" });
    }
    if (product_image) {
      pool.query(
        `
      UPDATE products SET name=?,category_id=? ,product_price=? ,product_image=? WHERE id=?
      `,
        [name, category_id, product_price, product_image.path, id],
        (err, results) => {
          if (err) throw err;

          if (results) {
            res.json({ success: true });
          } else {
            res.json({ success: false });
          }
        }
      );
    } else {
      pool.query(
        `
      UPDATE products SET name=? category_id=? ,product_price=? WHERE id=?
      `,
        [name, category_id, product_price, id],
        (err, results) => {
          if (err) throw err;

          if (results) {
            res.json({ success: true });
          } else {
            res.json({ success: false });
          }
        }
      );
    }
  });

app.route("/api/add/item/cart").post((req, res) => {
  const { product_id, cart_id, units } = req.body;
  const customerIdNumber = req.session.user.customerIdNumber;
  console.log(
    "SESSION-----------------------------------------------------------------",
    req.session
  );
  console.log("REQ", req.body);
  // if (typeof product_id !== Number) {
  //   return res.json({ success: false, msg: "ID NOT A NUMBER" });
  // }
  pool.query(
    `SELECT * FROM products WHERE product_id=?`,
    [product_id],
    (err, results) => {
      if (err) throw err;
      const product = JSON.parse(JSON.stringify(results))[0];
      console.log("product ------- :", product);
      if (results) {
        pool.query(
          `SELECT * FROM cart_items WHERE cart_id=?`,
          [cart_id],
          (err_2, results_2) => {
            if (err_2) throw err_2;
            const cart = JSON.parse(JSON.stringify(results_2));
            console.log("Cart ---- ", cart);
            if (cart.length > 0) {
              let added = false;
              cart.forEach((item) => {
                if (item.product_id === product_id) {
                  added = true;
                  pool.query(
                    `
                UPDATE cart_items SET product_units = product_units+${units}, item_price=item_price+${
                      product.product_price * units
                    } WHERE product_id=?`,
                    [product_id]
                  );
                  return res.json({ success: true });
                }
              });
              console.log("  ADDED-----------------", added);
              if (!added) {
                console.log(
                  "query data : ",
                  product_id,
                  1,
                  product.product_price,
                  cart_id
                );
                pool.query(
                  `INSERT INTO cart_items (product_id, product_units, item_price, cart_id) VALUES (?,?,?,?)`,
                  [product_id, units, product.product_price * units, cart_id],
                  (err_3, results_3) => {
                    if (err_3) throw err_3;
                    return res.json({ success: true });
                  }
                );
              }
            } else {
              console.log(
                "customer id number -------------------",
                customerIdNumber
              );
              pool.query(
                `INSERT INTO carts (customer_id_number) VALUES (?)`,
                [customerIdNumber],
                (err_4, results_4) => {
                  if (err_4) throw err_4;
                  console.log("new cart: +++++++++++", results_4.insertId);
                  if (results_4) {
                    pool.query(
                      `INSERT INTO cart_items (product_id, product_units, item_price, cart_id) VALUES (?,?,?,?)`,
                      [
                        product_id,
                        units,
                        product.product_price * units,
                        results_4.insertId,
                      ],
                      (err_5, results_5) => {
                        if (err_5) throw err_5;
                        console.log(results_5);
                        return res.json({ success: true });
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.route("/api/delete/cart/:id").delete(isCustomerAuth, (req, res) => {
  const id = req.params.id;
  // if (typeof id !== Number) {
  //   return res.json({ success: false, msg: "ID NOT A NUMBER" });
  // }
  console.log(id);
  pool.query(`DELETE FROM cart_items WHERE cart_id=? `, id, (err, results) => {
    if (err) throw err;

    if (results) {
      pool.query(
        `  DELETE FROM carts WHERE cart_id=? `,
        [id],
        (err, results) => {
          if (err) throw err;
          console.log("SUCCESS TRUE ---------------------------");
          res.json({ success: true });
        }
      );
    } else {
      res.json({ success: false });
    }
  });
});

app.route("/api/delete/cart/item/:id").delete(isCustomerAuth, (req, res) => {
  const id = req.params.id;
  // if (typeof id !== Number) {
  //   return res.json({ success: false, msg: "ID NOT A NUMBER" });
  // }
  pool.query(
    `DELETE FROM cart_items WHERE item_id=? `,
    [id],
    (err, results) => {
      if (err) throw err;

      if (results) {
        const cart_id = req.query.cart_id;
        pool.query(
          `SELECT p.product_id, p.name, p.category_id, p.product_price, p.product_image,
          c_i.item_id, c_i.product_units, c_i.cart_id, c_i.item_price
             FROM supermarket.products AS p
             LEFT JOIN supermarket.cart_items AS c_i ON
             p.product_id = c_i.product_id
             WHERE c_i.cart_id=?`,
          [cart_id],
          (err2, results_2) => {
            res.json(results_2);
          }
        );
      } else {
        res.json({ success: false });
      }
    }
  );
});

app.route("/api/order/cart/:id").post((req, res) => {
  const id = req.params.id;
  if (typeof id !== Number) {
    return res.json({ success: false, msg: "ID NOT A NUMBER" });
  }
  pool.query(
    `select SUM(item_price) AS cart_total_price from cart_items WHERE cart_id=?
      `,
    [id],
    (err, results) => {
      if (err) throw err;

      if (results) {
        console.log("RESULTS ", results[0].cart_total_price);
        const total_price = results[0].cart_total_price;
        const {
          identification_number,
          cart_id,
          city,
          street,
          delivery_date,
        } = req.body;
        if (
          !customer_id_number ||
          !id ||
          !city ||
          !street ||
          !delivery_date ||
          !total_price
          // ||
          // typeof identification_number !== Number ||
          // typeof cart_id !== Number ||
          // typeof total_price !== Number ||
          // typeof city !== String ||
          // typeof street !== String ||
          // typeof delivery_date !== String
        ) {
          return res.json({ success: false, msg: "Missing fields ORDER" });
        }
        pool.query(
          `INSERT INTO orders (identification_number,  cart_id, total_price, city, street, delivery_date) 
            VALUES (?,?,?,?,?,?)`,
          [identification_number, id, total_price, city, street, delivery_date],
          (err_2, results_2) => {
            if (err_2) throw err_2;

            if (results_2) {
              res.json({ success: true });
            } else {
              res.json({ success: false });
            }
          }
        );
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    }
  );
});

http.listen(port, () => console.log(`Server running on port ${port}`));

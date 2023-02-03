/* indítás: "npm start" (package.json) / "node app.js" */
/* !FONTOS: adatbázis elindítása pl.: xampp-ról a .env-s konfigurációkkal */
// használt: express, mysql, dotenv, hbs, bcryptjs
const express = require('express'); // applikáció kezeléséhez
const mysql = require("mysql"); // kapcsolatfelvételre az adatbázissal
const dotenv = require('dotenv'); // .env-hez nem publikus konfigok elrejtésére
const bcrypt = require("bcryptjs"); // titkosítás jelszóhoz .hash / .compare => 0/1
const app = express();

// lekérés .env fájlból & kapcsolat az DB-vel
dotenv.config({ path: './.env' });
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// kapcsolodás
db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("Data-Base connected!")
    }
});

/* További beállítások */

app.set('view engine', 'hbs'); // hbs-t választottam igazából nem számít

const path = require("path");
const publicDir = path.join(__dirname, './public');
app.use(express.static(publicDir));

// index href lekérése
app.get("/", (req, res) => {
    res.render("index")
});

// indítás 5000-es porton
app.listen(5000, () => {
    console.log("server started on localhost:5000")
});

// register href lekérése
app.get("/register", (req, res) => {
    res.render("register")
});

// login href lekérése
app.get("/login", (req, res) => {
    res.render("login")
});

app.use(express.urlencoded({ extended: 'false' }));
app.use(express.json());

logV() // kiír minden adatot az adatbázisból

// register form action-je
app.post("/auth/register", async (req, res) => {

    const { name, email, password, password_confirm } = req.body;

    if (password != password_confirm) {
        return res.render('register', {
            messageR: 'Passwords do not match!' // üzenet register.hbs-nek
        })
    } 
    else {
        // helyes paraméterek esetén insert
        db.query('INSERT INTO users SET ?', { name: name, email: email, password: await bcrypt.hash(password, 8) }, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                return res.render('register', {
                    messageG: 'Passwords match!' // üzenet register.hbs-nek
                })
            }
        })
        }
});

function logV(){
    db.query("SELECT * FROM users", (err, result, fields) => {
        if (err) throw err;
        console.log(result);
    });
}
import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "ABCxyz786",
  port: 5432,
})

db.connect();
app.get("/", async (req, res) => {
  //Write your code here.
  const result = await db.query("Select country_code from visited_countries")
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log(result.rows);
  res.render("index.ejs", { countries: countries, total: countries.length });
  db.end();
});

app.post("/add", async (req, res) => {
  const formText = req.body["country"]
  const result = await db.query("Select country_code from countries where country_name = $1", [formText])

  if (result.rows.length!== 0) {
    const data = result.rows[0];
    const countryCode = data.country_code;

    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [
      countryCode,
    ]);
    res.redirect("/");
  }

})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
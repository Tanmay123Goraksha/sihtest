import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "SIH1", 
  password: "postgres", 
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // to parse JSON data


app.get("/museums/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query("SELECT * FROM museums WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      res.status(404).send("Museum not found");
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

app.get('/museums/city/:city_name', async (req, res) => {
    const cityName = req.params.city_name;
    
    try {
      const result = await db.query(`
        SELECT museums.*
        FROM museums
        JOIN cities ON museums.city_code = cities.city_code
        WHERE cities.city_name ILIKE $1`, [cityName]);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

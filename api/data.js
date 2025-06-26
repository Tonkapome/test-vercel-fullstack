import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const result = await pool.query(
          "SELECT * FROM movies ORDER BY original_title"
        );
        res.status(200).json(result.rows);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch items" });
      }
      break;

    case "POST":
      try {
        const { name, description } = req.body;
        const result = await pool.query(
          "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *",
          [name, description]
        );
        res.status(201).json(result.rows[0]);
      } catch (err) {
        res.status(500).json({ error: "Failed to create item" });
      }
      break;

    case "PUT":
      try {
        const { id, name, description } = req.body;
        const result = await pool.query(
          "UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *",
          [name, description, id]
        );
        if (result.rowCount === 0) {
          res.status(404).json({ error: "Item not found" });
        } else {
          res.status(200).json(result.rows[0]);
        }
      } catch (err) {
        res.status(500).json({ error: "Failed to update item" });
      }
      break;

    case "DELETE":
      try {
        const { id } = req.body;
        const result = await pool.query(
          "DELETE FROM items WHERE id = $1 RETURNING *",
          [id]
        );
        if (result.rowCount === 0) {
          res.status(404).json({ error: "Item not found" });
        } else {
          res
            .status(200)
            .json({ message: "Item deleted", item: result.rows[0] });
        }
      } catch (err) {
        res.status(500).json({ error: "Failed to delete item" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

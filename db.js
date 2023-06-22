import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWROD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
});

export class DB {
    static async createPerson(userID = null, name = "user") {
        const newPerson = await pool.query(
            "INSERT INTO person (id, name) VALUES ($1, $2) RETURNING *",
            [userID, name]
        );
    }

    static async getAllUsers() {
        const persons = await pool.query("SELECT * FROM person");

        console.log(persons.rows);
    }

    static async createTodo(title, content, userId) {
        const newTodo = await pool.query(
            "INSERT INTO todo (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, content, userId]
        );
    }

    static async getUserTodos(userId) {
        const todos = await pool.query("SELECT * FROM todo WHERE user_id = $1", [userId]);

        return todos.rows;
    }

    static async deleteTodo(id) {
        const deletedTodo = await pool.query("DELETE FROM todo WHERE id = $1", [id]);
    }
}

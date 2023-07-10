// eslint-disable-next-line max-classes-per-file
import pg from "pg";

import { ENV_VARS } from "../constants/index.js";

const { Pool } = pg;

const pool = new Pool({
    user: ENV_VARS.PGUSER,
    password: ENV_VARS.PGPASSWORD,
    host: ENV_VARS.PGHOST,
    port: ENV_VARS.PGPORT,
    database: ENV_VARS.PGDATABASE,
    ssl: { rejectUnauthorized: false },
});

// pool.on("connect", () => {
//     console.log("connected to the database");
// });

export const createDatabaseTables = () => {
    pool.query(
        "CREATE TABLE IF NOT EXISTS person (id INT NOT NULL UNIQUE,name VARCHAR(255))",
        () => {
            pool.query(
                "CREATE TABLE IF NOT EXISTS todo (id SERIAL PRIMARY KEY,title VARCHAR(255),content VARCHAR(255),user_id INTEGER,FOREIGN KEY (user_id) REFERENCES person (id))",
                () => {}
            );
        }
    );
};
export class User {
    static async createPerson(userID = null, name = "user") {
        await pool.query("INSERT INTO person (id, name) VALUES ($1, $2) RETURNING *", [
            userID,
            name,
        ]);
    }
}

export class Task {
    static async getAllTodos() {
        const todos = await pool.query("SELECT * FROM todo");

        return todos;
    }

    static async createTodo(title, content, userId) {
        await pool.query(
            "INSERT INTO todo (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
            [title, content, userId]
        );
    }

    static async getUserTodos(userId) {
        const todos = await pool.query("SELECT * FROM todo WHERE user_id = $1", [userId]);

        return todos?.rows ?? [];
    }

    static async deleteTodo(id) {
        await pool.query("DELETE FROM todo WHERE id = $1", [id]);
    }
}

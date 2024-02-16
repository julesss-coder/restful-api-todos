const sqlite = require('sqlite3').verbose();

let database = new sqlite.Database('todos.db', error => {
    if (error) {
        throw error;
    } 

    console.log("Connected to database todos.db.");

    database.run(
        `CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            created INTEGER,
            updated INTEGER
        )`,
        (error) => {
            console.log(error);
            if (error) return;
            
            let insert = "INSERT INTO todos (name, description, created, updated) VALUES (?,?,?,?)";

            database.run(insert, 
                ["Einkaufen gehen",
                "Mineralwasser, Bier",
                Date.now(),
                Date.now()
            ]);

            database.run(insert, 
                ["Sport",
                "Heute eine Stunde Workout",
                Date.now(),
                Date.now()
            ]);
        }
    )
});

module.exports = database;
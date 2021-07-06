use crate::model::Thing;
use crate::user_config;
use rusqlite::OptionalExtension;
use rusqlite::{params, Connection};
use serde_json;
use std::{ops::Deref, sync::Mutex};

pub struct Db(Mutex<Connection>);

impl Db {
    pub fn new() -> Self {
        let conn = Connection::open(user_config::CONFIG_DIR.join("db.sqlite3"))
            .expect("Open database file");
        create_tables(&conn);
        let db = Self(Mutex::new(conn));
        db
    }

    pub fn get_things(&self) -> Result<Vec<Thing>, &'static str> {
        let conn = self.lock().map_err(|_| "Lock connection")?;
        let mut stmt = conn
            .prepare("SELECT id, description FROM things")
            .map_err(|_| "Prepare statement")?;
        let mut rows = stmt.query([]).map_err(|_| "Execute query")?;
        let mut things = Vec::new();
        while let Some(row) = rows.next().map_err(|_| "Next row")? {
            let id: String = row.get(0).map_err(|_| "Get parameter")?;
            let description: String = row.get(1).map_err(|_| "Get parameter")?;
            let description =
                serde_json::from_str(&description).map_err(|_| "Parse JSON description")?;
            things.push(Thing::from_id_and_json(&id, description)?);
        }
        Ok(things)
    }

    pub fn get_thing(&self, id: &str) -> Result<Option<Thing>, &'static str> {
        let conn = self.lock().map_err(|_| "Lock connection")?;
        let mut stmt = conn
            .prepare("SELECT id, description FROM things WHERE id = ?")
            .map_err(|_| "Prepare statement")?;
        let row = stmt
            .query_row(params![id], |row| {
                let id: String = row.get(0)?;
                let description: String = row.get(1)?;
                Ok((id, description))
            })
            .optional()
            .map_err(|_| "Query database")?;

        match row {
            None => Ok(None),
            Some(entry) => {
                let id = entry.0;
                let description =
                    serde_json::from_str(&entry.1).map_err(|_| "Parse JSON description")?;
                Ok(Some(Thing::from_id_and_json(&id, description)?))
            }
        }
    }

    pub fn create_thing(
        &self,
        id: &str,
        description: serde_json::Value,
    ) -> Result<Thing, &'static str> {
        let thing = Thing::from_id_and_json(id, description)
            .map_err(|_| "Get thing from id and description")?;
        let description = serde_json::to_string(&thing).map_err(|_| "Stringify thing")?;
        let conn = self.lock().map_err(|_| "Lock connection")?;
        conn.execute(
            "INSERT INTO things (id, description) VALUES (?, ?)",
            params![id, description],
        )
        .map_err(|_| "Insert into database")?;
        Ok(thing)
    }
}

impl Deref for Db {
    type Target = Mutex<Connection>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

fn create_tables(conn: &Connection) {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS things(
                  id TEXT PRIMARY KEY,
                  description TEXT
                  )",
        [],
    )
    .expect("Create table things");
}

#[cfg(test)]
mod tests {
    extern crate rusty_fork;
    extern crate serial_test;
    use super::*;
    use rusty_fork::rusty_fork_test;
    use serial_test::serial;
    use std::{env, fs};

    fn setup() {
        let dir = env::temp_dir().join(".webthingsio");
        fs::remove_dir_all(&dir);
        env::set_var("WEBTHINGS_HOME", dir);
    }

    rusty_fork_test! {
        #[test]
        #[serial]
        fn test_create_things() {
            setup();
            let db = Db::new();
            db.create_thing("test1", serde_json::json!({})).unwrap();
            db.create_thing("test2", serde_json::json!({})).unwrap();
            let things = db.get_things().unwrap();
            assert_eq!(things.len(), 2);
            assert_eq!(
                things[0],
                Thing {
                    id: "test1".to_owned()
                }
            );
            assert_eq!(
                things[1],
                Thing {
                    id: "test2".to_owned()
                }
            );
        }

        #[test]
        #[serial]
        fn test_get_thing() {
            setup();
            let db = Db::new();
            db.create_thing("test", serde_json::json!({})).unwrap();
            let thing = db.get_thing("test").unwrap().unwrap();
            assert_eq!(
                thing,
                Thing {
                    id: "test".to_owned()
                }
            );
        }
    }
}

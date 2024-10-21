Database migrations will be stored here. 

# DO NOT MANUALLY CREATE ANY FILES HERE!
Migrations are a way to make sure that multiple databases have exactly the same structure.

## How to use migrations
### Creating migrations
To create a new migration file, run `pnpm run migration:create <migration-name>` where migration-name is a short, descriptive text about the contents of the migration.

A new file will be created in this folder. It will be named using the current timestamp and the name of the migration. The file will contain two functions: `up` and `down`. The `up` function contains code that will be executed when we are migrating the database, while the `down` function contains code that will be executed when we rollback (undo) that migration.

The two functions in migration files should contain statements that edit the database structure. For example, if the `up` function contains a piece of code that creates a table named "users", then the `down` function will contain code that drops that table. If the `up` function contains code that adds a column, then the `down` function will contain code that removes that column. You get the idea.

### Applying changes
When the migration file is ready, it has to applied to the database. To do that, you will have to run the command `pnpm run migrate`. It applies the changes to your local database.
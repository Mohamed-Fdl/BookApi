# API project with JWT Authentication(Books API)
In this repo I show you how I made a little and basic book API with authentication and authorization system using JWT .
This API provide you  books and allows you to make CRUD actions according to the REST structure. So you can create,display,update and delete if you are authenticated!
After creating account you receive token in the response header when you are logged which allow you to access your todo list 

## Database structure
I use a mongoDB database with the npm package named Mongoose
### Collections
I need to store users ,authors and courses

* usersCollection
    1. email 
    2. password
* booksCollection
    1. name
    2. author
    3. year
    4. description

 

## API End Points

| Verb  | Url              | Actions                                           |
|-------|------------------|---------------------------------------------------|
| GET   | /book       |Display all books   |
| POST   | /new    |Create new book   |
| GET   | /book/bookID       |Display a specific book   |
| PUT   | book/bookID       |Update a specific book  |
| DELETE   | book/bookID      |Delete a specific book   |
| POST   | /register|Create new user   |
| POST   | login      |Login route |


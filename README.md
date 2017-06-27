# OriginalMy-Challenge

This is a simple application of a login REST API with a chat made with Socket.IO

To run the application locally you will need to have NodeJs, NPM, Bower and MySQL installed on your computer

First of all it is necessary that you load the database.sql that is in the root of the project in your Database.

To install dependencies run:

```
npm install
bower install
```

To run the application in development mode just use the following commands in different terminals:

```
npm run dev
gulp dev
```

To run the unit tests:

```
npm test
```

To run in production:

```
gulp prod
npm run prod
```

To monitor your production application use:

```
pm2 monit
```
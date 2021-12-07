const express = require('express');
const cors = require('cors');

const dbRouter = require('./routes/db');
const imdbRouter = require('./routes/imdb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/db', dbRouter.router);
app.use('/imdb', imdbRouter.router);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})
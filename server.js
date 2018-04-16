const app = require('./app');
const PORT = process.env.PORT || 3500;

app.listen(PORT, err => {
    if (err) throw err;
    console.log("Ecoute sur le port : " + PORT);
});
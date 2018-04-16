module.exports = (app, modules) => {

    app.all('/', (req, res, next) => {
        return res.render('index', {
            title: 'Accueil',
            description: 'Discord Manager est une application facilitant la gestion de son serveur Discord.',
            username: req.session.username,
            page: "Accueil",
            pageElement: "Vos applications",
            isBlack: true
        });
    });
}
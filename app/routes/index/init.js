module.exports = (app, modules) => {

    let { connection, moment } = modules;

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

    app.post('/offers/search', (req, res) => {
        let origin = req.body.origin;
        let destination = req.body.destination;

        let idGareDepart;
        let idGareArrivee;

        let nomGareDepart;
        let nomGareArrivee;

        if (!origin || !destination || origin === '' || destination === '') return res.send({ success: false, error: 'Rien n\'est rempli.' });

        connection.query("SELECT g.* FROM gare g, ville v WHERE v.nom = ? AND v.id = g.id_ville", [origin], (err, resultGareArrivee) => {
            if (err) throw err;
            if (resultGareArrivee.length === 0) return res.send({ success: true, empty: true, offres: [] });
            idGareDepart = resultGareArrivee[0].id;
            nomGareDepart = resultGareArrivee[0].nom;
            connection.query("SELECT g.* FROM gare g, ville v WHERE v.nom = ? AND v.id = g.id_ville", [destination], (err, resultGareDepart) => {
                if (err) throw err;
                if (resultGareDepart.length === 0) return res.send({ success: true, empty: true, offres: [] });
                idGareArrivee = resultGareDepart[0].id;
                nomGareArrivee = resultGareDepart[0].nom;
                connection.query("SELECT * FROM offre WHERE id_gare_depart = ? AND id_gare_arrivee = ?", [idGareDepart, idGareArrivee], (err, resultsOffres) => {
                    if (err) throw err;
                    if (resultsOffres.length === 0) return res.send({ success: true, empty: true, offres: [] });
                    let date = "Le " + moment(resultsOffres[0].date).format('DD/MM/YYYY à HH:mm');
                    return res.send({
                        success: true,
                        empty: false,
                        offres: [{
                            origin: nomGareDepart,
                            destination: nomGareArrivee,
                            date: date,
                            numeroTrain: resultsOffres[0].numero,
                            prix: resultsOffres[0].prix
                        }]
                    });
                })
            })
        });
    });
}
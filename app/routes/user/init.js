module.exports = (app, modules, models) => {

    let { emailExist } = modules;
    let { User } = models;

    app.get('/signin', (req, res, next) => {

        if (req.session.authenticated) return res.redirect('/');

        res.render('signin', {
            title: 'Se connecter',
            description: 'Se connecter au dashboard de DManager afin de profiter pleinement des services proposés.',
            isBlack: true
        });
    });

    app.get('/signup', (req, res, next) => {

        if (req.session.authenticated) return res.redirect('/');

        return res.render('signup', {
            title: 'S\'inscrire',
            description: 'S\'inscrire sur DManager ne prend que quelques minutes.',
            isBlack: true
        });
    });

    app.post('/signin', (req, res, next) => {
        let email = req.body.email;
        let password = req.body.password;

        emailExist.check(email, (err, response) => {
            if (err) return res.send({
                success: false,
                error: "L'email entré est incorrect."
            });

            User.findOne({ email: email }).exec((err, user) => {
                if (err) throw err;

                if (!user) return res.send({
                    success: false,
                    error: "L'adresse mail et/ou le mot de passe entrés sont incorrects."
                });

                user.verifyPassword(password).then(valid => {
                    if (!valid) return res.send({
                        success: false,
                        error: "L'adresse mail et/ou le mot de passe entrés sont incorrects."
                    });

                    req.session.authenticated = true;
                    req.session.username = user.username;
                    req.session.email = email;

                    return res.send({
                        success: true,
                        user: email
                    })
                }).catch(err => console.error(err));
            });
        });
    });

    app.get('/logout', (req, res, next) => {
        delete req.session.authenticated;
        return res.redirect('/signin');
    });

    app.get('/forgot', (req, res, next) => {
        if (req.session.authenticated) return res.redirect('/');

        return res.render('forgot', {
            title: 'Récupération de mot de passe',
            description: 'Vous avez oublié votre mot de passe ? Récupérez le !',
            isBlack: true
        });
    });

    app.post('/signup', (req, res, next) => {
        let email = req.body.email;
        let password = req.body.password;
        let password_second = req.body.password_second;

        if (email && password && password_second && password === password_second) {

            emailExist.check(email, (err, response) => {
                if (err) return res.send({
                    success: false,
                    error: "L'email entré est incorrect."
                });

                let username = email.slice(0, email.indexOf("@"));

                let userData = {
                    email: email,
                    username: username,
                    password: password
                }

                User.find({ email: email }, function(err, docs) {
                    if (docs.length) return res.send({
                        success: false,
                        error: "Un utilisateur utilise déjà cette adresse mail."
                    });

                    User.create(userData, (err, user) => {
                        if (err) return res.send({
                            success: false,
                            error: err
                        });

                        return res.send({
                            success: true,
                            user: email
                        });
                    });
                });
            })

        } else {
            return res.send({
                success: false,
                error: "Utilisateur incorrect."
            });
        }
    });
}
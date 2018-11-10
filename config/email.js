module.exports = email => {
    email.server.connect({
        user: "yannlm2010@gmail.com",
        password: "",
        host: "smtp.gmail.com",
        ssl: true
    });
};

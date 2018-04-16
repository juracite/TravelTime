module.exports = email => {
    email.server.connect({
        user: "yannlm2010@gmail.com",
        password: "Xilor32b18",
        host: "smtp.gmail.com",
        ssl: true
    });
};
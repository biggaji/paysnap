exports.indexControl = async (req, res) => {
    let isLoggedIn = req.headers.authorization || req.cookies.isLoggedIn;

    if (isLoggedIn) {
        res.redirect('/dashboard');
    }
    res.render("index", { pageTitle: "Paytr - Transfer and recieve money using your @paytr-username", site_wide_message: req.flash('site_message') });
}
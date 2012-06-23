/*!
 * auth controller
 */

exports.register = function register(app) {

  app.get('/auth', function (req, res) {
      req.session.is_admin = true;
      res.redirect('/');
    });

};

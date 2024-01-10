module.exports = (passport) => {
    customPassportAuthenticate = (req, res, next)=> {
        console.log("Custom Passport Auth called")
        passport.authenticate('jwt', (err, user, info) => {
            if(err) res.send(err)
            if(!user) refreshTokenFunc(req, res)
            if(user){ 
                req.user = user
                next()
            }
        })(req, res, next)
    }
}
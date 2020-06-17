const express = require("express");
const router = express.Router();
const Bruger = require("../models/bruger");

router.post('/login', async (req, res) => {

    const { email, password } = req.body 
    // const email = req.body.email;
    // const password = req.body.email;

    const bruger = await Bruger.findOne({ email : email });

    if (!bruger) {
        return res.status(404).json({ message: "Email er ikke fundet" });
      };

   bruger.comparePassword(password, function (err, isMatch) {
       if (err) throw err;
    //    console.log('password: ', isMatch)

       if (isMatch) {
           // SESSION SAT!!
           console.log('logget ind')
           req.session.userId = bruger._id;
           res.json({brugernavn: bruger.brugernavn, brugerID: bruger._id});
       } else {
           // Der var ikke et match
           res.status(401).clearCookie(process.env.SESS_NAME).json({message: "Email og password matcher ikke"})
       }
   })

})

router.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        if(err) {
            // return res.redirect('/home')
            return res.status(500).json({message: err.message})
        }
        res.clearCookie(process.env.SESS_NAME)
        res.json({message : 'du er logget ud'})
    })
})

router.get('/loggedin', async (req, res) => {

    if (req.session.userId) {
        return res.status(200).json({message: 'Du er stadig lokket ind'})
    } else {
        return res.status(401).json({message: 'Du er ikke logget ind'})
    }
})

module.exports = router;
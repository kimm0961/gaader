const mongoose = require('mongoose')
let bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 5;

const brugerSchema = new mongoose.Schema({
    brugernavn: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true, // fjerner mellemrum før og efter email
        lowercase: true, // gemmer alt i små bogstaver
        index: {unique: true}
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [3, 'Password need to be longer!']
    },
},
{ timestamps: true})

// Krypter pw - når bruger-data gemmes hvis password er ændret/nyt 
brugerSchema.pre('save', function (next) {
    var bruger = this;
    // hvis bruger er rettet men password ikke ændret så spring dette over ... next() betyder forlad denne middleware
    if (!bruger.isModified('password')) return next();
    //Generate a salt - Når brugerdata rettes - generate a password hash when the password changes (or a new password)
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        // Combining Salt to Generate New Hash
        bcrypt.hash(bruger.password, salt, function (err, hash) {
            // hvis der er fejl så spring denne middleware over og tag fejlen med videre ...
            if (err) return next(err);
            // Overwriting plaintext passwords with hash
            bruger.password = hash;
            next();
        });
    });
});

// Verification - cb = callback
brugerSchema.methods.comparePassword = function (indtastetPassword, cb) {
bcrypt.compare(indtastetPassword, this.password, function (err, isMatch) {
 if (err) return cb(err);
 cb(null, isMatch);
 });
};

module.exports = mongoose.model('Bruger', brugerSchema)
const express = require("express");
const router = express.Router();
const Bruger = require("../models/bruger");

// Tester
router.get("/tester", (req, res) => {
  res.send("Tester");
});

// Getting all
router.get('/', async (req, res) => {
  try {
      const bruger = await Bruger.find()
      res.json(bruger)
  } catch (err) {
      res.status(500).json({ message: err.message })
      
  }
 
})

// Getting One
router.get('/:id', getBruger, (req, res) => {
  res.json(res.brug)
})

// Creating one
router.post('/', async (req, res) => {
  const brug = new Bruger({
      brugernavn: req.body.brugernavn,
      email: req.body.email,
      password: req.body.password
  })

  try {
      const newBruger = await brug.save()
      res.status(201).json(newBruger)
  } catch (err) {
      res.status(400).json({ message: err.message })
  }
})


// Updating one
router.patch('/:id', getBruger, async (req, res) => {
  if (req.body.brugernavn != null) {
      res.brug.brugernavn = req.body.brugernavn
  }

  if (req.body.email != null) {
      res.brug.email = req.body.email
  }

  if (req.body.password != null) {
    res.brug.password = req.body.password
}

  try {
      const updatedBruger = await res.brug.save()
      res.json(updatedBruger)
  } catch (err) {
      res.status(400).json({message: err.message})
  }
})

// Deleting one
router.delete('/:id', getBruger, async (req, res) => {
  try {
      await res.brug.remove()
      res.json({message: 'Deleted bruger'})
  } catch (err) {
      res.status(500).json({message: err.message})
      
  }
})

async function getBruger(req, res, next) {
  let brug
  try {
      brug = await Bruger.findById(req.params.id)
      if (brug == null) {
          return res.status(404).json({ message: 'Cannot find bruger'})
      }
  } catch (err) {
      return res.status(500).json({ message: err.message})
  }

  res.brug = brug
  next()
}

module.exports = router;

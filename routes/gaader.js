const express = require('express')
const router = express.Router()
const Gaade = require('../models/gaade')

// Tester
router.get('/tester', (req, res) => {
    res.send('Tester')
})

// Getting all
router.get('/', async (req, res) => {
    try {
        const gaader = await Gaade.find()
        res.json(gaader)
    } catch (err) {
        res.status(500).json({ message: err.message })
        
    }
   
})

// Getting One
router.get('/:id', getGaade, (req, res) => {
    res.json(res.gaade)
})

// Creating one
router.post('/admin/', async (req, res) => {
    const gaade = new Gaade({
        gaadeTekst: req.body.gaadeTekst,
        gaadeSvar: req.body.gaadeSvar
    })

    try {
        const newGaade = await gaade.save()
        res.status(201).json(newGaade)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Updating one
router.patch('/admin/:id', getGaade, async (req, res) => {
    if (req.body.gaadeTekst != null) {
        res.gaade.gaadeTekst = req.body.gaadeTekst
    }

    if (req.body.gaadeSvar != null) {
        res.gaade.gaadeSvar = req.body.gaadeSvar
    }

    try {
        const updatedGaade = await res.gaade.save()
        res.json(updatedGaade)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Deleting one
router.delete('/admin/:id', getGaade, async (req, res) => {
    try {
        await res.gaade.remove()
        res.json({message: 'Deleted Gaade'})
    } catch (err) {
        res.status(500).json({message: err.message})
        
    }
})

async function getGaade(req, res, next) {
    let gaade
    try {
        gaade = await Gaade.findById(req.params.id)
        if (gaade == null) {
            return res.status(404).json({ message: 'Cannot find gaade'})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    res.gaade = gaade
    next()
}

module.exports = router
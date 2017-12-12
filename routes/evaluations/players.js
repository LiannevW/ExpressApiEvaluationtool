// routes/evaluations.js
const router = require('express').Router()
const passport = require('../../config/auth')
const { Evaluation, User } = require('../../models')

const authenticate = passport.authorize('jwt', { session: false })

const loadEvaluation = (req, res, next) => {
  const id = req.params.id

  Evaluation.findById(id)
    .then((evaluation) => {
      req.evaluation = evaluation
      next()
    })
    .catch((error) => next(error))
}

const getPlayers = (req, res, next) => {
  Promise.all(req.evaluation.players.map(player => User.findById(player.userId)))
    .then((users) => {
      // Combine player data and user's name
      req.players = req.evaluation.players.map((player) => {
        const { name } = users
          .filter((u) => u._id.toString() === player.userId.toString())[0]

        return {
          userId: player.userId,
          pairs: player.pairs,
          name
        }
      })
      next()
    })
    .catch((error) => next(error))
}

module.exports = io => {
  router
    .get('/evaluations/:id/players', loadEvaluation, getPlayers, (req, res, next) => {
      if (!req.evaluation || !req.players) { return next() }
      res.json(req.players)
    })

    .post('/evaluations/:id/players', authenticate, loadEvaluation, (req, res, next) => {
      if (!req.evaluation) { return next() }

      const userId = req.account._id

      if (req.evaluation.players.filter((p) => p.userId.toString() === userId.toString()).length > 0) {
        const error = Error.new('You already joined this evaluation!')
        error.status = 401
        return next(error)
      }

      // Add the user to the players
      req.evaluation.players.push({ userId, pairs: [] })

      req.evaluation.save()
        .then((evaluation) => {
          req.evaluation = evaluation
          next()
        })
        .catch((error) => next(error))
    },
    // Fetch new player data
    getPlayers,
    // Respond with new player data in JSON and over socket
    (req, res, next) => {
      io.emit('action', {
        type: 'GAME_PLAYERS_UPDATED',
        payload: {
          evaluation: req.evaluation,
          players: req.players
        }
      })
      res.json(req.players)
    })

    .delete('/evaluations/:id/players', authenticate, (req, res, next) => {
      if (!req.evaluation) { return next() }

      const userId = req.account._id
      const currentPlayer = req.evaluation.players.filter((p) => p.userId.toString() === userId.toString())[0]

      if (!currentPlayer) {
        const error = Error.new('You are not a player of this evaluation!')
        error.status = 401
        return next(error)
      }

      req.evaluation.players = req.evaluation.players.filter((p) => p.userId.toString() !== userId.toString())
      req.evaluation.save()
        .then((evaluation) => {
          req.evaluation = evaluation
          next()
        })
        .catch((error) => next(error))

    },
    // Fetch new player data
    getPlayers,
    // Respond with new player data in JSON and over socket
    (req, res, next) => {
      io.emit('action', {
        type: 'GAME_PLAYERS_UPDATED',
        payload: {
          evaluation: req.evaluation,
          players: req.players
        }
      })
      res.json(req.players)
    })

  return router
}

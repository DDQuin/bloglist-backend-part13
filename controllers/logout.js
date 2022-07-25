
const router = require('express').Router()

const Session = require("../models/session")
const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (req, response) => {
  await Session.destroy({
    where: { token: req.tokenRaw },
  });

  response
    .status(204).send()
})



module.exports = router
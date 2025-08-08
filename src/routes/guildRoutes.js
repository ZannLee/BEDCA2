const express = require('express');
const router = express.Router();
const guildController = require('../controllers/guildController');
const jwtMiddleware = require('../middleware/jwtMiddleware')

router.get('/:id/members', guildController.getGuildMembers);
router.post('/:id/join', jwtMiddleware.verifyToken, guildController.joinGuild);
router.get("/", guildController.getAllGuilds);
router.delete("/members/:user_id", jwtMiddleware.verifyToken, guildController.quitGuild)
router.delete("/:id", jwtMiddleware.verifyToken, guildController.deleteGuild)

module.exports = router;

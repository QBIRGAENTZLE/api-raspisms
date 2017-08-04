const path = require('path');
const express = require('express');

const router = express.Router();
const MessageCtrl = require(path.join(__dirname, 'messageCtrl.js'));
const messageCtrl = new MessageCtrl();
// const logger = require(path.join(__dirname, '..', '..', 'core', 'Logger.js'))

router.route('/')
        .post((req, res) => {
          messageCtrl.createMessage(req, res);
        });


router.route('/:id')
        .put((req, res) => {
          messageCtrl.updateMessage(req, res);
        })

        .delete((req, res) => {
          messageCtrl.deleteMessage(req, res);
        });

/**
 * Export router
 * @type {Object}
 */
module.exports = router;

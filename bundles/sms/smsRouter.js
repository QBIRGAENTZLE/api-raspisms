const path = require('path');
const express = require('express');

const router = express.Router();
const SMSCtrl = require(path.join(__dirname, 'smsCtrl.js'));
const smsCtrl = new SMSCtrl();
// const logger = require(path.join(__dirname, '..', '..', 'core', 'Logger.js'))

router.route('/:id')
        .get((req, res) => {
          smsCtrl.getSMS(req, res);
        })

        .delete((req, res) => {
          smsCtrl.deleteSMS(req, res);
        });

router.route('/tag/:tag')
        .get((req, res) => {
          smsCtrl.getTag(req, res);
        });

/**
 * Export router
 * @type {Object}
 */
module.exports = router;

const path = require('path');
const express = require('express');

const router = express.Router();
const SMSCtrl = require(path.join(__dirname, 'smsCtrl.js'));
const smsCtrl = new SMSCtrl();
// const logger = require(path.join(__dirname, '..', '..', 'core', 'Logger.js'))


router.route('/:id')
        /**
         * @api {get} /sms/:id Get SMS information
         * @apiName getSMS
         * @apiGroup SMS
         * @apiDescription Récupère les informations d'un SMS donné
         *
         * @apiSuccess {Number} idsms ID du SMS
         * @apiSuccess {Date} sentdate Date d'envoi ou de planification du SMS
         * @apiSuccess {String} target Numéro de téléphone lié au SMS
         * @apiSuccess {String} content Contenu du SMS
         * @apiSuccess {Boolean} delivered Si le SMS a été reçu
         * @apiSuccess {Boolean} failed Si le SMS n'a pas été reçu
         * @apiSuccess {String} status Statut du SMS :<br>
         *    '0' => SMS envoyé et arrivé à destination.<br>
         *    '2' => SMS envoyé mais non réceptionné par le destinataire (mauvais numéro...).<br>
         *    '4' => SMS planifié.<br>
         *    '8' => SMS demandé non existant
         *
         * @apiExample Exemple d'URL
         *  http://192.168.254.68:2008/sms/6
         * @apiSuccessExample {json} Success-Response
         *  {
         *   "idsms": 6,
         *   "sentdate": "2017-08-04T09:10:35.000Z",
         *   "target": "+33682832083",
         *   "content": "test 11:10",
         *   "delivered": 1,
         *   "failed": 0,
         *   "status": "0"
         *  }
         */
        .get((req, res) => {
          smsCtrl.getSMS(req, res);
        })

        /**
         * @api {delete} /sms/:id Delete SMS
         * @apiName deleteSMS
         * @apiGroup SMS
         * @apiDescription Supprime un SMS donné. Si c'est le dernier SMS lié au message, supprime également le message.
         *
         * @apiSuccess {String} success Confirmation de suppression
         *
         * @apiExample Exemple d'URL
         *  http://192.168.254.68:2008/sms/6
         * @apiSuccessExample {string} Success-Response
         *  "SMS Supprimé"
         */
        .delete((req, res) => {
          smsCtrl.deleteSMS(req, res);
        });

router.route('/tag/:tag')
        /**
         * @api {get} /tag/:tag Get Tag SMS
         * @apiName getTag
         * @apiGroup SMS
         * @apiDescription Recupère les IDs de tous les SMS liés à un tag donné
         *
         * @apiSuccess {Array} arrayId Tableau d'ID des SMS correspondant au tag
         *
         * @apiExample Exemple d'URL
         *  http://192.168.254.68:2008/sms/tag/test
         * @apiSuccessExample {array} Success-Response
         *  [1,2,3,4,5,6]
         */
        .get((req, res) => {
          smsCtrl.getTag(req, res);
        });

/**
 * Export router
 * @type {Object}
 */
module.exports = router;

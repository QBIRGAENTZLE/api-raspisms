const path = require('path');
const express = require('express');

const router = express.Router();
const MessageCtrl = require(path.join(__dirname, 'messageCtrl.js'));
const messageCtrl = new MessageCtrl();
// const logger = require(path.join(__dirname, '..', '..', 'core', 'Logger.js'))

router.route('/')
        /**
         * @api {post} /message/ Create Message
         * @apiName createMessage
         * @apiGroup Message
         * @apiDescription Création d'un message : contenu, date d'envoi et numéros de téléphone sur lesquels envoyer
         * @apiParam {String} content Contenu du message
         * @apiParam {Date} date Date d'envoi du message
         * @apiParam {Array} receivers Tableau de numéro de téléphone auxquels envoyer le message
         *
         * @apiSuccess {Boolean} success Succès de la requête
         * @apiSuccess {String} idmessage ID du message créé
         * @apiSuccess {Array} smss Tableau des SMS créés
         * @apiSuccess {String} smss.idsms ID du SMS créé
         * @apiSuccess {String} smss.number Numéro lié au SMS
         * @apiSuccess {String} smss.status Statut du SMS créé
         *
         * @apiExample Exemple d'URL
         *  http://192.168.254.68:2008/message/
         * @apiParamExample {json} Param-Example
         *   {
         *     "content":"Test",
         *     "date": "2017-08-08 17:23:00",
         *     "receivers": ["+33647778365","+33682832083"]
         *   }
         * @apiSuccessExample {json} Success-Response
         *  {
         *    "success": true,
         *    "idmessage": "6",
         *    "messages": [
         *      {
         *        "idsms": "8",
         *        "number": "+33647778365",
         *        "status": "4"
         *      },
         *      {
         *        "idsms": "9",
         *        "number": "+33682832083",
         *        "status": "4"
         *      }
         *    ]
         *   }
         */
        .post((req, res) => {
          messageCtrl.createMessage(req, res);
        });

router.route('/:id')
        /**
         * @api {put} /message/:id Update Message
         * @apiName updateMessage
         * @apiGroup Message
         * @apiDescription Mise à jour d'un message (planifié) donné. Possibilité de changer le contenu et la date d'envoi
         *
         * @apiParam {String} content Nouveau message
         * @apiParam {Date} date Nouvelle date d'envoi
         * @apiSuccess {String} successmessage Confirmation de mise à jour
         *
         * @apiExample Exemple d'URL
         *  http://192.168.254.68:2008/message/6
         * @apiParamExample {json} Param-Example
         *   {
         *     "content":"Hello",
         *     "date": "2017-09-09 17:23:00"
         *   }
         * @apiSuccessExample {json} Success-Response
         *  "Message mis à jour"
         */
        .put((req, res) => {
          messageCtrl.updateMessage(req, res);
        })

        /**
         * @api {delete} /message/:id Delete Message
         * @apiName deleteMessage
         * @apiGroup Message
         * @apiDescription Suppression d'un message (planifié) donné.
         *
         * @apiSuccess {String} successmessage Confirmation de suppression
         *
         * @apiExample Exemple d'URL
         *  http://192.168.254.68:2008/message/6
         * @apiSuccessExample {string} Success-Response
         *  "Message Supprimé"
         */
        .delete((req, res) => {
          messageCtrl.deleteMessage(req, res);
        });

/**
 * Export router
 * @type {Object}
 */
module.exports = router;

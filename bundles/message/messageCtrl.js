/**
 * Message Controller
 * @author Quentin BIRGAENTZLE <qbi@outlook.fr>
 * @license MIT
 * @todo: Nothing
 */

const path = require('path');
const async = require('async');

const ClassCore = require(path.join(__dirname, '..', '..', 'core', 'ClassCore.js'));
const mysql = require(path.join(__dirname, '..', '..', 'config', 'db.js'));

/**
 * @class MessageCtrl
 */
module.exports = class MessageCtrl extends ClassCore {

  /* constructor() {
   // Call parent's constructor
   super();
   }*/

  /**
   * @function createMessage
   * @description Création d'un message. Insertion du message dans la table scheduleds et des numéros liés dans scheduleds_numbers<br>
   * Simple vérification du numéro (doit commencer par un "+")<br>
   * Status :<br>
   *    '' => non planifié, envoyé de suite, on ne connaît pas encore le statut.<br>
   *    '4' => planifié.<br>
   *    '9' => numéro non valide<br>
   * @param {http.ClientRequest} req
   * @param {http.ClientResponse} res
   * @returns {http.ClientResponse}
   */
  createMessage(req, res) {
    /**
     * Statut du message
     * @type {string}
     */
    let status = '';

    /**
     * Objet à retourner
     * @type {object}
     */
    const toReturn = { };

    /**
     * Query SQL pour créer un message
     * @type {string}
     */
    const sqlCreateSMS = 'INSERT INTO scheduleds SET ?';

    /**
     * Tableau des numéros de téléphones
     * @type {array}
     */
    const numbers = req.body.receivers;

    mysql.query(sqlCreateSMS, { at: req.body.date, content: req.body.content, tag: req.body.tag }, (err1, result1) => {
      if (err1) {
        return res.status(500).send(`Erreur C1 : ${err1}`);
      }
      toReturn.success = true;
      toReturn.idmessage = result1.insertId.toString();
      toReturn.messages = [];

      /**
       * Requête SQL liant un numéro de téléphone à un message
       * @type {string}
       */
      const sqlCreateSMSNum = 'INSERT INTO scheduleds_numbers SET ?';

      /**
       * Regex pour tester la validité du numéro de téléphone
       * @type {regexp}
       */
      const regex = /^\+/;

      async.each(numbers, (number, callback) => {
        if (regex.test(number)) {
          mysql.query(sqlCreateSMSNum, { id_scheduled: result1.insertId.toString(), number: number }, (err2, result2) => {
            if (err2) {
              return res.status(500).send(`Erreur C2 : ${err2}`);
            }
            if (new Date(req.body.date) > new Date()) {
              status = '4';
            }
            toReturn.messages.push({ idsms: result2.insertId.toString(), number: number, status: status });
            callback();
          });
        } else {
          toReturn.messages.push({ number: number, status: '9' });
          callback();
        }
      }, (err3) => {
        if (err3) {
          return res.status(500).send(`Erreur C3 : ${err3}`);
        }
        return res.status(200).json(toReturn);
      });
    });
  }

  /**
   * @function updateMessage
   * Mise à jour d'un message. Uniquement de la date et du contenu, pas de possibilité de mettre à jour la liste de numéros liée au message.
   * @param {http.ClientRequest} req
   * @param {http.ClientResponse} res
   * @returns {http.ClientResponse}
   */
  updateMessage(req, res) {
    /**
     * Id du message à mettre à jour
     * @type {number}
     */
    const idMessage = req.params.id;

    /**
     * Nouveau contenu du message
     * @type {string}
     */
    const newContent = req.body.content;

    /**
     * Nouvelle date d'envoi du message
     * @type {date}
     */
    const newDate = req.body.date;

    /**
     * Requête SQL pour mettre à jour un message
     * @type {string}
     */
    const sqlUpdateMessage = 'UPDATE scheduleds s SET ? WHERE ?';

    /**
     * Paramètres pour la requête SQL
     * @type {object}
     */
    const sqlSet = { };

    if (newContent && newContent !== '') {
      sqlSet.content = newContent;
    }

    if (newDate && newDate !== '') {
      sqlSet.at = newDate;
    }

    mysql.query(sqlUpdateMessage, [sqlSet, { id: idMessage }], (err1, result1) => {
      if (err1) {
        return res.status(500).send(`Erreur Update1 : ${err1}`);
      }
      return res.status(200).json(result1);
    });
  }

  /**
   * @function deleteMessage
   * Suppression d'un message planifié et de tous les SMS liés
   * @param {http.ClientRequest} req
   * @param {http.ClientResponse} res
   * @returns {http.ClientResponse}
   */
  deleteMessage(req, res) {
    /**
     * Id du message à supprimer
     * @type {number}
     */
    const idMessage = req.params.id;

    /**
     * Requête SQL pour supprimer le message
     * @type {string}
     */
    const sqlDeleteMessage = 'DELETE FROM scheduleds_numbers WHERE id = ?; DELETE FROM scheduleds WHERE id = ?';

    mysql.query(sqlDeleteMessage, [idMessage, idMessage], (err1 /* , result1 */) => {
      if (err1) {
        return res.status(500).send(`Erreur DeleteMessage1 : ${err1}`);
      }
      return res.status(200).send('Message Supprimé');
    });
  }
};

const path = require('path')
const async = require('async');

const ClassCore = require(path.join(__dirname, '..', '..', 'core', 'ClassCore.js'));
const mysql = require(path.join(__dirname, '..', '..', 'config', 'db.js'));

module.exports = class MessageCtrl extends ClassCore {
  /**
   * Class constructor
   */
  /* constructor() {
   // Call parent's constructor
   super();
   }*/

  /*
   * function createMessge
   * Création d'un message. Insertion du message dans la table scheduleds et des numéros liés dans scheduleds_numbers
   * Simple vérification du numéro (doit commencer par un "+")
   * Status :
   *    '' => non planifié, envoyé de suite, on ne connaît pas encore le statut.
   *    '4' => planifié.
   *    '9' => numéro non valide
   * @param {http.ClientRequest} req
   * @param {http.ClientResponse} res
   * @returns {http.ClientResponse}
   */
  createMessage(req, res) {
    let status;
    const toReturn = { };
    const sqlCreateSMS = 'INSERT INTO scheduleds SET ?';
    const numbers = req.body.receivers;
    mysql.query(sqlCreateSMS, { at: req.body.date, content: req.body.content, tag: req.body.tag }, (err1, result1) => {
      if (err1) {
        return res.status(500).send(`Erreur C1 : ${err1}`);
      }
      toReturn.success = true;
      toReturn.idmessage = result1.insertId.toString();
      toReturn.messages = [];
      const sqlCreateSMSNum = 'INSERT INTO scheduleds_numbers SET ?';
      const regex = /^\+/;
      async.each(numbers, (number, callback) => {
        if (regex.test(number)) {
          mysql.query(sqlCreateSMSNum, { id_scheduled: result1.insertId.toString(), number: number }, (err2, result2) => {
            if (err2) {
              return res.status(500).send(`Erreur C2 : ${err2}`);
            }
            if (new Date(req.body.date) > new Date()) {
              status = '4';
            } else {
              status = '';
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

  /*
   * function updateMessage
   * Mise à jour d'un message. Uniquement de la date et du contenu, pas de possibilité de mettre à jour la liste de numéros liée au message.
   * @param {http.ClientRequest} req
   * @param {http.ClientResponse} res
   * @returns {http.ClientResponse}
   */
  updateMessage(req, res) {
    const idMessage = req.params.id;
    const newContent = req.body.content;
    const newDate = req.body.date;
    const sqlSet = { };

    const sqlUpdateMessage = 'UPDATE scheduleds s SET ? WHERE ?';

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

  /*
   * function deleteMessage
   * Suppression d'un message planifié et de tous les SMS liés
   * @param {http.ClientRequest} req
   * @param {http.ClientResponse} res
   * @returns {http.ClientResponse}
   */
  deleteMessage(req, res) {
    const idMessage = req.params.id;
    const sqlDeleteMessage = 'DELETE FROM scheduleds_numbers WHERE id = ?; DELETE FROM scheduleds WHERE id = ?';

    mysql.query(sqlDeleteMessage, [idMessage, idMessage], (err1 /* , result1 */) => {
      if (err1) {
        return res.status(500).send(`Erreur DeleteMessage1 : ${err1}`);
      }
      return res.status(200).send('Message Supprimé');
    });
  }
};

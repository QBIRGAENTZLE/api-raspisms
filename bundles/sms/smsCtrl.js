/**
 * SMS Controller
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
module.exports = class SMSCtrl extends ClassCore {

  /* constructor() {
   // Call parent's constructor
   super();
   }*/

  /**
   * @function getSMS
   * @description Récupère un SMS donné<br>
   * Status :<br>
   *    '0' => SMS envoyé et arrivé à destination.<br>
   *    '2' => SMS envoyé mais non réceptionné par le destinataire (mauvais numéro...).<br>
   *    '4' => SMS planifié.<br>
   *    '8' => SMS demandé non existant<br>
   * @param {http.ClientRequest} req
   * @param {http.ClientResponse} res
   * @returns {http.ClientResponse}
   */
  getSMS(req, res) {
    /**
     * Id du sms à récupérer
     * @type {number}
     */
    const idsms = req.params.id;

    /**
     * Requête SQL pour récupérer le sms
     * @type {string}
     */
    const sqlGetScheduleSMS = 'SELECT sn.id as idsms, sn.number, s.at AS sentdate, s.content FROM scheduleds_numbers sn INNER JOIN scheduleds s ON s.id = sn.id_scheduled WHERE ?';

    /**
     * Objet à retourner
     * @type {object}
     */
    let toReturn = { };

    mysql.query(sqlGetScheduleSMS, { 'sn.id': idsms.toString() }, (err1, result1) => {
      if (err1) {
        return res.status(500).send(`Erreur Get1 : ${err1}`);
      }
      if (result1 && result1.length > 0) {
        toReturn = result1[0];
        toReturn.status = '4';
        return res.status(200).json(toReturn);
      }
      const sqlGetSendSMS = 'SELECT se.id_sms AS idsms, se.at AS sentdate, se.target, se.content, se.delivered, se.failed FROM sendeds se WHERE ?';
      mysql.query(sqlGetSendSMS, { 'se.id_sms': idsms.toString() }, (err2, result2) => {
        if (err2) {
          return res.status(500).send(`Erreur Get2 : ${err2}`);
        }
        if (result2 && result2.length > 0) {
          toReturn = result2[0];
          if (toReturn.delivered === 1) {
            toReturn.status = '0';
          } else if (toReturn.failed === 1) {
            toReturn.status = '2';
          } else {
            toReturn.status = '';
          }
          return res.status(200).json(toReturn);
        }

        toReturn.idsms = idsms.toString();
        toReturn.status = '8';
        return res.status(200).json(toReturn);
      });
    });
  }

  /**
   * @function deleteSMS
   * @description Suppression d'un sms donné. Si c'est le seul ou dernier sms lié au message, on supprime également le message
   * @param {http.ClientRequest} req
   * @param {http.ClientResponse} res
   * @returns {http.ClientResponse}
   */
  deleteSMS(req, res) {
    /**
     * Id du sms à supprimer
     * @type {number}
     */
    const idsms = req.params.id;

    /**
     * Requête SQL pour récupérer le message lié au sms
     * @type {string}
     */
    const sqlGetSMS = 'SELECT id_scheduled FROM scheduleds_numbers sn WHERE ?';

    mysql.query(sqlGetSMS, { 'sn.id': idsms }, (err1, result1) => {
      if (err1) {
        return res.status(500).send(`Erreur D1 : ${err1}`);
      }

      if (result1 && result1.length > 0) {
        /**
         * Id du message
         * @type {number}
         */
        const idScheduled = result1[0].id_scheduled;

        /**
         * Requête SQL comptant le nombre de sms lié au message
         * @type {string}
         */
        const sqlCountSMS = 'SELECT COUNT(*) as COUNT FROM scheduleds_numbers sn WHERE ?';
        mysql.query(sqlCountSMS, { 'sn.id_scheduled': idScheduled }, (err2, result2) => {
          if (err2) {
            return res.status(500).send(`Erreur D2 : ${err2}`);
          }

          /**
           * Requête SQL pour supprimer un sms
           * @type {string}
           */
          let sqlDeleteScheduleSMS;

          /**
           * Paramètres de la requête
           * @type {object|array}
           */
          let param;

          switch (result2[0].COUNT) {
            case 0:
            {
              return res.status(200).send('SMS Inexistant');
            }
            case 1:
            {
              sqlDeleteScheduleSMS = 'DELETE FROM scheduleds_numbers WHERE id = ?; DELETE FROM scheduleds WHERE id = ?';
              param = [idsms, idScheduled];
              break;
            }
            default:
            {
              sqlDeleteScheduleSMS = 'DELETE FROM scheduleds_numbers WHERE ?';
              param = { id: idsms };
              break;
            }
          }

          mysql.query(sqlDeleteScheduleSMS, param, (err3 /* , result3 */) => {
            if (err3) {
              return res.status(500).send(`Erreur D3 : ${err3}`);
            }
            return res.status(200).send('SMS Supprimé');
          });
        });
      } else {
        return res.status(500).send('No SMS');
      }
    });
  }

  /**
   * @function getTag
   * @description On récupère tous les sms liés à un tag donné
   * @param {http.ClientRequest} req
   * @param {http.ClientResponse} res
   * @returns {http.ClientResponse}
   */
  getTag(req, res) {
    /**
     * Tag à rechercher
     * @type {string}
     */
    const tag = req.params.tag;

    /**
     * Tableau des ids des messages liés au tag
     * @type {array}
     */
    const arrayId = [];

    /**
     * Requête SQL pour récupérer les sms liés au tag
     * @type {string}
     */
    const sqlGetSMSByTag = 'SELECT sn.id FROM scheduleds_numbers sn INNER JOIN scheduleds s ON s.id = sn.id_scheduled WHERE s.tag = ? UNION SELECT se.id_message FROM sendeds se WHERE se.tag = ?';

    mysql.query(sqlGetSMSByTag, [tag, tag], (err1, result) => {
      if (err1) {
        return res.status(500).send(`Erreur Tag1 : ${err1}`);
      }
      async.each(result, (id, callback) => {
        arrayId.push(id.id);
        callback();
      }, (err2) => {
        if (err2) {
          return res.status(500).send(`Erreur Tag1 : ${err2}`);
        }
        return res.status(200).send(arrayId);
      });
    });
  }
};


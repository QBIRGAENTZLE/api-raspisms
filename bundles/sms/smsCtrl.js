const path = require('path')
const async = require('async');

const ClassCore = require(path.join(__dirname, '..', '..', 'core', 'ClassCore.js'));
const mysql = require(path.join(__dirname, '..', '..', 'config', 'db.js'));

module.exports = class SMSCtrl extends ClassCore {
  /**
   * Class constructor
   */
  /* constructor() {
   // Call parent's constructor
   super();
   }*/

  /*
   * function getSMS
   * Récupère un SMS donné
   * Status :
   *    '0' => SMS envoyé et arrivé à destination.
   *    '2' => SMS envoyé mais non réceptionné par le destinataire (mauvais numéro...).
   *    '4' => SMS planifié.
   *    '8' => SMS demandé non existant
   * @param {http.ClientRequest} req
   * @param {http.ClientResponse} res
   * @returns {http.ClientResponse}
   */
  getSMS(req, res) {
    const idsms = req.params.id;

    const sqlGetScheduleSMS = 'SELECT sn.id as idsms, sn.number, s.at AS sentdate, s.content FROM scheduleds_numbers sn INNER JOIN scheduleds s ON s.id = sn.id_scheduled WHERE ?';
    mysql.query(sqlGetScheduleSMS, { 'sn.id': idsms.toString() }, (err1, result1) => {
      if (err1) {
        return res.status(500).send(`Erreur Get1 : ${err1}`);
      }
      if (result1 && result1.length > 0) {
        const toReturn1 = result1[0];
        toReturn1.status = '4';
        return res.status(200).json(toReturn1);
      }
      const sqlGetSendSMS = 'SELECT se.id_sms AS idsms, se.at AS sentdate, se.target, se.content, se.delivered, se.failed FROM sendeds se WHERE ?';
      mysql.query(sqlGetSendSMS, { 'se.id_sms': idsms.toString() }, (err2, result2) => {
        if (err2) {
          return res.status(500).send(`Erreur Get2 : ${err2}`);
        }
        if (result2 && result2.length > 0) {
          const toReturn2 = result2[0];
          if (toReturn2.delivered === 1) {
            toReturn2.status = '0';
          } else if (toReturn2.failed === 1) {
            toReturn2.status = '2';
          }
          return res.status(200).json(toReturn2);
        }

        const toReturn3 = { };
        toReturn3.idsms = idsms.toString();
        toReturn3.status = '8';
        res.status(200).json(toReturn3);
      });
    });
  }

  /*
   * function deleteSMS
   * Suppression d'un sms donné. Si c'est le seul ou dernier sms lié au message, on supprime également le message
   * @param {http.ClientRequest} req
   * @param {http.ClientResponse} res
   * @returns {http.ClientResponse}
   */
  deleteSMS(req, res) {
    const idsms = req.params.id;
    const sqlGetSMS = 'SELECT id_scheduled FROM scheduleds_numbers sn WHERE ?';
    mysql.query(sqlGetSMS, { 'sn.id': idsms }, (err1, result1) => {
      if (err1) {
        return res.status(500).send(`Erreur D1 : ${err1}`);
      }

      if (result1 && result1.length > 0) {
        const idScheduled = result1[0].id_scheduled;
        const sqlCountSMS = 'SELECT COUNT(*) as COUNT FROM scheduleds_numbers sn WHERE ?';
        mysql.query(sqlCountSMS, { 'sn.id_scheduled': idScheduled }, (err2, result2) => {
          if (err2) {
            return res.status(500).send(`Erreur D2 : ${err2}`);
          }

          let sqlDeleteScheduleSMS;
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

  /*
   * function getTag
   * On récupère tous les sms liés à un tag donné
   * @param {http.ClientRequest} req
   * @param {http.ClientResponse} res
   * @returns {http.ClientResponse}
   */
  getTag(req, res) {
    const tag = req.params.tag;
    const arrayId = [];
    const sqlGetSMSByTag = 'SELECT sn.id FROM scheduleds_numbers sn INNER JOIN scheduleds s ON s.id = sn.id_scheduled WHERE s.tag = ? UNION SELECT se.id_scheduled FROM sendeds se WHERE se.tag = ?';

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


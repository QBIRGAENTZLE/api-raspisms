define({ "api": [
  {
    "type": "post",
    "url": "/message/",
    "title": "Create Message",
    "name": "createMessage",
    "group": "Message",
    "description": "<p>Création d'un message : contenu, date d'envoi et numéros de téléphone sur lesquels envoyer</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>Contenu du message</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>Date d'envoi du message</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "receivers",
            "description": "<p>Tableau de numéro de téléphone auxquels envoyer le message</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Param-Example",
          "content": "{\n  \"content\":\"Test\",\n  \"date\": \"2017-08-08 17:23:00\",\n  \"receivers\": [\"+33647778365\",\"+33682832083\"]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Succès de la requête</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "idmessage",
            "description": "<p>ID du message créé</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "smss",
            "description": "<p>Tableau des SMS créés</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "smss.idsms",
            "description": "<p>ID du SMS créé</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "smss.number",
            "description": "<p>Numéro lié au SMS</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "smss.status",
            "description": "<p>Statut du SMS créé</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n  \"success\": true,\n  \"idmessage\": \"6\",\n  \"messages\": [\n    {\n      \"idsms\": \"8\",\n      \"number\": \"+33647778365\",\n      \"status\": \"4\"\n    },\n    {\n      \"idsms\": \"9\",\n      \"number\": \"+33682832083\",\n      \"status\": \"4\"\n    }\n  ]\n }",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Exemple d'URL",
        "content": "http://192.168.254.68:2008/message/",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "/www/bundles/message/messageRouter.js",
    "groupTitle": "Message"
  },
  {
    "type": "delete",
    "url": "/message/:id",
    "title": "Delete Message",
    "name": "deleteMessage",
    "group": "Message",
    "description": "<p>Suppression d'un message (planifié) donné.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "successmessage",
            "description": "<p>Confirmation de suppression</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "\"Message Supprimé\"",
          "type": "string"
        }
      ]
    },
    "examples": [
      {
        "title": "Exemple d'URL",
        "content": "http://192.168.254.68:2008/message/6",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "/www/bundles/message/messageRouter.js",
    "groupTitle": "Message"
  },
  {
    "type": "put",
    "url": "/message/:id",
    "title": "Update Message",
    "name": "updateMessage",
    "group": "Message",
    "description": "<p>Mise à jour d'un message (planifié) donné. Possibilité de changer le contenu et la date d'envoi</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>Nouveau message</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>Nouvelle date d'envoi</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Param-Example",
          "content": "{\n  \"message\":\"Hello\",\n  \"date\": \"2017-09-09 17:23:00\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "successmessage",
            "description": "<p>Confirmation de mise à jour</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "\"Message mis à jour\"",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Exemple d'URL",
        "content": "http://192.168.254.68:2008/message/6",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "/www/bundles/message/messageRouter.js",
    "groupTitle": "Message"
  },
  {
    "type": "delete",
    "url": "/sms/:id",
    "title": "Delete SMS",
    "name": "deleteSMS",
    "group": "SMS",
    "description": "<p>Supprime un SMS donné. Si c'est le dernier SMS lié au message, supprime également le message.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>Confirmation de suppression</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "\"SMS Supprimé\"",
          "type": "string"
        }
      ]
    },
    "examples": [
      {
        "title": "Exemple d'URL",
        "content": "http://192.168.254.68:2008/sms/6",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "/www/bundles/sms/smsRouter.js",
    "groupTitle": "SMS"
  },
  {
    "type": "get",
    "url": "/sms/:id",
    "title": "Get SMS information",
    "name": "getSMS",
    "group": "SMS",
    "description": "<p>Récupère les informations d'un SMS donné</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "idsms",
            "description": "<p>ID du SMS</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "sentdate",
            "description": "<p>Date d'envoi ou de planification du SMS</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "target",
            "description": "<p>Numéro de téléphone lié au SMS</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>Contenu du SMS</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "delivered",
            "description": "<p>Si le SMS a été reçu</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "failed",
            "description": "<p>Si le SMS n'a pas été reçu</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Statut du SMS :<br> '0' =&gt; SMS envoyé et arrivé à destination.<br> '2' =&gt; SMS envoyé mais non réceptionné par le destinataire (mauvais numéro...).<br> '4' =&gt; SMS planifié.<br> '8' =&gt; SMS demandé non existant</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "{\n \"idsms\": 6,\n \"sentdate\": \"2017-08-04T09:10:35.000Z\",\n \"target\": \"+33682832083\",\n \"content\": \"test 11:10\",\n \"delivered\": 1,\n \"failed\": 0,\n \"status\": \"0\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Exemple d'URL",
        "content": "http://192.168.254.68:2008/sms/6",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "/www/bundles/sms/smsRouter.js",
    "groupTitle": "SMS"
  },
  {
    "type": "get",
    "url": "/tag/:tag",
    "title": "Get Tag SMS",
    "name": "getTag",
    "group": "SMS",
    "description": "<p>Recupère les IDs de tous les SMS liés à un tag donné</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "arrayId",
            "description": "<p>Tableau d'ID des SMS correspondant au tag</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "[1,2,3,4,5,6]",
          "type": "array"
        }
      ]
    },
    "examples": [
      {
        "title": "Exemple d'URL",
        "content": "http://192.168.254.68:2008/sms/tag/test",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "/www/bundles/sms/smsRouter.js",
    "groupTitle": "SMS"
  }
] });

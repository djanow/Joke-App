var ObjectId = require('mongodb').ObjectID;

exports.users = [
  {
    _id: new ObjectId(),
    username: "test",
    password: 12374238719845134515,
  },
  {
    _id: new ObjectId(),
    username: "test2",
    password: 1237987381263189273123,
  }
];

exports.jokes = [
  {
    _id: new ObjectId(),
    category: "toto",
    category: `Toto fait des maths :

    – Toto si tu as 10 bonbons et que Mathieu t’en prends un combien il t’en reste ?
    
    – 10 bonbons et un cadavre`,
    creator: exports.users[0]._id,
  },
  {
    _id: new ObjectId(),
    category: "noir",
    category: `Une fillette est retrouvée égorgée dans la rue…
    L’enquêteur questionne le légiste :
    
    – Elle a été violée ?
    
    – Non pas encore, j’attendais votre autorisation.`,
    creator: exports.users[0]._id,
  },
  {
    _id: new ObjectId(),
    category: "toto",
    category: `– Toto si je te donne 50 gâteaux et tu en manges 48 tu as donc ?

    – Mal au ventre .`,
    creator: exports.users[0]._id,
  }
];

exports.reviews = [
  {
    _id: new ObjectId(),
    body: "This is a joke review!",
    length: 127
  }
];

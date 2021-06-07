const express = require('express')
const app = express()
const port = 3012
const bcrypt = require("bcrypt");
const crypto = require("crypto");

function passwordFlow() {
  const password = 'default';
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
  // Hash is not a simple hash, but a container with embedded salt.
  // Exp: $2b$12$Adiehg.O6D1R7Z968.oUBelUAwd10WHkPMU92M3dfqVKSq2ap4sNy
  console.log(hash)
  
  const compared = bcrypt.compareSync(password, hash);
  // true

  console.log(compared) 

  return compared;
}

function tokenFlow() {
  const adminSecretKey = 'asWDEerfOIdgsdqRTFabvmgh';
  const hash = bcrypt.hashSync(adminSecretKey, bcrypt.genSaltSync(12), null);
  
  // const compared = bcrypt.compareSync(adminSecretKey, hash);  
  const compared =  bcrypt.compareSync('asWDEerfOIdgsdqRTFabvmgh', '$2b$12$PKfGz7ktjJ/Q5JjE0WC6aeYTrXsDTLl9lbgoRE/qOrz0HcWccE1pW')
  console.log(compared) 
  return compared;
}

function tokenHash() {
  const adminSecretKey = 'asWDEerfOIdgsdqRTFabvmgh';
  const hash = bcrypt.hashSync(adminSecretKey, bcrypt.genSaltSync(12), null);
  // Exp: $2b$12$PKfGz7ktjJ/Q5JjE0WC6aeYTrXsDTLl9lbgoRE/qOrz0HcWccE1pW

  return hash;
}

function encrypt(text) {
  console.log("Text " + text)

  algo = "aes-128-cbc";
  keyBuffer = "!Qqs2SRXWER533FV";
  ivBuffer = "5TGBaYHOID5egIKA";

  var cipher = crypto.createCipheriv(algo, keyBuffer, ivBuffer);
  var enc = cipher.update(text, "utf8", "base64");
  enc += cipher.final("base64");

  console.log("Enc " + enc)
  return enc.toString("base64");
};

let decrypt = function (encryptedText) {
  algo = "aes-128-cbc";
  keyBuffer = "!Qqs2SRXWER533FV";
  ivBuffer = "5TGBaYHOID5egIKA";

  var decipher = crypto.createDecipheriv(algo, keyBuffer, ivBuffer);
  var dec = decipher.update(encryptedText, "base64", "utf8");

  dec += decipher.final("utf8");

  var buffer = Buffer.from(dec, "utf8");
  var formatBuffer = buffer;

  //Remove all leading zero
  while (formatBuffer.indexOf(0x00) > -1) {
    var i = formatBuffer.indexOf(0x00);
    var formatBuffer = splice(formatBuffer, i, 1);
  }

  return formatBuffer.toString("utf8");
};

function enc_decFlow() {
  const rawData = Buffer.from('admin-default', "utf8");
  const enc = encrypt(rawData);
  const dec = decrypt(enc)
  console.log(dec)

  return dec;
}

app.get('/', (req, res) => {
  const result = encrypt(Buffer.from('admin-default', "utf8"));  
  res.send(result)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
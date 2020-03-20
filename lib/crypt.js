var crypto = require("crypto");

// A function to perform encryption
function encrypt(data, password) {

	let pwd = password.toString();
	// Create cipher and encrypt value
	var enc = crypto.createCipher("aes192", pwd);
	enc.end(data);
	var encrypted = enc.read(); // Read the buffer
	// We will store the data in base64 format, because utf8 will
	// cause problems - the various characters in utf8 can break or be
	// lost in the storage/retrieval process
	return encrypted.toString("base64");
}

// A function to perform decryption
function decrypt(data, password) {

	let pwd = password.toString();
	// Create decipher
	var dec = crypto.createDecipher("aes192", pwd);
	// Create buffer from encrypted value and decrypt
	var encrypted = new Buffer.from(data, "base64");

	dec.end(encrypted);
	// Read data and convert back to utf8
	return dec.read().toString("utf8");
}

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;

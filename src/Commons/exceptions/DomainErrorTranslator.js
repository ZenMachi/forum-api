const InvariantError = require("./InvariantError");

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
  ),
  "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat user baru karena tipe data tidak sesuai"
  ),
  "REGISTER_USER.USERNAME_LIMIT_CHAR": new InvariantError(
    "tidak dapat membuat user baru karena karakter username melebihi batas limit"
  ),
  "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER": new InvariantError(
    "tidak dapat membuat user baru karena username mengandung karakter terlarang"
  ),
  "REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "user terdaftar tidak memiliki properti yang dibutuhkan"
  ),
  "REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "user terdaftar tidak memiliki tipe data yang sesuai"
  ),
  "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "harus mengirimkan username dan password"
  ),
  "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "username dan password harus string"
  ),
  "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
    new InvariantError("harus mengirimkan token refresh"),
  "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
    new InvariantError("refresh token harus string"),
  "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN":
    new InvariantError("harus mengirimkan token refresh"),
  "DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION":
    new InvariantError("refresh token harus string"),

  "ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "thread yang ditambahkan tidak memiliki properti yang dibutuhkan"
  ),
  "ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "thread yang ditambahkan tidak memiliki tipe data yang sesuai"
  ),
  "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
  ),
  "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat thread baru karena tipe data tidak sesuai"
  ),
  "ADD_THREAD.TITLE_EXCEED_CHAR_LIMIT": new InvariantError(
    "tidak dapat membuat thread baru karena judul melebihi batas karakter"
  ),
  "THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "thread detail tidak memiliki properti yang dibutuhkan"
  ),
  "THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "thread detail tidak memiliki tipe data yang sesuai"
  ),
  "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada"
  ),
  "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat comment baru karena tipe data tidak sesuai"
  ),
  "ADD_COMMENT.CANNOT_BE_EMPTY_STRING": new InvariantError(
    "tidak dapat membuat comment baru karena comment tidak boleh string kosong"
  ),
  "ADD_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat comment reply baru karena properti yang dibutuhkan tidak ada"
  ),
  "ADD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat comment reply baru karena tipe data tidak sesuai"
  ),
  "ADD_COMMENT_REPLY.CANNOT_BE_EMPTY_STRING": new InvariantError(
    "tidak dapat membuat comment reply baru karena content kosong"
  ),
  "ADDED_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "comment reply yang ditambahkan tidak memiliki properti yang dibutuhkan"
  ),
  "ADDED_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "comment reply yang ditambahkan tidak memiliki tipe data yang sesuai"
  ),
  "COMMENT_REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "comment reply detail tidak memiliki properti yang dibutuhkan"
  ),
  "COMMENT_REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "comment reply detail tidak memiliki tipe data yang sesuai"
  ),
};

module.exports = DomainErrorTranslator;

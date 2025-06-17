const OwnerValidator = require("../../Applications/security/OwnerValidator");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class OwnerValidatorManager extends OwnerValidator {
  async validateOwner(credentialId, ownerId, entityType) {
    if (credentialId !== ownerId) {
      throw new AuthorizationError(`Bukan pemilik dari ${entityType} ini`);
    }
  }
}

module.exports = OwnerValidatorManager;

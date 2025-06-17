const OwnerValidatorManager = require("../OwnerValidatorManager");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("OwnerValidatorManager", () => {
  it("should throw AuthorizationError when it not the owner", async () => {
    // Arrange
    const ownerValidatorManager = new OwnerValidatorManager();
    const credentialId = "user-123";
    const ownerId = "user-456";
    const entityType = "comment";

    // Action & Assert
    await expect(
      ownerValidatorManager.validateOwner(credentialId, ownerId, entityType)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should not throw AuthorizationError when it is the owner", async () => {
    // Arrange
    const ownerValidatorManager = new OwnerValidatorManager();
    const credentialId = "user-123";
    const ownerId = "user-123";
    const entityType = "comment";

    // Action & Assert
    await expect(
      ownerValidatorManager.validateOwner(credentialId, ownerId, entityType)
    ).resolves.not.toThrow(AuthorizationError);
  });
});

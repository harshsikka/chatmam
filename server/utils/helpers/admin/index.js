```JavaScript
// constants.js
const ROLES = {
  all: "<all>",
  admin: "admin",
  manager: "manager",
  default: "default",
};
module.exports = { ROLES };

// helpers.js
function validRoleSelection(currentUser = {}, newUserParams = {}) {
  // function body
}
// other helper functions
module.exports = { validRoleSelection, /* other exported functions */ };
```
}

// Check to make sure with this update that includes a role change to an existing admin to a non-admin
// that we still have at least one admin left or else they will lock themselves out.
async function canModifyAdmin(userToModify, updates) {
  // if updates don't include role property or the user being modified isn't an admin currently - skip.
  if (!updates.hasOwnProperty("role")) return { valid: true, error: null };
  if (userToModify.role !== ROLES.admin) return { valid: true, error: null };

  const adminCount = await User.count({ role: ROLES.admin });
  if (adminCount - 1 <= 0)
    return {
      valid: false,
      error: "No system admins will remain if you do this. Update failed.",
    };
  return { valid: true, error: null };
}

function validCanModify(currentUser, existingUser) {
  if (currentUser.role === ROLES.admin) return { valid: true, error: null };
  if (currentUser.role === ROLES.manager) {
    const validRoles = [ROLES.manager, ROLES.default];
    if (!validRoles.includes(existingUser.role))
      return { valid: false, error: "Cannot perform that action on user." };
    return { valid: true, error: null };
  }

  return { valid: false, error: "Invalid condition for caller." };
}

module.exports = {
  validCanModify,
  validRoleSelection,
  canModifyAdmin,
};

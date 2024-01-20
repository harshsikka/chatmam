const { Telemetry } = require("../../models/telemetry");
const {
  forwardExtensionRequest,
} = require("../../utils/files/documentProcessor");
const {
  flexUserRoleValid,
  ROLES,
} = require("../../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../../utils/middleware/validatedRequest");

function validateRole(roles) {
  return [validatedRequest, flexUserRoleValid(roles)];
}

function extensionEndpoints(app) {
  if (!app) return;

  app.post(
    "/ext/github/branches",
    validateRole([ROLES.admin, ROLES.manager]),
    async (request, response) => {
      // rest of the code...
    }
  );

  app.post(
    "/ext/github/repo",
    validateRole([ROLES.admin, ROLES.manager]),
    async (request, response) => {
      // rest of the code...
    }
  );

  app.post(
    "/ext/youtube/transcript",
    validateRole([ROLES.admin, ROLES.manager]),
    async (request, response) => {
      // rest of the code...
    }
  );
}
        await Telemetry.sendTelemetry("extension_invoked", {
          type: "github_repo",
        });
        response.status(200).json(responseFromProcessor);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/ext/youtube/transcript",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const responseFromProcessor = await forwardExtensionRequest({
          endpoint: "/ext/youtube-transcript",
          method: "POST",
          body: request.body,
        });
        await Telemetry.sendTelemetry("extension_invoked", {
          type: "youtube_transcript",
        });
        response.status(200).json(responseFromProcessor);
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { extensionEndpoints };

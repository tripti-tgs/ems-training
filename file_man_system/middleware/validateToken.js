const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const IdentityServerURL = "https://192.168.0.143:4440";
const ClientId = "Q2CAPI";

const validateTokenObj = {
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: `${IdentityServerURL}/.well-known/openid-configuration/jwks`, // Port number for IDS host.
  }),
  // Validate the audience and the issuer.
  audience: ClientId,
  issuer: `${IdentityServerURL}`,
  algorithms: ["RS256"],
};

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const validateToken = (req, res, next) => {
  jwt(validateTokenObj)(req, res, next);
};

module.exports = validateToken;

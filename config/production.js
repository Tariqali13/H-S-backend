'use strict';

/* default.js, node-config default configuration.

   All application configuration variables should be represented herein, even
   if only to have default or empty value.

   If you would like to change any of these values for your dev environment, create
   a local.js file in this directory (which will be gitignored), in which individual
   properties can be specified which overwrite any of the values below.

*/

module.exports = {
  dataSource: {
    databaseUrl: fromEnv('MONGODB_URL', ''),
  },
  serve: {
    port: process.env.PORT || 3300,
  },
  auth: {
    public: {
      token: fromEnv('PUBLIC_API_TOKEN', '95D64240-428B-459C-B018-472D353F3904'),
    },
  },
  aws: {
    awsAccessKey: fromEnv('AWS_ACCESS_KEY', ''),
    awsSecretKey: fromEnv('AWS_SECRET_KEY', ''),
    awsBucket: fromEnv('AWS_BUCKET', 'handselectric'),
    awsRegion: fromEnv('AWS_REGION', "us-east-2"),
  },
  expressSessionSecret: fromEnv('EXPRESS_SESSION_SECRET', 'AJSDFAS09DFUAS09DF8A0S9DF'),
  emailLinkExpireTime:  fromEnv('EMAIL_LINK_EXPIRE_TIME', '6'),
  uppyServer: {
    serverHost: fromEnv('UPPY_SERVER_HOST', 'hand-and-electric-backend.herokuapp.com'),
    serverProtocol: fromEnv('UPPY_SERVER_PROTOCOL', 'https'),
  },
  sendGrid: {
    apiKey: fromEnv('SEND_GRID_API_KEY', ''),
    liveMode: false
  },
};

// In production environments, read from the environment. Otherwise, use a
// default for development, allowing the value to be overridden.
function identity(x) {
  return x;
}

// Read from the environment, or use a default.
function fromEnv(varName, defValue, transform) {
  transform = transform || identity;
  const envValue = process.env[varName];
  if (envValue !== undefined) {
    return transform(envValue);
  }
  return defValue;
}

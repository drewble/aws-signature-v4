const core = require('@actions/core');
const github = require('@actions/github');
const aws4 = require('aws4');
const https = require('https');

const accessKeyId = core.getInput('aws-access-key-id');
const secretAccessKey = core.getInput('aws-secret-access-key');
const sessionToken = core.getInput('aws-session-token');
const { 
  host,
  method,
  path,
  body,
  service,
  region,
  signQuery,
  [`headers['Host']`]: headersHost,
  [`headers['Content-Type']`]:headersContentType,
  [`headers['Date']`]: headersDate 
} = JSON.parse(core.getInput('request-options'));

function filterObject(obj) {
  const filtered = {};
  for(const el in obj) {
    if (el !== undefined) {
      filtered[el] = el;
    }
  }
  return filtered;
}

const headers = filterObject({ 
  "Host": headersHost,
  "Content-Type": headersContentType,
  "Date": headersDate
});

const opts = filterObject({
  host,
  path,
  service,
  region,
  headers,
  method,
  body,
  signQuery
});

const auth = filterObject({
  accessKeyId,
  secretAccessKey,
  sessionToken
});

aws4.sign(opts, auth)
https.request(opts, function(res) { res.pipe(process.stdout) }).end(opts.body || '');
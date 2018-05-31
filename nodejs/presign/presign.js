'use strict';

const COS = require('ibm-cos-sdk');
const mime = require('mime-types');

function cos_client (params) {
  const creds = params.cos_hmac_keys
  if (!creds) throw new Error('Missing cos_hmac_keys parameter.')

  const endpoint = params.cos_endpoint
  if (!endpoint) throw new Error('Missing endpoint parameter.')

  const config = {
    endpoint: endpoint,
    accessKeyId: creds.access_key_id, 
    secretAccessKey: creds.secret_access_key
  }

  return new COS.S3(config);
}


function presign (params) {
  if (!params.bucket) throw new Error("Missing bucket parameter.")
  if (!params.name) throw new Error("Missing name parameter.")

  const client = cos_client(params)

  const options = {
    Bucket: params.bucket,
    Key: params.name,
    Expires: 300,
    ContentType: mime.contentType(params.name) || 'application/octet-stream'
  }

  return { url: client.getSignedUrl('putObject', options) }
}

exports.presign = presign;

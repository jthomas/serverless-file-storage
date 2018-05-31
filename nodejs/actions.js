'use strict';

const COS = require('ibm-cos-sdk')
const mime = require('mime-types');

function cos_client (params) {
  const bx_creds = params['__bx_creds']
  if (!bx_creds) throw new Error('Missing __bx_creds parameter.')

  const cos_creds = bx_creds['cloud-object-storage']
  if (!cos_creds) throw new Error('Missing cloud-object-storage parameter.')

  const endpoint = params['cos_endpoint']
  if (!endpoint) throw new Error('Missing cos_endpoint parameter.')

  const config = {
    endpoint: endpoint,
    apiKeyId: cos_creds.apikey,
    serviceInstanceId: cos_creds.resource_instance_id
  }

  return new COS.S3(config);
}

function list (params) {
  if (!params.bucket) throw new Error("Missing bucket parameter.")
  const client = cos_client(params)

  return client.listObjects({ Bucket: params.bucket }).promise()
    .then(results => ({ files: results.Contents }))
}

function retrieve (params) {
  if (!params.bucket) throw new Error("Missing bucket parameter.")
  if (!params.name) throw new Error("Missing name parameter.")
  const client = cos_client(params)

  return client.getObject({ Bucket: params.bucket, Key: params.name }).promise()
    .then(result => ({ body: result.Body.toString('base64') }))
}

function remove (params) {
  if (!params.bucket) throw new Error("Missing bucket parameter.")
  if (!params.name) throw new Error("Missing name parameter.")
  const client = cos_client(params)

  return client.deleteObject({ Bucket: params.bucket, Key: params.name }).promise()
}

function upload (params) {
  if (!params.bucket) throw new Error("Missing bucket parameter.")
  if (!params.name) throw new Error("Missing name parameter.")
  if (!params.body) throw new Error("Missing object parameter.")

  const client = cos_client(params)
  const body = Buffer.from(params.body, 'base64')

  const ContentType = mime.contentType(params.name) || 'application/octet-stream'
  const object = {
    Bucket: params.bucket,
    Key: params.name,
    Body: body,
    ContentType
  }

  return client.upload(object).promise()
}

function make_public (params) {
  return update_acl(params, 'public-read')
}

function make_private (params) {
  return update_acl(params, 'private')
}

function update_acl (params, acl) {
  if (!params.bucket) throw new Error("Missing bucket parameter.")
  if (!params.name) throw new Error("Missing name parameter.")
  const client = cos_client(params)

  const options = {
    Bucket: params.bucket,
    Key: params.name,
    ACL: acl
  }

  return client.putObjectAcl(options).promise()
}

exports.upload = upload;

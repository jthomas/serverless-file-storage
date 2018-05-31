# Node.js Examples

🚨**Please see the blog post associated with these examples for full instructions.** 🚨

This README assumes you have already provisioned IBM Cloud Object Storage.

### create package

```
$ bx wsk package create serverless-files
$ bx wsk package update serverless-files -p bucket <MY_BUCKET_NAME> -p cos_endpoint s3-api.us-geo.objectstorage.softlayer.net
```

### bind credentials to package

```
$ bx wsk service bind cloud-object-storage serverless-files
```

### list files action

```
$ bx wsk action create serverless-files/list-files actions.js --main list --kind nodejs:8
```

### retrieve file contents

```
$ bx wsk action create serverless-files/retrieve-file actions.js --main retrieve --kind nodejs:8
```

### remove files from bucket

```
$ bx wsk action create serverless-files/remove-file actions.js --main remove --kind nodejs:8
```

### create new files

```
$ npm install
$ zip -r upload.zip package.json actions.js node_modules
$ bx wsk action create serverless-files/upload-file upload.zip --main upload --kind nodejs:8
```

### modify object acls

```
$ bx wsk action create serverless-files/make-public actions.js --main make_public --kind nodejs:8
$ bx wsk action create serverless-files/make-private actions.js --main make_private --kind nodejs:8
```

### generate presigned URLs

- **Provision HMAC authentication keys and save credentials to `credentials.json`.**

```
$ cd presign
$ npm install
$ zip -r presign.zip package.json presign.js node_modules
$ bx wsk action create serverless-files/presign presign.zip --main presign --kind nodejs:8 -P credentials.json
```
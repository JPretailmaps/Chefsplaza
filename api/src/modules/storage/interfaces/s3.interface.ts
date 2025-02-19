import * as AWS from 'aws-sdk';
import { ObjectCannedACL, S3 } from '@aws-sdk/client-s3';

export interface S3ServiceConfigurationOptions
  extends AWS.S3.ClientConfiguration {
  endpoint?: string | AWS.Endpoint;
  params?: {
    Bucket?: string;
    [key: string]: any;
  };
}

export interface MulterS3Options {
  s3?: S3;
  acl: ObjectCannedACL;
  uploadDir?: string;
  fileName?: string;
}

export interface MultiUploadMulterS3Options {
  s3?: S3;
  acls: Record<string, ObjectCannedACL>
}

#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineCdkStack } from '../lib/pipeline_cdk-stack';

const app = new cdk.App();
new PipelineCdkStack(app, 'PipelineCdkStack', {
  env: {
    account: '935948034248',
    region: 'us-east-1'
  }
});

app.synth();
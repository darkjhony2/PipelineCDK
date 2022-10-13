import { MyPipeLineAppStage } from './my-pipeline-app-stage';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines'

export class PipelineCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'MyPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('darkjhony2/PipelineCDK', 'main'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    const testingStage = pipeline.addStage(new MyPipeLineAppStage(this, "test", {
      env: {account: "935948034248", region: 'us-east-1'}
    }));

    testingStage.addPost(new ManualApprovalStep('approval'));

    testingStage.addPost(new ShellStep("validate", {
      commands: ['curl -Ssf https://my.webservice.com/'],
    }));

    const wave = pipeline.addWave('wave');

    wave.addStage(new MyPipeLineAppStage(this, 'MyAppUS2', {
      env: {account: "935948034248", region: 'us-east-2'}
    }));

    wave.addStage(new MyPipeLineAppStage(this, 'MyAppEU1', {
      env: {account: "935948034248", region: "eu-west-1"}
    }));

    
  }
}

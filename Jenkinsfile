pipeline {
    agent any
    tools {
        nodejs 'Nodejs20'
    }
    parameters {
        string(name: 'GIT_REPO', defaultValue: 'https://github.com/mustaphaibnel/webloo-ui-ux-automation-test', description: 'Git repository URL')
        string(name: 'BRANCH_NAME', defaultValue: 'main', description: 'Branch to build')
        string(name: 'S3_BUCKET', defaultValue: 'cicd-site-dev-mustaphaibnel.com', description: 'AWS S3 Bucket name for storing artifacts')
        string(name: 'DOMAIN_NAME', defaultValue: 'cicd-site.dev.mustaphaibnel.com', description: 'AWS S3 Bucket name for storing artifacts')
        string(name: 'S3_FOLDER', defaultValue: 'playwright', description: 'Folder path in the S3 bucket')
        string(name: 'SLACK_CHANNEL', defaultValue: 'devsecops-playwright-cicd', description: 'Slack channel for notifications')
        
        //credentials
        credentials(name: 'AWS_CREDENTIALS_ID', defaultValue:'aws-dev-test',description: 'AWS Credentials for S3 Access')

    }
    environment {
        AWS_DEFAULT_REGION = 'us-west-2'
        TIMESTAMP = new java.text.SimpleDateFormat('yyyyMMdd_HHmmss').format(new Date())


    }
    stages {

        stage('Pre-Cleanup') {
            steps {
                script {
                    // Clean up the workspace before checking out the code
                    echo 'Cleaning workspace before SCM checkout...'
                    deleteDir() 
                }
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scm: [
                    $class: 'GitSCM',
                    branches: [[name: "*/${params.BRANCH_NAME}"]],
                    userRemoteConfigs: [[url: "${params.GIT_REPO}"]]
                ]
                script {
                    // Use shell commands to get the latest commit SHA and message
                    env.GIT_COMMIT_ID = sh(script: "git rev-parse HEAD", returnStdout: true).trim()
                    env.GIT_COMMIT_MESSAGE = sh(script: "git log -1 --pretty=%B", returnStdout: true).trim()

                    // Print them for verification
                    echo "Current GIT_COMMIT_ID: ${env.GIT_COMMIT_ID}"
                    echo "Current GIT_COMMIT_MESSAGE: ${env.GIT_COMMIT_MESSAGE}"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Install Browsers') {
            steps {
                sh 'npx playwright install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npx playwright test'
            }
        }

    stage('Archive Artifacts') {
        steps {
            script {
                // Define TIMESTAMP and S3_PATH variables
                def S3_PATH = "${params.S3_FOLDER}/${env.TIMESTAMP}"
                env.ZIP_FILE_NAME = "screenshots-${env.TIMESTAMP}.tar.gz"
                // Zip the screenshots directory
                sh "tar -czf ${env.ZIP_FILE_NAME} screenshots/"
                // Use AWS credentials to authenticate commands
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: params.AWS_CREDENTIALS_ID, accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    // Set environment variables for the AWS CLI
                    env.AWS_ACCESS_KEY_ID = AWS_ACCESS_KEY_ID
                    env.AWS_SECRET_ACCESS_KEY = AWS_SECRET_ACCESS_KEY
                    
                    // Execute AWS CLI commands to copy artifacts to S3
                    sh "aws s3 cp playwright-report/ s3://${params.S3_BUCKET}/${S3_PATH}/playwright-report/ --recursive"

                    sh "aws s3 cp ${env.ZIP_FILE_NAME} s3://${params.S3_BUCKET}/${S3_PATH}/${env.ZIP_FILE_NAME}"

                    sh "aws s3 cp test-results/ s3://${params.S3_BUCKET}/${S3_PATH}/test-results/ --recursive"
                }
            }
        }
    }

    }
post {
    success {
        script {
            def reportPath = "https://${params.DOMAIN_NAME}/${env.TIMESTAMP}/playwright-report/index.html"
            def screenShotsPath = "https://${params.DOMAIN_NAME}/${env.TIMESTAMP}/${env.ZIP_FILE_NAME}"
            def gitRepoUrl = "${params.GIT_REPO}".replaceAll('https://github.com/', '').trim()
            def commitLink = "https://github.com/${gitRepoUrl}/commit/${env.GIT_COMMIT_ID}"
            def message = """
                :white_check_mark: *Success!* 
                Job *'${env.JOB_NAME}'* (${env.BUILD_NUMBER}) completed in *${currentBuild.durationString}*.
                *Git Repo*: <https://github.com/${gitRepoUrl}|${gitRepoUrl}>
                *Commit*: <${commitLink}|Commit>
                *Message*: "${env.GIT_COMMIT_MESSAGE}"
                *Report*: <${reportPath}|View Report>
                *ScreenShots*:<${screenShotsPath}|View ScreenShots>
                """
            slackSend(channel: params.SLACK_CHANNEL, message: message, color: '#00FF00')
        }
    }
    failure {
        script {
            def reportPath = "https://${params.DOMAIN_NAME}/${env.TIMESTAMP}/playwright-report/index.html"
            def screenShotsPath = "https://${params.DOMAIN_NAME}/${env.TIMESTAMP}/${env.ZIP_FILE_NAME}"
            def gitRepoUrl = "${params.GIT_REPO}".replaceAll('https://github.com/', '').trim()
            def commitLink = "https://github.com/${gitRepoUrl}/commit/${env.GIT_COMMIT_ID}"
            def message = """
                :x: *Failure!* 
                Job *'${env.JOB_NAME}'* (${env.BUILD_NUMBER}) failed after *${currentBuild.durationString}*.
                *Git Repo*: <https://github.com/${gitRepoUrl}|${gitRepoUrl}>
                *Commit*: <${commitLink}|Commit>
                *Message*: "${env.GIT_COMMIT_MESSAGE}"
                *Report*: <${reportPath}|View Report>
                *ScreenShots*:<${screenShotsPath}|View ScreenShots>
                *Console Output*: <${env.BUILD_URL}console|View Console>
                """
            slackSend(channel: params.SLACK_CHANNEL, message: message, color: '#FF0000')
        }
    }
    always {
        script {
            // General cleanup step to run at the end of the pipeline regardless of the outcome
            echo 'Performing final cleanup...'
            deleteDir() // Cleanup the workspace at the end of the pipeline run
        }
    }
}

}

pipeline {
    agent any

    environment {
        DOCKER_USERNAME = credentials('docker_hub_credentials')
        DOCKER_PASSWORD = credentials('docker_hub_credentials')
        AZURE_SUBSCRIPTION_ID = credentials('azure-subscription-id')
    }

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        stage('Docker Operations') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker_hub_credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    bat 'docker login -u %DOCKER_USERNAME% -p %DOCKER_PASSWORD%'
                    bat 'docker-compose build ba-thathmuu'
                    bat 'docker-compose push ba-thathmuu'
                }
            }
        }
        stage('Terraform Operations') {
            steps {
                dir('ba-terraform-thathmuu') {
                    bat 'C:\\terraform\\terraform init'
                    bat 'C:\\terraform\\terraform plan'
                    bat 'C:\\terraform\\terraform apply'
                }
            }
        }
        stage('Kubernetes Operations') {
            steps {
                bat 'az aks get-credentials --resource-group "dvopsBrainAcademy" --name "dvopsAKSCluster" --overwrite-existing --subscription "%AZURE_SUBSCRIPTION_ID%"'
                bat 'kubectl apply -f ba-deployment-thathmuu.yaml'
                bat 'kubectl apply -f ba-service-thathmuu.yaml'
                bat 'kubectl rollout history deployment/ba-deployment'
                bat 'kubectl get pods'
                bat 'kubectl get services'
            }
        }
    }

    post {
        success {
            emailext (
                subject: "Jenkins Pipeline: ${currentBuild.fullDisplayName} Succeeded",
                body: "The Jenkins pipeline job ${env.JOB_NAME} build number ${env.BUILD_NUMBER} has succeeded. Check console output at ${env.BUILD_URL} to view the results.",
                to: '2202211e@student.tp.edu.sg',
                attachLog: true
            )
        }
        failure {
            emailext (
                subject: "Jenkins Pipeline: ${currentBuild.fullDisplayName} Failed",
                body: "The Jenkins pipeline job ${env.JOB_NAME} build number ${env.BUILD_NUMBER} has failed. Check console output at ${env.BUILD_URL} to view the results.",
                to: '2202211e@student.tp.edu.sg',
                attachLog: true
            )
        }
    }
}
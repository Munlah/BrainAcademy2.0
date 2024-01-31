pipeline {
    agent any

    environment {
        DOCKER_USERNAME = credentials('docker_hub_credentials')
        DOCKER_PASSWORD = credentials('docker_hub_credentials')
    }

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                bat 'npm test'
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
                bat 'az aks get-credentials --resource-group "dvopsBrainAcademy" --name "dvopsAKSCluster" --overwrite-existing --subscription "3b1a5a53-30bb-411c-9bbe-4e427558f4a0"'
                bat 'kubectl apply -f ba-deployment-thathmuu.yaml'
                bat 'kubectl apply -f ba-service-thathmuu.yaml'
                bat 'kubectl rollout history deployment/ba-deployment'
                bat 'kubectl get pods'
                bat 'kubectl get services'
            }
        }
    }
}

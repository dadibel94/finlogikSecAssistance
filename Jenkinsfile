pipeline {
    agent any 
    
    stages { 
        stage('SCM Checkout') {
            steps{
           git branch: 'main', url: 'https://github.com/dadibel94/finlogikSecAssistance.git'
            }
        }
        // run sonarqube test
        stage('Run Sonarqube') {
            environment {
                scannerHome = tool 'FinlogikSecure';
            }
            steps {
              withSonarQubeEnv(credentialsId: 'SonarToken', installationName: 'SonarToken') {
                sh "${scannerHome}/bin/sonar-scanner"
              }
            }
        }
    }
}

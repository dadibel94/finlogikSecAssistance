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
                scannerHome = tool 'Sonarscanner';
            }
            steps {
              withSonarQubeEnv(credentialsId: 'SonarJinkens-user', installationName: 'Sonarscanner') {
                sh "${scannerHome}/bin/sonar-scanner"
              }
            }
        }
    }
}

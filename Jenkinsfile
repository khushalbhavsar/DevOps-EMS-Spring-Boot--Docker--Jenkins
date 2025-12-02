pipeline {
  agent any
  environment {
    IMAGE_NAME = "your-registry/employee-management"
    IMAGE_TAG  = "${env.BUILD_NUMBER ?: 'local'}"
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build') {
      steps { sh './mvnw -B -DskipTests clean package' }
    }
    stage('Test') {
      steps { sh './mvnw -B test' }
    }
    stage('Docker Build') {
      steps {
        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
      }
    }
    stage('Push (optional)') {
      when { expression { return false } } // change to true & add credentials
      steps {
        echo 'Push to registry - configure credentials and enable this stage.'
      }
    }
  }
  post {
    always { archiveArtifacts artifacts: 'target/*.jar', fingerprint: true }
  }
}
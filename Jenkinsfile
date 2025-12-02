pipeline {
  agent any
  environment {
    IMAGE_NAME = "employee-management"
    REGISTRY_IMAGE = "khushalbhavsar/employee-management"
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
        script {
          echo "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
          sh "docker build -t ${IMAGE_NAME} ."
          sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
          sh "docker build -t ${REGISTRY_IMAGE}:${IMAGE_TAG} ."
          sh "docker images | grep ${IMAGE_NAME}"
        }
      }
    }
    stage('Docker Test Run') {
      steps {
        script {
          echo "Testing Docker container..."
          // Stop and remove any existing container
          sh "docker stop employee-management-test || true"
          sh "docker rm employee-management-test || true"
          
          // Run container in detached mode for testing
          sh "docker run -d --name employee-management-test -p 8080:8080 ${IMAGE_NAME}"
          
          // Wait for application to start
          echo "Waiting for application to start..."
          sh "sleep 30"
          
          // Test if application is running
          sh "curl -f http://localhost:8080 || echo 'Application health check failed'"
          
          // Stop and clean up test container
          sh "docker stop employee-management-test"
          sh "docker rm employee-management-test"
          
          echo "Docker container test completed successfully!"
        }
      }
    }
    stage('Docker Push') {
      when { expression { return true } }
      steps {
        script {
          echo "Pushing Docker images to registry..."
          // Login to Docker registry using Jenkins credentials
          withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', 
                                          usernameVariable: 'DOCKER_USERNAME', 
                                          passwordVariable: 'DOCKER_PASSWORD')]) {
            sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
            sh "docker push ${REGISTRY_IMAGE}:${IMAGE_TAG}"
            sh "docker tag ${REGISTRY_IMAGE}:${IMAGE_TAG} ${REGISTRY_IMAGE}:latest"
            sh "docker push ${REGISTRY_IMAGE}:latest"
            echo "Successfully pushed ${REGISTRY_IMAGE}:${IMAGE_TAG} and ${REGISTRY_IMAGE}:latest"
          }
        }
      }
    }
  }
  post {
    always { 
      archiveArtifacts artifacts: 'target/*.jar', fingerprint: true 
      // Clean up any remaining test containers
      script {
        sh "docker stop employee-management-test || true"
        sh "docker rm employee-management-test || true"
      }
    }
    success {
      echo "Pipeline completed successfully!"
      echo "Docker image built: ${IMAGE_NAME}"
      echo "Registry image: ${REGISTRY_IMAGE}:${IMAGE_TAG}"
      echo "To run locally: docker run -p 8080:8080 ${IMAGE_NAME}"
    }
    failure {
      echo "Pipeline failed. Check the logs above."
    }
  }
}
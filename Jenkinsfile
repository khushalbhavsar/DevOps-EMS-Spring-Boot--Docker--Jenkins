pipeline {
  agent any

  environment {
    IMAGE_NAME = "employee-management"
    REGISTRY_IMAGE = "khushalbhavsar/employee-management"
    IMAGE_TAG = "${env.BUILD_NUMBER ?: 'local'}"
  }

  stages {

    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build') {
      steps {
        sh './mvnw -B -DskipTests clean package'
      }
    }

    stage('Test') {
      steps {
        sh './mvnw -B test'
      }
    }

    stage('Docker Build') {
      steps {
        script {
          echo "Building Docker image..."
          sh "docker build -t ${REGISTRY_IMAGE}:${IMAGE_TAG} ."
          sh "docker tag ${REGISTRY_IMAGE}:${IMAGE_TAG} ${REGISTRY_IMAGE}:latest"
          sh "docker images | grep ${IMAGE_NAME}"
        }
      }
    }

    stage('Docker Test Run') {
      steps {
        script {
          echo "Running container for test..."

          sh "docker stop employee-management-test || true"
          sh "docker rm employee-management-test || true"

          sh "docker run -d --name employee-management-test -p 8080:8080 ${REGISTRY_IMAGE}:${IMAGE_TAG}"

          echo "Waiting for application to start..."
          sleep 45

          // Print logs to debug issues if container exits
          sh "docker logs employee-management-test || true"

          // Health check (make sure Actuator is enabled)
          sh "curl -f http://localhost:8080/actuator/health || (echo 'Health Check Failed!' && exit 1)"

          echo "Container test passed!"
        }
      }
    }

    stage('Docker Push') {
      when { expression { return true } }
      steps {
        script {
          echo "Pushing images to Docker Hub..."
          withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials',
                                           usernameVariable: 'DOCKER_USERNAME',
                                           passwordVariable: 'DOCKER_PASSWORD')]) {
            sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
            sh "docker push ${REGISTRY_IMAGE}:${IMAGE_TAG}"
            sh "docker push ${REGISTRY_IMAGE}:latest"
          }
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'target/*.jar', fingerprint: true

      script {
        sh "docker stop employee-management-test || true"
        sh "docker rm employee-management-test || true"
      }
    }

    success {
      echo "🎉 Pipeline completed successfully!"
      echo "Run locally: docker run -p 8080:8080 ${REGISTRY_IMAGE}:latest"
    }
    failure {
      echo "❌ Build failed! Check above logs."
    }
  }
}

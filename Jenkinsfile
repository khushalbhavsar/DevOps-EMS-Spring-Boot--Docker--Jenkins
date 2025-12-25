pipeline {
    agent { label 'dev-server' }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 1, unit: 'HOURS')
        timestamps()
    }

    tools {
        maven 'myMaven'
    }

    environment {
        SONAR_TOKEN = credentials('sonar-token')
        SONAR_HOST_URL = "${SONAR_HOST_URL ?: 'http://localhost:9000'}"
        IMAGE_NAME = "employee-management"
        DOCKER_TAG = "${BUILD_NUMBER}"
        REGISTRY = "${REGISTRY ?: 'docker.io'}"
        BUILD_ARTIFACTS = "target/employee-management-*.jar"
    }

    stages {

        stage('Checkout Source') {
            timeout(time: 10, unit: 'MINUTES')
            steps {
                echo "📥 Checking out source code from Jenkins SCM"
                checkout scm
            }
        }

        stage('Maven Build') {
            timeout(time: 20, unit: 'MINUTES')
            steps {
                echo "🔨 Building Java Application"
                script {
                    try {
                        sh 'mvn clean package -DskipTests'
                    } catch (Exception e) {
                        echo "❌ Maven build failed: ${e.message}"
                        throw e
                    }
                }
            }
        }

        stage('Unit Tests') {
            timeout(time: 15, unit: 'MINUTES')
            steps {
                echo "🧪 Running Unit Tests"
                script {
                    try {
                        sh 'mvn test'
                    } catch (Exception e) {
                        echo "⚠️ Tests failed: ${e.message}"
                        throw e
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            timeout(time: 15, unit: 'MINUTES')
            steps {
                echo "🔍 Running SonarQube Analysis"
                script {
                    try {
                        sh """
                            mvn sonar:sonar \
                              -Dsonar.projectKey=employee-management \
                              -Dsonar.host.url=${SONAR_HOST_URL} \
                              -Dsonar.login=${SONAR_TOKEN}
                        """
                    } catch (Exception e) {
                        echo "⚠️ SonarQube analysis failed: ${e.message}"
                        // Don't fail pipeline on SonarQube errors
                    }
                }
            }
        }

        stage('Archive Artifacts') {
            timeout(time: 5, unit: 'MINUTES')
            steps {
                echo "📦 Archiving Build Artifacts"
                script {
                    archiveArtifacts artifacts: "${BUILD_ARTIFACTS}", 
                                      allowEmptyArchive: true,
                                      fingerprint: true
                    echo "✅ Artifacts archived successfully"
                }
            }
        }

        stage('Docker Build') {
            timeout(time: 15, unit: 'MINUTES')
            steps {
                echo "🐳 Building Docker Image"
                script {
                    try {
                        sh """
                            docker build -t ${IMAGE_NAME}:${DOCKER_TAG} .
                            docker tag ${IMAGE_NAME}:${DOCKER_TAG} ${IMAGE_NAME}:latest
                            echo "✅ Docker image built successfully: ${IMAGE_NAME}:${DOCKER_TAG}"
                        """
                    } catch (Exception e) {
                        echo "❌ Docker build failed: ${e.message}"
                        throw e
                    }
                }
            }
        }

        stage('Push Image to Registry') {
            timeout(time: 15, unit: 'MINUTES')
            steps {
                echo "📤 Pushing Docker Image to Registry"
                script {
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerHubCreds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        try {
                            sh """
                                echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin ${REGISTRY}
                                docker tag ${IMAGE_NAME}:${DOCKER_TAG} ${DOCKER_USER}/${IMAGE_NAME}:${DOCKER_TAG}
                                docker tag ${IMAGE_NAME}:${DOCKER_TAG} ${DOCKER_USER}/${IMAGE_NAME}:latest
                                
                                # Push with retry logic
                                for i in 1 2 3; do
                                    echo "Attempt \$i of 3: Pushing ${DOCKER_USER}/${IMAGE_NAME}:${DOCKER_TAG}"
                                    if docker push ${DOCKER_USER}/${IMAGE_NAME}:${DOCKER_TAG}; then
                                        break
                                    elif [ \$i -lt 3 ]; then
                                        sleep 10
                                    fi
                                done
                                
                                docker push ${DOCKER_USER}/${IMAGE_NAME}:latest
                                docker logout ${REGISTRY}
                                echo "✅ Docker image pushed successfully"
                            """
                        } catch (Exception e) {
                            echo "❌ Docker push failed: ${e.message}"
                            throw e
                        }
                    }
                }
            }
        }

        stage('Deploy Application') {
            timeout(time: 10, unit: 'MINUTES')
            steps {
                echo "🚀 Deploying Application using Docker Compose"
                script {
                    try {
                        sh '''
                            docker compose down || true
                            docker compose up -d
                            sleep 5
                            docker compose ps
                            echo "✅ Application deployed successfully"
                        '''
                    } catch (Exception e) {
                        echo "❌ Deployment failed: ${e.message}"
                        throw e
                    }
                }
            }
        }

        stage('Cleanup') {
            timeout(time: 5, unit: 'MINUTES')
            steps {
                echo "🧹 Cleaning up unused Docker resources"
                script {
                    sh '''
                        docker image prune -af --filter "until=72h" || true
                        docker container prune -f --filter "until=72h" || true
                        echo "✅ Cleanup completed"
                    '''
                }
            }
        }
    }

    post {
        always {
            echo "📦 Pipeline execution completed at ${new Date().format('yyyy-MM-dd HH:mm:ss')}"
            cleanWs()
        }

        success {
            echo "✅ Build & Deployment Successful!"
            echo ""
            echo "📊 Service URLs:"
            echo "  🌐 Application     : http://<EC2-IP>:8080"
            echo "  🔍 SonarQube       : http://<EC2-IP>:9000"
            echo "  📊 Prometheus      : http://<EC2-IP>:9090"
            echo "  📈 Grafana         : http://<EC2-IP>:3000"
            echo ""
            echo "🐳 Docker Image    : ${DOCKER_USER}/${IMAGE_NAME}:${DOCKER_TAG}"
        }

        failure {
            echo "❌ Pipeline Failed!"
            echo "🔗 Check Jenkins logs for details: ${BUILD_URL}console"
        }

        unstable {
            echo "⚠️ Pipeline unstable - Some tests may have failed"
        }
    }
}

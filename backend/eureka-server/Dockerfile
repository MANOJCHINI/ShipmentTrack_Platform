# FROM eclipse-temurin:25-jdk-alpine

# WORKDIR /app

# COPY target/eureka-server-0.0.1-SNAPSHOT.jar app.jar

# EXPOSE 8761

# ENTRYPOINT ["java", "-jar", "app.jar"]

# Build stage
FROM maven:3.9-eclipse-temurin-25-alpine AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:25-jdk-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "app.jar"]
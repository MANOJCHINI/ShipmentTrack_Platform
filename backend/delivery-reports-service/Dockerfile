FROM eclipse-temurin:25-jre-alpine

WORKDIR /app

COPY target/delivery-reports-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8087

ENTRYPOINT ["java", "-jar", "app.jar"]

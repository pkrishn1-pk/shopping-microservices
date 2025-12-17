# Shopping Microservices Application

This project contains three microservices: **Cart**, **Order**, and **Inventory**.
They are built with Spring Boot and containerized using Docker.

## Project Structure
- `cart-service`: Manages user shopping carts (Port 8081)
- `order-service`: Manages user orders (Port 8082)
- `inventory-service`: Manages product inventory (Port 8083)

## Quick Start (Docker)

You can run the entire stack with a single command using Docker Compose.

### Prerequisites
- Docker & Docker Compose installed

### Run
1. Navigate to the `shopping-microservices` directory:
   ```bash
   cd shopping-microservices
   ```
2. Build and start the containers:
   ```bash
   docker compose up --build -d
   ```
   *Note: Use `docker compose` (v2 plugin) rather than `docker-compose` (standalone) if possible.*

3. Stop the containers:
   ```bash
   docker compose down
   ```

## Development
Each service is a standard Spring Boot application.

### Build
You can build each service individually using Maven:
```bash
mvn clean package
```

### Run Locally (Without Docker)
You can run each service individually:
```bash
mvn spring-boot:run
```
*Note: Ensure ports 8081, 8082, and 8083 are free.*

## API Endpoints

### Cart Service (http://localhost:8081)
- `GET /cart/{userId}`: Get cart items
- `POST /cart/{userId}`: Add item
- `DELETE /cart/{itemId}`: Remove item

### Order Service (http://localhost:8082)
- `GET /order/{userId}`: Get orders
- `POST /order`: Place order
- `DELETE /order/{orderId}`: Cancel order

### Inventory Service (http://localhost:8083)
- `GET /inventory`: Get all items
- `POST /inventory`: Add item
- `PUT /inventory/{id}/stock`: Update stock

## Notes
- The containers use `eclipse-temurin:17-jre` as the base image.
- Services communicate over the defined Docker network `shopping-network`.

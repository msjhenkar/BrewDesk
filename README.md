# BrewDesk
A Full-stack **Cafe Management Application** built with **Spring Boot** ND **React**, designed to streamline cafe operations - from managing menus to tracking orders through their full lifecycle.

---

## 🚀 Tech Stack

### Backend
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)


### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

---

## ✨ Features

### 👥 Customer
- 🗒️ **Browse Menu** - View all available menu items
- ➕ **Add Menu Items** - Add items to the Cart
- 🛒 **Place Orders** - Select items and place orders
- 📃 **Order history** -  View all previously placed orders

### 🔐 Admin
- 👥 **Customer Order Overview** - view all customer in one place
- 📃 **Individual Cart details** - Inspect each Customer's cart and order breakdown
- 🔄️ **Order Status LifeCycle** - Track and update orders from placement to completion

### ⚙️ System
- 🔗 Menu <-> order Relationship - Many-to-Many association between menu items and orders
- 🌐 **RESTful API** - Clean, well-structured REST endpoints

---

## 📂 Project Structure

```
src/
└── main/
    ├── java/com/cafe/backend/
    │   ├── config/
    │   │   └── CorsConfig.java
    │   ├── controllers/
    │   │   ├── AdminOrderController.java
    │   │   ├── MenuController.java
    │   │   ├── OrderController.java
    │   │   └── UserController.java
    │   ├── dtos/
    │   │   ├── auth/
    │   │   │   ├── LoginRequest.java
    │   │   │   ├── RegisterRequest.java
    │   │   │   └── RegisterResponse.java
    │   │   ├── menu/
    │   │   │   ├── MenuSearchRequest.java
    │   │   │   └── MenuSearchResponse.java
    │   │   └── order/
    │   │       ├── OrderItemRequestDTO.java
    │   │       ├── OrderItemResponse.java
    │   │       ├── OrderRequestDTO.java
    │   │       └── OrderResponse.java
    │   ├── entities/
    │   │   ├── MenuItem.java
    │   │   ├── Order.java
    │   │   ├── OrderItem.java
    │   │   └── User.java
    │   ├── enums/
    │   │   ├── OrderStatus.java
    │   │   └── UserRole.java
    │   ├── repository/
    │   │   ├── MenuRepository.java
    │   │   ├── OrderItemRepository.java
    │   │   ├── OrderRepository.java
    │   │   └── UserRepository.java
    │   ├── service/
    │   │   ├── menu/
    │   │   │   ├── MenuService.java
    │   │   │   └── MenuServiceImpl.java
    │   │   ├── order/
    │   │   │   ├── OrderService.java
    │   │   │   └── OrderServiceImpl.java
    │   │   └── user/
    │   │       └── UserService.java
    │   └── BackendApplication.java
    └── resources/
```

---

## 🔌 API Endpoints

### 👤 Customer Endpoints

#### Menu
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | `/api/menu`       | Browse all menu items    |
| POST   | `/api/menu`       | Add a new menu item      |



#### Orders
| Method | Endpoint                     | Description                    |
|--------|------------------------------|--------------------------------|
| POST   | `/api/orders`                | Place a new order              |
| GET    | `/api/orders/my/{customerId}`| View personal order history    |

---


### 🔐 Admin Endpoints

#### Order Management
| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| GET    | `/api/orders`                   | View all customer orders           |
| GET    | `/api/orders/{id}`              | View individual order/cart details |
| PATCH  | `/api/orders/{id}/status`       | Update order status                |
| DELETE | `/api/orders/{id}`              | Delete an order                    |


#### Menu Management
| Method | Endpoint          | Description         |
|--------|-------------------|---------------------|
| GET    | `/api/menu/{id}`  | Get menu item by ID |
| PUT    | `/api/menu/{id}`  | Update menu item    |
| DELETE | `/api/menu/{id}`  | Delete menu item    |

---


### Order Status Lifecycle


```
PENDING → CONFIRMED → PREPARING → READY → DELIVERED
                                         ↘ CANCELLED
```

---

## ⚙️ Getting Started

### Prerequisites

- Java 17+
- Maven 3.6+
- MySQL 8+
- Node.js (for frontend)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cafe-management.git
   cd cafe-management
   ```

2. **Configure the database**  
   Update `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/cafe_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```

3. **Create the MySQL database**
   ```sql
   CREATE DATABASE cafe_db;
   ```


4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   The server starts at `http://localhost:8080`

### Frontend Setup

> 🚧 React frontend integration — coming soon!

---

## 🧪 Sample Requests

### 👤 Customer — Add a Menu Item
```bash
curl -X POST http://localhost:8080/api/menu \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cappuccino",
    "price": 4.50,
    "category": "BEVERAGE",
    "available": true
  }'
```

### 👤 Customer — Place an Order
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "menuItems": [1, 2],
    "status": "PENDING"
  }'
```

## 🛣️ Roadmap

- [x] Menu CRUD API
- [x] Orders CRUD API with status lifecycle
- [x] `OrderItem` join entity (Menu ↔ Order)
- [x] Customer — Add menu items, place orders & view order history
- [x] Admin — View all customer orders & individual cart details
- [x] Auth DTOs (LoginRequest, RegisterRequest, RegisterResponse)
- [x] User entity with `UserRole` enum (CUSTOMER / ADMIN)
- [x] Service interface + implementation pattern
- [x] CORS configuration
- [ ] JWT-based authentication & role-based authorization
- [ ] React frontend integration
- [ ] Exception handling & input validation
- [ ] Pagination & filtering for orders/menu


<p align="center">Built with ☕ and Spring Boot</p>
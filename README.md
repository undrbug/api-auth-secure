# API REST Usuarios y Productos / Users & Products REST API

---

## Español

### Descripción
Esta API permite gestionar usuarios y productos con autenticación segura, ideal como base para proyectos de e-commerce, inventario o gestión de usuarios. Incluye autenticación JWT, protección de rutas, validación de datos y operaciones CRUD.

### Tecnologías utilizadas
- Node.js
- Express.js
- MySQL
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- helmet, cors, morgan, dotenv

### Requisitos previos
- Node.js >= 14
- MySQL >= 5.7

### Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/undrbug/api-auth-secure.git
   cd api-auth-secure
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno creando un archivo `.env` en la raíz con:
   ```env
   NODE_ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASS=tu_password
   DB_NAME=nombre_db
   JWT_SECRET=clave_secreta
   JWT_REFRESH_SECRET=clave_refresh
   CORS_ORIGIN=http://localhost:3000
   LOCK_TIME=15
   MAX_ATTEMPTS=5
   ```
4. Inicia la aplicación:
   ```bash
   npm start
   ```

### Estructura del proyecto
- `app.js`: Punto de entrada.
- `config/`: Configuración y variables de entorno.
- `db.js`: Conexión a MySQL.
- `api/routes/`: Definición de rutas (auth, users, products).
- `api/controllers/`: Lógica de negocio.
- `api/middlewares/`: Middlewares de autenticación, roles y errores.

### Endpoints principales y ejemplos

#### Autenticación
- **Registro:**
  - `POST /api/auth/register`
  - Body:
    ```json
    { "name": "Juan", "email": "juan@mail.com", "password": "Password123!" }
    ```
  - Ejemplo curl:
    ```bash
    curl -X POST http://localhost:3000/api/auth/register \
      -H "Content-Type: application/json" \
      -d '{"name":"Juan","email":"juan@mail.com","password":"Password123!"}'
    ```
- **Login:**
  - `POST /api/auth/login`
  - Body:
    ```json
    { "email": "juan@mail.com", "password": "Password123!" }
    ```
  - Ejemplo curl:
    ```bash
    curl -X POST http://localhost:3000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"juan@mail.com","password":"Password123!"}'
    ```
- **Refresh Token:**
  - `POST /api/auth/refresh`
  - (Requiere cookie `refreshToken`)
- **Logout:**
  - `POST /api/auth/logout`
  - (Requiere cookie `refreshToken`)

#### Usuarios
- **Obtener mi usuario:**
  - `GET /api/users/me` (Requiere autenticación)
  - Ejemplo curl:
    ```bash
    curl -H "Authorization: Bearer <token>" http://localhost:3000/api/users/me
    ```
- **Endpoint solo para admin:**
  - `GET /api/users/admin-only` (Requiere rol admin)

#### Productos
- **Listar productos:**
  - `GET /api/products`
- **Ver producto por ID:**
  - `GET /api/products/1`
- **Listar ofertas:**
  - `GET /api/products/deals`
- **Crear producto:**
  - `POST /api/products` (Requiere autenticación y rol admin)
  - Body:
    ```json
    {
      "title": "Producto X",
      "description": "Descripción",
      "price": 100,
      "image": "url.jpg",
      "category": "cat",
      "stock": 10,
      "on_offer": true,
      "offer_price": 80,
      "rating": 5,
      "rating_count": 1
    }
    ```
  - Ejemplo curl:
    ```bash
    curl -X POST http://localhost:3000/api/products \
      -H "Authorization: Bearer <token>" \
      -H "Content-Type: application/json" \
      -d '{...}'
    ```
- **Actualizar producto:**
  - `PUT /api/products/1` (Requiere autenticación y rol admin)
- **Eliminar producto:**
  - `DELETE /api/products/1` (Requiere autenticación y rol admin)

### Seguridad y roles
- Autenticación JWT (token en header Authorization).
- Refresh token seguro en cookie httpOnly.
- Rutas protegidas por middleware.
- Roles: usuario y admin.

### Contribuciones
¡Las contribuciones son bienvenidas! Abre un issue o pull request.

### Licencia
MIT

---

## English

### Description
This API lets you manage users and products with secure authentication, ideal as a base for e-commerce, inventory, or user management projects. It includes JWT authentication, route protection, data validation, and CRUD operations.

### Technologies used
- Node.js
- Express.js
- MySQL
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- helmet, cors, morgan, dotenv

### Prerequisites
- Node.js >= 14
- MySQL >= 5.7

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/undrbug/api-auth-secure.git
   cd api-auth-secure
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables by creating a `.env` file in the root:
   ```env
   NODE_ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_user
   DB_PASS=your_password
   DB_NAME=your_db
   JWT_SECRET=your_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   CORS_ORIGIN=http://localhost:3000
   LOCK_TIME=15
   MAX_ATTEMPTS=5
   ```
4. Start the app:
   ```bash
   npm start
   ```

### Project structure
- `app.js`: Entry point.
- `config/`: Configuration and environment variables.
- `db.js`: MySQL connection.
- `api/routes/`: Route definitions (auth, users, products).
- `api/controllers/`: Business logic.
- `api/middlewares/`: Auth, role, and error middlewares.

### Main endpoints and examples

#### Authentication
- **Register:**
  - `POST /api/auth/register`
  - Body:
    ```json
    { "name": "John", "email": "john@mail.com", "password": "Password123!" }
    ```
  - Curl example:
    ```bash
    curl -X POST http://localhost:3000/api/auth/register \
      -H "Content-Type: application/json" \
      -d '{"name":"John","email":"john@mail.com","password":"Password123!"}'
    ```
- **Login:**
  - `POST /api/auth/login`
  - Body:
    ```json
    { "email": "john@mail.com", "password": "Password123!" }
    ```
  - Curl example:
    ```bash
    curl -X POST http://localhost:3000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"john@mail.com","password":"Password123!"}'
    ```
- **Refresh Token:**
  - `POST /api/auth/refresh`
  - (Requires `refreshToken` cookie)
- **Logout:**
  - `POST /api/auth/logout`
  - (Requires `refreshToken` cookie)

#### Users
- **Get my user:**
  - `GET /api/users/me` (Requires authentication)
  - Curl example:
    ```bash
    curl -H "Authorization: Bearer <token>" http://localhost:3000/api/users/me
    ```
- **Admin only endpoint:**
  - `GET /api/users/admin-only` (Requires admin role)

#### Products
- **List products:**
  - `GET /api/products`
- **Get product by ID:**
  - `GET /api/products/1`
- **List deals:**
  - `GET /api/products/deals`
- **Create product:**
  - `POST /api/products` (Requires authentication and admin role)
  - Body:
    ```json
    {
      "title": "Product X",
      "description": "Description",
      "price": 100,
      "image": "url.jpg",
      "category": "cat",
      "stock": 10,
      "on_offer": true,
      "offer_price": 80,
      "rating": 5,
      "rating_count": 1
    }
    ```
  - Curl example:
    ```bash
    curl -X POST http://localhost:3000/api/products \
      -H "Authorization: Bearer <token>" \
      -H "Content-Type: application/json" \
      -d '{...}'
    ```
- **Update product:**
  - `PUT /api/products/1` (Requires authentication and admin role)
- **Delete product:**
  - `DELETE /api/products/1` (Requires authentication and admin role)

### Security and roles
- JWT authentication (token in Authorization header).
- Secure refresh token in httpOnly cookie.
- Protected routes via middleware.
- Roles: user and admin.

### Contributing
Contributions are welcome! Open an issue or pull request.

### License
MIT
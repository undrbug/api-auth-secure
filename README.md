# API REST Usuarios y Productos

Esta API permite gestionar usuarios y productos de manera segura. Incluye autenticación, autorización y operaciones CRUD para ambos recursos. Es ideal para aprender o implementar una base para proyectos de e-commerce, inventario o gestión de usuarios.

---

## Características principales

- **Registro y login de usuarios** con autenticación JWT.
- **Protección de rutas**: solo usuarios autenticados pueden acceder a ciertas rutas.
- **CRUD de usuarios**: crear, leer, actualizar y eliminar usuarios.
- **CRUD de productos**: crear, leer, actualizar y eliminar productos.
- **Gestión de stock y ofertas** en productos.
- **Validación de datos** y manejo de errores.
- **Endpoints claros y documentados**.
- **Fácil de probar con herramientas como Postman o Thunder Client**.

---

## Instalación y uso rápido

1. **Clona el repositorio:**
   ```bash
   git clone https://git@github.com:undrbug/api-auth-secure.git
   cd api_rest_users_products/api-auth-secure
   ```
2. **Instala las dependencias:**
   ```bash
   npm install
   ```
3. **Configura las variables de entorno:**
   Crea un archivo .env basado en .env.example y completa los datos de tu base de datos y JWT_SECRET.
4. **Inicia la aplicación:**
   ```bash
   npm start
   ```
5. **Prueba los endpoints:**
   Utiliza Postman o Thunder Client para probar los endpoints de la API. Puedes encontrar ejemplos de peticiones en la documentación de cada endpoint.

---
## Endpoints disponibles
   Autenticación
POST /api/auth/register — Registrar usuario
POST /api/auth/login — Login y obtención de token
Usuarios
GET /api/users — Listar usuarios (requiere autenticación)
GET /api/users/:id — Ver usuario por ID
PUT /api/users/:id — Actualizar usuario
DELETE /api/users/:id — Eliminar usuario
Productos
GET /api/products — Listar productos
GET /api/products/:id — Ver producto por ID
POST /api/products — Crear producto (requiere autenticación)
PUT /api/products/:id — Actualizar producto
DELETE /api/products/:id — Eliminar producto
---
## Contribuciones
Las contribuciones son bienvenidas. Si encuentras algún error o tienes una mejora, por favor, abre un issue o un pull request.
## Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.  
## Contacto
Para cualquier duda o consulta, puedes contactarme a través de GitHub o mi correo electrónico hgauna@soltec-dev.ar.
## Tecnologías utilizadas
- Node.js
- Express.js
- MySQL
- bcryptjs
- cookie-parser
- cors
- dotenv
- express-validator
- helmet
- jsonwebtoken
- morgan
- mysql2
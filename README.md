# Ticketing System

A full-stack ticketing system built with Spring Boot (Java) backend and Next.js frontend, featuring role-based access control, ticket management, and real-time updates.

## Features

### Must-Have Features ✅

- **Authentication & Authorization**

  - Login/logout functionality
  - Role-based access control (User, Support Agent, Admin)
  - JWT token-based authentication
  - Users can only manage their own tickets

- **User Dashboard**

  - Create new tickets with subject, description, and priority
  - View list of tickets with current status
  - Add comments to tickets
  - Track ticket status (Open, In Progress, Resolved, Closed)
  - View ticket history with all comments

- **Ticket Management**

  - Complete ticket lifecycle: Open → In Progress → Resolved → Closed
  - Support agents can be assigned to tickets
  - Comment threads on each ticket with timestamps and user info
  - Track ticket owner and assignee
  - Status transition validation

- **Admin Panel**

  - User management (add/remove users, assign roles)
  - View all tickets across the system
  - Force reassign or resolve/close any ticket
  - Monitor ticket statuses across users
  - Dashboard with system statistics

- **Access Control**
  - Admins can manage users and override tickets
  - Support agents can be assigned to tickets, add comments, and change statuses
  - Regular users can only manage their own tickets

### Good-to-Have Features 🚀

- **Search & Filter**

  - Search tickets by subject, status, priority, or user
  - Filter tickets by status or assigned agent
  - Pagination support

- **Ticket Prioritization**

  - Priority levels: Low, Medium, High, Urgent
  - Sort and filter tickets based on priority

- **Rating System**
  - Users can rate ticket resolution (1-5 stars)
  - Optional feedback for resolved tickets

## Tech Stack

### Backend

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **PostgreSQL** database
- **Maven** for dependency management

### Frontend

- **Next.js 14** (React-based framework)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Axios** for HTTP requests
- **React Hot Toast** for notifications

## Quick Start

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- Docker and Docker Compose
- Maven 3.6+

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ticket-system
```

### 2. Start PostgreSQL Database

```bash
docker-compose up -d
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd .

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## Default Users

The system comes with pre-configured demo accounts:

| Username  | Password     | Role          | Description                       |
| --------- | ------------ | ------------- | --------------------------------- |
| `admin`   | `admin123`   | Admin         | Full system access                |
| `support` | `support123` | Support Agent | Can manage assigned tickets       |
| `user`    | `user123`    | User          | Can create and manage own tickets |

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Tickets

- `GET /api/tickets/my-tickets` - Get user's tickets
- `POST /api/tickets` - Create new ticket
- `GET /api/tickets/{id}` - Get ticket details
- `POST /api/tickets/{id}/comments` - Add comment to ticket
- `PUT /api/tickets/{id}/status` - Update ticket status
- `PUT /api/tickets/{id}/priority` - Update ticket priority
- `POST /api/tickets/{id}/rate` - Rate ticket resolution

### Admin (Admin role required)

- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/{id}/role` - Update user role
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/tickets` - Get all tickets
- `PUT /api/admin/tickets/{id}/assign` - Assign ticket to agent
- `PUT /api/admin/tickets/{id}/force-status` - Force update ticket status
- `GET /api/admin/dashboard` - Get system statistics

## Database Schema

The system uses the following main entities:

- **Users**: Authentication and role management
- **Tickets**: Main ticket information with status and priority
- **Comments**: Ticket discussion threads
- **Enums**: Status (OPEN, IN_PROGRESS, RESOLVED, CLOSED) and Priority (LOW, MEDIUM, HIGH, URGENT)

## Security Features

- JWT-based authentication
- Role-based access control
- Password encryption with BCrypt
- CORS configuration for frontend integration
- Input validation and sanitization

## Development

### Backend Development

```bash
# Run with hot reload
mvn spring-boot:run

# Run tests
mvn test

# Build JAR file
mvn clean package
```

### Frontend Development

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Deployment

### Backend

```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/ticket-system-backend-1.0.0.jar
```

### Frontend

```bash
# Build
npm run build

# Deploy to any static hosting service
# (Vercel, Netlify, AWS S3, etc.)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

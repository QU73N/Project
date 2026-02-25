# OptiSched Database Setup Guide

This guide will help you set up the MySQL database for the OptiSched application with proper user roles and authentication.

## Prerequisites

1. **MySQL Server** (version 8.0 or higher recommended)
2. **MySQL Workbench** (for database management)
3. **Node.js** (version 16 or higher)
4. **npm** or **yarn**

## Database Setup

### 1. Install MySQL Server

Download and install MySQL Server from [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)

During installation, note down:
- Root password
- Port number (default: 3306)

### 2. Create Database

Open MySQL Workbench and execute the following steps:

1. Connect to your MySQL server
2. Open a new query tab
3. Run the schema file:

```sql
-- Execute the database/schema.sql file
SOURCE database/schema.sql;
```

Or manually run the SQL commands from `database/schema.sql`

### 3. Verify Database Creation

Check that the database and tables were created:

```sql
USE optisched_db;
SHOW TABLES;
```

You should see these tables:
- users
- user_roles
- departments
- students
- teachers
- subjects
- classes
- student_enrollments
- events
- schedule_changes
- system_logs

## Application Configuration

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the `.env` file and update the MySQL configuration:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-mysql-password-here
DB_NAME=optisched_db
```

### 3. Test Database Connection

Start the application:

```bash
npm start
```

The app will automatically test the database connection on startup.

## User Roles and Permissions

The system includes the following user roles:

### 1. **Student** (`student001`)
- **Permissions**: View schedule, view/edit profile
- **Default Password**: `password123`
- **Access**: Can only view their own schedule and edit profile picture

### 2. **Teacher** (`teacher001`)
- **Permissions**: View/edit schedule, view/edit profile
- **Default Password**: `password123`
- **Access**: Can edit their designated class schedules, cancel classes

### 3. **Principal** (`principal001`)
- **Permissions**: Full schedule management, user management
- **Default Password**: `password123`
- **Access**: Can manage all schedules and users

### 4. **IT Manager** (`itmanager001`)
- **Permissions**: Full system access
- **Default Password**: `password123`
- **Access**: Complete system administration

### 5. **Event Handler** (`event001`)
- **Permissions**: Event management, profile editing
- **Default Password**: `password123`
- **Access**: Can manage school events

## Default Users

The database comes with pre-configured users for testing:

| Username | Role | Password |
|----------|------|----------|
| student001 | Student | password123 |
| teacher001 | Teacher | password123 |
| principal001 | Principal | password123 |
| itmanager001 | IT Manager | password123 |
| event001 | Event Handler | password123 |

## Authentication Features

### Login Process
1. User enters username and password
2. System validates credentials against database
3. If username not found: "User ID not found"
4. If password incorrect: "Password incorrect"
5. Successful login redirects to role-appropriate dashboard

### Security Features
- Password hashing with bcrypt
- Session management with timeout
- Role-based access control
- Activity logging
- Input validation

## Database Schema Overview

### Core Tables

**users**: Stores user authentication and profile data
**user_roles**: Defines roles and permissions
**students**: Student-specific information
**teachers**: Teacher-specific information
**classes**: Class schedules and assignments
**subjects**: Available subjects
**events**: School events and announcements

### Relationship Overview
```
users → user_roles (many-to-one)
users → students (one-to-one)
users → teachers (one-to-one)
students → student_enrollments (one-to-many)
teachers → classes (one-to-many)
classes → subjects (many-to-one)
```

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check MySQL server is running
   - Verify credentials in .env file
   - Ensure database name is correct

2. **Authentication Errors**
   - Verify user exists in database
   - Check password is correct
   - Ensure user is active (is_active = 1)

3. **Permission Errors**
   - Check user role permissions
   - Verify role assignments in database

### Reset Database

To reset the database to initial state:

```sql
DROP DATABASE IF EXISTS optisched_db;
SOURCE database/schema.sql;
```

## Security Recommendations

1. **Change Default Passwords**: Update all default user passwords
2. **Environment Security**: Keep .env file secure and never commit to version control
3. **Database Security**: Use strong MySQL passwords and limit access
4. **Regular Backups**: Schedule regular database backups
5. **Access Control**: Limit database user permissions to only what's needed

## Next Steps

After database setup:

1. Test login with different user roles
2. Verify role-based access control
3. Test schedule management features
4. Set up additional users as needed
5. Configure backup procedures

## Support

For issues with database setup:
1. Check MySQL error logs
2. Verify network connectivity
3. Review application logs
4. Test with MySQL Workbench first

---

**Note**: This setup is for development/testing. For production, ensure proper security measures, backup strategies, and monitoring are in place.

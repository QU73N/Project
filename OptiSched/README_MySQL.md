# OptiSched MySQL Setup

## Database Connection Details

- **Host**: 127.0.0.1
- **Port**: 3306
- **User**: root
- **Password**: BokuNoPico2008
- **Database**: optisched

## MySQL Status

Your MySQL server is running as service **MySQL84**.

## Database Configuration

The database connection is configured in `lib/database.js`:

```javascript
const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'BokuNoPico2008',
  database: 'optisched'
};
```

## Starting/Stopping MySQL

To start MySQL:
```bash
net start MySQL84
```

To stop MySQL:
```bash
net stop MySQL84
```

## React Native App

The app is currently running with basic UI and no authentication. You can:
- Use the login form (currently just logs to console)
- Navigate between screens
- Test the UI components

## Next Steps

You can now:
1. Create your own database schema
2. Add authentication as needed
3. Implement your own backend API
4. Connect to any database service you prefer

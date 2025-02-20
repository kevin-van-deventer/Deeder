# Deeder - Community Help Platform

**Project Overview**
Deeder is a community-driven platform where users can request help (deeds) and volunteers can step in to assist. Each request requires at least five volunteers to confirm the completion before it is marked as fulfilled. Requesters can confirm each request before or automatically after 5 volunteers have completed the deed request. The platform is designed to help communities come together to help each other in times of need.

## User Interactions

### Sign Up and Register

- Users can sign up by providing their first name, last name, email, password, and ID document.
- Registration is handled through the frontend, which communicates with the backend API to create a new user.

### Login

- Registered users can log in using their email and password.
- Upon successful login, users receive a JWT token for authentication, which is used for subsequent API requests.

### Create Deeds

- Logged-in users can create new deeds by providing a description, deed type, and location (latitude and longitude).
- The deed is stored in the backend database and is available for volunteers to view and respond to.

### Volunteer for Deeds

- Volunteers can view available deeds and choose to volunteer for them.
- Each deed requires at least five volunteers to confirm completion before it is marked as fulfilled.

### Confirm Completion

- Requesters can confirm the completion of a deed manually or automatically after five volunteers have confirmed it.
- The backend API handles the logic for confirming deed completion and updating the deed status.

## Features

### Map Integration

- The platform includes a map feature that allows users to view the location of deeds.
- The map is integrated using a mapping library (e.g., Google Maps or Leaflet) and displays markers for each deed's location.

### Routing

- The frontend uses React Router for client-side routing.
- The main routes include:
  - `/`: Home page
  - `/login`: Login page
  - `/register`: Registration page
  - `/dashboard`: User dashboard where users can view and manage their deeds

### Authentication

- JWT (JSON Web Token) is used for user authentication.
- Tokens are issued upon successful login and are required for accessing protected routes and API endpoints.

### API Endpoints

- The backend provides RESTful API endpoints for managing users and deeds.
- Key endpoints include:
  - `POST /api/register`: Register a new user
  - `POST /api/login`: Authenticate a user and issue a JWT token
  - `POST /api/deeds`: Create a new deed
  - `GET /api/deeds`: Retrieve a list of deeds
  - `POST /api/deeds/:id/volunteer`: Volunteer for a deed
  - `POST /api/deeds/:id/confirm`: Confirm the completion of a deed

## OpenAPI Documentation

The API is documented using the OpenAPI specification. The `openapi.yaml` file located in the `backend/docs` directory provides detailed information about the available endpoints, request parameters, and responses.

- [OpenAPI Documentation](./backend/docs/openapi.yaml)

## Documentation

For detailed setup instructions, please refer to the respective README files in the `frontend` and `backend` directories:

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

## Deployment

Follow the deployment instructions for both the frontend and backend to deploy the application to the chosen hosting provider.

**Note:** Ensure that the backend API is running and accessible for the frontend to communicate with it.

## Contributing

We welcome contributions to improve Deeder. Please follow the standard GitHub workflow for contributing:

1. Fork the repository
2. Create a new branch for the feature or bugfix
3. Commit the changes
4. Push the branch to the fork
5. Create a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

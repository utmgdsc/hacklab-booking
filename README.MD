<h1><img width="500" src="https://i.imgur.com/CCHOZb7.png" alt="Hacklab Booking System"></h1>

<strong>MCS Project with Prof. Liut and Aameri</strong>
<br>
<a href="https://hacklabbooking.utm.utoronto.ca">https://hacklabbooking.utm.utoronto.ca</a> &bullet; <a href="https://github.com/utmgdsc/hacklab-booking/wiki">Documentation</a></center>
<br>
<hr>

The Hacklab Booking System is a web application that allows users to book the Hacklab for a specific time and date.


### 💻 Technologies Used
* The application is built using [Material UI](https://mui.com/material-ui/) and [React](https://reactjs.org/).

* The backend is built using [Node.js](https://nodejs.org/en/) and [Express](https://expressjs.com/).

* The database is built using [PostgreSQL](https://www.postgresql.com/).

* The application is is [Docker](https://www.docker.com/) containers and is deployed using [Docker Compose](https://docs.docker.com/compose/).

### 🧓 Legacy Deployment Instructions
As of now, the project is hosted on a VM provided by UTM. There is an Apache instance listening on ports 80 and 443 and reverse proxies to port 3555.

Our app is self-contained and has its own nginx reverse proxy to have all requests to `/api` directed to the backend container and all other requests to the frontend container.

The front end is created with react and is served by serve. The backend is a nodejs app.

To deploy, get the latest code, and run `docker compose up -d --build`. This will start up our application on port 3555. A different port would require modifying the compose file.

## 🌃 System Architecture

![Abstracted System Architecture](https://i.imgur.com/YgUfPZs.png)

### User Roles and Characteristics

#### Student

The student role is the default role given to everyone upon first launch (given already authenticated with Shibboleth. It gives the following permissions:

- Create a group

#### Request Approver

The request approver role is manually given to faculty upon request. After being granted the `approver` role, faculty must also request permission to become an approver for each room they would like to approve. It gives the following permissions:

- View a log of all previous requests
- Can approve/deny requests for all rooms that they requested

#### TCard Approver

The TCard Approver role is given to system administrators (e.g., Andrew Wang) for the purpose of notifying the student that TCard access has been granted. It gives the following permissions:

- View a log of all previous requests
- Modify students’ database entry regarding TCard access

#### Administrator

The administrator role has all permissions (i.e., the permissions of both Request Approver and TCard Approver) and is given to faculty upon request. It gives the following permissions:

- View a log of all previous requests
- Modify students’ database entry regarding TCard access
- Can approve/deny requests made by any student
- Reject bookings that are already approved
- Can delete student groups

### Groups

Groups are a concept used by the Hacklab Booking System to allow multiple people to view the status of bookings. There is no limit to how many members a group can have, and there is no limit to the number of total groups. Students **must be added to a group or create a group to create requests**.

#### Student Group Roles

In a group, there are two roles with the following permissions:

###### Group Manager

- Can add/remove people to the group (without approval from faculty)
- Can delete other bookings within their group
- Can delete the group

###### Group Member

- Can request bookings under their group name
- Can leave the group
- Can view all the group’s bookings

### Design Constraints and Limitations

Our design has some limitations:

- Upon initialization, there will be no administrators. The first administrator must be added by interacting directly with PostgreSQL.

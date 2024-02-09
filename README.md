# IND Appointment Helper
A project to help you get notifications about soonest appointment in IND!

# My IND Appointment Fetcher API

This is an API developed using Nest.js that allows users to fetch IND (Immigration and Naturalisation Service in the Netherlands) appointments. It serves multiple purposes, including fetching all available appointments and notifying users when a sooner appointment becomes available for a specific service and desk in IND.

## Features

- Fetch all available IND appointments.
- Request a notifier for sooner available appointments for a specific service and desk at IND.
- Users are notified through email or via a Telegram bot when a sooner appointment becomes available.

## Built With

- [Nest.js](https://nestjs.com/)
- [Firebase](https://firebase.google.com/) (used for user authentication with Google Sign Up)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js
- Firebase CLI

### Installation

1. Clone the repo
2. 
```bash
git clone https://github.com/your_username_/Project-Name.git
```

And then install dependencies and run project
```
npm install
```


Set up your Firebase project and enable Google Sign-In method in the Authentication section. Obtain your Firebase project's config object and replace the placeholders in the /src/app.module.ts with your real Firebase config values.


```
const firebaseConfig = {
    apiKey: "<API_KEY>",
    authDomain: "<AUTH_DOMAIN>",
    projectId: "<PROJECT_ID>",
    storageBucket: "<STORAGE_BUCKET>",
    messagingSenderId: "<MESSAGING_SENDER_ID>",
    appId: "<APP_ID>"
};
```

Run the app

```
npm run start
```

or if you want to run it in debug mode:

```
npm run start:debug
```

## Usage


This is list of Endpoints in the project and what they doing:

### Appointments Endpoints

```
GET /appointments/all
```

Fetches all the available appointments.

```
GET /appointments/soonest
```

Fetches the soonest available appointments for a specific service and desk. It takes the following query parameters:

```
service: The service for which the appointment is needed.
desk: The desk at which the appointment is needed.
numberOfPeople: The number of people for the appointment (optional, with a default value).
``` 

### Notifications Endpoints

```
POST /notifications/new
```

Creates a new notification for a user. This endpoint is protected by the Firebase Auth Guard. The request body should contain the notification details.

```
GET /notifications/list/all
```

Fetches all notifications for a user. This endpoint is protected by the Firebase Auth Guard.

```
GET /notifications/telegram/list/all
```


Fetches all telegram notifications for a user. The request body should contain the telegram_chat_id.

```
POST /notifications/telegram/create
```


Creates a new telegram notification. The request body should contain the telegram_chat_id and the notification details (service, desk, date).


### Users Endpoints

```
GET /users/unsubscribe
```


Unsubscribes a user from a specific notification. The query parameter notification_id should be provided.

```
GET /users/unsubscribe/all
```


Unsubscribes a user from all notifications. The query parameter notification_id should be provided.

```
DELETE /users/delete
```


Deletes a user and all their notifications. The query parameter user_id should be provided.

```
POST /users/set-push-token
``` 

Sets the push token for a user. The request body should contain the token, user_id, and email.

## Disclaimer

This project is a hobby project and is intended for educational purposes only. It was developed to learn and demonstrate skills in software development, specifically in creating APIs with Nest.js and Firebase.


This project is not intended for real-world use in fetching IND (Immigration and Naturalisation Service in the Netherlands) appointments or for any other activities that might disrupt or harm IND's operations.


Use of this project for any purposes other than learning is strongly discouraged. The developer will not be responsible for any misuse of this project or any legal consequences that may arise from such misuse.


Please respect IND's rules and regulations when using this project and do not use it in a way that may cause inconvenience or harm to IND or any individuals using IND's services.

# Compliance with IND

In the event that IND (Immigration and Naturalisation Service in the Netherlands) requests the removal of this project, we will comply immediately. This project respects the rights and authorities of IND and is committed to adhering to any and all of IND's requests regarding the use or removal of the project.



## Contributing

Contributions, issues and feature requests are welcome. Feel free to check issues page if you want to contribute.


## License

Distributed under the MIT License. See LICENSE for more information.

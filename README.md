# Express Evaluations API

RESTful Express API for Evaluations on top of MongoDB.

## Authentication

Create a User with the following attributes:

| Attribute | Type   | Description   |
|-----------|--------|---------------|
| name      | string | Full name     |
| email     | string | Email address |
| password  | string | Password      |

Use the following endpoints to deal with initial authentication and the user.

| HTTP Verb | Path        | Description |
|-----------|-------------|--------------|
| `POST`    | `/users`    | Create a user account |
| `POST`    | `/sessions` | Log in with email and password, and retrieve a JWT token |
| `GET`     | `/users/me` | Retrieve own user data |

To authorize further requests, use Bearer authentication with the provided JWT token:

```
Authorization: Bearer <token here>
```

_**Note**: See `db/seed.js` for an example._

## Evaluations

**Note:** See `models/evaluation.js` for the Evaluation schema attributes.

| HTTP Verb | Path | Description |
|-----------|------|--------------|
| `GET` | `/evaluations` | Retrieve all evaluations |
| `POST` | `/evaluations` | Create a evaluation* |
| `GET` | `/evaluations/:id` | Retrieve a single evaluation by it's `id` |
| `PUT` | `/evaluations/:id` | Update a evaluation with a specific `id`* |
| `PATCH` | `/evaluations/:id` | Patch (partial update) a evaluation with a specific `id`* |
| `DELETE` | `/evaluations/:id` | Destroy a single evaluation by it's `id`* |
| | | _* Needs authentication_ |

_**Note**: Run `yarn run seed` to seed some initial evaluations._

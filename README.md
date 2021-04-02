# Notes (Wazzup Test)

Service for storing and sharing notes.

## Table of Contents
* [Requirements](#requirements)
* [Deployment](#deployment)
* [CLI](#cli)
* [API](#api)
  * [Route Table](#route-tables)
    * [User](#user-routes)
    * [Auth](#auth-routes)
    * [Note](#note-routes)
  * [Data Transfer Objects](#data-transfer-objects)
    * [CreateUserRequest](#createuserrequest)
    * [GetTokenRequest](#gettokenrequest)
    * [IndexNoteRequest](#indexnoterequest)
    * [GetNoteRequest](#getnoterequest)
    * [CreateNoteRequest](#createnoterequest)
    * [UpdateNoteRequest](#updatenoterequest)

## Requirements
1. Node.js (>= 12.7.0)
1. PostgreSQL (>= 12)
1. PM2 (>= 4.4.0)

## Deployment
1. Install dependencies: `npm install`
1. Build project: `npm run build`
1. Copy env file: `cp .env.example .env`
1. Change env variables in env file.
1. Run migrations: `npm run migration:run`
1. Run project: `npm run start:prod`

## CLI
`npm run build` - build project.

`npm run start` - Start project.

`npm run start:prod` - Start project in production mode (don't forget to specify that in .env)

`npm run migration:run` - run migrations.

`npm run migration:generate` - generate migration by entities.
* `-n` name of migration. For e.g. `npm run migration:generate -- -n Initial`
* Other arguments see on TypeORM website.

## API

### Authorization
For all requests which need authorization, use that header:

`Authorization: <API-TOKEN>`

Replace `<API-TOKEN>` with token received by requesting `POST /api/auth`

### Route Tables
All routes has prefix `/api`

#### User Routes
| Route                         | Request                                   | Response                                 | Description                                  |
|-------------------------------|-------------------------------------------|------------------------------------------|----------------------------------------------|
| POST /user                    | [CreateUserRequest](#createuserrequest)   | [CreateUserRequest](#createuserrequest)  | Register user.                               |

#### Auth Routes
| Route                         | Request                                   | Response                                 | Description                                  |
|-------------------------------|-------------------------------------------|------------------------------------------|----------------------------------------------|
| POST /auth                    | [GetTokenRequest](#gettokenrequest)       | [GetTokenResponse](#gettokenresponse)    | Get token for authenticated requests.        |
| POST /auth/reset              | none                                      | none                                     | Reset all tokens. Need authorization.        |

#### Note Routes
| Route                         | Request                                   | Response                                  | Description                                  |
|-------------------------------|-------------------------------------------|-------------------------------------------|----------------------------------------------|
| GET /note                     | [IndexNoteRequest](#indexnoterequest)     | [IndexNoteResponse](#indexnoteresponse)   | Get list of notes. Need authorization.       |
| GET /note/:id                 | [GetNoteRequest](#getnoterequest)         | [NoteResponse](#noteresponse)             | Get note.                                    |
| GET /note/:id/preview         | [GetNoteRequest](#getnoterequest)         | Content of note. [See here](#noteresponse)| Get preview of note.                         |
| POST /note                    | [CreateNoteRequest](#createnoterequest)   | [NoteResponse](#noteresponse)             | Create note. Need authorization.             |
| PATCH /note/:id               | [UpdateNoteRequest](#updatenoterequest)   | [NoteResponse](#noteresponse)             | Update note. Need authorization.             |
| DELETE /note/:id              | [GetNoteRequest](#getnoterequest)         | none                                      | Delete note. Need authorization.             |

### Data Transfer Objects

#### CreateUserRequest
Accept-Type: `application/json`

URL parameters: none.

Query parameters: none.

Body:

| Name      | Type     | Description                     |
|-----------|----------|---------------------------------|
| login     | string   | User's login.                   |
| password  | string   | User's password. Min length: 6. |

#### CreateUserResponse
Content-Type: `application/json`

| Name      | Type     | Description                     |
|-----------|----------|---------------------------------|
| id        | int      | User's id.                      |
| login     | string   | User's login.                   |
| createdAt | date     | User's registration date.       |

#### GetTokenRequest
Accept-Type: `application/json`

URL parameters: none.

Query parameters: none.

Body:

| Name      | Type     | Description                     |
|-----------|----------|---------------------------------|
| login     | string   | User's login.                   |
| password  | string   | User's password.                |

#### GetTokenResponse
Content-Type: `application/json`

| Name      | Type     | Description                     |
|-----------|----------|---------------------------------|
| token     | string   | API token.                      |
| expiresAt | date     | Token expiration date.          |

#### IndexNoteRequest
URL parameters: none.

Query parameters:

| Name      | Type     | Description                     |
|-----------|----------|---------------------------------|
| page      | int      | Page number.                    |
| limit     | int      | Count of items per page.        |

Body: none.

#### IndexNoteResponse
Content-Type: `application/json`

| Name      | Type     | Description                              |
|-----------|----------|------------------------------------------|
| count     | int      | Count of all items .                     |
| items     | Note[]   | Array of notes. [See here](#noteresponse)|

#### GetNoteRequest
URL parameters:

| Name      | Type     | Description                     |
|-----------|----------|---------------------------------|
| id        | int      | Identifier of note.             |

Query parameters: none.

Body: none.

#### NoteResponse
Content-Type: `application/json`

| Name      | Type     | Description                     |
|-----------|----------|---------------------------------|
| id        | int      | Identifier of note.             |
| content   | string   | Content of note.                |
| isShared  | boolean  | Note with shared access or not. |
| createdAt | date     | Date the note was created.      |
| updatedAt | date     | Date the note was updated.      |

#### CreateNoteRequest
Accept-Type: `application/json`

URL parameters: none.

Query parameters: none.

Body:

| Name      | Type     | Description                     |
|-----------|----------|---------------------------------|
| content   | string   | Content of note.                |
| isShared  | boolean  | Note with shared access or not. |

#### UpdateNoteRequest
Accept-Type: `application/json`

URL parameters: none.

Query parameters: none.

Body:

| Name      | Type     | Description                     |
|-----------|----------|---------------------------------|
| content   | string?  | Content of note.                |
| isShared  | boolean? | Note with shared access or not. |

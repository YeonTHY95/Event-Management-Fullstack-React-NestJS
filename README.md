# e-Commerce Website

<p align="center">This is the demonstration of <b>Event Management Full Stack Web Application with NestJS</b></p>
<p align="center">Video Demonstration : - </p>

## Table of Contents

- Background
- Tech Stack & Features
- Version
- Assumption
- Quick Start

## Background

This is a full stack web application demonstration built with React, TypeScript, MaterialUI, PostgreSQL, NestJS and so on. Admin is able to add, modify and delete event. The normal user is only able to view event created by admin.

## Tech Stack & Features

1. React
2. TypeScript
3. PostgreSQL
4. Material UI
5. NEST JS 
6. JWT
7. Tanstack Query
8. React-Hook-Form

## Version

1. PostgreSQL - 17
2. TypeScript - 5.7.3
3. React - 19.0.0
4. NEST JS - 11.0.7
5. Tanstack Query - 5.77.1
6. React-Hook-Form - 7.56.4

### Assumption

- The normal user can be upgraded to admin without any payment.

#### Frontend
1. Written in TypeScript.
2. Use **ReactJS**
3. Use Material UI as the CSS framework.
4. Use React Hook Form for efficient form handling with proper data validation.
5. Use TanStack Query for data fetching and state management.
6. Organizing the application into reusable components with proper separation of concerns.

#### Backend
1. Written in TypeScript.
2. Use **NestJS (Preferred)** 
3. Use **Prisma and Postgres** as the database solution
4. Organize code in a MVP structure, incorporating Model, Controller & Service layers.
5. Use JWT authentication with AuthGuard to secure backend APIs
6. Encrypt user passwords before storing them

### App Features

#### Admin Portal

1. **Registration**: 
   1. User can sign up for an admin portal account.
2. **Login**: 
   1. User can log in to the admin portal using email and password credentials.
3. **List events**: 
   1. Events are displayed in a table format for easy reference.
   2. The table should has filter, sort and search feature
4. **Create event**:
   1. User can create new events by providing details such as Event Name, Start Date, End Date & Location.
   2. User can upload an event poster thumbnail.
   3. Newly created events are automatically set with a status of "Ongoing".
5. **Update event**: 
   1. User can edit event details and change the uploaded thumbnail.
   2. A dropdown menu allow users to switch the event status between "Ongoing" and "Completed".
6. **Delete event**: 
   1. Users can delete events, with password validation required for confirmation.

#### User Portal

1. **List events**: 
   1. Events are presented in a thumbnail gallery format for easy browsing, with the event poster thumbnail image.
2. **Select event**: 
   1. Users can click on individual event to view the event detail
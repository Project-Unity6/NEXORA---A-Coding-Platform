# Fetch Profile API Architecture

## Overview

The **Fetch Profile API** is responsible for serving all data required to render a user's profile page, similar to LeetCode.

Instead of exposing multiple APIs for profile information, user statistics, and contribution heatmap, the backend exposes a **single endpoint** that aggregates data from multiple collections and returns a frontend-friendly response.

```
GET /user/profile?year=2026
```

If no year is provided, the backend automatically uses the current year.

---

# Goals

While designing this API, the primary goals were:

* Minimize database round trips.
* Keep response time as low as possible.
* Avoid duplicate data storage.
* Return a response directly consumable by the frontend.
* Keep the implementation modular and scalable.
* Match the user experience of platforms like LeetCode.

---

# Overall Architecture

```
                 Client

                    │

GET /user/profile?year=2026

                    │

                    ▼

          Profile Controller

                    │

                    ▼

          Profile Service

                    │

          Promise.all()

        ┌──────┼────────┐
        ▼      ▼        ▼

      User  UserStats  UserActivity

        └──────┼────────┘

               ▼

     Derived Calculations

               ▼

     Profile Response Builder

               ▼

             JSON
```

The controller only handles HTTP concerns.

The service contains the business logic.

The response builder transforms raw database data into the exact structure required by the frontend.

---

# Why a Single Profile API?

Instead of creating multiple endpoints such as

```
GET /user

GET /user/stats

GET /user/activity
```

we intentionally designed

```
GET /user/profile
```

because the profile page requires all of these pieces simultaneously.

Using one endpoint provides several advantages.

## Fewer Network Requests

Instead of three API calls,

```
Client

↓

User API

↓

Stats API

↓

Activity API
```

the frontend performs only one request.

This reduces latency and simplifies frontend code.

---

## Better User Experience

The entire profile page loads together.

There is no situation where statistics load first while the heatmap loads several seconds later.

---

## Centralized Business Logic

The backend becomes responsible for assembling profile data.

The frontend simply renders what it receives.

This follows the principle:

> Backend owns business logic.
>
> Frontend owns presentation.

---

# Database Queries

The profile consists of information stored in three different collections.

## User

Contains permanent user information.

```
username

email

role

createdAt
```

---

## UserStats

Contains lifetime statistics.

```
totalSubmissions

acceptedSubmissions

solvedProblems

easySolved

mediumSolved

hardSolved

currentStreak

longestStreak
```

These values are maintained through the event-driven analytics system whenever a submission completes.

---

## UserActivity

Contains yearly contribution data.

```
{

    year:2026,

    activity:{

        "2026-06-28":7,

        "2026-06-29":4

    }

}
```

Only one document exists per user per year.

This design avoids creating one document per day, drastically reducing storage requirements while still allowing us to generate a GitHub/LeetCode-style heatmap.

---

# Why Promise.all()?

The three collections are completely independent.

There is no reason to fetch them sequentially.

Instead we execute all reads simultaneously.

```
Promise.all([

User.findById(),

UserStats.findOne(),

UserActivity.findOne()

])
```

This reduces total response time.

Instead of

```
T1

+

T2

+

T3
```

the response time becomes approximately

```
max(T1,T2,T3)
```

which is significantly faster.

---

# Why use .lean()?

The profile API is a read-only endpoint.

The fetched documents are never modified or saved back to MongoDB.

Using

```
.lean()
```

returns plain JavaScript objects instead of Mongoose documents.

Advantages include

* Lower memory usage.
* Faster query execution.
* No unnecessary Mongoose overhead.
* Simpler serialization.

Since the endpoint performs no document mutations, `.lean()` is the correct choice.

---

# Fallback Objects

A newly registered user has no submissions.

Therefore,

```
UserStats.findOne()
```

and

```
UserActivity.findOne()
```

may return

```
null
```

Instead of forcing the frontend to handle null values, the backend creates default objects.

Example:

```
stats

↓

{

totalSubmissions:0,

acceptedSubmissions:0,

...

}
```

and

```
activity

↓

{

year:2026,

activity:{}

}
```

This guarantees a consistent API response for every user.

---

# Derived Calculations

Not every value is stored in the database.

Some values are calculated dynamically.

## Acceptance Rate

Computed as

```
acceptedSubmissions

/

totalSubmissions

×

100
```

instead of being stored.

This avoids redundant data.

---

## Activity Summary

The yearly activity document only stores

```
Date

↓

Submission Count
```

Example

```
{

"2026-06-01":5,

"2026-06-02":3,

"2026-06-05":1

}
```

From this single structure we derive

* Total submissions
* Active days
* Longest yearly streak

This follows an important backend principle.

> Store only essential data.
>
> Derive inexpensive values at read time.

---

# Longest Yearly Streak

The backend sorts all activity dates.

```
2026-06-01

2026-06-02

2026-06-05

2026-06-06

2026-06-07
```

It then walks through the dates and counts consecutive days.

Result

```
Longest Streak

↓

3
```

This calculation is performed over a maximum of 366 entries.

The computational cost is negligible.

---

# Profile Response Builder

Instead of returning raw database documents, the backend builds a custom response.

Why?

Database schemas should not dictate API responses.

The frontend only receives the information it needs.

Example

```
{

user:{...},

stats:{...},

activity:{...}

}
```

This layer also computes derived fields before sending the response.

Keeping this transformation in one place makes future maintenance significantly easier.

---

# Separation of Responsibilities

The implementation follows a layered architecture.

## Controller

Responsible for

* Reading request parameters.
* Calling the service.
* Sending HTTP responses.

No business logic exists here.

---

## Service

Responsible for

* Fetching data.
* Handling missing records.
* Coordinating helper functions.

---

## Helper Functions

Responsible for isolated calculations.

Examples include

* Acceptance rate
* Activity summary
* Empty object generation

Each helper performs one task only.

---

## Response Builder

Responsible for converting raw database objects into frontend-ready JSON.

This separation keeps the code modular and easy to extend.

---

# Performance Analysis

Database Reads

```
3
```

Executed concurrently.

---

Maximum Activity Entries

```
366
```

Even for millions of users, each request processes only one year's activity for one user.

This keeps CPU usage extremely low.

---

Storage Complexity

```
One UserStats document

+

One UserActivity document per year
```

No daily activity documents are created.

This design remains efficient even at very large scale.

---

# Scalability

The architecture is designed to support future features without modification.

Examples include

* Contest statistics
* Badges
* Achievements
* Company progress
* Premium analytics
* AI insights

Additional sections can simply be added to the response builder without affecting the existing architecture.

---

# Final Workflow

```
Client

↓

GET /user/profile

↓

Controller

↓

Profile Service

↓

Promise.all()

↓

User

↓

UserStats

↓

UserActivity

↓

Fallback Objects

↓

Derived Calculations

↓

Profile Response Builder

↓

JSON Response

↓

Frontend
```

---

# Design Principles Followed

* Single Responsibility Principle
* Separation of Concerns
* Read Optimization
* Minimal Data Duplication
* Concurrent Database Access
* Frontend-Friendly API Design
* Event-Driven Statistics
* Scalable Storage Strategy

---

# Conclusion

The Fetch Profile API is designed to be a production-grade, scalable, and efficient aggregation endpoint.

By combining concurrent database reads, lightweight queries, derived calculations, and a dedicated response builder, the API delivers all information required by the profile page in a single request while keeping the backend modular and future-proof.

This architecture closely mirrors the responsiveness expected from modern coding platforms and provides a solid foundation for future profile-related features.

# Event-Driven User Analytics System

## Overview

The User Analytics subsystem is responsible for maintaining all user-related statistics that are derived from code submissions.

Examples include:

* Total submissions
* Accepted submissions
* Solved problems
* Difficulty-wise solved counts
* Daily activity heatmap
* Current streak
* Longest streak

This subsystem is completely **event-driven** and intentionally decoupled from the submission workflow.

---

# Why does this subsystem exist?

Whenever a user submits a solution, several statistics need to be updated.

For example:

* Increment total submissions
* Increment accepted submissions (if accepted)
* Add newly solved problems
* Update difficulty counters
* Update daily activity
* Update streak

A naïve implementation would perform all of these operations directly inside the `submitCode()` controller.

Example:


Submit Controller

↓

Save Submission

↓

Update User Stats

↓

Update Activity

↓

Update Streak

↓

Update Achievements

↓

Update Badges

↓

Update Notifications


Although this works initially, it violates one of the most important software engineering principles:

> A controller should orchestrate business logic, not contain it.

As the project grows, the controller would become extremely large and difficult to maintain.

---

# Why Event-Driven Architecture?

Instead of letting the controller perform every operation itself, the controller only announces that something important has happened.

That important event is:


Submission Completed


The controller does **not** decide what should happen next.

Instead, interested components subscribe to this event and perform their own work independently.

Current architecture:


Submit Controller

↓

Submission Saved

↓

Emit Event

↓

Submission Analytics Listener

↓

User Analytics Service


This keeps the controller extremely small while allowing the analytics system to evolve independently.

---

# Advantages of Event-Driven Design

## 1. Loose Coupling

The submission module knows nothing about analytics.

Similarly, the analytics module knows nothing about Judge0, authentication, or controllers.

The only communication happens through events.

---

## 2. Open-Closed Principle

Suppose we introduce achievements in the future.

Without events:


Submit Controller

↓

Update Achievements


The controller must be modified.

With events:

Submission Completed

↓

Achievement Listener


No existing code changes.

The system becomes open for extension while remaining closed for modification.

---

## 3. Maintainability

Each module owns its own responsibility.

Submission module:

* Execute submissions
* Save submissions

Analytics module:

* Update statistics
* Update activity
* Maintain streak

Achievements module:

* Award badges
* Unlock achievements

Notifications module:

* Send notifications

Every module remains independent.

---

## 4. Future Scalability

Currently, events are handled using Node.js EventEmitter.

Submission

↓

EventEmitter

↓

Listener


As traffic increases, the implementation can later be replaced with:

* BullMQ
* Redis Pub/Sub
* RabbitMQ
* Kafka
* AWS SNS/SQS

The business logic inside listeners remains unchanged.

Only the event transport changes.

This allows the project to evolve into a distributed architecture without rewriting the analytics system.

---

# Why User Statistics are stored separately?

The existing User collection only stores authentication-related information.


User

- username
- email
- password
- role


Analytics changes frequently.

Authentication data changes very rarely.

Mixing both concerns would produce an unnecessarily large document.

Instead, analytics is isolated into its own collection.

User

↓

UserStats


Benefits:

* Better separation of concerns
* Smaller user documents
* Easier future extensions
* Independent scaling

---

# UserStats Schema

The UserStats document stores long-term statistics.

UserStats

userId

totalSubmissions

acceptedSubmissions

solvedProblems[]

easySolved

mediumSolved

hardSolved

currentStreak

longestStreak

lastActiveDate


These values are frequently read from the profile page.

Keeping them precomputed allows profile pages to load instantly.

---

# Why store solved problems separately?

Instead of recomputing solved problems from every submission:

Submission Collection

↓

Scan Entire History

↓

Determine Solved Problems


we maintain an incremental list.


Accepted Submission

↓

Update solvedProblems[]


Reading the profile now becomes O(1).

---

# User Activity Design

The activity heatmap stores the number of submissions made each day.

Instead of creating one document per submission or one document per day, activity is grouped by year.


UserActivity

userId

year

activity


Example:


activity

{

"2026-06-27":5,

"2026-06-28":3

}


This design minimizes document count while supporting fast lookups.

---

# Why one document per year?

Alternative approaches considered:

### One document per submission

Rejected.

Too many documents.

---

### One document per day

Rejected.

Millions of unnecessary documents.

---

### One yearly document

Chosen.

Advantages:

* Maximum 1 document per user per year
* Small document count
* Efficient updates
* Efficient reads

---

# Updating Daily Activity

Activity uses MongoDB's atomic `$inc` operator.


$inc

↓

activity.2026-06-27

↓

+1


Advantages:

* No race conditions
* Atomic updates
* No read-modify-write cycle
* High concurrency support

---

# Updating Streak

The streak is stored inside UserStats because it represents long-term user progress.

Logic:

* First submission → streak becomes 1
* Same day submission → no change
* Consecutive day → increment streak
* Missed day → reset streak to 1

Dates are normalized before comparison to avoid timezone-related bugs.

---

# Analytics Workflow

Complete execution flow:

```
User submits solution

↓

Judge0 executes code

↓

Submission stored

↓

SubmissionCompleted Event emitted

↓

SubmissionAnalytics Listener

↓

ensureUserStats()

↓

updateSubmissionCounters()

↓

updateSolvedProblems()

↓

updateStreak()

↓

Save UserStats

↓

Update UserActivity


Notice that the submission itself has already been saved before analytics begins.

Analytics is a secondary concern.

The submission remains the source of truth.

---

# Concurrency Considerations

Several users may submit simultaneously.

To ensure consistency:

* UserStats creation uses atomic upsert.
* Activity uses MongoDB `$inc`.
* No read-modify-write cycles are used for counters.

This minimizes race conditions under heavy load.

---

# Design Principles Followed

* Single Responsibility Principle
* Open-Closed Principle
* Loose Coupling
* Event-Driven Architecture
* Database Designed Around Queries
* Incremental Aggregation
* Eventual Consistency
* Read Optimized Design

---

# Future Extensions

Because the analytics system is event-driven, new features can be added without modifying the submission controller.

Examples:

* Achievements
* Badges
* XP System
* Leaderboards
* Notifications
* Contest Statistics
* Company-wise Progress
* AI Performance Reports
* Personalized Learning Analytics

Each feature simply subscribes to the `SubmissionCompleted` event.

---

# Final Thoughts

The User Analytics subsystem was intentionally designed to prioritize:

* scalability
* maintainability
* extensibility
* performance
* clean separation of concerns

The submission remains the single source of truth, while analytics are derived asynchronously through events.

This architecture allows the platform to evolve from a simple online judge into a large-scale coding platform without requiring major architectural changes.

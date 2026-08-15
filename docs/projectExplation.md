## 5-Minute Demo Script – Internal Task & Management Dashboard

Hello everyone, and thank you for taking the time to review my assignment.

Today I will demonstrate the **Internal Task & Management Dashboard** that I built using **React, Node.js, Express, PostgreSQL, Prisma, and Docker**. The application includes **authentication, role-based access control, task management, comments, activity tracking, notifications, and external API integration**.

### Login

I will start by logging in as an **Admin** user.

As you can see, the application supports **three roles: Admin, Manager, and Member**. The role-based access control is fully implemented. **Admin and Manager users have permission to create and manage users**, while Members have limited access based on their assigned responsibilities.

### Creating users

After logging in, I will open the **Users** section.

Here I am creating a new **Manager** user and a **Member** user.

For demonstration purposes, the application automatically generates the password using **the first four letters of the user’s name and the last four digits of the phone number**.

This makes onboarding quick and easy while still demonstrating the authentication flow.

### Creating and assigning a task

Now I will go to the **Tasks** section.

Here I can create, edit, delete, search, filter, sort, and paginate tasks.

I will create a new task and assign it to the **Member** user.

I will enter the title, description, priority, due date, and assign the task to the Member.

After saving the task, it is immediately available in the system and the dashboard statistics are updated automatically.

### Member login

Now I will open the application in a **second browser window** and log in using the **Member’s email and generated password**.

After logging in, you can see that the Member has a different level of access according to the RBAC implementation.

### Notification

At the top of the interface, the Member receives a **notification indicating that a new task has been assigned**.

This demonstrates that task assignment events are being tracked and displayed to the user.

### Viewing assigned tasks

Next, I will open the **Tasks** page.

The Member can use the **Assigned to Me** filter, which displays only the tasks assigned to the currently logged-in user.

This allows team members to focus only on their own work.

### Updating task and comments

I will open the assigned task.

From the **Task Details** page, the Member can view the complete task information, including the description, assignee, priority, status, due date, and activity history.

The Member can also **add comments** to collaborate with the team.

I will add a comment now.

After submitting the comment, it appears immediately in the comments section and is also recorded in the **activity timeline**.

Now I will change the task status from **Pending to In Progress**.

The status update is saved successfully and a new activity entry is generated automatically.

This provides a complete audit trail of all important task changes.

### External API integration

Finally, I will demonstrate the **External Users API integration**, which was one of the assignment requirements.

I will open the **External Users** section.

Here the application fetches data from a public external API and displays the results inside the dashboard.

As you can see, **10 external user records are being loaded successfully**, which confirms that the external API integration, response handling, and data processing are fully implemented and working correctly.

### Conclusion

To summarize, this application includes:

* Secure **JWT authentication**
* **Role-based access control**
* User management
* Task creation and assignment
* Search, filtering, sorting, and pagination
* Comments and activity history
* Notifications
* Dashboard analytics
* External API integration
* A responsive and reusable React component architecture
* A modular backend using **Express, Prisma, and PostgreSQL**

Thank you for watching this demo. I appreciate your time and look forward to your feedback.

## Inspiration

The inspiration behind EduNet came from recognizing the need for a comprehensive platform to bridge the communication gap between students, parents, tutors, and administrators. We observed a lack of tools to effectively track student performance, grades, and improvements, as well as a need for a database system to efficiently assign tutors to specific classes.

## What it does

EduNet serves as a centralized platform where classes, tutors, students, and parents can be effortlessly managed. It provides intuitive controls to add, edit, and remove classes. Additionally, it streamlines the process of adding and managing tutors by automatically creating accounts and sending email notifications. When a student enrolls, it triggers the automatic creation of a parent account, ensuring instant connectivity.

- **Class Management**:
  - Effortlessly add, edit, and remove classes.
  - Intuitive controls for seamless management.
- **Tutor Management**:
  - Streamlined process for adding and managing tutors. - Automatic account creation for tutors with email notifications.
- **Student Enrollment**:
  - Triggers automatic parent account creation for instant connectivity.
- **Assessment and Grading**:
  - Tutors can input assessment grades for each student in every class.
- **Notes for Reference:**
  - Tutors can write notes for every student and class for future reference.
    **Communication Channels**:
  - In-app channels facilitate communication between parents, students, tutors, and administrators.
- **Grade and Progress Visibility**:
  - Students and parents can easily view grades and tutor's notes for every class.
  - Provides a visual representation of grades by class.
- **Parent Account Support**:
  - One parent account can manage multiple children's profiles.

## How we built it

We built EduNet using HTML and CSS exclusively, without relying on external libraries. This decision was made as a personal challenge, and it demonstrates our proficiency in crafting a user-friendly interface without additional frameworks.

For the backend, we deployed it on an AWS EC2 instance, utilizing a custom domain name. The frontend is hosted on Netlify, ensuring a seamless and reliable user experience.

## Challenges we ran into

1. **Developing a dynamic and asynchronous application without using libraries like React and Redux for state management**

   Creating a dynamic application with features like real-time updates, asynchronous data fetching, and interactive user interfaces without the assistance of modern JavaScript libraries like React and Redux presented a significant challenge.
   Ensuring smooth interactions and responsiveness across different components required meticulous attention to detail and a deep understanding of vanilla JavaScript.

2. **Implementing different views tailored to the needs of various stakeholders (admin, tutor, student)**

   Designing and implementing distinct user interfaces for administrators, tutors, and students was a complex task. Each user type had unique requirements, functionalities, and access levels.
   Balancing the user experience to provide an intuitive interface for each stakeholder, while maintaining a cohesive overall design, demanded careful planning and execution.

3. **Ensuring precise user access level control**

   Managing user access levels and permissions accurately was a crucial aspect of the application. It required creating a robust system to control what each user type could view, modify, and access within the platform.
   Implementing a granular access control system demanded thorough testing and validation to prevent unauthorized actions or data exposure.
   These challenges required a combination of in-depth technical knowledge, meticulous planning, and creative problem-solving to overcome. They also provided valuable learning opportunities and pushed us to enhance our skills in web development and user interface design.

## Accomplishments that we're proud of

We take pride in successfully creating a platform that addresses the specific needs we identified. The seamless integration of features such as class management, tutor assignment, and communication channels showcases our dedication to providing a comprehensive solution.

Successfully integrating a diverse set of features, such as class management, tutor assignment, grade tracking, and robust communication channels, showcased our team's prowess in creating a multifaceted platform that caters to various aspects of educational management.

## What we learned

The process of developing EduNet allowed us to deepen our understanding of HTML and CSS, reinforcing our skills in creating visually appealing and functional interfaces. Additionally, we gained valuable experience in deploying and managing the backend on an AWS EC2 instance.

## What's next for EduNet

One of the upcoming features we plan to implement is a scheduling system for tutors to prevent conflicts. This addition will further enhance the platform's efficiency and usability, ensuring a seamless experience for all users. We are committed to continuously improving EduNet and exploring opportunities for growth and expansion.

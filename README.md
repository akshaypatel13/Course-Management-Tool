# Course-Management-Tool
*CSCI-5409 Cloud Computing Group Project*

The Web application developed using NodeJS, ExpressJS and SailsJS MVC Framework deployed on various cloud computing platforms and support XA transactions between two or more platforms. The three standalone web application was developed named as Admin, Instructor and Student that are deployed on AWS Lambda, AWS Elastic BeanStalk and Azure Docker Containers. The sole purpose of the entire project to perform cross communication and analyze the impact of lack of standardization present among different cloud platforms. 

## Key Features
* User authentication and authorization
* Course Registration, Management and Administration
* Announcements
* REST APIs
* AWS Simple Notification Service
* Azure Docker Containers
* AWS Lambda - Serverless Computing
* XA transaction -  AWS Lambda and Azure

## Two Phase Commit Protocol

The project functional requirement consists to perform distributed transaction that needs to be reflected among three web application deployed on different cloud computing platform. The XA transactions enabled by the MySQL was used to implement two phase commit protocol where the instructor would initiate the transaction while enrolling the student to the course while reflect on both student(Add Course and announcements) and Administrator(Course Capacity) that will rollback the transaction in the case of seats over-capacity. 


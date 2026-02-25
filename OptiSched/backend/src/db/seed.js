import { db } from '../config/db.js';
import { faculty, students, subjects } from './schema.js';
import { hashPassword } from '../middleware/auth.js';

async function seedDatabase() {
  try {
    console.log('Seeding database...');

    // Insert faculty
    const facultyData = [
      {
        firstName: "EDGAR P.",
        lastName: "HABANA Jr",
        department: "Physical Education",
        password: await hashPassword("HABANA123"),
        birthday: new Date("1980-05-15"),
      },
      {
        firstName: "John Michael",
        lastName: "Calizon",
        department: "Computer Science",
        password: await hashPassword("CALIZON123"),
        birthday: new Date("1985-08-22"),
      },
      {
        firstName: "Psalmmirac Le Pineda",
        lastName: "MARIANO",
        department: "Computer Science",
        password: await hashPassword("MARIANO123"),
        birthday: new Date("1987-03-10"),
      },
      {
        firstName: "BEA ANGLY",
        lastName: "MAGNO",
        department: "Research",
        password: await hashPassword("MAGNO123"),
        birthday: new Date("1986-11-28"),
      },
      {
        firstName: "RENEIL P.",
        lastName: "ARNADO",
        department: "Business",
        password: await hashPassword("ARNADO123"),
        birthday: new Date("1984-07-12"),
      },
      {
        firstName: "EGNACIO Y",
        lastName: "ELLO Jr",
        department: "Work Immersion",
        password: await hashPassword("ELLO123"),
        birthday: new Date("1983-09-05"),
      },
    ];

    const insertedFaculty = await db.insert(faculty).values(facultyData).returning();
    console.log(`Inserted ${insertedFaculty.length} faculty members`);

    // Insert students
    const studentData = [
      {
        firstName: "Juan",
        lastName: "Dela Cruz",
        password: await hashPassword("DELA CRUZ123"),
        birthday: new Date("2005-02-14"),
      },
      {
        firstName: "Maria",
        lastName: "Santos",
        password: await hashPassword("SANTOS123"),
        birthday: new Date("2005-06-20"),
      },
    ];

    const insertedStudents = await db.insert(students).values(studentData).returning();
    console.log(`Inserted ${insertedStudents.length} students`);

    // Insert subjects
    const subjectData = [
      {
        name: "Physical Education and Health 4",
        teacherId: insertedFaculty[0].id,
        day: "Monday",
        time: "7:00 AM - 9:00 AM",
        color: "#10b981",
      },
      {
        name: "Computer/Web Programming 6 - Computer Programming NC III (.NET Technology)",
        teacherId: insertedFaculty[1].id,
        day: "Monday",
        time: "10:00 AM - 1:00 PM",
        color: "#3b82f6",
      },
      {
        name: "Mobile App Programming 2",
        teacherId: insertedFaculty[2].id,
        day: "Monday",
        time: "1:00 PM - 4:00 PM",
        color: "#8b5cf6",
      },
      {
        name: "Contemporary Arts from the regions",
        teacherId: insertedFaculty[0].id,
        day: "Tuesday",
        time: "10:00 AM - 1:00 PM",
        color: "#ec4899",
      },
      {
        name: "Homeroom",
        teacherId: insertedFaculty[0].id,
        day: "Tuesday",
        time: "2:00 PM - 4:00 PM",
        color: "#f59e0b",
      },
      {
        name: "Work Immersion-Practicum Type",
        teacherId: insertedFaculty[5].id,
        day: "Tuesday",
        time: "2:00 PM - 4:00 PM",
        color: "#ef4444",
      },
      {
        name: "Inquiries Investigation and Immersion",
        teacherId: insertedFaculty[3].id,
        day: "Tuesday & Thursday",
        time: "8:30 AM - 10:00 AM",
        color: "#06b6d4",
      },
      {
        name: "Empowerment Technologies: ICT",
        teacherId: insertedFaculty[1].id,
        day: "Thursday",
        time: "10:00 AM - 1:00 PM",
        color: "#3b82f6",
      },
      {
        name: "Entrepreneurship",
        teacherId: insertedFaculty[4].id,
        day: "Thursday",
        time: "2:30 PM - 5:20 PM",
        color: "#84cc16",
      },
    ];

    const insertedSubjects = await db.insert(subjects).values(subjectData).returning();
    console.log(`Inserted ${insertedSubjects.length} subjects`);

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Faculty login (HABANA): lastName="HABANA Jr", password="HABANA123"');
    console.log('Faculty login (Calizon): lastName="Calizon", password="CALIZON123"');
    console.log('Student login (Dela Cruz): lastName="Dela Cruz", password="DELA CRUZ123"');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();

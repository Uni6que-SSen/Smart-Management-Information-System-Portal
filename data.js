/**
 * PARUL UNIVERSITY ERP - MASTER DATA STORE & INITIAL SEEDS
 * Includes Master Enrollment DB, Faculty DB, Courses, Roster, Attendance, Grades, Outpasses, Audit Trail.
 */

const PU_DATA = {
  // Master Student Enrollment Database for Registration Verification
  masterEnrollments: [
    { enrollmentNo: "210303105001", name: "Aarav Mehta", program: "B.Tech CSE", semester: 6, section: "6A", registered: true },
    { enrollmentNo: "210303105002", name: "Diya Sharma", program: "B.Tech CSE", semester: 6, section: "6A", registered: true },
    { enrollmentNo: "210303105003", name: "Rohan Patel", program: "B.Tech CSE", semester: 6, section: "6A", registered: true },
    { enrollmentNo: "210303105004", name: "Ananya Iyer", program: "B.Tech CSE", semester: 6, section: "6B", registered: true },
    { enrollmentNo: "210303105005", name: "Kabir Verma", program: "B.Tech CSE", semester: 6, section: "6B", registered: true },
    { enrollmentNo: "210303105099", name: "Pooja Desai", program: "B.Tech CSE", semester: 6, section: "6B", registered: true }
  ],

  // Master Faculty Database for Registration Verification
  masterFacultyIds: [
    { employeeId: "PU-FAC-3310", name: "Mr. Pritam Samanta", department: "Parul Institute of Computer Application (PICA)", designation: "Assistant Professor & Senior Proctor", registered: true },
    { employeeId: "PU-FAC-8821", name: "Dr. Rajesh Sharma", department: "Computer Science & Engineering", designation: "Associate Professor & Senior Proctor", registered: true },
    { employeeId: "PU-FAC-4019", name: "Prof. Ananya Patel", department: "Computer Science & Engineering", designation: "Assistant Professor", registered: true },
    { employeeId: "PU-FAC-7102", name: "Dr. Vikramaditya Joshi", department: "Artificial Intelligence", designation: "Professor", registered: true },
    { employeeId: "PU-FAC-5520", name: "Prof. Sneha Kulkarni", department: "Information Technology", designation: "Assistant Professor", registered: true }
  ],

  // Faculty Accounts & Complete Profiles with Login Credentials
  faculties: [
    {
      id: "fac-1",
      employeeId: "PU-FAC-8821",
      facultyId: "PU-FAC-8821",
      name: "Dr. Rajesh Sharma",
      email: "rajesh.sharma@paruluniversity.ac.in",
      personalEmail: "rajesh.sharma.phd@gmail.com",
      phone: "+91 98251 88210",
      intercom: "Ext. 4088 (FET CSE Block A, Level 4)",
      password: "password123",
      altPassword: "Faculty@123",
      initialPassword: "Faculty@123",
      passwordGeneratedBy: "Department Head (HOD CSE) / System Administrator",
      passwordGeneratedDate: "2017-07-15",
      designation: "Associate Professor & Senior Proctor",
      department: "Computer Science & Engineering",
      institute: "Faculty of Engineering & Technology (FET)",
      instituteName: "Faculty of Engineering & Technology (FET), Parul University",
      instituteUrl: "https://paruluniversity.ac.in",
      institutePortalUrl: "https://smis.paruluniversity.ac.in",
      instituteId: "PU-FET-VADODARA-104",
      role: "FACULTY",
      isProctor: true,
      avatarText: "RS",
      photoUrl: "",
      dateOfJoining: "15 July 2017",
      fatherName: "Prof. Omprakash Sharma",
      motherName: "Mrs. Shanti Sharma",
      dob: "1982-04-18",
      gender: "Male",
      maritalStatus: "Married",
      bloodGroup: "B+ Positive",
      nationality: "Indian",
      residentialAddress: "B-402, Faculty Enclave, Parul University Campus, Post Limda, Waghodia, Vadodara, Gujarat - 391760",
      permanentAddress: "Flat 12, Nilamber Greens, Vasna-Bhayli Main Road, Vadodara, Gujarat - 390015",
      emergencyContact: "Mrs. Sunita Sharma (Spouse) - +91 98251 44520",
      twoFactorAuth: "Enabled (PU Authenticator & SMS OTP)",
      lastLogin: "Today, 08:51:24 AM IST (Campus LAN 172.16.14.88 Verified)",
      qualifications: [
        {
          degree: "Ph.D. in Computer Science & Engineering",
          institution: "Indian Institute of Technology (IIT) Bombay",
          year: "2016",
          specialization: "Cloud Architectures, Distributed Systems & Fault Tolerance",
          thesis: "Adaptive Resource Provisioning and SLA Enforcement in Heterogeneous Cloud Environments",
          grade: "Doctoral Degree with Excellence Citation"
        },
        {
          degree: "M.Tech in Computer Engineering",
          institution: "Veermata Jijabai Technological Institute (VJTI), Mumbai",
          year: "2011",
          specialization: "Software Systems, High-Performance Computing & Network Security",
          grade: "First Class with Distinction (Institute Gold Medalist, 9.42 CGPA)"
        },
        {
          degree: "B.E. in Computer Science & Engineering",
          institution: "The Maharaja Sayajirao University of Baroda (MSU)",
          year: "2008",
          specialization: "Computer Science & Engineering",
          grade: "First Class with Distinction (84.6% Aggregate)"
        }
      ],
      certifications: [
        "AWS Certified Solutions Architect – Professional (SAP-C02)",
        "NVIDIA Deep Learning Institute (DLI) University Ambassador",
        "Google Cloud Certified Professional Cloud Architect",
        "UGC-NET Qualified with Junior Research Fellowship (JRF)"
      ],
      totalExperience: "18.2 Years (14.5 Years University Teaching, 3.7 Years Industry R&D)",
      experienceHistory: [
        {
          designation: "Associate Professor & Senior Proctor",
          organization: "Faculty of Engineering & Technology, Parul University",
          period: "Jul 2021 – Present",
          duration: "5+ Years",
          responsibilities: "Post-graduate & undergraduate courses in Cloud & Web Technologies, Chief Proctorial Student Mentoring, Capstone Industry Guide, NBA Criteria 3 Coordinator."
        },
        {
          designation: "Assistant Professor (Senior Grade)",
          organization: "Faculty of Engineering & Technology, Parul University",
          period: "Jul 2017 – Jun 2021",
          duration: "4 Years",
          responsibilities: "Curriculum Design & Syllabi Revision, Department Examination Coordinator, CoE IoT Cloud Computing Lab Lead, Student Outpass / Gatepass Proctor."
        },
        {
          designation: "Assistant Professor",
          organization: "Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat",
          period: "Jul 2012 – Jun 2017",
          duration: "5 Years",
          responsibilities: "UG/PG Teaching, Operating Systems Laboratory, Distributed Computing Systems Research Lab Development, M.Tech Thesis Guidance."
        },
        {
          designation: "Senior Systems Engineer / R&D Specialist",
          organization: "Tata Consultancy Services (TCS Innovation Labs), Pune",
          period: "Aug 2008 – Jul 2010",
          duration: "2 Years",
          responsibilities: "Enterprise Multi-Tenant Cloud Migration, Distributed In-Memory Cache Optimization, High-Concurrency Benchmarking."
        }
      ],
      teachingWorkload: {
        totalWeeklyHours: 18,
        aicteNorm: "16 - 18 Hours / Week (Associate Professor Norm)",
        complianceStatus: "100% Compliant (AICTE / UGC Regulations)",
        breakdown: [
          { type: "Theory Lectures", hours: 8, description: "4 Classroom slots (CS601 & CS605 across Div 6A & 6B)" },
          { type: "Laboratory Practical Sessions", hours: 8, description: "4 Hands-on Lab Batches (Advanced Web & Cloud Architectures)" },
          { type: "Capstone Mentorship & Tutorials", hours: 2, description: "Weekly Guided Project Review & Remedial Mentorship" }
        ]
      },
      assignedCourses: [
        { code: "CS601", title: "Advanced Web Technologies", credits: 4, type: "Core Theory + Lab", division: "6A & 6B", studentsCount: 130, contactHours: "5 Hrs/Wk", venue: "Hall FET-204 / Web Tech Lab 304" },
        { code: "CS605", title: "Cloud Computing Architecture", credits: 4, type: "Core Theory + Lab", division: "6A & 6B", studentsCount: 130, contactHours: "5 Hrs/Wk", venue: "Hall FET-205 / Cloud Lab 306" },
        { code: "CS606", title: "High-Performance Distributed Systems", credits: 3, type: "Professional Elective", division: "6A", studentsCount: 65, contactHours: "5 Hrs/Wk", venue: "Seminar Hall 1 / HPC Lab" },
        { code: "PRJ601", title: "Capstone Industry Project Mentorship", credits: 6, type: "Practical Project", division: "6A & 6B", studentsCount: 22, contactHours: "3 Hrs/Wk", venue: "Innovation CoE Block" }
      ],
      teachingSchedule: [
        { day: "Monday", time: "10:00 AM - 11:00 AM", course: "CS601 (Theory)", division: "Div 6A", venue: "Hall 204" },
        { day: "Monday", time: "11:15 AM - 01:15 PM", course: "CS601 (Lab Practical)", division: "Batch A1", venue: "Lab 304" },
        { day: "Tuesday", time: "09:00 AM - 10:00 AM", course: "CS605 (Theory)", division: "Div 6B", venue: "Hall 205" },
        { day: "Tuesday", time: "02:00 PM - 04:00 PM", course: "CS605 (Cloud Lab)", division: "Batch B1", venue: "Cloud Lab 306" },
        { day: "Wednesday", time: "10:00 AM - 11:00 AM", course: "CS601 (Theory)", division: "Div 6B", venue: "Hall 204" },
        { day: "Wednesday", time: "11:15 AM - 12:15 PM", course: "CS606 (Theory)", division: "Div 6A", venue: "Hall 202" },
        { day: "Thursday", time: "09:00 AM - 11:00 AM", course: "CS601 (Lab Practical)", division: "Batch A2", venue: "Lab 304" },
        { day: "Thursday", time: "02:00 PM - 04:00 PM", course: "PRJ601 (Capstone Guide)", division: "Teams T1-T5", venue: "Innovation CoE" },
        { day: "Friday", time: "10:00 AM - 11:00 AM", course: "CS605 (Theory)", division: "Div 6A", venue: "Hall 205" },
        { day: "Friday", time: "02:00 PM - 04:00 PM", course: "CS605 (Cloud Lab)", division: "Batch B2", venue: "Cloud Lab 306" }
      ],
      researchMetrics: {
        totalPublications: 34,
        scopusIndexed: 24,
        sciScieIndexed: 8,
        ugcCare: 2,
        citations: 942,
        hIndex: 16,
        i10Index: 22,
        scopusAuthorId: "57201948821",
        orcidId: "0000-0002-8419-7721",
        googleScholarUrl: "https://scholar.google.com/citations?user=PUFAC8821"
      },
      publications: [
        {
          title: "Dynamic SLA-Aware Virtual Machine Consolidation in Distributed Cloud Datacenters",
          journal: "IEEE Transactions on Cloud Computing (TCC)",
          year: "2024",
          volume: "Vol. 12, Issue 3, pp. 1102-1115",
          doi: "10.1109/TCC.2024.3382910",
          index: "SCI / Scopus Q1 (IF: 6.5)",
          citations: 48
        },
        {
          title: "Edge-Assisted Federated Learning Framework for Industrial IoT Anomaly Detection",
          journal: "Elsevier Journal of Systems Architecture",
          year: "2023",
          volume: "Vol. 142, Article 102941",
          doi: "10.1016/j.sysarc.2023.102941",
          index: "SCI / Scopus Q1 (IF: 4.5)",
          citations: 62
        },
        {
          title: "Fault-Tolerant Microservices Orchestration Using Predictive Reinforcement Learning",
          journal: "Springer Computing",
          year: "2023",
          volume: "Vol. 105, pp. 2489-2511",
          doi: "10.1007/s00607-023-01188-7",
          index: "SCIE / Scopus Q2 (IF: 3.8)",
          citations: 34
        },
        {
          title: "Energy-Efficient Resource Scheduling for Hybrid Multi-Cloud Academic Management Systems",
          journal: "International Journal of Information Technology (IJIT - Springer)",
          year: "2022",
          volume: "Vol. 14, pp. 3121-3132",
          doi: "10.1007/s41870-022-00994-x",
          index: "Scopus / UGC CARE",
          citations: 29
        },
        {
          title: "Biometric and RFID-Based Secure Campus Gatepass Verification with Edge Compute",
          journal: "IEEE Access",
          year: "2021",
          volume: "Vol. 9, pp. 88120-88132",
          doi: "10.1109/ACCESS.2021.3089412",
          index: "SCIE / Scopus Q1 (IF: 3.9)",
          citations: 78
        }
      ],
      books: [
        {
          title: "Cloud Computing Principles and Multi-Tenant Architectures",
          publisher: "McGraw Hill Education (India)",
          isbn: "978-93-898-1240-1",
          year: "2024 (2nd Edition)",
          role: "Sole Author",
          pages: 480,
          description: "Comprehensive textbook adopted across 14 state technical universities covering hypervisors, container orchestration, and serverless architectures."
        },
        {
          title: "High-Performance Distributed Systems: Algorithms and Cloud Practice",
          publisher: "CRC Press / Taylor & Francis Group",
          isbn: "978-03-677-4501-8",
          year: "2022",
          role: "Co-Author with Prof. A. K. Banerjee",
          pages: 368,
          description: "Graduate-level reference on distributed consensus (Paxos, Raft), gossip protocols, and fault-tolerant data stores."
        }
      ],
      bookChapters: [
        {
          chapterTitle: "Edge Computing Architectures for Smart Campus Management Systems",
          bookTitle: "Next-Generation Smart Systems and Internet of Things",
          publisher: "Springer Nature Singapore",
          year: "2023",
          pages: "pp. 145-168",
          isbn: "978-981-19-4500-2"
        },
        {
          chapterTitle: "Privacy-Preserving Federated Intelligence in Cloud-Fog Infrastructures",
          bookTitle: "Advances in Cloud and Cyber-Physical Security",
          publisher: "Elsevier Academic Press",
          year: "2022",
          pages: "pp. 89-114",
          isbn: "978-01-282-3901-5"
        },
        {
          chapterTitle: "SLA-Constrained Container Orchestration for Enterprise Workloads",
          bookTitle: "Modern Containerized Cloud Systems",
          publisher: "Wiley-IEEE Press",
          year: "2021",
          pages: "pp. 210-235",
          isbn: "978-11-197-8890-4"
        },
        {
          chapterTitle: "Decentralized Academic Credential Verification via Permissioned Blockchain",
          bookTitle: "Blockchain for Smart Academic Governance",
          publisher: "De Gruyter",
          year: "2020",
          pages: "pp. 67-88",
          isbn: "978-31-106-9920-1"
        }
      ],
      conferences: [
        {
          title: "Predictive Autoscaling in Multi-Tenant Kubernetes Clusters using LSTM Networks",
          conference: "IEEE 19th India Council International Conference (INDICON 2024)",
          location: "IIT Kharagpur",
          year: "2024",
          pages: "pp. 1-6",
          doi: "10.1109/INDICON60021.2024.10448102"
        },
        {
          title: "Low-Latency Edge Gateway for Real-Time Campus Gatepass Authorization",
          conference: "IEEE International Conference on Electronics, Computing and Communication (CONECCT)",
          location: "Bangalore",
          year: "2023",
          pages: "pp. 1-6"
        },
        {
          title: "Comparative Evaluation of Serverless Functions across AWS Lambda and OpenFaaS",
          conference: "ACM India Joint International Conference on Data Science & Management (CoDS-COMAD)",
          location: "IIT Bombay",
          year: "2022",
          pages: "pp. 280-285"
        },
        {
          title: "Autonomous Proctorial Risk Evaluation Engine using Random Forest Classifiers",
          conference: "Springer International Conference on Advances in Computing & Communications (ICACC)",
          location: "Kochi",
          year: "2021",
          pages: "pp. 512-524"
        }
      ],
      patents: [
        {
          patentNo: "202321048821 A",
          title: "AI-Driven Real-time Dynamic Resource Throttler for Virtualized Cloud Edge Nodes",
          status: "Published & Commercialized",
          statusBadge: "badge-success",
          filingDate: "2023-07-28",
          publicationDate: "2023-11-17",
          office: "Indian Patent Office (Govt. of India)",
          inventors: "Dr. Rajesh Sharma, Prof. Ananya Patel",
          abstract: "Automated dynamic hypervisor CPU/memory reallocation circuit reacting to sub-millisecond edge telemetry spikes."
        },
        {
          patentNo: "202121012904 A",
          title: "Automated Biometric and Radio-Frequency Student Verification Gateway with Edge Processing",
          status: "Granted (Patent #418290)",
          statusBadge: "badge-gold",
          filingDate: "2021-03-24",
          grantDate: "2023-01-19",
          office: "Indian Patent Office (Govt. of India)",
          inventors: "Dr. Rajesh Sharma, Dr. Vikramaditya Joshi",
          abstract: "Dual-modality security gate verifying encrypted RFID student tags alongside biometric face recognition hashes."
        },
        {
          patentNo: "202421008712 A",
          title: "Decentralized Smart Management Information System Framework for Academic Governance",
          status: "Published (Under Examination)",
          statusBadge: "badge-info",
          filingDate: "2024-02-08",
          publicationDate: "2024-04-12",
          office: "Indian Patent Office (Govt. of India)",
          inventors: "Dr. Rajesh Sharma",
          abstract: "Role-based cryptographic ledger ensuring tamper-evident academic grade transcripts and student attendance logs."
        }
      ],
      awards: [
        {
          title: "Best Faculty Researcher of the Year 2024-25",
          authority: "Parul University Annual Academic Excellence Awards",
          year: "2025",
          citation: "Awarded for outstanding research excellence, publishing 8 SCI journal papers, and securing 2 patents in distributed cloud computing."
        },
        {
          title: "Distinguished Educator & Academic Leadership Award",
          authority: "Computer Society of India (CSI)",
          year: "2023",
          citation: "Conferred for transformative pedagogical methods, hands-on cloud labs, and high graduate placement success."
        },
        {
          title: "Outstanding IEEE Branch Counselor Award",
          authority: "IEEE Gujarat Section",
          year: "2022",
          citation: "Recognized for spearheading the IEEE Student Branch with 240+ student members and organizing 18 state-level technical symposia."
        },
        {
          title: "UGC Junior & Senior Research Fellowship (JRF/SRF)",
          authority: "University Grants Commission (Govt. of India)",
          year: "2011 – 2016",
          citation: "National competitive doctoral research fellowship for advanced research in scalable cloud architectures at IIT Bombay."
        }
      ],
      memberships: [
        {
          organization: "Institute of Electrical and Electronics Engineers (IEEE)",
          membershipGrade: "Senior Member (SMIEEE)",
          membershipId: "92841058",
          status: "Active (Life / Senior)",
          validThru: "2030",
          badge: "badge-primary"
        },
        {
          organization: "Indian Society for Technical Education (ISTE)",
          membershipGrade: "Life Member (LMISTE)",
          membershipId: "LM-114208",
          status: "Life Membership",
          validThru: "Permanent",
          badge: "badge-gold"
        },
        {
          organization: "Institution of Engineers India (IEI)",
          membershipGrade: "Fellow of Institution of Engineers (FIE)",
          membershipId: "F-120984/CP",
          status: "Fellow Grade",
          validThru: "Permanent",
          badge: "badge-success"
        },
        {
          organization: "Association for Computing Machinery (ACM)",
          membershipGrade: "Professional Member",
          membershipId: "ACM-7740192",
          status: "Active Member",
          validThru: "2027",
          badge: "badge-info"
        }
      ],
      consultancyProjects: [
        {
          projectTitle: "Smart Campus IoT Energy Optimization & Peak Load Balancer",
          fundingAgency: "Gujarat Council on Science & Technology (GUJCOST) & DST Gujarat",
          grantAmount: "₹18,50,000",
          sanctionOrder: "GUJCOST/MRP/2023/4412",
          role: "Principal Investigator (PI)",
          duration: "2023 – 2026 (36 Months)",
          status: "Active / Ongoing",
          statusBadge: "badge-success",
          outcome: "Real-time edge sensor grid deployed across 12 academic blocks of Parul University, shaving 14.2% off peak campus grid load."
        },
        {
          projectTitle: "Industrial Predictive Fault Diagnosis Engine for High-Voltage Switchgear",
          fundingAgency: "L&T Technology Services (LTTS) Vadodara",
          grantAmount: "₹8,20,000",
          sanctionOrder: "LTTS/IND-CONSULT/2022/88",
          role: "Chief Technical Consultant / Lead Investigator",
          duration: "2022 – 2023 (12 Months)",
          status: "Completed & Deployed",
          statusBadge: "badge-gold",
          outcome: "Edge-based acoustic and thermal anomaly classifier deployed across L&T manufacturing plants in Hazira and Vadodara."
        }
      ],
      courses: ["CS601", "CS605", "CS606"],
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYWMtMSIsInJvbGUiOiJGQUNVTFRZIiwiaWF0IjoxNzg0MDAwMDAwfQ"
    },
    {
      id: "fac-2",
      employeeId: "PU-FAC-4019",
      name: "Prof. Ananya Patel",
      email: "ananya.patel@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Faculty@123",
      designation: "Assistant Professor",
      department: "Computer Science & Engineering",
      role: "FACULTY",
      isProctor: true,
      avatarText: "AP",
      courses: ["CS602"],
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYWMtMiIsInJvbGUiOiJGQUNVTFRZIiwiaWF0IjoxNzg0MDAwMDAwfQ"
    },
    {
      id: "fac-3",
      employeeId: "PU-FAC-7102",
      name: "Dr. Vikramaditya Joshi",
      email: "vikram.joshi@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Faculty@123",
      designation: "Professor",
      department: "Artificial Intelligence",
      role: "FACULTY",
      isProctor: true,
      avatarText: "VJ",
      courses: ["CS603", "CS606"],
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYWMtMyIsInJvbGUiOiJGQUNVTFRZIiwiaWF0IjoxNzg0MDAwMDAwfQ"
    },
    {
      id: "fac-4",
      employeeId: "PU-FAC-5520",
      name: "Prof. Sneha Kulkarni",
      email: "sneha.kulkarni@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Faculty@123",
      designation: "Assistant Professor",
      department: "Information Technology",
      role: "FACULTY",
      isProctor: false,
      avatarText: "SK",
      courses: ["CS604"],
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYWMtNCIsInJvbGUiOiJGQUNVTFRZIiwiaWF0IjoxNzg0MDAwMDAwfQ"
    }
  ],

  // Academic Courses & Allocations
  courses: [
    { code: "CS601", title: "Advanced Operating Systems", credits: 4, faculty: "Dr. Rajesh Sharma", facultyId: "PU-FAC-8821", department: "CSE", totalHours: 42 },
    { code: "CS602", title: "Cloud Computing Architecture", credits: 4, faculty: "Prof. Ananya Patel", facultyId: "PU-FAC-4019", department: "CSE", totalHours: 40 },
    { code: "CS603", title: "Machine Learning & Pattern Recog.", credits: 4, faculty: "Dr. Vikramaditya Joshi", facultyId: "PU-FAC-7102", department: "CSE", totalHours: 44 },
    { code: "CS604", title: "Full Stack Web Engineering", credits: 3, faculty: "Prof. Sneha Kulkarni", facultyId: "PU-FAC-5520", department: "CSE", totalHours: 36 },
    { code: "CS605", title: "Distributed Database Systems", credits: 3, faculty: "Dr. Rajesh Sharma", facultyId: "PU-FAC-8821", department: "CSE", totalHours: 38 },
    { code: "CS606", title: "Artificial Intelligence Lab", credits: 2, faculty: "Dr. Vikramaditya Joshi", facultyId: "PU-FAC-7102", department: "CSE", totalHours: 28 }
  ],

  // Student Accounts & Complete Profiles with Login Credentials
  students: [
    {
      id: "std-1",
      enrollmentNo: "210303105001",
      rollNo: "CSE-21-001",
      name: "Aarav Mehta",
      email: "aarav.mehta@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Student@123",
      phone: "+91 98251 12345",
      dob: "2003-08-14",
      gender: "Male",
      bloodGroup: "O+ Positive",
      nationality: "Indian",
      homeAddress: "Plot 42, Sunrise Greens, Gotri Road, Vadodara, Gujarat - 390021",
      parentPhone: "+91 98251 67890",
      parentEmail: "suresh.mehta@gmail.com",
      fatherName: "Mr. Sureshchandra Mehta",
      motherName: "Mrs. Geetaben Mehta",
      guardianName: "Mr. Sureshchandra Mehta",
      guardianRelation: "Father",
      guardianOccupation: "Senior Executive Engineer, GSECL",
      emergencyContactName: "Mr. Sureshchandra Mehta (Father)",
      emergencyPhone: "+91 98251 67890",
      emergencyAddress: "Plot 42, Sunrise Greens, Gotri Road, Vadodara, Gujarat - 390021",
      admissionYear: "2021",
      admissionCategory: "Merit Quota (ACPC Gujarat)",
      currentClass: "B.Tech Computer Science & Engineering (Semester 6)",
      enrollmentStatus: "Active Regular Student",
      documents: [
        {
          id: "DOC-PU-01",
          title: "Higher Secondary (12th Grade) Official Marksheet",
          type: "Previous Transcript",
          fileName: "12th_HSC_Board_Transcript_Aarav.pdf",
          fileSize: "2.4 MB",
          uploadDate: "2021-07-15",
          uploadedBy: "Admin / Admissions Office",
          status: "Verified & Approved",
          statusBadge: "badge-success",
          icon: "📑"
        },
        {
          id: "DOC-PU-02",
          title: "Secondary School Certificate (10th Board)",
          type: "Previous Transcript",
          fileName: "10th_SSC_Board_Certificate.pdf",
          fileSize: "1.8 MB",
          uploadDate: "2021-07-15",
          uploadedBy: "Admin / Admissions Office",
          status: "Verified & Approved",
          statusBadge: "badge-success",
          icon: "📜"
        },
        {
          id: "DOC-PU-03",
          title: "Municipal Birth Certificate",
          type: "Birth Certificate",
          fileName: "Birth_Certificate_Govt_Gujarat.pdf",
          fileSize: "1.1 MB",
          uploadDate: "2021-07-16",
          uploadedBy: "Student Uploaded",
          status: "Verified & Approved",
          statusBadge: "badge-success",
          icon: "🪪"
        },
        {
          id: "DOC-PU-04",
          title: "Institutional School Leaving & Transfer Certificate (TC)",
          type: "Transfer Certificate",
          fileName: "School_Transfer_Certificate_TC.pdf",
          fileSize: "1.5 MB",
          uploadDate: "2021-07-18",
          uploadedBy: "Student Uploaded",
          status: "Verified & Approved",
          statusBadge: "badge-success",
          icon: "🎓"
        },
        {
          id: "DOC-PU-05",
          title: "Semester 5 Statement of Grades & Marksheet",
          type: "Previous Transcript",
          fileName: "PU_BTech_CSE_Sem5_Marksheet.pdf",
          fileSize: "3.1 MB",
          uploadDate: "2026-01-20",
          uploadedBy: "Admin / Examination Cell",
          status: "Verified & Approved",
          statusBadge: "badge-success",
          icon: "📊"
        }
      ],
      institute: "Faculty of Engineering & Technology (FET)",
      program: "B.Tech Computer Science & Engineering",
      semester: 6,
      section: "6A",
      division: "CSE-6A",
      batch: "1",
      hostel: "Tagore Bhavan, Room 304",
      avatarText: "AM",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdGQtMSIsInJvbGUiOiJTVFVERU5UIn0",
      attendanceStats: {
        "CS601": { held: 38, attended: 34, title: "Advanced Operating Systems" },
        "CS602": { held: 36, attended: 29, title: "Cloud Computing Architecture" },
        "CS603": { held: 40, attended: 36, title: "Machine Learning & Pattern Recog." },
        "CS604": { held: 32, attended: 28, title: "Full Stack Web Engineering" },
        "CS605": { held: 34, attended: 29, title: "Distributed Database Systems" },
        "CS606": { held: 24, attended: 22, title: "Artificial Intelligence Lab" }
      },
      grades: {
        semester: 6,
        academicYear: "2025-2026",
        isPublished: true,
        items: [
          { code: "CS601", title: "Advanced Operating Systems", credits: 4, internal: 38, midSem: 19, endSem: 37, total: 94, grade: "O", gradePoint: 10 },
          { code: "CS602", title: "Cloud Computing Architecture", credits: 4, internal: 35, midSem: 18, endSem: 35, total: 88, grade: "A+", gradePoint: 9 },
          { code: "CS603", title: "Machine Learning & Pattern Recog.", credits: 4, internal: 36, midSem: 19, endSem: 38, total: 93, grade: "O", gradePoint: 10 },
          { code: "CS604", title: "Full Stack Web Engineering", credits: 3, internal: 37, midSem: 17, endSem: 36, total: 90, grade: "A+", gradePoint: 9 },
          { code: "CS605", title: "Distributed Database Systems", credits: 3, internal: 34, midSem: 18, endSem: 34, total: 86, grade: "A+", gradePoint: 9 },
          { code: "CS606", title: "Artificial Intelligence Lab", credits: 2, internal: 39, midSem: 19, endSem: 38, total: 96, grade: "O", gradePoint: 10 }
        ],
        summary: { totalCredits: 20, earnedCredits: 20, sgpa: 9.50, cgpa: 9.18, result: "PASSED - FIRST CLASS WITH DISTINCTION" }
      }
    },
    {
      id: "std-2",
      enrollmentNo: "210303105002",
      rollNo: "CSE-21-002",
      name: "Diya Sharma",
      email: "diya.sharma@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Student@123",
      phone: "+91 98251 22345",
      program: "B.Tech Computer Science & Engineering",
      semester: 6,
      section: "6A",
      hostel: "Sarojini Bhavan, Room 212",
      avatarText: "DS",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdGQtMiIsInJvbGUiOiJTVFVERU5UIn0",
      attendanceStats: {
        "CS601": { held: 38, attended: 35 },
        "CS602": { held: 36, attended: 32 },
        "CS603": { held: 40, attended: 37 },
        "CS604": { held: 32, attended: 30 },
        "CS605": { held: 34, attended: 31 },
        "CS606": { held: 24, attended: 23 }
      },
      grades: {
        semester: 6,
        academicYear: "2025-2026",
        isPublished: true,
        items: [
          { code: "CS601", title: "Advanced Operating Systems", credits: 4, internal: 36, midSem: 18, endSem: 36, total: 90, grade: "A+", gradePoint: 9 },
          { code: "CS602", title: "Cloud Computing Architecture", credits: 4, internal: 37, midSem: 19, endSem: 36, total: 92, grade: "O", gradePoint: 10 },
          { code: "CS603", title: "Machine Learning & Pattern Recog.", credits: 4, internal: 35, midSem: 18, endSem: 35, total: 88, grade: "A+", gradePoint: 9 },
          { code: "CS604", title: "Full Stack Web Engineering", credits: 3, internal: 38, midSem: 19, endSem: 37, total: 94, grade: "O", gradePoint: 10 },
          { code: "CS605", title: "Distributed Database Systems", credits: 3, internal: 36, midSem: 18, endSem: 35, total: 89, grade: "A+", gradePoint: 9 },
          { code: "CS606", title: "Artificial Intelligence Lab", credits: 2, internal: 38, midSem: 19, endSem: 38, total: 95, grade: "O", gradePoint: 10 }
        ],
        summary: { totalCredits: 20, earnedCredits: 20, sgpa: 9.35, cgpa: 9.15, result: "PASSED - FIRST CLASS WITH DISTINCTION" }
      }
    },
    {
      id: "std-3",
      enrollmentNo: "210303105003",
      rollNo: "CSE-21-003",
      name: "Rohan Patel",
      email: "rohan.patel@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Student@123",
      phone: "+91 98251 32345",
      program: "B.Tech Computer Science & Engineering",
      semester: 6,
      section: "6A",
      hostel: "Tagore Bhavan, Room 108",
      avatarText: "RP",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdGQtMyIsInJvbGUiOiJTVFVERU5UIn0",
      attendanceStats: {
        "CS601": { held: 38, attended: 30 },
        "CS602": { held: 36, attended: 27 },
        "CS603": { held: 40, attended: 31 },
        "CS604": { held: 32, attended: 25 },
        "CS605": { held: 34, attended: 26 },
        "CS606": { held: 24, attended: 19 }
      },
      grades: {
        semester: 6,
        academicYear: "2025-2026",
        isPublished: true,
        items: [
          { code: "CS601", title: "Advanced Operating Systems", credits: 4, internal: 32, midSem: 15, endSem: 32, total: 79, grade: "A", gradePoint: 8 },
          { code: "CS602", title: "Cloud Computing Architecture", credits: 4, internal: 34, midSem: 16, endSem: 33, total: 83, grade: "A", gradePoint: 8 },
          { code: "CS603", title: "Machine Learning & Pattern Recog.", credits: 4, internal: 33, midSem: 15, endSem: 34, total: 82, grade: "A", gradePoint: 8 },
          { code: "CS604", title: "Full Stack Web Engineering", credits: 3, internal: 35, midSem: 17, endSem: 34, total: 86, grade: "A+", gradePoint: 9 },
          { code: "CS605", title: "Distributed Database Systems", credits: 3, internal: 31, midSem: 15, endSem: 31, total: 77, grade: "B+", gradePoint: 7 },
          { code: "CS606", title: "Artificial Intelligence Lab", credits: 2, internal: 36, midSem: 18, endSem: 36, total: 90, grade: "A+", gradePoint: 9 },
        ],
        summary: { totalCredits: 20, earnedCredits: 20, sgpa: 8.15, cgpa: 8.22, result: "PASSED - FIRST CLASS" }
      }
    },
    {
      id: "std-4",
      enrollmentNo: "210303105004",
      rollNo: "CSE-21-004",
      name: "Ananya Iyer",
      email: "ananya.iyer@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Student@123",
      phone: "+91 98251 42345",
      program: "B.Tech Computer Science & Engineering",
      semester: 6,
      section: "6B",
      hostel: "Sarojini Bhavan, Room 305",
      avatarText: "AI",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdGQtNCIsInJvbGUiOiJTVFVERU5UIn0",
      attendanceStats: {
        "CS601": { held: 38, attended: 37 },
        "CS602": { held: 36, attended: 35 },
        "CS603": { held: 40, attended: 39 },
        "CS604": { held: 32, attended: 31 },
        "CS605": { held: 34, attended: 33 },
        "CS606": { held: 24, attended: 24 }
      },
      grades: {
        semester: 6,
        academicYear: "2025-2026",
        isPublished: true,
        items: [
          { code: "CS601", title: "Advanced Operating Systems", credits: 4, internal: 39, midSem: 20, endSem: 39, total: 98, grade: "O", gradePoint: 10 },
          { code: "CS602", title: "Cloud Computing Architecture", credits: 4, internal: 38, midSem: 19, endSem: 38, total: 95, grade: "O", gradePoint: 10 },
          { code: "CS603", title: "Machine Learning & Pattern Recog.", credits: 4, internal: 39, midSem: 20, endSem: 38, total: 97, grade: "O", gradePoint: 10 },
          { code: "CS604", title: "Full Stack Web Engineering", credits: 3, internal: 39, midSem: 19, endSem: 38, total: 96, grade: "O", gradePoint: 10 },
          { code: "CS605", title: "Distributed Database Systems", credits: 3, internal: 37, midSem: 19, endSem: 36, total: 92, grade: "O", gradePoint: 10 },
          { code: "CS606", title: "Artificial Intelligence Lab", credits: 2, internal: 40, midSem: 20, endSem: 39, total: 99, grade: "O", gradePoint: 10 }
        ],
        summary: { totalCredits: 20, earnedCredits: 20, sgpa: 9.85, cgpa: 9.68, result: "PASSED - UNIVERSITY GOLD MEDAL RANK 1" }
      }
    },
    {
      id: "std-5",
      enrollmentNo: "210303105005",
      rollNo: "CSE-21-005",
      name: "Kabir Verma",
      email: "kabir.verma@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Student@123",
      phone: "+91 98251 52345",
      program: "B.Tech Computer Science & Engineering",
      semester: 6,
      section: "6B",
      hostel: "Day Scholar (Vadodara City)",
      avatarText: "KV",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdGQtNSIsInJvbGUiOiJTVFVERU5UIn0",
      attendanceStats: {
        "CS601": { held: 38, attended: 27 },
        "CS602": { held: 36, attended: 26 },
        "CS603": { held: 40, attended: 29 },
        "CS604": { held: 32, attended: 23 },
        "CS605": { held: 34, attended: 25 },
        "CS606": { held: 24, attended: 18 }
      },
      grades: {
        semester: 6,
        academicYear: "2025-2026",
        isPublished: true,
        items: [
          { code: "CS601", title: "Advanced Operating Systems", credits: 4, internal: 30, midSem: 14, endSem: 30, total: 74, grade: "B+", gradePoint: 7 },
          { code: "CS602", title: "Cloud Computing Architecture", credits: 4, internal: 31, midSem: 15, endSem: 31, total: 77, grade: "B+", gradePoint: 7 },
          { code: "CS603", title: "Machine Learning & Pattern Recog.", credits: 4, internal: 32, midSem: 15, endSem: 32, total: 79, grade: "A", gradePoint: 8 },
          { code: "CS604", title: "Full Stack Web Engineering", credits: 3, internal: 33, midSem: 16, endSem: 33, total: 82, grade: "A", gradePoint: 8 },
          { code: "CS605", title: "Distributed Database Systems", credits: 3, internal: 30, midSem: 14, endSem: 31, total: 75, grade: "B+", gradePoint: 7 },
          { code: "CS606", title: "Artificial Intelligence Lab", credits: 2, internal: 34, midSem: 17, endSem: 34, total: 85, grade: "A+", gradePoint: 9 }
        ],
        summary: { totalCredits: 20, earnedCredits: 20, sgpa: 7.75, cgpa: 7.82, result: "PASSED - SECOND CLASS (ATTENDANCE NOTICE)" }
      }
    },
    {
      id: "std-6",
      enrollmentNo: "210303105099",
      rollNo: "CSE-21-006",
      name: "Pooja Desai",
      email: "pooja.desai@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Student@123",
      phone: "+91 98251 62345",
      program: "B.Tech Computer Science & Engineering",
      semester: 6,
      section: "6B",
      hostel: "Sarojini Bhavan, Room 114",
      avatarText: "PD",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdGQtNiIsInJvbGUiOiJTVFVERU5UIn0",
      attendanceStats: {
        "CS601": { held: 38, attended: 33 },
        "CS602": { held: 36, attended: 31 },
        "CS603": { held: 40, attended: 35 },
        "CS604": { held: 32, attended: 29 },
        "CS605": { held: 34, attended: 30 },
        "CS606": { held: 24, attended: 21 }
      },
      grades: {
        semester: 6,
        academicYear: "2025-2026",
        isPublished: true,
        items: [
          { code: "CS601", title: "Advanced Operating Systems", credits: 4, internal: 35, midSem: 17, endSem: 35, total: 87, grade: "A+", gradePoint: 9 },
          { code: "CS602", title: "Cloud Computing Architecture", credits: 4, internal: 36, midSem: 18, endSem: 36, total: 90, grade: "A+", gradePoint: 9 },
          { code: "CS603", title: "Machine Learning & Pattern Recog.", credits: 4, internal: 34, midSem: 16, endSem: 34, total: 84, grade: "A", gradePoint: 8 },
          { code: "CS604", title: "Full Stack Web Engineering", credits: 3, internal: 36, midSem: 17, endSem: 35, total: 88, grade: "A+", gradePoint: 9 },
          { code: "CS605", title: "Distributed Database Systems", credits: 3, internal: 33, midSem: 16, endSem: 33, total: 82, grade: "A", gradePoint: 8 },
          { code: "CS606", title: "Artificial Intelligence Lab", credits: 2, internal: 37, midSem: 18, endSem: 37, total: 92, grade: "O", gradePoint: 10 }
        ],
        summary: { totalCredits: 20, earnedCredits: 20, sgpa: 8.85, cgpa: 8.74, result: "PASSED - FIRST CLASS WITH DISTINCTION" }
      }
    }
  ],

  // Student Roster (used by faculty & admin lists)
  get studentRoster() {
    return this.students;
  },

  // Helper: Find student by enrollment number or email
  findStudentByLogin(identifier) {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    return this.students.find(s =>
      s.enrollmentNo.toLowerCase() === clean ||
      s.email.toLowerCase() === clean ||
      s.rollNo.toLowerCase() === clean
    ) || null;
  },

  // Helper: Find faculty by employee ID, email, or name
  findFacultyByLogin(identifier) {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    return this.faculties.find(f =>
      f.employeeId.toLowerCase() === clean ||
      f.email.toLowerCase() === clean ||
      f.name.toLowerCase() === clean
    ) || null;
  },

  // Backward compatibility pointers
  get attendanceStats() {
    // Current user's stats or default to first student
    const currentUser = (typeof AuthEngine !== 'undefined' && AuthEngine.getCurrentUser()) ? AuthEngine.getCurrentUser() : null;
    if (currentUser && currentUser.role === 'STUDENT') {
      const match = this.students.find(s => s.id === currentUser.id || s.enrollmentNo === currentUser.enrollmentNo);
      if (match) return match.attendanceStats;
    }
    return this.students[0].attendanceStats;
  },

  get grades() {
    const currentUser = (typeof AuthEngine !== 'undefined' && AuthEngine.getCurrentUser()) ? AuthEngine.getCurrentUser() : null;
    if (currentUser && currentUser.role === 'STUDENT') {
      const match = this.students.find(s => s.id === currentUser.id || s.enrollmentNo === currentUser.enrollmentNo);
      if (match) return match.grades;
    }
    return this.students[0].grades;
  },

  // Outpass / Gatepass Applications
  outpasses: [
    {
      id: "OP-2026-8812",
      studentId: "std-1",
      studentName: "Aarav Mehta",
      enrollmentNo: "210303105001",
      hostel: "Tagore Bhavan, Room 304",
      outDate: "2026-09-26",
      outTime: "17:00",
      inDate: "2026-09-26",
      inTime: "21:30",
      destination: "Alkapuri, Vadodara (Family Visit)",
      reason: "Urgent medical appointment & family dinner",
      parentPhone: "+91 94260 99887",
      status: "APPROVED",
      approvedBy: "Dr. Rajesh Sharma (Proctor)",
      approvedAt: "2026-09-25 14:10",
      qrToken: "PU-GP-VERIFIED-8812-PASS"
    },
    {
      id: "OP-2026-9041",
      studentId: "std-2",
      studentName: "Diya Sharma",
      enrollmentNo: "210303105002",
      hostel: "Sarojini Bhavan, Room 212",
      outDate: "2026-09-27",
      outTime: "09:00",
      inDate: "2026-09-27",
      inTime: "18:00",
      destination: "Sayaji Baug & Central Library, Vadodara",
      reason: "Research project reference book consultation",
      parentPhone: "+91 98251 22345",
      status: "PENDING",
      approvedBy: null,
      approvedAt: null,
      qrToken: null
    },
    {
      id: "OP-2026-9042",
      studentId: "std-4",
      studentName: "Ananya Iyer",
      enrollmentNo: "210303105004",
      hostel: "Sarojini Bhavan, Room 305",
      outDate: "2026-09-28",
      outTime: "08:00",
      inDate: "2026-09-29",
      inTime: "20:00",
      destination: "IIT Gandhinagar (Conference)",
      reason: "Paper presentation at IEEE AI Conference",
      parentPhone: "+91 98251 42345",
      status: "APPROVED",
      approvedBy: "Dr. Rajesh Sharma (Proctor)",
      approvedAt: "2026-09-25 15:30",
      qrToken: "PU-GP-VERIFIED-9042-PASS"
    }
  ],

  // System Audit Logs (Real-time Change Data Capture trail)
  auditLogs: [
    { id: "LOG-1094", timestamp: "2026-09-25 19:42:15", actor: "Dr. Rajesh Sharma", role: "FACULTY", action: "ATTENDANCE_MARKED", resource: "Course CS601 [Slot 10:00 AM]", ip: "192.168.10.42", status: "SUCCESS" },
    { id: "LOG-1093", timestamp: "2026-09-25 18:30:10", actor: "Dr. Ketan Kotecha", role: "ADMIN", action: "ACADEMIC_SETUP_EDIT", resource: "Department Curriculum 2026", ip: "192.168.1.10", status: "SUCCESS" },
    { id: "LOG-1092", timestamp: "2026-09-25 17:15:44", actor: "Dr. Rajesh Sharma", role: "FACULTY", action: "OUTPASS_APPROVED", resource: "Gatepass #OP-2026-8812", ip: "192.168.10.42", status: "SUCCESS" },
    { id: "LOG-1091", timestamp: "2026-09-25 16:02:11", actor: "Diya Sharma", role: "STUDENT", action: "OUTPASS_APPLICATION", resource: "Gatepass #OP-2026-9041", ip: "10.4.12.88", status: "PENDING" },
    { id: "LOG-1090", timestamp: "2026-09-25 14:00:29", actor: "Aarav Mehta", role: "STUDENT", action: "AUTH_LOGIN", resource: "Session Token Issued", ip: "10.4.12.88", status: "SUCCESS" }
  ],

  // Fee Details
  fees: {
    academicYear: "2025-2026",
    totalTuitionFee: 145000,
    examFee: 5000,
    hostelFee: 78000,
    totalPayable: 228000,
    totalPaid: 228000,
    dueAmount: 0,
    status: "PAID IN FULL",
    receiptNo: "PU-REC-2026-91823",
    transactionId: "TXN_PU_HDFC_99182741"
  },

  // Teacher Section: Capstone & Minor Project Guide Allocations (Matching Laptop Screen in photo)
  projectAllocations: [
    {
      id: "PRJ-01",
      title: "Tuition Fee Portal",
      allocatedGuide: "Prof. Jatin Morwal",
      guideEmpId: "PU-FAC-2045",
      team: [
        { name: "Pooja Desai", enrollmentNo: "210303105099", role: "Frontend & UI" },
        { name: "Aarav Mehta", enrollmentNo: "210303105001", role: "Payment Gateway" }
      ],
      track: "FinTech / Full-Stack",
      progress: 80,
      status: "In Progress",
      remarks: "Payment gateway integration verified in sandbox. Webhook receipts generated.",
      score: 88,
      lastUpdated: "2026-09-24"
    },
    {
      id: "PRJ-02",
      title: "Emergency Ambulance Alert System",
      allocatedGuide: "Prof. Jatin Morwal",
      guideEmpId: "PU-FAC-2045",
      team: [
        { name: "Diya Sharma", enrollmentNo: "210303105002", role: "GIS & Maps" },
        { name: "Kabir Verma", enrollmentNo: "210303105005", role: "Backend API" }
      ],
      track: "IoT & Real-Time Tracking",
      progress: 75,
      status: "In Progress",
      remarks: "Live driver GPS push validated on WebSocket. Alert latency < 250ms.",
      score: 85,
      lastUpdated: "2026-09-25"
    },
    {
      id: "PRJ-03",
      title: "Hostel Entry System for PU",
      allocatedGuide: "Prof. Pritam Samanta",
      guideEmpId: "PU-FAC-3012",
      team: [
        { name: "Aarav Mehta", enrollmentNo: "210303105001", role: "Hardware Interface" },
        { name: "Rohan Patel", enrollmentNo: "210303105003", role: "Database & Security" }
      ],
      track: "Computer Vision & RFID",
      progress: 85,
      status: "In Progress",
      remarks: "Facial recognition confidence 96.4%. Gate barrier relay triggers cleanly.",
      score: 92,
      lastUpdated: "2026-09-25"
    },
    {
      id: "PRJ-04",
      title: "Smart Management Information System Portal",
      allocatedGuide: "Prof. Pritam Samanta",
      guideEmpId: "PU-FAC-3012",
      team: [
        { name: "Ananya Iyer", enrollmentNo: "210303105004", role: "Analytics Dashboard" },
        { name: "Pooja Desai", enrollmentNo: "210303105099", role: "RBAC Security" }
      ],
      track: "Smart Information Systems",
      progress: 90,
      status: "In Review",
      remarks: "Department HOD approvals and role-based clearance validated for Smart Management Information System Portal. Excellent progress.",
      score: 95,
      lastUpdated: "2026-09-26"
    },
    {
      id: "PRJ-05",
      title: "AI-Based Crop Yield Prediction Platform",
      allocatedGuide: "Prof. Pritam Samanta",
      guideEmpId: "PU-FAC-3012",
      team: [
        { name: "Rohan Patel", enrollmentNo: "210303105003", role: "ML Model Training" },
        { name: "Kabir Verma", enrollmentNo: "210303105005", role: "Data Preprocessing" }
      ],
      track: "Artificial Intelligence & Agriculture",
      progress: 70,
      status: "In Progress",
      remarks: "Random Forest & XGBoost benchmarks complete. Integrating weather satellite APIs.",
      score: 83,
      lastUpdated: "2026-09-23"
    },
    {
      id: "PRJ-06",
      title: "Online Campus Navigation Website",
      allocatedGuide: "Prof. Pritam Samanta",
      guideEmpId: "PU-FAC-3012",
      team: [
        { name: "Aarav Mehta", enrollmentNo: "210303105001", role: "Three.js 3D Maps" },
        { name: "Diya Sharma", enrollmentNo: "210303105002", role: "Points of Interest" }
      ],
      track: "WebGL / Interactive Mapping",
      progress: 95,
      status: "Completed",
      remarks: "Campus 150-acre digital twin mapped. Indoor navigation for Engineering Block A active.",
      score: 97,
      lastUpdated: "2026-09-27"
    },
    {
      id: "PRJ-07",
      title: "Campus Lost & Found Portal",
      allocatedGuide: "Prof. Pritam Samanta",
      guideEmpId: "PU-FAC-3012",
      team: [
        { name: "Ananya Iyer", enrollmentNo: "210303105004", role: "Claim Verification" },
        { name: "Diya Sharma", enrollmentNo: "210303105002", role: "Image Matching" }
      ],
      track: "Full-Stack Web Portal",
      progress: 65,
      status: "In Progress",
      remarks: "Item photo uploads and student ID linking implemented. Working on notification dispatch.",
      score: 80,
      lastUpdated: "2026-09-22"
    }
  ],

  // Teacher Section: Faculty Leave Balances & History
  facultyLeaves: {
    balances: {
      casualLeave: { total: 8, used: 4, remaining: 4 },
      sickLeave: { total: 10, used: 2, remaining: 8 },
      dutyLeave: { total: 5, used: 1, remaining: 4 },
      earnedLeave: { total: 12, used: 0, remaining: 12 }
    },
    history: [
      { id: "LV-2026-091", type: "Duty Leave (DL)", fromDate: "2026-09-18", toDate: "2026-09-19", days: 2, reason: "Invited speaker at GTU Innovation Summit", substitute: "Dr. Rajesh Sharma", status: "APPROVED", approvedBy: "Head of Department (CSE)" },
      { id: "LV-2026-042", type: "Casual Leave (CL)", fromDate: "2026-08-14", toDate: "2026-08-14", days: 1, reason: "Family personal engagement", substitute: "Prof. Sneha Kulkarni", status: "APPROVED", approvedBy: "Head of Department (CSE)" },
      { id: "LV-2026-015", type: "Sick Leave (SL)", fromDate: "2026-07-22", toDate: "2026-07-23", days: 2, reason: "Seasonal viral fever & medical rest", substitute: "Prof. Ananya Patel", status: "APPROVED", approvedBy: "Head of Department (CSE)" }
    ]
  },

  // Teacher Section: Biometric In/Out Punch Register
  facultyInOutLogs: [
    { date: "2026-09-29", punchIn: "08:51 AM", punchOut: "Pending", machineIn: "GATE-03-BIO", machineOut: "--", duration: "Active", status: "ON TIME" },
    { date: "2026-09-28", punchIn: "08:48 AM", punchOut: "05:18 PM", machineIn: "GATE-03-BIO", machineOut: "ACAD-BLOCK-B", duration: "8h 30m", status: "ON TIME" },
    { date: "2026-09-27", punchIn: "08:55 AM", punchOut: "05:12 PM", machineIn: "GATE-03-BIO", machineOut: "ACAD-BLOCK-B", duration: "8h 17m", status: "ON TIME" },
    { date: "2026-09-26", punchIn: "09:04 AM", punchOut: "05:30 PM", machineIn: "GATE-01-MAIN", machineOut: "GATE-01-MAIN", duration: "8h 26m", status: "GRACE PERIOD" },
    { date: "2026-09-25", punchIn: "08:42 AM", punchOut: "05:15 PM", machineIn: "GATE-03-BIO", machineOut: "ACAD-BLOCK-B", duration: "8h 33m", status: "ON TIME" },
    { date: "2026-09-24", punchIn: "08:50 AM", punchOut: "05:20 PM", machineIn: "GATE-03-BIO", machineOut: "ACAD-BLOCK-B", duration: "8h 30m", status: "ON TIME" },
    { date: "2026-09-23", punchIn: "08:45 AM", punchOut: "05:10 PM", machineIn: "GATE-03-BIO", machineOut: "ACAD-BLOCK-B", duration: "8h 25m", status: "ON TIME" }
  ],

  // Teacher Section: Digital Pay Slip & Compensation Statement
  facultyPaySlip: {
    month: "September 2026",
    payDate: "2026-09-30",
    bankName: "HDFC Bank Ltd.",
    accountNo: "•••• •••• 5591",
    panNo: "ABCPS1234F",
    pfNo: "GJ/VAD/004521/0088",
    earnings: {
      basicPay: 62400,
      dearnessAllowance: 31200,
      houseRentAllowance: 14976,
      specialAllowance: 8500,
      conveyanceAllowance: 3500,
      grossPay: 120576
    },
    deductions: {
      providentFund: 7488,
      professionalTax: 200,
      incomeTaxTDS: 11000,
      busTransportDeduction: 2000,
      totalDeductions: 20688
    },
    netSalary: 99888,
    netSalaryInWords: "Ninety Nine Thousand Eight Hundred Eighty Eight Rupees Only"
  },

  // Teacher Section: University Bus Pass
  facultyBusPass: {
    passNo: "PU-STAFF-BP-3012",
    routeNo: "14",
    routeName: "Vadodara Central Station ⇄ Parul University Limda Campus",
    busNumber: "GJ-06-PU-5542",
    pickupPoint: "Waghodia Cross Road (Near Flyover)",
    pickupTime: "07:45 AM",
    dropTime: "05:30 PM",
    driverName: "Mr. Mukesh Solanki",
    driverContact: "+91 98254 77123",
    validUpto: "30-June-2027",
    status: "ACTIVE & VERIFIED"
  },

  // Teacher Section: Campus Resource Booking
  resourceBookings: [
    { id: "RES-101", resourceName: "Seminar Hall 2 (Dr. APJ Abdul Kalam Block)", date: "2026-10-04", slot: "10:00 AM - 01:00 PM", purpose: "Guest Lecture on Cloud Scalability", attendees: 120, status: "CONFIRMED" },
    { id: "RES-102", resourceName: "CSE AI High-Performance Lab (Room 304)", date: "2026-10-06", slot: "02:00 PM - 05:00 PM", purpose: "Hackathon Model Training Session", attendees: 60, status: "CONFIRMED" },
    { id: "RES-103", resourceName: "Smart Conference Room A-102", date: "2026-10-09", slot: "11:00 AM - 12:30 PM", purpose: "Minor Project Evaluation Review", attendees: 15, status: "PENDING" }
  ],

  // Teacher Section: Grievance Registration
  facultyGrievances: [
    { id: "GRV-FAC-2026-081", category: "IT & Infrastructure", subject: "Smartboard HDMI Display lag in Room 204", date: "2026-09-22", status: "RESOLVED", response: "HDMI cable and splitter replaced by Campus IT Support." },
    { id: "GRV-FAC-2026-094", category: "Campus Facilities", subject: "Air conditioning cooling issue in Lab 304", date: "2026-09-26", status: "IN PROGRESS", response: "Assigned to Facility Engineer. Service scheduled." }
  ],

  // Teacher Section: Official Circulars & Notices
  circulars: [
    { id: "CIR-2026-441", title: "Schedule for Mid-Semester Continuous Evaluation (CIE) Marks Locking", date: "2026-09-27", authority: "Office of the Dean, Faculty of Engineering & Technology", category: "Academics", urgency: "High", summary: "All faculty guides and subject in-charges are requested to verify and freeze CIE evaluation marks on or before October 10, 2026." },
    { id: "CIR-2026-439", title: "Parul University Annual Innovation & Tech Expo 2026 - Project Nominations", date: "2026-09-24", authority: "Dean of Research & Innovation", category: "Research", urgency: "Medium", summary: "Faculty guides are invited to nominate top two capstone student projects for the university-wide exhibition and funding grant." },
    { id: "CIR-2026-435", title: "Biometric Punch Regularization & 15-Minute Grace Policy Reminder", date: "2026-09-20", authority: "Registrar & HR Department", category: "Administration", urgency: "Standard", summary: "Faculty members are requested to log daily in/out punches on authorized RFID biometric portals at Campus Gates 1, 3, or Block B." },
    { id: "CIR-2026-430", title: "National Education Policy (NEP 2020) Outcome-Based Education Workshop", date: "2026-09-15", authority: "Academic Council", category: "Faculty Development", urgency: "Standard", summary: "Mandatory FDP session on Bloom's Taxonomy rubric mapping for faculty members on Saturday at Central Auditorium." }
  ],

  // Teacher Section: Bus Passenger Roster for "Mark Passenger Attendance"
  passengerRoster: [
    { id: "PAS-01", name: "Aarav Mehta", type: "Student", enrollment: "210303105001", stop: "Waghodia Cross Road", status: "PRESENT" },
    { id: "PAS-02", name: "Diya Sharma", type: "Student", enrollment: "210303105002", stop: "Soma Talav", status: "PRESENT" },
    { id: "PAS-03", name: "Rohan Patel", type: "Student", enrollment: "210303105003", stop: "Ajwa Road Crossing", status: "PRESENT" },
    { id: "PAS-04", name: "Prof. Sneha Kulkarni", type: "Faculty", enrollment: "PU-FAC-5520", stop: "Waghodia Cross Road", status: "PRESENT" },
    { id: "PAS-05", name: "Ananya Iyer", type: "Student", enrollment: "210303105004", stop: "Kapurai Bridge", status: "ABSENT" },
    { id: "PAS-06", name: "Kabir Verma", type: "Student", enrollment: "210303105005", stop: "Central Station Bus Stand", status: "PRESENT" }
  ],

  // Teacher Section: Division Timetables (for "Division Timetable" module)
  divisionTimetables: {
    "6A": [
      { slot: "09:00 - 10:00", mon: "CS601 (OS) - Room 204", tue: "CS602 (Cloud) - Room 204", wed: "CS601 (OS) - Room 204", thu: "CS603 (ML) - Room 204", fri: "CS604 (Web) - Room 204" },
      { slot: "10:00 - 11:00", mon: "CS603 (ML) - Room 204", tue: "CS601 (OS) - Room 204", wed: "CS602 (Cloud) - Room 204", thu: "CS601 (OS) - Room 204", fri: "CS605 (DBMS) - Room 204" },
      { slot: "11:15 - 12:15", mon: "CS602 (Cloud) - Room 204", tue: "CS604 (Web) - Room 204", wed: "CS605 (DBMS) - Room 204", thu: "CS602 (Cloud) - Room 204", fri: "CS603 (ML) - Room 204" },
      { slot: "01:00 - 02:00", mon: "Library / Tutorial", tue: "CS605 (DBMS) - Room 204", wed: "Project Mentorship", thu: "CS604 (Web) - Room 204", fri: "Seminar / FDP" },
      { slot: "02:00 - 04:00", mon: "CS606 AI Lab - Lab 304", tue: "Web Dev Lab - Lab 301", wed: "Cloud Architecture Lab", thu: "Project Lab - Lab 304", fri: "Sports / Club" }
    ],
    "6B": [
      { slot: "09:00 - 10:00", mon: "CS602 (Cloud) - Room 205", tue: "CS603 (ML) - Room 205", wed: "CS604 (Web) - Room 205", thu: "CS601 (OS) - Room 205", fri: "CS602 (Cloud) - Room 205" },
      { slot: "10:00 - 11:00", mon: "CS601 (OS) - Room 205", tue: "CS605 (DBMS) - Room 205", wed: "CS601 (OS) - Room 205", thu: "CS603 (ML) - Room 205", fri: "CS604 (Web) - Room 205" },
      { slot: "11:15 - 12:15", mon: "CS604 (Web) - Room 205", tue: "CS601 (OS) - Room 205", wed: "CS603 (ML) - Room 205", thu: "CS605 (DBMS) - Room 205", fri: "CS601 (OS) - Room 205" },
      { slot: "01:00 - 02:00", mon: "Project Mentorship", tue: "CS602 (Cloud) - Room 205", wed: "Library / Tutorial", thu: "Seminar / FDP", fri: "CS605 (DBMS) - Room 205" },
      { slot: "02:00 - 04:00", mon: "Web Dev Lab - Lab 301", tue: "CS606 AI Lab - Lab 304", wed: "Project Lab - Lab 304", thu: "Cloud Architecture Lab", fri: "Sports / Club" }
    ]
  },

  // Teacher Section: Exam Blocks for "Scan Block Attendance"
  examBlocks: [
    { blockNo: "B-204", room: "Engineering Block B, 2nd Floor", course: "CS601: Advanced Operating Systems", totalStudents: 32, scannedStudents: 30, invigilator: "Mr. Pritam Samanta", time: "10:00 AM - 12:30 PM", date: "2026-09-29" },
    { blockNo: "B-205", room: "Engineering Block B, 2nd Floor", course: "CS602: Cloud Computing Architecture", totalStudents: 30, scannedStudents: 28, invigilator: "Prof. Jatin Morwal", time: "10:00 AM - 12:30 PM", date: "2026-09-29" }
  ],

  // Student Section: University 365-Day Academic Calendar
  academicCalendar: [
    { date: "2026-07-15", month: "July", title: "Commencement of Academic Term (Even Sem)", category: "Academic", badge: "badge-primary" },
    { date: "2026-08-15", month: "August", title: "Independence Day & Flag Hoisting Ceremony", category: "Holiday", badge: "badge-success" },
    { date: "2026-09-08", month: "September", title: "Continuous Internal Evaluation (CIE-I) Examination", category: "Exam", badge: "badge-danger" },
    { date: "2026-09-25", month: "September", title: "National Engineers Day Technical Symposium", category: "Event", badge: "badge-info" },
    { date: "2026-10-18", month: "October", title: "Diwali & Mid-Term Academic Recess", category: "Holiday", badge: "badge-success" },
    { date: "2026-11-10", month: "November", title: "Continuous Internal Evaluation (CIE-II) Examination", category: "Exam", badge: "badge-danger" },
    { date: "2026-12-05", month: "December", title: "Practical Lab & Capstone Project Viva Week", category: "Exam", badge: "badge-gold" },
    { date: "2026-12-18", month: "December", title: "University End-Semester Theory Examinations", category: "Exam", badge: "badge-danger" },
    { date: "2027-01-10", month: "January", title: "PU Dhoom Annual National Youth & Tech Fest", category: "Event", badge: "badge-primary" }
  ],

  // Student Section: Transport & Bus Pass
  studentTransport: {
    passNo: "PU-STU-BP-2103031",
    routeNo: "14",
    routeName: "Vadodara Central Railway Station ⇄ PU Limda Campus",
    busNumber: "GJ-06-PU-5542",
    pickupStop: "Waghodia Cross Road (Near Flyover)",
    morningPickup: "07:45 AM",
    eveningReturn: "05:30 PM",
    driverName: "Mr. Mukesh Solanki",
    driverContact: "+91 98254 77123",
    status: "ACTIVE & VERIFIED",
    validThrough: "30-June-2027"
  },

  // Student Section: Digital Mess & Dining Hall Meal Pass
  studentMessPass: {
    passId: "MESS-FET-2026-001",
    diningHall: "Tagore Bhavan Central Dining Hall (Block B)",
    dietaryType: "Regular Vegetarian / Jain Option Available",
    hostel: "Tagore Bhavan, Room 304",
    validity: "Semester 6 (2025-2026)",
    status: "ACTIVE MEAL ACCESS",
    slots: [
      { meal: "Breakfast", timing: "07:30 AM - 09:00 AM", todayMenu: "Poha, Steamed Idli-Sambar, Boiled Milk / Masala Tea" },
      { meal: "Lunch", timing: "12:30 PM - 02:00 PM", todayMenu: "Butter Roti, Dal Tadka, Paneer Butter Masala, Jeera Rice, Fresh Salad, Chilled Chaas" },
      { meal: "Evening Snacks", timing: "05:00 PM - 06:00 PM", todayMenu: "Vegetable Samosa / Grilled Sandwich, Masala Chai" },
      { meal: "Dinner", timing: "07:30 PM - 09:30 PM", todayMenu: "Soft Chapati, Mix Veg Handi, Gujarati Sweet Kadhi, Khichdi, Hot Gulab Jamun" }
    ]
  },

  // Student Section: Student Grievances
  studentGrievances: [
    { id: "GRV-STU-2026-112", category: "Hostel Wi-Fi", subject: "Wi-Fi signal degradation on 3rd Floor Tagore Bhavan", date: "2026-09-24", status: "RESOLVED", resolution: "Campus IT installed additional 5GHz Wi-Fi Access Point on 3rd floor corridor." },
    { id: "GRV-STU-2026-145", category: "Library & E-Resources", subject: "Request for Cloud Architecture textbook access", date: "2026-09-28", status: "IN PROGRESS", resolution: "Procured under university digital IEEE e-library repository." }
  ],

  // Student Section: Course Teaching Evaluation Feedback
  studentFeedback: [
    { code: "CS601", title: "Advanced Operating Systems", faculty: "Dr. Rajesh Sharma", completed: true, rating: 5, remark: "Excellent practical explanations and operating system kernel internals." },
    { code: "CS602", title: "Cloud Computing Architecture", faculty: "Prof. Ananya Patel", completed: false, rating: null, remark: "" },
    { code: "CS603", title: "Machine Learning & Pattern Recog.", faculty: "Dr. Vikramaditya Joshi", completed: false, rating: null, remark: "" },
    { code: "CS604", title: "Full Stack Web Engineering", faculty: "Prof. Sneha Kulkarni", completed: true, rating: 4, remark: "Great hands-on tutorials on modern web development." }
  ],

  // Student Section: Class Timetable
  studentTimetable: [
    { slot: "09:00 - 10:00 AM", mon: "CS601 (OS) - Room 204", tue: "CS602 (Cloud) - Room 204", wed: "CS601 (OS) - Room 204", thu: "CS603 (ML) - Room 204", fri: "CS604 (Web) - Room 204" },
    { slot: "10:00 - 11:00 AM", mon: "CS603 (ML) - Room 204", tue: "CS601 (OS) - Room 204", wed: "CS602 (Cloud) - Room 204", thu: "CS601 (OS) - Room 204", fri: "CS605 (DBMS) - Room 204" },
    { slot: "11:15 - 12:15 PM", mon: "CS602 (Cloud) - Room 204", tue: "CS604 (Web) - Room 204", wed: "CS605 (DBMS) - Room 204", thu: "CS602 (Cloud) - Room 204", fri: "CS603 (ML) - Room 204" },
    { slot: "01:00 - 02:00 PM", mon: "Lunch & Recess (Tagore Mess)", tue: "CS605 (DBMS) - Room 204", wed: "Project Guidance & Mentorship", thu: "CS604 (Web) - Room 204", fri: "Student Seminar / Tech Talk" },
    { slot: "02:00 - 04:00 PM", mon: "CS606 AI Lab - Lab 304", tue: "Web Dev Lab - Lab 301", wed: "Cloud Architecture Lab", thu: "Capstone Project Lab - Lab 304", fri: "Sports / Coding Club" }
  ],

  // =========================================================================
  // ADMIN SECTION: SMART ACCOUNT, SUBSCRIPTIONS, PROVISIONING & ROLES
  // =========================================================================
  adminProfile: {
    name: "Dr. Ketan Kotecha",
    adminId: "PU-ADM-001",
    designation: "Chief Academic Administrator & Provost Office Registrar",
    department: "Provost Office & Central Academic Registrar",
    email: "admin@paruluniversity.ac.in",
    emailStatus: "Verified Domain Licensee (@paruluniversity.ac.in)",
    userType: "Adult", // Explicitly selected during SMART Account Setup
    userTypeDescription: "Designated Institutional Adult Authority & License Administrator",
    initialPassword: "Admin@SMART#2026",
    passwordStatus: "Hashed SHA-256 with FIDO2 Hardware Key Verification",
    organization: "Parul University - Academic Enterprise Consortium",
    organizationId: "PU-ORG-ACAD-2025",
    purchaseOrder: "PO-PARUL-SMART-2025-88124",
    invoiceNumber: "INV-SMART-ED-99201",
    primaryProductKey: "SMART-SLS-2026-PU-9821-X4K9",
    primarySuite: "SMART Learning Suite (SLS) Enterprise Edition v24",
    licenseStatus: "Active & Claimed",
    licenseScope: "University-Wide Campus Consortium Multi-Seat Access",
    twoFactorAuth: "Enabled (Hardware FIDO2 Security Key & Admin Authenticator)",
    lastLogin: "Today, 09:12:08 AM IST (Admin Terminal IP 172.16.1.10)"
  },

  // Active Software Subscriptions & License Keys
  smartSubscriptions: [
    {
      id: "SUB-SMART-SLS-01",
      name: "SMART Learning Suite (SLS) Enterprise Edition",
      category: "Interactive Learning & Lesson Delivery",
      productKey: "SMART-SLS-2026-PU-9821-X4K9",
      status: "ACTIVE",
      statusBadge: "badge-success",
      purchaseConfirmation: "PO-PARUL-SMART-2025-88124",
      invoiceNo: "INV-SMART-ED-99201",
      licenseType: "Volume Multi-Seat Educational Consortium",
      totalSeats: 850,
      allocatedSeats: 742,
      availableSeats: 108,
      startDate: "2025-06-01",
      renewalDate: "2027-05-31",
      daysRemaining: 242,
      icon: "💻",
      features: ["SMART Notebook Desktop", "Game-Based Activities", "Formative Assessment Engine", "Cloud Collaboration"]
    },
    {
      id: "SUB-SMART-NB-02",
      name: "SMART Notebook Collaborative Classroom Suite",
      category: "Classroom Hardware & Interactive Display",
      productKey: "SMART-NB-2026-PU-4412-B8Q1",
      status: "ACTIVE",
      statusBadge: "badge-success",
      purchaseConfirmation: "PO-PARUL-SMART-2025-88125",
      invoiceNo: "INV-SMART-ED-99202",
      licenseType: "Smart Board Display & Campus Terminal License",
      totalSeats: 300,
      allocatedSeats: 265,
      availableSeats: 35,
      startDate: "2024-12-15",
      renewalDate: "2026-12-15",
      daysRemaining: 75,
      icon: "📓",
      features: ["Multi-Touch Interactive Panel Support", "3D Content Render", "Subject-Specific Toolkits (STEM)", "Dual Screen Mode"]
    },
    {
      id: "SUB-SMART-LUM-03",
      name: "SMART Lumio Cloud Teaching Platform",
      category: "Cloud Student Engagement & Remote Classroom",
      productKey: "SMART-LUM-2026-PU-1109-M3Z2",
      status: "ACTIVE",
      statusBadge: "badge-success",
      purchaseConfirmation: "PO-PARUL-SMART-2025-88126",
      invoiceNo: "INV-SMART-ED-99203",
      licenseType: "Campus-Wide Concurrent Student & Educator Passes",
      totalSeats: 15000,
      allocatedSeats: 14250,
      availableSeats: 750,
      startDate: "2025-08-01",
      renewalDate: "2027-07-31",
      daysRemaining: 303,
      icon: "☁️",
      features: ["Browser-Based Student Join", "Live Lesson Broadcasting", "Canvas & LMS Direct Integration", "AI Worksheet Generator"]
    }
  ],

  // User Provisioning Roster: Educators and Staff Granted Software Access
  provisionedUsers: [
    {
      id: "PROV-01",
      name: "Dr. Rajesh Sharma",
      email: "rajesh.sharma@paruluniversity.ac.in",
      department: "Computer Science & Engineering",
      role: "Tech Instructor",
      subscriptions: ["SMART Learning Suite", "SMART Notebook"],
      status: "Active",
      addedDate: "2025-06-05",
      avatarText: "RS"
    },
    {
      id: "PROV-02",
      name: "Prof. Ananya Patel",
      email: "ananya.patel@paruluniversity.ac.in",
      department: "Computer Science & Engineering",
      role: "Educator",
      subscriptions: ["SMART Learning Suite"],
      status: "Active",
      addedDate: "2025-06-08",
      avatarText: "AP"
    },
    {
      id: "PROV-03",
      name: "Dr. Vikramaditya Joshi",
      email: "vikram.joshi@paruluniversity.ac.in",
      department: "Artificial Intelligence",
      role: "Tech Instructor",
      subscriptions: ["SMART Learning Suite", "SMART Lumio"],
      status: "Active",
      addedDate: "2025-06-10",
      avatarText: "VJ"
    },
    {
      id: "PROV-04",
      name: "Prof. Sneha Kulkarni",
      email: "sneha.kulkarni@paruluniversity.ac.in",
      department: "Information Technology",
      role: "Educator",
      subscriptions: ["SMART Learning Suite"],
      status: "Active",
      addedDate: "2025-06-12",
      avatarText: "SK"
    },
    {
      id: "PROV-05",
      name: "Prof. Jatin Morwal",
      email: "jatin.morwal@paruluniversity.ac.in",
      department: "Computer Applications",
      role: "Educator",
      subscriptions: ["SMART Notebook"],
      status: "Active",
      addedDate: "2025-06-15",
      avatarText: "JM"
    },
    {
      id: "PROV-06",
      name: "Prof. Ritesh Varma",
      email: "ritesh.varma@paruluniversity.ac.in",
      department: "Electrical Engineering",
      role: "Educator",
      subscriptions: ["SMART Learning Suite"],
      status: "Active",
      addedDate: "2025-06-20",
      avatarText: "RV"
    },
    {
      id: "PROV-07",
      name: "Dr. Alok Verma",
      email: "alok.verma@paruluniversity.ac.in",
      department: "Mechanical Engineering",
      role: "Departmental Supervisor",
      subscriptions: ["SMART Learning Suite", "SMART Notebook"],
      status: "Active",
      addedDate: "2025-07-01",
      avatarText: "AV"
    },
    {
      id: "PROV-08",
      name: "Mrs. Meena Shah",
      email: "meena.shah@paruluniversity.ac.in",
      department: "Academic IT Infrastructure",
      role: "Organization Administrator",
      subscriptions: ["SMART Learning Suite", "SMART Lumio"],
      status: "Active",
      addedDate: "2025-07-05",
      avatarText: "MS"
    }
  ],

  // Role Assignment & Administrative Delegation
  organizationRoles: [
    {
      id: "ROLE-01",
      name: "Dr. Ketan Kotecha",
      email: "admin@paruluniversity.ac.in",
      role: "Master Super-Admin",
      department: "Office of the Provost & Registrar",
      scope: "Full Enterprise Control, Licensing, Billing & System Security",
      assignedBy: "Parul University Board of Governance",
      assignedDate: "2024-01-10",
      status: "Primary Authority",
      statusBadge: "badge-maroon"
    },
    {
      id: "ROLE-02",
      name: "Mrs. Meena Shah",
      email: "meena.shah@paruluniversity.ac.in",
      role: "Organization Administrator",
      department: "Academic IT Infrastructure",
      scope: "User Provisioning, Seat Quota Management & Educator Onboarding",
      assignedBy: "Dr. Ketan Kotecha",
      assignedDate: "2024-03-15",
      status: "Active Co-Admin",
      statusBadge: "badge-primary"
    },
    {
      id: "ROLE-03",
      name: "Dr. Rajesh Sharma",
      email: "rajesh.sharma@paruluniversity.ac.in",
      role: "Tech Instructor",
      department: "Computer Science & Engineering",
      scope: "Smart Display Hardware Calibration & Interactive Curriculum Training",
      assignedBy: "Dr. Ketan Kotecha",
      assignedDate: "2024-06-01",
      status: "Active",
      statusBadge: "badge-gold"
    },
    {
      id: "ROLE-04",
      name: "Dr. Vikramaditya Joshi",
      email: "vikram.joshi@paruluniversity.ac.in",
      role: "Tech Instructor",
      department: "Artificial Intelligence",
      scope: "Cloud Lab & Interactive Multimedia Classroom Lead",
      assignedBy: "Dr. Ketan Kotecha",
      assignedDate: "2024-06-05",
      status: "Active",
      statusBadge: "badge-gold"
    },
    {
      id: "ROLE-05",
      name: "Dr. Alok Verma",
      email: "alok.verma@paruluniversity.ac.in",
      role: "Departmental Supervisor",
      department: "Mechanical Engineering",
      scope: "Faculty Attendance, Software Utilization Audit & Academic Compliance",
      assignedBy: "Dr. Ketan Kotecha",
      assignedDate: "2024-08-12",
      status: "Active",
      statusBadge: "badge-info"
    },
    {
      id: "ROLE-06",
      name: "Prof. Priya Mehta",
      email: "priya.mehta@paruluniversity.ac.in",
      role: "Departmental Supervisor",
      department: "Information Technology",
      scope: "Digital Classroom Audits & Educator Performance Review",
      assignedBy: "Dr. Ketan Kotecha",
      assignedDate: "2024-08-20",
      status: "Active",
      statusBadge: "badge-info"
    }
  ]
};

// Global helper to calculate attendance percentage per the SQL formula
function calculateAttendancePercentage(attended, held) {
  if (!held || held === 0) return 0;
  return Math.round((attended / held) * 100 * 100) / 100;
}

// Export for browser or node
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PU_DATA;
}

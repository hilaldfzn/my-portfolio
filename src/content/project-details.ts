// Long-form project details: full descriptions (shown on /projects) and CV highlights
// (public/assets/CV, shown in the 3D gallery). Imported only where the long text is rendered.

export interface ProjectDetails {
  description: string
  highlights: string[]
}

export const projectDetails: Record<string, ProjectDetails> = {
  "dc-sentiment-analysis": {
    description:
      "Designed and executed a full-cycle research project to evaluate the shift in public sentiment regarding the DC Universe's creative direction. The study compared audience reception between Zack Snyder's Man of Steel (2013) and James Gunn's Superman (2025) using social media data.",
    highlights: [
      "Designed and executed a full-cycle research project to evaluate the shift in public sentiment regarding the DC Universe's creative direction",
      "Compared audience reception between Zack Snyder's Man of Steel (2013) and James Gunn's Superman (2025) using social media data",
    ],
  },
  "maams": {
    description:
      "AI-powered root cause analysis application utilizing DeepSeek R1 model for chat completions. Validates and confirms underlying causes of problems with advanced analysis algorithms and prompt systems.",
    highlights: [
      "A Next.js and Django web app for a software engineering project course, built by a team of 7: a root cause validator using the DeepSeek R1 model",
      "Served as a full-stack developer for 4 sprints, managing action items, backlogs and acceptance criteria, and developed the authentication and validator features",
      "Developed with Scrum in collaboration with FISIP UI, supporting the Philosophy of Communication course by analyzing and confirming communication-related problems",
    ],
  },
  "apap-medika": {
    description:
      "Hospital management system using a 6-microservice architecture for all core hospital functions. I took full ownership of the end-to-end product design, creating the UI/UX and design system from the ground up. The system features complex business logic and robust security with JWT-based authentication, OAuth, and role-based access control for five distinct user types.",
    highlights: [
      "Six microservices: Profile, Appointment, Hospitalization, Pharmacy, Insurance, and Bill",
      "Designed the entire app as the UI designer, created the design system from scratch, and defined user flows",
      "Built complex business logic including appointment scheduling, reservations, pharmacy inventory, insurance policy management, and integrated billing with payment tracking",
    ],
  },
  "database-backup-utility": {
    description:
      "Built a versatile Command-Line Interface (CLI) tool in Go to fully automate backup and restore operations for MySQL, PostgreSQL, MongoDB, and SQLite. It securely integrates with multi-cloud storage providers like AWS S3, GCS, and Azure, implementing compression, encryption, and custom retention policies. The tool features a modular architecture containerized with Docker, complete with Slack notifications and scheduled workflows for reliable, unattended operation.",
    highlights: [
      "CLI tool in Go for automated database backup and restore supporting MySQL, PostgreSQL, MongoDB, and SQLite",
      "Multi-cloud storage (AWS S3, GCS, Azure) with compression, encryption, and retention policies",
    ],
  },
  "crawlkit-api": {
    description:
      "REST API for intelligent and ethical web scraping, featuring concurrent crawling and a real-time analytics dashboard. The system ensures responsible data collection by enforcing robots.txt compliance, automatic delays, and rate limiting. It uses BeautifulSoup for advanced HTML parsing and includes data quality monitoring reports to guarantee reliable data extraction.",
    highlights: [
      "REST API for intelligent web scraping and data extraction with robots.txt compliance, concurrent crawling, and a real-time analytics dashboard",
      "BeautifulSoup HTML parsing with advanced CSS selectors",
      "Ethical crawling with automatic delays and rate limiting, plus reporting for data quality monitoring",
    ],
  },
  "natural-language-inference": {
    description:
      "Deep learning model for predicting logical relationships between sentences using pre-trained DeBERTa V3 model. Built entirely from scratch with PyTorch for Indonesian and English datasets.",
    highlights: [
      "Classifies the relationship between a premise and a hypothesis as entailment, contradiction, or neutral",
      "Custom-built architectures with the pre-trained DeBERTa V3 model in PyTorch, trained from scratch on Indonesian and English data",
    ],
  },
  "lembarpena": {
    description:
      "Award-winning literacy community web and mobile application connecting readers and authors. Features book purchasing, discussion forums, and wishlist functionality. Winner of The Best Web Application Award.",
    highlights: [
      "Web and mobile application with a literacy community theme, built with Django and Flutter",
      "Connects readers and authors with book purchasing, discussion forums, and a wishlist feature",
      "Designed the entire app as the UI designer, created the design system from scratch, and defined user flows",
    ],
  },
  "mario-object-detection": {
    description:
      "YOLO v11-based object detection system for accurately detecting Mario characters in video datasets. Addresses real-world challenges like lighting variability and complex backgrounds.",
    highlights: [
      "Object detection with YOLO v11 to detect Mario characters in video datasets accurately and efficiently",
      "Handles real-world challenges like lighting variability, angles, and complex backgrounds",
      "Evaluated on accuracy and processing speed to understand how to implement and optimize YOLO for dynamic visual data",
    ],
  },
  "health-admission-prediction": {
    description:
      "Healthcare analytics project predicting patient outcomes and ICU stay duration. Includes classification, regression, and clustering models for medical decision-making support.",
    highlights: [
      "Exploratory data analysis of patient traits and disease trends, including peak admission periods and disease patterns by age and smoking status",
      "Classification models for patient outcomes and regression models for ICU stay duration",
      "Clustering models to group patients and support medical decisions and hospital resource planning",
    ],
  },
  "marmut-music": {
    description:
      "Spotify-like streaming platform offering music and podcasts with premium subscriptions, playlists, charts, and royalty tracking for artists, songwriters, and labels.",
    highlights: [
      "Music and podcast streaming with detailed content information",
      "Premium subscriptions, playlists, and charts for content discovery",
      "Usage tracking for royalty payments to artists, songwriters, and labels using SQL queries",
    ],
  },
  "hoomgroom": {
    description:
      "IKEA-inspired furniture e-commerce platform with catalog browsing, cart management, balance top-up, and shipping tracking. Built with Spring Boot and Next.js + Tailwind CSS.",
    highlights: [
      "Web platform for exploring a furniture catalog, similar to IKEA",
      "Browse products, manage the cart, top up balance, complete transactions, and track shipping",
    ],
  },
}

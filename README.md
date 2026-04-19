# LearnWithAi 🚀 – AI-Powered Career Accelerator

**LearnWithAi** is a cutting-edge career development platform that leverages a "swarm" of AI Agents to provide personalized coaching, resume analysis, and mock interview simulations. Built with **Next.js 15** and **Gemini 2.0 Flash**, it transforms the career journey through intelligent automation.

---

## 📸 Screenshots

### 🏠 Landing Page
![Landing Page](public/ss/Screenshot%202026-04-19%20155957.png)
*Next-Generation AI Career Accelerator*

### 📊 Dashboard
![Dashboard](public/ss/Screenshot%202026-04-19%20154834.png)
*Personalized Dashboard with Interview History*

### 🤖 AI Tools
![AI Tools](public/ss/Screenshot%202026-04-19%20154912.png)
*Suite of AI-powered Career Agents*

### 📚 Resources
![PDF Resources](public/ss/Screenshot%202026-04-19%20154933.png)
*Curated Learning Materials and Documentation*

### 💳 Billing & Plans
![Pricing](public/ss/Screenshot%202026-04-19%20155310.png)
*Flexible Subscription Options*

### 👤 User Profile
![Profile](public/ss/Screenshot%202026-04-19%20155617.png)
*Account Management via Clerk*

### 💬 Feedback
![Feedback](public/ss/Screenshot%202026-04-19%20155718.png)
*Direct User Feedback Channel*

---

## 🛠️ Technical Architecture

### 1. **Agentic AI Orchestration**
LearnWithAi uses a multi-agent system built on the **@inngest/agent-kit**. Each feature is powered by a specialized AI agent:
- **Career Q&A Agent**: Provides real-time industry insights.
- **Resume Analyzer**: Uses structured JSON output to score and critique resumes.
- **Roadmap Generator**: Calculates logical learning paths with branching logic.

### 2. **Event-Driven Workflows (Inngest)**
To ensure a smooth user experience, long-running AI tasks are handled via **Inngest**:
- **Reliability**: Automatic retries and state management for multi-step tasks.
- **Background Processing**: PDF parsing and AI analysis run asynchronously to prevent UI timeouts.

### 3. **The Data Layer**
- **Database**: Serverless **Neon PostgreSQL**.
- **ORM**: **Drizzle ORM** for type-safe database interactions and efficient schema management.
- **Media**: **ImageKit** for optimized file hosting and retrieval.

### 4. **Modern Frontend**
- **Next.js 15 (App Router)**: Utilizing Server Components for speed and Client Components for interactivity.
- **React Flow**: For visualizing complex, branching learning roadmaps.
- **Clerk Auth**: Secure, enterprise-grade authentication and session management.

---

## 📱 Mobile Experience (Android App)

In addition to the web platform, we have developed a **LearnWithAi Android App** to provide career guidance on the go.
- **Cross-Platform Sync**: Seamlessly sync your interview history and roadmaps between web and mobile.
- **Native Performance**: Optimized for mobile-first interactions, including voice-to-text for mock interviews.
- **Push Notifications**: Stay updated on your roadmap progress and upcoming interview sessions.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Neon PostgreSQL Instance
- Gemini API Key
- Clerk API Keys

### Installation
1.  **Clone the repo**:
    ```bash
    git clone https://github.com/your-username/learnwithai.git
    cd learnwithai/learnwithai
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment Variables**:
    Create a `.env` file and add your keys (see `.env.example`).
4.  **Sync Database**:
    ```bash
    npx drizzle-kit push
    ```
5.  **Run Development Server**:
    ```bash
    npm run dev
    ```
6.  **Run Inngest Dev Server**:
    ```bash
    npx inngest-cli@latest dev
    ```

---

## 🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to help make LearnWithAi even better.

## 📄 License
Distributed under the MIT License.

---
*Made with ❤️ by [Your Name](https://github.com/Sidhant-singh)*

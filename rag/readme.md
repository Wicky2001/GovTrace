
## 🚀 Features

- 🌍 Converts natural language into SQL queries
- 🧠 Uses Google's Gemini model for LLM-powered query generation
- 💡 Automatically executes SQL queries on your MySQL database
- 🗣️ Returns easy-to-understand answers
- 🖥️ CLI-based interactive interface
- 🔒 Environment variable support for credentials

---

## 🛠️ Installation



### 2. Set up a virtual environment
```
conda create -n ask2sql python=3.11
conda activate ask2sql
```

### 3. Install dependencies
```
pip install -r requirements.txt
```

### 🔑 Environment Variables
```
GOOGLE_API_KEY=your_google_api_key
USER=your_mysql_username
PASSWORD=your_mysql_password
HOST=your_mysql_host
PORT=3306
DB_NAME=your_database_name
MODEL=gemini-2.0-flash  # or another supported Google model
```

### ▶️ Usage
```
python main.py
```

### 🧩 Tech Stack
- LangChain
- Google Generative AI (Gemini)
- MySQL
- dotenv

### 📂 Project Structure

ask2sql/
│
├─── main.py         
│
├── .env                
├── README.md            
└── requirements.txt    

### 🙌 Acknowledgements

- OpenAI for inspiration on conversational apps
- LangChain team for awesome abstractions
- Google for the Gemini API




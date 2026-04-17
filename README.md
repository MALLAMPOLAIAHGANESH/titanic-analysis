# 🚢 Titanic Survival Dashboard

> *"She's gone. She can't stay afloat for long."* — April 15, 1912

A stunning, fully interactive **Titanic Survival Analytics Dashboard** built with vanilla HTML, CSS, JavaScript, and optionally powered by a Python/Flask ML backend. Explore historical survival statistics and predict your own chances aboard the RMS Titanic.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | Live KPI counters: passengers, survivors, gender breakdowns |
| 📈 **6 Charts** | Bar, Doughnut, Line, Pie, and Radar charts via Chart.js |
| 🔮 **AI Prediction** | Logistic-regression model predicts survival probability |
| 💡 **Feature Importance** | Animated bars showing which factors influenced the prediction |
| 🌊 **Titanic Theme** | Nautical colors, glassmorphism cards, responsive design |
| 📱 **Responsive** | Fully mobile-friendly with hamburger navigation |
| 🎨 **Glassmorphism** | Frosted glass cards with hover effects & micro-animations |
| ⚓ **About Page** | Project overview and historical survival insights |

---

## 📁 Project Structure

```
titanic-analysis/
├── index.html          # 🏠 Dashboard homepage (KPIs + Charts)
├── predict.html        # 🔮 Survival prediction page
├── style.css           # 🎨 Master stylesheet (Nautical theme)
├── main.js             # 📊 Dashboard charts & KPI counters
├── predict.js          # 🧠 Prediction model & form logic
├── titanic_bg.png      # 🌊 Titanic ship background image
├── README.md           # 📖 This file
│
├── app.py              # 🐍 Flask backend (optional ML model)
├── model.pkl           # 🤖 Trained scikit-learn model (optional)
├── requirements.txt    # 📦 Python dependencies
└── Dockerfile          # 🐳 Docker configuration
```

---

## 🚀 Setup Instructions

### Option 1: Static Frontend (No Backend Required)

Simply open `index.html` in your browser — no installation needed!

```bash
# Clone the repo
git clone https://github.com/MALLAMPOLAIAHGANESH/titanic-dashboard.git
cd titanic-dashboard

# Open in browser
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

### Option 2: Flask Backend (Full ML Integration)

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run Flask server
python app.py

# Open http://localhost:5000
```

**requirements.txt:**
```
flask==3.0.0
pandas==2.1.0
scikit-learn==1.3.0
numpy==1.26.0
gunicorn==21.2.0
```

### Option 3: Docker 🐳

```bash
# Build the Docker image
docker build -t titanic-dashboard .

# Run the container
docker run -p 8080:8080 titanic-dashboard

# Open http://localhost:8080
```

**Dockerfile:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
```

---

## ☁️ Deployment — Google Cloud Run

```bash
# Authenticate with GCP
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Build and push image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/titanic-dashboard

# Deploy to Cloud Run
gcloud run deploy titanic-dashboard \
  --image gcr.io/YOUR_PROJECT_ID/titanic-dashboard \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080

# Your app is live at:
# https://titanic-dashboard-XXXX-uc.a.run.app
```

---

## 🧠 Prediction Model

The survival predictor uses a **Logistic Regression** model (or Random Forest) trained on the Kaggle Titanic dataset:

| Feature | Weight | Notes |
|---|---|---|
| 🚻 Gender | **High** | Female survival rate: 74% vs Male: 19% |
| 🎟️ Ticket Class | **High** | 1st class: 63%, 3rd class: 24% |
| 🎂 Age | **Medium** | Children < 10 had highest survival |
| 💵 Fare | **Medium** | Higher fare = better cabin location |
| 👨‍👩‍👧 Family Size | **Low-Medium** | Small families fared better |
| ⚓ Embarkation Port | **Low** | Cherbourg passengers had slight edge |

**Model Accuracy:** ~82% on test set (cross-validated)

---

## 📊 Dataset

- **Source:** [Kaggle Titanic: Machine Learning from Disaster](https://www.kaggle.com/c/titanic)
- **Training Samples:** 891 passengers
- **Features Used:** Pclass, Sex, Age, SibSp, Parch, Fare, Embarked, Title
- **License:** Community Data License Agreement

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 + CSS3 | Structure & Styling |
| Vanilla JavaScript | Interactivity & Logic |
| [Chart.js v4](https://www.chartjs.org/) | Data Visualizations |
| Google Fonts (Cinzel + Inter) | Typography |
| Python + Flask | Backend API (optional) |
| Scikit-learn | ML Model Training |
| Docker | Containerization |
| Google Cloud Run | Deployment |

---

## 🎨 Design System

- **Primary:** `#0a0f2c` (Deep Navy)
- **Accent:** `#00c8ff` (Ocean Cyan)
- **Alert:** `#ff6b2b` (Lifeboat Orange)
- **Success:** `#00e676` (Survival Green)
- **Danger:** `#ff1744` (Iceberg Red)
- **Text:** `#e8f4f8` (Ice White)

---

## 🏆 Credits

| Resource | Credit |
|---|---|
| Dataset | Kaggle Titanic Competition |
| Charts | Chart.js (MIT License) |
| Fonts | Google Fonts (Cinzel, Inter) |
| Background | AI-generated Titanic night scene |
| ML Model | Scikit-learn Logistic Regression |
| Icons | Emoji standard set |

---

## 📝 License

MIT License — feel free to use, modify, and distribute.

---

<div align="center">
  <em>🌊 "In memory of the 1,517 souls who perished — April 15, 1912" 🌊</em>
  <br /><br />
  Made with ❤️ · Powered by Data · Inspired by History
</div>

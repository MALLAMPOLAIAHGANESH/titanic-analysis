# 🚢 Titanic Survival Dashboard

> *"She's gone. She can't stay afloat for long."* — April 15, 1912

A stunning, fully interactive **Titanic Survival Analytics Dashboard** built with vanilla HTML, CSS, and JavaScript. Explore historical survival statistics and predict your own chances aboard the RMS Titanic.

🔗 **Live Demo:** [mallampolaiahganesh.github.io/titanic-analysis](https://mallampolaiahganesh.github.io/titanic-analysis/)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | Live KPI counters: passengers, survivors, gender breakdowns |
| 📈 **6 Charts** | Bar, Doughnut, Line, Pie, and Radar charts via Chart.js |
| 🔮 **Survival Predictor** | Logistic-regression model predicts survival probability |
| 💡 **Feature Importance** | Animated bars showing which factors influenced the prediction |
| 🌊 **Titanic Theme** | Nautical colors, glassmorphism cards, responsive design |
| 📱 **Responsive** | Fully mobile-friendly with hamburger navigation |
| 🎨 **Glassmorphism** | Frosted glass cards with hover effects & micro-animations |

---

## 📁 Project Structure

```
titanic-analysis/
├── src/                         # 📦 All source files
│   ├── index.html               # 🏠 Dashboard homepage (KPIs + Charts)
│   ├── predict.html             # 🔮 Survival prediction page
│   ├── style.css                # 🎨 Master stylesheet (Nautical theme)
│   ├── main.js                  # 📊 Dashboard charts & KPI counters
│   ├── predict.js               # 🧠 Prediction logic & form handler
│   └── titanic_bg.png           # 🌊 Titanic ship background image
├── .github/
│   └── workflows/
│       └── deploy.yml           # 🚀 GitHub Actions — auto deploy to Pages
├── .gitignore
└── README.md                    # 📖 This file
```

---

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/MALLAMPOLAIAHGANESH/titanic-analysis.git
cd titanic-analysis

# Open in browser (no installation needed)
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

> This is a **100% static** frontend project — no backend, no build step required.

---

## ☁️ Deployment — GitHub Pages

This project is deployed automatically via **GitHub Actions** on every push to `main`.

```
Repo → Settings → Pages → Source: GitHub Actions
```

**Live URL:**
```
https://mallampolaiahganesh.github.io/titanic-analysis/
```

---

## 🧠 Prediction Model

The survival predictor uses a client-side **Logistic Regression** simulation based on real Titanic statistics:

| Feature | Impact | Notes |
|---|---|---|
| 🚻 Gender | **High** | Female survival rate: 74% vs Male: 19% |
| 🎟️ Ticket Class | **High** | 1st class: 63%, 3rd class: 24% |
| 🎂 Age | **Medium** | Children < 10 had highest survival |
| 💵 Fare | **Medium** | Higher fare = better cabin location |
| 👨‍👩‍👧 Family Size | **Low-Medium** | Small families fared better |
| ⚓ Embarkation Port | **Low** | Cherbourg passengers had slight edge |

---

## 📊 Dataset

- **Source:** [Kaggle Titanic: Machine Learning from Disaster](https://www.kaggle.com/c/titanic)
- **Training Samples:** 891 passengers
- **Features Used:** Pclass, Sex, Age, SibSp, Parch, Fare, Embarked
- **License:** Community Data License Agreement

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 + CSS3 | Structure & Styling |
| Vanilla JavaScript | Interactivity & Prediction Logic |
| [Chart.js v4](https://www.chartjs.org/) | Data Visualizations |
| Google Fonts (Cinzel + Inter) | Typography |
| GitHub Actions | CI/CD Deployment |
| GitHub Pages | Free Static Hosting |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| Primary | `#0a0f2c` | Deep Navy background |
| Accent | `#00c8ff` | Ocean Cyan highlights |
| Alert | `#ff6b2b` | Lifeboat Orange |
| Success | `#00e676` | Survival Green |
| Danger | `#ff1744` | Iceberg Red |
| Text | `#e8f4f8` | Ice White |

---

## 🏆 Credits

| Resource | Credit |
|---|---|
| Dataset | Kaggle Titanic Competition |
| Charts | Chart.js (MIT License) |
| Fonts | Google Fonts (Cinzel, Inter) |
| Background | AI-generated Titanic night scene |
| Icons | Emoji standard set |

---

## 📝 License

MIT License — feel free to use, modify, and distribute.

---

<div align="center">
  <em>🌊 "In memory of the 1,517 souls who perished — April 15, 1912" 🌊</em>
  <br /><br />
  Made with ❤️ by <a href="https://github.com/MALLAMPOLAIAHGANESH">Mallam Polaiah Ganesh</a> · Powered by Data · Inspired by History
</div>

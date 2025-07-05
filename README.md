# 🚗 TripSift

TripSift is a modern ride aggregator platform that lets users compare and book rides from multiple providers (Uber, Ola, Rapido) at the best price. It features Google Maps-powered autocomplete, authentication, booking history, and a beautiful dark/light theme toggle.

---

## ✨ Features
- **Compare Rides:** Instantly see prices from Uber, Ola, and Rapido and book the cheapest option.
- **Google Maps Autocomplete:** Smart pickup and destination suggestions as you type.
- **Authentication:** Secure registration and login with JWT.
- **Booking History:** View all your past and current bookings in "My Bookings".
- **Dark/Light Theme:** Toggle between beautiful dark and light modes.
- **MongoDB Atlas:** All users and bookings are stored in the cloud for persistence.

---

## 🛠️ Tech Stack
- **Frontend:** React, React Router, @react-google-maps/api, Axios
- **Backend:** Node.js, Express, Mongoose, JWT, bcryptjs
- **Database:** MongoDB Atlas
- **Maps/Autocomplete:** Google Maps JavaScript API, Places API

---

## 🚀 Getting Started

### 1. **Clone the Repository**
```sh
git clone <your-repo-url>
cd ride-aggregator
```

### 2. **Install Dependencies**
```sh
npm run install-all
```

### 3. **Set Up Environment Variables**
- In `server/.env`:
  ```env
  PORT=5000
  MONGODB_URI=your_mongodb_atlas_connection_string
  GOOGLE_MAPS_API_KEY=your_google_maps_api_key
  JWT_SECRET=your_jwt_secret
  ```
- In `client/src/App.js`, set your Google Maps API key:
  ```js
  const GOOGLE_MAPS_API_KEY = 'your_google_maps_api_key';
  ```

### 4. **Start the App**
```sh
npm run dev
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

---

## 📱 Usage
- **Register/Login** to your account.
- **Enter pickup and destination** using Google-powered autocomplete.
- **Compare prices** and book the best ride.
- **View all your bookings** in the "My Bookings" section.
- **Toggle dark/light mode** from the header.

---

## ⚙️ Customization
- **Providers & Pricing:** Edit `server/utils/priceSimulator.js` to adjust base fares, rates, and randomness.
- **Theme:** Edit `client/src/index.css` for custom colors and styles.
- **MongoDB Models:** See `server/models/User.js` and `server/models/Booking.js` for schema customization.

---

## 🌐 Google Cloud Setup
- Enable **Maps JavaScript API** and **Places API** in your Google Cloud Console.
- Create an API key and add it to your `.env` and `App.js` as shown above.
- [Google Maps API Documentation](https://developers.google.com/maps/documentation/javascript/overview)

---

## 🗄️ MongoDB Atlas Setup
- [Create a free cluster](https://www.mongodb.com/cloud/atlas/register)
- Whitelist your IP and get your connection string.
- Add it to `server/.env` as `MONGODB_URI`.

---

## 🧩 Project Structure
```
ride-aggregator/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Theme and Auth context
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # Mongoose models
│   ├── utils/              # Utility functions
│   ├── index.js            # Main server file
│   └── package.json
├── package.json            # Root package.json
└── README.md
```

---

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License
MIT

---

**TripSift** — Find your best ride, every time! 
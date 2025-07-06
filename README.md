<p align="center">
  <img src="public/spade_logo_fixed.svg" alt="SPADE Logo" width="160"/>
</p>
<h1 align="center">SPADE - Satellite Pollution Analysis & Detection Engine</h1>

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 🌍 Overview

SPADE (Satellite Pollution Analysis & Detection Engine) is an advanced air quality monitoring system that combines satellite data, ground-based measurements, and AI-powered predictions to provide real-time pollution analysis across India. Built for the ISRO SPADE Hackathon 2025, this application demonstrates cutting-edge environmental monitoring capabilities.

## ✨ Features

### 🗺️ Interactive Mapping

- **Real-time pollution visualization** with Leaflet.js integration
- **Multi-source data overlay** (INSAT-3D satellite, CPCB ground stations, MERRA-2 meteorological data)
- **Smart search functionality** for cities and regions
- **Customizable map layers** and filtering options
- **Export capabilities** for maps, datasets, and reports

### 📊 Advanced Analytics

- **AI/ML model performance tracking** with R², RMSE, and MAE metrics
- **Multi-source data correlation analysis**
- **Regional performance breakdown** across Indian states
- **Temporal trend analysis** and forecasting

### 🚨 Real-time Monitoring

- **Live pollution alerts** with customizable thresholds
- **3-day pollution forecasting** with confidence intervals
- **Real-time data streaming** from 342+ monitoring stations
- **Automated alert notifications** via email, SMS, and push notifications

### 📈 Data Management

- **Bulk data export** with multiple format support (CSV, JSON, PDF, GeoTIFF)
- **Export history tracking** with download management
- **Data quality metrics** and processing statistics
- **Scheduled export capabilities**

### 👥 User Management

- **Role-based access control** (Admin, Analyst, Viewer)
- **Secure authentication system** with demo accounts
- **Permission-based feature access**
- **User activity tracking**

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AryanXPatel/SPADE-Satellite-Pollution-Analysis-Detection-Engine.git
   cd SPADE-Satellite-Pollution-Analysis-Detection-Engine
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the example environment file to a new local environment file:

   ```bash
   cp .env.example .env.local
   ```

   Open `.env.local` and fill in the required variables, such as `NEXT_PUBLIC_MAPBOX_TOKEN`.

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Accounts

The application includes pre-configured demo accounts for testing:

| Role        | Email                | Password   | Permissions                                               |
| ----------- | -------------------- | ---------- | --------------------------------------------------------- |
| **Admin**   | admin@airwatch.com   | admin123   | Full system access, user management, system configuration |
| **Analyst** | analyst@airwatch.com | analyst123 | Data analysis, export capabilities, report generation     |
| **Viewer**  | viewer@airwatch.com  | viewer123  | Read-only access to public data                           |

## 🏗️ Project Structure

```
spade-air-quality-monitor/
├── app/ # Next.js app directory
│ ├── globals.css # Global styles
│ ├── layout.tsx # Root layout component
│ ├── page.tsx # Home page
│ ├── admin/ # Admin panel pages
│ ├── explorer/ # Data explorer pages
│ ├── forecast/ # Forecast and alerts pages
│ └── performance/ # Model performance pages
├── components/ # Reusable React components
│ ├── ui/ # shadcn/ui components
│ ├── auth/ # Authentication components
│ ├── dashboard.tsx # Main dashboard
│ ├── interactive-map.tsx # Map component
│ ├── navigation.tsx # Navigation bar
│ └── ... # Other feature components
├── hooks/ # Custom React hooks
├── lib/ # Utility libraries
├── utils/ # Helper functions
├── public/ # Static assets
└── types/ # TypeScript type definitions
```

## 🛠️ Technology Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Leaflet.js** - Interactive mapping library

### Data Visualization

- **Recharts** - Chart library for React
- **Lucide React** - Icon library
- **Custom SVG graphics** - For specialized visualizations

### State Management

- **React Hooks** - Built-in state management
- **Context API** - Global state management
- **Local Storage** - Client-side persistence

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📊 Data Sources

SPADE integrates multiple data sources for comprehensive air quality monitoring:

1. **INSAT-3D Satellite Data**
   - Aerosol Optical Depth (AOD) measurements
   - 1km × 1km spatial resolution
   - 4 times daily coverage

2. **CPCB Ground Stations**
   - 342+ monitoring stations across India
   - Hourly PM2.5, PM10, and AQI measurements
   - Real-time data streaming

3. **MERRA-2 Meteorological Data**
   - Global weather reanalysis data
   - Wind speed, humidity, temperature, pressure
   - 0.5° × 0.625° spatial resolution

## 🤖 AI/ML Features

### Model Performance

- **Random Forest** and **XGBoost** ensemble models
- **84.7% accuracy** (R² score) for PM2.5 predictions
- **Real-time model validation** against ground truth data
- **Regional performance analysis** across Indian states

### Forecasting

- **72-hour pollution forecasts** with confidence intervals
- **Weather impact analysis** on pollution levels
- **Automated alert generation** based on predicted exceedances

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```
# Application

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=SPADE

# Map Services

NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_LEAFLET_TILE_URL=https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png

# Database (if using external database)

DATABASE_URL=your_database_connection_string

# API Keys (for production)

CPCB_API_KEY=your_cpcb_api_key
INSAT_API_KEY=your_insat_api_key
MERRA2_API_KEY=your_merra2_api_key

# Authentication (for production)

NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_app_url
```

### Customization

#### Adding New Data Sources

1. Create a new data adapter in `lib/adapters/`
2. Update the data integration pipeline in `utils/data-processing.ts`
3. Add new layer controls in `components/map-controls.tsx`

#### Modifying Alert Thresholds

Update the alert configuration in `components/forecast-alerts.tsx`:

```typescript
const alertThresholds = {
  pm25: {
    good: 30,
    moderate: 60,
    poor: 90,
    veryPoor: 120,
    severe: 250,
  },
};
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository** to Vercel
2. **Configure environment variables** in the Vercel dashboard
3. **Deploy automatically** on every push to main branch

```bash
npm install -g vercel
vercel --prod
```

### Docker

```dockerfile

# Dockerfile included in repository

docker build -t spade-app .
docker run -p 3000:3000 spade-app
```

### Manual Deployment

```bash
npm run build
npm start
```

## 🧪 Testing

### Running Tests

```bash

# Unit tests

npm run test

# E2E tests

npm run test:e2e

# Coverage report

npm run test:coverage
```

### Test Structure

```
tests/
├── **tests**/ # Unit tests
├── e2e/ # End-to-end tests
├── fixtures/ # Test data
└── utils/ # Test utilities
```

## 📈 Performance

### Optimization Features

- **Server-side rendering** with Next.js
- **Image optimization** with Next.js Image component
- **Code splitting** for reduced bundle size
- **Lazy loading** for map components
- **Caching strategies** for API responses

### Performance Metrics

- **Lighthouse Score**: 95+ for Performance, Accessibility, Best Practices
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB gzipped

## 🤝 Contributing

We welcome contributions to SPADE! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run the test suite**
   ```bash
   npm run test
   npm run lint
   ```
6. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request**

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test additions or modifications
- `chore:` - Maintenance tasks

### Code Style

- **ESLint** and **Prettier** are configured for consistent code style
- **TypeScript** is required for all new code
- **Component naming** should use PascalCase
- **File naming** should use kebab-case

## 📝 API Documentation

### Data Endpoints

```typescript
// Get real-time pollution data
GET /api/pollution/realtime
Response: {
stations: Station[],
lastUpdate: string,
summary: PollutionSummary
}

// Get historical data
GET /api/pollution/historical?start=date&end=date
Response: {
data: HistoricalData[],
metadata: DataMetadata
}

// Get forecast data
GET /api/forecast?location=string&hours=number
Response: {
forecast: ForecastData[],
confidence: number,
model: string
}
```

### Export Endpoints

```typescript
// Export map data
POST /api/export/map
Body: ExportOptions
Response: Blob

// Export dataset
POST /api/export/dataset
Body: ExportOptions
Response: Blob
```

## 🔒 Security

### Security Features

- **Input validation** on all user inputs
- **XSS protection** with Content Security Policy
- **CSRF protection** with Next.js built-in features
- **Rate limiting** on API endpoints
- **Secure headers** configuration

### Reporting Security Issues

Please report security vulnerabilities to: security@spade-project.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ISRO** for organizing the SPADE Hackathon 2025
- **CPCB** for providing ground station data
- **NASA** for MERRA-2 meteorological data
- **OpenStreetMap** contributors for map data
- **shadcn/ui** for the excellent component library

## 📞 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Email**: Contact us at support@spade-project.com

### FAQ

**Q: How often is the data updated?**
A: Ground station data is updated every 15 minutes, satellite data 4 times daily.

**Q: Can I use this for commercial purposes?**
A: Yes, under the MIT License terms. Please see the LICENSE file for details.

**Q: How accurate are the predictions?**
A: Our current model achieves 84.7% accuracy (R² score) with ongoing improvements.

**Q: Can I add my own data sources?**
A: Yes! Check the "Adding New Data Sources" section in the documentation.

---

**Built with ❤️ for environmental monitoring and public health**

_SPADE - Making air quality data accessible to everyone_

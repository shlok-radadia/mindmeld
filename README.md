# Agglomeration

Agglomeration is a project designed to provide an interactive cognitive performance tracking system that can measure mental acuity, focus, and memory through simple exercises that require no external devices, only users interaction with the laptop. This README provides an overview of the project's structure and usage.

## Project Structure

```
Agglomeration/
├── dist/                  # Production build files
├── images/                # Image assets
├── node_modules/          # Project dependencies (installed via npm)
├── package-lock.json      # Dependency lock file
├── package.json           # Project metadata and dependencies
├── src/                   # Source code for the project
├── webpack.config.js      # Webpack configuration file
```

## Installation

To get started with this project, follow these steps:

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd Agglomeration
   ```

2. **Install dependencies**
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```
   ```bash
   npm init -y
   ```
   ```bash
   npm i webpack webpack-cli  -D
   ```
   ```bash
   npm install firebase
   ```

## Usage

### Build for Production
Generate optimized production files:
```bash
npm run build
```

## Configuration
The project uses Webpack for module bundling. You can modify the configuration in `webpack.config.js` as needed.

## Acknowledgments
Firebase, Font Awesome

---

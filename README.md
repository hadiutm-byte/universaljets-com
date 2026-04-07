# Universal Jets

## Project Overview
Universal Jets is a robust and scalable jet management system designed to streamline operations and enhance efficiency for jet service providers.

## Features
- **User-friendly Interface**: Intuitive design for easy navigation.
- **Real-time Tracking**: Keep track of jet locations and statuses.
- **Comprehensive Scheduling**: Manage bookings effectively with calendar integrations.
- **Automated Notifications**: Notify users of flight updates and reminders.
- **Analytics Dashboard**: Insights into usage patterns and performance metrics.

![Dashboard Preview](https://via.placeholder.com/800x400)<!-- Replace with an actual screenshot URL -->

## Technological Stack
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Runtime**: Bun
- **Testing Framework**: Vitest and Playwright

## Setup Instructions
1. **Clone the Repository**: `git clone https://github.com/hadiutm-byte/universaljets-com.git`
2. **Install Dependencies**: Navigate to the project directory and run `npm install`.
3. **Configure ENV Variables**: Set up `.env` based on `.env.example` to match your environment.
4. **Start the Application:**
   - Development mode: Use `npm start` to launch the app locally.
   - Production mode: Follow deployment instructions provided below.
5. **Access the Application**: Open a browser and navigate to `http://localhost:3000`.

## Running Tests
- **Unit Tests:** Run `npm run test` to execute unit tests.
- **End-to-End Tests:** Run `playwright test` from the command line.

## Deployment

### Automated Deployment to Hostinger (GitHub Actions)

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds the project and deploys it to Hostinger via FTP every time you push to the `main` branch.

#### One-time Setup

1. **Add GitHub Secrets:**
   Go to your repository on GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**, and add the following secrets:

   | Secret Name           | Description                                                      |
   |-----------------------|------------------------------------------------------------------|
   | `FTP_SERVER`          | Your Hostinger FTP hostname (e.g. `ftp.yourdomain.com`)         |
   | `FTP_USERNAME`        | Your Hostinger FTP username (found in hPanel → FTP Accounts)    |
   | `FTP_PASSWORD`        | Your Hostinger FTP password                                      |
   | `VITE_SUPABASE_URL`   | Your Supabase project URL                                        |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key                           |
   | `VITE_GTM_ID`         | Google Tag Manager ID (optional)                                 |
   | `VITE_GA_ID`          | Google Analytics ID (optional)                                   |

   > **Tip:** Your Hostinger FTP details can be found in hPanel under **Files → FTP Accounts**.

2. **Trigger a deployment:**
   Push any commit to the `main` branch:
   ```bash
   git push origin main
   ```
   The workflow will automatically install dependencies, build the project, and upload the `dist/` folder to `public_html/` on Hostinger.

3. **Monitor the workflow:**
   Go to your repository → **Actions** tab to watch the progress and see logs.

---

### Manual Deployment to Hostinger (Shared Hosting / Static Hosting)

1. **Build the project:**
   ```bash
   npm install
   npm run build
   ```
   This generates a `dist/` folder with all the static files.

2. **Upload to Hostinger:**
   - Log in to your Hostinger control panel (hPanel).
   - Go to **File Manager** (or use FTP/SFTP with FileZilla).
   - Navigate to the `public_html` directory (or your domain's root folder).
   - Upload **all contents** of the `dist/` folder (not the folder itself) to `public_html`.
   - Make sure the `.htaccess` file is included — it enables client-side routing for React Router.

3. **Set environment variables:**
   - If your Hostinger plan supports Node.js, set the environment variables from `.env.example` in your hosting panel.
   - For static hosting, the `VITE_*` variables must be set **before** building (they are baked in at build time).

4. **Verify the `.htaccess` is present:**
   After uploading, confirm that `public_html/.htaccess` exists. This file redirects all requests to `index.html` so that React Router can handle page navigation correctly. Without it, refreshing or directly visiting a URL (e.g., `/about`) will return a 404 error.

5. **Access the site:**
   Open your domain in a browser. If you see a blank page, check the browser console for missing environment variables (e.g., `VITE_SUPABASE_URL`).

### Other Platforms
- **Vercel / Netlify**: Import the repository and set the build command to `npm run build` and publish directory to `dist`.
- **Docker / AWS**: Build the image and serve the `dist/` folder using Nginx or Apache.

## Contributing Guidelines
We welcome contributions from the community! To contribute:
1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/AmazingFeature`.
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`.
4. Push to the branch: `git push origin feature/AmazingFeature`.
5. Open a Pull Request.

## Code of Conduct
Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand expected behavior.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Thank you for considering contributing to Universal Jets!
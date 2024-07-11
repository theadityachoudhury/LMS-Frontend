const requiredEnvVars = [
  "VITE_BACKEND_URL",
  "VITE_FRONTEND_URL",
  "VITE_APP_NAME",
  "VITE_GOOGLE_CLIENT_ID",
];

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !import.meta.env[envVar],
);

if (missingEnvVars.length > 0) {
  console.error(
    `Cannot start the app. Missing environment variables: \n${missingEnvVars.join("\n")}`,
  );
  throw new Error(
    `Missing environment variables: ${missingEnvVars.join(", ")}`,
  );
}

const config = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL as string,
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL as string,
  APP_NAME: import.meta.env.VITE_APP_NAME as string,
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
};

export default config;

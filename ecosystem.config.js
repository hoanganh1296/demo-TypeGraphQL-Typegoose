module.exports = {
  apps: [
    {
      name: "app",
      script:  "src/index.ts",
      instances: "max",
      pid_file: "./pids/app.pid",
      out_file: "./logs/app.log",
      error_file: "./logs/app.err",
      log_date_format: "YYYY-MM-DD HH:mm:ss SSS",
      watch: false,
      autorestart: true,
      exec_mode: "cluster",
      env: {
        
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
    {
      name: "mail-worker",
      script: "src/bull/workers/sendMail.worker.ts",
      instances: 1,
      exec_mode: "cluster",
      max_memory_restart: "100M", // Optional: Restart your app if it reaches 100Mo
      autorestart: true,
    },
  ],
};

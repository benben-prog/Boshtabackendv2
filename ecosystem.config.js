module.exports = {
  apps: [
    {
      name: "jupiter-backend",
      script: "src/server.js",
      instances: "max", // Run 2 instances matching Hostinger KVM 2 (2 vCPU)
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "1500M",
      restart_delay: 3000,
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};

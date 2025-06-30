
// Configuración de URLs del backend
const config = {
  // Variable que alterna entre local y remoto
  isLocal: false,

  // URLs del backend
  urls: {
    local: "http://localhost:5001",
    remote: "https://tpi-devops-bzi6.onrender.com"
  },

  // Getter para obtener la URL base actual
  get baseUrl() {
    return this.isLocal ? this.urls.local : this.urls.remote;
  }
};

export default config;

// Configuración de URLs del backend
const config = {
  // Variable que alterna entre local y remoto
  isLocal: true,

  // URLs del backend
  urls: {
    local: "http://localhost:5001",
    remote: "https://proyectoppvi.onrender.com"
  },

  // Getter para obtener la URL base actual
  get baseUrl() {
    return this.isLocal ? this.urls.local : this.urls.remote;
  }
};

export default config;

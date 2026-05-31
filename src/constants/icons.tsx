// SVG Icons estilo glassmorphism / cloud (ref: Dribbble #6081093)
// Cada icono es SVG puro: formas blancas semitransparentes con efecto glass

export const Icons = {
  // Resumen — gráfico de barras
  chart: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="12" width="4" height="9" rx="1.5" fill="white" fillOpacity="0.9"/>
      <rect x="10" y="7" width="4" height="14" rx="1.5" fill="white" fillOpacity="0.75"/>
      <rect x="17" y="3" width="4" height="18" rx="1.5" fill="white" fillOpacity="0.6"/>
      <rect x="3" y="3" width="18" height="1.5" rx="0.75" fill="white" fillOpacity="0.3"/>
    </svg>
  ),
  // Por Familia — categorías / carpeta
  folder: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 7C2 5.9 2.9 5 4 5H9.5L11.5 7H20C21.1 7 22 7.9 22 9V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V7Z" fill="white" fillOpacity="0.85"/>
      <path d="M2 9H22" stroke="white" strokeOpacity="0.4" strokeWidth="1.5"/>
    </svg>
  ),
  // Por Proveedor — edificio empresa
  building: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="white" fillOpacity="0.2"/>
      <rect x="3" y="3" width="18" height="5" rx="2" fill="white" fillOpacity="0.85"/>
      <rect x="6" y="10" width="3" height="3" rx="0.75" fill="white" fillOpacity="0.9"/>
      <rect x="10.5" y="10" width="3" height="3" rx="0.75" fill="white" fillOpacity="0.9"/>
      <rect x="15" y="10" width="3" height="3" rx="0.75" fill="white" fillOpacity="0.9"/>
      <rect x="6" y="15" width="3" height="3" rx="0.75" fill="white" fillOpacity="0.75"/>
      <rect x="10.5" y="15" width="3" height="3" rx="0.75" fill="white" fillOpacity="0.75"/>
      <rect x="15" y="15" width="3" height="3" rx="0.75" fill="white" fillOpacity="0.75"/>
    </svg>
  ),
  // Por Piso — pisos / capas
  layers: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L22 8L12 13L2 8L12 3Z" fill="white" fillOpacity="0.9"/>
      <path d="M2 12L12 17L22 12" stroke="white" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round"/>
      <path d="M2 16L12 21L22 16" stroke="white" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  // Por Servicio — hospital / cruz
  hospital: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="white" fillOpacity="0.2"/>
      <rect x="10.5" y="5" width="3" height="14" rx="1.5" fill="white" fillOpacity="0.9"/>
      <rect x="5" y="10.5" width="14" height="3" rx="1.5" fill="white" fillOpacity="0.9"/>
    </svg>
  ),
  // Por Producto — caja / paquete
  box: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L21 7.5V16.5L12 21L3 16.5V7.5L12 3Z" fill="white" fillOpacity="0.25"/>
      <path d="M12 3L21 7.5L12 12L3 7.5L12 3Z" fill="white" fillOpacity="0.9"/>
      <path d="M12 12V21" stroke="white" strokeOpacity="0.75" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M21 7.5V16.5L12 21" stroke="white" strokeOpacity="0.65" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 7.5V16.5L12 21" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // Por Fecha — calendario
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="16" rx="2.5" fill="white" fillOpacity="0.2"/>
      <rect x="3" y="5" width="18" height="6" rx="2.5" fill="white" fillOpacity="0.85"/>
      <rect x="6" y="3" width="2" height="4" rx="1" fill="white" fillOpacity="0.9"/>
      <rect x="16" y="3" width="2" height="4" rx="1" fill="white" fillOpacity="0.9"/>
      <rect x="6" y="14" width="2.5" height="2.5" rx="0.5" fill="white" fillOpacity="0.8"/>
      <rect x="10.75" y="14" width="2.5" height="2.5" rx="0.5" fill="white" fillOpacity="0.8"/>
      <rect x="15.5" y="14" width="2.5" height="2.5" rx="0.5" fill="white" fillOpacity="0.8"/>
    </svg>
  ),
  // Esp. Técnicas — documento / especificación
  document: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="2" width="16" height="20" rx="2.5" fill="white" fillOpacity="0.2"/>
      <path d="M4 5.5C4 3.567 5.567 2 7.5 2H14L20 8V18.5C20 20.433 18.433 22 16.5 22H7.5C5.567 22 4 20.433 4 18.5V5.5Z" fill="white" fillOpacity="0.85"/>
      <path d="M14 2L20 8H16C14.895 8 14 7.105 14 6V2Z" fill="white" fillOpacity="0.5"/>
      <rect x="7" y="11" width="10" height="1.5" rx="0.75" fill="white" fillOpacity="0.4"/>
      <rect x="7" y="14" width="7" height="1.5" rx="0.75" fill="white" fillOpacity="0.4"/>
    </svg>
  ),
  // KPI — items / lista
  list: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="18" height="14" rx="2.5" fill="white" fillOpacity="0.2"/>
      <rect x="6" y="8" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.9"/>
      <rect x="10" y="8" width="8" height="2" rx="0.75" fill="white" fillOpacity="0.85"/>
      <rect x="6" y="12" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.9"/>
      <rect x="10" y="12" width="8" height="2" rx="0.75" fill="white" fillOpacity="0.85"/>
      <rect x="6" y="16" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.9"/>
      <rect x="10" y="16" width="5" height="2" rx="0.75" fill="white" fillOpacity="0.85"/>
    </svg>
  ),
  // Unidades / cantidad
  stack: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="15" width="18" height="6" rx="2" fill="white" fillOpacity="0.9"/>
      <rect x="3" y="9" width="18" height="5" rx="2" fill="white" fillOpacity="0.7"/>
      <rect x="3" y="3" width="18" height="5" rx="2" fill="white" fillOpacity="0.5"/>
    </svg>
  ),
  // Recintos / ubicación
  location: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="white" fillOpacity="0.85"/>
      <circle cx="12" cy="9" r="3" fill="white" fillOpacity="0.4"/>
    </svg>
  ),
  // Productos / tipos
  tag: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3H11L21 13L13 21L3 11V3Z" fill="white" fillOpacity="0.85"/>
      <circle cx="7.5" cy="7.5" r="1.5" fill="white" fillOpacity="0.4"/>
    </svg>
  ),
  // Búsqueda / lupa
  search: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" fill="white" fillOpacity="0.85"/>
      <circle cx="11" cy="11" r="4" fill="white" fillOpacity="0.35"/>
      <path d="M16.5 16.5L21 21" stroke="white" strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  // Árbol de carpetas / control de documentos
  tree: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="8" height="5" rx="1.5" fill="white" fillOpacity="0.9"/>
      <rect x="14" y="3" width="8" height="5" rx="1.5" fill="white" fillOpacity="0.6"/>
      <rect x="14" y="16" width="8" height="5" rx="1.5" fill="white" fillOpacity="0.6"/>
      <path d="M10 5.5H13M10 5.5V18.5H13" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="2" y="16" width="8" height="5" rx="1.5" fill="white" fillOpacity="0.9"/>
    </svg>
  ),
  // Catálogo / libro abierto
  catalog: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4C4 2.9 4.9 2 6 2H14L20 8V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4Z" fill="white" fillOpacity="0.85"/>
      <path d="M14 2L20 8H16C14.895 8 14 7.105 14 6V2Z" fill="white" fillOpacity="0.5"/>
      <rect x="7" y="11" width="10" height="1.5" rx="0.75" fill="white" fillOpacity="0.4"/>
      <rect x="7" y="14" width="8" height="1.5" rx="0.75" fill="white" fillOpacity="0.4"/>
      <rect x="7" y="17" width="5" height="1.5" rx="0.75" fill="white" fillOpacity="0.4"/>
    </svg>
  ),
  // Chat IA / burbujas de diálogo
  chat: (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 4C3 2.9 3.9 2 5 2H19C20.1 2 21 2.9 21 4V14C21 15.1 20.1 16 19 16H5C3.9 16 3 15.1 3 14V4Z" fill="white" fillOpacity="0.85"/>
      <path d="M3 16L6 20C6.6 20.6 7.4 21 8.5 21H15.5C16.6 21 17 20.6 17.6 20L20 16" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="7" cy="8" r="1.5" fill="white" fillOpacity="0.4"/>
      <circle cx="12" cy="8" r="1.5" fill="white" fillOpacity="0.4"/>
      <circle cx="17" cy="8" r="1.5" fill="white" fillOpacity="0.4"/>
    </svg>
  ),
};

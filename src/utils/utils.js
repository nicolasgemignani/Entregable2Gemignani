// Importa el módulo 'url' para trabajar con URLs en módulos ES
import { fileURLToPath } from 'url';
// Importa el módulo 'path' para trabajar con rutas de archivos y directorios
import { dirname } from 'path';

// Convierte la URL del módulo actual en una ruta de archivo
const __filename = fileURLToPath(import.meta.url);
// Obtiene el nombre del directorio actual a partir de la ruta de archivo
const __dirname = dirname(__filename);

// Exporta __dirname para su uso en otros módulos
export default __dirname;
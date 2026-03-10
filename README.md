# Invasión Crypto - Sistema de Suscripciones y Contenido

Este proyecto implementa un flujo completo de usuarios y administración para la plataforma **Invasión Crypto**, permitiendo la gestión de membresías Free/Premium y la carga dinámica de contenido.

## 🚀 Flujo de Usuario

1. **Registro**: El usuario crea su cuenta y es redirigido automáticamente a la ventana de inicio de sesión.
2. **Inicio de Sesión**: Al ingresar, el usuario accede a su panel personal.
3. **Plan Free**: 
   - Acceso a videos marcados como "Gratuitos".
   - Los grupos de WhatsApp y contenido Premium aparecen bloqueados (🔒).
4. **Mejora a Premium**: 
   - Botón visible para subir de nivel.
   - **Opciones de Pago**:
     - **Mercado Pago**: Redirección a la plataforma de pago y aviso para enviar comprobante por WhatsApp.
     - **Otros Medios**: Link directo al chat de soporte en WhatsApp.
5. **Aprobación**: Una vez que el administrador valida el pago, el usuario obtiene acceso total al Plan Premium.

## 🛠️ Panel de Administración

El administrador tiene herramientas exclusivas para gestionar la plataforma:
- **Validación de Pagos**: Vista de usuarios pendientes de aprobación que solicitaron el plan Premium.
- **Gestión de Usuarios**: Lista completa de usuarios con posibilidad de activar/desactivar membresías Premium manualmente.
- **Gestión de Contenido**: 
  - Carga de nuevos videos con Título, Detalle y URL.
  - Opción de marcar video como **Premium** o **Free**.
  - Eliminación de contenido existente.

## 🧪 Pruebas y Simulación (LocalStorage)

El sistema utiliza `localStorage` para persistir los datos localmente en el navegador, permitiendo una experiencia funcional sin necesidad de backend en esta etapa.

### Credenciales de Prueba:
- **Administrador**:
  - **Email**: `admin@invasion.com`
  - **Password**: `admin`
- **Usuario Invitado**:
  - **Email**: `user@test.com`
  - **Password**: `user`

---

## 📁 Tecnologías Utilizadas
- **HTML5 & Vanilla CSS**: Estructura y diseño premium.
- **JavaScript (ES6+)**: Lógica de autenticación, filtrado de contenido y gestión de estados.
- **LocalStorage API**: Simulación de base de datos persistente.
- **Integraciones**: Mercado Pago y WhatsApp.

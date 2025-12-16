# Implementación de DAO en Blockchain

Este proyecto consiste en la implementación de una **Organización Autónoma Descentralizada (DAO)** simple junto con su propio **Governance Token** (ERC-20). Permite a los titulares de tokens crear propuestas y votar sobre ellas, donde el poder de voto es proporcional a la cantidad de tokens que poseen.

## Información del Estudiante y Curso

**Alumno:** Marcelo Crisóstomo Carrasco  
**Curso:** Curso de Capacitación Blockchain  
**Instructor:** Heber Herraz B.  
**Institución:** Universidad de Chile

---

## Contexto del Proyecto

El proyecto demuestra los conceptos fundamentales de la gobernanza 'On-Chain':
*   **GovernanceToken:** Un contrato inteligente ERC-20 que representa el poder de voto.
*   **SimpleDAO:** Un contrato inteligente que administra las propuestas y el conteo de votos.

### Funcionalidades:
1.  **Tokens de Gobernanza:** Se emiten tokens que se utilizan para votar.
2.  **Gestión de Propuestas:** Cualquier usuario puede crear una propuesta para ser votada (en esta versión simplificada).
3.  **Sistema de Votación:** Los usuarios votan en las propuestas, y sus votos se ponderan según su saldo de tokens.
4.  **Prevención de Doble Voto:** El contrato asegura que una dirección no pueda votar más de una vez en la misma propuesta.

---

## Pasos para la Instalación

Sigue estos pasos para clonar y preparar el entorno localmente:

### 1. Clonar el Repositorio
Abre tu terminal y ejecuta el siguiente comando:

```bash
git clone <URL_TU_REPOSITORIO>
cd DAO-blockchain
```

### 2. Instalar Dependencias
Instala las librerías necesarias del proyecto (Hardhat, Ethers, OpenZeppelin, etc.):

```bash
npm install
```

---

## Compilación y Ejecución

### Compilar los Contratos
Para asegurarte de que todo el código Solidity es correcto y generar los artefactos necesarios:

```bash
npx hardhat compile
```

### Desplegar en una Red Local (Hardhat Network)
Puedes desplegar los contratos en la red efímera de Hardhat para probar la interacción:

```bash
npx hardhat run scripts/deploy-local.ts
```

*Nota: También hay un script de demostración disponible:*
```bash
npx hardhat run scripts/demo-dao.ts
```

---

## Pruebas (Testing)

El testing es fundamental para asegurar la seguridad de los contratos inteligentes.

### Ejecutar Pruebas Existentes
El proyecto incluye un set de pruebas en la carpeta `test/`. Para ejecutarlas:

```bash
npx hardhat test
```

### Cómo Agregar Nuevas Pruebas
1.  Crea un nuevo archivo `.js` o `.ts` dentro de la carpeta `test/` (ej: `test/NuevasPruebas.test.js`).
2.  Importa las librerías necesarias (`chai`, `hardhat`).
3.  Define tus casos de prueba usando `describe` y `it`.

**Ejemplo de estructura de prueba:**

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Mis Nuevas Pruebas", function () {
  it("Debería hacer algo específico...", async () => {
    // 1. Setup (Deploy contratos)
    // 2. Acción (Llamar función)
    // 3. Assert (Verificar resultado con expect)
  });
});
```

Una vez creado el archivo, simplemente ejecuta `npx hardhat test` nuevamente y Hardhat incluirá tus nuevos tests automáticamente.

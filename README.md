# URL Shortener

Un projet Full-Stack de raccourcisseur d'URL. 

## Technologies utilisées

- **Backend** : Node.js, NestJS, Prisma ORM, PostgreSQL (via Docker)
- **Frontend** : Next.js, TailwindCSS
- **Déploiement & Conteneurisation** : Docker, Docker Compose

---

## Lancement avec Docker

Pour démarrer tout le projet en même temps, On utilisera Docker Compose.

### Prérequis
- [Docker](https://www.docker.com/get-started) et [Docker Compose](https://docs.docker.com/compose/install/) installés sur la machine.

### Instructions
1. Clonez le dépôt et placez-vous à la racine du projet:
   ```bash
   git clone https://github.com/Rafi-Bettaieb/url-shortener
   cd url-shortener
   ```  
2. Lancez la commande suivante pour construire et démarrer les conteneurs :
   ```bash
   docker-compose up --build

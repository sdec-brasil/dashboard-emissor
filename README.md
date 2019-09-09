# SDEC: Dashboard

🇧🇷 O repositório contém a estrutura por trás do painel de controle público do sistema fornecido pela Fundação. Aqui está armazenado ambas as API's e a interface gráfica.

🇺🇸 This repo hosts the source code behind the public explorer, containing both API's and also the GUI.

## 📝 Documentação

A [documentação](https://sdec.readme.io) do projeto possui:

- Explicações sobre a arquitetura do sistema
- Referência para as API's
- Fluxos para as diferentes ações do sistema
- Sobre a Fundação
- ++++

## 🥣 Sopa de Letrinhas

**API**: Node + Express + GraphQL + Sequelize + RestAdapter + Postgres
**WebApp**: React + Redux

## ▶️ Rodando
- Clone o repositório
- Instale os módulos NPM da API `cd api` e `npm install`
- Instale os módulos NPM do WebApp `cd web` e `npm install`
- Modifique `/api/src/config/database.json` pelas credenciais do Banco de Dados
- Modifique `/api/src/config/config.json` pela porta da API (opcional)
- Modifique `/web/.env` pela porta web (opcional)
- Rode a API `cd api` e `npm start`, visite @ http://localhost:8000/graphql/
- Rode o Webapp `cd web` e `npm start`, visite @ http://localhost:3000/

## ▶️ Rodando para Desenvolvimento
- Crie uma pasta para os repositórios do projeto:
  - `mkdir dashboard-dev && cd dashboard-dev`
- Clone o repositório @ https://github.com/sdec-brasil/docker-dashboard-emissor
  - `git clone https://github.com/sdec-brasil/docker-dashboard-emissor`
- Rode o arquivo setup.sh do docker-dashboard-emissor:
  - `cd docker-dashboard-emissor && chmod +x setup.sh && ./setup.sh && cd ..`
- Clone esse repositório:
  - `git clone https://github.com/sdec-brasil/dashboard-emissor`
- Instale os módulos NPM da API:
  - `cd dashboard-emissor && cd api && npm install && cd ../..`
- Instale os módulos NPM do WebApp:
  - `cd dashboard-emissor && cd web && npm install && cd ../..`
- Copie o `index.js` e `styles.css` do uik para a pasta `dashboard-emissor/web/@uik`
- Deixe o ambiente do docker rodando com:
  - `cd docker-dashboard-emissor && docker-compose up`
- Em outro terminal, rode a API:`cd dashboard-emissor/api && npm start`. (@ http://localhost:8000)
- Em outro terminal, rode o webapp:`cd dashboard-emissor/web && npm start`. ( @ http://localhost:3000)



## 🏗 Estrutura do Projeto
    dashboard
      ├── api 
      │   ├── src
      │   │   ├── config
      │   │   ├── models
      │   │   ├── schema
      │   │   ├── setup
      │   │   └── index.js
      │   │
      │   └── package.json
      │
      ├── web 
      │   ├── public
      │   ├── src
      │   │   ├── components
      │   │   ├── setup
      │   │   └── index.js
      │   │
      │   ├── .env
      │   └── package.json
      │
      ├── .gitignore
      └── README.md

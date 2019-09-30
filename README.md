# SDEC: Dashboard

🇧🇷 O repositório contém um sistema que facilita a emissão de nota fiscal para quem não deseja lidar diretamente com a blockchain. Esse repositório também serve de exemplo para terceiros que queiram prestar o serviço de emissão de notas em nome de outras empresas na blockchain. Aqui está armazenada tanto a API quanto a interface gráfica.

🇺🇸 This repo hosts the source code of a system that eases the emittion of invoices for users that do not want do interact directly with the blockchain. It is also an example of how to build a system to provide the service of registering invoices to the blockchain in name of other individuals and companies. This repo contains both API's and also the GUI.

## 📝 Documentação

A [documentação](https://sdec-brasil.github.io/docs/#invoice-explorer) do projeto possui:

- Explicações sobre a arquitetura do sistema
- Referência para as API's
- Fluxos para as diferentes ações do sistema
- Sobre a Fundação
- ++++

## 🥣 Sopa de Letrinhas

**API**: Node + Express + Sequelize + RestAdapter + MySql
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

## ▶️ Como funciona?
  Esse projeto é composto de um servidor e uma interface, onde usuários podem se registrar e emitir notas que são registradas na blockchain. Para isso, o projeto roda um nó da blockchain. Ele também utiliza o invoice-explorer público da chain.
  O fluxo de um usuário é o seguinte:
  1. 0 usuário se registra no dashboard-emissor.
  2. O usuário gera um novo endereço pelo dashboard-emissor.
  3. O usuário requisita a que a junta comercial autorize esse novo endereço a emitir notas fiscais em nome de alguma empresa dele.
  4. A junta comercial autoriza essa emissão, e publica a autorizaço na blockchain.
  5. O dashboard-emissor detecta essa autorização. Quando o usuário acessar a página de Empresas, a empresa autorizada estará listada lá.
  6. O usuário acessa Notas Fiscais e pode emitir uma nova nota fiscal para alguma de suas empresas cadastradas.
  7 O dashboard-emissor registra na blockchain a nova nota emitida pelo usuário.
  

## ▶️ Próximo passos?
  Os próximos passos são construir a parte do sistema de notas de pagamento. Uma nota de pagamento representa o pagamento do imposto de um conjunto de notas fiscais. Com isso, o usuário poderá pagar diversas notas de uma só vez.


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

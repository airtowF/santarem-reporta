# Santarém Reporta 📍

> **Mapeamento comunitário de infraestrutura e problemas urbanos em Santarém-PA.**

O **Santarém Reporta** é uma plataforma _Civic Tech_ projetada para encurtar o caminho entre a reclamação do cidadão e o atendimento da prefeitura. O morador registra a ocorrência no mapa interativo, o sistema faz o roteamento automático para a secretaria responsável e o cidadão acompanha a resolução por protocolo público.

![Status](https://img.shields.io/badge/status-MVP-green)
![Stack](https://img.shields.io/badge/stack-HTML5%20%7C%20JS%20%7C%20Firebase%20%7C%20Leaflet-0e7490)
![PWA](https://img.shields.io/badge/PWA-instalável-1b5e3b)
![Licença](https://img.shields.io/badge/licença-MIT-blue)

---

## 📋 Sumário

- [Demonstração](#-demonstração)
- [Por que Existe](#-por-que-existe)
- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Instalação Local](#-instalação-local)
- [Arquitetura e Banco de Dados](#-arquitetura-e-banco-de-dados)
- [Trabalho em Grupo](#-trabalho-em-grupo)
- [Licença](#-licença)

---

## 🎥 Demonstração

![Fluxo do App - Santarém Reporta](https://i.imgur.com/bkAPZ5V.png)

- `pages/cidadao/home.html`: Mapa interativo de navegação rápida.
- `pages/cidadao/reportar.html`: Formulário de envio (tipo, GPS, foto, descrição).
- `pages/cidadao/sucesso.html`: Confirmação com geração de protocolo.
- `pages/servidor/painel-servidor.html`: Painel administrativo por secretaria.

> ⚠️ **Aviso de execução:** Enquanto as imagens demonstrativas não são carregadas no repositório, rode o projeto localmente com **Live Server** na ordem: `index.html` → `pages/cidadao/login.html` → `pages/cidadao/home.html`.

---

## 🎯 Por que Existe

Santarém concentra demandas de vias públicas, lixo, iluminação, trânsito e meio ambiente em secretarias separadas. Sem um canal centralizado, os relatos dos cidadãos se perdem em conversas de WhatsApp ou atendimentos presenciais.

A plataforma resolve isso ao:

- **Padronizar o envio:** Exige dados mínimos (localização, foto, categoria e protocolo).
- **Automação de triagem:** Encaminha a denúncia automaticamente para SEMINFRA, SEMURB, SMT ou SEMMA.
- **Transparência:** Devolve o status em tempo real ao cidadão (`pendente` → `em_analise` → `em_andamento` → `resolvido`).
- **Histórico centralizado:** Registra mensagens diretas entre o morador e o servidor público.

> ℹ️ **Regra de Negócio:** Se um problema antigo voltar a acontecer após ter sido marcado como _resolvido_, o morador deve abrir uma **nova** denúncia. Denúncias encerradas não são reabertas.

---

## ⚡ Funcionalidades

- **Geolocalização:** Pinagem manual ou GPS automático no mapa (Leaflet + OpenStreetMap) gravando `lat` / `lng`.
- **Upload de Mídia:** Upload de fotos de comprovação armazenadas no Firebase Storage.
- **Gerador de Protocolo:** Código exclusivo gerado no envio (ex: `SR-2026-000123`).
- **Painéis por Perfil:**
  - **Cidadão:** Filtra e acompanha apenas as próprias denúncias.
  - **Servidor:** Visualiza e responde apenas às demandas direcionadas à sua secretaria.
  - **Admin:** Acesso global aos dados de toda a cidade.
- **Chat Integrado:** Troca de mensagens vinculada à denúncia (`mensagens/{id}`).
- **Suporte PWA:** Instalável diretamente no Android pelo navegadores (Chrome → _Instalar aplicativo_), sem necessidade de app store.
- **Privacidade:** Autenticação por e-mail/senha. O cidadão acessa exclusivamente denúncias atreladas ao seu `cidadaoId`. _(Modo anônimo não suportado neste MVP)_.

---

## 🛠️ Stack Tecnológica

| Camada             | Tecnologia / Serviço                                                 |
| :----------------- | :------------------------------------------------------------------- |
| **Interface**      | HTML5, CSS3, JavaScript Vanilla (Sem frameworks)                     |
| **Mapa**           | Leaflet.js + Tiles OpenStreetMap                                     |
| **Autenticação**   | Firebase Authentication (E-mail e Senha)                             |
| **Banco de Dados** | Cloud Firestore                                                      |
| **Armazenamento**  | Firebase Storage                                                     |
| **Mobile / PWA**   | Web App Manifest (`manifest.webmanifest`) + Service Worker (`sw.js`) |
| **Hospedagem**     | Firebase Hosting ou Servidor Estático                                |

> 📌 **Nota:** Esta aplicação não requer `npm install`, backend Node.js nem bancos relacionais como PostgreSQL.

---

## 🚀 Instalação Local

1. Clone o repositório:

```bash
git clone [https://github.com/airtowF/santarem-reporta.git](https://github.com/airtowF/santarem-reporta.git)
cd santarem-reporta
```

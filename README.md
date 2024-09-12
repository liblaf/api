# liblaf's API

[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/liblaf/api/ci.yaml)](https://github.com/liblaf/api/actions/workflows/ci.yaml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fapi.liblaf.me)](https://api.liblaf.me)

## Endpoints

Detailed API documentation can be found [here](https://api.liblaf.me).

### Bot

- `POST /bot/send/{id}`: send a message to chat
- `POST /bot/send/{id}/dns`: send a DNS update message to chat
- `GET  /bot/webhook`: set Telegram bot webhook
- `POST /bot/webhook`: Telegram bot webhook

### Subscription

- `GET  /rules/{client}/{type}/{filename}`: download rules
- `GET  /sub/dummy/{type}/{name}`: get dummy subscription
- `GET  /sub/{id}/info`: get subscription user info
- `GET  /sub/{id}/sing-box`: get subscription sing-box config

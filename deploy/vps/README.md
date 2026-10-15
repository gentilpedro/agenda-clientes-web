# Deploy na VPS

- **URL:** https://agenda.aamora.com.br (Cloudflare → Nginx do host → `127.0.0.1:5102` → container)
- **Na VPS:** `/opt/agenda/` (`docker-compose.yml`, `deploy.conf`, `.version`) e `/etc/nginx/conf.d/agenda.conf`.
- **Imagem:** SPA estática servida por `nginx-unprivileged` (`spa.conf`), health em `/health`. Sem banco e sem segredos.
- **API:** https://agenda-api.aamora.com.br (app `agenda-api`). O endereço entra no bundle pela variável
  do repositório `VITE_API_URL` (`https://agenda-api.aamora.com.br/api`) na hora do build.

## Como sai uma versão

Merge na `main` → `release.yml` calcula a versão e cria a tag/release → job `deploy-vps` monta a
imagem, envia por SSH e roda `app-deploy agenda up <versão>`. Se o `/health` não responder, o
`app-deploy` volta sozinho para a versão anterior.

## Operação

```bash
ssh vps 'app-deploy agenda status'      # versão no ar e imagens guardadas (as 3 últimas)
ssh vps 'app-deploy agenda up 0.3.0'    # rollback para uma imagem guardada
```

Os arquivos desta pasta não vão sozinhos para o servidor: mudou `docker-compose.yml`, `deploy.conf`
ou `nginx.conf`, rode de novo o `preparar_app.sh agenda` da skill deploy-vps.

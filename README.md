# TSAE — Consultoria + Educa

Next.js (App Router) · TypeScript · Tailwind · Drizzle · Neon PostgreSQL · Better Auth (+MFA TOTP) · Zod · Vitest

## Marca por área
- Consultoria (/): public/assets/logo-tsae.png + logo.ico (definidos em src/app/layout.tsx)
- Educa (/educa): public/assets/logo-educa.png + logo-educa.ico (definidos em src/app/educa/layout.tsx)

## Executar localmente
1. cp .env.example .env.local e preencher DATABASE_URL (Neon), BETTER_AUTH_SECRET (openssl rand -base64 32), ADMIN1_* (ADMIN2_* opcional)
2. npm install
3. npm run db:migrate        # aplica drizzle/*.sql
4. npm run db:seed           # 10 cursos (PENDING_REVIEW), categorias, módulos, aulas e 100 palavras-chave
5. npm run admins:create     # cria um ou dois admins; depois ative o MFA em /admin/seguranca
6. npm run dev
Testes: npm test (Vitest + PostgreSQL em memória) · npm run lint (tsc) · npm run check:data

## Deploy na Vercel
1. Subir o repositório no GitHub e importar na Vercel.
2. Em Settings > Environment Variables: DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL (URL pública), NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_WHATSAPP, BLOB_READ_WRITE_TOKEN (quando houver upload).
3. Rodar db:migrate, db:seed e admins:create uma vez, localmente, apontando para o Neon de produção.
4. Vercel Hobby é para uso pessoal/não comercial; migrar para plano adequado antes da operação comercial. Neon gratuito pode suspender por inatividade e tem limites de armazenamento/conexões.

## Backup e restauração (PostgreSQL)
pg_dump "$DATABASE_URL" -Fc -f tsae.dump
pg_restore --no-owner --clean -d "$NEW_DATABASE_URL" tsae.dump
Guarde o dump fora do ambiente de produção. O schema é PostgreSQL padrão, portável para outro provedor.

## Painel (/admin)
Dashboard, Cursos (preço/status), Inscrições, SEO, Carrosséis, Blog, Mídia (upload em Vercel Blob), Auditoria, Segurança (MFA).
Admins criados por script têm troca de senha obrigatória no primeiro acesso (/admin/trocar-senha).
Catálogo público: com DATABASE_URL só mostra cursos PUBLISHED; sem banco usa o rascunho em arquivo (demonstração).

## Cursos ao vivo (flyers)
Imagens em public/assets/cursos/ (carregadas no banco pelo seed como media_assets locais; troque por Vercel Blob em Admin > Mídia).
Datas/horários/ministrantes vêm dos flyers. Estado exibido: Inscrições abertas / Esgotado / Encerrado (turma já realizada) / Em breve.
Contatos padrão (WhatsApp (47) 99224-8189, tsaeconsultoria@gmail.com) em src/lib/contact.ts.

## Testes
npm test (Vitest, 25 testes, PostgreSQL em memória) · npm run e2e (Playwright: requer `npx playwright install chromium`)

## Limitações conhecidas
Rate limit do contato é em memória (por instância). Recuperação de senha depende de provedor de e-mail (não configurado). Confirmação de vagas é atômica em SQL.

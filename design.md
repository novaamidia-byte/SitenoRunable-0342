# Nova Mídia — Design

## Direção aprovada e prioritária
Nova versão editorial diferente do original; objetivo principal: portfólio. Serviços apoiam os trabalhos. Repertório analisado: Porto Rocha (prioridade aos trabalhos), Collins (tipografia e redução), Mucho (impacto editorial). Não copiar layouts ou usar imagens de trabalhos dessas empresas.

Azul-marinho #212F4A, creme #F1E5B1, branco e preto. Rubik para títulos, DM Sans para corpo. Tipografia expressiva, grid assimétrico, linhas finas, cantos de 12–24px, sem gradientes ou animações excessivas. Reserva de logomarca substituível pelo arquivo oficial, sem marca inventada.

Início: abertura tipográfica curta, principais serviços imediatamente visíveis, projetos reais com estado vazio compacto, serviços e apresentação institucional. /projetos: filtros, busca, ordenação, grid editorial e detalhes. /servicos: categorias, descrições concretas e elementos tipográficos. /sobre e /contato: mesma identidade. Sem inventar projetos, canais, resultados ou clientes.

Rodapé preservado: quatro colunas originais (descrição/logomarca, Navegação, Serviços, Contato), listas originais, fundo azul-marinho e textos creme; faixa inferior copyright e acesso da equipe. Apenas responsividade e reserva de logo.

Cabeçalho compacto com hambúrguer. Menu com foco preso, Escape e fechamento por rota. Breakpoints 640/900/1200, contraste acessível e prefers-reduced-motion. Carregamento e erro explícitos. Sem imagens fictícias de portfólio.

Administração: Better Auth por e-mail/senha; /auth com login e instalação inicial, /admin protegido no servidor e cliente. Primeira conta exige ADMIN_SETUP_KEY no servidor, cadastro público bloqueado e instalação encerrada após primeiro administrador. CRUD de projetos, upload Tigris, confirmação de exclusão, publicação/destaque e conteúdo editável. Segredos apenas no .env.

Arquivos: componentes compartilhados em src/web/components, páginas em src/web/pages, hooks em src/web/queries; features oRPC portfolio, settings, administration e upload. Banco projects/site_content/admin_users, mais schema Better Auth.


## Alternativa de menu — referência Hotmart
Escopo confirmado: mudar somente o painel aberto pelo hambúrguer. Manter todas as páginas, rodapé, APIs, projetos e administração. Menu original permanece em todas as rotas atuais; alternativa em /alternativa com as mesmas páginas em contexto aninhado. Link de comparação dentro dos menus. Painel claro flutuante, faixa de introdução e colunas: portfólio prioritário, categorias, serviços e estúdio. Azul-marinho/creme, Rubik/DM Sans, sem cores ou conteúdo da Hotmart. Versão original preservada também em .runable/backups/menu-original.zip. Navegação deve manter a variante, fechar ao navegar e com Escape, reter foco, permitir rolagem interna em mobile e bloquear rolagem de fundo.

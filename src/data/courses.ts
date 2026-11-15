// Conteúdo inicial em RASCUNHO (PENDING_REVIEW). Preços são SUGESTÕES comerciais editáveis; não aprovados pela TSAE.
// Resumos de aula são ponto de partida: o texto completo deve ser revisado/expandido por especialista da TSAE.
export type Course = {
  startsAt?: string; format?: string; instructors?: string[]; soldOut?: boolean; image?: string; gallery?: string[]; live?: boolean;
  slug: string; title: string; subtitle: string; category: string; hours: number; priceBrl: number | null; description: string;
  objectives: string[]; audience: string; prerequisites: string; references: string[];
  modules: { title: string; lessons: { title: string; summary: string }[] }[];
  quiz: { q: string; options: string[]; answer: number }[];
};

const REF_BASE = ["Lei nº 1.283/1950 (inspeção industrial e sanitária de produtos de origem animal)", "Decreto nº 9.013/2017 (RIISPOA)", "Legislação e normas vigentes do MAPA (conferir versões atuais em gov.br/agricultura)"];

export const courses: Course[] = [
  { slug: "fundamentos-inspecao-produtos-origem-animal", title: "Fundamentos da Inspeção de Produtos de Origem Animal", subtitle: "Base conceitual e legal da inspeção sanitária", category: "Inspeção sanitária", hours: 20, priceBrl: 490,
    description: "Introdução à inspeção de produtos de origem animal: conceitos, base legal, competências e a lógica da inspeção ao longo da cadeia produtiva.",
    objectives: ["Compreender a finalidade da inspeção sanitária", "Identificar a base legal aplicável", "Reconhecer as etapas da cadeia de produtos de origem animal"],
    audience: "Estudantes, técnicos e profissionais iniciantes na indústria de alimentos.", prerequisites: "Nenhum.", references: REF_BASE,
    modules: [
      { title: "Conceitos e base legal", lessons: [{ title: "O que é inspeção de produtos de origem animal", summary: "Objetivos da inspeção, saúde pública e proteção ao consumidor." }, { title: "Panorama da legislação", summary: "Visão geral da lei, do regulamento e das normas complementares." }] },
      { title: "Cadeia produtiva", lessons: [{ title: "Do campo ao consumidor", summary: "Etapas da cadeia e pontos em que a inspeção atua." }, { title: "Tipos de produtos", summary: "Carnes, pescado, leite, ovos e mel: particularidades gerais." }] },
      { title: "Prática profissional", lessons: [{ title: "Documentação e registros", summary: "Importância dos registros e da rastreabilidade." }, { title: "Estudo de caso didático", summary: "Análise de um cenário fictício de não conformidade e sua tratativa." }] },
    ],
    quiz: [{ q: "Qual a finalidade central da inspeção sanitária?", options: ["Aumentar preços", "Proteger a saúde do consumidor", "Reduzir a produção"], answer: 1 }, { q: "Os registros ajudam principalmente na:", options: ["Rastreabilidade", "Decoração", "Publicidade"], answer: 0 }] },
  { slug: "introducao-ao-sif", title: "Introdução ao Serviço de Inspeção Federal (SIF)", subtitle: "Como funciona o SIF e o que esperar do processo", category: "Regulamentação", hours: 24, priceBrl: 590,
    description: "Visão geral do SIF, seu papel regulatório, requisitos gerais para estabelecimentos e etapas de relacionamento com o serviço oficial.",
    objectives: ["Entender o papel do SIF", "Conhecer requisitos gerais de estabelecimentos", "Organizar a documentação de forma estruturada"],
    audience: "Gestores, responsáveis técnicos e consultores iniciantes.", prerequisites: "Noções básicas de indústria de alimentos.", references: REF_BASE,
    modules: [
      { title: "O SIF no sistema regulatório", lessons: [{ title: "Competências do SIF", summary: "Onde o SIF se insere frente a outros serviços de inspeção." }, { title: "Abrangência e comércio", summary: "Relação entre inspeção federal e comercialização." }] },
      { title: "Requisitos gerais", lessons: [{ title: "Estrutura e instalações", summary: "Princípios gerais de instalações e fluxos." }, { title: "Responsabilidades da empresa", summary: "Deveres do estabelecimento e do responsável técnico." }] },
      { title: "Relacionamento com o serviço oficial", lessons: [{ title: "Auditorias e verificações", summary: "Como se preparar e responder a verificações oficiais." }, { title: "Estudo de caso didático", summary: "Planejamento de adequação para um estabelecimento fictício." }] },
    ],
    quiz: [{ q: "O responsável técnico atua principalmente:", options: ["Garantindo conformidade técnica", "Definindo preços", "Fazendo publicidade"], answer: 0 }, { q: "Preparar-se para auditorias exige:", options: ["Improviso", "Documentação organizada", "Nada específico"], answer: 1 }] },
  { slug: "regulamentacao-adequacao-estabelecimentos-mapa", title: "Regulamentação e Adequação de Estabelecimentos ao MAPA", subtitle: "Do diagnóstico regulatório ao plano de adequação", category: "Regulamentação", hours: 30, priceBrl: 790,
    description: "Como interpretar exigências do MAPA, diagnosticar lacunas e estruturar um plano de adequação documental e operacional.",
    objectives: ["Interpretar exigências regulatórias", "Realizar diagnóstico de conformidade", "Elaborar plano de adequação priorizado"],
    audience: "Consultores, gestores de qualidade e responsáveis técnicos.", prerequisites: "Conhecimento básico de regulamentação de alimentos.", references: REF_BASE,
    modules: [
      { title: "Leitura de normas", lessons: [{ title: "Hierarquia normativa", summary: "Leis, decretos, instruções e portarias." }, { title: "Atualização normativa", summary: "Como acompanhar mudanças em fontes oficiais." }] },
      { title: "Diagnóstico", lessons: [{ title: "Checklist de conformidade", summary: "Montagem de um diagnóstico por requisito." }, { title: "Classificação de lacunas", summary: "Priorização por risco e prazo." }] },
      { title: "Plano de adequação", lessons: [{ title: "Cronograma e responsáveis", summary: "Plano de ação com metas verificáveis." }, { title: "Estudo de caso didático", summary: "Adequação de um estabelecimento fictício." }] },
    ],
    quiz: [{ q: "Lacunas devem ser priorizadas por:", options: ["Sorteio", "Risco e prazo", "Ordem alfabética"], answer: 1 }, { q: "Fonte confiável de normas:", options: ["Rumores", "Portais oficiais", "Redes sociais"], answer: 1 }] },
  { slug: "bpf-industria-alimentos", title: "Boas Práticas de Fabricação (BPF) na Indústria de Alimentos", subtitle: "Higiene, instalações e controle operacional", category: "Segurança dos alimentos", hours: 20, priceBrl: 420,
    description: "Princípios de BPF aplicados à rotina da indústria: higiene pessoal, instalações, controle de pragas, limpeza e sanitização.",
    objectives: ["Aplicar princípios de BPF", "Identificar perigos de contaminação", "Estruturar rotinas de higienização"],
    audience: "Operadores, supervisores e analistas de qualidade.", prerequisites: "Nenhum.", references: ["Normas e regulamentos sanitários vigentes aplicáveis ao estabelecimento", "Manuais técnicos de BPF de entidades oficiais"],
    modules: [
      { title: "Fundamentos de BPF", lessons: [{ title: "Perigos biológicos, químicos e físicos", summary: "Origem e prevenção de contaminações." }, { title: "Higiene pessoal", summary: "Hábitos, uniformes e controle de saúde." }] },
      { title: "Instalações e processos", lessons: [{ title: "Layout e fluxo", summary: "Prevenção de contaminação cruzada." }, { title: "Controle integrado de pragas", summary: "Princípios e monitoramento." }] },
      { title: "Limpeza e sanitização", lessons: [{ title: "Etapas da higienização", summary: "Ordem das etapas e verificação." }, { title: "Estudo de caso didático", summary: "Investigação de contaminação cruzada fictícia." }] },
    ],
    quiz: [{ q: "Contaminação cruzada é prevenida por:", options: ["Fluxo adequado", "Mais velocidade", "Menos registros"], answer: 0 }, { q: "Perigos podem ser:", options: ["Só físicos", "Biológicos, químicos e físicos", "Só químicos"], answer: 1 }] },
  { slug: "autocontrole-seguranca-alimentos", title: "Programas de Autocontrole e Segurança dos Alimentos", subtitle: "Estruturação, monitoramento e verificação", category: "Segurança dos alimentos", hours: 30, priceBrl: 690,
    description: "Como estruturar programas de autocontrole: procedimentos, monitoramento, ações corretivas, registros e verificação.",
    objectives: ["Estruturar programas de autocontrole", "Definir monitoramento e ações corretivas", "Montar evidências e registros"],
    audience: "Qualidade, responsáveis técnicos e consultores.", prerequisites: "Noções de BPF.", references: REF_BASE,
    modules: [
      { title: "Conceitos", lessons: [{ title: "O que são programas de autocontrole", summary: "Papel dentro do sistema de segurança dos alimentos." }, { title: "Análise de perigos", summary: "Identificação e avaliação de perigos." }] },
      { title: "Implantação", lessons: [{ title: "Procedimentos e monitoramento", summary: "Escrita de procedimentos e frequências." }, { title: "Ações corretivas", summary: "Tratamento de desvios e causas-raiz." }] },
      { title: "Verificação", lessons: [{ title: "Registros e evidências", summary: "Organização para auditorias." }, { title: "Estudo de caso didático", summary: "Revisão de um programa fictício." }] },
    ],
    quiz: [{ q: "Ação corretiva é aplicada quando:", options: ["Há desvio", "Tudo está conforme", "Nunca"], answer: 0 }, { q: "Registros servem para:", options: ["Evidenciar o controle", "Enfeitar", "Reduzir custos de imagem"], answer: 0 }] },
  { slug: "inspecao-sanitaria-carnes-derivados", title: "Inspeção Sanitária de Produtos Cárneos e Derivados", subtitle: "Princípios de inspeção em carnes e derivados", category: "Produtos de origem animal", hours: 32, priceBrl: 850,
    description: "Fundamentos da inspeção de carnes e derivados, higiene operacional, avaliação de conformidade e tratativas de não conformidades.",
    objectives: ["Reconhecer pontos críticos da cadeia de carnes", "Aplicar critérios de conformidade", "Registrar e tratar não conformidades"],
    audience: "Técnicos, profissionais de qualidade e estudantes da área.", prerequisites: "Conhecimentos básicos de inspeção.", references: REF_BASE,
    modules: [
      { title: "Cadeia de carnes", lessons: [{ title: "Etapas do processo", summary: "Visão geral das etapas e controles." }, { title: "Higiene operacional", summary: "Práticas de higiene em linhas de processamento." }] },
      { title: "Derivados", lessons: [{ title: "Processamento de derivados", summary: "Controles gerais em produtos processados." }, { title: "Rotulagem e identificação", summary: "Princípios de identificação e rastreabilidade." }] },
      { title: "Conformidade", lessons: [{ title: "Avaliação de conformidade", summary: "Critérios e registros." }, { title: "Estudo de caso didático", summary: "Tratativa de desvio fictício em linha de processamento." }] },
    ],
    quiz: [{ q: "Rastreabilidade ajuda a:", options: ["Identificar origem de lotes", "Aumentar desperdício", "Evitar registros"], answer: 0 }, { q: "Higiene operacional visa:", options: ["Reduzir contaminação", "Ampliar custos", "Nada"], answer: 0 }] },
  { slug: "inspecao-qualidade-produtos-aquaticos", title: "Inspeção e Qualidade de Produtos de Origem Animal Aquáticos", subtitle: "Pescado e derivados: qualidade e conformidade", category: "Produtos de origem animal", hours: 28, priceBrl: 740,
    description: "Princípios de qualidade e inspeção em pescado e derivados: frescor, manuseio, cadeia de frio e requisitos gerais.",
    objectives: ["Avaliar frescor e qualidade", "Compreender a cadeia de frio", "Reconhecer requisitos gerais de conformidade"],
    audience: "Profissionais da indústria de pescado, técnicos e estudantes.", prerequisites: "Noções de higiene de alimentos.", references: REF_BASE,
    modules: [
      { title: "Qualidade do pescado", lessons: [{ title: "Frescor e deterioração", summary: "Fatores que afetam a qualidade." }, { title: "Manuseio e conservação", summary: "Boas práticas desde a captura." }] },
      { title: "Cadeia de frio", lessons: [{ title: "Controle de temperatura", summary: "Importância e monitoramento." }, { title: "Transporte e armazenagem", summary: "Princípios gerais." }] },
      { title: "Conformidade", lessons: [{ title: "Requisitos gerais", summary: "Exigências de estabelecimento e produto." }, { title: "Estudo de caso didático", summary: "Quebra de cadeia de frio fictícia." }] },
    ],
    quiz: [{ q: "A cadeia de frio protege:", options: ["A qualidade e a segurança", "Apenas a embalagem", "Nada"], answer: 0 }, { q: "Frescor depende de:", options: ["Manuseio e temperatura", "Cor da caixa", "Horário"], answer: 0 }] },
  { slug: "controle-qualidade-leite-derivados", title: "Controle de Qualidade na Indústria de Leite e Derivados", subtitle: "Do recebimento do leite ao produto final", category: "Produtos de origem animal", hours: 30, priceBrl: 790,
    description: "Controles de qualidade ao longo da cadeia láctea: recebimento, processamento, higiene e verificação de conformidade.",
    objectives: ["Estruturar controles de recebimento", "Entender controles de processo", "Registrar verificações de qualidade"],
    audience: "Laticínios, analistas de qualidade e consultores.", prerequisites: "Noções de BPF.", references: REF_BASE,
    modules: [
      { title: "Matéria-prima", lessons: [{ title: "Recebimento do leite", summary: "Critérios gerais de recebimento e registros." }, { title: "Qualidade na origem", summary: "Influência do manejo e da coleta." }] },
      { title: "Processamento", lessons: [{ title: "Controles de processo", summary: "Parâmetros e monitoramento." }, { title: "Higienização", summary: "Limpeza de equipamentos e linhas." }] },
      { title: "Produto final", lessons: [{ title: "Verificação de conformidade", summary: "Amostragem e registros." }, { title: "Estudo de caso didático", summary: "Desvio em recebimento fictício." }] },
    ],
    quiz: [{ q: "A qualidade começa:", options: ["Na origem da matéria-prima", "Só no rótulo", "Só na venda"], answer: 0 }, { q: "Monitorar processo serve para:", options: ["Detectar desvios cedo", "Atrasar produção", "Nada"], answer: 0 }] },
  { slug: "regulamentacao-alimentacao-animal", title: "Regulamentação de Produtos de Alimentação Animal", subtitle: "Orientação regulatória para estabelecimentos e produtos", category: "Alimentação animal", hours: 24, priceBrl: 620,
    description: "Visão geral da regulamentação de alimentação animal: estabelecimentos, produtos, registros e boas práticas.",
    objectives: ["Compreender o escopo regulatório", "Organizar documentação de estabelecimento e produto", "Reconhecer boas práticas aplicáveis"],
    audience: "Fabricantes, responsáveis técnicos e consultores.", prerequisites: "Nenhum.", references: ["Legislação e normas vigentes do MAPA para alimentação animal (conferir versões atuais)"],
    modules: [
      { title: "Escopo regulatório", lessons: [{ title: "Quem regula e o quê", summary: "Escopo geral e responsabilidades." }, { title: "Tipos de produtos", summary: "Categorias gerais de produtos." }] },
      { title: "Estabelecimentos", lessons: [{ title: "Requisitos gerais", summary: "Instalações, processos e controles." }, { title: "Documentação", summary: "Organização documental." }] },
      { title: "Prática", lessons: [{ title: "Boas práticas", summary: "Controles de qualidade e rastreabilidade." }, { title: "Estudo de caso didático", summary: "Adequação de fábrica fictícia." }] },
    ],
    quiz: [{ q: "Documentação organizada facilita:", options: ["Verificações e registros", "Nada", "Atrasos"], answer: 0 }, { q: "Normas devem ser conferidas em:", options: ["Fontes oficiais", "Boatos", "Memória"], answer: 0 }] },
  { slug: "comercio-exterior-requisitos-sanitarios", title: "Comércio Exterior e Requisitos Sanitários para Produtos de Origem Animal", subtitle: "Exportação, certificação e requisitos de mercado", category: "Comércio exterior", hours: 36, priceBrl: 990,
    description: "Panorama do comércio exterior de produtos de origem animal: requisitos sanitários, documentação, certificação e o papel do VIGIAGRO.",
    objectives: ["Entender o fluxo de exportação", "Reconhecer requisitos sanitários e documentais", "Planejar operações com menor risco de retenção"],
    audience: "Exportadores, despachantes, consultores e gestores.", prerequisites: "Noções de regulamentação de alimentos.", references: ["Requisitos sanitários dos países de destino (consultar fontes oficiais atuais)", "Normas vigentes do MAPA e VIGIAGRO"],
    modules: [
      { title: "Fluxo de exportação", lessons: [{ title: "Etapas da operação", summary: "Visão geral do processo exportador." }, { title: "Papel do VIGIAGRO", summary: "Fiscalização em pontos de fronteira." }] },
      { title: "Requisitos sanitários", lessons: [{ title: "Requisitos de mercado", summary: "Como identificar exigências por destino." }, { title: "Certificação", summary: "Princípios da certificação sanitária." }] },
      { title: "Operação", lessons: [{ title: "Documentação", summary: "Organização para evitar retenções." }, { title: "Estudo de caso didático", summary: "Pendência documental fictícia em exportação." }] },
    ],
    quiz: [{ q: "Exigências variam conforme:", options: ["O país de destino", "A cor do produto", "O dia"], answer: 0 }, { q: "Documentação organizada reduz:", options: ["Risco de retenção", "Qualidade", "Prazo útil"], answer: 0 }] },
];

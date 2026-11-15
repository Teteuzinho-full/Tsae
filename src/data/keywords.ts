export type Kw = { keyword: string; unit: "CONSULTORIA" | "EDUCA"; category: string; intent: "COMERCIAL" | "INFORMACIONAL" | "NAVEGACIONAL"; landingPath: string; priority: 1 | 2 | 3 };
type Row = [string, string, "C" | "I", string, 1 | 2 | 3];
const I = { C: "COMERCIAL", I: "INFORMACIONAL" } as const;
const mk = (unit: Kw["unit"], rows: Row[]): Kw[] => rows.map(([keyword, category, i, landingPath, priority]) => ({ keyword, unit, category, intent: I[i], landingPath, priority }));

// Demanda NÃO validada: nenhuma palavra tem volume de busca confirmado. Validar em ferramenta de pesquisa antes de priorizar.
export const consultoria = mk("CONSULTORIA", [
  ["consultoria agropecuária", "Consultoria", "C", "/", 1], ["consultoria em inspeção sanitária", "Inspeção", "C", "/#areas", 1],
  ["consultoria MAPA", "Regulamentação", "C", "/#areas", 1], ["regularização SIF", "Regulamentação", "C", "/#areas", 1],
  ["consultoria para obter SIF", "Regulamentação", "C", "/#areas", 1], ["registro de estabelecimento no SIF", "Regulamentação", "C", "/#areas", 1],
  ["Serviço de Inspeção Federal", "Regulamentação", "I", "/blog", 2], ["como obter o SIF", "Regulamentação", "I", "/blog", 2],
  ["VIGIAGRO", "Comércio exterior", "I", "/#areas", 2], ["consultoria VIGIAGRO", "Comércio exterior", "C", "/#areas", 2],
  ["inspeção de produtos de origem animal", "Inspeção", "I", "/#areas", 1], ["consultoria produtos de origem animal", "Produtos de origem animal", "C", "/#areas", 1],
  ["inspeção de carnes", "Produtos de origem animal", "I", "/#areas", 2], ["consultoria para frigorífico", "Produtos de origem animal", "C", "/#areas", 1],
  ["regularização de frigoríficos", "Produtos de origem animal", "C", "/#areas", 1], ["adequação sanitária de frigorífico", "Produtos de origem animal", "C", "/#areas", 2],
  ["consultoria em laticínios", "Produtos de origem animal", "C", "/#areas", 1], ["regularização de laticínio", "Produtos de origem animal", "C", "/#areas", 2],
  ["inspeção de leite e derivados", "Produtos de origem animal", "I", "/blog", 3], ["inspeção de produtos aquáticos", "Produtos de origem animal", "I", "/#areas", 2],
  ["consultoria para indústria de pescado", "Produtos de origem animal", "C", "/#areas", 2], ["registro de ovos e derivados", "Produtos de origem animal", "C", "/#areas", 3],
  ["regulamentação de mel", "Produtos de origem animal", "I", "/blog", 3], ["registro de produtos de origem animal no MAPA", "Regulamentação", "C", "/#areas", 1],
  ["segurança dos alimentos consultoria", "Segurança dos alimentos", "C", "/#areas", 1], ["consultoria para indústria de alimentos", "Consultoria", "C", "/", 1],
  ["Boas Práticas de Fabricação consultoria", "Segurança dos alimentos", "C", "/#areas", 2], ["implantação de BPF", "Segurança dos alimentos", "C", "/#areas", 2],
  ["Programas de Autocontrole", "Segurança dos alimentos", "I", "/blog", 2], ["implantação de programas de autocontrole", "Segurança dos alimentos", "C", "/#areas", 1],
  ["adequação de estabelecimentos ao MAPA", "Regulamentação", "C", "/#areas", 1], ["adequação sanitária de estabelecimentos", "Regulamentação", "C", "/#areas", 2],
  ["orientação documental MAPA", "Regulamentação", "C", "/#areas", 2], ["regulamentação de alimentos", "Regulamentação", "I", "/blog", 2],
  ["consultoria em alimentação animal", "Alimentação animal", "C", "/#areas", 1], ["regulamentação de alimentação animal", "Alimentação animal", "I", "/blog", 2],
  ["registro de estabelecimento de alimentação animal", "Alimentação animal", "C", "/#areas", 2], ["registro de produto para alimentação animal no MAPA", "Alimentação animal", "C", "/#areas", 2],
  ["regulamentação de bebidas MAPA", "Bebidas", "I", "/#areas", 2], ["consultoria registro de bebidas", "Bebidas", "C", "/#areas", 2],
  ["registro de estabelecimento de bebidas", "Bebidas", "C", "/#areas", 3], ["comércio exterior de alimentos", "Comércio exterior", "I", "/#areas", 1],
  ["consultoria comércio exterior agropecuário", "Comércio exterior", "C", "/#areas", 1], ["requisitos sanitários para exportação", "Comércio exterior", "I", "/blog", 1],
  ["exportação de produtos de origem animal", "Comércio exterior", "I", "/#areas", 1], ["certificação sanitária para exportação", "Comércio exterior", "I", "/blog", 2],
  ["perícia portuária", "Comércio exterior", "C", "/#areas", 1], ["inspeção portuária de alimentos", "Comércio exterior", "I", "/#areas", 2],
  ["perito agropecuário", "Consultoria", "C", "/#areas", 3], ["consultor em inspeção de alimentos", "Consultoria", "C", "/", 2],
]);

export const educa = mk("EDUCA", [
  ["cursos de inspeção sanitária", "Inspeção", "C", "/educa", 1], ["curso de SIF", "Regulamentação", "C", "/educa", 1],
  ["curso Serviço de Inspeção Federal", "Regulamentação", "C", "/educa", 1], ["curso MAPA regulamentação", "Regulamentação", "C", "/educa", 1],
  ["curso de inspeção de alimentos", "Inspeção", "C", "/educa", 1], ["curso de inspeção de produtos de origem animal", "Inspeção", "C", "/educa", 1],
  ["curso online de inspeção sanitária", "Inspeção", "C", "/educa", 1], ["curso de segurança dos alimentos", "Segurança dos alimentos", "C", "/educa", 1],
  ["curso de BPF", "Segurança dos alimentos", "C", "/educa", 1], ["curso de boas práticas de fabricação", "Segurança dos alimentos", "C", "/educa", 1],
  ["curso programas de autocontrole", "Segurança dos alimentos", "C", "/educa", 1], ["curso de autocontrole na indústria de alimentos", "Segurança dos alimentos", "C", "/educa", 2],
  ["curso de inspeção de carnes", "Produtos de origem animal", "C", "/educa", 1], ["curso de inspeção de produtos cárneos", "Produtos de origem animal", "C", "/educa", 2],
  ["curso de qualidade de alimentos", "Qualidade", "C", "/educa", 2], ["curso de controle de qualidade na indústria de alimentos", "Qualidade", "C", "/educa", 2],
  ["curso de produtos de origem animal", "Produtos de origem animal", "C", "/educa", 1], ["curso de inspeção de leite", "Produtos de origem animal", "C", "/educa", 2],
  ["curso de qualidade do leite e derivados", "Produtos de origem animal", "C", "/educa", 2], ["curso de laticínios", "Produtos de origem animal", "C", "/educa", 3],
  ["curso de inspeção de pescado", "Produtos de origem animal", "C", "/educa", 2], ["curso de inspeção de produtos aquáticos", "Produtos de origem animal", "C", "/educa", 2],
  ["curso de regulamentação de alimentos", "Regulamentação", "C", "/educa", 2], ["curso de legislação de alimentos de origem animal", "Regulamentação", "C", "/educa", 2],
  ["curso de alimentação animal", "Alimentação animal", "C", "/educa", 2], ["curso de regulamentação de alimentação animal", "Alimentação animal", "C", "/educa", 2],
  ["curso de comércio exterior de alimentos", "Comércio exterior", "C", "/educa", 2], ["curso de exportação de produtos de origem animal", "Comércio exterior", "C", "/educa", 2],
  ["curso requisitos sanitários para exportação", "Comércio exterior", "C", "/educa", 2], ["capacitação agropecuária", "Formação", "I", "/educa", 2],
  ["capacitação em inspeção sanitária", "Formação", "C", "/educa", 2], ["formação profissional em inspeção sanitária", "Formação", "I", "/educa", 2],
  ["capacitação para indústria de alimentos", "Formação", "C", "/educa", 3], ["treinamento em segurança dos alimentos", "Segurança dos alimentos", "C", "/educa", 2],
  ["treinamento BPF para manipuladores", "Segurança dos alimentos", "C", "/educa", 3], ["o que é inspeção de produtos de origem animal", "Inspeção", "I", "/blog", 3],
  ["o que é SIF", "Regulamentação", "I", "/blog", 3], ["o que são programas de autocontrole", "Segurança dos alimentos", "I", "/blog", 3],
  ["como trabalhar com inspeção sanitária", "Formação", "I", "/blog", 3], ["como se tornar inspetor de alimentos", "Formação", "I", "/blog", 3],
  ["curso de adequação de estabelecimentos ao MAPA", "Regulamentação", "C", "/educa", 2], ["curso de VIGIAGRO", "Comércio exterior", "C", "/educa", 3],
  ["curso de perícia portuária", "Comércio exterior", "C", "/educa", 3], ["curso de higiene na indústria de alimentos", "Segurança dos alimentos", "C", "/educa", 3],
  ["curso de rastreabilidade de alimentos", "Qualidade", "C", "/educa", 3], ["curso de APPCC", "Segurança dos alimentos", "C", "/educa", 2],
  ["cursos para profissionais do agronegócio", "Formação", "C", "/educa", 3], ["curso de inspeção industrial de alimentos", "Inspeção", "C", "/educa", 2],
  ["TSAE Educa cursos", "Marca", "C", "/educa", 3], ["curso de adequação sanitária de frigorífico", "Produtos de origem animal", "C", "/educa", 3],
]);
export const allKeywords = [...consultoria, ...educa];

document.addEventListener('DOMContentLoaded', function() {

    const NUM_CHARS = 3;
    const LOCAL_STORAGE_KEY = 'ordemParanormalFichas_v2';
    let characters = [];
    let activeCharacterIndex = 0;

    const periciasLista = [
        { nome: 'Acrobacia', attr: 'agi' }, { nome: 'Adestramento', attr: 'pre' },
        { nome: 'Artes', attr: 'pre' }, { nome: 'Atletismo', attr: 'for' },
        { nome: 'Atualidades', attr: 'int' }, { nome: 'Ciências', attr: 'int' },
        { nome: 'Crime', attr: 'agi' }, { nome: 'Diplomacia', attr: 'pre' },
        { nome: 'Enganação', attr: 'pre' }, { nome: 'Fortitude', attr: 'vig' },
        { nome: 'Furtividade', attr: 'agi' }, { nome: 'Iniciativa', attr: 'agi' },
        { nome: 'Intimidação', attr: 'pre' }, { nome: 'Intuição', attr: 'pre' },
        { nome: 'Investigação', attr: 'int' }, { nome: 'Luta', attr: 'for' },
        { nome: 'Medicina', attr: 'int' }, { nome: 'Ocultismo', attr: 'int' },
        { nome: 'Percepção', attr: 'pre' }, { nome: 'Pilotagem', attr: 'agi' },
        { nome: 'Pontaria', attr: 'agi' }, { nome: 'Profissão', attr: 'int' },
        { nome: 'Reflexos', attr: 'agi' }, { nome: 'Religião', attr: 'pre' },
        { nome: 'Sobrevivência', attr: 'int' }, { nome: 'Tática', attr: 'int' },
        { nome: 'Tecnologia', attr: 'int' }, { nome: 'Vontade', attr: 'pre' }
    ];

    const ORIGENS_DATA = {
        'academico': { nome: 'Acadêmico', pericias: ['Ciências', 'Investigação'], poder: 'Saber é Poder', descricao: 'Quando faz um teste usando Intelecto, você pode gastar 2 PE para receber +5 nesse teste.' },
        'agente-de-saude': { nome: 'Agente de Saúde', pericias: ['Intuição', 'Medicina'], poder: 'Técnica Medicinal', descricao: 'Sempre que cura um personagem, você adiciona seu Intelecto no total de PV curados.' },
        'amnesico': { nome: 'Amnésico', pericias: ['Duas à sua escolha'], poder: 'Vislumbres do Passado', descricao: 'Uma vez por sessão, você pode fazer um teste de Intelecto (DT 10) para reconhecer pessoas ou lugares familiares, que tenha encontrado antes de perder a memória. Se passar, recebe 1d4 PE temporários e, a critério do mestre, uma informação útil. As perícias de um amnésico são escolhidas pelo mestre.' },
        'artista': { nome: 'Artista', pericias: ['Artes', 'Enganação'], poder: 'Magnum Opus', descricao: 'Você é famoso por uma de suas obras. Uma vez por missão, pode determinar que um personagem envolvido em uma cena de interação o reconheça. Você recebe +5 em testes de Presença e de perícias baseadas em Presença contra aquele personagem.' },
        'atleta': { nome: 'Atleta', pericias: ['Acrobacia', 'Atletismo'], poder: '110%', descricao: 'Quando faz um teste de perícia usando Força ou Agilidade (exceto Luta e Pontaria) você pode gastar 2 PE para receber +5 nesse teste.' },
        'chef': { nome: 'Chef', pericias: ['Fortitude', 'Profissão'], poder: 'Ingrediente Secreto', descricao: 'Em cenas de interlúdio, você pode fazer a ação alimentar-se para cozinhar um prato especial. Você, e todos os membros do grupo que fizeram a ação alimentar-se, recebem o benefício de dois pratos.' },
        'criminoso': { nome: 'Criminoso', pericias: ['Crime', 'Furtividade'], poder: 'O Crime Compensa', descricao: 'No final de uma missão, escolha um item encontrado na missão. Em sua próxima missão, você pode incluir esse item em seu inventário sem que ele conte em seu limite de itens por patente.' },
        'cultista-arrependido': { nome: 'Cultista Arrependido', pericias: ['Ocultismo', 'Religião'], poder: 'Traços do Outro Lado', descricao: 'Você possui um poder paranormal à sua escolha. Porém, começa o jogo com metade da Sanidade normal para sua classe.', beneficios: { sanidade_mod: 0.5 } },
        'desgarrado': { nome: 'Desgarrado', pericias: ['Fortitude', 'Sobrevivência'], poder: 'Calejado', descricao: 'Você recebe +1 PV para cada 5% de NEX.', beneficios: { pv_por_nex: 1 } },
        'engenheiro': { nome: 'Engenheiro', pericias: ['Profissão', 'Tecnologia'], poder: 'Ferramentas Favoritas', descricao: 'Um item a sua escolha (exceto armas) conta como uma categoria abaixo.' },
        'executivo': { nome: 'Executivo', pericias: ['Diplomacia', 'Profissão'], poder: 'Processo Otimizado', descricao: 'Sempre que faz um teste de perícia durante um teste estendido, ou uma ação para revisar documentos, pode pagar 2 PE para receber +5 nesse teste.' },
        'investigador': { nome: 'Investigador', pericias: ['Investigação', 'Percepção'], poder: 'Faro para Pistas', descricao: 'Uma vez por cena, quando fizer um teste para procurar pistas, você pode gastar 1 PE para receber +5 nesse teste.' },
        'lutador': { nome: 'Lutador', pericias: ['Luta', 'Reflexos'], poder: 'Mão Pesada', descricao: 'Você recebe +2 em rolagens de dano com ataques corpo a corpo.' },
        'magnata': { nome: 'Magnata', pericias: ['Diplomacia', 'Pilotagem'], poder: 'Patrocinador da Ordem', descricao: 'Seu limite de crédito é sempre considerado um acima do atual.' },
        'mercenario': { nome: 'Mercenário', pericias: ['Iniciativa', 'Intimidação'], poder: 'Posição de Combate', descricao: 'No primeiro turno de cada cena de ação, você pode gastar 2 PE para receber uma ação de movimento adicional.' },
        'militar': { nome: 'Militar', pericias: ['Pontaria', 'Tática'], poder: 'Para Bellum', descricao: 'Você recebe +2 em rolagens de dano com armas de fogo.' },
        'operario': { nome: 'Operário', pericias: ['Fortitude', 'Profissão'], poder: 'Ferramenta de Trabalho', descricao: 'Escolha uma arma simples ou tática que poderia ser uma ferramenta. Você sabe usar a arma e recebe +1 em testes de ataque, rolagens de dano e margem de ameaça com ela.' },
        'policial': { nome: 'Policial', pericias: ['Percepção', 'Pontaria'], poder: 'Patrulha', descricao: 'Você recebe +2 em Defesa.', beneficios: { defesa_passiva: 2 } },
        'religioso': { nome: 'Religioso', pericias: ['Religião', 'Vontade'], poder: 'Acalentar', descricao: 'Você recebe +5 em testes de Religião para acalmar. Além disso, quando acalma uma pessoa, ela recebe 1d6 + PRE de Sanidade.' },
        'servidor-publico': { nome: 'Servidor Público', pericias: ['Intuição', 'Vontade'], poder: 'Espírito Cívico', descricao: 'Sempre que faz um teste para ajudar, você pode gastar 1 PE para aumentar o bônus concedido em +2.' },
        'teorico-conspiracao': { nome: 'Teórico da Conspiração', pericias: ['Investigação', 'Ocultismo'], poder: 'Eu Já Sabia', descricao: 'Você recebe resistência a dano mental igual ao seu Intelecto.', beneficios: { resist_mental_intelecto: true } },
        'ti': { nome: 'T.I.', pericias: ['Investigação', 'Tecnologia'], poder: 'Motor de Busca', descricao: 'A critério do Mestre, sempre que tiver acesso a internet, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Tecnologia.' },
        'trabalhador-rural': { nome: 'Trabalhador Rural', pericias: ['Adestramento', 'Sobrevivência'], poder: 'Desbravador', descricao: 'Quando faz um teste de Adestramento ou Sobrevivência, você pode gastar 2 PE para receber +5 nesse teste. Você não sofre penalidade em deslocamento por terreno difícil.' },
        'trambiqueiro': { nome: 'Trambiqueiro', pericias: ['Crime', 'Enganação'], poder: 'Impostor', descricao: 'Uma vez por cena, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Enganação.' },
        'universitario': { nome: 'Universitário', pericias: ['Atualidades', 'Investigação'], poder: 'Dedicação', descricao: 'Você recebe +1 PE, e mais 1 PE adicional a cada NEX ímpar (15%, 25%...). Seu limite de PE por turno aumenta em 1.', beneficios: { pe_bonus: 1, pe_por_nex_impar: 1, pe_limite_turno: 1 } },
        'vitima': { nome: 'Vítima', pericias: ['Reflexos', 'Vontade'], poder: 'Cicatrizes Psicológicas', descricao: 'Você recebe +1 de Sanidade para cada 5% de NEX.', beneficios: { san_por_nex: 1 } }
    };

    const CLASSES_DATA = {
        'combatente': {
            nome: 'Combatente',
            pv_base: 20, pv_nivel: 4, pe_base: 2, pe_nivel: 2, san_base: 12, san_nivel: 3,
            habilidades_base: { 5: "Ataque Especial: Quando faz um Ataque, você pode gastar 2 PE para receber +2 no teste de ataque ou +5 na rolagem de dano." },
            trilhas: {
                'aniquilador': {
                    nome: 'Aniquilador',
                    habilidades: {
                        10: "A Favorita: Escolha uma arma. A Categoria dela é reduzida em I.",
                        40: "Técnica Destrutiva: A categoria da sua arma favorita é reduzida em II. Pode gastar 2 PE para seu ataque com ela ser Amplo ou Perfurante.",
                        65: "Técnica Sublime: Pode gastar 2 PE para que sua arma favorita receba -2 na margem de ameaça ou +1d no dano crítico.",
                        99: "Máquina de Matar: A categoria da sua arma favorita é reduzida em III e ela recebe +5 de dano."
                    }
                },
                'comandante': {
                    nome: 'Comandante de Campo',
                    habilidades: {
                        10: "Inspirar Confiança: Pode gastar 2 PE e uma reação para um aliado em alcance Curto refazer um teste que falhou.",
                        40: "Brecha na Guarda: Quando um aliado causa dano em um inimigo, pode gastar 2 PE e uma reação para que você ou outro aliado realize um ataque adicional.",
                        65: "Encontrar Fraqueza: Pode gastar 2 PE e uma ação de movimento para analisar uma criatura e receber uma vantagem mecânica contra ela.",
                        99: "Oficial de Operações: Uma vez por combate, pode gastar 5 PE para que todos os aliados em alcance Curto recebam uma ação padrão adicional."
                    }
                },
                'guerreiro': {
                    nome: 'Guerreiro',
                    habilidades: {
                        10: "Técnica Letal: Suas armas corpo a corpo recebem -1 na margem de ameaça.",
                        40: "Adrenalina: Recupera 1 PE sempre que deixa um inimigo Machucado, causa um acerto crítico, ou reduz um inimigo a 0 PV.",
                        65: "Força Opressora: Ao acertar um ataque corpo a corpo, pode gastar 1 PE para tentar derrubar ou empurrar o alvo.",
                        99: "Golpe Devastador: Uma vez por cena, ao usar Ataque Especial, pode aumentar o custo em 3 PE para ganhar -2 na margem de ameaça e +1d no dano crítico."
                    }
                },
                'operacoes_especiais': {
                    nome: 'Operações Especiais',
                    habilidades: {
                        10: "Iniciativa Aprimorada: Recebe +5 em Iniciativa e uma ação de movimento extra no primeiro turno.",
                        40: "Ataque Extra: Pode gastar 2 PE para fazer um ataque adicional.",
                        65: "Guarda Alta: Pode gastar 2 PE para receber uma reação defensiva adicional.",
                        99: "Surto de Adrenalina: Pode gastar 5 PE para ganhar uma ação padrão adicional."
                    }
                },
                'tropa_de_choque': {
                    nome: 'Tropa de Choque',
                    habilidades: {
                        10: "Casca Grossa: Recebe +1 PV por NEX e soma VIGOR na Defesa ao bloquear.",
                        40: "Cai Dentro: Pode gastar 2 PE para forçar um inimigo a te atacar.",
                        65: "Duro de Matar: Pode gastar 2 PE e uma reação para reduzir um dano mundano pela metade.",
                        99: "Inquebrável: Quando está Machucado, recebe +5 de Defesa e RD 5."
                    }
                }
            }
        },
        'especialista': {
            nome: 'Especialista',
            pv_base: 16, pv_nivel: 3, pe_base: 3, pe_nivel: 3, san_base: 16, san_nivel: 4,
            habilidades_base: { 5: "Perito: Escolha duas perícias. Quando faz um teste de uma delas, pode gastar 2 PE para somar +1d6 no resultado. Eclético: Pode gastar 2 PE para receber os benefícios de ser treinado numa perícia." },
            trilhas: {
                'atirador_de_elite': {
                    nome: 'Atirador de Elite',
                    habilidades: {
                        10: "Mira de Elite: Adiciona INT no dano com armas de fogo. Pode Mirar como ação livre por 2 PE.",
                        40: "Queima Roupa: Ignora penalidades por atirar adjacente. Recebe +5 de dano contra alvos adjacentes ou em alcance Curto.",
                        65: "Mira Letal: Ao usar Mira de Elite, pode gastar +2 PE para adicionar +2d8 de dano em um acerto crítico.",
                        99: "Atirar para Matar: Com 20 natural em um ataque, pode gastar 4 PE para causar dano máximo com a arma."
                    }
                },
                'infiltrador': {
                    nome: 'Infiltrador',
                    habilidades: {
                        10: "Ataque Furtivo: Uma vez por rodada, pode gastar 1 PE para causar +2d6 de dano extra em alvos desprevenidos ou flanqueados.",
                        40: "Gatuno: Recebe +5 em Atletismo e +2 em Crime. Pode se mover com deslocamento total enquanto escondido.",
                        65: "Sanguessuga: Ao usar Ataque Furtivo, drena PE do alvo igual à quantidade de d6s do seu ataque.",
                        99: "Assassinar: No primeiro acerto crítico com Ataque Furtivo da cena, rola o dobro de dados de bônus."
                    }
                },
                'medico_de_campo': {
                    nome: 'Médico de Campo',
                    habilidades: {
                        10: "Paramédico: Pode gastar 2 PE para curar 5d4+2 PV de um alvo.",
                        40: "Equipe de Trauma: Ao usar Paramédico, pode gastar +2 PE para remover uma condição (física ou de fadiga).",
                        65: "Resgate: Pode se mover até um aliado morrendo como ação livre. Ao curar, você e o aliado recebem +5 de Defesa.",
                        99: "Reanimação: Uma vez por cena, ao tratar um alvo morrendo, pode gastar 5 PE para estabilizá-lo e curá-lo com o dobro de dados."
                    }
                },
                'negociador': {
                    nome: 'Negociador',
                    habilidades: {
                        10: "Eloquência: Pode gastar 1 PE por alvo para tentar deixá-los fascinados com um teste de Vontade.",
                        40: "Discurso Motivador: Gaste 3 PE para dar a todos os aliados em alcance Curto +1d nos testes de perícia por um número de turnos igual à sua Presença.",
                        65: "Eu Conheço um Cara: Uma vez por missão, pode pedir um favor à sua rede de contatos (trocar equipamento, conseguir um local seguro, etc).",
                        99: "Truque de Mestre: Pode gastar 5 PE para simular o efeito de uma habilidade que viu um aliado usar na cena."
                    }
                },
                'tecnico': {
                    nome: 'Técnico',
                    habilidades: {
                        10: "Inventário Otimizado: Usa INT para calcular os espaços de inventário em vez de FOR.",
                        40: "Gambiarra: Pode gastar 2 PE para criar um item de categoria I (não arma/proteção) que dura uma cena.",
                        65: "Remendão: Pode gastar 1 PE para remover a condição 'quebrado' de um item. Alguns itens têm sua categoria reduzida para você.",
                        99: "Preparado para Tudo: Pode usar Gambiarra para criar itens de combate. Pode gastar 10 PE para dar a um item 2 modificações temporárias."
                    }
                }
            }
        },
        'ocultista': {
            nome: 'Ocultista',
            pv_base: 12, pv_nivel: 2, pe_base: 4, pe_nivel: 4, san_base: 20, san_nivel: 5,
            habilidades_base: { 5: "Escolhido Pelo Outro Lado: Você aprende 3 rituais de 1º Círculo. A cada novo círculo de poder, aprende um ritual adicional." },
            trilhas: {
                'conduite': {
                    nome: 'Conduíte',
                    habilidades: {
                        10: "Ampliar Ritual: Pode gastar 2 PE para aumentar o alcance ou a área de um ritual.",
                        40: "Acelerar Ritual: Uma vez por rodada, pode gastar 4 PE para conjurar um ritual como ação livre.",
                        65: "Anular Ritual: Pode gastar PE e fazer um teste oposto de Ocultismo para anular um ritual que tenha você como alvo.",
                        99: "Canalizar o Medo: Aprende o ritual Canalizar o Medo."
                    }
                },
                'flagelador': {
                    nome: 'Flagelador',
                    habilidades: {
                        10: "Poder do Flagelo: Pode pagar o custo de rituais com PV (2 PV por 1 PE).",
                        40: "Absorver a Dor: Ao passar em um teste de resistência contra um ritual seu, recupera PV igual ao círculo do ritual +1.",
                        65: "Abraçar a Dor: Pode gastar 2 PE e uma reação para reduzir dano mundano pela metade.",
                        99: "Medo Tangível: Aprende o ritual Medo Tangível."
                    }
                },
                'graduado': {
                    nome: 'Graduado',
                    habilidades: {
                        10: "Saber Ampliado: Aprende 1 ritual de 1º Círculo adicional.",
                        40: "Grimório Ritualístico: Cria um grimório para armazenar rituais adicionais.",
                        65: "Acesso Aprimorado: Aprimora o grimório, permitindo ler rituais como ação padrão.",
                        99: "Conhecendo o Medo: Aprende o ritual Conhecendo o Medo."
                    }
                },
                'lamina_paranormal': {
                    nome: 'Lâmina Paranormal',
                    habilidades: {
                        10: "Lâmina Maldita: Aprende o ritual Amaldiçoar Arma. Pode usar Ocultismo para atacar com armas amaldiçoadas.",
                        40: "Conjuração Marcial: Se conjurar um ritual, pode gastar 2 PE para atacar como ação livre.",
                        65: "Gladiador Paranormal: Ao acertar com uma arma amaldiçoada, ganha 2 PE temporários.",
                        99: "Lâmina do Medo: Aprende o ritual Lâmina do Medo."
                    }
                }
            }
        }
    };

    const ARMAS_DATA = {
        // Armas Simples - Corpo a Corpo - Leves
        'faca': { nome: 'Faca', categoria: 0, dano: '1d4', critico: '19', alcance: 'Curto', tipo: 'C', espacos: 1 },
        'martelo': { nome: 'Martelo', categoria: 0, dano: '1d6', critico: 'x2', alcance: '—', tipo: 'I', espacos: 1 },
        'punhal': { nome: 'Punhal', categoria: 0, dano: '1d4', critico: 'x3', alcance: '—', tipo: 'P', espacos: 1 },
        // Armas Simples - Corpo a Corpo - Uma Mão
        'bastao': { nome: 'Bastão', categoria: 0, dano: '1d6/1d8', critico: 'x2', alcance: '—', tipo: 'I', espacos: 1 },
        'machete': { nome: 'Machete', categoria: 0, dano: '1d6', critico: '19', alcance: '—', tipo: 'C', espacos: 1 },
        'lanca': { nome: 'Lança', categoria: 0, dano: '1d6', critico: 'x2', alcance: 'Curto', tipo: 'P', espacos: 1 },
        // Armas Simples - Corpo a Corpo - Duas Mãos
        'cajado': { nome: 'Cajado', categoria: 0, dano: '1d6/1d6', critico: 'x2', alcance: '—', tipo: 'I', espacos: 2 },
        // Armas Simples - Disparo - Duas Mãos
        'arco': { nome: 'Arco', categoria: 0, dano: '1d6', critico: 'x3', alcance: 'Médio', tipo: 'P', espacos: 2 },
        'besta': { nome: 'Besta', categoria: 0, dano: '1d8', critico: '19', alcance: 'Médio', tipo: 'P', espacos: 2 },
        // Armas de Fogo - Leves
        'pistola': { nome: 'Pistola', categoria: 1, dano: '1d12', critico: '18', alcance: 'Curto', tipo: 'B', espacos: 1 },
        'revolver': { nome: 'Revólver', categoria: 1, dano: '2d6', critico: '19/x3', alcance: 'Curto', tipo: 'B', espacos: 1 },
        // Armas de Fogo - Duas Mãos
        'fuzil_caca': { nome: 'Fuzil de caça', categoria: 1, dano: '2d8', critico: '19/x3', alcance: 'Médio', tipo: 'B', espacos: 2 },
        // Armas Táticas - Corpo a Corpo - Leves
        'machadinha': { nome: 'Machadinha', categoria: 0, dano: '1d6', critico: 'x3', alcance: 'Curto', tipo: 'C', espacos: 1 },
        'nunchaku': { nome: 'Nunchaku', categoria: 0, dano: '1d8', critico: 'x2', alcance: '—', tipo: 'I', espacos: 1 },
        // Armas Táticas - Corpo a Corpo - Uma Mão
        'corrente': { nome: 'Corrente', categoria: 0, dano: '1d8', critico: 'x2', alcance: '—', tipo: 'I', espacos: 1 },
        'espada': { nome: 'Espada', categoria: 1, dano: '1d8/1d10', critico: '19', alcance: '—', tipo: 'C', espacos: 1 },
        'florete': { nome: 'Florete', categoria: 1, dano: '1d6', critico: '18', alcance: '—', tipo: 'C', espacos: 1 },
        'machado': { nome: 'Machado', categoria: 1, dano: '1d8', critico: 'x3', alcance: '—', tipo: 'C', espacos: 1 },
        'maca': { nome: 'Maça', categoria: 1, dano: '2d4', critico: 'x2', alcance: '—', tipo: 'I', espacos: 1 },
        // Armas Táticas - Corpo a Corpo - Duas Mãos
        'acha': { nome: 'Acha', categoria: 1, dano: '1d12', critico: 'x3', alcance: '—', tipo: 'C', espacos: 2 },
        'gadanho': { nome: 'Gadanho', categoria: 1, dano: '2d4', critico: 'x4', alcance: '—', tipo: 'C', espacos: 2 },
        'katana': { nome: 'Katana', categoria: 1, dano: '1d10', critico: '19', alcance: '—', tipo: 'C', espacos: 2 },
        'marreta': { nome: 'Marreta', categoria: 1, dano: '3d4', critico: 'x2', alcance: '—', tipo: 'I', espacos: 2 },
        'montante': { nome: 'Montante', categoria: 1, dano: '2d6', critico: '19', alcance: '—', tipo: 'C', espacos: 2 },
        'motosserra': { nome: 'Motosserra', categoria: 1, dano: '3d6', critico: 'x2', alcance: '—', tipo: 'C', espacos: 2 },
        // Armas Táticas - Disparo - Duas Mãos
        'arco_composto': { nome: 'Arco composto', categoria: 1, dano: '1d10', critico: 'x3', alcance: 'Médio', tipo: 'P', espacos: 2 },
        'balestra': { nome: 'Balestra', categoria: 1, dano: '1d12', critico: '19', alcance: 'Médio', tipo: 'P', espacos: 2 },
        // Armas Táticas - Fogo - Uma Mão
        'submetralhadora': { nome: 'Submetralhadora', categoria: 1, dano: '2d6', critico: '19/x3', alcance: 'Curto', tipo: 'B', espacos: 1 },
        // Armas Táticas - Fogo - Duas Mãos
        'espingarda': { nome: 'Espingarda', categoria: 1, dano: '4d6', critico: 'x3', alcance: 'Curto', tipo: 'B', espacos: 2 },
        'fuzil_assalto': { nome: 'Fuzil de assalto', categoria: 2, dano: '2d10', critico: '19/x3', alcance: 'Médio', tipo: 'B', espacos: 2 },
        'fuzil_precisao': { nome: 'Fuzil de precisão', categoria: 3, dano: '2d10', critico: '19/x3', alcance: 'Longo', tipo: 'B', espacos: 2 },
        // Armas Pesadas
        'bazuca': { nome: 'Bazuca', categoria: 3, dano: '10d8', critico: 'x2', alcance: 'Médio', tipo: 'I', espacos: 2 },
        'lanca_chamas': { nome: 'Lança-chamas', categoria: 3, dano: '6d6', critico: 'x2', alcance: 'Curto', tipo: 'Fogo', espacos: 2 },
        'metralhadora': { nome: 'Metralhadora', categoria: 2, dano: '2d12', critico: '19/x3', alcance: 'Médio', tipo: 'B', espacos: 2 }
    };

    const IDADE_DATA = {
        'crianca': { nome: 'Criança (9-12)', modificadores: { forca_max: 1, vigor_max: 1, deslocamento: 6, tamanho: 'Pequeno', origem_beneficios: 1, defesa: 2, resistencia: 5 } },
        'adolescente': { nome: 'Adolescente (13-16)', modificadores: { forca_max: 2, origem_beneficios: 2, pe_bonus: 5 } },
        'jovem': { nome: 'Jovem (17-24)', modificadores: {} },
        'adulto': { nome: 'Adulto (25-44)', modificadores: { poder_classe_extra: 1, desvantagens: 1 } },
        'maduro': { nome: 'Maduro (45-64)', modificadores: { nex_bonus: 5, desvantagens: 2 } },
        'idoso': { nome: 'Idoso (65+)', modificadores: { nex_bonus: 10, desvantagens: 3, attr_fisico_max: false } }
    };

    const DESVANTAGENS_DATA = {
        'catarata': { nome: 'Catarata', descricao: 'Sofre –5 em testes de Percepção e Pontaria.' },
        'definhamento': { nome: 'Definhamento', descricao: 'Sofre –5 em testes de Fortitude e de manobras de combate.' },
        'devagar': { nome: '“Devagar, Jovem!”', descricao: 'Seu deslocamento é reduzido em –3m e você não pode fazer investidas.' },
        'distraido': { nome: 'Distraído', descricao: 'Fica surpreendido na primeira rodada de qualquer cena de ação e perde seu primeiro turno em qualquer cena de investigação.' },
        'fragil': { nome: 'Frágil', descricao: 'Perde 2 PV por NEX.', mod: { pv_por_nex: -2 } },
        'gota': { nome: 'Gota', descricao: 'Sempre que faz um teste de Agilidade ou baseado em Agilidade, ou escolhe a ação esquiva, você sofre 1d6 pontos de dano.' },
        'juntas_duras': { nome: 'Juntas Duras', descricao: 'Sofre –5 em testes de Acrobacia e Reflexos.' },
        'melancolico': { nome: 'Melancólico', descricao: 'Perde 1 PE por NEX.', mod: { pe_por_nex: -1 } },
        'no_meu_tempo': { nome: '“No Meu Tempo”', descricao: 'Sofre –5 em testes de Intuição e Vontade.' },
        'pulmao_ruim': { nome: 'Pulmão Ruim', descricao: 'Sempre que faz um teste de Força ou baseado em Força, você sofre 1d6 pontos de dano.' },
        'rabugento': { nome: 'Rabugento', descricao: 'Sofre –5 em testes de Presença e de perícias baseadas em Presença, com exceção de Intimidação.' },
        'recurvado': { nome: 'Recurvado', descricao: 'Considerado Pequeno, mas sem bônus de Furtividade.' },
        'sono_ruim': { nome: 'Sono Ruim', descricao: 'Sua condição de descanso é sempre uma categoria pior.' },
        'teimoso': { nome: 'Teimoso', descricao: 'Não pode receber nem fornecer bônus por ajuda.' },
        'tosse': { nome: 'Tosse', descricao: 'Pode perder seu turno em uma crise de tosse (rolar 1d6, resultado 1).' }
    };

    function popularListaArmas(filtro = '') {
        const listaContainer = document.getElementById('lista-armas-modal');
        listaContainer.innerHTML = '';
        const filtroLowerCase = filtro.toLowerCase();

        for (const key in ARMAS_DATA) {
            const arma = ARMAS_DATA[key];
            if (arma.nome.toLowerCase().includes(filtroLowerCase)) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'modal-list-item';

                const headerDiv = document.createElement('div');
                headerDiv.className = 'modal-item-header';
                headerDiv.innerHTML = `<span>${arma.nome}</span>`;

                const addButton = document.createElement('button');
                addButton.className = 'btn-add-small';
                addButton.textContent = '+';
                addButton.onclick = () => {
                    addArmaRow({ nome: arma.nome, tipoDano: `${arma.tipo} / ${arma.dano}`, criticoAlcance: `${arma.critico} / ${arma.alcance}` });
                    document.getElementById('modal-armas').style.display = 'none';
                    saveCharacterData();
                };
                headerDiv.appendChild(addButton);

                const detailsDiv = document.createElement('div');
                detailsDiv.className = 'modal-item-details';
                detailsDiv.style.display = 'none'; // Initially hidden
                detailsDiv.innerHTML = `
                    <p><strong>Dano:</strong> ${arma.dano} | <strong>Crítico:</strong> ${arma.critico}</p>
                    <p><strong>Alcance:</strong> ${arma.alcance} | <strong>Tipo:</strong> ${arma.tipo}</p>
                    <p><strong>Espaços:</strong> ${arma.espacos} | <strong>Categoria:</strong> ${arma.categoria}</p>
                `;

                headerDiv.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'BUTTON') {
                        detailsDiv.style.display = detailsDiv.style.display === 'none' ? 'block' : 'none';
                    }
                });

                itemDiv.appendChild(headerDiv);
                itemDiv.appendChild(detailsDiv);
                listaContainer.appendChild(itemDiv);
            }
        }
    }

    function createDefaultCharacter() {
        const defaultPericias = {};
        periciasLista.forEach(p => {
            defaultPericias[p.nome] = { treinado: false, bonus: 0 };
        });

        return {
            info: {
                'nome-jogador': '', 'nome-personagem': '', 'ocupacao': '', 'origem': 'nenhuma',
                'classe': 'nenhuma', 'trilha': 'nenhuma', 'nex': 5, 'pv-atual': '', 'san-atual': '', 'pe-atual': '',
                'idade': 'jovem', 'desvantagens': [],
                'outras-resistencias': '', 'habilidades-texto': ''
            },
            atributos: { 'agi': 1, 'for': 1, 'int': 1, 'pre': 1, 'vig': 1 },
            pericias: defaultPericias,
            armas: [],
            inventario: [],
            rituais: []
        };
    }

    function addRitualRow(ritual = { nome: '', elemento: '', execucao: '', descricao: '' }) {
        const tbody = document.querySelector('#tabela-rituais tbody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" placeholder="Nome do Ritual" value="${ritual.nome}"></td>
            <td><input type="text" placeholder="Sangue 1" value="${ritual.elemento}"></td>
            <td><input type="text" placeholder="Padrão / Curto" value="${ritual.execucao}"></td>
            <td><textarea rows="2" placeholder="Descrição do ritual...">${ritual.descricao}</textarea></td>
            <td><button class="btn-remove">X</button></td>
        `;
        tbody.appendChild(tr);
        tr.querySelectorAll('input, textarea').forEach(input => input.addEventListener('input', saveCharacterData));
    }

    function popularIdades() {
        const selectIdade = document.getElementById('idade');
        Object.keys(IDADE_DATA).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = IDADE_DATA[key].nome;
            selectIdade.appendChild(option);
        });
    }

    function updateDesvantagensUI() {
        const idadeKey = document.getElementById('idade').value;
        const idadeInfo = IDADE_DATA[idadeKey];
        const desvantagensSection = document.getElementById('desvantagens-section');
        const desvantagensContainer = document.getElementById('desvantagens-container');
        const desvantagensInfo = document.getElementById('desvantagens-info');

        desvantagensContainer.innerHTML = '';

        if (idadeInfo && idadeInfo.modificadores.desvantagens > 0) {
            const numDesvantagens = idadeInfo.modificadores.desvantagens;
            desvantagensInfo.textContent = `Você deve escolher ${numDesvantagens} desvantagem(ns) do "Peso da Idade".`;

            Object.keys(DESVANTAGENS_DATA).forEach(key => {
                const desvantagem = DESVANTAGENS_DATA[key];
                const label = document.createElement('label');
                label.className = 'checkbox-label';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = key;
                checkbox.name = 'desvantagem';

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(` ${desvantagem.nome}: ${desvantagem.descricao}`));
                desvantagensContainer.appendChild(label);
            });

            desvantagensSection.style.display = 'block';
        } else {
            desvantagensSection.style.display = 'none';
        }
    }

    function handleIdadeChange() {
        updateDesvantagensUI();
        // A lógica de aplicar os modificadores será no recalcularFicha
        saveCharacterData();
    }

    function saveCharacterData() {
        const charData = characters[activeCharacterIndex];

        // Salvar infos e atributos
        document.querySelectorAll('.save-field').forEach(field => {
            const section = field.closest('section, .status-item').id.includes('status') ? 'info' : (field.closest('section').id === 'atributos' ? 'atributos' : 'info');
            charData[section][field.id] = field.value;
        });

        // Salvar perícias
        document.querySelectorAll('#tabela-pericias tbody tr').forEach(row => {
            const nome = row.dataset.nome;
            charData.pericias[nome].treinado = row.querySelector('.treino-check').checked;
            charData.pericias[nome].bonus = parseInt(row.querySelector('.pericia-bonus-input').value) || 0;
        });

        // Salvar armas
        charData.armas = [];
        document.querySelectorAll('#tabela-armas tbody tr').forEach(row => {
            const inputs = row.querySelectorAll('input');
            charData.armas.push({
                nome: inputs[0].value,
                tipoDano: inputs[1].value,
                criticoAlcance: inputs[2].value
            });
        });

        // Salvar inventário
        charData.inventario = [];
        document.querySelectorAll('#tabela-inventario tbody tr').forEach(row => {
            const inputs = row.querySelectorAll('input');
            charData.inventario.push({
                item: inputs[0].value,
                espacos: inputs[1].value
            });
        });

        // Salvar desvantagens
        charData.info.desvantagens = [];
        document.querySelectorAll('#desvantagens-container input[type="checkbox"]:checked').forEach(checkbox => {
            charData.info.desvantagens.push(checkbox.value);
        });

        // Salvar rituais
        charData.rituais = [];
        document.querySelectorAll('#tabela-rituais tbody tr').forEach(row => {
            const inputs = row.querySelectorAll('input, textarea');
            charData.rituais.push({
                nome: inputs[0].value,
                elemento: inputs[1].value,
                execucao: inputs[2].value,
                descricao: inputs[3].value
            });
        });

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(characters));
        recalcularFicha();
    }

    function loadCharacterData(index) {
        activeCharacterIndex = index;
        const charData = characters[index];

        // Carregar infos e atributos
        Object.keys(charData.info).forEach(key => {
            const field = document.getElementById(key);
            if (field) field.value = charData.info[key];
        });
        Object.keys(charData.atributos).forEach(key => {
            const field = document.getElementById(key);
            if (field) field.value = charData.atributos[key];
        });

        // Carregar perícias
        Object.keys(charData.pericias).forEach(nome => {
            const row = document.querySelector(`#tabela-pericias tbody tr[data-nome="${nome}"]`);
            if (row) {
                row.querySelector('.treino-check').checked = charData.pericias[nome].treinado;
                row.querySelector('.pericia-bonus-input').value = charData.pericias[nome].bonus;
            }
        });

        // Carregar armas
        const armasTbody = document.querySelector('#tabela-armas tbody');
        armasTbody.innerHTML = '';
        charData.armas.forEach(arma => addArmaRow(arma));

        // Carregar inventário
        const inventarioTbody = document.querySelector('#tabela-inventario tbody');
        inventarioTbody.innerHTML = '';
        charData.inventario.forEach(item => addItemRow(item));

        // Carregar rituais
        const rituaisTbody = document.querySelector('#tabela-rituais tbody');
        rituaisTbody.innerHTML = '';
        if (charData.rituais) {
            charData.rituais.forEach(ritual => addRitualRow(ritual));
        }

        const origemSalva = charData.info['origem'] || 'nenhuma';
        document.getElementById('origem').value = origemSalva;
        aplicarBeneficiosOrigem(origemSalva);

        document.getElementById('idade').value = charData.info['idade'] || 'jovem';
        updateDesvantagensUI();
        if (charData.info.desvantagens) {
            charData.info.desvantagens.forEach(desvantagemKey => {
                const checkbox = document.querySelector(`#desvantagens-container input[value="${desvantagemKey}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }

        document.getElementById('classe').value = charData.info['classe'] || 'nenhuma';
        handleClasseChange();
        document.getElementById('trilha').value = charData.info['trilha'] || 'nenhuma';
        updateHabilidades();

        updateSwitcherUI();
        recalcularFicha();
    }
    
    function recalcularFicha() {
        document.querySelectorAll('.stat-highlight').forEach(el => el.classList.remove('stat-highlight'));

        // 1. Coletar todos os dados e modificadores
        const idadeKey = document.getElementById('idade').value;
        const idadeMod = IDADE_DATA[idadeKey]?.modificadores || {};

        const origemKey = document.getElementById('origem').value;
        const origemBeneficios = ORIGENS_DATA[origemKey]?.beneficios || {};

        const classeKey = document.getElementById('classe').value;
        const classe = CLASSES_DATA[classeKey];

        const desvantagensKeys = characters[activeCharacterIndex].info.desvantagens || [];
        const desvantagensMod = desvantagensKeys.map(key => DESVANTAGENS_DATA[key]?.mod || {}).reduce((acc, obj) => ({ ...acc, ...obj }), {});

        // 2. Coletar valores base da ficha
        const nexInput = parseInt(document.getElementById('nex').value) || 0;
        const vigor = parseInt(document.getElementById('vig').value) || 0;
        const presenca = parseInt(document.getElementById('pre').value) || 0;
        const agilidade = parseInt(document.getElementById('agi').value) || 0;
        const forca = parseInt(document.getElementById('for').value) || 0;
        const intelecto = parseInt(document.getElementById('int').value) || 0;

        const atributos = { agi: agilidade, for: forca, int: intelecto, pre: presenca, vig: vigor };

        // 3. Aplicar modificadores de base
        let nex = nexInput + (idadeMod.nex_bonus || 0);
        const nexLevel = Math.floor(nex / 5);

        // 4. Calcular Stats
        let pvMax = 0, peMax = 0, sanMax = 0;
        if (classe) {
            // Base da classe
            pvMax = (classe.pv_base + vigor) + ((classe.pv_nivel + vigor) * (nexLevel - 1));
            peMax = (classe.pe_base + presenca) + ((classe.pe_nivel + presenca) * (nexLevel - 1));
            sanMax = (classe.san_base) + (classe.san_nivel * (nexLevel - 1));
        }

        // Modificadores de Origem
        if (origemBeneficios.pv_por_nex) pvMax += (nexLevel * origemBeneficios.pv_por_nex);
        if (origemBeneficios.san_por_nex) sanMax += (nexLevel * origemBeneficios.san_por_nex);
        if (origemBeneficios.pe_bonus) peMax += origemBeneficios.pe_bonus;
        if (origemBeneficios.pe_por_nex_impar) peMax += Math.floor((nexLevel - 1) / 2);
        if (origemBeneficios.sanidade_mod) sanMax = Math.floor(sanMax * origemBeneficios.sanidade_mod);

        // Modificadores de Idade/Desvantagem
        if (idadeMod.pe_bonus) peMax += idadeMod.pe_bonus;
        if (desvantagensMod.pv_por_nex) pvMax += (nexLevel * desvantagensMod.pv_por_nex);
        if (desvantagensMod.pe_por_nex) peMax += (nexLevel * desvantagensMod.pe_por_nex);

        document.getElementById('pv-max').textContent = pvMax;
        document.getElementById('pe-max').textContent = peMax;
        document.getElementById('san-max').textContent = sanMax;

        // --- Cálculo de Defesa ---
        let defesaPassiva = 10 + agilidade + (origemBeneficios.defesa_passiva || 0) + (idadeMod.defesa || 0);
        document.getElementById('defesa-passiva').textContent = defesaPassiva;

        // --- Perícias ---
        const bonusTreino = (nex >= 85 ? 15 : (nex >= 50 ? 10 : 5));
        let totalReflexos = 0;
        document.querySelectorAll('#tabela-pericias tbody tr').forEach(row => {
            const attrBase = row.dataset.attr;
            const valorAttr = atributos[attrBase] || 0;
            const isTreinado = row.querySelector('.treino-check').checked;
            const outrosBonus = parseInt(row.querySelector('.pericia-bonus-input').value) || 0;
            const treinoBonus = isTreinado ? bonusTreino : 0;
            const total = valorAttr + treinoBonus + outrosBonus;
            row.querySelector('.pericia-total').textContent = total;
            if (row.dataset.nome === 'Reflexos') totalReflexos = total;
        });

        document.getElementById('defesa-esquiva').textContent = 10 + totalReflexos;
        document.getElementById('carga-maxima').textContent = 5 + forca;
    }

    function popularOrigens() {
        const selectOrigem = document.getElementById('origem');
        Object.keys(ORIGENS_DATA).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = ORIGENS_DATA[key].nome;
            selectOrigem.appendChild(option);
        });
    }

    function aplicarBeneficiosOrigem(origemKey) {
        // Limpar benefícios de perícia anteriores
        document.querySelectorAll('.treino-check.origem-treino').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.classList.remove('origem-treino');
            checkbox.disabled = false;
        });
        document.querySelectorAll('#tabela-pericias tbody tr.origem-highlight').forEach(row => {
            row.classList.remove('origem-highlight');
        });

        if (origemKey === 'nenhuma' || !origemKey) return;

        const origem = ORIGENS_DATA[origemKey];
        if (origem && origem.pericias[0] !== 'Duas à sua escolha') {
            origem.pericias.forEach(nomePericia => {
                const row = document.querySelector(`#tabela-pericias tbody tr[data-nome="${nomePericia}"]`);
                if (row) {
                    const checkbox = row.querySelector('.treino-check');
                    checkbox.checked = true;
                    checkbox.classList.add('origem-treino');
                    checkbox.disabled = true;
                    row.classList.add('origem-highlight');
                }
            });
        }
    }

    function handleOrigemChange() {
        const modalOrigem = document.getElementById('modal-origem');
        const modalOrigemTitulo = modalOrigem.querySelector('#modal-origem-titulo');
        const modalOrigemBeneficios = modalOrigem.querySelector('#modal-origem-beneficios');
        const selectedOrigemKey = document.getElementById('origem').value;

        aplicarBeneficiosOrigem(selectedOrigemKey);

        if (selectedOrigemKey !== 'nenhuma') {
            const origem = ORIGENS_DATA[selectedOrigemKey];
            if (origem) {
                modalOrigemTitulo.textContent = origem.nome;
                modalOrigemBeneficios.innerHTML = `
                    <p><strong>Perícias Treinadas:</strong> ${origem.pericias.join(', ')}</p>
                    <p><strong>Poder: ${origem.poder}</strong></p>
                    <p>${origem.descricao}</p>
                `;
                modalOrigem.style.display = 'block';
            }
        }

        saveCharacterData();
    }

    function popularClasses() {
        const selectClasse = document.getElementById('classe');
        Object.keys(CLASSES_DATA).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = CLASSES_DATA[key].nome;
            selectClasse.appendChild(option);
        });
    }

    function updateHabilidades() {
        const classeKey = document.getElementById('classe').value;
        const trilhaKey = document.getElementById('trilha').value;
        const nex = parseInt(document.getElementById('nex').value) || 0;
        const habilidadesTextarea = document.getElementById('habilidades-texto');

        let oldText = habilidadesTextarea.value;
        const startMarker = "--- HABILIDADES DE CLASSE/TRILHA ---";
        const endMarker = "------------------------------------";
        const regex = new RegExp(`\\n?${startMarker}[\\s\\S]*?${endMarker}\\n?`, 'g');
        habilidadesTextarea.value = oldText.replace(regex, '').trim();

        if (classeKey === 'nenhuma') return;

        const classe = CLASSES_DATA[classeKey];
        let newAbilities = `\n\n${startMarker}\n`;

        // Habilidades da Classe Base
        for (const nexLevel in classe.habilidades_base) {
            if (nex >= nexLevel) {
                newAbilities += `NEX ${nexLevel}% (Classe): ${classe.habilidades_base[nexLevel]}\n`;
            }
        }

        // Habilidades da Trilha
        if (trilhaKey && trilhaKey !== 'nenhuma' && classe.trilhas[trilhaKey]) {
            const trilha = classe.trilhas[trilhaKey];
            for (const nexLevel in trilha.habilidades) {
                if (nex >= nexLevel) {
                    newAbilities += `NEX ${nexLevel}% (${trilha.nome}): ${trilha.habilidades[nexLevel]}\n`;
                }
            }
        }
        newAbilities += `${endMarker}`;
        habilidadesTextarea.value += newAbilities;
    }

    function handleClasseChange() {
        const classeKey = document.getElementById('classe').value;
        const trilhaGroup = document.getElementById('trilha-group');
        const trilhaSelect = document.getElementById('trilha');

        // Limpa e esconde o dropdown de trilha
        const trilhaAnterior = trilhaSelect.value;
        trilhaSelect.innerHTML = '<option value="nenhuma" selected>-- Selecione --</option>';

        if (classeKey !== 'nenhuma') {
            const classe = CLASSES_DATA[classeKey];
            Object.keys(classe.trilhas).forEach(trilhaKey => {
                const option = document.createElement('option');
                option.value = trilhaKey;
                option.textContent = classe.trilhas[trilhaKey].nome;
                trilhaSelect.appendChild(option);
            });
            trilhaGroup.style.display = 'block';
            // Tenta manter a trilha se ela existir na nova classe
            if (classe.trilhas[trilhaAnterior]) {
                trilhaSelect.value = trilhaAnterior;
            }
        } else {
            trilhaGroup.style.display = 'none';
        }

        updateHabilidades();
    }

    function popularTabelaPericias() {
        const tbody = document.querySelector('#tabela-pericias tbody');
        tbody.innerHTML = '';
        periciasLista.forEach(pericia => {
            const tr = document.createElement('tr');
            tr.dataset.attr = pericia.attr;
            tr.dataset.nome = pericia.nome;
            tr.innerHTML = `
                <td>${pericia.nome} (${pericia.attr.toUpperCase()})</td>
                <td class="pericia-total">0</td>
                <td class="col-treino"><input type="checkbox" class="treino-check"></td>
                <td><input type="number" value="0" class="pericia-bonus-input"></td>
            `;
            tbody.appendChild(tr);
        });
    }

    function addArmaRow(arma = { nome: '', tipoDano: '', criticoAlcance: '' }) {
        const tbody = document.querySelector('#tabela-armas tbody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" placeholder="Ex: Revólver" value="${arma.nome}"></td>
            <td><input type="text" placeholder="Tiro / 1d12" value="${arma.tipoDano}"></td>
            <td><input type="text" placeholder="19 / Curto" value="${arma.criticoAlcance}"></td>
            <td><button class="btn-remove">X</button></td>
        `;
        tbody.appendChild(tr);
        tr.querySelectorAll('input').forEach(input => input.addEventListener('input', saveCharacterData));
    }

    function addItemRow(item = { item: '', espacos: '1' }) {
        const tbody = document.querySelector('#tabela-inventario tbody');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" placeholder="Ex: Lanterna" value="${item.item}"></td>
            <td><input type="number" value="${item.espacos}" style="width: 80px; text-align: center;"></td>
            <td><button class="btn-remove">X</button></td>
        `;
        tbody.appendChild(tr);
        tr.querySelectorAll('input').forEach(input => input.addEventListener('input', saveCharacterData));
    }

    function setupCharacterSwitcher() {
        const switcherContainer = document.getElementById('character-switcher');
        for (let i = 0; i < NUM_CHARS; i++) {
            const btn = document.createElement('button');
            btn.className = 'char-btn';
            btn.textContent = `Personagem ${i + 1}`;
            btn.dataset.index = i;
            btn.addEventListener('click', () => loadCharacterData(i));
            switcherContainer.appendChild(btn);
        }
    }

    function updateSwitcherUI() {
        document.querySelectorAll('.char-btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === activeCharacterIndex);
        });
    }

    function init() {
        // Popula tabelas e dropdowns
        popularTabelaPericias();
        popularOrigens();
        popularClasses();
        popularIdades();

        // Listeners dos Modais
        const modalOrigem = document.getElementById('modal-origem');
        const modalArmas = document.getElementById('modal-armas');

        modalOrigem.querySelector('.close-button').addEventListener('click', () => modalOrigem.style.display = 'none');
        modalArmas.querySelector('.close-button').addEventListener('click', () => modalArmas.style.display = 'none');
        document.getElementById('search-arma').addEventListener('input', (e) => popularListaArmas(e.target.value));

        // Listener global para fechar modais ao clicar fora
        window.addEventListener('click', (event) => {
            if (event.target == modalOrigem || event.target == modalArmas) {
                modalOrigem.style.display = 'none';
                modalArmas.style.display = 'none';
            }
        });

        // Listeners de Ações Principais
        document.getElementById('origem').addEventListener('change', () => {
            handleOrigemChange();
            saveCharacterData();
        });
        document.getElementById('classe').addEventListener('change', () => {
            handleClasseChange();
            saveCharacterData();
        });
        document.getElementById('trilha').addEventListener('change', () => {
            updateHabilidades();
            saveCharacterData();
        });
        document.getElementById('idade').addEventListener('change', handleIdadeChange);
        document.getElementById('desvantagens-container').addEventListener('change', saveCharacterData);

        // Listeners para Adicionar Itens
        document.getElementById('add-arma').addEventListener('click', () => {
            popularListaArmas();
            modalArmas.style.display = 'block';
        });
        document.getElementById('add-item').addEventListener('click', () => { addItemRow(); saveCharacterData(); });
        document.getElementById('add-ritual').addEventListener('click', () => { addRitualRow(); saveCharacterData(); });

        // Listeners de Eventos Globais (Inputs e Remoção)
        document.body.addEventListener('input', (event) => {
            if (event.target.closest('.save-field, #atributos, #pericias, #status')) {
                saveCharacterData();
            }
            if (event.target.id === 'nex') {
                updateHabilidades();
            }
        });

        document.body.addEventListener('change', (event) => { // Para checkboxes
            if (event.target.classList.contains('treino-check')) {
                saveCharacterData();
            }
        });

        document.body.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-remove')) {
                event.target.closest('tr').remove();
                saveCharacterData();
            }
        });

        // Carregamento Inicial
        const savedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
        if (savedData && savedData.length === NUM_CHARS) {
            characters = savedData;
        } else {
            for (let i = 0; i < NUM_CHARS; i++) {
                characters.push(createDefaultCharacter());
            }
        }

        setupCharacterSwitcher();
        loadCharacterData(activeCharacterIndex);
    }

    init();
});

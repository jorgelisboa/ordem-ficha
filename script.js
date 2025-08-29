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

    function createDefaultCharacter() {
        const defaultPericias = {};
        periciasLista.forEach(p => {
            defaultPericias[p.nome] = { treinado: false, bonus: 0 };
        });

        return {
            info: {
                'nome-jogador': '', 'nome-personagem': '', 'ocupacao': '', 'origem': 'nenhuma',
                'classe': 'nenhuma', 'trilha': 'nenhuma', 'nex': 5, 'pv-atual': '', 'san-atual': '', 'pe-atual': '',
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

        document.getElementById('classe').value = charData.info['classe'] || 'nenhuma';
        handleClasseChange();
        document.getElementById('trilha').value = charData.info['trilha'] || 'nenhuma';
        updateHabilidades();

        updateSwitcherUI();
        recalcularFicha();
    }
    
    function recalcularFicha() {
        document.querySelectorAll('.stat-highlight').forEach(el => el.classList.remove('stat-highlight'));
        const origemKey = document.getElementById('origem').value;
        const origem = ORIGENS_DATA[origemKey];
        const beneficios = (origem && origem.beneficios) ? origem.beneficios : {};

        const nex = parseInt(document.getElementById('nex').value) || 0;
        const vigor = parseInt(document.getElementById('vig').value) || 0;
        const presenca = parseInt(document.getElementById('pre').value) || 0;
        const agilidade = parseInt(document.getElementById('agi').value) || 0;
        const forca = parseInt(document.getElementById('for').value) || 0;
        const intelecto = parseInt(document.getElementById('int').value) || 0;

        const atributos = {
            agi: agilidade, for: forca, int: intelecto, pre: presenca, vig: vigor
        };

        const nexLevel = Math.floor(nex / 5);

        const classeKey = document.getElementById('classe').value;
        const classe = CLASSES_DATA[classeKey];

        const pvBase = classe ? classe.pv_base : 16;
        const pvNivel = classe ? classe.pv_nivel : 3;
        const sanBase = classe ? classe.san_base : 12;
        const sanNivel = classe ? classe.san_nivel : 3;
        const peBase = classe ? classe.pe_base : 2;
        const peNivel = classe ? classe.pe_nivel : 2;

        // --- Cálculos de Status ---
        let pvMax = (pvBase + vigor) + ((pvNivel + vigor) * (nexLevel - 1));
        if (beneficios.pv_por_nex) {
            pvMax += (Math.floor(nex / 5) * beneficios.pv_por_nex);
            document.getElementById('pv-max').classList.add('stat-highlight');
        }

        let sanMax = sanBase + (sanNivel * (nexLevel - 1));
        if (beneficios.sanidade_mod) {
            sanMax = Math.floor(sanMax * beneficios.sanidade_mod);
            document.getElementById('san-max').classList.add('stat-highlight');
        }
        if (beneficios.san_por_nex) {
            sanMax += (Math.floor(nex / 5) * beneficios.san_por_nex);
            document.getElementById('san-max').classList.add('stat-highlight');
        }

        let peMax = (peBase + presenca) + ((peNivel + presenca) * (nexLevel - 1));
        if (beneficios.pe_bonus) {
            peMax += beneficios.pe_bonus;
            document.getElementById('pe-max').classList.add('stat-highlight');
        }
        if (beneficios.pe_por_nex_impar) {
            const bonusPEImpar = Math.floor((nexLevel - 1) / 2);
            if (bonusPEImpar > 0) {
                peMax += bonusPEImpar;
                document.getElementById('pe-max').classList.add('stat-highlight');
            }
        }

        document.getElementById('pv-max').textContent = pvMax;
        document.getElementById('san-max').textContent = sanMax;
        document.getElementById('pe-max').textContent = peMax;

        // --- Cálculo de Defesa ---
        let defesaPassiva = 10 + agilidade;
        if (beneficios.defesa_passiva) {
            defesaPassiva += beneficios.defesa_passiva;
            document.getElementById('defesa-passiva').classList.add('stat-highlight');
        }
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

        // Omitido por enquanto: Destaque de outros benefícios de texto
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
        popularTabelaPericias();
        popularOrigens();
        popularClasses();

        const modalOrigem = document.getElementById('modal-origem');
        const closeButton = modalOrigem.querySelector('.close-button');
        document.getElementById('origem').addEventListener('change', handleOrigemChange);
        document.getElementById('classe').addEventListener('change', () => {
            handleClasseChange();
            saveCharacterData();
        });
        document.getElementById('trilha').addEventListener('change', () => {
            updateHabilidades();
            saveCharacterData();
        });
        closeButton.addEventListener('click', () => {
            modalOrigem.style.display = 'none';
        });
        window.addEventListener('click', (event) => {
            if (event.target == modalOrigem) {
                modalOrigem.style.display = 'none';
            }
        });

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

        // Event Listeners Globais
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
        
        document.getElementById('add-arma').addEventListener('click', () => { addArmaRow(); saveCharacterData(); });
        document.getElementById('add-item').addEventListener('click', () => { addItemRow(); saveCharacterData(); });
        document.getElementById('add-ritual').addEventListener('click', () => { addRitualRow(); saveCharacterData(); });
        
        document.body.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-remove')) {
                event.target.closest('tr').remove();
                saveCharacterData();
            }
        });
    }

    init();
});

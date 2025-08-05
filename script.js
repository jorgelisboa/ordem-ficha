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

    function createDefaultCharacter() {
        const defaultPericias = {};
        periciasLista.forEach(p => {
            defaultPericias[p.nome] = { treinado: false, bonus: 0 };
        });

        return {
            info: {
                'nome-jogador': '', 'nome-personagem': '', 'ocupacao': '', 'origem': '', 
                'classe': '', 'nex': 5, 'pv-atual': '', 'san-atual': '', 'pe-atual': '',
                'outras-resistencias': '', 'habilidades-texto': ''
            },
            atributos: { 'agi': 0, 'for': 0, 'int': 0, 'pre': 0, 'vig': 0 },
            pericias: defaultPericias,
            armas: [],
            inventario: []
        };
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

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(characters));
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

        updateSwitcherUI();
        recalcularFicha();
    }
    
    function recalcularFicha() {
        const nex = parseInt(document.getElementById('nex').value) || 0;
        const vigor = parseInt(document.getElementById('vig').value) || 0;
        const presenca = parseInt(document.getElementById('pre').value) || 0;
        const agilidade = parseInt(document.getElementById('agi').value) || 0;
        const forca = parseInt(document.getElementById('for').value) || 0;

        const atributos = {
            agi: agilidade, for: forca, int: parseInt(document.getElementById('int').value) || 0,
            pre: presenca, vig: vigor
        };

        const pvPorNivel = 8 + vigor;
        const sanPorNivel = 8;
        const pePorNivel = 2 + presenca;
        const nexLevel = Math.floor(nex / 5);

        document.getElementById('pv-max').textContent = pvPorNivel + ((vigor + 2) * (nexLevel - 1));
        document.getElementById('san-max').textContent = sanPorNivel + (2 * (nexLevel - 1));
        document.getElementById('pe-max').textContent = pePorNivel + (presenca * (nexLevel - 1));

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

        document.getElementById('defesa-passiva').textContent = 10 + agilidade;
        document.getElementById('defesa-esquiva').textContent = 10 + totalReflexos;
        document.getElementById('carga-maxima').textContent = 5 + forca;
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
            if (event.target.classList.contains('recalculate')) {
                recalcularFicha();
            }
        });

        document.body.addEventListener('change', (event) => { // Para checkboxes
            if (event.target.classList.contains('treino-check')) {
                saveCharacterData();
                recalcularFicha();
            }
        });
        
        document.getElementById('add-arma').addEventListener('click', () => { addArmaRow(); saveCharacterData(); });
        document.getElementById('add-item').addEventListener('click', () => { addItemRow(); saveCharacterData(); });
        
        document.body.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-remove')) {
                event.target.closest('tr').remove();
                saveCharacterData();
            }
        });
    }

    init();
});

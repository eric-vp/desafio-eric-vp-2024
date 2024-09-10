class RecintosZoo {
    constructor() {
        this.recintos = [
            {
                numero: 1,
                bioma: ['savana'],
                tamanhoTotal: 10,
                animais: [{ especie: 'MACACO', quantidade: 3 }]
            },
            {
                numero: 2,
                bioma: ['floresta'],
                tamanhoTotal: 5,
                animais: []
            },
            {
                numero: 3,
                bioma: ['savana', 'rio'],
                tamanhoTotal: 7,
                animais: [{ especie: 'GAZELA', quantidade: 1 }]
            },
            {
                numero: 4,
                bioma: ['rio'],
                tamanhoTotal: 8,
                animais: []
            },
            {
                numero: 5,
                bioma: ['savana'],
                tamanhoTotal: 9,
                animais: [{ especie: 'LEAO', quantidade: 1 }]
            }
        ];

        this.animais = {
            LEAO: {
                tamanho: 3,
                biomas: ['savana'],
                carnivoro: true
            },
            LEOPARDO: {
                tamanho: 2,
                biomas: ['savana'],
                carnivoro: true
            },
            CROCODILO: {
                tamanho: 3,
                biomas: ['rio'],
                carnivoro: true
            },
            MACACO: {
                tamanho: 1,
                biomas: ['savana', 'floresta'],
                carnivoro: false
            },
            GAZELA: {
                tamanho: 2,
                biomas: ['savana'],
                carnivoro: false
            },
            HIPOPOTAMO: {
                tamanho: 4,
                biomas: ['savana', 'rio'],
                carnivoro: false
            }
        };
    }

    analisaRecintos(animal, quantidade) {
        const especie = animal.toUpperCase();

        // Verifica se a quantidade é válida
        if (quantidade <= 0 || isNaN(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        // Verifica se o animal é válido
        if (!(especie in this.animais)) {
            return { erro: "Animal inválido" };
        }

        // Percorre toda a lista de recintos para criar uma nova lista de recintos viáveis
        const recintosViaveis = this.recintos.map(recinto => {
            const animalTamanho = this.animais[especie].tamanho;
            const biomaCompativel = this.verificaBioma(recinto, especie);
            // Se o bioma for compatível, executa 'calculaEspaco()'
            if(biomaCompativel) {
                // O retorno de 'calculaEspaco()' é uma string com os dados dos recintos válidos      
                return this.calculaEspaco(recinto, especie, animalTamanho, quantidade);
            }
            // Se o bioma não for compatível, é retornado 'null'
            return null;
            // O 'filter(Boolean)' remove os valores 'null' da lista 'recintosViaveis'
        }).filter(Boolean);

        if (recintosViaveis.length > 0) {
            // Se a lista de recintos viáveis conter recintos válidos, é retornado cada um
            return { recintosViaveis };
        } else {
            // Se a lista de recintos viáveis não conter nenhum valor, é retornado o erro
            return { erro: "Não há recinto viável" }
        }
    }

    verificaBioma(recinto, especie) {
        const animalBiomas = this.animais[especie].biomas;
        // Verifica se algum dos biomas dos animais é compatível com os biomas do recinto através da função 'some()'
        return recinto.bioma.some(bioma => animalBiomas.includes(bioma));
    }

    verificaCompatibilidade(recinto, especie, quantidade, contemCarnivoro, novoAnimalCarnivoro, animaisRecinto) {
        //Verifica o que causa um recinto não ser viável para certos animais 
        if (contemCarnivoro && animaisRecinto.length > 0) {
            // Se tem animais carnívoros no recinto
            return true;
        } else if (!contemCarnivoro && novoAnimalCarnivoro && animaisRecinto.length > 0) {
            // Se tem animais não carnívoros no recinto, mas o novo animal é carnívoro
            return true;
        } else if (especie == "MACACO" && quantidade == 1 && recinto.animais.length == 0) {
            // Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie
            return true;
        } else if (especie == "HIPOPOTAMO" && recinto.animais.length > 0 && !(recinto.bioma.includes('savana') && recinto.bioma.includes('rio'))) {
            // Hipopótamo(s) só tolera(m) outras espécies estando num recinto com savana e rio
            return true;
        }
        return false;
    }

    verificaAnimaisNoRecinto(recinto, especie) {
        // Lista onde os animais que já estão no recinto, e que são de espécies diferentes do animal verificado, serão adicionados
        const animaisRecinto = [];
        let contemCarnivoro = false;

        // Verifica cada animal já presente no recinto através do 'forEach()'
        recinto.animais.forEach(animalRecinto => {
            const especieNoRecinto = animalRecinto.especie.toUpperCase();
            if (this.animais[especieNoRecinto].carnivoro) {
                // Se o animal no recinto for carnívoro, 'contemCarnivoro' é verdadeiro
                contemCarnivoro = true;
            }
            if (especieNoRecinto != especie) {
                // Se o animal no recinto for de espécie diferente da espécie verificada, ele é adicionado à lista 'animaisRecinto'
                animaisRecinto.push(especieNoRecinto);
            }
        });
        return { contemCarnivoro, animaisRecinto };
    }

    calculaEspaco(recinto, especie, tamanhoAnimal, quantidade) {
        const { contemCarnivoro, animaisRecinto } = this.verificaAnimaisNoRecinto(recinto, especie);
        const novoAnimalCarnivoro = this.animais[especie].carnivoro;

        // Verifica quando um recinto não é válido
        if (this.verificaCompatibilidade(recinto, especie, quantidade, contemCarnivoro, novoAnimalCarnivoro, animaisRecinto)) {
            return null;
        }
        
        const espacoOcupado = this.calculaEspacoOcupado(recinto, animaisRecinto);
        const espacoLivre = recinto.tamanhoTotal - espacoOcupado;        
        const espacoNecessario = tamanhoAnimal * quantidade;

        if (espacoLivre >= espacoNecessario) {
            // Se o espaço for suficiente, é retornado uma string com os valores do recinto
            return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre - espacoNecessario} total: ${recinto.tamanhoTotal})`;
        }
        // Retorna null se não houver espaço disponível em nenhum recinto
        return null;
    }

    calculaEspacoOcupado(recinto, animaisRecinto) {
        // Espaço extra caso tenham espécies diferentes no recinto
        const espacoExtra = animaisRecinto.length > 0 ? 1 : 0;
        // Calcula o espaço ocupado pelos animais no recinto
        return recinto.animais.reduce((total, animalNoRecinto) => {
            const especieAnimal = this.animais[animalNoRecinto.especie.toUpperCase()];
            // Multiplica a quantidade de animais pelo seu tamanho e adiciona um espaço extra se forem de espécie diferente
            return total + (animalNoRecinto.quantidade * especieAnimal.tamanho);
        }, 0) + espacoExtra;
    }
}

export { RecintosZoo as RecintosZoo };

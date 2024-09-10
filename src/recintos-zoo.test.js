import { RecintosZoo } from "./recintos-zoo.js";

describe('Recintos do Zoologico', () => {

    test('Deve rejeitar animal inválido', () => {
        const resultado = new RecintosZoo().analisaRecintos('UNICORNIO', 1);
        expect(resultado.erro).toBe("Animal inválido");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Deve rejeitar quantidade inválida', () => {
        const resultado = new RecintosZoo().analisaRecintos('MACACO', 0);
        expect(resultado.erro).toBe("Quantidade inválida");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Não deve encontrar recintos para 10 macacos', () => {
        const resultado = new RecintosZoo().analisaRecintos('MACACO', 10);
        expect(resultado.erro).toBe("Não há recinto viável");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Deve encontrar recinto para 1 crocodilo', () => {
        const resultado = new RecintosZoo().analisaRecintos('CROCODILO', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 4 (espaço livre: 5 total: 8)');
        expect(resultado.recintosViaveis.length).toBe(1);
    });

    test('Deve encontrar recintos para 2 macacos', () => {
        const resultado = new RecintosZoo().analisaRecintos('MACACO', 2);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 1 (espaço livre: 5 total: 10)');
        expect(resultado.recintosViaveis[1]).toBe('Recinto 2 (espaço livre: 3 total: 5)');
        expect(resultado.recintosViaveis[2]).toBe('Recinto 3 (espaço livre: 2 total: 7)');
        expect(resultado.recintosViaveis.length).toBe(3);
    });

    // NOVOS TESTES

    test('Não deve encontrar recintos para leopardos, pois as savanas contém outras espécies', () => {
        const resultado = new RecintosZoo().analisaRecintos('leopardo', 1);
        expect(resultado.erro).toBe("Não há recinto viável");
        expect(resultado.recintosViaveis).toBeFalsy();
    });

    test('Deve encontrar recintos para 1 hipopótamo', () => {
        const resultado = new RecintosZoo().analisaRecintos('hipopotamo', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 3 (espaço livre: 0 total: 7)');
        expect(resultado.recintosViaveis[1]).toBe('Recinto 4 (espaço livre: 4 total: 8)');
        expect(resultado.recintosViaveis.length).toBe(2);
    });

    test('Deve encontrar recintos com outros animais para apenas 1 macaco', () => {
        const resultado = new RecintosZoo().analisaRecintos('macaco', 1);
        expect(resultado.erro).toBeFalsy();
        expect(resultado.recintosViaveis[0]).toBe('Recinto 1 (espaço livre: 6 total: 10)');
        expect(resultado.recintosViaveis[1]).toBe('Recinto 3 (espaço livre: 3 total: 7)');
        expect(resultado.recintosViaveis.length).toBe(2);
    });

});


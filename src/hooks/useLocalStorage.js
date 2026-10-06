import { useState,useEffect } from 'react';

export function useLocalStorage(key, valorInicial) {
    const [valor, setValor] = useState(() => {
        // A função passada pro useState só roda UMA VEZ (na primeira renderização).
        // Isso é importante: sem a função ('useState(localStorage.getItem(key))' ,
        // por exemplo), o localStorage seria lido em TODO render, mesmo sem
        // necessidade - essa forma é chamda de "inicialização lazy".
        const salvo = localStorage.getItem(key);

        if (salvo) {
            // localStorage só guarda strings, então o que foi salvo precisa
            // ser convertido de volta pro formato original (array de objetos).
            return JSON.parse(salvo);
        }

        return valorInicial;
    });

    useEffect(() => {
        // Sempre que 'valor' mudar, salva de novo no localStorage.
        // JSON.stringify converte o array/objeto pra string, porque é
        // o único formato que o localStorage aceita.
        localStorage.setItem(key, JSON.stringify(valor));
    }, [valor]);

    return [valor, setValor];
}
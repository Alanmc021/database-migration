const fs = require('fs');
const axios = require('axios');
// Lê o conteúdo do arquivo JSON
const jsonString = fs.readFileSync('./pdt-app-fe29a-default-rtdb-user-export (2).json', 'utf8');

// Converte o conteúdo em um objeto JavaScript
const jsonObject = JSON.parse(jsonString);

// Transforma o objeto em um array de entradas (chave-valor)
const entries = Object.entries(jsonObject);

// Função para disparar o endpoint
function dispararEndpoint(objetoConvertido) {
    // Substitua a URL abaixo pela URL do seu endpoint
    const endpointURL = '';

    // Faz a requisição POST com os dados do objetoConvertido
    axios.post(endpointURL, objetoConvertido)
        .then(response => {
            console.log('Endpoint disparado com sucesso!');
            //console.log('Resposta do servidor:', response.data);
        })
        .catch(error => {
            console.error('Erro ao disparar o endpoint:', error.message);
            console.log(objetoConvertido)
        });
}

// Função para processar cada objeto e disparar o endpoint
function processarObjeto(index) {
    if (index < entries.length) {
        const [key, value] = entries[index];
        // (seu código para extrair e formatar os dados do objeto aqui...)

        // console.log(value);
        // console.log("########################################");

        const stringWithHyphen = value.cep;
        const stringWithoutHyphen = stringWithHyphen.replace("-", "");
        const numberValueCep = parseInt(stringWithoutHyphen, 10);

        const cpfWithSpecialCharacters = value.cpf;
        const cpfWithoutSpecialCharacters = cpfWithSpecialCharacters.replace(/\./g, '').replace('-', '');
        const cpfAsNumberCpf = parseInt(cpfWithoutSpecialCharacters, 10);

        const phoneNumber = value.phone;
        const numericString = phoneNumber.replace(/\D/g, '');
        const phoneNumberAsNumber = parseInt(numericString, 10);

        const daraFormt = formatarData(value.registrationData)
        const dataAniversario = formatarDataAniversario(value.birthDate);

        const objetoConvertido = {
            personalInformation: {
                fullname: value.name || "Sem valor",
                cpf: cpfAsNumberCpf || "Sem valor",
                imageWallet: value.urlLocalStoragePerfilCard || value.urlLocalStorage || "Sem valor",
                birthDate: dataAniversario || "Sem valor",
                motherFullname: value.motherName || "Sem valor",
                phoneNumber: phoneNumberAsNumber || "Sem valor",
                job: value.profession || "Sem valor",
                religion: value.religion || "Outras",
                email: value.email || "Sem valor",
                gender: value.gender || "Sem valor",
                schoolingLevel: value.profession || "Sem valor"
            },
            address: {
                cep: numberValueCep || "Sem valor",
                state: value.state || "Sem valor",
                city: value.city || "Sem valor",
                neighborhood: value.district || "Sem valor",
                street: value.street || "Sem valor",
                houseNumber: value.number || "Sem valor",
                complement: value.fullAddress || "Sem valor"
            },
            electionInformation: {
                voterRegistration: value.voterRegistrationCard || "Sem valor",
                electionZone: value.electoralZone || "Sem valor",
                section: value.section || "Sem valor",
                image: "www.teste.com/imagem.jpeg"
            },
            createdAt: daraFormt || "2023-07-26T16:45:30.000Z'"

        }

        // console.log("numero " + [i])
        // console.log(objetoConvertido)
        // console.log("########################################"); 

        // console.log('Objeto Convertido:');
        // console.log(objetoConvertido);
        // console.log('########################################');

        // Dispara o endpoint para o objetoConvertido
        dispararEndpoint(objetoConvertido);

        // Chama a função novamente para processar o próximo objeto após 20 segundos
        setTimeout(() => {
            processarObjeto(index + 1);
            console.log("contador de filiados: " + index)
        }, 10000); // Intervalo de 10 segundos (20000 milissegundos)
    }
}

function formatarData(data) {
    if (data === null || data === undefined || typeof data !== 'string') {
        // Se data for null, undefined ou não for uma string, retorna data de fallback
        return "2023-08-26T16:45:30.000Z";
    }

    const [mes, dia, ano] = data.split('/');


    let anoComPrefixo;
    if (ano.length === 2) {
        // Se o ano tiver apenas dois dígitos, adiciona "20" na frente
        anoComPrefixo = `20${ano}`;
    } else {
        // Caso contrário, mantém o ano como está
        anoComPrefixo = ano;
    }

    if (mes > 12) {
        const novaDataFormatada = `${anoComPrefixo}-${dia.padStart(2, '0')}-${mes.padStart(2, '0')}T16:45:30.000Z`;
        return novaDataFormatada;
    }

    const novaDataFormatada = `${anoComPrefixo}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T16:45:30.000Z`;
    return novaDataFormatada;
}

function formatarDataAniversario(data) {
    const [dia, mes, ano] = data.split('/');

    // O objeto Date aceita o formato "ano-mes-dia" diretamente    

    const dataFormatada = new Date(`${ano}-${mes}-${dia}`).toISOString();

    return dataFormatada;
}


// Inicia o processamento com o primeiro objeto do array
processarObjeto(0);

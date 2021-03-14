// Modal 

const Modal = {
    open(){
        document.querySelector('.modal-overlay').classList.add('active')

    },
    close(){
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}


// Array transações

//   const transactions = [
//      {
//       description: 'Luz',
//       amount: -50000,
//      date: '23/01/2021'
//       },
//       {
//       description: 'Website',
//       amount: 500000,
//       date: '23/01/2021'
//       },
//       {
//       description: 'Internet',
//       amount: -70000,
//       date: '23/01/2021'
//       },
//   ]

// CRIA UMA FUNÇÃO QUE MOSTRA SE O RESULTADO É MAIOR OU MENOR QUE 0
// E CRIA UMA FUNÇÃO QUE SUBTRAI ENTRADA E SAÍDA E APRESENTA O TOTAL
// all recebe refatoração

const Storage = {

    // Pega os dados de string e transaforma em array ou
    // retorna vazio 
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions"))|| []
    },

    // Define o nome do objeto e a propriedade
    // transforma o array em string
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    },
}


const Transaction = {
    // Seleciona todos os dados dentro do array

    all: Storage.get(),
        

    // Adiciona um novo array

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    // Remove algum array

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes(){
        let income = 0;

        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        return income;
    },

    expenses(){
         let expense = 0;

         Transaction.all.forEach(transaction => {
             if(transaction.amount < 0) {
                 expense += transaction.amount;
             }
         })
         return expense;
    },

    total(){
       return Transaction.incomes() + Transaction.expenses();

    }
}

const DOM = {

// CAPTURA MINHA TABELA
// CRIA UM TR
// DEFINE O TR COMO FILHO DO TBODY

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

// CRIA UM HTML DENTRO DO TBODY COM UMA NOVA TABELA
// FORMATA A TABELA COM OS DADOS ADICIONADOS NO ARRAY TRANSACTIONS
// RETORNA EM HTML

    innerHTMLTransaction(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/assets/minus.svg" alt="remover transação">
            </td>
            `

        return html
    },

//  MOSTRAR NA TELA INCOME, EXPENSE E TOTAL FORMATADOS COM O UTILS
//  ADICIONA A FUNÇÃO DE Transaction PARA MOSTRAR O RESULTADO DE 
//  ENTRADAS, SAÍDAS E TOTAL

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }

}

// FORMATAÇÃO DE VALORES E MOEDAS

const Utils = {
    formatAmount(value) {
        value = value * 100 
        return Math.round(value)
       
        // value = Number(value) * 100

        // return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`

    },

    // Formatação da moeda

    formatCurrency(value) {
        // Se menor que 0 remove o -
        const signal = Number(value) < 0 ? "-" : ""
        
        // Pega o sinal e transforma em string
        value = String(value).replace(/\D/g, "")

        // Divide o número por 100
        value = Number(value) / 100

        // Transforma em português e depois em Real
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        
        return signal + value
 
    }

}

// Formulário de transações

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),
    
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    // Validação de dados por meio de um alert
    // Primeiro usamos o get para obter os dados 
    // depois usamos o if para criar a mensagem de erro
    // se faltar algum dos dados apresentados
    // usamos o trim para limpar

    validateFields() {
        const { description, amount, date} = Form.getValues()

        if( description.trim() === "" || 
        amount.trim() ==="" || 
        date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")

        }
    },

    // Após enviar os dados nosso event
    // checa se falta algum dado e se faltar exibe
    // o alert, se não apenas salva.

    formatValues() {
        let { description, amount, date } = Form.getValues()
    
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return { 
            description, 
            amount, 
            date
        }
    },

    // Salvar os dados do formulário

    // saveTransaction(transaction) {
    //     Transaction.add(transaction)
    // },

    // Limpar os campos do formulário

    clearFields() {
        Form.description.value = "",
        Form.amount.value = "",
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {

            // Verificar se todas as informações foram preenchidas

            Form.validateFields()

            // formatar os dados

            const transaction = Form.formatValues()

            // Limpar os dados

            Transaction.add(transaction)
            // limpar os dados do formulário

            Form.clearFields()

            // fechar modal

            Modal.close()

            // Mensagem de erro

        } catch (error) {
            alert(error.message)
        }


    }
}

// Memória do browser



// Refatorando 
// Criamos um App que faz atualização dos dados

const App = {
    init() {

        // MOSTRA NA TELA TODAS AS TRANSAÇÕES
       Transaction.all.forEach(DOM.addTransaction)
    
       
        // MOSTRA O CALCULO NA TELA
        DOM.updateBalance()

        // Transformando e salvando as transações
        Storage.set(Transaction.all)
    },

    // Recarrega os dados e limpa tudo
    // Depois inicia adicionando ou não

    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

// Return

App.init()
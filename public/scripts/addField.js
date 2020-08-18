// Controle para Remoção
let index = 1;

// Procurar o botão
document.querySelector("#add-time")
// Clicar no botão
.addEventListener('click', checkField)
// Executar uma ação
function checkField() {
    // Duplicar os campos
    const fieldContainer = document.querySelector('#schedule-items')
    let empty = false
    //Verifica se os campos estão vazios
    fieldContainer.querySelectorAll('.schedule-item')
    .forEach(function(field){

        field.querySelectorAll('input').
        forEach(function(item){
            console.log(field.value)
            if(item.value == ''){
                empty = true
            }
        })

    })

    if(empty ==  false ){
        cloneField()
    }
}

function cloneField() {
    const newFieldContainer = document.querySelector('.schedule-item').cloneNode(true)
    
    //limpar os campos
    const fields = newFieldContainer.querySelectorAll('input')
    //limpar cada campo
    fields.forEach(function(field){
        field.value = ""
    })

    //Colocar na página
    document.querySelector('#schedule-items').appendChild(newFieldContainer)
    // Atualizar o contador de campos
    index ++
    document.getElementById('remove-container-none').id = "remove-container-solid"
}

document.querySelector("#remove-time")
.addEventListener('click', deleteField)

function deleteField() {
    // Receber último campo de horário
    const node = document.getElementById('schedule-items').lastElementChild

    // Verificar quantos campos existem
    if(index > 1 ){
        // Verificar se o campo de Horários é null
        if(node.parentNode){
            // Remover o Ultimo Campo
            node.outerHTML = ''
            // Atualizar o contador de campos
            index --
        }
    }

    if( index == 1) {
        document.getElementById('remove-container-solid').id = "remove-container-none"
    }
  
}

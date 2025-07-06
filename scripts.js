let tarefaSelecionada = null;
let tarefaParaExcluir = null;
/*
  --------------------------------------------------------------------------------------
  Função para formatar a hora
  --------------------------------------------------------------------------------------
*/
const formatarDataHoraBR = (dataString) => {
	const data = new Date(dataString);
	const dataFormatada = data.toLocaleString('pt-BR', {
		timeZone: 'America/Sao_Paulo',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});

	return dataFormatada;
}
/*
  --------------------------------------------------------------------------------------
  Função criar e adicionar o card relacionado a tarefa 
  --------------------------------------------------------------------------------------
*/
const adicionaCard = (tarefa) => {

	const card = document.createElement('div');
	card.className = 'card';
	card.draggable = true;
	card.ondragstart = drag;
	card.onclick = () => abrirModalEditar(card);
	const dataFormatada = formatarDataHoraBR(tarefa.data_status);

	card.innerHTML = `<input type="hidden" class="tarefa-id" value="${tarefa.id}">`
	card.innerHTML += `<strong class="tarefa-titulo">${tarefa.nome}</strong>`
	card.innerHTML += `<p class="tarefa-descricao">${tarefa.descricao}</p>`
	card.innerHTML += `<small class="tarefa-data">Data: ${dataFormatada }</small>`
	card.innerHTML += `<i class="fas fa-trash delete-icon" onclick="abrirModalExcluir(event, this)"></i>`;

	const coluna = document.getElementById(`coluna${tarefa.status}`);
	coluna.insertBefore(card, coluna.querySelector('.button'));
}
/*
  --------------------------------------------------------------------------------------
  Função buscar as tarefas via requisição GET e criar os cards
  --------------------------------------------------------------------------------------
*/
const carregarTarefas = async () => {
	let url = 'http://127.0.0.1:5000/tarefas';
	fetch(url, {
		method: 'get',
	})
		.then((response) => response.json())
		.then((data) => {
		data.tarefas.forEach(tarefa => {
			adicionaCard(tarefa);
		});
		})
		.catch((error) => {
		console.error('Error:', error);
		});
}
/*
  --------------------------------------------------------------------------------------
  Função para atualizar uma tarefa via requisição PUT
  --------------------------------------------------------------------------------------
*/
const atualizarTarefa = async (novo_status) => {
	const formData = new FormData();

	titulo = tarefaSelecionada.querySelector('.tarefa-titulo').innerText;
	descricao = tarefaSelecionada.querySelector('.tarefa-descricao').innerText;
	tarefaId = tarefaSelecionada.querySelector('.tarefa-id').value;

	formData.append('nome', titulo);
	formData.append('descricao', descricao);
	formData.append('status', novo_status);

	let url = `http://127.0.0.1:5000/tarefa/${tarefaId}`;


	try {
		const response = await fetch(url, {
			method: 'put',
			body: formData
		});

		if (!response.ok) {
			throw new Error("Erro ao atualizar tarefa.");
		}

		const data = await response.json();
		return data;

	} catch (error) {
		console.error('Erro na atualização:', error);
		return null;
	}
}
/*
  --------------------------------------------------------------------------------------
  Função para buscar uma tarefa via requisição GET
  --------------------------------------------------------------------------------------
*/
const buscaTarefa = async (tarefaId) => {

	let url = `http://127.0.0.1:5000/tarefa?id=${tarefaId}`;

	try {
		const response = await fetch(url, {
			method: 'get',
		});

		if (!response.ok) {
			throw new Error("Erro ao atualizar tarefa.");
		}

		const data = await response.json();
		return data;

	} catch (error) {
		console.error('Erro na atualização:', error);
		return null;
	}
}
/*
  --------------------------------------------------------------------------------------
  Função para adicionar uma tarefa via requisição POST
  --------------------------------------------------------------------------------------
*/
const adicionarTarefa = async (titulo, descricao) => {
	const formData = new FormData();
	formData.append('nome', titulo);
	formData.append('descricao', descricao);

	let url = 'http://127.0.0.1:5000/tarefa';

	try {
		const response = await fetch(url, {
			method: 'post',
			body: formData
		});

		if (!response.ok) {
			throw new Error("Erro ao inserir a tarefa.");
		}

		const data = await response.json();
		return data;

	} catch (error) {
		console.error('Erro na inserção:', error);
		return null;
	}
}
/*
  --------------------------------------------------------------------------------------
  Função para adicionar uma tarefa via requisição POST
  --------------------------------------------------------------------------------------
*/
const adicionarAnotacao = async (tarefaId, descricao) => {
	const formData = new FormData();
	formData.append('tarefa_id', tarefaId);
	formData.append('descricao', descricao);

	let url = 'http://127.0.0.1:5000/anotacao';

	try {
		const response = await fetch(url, {
			method: 'post',
			body: formData
		});

		if (!response.ok) {
			throw new Error("Erro ao inserir a anotação.");
		}

		const data = await response.json();
		return data;

	} catch (error) {
		console.error('Erro na inserção:', error);
		return null;
	}
}
/*
  --------------------------------------------------------------------------------------
  Função para deletar uma tarefa via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const excluirTarefa = (tarefaId) => {

	let url = `http://127.0.0.1:5000/tarefa?id=${tarefaId}`;
	fetch(url, {
		method: 'delete'
	})
		.then((response) => response.json())
		.catch((error) => {
		console.error('Error:', error);
		});
}
/*
  --------------------------------------------------------------------------------------
  Função para abrir o modal de adição de tarefas
  --------------------------------------------------------------------------------------
*/
const abrirModalAdicionar = () => {
	document.getElementById('titulo').value = '';
	document.getElementById('descricao').value = '';
  	document.getElementById('modalAdicionar').style.display = 'flex';
}
/*
  --------------------------------------------------------------------------------------
  Função para abrir o modal de edição de tarefas
  --------------------------------------------------------------------------------------
*/
const abrirModalEditar = (element) => {
	tarefaSelecionada = element;
	document.getElementById('idEdit').value = tarefaSelecionada.querySelector('.tarefa-id').value;
	document.getElementById('tituloEdit').value = element.querySelector('.tarefa-titulo').innerText;
	document.getElementById('descricaoEdit').value = element.querySelector('.tarefa-descricao').innerText;
	document.getElementById('statusEdit').value = getStatusColuna(element.parentElement.id);
	document.getElementById('modalEditar').style.display = 'flex';
}
/*
  --------------------------------------------------------------------------------------
  Função para fechar o modal
  --------------------------------------------------------------------------------------
*/
const fecharModal = (id) => {
  document.getElementById(id).style.display = 'none';
}
/*
  --------------------------------------------------------------------------------------
  Função para validar os forms de adição e edição
  --------------------------------------------------------------------------------------
*/
const validaForm = (tipo) => {
	campoTitulo = "";
	campoDescricao = "";

	if (tipo === 'incluir'){
		campoTitulo = document.getElementById('titulo');
		campoDescricao = document.getElementById('descricao');
	} else {
		campoTitulo = document.getElementById('tituloEdit');
		campoDescricao = document.getElementById('descricaoEdit');
	}

	if (campoTitulo.value === "") {
		campoTitulo.setCustomValidity("Por favor, preencha este campo.");
		campoTitulo.reportValidity();
		return false; // Impede o envio do formulário
	} else {
		campoTitulo.setCustomValidity(''); // Limpa a mensagem de erro
		campoTitulo.reportValidity();
	}

	if (campoDescricao.value === "") {
		campoDescricao.setCustomValidity("Por favor, preencha este campo.");
		campoDescricao.reportValidity();
		return false; // Impede o envio do formulário
	} else {
		campoDescricao.setCustomValidity(''); // Limpa a mensagem de erro
		campoDescricao.reportValidity();
	}

	return true;
}
/*
  --------------------------------------------------------------------------------------
  Função para salvar uma nova tarefas
  --------------------------------------------------------------------------------------
*/
const  salvarTarefa = async () => {
	const titulo = document.getElementById('titulo').value;
	const descricao = document.getElementById('descricao').value;

	if (validaForm('incluir')){

		const tarefa = await adicionarTarefa(titulo, descricao);

		if (tarefa) {
			adicionarAnotacao(tarefa.id, 'Tarefa adicionada pelo usuário.');
			adicionaCard(tarefa);
			fecharModal('modalAdicionar');
		} else {
			console.error("Falha ao adicionar tarefa antes de buscar dados atualizados.");
		}
	}
}
/*
  --------------------------------------------------------------------------------------
  Função para salvar a edição de uma tarefas
  --------------------------------------------------------------------------------------
*/
const salvarEdicao = async () => {
	const titulo = document.getElementById('tituloEdit').value;
	const descricao = document.getElementById('descricaoEdit').value;
	const status = document.getElementById('statusEdit').value;
	const tarefaId = document.getElementById('idEdit').value;

	if (validaForm('editar')){
		tarefaSelecionada.querySelector('.tarefa-titulo').innerText = titulo;
		tarefaSelecionada.querySelector('.tarefa-descricao').innerText = descricao;
		tarefaSelecionada.querySelector('.tarefa-id').value = tarefaId;

		const tarefa = await atualizarTarefa(status);

		if (tarefa) {
			adicionarAnotacao(tarefa.id, 'Tarefa editada pelo usuário manualmente.');

			tarefaSelecionada.querySelector('.tarefa-data').innerText = "Data: " + formatarDataHoraBR(tarefa.data_status);
			const novaColuna = document.getElementById(`coluna${status}`);
			novaColuna.insertBefore(tarefaSelecionada, novaColuna.querySelector('.button'));

		} else {
			console.error("Falha ao atualizar tarefa antes de buscar dados atualizados.");
		}

		fecharModal('modalEditar');
	}
}
/*
  --------------------------------------------------------------------------------------
  Função consultar o status da coluna
  --------------------------------------------------------------------------------------
*/
const getStatusColuna = (colunaId) => {
  if (colunaId === 'coluna1') return '1';
  if (colunaId === 'coluna2') return '2';
  if (colunaId === 'coluna3') return '3';
  return '1';
}
/*
  --------------------------------------------------------------------------------------
  Função para permitir o drop
  --------------------------------------------------------------------------------------
*/
const allowDrop = (ev) => {
  ev.preventDefault();
}
/*
  --------------------------------------------------------------------------------------
  Função para guardar as informações da tarefa movida
  --------------------------------------------------------------------------------------
*/
const drag = (ev) => {
  tarefaSelecionada = ev.target;
}
/*
  --------------------------------------------------------------------------------------
  Função para tratar a mudança de status/coluna da tarefa movida
  --------------------------------------------------------------------------------------
*/
const drop = async (ev) => {
	ev.preventDefault();
	const coluna = ev.currentTarget;
	const status = getStatusColuna(coluna.id);

	const tarefa = await atualizarTarefa(status);

	if (tarefa) {
		adicionarAnotacao(tarefa.id, 'Tarefa editada pelo usuário via drag and drop.');

		tarefaSelecionada.querySelector('.tarefa-data').innerText = "Data: " + formatarDataHoraBR(tarefa.data_status);
		coluna.insertBefore(tarefaSelecionada, coluna.querySelector('.button'));
		document.getElementById('statusEdit').value = tarefa.status;

	} else {
		console.error("Falha ao atualizar tarefa antes de buscar dados atualizados.");
	}
}
/*
  --------------------------------------------------------------------------------------
  Função para abrir o modal para confirmar a exclusão da tarefa
  --------------------------------------------------------------------------------------
*/
const abrirModalExcluir = (event, icon) => {
	event.stopPropagation();
	tarefaParaExcluir = icon.closest('.card');
	document.getElementById('modalConfirmarExclusao').style.display = 'flex';
}
/*
  --------------------------------------------------------------------------------------
  Função para tratar a exclusão da tarefa
  --------------------------------------------------------------------------------------
*/
const confirmarExclusao = () => {
	if (tarefaParaExcluir) {

		const tarefaId = tarefaParaExcluir.querySelector('.tarefa-id').value;
		excluirTarefa(tarefaId);
		tarefaParaExcluir.remove();
		tarefaParaExcluir = null;
	}
	fecharModal('modalConfirmarExclusao');
}
/*
  --------------------------------------------------------------------------------------
  Acionamento da função carregarTarefas ao carregar a página
  --------------------------------------------------------------------------------------
*/
document.addEventListener("DOMContentLoaded", carregarTarefas);

function adicionarTarefa() {
	const input = document.getElementById("nova-tarefa");
	const texto = input.value.trim();
	if (texto) {
	  const li = criarElementoTarefa(texto, false);
	  document.getElementById("lista-tarefas").appendChild(li);
	  salvarLocalStorage();
	  input.value = "";
	}
}
  
function criarElementoTarefa(texto, concluida) {
	const li = document.createElement("li");
  
	// Coluna do checkbox
	const colCheckbox = document.createElement("div");
	colCheckbox.className = "col-checkbox";
  
	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = concluida;
	colCheckbox.appendChild(checkbox);
  
	// Coluna do texto
	const colTexto = document.createElement("div");
	colTexto.className = "col-texto";
  
	const span = document.createElement("span");
	span.textContent = texto;
	if (concluida) span.classList.add("concluida");
	colTexto.appendChild(span);
  
	checkbox.onchange = () => {
	  span.classList.toggle("concluida", checkbox.checked);
	  salvarLocalStorage();
	};
  
	// Coluna das ações
	const colAcoes = document.createElement("div");
	colAcoes.className = "col-acoes";
  
	const btnEditar = document.createElement("button");
	const iconEditar = document.createElement("img");
	iconEditar.src = "src/icon/editar.png";
	iconEditar.alt = "Editar";
	iconEditar.className = "icon";
	btnEditar.appendChild(iconEditar);
	btnEditar.onclick = () => {
	  const novoTexto = prompt("Editar tarefa:", span.textContent);
	  if (novoTexto !== null && novoTexto.trim() !== "") {
		span.textContent = novoTexto.trim();
		salvarLocalStorage();
	  }
	};
  
	const btnRemover = document.createElement("button");
	const iconRemover = document.createElement("img");
	iconRemover.src = "src/icon/trash.png";
	iconRemover.alt = "Remover";
	iconRemover.className = "icon";
	btnRemover.appendChild(iconRemover);
	btnRemover.onclick = () => {
	  li.remove();
	  salvarLocalStorage();
	};
  
	colAcoes.appendChild(btnEditar);
	colAcoes.appendChild(btnRemover);
  
	// Montar o li
	li.appendChild(colCheckbox);
	li.appendChild(colTexto);
	li.appendChild(colAcoes);

	li.draggable = true;

	li.addEventListener("dragstart", (e) => {
	e.dataTransfer.setData("text/plain", li.dataset.id);
	li.classList.add("dragging");
	});

	li.addEventListener("dragend", () => {
	li.classList.remove("dragging");
	});
	li.dataset.id = Date.now();
  
	return li;
}	
  
function salvarLocalStorage() {
	const tarefas = [];
	document.querySelectorAll("#lista-tarefas li").forEach((li) => {
	  const texto = li.querySelector("span").textContent;
	  const concluida = li.querySelector("input[type='checkbox']").checked;
	  tarefas.push({ texto, concluida });
	});
	localStorage.setItem("tarefas", JSON.stringify(tarefas));
}
  
function carregarTarefas() {
	const dados = localStorage.getItem("tarefas");
	if (dados) {
	  const tarefas = JSON.parse(dados);
	  tarefas.forEach((t) => {
		const li = criarElementoTarefa(t.texto, t.concluida);
		document.getElementById("lista-tarefas").appendChild(li);
	  });
	}
}
  
window.onload = carregarTarefas;
 
const lista = document.getElementById("lista-tarefas");

lista.addEventListener("dragover", (e) => {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  const afterElement = getDragAfterElement(lista, e.clientY);
  if (afterElement == null) {
    lista.appendChild(dragging);
  } else {
    lista.insertBefore(dragging, afterElement);
  }
});

lista.addEventListener("drop", () => {
  salvarLocalStorage();
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

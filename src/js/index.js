var formElement;
function getForm() {
  if (!formElement) {
    formElement = document.querySelector('.start-game');
  }
  return formElement;
}

window.onload = function() {
  if (getForm()) {
    getForm().addEventListener("submit", startGame);
  }
}

function startGame(e) {
  e.preventDefault();
}

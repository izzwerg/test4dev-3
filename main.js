const mainForm = document.querySelector(".main-form");

mainForm.addEventListener("submit", onSubmit);

function onSubmit(e) {
  e.preventDefault();
  let letters = e.target.elements.text.value.split("");
  mainForm.reset();
  let markupData = "";
  for (let index = 0; index < letters.length; index++) {
    markupData += `<div class="letter">${letters[index]}</div>`;
  }
  document.body.insertAdjacentHTML("beforeend", "<div class='start-field'></div>");
  const startField = document.querySelector(".start-field");
  startField.insertAdjacentHTML("beforeend", markupData);
  const renderedLetters = document.querySelectorAll(".letter");
  renderedLetters.forEach((renderedLetter) => {
    renderedLetter.onmousedown = function (event) {
      let shiftX = event.clientX - renderedLetter.getBoundingClientRect().left;
      let shiftY = event.clientY - renderedLetter.getBoundingClientRect().top;

      renderedLetter.style.position = "absolute";
      renderedLetter.style.zIndex = 2;

      document.body.append(renderedLetter);

      function moveAt(pageX, pageY) {
        renderedLetter.style.left = pageX - shiftX / 2 + "px";
        renderedLetter.style.top = pageY - shiftY / 2 + "px";
      }

      moveAt(event.pageX, event.pageY);

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
      }

      document.addEventListener("mousemove", onMouseMove);

      renderedLetter.onmouseup = function () {
        document.removeEventListener("mousemove", onMouseMove);
        renderedLetter.onmouseup = null;
      };
    };
    renderedLetter.ondragstart = function () {
      return false;
    };
  });
}

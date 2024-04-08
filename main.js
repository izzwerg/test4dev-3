const mainForm = document.querySelector(".main-form");

mainForm.addEventListener("submit", onSubmit);

function onSubmit(e) {
  e.preventDefault();
  let letters = e.target.elements.text.value.split("");
  mainForm.reset();
  let markupData = "";
  for (let index = 0; index < letters.length; index++) {
    markupData += `<div class="letter single">${letters[index]}</div>`;
  }
  document.body.insertAdjacentHTML(
    "beforeend",
    "<div class='start-field'></div>"
  );
  const startField = document.querySelector(".start-field");
  startField.insertAdjacentHTML("beforeend", markupData);
  moved();
  selectLetters();

}

function moved() {
  const renderedLetters = document.querySelectorAll(".single");
  renderedLetters.forEach((renderedLetter) => {
    renderedLetter.onmousedown = function (event) {
      //https://javascript.info/mouse-drag-and-drop
      let shiftX = event.clientX - renderedLetter.getBoundingClientRect().left;
      let shiftY = event.clientY - renderedLetter.getBoundingClientRect().top;

      renderedLetter.style.position = "absolute";
      renderedLetter.style.zIndex = 2;

      document.body.append(renderedLetter);

      function moveAt(pageX, pageY) {
        renderedLetter.style.left = pageX - shiftX / 2 + "px";
        renderedLetter.style.top = pageY - shiftY / 2 + "px";
        const { x, y, width, height } = renderedLetter.getBoundingClientRect();
        renderedLetter.dataset.info = JSON.stringify({ x, y, width, height });
        
        // document.removeEventListener("pointerdown", createSelectAreaDiv);
        
      }

      moveAt(event.pageX, event.pageY);
      selectLetters()

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

function selectLetters() {
  const renderedLetters = document.querySelectorAll(".letter");
  let positionX;
  let positionY;
  let checker = false;
  document.addEventListener("mousemove", updatePosotion, false);
  document.addEventListener("mouseenter", updatePosotion, false);
  document.addEventListener("mouseleave", updatePosotion, false);
  function updatePosotion(event) {
    positionX = event.pageX;
    positionY = event.pageY;
    renderedLetters.forEach((item) => {
      const { x, y, width, height } = item.getBoundingClientRect();
      if (
        checkRectIntersection(
          { x: positionX, y: positionY },
          { x, y, width, height }
        )
      ) {
        checker = false;
      } else {
        checker = true;
      }
    });
  }

  const selectables = [];
  const selectableElems = [...document.querySelectorAll(".letter")];
  for (const selectable of selectableElems) {
    const { x, y, width, height } = selectable.getBoundingClientRect();
    selectables.push({
      x: x + window.scrollX,
      y: y + window.scrollY,
      width,
      height,
      elem: selectable,
    });
    selectable.dataset.info = JSON.stringify({ x, y, width, height });
  }

  function checkSelected(selectAreaElem) {
    const select = selectAreaElem.getBoundingClientRect();
    const { x, y, height, width } = select;
    for (const selectable of selectables) {
      if (
        checkRectIntersection(
          { x: x + window.scrollX, y: y + window.scrollY, height, width },
          selectable
        )
      ) {
        selectable.elem.classList.add("selected");
        selectable.elem.classList.remove("single");
      } else {
        selectable.elem.classList.remove("selected");
        selectable.elem.classList.add("single");
      }
    }
  }
  // ------------

  function checkRectIntersection(r1, r2) {
    // stackoverflow.com/a/13390495
    return !(
      r1.x + r1.width < r2.x ||
      r2.x + r2.width < r1.x ||
      r1.y + r1.height < r2.y ||
      r2.y + r2.height < r1.y
    );
  }

  addEventListener("pointerdown", createSelectAreaDiv);
  async function createSelectAreaDiv(event) {
    if (checker == true) {
      // stackoverflow.com/a/75902998
      event.preventDefault();
      const x = event.pageX;
      const y = event.pageY;

      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.width = "0";
      div.style.height = "0";
      div.style.left = x + "px";
      div.style.top = y + "px";
      div.classList.add("drag-select");
      document.body.append(div);

      function resize(event) {
        const diffX = event.pageX - x;
        const diffY = event.pageY - y;
        div.style.left = diffX < 0 ? x + diffX + "px" : x + "px";
        div.style.top = diffY < 0 ? y + diffY + "px" : y + "px";
        div.style.height = Math.abs(diffY) + "px";
        div.style.width = Math.abs(diffX) + "px";
        checkSelected(div); // extra line 1
      }
      selectables.forEach((item) => item.elem.classList.remove("intersected")); // extra line 2
      addEventListener("pointermove", resize);
      addEventListener("pointerup", () => {
        removeEventListener("pointermove", resize);
        div.remove();
      });
    }
  }
}

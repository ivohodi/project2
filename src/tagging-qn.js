import { LitElement, html, css } from 'lit';
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

export class TaggingQn extends DDD {

  static get tag() {
    return 'tagging-qn';
  }

  constructor() {
    super();
    this.rambletxt = "";
    this.options=[];
    this.answers=[];
    this.draggedIndex;
    this.draggedFrom;
    this.answerSet = "default";
    this.imgsrc="";
  }

  static get styles() {
    return[
        super.styles,
        css`
        :host {
        display: flex;
      }
      .tagging-wrapper{
        font-family:var(--ddd-font-primary-regular);
        padding:var(--ddd-spacing-2);
      }
      .answer-box,.options-box{
        display: flex;
        padding:var(--ddd-spacing-4);
        margin: var(--ddd-spacing-5);
        border: solid 3px var(--ddd-theme-default-creekTeal);
        background:var(--ddd-theme-default-creekMaxLight);
      }
      .options,.answers{
        font-family:var(--ddd-font-primary-regular);
        border:solid 2px var(--ddd-theme-default-coalyGray);
        padding:var(--ddd-spacing-2);
        margin: var(--ddd-spacing-2);
      }
      .qn-image{
        width:200px;
        padding:var(--ddd-spacing-4);
        margin: var(--ddd-spacing-3);
      }
      .clearbtn,.submitbtn{
        font-family:var(--ddd-font-primary-regular);
        font-size: 16px;
        letter-spacing: 2px;
        text-decoration: none;
        text-transform: uppercase;
        color: var(--ddd-theme-default-coalyGray);
        cursor: pointer;
        border: 3px solid;
        padding: var(--ddd-spacing-2);
        margin:var(--ddd-spacing-2);
        box-shadow: 1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px, 5px 5px 0px 0px;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
      }
      .clearbtn:active,.submitbtn:active {
        box-shadow: 0px 0px 0px 0px;
        top: 5px;
        left: 5px;
      }
      @media (min-width: 768px) {
        .clearbtn,.submitbtn {
          padding: 0.25em 0.75em;
        }
      }
      .button-wrapper{
        display:flex;
        justify-content:right;
        margin-right:var(--ddd-spacing-8);
      }
      .answers,.options:hover{
        cursor:grab;
      }
      .feedback-box{
        padding:var(--ddd-spacing-4);
        margin: var(--ddd-spacing-5);
      }
      `];
  }

  firstUpdated() {
    super.firstUpdated();
    const optionsBox = this.shadowRoot.querySelectorAll('.options-box');
    const answerBox = this.shadowRoot.querySelectorAll('.answer-box');

    answerBox.forEach(answerBox => {
      answerBox.addEventListener('dragstart', (e) => this.dragStart(e));
      answerBox.addEventListener('dragover', (e) => this.dragOver(e));
      answerBox.addEventListener('dragenter', (e) => this.dragEnter(e));
      answerBox.addEventListener('dragleave', (e) => this.dragLeave(e));
      answerBox.addEventListener('drop', (e) => this.drop(e, 'answer-box'));
    });

    optionsBox.forEach(optionsBox => {
      optionsBox.addEventListener('dragstart', (e) => this.dragStart(e));
      optionsBox.addEventListener('dragover', (e) => this.dragOver(e));
      optionsBox.addEventListener('dragenter', (e) => this.dragEnter(e));
      optionsBox.addEventListener('dragleave', (e) => this.dragLeave(e));
      optionsBox.addEventListener('drop', (e) => this.drop(e, 'options-box'));
    });
    this.getData();
  }

  // Drag Functions
  dragStart(e) {
    this.draggedIndex = parseInt(e.target.dataset.index);
    this.draggedFrom = e.target.dataset.origin;
    }

  dragOver(e) {
    e.preventDefault();
  }
  dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('hovered');
  }

  dragLeave(e) {
    e.target.classList.remove('hovered');
  }

  drop(e, target,index,from) {
    e.preventDefault();
    //if this vals are null, set them to index and from (this is for pressing the buttons instead of drag and drop)
    if (this.draggedFrom == null || this.draggedIndex == null) {
      this.draggedFrom = from;
      this.draggedIndex = index;
    }

    e.target.classList.remove('hovered');

    if (target === 'answer-box') {
      if (this.draggedFrom != 'answer-box') {
        this.answers.push(this.options[this.draggedIndex]);
        this.options.splice(this.draggedIndex, 1);
      }
    } else if (target === 'options-box') {
      if (this.draggedFrom != 'options-box') {
        this.options.push(this.answers[this.draggedIndex]);
        this.answers.splice(this.draggedIndex, 1);
      }
    } 
    this.requestUpdate();

    this.cleanCheck();
    this.draggedIndex = null;
    this.draggedFrom = null;

    this.requestUpdate();
  }

makeItRain() { //confetti 
  import("@lrnwebcomponents/multiple-choice/lib/confetti-container.js").then(
    (module) => {
      setTimeout(() => {
        this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
      }, 0);
    }
  );
}

clearOptions(){
  if (this.answers != '') {
    this.answers.forEach(answer => {
      this.options.push(answer);

    });
    this.answers = [];
    this.cleanCheck();
  }
  this.shuffle();
  this.requestUpdate();
}

getData() {
  fetch('src/data.json')
    .then((response) => response.json())
    .then((json) => {
      const possibleQuestions = json[this.answerSet];

      this.options = [];
      const tags = [];
      for (const key in possibleQuestions) {
        const option = possibleQuestions[key];
        const choice = document.createElement('choices');
        choice.textContent = key;
        choice.dataset.correct = option.correct;
        choice.dataset.feedback = option.feedback;
        tags.push(choice);
      }

      tags.forEach(choice => {
        this.options.push(choice);
      });
      this.shuffle();
  });
}

shuffle() {
  for (let i = this.options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this.options[i], this.options[j]] = [this.options[j], this.options[i]];
  }
}

checkAnswers(){
 if (this.answers != '') {
      this.shadowRoot.querySelector('.feedback-box').innerHTML = ``;
      let allCorrect = 0;
      //Gets the feedback and correct data from each answer
      this.answers.forEach((ans, index) => {
        const feedback = this.answers[index].dataset.feedback;
        const isCorrect = this.answers[index].dataset.correct;
        this.answers[index].style.border = 'none';
        //if the answer is correct, background is green
        if (isCorrect == "true") {
          allCorrect += 1;
          this.answers[index].style.backgroundColor="var(--ddd-theme-default-futureLime)";
          this.shadowRoot.querySelector('.feedback-box').innerHTML +="<strong>" + ans.textContent + "</strong> is correct<br>";
        //if the answer is wrong,background is red
        } else {
          this.answers[index].style.backgroundColor="var(--ddd-theme-default-alertImmediate)";
          this.shadowRoot.querySelector('.feedback-box').innerHTML +=  "<strong>" + ans.textContent + "</strong> is wrong because " + feedback + "<br>";
        }
      });
      //If all answers in answer box is correct, confetti rain
      if (allCorrect == this.answers.length) {
        this.makeItRain();
      }

    }
    this.requestUpdate();
}
  cleanCheck(){
    this.shadowRoot.querySelector('.feedback-box').innerHTML ="";
    this.options.forEach((ans, index) => {
      this.options[index].style.backgroundColor="transparent";
    });
    this.answers.forEach((ques, index) => {
      this.answers[index].style.backgroundColor="transparent";
    });
  }

  render() {
    return html`
      <confetti-container id="confetti">
      <div class="tagging-wrapper"> 
        <div class="rambletxt">${this.rambletxt}</div>
        <img class="qn-image" src="${this.imgsrc}" alt="image">
        <div>${this.questiontext}</div>
        <div class="answer-box">
          Drag Answers Here
          ${this.answers.map((answer, index) => html`
          <div class="answers-wrapper">
            <div  @click="${(e) => this.drop(e,"options-box", index, "answer-box")}" class="answers" draggable="true" data-index="${index}" data-origin="answer-box">${answer}</div>
          </div>
          `)}
          </div>
        </div>
        <div class="feedback-box"></div>
        <div class="button-wrapper">
          <button class="clearbtn" @click="${this.clearOptions}"> Clear</button>
          <button class="submitbtn" @click="${this.checkAnswers}"> Submit</button>
        </div>
        
        
        <div class="options-box">
        ${this.options.map((option, index) => html`
        <div class="options">
          <div @click="${(e) => this.drop(e,"answer-box", index, "options-box")}" draggable="true" data-index="${index}" data-origin="options-box">${option}</div>
        </div>
        </div>
        `)}
        </confetti-container>
      </div>
    `;
  }

  static get properties() {
    return {
      rambletxt: { type: String },
      questiontext: {type:String},
      options:{type:Array, reflect:true},
      answers:{type:Array, reflect:true},
      draggedIndex: { type: Number, reflect: true },
      draggedFrom: { type: String, reflect: true},
      answerSet: { type: String, reflect: true},
      imgsrc:{type:String,reflect:true}
    };
  }
}
globalThis.customElements.define(TaggingQn.tag, TaggingQn);

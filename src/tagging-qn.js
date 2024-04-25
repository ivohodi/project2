import { LitElement, html, css } from 'lit';
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

export class TaggingQn extends DDD {

  static get tag() {
    return 'tagging-qn';
  }

  constructor() {
    super();
    this.title = "Question Tags";
    this.options=[];
    this.answers=[];
    this.draggedIndex;
    this.draggedFrom;
    this.answerSet = "default";
  }

  static get styles() {
    return[
        super.styles,
        css`
        :host {
        display: block;
      }
      .tagging-wrapper{
        padding:var(--ddd-spacing-2);
      }
      .answer-box,.options-box{
        display: inline-block;
        height: 160px;
        width:90%;
        padding:var(--ddd-spacing-4);
        margin: var(--ddd-spacing-5);
        border: solid 3px var(--ddd-theme-default-creekTeal);
        background:var(--ddd-theme-default-creekMaxLight);
      }
      .qn-image{
        width:200px;
        
      }
      .options-box{
        display:flex;
      }
      .options,.answers{
        border:solid 2px black;
        padding:var(--ddd-spacing-2);
        margin: var(--ddd-spacing-2);
        width:150px;
        height:30px; 
      }
    .clearbtn,.submitbtn{
    font-family: "Open Sans", sans-serif;
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

drop(e, target) {
  e.preventDefault();
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

  render() {
    return html`
      <confetti-container id="confetti">
      <div class="tagging-wrapper"> 
        <h1 >${this.title}</h1>
        <img class="qn-image" src="images/haxpsu.png" alt="haxpsu">
        <div>${this.questiontext}</div>
        <div class="answer-box">
          Drag Answers Here
          ${this.answers.map((answer, index) => html`
          <div class="answers-wrapper">
            <div class="answers" draggable="true" data-index="${index}" data-origin="answer-box">${answer}</div>
          </div>
          `)}
          </div>
        </div>

        <div class="button-wrapper">
          <button class="clearbtn" @click="${this.clearOptions}"> Clear</button>
          <button class="submitbtn" @click="${this.makeItRain}"> Submit</button>
        </div>
        
        
        <div class="options-box">
        ${this.options.map((option, index) => html`
        <div class="options">
          <div draggable="true" data-index="${index}" data-origin="options-box">${option}</div>
        </div>
        </div>
        `)}
        </confetti-container>
      </div>
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      questiontext: {type:String},
      options:{type:Array, reflect:true},
      answers:{type:Array, reflect:true},
      draggedIndex: { type: Number, reflect: true },
      draggedFrom: { type: String, reflect: true},
      answerSet: { type: String, reflect: true},
    };
  }
}
globalThis.customElements.define(TaggingQn.tag, TaggingQn);

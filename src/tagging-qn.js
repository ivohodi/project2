import { LitElement, html, css } from 'lit';
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

export class TaggingQn extends DDD {

  static get tag() {
    return 'tagging-qn';
  }

  constructor() {
    super();
    this.title = "Question Tags";
    this.options=["AI generated","Beautiful","Good Form","Accessible"];
    this.answers=[];
    this.draggedIndex;
    this.draggedFrom;
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
        width: 90%;
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

// importdata(){
//   supder.importdata();
//   const choices=this.choices;
//   fetch('src/data.json')
//       .then((response) => response.json())
//       .then((json) => {
//         const choicestag = this.shadowRoot.getElementById('choicestag');
//         const choices = json[choices];
        
//         const buttons = [];
//         for (const key in choices) {
//           const option = choices[key];
//           const button = document.createElement('button');
//           button.classList.add('chip');
//           button.draggable = true;
//           button.textContent = key;
//           button.dataset.correct = option.correct;
//           button.dataset.feedback = option.feedback;
//           button.addEventListener('dragstart', this.handleDragStart.bind(this));
//           buttons.push(button);
//         }});
        
//         buttons.forEach(button => {
//           choicestag.appendChild(button);
//         });
// }
//   //}
  

  render() {
    return html`
      <confetti-container id="confetti">
      <div class="tagging-wrapper"> 
        <h1 >${this.title}</h1>
        <img class="qn-image" src="images/haxpsu.png" alt="haxpsu">
        <div>${this.questiontext}</div>
        <div class="answer-box">
          <!-- Drag Answers Here -->
          ${this.answers.map((answer, index) => html`
          <div class="answers-wrapper">
            <div class="answers" draggable="true" data-index="${index}" data-origin="answer-box">${answer}</div>
          </div>
          `)}
          </div>
        </div>
        <div>
          <button class="clearbtn"> Clear</button>
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
    };
  }
}
globalThis.customElements.define(TaggingQn.tag, TaggingQn);

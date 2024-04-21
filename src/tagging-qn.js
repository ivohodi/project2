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
      .options{
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

    answerBoxes.forEach(optionsBox => {
      answerBox.addEventListener('dragstart', (e) => this.dragStart(e));
      answerBox.addEventListener('dragover', (e) => this.dragOver(e));
      answerBox.addEventListener('dragenter', (e) => this.dragEnter(e));
      answerBox.addEventListener('dragleave', (e) => this.dragLeave(e));
      answerBox.addEventListener('drop', (e) => this.drop(e, 'options-box'));
    });

    questionBoxes.forEach(answerBox => {
      questionBox.addEventListener('dragstart', (e) => this.dragStart(e));
      questionBox.addEventListener('dragover', (e) => this.dragOver(e));
      questionBox.addEventListener('dragenter', (e) => this.dragEnter(e));
      questionBox.addEventListener('dragleave', (e) => this.dragLeave(e));
      questionBox.addEventListener('drop', (e) => this.drop(e, 'answer-box'));
    });
  }

// Drag Functions

dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.textContent);
  this.currentTag = e.target;
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

dragDrop(e) {
  e.preventDefault();
  this.className = 'empty';
  this.append(dragging);
}

importdata(){
  supder.importdata();
  const choices=this.choices;
  fetch('src/data.json')
      .then((response) => response.json())
      .then((json) => {
        const choicestag = this.shadowRoot.getElementById('choicestag');
        const choices = json[choices];
        
        const buttons = [];
        for (const key in choices) {
          const option = choices[key];
          const button = document.createElement('button');
          button.classList.add('chip');
          button.draggable = true;
          button.textContent = key;
          button.dataset.correct = option.correct;
          button.dataset.feedback = option.feedback;
          button.addEventListener('dragstart', this.handleDragStart.bind(this));
          buttons.push(button);
        }});
        
        buttons.forEach(button => {
          choicestag.appendChild(button);
        });
}
  //}
  

  render() {
    return html`
      <div class="tagging-wrapper"> 
        <h1 >${this.title}</h1>
        <img class="qn-image" src="images/haxpsu.png" alt="haxpsu">
        <div>${this.questiontext}</div>
        <div class="answer-box" @drop="${(e) => this.drop(e, 'input-area')}" @dragover="${this.allowDrop}">
        Drag Answers Here
        <button class="clearbtn"> Clear</button>
        <button class="submitbtn"> Submit</button>
        </div>
        ${this.answers.map((answer, index) => html`
        <div class="answers-wrapper">
                        <div class="answers" draggable="true" @dragstart="${() => this.drag(index)}">${answer}</div>
                    </div>
                    `)}
                </div>

        <div class="options-box">
        ${this.options.map((question, index) => html`
        <div class="options">
          <div class="answers" draggable="true" @dragstart="${() => this.drag(index)}">${question}</div>
        </div>
        </div>
        `)}
      </div>
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      questiontext: {type:String},
      options:{type:Array, reflect:true},
      answers:{type:Array, reflect:true},
    };
  }
}
globalThis.customElements.define(TaggingQn.tag, TaggingQn);

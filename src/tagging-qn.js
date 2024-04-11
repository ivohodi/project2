import { LitElement, html, css } from 'lit';
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

export class TaggingQn extends DDD {

  static get tag() {
    return 'tagging-qn';
  }

  constructor() {
    super();
    this.title = "Question Tags";
  }

  static get styles() {
    return[
        super.styles,
        css`
        :host {
        display: block;
        
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
      
    
    `];
  }

  render() {
    return html`
        <div >${this.title}</div>
        <div>${this.questiontext}</div>
        <div class="answer-box">Drag Answers Here</div>
        <div class="options-box">Options</div>
        `;
  }

  static get properties() {
    return {
      title: { type: String },
      questiontext: {type:String},
    };
  }
}


globalThis.customElements.define(TaggingQn.tag, TaggingQn);

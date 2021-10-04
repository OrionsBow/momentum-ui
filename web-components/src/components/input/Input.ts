/**
 * Copyright (c) Cisco Systems, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "@/components/help-text/HelpText";
import "@/components/icon/Icon";
import "@/components/label/Label";
import "@/components/spinner/Spinner";
import { ARIA_INVALID, Key } from "@/constants";
import { customElementWithCheck } from "@/mixins/CustomElementCheck";
import { FocusMixin } from "@/mixins/FocusMixin";
import reset from "@/wc_scss/reset.scss";
import iconNamesList from "@momentum-ui/icons/data/iconNames.json";
import { html, internalProperty, LitElement, property, query } from "lit-element";
import { nothing } from "lit-html";
import { classMap } from "lit-html/directives/class-map";
import { ifDefined } from "lit-html/directives/if-defined";
import { repeat } from "lit-html/directives/repeat";
import { styleMap } from "lit-html/directives/style-map";
import styles from "./scss/module.scss";

/**
 * Momentum input component.
 *
 * @element md-input

 * @slot input-section
 * @slot input-section-right
 *
 * @part input
 * @part message
 *
 * @fires input-keydown
 * @fires input-focus
 * @fires input-mousedown
 * @fires input-change
 * @fires input-blur
 */

export const containerSize = [
  "small-1",
  "small-2",
  "small-3",
  "small-4",
  "small-5",
  "small-6",
  "small-7",
  "small-8",
  "small-9",
  "small-10",
  "small-11",
  "small-12",
  "medium-1",
  "medium-2",
  "medium-3",
  "medium-4",
  "medium-5",
  "medium-6",
  "medium-7",
  "medium-8",
  "medium-9",
  "medium-10",
  "medium-11",
  "medium-12",
  "large-1",
  "large-2",
  "large-3",
  "large-4",
  "large-5",
  "large-6",
  "large-7",
  "large-8",
  "large-9",
  "large-10",
  "large-11",
  "large-12"
];
export const inputSize = [
  "small-1",
  "small-2",
  "small-3",
  "small-4",
  "small-5",
  "small-6",
  "small-7",
  "small-8",
  "small-9",
  "small-10",
  "small-11",
  "small-12",
  "medium-1",
  "medium-2",
  "medium-3",
  "medium-4",
  "medium-5",
  "medium-6",
  "medium-7",
  "medium-8",
  "medium-9",
  "medium-10",
  "medium-11",
  "medium-12",
  "large-1",
  "large-2",
  "large-3",
  "large-4",
  "large-5",
  "large-6",
  "large-7",
  "large-8",
  "large-9",
  "large-10",
  "large-11",
  "large-12"
];
export const inputType = ["text", "number", "password", "email", "tel", "checkbox"];
export const inputShape = ["none", "pill"];
export const iconNames = iconNamesList;
export const iconPosition = ["before", "after"];
export const nestedLevel = [0, 1, 2, 3];
export const ariaInvalidType = ["grammar", "false", "spelling", "true"];

export namespace Input {
  export type Type = "text" | "number" | "password" | "email" | "tel" | "checkbox";
  export type MessageType = "error" | "success" | "warning";
  export type Message = {
    type: MessageType;
    message: string;
  };
  export type ContainerSize = typeof containerSize[number];
  export type InputSize = typeof inputSize[number];
  export type InputType = typeof inputSize;
  export type shape = typeof inputShape;
  export type AriaInvalidType = typeof ariaInvalidType[number];

  export class MessageController {
    determineMessageType(array: Input.Message[]) {
      return array.reduce<Input.MessageType>(
        (accumulator, errorMessage) =>
          ((errorMessage as unknown) as string) === "error" ? accumulator : errorMessage.type,
        "" as Input.MessageType
      );
    }
    filterMessagesByType(array: Input.Message[], value: string) {
      return array.reduce(
        (accumulator, errorMessage) =>
          errorMessage.type === value ? accumulator.concat(errorMessage.message) : accumulator,
        [] as string[]
      );
    }
  }

  @customElementWithCheck("md-input")
  export class ELEMENT extends FocusMixin(LitElement) {
    /**
     * @attr ariaDescribedBy
     */
    @property({ type: String }) ariaDescribedBy = "";
    /**
     * @attr ariaInvalid
     */
    @property({ type: String }) ariaInvalid: Input.AriaInvalidType = "false";
    /**
     * @attr ariaLabel
     */
    @property({ type: String }) ariaLabel = "input";
    /**
     * Set input field to receive focus automatically
     * @attr autofocus
     */
    @property({ type: Boolean, reflect: true }) autofocus = false;
    /**
     * Set placement of aux input items, to `before` or `after` input text
     * @attr auxiliaryContentPosition
     */
    @property({ type: String }) auxiliaryContentPosition: "before" | "after" | null = null;
    /**
     * Toggle visibility of a `clear` button to clean out a form
     * @attr clear
     */
    @property({ type: Boolean }) clear = false;
    /**
     * Set aria label text for clear button
     * @attr clearAriaLabel
     */
    @property({ type: String }) clearAriaLabel = "";
    /**
     * Set compact input style
     * @attr compact
     */
    @property({ type: Boolean }) compact = false;
    /**
     * Set size of input wrapper
     * @attr containerSize
     */
    @property({ type: String }) containerSize: Input.ContainerSize = "small-12";
    /**
     * Set disabled state style and functionality
     * @attr disabled
     */
    @property({ type: Boolean }) disabled = false;
    /**
     * @attr id
     */
    @property({ type: String }) id = "";
    /**
     * Set input size to standard denomonation
     * @attr inputSize
     */
    @property({ type: String }) inputSize = "";
    /**
     * Set a 'filled' style render
     * @attr isFilled
     */
    @property({ type: Boolean }) isFilled = false;
    /**
     * Set loading state
     * @attr isLoading
     */
    @property({ type: Boolean }) isLoading = false;
    /**
     * @attr label
     */
    @property({ type: String }) label = "";
    /**
     * Set help text
     * @attr helpText
     */
    @property({ type: String }) helpText = "";
    /**
     * Toggle visibility of error messages
     * @attr hide-message
     */
    @property({ type: Boolean, attribute: "hide-message", reflect: true }) hideMessage = false;
    /**
     * set pass-through ID for shadow element
     * @attr htmlId
     */
    @property({ type: String }) htmlId = "";
    /**
     * Set an array of custom error messages that render in the view
     * @attr messageArr
     */
    @property({ type: Array }) messageArr: Input.Message[] = [];
    /**
     * Set input min for number inputs
     * @attr min
     */
    @property({ type: Number, reflect: true }) min: number | undefined = undefined;
    /**
     * Set input max for number inputs
     * @attr max
     */
    @property({ type: Number, reflect: true }) max: number | undefined = undefined;
    /**
     * Set input max length for text inputs
     * @attr maxLength
     */
    @property({ type: Number }) maxLength: number | undefined = undefined;
    /**
     * @attr multi
     */
    @property({ type: Boolean }) multi = false;
    /**
     * Set input to multiline (text-area)
     * @attr multiline
     */
    @property({ type: Boolean }) multiline = false;
    /**
     * @attr name
     */
    @property({ type: String, reflect: true }) name = "";
    /**
     * Control level of indent for nested inputs
     * @attr nestedLevel
     */
    @property({ type: Number }) nestedLevel = 0;
    /**
     * Set placeholder text
     * @attr placeholder
     */
    @property({ type: String }) placeholder = "";
    /**
     * Set input as a read only field
     * @attr readOnly
     */
    @property({ type: Boolean }) readOnly = false;
    /**
     * Mark field as required
     * @attr required
     */
    @property({ type: Boolean }) required = false;
    /**
     * Toggle searchable input style
     * @attr searchable
     */
    @property({ type: Boolean }) searchable = false;
    /**
     * Set text for a secondary layer of label text
     * @attr secondaryLabel
     */
    @property({ type: String }) secondaryLabel = "";
    /**
     * Toggle select when in focus behavior
     * @attr select-when-in-focus
     */
    @property({ type: Boolean, attribute: "select-when-in-focus" }) selectWhenInFocus = false;
    /**
     * Set shape to default (rectangle) or 'pill' shape
     * @attr shape
     */
    @property({ type: String }) shape = "";
    /**
     * @attr type
     */
    @property({ type: String }) type: Input.Type = "text";
    /**
     * @attr value
     */
    @property({ type: String, reflect: true }) value = "";

    @query(".md-input") input!: HTMLInputElement;

    /**
     * Internal state to style when typing
     * @prop isEditing
     */
    @internalProperty() private isEditing = false;

    private readonly messageController = new MessageController();

    connectedCallback() {
      super.connectedCallback();
      document.addEventListener("click", (event: MouseEvent) => this.handleOutsideClick(event));
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      document.removeEventListener("click", (event: MouseEvent) => this.handleOutsideClick(event));
    }

    public select() {
      this.input.select();
    }

    handleOutsideClick(event: MouseEvent) {
      let insideInputClick = false;
      const path = event.composedPath();
      if (path.length) {
        insideInputClick = !!path.find(element => element === this);
        if (!insideInputClick) {
          this.input.blur();
          this.isEditing = false;
        }
      }
    }

    handleKeyDown(event: KeyboardEvent) {
      this.dispatchEvent(
        new CustomEvent("input-keydown", {
          bubbles: true,
          composed: true,
          detail: {
            srcEvent: event
          }
        })
      );
    }

    handleFocus(event: FocusEvent) {
      if (!this.disabled) {
        this.isEditing = true;

        if (this.selectWhenInFocus) {
          this.select();
        }

        this.dispatchEvent(
          new CustomEvent("input-focus", {
            bubbles: true,
            composed: true,
            detail: {
              srcEvent: event
            }
          })
        );
      }
    }

    handleMouseDown(event: MouseEvent) {
      if (!this.disabled) {
        this.isEditing = true;
        this.dispatchEvent(
          new CustomEvent("input-mousedown", {
            bubbles: true,
            composed: true,
            detail: {
              srcEvent: event
            }
          })
        );
      }
    }

    handleChange(event: Event) {
      this.value = (event.target as HTMLInputElement).value;
      this.dispatchEvent(
        new CustomEvent("input-change", {
          bubbles: true,
          composed: true,
          detail: {
            srcEvent: event,
            value: this.value
          }
        })
      );
    }

    handleBlur(event: FocusEvent) {
      this.isEditing = false;
      this.dispatchEvent(
        new CustomEvent("input-blur", {
          bubbles: true,
          composed: true,
          detail: {
            srcEvent: event
          }
        })
      );
    }

    handleClear(event: MouseEvent | KeyboardEvent) {
      if (event.type === "keydown") {
        const { code } = event as KeyboardEvent;
        if (code !== Key.Space && code !== Key.Enter) {
          return;
        }
        event.preventDefault();
      }
      this.input.focus();
      this.handleChange(event);
    }

    handleLabelClick() {
      this.input.focus();
    }

    get messageType(): Input.MessageType | null {
      if (this.messageArr.length > 0) {
        return this.messageController.determineMessageType(this.messageArr);
      }
      return null;
    }

    get messages() {
      if (this.messageType) {
        return this.messageController.filterMessagesByType(this.messageArr, this.messageType);
      }
      return null;
    }

    get inputClassMap() {
      return {
        "md-input--filled": this.isFilled,
        colums: !!this.containerSize,
        [`${this.containerSize}`]: !!this.containerSize,
        "md-read-only": this.readOnly,
        "md-disabled": this.disabled,
        [`md-${this.messageType}`]: !!this.messageType,
        [`md-input--nested-${this.nestedLevel}`]: !!this.nestedLevel,
        "md-multi": this.multi
      };
    }

    get inputWrapperClassMap() {
      return {
        columns: !!this.inputSize,
        [`${this.inputSize}`]: !!this.inputSize
      };
    }

    get inputTemplateClassMap() {
      return {
        "md-input--multiline": this.multiline,
        "md-input--multi": this.multi,
        [`md-input--${this.shape}`]: !!this.shape,
        "md-input--before": this.auxiliaryContentPosition === "before" || this.searchable,
        "md-input--after": this.auxiliaryContentPosition === "after",
        "md-active": this.isEditing,
        "md-focus": this.isEditing,
        "md-read-only": this.readOnly,
        "md-disabled": this.disabled,
        "md-dirty": !!this.value
      };
    }

    inputTemplate() {
      return this.multiline
        ? html`
            <textarea
              part="input"
              class="md-input ${classMap(this.inputTemplateClassMap)}"
              @blur=${(event: FocusEvent) => this.handleBlur(event)}
              @input=${(event: Event) => this.handleChange(event)}
              @focus=${(event: FocusEvent) => this.handleFocus(event)}
              @keydown=${(event: KeyboardEvent) => this.handleKeyDown(event)}
              @mousedown=${(event: MouseEvent) => this.handleMouseDown(event)}
              tabindex="0"
              .value=${this.value}
              aria-describedby=${this.ariaDescribedBy}
              ?required=${this.required}
              ?autofocus=${this.autofocus}
              aria-label=${this.ariaLabel}
              aria-invalid=${this.ariaInvalid as ARIA_INVALID}
              aria-errormessage="default message"
              ?disabled=${this.disabled}
              id=${this.htmlId}
              placeholder=${this.placeholder}
              ?readonly=${this.readOnly}
            ></textarea>
          `
        : html`
            <input
              part="input"
              class="md-input ${classMap(this.inputTemplateClassMap)}"
              @blur=${(event: FocusEvent) => this.handleBlur(event)}
              @input=${(event: Event) => this.handleChange(event)}
              @focus=${(event: FocusEvent) => this.handleFocus(event)}
              @keydown=${(event: KeyboardEvent) => this.handleKeyDown(event)}
              @mousedown=${(event: MouseEvent) => this.handleMouseDown(event)}
              tabindex="0"
              ?required=${this.required}
              ?autofocus=${this.autofocus}
              type=${this.type}
              .value=${this.value}
              aria-describedby=${this.ariaDescribedBy}
              aria-label=${this.ariaLabel}
              aria-invalid=${this.ariaInvalid as ARIA_INVALID}
              ?disabled=${this.disabled}
              id=${this.htmlId}
              placeholder=${this.placeholder}
              ?readonly=${this.readOnly}
              min=${ifDefined(this.min)}
              max=${ifDefined(this.max)}
              maxlength=${ifDefined(this.maxLength)}
            />
          `;
    }

    inputLeftTemplate() {
      if (this.searchable) {
        return html`
          <div class="md-input__before">
            ${this.isLoading
              ? html`
                  <md-spinner size="20"></md-spinner>
                `
              : html`
                  <md-icon name="search_20"></md-icon>
                `}
          </div>
        `;
      } else {
        return this.auxiliaryContentPosition === "before"
          ? html`
              <div class="md-input__before">
                <slot name="input-section"> </slot>
              </div>
            `
          : nothing;
      }
    }

    inputRightTemplate() {
      if (this.clear && !this.disabled && !!this.value) {
        return html`
          <div class="md-input__after">
            <md-button
              hasRemoveStyle
              @click=${(event: MouseEvent) => this.handleClear(event)}
              @keydown=${(event: KeyboardEvent) => this.handleClear(event)}
            >
              <md-icon
                class="md-input__icon-clear"
                name="clear-active_12"
                aria-label=${this.clearAriaLabel || "Clear Input"}
              >
              </md-icon>
            </md-button>
          </div>
        `;
      } else if (!this.compact) {
        return html`
          <div class="md-input__after">
            <slot name="input-section-right"></slot>
          </div>
        `;
      }
    }

    secondaryLabelTemplate() {
      return this.secondaryLabel
        ? html`
            <md-label
              class="md-input__secondary-label ${classMap({ disabled: this.disabled })}"
              secondaryLabel
              .htmlFor=${this.htmlId}
              .label=${this.secondaryLabel}
              @label-click="${() => this.handleLabelClick()}"
            ></md-label>
          `
        : nothing;
    }

    helpTextTemplate() {
      return this.helpText
        ? html`
            <md-help-text
              class="help-text"
              .message=${this.helpText}
              style=${styleMap({ width: "100%" })}
            ></md-help-text>
          `
        : nothing;
    }

    messagesTemplate() {
      return !this.hideMessage && this.messages && !!this.messages.length
        ? html`
            <div part="message" class="md-input__messages">
              ${repeat(
                this.messages,
                message =>
                  html`
                    <md-help-text
                      .message=${message}
                      .messageType=${this.messageType as Input.MessageType}
                    ></md-help-text>
                  `
              )}
            </div>
          `
        : nothing;
    }

    labelTemplate() {
      return this.label
        ? html`
            <md-label
              class="md-input__label ${classMap({ disabled: this.disabled })}"
              .htmlFor=${this.htmlId}
              .label=${this.label}
              @label-click="${() => this.handleLabelClick()}"
            ></md-label>
          `
        : nothing;
    }

    static get styles() {
      return [reset, styles];
    }

    render() {
      return html`
        <div class="md-input-container ${classMap(this.inputClassMap)}">
          ${this.labelTemplate()}
          <div class="md-input__wrapper ${classMap(this.inputWrapperClassMap)}">
            ${this.inputLeftTemplate()} ${this.inputTemplate()} ${this.inputRightTemplate()}
          </div>
          ${this.messagesTemplate()} ${this.secondaryLabelTemplate()} ${this.helpTextTemplate()}
        </div>
      `;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "md-input": Input.ELEMENT;
  }
}

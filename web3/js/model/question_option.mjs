import {
  CN_model_base_qnaire_part,
  CN_clone_base_qnaire_part,
  CN_view_base_qnaire_part
} from "./base_qnaire_part.mjs";

export class CN_model_question_option extends CN_model_base_qnaire_part {
  constructor() {
    super("question_option");
  }

  /**
   * Extend parent method
   */
  async clone_columns() {
    return {
      ...await super.clone_columns(),
      ...{
        exclusive: { title: "Exclusive", type: "boolean" },
        extra: { title: "Extra" },
        multiple_answers: { title: "Multiple Answers", type: "boolean" },
      },
    };
  }

  /**
   * Extend parent method
   */
  async clone_properties() {
    return {
      ...await super.clone_properties(),
      ...{
        exclusive: { title: "Exclusive", type: "boolean" },
        extra: { title: "Extra", type: "enum" },
        multiple_answers: {
          title: "Multiple Answers",
          type: "boolean",
          is_hidden: () => "add" == this.get_action_name() || !this.get_action().get_property_value("extra"),
        },
        number_is_float: {
          title: "Allow Decimals",
          type: "boolean",
          is_hidden: () =>
            "add" == this.get_action_name() ||
            !this.get_action().get_property_value("extra").match(/^number/),
        },
        unit_list: {
          title: "Unit List",
          type: "text",
          help: `
            Must be defined in JSON format.  For example:<br>
            [ "mg", "IU" ]<br> or<br>
            [ { "MG": "mg" }, { "IU": { "en": "IU", "fr": "U. I." } } ]<br> or<br>
            { "MG": "mg", "IU": { "en": "IU", "fr": "U. I." } }
          `,
          is_hidden: () =>
            "add" == this.get_action_name() ||
            "number with unit" != this.get_action().get_property_value("extra"),
        },
        minimum: {
          title: "Minimum",
          type: "string",
          is_hidden: () =>
            "add" == this.get_action_name() ||
            !["date", "number", "number with unit"].includes(this.get_action().get_property_value("extra")),
          help: "The minimum possible value for this option's extra value.",
        },
        maximum: {
          title: "Maximum",
          type: "string",
          is_hidden:
            () => "add" == this.get_action_name() ||
            !["date", "number", "number with unit", "string", "text"].includes(
              this.get_action().get_property_value("extra")
            ),
          help: `
            The maximum possible value for this question's extra value,
            or the maximum number of characters for string or text.
          `,
        },
      },
    };
  }
}

export class CN_clone_question_option extends CN_clone_base_qnaire_part {}
export class CN_view_question_option extends CN_view_base_qnaire_part {}

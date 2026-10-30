const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
import { CN_model_base_qnaire_part, CN_view_base_qnaire_part } from "./base_qnaire_part.mjs";
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);

export class CN_model_question extends CN_model_base_qnaire_part {
  constructor() {
    super("question");
  }

  /**
   * Extend parent method
   */
  async clone_columns() {
    const columns = await super.clone_columns();
    CN_common.insert_property(columns, "after", "name", "question_option_count", {
      title: "Question Options",
      table_prefix: false,
    });

    return {
      ...columns,
      ...{
        module_name: {
          column: "module.name",
          title: "Module",
          is_hidden: () => "qnaire" != this.get_root_model().get_name(),
        },
        page_name: {
          column: "page.name",
          title: "Page",
          is_hidden: () => "qnaire" != this.get_root_model().get_name(),
        },
        question_name: {
          column: "question.name",
          title: "Question",
          is_hidden: () => "qnaire" != this.get_root_model().get_name(),
        },
        type: { title: "Type" },
        export: { title: "Exported", type: "boolean" },
        change_allowed: { title: "Change Allowed", type: "boolean" },
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
        type: { title: "Type", type: "enum" },
        export: { title: "Export", type: "boolean", help: "Whether answers to this question are exported." },
        change_allowed: {
          title: "Allow Answer to be Changed",
          type: "boolean",
          help: "Whether the respondent is allowed to change their answer once it is set.",
          is_hidden: () =>
            "add" == this.get_action_name() ||
            "comment" == this.get_action().get_property_value("type"),
        },
        dkna_allowed: {
          title: "Allow DKNA",
          type: "boolean",
          is_hidden: () =>
            "add" == this.get_action_name() ||
            "comment" == this.get_action().get_property_value("type"),
        },
        refuse_allowed: {
          title: "Allow Refuse",
          type: "boolean",
          is_hidden: () =>
            "add" == this.get_action_name() ||
            "comment" == this.get_action().get_property_value("type"),
        },
        device_id: {
          title: "Device",
          type: "enum",
          enum: { path: `${this.get_root_model().get_view_url(null, "api")}/device` },
          is_hidden: () =>
            "add" == this.get_action_name() ||
            "device" != this.get_action().get_property_value("type"),
        },
        equipment_type_id: {
          title: "Equipment Type",
          type: "enum",
          enum: { path: "equipment_type" },
          is_hidden: () =>
            "add" == this.get_action_name() ||
            "equipment" != this.get_action().get_property_value("type"),
        },
        lookup_id: {
          title: "Lookup",
          type: "enum",
          enum: { path: "lookup" },
          is_hidden: () =>
            "add" == this.get_action_name() ||
            "lookup" != this.get_action().get_property_value("type"),
        },
        number_is_float: {
          title: "Allow Decimals",
          type: "boolean",
          is_hidden: () =>
            "add" == this.get_action_name() ||
            !this.get_action().get_property_value("type").match(/^number/),
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
            "number with unit" != this.get_action().get_property_value("type"),
        },
        minimum: {
          title: "Minimum",
          is_hidden: () =>
            "add" == this.get_action_name() ||
            !["date", "number", "number with unit"].includes(this.get_action().get_property_value("type")),
          help: "The minimum possible value for this question.",
        },
        maximum: {
          title: "Maximum",
          is_hidden: () =>
            "add" == this.get_action_name() ||
            !["audio (ogg)", "audio (wav)", "date", "number", "number with unit", "string", "text"].includes(
              this.get_action().get_property_value("type")
            ),
          help: `
            The maximum possible value for this question, maximum number of seconds for audio recordings,
            or the maximum number of characters for string or text questions.
          `,
        },
        default_answer: { title: "Default Answer" },
        note: { title: "Note", type: "text" },
      },
    };
  }

  /**
   * Returns a typeahead object for models that have a typeahead property referencing this model
   * @return object
   * @static
   */
  static get_typeahead(params = {}) {
    return {
      get_list: async (value) => {
        const api_params = CN_common.merge_objects({
          select: {
            column: [{
              table: "question",
              column: "id",
              alias: "key",
            }, {
              table: "question",
              column: 'CONCAT( question.name, " (", question.type, ")" )',
              alias: "value",
              table_prefix: false,
            }],
          },
          modifier: {
            where: {
              column: "question.name",
              operator: "like",
              value: `%${value}%`,
            },
            order: 'CONCAT( question.name, " (", question.type, ")" )',
            limit: 20,
          },
        }, params);
        return await CN_api.get("question", api_params);
      },
    };
  }
}

export class CN_view_question extends CN_view_base_qnaire_part {}

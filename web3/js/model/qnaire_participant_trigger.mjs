import { CN_model_base_qnaire_trigger } from "./base_qnaire_trigger.mjs"

export class CN_model_qnaire_participant_trigger extends CN_model_base_qnaire_trigger {
  constructor() {
    super("participant");
  }

  /**
   * Extend parent method
   */
  async clone_columns() {
    const columns = await super.clone_columns();
    delete columns.trigger_type;
    columns.column_name = { title: "Participant Column" };
    columns.value = { title: "Value" };
    return columns;
  }

  /**
   * Extend parent method
   */
  async clone_properties() {
    const properties = await super.clone_properties();
    delete properties.participant_id;
    properties.column_name = { title: "Participant Column", type: "enum" };
    properties.value = {
      title: "Value",
      help: `
        Strings must be enclosed in double quotes ("), numbers and boolean values should be
        written without them.
      `,
    };
    return properties;
  }
}

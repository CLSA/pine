import { CN_model_base_qnaire_trigger } from "./base_qnaire_trigger.mjs"

export class CN_model_qnaire_equipment_type_trigger extends CN_model_base_qnaire_trigger {
  constructor() {
    super("equipment_type");
  }

  /**
   * Extend parent method
   */
  async clone_columns() {
    const columns = await super.clone_columns();
    delete columns.answer_value;
    columns.loaned = { title: "Loan", type: "boolean" };
    return columns;
  }

  /**
   * Extend parent method
   */
  async clone_properties() {
    const properties = await super.clone_properties();
    delete properties.answer_value;
    properties.loaned = {
      title: "Loan",
      type: "boolean",
      help: `
        Set to "Yes" if this question triggers the loaning of equipment,
        or "No" if it triggers the returning of equipment.
      `,
    };
    return properties;
  }
}

import { CN_model_base_qnaire_trigger } from "./base_qnaire_trigger.mjs"

export class CN_model_qnaire_consent_type_trigger extends CN_model_base_qnaire_trigger {
  constructor() {
    super("consent_type");
  }

  /**
   * Extend parent method
   */
  async clone_columns() {
    const columns = await super.clone_columns();
    columns.accept = { title: "Consent Accept", type: "boolean" };
    return columns;
  }

  /**
   * Extend parent method
   */
  async clone_properties() {
    const properties = await super.clone_properties();
    properties.accept = { title: "Consent Accept", type: "boolean" };
    return properties;
  }
}

import { CN_model_base_qnaire_trigger } from "./base_qnaire_trigger.mjs"

export class CN_model_qnaire_collection_trigger extends CN_model_base_qnaire_trigger {
  constructor() {
    super("collection");
  }

  /**
   * Extend parent method
   */
  async clone_columns() {
    const columns = await super.clone_columns();
    columns.add_to = { title: "Add To", type: "boolean" };
    return columns;
  }

  /**
   * Extend parent method
   */
  async clone_properties() {
    const properties = await super.clone_properties();
    properties.add_to = { title: "Add to Collection", type: "boolean" };
    return properties;
  }
}

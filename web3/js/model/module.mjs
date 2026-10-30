const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);
import { CN_model_base_qnaire_part, CN_view_base_qnaire_part } from "./base_qnaire_part.mjs";

export class CN_model_module extends CN_model_base_qnaire_part {
  constructor() {
    super("module");
  }

  /**
   * Extend parent method
   */
  async clone_columns() {
    const columns = await super.clone_columns();
    CN_common.insert_property(columns, "after", "name", "stage_name", {
      title: "Stage",
      column: "stage.name",
      is_hidden: () =>
        "add" == this.get_action_name() ||
        !this.get_parent_model().get_action().get_property_value("stages"),
    });
    CN_common.insert_property(columns, "after", "stage_name", "page_count", {
      title: "Pages",
      table_prefix: false,
    });
    CN_common.insert_property(columns, "after", "page_count", "average_time", {
      title: "Average Time",
      table_prefix: false,
    });
    return columns;
  }

  /**
   * Extend parent method
   */
  async clone_properties() {
    const properties = await super.clone_properties();

    // for qnaires that have stages replace rank with rank-in-stagea
    properties.rank.is_hidden = () => this.get_parent_model().get_action().get_property_value("stages");

    return {
      ...properties,
      ...{
        stage_id: {
          meta: { table: "stage", column: "id" },
          title: "Stage",
          type: "enum",
          enum: {
            get_enums: async () => (await CN_api.get(
              `${this.get_parent_model().get_view_url(null, "api")}/stage`,
              {
                select: { column: ["rank", "name"] },
                modifier: { order: "stage.rank" },
              }
            )).map(stage => ({ key: stage.id, value: `${stage.rank}) ${stage.name}` })),
          },
          is_constant: () => true,
          is_hidden: () =>
            "add" == this.get_action_name() ||
            !this.get_parent_model().get_action().get_property_value("stages"),
        },
        stage_rank: {
          title: "Rank in Stage",
          type: "rank",
          meta: {},
          is_constant: () => true,
          is_hidden: () =>
            "add" == this.get_action_name() ||
            !this.get_parent_model().get_action().get_property_value("stages"),
        },
        average_time: {
          title: "Average Time",
          type: "timesecond",
          meta: {},
          is_constant: () => true,
          is_hidden: () => "add" == this.get_action_name(),
        },
        note: { title: "Note", type: "text" },
      },
    };
  }
}

export class CN_view_module extends CN_view_base_qnaire_part {}

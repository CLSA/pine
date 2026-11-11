import {
  CN_model_base_qnaire_part,
  CN_clone_base_qnaire_part,
  CN_view_base_qnaire_part
} from "./base_qnaire_part.mjs";
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);

export class CN_model_page extends CN_model_base_qnaire_part {
  constructor() {
    super("page");
  }

  /**
   * Extend parent method
   */
  async clone_columns() {
    const columns = await super.clone_columns();
    CN_common.insert_property(columns, "after", "name", "tabulate", {
      title: "Tabulate",
      type: "boolean",
      help: "Determines whether questions on this page should be organized into a table.",
    });
    CN_common.insert_property(columns, "after", "tabulate", "question_count", {
      title: "Questions",
      table_prefix: false,
    });
    CN_common.insert_property(columns, "after", "question_count", "average_time", {
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

    return {
      ...properties,
      ...{
        tabulate: {
          title: "Tabulate",
          type: "boolean",
          help: "Determines whether questions on this page should be organized into a table."
        },
        average_time: {
          title: "Average Time",
          type: "timesecond",
          meta: {},
          is_constant: () => true,
          is_hidden: () => "add" == this.get_action_name(),
        },
        max_time: {
          title: "Max Time (seconds)",
          type: "integer",
          is_hidden: () => "add" == this.get_action_name(),
          is_constant: () => true,
          help: `
            Maximum page time is automatically calculated to exclude major outliers by setting its value to that
            of the outer fence (3 times the interquartile width above the upper quartile).
          `,
        },
        note: { title: "Note", type: "text" },
      },
    };
  }
}

export class CN_clone_page extends CN_clone_base_qnaire_part {}
export class CN_view_page extends CN_view_base_qnaire_part {}

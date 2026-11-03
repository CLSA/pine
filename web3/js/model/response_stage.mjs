const { CN_action_list } = await import(`${CENOZO_URL}/js/action/list.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);

export class CN_model_response_stage extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "response stage",
        plural: "response stages",
        posessive: "response stage's",
      },
      columns: {
        stage_rank: { title: "Rank", column: "stage.rank", type: "rank" },
        stage_name: { title: "Name", column: "stage.name" },
        status: { title: "Status", column: "response_stage.status" },
        username: { title: "Username" },
        deviation_type: { title: "Deviation", column: "deviation_type.name" },
        start_datetime: {
          column: "response_stage.start_datetime",
          title: "Start Date & Time",
          type: "datetimesecond",
        },
        end_datetime: {
          column: "response_stage.end_datetime",
          title: "End Date & Time",
          type: "datetimesecond",
        },
        elapsed: { title: "Elapsed", type: "timesecond", table_prefix: false },
        comments: { title: "Comments", type: "text", limit: 0 },
      },
      get_default_order: () => "rank",
    });
  }

  /**
   * Extend parent method
   */
  allow_view() {
    return false;
  }
}

export class CN_list_response_stage extends CN_action_list {
  /**
   * Extend parent method
   */
  _create_column_element(col_name, column, record) {
    const el = super._create_column_element(col_name, column, record);

    // highlight the active row
    if ("active" == record.status) el.style.background = "rgb(255, 242, 174)";

    return el;
  }
}

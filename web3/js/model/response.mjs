const { CN_action_view } = await import(`${CENOZO_URL}/js/action/view.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);
const { CN_session } = await import(`${CENOZO_URL}/js/session.mjs`);

export class CN_model_response extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "response",
        plural: "responses",
        posessive: "response's",
      },
      columns: {
        rank: { column: "response.rank", title: "Rank", type: "rank" },
        qnaire_version: { title: "Version" },
        interview_type: { title: "Type" },
        language: { column: "language.code", title: "Language" },
        submitted: { title: "Submitted", type: "boolean" },
        checked_in: { title: "Checked In", type: "boolean" },
        qnaire_progress: { title: "Progress", table_prefix: false },
        module: { column: "module.name", title: "Module" },
        page: { column: "page.name", title: "Page" },
        time_spent: { title: "Time Spent", type: "timesecond" },
        start_datetime: { column: "response.start_datetime", title: "Start", type: "datetime" },
        last_datetime: { column: "response.start_datetime", title: "Last", type: "datetime" },
      },
      properties: {
        uid: {
          meta: { table: "participant", column: "uid" },
          title: "Participant",
          meta: { table: "participant", column: "uid" },
          is_constant: () => true,
        },
        rank: { title: "rank", type: "rank", is_constant: () => true },
        qnaire_version: { title: "Questionnaire Version", is_constant: () => true },
        interview_type: {
          title: "Interview Type",
          is_constant: () => true,
          is_hidden: () =>
            "view" != this.get_action_name() ||
            !CN_session.get_root_model().get_action().get_property_value("stages"),
        },
        language_id: {
          meta: { table: "response", column: "language_id" },
          title: "Language",
          type: "enum",
          enum: {
            path: "language",
            modifier: {
              where: { column: "active", operator: "=", value: true },
              order: "language.name",
            },
          },
        },
        submitted: { title: "Submitted", type: "boolean", is_constant: () => true },
        checked_in: { title: "Checked In", type: "boolean", is_constant: () => true },
        qnaire_progress: { title: "Progress", meta: {}, is_constant: () => true },
        module: { meta: { table: "module", column: "name" }, title: "Module", is_constant: () => true },
        page: { meta: { table: "page", column: "name" }, title: "Page", is_constant: () => true },
        start_datetime: { title: "Start Date & Time", type: "datetime", is_constant: () => true },
        last_datetime: { title: "Last Date & Time", type: "datetime", is_constant: () => true },
        comments: { title: "Comments", type: "text" },
      },
    });
  }
}

export class CN_view_response extends CN_action_view {
  /**
   * Extend parent method
   */
  async get_text(type) {
    if ("crumb" == type) {
      return CN_common.ordinal_suffix(this.get_property_value("rank"));
    }
    return await super.get_text(type);
  }

  /**
   * Extend parent method
   */
  get_selector_child_list() {
    const qnaire_action = CN_session.get_root_model().get_action();
    const stages = qnaire_action.get_property_value("stages");
    const has_devices = qnaire_action.get_property_value("has_devices");
    return super.get_selector_child_list().filter(child =>
      (!["response_stage", "answer_device"].includes(child.model.get_name())) ||
      // show stage list if the qnaire has stages
      ("response_stage" == child.model.get_name() && stages) ||
      // show device list if the qnaire has devices and the qnaire is only answered once
      ("answer_device" == child.model.get_name() && has_devices)
    );
  }
}

const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_session } = await import(`${CENOZO_URL}/js/session.mjs`);

export class CN_model_problem_report extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "problem report",
        plural: "problem reports",
        posessive: "problem report's",
      },
      columns: {
        questionnaire: {
          title: "Questionnaire",
          column: "qnaire.name",
          is_hidden: () => "problem_report" != CN_session.get_leaf_model().get_name(),
        },
        uid: {
          title: "Participant",
          column: "participant.uid",
          is_hidden: () => "problem_report" != CN_session.get_leaf_model().get_name(),
        },
        page_name: { title: "Page" },
        datetime: { title: "Date & Time", column: "problem_report.datetime", type: "datetime" },
        description: { title: "Description", align: "left" },
      },
      properties: {
        questionnaire: { title: "Questionnaire", meta: { table: "qnaire", column: "name" } },
        uid: { title: "Participant", meta: { table: "participant", column: "uid" } },
        show_hidden: { title: "Show Hidden", type: "boolean" },
        page_name: { title: "Page" },
        remote_address: { title: "Remote Address" },
        user_agent: { title: "User Agent" },
        brand: { title: "Brand" },
        platform: { title: "Platform" },
        mobile: { title: "Mobile" },
        datetime: {
          title: "Date & Time",
          meta: { table: "problem_report", column: "datetime" },
          type: "datetime",
        },
        description: { title: "Description", type: "text" },
      },
    });
  }

  /**
   * Extend parent method
   */
  allow_add() {
    // problem reports are only added when completing a qnaire
    return false;
  }
}

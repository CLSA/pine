const { CN_action_list } = await import(`${CENOZO_URL}/js/action/list.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_session } = await import(`${CENOZO_URL}/js/session.mjs`);

export class CN_model_answer extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "answer",
        plural: "answers",
        posessive: "answer's",
      },
      columns: {
        uid: { column: "participant.uid", title: "Participant", },
        token: { column: "respondent.token", title: "Token", },
        user: { column: "user.name", title: "User", },
        value: { title: "Value", },
        respondent_id: { column: "response.respondent_id", is_hidden: () => true },
        response_id: { is_hidden: () => true },
      },
    });
  }
}

export class CN_list_answer extends CN_action_list {
  /**
   * Override parent method
   */
  async on_row_click(record) {
    if (this.is_choosing()) {
      await super.on_row_click(record);
    } else {
      const qnaire_model = CN_session.get_root_model();
      let path = `qnaire/view/${qnaire_model.get_identifier()}/respondent/view/${record.respondent_id}`;
      if (qnaire_model.get_action().get_property_value("repeated")) {
        path += `/response/view/${record.response_id}`;
      }
      await CN_session.navigate_to(path);
    }
  }
}

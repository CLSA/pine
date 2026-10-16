const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);

export class CN_model_answer_device extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "device status",
        plural: "device statuses",
        posessive: "device status'",
      },
      columns: {
        questionnaire: { title: "Questionnaire", column: "qnaire.name" },
        token: { title: "Token", column: "respondent.token" },
        device: { title: "Device", column: "device.name" },
        uuid: { title: "UUID" },
        status: { title: "Status" },
        start_datetime: { column: "answer_device.start_datetime", title: "Start Date & Time", type: "datetime" },
        end_datetime: { column: "answer_device.end_datetime", title: "End Date & Time", type: "datetime" },
      },
    });
  }

  /**
   * Extend parent method
   */
  allow_view() {
    return false;
  }
}

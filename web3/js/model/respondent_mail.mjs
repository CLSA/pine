const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);

export class CN_model_respondent_mail extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "email",
        plural: "emails",
        posessive: "email's",
      },
      columns: {
        type: { title: "Type", table_prefix: false },
        rank: { title: "Rank", type: "rank" },
        schedule_datetime: { column: "mail.schedule_datetime", title: "Scheduled Date & Time", type: "datetime" },
        sent_datetime: { column: "mail.sent_datetime", title: "Sent Date & Time", type: "datetime" },
        sent: { column: "mail.sent", title: "Sent", type: "boolean" },
      },
    });
  }
}

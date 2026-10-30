const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);

export class CN_model_reminder extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "reminder",
        plural: "reminders",
        posessive: "reminder's",
      },
      columns: {
        delay_offset: { title: "Offset", column: "reminder.delay_offset" },
        delay_unit: { title: "Unit", column: "reminder.delay_unit" },
      },
      properties: {
        delay_offset: { title: "Offset", type: "integer" },
        delay_unit: { title: "Unit", type: "enum" },
      },
    });
  }
}

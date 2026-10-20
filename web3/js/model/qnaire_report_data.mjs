const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);

export class CN_model_qnaire_report_data extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "report data",
        plural: "report data",
        posessive: "report data's",
      },
      columns: {
        name: { title: "Name", column: "qnaire_report_data.name" },
        code: { title: "Code", column: "qnaire_report_data.code" },
      },
      properties: {
        name: { title: "Name", format: "alpha_num" },
        code: { title: "Code", type: "text" },
      },
    });
  }
}

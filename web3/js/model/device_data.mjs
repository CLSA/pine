const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);

export class CN_model_device_data extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "device data",
        plural: "device data",
        posessive: "device data's",
      },
      columns: {
        name: { title: "Name", column: "device_data.name" },
        code: { title: "Code", column: "device_data.code" },
      },
      properties: {
        name: { title: "Name", format: "alpha_num" },
        code: { title: "Code", type: "text" },
      },
    });
  }
}

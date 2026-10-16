const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);

export class CN_model_attribute extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "attribute",
        plural: "attributes",
        posessive: "attribute's",
      },
      columns: {
        name: { title: "Name", column: "attribute.name" },
        code: { title: "Code" },
      },
      properties: {
        name: { title: "Name", format: "alpha_num" },
        code: { title: "Code" },
        note: { title: "Note", type: "text" },
      },
    });
  }
}

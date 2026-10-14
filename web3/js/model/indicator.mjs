const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);

export class CN_model_indicator extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "indicator",
        plural: "indicators",
        posessive: "indicator's",
      },
      columns: {
        name: { title: "Name" },
        lookup_item_count: { title: "Lookup Data Count" },
      },
      properties: {
        lookup: {
          meta: { table: "lookup", column: "name" },
          title: "Lookup",
          is_hidden: () => "add" == this.get_action_name(),
          is_constant: () => true,
        },
        name: { title: "Name", format: "identifier" },
      },
    });
  }
}

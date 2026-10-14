const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);

export class CN_model_lookup_item extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "lookup item",
        plural: "lookup items",
        posessive: "lookup item's",
      },
      columns: {
        identifier: { title: 'Identifier' },
        name: { column: "lookup_item.name", title: "Name" },
        indicator_list: { title: "Indicator List", table_prefix: false },
        description: { column: "lookup_item.description", title: "Description" },
      },
      properties: {
        lookup: {
          meta: { table: "lookup", column: "name" },
          title: "Lookup",
          is_hidden: () => "add" == this.get_action_name(),
          is_constant: () => true,
        },
        identifier: { title: "Identifier", format: "identifier" },
        name: { title: "Name" },
        description: { title: "Description", type: "text" },
      },
    });
  }
}

const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);

export class CN_model_deviation_type extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "deviation type",
        plural: "deviation types",
        posessive: "deviation type's",
      },
      columns: {
        type: { title: "Type", column: "deviation_type.type" },
        rank: { title: "Rank", column: "deviation_type.rank", type: "rank" },
        name: { title: "Name", column: "deviation_type.name" },
        other: { title: "Other", column: "deviation_type.other", type: "boolean" },
      },
      get_default_order: () => "type",
      properties: {
        type: {
          title: "Type",
          type: "enum",
          on_change: () => this.get_action().update_element(),
          is_constant: () => "view" == this.get_action_name(),
        },
        rank: {
          title: "Rank",
          type: "rank",
          max_rank: async () => {
            const type = this.get_action().get_property_value("type");
            return (
              type ?
              await CN_api.count(
                `${this.get_parent_model().get_view_url(null, "api")}/deviation_type`,
                { modifier: { where: { column: "type", operator: "=", value: type } } }
              ) + ("add" == this.get_action_name() ? 1 : 0) :
              0 // if there is no type then don't allow a rank selection
            );
          },
        },
        name: { title: "Name", format: "identifier" },
        other: {
          title: "Other",
          type: "boolean",
          help: "Wether to require additional text to be included when this deviation type is selected.",
        },
      },
    });
  }
}

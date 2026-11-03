const { CN_action_list } = await import(`${CENOZO_URL}/js/action/list.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_session } = await import(`${CENOZO_URL}/js/session.mjs`);

export class CN_model_response_attribute extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "attribute",
        plural: "attributes",
        posessive: "attribute's",
      },
      columns: {
        name: { column: "attribute.name", title: "Name" },
        value: { title: "Value" },
        response_id: { is_hidden: () => true },
      },
      properties: {
        name: { meta: { table: "attribute", column: "name" }, title: "Name", is_constant: () => true },
        value: { title: "Value" },
      },
    });
  }
}

export class CN_list_response_attribute extends CN_action_list {
  /**
   * Extend parent method
   */
  async on_row_click(record) {
    const model = this.get_model();
    if (!this.is_choosing() && "respondent" == model.get_parent_model().get_name()) {
      // add full respondent/response path when selecting respones_attribute from respondent parent
      const url = model.get_view_url(record.id);
      await CN_session.navigate_to(
        url.replace(
          /response_attribute\/view/,
          `response/view/${record.response_id}/response_attribute/view`
        )
      );
    } else {
      await super.on_row_click(record);
    }
  }
}

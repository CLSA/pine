const { CN_action_view } = await import(`${CENOZO_URL}/js/action/view.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);

export class CN_model_base_description extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "description",
        plural: "descriptions",
        posessive: "description's",
      },
      columns: {
        language: { column: "language.code", title: "Language" },
        type: { title: "Type" },
        value: { title: "Value", align: "left" },
      },
      properties: {
        language: { title: "Language", meta: { table: "language", column: "code" }, is_constant: () => true },
        type: { title: "Type", type: "enum", is_constant: () => true },
        value: { title: "Value", type: "text" },
      },
    });

    if ("CN_model_base_description" == this.constructor) {
      throw new Error("Abstract class CN_model_base_description can't be instantiated.");
    }
  }

  /**
   * Extend parent method
   */
  allow_edit() {
    return super.allow_edit() && !this.get_parent_model().get_action().get_property_value_for_record("readonly");
  }
}

export class CN_view_base_description extends CN_action_view {
  /**
   * Add operation to the footer element
   */
  _create_footer_element() {
    const footer_el = super._create_footer_element();
    const left_btn_group_el = footer_el.querySelector("div[name=left-btn-group]")

    // add the navigation buttons
    const prev_btn_el = this.constructor.html(`
      <button name="prev" type="button" class="btn btn-light btn-outline-primary">
        <i class="bi bi-chevron-left"></i>
      </button>
    `);
    prev_btn_el.addEventListener(
      "click",
      () => CN_session.navigate_to(),
    );
    new bootstrap.Tooltip(prev_btn_el, {
      title: "Previous Description",
      trigger: "hover",
      delay: { "show": 1000, "hide": 100 },
    });
    left_btn_group_el.append(prev_btn_el);

    const next_btn_el = this.constructor.html(`
      <button name="next" type="button" class="btn btn-light btn-outline-primary">
        <i class="bi bi-chevron-right"></i>
      </button>
    `);
    next_btn_el.addEventListener(
      "click",
      () => CN_session.navigate_to(),
    );
    new bootstrap.Tooltip(next_btn_el, {
      title: "Next Description",
      trigger: "hover",
      delay: { "show": 1000, "hide": 100 },
    });
    left_btn_group_el.append(next_btn_el);

    return footer_el;
  }
}

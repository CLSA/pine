const { CN_action_view } = await import(`${CENOZO_URL}/js/action/view.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_session } = await import(`${CENOZO_URL}/js/session.mjs`);

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
        previous_description_id: { meta: {}, is_hidden: () => true },
        next_description_id: { meta: {}, is_hidden: () => true },
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
  #previous_tooltip = null;
  #next_tooltip = null;

  /**
   * Extend parent method
   */
  async on_dom_remove() {
    await super.on_dom_remove();

    if (this.#previous_tooltip) {
      this.#previous_tooltip.dispose();
      this.#previous_tooltip = null;
    }

    if (this.#next_tooltip) {
      this.#next_tooltip.dispose();
      this.#next_tooltip = null;
    }
  }

  /**
   * Extend parent element
   */
  update_element() {
    const model = this.get_model();
    const footer_el = this.get_footer_element();

    const previous_btn_el = footer_el.querySelector("button[name=previous]");
    const previous_description_id = this.get_property_value("previous_description_id");
    this.constructor.set_disabled(previous_btn_el, !previous_description_id);
    if (previous_description_id) {
      previous_btn_el.addEventListener(
        "click",
        () => CN_session.navigate_to(model.get_view_url(previous_description_id)),
      );
    }

    const next_btn_el = footer_el.querySelector("button[name=next]");
    const next_description_id = this.get_property_value("next_description_id");
    this.constructor.set_disabled(next_btn_el, !next_description_id);
    if (next_description_id) {
      next_btn_el.addEventListener(
        "click",
        () => CN_session.navigate_to(model.get_view_url(next_description_id)),
      );
    }
  }

  /**
   * Extend parent element
   */
  _create_footer_element() {
    const footer_el = super._create_footer_element();
    const left_btn_group_el = footer_el.querySelector("div[name=left-btn-group]")

    // add the navigation buttons
    const previous_btn_el = this.constructor.html(`
      <button name="previous" type="button" class="btn btn-light btn-outline-primary">
        <i class="bi bi-chevron-left"></i>
      </button>
    `);
    this.#previous_tooltip = new bootstrap.Tooltip(previous_btn_el, {
      title: "Previous Description",
      trigger: "hover",
      delay: { "show": 1000, "hide": 100 },
    });
    left_btn_group_el.append(previous_btn_el);

    const next_btn_el = this.constructor.html(`
      <button name="next" type="button" class="btn btn-light btn-outline-primary">
        <i class="bi bi-chevron-right"></i>
      </button>
    `);
    this.#next_tooltip = new bootstrap.Tooltip(next_btn_el, {
      title: "Next Description",
      trigger: "hover",
      delay: { "show": 1000, "hide": 100 },
    });
    left_btn_group_el.append(next_btn_el);

    return footer_el;
  }
}

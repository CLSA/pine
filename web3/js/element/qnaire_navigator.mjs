const { CN_base_element } = await import(`${CENOZO_URL}/js/element/base_element.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);
const { CN_session } = await import(`${CENOZO_URL}/js/session.mjs`);

export class CN_element_qnaire_navigator extends CN_base_element {
  constructor(parent_el, config = {}) {
    if (!CN_common.is_object(config)) {
      throw new Error("Non-object config argument passed to CN_element_qnaire_navigator constructor");
    }

    super(parent_el, {
      ...{
        class: "row mb-2",
        qnaire_list: [],
        module_list: [],
        page_list: [],
        question_list: [],
      },
      ...config
    });
  }

  /**
   * Extends parent method
   */
  update_element() {
    super.update_element();

    const el = this.get_element();

    // build the navigation lists
    ["qnaire", "module", "page", "question"].forEach(type => {
      const item_list = this.get_config(`${type}_list`);
      const nav_el = el.querySelector(`div[name=${type}]`);
      const dropdown_btn_el = nav_el.querySelector("button.dropdown-toggle");
      const ul_el = nav_el.querySelector("ul");
      this.constructor.set_disabled(dropdown_btn_el, 0 == item_list.length);
      ul_el.innerHTML = "";
      item_list.forEach(item => {
        if (item.active) dropdown_btn_el.innerHTML = item.name;
        const btn_el = this.constructor.html(`
          <li>
            <button
              type="button"
              class="dropdown-item overflow-x-hidden ${item.active ? "active" : ""}"
            >${item.name}</button>
          </li>
        `);
        btn_el.addEventListener("click", () => CN_session.navigate_to(item.path));
        ul_el.append(btn_el);
      });
    });
  }

  /**
   * Extends parent method
   */
  _create_element() {
    const el = super._create_element();

    [
      { name: "qnaire", title: "Questionnaire" },
      { name: "module", title: "Module" },
      { name: "page", title: "Page" },
      { name: "question", title: "Question" },
    ].forEach(type => {
      el.append(this.constructor.html(`
        <div name="${type.name}" class="col-xl-3">
          <div class="fw-bold text-center">${type.title}</div>
          <div class="dropdown">
            <button
              type="button"
              class="btn btn-secondary dropdown-toggle w-100"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></button>
            <ul class="dropdown-menu" style="min-width: 100%"></ul>
          </div>
        </div>
      `));
    });

    return el;
  }
}

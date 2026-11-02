const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
const { CN_base_element } = await import(`${CENOZO_URL}/js/element/base_element.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);
const { CN_session } = await import(`${CENOZO_URL}/js/session.mjs`);

export class CN_element_qnaire_navigator extends CN_base_element {
  #qnaire_list = [];
  #module_list = [];
  #page_list = [];
  #question_list = [];
  #qnaire_id = null;
  #module_id = null;
  #page_id = null;
  #question_id = null;

  constructor(parent_el, config = {}) {
    if (!CN_common.is_object(config)) {
      throw new Error("Non-object config argument passed to CN_element_qnaire_navigator constructor");
    }

    super(parent_el, {
      ...{
        class: "row mb-2",
      },
      ...config
    });
  }

  /**
   * Extends parent method
   */
  async on_dom_add() {
    await super.on_dom_add();

    const qnaire_model = CN_session.get_root_model();
    const leaf_model = CN_session.get_leaf_model();
    const promise_list = [
      CN_api.get(qnaire_model.get_base_path("api"), {
        select: { column: [{ table: "qnaire", column: "name" }] },
        modifier: { order: "qnaire.name" },
      }),

      CN_api.get(`${qnaire_model.get_view_url(null, "api")}/module`, {
        select: { column: [{ table: "module", column: "name" }, { table: "module", column: "rank" }] },
        modifier: { order: "module.rank" },
      }),
    ];

    this.#qnaire_id = qnaire_model.get_identifier();
    if ("module" == leaf_model.get_name()) {
      this.#module_id = leaf_model.get_identifier();
      promise_list.push(
        CN_api.get(`${leaf_model.get_view_url(null, "api")}/page`, {
          select: { column: [{ table: "page", column: "name" }, { table: "page", column: "rank" }] },
          modifier: { order: "page.rank" },
        })
      );
    } else if ("page" == leaf_model.get_name()) {
      this.#module_id = leaf_model.get_parent_model().get_identifier();
      this.#page_id = leaf_model.get_identifier();
      promise_list.push(
        CN_api.get(`${leaf_model.get_parent_model().get_view_url(null, "api")}/page`, {
          select: { column: [{ table: "page", column: "name" }, { table: "page", column: "rank" }] },
          modifier: { order: "page.rank" },
        })
      );
      promise_list.push(
        CN_api.get(`${leaf_model.get_view_url(null, "api")}/question`, {
          select: { column: [{ table: "question", column: "name" }, { table: "question", column: "rank" }] },
          modifier: { order: "question.rank" },
        })
      );
    } else if ("question" == leaf_model.get_name()) {
      this.#module_id = leaf_model.get_parent_model().get_parent_model().get_identifier();
      this.#page_id = leaf_model.get_parent_model().get_identifier();
      this.#question_id = leaf_model.get_identifier();
      promise_list.push(
        CN_api.get(`${leaf_model.get_parent_model().get_parent_model().get_view_url(null, "api")}/page`, {
          select: { column: [{ table: "page", column: "name" }, { table: "page", column: "rank" }] },
          modifier: { order: "page.rank" },
        })
      );
      promise_list.push(
        CN_api.get(`${leaf_model.get_parent_model().get_view_url(null, "api")}/question`, {
          select: { column: [{ table: "question", column: "name" }, { table: "question", column: "rank" }] },
          modifier: { order: "question.rank" },
        })
      );
    }

    const response_list = await Promise.all(promise_list);

    this.#qnaire_list = response_list[0].map(qnaire => ({
      id: qnaire.id,
      name: qnaire.name,
      path: `qnaire/view/${qnaire.id}`,
      active: this.#qnaire_id == qnaire.id,
    }));

    this.#module_list = response_list[1].map(module => ({
      id: module.id,
      name: `${module.rank}. ${module.name}`,
      path: [
        `qnaire/view/${this.#qnaire_id}`,
        `module/view/${module.id}`,
      ].join("/"),
      active: this.#module_id == module.id,
    }));

    if (2 < response_list.length) {
      this.#page_list = response_list[2].map(page => ({
        id: page.id,
        name: `${page.rank}. ${page.name}`,
        path: [
          `qnaire/view/${this.#qnaire_id}`,
          `module/view/${this.#module_id}`,
          `page/view/${page.id}`,
        ].join("/"),
        active: this.#page_id == page.id,
      }));
    }

    if (3 < response_list.length) {
      this.#question_list = response_list[3].map(question => ({
        id: question.id,
        name: `${question.rank}. ${question.name}`,
        path: [
          `qnaire/view/${this.#qnaire_id}`,
          `module/view/${this.#module_id}`,
          `page/view/${this.#page_id}`,
          `question/view/${question.id}`,
        ].join("/"),
        active: this.#question_id == question.id,
      }));
    }

    this.update_element();
  }

  /**
   * Extends parent method
   */
  update_element() {
    super.update_element();

    const el = this.get_element();

    // build the navigation lists
    ["qnaire", "module", "page", "question"].forEach(type => {
      const item_list = (
        "qnaire" == type ? this.#qnaire_list :
        "module" == type ? this.#module_list :
        "page" == type ? this.#page_list :
        this.#question_list
      );

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

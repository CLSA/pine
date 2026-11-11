const { CN_action_view } = await import(`${CENOZO_URL}/js/action/view.mjs`);
const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
const { CN_base_action } = await import(`${CENOZO_URL}/js/action/base_action.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);
const { CN_element_label } = await import(`${CENOZO_URL}/js/element/label.mjs`);
import { CN_element_qnaire_navigator } from "../element/qnaire_navigator.mjs"
const { CN_input_enum } = await import(`${CENOZO_URL}/js/input/enum.mjs`);
const { CN_input_rank } = await import(`${CENOZO_URL}/js/input/rank.mjs`);
const { CN_input_string } = await import(`${CENOZO_URL}/js/input/string.mjs`);
const { CN_session } = await import(`${CENOZO_URL}/js/session.mjs`);

export class CN_model_base_qnaire_part extends CN_base_model {
  constructor(type) {
    const word = CN_common.uc_words(type.replace(/_/, " "));
    super({
      wording: {
        singular: word,
        plural: `${word}s`,
        posessive: `${word}'s`,
      },
      columns: {
        rank: { column: `${type}.rank`, title: "Rank", type: "rank" },
        name: { column: `${type}.name`, title: "Name" },
        precondition: { column: `${type}.precondition`, title: "Precondition" },
      },
      get_default_order: () => {
        return "question" == type && "qnaire" == CN_session.get_leaf_model().get_name() ? "name" : "rank";
      },
      properties: {
        rank: { title: "Rank", type: "rank", },
        name: {
          title: "Name",
          format: "module" == type ? "identifier" : "question_option" == type ? "alpha_num" : "",
          regex: ["page","question"].includes(type) ? "^[a-zA-Z_][a-zA-Z0-9_]*$" : "",
        },
        precondition: {
          title: "Precondition",
          type: "text",
          help: `An expression which restricts whether or not to show this ${word}.`,
        },
        description: {
          title: "Description",
          type: "text",
          meta: {},
          help: "The description in the questionnaire's language.",
          is_hidden: () => "view" == this.get_action_name(),
        },
        previous_id: { is_hidden: () => true, meta: {} },
        next_id: { is_hidden: () => true, meta: {} },
      },
    });
  }
}

export class CN_clone_base_qnaire_part extends CN_base_action {
  #first_load = true;
  #name = null;
  #operation_form_input = null;
  #rank_form_input = null;
  #name_form_input = null;
  #form_inputs = { qnaire: null, module: null, page: null, question: null };
  #proceed_btn_el;

  constructor(parent_el, model) {
    super("clone", parent_el, model);
  }

  /**
   * Extend parent method
   */
  async get_text(type) {
    if ("crumb" == type) {
      return `${this.#name}: Move/Copy`;
    }

    if ("header" == type) {
      return `Move/Copy "${this.#name}" ${CN_common.uc_words(this.get_model().get_singular())}`;
    }

    return await super.get_text(type);
  }

  /**
   * Extend parent method
   */
  async on_navigate_to_parent() {
    await CN_session.navigate_to(this.get_model().get_view_url());
  }

  /**
   * Extend parent method
   */
  async on_load() {
    const response = await CN_api.get(this.get_model().get_view_url(null, "api"), { select: { column: "name" } });
    this.#name = response.name;
  }

  /**
   * Extend parent method
   */
  update_element() {
    super.update_element();

    const model = this.get_model();
    const model_name = model.get_name();
    const body_el = this.get_body_element();
    const module_row_el = body_el.querySelector("div.row[name=module]");
    const page_row_el = body_el.querySelector("div.row[name=page]");
    const question_row_el = body_el.querySelector("div.row[name=question]");
    const rank_row_el = body_el.querySelector("div[name=rank]");
    const name_row_el = body_el.querySelector("div[name=name]");


    const include_type_list = [];
    if ("module" != model_name) {
      include_type_list.push("module");
      if ("page" != model_name) {
        include_type_list.push("page");
        if ("question" != model_name) include_type_list.push("question");
      }
    }
  
    // show/hide form inputs
    if (
      include_type_list.includes("module") &&
      this.#form_inputs.qnaire &&
      this.#form_inputs.qnaire.get_value_for_record()
    ) {
      module_row_el.classList.remove("d-none");
    } else {
      module_row_el.classList.add("d-none");
    }

    if (
      include_type_list.includes("page") &&
      this.#form_inputs.module &&
      this.#form_inputs.module.get_value_for_record()
    ) {
      page_row_el.classList.remove("d-none");
    } else {
      page_row_el.classList.add("d-none");
    }

    if (
      include_type_list.includes("question") &&
      this.#form_inputs.page &&
      this.#form_inputs.page.get_value_for_record()
    ) {
      question_row_el.classList.remove("d-none");
    } else {
      question_row_el.classList.add("d-none");
    }

    if (this.#form_inputs[model.get_parent_model().get_name()].get_value_for_record()) {
      rank_row_el.classList.remove("d-none");
      if ("copy" == this.#operation_form_input.get_value()) {
        name_row_el.classList.remove("d-none");
      } else {
        name_row_el.classList.add("d-none");
      }
    } else {
      rank_row_el.classList.add("d-none");
      name_row_el.classList.add("d-none");
    }
  }

  /**
   * Extend parent method
   */
  _create_body_element() {
    const model = this.get_model();
    const parent_model = model.get_parent_model();
    const model_name = model.get_name();
    const parent_model_name = parent_model.get_name();

    const body_el = this.constructor.html(`
      <div class="text-info-emphasis">
        <div class="pb-2">Provide the ${model.get_posessive()} destination:</div>
      </div>
    `);

    const op_row_el = this.constructor.html('<div name="operation" class="row my-1"></div>');
    CN_element_label.append(op_row_el, { for: "operation", value: "Operation", class: "col-sm-3" });
    this.#operation_form_input = CN_input_enum.append(op_row_el, {
      id: "operation",
      class: "col-sm-9",
      required: true,
      get_default: () => "move",
      enum: {
        values: [{
          key: "move",
          value: `Move${
            "module" != model_name ?
            ` (the parent ${parent_model_name} will be deleted if it has no remaining ${model.get_plural()})` :
            ""
          }`,
        }, {
          key: "copy",
          value: "Copy"
        }],
      },
      on_change: () => {
        this.constructor.set_disabled(
          this.#proceed_btn_el,
          !this.#rank_form_input.get_value() || (
            "copy" == this.#operation_form_input.get_value() &&
            !this.#name_form_input.get_value()
          )
        );
        this.update_element();
      },
    });
    body_el.append(op_row_el);

    for (const name in this.#form_inputs) {
      const id = `${name}_id`;
      const row_el = this.constructor.html(`
        <div name="${name}" class="row my-1 ${"qnaire" == name ? "" : "d-none"}"></div>
      `);
      let title = CN_common.uc_words("qnaire" == name ? "questionnaire" : name);

      CN_element_label.append(row_el, { for: id, value: title, class: "col-sm-3" });
      if ("question" == name) title = `List ${title}`;
      this.#form_inputs[name] = CN_input_enum.append(row_el, {
        id: id,
        class: "col-sm-9",
        placeholder: `(Select a target ${title}...)`,
        required: "qnaire" == name,
        enum: {
          get_enums: async () => {
            const parent_name = (
              "module" == name ? "qnaire" :
              "page" == name ? "module" :
              "question" == name ? "page" :
              null
            );
            const parent_id = "qnaire" == name ? 0 : this.#form_inputs[parent_name].get_value_for_record();
            if (null == parent_id) return [];

            return (await CN_api.get("qnaire" == name ? "qnaire" : `${parent_name}/${parent_id}/${name}`, {
              select: { column: "qnaire" == name ? "name" : ["rank", "name"] },
              modifier: {
                // only include list-model_name questions
                where: "question" == name ? [{ column: "type", operator: "=", value: "list" }] : [],
                order: "qnaire" == name ? "name" : "rank"
              },
            })).map(obj => ({ key: obj.id, value: "qnaire" == name ? obj.name : `${obj.rank}. ${obj.name}` }));
          },
        },
        on_change: (form_input) => (
          "qnaire" == name ? this.#set_qnaire(form_input.get_value_for_record()) :
          "module" == name ? this.#set_module(form_input.get_value_for_record()) :
          "page" == name ? this.#set_page(form_input.get_value_for_record()) :
          this.#set_question(form_input.get_value_for_record())
        ),
      });

      body_el.append(row_el);
    }

    const rank_row_el = this.constructor.html('<div name="rank" class="row my-1 d-none"></div>');
    CN_element_label.append(rank_row_el, { for: "rank", value: "Rank", class: "col-sm-3" });
    this.#rank_form_input = CN_input_rank.append(rank_row_el, {
      id: "rank",
      class: "col-sm-9",
      required: true,
      placeholder: `(Select a target rank...)`,
      get_default: () => null,
      // TODONEXT: convert to enum (rank + current name) and disable or remove current rank when moving)
      max_rank: async () => {
        const parent_id = this.#form_inputs[parent_model_name].get_value_for_record();
        return parent_id ?  await CN_api.count(`${parent_model_name}/${parent_id}/${model_name}`) + 1 : 0;
      },
      on_change: () => {
        this.constructor.set_disabled(
          this.#proceed_btn_el,
          !this.#rank_form_input.get_value() || (
            "copy" == this.#operation_form_input.get_value() &&
            !this.#name_form_input.get_value()
          )
        );
      },
    });
    body_el.append(rank_row_el);

    const name_row_el = this.constructor.html('<div name="name" class="row my-1 d-none"></div>');
    CN_element_label.append(name_row_el, { for: "name", value: "New Name", class: "col-sm-3" });
    this.#name_form_input = CN_input_string.append(name_row_el, {
      id: "name",
      class: "col-sm-9",
      required: true,
      format: "module" == model_name ? "identifier" : "question_option" == model_name ? "alpha_num" : "",
      placeholder: `(Select a new name...)`,
      on_change: (form_input, valid) => {
        this.constructor.set_disabled(
          this.#proceed_btn_el,
          !valid ||
          !this.#rank_form_input.get_value() || (
            "copy" == this.#operation_form_input.get_value() &&
            !this.#name_form_input.get_value()
          )
        );
      },
    });
    body_el.append(name_row_el);

    return body_el;
  }

  /**
   * Extends the parent method
   */
  _create_footer_element() {
    const model = this.get_model();
    const parent_model = model.get_parent_model();
    const model_name = model.get_name();
    const parent_model_name = parent_model.get_name();

    const footer_el = this.constructor.html(`
      <div class="d-flex w-100">
        <div class="me-auto btn-group" role="group" name="right-btn-group"></div>
        <div class="btn-group" role="group" name="left-btn-group">
          <button name="cancel" type="button" class="btn btn-light btn-outline-primary">Cancel</button>
          <button name="proceed" type="button" class="btn btn-primary">Proceed</button>
        </div>
      </div>
    `);

    footer_el.querySelector("button[name=cancel]").addEventListener(
      "click",
      this.on_navigate_to_parent.bind(this)
    );

    this.#proceed_btn_el = footer_el.querySelector("button[name=proceed]");
    this.constructor.set_disabled(this.#proceed_btn_el, true);
    this.#proceed_btn_el.addEventListener("click", async () => {
      const data = { rank: this.#rank_form_input.get_value() };
      data[`${parent_model_name}_id`] = this.#form_inputs[parent_model_name].get_value_for_record();

      if ("copy" == this.#operation_form_input.get_value()) {
        data.name = this.#name_form_input.get_value();
        await this.constructor.wait_for(async () => {
          const response = await CN_api.post(`${model_name}?clone=${model.get_identifier()}`, data);
          let path = `qnaire/view/${this.#form_inputs.qnaire.get_value_for_record()}`;
          if ("module" != model_name) {
            path += `/module/view/${this.#form_inputs.module.get_value_for_record()}`;
            if ("page" != model_name) {
              path += `/page/view/${this.#form_inputs.page.get_value_for_record()}`;
              if ("question" != model_name) {
                path += `/question/view/${this.#form_inputs.question.get_value_for_record()}`;
              }
            }
          }
          path += `/${model_name}/view/${response}`;
          await CN_session.navigate_to(path);
        });
      } else {
        await this.constructor.wait_for(async () => {
          await CN_api.patch(model.get_view_url(null, "api"), data);

          let path = `qnaire/view/${this.#form_inputs.qnaire.get_value_for_record()}`;
          if ("module" != model_name) {
            path += `/module/view/${this.#form_inputs.module.get_value_for_record()}`;
            if ("page" != model_name) {
              path += `/page/view/${this.#form_inputs.page.get_value_for_record()}`;
              if ("question" != model_name) {
                path += `/question/view/${this.#form_inputs.question.get_value_for_record()}`;
              }
            }
          }
          path += `/${model_name}/view/${model.get_identifier()}`;
          await CN_session.navigate_to(path);
        });
      }
    });

    return footer_el;
  }

  /**
   * ADD DOCS
   */
  async #set_operation(op) {
    this.#operation_form_input.set_value(op);

    this.constructor.set_disabled(
      this.#proceed_btn_el,
      !this.#rank_form_input.get_value() || ("copy" == op && !this.#name_form_input.get_value())
    );
    await this.#rank_form_input.update();
  }

  /**
   * ADD DOCS
   */
  async #set_qnaire(qnaire_id) {
    this.#form_inputs.qnaire.set_value(qnaire_id);
    await this.#form_inputs.qnaire.validate();
    await this.#set_module(null);
    await this.#form_inputs.module.update();
  }

  /**
   * ADD DOCS
   */
  async #set_module(module_id) {
    this.#form_inputs.module.set_value(module_id);
    await this.#form_inputs.module.validate();
    await this.#set_page(null);
    await this.#form_inputs.page.update();
  }

  /**
   * ADD DOCS
   */
  async #set_page(page_id) {
    this.#form_inputs.page.set_value(page_id);
    await this.#form_inputs.page.validate();
    await this.#set_question(null);
    await this.#form_inputs.question.update();
  }

  /**
   * ADD DOCS
   */
  async #set_question(question_id) {
    this.#form_inputs.question.set_value(question_id);
    await this.#form_inputs.question.validate();
    await this.#set_rank(null);
    await this.#rank_form_input.update();
  }

  /**
   * ADD DOCS
   */
  async #set_rank(rank) {
    this.#rank_form_input.set_value(rank);
    await this.#rank_form_input.validate();
    this.update_element();
  }

  /**
   * ADD DOCS
   */
  async #set_name(name) {
    this.#name_form_input.set_value(name);
    await this.#name_form_input.validate();
  }
}

export class CN_view_base_qnaire_part extends CN_action_view {
  #qnaire_navigator;

  /**
   * Extends parent method
   */
  update_element() {
    super.update_element();

    this.constructor.set_disabled(
      this.get_footer_element().querySelector("button[name=previous]"),
      !this.get_property_value("previous_id")
    );

    this.constructor.set_disabled(
      this.get_footer_element().querySelector("button[name=next]"),
      !this.get_property_value("next_id")
    );

    // the question_option model doesn't use the qnaire navigator
    if ("question_option" != this.get_model().get_name()) {
      if (!this.#qnaire_navigator) {
        this.#qnaire_navigator = CN_element_qnaire_navigator.prepend(this.get_element());
      }
      this.#qnaire_navigator.update_element();
    }
  }

  /**
   * Extends the parent method
   */
  _create_footer_element() {
    const footer_el = super._create_footer_element();
    const left_btn_group_el = footer_el.querySelector("div[name=left-btn-group]");

    const previous_btn_el = this.constructor.html(`
      <button name="previous" type="button" class="btn btn-light btn-outline-primary">
        <i class="bi bi-chevron-left"></i>
      </button>
    `);
    left_btn_group_el.append(previous_btn_el);
    previous_btn_el.addEventListener("click", async () => {
      await CN_session.navigate_to(await this.#get_path(this.get_property_value("previous_id")));
    });

    const next_btn_el = this.constructor.html(`
      <button name="next" type="button" class="btn btn-light btn-outline-primary">
        <i class="bi bi-chevron-right"></i>
      </button>
    `);
    left_btn_group_el.append(next_btn_el);
    next_btn_el.addEventListener("click", async () => {
      await CN_session.navigate_to(await this.#get_path(this.get_property_value("next_id")));
    });

    const copy_btn_el = this.constructor.html(
      '<button name="copy" type="button" class="btn btn-light btn-outline-primary">Move/Copy</button>'
    );
    left_btn_group_el.append(copy_btn_el);
    copy_btn_el.addEventListener("click", () => {
      const model = this.get_model();
      const model_name = model.get_name();
      CN_session.navigate_to(
        model.get_view_url().replace(new RegExp(`${model_name}/view`), `${model_name}/clone`)
      );
    });

    return footer_el;
  }

  /**
   * ADD DOCS
   */
  async #get_path(id) {
    const model_name = this.get_model().get_name();
    const path_parts = [`qnaire/view/${CN_session.get_root_model().get_identifier()}`];

    if ("module" != model_name) {
      const columns = [{ table: "module", column: "id", alias: "module_id" }];
      if ("page" != model_name) {
        columns.push({ table: "page", column: "id", alias: "page_id" });
        if ("question" != model_name) columns.push({ table: "question", column: "id", alias: "question_id" });
      }
      const response = await CN_api.get(`${model_name}/${id}`, { select: { column: columns } });

      path_parts.push(`module/view/${response.module_id}`);
      if ("page" != model_name) {
        path_parts.push(`page/view/${response.page_id}`);
        if ("question" != model_name) path_parts.push(`question/view/${response.question_id}`);
      }
    }

    path_parts.push(`${model_name}/view/${id}`);
    return path_parts.join("/");
  }
}

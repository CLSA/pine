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
  #name = null;
  #operation_form_input;
  #qnaire_form_input;
  #module_form_input;
  #page_form_input;
  #question_form_input;
  #rank_form_input;
  #name_form_input;

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
    const response = await CN_api.get(this.get_model().get_view_url(null, "api"), {
      select: { column: "name" }
    });
    this.#name = response.name;
  }

  /**
   * Extend parent method
   */
  _create_body_element() {
    const model = this.get_model();
    const type = model.get_name();
    const title = CN_common.uc_words(type.replace(/_/, " "));
    const parent_type = (
      "module" == type ? "qnaire" :
      "page" == type ? "module" :
      "question" == type ? "page" :
      "question"
    );

    const body_el = this.constructor.html(`
      <div class="text-info-emphasis">
        <div class="pb-2">Provide the ${model.get_posessive()} destination:</div>
      </div>
    `);

    let move_title = `Move ${title}`;
    if ("module" != type) move_title +=
      ` (the parent ${parent_type} will be deleted if it has no remaining ${model.get_plural()})`;
    const op_row_el = this.constructor.html('<div class="row"></div>');
    CN_element_label.append(op_row_el, { for: "operation", value: "Operation", class: "col-sm-3" });
    this.#operation_form_input = CN_input_enum.append(op_row_el, {
      id: "operation",
      class: "col-sm-9",
      required: true,
      get_default: () => "move",
      enum: {
        values: [
          { key: "move", value: move_title, },
          { key: "copy", value: `Copy ${title}` },
        ],
      },
      on_change: async (form_input) => {
        // TODO
      },
    });
    body_el.append(op_row_el);

    const item_list = ["questionnaire"];
    if ("module" != type) {
      item_list.push("module");
      if ("page" != type) {
        item_list.push("page");
        if ("question" != type) item_list.push("question");
      }
    }

    item_list.forEach(item => {
      const id = `${item}_id`;
      const item_title = CN_common.uc_words(item.replace(/_/, " "));
      const row_el = this.constructor.html('<div class="row"></div>');
      CN_element_label.append(row_el, { for: id, value: item_title, class: "col-sm-3" });
      this[`#${item}_form_input`] = CN_input_enum.append(row_el, {
        id: id,
        class: "col-sm-9",
        required: true,
        placeholder: `(Select a ${item_title}...)`,
        get_default: () => null,
        enum: {
          values: [],
        },
        on_change: async (form_input) => {
          // TODO
        },
      });
      body_el.append(row_el);
    });

    const rank_row_el = this.constructor.html('<div class="row"></div>');
    CN_element_label.append(rank_row_el, { for: "rank", value: "Rank", class: "col-sm-3" });
    this.#rank_form_input = CN_input_rank.append(rank_row_el, {
      id: "rank",
      class: "col-sm-9",
      required: true,
      placeholder: `(Select a rank...)`,
      get_default: () => null,
      on_change: async (form_input) => {
        // TODO
      },
    });
    body_el.append(rank_row_el);

    const name_row_el = this.constructor.html('<div class="row"></div>');
    CN_element_label.append(name_row_el, { for: "name", value: "New Name", class: "col-sm-3" });
    this.#name_form_input = CN_input_string.append(name_row_el, {
      id: "name",
      class: "col-sm-9",
      required: true,
      on_change: async (form_input) => {
        // TODO
      },
    });
    body_el.append(name_row_el);

    return body_el;
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

    // the question_option type doesn't use the qnaire navigator
    const model = this.get_model();
    const type = model.get_name();
    if ("question_option" != type) {
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
      const type = model.get_name();
      CN_session.navigate_to(model.get_view_url().replace(new RegExp(`${type}/view`), `${type}/clone`));
    });

    return footer_el;
  }

  /**
   * ADD DOCS
   */
  async #get_path(id) {
    const model = this.get_model();
    const type = model.get_name();
    const path_parts = [`qnaire/view/${CN_session.get_root_model().get_identifier()}`];

    if ("module" != type) {
      const columns = [{ table: "module", column: "id", alias: "module_id" }];
      if ("page" != type) {
        columns.push({ table: "page", column: "id", alias: "page_id" });
        if ("question" != type) columns.push({ table: "question", column: "id", alias: "question_id" });
      }
      const response = await CN_api.get(`${type}/${id}`, { select: { column: columns } });

      path_parts.push(`module/view/${response.module_id}`);
      if ("page" != type) {
        path_parts.push(`page/view/${response.page_id}`);
        if ("question" != type) path_parts.push(`question/view/${response.question_id}`);
      }
    }

    path_parts.push(`${type}/view/${id}`);
    return path_parts.join("/");
  }
}

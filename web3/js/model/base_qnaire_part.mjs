const { CN_action_view } = await import(`${CENOZO_URL}/js/action/view.mjs`);
const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
const { CN_base_action } = await import(`${CENOZO_URL}/js/action/base_action.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);
import { CN_element_qnaire_navigator } from "../element/qnaire_navigator.mjs"

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

export class CN_view_base_qnaire_part extends CN_action_view {
  #qnaire_navigator;
  #navigator_item_list = [];

  get_navigator_item_list() { return this.#navigator_item_list; }

  /**
   * Extends parent method
   */
  async on_load() {
    await super.on_load();

    // the question_option type doesn't use the qnaire navigator
    const model = this.get_model();
    const type = model.get_name();
    if ("question_option" == type) return;

    const item_type = "module" == type ? "page" : "page" == type ? "question" : null;
    if (null != item_type) {
      this.#navigator_item_list = (await CN_api.get(`${model.get_view_url(null, "api")}/${item_type}`, {
        select: { column: [{ table: item_type, column: "name" }, { table: item_type, column: "rank" }] },
        modifier: { order: `${item_type}.rank` },
      })).map(item => ({
        id: item.id,
        name: `${item.rank}. ${item.name}`,
        path: `${model.get_view_url(null)}/${item_type}/view/${item.id}`,
        active: false,
      }));
    }
  }

  /**
   * Extends parent method
   */
  update_element() {
    super.update_element();

    // the question_option type doesn't use the qnaire navigator
    const model = this.get_model();
    const type = model.get_name();
    if ("question_option" == type) return;

    if (!this.#qnaire_navigator) this.#qnaire_navigator = CN_element_qnaire_navigator.prepend(this.get_element());

    // get a list of actions for this and all parent models (qnaire -> module -> page -> question)
    const action_list = [];
    let temp_model = model;
    do { action_list.unshift(temp_model.get_action()); } while (temp_model = temp_model.get_parent_model());

    // set each model's navigator list and also determining which is active
    this.#qnaire_navigator.set_config("qnaire_list", action_list[0].get_navigator_qnaire_list());

    this.#qnaire_navigator.set_config(
      "module_list",
      action_list[0].get_navigator_item_list().map(item => ({
        ...item,
        active: action_list[1] && action_list[1].get_model().get_identifier() == item.id
      })),
    );

    if (2 <= action_list.length) {
      this.#qnaire_navigator.set_config(
        "page_list",
        action_list[1].get_navigator_item_list().map(item => ({
          ...item,
          active: action_list[2] && action_list[2].get_model().get_identifier() == item.id
        })),
      );
    }

    if (3 <= action_list.length) {
      this.#qnaire_navigator.set_config(
        "question_list",
        action_list[2].get_navigator_item_list().map(item => ({
          ...item,
          active: action_list[3] && action_list[3].get_model().get_identifier() == item.id
        })),
      );
    }

    this.#qnaire_navigator.update_element();
  }
}

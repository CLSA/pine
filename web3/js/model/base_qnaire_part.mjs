const { CN_action_view } = await import(`${CENOZO_URL}/js/action/view.mjs`);
const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
const { CN_base_action } = await import(`${CENOZO_URL}/js/action/base_action.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);
import { CN_element_qnaire_navigator } from "../element/qnaire_navigator.mjs"
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

export class CN_view_base_qnaire_part extends CN_action_view {
  #qnaire_navigator;

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
    this.#qnaire_navigator.update_element();
  }
}

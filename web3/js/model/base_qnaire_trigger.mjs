const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);
import { CN_model_question } from "./question.mjs"

export class CN_model_base_qnaire_trigger extends CN_base_model {
  constructor(type) {
    const word = CN_common.uc_words(type.replace(/_/, " "));
    const word_short = word.replace(/ Type$/, "");

    let properties = {};
    properties[`${type}_id`] = { title: word, type: "enum", enum: { path: type } };
    properties = {
      ...properties,
      ...{
        question_id: {
          title: "Question",
          type: "typeahead",
          typeahead: CN_model_question.get_typeahead(),
          // TODO: is this needed?
          // don't include the question_id when we're adding from a question already
          //is_hidden: () => "question" == this.get_parent_model().get_name(),
        },
        answer_value: { title: "Required Answer" },
      },
    };

    super({
      wording: {
        singular: `${word_short} trigger`,
        plural: `${word_short} triggers`,
        posessive: `${word_short} trigger's`,
      },
      columns: {
        trigger_type: { title: word, column: `${type}.name` },
        question: { title: "Question", column: "question.name" },
        answer_value: { title: "Required Answer" },
      },
      properties: properties,
    });
  }
}

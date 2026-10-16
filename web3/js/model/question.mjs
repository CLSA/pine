const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);

export class CN_model_question extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "question",
        plural: "questions",
        posessive: "question's",
      },
      columns: {
        module_name: {
          column: "module.name",
          title: "Module",
          is_hidden: () => "qnaire" != this.get_parent_model().get_name(),
        },
        page_name: {
          column: "page.name",
          title: "Page",
          is_hidden: () => "qnaire" != this.get_parent_model().get_name(),
        },
        question_name: {
          column: "question.name",
          title: "Question",
          is_hidden: () => "qnaire" != this.get_parent_model().get_name(),
        },
        type: { title: "Type" },
        export: { title: "Exported", type: "boolean" },
        change_allowed: { title: "Change Allowed", type: "boolean" },
      },
      properties: {
      },
    });
  }

  /**
   * Returns a typeahead object for models that have a typeahead property referencing this model
   * @return object
   * @static
   */
  static get_typeahead(params = {}) {
    return {
      get_list: async (value) => {
        const api_params = CN_common.merge_objects({
          select: {
            column: [{
              table: "question",
              column: "id",
              alias: "key",
            }, {
              table: "question",
              column: 'CONCAT( question.name, " (", question.type, ")" )',
              alias: "value",
              table_prefix: false,
            }],
          },
          modifier: {
            where: {
              column: "question.name",
              operator: "like",
              value: `%${value}%`,
            },
            order: 'CONCAT( question.name, " (", question.type, ")" )',
            limit: 20,
          },
        }, params);
        return await CN_api.get("question", api_params);
      },
    };
  }
}

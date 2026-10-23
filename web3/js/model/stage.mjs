const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);

export class CN_model_stage extends CN_base_model {
  #module_enum_list = null;
  #stage_module_rank_list = null;

  constructor() {
    super({
      wording: {
        singular: "stage",
        plural: "stages",
        posessive: "stage's",
      },
      columns: {
        rank: { column: "stage.rank", title: "Rank", type: "rank" },
        name: { title: "Name", column: "stage.name" },
        order_deviation: { title: "Order Deviation", type: "boolean" },
        skip_deviation: { title: "Skip Deviation", type: "boolean" },
        precondition: { column: "stage.precondition", title: "Precondition" },
        first_module: { title: "First Module", column: "first_module.name" },
        last_module: { title: "Last Module", column: "last_module.name" },
        module_count: { title: "Number of Modules", table_prefix: false },
      },
      properties: {
        rank: {
          title: "Rank",
          type: "rank",
          on_change: (form_input, valid) => {
            const action = this.get_action();

            // run the default behaviour
            action.on_property_change("rank", valid);

            // update the action so the module list enums reflect the new rank
            action.update_element();
          },
        },
        name: { title: "Name", format: "identifier" },
        order_deviation: { title: "Require Order Deviation", type: "boolean" },
        skip_deviation: { title: "Require Skip Deviation", type: "boolean" },
        precondition: {
          title: "Precondition",
          type: "text",
          help: "An expression which restricts whether or not the stage can proceed.",
        },
        token_check_precondition: {
          title: "Token Check Precondition",
          type: "text",
          help: 
            "An expression which determines if the interviewer must provide the token before launching the stage.",
        },
        first_module_id: {
          title: "First Module",
          type: "enum",
          enum: {
            get_enums: async () => {
              const action = this.get_action();
              const enum_list = await this.#get_module_enum_list(true);

              // make sure the currently selected module is still valid
              const current_module_id = action.get_property_value("first_module_id");
              const current_module = enum_list.find(module => module.key == current_module_id);
              if (!current_module || current_module.disabled) {
                const prop = action.get_property("first_module_id");
                prop.form_input.clear_value();
                prop.form_input.set_value(null);
              }

              return enum_list;
            },
          },
          on_change: (form_input, valid) => {
            const action = this.get_action();

            // run the default behaviour
            action.on_property_change("first_module_id", valid);

            // update the action so the module list enums reflect the new rank
            action.update_element();
          },
          help: "Note that you must create at least one module before a stage can be created",
        },
        last_module_id: {
          title: "Last Module",
          type: "enum",
          enum: {
            get_enums: async () => {
              const action = this.get_action();
              const enum_list = await this.#get_module_enum_list(false);

              // the last module must be equal to or after the first module
              if ("add" == this.get_action_name()) {
                const first_module_id = action.get_property_value("first_module_id");
                if (first_module_id) {
                  const first_module_rank = enum_list.find(module => module.key == first_module_id).rank;
                  enum_list
                    .filter(module => module.rank < first_module_rank)
                    .forEach(module => module.disabled = true);
                }
              }

              // make sure the currently selected module is still valid
              const current_module_id = action.get_property_value("last_module_id");
              const current_module = enum_list.find(module => module.key == current_module_id);
              if (!current_module || current_module.disabled) {
                const prop = action.get_property("last_module_id");
                prop.form_input.clear_value();
                prop.form_input.set_value(null);
              }

              return enum_list;
            },
          },
          help: "Note that you must create at least one module before a stage can be created",
        },
      },
    });
  }

  /**
   * ADD DOCS
   */
  async #get_module_enum_list(first_module) {
    const base_url = this.get_parent_model().get_view_url(null, "api");
    if (null == this.#module_enum_list) {
      // create the base enum list
      this.#module_enum_list = (await CN_api.get(`${base_url}/module`, {
        select: { column: ["rank", "name"] },
        modifier: { order: "module.rank" },
      })).map(record => ({
        key: record.id,
        value: `${record.rank}. ${record.name}`,
        disabled: true, // some modules disabled below based on the selected rank
        rank: record.rank,
      }));
    }

    if (null == this.#stage_module_rank_list) {
      // create a list of all stages and ehtier first/last module ranks
      this.#stage_module_rank_list = await CN_api.get(`${base_url}/stage`, {
        select: {
          column: [
            "rank",
            { table: "first_module", column: "rank", alias: "first_module_rank" },
            { table: "last_module", column: "rank", alias: "last_module_rank" },
          ],
        },
        modifier: { order: "stage.rank" },
      });
    }

    const adding = "add" == this.get_action_name();
    const enum_list = CN_common.clone(this.#module_enum_list);
    const stage_rank = this.get_action().get_property_value("rank");
    const module_count = this.#module_enum_list.length;
    const stage_count = this.#stage_module_rank_list.length + (adding ? 1 : 0);

    if (stage_rank && 0 < module_count) {

      // determine the stage that comes before and after the current stage
      const previous_stage_rank = stage_rank - 1;
      const previous_stage = this.#stage_module_rank_list.find(stage => previous_stage_rank == stage.rank);
      const next_stage_rank = stage_rank + (adding ? 0 : 1);
      const next_stage = this.#stage_module_rank_list.find(stage => next_stage_rank == stage.rank);

      // determine the min/max module rank based on the previous/next stages
      const min_rank = (
        !first_module && stage_count == stage_rank ?
        module_count : // the last module of the last stage must be the last module
        previous_stage ? previous_stage.first_module_rank + 1 : 1
      );
      const max_rank = (
        first_module && 1 == stage_rank ?
        1 : // the first module of the first stage must be first module
        next_stage ? next_stage.last_module_rank - 1 : module_count
      );

      enum_list
        .filter(module => min_rank <= module.rank && module.rank <= max_rank)
        .forEach(module => module.disabled = false);
    }

    return enum_list;
  }
}

const { CN_action_list } = await import(`${CENOZO_URL}/js/action/list.mjs`);
const { CN_action_view } = await import(`${CENOZO_URL}/js/action/view.mjs`);
const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_modal_message } = await import(`${CENOZO_URL}/js/modal/message.mjs`);
const { CN_model_participant } = await import(`${CENOZO_URL}/js/model/participant.mjs`);
const { CN_session } = await import(`${CENOZO_URL}/js/session.mjs`);

export class CN_model_respondent extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "respondent",
        plural: "respondents",
        posessive: "respondent's",
      },
      columns: {
        qnaire: { column: "qnaire.name", title: "Questionnaire" },
        uid: { column: "participant.uid", title: "Participant" },
        first_name: { column: "participant.first_name", title: "First Name" },
        last_name: { column: "participant.last_name", title: "Last Name" },
        token: { title: "Token" },
        interview_type: {
          title: "Type",
          column: "response.interview_type",
          is_hidden: () =>
            !this.get_parent_model().get_action().get_property_value("stages") ||
            this.get_parent_model().get_action().get_property_value_for_record("repeated"),
        },
        language: {
          column: "language.name",
          title: "Language",
          is_hidden: () => this.get_parent_model().get_action().get_property_value_for_record("repeated"),
        },
        response_count: {
          title: "Responses",
          is_hidden: () => this.get_parent_model().get_action().get_property_value_for_record("repeated"),
        },
        status: { title: "Status", table_prefix: false },
        qnaire_progress: {
          title: "Progress",
          table_prefix: false,
          is_hidden: () => this.get_parent_model().get_action().get_property_value_for_record("repeated"),
        },
        start_datetime: { column: "respondent.start_datetime", title: "Start Date", type: "datetime" },
        end_datetime: { column: "respondent.end_datetime", title: "End Date", type: "datetime" },
      },
      get_default_order: () => "uid",
      properties: {
        participant_id: {
          meta: { table: "respondent", column: "participant_id" },
          title: "Participant",
          type: "typeahead",
          typeahead: CN_model_participant.get_typeahead(),
          is_constant: () => "view" == this.get_action_name(),
          help: "For anonymous respondents this value should be left blank.",
        },
        first_name: {
          meta: { table: "participant", column: "first_name" },
          title: "First Name",
          is_constant: () => true,
          is_hidden: () => "add" == this.get_action_name(),
        },
        last_name: {
          meta: { table: "participant", column: "last_name" },
          title: "Last Name",
          is_constant: () => true,
          is_hidden: () => "add" == this.get_action_name(),
        },
        token: {
          title: "Token (Interview ID)",
          format: "alpha_-num",
          help: "Must be letters, numbers, underscores (_) and dashes (-) only",
          is_hidden: () => "add" == this.get_action_name(),
        },
        status: {
          title: "Status",
          meta: {},
          is_constant: () => true,
          is_hidden: () => "add" == this.get_action_name(),
        },
        start_datetime: {
          title: "Start Date & Time",
          type: "datetime",
          is_constant: () => true,
          is_hidden: () => "add" == this.get_action_name(),
        },
        end_datetime: {
          title: "End Date & Time",
          type: "datetime",
          is_constant: () => true,
          is_hidden: () => "add" == this.get_action_name(),
        },
        response: {
          title: "Response",
          properties: {
            qnaire_version: {
              meta: { table: "response", column: "qnaire_version" },
              title: "Questionnaire Version",
              is_constant: () => true,
            },
            interview_type: {
              meta: { table: "response", column: "interview_type" },
              title: "Interview Type",
              is_constant: () => true,
            },
            language_id: {
              meta: { table: "response", column: "language_id" },
              title: "Language",
              type: "enum",
              enum: {
                path: "language",
                modifier: {
                  where: { column: "active", operator: "=", value: true },
                  order: "language.name",
                },
              },
            },
            qnaire_progress: {
              meta: {},
              title: "Progress",
              is_constant: () => true,
            },
            checked_in: {
              meta: { table: "response", column: "checked_in" },
              title: "Checked In",
              type: "boolean",
              is_constant: () => true,
            },
            module: {
              meta: { table: "module", column: "name" },
              title: "Module",
              is_constant: () => true,
            },
            page: {
              meta: { table: "page", column: "name" },
              title: "Page",
              is_constant: () => true,
            },
            comments: {
              meta: { table: "response", column: "comments" },
              title: "Comments",
              type: "text",
            },
          },
          is_hidden: () => {
            return (
              "view" != this.get_action_name() ||
              this.get_parent_model().get_action().get_property_value_for_record("repeated") ||
              !this.get_action().get_property_value("current_response_id")
            );
          },
        },
        current_response_id: { meta: { table: "response", column: "id" }, is_hidden: () => true },
        uid: { meta: { table: "participant", column: "uid" }, is_hidden: () => true },
      },
    });
  }

  async export(respondent_id = null) {
    let response = null;
    const action = this.get_action();
    await action.wait_for(async() => {
      const parent_model = this.get_model().get_parent_model()
      let path = `respondent${respondent_id ? `/${respondent_id}` : ""}?action=export`;
      if (parent_model) path = `${parent_model.get_name()}/${parent_model.get_identifier()}/${path}`;
      response = await (respondent_id ? CN_api.patch(path, {}) : CN_api.post(path, {}));
    });

    CN_modal_message.create_and_open({
      title: "Export Complete",
      message: (
        respondent_id ? "The respondent has been exported." :
        0 == response.length ? "No respondents have been exported." :
        `<div class="pb-2">The following respondents have been exported:</div><div>${response.join(", ")}</div>`
      ),
    });
    await action.run();
  }
}

export class CN_view_respondent extends CN_action_view {
  /**
   * Extend parent method
   */
  async get_text(type) {
    if ("crumb" == type) {
      return this.get_property_value("uid");
    }
    return await super.get_text(type);
  }

  /**
   * Extend parent method
   */
  get_selector_child_list() {
    const qnaire_action = this.get_model().get_parent_model().get_action();
    const repeated = qnaire_action.get_property_value_for_record("repeated");
    const stages = qnaire_action.get_property_value("stages");
    const has_devices = qnaire_action.get_property_value("has_devices");
    const sends_mail = qnaire_action.get_property_value("sends_mail");
    return super.get_selector_child_list().filter(child =>
      ("response" == child.model.get_name() && null != repeated) ||
      ("respondent_mail" == child.model.get_name() && sends_mail) ||
      ("response_stage" == child.model.get_name() && null == repeated && stages) ||
      ("response_attribute" == child.model.get_name() && null == repeated) ||
      ("answer_device" == child.model.get_name() && null == repeated && has_devices)
    );
  }
}

export class CN_list_respondent extends CN_action_list {
  #get_btn_el;
  #export_btn_el;

  update_element() {
    super.update_element();

    const parent_model = this.get_model().get_parent_model();
    if (CN_session.get("setting", "detached") && parent_model) {
      const parent_action = parent_model.get_action();
      const hide = (
        !parent_action.get_property_value("parent_beartooth_url") ||
        !parent_action.get_property_value("parent_username")
      );
      this.constructor.set_hidden(this.#get_btn_el, hide);
      this.constructor.set_hidden(this.#export_btn_el, hide);
    }
  }
  /**
   * Extend parent method
   */
  _create_column_element(col_name, column, record) {
    const el = super._create_column_element(col_name, column, record);

    // highlight the active row
    if ("In Progress" == record.status) el.style.background = "rgb(255, 242, 174)";

    return el;
  }

  /**
   * Extends the parent method
   */
  _create_footer_element() {
    const footer_el = super._create_footer_element();

    const model = this.get_model();
    const parent_model = model.get_parent_model()

    if (CN_session.get("setting", "detached")) {
      this.#get_btn_el = this.constructor.html(`
        <button name="get" type="button" class="btn btn-light btn-outline-primary">
          Get Respondents
        </button>
      `);
      this.constructor.hide(this.#get_btn_el);
      footer_el.querySelector("div.btn-group").append(this.#get_btn_el);
      this.#get_btn_el.addEventListener("click", async () => {
        let error_list = [];
        await this.constructor.wait_for(async() => {
          let path = "respondent?action=get_respondents";
          if (parent_model) path = `${parent_model.get_name()}/${parent_model.get_identifier()}/${path}`;
          const response = await CN_api.post(path, {});
          error_list = response
            .filter(result => 0 < result.fail.length)
            .map(result => `${result.qnaire}: ${result.fail.join(", ")}`);
        });

        if (0 < error_list.length) {
          await CN_modal_message.create_and_open({
            header_class: "text-bg-danger",
            title: "Problem Importing Respondents",
            size: "lg",
            message: `
              <div class="pb-2">
                The following respondents could not be imported because there was a problem retrieving
                the mandatory attributes:
              </div>
              <div>
                ${error_list.join("<br/>\n")}
              </div>
            `,
          });
        } else {
          await this.run();
        }
      });

      this.#export_btn_el = this.constructor.html(
        '<button name="export" type="button" class="btn btn-light btn-outline-primary">Export</button>'
      );
      this.constructor.hide(this.#export_btn_el);
      footer_el.querySelector("div.btn-group").append(this.#export_btn_el);
      this.#export_btn_el.addEventListener("click", () => model.export());
    } else {
      const import_btn_el = this.constructor.html(
        '<button name="import" type="button" class="btn btn-light btn-outline-primary">Import</button>'
      );
      footer_el.querySelector("div.btn-group").append(import_btn_el);
      import_btn_el.addEventListener("click", async () => {
        CN_session.navigate_to(parent_model.get_view_url(null).replace(/\/view\//, "/import_responses/"));
      });

      const mass_btn_el = this.constructor.html(
        '<button name="mass" type="button" class="btn btn-light btn-outline-primary">Mass Respondent</button>'
      );
      footer_el.querySelector("div.btn-group").append(mass_btn_el);
      mass_btn_el.addEventListener("click", async () => {
        CN_session.navigate_to(parent_model.get_view_url(null).replace(/\/view\//, "/mass_respondent/"));
      });
    }

    return footer_el;
  }
}

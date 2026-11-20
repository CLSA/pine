const { CN_action_list } = await import(`${CENOZO_URL}/js/action/list.mjs`);
const { CN_action_view } = await import(`${CENOZO_URL}/js/action/view.mjs`);
const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);
const { CN_modal_confirm } = await import(`${CENOZO_URL}/js/modal/confirm.mjs`);
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
          is_hidden: () => {
            const qnaire_model = this.get_parent_model();
            return (
              null == qnaire_model ||
              !qnaire_model.get_action().get_property_value("stages") ||
              qnaire_model.get_action().get_property_value_for_record("repeated")
            );
          },
        },
        language: {
          column: "language.name",
          title: "Language",
          is_hidden: () => {
            const qnaire_model = this.get_parent_model();
            return (
              null == qnaire_model ||
              qnaire_model.get_action().get_property_value_for_record("repeated")
            );
          },
        },
        response_count: {
          title: "Responses",
          is_hidden: () => {
            const qnaire_model = this.get_parent_model();
            return (
              null == qnaire_model ||
              qnaire_model.get_action().get_property_value_for_record("repeated")
            );
          },
        },
        status: { title: "Status", table_prefix: false },
        qnaire_progress: {
          title: "Progress",
          table_prefix: false,
          is_hidden: () => {
            const qnaire_model = this.get_parent_model();
            return (
              null == qnaire_model ||
              qnaire_model.get_action().get_property_value_for_record("repeated")
            );
          },
        },
        start_datetime: { column: "respondent.start_datetime", title: "Start Date", type: "datetime" },
        end_datetime: { column: "respondent.end_datetime", title: "End Date", type: "datetime" },
        qnaire_id: { is_hidden: () => true },
      },
      // sort by start datetime when showing the respondent list on the home page
      get_default_order: () => CN_session.get_root_model() ? "uid" : { column: "start_datetime", desc: true },
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
            const qnaire_model = this.get_parent_model();
            return (
              "view" != this.get_action_name() ||
              qnaire_model.get_action().get_property_value_for_record("repeated") ||
              !this.get_action().get_property_value("current_response_id")
            );
          },
        },
        current_response_id: { meta: { table: "response", column: "id" }, is_hidden: () => true },
        uid: { meta: { table: "participant", column: "uid" }, is_hidden: () => true },
        has_attributes: { meta: {}, type: "boolean", is_hidden: () => true },
      },
    });
  }

  /**
   * Extend parent method
   */
  allow_add() {
    const qnaire_model = this.get_parent_model();
    return super.allow_add() && qnaire_model && "qnaire" == qnaire_model.get_name();
  }

  /**
   * Extend parent method
   */
  async export(respondent_id = null) {
    let response = null;
    const action = this.get_action();
    await action.wait_for(async() => {
      const qnaire_model = this.get_parent_model();
      const path = (
        qnaire_model ? `${qnaire_model.get_view_url(null, "api")}/` : ""
      ) + `respondent${respondent_id ? `/${respondent_id}` : ""}?action=export`;
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

  /**
   * Extend parent method
   */
  get_child_model_list() {
    const root_model = CN_session.get_root_model();
    if ("qnaire" != root_model.get_name()) return super.get_child_model_list();

    const qnaire_action = root_model.get_action();
    const repeated = null != qnaire_action.get_property_value_for_record("repeated");
    const stages = qnaire_action.get_property_value("stages");
    const has_devices = qnaire_action.get_property_value("has_devices");
    const sends_mail = qnaire_action.get_property_value("sends_mail");
    return super.get_child_model_list().filter(model =>
      ("response" == model.get_name() && repeated) ||
      ("respondent_mail" == model.get_name() && sends_mail) ||
      ("response_stage" == model.get_name() && !repeated && stages) ||
      ("response_attribute" == model.get_name() && !repeated) ||
      ("answer_device" == model.get_name() && !repeated && has_devices)
    );
  }
}

export class CN_list_respondent extends CN_action_list {
  #today_only = false;
  #get_respondents_btn_el;
  #export_btn_el;

  get_today_only() { return this.#today_only; }
  set_today_only(today_only) { this.#today_only = today_only; }

  /**
   * Extend parent method
   */
  async get_text(type) {
    let text = await super.get_text(type);

    // alter the header when only showing today's respondents
    if ("header" == type && this.#today_only) text = `Today's ${text}`;

    return text;
  }

  /**
   * Extend parent method
   */
  async on_row_click(record) {
    if (!this.is_choosing() && null == CN_session.get_root_model()) {
      // we need to build the full path if the model is showing on the home page
      await CN_session.navigate_to(`qnaire/view/${record.qnaire_id}/${this.get_model().get_view_url(record.id)}`);
    } else {
      await super.on_row_click(record);
    }
  }

  /**
   * Extend parent method
   */
  update_element() {
    super.update_element();

    const qnaire_model = this.get_model().get_parent_model();
    const qnaire_action = qnaire_model ? qnaire_model.get_action() : null;

    // show/hide action buttons
    const hide = CN_session.get_root_model() && (
      !qnaire_action ||
      !qnaire_action.get_property_value("parent_beartooth_url") ||
      !qnaire_action.get_property_value("parent_username")
    );
    if (this.#get_respondents_btn_el) this.constructor.set_hidden(this.#get_respondents_btn_el, hide);
    if (this.#export_btn_el) this.constructor.set_hidden(this.#export_btn_el, hide);
  }

  /**
   * Extend parent method
   */
  get_on_load_parameters() {
    const params = super.get_on_load_parameters();

    // restrict respondent lists shown on the home page to non closed qnaires
    if (null == CN_session.get_root_model()) {
      params.modifier.where.push({ column: "qnaire.closed", operator: "=", value: false });
    }

    if (this.#today_only) {
      const date = CN_common.get_date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      const start_date = CN_common.format_datetime(date, "record");
      date.setDate(date.getDate() + 1);
      const end_date = CN_common.format_datetime(date, "record");
      params.modifier.where.push({ column: "respondent.start_datetime", operator: ">=", value: start_date });
      params.modifier.where.push({ column: "respondent.start_datetime", operator: "<", value: end_date });
    }

    return params;
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
   * Extend parent method
   */
  _create_footer_element() {
    const footer_el = super._create_footer_element();

    const model = this.get_model();
    const qnaire_model = model.get_parent_model();

    if (!this.#today_only) {
      if (CN_session.get("setting", "detached")) {
        if (["administrator", "interviewer"].includes(CN_session.get("role", "name"))) {
          this.#get_respondents_btn_el = this.constructor.html(
            '<button type="button" class="btn btn-light btn-outline-primary d-none">Get Respondents</button>'
          );
          this.constructor.hide(this.#get_respondents_btn_el);
          footer_el.querySelector("div.btn-group").append(this.#get_respondents_btn_el);
          this.#get_respondents_btn_el.addEventListener("click", async () => {
            // TODO: test
            let error_list = [];
            await this.constructor.wait_for(async() => {
              const response = await CN_api.post(
                (qnaire_model ? `${qnaire_model.get_view_url(null, "api")}/` : "") +
                "respondent?action=get_respondents",
                {}
              );
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
            '<button type="button" class="btn btn-light btn-outline-primary d-none">Export</button>'
          );
          this.constructor.hide(this.#export_btn_el);
          footer_el.querySelector("div.btn-group").append(this.#export_btn_el);
          this.#export_btn_el.addEventListener("click", () => model.export()); // TODO: test
        }
      } else { // not detached
        if ("administrator" <= CN_session.get("role", "name") && qnaire_model) {
          const import_btn_el = this.constructor.html(
            '<button type="button" class="btn btn-light btn-outline-primary">Import</button>'
          );
          footer_el.querySelector("div.btn-group").append(import_btn_el);
          import_btn_el.addEventListener("click", () => CN_session.navigate_to(
            qnaire_model.get_view_url(null).replace(/qnaire\/view/, "qnaire/import_responses")
          ));

          const mass_btn_el = this.constructor.html(
            '<button type="button" class="btn btn-light btn-outline-primary">Mass Respondent</button>'
          );
          footer_el.querySelector("div.btn-group").append(mass_btn_el);
          mass_btn_el.addEventListener("click", () => CN_session.navigate_to(
            qnaire_model.get_view_url(null).replace(/qnaire\/view/, "qnaire/mass_respondent")
          ));
        }
      }
    }

    return footer_el;
  }
}

export class CN_view_respondent extends CN_action_view {
  #qnaire_reports = {};
  #export_btn_el;
  #reexport_btn_el;
  #display_btn_el;
  #download_report_btn_el;
  #reopen_btn_el;
  #update_attributes_btn_el;
  #launch_btn_el;
  #reschedule_email_btn_el;

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
  async on_load() {
    const [load, qnaire_report_response] = await Promise.all([
      super.on_load(),
      CN_api.get(`${this.get_model().get_parent_model().get_view_url(null, "api")}/qnaire_report`, {
        select: { column: ["title", "language_id"] },
      }),
    ]);
    qnaire_report_response.forEach(report => { this.#qnaire_reports[report.language_id] = report.title; });
  }

  /**
   * Extend parent method
   */
  update_element() {
    super.update_element();

    const qnaire_action = this.get_model().get_parent_model().get_action();

    // show/hide action buttons
    const exported = "Exported" == this.get_property_value("status");
    const completed = null != this.get_property_value_for_record("end_datetime");
    const repeated = null != qnaire_action.get_property_value_for_record("repeated");
    const has_attributes = this.get_property_value("has_attributes");
    const language_id = this.get_property_value("language_id");
    const stages = qnaire_action.get_property_value("stages");
    const sends_mail = qnaire_action.get_property_value("sends_mail");
    const bt = (
      qnaire_action.get_property_value("parent_beartooth_url") &&
      qnaire_action.get_property_value("parent_username")
    );
    if (this.#export_btn_el) this.constructor.set_hidden(this.#export_btn_el, !bt && !exported && completed);
    if (this.#reexport_btn_el) this.constructor.set_hidden(this.#reexport_btn_el, !bt && exported);

    this.constructor.set_hidden(this.#display_btn_el, repeated);
    this.constructor.set_hidden(this.#download_report_btn_el, !this.#qnaire_reports[language_id]);
    this.constructor.set_hidden(this.#reopen_btn_el, stages || !completed);
    this.constructor.set_hidden(this.#update_attributes_btn_el, !has_attributes || completed);
    this.constructor.set_hidden(this.#launch_btn_el, !stages && completed);
    this.constructor.set_hidden(this.#reschedule_email_btn_el, !sends_mail);
  }

  /**
   * Extend parent method
   */
  _create_footer_element() {
    const footer_el = super._create_footer_element();
    const left_btn_group_el = footer_el.querySelector("div[name=left-btn-group]");
    const model = this.get_model();

    if (CN_session.get("setting", "detached")) {
      if (3 <= CN_session.get("role", "tier")) {
        this.#reexport_btn_el = this.constructor.html(`
          <button type="button" class="btn btn-light btn-outline-primary d-none">Re-Export</button>
        `);
        this.constructor.hide(this.#reexport_btn_el);
        footer_el.querySelector("div.btn-group").append(this.#reexport_btn_el);
        this.#reexport_btn_el.addEventListener("click", () => model.export(model.get_identifier())); // TODO: test
      }

      this.#export_btn_el = this.constructor.html(
        '<button type="button" class="btn btn-light btn-outline-primary d-none">Export</button>'
      );
      this.constructor.hide(this.#export_btn_el);
      footer_el.querySelector("div.btn-group").append(this.#export_btn_el);
      this.#export_btn_el.addEventListener("click", () => model.export(model.get_identifier())); // TODO: test
    }

    this.#display_btn_el = this.constructor.html(
      '<button type="button" class="btn btn-light btn-outline-primary d-none">Display</button>'
    );
    this.constructor.hide(this.#display_btn_el);
    footer_el.querySelector("div.btn-group").append(this.#display_btn_el);
    this.#display_btn_el.addEventListener("click", () => CN_session.navigate_to(
      `${model.get_view_url(null)}/response/display/${this.get_property_value("current_response_id")}`
    ));

    this.#download_report_btn_el = this.constructor.html(
      '<button type="button" class="btn btn-light btn-outline-primary d-none">Download Report</button>'
    );
    this.constructor.hide(this.#download_report_btn_el);
    footer_el.querySelector("div.btn-group").append(this.#download_report_btn_el);
    this.#download_report_btn_el.addEventListener("click", async () => {
      await this.constructor.wait_for(async () => {
        const response = await CN_api.file(
          `response/${this.get_property_value("current_response_id")}`,
          "application/pdf",
          {},
          true
        );
        CN_common.download_file(
          await response.blob(),
          response.headers.get('content-disposition').match(/filename=(.*);/)[1]
        );
      });
    });

    this.#reopen_btn_el = this.constructor.html(
      '<button type="button" class="btn btn-light btn-outline-primary d-none">Re-Open</button>'
    );
    this.constructor.hide(this.#reopen_btn_el);
    footer_el.querySelector("div.btn-group").append(this.#reopen_btn_el);
    this.#reopen_btn_el.addEventListener("click", async () => {
      await CN_api.patch(`respondent/${model.get_identifier()}?action=reopen`, {});
      await this.run();
    });

    this.#update_attributes_btn_el = this.constructor.html(
      '<button type="button" class="btn btn-light btn-outline-primary d-none">Update Attributes</button>'
    );
    this.constructor.hide(this.#update_attributes_btn_el);
    footer_el.querySelector("div.btn-group").append(this.#update_attributes_btn_el);
    this.#update_attributes_btn_el.addEventListener("click", async () => {
      const response = await CN_modal_confirm.create_and_open({
        title: "Update Attributes",
        message: `
          Are you sure you wish to replace all existing attributes?
          <br\>
          <br\>
          This should only be done if there is a problem with the existing attributes that needs to be corrected.
        `,
      });

      if (response) {
        await CN_api.patch(`respondent/${model.get_identifier()}?action=update_attributes`, {});
        await this.run(true); // reload the attribute child list as well
      }
    });

    this.#launch_btn_el = this.constructor.html(
      '<button type="button" class="btn btn-light btn-outline-primary d-none">Launch</button>'
    );
    this.constructor.hide(this.#launch_btn_el);
    footer_el.querySelector("div.btn-group").append(this.#launch_btn_el);
    this.#launch_btn_el.addEventListener("click", () => CN_session.navigate_to(
      `respondent/run/${this.get_property_value("token")}`,
      { show_hidden: 1 }
    ));

    this.#reschedule_email_btn_el = this.constructor.html(
      '<button type="button" class="btn btn-light btn-outline-primary d-none">Re-Schedule Email</button>'
    );
    this.constructor.hide(this.#reschedule_email_btn_el);
    footer_el.querySelector("div.btn-group").append(this.#reschedule_email_btn_el);
    this.#reschedule_email_btn_el.addEventListener("click", async () => {
      await CN_api.patch(`respondent/${model.get_identifier()}?action=resend_mail`, {});
      await this.run(true); // reload the mail child list as well
    });

    return footer_el;
  }
}

const { CN_action_list } = await import(`${CENOZO_URL}/js/action/list.mjs`);
const { CN_action_view } = await import(`${CENOZO_URL}/js/action/view.mjs`);
const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
const { CN_base_action } = await import(`${CENOZO_URL}/js/action/base_action.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);
const { CN_element_card } = await import(`${CENOZO_URL}/js/element/card.mjs`);
const { CN_element_label } = await import(`${CENOZO_URL}/js/element/label.mjs`);
import { CN_element_qnaire_navigator } from "../element/qnaire_navigator.mjs"
const { CN_input_enum } = await import(`${CENOZO_URL}/js/input/enum.mjs`);
const { CN_input_file } = await import(`${CENOZO_URL}/js/input/file.mjs`);
const { CN_input_string } = await import(`${CENOZO_URL}/js/input/string.mjs`);
const { CN_modal_input } = await import(`${CENOZO_URL}/js/modal/input.mjs`);
const { CN_modal_message } = await import(`${CENOZO_URL}/js/modal/message.mjs`);
const { CN_session } = await import(`${CENOZO_URL}/js/session.mjs`);

export class CN_model_qnaire extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "questionnaire",
        plural: "questionnaires",
        posessive: "questionnaire's",
      },
      columns: {
        name: { column: "qnaire.name", title: "Name" },
        version: { title: "Version" },
        closed: {
          title: "Closed",
          type: "boolean",
          is_hidden: () => "interviewer" == CN_session.get("role", "name"),
        },
        debug: {
          title: "Debug Mode",
          type: "boolean",
          is_hidden: () => "interviewer" == CN_session.get("role", "name"),
        },
        readonly: {
          title: "Read-Only",
          type: "boolean",
          is_hidden: () => "interviewer" == CN_session.get("role", "name"),
        },
        anonymous: { title: "Anonymous", type: "boolean" },
        stages: {
          title: "Use Stages",
          type: "boolean",
          is_hidden: () => "interviewer" == CN_session.get("role", "name"),
        },
        repeat_detail: {
          title: "Repeated",
          table_prefix: false,
          is_hidden: () => "interviewer" == CN_session.get("role", "name"),
        },
        max_responses: {
          title: "Max Responses",
          is_hidden: () => "interviewer" == CN_session.get("role", "name"),
        },
        module_count: { title: "Modules", table_prefix: false },
        respondent_count: { title: "Participants", table_prefix: false },
      },
      properties: {
        name: {
          title: "Name",
          format: "identifier",
          is_constant: () => "view" == this.get_action_name() && this.get_action().get_property_value("readonly"),
        },
        version: {
          title: "Version",
          is_constant: () => "view" == this.get_action_name() && this.get_action().get_property_value("readonly"),
        },
        variable_suffix: {
          title: "Variable Suffix",
          is_hidden: () => "interviewer" == CN_session.get("role", "name"),
          is_constant: () => "view" == this.get_action_name() && this.get_action().get_property_value("readonly"),
        },
        base_language_id: {
          title: "Base Language",
          type: "enum",
          enum: {
            path: "language",
            modifier: {
              where: { column: "active", operator: "=", value: true },
              order: "language.name",
            },
          },
          is_hidden: () => "interviewer" == CN_session.get("role", "name"),
          is_constant: () => "view" == this.get_action_name() && this.get_action().get_property_value("readonly"),
        },
        average_time: {
          meta: {}, // defined by the service
          title: "Average Time",
          type: "timesecond",
          is_constant: () => true,
          is_hidden: () => "add" == this.get_action_name(),
        },
        debug: {
          title: "Debug Mode",
          type: "boolean",
          is_hidden: () => "interviewer" == CN_session.get("role", "name"),
          is_constant: () => "view" == this.get_action_name() && this.get_action().get_property_value("readonly"),
        },
        readonly: {
          title: "Read Only",
          type: "boolean",
          is_hidden: () => "add" == this.get_action_name() || "interviewer" == CN_session.get("role", "name"),
        },
        anonymous: {
          title: "Anonymous Respondents Allowed",
          type: "boolean",
          is_hidden: () => "add" == this.get_action_name() || this.get_action().get_property_value("stages"),
        },
        anonymous_url: {
          meta: {}, // defined by the service
          title: "Anonymous URL",
          is_constant: () => true,
          is_hidden: () => "add" == this.get_action_name() || !this.get_action().get_property_value("anonymous"),
        },
        show_progress: {
          title: "Show Progress Bar",
          type: "boolean",
          help: "Whether to show the progress bar to the respondent.",
          is_hidden: () => "interviewer" == CN_session.get("role", "name"),
        },
        allow_in_hold: {
          title: "Allow when in Hold",
          type: "boolean",
          is_hidden: () => "add" == this.get_action_name() || "interviewer" == CN_session.get("role", "name"),
          help: "Whether to allow participants who are in a final hold to answer the questionnaire.",
        },
        problem_report: {
          title: "Enable Problem Reports",
          type: "boolean",
          is_hidden: () => "interviewer" == CN_session.get("role", "name"),
          help: 'Whether to enable the "Report Problem" button when running a questionnaire.',
        },
        attributes_mandatory: {
          title: "Attributes Mandatory",
          type: "boolean",
          is_hidden: () => "interviewer" == CN_session.get("role", "name"),
          help: "Whether to not allow a response to proceed if the attributes failed to load.",
        },
        stages: {
          title: "Stages",
          type: "boolean",
          is_hidden: () =>
            "add" == this.get_action_name() ||
            "interviewer" == CN_session.get("role", "name") ||
            this.get_action().get_property_value("anonymous") ||
            this.get_action().get_property_value("readonly"),
        },
        closed: {
          title: "Closed",
          type: "boolean",
          is_hidden: () => "add" == this.get_action_name() || "interviewer" == CN_session.get("role", "name"),
        },
        token_regex: {
          title: "Token Regex",
          help: "A regular expression that restricts the format of tokens when in stage-mode.",
          is_hidden: () => "add" == this.get_action_name() || "interviewer" == CN_session.get("role", "name"),
        },
        token_check: {
          title: "Token Check",
          type: "boolean",
          help: "Whether to check the token at check-in and before launching a stage.",
          is_hidden: () => "add" == this.get_action_name() || "interviewer" == CN_session.get("role", "name"),
        },
        description: {
          title: "Description",
          type: "text",
          is_constant: () => "view" == this.get_action_name() && this.get_action().get_property_value("readonly"),
        },
        note: {
          title: "Note",
          type: "text",
          is_constant: () => "view" == this.get_action_name() && this.get_action().get_property_value("readonly"),
        },
        email_communication: {
          title: "Email Communication",
          properties: {
            email_invitation: {
              title: "Send Invitation Email",
              type: "boolean",
              is_hidden: () => "interviewer" == CN_session.get("role", "name"),
              is_constant: () =>
                "view" == this.get_action_name() &&
                this.get_action().get_property_value("readonly"),
            },
            email_from_name: {
              title: "Email From Name",
              is_hidden: () => "interviewer" == CN_session.get("role", "name"),
              is_constant: () =>
                "view" == this.get_action_name() &&
                this.get_action().get_property_value("readonly"),
            },
            email_from_address: {
              title: "Email From Address",
              type: "email",
              is_hidden: () => "interviewer" == CN_session.get("role", "name"),
              is_constant: () =>
                "view" == this.get_action_name() &&
                this.get_action().get_property_value("readonly"),
            },
          },
        },
        repeated_qnaires: {
          title: "Repeated Questionnaires",
          properties: {
            repeated: {
              title: "Repeated",
              type: "enum",
              is_hidden: () => "interviewer" == CN_session.get("role", "name"),
              is_constant: () =>
                "view" == this.get_action_name() &&
                this.get_action().get_property_value("readonly"),
            },
            repeat_offset: {
              title: "Repeat Offset",
              type: "integer",
              is_constant: () =>
                "view" == this.get_action_name() &&
                this.get_action().get_property_value("readonly"),
              is_hidden: () =>
                "interviewer" == CN_session.get("role", "name") ||
                "add" == this.get_action_name() ||
                !this.get_action().get_property_value("repeated"),
            },
            max_responses: {
              title: "Maximum Number of Responses",
              type: "integer",
              is_constant: () =>
                "view" == this.get_action_name() &&
                this.get_action().get_property_value("readonly"),
              is_hidden: () =>
                "interviewer" == CN_session.get("role", "name") ||
                "add" == this.get_action_name() ||
                !this.get_action().get_property_value("repeated"),
              help: "If set to 0 then there will be no maximum number of responses",
            },
          },
        },
        detached_settings: {
          title: "Detached Settings",
          is_hidden: () =>
            "interviewer" == CN_session.get("role", "name") ||
            !CN_session.get("setting", "detached"),
          properties: {
            parent_beartooth_url: {
              title: "Parent Beartooth URL",
              help: `
                The base Beartooth URL to fetch appointments from.<br/>
                WARNING: this information is never included in the import/export process. It must be set
                in every instance independently!
              `,
            },
            parent_username: {
              title: "Parent Username",
              help: `
                The parent server's interviewing instance username.<br/>
                WARNING: this information is never included in the import/export process. It must be set
                in every instance independently!
              `,
            },
            parent_password: {
              title: "Parent Password",
              help: `
                The parent server's interviewing instance password.<br/>
                WARNING: this information is never included in the import/export process. It must be set
                in every instance independently!
              `,
            },
            appointment_type: {
              title: "Appointment Type",
              help: `
                This can be used to restrict the list of appointments from Beartooth by appointment type.<br/>
                WARNING: this information is never included in the import/export process. It must be set
                in every instance independently!
              `,
            },
          },
        },
        has_devices: { meta: {}, type: "boolean", is_hidden: () => true },
        sends_mail: { meta: {}, type: "boolean", is_hidden: () => true },
        first_page_id: { meta: {}, type: "boolean", is_hidden: () => true },
      },
    });
  }
}

export class CN_clone_qnaire extends CN_base_action {
  #qnaire_name = null;
  #operation_form_input;
  #name_form_input;

  constructor(parent_el, model) {
    super("clone", parent_el, model);
  }

  /**
   * Extend parent method
   */
  async get_text(type) {
    if ("crumb" == type) {
      return `${this.#qnaire_name}: Export`;
    }

    if ("header" == type) {
      return `Copy/Export "${this.#qnaire_name}" Questionnaire`;
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
    this.#qnaire_name = response.name;
  }

  /**
   * Extend parent method
   */
  _create_body_element() {
    const body_el = this.constructor.html(`
      <div class="text-info-emphasis">
        <div class="pb-2">
          This utility can be used to copy, export or print the questionnaire.
        </div>
        <div name="operation" class="row py-1"></div>
        <div name="name" class="row py-1"></div>
      </div>
    `);

    const operation_el = body_el.querySelector("div[name=operation]");
    const name_el = body_el.querySelector("div[name=name]");

    CN_element_label.append(operation_el, { for: "operation", value: "Operation", class: "col-sm-3" });
    this.#operation_form_input = CN_input_enum.append(operation_el, {
      id: "operation",
      class: "col-sm-9",
      required: true,
      get_default: () => "clone",
      enum: {
        values: [
          { key: "clone", value: "Copy Questionnaire" },
          { key: "export", value: "Export Questionnaire" },
          { key: "print", value: "Print Questionnaire" },
        ],
      },
      on_change: async (form_input) => this.constructor.set_hidden(name_el, "clone" != form_input.get_value()),
    });

    CN_element_label.append(name_el, { for: "name", value: "Name", class: "col-sm-3" });
    this.#name_form_input = CN_input_string.append(name_el, {
      id: "name",
      class: "col-sm-9",
      required: true,
    });

    return body_el;
  }

  /**
   * Extend parent method
   */
  _create_footer_element() {
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

    footer_el.querySelector("button[name=proceed]").addEventListener("click", async () => {
      const operation = this.#operation_form_input.get_value();
      const qnaire_id = this.get_model().get_identifier();

      // make sure the name is set when cloning
      if ("clone" == operation && !await this.#name_form_input.validate()) return;

      try {
        await this.constructor.wait_for(async () => {
          if ("clone" == operation) {
            const response = await CN_api.post(`qnaire?clone=${qnaire_id}`, {
              name: this.#name_form_input.get_value()
            });
            await CN_session.navigate_to(this.get_model().get_view_url(response));
          } else if ("export" == operation) {
            const response = await CN_api.file(
              `qnaire/${qnaire_id}`,
              "application/json",
              { output: "export" },
              true
            );
            CN_common.download_file(await response.blob(), `${this.#qnaire_name}.json`);
          } else if ("print" == operation) {
            const response = await CN_api.file(
              `qnaire/${qnaire_id}`,
              "text/plain",
              { output: "print" },
              true
            );
            CN_common.download_file(
              await response.blob(),
              response.headers.get('content-disposition').match(/filename=(.*);/)[1],
            );
          }
        }, 0);
      } catch (error) {
        if (CN_common.is_uri_error(error, 409)) {
          this.#name_form_input.show_error("Conflicts with existing record", 0);
        } else {
          throw error;
        }
      }
    });

    return footer_el;
  }
}

export class CN_list_qnaire extends CN_action_list {
  /**
   * Extends the parent method
   */
  _create_footer_element() {
    const footer_el = super._create_footer_element();

    const import_btn_el = this.constructor.html(
      '<button name="import" type="button" class="btn btn-light btn-outline-primary">Import</button>'
    );
    footer_el.querySelector("div.btn-group").append(import_btn_el);
    import_btn_el.addEventListener("click", async () => {
      const file = await CN_modal_input.create_and_open({
        title: "Import Questionnaire",
        message: "Please provide a JSON (.json) file containing an exported Pine Questionnaire",
        input: {
          type: "file",
          file: {
            encoding: "text",
            mime_type: "application/json",
          },
          required: true,
        }
      });

      if (!file) return;

      try {
        await this.constructor.wait_for(async () => {
          const response = await CN_api.post("qnaire?import=1", file, true);
          await CN_session.navigate_to(this.get_model().get_view_url(response));
        }, 0);
      } catch (error) {
        throw error;
      }
    });

    return footer_el;
  }
}

export class CN_patch_qnaire extends CN_base_action {
  #qnaire_name = null;
  #operation_form_input;
  #differences = null;
  #patch_file = null;

  constructor(parent_el, model) {
    super("patch", parent_el, model);
  }

  /**
   * Extend parent method
   */
  async get_text(type) {
    if ("crumb" == type) {
      return `${this.#qnaire_name}: Patch`;
    }

    if ("header" == type) {
      return `Patch "${this.#qnaire_name}" Questionnaire`;
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
    this.#qnaire_name = response.name;
  }

  /**
   * Extend parent method
   */
  update_element() {
    super.update_element();

    function add_group(parent_el, top_group, header, body = null) {
      const card = CN_element_card.append(parent_el, {
        class: top_group ? "mt-2" : "",
        header: header,
        body: body,
      });
      const card_el = card.get_element();
      const card_header_el = card_el.querySelector("div.card-header");
      const card_body_el = card_el.querySelector("div.card-body");

      card_el.classList.remove("container-fluid");
      card_el.classList.remove("mb-2");
      card_header_el.classList.remove("text-bg-primary");
      card_header_el.classList.add(`text-bg-${top_group ? "secondary" : "light"}`);

      return card.get_element();
    }

    function add_prop(parent_el, property, value) {
      const title = CN_common.uc_words(property.replace(/_/g, " ")).replace(/^Qnaire /, "");
      const row_el = CN_base_action.html('<div class="row"></div>');
      CN_element_label.append(row_el, { value: title, class: "col-3 pt-0 pb-1" });
      row_el.append(CN_base_action.html(`
        <div class="col-9">
          ${
            null == value ? "(empty)" :
            CN_common.is_boolean(value) ? (value ? "Yes" : "No") :
            value
          }
        </div>
      `));
      parent_el.append(row_el);
    }

    function add_diffs(parent_el, diffs) {
      for (const property in diffs) {
        const diff = diffs[property];
        if (CN_common.is_object(diff)) {
          const title = CN_common.uc_words(property.replace(/_/g, " ")).replace(/^Qnaire /, "");
          parent_el.append(CN_base_action.html(`<div class="mt-3 fw-bold">${title}</div>`));

          if (diff.add) {
            const op_group = add_group(parent_el, false, "ADD:", "");
            op_group.querySelector("div.card-header").classList.remove("fs-5");
            const op_parent_el = op_group.querySelector("div.card-body");
            diff.add.forEach(item => Object.keys(item).forEach(p => add_prop(op_parent_el, p, item[p])));
          }

          if (diff.change) {
            for (const p in diff.change) {
              const op_group = add_group(parent_el, false, `CHANGE: ${p}`, "");
              op_group.querySelector("div.card-header").classList.remove("fs-5");
              add_diffs(op_group.querySelector("div.card-body"), diff.change[p]);
            }
          }

          if (diff.remove) {
            const op_group = add_group(parent_el, false, `REMOVE: ${diff.remove.join(", ")}`);
            op_group.querySelector("div.card-header").classList.remove("fs-5");
          }
        } else {
          add_prop(parent_el, property, diff);
        }
      }
    }

    this.constructor.set_disabled(
      this.get_footer_element().querySelector("button[name=proceed]"),
      null == this.#differences || 0 == Object.keys(this.#differences).length
    );

    const differences_el = this.get_body_element().querySelector("div[name=differences]");

    differences_el.innerHTML = "";
    if (CN_common.is_object(this.#differences)) {
      const group = add_group(differences_el, true, "Patch Summary", "");
      const group_body_el = group.querySelector("div.card-body");

      if (0 == Object.keys(this.#differences).length) {
        group_body_el.innerHTML = "No differences found.";
      } else {
        add_diffs(group_body_el, this.#differences);
      }
    }
  }

  /**
   * Extend parent method
   */
  _create_body_element() {
    const body_el = this.constructor.html(`
      <div class="text-info-emphasis">
        <div name="operation" class="row py-1"></div>
        <div name="differences"></div>
      </div>
    `);

    const operation_el = body_el.querySelector("div[name=operation]");
    const name_el = body_el.querySelector("div[name=name]");

    CN_element_label.append(operation_el, { for: "operation", value: "Patch File", class: "col-sm-3" });
    this.#operation_form_input = CN_input_file.append(operation_el, {
      id: "operation",
      class: "col-sm-9",
      required: true,
      file: {
        encoding: "text",
        mime_type: "application/json",
      },
      hide_download: true,
      on_change: async (form_input) => {
        try {
          await this.constructor.wait_for(async () => {
            this.#patch_file = await CN_common.convert_from_blob("text", form_input.get_value()[0]);
            this.#differences = await CN_api.patch(
              `${this.get_model().get_view_url(null, "api")}?patch=check`,
              this.#patch_file,
              true
            );
          });
        } catch (error) {
          this.#patch_file = null;
          this.#differences = null;
          throw error;
        } finally {
          this.update_element();
        }
      },
    });

    return body_el;
  }

  /**
   * Extend parent method
   */
  _create_footer_element() {
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

    footer_el.querySelector("button[name=proceed]").addEventListener("click", async () => {
      const operation = this.#operation_form_input.get_value();
      const qnaire_id = this.get_model().get_identifier();

      // make sure the name is set when cloning
      try {
        await this.constructor.wait_for(async () => {
          this.#differences = await CN_api.patch(
            `${this.get_model().get_view_url(null, "api")}?patch=apply`,
            this.#patch_file,
            true
          );
        });
        CN_session.navigate_to(this.get_model().get_view_url());
      } catch (error) {
        throw error;
      }
    });

    return footer_el;
  }
}

export class CN_view_qnaire extends CN_action_view {
  #qnaire_navigator;

  /**
   * Extend parent method
   */
  get_selector_child_list() {
    const role = CN_session.get("role", "name");
    const stages = this.get_property_value("stages");
    const stages_child_list = ["deviation_type", "device", "qnaire_consent_type_confirm", "stage"];
    const interviewer_child_list = ["qnaire_document", "respondent"];
    return super.get_selector_child_list().filter(child =>
      // some children should only show in qnaires with stages
      (stages || !stages_child_list.includes(child.model.get_name())) &&
      // interviewers only see specific children
      ("interviewer" != role || interviewer_child_list.includes(child.model.get_name()))
    );
  }

  /**
   * Extend parent method
   */
  update_element() {
    super.update_element();

    if (!this.#qnaire_navigator) this.#qnaire_navigator = CN_element_qnaire_navigator.prepend(this.get_element());
    this.#qnaire_navigator.update_element();
  }

  /**
   * Extends the parent method
   */
  _create_footer_element() {
    const footer_el = super._create_footer_element();

    const left_btn_group_el = footer_el.querySelector("div[name=left-btn-group]");

    const preview_btn_el = this.constructor.html(
      '<button name="preview" type="button" class="btn btn-light btn-outline-primary">Preview</button>'
    );
    left_btn_group_el.append(preview_btn_el);
    preview_btn_el.addEventListener(
      "click",
      () => CN_session.navigate_to(`page/render/${this.get_property_value("first_page_id")}`),
    );

    const export_btn_el = this.constructor.html(
      '<button name="export" type="button" class="btn btn-light btn-outline-primary">Export</button>'
    );
    left_btn_group_el.append(export_btn_el);
    export_btn_el.addEventListener(
      "click",
      () => CN_session.navigate_to(`qnaire/clone/${this.get_model().get_identifier()}`),
    );

    const patch_btn_el = this.constructor.html(
      '<button name="patch" type="button" class="btn btn-light btn-outline-primary">Patch</button>'
    );
    left_btn_group_el.append(patch_btn_el);
    patch_btn_el.addEventListener(
      "click",
      () => CN_session.navigate_to(`qnaire/patch/${this.get_model().get_identifier()}`),
    );

    return footer_el;
  }
}

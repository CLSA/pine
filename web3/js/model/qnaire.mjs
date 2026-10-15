const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
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
        first_page_id: { meta: {}, is_hidden: () => true },
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
      },
    });
  }
}

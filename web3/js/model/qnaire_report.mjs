const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);

export class CN_model_qnaire_report extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "report",
        plural: "reports",
        posessive: "report's",
      },
      columns: {
        language: { title: "Language", column: "language.name" },
      },
      properties: {
        language_id: {
          title: "Language",
          type: "enum",
          enum: {
            path: "language",
            modifier: {
              where: { column: "active", operator: "=", value: true },
              order: "language.name",
            },
          },
          is_constant: () => "view" == this.get_action_name,
        },
        title: {
          title: "Title",
          help: "When downloading the report this title will be used as the filename."
        },
        dpi: {
          title: "DPI (resolution in pixels/inch)",
          type: "integer",
          help: "This value is only used when inserting signatures onto the report."
        },
        data: {
          title: "PDF Template",
          type: "file",
          file: {
            encoding: "base64",
            mime_type: "application/pdf",
            get_filename: () => `${this.get_action().get_property_value("title")}.pdf`,
          },
        },
      },
    });
  }
}

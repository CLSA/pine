const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);

export class CN_model_qnaire_document extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "document",
        plural: "documents",
        posessive: "document's",
      },
      columns: {
        name: { title: "Name" },
      },
      get_default_order: () => "language.code",
      properties: {
        name: { title: "Name", format: "identifier" },
        data: {
          title: "PDF File",
          type: "file",
          file: {
            encoding: "base64",
            get_filename: () => `${this.get_action().get_property_value("name")}.pdf`,
          },
          mimeType: "application/pdf",
        },
      },
    });
  }
}

// TODO: when an interviewer views a qnaire_document, override view action with download of file

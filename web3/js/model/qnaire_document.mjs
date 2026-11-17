const { CN_action_list } = await import(`${CENOZO_URL}/js/action/list.mjs`);
const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
const { CN_base_element } = await import(`${CENOZO_URL}/js/element/base_element.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);
const { CN_session } = await import(`${CENOZO_URL}/js/session.mjs`);

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
            mime_type: "application/pdf",
            get_filename: () => `${this.get_action().get_property_value("name")}.pdf`,
          },
          mimeType: "application/pdf",
        },
      },
    });
  }
}

export class CN_list_qnaire_document extends CN_action_list {
  /**
   * Interviewers download when clicking items in the list
   */
  async on_row_click(record) {
    if ("interviewer" != CN_session.get("role", "name") || this.is_choosing()) {
      await super.on_row_click(record);
    } else {
      await CN_base_element.wait_for(async () => {
        const response = await CN_api.get(`qnaire_document/${record.id}`, { select: { column: "data" } });
        CN_common.download_file(response.data.data, `${record.name}.pdf`);
      });
    }
  }
}

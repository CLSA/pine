const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);

export class CN_model_embedded_file extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "embedded file",
        plural: "embedded files",
        posessive: "embedded file's",
      },
      columns: {
        name: { title: "Name", column: "embedded_file.name" },
        mime_type: { title: "Mime Type" },
        size: { title: "Size", type: "size" },
      },
      properties: {
        name: { title: "Name", format: "alpha_num" },
        mime_type: {
          title: "Mime Type",
          is_hidden: () => "add" == this.get_action_name(),
          is_constant: () => true,
        },
        size: {
          title: "File Size",
          type: "size",
          is_hidden: () => "add" == this.get_action_name(),
          is_constant: () => true,
        },
        data: {
          title: "Content",
          type: "file",
          file: {
            encoding: "base64",
            get_filename: async () => {
              const action = this.get_action();
              let name = action.get_property_value("name");
              const mime_type = action.get_property_value("mime_type");
              if (mime_type) {
                const extension = mime_type.match(/[a-zA-Z0-9]+$/);
                if (CN_common.is_array(extension)) name += `.${extension[0]}`;
              }
              return name;
            },
          },
        },
      },
    });
  }
}

const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
const { CN_action_view } = await import(`${CENOZO_URL}/js/action/view.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);
const { CN_modal_message } = await import(`${CENOZO_URL}/js/modal/message.mjs`);

export class CN_model_device extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "device",
        plural: "devices",
        posessive: "device's",
      },
      columns: {
        name: { title: "Name", column: "device.name" },
        url: { title: "URL", column: "device.url" },
        emulate: { title: "Emulate", column: "device.emulate", type: "boolean" },
        form: { title: "Is Form", column: "device.form", type: "boolean" },
      },
      properties: {
        name: { title: "Name", format: "identifier" },
        url: { title: "URL" },
        emulate: { title: "Emulate Mode", type: "boolean" },
        form: {
          title: "Is Form",
          type: "boolean",
          help: "Set to true if the device is a form that needs to be sent to Mastodon's data entry system.",
        },
      },
    });
  }
}

export class CN_view_device extends CN_action_view {
  /**
   * Extend parent method
   */
  _create_footer_element() {
    const footer_el = super._create_footer_element();

    const status_btn_el = this.constructor.html(
      '<button type="button" name="status" class="btn btn-light btn-outline-primary">Check Status</button>'
    );
    status_btn_el.addEventListener("click", this.#get_device_status.bind(this));
    footer_el.querySelector("div.btn-group").append(status_btn_el);

    return footer_el;
  }

  async #get_device_status() {
    let status = null;
    await this.constructor.wait_for(async () => {
      status = await CN_api.get(`device/${this.get_model().get_identifier()}`, { action: "status" });
    });

    await CN_modal_message.create_and_open({
      header_class: CN_common.is_object(status) ? "text-bg-primary" : "text-bg-danger",
      title: `Device Status ${CN_common.is_object(status) ? "(Online)" : "(Offline)"}`,
      html: true,
      message: (
        CN_common.is_object(status) ?
        Object.keys(status).reduce(
          (str, key) => str += `<li>${CN_common.uc_words(key)}: ${status[key]}</li>`,
          "The device responded with the following parameters:<br/><ul>"
        ) + "</ul>" :
        "ERROR: There was no response from the device."
      ),
    });
  }
}

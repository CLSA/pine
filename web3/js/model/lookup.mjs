const { CN_action_upload } = await import(`${CENOZO_URL}/js/action/upload.mjs`);
const { CN_action_view } = await import(`${CENOZO_URL}/js/action/view.mjs`);
const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
const { CN_base_action } = await import(`${CENOZO_URL}/js/action/base_action.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);
const { CN_element_label } = await import(`${CENOZO_URL}/js/element/label.mjs`);
const { CN_input_file } = await import(`${CENOZO_URL}/js/input/file.mjs`);
const { CN_session } = await import(`${CENOZO_URL}/js/session.mjs`);

export class CN_model_lookup extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "lookup",
        plural: "lookups",
        posessive: "lookup's",
      },
      columns: {
        name: { title: "Name" },
        indicator_count: { title: "Indicators" },
        lookup_item_count: { title: "Items" },
        description: { title: "Description" },
      },
      properties: {
        name: { title: "Name", format: "identifier" },
        version: { title: "Version" },
        description: { title: "Description", type: "text" },
      },
    });
  }
}

export class CN_upload_lookup extends CN_action_upload {
  /**
   * Extend parent method
   */
  upload_is_valid() {
    const summary_data = this.get_summary_data();
    return CN_common.is_object(summary_data) && 0 < summary_data.lookup_item.created;
  }

  /**
   * Extend parent method
   */
  update_element() {
    super.update_element();

    if (!this.upload_is_valid()) return;

    const summary_data = this.get_summary_data();
    const summary_card_el = this.get_body_element().querySelector("[name=summary] div.card-body");

    summary_card_el.append(this.constructor.html(`
      <div class="container">
        <span class="fs-5 fw-bold">Lookup Data:</span>
        ${summary_data.lookup_item.created} new, ${summary_data.lookup_item.exists} existing
      </div>
    `));

    const container_el = this.constructor.html(`
      <div class="container">
        <span class="fs-5 fw-bold">Indicator Data:</span>
      </div>
    `);

    if (0 == Object.keys(summary_data.indicator_list).length) {
      container_el.append(this.constructor.html('No indicator data was found.'));
    } else {
      const ul_el = this.constructor.html("<ul></ul>");
      for (const name in summary_data.indicator_list) {
        const indicator = summary_data.indicator_list[name];
        ul_el.append(this.constructor.html(`
          <li>
            <span class="fw-bold">${name}${indicator.new ? " (new)" : ""}</span>:
            adding ${indicator.created}, removing ${indicator.removed} ${this.get_model().get_plural()}
          </li>
        `));
      }
      container_el.append(ul_el);
    }

    summary_card_el.append(container_el);
  }

  /**
   * Extend parent method
   */
  _create_body_element() {
    const body_el = super._create_body_element();

    body_el.prepend(this.constructor.html(`
      <div>
        <div class="text-info-emphasis">
          This utility allows you to upload lookup data from a CSV file.
          The file must contain the following columns:
        </div>
        <div class="text-info-emphasis">
          <ul>
            <li>Identifier</li>
            <li>Name</li>
            <li>Description (may be blank)</li>
            <li>Indicators (semicolon delimited list of indicators, may be blank)</li>
          </ul>
        </div>
      </div>
    `));

    return body_el;
  }
}

export class CN_view_lookup extends CN_action_view {
  /**
   * Extend parent method
   */
  _create_footer_element() {
    const footer_el = super._create_footer_element();

    const upload_btn_el = this.constructor.html(
      '<button type="button" name="upload" class="btn btn-light btn-outline-primary">Upload Data</button>'
    );
    upload_btn_el.addEventListener("click", () => {
      return CN_session.navigate_to(`lookup/upload/${this.get_model().get_identifier()}`)
    });
    footer_el.querySelector("div.btn-group").append(upload_btn_el);

    return footer_el;
  }
}

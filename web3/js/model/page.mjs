const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
const { CN_base_action } = await import(`${CENOZO_URL}/js/action/base_action.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);
const { CN_session } = await import(`${CENOZO_URL}/js/session.mjs`);
import * as i18n_data from "../i18n/page.mjs";
import {
  CN_model_base_qnaire_part,
  CN_clone_base_qnaire_part,
  CN_view_base_qnaire_part
} from "./base_qnaire_part.mjs";

export class CN_model_page extends CN_model_base_qnaire_part {
  constructor() {
    super("page");
  }

  /**
   * Extend parent method
   */
  async clone_columns() {
    const columns = await super.clone_columns();
    CN_common.insert_property(columns, "after", "name", "tabulate", {
      title: "Tabulate",
      type: "boolean",
      help: "Determines whether questions on this page should be organized into a table.",
    });
    CN_common.insert_property(columns, "after", "tabulate", "question_count", {
      title: "Questions",
      table_prefix: false,
    });
    CN_common.insert_property(columns, "after", "question_count", "average_time", {
      title: "Average Time",
      table_prefix: false,
    });
    return columns;
  }

  /**
   * Extend parent method
   */
  async clone_properties() {
    const properties = await super.clone_properties();

    return {
      ...properties,
      ...{
        tabulate: {
          title: "Tabulate",
          type: "boolean",
          help: "Determines whether questions on this page should be organized into a table."
        },
        average_time: {
          title: "Average Time",
          type: "timesecond",
          meta: {},
          is_constant: () => true,
          is_hidden: () => "add" == this.get_action_name(),
        },
        max_time: {
          title: "Max Time (seconds)",
          type: "integer",
          is_hidden: () => "add" == this.get_action_name(),
          is_constant: () => true,
          help: `
            Maximum page time is automatically calculated to exclude major outliers by setting its value to that
            of the outer fence (3 times the interquartile width above the upper quartile).
          `,
        },
        note: { title: "Note", type: "text" },
        qnaire_id: { meta: { table: "module", column: "qnaire_id" }, is_hidden: () => true },
        module_id: { is_hidden: () => true },
      },
    };
  }
}

export class CN_clone_page extends CN_clone_base_qnaire_part {}
export class CN_view_page extends CN_view_base_qnaire_part {
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
      () => CN_session.navigate_to(
        `qnaire/view/${this.get_property_value("qnaire_id")}/` +
        `module/view/${this.get_property_value("module_id")}/` +
        `page/render/${this.get_model().get_identifier()}`
      ),
    );

    return footer_el;
  }
}

export class CN_render_page extends CN_base_action {
  #record;
  #lang = null;
  #hotkey = false;
  #language_list = [];
  #hotkey_btn_el;
  #hotkey_div_el;
  #language_btn_el;

  constructor(parent_el, model) {
    super("render", parent_el, model, i18n_data);
  }

  /**
   * Extend parent method
   */
  t(path, params = {}) {
    return super.t(this.#lang, path, params);
  }

  /**
   * Extend parent method
   */
  async get_text(type) {
    if ("crumb" == type) {
      return `${this.#record.name}: Preview`;
    }

    if ("header" == type) {
      return "";
    }

    return await super.get_text(type);
  }

  /**
   * Extend parent method
   */
  async on_load() {
    this.#record = await CN_api.get(this.get_model().get_view_url(null, "api"), {
      select: { column: [
        "name",
        { table: "page", column: "id", alias: "page_id" },
        { table: "module", column: "id", alias: "module_id" },
        { table: "module", column: "qnaire_id" },
        { table: "base_language", column: "code", alias: "base_language_code" },
      ] }
    });

    if (!this.#lang) this.#lang = this.#record.base_language_code;

    const [language_response] = await Promise.all([
      CN_api.get(`qnaire/${this.#record.qnaire_id}/language`, { select: { column: "code" } }),
    ]);

    this.#language_list = language_response;
  }

  /**
   * Extend parent method
   */
  update_element() {
    super.update_element();

    if (this.#language_btn_el) {
      const btn_el = this.#language_btn_el.querySelector("button");
      const ul_el = this.#language_btn_el.querySelector("ul");
      btn_el.innerHTML = "";
      ul_el.innerHTML = "";
      this.#language_list.forEach(language => {
        const language_name = this.t(`language.${language.code}`);
        const btn_el = this.constructor.html(
          `<button type="button" class="dropdown-item">${language_name}</button>`
        );
        btn_el.addEventListener("click", () => {
          this.#lang = language.code;
          this.update_element();
        });
        const li_el = this.constructor.html("<li></li>");
        li_el.append(btn_el);
        ul_el.append(li_el);

        if (language.code == this.#lang) {
          this.#language_btn_el.querySelector("button.dropdown-toggle").innerHTML = language_name;
        }
      });
    }

    this.#hotkey_btn_el.innerHTML = this.t(`hotkey.${this.#hotkey ? "hide" : "show"}`);
    this.#hotkey_div_el.querySelector("div[name=title]").innerHTML = this.t("hotkey.title");

    const ul_el = this.#hotkey_div_el.querySelector("ul");
    ul_el.innerHTML = "";
    this.t("hotkey.body").forEach(line => {
      if (CN_common.is_array(line)) {
        const subul_el = this.constructor.html("<ul></ul>");
        line.forEach(subline => {
          subul_el.append(this.constructor.html(`<li>${subline}</li>`));
        });
        ul_el.append(subul_el);
      } else {
        ul_el.append(this.constructor.html(`<li>${line}</li>`));
      }
    });
  }

  /**
   * Extend parent method
   */
  _create_element() {
    const el = super._create_element();

    this.#hotkey_div_el = this.constructor.html(`
      <div class="bg-info-subtle px-3 pt-2">
        <div name="title" class="fs-5 fw-bold"></div>
        <ul></ul>
      </div>
    `);
    this.constructor.hide(this.#hotkey_div_el);
    el.querySelector("div.card-header").after(this.#hotkey_div_el);

    return el;
  }

  /**
   * Extend parent method
   */
  _create_header_element() {
    const header_el = super._create_header_element();

    this.#language_btn_el = this.constructor.html(`
      <div name="language" class="dropdown me-2">
        <button
          type="button"
          class="btn btn-light btn-outline-primary dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        ></button>
        <ul class="dropdown-menu">
          <li><button type="button" class="dropdown-item">English</button></li>
          <li><button type="button" class="dropdown-item">French</button></li>
        </ul>
      </div>
    `);
    header_el.querySelector("div").after(this.#language_btn_el);

    this.#hotkey_btn_el = this.constructor.html(
      '<button type="button" class="btn btn-light btn-outline-primary"></button>'
    );
    this.#hotkey_btn_el.addEventListener("click", () => {
      this.#hotkey = !this.#hotkey;
      this.constructor.set_hidden(this.#hotkey_div_el, !this.#hotkey);
      this.#hotkey_btn_el.innerHTML = this.t(`hotkey.${this.#hotkey ? "hide" : "show"}`);
    });
    header_el.querySelector("div").after(this.#hotkey_btn_el);

    return header_el;
  }
}

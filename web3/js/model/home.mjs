const classes = await import(`${CENOZO_URL}/js/model/home.mjs`);
const { CN_base_element } = await import(`${CENOZO_URL}/js/element/base_element.mjs`);
const { CN_session } = await import(`${CENOZO_URL}/js/session.mjs`);

export class CN_model_home extends classes.CN_model_home {
  #respondent_today_model;
  #respondent_model;

  /**
   * Extend parent method
   */
  update_element() {
    super.update_element();

    if ("interviewer" == CN_session.get("role", "name")) {
      if (this.#respondent_today_model) {
        this.get_element().querySelector("div[name=respondent-today-list]").replaceChildren(
          this.#respondent_today_model.get_element()
        );
      }

      if (this.#respondent_model) {
        this.get_element().querySelector("div[name=respondent-list]").replaceChildren(
          this.#respondent_model.get_element()
        );
      }
    }
  }

  /**
   * Extend parent method
   */
  _create_element() {
    const el = super._create_element();
    if ("interviewer" == CN_session.get("role", "name")) {
      el.querySelector("div.row").append(CN_base_element.html(
        '<div name="respondent-today-list" class="mt-4"></div>'
      ));
      el.querySelector("div.row").append(CN_base_element.html(`
        <div name="respondent-list" class="mt-4">
          <div class="text-center">
            <div class="fw-bold fs-4 mb-2">Loading Respondent List...</div>
            <img src="${CENOZO_URL}/img/loading.gif"></img>
          </div>
        </div>
      `));
    }
    return el;
  }

  /**
   * Extend parent method
   */
  async run() {
    if ("interviewer" == CN_session.get("role", "name")) {
      if (!this.#respondent_today_model) {
        const respondent_today_module = CN_session.get_module("respondent");
        await respondent_today_module.load_classes();
        this.#respondent_today_model = respondent_today_module.create_model();
        await this.#respondent_today_model.configure(
          this.get_element().querySelector("div.row"),
          "list",
          null,
          null,
          true
        );
        this.#respondent_today_model.get_action().set_today_only(true);
      }

      if (!this.#respondent_model) {
        const respondent_module = CN_session.get_module("respondent");
        await respondent_module.load_classes();
        this.#respondent_model = respondent_module.create_model();
        await this.#respondent_model.configure(
          this.get_element().querySelector("div.row"),
          "list",
          null,
          null,
          true
        );
      }

      await this.#respondent_today_model.run();
      await this.#respondent_model.run();
    }

    await super.run();
  }
}

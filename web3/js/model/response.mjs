const { CN_action_view } = await import(`${CENOZO_URL}/js/action/view.mjs`);
const { CN_api } = await import(`${CENOZO_URL}/js/api.mjs`);
const { CN_base_action } = await import(`${CENOZO_URL}/js/action/base_action.mjs`);
const { CN_base_model } = await import(`${CENOZO_URL}/js/model/base_model.mjs`);
const { CN_common } = await import(`${CENOZO_URL}/js/common.mjs`);
const { CN_session } = await import(`${CENOZO_URL}/js/session.mjs`);

export class CN_model_response extends CN_base_model {
  constructor() {
    super({
      wording: {
        singular: "response",
        plural: "responses",
        posessive: "response's",
      },
      columns: {
        rank: { column: "response.rank", title: "Rank", type: "rank" },
        qnaire_version: { title: "Version" },
        interview_type: { title: "Type" },
        language: { column: "language.code", title: "Language" },
        submitted: { title: "Submitted", type: "boolean" },
        checked_in: { title: "Checked In", type: "boolean" },
        qnaire_progress: { title: "Progress", table_prefix: false },
        module: { column: "module.name", title: "Module" },
        page: { column: "page.name", title: "Page" },
        time_spent: { title: "Time Spent", type: "timesecond" },
        start_datetime: { column: "response.start_datetime", title: "Start", type: "datetime" },
        last_datetime: { column: "response.start_datetime", title: "Last", type: "datetime" },
      },
      properties: {
        uid: {
          meta: { table: "participant", column: "uid" },
          title: "Participant",
          meta: { table: "participant", column: "uid" },
          is_constant: () => true,
        },
        rank: { title: "rank", type: "rank", is_constant: () => true },
        qnaire_version: { title: "Questionnaire Version", is_constant: () => true },
        interview_type: {
          title: "Interview Type",
          is_constant: () => true,
          is_hidden: () => {
            const root_model = CN_session.get_root_model();
            return (
              "view" != this.get_action_name() ||
              !root_model ||
              !root_model.get_action().get_property_value("stages")
            );
          },
        },
        language_id: {
          meta: { table: "response", column: "language_id" },
          title: "Language",
          type: "enum",
          enum: {
            path: "language",
            modifier: {
              where: { column: "active", operator: "=", value: true },
              order: "language.name",
            },
          },
        },
        submitted: { title: "Submitted", type: "boolean", is_constant: () => true },
        checked_in: { title: "Checked In", type: "boolean", is_constant: () => true },
        qnaire_progress: { title: "Progress", meta: {}, is_constant: () => true },
        module: { meta: { table: "module", column: "name" }, title: "Module", is_constant: () => true },
        page: { meta: { table: "page", column: "name" }, title: "Page", is_constant: () => true },
        start_datetime: { title: "Start Date & Time", type: "datetime", is_constant: () => true },
        last_datetime: { title: "Last Date & Time", type: "datetime", is_constant: () => true },
        comments: { title: "Comments", type: "text" },
      },
    });
  }

  /**
   * Extend parent method
   */
  get_child_model_list() {
    if ("qnaire" != CN_session.get_root_name()) return super.get_child_model_list();

    const qnaire_action = CN_session.get_root_model().get_action();
    const stages = qnaire_action.get_property_value("stages");
    const has_devices = qnaire_action.get_property_value("has_devices");
    return super.get_child_model_list().filter(model =>
      (!["response_stage", "answer_device"].includes(model.get_name())) ||
      // show stage list if the qnaire has stages
      ("response_stage" == model.get_name() && stages) ||
      // show device list if the qnaire has devices and the qnaire is only answered once
      ("answer_device" == model.get_name() && has_devices)
    );
  }
}

export class CN_display_response extends CN_base_action {
  #uid = null;
  #qnaire_name = null;
  #repeated = null;
  #rank = null;
  #answers = [];

  constructor(parent_el, model) {
    super("display", parent_el, model);
  }

  /**
   * Extend parent method
   */
  async get_text(type) {
    if ("crumb" == type) {
      return `Display${this.#repeated ? ` ${CN_common.ordinal_suffix(this.#rank)} Response` : ""}`;
    }

    if ("header" == type) {
      return `${this.#qnaire_name}: ${this.#uid}${
        this.#repeated ?
        ` (${CN_common.ordinal_suffix(this.#rank)} Response)` :
        ""
      }`;
    }

    return await super.get_text(type);
  }

  /**
   * Extend parent method
   */
  async on_load() {
    const model = this.get_model();
    const [response, answers] = await Promise.all([
      CN_api.get(model.get_view_url(null, "api"), {
        select: {
          column: [
            { table: "participant", column: "uid" },
            { table: "qnaire", column: "name" },
            { table: "qnaire", column: "repeated" },
            "rank",
          ]
        }
      }),
      CN_api.get(`response/${model.get_identifier()}/question`),
    ]);

    this.#uid = response.uid;
    this.#qnaire_name = response.name;
    this.#repeated = response.repeated;
    this.#rank = response.rank;
    this.#answers = answers;
  }

  /**
   * Extend parent method
   */
  update_element() {
    super.update_element();

    // display all answers
    const body_el = this.get_body_element();
    body_el.innerHTML = "";

    const modules_el = this.constructor.html('<div name="modules"></div>');
    body_el.append(modules_el);
    this.#answers.forEach(module => {
      if (module.description) {
        modules_el.append(this.constructor.html(`<div name="description">${module.description}</div>`));
      }
      if (0 < module.page_list.length) {
        const pages_el = this.constructor.html('<div name="pages" class="my-2"></div>');
        modules_el.append(pages_el);
        module.page_list.forEach(page => {
          if (page.description) {
            pages_el.append(this.constructor.html(`<div name="description">${page.description}</div>`));
          }
          if (0 < page.question_list.length) {
            const questions_el = this.constructor.html('<div name="questions" class="my-2"></div>');
            pages_el.append(questions_el);
            page.question_list.forEach(question => {
              const question_el = this.constructor.html('<div name="question" class="my-2"></div>');
              questions_el.append(question_el);
              if (question.description) {
                question_el.append(this.constructor.html(
                  `<span name="description">${question.description}</span>`
                ));
                if ("signature" == question.type) {
                  if (question.file) {
                    question_el.append(this.constructor.html(`<img class="w-100" src="${question.file}"></img>`));
                  } else {
                    question_el.append(this.constructor.html(`
                      <span name="answer" class="ms-2 py-1 px-2 border border-2 border-primary fw-bold">
                        (file is missing)
                      </span>
                    `));
                  }
                } else if (question.type.match(/^audio/)) {
                  if (question.file) {
                    question_el.append(this.constructor.html(`
                      <audio controls class="w-100" style="height: 40px;" src="${question.file}"></audio>
                    `));
                  } else {
                    question_el.append(this.constructor.html(`
                      <span name="answer" class="ms-2 py-1 px-2 border border-2 border-primary fw-bold">
                        (file is missing)
                      </span>
                    `));
                  }
                } else if ("list" == question.type) {
                  if (0 < question.option_list.length) {
                    const options_el = this.constructor.html('<div name="options" class="my-2"></div>');
                    question_el.append(options_el);
                    question.option_list.forEach(option => {
                      const option_el = this.constructor.html('<div name="option"></div>');
                      options_el.append(option_el);
                      if (option.description) {
                        option_el.append(this.constructor.html(`
                          <span name="description" class="ms-4">
                            <i class="bi bi-${option.selected ? "x-square" : "square"}"></i>
                            ${option.description}
                            ${
                              option.value ?
                              `
                                <span class="ms-2 py-1 px-2 border border-2 border-primary fw-bold">
                                  ${option.value}
                                </span>
                              ` :
                              ""
                            }
                          </span>
                        `));
                      }
                    });
                  }
                } else if (!["comment", "device", "list"].includes(question.type)) {
                  question_el.append(this.constructor.html(`
                    <span name="answer" class="ms-2 py-1 px-2 border border-2 border-primary fw-bold">
                      ${null == question.answer ? "(empty)" : question.answer}
                    </span>
                  `));
                }
              }
            });
          }
        });
      }
    });

  }

  /**
   * Extend parent method
   */
  _create_body_element() {
    return this.constructor.html('<div></div>');
  }
}

export class CN_view_response extends CN_action_view {
  /**
   * Extend parent method
   */
  async get_text(type) {
    if ("crumb" == type) {
      return CN_common.ordinal_suffix(this.get_property_value("rank"));
    }
    return await super.get_text(type);
  }
}

cenozoApp.defineModule({
  name: "response",
  models: ["add", "list", "view"],
  defaultTab: "attribute",
  create: (module) => {
    angular.extend(module, {
      identifier: {
        parent: {
          subject: "respondent",
          column: "respondent.id",
        },
      },
      name: {
        singular: "response",
        plural: "responses",
        possessive: "response's",
      },
      columnList: {
        rank: {
          column: "response.rank",
          title: "Rank",
          type: "rank",
        },
        qnaire_version: {
          title: "Version",
        },
        language: {
          column: "language.code",
          title: "Language",
        },
        submitted: {
          title: "Submitted",
          type: "boolean",
        },
        checked_in: {
          title: "Checked In",
          type: "boolean",
        },
        page_progress: {
          title: "Progress",
        },
        module: {
          column: "module.name",
          title: "Module",
        },
        page: {
          column: "page.name",
          title: "Page",
        },
        time_spent: {
          title: "Time Spent",
          type: "seconds",
        },
        start_datetime: {
          title: "Start",
          type: "datetime",
        },
        last_datetime: {
          title: "Last",
          type: "datetime",
        },
      },
      defaultOrder: {
        column: "start_datetime",
        reverse: true,
      },
    });

    module.addInputGroup("", {
      uid: {
        column: "participant.uid",
        title: "Participant",
        type: "string",
        isConstant: true,
      },
      rank: {
        title: "rank",
        type: "rank",
        isConstant: true,
      },
      qnaire_version: {
        title: "Questionnaire Version",
        type: "string",
        isConstant: true,
      },
      language_id: {
        column: "response.language_id",
        title: "Language",
        type: "enum",
      },
      submitted: {
        title: "Submitted",
        type: "boolean",
        isConstant: true,
      },
      checked_in: {
        title: "Checked In",
        type: "boolean",
        isConstant: true,
      },
      page_progress: {
        title: "Page Progress",
        type: "string",
        isConstant: true,
      },
      module: {
        column: "module.name",
        title: "Module",
        type: "string",
        isConstant: true,
      },
      page: {
        column: "page.name",
        title: "Page",
        type: "string",
        isConstant: true,
      },
      start_datetime: {
        title: "Start Date & Time",
        type: "datetime",
        isConstant: true,
      },
      last_datetime: {
        title: "Last Date & Time",
        type: "datetime",
        isConstant: true,
      },
      comments: {
        title: "Comments",
        type: "text",
      },
      page_id: { isExcluded: true },
      qnaire_id: { column: "qnaire.id", isExcluded: true },
      lang: { column: "language.code", isExcluded: true },
      respondent_id: { column: "respondent.id", isExcluded: true },
    });

    module.addExtraOperation("view", {
      title: "Display",
      operation: async function ($state, model) {
        await $state.go("response.display", {
          identifier: model.viewModel.record.getIdentifier(),
        });
      },
    });

    /* ############################################################################################## */
    cenozo.providers.directive("cnResponseDisplay", [
      "CnResponseModelFactory",
      "CnSession",
      "$state",
      function (CnResponseModelFactory, CnSession, $state) {
        return {
          templateUrl: module.getFileUrl("display.tpl.html"),
          restrict: "E",
          scope: { model: "=?" },
          controller: async function ($scope) {
            if (angular.isUndefined($scope.model))
              $scope.model = CnResponseModelFactory.root;

            await $scope.model.displayModel.onLoad();

            CnSession.setBreadcrumbTrail([
              {
                title: "Respondent",
                go: async function () {
                  await $state.go("respondent.list");
                },
              },
              {
                title: $scope.model.displayModel.respondent_id,
                go: async function () {
                  await $state.go("respondent.view", {
                    identifier: $scope.model.displayModel.respondent_id,
                  });
                },
              },
              {
                title: "Responses",
              },
              {
                title: $scope.model.displayModel.rank,
                go: async function () {
                  await $state.go("response.view", {
                    identifier: $scope.model.displayModel.response_id,
                  });
                },
              },
              {
                title: "display",
              },
            ]);
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnResponseDisplayFactory", [
      "CnHttpFactory",
      "CnTranslationHelper",
      function (CnHttpFactory, CnTranslationHelper) {
        var object = function (parentModel) {
          var dknaPrompts = {
            en: CnTranslationHelper.translate("misc.dkna", "en"),
            fr: CnTranslationHelper.translate("misc.dkna", "fr"),
          };
          var refusePrompts = {
            en: CnTranslationHelper.translate("misc.refuse", "en"),
            fr: CnTranslationHelper.translate("misc.refuse", "fr"),
          };

          angular.extend(this, {
            parentModel: parentModel,
            languageList: [],
            moduleList: [],
            questionList: [],
            onLoad: async function () {
              // get a list of all modules
              var response = await CnHttpFactory.instance({
                path:
                  "response/" +
                  this.parentModel.getQueryParameter("identifier"),
                data: {
                  select: {
                    column: [
                      "respondent_id",
                      "rank",
                      { table: "respondent", column: "qnaire_id" },
                      { table: "language", column: "code", alias: "lang" },
                    ],
                  },
                },
              }).get();

              this.response_id = response.data.id;
              this.respondent_id = response.data.respondent_id;
              this.rank = response.data.rank;
              this.qnaire_id = response.data.qnaire_id;
              this.lang = response.data.lang;

              // get a list of the qnaires languages
              var [
                languageResponse,
                moduleResponse,
                pageResponse,
                questionResponse,
                optionResponse,
              ] = await Promise.all([
                CnHttpFactory.instance({
                  path: ["qnaire", this.qnaire_id, "language"].join("/"),
                  data: { select: { column: ["code", "name"] } },
                }).get(),

                CnHttpFactory.instance({
                  path: "module",
                  data: {
                    select: { column: ["id", "prompts"] },
                    modifier: {
                      where: {
                        column: "qnaire.id",
                        operator: "=",
                        value: this.qnaire_id,
                      },
                      order: "module.rank",
                    },
                    limit: 1000000, // get all records
                  },
                }).query(),

                CnHttpFactory.instance({
                  path: "page",
                  data: {
                    select: { column: ["id", "module_id", "prompts"] },
                    modifier: {
                      where: {
                        column: "qnaire.id",
                        operator: "=",
                        value: this.qnaire_id,
                      },
                      order: ["module.rank", "page.rank"],
                      limit: 1000000, // get all records
                    },
                  },
                }).query(),

                CnHttpFactory.instance({
                  path: [
                    "response",
                    this.parentModel.getQueryParameter("identifier"),
                    "question",
                  ].join("/"),
                  data: {
                    select: {
                      column: [
                        "id",
                        "page_id",
                        "prompts",
                        "type",
                        "dkna_allowed",
                        "refuse_allowed",
                        { table: "page", column: "module_id" },
                        {
                          table: "language",
                          column: "code",
                          alias: "language",
                        },
                        { table: "answer", column: "value" },
                      ],
                    },
                    modifier: {
                      order: ["module.rank", "page.rank", "question.rank"],
                      limit: 1000000, // get all records
                    },
                  },
                }).query(),

                CnHttpFactory.instance({
                  path: "question_option",
                  data: {
                    select: {
                      column: [
                        "id",
                        "question_id",
                        "prompts",
                        { table: "module", column: "id", alias: "module_id" },
                        { table: "page", column: "id", alias: "page_id" },
                      ],
                    },
                    modifier: {
                      where: {
                        column: "qnaire.id",
                        operator: "=",
                        value: this.qnaire_id,
                      },
                      order: [
                        "module.rank",
                        "page.rank",
                        "question.rank",
                        { "question_option.rank": true },
                      ],
                      limit: 1000000, // get all records
                    },
                  },
                }).query(),
              ]);

              this.languageList = languageResponse.data;

              this.moduleList = moduleResponse.data.map((module) => {
                module.prompts = CnTranslationHelper.parseDescriptions(
                  module.prompts
                );
                module.pageList = [];
                return module;
              });

              pageResponse.data.forEach((page) => {
                // store each page in its parent module
                page.prompts = CnTranslationHelper.parseDescriptions(
                  page.prompts
                );
                page.questionList = [];
                this.moduleList
                  .findByProperty("id", page.module_id)
                  .pageList.push(page);
              });

              await Promise.all(
                questionResponse.data.reduce((list, question) => {
                  question.prompts = CnTranslationHelper.parseDescriptions(
                    question.prompts
                  );
                  question.value = angular.fromJson(question.value);
                  if (null != question.value) {
                    // ignore questions which weren't answered
                    if ("list" == question.type) {
                      question.optionList = [];
                    } else if ("audio" == question.type) {
                      // audio needs to be converted to an object URL
                      if (null != question.value) {
                        // convert base64 to blob
                        list.push(
                          (async () => {
                            const base64Response = await fetch(question.value);
                            question.value = await base64Response.blob();

                            // convert blob to object URL
                            question.value = window.URL.createObjectURL(
                              question.value
                            );
                          })()
                        );
                      }
                    } else {
                      if (angular.isObject(question.value)) {
                        if (question.value.dkna) {
                          question.value = CnTranslationHelper.translate(
                            "misc.dkna",
                            this.lang
                          );
                        } else if (question.value.refuse) {
                          question.value = CnTranslationHelper.translate(
                            "misc.refuse",
                            this.lang
                          );
                        }
                      } else if ("boolean" == question.type) {
                        if (true === question.value) question.value = "Yes";
                        else if (false === question.value)
                          question.value = "No";
                      }
                    }

                    // store each question in its parent page
                    this.moduleList
                      .findByProperty("id", question.module_id)
                      .pageList.findByProperty("id", question.page_id)
                      .questionList.push(question);
                  }

                  return list;
                }, [])
              );

              optionResponse.data.forEach((option) => {
                option.prompts = CnTranslationHelper.parseDescriptions(
                  option.prompts
                );

                // store each option in its parent question, but ignore any questions which aren't found since it means
                // the respondent never answered that question
                var question = this.moduleList
                  .findByProperty("id", option.module_id)
                  .pageList.findByProperty("id", option.page_id)
                  .questionList.findByProperty("id", option.question_id);
                if (null != question) {
                  // first make sure the dkna/refuse options are included
                  if (0 == question.optionList.length) {
                    if (question.dkna_allowed) {
                      question.optionList.push({
                        prompts: dknaPrompts,
                        value: null,
                        selected:
                          angular.isObject(question.value) &&
                          question.value.dkna,
                      });
                    }
                    if (question.refuse_allowed) {
                      question.optionList.push({
                        prompts: refusePrompts,
                        value: null,
                        selected:
                          angular.isObject(question.value) &&
                          question.value.refuse,
                      });
                    }
                  }

                  question.optionList.unshift(option);
                  option.selected = false;
                  option.value = null;
                  if (angular.isArray(question.value)) {
                    var matchedValue = null;
                    if (
                      question.value.some((value) => {
                        matchedValue = value;
                        return (
                          (angular.isObject(value) && value.id == option.id) ||
                          (!angular.isObject(value) && value == option.id)
                        );
                      })
                    ) {
                      option.selected = true;
                      if (angular.isObject(matchedValue)) {
                        option.value = angular.isArray(matchedValue.value)
                          ? matchedValue.value.join("; ")
                          : matchedValue.value;
                      }
                    } else {
                      var obj = question.value.findByProperty("id", option.id);
                      if (null != obj) {
                        option.selected = true;
                        option.value = obj.value;
                      }
                    }
                  }
                }
              });

              // now remove empty modules and pages
              this.moduleList.forEach((module, mIndex) => {
                module.pageList = module.pageList.filter(
                  (page) => 0 < page.questionList.length
                );
              });
              this.moduleList = this.moduleList.filter(
                (module) => 0 < module.pageList.length
              );
            },
          });
        };
        return {
          instance: function (parentModel) {
            return new object(parentModel);
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnResponseViewFactory", [
      "CnBaseViewFactory",
      function (CnBaseViewFactory) {
        var object = function (parentModel, root) {
          CnBaseViewFactory.construct(
            this,
            parentModel,
            root,
            "response_attribute"
          );

          this.getChildList = function () {
            // show stage list if the qnaire has stages
            return this.$$getChildList().filter(
              (child) =>
                "response_stage" != child.subject.snake || this.record.stages
            );
          };
        };
        return {
          instance: function (parentModel, root) {
            return new object(parentModel, root);
          },
        };
      },
    ]);

    /* ############################################################################################## */
    cenozo.providers.factory("CnResponseModelFactory", [
      "CnBaseModelFactory",
      "CnResponseDisplayFactory",
      "CnResponseListFactory",
      "CnResponseViewFactory",
      "CnHttpFactory",
      function (
        CnBaseModelFactory,
        CnResponseDisplayFactory,
        CnResponseListFactory,
        CnResponseViewFactory,
        CnHttpFactory
      ) {
        var object = function (root) {
          CnBaseModelFactory.construct(this, module);
          this.displayModel = CnResponseDisplayFactory.instance(this);
          this.listModel = CnResponseListFactory.instance(this);
          this.viewModel = CnResponseViewFactory.instance(this, root);

          this.getMetadata = async function () {
            await this.$$getMetadata();

            var response = await CnHttpFactory.instance({
              path: "language",
              data: {
                select: { column: ["id", "name"] },
                modifier: {
                  where: { column: "active", operator: "=", value: true },
                  order: "name",
                  limit: 1000,
                },
              },
            }).query();

            this.metadata.columnList.language_id.enumList =
              response.data.reduce((list, item) => {
                list.push({ value: item.id, name: item.name });
                return list;
              }, []);
          };
        };

        return {
          root: new object(true),
          instance: function () {
            return new object(false);
          },
        };
      },
    ]);
  },
});
